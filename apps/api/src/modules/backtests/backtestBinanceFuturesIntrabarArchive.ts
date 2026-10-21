import { createHash } from 'node:crypto';
import { unzipSync } from 'fflate';
import { Exchange, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { fetchVerifiedBinanceFuturesIntrabar,
  type VerifiedIntrabarCandle } from './backtestBinanceFuturesIntrabarSource';
import { fetchKlines, type BacktestKlineCandle,
  type BacktestMarketType } from './backtestDataGateway';

const MAX_ZIP_BYTES = 8 * 1024 * 1024;
const MAX_CSV_BYTES = 64 * 1024 * 1024;
const MAX_ROWS = 20_000;
const DAY_MS = 86_400_000;
const BOUNDARY_MS = 1_000;
type Row = { a: number; p: string; q: string; f: number; l: number; T: number; m: boolean };
type Snapshot = {
  version: 1;
  symbol: string;
  day: string;
  startTimeMs: number;
  endTimeMs: number;
  archiveUrl: string;
  zipSha256: string;
  candles: BacktestKlineCandle[];
  rows: Row[];
};

const fail = (reason: string): never => {
  throw new Error(`BACKTEST_INTRABAR_ARCHIVE_${reason}`);
};
const sha256 = (value: Uint8Array | string) =>
  createHash('sha256').update(value).digest('hex');
const canonical = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) =>
      `${JSON.stringify(key)}:${canonical(record[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
};
const snapshotHash = (snapshot: Snapshot) => sha256(canonical(snapshot));

const exactDay = (startTimeMs: number, endTimeMs: number) => {
  if (!Number.isSafeInteger(startTimeMs) || !Number.isSafeInteger(endTimeMs) ||
      startTimeMs % 60_000 !== 0 || endTimeMs % 60_000 !== 0 ||
      endTimeMs <= startTimeMs || endTimeMs - startTimeMs > 120 * 60_000 ||
      endTimeMs >= Date.now() - 48 * 60 * 60_000) fail('WINDOW_UNAVAILABLE');
  const dayStart = Math.floor(startTimeMs / DAY_MS) * DAY_MS;
  if (startTimeMs < dayStart + BOUNDARY_MS ||
      endTimeMs + BOUNDARY_MS >= dayStart + DAY_MS) fail('SINGLE_DAY_REQUIRED');
  return new Date(dayStart).toISOString().slice(0, 10);
};
const archiveUrls = (symbol: string, day: string) => {
  if (!/^[A-Z0-9]{4,24}$/.test(symbol) || !/^\d{4}-\d{2}-\d{2}$/.test(day))
    fail('INVALID_PATH');
  const basename = `${symbol}-aggTrades-${day}.zip`;
  return { basename,
    url: `https://data.binance.vision/data/futures/um/daily/aggTrades/${symbol}/${basename}` };
};
const readBounded = async (url: string, maxBytes: number, fetcher: typeof fetch) => {
  const response = await fetcher(url, { signal: AbortSignal.timeout(20_000) });
  const body = response.body;
  if (!response.ok || !body) throw new Error('BACKTEST_INTRABAR_ARCHIVE_FETCH_FAILED');
  const length = Number(response.headers.get('content-length'));
  if (Number.isFinite(length) && length > maxBytes) fail('LIMIT');
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) fail('LIMIT');
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const buffer = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.byteLength; }
  return buffer;
};

// Refuse large or multi-entry ZIPs before decompression. The one-entry daily
// archive is deliberately bounded; larger symbols fail rather than exhaust RAM.
const assertZipShape = (zip: Uint8Array, csvName: string) => {
  const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  let eocd = -1;
  for (let i = zip.length - 22; i >= Math.max(0, zip.length - 65_557); i -= 1) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0 || view.getUint16(eocd + 10, true) !== 1) fail('BAD_ZIP');
  const directory = view.getUint32(eocd + 16, true);
  if (directory + 46 > zip.length || view.getUint32(directory, true) !== 0x02014b50)
    fail('BAD_ZIP');
  const compressed = view.getUint32(directory + 20, true);
  const expanded = view.getUint32(directory + 24, true);
  const nameLength = view.getUint16(directory + 28, true);
  if (compressed > MAX_ZIP_BYTES || expanded > MAX_CSV_BYTES ||
      directory + 46 + nameLength > zip.length ||
      new TextDecoder().decode(zip.subarray(directory + 46, directory + 46 + nameLength)) !== csvName)
    fail('BAD_ZIP');
};

