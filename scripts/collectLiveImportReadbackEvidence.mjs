#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import process from 'node:process';
import {
  buildOpsRequestHeaders,
  resolveOpsAuthLayerOptions,
} from './buildOpsRequestHeaders.mjs';
import { resolveOpsAuthToken } from './resolveOpsAuthToken.mjs';

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  if (index === -1) return '';
  return rawArgs[index + 1] ?? '';
};

const normalizeBaseUrl = (value) => String(value ?? '').trim().replace(/\/+$/, '');
const normalizeSymbol = (value) => String(value ?? '').trim().toUpperCase();
const splitCsv = (value) =>
  String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const printUsage = () => {
  process.stdout.write(
    [
      'Usage: node scripts/collectLiveImportReadbackEvidence.mjs [options]',
      '',
      'Options:',
      '  --base-url <url>             Target API base URL',
      '  --auth-token <token>         Operator JWT/session token',
      '  --auth-email <email>         Operator email for login',
      '  --auth-password <password>   Operator password for login',
      '  --ops-basic-user <user>      Optional extra OPS basic-auth user',
      '  --ops-basic-password <pass>  Optional extra OPS basic-auth password',
      '  --ops-auth-header-name <n>   Optional extra private OPS header name',
      '  --ops-auth-header-value <v>  Optional extra private OPS header value',
      '  --bot-id <id>                Bot id override; auto-discovers LIVE bots when omitted',
      '  --session-id <id>            Runtime session id override; latest RUNNING session is used when omitted',
      '  --symbols <csv>              Symbols to verify (default: ETHUSDT,DOGEUSDT)',
      '  --expected-sha <sha>         Optional expected web build-info SHA prefix',
      '  --web-base-url <url>         Web origin for build-info check',
      '  --output <path>              Optional JSON artifact path',
      '  --dry-run                    Print planned target without network calls',
      '  --help                       Show this message',
      '',
      'Env:',
      '  LIVEIMPORT_READBACK_API_BASE_URL, LIVEIMPORT_READBACK_AUTH_TOKEN,',
      '  LIVEIMPORT_READBACK_AUTH_EMAIL, LIVEIMPORT_READBACK_AUTH_PASSWORD,',
      '  LIVEIMPORT_READBACK_OPS_BASIC_USER, LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD,',
      '  LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME, LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE,',
      '  LIVEIMPORT_READBACK_BOT_ID, LIVEIMPORT_READBACK_SESSION_ID,',
      '  LIVEIMPORT_READBACK_SYMBOLS, LIVEIMPORT_READBACK_EXPECTED_SHA,',
      '  LIVEIMPORT_READBACK_WEB_BASE_URL, LIVEIMPORT_READBACK_OUTPUT',
    ].join('\n') + '\n'
  );
};

