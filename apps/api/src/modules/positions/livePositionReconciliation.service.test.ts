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
  it('creates/updates synced positions and marks first stale miss as recovering instead of closing', async () => {
    const createSyncedPosition = vi.fn(async () => undefined);
    const updateSyncedPosition = vi.fn(async () => undefined);
    const markMissingSyncedPosition = vi.fn(async () => undefined);
    const closeStaleSyncedPosition = vi.fn(async () => undefined);

    const result = await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-1',
          userId: 'user-1',
        },
      ]),
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-1:BTCUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-live-1',
              walletId: 'wallet-live-1',
            },
          ],
        ])
      ),
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
        externalId === 'key-1:BTCUSDT:LONG'
          ? {
              id: 'pos-open-1',
              botId: 'bot-live-1',
              walletId: 'wallet-live-1',
              strategyId: 'strategy-live-1',
              openedAt: new Date('2026-03-23T00:00:00.000Z'),
              managementMode: 'BOT_MANAGED' as const,
              continuityState: 'CONFIRMED' as const,
              missingSyncCount: 0,
            }
          : null
      ),
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-live-1',
        walletId: 'wallet-live-1',
        strategyId: 'strategy-live-1',
      })),
      updateSyncedPosition,
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => [
        { id: 'pos-open-1', externalId: 'key-1:BTCUSDT:LONG', missingSyncCount: 0 },
        { id: 'pos-open-stale', externalId: 'key-1:ADAUSDT:LONG', missingSyncCount: 0 },
      ]),
      markMissingSyncedPosition,
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
        strategyId: 'strategy-live-1',
        continuityState: 'CONFIRMED',
      })
    );
    expect(createSyncedPosition).not.toHaveBeenCalled();
    expect(markMissingSyncedPosition).toHaveBeenCalledWith(
      'pos-open-stale',
      expect.objectContaining({
        continuityState: 'RECOVERING',
        missingSyncCount: 1,
      })
    );
    expect(closeStaleSyncedPosition).not.toHaveBeenCalled();
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
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-2:ETHUSDT',
            {
              status: 'MANUAL_ONLY' as const,
              botId: null,
              walletId: null,
            },
          ],
        ])
      ),
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
      resolveCanonicalBotContinuityContext: vi.fn(async () => null),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      markMissingSyncedPosition: vi.fn(async () => undefined),
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

  it('hydrates imported lifecycle history after creating a new synced position', async () => {
    const createSyncedPosition = vi.fn(async () => undefined);
    const hydrateImportedPositionHistory = vi.fn(async () => ({
      hydrated: true,
      openedAt: new Date('2026-03-23T00:00:00.000Z'),
    }));
    const fetchTradeHistoryForApiKeySymbol = vi.fn(async () => [
      {
        exchangeTradeId: 'trade-1',
        exchangeOrderId: 'order-1',
        symbol: 'BTCUSDT',
        side: 'BUY',
        price: 50000,
        quantity: 0.01,
        notional: 500,
        feeCost: 0.5,
        feeCurrency: 'USDT',
        feeRate: 0.001,
        executedAt: '2026-03-23T00:00:00.000Z',
      },
    ]);
    const findOpenSyncedPositionByExternalId = vi
      .fn<({ externalId }: { userId: string; externalId: string }) => Promise<{
        id: string;
        botId: string;
        walletId: string;
        strategyId: string;
        openedAt: Date;
        managementMode: 'BOT_MANAGED';
        continuityState: 'CONFIRMED';
        missingSyncCount: number;
      } | null>>(async () => null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 'pos-created-1',
        botId: 'bot-live-1',
        walletId: 'wallet-live-1',
        strategyId: 'strategy-live-1',
        openedAt: new Date('2026-03-23T00:05:00.000Z'),
        managementMode: 'BOT_MANAGED' as const,
        continuityState: 'CONFIRMED' as const,
        missingSyncCount: 0,
      });

    await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [{ id: 'key-1', userId: 'user-1' }]),
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-1:BTCUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-live-1',
              walletId: 'wallet-live-1',
            },
          ],
        ])
      ),
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
            timestamp: '2026-03-23T00:05:00.000Z',
          },
        ],
      })),
      fetchTradeHistoryForApiKeySymbol,
      findOpenSyncedPositionByExternalId,
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-live-1',
        walletId: 'wallet-live-1',
        strategyId: 'strategy-live-1',
      })),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      markMissingSyncedPosition: vi.fn(async () => undefined),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      hydrateImportedPositionHistory,
      now: () => new Date('2026-03-23T00:05:00.000Z'),
    });

    expect(createSyncedPosition).toHaveBeenCalledOnce();
    expect(fetchTradeHistoryForApiKeySymbol).toHaveBeenCalledWith({
      apiKey: { id: 'key-1', userId: 'user-1' },
      symbol: 'BTCUSDT',
      since: new Date('2026-02-21T00:05:00.000Z'),
      limit: 500,
    });
    expect(hydrateImportedPositionHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        positionId: 'pos-created-1',
        symbol: 'BTCUSDT',
        positionSide: 'LONG',
        positionQuantity: 0.01,
      })
    );
  });

  it('requires repeated missing confirmations before classifying external close', async () => {
    const markMissingSyncedPosition = vi.fn(async () => undefined);
    const closeStaleSyncedPosition = vi.fn(async () => undefined);

    await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-confirm-1',
          userId: 'user-confirm-1',
        },
      ]),
      resolveOwnershipIndexForUser: vi.fn(async () => new Map()),
      fetchPositionsForApiKey: vi.fn(async () => ({ positions: [] })),
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition: vi.fn(async () => undefined),
      listOpenSyncedPositionsForApiKey: vi.fn(async () => [
        { id: 'pos-confirm-1', externalId: 'key-confirm-1:DOGEUSDT:LONG', missingSyncCount: 1 },
      ]),
      markMissingSyncedPosition,
      closeStaleSyncedPosition,
      now: () => new Date('2026-03-23T00:11:00.000Z'),
    });

    expect(markMissingSyncedPosition).not.toHaveBeenCalled();
    expect(closeStaleSyncedPosition).toHaveBeenCalledWith(
      'pos-confirm-1',
      new Date('2026-03-23T00:11:00.000Z')
    );
  });

  it('backfills canonical external close history before closing imported synced positions', async () => {
    const closeStaleSyncedPosition = vi.fn(async () => undefined);
    const fetchTradeHistoryForApiKeySymbol = vi.fn(async () => [
      {
        exchangeTradeId: 'trade-close-1',
        exchangeOrderId: 'order-close-1',
        symbol: 'DOGEUSDT',
        side: 'SELL',
        price: 0.12,
        quantity: 1000,
        notional: 120,
        feeCost: 0.12,
        feeCurrency: 'USDT',
        feeRate: 0.001,
        executedAt: '2026-03-23T00:12:00.000Z',
      },
    ]);
    const hydrateClosedImportedPositionHistory = vi.fn(async () => ({
      hydrated: true,
      openedAt: new Date('2026-03-23T00:00:00.000Z'),
      closedAt: new Date('2026-03-23T00:12:00.000Z'),
    }));

    await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-confirm-2',
          userId: 'user-confirm-2',
        },
      ]),
      resolveOwnershipIndexForUser: vi.fn(async () => new Map()),
      fetchPositionsForApiKey: vi.fn(async () => ({ positions: [] })),
      fetchTradeHistoryForApiKeySymbol,
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition: vi.fn(async () => undefined),
      listOpenSyncedPositionsForApiKey: vi.fn(async () => [
        {
          id: 'pos-confirm-2',
          externalId: 'key-confirm-2:DOGEUSDT:LONG',
          missingSyncCount: 1,
          symbol: 'DOGEUSDT',
          side: 'LONG' as const,
          openedAt: new Date('2026-03-23T00:05:00.000Z'),
          managementMode: 'BOT_MANAGED' as const,
        },
      ]),
      markMissingSyncedPosition: vi.fn(async () => undefined),
      closeStaleSyncedPosition,
      hydrateClosedImportedPositionHistory,
      now: () => new Date('2026-03-23T00:11:00.000Z'),
    });

    expect(fetchTradeHistoryForApiKeySymbol).toHaveBeenCalledWith({
      apiKey: { id: 'key-confirm-2', userId: 'user-confirm-2' },
      symbol: 'DOGEUSDT',
      since: new Date('2026-02-21T00:05:00.000Z'),
      limit: 500,
    });
    expect(hydrateClosedImportedPositionHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-confirm-2',
        positionId: 'pos-confirm-2',
        symbol: 'DOGEUSDT',
        positionSide: 'LONG',
      })
    );
    expect(closeStaleSyncedPosition).toHaveBeenCalledWith(
      'pos-confirm-2',
      new Date('2026-03-23T00:12:00.000Z')
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
      resolveOwnershipIndexForUser: vi.fn(async ({ userId }: { userId: string }) => {
        if (userId === 'user-1') {
          return new Map();
        }
        return new Map([
          [
            'key-healthy:BTCUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-live-2',
              walletId: 'wallet-live-2',
            },
          ],
        ]);
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
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-live-2',
        walletId: 'wallet-live-2',
        strategyId: 'strategy-live-2',
      })),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey,
      markMissingSyncedPosition: vi.fn(async () => undefined),
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
        strategyId: 'strategy-live-2',
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

  it('reuses existing local BOT-managed LIVE position instead of creating duplicate synced row for the same owner and identity', async () => {
    const createSyncedPosition = vi.fn(async () => undefined);
    const updateSyncedPosition = vi.fn(async () => undefined);
    const listOpenLocalManagedPositionsForOwner = vi.fn(async () => [
      {
        id: 'local-bot-pos-1',
        symbol: 'BTCUSDT',
        side: 'LONG' as const,
        openedAt: new Date('2026-03-23T00:09:30.000Z'),
      },
    ]);

    const result = await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-live-dup-1',
          userId: 'user-live-dup-1',
        },
      ]),
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-live-dup-1:BTCUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-live-dup-1',
              walletId: 'wallet-live-dup-1',
            },
          ],
        ])
      ),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'BTC/USDT:USDT',
            side: 'long',
            contracts: 0.05,
            entryPrice: 64000,
            markPrice: 64100,
            unrealizedPnl: 5,
            leverage: 4,
            timestamp: '2026-03-23T00:10:00.000Z',
          },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-live-dup-1',
        walletId: 'wallet-live-dup-1',
        strategyId: 'strategy-live-dup-1',
      })),
      updateSyncedPosition,
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      listOpenLocalManagedPositionsForOwner,
      closeStaleLocalManagedPosition: vi.fn(async () => undefined),
      markMissingSyncedPosition: vi.fn(async () => undefined),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      now: () => new Date('2026-03-23T00:10:01.000Z'),
    });

    expect(result.openPositionsSeen).toBe(1);
    expect(listOpenLocalManagedPositionsForOwner).toHaveBeenCalledWith({
      userId: 'user-live-dup-1',
      botId: 'bot-live-dup-1',
      walletId: 'wallet-live-dup-1',
    });
    expect(updateSyncedPosition).toHaveBeenCalledWith(
      'local-bot-pos-1',
      expect.objectContaining({
        symbol: 'BTCUSDT',
        side: 'LONG',
        quantity: 0.05,
        entryPrice: 64000,
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        botId: 'bot-live-dup-1',
        walletId: 'wallet-live-dup-1',
        strategyId: 'strategy-live-dup-1',
        continuityState: 'CONFIRMED',
      })
    );
    expect(createSyncedPosition).not.toHaveBeenCalled();
  });

  it('closes stale opposite-side synced lifecycle immediately when same symbol reopens on the other side', async () => {
    const closeStaleSyncedPosition = vi.fn(async () => undefined);
    const deleteRuntimePositionState = vi.fn(async () => undefined);
    const createSyncedPosition = vi.fn(async () => undefined);

    const result = await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-reopen-opposite-1',
          userId: 'user-reopen-opposite-1',
        },
      ]),
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-reopen-opposite-1:DOGEUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-reopen-opposite-1',
              walletId: 'wallet-reopen-opposite-1',
            },
          ],
        ])
      ),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'DOGE/USDT:USDT',
            side: 'long',
            contracts: 1500,
            entryPrice: 0.11,
            markPrice: 0.1125,
            unrealizedPnl: 3,
            leverage: 15,
            timestamp: '2026-03-23T00:10:00.000Z',
          },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-reopen-opposite-1',
        walletId: 'wallet-reopen-opposite-1',
        strategyId: 'strategy-reopen-opposite-1',
      })),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => [
        {
          id: 'pos-stale-doge-short',
          externalId: 'key-reopen-opposite-1:DOGEUSDT:SHORT',
          missingSyncCount: 0,
        },
      ]),
      markMissingSyncedPosition: vi.fn(async () => undefined),
      closeStaleSyncedPosition,
      deleteRuntimePositionState,
      now: () => new Date('2026-03-23T00:10:01.000Z'),
    });

    expect(result.openPositionsSeen).toBe(1);
    expect(createSyncedPosition).toHaveBeenCalledWith(
      expect.objectContaining({
        externalId: 'key-reopen-opposite-1:DOGEUSDT:LONG',
        side: 'LONG',
      })
    );
    expect(closeStaleSyncedPosition).toHaveBeenCalledWith(
      'pos-stale-doge-short',
      new Date('2026-03-23T00:10:01.000Z')
    );
    expect(deleteRuntimePositionState).toHaveBeenCalledWith('pos-stale-doge-short');
  });

  it('treats same-side reopen with a newer exchange timestamp as a new lifecycle and clears stale runtime state', async () => {
    const updateSyncedPosition = vi.fn(async () => undefined);
    const createSyncedPosition = vi.fn(async () => undefined);
    const closeStaleSyncedPosition = vi.fn(async () => undefined);
    const deleteRuntimePositionState = vi.fn(async () => undefined);

    await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-reopen-same-side-1',
          userId: 'user-reopen-same-side-1',
        },
      ]),
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-reopen-same-side-1:DOGEUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-reopen-same-side-1',
              walletId: 'wallet-reopen-same-side-1',
            },
          ],
        ])
      ),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'DOGE/USDT:USDT',
            side: 'long',
            contracts: 2000,
            entryPrice: 0.12,
            markPrice: 0.123,
            unrealizedPnl: 4,
            leverage: 15,
            timestamp: '2026-03-23T00:15:00.000Z',
          },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async () => ({
        id: 'pos-old-doge-long',
        botId: 'bot-reopen-same-side-1',
        walletId: 'wallet-reopen-same-side-1',
        strategyId: 'strategy-reopen-same-side-1',
        openedAt: new Date('2026-03-23T00:00:00.000Z'),
        managementMode: 'BOT_MANAGED' as const,
        continuityState: 'CONFIRMED' as const,
        missingSyncCount: 0,
      })),
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-reopen-same-side-1',
        walletId: 'wallet-reopen-same-side-1',
        strategyId: 'strategy-reopen-same-side-1',
      })),
      updateSyncedPosition,
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      markMissingSyncedPosition: vi.fn(async () => undefined),
      closeStaleSyncedPosition,
      deleteRuntimePositionState,
      now: () => new Date('2026-03-23T00:15:01.000Z'),
    });

    expect(closeStaleSyncedPosition).toHaveBeenCalledWith(
      'pos-old-doge-long',
      new Date('2026-03-23T00:15:01.000Z')
    );
    expect(deleteRuntimePositionState).toHaveBeenCalledWith('pos-old-doge-long');
    expect(updateSyncedPosition).not.toHaveBeenCalled();
    expect(createSyncedPosition).toHaveBeenCalledWith(
      expect.objectContaining({
        externalId: 'key-reopen-same-side-1:DOGEUSDT:LONG',
        entryPrice: 0.12,
        quantity: 2000,
        openedAt: new Date('2026-03-23T00:15:00.000Z'),
      })
    );
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
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-ambiguous:BNBUSDT',
            {
              status: 'AMBIGUOUS' as const,
              botId: null,
              walletId: null,
            },
          ],
        ])
      ),
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
      resolveCanonicalBotContinuityContext: vi.fn(async () => null),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      markMissingSyncedPosition: vi.fn(async () => undefined),
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
      '[LivePositionReconciliation] apiKey=key-ambiguous user=user-ambiguous symbol=BNBUSDT unresolved_takeover_owner=AMBIGUOUS'
    );

    consoleWarnSpy.mockRestore();
  });

  it('preserves canonical continuity as recovered but non-actionable when ownership is temporarily unresolved', async () => {
    const updateSyncedPosition = vi.fn(async () => undefined);

    await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-preserve-1',
          userId: 'user-preserve-1',
        },
      ]),
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-preserve-1:DOGEUSDT',
            {
              status: 'AMBIGUOUS' as const,
              botId: null,
              walletId: null,
            },
          ],
        ])
      ),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'DOGE/USDT:USDT',
            side: 'long',
            contracts: 2400,
            entryPrice: 0.11,
            markPrice: 0.109,
            unrealizedPnl: -3,
            leverage: 10,
            timestamp: null,
          },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async () => ({
        id: 'pos-preserve-1',
        botId: 'bot-preserve-1',
        walletId: 'wallet-preserve-1',
        strategyId: 'strategy-preserve-1',
        openedAt: new Date('2026-03-23T00:20:00.000Z'),
        managementMode: 'BOT_MANAGED' as const,
        continuityState: 'CONFIRMED' as const,
        missingSyncCount: 0,
      })),
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-preserve-1',
        walletId: 'wallet-preserve-1',
        strategyId: 'strategy-preserve-1',
      })),
      updateSyncedPosition,
      createSyncedPosition: vi.fn(async () => undefined),
      listOpenSyncedPositionsForApiKey: vi.fn(async () => [
        { id: 'pos-preserve-1', externalId: 'key-preserve-1:DOGEUSDT:LONG', missingSyncCount: 0 },
      ]),
      markMissingSyncedPosition: vi.fn(async () => undefined),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      now: () => new Date('2026-03-23T00:25:00.000Z'),
    });

    expect(updateSyncedPosition).toHaveBeenCalledWith(
      'pos-preserve-1',
      expect.objectContaining({
        managementMode: 'BOT_MANAGED',
        syncState: 'DRIFT',
        continuityState: 'RECOVERED_UNACTIONABLE',
        botId: 'bot-preserve-1',
        walletId: 'wallet-preserve-1',
        strategyId: 'strategy-preserve-1',
      })
    );
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
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-missing-entry:SOLUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-live-safe',
              walletId: 'wallet-live-safe',
            },
          ],
        ])
      ),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'SOL/USDT:USDT',
            side: 'long',
            contracts: 2,
            entryPrice: null,
            markPrice: 155.25,
            unrealizedPnl: null,
            leverage: 4,
            timestamp: null,
          },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async () => ({
        id: 'pos-existing-safe',
        botId: 'bot-live-safe',
        walletId: 'wallet-live-safe',
        strategyId: 'strategy-live-safe',
        openedAt: new Date('2026-03-23T01:00:00.000Z'),
        managementMode: 'BOT_MANAGED' as const,
        continuityState: 'CONFIRMED' as const,
        missingSyncCount: 0,
      })),
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-live-safe',
        walletId: 'wallet-live-safe',
        strategyId: 'strategy-live-safe',
      })),
      updateSyncedPosition,
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => [
        {
          id: 'pos-existing-safe',
          externalId: 'key-missing-entry:SOLUSDT:LONG',
          missingSyncCount: 0,
        },
      ]),
      markMissingSyncedPosition: vi.fn(async () => undefined),
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
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-orders-1:BTCUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-owned-1',
              walletId: 'wallet-owned-1',
            },
          ],
        ])
      ),
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
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-owned-1',
        walletId: 'wallet-owned-1',
        strategyId: 'strategy-owned-1',
      })),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition: vi.fn(async () => undefined),
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      markMissingSyncedPosition: vi.fn(async () => undefined),
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
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-stale-local-1:DOGEUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-stale-local-1',
              walletId: 'wallet-stale-local-1',
            },
          ],
          [
            'key-stale-local-1:BNBUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-stale-local-1',
              walletId: 'wallet-stale-local-1',
            },
          ],
          [
            'key-stale-local-1:SOLUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-stale-local-1',
              walletId: 'wallet-stale-local-1',
            },
          ],
        ])
      ),
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
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-stale-local-1',
        walletId: 'wallet-stale-local-1',
        strategyId: 'strategy-stale-local-1',
      })),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition: vi.fn(async () => undefined),
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      markMissingSyncedPosition: vi.fn(async () => undefined),
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
    expect(closeStaleLocalManagedPosition).toHaveBeenCalledTimes(2);
    expect(closeStaleLocalManagedPosition).toHaveBeenCalledWith(
      'pos-live-stale-bnb',
      new Date('2026-03-23T01:10:00.000Z')
    );
    expect(closeStaleLocalManagedPosition).toHaveBeenCalledWith(
      'pos-live-current-doge',
      new Date('2026-03-23T01:10:00.000Z')
    );
  });

  it('closes stale opposite-side local managed lifecycle immediately when the same symbol reopens on the other side', async () => {
    const closeStaleLocalManagedPosition = vi.fn(async () => undefined);
    const deleteRuntimePositionState = vi.fn(async () => undefined);

    await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-local-reopen-opposite-1',
          userId: 'user-local-reopen-opposite-1',
        },
      ]),
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-local-reopen-opposite-1:DOGEUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-local-reopen-opposite-1',
              walletId: 'wallet-local-reopen-opposite-1',
            },
          ],
        ])
      ),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'DOGE/USDT:USDT',
            side: 'long',
            contracts: 1800,
            entryPrice: 0.115,
            markPrice: 0.1175,
            unrealizedPnl: 2.5,
            leverage: 15,
            timestamp: '2026-03-23T00:40:00.000Z',
          },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-local-reopen-opposite-1',
        walletId: 'wallet-local-reopen-opposite-1',
        strategyId: 'strategy-local-reopen-opposite-1',
      })),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition: vi.fn(async () => undefined),
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      listOpenLocalManagedPositionsForOwner: vi.fn(async () => [
        {
          id: 'pos-local-doge-short',
          symbol: 'DOGEUSDT',
          side: 'SHORT' as const,
          openedAt: new Date('2026-03-23T00:39:50.000Z'),
        },
      ]),
      closeStaleLocalManagedPosition,
      markMissingSyncedPosition: vi.fn(async () => undefined),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      deleteRuntimePositionState,
      now: () => new Date('2026-03-23T00:40:01.000Z'),
    });

    expect(closeStaleLocalManagedPosition).toHaveBeenCalledWith(
      'pos-local-doge-short',
      new Date('2026-03-23T00:40:01.000Z')
    );
    expect(deleteRuntimePositionState).toHaveBeenCalledWith('pos-local-doge-short');
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
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-stale-local-fallback-1:DOGEUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-stale-local-fallback-1',
              walletId: 'wallet-stale-local-fallback-1',
            },
          ],
          [
            'key-stale-local-fallback-1:BNBUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-stale-local-fallback-1',
              walletId: 'wallet-stale-local-fallback-1',
            },
          ],
          [
            'key-stale-local-fallback-1:SOLUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-stale-local-fallback-1',
              walletId: 'wallet-stale-local-fallback-1',
            },
          ],
        ])
      ),
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
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-stale-local-fallback-1',
        walletId: 'wallet-stale-local-fallback-1',
        strategyId: 'strategy-stale-local-fallback-1',
      })),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition: vi.fn(async () => undefined),
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      markMissingSyncedPosition: vi.fn(async () => undefined),
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

  it('assigns different exact owners for different symbols under the same api key', async () => {
    const createSyncedPosition = vi.fn(async () => undefined);

    const result = await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-shared-1',
          userId: 'user-shared-1',
        },
      ]),
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-shared-1:BTCUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-btc',
              walletId: 'wallet-btc',
            },
          ],
          [
            'key-shared-1:ETHUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-eth',
              walletId: 'wallet-eth',
            },
          ],
        ])
      ),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'BTC/USDT:USDT',
            side: 'long',
            contracts: 0.01,
            entryPrice: 68000,
            markPrice: 68010,
            unrealizedPnl: 1,
            leverage: 3,
            timestamp: null,
          },
          {
            symbol: 'ETH/USDT:USDT',
            side: 'short',
            contracts: 0.2,
            entryPrice: 3200,
            markPrice: 3190,
            unrealizedPnl: 2,
            leverage: 4,
            timestamp: null,
          },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      resolveCanonicalBotContinuityContext: vi.fn(async (botId: string) => ({
        botId,
        walletId: botId === 'bot-btc' ? 'wallet-btc' : 'wallet-eth',
        strategyId: botId === 'bot-btc' ? 'strategy-btc' : 'strategy-eth',
      })),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      markMissingSyncedPosition: vi.fn(async () => undefined),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      now: () => new Date('2026-03-23T03:00:00.000Z'),
    });

    expect(result.openPositionsSeen).toBe(2);
    expect(createSyncedPosition).toHaveBeenCalledTimes(2);
    expect(createSyncedPosition).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        externalId: 'key-shared-1:BTCUSDT:LONG',
        botId: 'bot-btc',
        walletId: 'wallet-btc',
        strategyId: 'strategy-btc',
        managementMode: 'BOT_MANAGED',
      })
    );
    expect(createSyncedPosition).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        externalId: 'key-shared-1:ETHUSDT:SHORT',
        botId: 'bot-eth',
        walletId: 'wallet-eth',
        strategyId: 'strategy-eth',
        managementMode: 'BOT_MANAGED',
      })
    );
  });
});
