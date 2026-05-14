#!/usr/bin/env node
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { resolveOpsAuthToken } from './resolveOpsAuthToken.mjs';

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  return index === -1 ? '' : rawArgs[index + 1] ?? '';
};

const normalizeBaseUrl = (value) => String(value ?? '').trim().replace(/\/+$/, '');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const findBrowserPath = () => {
  const candidates = [
    process.env.PROD_AUTH_BROWSER_PATH,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) ?? '';
};

const resolveOptions = () => {
  const today = readArgValue('--today') || new Date().toISOString().slice(0, 10);
  const expectedSha = readArgValue('--expected-sha') || process.env.PROD_AUTH_EXPECTED_SHA || '';
  const shortSha = expectedSha ? expectedSha.slice(0, 8) : 'current';
  return {
    webBaseUrl: normalizeBaseUrl(
      readArgValue('--web-base-url') ||
        process.env.PROD_AUTH_WEB_BASE_URL ||
        'https://soar.luckysparrow.ch'
    ),
    apiBaseUrl: normalizeBaseUrl(
      readArgValue('--api-base-url') ||
        process.env.PROD_AUTH_API_BASE_URL ||
        'https://api.soar.luckysparrow.ch'
    ),
    expectedSha,
    authToken: readArgValue('--auth-token') || process.env.PROD_AUTH_TOKEN || '',
    authEmail: readArgValue('--auth-email') || process.env.PROD_AUTH_EMAIL || '',
    authPassword: readArgValue('--auth-password') || process.env.PROD_AUTH_PASSWORD || '',
    outputJson:
      readArgValue('--output-json') ||
      process.env.PROD_AUTH_OUTPUT_JSON ||
      path.join('docs', 'operations', `_artifacts-prod-auth-session-browser-proof-${shortSha}-${today}.json`),
    outputMd:
      readArgValue('--output-md') ||
      process.env.PROD_AUTH_OUTPUT_MD ||
      path.join('docs', 'operations', `prod-auth-session-browser-proof-${shortSha}-${today}.md`),
    browserPath: readArgValue('--browser-path') || findBrowserPath(),
    port: Number(readArgValue('--cdp-port') || process.env.PROD_AUTH_CDP_PORT || 9337),
    today,
    approved: args.has('--i-understand-production-auth-proof'),
  };
};

const readJson = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { rawPreview: text.slice(0, 120) };
  }
};

class CdpClient {
  constructor(url) {
    this.url = url;
    this.id = 0;
    this.pending = new Map();
    this.events = [];
  }

  async connect() {
    this.ws = new WebSocket(this.url);
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message || JSON.stringify(message.error)));
        else resolve(message.result ?? {});
      } else if (message.method) {
        this.events.push(message);
      }
    });
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    const promise = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
    this.ws.send(JSON.stringify({ id, method, params }));
    return promise;
  }

  close() {
    this.ws?.close();
  }
}