const parseRows = (csv: Uint8Array, start: number, end: number) => {
  const text = new TextDecoder('utf-8', { fatal: true }).decode(csv);
  const rows: Row[] = [];
  let before: Row | null = null;
  let after = false;
  let previousId = -1;
  let previousTime = -1;
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    if (!line) continue;
    if (index === 0 && line ===
        'agg_trade_id,price,quantity,first_trade_id,last_trade_id,transact_time,is_buyer_maker')
      continue;
    const fields = line.split(',');
    if (fields.length !== 7) fail('BAD_CSV');
    const [a, p, q, f, l, T, maker] = fields;
    const row = { a: Number(a), p, q, f: Number(f), l: Number(l),
      T: Number(T), m: maker === 'true' };
    if (![row.a, row.f, row.l, row.T].every(Number.isSafeInteger) ||
        !Number.isFinite(Number(p)) || !Number.isFinite(Number(q)) ||
        Number(p) <= 0 || Number(q) <= 0 || !['true', 'false'].includes(maker) ||
        row.a <= previousId || row.T < previousTime) fail('BAD_CSV');
    previousId = row.a;
    previousTime = row.T;
    if (row.T < start) before = row;
    else if (row.T <= end) {
      if (rows.length === 0 && before) rows.push(before);
      rows.push(row);
      if (rows.length > MAX_ROWS) fail('LIMIT');
    } else if (!after && rows.length > 0) {
      rows.push(row);
      after = true;
      if (rows.length > MAX_ROWS) fail('LIMIT');
    }
  }
  if (!rows.some((row) => row.T < start) || !rows.some((row) => row.T > end))
    fail('BOUNDARY_INCOMPLETE');
  for (let i = 1; i < rows.length; i += 1)
    if (rows[i].a !== rows[i - 1].a + 1 || rows[i].f <= rows[i - 1].l)
      fail('SEQUENCE_GAP');
  return rows;
};
const pageFromRows = (rows: Row[]) => async (query: {
  startTime?: number; endTime?: number; fromId?: number; limit: number;
}) => rows.filter((row) => query.fromId !== undefined ? row.a >= query.fromId :
  row.T >= (query.startTime ?? 0) && row.T <= (query.endTime ?? 0)).slice(0, query.limit);

const replay = async (snapshot: Snapshot): Promise<VerifiedIntrabarCandle[]> =>
  fetchVerifiedBinanceFuturesIntrabar({ symbol: snapshot.symbol,
    candles: snapshot.candles, verifiedArchive: true,
    fetchPage: pageFromRows(snapshot.rows) });

export const fetchVerifiedDailyUsdMArchive = async (input: {
  symbol: string;
  candles: BacktestKlineCandle[];
  fetcher?: typeof fetch;
}): Promise<{ snapshot: Snapshot; verified: VerifiedIntrabarCandle[] }> => {
  const { candles, symbol } = input;
  if (candles.length < 1 || candles.length > 120) fail('INVALID_CANDLES');
  const startTimeMs = candles[0].openTime;
  const endTimeMs = candles[candles.length - 1].closeTime + 1;
  const day = exactDay(startTimeMs, endTimeMs);
  const { basename, url } = archiveUrls(symbol, day);
  const fetcher = input.fetcher ?? fetch;
  const checksumText = new TextDecoder().decode(await readBounded(
    `${url}.CHECKSUM`, 256, fetcher)).trim();
  const match = checksumText.match(/^([0-9a-f]{64})\s+([^\s]+)$/i);
  if (!match || match[2] !== basename)
    throw new Error('BACKTEST_INTRABAR_ARCHIVE_CHECKSUM_INVALID');
  const zip = await readBounded(url, MAX_ZIP_BYTES, fetcher);
  const zipSha256 = sha256(zip);
  if (zipSha256 !== match[1].toLowerCase()) fail('CHECKSUM_MISMATCH');
  const csvName = basename.replace(/\.zip$/, '.csv');
  assertZipShape(zip, csvName);
  const csv = unzipSync(zip)[csvName];
  if (!csv || csv.length > MAX_CSV_BYTES) fail('BAD_ZIP');
  const rows = parseRows(csv, startTimeMs, endTimeMs - 1);
  const snapshot: Snapshot = { version: 1, symbol, day, startTimeMs, endTimeMs,
    archiveUrl: url, zipSha256, candles, rows };
  return { snapshot, verified: await replay(snapshot) };
};

