#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  return index === -1 ? '' : rawArgs[index + 1] ?? '';
};

const normalizeBaseUrl = (value) => String(value ?? '').trim().replace(/\/+$/, '');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isLocalWebBaseUrl = (value) => /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(value);

const killProcessTree = async (pid) => {
  if (!pid || process.platform !== 'win32') return;
  await new Promise((resolve) => {
    const child = spawn('taskkill.exe', ['/PID', String(pid), '/T', '/F'], {
      stdio: 'ignore',
      windowsHide: true,
    });
    child.on('exit', resolve);
    child.on('error', resolve);
  });
};

const findBrowserPath = () => {
  const candidates = [
    process.env.PUBLIC_BROWSER_PROOF_BROWSER_PATH,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) ?? '';
};

const resolveOptions = () => {
  const today = readArgValue('--today') || new Date().toISOString().slice(0, 10);
  const issue = readArgValue('--issue') || 'LUC-2255';
  const slug = issue.toLowerCase();
  return {
    webBaseUrl: normalizeBaseUrl(
      readArgValue('--web-base-url') ||
        process.env.PUBLIC_BROWSER_PROOF_WEB_BASE_URL ||
        'https://soar.luckysparrow.ch'
    ),
    outputJson:
      readArgValue('--output-json') ||
      path.join('history', 'artifacts', `${slug}-public-read-only-browser-proof-${today}.json`),
    outputMd:
      readArgValue('--output-md') ||
      path.join('history', 'evidence', `${slug}-public-read-only-browser-proof-${today}.md`),
    browserPath: readArgValue('--browser-path') || findBrowserPath(),
    port: Number(readArgValue('--cdp-port') || process.env.PUBLIC_BROWSER_PROOF_CDP_PORT || 9355),
    issue,
    today,
  };
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
  const userDataDir = path.resolve(process.cwd(), '.tmp', `public-browser-proof-${Date.now()}`);
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
  await client.send('Log.enable');
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

const setViewport = (client, viewport) =>
  client.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.deviceScaleFactor,
    mobile: viewport.mobile,
  });

const navigate = async (client, url, settleMs = 1500) => {
  await client.send('Page.navigate', { url });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const ready = await evaluate(client, 'document.readyState');
    if (ready === 'complete') break;
    await wait(250);
  }
  await wait(settleMs);
};

const collectPageState = (client) =>
  evaluate(
    client,
    `(() => ({
      href: window.location.href,
      pathname: window.location.pathname,
      title: document.title,
      bodyTextLength: (document.body?.innerText || '').trim().length,
      headingCount: document.querySelectorAll('h1,h2').length,
      visibleLinks: Array.from(document.querySelectorAll('a')).filter((node) => {
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }).length,
      visibleButtons: Array.from(document.querySelectorAll('button')).filter((node) => {
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }).length,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1
    }))()`
  );

const collectIssues = (client) =>
  client.events
    .filter((event) => {
      if (event.method === 'Runtime.consoleAPICalled') {
        return ['error', 'warning'].includes(event.params?.type);
      }
      if (event.method === 'Log.entryAdded') {
        return ['error', 'warning'].includes(event.params?.entry?.level);
      }
      if (event.method === 'Network.loadingFailed') return true;
      return false;
    })
    .map((event) => ({
      method: event.method,
      level: event.params?.type || event.params?.entry?.level || 'error',
      text:
        event.params?.entry?.text ||
        event.params?.errorText ||
        event.params?.args?.map((arg) => arg.value || arg.description).filter(Boolean).join(' ') ||
        '',
      url: event.params?.entry?.url || '',
    }))
    .filter((issue) => {
      const text = String(issue.text);
      const url = String(issue.url);
      if (text.includes('favicon')) return false;
      if (text === 'net::ERR_ABORTED') return false;
      if (text.includes('status of 401') && url.includes('/auth/me')) return false;
      return true;
    });

const collectRouteIssues = (client, options) =>
  collectIssues(client).filter((issue) => {
    const text = String(issue.text);
    const url = String(issue.url);
    if (isLocalWebBaseUrl(options.webBaseUrl) && url.includes('/auth/me') && text.includes('ERR_CONNECTION_REFUSED')) {
      return false;
    }
    if (
      isLocalWebBaseUrl(options.webBaseUrl) &&
      !url &&
      issue.method === 'Network.loadingFailed' &&
      text.includes('ERR_CONNECTION_REFUSED')
    ) {
      return false;
    }
    return true;
  });

