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

  it('returns a safe in-flight code and leaves the shared pause state unchanged', async () => {
    expect(decodeURIComponent(new URL(process.env.DATABASE_URL ?? '').pathname).endsWith('_test')).toBe(true);
    const admin = await createAgent('ADMIN');
    const original = await prisma.liveExecutionControl.findUniqueOrThrow({ where: { id: 'global' } });
    await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT 1 AS locked FROM (SELECT pg_advisory_xact_lock(1701300739)) AS acquired`;
      await tx.liveExecutionControl.update({ where: { id: 'global' }, data: { paused: false } });
    });
    let markerId: string | null = null;
    const clientOrderId = `private-test-client-order-${Date.now()}`;
    try {
      const marker = await prisma.liveCreateOrderSubmission.create({ data: {
        exchangeId: 'test-venue', clientOrderId, symbol: 'BTCUSDT',
        marketType: 'future', reduceOnly: false,
      } });
      markerId = marker.id;
      const before = await admin.get('/admin/live-execution');
      expect(before.status).toBe(200);
      expect(before.body).toMatchObject({ available: true, paused: false, version: original.version });

      const denied = await admin.put('/admin/live-execution').send({
        paused: true, reason: 'test in-flight refusal remains active', expectedVersion: before.body.version,
      });
      expect(denied.status).toBe(503);
      expect(denied.body).toMatchObject({ error: { details: { code: 'LIVE_PAUSE_SUBMISSION_IN_FLIGHT' } } });
      expect(JSON.stringify(denied.body)).not.toContain(clientOrderId);
      expect(JSON.stringify(denied.body)).not.toContain(marker.id);

      const after = await admin.get('/admin/live-execution');
      expect(after.status).toBe(200);
      expect(after.body).toMatchObject({ available: true, paused: false, version: before.body.version });
    } finally {
      try {
        if (markerId) await prisma.liveCreateOrderSubmission.delete({ where: { id: markerId } });
      } finally {
        await prisma.$transaction(async (tx) => {
          await tx.$queryRaw`SELECT 1 AS locked FROM (SELECT pg_advisory_xact_lock(1701300739)) AS acquired`;
          await tx.liveExecutionControl.update({ where: { id: 'global' }, data: {
            paused: original.paused, reason: original.reason, version: original.version,
            changedAt: original.changedAt, changedByUserId: original.changedByUserId,
          } });
        });
      }
    }
  });
});
