import { createHash } from 'node:crypto';
import { unzipSync } from 'fflate';
import { Exchange, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { fetchVerifiedBinanceFuturesIntrabar,
  type VerifiedIntrabarCandle } from './backtestBinanceFuturesIntrabarSource';
import { fetchKlines, type BacktestKlineCandle,
  type BacktestMarketType } from './backtestDataGateway';
import { fenceBacktestArchiveWrite } from './backtestRunOwnership.repository';

const MAX_ZIP_BYTES = 16 * 1024 * 1024;
const MAX_CSV_BYTES = 64 * 1024 * 1024;
const MAX_ROWS = 80_000;
const DAY_MS = 86_400_000;
const BOUNDARY_MS = 1_000;
type Row = { a: number; p: string; q: string; f: number; l: number; T: number; m: boolean };
type ArchiveMetadata = { day: string; archiveUrl: string; zipSha256: string };
type RawArchiveMetadata = ArchiveMetadata & { checksumSha256: string };
type RawArchive = { day: string; zipBytes: Uint8Array; checksumBytes: Uint8Array };
type SnapshotV1 = {
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
type SnapshotV2 = {
  version: 2;
  symbol: string;
  startTimeMs: number;
  endTimeMs: number;
  archives: ArchiveMetadata[];
  candles: BacktestKlineCandle[];
  rows: Row[];
};
type SnapshotV3 = {
  version: 3;
  symbol: string;
  startTimeMs: number;
  endTimeMs: number;
  archives: RawArchiveMetadata[];
  candles: BacktestKlineCandle[];
  rows: Row[];
};
type Snapshot = SnapshotV1 | SnapshotV2 | SnapshotV3;

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
const archiveDays = (startTimeMs: number, endTimeMs: number): string[] => {
  if (!Number.isSafeInteger(startTimeMs) || !Number.isSafeInteger(endTimeMs) ||
      startTimeMs % 60_000 !== 0 || endTimeMs % 60_000 !== 0 ||
      endTimeMs <= startTimeMs || endTimeMs - startTimeMs > 120 * 60_000 ||
      endTimeMs >= Date.now() - 48 * 60 * 60_000) fail('WINDOW_UNAVAILABLE');
  const firstDayStart = Math.floor(startTimeMs / DAY_MS) * DAY_MS;
  const lastDayStart = Math.floor((endTimeMs - 1) / DAY_MS) * DAY_MS;
  if (firstDayStart === lastDayStart) return [exactDay(startTimeMs, endTimeMs)];
  if (lastDayStart !== firstDayStart + DAY_MS ||
      startTimeMs < firstDayStart + BOUNDARY_MS ||
      endTimeMs + BOUNDARY_MS >= lastDayStart + DAY_MS)
    fail('TWO_ADJACENT_DAYS_REQUIRED');
  return [firstDayStart, lastDayStart].map((time) =>
    new Date(time).toISOString().slice(0, 10));
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
const assertZipShape = (zip: Uint8Array, csvName: string,
  remainingCsvBytes: number) => {
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
  if (compressed > zip.length || expanded > remainingCsvBytes) fail('LIMIT');
  if (compressed > MAX_ZIP_BYTES || expanded > MAX_CSV_BYTES ||
      directory + 46 + nameLength > zip.length ||
      new TextDecoder().decode(zip.subarray(directory + 46, directory + 46 + nameLength)) !== csvName)
    fail('BAD_ZIP');
};

const parseRows = (parts: Array<{ day: string; csv: Uint8Array }>,
  start: number, end: number) => {
  const rows: Row[] = [];
  let before: Row | null = null;
  let after = false;
  let previousId = -1;
  let previousTime = -1;
  let previousTradeId = -1;
  for (const { day, csv } of parts) {
    const dayStart = Date.parse(`${day}T00:00:00.000Z`);
    const text = new TextDecoder('utf-8', { fatal: true }).decode(csv);
    let index = 0;
    for (let offset = 0; offset < text.length; index += 1) {
      const newline = text.indexOf('\n', offset);
      const lineEnd = newline < 0 ? text.length : newline;
      const rawLine = text.slice(offset, lineEnd);
      const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine;
      offset = newline < 0 ? text.length : newline + 1;
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
          row.a <= previousId || row.T < previousTime ||
          row.f > row.l || row.f <= previousTradeId ||
          row.T < dayStart || row.T >= dayStart + DAY_MS) fail('BAD_CSV');
      // The two files must join without a missing aggregate. The same check
      // covers the selected tape and catches gaps elsewhere in the ZIPs.
      if (previousId >= 0 && row.a !== previousId + 1) fail('SEQUENCE_GAP');
      previousId = row.a;
      previousTime = row.T;
      previousTradeId = row.l;
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

const replay = async (snapshot: Snapshot,
  archiveProof: NonNullable<VerifiedIntrabarCandle['intrabarProvenance']['archiveProof']>) =>
  (await fetchVerifiedBinanceFuturesIntrabar({ symbol: snapshot.symbol,
    candles: snapshot.candles, verifiedArchive: true,
    fetchPage: pageFromRows(snapshot.rows) })).map((candle) => ({
    ...candle, intrabarProvenance: { ...candle.intrabarProvenance, archiveProof },
  }));

const checksumSha = (checksumBytes: Uint8Array, basename: string) => {
  if (checksumBytes.length < 1 || checksumBytes.length > 256) fail('LIMIT');
  const checksumText = (() => {
    try { return new TextDecoder('utf-8', { fatal: true })
      .decode(checksumBytes).trim(); }
    catch { return fail('CHECKSUM_INVALID'); }
  })();
  const match = checksumText.match(/^([0-9a-f]{64})\s+([^\s]+)$/i);
  if (!match || match[2] !== basename) fail('CHECKSUM_INVALID');
  return match?.[1].toLowerCase() ?? fail('CHECKSUM_INVALID');
};

const rowsFromRawArchives = (input: {
  symbol: string; startTimeMs: number; endTimeMs: number;
  archives: RawArchiveMetadata[]; rawArchives: RawArchive[];
}) => {
  const days = archiveDays(input.startTimeMs, input.endTimeMs);
  if (input.archives.length !== days.length ||
      input.rawArchives.length !== days.length) fail('RAW_ARCHIVE_INCOMPLETE');
  const parts: Array<{ day: string; csv: Uint8Array }> = [];
  let zipBytes = 0;
  let csvBytes = 0;
  for (const [index, day] of days.entries()) {
    const metadata = input.archives[index];
    const raw = input.rawArchives[index];
    const { basename, url } = archiveUrls(input.symbol, day);
    if (!raw || !metadata || raw.day !== day || metadata.day !== day ||
        metadata.archiveUrl !== url ||
        !/^[0-9a-f]{64}$/.test(metadata.zipSha256) ||
        !/^[0-9a-f]{64}$/.test(metadata.checksumSha256))
      fail('RAW_ARCHIVE_INCOMPLETE');
    zipBytes += raw.zipBytes.length;
    if (zipBytes > MAX_ZIP_BYTES || raw.zipBytes.length < 1) fail('LIMIT');
    if (sha256(raw.checksumBytes) !== metadata.checksumSha256)
      fail('CHECKSUM_MISMATCH');
    const expectedSha = checksumSha(raw.checksumBytes, basename);
    const actualSha = sha256(raw.zipBytes);
    if (actualSha !== expectedSha || actualSha !== metadata.zipSha256)
      fail('CHECKSUM_MISMATCH');
    const csvName = basename.replace(/\.zip$/, '.csv');
    assertZipShape(raw.zipBytes, csvName, MAX_CSV_BYTES - csvBytes);
    const csv = (() => {
      try { return unzipSync(raw.zipBytes)[csvName] ?? fail('BAD_ZIP'); }
      catch { return fail('BAD_ZIP'); }
    })();
    csvBytes += csv.length;
    if (csvBytes > MAX_CSV_BYTES) fail('LIMIT');
    parts.push({ day, csv });
  }
  return parseRows(parts, input.startTimeMs, input.endTimeMs - 1);
};

export const fetchVerifiedDailyUsdMArchive = async (input: {
  symbol: string;
  candles: BacktestKlineCandle[];
  fetcher?: typeof fetch;
}): Promise<{ snapshot: SnapshotV3; rawArchives: RawArchive[];
  verified: VerifiedIntrabarCandle[] }> => {
  const { candles, symbol } = input;
  if (candles.length < 1 || candles.length > 120) fail('INVALID_CANDLES');
  const startTimeMs = candles[0].openTime;
  const endTimeMs = candles[candles.length - 1].closeTime + 1;
  const days = archiveDays(startTimeMs, endTimeMs);
  const fetcher = input.fetcher ?? fetch;
  const archives: RawArchiveMetadata[] = [];
  const rawArchives: RawArchive[] = [];
  let zipBytes = 0;
  for (const day of days) {
    const { basename, url } = archiveUrls(symbol, day);
    const checksumBytes = await readBounded(`${url}.CHECKSUM`, 256, fetcher);
    const expectedSha = checksumSha(checksumBytes, basename);
    const zip = await readBounded(url, MAX_ZIP_BYTES - zipBytes, fetcher);
    zipBytes += zip.length;
    const zipSha256 = sha256(zip);
    if (zipSha256 !== expectedSha) fail('CHECKSUM_MISMATCH');
    archives.push({ day, archiveUrl: url, zipSha256,
      checksumSha256: sha256(checksumBytes) });
    rawArchives.push({ day, zipBytes: zip, checksumBytes });
  }
  const rows = rowsFromRawArchives({ symbol, startTimeMs, endTimeMs,
    archives, rawArchives });
  const snapshot: SnapshotV3 = { version: 3, symbol, startTimeMs,
    endTimeMs, archives, candles, rows };
  return { snapshot, rawArchives,
    verified: await replay(snapshot, 'CHECKSUM_VERIFIED') };
};

export const readVerifiedRunArchive = async (runId: string, symbol: string,
  startTimeMs: number, endTimeMs: number) => {
  const record = await prisma.backtestIntrabarArchive.findUnique({
    where: { runId_symbol: { runId, symbol } },
    include: { rawArchives: { orderBy: { day: 'asc' } } },
  });
  if (!record) return null;
  const snapshot = record.payload as unknown as Snapshot;
  if (!snapshot || ![1, 2, 3].includes(snapshot.version) || snapshot.symbol !== symbol ||
      snapshot.startTimeMs !== startTimeMs || snapshot.endTimeMs !== endTimeMs ||
      !Array.isArray(snapshot.candles) || !Array.isArray(snapshot.rows) ||
      snapshot.candles.length !== (endTimeMs - startTimeMs) / 60_000 ||
      snapshotHash(snapshot) !== record.payloadSha256) fail('SNAPSHOT_CHANGED');
  const days = archiveDays(startTimeMs, endTimeMs);
  if (snapshot.version === 1) {
    if (record.rawArchives.length !== 0 || days.length !== 1 || snapshot.day !== days[0] ||
        snapshot.archiveUrl !== archiveUrls(symbol, snapshot.day).url ||
        !/^[0-9a-f]{64}$/.test(snapshot.zipSha256)) fail('SNAPSHOT_CHANGED');
  } else if (snapshot.version === 2) {
    if (record.rawArchives.length !== 0 || days.length !== 2 ||
        !Array.isArray(snapshot.archives) ||
        snapshot.archives.length !== 2 || snapshot.archives.some((archive, index) =>
          archive.day !== days[index] ||
          archive.archiveUrl !== archiveUrls(symbol, days[index]).url ||
          !/^[0-9a-f]{64}$/.test(archive.zipSha256))) fail('SNAPSHOT_CHANGED');
  } else if (snapshot.version === 3) {
    if (!Array.isArray(snapshot.archives)) fail('SNAPSHOT_CHANGED');
    const rows = rowsFromRawArchives({ symbol, startTimeMs, endTimeMs,
      archives: snapshot.archives,
      rawArchives: record.rawArchives.map((raw) => ({
        day: raw.day, zipBytes: raw.zipBytes, checksumBytes: raw.checksumBytes,
      })) });
    if (canonical(rows) !== canonical(snapshot.rows)) fail('SNAPSHOT_CHANGED');
    return replay(snapshot, 'PERSISTED_CHECKSUM_REVERIFIED');
  } else fail('SNAPSHOT_CHANGED');
  return replay(snapshot, 'LEGACY_SNAPSHOT');
};

export const saveVerifiedRunArchive = async (runId: string, snapshot: SnapshotV3,
  rawArchives: RawArchive[], executionToken: string) => {
  if (!executionToken) fail('CLAIM_REQUIRED');
  const rows = rowsFromRawArchives({ symbol: snapshot.symbol,
    startTimeMs: snapshot.startTimeMs, endTimeMs: snapshot.endTimeMs,
    archives: snapshot.archives, rawArchives });
  if (canonical(rows) !== canonical(snapshot.rows)) fail('SNAPSHOT_CHANGED');
  await replay(snapshot, 'CHECKSUM_VERIFIED');
  const payloadSha256 = snapshotHash(snapshot);
  try {
    await prisma.$transaction(async (tx) => {
      if (!(await fenceBacktestArchiveWrite(tx, runId, executionToken)))
        fail('CLAIM_LOST');
      await tx.backtestIntrabarArchive.create({ data: { runId, symbol: snapshot.symbol,
        payload: snapshot as unknown as Prisma.InputJsonValue, payloadSha256 } });
      await tx.backtestIntrabarArchiveRaw.createMany({ data: rawArchives.map((raw) => ({
        runId, symbol: snapshot.symbol, day: raw.day,
        zipBytes: new Uint8Array(raw.zipBytes),
        checksumBytes: new Uint8Array(raw.checksumBytes),
      })) });
    }, { maxWait: 10_000, timeout: 30_000 });
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
  startTimeMs?: number, expectedDigest?: string, executionToken?: string,
) => {
  if (exchange !== Exchange.BINANCE || marketType !== 'FUTURES' ||
      timeframe !== '1m' || typeof startTimeMs !== 'number' ||
      typeof endTimeMs !== 'number' ||
      (endTimeMs - startTimeMs) / 60_000 > maxCandles)
    throw new Error('BACKTEST_INTRABAR_ARCHIVE_UNSUPPORTED_WINDOW');
  archiveDays(startTimeMs, endTimeMs);
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
  const { snapshot, rawArchives } = await fetchVerifiedDailyUsdMArchive({ symbol, candles });
  return (await saveVerifiedRunArchive(runId, snapshot, rawArchives,
    executionToken ?? fail('CLAIM_REQUIRED'))) ?? fail('SNAPSHOT_MISSING');
};
