import { describe, expect, it } from 'vitest';
import { GetBacktestTimelineQuerySchema } from './backtests.types';
import {
  resolveEffectiveMaxCandlesFromSeed,
  resolveReplaySymbolsForTimeline,
  resolveTimelineEndTimeMs,
  simulateInterleavedPortfolio,
} from './backtests.service';

const makeCandles = (prices: number[]) =>
  prices.map((close, index) => ({
    openTime: 1_710_000_000_000 + index * 60_000,
    closeTime: 1_710_000_030_000 + index * 60_000,
    open: close,
    high: close * 1.005,
    low: close * 0.995,
    close,
    volume: 1_000 + index,
  }));

const countCloseLikeEvents = (eventCounts: Record<string, number>) =>
  (eventCounts.EXIT ?? 0) +
  (eventCounts.TP ?? 0) +
  (eventCounts.TTP ?? 0) +
  (eventCounts.SL ?? 0) +
  (eventCounts.TRAILING ?? 0) +
  (eventCounts.LIQUIDATION ?? 0);

describe('backtest parity remediation contracts', () => {
  it('keeps target symbol deterministic in isolated timeline context even for 50-symbol runs', () => {
    const targetSymbol = 'ZZZUSDT';
    const companionSymbols = Array.from({ length: 49 }, (_, index) =>
      `A${String(index).padStart(2, '0')}USDT`,
    );
    const fiftySymbols = [...companionSymbols, targetSymbol];
    const candles = makeCandles([100, 102, 104, 104]);

    const candlesBySymbol = new Map(fiftySymbols.map((symbol) => [symbol, candles]));

    const isolatedReplay = simulateInterleavedPortfolio({
      symbols: [targetSymbol],
      candlesBySymbol,
      marketType: 'FUTURES',
      leverage: 1,
      marginMode: 'CROSSED',
      strategyConfig: null,
      walletRiskPercent: 100,
      initialBalance: 100,
    });

    const portfolioReplay = simulateInterleavedPortfolio({
      symbols: fiftySymbols,
      candlesBySymbol,
      marketType: 'FUTURES',
      leverage: 1,
      marginMode: 'CROSSED',
      strategyConfig: null,
      walletRiskPercent: 100,
      initialBalance: 100,
    });

    const isolatedTarget = isolatedReplay.perSymbol[targetSymbol];
    const portfolioTarget = portfolioReplay.perSymbol[targetSymbol];

    expect(isolatedTarget).toBeDefined();
    expect(portfolioTarget).toBeDefined();
    expect(isolatedTarget.eventCounts.ENTRY).toBeGreaterThan(0);
    expect(countCloseLikeEvents(isolatedTarget.eventCounts)).toBeGreaterThan(0);
    expect(isolatedTarget.trades.length).toBeGreaterThan(0);

    // Portfolio context can diverge due shared-cash contention; isolated mode preserves deterministic target diagnostics.
    expect(portfolioTarget.trades.length).toBe(0);
    const isolatedNetPnl = isolatedTarget.trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const portfolioNetPnl = portfolioTarget.trades.reduce((sum, trade) => sum + trade.pnl, 0);
    expect(isolatedNetPnl).not.toBe(portfolioNetPnl);
  });

  it('keeps EXIT trace-only in interleaved portfolio simulation', () => {
    const symbol = 'BTCUSDT';
    const candles = makeCandles([100, 102, 102.05, 102.06]);

    const simulation = simulateInterleavedPortfolio({
      symbols: [symbol],
      candlesBySymbol: new Map([[symbol, candles]]),
      marketType: 'FUTURES',
      leverage: 2,
      marginMode: 'CROSSED',
      walletRiskPercent: 100,
      initialBalance: 1_000,
    });

    const perSymbol = simulation.perSymbol[symbol];
    const exitTrace = perSymbol.decisionTrace.filter(
      (entry) => entry.signal === 'EXIT' && entry.trigger === 'THRESHOLD',
    );
    expect(exitTrace.length).toBeGreaterThan(0);
    expect(
      perSymbol.events.some((event) => event.type === 'EXIT' && event.candleIndex < candles.length - 1),
    ).toBe(false);
  });

  it('does not double-count reserved margin after final-candle portfolio close', () => {
    const symbol = 'BTCUSDT';
    const initialBalance = 1_000;
    const simulation = simulateInterleavedPortfolio({
      symbols: [symbol],
      candlesBySymbol: new Map([[symbol, makeCandles([100, 102, 103, 104])]]),
      marketType: 'FUTURES',
      leverage: 1,
      marginMode: 'CROSSED',
      strategyConfig: null,
      walletRiskPercent: 25,
      initialBalance,
    });

    const trades = simulation.perSymbol[symbol].trades;
    const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);

    expect(trades.length).toBeGreaterThan(0);
    expect(simulation.finalBalance).toBeCloseTo(initialBalance + totalPnl, 8);
  });

  it('uses DCA fill price for portfolio reserve accounting before opening another symbol', () => {
    const baseTime = 1_710_000_000_000;
    const candles = (rows: Array<{ close: number; high?: number; low?: number }>) =>
      rows.map((row, index) => ({
        openTime: baseTime + index * 60_000,
        closeTime: baseTime + index * 60_000 + 30_000,
        open: row.close,
        high: row.high ?? row.close,
        low: row.low ?? row.close,
        close: row.close,
        volume: 1_000 + index,
      }));

    const simulation = simulateInterleavedPortfolio({
      symbols: ['BTCUSDT', 'ETHUSDT'],
      candlesBySymbol: new Map([
        [
          'BTCUSDT',
          candles([
            { close: 100 },
            { close: 102, high: 102.5, low: 101.5 },
            { close: 76, high: 102, low: 50 },
            { close: 76 },
          ]),
        ],
        [
          'ETHUSDT',
          candles([
            { close: 100 },
            { close: 100 },
            { close: 104, high: 104.5, low: 103.5 },
            { close: 104 },
          ]),
        ],
      ]),
      marketType: 'FUTURES',
      leverage: 1,
      marginMode: 'CROSSED',
      strategyConfig: null,
      walletRiskPercent: 40,
      initialBalance: 1_000,
    });

    const btcDca = simulation.perSymbol.BTCUSDT.events.find((event) => event.type === 'DCA');
    expect(btcDca?.price).toBe(50);
    expect(simulation.perSymbol.ETHUSDT.eventCounts.ENTRY).toBe(1);
  });

  it('defaults timeline replay context to isolated and keeps portfolio mode explicit', () => {
    const targetSymbol = 'BTCUSDT';
    const runSymbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
    const parsed = GetBacktestTimelineQuerySchema.parse({
      symbol: targetSymbol,
      cursor: 0,
      chunkSize: 300,
      includeCandles: true,
      includeIndicators: true,
      includeEvents: true,
    });

    expect(parsed.replayContext).toBe('isolated');
    expect(
      resolveReplaySymbolsForTimeline({
        runSymbols,
        requestedSymbol: targetSymbol,
        replayContext: parsed.replayContext,
      }),
    ).toEqual([targetSymbol]);

    expect(
      resolveReplaySymbolsForTimeline({
        runSymbols,
        requestedSymbol: targetSymbol,
        replayContext: 'portfolio',
      }),
    ).toEqual(runSymbols);
  });

  it('uses terminal run finishedAt as timeline anchor instead of stale liveProgress', () => {
    const finishedAt = new Date('2026-04-17T12:30:00.000Z');
    const staleLiveProgress = '2026-04-17T11:00:00.000Z';

    expect(
      resolveTimelineEndTimeMs({
        runStatus: 'COMPLETED',
        finishedAt,
        liveProgressCurrentCandleTime: staleLiveProgress,
      }),
    ).toBe(finishedAt.getTime());

    expect(
      resolveTimelineEndTimeMs({
        runStatus: 'RUNNING',
        finishedAt: null,
        liveProgressCurrentCandleTime: staleLiveProgress,
      }),
    ).toBe(new Date(staleLiveProgress).getTime());
  });

  it('keeps terminal timeline anchor on finishedAt for all terminal statuses', () => {
    const finishedAt = new Date('2026-04-17T12:45:00.000Z');
    const staleLiveProgress = '2026-04-17T10:15:00.000Z';

    for (const status of ['COMPLETED', 'FAILED', 'CANCELED'] as const) {
      expect(
        resolveTimelineEndTimeMs({
          runStatus: status,
          finishedAt,
          liveProgressCurrentCandleTime: staleLiveProgress,
        }),
      ).toBe(finishedAt.getTime());
    }
  });

  it('prefers configured range end over runtime finished/progress anchors', () => {
    const configuredEnd = '2026-01-15T00:00:00.000Z';
    const finishedAt = new Date('2026-04-17T12:45:00.000Z');
    const staleLiveProgress = '2026-04-17T10:15:00.000Z';

    expect(
      resolveTimelineEndTimeMs({
        runStatus: 'COMPLETED',
        finishedAt,
        liveProgressCurrentCandleTime: staleLiveProgress,
        configuredRangeEndTime: configuredEnd,
      }),
    ).toBe(new Date(configuredEnd).getTime());
  });

  it('resolves one effective maxCandles value from seed without re-adaptation', () => {
    expect(
      resolveEffectiveMaxCandlesFromSeed({
        seed: {
          requestedMaxCandles: 1000,
          effectiveMaxCandles: 650,
          maxCandles: 650,
        },
        timeframe: '1m',
        symbolCount: 50,
      }),
    ).toBe(650);
  });

  it('preserves legacy maxCandles from seed as already-adapted effective window', () => {
    expect(
      resolveEffectiveMaxCandlesFromSeed({
        seed: {
          requestedMaxCandles: 1000,
          maxCandles: 730,
        },
        timeframe: '1m',
        symbolCount: 120,
      }),
    ).toBe(730);
  });
});
