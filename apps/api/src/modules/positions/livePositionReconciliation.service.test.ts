import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  LivePositionReconciliationLoop,
  reconcileExternalPositionsFromExchange,
} from './livePositionReconciliation.service';

afterEach(() => {
  vi.useRealTimers();
});

describe('LivePositionReconciliationLoop', () => {
  it('updates heartbeat status on run', async () => {
    const loop = new LivePositionReconciliationLoop(
      vi.fn().mockResolvedValue({ openPositionsSeen: 3 }),
      10_000
    );

    await loop.runOnce();

    const status = loop.getStatus();
    expect(status.iterations).toBe(1);
    expect(status.lastRunAt).toBeTruthy();
    expect(status.openPositionsSeen).toBe(3);
    expect(status.lastError).toBeNull();
  });

  it('runs periodically when started', async () => {
    vi.useFakeTimers();
    const reconcile = vi.fn().mockResolvedValue({ openPositionsSeen: 1 });
    const loop = new LivePositionReconciliationLoop(reconcile, 1_000);

    loop.start();
    await vi.advanceTimersByTimeAsync(3_100);
    loop.stop();

    expect(reconcile).toHaveBeenCalledTimes(4);
    expect(loop.getStatus().running).toBe(false);
  });
});

describe('reconcileExternalPositionsFromExchange', () => {
  it('creates/updates synced positions and closes stale ones', async () => {
    const createSyncedPosition = vi.fn(async () => undefined);
    const updateSyncedPosition = vi.fn(async () => undefined);
    const closeStaleSyncedPosition = vi.fn(async () => undefined);

    const result = await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-1',
          userId: 'user-1',
        },
      ]),
      resolveOwnershipForApiKey: vi.fn(async () => ({
        status: 'OWNED' as const,
        botId: 'bot-live-1',
        walletId: 'wallet-live-1',
        takeoverEnabled: true,
      })),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'BTC/USDT:USDT',
            side: 'long',
            contracts: 0.01,
            entryPrice: 50000,
            markPrice: 50100,
            unrealizedPnl: 10,
            leverage: 5,
            timestamp: '2026-03-23T00:00:00.000Z',
          },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async ({ externalId }) =>
        externalId === 'key-1:BTCUSDT:LONG' ? { id: 'pos-open-1' } : null
      ),
      updateSyncedPosition,
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => [
        { id: 'pos-open-1', externalId: 'key-1:BTCUSDT:LONG' },
        { id: 'pos-open-stale', externalId: 'key-1:ADAUSDT:LONG' },
      ]),
      closeStaleSyncedPosition,
      now: () => new Date('2026-03-23T00:00:01.000Z'),
    });

    expect(result.openPositionsSeen).toBe(1);
    expect(updateSyncedPosition).toHaveBeenCalledWith(
      'pos-open-1',
      expect.objectContaining({
        symbol: 'BTCUSDT',
        side: 'LONG',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        botId: 'bot-live-1',
        walletId: 'wallet-live-1',
      })
    );
    expect(createSyncedPosition).not.toHaveBeenCalled();
    expect(closeStaleSyncedPosition).toHaveBeenCalledWith(
      'pos-open-stale',
      new Date('2026-03-23T00:00:01.000Z')
    );
  });

  it('creates MANUAL_MANAGED position when external management is disabled', async () => {
    const createSyncedPosition = vi.fn(async () => undefined);

    const result = await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-2',
          userId: 'user-2',
        },
      ]),
      resolveOwnershipForApiKey: vi.fn(async () => ({
        status: 'UNOWNED' as const,
        botId: null,
        walletId: null,
        takeoverEnabled: false,
      })),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'ETH/USDT:USDT',
            side: 'short',
            contracts: 0.2,
            entryPrice: 2000,
            markPrice: 2010,
            unrealizedPnl: -5,
            leverage: 3,
            timestamp: null,
          },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      now: () => new Date('2026-03-23T00:10:00.000Z'),
    });

    expect(result.openPositionsSeen).toBe(1);
    expect(createSyncedPosition).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-2',
        symbol: 'ETHUSDT',
        side: 'SHORT',
        managementMode: 'MANUAL_MANAGED',
        syncState: 'IN_SYNC',
        botId: null,
        walletId: null,
      })
    );
  });

  it('continues syncing healthy api keys when one api key fetch fails', async () => {
    const createSyncedPosition = vi.fn(async () => undefined);
    const listOpenSyncedPositionsForApiKey = vi.fn(async () => []);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const result = await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-failing',
          userId: 'user-1',
        },
        {
          id: 'key-healthy',
          userId: 'user-2',
        },
      ]),
      resolveOwnershipForApiKey: vi.fn(async ({ apiKeyId }: { apiKeyId: string }) => {
        if (apiKeyId === 'key-failing') {
          return { status: 'UNOWNED' as const, botId: null, walletId: null, takeoverEnabled: true };
        }
        return {
          status: 'OWNED' as const,
          botId: 'bot-live-2',
          walletId: 'wallet-live-2',
          takeoverEnabled: true,
        };
      }),
      fetchPositionsForApiKey: vi.fn(async (apiKey) => {
        if (apiKey.id === 'key-failing') {
          throw new Error('exchange_timeout');
        }
        return {
          positions: [
            {
              symbol: 'BTC/USDT:USDT',
              side: 'long',
              contracts: 0.05,
              entryPrice: 60000,
              markPrice: 60010,
              unrealizedPnl: 2,
              leverage: 2,
              timestamp: null,
            },
          ],
        };
      }),
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey,
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      now: () => new Date('2026-03-23T00:10:00.000Z'),
    });

    expect(result.openPositionsSeen).toBe(1);
    expect(createSyncedPosition).toHaveBeenCalledTimes(1);
    expect(createSyncedPosition).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-2',
        externalId: 'key-healthy:BTCUSDT:LONG',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        botId: 'bot-live-2',
        walletId: 'wallet-live-2',
      })
    );
    expect(listOpenSyncedPositionsForApiKey).toHaveBeenCalledTimes(1);
    expect(listOpenSyncedPositionsForApiKey).toHaveBeenCalledWith({
      userId: 'user-2',
      apiKeyId: 'key-healthy',
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[LivePositionReconciliation] apiKey=key-failing user=user-1 failed: exchange_timeout'
    );

    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('falls back to MANUAL_MANAGED + DRIFT when takeover ownership is ambiguous', async () => {
    const createSyncedPosition = vi.fn(async () => undefined);
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const result = await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-ambiguous',
          userId: 'user-ambiguous',
        },
      ]),
      resolveOwnershipForApiKey: vi.fn(async () => ({
        status: 'AMBIGUOUS' as const,
        botId: null,
        walletId: null,
        takeoverEnabled: true,
      })),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'BNB/USDT:USDT',
            side: 'long',
            contracts: 1,
            entryPrice: 500,
            markPrice: 501,
            unrealizedPnl: 1,
            leverage: 5,
            timestamp: null,
          },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      now: () => new Date('2026-03-23T00:20:00.000Z'),
    });

    expect(result.openPositionsSeen).toBe(1);
    expect(createSyncedPosition).toHaveBeenCalledWith(
      expect.objectContaining({
        managementMode: 'MANUAL_MANAGED',
        syncState: 'DRIFT',
        botId: null,
        walletId: null,
      })
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[LivePositionReconciliation] apiKey=key-ambiguous user=user-ambiguous unresolved_takeover_owner=AMBIGUOUS'
    );

    consoleWarnSpy.mockRestore();
  });

  it('skips syncing open positions when canonical entry truth is missing', async () => {
    const createSyncedPosition = vi.fn(async () => undefined);
    const updateSyncedPosition = vi.fn(async () => undefined);
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const result = await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-missing-entry',
          userId: 'user-missing-entry',
        },
      ]),
      resolveOwnershipForApiKey: vi.fn(async () => ({
        status: 'OWNED' as const,
        botId: 'bot-live-safe',
        walletId: 'wallet-live-safe',
        takeoverEnabled: true,
      })),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'SOL/USDT:USDT',
            side: 'long',
            contracts: 2,
            entryPrice: null,
            markPrice: null,
            unrealizedPnl: null,
            leverage: 4,
            timestamp: null,
          },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async () => ({ id: 'pos-existing-safe' })),
      updateSyncedPosition,
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => [
        { id: 'pos-existing-safe', externalId: 'key-missing-entry:SOLUSDT:LONG' },
      ]),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      now: () => new Date('2026-03-23T00:30:00.000Z'),
    });

    expect(result.openPositionsSeen).toBe(1);
    expect(updateSyncedPosition).not.toHaveBeenCalled();
    expect(createSyncedPosition).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[LivePositionReconciliation] apiKey=key-missing-entry user=user-missing-entry symbol=SOLUSDT missing_entry_truth'
    );

    consoleWarnSpy.mockRestore();
  });

  it('reconciles open exchange orders for owned BOT_MANAGED takeover lifecycle', async () => {
    const upsertSyncedOpenOrder = vi.fn(async () => undefined);
    const markStaleSyncedOrderUnresolved = vi.fn(async () => undefined);

    const result = await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-orders-1',
          userId: 'user-orders-1',
        },
      ]),
      resolveOwnershipForApiKey: vi.fn(async () => ({
        status: 'OWNED' as const,
        botId: 'bot-owned-1',
        walletId: 'wallet-owned-1',
        takeoverEnabled: true,
      })),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [],
      })),
      fetchOpenOrdersForApiKey: vi.fn(async () => [
        {
          exchangeOrderId: 'ex-open-1',
          symbol: 'BTC/USDT:USDT',
          side: 'buy',
          type: 'limit',
          status: 'open',
          amount: 0.2,
          filled: 0.05,
          remaining: 0.15,
          price: 61000,
          timestamp: '2026-03-23T01:00:00.000Z',
        },
        {
          exchangeOrderId: 'ex-closed-ignored',
          symbol: 'ETH/USDT:USDT',
          side: 'sell',
          type: 'limit',
          status: 'closed',
          amount: 0.1,
          filled: 0.1,
          remaining: 0,
          price: 3200,
          timestamp: '2026-03-23T01:00:00.000Z',
        },
      ]),
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition: vi.fn(async () => undefined),
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      upsertSyncedOpenOrder,
      listOpenSyncedOrdersForOwner: vi.fn(async () => [
        { id: 'local-open-1', exchangeOrderId: 'ex-open-1' },
        { id: 'local-open-stale-2', exchangeOrderId: 'ex-stale-2' },
      ]),
      markStaleSyncedOrderUnresolved,
      now: () => new Date('2026-03-23T01:01:00.000Z'),
    });

    expect(result.openPositionsSeen).toBe(0);
    expect(upsertSyncedOpenOrder).toHaveBeenCalledTimes(1);
    expect(upsertSyncedOpenOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-orders-1',
        exchangeOrderId: 'ex-open-1',
        botId: 'bot-owned-1',
        walletId: 'wallet-owned-1',
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 0.2,
        filledQuantity: 0.05,
      })
    );
    expect(markStaleSyncedOrderUnresolved).toHaveBeenCalledTimes(1);
    expect(markStaleSyncedOrderUnresolved).toHaveBeenCalledWith('local-open-stale-2');
  });

  it('closes stale local managed live positions when exchange no longer confirms them after grace window', async () => {
    const closeStaleLocalManagedPosition = vi.fn(async () => undefined);

    const result = await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-stale-local-1',
          userId: 'user-stale-local-1',
        },
      ]),
      resolveOwnershipForApiKey: vi.fn(async () => ({
        status: 'OWNED' as const,
        botId: 'bot-stale-local-1',
        walletId: 'wallet-stale-local-1',
        takeoverEnabled: true,
      })),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'DOGE/USDT:USDT',
            side: 'short',
            contracts: 54,
            entryPrice: 0.09791,
            markPrice: 0.09792,
            unrealizedPnl: 0.01,
            leverage: 15,
            timestamp: '2026-03-23T01:00:00.000Z',
          },
        ],
      })),
      fetchOpenOrdersForApiKey: vi.fn(async () => []),
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition: vi.fn(async () => undefined),
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      upsertSyncedOpenOrder: vi.fn(async () => undefined),
      listOpenSyncedOrdersForOwner: vi.fn(async () => []),
      markStaleSyncedOrderUnresolved: vi.fn(async () => undefined),
      listOpenLocalManagedPositionsForOwner: vi.fn(async () => [
        {
          id: 'pos-live-stale-bnb',
          symbol: 'BNBUSDT',
          side: 'SHORT' as const,
          openedAt: new Date('2026-03-23T00:30:00.000Z'),
        },
        {
          id: 'pos-live-current-doge',
          symbol: 'DOGEUSDT',
          side: 'SHORT' as const,
          openedAt: new Date('2026-03-23T00:30:00.000Z'),
        },
        {
          id: 'pos-live-fresh-sol',
          symbol: 'SOLUSDT',
          side: 'LONG' as const,
          openedAt: new Date('2026-03-23T01:09:30.000Z'),
        },
      ]),
      closeStaleLocalManagedPosition,
      now: () => new Date('2026-03-23T01:10:00.000Z'),
    });

    expect(result.openPositionsSeen).toBe(1);
    expect(closeStaleLocalManagedPosition).toHaveBeenCalledTimes(1);
    expect(closeStaleLocalManagedPosition).toHaveBeenCalledWith(
      'pos-live-stale-bnb',
      new Date('2026-03-23T01:10:00.000Z')
    );
  });

  it('still closes long-stale local managed live positions when open-order snapshot fetch fails', async () => {
    const closeStaleLocalManagedPosition = vi.fn(async () => undefined);

    const result = await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-stale-local-fallback-1',
          userId: 'user-stale-local-fallback-1',
        },
      ]),
      resolveOwnershipForApiKey: vi.fn(async () => ({
        status: 'OWNED' as const,
        botId: 'bot-stale-local-fallback-1',
        walletId: 'wallet-stale-local-fallback-1',
        takeoverEnabled: true,
      })),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'DOGE/USDT:USDT',
            side: 'short',
            contracts: 54,
            entryPrice: 0.09791,
            markPrice: 0.09792,
            unrealizedPnl: 0.01,
            leverage: 15,
            timestamp: '2026-03-23T01:00:00.000Z',
          },
        ],
      })),
      fetchOpenOrdersForApiKey: vi.fn(async () => {
        throw new Error('binance_open_orders_denied');
      }),
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition: vi.fn(async () => undefined),
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      upsertSyncedOpenOrder: vi.fn(async () => undefined),
      listOpenSyncedOrdersForOwner: vi.fn(async () => []),
      markStaleSyncedOrderUnresolved: vi.fn(async () => undefined),
      listOpenLocalManagedPositionsForOwner: vi.fn(async () => [
        {
          id: 'pos-live-stale-bnb-fallback',
          symbol: 'BNBUSDT',
          side: 'SHORT' as const,
          openedAt: new Date('2026-03-23T00:00:00.000Z'),
        },
        {
          id: 'pos-live-fresh-sol-fallback',
          symbol: 'SOLUSDT',
          side: 'LONG' as const,
          openedAt: new Date('2026-03-23T01:30:30.000Z'),
        },
      ]),
      closeStaleLocalManagedPosition,
      now: () => new Date('2026-03-23T02:00:00.000Z'),
    });

    expect(result.openPositionsSeen).toBe(1);
    expect(closeStaleLocalManagedPosition).toHaveBeenCalledTimes(1);
    expect(closeStaleLocalManagedPosition).toHaveBeenCalledWith(
      'pos-live-stale-bnb-fallback',
      new Date('2026-03-23T02:00:00.000Z')
    );
  });
});
