import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  LivePositionReconciliationLoop,
  livePositionReconciliationDefaultDeps,
  reconcileExternalPositionsFromExchange,
  resolveCanonicalBotContinuityContext,
} from './livePositionReconciliation.service';
import {
  buildImportedExternalPositionId,
  extractSymbolFromExternalId,
  parseImportedExternalPositionId,
} from './livePositionReconciliation.helpers';
import { prisma } from '../../prisma/client';

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

describe('imported external position id helpers', () => {
  it('builds market-scoped external ids and still parses legacy ids', () => {
    expect(
      buildImportedExternalPositionId({
        apiKeyId: 'key-1',
        marketType: 'SPOT',
        symbol: 'ETH/USDT',
        side: 'LONG',
      })
    ).toBe('key-1:SPOT:ETHUSDT:LONG');

    expect(parseImportedExternalPositionId('key-1:SPOT:ETHUSDT:LONG')).toEqual({
      apiKeyId: 'key-1',
      marketType: 'SPOT',
      symbol: 'ETHUSDT',
      side: 'LONG',
    });
    expect(parseImportedExternalPositionId('key-1:ETHUSDT:LONG')).toEqual({
      apiKeyId: 'key-1',
      marketType: null,
      symbol: 'ETHUSDT',
      side: 'LONG',
    });
    expect(extractSymbolFromExternalId('key-1:FUTURES:DOGEUSDT:SHORT')).toBe('DOGEUSDT');
    expect(extractSymbolFromExternalId('key-1:DOGEUSDT:SHORT')).toBe('DOGEUSDT');
  });
});

