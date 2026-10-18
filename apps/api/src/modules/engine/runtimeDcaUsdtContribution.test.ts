import { describe, expect, it, vi } from 'vitest';
import { RuntimePositionAutomationService } from './runtimePositionAutomation.service';

const runSequence = async (input: {
  mode: 'PAPER' | 'LIVE';
  marketType: 'SPOT' | 'FUTURES';
  dcaMode: 'basic' | 'advanced';
}) => {
  const leverage = input.marketType === 'SPOT' ? 1 : 5;
  const position: any = {
    id: `usdt-${input.mode}-${input.marketType}-${input.dcaMode}`,
    userId: 'usdt-user', botId: 'usdt-bot', walletId: 'usdt-wallet',
    strategyId: 'usdt-strategy', symbol: 'BTCUSDT', side: 'LONG',
    entryPrice: 1, quantity: leverage, leverage, marginUsed: null,
    stopLoss: null, takeProfit: null, managementMode: 'BOT_MANAGED',
    origin: 'BOT', continuityState: 'CONFIRMED', status: 'OPEN',
    unrealizedPnl: null, lastExchangeSyncAt: null,
    bot: {
      walletId: 'usdt-wallet', liveOptIn: true,
      wallet: { mode: input.mode, exchange: 'BINANCE', marketType: input.marketType,
        baseCurrency: 'USDT', paperInitialBalance: 100 },
      symbolGroup: { symbols: ['BTCUSDT'], marketUniverse: {
        exchange: 'BINANCE', marketType: input.marketType, baseCurrency: 'USDT',
      } },
    },
  };
  const fills: Array<{ price: number; quantity: number }> = [];
  const executeDca = vi.fn(async (request: { addedQuantity: number; markPrice: number }) => {
    const nextQuantity = position.quantity + request.addedQuantity;
    const nextEntryPrice = (position.entryPrice * position.quantity
      + request.markPrice * request.addedQuantity) / nextQuantity;
    fills.push({ price: request.markPrice, quantity: request.addedQuantity });
    position.quantity = nextQuantity;
    position.entryPrice = nextEntryPrice;
    return { feePaid: 0, executed: true, nextQuantity, nextEntryPrice };
  });
  const resolveDcaFundsExhausted = vi.fn(async () => false);
  const deps: any = {
    listOpenPositionsBySymbol: vi.fn(async () => [position]),
    getStrategyConfigById: vi.fn(async () => ({ additional: {
      dcaEnabled: true, dcaSizingBasis: 'usdt_contribution_v1',
      dcaMode: input.dcaMode, dcaTimes: input.dcaMode === 'basic' ? 2 : 1,
      dcaLevels: input.dcaMode === 'basic'
        ? [{ percent: -30.5, multiplier: 2 }]
        : [{ percent: -20, multiplier: 1 }, { percent: -30, multiplier: 0.5 }],
    } })),
    getCanonicalPositionState: vi.fn(async () => ({
      quantity: position.quantity, averageEntryPrice: position.entryPrice,
    })),
    getDurableDcaProgress: vi.fn(async () => ({
      currentAdds: fills.length, lastDcaPrice: fills.at(-1)?.price,
      executedDcaLevelIndices: fills.map((_, index) => index),
    })),
    executeDca,
    resolveDcaFundsExhausted,
    resolveLifecyclePrice: ({ fallbackPrice }: { fallbackPrice: number }) => fallbackPrice,
    recordRuntimeEvent: vi.fn(async () => undefined),
    nowMs: () => Date.now(),
  };
  const firstThreshold = input.dcaMode === 'basic' ? 0.305 : 0.20;
  const secondThreshold = input.dcaMode === 'basic' ? 0.305 : 0.30;
  const send = async (price: number) => new RuntimePositionAutomationService(deps).handleTickerEvent({
    type: 'ticker', exchange: 'BINANCE', marketType: input.marketType,
    symbol: 'BTCUSDT', eventTime: Date.now(), lastPrice: price,
    priceChangePercent24h: -30,
  });

  await send(1 - firstThreshold / leverage);
  expect(fills).toHaveLength(1);
  const firstContribution = position.entryPrice * position.quantity / leverage;
  expect(firstContribution).toBeCloseTo(input.dcaMode === 'basic' ? 3 : 2, 8);

  await send(fills[0].price);
  expect(fills).toHaveLength(1);

  await send(position.entryPrice * (1 - secondThreshold / leverage));
  expect(fills).toHaveLength(2);
  expect(position.entryPrice * position.quantity / leverage)
    .toBeCloseTo(input.dcaMode === 'basic' ? 9 : 3, 8);
  await send(fills[1].price);
  expect(executeDca).toHaveBeenCalledTimes(2);
  // USDT funds are checked after a reached level is sized to venue precision.
  expect(resolveDcaFundsExhausted).not.toHaveBeenCalled();
  expect(fills[0].price * fills[0].quantity / leverage)
    .toBeCloseTo(input.dcaMode === 'basic' ? 2 : 1, 8);
  expect(fills[1].price * fills[1].quantity / leverage)
    .toBeCloseTo(input.dcaMode === 'basic' ? 6 : 1, 8);
};

