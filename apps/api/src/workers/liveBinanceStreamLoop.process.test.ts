import { randomUUID } from 'node:crypto';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { resolve } from 'node:path';
import { createClient } from 'redis';
import { describe, expect, it, vi } from 'vitest';
import type { NormalizedBinanceUserDataStreamEvent } from
  '../modules/exchange/binanceUserDataStream.types';
import type { BinanceUserDataStreamService, BinanceUserDataStreamSession } from
  '../modules/exchange/binanceUserDataStream.service';
import { readLiveExecutionOperationalStatus } from
  '../observability/liveExecutionOperationalStatus';
import { LiveBinanceStreamLoop, listEligibleLiveBinanceAccounts,
  type LiveBinanceAccount } from './liveBinanceStreamLoop';
import { LiveFillRecoveryLoop } from './liveFillRecoveryLoop';
import { prisma } from '../prisma/client';
import { normalizeBinanceUserDataStreamEvent } from
  '../modules/exchange/binanceUserDataStream.service';
import { applyLiveExchangeUserDataStreamEvent } from
  '../modules/orders/orders.exchangeEvents.service';

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const until = async (predicate: () => Promise<boolean> | boolean, timeoutMs = 3_000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await pause(20);
  }
  throw new Error('Timed out waiting for simulated LIVE stream');
};
const proofIt = process.env.RUN_LIVE_STREAM_PROOF === '1' ? it : it.skip;
const localRedisUrl = () => {
  const database = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
  const url = new URL(process.env.REDIS_URL ?? 'redis://127.0.0.1:6379');
  if (!database.endsWith('_test') ||
      !['localhost', '127.0.0.1'].includes(url.hostname)) {
    throw new Error('Stream proof requires isolated _test database and local Redis');
  }
  url.pathname = '/15';
  return url.toString();
};
type Callbacks = {
  onEvent: (event: NormalizedBinanceUserDataStreamEvent) => void;
  onOpen?: () => void; onClose?: () => void; onError?: (error: unknown) => void;
  onPong?: () => void;
};
class SimulatedStream {
  readonly callbacks = new Map<string, Callbacks>();
  readonly connects: string[] = [];
  readonly closes: string[] = [];
  readonly createListenKey = vi.fn(async () => 'test-listen-key');
  readonly keepAliveListenKey = vi.fn(async () => undefined);
  private makeSession(id: string, marketType: 'SPOT' | 'FUTURES',
    listenKey: string | null, callbacks: Callbacks): BinanceUserDataStreamSession {
    this.callbacks.set(id, callbacks);
    this.connects.push(id);
    return { marketType, listenKey,
      ping: () => callbacks.onPong?.(),
      close: () => { this.closes.push(id); },
    };
  }
  connect = (input: Callbacks & { marketType: 'FUTURES'; listenKey: string }) =>
    this.makeSession('FUTURES', 'FUTURES', input.listenKey, input);
  connectSignedSpot = (input: Callbacks & { apiKey: string; apiSecret: string }) =>
    this.makeSession('SPOT', 'SPOT', null, input);
  open(id: string) { this.callbacks.get(id)?.onOpen?.(); }
  disconnect(id: string) { this.callbacks.get(id)?.onClose?.(); }
  emit(id: string, event: NormalizedBinanceUserDataStreamEvent) {
    this.callbacks.get(id)?.onEvent(event);
  }
  asService() { return this as unknown as BinanceUserDataStreamService; }
}

