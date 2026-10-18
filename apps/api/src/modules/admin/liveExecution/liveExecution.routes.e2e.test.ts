import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../../index';
import { prisma } from '../../../prisma/client';
import { signAuthToken } from '../../auth/auth.jwt';

const createAgent = async (role: 'USER' | 'ADMIN') => {
  const email = `live-pause-${role.toLowerCase()}-${Date.now()}-${Math.random()}@example.com`;
  const password = 'LivePause12#$';
  const agent = request.agent(app);
  expect((await agent.post('/auth/register').send({ email, password })).status).toBe(201);
  if (role === 'ADMIN') {
    await prisma.user.update({ where: { email }, data: { role: 'ADMIN' } });
  }
  expect((await agent.post('/auth/login').send({ email, password })).status).toBe(200);
  return agent;
};

describe('admin LIVE pause API authority', () => {
  it('rejects anonymous and ordinary users and gives admins shared readback', async () => {
    expect((await request(app).get('/admin/live-execution')).status).toBe(401);
    expect((await request(app).put('/admin/live-execution').send({
      paused: true, reason: 'unauthorized request', expectedVersion: 1,
    })).status).toBe(401);

    const user = await createAgent('USER');
    expect((await user.get('/admin/live-execution')).status).toBe(403);
    expect((await user.put('/admin/live-execution').send({
      paused: true, reason: 'unauthorized request', expectedVersion: 1,
    })).status).toBe(403);

    const admin = await createAgent('ADMIN');
    const status = await admin.get('/admin/live-execution');
    expect(status.status).toBe(200);
    expect(status.body.available).toBe(true);
    expect(typeof status.body.paused).toBe('boolean');
    const invalid = await admin.put('/admin/live-execution').send({
      paused: false, reason: 'short', expectedVersion: status.body.version,
    });
    expect(invalid.status).toBe(400);

    const me = await admin.get('/auth/me');
    const adminRow = await prisma.user.findUniqueOrThrow({ where: { id: me.body.id as string } });
    const legacyToken = signAuthToken({
      userId: adminRow.id, email: adminRow.email,
      role: adminRow.role, sessionVersion: adminRow.sessionVersion,
    }, '1h');
    const external = await request(app).put('/admin/live-execution')
      .set('Authorization', `Bearer ${legacyToken}`)
      .set('Cookie', [`token=${legacyToken}`])
      .send({ paused: !status.body.paused, reason: 'external client must fail', expectedVersion: status.body.version });
    expect(external.status).toBe(403);
    const after = await admin.get('/admin/live-execution');
    expect(after.body.version).toBe(status.body.version);
  });
});