describe('reconcileExternalPositionsFromExchange', () => {
  it('propagates synced api-key market type through LIVE reconciliation snapshots', async () => {
    let created = false;
    const createSyncedPosition = vi.fn(async () => {
      created = true;
    });
    const fetchPositionsForApiKey = vi.fn(async (apiKey) => {
      expect(apiKey.marketType).toBe('SPOT');
      return {
        positions: [
          {
            symbol: 'ETH/USDT',
            side: 'long',
            contracts: 0.25,
            entryPrice: 3200,
            markPrice: 3210,
            unrealizedPnl: 2.5,
            leverage: 1,
            timestamp: '2026-05-03T10:00:00.000Z',
          },
        ],
      };
    });
    const fetchOpenOrdersForApiKey = vi.fn(async (apiKey) => {
      expect(apiKey.marketType).toBe('SPOT');
      return [];
    });
    const fetchTradeHistoryForApiKeySymbol = vi.fn(async ({ apiKey }) => {
      expect(apiKey.marketType).toBe('SPOT');
      return [];
    });
    const processOwnedSyncedPositionAutomation = vi.fn(async () => undefined);

    const findOpenSyncedPositionByExternalId = vi.fn(async ({ externalId }) =>
      created && externalId === 'key-spot-1:SPOT:ETHUSDT:LONG'
        ? {
            id: 'spot-position-created',
            botId: 'bot-spot-1',
            walletId: 'wallet-spot-1',
            strategyId: 'strategy-spot-1',
            openedAt: new Date('2026-05-03T10:00:00.000Z'),
            managementMode: 'BOT_MANAGED' as const,
            continuityState: 'CONFIRMED' as const,
            missingSyncCount: 0,
          }
        : null
    );

    await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-spot-1',
          userId: 'user-spot-1',
          exchange: 'BINANCE' as const,
          marketType: 'SPOT' as const,
        },
      ]),
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-spot-1:ETHUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-spot-1',
              walletId: 'wallet-spot-1',
            },
          ],
        ])
      ),
      fetchPositionsForApiKey,
      fetchOpenOrdersForApiKey,
      fetchTradeHistoryForApiKeySymbol,
      findOpenSyncedPositionByExternalId,
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-spot-1',
        walletId: 'wallet-spot-1',
        strategyId: 'strategy-spot-1',
      })),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      markMissingSyncedPosition: vi.fn(async () => undefined),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      hydrateImportedPositionHistory: vi.fn(async () => ({
        hydrated: true,
        openedAt: new Date('2026-05-03T10:00:00.000Z'),
      })),
      upsertSyncedOpenOrder: vi.fn(async () => undefined),
      listOpenSyncedOrdersForOwner: vi.fn(async () => []),
      markStaleSyncedOrderUnresolved: vi.fn(async () => undefined),
      processOwnedSyncedPositionAutomation,
      now: () => new Date('2026-05-03T10:00:01.000Z'),
    });

    expect(fetchPositionsForApiKey).toHaveBeenCalledOnce();
    expect(fetchOpenOrdersForApiKey).toHaveBeenCalledOnce();
    expect(fetchTradeHistoryForApiKeySymbol).toHaveBeenCalledOnce();
    expect(createSyncedPosition).toHaveBeenCalledWith(
      expect.objectContaining({
        externalId: 'key-spot-1:SPOT:ETHUSDT:LONG',
      })
    );
    expect(findOpenSyncedPositionByExternalId).toHaveBeenCalledWith({
      userId: 'user-spot-1',
      externalId: 'key-spot-1:SPOT:ETHUSDT:LONG',
    });
    expect(findOpenSyncedPositionByExternalId).toHaveBeenCalledWith({
      userId: 'user-spot-1',
      externalId: 'key-spot-1:ETHUSDT:LONG',
    });
    expect(processOwnedSyncedPositionAutomation).toHaveBeenCalledWith(
      expect.objectContaining({
        marketType: 'SPOT',
        symbol: 'ETHUSDT',
      })
    );
  });

  it('creates/updates synced positions and marks first stale miss as recovering instead of closing', async () => {
    const createSyncedPosition = vi.fn(async () => undefined);
    const updateSyncedPosition = vi.fn(async () => undefined);
    const fetchTradeHistoryForApiKeySymbol = vi.fn(async () => [
      {
        exchangeTradeId: 'trade-update-1',
        exchangeOrderId: 'order-update-1',
        symbol: 'BTCUSDT',
        side: 'BUY',
        price: 50000,
        quantity: 0.01,
        notional: 500,
        feeCost: 0,
        feeCurrency: 'USDT',
        feeRate: null,
        executedAt: '2026-03-23T00:00:00.000Z',
      },
    ]);
    const hydrateImportedPositionHistory = vi.fn(async () => ({
      hydrated: false,
      openedAt: null as Date | null,
    }));
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
      fetchTradeHistoryForApiKeySymbol,
      updateSyncedPosition,
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => [
        { id: 'pos-open-1', externalId: 'key-1:BTCUSDT:LONG', missingSyncCount: 0 },
        { id: 'pos-open-stale', externalId: 'key-1:ADAUSDT:LONG', missingSyncCount: 0 },
      ]),
      markMissingSyncedPosition,
      closeStaleSyncedPosition,
      hydrateImportedPositionHistory,
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
    expect(fetchTradeHistoryForApiKeySymbol).toHaveBeenCalledWith({
      apiKey: { id: 'key-1', userId: 'user-1' },
      symbol: 'BTCUSDT',
      since: new Date('2026-02-21T00:00:00.000Z'),
      limit: 500,
    });
    expect(hydrateImportedPositionHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        positionId: 'pos-open-1',
        symbol: 'BTCUSDT',
        positionSide: 'LONG',
        positionQuantity: 0.01,
      })
    );
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

  it('hydrates owned LIVE automation from fresh exchange-sync truth after creating a managed imported position', async () => {
    const processOwnedSyncedPositionAutomation = vi.fn(async () => undefined);

    await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-live-automation-create-1',
          userId: 'user-live-automation-create-1',
          exchange: 'BINANCE' as const,
          marketType: 'FUTURES' as const,
        },
      ]),
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-live-automation-create-1:DOGEUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-live-automation-create-1',
              walletId: 'wallet-live-automation-create-1',
            },
          ],
        ])
      ),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'DOGE/USDT:USDT',
            side: 'short',
            contracts: 108,
            entryPrice: 0.1044,
            markPrice: 0.1069,
            unrealizedPnl: -0.26,
            leverage: 15,
            timestamp: '2026-03-23T00:05:00.000Z',
          },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-live-automation-create-1',
        walletId: 'wallet-live-automation-create-1',
        strategyId: 'strategy-live-automation-create-1',
      })),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition: vi.fn(async () => undefined),
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      markMissingSyncedPosition: vi.fn(async () => undefined),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      processOwnedSyncedPositionAutomation,
      now: () => new Date('2026-03-23T00:05:01.000Z'),
    });

    expect(processOwnedSyncedPositionAutomation).toHaveBeenCalledWith({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'DOGEUSDT',
      markPrice: 0.1069,
      eventTime: new Date('2026-03-23T00:05:01.000Z'),
    });
  });

  it('hydrates owned LIVE automation from fresh exchange-sync truth after updating an existing managed imported position', async () => {
    const processOwnedSyncedPositionAutomation = vi.fn(async () => undefined);

    await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-live-automation-update-1',
          userId: 'user-live-automation-update-1',
          exchange: 'BINANCE' as const,
          marketType: 'FUTURES' as const,
        },
      ]),
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-live-automation-update-1:DOGEUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-live-automation-update-1',
              walletId: 'wallet-live-automation-update-1',
            },
          ],
        ])
      ),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'DOGE/USDT:USDT',
            side: 'short',
            contracts: 108,
            entryPrice: 0.1044,
            markPrice: 0.1069,
            unrealizedPnl: -0.26,
            leverage: 15,
            timestamp: '2026-03-23T00:06:00.000Z',
          },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async () => ({
        id: 'pos-live-automation-update-1',
        botId: 'bot-live-automation-update-1',
        walletId: 'wallet-live-automation-update-1',
        strategyId: 'strategy-live-automation-update-1',
        openedAt: new Date('2026-03-23T00:05:00.000Z'),
        managementMode: 'BOT_MANAGED' as const,
        continuityState: 'CONFIRMED' as const,
        missingSyncCount: 0,
      })),
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-live-automation-update-1',
        walletId: 'wallet-live-automation-update-1',
        strategyId: 'strategy-live-automation-update-1',
      })),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition: vi.fn(async () => undefined),
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      markMissingSyncedPosition: vi.fn(async () => undefined),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      processOwnedSyncedPositionAutomation,
      now: () => new Date('2026-03-23T00:06:01.000Z'),
    });

    expect(processOwnedSyncedPositionAutomation).toHaveBeenCalledWith({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'DOGEUSDT',
      markPrice: 0.1069,
      eventTime: new Date('2026-03-23T00:06:01.000Z'),
    });
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
      marketType: undefined,
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
        botId: null,
        walletId: 'wallet-live-dup-1',
        strategyId: 'strategy-live-dup-1',
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
        externalId: 'key-live-dup-1:BTCUSDT:LONG',
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

  it('closes stale botless wallet-owned blockers and imports fresh exchange truth for another symbol under the same owner', async () => {
    const updateSyncedPosition = vi.fn(async () => undefined);
    const createSyncedPosition = vi.fn(async () => undefined);
    const closeStaleLocalManagedPosition = vi.fn(async () => undefined);
    const deleteRuntimePositionState = vi.fn(async () => undefined);
    const listOpenLocalManagedPositionsForOwner = vi.fn(async () => [
      {
        id: 'pos-stale-bnb-botless',
        botId: null,
        walletId: 'wallet-live-bnb-gap-1',
        strategyId: 'strategy-live-bnb-gap-1',
        symbol: 'BNBUSDT',
        side: 'SHORT' as const,
        openedAt: new Date('2026-04-26T19:25:03.592Z'),
      },
    ]);

    const result = await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-live-bnb-gap-1',
          userId: 'user-live-bnb-gap-1',
        },
      ]),
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-live-bnb-gap-1:DOGEUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-live-bnb-gap-1',
              walletId: 'wallet-live-bnb-gap-1',
            },
          ],
          [
            'key-live-bnb-gap-1:BNBUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-live-bnb-gap-1',
              walletId: 'wallet-live-bnb-gap-1',
            },
          ],
        ])
      ),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          {
            symbol: 'DOGE/USDT:USDT',
            side: 'short',
            contracts: 216,
            entryPrice: 0.1056787962963,
            markPrice: 0.1058900062963,
            unrealizedPnl: -0.04562136,
            leverage: 15,
            timestamp: '2026-04-30T02:24:51.241Z',
          },
          {
            symbol: 'BNB/USDT:USDT',
            side: 'short',
            contracts: 0.01,
            entryPrice: 618.46,
            markPrice: 616.86218437,
            unrealizedPnl: 0.01597815,
            leverage: 15,
            timestamp: '2026-04-30T02:33:17.223Z',
          },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async ({ externalId }) =>
        externalId === 'key-live-bnb-gap-1:DOGEUSDT:SHORT'
          ? {
              id: 'pos-doge-current',
              botId: 'bot-live-bnb-gap-1',
              walletId: 'wallet-live-bnb-gap-1',
              strategyId: 'strategy-live-bnb-gap-1',
              openedAt: new Date('2026-04-30T02:24:51.241Z'),
              managementMode: 'BOT_MANAGED' as const,
              continuityState: 'CONFIRMED' as const,
              missingSyncCount: 0,
            }
          : null
      ),
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-live-bnb-gap-1',
        walletId: 'wallet-live-bnb-gap-1',
        strategyId: 'strategy-live-bnb-gap-1',
      })),
      updateSyncedPosition,
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => [
        {
          id: 'pos-doge-current',
          externalId: 'key-live-bnb-gap-1:DOGEUSDT:SHORT',
          missingSyncCount: 0,
        },
      ]),
      listOpenLocalManagedPositionsForOwner,
      closeStaleLocalManagedPosition,
      markMissingSyncedPosition: vi.fn(async () => undefined),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      deleteRuntimePositionState,
      now: () => new Date('2026-04-30T02:33:18.000Z'),
    });

    expect(result.openPositionsSeen).toBe(2);
    expect(updateSyncedPosition).toHaveBeenCalledWith(
      'pos-doge-current',
      expect.objectContaining({
        externalId: 'key-live-bnb-gap-1:DOGEUSDT:SHORT',
        symbol: 'DOGEUSDT',
        side: 'SHORT',
      })
    );
    expect(closeStaleLocalManagedPosition).toHaveBeenCalledWith(
      'pos-stale-bnb-botless',
      new Date('2026-04-30T02:33:18.000Z')
    );
    expect(deleteRuntimePositionState).toHaveBeenCalledWith('pos-stale-bnb-botless');
    expect(createSyncedPosition).toHaveBeenCalledWith(
      expect.objectContaining({
        externalId: 'key-live-bnb-gap-1:BNBUSDT:SHORT',
        symbol: 'BNBUSDT',
        side: 'SHORT',
        botId: 'bot-live-bnb-gap-1',
        walletId: 'wallet-live-bnb-gap-1',
        strategyId: 'strategy-live-bnb-gap-1',
        managementMode: 'BOT_MANAGED',
      })
    );
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

  it('keeps stale-looking local managed live position open while same-symbol exchange order is open', async () => {
    const closeStaleLocalManagedPosition = vi.fn(async () => undefined);

    await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [
        {
          id: 'key-open-order-protect-1',
          userId: 'user-open-order-protect-1',
        },
      ]),
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          [
            'key-open-order-protect-1:BTCUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-open-order-protect-1',
              walletId: 'wallet-open-order-protect-1',
            },
          ],
          [
            'key-open-order-protect-1:ETHUSDT',
            {
              status: 'OWNED' as const,
              botId: 'bot-open-order-protect-1',
              walletId: 'wallet-open-order-protect-1',
            },
          ],
        ])
      ),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [],
      })),
      fetchOpenOrdersForApiKey: vi.fn(async () => [
        {
          exchangeOrderId: 'btc-pending-close',
          symbol: 'BTC/USDT:USDT',
          side: 'sell',
          type: 'market',
          status: 'open',
          amount: 0.01,
          filled: 0,
          remaining: 0.01,
          price: null,
          timestamp: '2026-03-23T01:00:00.000Z',
        },
      ]),
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      resolveCanonicalBotContinuityContext: vi.fn(async () => ({
        botId: 'bot-open-order-protect-1',
        walletId: 'wallet-open-order-protect-1',
        strategyId: 'strategy-open-order-protect-1',
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
          id: 'pos-live-btc-pending-close',
          symbol: 'BTCUSDT',
          side: 'LONG' as const,
          openedAt: new Date('2026-03-23T00:30:00.000Z'),
        },
        {
          id: 'pos-live-eth-stale',
          symbol: 'ETHUSDT',
          side: 'LONG' as const,
          openedAt: new Date('2026-03-23T00:30:00.000Z'),
        },
      ]),
      closeStaleLocalManagedPosition,
      now: () => new Date('2026-03-23T01:10:00.000Z'),
    });

    expect(closeStaleLocalManagedPosition).toHaveBeenCalledTimes(1);
    expect(closeStaleLocalManagedPosition).toHaveBeenCalledWith(
      'pos-live-eth-stale',
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

describe('livePositionReconciliationDefaultDeps', () => {
  it('lists stale synced positions only for the reconciled market type', async () => {
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.log.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { email: 'live-position-stale-market-scope@example.com', password: 'test-password' },
      select: { id: true },
    });

    await prisma.position.createMany({
      data: [
        {
          userId: user.id,
          externalId: 'key-market:FUTURES:BTCUSDT:LONG',
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
          continuityState: 'CONFIRMED',
          symbol: 'BTCUSDT',
          side: 'LONG',
          status: 'OPEN',
          entryPrice: 60_000,
          quantity: 0.01,
          leverage: 2,
        },
        {
          userId: user.id,
          externalId: 'key-market:SPOT:ETHUSDT:LONG',
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
          continuityState: 'CONFIRMED',
          symbol: 'ETHUSDT',
          side: 'LONG',
          status: 'OPEN',
          entryPrice: 3_000,
          quantity: 0.1,
          leverage: 1,
        },
        {
          userId: user.id,
          externalId: 'key-market:DOGEUSDT:LONG',
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
          continuityState: 'CONFIRMED',
          symbol: 'DOGEUSDT',
          side: 'LONG',
          status: 'OPEN',
          entryPrice: 0.1,
          quantity: 100,
          leverage: 1,
        },
      ],
    });

    const rows = await livePositionReconciliationDefaultDeps.listOpenSyncedPositionsForApiKey({
      userId: user.id,
      apiKeyId: 'key-market',
      marketType: 'FUTURES',
    });

    expect(rows.map((row) => row.externalId).sort()).toEqual([
      'key-market:DOGEUSDT:LONG',
      'key-market:FUTURES:BTCUSDT:LONG',
    ]);
  });

  it('does not update unrelated botless exchange-synced open orders when exchange ids collide', async () => {
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.log.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { email: 'live-order-upsert-owner-scope@example.com', password: 'test-password' },
      select: { id: true },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Order Scope Wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
      select: { id: true },
    });
    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Order Scope Universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
      select: { id: true },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: marketUniverse.id,
        name: 'Order Scope Group',
        symbols: ['BTCUSDT'],
      },
      select: { id: true },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Order Scope Strategy',
        interval: '5m',
        leverage: 2,
        walletRisk: 1,
        config: {},
      },
      select: { id: true },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Order Scope Bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: wallet.id,
        strategyId: strategy.id,
        symbolGroupId: symbolGroup.id,
      },
      select: { id: true },
    });

    const collidingOrder = await prisma.order.create({
      data: {
        userId: user.id,
        botId: null,
        walletId: null,
        strategyId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        exchangeOrderId: 'shared-exchange-order',
        symbol: 'ETHUSDT',
        side: 'SELL',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 0.2,
        price: 3100,
        submittedAt: new Date('2026-05-04T08:00:00.000Z'),
      },
    });

    await livePositionReconciliationDefaultDeps.upsertSyncedOpenOrder?.({
      userId: user.id,
      exchangeOrderId: 'shared-exchange-order',
      botId: bot.id,
      walletId: wallet.id,
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'LIMIT',
      status: 'OPEN',
      quantity: 0.01,
      filledQuantity: 0,
      price: 67000,
      submittedAt: new Date('2026-05-04T08:01:00.000Z'),
    });

    const orders = await prisma.order.findMany({
      where: { userId: user.id, exchangeOrderId: 'shared-exchange-order' },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: { id: true, botId: true, walletId: true, symbol: true, quantity: true },
    });
    expect(orders).toHaveLength(2);
    expect(orders.find((order) => order.id === collidingOrder.id)).toEqual({
      id: collidingOrder.id,
      botId: null,
      walletId: null,
      symbol: 'ETHUSDT',
      quantity: 0.2,
    });
    expect(orders.find((order) => order.id !== collidingOrder.id)).toEqual(
      expect.objectContaining({
        botId: bot.id,
        walletId: wallet.id,
        symbol: 'BTCUSDT',
        quantity: 0.01,
      })
    );
  });

  it('moves stale synced open orders out of active open status', async () => {
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.log.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { email: 'live-order-stale-status@example.com', password: 'test-password' },
      select: { id: true },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        botId: null,
        walletId: null,
        strategyId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        exchangeOrderId: 'stale-open-order',
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: 0.01,
        price: 67000,
        submittedAt: new Date('2026-05-04T09:30:00.000Z'),
      },
      select: { id: true },
    });

    await livePositionReconciliationDefaultDeps.markStaleSyncedOrderUnresolved?.(order.id);

    const updated = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
      select: { status: true, syncState: true },
    });
    expect(updated).toEqual({
      status: 'CANCELED',
      syncState: 'ORPHAN_LOCAL',
    });
  });
});

