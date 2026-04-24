import { afterEach, describe, expect, it, vi } from 'vitest';
import { RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { runtimePositionStateStore } from './runtimePositionState.store';

afterEach(async () => {
  await runtimePositionStateStore.deletePositionRuntimeState('pos-replay-1');
});

const buildBotExecutionContext = (
  overrides?: Partial<{
    walletId: string | null;
    liveOptIn: boolean;
    wallet: Partial<{
      mode: 'PAPER' | 'LIVE';
      exchange: 'BINANCE' | 'BYBIT';
      marketType: 'FUTURES' | 'SPOT';
      baseCurrency: string;
      paperInitialBalance: number;
    }> | null;
    symbolGroup: {
      marketUniverse: Partial<{
        exchange: 'BINANCE' | 'BYBIT';
        marketType: 'FUTURES' | 'SPOT';
        baseCurrency: string;
      }> | null;
    } | null;
  }>
) => ({
  walletId: overrides?.walletId ?? 'wallet-1',
  liveOptIn: overrides?.liveOptIn ?? true,
  wallet:
    overrides?.wallet === null
      ? null
      : {
          mode: 'PAPER' as const,
          exchange: 'BINANCE' as const,
          marketType: 'FUTURES' as const,
          baseCurrency: 'USDT',
          paperInitialBalance: 10_000,
          ...overrides?.wallet,
        },
  symbolGroup:
    overrides?.symbolGroup === null
      ? null
      : {
          marketUniverse:
            overrides?.symbolGroup?.marketUniverse === null
              ? null
              : {
                  exchange: 'BINANCE' as const,
                  marketType: 'FUTURES' as const,
                  baseCurrency: 'USDT',
                  ...(overrides?.symbolGroup?.marketUniverse ?? {}),
                },
        },
});

describe('RuntimePositionAutomationService', () => {
  it('closes position when take-profit is hit', async () => {
    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-1',
          userId: 'user-1',
          botId: 'bot-1',
          strategyId: null,
          symbol: 'BTCUSDT',
          side: 'LONG' as const,
          entryPrice: 60_000,
          quantity: 0.5,
          leverage: 5,
          stopLoss: 58_000,
          takeProfit: 61_000,
          managementMode: 'BOT_MANAGED' as const,
          bot: buildBotExecutionContext(),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => null),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: true })),
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      eventTime: 1_000,
      lastPrice: 61_500,
      priceChangePercent24h: 1.6,
    });

    expect(deps.closeByExitSignal).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        botId: 'bot-1',
        symbol: 'BTCUSDT',
        mode: 'PAPER',
      })
    );
    expect(deps.executeDca).not.toHaveBeenCalled();
  });

  it('does not force close position when only DCA fallback config is active', async () => {
    process.env.RUNTIME_DCA_ENABLED = 'true';
    process.env.RUNTIME_DCA_MAX_ADDS = '2';
    process.env.RUNTIME_DCA_STEP_PERCENT = '0.01';
    process.env.RUNTIME_DCA_ADD_SIZE_FRACTION = '0.5';
    process.env.RUNTIME_TRAILING_ENABLED = 'false';

    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-2',
          userId: 'user-2',
          botId: null,
          strategyId: null,
          symbol: 'ETHUSDT',
          side: 'LONG' as const,
          entryPrice: 3000,
          quantity: 1,
          leverage: 5,
          stopLoss: null,
          takeProfit: null,
          managementMode: 'BOT_MANAGED' as const,
          bot: null,
        },
      ]),
      getStrategyConfigById: vi.fn(async () => null),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: true })),
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'ETHUSDT',
      eventTime: 2_000,
      lastPrice: 2950,
      priceChangePercent24h: -0.5,
    });

    expect(deps.closeByExitSignal).not.toHaveBeenCalled();
  });

  it('ignores ticker events when exchange or marketType does not match position context', async () => {
    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-mismatch',
          userId: 'user-mismatch',
          botId: 'bot-mismatch',
          strategyId: 'strat-mismatch',
          symbol: 'BTCUSDT',
          side: 'LONG' as const,
          entryPrice: 60_000,
          quantity: 0.5,
          leverage: 5,
          stopLoss: 58_000,
          takeProfit: 61_000,
          managementMode: 'BOT_MANAGED' as const,
          bot: buildBotExecutionContext({
            wallet: {
              mode: 'LIVE',
              exchange: 'BYBIT',
              marketType: 'SPOT',
            },
            symbolGroup: {
              marketUniverse: {
                exchange: 'BYBIT',
                marketType: 'SPOT',
              },
            },
          }),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => null),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: true })),
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      eventTime: 1_000,
      lastPrice: 61_500,
      priceChangePercent24h: 1.6,
    });

    expect(deps.getStrategyConfigById).not.toHaveBeenCalled();
    expect(deps.resolveDcaFundsExhausted).not.toHaveBeenCalled();
    expect(deps.executeDca).not.toHaveBeenCalled();
    expect(deps.closeByExitSignal).not.toHaveBeenCalled();
  });

  it('uses strategy config for management (without env switches)', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';
    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-3',
          userId: 'user-3',
          botId: 'bot-3',
          strategyId: 'strat-3',
          symbol: 'SOLUSDT',
          side: 'LONG' as const,
          entryPrice: 100,
          quantity: 1,
          leverage: 5,
          stopLoss: null,
          takeProfit: null,
          managementMode: 'BOT_MANAGED' as const,
          bot: buildBotExecutionContext({
            wallet: { mode: 'LIVE' },
          }),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => ({
        close: { tp: 2, sl: 3, ttp: [{ arm: 1.2, percent: 0.4 }], tsl: [] },
        additional: { dcaEnabled: true, dcaTimes: 2, dcaLevels: [{ percent: -1, multiplier: 1.5 }] },
      })),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: true })),
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'SOLUSDT',
      eventTime: 2_500,
      lastPrice: 98.8,
      priceChangePercent24h: -0.6,
    });

    expect(deps.getStrategyConfigById).toHaveBeenCalledWith('strat-3');
    expect(deps.executeDca).toHaveBeenCalledTimes(1);
    expect(deps.executeDca).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-3',
        botId: 'bot-3',
        strategyId: 'strat-3',
        symbol: 'SOLUSDT',
        positionSide: 'LONG',
        mode: 'LIVE',
      }),
    );
  });

  it('skips DCA add when runtime capital marks next DCA as unaffordable', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';

    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-3b',
          userId: 'user-3b',
          botId: 'bot-3b',
          strategyId: 'strat-3b',
          symbol: 'SOLUSDT',
          side: 'LONG' as const,
          entryPrice: 100,
          quantity: 1,
          leverage: 5,
          stopLoss: null,
          takeProfit: null,
          managementMode: 'BOT_MANAGED' as const,
          bot: buildBotExecutionContext({
            wallet: { paperInitialBalance: 1000 },
          }),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => ({
        close: { tp: 2, sl: 3, ttp: [{ arm: 1.2, percent: 0.4 }], tsl: [] },
        additional: { dcaEnabled: true, dcaTimes: 2, dcaLevels: [{ percent: -1, multiplier: 1.5 }] },
      })),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: true })),
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => true),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'SOLUSDT',
      eventTime: 2_500,
      lastPrice: 98.8,
      priceChangePercent24h: -0.6,
    });

    expect(deps.resolveDcaFundsExhausted).toHaveBeenCalledTimes(1);
    expect(deps.executeDca).not.toHaveBeenCalled();
  });

  it('respects advanced DCA levels even when dcaTimes is lower than levels length', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';

    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-4',
          userId: 'user-4',
          botId: 'bot-4',
          strategyId: 'strat-4',
          symbol: 'BTCUSDT',
          side: 'LONG' as const,
          entryPrice: 100,
          quantity: 1,
          leverage: 5,
          stopLoss: null,
          takeProfit: null,
          managementMode: 'BOT_MANAGED' as const,
          bot: buildBotExecutionContext(),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => ({
        close: { tp: 99, sl: 99, ttp: [], tsl: [] },
        additional: {
          dcaEnabled: true,
          dcaMode: 'advanced',
          dcaTimes: 1,
          dcaLevels: [
            { percent: -1, multiplier: 1 },
            { percent: -2, multiplier: 1 },
          ],
        },
      })),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: true })),
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      eventTime: 3_000,
      lastPrice: 98.5,
      priceChangePercent24h: -0.6,
    });
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      eventTime: 3_500,
      lastPrice: 97.5,
      priceChangePercent24h: -1.2,
    });

    expect(deps.executeDca).toHaveBeenCalledTimes(2);
    expect(deps.closeByExitSignal).not.toHaveBeenCalled();
  });

  it('restores canonical runtime state when completed DCA replay has no synthetic next-state payload', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';

    await runtimePositionStateStore.setPositionRuntimeState('pos-replay-1', {
      quantity: 1,
      averageEntryPrice: 100,
      currentAdds: 0,
      trailingAnchorPrice: 100,
    });

    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-replay-1',
          userId: 'user-replay-1',
          botId: 'bot-replay-1',
          strategyId: 'strat-replay-1',
          symbol: 'BTCUSDT',
          side: 'LONG' as const,
          entryPrice: 96,
          quantity: 3,
          leverage: 5,
          stopLoss: null,
          takeProfit: null,
          managementMode: 'BOT_MANAGED' as const,
          bot: buildBotExecutionContext({
            wallet: { mode: 'LIVE' },
          }),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => ({
        close: { tp: 99, sl: 99, ttp: [], tsl: [] },
        additional: {
          dcaEnabled: true,
          dcaMode: 'advanced',
          dcaTimes: 1,
          dcaLevels: [{ percent: -1, multiplier: 1.5 }],
        },
      })),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: true })),
      getCanonicalPositionState: vi.fn(async () => ({
        quantity: 3,
        averageEntryPrice: 96,
      })),
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      eventTime: 6_000,
      lastPrice: 98.8,
      priceChangePercent24h: -0.6,
    });

    expect(deps.executeDca).toHaveBeenCalledTimes(1);
    expect(deps.getCanonicalPositionState).toHaveBeenCalledWith('pos-replay-1');
    expect(service.getPositionStateSnapshot('pos-replay-1')).toMatchObject({
      quantity: 3,
      averageEntryPrice: 96,
      currentAdds: 1,
    });
  });

  it('respects close.mode=basic and ignores trailing close config', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';

    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-5',
          userId: 'user-5',
          botId: 'bot-5',
          strategyId: 'strat-5',
          symbol: 'ETHUSDT',
          side: 'LONG' as const,
          entryPrice: 100,
          quantity: 1,
          leverage: 3,
          stopLoss: null,
          takeProfit: null,
          managementMode: 'BOT_MANAGED' as const,
          bot: buildBotExecutionContext({
            wallet: { mode: 'LIVE' },
          }),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => ({
        close: {
          mode: 'basic',
          tp: 99,
          sl: 99,
          ttp: [{ arm: 1, percent: 0.2 }],
          tsl: [{ arm: 1, percent: 0.2 }],
        },
      })),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: true })),
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'ETHUSDT',
      eventTime: 4_000,
      lastPrice: 103,
      priceChangePercent24h: 1.1,
    });
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'ETHUSDT',
      eventTime: 4_500,
      lastPrice: 102.2,
      priceChangePercent24h: 0.8,
    });

    expect(deps.closeByExitSignal).not.toHaveBeenCalled();
  });

  it('respects close.mode=advanced and ignores TP/SL thresholds', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';

    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-6',
          userId: 'user-6',
          botId: 'bot-6',
          strategyId: 'strat-6',
          symbol: 'SOLUSDT',
          side: 'LONG' as const,
          entryPrice: 100,
          quantity: 1,
          leverage: 5,
          stopLoss: null,
          takeProfit: null,
          managementMode: 'BOT_MANAGED' as const,
          bot: buildBotExecutionContext({
            wallet: { mode: 'LIVE' },
          }),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => ({
        close: {
          mode: 'advanced',
          tp: 0.2,
          sl: 0.2,
          ttp: [],
          tsl: [],
        },
      })),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: true })),
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'SOLUSDT',
      eventTime: 5_000,
      lastPrice: 103,
      priceChangePercent24h: 1.1,
    });

    expect(deps.closeByExitSignal).not.toHaveBeenCalled();
  });

  it('uses manual position mode fallback only when bot mode is unavailable', async () => {
    process.env.RUNTIME_MANUAL_POSITION_MODE = 'PAPER';

    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-7',
          userId: 'user-7',
          botId: null,
          strategyId: null,
          symbol: 'BNBUSDT',
          side: 'LONG' as const,
          entryPrice: 600,
          quantity: 1,
          leverage: 3,
          stopLoss: 590,
          takeProfit: 605,
          managementMode: 'BOT_MANAGED' as const,
          bot: null,
        },
      ]),
      getStrategyConfigById: vi.fn(async () => null),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: true })),
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BNBUSDT',
      eventTime: 6_000,
      lastPrice: 606,
      priceChangePercent24h: 0.2,
    });

    expect(deps.closeByExitSignal).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: 'BNBUSDT',
        mode: 'PAPER',
      }),
    );
  });

  it('ignores MANUAL_MANAGED positions as an additional safeguard', async () => {
    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-8',
          userId: 'user-8',
          botId: 'bot-8',
          strategyId: null,
          symbol: 'XRPUSDT',
          side: 'LONG' as const,
          entryPrice: 1.0,
          quantity: 500,
          leverage: 2,
          stopLoss: 0.95,
          takeProfit: 1.05,
          managementMode: 'MANUAL_MANAGED' as const,
          bot: buildBotExecutionContext({
            wallet: { mode: 'LIVE' },
          }),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => null),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: true })),
      closeByExitSignal: vi.fn(async () => undefined),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'XRPUSDT',
      eventTime: 7_000,
      lastPrice: 1.06,
      priceChangePercent24h: 0.2,
    });

    expect(deps.getStrategyConfigById).not.toHaveBeenCalled();
    expect(deps.executeDca).not.toHaveBeenCalled();
    expect(deps.closeByExitSignal).not.toHaveBeenCalled();
  });

  it('skips automation for LIVE bot positions when live opt-in is disabled', async () => {
    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-live-optout',
          userId: 'user-live-optout',
          botId: 'bot-live-optout',
          strategyId: 'strat-live-optout',
          symbol: 'BTCUSDT',
          side: 'LONG' as const,
          entryPrice: 60_000,
          quantity: 0.5,
          leverage: 5,
          stopLoss: 58_000,
          takeProfit: 61_000,
          managementMode: 'BOT_MANAGED' as const,
          origin: 'BOT' as const,
          bot: buildBotExecutionContext({
            liveOptIn: false,
            wallet: { mode: 'LIVE' },
          }),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => null),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: true })),
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      eventTime: 10_000,
      lastPrice: 61_500,
      priceChangePercent24h: 1.6,
    });

    expect(deps.getStrategyConfigById).not.toHaveBeenCalled();
    expect(deps.resolveDcaFundsExhausted).not.toHaveBeenCalled();
    expect(deps.executeDca).not.toHaveBeenCalled();
    expect(deps.closeByExitSignal).not.toHaveBeenCalled();
  });

  it('skips automation for orphan BOT-origin positions without canonical bot context', async () => {
    process.env.RUNTIME_MANUAL_POSITION_MODE = 'PAPER';
    process.env.RUNTIME_MANUAL_POSITION_EXCHANGE = 'BINANCE';
    process.env.RUNTIME_MANUAL_POSITION_MARKET_TYPE = 'FUTURES';

    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-orphan-bot-origin',
          userId: 'user-orphan-bot-origin',
          botId: null,
          walletId: null,
          strategyId: null,
          symbol: 'ETHUSDT',
          side: 'LONG' as const,
          entryPrice: 3000,
          quantity: 1,
          leverage: 5,
          stopLoss: 2900,
          takeProfit: 3100,
          managementMode: 'BOT_MANAGED' as const,
          origin: 'BOT' as const,
          bot: null,
        },
      ]),
      getStrategyConfigById: vi.fn(async () => null),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: true })),
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'ETHUSDT',
      eventTime: 11_000,
      lastPrice: 3110,
      priceChangePercent24h: 0.7,
    });

    expect(deps.getStrategyConfigById).not.toHaveBeenCalled();
    expect(deps.resolveDcaFundsExhausted).not.toHaveBeenCalled();
    expect(deps.executeDca).not.toHaveBeenCalled();
    expect(deps.closeByExitSignal).not.toHaveBeenCalled();
  });

  it('keeps monitoring flow alive when close signal is only submitted', async () => {
    const closeByExitSignal = vi.fn(async () => ({ status: 'submitted' as const }));
    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-9',
          userId: 'user-9',
          botId: 'bot-9',
          strategyId: null,
          symbol: 'BTCUSDT',
          side: 'LONG' as const,
          entryPrice: 60_000,
          quantity: 0.5,
          leverage: 5,
          stopLoss: 58_000,
          takeProfit: 61_000,
          managementMode: 'BOT_MANAGED' as const,
          bot: buildBotExecutionContext({
            wallet: {
              mode: 'LIVE',
              exchange: 'BYBIT',
              marketType: 'FUTURES',
            },
            symbolGroup: {
              marketUniverse: {
                exchange: 'BYBIT',
                marketType: 'FUTURES',
              },
            },
          }),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => null),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: true })),
      closeByExitSignal,
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BYBIT',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      eventTime: 8_000,
      lastPrice: 61_500,
      priceChangePercent24h: 1.6,
    } as any);

    expect(closeByExitSignal).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: 'BTCUSDT',
        mode: 'LIVE',
      })
    );
  });

  it('does not advance local DCA state when exchange order is only submitted', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';

    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-submitted-dca',
          userId: 'user-dca',
          botId: 'bot-dca',
          strategyId: 'strat-dca',
          symbol: 'SOLUSDT',
          side: 'LONG' as const,
          entryPrice: 100,
          quantity: 1,
          leverage: 5,
          stopLoss: null,
          takeProfit: null,
          managementMode: 'BOT_MANAGED' as const,
          bot: buildBotExecutionContext({
            wallet: { mode: 'LIVE' },
          }),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => ({
        close: { tp: 2, sl: 3, ttp: [], tsl: [] },
        additional: { dcaEnabled: true, dcaTimes: 2, dcaLevels: [{ percent: -1, multiplier: 1.5 }] },
      })),
      executeDca: vi.fn(async () => ({ feePaid: 0, executed: false })),
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'SOLUSDT',
      eventTime: 9_000,
      lastPrice: 98.8,
      priceChangePercent24h: -0.6,
    });

    expect(service.getPositionStateSnapshot('pos-submitted-dca')).toEqual(
      expect.objectContaining({
        quantity: 1,
        averageEntryPrice: 100,
        currentAdds: 0,
      })
    );
  });

  it('stores executed DCA state using canonical fill-derived quantity and price', async () => {
    process.env.RUNTIME_TRAILING_ENABLED = 'false';
    process.env.RUNTIME_DCA_ENABLED = 'false';

    const deps: any = {
      listOpenPositionsBySymbol: vi.fn(async () => [
        {
          id: 'pos-filled-dca',
          userId: 'user-filled-dca',
          botId: 'bot-filled-dca',
          strategyId: 'strat-filled-dca',
          symbol: 'SOLUSDT',
          side: 'LONG' as const,
          entryPrice: 100,
          quantity: 1,
          leverage: 5,
          stopLoss: null,
          takeProfit: null,
          managementMode: 'BOT_MANAGED' as const,
          bot: buildBotExecutionContext({
            wallet: { mode: 'LIVE' },
          }),
        },
      ]),
      getStrategyConfigById: vi.fn(async () => ({
        close: { tp: 2, sl: 3, ttp: [], tsl: [] },
        additional: { dcaEnabled: true, dcaTimes: 2, dcaLevels: [{ percent: -1, multiplier: 1.5 }] },
      })),
      executeDca: vi.fn(async () => ({
        feePaid: 0.25,
        executed: true,
        nextQuantity: 2.5,
        nextEntryPrice: 99.25,
      })),
      closeByExitSignal: vi.fn(async () => ({ status: 'closed' as const })),
      resolveDcaFundsExhausted: vi.fn(async () => false),
      nowMs: vi.fn(() => Date.now()),
    };

    const service = new RuntimePositionAutomationService(deps);
    await service.handleTickerEvent({
      type: 'ticker',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'SOLUSDT',
      eventTime: 9_500,
      lastPrice: 98.8,
      priceChangePercent24h: -0.6,
    });

    expect(service.getPositionStateSnapshot('pos-filled-dca')).toEqual(
      expect.objectContaining({
        quantity: 2.5,
        averageEntryPrice: 99.25,
        currentAdds: 1,
      })
    );
  });
});

