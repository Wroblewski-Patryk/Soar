import { randomUUID } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { fetchBinancePublicRestJson } from '../exchange/binancePublicRest.service';
import { fetchExchangePublicRecentCandles } from '../exchange/exchangePublicMarketData.service';
import { resetBacktestDataGatewayCacheForTests,
  setDbCandleDelegateForTests } from './backtestDataGateway';
import { deleteOwnedBacktestRunCascade } from './backtests.repository';
import { getBacktestRunTimeline } from './backtests.controller';
import { createRun, getRunTimeline } from './backtests.service';
import type { BacktestTimelineSourceError } from './backtestIntrabarTimelineSource';
import { GetBacktestTimelineQuerySchema } from './backtests.types';

const proof = vi.hoisted(() => ({ start: 0, candleCount: 0,
  changedCandleIndex: -1, sourceUnavailable: false }));

vi.mock('../exchange/exchangePublicMarketData.service', () => ({
  fetchExchangePublicRecentCandles: vi.fn(async ({ since, limit }: {
    since: number; limit: number;
  }) => Array.from({ length: limit }, (_, index) => {
    const openTime = since + index * 60_000;
    const sourceIndex = Math.round((openTime - proof.start) / 60_000);
    const price = sourceIndex === proof.changedCandleIndex ? 101 : 100;
    return { openTime, closeTime: openTime + 59_999, open: price, high: price,
      low: price, close: price, volume: 2, raw: [] };
  })),
  fetchExchangePublicFundingRateHistory: vi.fn(async () => []),
  fetchExchangePublicOpenInterestHistory: vi.fn(async () => []),
}));

vi.mock('../exchange/binancePublicRest.service', () => ({
  fetchBinancePublicRestJson: vi.fn(async ({ path, searchParams }: {
    path: string; searchParams: URLSearchParams;
  }) => {
    if (path !== '/fapi/v1/aggTrades') return [];
    if (proof.sourceUnavailable) throw new Error('TEST_SOURCE_UNAVAILABLE');
    const rows = Array.from({ length: proof.candleCount * 2 }, (_, index) => {
      const candleIndex = Math.floor(index / 2);
      const id = 100_000 + index;
      return { a: id, p: candleIndex === proof.changedCandleIndex ? '101' : '100',
        q: '1', f: 200_000 + index,
        l: 200_000 + index,
        T: proof.start + candleIndex * 60_000 + 1 + (index % 2), m: false };
    });
    const fromId = searchParams.get('fromId');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    return rows.filter((row) => fromId !== null ? row.a >= Number(fromId) :
      row.T >= Number(startTime) && row.T <= Number(endTime))
      .slice(0, Number(searchParams.get('limit')));
  }),
}));

const strategyConfig = {
  openConditions: { direction: 'long',
    indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: 10_000,
      params: { period: 2 } }], indicatorsShort: [] },
};

const waitForTerminalRun = async (runId: string) => {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const run = await prisma.backtestRun.findUniqueOrThrow({ where: { id: runId } });
    if (run.status === 'COMPLETED' || run.status === 'FAILED') return run;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error('Strict intrabar run did not finish within 10 seconds');
};

const forceFreshMarketRead = () => {
  resetBacktestDataGatewayCacheForTests();
  setDbCandleDelegateForTests({ findMany: async () => [],
    createMany: async () => ({ count: 0 }) });
};

