import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { hashPassword } from '../../utils/hash';
import { signAuthToken, signHumanSessionToken } from '../auth/auth.jwt';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { inspectExternalClientGrant } from './externalClientGrants.service';

const createdUserIds: string[] = [];
const password = 'GrantTest1234';
const path = '/dashboard/external-client-grants';

beforeEach(async () => {
  await ensureSubscriptionCatalog(prisma, { seedDefaults: true });
});

afterEach(async () => {
  for (const id of createdUserIds.splice(0)) {
    await prisma.log.deleteMany({ where: { userId: id } });
    await prisma.externalClientGrant.deleteMany({ where: { userId: id } });
    await prisma.botMarketGroup.deleteMany({ where: { userId: id } });
    await prisma.bot.deleteMany({ where: { userId: id } });
    await prisma.symbolGroup.deleteMany({ where: { userId: id } });
    await prisma.marketUniverse.deleteMany({ where: { userId: id } });
    await prisma.userSubscription.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });
  }
  vi.restoreAllMocks();
});

const fixture = async (role: 'USER' | 'ADMIN' = 'USER', assignPlan = true) => {
  const user = await prisma.user.create({
    data: { email: `grant-${crypto.randomUUID()}@example.com`, password: await hashPassword(password), role },
  });
  createdUserIds.push(user.id);
  if (assignPlan) {
    await ensureSubscriptionCatalog(prisma);
    await setActiveSubscriptionForUser(prisma, {
      userId: user.id, planCode: 'ADVANCED', source: 'ADMIN_OVERRIDE', autoRenew: false,
    });
  }
  const universe = await prisma.marketUniverse.create({
    data: { userId: user.id, name: 'Grant test', exchange: 'BINANCE', marketType: 'FUTURES' },
  });
  const group = await prisma.symbolGroup.create({
    data: { userId: user.id, marketUniverseId: universe.id, name: 'BTC', symbols: ['BTCUSDT'] },
  });
  const bot = await prisma.bot.create({
    data: { userId: user.id, name: 'Grant test bot', mode: 'LIVE', exchange: 'BINANCE',
      marketType: 'FUTURES', isActive: true, liveOptIn: true, symbolGroupId: group.id },
  });
  const claims = { userId: user.id, email: user.email, role: user.role, sessionVersion: user.sessionVersion };
  const humanToken = signHumanSessionToken(claims, '1h');
  const legacyToken = signAuthToken(claims, '1h');
  const body = {
    botId: bot.id, clientLabel: 'Local Claude', exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'BTCUSDT',
    action: 'PLACE_LIVE_ORDER', maxActionQuoteAmount: '50.00', maxTotalQuoteAmount: '100.00',
    maxActions: 2, ttlSeconds: 3600, password,
  };
  return { user, bot, group, humanToken, legacyToken, body };
};

