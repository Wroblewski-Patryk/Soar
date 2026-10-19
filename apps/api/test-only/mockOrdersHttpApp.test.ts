import request from 'supertest';
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
import { app as productionApp } from '../src/index';
import { prisma } from '../src/prisma/client';
import { __rateLimitInternals } from '../src/middleware/rateLimit';
import { hashPassword } from '../src/utils/hash';
import { setLiveExecutionPause } from '../src/modules/orders/liveExecutionPause.service';
import { CcxtFuturesConnector } from '../src/modules/exchange/ccxtFuturesConnector.service';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from
  '../src/modules/subscriptions/subscriptions.service';
import { createExternalClientGrant, revokeExternalClientGrant } from
  '../src/modules/externalClientGrants/externalClientGrants.service';
import { admitBoundExternalClientGrantSubmission, bindExternalClientGrantReservationIntent } from
  '../src/modules/externalClientGrants/externalClientGrantReservation.service';
import { createMockOrdersHttpApp } from './mockOrdersHttpApp';

const users: string[] = [];
let originalControl: Awaited<ReturnType<typeof prisma.liveExecutionControl.findUnique>>;
const rules = async () => ({ minQuantity: 0.001, minNotional: 1, quantityStep: 0.001,
  priceStep: 0.01, contractSize: 1, quoteCurrency: 'USDT', settleCurrency: 'USDT',
  isContract: true, isLinear: true, isInverse: false });
const body = () => ({ clientOrderId: `soar_${crypto.randomUUID().replace(/-/g, '').slice(0, 22)}`,
  side: 'BUY' as const, quantity: '0.5', limitPrice: '100' });
const path = (grantId: string) => `/external-client/grants/${grantId}/mock-orders`;

beforeAll(async () => {
  if (process.env.NODE_ENV !== 'test' ||
      !decodeURIComponent(new URL(process.env.DATABASE_URL ?? '').pathname).endsWith('_test')) {
    throw new Error('HTTP mock tests require an isolated _test database');
  }
  originalControl = await prisma.liveExecutionControl.findUnique({ where: { id: 'global' } });
  await prisma.liveExecutionControl.upsert({ where: { id: 'global' },
    create: { id: 'global', paused: false, reason: 'test available', version: 1 },
    update: { paused: false, reason: 'test available' } });
});

afterEach(async () => {
  vi.restoreAllMocks();
  delete process.env.RATE_LIMIT_ENABLE_TEST_MODE;
  __rateLimitInternals.resetForTests();
  for (const userId of users.splice(0)) {
    await prisma.liveCreateOrderSubmission.deleteMany({ where: { grant: { userId } } });
    await prisma.orderFill.deleteMany({ where: { userId } });
    await prisma.order.deleteMany({ where: { userId } });
    await prisma.position.deleteMany({ where: { userId } });
    await prisma.liveOrderIntent.deleteMany({ where: { userId } });
    await prisma.log.deleteMany({ where: { userId } });
    await prisma.externalClientGrant.deleteMany({ where: { userId } });
    await prisma.bot.deleteMany({ where: { userId } });
    await prisma.symbolGroup.deleteMany({ where: { userId } });
    await prisma.marketUniverse.deleteMany({ where: { userId } });
    await prisma.strategy.deleteMany({ where: { userId } });
    await prisma.wallet.deleteMany({ where: { userId } });
    await prisma.userSubscription.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  }
  await prisma.liveExecutionControl.update({ where: { id: 'global' },
    data: { paused: false, reason: 'test available' } });
});

afterAll(async () => {
  if (originalControl) await prisma.liveExecutionControl.update({ where: { id: 'global' },
    data: { paused: originalControl.paused, reason: originalControl.reason,
      version: originalControl.version, changedAt: originalControl.changedAt,
      changedByUserId: originalControl.changedByUserId } });
  else await prisma.liveExecutionControl.deleteMany({ where: { id: 'global' } });
});

