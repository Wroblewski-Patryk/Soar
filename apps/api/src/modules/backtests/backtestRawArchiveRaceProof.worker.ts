import { createHash } from 'node:crypto';
import { strToU8, zipSync } from 'fflate';
import { prisma } from '../../prisma/client';
import { digestVerifiedBinanceFuturesIntrabar } from './backtestBinanceFuturesIntrabarSource';
import { fetchVerifiedDailyUsdMArchive, readVerifiedRunArchive,
  saveVerifiedRunArchive } from './backtestBinanceFuturesIntrabarArchive';

const db = new URL(process.env.DATABASE_URL ?? '');
const runId = process.env.SOAR_RAW_RACE_RUN_ID ?? '';
const variant = process.env.SOAR_RAW_RACE_VARIANT ?? '';
const role = process.env.SOAR_RAW_RACE_ROLE ?? '';
if (process.env.SOAR_RAW_RACE_PROOF !== '1' ||
    db.pathname.slice(1) !== 'soar_011a_raw_race_test' ||
    db.hostname !== '127.0.0.1' || !db.port || db.port === '5432' ||
    !runId || !['same', 'changed', 'bad-checksum'].includes(variant) ||
    !['save', 'save-hold', 'offline-retry'].includes(role))
  throw new Error('Raw race worker requires the dedicated local test database');

const start = Date.parse('2020-01-01T23:58:00.000Z');
const candles = [0, 1, 2, 3].map((index) => ({
  openTime: start + index * 60_000,
  closeTime: start + (index + 1) * 60_000 - 1,
  open: 100, high: 100, low: 100, close: 100, volume: 2,
}));
const rows = [
  [100, 100, 1, 200, 200, start - 500, false],
  ...[0, 1, 2, 3].flatMap((minute) => [1, 2].map((second) => {
    const index = minute * 2 + second;
    return [100 + index, 100, 1, 200 + index, 200 + index,
      start + minute * 60_000 + second,
      variant === 'changed' && index === 5];
  })),
  [109, 100, 1, 209, 209, start + 240_500, false],
];
const days = ['2020-01-01', '2020-01-02'];
const payloads = new Map(days.map((day) => {
  const basename = `BTCUSDT-aggTrades-${day}.zip`;
  const csv = ['agg_trade_id,price,quantity,first_trade_id,last_trade_id,transact_time,is_buyer_maker',
    ...rows.filter((row) => new Date(Number(row[5])).toISOString().slice(0, 10) === day)
      .map((row) => row.join(','))].join('\n');
  const zip = zipSync({ [basename.replace('.zip', '.csv')]: strToU8(csv) },
    { level: 0, mtime: new Date('2020-01-01T00:00:00.000Z') });
  return [day, { basename, zip,
    checksum: createHash('sha256').update(zip).digest('hex') }] as const;
}));
const fetcher = (async (url: string) => {
  const day = days.find((value) => url.includes(value));
  const payload = day && payloads.get(day);
  if (!payload) throw new Error('Unexpected archive URL');
  return new Response(url.endsWith('.CHECKSUM')
    ? `${variant === 'bad-checksum' && day === days[1] ? '0'.repeat(64) : payload.checksum}  ${payload.basename}\n`
    : payload.zip, { status: 200 });
}) as typeof fetch;

const emit = (name: string, value: unknown) =>
  process.stdout.write(`${name} ${JSON.stringify(value)}\n`);
const barrier = () => new Promise<void>((resolveBarrier) => {
  process.stdin.once('data', (chunk: Buffer) => {
    if (chunk.toString() !== 'GO\n') throw new Error('Invalid race barrier');
    resolveBarrier();
  });
});

const main = async () => {
  try {
    if (role === 'offline-retry') {
      globalThis.fetch = (async () => { throw new Error('NETWORK_FORBIDDEN'); }) as typeof fetch;
      const persisted = await readVerifiedRunArchive(runId, 'BTCUSDT', start,
        start + 4 * 60_000);
      if (!persisted) throw new Error('Persisted archive missing on retry');
      emit('OFFLINE_READ', { digest: digestVerifiedBinanceFuturesIntrabar(persisted, 'BTCUSDT'),
        proof: persisted[0].intrabarProvenance.archiveProof });
    }
    const { snapshot, rawArchives, verified: sourceVerified } = await fetchVerifiedDailyUsdMArchive({
      symbol: 'BTCUSDT', candles, fetcher,
    });
    emit('READY', { pid: process.pid,
      digest: digestVerifiedBinanceFuturesIntrabar(sourceVerified, 'BTCUSDT'),
      zipShas: snapshot.archives.map((archive) => archive.zipSha256) });
    await barrier();
    const verified = await saveVerifiedRunArchive(runId, snapshot, rawArchives);
    if (!verified) throw new Error('Verified archive missing after save');
    emit(role === 'save-hold' ? 'SAVED_HOLD' : 'RESULT', {
      pid: process.pid,
      digest: digestVerifiedBinanceFuturesIntrabar(verified, 'BTCUSDT'),
      proof: verified[0].intrabarProvenance.archiveProof,
      zipShas: snapshot.archives.map((archive) => archive.zipSha256),
    });
    if (role === 'save-hold') await new Promise<void>(() => { setInterval(() => {}, 1_000); });
  } catch (error) {
    emit('ERROR', { pid: process.pid, message: (error as Error).message });
    process.exitCode = 1;
  } finally { await prisma.$disconnect(); }
};

void main();
