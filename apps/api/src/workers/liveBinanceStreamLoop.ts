import { randomUUID } from 'node:crypto';
import { createClient } from 'redis';
import { prisma } from '../prisma/client';
import { decrypt } from '../utils/crypto';
import { BinanceUserDataStreamService, type BinanceUserDataStreamSession } from
  '../modules/exchange/binanceUserDataStream.service';
import type { NormalizedBinanceUserDataStreamEvent } from
  '../modules/exchange/binanceUserDataStream.types';
import { applyLiveExchangeUserDataStreamEvent } from
  '../modules/orders/orders.exchangeEvents.service';

type MarketType = 'SPOT' | 'FUTURES';
export type LiveBinanceAccount = {
  userId: string; apiKeyId: string; marketType: MarketType;
  encryptedApiKey: string; encryptedApiSecret: string; updatedAt: Date;
};
type Dependencies = {
  listAccounts?: (limit: number) => Promise<LiveBinanceAccount[]>;
  stream?: BinanceUserDataStreamService;
  decryptKey?: (value: string) => string;
  applyEvent?: typeof applyLiveExchangeUserDataStreamEvent;
  onState?: (state: string) => void;
};
type Options = {
  redisUrl?: string; namespace?: string; intervalMs?: number; leaseMs?: number;
  openTimeoutMs?: number; backoffMs?: number; maxBackoffMs?: number;
  pingIntervalMs?: number; pongTimeoutMs?: number; keepAliveMs?: number;
  maxAccounts?: number; maxStartsPerTick?: number;
};
type RedisClient = ReturnType<typeof createClient>;
type AccountState = {
  account: LiveBinanceAccount; token: string; session: BinanceUserDataStreamSession | null;
  status: 'connecting' | 'connected' | 'backoff'; generation: number;
  startedAt: number; connectedAt: number | null; lastEventAt: number | null;
  lastPongAt: number | null; lastPingAt: number | null; lastKeepAliveAt: number;
  nextAttemptAt: number; attempts: number; reconnects: number; errors: number;
  queueDepth: number; pending: Promise<void>;
};
const OWNED_RENEW = `if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
return redis.call('PEXPIRE', KEYS[1], ARGV[2])`;
const OWNED_RELEASE = `if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
redis.call('DEL', KEYS[1]); redis.call('DEL', KEYS[2]); return 1`;
const OWNED_STATUS = `if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[2], ARGV[2], 'PX', ARGV[3]); return 1`;
const clamp = (value: number | undefined, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.max(min, Math.min(max, Math.floor(value!))) : fallback;
const accountId = (account: Pick<LiveBinanceAccount, 'apiKeyId' | 'marketType'>) =>
  `${account.apiKeyId}:${account.marketType}`;

export const listEligibleLiveBinanceAccounts = async (limit: number): Promise<LiveBinanceAccount[]> => {
  // Inactive opted-in bots can still have late fills. A LIVE wallet also covers manual orders.
  const [bots, wallets] = await Promise.all([
    prisma.bot.findMany({ where: { mode: 'LIVE', exchange: 'BINANCE', liveOptIn: true },
      select: { userId: true, marketType: true, apiKeyId: true,
        wallet: { select: { userId: true, mode: true, exchange: true,
          marketType: true, apiKeyId: true } } }, take: limit + 1 }),
    prisma.wallet.findMany({ where: { mode: 'LIVE', exchange: 'BINANCE',
      apiKeyId: { not: null } },
      select: { userId: true, marketType: true, apiKeyId: true }, take: limit + 1 }),
  ]);
  if (bots.length > limit || wallets.length > limit) throw new Error('ACCOUNT_SCAN_LIMIT');
  const references = new Map<string, { userId: string; apiKeyId: string; marketType: MarketType }>();
  for (const bot of bots) {
    const wallet = bot.wallet;
    const keyId = bot.apiKeyId ?? (wallet?.mode === 'LIVE' && wallet.exchange === 'BINANCE' &&
      wallet.marketType === bot.marketType && wallet.userId === bot.userId ? wallet.apiKeyId : null);
    if (!keyId) continue;
    const reference = { userId: bot.userId, apiKeyId: keyId,
      marketType: bot.marketType as MarketType };
    references.set(accountId(reference), reference);
  }
  for (const wallet of wallets) {
    if (!wallet.apiKeyId) continue;
    const reference = { userId: wallet.userId, apiKeyId: wallet.apiKeyId,
      marketType: wallet.marketType as MarketType };
    references.set(accountId(reference), reference);
  }
  if (references.size > limit) throw new Error('ACCOUNT_SCAN_LIMIT');
  const keys = await prisma.apiKey.findMany({ where: { id: { in: [...new Set(
    [...references.values()].map((reference) => reference.apiKeyId))] }, exchange: 'BINANCE' },
    select: { id: true, userId: true, apiKey: true, apiSecret: true, updatedAt: true } });
  const keyById = new Map(keys.map((key) => [key.id, key]));
  return [...references.values()].flatMap((reference) => {
    const key = keyById.get(reference.apiKeyId);
    return key && key.userId === reference.userId ? [{ ...reference,
      encryptedApiKey: key.apiKey, encryptedApiSecret: key.apiSecret,
      updatedAt: key.updatedAt }] : [];
  });
};

export class LiveBinanceStreamLoop {
  private readonly namespace: string;
  private readonly intervalMs: number;
  private readonly leaseMs: number;
  private readonly openTimeoutMs: number;
  private readonly backoffMs: number;
  private readonly maxBackoffMs: number;
  private readonly pingIntervalMs: number;
  private readonly pongTimeoutMs: number;
  private readonly keepAliveMs: number;
  private readonly maxAccounts: number;
  private readonly maxStartsPerTick: number;
  private readonly redisUrl: string;
  private readonly deps: Dependencies;
  private readonly states = new Map<string, AccountState>();
  private redis: RedisClient | null = null;
  private timer: NodeJS.Timeout | null = null;
  private inFlight: Promise<void> | null = null;
  private running = false;
  private stopping = false;

  constructor(options: Options = {}, deps: Dependencies = {}) {
    this.namespace = options.namespace ?? 'soar:live-binance-stream:v1';
    this.intervalMs = clamp(options.intervalMs, 10_000, 100, 60_000);
    this.leaseMs = clamp(options.leaseMs, 60_000, 2_000, 300_000);
    this.openTimeoutMs = clamp(options.openTimeoutMs, 15_000, 200, 60_000);
    this.backoffMs = clamp(options.backoffMs, 2_000, 100, 60_000);
    this.maxBackoffMs = clamp(options.maxBackoffMs, 300_000, this.backoffMs, 900_000);
    this.pingIntervalMs = clamp(options.pingIntervalMs, 30_000, 500, 300_000);
    this.pongTimeoutMs = clamp(options.pongTimeoutMs, 10_000, 200, 60_000);
    this.keepAliveMs = clamp(options.keepAliveMs, 30 * 60_000, 10_000, 50 * 60_000);
    this.maxAccounts = clamp(options.maxAccounts, 100, 1, 100);
    this.maxStartsPerTick = clamp(options.maxStartsPerTick, 3, 1, 20);
    this.redisUrl = options.redisUrl ?? process.env.REDIS_URL ?? 'redis://localhost:6379';
    this.deps = deps;
  }
  private key(suffix: string) { return `${this.namespace}:${suffix}`; }
  private log(code: string) { this.deps.onState?.(code); }
  private async client() {
    if (this.redis?.isOpen) return this.redis;
    if (this.redis) await this.redis.disconnect().catch(() => undefined);
    this.redis = null;
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
        this.inFlight = this.runOnce().catch(() => this.log('scan_failed'))
          .finally(() => { this.inFlight = null; schedule(); });
      }, this.intervalMs);
    };
    this.inFlight = this.runOnce().catch(() => this.log('scan_failed'))
      .finally(() => { this.inFlight = null; schedule(); });
  }
  async stop() {
    this.stopping = true;
    this.running = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    await this.inFlight;
    const redis = this.redis;
    for (const state of [...this.states.values()]) {
      if (redis?.isOpen) await this.drop(redis, state, true);
      else {
        state.generation += 1;
        try { state.session?.close(); } catch { /* local socket already closed */ }
        await state.pending;
      }
    }
    if (redis?.isOpen) await redis.quit().catch(() => redis.disconnect());
    this.states.clear();
    this.redis = null;
  }
  private async owns(redis: RedisClient, state: AccountState) {
    return !this.stopping && this.states.get(accountId(state.account)) === state &&
      await redis.get(this.key(`lease:${accountId(state.account)}`)) === state.token;
  }
  private fail(state: AccountState, code: string) {
    if (this.stopping || this.states.get(accountId(state.account)) !== state ||
        state.status === 'backoff') return;
    const session = state.session;
    state.session = null;
    state.status = 'backoff';
    state.generation += 1;
    state.errors += 1;
    state.reconnects += 1;
    state.attempts += 1;
    state.nextAttemptAt = Date.now() + Math.min(this.maxBackoffMs,
      this.backoffMs * 2 ** Math.min(state.attempts - 1, 8));
    try { session?.close(); } catch { /* local socket already closed */ }
    void this.redis?.hIncrBy(this.key('stats'), 'reconnects', 1).catch(() => undefined);
    void this.redis?.hIncrBy(this.key('stats'), 'errors', 1).catch(() => undefined);
    this.log(code);
  }
  private enqueueEvent(redis: RedisClient, state: AccountState, generation: number,
    event: NormalizedBinanceUserDataStreamEvent) {
    if (event.eventType === 'UNSUPPORTED') {
      if (event.rawEventType === 'listenKeyExpired') this.fail(state, 'listen_key_expired');
      return;
    }
    if (state.queueDepth >= 1_000) { this.fail(state, 'event_queue_overflow'); return; }
    state.queueDepth += 1;
    state.lastEventAt = Date.now();
    state.pending = state.pending.then(async () => {
      if (state.generation !== generation || state.status !== 'connected' ||
          !await this.owns(redis, state)) return;
      await (this.deps.applyEvent ?? applyLiveExchangeUserDataStreamEvent)({
        userId: state.account.userId, sourceApiKeyId: state.account.apiKeyId, event,
      });
    }).catch(() => this.fail(state, 'event_apply_failed'))
      .finally(() => { state.queueDepth -= 1; });
  }
  private async connect(redis: RedisClient, state: AccountState) {
    if (!await this.owns(redis, state)) return;
    state.status = 'connecting';
    state.startedAt = Date.now();
    state.generation += 1;
    const generation = state.generation;
    try {
      const apiKey = (this.deps.decryptKey ?? decrypt)(state.account.encryptedApiKey);
      const stream = this.deps.stream ?? new BinanceUserDataStreamService();
      const callbacks = {
        onEvent: (event: NormalizedBinanceUserDataStreamEvent) =>
          this.enqueueEvent(redis, state, generation, event),
        onOpen: () => {
          if (state.generation !== generation || this.stopping) return;
          state.status = 'connected'; state.connectedAt = Date.now();
          state.lastPongAt = Date.now(); state.lastPingAt = null;
          state.lastKeepAliveAt = Date.now(); state.attempts = 0;
          this.log('connected');
        },
        onClose: () => { if (state.generation === generation) this.fail(state, 'socket_closed'); },
        onError: (_error: unknown) => {
          if (state.generation === generation) this.fail(state, 'socket_error');
        },
        onPong: () => { if (state.generation === generation) {
          state.lastPongAt = Date.now(); state.lastPingAt = null;
        } },
      };
      if (state.account.marketType === 'SPOT') {
        // The Spot listenKey route was retired; use signed WebSocket API subscription.
        state.session = stream.connectSignedSpot({ apiKey,
          apiSecret: (this.deps.decryptKey ?? decrypt)(state.account.encryptedApiSecret),
          ...callbacks });
      } else {
        const listenKey = await stream.createListenKey({ marketType: 'FUTURES', apiKey });
        if (!await this.owns(redis, state) || state.generation !== generation) return;
        state.session = stream.connect({ marketType: 'FUTURES', listenKey, ...callbacks });
      }
    } catch {
      if (state.generation === generation) this.fail(state, 'connect_failed');
    }
  }
  private async drop(redis: RedisClient, state: AccountState, release: boolean) {
    state.generation += 1;
    const session = state.session;
    state.session = null;
    this.states.delete(accountId(state.account));
    try { session?.close(); } catch { /* local socket already closed */ }
    await state.pending;
    if (release) await redis.eval(OWNED_RELEASE, { keys: [
      this.key(`lease:${accountId(state.account)}`),
      this.key(`account:${accountId(state.account)}`)],
      arguments: [state.token] }).catch(() => undefined);
  }
  private async maintain(redis: RedisClient, state: AccountState) {
    const owned = Number(await redis.eval(OWNED_RENEW, {
      keys: [this.key(`lease:${accountId(state.account)}`)],
      arguments: [state.token, String(this.leaseMs)] })) === 1;
    if (!owned) { await this.drop(redis, state, false); return; }
    const now = Date.now();
    if (state.status === 'backoff' && now >= state.nextAttemptAt) await this.connect(redis, state);
    else if (state.status === 'connecting' && now - state.startedAt > this.openTimeoutMs)
      this.fail(state, 'open_timeout');
    else if (state.status === 'connected') {
      if (state.lastPingAt && now - state.lastPingAt > this.pongTimeoutMs)
        this.fail(state, 'pong_timeout');
      else if (!state.lastPingAt && state.lastPongAt &&
          now - state.lastPongAt >= this.pingIntervalMs) {
        state.lastPingAt = now;
        try { state.session?.ping(); } catch { this.fail(state, 'ping_failed'); }
      }
      if (state.status === 'connected' && state.account.marketType === 'FUTURES' &&
          now - state.lastKeepAliveAt >= this.keepAliveMs && state.session?.listenKey) {
        try {
          const apiKey = (this.deps.decryptKey ?? decrypt)(state.account.encryptedApiKey);
          const renewedKey = await (this.deps.stream ?? new BinanceUserDataStreamService())
            .keepAliveListenKey({
            marketType: 'FUTURES', apiKey, listenKey: state.session.listenKey });
          if (renewedKey && renewedKey !== state.session.listenKey)
            this.fail(state, 'listen_key_rotated');
          else state.lastKeepAliveAt = Date.now();
        } catch { this.fail(state, 'keepalive_failed'); }
      }
    }
    await redis.eval(OWNED_STATUS, { keys: [this.key(`lease:${accountId(state.account)}`),
      this.key(`account:${accountId(state.account)}`)], arguments: [state.token,
      JSON.stringify({ status: state.status, updatedAt: Date.now(),
        connectedAt: state.connectedAt, lastEventAt: state.lastEventAt,
        lastPongAt: state.lastPongAt, reconnects: state.reconnects, errors: state.errors }),
      String(this.leaseMs * 2)] });
  }
  async runOnce() {
    if (this.stopping) return;
    const redis = await this.client();
    let accounts: LiveBinanceAccount[];
    try { accounts = await (this.deps.listAccounts ?? listEligibleLiveBinanceAccounts)(this.maxAccounts); }
    catch {
      await redis.set(this.key('desired'), JSON.stringify({ status: 'scan_failed',
        scannedAt: Date.now(), accounts: [] }), { PX: this.leaseMs * 2 });
      await redis.hIncrBy(this.key('stats'), 'errors', 1);
      throw new Error('LIVE_ACCOUNT_SCAN_FAILED');
    }
    if (accounts.length > this.maxAccounts) {
      await redis.set(this.key('desired'), JSON.stringify({ status: 'scan_failed',
        scannedAt: Date.now(), accounts: [] }), { PX: this.leaseMs * 2 });
      await redis.hIncrBy(this.key('stats'), 'errors', 1);
      throw new Error('ACCOUNT_SCAN_LIMIT');
    }
    const desired = new Map(accounts.map((account) => [accountId(account), account]));
    await redis.set(this.key('desired'), JSON.stringify({ status: 'ok',
      scannedAt: Date.now(), accounts: [...desired.keys()] }), { PX: this.leaseMs * 2 });
    for (const state of [...this.states.values()]) {
      const current = desired.get(accountId(state.account));
      if (!current || current.userId !== state.account.userId ||
          current.updatedAt.getTime() !== state.account.updatedAt.getTime()) {
        await this.drop(redis, state, true);
      } else await this.maintain(redis, state);
    }
    let starts = 0;
    for (const account of desired.values()) {
      if (this.stopping || starts >= this.maxStartsPerTick) break;
      const id = accountId(account);
      if (this.states.has(id)) continue;
      const token = randomUUID();
      if (await redis.set(this.key(`lease:${id}`), token,
        { NX: true, PX: this.leaseMs }) !== 'OK') continue;
      const state: AccountState = { account, token, session: null, status: 'backoff',
        generation: 0, startedAt: 0, connectedAt: null, lastEventAt: null,
        lastPongAt: null, lastPingAt: null, lastKeepAliveAt: 0,
        nextAttemptAt: 0, attempts: 0, reconnects: 0, errors: 0,
        queueDepth: 0, pending: Promise.resolve() };
      this.states.set(id, state);
      starts += 1;
      await this.connect(redis, state);
      await this.maintain(redis, state);
    }
  }
}

const numberFromEnv = (name: string) => Number.parseInt(process.env[name] ?? '', 10);
export const liveBinanceStreamLoop = new LiveBinanceStreamLoop({
  intervalMs: numberFromEnv('LIVE_BINANCE_STREAM_INTERVAL_MS'),
  maxAccounts: numberFromEnv('LIVE_BINANCE_STREAM_MAX_ACCOUNTS'),
}, { onState: (code) => {
  if (code !== 'connected') console.warn(`[LiveBinanceStream] ${code}`);
} });
