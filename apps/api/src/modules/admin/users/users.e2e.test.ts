import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../../index';
import { prisma } from '../../../prisma/client';
import { ensureSubscriptionCatalog } from '../../subscriptions/subscriptions.service';
import { signAuthToken } from '../../auth/auth.jwt';

const createAgent = async (role: 'USER' | 'ADMIN' = 'USER') => {
  const email = `admin-users-${role.toLowerCase()}-${Date.now()}-${Math.random()}@example.com`;
  const password = 'AdminUsers12#$';
  const agent = request.agent(app);

  const registerRes = await agent.post('/auth/register').send({ email, password });
  expect(registerRes.status).toBe(201);

  if (role === 'ADMIN') {
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
  }

  const loginRes = await agent.post('/auth/login').send({ email, password });
  expect(loginRes.status).toBe(200);

  const meRes = await agent.get('/auth/me');
  expect(meRes.status).toBe(200);

  return {
    agent,
    user: {
      id: meRes.body.id as string,
      email: meRes.body.email as string,
    },
  };
};

describe('Admin users API', () => {
  beforeEach(async () => {
    await ensureSubscriptionCatalog(prisma, { seedDefaults: true });
  });

  it('rejects unauthenticated access', async () => {
    const response = await request(app).get('/admin/users');
    expect(response.status).toBe(401);
  });

  it('rejects non-admin access', async () => {
    const regular = await createAgent('USER');
    const response = await regular.agent.get('/admin/users');
    expect(response.status).toBe(403);
  });

  it('lists users for admin with active subscription metadata', async () => {
    const admin = await createAgent('ADMIN');
    const regular = await createAgent('USER');

    const response = await admin.agent.get('/admin/users').query({
      search: regular.user.email,
      page: 1,
      pageSize: 10,
    });

    expect(response.status).toBe(200);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.pageSize).toBe(10);
    expect(response.body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: regular.user.id,
          email: regular.user.email,
          role: 'USER',
          activeSubscription: null,
        }),
      ]),
    );
  });

  it('updates user role and subscription plan', async () => {
    const admin = await createAgent('ADMIN');
    const regular = await createAgent('USER');

    const promoteRes = await admin.agent.patch(`/admin/users/${regular.user.id}`).send({
      role: 'ADMIN',
    });
    expect(promoteRes.status).toBe(200);
    expect(promoteRes.body.role).toBe('ADMIN');
    const roleAudit = await prisma.log.findFirstOrThrow({
      where: { userId: regular.user.id, action: 'admin.user.role_changed' },
    });
    expect(roleAudit.actor).toBe(admin.user.id);
    expect(roleAudit.metadata).toMatchObject({ fromRole: 'USER', toRole: 'ADMIN' });

    const assignPlanRes = await admin.agent.patch(`/admin/users/${regular.user.id}`).send({
      subscriptionPlanCode: 'ADVANCED',
    });
    expect(assignPlanRes.status).toBe(200);
    expect(assignPlanRes.body.activeSubscription.planCode).toBe('ADVANCED');
    expect(assignPlanRes.body.activeSubscription.source).toBe('ADMIN_OVERRIDE');
    const planAudit = await prisma.log.findFirstOrThrow({
      where: { userId: regular.user.id, action: 'admin.user.plan_assigned' },
    });
    expect(planAudit.actor).toBe(admin.user.id);
    expect(planAudit.metadata).toMatchObject({
      fromPlanCode: null,
      toPlanCode: 'ADVANCED',
      toSource: 'ADMIN_OVERRIDE',
    });
  });

  it('rejects role and plan writes from a regular user and a relocated legacy admin token', async () => {
    const admin = await createAgent('ADMIN');
    const regular = await createAgent('USER');
    const target = await createAgent('USER');

    const userWrite = await regular.agent.patch(`/admin/users/${target.user.id}`).send({
      subscriptionPlanCode: 'ADVANCED',
    });
    expect(userWrite.status).toBe(403);

    const adminRow = await prisma.user.findUniqueOrThrow({
      where: { id: admin.user.id },
      select: { sessionVersion: true },
    });
    const token = signAuthToken({
      userId: admin.user.id,
      email: admin.user.email,
      role: 'ADMIN',
      sessionVersion: adminRow.sessionVersion,
    }, '1h');
    for (const payload of [{ role: 'ADMIN' }, { subscriptionPlanCode: 'ADVANCED' }]) {
      const externalWrite = await request(app)
        .patch(`/admin/users/${target.user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload);
      expect(externalWrite.status).toBe(403);
      const relocatedWrite = await request(app)
        .patch(`/admin/users/${target.user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', [`token=${token}`])
        .send(payload);
      expect(relocatedWrite.status).toBe(403);
      const legacyCookieWrite = await request(app)
        .patch(`/admin/users/${target.user.id}`)
        .set('Cookie', [`token=${token}`])
        .send(payload);
      expect(legacyCookieWrite.status).toBe(401);
    }
    const humanLogin = await request(app).post('/auth/login').send({
      email: admin.user.email, password: 'AdminUsers12#$',
    });
    expect(humanLogin.status).toBe(200);
    const humanCookie = humanLogin.headers['set-cookie']?.[0] ?? '';
    const humanToken = /^token=([^;]+)/.exec(humanCookie)?.[1];
    expect(humanToken).toBeTruthy();
    const mixedTransport = await request(app)
      .patch(`/admin/users/${target.user.id}`)
      .set('Authorization', `Bearer ${humanToken}`)
      .set('Cookie', [humanCookie])
      .send({ role: 'ADMIN' });
    expect(mixedTransport.status).toBe(403);
    expect(await prisma.userSubscription.count({ where: { userId: target.user.id } })).toBe(0);
    const targetAfter = await prisma.user.findUniqueOrThrow({ where: { id: target.user.id } });
    expect(targetAfter.role).toBe('USER');
  });

  it('rejects a cross-origin admin mutation under the current cookie CSRF guard', async () => {
    const admin = await createAgent('ADMIN');
    const target = await createAgent('USER');
    const response = await admin.agent
      .patch(`/admin/users/${target.user.id}`)
      .set('Origin', 'https://untrusted.example')
      .send({ role: 'ADMIN' });
    expect(response.status).toBe(403);
    expect((await prisma.user.findUniqueOrThrow({ where: { id: target.user.id } })).role).toBe('USER');
  });

  it('blocks self demotion', async () => {
    const admin = await createAgent('ADMIN');

    const response = await admin.agent.patch(`/admin/users/${admin.user.id}`).send({
      role: 'USER',
    });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe('You cannot demote your own admin account');
  });

  it('revokes stale admin sessions after role demotion', async () => {
    const actingAdmin = await createAgent('ADMIN');
    const demotedAdmin = await createAgent('ADMIN');

    const demoteRes = await actingAdmin.agent.patch(`/admin/users/${demotedAdmin.user.id}`).send({
      role: 'USER',
    });
    expect(demoteRes.status).toBe(200);
    expect(demoteRes.body.role).toBe('USER');

    const staleSessionRes = await demotedAdmin.agent.get('/admin/users');
    expect(staleSessionRes.status).toBe(401);
  });
});
