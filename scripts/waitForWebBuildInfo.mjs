#!/usr/bin/env node

const rawArgs = process.argv.slice(2);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  if (index === -1) return '';
  return rawArgs[index + 1] ?? '';
};

const hasFlag = (flag) => rawArgs.includes(flag);

const printUsage = () => {
  console.log(
    [
      'Usage: node scripts/waitForWebBuildInfo.mjs --web-base-url <url> --expected-sha <sha> [options]',
      '',
      'Options:',
      '  --web-base-url <url>        Web origin that exposes /api/build-info',
      '  --build-info-url <url>      Exact build-info URL override',
      '  --expected-sha <sha>        Expected git SHA prefix or full SHA',
      '  --timeout-seconds <number>  Overall timeout (default: 900)',
      '  --interval-seconds <number> Poll interval (default: 15)',
      '  --request-timeout-ms <num>  Per-request timeout (default: 10000)',
      '  --help                     Show this message',
    ].join('\n')
  );
};

const toPositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeBaseUrl = (value) => value.trim().replace(/\/+$/, '');

const resolveOptions = () => {
  if (hasFlag('--help') || hasFlag('-h')) {
    return { help: true };
  }

  const webBaseUrl = normalizeBaseUrl(
    readArgValue('--web-base-url') || process.env.WEB_BUILD_INFO_BASE_URL || ''
  );
  const buildInfoUrl =
    readArgValue('--build-info-url') ||
    process.env.WEB_BUILD_INFO_URL ||
    (webBaseUrl ? `${webBaseUrl}/api/build-info` : '');
  const expectedSha = (
    readArgValue('--expected-sha') ||
    process.env.WEB_BUILD_INFO_EXPECTED_SHA ||
    ''
  ).trim();

  return {
    help: false,
    buildInfoUrl,
    expectedSha,
    timeoutSeconds: toPositiveInteger(
      readArgValue('--timeout-seconds') || process.env.WEB_BUILD_INFO_TIMEOUT_SECONDS,
      900
    ),
    intervalSeconds: toPositiveInteger(
      readArgValue('--interval-seconds') || process.env.WEB_BUILD_INFO_INTERVAL_SECONDS,
      15
    ),
    requestTimeoutMs: toPositiveInteger(
      readArgValue('--request-timeout-ms') || process.env.WEB_BUILD_INFO_REQUEST_TIMEOUT_MS,
      10000
    ),
  };
};

const fetchJsonWithTimeout = async (url, timeoutMs) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
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
    return {
      ok: response.ok,
      status: response.status,
      payload,
    };
  } finally {
    clearTimeout(timer);
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async () => {
  const options = resolveOptions();
  if (options.help) {
    printUsage();
    return;
  }

  if (!options.buildInfoUrl) {
    throw new Error('Missing --web-base-url or --build-info-url.');
  }
  if (!options.expectedSha) {
    throw new Error('Missing --expected-sha.');
  }

  const deadlineMs = Date.now() + options.timeoutSeconds * 1000;
  let attempt = 0;
  let lastSeenSha = null;
  let lastError = null;

  while (Date.now() <= deadlineMs) {
    attempt += 1;
    try {
      const result = await fetchJsonWithTimeout(options.buildInfoUrl, options.requestTimeoutMs);
      const gitSha =
        typeof result.payload?.gitSha === 'string' && result.payload.gitSha.trim().length > 0
          ? result.payload.gitSha.trim()
          : null;
      lastSeenSha = gitSha;
      lastError = null;
      console.log(
        `[wait:web-build-info] attempt=${attempt} status=${result.status} gitSha=${gitSha ?? 'n/a'} expected=${options.expectedSha}`
      );
      if (result.ok && gitSha?.startsWith(options.expectedSha)) {
        console.log('[wait:web-build-info] PASS');
        return;
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      console.log(`[wait:web-build-info] attempt=${attempt} error=${lastError}`);
    }

    const remainingMs = deadlineMs - Date.now();
    if (remainingMs <= 0) break;
    await sleep(Math.min(options.intervalSeconds * 1000, remainingMs));
  }

  throw new Error(
    `Timed out waiting for ${options.buildInfoUrl} to expose ${options.expectedSha}; lastSeenSha=${lastSeenSha ?? 'n/a'} lastError=${lastError ?? 'n/a'}`
  );
};

main().catch((error) => {
  console.error('[wait:web-build-info] failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
