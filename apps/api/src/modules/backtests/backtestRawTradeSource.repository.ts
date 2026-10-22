import { createHash } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { fenceBacktestArchiveWrite } from './backtestRunOwnership.repository';
import { digestRawTradeCanonical, RAW_TRADE_SOURCE_TYPE,
  verifyBinanceUsdMRawTradeSource,
  type RawTradeBudget, type RawTradeCandle,
  type VerifiedRawTradeSource } from './backtestRawTradeSource';
import { buildRawTradeSnapshotV4, hashRawTradeSnapshotV4,
  rawTradeReplayCandles, type RawTradeSnapshotV4 } from './backtestRawTradeSnapshotV4';

const fail = (reason: string): never => {
  throw new Error(`BACKTEST_RAW_SOURCE_${reason}`);
};
const sha256 = (bytes: Uint8Array) =>
  createHash('sha256').update(bytes).digest('hex');

type RawTradeWriteInput = {
  runId: string; executionToken: string;
  symbol: string; day: string; candles: RawTradeCandle[];
  zipBytes?: Uint8Array; checksumBytes?: Uint8Array;
  budget?: RawTradeBudget;
};

const ensureRawTradeBlob = async (input: RawTradeWriteInput,
  verified: VerifiedRawTradeSource) => {
  const zipBytes = input.zipBytes ?? fail('MISSING');
  const checksumBytes = input.checksumBytes ?? fail('MISSING');
  try {
    await prisma.backtestRawTradeSourceBlob.create({ data: {
      zipSha256: verified.zipSha256, sourceType: RAW_TRADE_SOURCE_TYPE,
      symbol: input.symbol, day: input.day, sourceUrl: verified.sourceUrl,
      zipBytes: new Uint8Array(zipBytes),
      checksumBytes: new Uint8Array(checksumBytes), csvBytes: verified.csvBytes,
    } });
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) ||
        error.code !== 'P2002') throw error;
    const existing = await prisma.backtestRawTradeSourceBlob.findUnique({
      where: { zipSha256: verified.zipSha256 },
    });
    if (!existing || existing.sourceType !== RAW_TRADE_SOURCE_TYPE ||
        existing.symbol !== input.symbol || existing.day !== input.day ||
        existing.sourceUrl !== verified.sourceUrl ||
        existing.csvBytes !== verified.csvBytes ||
        sha256(existing.zipBytes) !== verified.zipSha256 ||
        sha256(existing.checksumBytes) !== verified.checksumSha256)
      fail('SOURCE_CHANGED');
  }
};

const bindRawTradeRef = async (tx: Prisma.TransactionClient,
  input: RawTradeWriteInput, verified: VerifiedRawTradeSource) => {
  const key = { runId: input.runId, symbol: input.symbol, day: input.day };
  const existing = await tx.backtestRawTradeSourceRef.findUnique({
    where: { runId_symbol_day: key },
  });
  if (existing) {
    if (existing.zipSha256 !== verified.zipSha256 ||
        existing.candlesSha256 !== verified.candlesSha256 ||
        existing.tapeSha256 !== verified.tapeSha256 ||
        existing.selectedTradeCount !== verified.selectedTradeCount ||
        digestRawTradeCanonical(existing.candles) !== verified.candlesSha256 ||
        existing.windowStartMs !== BigInt(input.candles[0].openTime) ||
        existing.windowEndMs !==
          BigInt(input.candles[input.candles.length - 1].closeTime + 1))
      fail('SOURCE_CHANGED_ON_RETRY');
    return;
  }
  await tx.backtestRawTradeSourceRef.create({ data: {
    ...key, zipSha256: verified.zipSha256,
    windowStartMs: BigInt(input.candles[0].openTime),
    windowEndMs: BigInt(input.candles[input.candles.length - 1].closeTime + 1),
    candles: input.candles as unknown as Prisma.InputJsonValue,
    candlesSha256: verified.candlesSha256,
    tapeSha256: verified.tapeSha256,
    selectedTradeCount: verified.selectedTradeCount,
  } });
};

// No production backtest job calls either writer. An approved source budget
// and a separate runtime gate are required before enabling raw trades.
export const persistVerifiedRawTradeSourceForRun = async (
  input: RawTradeWriteInput) => {
  if (!input.executionToken) fail('CLAIM_REQUIRED');
  const verified = await verifyBinanceUsdMRawTradeSource(input);
  await ensureRawTradeBlob(input, verified);
  await prisma.$transaction(async (tx) => {
    if (!(await fenceBacktestArchiveWrite(tx, input.runId,
      input.executionToken))) fail('CLAIM_LOST');
    await bindRawTradeRef(tx, input, verified);
  }, { maxWait: 10_000, timeout: 30_000 });
  return verified;
};

export const saveVerifiedRawTradeSnapshotV4ForRun = async (
  input: RawTradeWriteInput) => {
  if (!input.executionToken) fail('CLAIM_REQUIRED');
  const verified = await verifyBinanceUsdMRawTradeSource(input);
  const snapshot = buildRawTradeSnapshotV4(verified);
  const payloadSha256 = hashRawTradeSnapshotV4(snapshot);
  await ensureRawTradeBlob(input, verified);
  await prisma.$transaction(async (tx) => {
    if (!(await fenceBacktestArchiveWrite(tx, input.runId,
      input.executionToken))) fail('CLAIM_LOST');
    await bindRawTradeRef(tx, input, verified);
    const existing = await tx.backtestIntrabarArchive.findUnique({
      where: { runId_symbol: { runId: input.runId, symbol: input.symbol } },
    });
    if (existing) {
      if (existing.payloadSha256 !== payloadSha256 ||
          (existing.payload as { version?: unknown }).version !== 4 ||
          hashRawTradeSnapshotV4(existing.payload as unknown as RawTradeSnapshotV4) !==
            payloadSha256)
        fail('SOURCE_CHANGED_ON_RETRY');
      return;
    }
    await tx.backtestIntrabarArchive.create({ data: {
      runId: input.runId, symbol: input.symbol,
      payload: snapshot as unknown as Prisma.InputJsonValue,
      payloadSha256,
    } });
  }, { maxWait: 10_000, timeout: 30_000 });
  return snapshot;
};

