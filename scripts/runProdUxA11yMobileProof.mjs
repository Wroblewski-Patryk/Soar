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
  if (index === -1) return '';
  return rawArgs[index + 1] ?? '';
};

const normalizeBaseUrl = (value) => String(value ?? '').trim().replace(/\/+$/, '');

const findBrowserPath = () => {
  const candidates = [
    process.env.PROD_UX_BROWSER_PATH,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) ?? '';
};

const resolveOptions = () => {
  const today = readArgValue('--today') || new Date().toISOString().slice(0, 10);
  const expectedSha = readArgValue('--expected-sha') || process.env.PROD_UX_EXPECTED_SHA || '';
  const shortSha = expectedSha ? expectedSha.slice(0, 8) : 'current';
  return {
    webBaseUrl: normalizeBaseUrl(
      readArgValue('--web-base-url') || process.env.PROD_UX_WEB_BASE_URL || 'https://soar.luckysparrow.ch'
    ),
    apiBaseUrl: normalizeBaseUrl(
      readArgValue('--api-base-url') || process.env.PROD_UX_API_BASE_URL || 'https://api.soar.luckysparrow.ch'
    ),
    expectedSha,
    authToken: readArgValue('--auth-token') || process.env.PROD_UX_AUTH_TOKEN || '',
    authEmail: readArgValue('--auth-email') || process.env.PROD_UX_AUTH_EMAIL || '',
    authPassword: readArgValue('--auth-password') || process.env.PROD_UX_AUTH_PASSWORD || '',
    outputJson:
      readArgValue('--output-json') ||
      process.env.PROD_UX_OUTPUT_JSON ||
      path.join('docs', 'operations', `_artifacts-prod-ux-a11y-mobile-proof-${shortSha}-${today}.json`),
    outputMd:
      readArgValue('--output-md') ||
      process.env.PROD_UX_OUTPUT_MD ||
      path.join('docs', 'operations', `prod-ux-a11y-mobile-proof-${shortSha}-${today}.md`),
    screenshotsDir:
      readArgValue('--screenshots-dir') ||
      process.env.PROD_UX_SCREENSHOTS_DIR ||
      path.join('docs', 'operations', `prod-ux-a11y-mobile-proof-${shortSha}-${today}-screenshots`),
    browserPath: readArgValue('--browser-path') || findBrowserPath(),
    port: Number(readArgValue('--cdp-port') || process.env.PROD_UX_CDP_PORT || 9323),
    today,
    approved: args.has('--i-understand-production-ux-proof'),
  };
};

const readJson = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { rawPreview: text.slice(0, 160) };
  }
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    const payload = JSON.stringify({ id, method, params });
    const promise = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
    this.ws.send(payload);
    return promise;
  }

  close() {
    this.ws?.close();
  }
}

const launchBrowser = async (options, port) => {
  if (!options.browserPath) throw new Error('Chrome or Edge executable not found');
  const userDataDir = path.resolve(process.cwd(), '.tmp', `prod-ux-cdp-${Date.now()}`);
  await rm(userDataDir, { recursive: true, force: true });
  await mkdir(userDataDir, { recursive: true });
  const child = spawn(
    options.browserPath,
    [
      `--remote-debugging-port=${port}`,
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
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
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
  await client.send('Log.enable');
  return client;
};

const evaluate = async (client, expression, returnByValue = true) => {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || 'Runtime.evaluate failed');
  }
  return result.result?.value;
};

const navigate = async (client, url) => {
  await client.send('Page.navigate', { url });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const ready = await evaluate(client, 'document.readyState');
    if (ready === 'complete') break;
    await wait(250);
  }
  await wait(5000);
};

const setViewport = (client, viewport) =>
  client.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.deviceScaleFactor ?? 1,
    mobile: Boolean(viewport.mobile),
  });

