import { describe, expect, it } from 'vitest';
import { buildStrategySignalAnalysis } from '../engine/strategySignalAnalysis';
import {
  mergeRuntimeCandlesForIndicatorRecovery,
  resolveRuntimeSymbolStatsConfiguredContext,
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

  it('prefers canonical active bot market group and strategy links over legacy bot projections', () => {
    const context = resolveRuntimeSymbolStatsConfiguredContext({
      strategyId: 'legacy-strategy',
      symbolGroupId: 'legacy-group',
      strategy: {
        id: 'legacy-strategy',
        name: 'Legacy Strategy',
        interval: '1m',
        config: {},
        updatedAt: new Date('2026-05-01T00:00:00.000Z'),
      },
      symbolGroup: {
        symbols: ['BTCUSDT'],
        marketUniverse: {
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          baseCurrency: 'USDT',
          filterRules: null,
          whitelist: [],
          blacklist: [],
        },
      },
      botMarketGroups: [
        {
          symbolGroup: {
            symbols: ['ETHUSDT', 'DOGEUSDT'],
            marketUniverse: {
              exchange: 'BINANCE',
              marketType: 'FUTURES',
              baseCurrency: 'USDT',
              filterRules: null,
              whitelist: [],
              blacklist: [],
            },
          },
          strategyLinks: [
            {
              strategyId: 'canonical-primary',
              strategy: {
                id: 'canonical-primary',
                name: 'Canonical Primary',
                interval: '5m',
                config: {},
                updatedAt: new Date('2026-05-02T00:00:00.000Z'),
              },
            },
            {
              strategyId: 'canonical-secondary',
              strategy: {
                id: 'canonical-secondary',
                name: 'Canonical Secondary',
                interval: '1m',
                config: {},
                updatedAt: new Date('2026-05-02T00:00:00.000Z'),
              },
            },
          ],
        },
      ],
    } as any);

    expect(context.symbolGroup?.symbols).toEqual(['ETHUSDT', 'DOGEUSDT']);
    expect(context.strategies.map((strategy) => strategy.id)).toEqual([
      'canonical-primary',
      'canonical-secondary',
    ]);
    expect(context.strategyAssignments.map((assignment) => assignment.strategyId)).toEqual([
      'canonical-primary',
      'canonical-secondary',
    ]);
  });
});