const fixture = async () => {
  const user = await prisma.user.create({ data: {
    email: `http-mock-${crypto.randomUUID()}@example.com`,
    password: await hashPassword('GrantTest1234'), role: 'ADMIN',
  } });
  users.push(user.id);
  await ensureSubscriptionCatalog(prisma);
  await setActiveSubscriptionForUser(prisma, {
    userId: user.id, planCode: 'ADVANCED', source: 'ADMIN_OVERRIDE', autoRenew: false,
  });
  const universe = await prisma.marketUniverse.create({ data: {
    userId: user.id, name: 'HTTP mock universe', exchange: 'BINANCE',
    marketType: 'FUTURES', baseCurrency: 'USDT', whitelist: ['BTCUSDT'],
  } });
  const group = await prisma.symbolGroup.create({ data: {
    userId: user.id, marketUniverseId: universe.id, name: 'BTC', symbols: ['BTCUSDT'],
  } });
  const strategy = await prisma.strategy.create({ data: {
    userId: user.id, name: 'HTTP mock strategy', interval: '5m', leverage: 5,
    walletRisk: 1, config: { additional: { orderType: 'LIMIT', marginMode: 'ISOLATED' } },
  } });
  const wallet = await prisma.wallet.create({ data: {
    userId: user.id, name: 'HTTP mock wallet', mode: 'LIVE', exchange: 'BINANCE',
    marketType: 'FUTURES', baseCurrency: 'USDT',
  } });
  const bot = await prisma.bot.create({ data: {
    userId: user.id, name: 'HTTP mock bot', mode: 'LIVE', exchange: 'BINANCE',
    marketType: 'FUTURES', isActive: true, liveOptIn: true,
    consentTextVersion: 'mvp-v1', symbolGroupId: group.id,
    strategyId: strategy.id, walletId: wallet.id,
  } });
  const { grant, secret } = await createExternalClientGrant(user.id, {
    botId: bot.id, clientLabel: 'HTTP mock client', exchange: 'BINANCE',
    marketType: 'FUTURES', symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER',
    maxActionQuoteAmount: '50', maxTotalQuoteAmount: '100', maxActions: 2,
    ttlSeconds: 3600, password: 'GrantTest1234',
  });
  return { user, bot, strategy, wallet, grant, secret };
};

const transportStarts = (reservationId: string) => prisma.log.count({ where: {
  entityType: 'ExternalClientGrantReservation', entityId: reservationId,
  action: 'EXTERNAL_CLIENT_GRANT_MOCK_TRANSPORT_STARTED',
} });

it('keeps the test-only route out of production app and unsafe configurations', async () => {
  const f = await fixture();
  const input = body();
  expect((await request(productionApp).post(path(f.grant.id))
    .set('Authorization', `Bearer ${f.secret}`).send(input)).status).toBe(404);
  const previous = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'production';
    expect((await request(createMockOrdersHttpApp()).post(path(f.grant.id))
      .set('Authorization', `Bearer ${f.secret}`).send(input)).status).toBe(404);
    process.env.NODE_ENV = 'test';
    const databaseUrl = process.env.DATABASE_URL;
    try {
      process.env.DATABASE_URL = databaseUrl?.replace(/_test(?=\?|$)/, '');
      expect((await request(createMockOrdersHttpApp()).post(path(f.grant.id))
        .set('Authorization', `Bearer ${f.secret}`).send(input)).status).toBe(404);
    } finally { process.env.DATABASE_URL = databaseUrl; }
  } finally { process.env.NODE_ENV = previous; }
  expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(0);
  expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(0);
});

it('uses shared IP and hashed grant limits and denies when the store is unavailable', async () => {
  process.env.RATE_LIMIT_ENABLE_TEST_MODE = 'true';
  const counts = new Map<string, number>();
  __rateLimitInternals.setGetRedisClientForTests(async () => ({
    eval: async (_script: string, input: { keys: string[] }) => {
      const key = input.keys[0];
      const count = (counts.get(key) ?? 0) + 1;
      counts.set(key, count);
      return [count, 60_000];
    },
  }) as any);
  const mockApp = createMockOrdersHttpApp();
  const secret = `soar_ext_${'A'.repeat(43)}`;
  const target = path(crypto.randomUUID());
  for (let attempt = 0; attempt < 10; attempt += 1) {
    expect((await request(mockApp).post(target)
      .set('Authorization', `Bearer ${secret}`).send({})).status).toBe(400);
  }
  expect((await request(mockApp).post(target)
    .set('Authorization', `Bearer ${secret}`).send({})).status).toBe(429);
  expect([...counts.keys()].some((key) => key.includes(secret))).toBe(false);
  __rateLimitInternals.setGetRedisClientForTests(async () => null);
  expect((await request(mockApp).post(target)
    .set('Authorization', `Bearer ${secret}`).send({})).status).toBe(503);
});

