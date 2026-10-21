import { createHash } from 'node:crypto';
import { unzipSync } from 'fflate';
import { marketSequenceStrategyConfig } from '../src/modules/backtests/backtest011aMarketWitness.config';
import { simulateInterleavedPortfolio } from '../src/modules/backtests/backtestPortfolioSimulation.service';
import type { BacktestKlineCandle } from '../src/modules/backtests/backtestDataGateway';

// The search order, bounds, source, configuration and acceptance rule are frozen
// in docs/operations/position-parity-011a-functional-witness-selection.md.
const symbol = 'ALICEUSDT';
const day = '2026-10-18';
const dayStart = Date.parse(`${day}T00:00:00.000Z`);
const minuteMs = 60_000;
const windowMinutes = 100;
const firstMinute = 1;
const lastMinute = 22 * 60 + 19;
const basename = `${symbol}-aggTrades-${day}.zip`;
const archiveUrl =
  `https://data.binance.vision/data/futures/um/daily/aggTrades/${symbol}/${basename}`;
const expectedSha = '4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b';
type Row = { a: number; price: number; quantity: number; f: number; l: number;
  time: number; maker: boolean };

const getBytes = async (url: string, maxBytes: number) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length > maxBytes) throw new Error(`Source exceeds byte limit: ${url}`);
  return bytes;
};
const closeEnough = (actual: number, expected: number) =>
  Math.abs(actual - expected) <= Math.max(1e-8, Math.abs(expected) * 1e-7);
const fetchKlines = async (): Promise<BacktestKlineCandle[]> => {
  const candles: BacktestKlineCandle[] = [];
  for (const [offset, limit] of [[0, 1000], [1000, 440]]) {
    const start = dayStart + offset * minuteMs;
    const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}` +
      `&interval=1m&startTime=${start}&endTime=${dayStart + 86_400_000 - 1}&limit=${limit}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`Kline HTTP ${response.status}`);
    const page = await response.json() as Array<Array<string | number>>;
    if (page.length !== limit) throw new Error(`Incomplete kline page: ${offset}`);
    for (const [index, row] of page.entries()) {
      const candle = { openTime: Number(row[0]), closeTime: Number(row[6]),
        open: Number(row[1]), high: Number(row[2]), low: Number(row[3]),
        close: Number(row[4]), volume: Number(row[5]) };
      if (candle.openTime !== dayStart + (offset + index) * minuteMs ||
          candle.closeTime !== candle.openTime + minuteMs - 1)
        throw new Error(`Noncontiguous kline at ${offset + index}`);
      candles.push(candle);
    }
  }
  return candles;
};

