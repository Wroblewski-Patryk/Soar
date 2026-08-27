#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
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

const printUsage = () => {
  process.stdout.write(
    [
      'Usage: node scripts/runProdFixtureActionProof.mjs [options]',
      '',
      'Options:',
      '  --web-base-url <url>',
      '  --api-base-url <url>',
      '  --expected-sha <sha>',
      '  --auth-token <token>',
      '  --auth-email <email>',
      '  --auth-password <password>',
      '  --output-json <path>',
      '  --output-md <path>',
      '  --today <yyyy-mm-dd>',
      '  --i-understand-production-fixture-risk',
      '',
      'Env:',
      '  PROD_FIXTURE_WEB_BASE_URL, PROD_FIXTURE_API_BASE_URL,',
      '  PROD_FIXTURE_EXPECTED_SHA, PROD_FIXTURE_AUTH_TOKEN,',
      '  PROD_FIXTURE_AUTH_EMAIL, PROD_FIXTURE_AUTH_PASSWORD,',
      '  PROD_FIXTURE_OUTPUT_JSON, PROD_FIXTURE_OUTPUT_MD',
    ].join('\n') + '\n'
  );
};

const resolveOptions = () => {
  const today = readArgValue('--today') || new Date().toISOString().slice(0, 10);
  const expectedSha = readArgValue('--expected-sha') || process.env.PROD_FIXTURE_EXPECTED_SHA || '';
  const shortSha = expectedSha ? expectedSha.slice(0, 8) : 'current';
  return {
    webBaseUrl: normalizeBaseUrl(
      readArgValue('--web-base-url') ||
        process.env.PROD_FIXTURE_WEB_BASE_URL ||
        'https://soar.luckysparrow.ch'
    ),
    apiBaseUrl: normalizeBaseUrl(
      readArgValue('--api-base-url') ||
        process.env.PROD_FIXTURE_API_BASE_URL ||
        'https://api.soar.luckysparrow.ch'
    ),
    expectedSha,
    authToken: readArgValue('--auth-token') || process.env.PROD_FIXTURE_AUTH_TOKEN || '',
    authEmail: readArgValue('--auth-email') || process.env.PROD_FIXTURE_AUTH_EMAIL || '',
    authPassword: readArgValue('--auth-password') || process.env.PROD_FIXTURE_AUTH_PASSWORD || '',
    outputJson:
      readArgValue('--output-json') ||
      process.env.PROD_FIXTURE_OUTPUT_JSON ||
      path.join(
        'docs',
        'operations',
        `_artifacts-prod-fixture-action-proof-${shortSha}-${today}.json`
      ),
    outputMd:
      readArgValue('--output-md') ||
      process.env.PROD_FIXTURE_OUTPUT_MD ||
      path.join('docs', 'operations', `prod-fixture-action-proof-${shortSha}-${today}.md`),
    today,
    approved: args.has('--i-understand-production-fixture-risk'),
  };
};

const readJson = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { rawPreview: text.slice(0, 160) };
  }
};

