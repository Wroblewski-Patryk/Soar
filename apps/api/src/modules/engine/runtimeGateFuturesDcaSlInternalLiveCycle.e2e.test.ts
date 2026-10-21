import { createHash } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { createEntitledUser } from '../../test/createEntitledUser';
import { setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { orchestrateRuntimeSignal } from './executionOrchestrator.service';
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
          const exchangeOrderId = `mock-gateio-futures-${hash}`;
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

const run = process.env.RUN_GATEIO_FUTURES_DCA_SL_INTERNAL_MOCK_LIVE === '1';
const stage = process.env.GATEIO_FUTURES_DCA_SL_INTERNAL_MOCK_LIVE_STAGE;
if (run && stage !== 'open' && stage !== 'resume') {
  throw new Error('008D requires an open or resume stage');
}
const openIt = run && stage === 'open' ? it : it.skip;
const resumeIt = run && stage === 'resume' ? it : it.skip;
const email = 'gateio-futures-dca-sl-internal-live@example.test';
const symbol = 'BTCUSDT';
const prices = { entry: 1, firstDca: 0.99692, secondDca: 0.99488, sl: 0.99375 };
// Executable synthetic unit contracts; this does not describe any real Gate market.
const compatibleGateRules = {
  minAmount: 1, minNotional: 5, amountPrecision: 1,
  amountPrecisionMode: 'TICK_SIZE' as const, contractSize: 1,
};
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
      decodeURIComponent(database.pathname) !== '/soar_position_cycle_008d_test' ||
      testDatabase.href !== database.href ||
      redis.hostname !== '127.0.0.1' || redis.port === '' || redis.port === '6379' ||
      process.env.NODE_ENV !== 'test' || !['open', 'resume'].includes(stage ?? '')) {
    throw new Error('008D requires its own local _test database, Redis, and stage');
  }
};