const resolveOptions = () => ({
  baseUrl: normalizeBaseUrl(
    readArgValue('--base-url') ||
      process.env.LIVEIMPORT_READBACK_API_BASE_URL ||
      'https://api.soar.luckysparrow.ch'
  ),
  webBaseUrl: normalizeBaseUrl(
    readArgValue('--web-base-url') ||
      process.env.LIVEIMPORT_READBACK_WEB_BASE_URL ||
      'https://soar.luckysparrow.ch'
  ),
  authToken: readArgValue('--auth-token') || process.env.LIVEIMPORT_READBACK_AUTH_TOKEN || '',
  authEmail: readArgValue('--auth-email') || process.env.LIVEIMPORT_READBACK_AUTH_EMAIL || '',
  authPassword:
    readArgValue('--auth-password') || process.env.LIVEIMPORT_READBACK_AUTH_PASSWORD || '',
  opsBasicUser:
    readArgValue('--ops-basic-user') || process.env.LIVEIMPORT_READBACK_OPS_BASIC_USER || '',
  opsBasicPassword:
    readArgValue('--ops-basic-password') ||
    process.env.LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD ||
    '',
  opsAuthHeaderName:
    readArgValue('--ops-auth-header-name') ||
    process.env.LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME ||
    '',
  opsAuthHeaderValue:
    readArgValue('--ops-auth-header-value') ||
    process.env.LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE ||
    '',
  botId: readArgValue('--bot-id') || process.env.LIVEIMPORT_READBACK_BOT_ID || '',
  sessionId: readArgValue('--session-id') || process.env.LIVEIMPORT_READBACK_SESSION_ID || '',
  symbols: splitCsv(
    readArgValue('--symbols') || process.env.LIVEIMPORT_READBACK_SYMBOLS || 'ETHUSDT,DOGEUSDT'
  ).map(normalizeSymbol),
  expectedSha:
    readArgValue('--expected-sha') || process.env.LIVEIMPORT_READBACK_EXPECTED_SHA || '',
  output: readArgValue('--output') || process.env.LIVEIMPORT_READBACK_OUTPUT || '',
  timeoutMs: Number.parseInt(process.env.LIVEIMPORT_READBACK_TIMEOUT_MS || '10000', 10),
  dryRun: args.has('--dry-run'),
});

const assertOptions = (options) => {
  if (!options.baseUrl) throw new Error('Missing --base-url.');
  if (!options.symbols.length) throw new Error('At least one --symbols value is required.');
};

const hashId = (value) => {
  const normalized = String(value ?? '').trim();
  if (!normalized) return null;
  return createHash('sha256').update(normalized).digest('hex').slice(0, 12);
};