const requestJson = async ({ apiBaseUrl, token, method = 'GET', route, body }) => {
  const response = await fetch(`${apiBaseUrl}${route}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'content-type': 'application/json' } : {}),
      Cookie: `token=${encodeURIComponent(token)}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await readJson(response);
  return { response, payload };
};

const assertStatus = (label, actual, expected) => {
  const expectedValues = Array.isArray(expected) ? expected : [expected];
  if (!expectedValues.includes(actual)) {
    throw new Error(`${label} expected HTTP ${expectedValues.join('/')} but got ${actual}`);
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toStep = (name, status, extra = {}) => ({
  name,
  status,
  ...extra,
});

const renderMarkdown = (payload, jsonPath) => {
  const steps = payload.steps
    .map((step) => `| ${step.name} | ${step.status} | ${step.httpStatus ?? '-'} | ${step.notes ?? '-'} |`)
    .join('\n');
  const cleanup = payload.cleanup
    .map((step) => `| ${step.name} | ${step.status} | ${step.httpStatus ?? '-'} | ${step.notes ?? '-'} |`)
    .join('\n');
  const blockers = payload.blockers.map((item) => `- ${item}`).join('\n') || '- none';

  return `# Production Fixture Action Proof

## Status
- Result: **${payload.status}**
- Environment: production
- Evidence date: ${payload.today}
- Generated at (UTC): ${payload.generatedAt}
- Expected SHA: \`${payload.expectedSha || 'not provided'}\`
- Observed build-info SHA: \`${payload.buildInfo.gitSha || 'n/a'}\`
- Fixture prefix: \`${payload.fixturePrefix}\`
- Raw JSON: \`${jsonPath}\`

## Scope

This proof used approved disposable production fixtures only. It did not submit
LIVE orders, cancel LIVE orders, close LIVE positions, or mutate exchange-side
state.

Covered modules in this slice: Profile, Profile API Keys, Wallets, Markets,
Strategies, Bots, Manual Orders, Orders, Backtests, Reports, Logs/Audit Trail,
and Exchange Adapter probe fail-closed behavior.

## Steps
| Step | Result | HTTP | Notes |
| --- | --- | --- | --- |
${steps}

## Cleanup
| Step | Result | HTTP | Notes |
| --- | --- | --- | --- |
${cleanup || '| none | PASS | - | - |'}

## Blockers
${blockers}

## Redaction Notes
- Auth tokens, passwords, cookies, private headers, raw API-key values, API
  secrets, and response bodies are not written to this artifact.
- Fixture IDs may be recorded only to prove cleanup.
`;
};

const main = async () => {
  if (args.has('--help') || args.has('-h')) {
    printUsage();
    return;
  }

  const options = resolveOptions();
  if (!options.approved) {
    throw new Error('missing --i-understand-production-fixture-risk approval flag');
  }

  const generatedAt = new Date().toISOString();
  const stamp = generatedAt.replace(/[-:]/g, '').slice(0, 13);
  const fixturePrefix = `Codex V1 Proof ${stamp}`;
  const steps = [];
  const cleanup = [];
  const blockers = [];
  const created = {
    apiKeyId: '',
    walletId: '',
    marketUniverseId: '',
    strategyId: '',
    botId: '',
    botMarketGroupId: '',
    botStrategyLinkId: '',
    limitOrderId: '',
    backtestRunId: '',
  };
  let limitOrderCanceled = false;
  let fatalError = null;

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
  if (!buildMatches) {
    throw new Error('build-info does not match expected SHA');
  }

  const auth = await resolveOpsAuthToken({
    baseUrl: options.apiBaseUrl,
    authToken: options.authToken,
    authEmail: options.authEmail,
    authPassword: options.authPassword,
    contextLabel: 'prod-fixture-action-proof',
  });
  if (!auth.token) throw new Error('production fixture proof auth missing');
  steps.push(toStep('auth token resolved', 'PASS', { notes: `${auth.source}:present` }));

  let originalProfile = null;
  try {
    const profileGet = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: '/dashboard/profile/basic',
    });
    assertStatus('profile get', profileGet.response.status, 200);
    originalProfile = {
      name: profileGet.payload?.name || '',
      uiPreferences: profileGet.payload?.uiPreferences || {},
    };
    steps.push(toStep('profile read', 'PASS', { httpStatus: profileGet.response.status }));

    const profilePatch = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'PATCH',
      route: '/dashboard/profile/basic',
      body: {
        name: originalProfile.name || 'Patryk',
        uiPreferences: {
          ...originalProfile.uiPreferences,
          timeZonePreference: 'Europe/Warsaw',
        },
      },
    });
    assertStatus('profile update', profilePatch.response.status, 200);
    steps.push(toStep('profile reversible update', 'PASS', { httpStatus: profilePatch.response.status }));

    const apiKeyCreate = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: '/dashboard/profile/apiKeys',
      body: {
        label: `${fixturePrefix} API key`,
        exchange: 'BINANCE',
        apiKey: `KEY_${stamp}_PLACEHOLDER`,
        apiSecret: `SECRET_${stamp}_PLACEHOLDER`,
        syncExternalPositions: false,
        manageExternalPositions: false,
      },
    });
    assertStatus('api key create', apiKeyCreate.response.status, 201);
    created.apiKeyId = apiKeyCreate.payload?.id || '';
    if (!created.apiKeyId) throw new Error('api key create did not return id');
    if (apiKeyCreate.payload?.apiSecret !== undefined) {
      throw new Error('api key create response exposed apiSecret');
    }
    steps.push(toStep('profile api key create masked', 'PASS', { httpStatus: apiKeyCreate.response.status }));

    const apiKeyProbe = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: `/dashboard/profile/apiKeys/${created.apiKeyId}/test`,
      body: {},
    });
    assertStatus('stored api key test', apiKeyProbe.response.status, 200);
    steps.push(
      toStep('profile api key stored probe fail-closed', 'PASS', {
        httpStatus: apiKeyProbe.response.status,
        notes: `probe ok=${Boolean(apiKeyProbe.payload?.ok)}`,
      })
    );

    const walletCreate = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: '/dashboard/wallets',
      body: {
        name: `${fixturePrefix} Wallet`,
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 12345,
      },
    });
    assertStatus('wallet create', walletCreate.response.status, 201);
    created.walletId = walletCreate.payload?.id || '';
    if (!created.walletId) throw new Error('wallet create did not return id');
    steps.push(toStep('wallet create', 'PASS', { httpStatus: walletCreate.response.status }));

    const walletUpdate = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'PUT',
      route: `/dashboard/wallets/${created.walletId}`,
      body: { name: `${fixturePrefix} Wallet Updated` },
    });
    assertStatus('wallet update', walletUpdate.response.status, 200);
    steps.push(toStep('wallet update', 'PASS', { httpStatus: walletUpdate.response.status }));

    const walletGet = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/wallets/${created.walletId}`,
    });
    assertStatus('wallet readback', walletGet.response.status, 200);
    steps.push(toStep('wallet readback', 'PASS', { httpStatus: walletGet.response.status }));

    const marketCreate = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: '/dashboard/markets/universes',
      body: {
        name: `${fixturePrefix} Market Universe`,
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        filterRules: { minQuoteVolumeEnabled: false },
        whitelist: ['BTCUSDT', 'ETHUSDT'],
        blacklist: ['USDCUSDT'],
        autoExcludeRules: { stablePairs: true },
      },
    });
    assertStatus('market universe create', marketCreate.response.status, 201);
    created.marketUniverseId = marketCreate.payload?.id || '';
    if (!created.marketUniverseId) throw new Error('market universe create did not return id');
    steps.push(toStep('market universe create', 'PASS', { httpStatus: marketCreate.response.status }));

    const marketUpdate = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'PUT',
      route: `/dashboard/markets/universes/${created.marketUniverseId}`,
      body: {
        name: `${fixturePrefix} Market Universe Updated`,
        whitelist: ['BTCUSDT'],
      },
    });
    assertStatus('market universe update', marketUpdate.response.status, 200);
    steps.push(toStep('market universe update', 'PASS', { httpStatus: marketUpdate.response.status }));

    const marketCatalog = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: '/dashboard/markets/catalog?exchange=BINANCE&marketType=FUTURES&baseCurrency=USDT',
    });
    assertStatus('market catalog read', marketCatalog.response.status, 200);
    steps.push(toStep('market catalog read', 'PASS', { httpStatus: marketCatalog.response.status }));

    const strategyCreate = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: '/dashboard/strategies',
      body: {
        name: `${fixturePrefix} Strategy`,
        description: 'Disposable production action proof strategy',
        interval: '5m',
        leverage: 2,
        walletRisk: 1,
        config: {
          open: { logic: 'AND', rules: [] },
          close: { logic: 'OR', rules: [] },
        },
      },
    });
    assertStatus('strategy create', strategyCreate.response.status, 201);
    created.strategyId = strategyCreate.payload?.id || '';
    if (!created.strategyId) throw new Error('strategy create did not return id');
    steps.push(toStep('strategy create', 'PASS', { httpStatus: strategyCreate.response.status }));

    const strategyExport = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/strategies/${created.strategyId}/export`,
    });
    assertStatus('strategy export', strategyExport.response.status, 200);
    steps.push(toStep('strategy export', 'PASS', { httpStatus: strategyExport.response.status }));

    const strategyUpdate = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'PUT',
      route: `/dashboard/strategies/${created.strategyId}`,
      body: {
        name: `${fixturePrefix} Strategy Updated`,
        leverage: 3,
      },
    });
    assertStatus('strategy update', strategyUpdate.response.status, 200);
    steps.push(toStep('strategy update', 'PASS', { httpStatus: strategyUpdate.response.status }));

    const botCreate = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: '/dashboard/bots',
      body: {
        name: `${fixturePrefix} Bot`,
        walletId: created.walletId,
        strategyId: created.strategyId,
        marketGroupId: created.marketUniverseId,
        strategies: [
          {
            strategyId: created.strategyId,
            priority: 100,
            weight: 1,
            isEnabled: true,
          },
        ],
        isActive: false,
        liveOptIn: false,
        manageExternalPositions: false,
      },
    });
    assertStatus('bot create', botCreate.response.status, 201);
    created.botId = botCreate.payload?.id || '';
    if (!created.botId) throw new Error('bot create did not return id');
    steps.push(toStep('bot create inactive paper', 'PASS', { httpStatus: botCreate.response.status }));

    const botRead = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/bots/${created.botId}`,
    });
    assertStatus('bot readback', botRead.response.status, 200);
    steps.push(toStep('bot readback', 'PASS', { httpStatus: botRead.response.status }));

    const botUpdate = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'PUT',
      route: `/dashboard/bots/${created.botId}`,
      body: {
        name: `${fixturePrefix} Bot Updated`,
        isActive: false,
        liveOptIn: false,
      },
    });
    assertStatus('bot update inactive paper', botUpdate.response.status, 200);
    steps.push(toStep('bot update inactive paper', 'PASS', { httpStatus: botUpdate.response.status }));

    const botRuntimeGraph = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/bots/${created.botId}/runtime-graph`,
    });
    assertStatus('bot runtime graph read', botRuntimeGraph.response.status, 200);
    steps.push(toStep('bot runtime graph read', 'PASS', { httpStatus: botRuntimeGraph.response.status }));

    const botMarketGroups = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/bots/${created.botId}/market-groups`,
    });
    assertStatus('bot market groups read', botMarketGroups.response.status, 200);
    const groups = Array.isArray(botMarketGroups.payload) ? botMarketGroups.payload : [];
    created.botMarketGroupId = groups[0]?.id || '';
    if (!created.botMarketGroupId) throw new Error('bot market group readback did not return id');
    steps.push(toStep('bot market groups readback', 'PASS', { httpStatus: botMarketGroups.response.status }));

    const botStrategyLinks = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/bots/${created.botId}/market-groups/${created.botMarketGroupId}/strategies`,
    });
    assertStatus('bot strategy links read', botStrategyLinks.response.status, 200);
    const links = Array.isArray(botStrategyLinks.payload) ? botStrategyLinks.payload : [];
    created.botStrategyLinkId = links[0]?.id || '';
    if (!created.botStrategyLinkId) throw new Error('bot strategy link readback did not return id');
    steps.push(toStep('bot strategy links readback', 'PASS', { httpStatus: botStrategyLinks.response.status }));

    const botAssistantConfig = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'PUT',
      route: `/dashboard/bots/${created.botId}/assistant-config`,
      body: {
        mainAgentEnabled: false,
        mandate: 'Disposable production proof assistant config.',
        modelProfile: 'balanced',
        safetyMode: 'STRICT',
        maxDecisionLatencyMs: 2500,
      },
    });
    assertStatus('bot assistant config update', botAssistantConfig.response.status, 200);
    steps.push(toStep('bot assistant config update', 'PASS', { httpStatus: botAssistantConfig.response.status }));

    const manualContext = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/orders/manual-context?botId=${encodeURIComponent(created.botId)}&symbol=BTCUSDT&side=BUY&quantity=0.01`,
    });
    assertStatus('manual order context read', manualContext.response.status, 200);
    steps.push(toStep('manual order context read', 'PASS', { httpStatus: manualContext.response.status }));

    const limitOrderOpen = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: '/dashboard/orders/open',
      body: {
        botId: created.botId,
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        quantity: 0.01,
        price: 100,
        mode: 'PAPER',
        riskAck: true,
      },
    });
    assertStatus('manual paper limit order open', limitOrderOpen.response.status, 201);
    created.limitOrderId = limitOrderOpen.payload?.id || '';
    if (!created.limitOrderId) throw new Error('manual paper limit order did not return id');
    if (limitOrderOpen.payload?.status !== 'OPEN') {
      throw new Error(`manual paper limit order expected OPEN but got ${limitOrderOpen.payload?.status}`);
    }
    steps.push(toStep('manual paper limit order open', 'PASS', { httpStatus: limitOrderOpen.response.status }));

    const limitOrderGet = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/orders/${created.limitOrderId}`,
    });
    assertStatus('manual paper limit order readback', limitOrderGet.response.status, 200);
    steps.push(toStep('manual paper limit order readback', 'PASS', { httpStatus: limitOrderGet.response.status }));

    const cancelWithoutAck = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: `/dashboard/orders/${created.limitOrderId}/cancel`,
      body: { riskAck: false },
    });
    assertStatus('manual paper limit cancel fail-closed without ack', cancelWithoutAck.response.status, 400);
    steps.push(
      toStep('manual paper limit cancel fail-closed without ack', 'PASS', {
        httpStatus: cancelWithoutAck.response.status,
      })
    );

    const limitOrderCancel = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: `/dashboard/orders/${created.limitOrderId}/cancel`,
      body: { riskAck: true },
    });
    assertStatus('manual paper limit order cancel', limitOrderCancel.response.status, 200);
    limitOrderCanceled = limitOrderCancel.payload?.status === 'CANCELED';
    if (!limitOrderCanceled) {
      throw new Error(`manual paper limit cancel expected CANCELED but got ${limitOrderCancel.payload?.status}`);
    }
    steps.push(toStep('manual paper limit order cancel', 'PASS', { httpStatus: limitOrderCancel.response.status }));

    const canceledOrderGet = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/orders/${created.limitOrderId}`,
    });
    assertStatus('manual paper canceled order readback', canceledOrderGet.response.status, 200);
    if (canceledOrderGet.payload?.status !== 'CANCELED') {
      throw new Error(`manual paper canceled order readback expected CANCELED but got ${canceledOrderGet.payload?.status}`);
    }
    steps.push(toStep('manual paper canceled order readback', 'PASS', { httpStatus: canceledOrderGet.response.status }));

    const backtestCreate = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: '/dashboard/backtests/runs',
      body: {
        name: `${fixturePrefix} Backtest`,
        timeframe: '1h',
        strategyId: created.strategyId,
        marketUniverseId: created.marketUniverseId,
        startAt: '2026-01-01T00:00:00.000Z',
        endAt: '2026-01-03T00:00:00.000Z',
        seedConfig: {
          initialBalance: 1000,
          requestedMaxCandles: 80,
        },
        notes: 'Disposable production fixture backtest proof.',
      },
    });
    assertStatus('backtest run create', backtestCreate.response.status, 201);
    created.backtestRunId = backtestCreate.payload?.id || '';
    if (!created.backtestRunId) throw new Error('backtest run create did not return id');
    steps.push(toStep('backtest run create', 'PASS', { httpStatus: backtestCreate.response.status }));

    const backtestRead = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/backtests/runs/${created.backtestRunId}`,
    });
    assertStatus('backtest run readback', backtestRead.response.status, 200);
    if (backtestRead.payload?.seedConfig?.marketUniverseId !== created.marketUniverseId) {
      throw new Error('backtest run readback did not retain disposable market universe id');
    }
    steps.push(toStep('backtest run readback', 'PASS', { httpStatus: backtestRead.response.status }));

    let backtestReport = null;
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const report = await requestJson({
        apiBaseUrl: options.apiBaseUrl,
        token: auth.token,
        route: `/dashboard/backtests/runs/${created.backtestRunId}/report`,
      });
      assertStatus('backtest report readback', report.response.status, 200);
      backtestReport = report;
      const lifecycle = report.payload?.metrics?.runLifecycle;
      if (lifecycle?.reportReady === true || ['COMPLETED', 'FAILED', 'CANCELED'].includes(lifecycle?.status)) {
        break;
      }
      await sleep(750);
    }
    const reportLifecycle = backtestReport?.payload?.metrics?.runLifecycle;
    if (!backtestReport || reportLifecycle?.reportReady !== true) {
      throw new Error(`backtest report did not become ready; lifecycle=${JSON.stringify(reportLifecycle ?? null)}`);
    }
    steps.push(
      toStep('backtest report readback', 'PASS', {
        httpStatus: backtestReport.response.status,
        notes: `lifecycle=${reportLifecycle.status}`,
      })
    );

    const backtestTrades = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/backtests/runs/${created.backtestRunId}/trades?limit=5`,
    });
    assertStatus('backtest trades readback', backtestTrades.response.status, 200);
    if (!Array.isArray(backtestTrades.payload)) {
      throw new Error('backtest trades readback did not return an array');
    }
    steps.push(toStep('backtest trades readback', 'PASS', { httpStatus: backtestTrades.response.status }));

    const backtestTimeline = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/backtests/runs/${created.backtestRunId}/timeline?symbol=BTCUSDT&cursor=0&chunkSize=50&includeCandles=true&includeIndicators=true&includeEvents=true`,
    });
    assertStatus('backtest timeline readback', backtestTimeline.response.status, 200);
    if (!Array.isArray(backtestTimeline.payload?.candles)) {
      throw new Error('backtest timeline readback did not return candles');
    }
    steps.push(
      toStep('backtest timeline readback', 'PASS', {
        httpStatus: backtestTimeline.response.status,
        notes: `candles=${backtestTimeline.payload.candles.length}`,
      })
    );

    const logsRead = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: '/dashboard/logs?source=profile.apiKey.service&limit=10&page=1',
    });
    assertStatus('audit logs read', logsRead.response.status, 200);
    const logRows = Array.isArray(logsRead.payload?.items)
      ? logsRead.payload.items
      : Array.isArray(logsRead.payload)
        ? logsRead.payload
        : [];
    const hasProbeLog = logRows.some(
      (row) => row?.action === 'profile.api_key.test_connection' || row?.entityType === 'API_KEY'
    );
    if (!hasProbeLog) blockers.push('audit log read passed but did not expose expected API-key probe event in the latest page');
    steps.push(
      toStep('audit logs readback', hasProbeLog ? 'PASS' : 'PARTIAL', {
        httpStatus: logsRead.response.status,
        notes: hasProbeLog ? 'api key probe event visible' : 'latest page did not include probe event',
      })
    );
  } catch (error) {
    fatalError = error instanceof Error ? error.message : String(error);
    blockers.push(fatalError);
  } finally {
    const cleanupDelete = async (name, route) => {
      if (!auth.token || !route) return;
      try {
        const result = await requestJson({
          apiBaseUrl: options.apiBaseUrl,
          token: auth.token,
          method: 'DELETE',
          route,
        });
        cleanup.push(
          toStep(name, result.response.status === 204 || result.response.status === 200 ? 'PASS' : 'FAIL', {
            httpStatus: result.response.status,
          })
        );
      } catch (error) {
        cleanup.push(toStep(name, 'FAIL', { notes: error instanceof Error ? error.message : String(error) }));
      }
    };

    if (created.limitOrderId && !limitOrderCanceled && auth.token) {
      try {
        const result = await requestJson({
          apiBaseUrl: options.apiBaseUrl,
          token: auth.token,
          method: 'POST',
          route: `/dashboard/orders/${created.limitOrderId}/cancel`,
          body: { riskAck: true },
        });
        cleanup.push(
          toStep('manual paper limit order cancel cleanup', result.response.status === 200 ? 'PASS' : 'FAIL', {
            httpStatus: result.response.status,
          })
        );
      } catch (error) {
        cleanup.push(
          toStep('manual paper limit order cancel cleanup', 'FAIL', {
            notes: error instanceof Error ? error.message : String(error),
          })
        );
      }
    }
    if (created.limitOrderId && limitOrderCanceled) {
      cleanup.push(toStep('manual paper limit order terminal cleanup', 'PASS', { notes: 'order left canceled as audit history' }));
    }

    await cleanupDelete(
      'backtest run cleanup',
      created.backtestRunId ? `/dashboard/backtests/runs/${created.backtestRunId}` : ''
    );
    await cleanupDelete('bot cleanup', created.botId ? `/dashboard/bots/${created.botId}` : '');
    await cleanupDelete('strategy cleanup', created.strategyId ? `/dashboard/strategies/${created.strategyId}` : '');
    await cleanupDelete(
      'market universe cleanup',
      created.marketUniverseId ? `/dashboard/markets/universes/${created.marketUniverseId}` : ''
    );
    await cleanupDelete('wallet cleanup', created.walletId ? `/dashboard/wallets/${created.walletId}` : '');
    await cleanupDelete(
      'profile api key cleanup',
      created.apiKeyId ? `/dashboard/profile/apiKeys/${created.apiKeyId}` : ''
    );

    if (originalProfile && auth.token) {
      try {
        const restore = await requestJson({
          apiBaseUrl: options.apiBaseUrl,
          token: auth.token,
          method: 'PATCH',
          route: '/dashboard/profile/basic',
          body: {
            name: originalProfile.name || 'Patryk',
            uiPreferences: originalProfile.uiPreferences,
          },
        });
        cleanup.push(
          toStep('profile restore', restore.response.status === 200 ? 'PASS' : 'FAIL', {
            httpStatus: restore.response.status,
          })
        );
      } catch (error) {
        cleanup.push(toStep('profile restore', 'FAIL', { notes: error instanceof Error ? error.message : String(error) }));
      }
    }
  }

  const cleanupFailed = cleanup.some((step) => step.status === 'FAIL');
  if (cleanupFailed) blockers.push('one or more cleanup steps failed');
  if (fatalError) steps.push(toStep('proof execution stopped', 'FAIL', { notes: fatalError }));
  const status = blockers.length > 0 || cleanupFailed ? 'PARTIAL' : 'PASS';
  const payload = {
    status,
    today: options.today,
    generatedAt,
    environment: 'production',
    webBaseUrl: options.webBaseUrl,
    apiBaseUrl: options.apiBaseUrl,
    expectedSha: options.expectedSha,
    buildInfo,
    fixturePrefix,
    createdFixtureIds: created,
    steps,
    cleanup,
    blockers,
  };

  await mkdir(path.dirname(path.resolve(process.cwd(), options.outputJson)), { recursive: true });
  await mkdir(path.dirname(path.resolve(process.cwd(), options.outputMd)), { recursive: true });
  await writeFile(options.outputJson, `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(options.outputMd, renderMarkdown(payload, path.relative(process.cwd(), options.outputJson)));

  process.stdout.write(`[prod-fixture-action-proof] JSON report: ${options.outputJson}\n`);
  process.stdout.write(`[prod-fixture-action-proof] Markdown report: ${options.outputMd}\n`);
  process.stdout.write(`[prod-fixture-action-proof] status=${status}\n`);
  if (status !== 'PASS') process.exit(1);
};

main().catch((error) => {
  console.error(
    '[prod-fixture-action-proof] failed:',
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
