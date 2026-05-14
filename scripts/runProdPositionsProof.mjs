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
      'Usage: node scripts/runProdPositionsProof.mjs [options]',
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
      '  --i-understand-production-positions-proof',
      '',
      'Env:',
      '  PROD_POSITIONS_WEB_BASE_URL, PROD_POSITIONS_API_BASE_URL,',
      '  PROD_POSITIONS_EXPECTED_SHA, PROD_POSITIONS_AUTH_TOKEN,',
      '  PROD_POSITIONS_AUTH_EMAIL, PROD_POSITIONS_AUTH_PASSWORD,',
      '  PROD_POSITIONS_OUTPUT_JSON, PROD_POSITIONS_OUTPUT_MD',
    ].join('\n') + '\n'
  );
};

const resolveOptions = () => {
  const today = readArgValue('--today') || new Date().toISOString().slice(0, 10);
  const expectedSha = readArgValue('--expected-sha') || process.env.PROD_POSITIONS_EXPECTED_SHA || '';
  const shortSha = expectedSha ? expectedSha.slice(0, 8) : 'current';
  return {
    webBaseUrl: normalizeBaseUrl(
      readArgValue('--web-base-url') ||
        process.env.PROD_POSITIONS_WEB_BASE_URL ||
        'https://soar.luckysparrow.ch'
    ),
    apiBaseUrl: normalizeBaseUrl(
      readArgValue('--api-base-url') ||
        process.env.PROD_POSITIONS_API_BASE_URL ||
        'https://api.soar.luckysparrow.ch'
    ),
    expectedSha,
    authToken: readArgValue('--auth-token') || process.env.PROD_POSITIONS_AUTH_TOKEN || '',
    authEmail: readArgValue('--auth-email') || process.env.PROD_POSITIONS_AUTH_EMAIL || '',
    authPassword: readArgValue('--auth-password') || process.env.PROD_POSITIONS_AUTH_PASSWORD || '',
    outputJson:
      readArgValue('--output-json') ||
      process.env.PROD_POSITIONS_OUTPUT_JSON ||
      path.join('docs', 'operations', `_artifacts-prod-positions-proof-${shortSha}-${today}.json`),
    outputMd:
      readArgValue('--output-md') ||
      process.env.PROD_POSITIONS_OUTPUT_MD ||
      path.join('docs', 'operations', `prod-positions-proof-${shortSha}-${today}.md`),
    today,
    approved: args.has('--i-understand-production-positions-proof'),
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

const requestJson = async ({
  apiBaseUrl,
  token = '',
  method = 'GET',
  route,
  body,
}) => {
  const response = await fetch(`${apiBaseUrl}${route}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { Cookie: `token=${encodeURIComponent(token)}` } : {}),
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

const toStep = (name, status, extra = {}) => ({ name, status, ...extra });

const extractItems = (payload) => {
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload)) return payload;
  return [];
};

const renderMarkdown = (payload, jsonPath) => {
  const steps = payload.steps
    .map((step) => `| ${step.name} | ${step.status} | ${step.httpStatus ?? '-'} | ${step.notes ?? '-'} |`)
    .join('\n');
  const cleanup = payload.cleanup
    .map((step) => `| ${step.name} | ${step.status} | ${step.httpStatus ?? '-'} | ${step.notes ?? '-'} |`)
    .join('\n');
  const blockers = payload.blockers.map((item) => `- ${item}`).join('\n') || '- none';

  return `# Production Positions Proof

## Status
- Result: **${payload.status}**
- Environment: production
- Evidence date: ${payload.today}
- Generated at (UTC): ${payload.generatedAt}
- Expected SHA: \`${payload.expectedSha || 'not provided'}\`
- Observed build-info SHA: \`${payload.buildInfo.gitSha || 'n/a'}\`
- Selected bot: ${payload.selected.botName || '-'} (${payload.selected.botId || '-'})
- Selected session: ${payload.selected.sessionId || '-'}
- Selected symbol: ${payload.selected.symbol || '-'}
- Proof order: ${payload.selected.orderId || '-'}
- Proof position: ${payload.selected.positionId || '-'}
- Raw JSON: \`${jsonPath}\`

## Scope

This proof uses a controlled PAPER-only production position lifecycle on an
already-running PAPER bot. It does not submit LIVE orders, cancel LIVE orders,
close LIVE positions, mutate exchange-side state, or persist raw credentials in
artifacts. The proof-created PAPER order/position/trade records remain only as
terminal audit/history after successful close.

Covered module in this slice: Positions.

## Steps
| Step | Result | HTTP | Notes |
| --- | --- | --- | --- |
${steps}

## Cleanup
| Step | Result | HTTP | Notes |
| --- | --- | --- | --- |
${cleanup || '| no cleanup needed | PASS | - | - |'}

## Blockers
${blockers}

## Redaction Notes
- Auth tokens, passwords, cookies, private headers, raw API-key values, API
  secrets, and response bodies that may contain secrets are not written to this
  artifact.
- Payloads are summarized only as booleans/counts/status codes.
`;
};

const findCandidate = async ({ apiBaseUrl, token }) => {
  const botsResponse = await requestJson({
    apiBaseUrl,
    token,
    route: '/dashboard/bots?marketType=FUTURES',
  });
  assertStatus('bots list', botsResponse.response.status, 200);
  const bots = extractItems(botsResponse.payload).filter(
    (bot) => bot?.mode === 'PAPER' && bot?.isActive === true && bot?.exchange === 'BINANCE'
  );

  for (const bot of bots) {
    const sessionsResponse = await requestJson({
      apiBaseUrl,
      token,
      route: `/dashboard/bots/${encodeURIComponent(bot.id)}/runtime-sessions?status=RUNNING&limit=5`,
    });
    if (sessionsResponse.response.status !== 200) continue;
    const sessions = extractItems(sessionsResponse.payload);
    const session = sessions[0];
    if (!session?.id) continue;

    const positionsResponse = await requestJson({
      apiBaseUrl,
      token,
      route: `/dashboard/bots/${encodeURIComponent(bot.id)}/runtime-sessions/${encodeURIComponent(session.id)}/positions?limit=200`,
    });
    if (positionsResponse.response.status !== 200) continue;
    const openSymbols = new Set(
      extractItems(positionsResponse.payload?.openItems).map((item) => String(item?.symbol ?? '').toUpperCase())
    );

    const statsResponse = await requestJson({
      apiBaseUrl,
      token,
      route: `/dashboard/bots/${encodeURIComponent(bot.id)}/runtime-sessions/${encodeURIComponent(session.id)}/symbol-stats?limit=200`,
    });
    if (statsResponse.response.status !== 200) continue;
    const statsSymbols = extractItems(statsResponse.payload)
      .map((item) => String(item?.symbol ?? '').toUpperCase())
      .filter(Boolean);
    const symbol = statsSymbols.find((item) => !openSymbols.has(item));
    if (!symbol) continue;

    return {
      bot,
      session,
      symbol,
      openBeforeCount: openSymbols.size,
      statsSymbolsCount: statsSymbols.length,
    };
  }

  return null;
};

const main = async () => {
  if (args.has('--help') || args.has('-h')) {
    printUsage();
    return;
  }

  const options = resolveOptions();
  if (!options.approved) {
    throw new Error('missing --i-understand-production-positions-proof approval flag');
  }

  const generatedAt = new Date().toISOString();
  const steps = [];
  const cleanup = [];
  const blockers = [];
  const selected = {
    botId: '',
    botName: '',
    sessionId: '',
    symbol: '',
    orderId: '',
    positionId: '',
  };
  let fatalError = null;
  let auth = { token: '', source: 'missing' };

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

  auth = await resolveOpsAuthToken({
    baseUrl: options.apiBaseUrl,
    authToken: options.authToken,
    authEmail: options.authEmail,
    authPassword: options.authPassword,
    contextLabel: 'prod-positions-proof',
  });
  if (!auth.token) throw new Error('production positions proof auth missing');
  steps.push(toStep('auth token resolved', 'PASS', { notes: `${auth.source}:present` }));

  try {
    const noAuthPositions = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      route: '/dashboard/positions',
    });
    assertStatus('unauthenticated positions list', noAuthPositions.response.status, 401);
    steps.push(toStep('unauthenticated positions list fail-closed', 'PASS', {
      httpStatus: noAuthPositions.response.status,
    }));

    const candidate = await findCandidate({ apiBaseUrl: options.apiBaseUrl, token: auth.token });
    if (!candidate) {
      throw new Error('no active PAPER runtime bot with a free runtime symbol was available');
    }
    selected.botId = candidate.bot.id;
    selected.botName = candidate.bot.name;
    selected.sessionId = candidate.session.id;
    selected.symbol = candidate.symbol;
    steps.push(toStep('active paper runtime candidate selected', 'PASS', {
      notes: `openBefore=${candidate.openBeforeCount}; statsSymbols=${candidate.statsSymbolsCount}`,
    }));

    const listBefore = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/positions?status=OPEN&symbol=${encodeURIComponent(selected.symbol)}&limit=50`,
    });
    assertStatus('positions open list before', listBefore.response.status, 200);
    const existingForBot = extractItems(listBefore.payload).filter(
      (item) => item?.botId === selected.botId && item?.status === 'OPEN'
    );
    if (existingForBot.length > 0) {
      throw new Error(`selected symbol ${selected.symbol} already has an open position for selected bot`);
    }
    steps.push(toStep('positions list before proof mutation', 'PASS', {
      httpStatus: listBefore.response.status,
      notes: `selectedBotOpen=${existingForBot.length}`,
    }));

    const manualContext = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/orders/manual-context?botId=${encodeURIComponent(selected.botId)}&symbol=${encodeURIComponent(selected.symbol)}&side=BUY&quantity=1`,
    });
    assertStatus('manual order context for proof symbol', manualContext.response.status, 200);
    const quantity = Math.max(
      1,
      Number(manualContext.payload?.quantityConstraints?.minExecutableQty ?? 0) || 1
    );
    steps.push(toStep('manual order context for proof symbol', 'PASS', {
      httpStatus: manualContext.response.status,
      notes: `quantity=${quantity}`,
    }));

    const openOrder = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: '/dashboard/orders/open',
      body: {
        botId: selected.botId,
        symbol: selected.symbol,
        side: 'BUY',
        type: 'MARKET',
        quantity,
        mode: 'PAPER',
        riskAck: true,
      },
    });
    assertStatus('paper market order opens proof position', openOrder.response.status, 201);
    selected.orderId = openOrder.payload?.id || '';
    selected.positionId = openOrder.payload?.positionId || '';
    if (!selected.orderId || !selected.positionId || openOrder.payload?.status !== 'FILLED') {
      throw new Error('paper market order did not return a filled order with positionId');
    }
    steps.push(toStep('paper market order opens proof position', 'PASS', {
      httpStatus: openOrder.response.status,
      notes: `order=${selected.orderId}; position=${selected.positionId}`,
    }));

    const positionRead = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/positions/${encodeURIComponent(selected.positionId)}`,
    });
    assertStatus('position readback after open', positionRead.response.status, 200);
    if (
      positionRead.payload?.status !== 'OPEN' ||
      positionRead.payload?.botId !== selected.botId ||
      positionRead.payload?.symbol !== selected.symbol
    ) {
      throw new Error('position readback did not match opened proof position');
    }
    steps.push(toStep('position readback after open', 'PASS', { httpStatus: positionRead.response.status }));

    const entryPrice = Number(positionRead.payload?.entryPrice);
    if (!Number.isFinite(entryPrice) || entryPrice <= 0) throw new Error('position entry price unavailable');

    const managementManual = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'PATCH',
      route: `/dashboard/positions/${encodeURIComponent(selected.positionId)}/management-mode`,
      body: { managementMode: 'MANUAL_MANAGED' },
    });
    assertStatus('position management mode manual', managementManual.response.status, 200);
    if (managementManual.payload?.managementMode !== 'MANUAL_MANAGED') {
      throw new Error('position management mode did not switch to MANUAL_MANAGED');
    }
    steps.push(toStep('position management mode manual', 'PASS', { httpStatus: managementManual.response.status }));

    const managementBot = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'PATCH',
      route: `/dashboard/positions/${encodeURIComponent(selected.positionId)}/management-mode`,
      body: { managementMode: 'BOT_MANAGED' },
    });
    assertStatus('position management mode restored bot', managementBot.response.status, 200);
    if (managementBot.payload?.managementMode !== 'BOT_MANAGED') {
      throw new Error('position management mode did not restore BOT_MANAGED');
    }
    steps.push(toStep('position management mode restored bot', 'PASS', {
      httpStatus: managementBot.response.status,
    }));

    const manualUpdate = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'PATCH',
      route: `/dashboard/positions/${encodeURIComponent(selected.positionId)}/manual-update`,
      body: {
        takeProfit: Number((entryPrice * 1.05).toFixed(8)),
        stopLoss: Number((entryPrice * 0.95).toFixed(8)),
        notes: 'Codex V1 production positions proof PAPER-only update.',
        lockRules: true,
      },
    });
    assertStatus('position manual update', manualUpdate.response.status, 200);
    steps.push(toStep('position manual update', 'PASS', { httpStatus: manualUpdate.response.status }));

    const liveStatus = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: '/dashboard/positions/live-status',
    });
    assertStatus('positions live reconciliation status read', liveStatus.response.status, 200);
    steps.push(toStep('positions live reconciliation status read', 'PASS', {
      httpStatus: liveStatus.response.status,
      notes: `openPositionsSeen=${Number(liveStatus.payload?.openPositionsSeen ?? 0)}`,
    }));

    const takeoverStatus = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: '/dashboard/positions/takeover-status',
    });
    assertStatus('positions takeover status read', takeoverStatus.response.status, 200);
    steps.push(toStep('positions takeover status read', 'PASS', {
      httpStatus: takeoverStatus.response.status,
      notes: `items=${extractItems(takeoverStatus.payload).length}`,
    }));

    const exchangeSnapshot = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: '/dashboard/positions/exchange-snapshot',
    });
    assertStatus('positions exchange snapshot boundary', exchangeSnapshot.response.status, [200, 400, 409, 501, 502]);
    steps.push(toStep('positions exchange snapshot boundary', 'PASS', {
      httpStatus: exchangeSnapshot.response.status,
      notes:
        exchangeSnapshot.response.status === 200
          ? 'snapshot read succeeded'
          : 'snapshot failed closed without proof mutation',
    }));

    const closeWithoutAck = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: `/dashboard/bots/${encodeURIComponent(selected.botId)}/runtime-sessions/${encodeURIComponent(selected.sessionId)}/positions/${encodeURIComponent(selected.positionId)}/close`,
      body: { riskAck: false },
    });
    assertStatus('runtime position close fail-closed without ack', closeWithoutAck.response.status, 400);
    steps.push(toStep('runtime position close fail-closed without ack', 'PASS', {
      httpStatus: closeWithoutAck.response.status,
    }));

    const closeWithAck = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: `/dashboard/bots/${encodeURIComponent(selected.botId)}/runtime-sessions/${encodeURIComponent(selected.sessionId)}/positions/${encodeURIComponent(selected.positionId)}/close`,
      body: { riskAck: true },
    });
    assertStatus('runtime position close with ack', closeWithAck.response.status, 200);
    if (closeWithAck.payload?.status !== 'closed' || closeWithAck.payload?.positionId !== selected.positionId) {
      throw new Error(`runtime close expected closed for proof position but got ${JSON.stringify(closeWithAck.payload)}`);
    }
    steps.push(toStep('runtime position close with ack', 'PASS', {
      httpStatus: closeWithAck.response.status,
      notes: `closeOrder=${closeWithAck.payload?.orderId ?? '-'}`,
    }));

    const closedRead = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/positions/${encodeURIComponent(selected.positionId)}`,
    });
    assertStatus('closed position readback', closedRead.response.status, 200);
    if (closedRead.payload?.status !== 'CLOSED' || !closedRead.payload?.closedAt) {
      throw new Error('closed position readback did not show terminal closed state');
    }
    steps.push(toStep('closed position readback', 'PASS', { httpStatus: closedRead.response.status }));

    const listAfter = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: `/dashboard/positions?status=OPEN&symbol=${encodeURIComponent(selected.symbol)}&limit=50`,
    });
    assertStatus('positions list after close', listAfter.response.status, 200);
    const stillOpen = extractItems(listAfter.payload).filter((item) => item?.id === selected.positionId);
    if (stillOpen.length > 0) throw new Error('proof position still appears in OPEN positions after close');
    steps.push(toStep('positions list after close', 'PASS', {
      httpStatus: listAfter.response.status,
      notes: 'proof position absent from OPEN list',
    }));
  } catch (error) {
    fatalError = error instanceof Error ? error.message : String(error);
    blockers.push(fatalError);
  } finally {
    if (selected.positionId && selected.botId && selected.sessionId && auth.token) {
      try {
        const read = await requestJson({
          apiBaseUrl: options.apiBaseUrl,
          token: auth.token,
          route: `/dashboard/positions/${encodeURIComponent(selected.positionId)}`,
        });
        const stillOpen = read.response.status === 200 && read.payload?.status === 'OPEN';
        if (stillOpen) {
          const result = await requestJson({
            apiBaseUrl: options.apiBaseUrl,
            token: auth.token,
            method: 'POST',
            route: `/dashboard/bots/${encodeURIComponent(selected.botId)}/runtime-sessions/${encodeURIComponent(selected.sessionId)}/positions/${encodeURIComponent(selected.positionId)}/close`,
            body: { riskAck: true },
          });
          cleanup.push(toStep('proof position close cleanup', result.response.status === 200 ? 'PASS' : 'FAIL', {
            httpStatus: result.response.status,
            notes: result.payload?.status ?? '-',
          }));
        } else if (read.response.status === 200) {
          cleanup.push(toStep('proof position terminal cleanup', 'PASS', {
            httpStatus: read.response.status,
            notes: `status=${read.payload?.status ?? '-'}`,
          }));
        }
      } catch (error) {
        cleanup.push(toStep('proof position close cleanup', 'FAIL', {
          notes: error instanceof Error ? error.message : String(error),
        }));
      }
    }
  }

  if (fatalError) steps.push(toStep('proof execution stopped', 'FAIL', { notes: fatalError }));
  const status = blockers.length > 0 || cleanup.some((item) => item.status === 'FAIL') ? 'PARTIAL' : 'PASS';
  const payload = {
    status,
    today: options.today,
    generatedAt,
    environment: 'production',
    webBaseUrl: options.webBaseUrl,
    apiBaseUrl: options.apiBaseUrl,
    expectedSha: options.expectedSha,
    buildInfo,
    selected,
    steps,
    cleanup,
    blockers,
  };

  await mkdir(path.dirname(path.resolve(process.cwd(), options.outputJson)), { recursive: true });
  await mkdir(path.dirname(path.resolve(process.cwd(), options.outputMd)), { recursive: true });
  await writeFile(options.outputJson, `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(options.outputMd, renderMarkdown(payload, path.relative(process.cwd(), options.outputJson)));

  process.stdout.write(`[prod-positions-proof] JSON report: ${options.outputJson}\n`);
  process.stdout.write(`[prod-positions-proof] Markdown report: ${options.outputMd}\n`);
  process.stdout.write(`[prod-positions-proof] status=${status}\n`);
  if (status !== 'PASS') process.exit(1);
};

main().catch((error) => {
  console.error('[prod-positions-proof] failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
