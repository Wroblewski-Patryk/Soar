import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../../index';
import { prisma } from '../../../prisma/client';
import { SubscriptionEntitlementsSchema } from '../../subscriptions/subscriptionEntitlements.service';
import { ensureSubscriptionCatalog } from '../../subscriptions/subscriptions.service';
import { signAuthToken } from '../../auth/auth.jwt';

const createAdminAgent = async () => {
  const email = `admin-subscriptions-${Date.now()}-${Math.random()}@example.com`;
  const agent = request.agent(app);
  const password = 'Admin12#$';

  const registerRes = await agent.post('/auth/register').send({
    email,
    password,
  });
  expect(registerRes.status).toBe(201);

  await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });

  const loginRes = await agent.post('/auth/login').send({
    email,
    password,
  });
  expect(loginRes.status).toBe(200);

  return agent;
};

const createUserAgent = async () => {
  const email = `user-subscriptions-${Date.now()}-${Math.random()}@example.com`;
  const agent = request.agent(app);
  const password = 'User12#$';

  const registerRes = await agent.post('/auth/register').send({
    email,
    password,
  });
  expect(registerRes.status).toBe(201);

  const loginRes = await agent.post('/auth/login').send({
    email,
    password,
  });
  expect(loginRes.status).toBe(200);

  return agent;
};

describe('Admin subscription plans API', () => {
  beforeEach(async () => {
    await ensureSubscriptionCatalog(prisma, { seedDefaults: true });
  });

  it('rejects unauthenticated access', async () => {
    const response = await request(app).get('/admin/subscriptions/plans');
    expect(response.status).toBe(401);
  });

  it('rejects non-admin access', async () => {
    const userAgent = await createUserAgent();
    const response = await userAgent.get('/admin/subscriptions/plans');
    expect(response.status).toBe(403);
  });

  it('returns plans catalog for admin', async () => {
    const adminAgent = await createAdminAgent();
    const response = await adminAgent.get('/admin/subscriptions/plans');

    expect(response.status).toBe(200);
    expect(response.body.plans).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'FREE' }),
        expect.objectContaining({ code: 'ADVANCED' }),
        expect.objectContaining({ code: 'PROFESSIONAL' }),
      ]),
    );
  });

  it('updates price and entitlement limits for selected plan', async () => {
    const adminAgent = await createAdminAgent();
    const before = await adminAgent.get('/admin/subscriptions/plans');
    expect(before.status).toBe(200);
    const freePlan = (before.body.plans as Array<{ code: string; entitlements: Record<string, unknown> }>).find(
      (item) => item.code === 'FREE',
    );
    expect(freePlan).toBeDefined();
    if (!freePlan) throw new Error('Expected FREE plan in admin list');

    const currentEntitlements = SubscriptionEntitlementsSchema.parse(freePlan.entitlements);

    const updateResponse = await adminAgent.put('/admin/subscriptions/plans/FREE').send({
      monthlyPriceMinor: 700,
      currency: 'usd',
      entitlements: {
        ...currentEntitlements,
        limits: {
          ...currentEntitlements.limits,
          maxBotsTotal: 2,
          maxBotsByMode: {
            PAPER: 2,
            LIVE: 0,
          },
        },
      },
    });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.code).toBe('FREE');
    expect(updateResponse.body.monthlyPriceMinor).toBe(700);
    expect(updateResponse.body.currency).toBe('USD');
    expect(updateResponse.body.entitlements.limits.maxBotsTotal).toBe(2);
    expect(updateResponse.body.entitlements.limits.maxBotsByMode).toEqual({
      PAPER: 2,
      LIVE: 0,
    });
    const audit = await prisma.log.findFirstOrThrow({
      where: { action: 'admin.subscription_plan.updated', entityType: 'SUBSCRIPTION_PLAN' },
      orderBy: { occurredAt: 'desc' },
    });
    expect(audit.metadata).toMatchObject({ code: 'FREE' });
  });

  it('rejects catalog mutation from bearer-only admin client', async () => {
    const adminAgent = await createAdminAgent();
    const me = await adminAgent.get('/auth/me');
    const user = await prisma.user.findUniqueOrThrow({ where: { id: me.body.id as string } });
    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      role: 'ADMIN',
      sessionVersion: user.sessionVersion,
    }, '1h');
    const before = await prisma.subscriptionPlan.findUniqueOrThrow({ where: { code: 'FREE' } });
    const response = await request(app)
      .put('/admin/subscriptions/plans/FREE')
      .set('Authorization', `Bearer ${token}`)
      .send({ displayName: 'Bearer change' });
    expect(response.status).toBe(403);
    const relocated = await request(app)
      .put('/admin/subscriptions/plans/FREE')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', [`token=${token}`])
      .send({ displayName: 'Relocated change' });
    expect(relocated.status).toBe(403);
    const after = await prisma.subscriptionPlan.findUniqueOrThrow({ where: { code: 'FREE' } });
    expect(after.displayName).toBe(before.displayName);
  });

  it('returns 400 for invalid entitlements payload', async () => {
    const adminAgent = await createAdminAgent();
    const response = await adminAgent.put('/admin/subscriptions/plans/FREE').send({
      entitlements: {
        version: 1,
        limits: {
          maxBotsTotal: 1,
          maxBotsByMode: { PAPER: 2, LIVE: 0 },
          maxConcurrentBacktests: 1,
        },
        features: {
          liveTrading: false,
          syncExternalPositions: true,
          manageExternalPositions: false,
        },
        cadence: {
          allowedIntervals: ['5m'],
          defaultMarketScanInterval: '5m',
          defaultPositionScanInterval: '5m',
        },
      },
    });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe('Validation failed');
  });
});
