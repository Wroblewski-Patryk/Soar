import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { hashPassword } from '../../utils/hash';
import { signAuthToken, signHumanSessionToken } from '../auth/auth.jwt';
import { inspectExternalClientGrant } from './externalClientGrants.service';

const createdUserIds: string[] = [];
const password = 'GrantTest1234';
const path = '/dashboard/external-client-grants';

afterEach(async () => {
  for (const id of createdUserIds.splice(0)) {
    await prisma.log.deleteMany({ where: { userId: id } });
    await prisma.externalClientGrant.deleteMany({ where: { userId: id } });
    await prisma.bot.deleteMany({ where: { userId: id } });
    await prisma.symbolGroup.deleteMany({ where: { userId: id } });
    await prisma.marketUniverse.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });
  }
});

const fixture = async (role: 'USER' | 'ADMIN' = 'USER') => {
  const user = await prisma.user.create({
    data: { email: `grant-${crypto.randomUUID()}@example.com`, password: await hashPassword(password), role },
  });
  createdUserIds.push(user.id);
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
  return { user, bot, humanToken, legacyToken, body };
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
});
