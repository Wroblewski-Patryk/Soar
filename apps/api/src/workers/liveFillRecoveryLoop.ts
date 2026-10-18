import { randomUUID } from 'node:crypto';
import { createClient } from 'redis';
import { findLiveFillCandidatePage, type LiveFillCandidate } from '../modules/orders/orders.liveFillCandidates.service';
import { lookupLiveFillCandidate, type LiveFillLookupResult } from '../modules/exchange/liveFillLookup.service';
import { recoverLiveFillCandidateOnce } from '../modules/orders/orders.liveFillRecovery.service';
import { findRuntimeCacheRepairPage, repairRuntimePositionCacheOnce } from
  '../modules/engine/runtimePositionCacheRepair.service';

type RedisClient = ReturnType<typeof createClient>;
type CursorState = { intentCursor: string | null; orderCursor: string | null;
  intentDone: boolean; orderDone: boolean };
type RepairScanState = { cursor: string | null; backlog: string[];
  startedAt: number; lastCompletedAt: number | null; visitedCount: number };
type RepairCoverage = { complete: boolean; scanAgeMs: number | null;
  lastFullScanAgeMs: number | null; visitedCount: number };
type RecoveryOutcome = Awaited<ReturnType<typeof recoverLiveFillCandidateOnce>>;
type Dependencies = {
  lookup?: (candidate: LiveFillCandidate) => Promise<LiveFillLookupResult>;
  finalize?: (candidate: LiveFillCandidate,
    found: Extract<LiveFillLookupResult, { kind: 'FOUND' }>) => Promise<RecoveryOutcome>;
  acceptCandidate?: (candidate: LiveFillCandidate) => boolean;
  scanUserId?: string;
  onEvent?: (event: string, detail?: string) => void;
};
type Options = {
  redisUrl?: string; namespace?: string; intervalMs?: number; leaseMs?: number;
  pageLimit?: number; maxPages?: number; minGapMs?: number; lookupTimeoutMs?: number;
  appliedCooldownMs?: number;
  repairPageLimit?: number; repairMaxPages?: number;
};

const emptyCursor = (): CursorState => ({ intentCursor: null, orderCursor: null,
  intentDone: false, orderDone: false });
