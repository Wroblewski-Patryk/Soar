import { createClient } from 'redis';
import { prisma } from '../prisma/client';
import { lookupLiveFillCandidate } from '../modules/exchange/liveFillLookup.service';
import { recoverLiveFillCandidateOnce } from '../modules/orders/orders.liveFillRecovery.service';
import type { CcxtFuturesOrderResult } from '../modules/exchange/ccxtFuturesConnector.types';
import { LiveFillRecoveryLoop } from './liveFillRecoveryLoop';

if (process.env.SOAR_LIVE_FILL_PROCESS_PROOF !== '1') {
  throw new Error('Process proof worker is test-only');
}
const database = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
const redisUrl = process.env.REDIS_URL ?? '';
const redisHost = new URL(redisUrl).hostname;
if (!database.endsWith('_test') || !['localhost', '127.0.0.1'].includes(redisHost)) {
  throw new Error('Process proof requires a local Redis and isolated _test database');
}
const namespace = process.env.SOAR_LIVE_FILL_PROOF_NAMESPACE!;
const userId = process.env.SOAR_LIVE_FILL_PROOF_USER_ID!;
const dcaOrderId = process.env.SOAR_LIVE_FILL_PROOF_DCA_ORDER_ID!;
const role = process.env.SOAR_LIVE_FILL_PROOF_ROLE ?? 'normal';
if (!namespace || !userId || !dcaOrderId) throw new Error('Process proof scope missing');
const redis = createClient({ url: redisUrl });
redis.on('error', () => undefined);

let active = role !== 'standby';
process.stdin.on('data', (data: Buffer) => {
  if (data.toString().includes('ACTIVATE')) active = true;
});
const readSnapshot = async (orderId: string) => {
  await redis.incr(`${namespace}:venue-reads:${orderId}`);
  const raw = await redis.get(`${namespace}:snapshot:${orderId}`);
  if (!raw) throw new Error('No deterministic venue snapshot');
  const order = JSON.parse(raw) as CcxtFuturesOrderResult;
  const fills = (order.fills ?? []).map((fill) => ({ ...fill,
    executedAt: fill.executedAt ? new Date(String(fill.executedAt)) : null }));
  return { ...order, fills };
};

const loop = new LiveFillRecoveryLoop({
  redisUrl, namespace, intervalMs: 1_000, leaseMs: 2_000,
  pageLimit: 10, maxPages: 2, minGapMs: 20, lookupTimeoutMs: 2_000,
  appliedCooldownMs: 300,
}, {
  acceptCandidate: (candidate) => active && candidate.userId === userId,
  lookup: (candidate) => lookupLiveFillCandidate(candidate, { createConnector: () => ({
    fetchOrderWithFills: async ({ orderId }) => {
      const order = await readSnapshot(candidate.orderId);
      if (order.id !== orderId) throw new Error('Venue order ID mismatch');
      return { order, fills: order.fills };
    },
    fetchOrderByClientOrderId: async () => readSnapshot(candidate.orderId),
    fetchClosedOrdersPage: async () => [await readSnapshot(candidate.orderId)],
    fetchTradesForOrder: async () => (await readSnapshot(candidate.orderId)).fills,
    disconnect: async () => undefined,
  }) }),
  finalize: (candidate, found) => recoverLiveFillCandidateOnce({ candidate,
    lookup: async () => found,
    afterCoreCommit: role === 'crash-final' && candidate.orderId === dcaOrderId &&
      found.order.status === 'closed'
      ? async () => { await new Promise<void>(() => {
          process.stdout.write('DB_COMMITTED_BEFORE_CACHE\n', () => process.exit(17));
        }); }
      : undefined,
  }),
  onEvent: (event, detail) => {
    process.stdout.write(`${event.toUpperCase()}${detail ? `:${detail}` : ''}\n`);
  },
});
void redis.connect().then(() => {
  loop.start();
  process.stdout.write('READY\n');
}).catch((error) => {
  process.stderr.write(`Redis process proof connection failed: ${String(error)}\n`);
  process.exitCode = 1;
});

let stopping = false;
const shutdown = async () => {
  if (stopping) return;
  stopping = true;
  await loop.stop();
  if (redis.isOpen) await redis.quit();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', () => { void shutdown(); });
process.on('SIGTERM', () => { void shutdown(); });
