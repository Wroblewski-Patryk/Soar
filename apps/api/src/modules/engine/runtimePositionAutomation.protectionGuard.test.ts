import { describe, expect, it, vi } from 'vitest';
import { RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { runtimePositionStateStore } from './runtimePositionState.store';

describe('LIVE BOT protection cache guard after a DCA fill', () => {
  it.each(['missing', 'incomplete'] as const)(
    'blocks DCA and CLOSE when the %s cache cannot prove the 119.7 TTP price',
    async (cacheFailure) => {
      const positionId = `pos-live-guard-${cacheFailure}`;
      const position: any = {
        id: positionId, userId: 'guard-user', botId: 'guard-bot', walletId: 'wallet-1',
        strategyId: 'guard-strategy', symbol: 'BTCUSDT', side: 'LONG', status: 'OPEN',
        origin: 'BOT', managementMode: 'BOT_MANAGED', continuityState: 'CONFIRMED',
        entryPrice: 95, quantity: 2, leverage: 1, marginUsed: null,
        stopLoss: null, takeProfit: null, unrealizedPnl: null, lastExchangeSyncAt: null,
        bot: { walletId: 'wallet-1', liveOptIn: true,
          wallet: { mode: 'LIVE', exchange: 'BINANCE', marketType: 'FUTURES',
            baseCurrency: 'USDT', paperInitialBalance: 1000 },
          symbolGroup: { symbols: ['BTCUSDT'], marketUniverse: {
            exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
          } },
        },
      };
      const closeByExitSignal = vi.fn(async () => ({ status: 'closed' as const }));
      const executeDca = vi.fn();
      const recordRuntimeEvent = vi.fn(async () => undefined);
      const deps: any = {
        listOpenPositionsBySymbol: async () => [position],
        getStrategyConfigById: async () => ({
          close: { mode: 'advanced', ttp: [{ percent: 20, arm: 1 }], tsl: [] },
          additional: { dcaEnabled: true, dcaTimes: 2,
            dcaLevels: [{ percent: -1, multiplier: 1.5 }] },
        }),
        executeDca, closeByExitSignal, recordRuntimeEvent,
        resolveLifecyclePrice: async () => 119,
      };
      const event: any = { type: 'ticker', exchange: 'BINANCE',
        marketType: 'FUTURES', symbol: 'BTCUSDT', eventTime: 19_000,
        lastPrice: 119, priceChangePercent24h: 10 };
      try {
        await runtimePositionStateStore.setPositionRuntimeState(positionId, {
          quantity: 2, averageEntryPrice: 95, currentAdds: 1,
          trailingAnchorPrice: 120,
          trailingTakeProfitHighPercent: 120 / 95 - 1,
          trailingTakeProfitStepPercent: 0.3 / 95,
          trailingTakeProfitActiveLevelIndex: 0,
        });
        await new RuntimePositionAutomationService(deps).handleTickerEvent(event);
        expect(closeByExitSignal).toHaveBeenCalledWith(expect.objectContaining({
          reason: 'trailing_take_profit', markPrice: 119,
        }));
        closeByExitSignal.mockClear();
        recordRuntimeEvent.mockClear();
        if (cacheFailure === 'incomplete') {
          await runtimePositionStateStore.setPositionRuntimeState(positionId, {
            quantity: 2, averageEntryPrice: 95, currentAdds: 1,
            trailingAnchorPrice: 120,
            trailingTakeProfitHighPercent: 120 / 95 - 1,
            trailingTakeProfitActiveLevelIndex: 0,
          });
        }
        await new RuntimePositionAutomationService(deps).handleTickerEvent(event);
        expect(closeByExitSignal).not.toHaveBeenCalled();
        expect(executeDca).not.toHaveBeenCalled();
        expect(recordRuntimeEvent).toHaveBeenCalledWith(expect.objectContaining({
          eventType: 'PRETRADE_BLOCKED', payload: expect.objectContaining({
            positionId, reason: 'PROTECTION_UNCONFIRMED',
          }),
        }));
      } finally {
        await runtimePositionStateStore.deletePositionRuntimeState(positionId);
      }
    });
});