const launchBrowser = async (options) => {
  if (!options.browserPath) throw new Error('Chrome or Edge executable not found');
  const userDataDir = path.resolve(process.cwd(), '.tmp', `prod-auth-cdp-${Date.now()}`);
  await rm(userDataDir, { recursive: true, force: true });
  await mkdir(userDataDir, { recursive: true });
  const child = spawn(
    options.browserPath,
    [
      `--remote-debugging-port=${options.port}`,
      '--remote-debugging-address=127.0.0.1',
      '--remote-allow-origins=*',
      `--user-data-dir=${userDataDir}`,
      '--headless=new',
      '--disable-gpu',
      '--disable-background-networking',
      '--no-first-run',
      '--no-default-browser-check',
      'about:blank',
    ],
    { stdio: 'ignore', windowsHide: true }
  );

  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${options.port}/json/version`);
      if (response.ok) return { child, userDataDir };
    } catch {
      await wait(250);
    }
  }
  child.kill();
  throw new Error('browser remote debugging endpoint did not become ready');
};

const createPage = async (port) => {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' });
  if (!response.ok) throw new Error(`failed to create CDP page: ${response.status}`);
  const target = await response.json();
  const client = new CdpClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Network.enable');
  return client;
};

const evaluate = async (client, expression) => {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || 'Runtime.evaluate failed');
  }
  return result.result?.value;
};

const navigate = async (client, url, settleMs = 2500) => {
  await client.send('Page.navigate', { url });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const ready = await evaluate(client, 'document.readyState');
    if (ready === 'complete') break;
    await wait(250);
  }
  await wait(settleMs);
};

const collectLocation = (client) =>
  evaluate(
    client,
    `(() => ({
      href: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      title: document.title,
      bodyTextLength: (document.body?.innerText || '').trim().length
    }))()`
  );

const clearAuth = async (client) => {
  await client.send('Network.setExtraHTTPHeaders', { headers: {} });
  await client.send('Network.clearBrowserCookies');
};

const setAuthCookie = async (client, options, token) => {
  await client.send('Network.setExtraHTTPHeaders', {
    headers: { Cookie: `token=${encodeURIComponent(token)}` },
  });
  const host = new URL(options.webBaseUrl).hostname;
  const sharedDomain = host.split('.').slice(-2).join('.');
  const hostResult = await client.send('Network.setCookie', {
    name: 'token',
    value: token,
    url: options.webBaseUrl,
    path: '/',
    secure: true,
    httpOnly: false,
    sameSite: 'Lax',
  });
  const sharedResult = await client.send('Network.setCookie', {
    name: 'token',
    value: token,
    domain: sharedDomain,
    path: '/',
    secure: true,
    httpOnly: false,
    sameSite: 'Lax',
  });
  if (hostResult.success === false && sharedResult.success === false) {
    throw new Error('failed to set auth cookie in browser');
  }
};

const toStep = (name, result, extra = {}) => ({ name, result, ...extra });

const renderMarkdown = (payload, jsonPath) => {
  const rows = payload.steps
    .map((step) => `| ${step.name} | ${step.result} | ${step.httpStatus ?? '-'} | ${step.notes ?? '-'} |`)
    .join('\n');
  const blockers = payload.blockers.map((item) => `- ${item}`).join('\n') || '- none';
  return `# Production Auth Session Browser Proof

## Status

- Result: **${payload.status}**
- Environment: production
- Evidence date: ${payload.today}
- Generated at (UTC): ${payload.generatedAt}
- Expected SHA: \`${payload.expectedSha || 'not provided'}\`
- Observed build-info SHA: \`${payload.buildInfo.gitSha || 'n/a'}\`
- Raw JSON: \`${jsonPath}\`

## Scope

This proof verifies production auth browser and API session boundaries without
writing credentials, cookies, tokens, or response bodies to artifacts.

Covered:

- unauthenticated protected route fail-closed redirect
- authenticated protected route rendering
- invalid-token protected route redirect to \`session=expired\`
- logout API fail-closed readback
- protected route redirect after logout

## Steps

| Step | Result | HTTP | Notes |
| --- | --- | --- | --- |
${rows}

## Blockers

${blockers}

## Redaction Notes

- Auth tokens, passwords, cookies, private headers, and response bodies are not
  written to this artifact.
- Browser evidence stores only route/status summaries and text lengths.
`;
};

