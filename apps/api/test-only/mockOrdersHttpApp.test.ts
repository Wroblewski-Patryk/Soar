import request from 'supertest';
import { execFileSync } from 'node:child_process';
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
import { admitBoundExternalClientGrantSubmission, bindExternalClientGrantReservationIntent,
  executeBoundExternalClientGrantMock, type GrantLimitCommand } from
  '../src/modules/externalClientGrants/externalClientGrantReservation.service';
import { createMockOrdersHttpApp } from './mockOrdersHttpApp';

const users: string[] = [];
let originalControl: Awaited<ReturnType<typeof prisma.liveExecutionControl.findUnique>>;
const sharedCounts = new Map<string, number>();
const sharedClient = { eval: async (_script: string, input: { keys: string[] }) => {
  const key = input.keys[0];
  const count = (sharedCounts.get(key) ?? 0) + 1;
  sharedCounts.set(key, count);
  return [count, 60_000];
} } as any;
const useSharedTestStore = () =>
  __rateLimitInternals.setGetRedisClientForTests(async () => sharedClient);
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
  useSharedTestStore();
});

afterEach(async () => {
  vi.restoreAllMocks();
  delete process.env.RATE_LIMIT_ENABLE_TEST_MODE;
  await __rateLimitInternals.closeRedisClientForTests();
  __rateLimitInternals.resetForTests();
  sharedCounts.clear();
  useSharedTestStore();
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
    await prisma.apiKey.deleteMany({ where: { userId } });
    await prisma.userSubscription.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  }
  await prisma.liveExecutionControl.update({ where: { id: 'global' },
    data: { paused: false, reason: 'test available' } });
});

afterAll(async () => {
  await __rateLimitInternals.closeRedisClientForTests();
  __rateLimitInternals.resetForTests();
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
  const key = await prisma.apiKey.create({ data: {
    userId: user.id, label: 'HTTP mock key', exchange: 'BINANCE',
    apiKey: 'test-only-key', apiSecret: 'test-only-secret',
  } });
  const bot = await prisma.bot.create({ data: {
    userId: user.id, name: 'HTTP mock bot', mode: 'LIVE', exchange: 'BINANCE',
    marketType: 'FUTURES', isActive: true, liveOptIn: true,
    consentTextVersion: 'mvp-v1', symbolGroupId: group.id,
    strategyId: strategy.id, walletId: wallet.id, apiKeyId: key.id,
  } });
  const { grant, secret } = await createExternalClientGrant(user.id, {
    botId: bot.id, clientLabel: 'HTTP mock client', exchange: 'BINANCE',
    marketType: 'FUTURES', symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER',
    maxActionQuoteAmount: '50', maxTotalQuoteAmount: '100', maxActions: 2,
    ttlSeconds: 3600, password: 'GrantTest1234',
  });
  return { user, bot, strategy, wallet, key, grant, secret };
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
      .set('Authorization', `Bearer ${secret}`)
      .set('Content-Type', 'application/json').send('{invalid')).status).toBe(400);
  }
  expect((await request(mockApp).post(target)
    .set('Authorization', `Bearer ${secret}`)
    .set('Content-Type', 'application/json').send('{invalid')).status).toBe(429);
  expect(counts.size).toBeGreaterThan(0);
  expect([...counts.keys()].some((key) => key.includes(secret))).toBe(false);
  __rateLimitInternals.setGetRedisClientForTests(async () => null);
  expect((await request(mockApp).post(target)
    .set('Authorization', `Bearer ${secret}`)
    .set('Content-Type', 'application/json').send('{invalid')).status).toBe(503);
});

