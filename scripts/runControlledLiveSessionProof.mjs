#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import process from 'node:process';
import {
  buildOpsRequestHeaders,
  resolveOpsAuthLayerOptions,
} from './buildOpsRequestHeaders.mjs';
import { resolveOpsAuthToken } from './resolveOpsAuthToken.mjs';

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);

const normalizeBaseUrl = (value) => String(value ?? '').trim().replace(/\/+$/, '');
const normalizeSymbol = (value) => String(value ?? '').trim().toUpperCase();
const splitCsv = (value) =>
  String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  if (index === -1) return '';
  return rawArgs[index + 1] ?? '';
};

const printUsage = () => {
  process.stdout.write(
    [
      'Usage: node scripts/runControlledLiveSessionProof.mjs [options]',
      '',
      'This command is a guarded operator runner for a short LIVE runtime-session proof.',
      'It refuses to activate a LIVE bot unless protected readiness reports both no-order',
      'guard flags active and --i-understand-live-risk is present.',
      '',
      'Options:',
      '  --base-url <url>                 Target API base URL',
      '  --web-base-url <url>             Web origin for build-info check',
      '  --auth-token <token>             Operator JWT/session token',
      '  --auth-email <email>             Operator email for login',
      '  --auth-password <password>       Operator password for login',
      '  --ops-basic-user <user>          Optional extra OPS basic-auth user',
      '  --ops-basic-password <pass>      Optional extra OPS basic-auth password',
      '  --ops-auth-header-name <n>       Optional extra private OPS header name',
      '  --ops-auth-header-value <v>      Optional extra private OPS header value',
      '  --bot-id <id>                    LIVE bot id override; otherwise exactly one LIVE Futures bot is required',
      '  --symbols <csv>                  Symbols to verify (default: ETHUSDT,DOGEUSDT)',
      '  --expected-sha <sha>             Optional expected web build-info SHA prefix',
      '  --output <path>                  JSON artifact path for LIVEIMPORT-03 collector',
      '  --simultaneous-readback-output-json <path>',
      '                                   Optional JSON artifact path for PAPER+LIVE read-only runtime readback while LIVE is active',
      '  --simultaneous-readback-output-md <path>',
      '                                   Optional Markdown artifact path for PAPER+LIVE read-only runtime readback while LIVE is active',
      '  --poll-seconds <n>               Running-session wait window (default: 180)',
      '  --poll-interval-ms <n>           Poll interval (default: 5000)',
      '  --dry-run                        Print a redacted plan without network calls or activation',
      '  --i-understand-live-risk         Required for the actual activation step',
      '  --help                           Show this message',
      '',
      'Env:',
      '  CONTROLLED_LIVE_PROOF_API_BASE_URL, CONTROLLED_LIVE_PROOF_WEB_BASE_URL,',
      '  CONTROLLED_LIVE_PROOF_AUTH_TOKEN, CONTROLLED_LIVE_PROOF_AUTH_EMAIL,',
      '  CONTROLLED_LIVE_PROOF_AUTH_PASSWORD, CONTROLLED_LIVE_PROOF_OPS_BASIC_USER,',
      '  CONTROLLED_LIVE_PROOF_OPS_BASIC_PASSWORD, CONTROLLED_LIVE_PROOF_OPS_AUTH_HEADER_NAME,',
      '  CONTROLLED_LIVE_PROOF_OPS_AUTH_HEADER_VALUE, CONTROLLED_LIVE_PROOF_BOT_ID,',
      '  CONTROLLED_LIVE_PROOF_SYMBOLS, CONTROLLED_LIVE_PROOF_EXPECTED_SHA,',
      '  CONTROLLED_LIVE_PROOF_OUTPUT, CONTROLLED_LIVE_PROOF_POLL_SECONDS,',
      '  CONTROLLED_LIVE_PROOF_POLL_INTERVAL_MS,',
      '  CONTROLLED_LIVE_PROOF_SIMULTANEOUS_OUTPUT_JSON,',
      '  CONTROLLED_LIVE_PROOF_SIMULTANEOUS_OUTPUT_MD',
    ].join('\n') + '\n'
  );
};

