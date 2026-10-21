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

// Run `open` and `resume` in separate Vitest processes against the same dedicated
// PostgreSQL and Redis instances. The fake is at the venue boundary of the real
// internal order path; a default connector call is an immediate test failure.
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
  const fakeResult = (payload: Parameters<typeof actual.openOrder>[1]) => {
    const id = payload.clientOrderId;
    if (!id || payload.mode !== 'LIVE' || !payload.price || payload.quantity <= 0) {
      throw new Error('internal LIVE fixture requires an identified priced order');
    }
    const hash = createHash('sha256').update(id).digest('hex').slice(0, 20);
    const fee = payload.price * payload.quantity * 0.0004;
    return {
      exchangeOrderId: `mock-gateio-futures-${hash}`, status: 'FILLED' as const,
      exchangeFilledQuantity: payload.quantity, exchangeAverageFillPrice: payload.price,
      fee, feeSource: 'EXCHANGE_FILL' as const, feePending: false,
      feeCurrency: 'USDT', exchangeTradeId: `mock-fill-${hash}`,
      fills: [{ exchangeTradeId: `mock-fill-${hash}`,
        exchangeOrderId: `mock-gateio-futures-${hash}`,
        symbol: payload.symbol, side: payload.side, price: payload.price,
        quantity: payload.quantity, notional: payload.price * payload.quantity,
        feeCost: fee, feeCurrency: 'USDT', feeRate: 0.0004,
        executedAt: new Date(), source: 'createOrder' as const, raw: { fixture: true } }],
    };
  };
  return { ...actual,
    openOrder: (userId: string, payload: Parameters<typeof actual.openOrder>[1]) =>
      actual.openOrder(userId, payload, {
        executeLiveOrder: async ({ payload: order }) => {
          if (venue.submits.includes(order.clientOrderId ?? '')) {
            throw new Error('duplicate venue submit');
          }
          venue.submits.push(order.clientOrderId!);
          return fakeResult(order);
        },
        lookupLiveOrder: async ({ payload: order }) => {
          venue.lookups.push(order.clientOrderId ?? '');
          throw new Error('unexpected venue lookup after confirmed fill');
        },
      }),
  };
});

const run = process.env.RUN_GATEIO_FUTURES_INTERNAL_MOCK_LIVE === '1';
const stage = process.env.GATEIO_FUTURES_INTERNAL_MOCK_LIVE_STAGE;
if (run && stage !== 'open' && stage !== 'resume') {
  throw new Error('internal mock LIVE cycle requires an open or resume stage');
}
const openIt = run && stage === 'open' ? it : it.skip;
const resumeIt = run && stage === 'resume' ? it : it.skip;
const email = 'gateio-futures-internal-live-cycle@example.test';
const symbol = 'BTCUSDT';
const prices = [1, 0.99694, 0.9949, 0.99792];
// This is a deliberately compatible synthetic rule set. Gate markets with
// non-unit contracts or higher minima must fail closed below.
const compatibleGateRules = {
  minAmount: 1, minNotional: 5, amountPrecision: 1, contractSize: 1,
};
const dcaStrategyConfig = {
  open: { direction: 'long', noMatchAction: 'EXIT' },
  close: { mode: 'basic', tp: 20, sl: 20 },
  additional: { orderType: 'MARKET', marginMode: 'ISOLATED',
    dcaEnabled: true, dcaMode: 'basic', dcaSizingBasis: 'usdt_contribution_v1',
    dcaTimes: 2, dcaLevels: [{ percent: -30.5, multiplier: 2 }] },
};

const assertIsolated = () => {
  const database = new URL(process.env.DATABASE_URL ?? '');
  const redis = new URL(process.env.REDIS_URL ?? '');
  if (database.hostname !== '127.0.0.1' || database.port === '' || database.port === '5432' ||
      decodeURIComponent(database.pathname) !== '/soar_position_cycle_008b_test' ||
      redis.hostname !== '127.0.0.1' || redis.port === '' || redis.port === '6379' ||
      process.env.NODE_ENV !== 'test' || !['open', 'resume'].includes(stage ?? '')) {
    throw new Error('internal mock LIVE cycle requires its own local _test database, Redis, and stage');
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
    expect(intent).toMatchObject({ exchange: 'GATEIO', marketType: 'FUTURES' });
    expect(intent.clientOrderId).toMatch(/^soar_[A-Za-z0-9_-]{22}$/);
    expect(intent.apiKeyCredentialVersion).toBeGreaterThan(0);
    expect(order?.exchangeOrderId).toBe(`mock-gateio-futures-${hash}`);
    expect(fills.find((fill) => fill.orderId === intent.id)?.exchangeTradeId)
      .toBe(`mock-fill-${hash}`);
  }
  for (const trade of trades) {
    const order = orders.find((candidate) => candidate.id === trade.orderId);
    expect(order?.filledQuantity).toBeCloseTo(trade.quantity, 7);
    expect(order?.averageFillPrice).toBeCloseTo(trade.price, 7);
    expect(trade.fee).toBeCloseTo(trade.price * trade.quantity * 0.0004, 7);
  }
  return { position, orders, trades, intents, fills };
};

