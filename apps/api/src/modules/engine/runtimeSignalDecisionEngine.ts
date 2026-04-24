import {
  evaluateStrategySignalAtIndex,
  parseStrategySignalRules,
} from './strategySignalEvaluator';
import { buildStrategySignalAnalysis } from './strategySignalAnalysis';
import {
  RuntimeSignalConditionLine,
  StrategyEvaluation,
} from './runtimeSignalEvaluationTypes';
import { ActiveBotStrategy } from './runtimeSignalLoopDefaults';

export type RuntimeCandle = {
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type RuntimeOrderBookSeries = {
  orderBookImbalance: Array<number | null>;
  orderBookSpreadBps: Array<number | null>;
  orderBookDepthRatio: Array<number | null>;
};

type RuntimeSignalDecisionEngineDeps = {
  getSeries: (
    marketType: 'FUTURES' | 'SPOT',
    symbol: string,
    interval?: string | null,
  ) => RuntimeCandle[] | null;
  resolveFundingRateSeriesForCandles: (
    marketType: 'FUTURES' | 'SPOT',
    symbol: string,
    candles: RuntimeCandle[],
  ) => Array<number | null> | null;
  resolveOpenInterestSeriesForCandles: (
    marketType: 'FUTURES' | 'SPOT',
    symbol: string,
    candles: RuntimeCandle[],
  ) => Array<number | null> | null;
  resolveOrderBookSeriesForCandles: (
    marketType: 'FUTURES' | 'SPOT',
    symbol: string,
    candles: RuntimeCandle[],
  ) => RuntimeOrderBookSeries | null;
};

export class RuntimeSignalDecisionEngine {
  constructor(private readonly deps: RuntimeSignalDecisionEngineDeps) {}

  evaluateStrategy(input: {
    marketType: 'FUTURES' | 'SPOT';
    symbol: string;
    strategy: ActiveBotStrategy;
    decisionOpenTime: number;
  }): StrategyEvaluation {
    const { marketType, symbol, strategy, decisionOpenTime } = input;
    if (!strategy.strategyConfig) {
      return {
        direction: null,
        conditionLines: [],
        indicatorSummary: null,
      };
    }
    const signalRules = parseStrategySignalRules(strategy.strategyConfig);
    if (!signalRules) {
      return {
        direction: null,
        conditionLines: [],
        indicatorSummary: null,
      };
    }

    const candles = this.deps.getSeries(marketType, symbol, strategy.strategyInterval);
    if (!candles || candles.length === 0) {
      return {
        direction: null,
        conditionLines: [],
        indicatorSummary: null,
      };
    }
    const latestIndex = candles.length - 1;
    const decisionIndex = (() => {
      const exactIndex = candles.findIndex((candle) => candle.openTime === decisionOpenTime);
      if (exactIndex >= 0) return exactIndex;

      for (let index = candles.length - 1; index >= 0; index -= 1) {
        if (candles[index].openTime <= decisionOpenTime) return index;
      }

      return latestIndex;
    })();

    const fundingRateSeries = this.deps.resolveFundingRateSeriesForCandles(
      marketType,
      symbol,
      candles,
    );
    const openInterestSeries = this.deps.resolveOpenInterestSeriesForCandles(
      marketType,
      symbol,
      candles,
    );
    const orderBookSeries = this.deps.resolveOrderBookSeriesForCandles(
      marketType,
      symbol,
      candles,
    );
    const derivatives =
      fundingRateSeries || openInterestSeries || orderBookSeries
        ? {
            ...(fundingRateSeries ? { fundingRate: fundingRateSeries } : {}),
            ...(openInterestSeries ? { openInterest: openInterestSeries } : {}),
            ...(orderBookSeries
              ? {
                  orderBookImbalance: orderBookSeries.orderBookImbalance,
                  orderBookSpreadBps: orderBookSeries.orderBookSpreadBps,
                  orderBookDepthRatio: orderBookSeries.orderBookDepthRatio,
                }
              : {}),
          }
        : undefined;
    const indicatorCache = new Map<string, Array<number | null>>();
    const direction = evaluateStrategySignalAtIndex(
      signalRules,
      candles,
      decisionIndex,
      indicatorCache,
      derivatives ? { derivatives } : undefined,
    );
    const analysis = buildStrategySignalAnalysis({
      strategyConfig: strategy.strategyConfig,
      candles,
      decisionIndex,
      derivatives,
    });

    return {
      direction,
      conditionLines: analysis.conditionLines as RuntimeSignalConditionLine[],
      indicatorSummary: analysis.indicatorSummary,
    };
  }
}
