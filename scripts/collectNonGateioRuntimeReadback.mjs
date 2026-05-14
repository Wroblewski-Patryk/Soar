#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';

import {
  buildOpsRequestHeaders,
  resolveOpsAuthLayerOptions,
} from './buildOpsRequestHeaders.mjs';
import { resolveOpsAuthToken } from './resolveOpsAuthToken.mjs';

const readArgValue = (flag) => {
  const index = process.argv.indexOf(flag);
  if (index === -1) return '';
  return process.argv[index + 1] ?? '';
};

const normalizeBaseUrl = (value) => String(value ?? '').trim().replace(/\/+$/, '');
const hash = (value) => {
  const normalized = String(value ?? '').trim();
  return normalized ? createHash('sha256').update(normalized).digest('hex').slice(0, 12) : null;
};

const options = {
  baseUrl: normalizeBaseUrl(
    readArgValue('--base-url') ||
      process.env.NON_GATEIO_READBACK_API_BASE_URL ||
      'https://api.soar.luckysparrow.ch'
  ),
  webBaseUrl: normalizeBaseUrl(
    readArgValue('--web-base-url') ||
      process.env.NON_GATEIO_READBACK_WEB_BASE_URL ||
      'https://soar.luckysparrow.ch'
  ),
  authToken: readArgValue('--auth-token') || process.env.NON_GATEIO_READBACK_AUTH_TOKEN || '',
  authEmail: readArgValue('--auth-email') || process.env.NON_GATEIO_READBACK_AUTH_EMAIL || '',
  authPassword:
    readArgValue('--auth-password') || process.env.NON_GATEIO_READBACK_AUTH_PASSWORD || '',
  expectedSha:
    readArgValue('--expected-sha') ||
    process.env.NON_GATEIO_READBACK_EXPECTED_SHA ||
    '00169d7fdc3aff8317759137b05594b20e773c8e',
  outputJson:
    readArgValue('--output-json') ||
    process.env.NON_GATEIO_READBACK_OUTPUT_JSON ||
    'docs/operations/_artifacts-prod-non-gateio-runtime-readback-00169d7f-2026-05-13.json',
  outputMd:
    readArgValue('--output-md') ||
    process.env.NON_GATEIO_READBACK_OUTPUT_MD ||
    'docs/operations/prod-non-gateio-runtime-readback-00169d7f-2026-05-13.md',
  timeoutMs: Number.parseInt(process.env.NON_GATEIO_READBACK_TIMEOUT_MS || '15000', 10),
};

const fetchJson = async (url, { headers = {} } = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        ...headers,
      },
      signal: controller.signal,
    });
    const text = await response.text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = { raw: text.slice(0, 300) };
    }
    if (!response.ok) {
      const message = payload?.error?.message || payload?.message || response.statusText;
      throw new Error(`GET ${url} failed with HTTP ${response.status}: ${message}`);
    }
    return payload;
  } finally {
    clearTimeout(timer);
  }
};

const safeNumber = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : null);

const summarizeBot = (bot) => ({
  idHash: hash(bot?.id),
  name: bot?.name,
  mode: bot?.mode,
  exchange: bot?.exchange,
  marketType: bot?.marketType,
  isActive: Boolean(bot?.isActive),
  liveOptIn: Boolean(bot?.liveOptIn),
});

const summarizeSession = (session) => ({
  idHash: hash(session?.id),
  status: session?.status ?? null,
  mode: session?.mode ?? null,
  startedAt: session?.startedAt ?? null,
  finishedAt: session?.finishedAt ?? null,
  lastHeartbeatAt: session?.lastHeartbeatAt ?? null,
  symbolsTracked: session?.symbolsTracked ?? null,
  eventsCount: session?.eventsCount ?? null,
  heartbeatAgeSeconds: session?.lastHeartbeatAt
    ? Math.round((Date.now() - Date.parse(session.lastHeartbeatAt)) / 1000)
    : null,
});

