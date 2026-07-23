import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../index';

describe('public service status endpoints', () => {
  it('returns the API root service banner', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('CryptoSparrow API is running');
  });

  it('returns API health without requiring database access', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok', service: 'api' });
    expect(typeof response.body.timestamp).toBe('string');
  });
});
