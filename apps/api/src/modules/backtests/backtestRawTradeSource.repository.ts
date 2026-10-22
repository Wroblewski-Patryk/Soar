import { createHash } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { fenceBacktestArchiveWrite } from './backtestRunOwnership.repository';
import { RAW_TRADE_SOURCE_TYPE, verifyBinanceUsdMRawTradeSource,
  type RawTradeBudget, type RawTradeCandle } from './backtestRawTradeSource';

const fail = (reason: string): never => {
  throw new Error(`BACKTEST_RAW_SOURCE_${reason}`);
};
const sha256 = (bytes: Uint8Array) =>
  createHash('sha256').update(bytes).digest('hex');

// This foundation has no call site in the production backtest job. A future
// writer must supply an approved budget and pass a separate runtime gate.
export const persistVerifiedRawTradeSourceForRun = async (input: {
  runId: string; executionToken: string;
  symbol: string; day: string; candles: RawTradeCandle[];
  zipBytes?: Uint8Array; checksumBytes?: Uint8Array;
  budget?: RawTradeBudget;
}) => {
  if (!input.executionToken) fail('CLAIM_REQUIRED');
  const verified = await verifyBinanceUsdMRawTradeSource(input);
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
  await prisma.$transaction(async (tx) => {
    if (!(await fenceBacktestArchiveWrite(tx, input.runId,
      input.executionToken))) fail('CLAIM_LOST');
    const key = { runId: input.runId, symbol: input.symbol, day: input.day };
    const existing = await tx.backtestRawTradeSourceRef.findUnique({
      where: { runId_symbol_day: key },
    });
    if (existing) {
      if (existing.zipSha256 !== verified.zipSha256 ||
          existing.candlesSha256 !== verified.candlesSha256 ||
          existing.tapeSha256 !== verified.tapeSha256 ||
          existing.selectedTradeCount !== verified.selectedTradeCount)
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
  }, { maxWait: 10_000, timeout: 30_000 });
  return verified;
};

export const readVerifiedRawTradeSourceForRun = async (input: {
  runId: string; symbol: string; day: string; budget?: RawTradeBudget;
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
  const candles = record.candles as unknown as RawTradeCandle[];
  const verified = await verifyBinanceUsdMRawTradeSource({
    symbol: input.symbol, day: input.day, candles,
    zipBytes: blob.zipBytes, checksumBytes: blob.checksumBytes,
    expectedZipSha256: record.zipSha256, budget: input.budget,
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