describe('LIVE Binance stream execution worker with local Redis', () => {
  proofIt('transfers one subscription to a second OS process after a crash', async () => {
    const redisUrl = localRedisUrl();
    const namespace = `soar:live-stream-proof:${randomUUID()}`;
    const apiKeyId = randomUUID();
    const userId = randomUUID();
    const redis = createClient({ url: redisUrl });
    redis.on('error', () => undefined);
    const children: { child: ChildProcessWithoutNullStreams; lines: string[] }[] = [];
    const startProcess = () => {
      const child = spawn(process.execPath, ['--import', 'tsx', resolve(process.cwd(),
        'src/workers/liveBinanceStreamProcessProof.worker.ts')], {
        cwd: process.cwd(), stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, NODE_ENV: 'development', REDIS_URL: redisUrl,
          SOAR_LIVE_STREAM_PROCESS_PROOF: '1',
          SOAR_LIVE_STREAM_PROOF_NAMESPACE: namespace,
          SOAR_LIVE_STREAM_PROOF_KEY_ID: apiKeyId,
          SOAR_LIVE_STREAM_PROOF_USER_ID: userId },
      });
      const lines: string[] = [];
      let buffer = '';
      child.stdout.on('data', (data: Buffer) => {
        buffer += data.toString();
        while (buffer.includes('\n')) {
          const end = buffer.indexOf('\n');
          lines.push(buffer.slice(0, end).trim());
          buffer = buffer.slice(end + 1);
        }
      });
      child.stderr.on('data', (data: Buffer) => lines.push(`STDERR:${data.toString().trim()}`));
      const proof = { child, lines };
      children.push(proof);
      return proof;
    };
    try {
      await redis.connect();
      const first = startProcess();
      await until(() => first.lines.includes('CONNECTED'), 10_000);
      const second = startProcess();
      await until(() => second.lines.includes('READY'), 10_000);
      await pause(250);
      expect(second.lines).not.toContain('CONNECTED');
      first.child.stdin.write('CRASH\n');
      await until(() => first.child.exitCode === 17, 5_000);
      await until(() => second.lines.includes('CONNECTED'), 8_000);
      const state = JSON.parse((await redis.get(
        `${namespace}:account:${apiKeyId}:SPOT`))!);
      expect(state.status).toBe('connected');
      second.child.stdin.write('STOP\n');
      await until(() => second.child.exitCode === 0, 5_000);
      expect(await redis.get(`${namespace}:lease:${apiKeyId}:SPOT`)).toBeNull();
    } finally {
      for (const proof of children) {
        if (proof.child.exitCode === null) {
          proof.child.kill('SIGTERM');
          await Promise.race([new Promise((resolveClose) => proof.child.once('close', resolveClose)),
            pause(5_000)]);
          if (proof.child.exitCode === null) proof.child.kill();
        }
      }
      if (redis.isOpen) {
        const keys = await redis.keys(`${namespace}:*`);
        if (keys.length) await redis.del(keys);
        await redis.quit();
      }
    }
  }, 30_000);

  proofIt('starts a scheduled subscription and removes its lease on graceful stop', async () => {
    const redisUrl = localRedisUrl();
    const namespace = `soar:live-stream-proof:${randomUUID()}`;
    const redis = createClient({ url: redisUrl });
    redis.on('error', () => undefined);
    const account: LiveBinanceAccount = { userId: randomUUID(), apiKeyId: randomUUID(),
      marketType: 'SPOT', encryptedApiKey: 'key', encryptedApiSecret: 'secret',
      updatedAt: new Date() };
    const stream = new SimulatedStream();
    const loop = new LiveBinanceStreamLoop({ redisUrl, namespace, intervalMs: 100,
      leaseMs: 2_000 }, { listAccounts: async () => [account],
      stream: stream.asService(), decryptKey: (value) => value });
    try {
      await redis.connect();
      loop.start();
      await until(() => stream.connects.length === 1);
      stream.open('SPOT');
      await until(async () => JSON.parse((await redis.get(
        `${namespace}:account:${account.apiKeyId}:SPOT`)) ?? '{}').status === 'connected');
      await loop.stop();
      expect(await redis.get(`${namespace}:lease:${account.apiKeyId}:SPOT`)).toBeNull();
      expect(stream.closes).toEqual(['SPOT']);
      await pause(150);
      expect(stream.connects).toHaveLength(1);
    } finally {
      await loop.stop();
      if (redis.isOpen) {
        const keys = await redis.keys(`${namespace}:*`);
        if (keys.length) await redis.del(keys);
        await redis.quit();
      }
    }
  }, 10_000);

  proofIt('closes the local socket when Redis is unavailable during shutdown', async () => {
    const redisUrl = localRedisUrl();
    const namespace = `soar:live-stream-proof:${randomUUID()}`;
    const redis = createClient({ url: redisUrl });
    redis.on('error', () => undefined);
    const account: LiveBinanceAccount = { userId: randomUUID(), apiKeyId: randomUUID(),
      marketType: 'SPOT', encryptedApiKey: 'key', encryptedApiSecret: 'secret',
      updatedAt: new Date() };
    const stream = new SimulatedStream();
    const loop = new LiveBinanceStreamLoop({ redisUrl, namespace, leaseMs: 2_000 },
      { listAccounts: async () => [account], stream: stream.asService(),
        decryptKey: (value) => value });
    try {
      await redis.connect();
      await loop.runOnce();
      stream.open('SPOT');
      const workerRedis = (loop as unknown as { redis: ReturnType<typeof createClient> }).redis;
      await workerRedis.disconnect();
      await loop.stop();
      expect(stream.closes).toEqual(['SPOT']);
    } finally {
      await loop.stop();
      if (redis.isOpen) {
        const keys = await redis.keys(`${namespace}:*`);
        if (keys.length) await redis.del(keys);
        await redis.quit();
      }
    }
  }, 10_000);

  proofIt('owns subscriptions, reconnects with backoff, transfers after restart and drains events on stop', async () => {
    const redisUrl = localRedisUrl();
    const namespace = `soar:live-stream-proof:${randomUUID()}`;
    const recoveryNamespace = `${namespace}:recovery`;
    const redis = createClient({ url: redisUrl });
    redis.on('error', () => undefined);
    const accounts: LiveBinanceAccount[] = [
      { userId: randomUUID(), apiKeyId: randomUUID(), marketType: 'SPOT',
        encryptedApiKey: 'plain-spot-key', encryptedApiSecret: 'plain-spot-secret',
        updatedAt: new Date() },
      { userId: randomUUID(), apiKeyId: randomUUID(), marketType: 'FUTURES',
        encryptedApiKey: 'plain-futures-key', encryptedApiSecret: 'plain-futures-secret',
        updatedAt: new Date() },
    ];
    const streamA = new SimulatedStream();
    const streamB = new SimulatedStream();
    const finishEvent: { current: (() => void) | null } = { current: null };
    let eventStarted = false;
    const applyEvent = vi.fn(async () => {
      eventStarted = true;
      await new Promise<void>((resolve) => { finishEvent.current = resolve; });
      return { status: 'ignored' as const, reason: 'order_not_found' as const };
    });
    const options = { redisUrl, namespace, intervalMs: 100, leaseMs: 2_000,
      backoffMs: 100, maxBackoffMs: 400, openTimeoutMs: 200,
      pingIntervalMs: 500, pongTimeoutMs: 200 };
    const loopA = new LiveBinanceStreamLoop(options, { listAccounts: async () => accounts,
      stream: streamA.asService(), decryptKey: (value) => value, applyEvent });
    const loopB = new LiveBinanceStreamLoop(options, { listAccounts: async () => accounts,
      stream: streamB.asService(), decryptKey: (value) => value, applyEvent });
    try {
      await redis.connect();
      await redis.set(`${recoveryNamespace}:status`, JSON.stringify({
        status: 'healthy', updatedAt: Date.now(), pendingCount: 0, oldestPendingAgeMs: null,
        unknownTotal: 0, errorTotal: 0 }), { PX: 60_000 });
      await loopA.runOnce();
      expect(streamA.connects).toEqual(['SPOT', 'FUTURES']);
      streamA.open('SPOT'); streamA.open('FUTURES');
      await loopA.runOnce();
      await loopB.runOnce();
      expect(streamB.connects).toHaveLength(0);
      const healthy = await readLiveExecutionOperationalStatus({
        redisUrl, streamNamespace: namespace, recoveryNamespace });
      expect(healthy.status).toBe('healthy');
      expect(healthy.stream).toMatchObject({ eligibleAccounts: 2, connectedAccounts: 2 });
      expect(await redis.get(`${namespace}:account:${accounts[0].apiKeyId}:SPOT`))
        .not.toContain('plain-spot-key');

      streamA.disconnect('FUTURES');
      await loopA.runOnce();
      expect(streamA.connects.filter((id) => id === 'FUTURES')).toHaveLength(1);
      expect((await readLiveExecutionOperationalStatus({ redisUrl,
        streamNamespace: namespace, recoveryNamespace })).status).toBe('degraded');
      await pause(110);
      await loopA.runOnce();
      expect(streamA.connects.filter((id) => id === 'FUTURES')).toHaveLength(2);
      streamA.open('FUTURES');
      await loopA.runOnce();
      streamA.emit('FUTURES', { eventType: 'UNSUPPORTED', marketType: 'FUTURES',
        rawEventType: 'listenKeyExpired', raw: {} });
      await loopA.runOnce();
      expect((await readLiveExecutionOperationalStatus({ redisUrl,
        streamNamespace: namespace, recoveryNamespace })).status).toBe('degraded');
      await pause(110);
      await loopA.runOnce();
      expect(streamA.connects.filter((id) => id === 'FUTURES')).toHaveLength(3);
      streamA.open('FUTURES');
      await loopA.runOnce();

      await loopA.stop();
      expect(streamA.closes).toContain('SPOT');
      expect(streamA.closes).toContain('FUTURES');
      await loopB.runOnce();
      expect(streamB.connects).toEqual(['SPOT', 'FUTURES']);
      streamB.open('SPOT'); streamB.open('FUTURES');
      await loopB.runOnce();

      const event: NormalizedBinanceUserDataStreamEvent = {
        eventType: 'UNSUPPORTED', marketType: 'SPOT', rawEventType: 'test', raw: {},
      };
      // A supported event exercises the serial event queue and graceful shutdown.
      streamB.emit('SPOT', { ...event, eventType: 'ACCOUNT_UPDATE',
        eventTime: Date.now(), transactionTime: null, balances: [], positions: [] });
      for (let attempt = 0; attempt < 100 && !eventStarted; attempt += 1) await pause(10);
      expect(eventStarted).toBe(true);
      let stopped = false;
      const shutdown = loopB.stop().then(() => { stopped = true; });
      await pause(30);
      expect(stopped).toBe(false);
      finishEvent.current?.();
      await shutdown;
      expect(applyEvent).toHaveBeenCalledOnce();
      expect(streamB.closes).toContain('SPOT');
      expect(streamB.closes).toContain('FUTURES');
    } finally {
      finishEvent.current?.();
      await loopA.stop();
      await loopB.stop();
      if (redis.isOpen) {
        const keys = await redis.keys(`${namespace}:*`);
        if (keys.length) await redis.del(keys);
        await redis.quit();
      }
    }
  }, 30_000);

  proofIt('does not report READY when a socket never opens', async () => {
    const redisUrl = localRedisUrl();
    const namespace = `soar:live-stream-proof:${randomUUID()}`;
    const recoveryNamespace = `${namespace}:recovery`;
    const redis = createClient({ url: redisUrl });
    redis.on('error', () => undefined);
    const account: LiveBinanceAccount = { userId: randomUUID(), apiKeyId: randomUUID(),
      marketType: 'SPOT', encryptedApiKey: 'key', encryptedApiSecret: 'secret',
      updatedAt: new Date() };
    const stream = new SimulatedStream();
    const loop = new LiveBinanceStreamLoop({ redisUrl, namespace, leaseMs: 2_000,
      openTimeoutMs: 200, backoffMs: 100 }, {
      listAccounts: async () => [account], stream: stream.asService(),
      decryptKey: (value) => value,
    });
    try {
      await redis.connect();
      await redis.set(`${recoveryNamespace}:status`, JSON.stringify({
        status: 'healthy', updatedAt: Date.now(), pendingCount: 0, unknownTotal: 0, errorTotal: 0 }),
      { PX: 60_000 });
      await loop.runOnce();
      await pause(220);
      await loop.runOnce();
      const status = await readLiveExecutionOperationalStatus({ redisUrl,
        streamNamespace: namespace, recoveryNamespace });
      expect(status.status).toBe('degraded');
      expect(status.stream.connectedAccounts).toBe(0);
      expect(status.stream.errorTotal).toBeGreaterThanOrEqual(1);
    } finally {
      await loop.stop();
      if (redis.isOpen) {
        const keys = await redis.keys(`${namespace}:*`);
        if (keys.length) await redis.del(keys);
        await redis.quit();
      }
    }
  }, 15_000);

  proofIt('serializes stream, polling and duplicate LIVE DCA fills in the isolated database', async () => {
    const redisUrl = localRedisUrl();
    const namespace = `soar:live-stream-proof:${randomUUID()}`;
    const recoveryNamespace = `${namespace}:recovery`;
    const redis = createClient({ url: redisUrl });
    redis.on('error', () => undefined);
    const stream = new SimulatedStream();
    let userId: string | null = null;
    let streamLoop: LiveBinanceStreamLoop | null = null;
    let recoveryLoop: LiveFillRecoveryLoop | null = null;
    try {
      await redis.connect();
      const id = randomUUID();
      const user = await prisma.user.create({ data: {
        email: `live-stream-proof-${id}@example.test`, password: 'test-only',
      } });
      userId = user.id;
      const key = await prisma.apiKey.create({ data: { userId: user.id,
        label: id, exchange: 'BINANCE', apiKey: 'test-key', apiSecret: 'test-secret' } });
      const wallet = await prisma.wallet.create({ data: { userId: user.id, name: id,
        mode: 'LIVE', exchange: 'BINANCE', marketType: 'FUTURES', apiKeyId: key.id } });
      const bot = await prisma.bot.create({ data: { userId: user.id, name: id,
        mode: 'LIVE', exchange: 'BINANCE', marketType: 'FUTURES',
        walletId: wallet.id, apiKeyId: key.id, isActive: true, liveOptIn: true } });
      const position = await prisma.position.create({ data: { userId: user.id,
        botId: bot.id, walletId: wallet.id, symbol: 'BTCUSDT', side: 'LONG',
        status: 'OPEN', quantity: 1, entryPrice: 100,
        origin: 'BOT', managementMode: 'BOT_MANAGED' } });
      const clientOrderId = `soar_${id.replace(/-/g, '').slice(0, 22)}`;
      const exchangeOrderId = '12345';
      const intent = await prisma.liveOrderIntent.create({ data: { userId: user.id,
        clientOrderId, payloadHash: id, exchange: 'BINANCE',
        marketType: 'FUTURES', symbol: 'BTCUSDT', payload: {
          mode: 'LIVE', origin: 'BOT', botId: bot.id, walletId: wallet.id,
          positionId: position.id, side: 'BUY', type: 'MARKET', quantity: 1,
          symbol: 'BTCUSDT', price: 90, runtimeDedupeKey: `dca-${id}`,
        } } });
      await prisma.order.create({ data: { id: intent.id, userId: user.id,
        botId: bot.id, walletId: wallet.id, positionId: position.id,
        origin: 'BOT', symbol: 'BTCUSDT', side: 'BUY', type: 'MARKET',
        status: 'OPEN', quantity: 1, exchangeOrderId,
        filledQuantity: 0, feePending: true } });
      await prisma.runtimeExecutionDedupe.create({ data: {
        dedupeKey: `dca-${id}`, dedupeVersion: 'v1', commandType: 'DCA',
        userId: user.id, botId: bot.id, symbol: 'BTCUSDT', status: 'PENDING',
        orderId: intent.id, positionId: position.id,
        commandFingerprint: { positionId: position.id, dcaLevelIndex: 0 },
        ttlExpiresAt: new Date(Date.now() + 86_400_000),
      } });
      const eligible = await listEligibleLiveBinanceAccounts(100);
      expect(eligible.filter((account) => account.userId === user.id))
        .toEqual([expect.objectContaining({ apiKeyId: key.id, marketType: 'FUTURES' })]);

      const fillAt = Date.now() + 1_000;
      const event = normalizeBinanceUserDataStreamEvent('FUTURES', {
        e: 'ORDER_TRADE_UPDATE', E: fillAt, T: fillAt, o: {
          s: 'BTCUSDT', S: 'BUY', o: 'MARKET', X: 'FILLED', x: 'TRADE',
          i: exchangeOrderId, c: clientOrderId, ap: '90', l: '1', z: '1',
          L: '90', n: '0.1', N: 'USDT', t: 991,
        },
      });
      expect(event.eventType).toBe('ORDER_TRADE_UPDATE');
      const wrongAccount = await applyLiveExchangeUserDataStreamEvent({
        userId: user.id, sourceApiKeyId: randomUUID(), event });
      expect(wrongAccount).toMatchObject({ status: 'ignored', reason: 'account_mismatch' });
      expect(await prisma.orderFill.count({ where: { orderId: intent.id } })).toBe(0);

      streamLoop = new LiveBinanceStreamLoop({ redisUrl, namespace,
        leaseMs: 30_000, maxAccounts: 100 }, {
        listAccounts: async () => eligible.filter((account) => account.userId === user.id),
        stream: stream.asService(), decryptKey: (value) => value,
      });
      recoveryLoop = new LiveFillRecoveryLoop({ redisUrl, namespace: recoveryNamespace,
        leaseMs: 2_000, pageLimit: 10, maxPages: 2, minGapMs: 0 }, {
        acceptCandidate: (candidate) => candidate.userId === user.id,
        lookup: async (candidate) => ({ kind: 'FOUND', candidate,
          apiKeyId: key.id, lookupSource: 'ORDER_ID', order: {
            id: exchangeOrderId, symbol: 'BTC/USDT:USDT', side: 'buy',
            status: 'closed', filled: 1, raw: { clientOrderId }, fills: [{
              exchangeTradeId: '991', exchangeOrderId, symbol: 'BTCUSDT',
              side: 'buy', price: 90, quantity: 1, notional: 90,
              feeCost: 0.1, feeCurrency: 'USDT', feeRate: null,
              executedAt: new Date(), source: 'fetchMyTrades', raw: { id: 991 },
            }],
          } }),
      });
      await streamLoop.runOnce();
      stream.open('FUTURES');
      await streamLoop.runOnce();
      const accountUpdateAt = fillAt - 1_000;
      const accountUpdate = normalizeBinanceUserDataStreamEvent('FUTURES', {
        e: 'ACCOUNT_UPDATE', E: accountUpdateAt, T: accountUpdateAt,
        a: { B: [], P: [{ s: 'BTCUSDT', pa: '2', ep: '95', up: '5', ps: 'LONG' }] },
      });
      expect(accountUpdate.eventType).toBe('ACCOUNT_UPDATE');
      stream.emit('FUTURES', accountUpdate);
      await until(async () => (await prisma.position.findUniqueOrThrow({
        where: { id: position.id },
      })).lastExchangeSeenAt?.getTime() === accountUpdateAt);
      expect(await prisma.position.findUniqueOrThrow({ where: { id: position.id } }))
        .toMatchObject({ quantity: 1, entryPrice: 100, lastAccountQuantity: 2,
          lastAccountEntryPrice: 95, continuityState: 'RECOVERING' });
      const polling = recoveryLoop.runOnce();
      stream.emit('FUTURES', event);
      await polling;
      await until(async () => (await prisma.position.findUniqueOrThrow({
        where: { id: position.id },
      })).quantity === 2);
      expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })))
        .toMatchObject({ continuityState: 'RECOVERING', lastAccountQuantity: 2 });
      const afterDcaAt = Math.max(Date.now(), fillAt + 1);
      const afterDcaAccountUpdate = normalizeBinanceUserDataStreamEvent('FUTURES', {
        e: 'ACCOUNT_UPDATE', E: afterDcaAt, T: afterDcaAt,
        a: { B: [], P: [{ s: 'BTCUSDT', pa: '2', ep: '95', up: '4', ps: 'LONG' }] },
      });
      stream.emit('FUTURES', afterDcaAccountUpdate);
      stream.emit('FUTURES', event);
      stream.emit('FUTURES', accountUpdate);
      stream.emit('FUTURES', afterDcaAccountUpdate);
      await until(async () => (await prisma.position.findUniqueOrThrow({
        where: { id: position.id },
      })).lastExchangeSeenAt?.getTime() === afterDcaAt);
      await applyLiveExchangeUserDataStreamEvent({ userId: user.id,
        sourceApiKeyId: key.id, event });
      expect(await prisma.orderFill.count({ where: { orderId: intent.id } })).toBe(1);
      expect(await prisma.trade.count({ where: { orderId: intent.id } })).toBe(1);
      expect(await prisma.botRuntimeEvent.count({ where: { userId: user.id,
        eventType: 'DCA_EXECUTED' } })).toBe(1);
      expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })))
        .toMatchObject({ quantity: 2, entryPrice: 95, continuityState: 'CONFIRMED',
          lastAccountQuantity: 2, missingSyncCount: 0 });
      expect(await prisma.order.count({ where: { id: intent.id } })).toBe(1);

      const closeClientOrderId = `soar_${id.replace(/-/g, '').slice(0, 20)}cl`;
      const closeIntent = await prisma.liveOrderIntent.create({ data: {
        userId: user.id, clientOrderId: closeClientOrderId, payloadHash: `close-${id}`,
        exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'BTCUSDT',
        payload: { mode: 'LIVE', origin: 'BOT', botId: bot.id,
          walletId: wallet.id, positionId: position.id, side: 'SELL',
          type: 'MARKET', quantity: 2, symbol: 'BTCUSDT', price: 110 },
      } });
      const closeOrder = await prisma.order.create({ data: {
        id: closeIntent.id,
        userId: user.id, botId: bot.id, walletId: wallet.id, positionId: position.id,
        origin: 'BOT', symbol: 'BTCUSDT', side: 'SELL', type: 'MARKET',
        status: 'OPEN', quantity: 2, exchangeOrderId: '67890',
        filledQuantity: 0, feePending: true,
      } });
      const beforeCloseAt = Math.max(Date.now(), afterDcaAt + 1);
      const beforeCloseAccountUpdate = normalizeBinanceUserDataStreamEvent('FUTURES', {
        e: 'ACCOUNT_UPDATE', E: beforeCloseAt, T: beforeCloseAt,
        a: { B: [], P: [{ s: 'BTCUSDT', pa: '0', ep: '0', up: '0', ps: 'LONG' }] },
      });
      stream.emit('FUTURES', beforeCloseAccountUpdate);
      await until(async () => (await prisma.position.findUniqueOrThrow({
        where: { id: position.id },
      })).lastExchangeSeenAt?.getTime() === beforeCloseAt);
      expect(await prisma.position.findUniqueOrThrow({ where: { id: position.id } }))
        .toMatchObject({ status: 'OPEN', syncState: 'IN_SYNC', quantity: 2,
          entryPrice: 95, lastAccountQuantity: 0,
          continuityState: 'RECOVERING' });
      const closeEvent = normalizeBinanceUserDataStreamEvent('FUTURES', {
        e: 'ORDER_TRADE_UPDATE', E: beforeCloseAt + 1, T: beforeCloseAt + 1, o: {
          s: 'BTCUSDT', S: 'SELL', o: 'MARKET', X: 'FILLED', x: 'TRADE',
          i: '67890', c: closeClientOrderId, ap: '110', l: '2', z: '2',
          L: '110', n: '0.2', N: 'USDT', t: 992,
        },
      });
      stream.emit('FUTURES', closeEvent);
      stream.emit('FUTURES', beforeCloseAccountUpdate);
      await until(async () => (await prisma.position.findUniqueOrThrow({
        where: { id: position.id },
      })).status === 'CLOSED');
      await streamLoop.stop();
      await applyLiveExchangeUserDataStreamEvent({ userId: user.id,
        sourceApiKeyId: key.id, event: closeEvent });
      expect(await prisma.orderFill.count({ where: { orderId: closeOrder.id } })).toBe(1);
      expect(await prisma.trade.count({ where: { orderId: closeOrder.id } })).toBe(1);
      expect(await prisma.botRuntimeEvent.count({ where: { userId: user.id,
        eventType: 'POSITION_CLOSED' } })).toBe(1);
      expect(await prisma.position.findUniqueOrThrow({ where: { id: position.id } }))
        .toMatchObject({ status: 'CLOSED', quantity: 2, entryPrice: 95,
          lastAccountQuantity: 0, continuityState: 'EXTERNAL_CLOSE_CONFIRMED' });
    } finally {
      await streamLoop?.stop();
      await recoveryLoop?.stop();
      if (redis.isOpen) {
        const keys = await redis.keys(`${namespace}:*`);
        if (keys.length) await redis.del(keys);
        await redis.quit();
      }
      if (userId) {
        await prisma.log.deleteMany({ where: { userId } });
        await prisma.botRuntimeSymbolStat.deleteMany({ where: { userId } });
        await prisma.botRuntimeEvent.deleteMany({ where: { userId } });
        await prisma.runtimeExecutionDedupe.deleteMany({ where: { userId } });
        await prisma.orderFill.deleteMany({ where: { userId } });
        await prisma.trade.deleteMany({ where: { userId } });
        await prisma.order.deleteMany({ where: { userId } });
        await prisma.liveOrderIntent.deleteMany({ where: { userId } });
        await prisma.position.deleteMany({ where: { userId } });
        await prisma.botRuntimeSession.deleteMany({ where: { userId } });
        await prisma.bot.deleteMany({ where: { userId } });
        await prisma.wallet.deleteMany({ where: { userId } });
        await prisma.apiKey.deleteMany({ where: { userId } });
        await prisma.user.deleteMany({ where: { id: userId } });
      }
    }
  }, 60_000);
});