describe('runtime confirmed USDT contribution DCA', () => {
  it.each(['PAPER', 'LIVE'] as const)('%s basic two-add SL waits for the filled average across restart', async (mode) => {
    const position: any = {
      id: `usdt-exit-${mode}`, userId: 'usdt-user', botId: 'usdt-bot',
      walletId: 'usdt-wallet', strategyId: 'usdt-strategy', symbol: 'BTCUSDT',
      side: 'LONG', entryPrice: 1, quantity: 1, leverage: 1, marginUsed: null,
      stopLoss: null, takeProfit: null, managementMode: 'BOT_MANAGED',
      origin: 'BOT', continuityState: 'CONFIRMED', status: 'OPEN',
      unrealizedPnl: null, lastExchangeSyncAt: null,
      bot: { walletId: 'usdt-wallet', liveOptIn: true,
        wallet: { mode, exchange: 'BINANCE', marketType: 'FUTURES',
          baseCurrency: 'USDT', paperInitialBalance: 100 },
        symbolGroup: { symbols: ['BTCUSDT'], marketUniverse: {
          exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
        } },
      },
    };
    const fills: number[] = [];
    const executeDca = vi.fn(async (request: { markPrice: number; addedQuantity: number }) => {
      const nextQuantity = position.quantity + request.addedQuantity;
      const nextEntryPrice = (position.entryPrice * position.quantity
        + request.markPrice * request.addedQuantity) / nextQuantity;
      fills.push(request.markPrice);
      position.quantity = nextQuantity;
      position.entryPrice = nextEntryPrice;
      return { feePaid: 0, executed: true, nextQuantity, nextEntryPrice };
    });
    const closeByExitSignal = vi.fn(async () => ({ status: 'closed' as const }));
    const deps: any = {
      listOpenPositionsBySymbol: async () => [position],
      getStrategyConfigById: async () => ({
        close: { mode: 'basic', tp: 99, sl: 20 },
        additional: { dcaEnabled: true, dcaSizingBasis: 'usdt_contribution_v1',
          dcaMode: 'basic', dcaTimes: 2,
          dcaLevels: [{ percent: -30, multiplier: 1 }] },
      }),
      getCanonicalPositionState: async () => ({ quantity: position.quantity,
        averageEntryPrice: position.entryPrice }),
      getDurableDcaProgress: async () => ({ currentAdds: fills.length,
        lastDcaPrice: fills.at(-1), executedDcaLevelIndices: fills.map((_, index) => index) }),
      executeDca, closeByExitSignal,
      resolveLifecyclePrice: ({ fallbackPrice }: { fallbackPrice: number }) => fallbackPrice,
      recordRuntimeEvent: vi.fn(async () => undefined),
      nowMs: () => Date.now(),
    };
    const send = (price: number) => new RuntimePositionAutomationService(deps).handleTickerEvent({
      type: 'ticker', exchange: 'BINANCE', marketType: 'FUTURES',
      symbol: 'BTCUSDT', eventTime: Date.now(), lastPrice: price,
      priceChangePercent24h: -30,
    });

    await send(0.7);
    expect(fills).toHaveLength(1);
    expect(closeByExitSignal).not.toHaveBeenCalled();
    const secondPrice = position.entryPrice * 0.7;
    await send(secondPrice);
    expect(fills).toHaveLength(2);
    expect(closeByExitSignal).not.toHaveBeenCalled();
    await send(secondPrice);
    expect(executeDca).toHaveBeenCalledTimes(2);
    expect(closeByExitSignal).not.toHaveBeenCalled();
    const newStopPrice = position.entryPrice * 0.8;
    await send(newStopPrice - 0.0001);
    expect(closeByExitSignal).toHaveBeenCalledTimes(1);
    expect(closeByExitSignal).toHaveBeenCalledWith(expect.objectContaining({
      mode, reason: 'stop_loss',
    }));
  });

  it.each([
    ['PAPER', 'SPOT'], ['PAPER', 'FUTURES'],
    ['LIVE', 'SPOT'], ['LIVE', 'FUTURES'],
  ] as const)('%s %s basic contributes 1 -> 3 -> 9 after restart', async (mode, marketType) => {
    await runSequence({ mode, marketType, dcaMode: 'basic' });
  });

  it.each([
    ['PAPER', 'SPOT'], ['PAPER', 'FUTURES'],
    ['LIVE', 'SPOT'], ['LIVE', 'FUTURES'],
  ] as const)('%s %s advanced contributes 1 -> 2 -> 3 after restart', async (mode, marketType) => {
    await runSequence({ mode, marketType, dcaMode: 'advanced' });
  });

  it('restores the executed advanced level index instead of replaying a profit-side add', async () => {
    const quantity = 1 + 1 / 1.1;
    const position: any = {
      id: 'usdt-advanced-index-restart', userId: 'usdt-user', botId: 'usdt-bot',
      walletId: 'usdt-wallet', strategyId: 'usdt-strategy', symbol: 'BTCUSDT',
      side: 'LONG', entryPrice: 2 / quantity, quantity, leverage: 1,
      marginUsed: null, stopLoss: null, takeProfit: null,
      managementMode: 'BOT_MANAGED', origin: 'BOT', continuityState: 'CONFIRMED',
      status: 'OPEN', unrealizedPnl: null, lastExchangeSyncAt: null,
      bot: { walletId: 'usdt-wallet', liveOptIn: true,
        wallet: { mode: 'PAPER', exchange: 'BINANCE', marketType: 'SPOT',
          baseCurrency: 'USDT', paperInitialBalance: 100 },
        symbolGroup: { symbols: ['BTCUSDT'], marketUniverse: {
          exchange: 'BINANCE', marketType: 'SPOT', baseCurrency: 'USDT',
        } },
      },
    };
    const executeDca = vi.fn(async () => ({ feePaid: 0, executed: false }));
    const deps: any = {
      listOpenPositionsBySymbol: async () => [position],
      getStrategyConfigById: async () => ({ additional: {
        dcaEnabled: true, dcaSizingBasis: 'usdt_contribution_v1',
        dcaMode: 'advanced', dcaTimes: 1,
        dcaLevels: [{ percent: -20, multiplier: 0.5 },
          { percent: 10, multiplier: 1 }],
      } }),
      getDurableDcaProgress: async () => ({ currentAdds: 1,
        lastDcaPrice: 1.1, executedDcaLevelIndices: [1] }),
      executeDca, resolveDcaFundsExhausted: async () => false,
      resolveLifecyclePrice: ({ fallbackPrice }: { fallbackPrice: number }) => fallbackPrice,
      nowMs: () => Date.now(),
    };
    const send = (price: number) => new RuntimePositionAutomationService(deps).handleTickerEvent({
      type: 'ticker', exchange: 'BINANCE', marketType: 'SPOT', symbol: 'BTCUSDT',
      eventTime: Date.now(), lastPrice: price, priceChangePercent24h: 10,
    });
    await send(position.entryPrice * 1.11);
    expect(executeDca).not.toHaveBeenCalled();
    await send(position.entryPrice * 0.79);
    expect(executeDca).toHaveBeenCalledTimes(1);
    expect(executeDca).toHaveBeenCalledWith(expect.objectContaining({ dcaLevelIndex: 0 }));
  });
});
