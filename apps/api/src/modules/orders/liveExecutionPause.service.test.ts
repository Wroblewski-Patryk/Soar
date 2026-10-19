import { PrismaClient } from '@prisma/client';
import { spawn } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  readLiveExecutionPause, setLiveExecutionPause, withLiveCreateOrderPermit,
} from './liveExecutionPause.service';

const assertTestDatabase = () => {
  const url = new URL(process.env.DATABASE_URL ?? '');
  if (!decodeURIComponent(url.pathname).endsWith('_test')) {
    throw new Error('LIVE pause integration test requires an isolated _test database');
  }
};

describe('shared LIVE submission pause', () => {
  const workerA = new PrismaClient();
  const workerB = new PrismaClient();
  let actorId = '';
  let original: Awaited<ReturnType<typeof workerA.liveExecutionControl.findUnique>>;

  beforeAll(async () => {
    assertTestDatabase();
    await Promise.all([workerA.$connect(), workerB.$connect()]);
    original = await workerA.liveExecutionControl.findUnique({ where: { id: 'global' } });
    expect(original).not.toBeNull();
    const actor = await workerA.user.create({ data: {
      email: `live-pause-test-${Date.now()}@example.com`, password: 'test-only', role: 'ADMIN',
    } });
    actorId = actor.id;
  });

  afterAll(async () => {
    if (original) {
      await workerA.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT 1 AS locked FROM (SELECT pg_advisory_xact_lock(1701300739)) AS acquired`;
        await tx.liveExecutionControl.update({ where: { id: 'global' }, data: {
          paused: original!.paused, reason: original!.reason, version: original!.version,
          changedAt: original!.changedAt, changedByUserId: original!.changedByUserId,
        } });
      });
    }
    if (actorId) {
      await workerA.log.deleteMany({ where: { userId: actorId } });
      await workerA.user.delete({ where: { id: actorId } });
    }
    await Promise.all([workerA.$disconnect(), workerB.$disconnect()]);
  });

  it('applies to two workers, survives a fresh reader, and refuses pause during in-flight submission', async () => {
    let state = await readLiveExecutionPause(workerA);
    if (state.paused) {
      state = await setLiveExecutionPause({ actorUserId: actorId, paused: false,
        reason: 'integration test active state', expectedVersion: state.version! }, workerA);
    }

    const sent = await Promise.all([
      withLiveCreateOrderPermit({ marketType: 'swap', reduceOnly: false }, async () => 'worker-a', workerA),
      withLiveCreateOrderPermit({ marketType: 'future', reduceOnly: false }, async () => 'worker-b', workerB),
    ]);
    expect(sent).toEqual(['worker-a', 'worker-b']);

    let release!: () => void;
    let started!: () => void;
    const insideSubmit = new Promise<void>((resolve) => { started = resolve; });
    const holdSubmission = new Promise<void>((resolve) => { release = resolve; });
    const inFlight = withLiveCreateOrderPermit({ marketType: 'swap', reduceOnly: false }, async () => {
      started();
      await holdSubmission;
      return 'in-flight-before-pause';
    }, workerA);
    await insideSubmit;

    await expect(setLiveExecutionPause({ actorUserId: actorId, paused: true,
      reason: 'integration test pause race', expectedVersion: state.version! }, workerB))
      .rejects.toMatchObject({ code: 'LIVE_PAUSE_SUBMISSION_IN_FLIGHT' });
    release();
    expect(await inFlight).toBe('in-flight-before-pause');
    const paused = await setLiveExecutionPause({ actorUserId: actorId, paused: true,
      reason: 'integration test pause race', expectedVersion: state.version! }, workerB);
    expect(paused.paused).toBe(true);
    expect(paused.version).toBe(state.version! + 1);
    await expect(setLiveExecutionPause({ actorUserId: actorId, paused: false,
      reason: 'stale operator decision rejected', expectedVersion: state.version! }, workerA))
      .rejects.toMatchObject({ code: 'LIVE_PAUSE_VERSION_CONFLICT' });

    await expect(withLiveCreateOrderPermit({ marketType: 'swap', reduceOnly: false },
      async () => 'must-not-send', workerA)).rejects.toMatchObject({ code: 'LIVE_PRETRADE_PAUSED' });
    await expect(withLiveCreateOrderPermit({ marketType: 'spot', reduceOnly: false },
      async () => 'must-not-send', workerB)).rejects.toMatchObject({ code: 'LIVE_PRETRADE_PAUSED' });
    expect(await withLiveCreateOrderPermit({ marketType: 'swap', reduceOnly: true },
      async () => 'reduce-only', workerB)).toBe('reduce-only');

    const restartedReader = new PrismaClient();
    try {
      expect(await readLiveExecutionPause(restartedReader)).toMatchObject({
        available: true, paused: true, version: paused.version,
      });
    } finally {
      await restartedReader.$disconnect();
    }
    expect(await workerA.log.findFirst({ where: { userId: actorId, action: 'LIVE_PAUSED' },
      select: { metadata: true } })).toMatchObject({
      metadata: { reason: 'integration test pause race', nextVersion: paused.version },
    });
  });

  it.each([['binance', false], ['gateio', true]] as const)(
    'keeps %s connector createOrder protected after admission transaction timeout, across processes',
    async (exchangeId, rejectAfterRelease) => {
      let state = await readLiveExecutionPause(workerA);
      if (state.paused) {
        state = await setLiveExecutionPause({ actorUserId: actorId, paused: false,
          reason: 'cross-process slow submit setup', expectedVersion: state.version! }, workerA);
      }
      const script = `
        const { CcxtFuturesConnector } = require('./src/modules/exchange/ccxtFuturesConnector.service.ts');
        const { prisma } = require('./src/prisma/client.ts');
        void (async () => {
          const client = {
            loadMarkets: async () => ({}),
            createOrder: async (symbol, type, side, amount, price, params) => {
              process.stdout.write('STARTED\\n');
              await new Promise((resolve) => {
                process.once('message', (value) => {
                  if (value === 'RELEASE') { process.disconnect?.(); resolve(); }
                });
              });
              if (${rejectAfterRelease}) throw new Error('mock venue timeout');
              return { id: 'mock-order', symbol, type, side, amount, price, status: 'open' };
            },
          };
          const connector = new CcxtFuturesConnector(
            { exchangeId: ${JSON.stringify(exchangeId)}, marketType: 'swap' },
            async () => client,
          );
          try {
            try {
              const order = await connector.placeOrder({ symbol: 'BTCUSDT', side: 'buy',
                type: 'market', amount: 0.1, clientOrderId: 'pause-test-${exchangeId}' });
              process.stdout.write('DONE:' + order.id + '\\n');
            } catch (error) { process.stdout.write('ERROR:' + error.message + '\\n'); }
          } finally { await prisma.$disconnect(); }
        })().catch((error) => { process.stderr.write(String(error)); process.exitCode = 1; });
      `;
      const child = spawn(process.execPath, ['--import', 'tsx', '-e', script], {
        cwd: process.cwd(), env: process.env, windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
      });
      let output = '';
      let errors = '';
      child.stdout!.on('data', (chunk) => { output += chunk.toString(); });
      child.stderr!.on('data', (chunk) => { errors += chunk.toString(); });
      try {
        for (let attempt = 0; attempt < 100 && !output.includes('STARTED'); attempt += 1) {
          if (child.exitCode !== null) throw new Error(errors || 'Connector child exited');
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        expect(output, errors).toContain('STARTED');
        expect(await workerA.liveCreateOrderSubmission.findFirst({ where: {
          exchangeId, clientOrderId: `pause-test-${exchangeId}`,
        } })).toMatchObject({ marketType: 'swap', reduceOnly: false, symbol: 'BTCUSDT' });
        await new Promise((resolve) => setTimeout(resolve, 2_200));
        await expect(setLiveExecutionPause({ actorUserId: actorId, paused: true,
          reason: 'slow connector submit must not confirm pause', expectedVersion: state.version! }, workerB))
          .rejects.toMatchObject({ code: 'LIVE_PAUSE_SUBMISSION_IN_FLIGHT' });
        expect((await readLiveExecutionPause(workerB)).paused).toBe(false);
        child.send('RELEASE');
        const code = await new Promise<number | null>((resolve) => child.on('close', resolve));
        expect(code, errors).toBe(0);
        expect(output).toContain(rejectAfterRelease ? 'ERROR:mock venue timeout' : 'DONE:mock-order');
        const paused = await setLiveExecutionPause({ actorUserId: actorId, paused: true,
          reason: 'completed connector submit permits pause', expectedVersion: state.version! }, workerB);
        expect(paused.paused).toBe(true);
      } finally {
        if (child.exitCode === null) child.kill();
      }
    }, 15_000,
  );

  it('fails closed on a surviving submission row until explicit reconciliation clears it', async () => {
    let state = await readLiveExecutionPause(workerA);
    if (state.paused) {
      state = await setLiveExecutionPause({ actorUserId: actorId, paused: false,
        reason: 'surviving marker test setup', expectedVersion: state.version! }, workerA);
    }
    const marker = await workerA.liveCreateOrderSubmission.create({ data: {
      exchangeId: 'binanceusdm', clientOrderId: 'orphan-test-id',
      symbol: 'BTCUSDT', marketType: 'future', reduceOnly: false,
    } });
    try {
      await expect(setLiveExecutionPause({ actorUserId: actorId, paused: true,
        reason: 'surviving marker must deny pause', expectedVersion: state.version! }, workerB))
        .rejects.toMatchObject({ code: 'LIVE_PAUSE_SUBMISSION_IN_FLIGHT' });
      expect((await readLiveExecutionPause(workerA)).version).toBe(state.version);
    } finally {
      await workerA.liveCreateOrderSubmission.delete({ where: { id: marker.id } });
    }
    expect((await setLiveExecutionPause({ actorUserId: actorId, paused: true,
      reason: 'surviving marker reconciled in test', expectedVersion: state.version! }, workerB)).paused)
      .toBe(true);
  });

  it('fails closed before submission when the control row or database is unavailable', async () => {
    const submit = vi.fn(async () => 'must-not-send');
    const missingRowDb = {
      $transaction: async (callback: (tx: unknown) => Promise<unknown>) => callback({
        $queryRaw: async () => [{ locked: 1 }],
        liveExecutionControl: { findUnique: async () => null },
      }),
    } as unknown as PrismaClient;
    await expect(withLiveCreateOrderPermit({ marketType: 'future', reduceOnly: true },
      submit, missingRowDb)).rejects.toMatchObject({ code: 'LIVE_PRETRADE_PAUSE_UNAVAILABLE' });
    const disconnectedDb = {
      $transaction: async () => { throw new Error('connection unavailable'); },
    } as unknown as PrismaClient;
    await expect(withLiveCreateOrderPermit({ marketType: 'swap', reduceOnly: false },
      submit, disconnectedDb)).rejects.toMatchObject({ code: 'LIVE_PRETRADE_PAUSE_UNAVAILABLE' });
    expect(submit).not.toHaveBeenCalled();
  });

  it('shares the persisted pause gate with an independent OS process', async () => {
    let state = await readLiveExecutionPause(workerA);
    if (!state.paused) {
      state = await setLiveExecutionPause({ actorUserId: actorId, paused: true,
        reason: 'cross-process integration pause', expectedVersion: state.version! }, workerA);
    }
    const script = `
      const { PrismaClient } = require('@prisma/client');
      const { readLiveExecutionPause, withLiveCreateOrderPermit } =
        require('./src/modules/orders/liveExecutionPause.service.ts');
      void (async () => {
        const db = new PrismaClient();
        try {
          const status = await readLiveExecutionPause(db);
          let deniedCode = null;
          try {
            await withLiveCreateOrderPermit({ marketType: 'swap', reduceOnly: false },
              async () => 'unexpected-entry', db);
          } catch (error) { deniedCode = error.code; }
          const reduceOnly = await withLiveCreateOrderPermit(
            { marketType: 'swap', reduceOnly: true }, async () => 'allowed-close', db);
          process.stdout.write(JSON.stringify({ paused: status.paused, version: status.version,
            deniedCode, reduceOnly }));
        } finally { await db.$disconnect(); }
      })().catch((error) => { process.stderr.write(String(error)); process.exitCode = 1; });
    `;
    const child = spawn(process.execPath, ['--import', 'tsx', '-e', script], {
      cwd: process.cwd(), env: process.env, windowsHide: true,
    });
    let output = '';
    let errors = '';
    child.stdout.on('data', (chunk) => { output += chunk.toString(); });
    child.stderr.on('data', (chunk) => { errors += chunk.toString(); });
    const code = await new Promise<number | null>((resolve) => child.on('close', resolve));
    expect(code, errors).toBe(0);
    expect(JSON.parse(output)).toEqual({ paused: true, version: state.version,
      deniedCode: 'LIVE_PRETRADE_PAUSED', reduceOnly: 'allowed-close' });
  });
});