describe('resolveCanonicalBotContinuityContext', () => {
  it('resolves strategy from canonical bot market-group links before stale direct bot projection', async () => {
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.log.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        email: 'live-continuity-canonical-context@example.com',
        password: 'test-password',
      },
      select: { id: true },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Continuity Wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
      select: { id: true },
    });
    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Continuity Universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT', 'ETHUSDT'],
        blacklist: [],
      },
      select: { id: true },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: marketUniverse.id,
        name: 'Continuity Group',
        symbols: ['BTCUSDT'],
      },
      select: { id: true },
    });
    const [canonicalStrategy, staleDirectStrategy] = await Promise.all([
      prisma.strategy.create({
        data: {
          userId: user.id,
          name: 'Continuity Canonical Strategy',
          interval: '5m',
          leverage: 3,
          walletRisk: 1,
          config: {},
        },
        select: { id: true },
      }),
      prisma.strategy.create({
        data: {
          userId: user.id,
          name: 'Continuity Stale Direct Strategy',
          interval: '15m',
          leverage: 7,
          walletRisk: 1,
          config: {},
        },
        select: { id: true },
      }),
    ]);
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Continuity Bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: wallet.id,
        strategyId: staleDirectStrategy.id,
        symbolGroupId: symbolGroup.id,
      },
      select: { id: true },
    });
    const botMarketGroup = await prisma.botMarketGroup.create({
      data: {
        userId: user.id,
        botId: bot.id,
        symbolGroupId: symbolGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        isEnabled: true,
      },
      select: { id: true },
    });
    await prisma.marketGroupStrategyLink.create({
      data: {
        userId: user.id,
        botId: bot.id,
        botMarketGroupId: botMarketGroup.id,
        strategyId: canonicalStrategy.id,
        priority: 1,
        isEnabled: true,
      },
    });

    const context = await resolveCanonicalBotContinuityContext(bot.id);

    expect(context).toEqual({
      botId: bot.id,
      walletId: wallet.id,
      strategyId: canonicalStrategy.id,
    });
  });
});
