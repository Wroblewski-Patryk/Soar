#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  return index === -1 ? '' : rawArgs[index + 1] ?? '';
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const repoRoot = process.cwd();

const normalizeBaseUrl = (value) => String(value ?? '').trim().replace(/\/+$/, '');

const walletActions = [
  {
    id: 'SOAR-ACTION-VISIT-PAGE-WALLETS-ROOT',
    route: '/dashboard/wallets',
    expectedPath: '/dashboard/wallets/list',
    kind: 'redirect',
  },
  {
    id: 'SOAR-ACTION-VISIT-PAGE-WALLETS-LIST',
    route: '/dashboard/wallets/list',
    expectedPath: '/dashboard/wallets/list',
    kind: 'route',
  },
  {
    id: 'SOAR-ACTION-VISIT-PAGE-WALLET-CREATE',
    route: '/dashboard/wallets/create',
    expectedPath: '/dashboard/wallets/create',
    kind: 'route',
  },
];

const sourceFiles = [
  'apps/web/src/app/dashboard/wallets/page.tsx',
  'apps/web/src/app/dashboard/wallets/list/page.tsx',
  'apps/web/src/app/dashboard/wallets/create/page.tsx',
  'apps/web/src/app/dashboard/wallets/_components/WalletFormPageContent.tsx',
  'apps/web/src/features/wallets/components/WalletsListTable.test.tsx',
  'apps/web/src/features/wallets/components/WalletCreateEditForm.test.tsx',
  'docs/modules/web-wallets.md',
  'docs/modules/api-wallets.md',
];

const findBrowserPath = () => {
  const candidates = [
    readArgValue('--browser-path'),
    process.env.LOCAL_PROTECTED_BROWSER_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) ?? '';
};

const resolveOptions = () => {
  const today = readArgValue('--today') || new Date().toISOString().slice(0, 10);
  return {
    baseUrl: normalizeBaseUrl(
      readArgValue('--web-base-url') || process.env.LOCAL_PROTECTED_WEB_BASE_URL || 'http://127.0.0.1:3217'
    ),
    cdpPort: Number(readArgValue('--cdp-port') || process.env.LOCAL_PROTECTED_CDP_PORT || 9347),
    browserPath: findBrowserPath(),
    outputJson:
      readArgValue('--output-json') ||
      path.join('history', 'artifacts', `luc-2057-local-protected-wallet-route-action-proof-${today}.json`),
    outputMd:
      readArgValue('--output-md') ||
      path.join('history', 'evidence', `luc-2057-local-protected-wallet-route-action-proof-${today}.md`),
    startServer: !args.has('--use-existing-server'),
    dryRun: args.has('--dry-run'),
    today,
  };
};

