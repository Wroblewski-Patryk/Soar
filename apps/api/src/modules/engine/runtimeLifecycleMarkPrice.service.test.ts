import { describe, expect, it, vi } from 'vitest';
import { resolveRuntimeLifecycleMarkPrice } from './runtimeLifecycleMarkPrice.service';

describe('resolveRuntimeLifecycleMarkPrice', () => {
  it('prefers live ticker price when available', () => {
    const result = resolveRuntimeLifecycleMarkPrice(
      {
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
        interval: '5m',
      },
      {
        getTicker: vi.fn(() => ({
          type: 'ticker' as const,
          symbol: 'BTCUSDT',
          exchange: 'BINANCE' as const,
          marketType: 'FUTURES' as const,
          lastPrice: 110,
          eventTime: 1_000,
          priceChangePercent24h: 0,
        })),
        getRecentCloses: vi.fn(() => [108]),
      },
    );

    expect(result).toBe(110);
  });

  it('falls back to the latest positive candle close when ticker is unavailable', () => {
    const result = resolveRuntimeLifecycleMarkPrice(
      {
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
        interval: '5m',
      },
      {
        getTicker: vi.fn(() => null),
        getRecentCloses: vi.fn(() => [104, 112]),
      },
    );

    expect(result).toBe(112);
  });

  it('returns null when neither ticker nor candle close provides market truth', () => {
    const result = resolveRuntimeLifecycleMarkPrice(
      {
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        symbol: 'BTCUSDT',
        interval: '5m',
      },
      {
        getTicker: vi.fn(() => null),
        getRecentCloses: vi.fn(() => []),
      },
    );

    expect(result).toBeNull();
  });
});
