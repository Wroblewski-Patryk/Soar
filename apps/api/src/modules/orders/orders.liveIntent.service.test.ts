import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { createEntitledUser } from '../../test/createEntitledUser';
import { openOrder } from './orders.service';
import {
  createOrderForLiveIntent, executeDurableLiveOrder, materializeLiveOrderInTransaction,
  persistOrReuseLiveOrderIntent, resolveLiveClientOrderId,
} from './orders.liveIntent.service';
import { findLiveFillCandidatePage } from './orders.liveFillCandidates.service';
import { ORDER_ERROR_CODES } from './orders.errors';
import { ensureSubscriptionCatalog, SUBSCRIPTION_PLAN_SEED } from '../subscriptions/subscriptions.service';
import { SubscriptionEntitlementsSchema } from '../subscriptions/subscriptionEntitlements.service';
import { buildDcaExecutionDedupeKey, runtimeExecutionDedupeService } from '../engine/runtimeExecutionDedupe.service';
import { buildRuntimeClientOrderId } from '../engine/runtimeExecutionClientOrderId';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import { finalizeRuntimeDcaFill } from '../engine/runtimeImmediateFillFinalizer.service';
import { LiveOrderAdapter } from '../exchange/liveOrderAdapter.service';
import { CcxtFuturesConnector, type CcxtExchangeLikeClient } from '../exchange/ccxtFuturesConnector.service';
import { reconcileLiveOrderFee } from '../exchange/liveFeeReconciliation.service';
import { applyLiveExchangeOrderTradeUpdateEvent } from './orders.exchangeEvents.service';

const testCreateOrderPermit = async <T,>(_input: unknown, submit: () => Promise<T>) => submit();

type FreePlanStore = {
  read: () => Promise<{ entitlements: unknown } | null>;
  ensure: () => Promise<void>;
  write: (entitlements: Prisma.InputJsonValue) => Promise<void>;
};

const createLiveEntitlementFixture = (store: FreePlanStore) => {
  let originalFreeEntitlements: Prisma.InputJsonValue | undefined;

  return {
    allowLive: async () => {
      if (originalFreeEntitlements === undefined) {
        const existing = await store.read();
        await store.ensure();
        const baseline = existing ?? await store.read();
        if (!baseline) throw new Error('FREE plan missing after catalog setup');
        // A newly seeded FREE plan may be shared by later tests, so keep it and restore its defaults.
        originalFreeEntitlements = structuredClone(baseline.entitlements) as Prisma.InputJsonValue;
      }
      const freePlan = await store.read();
      if (!freePlan) throw new Error('FREE plan missing before LIVE test');
      const entitlements = SubscriptionEntitlementsSchema.parse(freePlan.entitlements);
      await store.write({
        ...entitlements,
        features: { ...entitlements.features, liveTrading: true },
      });
    },
    restore: async () => {
      if (originalFreeEntitlements !== undefined) {
        await store.write(originalFreeEntitlements);
      }
    },
  };
};

const liveEntitlementFixture = createLiveEntitlementFixture({
  read: () => prisma.subscriptionPlan.findUnique({
    where: { code: 'FREE' }, select: { entitlements: true },
  }),
  ensure: () => ensureSubscriptionCatalog(prisma),
  write: async (entitlements) => {
    await prisma.subscriptionPlan.update({
      where: { code: 'FREE' }, data: { entitlements },
    });
  },
});

describe('LIVE entitlement fixture isolation', () => {
  const defaults = SubscriptionEntitlementsSchema.parse(
    SUBSCRIPTION_PLAN_SEED.find((plan) => plan.code === 'FREE')?.entitlements,
  );

  it('restores exact pre-seed custom entitlements even after a failed test', async () => {
    const custom = {
      ...defaults,
      limits: { ...defaults.limits, maxBotsTotal: 7 },
      fixtureMarker: { preserve: 'original JSON' },
    };
    let row: { entitlements: unknown } | null = { entitlements: custom };
    const fixture = createLiveEntitlementFixture({
      read: async () => row,
      ensure: async () => { row = { entitlements: defaults }; },
      write: async (entitlements) => { row = { entitlements: structuredClone(entitlements) }; },
    });

    await expect((async () => {
      try {
        await fixture.allowLive();
        expect(SubscriptionEntitlementsSchema.parse(row?.entitlements).features.liveTrading).toBe(true);
        throw new Error('simulated test failure');
      } finally {
        await fixture.restore();
      }
    })()).rejects.toThrow('simulated test failure');
    expect(row?.entitlements).toEqual(custom);
  });

  it('keeps a newly seeded FREE plan and restores its default entitlements', async () => {
    let row: { entitlements: unknown } | null = null;
    const fixture = createLiveEntitlementFixture({
      read: async () => row,
      ensure: async () => { row = { entitlements: defaults }; },
      write: async (entitlements) => { row = { entitlements: structuredClone(entitlements) }; },
    });

    await fixture.allowLive();
    await fixture.restore();
    expect(row).toEqual({ entitlements: defaults });
  });
});

const cleanupDb = async () => {
  await prisma.log.deleteMany();
  await prisma.backtestReport.deleteMany();
  await prisma.backtestTrade.deleteMany();
  await prisma.backtestRun.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.order.deleteMany();
  await prisma.liveOrderIntent.deleteMany();
  await prisma.position.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.botRuntimeSymbolStat.deleteMany();
  await prisma.botRuntimeEvent.deleteMany();
  await prisma.botRuntimeSession.deleteMany();
  await prisma.runtimeExecutionDedupe.deleteMany();
  await prisma.botStrategy.deleteMany();
  await prisma.botSubagentConfig.deleteMany();
  await prisma.botAssistantConfig.deleteMany();
  await prisma.marketGroupStrategyLink.deleteMany();
  await prisma.botMarketGroup.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.symbolGroup.deleteMany();
  await prisma.marketUniverse.deleteMany();
  await prisma.strategy.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.user.deleteMany();
};