class CdpClient {
  constructor(url) {
    this.url = url;
    this.id = 0;
    this.pending = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.url);
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message || JSON.stringify(message.error)));
      else resolve(message.result ?? {});
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
  const userDataDir = path.resolve(repoRoot, '.tmp', `luc-2057-local-browser-${Date.now()}`);
  await rm(userDataDir, { recursive: true, force: true });
  await mkdir(userDataDir, { recursive: true });

  const child = spawn(
    options.browserPath,
    [
      `--remote-debugging-port=${options.cdpPort}`,
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
      const response = await fetch(`http://127.0.0.1:${options.cdpPort}/json/version`);
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
  for (let attempt = 0; attempt < 100; attempt += 1) {
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
      bodyTextLength: (document.body?.innerText || '').trim().length,
      bodyTextPreview: (document.body?.innerText || '').trim().slice(0, 180)
    }))()`
  );

const startWebServer = async (options) => {
  const url = new URL(options.baseUrl);
  const port = url.port || '3217';
  const nextCli = path.join(repoRoot, 'apps', 'web', 'node_modules', 'next', 'dist', 'bin', 'next');
  const child = spawn(process.execPath, [nextCli, 'dev', '-p', port, '-H', url.hostname], {
    cwd: path.join(repoRoot, 'apps', 'web'),
    env: { ...process.env, PORT: port },
    stdio: 'pipe',
    windowsHide: true,
  });

  let output = '';
  let spawnError = null;
  child.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });
  child.on('error', (error) => {
    spawnError = error;
  });

  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (spawnError) {
      throw new Error(`failed to start local web server: ${spawnError.message}`);
    }
    if (child.exitCode !== null) {
      throw new Error(`local web server exited early: ${output.slice(-1000)}`);
    }
    try {
      const response = await fetch(`${options.baseUrl}/auth/login`, { redirect: 'manual' });
      if (response.status === 200) return { child, output: () => output };
    } catch {
      await wait(500);
    }
  }

  child.kill();
  throw new Error(`local web server did not become ready: ${output.slice(-1000)}`);
};

const stopChild = async (child) => {
  if (!child || child.killed || child.exitCode !== null) return;
  child.kill();
  await wait(500);
  if (!child.killed && child.exitCode === null) child.kill();
};

const verifyStaticMapping = () => {
  const indexPath = path.join(repoRoot, 'docs/architecture/indices/user-action-index.csv');
  const index = existsSync(indexPath) ? String(readFileSync(indexPath)) : '';
  const missingActions = walletActions
    .filter((action) => !index.includes(action.id) || !index.includes(action.route))
    .map((action) => action.id);
  const missingFiles = sourceFiles.filter((file) => !existsSync(path.join(repoRoot, file)));
  return {
    result: missingActions.length === 0 && missingFiles.length === 0 ? 'PASS' : 'FAIL',
    missingActions,
    missingFiles,
  };
};

const renderMarkdown = (payload, jsonPath) => {
  const routeRows = payload.routes
    .map(
      (row) =>
        `| ${row.actionId} | \`${row.route}\` | ${row.result} | \`${row.observedPath || '-'}\` | ${row.notes} |`
    )
    .join('\n');
  const sourceRows = payload.sources
    .map((row) => `| \`${row.path}\` | ${row.present ? 'present' : 'missing'} |`)
    .join('\n');
  const blockers = payload.blockers.map((blocker) => `- ${blocker}`).join('\n') || '- none';

  return `# LUC-2057 Local Protected Wallet Route Action Proof

## Status

- Result: **${payload.status}**
- Environment: local-only
- Evidence date: ${payload.today}
- Generated at (UTC): ${payload.generatedAt}
- Raw JSON: \`${jsonPath}\`

## Covered Actions

| Action ID | Route | Result | Observed path | Notes |
| --- | --- | --- | --- | --- |
${routeRows}

## Source And Test References

| Path | Status |
| --- | --- |
${sourceRows}

## API And Docs References

- API routes: \`GET /dashboard/wallets\`, \`POST /dashboard/wallets\`, \`GET /dashboard/wallets/metadata\`, \`GET /dashboard/wallets/:id\`, \`PUT /dashboard/wallets/:id\`, \`DELETE /dashboard/wallets/:id\`, \`POST /dashboard/wallets/:id/reset-paper\`
- Existing focused Web tests: \`WalletsListTable.test.tsx\`, \`WalletCreateEditForm.test.tsx\`, wallet route page tests
- Existing focused API tests: \`apps/api/src/modules/wallets/wallets.e2e.test.ts\`, \`apps/api/src/modules/wallets/wallets.crud.e2e.test.ts\`
- Docs: \`docs/modules/web-wallets.md\`, \`docs/modules/api-wallets.md\`

## Blockers

${blockers}

## Safety Notes

- This proof uses a synthetic local cookie value only to exercise the Web middleware gate.
- It does not submit wallet forms, does not create/update/delete wallets, does not call exchange APIs, and does not touch production accounts.
- Production protected proof remains outside this local harness and is still linked to [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
`;
};

