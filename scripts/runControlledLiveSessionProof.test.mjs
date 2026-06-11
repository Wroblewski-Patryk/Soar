import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { afterEach, describe, it, mock } from 'node:test';
import {
  assertNoOrderGuardActive,
  assertOptions,
  assertTargetBotSafe,
  buildBotActiveStatePayload,
  discoverTargetBot,
  fetchJson,
  hashId,
  listRunningSessions,
  main,
  printUsage,
  redactBot,
  resolveBuildInfo,
  runCollector,
  runSimultaneousRuntimeReadback,
  sleep,
  updateBotActiveState,
  waitForRunningSession,
} from './runControlledLiveSessionProof.mjs';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  mock.timers.reset();
});

const mockReadyDetails = (payload, { ok = true, status = 200 } = {}) => {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return {
      ok,
      status,
      statusText: ok ? 'OK' : 'Bad Request',
      text: async () => JSON.stringify(payload),
    };
  };
  return calls;
};

describe('assertNoOrderGuardActive', () => {
  it('accepts readiness only when all no-order guard flags are active', async () => {
    const calls = mockReadyDetails({
      runtimeSafety: {
        liveNoOrderGuard: {
          globalKillSwitch: true,
          emergencyStop: true,
          active: true,
        },
      },
    });

    const result = await assertNoOrderGuardActive(
      { baseUrl: 'https://api.example.test', timeoutMs: 1234 },
      { Authorization: 'Bearer test-token' }
    );

    assert.deepEqual(result, {
      globalKillSwitch: true,
      emergencyStop: true,
      active: true,
    });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.example.test/ready/details');
    assert.equal(calls[0].init.headers.Authorization, 'Bearer test-token');
    assert.equal(calls[0].init.signal.aborted, false);
  });

  it('fails closed when any required no-order guard flag is missing', async () => {
    mockReadyDetails({
      runtimeSafety: {
        liveNoOrderGuard: {
          globalKillSwitch: true,
          emergencyStop: true,
          active: false,
        },
      },
    });

    await assert.rejects(
      () => assertNoOrderGuardActive({ baseUrl: 'https://api.example.test', timeoutMs: 1000 }, {}),
      /LIVE no-order guard is not fully active/
    );
  });

  it('fails closed when readiness returns no no-order guard payload', async () => {
    mockReadyDetails({ runtimeSafety: {} });

    await assert.rejects(
      () => assertNoOrderGuardActive({ baseUrl: 'https://api.example.test', timeoutMs: 1000 }, {}),
      /LIVE no-order guard is not fully active/
    );
  });

  it('surfaces readiness HTTP failures without treating them as safe', async () => {
    mockReadyDetails({ message: 'not authorized' }, { ok: false, status: 401 });

    await assert.rejects(
      () => assertNoOrderGuardActive({ baseUrl: 'https://api.example.test', timeoutMs: 1000 }, {}),
      /GET https:\/\/api\.example\.test\/ready\/details failed with HTTP 401/
    );
  });
});