it('denies malformed JSON without a configured isolated shared store', async () => {
  const previous = process.env.TEST_REDIS_URL;
  delete process.env.TEST_REDIS_URL;
  __rateLimitInternals.setGetRedisClientForTests(null);
  try {
    const response = await request(createMockOrdersHttpApp())
      .post(path(crypto.randomUUID()))
      .set('Authorization', `Bearer soar_ext_${'G'.repeat(43)}`)
      .set('Content-Type', 'application/json').send('{invalid');
    expect(response.status).toBe(503);
    expect(response.headers['x-ratelimit-degraded']).toBe('redis_unavailable');
  } finally {
    if (previous === undefined) delete process.env.TEST_REDIS_URL;
    else process.env.TEST_REDIS_URL = previous;
  }
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
  const claimAudits = await prisma.log.findMany({ where: {
    entityType: 'ExternalClientGrantReservation', entityId: reservation.id,
    action: 'EXTERNAL_CLIENT_GRANT_DISPATCH_CLAIMED',
  } });
  expect(claimAudits).toHaveLength(1);
  expect(claimAudits[0].metadata).toMatchObject({ grantId: f.grant.id,
    intentId: first.body.orderId, markerId: expect.any(String),
    clientOrderId: input.clientOrderId });
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

it('keeps the committed claim lookup-only when the transport-start audit fails', async () => {
  const f = await fixture();
  const input = body();
  try {
    await prisma.$executeRawUnsafe(`CREATE FUNCTION mock_001v_abort_start() RETURNS trigger
      LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION USING ERRCODE = '40001',
      MESSAGE = 'forced pre-transport failure'; RETURN NEW; END $$`);
    await prisma.$executeRawUnsafe(`CREATE TRIGGER mock_001v_abort_start_trigger
      BEFORE INSERT ON "Log" FOR EACH ROW
      WHEN (NEW."action" = 'EXTERNAL_CLIENT_GRANT_MOCK_TRANSPORT_STARTED')
      EXECUTE FUNCTION mock_001v_abort_start()`);
    const failed = await request(createMockOrdersHttpApp()).post(path(f.grant.id))
      .set('Authorization', `Bearer ${f.secret}`).send(input);
    expect(failed.status).toBe(503);
  } finally {
    await prisma.$executeRawUnsafe('DROP TRIGGER IF EXISTS mock_001v_abort_start_trigger ON "Log"');
    await prisma.$executeRawUnsafe('DROP FUNCTION IF EXISTS mock_001v_abort_start()');
  }
  const reservation = await prisma.externalClientGrantReservation.findUniqueOrThrow({
    where: { clientOrderId: input.clientOrderId } });
  const marker = await prisma.liveCreateOrderSubmission.findUniqueOrThrow({
    where: { reservationId: reservation.id } });
  const intent = await prisma.liveOrderIntent.findUniqueOrThrow({
    where: { clientOrderId: input.clientOrderId } });
  expect(reservation.state).toBe('SUBMISSION_UNCERTAIN');
  expect(marker).toMatchObject({ grantId: f.grant.id, intentId: intent.id,
    dispatchBotId: f.bot.id, dispatchCommandHash: reservation.commandHash,
    dispatchIntentHash: intent.payloadHash, dispatchApiKeyId: f.key.id,
    dispatchApiKeyUpdatedAt: f.key.updatedAt });
  expect(await transportStarts(reservation.id)).toBe(0);
  expect(await prisma.log.count({ where: { entityId: reservation.id,
    action: 'EXTERNAL_CLIENT_GRANT_DISPATCH_CLAIMED' } })).toBe(1);
  const retry = await request(createMockOrdersHttpApp()).post(path(f.grant.id))
    .set('Authorization', `Bearer ${f.secret}`).send(input);
  expect(retry.status).toBe(202);
  expect(retry.body).toEqual({ execution: 'MOCK', clientOrderId: input.clientOrderId,
    state: 'RECONCILIATION_REQUIRED' });
  expect(await transportStarts(reservation.id)).toBe(0);
  expect((await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: f.grant.id } }))
    .usedActions).toBe(1);
  const control = await prisma.liveExecutionControl.findUniqueOrThrow({ where: { id: 'global' } });
  await expect(setLiveExecutionPause({ actorUserId: f.user.id, paused: true,
    reason: 'Claim persists after audit failure', expectedVersion: control.version }))
    .rejects.toMatchObject({ code: 'LIVE_PAUSE_SUBMISSION_IN_FLIGHT' });
  await expect(revokeExternalClientGrant(f.user.id, f.grant.id))
    .rejects.toMatchObject({ status: 409 });
});

