import { describe, expect, it, vi } from 'vitest';
import { RuntimePositionAutomationService } from './runtimePositionAutomation.service';

const buildBotExecutionContext = () => ({
  walletId: 'wallet-runtime-tp-profit-side-dca',
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
      strategyLinks: [{ strategyId: 'strat-runtime-tp-profit-side-dca' }],
    },
  ],
});

describe('RuntimePositionAutomationService DCA/TP parity', () => {
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
          walletId: 'wallet-runtime-tp-profit-side-dca',
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
          bot: buildBotExecutionContext(),
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
});
