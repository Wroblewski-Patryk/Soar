import { createHash } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { createEntitledUser } from '../../test/createEntitledUser';
import { setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { orchestrateRuntimeSignal } from './executionOrchestrator.service';
import { processRuntimeFinalCandleDecision } from './runtimeFinalCandleDecision.service';
import { executeRuntimeDca, RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { loadDurableDcaProgress } from './runtimeDurableDcaProgress';
import { runtimePositionStateStore } from './runtimePositionState.store';

// Both stages use the real internal LIVE intent/order/fill path. Only the venue
// response is synthetic; every other exchange or network path is a tripwire.
const venue = vi.hoisted(() => ({ submits: [] as string[], lookups: [] as string[] }));
vi.mock('../exchange/exchangeAdapterBoundary.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../exchange/exchangeAdapterBoundary.service')>();
  const unexpected = async () => { throw new Error('unexpected real exchange transport'); };
  return { ...actual, submitLiveOrderThroughBoundary: unexpected,
    lookupLiveOrderThroughBoundary: unexpected,
    cancelLiveOrderThroughBoundary: unexpected,
    fetchSupportedExchangePositionsRaw: unexpected,
    fetchSupportedExchangeOpenOrdersRaw: unexpected,
    fetchSupportedExchangeTradeHistoryRaw: unexpected,
    fetchSupportedExchangeWalletCashflowHistoryRaw: unexpected,
    fetchSupportedExchangeBalanceRaw: unexpected };
});
vi.mock('../exchange/exchangeConnectorFactory.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../exchange/exchangeConnectorFactory.service')>();
  return { ...actual, createPublicExchangeConnector: () => {
    throw new Error('unexpected public exchange transport');
  } };
});
vi.mock('../orders/orders.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../orders/orders.service')>();
  return { ...actual,
    openOrder: (userId: string, payload: Parameters<typeof actual.openOrder>[1]) =>
      actual.openOrder(userId, payload, {
        executeLiveOrder: async ({ payload: order }) => {
          const id = order.clientOrderId;
          if (!id || order.mode !== 'LIVE' || !order.price || order.quantity <= 0) {
            throw new Error('internal LIVE fixture requires an identified priced order');
          }
          if (venue.submits.includes(id)) throw new Error('duplicate venue submit');
          venue.submits.push(id);
          const hash = createHash('sha256').update(id).digest('hex').slice(0, 20);
          const exchangeOrderId = `mock-binance-spot-${hash}`;
          const exchangeTradeId = `mock-fill-${hash}`;
          const notional = order.price * order.quantity;
          const fee = notional * 0.0004;
          return { exchangeOrderId, status: 'FILLED' as const,
            exchangeFilledQuantity: order.quantity, exchangeAverageFillPrice: order.price,
            fee, feeSource: 'EXCHANGE_FILL' as const, feePending: false,
            feeCurrency: 'USDT', exchangeTradeId,
            fills: [{ exchangeTradeId, exchangeOrderId, symbol: order.symbol,
              side: order.side, price: order.price, quantity: order.quantity,
              notional, feeCost: fee, feeCurrency: 'USDT', feeRate: 0.0004,
              executedAt: new Date(), source: 'createOrder' as const, raw: { fixture: true } }],
          };
        },
        lookupLiveOrder: async ({ payload: order }) => {
          venue.lookups.push(order.clientOrderId ?? '');
          throw new Error('unexpected venue lookup after confirmed fill');
        },
      }),
  };
});

const run = process.env.RUN_BINANCE_SPOT_DCA_TP_INTERNAL_MOCK_LIVE === '1';
const stage = process.env.BINANCE_SPOT_DCA_TP_INTERNAL_MOCK_LIVE_STAGE;
if (run && stage !== 'open' && stage !== 'resume') {
  throw new Error('008E requires an open or resume stage');
}
const openIt = run && stage === 'open' ? it : it.skip;
const resumeIt = run && stage === 'resume' ? it : it.skip;
const email = 'binance-spot-dca-tp-internal-live@example.test';
const symbol = 'BTCUSDT';
const prices = { entry: 1, firstDca: 0.6949, secondDca: 0.5375, tp: 0.73 };
// Synthetic SPOT base-asset units with an explicit 0.01 BTC quantity step.
const spotRules = { minAmount: 0.01, minNotional: 0.5, amountPrecision: 0.01,
  amountPrecisionMode: 'TICK_SIZE' as const, contractSize: null };
