import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { openOrder } from './orders.service';
import { createOrderForLiveIntent } from './orders.liveIntent.service';
import { ORDER_ERROR_CODES } from './orders.errors';
import { ensureSubscriptionCatalog } from '../subscriptions/subscriptions.service';
import { SubscriptionEntitlementsSchema } from '../subscriptions/subscriptionEntitlements.service';
import { buildDcaExecutionDedupeKey, runtimeExecutionDedupeService } from '../engine/runtimeExecutionDedupe.service';
import { buildRuntimeClientOrderId } from '../engine/runtimeExecutionClientOrderId';
import { finalizeRuntimeDcaFill } from '../engine/runtimeImmediateFillFinalizer.service';
import { LiveOrderAdapter } from '../exchange/liveOrderAdapter.service';
import { CcxtFuturesConnector, type CcxtExchangeLikeClient } from '../exchange/ccxtFuturesConnector.service';
import { reconcileLiveOrderFee } from '../exchange/liveFeeReconciliation.service';

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
      apiKeyId: params.apiKeyId ?? null,
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

const allowLive = async () => {
  await ensureSubscriptionCatalog(prisma, { seedDefaults: true });
  const freePlan = await prisma.subscriptionPlan.findUniqueOrThrow({
    where: { code: 'FREE' },
    select: { entitlements: true },
  });
  const entitlements = SubscriptionEntitlementsSchema.parse(freePlan.entitlements);
  await prisma.subscriptionPlan.update({
    where: { code: 'FREE' },
    data: {
      entitlements: {
        ...entitlements,
        features: { ...entitlements.features, liveTrading: true },
      },
    },
  });
};

describe('durable LIVE order intent', () => {
  afterAll(async () => { await cleanupDb(); });
  beforeEach(async () => {
    await cleanupDb();
    await allowLive();
  });

  it.each([
    { label: 'two real executions', requestedQuantity: 1, expectedFillCount: 2, expectedFee: 0.02 },
    { label: 'one duplicated snapshot', requestedQuantity: 0.5, expectedFillCount: 1, expectedFee: 0.01 },
  ])('materializes $label through the adapter and replays without new fills', async ({
    requestedQuantity, expectedFillCount, expectedFee,
  }) => {
    const user = await prisma.user.create({
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
      vi.fn().mockResolvedValue(client)
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

  it('keeps the intent UNKNOWN when identical unidentified fills cannot explain the venue quantity', async () => {
    const user = await prisma.user.create({
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
      vi.fn().mockResolvedValue(client)
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
    const user = await prisma.user.create({
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
    const user = await prisma.user.create({
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
    const user = await prisma.user.create({
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
    const user = await prisma.user.create({
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
    const user = await prisma.user.create({
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

  it('derives a stable Gate.io client ID within the venue limit', async () => {
    const user = await prisma.user.create({
      data: { email: 'orders-gate-client-id@example.com', password: 'hashed' },
    });
    const { bot, wallet, universe } = await createLiveScopedBotContext({
      userId: user.id, botName: 'Gate bot', strategyName: 'Gate strategy', symbol: 'BTCUSDT',
    });
    await prisma.wallet.update({ where: { id: wallet.id }, data: { exchange: 'GATEIO' } });
    await prisma.marketUniverse.update({ where: { id: universe.id }, data: { exchange: 'GATEIO' } });
    await prisma.bot.update({ where: { id: bot.id }, data: { exchange: 'GATEIO' } });
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
    const user = await prisma.user.create({
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
