import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  positionFindMany: vi.fn(),
  botFindMany: vi.fn(),
  resolveExternalPositionOwnershipIndex: vi.fn(),
  getExternalPositionOwnership: vi.fn(),
  parseApiKeyIdFromExternalPositionId: vi.fn(),
}));

vi.mock('../../prisma/client', () => ({
  prisma: {
    position: {
      findMany: mocks.positionFindMany,
    },
    bot: {
      findMany: mocks.botFindMany,
    },
  },
}));

vi.mock('../bots/runtimeExternalPositionOwner.service', () => ({
  resolveExternalPositionOwnershipIndex: mocks.resolveExternalPositionOwnershipIndex,
  getExternalPositionOwnership: mocks.getExternalPositionOwnership,
  parseApiKeyIdFromExternalPositionId: mocks.parseApiKeyIdFromExternalPositionId,
}));

import { RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { runtimePositionStateStore } from './runtimePositionState.store';

describe('RuntimePositionAutomationService default ownership hydration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await runtimePositionStateStore.deletePositionRuntimeState('pos-import-owned');
  });

  it('hydrates imported owned EXCHANGE_SYNC positions into canonical runtime automation context', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';

    mocks.positionFindMany.mockResolvedValue([
      {
        id: 'pos-import-owned',
        userId: 'user-1',
        botId: null,
        walletId: null,
        strategyId: 'strat-1',
        externalId: 'key-1:DOGEUSDT:SHORT',
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        entryPrice: 1,
        quantity: 1000,
        leverage: 10,
        marginUsed: 100,
        stopLoss: null,
        takeProfit: null,
        managementMode: 'BOT_MANAGED',
        origin: 'EXCHANGE_SYNC',
        continuityState: 'CONFIRMED',
        bot: null,
      },
    ]);
    mocks.resolveExternalPositionOwnershipIndex.mockResolvedValue(new Map());
    mocks.parseApiKeyIdFromExternalPositionId.mockReturnValue('key-1');
    mocks.getExternalPositionOwnership.mockReturnValue({
      status: 'OWNED',
      botId: 'bot-1',
      walletId: 'wallet-1',
    });
    mocks.botFindMany.mockResolvedValue([
      {
        id: 'bot-1',
        walletId: 'wallet-1',
        liveOptIn: true,
        wallet: {
          mode: 'LIVE',
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          baseCurrency: 'USDT',
          paperInitialBalance: 1000,
        },
        symbolGroup: {
          marketUniverse: {
            exchange: 'BINANCE',
            marketType: 'FUTURES',
            baseCurrency: 'USDT',
          },
        },
      },
    ]);

    const executeDca = vi.fn(async () => ({
      feePaid: 0,
      executed: true,
      nextQuantity: 2000,
      nextEntryPrice: 0.85,
    }));
    const service = new RuntimePositionAutomationService({
      getStrategyConfigById: async () => ({
        close: {
          mode: 'advanced',
          tp: null,
          sl: null,
          ttp: [],
          tsl: [],
        },
        additional: {
          dcaEnabled: true,
          dcaMode: 'advanced',
          dcaTimes: 1,
          dcaLevels: [{ percent: -25, multiplier: 1 }],
        },
      }),
      getCanonicalPositionState: async () => ({
        quantity: 2000,
        averageEntryPrice: 0.85,
      }),
      executeDca,
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      resolveLifecyclePrice: async ({ fallbackPrice }) => fallbackPrice,
      recordRuntimeEvent: vi.fn(async () => undefined),
      upsertRuntimeSymbolStat: vi.fn(async () => undefined),
      nowMs: () => Date.now(),
    });

    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'DOGEUSDT',
      eventTime: 15_000,
      lastPrice: 1.03,
      priceChangePercent24h: 1,
    });

    expect(executeDca).toHaveBeenCalledWith(
      expect.objectContaining({
        botId: 'bot-1',
        walletId: 'wallet-1',
        strategyId: 'strat-1',
        positionId: 'pos-import-owned',
        symbol: 'DOGEUSDT',
      })
    );
    expect(service.getPositionStateSnapshot('pos-import-owned')).toEqual(
      expect.objectContaining({
        quantity: 2000,
        averageEntryPrice: 0.85,
        currentAdds: 1,
      })
    );
  });
});