it('accepts one bounded mock order and exact retry without a second transport or charge', async () => {
  const f = await fixture();
  const input = body();
  const liveSubmit = vi.spyOn(CcxtFuturesConnector.prototype, 'placeOrder');
  const output: string[] = [];
  for (const method of ['log', 'warn', 'error'] as const) {
    vi.spyOn(console, method).mockImplementation((...args) => { output.push(args.join(' ')); });
  }
  const mockApp = createMockOrdersHttpApp();
  const first = await request(mockApp).post(path(f.grant.id))
    .set('Authorization', `Bearer ${f.secret}`).send(input);
  expect(first.status).toBe(201);
  expect(first.body).toEqual({ execution: 'MOCK', clientOrderId: input.clientOrderId,
    state: 'MOCK_FILLED', orderId: expect.any(String) });
  expect(JSON.stringify(first.body)).not.toContain(f.secret);
  expect(output.join('\n')).not.toContain(f.secret);
  const repeated = await request(createMockOrdersHttpApp()).post(path(f.grant.id))
    .set('Authorization', `Bearer ${f.secret}`).send(input);
  expect(repeated.status).toBe(200);
  expect(repeated.body).toEqual(first.body);
  const reservation = await prisma.externalClientGrantReservation.findUniqueOrThrow({
    where: { clientOrderId: input.clientOrderId },
  });
  expect(reservation).toMatchObject({ state: 'SUBMITTED', proofType: 'DURABLE_ORDER' });
  expect(await transportStarts(reservation.id)).toBe(1);
  expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(1);
  expect(await prisma.orderFill.count({ where: { userId: f.user.id } })).toBe(1);
  expect(await prisma.position.count({ where: { userId: f.user.id } })).toBe(1);
  expect((await prisma.order.findFirstOrThrow({ where: { userId: f.user.id } })).exchangeOrderId)
    .toMatch(/^mock-/);
  expect(liveSubmit).not.toHaveBeenCalled();
  expect(await prisma.liveCreateOrderSubmission.count({ where: { grantId: f.grant.id } })).toBe(0);
  expect(await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: f.grant.id } }))
    .toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
});

it('fails closed on credential, scope, command, and entitlement changes before transport', async () => {
  const f = await fixture();
  const input = body();
  const mockApp = createMockOrdersHttpApp();
  const attempts = [
    request(mockApp).post(path(f.grant.id)).send(input),
    request(mockApp).post(path(crypto.randomUUID())).set('Authorization', `Bearer ${f.secret}`).send(input),
    request(mockApp).post(path(f.grant.id)).set('Authorization', `Bearer soar_read_${'A'.repeat(43)}`).send(input),
    request(mockApp).post(path(f.grant.id)).set('Authorization', `Bearer ${f.secret}`)
      .set('Cookie', 'token=human').send(input),
    request(mockApp).post(path(f.grant.id)).set('Authorization', `Bearer ${f.secret}`)
      .send({ ...input, riskAck: true }),
    request(mockApp).post(path(f.grant.id)).set('Authorization', `Bearer ${f.secret}`)
      .send({ ...input, botId: f.bot.id, userId: f.user.id, walletId: f.wallet.id,
        url: 'https://elsewhere.example', scenario: 'UNKNOWN' }),
  ];
  const results = await Promise.all(attempts);
  expect(results.map(({ status }) => status)).toEqual([401, 401, 401, 401, 400, 400]);
  for (const result of results) expect(JSON.stringify(result.body)).not.toContain(f.secret);
  expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(0);
  const overLimit = await request(mockApp).post(path(f.grant.id))
    .set('Authorization', `Bearer ${f.secret}`)
    .send({ ...input, clientOrderId: body().clientOrderId, quantity: '0.6' });
  expect(overLimit.status).toBe(401);
  expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(0);
  await prisma.userSubscription.updateMany({ where: { userId: f.user.id },
    data: { status: 'CANCELED', endsAt: new Date(0) } });
  const noPlan = await request(mockApp).post(path(f.grant.id))
    .set('Authorization', `Bearer ${f.secret}`).send(input);
  expect(noPlan.status).toBe(401);
  expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(0);
});

it('denies revoked, expired, and paused grants before mock transport', async () => {
  const mockApp = createMockOrdersHttpApp();
  const revoked = await fixture();
  await revokeExternalClientGrant(revoked.user.id, revoked.grant.id);
  expect((await request(mockApp).post(path(revoked.grant.id))
    .set('Authorization', `Bearer ${revoked.secret}`).send(body())).status).toBe(401);
  expect(await prisma.externalClientGrantReservation.count({ where: { grantId: revoked.grant.id } })).toBe(0);

  const expired = await fixture();
  await prisma.externalClientGrant.update({ where: { id: expired.grant.id },
    data: { expiresAt: new Date(0) } });
  expect((await request(mockApp).post(path(expired.grant.id))
    .set('Authorization', `Bearer ${expired.secret}`).send(body())).status).toBe(401);
  expect(await prisma.externalClientGrantReservation.count({ where: { grantId: expired.grant.id } })).toBe(0);

  const paused = await fixture();
  const control = await prisma.liveExecutionControl.findUniqueOrThrow({ where: { id: 'global' } });
  await setLiveExecutionPause({ actorUserId: paused.user.id, paused: true,
    reason: 'HTTP mock paused before admission', expectedVersion: control.version });
  const denied = await request(mockApp).post(path(paused.grant.id))
    .set('Authorization', `Bearer ${paused.secret}`).send(body());
  expect(denied.status).toBe(503);
  expect(await prisma.liveCreateOrderSubmission.count({ where: { grantId: paused.grant.id } })).toBe(0);
  const reservations = await prisma.externalClientGrantReservation.findMany({
    where: { grantId: paused.grant.id },
  });
  for (const reservation of reservations) expect(await transportStarts(reservation.id)).toBe(0);
});

