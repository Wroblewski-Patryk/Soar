import { createHash } from 'node:crypto';
import { Readable } from 'node:stream';
import { createInflateRaw } from 'node:zlib';

export const RAW_TRADE_SOURCE_TYPE = 'BINANCE_USDM_TRADES_DAILY';

export type RawTradeCandle = {
  openTime: number; closeTime: number;
  open: number; high: number; low: number; close: number;
  volume: number; tradeCount: number;
};

export type RawTradeBudget = {
  maxZipBytes: number;
  maxCsvBytes: number;
  maxSelectedTrades: number;
  maxElapsedMs: number;
};

export type VerifiedRawTradeSource = {
  sourceType: typeof RAW_TRADE_SOURCE_TYPE;
  symbol: string; day: string; sourceUrl: string;
  zipSha256: string; checksumSha256: string;
  csvBytes: number; selectedTradeCount: number;
  tapeSha256: string; candlesSha256: string;
  candleTapeSha256: string[];
  candles: RawTradeCandle[];
  intrabarTicks?: Array<Array<{ eventTime: number; price: number;
    sequenceId: number }>>;
  observed: Array<{ open: number; high: number; low: number;
    close: number; volume: number; tradeCount: number;
    firstTradeId: number; lastTradeId: number }>;
};

const fail = (reason: string): never => {
  throw new Error(`BACKTEST_RAW_SOURCE_${reason}`);
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
export const digestRawTradeCanonical = (value: unknown) => sha256(canonical(value));
const positiveInteger = (value: unknown) => Number.isSafeInteger(value) &&
  (value as number) > 0;
const closeEnough = (actual: number, expected: number) =>
  Math.abs(actual - expected) <= Math.max(1e-8, Math.abs(expected) * 1e-7);

const checkBudget = (budget: RawTradeBudget | undefined): RawTradeBudget => {
  if (!budget) return fail('DISABLED_NO_BUDGET');
  if (![budget.maxZipBytes, budget.maxCsvBytes, budget.maxSelectedTrades,
    budget.maxElapsedMs].every(positiveInteger)) fail('INVALID_BUDGET');
  return budget;
};

const validDay = (day: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const parsed = Date.parse(`${day}T00:00:00.000Z`);
  return Number.isFinite(parsed) &&
    new Date(parsed).toISOString().slice(0, 10) === day;
};

const checkCandles = (symbol: string, day: string, candles: RawTradeCandle[]) => {
  if (!/^[A-Z0-9]{4,24}$/.test(symbol) || !validDay(day) ||
      candles.length < 1 || candles.length > 120) fail('INVALID_WINDOW');
  const dayStart = Date.parse(`${day}T00:00:00.000Z`);
  const start = candles[0].openTime;
  const end = candles[candles.length - 1].closeTime + 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) ||
      start % 60_000 !== 0 || end - start !== candles.length * 60_000 ||
      start < dayStart || end > dayStart + 86_400_000)
    fail('INVALID_WINDOW');
  for (const [index, candle] of candles.entries()) {
    if (candle.openTime !== start + index * 60_000 ||
        candle.closeTime !== candle.openTime + 59_999 ||
        !positiveInteger(candle.tradeCount) ||
        ![candle.open, candle.high, candle.low, candle.close,
          candle.volume].every((value) => Number.isFinite(value) && value > 0) ||
        candle.low > Math.min(candle.open, candle.close) ||
        candle.high < Math.max(candle.open, candle.close)) fail('INVALID_CANDLES');
  }
  return { start, end, dayStart };
};