const resolveOptions = () => ({
  baseUrl: normalizeBaseUrl(
    readArgValue('--base-url') ||
      process.env.CONTROLLED_LIVE_PROOF_API_BASE_URL ||
      'https://api.soar.luckysparrow.ch'
  ),
  webBaseUrl: normalizeBaseUrl(
    readArgValue('--web-base-url') ||
      process.env.CONTROLLED_LIVE_PROOF_WEB_BASE_URL ||
      'https://soar.luckysparrow.ch'
  ),
  authToken:
    readArgValue('--auth-token') || process.env.CONTROLLED_LIVE_PROOF_AUTH_TOKEN || '',
  authEmail:
    readArgValue('--auth-email') || process.env.CONTROLLED_LIVE_PROOF_AUTH_EMAIL || '',
  authPassword:
    readArgValue('--auth-password') ||
    process.env.CONTROLLED_LIVE_PROOF_AUTH_PASSWORD ||
    '',
  opsBasicUser:
    readArgValue('--ops-basic-user') ||
    process.env.CONTROLLED_LIVE_PROOF_OPS_BASIC_USER ||
    '',
  opsBasicPassword:
    readArgValue('--ops-basic-password') ||
    process.env.CONTROLLED_LIVE_PROOF_OPS_BASIC_PASSWORD ||
    '',
  opsAuthHeaderName:
    readArgValue('--ops-auth-header-name') ||
    process.env.CONTROLLED_LIVE_PROOF_OPS_AUTH_HEADER_NAME ||
    '',
  opsAuthHeaderValue:
    readArgValue('--ops-auth-header-value') ||
    process.env.CONTROLLED_LIVE_PROOF_OPS_AUTH_HEADER_VALUE ||
    '',
  botId: readArgValue('--bot-id') || process.env.CONTROLLED_LIVE_PROOF_BOT_ID || '',
  symbols: splitCsv(
    readArgValue('--symbols') ||
      process.env.CONTROLLED_LIVE_PROOF_SYMBOLS ||
      'ETHUSDT,DOGEUSDT'
  ).map(normalizeSymbol),
  expectedSha:
    readArgValue('--expected-sha') ||
    process.env.CONTROLLED_LIVE_PROOF_EXPECTED_SHA ||
    '',
  output:
    readArgValue('--output') ||
    process.env.CONTROLLED_LIVE_PROOF_OUTPUT ||
    '',
  simultaneousReadbackOutputJson:
    readArgValue('--simultaneous-readback-output-json') ||
    process.env.CONTROLLED_LIVE_PROOF_SIMULTANEOUS_OUTPUT_JSON ||
    '',
  simultaneousReadbackOutputMd:
    readArgValue('--simultaneous-readback-output-md') ||
    process.env.CONTROLLED_LIVE_PROOF_SIMULTANEOUS_OUTPUT_MD ||
    '',
  pollSeconds: Number.parseInt(
    readArgValue('--poll-seconds') ||
      process.env.CONTROLLED_LIVE_PROOF_POLL_SECONDS ||
      '180',
    10
  ),
  pollIntervalMs: Number.parseInt(
    readArgValue('--poll-interval-ms') ||
      process.env.CONTROLLED_LIVE_PROOF_POLL_INTERVAL_MS ||
      '5000',
    10
  ),
  timeoutMs: Number.parseInt(process.env.CONTROLLED_LIVE_PROOF_TIMEOUT_MS || '10000', 10),
  dryRun: args.has('--dry-run'),
  understandsLiveRisk: args.has('--i-understand-live-risk'),
});

const assertOptions = (options) => {
  if (!options.baseUrl) throw new Error('Missing --base-url.');
  if (!options.webBaseUrl) throw new Error('Missing --web-base-url.');
  if (!options.symbols.length) throw new Error('At least one --symbols value is required.');
  if (!Number.isFinite(options.pollSeconds) || options.pollSeconds < 5) {
    throw new Error('--poll-seconds must be at least 5.');
  }
  if (!Number.isFinite(options.pollIntervalMs) || options.pollIntervalMs < 1000) {
    throw new Error('--poll-interval-ms must be at least 1000.');
  }
};

const hashId = (value) => {
  const normalized = String(value ?? '').trim();
  if (!normalized) return null;
  return createHash('sha256').update(normalized).digest('hex').slice(0, 12);
};

const redactBot = (bot) => ({
  idHash: hashId(bot?.id),
  nameHash: hashId(bot?.name),
  mode: bot?.mode ?? null,
  exchange: bot?.exchange ?? null,
  marketType: bot?.marketType ?? null,
  isActive: bot?.isActive ?? null,
  liveOptIn: bot?.liveOptIn ?? null,
  manageExternalPositions: bot?.manageExternalPositions ?? null,
  apiKeyIdHash: hashId(bot?.apiKeyId),
});

const fetchJson = async (
  url,
  { method = 'GET', headers = {}, body, timeoutMs = 10000 } = {}
) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
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
      throw new Error(`${method} ${url} failed with HTTP ${response.status}: ${message}`);
    }
    return payload;
  } finally {
    clearTimeout(timer);
  }
};