const strategyConfig = {
  open: { direction: 'long', noMatchAction: 'EXIT' },
  close: { mode: 'basic', tp: 20, sl: 20 },
  additional: { orderType: 'MARKET', marginMode: 'ISOLATED',
    dcaEnabled: true, dcaMode: 'basic', dcaSizingBasis: 'usdt_contribution_v1',
    dcaTimes: 2, dcaLevels: [{ percent: -30.5, multiplier: 2 }] },
};

const assertIsolated = () => {
  const database = new URL(process.env.DATABASE_URL ?? '');
  const testDatabase = new URL(process.env.TEST_DATABASE_URL ?? '');
  const redis = new URL(process.env.REDIS_URL ?? '');
  if (database.hostname !== '127.0.0.1' || database.port === '' || database.port === '5432' ||
      decodeURIComponent(database.pathname) !== '/soar_position_cycle_008e_test' ||
      testDatabase.href !== database.href ||
      redis.hostname !== '127.0.0.1' || redis.port === '' || redis.port === '6379' ||
      process.env.NODE_ENV !== 'test' || !['open', 'resume'].includes(stage ?? '')) {
    throw new Error('008E requires its own local _test database, Redis, and stage');
  }
};

const createAutomation = () => new RuntimePositionAutomationService({
  getCanonicalPositionState: async (id) => {
    const position = await prisma.position.findUnique({ where: { id } });
    return position ? { quantity: position.quantity, averageEntryPrice: position.entryPrice } : null;
  },
  getDurableDcaProgress: (input) => loadDurableDcaProgress(input),
  executeDca: (input) => executeRuntimeDca(input, {
    getOrderRules: async () => spotRules,
    resolveFundsExhausted: async () => false,
  }),
  resolveLifecyclePrice: ({ fallbackPrice }) => fallbackPrice,
});
const tick = (service: RuntimePositionAutomationService, price: number, at: number) =>
  service.handleTickerEvent({ type: 'ticker', exchange: 'BINANCE', marketType: 'SPOT',
    symbol, eventTime: at, lastPrice: price, priceChangePercent24h: 0 });

const readCycle = async (botId: string, positionId: string, actions: string[]) => {
  const position = await prisma.position.findUniqueOrThrow({ where: { id: positionId } });
  const orders = await prisma.order.findMany({ where: { positionId }, orderBy: { createdAt: 'asc' } });
  const trades = await prisma.trade.findMany({ where: { positionId }, orderBy: { executedAt: 'asc' } });
  const intents = await prisma.liveOrderIntent.findMany({ where: {
    id: { in: orders.map((order) => order.id) },
  } });
  const fills = await prisma.orderFill.findMany({ where: { orderId: { in: orders.map((order) => order.id) } } });
  expect(trades.map((trade) => trade.lifecycleAction)).toEqual(actions);
  expect(orders).toHaveLength(actions.length);
  expect(intents).toHaveLength(actions.length);
  expect(fills).toHaveLength(actions.length);
  expect(orders.every((order) => order.botId === botId && order.status === 'FILLED' &&
    order.exchangeOrderId && order.feeSource === 'EXCHANGE_FILL' && !order.feePending)).toBe(true);
  expect(new Set(intents.map((intent) => intent.clientOrderId)).size).toBe(actions.length);
  for (const intent of intents) {
    const hash = createHash('sha256').update(intent.clientOrderId).digest('hex').slice(0, 20);
    const order = orders.find((candidate) => candidate.id === intent.id);
    const fill = fills.find((candidate) => candidate.orderId === intent.id);
    expect(intent).toMatchObject({ exchange: 'BINANCE', marketType: 'SPOT' });
    expect(intent.apiKeyCredentialVersion).toBeGreaterThan(0);
    expect(order?.exchangeOrderId).toBe(`mock-binance-spot-${hash}`);
    expect(fill?.exchangeTradeId).toBe(`mock-fill-${hash}`);
    expect(fill?.quantity).toBeCloseTo(order?.filledQuantity ?? NaN, 7);
    expect(fill?.notional).toBeCloseTo((fill?.price ?? NaN) * (fill?.quantity ?? NaN), 7);
    expect(fill?.feeCost).toBeCloseTo((fill?.notional ?? NaN) * 0.0004, 7);
    expect(order?.fee).toBeCloseTo(fill?.feeCost ?? NaN, 7);
  }
  for (const trade of trades) {
    const order = orders.find((candidate) => candidate.id === trade.orderId);
    expect(order?.filledQuantity).toBeCloseTo(trade.quantity, 7);
    expect(order?.averageFillPrice).toBeCloseTo(trade.price, 7);
    expect(trade.fee).toBeCloseTo(trade.price * trade.quantity * 0.0004, 7);
  }
  return { position, orders, trades, intents, fills };
};

