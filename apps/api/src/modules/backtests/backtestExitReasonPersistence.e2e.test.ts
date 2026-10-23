import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { parseStrategySignalRules } from '../engine/strategySignalEvaluator';
import { createClaimedBacktestRunJob } from './backtestClaimedRun';
import { simulateInterleavedPortfolio } from './backtestPortfolioSimulation.service';

const candlesFor = (prices: number[]) => {
  const padded = [...prices, ...Array.from({ length: 100 - prices.length }, () => prices.at(-1)!)];
  return padded.map((price, index) => ({
    openTime: 1_710_000_000_000 + index * 60_000,
    closeTime: 1_710_000_059_999 + index * 60_000,
    open: price, high: price, low: price, close: price, volume: 1000,
  }));
};

const baseConfig = {
  openConditions: { direction: 'long', noMatchAction: 'EXIT',
    indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: 0, params: { period: 1 } }],
    indicatorsShort: [] },
  close: { mode: 'basic', tp: 99, sl: 20 },
  additional: { dcaEnabled: true, dcaMode: 'basic', dcaTimes: 2,
    dcaSizingBasis: 'usdt_contribution_v1',
    dcaLevels: [{ percent: -30.5, multiplier: 2 }] },
};

const assertIsolatedDatabase = () => {
  const databaseName = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
  if (!databaseName.endsWith('_test')) throw new Error('Requires isolated _test database');
};