describe.runIf(process.env.RUN_BACKTEST_STRICT_INTRABAR_FLOW_PROOF === '1')(
  'strict intrabar create-to-report flow on an isolated database', () => {
    it.each([100, 60])('creates and completes an explicit %i-minute run with MOMENTUM warmup',
      async (candleCount) => {
        const databaseName = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
        if (!databaseName.endsWith('_test')) throw new Error('Requires isolated _test database');
        resetBacktestDataGatewayCacheForTests();
        proof.changedCandleIndex = -1;
        proof.sourceUnavailable = false;
        proof.candleCount = candleCount;
        proof.start = Math.floor(Date.now() / 60_000) * 60_000 -
          (candleCount + 3) * 60_000;
        const user = await prisma.user.create({ data: {
          email: `strict-intrabar-${randomUUID()}@example.test`, password: 'local-test-only',
        } });
        let runId: string | null = null;
        try {
          const strategy = await prisma.strategy.create({ data: {
            userId: user.id, name: 'Strict intrabar warmup proof', interval: '1m',
            leverage: 1, walletRisk: 1, config: strategyConfig,
          } });
          const run = await createRun(user.id, {
            name: `Strict intrabar ${candleCount} minute proof`, symbol: 'BTCUSDT',
            timeframe: '1m', strategyId: strategy.id,
            startAt: new Date(proof.start),
            endAt: new Date(proof.start + candleCount * 60_000),
            seedConfig: { maxCandles: candleCount,
              intrabarSource: 'BINANCE_USDM_AGGTRADES_REQUIRED' },
          });
          if (!run) throw new Error('Run creation returned null');
          runId = run.id;
          const completed = await waitForTerminalRun(runId);
          expect(completed.status).toBe('COMPLETED');
          const seed = completed.seedConfig as Record<string, any>;
          expect(seed.effectiveMaxCandles).toBe(100);
          expect(seed.intrabarSourceDigestBySymbol.BTCUSDT).toMatch(/^[0-9a-f]{64}$/);
          const report = await prisma.backtestReport.findUniqueOrThrow({
            where: { backtestRunId: runId },
          });
          expect((report.metrics as any).runLifecycle).toMatchObject({
            state: 'COMPLETED', reportReady: true,
          });
          const timeline = await getRunTimeline(user.id, runId,
            GetBacktestTimelineQuerySchema.parse({ symbol: 'BTCUSDT' }));
          expect(timeline?.totalCandles).toBe(candleCount - 2);
          expect(vi.mocked(fetchExchangePublicRecentCandles)).toHaveBeenCalled();
          expect(vi.mocked(fetchBinancePublicRestJson)).toHaveBeenCalledWith(
            expect.objectContaining({ path: '/fapi/v1/aggTrades' }));
        } finally {
          if (runId) await deleteOwnedBacktestRunCascade(user.id, runId);
          await prisma.strategy.deleteMany({ where: { userId: user.id } });
          await prisma.user.delete({ where: { id: user.id } });
          resetBacktestDataGatewayCacheForTests();
        }
      });

    it('fails the created run without PnL when the source digest changed on retry', async () => {
      const databaseName = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
      if (!databaseName.endsWith('_test')) throw new Error('Requires isolated _test database');
      resetBacktestDataGatewayCacheForTests();
      proof.changedCandleIndex = -1;
      proof.sourceUnavailable = false;
      proof.candleCount = 3;
      proof.start = Math.floor(Date.now() / 60_000) * 60_000 - 6 * 60_000;
      const user = await prisma.user.create({ data: {
        email: `strict-intrabar-retry-${randomUUID()}@example.test`, password: 'local-test-only',
      } });
      let runId: string | null = null;
      try {
        const strategy = await prisma.strategy.create({ data: {
          userId: user.id, name: 'Strict intrabar digest retry proof', interval: '1m',
          leverage: 1, walletRisk: 1, config: strategyConfig,
        } });
        const run = await createRun(user.id, {
          name: 'Strict intrabar changed digest proof', symbol: 'BTCUSDT',
          timeframe: '1m', strategyId: strategy.id,
          startAt: new Date(proof.start), endAt: new Date(proof.start + 3 * 60_000),
          seedConfig: { maxCandles: 100,
            intrabarSource: 'BINANCE_USDM_AGGTRADES_REQUIRED',
            intrabarSourceDigestBySymbol: { BTCUSDT: 'b'.repeat(64) } },
        });
        if (!run) throw new Error('Run creation returned null');
        runId = run.id;
        const failed = await waitForTerminalRun(runId);
        expect(failed.status).toBe('FAILED');
        expect((failed.seedConfig as Record<string, any>).error)
          .toContain('BACKTEST_INTRABAR_SOURCE_CHANGED_ON_RETRY');
        const report = await prisma.backtestReport.findUniqueOrThrow({
          where: { backtestRunId: runId },
        });
        expect(report.netPnl).toBeNull();
        expect((report.metrics as any).runLifecycle).toMatchObject({
          state: 'FAILED', reportReady: false,
        });
        expect(await prisma.backtestTrade.count({ where: { backtestRunId: runId } })).toBe(0);
      } finally {
        if (runId) await deleteOwnedBacktestRunCascade(user.id, runId);
        await prisma.strategy.deleteMany({ where: { userId: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
        resetBacktestDataGatewayCacheForTests();
      }
    });

    it('refuses timeline replay when a completed run tape changes or disappears', async () => {
      const databaseName = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
      if (!databaseName.endsWith('_test')) throw new Error('Requires isolated _test database');
      proof.candleCount = 5;
      proof.start = Math.floor(Date.now() / 60_000) * 60_000 - 8 * 60_000;
      proof.changedCandleIndex = -1;
      proof.sourceUnavailable = false;
      forceFreshMarketRead();
      const user = await prisma.user.create({ data: {
        email: `strict-intrabar-timeline-${randomUUID()}@example.test`,
        password: 'local-test-only',
      } });
      let runId: string | null = null;
      try {
        const strategy = await prisma.strategy.create({ data: {
          userId: user.id, name: 'Strict timeline source proof', interval: '1m',
          leverage: 1, walletRisk: 1, config: strategyConfig,
        } });
        const run = await createRun(user.id, {
          name: 'Strict timeline source proof', symbol: 'BTCUSDT',
          timeframe: '1m', strategyId: strategy.id,
          startAt: new Date(proof.start), endAt: new Date(proof.start + 5 * 60_000),
          seedConfig: { maxCandles: 5,
            intrabarSource: 'BINANCE_USDM_AGGTRADES_REQUIRED' },
        });
        if (!run) throw new Error('Run creation returned null');
        runId = run.id;
        const completed = await waitForTerminalRun(runId);
        expect(completed.status).toBe('COMPLETED');
        const persistedDigest = (completed.seedConfig as Record<string, any>)
          .intrabarSourceDigestBySymbol.BTCUSDT;
        const originalReport = await prisma.backtestReport.findUniqueOrThrow({
          where: { backtestRunId: runId },
        });
        const timelineQuery = GetBacktestTimelineQuerySchema.parse({ symbol: 'BTCUSDT' });
        const identical = await getRunTimeline(user.id, runId, timelineQuery);
        expect(identical?.totalCandles).toBe(3);

        proof.changedCandleIndex = 3;
        forceFreshMarketRead();
        await expect(getRunTimeline(user.id, runId, timelineQuery))
          .rejects.toMatchObject({ code: 'SOURCE_CHANGED' } satisfies
            Partial<BacktestTimelineSourceError>);
        const changedResponse = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        await getBacktestRunTimeline({ user: { id: user.id }, params: { id: runId },
          query: { symbol: 'BTCUSDT' } } as any, changedResponse as any);
        expect(changedResponse.status).toHaveBeenCalledWith(409);
        expect(changedResponse.json).toHaveBeenCalledWith({ error: {
          message: 'Verified intrabar timeline unavailable',
          details: { code: 'SOURCE_CHANGED' },
        } });

        proof.sourceUnavailable = true;
        forceFreshMarketRead();
        await expect(getRunTimeline(user.id, runId, timelineQuery))
          .rejects.toMatchObject({ code: 'SOURCE_UNAVAILABLE' } satisfies
            Partial<BacktestTimelineSourceError>);
        const missingResponse = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        await getBacktestRunTimeline({ user: { id: user.id }, params: { id: runId },
          query: { symbol: 'BTCUSDT' } } as any, missingResponse as any);
        expect(missingResponse.status).toHaveBeenCalledWith(409);
        expect(missingResponse.json).toHaveBeenCalledWith({ error: {
          message: 'Verified intrabar timeline unavailable',
          details: { code: 'SOURCE_UNAVAILABLE' },
        } });
        expect(await prisma.backtestReport.findUniqueOrThrow({
          where: { backtestRunId: runId },
        })).toEqual(originalReport);
        const after = await prisma.backtestRun.findUniqueOrThrow({ where: { id: runId } });
        expect(after.status).toBe('COMPLETED');
        expect((after.seedConfig as Record<string, any>).intrabarSourceDigestBySymbol.BTCUSDT)
          .toBe(persistedDigest);
      } finally {
        proof.changedCandleIndex = -1;
        proof.sourceUnavailable = false;
        if (runId) await deleteOwnedBacktestRunCascade(user.id, runId);
        await prisma.strategy.deleteMany({ where: { userId: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
        resetBacktestDataGatewayCacheForTests();
      }
    });
  });
