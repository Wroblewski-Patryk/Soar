import { describe, expect, it } from 'vitest';
import { buildStrategySignalAnalysis } from '../engine/strategySignalAnalysis';
import {
  mergeRuntimeCandlesForIndicatorRecovery,
} from './runtimeSessionSymbolStatsRead.service';
import type { RuntimeCandle } from '../engine/runtimeSignalMarketDataGateway';

const candle = (index: number, close: number): RuntimeCandle => ({
  openTime: index * 300_000,
  closeTime: index * 300_000 + 299_999,
  open: close - 1,
  high: close + 2,
  low: close - 2,
  close,
  volume: 10 + index,
});

describe('runtimeSessionSymbolStatsRead.service', () => {
  it('tops up short runtime candle history before indicator analysis falls back to n/a', () => {
    const runtimeCandles = [candle(16, 115), candle(17, 118)];
    const fallbackCandles = Array.from({ length: 16 }, (_, index) => candle(index + 1, 100 + index));

    const recoveredCandles = mergeRuntimeCandlesForIndicatorRecovery(
      runtimeCandles,
      fallbackCandles,
      300,
    );
    const analysis = buildStrategySignalAnalysis({
      strategyConfig: {
        open: {
          indicatorsLong: [
            {
              name: 'RSI',
              condition: '<',
              value: 20,
              params: { period: 14 },
            },
          ],
          indicatorsShort: [
            {
              name: 'RSI',
              condition: '>',
              value: 80,
              params: { period: 14 },
            },
          ],
        },
      },
      candles: recoveredCandles,
    });

    expect(recoveredCandles).toHaveLength(17);
    expect(recoveredCandles.at(-1)?.close).toBe(118);
    expect(analysis.conditionLines).toHaveLength(2);
    expect(analysis.conditionLines.every((line) => line.value !== 'n/a')).toBe(true);
    expect(analysis.indicatorSummary).not.toContain('n/a');
  });

  it('keeps runtime candles authoritative when fallback history overlaps', () => {
    const recoveredCandles = mergeRuntimeCandlesForIndicatorRecovery(
      [candle(2, 250), candle(3, 300)],
      [candle(1, 100), candle(2, 200)],
      300,
    );

    expect(recoveredCandles.map((item) => item.close)).toEqual([100, 250, 300]);
  });
});
