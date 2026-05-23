import { afterEach, describe, expect, it, vi } from 'vitest';
import { RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { runtimePositionStateStore } from './runtimePositionState.store';

afterEach(async () => {
  await runtimePositionStateStore.deletePositionRuntimeState('pos-sol-dca');
});

const liveBot = () => ({
  walletId: 'wallet-sol',
  liveOptIn: true,
  wallet: {
    mode: 'LIVE' as const,
    exchange: 'BINANCE' as const,
    marketType: 'FUTURES' as const,
    baseCurrency: 'USDT',
    paperInitialBalance: 10_000,
  },
  symbolGroup: {
    symbols: ['SOLUSDT'],
    marketUniverse: {
      exchange: 'BINANCE' as const,
      marketType: 'FUTURES' as const,
      baseCurrency: 'USDT',
    },
  },
  botMarketGroups: undefined,
});

describe('RuntimePositionAutomationService exchange PnL truth', () => {
  it('uses exchange PnL truth for imported LIVE DCA thresholds', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';

    await runtimePositionStateStore.setPositionRuntimeState('pos-sol-dca', {
      quantity: 2,
      averageEntryPrice: 100,
      currentAdds: 1,
      trailingAnchorPrice: 100,
      executedDcaLevelIndices: [0],
      lastDcaPrice: 100.25,
    });

    const executeDca = vi.fn(async () => ({
      feePaid: 0,
      executed: true,
      nextQuantity: 4,
      nextEntryPrice: 100.2,
    }));
    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-sol-dca',
          userId: 'user-sol',
          botId: 'bot-sol',
          walletId: 'wallet-sol',
          strategyId: 'strat-sol',
          symbol: 'SOLUSDT',
          side: 'SHORT' as const,
          status: 'OPEN' as const,
          entryPrice: 100,
          quantity: 2,
          leverage: 10,
          marginUsed: 2.08,
          unrealizedPnl: -1.3,
          lastExchangeSyncAt: new Date(20_000),
          stopLoss: null,
          takeProfit: null,
          managementMode: 'BOT_MANAGED' as const,
          origin: 'EXCHANGE_SYNC' as const,
          continuityState: 'CONFIRMED' as const,
          bot: liveBot(),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => ({
        close: { mode: 'advanced', tp: null, sl: null, ttp: [], tsl: [{ percent: -50, arm: 25 }] },
        additional: {
          dcaEnabled: true,
          dcaMode: 'advanced',
          dcaTimes: 2,
          dcaLevels: [
            { percent: -25, multiplier: 1 },
            { percent: -50, multiplier: 1 },
          ],
        },
      })),
      executeDca,
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      resolveLifecyclePrice: vi.fn(async () => 100.312),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'SOLUSDT',
      eventTime: 21_000,
      lastPrice: 100.312,
      priceChangePercent24h: 1.4,
    });

    expect(executeDca).toHaveBeenCalledWith(
      expect.objectContaining({
        positionId: 'pos-sol-dca',
        symbol: 'SOLUSDT',
        positionSide: 'SHORT',
        dcaLevelIndex: 1,
        mode: 'LIVE',
        markPrice: 100.312,
      }),
    );
    expect(deps.closeByExitSignal).not.toHaveBeenCalled();
  });

  it('does not close while submitted DCA is still pending on later tick', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';

    const closeByExitSignal = vi.fn(async () => ({ status: 'closed' as const }));
    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-sol-dca',
          userId: 'user-sol',
          botId: 'bot-sol',
          walletId: 'wallet-sol',
          strategyId: 'strat-sol',
          symbol: 'SOLUSDT',
          side: 'LONG' as const,
          status: 'OPEN' as const,
          entryPrice: 100,
          quantity: 2,
          leverage: 1,
          marginUsed: 200,
          unrealizedPnl: -4,
          lastExchangeSyncAt: new Date(30_000),
          stopLoss: null,
          takeProfit: null,
          managementMode: 'BOT_MANAGED' as const,
          origin: 'EXCHANGE_SYNC' as const,
          continuityState: 'CONFIRMED' as const,
          bot: liveBot(),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => ({
        close: { mode: 'basic', tp: null, sl: 1, ttp: [], tsl: [] },
        additional: { dcaEnabled: false },
      })),
      executeDca: vi.fn(),
      closeByExitSignal,
      resolveDcaFundsExhausted: vi.fn(async () => false),
      resolveLifecyclePrice: vi.fn(async () => 98),
      hasPendingSubmittedDcaForPosition: vi.fn(async () => true),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'SOLUSDT',
      eventTime: 31_000,
      lastPrice: 98,
      priceChangePercent24h: -1.2,
    });

    expect(closeByExitSignal).not.toHaveBeenCalled();
  });
});