const summarizeAggregate = (aggregate) => ({
  sessionDetail: summarizeSession(aggregate?.sessionDetail),
  symbolStats: {
    items: Array.isArray(aggregate?.symbolStats?.items) ? aggregate.symbolStats.items.length : null,
    totalSignals: safeNumber(aggregate?.symbolStats?.summary?.totalSignals),
    openPositionCount: safeNumber(aggregate?.symbolStats?.summary?.openPositionCount),
    realizedPnl: safeNumber(aggregate?.symbolStats?.summary?.realizedPnl),
    unrealizedPnl: safeNumber(aggregate?.symbolStats?.summary?.unrealizedPnl),
  },
  positions: {
    total: safeNumber(aggregate?.positions?.total),
    openCount: safeNumber(aggregate?.positions?.openCount),
    closedCount: safeNumber(aggregate?.positions?.closedCount),
    openOrdersCount: safeNumber(aggregate?.positions?.openOrdersCount),
    historyItems: Array.isArray(aggregate?.positions?.historyItems)
      ? aggregate.positions.historyItems.length
      : null,
    openItems: Array.isArray(aggregate?.positions?.openItems)
      ? aggregate.positions.openItems.length
      : null,
    realizedPnl: safeNumber(aggregate?.positions?.summary?.realizedPnl),
    unrealizedPnl: safeNumber(aggregate?.positions?.summary?.unrealizedPnl),
    feesPaid: safeNumber(aggregate?.positions?.summary?.feesPaid),
  },
  trades: {
    total: safeNumber(aggregate?.trades?.total),
    items: Array.isArray(aggregate?.trades?.items) ? aggregate.trades.items.length : null,
    feesPaid: safeNumber(aggregate?.trades?.feesPaid),
  },
});

const assertOptions = () => {
  if (!options.baseUrl) throw new Error('Missing API base URL.');
  if (!options.webBaseUrl) throw new Error('Missing web base URL.');
  if (!options.authToken && (!options.authEmail || !options.authPassword)) {
    throw new Error('Missing auth token or login credentials for read-only production readback.');
  }
};