const resolveBuildInfo = async (options) => {
  const payload = await fetchJson(`${options.webBaseUrl}/api/build-info`, {
    timeoutMs: options.timeoutMs,
  });
  const gitSha = String(payload?.gitSha ?? '').trim();
  const expectedSha = options.expectedSha.trim();
  const matchesExpected = expectedSha ? gitSha.startsWith(expectedSha) : true;
  return {
    gitSha,
    gitRef: payload?.gitRef ?? null,
    expectedSha: expectedSha || null,
    matchesExpected,
  };
};

const assertNoOrderGuardActive = async (options, headers) => {
  const payload = await fetchJson(`${options.baseUrl}/ready/details`, {
    headers,
    timeoutMs: options.timeoutMs,
  });
  const guard = payload?.runtimeSafety?.liveNoOrderGuard;
  const globalKillSwitch = guard?.globalKillSwitch === true;
  const emergencyStop = guard?.emergencyStop === true;
  const active = guard?.active === true;
  if (!globalKillSwitch || !emergencyStop || !active) {
    throw new Error(
      'LIVE no-order guard is not fully active on /ready/details. Required: globalKillSwitch=true, emergencyStop=true, active=true.'
    );
  }
  return { globalKillSwitch, emergencyStop, active };
};

const discoverTargetBot = async (options, headers) => {
  if (options.botId.trim()) {
    return fetchJson(`${options.baseUrl}/dashboard/bots/${encodeURIComponent(options.botId.trim())}`, {
      headers,
      timeoutMs: options.timeoutMs,
    });
  }

  const bots = await fetchJson(`${options.baseUrl}/dashboard/bots?marketType=FUTURES`, {
    headers,
    timeoutMs: options.timeoutMs,
  });
  if (!Array.isArray(bots)) throw new Error('Expected /dashboard/bots to return an array.');
  const liveBots = bots.filter((bot) => bot?.mode === 'LIVE');
  if (liveBots.length !== 1) {
    throw new Error(
      `Expected exactly one LIVE Futures bot when --bot-id is omitted; found ${liveBots.length}.`
    );
  }
  return liveBots[0];
};

const assertTargetBotSafe = (bot) => {
  if (!bot?.id) throw new Error('Resolved bot has no id.');
  if (bot.mode !== 'LIVE') throw new Error('Target bot is not a LIVE bot.');
  if (bot.marketType !== 'FUTURES') throw new Error('Target bot is not a Futures bot.');
  if (bot.liveOptIn !== true) throw new Error('Target bot does not have liveOptIn=true.');
  if (!bot.consentTextVersion) {
    throw new Error('Target bot does not have a live consent text version.');
  }
  if (bot.manageExternalPositions !== true) {
    throw new Error('Target bot does not have manageExternalPositions=true.');
  }
  if (bot.isActive === true) {
    throw new Error('Target bot is already active; refusing to take over an existing LIVE session.');
  }
};

const buildBotActiveStatePayload = (bot, isActive) => ({
  name: bot.name,
  walletId: bot.walletId ?? null,
  strategyId: bot.strategyId ?? null,
  isActive,
  liveOptIn: bot.liveOptIn,
  manageExternalPositions: bot.manageExternalPositions,
  consentTextVersion: bot.consentTextVersion,
});

const updateBotActiveState = async (options, headers, bot, isActive) =>
  fetchJson(`${options.baseUrl}/dashboard/bots/${encodeURIComponent(bot.id)}`, {
    method: 'PUT',
    headers,
    body: buildBotActiveStatePayload(bot, isActive),
    timeoutMs: options.timeoutMs,
  });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const listRunningSessions = async (options, headers, botId) => {
  const sessions = await fetchJson(
    `${options.baseUrl}/dashboard/bots/${encodeURIComponent(botId)}/runtime-sessions?status=RUNNING&limit=1`,
    { headers, timeoutMs: options.timeoutMs }
  );
  if (!Array.isArray(sessions)) throw new Error('Expected runtime-sessions to return an array.');
  return sessions;
};

const waitForRunningSession = async (options, headers, botId) => {
  const deadline = Date.now() + options.pollSeconds * 1000;
  while (Date.now() <= deadline) {
    // eslint-disable-next-line no-await-in-loop
    const sessions = await listRunningSessions(options, headers, botId);
    if (sessions[0]?.id) return sessions[0];
    // eslint-disable-next-line no-await-in-loop
    await sleep(options.pollIntervalMs);
  }
  throw new Error(`No RUNNING runtime session appeared within ${options.pollSeconds} seconds.`);
};