const visitRoute = async (client, options, route, viewport) => {
  client.events = [];
  await setViewport(client, viewport);
  await navigate(client, `${options.webBaseUrl}${route.path}`);
  const state = await collectPageState(client);
  const issues = collectRouteIssues(client, options);
  const passed =
    state.pathname === route.path &&
    state.bodyTextLength >= route.minText &&
    state.headingCount >= 1 &&
    !state.overflowX &&
    issues.length === 0;
  return {
    id: route.id,
    path: route.path,
    viewport: viewport.name,
    result: passed ? 'PASS' : 'FAIL',
    state,
    issueCount: issues.length,
    issues,
    notes: passed
      ? 'public route rendered in fresh browser without console/network issues or horizontal overflow'
      : 'public route failed one or more browser proof checks',
  };
};

const provePasswordToggle = async (client, options, routePath) => {
  client.events = [];
  await setViewport(client, {
    name: 'desktop',
    width: 1365,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await navigate(client, `${options.webBaseUrl}${routePath}`, 2200);
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const ready = await evaluate(
      client,
      `(() => {
        const password = document.querySelector('input#password');
        const buttons = Array.from(document.querySelectorAll('button[type="button"]'));
        const button = buttons.find((node) => {
          const label = node.getAttribute('aria-label') || '';
          return label.toLowerCase().includes('password') || label.toLowerCase().includes('haslo') || label.toLowerCase().includes('passwort');
        });
        return Boolean(password && button && !password.disabled && !button.disabled);
      })()`
    );
    if (ready) break;
    await wait(250);
  }
  const result = await evaluate(
    client,
    `(async () => {
      const password = document.querySelector('input#password');
      const button = password?.parentElement?.querySelector('button[type="button"]');
      if (!password || !button) {
        return { ok: false, before: password?.type || '', after: '', labelBefore: button?.getAttribute('aria-label') || '', labelAfter: '', reason: 'password input or toggle button missing' };
      }
      const before = password.type;
      const labelBefore = button.getAttribute('aria-label') || '';
      button.click();
      await new Promise((resolve) => setTimeout(resolve, 50));
      const after = password.type;
      const labelAfter = button.getAttribute('aria-label') || '';
      return { ok: before === 'password' && after === 'text' && labelBefore !== labelAfter, before, after, labelBefore, labelAfter, reason: '' };
    })()`
  );
  const issues = collectRouteIssues(client, options);
  const passed = Boolean(result?.ok) && issues.length === 0;
  return {
    id: routePath === '/auth/login' ? 'SOAR-ACTION-UI-PASSWORD-VISIBILITY-TOGGLE-LOGIN' : 'SOAR-ACTION-UI-PASSWORD-VISIBILITY-TOGGLE-REGISTER',
    path: routePath,
    result: passed ? 'PASS' : 'FAIL',
    before: result?.before || '',
    after: result?.after || '',
    ariaLabelChanged: Boolean(result?.labelBefore && result?.labelAfter && result.labelBefore !== result.labelAfter),
    issueCount: issues.length,
    issues,
    notes: passed ? 'password visibility toggle changed input type and accessible label in a fresh browser' : result?.reason || 'toggle proof failed',
  };
};

const renderMarkdown = (payload, jsonPath) => {
  const routeRows = payload.routes
    .map(
      (row) =>
        `| ${row.id} | \`${row.path}\` | ${row.viewport} | ${row.result} | ${row.state.bodyTextLength} | ${row.state.visibleLinks} | ${row.state.visibleButtons} | ${row.issueCount} | ${row.notes} |`
    )
    .join('\n');
  const actionRows = payload.actions
    .map(
      (row) =>
        `| ${row.id} | \`${row.path}\` | ${row.result} | ${row.before || '-'} -> ${row.after || '-'} | ${row.ariaLabelChanged ? 'yes' : 'no'} | ${row.issueCount} | ${row.notes} |`
    )
    .join('\n');
  const blockers = payload.blockers.map((item) => `- ${item}`).join('\n') || '- none';

  const environmentLabel = isLocalWebBaseUrl(payload.webBaseUrl) ? 'local production Web server' : 'production';

  return `# Public Read-Only Browser Proof

## Status

- Result: **${payload.status}**
- Issue: [${payload.issue}](/LUC/issues/${payload.issue})
- Environment: ${environmentLabel}
- Evidence date: ${payload.today}
- Generated at (UTC): ${payload.generatedAt}
- Web base URL: \`${payload.webBaseUrl}\`
- Raw JSON: \`${jsonPath}\`

## Scope

Fresh headless browser proof for public/read-only web actions only:

- visit public home
- visit login
- visit register
- visit offline page
- use password visibility toggle on public auth forms

## Route Results

| Action | Route | Viewport | Result | Text length | Links | Buttons | Issues | Notes |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
${routeRows}

## Read-Only UI Action Results

| Action | Route | Result | Type transition | Accessible label changed | Issues | Notes |
| --- | --- | --- | --- | --- | ---: | --- |
${actionRows}

## Blockers

${blockers}

## Safety Notes

- This proof used a fresh browser profile and unauthenticated production pages.
- No credentials, cookies, tokens, protected routes, account state, forms submit,
  exchange settings, live-trading behavior, deploy, restart, rollback, env, or
  database mutation were used.
- This is public/read-only browser evidence only. It does not replace protected
  authenticated browser proof or production release proof.
`;
};

const main = async () => {
  if (args.has('--help') || args.has('-h')) {
    process.stdout.write('Usage: node scripts/runPublicReadOnlyBrowserProof.mjs [--issue LUC-2255] [--web-base-url <url>]\n');
    return;
  }

  const options = resolveOptions();
  const generatedAt = new Date().toISOString();
  const routes = [
    { id: 'SOAR-ACTION-VISIT-PAGE-PUBLIC-HOME', path: '/', minText: 100 },
    { id: 'SOAR-ACTION-VISIT-PAGE-LOGIN', path: '/auth/login', minText: 100 },
    { id: 'SOAR-ACTION-VISIT-PAGE-REGISTER', path: '/auth/register', minText: 100 },
    { id: 'SOAR-ACTION-VISIT-PAGE-TERMS', path: '/terms', minText: 100 },
    { id: 'SOAR-ACTION-VISIT-PAGE-PRIVACY', path: '/privacy', minText: 100 },
    { id: 'SOAR-ACTION-VISIT-PAGE-OFFLINE', path: '/offline', minText: 40 },
  ];
  const viewports = [
    { name: 'desktop', width: 1365, height: 900, deviceScaleFactor: 1, mobile: false },
    { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
  ];

  let browser;
  let client;
  try {
    browser = await launchBrowser(options);
    client = await createPage(options.port);

    const routeResults = [];
    for (const route of routes) {
      for (const viewport of viewports) {
        routeResults.push(await visitRoute(client, options, route, viewport));
      }
    }

    const actionResults = [
      await provePasswordToggle(client, options, '/auth/login'),
      await provePasswordToggle(client, options, '/auth/register'),
    ];

    const failures = [...routeResults, ...actionResults].filter((row) => row.result !== 'PASS');
    const payload = {
      status: failures.length === 0 ? 'PASS' : 'FAIL',
      issue: options.issue,
      today: options.today,
      generatedAt,
      webBaseUrl: options.webBaseUrl,
      routes: routeResults,
      actions: actionResults,
      blockers: failures.map((row) => `${row.id} ${row.path} failed`),
    };

    await mkdir(path.dirname(path.resolve(process.cwd(), options.outputJson)), { recursive: true });
    await mkdir(path.dirname(path.resolve(process.cwd(), options.outputMd)), { recursive: true });
    await writeFile(options.outputJson, `${JSON.stringify(payload, null, 2)}\n`);
    await writeFile(options.outputMd, renderMarkdown(payload, path.relative(process.cwd(), options.outputJson)));

    process.stdout.write(`[public-read-only-browser-proof] JSON report: ${options.outputJson}\n`);
    process.stdout.write(`[public-read-only-browser-proof] Markdown report: ${options.outputMd}\n`);
    process.stdout.write(`[public-read-only-browser-proof] status=${payload.status}\n`);
    if (payload.status !== 'PASS') process.exitCode = 1;
  } finally {
    client?.close();
    if (browser?.child && !browser.child.killed) {
      browser.child.kill();
      await killProcessTree(browser.child.pid);
    }
    if (browser?.userDataDir) {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          await rm(browser.userDataDir, { recursive: true, force: true });
          break;
        } catch {
          await wait(500);
        }
      }
    }
  }
};

main()
  .then(() => {
    process.exit(process.exitCode ?? 0);
  })
  .catch((error) => {
  process.stderr.write(`[public-read-only-browser-proof] failed: ${error instanceof Error ? error.stack || error.message : String(error)}\n`);
    process.exit(1);
  });