export const readVerifiedRawTradeSourceForRun = async (input: {
  runId: string; symbol: string; day: string; budget?: RawTradeBudget;
  collectTicks?: boolean;
}) => {
  const record = await prisma.backtestRawTradeSourceRef.findUnique({
    where: { runId_symbol_day: { runId: input.runId,
      symbol: input.symbol, day: input.day } },
    include: { blob: true },
  });
  if (!record) return fail('MISSING');
  const { blob } = record;
  if (blob.sourceType !== RAW_TRADE_SOURCE_TYPE ||
      blob.symbol !== input.symbol || blob.day !== input.day ||
      blob.zipSha256 !== record.zipSha256 ||
      BigInt(record.windowStartMs) >= BigInt(record.windowEndMs))
    fail('SOURCE_CHANGED');
  if (!Array.isArray(record.candles)) fail('SOURCE_CHANGED');
  const candles = record.candles as unknown as RawTradeCandle[];
  const verified = await verifyBinanceUsdMRawTradeSource({
    symbol: input.symbol, day: input.day, candles,
    zipBytes: blob.zipBytes, checksumBytes: blob.checksumBytes,
    expectedZipSha256: record.zipSha256, budget: input.budget,
    collectTicks: input.collectTicks,
  });
  if (verified.sourceUrl !== blob.sourceUrl ||
      verified.csvBytes !== blob.csvBytes ||
      verified.candlesSha256 !== record.candlesSha256 ||
      verified.tapeSha256 !== record.tapeSha256 ||
      verified.selectedTradeCount !== record.selectedTradeCount ||
      BigInt(candles[0].openTime) !== record.windowStartMs ||
      BigInt(candles[candles.length - 1].closeTime + 1) !== record.windowEndMs)
    fail('SOURCE_CHANGED');
  return verified;
};

export const readVerifiedRawTradeSnapshotV4ForRun = async (input: {
  runId: string; symbol: string; startTimeMs: number; endTimeMs: number;
  budget?: RawTradeBudget; expectedDigest?: string;
}) => {
  if (!input.budget) fail('DISABLED_NO_BUDGET');
  if (!Number.isSafeInteger(input.startTimeMs) ||
      !Number.isSafeInteger(input.endTimeMs) ||
      input.startTimeMs % 60_000 !== 0 ||
      input.endTimeMs % 60_000 !== 0 ||
      input.endTimeMs <= input.startTimeMs ||
      input.endTimeMs - input.startTimeMs > 120 * 60_000 ||
      !Number.isFinite(new Date(input.startTimeMs).getTime()))
    fail('INVALID_WINDOW');
  if (input.expectedDigest !== undefined &&
      !/^[0-9a-f]{64}$/.test(input.expectedDigest)) fail('DIGEST_INVALID');
  const record = await prisma.backtestIntrabarArchive.findUnique({
    where: { runId_symbol: { runId: input.runId, symbol: input.symbol } },
    include: { rawArchives: true },
  });
  if (!record) return fail('SNAPSHOT_MISSING');
  const snapshot = record.payload as unknown as RawTradeSnapshotV4;
  if (snapshot?.version !== 4) fail('SNAPSHOT_VERSION');
  if (record.rawArchives.length !== 0 ||
      snapshot.sourceType !== RAW_TRADE_SOURCE_TYPE ||
      snapshot.symbol !== input.symbol ||
      snapshot.startTimeMs !== input.startTimeMs ||
      snapshot.endTimeMs !== input.endTimeMs ||
      !Array.isArray(snapshot.candles) ||
      snapshot.candles.length !== (input.endTimeMs - input.startTimeMs) / 60_000 ||
      !Array.isArray(snapshot.sources) || snapshot.sources.length !== 1 ||
      !Array.isArray(snapshot.candleTapeSha256) ||
      snapshot.candleTapeSha256.length !== snapshot.candles.length ||
      hashRawTradeSnapshotV4(snapshot) !== record.payloadSha256)
    fail('SNAPSHOT_CHANGED');
  const source = snapshot.sources[0];
  if (snapshot.klineSource?.endpoint !== '/fapi/v1/klines' ||
      snapshot.klineSource.interval !== '1m' ||
      snapshot.klineSource.symbol !== input.symbol ||
      source.day !== new Date(input.startTimeMs).toISOString().slice(0, 10))
    fail('SNAPSHOT_CHANGED');
  const verified = await readVerifiedRawTradeSourceForRun({
    runId: input.runId, symbol: input.symbol, day: source.day,
    budget: input.budget, collectTicks: true,
  });
  const expected = buildRawTradeSnapshotV4(verified);
  if (hashRawTradeSnapshotV4(expected) !== record.payloadSha256 ||
      snapshot.klineSource.normalizedCandlesSha256 !== verified.candlesSha256 ||
      snapshot.tapeSha256 !== verified.tapeSha256 ||
      snapshot.replayDigestSha256 !== expected.replayDigestSha256 ||
      (input.expectedDigest !== undefined && input.expectedDigest !==
        expected.replayDigestSha256)) fail('SNAPSHOT_CHANGED');
  return { snapshot, candles: rawTradeReplayCandles(verified) };
};