describe('controlled live proof safety helpers', () => {
  it('hashId returns stable short hashes and treats blank identifiers as absent', () => {
    assert.equal(hashId(' bot-123 '), '98ca7226c53f');
    assert.equal(hashId('bot-123'), hashId(' bot-123 '));
    assert.equal(hashId('BOT-123'), '6ac62dca7472');
    assert.equal(hashId(''), null);
    assert.equal(hashId('   '), null);
    assert.equal(hashId(null), null);
    assert.match(hashId('api-key-secret-value'), /^[a-f0-9]{12}$/);
  });

  it('redactBot exposes only hashed identifier fields and safe metadata', () => {
    const redacted = redactBot({
      id: 'live-bot-id',
      name: 'Sensitive LIVE Bot Name',
      mode: 'LIVE',
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      isActive: false,
      liveOptIn: true,
      manageExternalPositions: true,
      apiKeyId: 'api-key-id',
      walletId: 'wallet-id',
      strategyId: 'strategy-id',
    });

    assert.deepEqual(redacted, {
      idHash: hashId('live-bot-id'),
      nameHash: hashId('Sensitive LIVE Bot Name'),
      mode: 'LIVE',
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      isActive: false,
      liveOptIn: true,
      manageExternalPositions: true,
      apiKeyIdHash: hashId('api-key-id'),
    });
    assert.doesNotMatch(JSON.stringify(redacted), /live-bot-id|Sensitive LIVE Bot Name|api-key-id|wallet-id|strategy-id/);
  });

  it('redactBot preserves nullable safe fields without emitting raw optional identifiers', () => {
    const redacted = redactBot({
      id: '',
      name: null,
      mode: null,
      exchange: undefined,
      marketType: 'FUTURES',
      isActive: true,
      liveOptIn: false,
      manageExternalPositions: false,
      apiKeyId: '   ',
      walletId: 'raw-wallet-id',
      strategyId: 'raw-strategy-id',
      privateNote: 'operator-only-note',
    });

    assert.deepEqual(Object.keys(redacted).sort(), [
      'apiKeyIdHash',
      'exchange',
      'idHash',
      'isActive',
      'liveOptIn',
      'manageExternalPositions',
      'marketType',
      'mode',
      'nameHash',
    ]);
    assert.deepEqual(redacted, {
      idHash: null,
      nameHash: null,
      mode: null,
      exchange: null,
      marketType: 'FUTURES',
      isActive: true,
      liveOptIn: false,
      manageExternalPositions: false,
      apiKeyIdHash: null,
    });
    assert.doesNotMatch(
      JSON.stringify(redacted),
      /raw-wallet-id|raw-strategy-id|operator-only-note/
    );
  });

  it('fetchJson sends guarded JSON requests and parses successful JSON payloads', async () => {
    const calls = [];
    globalThis.fetch = async (url, init) => {
      calls.push({ url, init });
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({ accepted: true }),
      };
    };

    const result = await fetchJson('https://api.example.test/live-proof', {
      method: 'POST',
      headers: { Authorization: 'Bearer test-token' },
      body: { activate: false },
      timeoutMs: 1000,
    });

    assert.deepEqual(result, { accepted: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.example.test/live-proof');
    assert.equal(calls[0].init.method, 'POST');
    assert.equal(calls[0].init.headers.Accept, 'application/json');
    assert.equal(calls[0].init.headers['Cache-Control'], 'no-cache');
    assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
    assert.equal(calls[0].init.headers.Authorization, 'Bearer test-token');
    assert.equal(calls[0].init.body, JSON.stringify({ activate: false }));
    assert.equal(calls[0].init.signal.aborted, false);
  });

  it('fetchJson preserves a bounded raw payload for non-JSON HTTP failures without leaking headers', async () => {
    const longBody = 'x'.repeat(700);
    globalThis.fetch = async () => ({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
      text: async () => longBody,
    });

    await assert.rejects(
      () =>
        fetchJson('https://api.example.test/ready/details', {
          headers: { Authorization: 'Bearer secret-token' },
          timeoutMs: 1000,
        }),
      (error) => {
        assert.match(error.message, /GET https:\/\/api\.example\.test\/ready\/details failed with HTTP 502/);
        assert.match(error.message, /^.{1,620}$/);
        assert.doesNotMatch(error.message, /secret-token/);
        return true;
      }
    );
  });

  it('fetchJson aborts slow requests at the configured timeout', async () => {
    globalThis.fetch = async (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(new Error('request aborted')));
      });

    await assert.rejects(
      () => fetchJson('https://api.example.test/slow', { timeoutMs: 1 }),
      /request aborted/
    );
  });

  it('uses the explicit bot-id endpoint when a target override is provided', async () => {
    const calls = [];
    const targetBot = {
      id: 'bot-override',
      mode: 'LIVE',
      marketType: 'FUTURES',
    };
    globalThis.fetch = async (url, init) => {
      calls.push({ url, init });
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify(targetBot),
      };
    };

    const result = await discoverTargetBot(
      {
        baseUrl: 'https://api.example.test',
        botId: ' bot/one ',
        timeoutMs: 1000,
      },
      { Authorization: 'Bearer test-token' }
    );

    assert.deepEqual(result, targetBot);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.example.test/dashboard/bots/bot%2Fone');
    assert.equal(calls[0].init.headers.Authorization, 'Bearer test-token');
  });

  it('auto-selects exactly one LIVE Futures bot and fails closed on none or ambiguous targets', async () => {
    const liveBot = {
      id: 'live-bot',
      mode: 'LIVE',
      marketType: 'FUTURES',
    };
    const paperBot = {
      id: 'paper-bot',
      mode: 'PAPER',
      marketType: 'FUTURES',
    };
    const calls = [];
    globalThis.fetch = async (url, init) => {
      calls.push({ url, init });
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify([paperBot, liveBot]),
      };
    };

    const result = await discoverTargetBot(
      {
        baseUrl: 'https://api.example.test',
        botId: '',
        timeoutMs: 1000,
      },
      { Authorization: 'Bearer test-token' }
    );

    assert.deepEqual(result, liveBot);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.example.test/dashboard/bots?marketType=FUTURES');

    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => JSON.stringify([paperBot]),
    });
    await assert.rejects(
      () =>
        discoverTargetBot(
          {
            baseUrl: 'https://api.example.test',
            botId: '',
            timeoutMs: 1000,
          },
          {}
        ),
      /Expected exactly one LIVE Futures bot when --bot-id is omitted; found 0/
    );

    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => JSON.stringify([liveBot, { ...liveBot, id: 'second-live-bot' }]),
    });
    await assert.rejects(
      () =>
        discoverTargetBot(
          {
            baseUrl: 'https://api.example.test',
            botId: '',
            timeoutMs: 1000,
          },
          {}
        ),
      /Expected exactly one LIVE Futures bot when --bot-id is omitted; found 2/
    );
  });

  it('fails closed when bot discovery payload is not an array', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => JSON.stringify({ data: [] }),
    });

    await assert.rejects(
      () =>
        discoverTargetBot(
          {
            baseUrl: 'https://api.example.test',
            botId: '',
            timeoutMs: 1000,
          },
          {}
        ),
      /Expected \/dashboard\/bots to return an array/
    );
  });

  it('keeps option validation fail-closed for unsafe polling and empty symbols', () => {
    assert.throws(
      () =>
        assertOptions({
          baseUrl: 'https://api.example.test',
          webBaseUrl: 'https://web.example.test',
          symbols: [],
          pollSeconds: 180,
          pollIntervalMs: 5000,
        }),
      /At least one --symbols value is required/
    );
    assert.throws(
      () =>
        assertOptions({
          baseUrl: 'https://api.example.test',
          webBaseUrl: 'https://web.example.test',
          symbols: ['TRXUSDT'],
          pollSeconds: 4,
          pollIntervalMs: 5000,
        }),
      /--poll-seconds must be at least 5/
    );
  });

  it('requires a consented inactive LIVE Futures target bot before activation', () => {
    const safeBot = {
      id: 'bot-1',
      name: 'Controlled LIVE proof bot',
      mode: 'LIVE',
      marketType: 'FUTURES',
      isActive: false,
      liveOptIn: true,
      consentTextVersion: 'live-consent-v1',
      manageExternalPositions: true,
      walletId: 'wallet-1',
      strategyId: 'strategy-1',
    };

    assert.doesNotThrow(() => assertTargetBotSafe(safeBot));
    assert.deepEqual(buildBotActiveStatePayload(safeBot, true), {
      name: 'Controlled LIVE proof bot',
      walletId: 'wallet-1',
      strategyId: 'strategy-1',
      isActive: true,
      liveOptIn: true,
      manageExternalPositions: true,
      consentTextVersion: 'live-consent-v1',
    });
    assert.throws(() => assertTargetBotSafe({ ...safeBot, isActive: true }), /already active/);
    assert.throws(() => assertTargetBotSafe({ ...safeBot, liveOptIn: false }), /liveOptIn=true/);
  });
});