const createLiveScopedBotContext = async (params: {
  userId: string;
  botName: string;
  strategyName: string;
  symbol: string;
  apiKeyId?: string;
}) => {
  const apiKeyId = params.apiKeyId ?? (await prisma.apiKey.create({ data: {
    userId: params.userId, label: `${params.botName} test key`, exchange: 'BINANCE',
    apiKey: `${params.botName} test key`, apiSecret: 'test secret',
  } })).id;
  const strategy = await prisma.strategy.create({
    data: {
      userId: params.userId,
      name: params.strategyName,
      interval: '5m',
      leverage: 5,
      walletRisk: 1,
      config: {
        additional: {
          orderType: 'MARKET',
          marginMode: 'ISOLATED',
        },
      },
    },
  });
  const wallet = await prisma.wallet.create({
    data: {
      userId: params.userId,
      name: `${params.botName} wallet`,
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    },
  });
  const universe = await prisma.marketUniverse.create({
    data: {
      userId: params.userId,
      name: `${params.botName} universe`,
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      whitelist: [params.symbol],
      blacklist: [],
    },
  });
  const symbolGroup = await prisma.symbolGroup.create({
    data: {
      userId: params.userId,
      marketUniverseId: universe.id,
      name: `${params.botName} symbols`,
      symbols: [params.symbol],
    },
  });
  const bot = await prisma.bot.create({
    data: {
      userId: params.userId,
      name: params.botName,
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      positionMode: 'ONE_WAY',
      apiKeyId,
      isActive: true,
      liveOptIn: true,
      consentTextVersion: 'mvp-v1',
      maxOpenPositions: 3,
      walletId: wallet.id,
      strategyId: strategy.id,
      symbolGroupId: symbolGroup.id,
    },
  });

  return { bot, strategy, wallet, universe, symbolGroup };
};

