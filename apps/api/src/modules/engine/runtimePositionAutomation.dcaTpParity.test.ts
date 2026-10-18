import { describe, expect, it, vi } from 'vitest';
import { RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { runtimePositionStateStore } from './runtimePositionState.store';
import { DomainError } from '../../lib/errors';
import { RuntimeDcaPolicyError } from './runtimeDcaPolicy';

const buildBotExecutionContext = (strategyId = 'strat-runtime-dca-close-parity',
  exchange: 'BINANCE' | 'GATEIO' = 'BINANCE') => ({
  walletId: 'wallet-runtime-dca-close-parity',
  liveOptIn: true,
  wallet: {
    mode: 'LIVE' as const,
    exchange,
    marketType: 'FUTURES' as const,
    baseCurrency: 'USDT',
    paperInitialBalance: 10_000,
  },
  symbolGroup: {
    symbols: ['ADAUSDT'],
    marketUniverse: {
      exchange,
      marketType: 'FUTURES' as const,
      baseCurrency: 'USDT',
    },
  },
  botMarketGroups: [
    {
      symbolGroup: {
        symbols: ['ADAUSDT'],
        marketUniverse: {
          exchange,
          marketType: 'FUTURES' as const,
          baseCurrency: 'USDT',
        },
      },
      strategyLinks: [{ strategyId }],
    },
  ],
});

describe('RuntimePositionAutomationService DCA/close parity', () => {
  it('keeps PAPER DCA independent of the LIVE pause control', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';
    const readLiveExecutionPause = vi.fn(async () => ({ available: true, paused: true }));
    const executeDca = vi.fn(async () => ({ feePaid: 0, executed: true,
      nextQuantity: 2, nextEntryPrice: 106 }));
    const liveBot = buildBotExecutionContext('strat-paper-pause');
    const paperBot = { ...liveBot, wallet: { ...liveBot.wallet, mode: 'PAPER' as const } };
    const deps: any = {
      readLiveExecutionPause,
      listOpenPositionsBySymbol: vi.fn(async () => [{
        id: 'pos-paper-pause', userId: 'user-paper-pause', botId: 'bot-paper-pause',
        walletId: 'wallet-runtime-dca-close-parity', strategyId: 'strat-paper-pause',
        symbol: 'ADAUSDT', side: 'LONG', entryPrice: 100, quantity: 1,
        leverage: 1, marginUsed: 100, stopLoss: null, takeProfit: null,
        managementMode: 'BOT_MANAGED', origin: 'BOT', continuityState: 'CONFIRMED',
        status: 'OPEN', unrealizedPnl: null, lastExchangeSyncAt: null,
        bot: paperBot,
      }]),
      getStrategyConfigById: vi.fn(async () => ({
        close: { mode: 'basic', tp: 10, sl: 80, ttp: [], tsl: [] },
        additional: { dcaEnabled: true, dcaMode: 'advanced', dcaTimes: 1,
          dcaLevels: [{ percent: 10, multiplier: 1 }] },
      })),
      executeDca,
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };
    await new RuntimePositionAutomationService(deps).handleTickerEvent({
      type: 'ticker', exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'ADAUSDT',
      eventTime: 26_000, lastPrice: 112, priceChangePercent24h: 1.1,
    });
    expect(readLiveExecutionPause).not.toHaveBeenCalled();
    expect(executeDca).toHaveBeenCalledWith(expect.objectContaining({ mode: 'PAPER' }));
  });

  it.each(['already paused', 'pause races with DCA'] as const)(
    'keeps reached positive DCA ahead of LIVE TP while %s, including restart', async (scenario) => {
      process.env.RUNTIME_TRAILING_ENABLED = 'false';
      process.env.RUNTIME_DCA_ENABLED = 'false';
      const positionId = `pos-runtime-pause-${scenario.replaceAll(' ', '-')}`;
      let paused = scenario === 'already paused';
      const executeDca = vi.fn(async () => {
        paused = true;
        throw new DomainError('LIVE_PRETRADE_PAUSED', 'LIVE_PRETRADE_PAUSED', { status: 503 });
      });
      const closeByExitSignal = vi.fn(async () => ({ status: 'closed' as const }));
      const deps: any = {
        readLiveExecutionPause: vi.fn(async () => ({ available: true, paused })),
        listOpenPositionsBySymbol: vi.fn(async () => [{
          id: positionId, userId: 'user-runtime-pause', botId: 'bot-runtime-pause',
          walletId: 'wallet-runtime-dca-close-parity', strategyId: 'strat-runtime-pause',
          symbol: 'ADAUSDT', side: 'LONG' as const, entryPrice: 100, quantity: 1,
          leverage: 1, marginUsed: 100, stopLoss: null, takeProfit: null,
          managementMode: 'BOT_MANAGED' as const, origin: 'BOT' as const,
          continuityState: 'CONFIRMED' as const, status: 'OPEN' as const,
          unrealizedPnl: null, lastExchangeSyncAt: null,
          bot: buildBotExecutionContext('strat-runtime-pause'),
        }]),
        getStrategyConfigById: vi.fn(async () => ({
          close: { mode: 'basic', tp: 10, sl: 80, ttp: [], tsl: [] },
          additional: { dcaEnabled: true, dcaMode: 'advanced', dcaTimes: 2,
            dcaLevels: [{ percent: 10, multiplier: 1 }, { percent: 25, multiplier: 1 }] },
        })),
        executeDca, closeByExitSignal,
        resolveDcaFundsExhausted: vi.fn(async () => false),
        nowMs: vi.fn(() => Date.now()),
      };
      await runtimePositionStateStore.setPositionRuntimeState(positionId, {
        quantity: 1, averageEntryPrice: 100, currentAdds: 0, trailingAnchorPrice: 100,
      });
      try {
        await new RuntimePositionAutomationService(deps).handleTickerEvent({
          type: 'ticker', exchange: 'BINANCE', marketType: 'FUTURES',
          symbol: 'ADAUSDT', eventTime: 25_000, lastPrice: 112, priceChangePercent24h: 1.1,
        });
        expect(executeDca).toHaveBeenCalledTimes(scenario === 'already paused' ? 0 : 1);
        expect(closeByExitSignal).not.toHaveBeenCalled();
        const restarted = new RuntimePositionAutomationService(deps);
        await restarted.handleTickerEvent({ type: 'ticker', exchange: 'BINANCE',
          marketType: 'FUTURES', symbol: 'ADAUSDT', eventTime: 26_000,
          lastPrice: 112, priceChangePercent24h: 1.1 });
        expect(executeDca).toHaveBeenCalledTimes(scenario === 'already paused' ? 0 : 1);
        expect(closeByExitSignal).not.toHaveBeenCalled();
        expect(restarted.getPositionStateSnapshot(positionId)).toEqual(expect.objectContaining({
          quantity: 1, averageEntryPrice: 100, currentAdds: 0,
        }));
      } finally {
        await runtimePositionStateStore.deletePositionRuntimeState(positionId);
      }
    }
  );

  it.each([
    ['BINANCE', 'already paused'], ['BINANCE', 'pause races with DCA'],
    ['GATEIO', 'already paused'], ['GATEIO', 'pause races with DCA'],
  ] as const)(
    '%s does not turn reached -30%% DCA into a false SL at 69.5 while %s or after restart',
    async (exchange, scenario) => {
      process.env.RUNTIME_TRAILING_ENABLED = 'false';
      process.env.RUNTIME_DCA_ENABLED = 'false';
      const positionId = `pos-paused-dca-sl-${exchange}-${scenario.replaceAll(' ', '-')}`;
      let paused = scenario === 'already paused';
      const executeDca = vi.fn(async () => {
        paused = true;
        throw new DomainError('LIVE_PRETRADE_PAUSED', 'LIVE_PRETRADE_PAUSED', { status: 503 });
      });
      const closeByExitSignal = vi.fn(async () => ({ status: 'closed' as const }));
      const deps: any = {
        readLiveExecutionPause: vi.fn(async () => ({ available: true, paused })),
        listOpenPositionsBySymbol: vi.fn(async () => [{
          id: positionId, userId: 'user-paused-dca-sl', botId: 'bot-paused-dca-sl',
          walletId: 'wallet-runtime-dca-close-parity', strategyId: 'strat-paused-dca-sl',
          symbol: 'ADAUSDT', side: 'LONG' as const, entryPrice: 100, quantity: 1,
          leverage: 1, marginUsed: 100, stopLoss: null, takeProfit: null,
          managementMode: 'BOT_MANAGED' as const, origin: 'BOT' as const,
          continuityState: 'CONFIRMED' as const, status: 'OPEN' as const,
          unrealizedPnl: null, lastExchangeSyncAt: null,
          bot: buildBotExecutionContext('strat-paused-dca-sl', exchange),
        }]),
        getStrategyConfigById: vi.fn(async () => ({
          close: { mode: 'basic', tp: 50, sl: 20, ttp: [], tsl: [] },
          additional: { dcaEnabled: true, dcaMode: 'advanced', dcaTimes: 1,
            dcaLevels: [{ percent: -30, multiplier: 1 }],
            dcaSizingBasis: 'usdt_contribution_v1' },
        })),
        getDurableDcaProgress: vi.fn(async () => ({ currentAdds: 0, executedDcaLevelIndices: [] })),
        executeDca, closeByExitSignal,
        resolveDcaFundsExhausted: vi.fn(async () => false),
        nowMs: vi.fn(() => Date.now()),
      };
      await runtimePositionStateStore.setPositionRuntimeState(positionId, {
        quantity: 1, averageEntryPrice: 100, currentAdds: 0, trailingAnchorPrice: 100,
      });
      try {
        for (const eventTime of [30_000, 31_000]) {
          await new RuntimePositionAutomationService(deps).handleTickerEvent({
            type: 'ticker', exchange, marketType: 'FUTURES',
            symbol: 'ADAUSDT', eventTime, lastPrice: 69.5, priceChangePercent24h: -30.5,
          });
        }
        expect(executeDca).toHaveBeenCalledTimes(scenario === 'already paused' ? 0 : 1);
        expect(closeByExitSignal).not.toHaveBeenCalled();
        expect(await runtimePositionStateStore.getPositionRuntimeState(positionId)).toEqual(
          expect.objectContaining({ quantity: 1, averageEntryPrice: 100, currentAdds: 0 }),
        );
      } finally {
        await runtimePositionStateStore.deletePositionRuntimeState(positionId);
      }
    }
  );

  it('releases SL only after a reached USDT DCA reports insufficient funds', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';
    const executeDca = vi.fn(async () => {
      throw new RuntimeDcaPolicyError({ code: 'DCA_FUNDS_EXHAUSTED',
        message: 'Runtime USDT DCA requires more free USDT than the wallet has' });
    });
    const closeByExitSignal = vi.fn(async () => ({ status: 'closed' as const }));
    const recordRuntimeEvent = vi.fn(async () => undefined);
    const deps: any = {
      readLiveExecutionPause: vi.fn(async () => ({ available: true, paused: false })),
      listOpenPositionsBySymbol: vi.fn(async () => [{
        id: 'pos-dca-funds-sl', userId: 'user-dca-funds-sl', botId: 'bot-dca-funds-sl',
        walletId: 'wallet-runtime-dca-close-parity', strategyId: 'strat-dca-funds-sl',
        symbol: 'ADAUSDT', side: 'LONG' as const, entryPrice: 100, quantity: 1,
        leverage: 1, marginUsed: 100, stopLoss: null, takeProfit: null,
        managementMode: 'BOT_MANAGED' as const, origin: 'BOT' as const,
        continuityState: 'CONFIRMED' as const, status: 'OPEN' as const,
        unrealizedPnl: null, lastExchangeSyncAt: null,
        bot: buildBotExecutionContext('strat-dca-funds-sl'),
      }]),
      getStrategyConfigById: vi.fn(async () => ({
        close: { mode: 'basic', tp: 50, sl: 20, ttp: [], tsl: [] },
        additional: { dcaEnabled: true, dcaMode: 'advanced', dcaTimes: 1,
          dcaLevels: [{ percent: -30, multiplier: 1 }],
          dcaSizingBasis: 'usdt_contribution_v1' },
      })),
      getDurableDcaProgress: vi.fn(async () => ({ currentAdds: 0, executedDcaLevelIndices: [] })),
      executeDca, closeByExitSignal, recordRuntimeEvent,
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };
    await runtimePositionStateStore.setPositionRuntimeState('pos-dca-funds-sl', {
      quantity: 1, averageEntryPrice: 100, currentAdds: 0, trailingAnchorPrice: 100,
    });
    try {
      await new RuntimePositionAutomationService(deps).handleTickerEvent({
        type: 'ticker', exchange: 'BINANCE', marketType: 'FUTURES',
        symbol: 'ADAUSDT', eventTime: 32_000, lastPrice: 69.5, priceChangePercent24h: -30.5,
      });
      expect(executeDca).toHaveBeenCalledOnce();
      expect(closeByExitSignal).toHaveBeenCalledWith(expect.objectContaining({
        reason: 'stop_loss', quantity: 1, mode: 'LIVE',
      }));
      expect(recordRuntimeEvent).toHaveBeenCalledWith(expect.objectContaining({
        eventType: 'PRETRADE_BLOCKED', message: 'Runtime DCA blocked by insufficient funds',
        payload: expect.objectContaining({ reason: 'dca_funds_exhausted' }),
      }));
    } finally {
      await runtimePositionStateStore.deletePositionRuntimeState('pos-dca-funds-sl');
    }
  });

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

    await runtimePositionStateStore.setPositionRuntimeState('pos-runtime-tp-profit-side-dca', {
      quantity: 1, averageEntryPrice: 100, currentAdds: 0, trailingAnchorPrice: 100,
    });
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
    await runtimePositionStateStore.deletePositionRuntimeState('pos-runtime-tp-profit-side-dca');
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

    await runtimePositionStateStore.setPositionRuntimeState('pos-runtime-sl-profit-side-dca', {
      quantity: 1, averageEntryPrice: 100, currentAdds: 0, trailingAnchorPrice: 100,
    });
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
    await runtimePositionStateStore.deletePositionRuntimeState('pos-runtime-sl-profit-side-dca');
  });
});