describe('listRunningSessions', () => {
  it('updates the target bot active state with the preserved live safety fields', async () => {
    const calls = [];
    const updatedBot = { id: 'bot/id one', isActive: true };
    const safeBot = {
      id: 'bot/id one',
      name: 'Controlled LIVE proof bot',
      walletId: 'wallet-1',
      strategyId: 'strategy-1',
      liveOptIn: true,
      manageExternalPositions: true,
      consentTextVersion: 'live-consent-v1',
    };

    globalThis.fetch = async (url, init) => {
      calls.push({ url, init });
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify(updatedBot),
      };
    };

    const result = await updateBotActiveState(
      { baseUrl: 'https://api.example.test', timeoutMs: 1200 },
      { Authorization: 'Bearer test-token' },
      safeBot,
      true
    );

    assert.deepEqual(result, updatedBot);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.example.test/dashboard/bots/bot%2Fid%20one');
    assert.equal(calls[0].init.method, 'PUT');
    assert.equal(calls[0].init.headers.Authorization, 'Bearer test-token');
    assert.deepEqual(JSON.parse(calls[0].init.body), {
      name: 'Controlled LIVE proof bot',
      walletId: 'wallet-1',
      strategyId: 'strategy-1',
      isActive: true,
      liveOptIn: true,
      manageExternalPositions: true,
      consentTextVersion: 'live-consent-v1',
    });
    assert.equal(calls[0].init.signal.aborted, false);
  });

  it('requests the bounded RUNNING runtime-session readback for the target bot', async () => {
    const calls = [];
    const sessions = [{ id: 'session-1', status: 'RUNNING' }];
    globalThis.fetch = async (url, init) => {
      calls.push({ url, init });
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify(sessions),
      };
    };

    const result = await listRunningSessions(
      { baseUrl: 'https://api.example.test', timeoutMs: 1200 },
      { Authorization: 'Bearer test-token' },
      'bot/id one'
    );

    assert.deepEqual(result, sessions);
    assert.equal(calls.length, 1);
    assert.equal(
      calls[0].url,
      'https://api.example.test/dashboard/bots/bot%2Fid%20one/runtime-sessions?status=RUNNING&limit=1'
    );
    assert.equal(calls[0].init.headers.Authorization, 'Bearer test-token');
    assert.equal(calls[0].init.signal.aborted, false);
  });

  it('fails closed when the running-session readback payload is not an array', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => JSON.stringify({ data: [] }),
    });

    await assert.rejects(
      () =>
        listRunningSessions(
          { baseUrl: 'https://api.example.test', timeoutMs: 1000 },
          {},
          'bot-1'
        ),
      /Expected runtime-sessions to return an array/
    );
  });

  it('returns the first RUNNING runtime session detected by the bounded readback', async () => {
    const calls = [];
    globalThis.fetch = async (url, init) => {
      calls.push({ url, init });
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify([{ id: 'session-1', status: 'RUNNING' }]),
      };
    };

    const result = await waitForRunningSession(
      {
        baseUrl: 'https://api.example.test',
        timeoutMs: 1200,
        pollSeconds: 30,
        pollIntervalMs: 250,
      },
      { Authorization: 'Bearer test-token' },
      'bot/id one'
    );

    assert.deepEqual(result, { id: 'session-1', status: 'RUNNING' });
    assert.equal(calls.length, 1);
    assert.equal(
      calls[0].url,
      'https://api.example.test/dashboard/bots/bot%2Fid%20one/runtime-sessions?status=RUNNING&limit=1'
    );
    assert.equal(calls[0].init.headers.Authorization, 'Bearer test-token');
    assert.equal(calls[0].init.signal.aborted, false);
  });
});