const fetchJson = async (url, { headers = {}, timeoutMs = 10000 } = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
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
      payload = { raw: text.slice(0, 500) };
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

const redactBot = (bot) => ({
  idHash: hashId(bot?.id),
  nameHash: hashId(bot?.name),
  mode: bot?.mode ?? null,
  exchange: bot?.exchange ?? null,
  marketType: bot?.marketType ?? null,
  liveOptIn: bot?.liveOptIn ?? null,
  manageExternalPositions: bot?.manageExternalPositions ?? null,
  walletIdHash: hashId(bot?.walletId ?? bot?.wallet?.id),
  apiKeyIdHash: hashId(bot?.apiKeyId),
  activeMarketGroups: Array.isArray(bot?.marketGroups)
    ? bot.marketGroups.filter((group) => group?.lifecycleStatus === 'ACTIVE' && group?.isEnabled).length
    : Array.isArray(bot?.botMarketGroups)
      ? bot.botMarketGroups.filter((group) => group?.lifecycleStatus === 'ACTIVE' && group?.isEnabled).length
      : null,
});

const redactSession = (session) => ({
  idHash: hashId(session?.id),
  status: session?.status ?? null,
  startedAt: session?.startedAt ?? null,
  stoppedAt: session?.stoppedAt ?? null,
  eventsCount: session?.eventsCount ?? null,
});

const redactPosition = (position) => ({
  idHash: hashId(position?.id),
  symbol: position?.symbol ?? null,
  status: position?.status ?? null,
  side: position?.side ?? null,
  origin: position?.origin ?? null,
  managementMode: position?.managementMode ?? null,
  syncState: position?.syncState ?? null,
  continuityState: position?.continuityState ?? null,
  takeoverStatus: position?.takeoverStatus ?? null,
  strategyIdHash: hashId(position?.strategyId),
  strategyAutomationContextResolved: position?.strategyAutomationContextResolved ?? null,
  actionable: position?.actionable ?? null,
  dcaPlannedLevelsCount: Array.isArray(position?.dcaPlannedLevels)
    ? position.dcaPlannedLevels.length
    : null,
  trailingTakeProfitLevelsCount: Array.isArray(position?.trailingTakeProfitLevels)
    ? position.trailingTakeProfitLevels.length
    : null,
  trailingStopLevelsCount: Array.isArray(position?.trailingStopLevels)
    ? position.trailingStopLevels.length
    : null,
  openedAt: position?.openedAt ?? null,
});

const resolveBuildInfo = async (options) => {
  if (!options.expectedSha.trim()) return null;
  const payload = await fetchJson(`${options.webBaseUrl}/api/build-info`, {
    timeoutMs: options.timeoutMs,
  });
  const gitSha = String(payload?.gitSha ?? '').trim();
  return {
    gitSha,
    gitRef: payload?.gitRef ?? null,
    matchesExpected: gitSha.startsWith(options.expectedSha.trim()),
  };
};

const discoverBots = async (options, headers) => {
  if (options.botId.trim()) {
    const bot = await fetchJson(`${options.baseUrl}/dashboard/bots/${encodeURIComponent(options.botId.trim())}`, {
      headers,
      timeoutMs: options.timeoutMs,
    });
    return [bot];
  }
  const bots = await fetchJson(`${options.baseUrl}/dashboard/bots?marketType=FUTURES`, {
    headers,
    timeoutMs: options.timeoutMs,
  });
  if (!Array.isArray(bots)) throw new Error('Expected /dashboard/bots to return an array.');
  return bots.filter((bot) => bot?.mode === 'LIVE');
};

const resolveSession = async (options, headers, botId) => {
  if (options.sessionId.trim()) {
    return fetchJson(
      `${options.baseUrl}/dashboard/bots/${encodeURIComponent(botId)}/runtime-sessions/${encodeURIComponent(
        options.sessionId.trim()
      )}`,
      { headers, timeoutMs: options.timeoutMs }
    );
  }
  const sessions = await fetchJson(
    `${options.baseUrl}/dashboard/bots/${encodeURIComponent(botId)}/runtime-sessions?status=RUNNING&limit=1`,
    { headers, timeoutMs: options.timeoutMs }
  );
  if (!Array.isArray(sessions) || sessions.length === 0) return null;
  return sessions[0];
};

const collectSymbolPositions = async (options, headers, botId, sessionId) => {
  const bySymbol = [];
  for (const symbol of options.symbols) {
    const url = `${options.baseUrl}/dashboard/bots/${encodeURIComponent(
      botId
    )}/runtime-sessions/${encodeURIComponent(sessionId)}/positions?symbol=${encodeURIComponent(symbol)}&limit=50`;
    // eslint-disable-next-line no-await-in-loop
    const payload = await fetchJson(url, { headers, timeoutMs: options.timeoutMs });
    const openItems = Array.isArray(payload?.openItems) ? payload.openItems : [];
    bySymbol.push({
      symbol,
      total: payload?.total ?? null,
      openCount: payload?.openCount ?? null,
      closedCount: payload?.closedCount ?? null,
      openOrdersCount: payload?.openOrdersCount ?? null,
      showDynamicStopColumns: payload?.showDynamicStopColumns ?? null,
      openItems: openItems.map(redactPosition),
      importCompleteness: openItems.length > 0 ? 'VISIBLE' : 'MISSING_FROM_RUNTIME_READBACK',
    });
  }
  return bySymbol;
};

const main = async () => {
  if (args.has('--help') || args.has('-h')) {
    printUsage();
    return;
  }

  const options = resolveOptions();
  assertOptions(options);

  if (options.dryRun) {
    process.stdout.write(
      JSON.stringify(
        {
          baseUrl: options.baseUrl,
          webBaseUrl: options.webBaseUrl,
          botIdProvided: Boolean(options.botId.trim()),
          sessionIdProvided: Boolean(options.sessionId.trim()),
          symbols: options.symbols,
          expectedShaProvided: Boolean(options.expectedSha.trim()),
          outputProvided: Boolean(options.output.trim()),
        },
        null,
        2
      ) + '\n'
    );
    return;
  }

  const authLayer = resolveOpsAuthLayerOptions({
    opsAuthHeaderName: options.opsAuthHeaderName,
    opsAuthHeaderValue: options.opsAuthHeaderValue,
    opsBasicUser: options.opsBasicUser,
    opsBasicPassword: options.opsBasicPassword,
  });
  const resolvedAuth = await resolveOpsAuthToken({
    baseUrl: options.baseUrl,
    authToken: options.authToken,
    authEmail: options.authEmail,
    authPassword: options.authPassword,
    ...authLayer,
    contextLabel: 'ops:liveimport:readback',
  });
  if (!resolvedAuth.token) {
    throw new Error('Missing read-only production auth token or login credentials.');
  }

  const headers = buildOpsRequestHeaders({
    token: resolvedAuth.token,
    ...authLayer,
  });
  const buildInfo = await resolveBuildInfo(options);
  if (buildInfo && !buildInfo.matchesExpected) {
    throw new Error(`Production build-info SHA mismatch: saw ${buildInfo.gitSha || 'n/a'}`);
  }

  const bots = await discoverBots(options, headers);
  const entries = [];
  for (const bot of bots) {
    if (!bot?.id) continue;
    // eslint-disable-next-line no-await-in-loop
    const session = await resolveSession(options, headers, bot.id);
    if (!session?.id) {
      entries.push({
        bot: redactBot(bot),
        session: null,
        symbols: [],
        status: 'NO_RUNNING_SESSION',
      });
      continue;
    }
    // eslint-disable-next-line no-await-in-loop
    const symbols = await collectSymbolPositions(options, headers, bot.id, session.id);
    entries.push({
      bot: redactBot(bot),
      session: redactSession(session),
      symbols,
      status: symbols.every((item) => item.importCompleteness === 'VISIBLE') ? 'PASS' : 'REVIEW',
    });
  }

  const evidence = {
    generatedAt: new Date().toISOString(),
    target: {
      baseUrl: options.baseUrl,
      webBaseUrl: options.webBaseUrl,
      expectedSha: options.expectedSha.trim() || null,
      buildInfo,
      symbols: options.symbols,
    },
    auth: {
      source: resolvedAuth.source,
      tokenCaptured: false,
    },
    entries,
    summary: {
      botsChecked: entries.length,
      botsWithRuntimeReadback: entries.filter((entry) => entry.symbols.length > 0).length,
      botsWithoutRunningSession: entries.filter((entry) => entry.status === 'NO_RUNNING_SESSION').length,
      symbolsExpected: options.symbols.length,
      symbolsVisible: Array.from(
        new Set(
          entries.flatMap((entry) =>
            entry.symbols
              .filter((symbol) => symbol.importCompleteness === 'VISIBLE')
              .map((symbol) => symbol.symbol)
          )
        )
      ),
      missingSymbols: entries.flatMap((entry) =>
        entry.symbols
          .filter((symbol) => symbol.importCompleteness !== 'VISIBLE')
          .map((symbol) => symbol.symbol)
      ),
    },
  };

  const output = JSON.stringify(evidence, null, 2);
  process.stdout.write(output + '\n');
  if (options.output.trim()) {
    await writeFile(options.output.trim(), output + '\n', 'utf8');
    process.stdout.write(`[ops:liveimport:readback] wrote ${options.output.trim()}\n`);
  }

  if (evidence.entries.length === 0) {
    throw new Error('No LIVE bots were available for readback.');
  }
  if (evidence.summary.botsWithRuntimeReadback === 0) {
    throw new Error('No runtime positions readback was collected from a RUNNING session.');
  }
  const missingExpectedSymbols = options.symbols.filter(
    (symbol) => !evidence.summary.symbolsVisible.includes(symbol)
  );
  if (missingExpectedSymbols.length > 0) {
    throw new Error(`Missing runtime readback for symbols: ${missingExpectedSymbols.join(', ')}`);
  }
};

main().catch((error) => {
  console.error(
    '[ops:liveimport:readback] failed:',
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