const runCollector = (options, token, botId, sessionId) =>
  new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        'scripts/collectLiveImportReadbackEvidence.mjs',
        '--base-url',
        options.baseUrl,
        '--web-base-url',
        options.webBaseUrl,
        '--bot-id',
        botId,
        '--session-id',
        sessionId,
        '--symbols',
        options.symbols.join(','),
        ...(options.expectedSha.trim() ? ['--expected-sha', options.expectedSha.trim()] : []),
        ...(options.output.trim() ? ['--output', options.output.trim()] : []),
      ],
      {
        stdio: 'inherit',
        env: {
          ...process.env,
          LIVEIMPORT_READBACK_AUTH_TOKEN: token,
          LIVEIMPORT_READBACK_OPS_BASIC_USER: options.opsBasicUser,
          LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD: options.opsBasicPassword,
          LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME: options.opsAuthHeaderName,
          LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE: options.opsAuthHeaderValue,
        },
      }
    );

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`LIVEIMPORT-03 collector exited with code ${code}.`));
    });
  });

const runSimultaneousRuntimeReadback = (options, token) => {
  if (!options.simultaneousReadbackOutputJson.trim() && !options.simultaneousReadbackOutputMd.trim()) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['scripts/collectNonGateioRuntimeReadback.mjs'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NON_GATEIO_READBACK_API_BASE_URL: options.baseUrl,
        NON_GATEIO_READBACK_WEB_BASE_URL: options.webBaseUrl,
        NON_GATEIO_READBACK_AUTH_TOKEN: token,
        NON_GATEIO_READBACK_EXPECTED_SHA: options.expectedSha,
        NON_GATEIO_READBACK_OUTPUT_JSON: options.simultaneousReadbackOutputJson,
        NON_GATEIO_READBACK_OUTPUT_MD: options.simultaneousReadbackOutputMd,
      },
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`Simultaneous PAPER+LIVE runtime readback exited with code ${code}.`));
    });
  });
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
          mode: 'dry-run',
          baseUrl: options.baseUrl,
          webBaseUrl: options.webBaseUrl,
          botIdProvided: Boolean(options.botId.trim()),
          symbols: options.symbols,
          expectedShaProvided: Boolean(options.expectedSha.trim()),
          outputProvided: Boolean(options.output.trim()),
          simultaneousReadbackOutputJsonProvided: Boolean(
            options.simultaneousReadbackOutputJson.trim()
          ),
          simultaneousReadbackOutputMdProvided: Boolean(options.simultaneousReadbackOutputMd.trim()),
          pollSeconds: options.pollSeconds,
          pollIntervalMs: options.pollIntervalMs,
          understandsLiveRisk: options.understandsLiveRisk,
          liveActivationWillRun: false,
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
    contextLabel: 'ops:live:controlled-proof',
  });
  if (!resolvedAuth.token) {
    throw new Error(
      'Missing controlled LIVE proof auth. Provide CONTROLLED_LIVE_PROOF_AUTH_TOKEN, or CONTROLLED_LIVE_PROOF_AUTH_EMAIL plus CONTROLLED_LIVE_PROOF_AUTH_PASSWORD.'
    );
  }
  const headers = buildOpsRequestHeaders({
    token: resolvedAuth.token,
    ...authLayer,
  });

  const buildInfo = await resolveBuildInfo(options);
  if (!buildInfo.matchesExpected) {
    throw new Error(`Production build-info SHA mismatch: saw ${buildInfo.gitSha || 'n/a'}.`);
  }

  const guard = await assertNoOrderGuardActive(options, headers);
  const bot = await discoverTargetBot(options, headers);
  assertTargetBotSafe(bot);
  const plan = {
    baseUrl: options.baseUrl,
    webBaseUrl: options.webBaseUrl,
    buildInfo,
    guard,
    bot: redactBot(bot),
    symbols: options.symbols,
    output: options.output.trim() || null,
    pollSeconds: options.pollSeconds,
  };
  process.stdout.write(JSON.stringify({ controlledLiveProofPlan: plan }, null, 2) + '\n');

  if (!options.understandsLiveRisk) {
    throw new Error(
      'Refusing to activate LIVE bot without --i-understand-live-risk. Review the redacted plan above first.'
    );
  }

  let activated = false;
  try {
    process.stdout.write('[ops:live:controlled-proof] activating target LIVE bot\n');
    await updateBotActiveState(options, headers, bot, true);
    activated = true;
    const session = await waitForRunningSession(options, headers, bot.id);
    process.stdout.write(
      `[ops:live:controlled-proof] running session detected: ${hashId(session.id)}\n`
    );
    await runCollector(options, resolvedAuth.token, bot.id, session.id);
    await runSimultaneousRuntimeReadback(options, resolvedAuth.token);
  } finally {
    if (activated) {
      try {
        process.stdout.write('[ops:live:controlled-proof] deactivating target LIVE bot\n');
        await updateBotActiveState(options, headers, bot, false);
      } catch (error) {
        console.error(
          '[ops:live:controlled-proof] CRITICAL: failed to deactivate target LIVE bot:',
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  }
};

main().catch((error) => {
  console.error(
    '[ops:live:controlled-proof] failed:',
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