describe('durable LIVE order intent', () => {
  afterAll(async () => {
    try {
      await cleanupDb();
    } finally {
      await liveEntitlementFixture.restore();
    }
  });
  beforeEach(async () => {
    await cleanupDb();
    await liveEntitlementFixture.allowLive();
  });

  it('persists the selected credential generation before submit and keeps retry lookup-only', async () => {
    const user = await createEntitledUser({ data: {
      email: 'bound-live-intent@example.com', password: 'hashed',
    } });
    const key = await prisma.apiKey.create({ data: {
      userId: user.id, label: 'bound', exchange: 'BINANCE',
      apiKey: 'test-key', apiSecret: 'test-secret',
    } });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id, botName: 'Bound intent bot',
      strategyName: 'Bound intent strategy', symbol: 'BTCUSDT', apiKeyId: key.id,
    });
    const payload = { botId: bot.id, symbol: 'BTCUSDT', side: 'BUY' as const,
      type: 'LIMIT' as const, quantity: 0.5, price: 100, mode: 'LIVE' as const,
      riskAck: true, clientOrderId: 'soar_bound_intent_1' };
    const execute = vi.fn(async ({ credentialBinding }: {
      credentialBinding: { apiKeyId: string; apiKeyCredentialVersion: number } | null,
    }) => {
      const intent = await prisma.liveOrderIntent.findUniqueOrThrow({
        where: { clientOrderId: payload.clientOrderId },
      });
      expect(intent.apiKeyId).toBe(key.id);
      expect(intent.apiKeyCredentialVersion).toBe(key.credentialVersion);
      expect(credentialBinding).toEqual({ apiKeyId: key.id,
        apiKeyCredentialVersion: key.credentialVersion });
      return { exchangeOrderId: 'simulated-only', status: 'OPEN' as const };
    });
    const lookup = vi.fn().mockRejectedValue(new Error('unavailable'));
    await executeDurableLiveOrder({ userId: user.id, bot, payload: { ...payload },
      execute, lookup });
    await expect(prisma.liveOrderIntent.update({
      where: { clientOrderId: payload.clientOrderId },
      data: { apiKeyCredentialVersion: key.credentialVersion + 1 },
    })).rejects.toThrow();
    await prisma.apiKey.update({ where: { id: key.id }, data: {
      apiSecret: 'rotated-secret',
    } });
    await expect(executeDurableLiveOrder({ userId: user.id, bot,
      payload: { ...payload }, execute, lookup })).rejects.toMatchObject({
      code: ORDER_ERROR_CODES.liveExecutionUnknown,
    });
    expect(execute).toHaveBeenCalledOnce();
    expect(lookup).toHaveBeenCalledOnce();
  });

  it('persists the final intent before any submit and makes an existing ID lookup-only', async () => {
    expect(decodeURIComponent(new URL(process.env.DATABASE_URL ?? '').pathname).endsWith('_test')).toBe(true);
    const user = await createEntitledUser({
      data: { email: 'live-intent-seam@example.com', password: 'hashed' },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id, botName: 'Intent seam bot', strategyName: 'Intent seam strategy', symbol: 'BTCUSDT',
    });
    const payload = { botId: bot.id, symbol: 'BTCUSDT', side: 'BUY' as const,
      type: 'LIMIT' as const, quantity: 0.5, price: 100, mode: 'LIVE' as const,
      riskAck: true, clientOrderId: 'soar_intent_seam_1' };
    const first = await persistOrReuseLiveOrderIntent({ userId: user.id, bot, payload });
    expect(first).toMatchObject({ created: true, clientOrderId: payload.clientOrderId,
      existingOrder: null });
    expect(await prisma.liveOrderIntent.count({ where: { userId: user.id } })).toBe(1);
    expect(await prisma.order.count({ where: { userId: user.id } })).toBe(0);
    const retried = await persistOrReuseLiveOrderIntent({ userId: user.id, bot,
      payload: { ...payload } });
    expect(retried).toMatchObject({ created: false, intentId: first.intentId });
    await expect(persistOrReuseLiveOrderIntent({ userId: user.id, bot,
      payload: { ...payload, price: 101 } })).rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveIntentConflict });
    const execute = vi.fn().mockResolvedValue({ exchangeOrderId: 'must-not-submit', status: 'OPEN' });
    const lookup = vi.fn().mockRejectedValue(new Error('venue unavailable'));
    await expect(executeDurableLiveOrder({ userId: user.id, bot, payload: { ...payload },
      execute, lookup })).rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveExecutionUnknown });
    expect(execute).not.toHaveBeenCalled();
    expect(lookup).toHaveBeenCalledTimes(1);
    expect(await prisma.liveOrderIntent.count({ where: { userId: user.id } })).toBe(1);
    expect(resolveLiveClientOrderId('delegated-fixed-1', 'GATEIO'))
      .toBe(resolveLiveClientOrderId('delegated-fixed-1', 'GATEIO'));
    expect(resolveLiveClientOrderId('delegated-fixed-1', 'GATEIO')).toMatch(/^soar_[A-Za-z0-9_-]{22}$/);
  });

  it('reselects unresolved intent and partial LIVE order from the database after a fresh read', async () => {
    const user = await createEntitledUser({
      data: { email: 'live-fill-candidate@example.com', password: 'hashed' },
    });
    const { bot, wallet } = await createLiveScopedBotContext({
      userId: user.id, botName: 'Live Fill Candidate',
      strategyName: 'Live Fill Candidate Strategy', symbol: 'ETHUSDT',
    });
    const intent = await prisma.liveOrderIntent.create({ data: {
      userId: user.id, clientOrderId: 'soar_candidate_test', payloadHash: 'candidate-hash',
      payload: { botId: bot.id, walletId: wallet.id, side: 'BUY', quantity: 1 },
      exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'ETHUSDT',
    } });
    const partial = await prisma.order.create({ data: {
      userId: user.id, botId: bot.id, walletId: wallet.id,
      symbol: 'ETHUSDT', side: 'BUY', type: 'LIMIT', status: 'PARTIALLY_FILLED',
      quantity: 2, filledQuantity: 1, feePending: true, exchangeOrderId: 'candidate-partial',
    } });
    const first = await findLiveFillCandidatePage();
    const afterRestart = await findLiveFillCandidatePage();
    expect(first.candidates.map((row) => row.orderId).sort()).toEqual([intent.id, partial.id].sort());
    expect(afterRestart.candidates).toEqual(first.candidates);
    expect(first.candidates.find((row) => row.orderId === partial.id)).toMatchObject({
      localStatus: 'PARTIALLY_FILLED', exchangeOrderId: 'candidate-partial',
    });
  });

  it('selects FILLED quantity gaps and zero anomalies with or without an intent', async () => {
    const user = await createEntitledUser({
      data: { email: 'live-fill-quantity-gap@example.com', password: 'hashed' },
    });
    const { bot, wallet } = await createLiveScopedBotContext({
      userId: user.id, botName: 'Live Fill Quantity Gap',
      strategyName: 'Live Fill Quantity Gap Strategy', symbol: 'ETHUSDT',
    });
    const cases = [
      { label: 'intent-under', withIntent: true, filled: 1, fills: [0.4], expected: true },
      { label: 'legacy-under', withIntent: false, filled: 1, fills: [0.4], expected: true },
      { label: 'intent-complete', withIntent: true, filled: 1, fills: [0.4, 0.6], expected: false },
      { label: 'legacy-complete', withIntent: false, filled: 1, fills: [0.4, 0.6], expected: false },
      { label: 'intent-zero', withIntent: true, filled: 0, fills: [], expected: true },
      { label: 'legacy-zero', withIntent: false, filled: 0, fills: [], expected: true },
      { label: 'tiny-under', withIntent: false, filled: 1e-8, fills: [9e-9], expected: true },
      { label: 'roundoff-complete', withIntent: false, filled: 0.3,
        fills: [0.1, 0.2], expected: false },
    ];
    const expectedIds: string[] = [];
    const excludedIds: string[] = [];
    for (const scenario of cases) {
      const intent = scenario.withIntent ? await prisma.liveOrderIntent.create({ data: {
        userId: user.id, clientOrderId: `soar_${scenario.label}`,
        payloadHash: `hash-${scenario.label}`,
        payload: { botId: bot.id, walletId: wallet.id, side: 'BUY', quantity: 1 },
        exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'ETHUSDT',
      } }) : null;
      const order = await prisma.order.create({ data: {
        ...(intent ? { id: intent.id } : {}),
        userId: user.id, botId: bot.id, walletId: wallet.id,
        symbol: 'ETHUSDT', side: 'BUY', type: 'LIMIT', status: 'FILLED',
        quantity: Math.max(1, scenario.filled), filledQuantity: scenario.filled,
        feePending: false, feeSource: 'EXCHANGE_FILL',
        exchangeOrderId: `venue-${scenario.label}`,
      } });
      await prisma.trade.create({ data: {
        userId: user.id, botId: bot.id, walletId: wallet.id, orderId: order.id,
        executionMode: 'LIVE', symbol: 'ETHUSDT', side: 'BUY',
        price: 100, quantity: Math.max(1, scenario.filled),
        fee: 0, feeSource: 'EXCHANGE_FILL', feePending: false,
      } });
      for (const [index, quantity] of scenario.fills.entries()) {
        await prisma.orderFill.create({ data: {
          userId: user.id, botId: bot.id, orderId: order.id,
          symbol: 'ETHUSDT', side: 'BUY', exchangeTradeId: `${scenario.label}-${index}`,
          price: 100, quantity, notional: quantity * 100, feeCost: 0,
          feeCurrency: 'USDT', executedAt: new Date(),
        } });
      }
      (scenario.expected ? expectedIds : excludedIds).push(order.id);
    }
    const page = await findLiveFillCandidatePage();
    const selectedIds = page.candidates.map((candidate) => candidate.orderId);
    for (const id of expectedIds) expect(selectedIds).toContain(id);
    for (const id of excludedIds) expect(selectedIds).not.toContain(id);
    expect(page.candidates.filter((candidate) => expectedIds.includes(candidate.orderId)))
      .toHaveLength(expectedIds.length);
    for (const id of expectedIds.slice(0, 6)) {
      expect(page.candidates.find((candidate) => candidate.orderId === id)?.localStatus).toBe('FILLED');
    }
  });

  it.each([
    { label: 'two real executions', requestedQuantity: 1, expectedFillCount: 2, expectedFee: 0.02 },
    { label: 'one duplicated snapshot', requestedQuantity: 0.5, expectedFillCount: 1, expectedFee: 0.01 },
  ])('materializes $label through the adapter and replays without new fills', async ({
    requestedQuantity, expectedFillCount, expectedFee,
  }) => {
    const user = await createEntitledUser({
      data: { email: `orders-live-identical-${requestedQuantity}@example.com`, password: 'hashed' },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id, botName: `Live Identical ${requestedQuantity}`,
      strategyName: `Live Identical Strategy ${requestedQuantity}`, symbol: 'ETHUSDT',
    });
    const fill = {
      order: `identical-${requestedQuantity}`, symbol: 'ETHUSDT',
      side: 'buy', price: 100, amount: 0.5, cost: 50,
      fee: { cost: 0.01, currency: 'USDT', rate: 0.0002 },
    };
    const placeOrder = vi.fn().mockResolvedValue({
      id: `identical-${requestedQuantity}`, status: 'closed', filled: requestedQuantity,
      average: 100, trades: [fill, { ...fill }],
    });
    const client = {
      loadMarkets: vi.fn().mockResolvedValue({}), createOrder: placeOrder,
    } as unknown as CcxtExchangeLikeClient;
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm', marketType: 'future' },
      vi.fn().mockResolvedValue(client), testCreateOrderPermit
    );
    const adapter = new LiveOrderAdapter(connector);
    const executeLiveOrder = vi.fn(async () => {
      const result = await adapter.placeLiveOrderWithFees({ order: {
        symbol: 'ETHUSDT', side: 'buy', type: 'market', amount: requestedQuantity,
        clientOrderId: `soar_identical_${requestedQuantity}`,
      } });
      return { ...result, status: 'FILLED' as const };
    });
    const lookupLiveOrder = vi.fn();
    const payload = {
      botId: bot.id, symbol: 'ETHUSDT', side: 'BUY' as const,
      type: 'MARKET' as const, quantity: requestedQuantity, mode: 'LIVE' as const,
      riskAck: true, clientOrderId: `soar_identical_${requestedQuantity}`,
    };
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const order = await openOrder(user.id, payload, { executeLiveOrder, lookupLiveOrder });
      expect(order.status).toBe('FILLED');
      expect(order.positionId).toBeTruthy();
      expect(order.fee).toBeCloseTo(expectedFee, 10);
      expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(expectedFillCount);
      const retried = await openOrder(user.id, payload, { executeLiveOrder, lookupLiveOrder });
      expect(retried.id).toBe(order.id);
      expect(placeOrder).toHaveBeenCalledTimes(1);
      expect(lookupLiveOrder).not.toHaveBeenCalled();
      expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(expectedFillCount);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it.each([
    { label: 'missing fee', explicitZero: false, expectedFee: null, expectedPending: true },
    { label: 'explicit zero fee', explicitZero: true, expectedFee: 0, expectedPending: false },
  ])('preserves $label through raw CCXT, adapter, Order, and replay', async ({
    explicitZero, expectedFee, expectedPending,
  }) => {
    const user = await createEntitledUser({
      data: { email: `orders-live-fee-${explicitZero}@example.com`, password: 'hashed' },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id, botName: `Live Fee ${explicitZero}`,
      strategyName: `Live Fee Strategy ${explicitZero}`, symbol: 'ETHUSDT',
    });
    const rawFill = {
      order: `fee-${explicitZero}`, symbol: 'ETHUSDT', side: 'buy',
      price: 100, amount: 1, cost: 100,
      ...(explicitZero ? { fee: { cost: 0, currency: 'USDT', rate: 0 } } : {}),
    };
    const placeOrder = vi.fn().mockResolvedValue({
      id: `fee-${explicitZero}`, status: 'closed', filled: 1, average: 100,
      trades: [rawFill],
    });
    const client = {
      loadMarkets: vi.fn().mockResolvedValue({}), createOrder: placeOrder,
    } as unknown as CcxtExchangeLikeClient;
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm', marketType: 'future' },
      vi.fn().mockResolvedValue(client), testCreateOrderPermit
    );
    const adapter = new LiveOrderAdapter(connector);
    const executeLiveOrder = vi.fn(async () => {
      const result = await adapter.placeLiveOrderWithFees({ order: {
        symbol: 'ETHUSDT', side: 'buy', type: 'market', amount: 1,
        clientOrderId: `soar_fee_${explicitZero}`,
      } });
      return { ...result, status: 'FILLED' as const };
    });
    const payload = {
      botId: bot.id, symbol: 'ETHUSDT', side: 'BUY' as const,
      type: 'MARKET' as const, quantity: 1, mode: 'LIVE' as const,
      riskAck: true, clientOrderId: `soar_fee_${explicitZero}`,
    };
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const order = await openOrder(user.id, payload, { executeLiveOrder });
      expect(order.status).toBe('FILLED');
      expect(order.positionId).toBeTruthy();
      expect(order.fee).toBe(expectedFee);
      expect(order.feePending).toBe(expectedPending);
      expect(order.feeSource).toBe(explicitZero ? 'EXCHANGE_FILL' : 'ESTIMATED');
      const fill = await prisma.orderFill.findFirstOrThrow({ where: { orderId: order.id } });
      expect(fill.feeCost).toBe(expectedFee);
      expect(fill.exchangeTradeId).toMatch(/^soar-fill-/);
      const replayed = await openOrder(user.id, payload, { executeLiveOrder });
      expect(replayed.id).toBe(order.id);
      expect(placeOrder).toHaveBeenCalledTimes(1);
      expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(1);
      if (!explicitZero) {
        const feeEvent = {
          eventType: 'ORDER_TRADE_UPDATE' as const, marketType: 'FUTURES' as const,
          eventTime: 4_000, transactionTime: 4_001,
          symbol: 'ETHUSDT', side: 'BUY' as const, orderType: 'MARKET',
          orderStatus: 'FILLED', executionType: 'TRADE',
          exchangeOrderId: 'fee-false', clientOrderId: payload.clientOrderId,
          averagePrice: 100, cumulativeFilledQuantity: 1,
          lastFilledQuantity: 1, lastFilledPrice: 100,
          fee: 0.01, feeCurrency: 'USDT', exchangeTradeId: 'late-fee-trade', raw: {},
        };
        await applyLiveExchangeOrderTradeUpdateEvent({ userId: user.id, event: feeEvent });
        await applyLiveExchangeOrderTradeUpdateEvent({ userId: user.id, event: feeEvent });
        const backfilledOrder = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
        const backfilledFill = await prisma.orderFill.findFirstOrThrow({ where: { orderId: order.id } });
        expect(backfilledOrder.fee).toBeCloseTo(0.01, 10);
        expect(backfilledOrder.feePending).toBe(false);
        expect(backfilledOrder.feeSource).toBe('EXCHANGE_FILL');
        expect(backfilledFill.id).toBe(fill.id);
        expect(backfilledFill.exchangeTradeId).toBe(fill.exchangeTradeId);
        expect(backfilledFill.feeCost).toBeCloseTo(0.01, 10);
        expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(1);
      }
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('keeps the intent UNKNOWN when identical unidentified fills cannot explain the venue quantity', async () => {
    const user = await createEntitledUser({
      data: { email: 'orders-live-ambiguous-fills@example.com', password: 'hashed' },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id, botName: 'Live Ambiguous Fills',
      strategyName: 'Live Ambiguous Fill Strategy', symbol: 'ETHUSDT',
    });
    const rawFill = {
      order: 'ambiguous-fill-order', symbol: 'ETHUSDT',
      side: 'buy', price: 100, amount: 0.5, cost: 50,
      fee: { cost: 0.01, currency: 'USDT', rate: 0.0002 },
    };
    const placeOrder = vi.fn().mockResolvedValue({
      id: 'ambiguous-fill-order', status: 'closed', filled: 0.75,
      average: 100, trades: [rawFill, { ...rawFill }],
    });
    const client = {
      loadMarkets: vi.fn().mockResolvedValue({}), createOrder: placeOrder,
    } as unknown as CcxtExchangeLikeClient;
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm', marketType: 'future' },
      vi.fn().mockResolvedValue(client), testCreateOrderPermit
    );
    const adapter = new LiveOrderAdapter(connector);
    const fill = {
      exchangeTradeId: null, exchangeOrderId: 'ambiguous-fill-order',
      symbol: 'ETHUSDT', side: 'buy', price: 100, quantity: 0.5,
      notional: 50, feeCost: 0.01, feeCurrency: 'USDT', feeRate: 0.0002,
      executedAt: null, source: 'createOrder' as const, raw: rawFill,
    };
    const executeLiveOrder = vi.fn(async () => {
      const result = await adapter.placeLiveOrderWithFees({ order: {
        symbol: 'ETHUSDT', side: 'buy', type: 'market', amount: 1,
        clientOrderId: 'soar_ambiguous_fill_order',
      } });
      return { ...result, status: 'FILLED' as const };
    });
    const lookupLiveOrder = vi.fn(async () => {
      await reconcileLiveOrderFee(connector, {
        symbol: 'ETHUSDT', exchangeOrderId: 'ambiguous-fill-order',
        exchangeFilledQuantity: 0.75, inlineFills: [fill, { ...fill }],
      });
      throw new Error('unreachable');
    });
    const payload = {
      botId: bot.id, symbol: 'ETHUSDT', side: 'BUY' as const,
      type: 'MARKET' as const, quantity: 1, mode: 'LIVE' as const,
      riskAck: true, clientOrderId: 'soar_ambiguous_fill_order',
    };
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      await expect(openOrder(user.id, payload, { executeLiveOrder, lookupLiveOrder }))
        .rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveExecutionUnknown });
      const inconsistentLookup = vi.fn().mockResolvedValue({
        exchangeOrderId: 'ambiguous-fill-order', status: 'FILLED' as const,
        exchangeFilledQuantity: 1, exchangeAverageFillPrice: 100, fills: [fill],
      });
      await expect(openOrder(user.id, payload, {
        executeLiveOrder, lookupLiveOrder: inconsistentLookup,
      })).rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveExecutionUnknown });
      expect(placeOrder).toHaveBeenCalledTimes(1);
      expect(lookupLiveOrder).toHaveBeenCalledTimes(1);
      expect(inconsistentLookup).toHaveBeenCalledTimes(1);
      expect(await prisma.liveOrderIntent.count({ where: { userId: user.id } })).toBe(1);
      expect(await prisma.order.count({ where: { userId: user.id } })).toBe(0);
      expect(await prisma.orderFill.count({ where: { userId: user.id } })).toBe(0);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('persists the intent before submission and recovers a timeout without resubmitting', async () => {
    const user = await createEntitledUser({
      data: { email: 'orders-live-timeout-recovery@example.com', password: 'hashed' },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id, botName: 'Timeout bot', strategyName: 'Timeout strategy', symbol: 'BTCUSDT',
    });
    const payload = {
      botId: bot.id, symbol: 'BTCUSDT', side: 'BUY' as const, type: 'LIMIT' as const,
      quantity: 0.01, price: 60_000, mode: 'LIVE' as const, riskAck: true,
      clientOrderId: 'soar_timeout_recovery_1',
    };
    const executeLiveOrder = vi.fn(async () => {
      const intent = await prisma.liveOrderIntent.findUnique({
        where: { clientOrderId: payload.clientOrderId },
      });
      expect(intent).not.toBeNull();
      throw new Error('network timeout after acceptance');
    });
    const lookupLiveOrder = vi.fn(async () => ({
      exchangeOrderId: 'exchange-accepted-1', status: 'FILLED' as const,
      exchangeFilledQuantity: 0.01, exchangeAverageFillPrice: 60_000,
    }));
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const first = await openOrder(user.id, payload, { executeLiveOrder, lookupLiveOrder });
      const retried = await openOrder(user.id, payload, { executeLiveOrder, lookupLiveOrder });
      expect(first.id).toBe(retried.id);
      expect(first.exchangeOrderId).toBe('exchange-accepted-1');
      expect(first.status).toBe('FILLED');
      expect(first.positionId).toBeTruthy();
      expect(executeLiveOrder).toHaveBeenCalledTimes(1);
      expect(lookupLiveOrder).toHaveBeenCalledTimes(1);
      expect(await prisma.order.count({ where: { id: first.id } })).toBe(1);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('keeps an unresolved timeout durable and only looks up on a later retry', async () => {
    const user = await createEntitledUser({
      data: { email: 'orders-live-unknown-retry@example.com', password: 'hashed' },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id, botName: 'Unknown bot', strategyName: 'Unknown strategy', symbol: 'ETHUSDT',
    });
    const payload = {
      botId: bot.id, symbol: 'ETHUSDT', side: 'BUY' as const, type: 'LIMIT' as const,
      quantity: 0.02, price: 3_000, mode: 'LIVE' as const, riskAck: true, origin: 'BOT' as const,
      clientOrderId: 'soar_unknown_retry_1',
    };
    const executeLiveOrder = vi.fn().mockRejectedValue(new Error('timeout'));
    const lookupLiveOrder = vi.fn()
      .mockRejectedValueOnce(new Error('not found'))
      .mockResolvedValueOnce({ exchangeOrderId: 'exchange-later-1', status: 'OPEN' });
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      await expect(openOrder(user.id, payload, { executeLiveOrder, lookupLiveOrder }))
        .rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveExecutionUnknown });
      const intent = await prisma.liveOrderIntent.findUnique({
        where: { clientOrderId: payload.clientOrderId },
      });
      expect(intent).not.toBeNull();
      expect(await prisma.order.count({ where: { id: intent!.id } })).toBe(0);
      const recovered = await openOrder(user.id, { ...payload, quantity: 0.03, price: 3_100 }, { executeLiveOrder, lookupLiveOrder });
      expect(recovered.id).toBe(intent!.id);
      expect(recovered.exchangeOrderId).toBe('exchange-later-1');
      expect(recovered.quantity).toBe(0.02);
      expect(recovered.price).toBe(3_000);
      expect(lookupLiveOrder.mock.calls[1]?.[0].payload).toMatchObject({ quantity: 0.02, price: 3_000 });
      expect(executeLiveOrder).toHaveBeenCalledTimes(1);
      expect(lookupLiveOrder).toHaveBeenCalledTimes(2);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('recovers a DCA accepted before timeout with original parameters and one local add', async () => {
    const user = await createEntitledUser({
      data: { email: 'orders-live-dca-timeout@example.com', password: 'hashed' },
    });
    const { bot, wallet, strategy } = await createLiveScopedBotContext({
      userId: user.id, botName: 'DCA timeout bot', strategyName: 'DCA timeout strategy', symbol: 'ETHUSDT',
    });
    const position = await prisma.position.create({ data: {
      userId: user.id, botId: bot.id, walletId: wallet.id, strategyId: strategy.id,
      symbol: 'ETHUSDT', side: 'LONG', status: 'OPEN', entryPrice: 3_000, quantity: 1,
    } });
    const dedupeKey = buildDcaExecutionDedupeKey({
      userId: user.id, botId: bot.id, symbol: 'ETHUSDT',
      positionId: position.id, dcaLevelIndex: 0, positionSide: 'LONG',
    });
    const clientOrderId = buildRuntimeClientOrderId(dedupeKey);
    await prisma.runtimeExecutionDedupe.create({ data: {
      dedupeKey, dedupeVersion: 'v1', commandType: 'DCA', userId: user.id,
      botId: bot.id, symbol: 'ETHUSDT', commandFingerprint: { positionId: position.id },
      ttlExpiresAt: new Date(Date.now() + 86_400_000),
    } });
    const payload = {
      botId: bot.id, walletId: wallet.id, strategyId: strategy.id, positionId: position.id,
      origin: 'BOT' as const, symbol: 'ETHUSDT', side: 'BUY' as const, type: 'MARKET' as const,
      quantity: 0.2, price: 2_900, mode: 'LIVE' as const, riskAck: true, clientOrderId,
    };
    const executeLiveOrder = vi.fn().mockRejectedValue(new Error('timeout after acceptance'));
    const lookupLiveOrder = vi.fn()
      .mockRejectedValueOnce(new Error('lookup temporarily unavailable'))
      .mockResolvedValueOnce({ exchangeOrderId: 'exchange-dca-timeout-1', status: 'FILLED',
        exchangeFilledQuantity: 0.2, exchangeAverageFillPrice: 2_900 });
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      await expect(openOrder(user.id, payload, { executeLiveOrder, lookupLiveOrder }))
        .rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveExecutionUnknown });
      await runtimeExecutionDedupeService.markFailed({ dedupeKey, errorClass: 'live_execution_unknown' });
      expect(await runtimeExecutionDedupeService.acquire({
        dedupeKey, commandType: 'DCA', userId: user.id, botId: bot.id,
        symbol: 'ETHUSDT', commandFingerprint: { positionId: position.id },
      })).toMatchObject({ outcome: 'execute' });

      const order = await openOrder(user.id, { ...payload, quantity: 0.4, price: 2_800 },
        { executeLiveOrder, lookupLiveOrder });
      expect(order).toMatchObject({ status: 'FILLED', quantity: 0.2, price: 2_900,
        positionId: position.id, origin: 'BOT' });
      expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).quantity).toBe(1);
      await finalizeRuntimeDcaFill({
        userId: user.id, botId: bot.id, walletId: wallet.id, strategyId: strategy.id,
        positionId: position.id, order, dedupeKey, fillPrice: 2_900,
        fillQuantity: 0.2, feePaid: 0.1, mode: 'LIVE',
      });
      expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).quantity).toBe(1.2);
      expect(await prisma.trade.count({ where: { orderId: order.id, lifecycleAction: 'DCA' } })).toBe(1);
      expect(executeLiveOrder).toHaveBeenCalledTimes(1);
      expect(lookupLiveOrder).toHaveBeenCalledTimes(2);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('uses one local order when a concurrent retry recovers before the first response', async () => {
    const user = await createEntitledUser({
      data: { email: 'orders-live-concurrent-recovery@example.com', password: 'hashed' },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id, botName: 'Concurrent bot', strategyName: 'Concurrent strategy', symbol: 'ADAUSDT',
    });
    const payload = {
      botId: bot.id, symbol: 'ADAUSDT', side: 'BUY' as const, type: 'LIMIT' as const,
      quantity: 1, price: 1, mode: 'LIVE' as const, riskAck: true,
      clientOrderId: 'soar_concurrent_recovery_1',
    };
    let releaseSubmission!: () => void;
    const submissionHeld = new Promise<void>((resolve) => { releaseSubmission = resolve; });
    const executeLiveOrder = vi.fn(async () => {
      await submissionHeld;
      return { exchangeOrderId: 'exchange-concurrent-1', status: 'OPEN' as const };
    });
    const lookupLiveOrder = vi.fn(async () => ({
      exchangeOrderId: 'exchange-concurrent-1', status: 'OPEN' as const,
    }));
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const firstPromise = openOrder(user.id, payload, { executeLiveOrder, lookupLiveOrder });
      await vi.waitFor(() => expect(executeLiveOrder).toHaveBeenCalledTimes(1));
      const second = await openOrder(user.id, payload, { executeLiveOrder, lookupLiveOrder });
      releaseSubmission();
      const first = await firstPromise;
      expect(first.id).toBe(second.id);
      expect(executeLiveOrder).toHaveBeenCalledTimes(1);
      expect(lookupLiveOrder).toHaveBeenCalledTimes(1);
      expect(await prisma.order.count({ where: { id: first.id } })).toBe(1);
    } finally {
      releaseSubmission();
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('rolls back the local order if materialization fails before commit', async () => {
    const user = await createEntitledUser({
      data: { email: 'orders-live-atomic-materialization@example.com', password: 'hashed' },
    });
    const intent = await prisma.liveOrderIntent.create({
      data: {
        userId: user.id, clientOrderId: 'soar_atomic_materialization_1', payloadHash: 'test',
        exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'BTCUSDT',
      },
    });
    const input = {
      userId: user.id, exchangeOrderId: 'atomic-exchange-order-1', intentId: intent.id,
      clientOrderId: intent.clientOrderId,
      data: {
        id: intent.id, userId: user.id, symbol: 'BTCUSDT', side: 'BUY' as const,
        type: 'MARKET' as const, status: 'FILLED' as const, quantity: 1,
        exchangeOrderId: 'atomic-exchange-order-1',
      },
    };
    await expect(createOrderForLiveIntent({
      ...input, materialize: async () => { throw new Error('fill write failed'); },
    })).rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveExecutionUnknown });
    expect(await prisma.order.count({ where: { id: intent.id } })).toBe(0);
    const retried = await createOrderForLiveIntent({
      ...input, materialize: async (tx, order) => {
        await tx.orderFill.create({
          data: {
            userId: user.id, orderId: order.id, symbol: 'BTCUSDT', side: 'BUY',
            exchangeTradeId: 'atomic-fill-1', price: 100, quantity: 1, notional: 100,
            executedAt: new Date(),
          },
        });
        return order;
      },
    });
    expect(retried.reused).toBe(false);
    expect(await prisma.orderFill.count({ where: { orderId: intent.id } })).toBe(1);
  });

  it('rolls back runtime OPEN Position, Trade, and telemetry when interrupted before Trade', async () => {
    const user = await createEntitledUser({
      data: { email: 'orders-live-runtime-open-atomic@example.com', password: 'hashed' },
    });
    const { bot, wallet, strategy } = await createLiveScopedBotContext({
      userId: user.id, botName: 'Atomic runtime OPEN',
      strategyName: 'Atomic runtime OPEN strategy', symbol: 'BTCUSDT',
    });
    const session = await prisma.botRuntimeSession.create({ data: {
      userId: user.id, botId: bot.id, mode: 'LIVE',
    } });
    const clientOrderId = buildRuntimeClientOrderId(`atomic-open-${user.id}`);
    const intent = await prisma.liveOrderIntent.create({ data: {
      userId: user.id, clientOrderId, payloadHash: 'atomic-open-test',
      exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'BTCUSDT',
    } });
    const now = new Date();
    const payload = { botId: bot.id, walletId: wallet.id, strategyId: strategy.id,
      origin: 'BOT' as const, symbol: 'BTCUSDT', side: 'BUY' as const,
      type: 'MARKET' as const, quantity: 1, mode: 'LIVE' as const,
      riskAck: true, clientOrderId, runtimeSessionId: session.id };
    const data = { id: intent.id, userId: user.id, botId: bot.id,
      walletId: wallet.id, strategyId: strategy.id, origin: 'BOT' as const,
      symbol: 'BTCUSDT', side: 'BUY' as const, type: 'MARKET' as const,
      status: 'FILLED' as const, quantity: 1, filledQuantity: 1,
      fee: 0.1, feeSource: 'EXCHANGE_FILL' as const,
      exchangeOrderId: 'atomic-runtime-open-venue-1', submittedAt: now, filledAt: now };
    const input = { userId: user.id, exchangeOrderId: data.exchangeOrderId,
      intentId: intent.id, clientOrderId, data };
    const materialize = (crash: boolean) => async (tx: Parameters<NonNullable<Parameters<typeof createOrderForLiveIntent>[0]['materialize']>>[0],
      order: Parameters<NonNullable<Parameters<typeof createOrderForLiveIntent>[0]['materialize']>>[1]) =>
      materializeLiveOrderInTransaction({ tx, order, userId: user.id, payload,
        fillPrice: 100, fillQuantity: 1, applyFillLifecycle: true, fills: [], now,
        ...(crash ? { afterPositionWrite: async () => { throw new Error('crash after Position'); } } : {}) });
    await expect(createOrderForLiveIntent({ ...input, materialize: materialize(true) }))
      .rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveExecutionUnknown });
    expect(await prisma.order.count({ where: { id: intent.id } })).toBe(0);
    expect(await prisma.position.count({ where: { userId: user.id } })).toBe(0);
    expect(await prisma.trade.count({ where: { userId: user.id } })).toBe(0);
    expect(await prisma.botRuntimeEvent.count({ where: { sessionId: session.id } })).toBe(0);
    expect(await prisma.botRuntimeSymbolStat.count({ where: { sessionId: session.id } })).toBe(0);
    const recovered = await createOrderForLiveIntent({ ...input, materialize: materialize(false) });
    expect(recovered.reused).toBe(false);
    expect(recovered.order.positionId).toBeTruthy();
    expect(await prisma.position.count({ where: { userId: user.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: intent.id, lifecycleAction: 'OPEN' } })).toBe(1);
    expect(await prisma.botRuntimeEvent.count({ where: { sessionId: session.id, eventType: 'POSITION_OPENED' } })).toBe(1);
    expect((await prisma.botRuntimeSymbolStat.findUniqueOrThrow({
      where: { sessionId_symbol: { sessionId: session.id, symbol: 'BTCUSDT' } },
    })).openPositionCount).toBe(1);
    expect((await createOrderForLiveIntent({ ...input, materialize: materialize(false) })).reused).toBe(true);
  });

  it('materializes runtime OPEN telemetry through the normal durable order path', async () => {
    const user = await createEntitledUser({
      data: { email: 'orders-live-runtime-open-path@example.com', password: 'hashed' },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id, botName: 'Runtime OPEN path',
      strategyName: 'Runtime OPEN path strategy', symbol: 'BTCUSDT',
    });
    const session = await prisma.botRuntimeSession.create({ data: {
      userId: user.id, botId: bot.id, mode: 'LIVE',
    } });
    const dedupe = await prisma.runtimeExecutionDedupe.create({ data: {
      dedupeKey: `v1|OPEN|${user.id}|path`, dedupeVersion: 'v1',
      commandType: 'OPEN', userId: user.id, botId: bot.id,
      symbol: 'BTCUSDT', status: 'PENDING', commandFingerprint: {},
      ttlExpiresAt: new Date(Date.now() + 86_400_000),
    } });
    const payload = { botId: bot.id, origin: 'BOT' as const,
      symbol: 'BTCUSDT', side: 'BUY' as const, type: 'MARKET' as const,
      quantity: 1, mode: 'LIVE' as const, riskAck: true,
      clientOrderId: buildRuntimeClientOrderId(`runtime-open-${user.id}`),
      runtimeSessionId: session.id, runtimeDedupeKey: dedupe.dedupeKey };
    const executeLiveOrder = vi.fn().mockResolvedValue({
      exchangeOrderId: 'runtime-open-venue-path-1', status: 'FILLED',
      exchangeFilledQuantity: 1, exchangeAverageFillPrice: 100,
      fee: 0.1, feeSource: 'EXCHANGE_FILL', feePending: false,
      feeCurrency: 'USDT', exchangeTradeId: 'runtime-open-fill-path-1',
    });
    const previousNodeEnv = process.env.NODE_ENV;
    let openedPositionId: string | null = null;
    process.env.NODE_ENV = 'development';
    try {
      const order = await openOrder(user.id, payload, { executeLiveOrder });
      expect(order.positionId).toBeTruthy();
      openedPositionId = order.positionId;
      expect(await runtimePositionStateStore.getTrustedPositionRuntimeState(order.positionId!))
        .toMatchObject({ quantity: 1, averageEntryPrice: 100, currentAdds: 0 });
      expect(await prisma.trade.count({ where: { orderId: order.id, lifecycleAction: 'OPEN' } })).toBe(1);
      expect(await prisma.runtimeExecutionDedupe.findUniqueOrThrow({
        where: { id: dedupe.id },
      })).toMatchObject({ status: 'SUCCEEDED', orderId: order.id, positionId: order.positionId });
      expect(await prisma.botRuntimeEvent.count({ where: {
        sessionId: session.id, eventType: 'POSITION_OPENED',
      } })).toBe(1);
      expect(await prisma.botRuntimeSymbolStat.findUniqueOrThrow({
        where: { sessionId_symbol: { sessionId: session.id, symbol: 'BTCUSDT' } },
      })).toMatchObject({ openPositionCount: 1, openPositionQty: 1, feesPaid: 0.1 });
      const replay = await openOrder(user.id, payload, { executeLiveOrder });
      expect(replay.id).toBe(order.id);
      expect(executeLiveOrder).toHaveBeenCalledTimes(1);
      expect(await prisma.trade.count({ where: { orderId: order.id, lifecycleAction: 'OPEN' } })).toBe(1);
      await runtimePositionStateStore.deletePositionRuntimeState(order.positionId!);
      await openOrder(user.id, payload, { executeLiveOrder });
      expect(await runtimePositionStateStore.getTrustedPositionRuntimeState(order.positionId!)).toBeNull();
    } finally {
      if (openedPositionId) await runtimePositionStateStore.deletePositionRuntimeState(openedPositionId);
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('recovers an older filled runtime intent without a stored session by lookup only', async () => {
    const user = await createEntitledUser({
      data: { email: 'orders-live-runtime-old-intent@example.com', password: 'hashed' },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id, botName: 'Old runtime intent',
      strategyName: 'Old runtime intent strategy', symbol: 'BTCUSDT',
    });
    const session = await prisma.botRuntimeSession.create({ data: {
      userId: user.id, botId: bot.id, mode: 'LIVE',
    } });
    const clientOrderId = buildRuntimeClientOrderId(`older-open-${user.id}`);
    const payload = { botId: bot.id, origin: 'BOT' as const,
      symbol: 'BTCUSDT', side: 'BUY' as const, type: 'MARKET' as const,
      quantity: 1, mode: 'LIVE' as const, riskAck: true, clientOrderId };
    const filled = { exchangeOrderId: 'older-runtime-open-venue-1', status: 'FILLED' as const,
      exchangeFilledQuantity: 1, exchangeAverageFillPrice: 100,
      fee: 0, feeSource: 'EXCHANGE_FILL' as const, feePending: false };
    const executeLiveOrder = vi.fn().mockResolvedValue(filled);
    const lookupLiveOrder = vi.fn().mockResolvedValue(filled);
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      await expect(openOrder(user.id, payload, { executeLiveOrder, lookupLiveOrder }))
        .rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveExecutionUnknown });
      const intent = await prisma.liveOrderIntent.findUniqueOrThrow({ where: { clientOrderId } });
      expect(await prisma.order.count({ where: { id: intent.id } })).toBe(0);
      expect(await prisma.position.count({ where: { userId: user.id } })).toBe(0);
      const recovered = await openOrder(user.id, { ...payload, runtimeSessionId: session.id },
        { executeLiveOrder, lookupLiveOrder });
      expect(recovered.positionId).toBeTruthy();
      expect(executeLiveOrder).toHaveBeenCalledTimes(1);
      expect(lookupLiveOrder).toHaveBeenCalledTimes(1);
      expect(await prisma.trade.count({ where: { orderId: intent.id, lifecycleAction: 'OPEN' } })).toBe(1);
      expect(await prisma.botRuntimeEvent.count({ where: {
        sessionId: session.id, eventType: 'POSITION_OPENED',
      } })).toBe(1);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('derives a stable Gate.io client ID within the venue limit', async () => {
    const user = await createEntitledUser({
      data: { email: 'orders-gate-client-id@example.com', password: 'hashed' },
    });
    const { bot, wallet, universe } = await createLiveScopedBotContext({
      userId: user.id, botName: 'Gate bot', strategyName: 'Gate strategy', symbol: 'BTCUSDT',
    });
    await prisma.wallet.update({ where: { id: wallet.id }, data: { exchange: 'GATEIO' } });
    await prisma.marketUniverse.update({ where: { id: universe.id }, data: { exchange: 'GATEIO' } });
    await prisma.bot.update({ where: { id: bot.id }, data: { exchange: 'GATEIO' } });
    await prisma.apiKey.update({ where: { id: bot.apiKeyId! }, data: { exchange: 'GATEIO' } });
    const runtimeId = 'soar_123456789012345678901234';
    const executeLiveOrder = vi.fn(async ({ payload }: { payload: { clientOrderId?: string | null } }) => {
      expect(payload.clientOrderId).toMatch(/^soar_[A-Za-z0-9_-]{22}$/);
      expect(payload.clientOrderId?.length).toBe(27);
      return { exchangeOrderId: 'gate-order-1', status: 'OPEN' as const };
    });
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const payload = {
        botId: bot.id, symbol: 'BTCUSDT', side: 'BUY' as const, type: 'LIMIT' as const,
        quantity: 1, price: 100, mode: 'LIVE' as const, riskAck: true,
        clientOrderId: runtimeId,
      };
      const first = await openOrder(user.id, payload, { executeLiveOrder });
      const retried = await openOrder(user.id, payload, { executeLiveOrder });
      expect(retried.id).toBe(first.id);
      expect(executeLiveOrder).toHaveBeenCalledTimes(1);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('does not duplicate an exchange order imported while its submit result was unknown', async () => {
    const user = await createEntitledUser({
      data: { email: 'orders-live-imported-recovery@example.com', password: 'hashed' },
    });
    const { bot } = await createLiveScopedBotContext({
      userId: user.id, botName: 'Imported bot', strategyName: 'Imported strategy', symbol: 'SOLUSDT',
    });
    const payload = {
      botId: bot.id, symbol: 'SOLUSDT', side: 'BUY' as const, type: 'LIMIT' as const,
      quantity: 2, price: 100, mode: 'LIVE' as const, riskAck: true,
      clientOrderId: 'soar_imported_recovery_1',
    };
    const executeLiveOrder = vi.fn().mockRejectedValue(new Error('timeout'));
    const lookupLiveOrder = vi.fn()
      .mockRejectedValueOnce(new Error('not found'))
      .mockResolvedValue({ exchangeOrderId: 'exchange-imported-1', status: 'OPEN' });
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      await expect(openOrder(user.id, payload, { executeLiveOrder, lookupLiveOrder }))
        .rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveExecutionUnknown });
      const imported = await prisma.order.create({
        data: {
          userId: user.id, botId: bot.id, symbol: 'SOLUSDT', side: 'BUY', type: 'LIMIT',
          status: 'OPEN', origin: 'EXCHANGE_SYNC', quantity: 2, price: 100,
          exchangeOrderId: 'exchange-imported-1',
        },
      });
      await expect(openOrder(user.id, payload, { executeLiveOrder, lookupLiveOrder }))
        .rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveExecutionUnknown });
      expect(await prisma.order.count({ where: { userId: user.id } })).toBe(1);
      expect(await prisma.order.findUnique({ where: { id: imported.id } })).not.toBeNull();
      expect(executeLiveOrder).toHaveBeenCalledTimes(1);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

});
