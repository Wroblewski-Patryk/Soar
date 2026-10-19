import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { hashPassword } from '../../utils/hash';
import { signAuthToken, signHumanSessionToken } from '../auth/auth.jwt';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';

const createdUserIds: string[] = [];
const password = 'GrantTest1234';
const path = '/dashboard/external-client-grants';
const selfStatusPath = (id: string) => `/external-client/grants/${id}/status`;

afterEach(async () => {
  for (const id of createdUserIds.splice(0)) {
    await prisma.log.deleteMany({ where: { userId: id } });
    await prisma.externalClientGrant.deleteMany({ where: { userId: id } });
    await prisma.bot.deleteMany({ where: { userId: id } });
    await prisma.symbolGroup.deleteMany({ where: { userId: id } });
    await prisma.marketUniverse.deleteMany({ where: { userId: id } });
    await prisma.userSubscription.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });
  }
});

const fixture = async () => {
  if (!decodeURIComponent(new URL(process.env.DATABASE_URL ?? '').pathname).endsWith('_test')) {
    throw new Error('Grant status HTTP tests require an isolated _test database');
  }
  const user = await prisma.user.create({ data: {
    email: `grant-status-${crypto.randomUUID()}@example.com`,
    password: await hashPassword(password), role: 'USER',
  } });
  createdUserIds.push(user.id);
  await ensureSubscriptionCatalog(prisma);
  await setActiveSubscriptionForUser(prisma, {
    userId: user.id, planCode: 'ADVANCED', source: 'ADMIN_OVERRIDE', autoRenew: false,
  });
  const universe = await prisma.marketUniverse.create({ data: {
    userId: user.id, name: 'Grant status test', exchange: 'BINANCE', marketType: 'FUTURES',
  } });
  const group = await prisma.symbolGroup.create({ data: {
    userId: user.id, marketUniverseId: universe.id, name: 'BTC', symbols: ['BTCUSDT'],
  } });
  const bot = await prisma.bot.create({ data: {
    userId: user.id, name: 'Grant status bot', mode: 'LIVE', exchange: 'BINANCE',
    marketType: 'FUTURES', isActive: true, liveOptIn: true, symbolGroupId: group.id,
  } });
  const claims = { userId: user.id, email: user.email, role: user.role,
    sessionVersion: user.sessionVersion };
  return {
    user, bot,
    humanToken: signHumanSessionToken(claims, '1h'),
    legacyToken: signAuthToken(claims, '1h'),
    body: { botId: bot.id, clientLabel: 'Test client', exchange: 'BINANCE',
      marketType: 'FUTURES', symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER',
      maxActionQuoteAmount: '50.00', maxTotalQuoteAmount: '100.00',
      maxActions: 2, ttlSeconds: 3600, password },
  };
};

