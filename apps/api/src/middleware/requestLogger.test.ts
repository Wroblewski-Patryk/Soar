import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { app } from '../index';
import { requestLogger } from './requestLogger';

type RequestLog = { module: string; event: string; method: string; path: string; statusCode: number };

describe('requestLogger emitted URL boundary', () => {
  it('never emits client URL text for unknown paths or queries, including nested and malformed encoding', async () => {
    const synthetic = `soar_ext_${'q'.repeat(43)}`;
    const once = `%73${synthetic.slice(1)}`;
    const twice = `%2573${synthetic.slice(1)}`;
    const thrice = `%252573${synthetic.slice(1)}`;
    const paths = [
      `/other/${synthetic}`,
      `/other/${once}`,
      `/other/${twice}`,
      `/other/${thrice}`,
      `/other/%ZZ${once}`,
      `/other?plain=${synthetic}`,
      `/other?plain=${twice}`,
      `/other?plain=%ZZ${once}`,
      `/other?${twice}=value`,
      '/health?symbol=BTCUSDT',
    ];
    const originalNodeEnv = process.env.NODE_ENV;
    const emitted = vi.spyOn(console, 'log').mockImplementation(() => {});
    try {
      process.env.NODE_ENV = 'development';
      const statuses: number[] = [];
      for (const path of paths) statuses.push((await request(app).get(path)).status);
      const dynamic = express();
      dynamic.use(requestLogger);
      dynamic.get('/items/:id', (_req, res) => res.sendStatus(200));
      const dynamicStatus = await request(dynamic).get(`/items/${thrice}?plain=${twice}`);
      const logs = emitted.mock.calls.flatMap(([line]) => {
        try {
          const parsed = JSON.parse(String(line)) as RequestLog;
          return parsed.module === 'http.request' && parsed.event === 'http_request' ? [parsed] : [];
        } catch { return []; }
      });
      expect(logs).toHaveLength(paths.length + 1);
      expect(statuses.slice(0, -1).every((status) => status >= 400)).toBe(true);
      expect(statuses.at(-1)).toBe(200);
      expect(dynamicStatus.status).toBe(200);
      expect(logs.map(({ path }) => path)).toEqual([
        ...Array(paths.length - 1).fill('[UNMATCHED]'), '/health', '/items/:id',
      ]);
      expect(JSON.stringify(logs).includes(synthetic)).toBe(false);
      expect(logs.some(({ path }) => {
        try { return decodeURIComponent(path).includes(synthetic); } catch { return false; }
      })).toBe(false);
    } finally {
      if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = originalNodeEnv;
      emitted.mockRestore();
    }
  });
});
