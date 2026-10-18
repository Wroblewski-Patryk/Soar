import { randomUUID } from 'node:crypto';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { resolve } from 'node:path';
import { createClient } from 'redis';
import { describe, expect, it } from 'vitest';
import { prisma } from '../prisma/client';
import { selectRuntimeDisplayState } from '../modules/bots/runtimeSessionPositionsRead.service';
import { readLiveExecutionOperationalStatus } from '../observability/liveExecutionOperationalStatus';

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const until = async (predicate: () => Promise<boolean>, timeoutMs = 25_000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await pause(100);
  }
  throw new Error('Timed out waiting for LIVE fill process proof');
};
type ProofProcess = { child: ChildProcessWithoutNullStreams; lines: string[] };
const start = (role: string, input: { namespace: string; userId: string; dcaOrderId: string;
  redisUrl: string }): ProofProcess => {
  const child = spawn(process.execPath, ['--import', 'tsx',
    resolve(process.cwd(), 'src/workers/liveFillRecoveryProcessProof.worker.ts')], {
    cwd: process.cwd(), stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: 'development',
      SOAR_LIVE_FILL_PROCESS_PROOF: '1', SOAR_LIVE_FILL_PROOF_ROLE: role,
      SOAR_LIVE_FILL_PROOF_NAMESPACE: input.namespace,
      SOAR_LIVE_FILL_PROOF_USER_ID: input.userId,
      SOAR_LIVE_FILL_PROOF_DCA_ORDER_ID: input.dcaOrderId,
      REDIS_URL: input.redisUrl },
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
  return { child, lines };
};
const fill = (id: string, orderId: string, side: 'buy' | 'sell',
  quantity: number, price: number, feeCost: number | null) => ({
  exchangeTradeId: id, exchangeOrderId: orderId, symbol: 'BTCUSDT', side,
  price, quantity, notional: quantity * price, feeCost, feeCurrency: 'USDT',
  feeRate: null, executedAt: new Date().toISOString(),
  source: 'fetchMyTrades', raw: { id },
});
const snapshot = (input: { venueId: string; clientOrderId: string;
  side: 'buy' | 'sell'; status: 'open' | 'closed'; filled: number;
  fills: ReturnType<typeof fill>[] }) => ({
  id: input.venueId, symbol: 'BTC/USDT:USDT', side: input.side,
  status: input.status, filled: input.filled, fills: input.fills,
  raw: { clientOrderId: input.clientOrderId },
});

const runtimeIt = process.env.RUN_LIVE_FILL_PROCESS_PROOF === '1' ? it : it.skip;
describe('LIVE fill recovery with two worker processes and local Redis', () => {
  runtimeIt('takes over after a post-commit crash, settles partial/final/late fee, then closes once', async () => {
    const database = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
    const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';
    if (!database.endsWith('_test') ||
        !['localhost', '127.0.0.1'].includes(new URL(redisUrl).hostname)) {
      throw new Error('Process proof requires local Redis and isolated _test database');
    }
    const namespace = `soar:live-fill-proof:${randomUUID()}`;
    const redis = createClient({ url: redisUrl });
    redis.on('error', () => undefined);
    const processes: ProofProcess[] = [];
    let userId: string | null = null;
    let positionId: string | null = null;
    try {
      await redis.connect();
      const id = randomUUID();
      const user = await prisma.user.create({ data: {
        email: `live-fill-proof-${id}@example.test`, password: 'test-only',
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
      positionId = position.id;
      const dcaClientId = `soar_${id.replace(/-/g, '').slice(0, 22)}`;
      const dcaVenueId = `venue-${id}`;
      const intent = await prisma.liveOrderIntent.create({ data: { userId: user.id,
        clientOrderId: dcaClientId, payloadHash: id, exchange: 'BINANCE',
        marketType: 'FUTURES', symbol: 'BTCUSDT', payload: {
          mode: 'LIVE', origin: 'BOT', botId: bot.id, walletId: wallet.id,
          positionId: position.id, side: 'BUY', type: 'MARKET', quantity: 1,
          symbol: 'BTCUSDT', price: 90, runtimeDedupeKey: `dca-${id}`,
        } } });
      await prisma.order.create({ data: { id: intent.id, userId: user.id,
        botId: bot.id, walletId: wallet.id, positionId: position.id,
        origin: 'BOT', symbol: 'BTCUSDT', side: 'BUY', type: 'MARKET',
        status: 'OPEN', quantity: 1, exchangeOrderId: dcaVenueId,
        filledQuantity: 0, feePending: true } });
      await prisma.runtimeExecutionDedupe.create({ data: {
        dedupeKey: `dca-${id}`, dedupeVersion: 'v1', commandType: 'DCA',
        userId: user.id, botId: bot.id, symbol: 'BTCUSDT', status: 'PENDING',
        orderId: intent.id, positionId: position.id,
        commandFingerprint: { positionId: position.id, dcaLevelIndex: 0 },
        ttlExpiresAt: new Date(Date.now() + 86_400_000),
      } });
      const first = fill(`dca-first-${id}`, dcaVenueId, 'buy', 0.4, 90, null);
      const second = fill(`dca-second-${id}`, dcaVenueId, 'buy', 0.6, 90, null);
      await redis.set(`runtime:position-state:${position.id}`, JSON.stringify({
        quantity: 1, averageEntryPrice: 100, currentAdds: 0, trailingAnchorPrice: 100,
      }));
      await redis.set(`${namespace}:snapshot:${intent.id}`, JSON.stringify(snapshot({
        venueId: dcaVenueId, clientOrderId: dcaClientId,
        side: 'buy', status: 'open', filled: 0.4, fills: [first],
      })));

      const crash = start('crash-final', { namespace, userId: user.id,
        dcaOrderId: intent.id, redisUrl });
      processes.push(crash);
      await until(async () => crash.lines.includes('READY'));
      await until(async () => (await prisma.orderFill.count({ where: { orderId: intent.id } })) === 1);
      expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).quantity).toBe(1);
      expect(await prisma.trade.count({ where: { orderId: intent.id } })).toBe(0);
      const standby = start('standby', { namespace, userId: user.id,
        dcaOrderId: intent.id, redisUrl });
      processes.push(standby);
      await until(async () => standby.lines.includes('READY'));
      await redis.set(`${namespace}:snapshot:${intent.id}`, JSON.stringify(snapshot({
        venueId: dcaVenueId, clientOrderId: dcaClientId,
        side: 'buy', status: 'closed', filled: 1, fills: [first, second],
      })));
      await until(async () => crash.lines.includes('DB_COMMITTED_BEFORE_CACHE'));
      await until(async () => crash.child.exitCode === 17);
      const committed = await prisma.position.findUniqueOrThrow({ where: { id: position.id } });
      expect(committed).toMatchObject({ quantity: 2, entryPrice: 95 });
      expect(await prisma.orderFill.count({ where: { orderId: intent.id } })).toBe(2);
      expect(await prisma.trade.count({ where: { orderId: intent.id } })).toBe(1);
      expect(await prisma.botRuntimeEvent.count({ where: { userId: user.id,
        eventType: 'DCA_EXECUTED' } })).toBe(1);
      const stale = JSON.parse((await redis.get(`runtime:position-state:${position.id}`))!);
      expect(stale).toMatchObject({ quantity: 1, averageEntryPrice: 100 });
      expect(selectRuntimeDisplayState({ position: committed, runtimeSnapshot: null,
        persistedState: stale })).toBeNull();
      expect(await redis.hGet(`${namespace}:pending:data`, intent.id)).not.toBeNull();

      standby.child.stdin.write('ACTIVATE\n');
      await until(async () => {
        const raw = await redis.get(`runtime:position-state:${position.id}`);
        return raw != null && JSON.parse(raw).quantity === 2 &&
          await redis.hGet(`${namespace}:pending:data`, intent.id) == null;
      });
      const recoveredCache = JSON.parse((await redis.get(`runtime:position-state:${position.id}`))!);
      expect(recoveredCache).toMatchObject({ quantity: 2, averageEntryPrice: 95,
        currentAdds: 1, trailingAnchorPrice: 100 });
      await redis.set(`${namespace}:snapshot:${intent.id}`, JSON.stringify(snapshot({
        venueId: dcaVenueId, clientOrderId: dcaClientId,
        side: 'buy', status: 'closed', filled: 1,
        fills: [{ ...first, feeCost: 0.04 }, { ...second, feeCost: 0.06 }],
      })));
      await until(async () => !(await prisma.order.findUniqueOrThrow({
        where: { id: intent.id }, select: { feePending: true },
      })).feePending);
      expect((await prisma.order.findUniqueOrThrow({ where: { id: intent.id } })).fee).toBeCloseTo(0.1);
      expect(await prisma.trade.count({ where: { orderId: intent.id } })).toBe(1);
      expect(await prisma.botRuntimeEvent.count({ where: { userId: user.id,
        eventType: 'DCA_EXECUTED' } })).toBe(1);

      const peer = start('normal', { namespace, userId: user.id,
        dcaOrderId: intent.id, redisUrl });
      processes.push(peer);
      await until(async () => peer.lines.includes('READY'));
      // A fully settled order is absent from the fill selector. Remove every
      // Redis recovery marker, while leaving the pre-DCA cache behind.
      await prisma.runtimeExecutionDedupe.update({ where: { dedupeKey: `dca-${id}` },
        data: { status: 'PENDING' } });
      await redis.set(`runtime:position-state:${position.id}`, JSON.stringify(stale));
      await redis.hDel(`${namespace}:pending:data`, intent.id);
      await redis.zRem(`${namespace}:pending:due`, intent.id);
      await redis.zRem(`${namespace}:pending:created`, intent.id);
      await until(async () => await redis.zScore(`${namespace}:repair:pending`, position.id) != null);
      await until(async () => {
        const raw = await redis.get(`${namespace}:status`);
        return raw != null && JSON.parse(raw).cacheRepairPendingCount === 1;
      });
      const pendingStatus = await readLiveExecutionOperationalStatus({
        redisUrl, recoveryNamespace: namespace,
      });
      expect(pendingStatus.recovery).toMatchObject({ status: 'degraded',
        cacheRepairPendingCount: 1 });
      expect(pendingStatus.recovery.oldestCacheRepairAgeMs).toBeGreaterThanOrEqual(0);
      expect(selectRuntimeDisplayState({ position: await prisma.position.findUniqueOrThrow({
        where: { id: position.id } }), runtimeSnapshot: null, persistedState: stale })).toBeNull();
      await prisma.runtimeExecutionDedupe.update({ where: { dedupeKey: `dca-${id}` },
        data: { status: 'SUCCEEDED' } });
      try {
        await until(async () => {
          const raw = await redis.get(`runtime:position-state:${position.id}`);
          return raw != null && JSON.parse(raw).quantity === 2 &&
            await redis.zScore(`${namespace}:repair:pending`, position.id) == null;
        });
      } catch (error) {
        throw new Error(`${String(error)}; standby=${standby.lines.slice(-12).join(',')}; ` +
          `peer=${peer.lines.slice(-12).join(',')}`);
      }
      expect(JSON.parse((await redis.get(`runtime:position-state:${position.id}`))!))
        .toMatchObject({ quantity: 2, averageEntryPrice: 95, currentAdds: 1 });
      expect(await prisma.orderFill.count({ where: { orderId: intent.id } })).toBe(2);
      expect(await prisma.trade.count({ where: { orderId: intent.id } })).toBe(1);
      expect(await prisma.botRuntimeEvent.count({ where: { userId: user.id,
        eventType: 'DCA_EXECUTED' } })).toBe(1);

      // A lost or incomplete tracker must remain visible to both workers even
      // when the database quantity and average already match the cache.
      for (const damaged of [null, JSON.stringify({
        ...recoveredCache, trailingTakeProfitHighPercent: 120 / 95 - 1,
        trailingTakeProfitActiveLevelIndex: 0,
      })]) {
        if (damaged == null) await redis.del(`runtime:position-state:${position.id}`);
        else await redis.set(`runtime:position-state:${position.id}`, damaged);
        await until(async () => await redis.zScore(`${namespace}:repair:pending`, position.id) != null);
        const observed = await redis.get(`runtime:position-state:${position.id}`);
        expect(observed).toBe(damaged);
        expect((await readLiveExecutionOperationalStatus({
          redisUrl, recoveryNamespace: namespace,
        })).recovery.cacheRepairPendingCount).toBe(1);
        await redis.set(`runtime:position-state:${position.id}`, JSON.stringify(recoveredCache));
        await until(async () => await redis.zScore(`${namespace}:repair:pending`, position.id) == null);
      }

      const closeId = randomUUID();
      const closeClientId = `soar_${closeId.replace(/-/g, '').slice(0, 22)}`;
      const closeVenueId = `venue-${closeId}`;
      const closeIntent = await prisma.liveOrderIntent.create({ data: { userId: user.id,
        clientOrderId: closeClientId, payloadHash: closeId, exchange: 'BINANCE',
        marketType: 'FUTURES', symbol: 'BTCUSDT', payload: {
          mode: 'LIVE', origin: 'BOT', botId: bot.id, walletId: wallet.id,
          positionId: position.id, side: 'SELL', type: 'MARKET', quantity: 2,
          symbol: 'BTCUSDT', price: 110, runtimeDedupeKey: `close-${closeId}`,
        } } });
      await prisma.order.create({ data: { id: closeIntent.id, userId: user.id,
        botId: bot.id, walletId: wallet.id, positionId: position.id,
        origin: 'BOT', symbol: 'BTCUSDT', side: 'SELL', type: 'MARKET',
        status: 'OPEN', quantity: 2, exchangeOrderId: closeVenueId,
        filledQuantity: 0, feePending: true } });
      await prisma.runtimeExecutionDedupe.create({ data: {
        dedupeKey: `close-${closeId}`, dedupeVersion: 'v1', commandType: 'CLOSE',
        userId: user.id, botId: bot.id, symbol: 'BTCUSDT', status: 'PENDING',
        orderId: closeIntent.id, positionId: position.id,
        commandFingerprint: { positionId: position.id },
        ttlExpiresAt: new Date(Date.now() + 86_400_000),
      } });
      await redis.set(`${namespace}:snapshot:${closeIntent.id}`, JSON.stringify(snapshot({
        venueId: closeVenueId, clientOrderId: closeClientId,
        side: 'sell', status: 'closed', filled: 2,
        fills: [fill(`close-fill-${closeId}`, closeVenueId, 'sell', 2, 110, 0.1)],
      })));
      await until(async () => (await prisma.position.findUniqueOrThrow({
        where: { id: position.id }, select: { status: true },
      })).status === 'CLOSED');
      await until(async () => await redis.get(`runtime:position-state:${position.id}`) == null);
      await redis.set(`runtime:position-state:${position.id}`, JSON.stringify(recoveredCache));
      await redis.hDel(`${namespace}:pending:data`, closeIntent.id);
      await redis.zRem(`${namespace}:pending:due`, closeIntent.id);
      await redis.zRem(`${namespace}:pending:created`, closeIntent.id);
      await until(async () => await redis.get(`runtime:position-state:${position.id}`) == null);
      expect(await prisma.trade.count({ where: { orderId: closeIntent.id } })).toBe(1);
      expect(await prisma.botRuntimeEvent.count({ where: { userId: user.id,
        eventType: 'POSITION_CLOSED' } })).toBe(1);
      expect(selectRuntimeDisplayState({ position: await prisma.position.findUniqueOrThrow({
        where: { id: position.id } }), runtimeSnapshot: null, persistedState: stale })).toBeNull();
      expect(standby.lines.some((line) => line === 'LEASE_ACQUIRED')).toBe(true);

      const unknownId = randomUUID();
      const unknownIntent = await prisma.liveOrderIntent.create({ data: {
        userId: user.id,
        clientOrderId: `soar_${unknownId.replace(/-/g, '').slice(0, 22)}`,
        payloadHash: unknownId, exchange: 'BINANCE', marketType: 'FUTURES',
        symbol: 'BTCUSDT', payload: { mode: 'LIVE', origin: 'BOT',
          botId: bot.id, walletId: wallet.id, positionId: null,
          side: 'BUY', type: 'MARKET', quantity: 1, symbol: 'BTCUSDT', price: 100,
        },
      } });
      await until(async () => await redis.exists(`${namespace}:cool:${unknownIntent.id}`) === 1);
      await pause(1_200);
      expect(Number(await redis.get(`${namespace}:venue-reads:${unknownIntent.id}`))).toBe(1);
      expect(await prisma.order.count({ where: { id: unknownIntent.id } })).toBe(0);
      expect(await prisma.orderFill.count({ where: { orderId: unknownIntent.id } })).toBe(0);
      expect(await prisma.trade.count({ where: { orderId: unknownIntent.id } })).toBe(0);
    } finally {
      for (const proof of processes) {
        if (proof.child.exitCode === null) {
          proof.child.kill('SIGTERM');
          await Promise.race([new Promise((resolve) => proof.child.once('close', resolve)), pause(5_000)]);
          if (proof.child.exitCode === null) proof.child.kill();
        }
      }
      if (redis.isOpen) {
        const keys = await redis.keys(`${namespace}:*`);
        if (keys.length) await redis.del(keys);
        if (positionId) await redis.del(`runtime:position-state:${positionId}`);
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
  }, 90_000);
});
