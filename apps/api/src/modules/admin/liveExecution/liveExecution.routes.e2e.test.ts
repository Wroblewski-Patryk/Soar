import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../../index';
import { prisma } from '../../../prisma/client';

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
  });
});
