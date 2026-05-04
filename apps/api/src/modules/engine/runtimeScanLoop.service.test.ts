import { randomUUID } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  deriveRuntimeWatchdogTargets,
  deriveRuntimeWatchdogSymbols,
  listRuntimeWatchdogScanTargets,
  RuntimeScanLoop,
  isRuntimeScanWatchdogEnabled,
  supportsRuntimeWatchdogPositionContext,
} from './runtimeScanLoop.service';

describe('RuntimeScanLoop', () => {
  it('limits watchdog scope to Binance futures ownership contexts', () => {
    expect(
      supportsRuntimeWatchdogPositionContext({
        symbol: 'BTCUSDT',
        bot: { exchange: 'BINANCE', marketType: 'FUTURES' },
      })
    ).toBe(true);
    expect(
      supportsRuntimeWatchdogPositionContext({
        symbol: 'ETHUSDT',
        bot: { exchange: 'BYBIT', marketType: 'FUTURES' },
      })
    ).toBe(false);
    expect(
      supportsRuntimeWatchdogPositionContext({
        symbol: 'SOLUSDT',
        wallet: { exchange: 'BINANCE', marketType: 'SPOT' },
      })
    ).toBe(false);
    expect(
      supportsRuntimeWatchdogPositionContext({
        symbol: 'ADAUSDT',
      })
    ).toBe(false);
  });

  it('derives unique watchdog targets only from supported ownership contexts', () => {
    expect(
      deriveRuntimeWatchdogTargets([
        {
          symbol: 'btcusdt',
          bot: { exchange: 'BINANCE', marketType: 'FUTURES' },
        },
        {
          symbol: 'ETHUSDT',
          bot: { exchange: 'BYBIT', marketType: 'FUTURES' },
        },
        {
          symbol: 'BTCUSDT',
          wallet: { exchange: 'BINANCE', marketType: 'FUTURES' },
        },
        {
          symbol: 'ADAUSDT',
        },
      ])
    ).toEqual([
      {
        symbol: 'BTCUSDT',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
      },
    ]);
    expect(
      deriveRuntimeWatchdogSymbols([
        {
          symbol: 'btcusdt',
          bot: { exchange: 'BINANCE', marketType: 'FUTURES' },
        },
        {
          symbol: 'BTCUSDT',
          wallet: { exchange: 'BINANCE', marketType: 'FUTURES' },
        },
      ])
    ).toEqual(['BTCUSDT']);
  });

  it('derives default watchdog targets only from synced open positions', async () => {
    const suffix = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
    const syncedSymbol = `ZX${suffix}USDT`;
    const staleSymbol = `ZY${suffix}USDT`;
    const user = await prisma.user.create({
      data: {
        email: `runtime-scan-sync-state-${suffix.toLowerCase()}@example.com`,
        password: 'hashed',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Runtime scan sync-state bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        isActive: true,
      },
    });
    await prisma.position.createMany({
      data: [
        {
          userId: user.id,
          botId: bot.id,
          symbol: syncedSymbol,
          side: 'LONG',
          status: 'OPEN',
          syncState: 'IN_SYNC',
          entryPrice: 100,
          quantity: 1,
        },
        {
          userId: user.id,
          botId: bot.id,
          symbol: staleSymbol,
          side: 'LONG',
          status: 'OPEN',
          syncState: 'ORPHAN_LOCAL',
          continuityState: 'REPAIR_ONLY_CLEANUP',
          entryPrice: 100,
          quantity: 1,
        },
      ],
    });

    const targets = await listRuntimeWatchdogScanTargets();

    expect(targets).toEqual(
      expect.arrayContaining([
        {
          symbol: syncedSymbol,
          exchange: 'BINANCE',
          marketType: 'FUTURES',
        },
      ])
    );
    expect(targets).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          symbol: staleSymbol,
        }),
      ])
    );
  });

  it('keeps watchdog auto-loop disabled by default', async () => {
    vi.useFakeTimers();
    const deps = {
      listScanTargets: vi.fn(async () => [
        {
          symbol: 'BTCUSDT',
          exchange: 'BINANCE' as const,
          marketType: 'FUTURES' as const,
        },
      ]),
      getTickerSnapshot: vi.fn(async () => ({
        symbol: 'BTCUSDT',
        exchange: 'BINANCE' as const,
        marketType: 'FUTURES' as const,
        lastPrice: 60300,
        priceChangePercent24h: 0.5,
      })),
      processTicker: vi.fn(async (_event: Record<string, unknown>) => undefined),
      nowMs: vi.fn(() => 123_456),
    };

    const loop = new RuntimeScanLoop(deps);
    loop.start();
    await vi.advanceTimersByTimeAsync(120_000);

    expect(isRuntimeScanWatchdogEnabled()).toBe(false);
    expect(deps.processTicker).not.toHaveBeenCalled();
    loop.stop();
    vi.useRealTimers();
  });

  it('processes configured symbols and forwards synthesized ticker events', async () => {
    const deps = {
      listScanTargets: vi.fn(async () => [
        {
          symbol: 'BTCUSDT',
          exchange: 'BINANCE' as const,
          marketType: 'FUTURES' as const,
        },
        {
          symbol: 'ETHUSDT',
          exchange: 'BINANCE' as const,
          marketType: 'FUTURES' as const,
        },
      ]),
      getTickerSnapshot: vi.fn(async (target: { symbol: string }) => {
        if (target.symbol === 'BTCUSDT') {
          return {
            symbol: 'BTCUSDT',
            exchange: 'BINANCE' as const,
            marketType: 'FUTURES' as const,
            lastPrice: 60300,
            priceChangePercent24h: 0.5,
          };
        }
        return {
          symbol: 'ETHUSDT',
          exchange: 'BINANCE' as const,
          marketType: 'FUTURES' as const,
          lastPrice: 2970,
          priceChangePercent24h: -1,
        };
      }),
      processTicker: vi.fn(async (_event: Record<string, unknown>) => undefined),
      nowMs: vi.fn(() => 123_456),
    };

    const loop = new RuntimeScanLoop(deps);
    await loop.runOnce();

    expect(deps.processTicker).toHaveBeenCalledTimes(2);
    expect(deps.processTicker).toHaveBeenCalledWith(
      expect.objectContaining({
        exchange: 'BINANCE',
        symbol: 'BTCUSDT',
        lastPrice: 60300,
      })
    );
    expect(deps.processTicker).toHaveBeenCalledWith(
      expect.objectContaining({
        exchange: 'BINANCE',
        symbol: 'ETHUSDT',
        lastPrice: 2970,
      })
    );
  });

  it('forwards watchdog fallback as ticker-only payloads (no candle semantics)', async () => {
    const deps = {
      listScanTargets: vi.fn(async () => [
        {
          symbol: 'BTCUSDT',
          exchange: 'BINANCE' as const,
          marketType: 'FUTURES' as const,
        },
      ]),
      getTickerSnapshot: vi.fn(async () => ({
        symbol: 'BTCUSDT',
        exchange: 'BINANCE' as const,
        marketType: 'FUTURES' as const,
        lastPrice: 61234,
        priceChangePercent24h: 1.25,
      })),
      processTicker: vi.fn(async (_event: Record<string, unknown>) => undefined),
      nowMs: vi.fn(() => 777_000),
    };

    const loop = new RuntimeScanLoop(deps);
    await loop.runOnce();

    expect(deps.processTicker).toHaveBeenCalledTimes(1);
    const forwardedCall = deps.processTicker.mock.calls[0];
    expect(forwardedCall).toBeTruthy();
    const forwarded = (forwardedCall?.[0] ?? {}) as Record<string, unknown>;
    expect(forwarded.type).toBe('ticker');
    expect(forwarded.exchange).toBe('BINANCE');
    expect(forwarded.symbol).toBe('BTCUSDT');
    expect(forwarded.eventTime).toBe(777_000);
    expect(forwarded).not.toHaveProperty('interval');
    expect(forwarded).not.toHaveProperty('isFinal');
    expect(forwarded).not.toHaveProperty('openTime');
    expect(forwarded).not.toHaveProperty('closeTime');
  });
});
