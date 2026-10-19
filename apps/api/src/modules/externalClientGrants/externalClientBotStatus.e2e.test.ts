import { randomBytes } from 'node:crypto';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { __rateLimitInternals } from '../../middleware/rateLimit';
import { prisma } from '../../prisma/client';
import { hashPassword } from '../../utils/hash';
import { signHumanSessionToken } from '../auth/auth.jwt';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { hashExternalClientGrantSecret } from './externalClientGrants.service';
import { createExternalClientReadGrant } from './externalClientReadGrants.service';

const path = (botId: string) => `/external-client/bots/${botId}/status`;
const password = 'BotStatusTest1234';
const createdUserIds: string[] = [];

const fixture = async () => {
  if (!decodeURIComponent(new URL(process.env.DATABASE_URL ?? '').pathname).endsWith('_test')) {
    throw new Error('External bot status tests require an isolated _test database');
  }
  const user = await prisma.user.create({ data: {
    email: `bot-status-${crypto.randomUUID()}@example.com`,
    password: await hashPassword(password), role: 'USER',
  } });
  createdUserIds.push(user.id);
  await ensureSubscriptionCatalog(prisma);
  await setActiveSubscriptionForUser(prisma, {
    userId: user.id, planCode: 'ADVANCED', source: 'ADMIN_OVERRIDE', autoRenew: false,
  });
  const bot = await prisma.bot.create({ data: {
    userId: user.id, name: 'Private bot name', mode: 'PAPER', isActive: true,
    exchange: 'BINANCE', marketType: 'FUTURES',
  } });
  const { grant, secret } = await createExternalClientReadGrant(user.id, {
    botId: bot.id, clientLabel: 'Status reader', action: 'READ_BOT_STATUS',
    ttlSeconds: 3600, password,
  });
  const humanToken = signHumanSessionToken({
    userId: user.id, email: user.email, role: user.role,
    sessionVersion: user.sessionVersion,
  }, '1h');
  return { user, bot, grant, secret, humanToken };
};

afterEach(async () => {
  delete process.env.RATE_LIMIT_ENABLE_TEST_MODE;
  __rateLimitInternals.resetForTests();
  for (const userId of createdUserIds.splice(0)) {
    await prisma.log.deleteMany({ where: { userId } });
    await prisma.externalClientReadGrant.deleteMany({ where: { userId } });
    await prisma.externalClientGrant.deleteMany({ where: { userId } });
    await prisma.bot.deleteMany({ where: { userId } });
    await prisma.userSubscription.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  }
});

