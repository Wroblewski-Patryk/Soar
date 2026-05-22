import { describe, expect, it, vi } from 'vitest';
import { RuntimePositionAutomationService } from './runtimePositionAutomation.service';

const buildBotExecutionContext = (strategyId = 'strat-runtime-dca-close-parity') => ({
  walletId: 'wallet-runtime-dca-close-parity',
  liveOptIn: true,
  wallet: {
    mode: 'LIVE' as const,
    exchange: 'BINANCE' as const,
    marketType: 'FUTURES' as const,
    baseCurrency: 'USDT',
    paperInitialBalance: 10_000,
  },
  symbolGroup: {
    symbols: ['ADAUSDT'],
    marketUniverse: {
      exchange: 'BINANCE' as const,
      marketType: 'FUTURES' as const,
      baseCurrency: 'USDT',
    },
  },
  botMarketGroups: [
    {
      symbolGroup: {
        symbols: ['ADAUSDT'],
        marketUniverse: {
          exchange: 'BINANCE' as const,
          marketType: 'FUTURES' as const,
          baseCurrency: 'USDT',
        },
      },
      strategyLinks: [{ strategyId }],
    },
  ],
});

describe('RuntimePositionAutomationService DCA/close parity', () => {
  it('keeps runtime TP blocked while profit-side DCA levels remain pending', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';

    const closeByExitSignal = vi.fn(async () => ({ status: 'closed' as const }));
    const executeDca = vi.fn(async () => ({
      feePaid: 0.1,
      executed: true,
      nextQuantity: 2,
      nextEntryPrice: 105,
    }));
    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-runtime-tp-profit-side-dca',
          userId: 'user-runtime-tp-profit-side-dca',
          botId: 'bot-runtime-tp-profit-side-dca',
          walletId: 'wallet-runtime-dca-close-parity',
          strategyId: 'strat-runtime-tp-profit-side-dca',
          symbol: 'ADAUSDT',
          side: 'LONG' as const,
          entryPrice: 100,
          quantity: 1,
          leverage: 1,
          marginUsed: 100,
          stopLoss: null,
          takeProfit: null,
          managementMode: 'BOT_MANAGED' as const,
          origin: 'BOT' as const,
          continuityState: 'CONFIRMED' as const,
          status: 'OPEN' as const,
          unrealizedPnl: null,
          lastExchangeSyncAt: null,
          bot: buildBotExecutionContext('strat-runtime-tp-profit-side-dca'),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => ({
        close: {
          mode: 'basic',
          tp: 10,
          sl: 80,
          ttp: [],
          tsl: [],
        },
        additional: {
          dcaEnabled: true,
          dcaMode: 'advanced',
          dcaTimes: 2,
          dcaLevels: [
            { percent: 10, multiplier: 1 },
            { percent: 25, multiplier: 1 },
          ],
        },
      })),
      executeDca,
      closeByExitSignal,
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'ADAUSDT',
      eventTime: 21_000,
      lastPrice: 112,
      priceChangePercent24h: 1.1,
    });

    expect(executeDca).toHaveBeenCalledWith(
      expect.objectContaining({
        positionId: 'pos-runtime-tp-profit-side-dca',
        dcaLevelIndex: 0,
        mode: 'LIVE',
      })
    );
    expect(closeByExitSignal).not.toHaveBeenCalled();
    expect(service.getPositionStateSnapshot('pos-runtime-tp-profit-side-dca')).toEqual(
      expect.objectContaining({
        quantity: 2,
        averageEntryPrice: 105,
        currentAdds: 1,
        executedDcaLevelIndices: [0],
      })
    );
  });

  it('allows runtime SL after loss-side DCA when remaining DCA levels are profit-side only', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';

    const closeByExitSignal = vi.fn(async () => ({ status: 'closed' as const }));
    const executeDca = vi.fn(async () => ({
      feePaid: 0.1,
      executed: true,
      nextQuantity: 2,
      nextEntryPrice: 94,
    }));
    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-runtime-sl-profit-side-dca',
          userId: 'user-runtime-sl-profit-side-dca',
          botId: 'bot-runtime-sl-profit-side-dca',
          walletId: 'wallet-runtime-dca-close-parity',
          strategyId: 'strat-runtime-sl-profit-side-dca',
          symbol: 'ADAUSDT',
          side: 'LONG' as const,
          entryPrice: 100,
          quantity: 1,
          leverage: 1,
          marginUsed: 100,
          stopLoss: null,
          takeProfit: null,
          managementMode: 'BOT_MANAGED' as const,
          origin: 'BOT' as const,
          continuityState: 'CONFIRMED' as const,
          status: 'OPEN' as const,
          unrealizedPnl: null,
          lastExchangeSyncAt: null,
          bot: buildBotExecutionContext('strat-runtime-sl-profit-side-dca'),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => ({
        close: {
          mode: 'basic',
          tp: 80,
          sl: 1,
          ttp: [],
          tsl: [],
        },
        additional: {
          dcaEnabled: true,
          dcaMode: 'advanced',
          dcaTimes: 2,
          dcaLevels: [
            { percent: -10, multiplier: 1 },
            { percent: 25, multiplier: 1 },
          ],
        },
      })),
      executeDca,
      closeByExitSignal,
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'ADAUSDT',
      eventTime: 22_000,
      lastPrice: 88,
      priceChangePercent24h: -1.1,
    });

    expect(executeDca).toHaveBeenCalledWith(
      expect.objectContaining({
        positionId: 'pos-runtime-sl-profit-side-dca',
        dcaLevelIndex: 0,
        mode: 'LIVE',
      })
    );
    expect(closeByExitSignal).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: 'stop_loss',
        symbol: 'ADAUSDT',
        quantity: 2,
      })
    );
  });
});
