import {
  computeAdxSeriesFromCandles,
  computeAtrSeriesFromCandles,
  computeBollingerSeriesFromCloses,
  computeCciSeriesFromCandles,
  computeDonchianSeriesFromCandles,
  clampPeriod,
  computeEmaSeriesFromCloses,
  computeMacdSeriesFromCloses,
  computeMomentumSeriesFromCloses,
  computeRollingZScoreSeriesFromNullableValues,
  computeRocSeriesFromCloses,
  computeRsiSeriesFromCloses,
  computeSmaSeriesFromNullableValues,
  computeSmaSeriesFromCloses,
  computeStochasticSeriesFromCandles,
  computeStochRsiSeriesFromCloses,
} from './sharedIndicatorSeries';
import {
  CandlePatternParams,
  computeCandlePatternSeries,
  resolveCandlePatternName,
} from './sharedCandlePatternSeries';

export type StrategySignalDerivativesSeries = {
  fundingRate?: Array<number | null>;
  openInterest?: Array<number | null>;
  orderBookImbalance?: Array<number | null>;
  orderBookSpreadBps?: Array<number | null>;
  orderBookDepthRatio?: Array<number | null>;
};

export type StrategyIndicatorSeriesResolverInput = {
  indicatorName: string;
  indicatorParams: Record<string, unknown>;
  opens: number[];
  closes: number[];
  highs: number[];
  lows: number[];
  cache: Map<string, Array<number | null>>;
  derivatives?: StrategySignalDerivativesSeries;
};

const asFiniteNumber = (value: unknown): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const resolvePatternParams = (params: Record<string, unknown>): CandlePatternParams => {
  const dojiBodyToRangeMax = asFiniteNumber(params.dojiBodyToRangeMax ?? params.bodyToRangeMax);
  const hammerBodyToRangeMax = asFiniteNumber(params.hammerBodyToRangeMax);
  const hammerLowerShadowToBodyMin = asFiniteNumber(params.hammerLowerShadowToBodyMin);
  const hammerUpperShadowToBodyMax = asFiniteNumber(params.hammerUpperShadowToBodyMax);
  const shootingStarBodyToRangeMax = asFiniteNumber(params.shootingStarBodyToRangeMax);
  const shootingStarUpperShadowToBodyMin = asFiniteNumber(params.shootingStarUpperShadowToBodyMin);
  const shootingStarLowerShadowToBodyMax = asFiniteNumber(params.shootingStarLowerShadowToBodyMax);

  return {
    ...(dojiBodyToRangeMax !== null ? { dojiBodyToRangeMax } : {}),
    ...(hammerBodyToRangeMax !== null ? { hammerBodyToRangeMax } : {}),
    ...(hammerLowerShadowToBodyMin !== null ? { hammerLowerShadowToBodyMin } : {}),
    ...(hammerUpperShadowToBodyMax !== null ? { hammerUpperShadowToBodyMax } : {}),
    ...(shootingStarBodyToRangeMax !== null ? { shootingStarBodyToRangeMax } : {}),
    ...(shootingStarUpperShadowToBodyMin !== null ? { shootingStarUpperShadowToBodyMin } : {}),
    ...(shootingStarLowerShadowToBodyMax !== null ? { shootingStarLowerShadowToBodyMax } : {}),
  };
};

