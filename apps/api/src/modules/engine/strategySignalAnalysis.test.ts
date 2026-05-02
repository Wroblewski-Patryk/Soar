import { describe, expect, it } from 'vitest';
import { buildStrategySignalAnalysis } from './strategySignalAnalysis';

describe('strategySignalAnalysis', () => {
  it('marks unavailable indicator condition values as unknown matches', () => {
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
          indicatorsShort: [],
        },
      },
      candles: [
        { open: 100, high: 101, low: 99, close: 100 },
        { open: 100, high: 102, low: 99, close: 101 },
      ],
    });

    expect(analysis.conditionLines).toEqual([
      expect.objectContaining({
        scope: 'LONG',
        left: 'RSI(14)',
        value: 'n/a',
        operator: '<',
        right: '20',
        matched: null,
      }),
    ]);
  });
});