export const readVerifiedRunArchive = async (runId: string, symbol: string,
  startTimeMs: number, endTimeMs: number) => {
  const record = await prisma.backtestIntrabarArchive.findUnique({
    where: { runId_symbol: { runId, symbol } },
  });
  if (!record) return null;
  const snapshot = record.payload as unknown as Snapshot;
  if (!snapshot || snapshot.version !== 1 || snapshot.symbol !== symbol ||
      snapshot.startTimeMs !== startTimeMs || snapshot.endTimeMs !== endTimeMs ||
      !Array.isArray(snapshot.candles) || !Array.isArray(snapshot.rows) ||
      snapshot.candles.length !== (endTimeMs - startTimeMs) / 60_000 ||
      snapshot.day !== exactDay(startTimeMs, endTimeMs) ||
      snapshot.archiveUrl !== archiveUrls(symbol, snapshot.day).url ||
      !/^[0-9a-f]{64}$/.test(snapshot.zipSha256) ||
      snapshotHash(snapshot) !== record.payloadSha256) fail('SNAPSHOT_CHANGED');
  return replay(snapshot);
};

export const saveVerifiedRunArchive = async (runId: string, snapshot: Snapshot) => {
  const payloadSha256 = snapshotHash(snapshot);
  try {
    await prisma.backtestIntrabarArchive.create({ data: { runId, symbol: snapshot.symbol,
      payload: snapshot as unknown as Prisma.InputJsonValue, payloadSha256 } });
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002')
      throw error;
    const existing = await prisma.backtestIntrabarArchive.findUniqueOrThrow({
      where: { runId_symbol: { runId, symbol: snapshot.symbol } },
    });
    if (existing.payloadSha256 !== payloadSha256) fail('SOURCE_CHANGED_ON_RETRY');
  }
  const verified = await readVerifiedRunArchive(runId, snapshot.symbol,
    snapshot.startTimeMs, snapshot.endTimeMs);
  if (!verified) fail('SNAPSHOT_MISSING');
  return verified;
};

export const fetchVerifiedArchivedIntrabarForRun = async (
  runId: string, exchange: Exchange, symbol: string, timeframe: string,
  marketType: BacktestMarketType, maxCandles: number, endTimeMs?: number,
  startTimeMs?: number, expectedDigest?: string,
) => {
  if (exchange !== Exchange.BINANCE || marketType !== 'FUTURES' ||
      timeframe !== '1m' || typeof startTimeMs !== 'number' ||
      typeof endTimeMs !== 'number' ||
      (endTimeMs - startTimeMs) / 60_000 > maxCandles)
    throw new Error('BACKTEST_INTRABAR_ARCHIVE_UNSUPPORTED_WINDOW');
  exactDay(startTimeMs, endTimeMs);
  const persisted = await readVerifiedRunArchive(runId, symbol, startTimeMs, endTimeMs);
  if (persisted) return persisted;
  if (expectedDigest) fail('SNAPSHOT_MISSING_ON_RETRY');
  const expectedCount = (endTimeMs - startTimeMs) / 60_000;
  const candles = await fetchKlines(exchange, symbol, timeframe, marketType,
    expectedCount, endTimeMs, startTimeMs);
  if (candles.length !== expectedCount || candles[0]?.openTime !== startTimeMs ||
      candles[candles.length - 1]?.closeTime !== endTimeMs - 1 ||
      candles.some((candle, index) => index > 0 &&
        candles[index - 1].closeTime + 1 !== candle.openTime)) fail('CANDLE_WINDOW_INCOMPLETE');
  const { snapshot } = await fetchVerifiedDailyUsdMArchive({ symbol, candles });
  return (await saveVerifiedRunArchive(runId, snapshot)) ?? fail('SNAPSHOT_MISSING');
};
