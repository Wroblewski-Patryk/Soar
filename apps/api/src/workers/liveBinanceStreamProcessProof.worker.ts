import { prisma } from '../prisma/client';
import type { BinanceUserDataStreamService } from
  '../modules/exchange/binanceUserDataStream.service';
import type { LiveBinanceAccount } from './liveBinanceStreamLoop';
import { LiveBinanceStreamLoop } from './liveBinanceStreamLoop';

if (process.env.SOAR_LIVE_STREAM_PROCESS_PROOF !== '1') {
  throw new Error('Stream proof worker is test-only');
}
const database = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
const redisUrl = process.env.REDIS_URL ?? '';
if (!database.endsWith('_test') ||
    !['localhost', '127.0.0.1'].includes(new URL(redisUrl).hostname)) {
  throw new Error('Stream proof requires isolated _test database and local Redis');
}
const namespace = process.env.SOAR_LIVE_STREAM_PROOF_NAMESPACE!;
const apiKeyId = process.env.SOAR_LIVE_STREAM_PROOF_KEY_ID!;
const userId = process.env.SOAR_LIVE_STREAM_PROOF_USER_ID!;
if (!namespace || !apiKeyId || !userId) throw new Error('Stream proof scope missing');
const account: LiveBinanceAccount = { userId, apiKeyId, marketType: 'SPOT',
  encryptedApiKey: 'test-only', encryptedApiSecret: 'test-only',
  updatedAt: new Date('2026-01-01T00:00:00.000Z') };
const stream = {
  connectSignedSpot: (input: { onOpen?: () => void; onPong?: () => void }) => {
    queueMicrotask(() => input.onOpen?.());
    return { marketType: 'SPOT' as const, listenKey: null,
      ping: () => input.onPong?.(), close: () => undefined };
  },
} as unknown as BinanceUserDataStreamService;
const loop = new LiveBinanceStreamLoop({ redisUrl, namespace, intervalMs: 100,
  leaseMs: 2_000, maxAccounts: 1 }, {
  listAccounts: async () => [account], stream,
  decryptKey: (value) => value,
  onState: (state) => process.stdout.write(`${state.toUpperCase()}\n`),
});
loop.start();
process.stdout.write('READY\n');
let stopping = false;
const shutdown = async () => {
  if (stopping) return;
  stopping = true;
  await loop.stop();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', () => { void shutdown(); });
process.on('SIGTERM', () => { void shutdown(); });
process.stdin.on('data', (data: Buffer) => {
  if (data.toString().includes('CRASH')) process.exit(17);
  if (data.toString().includes('STOP')) void shutdown();
});
