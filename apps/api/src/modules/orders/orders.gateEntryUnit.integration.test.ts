import { randomUUID } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { createEntitledUser } from '../../test/createEntitledUser';
import { hashPassword } from '../../utils/hash';
import { createExternalClientGrant } from '../externalClientGrants/externalClientGrants.service';
import { bindExternalClientGrantReservationIntent } from '../externalClientGrants/externalClientGrantReservation.service';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { createLiveScopedBotContext } from './orders.service.fixture';
import { openOrder } from './orders.service';
import { executeDurableLiveOrder, persistOrReuseLiveOrderIntent } from './orders.liveIntent.service';
import { assertExistingGateEntryOrderContractUnit } from './orders.positionScope';
import { ORDER_ERROR_CODES } from './orders.errors';

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

describe('Gate FUTURES ENTRY active Order unit', () => {
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
});
