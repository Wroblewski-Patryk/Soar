import { clampPeriod } from './sharedIndicatorSeries';
import { resolveCandlePatternName } from './sharedCandlePatternSeries';
import {
  evaluateStrategyRuleAtIndex,
  parseStrategySignalRules,
  SignalCandle,
  type StrategyIndicatorRule,
  type StrategySignalDerivativesSeries,
} from './strategySignalEvaluator';
import { resolveStrategyIndicatorSeries } from './strategyIndicatorKernel';
import { RuntimeSignalConditionLine } from './runtimeSignalEvaluationTypes';
import { resolvePatternParams } from './runtimeSignalLoopDefaults';

const formatAnalysisValue = (value: number | null | undefined) => {
  if (value == null || !Number.isFinite(value)) return 'n/a';
  return Number(value.toFixed(4)).toString();
};

const formatAnalysisTarget = (value: number) => Number(value.toFixed(6)).toString();

export const buildStrategySignalAnalysis = (input: {
  strategyConfig: Record<string, unknown> | null | undefined;
  candles: SignalCandle[];
  decisionIndex?: number | null;
  derivatives?: StrategySignalDerivativesSeries;
}) => {
  if (!input.strategyConfig || input.candles.length === 0) {
    return {
      conditionLines: [] as RuntimeSignalConditionLine[],
      indicatorSummary: null as string | null,
    };
  }

  const signalRules = parseStrategySignalRules(input.strategyConfig);
  if (!signalRules) {
    return {
      conditionLines: [] as RuntimeSignalConditionLine[],
      indicatorSummary: null as string | null,
    };
  }

  const decisionIndexCandidate =
    typeof input.decisionIndex === 'number' && Number.isInteger(input.decisionIndex)
      ? input.decisionIndex
      : input.candles.length - 1;
  const decisionIndex = Math.min(
    input.candles.length - 1,
    Math.max(0, decisionIndexCandidate),
  );
  const opens = input.candles.map((candle) =>
    typeof candle.open === 'number' && Number.isFinite(candle.open) ? candle.open : candle.close,
  );
  const closes = input.candles.map((candle) => candle.close);
  const highs = input.candles.map((candle) =>
    typeof candle.high === 'number' && Number.isFinite(candle.high) ? candle.high : candle.close,
  );
  const lows = input.candles.map((candle) =>
    typeof candle.low === 'number' && Number.isFinite(candle.low) ? candle.low : candle.close,
  );
  const indicatorCache = new Map<string, Array<number | null>>();
  const emptySeries = Array.from({ length: input.candles.length }, () => null);
  const resolveIndicator = (indicatorName: string, indicatorParams: Record<string, unknown>) =>
    resolveStrategyIndicatorSeries({
      indicatorName,
      indicatorParams,
      opens,
      closes,
      highs,
      lows,
      cache: indicatorCache,
      derivatives: input.derivatives,
    });
  const withFallback = (series: Array<number | null> | null) => series ?? emptySeries;

  const ensureEma = (period: number) => withFallback(resolveIndicator('EMA', { period }));
  const ensureRsi = (period: number) => withFallback(resolveIndicator('RSI', { period }));
  const ensureSma = (period: number) => withFallback(resolveIndicator('SMA', { period }));
  const ensureMomentum = (period: number) =>
    withFallback(resolveIndicator('MOMENTUM', { period }));
  const ensureFundingRate = () => withFallback(resolveIndicator('FUNDING_RATE', {}));
  const ensureFundingRateZScore = (period: number) =>
    withFallback(resolveIndicator('FUNDING_RATE_ZSCORE', { zScorePeriod: period }));
  const ensureOpenInterest = () => withFallback(resolveIndicator('OPEN_INTEREST', {}));
  const ensureOpenInterestDelta = () =>
    withFallback(resolveIndicator('OPEN_INTEREST_DELTA', {}));
  const ensureOpenInterestMa = (period: number) =>
    withFallback(resolveIndicator('OPEN_INTEREST_MA', { period }));
  const ensureOpenInterestZScore = (period: number) =>
    withFallback(resolveIndicator('OPEN_INTEREST_ZSCORE', { zScorePeriod: period }));
  const ensureOrderBookImbalance = () =>
    withFallback(resolveIndicator('ORDER_BOOK_IMBALANCE', {}));
  const ensureOrderBookSpreadBps = () =>
    withFallback(resolveIndicator('ORDER_BOOK_SPREAD_BPS', {}));
  const ensureOrderBookDepthRatio = () =>
    withFallback(resolveIndicator('ORDER_BOOK_DEPTH_RATIO', {}));
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
    d: withFallback(
      resolveIndicator('STOCHRSI_D', { period, stochPeriod, smoothK, smoothD }),
    ),
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
  const pushIndicatorSummary = (key: string, value: string) => {
    if (indicatorKeys.has(key)) return;
    indicatorKeys.add(key);
    indicatorParts.push(`${key}=${value}`);
  };
  const pushRule = (
    scope: 'LONG' | 'SHORT',
    rule: StrategyIndicatorRule,
  ) => {
    const indicator = rule.name.toUpperCase();
    const matched = evaluateStrategyRuleAtIndex({
      rule,
      candles: input.candles,
      index: decisionIndex,
      cache: indicatorCache,
      context: input.derivatives ? { derivatives: input.derivatives } : undefined,
    });
    const pushConditionLine = (line: Omit<RuntimeSignalConditionLine, 'matched'>) => {
      conditionLines.push({
        ...line,
        matched: line.value === 'n/a' ? null : matched,
      });
    };
    if (indicator.includes('FUNDING_RATE_ZSCORE')) {
      const period = clampPeriod(
        rule.params.zScorePeriod ?? rule.params.period ?? rule.params.length,
        20,
      );
      const value = ensureFundingRateZScore(period)[decisionIndex];
      const formatted = formatAnalysisValue(value);
      pushConditionLine({
        scope,
        left: `FUNDING_RATE_ZSCORE(${period})`,
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(`FUNDING_RATE_ZSCORE(${period})`, formatted);
      return;
    }

    if (indicator.includes('FUNDING_RATE')) {
      const value = ensureFundingRate()[decisionIndex];
      const formatted = formatAnalysisValue(value);
      pushConditionLine({
        scope,
        left: 'FUNDING_RATE',
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary('FUNDING_RATE', formatted);
      return;
    }

    if (indicator.includes('OPEN_INTEREST_ZSCORE')) {
      const period = clampPeriod(
        rule.params.zScorePeriod ?? rule.params.period ?? rule.params.length,
        20,
      );
      const value = ensureOpenInterestZScore(period)[decisionIndex];
      const formatted = formatAnalysisValue(value);
      pushConditionLine({
        scope,
        left: `OPEN_INTEREST_ZSCORE(${period})`,
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(`OPEN_INTEREST_ZSCORE(${period})`, formatted);
      return;
    }

    if (indicator.includes('OPEN_INTEREST_MA')) {
      const period = clampPeriod(rule.params.period ?? rule.params.length, 20);
      const value = ensureOpenInterestMa(period)[decisionIndex];
      const formatted = formatAnalysisValue(value);
      pushConditionLine({
        scope,
        left: `OPEN_INTEREST_MA(${period})`,
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(`OPEN_INTEREST_MA(${period})`, formatted);
      return;
    }

    if (indicator.includes('OPEN_INTEREST_DELTA')) {
      const value = ensureOpenInterestDelta()[decisionIndex];
      const formatted = formatAnalysisValue(value);
      pushConditionLine({
        scope,
        left: 'OPEN_INTEREST_DELTA',
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary('OPEN_INTEREST_DELTA', formatted);
      return;
    }

    if (indicator.includes('OPEN_INTEREST')) {
      const value = ensureOpenInterest()[decisionIndex];
      const formatted = formatAnalysisValue(value);
      pushConditionLine({
        scope,
        left: 'OPEN_INTEREST',
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary('OPEN_INTEREST', formatted);
      return;
    }

    if (indicator.includes('ORDER_BOOK_IMBALANCE')) {
      const value = ensureOrderBookImbalance()[decisionIndex];
      const formatted = formatAnalysisValue(value);
      pushConditionLine({
        scope,
        left: 'ORDER_BOOK_IMBALANCE',
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary('ORDER_BOOK_IMBALANCE', formatted);
      return;
    }

    if (indicator.includes('ORDER_BOOK_SPREAD_BPS')) {
      const value = ensureOrderBookSpreadBps()[decisionIndex];
      const formatted = formatAnalysisValue(value);
      pushConditionLine({
        scope,
        left: 'ORDER_BOOK_SPREAD_BPS',
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary('ORDER_BOOK_SPREAD_BPS', formatted);
      return;
    }

    if (indicator.includes('ORDER_BOOK_DEPTH_RATIO')) {
      const value = ensureOrderBookDepthRatio()[decisionIndex];
      const formatted = formatAnalysisValue(value);
      pushConditionLine({
        scope,
        left: 'ORDER_BOOK_DEPTH_RATIO',
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary('ORDER_BOOK_DEPTH_RATIO', formatted);
      return;
    }

    if (indicator.includes('EMA')) {
      const fast = clampPeriod(rule.params.fast, 9);
      const slow = clampPeriod(rule.params.slow, 21);
      const fastValue = formatAnalysisValue(ensureEma(fast)[decisionIndex]);
      const slowValue = formatAnalysisValue(ensureEma(slow)[decisionIndex]);
      pushConditionLine({
        scope,
        left: `EMA(${fast})`,
        value: fastValue,
        operator: rule.condition,
        right: `EMA(${slow})=${slowValue}`,
      });
      pushIndicatorSummary(`EMA(${fast})`, fastValue);
      pushIndicatorSummary(`EMA(${slow})`, slowValue);
      return;
    }

    if (indicator.includes('RSI') && !indicator.includes('STOCHRSI')) {
      const period = clampPeriod(rule.params.period ?? rule.params.length, 14);
      const formatted = formatAnalysisValue(ensureRsi(period)[decisionIndex]);
      pushConditionLine({
        scope,
        left: `RSI(${period})`,
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(`RSI(${period})`, formatted);
      return;
    }

    if (indicator.includes('SMA')) {
      const period = clampPeriod(rule.params.period ?? rule.params.length, 14);
      const formatted = formatAnalysisValue(ensureSma(period)[decisionIndex]);
      pushConditionLine({
        scope,
        left: `SMA(${period})`,
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(`SMA(${period})`, formatted);
      return;
    }

    if (indicator.includes('MOMENTUM')) {
      const period = clampPeriod(rule.params.period ?? rule.params.length, 14);
      const formatted = formatAnalysisValue(ensureMomentum(period)[decisionIndex]);
      pushConditionLine({
        scope,
        left: `MOMENTUM(${period})`,
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(`MOMENTUM(${period})`, formatted);
      return;
    }

    if (indicator.includes('ROC')) {
      const period = clampPeriod(rule.params.period ?? rule.params.length, 14);
      const formatted = formatAnalysisValue(ensureRoc(period)[decisionIndex]);
      pushConditionLine({
        scope,
        left: `ROC(${period})`,
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(`ROC(${period})`, formatted);
      return;
    }

    if (indicator.includes('ATR')) {
      const period = clampPeriod(rule.params.period ?? rule.params.length, 14);
      const formatted = formatAnalysisValue(ensureAtr(period)[decisionIndex]);
      pushConditionLine({
        scope,
        left: `ATR(${period})`,
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(`ATR(${period})`, formatted);
      return;
    }

    if (indicator.includes('CCI')) {
      const period = clampPeriod(rule.params.period ?? rule.params.length, 20);
      const formatted = formatAnalysisValue(ensureCci(period)[decisionIndex]);
      pushConditionLine({
        scope,
        left: `CCI(${period})`,
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(`CCI(${period})`, formatted);
      return;
    }

    if (indicator.includes('ADX')) {
      const period = clampPeriod(rule.params.period ?? rule.params.length, 14);
      const adx = ensureAdx(period);
      const adxValue = formatAnalysisValue(adx.adx[decisionIndex]);
      const plusValue = formatAnalysisValue(adx.plusDi[decisionIndex]);
      const minusValue = formatAnalysisValue(adx.minusDi[decisionIndex]);
      pushConditionLine({
        scope,
        left: `ADX(${period})`,
        value: adxValue,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(`ADX(${period})`, adxValue);
      pushIndicatorSummary(`DI_PLUS(${period})`, plusValue);
      pushIndicatorSummary(`DI_MINUS(${period})`, minusValue);
      return;
    }

    if (indicator.includes('STOCHASTIC')) {
      const period = clampPeriod(rule.params.period ?? rule.params.length, 14);
      const smoothK = clampPeriod(rule.params.smoothK, 3);
      const smoothD = clampPeriod(rule.params.smoothD, 3);
      const stochastic = ensureStochastic(period, smoothK, smoothD);
      const kValue = formatAnalysisValue(stochastic.k[decisionIndex]);
      const dValue = formatAnalysisValue(stochastic.d[decisionIndex]);
      pushConditionLine({
        scope,
        left: `STOCHASTIC_K(${period},${smoothK},${smoothD})`,
        value: kValue,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(`STOCHASTIC_K(${period},${smoothK},${smoothD})`, kValue);
      pushIndicatorSummary(`STOCHASTIC_D(${period},${smoothK},${smoothD})`, dValue);
      return;
    }

    if (indicator.includes('STOCHRSI')) {
      const period = clampPeriod(rule.params.period ?? rule.params.rsiPeriod, 14);
      const stochPeriod = clampPeriod(rule.params.stochPeriod ?? period, 14);
      const smoothK = clampPeriod(rule.params.smoothK, 3);
      const smoothD = clampPeriod(rule.params.smoothD, 3);
      const stochRsi = ensureStochRsi(period, stochPeriod, smoothK, smoothD);
      const kValue = formatAnalysisValue(stochRsi.k[decisionIndex]);
      const dValue = formatAnalysisValue(stochRsi.d[decisionIndex]);
      pushConditionLine({
        scope,
        left: `STOCHRSI(${period},${stochPeriod},${smoothK},${smoothD})`,
        value: kValue,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(
        `STOCHRSI_K(${period},${stochPeriod},${smoothK},${smoothD})`,
        kValue,
      );
      pushIndicatorSummary(
        `STOCHRSI_D(${period},${stochPeriod},${smoothK},${smoothD})`,
        dValue,
      );
      return;
    }

    if (indicator.includes('BOLLINGER')) {
      const period = clampPeriod(rule.params.period ?? rule.params.length, 20);
      const stdDevCandidate = Number(rule.params.stdDev ?? rule.params.deviation);
      const stdDev = Number.isFinite(stdDevCandidate) ? stdDevCandidate : 2;
      const bollinger = ensureBollinger(period, stdDev);
      const upper = formatAnalysisValue(bollinger.upper[decisionIndex]);
      const middle = formatAnalysisValue(bollinger.middle[decisionIndex]);
      const lower = formatAnalysisValue(bollinger.lower[decisionIndex]);
      const bandwidth = formatAnalysisValue(bollinger.bandwidth[decisionIndex]);
      const percentB = formatAnalysisValue(bollinger.percentB[decisionIndex]);
      pushConditionLine({
        scope,
        left: `BOLLINGER_PERCENT_B(${period},${stdDev})`,
        value: percentB,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(`BOLLINGER_UPPER(${period},${stdDev})`, upper);
      pushIndicatorSummary(`BOLLINGER_MIDDLE(${period},${stdDev})`, middle);
      pushIndicatorSummary(`BOLLINGER_LOWER(${period},${stdDev})`, lower);
      pushIndicatorSummary(`BOLLINGER_BANDWIDTH(${period},${stdDev})`, bandwidth);
      pushIndicatorSummary(`BOLLINGER_PERCENT_B(${period},${stdDev})`, percentB);
      return;
    }

    if (indicator.includes('DONCHIAN')) {
      const period = clampPeriod(rule.params.period ?? rule.params.length, 20);
      const donchian = ensureDonchian(period);
      const upper = formatAnalysisValue(donchian.upper[decisionIndex]);
      const middle = formatAnalysisValue(donchian.middle[decisionIndex]);
      const lower = formatAnalysisValue(donchian.lower[decisionIndex]);
      pushConditionLine({
        scope,
        left: `DONCHIAN_MIDDLE(${period})`,
        value: middle,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(`DONCHIAN_UPPER(${period})`, upper);
      pushIndicatorSummary(`DONCHIAN_MIDDLE(${period})`, middle);
      pushIndicatorSummary(`DONCHIAN_LOWER(${period})`, lower);
      return;
    }

    const pattern = resolveCandlePatternName(indicator);
    if (
      pattern &&
      (pattern === 'BULLISH_ENGULFING' ||
        pattern === 'BEARISH_ENGULFING' ||
        pattern === 'HAMMER' ||
        pattern === 'SHOOTING_STAR' ||
        pattern === 'DOJI' ||
        pattern === 'MORNING_STAR' ||
        pattern === 'EVENING_STAR' ||
        pattern === 'INSIDE_BAR' ||
        pattern === 'OUTSIDE_BAR')
    ) {
      const patternValues = ensurePattern(indicator, resolvePatternParams(rule.params));
      const formatted = formatAnalysisValue(patternValues ? patternValues[decisionIndex] : null);
      pushConditionLine({
        scope,
        left: pattern,
        value: formatted,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(pattern, formatted);
      return;
    }

    if (indicator.includes('MACD')) {
      const fast = clampPeriod(rule.params.fast, 12);
      const slow = clampPeriod(rule.params.slow, 26);
      const signal = clampPeriod(rule.params.signal, 9);
      const macd = ensureMacd(fast, slow, signal);
      const line = formatAnalysisValue(macd.line[decisionIndex]);
      const signalValue = formatAnalysisValue(macd.signal[decisionIndex]);
      const histogram = formatAnalysisValue(macd.histogram[decisionIndex]);
      pushConditionLine({
        scope,
        left: `MACD(${fast},${slow},${signal})`,
        value: line,
        operator: rule.condition,
        right: formatAnalysisTarget(rule.value),
      });
      pushIndicatorSummary(`MACD(${fast},${slow},${signal})`, line);
      pushIndicatorSummary(`MACD_SIGNAL(${fast},${slow},${signal})`, signalValue);
      pushIndicatorSummary(`MACD_HIST(${fast},${slow},${signal})`, histogram);
      return;
    }

    pushConditionLine({
      scope,
      left: indicator,
      value: 'n/a',
      operator: rule.condition,
      right: formatAnalysisTarget(rule.value),
    });
  };

  for (const rule of signalRules.longRules) pushRule('LONG', rule);
  for (const rule of signalRules.shortRules) pushRule('SHORT', rule);

  return {
    conditionLines,
    indicatorSummary: indicatorParts.length > 0 ? indicatorParts.join(' | ') : null,
  };
};