const createAutomation = () => new RuntimePositionAutomationService({
  getCanonicalPositionState: async (id) => {
    const position = await prisma.position.findUnique({ where: { id } });
    return position ? { quantity: position.quantity, averageEntryPrice: position.entryPrice } : null;
  },
  getDurableDcaProgress: (input) => loadDurableDcaProgress(input),
  executeDca: (input) => executeRuntimeDca(input, {
    getOrderRules: async () => compatibleGateRules,
    resolveFundsExhausted: async () => false,
  }),
  resolveLifecyclePrice: ({ fallbackPrice }) => fallbackPrice,
});
const tick = (service: RuntimePositionAutomationService, price: number, at: number) =>
  service.handleTickerEvent({ type: 'ticker', exchange: 'GATEIO', marketType: 'FUTURES',
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
    expect(intent).toMatchObject({ exchange: 'GATEIO', marketType: 'FUTURES' });
    expect(intent.clientOrderId).toMatch(/^soar_[A-Za-z0-9_-]{22}$/);
    expect(intent.apiKeyCredentialVersion).toBeGreaterThan(0);
    expect(order?.exchangeOrderId).toBe(`mock-gateio-futures-${hash}`);
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

describe('SOAR-POSITION-CYCLE-008D Gate.io Futures DCA to SL internal mock LIVE', () => {
  openIt('fills ENTRY and both DCA legs while SL is deferred', async () => {
    assertIsolated();
    vi.stubGlobal('fetch', async () => { throw new Error('unexpected network transport'); });
    if (await prisma.user.count() !== 0) throw new Error('dedicated proof database must start empty');
    const previousEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const user = await createEntitledUser({ data: { email, password: 'test-only-hash' } });
      await setActiveSubscriptionForUser(prisma, { userId: user.id,
        planCode: 'PROFESSIONAL', source: 'ADMIN_OVERRIDE',
        metadata: { reason: 'isolated-008d-proof' } });
      const key = await prisma.apiKey.create({ data: { userId: user.id, label: 'local fake only',
        exchange: 'GATEIO', apiKey: 'local-fake-only', apiSecret: 'local-fake-only' } });
      const strategy = await prisma.strategy.create({ data: { userId: user.id,
        name: '008D DCA SL', interval: '1m', leverage: 100, walletRisk: 10,
        config: strategyConfig } });
      const wallet = await prisma.wallet.create({ data: { userId: user.id,
        name: 'local mock LIVE', mode: 'LIVE', exchange: 'GATEIO', marketType: 'FUTURES',
        baseCurrency: 'USDT' } });
      const universe = await prisma.marketUniverse.create({ data: { userId: user.id,
        name: 'one Gate.io Futures market', exchange: 'GATEIO', marketType: 'FUTURES',
        baseCurrency: 'USDT', whitelist: [symbol], blacklist: [] } });
      const group = await prisma.symbolGroup.create({ data: { userId: user.id,
        marketUniverseId: universe.id, name: 'one BTCUSDT group', symbols: [symbol] } });
      const bot = await prisma.bot.create({ data: { userId: user.id,
        name: '008D internal LIVE bot', mode: 'LIVE', exchange: 'GATEIO',
        marketType: 'FUTURES', positionMode: 'ONE_WAY', apiKeyId: key.id,
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
        strategyLeverage: 100, strategyInterval: '1m', runtimeSessionId: session.id,
        symbol, direction: 'LONG', quantity: 100, markPrice: prices.entry, mode: 'LIVE',
        candleOpenTime: 1_000, candleCloseTime: 60_999 });
      expect(entry.status).toBe('opened');
      if (entry.status !== 'opened') throw new Error('entry did not fill');
      expect(prices.firstDca).toBeLessThan(prices.entry * (1 - 0.20 / 100));
      expect(prices.firstDca).toBeLessThan(prices.entry * (1 - 0.305 / 100));
      const rejectedInput = { userId: user.id, botId: bot.id, walletId: wallet.id,
        strategyId: strategy.id, positionId: entry.positionId, symbol,
        positionSide: 'LONG' as const, dcaLevelIndex: 0, markPrice: prices.firstDca,
        mode: 'LIVE' as const, addedQuantity: 200 / prices.firstDca,
        currentQuantity: 100, currentEntryPrice: prices.entry };
      for (const rules of [
        { ...compatibleGateRules, contractSize: 10 },
        { ...compatibleGateRules, contractSize: null },
        { ...compatibleGateRules, minAmount: 300 },
        { ...compatibleGateRules, minNotional: 300 },
        { ...compatibleGateRules, minNotional: null },
        { ...compatibleGateRules, amountPrecision: null },
        { ...compatibleGateRules, amountPrecisionMode: null },
      ]) {
        await expect(executeRuntimeDca(rejectedInput, { getOrderRules: async () => rules,
          resolveFundsExhausted: async () => false }))
          .rejects.toMatchObject({ code: 'DCA_ORDER_RULES_INVALID' });
        expect(venue.submits).toHaveLength(1);
        expect(await prisma.liveOrderIntent.count({ where: { userId: user.id } })).toBe(1);
        expect(await prisma.order.count({ where: { userId: user.id } })).toBe(1);
        expect(await prisma.runtimeExecutionDedupe.count({ where: {
          botId: bot.id, commandType: 'DCA' } })).toBe(0);
      }
      const automation = createAutomation();
      await tick(automation, prices.firstDca, 120_000);
      await tick(automation, prices.firstDca, 180_000);
      const first = await readCycle(bot.id, entry.positionId, ['OPEN', 'DCA']);
      expect(first.position.status).toBe('OPEN');
      const entryFill = first.fills.find((fill) => fill.orderId === first.trades[0]?.orderId);
      const firstDcaFill = first.fills.find((fill) => fill.orderId === first.trades[1]?.orderId);
      expect(entryFill?.notional).toBe(100); // 1 USDT confirmed margin at 100x.
      const firstTargetNotional = entryFill!.notional * 2;
      expect(firstTargetNotional / 100).toBe(2); // Desired add before the venue step.
      const firstQuantity = Math.floor(firstTargetNotional / prices.firstDca);
      expect(firstDcaFill?.quantity).toBe(firstQuantity);
      expect(firstDcaFill?.notional).toBeCloseTo(firstQuantity * prices.firstDca, 8);
      expect(firstDcaFill!.notional).toBeLessThanOrEqual(firstTargetNotional);
      expect(firstTargetNotional - firstDcaFill!.notional).toBeLessThan(prices.firstDca);
      expect(firstDcaFill!.notional / 100).toBeCloseTo(1.99384, 8);
      const firstBookNotional = entryFill!.notional + firstDcaFill!.notional;
      const firstBookQuantity = entryFill!.quantity + firstDcaFill!.quantity;
      expect(first.position.quantity).toBe(firstBookQuantity);
      expect(first.position.entryPrice).toBeCloseTo(firstBookNotional / firstBookQuantity, 9);
      expect(prices.secondDca).toBeLessThan(first.position.entryPrice * (1 - 0.20 / 100));
      expect(prices.secondDca).toBeLessThan(first.position.entryPrice * (1 - 0.305 / 100));
      await tick(automation, prices.secondDca, 240_000);
      await tick(automation, prices.secondDca, 300_000);
      const cycle = await readCycle(bot.id, entry.positionId, ['OPEN', 'DCA', 'DCA']);
      expect(cycle.position.status).toBe('OPEN');
      const secondDcaFill = cycle.fills.find((fill) => fill.orderId === cycle.trades[2]?.orderId);
      const idealSecondTargetNotional = (entryFill!.notional + firstTargetNotional) * 2;
      expect(idealSecondTargetNotional / 100).toBe(6);
      // The product multiplies the confirmed contribution, including the first
      // tick-size shortfall; it therefore requests 598.768, not 600, here.
      const secondTargetNotional = firstBookNotional * 2;
      expect(secondTargetNotional).toBeCloseTo(598.768, 8);
      expect(secondTargetNotional).toBeCloseTo(idealSecondTargetNotional
        - 2 * (firstTargetNotional - firstDcaFill!.notional), 8);
      const secondQuantity = Math.floor(secondTargetNotional / prices.secondDca);
      expect(secondDcaFill?.quantity).toBe(secondQuantity);
      expect(secondDcaFill?.notional).toBeCloseTo(secondQuantity * prices.secondDca, 8);
      expect(secondDcaFill!.notional).toBeLessThanOrEqual(secondTargetNotional);
      expect(secondTargetNotional - secondDcaFill!.notional).toBeLessThan(prices.secondDca);
      expect(secondDcaFill!.notional / 100).toBeCloseTo(5.9792288, 8);
      const quantity = cycle.fills.reduce((sum, fill) => sum + fill.quantity, 0);
      const average = cycle.fills.reduce((sum, fill) => sum + fill.price * fill.quantity, 0) / quantity;
      expect(quantity).toBe(100 + firstQuantity + secondQuantity);
      expect(cycle.position.quantity).toBe(quantity);
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

  resumeIt('rebuilds, replays DCA, closes once at SL from the filled average', async () => {
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
      expect(prices.sl).toBeLessThan(confirmedAverage * (1 - 0.20 / 100));
      await tick(rebuilt, prices.sl, 360_000);
      const closed = await readCycle(bot.id, position.id, ['OPEN', 'DCA', 'DCA', 'CLOSE']);
      expect(closed.position).toMatchObject({ status: 'CLOSED', closeReason: 'SL',
        closeInitiator: 'BOT_APP' });
      const closeTrade = closed.trades.find((trade) => trade.lifecycleAction === 'CLOSE');
      expect(closeTrade).toMatchObject({ closeReason: 'SL', closeInitiator: 'BOT_APP' });
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
      expect(expectedNetPnl).toBeLessThan(0);
      expect(venue.submits).toHaveLength(1);
      await tick(rebuilt, prices.sl, 360_000);
      await tick(createAutomation(), prices.sl, 420_000);
      await readCycle(bot.id, position.id, ['OPEN', 'DCA', 'DCA', 'CLOSE']);
      expect(venue.submits).toHaveLength(1);
      expect(venue.lookups).toHaveLength(0);
    } finally {
      process.env.NODE_ENV = previousEnv;
      vi.unstubAllGlobals();
    }
  }, 60_000);
});
