import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const scriptUrl = pathToFileURL(path.resolve('scripts/runPublicReadOnlyBrowserProof.mjs'));

const importHarness = async (argv = []) => {
  const originalArgv = process.argv;
  const originalEnv = { ...process.env };
  const dir = await mkdtemp(path.join(os.tmpdir(), 'soar-public-browser-proof-'));
  const browserPath = path.join(dir, 'browser.exe');
  await writeFile(browserPath, '');

  process.argv = ['node', 'scripts/runPublicReadOnlyBrowserProof.test.mjs', ...argv, '--browser-path', browserPath];
  process.env.PUBLIC_BROWSER_PROOF_BROWSER_PATH = browserPath;
  process.env.PUBLIC_BROWSER_PROOF_WEB_BASE_URL = ' http://127.0.0.1:4321/// ';
  process.env.PUBLIC_BROWSER_PROOF_CDP_PORT = '9888';

  try {
    const module = await import(`${scriptUrl.href}?case=${Date.now()}-${Math.random()}`);
    return {
      module,
      browserPath,
      cleanup: async () => {
        process.argv = originalArgv;
        process.env = originalEnv;
        await rm(dir, { recursive: true, force: true });
      },
    };
  } catch (error) {
    process.argv = originalArgv;
    process.env = originalEnv;
    await rm(dir, { recursive: true, force: true });
    throw error;
  }
};

test('argument and option helpers normalize public browser proof inputs without running the CLI', async () => {
  const harness = await importHarness([
    '--issue',
    'LUC-2958',
    '--today',
    '2026-06-08',
    '--web-base-url',
    ' https://soar.example.test/// ',
    '--cdp-port',
    '9777',
    '--output-json',
    'history/artifacts/custom-public-proof.json',
    '--output-md',
    'history/evidence/custom-public-proof.md',
  ]);
  try {
    const { findBrowserPath, isLocalWebBaseUrl, normalizeBaseUrl, readArgValue, resolveOptions } = harness.module;

    assert.equal(readArgValue('--issue'), 'LUC-2958');
    assert.equal(readArgValue('--missing'), '');
    assert.equal(normalizeBaseUrl(' https://soar.local/// '), 'https://soar.local');
    assert.equal(isLocalWebBaseUrl('http://localhost:3000'), true);
    assert.equal(isLocalWebBaseUrl('https://127.0.0.1:4321'), true);
    assert.equal(isLocalWebBaseUrl('https://soar.example.test'), false);
    assert.equal(findBrowserPath(), harness.browserPath);

    assert.deepEqual(resolveOptions(), {
      webBaseUrl: 'https://soar.example.test',
      outputJson: 'history/artifacts/custom-public-proof.json',
      outputMd: 'history/evidence/custom-public-proof.md',
      browserPath: harness.browserPath,
      port: 9777,
      issue: 'LUC-2958',
      today: '2026-06-08',
    });
  } finally {
    await harness.cleanup();
  }
});

test('collectIssues and collectRouteIssues filter expected local unauthenticated browser noise', async () => {
  const harness = await importHarness();
  try {
    const { collectIssues, collectRouteIssues } = harness.module;
    const client = {
      events: [
        {
          method: 'Runtime.consoleAPICalled',
          params: { type: 'error', args: [{ value: 'Unhandled app error' }] },
        },
        {
          method: 'Runtime.consoleAPICalled',
          params: { type: 'warning', args: [{ description: 'favicon missing' }] },
        },
        {
          method: 'Log.entryAdded',
          params: {
            entry: {
              level: 'error',
              text: 'Request failed with status of 401',
              url: 'https://soar.example.test/auth/me',
            },
          },
        },
        {
          method: 'Network.loadingFailed',
          params: { errorText: 'net::ERR_ABORTED' },
        },
        {
          method: 'Network.loadingFailed',
          params: { errorText: 'net::ERR_CONNECTION_REFUSED' },
        },
        {
          method: 'Log.entryAdded',
          params: {
            entry: {
              level: 'error',
              text: 'net::ERR_CONNECTION_REFUSED',
              url: 'http://127.0.0.1:4321/auth/me',
            },
          },
        },
      ],
    };

    assert.deepEqual(collectIssues(client), [
      { method: 'Runtime.consoleAPICalled', level: 'error', text: 'Unhandled app error', url: '' },
      { method: 'Network.loadingFailed', level: 'error', text: 'net::ERR_CONNECTION_REFUSED', url: '' },
      {
        method: 'Log.entryAdded',
        level: 'error',
        text: 'net::ERR_CONNECTION_REFUSED',
        url: 'http://127.0.0.1:4321/auth/me',
      },
    ]);

    assert.deepEqual(collectRouteIssues(client, { webBaseUrl: 'http://127.0.0.1:4321' }), [
      { method: 'Runtime.consoleAPICalled', level: 'error', text: 'Unhandled app error', url: '' },
    ]);
  } finally {
    await harness.cleanup();
  }
});

