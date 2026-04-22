import { describe, expect, it, vi } from 'vitest';

import {
  BacktestRunValidationError,
  computeAdaptiveMaxCandles,
  resolveBacktestRangeWindow,
  resolveReplaySymbolsForTimeline,
  resolveTimelineEndTimeMs,
} from './backtestRange.service';

describe('backtestRange.service', () => {
  it('keeps explicit range bounded and rejects inverted windows', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-21T12:34:56.000Z'));

    expect(
      resolveBacktestRangeWindow({
        timeframe: '1h',
        startAt: new Date('2026-04-20T00:00:00.000Z'),
        endAt: new Date('2026-04-21T12:40:00.000Z'),
      }).endAt.toISOString()
    ).toBe('2026-04-21T12:00:00.000Z');

    expect(() =>
      resolveBacktestRangeWindow({
        timeframe: '1h',
        startAt: new Date('2026-04-21T13:00:00.000Z'),
        endAt: new Date('2026-04-21T12:00:00.000Z'),
      })
    ).toThrow(BacktestRunValidationError);

    vi.useRealTimers();
  });

  it('derives adaptive max candles and timeline helpers deterministically', () => {
    expect(computeAdaptiveMaxCandles('1h', 12, 2000)).toBe(2000);
    expect(computeAdaptiveMaxCandles('1h', 150, 2000)).toBe(900);
    expect(
      resolveReplaySymbolsForTimeline({
        runSymbols: ['BTCUSDT', 'ETHUSDT'],
        requestedSymbol: 'BTCUSDT',
        replayContext: 'portfolio',
      })
    ).toEqual(['BTCUSDT', 'ETHUSDT']);
    expect(
      resolveTimelineEndTimeMs({
        runStatus: 'COMPLETED',
        finishedAt: new Date('2026-04-20T10:00:00.000Z'),
        configuredRangeEndTime: null,
      })
    ).toBe(new Date('2026-04-20T10:00:00.000Z').getTime());
  });
});
