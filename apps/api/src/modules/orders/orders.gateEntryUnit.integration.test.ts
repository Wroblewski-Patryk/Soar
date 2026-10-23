import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { createEntitledUser } from '../../test/createEntitledUser';
import { hashPassword } from '../../utils/hash';
import { createExternalClientGrant } from '../externalClientGrants/externalClientGrants.service';
import { bindExternalClientGrantReservationIntent } from '../externalClientGrants/externalClientGrantReservation.service';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { createLiveScopedBotContext } from './orders.service.fixture';
import { openOrder, prepareOpenOrderRiskContext } from './orders.service';
import * as ordersService from './orders.service';
import { createOrderForLiveIntent, executeDurableLiveOrder, fingerprintLiveOrderIntentPayload,
  materializeLiveOrderInTransaction, persistOrReuseLiveOrderIntent } from './orders.liveIntent.service';
import { assertExistingGateEntryOrderContractUnit } from './orders.positionScope';
import { ORDER_ERROR_CODES } from './orders.errors';
import { applyLiveExchangeOrderTradeUpdateEvent } from './orders.exchangeEvents.service';
import type { GateFuturesEconomicsSnapshot } from '../exchange/gateFuturesEconomics';
import { gateFuturesEconomicsFromMarket } from '../exchange/gateFuturesEconomics';
import type { CcxtFuturesOrderFill } from '../exchange/ccxtFuturesConnector.types';
import { assertPreparedGateEntryContractUnit, enforceLivePretradeGuards,
  type SymbolTradingRules } from './orders.quantityRules';
import { admitInternalGateNonunitMockEntry } from '../../test/internalGateNonunitMockAdmission';
import { matchesInternalGateNonunitMockPermit } from './orders.internalGateNonunitMock';

const users: string[] = [];
const password = 'GateEntryTest1234';
const symbolRules = async () => ({ minQuantity: 0.001, minNotional: 1,
  quantityStep: 0.001, priceStep: 0.01, contractSize: 1,
  quoteCurrency: 'USDT', settleCurrency: 'USDT', isContract: true,
  isLinear: true, isInverse: false });

const fixture = async () => {
  const user = await createEntitledUser({ data: {
    email: `gate-entry-${randomUUID()}@example.com`, password: await hashPassword(password),
  } });
  users.push(user.id);
  await ensureSubscriptionCatalog(prisma, { seedDefaults: true });
  await setActiveSubscriptionForUser(prisma, { userId: user.id, planCode: 'ADVANCED',
    source: 'ADMIN_OVERRIDE', autoRenew: false });
  const context = await createLiveScopedBotContext({ userId: user.id,
    botName: `Gate entry ${randomUUID()}`, strategyName: 'Gate entry strategy', symbol: 'BTCUSDT' });
  await prisma.wallet.update({ where: { id: context.wallet.id }, data: { exchange: 'GATEIO' } });
  await prisma.marketUniverse.update({ where: { id: context.universe.id }, data: { exchange: 'GATEIO' } });
  await prisma.bot.update({ where: { id: context.bot.id }, data: { exchange: 'GATEIO' } });
  await prisma.apiKey.update({ where: { id: context.bot.apiKeyId! }, data: { exchange: 'GATEIO' } });
  const legacy = await prisma.order.create({ data: {
    userId: user.id, botId: context.bot.id, walletId: context.wallet.id,
    symbol: 'BTCUSDT', side: 'BUY', type: 'LIMIT', status: 'PARTIALLY_FILLED',
    syncState: 'ORPHAN_EXCHANGE', quantity: 0.5, price: 100, contractSize: 0.01,
  } });
  return { user, ...context, legacy };
};

afterEach(async () => {
  for (const userId of users.splice(0)) {
    await prisma.orderFill.deleteMany({ where: { userId } });
    await prisma.trade.deleteMany({ where: { userId } });
    await prisma.order.deleteMany({ where: { userId } });
    await prisma.liveOrderIntent.deleteMany({ where: { userId } });
    await prisma.position.deleteMany({ where: { userId } });
    await prisma.log.deleteMany({ where: { userId } });
    await prisma.externalClientGrant.deleteMany({ where: { userId } });
    await prisma.bot.deleteMany({ where: { userId } });
    await prisma.symbolGroup.deleteMany({ where: { userId } });
    await prisma.marketUniverse.deleteMany({ where: { userId } });
    await prisma.strategy.deleteMany({ where: { userId } });
    await prisma.wallet.deleteMany({ where: { userId } });
    await prisma.apiKey.deleteMany({ where: { userId } });
    await prisma.userSubscription.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  }
});