test('CDP helpers evaluate page state, navigate, and aggregate route results locally', async () => {
  const harness = await importHarness();
  try {
    const { collectPageState, evaluate, navigate, setViewport, visitRoute } = harness.module;
    const calls = [];
    const client = {
      events: [],
      send: async (method, params) => {
        calls.push({ method, params });
        if (method === 'Runtime.evaluate') {
          if (params.expression === 'document.readyState') return { result: { value: 'complete' } };
          return {
            result: {
              value: {
                href: 'http://127.0.0.1:4321/auth/login',
                pathname: '/auth/login',
                title: 'Soar Login',
                bodyTextLength: 180,
                headingCount: 1,
                visibleLinks: 2,
                visibleButtons: 1,
                overflowX: false,
              },
            },
          };
        }
        return {};
      },
    };

    assert.equal(await evaluate(client, 'document.readyState'), 'complete');
    await setViewport(client, { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await navigate(client, 'http://127.0.0.1:4321/auth/login', 0);
    assert.equal((await collectPageState(client)).pathname, '/auth/login');

    assert.deepEqual(
      await visitRoute(
        client,
        { webBaseUrl: 'http://127.0.0.1:4321' },
        { id: 'SOAR-ACTION-VISIT-PAGE-LOGIN', path: '/auth/login', minText: 100 },
        { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
      ),
      {
        id: 'SOAR-ACTION-VISIT-PAGE-LOGIN',
        path: '/auth/login',
        viewport: 'mobile',
        result: 'PASS',
        state: {
          href: 'http://127.0.0.1:4321/auth/login',
          pathname: '/auth/login',
          title: 'Soar Login',
          bodyTextLength: 180,
          headingCount: 1,
          visibleLinks: 2,
          visibleButtons: 1,
          overflowX: false,
        },
        issueCount: 0,
        issues: [],
        notes: 'public route rendered in fresh browser without console/network issues or horizontal overflow',
      },
    );
    assert.ok(calls.some((call) => call.method === 'Emulation.setDeviceMetricsOverride'));
    assert.ok(calls.some((call) => call.method === 'Page.navigate'));
  } finally {
    await harness.cleanup();
  }
});

test('provePasswordToggle interprets mocked public auth toggle behavior without browser launch', async () => {
  const harness = await importHarness();
  try {
    const { provePasswordToggle } = harness.module;
    const values = [true, { ok: true, before: 'password', after: 'text', labelBefore: 'Show password', labelAfter: 'Hide password' }];
    const client = {
      events: [],
      send: async (method, params) => {
        if (method === 'Runtime.evaluate') {
          if (params.expression === 'document.readyState') return { result: { value: 'complete' } };
          return { result: { value: values.shift() } };
        }
        return {};
      },
    };

    assert.deepEqual(await provePasswordToggle(client, { webBaseUrl: 'http://127.0.0.1:4321' }, '/auth/login'), {
      id: 'SOAR-ACTION-UI-PASSWORD-VISIBILITY-TOGGLE-LOGIN',
      path: '/auth/login',
      result: 'PASS',
      before: 'password',
      after: 'text',
      ariaLabelChanged: true,
      issueCount: 0,
      issues: [],
      notes: 'password visibility toggle changed input type and accessible label in a fresh browser',
    });
  } finally {
    await harness.cleanup();
  }
});

test('renderMarkdown summarizes route/action proof and keeps scope read-only', async () => {
  const harness = await importHarness(['--help']);
  const originalWrite = process.stdout.write;
  let output = '';
  try {
    const { main, renderMarkdown, wait } = harness.module;
    process.stdout.write = (chunk) => {
      output += String(chunk);
      return true;
    };

    const markdown = renderMarkdown(
      {
        status: 'PASS',
        issue: 'LUC-2958',
        today: '2026-06-08',
        generatedAt: '2026-06-08T00:00:00.000Z',
        webBaseUrl: 'http://127.0.0.1:4321',
        routes: [
          {
            id: 'SOAR-ACTION-VISIT-PAGE-PUBLIC-HOME',
            path: '/',
            viewport: 'desktop',
            result: 'PASS',
            state: { bodyTextLength: 220, visibleLinks: 4, visibleButtons: 2 },
            issueCount: 0,
            notes: 'public route rendered',
          },
        ],
        actions: [
          {
            id: 'SOAR-ACTION-UI-PASSWORD-VISIBILITY-TOGGLE-LOGIN',
            path: '/auth/login',
            result: 'PASS',
            before: 'password',
            after: 'text',
            ariaLabelChanged: true,
            issueCount: 0,
            notes: 'toggle passed',
          },
        ],
        blockers: [],
      },
      'history/artifacts/luc-2958.json',
    );

    assert.match(markdown, /Public Read-Only Browser Proof/);
    assert.match(markdown, /local production Web server/);
    assert.match(markdown, /SOAR-ACTION-VISIT-PAGE-PUBLIC-HOME/);
    assert.match(markdown, /No credentials, cookies, tokens, protected routes/);
    assert.doesNotMatch(markdown, /synthetic-local-test-token/);

    await main();
    assert.match(output, /Usage: node scripts\/runPublicReadOnlyBrowserProof\.mjs/);

    await wait(1);
  } finally {
    process.stdout.write = originalWrite;
    await harness.cleanup();
  }
});