const main = async () => {
  const options = resolveOptions();
  const generatedAt = new Date().toISOString();
  const staticMapping = verifyStaticMapping();
  const routes = [];
  const blockers = [];
  let webServer;
  let browser;
  let client;

  try {
    if (!options.dryRun) {
      if (options.startServer) webServer = await startWebServer(options);
      browser = await launchBrowser(options);
      client = await createPage(options.cdpPort);

      await client.send('Network.clearBrowserCookies');
      await navigate(client, `${options.baseUrl}/dashboard/wallets/list`);
      const unauthenticated = await collectLocation(client);
      routes.push({
        actionId: 'SOAR-ACTION-VISIT-PAGE-WALLETS-LIST',
        route: '/dashboard/wallets/list',
        result: unauthenticated.pathname === '/auth/login' ? 'PASS' : 'FAIL',
        observedPath: unauthenticated.pathname,
        notes: 'unauthenticated protected wallet list route fails closed to login',
      });

      await client.send('Network.setCookie', {
        name: 'token',
        value: 'luc-2057-local-fixture-token',
        url: options.baseUrl,
        path: '/',
        httpOnly: false,
        sameSite: 'Lax',
      });

      for (const action of walletActions) {
        await navigate(client, `${options.baseUrl}${action.route}`);
        const location = await collectLocation(client);
        const pass = location.pathname === action.expectedPath && location.bodyTextLength > 0;
        routes.push({
          actionId: action.id,
          route: action.route,
          result: pass ? 'PASS' : 'FAIL',
          observedPath: location.pathname,
          notes: pass
            ? `${action.kind} reached expected wallet route with local cookie gate`
            : `expected ${action.expectedPath}, got ${location.pathname}; preview=${location.bodyTextPreview}`,
        });
      }

      await navigate(client, `${options.baseUrl}/dashboard/wallets/list`);
      const clickResult = await evaluate(
        client,
        `(() => {
          const buttons = [...document.querySelectorAll('button')];
          const button = buttons.find((item) => /wallet|create|add|dodaj|utw/i.test(item.textContent || ''));
          if (!button) return { clicked: false, reason: 'create wallet button not found' };
          button.click();
          return { clicked: true, text: (button.textContent || '').trim() };
        })()`
      );
      await wait(1500);
      const afterClick = await collectLocation(client);
      routes.push({
        actionId: 'SOAR-ACTION-VISIT-PAGE-WALLET-CREATE',
        route: 'list-page add action',
        result: clickResult.clicked && afterClick.pathname === '/dashboard/wallets/create' ? 'PASS' : 'FAIL',
        observedPath: afterClick.pathname,
        notes: clickResult.clicked
          ? `clicked create/add action (${clickResult.text || 'icon/button'}), expected create route`
          : clickResult.reason,
      });
    } else {
      blockers.push('dry-run mode skipped browser execution by request');
    }
  } catch (error) {
    blockers.push(error instanceof Error ? error.message : String(error));
  } finally {
    client?.close();
    if (browser?.child) await stopChild(browser.child);
    if (browser?.userDataDir) await rm(browser.userDataDir, { recursive: true, force: true }).catch(() => {});
    if (webServer?.child) await stopChild(webServer.child);
  }

  const sources = sourceFiles.map((file) => ({ path: file, present: existsSync(path.join(repoRoot, file)) }));
  const hasFailure =
    staticMapping.result !== 'PASS' ||
    sources.some((source) => !source.present) ||
    routes.some((route) => route.result !== 'PASS') ||
    (!options.dryRun && routes.length === 0);
  const status = hasFailure ? 'FAIL' : options.dryRun ? 'DRY_RUN' : 'PASS';
  const payload = {
    status,
    today: options.today,
    generatedAt,
    issue: 'LUC-2057',
    cluster: 'wallets',
    baseUrl: options.baseUrl,
    staticMapping,
    routes,
    sources,
    blockers,
  };

  await mkdir(path.dirname(path.resolve(repoRoot, options.outputJson)), { recursive: true });
  await mkdir(path.dirname(path.resolve(repoRoot, options.outputMd)), { recursive: true });
  await writeFile(options.outputJson, `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(options.outputMd, renderMarkdown(payload, path.relative(repoRoot, options.outputJson)));

  process.stdout.write(`[local-protected-route-action-proof] JSON report: ${options.outputJson}\n`);
  process.stdout.write(`[local-protected-route-action-proof] Markdown report: ${options.outputMd}\n`);
  process.stdout.write(`[local-protected-route-action-proof] status=${status}\n`);

  if (status === 'FAIL') process.exit(1);
};

main().catch((error) => {
  process.stderr.write(
    `[local-protected-route-action-proof] failed: ${error instanceof Error ? error.stack || error.message : String(error)}\n`
  );
  process.exit(1);
});
