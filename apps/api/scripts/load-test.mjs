#!/usr/bin/env node

import { pathToFileURL } from 'node:url';

export const defaultsByMode = {
  baseline: {
    durationMs: 30_000,
    concurrency: 20,
    maxErrorRate: 0.02,
  },
  stress: {
    durationMs: 60_000,
    concurrency: 60,
    maxErrorRate: 0.05,
  },
};

export const buildLoadTestConfig = (argv = process.argv.slice(2), env = process.env) => {
  const mode = argv[0] ?? 'baseline';
  if (!(mode in defaultsByMode)) {
    throw new Error(`Unsupported mode "${mode}". Use "baseline" or "stress".`);
  }

  const modeDefaults = defaultsByMode[mode];
  const durationMs = parseInt(env.LOAD_TEST_DURATION_MS ?? `${modeDefaults.durationMs}`, 10);
  const concurrency = parseInt(env.LOAD_TEST_CONCURRENCY ?? `${modeDefaults.concurrency}`, 10);
  const timeoutMs = parseInt(env.LOAD_TEST_TIMEOUT_MS ?? '5000', 10);
  const maxErrorRate = parseFloat(env.LOAD_TEST_MAX_ERROR_RATE ?? `${modeDefaults.maxErrorRate}`);
  const targetUrl = (env.LOAD_TEST_TARGET_URL ?? 'http://localhost:3001').replace(/\/$/, '');
  const paths = (env.LOAD_TEST_PATHS ?? '/health,/ready,/metrics,/workers/health')
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean);

  if (!Number.isFinite(durationMs) || durationMs <= 0 || !Number.isFinite(concurrency) || concurrency <= 0) {
    throw new Error('Invalid duration or concurrency value.');
  }

  if (paths.length === 0) {
    throw new Error('At least one path is required.');
  }

  return { mode, durationMs, concurrency, timeoutMs, maxErrorRate, targetUrl, paths };
};

export const runWorker = async ({
  result,
  paths,
  targetUrl,
  timeoutMs,
  shouldContinue,
  nextPathIndex,
  fetchImpl = fetch,
  now = Date.now,
}) => {
  while (shouldContinue()) {
    const path = paths[nextPathIndex() % paths.length];
    const url = `${targetUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const requestStart = now();
    result.totals.requests += 1;

    try {
      const response = await fetchImpl(url, {
        signal: AbortSignal.timeout(timeoutMs),
      });

      const latency = now() - requestStart;
      result.latenciesMs.push(latency);
      const key = `${response.status}`;
      result.statusCodes[key] = (result.statusCodes[key] ?? 0) + 1;

      if (response.ok) {
        result.totals.successes += 1;
      } else {
        result.totals.failures += 1;
      }
    } catch (error) {
      const latency = now() - requestStart;
      result.latenciesMs.push(latency);
      result.totals.failures += 1;
      if (error instanceof Error && error.name === 'TimeoutError') {
        result.totals.timeoutFailures += 1;
      }
    }
  }
};

export const percentile = (values, p) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[index];
};

export const main = async () => {
  const config = buildLoadTestConfig();
  const result = {
    startedAt: new Date().toISOString(),
    mode: config.mode,
    durationMs: config.durationMs,
    concurrency: config.concurrency,
    targetUrl: config.targetUrl,
    totals: {
      requests: 0,
      successes: 0,
      failures: 0,
      timeoutFailures: 0,
    },
    statusCodes: {},
    latenciesMs: [],
  };

  const startedAt = Date.now();
  let pathIndex = 0;
  const workers = Array.from({ length: config.concurrency }, () =>
    runWorker({
      result,
      paths: config.paths,
      targetUrl: config.targetUrl,
      timeoutMs: config.timeoutMs,
      shouldContinue: () => Date.now() - startedAt < config.durationMs,
      nextPathIndex: () => {
        const current = pathIndex;
        pathIndex += 1;
        return current;
      },
    })
  );
  await Promise.all(workers);

  const totalRuntimeMs = Date.now() - startedAt;
  const errorRate = result.totals.requests === 0 ? 1 : result.totals.failures / result.totals.requests;
  const requestsPerSecond = result.totals.requests / Math.max(totalRuntimeMs / 1000, 1);

  const summary = {
    startedAt: result.startedAt,
    mode: result.mode,
    durationMs: result.durationMs,
    concurrency: result.concurrency,
    targetUrl: result.targetUrl,
    totals: result.totals,
    statusCodes: result.statusCodes,
    finishedAt: new Date().toISOString(),
    runtimeMs: totalRuntimeMs,
    throughputRps: Number(requestsPerSecond.toFixed(2)),
    errorRate: Number(errorRate.toFixed(4)),
    latency: {
      minMs: result.latenciesMs.length ? Math.min(...result.latenciesMs) : 0,
      p50Ms: percentile(result.latenciesMs, 50),
      p95Ms: percentile(result.latenciesMs, 95),
      p99Ms: percentile(result.latenciesMs, 99),
      maxMs: result.latenciesMs.length ? Math.max(...result.latenciesMs) : 0,
    },
  };

  console.log(JSON.stringify(summary, null, 2));

  if (summary.errorRate > config.maxErrorRate) {
    console.error(
      `Load test failed: error rate ${summary.errorRate} exceeded threshold ${config.maxErrorRate}.`
    );
    process.exit(1);
  }
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await main();
}