it('keeps a preexisting uncertain marker lookup-only through HTTP retry and blocks pause/revoke', async () => {
  const f = await fixture();
  const input = body();
  const command = { userId: f.user.id, botId: f.bot.id, exchange: 'BINANCE' as const,
    marketType: 'FUTURES' as const, symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER' as const,
    clientOrderId: input.clientOrderId, side: input.side, type: 'LIMIT' as const,
    quantity: input.quantity, limitPrice: input.limitPrice, reduceOnly: false,
    walletId: f.wallet.id, strategyId: f.strategy.id, positionId: null };
  const bound = await bindExternalClientGrantReservationIntent({
    grantId: f.grant.id, secret: f.secret, command,
  }, { getSymbolRules: rules });
  await admitBoundExternalClientGrantSubmission({
    reservationId: bound.reservation.id, secret: f.secret,
  }, { getSymbolRules: rules });
  const control = await prisma.liveExecutionControl.findUniqueOrThrow({ where: { id: 'global' } });
  const [http, pause] = await Promise.allSettled([
    request(createMockOrdersHttpApp()).post(path(f.grant.id))
      .set('Authorization', `Bearer ${f.secret}`).send(input),
    setLiveExecutionPause({ actorUserId: f.user.id, paused: true,
      reason: 'HTTP mock marker unresolved', expectedVersion: control.version }),
  ]);
  expect(http.status).toBe('fulfilled');
  if (http.status !== 'fulfilled') throw http.reason;
  const first = http.value;
  expect(pause.status).toBe('rejected');
  if (pause.status === 'rejected') expect(pause.reason).toMatchObject({
    code: 'LIVE_PAUSE_SUBMISSION_IN_FLIGHT',
  });
  const [retry, revoke] = await Promise.allSettled([
    request(createMockOrdersHttpApp()).post(path(f.grant.id))
      .set('Authorization', `Bearer ${f.secret}`).send(input),
    revokeExternalClientGrant(f.user.id, f.grant.id),
  ]);
  expect(revoke.status).toBe('rejected');
  if (revoke.status === 'rejected') expect(revoke.reason).toMatchObject({ status: 409 });
  expect(retry.status).toBe('fulfilled');
  if (retry.status !== 'fulfilled') throw retry.reason;
  const restart = retry.value;
  expect(first.status).toBe(202);
  expect(restart.body).toEqual(first.body);
  expect(await transportStarts(bound.reservation.id)).toBe(0);
  expect(await prisma.liveCreateOrderSubmission.count({ where: { reservationId: bound.reservation.id } })).toBe(1);
  const reservation = await prisma.externalClientGrantReservation.findUniqueOrThrow({
    where: { id: bound.reservation.id },
  });
  expect(reservation.state).toBe('SUBMISSION_UNCERTAIN');
  expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(0);
});

it('serializes concurrent identical HTTP submissions without duplicate mock transport', async () => {
  const f = await fixture();
  const input = body();
  const mockApp = createMockOrdersHttpApp();
  const [first, second] = await Promise.all([1, 2].map(() =>
    request(mockApp).post(path(f.grant.id)).set('Authorization', `Bearer ${f.secret}`).send(input)));
  expect([first.status, second.status].some((status) => [200, 201, 202].includes(status))).toBe(true);
  const retry = await request(createMockOrdersHttpApp()).post(path(f.grant.id))
    .set('Authorization', `Bearer ${f.secret}`).send(input);
  expect(retry.status).toBe(200);
  const reservation = await prisma.externalClientGrantReservation.findUniqueOrThrow({
    where: { clientOrderId: input.clientOrderId },
  });
  expect(await transportStarts(reservation.id)).toBe(1);
  expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(1);
  expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(1);
  expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(1);
  expect((await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: f.grant.id } })).usedActions)
    .toBe(1);
  const changed = await request(mockApp).post(path(f.grant.id))
    .set('Authorization', `Bearer ${f.secret}`).send({ ...input, limitPrice: '99' });
  expect(changed.status).toBe(409);
  expect(await transportStarts(reservation.id)).toBe(1);
});