describe('durable BACKTEST basic exit reason', () => {
  it.each([
    { reason: 'SL' as const, prices: [0.99, 1, 1, 0.6949, 0.5375, 0.5375, 0.47],
      config: baseConfig, dcaCount: 2, quote: 9 },
    { reason: 'TP' as const, prices: [0.99, 1, 1, 1.3, 0.99],
      config: { ...baseConfig, close: { mode: 'basic', tp: 20, sl: 99 },
        additional: { ...baseConfig.additional, dcaEnabled: false, dcaTimes: 0 } },
      dcaCount: 0, quote: 1 },
  ])('persists $reason after HOLD and keeps one trade/report after job reinitialization',
    async ({ reason, prices, config, dcaCount, quote }) => {
      assertIsolatedDatabase();
      const user = await prisma.user.create({ data: {
        email: `bt-reason-${reason.toLowerCase()}-${randomUUID()}@example.test`, password: 'test-only',
      } });
      const strategy = await prisma.strategy.create({ data: {
        userId: user.id, name: `${reason} exit reason`, interval: '1m', leverage: 1,
        walletRisk: 10, config,
      } });
      const run = await prisma.backtestRun.create({ data: {
        userId: user.id, strategyId: strategy.id, name: `${reason} exit reason`,
        symbol: 'BTCUSDT', timeframe: '1m',
        seedConfig: { symbols: ['BTCUSDT'], marketType: 'FUTURES', leverage: 1,
          marginMode: 'CROSSED', initialBalance: 10, maxCandles: 100,
          feeRate: 0, slippageRate: 0,
          contextSnapshot: { strategy: { id: strategy.id, walletRisk: 10, config } } },
      } });
      try {
        if (reason === 'SL') {
          await prisma.backtestRun.update({ where: { id: run.id }, data: {
            status: 'RUNNING', executionToken: 'expired-worker',
            executionLeaseExpiresAt: new Date(Date.now() - 60_000),
          } });
        }
        const candles = candlesFor(prices);
        const deps = {
          findBacktestRunById: (id: string) => prisma.backtestRun.findUnique({ where: { id } }),
          uniqueSorted: (values: string[]) => [...new Set(values)].sort(),
          computeAdaptiveMaxCandles: () => 100,
          resolveIndicatorWarmupCandles: () => 0,
          normalizeWalletRiskPercent: (value: number) => value,
          parseStrategySignalRules,
          findOwnedStrategySignalConfig: async () => null,
          fetchKlines: async () => candles,
          fetchSupplementalSeries: async () => ({ fundingRates: [], openInterest: [], orderBook: [] }),
          simulateInterleavedPortfolio,
          computeSourceWindowMs: () => 100 * 60_000,
          maxDrawdownFromPnlSeries: () => 0,
        };
        await createClaimedBacktestRunJob(deps)(run.id);
        const firstContributions = await prisma.backtestContribution.findMany({
          where: { backtestRunId: run.id }, orderBy: { addSequence: 'asc' },
        });
        await createClaimedBacktestRunJob(deps)(run.id);
        const storedRun = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
        const trades = await prisma.backtestTrade.findMany({ where: { backtestRunId: run.id } });
        const reports = await prisma.backtestReport.findMany({ where: { backtestRunId: run.id } });
        const contributions = await prisma.backtestContribution.findMany({
          where: { backtestRunId: run.id }, orderBy: { addSequence: 'asc' },
        });
        expect(storedRun.status).toBe('COMPLETED');
        expect(trades).toHaveLength(1);
        expect(reports).toHaveLength(1);
        expect(contributions).toEqual(firstContributions);
        expect(contributions).toHaveLength(dcaCount + 1);
        const metrics = reports[0].metrics as { lifecycleEventCounts: Record<string, number>;
          positionContributionCount: number; entryContributionUsdtTotal: number;
          dcaContributionUsdtTotal: number; positionContributionUsdtTotal: number;
          runLifecycle: { reportReady: boolean } };
        expect(metrics.runLifecycle.reportReady).toBe(true);
        expect(metrics.lifecycleEventCounts).toMatchObject({ ENTRY: 1, DCA: dcaCount,
          EXIT: 0, [reason]: 1 });
        expect(reports[0].totalTrades).toBe(1);
        expect(trades[0].entryPrice * trades[0].quantity).toBeCloseTo(quote, 2);
        expect(metrics.positionContributionCount).toBe(dcaCount + 1);
        expect(metrics.entryContributionUsdtTotal).toBeCloseTo(1, 6);
        expect(metrics.dcaContributionUsdtTotal).toBeCloseTo(quote - 1, 6);
        expect(metrics.positionContributionUsdtTotal).toBeCloseTo(quote, 6);
        expect(contributions.reduce((sum, fill) => sum + fill.contributionUsdt, 0))
          .toBeCloseTo(metrics.positionContributionUsdtTotal, 6);
        if (reason === 'SL') {
          expect(contributions.map((fill) => [fill.kind, fill.addSequence,
            fill.levelIndex, fill.triggerPercent, fill.multiplier, fill.price]))
            .toEqual([
              ['ENTRY', 0, null, null, null, 1],
              ['DCA', 1, 0, -30.5, 2, 0.6949],
              ['DCA', 2, 1, -30.5, 2, 0.5375],
            ]);
          contributions.forEach((fill, index) => expect(fill.contributionUsdt)
            .toBeCloseTo([1, 2, 6][index], 6));
        }
        expect(trades[0].exitReason).toBe(reason);
      } finally {
        await prisma.backtestContribution.deleteMany({ where: { backtestRunId: run.id } });
        await prisma.backtestTrade.deleteMany({ where: { backtestRunId: run.id } });
        await prisma.backtestReport.deleteMany({ where: { backtestRunId: run.id } });
        await prisma.backtestRun.delete({ where: { id: run.id } });
        await prisma.strategy.delete({ where: { id: strategy.id } });
        await prisma.user.delete({ where: { id: user.id } });
      }
    });

  it('preserves an already stored historical SIGNAL_EXIT reason', async () => {
    assertIsolatedDatabase();
    const user = await prisma.user.create({ data: {
      email: `bt-historical-reason-${randomUUID()}@example.test`, password: 'test-only',
    } });
    const run = await prisma.backtestRun.create({ data: {
      userId: user.id, name: 'Historical signal exit', symbol: 'BTCUSDT',
      timeframe: '1m', status: 'COMPLETED', finishedAt: new Date(),
    } });
    try {
      const trade = await prisma.backtestTrade.create({ data: {
        userId: user.id, backtestRunId: run.id, symbol: 'BTCUSDT', side: 'LONG',
        entryPrice: 1, exitPrice: 1.1, quantity: 1,
        openedAt: new Date(1_710_000_000_000), closedAt: new Date(1_710_000_060_000),
        pnl: 0.1, fee: 0, exitReason: 'SIGNAL_EXIT', liquidated: false,
      } });
      expect((await prisma.backtestTrade.findUniqueOrThrow({ where: { id: trade.id } })).exitReason)
        .toBe('SIGNAL_EXIT');
    } finally {
      await prisma.backtestTrade.deleteMany({ where: { backtestRunId: run.id } });
      await prisma.backtestRun.delete({ where: { id: run.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
  });
});