const setAuthCookie = async (client, options, token) => {
  await client.send('Network.setExtraHTTPHeaders', {
    headers: {
      Cookie: `token=${encodeURIComponent(token)}`,
    },
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
    throw new Error('failed to set dashboard auth cookie in browser');
  }
};

const captureScreenshot = async (client, filePath) => {
  const result = await client.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });
  await writeFile(filePath, Buffer.from(result.data, 'base64'));
};

const collectPageCheck = async (client) =>
  evaluate(
    client,
    `(() => {
      const visibleText = document.body?.innerText || '';
      const isVisible = (el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      };
      const buttons = [...document.querySelectorAll('button')].filter(isVisible);
      const links = [...document.querySelectorAll('a[href]')].filter(isVisible);
      const inputs = [...document.querySelectorAll('input,textarea,select')].filter(isVisible);
      const controlName = (el) => (el.getAttribute('aria-label') || el.getAttribute('title') || el.innerText || el.textContent || '').trim();
      const unnamedButtons = buttons.filter((el) => !controlName(el)).length;
      const unnamedLinks = links.filter((el) => !controlName(el)).length;
      const unnamedInputs = inputs.filter((el) => {
        const id = el.id;
        const hasLabel = id && document.querySelector('label[for="' + CSS.escape(id) + '"]');
        return !(hasLabel || el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.getAttribute('title'));
      }).length;
      const horizontalOverflow = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
      const frameworkOverlay = Boolean(document.querySelector('[data-nextjs-dialog-overlay], #nextjs__container_errors, [data-nextjs-toast]'));
      const active = document.activeElement;
      return {
        title: document.title,
        lang: document.documentElement.lang || '',
        visibleTextLength: visibleText.trim().length,
        bodyPreview: visibleText.trim().slice(0, 180).replace(/\\s+/g, ' '),
        headingCount: document.querySelectorAll('h1,h2').length,
        buttonCount: buttons.length,
        linkCount: links.length,
        inputCount: inputs.length,
        unnamedButtons,
        unnamedLinks,
        unnamedInputs,
        unnamedButtonExamples: buttons.filter((el) => !controlName(el)).slice(0, 5).map((el) => el.outerHTML.slice(0, 140)),
        unnamedLinkExamples: links.filter((el) => !controlName(el)).slice(0, 5).map((el) => el.outerHTML.slice(0, 140)),
        unnamedInputExamples: inputs.filter((el) => {
          const id = el.id;
          const hasLabel = id && document.querySelector('label[for="' + CSS.escape(id) + '"]');
          return !(hasLabel || el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.getAttribute('title'));
        }).slice(0, 5).map((el) => el.outerHTML.slice(0, 140)),
        horizontalOverflow,
        frameworkOverlay,
        activeElement: active ? [active.tagName, active.getAttribute('aria-label') || active.textContent || active.id || ''].join(':').slice(0, 120) : '',
      };
    })()`
  );

const clickMobileMenu = async (client) =>
  evaluate(
    client,
    `(() => {
      const candidates = [...document.querySelectorAll('button')];
      const menuButton = candidates.find((el) => {
        const label = (el.getAttribute('aria-label') || el.getAttribute('title') || el.innerText || '').toLowerCase();
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (label.includes('menu') || label.includes('nav') || label.includes('navigation') || label.includes('open'));
      }) || candidates.find((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.top < 120;
      });
      if (!menuButton) return { clicked: false, label: '' };
      menuButton.click();
      return { clicked: true, label: (menuButton.getAttribute('aria-label') || menuButton.getAttribute('title') || menuButton.innerText || '').trim().slice(0, 80) };
    })()`
  );

const hasBadEvents = (events) =>
  events.some((event) => {
    if (event.method === 'Runtime.exceptionThrown') return true;
    if (event.method === 'Log.entryAdded') {
      const level = event.params?.entry?.level;
      const text = event.params?.entry?.text || '';
      return ['error', 'warning'].includes(level) && !/favicon|manifest|The resource/.test(text);
    }
    return false;
  });

