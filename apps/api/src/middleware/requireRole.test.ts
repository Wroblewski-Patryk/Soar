import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { requireRole } from './requireRole';

const buildApp = (role: 'ADMIN' | 'USER' | null) => {
  const app = express();
  app.use((req, _res, next) => {
    if (role) {
      req.user = {
        id: 'test-user',
        email: 'test@example.com',
        role,
      };
    }
    next();
  });
  app.get('/ops-probe', requireRole('ADMIN'), (_req, res) => {
    res.status(200).json({ ok: true });
  });
  return app;
};

describe('requireRole', () => {
  it('allows admin principal', async () => {
    const app = buildApp('ADMIN');
    const res = await request(app).get('/ops-probe');
    expect(res.status).toBe(200);
  });

  it('rejects non-admin principal', async () => {
    const app = buildApp('USER');
    const res = await request(app).get('/ops-probe');
    expect(res.status).toBe(403);
  });

  it('rejects missing principal', async () => {
    const app = buildApp(null);
    const res = await request(app).get('/ops-probe');
    expect(res.status).toBe(403);
  });
});