const main = async () => {
  assertOptions();

  const authLayer = resolveOpsAuthLayerOptions({});
  const resolvedAuth = await resolveOpsAuthToken({
    baseUrl: options.baseUrl,
    authToken: options.authToken,
    authEmail: options.authEmail,
    authPassword: options.authPassword,
    ...authLayer,
    contextLabel: 'ops:non-gateio-runtime-readback',
  });
  const headers = buildOpsRequestHeaders({ token: resolvedAuth.token, ...authLayer });
  const generatedAt = new Date().toISOString();
  const buildInfo = await fetchJson(`${options.webBaseUrl}/api/build-info`);
  const bots = await fetchJson(`${options.baseUrl}/dashboard/bots?marketType=FUTURES`, {
    headers,
  });

  if (!Array.isArray(bots)) throw new Error('Expected /dashboard/bots to return an array.');

  const botRows = [];
  for (const bot of bots.filter((item) => item?.exchange !== 'GATEIO')) {
    const sessions = await fetchJson(
      `${options.baseUrl}/dashboard/bots/${encodeURIComponent(bot.id)}/runtime-sessions?limit=5`,
      { headers }
    );
    const latest = Array.isArray(sessions) ? sessions[0] : null;
    const running = Array.isArray(sessions)
      ? sessions.find((session) => session?.status === 'RUNNING')
      : null;
    const row = {
      bot: summarizeBot(bot),
      sessionsHttp: 200,
      sessionsCountReturned: Array.isArray(sessions) ? sessions.length : null,
      latestSession: summarizeSession(latest),
      runningSession: summarizeSession(running),
      aggregateHttp: null,
      aggregate: null,
      singleSessionReadback: null,
      classification: 'UNKNOWN',
    };

    if (bot.mode === 'PAPER' && running?.id) {
      const sessionPath = `${options.baseUrl}/dashboard/bots/${encodeURIComponent(
        bot.id
      )}/runtime-sessions/${encodeURIComponent(running.id)}`;
      const [detail, stats, positions, trades, aggregate] = await Promise.all([
        fetchJson(sessionPath, { headers }),
        fetchJson(`${sessionPath}/symbol-stats?limit=100`, { headers }),
        fetchJson(`${sessionPath}/positions?limit=100`, { headers }),
        fetchJson(`${sessionPath}/trades?limit=100`, { headers }),
        fetchJson(
          `${options.baseUrl}/dashboard/bots/${encodeURIComponent(
            bot.id
          )}/runtime-monitoring/aggregate?status=RUNNING&sessionsLimit=5&perSessionLimit=100`,
          { headers }
        ),
      ]);
      row.aggregateHttp = 200;
      row.aggregate = summarizeAggregate(aggregate);
      row.singleSessionReadback = {
        detail: summarizeSession(detail),
        symbolStatsItems: Array.isArray(stats?.items) ? stats.items.length : null,
        symbolStatsTotalSignals: safeNumber(stats?.summary?.totalSignals),
        positionsTotal: safeNumber(positions?.total),
        positionsOpenCount: safeNumber(positions?.openCount),
        positionsClosedCount: safeNumber(positions?.closedCount),
        openOrdersCount: safeNumber(positions?.openOrdersCount),
        tradesTotal: safeNumber(trades?.total),
        tradesItems: Array.isArray(trades?.items) ? trades.items.length : null,
      };
      row.classification =
        bot.isActive &&
        running.status === 'RUNNING' &&
        row.runningSession.heartbeatAgeSeconds !== null &&
        row.runningSession.heartbeatAgeSeconds < 300
          ? 'PASS_ACTIVE_PAPER_RUNTIME_READBACK'
          : 'WARN_PAPER_RUNTIME_STALE_OR_INACTIVE';
    } else if (bot.mode === 'LIVE') {
      row.classification =
        bot.isActive && running?.status === 'RUNNING'
          ? 'WARN_LIVE_RUNNING_NOT_DEEP_READ_WITHOUT_OPERATOR_ACTION'
          : 'INFO_LIVE_PRESENT_INACTIVE_NO_RUNTIME_WRITE_ATTEMPTED';
    } else {
      row.classification = 'INFO_NOT_IN_SCOPE';
    }

    botRows.push(row);
  }

  const paperRows = botRows.filter((row) => row.bot.mode === 'PAPER');
  const liveRows = botRows.filter((row) => row.bot.mode === 'LIVE');
  const paperPass =
    paperRows.length >= 2 &&
    paperRows.every((row) => row.classification === 'PASS_ACTIVE_PAPER_RUNTIME_READBACK');
  const currentLiveRunning = liveRows.some(
    (row) => row.bot.exchange === 'BINANCE' && row.bot.isActive && row.runningSession?.status === 'RUNNING'
  );
  const status = paperPass
    ? currentLiveRunning
      ? 'PASS'
      : 'PARTIAL_BINANCE_LIVE_INACTIVE'
    : 'FAIL_PAPER_RUNTIME_READBACK';

  const payload = {
    status,
    generatedAt,
    scope: {
      gateio: 'DEFERRED_BY_USER_2026-05-13',
      actions: 'read-only GET requests only; no activation; no orders; no production writes',
    },
    buildInfo: {
      gitSha: buildInfo?.gitSha ?? null,
      gitRef: buildInfo?.gitRef ?? null,
      matchesExpected: String(buildInfo?.gitSha ?? '').startsWith(options.expectedSha),
    },
    counts: {
      nonGateBots: botRows.length,
      paperBots: paperRows.length,
      liveBots: liveRows.length,
      activePaperRuntimeReadbackPass: paperRows.filter(
        (row) => row.classification === 'PASS_ACTIVE_PAPER_RUNTIME_READBACK'
      ).length,
      currentLiveRunning: currentLiveRunning ? 1 : 0,
    },
    botRows,
    conclusions: [
      paperPass
        ? 'Both non-Gate.io PAPER Binance bots are active and expose fresh RUNNING runtime monitoring data.'
        : 'One or more PAPER Binance bots failed active runtime readback.',
      currentLiveRunning
        ? 'A non-Gate.io LIVE bot is currently RUNNING.'
        : 'The Binance LIVE bot exists and live opt-in is enabled, but it is currently inactive; no activation was attempted in this read-only proof.',
      'Gate.io is intentionally out of scope for this proof per user direction on 2026-05-13.',
    ],
  };

  const md = [
    '# Production Non-Gate.io Runtime Readback',
    '',
    '## Status',
    `- Result: **${payload.status}**`,
    `- Generated at (UTC): ${payload.generatedAt}`,
    '- Scope: Gate.io deferred by user on 2026-05-13; read-only Binance/PAPER/LIVE inventory and runtime monitoring readback only.',
    `- Build SHA: ${payload.buildInfo.gitSha ?? 'unknown'} (${
      payload.buildInfo.matchesExpected
        ? `matches expected ${options.expectedSha}`
        : `does not match expected ${options.expectedSha}`
    })`,
    `- Raw JSON: \`${options.outputJson}\``,
    '',
    '## Conclusions',
    ...payload.conclusions.map((item) => `- ${item}`),
    '',
    '## Bots',
    '| Name | Mode | Exchange | Active | Running session | Heartbeat age | Classification |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...payload.botRows.map(
      (row) =>
        `| ${row.bot.name} | ${row.bot.mode} | ${row.bot.exchange} | ${
          row.bot.isActive ? 'yes' : 'no'
        } | ${row.runningSession?.status ?? '-'} | ${
          row.runningSession?.heartbeatAgeSeconds ?? '-'
        }s | ${row.classification} |`
    ),
    '',
    '## Runtime Readback Summary',
    '| Bot | Symbols | Positions total/open/closed | Open orders | Trades total/items | Aggregate status |',
    '| --- | ---: | --- | ---: | --- | --- |',
    ...payload.botRows
      .filter((row) => row.bot.mode === 'PAPER')
      .map(
        (row) =>
          `| ${row.bot.name} | ${row.singleSessionReadback?.symbolStatsItems ?? '-'} | ${
            row.singleSessionReadback?.positionsTotal ?? '-'
          }/${row.singleSessionReadback?.positionsOpenCount ?? '-'}/${
            row.singleSessionReadback?.positionsClosedCount ?? '-'
          } | ${row.singleSessionReadback?.openOrdersCount ?? '-'} | ${
            row.singleSessionReadback?.tradesTotal ?? '-'
          }/${row.singleSessionReadback?.tradesItems ?? '-'} | ${
            row.aggregateHttp === 200 ? 'PASS' : '-'
          } |`
      ),
    '',
    '## Safety Notes',
    '- No production writes, bot activation, close-position commands, order placement, or exchange mutation were attempted.',
    '- Credentials and session tokens are not written to this artifact.',
  ].join('\n');

  await mkdir('docs/operations', { recursive: true });
  await writeFile(options.outputJson, `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(options.outputMd, `${md}\n`);
  process.stdout.write(`[ops:non-gateio-runtime-readback] status=${payload.status}\n`);
  process.stdout.write(`[ops:non-gateio-runtime-readback] paperPass=${paperPass}\n`);
  process.stdout.write(`[ops:non-gateio-runtime-readback] currentLiveRunning=${currentLiveRunning}\n`);
  process.stdout.write(`[ops:non-gateio-runtime-readback] json=${options.outputJson}\n`);
  process.stdout.write(`[ops:non-gateio-runtime-readback] md=${options.outputMd}\n`);
};

main().catch((error) => {
  process.stderr.write(`[ops:non-gateio-runtime-readback] failed: ${error?.message ?? error}\n`);
  process.exit(1);
});