describe('SOAR-POSITION-CYCLE-008E Binance Spot DCA to TP internal mock LIVE', () => {
  openIt('persists entry, no-signal HOLD and two SPOT DCA fills', async () => {
    assertIsolated();
    vi.stubGlobal('fetch', async () => { throw new Error('unexpected network transport'); });
    if (await prisma.user.count() !== 0) throw new Error('dedicated proof database must start empty');
    const previousEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const user = await createEntitledUser({ data: { email, password: 'test-only-hash' } });
      await setActiveSubscriptionForUser(prisma, { userId: user.id,
        planCode: 'PROFESSIONAL', source: 'ADMIN_OVERRIDE',
        metadata: { reason: 'isolated-008e-proof' } });
      const key = await prisma.apiKey.create({ data: { userId: user.id, label: 'local fake only',
        exchange: 'BINANCE', apiKey: 'local-fake-only', apiSecret: 'local-fake-only' } });
      const strategy = await prisma.strategy.create({ data: { userId: user.id,
        name: '008E DCA TP', interval: '1m', leverage: 1, walletRisk: 10,
        config: strategyConfig } });
      const wallet = await prisma.wallet.create({ data: { userId: user.id,
        name: 'local mock LIVE', mode: 'LIVE', exchange: 'BINANCE', marketType: 'SPOT',
        baseCurrency: 'USDT' } });
      const universe = await prisma.marketUniverse.create({ data: { userId: user.id,
        name: 'one Binance Spot market', exchange: 'BINANCE', marketType: 'SPOT',
        baseCurrency: 'USDT', whitelist: [symbol], blacklist: [] } });
      const group = await prisma.symbolGroup.create({ data: { userId: user.id,
        marketUniverseId: universe.id, name: 'one BTCUSDT group', symbols: [symbol] } });
      const bot = await prisma.bot.create({ data: { userId: user.id,
        name: '008E internal LIVE bot', mode: 'LIVE', exchange: 'BINANCE',
        marketType: 'SPOT', positionMode: 'ONE_WAY', apiKeyId: key.id,
        isActive: true, liveOptIn: true, consentTextVersion: 'mvp-v1',
        maxOpenPositions: 1, walletId: wallet.id, strategyId: strategy.id,
        symbolGroupId: group.id } });
      const assignment = await prisma.botMarketGroup.create({ data: { userId: user.id,
        botId: bot.id, symbolGroupId: group.id, lifecycleStatus: 'ACTIVE',
        executionOrder: 1, maxOpenPositions: 1, isEnabled: true } });
      await prisma.marketGroupStrategyLink.create({ data: { userId: user.id,
        botId: bot.id, botMarketGroupId: assignment.id, strategyId: strategy.id } });
      const session = await prisma.botRuntimeSession.create({ data: {
        userId: user.id, botId: bot.id, mode: 'LIVE',
        metadata: { proofOpenPid: process.pid } } });
      const entry = await orchestrateRuntimeSignal({ userId: user.id, botId: bot.id,
        walletId: wallet.id, botMarketGroupId: assignment.id, strategyId: strategy.id,
        strategyLeverage: 1, strategyInterval: '1m', runtimeSessionId: session.id,
        symbol, direction: 'LONG', quantity: 1, markPrice: prices.entry, mode: 'LIVE',
        candleOpenTime: 1_000, candleCloseTime: 60_999 });
      expect(entry.status).toBe('opened');
      if (entry.status !== 'opened') throw new Error('entry did not fill');
      const noSignalCreate = vi.fn(async () => undefined);
      const noSignalOrchestrate = vi.fn(async () => entry);
      const routeBot = { id: bot.id, userId: user.id, mode: 'LIVE',
        exchange: 'BINANCE', marketType: 'SPOT', walletId: wallet.id,
        runtimeContext: { symbolGroupId: group.id, strategyId: strategy.id,
          maxOpenPositions: 1, symbols: [symbol], strategy: {
            strategyId: strategy.id, strategyInterval: '1m', strategyLeverage: 1,
            walletRisk: 10, strategyConfig, priority: 1, weight: 1,
          } } };
      const candleAt = Date.now();
      await processRuntimeFinalCandleDecision({ type: 'candle', exchange: 'BINANCE',
        marketType: 'SPOT', symbol, interval: '1m', eventTime: candleAt + 59_999,
        openTime: candleAt, closeTime: candleAt + 59_999, open: 1, high: 1,
        low: 1, close: 1, volume: 1_000, isFinal: true }, {
        nowMs: Date.now, minDirectionalScore: 1, runtimeSignalQuantity: 1,
        signalDecisionDedupeRetentionMs: 21_600_000,
        processedDecisionWindows: new Map(),
        listActiveBotsFromTopologyCacheWithMetrics: async () => [routeBot],
        listRuntimeManagedExternalPositions: async () => [],
        resolveRuntimeRoutesForEvent: () => [{ bot: routeBot }],
        ensureRuntimeSession: async () => session.id,
        countOpenPositionsForBotAndSymbols: async () => prisma.position.count({ where: {
          botId: bot.id, status: 'OPEN', symbol } }),
        analyzePreTradeFn: async () => ({ allowed: true, reasons: [], metrics: {} }),
        createSignal: noSignalCreate,
        evaluateStrategy: () => ({ direction: null, conditionLines: [], indicatorSummary: null }),
        orchestrateFn: noSignalOrchestrate,
      } as unknown as Parameters<typeof processRuntimeFinalCandleDecision>[1]);
      expect(noSignalCreate).not.toHaveBeenCalled();
      expect(noSignalOrchestrate).not.toHaveBeenCalled();
      expect(await prisma.position.count({ where: { id: entry.positionId, status: 'OPEN' } })).toBe(1);
      const rejectedInput = { userId: user.id, botId: bot.id, walletId: wallet.id,
        strategyId: strategy.id, positionId: entry.positionId, symbol,
        positionSide: 'LONG' as const, dcaLevelIndex: 0, markPrice: prices.firstDca,
        mode: 'LIVE' as const, addedQuantity: 2 / prices.firstDca,
        currentQuantity: 1, currentEntryPrice: prices.entry };
      for (const rules of [
        { ...spotRules, minNotional: 100 },
        { ...spotRules, minAmount: 100 },
        { ...spotRules, amountPrecisionMode: null },
      ]) {
        await expect(executeRuntimeDca(rejectedInput, { getOrderRules: async () => rules,
          resolveFundsExhausted: async () => false }))
          .rejects.toMatchObject({ code: 'DCA_ORDER_RULES_INVALID' });
        expect(venue.submits).toHaveLength(1);
        expect(await prisma.liveOrderIntent.count({ where: { userId: user.id } })).toBe(1);
        expect(await prisma.order.count({ where: { userId: user.id } })).toBe(1);
      }
      const automation = createAutomation();
      await tick(automation, prices.firstDca, 120_000);
      await tick(automation, prices.firstDca, 180_000);
      const first = await readCycle(bot.id, entry.positionId, ['OPEN', 'DCA']);
      expect(first.position.status).toBe('OPEN');
      const entryFill = first.fills.find((fill) => fill.orderId === first.trades[0]?.orderId);
      const firstDcaFill = first.fills.find((fill) => fill.orderId === first.trades[1]?.orderId);
      expect(entryFill?.notional).toBe(1); // SPOT contribution is quote spent, without leverage.
      const firstTargetQuote = entryFill!.notional * 2;
      expect(firstTargetQuote).toBe(2);
      const firstQuantity = Number((Math.floor(firstTargetQuote / prices.firstDca
        / spotRules.amountPrecision + 1e-10) * spotRules.amountPrecision).toPrecision(15));
      expect(firstDcaFill?.quantity).toBe(firstQuantity);
      expect(firstDcaFill?.notional).toBeCloseTo(firstQuantity * prices.firstDca, 9);
      expect(firstDcaFill!.notional).toBeGreaterThanOrEqual(spotRules.minNotional);
      expect(firstDcaFill!.notional).toBeLessThanOrEqual(firstTargetQuote);
      expect(firstTargetQuote - firstDcaFill!.notional)
        .toBeLessThan(prices.firstDca * spotRules.amountPrecision);
      expect(firstDcaFill!.notional).toBeCloseTo(1.994363, 9);
      const firstBookQuote = entryFill!.notional + firstDcaFill!.notional;
      const firstBookQuantity = entryFill!.quantity + firstDcaFill!.quantity;
      expect(first.position.quantity).toBeCloseTo(firstBookQuantity, 9);
      expect(first.position.entryPrice).toBeCloseTo(firstBookQuote / firstBookQuantity, 9);
      expect(prices.secondDca).toBeLessThan(first.position.entryPrice * (1 - 0.305));
      await tick(automation, prices.secondDca, 240_000);
      await tick(automation, prices.secondDca, 300_000);
      const cycle = await readCycle(bot.id, entry.positionId, ['OPEN', 'DCA', 'DCA']);
      expect(cycle.position.status).toBe('OPEN');
      const secondDcaFill = cycle.fills.find((fill) => fill.orderId === cycle.trades[2]?.orderId);
      const idealSecondTargetQuote = (entryFill!.notional + firstTargetQuote) * 2;
      expect(idealSecondTargetQuote).toBe(6);
      const secondTargetQuote = firstBookQuote * 2;
      expect(secondTargetQuote).toBeCloseTo(5.988726, 9);
      expect(secondTargetQuote).toBeCloseTo(idealSecondTargetQuote
        - 2 * (firstTargetQuote - firstDcaFill!.notional), 9);
      const secondQuantity = Number((Math.floor(secondTargetQuote / prices.secondDca
        / spotRules.amountPrecision + 1e-10) * spotRules.amountPrecision).toPrecision(15));
      expect(secondDcaFill?.quantity).toBe(secondQuantity);
      expect(secondDcaFill?.notional).toBeCloseTo(secondQuantity * prices.secondDca, 9);
      expect(secondDcaFill!.notional).toBeGreaterThanOrEqual(spotRules.minNotional);
      expect(secondDcaFill!.notional).toBeLessThanOrEqual(secondTargetQuote);
      expect(secondTargetQuote - secondDcaFill!.notional)
        .toBeLessThan(prices.secondDca * spotRules.amountPrecision);
      expect(secondDcaFill!.notional).toBeCloseTo(5.98775, 9);
      const quantity = cycle.fills.reduce((sum, fill) => sum + fill.quantity, 0);
      const average = cycle.fills.reduce((sum, fill) => sum + fill.price * fill.quantity, 0) / quantity;
      expect(quantity).toBeCloseTo(1 + firstQuantity + secondQuantity, 9);
      expect(cycle.position.quantity).toBeCloseTo(quantity, 9);
      expect(cycle.position.entryPrice).toBeCloseTo(average, 9);
      expect(await runtimePositionStateStore.getTrustedPositionRuntimeState(entry.positionId))
        .toMatchObject({ currentAdds: 2 });
      expect(venue.submits).toHaveLength(3);
      expect(venue.lookups).toHaveLength(0);
    } finally {
      process.env.NODE_ENV = previousEnv;
      vi.unstubAllGlobals();
    }
  }, 60_000);

  resumeIt('rebuilds, replays DCA, closes once at TP from the filled average', async () => {
    assertIsolated();
    vi.stubGlobal('fetch', async () => { throw new Error('unexpected network transport'); });
    const previousEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const user = await prisma.user.findUniqueOrThrow({ where: { email } });
      const bot = await prisma.bot.findFirstOrThrow({ where: { userId: user.id } });
      const openingSession = await prisma.botRuntimeSession.findFirstOrThrow({
        where: { botId: bot.id }, orderBy: { startedAt: 'asc' },
      });
      expect((openingSession.metadata as { proofOpenPid?: number } | null)?.proofOpenPid)
        .not.toBe(process.pid);
      const position = await prisma.position.findFirstOrThrow({ where: { botId: bot.id,
        status: 'OPEN' } });
      const before = await readCycle(bot.id, position.id, ['OPEN', 'DCA', 'DCA']);
      const rebuilt = createAutomation();
      expect(await runtimePositionStateStore.getTrustedPositionRuntimeState(position.id))
        .toMatchObject({ currentAdds: 2 });
      await tick(rebuilt, prices.secondDca, 300_000);
      expect(venue.submits).toHaveLength(0);
      await readCycle(bot.id, position.id, ['OPEN', 'DCA', 'DCA']);
      const confirmedAverage = before.fills.reduce((sum, fill) => sum + fill.price * fill.quantity, 0)
        / before.fills.reduce((sum, fill) => sum + fill.quantity, 0);
      expect(position.entryPrice).toBeCloseTo(confirmedAverage, 7);
      expect(prices.tp).toBeGreaterThan(confirmedAverage * (1 + 0.20));
      await tick(rebuilt, prices.tp, 360_000);
      const closed = await readCycle(bot.id, position.id, ['OPEN', 'DCA', 'DCA', 'CLOSE']);
      expect(closed.position).toMatchObject({ status: 'CLOSED', closeReason: 'TP',
        closeInitiator: 'BOT_APP' });
      const closeTrade = closed.trades.find((trade) => trade.lifecycleAction === 'CLOSE');
      expect(closeTrade).toMatchObject({ closeReason: 'TP', closeInitiator: 'BOT_APP' });
      const closeFills = closed.fills.filter((fill) => fill.orderId === closeTrade?.orderId);
      const entryFills = closed.fills.filter((fill) => fill.orderId !== closeTrade?.orderId);
      expect(closeFills).toHaveLength(1);
      expect(entryFills).toHaveLength(3);
      const entryQuantity = entryFills.reduce((sum, fill) => sum + fill.quantity, 0);
      expect(closeFills[0]?.quantity).toBeCloseTo(entryQuantity, 7);
      const entryNotional = entryFills.reduce((sum, fill) => sum + fill.notional, 0);
      const closeNotional = closeFills.reduce((sum, fill) => sum + fill.notional, 0);
      const allFees = closed.fills.reduce((sum, fill) => sum + (fill.feeCost ?? NaN), 0);
      const expectedNetPnl = closeNotional - entryNotional - allFees;
      expect(closeTrade?.realizedPnl).toBeCloseTo(expectedNetPnl, 6);
      expect(closed.position.realizedPnl).toBeCloseTo(expectedNetPnl, 6);
      expect(expectedNetPnl).toBeGreaterThan(0);
      expect(venue.submits).toHaveLength(1);
      await tick(rebuilt, prices.tp, 360_000);
      await tick(createAutomation(), prices.tp, 420_000);
      await readCycle(bot.id, position.id, ['OPEN', 'DCA', 'DCA', 'CLOSE']);
      expect(venue.submits).toHaveLength(1);
      expect(venue.lookups).toHaveLength(0);
    } finally {
      process.env.NODE_ENV = previousEnv;
      vi.unstubAllGlobals();
    }
  }, 60_000);
});