describe('Gate nonunit internal mock admission boundary', () => {
  const market = {
    contract: true, linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
    id: 'BTC_USDT', symbol: 'BTC/USDT:USDT', contractSize: 0.01,
    info: { type: 'direct', name: 'BTC_USDT', settle_currency: 'USDT',
      quanto_multiplier: '0.01' },
  };
  const rawGateContract = { ...market.info };
  const economics = gateFuturesEconomicsFromMarket(market);
  if (!economics) throw new Error('valid test market economics missing');
  const rules = { minAmount: 1, minNotional: null, amountPrecision: 1,
    amountPrecisionMode: 'TICK_SIZE' as const, contractSize: 0.01,
    gateFuturesEconomics: economics };
  const connector = (override: Partial<SymbolTradingRules> = {}) => ({
    hasOpenPosition: vi.fn().mockResolvedValue(false),
    getSymbolTradingRules: vi.fn().mockResolvedValue({ ...rules, ...override }),
    fetchMarkPrice: vi.fn().mockResolvedValue(100),
  });
  const payloadFor = (botId: string) => ({ botId, symbol: 'BTCUSDT',
    side: 'BUY' as const, type: 'LIMIT' as const, quantity: 100, price: 100,
    mode: 'LIVE' as const, riskAck: true,
    clientOrderId: `soar_${randomUUID().replace(/-/g, '').slice(0, 22)}` });

  it('does not treat a forged permit or test environment as admission', () => {
    const databaseUrl = process.env.DATABASE_URL;
    const nodeEnv = process.env.NODE_ENV;
    const scope = { userId: 'user', botId: 'bot', symbol: 'BTCUSDT',
      side: 'BUY', clientOrderId: 'soar_test_scope', quantity: 100,
      price: 100, contractSize: 0.01 };
    try {
      const permit = { payload: Buffer.from(JSON.stringify(scope)).toString('base64url'),
        signature: Buffer.alloc(64).toString('base64url') };
      expect(matchesInternalGateNonunitMockPermit(permit, scope)).toBe(false);
      const otherDatabase = new URL(databaseUrl!);
      otherDatabase.pathname = '/other_local_test';
      process.env.DATABASE_URL = otherDatabase.toString();
      expect(matchesInternalGateNonunitMockPermit(permit, scope)).toBe(false);
      process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:15463/soar_runtime';
      expect(matchesInternalGateNonunitMockPermit(permit, scope)).toBe(false);
      process.env.DATABASE_URL = databaseUrl;
      process.env.NODE_ENV = 'development';
      expect(matchesInternalGateNonunitMockPermit(permit, scope)).toBe(false);
    } finally {
      process.env.DATABASE_URL = databaseUrl;
      process.env.NODE_ENV = nodeEnv;
    }
  });

  it('rejects non-CI Docker URLs and non-test environments before connector or persistence', async () => {
    const databaseUrl = process.env.DATABASE_URL;
    const explicitTestUrl = process.env.TEST_DATABASE_URL;
    const nodeEnv = process.env.NODE_ENV;
    const dockerTestUrl = 'postgresql://ci:fixture@postgres:5432/soar_local_test?schema=public';
    const otherSchemaUrl = dockerTestUrl.replace('schema=public', 'schema=private');
    const missingSchemaUrl = dockerTestUrl.replace('?schema=public', '');
    const invalid = [
      { name: 'production environment', url: dockerTestUrl, testUrl: dockerTestUrl, env: 'production' },
      { name: 'foreign host', url: dockerTestUrl.replace('@postgres:', '@foreign:'), testUrl: dockerTestUrl },
      { name: 'wrong port', url: dockerTestUrl.replace(':5432/', ':6432/'), testUrl: dockerTestUrl },
      { name: 'runtime database', url: dockerTestUrl.replace('/soar_local_test', '/soar_local_runtime'), testUrl: dockerTestUrl },
      { name: 'other test database', url: dockerTestUrl.replace('/soar_local_test', '/other_test'), testUrl: dockerTestUrl },
      { name: 'non-public schema', url: otherSchemaUrl, testUrl: otherSchemaUrl },
      { name: 'missing schema', url: missingSchemaUrl, testUrl: missingSchemaUrl },
      { name: 'wrong user', url: dockerTestUrl.replace('://ci:', '://operator:'), testUrl: dockerTestUrl },
      { name: 'mismatched test URL', url: dockerTestUrl, testUrl: dockerTestUrl.replace('/soar_local_test', '/other_test') },
      { name: 'missing test URL', url: dockerTestUrl, testUrl: undefined },
      { name: 'non-Postgres scheme', url: dockerTestUrl.replace('postgresql:', 'https:'), testUrl: dockerTestUrl },
      { name: 'loopback default port', url: 'postgresql://ci:fixture@127.0.0.1:5432/soar_local_test', testUrl: dockerTestUrl },
    ];
    try {
      for (const entry of invalid) {
        process.env.NODE_ENV = entry.env ?? 'test';
        process.env.DATABASE_URL = entry.url;
        if (entry.testUrl === undefined) delete process.env.TEST_DATABASE_URL;
        else process.env.TEST_DATABASE_URL = entry.testUrl;
        const fake = connector();
        await expect(admitInternalGateNonunitMockEntry({ userId: 'local-test-user',
          payload: payloadFor('local-test-bot'), rawGateContract, ccxtMarket: market,
          apiKeyId: 'local-test-key', connector: fake }))
          .rejects.toThrow('INTERNAL_GATE_NONUNIT_MOCK_UNAVAILABLE');
        expect(fake.hasOpenPosition, entry.name).not.toHaveBeenCalled();
        expect(fake.getSymbolTradingRules, entry.name).not.toHaveBeenCalled();
        expect(fake.fetchMarkPrice, entry.name).not.toHaveBeenCalled();
      }
    } finally {
      process.env.DATABASE_URL = databaseUrl;
      if (explicitTestUrl === undefined) delete process.env.TEST_DATABASE_URL;
      else process.env.TEST_DATABASE_URL = explicitTestUrl;
      process.env.NODE_ENV = nodeEnv;
    }
    expect(await prisma.orderFill.count({ where: { userId: 'local-test-user' } })).toBe(0);
    expect(await prisma.position.count({ where: { userId: 'local-test-user' } })).toBe(0);
  });

  it('keeps ordinary LIVE/API entry, direct intent and pretrade closed before transport', async () => {
    const f = await fixture();
    await prisma.order.update({ where: { id: f.legacy.id }, data: { status: 'CANCELED' } });
    const payload = payloadFor(f.bot.id);
    const executeLiveOrder = vi.fn();
    await expect(openOrder(f.user.id, payload, { executeLiveOrder,
      resolveGateEntryContractSize: async () => economics }))
      .rejects.toMatchObject({ code: ORDER_ERROR_CODES.entryNonunitContractUnsupported });
    const bot = { id: f.bot.id, exchange: 'GATEIO' as const,
      marketType: 'FUTURES' as const, positionMode: 'ONE_WAY' as const,
      apiKeyId: f.bot.apiKeyId, walletId: f.wallet.id };
    expect(() => assertPreparedGateEntryContractUnit({ ...payload,
      walletId: f.wallet.id, contractSize: 0.01,
      gateFuturesEconomics: economics }, bot))
      .toThrowError(ORDER_ERROR_CODES.entryNonunitContractUnsupported);
    await expect(persistOrReuseLiveOrderIntent({ userId: f.user.id, bot,
      payload: { ...payload, walletId: f.wallet.id, contractSize: 0.01,
        gateFuturesEconomics: economics }, internalMockPermit: {} }))
      .rejects.toMatchObject({ code: ORDER_ERROR_CODES.entryNonunitContractUnsupported });
    await expect(enforceLivePretradeGuards({ connector: connector(),
      apiKeyId: f.bot.apiKeyId!, exchange: 'GATEIO', marketType: 'FUTURES',
      payload: { symbol: payload.symbol, quantity: 100, price: 100,
        expectedContractSize: 0.01 },
      internalMock: { permit: {}, userId: f.user.id, botId: f.bot.id,
        side: 'BUY', clientOrderId: payload.clientOrderId } }))
      .rejects.toMatchObject({ code: ORDER_ERROR_CODES.livePretradeGateNonunitUnsupported });
    expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(0);
    expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(1);
    expect(executeLiveOrder).not.toHaveBeenCalled();
  });

  it('rolls back delegated nonunit bind without allowance, intent or submit marker', async () => {
    const f = await fixture();
    await prisma.order.update({ where: { id: f.legacy.id }, data: { status: 'CANCELED' } });
    const { grant, secret } = await createExternalClientGrant(f.user.id, {
      botId: f.bot.id, clientLabel: 'Nonunit mock boundary', exchange: 'GATEIO',
      marketType: 'FUTURES', symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER',
      maxActionQuoteAmount: '200', maxTotalQuoteAmount: '500', maxActions: 2,
      ttlSeconds: 3600, password,
    });
    const command = { userId: f.user.id, botId: f.bot.id, exchange: 'GATEIO',
      marketType: 'FUTURES', symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER',
      clientOrderId: `soar_${randomUUID().replace(/-/g, '').slice(0, 22)}`,
      side: 'BUY', type: 'LIMIT', quantity: '100', limitPrice: '100',
      reduceOnly: false, walletId: f.wallet.id, strategyId: f.strategy.id,
      positionId: null };
    await expect(bindExternalClientGrantReservationIntent({ grantId: grant.id,
      secret, command }, { getSymbolRules: async () => ({ ...await symbolRules(),
        minQuantity: 1, quantityStep: 1, contractSize: 0.01 }) }))
      .rejects.toMatchObject({ code: ORDER_ERROR_CODES.entryNonunitContractUnsupported });
    expect(await prisma.externalClientGrantReservation.count({ where: { grantId: grant.id } })).toBe(0);
    expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(0);
    expect(await prisma.liveCreateOrderSubmission.count({ where: { grantId: grant.id } })).toBe(0);
    const unchanged = await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: grant.id } });
    expect(unchanged.usedActions).toBe(0);
    expect(unchanged.usedQuoteAmount.toString()).toBe('0');
  });

  it('does not accept a mock permit from the HTTP order request', async () => {
    const f = await fixture();
    await prisma.order.update({ where: { id: f.legacy.id }, data: { status: 'CANCELED' } });
    const agent = request.agent(app);
    expect((await agent.post('/auth/login').send({ email: f.user.email,
      password })).status).toBe(200);
    const executeLiveOrder = vi.fn();
    const realOpenOrder = ordersService.openOrder;
    const serviceSpy = vi.spyOn(ordersService, 'openOrder').mockImplementation((userId, payload) =>
      realOpenOrder(userId, payload, { executeLiveOrder,
        resolveGateEntryContractSize: async () => economics }));
    try {
      const result = await agent.post('/dashboard/orders/open').send({
        ...payloadFor(f.bot.id), contractSize: 0.01,
        gateFuturesEconomics: economics, internalMockPermit: {},
      });
      expect(result.status).toBe(409);
      expect(serviceSpy).toHaveBeenCalledOnce();
      expect(serviceSpy.mock.calls[0]).toHaveLength(2);
      expect(serviceSpy.mock.calls[0]?.[1]).not.toHaveProperty('internalMockPermit');
      expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(0);
      expect(executeLiveOrder).not.toHaveBeenCalled();
    } finally {
      serviceSpy.mockRestore();
    }
  });

  it('admits verified linear metadata only through injected local mock validation, stopping at intent', async () => {
    const f = await fixture();
    await prisma.order.update({ where: { id: f.legacy.id }, data: { status: 'CANCELED' } });
    const payload = payloadFor(f.bot.id);
    const fake = connector();
    const intent = await admitInternalGateNonunitMockEntry({ userId: f.user.id,
      payload, rawGateContract, ccxtMarket: market,
      apiKeyId: f.bot.apiKeyId!, connector: fake });
    expect(intent.created).toBe(true);
    expect(intent.payload.contractSize).toBe(0.01);
    expect(intent.payload.gateFuturesEconomics).toEqual(economics);
    expect(fake.getSymbolTradingRules).toHaveBeenCalledOnce();
    expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(1);
    expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(1);
    expect(await prisma.position.count({ where: { userId: f.user.id } })).toBe(0);
    expect(await prisma.orderFill.count({ where: { userId: f.user.id } })).toBe(0);
    await expect(openOrder(f.user.id, payload, { executeLiveOrder: vi.fn(),
      resolveGateEntryContractSize: async () => null }))
      .rejects.toMatchObject({ code: ORDER_ERROR_CODES.entryNonunitContractUnsupported });
  });

  it('rejects raw inverse, missing and mismatched units and pretrade rules before any intent', async () => {
    const f = await fixture();
    await prisma.order.update({ where: { id: f.legacy.id }, data: { status: 'CANCELED' } });
    const forged = { ...economics, contract: 'BTC_USDT', contractSize: 0.01 };
    await expect(admitInternalGateNonunitMockEntry({ userId: f.user.id,
      payload: payloadFor(f.bot.id), economics: forged,
      apiKeyId: f.bot.apiKeyId!, connector: connector(),
    } as unknown as Parameters<typeof admitInternalGateNonunitMockEntry>[0]))
      .rejects.toThrow('INTERNAL_GATE_NONUNIT_MOCK_ENTRY_ONLY');
    await expect(admitInternalGateNonunitMockEntry({ userId: f.user.id,
      payload: payloadFor(f.bot.id), rawGateContract, ccxtMarket: market,
      economics: forged, apiKeyId: f.bot.apiKeyId!, connector: connector(),
    } as unknown as Parameters<typeof admitInternalGateNonunitMockEntry>[0]))
      .rejects.toThrow('INTERNAL_GATE_NONUNIT_MOCK_ENTRY_ONLY');
    const invalidSources = [
      { rawGateContract: { ...rawGateContract, type: 'inverse' }, ccxtMarket: market },
      { rawGateContract: { ...rawGateContract, quanto_multiplier: undefined }, ccxtMarket: market },
      { rawGateContract, ccxtMarket: { ...market, contractSize: 0.02 } },
      { rawGateContract, ccxtMarket: { ...market, symbol: 'ETH/USDT:USDT' } },
      { rawGateContract, ccxtMarket: { ...market, id: 'ETH_USDT' } },
      { rawGateContract, ccxtMarket: { ...market,
        info: { ...market.info, quanto_multiplier: '0.02' } } },
    ];
    for (const evidence of invalidSources) {
      await expect(admitInternalGateNonunitMockEntry({ userId: f.user.id,
        payload: payloadFor(f.bot.id), ...evidence,
        apiKeyId: f.bot.apiKeyId!, connector: connector() }))
        .rejects.toThrow();
    }
    for (const badRules of [
      { contractSize: 0.02 },
      { gateFuturesEconomics: null },
      { minAmount: null },
      { amountPrecisionMode: null },
      { amountPrecisionMode: undefined },
    ]) {
      await expect(admitInternalGateNonunitMockEntry({ userId: f.user.id,
        payload: payloadFor(f.bot.id), rawGateContract, ccxtMarket: market,
        apiKeyId: f.bot.apiKeyId!, connector: connector(badRules) }))
        .rejects.toThrow();
    }
    expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(0);
    expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(1);
  });
});

