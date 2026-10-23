import { describe, expect, it, vi } from 'vitest';
import { RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { runtimePositionStateStore } from './runtimePositionState.store';

describe('LIVE BOT protection cache guard', () => {
  it.each([
    ['LONG', 85, 121, 121.5, 119],
    ['SHORT', 115, 79, 78.5, 81],
  ] as const)('allows %s TSL to yield to TTP across restart, then blocks erased cache',
    async (side, lossPrice, profitPrice, safePrice, closePrice) => {
      const positionId = `pos-live-tsl-to-ttp-${side}`;
      const position: any = { id: positionId, userId: 'transition-user',
        botId: 'transition-bot', walletId: 'wallet-1', strategyId: 'transition-strategy',
        symbol: 'BTCUSDT', side, status: 'OPEN', origin: 'BOT',
        managementMode: 'BOT_MANAGED', continuityState: 'CONFIRMED',
        entryPrice: 100, quantity: 1, leverage: 1, marginUsed: null,
        stopLoss: null, takeProfit: null, unrealizedPnl: null, lastExchangeSyncAt: null,
        bot: { walletId: 'wallet-1', liveOptIn: true,
          wallet: { mode: 'LIVE', exchange: 'BINANCE', marketType: 'FUTURES',
            baseCurrency: 'USDT', paperInitialBalance: 1000 },
          symbolGroup: { symbols: ['BTCUSDT'], marketUniverse: {
            exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
          } },
        },
      };
      const closeByExitSignal = vi.fn(async () => ({ status: 'submitted' as const }));
      const executeDca = vi.fn();
      const recordRuntimeEvent = vi.fn(async () => undefined);
      const deps: any = { listOpenPositionsBySymbol: async () => [position],
        getStrategyConfigById: async () => ({ close: { mode: 'advanced',
          ttp: [{ percent: 20, arm: 1 }], tsl: [{ percent: -10, arm: 1 }] },
          additional: { dcaEnabled: false, dcaSizingBasis: 'usdt_contribution_v1' } }),
        executeDca, closeByExitSignal, recordRuntimeEvent,
      };
      const send = (price: number) => new RuntimePositionAutomationService(deps)
        .handleTickerEvent({ type: 'ticker', exchange: 'BINANCE',
          marketType: 'FUTURES', symbol: 'BTCUSDT', eventTime: 19_000,
          lastPrice: price, priceChangePercent24h: 0 } as any);
      try {
        await runtimePositionStateStore.setPositionRuntimeState(positionId, {
          quantity: 1, averageEntryPrice: 100, currentAdds: 0, trailingAnchorPrice: 100,
        });
        await send(lossPrice);
        const tsl = await runtimePositionStateStore.getPositionRuntimeState(positionId);
        expect(tsl?.trailingLossLimitPercent).toBeCloseTo(-0.16);
        expect(tsl?.trailingTakeProfitHighPercent).toBeUndefined();
        await runtimePositionStateStore.setPositionRuntimeState(positionId, {
          quantity: 1, averageEntryPrice: 100, currentAdds: 0,
          trailingAnchorPrice: 100,
        });
        await send(profitPrice);
        expect((await runtimePositionStateStore.getPositionRuntimeState(positionId))
          ?.trailingTakeProfitHighPercent).toBeUndefined();
        expect(recordRuntimeEvent).toHaveBeenCalledWith(expect.objectContaining({
          eventType: 'PRETRADE_BLOCKED', payload: expect.objectContaining({
            positionId, reason: 'PROTECTION_UNCONFIRMED',
          }),
        }));
        await runtimePositionStateStore.setPositionRuntimeState(positionId, tsl!);
        recordRuntimeEvent.mockClear();
        await send(profitPrice);
        const ttp = await runtimePositionStateStore.getPositionRuntimeState(positionId);
        expect(ttp?.trailingTakeProfitHighPercent).toBeCloseTo(0.21);
        expect(ttp?.trailingTakeProfitStepPercent).toBeCloseTo(0.01);
        expect(ttp?.trailingLossLimitPercent).toBeUndefined();
        expect(runtimePositionStateStore.getTestProtectionEvidence(positionId))
          .toEqual({ ttpEverArmed: true, tslEverArmed: true });
        await send(safePrice);
        expect(closeByExitSignal).not.toHaveBeenCalled();
        expect(recordRuntimeEvent).not.toHaveBeenCalledWith(expect.objectContaining({
          eventType: 'PRETRADE_BLOCKED', payload: expect.objectContaining({
            reason: 'PROTECTION_UNCONFIRMED',
          }),
        }));
        await send(closePrice);
        expect(closeByExitSignal).toHaveBeenCalledWith(expect.objectContaining({
          reason: 'trailing_take_profit', markPrice: closePrice,
        }));
        closeByExitSignal.mockClear();
        recordRuntimeEvent.mockClear();
        await runtimePositionStateStore.setPositionRuntimeState(positionId, {
          quantity: 1, averageEntryPrice: 100, currentAdds: 0,
          trailingAnchorPrice: side === 'LONG' ? 121.5 : 78.5,
        });
        await send(closePrice);
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

  it.each(['missing', 'incomplete', 'erased'] as const)(
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
      const closeByExitSignal = vi.fn(async () => ({ status: 'submitted' as const }));
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
        if (cacheFailure === 'missing') {
          await runtimePositionStateStore.deletePositionRuntimeState(positionId);
        } else if (cacheFailure === 'incomplete') {
          await runtimePositionStateStore.setPositionRuntimeState(positionId, {
            quantity: 2, averageEntryPrice: 95, currentAdds: 1,
            trailingAnchorPrice: 120,
            trailingTakeProfitHighPercent: 120 / 95 - 1,
            trailingTakeProfitActiveLevelIndex: 0,
          });
        } else {
          await runtimePositionStateStore.setPositionRuntimeState(positionId, {
            quantity: 2, averageEntryPrice: 95, currentAdds: 1,
            trailingAnchorPrice: 120,
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