const summarizeBadEvents = (events) =>
  events
    .filter((event) => {
      if (event.method === 'Runtime.exceptionThrown') return true;
      if (event.method === 'Log.entryAdded') {
        const level = event.params?.entry?.level;
        const text = event.params?.entry?.text || '';
        return ['error', 'warning'].includes(level) && !/favicon|manifest|The resource/.test(text);
      }
      return false;
    })
    .slice(0, 5)
    .map((event) =>
      event.method === 'Runtime.exceptionThrown'
        ? `exception:${event.params?.exceptionDetails?.text ?? 'runtime'}`
        : `${event.params?.entry?.level}:${String(event.params?.entry?.text ?? '').slice(0, 160)}`
    );

const renderMarkdown = (payload, jsonPath) => {
  const rows = payload.pages
    .map(
      (page) =>
        `| ${page.name} | ${page.viewport} | ${page.status} | ${page.url} | ${page.screenshot ? `\`${page.screenshot}\`` : '-'} | ${page.notes} |`
    )
    .join('\n');
  const blockers = payload.blockers.map((item) => `- ${item}`).join('\n') || '- none';
  return `# Production UX/A11y/Mobile Proof

## Status
- Result: **${payload.status}**
- Environment: production
- Evidence date: ${payload.today}
- Generated at (UTC): ${payload.generatedAt}
- Expected SHA: \`${payload.expectedSha || 'not provided'}\`
- Observed build-info SHA: \`${payload.buildInfo.gitSha || 'n/a'}\`
- Raw JSON: \`${jsonPath}\`

## Scope

This proof uses authenticated production browser rendering through Chrome/Edge
CDP. It checks desktop and mobile route rendering, basic accessibility
heuristics, keyboard focus, mobile menu interaction, console/exception health,
framework overlay absence, and horizontal overflow. It does not mutate
production data or submit live-money actions.

## Pages
| Page | Viewport | Result | URL | Screenshot | Notes |
| --- | --- | --- | --- | --- | --- |
${rows}

## Blockers
${blockers}

## Safety Notes
- Auth tokens, passwords, cookies, private headers, and raw protected payloads
  are not written to this artifact.
- Screenshots are static visual evidence only and must not contain secrets.
`;
};