describe('Gate FUTURES ENTRY active Order unit', () => {
  it('rejects missing, inverse and mismatched economics before intent or transport', async () => {
    const f = await fixture();
    await prisma.order.update({ where: { id: f.legacy.id }, data: { status: 'CANCELED' } });
    const payload = { botId: f.bot.id, symbol: 'BTCUSDT', side: 'BUY' as const,
      type: 'LIMIT' as const, quantity: 1, price: 100, mode: 'LIVE' as const,
      riskAck: true };
    const direct: GateFuturesEconomicsSnapshot = {
      source: 'GATE_API_V4_CONTRACT_CCXT_MARKET', contract: 'BTC_USDT',
      contractType: 'direct', linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
      quantoMultiplier: 1, contractSize: 1,
    };
    const executeLiveOrder = vi.fn();
    for (const evidence of [null,
      { ...direct, contractType: 'inverse' } as unknown as GateFuturesEconomicsSnapshot,
      { ...direct, quantoMultiplier: 0.01 }]) {
      await expect(openOrder(f.user.id, payload, { executeLiveOrder,
        resolveGateEntryContractSize: async () => evidence })).rejects.toMatchObject({
        code: ORDER_ERROR_CODES.entryContractUnitUnavailable,
      });
    }
    expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(0);
    expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(1);
    expect(executeLiveOrder).not.toHaveBeenCalled();
  });
  it('persists the direct USDT economics snapshot from intent through Order and Position', async () => {
    const f = await fixture();
    await prisma.order.update({ where: { id: f.legacy.id }, data: { status: 'CANCELED' } });
    const proof: GateFuturesEconomicsSnapshot = {
      source: 'GATE_API_V4_CONTRACT_CCXT_MARKET', contract: 'BTC_USDT',
      contractType: 'direct', linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
      quantoMultiplier: 1, contractSize: 1,
    };
    const payload = { botId: f.bot.id, symbol: 'BTCUSDT', side: 'BUY' as const,
      type: 'LIMIT' as const, quantity: 1, price: 100, mode: 'LIVE' as const,
      riskAck: true, clientOrderId: `soar_${randomUUID().replace(/-/g, '').slice(0, 22)}` };
    const executeLiveOrder = vi.fn().mockResolvedValue({ exchangeOrderId: 'gate-proof-entry',
      status: 'OPEN' as const });
    const priorEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    let order;
    try {
      order = await openOrder(f.user.id, payload, { executeLiveOrder,
        resolveGateEntryContractSize: async () => proof });
    } finally { process.env.NODE_ENV = priorEnv; }
    expect(order.gateFuturesEconomics).toEqual(proof);
    const intent = await prisma.liveOrderIntent.findUniqueOrThrow({ where: { id: order.id } });
    expect((intent.payload as Record<string, unknown>).gateFuturesEconomics).toEqual(proof);
    const event = { eventType: 'ORDER_TRADE_UPDATE' as const, marketType: 'FUTURES' as const,
      eventTime: Date.now(), transactionTime: Date.now(), symbol: 'BTCUSDT', side: 'BUY',
      orderType: 'LIMIT', orderStatus: 'FILLED', executionType: 'TRADE',
      exchangeOrderId: 'gate-proof-entry', clientOrderId: payload.clientOrderId,
      averagePrice: 100, cumulativeFilledQuantity: 1, lastFilledQuantity: 1,
      lastFilledPrice: 100, fee: 0.04, feeCurrency: 'USDT', exchangeTradeId: 'gate-proof-fill',
      fillCostEvidence: { ccxtNotional: 100, notionalSource: 'CCXT_DERIVED_UNVERIFIED' as const,
        notionalCurrency: null, feeCurrencySource: 'CCXT_SETTLE_INFERRED' as const }, raw: {},
    };
    await applyLiveExchangeOrderTradeUpdateEvent({ userId: f.user.id, event,
      sourceExchange: 'GATEIO' });
    const persisted = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
    const position = await prisma.position.findUniqueOrThrow({ where: { id: persisted.positionId! } });
    const fill = await prisma.orderFill.findFirstOrThrow({ where: { orderId: order.id } });
    expect(position.gateFuturesEconomics).toEqual(proof);
    expect(fill.costEvidence).toMatchObject({ notionalSource: 'CCXT_DERIVED_UNVERIFIED',
      notionalCurrency: null, feeCurrencySource: 'CCXT_SETTLE_INFERRED' });
    const retryResolver = vi.fn().mockResolvedValue(null);
    const preparedRetry = await prepareOpenOrderRiskContext(f.user.id, payload, retryResolver);
    expect(preparedRetry.canonicalPayload).toMatchObject({ gateFuturesEconomics: proof });
    expect(fingerprintLiveOrderIntentPayload(f.user.id, preparedRetry.liveBot!,
      preparedRetry.canonicalPayload)).toBe(intent.payloadHash);
    process.env.NODE_ENV = 'development';
    try {
      const retried = await openOrder(f.user.id, payload, { executeLiveOrder,
        resolveGateEntryContractSize: retryResolver });
      expect(retried.id).toBe(order.id);
      expect(retried.gateFuturesEconomics).toEqual(proof);
    } finally { process.env.NODE_ENV = priorEnv; }
    expect(retryResolver).not.toHaveBeenCalled();
    expect(executeLiveOrder).toHaveBeenCalledOnce();
    await applyLiveExchangeOrderTradeUpdateEvent({ userId: f.user.id, event,
      sourceExchange: 'GATEIO' });
    expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: order.id } })).toBe(1);
  });
  it('uses the wallet scope when no bot is supplied', async () => {
    const f = await fixture();
    await prisma.order.update({ where: { id: f.legacy.id }, data: { botId: null } });
    const scope = { db: prisma, userId: f.user.id, botId: null,
      walletId: f.wallet.id, symbol: 'BTCUSDT', contractSize: 1 };
    await expect(assertExistingGateEntryOrderContractUnit(scope))
      .rejects.toMatchObject({ code: ORDER_ERROR_CODES.openOrderContractUnitMismatch });
    await prisma.order.update({ where: { id: f.legacy.id }, data: { walletId: null } });
    await expect(assertExistingGateEntryOrderContractUnit(scope)).resolves.toBeUndefined();
  });

  it('blocks direct new intents and keeps an exact existing intent lookup-only', async () => {
    const f = await fixture();
    const bot = { id: f.bot.id, exchange: 'GATEIO' as const,
      marketType: 'FUTURES' as const, positionMode: 'ONE_WAY' as const,
      apiKeyId: f.bot.apiKeyId, walletId: f.wallet.id };
    const payload = { botId: f.bot.id, walletId: f.wallet.id,
      symbol: 'BTCUSDT', side: 'BUY' as const, type: 'LIMIT' as const,
      quantity: 0.5, price: 100, mode: 'LIVE' as const, riskAck: true,
      contractSize: 1, clientOrderId: `soar_${randomUUID().replace(/-/g, '').slice(0, 22)}` };
    for (const contractSize of [null, 0.01]) {
      await prisma.order.update({ where: { id: f.legacy.id }, data: { contractSize } });
      await expect(persistOrReuseLiveOrderIntent({ userId: f.user.id, bot,
        payload: { ...payload, clientOrderId: `soar_${randomUUID().replace(/-/g, '').slice(0, 22)}` } }))
        .rejects.toMatchObject({ code: ORDER_ERROR_CODES.openOrderContractUnitMismatch });
    }
    expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(0);
    await prisma.order.update({ where: { id: f.legacy.id }, data: { contractSize: 1 } });
    const created = await persistOrReuseLiveOrderIntent({ userId: f.user.id, bot, payload });
    expect(created.created).toBe(true);
    await prisma.order.update({ where: { id: f.legacy.id }, data: { contractSize: null } });
    const retried = await persistOrReuseLiveOrderIntent({ userId: f.user.id, bot, payload });
    expect(retried).toMatchObject({ intentId: created.intentId, created: false });
    const execute = vi.fn();
    const lookup = vi.fn().mockResolvedValue({ exchangeOrderId: 'lookup-only', status: 'OPEN' });
    await executeDurableLiveOrder({ userId: f.user.id, bot, payload, execute, lookup });
    expect(execute).not.toHaveBeenCalled();
    expect(lookup).toHaveBeenCalledOnce();
  });

  it('replays normal ENTRY after a later null Order and rejects a new command', async () => {
    const f = await fixture();
    await prisma.order.update({ where: { id: f.legacy.id },
      data: { status: 'OPEN', syncState: 'IN_SYNC', contractSize: 1 } });
    await prisma.order.create({ data: { userId: f.user.id, walletId: f.wallet.id,
      symbol: 'BTCUSDT', side: 'BUY', type: 'LIMIT', status: 'OPEN',
      quantity: 0.5, price: 100, contractSize: 0.01 } });
    const executeLiveOrder = vi.fn().mockResolvedValue({ exchangeOrderId: 'gate-entry-safe',
      status: 'OPEN' as const });
    const payload = { botId: f.bot.id, symbol: 'BTCUSDT', side: 'BUY' as const,
      type: 'LIMIT' as const, quantity: 0.5, price: 100, mode: 'LIVE' as const,
      riskAck: true, clientOrderId: `soar_${randomUUID().replace(/-/g, '').slice(0, 22)}` };
    const priorEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const first = await openOrder(f.user.id, payload, { executeLiveOrder,
        resolveGateEntryContractSize: async () => 1 });
      expect(first.contractSize).toBe(1);
      await prisma.order.update({ where: { id: f.legacy.id }, data: { contractSize: null } });
      const retry = await openOrder(f.user.id, payload, { executeLiveOrder,
        resolveGateEntryContractSize: async () => 0.01 });
      expect(retry.id).toBe(first.id);
      await expect(openOrder(f.user.id, { ...payload, clientOrderId: `soar_${randomUUID().replace(/-/g, '').slice(0, 22)}` },
        { executeLiveOrder, resolveGateEntryContractSize: async () => 1 }))
        .rejects.toMatchObject({ code: ORDER_ERROR_CODES.openOrderContractUnitMismatch });
      expect(executeLiveOrder).toHaveBeenCalledTimes(1);
      expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(1);
    } finally { process.env.NODE_ENV = priorEnv; }
  });

  it('rolls back delegated bind before reservation and allowance when ENTRY unit is unsafe', async () => {
    const f = await fixture();
    await prisma.order.update({ where: { id: f.legacy.id },
      data: { status: 'OPEN', syncState: 'DRIFT', contractSize: 0.01 } });
    const { grant, secret } = await createExternalClientGrant(f.user.id, {
      botId: f.bot.id, clientLabel: 'Gate entry guard', exchange: 'GATEIO',
      marketType: 'FUTURES', symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER',
      maxActionQuoteAmount: '50', maxTotalQuoteAmount: '100', maxActions: 2,
      ttlSeconds: 3600, password,
    });
    const command = { userId: f.user.id, botId: f.bot.id, exchange: 'GATEIO',
      marketType: 'FUTURES', symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER',
      clientOrderId: `soar_${randomUUID().replace(/-/g, '').slice(0, 22)}`,
      side: 'BUY', type: 'LIMIT', quantity: '0.5', limitPrice: '100',
      reduceOnly: false, walletId: f.wallet.id, strategyId: f.strategy.id,
      positionId: null };
    await expect(bindExternalClientGrantReservationIntent({ grantId: grant.id,
      secret, command }, { getSymbolRules: symbolRules }))
      .rejects.toMatchObject({ code: ORDER_ERROR_CODES.openOrderContractUnitMismatch });
    expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(0);
    expect(await prisma.externalClientGrantReservation.count({ where: { grantId: grant.id } })).toBe(0);
    const unchanged = await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: grant.id } });
    expect(unchanged.usedActions).toBe(0);
    expect(unchanged.usedQuoteAmount.toString()).toBe('0');
    expect(await prisma.log.count({ where: { userId: f.user.id,
      action: 'EXTERNAL_CLIENT_GRANT_RESERVED' } })).toBe(0);
    await prisma.order.update({ where: { id: f.legacy.id }, data: { contractSize: 1 } });
    const valid = await bindExternalClientGrantReservationIntent({ grantId: grant.id,
      secret, command }, { getSymbolRules: symbolRules });
    expect(valid.intentId).toBeTruthy();
    expect((await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: grant.id } })).usedActions).toBe(1);
  });

  it('uses a saved Gate unit for fill notional while preserving unknown CCXT cost through replay', async () => {
    const user = await createEntitledUser({ data: {
      email: 'gate-snapshot-fill-cost@example.com', password: 'hashed',
    } });
    users.push(user.id);
    const proof = { source: 'GATE_API_V4_CONTRACT_CCXT_MARKET' as const,
      contract: 'BTC_USDT', contractType: 'direct' as const, linear: true as const,
      inverse: false as const, quote: 'USDT' as const, settle: 'USDT' as const,
      quantoMultiplier: 0.01, contractSize: 0.01 };
    const intent = await prisma.liveOrderIntent.create({ data: {
      userId: user.id, clientOrderId: 'soar_gate_saved_unit_fill', payloadHash: 'test',
      exchange: 'GATEIO', marketType: 'FUTURES', symbol: 'BTCUSDT',
      payload: { contractSize: 0.01, gateFuturesEconomics: proof },
    } });
    const now = new Date();
    const payload = { mode: 'LIVE' as const, symbol: 'BTCUSDT', side: 'BUY' as const,
      type: 'MARKET' as const, quantity: 100, riskAck: true,
      clientOrderId: intent.clientOrderId, contractSize: 0.01, gateFuturesEconomics: proof };
    const input = { userId: user.id, exchangeOrderId: 'gate-snapshot-fill-venue',
      intentId: intent.id, clientOrderId: intent.clientOrderId, data: {
        id: intent.id, userId: user.id, symbol: 'BTCUSDT', side: 'BUY' as const,
        type: 'MARKET' as const, status: 'OPEN' as const, quantity: 100,
        contractSize: 0.01, gateFuturesEconomics: proof,
        exchangeOrderId: 'gate-snapshot-fill-venue',
      } };
    const fill: CcxtFuturesOrderFill = { exchangeTradeId: 'gate-snapshot-fill-trade',
      exchangeOrderId: input.exchangeOrderId, symbol: 'BTCUSDT', side: 'buy',
      price: 100, quantity: 100, notional: 10000,
      notionalSource: 'CCXT_DERIVED_UNVERIFIED',
      notionalCurrency: null, feeCost: 0.04, feeCurrency: 'USDT',
      feeCurrencySource: 'CCXT_SETTLE_INFERRED', feeRate: null,
      executedAt: now, source: 'fetchMyTrades', raw: { trade_value: '100' } };
    const materialize = (fillRow: CcxtFuturesOrderFill) => (tx: Parameters<NonNullable<Parameters<typeof createOrderForLiveIntent>[0]['materialize']>>[0],
      order: Parameters<NonNullable<Parameters<typeof createOrderForLiveIntent>[0]['materialize']>>[1]) =>
      materializeLiveOrderInTransaction({ tx, order, userId: user.id, payload,
        fillPrice: 100, fillQuantity: 100, applyFillLifecycle: false, fills: [fillRow], now });
    for (const source of ['UNKNOWN', 'CCXT_DERIVED_UNVERIFIED',
      'QUOTE_QTY_FIELD_UNVERIFIED', 'CCXT_REPORTED_UNVERIFIED',
      'LOCAL_FALLBACK_UNVERIFIED', undefined] as const) {
      await expect(createOrderForLiveIntent({ ...input,
        data: { ...input.data, gateFuturesEconomics: undefined },
        materialize: materialize({ ...fill, notionalSource: source }) }))
        .rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveExecutionUnknown });
      expect(await prisma.order.count({ where: { id: intent.id } })).toBe(0);
      expect(await prisma.orderFill.count({ where: { orderId: intent.id } })).toBe(0);
    }
    await expect(createOrderForLiveIntent({ ...input,
      data: { ...input.data, gateFuturesEconomics: { ...proof, contractType: 'inverse' } },
      materialize: materialize(fill) }))
      .rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveExecutionUnknown });
    await prisma.liveOrderIntent.update({ where: { id: intent.id },
      data: { payload: { contractSize: 0.01 } } });
    await expect(createOrderForLiveIntent({ ...input, materialize: materialize(fill) }))
      .rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveExecutionUnknown });
    await prisma.liveOrderIntent.update({ where: { id: intent.id },
      data: { payload: { contractSize: 0.01, gateFuturesEconomics: proof } } });
    await expect(createOrderForLiveIntent({ ...input,
      data: { ...input.data, status: 'FILLED' }, materialize: materialize(fill) }))
      .rejects.toMatchObject({ code: ORDER_ERROR_CODES.liveExecutionUnknown });
    expect(await prisma.orderFill.count({ where: { orderId: intent.id } })).toBe(0);
    await expect(createOrderForLiveIntent({ ...input, materialize: materialize(fill) }))
      .resolves.toMatchObject({ reused: false });
    const saved = await prisma.orderFill.findFirstOrThrow({ where: { orderId: intent.id } });
    expect(saved.notional).toBe(100);
    expect(saved.costEvidence).toMatchObject({ ccxtNotional: 10000,
      notionalSource: 'CCXT_DERIVED_UNVERIFIED', feeCurrencySource: 'CCXT_SETTLE_INFERRED' });
    await expect(createOrderForLiveIntent({ ...input, materialize: materialize(fill) }))
      .resolves.toMatchObject({ reused: true });
    expect(await prisma.orderFill.count({ where: { orderId: intent.id } })).toBe(1);
  });
});
