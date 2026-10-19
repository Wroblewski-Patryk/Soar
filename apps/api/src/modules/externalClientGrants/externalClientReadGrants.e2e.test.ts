import request from 'supertest';
import { createHash } from 'node:crypto';
import { afterEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { hashPassword } from '../../utils/hash';
import { signAuthToken, signHumanSessionToken } from '../auth/auth.jwt';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { inspectExternalClientGrant } from './externalClientGrants.service';

const path = '/dashboard/external-client-read-grants';
const orderPath = '/dashboard/external-client-grants';
const password = 'ReadGrantTest1234';
const createdUserIds: string[] = [];

const fixture = async (assignPlan = true) => {
  if (!decodeURIComponent(new URL(process.env.DATABASE_URL ?? '').pathname).endsWith('_test')) {
    throw new Error('Read grant HTTP tests require an isolated _test database');
  }
  const user = await prisma.user.create({ data: {
    email: `read-grant-${crypto.randomUUID()}@example.com`,
    password: await hashPassword(password), role: 'USER',
  } });
  createdUserIds.push(user.id);
  if (assignPlan) {
    await ensureSubscriptionCatalog(prisma);
    await setActiveSubscriptionForUser(prisma, {
      userId: user.id, planCode: 'ADVANCED', source: 'ADMIN_OVERRIDE', autoRenew: false,
    });
  }
  const bot = await prisma.bot.create({ data: {
    userId: user.id, name: 'Read grant PAPER bot', mode: 'PAPER',
    exchange: 'BINANCE', marketType: 'FUTURES', isActive: true,
  } });
  const claims = { userId: user.id, email: user.email, role: user.role,
    sessionVersion: user.sessionVersion };
  return {
    user, bot,
    cookie: `token=${signHumanSessionToken(claims, '1h')}`,
    legacyToken: signAuthToken(claims, '1h'),
    body: { botId: bot.id, clientLabel: 'Read client',
      action: 'READ_BOT_STATUS', ttlSeconds: 3600, password },
  };
};

afterEach(async () => {
  for (const userId of createdUserIds.splice(0)) {
    await prisma.log.deleteMany({ where: { userId } });
    await prisma.externalClientReadGrant.deleteMany({ where: { userId } });
    await prisma.externalClientGrant.deleteMany({ where: { userId } });
    await prisma.bot.deleteMany({ where: { userId } });
    await prisma.userSubscription.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  }
});

describe('explicit external client read grant foundation', () => {
  it('requires a human cookie, current password, eligible plan, and owned bot', async () => {
    const f = await fixture();
    const other = await fixture();
    expect((await request(app).post(path).set('Authorization', `Bearer ${f.cookie.slice(6)}`)
      .send(f.body)).status).toBe(403);
    expect((await request(app).post(path).set('Cookie', `token=${f.legacyToken}`)
      .send(f.body)).status).toBe(401);
    expect((await request(app).post(path).set('Cookie', f.cookie)
      .send({ ...f.body, password: 'wrong' })).status).toBe(403);
    expect((await request(app).post(path).set('Cookie', f.cookie)
      .send({ ...f.body, botId: other.bot.id })).status).toBe(404);
    expect(await prisma.externalClientReadGrant.count()).toBe(0);

    const unassigned = await fixture(false);
    expect((await request(app).post(path).set('Cookie', unassigned.cookie)
      .send(unassigned.body)).status).toBe(403);
    expect(await prisma.externalClientReadGrant.count()).toBe(0);
  });

  it('creates a bot-only PAPER scope and supports list, owner readback, and immediate revoke', async () => {
    const f = await fixture();
    const other = await fixture();
    const created = await request(app).post(path).set('Cookie', f.cookie).send(f.body);
    expect(created.status).toBe(201);
    const { grant, secret } = created.body;
    expect(secret).toMatch(/^soar_read_[A-Za-z0-9_-]{43}$/);
    expect(grant).toMatchObject({ botId: f.bot.id, clientLabel: 'Read client',
      action: 'READ_BOT_STATUS', revokedAt: null });
    expect(grant).not.toHaveProperty('secretHash');
    expect(grant).not.toHaveProperty('maxActionQuoteAmount');
    const stored = await prisma.externalClientReadGrant.findUniqueOrThrow({ where: { id: grant.id } });
    expect(stored.secretHash).toBe(createHash('sha256').update(secret).digest('hex'));
    expect(stored.expiresAt.getTime() - stored.createdAt.getTime()).toBeGreaterThan(59_000);
    expect(stored.expiresAt.getTime() - stored.createdAt.getTime()).toBeLessThanOrEqual(3_600_000);

    const listed = await request(app).get(path).set('Cookie', f.cookie);
    const readback = await request(app).get(`${path}/${grant.id}`).set('Cookie', f.cookie);
    expect(listed.status).toBe(200);
    expect(listed.body.grants).toHaveLength(1);
    expect(readback.status).toBe(200);
    expect(readback.body.grant.id).toBe(grant.id);
    expect(JSON.stringify(listed.body) + JSON.stringify(readback.body)).not.toContain(secret);
    expect(JSON.stringify(listed.body) + JSON.stringify(readback.body)).not.toContain('secretHash');
    expect((await request(app).get(`${path}/${grant.id}`).set('Cookie', other.cookie)).status).toBe(404);
    expect((await request(app).post(`${path}/${grant.id}/revoke`)
      .set('Cookie', other.cookie)).status).toBe(404);
    expect((await request(app).get(path).set('Cookie', other.cookie)).body.grants).toHaveLength(0);

    const revoked = await request(app).post(`${path}/${grant.id}/revoke`).set('Cookie', f.cookie);
    expect(revoked.status).toBe(200);
    expect(revoked.body.grant.revokedAt).toBeTruthy();
    expect((await request(app).get(`${path}/${grant.id}`).set('Cookie', f.cookie))
      .body.grant.revokedAt).toBe(revoked.body.grant.revokedAt);
    expect((await request(app).post(`${path}/${grant.id}/revoke`)
      .set('Cookie', f.cookie)).body.grant.revokedAt).toBe(revoked.body.grant.revokedAt);
    const logs = await prisma.log.findMany({ where: { entityId: grant.id } });
    expect(logs.map((log) => log.action)).toEqual([
      'EXTERNAL_CLIENT_READ_GRANT_CREATED', 'EXTERNAL_CLIENT_READ_GRANT_REVOKED',
    ]);
    expect(JSON.stringify(logs)).not.toContain(secret);
    expect(JSON.stringify(logs)).not.toContain(stored.secretHash);
  });

  it('rejects cross-action input and cannot use a read secret as an order grant', async () => {
    const f = await fixture();
    expect((await request(app).post(path).set('Cookie', f.cookie)
      .send({ ...f.body, action: 'PLACE_LIVE_ORDER' })).status).toBe(400);
    expect((await request(app).post(path).set('Cookie', f.cookie)
      .send({ ...f.body, maxActions: 1 })).status).toBe(400);
    expect((await request(app).post(path).set('Cookie', f.cookie)
      .send({ ...f.body, ttlSeconds: 7 * 24 * 60 * 60 + 1 })).status).toBe(400);
    const orderBody = { ...f.body, action: 'READ_BOT_STATUS', exchange: 'BINANCE',
      marketType: 'FUTURES', symbol: 'BTCUSDT', maxActionQuoteAmount: '50',
      maxTotalQuoteAmount: '100', maxActions: 2 };
    expect((await request(app).post(orderPath).set('Cookie', f.cookie).send(orderBody)).status).toBe(400);

    const created = await request(app).post(path).set('Cookie', f.cookie).send(f.body);
    expect(created.status).toBe(201);
    expect(await inspectExternalClientGrant({ secret: created.body.secret, userId: f.user.id,
      botId: f.bot.id, exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'BTCUSDT',
      action: 'PLACE_LIVE_ORDER', quoteAmount: '1' })).toBeNull();
    expect((await request(app).get(`/external-client/grants/${created.body.grant.id}/status`)
      .set('Authorization', `Bearer ${created.body.secret}`)).status).toBe(401);
    expect(await prisma.externalClientGrant.count({ where: { userId: f.user.id } })).toBe(0);
  });
});
