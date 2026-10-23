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

const safeChildDiagnostic = (output: string, errors: string, exitCode: number | null) => {
  const protocol = output.includes('ERROR:GATE_FUTURES_FILL_CONTRACT_UNIT_UNVERIFIED')
    ? 'ERROR:GATE_FUTURES_FILL_CONTRACT_UNIT_UNVERIFIED'
    : output.includes('ERROR:mock venue timeout') ? 'ERROR:mock venue timeout'
    : output.includes('DONE:mock-order') ? 'DONE:mock-order'
    : output.includes('STARTED') ? 'STARTED'
    : output ? '<unrecognized output>' : '<empty>';
  return `Connector child exited (code ${exitCode ?? 'pending'}; stdout=${protocol}; stderr=${errors ? '<non-empty>' : '<empty>'})`;
};

const assertPauseChildSnapshot = (output: string, errors: string, exitCode: number | null,
  expected: { paused: boolean; version: number | null; deniedCode: string; reduceOnly: string }) => {
  let value: unknown;
  try { value = JSON.parse(output); }
  catch { throw new Error(`Connector child returned invalid JSON; ${safeChildDiagnostic(output, errors, exitCode)}`); }
  const snapshot = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
  const matches = snapshot !== null && Object.keys(snapshot).length === 4 &&
    snapshot.paused === expected.paused && snapshot.version === expected.version &&
    snapshot.deniedCode === expected.deniedCode && snapshot.reduceOnly === expected.reduceOnly;
  expect(matches, safeChildDiagnostic(output, errors, exitCode)).toBe(true);
};

describe('connector child diagnostics', () => {
  it('keeps a fictitious secret out of timeout and exit assertion failures', () => {
    const secret = 'TEST_ONLY_FAKE_SECRET_001B';
    const output = `ERROR:${secret}\nERROR:GATE_FUTURES_FILL_CONTRACT_UNIT_UNVERIFIED\n`;
    const diagnostic = safeChildDiagnostic(output, `stderr: ${secret}`, 7);
    expect(diagnostic).toContain('GATE_FUTURES_FILL_CONTRACT_UNIT_UNVERIFIED');
    expect(diagnostic).toContain('code 7');
    expect(diagnostic).toContain('stderr=<non-empty>');
    for (const assertion of [
      () => expect(output.includes('STARTED'), diagnostic).toBe(true),
      () => expect(7, diagnostic).toBe(0),
    ]) {
      let failure = '';
      try { assertion(); } catch (error) { failure = String(error); }
      expect(failure).toContain('Connector child exited');
      expect(failure).not.toContain(secret);
    }
  });

  it('redacts malformed JSON and an extra secret field from pause child failures', () => {
    const secret = 'TEST_ONLY_FAKE_SECRET_JSON_001B';
    const expected = { paused: true, version: 7, deniedCode: 'LIVE_PRETRADE_PAUSED',
      reduceOnly: 'allowed-close' };
    const outputs = [
      `{"paused":${secret}}`,
      JSON.stringify({ ...expected, [secret]: secret }),
    ];
    for (const output of outputs) {
      let failure = '';
      try { assertPauseChildSnapshot(output, `stderr: ${secret}`, 0, expected); }
      catch (error) { failure = String(error); }
      expect(failure).toContain('Connector child');
      expect(failure).toContain('stderr=<non-empty>');
      expect(failure).not.toContain(secret);
    }
  });
});

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
          const gateMarket = ${JSON.stringify(exchangeId)} === 'gateio' ? {
            id: 'BTC_USDT', symbol: 'BTC/USDT:USDT', type: 'swap', swap: true,
            contract: true, linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
            contractSize: 1,
            info: { name: 'BTC_USDT', type: 'direct', quanto_multiplier: '1' },
          } : null;
          const client = {
            loadMarkets: async () => gateMarket ? { [gateMarket.symbol]: gateMarket } : {},
            market: (symbol) => symbol === gateMarket?.symbol ? gateMarket : undefined,
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
          if (child.exitCode !== null) {
            throw new Error(safeChildDiagnostic(output, errors, child.exitCode));
          }
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        expect(output.includes('STARTED'), safeChildDiagnostic(output, errors, child.exitCode)).toBe(true);
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
        expect(code, safeChildDiagnostic(output, errors, code)).toBe(0);
        expect(output.includes(rejectAfterRelease ? 'ERROR:mock venue timeout' : 'DONE:mock-order'),
          safeChildDiagnostic(output, errors, code)).toBe(true);
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
    expect(code, safeChildDiagnostic(output, errors, code)).toBe(0);
    assertPauseChildSnapshot(output, errors, code, { paused: true, version: state.version,
      deniedCode: 'LIVE_PRETRADE_PAUSED', reduceOnly: 'allowed-close' });
  });
});
