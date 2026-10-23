import { describe, expect, it, vi } from 'vitest';
import { RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { runtimePositionStateStore } from './runtimePositionState.store';

const seedLiveCache = async (mode: 'PAPER' | 'LIVE', position: {
  id: string; quantity: number; entryPrice: number;
}) => {
  if (mode === 'LIVE') await runtimePositionStateStore.setPositionRuntimeState(position.id, {
    quantity: position.quantity, averageEntryPrice: position.entryPrice,
    currentAdds: 0, trailingAnchorPrice: position.entryPrice,
  });
};

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

  await seedLiveCache(input.mode, position);
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
  it.each([
    ['PAPER', 'LONG', [126, 140, 130, 175, 145]],
    ['PAPER', 'SHORT', [74, 60, 65, 37.5, 57]],
    ['LIVE', 'LONG', [126, 140, 130, 175, 145]],
    ['LIVE', 'SHORT', [74, 60, 65, 37.5, 57]],
  ] as const)('%s %s keeps two-level TTP protection through restart and DCA',
    async (mode, side, prices) => {
      const position: any = {
        id: `ttp-dca-${mode}-${side}`, userId: 'usdt-user', botId: 'usdt-bot',
        walletId: 'usdt-wallet', strategyId: 'usdt-strategy', symbol: 'BTCUSDT',
        side, entryPrice: 100, quantity: 1, leverage: 1, marginUsed: null,
        stopLoss: null, takeProfit: null, managementMode: 'BOT_MANAGED',
        origin: 'BOT', continuityState: 'CONFIRMED', status: 'OPEN',
        unrealizedPnl: null, lastExchangeSyncAt: null,
        bot: { walletId: 'usdt-wallet', liveOptIn: true,
          wallet: { mode, exchange: 'BINANCE', marketType: 'FUTURES',
            baseCurrency: 'USDT', paperInitialBalance: 1000 },
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
          close: { mode: 'advanced', tp: 99, sl: 99,
            ttp: [{ percent: 25, arm: 12 }, { percent: 50, arm: 25 }] },
          additional: { dcaEnabled: true, dcaSizingBasis: 'usdt_contribution_v1',
            dcaMode: 'advanced', dcaTimes: 1,
            dcaLevels: [{ percent: 40, multiplier: 1 }] },
        }),
        getCanonicalPositionState: async () => ({ quantity: position.quantity,
          averageEntryPrice: position.entryPrice }),
        getDurableDcaProgress: async () => ({ currentAdds: fills.length,
          lastDcaPrice: fills.at(-1), executedDcaLevelIndices: fills.map((_, index) => index) }),
        executeDca, closeByExitSignal,
        resolveLifecyclePrice: ({ fallbackPrice }: { fallbackPrice: number }) => fallbackPrice,
        recordRuntimeEvent: vi.fn(async () => undefined), nowMs: () => Date.now(),
      };
      const send = (price: number) => new RuntimePositionAutomationService(deps).handleTickerEvent({
        type: 'ticker', exchange: 'BINANCE', marketType: 'FUTURES',
        symbol: 'BTCUSDT', eventTime: Date.now(), lastPrice: price,
        priceChangePercent24h: side === 'LONG' ? 40 : -40,
      });
      try {
        await seedLiveCache(mode, position);
        await send(prices[0]);
        expect((await runtimePositionStateStore.getPositionRuntimeState(position.id))
          ?.trailingTakeProfitActiveLevelIndex).toBe(0);
        await send(prices[1]);
        expect(fills).toEqual([prices[1]]);
        expect(closeByExitSignal).not.toHaveBeenCalled();
        const afterFill = await runtimePositionStateStore.getPositionRuntimeState(position.id);
        expect(afterFill?.averageEntryPrice).toBeCloseTo(position.entryPrice);
        expect(afterFill?.trailingTakeProfitActiveLevelIndex).toBe(0);
        await send(prices[2]);
        expect(closeByExitSignal).not.toHaveBeenCalled();
        await send(prices[3]);
        expect((await runtimePositionStateStore.getPositionRuntimeState(position.id))
          ?.trailingTakeProfitActiveLevelIndex).toBe(1);
        await send(prices[4]);
        expect(closeByExitSignal).toHaveBeenCalledWith(expect.objectContaining({
          reason: 'trailing_take_profit', markPrice: prices[4], mode,
        }));
      } finally {
        await runtimePositionStateStore.deletePositionRuntimeState(position.id);
      }
    });

  it.each([
    ['PAPER', 'LONG', [126, 151, 149, 136, 125]],
    ['PAPER', 'SHORT', [74, 49, 51, 64, 75]],
    ['LIVE', 'LONG', [126, 151, 149, 136, 125]],
    ['LIVE', 'SHORT', [74, 49, 51, 64, 75]],
  ] as const)('%s %s keeps the second TTP level on pullback with USDT DCA disabled',
    async (mode, side, prices) => {
      const position: any = {
        id: `ttp-no-dca-${mode}-${side}`, userId: 'usdt-user', botId: 'usdt-bot',
        walletId: 'usdt-wallet', strategyId: 'usdt-strategy', symbol: 'BTCUSDT',
        side, entryPrice: 100, quantity: 1, leverage: 1, marginUsed: null,
        stopLoss: null, takeProfit: null, managementMode: 'BOT_MANAGED',
        origin: 'BOT', continuityState: 'CONFIRMED', status: 'OPEN',
        unrealizedPnl: null, lastExchangeSyncAt: null,
        bot: { walletId: 'usdt-wallet', liveOptIn: true,
          wallet: { mode, exchange: 'BINANCE', marketType: 'FUTURES',
            baseCurrency: 'USDT', paperInitialBalance: 1000 },
          symbolGroup: { symbols: ['BTCUSDT'], marketUniverse: {
            exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
          } },
        },
      };
      const closeByExitSignal = vi.fn(async () => ({ status: 'closed' as const }));
      const executeDca = vi.fn();
      const deps: any = {
        listOpenPositionsBySymbol: async () => [position],
        getStrategyConfigById: async () => ({
          close: { mode: 'advanced', tp: 99, sl: 99,
            ttp: [{ percent: 25, arm: 12 }, { percent: 50, arm: 25 }] },
          additional: { dcaEnabled: false, dcaSizingBasis: 'usdt_contribution_v1', dcaTimes: 0 },
        }),
        executeDca, closeByExitSignal,
        resolveLifecyclePrice: ({ fallbackPrice }: { fallbackPrice: number }) => fallbackPrice,
        recordRuntimeEvent: vi.fn(async () => undefined), nowMs: () => Date.now(),
      };
      const send = (price: number) => new RuntimePositionAutomationService(deps).handleTickerEvent({
        type: 'ticker', exchange: 'BINANCE', marketType: 'FUTURES',
        symbol: 'BTCUSDT', eventTime: Date.now(), lastPrice: price,
        priceChangePercent24h: side === 'LONG' ? 40 : -40,
      });
      try {
        await seedLiveCache(mode, position);
        for (const price of prices.slice(0, 4)) await send(price);
        const protectedState = await runtimePositionStateStore.getPositionRuntimeState(position.id);
        expect(protectedState?.trailingTakeProfitActiveLevelIndex).toBe(1);
        expect(protectedState!.trailingTakeProfitHighPercent! -
          protectedState!.trailingTakeProfitStepPercent!).toBeCloseTo(0.26);
        expect(closeByExitSignal).not.toHaveBeenCalled();
        expect(executeDca).not.toHaveBeenCalled();
        await send(prices[4]);
        expect(closeByExitSignal).toHaveBeenCalledTimes(1);
        expect(closeByExitSignal).toHaveBeenCalledWith(expect.objectContaining({
          reason: 'trailing_take_profit', markPrice: prices[4], mode,
        }));
      } finally {
        await runtimePositionStateStore.deletePositionRuntimeState(position.id);
      }
    });

  it('blocks automation when a persisted trailing tracker cannot be rebased to a confirmed fill',
    async () => {
      const position: any = {
        id: 'incomplete-trailing-rebase', userId: 'usdt-user', botId: 'usdt-bot',
        walletId: 'usdt-wallet', strategyId: 'usdt-strategy', symbol: 'BTCUSDT',
        side: 'LONG', entryPrice: 123.08, quantity: 2, leverage: 1, marginUsed: null,
        stopLoss: null, takeProfit: null, managementMode: 'BOT_MANAGED',
        origin: 'BOT', continuityState: 'CONFIRMED', status: 'OPEN',
        unrealizedPnl: null, lastExchangeSyncAt: null,
        bot: { walletId: 'usdt-wallet', liveOptIn: true,
          wallet: { mode: 'LIVE', exchange: 'BINANCE', marketType: 'FUTURES',
            baseCurrency: 'USDT', paperInitialBalance: 1000 },
          symbolGroup: { symbols: ['BTCUSDT'], marketUniverse: {
            exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
          } },
        },
      };
      const closeByExitSignal = vi.fn();
      try {
        await runtimePositionStateStore.setPositionRuntimeState(position.id, {
          quantity: 1, averageEntryPrice: 100, currentAdds: 0,
          trailingTakeProfitHighPercent: 0.51,
          trailingTakeProfitActiveLevelIndex: 1,
        });
        await new RuntimePositionAutomationService({
          listOpenPositionsBySymbol: async () => [position],
          getStrategyConfigById: async () => ({
            close: { mode: 'advanced', tp: 99, sl: 99,
              ttp: [{ percent: 25, arm: 12 }, { percent: 50, arm: 25 }] },
            additional: { dcaEnabled: false, dcaSizingBasis: 'usdt_contribution_v1' },
          }),
          closeByExitSignal,
          resolveLifecyclePrice: async () => 130,
          recordRuntimeEvent: vi.fn(async () => undefined),
        }).handleTickerEvent({ type: 'ticker', exchange: 'BINANCE', marketType: 'FUTURES',
          symbol: 'BTCUSDT', eventTime: Date.now(), lastPrice: 130,
          priceChangePercent24h: 30 });
        expect(closeByExitSignal).not.toHaveBeenCalled();
        expect(await runtimePositionStateStore.getPositionRuntimeState(position.id)).toBeNull();
      } finally {
        await runtimePositionStateStore.deletePositionRuntimeState(position.id);
      }
    });

  it.each([
    ['PAPER', 'LONG', [49, 57, 76, 63]],
    ['PAPER', 'SHORT', [151, 143, 124, 137]],
    ['LIVE', 'LONG', [49, 57, 76, 63]],
    ['LIVE', 'SHORT', [151, 143, 124, 137]],
  ] as const)('%s %s restores both TSL levels and the ratcheted protection',
    async (mode, side, prices) => {
      const position: any = {
        id: `tsl-levels-${mode}-${side}`, userId: 'usdt-user', botId: 'usdt-bot',
        walletId: 'usdt-wallet', strategyId: 'usdt-strategy', symbol: 'BTCUSDT',
        side, entryPrice: 100, quantity: 1, leverage: 1, marginUsed: null,
        stopLoss: null, takeProfit: null, managementMode: 'BOT_MANAGED',
        origin: 'BOT', continuityState: 'CONFIRMED', status: 'OPEN',
        unrealizedPnl: null, lastExchangeSyncAt: null,
        bot: { walletId: 'usdt-wallet', liveOptIn: true,
          wallet: { mode, exchange: 'BINANCE', marketType: 'FUTURES',
            baseCurrency: 'USDT', paperInitialBalance: 1000 },
          symbolGroup: { symbols: ['BTCUSDT'], marketUniverse: {
            exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
          } },
        },
      };
      const closeByExitSignal = vi.fn(async () => ({ status: 'closed' as const }));
      const deps: any = {
        listOpenPositionsBySymbol: async () => [position],
        getStrategyConfigById: async () => ({
          close: { mode: 'advanced', tp: 99, sl: 99,
            tsl: [{ percent: -50, arm: 25 }, { percent: -25, arm: 12 }] },
          additional: { dcaEnabled: false, dcaSizingBasis: 'usdt_contribution_v1', dcaTimes: 0 },
        }),
        closeByExitSignal,
        resolveLifecyclePrice: ({ fallbackPrice }: { fallbackPrice: number }) => fallbackPrice,
        recordRuntimeEvent: vi.fn(async () => undefined), nowMs: () => Date.now(),
      };
      const send = (price: number) => new RuntimePositionAutomationService(deps).handleTickerEvent({
        type: 'ticker', exchange: 'BINANCE', marketType: 'FUTURES',
        symbol: 'BTCUSDT', eventTime: Date.now(), lastPrice: price,
        priceChangePercent24h: side === 'LONG' ? -40 : 40,
      });
      try {
        await seedLiveCache(mode, position);
        await send(prices[0]);
        expect((await runtimePositionStateStore.getPositionRuntimeState(position.id))
          ?.trailingLossActiveLevelIndex).toBe(0);
        await send(prices[1]);
        expect((await runtimePositionStateStore.getPositionRuntimeState(position.id))
          ?.trailingLossLimitPercent).toBeCloseTo(-0.68);
        await send(prices[2]);
        expect((await runtimePositionStateStore.getPositionRuntimeState(position.id))
          ?.trailingLossActiveLevelIndex).toBe(1);
        await send(prices[3]);
        expect(closeByExitSignal).toHaveBeenCalledWith(expect.objectContaining({
          reason: 'trailing_stop', markPrice: prices[3], mode,
        }));
      } finally {
        await runtimePositionStateStore.deletePositionRuntimeState(position.id);
      }
    });

  it.each([
    ['PAPER', 'LONG', [49, 57, 140, 130, 125], 32],
    ['PAPER', 'SHORT', [151, 143, 60, 65, 75], 168],
    ['LIVE', 'LONG', [49, 57, 140, 130, 125], 32],
    ['LIVE', 'SHORT', [151, 143, 60, 65, 75], 168],
  ] as const)('%s %s rebases an armed TSL after DCA and restores its second level',
    async (mode, side, prices, protectedPrice) => {
      const position: any = {
        id: `tsl-dca-${mode}-${side}`, userId: 'usdt-user', botId: 'usdt-bot',
        walletId: 'usdt-wallet', strategyId: 'usdt-strategy', symbol: 'BTCUSDT',
        side, entryPrice: 100, quantity: 1, leverage: 1, marginUsed: null,
        stopLoss: null, takeProfit: null, managementMode: 'BOT_MANAGED',
        origin: 'BOT', continuityState: 'CONFIRMED', status: 'OPEN',
        unrealizedPnl: null, lastExchangeSyncAt: null,
        bot: { walletId: 'usdt-wallet', liveOptIn: true,
          wallet: { mode, exchange: 'BINANCE', marketType: 'FUTURES',
            baseCurrency: 'USDT', paperInitialBalance: 1000 },
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
          close: { mode: 'advanced', tp: 99, sl: 99,
            tsl: [{ percent: -50, arm: 25 }, { percent: -25, arm: 12 }] },
          additional: { dcaEnabled: true, dcaSizingBasis: 'usdt_contribution_v1',
            dcaMode: 'advanced', dcaTimes: 1,
            dcaLevels: [{ percent: 40, multiplier: 1 }] },
        }),
        getCanonicalPositionState: async () => ({ quantity: position.quantity,
          averageEntryPrice: position.entryPrice }),
        getDurableDcaProgress: async () => ({ currentAdds: fills.length,
          lastDcaPrice: fills.at(-1), executedDcaLevelIndices: fills.map((_, index) => index) }),
        executeDca, closeByExitSignal,
        resolveLifecyclePrice: ({ fallbackPrice }: { fallbackPrice: number }) => fallbackPrice,
        recordRuntimeEvent: vi.fn(async () => undefined), nowMs: () => Date.now(),
      };
      const send = (price: number) => new RuntimePositionAutomationService(deps).handleTickerEvent({
        type: 'ticker', exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'BTCUSDT',
        eventTime: Date.now(), lastPrice: price, priceChangePercent24h: 40,
      });
      try {
        await seedLiveCache(mode, position);
        await send(prices[0]);
        await send(prices[1]);
        expect((await runtimePositionStateStore.getPositionRuntimeState(position.id))
          ?.trailingLossLimitPercent).toBeCloseTo(-0.68);
        await send(prices[2]);
        expect(fills).toEqual([prices[2]]);
        const filled = await runtimePositionStateStore.getPositionRuntimeState(position.id);
        expect(filled?.trailingLossActiveLevelIndex).toBe(0);
        expect(filled?.trailingLossLimitPercent).toBeCloseTo(side === 'LONG'
          ? protectedPrice / position.entryPrice - 1
          : 1 - protectedPrice / position.entryPrice);
        await send(prices[2]);
        expect((await runtimePositionStateStore.getPositionRuntimeState(position.id))
          ?.trailingLossActiveLevelIndex).toBe(1);
        await send(prices[3]);
        expect(closeByExitSignal).not.toHaveBeenCalled();
        await send(prices[4]);
        expect(closeByExitSignal).toHaveBeenCalledWith(expect.objectContaining({
          reason: 'trailing_stop', markPrice: prices[4], mode,
        }));
      } finally {
        await runtimePositionStateStore.deletePositionRuntimeState(position.id);
      }
    });

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

    await seedLiveCache(mode, position);
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