it('denies transport when the selected key version changes after the claim', async () => {
  const f = await fixture();
  const input = body();
  try {
    await prisma.$executeRawUnsafe(`CREATE FUNCTION mock_001v_rotate_claim_key() RETURNS trigger
      LANGUAGE plpgsql AS $$ BEGIN
        UPDATE "ApiKey" SET "updatedAt" = "updatedAt" + interval '1 second'
        WHERE "id" = (SELECT "dispatchApiKeyId" FROM "LiveCreateOrderSubmission"
          WHERE "id" = NEW."metadata"->>'markerId');
        RETURN NEW; END $$`);
    await prisma.$executeRawUnsafe(`CREATE TRIGGER mock_001v_rotate_claim_key_trigger
      AFTER INSERT ON "Log" FOR EACH ROW
      WHEN (NEW."action" = 'EXTERNAL_CLIENT_GRANT_DISPATCH_CLAIMED')
      EXECUTE FUNCTION mock_001v_rotate_claim_key()`);
    const first = await request(createMockOrdersHttpApp()).post(path(f.grant.id))
      .set('Authorization', `Bearer ${f.secret}`).send(input);
    expect(first.status).toBe(202);
    expect(first.body.state).toBe('RECONCILIATION_REQUIRED');
  } finally {
    await prisma.$executeRawUnsafe('DROP TRIGGER IF EXISTS mock_001v_rotate_claim_key_trigger ON "Log"');
    await prisma.$executeRawUnsafe('DROP FUNCTION IF EXISTS mock_001v_rotate_claim_key()');
  }
  const reservation = await prisma.externalClientGrantReservation.findUniqueOrThrow({
    where: { clientOrderId: input.clientOrderId } });
  const marker = await prisma.liveCreateOrderSubmission.findUniqueOrThrow({
    where: { reservationId: reservation.id } });
  const key = await prisma.apiKey.findUniqueOrThrow({ where: { id: f.key.id } });
  expect(marker.dispatchApiKeyId).toBe(key.id);
  expect(marker.dispatchApiKeyUpdatedAt?.getTime()).not.toBe(key.updatedAt.getTime());
  expect(reservation.state).toBe('SUBMISSION_UNCERTAIN');
  expect(await transportStarts(reservation.id)).toBe(0);
  expect(await prisma.log.count({ where: { entityId: reservation.id,
    action: 'EXTERNAL_CLIENT_GRANT_DISPATCH_CLAIMED' } })).toBe(1);
  const retry = await request(createMockOrdersHttpApp()).post(path(f.grant.id))
    .set('Authorization', `Bearer ${f.secret}`).send(input);
  expect(retry.status).toBe(202);
  expect(await transportStarts(reservation.id)).toBe(0);
  expect((await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: f.grant.id } }))
    .usedActions).toBe(1);
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

