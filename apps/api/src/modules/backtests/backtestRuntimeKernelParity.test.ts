import { describe, expect, it } from 'vitest';
import { RuntimeSignalDecisionEngine } from '../engine/runtimeSignalDecisionEngine';
import { formatIndicatorValue } from '../engine/runtimeSignalLoopDefaults';
import {
  buildIndicatorSeriesForTests,
  parseStrategyIndicatorsForTests,
} from './backtests.service';

type TimelineSeries = ReturnType<typeof buildIndicatorSeriesForTests>[number];
type ParsedSpec = ReturnType<typeof parseStrategyIndicatorsForTests>[number];

const candles = Array.from({ length: 48 }, (_, index) => {
  const base = 100 + index * 0.8 + Math.sin(index / 4) * 1.5;
  return {
    openTime: index * 60_000,
    closeTime: (index + 1) * 60_000,
    open: base - 0.4,
    high: base + 1.2,
    low: base - 1.1,
    close: base + 0.2,
    volume: 1000 + index * 10,
  };
});

const supplemental = {
  fundingRates: candles.map((candle, index) => ({
    timestamp: candle.closeTime,
    fundingRate: -0.002 + index * 0.00012,
  })),
  openInterest: candles.map((candle, index) => ({
    timestamp: candle.closeTime,
    openInterest: 10_000 + index * 180 + (index % 3) * 40,
  })),
  orderBook: candles.map((candle, index) => ({
    timestamp: candle.closeTime,
    imbalance: -0.2 + index * 0.01,
    spreadBps: 8 + (index % 5),
    depthRatio: 0.8 + index * 0.015,
  })),
};

const runtimeEngine = new RuntimeSignalDecisionEngine({
  getSeries: () => candles,
  resolveFundingRateSeriesForCandles: () => supplemental.fundingRates.map((point) => point.fundingRate),
  resolveOpenInterestSeriesForCandles: () => supplemental.openInterest.map((point) => point.openInterest),
  resolveOrderBookSeriesForCandles: () => ({
    orderBookImbalance: supplemental.orderBook.map((point) => point.imbalance),
    orderBookSpreadBps: supplemental.orderBook.map((point) => point.spreadBps),
    orderBookDepthRatio: supplemental.orderBook.map((point) => point.depthRatio),
  }),
});

const lastIndex = candles.length - 1;

const findSpec = (all: ParsedSpec[], predicate: (spec: ParsedSpec) => boolean) => {
  const match = all.find(predicate);
  if (!match) throw new Error('Expected parsed indicator spec to exist');
  return match;
};

const findSeriesByKey = (all: TimelineSeries[], key: string) => {
  const match = all.find((series) => series.key === key);
  if (!match) throw new Error('Expected timeline indicator series to exist');
  return match;
};

describe('shared indicator kernel parity (runtime vs backtest timeline)', () => {
  it('keeps EMA, MACD, and RSI parity at decision candle', () => {
    const strategyConfig = {
      open: {
        direction: 'long',
        indicatorsLong: [
          { name: 'EMA', condition: '>', value: 0, params: { fast: 9, slow: 21 } },
          { name: 'MACD', condition: '>', value: 0, params: { fast: 8, slow: 17, signal: 5 } },
          { name: 'RSI', condition: '>', value: 0, params: { period: 14 } },
        ],
        indicatorsShort: [],
      },
    } as const;

    const runtimeEvaluation = runtimeEngine.evaluateStrategy({
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      strategy: {
        strategyConfig,
        strategyInterval: '1m',
      } as never,
      decisionOpenTime: candles[lastIndex].openTime,
    });

    const specs = parseStrategyIndicatorsForTests(strategyConfig);
    const timelineSeries = buildIndicatorSeriesForTests(candles, specs, supplemental);
    const emaFastSpec = findSpec(specs, (spec) => spec.source === 'EMA' && spec.params.period === 9);
    const macdLineSpec = findSpec(specs, (spec) => spec.source === 'MACD' && spec.channel === 'LINE');
    const rsiSpec = findSpec(specs, (spec) => spec.source === 'RSI');
    const emaFast = findSeriesByKey(timelineSeries, emaFastSpec.key);
    const macdLine = findSeriesByKey(timelineSeries, macdLineSpec.key);
    const rsi = findSeriesByKey(timelineSeries, rsiSpec.key);

    const byLeft = new Map(runtimeEvaluation.conditionLines.map((line) => [line.left, line.value]));
    expect(byLeft.get('EMA(9)')).toBe(formatIndicatorValue(emaFast.values[lastIndex]));
    expect(byLeft.get('MACD(8,17,5)')).toBe(formatIndicatorValue(macdLine.values[lastIndex]));
    expect(byLeft.get('RSI(14)')).toBe(formatIndicatorValue(rsi.values[lastIndex]));
  });

  it('keeps derivative indicator parity at decision candle', () => {
    const strategyConfig = {
      open: {
        direction: 'long',
        indicatorsLong: [
          { name: 'FUNDING_RATE_ZSCORE', condition: '>', value: -999, params: { zScorePeriod: 8 } },
          { name: 'OPEN_INTEREST_DELTA', condition: '>', value: -999, params: {} },
          { name: 'ORDER_BOOK_DEPTH_RATIO', condition: '>', value: -999, params: {} },
        ],
        indicatorsShort: [],
      },
    } as const;

    const runtimeEvaluation = runtimeEngine.evaluateStrategy({
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      strategy: {
        strategyConfig,
        strategyInterval: '1m',
      } as never,
      decisionOpenTime: candles[lastIndex].openTime,
    });

    const specs = parseStrategyIndicatorsForTests(strategyConfig);
    const timelineSeries = buildIndicatorSeriesForTests(candles, specs, supplemental);
    const fundingZScoreSpec = findSpec(
      specs,
      (spec) => spec.source === 'FUNDING' && spec.channel === 'ZSCORE',
    );
    const openInterestDeltaSpec = findSpec(
      specs,
      (spec) => spec.source === 'OPEN_INTEREST' && spec.channel === 'DELTA',
    );
    const depthRatioSpec = findSpec(
      specs,
      (spec) => spec.source === 'ORDER_BOOK' && spec.channel === 'DEPTH_RATIO',
    );
    const fundingZScore = findSeriesByKey(timelineSeries, fundingZScoreSpec.key);
    const openInterestDelta = findSeriesByKey(timelineSeries, openInterestDeltaSpec.key);
    const depthRatio = findSeriesByKey(timelineSeries, depthRatioSpec.key);

    const byLeft = new Map(runtimeEvaluation.conditionLines.map((line) => [line.left, line.value]));
    expect(byLeft.get('FUNDING_RATE_ZSCORE(8)')).toBe(
      formatIndicatorValue(fundingZScore.values[lastIndex]),
    );
    expect(byLeft.get('OPEN_INTEREST_DELTA')).toBe(
      formatIndicatorValue(openInterestDelta.values[lastIndex]),
    );
    expect(byLeft.get('ORDER_BOOK_DEPTH_RATIO')).toBe(
      formatIndicatorValue(depthRatio.values[lastIndex]),
    );
  });
});
