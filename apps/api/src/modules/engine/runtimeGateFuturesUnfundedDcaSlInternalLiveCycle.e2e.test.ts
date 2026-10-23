import { createHash } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { DomainError } from '../../lib/errors';
import { prisma } from '../../prisma/client';
import { createEntitledUser } from '../../test/createEntitledUser';
import { setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { orchestrateRuntimeSignal } from './executionOrchestrator.service';
import { processRuntimeFinalCandleDecision } from './runtimeFinalCandleDecision.service';
import { executeRuntimeDca, RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { resolveRuntimeDcaFundsExhausted } from './runtimeCapitalContext.service';
import { loadDurableDcaProgress } from './runtimeDurableDcaProgress';
import type { RuntimePositionAutomationDeps } from './runtimePositionAutomation.types';
import { runtimeTelemetryService } from './runtimeTelemetry.service';

// The LIVE intent/order/fill path is real; venue fills and the confirmed
// futures margin balance are synthetic. Every other exchange/network path is a tripwire.
const venue = vi.hoisted(() => ({ submits: [] as string[], lookups: [] as string[] }));
const capital = vi.hoisted(() => ({ balanceAvailable: false, reads: 0, unexpectedReads: 0 }));
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
    fetchSupportedExchangeBalanceRaw: async (input: { exchange: string; marketType: string }) => {
      if (!capital.balanceAvailable || input.exchange !== 'GATEIO' || input.marketType !== 'FUTURES') {
        capital.unexpectedReads += 1;
        throw new Error('unexpected exchange balance lookup');
      }
      capital.reads += 1;
      return { total: { USDT: 2.5 }, free: { USDT: 0.5 } };
    } };
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

const run = process.env.RUN_GATEIO_FUTURES_UNFUNDED_DCA_SL_INTERNAL_MOCK_LIVE === '1';
const stage = process.env.GATEIO_FUTURES_UNFUNDED_DCA_SL_INTERNAL_MOCK_LIVE_STAGE;
if (run && stage !== 'open' && stage !== 'resume') {
  throw new Error('008L requires an open or resume stage');
}
const openIt = run && stage === 'open' ? it : it.skip;
const resumeIt = run && stage === 'resume' ? it : it.skip;
const email = 'gateio-futures-unfunded-dca-sl-internal-live@example.test';
const symbol = 'BTCUSDT';
const leverage = 100;
const prices = { entry: 1, crossedSl: 0.99692 };
// Synthetic Gate unit contracts use contractSize=1 BTC. The 2 USDT margin
// target is 200 USDT notional; flooring to a one-contract step yields 200.
const futuresRules = { minAmount: 1, minNotional: 5, amountPrecision: 1,
  amountPrecisionMode: 'TICK_SIZE' as const, contractSize: 1 };
const strategyConfig = {
  open: { direction: 'long', noMatchAction: 'EXIT' },
  close: { mode: 'basic', tp: 20, sl: 20 },
  additional: { orderType: 'MARKET', marginMode: 'ISOLATED',
    dcaEnabled: true, dcaMode: 'basic', dcaSizingBasis: 'usdt_contribution_v1',
    dcaTimes: 1, dcaLevels: [{ percent: -30.5, multiplier: 2 }] },
};

const assertIsolated = () => {
  const database = new URL(process.env.DATABASE_URL ?? '');
  const testDatabase = new URL(process.env.TEST_DATABASE_URL ?? '');
  const redis = new URL(process.env.REDIS_URL ?? '');
  if (database.hostname !== '127.0.0.1' || database.port === '' || database.port === '5432' ||
      decodeURIComponent(database.pathname) !== '/soar_position_cycle_008l_test' ||
      testDatabase.href !== database.href ||
      redis.hostname !== '127.0.0.1' || redis.port === '' || redis.port === '6379' ||
      process.env.NODE_ENV !== 'test' || !['open', 'resume'].includes(stage ?? '')) {
    throw new Error('008L requires its own local _test database, Redis, and stage');
  }
};

const createAutomation = (executeDcaForProof: RuntimePositionAutomationDeps['executeDca']) =>
  new RuntimePositionAutomationService({
  getCanonicalPositionState: async (id) => {
    const position = await prisma.position.findUnique({ where: { id } });
    return position ? { quantity: position.quantity, averageEntryPrice: position.entryPrice } : null;
  },
  getDurableDcaProgress: (input) => loadDurableDcaProgress(input),
  executeDca: executeDcaForProof,
  recordRuntimeEvent: (input) => runtimeTelemetryService.recordRuntimeEvent(input),
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
    expect(fill?.feeCurrency).toBe('USDT');
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

describe('SOAR-POSITION-CYCLE-008L Gate.io Futures unfunded DCA to SL internal mock LIVE', () => {
  openIt('holds during a pending DCA, then confirms unfunded DCA and closes once by SL', async () => {
    assertIsolated();
    vi.stubGlobal('fetch', async () => { throw new Error('unexpected network transport'); });
    if (await prisma.user.count() !== 0) throw new Error('dedicated proof database must start empty');
    const previousEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const user = await createEntitledUser({ data: { email, password: 'test-only-hash' } });
      await setActiveSubscriptionForUser(prisma, { userId: user.id,
        planCode: 'PROFESSIONAL', source: 'ADMIN_OVERRIDE',
        metadata: { reason: 'isolated-008l-proof' } });
      const key = await prisma.apiKey.create({ data: { userId: user.id, label: 'local fake only',
        exchange: 'GATEIO', apiKey: 'local-fake-only', apiSecret: 'local-fake-only' } });
      const strategy = await prisma.strategy.create({ data: { userId: user.id,
        name: '008L unfunded DCA SL', interval: '1m', leverage, walletRisk: 10,
        config: strategyConfig } });
      const wallet = await prisma.wallet.create({ data: { userId: user.id,
        name: 'local mock LIVE', mode: 'LIVE', exchange: 'GATEIO', marketType: 'FUTURES',
        baseCurrency: 'USDT', apiKeyId: key.id } });
      const universe = await prisma.marketUniverse.create({ data: { userId: user.id,
        name: 'one Gate.io Futures market', exchange: 'GATEIO', marketType: 'FUTURES',
        baseCurrency: 'USDT', whitelist: [symbol], blacklist: [] } });
      const group = await prisma.symbolGroup.create({ data: { userId: user.id,
        marketUniverseId: universe.id, name: 'one BTCUSDT group', symbols: [symbol] } });
      const bot = await prisma.bot.create({ data: { userId: user.id,
        name: '008L internal LIVE bot', mode: 'LIVE', exchange: 'GATEIO',
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
        strategyLeverage: leverage, strategyInterval: '1m', runtimeSessionId: session.id,
        symbol, direction: 'LONG', quantity: 100, markPrice: prices.entry, mode: 'LIVE',
        candleOpenTime: 1_000, candleCloseTime: 60_999 });
      expect(entry.status).toBe('opened');
      if (entry.status !== 'opened') throw new Error('entry did not fill');
      const noSignalCreate = vi.fn(async () => undefined);
      const noSignalOrchestrate = vi.fn(async () => entry);
      const routeBot = { id: bot.id, userId: user.id, mode: 'LIVE',
        exchange: 'GATEIO', marketType: 'FUTURES', walletId: wallet.id,
        runtimeContext: { symbolGroupId: group.id, strategyId: strategy.id,
          maxOpenPositions: 1, symbols: [symbol], strategy: {
            strategyId: strategy.id, strategyInterval: '1m', strategyLeverage: leverage,
            walletRisk: 10, strategyConfig, priority: 1, weight: 1,
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
      const entryCycle = await readCycle(bot.id, entry.positionId, ['OPEN']);
      expect(entryCycle.position.status).toBe('OPEN');
      expect(entryCycle.fills[0]).toMatchObject({ quantity: 100, price: prices.entry, notional: 100 });
      expect(entryCycle.fills[0]!.notional / leverage).toBe(1);
      expect(prices.crossedSl).toBeLessThan(prices.entry * (1 - 0.20 / leverage));
      expect((prices.crossedSl - prices.entry) / prices.entry * leverage).toBeLessThan(-0.305);
      const pausedDca = vi.fn(async (_input: Parameters<typeof executeRuntimeDca>[0]) => {
        throw new DomainError('LIVE_PRETRADE_PAUSED', 'LIVE_PRETRADE_PAUSED', { status: 503 });
      });
      await tick(createAutomation(pausedDca), prices.crossedSl, 120_000);
      expect(pausedDca).toHaveBeenCalledOnce();
      expect((await readCycle(bot.id, entry.positionId, ['OPEN'])).position.status).toBe('OPEN');
      expect(venue.submits).toHaveLength(1);
      expect(capital.reads).toBe(0);
      expect(capital.unexpectedReads).toBe(0);
      expect(await prisma.runtimeExecutionDedupe.count({ where: {
        botId: bot.id, commandType: 'DCA' } })).toBe(0);
      const beforeFundsEvents = await prisma.botRuntimeEvent.findMany({ where: { botId: bot.id } });
      expect(beforeFundsEvents.filter((event) => event.eventType === 'PRETRADE_BLOCKED'
        && (event.payload as { reason?: string } | null)?.reason === 'dca_funds_exhausted'))
        .toHaveLength(0);
      expect(beforeFundsEvents.filter((event) => event.eventType === 'SIGNAL_DECISION'
        && (event.payload as { reason?: string } | null)?.reason === 'stop_loss'))
        .toHaveLength(0);

      const requestedDca = pausedDca.mock.calls[0]![0];
      for (const invalidRules of [
        { ...futuresRules, contractSize: null },
        { ...futuresRules, contractSize: 10 },
        { ...futuresRules, amountPrecision: null },
        { ...futuresRules, amountPrecisionMode: null },
        { ...futuresRules, minAmount: 300 },
        { ...futuresRules, minNotional: 300 },
      ]) {
        await expect(executeRuntimeDca(requestedDca, {
          getOrderRules: async () => invalidRules,
          resolveFundsExhausted: async () => { throw new Error('invalid rules reached capital check'); },
        })).rejects.toMatchObject({ code: 'DCA_ORDER_RULES_INVALID' });
      }
      expect(await prisma.runtimeExecutionDedupe.count({ where: {
        botId: bot.id, commandType: 'DCA' } })).toBe(0);
      expect(venue.submits).toHaveLength(1);

      // The exchange now confirms 0.5 USDT free against ~2 USDT DCA margin.
      // The real LIVE capital resolver runs after the executable order rules.
      capital.balanceAvailable = true;
      const capitalRequests: Array<Parameters<typeof resolveRuntimeDcaFundsExhausted>[0]> = [];
      const rulesRequests: Array<{ exchange: string; marketType: string; symbol: string }> = [];
      const attemptedDca = vi.fn((input: Parameters<typeof executeRuntimeDca>[0]) =>
        executeRuntimeDca(input, { getOrderRules: async (request) => {
          rulesRequests.push(request);
          return futuresRules;
        },
          resolveFundsExhausted: async (context) => {
            capitalRequests.push(context);
            return resolveRuntimeDcaFundsExhausted(context);
          } }));
      await tick(createAutomation(attemptedDca), prices.crossedSl, 180_000);
      expect(attemptedDca).toHaveBeenCalledOnce();
      expect(rulesRequests).toEqual([{ exchange: 'GATEIO', marketType: 'FUTURES', symbol }]);
      expect(capitalRequests).toHaveLength(1);
      expect(capitalRequests[0]).toMatchObject({ mode: 'LIVE', exchange: 'GATEIO',
        marketType: 'FUTURES', markPrice: prices.crossedSl, leverage });
      expect(capitalRequests[0]?.addedQuantity).toBe(200);
      const requiredNotional = capitalRequests[0]!.addedQuantity * prices.crossedSl;
      const requiredMargin = requiredNotional / leverage;
      expect(requiredNotional).toBeCloseTo(199.384, 9);
      expect(requiredMargin).toBeCloseTo(1.99384, 9);
      expect(requiredNotional).toBeGreaterThan(futuresRules.minNotional);
      expect(requiredMargin).toBeGreaterThan(0.5);
      expect(capital.reads).toBeGreaterThanOrEqual(1);
      expect(capital.unexpectedReads).toBe(0);
      const balanceSnapshots = await prisma.walletBalanceSnapshot.findMany({
        where: { walletId: wallet.id },
      });
      expect(balanceSnapshots.some((snapshot) => snapshot.accountBalance === 2.5
        && snapshot.freeBalance === 0.5)).toBe(true);
      const cycle = await readCycle(bot.id, entry.positionId, ['OPEN', 'CLOSE']);
      expect(cycle.position).toMatchObject({ status: 'CLOSED', closeReason: 'SL',
        closeInitiator: 'BOT_APP', quantity: 100, entryPrice: prices.entry });
      expect(cycle.trades[1]).toMatchObject({ closeReason: 'SL', closeInitiator: 'BOT_APP' });
      expect(cycle.fills[1]).toMatchObject({ quantity: 100, price: prices.crossedSl });
      const entryNotional = cycle.fills[0]!.notional;
      const closeNotional = cycle.fills[1]!.notional;
      const allFees = cycle.fills.reduce((sum, fill) => sum + (fill.feeCost ?? NaN), 0);
      const expectedNetPnl = closeNotional - entryNotional - allFees;
      expect(entryNotional).toBe(100);
      expect(closeNotional).toBeCloseTo(99.692, 9);
      expect(allFees).toBeCloseTo(0.0798768, 9);
      expect(expectedNetPnl).toBeCloseTo(-0.3878768, 9);
      expect(cycle.trades[1]?.realizedPnl).toBeCloseTo(expectedNetPnl, 8);
      expect(cycle.position.realizedPnl).toBeCloseTo(expectedNetPnl, 8);
      expect(await prisma.trade.count({ where: {
        positionId: entry.positionId, lifecycleAction: 'DCA' } })).toBe(0);
      expect(await prisma.runtimeExecutionDedupe.count({ where: {
        botId: bot.id, commandType: 'DCA' } })).toBe(0);
      const events = await prisma.botRuntimeEvent.findMany({ where: { botId: bot.id } });
      expect(events.filter((event) => event.eventType === 'PRETRADE_BLOCKED'
        && (event.payload as { reason?: string } | null)?.reason === 'dca_funds_exhausted'))
        .toHaveLength(1);
      expect(events.filter((event) => event.eventType === 'SIGNAL_DECISION'
        && (event.payload as { reason?: string; dcaFundsExhausted?: boolean } | null)?.reason
          === 'stop_loss'
        && (event.payload as { dcaFundsExhausted?: boolean } | null)?.dcaFundsExhausted === true))
        .toHaveLength(1);
      expect(venue.submits).toHaveLength(2);
      expect(venue.lookups).toHaveLength(0);
    } finally {
      process.env.NODE_ENV = previousEnv;
      vi.unstubAllGlobals();
    }
  }, 60_000);

  resumeIt('replays a persisted unfunded SL without another DCA or close', async () => {
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
      const position = await prisma.position.findFirstOrThrow({ where: {
        botId: bot.id, status: 'CLOSED', closeReason: 'SL',
      } });
      const before = await readCycle(bot.id, position.id, ['OPEN', 'CLOSE']);
      const eventsBefore = await prisma.botRuntimeEvent.findMany({ where: { botId: bot.id } });
      const impossibleDca = vi.fn(async () => {
        throw new Error('unexpected DCA after terminal SL');
      });
      await tick(createAutomation(impossibleDca), prices.crossedSl, 180_000);
      await tick(createAutomation(impossibleDca), prices.crossedSl, 240_000);
      const after = await readCycle(bot.id, position.id, ['OPEN', 'CLOSE']);
      expect(after.position).toMatchObject({ status: 'CLOSED', closeReason: 'SL',
        closeInitiator: 'BOT_APP', realizedPnl: before.position.realizedPnl });
      expect(after.orders.map((order) => order.id)).toEqual(before.orders.map((order) => order.id));
      expect(after.intents.map((intent) => intent.id)).toEqual(before.intents.map((intent) => intent.id));
      expect(after.fills.map((fill) => fill.id)).toEqual(before.fills.map((fill) => fill.id));
      expect(after.trades.map((trade) => trade.id)).toEqual(before.trades.map((trade) => trade.id));
      expect(await prisma.botRuntimeEvent.count({ where: { botId: bot.id } }))
        .toBe(eventsBefore.length);
      expect(await prisma.runtimeExecutionDedupe.count({ where: {
        botId: bot.id, commandType: 'DCA' } })).toBe(0);
      expect(impossibleDca).not.toHaveBeenCalled();
      expect(venue.submits).toHaveLength(0);
      expect(venue.lookups).toHaveLength(0);
      expect(capital.reads).toBe(0);
      expect(capital.unexpectedReads).toBe(0);
    } finally {
      process.env.NODE_ENV = previousEnv;
      vi.unstubAllGlobals();
    }
  }, 60_000);
});