describe('sleep', () => {
  it('resolves only after the requested timeout elapses', async () => {
    mock.timers.enable({ apis: ['setTimeout'] });
    let resolved = false;

    const wait = sleep(250).then(() => {
      resolved = true;
    });

    await Promise.resolve();
    assert.equal(resolved, false);

    mock.timers.tick(249);
    await Promise.resolve();
    assert.equal(resolved, false);

    mock.timers.tick(1);
    await wait;
    assert.equal(resolved, true);
  });
});

describe('resolveBuildInfo', () => {
  it('reads public build-info and reports an expected SHA prefix match', async () => {
    const calls = [];
    globalThis.fetch = async (url, init) => {
      calls.push({ url, init });
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () =>
          JSON.stringify({
            gitSha: 'abc123def4567890',
            gitRef: 'main',
            buildId: 'non-secret-build-id',
          }),
      };
    };

    const result = await resolveBuildInfo({
      webBaseUrl: 'https://web.example.test',
      expectedSha: 'abc123',
      timeoutMs: 1200,
    });

    assert.deepEqual(result, {
      gitSha: 'abc123def4567890',
      gitRef: 'main',
      expectedSha: 'abc123',
      matchesExpected: true,
    });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://web.example.test/api/build-info');
    assert.equal(calls[0].init.method, 'GET');
    assert.equal(calls[0].init.headers.Accept, 'application/json');
    assert.equal(calls[0].init.headers['Cache-Control'], 'no-cache');
    assert.equal(calls[0].init.signal.aborted, false);
  });

  it('reports SHA mismatch without throwing or leaking unrelated build metadata', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () =>
        JSON.stringify({
          gitSha: 'def4567890abc123',
          gitRef: null,
          metadataSource: 'github-branch',
        }),
    });

    const result = await resolveBuildInfo({
      webBaseUrl: 'https://web.example.test',
      expectedSha: 'abc123',
      timeoutMs: 1000,
    });

    assert.deepEqual(result, {
      gitSha: 'def4567890abc123',
      gitRef: null,
      expectedSha: 'abc123',
      matchesExpected: false,
    });
    assert.deepEqual(Object.keys(result).sort(), [
      'expectedSha',
      'gitRef',
      'gitSha',
      'matchesExpected',
    ]);
  });
});