const main = async () => {
  if (args.has('--help') || args.has('-h')) {
    process.stdout.write('Usage: node scripts/runProdAuthSessionBrowserProof.mjs --i-understand-production-auth-proof [--expected-sha <sha>]\n');
    return;
  }
  const options = resolveOptions();
  if (!options.approved) throw new Error('missing --i-understand-production-auth-proof approval flag');

  const generatedAt = new Date().toISOString();
  const steps = [];
  const blockers = [];
  let browser;
  let client;

  try {
    const buildInfoResponse = await fetch(`${options.webBaseUrl}/api/build-info`, {
      headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
    });
    const buildInfoPayload = await readJson(buildInfoResponse);
    const buildInfo = {
      status: buildInfoResponse.status,
      ok: buildInfoResponse.ok,
      gitSha: buildInfoPayload?.gitSha ?? '',
    };
    const buildMatches = options.expectedSha
      ? String(buildInfo.gitSha).startsWith(options.expectedSha)
      : buildInfo.ok;
    steps.push(
      toStep('build-info freshness', buildMatches ? 'PASS' : 'FAIL', {
        httpStatus: buildInfo.status,
        notes: buildMatches ? 'deployed build matches expected SHA' : 'deployed build mismatch',
      })
    );
    if (!buildMatches) throw new Error('build-info does not match expected SHA');

    const auth = await resolveOpsAuthToken({
      baseUrl: options.apiBaseUrl,
      authToken: options.authToken,
      authEmail: options.authEmail,
      authPassword: options.authPassword,
      contextLabel: 'prod-auth-browser-proof',
    });
    const token = auth.token;
    steps.push(toStep('auth token resolved', token ? 'PASS' : 'FAIL', { notes: `source=${auth.source}` }));
    if (!token) throw new Error('auth token was not available');

    browser = await launchBrowser(options);
    client = await createPage(options.port);

    await clearAuth(client);
    await navigate(client, `${options.webBaseUrl}/dashboard`);
    const noSession = await collectLocation(client);
    steps.push(
      toStep('unauthenticated dashboard redirects to login', noSession.pathname === '/auth/login' ? 'PASS' : 'FAIL', {
        notes: noSession.pathname === '/auth/login' ? 'path=/auth/login' : `path=${noSession.pathname}`,
      })
    );

    await clearAuth(client);
    await setAuthCookie(client, options, token);
    await navigate(client, `${options.webBaseUrl}/dashboard`);
    const validSession = await collectLocation(client);
    steps.push(
      toStep(
        'authenticated dashboard renders',
        validSession.pathname === '/dashboard' && validSession.bodyTextLength > 100 ? 'PASS' : 'FAIL',
        { notes: `path=${validSession.pathname}; text=${validSession.bodyTextLength}` }
      )
    );

    await clearAuth(client);
    await setAuthCookie(client, options, 'invalid-prod-auth-proof-token');
    await navigate(client, `${options.webBaseUrl}/dashboard`, 6000);
    const invalidSession = await collectLocation(client);
    steps.push(
      toStep(
        'invalid token redirects to expired-session login',
        invalidSession.pathname === '/auth/login' && invalidSession.search.includes('session=expired')
          ? 'PASS'
          : 'FAIL',
        { notes: `path=${invalidSession.pathname}; search=${invalidSession.search || '-'}` }
      )
    );

    const logoutResponse = await fetch(`${options.apiBaseUrl}/auth/logout`, {
      method: 'POST',
      headers: { Accept: 'application/json', Cookie: `token=${encodeURIComponent(token)}` },
    });
    steps.push(
      toStep('logout API clears session', logoutResponse.status === 200 ? 'PASS' : 'FAIL', {
        httpStatus: logoutResponse.status,
      })
    );

    const meAfterLogout = await fetch(`${options.apiBaseUrl}/auth/me`, {
      headers: { Accept: 'application/json', Cookie: `token=${encodeURIComponent(token)}` },
    });
    steps.push(
      toStep('auth me after logout fails closed', meAfterLogout.status === 401 ? 'PASS' : 'FAIL', {
        httpStatus: meAfterLogout.status,
      })
    );

    await clearAuth(client);
    await navigate(client, `${options.webBaseUrl}/dashboard`);
    const afterLogoutRoute = await collectLocation(client);
    steps.push(
      toStep('dashboard after logout redirects to login', afterLogoutRoute.pathname === '/auth/login' ? 'PASS' : 'FAIL', {
        notes: `path=${afterLogoutRoute.pathname}`,
      })
    );

    const status = steps.every((step) => step.result === 'PASS') ? 'PASS' : 'FAIL';
    const payload = {
      status,
      today: options.today,
      generatedAt,
      expectedSha: options.expectedSha,
      buildInfo,
      steps,
      blockers: status === 'PASS' ? [] : steps.filter((step) => step.result !== 'PASS').map((step) => step.name),
    };

    await mkdir(path.dirname(options.outputJson), { recursive: true });
    await writeFile(options.outputJson, `${JSON.stringify(payload, null, 2)}\n`);
    await writeFile(options.outputMd, renderMarkdown(payload, options.outputJson));

    if (status !== 'PASS') {
      throw new Error(`production auth session browser proof failed: ${payload.blockers.join(', ')}`);
    }
    process.stdout.write(`Production auth session browser proof PASS: ${options.outputMd}\n`);
  } finally {
    client?.close();
    if (browser?.child && !browser.child.killed) {
      browser.child.kill();
    }
    if (browser?.userDataDir) {
      await rm(browser.userDataDir, { recursive: true, force: true }).catch(() => {});
    }
  }
};

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack || error.message : String(error)}\n`);
  process.exitCode = 1;
});