export const resolveStrategyIndicatorSeries = (
  params: StrategyIndicatorSeriesResolverInput,
): Array<number | null> | null => {
  const name = params.indicatorName.toUpperCase();

  if (name.includes('FUNDING_RATE_ZSCORE')) {
    const period = clampPeriod(
      params.indicatorParams.zScorePeriod ??
        params.indicatorParams.period ??
        params.indicatorParams.length,
      20,
    );
    const rawKey = 'FUNDING_RATE_RAW';
    const zScoreKey = `FUNDING_RATE_ZSCORE_${period}`;
    if (!params.cache.has(rawKey)) {
      const fundingSeries = params.derivatives?.fundingRate ?? [];
      const normalized = params.closes.map((_, index) => {
        const value = fundingSeries[index];
        return typeof value === 'number' && Number.isFinite(value) ? value : null;
      });
      params.cache.set(rawKey, normalized);
    }
    if (!params.cache.has(zScoreKey)) {
      const raw = params.cache.get(rawKey) ?? [];
      params.cache.set(zScoreKey, computeRollingZScoreSeriesFromNullableValues(raw, period));
    }
    return params.cache.get(zScoreKey) ?? null;
  }

  if (name.includes('FUNDING_RATE')) {
    const rawKey = 'FUNDING_RATE_RAW';
    if (!params.cache.has(rawKey)) {
      const fundingSeries = params.derivatives?.fundingRate ?? [];
      const normalized = params.closes.map((_, index) => {
        const value = fundingSeries[index];
        return typeof value === 'number' && Number.isFinite(value) ? value : null;
      });
      params.cache.set(rawKey, normalized);
    }
    return params.cache.get(rawKey) ?? null;
  }

  if (name.includes('OPEN_INTEREST_ZSCORE')) {
    const period = clampPeriod(
      params.indicatorParams.zScorePeriod ??
        params.indicatorParams.period ??
        params.indicatorParams.length,
      20,
    );
    const rawKey = 'OPEN_INTEREST_RAW';
    const zScoreKey = `OPEN_INTEREST_ZSCORE_${period}`;
    if (!params.cache.has(rawKey)) {
      const openInterestSeries = params.derivatives?.openInterest ?? [];
      const normalized = params.closes.map((_, index) => {
        const value = openInterestSeries[index];
        return typeof value === 'number' && Number.isFinite(value) ? value : null;
      });
      params.cache.set(rawKey, normalized);
    }
    if (!params.cache.has(zScoreKey)) {
      const raw = params.cache.get(rawKey) ?? [];
      params.cache.set(zScoreKey, computeRollingZScoreSeriesFromNullableValues(raw, period));
    }
    return params.cache.get(zScoreKey) ?? null;
  }

  if (name.includes('OPEN_INTEREST_MA')) {
    const period = clampPeriod(params.indicatorParams.period ?? params.indicatorParams.length, 20);
    const rawKey = 'OPEN_INTEREST_RAW';
    const maKey = `OPEN_INTEREST_MA_${period}`;
    if (!params.cache.has(rawKey)) {
      const openInterestSeries = params.derivatives?.openInterest ?? [];
      const normalized = params.closes.map((_, index) => {
        const value = openInterestSeries[index];
        return typeof value === 'number' && Number.isFinite(value) ? value : null;
      });
      params.cache.set(rawKey, normalized);
    }
    if (!params.cache.has(maKey)) {
      const raw = params.cache.get(rawKey) ?? [];
      params.cache.set(maKey, computeSmaSeriesFromNullableValues(raw, period));
    }
    return params.cache.get(maKey) ?? null;
  }

  if (name.includes('OPEN_INTEREST_DELTA')) {
    const rawKey = 'OPEN_INTEREST_RAW';
    const deltaKey = 'OPEN_INTEREST_DELTA';
    if (!params.cache.has(rawKey)) {
      const openInterestSeries = params.derivatives?.openInterest ?? [];
      const normalized = params.closes.map((_, index) => {
        const value = openInterestSeries[index];
        return typeof value === 'number' && Number.isFinite(value) ? value : null;
      });
      params.cache.set(rawKey, normalized);
    }
    if (!params.cache.has(deltaKey)) {
      const raw = params.cache.get(rawKey) ?? [];
      const delta = raw.map((value, index) => {
        if (index === 0 || typeof value !== 'number') return null;
        const previous = raw[index - 1];
        if (typeof previous !== 'number') return null;
        return value - previous;
      });
      params.cache.set(deltaKey, delta);
    }
    return params.cache.get(deltaKey) ?? null;
  }

  if (name.includes('OPEN_INTEREST')) {
    const rawKey = 'OPEN_INTEREST_RAW';
    if (!params.cache.has(rawKey)) {
      const openInterestSeries = params.derivatives?.openInterest ?? [];
      const normalized = params.closes.map((_, index) => {
        const value = openInterestSeries[index];
        return typeof value === 'number' && Number.isFinite(value) ? value : null;
      });
      params.cache.set(rawKey, normalized);
    }
    return params.cache.get(rawKey) ?? null;
  }

  if (name.includes('ORDER_BOOK_IMBALANCE')) {
    const key = 'ORDER_BOOK_IMBALANCE';
    if (!params.cache.has(key)) {
      const series = params.derivatives?.orderBookImbalance ?? [];
      const normalized = params.closes.map((_, index) => {
        const value = series[index];
        return typeof value === 'number' && Number.isFinite(value) ? value : null;
      });
      params.cache.set(key, normalized);
    }
    return params.cache.get(key) ?? null;
  }

  if (name.includes('ORDER_BOOK_SPREAD_BPS')) {
    const key = 'ORDER_BOOK_SPREAD_BPS';
    if (!params.cache.has(key)) {
      const series = params.derivatives?.orderBookSpreadBps ?? [];
      const normalized = params.closes.map((_, index) => {
        const value = series[index];
        return typeof value === 'number' && Number.isFinite(value) ? value : null;
      });
      params.cache.set(key, normalized);
    }
    return params.cache.get(key) ?? null;
  }

  if (name.includes('ORDER_BOOK_DEPTH_RATIO')) {
    const key = 'ORDER_BOOK_DEPTH_RATIO';
    if (!params.cache.has(key)) {
      const series = params.derivatives?.orderBookDepthRatio ?? [];
      const normalized = params.closes.map((_, index) => {
        const value = series[index];
        return typeof value === 'number' && Number.isFinite(value) ? value : null;
      });
      params.cache.set(key, normalized);
    }
    return params.cache.get(key) ?? null;
  }

  if (name.includes('EMA')) {
    const period = clampPeriod(
      params.indicatorParams.period ??
        params.indicatorParams.length ??
        params.indicatorParams.fast ??
        params.indicatorParams.slow,
      9,
    );
    const key = `EMA_${period}`;
    const series = params.cache.get(key) ?? computeEmaSeriesFromCloses(params.closes, period);
    params.cache.set(key, series);
    return series;
  }

  if (name.includes('MACD')) {
    const fast = clampPeriod(params.indicatorParams.fast, 12);
    const slow = clampPeriod(params.indicatorParams.slow, 26);
    const signal = clampPeriod(params.indicatorParams.signal, 9);
    const baseKey = `MACD_${fast}_${slow}_${signal}`;
    const lineKey = `${baseKey}_LINE`;
    const signalKey = `${baseKey}_SIGNAL`;
    const histogramKey = `${baseKey}_HISTOGRAM`;

    if (!params.cache.has(lineKey) || !params.cache.has(signalKey) || !params.cache.has(histogramKey)) {
      const macd = computeMacdSeriesFromCloses(params.closes, fast, slow, signal);
      params.cache.set(lineKey, macd.line);
      params.cache.set(signalKey, macd.signal);
      params.cache.set(histogramKey, macd.histogram);
    }

    if (name.includes('MACD_SIGNAL')) {
      return params.cache.get(signalKey) ?? null;
    }

    if (name.includes('MACD_HIST')) {
      return params.cache.get(histogramKey) ?? null;
    }

    return params.cache.get(lineKey) ?? null;
  }

  if (name.includes('SMA')) {
    const period = clampPeriod(
      params.indicatorParams.period ??
        params.indicatorParams.length ??
        params.indicatorParams.fast ??
        params.indicatorParams.slow,
      14,
    );
    const key = `SMA_${period}`;
    const series = params.cache.get(key) ?? computeSmaSeriesFromCloses(params.closes, period);
    params.cache.set(key, series);
    return series;
  }

  if (name.includes('STOCHRSI')) {
    const period = clampPeriod(params.indicatorParams.period ?? params.indicatorParams.rsiPeriod, 14);
    const stochPeriod = clampPeriod(params.indicatorParams.stochPeriod ?? period, 14);
    const smoothK = clampPeriod(params.indicatorParams.smoothK, 3);
    const smoothD = clampPeriod(params.indicatorParams.smoothD, 3);
    const baseKey = `STOCHRSI_${period}_${stochPeriod}_${smoothK}_${smoothD}`;
    const kKey = `${baseKey}_K`;
    const dKey = `${baseKey}_D`;

    if (!params.cache.has(kKey) || !params.cache.has(dKey)) {
      const stochRsi = computeStochRsiSeriesFromCloses(
        params.closes,
        period,
        stochPeriod,
        smoothK,
        smoothD,
      );
      params.cache.set(kKey, stochRsi.k);
      params.cache.set(dKey, stochRsi.d);
    }

    if (name.includes('STOCHRSI_D') || name.includes('STOCHRSI_SIGNAL')) {
      return params.cache.get(dKey) ?? null;
    }

    return params.cache.get(kKey) ?? null;
  }

  if (name.includes('RSI')) {
    const period = clampPeriod(params.indicatorParams.period ?? params.indicatorParams.length, 14);
    const key = `RSI_${period}`;
    const series = params.cache.get(key) ?? computeRsiSeriesFromCloses(params.closes, period);
    params.cache.set(key, series);
    return series;
  }

  if (name.includes('ROC')) {
    const period = clampPeriod(params.indicatorParams.period ?? params.indicatorParams.length, 14);
    const key = `ROC_${period}`;
    const series = params.cache.get(key) ?? computeRocSeriesFromCloses(params.closes, period);
    params.cache.set(key, series);
    return series;
  }

  if (name.includes('ATR')) {
    const period = clampPeriod(params.indicatorParams.period ?? params.indicatorParams.length, 14);
    const key = `ATR_${period}`;
    const series =
      params.cache.get(key) ??
      computeAtrSeriesFromCandles(params.highs, params.lows, params.closes, period);
    params.cache.set(key, series);
    return series;
  }

  if (name.includes('CCI')) {
    const period = clampPeriod(params.indicatorParams.period ?? params.indicatorParams.length, 20);
    const key = `CCI_${period}`;
    const series =
      params.cache.get(key) ??
      computeCciSeriesFromCandles(params.highs, params.lows, params.closes, period);
    params.cache.set(key, series);
    return series;
  }

  if (name.includes('DONCHIAN')) {
    const period = clampPeriod(params.indicatorParams.period ?? params.indicatorParams.length, 20);
    const baseKey = `DONCHIAN_${period}`;
    const upperKey = `${baseKey}_UPPER`;
    const middleKey = `${baseKey}_MIDDLE`;
    const lowerKey = `${baseKey}_LOWER`;

    if (!params.cache.has(upperKey) || !params.cache.has(middleKey) || !params.cache.has(lowerKey)) {
      const donchian = computeDonchianSeriesFromCandles(params.highs, params.lows, period);
      params.cache.set(upperKey, donchian.upper);
      params.cache.set(middleKey, donchian.middle);
      params.cache.set(lowerKey, donchian.lower);
    }

    if (name.includes('DONCHIAN_UPPER')) return params.cache.get(upperKey) ?? null;
    if (name.includes('DONCHIAN_LOWER')) return params.cache.get(lowerKey) ?? null;
    return params.cache.get(middleKey) ?? null;
  }

  const pattern = resolveCandlePatternName(name);
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
    const patternParams = resolvePatternParams(params.indicatorParams);
    const key = `PATTERN_${pattern}_${JSON.stringify(patternParams)}`;
    if (!params.cache.has(key)) {
      const candles = params.closes.map((close, index) => ({
        open: params.opens[index] ?? close,
        high: params.highs[index] ?? close,
        low: params.lows[index] ?? close,
        close,
      }));
      const series = computeCandlePatternSeries(candles, pattern, patternParams).map((value) =>
        value ? 1 : 0,
      );
      params.cache.set(key, series);
    }
    return params.cache.get(key) ?? null;
  }

  if (name.includes('ADX') || name.includes('DI_PLUS') || name.includes('DI_MINUS')) {
    const period = clampPeriod(params.indicatorParams.period ?? params.indicatorParams.length, 14);
    const baseKey = `ADX_${period}`;
    const adxKey = `${baseKey}_ADX`;
    const plusKey = `${baseKey}_DI_PLUS`;
    const minusKey = `${baseKey}_DI_MINUS`;

    if (!params.cache.has(adxKey) || !params.cache.has(plusKey) || !params.cache.has(minusKey)) {
      const adxSeries = computeAdxSeriesFromCandles(params.highs, params.lows, params.closes, period);
      params.cache.set(adxKey, adxSeries.adx);
      params.cache.set(plusKey, adxSeries.plusDi);
      params.cache.set(minusKey, adxSeries.minusDi);
    }

    if (name.includes('DI_PLUS')) return params.cache.get(plusKey) ?? null;
    if (name.includes('DI_MINUS')) return params.cache.get(minusKey) ?? null;
    return params.cache.get(adxKey) ?? null;
  }

  if (name.includes('STOCHASTIC')) {
    const period = clampPeriod(params.indicatorParams.period ?? params.indicatorParams.length, 14);
    const smoothK = clampPeriod(params.indicatorParams.smoothK, 3);
    const smoothD = clampPeriod(params.indicatorParams.smoothD, 3);
    const baseKey = `STOCHASTIC_${period}_${smoothK}_${smoothD}`;
    const kKey = `${baseKey}_K`;
    const dKey = `${baseKey}_D`;
    if (!params.cache.has(kKey) || !params.cache.has(dKey)) {
      const stochastic = computeStochasticSeriesFromCandles(
        params.highs,
        params.lows,
        params.closes,
        period,
        smoothK,
        smoothD,
      );
      params.cache.set(kKey, stochastic.k);
      params.cache.set(dKey, stochastic.d);
    }
    if (name.includes('STOCHASTIC_D') || name.includes('STOCHASTIC_SIGNAL')) {
      return params.cache.get(dKey) ?? null;
    }
    return params.cache.get(kKey) ?? null;
  }

  if (name.includes('BOLLINGER')) {
    const period = clampPeriod(params.indicatorParams.period ?? params.indicatorParams.length, 20);
    const stdDev = asFiniteNumber(params.indicatorParams.stdDev ?? params.indicatorParams.deviation) ?? 2;
    const baseKey = `BOLLINGER_${period}_${stdDev}`;
    const upperKey = `${baseKey}_UPPER`;
    const middleKey = `${baseKey}_MIDDLE`;
    const lowerKey = `${baseKey}_LOWER`;
    const bandwidthKey = `${baseKey}_BANDWIDTH`;
    const percentBKey = `${baseKey}_PERCENT_B`;

    if (
      !params.cache.has(upperKey) ||
      !params.cache.has(middleKey) ||
      !params.cache.has(lowerKey) ||
      !params.cache.has(bandwidthKey) ||
      !params.cache.has(percentBKey)
    ) {
      const bollinger = computeBollingerSeriesFromCloses(params.closes, period, stdDev);
      params.cache.set(upperKey, bollinger.upper);
      params.cache.set(middleKey, bollinger.middle);
      params.cache.set(lowerKey, bollinger.lower);
      params.cache.set(bandwidthKey, bollinger.bandwidth);
      params.cache.set(percentBKey, bollinger.percentB);
    }

    if (name.includes('BOLLINGER_UPPER')) return params.cache.get(upperKey) ?? null;
    if (name.includes('BOLLINGER_MIDDLE')) return params.cache.get(middleKey) ?? null;
    if (name.includes('BOLLINGER_LOWER')) return params.cache.get(lowerKey) ?? null;
    if (name.includes('BOLLINGER_BANDWIDTH')) return params.cache.get(bandwidthKey) ?? null;
    if (name.includes('BOLLINGER_PERCENT_B')) return params.cache.get(percentBKey) ?? null;

    return params.cache.get(percentBKey) ?? null;
  }

  if (name.includes('MOMENTUM')) {
    const period = clampPeriod(params.indicatorParams.period ?? params.indicatorParams.length, 14);
    const key = `MOMENTUM_${period}`;
    const series = params.cache.get(key) ?? computeMomentumSeriesFromCloses(params.closes, period);
    params.cache.set(key, series);
    return series;
  }

  return null;
};