// The supported official daily files contain one DEFLATE CSV entry. Reject
// ZIP64, encryption, extra entries and descriptors until each is reviewed.
const zipEntry = (zip: Uint8Array, expectedName: string, maxCsvBytes: number) => {
  if (zip.length < 98) fail('BAD_ZIP');
  const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  let end = -1;
  for (let at = zip.length - 22; at >= Math.max(0, zip.length - 65_557); at -= 1) {
    if (view.getUint32(at, true) === 0x06054b50) { end = at; break; }
  }
  if (end < 0 || end + 22 + view.getUint16(end + 20, true) !== zip.length ||
      view.getUint16(end + 8, true) !== 1 ||
      view.getUint16(end + 10, true) !== 1 ||
      view.getUint16(end + 4, true) !== 0 ||
      view.getUint16(end + 6, true) !== 0) fail('BAD_ZIP');
  const directorySize = view.getUint32(end + 12, true);
  const directoryAt = view.getUint32(end + 16, true);
  if (directoryAt + directorySize !== end || directoryAt + 46 > end ||
      view.getUint32(directoryAt, true) !== 0x02014b50) fail('BAD_ZIP');
  const flags = view.getUint16(directoryAt + 8, true);
  const method = view.getUint16(directoryAt + 10, true);
  const crc = view.getUint32(directoryAt + 16, true);
  const compressedSize = view.getUint32(directoryAt + 20, true);
  const csvBytes = view.getUint32(directoryAt + 24, true);
  const nameLength = view.getUint16(directoryAt + 28, true);
  const extraLength = view.getUint16(directoryAt + 30, true);
  const commentLength = view.getUint16(directoryAt + 32, true);
  const localAt = view.getUint32(directoryAt + 42, true);
  if (flags !== 0 || method !== 8 || compressedSize < 1 || csvBytes < 1 ||
      csvBytes > maxCsvBytes ||
      directorySize !== 46 + nameLength + extraLength + commentLength ||
      directoryAt + 46 + nameLength > end ||
      new TextDecoder().decode(zip.subarray(directoryAt + 46,
        directoryAt + 46 + nameLength)) !== expectedName ||
      localAt + 30 > directoryAt || view.getUint32(localAt, true) !== 0x04034b50 ||
      view.getUint16(localAt + 6, true) !== flags ||
      view.getUint16(localAt + 8, true) !== method ||
      view.getUint32(localAt + 14, true) !== crc ||
      view.getUint32(localAt + 18, true) !== compressedSize ||
      view.getUint32(localAt + 22, true) !== csvBytes) fail('BAD_ZIP');
  const localNameLength = view.getUint16(localAt + 26, true);
  const localExtraLength = view.getUint16(localAt + 28, true);
  const dataAt = localAt + 30 + localNameLength + localExtraLength;
  if (new TextDecoder().decode(zip.subarray(localAt + 30,
    localAt + 30 + localNameLength)) !== expectedName ||
      dataAt + compressedSize !== directoryAt) fail('BAD_ZIP');
  return { compressed: zip.subarray(dataAt, directoryAt), csvBytes, crc };
};

const crcTable = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1)
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
const nextCrc = (previous: number, bytes: Uint8Array) => {
  let value = previous;
  for (const byte of bytes) value = (value >>> 8) ^ crcTable[(value ^ byte) & 0xff];
  return value >>> 0;
};