describe('external client grant foundation', () => {
  it('requires a signed human cookie and current password for both user and admin', async () => {
    for (const role of ['USER', 'ADMIN'] as const) {
      const f = await fixture(role);
      expect((await request(app).post(path).set('Authorization', `Bearer ${f.humanToken}`).send(f.body)).status).toBe(403);
      expect((await request(app).post(path).set('Cookie', `token=${f.legacyToken}`).send(f.body)).status).toBe(401);
      expect((await request(app).post(path).set('Cookie', `token=${f.humanToken}`)
        .set('Authorization', `Bearer ${f.legacyToken}`).send(f.body)).status).toBe(403);
      expect((await request(app).post(path).set('Cookie', `token=${f.humanToken}`)
        .send({ ...f.body, password: 'wrong' })).status).toBe(403);
      const created = await request(app).post(path).set('Cookie', `token=${f.humanToken}`).send(f.body);
      expect(created.status).toBe(201);
      expect(created.body.secret).toMatch(/^soar_ext_[A-Za-z0-9_-]{43}$/);
      const grantBearer = `Bearer ${created.body.secret}`;
      expect((await request(app).get('/admin/users').set('Authorization', grantBearer)).status).toBe(401);
      expect((await request(app).patch(`/admin/users/${f.user.id}`).set('Authorization', grantBearer)
        .send({ role: role === 'USER' ? 'ADMIN' : 'USER' })).status).toBe(401);
      expect((await prisma.user.findUniqueOrThrow({ where: { id: f.user.id } })).role).toBe(role);
    }
  });

  it('checks exact scope, limits, expiry, and immediate revocation; never reads back the secret', async () => {
    const f = await fixture();
    const cookie = `token=${f.humanToken}`;
    const created = await request(app).post(path).set('Cookie', cookie).send(f.body);
    expect(created.status).toBe(201);
    const { secret, grant } = created.body;
    const scope = { secret, userId: f.user.id, botId: f.bot.id,
      exchange: 'BINANCE' as const, marketType: 'FUTURES' as const,
      symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER' as const, quoteAmount: '50.00' };
    expect(await inspectExternalClientGrant(scope)).toMatchObject({ grantId: grant.id });
    expect(await inspectExternalClientGrant({ ...scope, symbol: 'ETHUSDT' })).toBeNull();
    expect(await inspectExternalClientGrant({ ...scope, quoteAmount: '50.01' })).toBeNull();
    expect(await inspectExternalClientGrant({ ...scope, secret: f.legacyToken })).toBeNull();

    const listed = await request(app).get(path).set('Cookie', cookie);
    const status = await request(app).get(`${path}/${grant.id}`).set('Cookie', cookie);
    expect(listed.status).toBe(200);
    expect(status.status).toBe(200);
    expect(JSON.stringify(listed.body) + JSON.stringify(status.body)).not.toContain(secret);
    expect(JSON.stringify(listed.body) + JSON.stringify(status.body)).not.toContain('secretHash');
    const stored = await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: grant.id } });
    expect(stored.secretHash).not.toBe(secret);
    const logs = await prisma.log.findMany({ where: { entityId: grant.id } });
    expect(logs).toHaveLength(1);
    expect(JSON.stringify(logs)).not.toContain(secret);
    expect(JSON.stringify(logs)).not.toContain(stored.secretHash);

    await prisma.externalClientGrant.update({ where: { id: grant.id }, data: { usedActions: 1, usedQuoteAmount: '75' } });
    expect(await inspectExternalClientGrant(scope)).toBeNull();
    await prisma.externalClientGrant.update({ where: { id: grant.id }, data: { usedActions: 2, usedQuoteAmount: '0' } });
    expect(await inspectExternalClientGrant(scope)).toBeNull();
    await prisma.externalClientGrant.update({ where: { id: grant.id }, data: { usedActions: 0, expiresAt: new Date(0) } });
    expect(await inspectExternalClientGrant(scope)).toBeNull();
    await prisma.externalClientGrant.update({ where: { id: grant.id }, data: { expiresAt: new Date(Date.now() + 60_000) } });
    const revoked = await request(app).post(`${path}/${grant.id}/revoke`).set('Cookie', cookie);
    expect(revoked.status).toBe(200);
    expect(revoked.body.grant.revokedAt).toBeTruthy();
    expect(await inspectExternalClientGrant(scope)).toBeNull();
    expect((await request(app).post(`${path}/${grant.id}/revoke`).set('Cookie', cookie)).status).toBe(200);
    expect((await prisma.log.findMany({ where: { entityId: grant.id } })).map((log) => log.action))
      .toEqual(['EXTERNAL_CLIENT_GRANT_CREATED', 'EXTERNAL_CLIENT_GRANT_REVOKED']);
    expect((await request(app).get(`${path}/${grant.id}`).set('Authorization', `Bearer ${f.humanToken}`)).status).toBe(403);
  });

  it('rejects another owner, unassigned symbol, and unsupported execution route', async () => {
    const f = await fixture();
    const other = await fixture();
    const cookie = `token=${f.humanToken}`;
    expect((await request(app).post(path).set('Cookie', cookie)
      .send({ ...f.body, botId: other.bot.id })).status).toBe(404);
    expect((await request(app).post(path).set('Cookie', cookie)
      .send({ ...f.body, symbol: 'ETHUSDT' })).status).toBe(400);
    expect((await request(app).post(path).set('Cookie', cookie)
      .send({ ...f.body, maxActionQuoteAmount: '0' })).status).toBe(400);
    const created = await request(app).post(path).set('Cookie', cookie).send(f.body);
    expect(created.status).toBe(201);
    const grantId = created.body.grant.id;
    expect((await request(app).get(`${path}/${grantId}`).set('Cookie', `token=${other.humanToken}`)).status).toBe(404);
    expect((await request(app).post(`${path}/${grantId}/revoke`).set('Cookie', `token=${other.humanToken}`)).status).toBe(404);
    await prisma.bot.update({ where: { id: f.bot.id }, data: { isActive: false } });
    expect(await inspectExternalClientGrant({ secret: created.body.secret, userId: f.user.id,
      botId: f.bot.id, exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'BTCUSDT',
      action: 'PLACE_LIVE_ORDER', quoteAmount: '1' })).toBeNull();
    expect((await request(app).post(`${path}/anything/execute`).set('Cookie', cookie).send({})).status).toBe(404);
  });

  it('requires the same current LIVE entitlement as domain order execution', async () => {
    const unassigned = await fixture('USER', false);
    const unassignedResponse = await request(app).post(path)
      .set('Cookie', `token=${unassigned.humanToken}`).send(unassigned.body);
    expect(unassignedResponse.status).toBe(403);
    expect(await prisma.externalClientGrant.count({ where: { userId: unassigned.user.id } })).toBe(0);

    const f = await fixture();
    const cookie = `token=${f.humanToken}`;
    const created = await request(app).post(path).set('Cookie', cookie).send(f.body);
    expect(created.status).toBe(201);
    const scope = { secret: created.body.secret, userId: f.user.id, botId: f.bot.id,
      exchange: 'BINANCE' as const, marketType: 'FUTURES' as const, symbol: 'BTCUSDT',
      action: 'PLACE_LIVE_ORDER' as const, quoteAmount: '1' };
    expect(await inspectExternalClientGrant(scope)).toMatchObject({ grantId: created.body.grant.id });

    await prisma.userSubscription.updateMany({
      where: { userId: f.user.id, status: 'ACTIVE' }, data: { status: 'CANCELED', endsAt: new Date() },
    });
    expect(await inspectExternalClientGrant(scope)).toBeNull();
    expect((await request(app).post(path).set('Cookie', cookie).send(f.body)).status).toBe(403);

    await setActiveSubscriptionForUser(prisma, {
      userId: f.user.id, planCode: 'FREE', source: 'ADMIN_OVERRIDE', autoRenew: false,
    });
    expect(await inspectExternalClientGrant(scope)).toBeNull();
    expect((await request(app).post(path).set('Cookie', cookie).send(f.body)).status).toBe(403);
  });

  it('keeps legacy fallback only when no new market-group assignment exists', async () => {
    const f = await fixture();
    const cookie = `token=${f.humanToken}`;
    const legacy = await request(app).post(path).set('Cookie', cookie).send(f.body);
    expect(legacy.status).toBe(201);
    const scope = { secret: legacy.body.secret, userId: f.user.id, botId: f.bot.id,
      exchange: 'BINANCE' as const, marketType: 'FUTURES' as const, symbol: 'BTCUSDT',
      action: 'PLACE_LIVE_ORDER' as const, quoteAmount: '1' };
    expect(await inspectExternalClientGrant(scope)).toMatchObject({ grantId: legacy.body.grant.id });

    const assignment = await prisma.botMarketGroup.create({
      data: { userId: f.user.id, botId: f.bot.id, symbolGroupId: f.group.id,
        isEnabled: true, lifecycleStatus: 'ACTIVE' },
    });
    expect(await inspectExternalClientGrant(scope)).toMatchObject({ grantId: legacy.body.grant.id });
    await prisma.botMarketGroup.update({ where: { id: assignment.id }, data: { lifecycleStatus: 'PAUSED' } });
    expect(await inspectExternalClientGrant(scope)).toBeNull();
    expect((await request(app).post(path).set('Cookie', cookie).send(f.body)).status).toBe(400);
    await prisma.botMarketGroup.update({
      where: { id: assignment.id }, data: { lifecycleStatus: 'ACTIVE', isEnabled: false },
    });
    expect(await inspectExternalClientGrant(scope)).toBeNull();
    await prisma.botMarketGroup.update({ where: { id: assignment.id }, data: { isEnabled: true } });
    expect(await inspectExternalClientGrant(scope)).toMatchObject({ grantId: legacy.body.grant.id });
  });

  it('fails closed when the entitlement read fails during creation or inspection', async () => {
    const f = await fixture();
    const cookie = `token=${f.humanToken}`;
    const created = await request(app).post(path).set('Cookie', cookie).send(f.body);
    expect(created.status).toBe(201);
    expect(await inspectExternalClientGrant({ secret: created.body.secret, userId: f.user.id,
      botId: f.bot.id, exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'BTCUSDT',
      action: 'PLACE_LIVE_ORDER', quoteAmount: '1' })).toMatchObject({ grantId: created.body.grant.id });
    const inspectRead = vi.spyOn(prisma.userSubscription, 'findFirst')
      .mockRejectedValueOnce(new Error('test entitlement read failure'));
    expect(await inspectExternalClientGrant({ secret: created.body.secret, userId: f.user.id,
      botId: f.bot.id, exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'BTCUSDT',
      action: 'PLACE_LIVE_ORDER', quoteAmount: '1' })).toBeNull();
    inspectRead.mockRejectedValueOnce(new Error('test entitlement read failure'));
    expect((await request(app).post(path).set('Cookie', cookie).send(f.body)).status).toBe(500);
    expect(await prisma.externalClientGrant.count({ where: { userId: f.user.id } })).toBe(1);
  });
});
