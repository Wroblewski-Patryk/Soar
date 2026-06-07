import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const scriptUrl = pathToFileURL(path.resolve('scripts/runProdUxA11yMobileProof.mjs'));

const importHarness = async (argv = [], env = {}) => {
  const originalArgv = process.argv;
  const originalEnv = { ...process.env };

  process.argv = ['node', 'scripts/runProdUxA11yMobileProof.test.mjs', ...argv];
  process.env.PROD_UX_WEB_BASE_URL = ' https://soar.example.test/// ';
  process.env.PROD_UX_API_BASE_URL = ' https://api.soar.example.test/// ';
  process.env.PROD_UX_EXPECTED_SHA = 'abcdef1234567890';
  process.env.PROD_UX_AUTH_TOKEN = 'ux-token';
  process.env.PROD_UX_AUTH_EMAIL = 'local@example.test';
  process.env.PROD_UX_AUTH_PASSWORD = 'synthetic-local-password';
  process.env.PROD_UX_OUTPUT_JSON = 'history/artifacts/prod-ux-proof.json';
  process.env.PROD_UX_OUTPUT_MD = 'history/evidence/prod-ux-proof.md';
  process.env.PROD_UX_SCREENSHOTS_DIR = 'history/artifacts/prod-ux-screenshots';
  process.env.PROD_UX_BROWSER_PATH = '';
  Object.assign(process.env, env);

  try {
    const module = await import(`${scriptUrl.href}?case=${Date.now()}-${Math.random()}`);
    return {
      module,
      cleanup: async () => {
        process.argv = originalArgv;
        process.env = originalEnv;
      },
    };
  } catch (error) {
    process.argv = originalArgv;
    process.env = originalEnv;
    throw error;
  }
};

const element = (values = {}) => ({
  innerText: values.innerText ?? '',
  textContent: values.textContent ?? '',
  getAttribute: (name) => values[name] ?? null,
});

test('argument and option helpers normalize production UX proof inputs without running the CLI', async () => {
  const harness = await importHarness([
    '--today',
    '2026-06-07',
    '--web-base-url',
    ' https://web.local/// ',
    '--api-base-url',
    ' https://api.local/// ',
    '--expected-sha',
    '1234567890',
    '--auth-token',
    'cli-ux-token',
    '--output-json',
    'history/artifacts/custom-prod-ux.json',
    '--output-md',
    'history/evidence/custom-prod-ux.md',
    '--screenshots-dir',
    'history/artifacts/custom-prod-ux-screens',
    '--browser-path',
    'C:/Browsers/chrome.exe',
    '--cdp-port',
    '9444',
    '--i-understand-production-ux-proof',
  ]);
  try {
    const { normalizeBaseUrl, readArgValue, resolveOptions } = harness.module;

    assert.equal(readArgValue('--expected-sha'), '1234567890');
    assert.equal(readArgValue('--missing'), '');
    assert.equal(normalizeBaseUrl(' https://soar.local/// '), 'https://soar.local');

    assert.deepEqual(resolveOptions(), {
      webBaseUrl: 'https://web.local',
      apiBaseUrl: 'https://api.local',
      expectedSha: '1234567890',
      authToken: 'cli-ux-token',
      authEmail: 'local@example.test',
      authPassword: 'synthetic-local-password',
      outputJson: 'history/artifacts/custom-prod-ux.json',
      outputMd: 'history/evidence/custom-prod-ux.md',
      screenshotsDir: 'history/artifacts/custom-prod-ux-screens',
      browserPath: 'C:/Browsers/chrome.exe',
      port: 9444,
      today: '2026-06-07',
      approved: true,
    });
  } finally {
    await harness.cleanup();
  }
});

test('controlName extracts accessible control labels in priority order', async () => {
  const harness = await importHarness();
  try {
    const { controlName } = harness.module;

    assert.equal(controlName(element({ 'aria-label': '  Open menu  ', title: 'Title' })), 'Open menu');
    assert.equal(controlName(element({ title: '  Download  ', innerText: 'Ignored' })), 'Download');
    assert.equal(controlName(element({ innerText: '  Save changes  ' })), 'Save changes');
    assert.equal(controlName(element({ textContent: '  Fallback text  ' })), 'Fallback text');
    assert.equal(controlName(element()), '');
  } finally {
    await harness.cleanup();
  }
});

test('bad event helpers ignore benign browser noise and summarize actionable failures', async () => {
  const harness = await importHarness();
  try {
    const { hasBadEvents, summarizeBadEvents } = harness.module;
    const events = [
      {
        method: 'Log.entryAdded',
        params: { entry: { level: 'warning', text: 'The resource /favicon.ico was preloaded' } },
      },
      {
        method: 'Log.entryAdded',
        params: { entry: { level: 'info', text: 'hydrated' } },
      },
      {
        method: 'Log.entryAdded',
        params: { entry: { level: 'error', text: 'Unhandled dashboard render failure with private token ux-token' } },
      },
      {
        method: 'Runtime.exceptionThrown',
        params: { exceptionDetails: { text: 'TypeError: failed' } },
      },
    ];

    assert.equal(hasBadEvents(events), true);
    assert.deepEqual(summarizeBadEvents(events), [
      'error:Unhandled dashboard render failure with private token ux-token',
      'exception:TypeError: failed',
    ]);
    assert.equal(hasBadEvents(events.slice(0, 2)), false);
    assert.deepEqual(summarizeBadEvents(events.slice(0, 2)), []);
  } finally {
    await harness.cleanup();
  }
});

test('readJson, renderMarkdown, and main approval failure stay local and redaction-safe', async () => {
  const harness = await importHarness();
  try {
    const { main, readJson, renderMarkdown } = harness.module;

    assert.deepEqual(await readJson({ text: async () => '{"ok":true}' }), { ok: true });
    assert.equal(await readJson({ text: async () => '' }), null);
    assert.deepEqual(await readJson({ text: async () => `${'x'.repeat(180)}-tail` }), {
      rawPreview: 'x'.repeat(160),
    });

    const markdown = renderMarkdown(
      {
        status: 'FAIL',
        today: '2026-06-07',
        generatedAt: '2026-06-07T00:00:00.000Z',
        expectedSha: 'abcdef',
        buildInfo: { gitSha: 'abcdef1234' },
        pages: [
          {
            name: 'dashboard mobile',
            viewport: '390x844 mobile',
            status: 'FAIL',
            url: 'https://soar.example.test/dashboard',
            screenshot: 'history/artifacts/prod-ux/dashboard-mobile.png',
            notes: 'horizontal overflow=24',
          },
        ],
        blockers: ['dashboard auth missing'],
      },
      'history/artifacts/prod-ux-proof.json',
    );
    assert.match(markdown, /Production UX\/A11y\/Mobile Proof/);
    assert.match(markdown, /horizontal overflow=24/);
    assert.match(markdown, /Auth tokens, passwords, cookies/);
    assert.doesNotMatch(markdown, /ux-token|synthetic-local-password/);

    const missingApproval = await importHarness([]);
    try {
      await assert.rejects(() => missingApproval.module.main(), /missing --i-understand-production-ux-proof approval flag/);
    } finally {
      await missingApproval.cleanup();
    }
  } finally {
    await harness.cleanup();
  }
});