export const verifyBinanceUsdMRawTradeSource = async (input: {
  symbol: string; day: string; candles: RawTradeCandle[];
  zipBytes?: Uint8Array; checksumBytes?: Uint8Array;
  expectedZipSha256?: string; budget?: RawTradeBudget;
  collectTicks?: boolean;
}): Promise<VerifiedRawTradeSource> => {
  const budget = checkBudget(input.budget);
  const { symbol, day, candles } = input;
  const { start, end, dayStart } = checkCandles(symbol, day, candles);
  const zip = input.zipBytes;
  const checksum = input.checksumBytes;
  if (!zip || !checksum) return fail('MISSING');
  if (zip.length < 1 || zip.length > budget.maxZipBytes ||
      checksum.length < 1 || checksum.length > 256) fail('LIMIT');
  const began = Date.now();
  const deadline = began + budget.maxElapsedMs;
  const checkTime = () => { if (Date.now() >= deadline) fail('TIME_LIMIT'); };
  const basename = `${symbol}-trades-${day}.zip`;
  const sourceUrl = `https://data.binance.vision/data/futures/um/daily/trades/${symbol}/${basename}`;
  let checksumText: string;
  try { checksumText = new TextDecoder('utf-8', { fatal: true }).decode(checksum).trim(); }
  catch { return fail('CHECKSUM_INVALID'); }
  const match = checksumText.match(/^([0-9a-f]{64})\s+([^\s]+)$/i);
  if (!match || match[2] !== basename) return fail('CHECKSUM_INVALID');
  const zipSha256 = sha256(zip);
  if (zipSha256 !== match[1].toLowerCase() ||
      (input.expectedZipSha256 && input.expectedZipSha256 !== zipSha256))
    fail('SOURCE_CHANGED');
  checkTime();
  const entry = zipEntry(zip, basename.replace(/\.zip$/, '.csv'), budget.maxCsvBytes);
  const states = candles.map(() => ({ open: NaN, high: -Infinity, low: Infinity,
    close: NaN, volume: 0, compensation: 0, tradeCount: 0,
    firstTradeId: -1, lastTradeId: -1 }));
  const tape = createHash('sha256');
  const candleTapes = candles.map(() => createHash('sha256'));
  const intrabarTicks = input.collectTicks ? candles.map(() => [] as Array<{
    eventTime: number; price: number; sequenceId: number }>) : undefined;
  let previousId = -1;
  let previousTime = -1;
  let selectedTradeCount = 0;
  let headerSeen = false;
  const processLine = (raw: string) => {
    checkTime();
    const line = raw.endsWith('\r') ? raw.slice(0, -1) : raw;
    if (!headerSeen) {
      if (line !== 'id,price,qty,quote_qty,time,is_buyer_maker') fail('BAD_CSV');
      headerSeen = true;
      return;
    }
    if (!line) fail('BAD_CSV');
    const parts = line.split(',');
    if (parts.length !== 6 || !/^\d+$/.test(parts[0]) ||
        !/^\d+$/.test(parts[4]) ||
        ![parts[1], parts[2], parts[3]].every((part) =>
          /^\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(part))) fail('BAD_CSV');
    const id = Number(parts[0]);
    const price = Number(parts[1]);
    const quantity = Number(parts[2]);
    const quote = Number(parts[3]);
    const time = Number(parts[4]);
    if (!Number.isSafeInteger(id) || id < 0 ||
        !Number.isSafeInteger(time) || time < dayStart ||
        time >= dayStart + 86_400_000 || id <= previousId ||
        time < previousTime ||
        ![price, quantity, quote].every((value) =>
          Number.isFinite(value) && value > 0) ||
        !['true', 'false'].includes(parts[5])) fail('BAD_CSV');
    previousId = id;
    previousTime = time;
    if (time < start || time >= end) return;
    selectedTradeCount += 1;
    if (selectedTradeCount > budget.maxSelectedTrades) fail('LIMIT');
    const candleIndex = Math.floor((time - start) / 60_000);
    const state = states[candleIndex];
    if (state.tradeCount === 0) { state.open = price; state.firstTradeId = id; }
    state.high = Math.max(state.high, price);
    state.low = Math.min(state.low, price);
    state.close = price;
    state.lastTradeId = id;
    // Compensated sum avoids a false volume mismatch on dense minutes.
    const add = quantity - state.compensation;
    const next = state.volume + add;
    state.compensation = (next - state.volume) - add;
    state.volume = next;
    state.tradeCount += 1;
    tape.update(line).update('\n');
    candleTapes[candleIndex].update(line).update('\n');
    intrabarTicks?.[candleIndex].push({ eventTime: time, price,
      sequenceId: id });
  };
  let csvBytes = 0;
  let crc = 0xffffffff;
  let pending = '';
  const decoder = new TextDecoder('utf-8', { fatal: true });
  const compressed = entry.compressed;
  const source = Readable.from((function* () {
    for (let at = 0; at < compressed.length; at += 64 * 1024)
      yield compressed.subarray(at, at + 64 * 1024);
  })());
  try {
    for await (const chunk of source.pipe(createInflateRaw())) {
      checkTime();
      const bytes = chunk as Buffer;
      csvBytes += bytes.length;
      if (csvBytes > budget.maxCsvBytes || csvBytes > entry.csvBytes) fail('LIMIT');
      crc = nextCrc(crc, bytes);
      pending += decoder.decode(bytes, { stream: true });
      let newline = pending.indexOf('\n');
      while (newline >= 0) {
        if (newline > 4096) fail('BAD_CSV');
        processLine(pending.slice(0, newline));
        pending = pending.slice(newline + 1);
        newline = pending.indexOf('\n');
      }
      if (pending.length > 4096) fail('BAD_CSV');
    }
    pending += decoder.decode();
    if (pending) processLine(pending);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('BACKTEST_RAW_SOURCE_')) throw error;
    fail('BAD_ZIP');
  }
  if (!headerSeen || csvBytes !== entry.csvBytes ||
      (crc ^ 0xffffffff) >>> 0 !== entry.crc || selectedTradeCount < 1)
    fail('BAD_ZIP');
  for (const [index, candle] of candles.entries()) {
    const state = states[index];
    if (state.tradeCount !== candle.tradeCount ||
        !closeEnough(state.open, candle.open) ||
        !closeEnough(state.high, candle.high) ||
        !closeEnough(state.low, candle.low) ||
        !closeEnough(state.close, candle.close) ||
        !closeEnough(state.volume, candle.volume)) fail('OHLC_MISMATCH');
  }
  return { sourceType: RAW_TRADE_SOURCE_TYPE, symbol, day, sourceUrl,
    zipSha256, checksumSha256: sha256(checksum), csvBytes,
    selectedTradeCount, tapeSha256: tape.digest('hex'),
    candlesSha256: digestRawTradeCanonical(candles),
    candleTapeSha256: candleTapes.map((hash) => hash.digest('hex')),
    candles, intrabarTicks,
    observed: states.map(({ compensation: _compensation, ...state }) => state),
  };
};