describe('runCollector', () => {
  it('spawns the LIVEIMPORT readback collector with bounded args and env-carried auth', async () => {
    const spawnCalls = [];
    const child = new EventEmitter();
    const run = runCollector(
      {
        baseUrl: 'https://api.example.test',
        webBaseUrl: 'https://web.example.test',
        symbols: ['ETHUSDT', 'DOGEUSDT'],
        expectedSha: 'abc123',
        output: 'history/artifacts/liveimport.json',
        opsBasicUser: 'ops-user',
        opsBasicPassword: 'ops-password',
        opsAuthHeaderName: 'x-ops-proof',
        opsAuthHeaderValue: 'ops-header-value',
      },
      'collector-token',
      'bot/id one',
      'session/id one',
      {
        execPath: 'node-test-bin',
        env: { KEEP_EXISTING: 'yes' },
        spawnImpl: (command, args, options) => {
          spawnCalls.push({ command, args, options });
          return child;
        },
      }
    );

    child.emit('exit', 0);
    await run;

    assert.equal(spawnCalls.length, 1);
    assert.equal(spawnCalls[0].command, 'node-test-bin');
    assert.deepEqual(spawnCalls[0].args, [
      'scripts/collectLiveImportReadbackEvidence.mjs',
      '--base-url',
      'https://api.example.test',
      '--web-base-url',
      'https://web.example.test',
      '--bot-id',
      'bot/id one',
      '--session-id',
      'session/id one',
      '--symbols',
      'ETHUSDT,DOGEUSDT',
      '--expected-sha',
      'abc123',
      '--output',
      'history/artifacts/liveimport.json',
    ]);
    assert.equal(spawnCalls[0].options.stdio, 'inherit');
    assert.equal(spawnCalls[0].options.env.KEEP_EXISTING, 'yes');
    assert.equal(spawnCalls[0].options.env.LIVEIMPORT_READBACK_AUTH_TOKEN, 'collector-token');
    assert.equal(spawnCalls[0].options.env.LIVEIMPORT_READBACK_OPS_BASIC_USER, 'ops-user');
    assert.equal(
      spawnCalls[0].options.env.LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD,
      'ops-password'
    );
    assert.equal(
      spawnCalls[0].options.env.LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME,
      'x-ops-proof'
    );
    assert.equal(
      spawnCalls[0].options.env.LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE,
      'ops-header-value'
    );
  });

  it('rejects when the LIVEIMPORT readback collector exits non-zero', async () => {
    const child = new EventEmitter();
    const run = runCollector(
      {
        baseUrl: 'https://api.example.test',
        webBaseUrl: 'https://web.example.test',
        symbols: ['ETHUSDT'],
        expectedSha: '',
        output: '',
        opsBasicUser: '',
        opsBasicPassword: '',
        opsAuthHeaderName: '',
        opsAuthHeaderValue: '',
      },
      'collector-token',
      'bot-1',
      'session-1',
      {
        execPath: 'node-test-bin',
        env: {},
        spawnImpl: () => child,
      }
    );

    child.emit('exit', 7);

    await assert.rejects(run, /LIVEIMPORT-03 collector exited with code 7/);
  });
});