const main = async () => {
  const checksum = new TextDecoder().decode(await getBytes(`${archiveUrl}.CHECKSUM`, 256)).trim();
  if (checksum !== `${expectedSha}  ${basename}` &&
      checksum !== `${expectedSha} ${basename}`)
    throw new Error('Published checksum changed');
  const zip = await getBytes(archiveUrl, 8 * 1024 * 1024);
  const actualSha = createHash('sha256').update(zip).digest('hex');
  if (actualSha !== expectedSha) throw new Error('ZIP checksum mismatch');
  const csvBytes = unzipSync(zip)[basename.replace(/\.zip$/, '.csv')];
  if (!csvBytes || csvBytes.length > 64 * 1024 * 1024)
    throw new Error('Unusable or oversized archive CSV');
  const csv = new TextDecoder('utf-8', { fatal: true }).decode(csvBytes);
  const buckets: Row[][] = Array.from({ length: 1440 }, () => []);
  let previous: Row | null = null;
  let totalRows = 0;
  for (const [lineNumber, line] of csv.split(/\r?\n/).entries()) {
    if (!line) continue;
    if (lineNumber === 0 && line ===
        'agg_trade_id,price,quantity,first_trade_id,last_trade_id,transact_time,is_buyer_maker')
      continue;
    const fields = line.split(',');
    if (fields.length !== 7) throw new Error(`Malformed CSV row ${lineNumber}`);
    const [a, price, quantity, f, l, time, maker] = fields;
    const row: Row = { a: Number(a), price: Number(price), quantity: Number(quantity),
      f: Number(f), l: Number(l), time: Number(time), maker: maker === 'true' };
    if (![row.a, row.f, row.l, row.time].every(Number.isSafeInteger) ||
        !Number.isFinite(row.price) || row.price <= 0 ||
        !Number.isFinite(row.quantity) || row.quantity <= 0 ||
        !['true', 'false'].includes(maker) || row.f > row.l ||
        row.time < dayStart || row.time >= dayStart + 86_400_000 ||
        previous && (row.a !== previous.a + 1 || row.f <= previous.l ||
          row.time < previous.time))
      throw new Error(`Invalid archive sequence at CSV row ${lineNumber}`);
    buckets[Math.floor((row.time - dayStart) / minuteMs)].push(row);
    previous = row;
    totalRows += 1;
  }
  const klines = await fetchKlines();
  const verified: Array<BacktestKlineCandle | null> = buckets.map((rows, index) => {
    if (rows.length < 2) return null;
    const kline = klines[index];
    const prices = rows.map((row) => row.price);
    const volume = rows.reduce((sum, row) => sum + row.quantity, 0);
    if (![prices[0], Math.max(...prices), Math.min(...prices),
      prices[prices.length - 1], volume].every((value, position) =>
        closeEnough(value, [kline.open, kline.high, kline.low,
          kline.close, kline.volume][position])))
      throw new Error(`Aggregate/kline mismatch at ${new Date(kline.openTime).toISOString()}`);
    return { ...kline, intrabarTicks: rows.map((row) => ({
      eventTime: row.time, price: row.price, sequenceId: row.a })) };
  });
  let assessed = 0;
  let skippedIncomplete = 0;
  for (let minute = firstMinute; minute <= lastMinute; minute += 1) {
    const tape = verified.slice(minute, minute + windowMinutes);
    if (tape.length !== windowMinutes || tape.some((candle) => candle === null)) {
      skippedIncomplete += 1;
      continue;
    }
    assessed += 1;
    const candles = tape as BacktestKlineCandle[];
    const result = simulateInterleavedPortfolio({ symbols: [symbol],
      candlesBySymbol: new Map([[symbol, candles]]),
      analysisStartIndexBySymbol: new Map([[symbol, 2]]),
      marketType: 'FUTURES', leverage: 1, marginMode: 'ISOLATED',
      strategyConfig: marketSequenceStrategyConfig, walletRiskPercent: 10,
      initialBalance: 1000, fillModelConfig: { feeRate: 0.0004, slippageRate: 0 },
    }).perSymbol[symbol];
    for (const dca of result.events.filter((event) => event.type === 'DCA')) {
      const ttp = result.events.find((event) => event.type === 'TTP' &&
        event.tradeSequence === dca.tradeSequence && event.candleIndex === dca.candleIndex &&
        event.timestamp.getTime() > dca.timestamp.getTime());
      if (!ttp) continue;
      const source = buckets[minute + dca.candleIndex];
      const dcaMatches = source.filter((row) =>
        row.time === dca.timestamp.getTime() && row.price === dca.price);
      const ttpMatches = source.filter((row) =>
        row.time === ttp.timestamp.getTime() && row.price === ttp.price);
      if (dcaMatches.length !== 1 || ttpMatches.length !== 1 ||
          ttpMatches[0].a <= dcaMatches[0].a) continue;
      process.stdout.write(JSON.stringify({ day, symbol, zipSha256: actualSha,
        totalRows, candidatesSeen: minute - firstMinute + 1, assessed,
        skippedIncomplete, windowStart: new Date(dayStart + minute * minuteMs).toISOString(),
        windowEnd: new Date(dayStart + (minute + windowMinutes) * minuteMs).toISOString(),
        dca: { time: dca.timestamp.toISOString(), price: dca.price,
          aggregateId: dcaMatches[0].a, candleIndex: dca.candleIndex },
        ttp: { time: ttp.timestamp.toISOString(), price: ttp.price,
          aggregateId: ttpMatches[0].a, candleIndex: ttp.candleIndex },
      }) + '\n');
      return;
    }
  }
  process.stdout.write(JSON.stringify({ day, symbol, zipSha256: actualSha,
    totalRows, candidatesSeen: lastMinute - firstMinute + 1, assessed,
    skippedIncomplete, witness: null }) + '\n');
  process.exitCode = 2;
};

main().catch((error) => { process.stderr.write(`${String(error)}\n`); process.exitCode = 1; });