describe('external client grant self status over HTTP', () => {
  it('reads only its own active scope and limits without changing durable state', async () => {
    const f = await fixture();
    const created = await request(app).post(path)
      .set('Cookie', `token=${f.humanToken}`).send(f.body);
    expect(created.status).toBe(201);
    const { secret, grant } = created.body;
    const before = await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: grant.id } });
    const logCount = await prisma.log.count({ where: { userId: f.user.id } });
    const planCount = await prisma.subscriptionPlan.count();

    const response = await request(app).get(selfStatusPath(grant.id))
      .set('Authorization', `Bearer ${secret}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ grant: {
      id: grant.id, status: 'ACTIVE',
      scope: { botId: f.bot.id, exchange: 'BINANCE', marketType: 'FUTURES',
        symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER' },
      limits: { maxActionQuoteAmount: before.maxActionQuoteAmount.toString(),
        maxTotalQuoteAmount: before.maxTotalQuoteAmount.toString(), maxActions: 2 },
      usage: { usedQuoteAmount: '0', usedActions: 0 },
      expiresAt: before.expiresAt.toISOString(),
    } });
    expect(response.headers['cache-control']).toContain('no-store');
    expect(JSON.stringify(response.body)).not.toContain(secret);
    expect(JSON.stringify(response.body)).not.toContain(before.secretHash);
    expect(JSON.stringify(response.body)).not.toContain(f.user.email);
    expect(JSON.stringify(response.body)).not.toContain(f.user.id);
    expect(JSON.stringify(response.body)).not.toContain('clientLabel');
    expect(JSON.stringify(response.body)).not.toContain('apiKey');
    expect(await prisma.subscriptionPlan.count()).toBe(planCount);
    expect(await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: grant.id } })).toEqual(before);
    expect(await prisma.externalClientGrantReservation.count({ where: { grantId: grant.id } })).toBe(0);
    expect(await prisma.log.count({ where: { userId: f.user.id } })).toBe(logCount);

    await prisma.externalClientGrant.update({ where: { id: grant.id }, data: { usedActions: 2 } });
    const exhausted = await request(app).get(selfStatusPath(grant.id))
      .set('Authorization', `Bearer ${secret}`);
    expect(exhausted.status).toBe(200);
    expect(exhausted.body.grant.status).toBe('EXHAUSTED');
    await prisma.bot.update({ where: { id: f.bot.id }, data: { isActive: false } });
    const unavailableScope = await request(app).get(selfStatusPath(grant.id))
      .set('Authorization', `Bearer ${secret}`);
    expect(unavailableScope.status).toBe(401);
  });

  it('returns one denial for missing, wrong, foreign, revoked and expired grants', async () => {
    const f = await fixture();
    const other = await fixture();
    const created = await request(app).post(path)
      .set('Cookie', `token=${f.humanToken}`).send(f.body);
    expect(created.status).toBe(201);
    const otherCreated = await request(app).post(path)
      .set('Cookie', `token=${other.humanToken}`).send(other.body);
    expect(otherCreated.status).toBe(201);
    const { secret, grant } = created.body;
    const wrongSecret = `${secret.slice(0, -1)}${secret.endsWith('A') ? 'B' : 'A'}`;
    const denied = await Promise.all([
      request(app).get(selfStatusPath(grant.id)),
      request(app).get(selfStatusPath(grant.id)).set('Authorization', `Bearer ${wrongSecret}`),
      request(app).get(selfStatusPath(otherCreated.body.grant.id))
        .set('Authorization', `Bearer ${secret}`),
    ]);
    expect(denied.map((item) => item.status)).toEqual([401, 401, 401]);
    expect(denied[1].body).toEqual(denied[0].body);
    expect(denied[2].body).toEqual(denied[0].body);

    await prisma.externalClientGrant.update({ where: { id: grant.id }, data: { revokedAt: new Date() } });
    const revoked = await request(app).get(selfStatusPath(grant.id))
      .set('Authorization', `Bearer ${secret}`);
    expect(revoked.status).toBe(401);
    expect(revoked.body).toEqual(denied[0].body);
    await prisma.externalClientGrant.update({ where: { id: grant.id },
      data: { revokedAt: null, expiresAt: new Date(0) } });
    const expired = await request(app).get(selfStatusPath(grant.id))
      .set('Authorization', `Bearer ${secret}`);
    expect(expired.status).toBe(401);
    expect(expired.body).toEqual(denied[0].body);
  });

  it('rejects cookies, JWTs, query/body credentials and missing entitlement', async () => {
    const f = await fixture();
    const created = await request(app).post(path)
      .set('Cookie', `token=${f.humanToken}`).send(f.body);
    expect(created.status).toBe(201);
    const { secret, grant } = created.body;
    const url = selfStatusPath(grant.id);
    const denied = [
      await request(app).get(url).set('Cookie', `token=${f.humanToken}`),
      await request(app).get(url).set('Cookie', `token=${secret}`),
      await request(app).get(url).set('Authorization', `Bearer ${f.humanToken}`),
      await request(app).get(url).set('Authorization', `Bearer ${f.legacyToken}`),
      await request(app).get(`${url}?secret=${secret}`),
      await request(app).get(url).send({ secret }),
      await request(app).get(`${url}?secret=${secret}`)
        .set('Authorization', `Bearer ${secret}`),
      await request(app).get(url).set('Authorization', `Bearer ${secret}`).send({ secret }),
      await request(app).get(url).set('Cookie', `token=${f.humanToken}`)
        .set('Authorization', `Bearer ${secret}`),
    ];
    expect(denied.map((item) => item.status)).toEqual(Array(denied.length).fill(401));
    for (const response of denied) expect(JSON.stringify(response.body)).not.toContain(secret);

    await prisma.userSubscription.updateMany({ where: { userId: f.user.id, status: 'ACTIVE' },
      data: { status: 'CANCELED', endsAt: new Date() } });
    const noPlan = await request(app).get(url).set('Authorization', `Bearer ${secret}`);
    expect(noPlan.status).toBe(401);
    expect(noPlan.body).toEqual(denied[0].body);
  });
});