const clamp = (value: number | undefined, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.max(min, Math.min(max, Math.floor(value!))) : fallback;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const parseCandidate = (raw: string): LiveFillCandidate | null => {
  try {
    const value = JSON.parse(raw) as LiveFillCandidate;
    const createdAt = new Date(value.createdAt);
    if (!value.orderId || !value.userId || !Number.isFinite(createdAt.getTime())) return null;
    return { ...value, createdAt };
  } catch { return null; }
};
const emptyRepairScan = (): RepairScanState => ({ cursor: null, backlog: [],
  startedAt: Date.now(), lastCompletedAt: null, visitedCount: 0 });
const parseRepairScan = (raw: string | null): RepairScanState => {
  if (!raw) return emptyRepairScan();
  try {
    const value = JSON.parse(raw) as RepairScanState;
    if ((value.cursor === null || typeof value.cursor === 'string') &&
        Array.isArray(value.backlog) && value.backlog.every((id) => typeof id === 'string') &&
        Number.isFinite(value.startedAt) &&
        (value.lastCompletedAt === null || Number.isFinite(value.lastCompletedAt)) &&
        Number.isSafeInteger(value.visitedCount) && value.visitedCount >= 0) return value;
  } catch { /* Damaged progress loses coverage evidence, then starts over. */ }
  return emptyRepairScan();
};
const coverage = (state: RepairScanState, complete: boolean, now: number): RepairCoverage => ({
  complete,
  scanAgeMs: complete ? null : Math.max(0, now - state.startedAt),
  lastFullScanAgeMs: state.lastCompletedAt == null ? null :
    Math.max(0, now - state.lastCompletedAt),
  visitedCount: state.visitedCount,
});

const OWNED_SET = `if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[2], ARGV[2]); return 1`;
const OWNED_PENDING = `if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
redis.call('HSET', KEYS[2], ARGV[2], ARGV[3]);
redis.call('ZADD', KEYS[3], ARGV[4], ARGV[2]);
redis.call('ZADD', KEYS[4], 'NX', ARGV[5], ARGV[2]); return 1`;
const OWNED_REMOVE = `if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
redis.call('HDEL', KEYS[2], ARGV[2]); redis.call('ZREM', KEYS[3], ARGV[2]);
redis.call('ZREM', KEYS[4], ARGV[2]); return 1`;
const OWNED_STATUS = `if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[2], ARGV[2], 'PX', ARGV[3]); return 1`;
const OWNED_REPAIR_PENDING = `if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
if ARGV[2] == 'add' then redis.call('ZADD', KEYS[2], 'NX', ARGV[3], ARGV[4])
else redis.call('ZREM', KEYS[2], ARGV[4]) end; return 1`;
const OWNED_RENEW = `if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
return redis.call('PEXPIRE', KEYS[1], ARGV[2])`;
const OWNED_RELEASE = `if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
return redis.call('DEL', KEYS[1])`;

export class LiveFillRecoveryLoop {
  private readonly namespace: string;
  private readonly intervalMs: number;
  private readonly leaseMs: number;
  private readonly pageLimit: number;
  private readonly maxPages: number;
  private readonly minGapMs: number;
  private readonly lookupTimeoutMs: number;
  private readonly appliedCooldownMs: number;
  private readonly repairPageLimit: number;
  private readonly repairMaxPages: number;
  private readonly deps: Dependencies;
  private redis: RedisClient | null = null;
  private timer: NodeJS.Timeout | null = null;
  private inFlight: Promise<void> | null = null;
  private outstandingLookup: Promise<LiveFillLookupResult> | null = null;
  private running = false;
  private stopping = false;
  private repairCoverage: { open: RepairCoverage; cache: RepairCoverage } | null = null;

  constructor(options: Options = {}, deps: Dependencies = {}) {
    this.namespace = options.namespace ?? 'soar:live-fill-recovery:v1';
    this.intervalMs = clamp(options.intervalMs, 60_000, 1_000, 600_000);
    this.leaseMs = clamp(options.leaseMs, 120_000, 2_000, 600_000);
    this.pageLimit = clamp(options.pageLimit, 5, 1, 50);
    this.maxPages = clamp(options.maxPages, 2, 1, 10);
    this.minGapMs = clamp(options.minGapMs, 1_000, 0, 10_000);
    this.lookupTimeoutMs = clamp(options.lookupTimeoutMs, 20_000, 500, 60_000);
    this.appliedCooldownMs = clamp(options.appliedCooldownMs, 30_000, 100, 600_000);
    this.repairPageLimit = clamp(options.repairPageLimit, 25, 1, 100);
    this.repairMaxPages = clamp(options.repairMaxPages, 2, 1, 10);
    this.redisUrl = options.redisUrl ?? process.env.REDIS_URL ?? 'redis://localhost:6379';
    this.deps = deps;
  }
  private readonly redisUrl: string;
  private key(name: string) { return `${this.namespace}:${name}`; }
  private log(event: string, detail?: string) { this.deps.onEvent?.(event, detail); }

  private async client() {
    if (this.redis?.isOpen) return this.redis;
    const client = createClient({ url: this.redisUrl,
      socket: { connectTimeout: 5_000, reconnectStrategy: false } });
    client.on('error', () => undefined);
    try { await client.connect(); }
    catch (error) { await client.disconnect().catch(() => undefined); throw error; }
    this.redis = client;
    return client;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.stopping = false;
    const schedule = () => {
      if (!this.running) return;
      this.timer = setTimeout(() => {
        this.inFlight = this.runOnce().catch((error) => {
          this.log('cycle_failed', error instanceof Error ? error.message : 'unknown_error');
        }).finally(() => { this.inFlight = null; schedule(); });
      }, this.intervalMs);
    };
    this.inFlight = this.runOnce().catch((error) => {
      this.log('cycle_failed', error instanceof Error ? error.message : 'unknown_error');
    }).finally(() => { this.inFlight = null; schedule(); });
  }

  async stop() {
    this.stopping = true;
    this.running = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    await this.inFlight;
    const client = this.redis;
    this.redis = null;
    if (client?.isOpen) await client.quit().catch(() => client.disconnect());
  }

  private async readCursor(redis: RedisClient): Promise<CursorState> {
    const raw = await redis.get(this.key('cursor'));
    if (!raw) return emptyCursor();
    try {
      const parsed = JSON.parse(raw) as CursorState;
      if (typeof parsed.intentDone === 'boolean' && typeof parsed.orderDone === 'boolean') return parsed;
    } catch { /* Restart from the beginning when cursor evidence is damaged. */ }
    return emptyCursor();
  }

  private async owned(redis: RedisClient, token: string) {
    return !this.stopping && await redis.get(this.key('lease')) === token;
  }

  private async writeCursor(redis: RedisClient, token: string, cursor: CursorState) {
    return Number(await redis.eval(OWNED_SET, { keys: [this.key('lease'), this.key('cursor')],
      arguments: [token, JSON.stringify(cursor)] })) === 1;
  }

  private async markPending(redis: RedisClient, token: string, candidate: LiveFillCandidate,
    nextAt = Date.now()) {
    return Number(await redis.eval(OWNED_PENDING, { keys: [this.key('lease'),
      this.key('pending:data'), this.key('pending:due'), this.key('pending:created')],
      arguments: [token, candidate.orderId, JSON.stringify(candidate), String(nextAt),
        String(Date.now())] })) === 1;
  }

  private async clearPending(redis: RedisClient, token: string, orderId: string) {
    return Number(await redis.eval(OWNED_REMOVE, { keys: [this.key('lease'),
      this.key('pending:data'), this.key('pending:due'), this.key('pending:created')],
      arguments: [token, orderId] })) === 1;
  }

  private async duePending(redis: RedisClient) {
    const ids = await redis.sendCommand(['ZRANGEBYSCORE', this.key('pending:due'), '-inf',
      String(Date.now()), 'LIMIT', '0', String(this.pageLimit)]);
    return Array.isArray(ids) ? ids as string[] : [];
  }

  private async cooldown(redis: RedisClient, candidate: LiveFillCandidate,
    outcome: 'APPLIED' | 'UNKNOWN' | 'ERROR', reason?: string) {
    const attemptKey = this.key(`attempt:${candidate.orderId}`);
    const attempt = outcome === 'APPLIED' ? 0 : await redis.incr(attemptKey);
    if (outcome === 'APPLIED') await redis.del(attemptKey);
    else await redis.expire(attemptKey, 86_400);
    if (outcome !== 'APPLIED') await redis.hIncrBy(this.key('stats'),
      outcome === 'UNKNOWN' ? 'unknown_total' : 'error_total', 1);
    const base = outcome === 'APPLIED' ? this.appliedCooldownMs :
      reason === 'IDENTITY_CHANGED' || reason === 'ACCOUNT_UNAVAILABLE' ? 300_000 : 60_000;
    const delay = Math.min(3_600_000, base * 2 ** Math.min(attempt, 6));
    await redis.set(this.key(`cool:${candidate.orderId}`), '1', { PX: delay });
    return delay;
  }

  private async lookupWithTimeout(candidate: LiveFillCandidate): Promise<LiveFillLookupResult> {
    if (this.outstandingLookup) throw new Error('LOOKUP_STILL_RUNNING');
    let timer: NodeJS.Timeout | null = null;
    const operation = Promise.resolve().then(() =>
      (this.deps.lookup ?? lookupLiveFillCandidate)(candidate));
    this.outstandingLookup = operation;
    void operation.finally(() => {
      if (this.outstandingLookup === operation) this.outstandingLookup = null;
    }).catch(() => undefined);
    try {
      return await Promise.race([
        operation,
        new Promise<LiveFillLookupResult>((_, reject) => {
          timer = setTimeout(() => reject(new Error('LOOKUP_TIMEOUT')), this.lookupTimeoutMs);
        }),
      ]);
    } finally { if (timer) clearTimeout(timer); }
  }

  private async processCandidate(redis: RedisClient, token: string,
    candidate: LiveFillCandidate, pending: boolean) {
    if (!await this.owned(redis, token)) return false;
    if (this.deps.acceptCandidate && !this.deps.acceptCandidate(candidate)) return true;
    if (await redis.exists(this.key(`cool:${candidate.orderId}`))) return true;
    let lookup: LiveFillLookupResult;
    try { lookup = await this.lookupWithTimeout(candidate); }
    catch { lookup = { kind: 'UNKNOWN', candidate, reason: 'LOOKUP_FAILED' }; }
    if (!await this.owned(redis, token)) return false;
    if (lookup.kind === 'UNKNOWN') {
      const delay = await this.cooldown(redis, candidate, 'UNKNOWN', lookup.reason);
      if (pending) await this.markPending(redis, token, candidate, Date.now() + delay);
      this.log('unknown', lookup.reason);
      if (this.minGapMs) await wait(this.minGapMs);
      return true;
    }
    if (!pending && !await this.markPending(redis, token, candidate)) return false;
    if (!await this.owned(redis, token)) return false;
    try {
      const result = await (this.deps.finalize ?? ((item, found) =>
        recoverLiveFillCandidateOnce({ candidate: item, lookup: async () => found })))(candidate, lookup);
      if (!await this.owned(redis, token)) return false;
      const delay = await this.cooldown(redis, candidate,
        result.kind === 'APPLIED' ? 'APPLIED' : 'UNKNOWN',
        result.kind === 'UNKNOWN' ? result.reason : undefined);
      if (result.kind === 'APPLIED') await this.clearPending(redis, token, candidate.orderId);
      else await this.markPending(redis, token, candidate, Date.now() + delay);
      this.log(result.kind.toLowerCase(), result.kind === 'UNKNOWN' ? result.reason : undefined);
    } catch (error) {
      if (!await this.owned(redis, token)) return false;
      const delay = await this.cooldown(redis, candidate, 'ERROR');
      await this.markPending(redis, token, candidate, Date.now() + delay);
      this.log('finalize_failed', error instanceof Error ? error.message : 'unknown_error');
    }
    if (this.minGapMs) await wait(this.minGapMs);
    return true;
  }

  private async publishStatus(redis: RedisClient, token: string,
    status: 'healthy' | 'degraded') {
    const [pendingCount, oldest, stats, repairPendingCount, repairOldest] = await Promise.all([
      redis.zCard(this.key('pending:due')),
      redis.sendCommand(['ZRANGE', this.key('pending:created'), '0', '0', 'WITHSCORES']),
      redis.hGetAll(this.key('stats')),
      redis.zCard(this.key('repair:pending')),
      redis.sendCommand(['ZRANGE', this.key('repair:pending'), '0', '0', 'WITHSCORES']),
    ]);
    const oldestScore = Array.isArray(oldest) && oldest.length >= 2 ? Number(oldest[1]) : null;
    const repairScore = Array.isArray(repairOldest) && repairOldest.length >= 2
      ? Number(repairOldest[1]) : null;
    const now = Date.now();
    const openCoverage = this.repairCoverage?.open ?? null;
    const cacheCoverage = this.repairCoverage?.cache ?? null;
    const discoveryComplete = openCoverage?.complete === true && cacheCoverage?.complete === true;
    const maxCoverageAgeMs = Math.max(180_000, this.intervalMs * 3);
    const discoveryRecent = discoveryComplete &&
      openCoverage.lastFullScanAgeMs != null &&
      openCoverage.lastFullScanAgeMs <= maxCoverageAgeMs &&
      cacheCoverage.lastFullScanAgeMs != null &&
      cacheCoverage.lastFullScanAgeMs <= maxCoverageAgeMs;
    const snapshot = { status: status === 'healthy' && repairPendingCount === 0 &&
        discoveryRecent ? 'healthy' : 'degraded',
      updatedAt: now, pendingCount,
      oldestPendingAgeMs: oldestScore != null && Number.isFinite(oldestScore)
        ? Math.max(0, now - oldestScore) : null,
      cacheRepairPendingCount: repairPendingCount,
      oldestCacheRepairAgeMs: repairScore != null && Number.isFinite(repairScore)
        ? Math.max(0, now - repairScore) : null,
      cacheRepairDiscovery: { complete: discoveryComplete,
        maxCoverageAgeMs, openPositions: openCoverage, cacheKeys: cacheCoverage },
      unknownTotal: Number(stats.unknown_total ?? 0),
      errorTotal: Number(stats.error_total ?? 0) };
    await redis.eval(OWNED_STATUS, { keys: [this.key('lease'), this.key('status')],
      arguments: [token, JSON.stringify(snapshot), '180000'] });
  }

  private async processRepairPosition(redis: RedisClient, token: string, id: string) {
    try {
      const outcome = await repairRuntimePositionCacheOnce({ positionId: id, redis,
        userId: this.deps.scanUserId });
      if (outcome.kind === 'PENDING') {
        await redis.eval(OWNED_REPAIR_PENDING, { keys: [this.key('lease'),
          this.key('repair:pending')], arguments: [token, 'add', String(Date.now()), id] });
        this.log('cache_repair_pending', outcome.reason);
      } else {
        await redis.eval(OWNED_REPAIR_PENDING, { keys: [this.key('lease'),
          this.key('repair:pending')], arguments: [token, 'remove', '0', id] });
        if (outcome.kind === 'REPAIRED') this.log('cache_repaired');
      }
    } catch (error) {
      await redis.eval(OWNED_REPAIR_PENDING, { keys: [this.key('lease'),
        this.key('repair:pending')], arguments: [token, 'add', String(Date.now()), id] });
      this.log('cache_repair_failed', error instanceof Error ? error.message : 'unknown_error');
    }
  }

  private async writeRepairScan(redis: RedisClient, token: string,
    lane: 'open' | 'cache', state: RepairScanState) {
    return Number(await redis.eval(OWNED_SET, { keys: [this.key('lease'),
      this.key(`repair:${lane}:scan`)], arguments: [token, JSON.stringify(state)] })) === 1;
  }

  private async scanOpenPositions(redis: RedisClient, token: string, seen: Set<string>) {
    const state = parseRepairScan(await redis.get(this.key('repair:open:scan')));
    if (state.cursor === null && state.lastCompletedAt != null) {
      state.startedAt = Date.now();
      state.visitedCount = 0;
    }
    let complete = false;
    for (let page = 0; page < this.repairMaxPages; page += 1) {
      if (!await this.owned(redis, token)) return null;
      const batch = await findRuntimeCacheRepairPage({ cursor: state.cursor,
        limit: this.repairPageLimit, userId: this.deps.scanUserId });
      for (const id of batch.ids) {
        if (!await this.owned(redis, token)) return null;
        if (!seen.has(id)) await this.processRepairPosition(redis, token, id);
        seen.add(id);
      }
      state.visitedCount += batch.ids.length;
      state.cursor = batch.nextCursor;
      if (!state.cursor) {
        state.lastCompletedAt = Date.now();
        complete = true;
      }
      if (!await this.writeRepairScan(redis, token, 'open', state)) return null;
      if (complete) break;
    }
    return coverage(state, complete, Date.now());
  }

  private async scanCacheKeys(redis: RedisClient, token: string, seen: Set<string>) {
    const state = parseRepairScan(await redis.get(this.key('repair:cache:scan')));
    if (state.cursor === null && state.backlog.length === 0 && state.lastCompletedAt != null) {
      state.startedAt = Date.now();
      state.visitedCount = 0;
    }
    let complete = false;
    for (let page = 0; page < this.repairMaxPages; page += 1) {
      if (!await this.owned(redis, token)) return null;
      if (state.backlog.length === 0 && state.cursor !== '0') {
        const reply = await redis.sendCommand(['SCAN', state.cursor ?? '0', 'MATCH',
          'runtime:position-state:*', 'COUNT', String(this.repairPageLimit)]);
        if (!Array.isArray(reply) || reply.length !== 2 ||
            typeof reply[0] !== 'string' || !Array.isArray(reply[1]) ||
            !reply[1].every((key) => typeof key === 'string')) {
          throw new Error('Invalid runtime cache SCAN result');
        }
        state.cursor = reply[0];
        state.backlog = reply[1].map((key) => key.slice('runtime:position-state:'.length))
          .filter((id) => id.length > 0);
        // Save the returned keys before processing. A restarted worker cannot
        // skip a batch when Redis has already advanced its SCAN cursor.
        if (!await this.writeRepairScan(redis, token, 'cache', state)) return null;
      }
      const ids = state.backlog.slice(0, this.repairPageLimit);
      for (const id of ids) {
        if (!await this.owned(redis, token)) return null;
        if (!seen.has(id)) await this.processRepairPosition(redis, token, id);
        seen.add(id);
        state.backlog.shift();
        state.visitedCount += 1;
        if (!await this.writeRepairScan(redis, token, 'cache', state)) return null;
      }
      if (state.cursor === '0' && state.backlog.length === 0) {
        state.cursor = null;
        state.lastCompletedAt = Date.now();
        complete = true;
        if (!await this.writeRepairScan(redis, token, 'cache', state)) return null;
        break;
      }
    }
    return coverage(state, complete, Date.now());
  }

  private async scanRuntimeCache(redis: RedisClient, token: string) {
    const pendingIds = await redis.sendCommand(['ZRANGE', this.key('repair:pending'),
      '0', String(this.repairPageLimit - 1)]);
    const seen = new Set<string>();
    for (const id of Array.isArray(pendingIds) ? pendingIds as string[] : []) {
      if (!await this.owned(redis, token)) return;
      await this.processRepairPosition(redis, token, id);
      seen.add(id);
    }
    const open = await this.scanOpenPositions(redis, token, seen);
    const cache = await this.scanCacheKeys(redis, token, seen);
    if (open && cache) this.repairCoverage = { open, cache };
  }

  async runOnce() {
    if (this.stopping) return;
    this.repairCoverage = null;
    const redis = await this.client();
    const token = randomUUID();
    const lease = await redis.set(this.key('lease'), token, { NX: true, PX: this.leaseMs });
    if (lease !== 'OK') return;
    this.log('lease_acquired');
    let lost = false;
    let renewing = false;
    let cycleFailed = false;
    const renewTimer = setInterval(() => {
      if (renewing || this.stopping) return;
      renewing = true;
      void redis.eval(OWNED_RENEW, { keys: [this.key('lease')],
        arguments: [token, String(this.leaseMs)] })
        .then((value) => { if (Number(value) !== 1) lost = true; })
        .catch(() => { lost = true; })
        .finally(() => { renewing = false; });
    }, Math.max(500, Math.floor(this.leaseMs / 3)));
    try {
      const pendingIds = await this.duePending(redis);
      for (const id of pendingIds) {
        if (lost || !await this.owned(redis, token)) return;
        const raw = await redis.hGet(this.key('pending:data'), id);
        const candidate = raw ? parseCandidate(raw) : null;
        if (!candidate) { await this.clearPending(redis, token, id); continue; }
        if (!await this.processCandidate(redis, token, candidate, true)) return;
      }
      const cursor = await this.readCursor(redis);
      for (let page = 0; page < this.maxPages; page += 1) {
        if (lost || !await this.owned(redis, token)) return;
        const result = await findLiveFillCandidatePage({ limit: this.pageLimit,
          intentCursor: cursor.intentCursor ?? undefined,
          orderCursor: cursor.orderCursor ?? undefined,
          includeIntents: !cursor.intentDone, includeOrders: !cursor.orderDone });
        for (const candidate of result.candidates) {
          if (lost || !await this.processCandidate(redis, token, candidate, false)) return;
        }
        cursor.intentCursor = result.nextIntentCursor;
        cursor.orderCursor = result.nextOrderCursor;
        cursor.intentDone ||= result.nextIntentCursor == null;
        cursor.orderDone ||= result.nextOrderCursor == null;
        if (cursor.intentDone && cursor.orderDone) Object.assign(cursor, emptyCursor());
        if (!await this.writeCursor(redis, token, cursor)) return;
        if (!result.nextIntentCursor && !result.nextOrderCursor) break;
      }
      if (!lost && await this.owned(redis, token)) await this.scanRuntimeCache(redis, token);
    } catch (error) {
      cycleFailed = true;
      await redis.hIncrBy(this.key('stats'), 'error_total', 1).catch(() => undefined);
      throw error;
    } finally {
      clearInterval(renewTimer);
      await this.publishStatus(redis, token, cycleFailed ? 'degraded' : 'healthy')
        .catch(() => undefined);
      await redis.eval(OWNED_RELEASE, { keys: [this.key('lease')], arguments: [token] })
        .catch(() => undefined);
    }
  }
}

const numberFromEnv = (name: string) => Number.parseInt(process.env[name] ?? '', 10);
export const liveFillRecoveryLoop = new LiveFillRecoveryLoop({
  intervalMs: numberFromEnv('LIVE_FILL_RECOVERY_INTERVAL_MS'),
  leaseMs: numberFromEnv('LIVE_FILL_RECOVERY_LEASE_MS'),
  pageLimit: numberFromEnv('LIVE_FILL_RECOVERY_PAGE_LIMIT'),
  maxPages: numberFromEnv('LIVE_FILL_RECOVERY_MAX_PAGES'),
  minGapMs: numberFromEnv('LIVE_FILL_RECOVERY_MIN_GAP_MS'),
  lookupTimeoutMs: numberFromEnv('LIVE_FILL_RECOVERY_LOOKUP_TIMEOUT_MS'),
}, { onEvent: (event, detail) => {
  if (event === 'unknown' || event === 'applied') return;
  console.warn(`[LiveFillRecovery] ${event}${detail ? `: ${detail}` : ''}`);
} });