describe('SOAR-POSITION-CYCLE-008B internal Gate.io Futures mock LIVE cycle', () => {
  openIt('persists entry, HOLD and two DCA fills', async () => {
    assertIsolated();
    vi.stubGlobal('fetch', async () => { throw new Error('unexpected network transport'); });
    if (await prisma.user.count() !== 0) throw new Error('dedicated proof database must start empty');
    const previousEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const user = await createEntitledUser({ data: { email, password: 'test-only-hash' } });
      await setActiveSubscriptionForUser(prisma, { userId: user.id,
        planCode: 'PROFESSIONAL', source: 'ADMIN_OVERRIDE',
        metadata: { reason: 'isolated-internal-live-cycle-proof' } });
      const key = await prisma.apiKey.create({ data: { userId: user.id, label: 'local fake only',
        exchange: 'GATEIO', apiKey: 'local-fake-only', apiSecret: 'local-fake-only' } });
      const strategy = await prisma.strategy.create({ data: { userId: user.id,
        name: 'internal LIVE cycle', interval: '1m', leverage: 100, walletRisk: 10,
        config: dcaStrategyConfig } });
      const wallet = await prisma.wallet.create({ data: { userId: user.id,
        name: 'local mock LIVE', mode: 'LIVE', exchange: 'GATEIO', marketType: 'FUTURES',
        baseCurrency: 'USDT' } });
      const universe = await prisma.marketUniverse.create({ data: { userId: user.id,
        name: 'one Gate.io Futures market', exchange: 'GATEIO', marketType: 'FUTURES',
        baseCurrency: 'USDT', whitelist: [symbol], blacklist: [] } });
      const group = await prisma.symbolGroup.create({ data: { userId: user.id,
        marketUniverseId: universe.id, name: 'one BTCUSDT group', symbols: [symbol] } });
      const bot = await prisma.bot.create({ data: { userId: user.id,
        name: 'internal LIVE cycle bot', mode: 'LIVE', exchange: 'GATEIO',
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
        symbol, direction: 'LONG', quantity: 100, markPrice: prices[0]!, mode: 'LIVE',
        candleOpenTime: 1_000, candleCloseTime: 60_999 });
      expect(entry.status).toBe('opened');
      if (entry.status !== 'opened') throw new Error('entry did not fill');
      const noSignalCreate = vi.fn(async () => undefined);
      const noSignalOrchestrate = vi.fn(async () => entry);
      const routeBot = { id: bot.id, userId: user.id, mode: 'LIVE',
        exchange: 'GATEIO', marketType: 'FUTURES', walletId: wallet.id,
        runtimeContext: { symbolGroupId: group.id, strategyId: strategy.id,
          maxOpenPositions: 1, symbols: [symbol], strategy: {
            strategyId: strategy.id, strategyInterval: '1m', strategyLeverage: 100,
            walletRisk: 10, strategyConfig: dcaStrategyConfig, priority: 1, weight: 1,
          } } };
      const candleAt = Date.now();
      await processRuntimeFinalCandleDecision({ type: 'candle', exchange: 'GATEIO',
        marketType: 'FUTURES', symbol, interval: '1m', eventTime: candleAt + 59_999,
        openTime: candleAt, closeTime: candleAt + 59_999, open: 1, high: 1,
        low: 1, close: 1, volume: 1_000, isFinal: true }, {
        nowMs: Date.now, minDirectionalScore: 1, runtimeSignalQuantity: 100,
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
      const hold = await orchestrateRuntimeSignal({ userId: user.id, botId: bot.id,
        walletId: wallet.id, strategyId: strategy.id, symbol, direction: 'LONG',
        quantity: 100, markPrice: prices[0]!, mode: 'LIVE', candleOpenTime: 61_000 });
      expect(hold).toMatchObject({ status: 'ignored', reason: 'already_open_same_side' });
      expect(await prisma.position.count({ where: { id: entry.positionId, status: 'OPEN' } })).toBe(1);
      const rejectedInput = { userId: user.id, botId: bot.id, walletId: wallet.id,
        strategyId: strategy.id, positionId: entry.positionId, symbol,
        positionSide: 'LONG' as const, dcaLevelIndex: 0, markPrice: prices[1]!,
        mode: 'LIVE' as const, addedQuantity: 200 / prices[1]!, currentQuantity: 100,
        currentEntryPrice: 1 };
      for (const rules of [
        { ...compatibleGateRules, contractSize: 10 },
        { ...compatibleGateRules, minAmount: 300 },
        { ...compatibleGateRules, minNotional: 300 },
        { ...compatibleGateRules, amountPrecision: null },
      ]) {
        await expect(executeRuntimeDca(rejectedInput, { getOrderRules: async () => rules,
          resolveFundsExhausted: async () => false }))
          .rejects.toMatchObject({ code: 'DCA_ORDER_RULES_INVALID' });
        expect(venue.submits).toHaveLength(1);
        expect(await prisma.liveOrderIntent.count({ where: { userId: user.id } })).toBe(1);
      }
      const automation = createAutomation();
      await tick(automation, prices[1]!, 120_000);
      await tick(automation, prices[1]!, 180_000);
      await tick(automation, prices[2]!, 240_000);
      await tick(automation, prices[2]!, 300_000);
      const cycle = await readCycle(bot.id, entry.positionId, ['OPEN', 'DCA', 'DCA']);
      expect(cycle.position.status).toBe('OPEN');
      expect(cycle.position.entryPrice * cycle.position.quantity / 100).toBeCloseTo(9, 2);
      const legMargins = cycle.trades.slice(0, 3)
        .map((trade) => trade.price * trade.quantity / 100);
      [1, 2, 6].forEach((expected, index) =>
        expect(legMargins[index]).toBeCloseTo(expected, 2));
      expect(venue.submits).toHaveLength(3);
      expect(venue.lookups).toHaveLength(0);
      expect(await runtimePositionStateStore.getTrustedPositionRuntimeState(entry.positionId))
        .toMatchObject({ currentAdds: 2 });
    } finally {
      process.env.NODE_ENV = previousEnv;
      vi.unstubAllGlobals();
    }
  }, 60_000);

  resumeIt('rebuilds after process restart, replays safely, closes TP and a fresh SL position', async () => {
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
      await readCycle(bot.id, position.id, ['OPEN', 'DCA', 'DCA']);
      const rebuilt = createAutomation();
      expect(await runtimePositionStateStore.getTrustedPositionRuntimeState(position.id))
        .toMatchObject({ currentAdds: 2 });
      await tick(rebuilt, prices[2]!, 300_000);
      expect(venue.submits).toHaveLength(0);
      await readCycle(bot.id, position.id, ['OPEN', 'DCA', 'DCA']);
      await tick(rebuilt, prices[3]!, 360_000);
      const tp = await readCycle(bot.id, position.id, ['OPEN', 'DCA', 'DCA', 'CLOSE']);
      expect(tp.position).toMatchObject({ status: 'CLOSED', closeReason: 'TP',
        closeInitiator: 'BOT_APP' });
      const basis = tp.trades.filter((trade) => trade.lifecycleAction !== 'CLOSE');
      const close = tp.trades.find((trade) => trade.lifecycleAction === 'CLOSE')!;
      expect(close).toMatchObject({ closeReason: 'TP', closeInitiator: 'BOT_APP' });
      const quantity = basis.reduce((sum, trade) => sum + trade.quantity, 0);
      const average = basis.reduce((sum, trade) => sum + trade.price * trade.quantity, 0) / quantity;
      const fees = tp.trades.reduce((sum, trade) => sum + (trade.fee ?? 0), 0);
      expect(tp.position.realizedPnl).toBeCloseTo((close.price - average) * quantity - fees, 6);
      expect(venue.submits).toHaveLength(1);
      const walletId = bot.walletId!;
      const strategyId = bot.strategyId!;
      // Basic SL is intentionally deferred while loss-side DCA levels remain.
      // The independent SL scenario uses a new position with DCA disabled.
      await prisma.strategy.update({ where: { id: strategyId }, data: { config: {
        open: { direction: 'long', noMatchAction: 'EXIT' },
        close: { mode: 'basic', tp: 20, sl: 20 },
        additional: { orderType: 'MARKET', marginMode: 'ISOLATED', dcaEnabled: false },
      } } });
      const slEntry = await orchestrateRuntimeSignal({ userId: user.id, botId: bot.id,
        walletId, strategyId, symbol, direction: 'LONG', quantity: 100,
        markPrice: 1, mode: 'LIVE', candleOpenTime: 420_000, candleCloseTime: 479_999 });
      expect(slEntry.status).toBe('opened');
      if (slEntry.status !== 'opened') throw new Error('SL fixture entry did not fill');
      const slAutomation = createAutomation();
      await tick(slAutomation, 0.9977, 480_000);
      const sl = await readCycle(bot.id, slEntry.positionId, ['OPEN', 'CLOSE']);
      expect(sl.position).toMatchObject({ status: 'CLOSED', closeReason: 'SL',
        closeInitiator: 'BOT_APP' });
      expect(sl.trades.find((trade) => trade.lifecycleAction === 'CLOSE'))
        .toMatchObject({ closeReason: 'SL', closeInitiator: 'BOT_APP' });
      expect(sl.position.realizedPnl).toBeLessThan(0);
      expect(venue.submits).toHaveLength(3);
      expect(venue.lookups).toHaveLength(0);
    } finally {
      process.env.NODE_ENV = previousEnv;
      vi.unstubAllGlobals();
    }
  }, 60_000);
});