describe('external client bot configuration status', () => {
  it('returns only persisted configuration with no domain or catalog writes', async () => {
    const f = await fixture();
    const before = {
      bot: await prisma.bot.findUniqueOrThrow({ where: { id: f.bot.id } }),
      grant: await prisma.externalClientReadGrant.findUniqueOrThrow({ where: { id: f.grant.id } }),
      subscription: await prisma.userSubscription.findFirstOrThrow({ where: { userId: f.user.id } }),
      logs: await prisma.log.count({ where: { userId: f.user.id } }),
      plans: await prisma.subscriptionPlan.count(),
      orders: await prisma.order.count({ where: { userId: f.user.id } }),
      positions: await prisma.position.count({ where: { userId: f.user.id } }),
    };
    const response = await request(app).get(path(f.bot.id))
      .set('Authorization', `Bearer ${f.secret}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ bot: { id: f.bot.id, mode: 'PAPER', isActive: true } });
    expect(response.headers['cache-control']).toContain('no-store');
    expect(JSON.stringify(response.body)).not.toContain(f.secret);
    expect(JSON.stringify(response.body)).not.toContain(f.user.id);
    expect(JSON.stringify(response.body)).not.toContain(f.user.email);
    expect(JSON.stringify(response.body)).not.toContain(f.bot.name);
    expect(JSON.stringify(response.body)).not.toContain('apiKey');
    expect(await prisma.bot.findUniqueOrThrow({ where: { id: f.bot.id } })).toEqual(before.bot);
    expect(await prisma.externalClientReadGrant.findUniqueOrThrow({ where: { id: f.grant.id } })).toEqual(before.grant);
    expect(await prisma.userSubscription.findFirstOrThrow({ where: { userId: f.user.id } })).toEqual(before.subscription);
    expect(await prisma.log.count({ where: { userId: f.user.id } })).toBe(before.logs);
    expect(await prisma.subscriptionPlan.count()).toBe(before.plans);
    expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(before.orders);
    expect(await prisma.position.count({ where: { userId: f.user.id } })).toBe(before.positions);

    await prisma.bot.update({ where: { id: f.bot.id }, data: { isActive: false } });
    const disabled = await request(app).get(path(f.bot.id))
      .set('Authorization', `Bearer ${f.secret}`);
    expect(disabled.body).toEqual({ bot: { id: f.bot.id, mode: 'PAPER', isActive: false } });
  });

  it('uses one nonenumerating denial for missing, foreign, revoked, expired, and ineligible scope', async () => {
    const f = await fixture();
    const other = await fixture();
    const wrongSecret = `${f.secret.slice(0, -1)}${f.secret.endsWith('A') ? 'B' : 'A'}`;
    const baseline = await request(app).get(path(f.bot.id));
    expect(baseline.status).toBe(401);
    const denied = [
      await request(app).get(path(f.bot.id)).set('Authorization', `Bearer ${wrongSecret}`),
      await request(app).get(path(other.bot.id)).set('Authorization', `Bearer ${f.secret}`),
      await request(app).get(path(f.bot.id)).set('Authorization', `Bearer ${other.secret}`),
    ];
    for (const response of denied) {
      expect(response.status).toBe(401);
      expect(response.body).toEqual(baseline.body);
    }

    await prisma.externalClientReadGrant.update({ where: { id: f.grant.id }, data: { revokedAt: new Date() } });
    const revoked = await request(app).get(path(f.bot.id)).set('Authorization', `Bearer ${f.secret}`);
    expect(revoked.status).toBe(401);
    expect(revoked.body).toEqual(baseline.body);
    await prisma.externalClientReadGrant.update({ where: { id: f.grant.id },
      data: { revokedAt: null, expiresAt: new Date(0) } });
    const expired = await request(app).get(path(f.bot.id)).set('Authorization', `Bearer ${f.secret}`);
    expect(expired.status).toBe(401);
    expect(expired.body).toEqual(baseline.body);
    await prisma.externalClientReadGrant.update({ where: { id: f.grant.id },
      data: { expiresAt: new Date(Date.now() + 60_000) } });
    await prisma.userSubscription.updateMany({ where: { userId: f.user.id, status: 'ACTIVE' },
      data: { status: 'CANCELED', endsAt: new Date() } });
    const noPlan = await request(app).get(path(f.bot.id)).set('Authorization', `Bearer ${f.secret}`);
    expect(noPlan.status).toBe(401);
    expect(noPlan.body).toEqual(baseline.body);
    await setActiveSubscriptionForUser(prisma, {
      userId: f.user.id, planCode: 'FREE', source: 'ADMIN_OVERRIDE', autoRenew: false,
    });
    const freePlan = await request(app).get(path(f.bot.id)).set('Authorization', `Bearer ${f.secret}`);
    expect(freePlan.status).toBe(401);
    expect(freePlan.body).toEqual(baseline.body);
  });

  it('rejects cookies, JWTs, query/body credentials, and the old order secret', async () => {
    const f = await fixture();
    const oldSecret = `soar_ext_${randomBytes(32).toString('base64url')}`;
    await prisma.externalClientGrant.create({ data: {
      userId: f.user.id, botId: f.bot.id, clientLabel: 'Old order scope',
      secretHash: hashExternalClientGrantSecret(oldSecret), exchange: 'BINANCE',
      marketType: 'FUTURES', symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER',
      maxActionQuoteAmount: '10', maxTotalQuoteAmount: '20', maxActions: 2,
      expiresAt: new Date(Date.now() + 3600_000),
    } });
    const url = path(f.bot.id);
    const denied = [
      await request(app).get(url).set('Cookie', `token=${f.humanToken}`),
      await request(app).get(url).set('Authorization', `Bearer ${f.humanToken}`),
      await request(app).get(url).set('Authorization', `Bearer ${oldSecret}`),
      await request(app).get(`${url}?secret=${f.secret}`),
      await request(app).get(url).send({ secret: f.secret }),
      await request(app).get(url).set('Cookie', `token=${f.humanToken}`)
        .set('Authorization', `Bearer ${f.secret}`),
      await request(app).get(`${url}?secret=${f.secret}`)
        .set('Authorization', `Bearer ${f.secret}`),
      await request(app).get(url).set('Authorization', `Bearer ${f.secret}`)
        .send({ secret: f.secret }),
    ];
    expect(denied.map((response) => response.status)).toEqual(Array(denied.length).fill(401));
    for (const response of denied) expect(JSON.stringify(response.body)).not.toContain(f.secret);
  });

  it('limits each IP to 30/min and the same grant across IPs to 60/min', async () => {
    const f = await fixture();
    process.env.RATE_LIMIT_ENABLE_TEST_MODE = 'true';
    __rateLimitInternals.setGetRedisClientForTests(async () => null);
    const previousTrustProxy = app.get('trust proxy');
    app.set('trust proxy', true);
    try {
      for (let index = 0; index < 30; index += 1) {
        const response = await request(app).get(path(f.bot.id))
          .set('X-Forwarded-For', '10.1.0.1').set('Authorization', `Bearer ${f.secret}`);
        expect(response.status).toBe(200);
      }
      expect((await request(app).get(path(f.bot.id))
        .set('X-Forwarded-For', '10.1.0.1')
        .set('Authorization', `Bearer ${f.secret}`)).status).toBe(429);
      for (let index = 30; index < 60; index += 1) {
        const response = await request(app).get(path(f.bot.id))
          .set('X-Forwarded-For', '10.1.0.2').set('Authorization', `Bearer ${f.secret}`);
        expect(response.status).toBe(200);
      }
      expect((await request(app).get(path(f.bot.id))
        .set('X-Forwarded-For', '10.1.0.3')
        .set('Authorization', `Bearer ${f.secret}`)).status).toBe(429);
    } finally {
      app.set('trust proxy', previousTrustProxy);
    }
  }, 45_000);

  it('returns bounded 503 while Redis connect hangs and reads again after recovery', async () => {
    const f = await fixture();
    process.env.RATE_LIMIT_ENABLE_TEST_MODE = 'true';
    let release!: (client: any) => void;
    const pending = new Promise<any>((resolve) => { release = resolve; });
    __rateLimitInternals.setGetRedisClientForTests(() => pending);
    const startedAt = Date.now();
    const unavailable = await request(app).get(path(f.bot.id))
      .set('Authorization', `Bearer ${f.secret}`);
    expect(unavailable.status).toBe(503);
    expect(unavailable.headers['x-ratelimit-degraded']).toBe('redis_unavailable');
    expect(Date.now() - startedAt).toBeLessThan(3000);
    expect(JSON.stringify(unavailable.body)).not.toContain(f.secret);

    release({ eval: async () => [1, 60_000] });
    const recovered = await request(app).get(path(f.bot.id))
      .set('Authorization', `Bearer ${f.secret}`);
    expect(recovered.status).toBe(200);
    expect(recovered.body).toEqual({ bot: { id: f.bot.id, mode: 'PAPER', isActive: true } });
  });
});
