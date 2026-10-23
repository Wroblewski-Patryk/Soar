import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../../index';
import { prisma } from '../../../prisma/client';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../../subscriptions/subscriptions.service';

const register = async (email: string) => {
  const agent = request.agent(app);
  const response = await agent.post('/auth/register').send({ email, password: 'test1234' });
  expect(response.status).toBe(201);
  return { agent, userId: response.body.user.id as string };
};

describe('Profile subscription contract', () => {
  beforeEach(async () => {
    await ensureSubscriptionCatalog(prisma, { seedDefaults: true });
  });

  it('shows the catalog without assigning a plan to a newly registered user', async () => {
    const { agent, userId } = await register('subscription-unassigned@example.com');
    expect(await prisma.userSubscription.count({ where: { userId } })).toBe(0);

    for (let read = 0; read < 2; read += 1) {
      const response = await agent.get('/dashboard/profile/subscription');
      expect(response.status).toBe(200);
      expect(response.body.catalog.map((item: { code: string }) => item.code)).toEqual([
        'FREE', 'ADVANCED', 'PROFESSIONAL',
      ]);
      expect(response.body.activeSubscription).toBeNull();
      expect(response.body.activePlanCode).toBeNull();
    }
    expect(await prisma.userSubscription.count({ where: { userId } })).toBe(0);
  });

  it('shows only the plan assigned by an administrator', async () => {
    const { agent, userId } = await register('subscription-admin-assigned@example.com');
    await setActiveSubscriptionForUser(prisma, {
      userId,
      planCode: 'FREE',
      source: 'ADMIN_OVERRIDE',
      autoRenew: false,
      metadata: { reason: 'test_admin_assignment' },
    });

    const response = await agent.get('/dashboard/profile/subscription');
    expect(response.status).toBe(200);
    expect(response.body.activePlanCode).toBe('FREE');
    expect(response.body.activeSubscription).toMatchObject({
      planCode: 'FREE', source: 'ADMIN_OVERRIDE', status: 'ACTIVE',
    });
  });

  it('keeps historical payment intents while rejecting self-service checkout', async () => {
    const { agent, userId } = await register('subscription-checkout-disabled@example.com');
    const plan = await prisma.subscriptionPlan.findUniqueOrThrow({ where: { code: 'ADVANCED' } });
    await prisma.paymentIntent.create({
      data: {
        userId,
        subscriptionPlanId: plan.id,
        provider: 'MANUAL',
        status: 'CANCELED',
        amountMinor: plan.monthlyPriceMinor,
        currency: plan.currency,
      },
    });

    const response = await agent.post('/dashboard/profile/subscription/checkout-intents').send({
      planCode: 'ADVANCED',
    });
    expect(response.status).toBe(404);
    expect(await prisma.paymentIntent.count({ where: { userId } })).toBe(1);
    expect(await prisma.userSubscription.count({ where: { userId } })).toBe(0);
  });

  it('requires authentication to read the subscription profile', async () => {
    const response = await request(app).get('/dashboard/profile/subscription');
    expect(response.status).toBe(401);
  });
});
