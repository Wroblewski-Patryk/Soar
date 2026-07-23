import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { app } from '../index';

const originalSourceCommit = process.env.SOURCE_COMMIT;

afterEach(() => {
  if (originalSourceCommit === undefined) delete process.env.SOURCE_COMMIT;
  else process.env.SOURCE_COMMIT = originalSourceCommit;
});

describe('API release identity', () => {
  it('exposes the exact image-baked commit on the public health endpoint', async () => {
    process.env.SOURCE_COMMIT = 'abcdef0123456789abcdef0123456789abcdef01';

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.release).toEqual({
      gitSha: 'abcdef0123456789abcdef0123456789abcdef01',
      source: 'image-build',
    });
  });

  it('reports unavailable instead of accepting an abbreviated commit', async () => {
    process.env.SOURCE_COMMIT = 'abcdef0';

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.release).toEqual({ gitSha: null, source: 'unavailable' });
  });
});