describe('runSimultaneousRuntimeReadback', () => {
  it('skips the simultaneous readback collector when no output path is requested', async () => {
    let spawned = false;

    await runSimultaneousRuntimeReadback(
      {
        simultaneousReadbackOutputJson: '',
        simultaneousReadbackOutputMd: '   ',
      },
      'readback-token',
      {
        spawnImpl: () => {
          spawned = true;
          throw new Error('spawn should not run without an output path');
        },
      }
    );

    assert.equal(spawned, false);
  });

  it('spawns the non-Gate.io readback collector with bounded env-carried auth and artifact paths', async () => {
    const spawnCalls = [];
    const child = new EventEmitter();
    const run = runSimultaneousRuntimeReadback(
      {
        baseUrl: 'https://api.example.test',
        webBaseUrl: 'https://web.example.test',
        expectedSha: 'abc123',
        simultaneousReadbackOutputJson: 'history/artifacts/readback.json',
        simultaneousReadbackOutputMd: 'history/evidence/readback.md',
      },
      'readback-token',
      {
        execPath: 'node-test-bin',
        env: { KEEP_EXISTING: 'yes' },
        spawnImpl: (command, args, options) => {
          spawnCalls.push({ command, args, options });
          return child;
        },
      }
    );

    child.emit('exit', 0);
    await run;

    assert.equal(spawnCalls.length, 1);
    assert.equal(spawnCalls[0].command, 'node-test-bin');
    assert.deepEqual(spawnCalls[0].args, ['scripts/collectNonGateioRuntimeReadback.mjs']);
    assert.equal(spawnCalls[0].options.stdio, 'inherit');
    assert.equal(spawnCalls[0].options.env.KEEP_EXISTING, 'yes');
    assert.equal(
      spawnCalls[0].options.env.NON_GATEIO_READBACK_API_BASE_URL,
      'https://api.example.test'
    );
    assert.equal(
      spawnCalls[0].options.env.NON_GATEIO_READBACK_WEB_BASE_URL,
      'https://web.example.test'
    );
    assert.equal(spawnCalls[0].options.env.NON_GATEIO_READBACK_AUTH_TOKEN, 'readback-token');
    assert.equal(spawnCalls[0].options.env.NON_GATEIO_READBACK_EXPECTED_SHA, 'abc123');
    assert.equal(
      spawnCalls[0].options.env.NON_GATEIO_READBACK_OUTPUT_JSON,
      'history/artifacts/readback.json'
    );
    assert.equal(
      spawnCalls[0].options.env.NON_GATEIO_READBACK_OUTPUT_MD,
      'history/evidence/readback.md'
    );
  });

  it('rejects when the simultaneous readback collector exits non-zero', async () => {
    const child = new EventEmitter();
    const run = runSimultaneousRuntimeReadback(
      {
        baseUrl: 'https://api.example.test',
        webBaseUrl: 'https://web.example.test',
        expectedSha: '',
        simultaneousReadbackOutputJson: 'history/artifacts/readback.json',
        simultaneousReadbackOutputMd: '',
      },
      'readback-token',
      {
        execPath: 'node-test-bin',
        env: {},
        spawnImpl: () => child,
      }
    );

    child.emit('exit', 9);

    await assert.rejects(
      run,
      /Simultaneous PAPER\+LIVE runtime readback exited with code 9/
    );
  });
});