it('denies changed reservation hash, scope, and key before claiming mock transport', async () => {
  const cases = [
    { name: 'hash', code: 'RESERVATION_COMMAND_UNAVAILABLE' },
    { name: 'scope', code: 'GRANT_SCOPE_UNAVAILABLE' },
    { name: 'key', code: 'DISPATCH_ACCOUNT_UNAVAILABLE' },
  ] as const;
  for (const testCase of cases) {
    const f = await fixture();
    const input = body();
    const command: GrantLimitCommand = {
      userId: f.user.id, botId: f.bot.id, exchange: 'BINANCE', marketType: 'FUTURES',
      symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER', clientOrderId: input.clientOrderId,
      side: input.side, type: 'LIMIT', quantity: input.quantity,
      limitPrice: input.limitPrice, reduceOnly: false, walletId: f.wallet.id,
      strategyId: f.strategy.id, positionId: null,
    };
    const bound = await bindExternalClientGrantReservationIntent({
      grantId: f.grant.id, secret: f.secret, command,
    }, { getSymbolRules: rules });
    if (testCase.name === 'hash') await prisma.externalClientGrantReservation.update({
      where: { id: bound.reservation.id }, data: { commandHash: 'a'.repeat(64) },
    });
    if (testCase.name === 'scope') await prisma.externalClientGrant.update({
      where: { id: f.grant.id }, data: { symbol: 'ETHUSDT' },
    });
    if (testCase.name === 'key') await prisma.apiKey.update({
      where: { id: f.key.id }, data: { exchange: 'BYBIT' },
    });
    await expect(executeBoundExternalClientGrantMock({
      reservationId: bound.reservation.id, secret: f.secret,
    }), testCase.name).rejects.toMatchObject({ code: testCase.code });
    expect((await prisma.externalClientGrantReservation.findUniqueOrThrow({
      where: { id: bound.reservation.id },
    })).state).toBe('RESERVED');
    expect(await prisma.liveCreateOrderSubmission.count({ where: { grantId: f.grant.id } })).toBe(0);
    expect(await transportStarts(bound.reservation.id)).toBe(0);
    expect(await prisma.log.count({ where: { entityId: bound.reservation.id,
      action: 'EXTERNAL_CLIENT_GRANT_DISPATCH_CLAIMED' } })).toBe(0);
    expect((await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: f.grant.id } }))
      .usedActions).toBe(1);
  }
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
  expect(await prisma.log.count({ where: { entityId: reservation.id,
    action: 'EXTERNAL_CLIENT_GRANT_DISPATCH_CLAIMED' } })).toBe(1);
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

it.skipIf(!process.env.TEST_REDIS_URL || !process.env.TEST_REDIS_CONTAINER)(
  'enforces both buckets with real isolated Redis and fails closed through stop and restart', async () => {
    const container = process.env.TEST_REDIS_CONTAINER ?? '';
    if (!/^soar-ext-001r[23]-redis-[a-z0-9]+$/.test(container)) {
      throw new Error('Real Redis test requires a dedicated 001R container');
    }
    __rateLimitInternals.setGetRedisClientForTests(null);
    const mockApp = createMockOrdersHttpApp();
    mockApp.set('trust proxy', true);
    const target = path(crypto.randomUUID());
    const invalid = '{invalid';
    const ipPrefix = `10.${Math.floor(Math.random() * 254) + 1}.${
      Math.floor(Math.random() * 254) + 1}`;
    const testSecret = () => `soar_ext_${crypto.randomUUID().replace(/-/g, '')}${
      crypto.randomUUID().replace(/-/g, '').slice(0, 11)}`;
    const send = (ip: string, secret: string) => request(mockApp).post(target)
      .set('X-Forwarded-For', ip).set('Authorization', `Bearer ${secret}`)
      .set('Content-Type', 'application/json').send(invalid);
    const secret = testSecret();
    for (let index = 0; index < 10; index += 1) {
      expect((await send(`${ipPrefix}.1`, secret)).status).toBe(400);
    }
    expect((await send(`${ipPrefix}.1`, secret)).status).toBe(429);
    expect(Number(execFileSync('docker', ['exec', container, 'redis-cli', 'DBSIZE'],
      { encoding: 'utf8' }).trim())).toBeGreaterThan(0);
    for (let index = 0; index < 30; index += 1) {
      expect((await send(`${ipPrefix}.2`, testSecret())).status).toBe(400);
    }
    expect((await send(`${ipPrefix}.2`, testSecret())).status).toBe(429);

    execFileSync('docker', ['stop', container], { stdio: 'pipe' });
    let unavailable;
    let unavailableMs = 0;
    const startedAt = Date.now();
    try {
      unavailable = await send(`${ipPrefix}.3`, testSecret());
      unavailableMs = Date.now() - startedAt;
    } finally {
      execFileSync('docker', ['start', container], { stdio: 'pipe' });
    }
    expect(unavailable?.status).toBe(503);
    expect(unavailableMs).toBeLessThan(3_000);
    expect(JSON.stringify(unavailable?.body)).not.toContain(secret);
    let recoveredStatus = 503;
    for (let attempt = 0; attempt < 40 && recoveredStatus === 503; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      recoveredStatus = (await send(`${ipPrefix}.4`, testSecret())).status;
    }
    expect(recoveredStatus).toBe(400);
  }, 45_000);