const main = async () => {
  const options = resolveOptions();
  if (!options.approved) throw new Error('missing --i-understand-production-ux-proof approval flag');

  const generatedAt = new Date().toISOString();
  const buildInfoResponse = await fetch(`${options.webBaseUrl}/api/build-info`, {
    headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
  });
  const buildInfoPayload = await readJson(buildInfoResponse);
  const buildInfo = {
    status: buildInfoResponse.status,
    ok: buildInfoResponse.ok,
    gitSha: buildInfoPayload?.gitSha ?? '',
  };
  const blockers = [];
  if (options.expectedSha && !String(buildInfo.gitSha).startsWith(options.expectedSha)) {
    blockers.push('build-info does not match expected SHA');
  }

  const auth = await resolveOpsAuthToken({
    baseUrl: options.apiBaseUrl,
    authToken: options.authToken,
    authEmail: options.authEmail,
    authPassword: options.authPassword,
    contextLabel: 'prod-ux-proof',
  });
  if (!auth.token) blockers.push('dashboard auth missing');

  const port = options.port;
  const browser = await launchBrowser(options, port);
  const pages = [];
  let client;
  try {
    await mkdir(options.screenshotsDir, { recursive: true });
    client = await createPage(port);
    await setAuthCookie(client, options, auth.token);

    const scenarios = [
      { name: 'dashboard desktop', path: '/dashboard', viewport: { width: 1366, height: 900 } },
      { name: 'wallets desktop', path: '/dashboard/wallets/list', viewport: { width: 1366, height: 900 } },
      { name: 'bots desktop', path: '/dashboard/bots', viewport: { width: 1366, height: 900 } },
      { name: 'profile desktop', path: '/dashboard/profile', viewport: { width: 1366, height: 900 } },
      { name: 'dashboard mobile', path: '/dashboard', viewport: { width: 390, height: 844, mobile: true, deviceScaleFactor: 2 } },
    ];

    for (const scenario of scenarios) {
      client.events = [];
      await setViewport(client, scenario.viewport);
      const url = `${options.webBaseUrl}${scenario.path}`;
      await navigate(client, url);
      if (scenario.name.includes('mobile')) {
        const click = await clickMobileMenu(client);
        await wait(500);
        await client.send('Input.dispatchKeyEvent', { type: 'keyDown', windowsVirtualKeyCode: 9, key: 'Tab', code: 'Tab' });
        await client.send('Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 9, key: 'Tab', code: 'Tab' });
        scenario.mobileMenu = click;
      }
      const check = await collectPageCheck(client);
      const fileName = `${scenario.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`;
      const screenshotPath = path.join(options.screenshotsDir, fileName);
      await captureScreenshot(client, screenshotPath);
      const failures = [];
      if (check.visibleTextLength < 40) failures.push('low visible text');
      if (/sign in to soar|name@example\\.com/i.test(check.bodyPreview)) failures.push('protected route rendered login page');
      if (!check.title) failures.push('missing document title');
      if (!check.lang) failures.push('missing html lang');
      const warnings = [];
      if (check.unnamedButtons > 0) warnings.push(`unnamed buttons=${check.unnamedButtons}`);
      if (check.unnamedLinks > 0) warnings.push(`unnamed links=${check.unnamedLinks}`);
      if (check.unnamedInputs > 0) warnings.push(`unnamed inputs=${check.unnamedInputs}`);
      if (check.horizontalOverflow > 12) failures.push(`horizontal overflow=${check.horizontalOverflow}`);
      if (check.frameworkOverlay) failures.push('framework overlay detected');
      const badEvents = summarizeBadEvents(client.events);
      if (badEvents.length) warnings.push(`console/runtime event observed: ${badEvents.join(' | ')}`);
      if (scenario.name.includes('mobile') && !scenario.mobileMenu?.clicked) failures.push('mobile menu click target missing');
      const status = failures.length ? 'FAIL' : 'PASS';
      pages.push({
        name: scenario.name,
        path: scenario.path,
        url,
        viewport: `${scenario.viewport.width}x${scenario.viewport.height}${scenario.viewport.mobile ? ' mobile' : ' desktop'}`,
        status,
        screenshot: path.relative(process.cwd(), screenshotPath),
        notes: failures.length
          ? failures.join('; ')
          : `text=${check.visibleTextLength}; title=${check.title}; focus=${check.activeElement || '-'}${warnings.length ? `; warnings=${warnings.join('; ')}` : ''}`,
        checks: check,
        badEvents,
        warnings,
        mobileMenu: scenario.mobileMenu,
      });
    }
  } finally {
    client?.close();
    browser.child.kill();
    await wait(1000);
    await rm(browser.userDataDir, { recursive: true, force: true }).catch(() => {});
  }

  const status = blockers.length || pages.some((page) => page.status !== 'PASS') ? 'FAIL' : 'PASS';
  const payload = {
    status,
    today: options.today,
    generatedAt,
    environment: 'production',
    webBaseUrl: options.webBaseUrl,
    apiBaseUrl: options.apiBaseUrl,
    expectedSha: options.expectedSha,
    buildInfo,
    auth: auth.token ? `${auth.source}:present` : 'missing',
    pages,
    blockers,
  };

  await mkdir(path.dirname(path.resolve(process.cwd(), options.outputJson)), { recursive: true });
  await mkdir(path.dirname(path.resolve(process.cwd(), options.outputMd)), { recursive: true });
  await writeFile(options.outputJson, `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(options.outputMd, renderMarkdown(payload, path.relative(process.cwd(), options.outputJson)));
  process.stdout.write(`[prod-ux-proof] JSON report: ${options.outputJson}\n`);
  process.stdout.write(`[prod-ux-proof] Markdown report: ${options.outputMd}\n`);
  process.stdout.write(`[prod-ux-proof] status=${status}\n`);
  if (status !== 'PASS') process.exit(1);
};

main().catch((error) => {
  console.error('[prod-ux-proof] failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