describe('printUsage', () => {
  it('renders controlled live proof usage, safety warning, and env hints to injected stdout', () => {
    let output = '';

    printUsage({ write: (chunk) => { output += chunk; } });

    assert.match(output, /Usage: node scripts\/runControlledLiveSessionProof\.mjs \[options\]/);
    assert.match(output, /guarded operator runner for a short LIVE runtime-session proof/);
    assert.match(output, /--i-understand-live-risk/);
    assert.match(output, /--dry-run/);
    assert.match(output, /CONTROLLED_LIVE_PROOF_AUTH_TOKEN/);
    assert.match(output, /CONTROLLED_LIVE_PROOF_SIMULTANEOUS_OUTPUT_JSON/);
    assert.match(output, /CONTROLLED_LIVE_PROOF_SIMULTANEOUS_OUTPUT_MD/);
    assert.equal(output.endsWith('\n'), true);
  });
});

describe('main', () => {
  it('prints usage for --help without resolving auth or touching the network', async () => {
    let output = '';
    let authResolved = false;
    globalThis.fetch = async () => {
      throw new Error('fetch should not be called for --help');
    };

    await main({
      argv: ['--help'],
      env: {},
      stdout: { write: (chunk) => { output += chunk; } },
      resolveOpsAuthTokenImpl: async () => {
        authResolved = true;
        return { token: 'unexpected' };
      },
    });

    assert.match(output, /Usage: node scripts\/runControlledLiveSessionProof\.mjs/);
    assert.equal(authResolved, false);
  });

  it('prints a redacted dry-run plan without auth, network, or LIVE activation', async () => {
    let output = '';
    let authResolved = false;
    globalThis.fetch = async () => {
      throw new Error('fetch should not be called for --dry-run');
    };

    await main({
      argv: [
        '--dry-run',
        '--base-url',
        'https://api.example.test/',
        '--web-base-url',
        'https://web.example.test/',
        '--bot-id',
        'live-bot-secret-id',
        '--symbols',
        'ethusdt, dogeusdt',
        '--expected-sha',
        'abc123',
        '--output',
        'history/artifacts/liveimport.json',
        '--simultaneous-readback-output-json',
        'history/artifacts/readback.json',
        '--simultaneous-readback-output-md',
        'history/evidence/readback.md',
        '--poll-seconds',
        '30',
        '--poll-interval-ms',
        '1000',
      ],
      env: {},
      stdout: { write: (chunk) => { output += chunk; } },
      resolveOpsAuthTokenImpl: async () => {
        authResolved = true;
        return { token: 'unexpected' };
      },
    });

    const plan = JSON.parse(output);
    assert.deepEqual(plan, {
      mode: 'dry-run',
      baseUrl: 'https://api.example.test',
      webBaseUrl: 'https://web.example.test',
      botIdProvided: true,
      symbols: ['ETHUSDT', 'DOGEUSDT'],
      expectedShaProvided: true,
      outputProvided: true,
      simultaneousReadbackOutputJsonProvided: true,
      simultaneousReadbackOutputMdProvided: true,
      pollSeconds: 30,
      pollIntervalMs: 1000,
      understandsLiveRisk: false,
      liveActivationWillRun: false,
    });
    assert.doesNotMatch(output, /live-bot-secret-id|abc123|history\/artifacts\/liveimport\.json/);
    assert.equal(authResolved, false);
  });
});
