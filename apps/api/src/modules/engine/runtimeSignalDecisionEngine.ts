import {
  evaluateStrategySignalAtIndex,
  parseStrategySignalRules,
} from './strategySignalEvaluator';
import { clampPeriod } from './sharedIndicatorSeries';
import { resolveCandlePatternName } from './sharedCandlePatternSeries';
import { resolveStrategyIndicatorSeries } from './strategyIndicatorKernel';
import {
  RuntimeSignalConditionLine,
  StrategyEvaluation,
} from './runtimeSignalEvaluationTypes';
import {
  ActiveBotStrategy,
  formatIndicatorValue,
  formatRuleTarget,
  resolvePatternParams,
} from './runtimeSignalLoopDefaults';

type RuntimeCandle = {
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type RuntimeOrderBookSeries = {
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
    const opens = candles.map((candle) => candle.open);
    const closes = candles.map((candle) => candle.close);
    const highs = candles.map((candle) => candle.high);
    const lows = candles.map((candle) => candle.low);
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
    const emptySeries = Array.from({ length: candles.length }, () => null);
    const resolveIndicator = (indicatorName: string, indicatorParams: Record<string, unknown>) =>
      resolveStrategyIndicatorSeries({
        indicatorName,
        indicatorParams,
        opens,
        closes,
        highs,
        lows,
        cache: indicatorCache,
        derivatives,
      });
    const withFallback = (series: Array<number | null> | null) => series ?? emptySeries;

    const ensureEma = (period: number) => withFallback(resolveIndicator('EMA', { period }));
    const ensureRsi = (period: number) => withFallback(resolveIndicator('RSI', { period }));
    const ensureSma = (period: number) => withFallback(resolveIndicator('SMA', { period }));
    const ensureMomentum = (period: number) => withFallback(resolveIndicator('MOMENTUM', { period }));
    const ensureFundingRate = () => withFallback(resolveIndicator('FUNDING_RATE', {}));
    const ensureFundingRateZScore = (period: number) =>
      withFallback(resolveIndicator('FUNDING_RATE_ZSCORE', { zScorePeriod: period }));
    const ensureOpenInterest = () => withFallback(resolveIndicator('OPEN_INTEREST', {}));
    const ensureOpenInterestDelta = () => withFallback(resolveIndicator('OPEN_INTEREST_DELTA', {}));
    const ensureOpenInterestMa = (period: number) =>
      withFallback(resolveIndicator('OPEN_INTEREST_MA', { period }));
    const ensureOpenInterestZScore = (period: number) =>
      withFallback(resolveIndicator('OPEN_INTEREST_ZSCORE', { zScorePeriod: period }));
    const ensureOrderBookImbalance = () => withFallback(resolveIndicator('ORDER_BOOK_IMBALANCE', {}));
    const ensureOrderBookSpreadBps = () => withFallback(resolveIndicator('ORDER_BOOK_SPREAD_BPS', {}));
    const ensureOrderBookDepthRatio = () => withFallback(resolveIndicator('ORDER_BOOK_DEPTH_RATIO', {}));
    const ensureRoc = (period: number) => withFallback(resolveIndicator('ROC', { period }));
    const ensureAtr = (period: number) => withFallback(resolveIndicator('ATR', { period }));
    const ensureCci = (period: number) => withFallback(resolveIndicator('CCI', { period }));
    const ensureAdx = (period: number) => ({
      adx: withFallback(resolveIndicator('ADX', { period })),
      plusDi: withFallback(resolveIndicator('DI_PLUS', { period })),
      minusDi: withFallback(resolveIndicator('DI_MINUS', { period })),
    });
    const ensureStochastic = (period: number, smoothK: number, smoothD: number) => ({
      k: withFallback(resolveIndicator('STOCHASTIC', { period, smoothK, smoothD })),
      d: withFallback(resolveIndicator('STOCHASTIC_D', { period, smoothK, smoothD })),
    });
    const ensureMacd = (fast: number, slow: number, signal: number) => ({
      line: withFallback(resolveIndicator('MACD', { fast, slow, signal })),
      signal: withFallback(resolveIndicator('MACD_SIGNAL', { fast, slow, signal })),
      histogram: withFallback(resolveIndicator('MACD_HIST', { fast, slow, signal })),
    });
    const ensureStochRsi = (
      period: number,
      stochPeriod: number,
      smoothK: number,
      smoothD: number,
    ) => ({
      k: withFallback(resolveIndicator('STOCHRSI', { period, stochPeriod, smoothK, smoothD })),
      d: withFallback(resolveIndicator('STOCHRSI_D', { period, stochPeriod, smoothK, smoothD })),
    });
    const ensureBollinger = (period: number, stdDev: number) => ({
      upper: withFallback(resolveIndicator('BOLLINGER_UPPER', { period, stdDev })),
      middle: withFallback(resolveIndicator('BOLLINGER_MIDDLE', { period, stdDev })),
      lower: withFallback(resolveIndicator('BOLLINGER_LOWER', { period, stdDev })),
      bandwidth: withFallback(resolveIndicator('BOLLINGER_BANDWIDTH', { period, stdDev })),
      percentB: withFallback(resolveIndicator('BOLLINGER_PERCENT_B', { period, stdDev })),
    });
    const ensureDonchian = (period: number) => ({
      upper: withFallback(resolveIndicator('DONCHIAN_UPPER', { period })),
      middle: withFallback(resolveIndicator('DONCHIAN_MIDDLE', { period })),
      lower: withFallback(resolveIndicator('DONCHIAN_LOWER', { period })),
    });
    const ensurePattern = (patternName: string, rawParams: Record<string, unknown>) => {
      const pattern = resolveCandlePatternName(patternName);
      if (!pattern) return null;
      return withFallback(resolveIndicator(pattern, rawParams));
    };

    const conditionLines: RuntimeSignalConditionLine[] = [];
    const indicatorParts: string[] = [];
    const indicatorKeys = new Set<string>();
    const pushRule = (
      scope: 'LONG' | 'SHORT',
      rule: { name: string; condition: string; value: number; params: Record<string, unknown> }
    ) => {
      const indicator = rule.name.toUpperCase();
      if (indicator.includes('FUNDING_RATE_ZSCORE')) {
        const period = clampPeriod(
          rule.params.zScorePeriod ?? rule.params.period ?? rule.params.length,
          20,
        );
        const value = ensureFundingRateZScore(period)[decisionIndex];
        conditionLines.push({
          scope,
          left: `FUNDING_RATE_ZSCORE(${period})`,
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(`FUNDING_RATE_ZSCORE(${period})`)) {
          indicatorKeys.add(`FUNDING_RATE_ZSCORE(${period})`);
          indicatorParts.push(
            `FUNDING_RATE_ZSCORE(${period})=${formatIndicatorValue(value)}`,
          );
        }
        return;
      }

      if (indicator.includes('FUNDING_RATE')) {
        const value = ensureFundingRate()[decisionIndex];
        conditionLines.push({
          scope,
          left: 'FUNDING_RATE',
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has('FUNDING_RATE')) {
          indicatorKeys.add('FUNDING_RATE');
          indicatorParts.push(`FUNDING_RATE=${formatIndicatorValue(value)}`);
        }
        return;
      }

      if (indicator.includes('OPEN_INTEREST_ZSCORE')) {
        const period = clampPeriod(
          rule.params.zScorePeriod ?? rule.params.period ?? rule.params.length,
          20,
        );
        const value = ensureOpenInterestZScore(period)[decisionIndex];
        conditionLines.push({
          scope,
          left: `OPEN_INTEREST_ZSCORE(${period})`,
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(`OPEN_INTEREST_ZSCORE(${period})`)) {
          indicatorKeys.add(`OPEN_INTEREST_ZSCORE(${period})`);
          indicatorParts.push(
            `OPEN_INTEREST_ZSCORE(${period})=${formatIndicatorValue(value)}`,
          );
        }
        return;
      }

      if (indicator.includes('OPEN_INTEREST_MA')) {
        const period = clampPeriod(rule.params.period ?? rule.params.length, 20);
        const value = ensureOpenInterestMa(period)[decisionIndex];
        conditionLines.push({
          scope,
          left: `OPEN_INTEREST_MA(${period})`,
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(`OPEN_INTEREST_MA(${period})`)) {
          indicatorKeys.add(`OPEN_INTEREST_MA(${period})`);
          indicatorParts.push(
            `OPEN_INTEREST_MA(${period})=${formatIndicatorValue(value)}`,
          );
        }
        return;
      }

      if (indicator.includes('OPEN_INTEREST_DELTA')) {
        const value = ensureOpenInterestDelta()[decisionIndex];
        conditionLines.push({
          scope,
          left: 'OPEN_INTEREST_DELTA',
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has('OPEN_INTEREST_DELTA')) {
          indicatorKeys.add('OPEN_INTEREST_DELTA');
          indicatorParts.push(
            `OPEN_INTEREST_DELTA=${formatIndicatorValue(value)}`,
          );
        }
        return;
      }

      if (indicator.includes('OPEN_INTEREST')) {
        const value = ensureOpenInterest()[decisionIndex];
        conditionLines.push({
          scope,
          left: 'OPEN_INTEREST',
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has('OPEN_INTEREST')) {
          indicatorKeys.add('OPEN_INTEREST');
          indicatorParts.push(`OPEN_INTEREST=${formatIndicatorValue(value)}`);
        }
        return;
      }

      if (indicator.includes('ORDER_BOOK_IMBALANCE')) {
        const value = ensureOrderBookImbalance()[decisionIndex];
        conditionLines.push({
          scope,
          left: 'ORDER_BOOK_IMBALANCE',
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has('ORDER_BOOK_IMBALANCE')) {
          indicatorKeys.add('ORDER_BOOK_IMBALANCE');
          indicatorParts.push(
            `ORDER_BOOK_IMBALANCE=${formatIndicatorValue(value)}`,
          );
        }
        return;
      }

      if (indicator.includes('ORDER_BOOK_SPREAD_BPS')) {
        const value = ensureOrderBookSpreadBps()[decisionIndex];
        conditionLines.push({
          scope,
          left: 'ORDER_BOOK_SPREAD_BPS',
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has('ORDER_BOOK_SPREAD_BPS')) {
          indicatorKeys.add('ORDER_BOOK_SPREAD_BPS');
          indicatorParts.push(
            `ORDER_BOOK_SPREAD_BPS=${formatIndicatorValue(value)}`,
          );
        }
        return;
      }

      if (indicator.includes('ORDER_BOOK_DEPTH_RATIO')) {
        const value = ensureOrderBookDepthRatio()[decisionIndex];
        conditionLines.push({
          scope,
          left: 'ORDER_BOOK_DEPTH_RATIO',
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has('ORDER_BOOK_DEPTH_RATIO')) {
          indicatorKeys.add('ORDER_BOOK_DEPTH_RATIO');
          indicatorParts.push(
            `ORDER_BOOK_DEPTH_RATIO=${formatIndicatorValue(value)}`,
          );
        }
        return;
      }

      if (indicator.includes('EMA')) {
        const fast = clampPeriod(rule.params.fast, 9);
        const slow = clampPeriod(rule.params.slow, 21);
        const fastValue = ensureEma(fast)[decisionIndex];
        const slowValue = ensureEma(slow)[decisionIndex];
        conditionLines.push({
          scope,
          left: `EMA(${fast})`,
          value: formatIndicatorValue(fastValue),
          operator: rule.condition,
          right: `EMA(${slow})=${formatIndicatorValue(slowValue)}`,
        });
        if (!indicatorKeys.has(`EMA(${fast})`)) {
          indicatorKeys.add(`EMA(${fast})`);
          indicatorParts.push(`EMA(${fast})=${formatIndicatorValue(fastValue)}`);
        }
        if (!indicatorKeys.has(`EMA(${slow})`)) {
          indicatorKeys.add(`EMA(${slow})`);
          indicatorParts.push(`EMA(${slow})=${formatIndicatorValue(slowValue)}`);
        }
        return;
      }

      if (indicator.includes('RSI') && !indicator.includes('STOCHRSI')) {
        const period = clampPeriod(rule.params.period ?? rule.params.length, 14);
        const value = ensureRsi(period)[decisionIndex];
        conditionLines.push({
          scope,
          left: `RSI(${period})`,
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(`RSI(${period})`)) {
          indicatorKeys.add(`RSI(${period})`);
          indicatorParts.push(`RSI(${period})=${formatIndicatorValue(value)}`);
        }
        return;
      }

      if (indicator.includes('SMA')) {
        const period = clampPeriod(rule.params.period ?? rule.params.length, 14);
        const value = ensureSma(period)[decisionIndex];
        conditionLines.push({
          scope,
          left: `SMA(${period})`,
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(`SMA(${period})`)) {
          indicatorKeys.add(`SMA(${period})`);
          indicatorParts.push(`SMA(${period})=${formatIndicatorValue(value)}`);
        }
        return;
      }

      if (indicator.includes('MOMENTUM')) {
        const period = clampPeriod(rule.params.period ?? rule.params.length, 14);
        const value = ensureMomentum(period)[decisionIndex];
        conditionLines.push({
          scope,
          left: `MOMENTUM(${period})`,
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(`MOMENTUM(${period})`)) {
          indicatorKeys.add(`MOMENTUM(${period})`);
          indicatorParts.push(`MOMENTUM(${period})=${formatIndicatorValue(value)}`);
        }
        return;
      }

      if (indicator.includes('ROC')) {
        const period = clampPeriod(rule.params.period ?? rule.params.length, 14);
        const value = ensureRoc(period)[decisionIndex];
        conditionLines.push({
          scope,
          left: `ROC(${period})`,
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(`ROC(${period})`)) {
          indicatorKeys.add(`ROC(${period})`);
          indicatorParts.push(`ROC(${period})=${formatIndicatorValue(value)}`);
        }
        return;
      }

      if (indicator.includes('ATR')) {
        const period = clampPeriod(rule.params.period ?? rule.params.length, 14);
        const value = ensureAtr(period)[decisionIndex];
        conditionLines.push({
          scope,
          left: `ATR(${period})`,
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(`ATR(${period})`)) {
          indicatorKeys.add(`ATR(${period})`);
          indicatorParts.push(`ATR(${period})=${formatIndicatorValue(value)}`);
        }
        return;
      }

      if (indicator.includes('CCI')) {
        const period = clampPeriod(rule.params.period ?? rule.params.length, 20);
        const value = ensureCci(period)[decisionIndex];
        conditionLines.push({
          scope,
          left: `CCI(${period})`,
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(`CCI(${period})`)) {
          indicatorKeys.add(`CCI(${period})`);
          indicatorParts.push(`CCI(${period})=${formatIndicatorValue(value)}`);
        }
        return;
      }

      if (indicator.includes('ADX')) {
        const period = clampPeriod(rule.params.period ?? rule.params.length, 14);
        const adx = ensureAdx(period);
        const adxValue = adx.adx[decisionIndex];
        const plusValue = adx.plusDi[decisionIndex];
        const minusValue = adx.minusDi[decisionIndex];
        conditionLines.push({
          scope,
          left: `ADX(${period})`,
          value: formatIndicatorValue(adxValue),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(`ADX(${period})`)) {
          indicatorKeys.add(`ADX(${period})`);
          indicatorParts.push(`ADX(${period})=${formatIndicatorValue(adxValue)}`);
        }
        if (!indicatorKeys.has(`DI_PLUS(${period})`)) {
          indicatorKeys.add(`DI_PLUS(${period})`);
          indicatorParts.push(`DI_PLUS(${period})=${formatIndicatorValue(plusValue)}`);
        }
        if (!indicatorKeys.has(`DI_MINUS(${period})`)) {
          indicatorKeys.add(`DI_MINUS(${period})`);
          indicatorParts.push(`DI_MINUS(${period})=${formatIndicatorValue(minusValue)}`);
        }
        return;
      }

      if (indicator.includes('STOCHASTIC')) {
        const period = clampPeriod(rule.params.period ?? rule.params.length, 14);
        const smoothK = clampPeriod(rule.params.smoothK, 3);
        const smoothD = clampPeriod(rule.params.smoothD, 3);
        const stochastic = ensureStochastic(period, smoothK, smoothD);
        const kValue = stochastic.k[decisionIndex];
        const dValue = stochastic.d[decisionIndex];
        conditionLines.push({
          scope,
          left: `STOCHASTIC_K(${period},${smoothK},${smoothD})`,
          value: formatIndicatorValue(kValue),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(`STOCHASTIC_K(${period},${smoothK},${smoothD})`)) {
          indicatorKeys.add(`STOCHASTIC_K(${period},${smoothK},${smoothD})`);
          indicatorParts.push(`STOCHASTIC_K(${period},${smoothK},${smoothD})=${formatIndicatorValue(kValue)}`);
        }
        if (!indicatorKeys.has(`STOCHASTIC_D(${period},${smoothK},${smoothD})`)) {
          indicatorKeys.add(`STOCHASTIC_D(${period},${smoothK},${smoothD})`);
          indicatorParts.push(`STOCHASTIC_D(${period},${smoothK},${smoothD})=${formatIndicatorValue(dValue)}`);
        }
        return;
      }

      if (indicator.includes('STOCHRSI')) {
        const period = clampPeriod(rule.params.period ?? rule.params.rsiPeriod, 14);
        const stochPeriod = clampPeriod(rule.params.stochPeriod ?? period, 14);
        const smoothK = clampPeriod(rule.params.smoothK, 3);
        const smoothD = clampPeriod(rule.params.smoothD, 3);
        const stochRsi = ensureStochRsi(period, stochPeriod, smoothK, smoothD);
        const kValue = stochRsi.k[decisionIndex];
        const dValue = stochRsi.d[decisionIndex];

        conditionLines.push({
          scope,
          left: `STOCHRSI(${period},${stochPeriod},${smoothK},${smoothD})`,
          value: formatIndicatorValue(kValue),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(`STOCHRSI_K(${period},${stochPeriod},${smoothK},${smoothD})`)) {
          indicatorKeys.add(`STOCHRSI_K(${period},${stochPeriod},${smoothK},${smoothD})`);
          indicatorParts.push(
            `STOCHRSI_K(${period},${stochPeriod},${smoothK},${smoothD})=${formatIndicatorValue(kValue)}`,
          );
        }
        if (!indicatorKeys.has(`STOCHRSI_D(${period},${stochPeriod},${smoothK},${smoothD})`)) {
          indicatorKeys.add(`STOCHRSI_D(${period},${stochPeriod},${smoothK},${smoothD})`);
          indicatorParts.push(
            `STOCHRSI_D(${period},${stochPeriod},${smoothK},${smoothD})=${formatIndicatorValue(dValue)}`,
          );
        }
        return;
      }

      if (indicator.includes('BOLLINGER')) {
        const period = clampPeriod(rule.params.period ?? rule.params.length, 20);
        const stdDevCandidate = Number(rule.params.stdDev ?? rule.params.deviation);
        const stdDev = Number.isFinite(stdDevCandidate) ? stdDevCandidate : 2;
        const bollinger = ensureBollinger(period, stdDev);
        const percentBValue = bollinger.percentB[decisionIndex];
        const bandwidthValue = bollinger.bandwidth[decisionIndex];

        conditionLines.push({
          scope,
          left: `BOLLINGER_PERCENT_B(${period},${stdDev})`,
          value: formatIndicatorValue(percentBValue),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(`BOLLINGER_UPPER(${period},${stdDev})`)) {
          indicatorKeys.add(`BOLLINGER_UPPER(${period},${stdDev})`);
          indicatorParts.push(`BOLLINGER_UPPER(${period},${stdDev})=${formatIndicatorValue(bollinger.upper[decisionIndex])}`);
        }
        if (!indicatorKeys.has(`BOLLINGER_MIDDLE(${period},${stdDev})`)) {
          indicatorKeys.add(`BOLLINGER_MIDDLE(${period},${stdDev})`);
          indicatorParts.push(
            `BOLLINGER_MIDDLE(${period},${stdDev})=${formatIndicatorValue(bollinger.middle[decisionIndex])}`,
          );
        }
        if (!indicatorKeys.has(`BOLLINGER_LOWER(${period},${stdDev})`)) {
          indicatorKeys.add(`BOLLINGER_LOWER(${period},${stdDev})`);
          indicatorParts.push(`BOLLINGER_LOWER(${period},${stdDev})=${formatIndicatorValue(bollinger.lower[decisionIndex])}`);
        }
        if (!indicatorKeys.has(`BOLLINGER_BANDWIDTH(${period},${stdDev})`)) {
          indicatorKeys.add(`BOLLINGER_BANDWIDTH(${period},${stdDev})`);
          indicatorParts.push(`BOLLINGER_BANDWIDTH(${period},${stdDev})=${formatIndicatorValue(bandwidthValue)}`);
        }
        if (!indicatorKeys.has(`BOLLINGER_PERCENT_B(${period},${stdDev})`)) {
          indicatorKeys.add(`BOLLINGER_PERCENT_B(${period},${stdDev})`);
          indicatorParts.push(`BOLLINGER_PERCENT_B(${period},${stdDev})=${formatIndicatorValue(percentBValue)}`);
        }
        return;
      }

      if (indicator.includes('DONCHIAN')) {
        const period = clampPeriod(rule.params.period ?? rule.params.length, 20);
        const donchian = ensureDonchian(period);
        const middleValue = donchian.middle[decisionIndex];

        conditionLines.push({
          scope,
          left: `DONCHIAN_MIDDLE(${period})`,
          value: formatIndicatorValue(middleValue),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(`DONCHIAN_UPPER(${period})`)) {
          indicatorKeys.add(`DONCHIAN_UPPER(${period})`);
          indicatorParts.push(`DONCHIAN_UPPER(${period})=${formatIndicatorValue(donchian.upper[decisionIndex])}`);
        }
        if (!indicatorKeys.has(`DONCHIAN_MIDDLE(${period})`)) {
          indicatorKeys.add(`DONCHIAN_MIDDLE(${period})`);
          indicatorParts.push(`DONCHIAN_MIDDLE(${period})=${formatIndicatorValue(middleValue)}`);
        }
        if (!indicatorKeys.has(`DONCHIAN_LOWER(${period})`)) {
          indicatorKeys.add(`DONCHIAN_LOWER(${period})`);
          indicatorParts.push(`DONCHIAN_LOWER(${period})=${formatIndicatorValue(donchian.lower[decisionIndex])}`);
        }
        return;
      }

      const pattern = resolveCandlePatternName(indicator);
      if (
        pattern &&
        (
          pattern === 'BULLISH_ENGULFING' ||
          pattern === 'BEARISH_ENGULFING' ||
          pattern === 'HAMMER' ||
          pattern === 'SHOOTING_STAR' ||
          pattern === 'DOJI' ||
          pattern === 'MORNING_STAR' ||
          pattern === 'EVENING_STAR' ||
          pattern === 'INSIDE_BAR' ||
          pattern === 'OUTSIDE_BAR'
        )
      ) {
        const patternValues = ensurePattern(indicator, rule.params);
        const value = patternValues ? patternValues[decisionIndex] : null;
        conditionLines.push({
          scope,
          left: pattern,
          value: formatIndicatorValue(value),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });
        if (!indicatorKeys.has(pattern)) {
          indicatorKeys.add(pattern);
          indicatorParts.push(`${pattern}=${formatIndicatorValue(value)}`);
        }
        return;
      }

      if (indicator.includes('MACD')) {
        const fast = clampPeriod(rule.params.fast, 12);
        const slow = clampPeriod(rule.params.slow, 26);
        const signal = clampPeriod(rule.params.signal, 9);
        const macd = ensureMacd(fast, slow, signal);
        const lineValue = macd.line[decisionIndex];
        const signalValue = macd.signal[decisionIndex];
        const histogramValue = macd.histogram[decisionIndex];

        conditionLines.push({
          scope,
          left: `MACD(${fast},${slow},${signal})`,
          value: formatIndicatorValue(lineValue),
          operator: rule.condition,
          right: formatRuleTarget(rule.value),
        });

        if (!indicatorKeys.has(`MACD(${fast},${slow},${signal})`)) {
          indicatorKeys.add(`MACD(${fast},${slow},${signal})`);
          indicatorParts.push(`MACD(${fast},${slow},${signal})=${formatIndicatorValue(lineValue)}`);
        }
        if (!indicatorKeys.has(`MACD_SIGNAL(${fast},${slow},${signal})`)) {
          indicatorKeys.add(`MACD_SIGNAL(${fast},${slow},${signal})`);
          indicatorParts.push(`MACD_SIGNAL(${fast},${slow},${signal})=${formatIndicatorValue(signalValue)}`);
        }
        if (!indicatorKeys.has(`MACD_HIST(${fast},${slow},${signal})`)) {
          indicatorKeys.add(`MACD_HIST(${fast},${slow},${signal})`);
          indicatorParts.push(`MACD_HIST(${fast},${slow},${signal})=${formatIndicatorValue(histogramValue)}`);
        }
        return;
      }

      conditionLines.push({
        scope,
        left: indicator,
        value: 'X',
        operator: rule.condition,
        right: formatRuleTarget(rule.value),
      });
    };

    for (const rule of signalRules.longRules) pushRule('LONG', rule);
    for (const rule of signalRules.shortRules) pushRule('SHORT', rule);

    return {
      direction,
      conditionLines,
      indicatorSummary: indicatorParts.length > 0 ? indicatorParts.join(' | ') : null,
    };
  }
}
