import { describe, expect, it, vi } from 'vitest';
import { resolveRuntimeLifecycleMarkPrice } from './runtimeLifecycleMarkPrice.service';
import { resolvePreferredRuntimeOrExchangeSyncedPriceWithSource } from './runtimeExchangeSyncedPositionPrice';

describe('resolveRuntimeLifecycleMarkPrice', () => {
  it('prefers futures mark price over ticker last price when available', () => {
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
          markPrice: 109.5,
          eventTime: 1_000,
          priceChangePercent24h: 0,
        })),
        getRecentCloses: vi.fn(() => [108]),
      },
    );

    expect(result).toBe(109.5);
  });

  it('uses ticker last price for spot lifecycle truth', () => {
    const result = resolveRuntimeLifecycleMarkPrice(
      {
        exchange: 'BINANCE',
        marketType: 'SPOT',
        symbol: 'BTCUSDT',
        interval: '5m',
      },
      {
        getTicker: vi.fn(() => ({
          type: 'ticker' as const,
          symbol: 'BTCUSDT',
          exchange: 'BINANCE' as const,
          marketType: 'SPOT' as const,
          lastPrice: 110,
          markPrice: 109.5,
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

describe('resolvePreferredRuntimeOrExchangeSyncedPriceWithSource', () => {
  it('labels exchange-derived mark price when exchange sync is fresher than runtime candidates', () => {
    const result = resolvePreferredRuntimeOrExchangeSyncedPriceWithSource({
      origin: 'EXCHANGE_SYNC',
      status: 'OPEN',
      side: 'SHORT',
      entryPrice: 100,
      quantity: 1,
      unrealizedPnl: -8,
      lastExchangeSyncAt: new Date('2026-05-07T10:05:00.000Z'),
      runtimePriceCandidates: [
        {
          price: 105,
          observedAtMs: new Date('2026-05-07T10:04:00.000Z').getTime(),
          source: 'runtime_symbol_stat',
        },
      ],
    });

    expect(result).toEqual({
      price: 108,
      source: 'exchange_unrealized_pnl',
    });
  });

  it('labels fallback runtime candidates when they are the selected price', () => {
    const result = resolvePreferredRuntimeOrExchangeSyncedPriceWithSource({
      origin: 'BOT',
      status: 'OPEN',
      side: 'LONG',
      entryPrice: 100,
      quantity: 2,
      runtimePriceCandidates: [
        {
          price: 125,
          observedAtMs: null,
          source: 'fallback_ticker',
        },
      ],
    });

    expect(result).toEqual({
      price: 125,
      source: 'fallback_ticker',
    });
  });
});
