import { afterEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { openOrder } from '../orders/orders.service';
import { finalizeRuntimeDcaFill } from './runtimeImmediateFillFinalizer.service';
import { runtimeExecutionDedupeService } from './runtimeExecutionDedupe.service';
import { runtimeTelemetryService } from './runtimeTelemetry.service';
import { executeRuntimeDca, RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { resolveRuntimeDcaOrderQuantity } from './runtimeDcaOrderRules';

vi.mock('../orders/orders.service', async (importOriginal) => ({
  ...await importOriginal<typeof import('../orders/orders.service')>(), openOrder: vi.fn(),
}));
vi.mock('./runtimeImmediateFillFinalizer.service', async (importOriginal) => ({
  ...await importOriginal<typeof import('./runtimeImmediateFillFinalizer.service')>(),
  finalizeRuntimeDcaFill: vi.fn(),
}));
vi.mock('../positions/runtimeOrderFeeSettlement', async (importOriginal) => ({
  ...await importOriginal<typeof import('../positions/runtimeOrderFeeSettlement')>(),
  settleRuntimeOrderFee: vi.fn(async () => undefined),
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.mocked(openOrder).mockReset();
  vi.mocked(finalizeRuntimeDcaFill).mockReset();
});

let sequence = 0;
const runIntegratedSequence = async (input: {
  mode: 'PAPER' | 'LIVE'; marketType: 'SPOT' | 'FUTURES'; dcaMode: 'basic' | 'advanced';
  minNotional?: number; fundsExhausted?: boolean; sl?: number; tp?: number;
  closeMode?: 'basic' | 'advanced'; ttp?: Array<{ percent: number; arm: number }>;
  dcaLevels?: Array<{ percent: number; multiplier: number }>;
}) => {
  const id = `precision-integration-${++sequence}`;
  const leverage = input.marketType === 'SPOT' ? 1 : 5;
  const position: any = {
    id, userId: 'user-1', botId: 'bot-1', walletId: 'wallet-1', strategyId: 'strategy-1',
    symbol: 'BTCUSDT', side: 'LONG', entryPrice: 1, quantity: leverage, leverage,
    marginUsed: null, stopLoss: null, takeProfit: null, managementMode: 'BOT_MANAGED',
    origin: 'BOT', continuityState: 'CONFIRMED', syncState: 'IN_SYNC', status: 'OPEN',
    unrealizedPnl: null, lastExchangeSyncAt: null,
    bot: {
      strategyId: 'strategy-1', walletId: 'wallet-1', isActive: true,
      liveOptIn: true, botMarketGroups: [],
      wallet: { mode: input.mode, exchange: 'BINANCE', marketType: input.marketType,
        baseCurrency: 'USDT', paperInitialBalance: 100 },
      symbolGroup: { symbols: ['BTCUSDT'], marketUniverse: {
        exchange: 'BINANCE', marketType: input.marketType, baseCurrency: 'USDT',
      } },
    },
  };
  const additional = {
    dcaEnabled: true, dcaSizingBasis: 'usdt_contribution_v1', dcaMode: input.dcaMode,
    dcaTimes: input.dcaMode === 'basic' ? 2 : 1,
    dcaLevels: input.dcaLevels ?? (input.dcaMode === 'basic'
      ? [{ percent: -30.5, multiplier: 2 }]
      : [{ percent: -20, multiplier: 1 }, { percent: -30, multiplier: 0.5 }]),
  };
  const config = { additional, close: { mode: input.closeMode,
    ...(input.sl == null ? {} : { sl: input.sl }),
    ...(input.tp == null ? {} : { tp: input.tp }),
    ...(input.ttp == null ? {} : { ttp: input.ttp }) } };
  vi.spyOn(prisma.position, 'findFirst').mockResolvedValue(position);
  vi.spyOn(prisma.strategy, 'findFirst').mockResolvedValue({ config, leverage } as any);
  vi.spyOn(prisma, '$transaction').mockImplementation(async (callback: any) => callback({}));
  vi.spyOn(runtimeTelemetryService, 'ensureRuntimeSession').mockResolvedValue('session-1');
  const acquire = vi.spyOn(runtimeExecutionDedupeService, 'acquire')
    .mockImplementation(async () => ({ outcome: 'execute', dedupeKey: `dedupe-${id}` } as any));
  const fills: Array<{ price: number; quantity: number; level: number }> = [];
  vi.mocked(openOrder).mockImplementation(async (_userId, order: any) => ({
    id: `order-${fills.length + 1}`, status: 'FILLED', quantity: order.quantity,
    filledQuantity: order.quantity, averageFillPrice: order.price, price: order.price,
    fee: 0, feePending: false, feeSource: 'EXCHANGE_FILL',
  } as any));
  vi.mocked(finalizeRuntimeDcaFill).mockImplementation(async (fill: any) => {
    const nextQuantity = position.quantity + fill.fillQuantity;
    const nextEntryPrice = (position.entryPrice * position.quantity
      + fill.fillPrice * fill.fillQuantity) / nextQuantity;
    fills.push({ price: fill.fillPrice, quantity: fill.fillQuantity, level: fills.length });
    position.quantity = nextQuantity;
    position.entryPrice = nextEntryPrice;
    return { applied: true, feePaid: 0, nextQuantity, nextEntryPrice,
      telemetryRecorded: input.mode === 'LIVE' } as any;
  });
  const resolveFundsExhausted = vi.fn(async () => Boolean(input.fundsExhausted));
  const executeDca = vi.fn((request: Parameters<typeof executeRuntimeDca>[0]) =>
    executeRuntimeDca(request, {
      getOrderRules: async () => ({ minAmount: 0.000001,
        minNotional: input.minNotional ?? 0.000001, amountPrecision: 6,
        contractSize: 1 }),
      resolveFundsExhausted,
    }));
  const closeByExitSignal = vi.fn(async () => ({ status: 'closed' as const }));
  const recordRuntimeEvent = vi.fn(async () => undefined);
  const deps: any = {
    listOpenPositionsBySymbol: async () => [position],
    getStrategyConfigById: async () => config,
    getCanonicalPositionState: async () => ({ quantity: position.quantity,
      averageEntryPrice: position.entryPrice }),
    getDurableDcaProgress: async () => ({ currentAdds: fills.length,
      lastDcaPrice: fills.at(-1)?.price,
      executedDcaLevelIndices: fills.map((fill) => fill.level) }),
    executeDca, resolveDcaFundsExhausted: vi.fn(async () => false),
    closeByExitSignal, recordRuntimeEvent,
    resolveLifecyclePrice: ({ fallbackPrice }: { fallbackPrice: number }) => fallbackPrice,
    nowMs: () => Date.now(),
  };
  const send = (price: number) => new RuntimePositionAutomationService(deps).handleTickerEvent({
    type: 'ticker', exchange: 'BINANCE', marketType: input.marketType,
    symbol: 'BTCUSDT', eventTime: Date.now(), lastPrice: price,
    priceChangePercent24h: -30,
  });
  return { position, fills, send, executeDca, closeByExitSignal,
    recordRuntimeEvent, resolveFundsExhausted, acquire };
};

describe('runtime DCA venue precision and filled contribution', () => {
  it('floors integer and fractional steps without exceeding the requested add', () => {
    const base = { quantity: 2.8776978417, markPrice: 0.695,
      marketType: 'SPOT' as const,
      rules: { minAmount: 0.01, minNotional: 0.01, amountPrecision: 0.05 } };
    expect(resolveRuntimeDcaOrderQuantity(base)).toBe(2.85);
    expect(resolveRuntimeDcaOrderQuantity({ ...base, rules: {
      ...base.rules, amountPrecision: 0,
    } })).toBe(2);
    expect(() => resolveRuntimeDcaOrderQuantity({ ...base, rules: {
      ...base.rules, minAmount: 3,
    } })).toThrowError(expect.objectContaining({ code: 'DCA_ORDER_RULES_INVALID' }));
  });

  it.each([
    ['PAPER', 'SPOT', 'basic'], ['PAPER', 'FUTURES', 'basic'],
    ['LIVE', 'SPOT', 'advanced'], ['LIVE', 'FUTURES', 'advanced'],
  ] as const)('%s %s %s sizes through order rules and actual fills after restart',
    async (mode, marketType, dcaMode) => {
      const run = await runIntegratedSequence({ mode, marketType, dcaMode });
      const leverage = run.position.leverage;
      const firstThreshold = dcaMode === 'basic' ? 0.305 : 0.20;
      const secondThreshold = dcaMode === 'basic' ? 0.305 : 0.30;
      await run.send(1 - firstThreshold / leverage);
      expect(run.fills).toHaveLength(1);
      expect(run.fills[0].quantity).toBe(Math.floor(run.fills[0].quantity * 1e6) / 1e6);
      expect(run.fills[0].price * run.fills[0].quantity / leverage)
        .toBeLessThanOrEqual(dcaMode === 'basic' ? 2 : 1);
      expect(run.position.entryPrice * run.position.quantity / leverage)
        .toBeCloseTo(dcaMode === 'basic' ? 3 : 2, 5);
      await run.send(run.fills[0].price);
      expect(run.fills).toHaveLength(1);
      await run.send(run.position.entryPrice * (1 - secondThreshold / leverage));
      expect(run.fills).toHaveLength(2);
      expect(run.position.entryPrice * run.position.quantity / leverage)
        .toBeCloseTo(dcaMode === 'basic' ? 9 : 3, 5);
      await run.send(run.fills[1].price);
      expect(run.fills).toHaveLength(2);
      expect(openOrder).toHaveBeenCalledTimes(2);
      expect(run.acquire).toHaveBeenCalledTimes(2);
      expect(run.resolveFundsExhausted).toHaveBeenCalledTimes(2);
    });

  it('fails closed when flooring makes the level too small for venue notional', async () => {
    const run = await runIntegratedSequence({ mode: 'PAPER', marketType: 'SPOT',
      dcaMode: 'basic', minNotional: 2, sl: 20 });
    await expect(run.send(0.695)).rejects.toMatchObject({ code: 'DCA_ORDER_RULES_INVALID' });
    expect(run.fills).toHaveLength(0);
    expect(run.acquire).not.toHaveBeenCalled();
    expect(openOrder).not.toHaveBeenCalled();
    expect(run.closeByExitSignal).not.toHaveBeenCalled();
    expect(run.recordRuntimeEvent).not.toHaveBeenCalledWith(expect.objectContaining({
      payload: expect.objectContaining({ reason: 'dca_funds_exhausted' }),
    }));
  });

  it('reports insufficient funds and closes by SL only after the reached DCA threshold', async () => {
    const run = await runIntegratedSequence({ mode: 'PAPER', marketType: 'SPOT',
      dcaMode: 'advanced', fundsExhausted: true, sl: 25 });
    await run.send(0.9);
    expect(run.executeDca).not.toHaveBeenCalled();
    expect(run.closeByExitSignal).not.toHaveBeenCalled();
    await run.send(0.8);
    expect(run.executeDca).toHaveBeenCalledTimes(1);
    expect(run.closeByExitSignal).not.toHaveBeenCalled();
    await run.send(0.7);
    expect(run.closeByExitSignal).toHaveBeenCalledWith(expect.objectContaining({
      reason: 'stop_loss', markPrice: 0.7,
    }));
    expect(run.recordRuntimeEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventType: 'PRETRADE_BLOCKED', payload: expect.objectContaining({
        reason: 'dca_funds_exhausted',
      }),
    }));
    expect(run.fills).toHaveLength(0);
    expect(openOrder).not.toHaveBeenCalled();
  });

  it.each(['PAPER', 'LIVE'] as const)('%s reports unfunded positive DCA without TP/TTP closure', async (mode) => {
    const tp = await runIntegratedSequence({ mode, marketType: 'FUTURES',
      dcaMode: 'advanced', dcaLevels: [{ percent: 20, multiplier: 1 }],
      fundsExhausted: true, tp: 10, sl: 90 });
    await tp.send(1.05);
    expect(tp.executeDca).toHaveBeenCalledTimes(1);
    expect(tp.closeByExitSignal).not.toHaveBeenCalled();
    expect(tp.recordRuntimeEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventType: 'PRETRADE_BLOCKED', payload: expect.objectContaining({
        reason: 'dca_funds_exhausted',
      }),
    }));

    const ttp = await runIntegratedSequence({ mode, marketType: 'FUTURES',
      dcaMode: 'advanced', dcaLevels: [{ percent: 20, multiplier: 1 }],
      fundsExhausted: true, closeMode: 'advanced', tp: 99, sl: 90,
      ttp: [{ percent: 10, arm: 5 }] });
    await ttp.send(1.06);
    await ttp.send(1.046);
    expect(ttp.executeDca).toHaveBeenCalledTimes(2);
    expect(ttp.closeByExitSignal).not.toHaveBeenCalled();
    expect(ttp.recordRuntimeEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventType: 'PRETRADE_BLOCKED', payload: expect.objectContaining({
        reason: 'dca_funds_exhausted',
      }),
    }));
  });

  it('keeps mixed USDT levels pending on profit and releases only crossed loss-side SL', async () => {
    const run = await runIntegratedSequence({ mode: 'PAPER', marketType: 'FUTURES',
      dcaMode: 'advanced', dcaLevels: [
        { percent: 20, multiplier: 1 }, { percent: -20, multiplier: 1 },
      ], fundsExhausted: true, tp: 10, sl: 25 });
    await run.send(1.05);
    expect(run.closeByExitSignal).not.toHaveBeenCalled();
    await run.send(0.94);
    expect(run.closeByExitSignal).toHaveBeenCalledWith(expect.objectContaining({
      reason: 'stop_loss', markPrice: 0.94,
    }));
    expect(run.fills).toHaveLength(0);
  });
});
