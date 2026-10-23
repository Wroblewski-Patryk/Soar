import { afterEach, describe, expect, it, vi } from 'vitest';
import { RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { runtimePositionStateStore } from './runtimePositionState.store';

afterEach(() => vi.unstubAllEnvs());

describe('runtime position USDT DCA guard', () => {
  it.each([
    ['stop_loss', 0.9, false], ['DCA', null, true],
  ] as const)('blocks automatic %s when strategy config is missing', async (_decision, stopLoss, dcaFallback) => {
    vi.stubEnv('RUNTIME_DCA_ENABLED', dcaFallback ? 'true' : 'false');
    const executeDca = vi.fn(async () => ({ feePaid: 0, executed: true }));
    const closeByExitSignal = vi.fn(async () => ({ status: 'closed' as const }));
    const recordRuntimeEvent = vi.fn(async () => undefined);
    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [{
        id: `pos-missing-config-${_decision}`, userId: 'user-1', botId: 'bot-1',
        walletId: 'wallet-1', strategyId: 'strategy-1', symbol: 'BTCUSDT',
        side: 'LONG', entryPrice: 1, quantity: 1, leverage: 1,
        stopLoss, takeProfit: null, managementMode: 'BOT_MANAGED',
        origin: 'BOT', continuityState: 'CONFIRMED', status: 'OPEN',
        unrealizedPnl: null, lastExchangeSyncAt: null,
        bot: {
          walletId: 'wallet-1', liveOptIn: true,
          wallet: { mode: 'PAPER', exchange: 'BINANCE', marketType: 'FUTURES',
            baseCurrency: 'USDT', paperInitialBalance: 10_000 },
          symbolGroup: { symbols: ['BTCUSDT'], marketUniverse: {
            exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
          } },
        },
      }]),
      getStrategyConfigById: vi.fn(async () => null),
      executeDca, closeByExitSignal, recordRuntimeEvent,
    };
    await new RuntimePositionAutomationService(deps).handleTickerEvent({
      type: 'ticker', exchange: 'BINANCE', marketType: 'FUTURES',
      symbol: 'BTCUSDT', eventTime: 1_000, lastPrice: 0.8,
      priceChangePercent24h: -20,
    });

    expect(deps.getStrategyConfigById).toHaveBeenCalledWith('strategy-1');
    expect(executeDca).not.toHaveBeenCalled();
    expect(closeByExitSignal).not.toHaveBeenCalled();
    expect(recordRuntimeEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventType: 'PRETRADE_BLOCKED', level: 'WARN',
      payload: expect.objectContaining({ reason: 'RUNTIME_DCA_STRATEGY_UNAVAILABLE' }),
    }));
  });

  it.each([
    ['PAPER', 2], ['PAPER', 5], ['LIVE', 2], ['LIVE', 5],
  ] as const)('executes existing %s USDT position with multiplier %s once across restart', async (mode, multiplier) => {
    const recordRuntimeEvent = vi.fn(async () => undefined);
    const position = {
      id: `pos-usdt-guard-${mode}-${multiplier}`,
      userId: 'user-usdt-guard', botId: 'bot-usdt-guard', walletId: 'wallet-1',
      strategyId: 'strategy-usdt-guard', symbol: 'BTCUSDT', side: 'LONG',
      entryPrice: 1, quantity: 1, leverage: 1, stopLoss: null, takeProfit: null,
      managementMode: 'BOT_MANAGED', origin: 'BOT', continuityState: 'CONFIRMED',
      status: 'OPEN', unrealizedPnl: null, lastExchangeSyncAt: null,
      bot: {
        walletId: 'wallet-1', liveOptIn: true,
        wallet: { mode, exchange: 'BINANCE', marketType: 'FUTURES',
          baseCurrency: 'USDT', paperInitialBalance: 10_000 },
        symbolGroup: { symbols: ['BTCUSDT'], marketUniverse: {
          exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
        } },
      },
    };
    let filled = false;
    const executeDca = vi.fn(async (input: { addedQuantity: number }) => {
      const nextQuantity = position.quantity + input.addedQuantity;
      const nextEntryPrice = (position.entryPrice * position.quantity + 0.8 * input.addedQuantity) / nextQuantity;
      position.quantity = nextQuantity;
      position.entryPrice = nextEntryPrice;
      filled = true;
      return { feePaid: 0, executed: true, nextQuantity, nextEntryPrice };
    });
    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [position]),
      getStrategyConfigById: vi.fn(async () => ({ additional: {
        dcaEnabled: true, dcaSizingBasis: 'usdt_contribution_v1',
        dcaMode: 'basic', dcaTimes: 1,
        dcaLevels: [{ percent: -20, multiplier }],
      } })),
      executeDca, recordRuntimeEvent,
      resolveDcaFundsExhausted: vi.fn(async () => false),
      getDurableDcaProgress: vi.fn(async () => ({ currentAdds: filled ? 1 : 0,
        lastDcaPrice: filled ? 0.8 : undefined,
        executedDcaLevelIndices: filled ? [0] : [] })),
    };
    const event = { type: 'ticker' as const, exchange: 'BINANCE' as const,
      marketType: 'FUTURES' as const, symbol: 'BTCUSDT', eventTime: 1_000,
      lastPrice: 0.8, priceChangePercent24h: -20 };

    if (mode === 'LIVE') await runtimePositionStateStore.setPositionRuntimeState(position.id, {
      quantity: 1, averageEntryPrice: 1, currentAdds: 0, trailingAnchorPrice: 1,
    });
    await new RuntimePositionAutomationService(deps).handleTickerEvent(event);
    await new RuntimePositionAutomationService(deps).handleTickerEvent(event);

    expect(executeDca).toHaveBeenCalledTimes(1);
    expect(executeDca).toHaveBeenCalledWith(expect.objectContaining({
      mode, dcaLevelIndex: 0, addedQuantity: 1 * multiplier / 0.8,
    }));
    expect(recordRuntimeEvent).toHaveBeenCalledWith(expect.objectContaining({
      mode, eventType: 'DCA_EXECUTED',
    }));
    if (mode === 'LIVE') await runtimePositionStateStore.deletePositionRuntimeState(position.id);
  });
});
