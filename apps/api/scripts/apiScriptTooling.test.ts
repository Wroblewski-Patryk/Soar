import { describe, expect, it } from 'vitest';
import {
  buildRunInputs,
  percentile as assistantPercentile,
  run as runAssistantLoadBenchmark,
} from './assistant-load-benchmark';
import {
  inferBaseCurrencyFromSymbol,
  normalizeBaseCurrency,
  normalizeExchange,
  normalizeMarketType,
  run as runBackfillBacktestVenueContext,
} from './backfillBacktestVenueContext';
import {
  buildArtifactDir,
  nowStamp,
  renderMarkdown as renderBotV2PreflightMarkdown,
  toIso as botV2ToIso,
  main as runBotV2PreflightReport,
} from './bot-v2-preflight-report';
import { toIso as snapshotToIso, main as runExportPaperRuntimeSnapshot } from './exportPaperRuntimeSnapshot';
import { buildMarkdown, normalizeOutputPath, run as runGateioMarketStreamSourceSmoke } from './gateioMarketStreamSourceSmoke';
import { ensureUser, main as runImportPaperRuntimeSnapshot } from './importPaperRuntimeSnapshot';
import { readCount, toStamp, main as runVerifyWalletDbFoundation } from './verifyWalletDbFoundation';

describe('API script tooling helpers', () => {
  it('builds assistant load inputs and percentile thresholds deterministically', () => {
    const inputs = buildRunInputs();

    expect(inputs).toHaveLength(1200);
    expect(inputs[0]).toMatchObject({
      requestId: 'bench-1-b1-g1-s1',
      userId: 'load-user-1',
      botId: 'load-bot-1',
      symbol: 'SYM11USDT',
      mode: 'BACKTEST',
    });
    expect(assistantPercentile([10, 40, 20, 30], 95)).toBe(40);
    expect(typeof runAssistantLoadBenchmark).toBe('function');
  });

  it('normalizes backtest venue context values without database access', () => {
    expect(normalizeExchange(' binance ')).toBe('BINANCE');
    expect(normalizeExchange('unknown')).toBeNull();
    expect(normalizeMarketType('FUTURES')).toBe('FUTURES');
    expect(normalizeMarketType('MARGIN')).toBeNull();
    expect(normalizeBaseCurrency(' usdc ')).toBe('USDC');
    expect(normalizeBaseCurrency('')).toBeNull();
    expect(inferBaseCurrencyFromSymbol('ETHUSDT')).toBe('USDT');
    expect(inferBaseCurrencyFromSymbol('BTCUSD')).toBe('USD');
    expect(typeof runBackfillBacktestVenueContext).toBe('function');
  });

  it('renders bot v2 preflight artifacts from plain report data', () => {
    const date = new Date('2026-06-05T12:34:56.000Z');
    const markdown = renderBotV2PreflightMarkdown({
      generatedAt: botV2ToIso(date),
      totals: {
        bots: 1,
        legacyBotStrategies: 1,
        legacyMapped: 0,
        legacyUnmapped: 1,
      },
      migrationReady: false,
      localBots: [
        {
          botId: 'bot-1',
          name: 'Paper Bot',
          userId: 'user-1',
          isActive: true,
          createdAt: botV2ToIso(date),
        },
      ],
      unmappedLegacyBindings: [
        {
          botStrategyId: 'bs-1',
          botId: 'bot-1',
          botName: 'Paper Bot',
          botMode: 'PAPER',
          userId: 'user-1',
          strategyId: 'strategy-1',
          strategyName: 'Trend',
          symbolGroupId: 'group-1',
          symbolGroupName: 'Majors',
          createdAt: botV2ToIso(date),
          mappedToBotMarketGroup: false,
        },
      ],
    });

    expect(nowStamp()).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(buildArtifactDir('tmp/preflight')).toMatch(/tmp[\\/]preflight$/);
    expect(markdown).toContain('Migration ready for canonical mode contract: no');
    expect(markdown).toContain('| bs-1 | Paper Bot | PAPER | Trend | Majors | user-1 |');
    expect(typeof runBotV2PreflightReport).toBe('function');
  });

  it('formats snapshot and wallet DB verification helpers without touching the database', async () => {
    const date = new Date('2026-06-05T12:34:56.000Z');
    const userClient = {
      user: {
        findUnique: async () => null,
        create: async ({ data }: { data: { password: string } }) => ({
          id: data.password === 'hashed-secret' ? 'created-user' : 'unexpected',
        }),
      },
    };
    const queryClient = {
      $queryRawUnsafe: async () => [{ count: 7 }],
    };

    await expect(
      ensureUser('new@example.com', {
        prismaClient: userClient as never,
        hash: async () => 'hashed-secret',
        env: { SNAPSHOT_USER_PASSWORD: 'secret' },
      })
    ).resolves.toBe('created-user');
    await expect(readCount('SELECT COUNT(*)::int AS count', queryClient as never)).resolves.toBe(7);
    expect(snapshotToIso(date)).toBe('2026-06-05T12:34:56.000Z');
    expect(toStamp()).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(typeof runExportPaperRuntimeSnapshot).toBe('function');
    expect(typeof runImportPaperRuntimeSnapshot).toBe('function');
    expect(typeof runVerifyWalletDbFoundation).toBe('function');
  });

  it('renders Gate.io market stream smoke artifacts from canonical events', () => {
    const markdown = buildMarkdown({
      status: 'PASS',
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
      interval: '1m',
      events: [
        { type: 'ticker', symbol: 'BTCUSDT', price: 1 },
        { type: 'candle', symbol: 'BTCUSDT', isFinal: true },
      ],
    });

    expect(normalizeOutputPath('C:/repo', '', 'history/out.json')).toMatch(/history[\\/]out\.json$/);
    expect(markdown).toContain('Status: **PASS**');
    expect(markdown).toContain('Ticker event: `present`');
    expect(markdown).toContain('Final candle event: `present`');
    expect(typeof runGateioMarketStreamSourceSmoke).toBe('function');
  });
});

describe('API script MJS wrappers', () => {
  it('builds load-test config and executes one mocked worker request', async () => {
    const loadTest = await import('./load-test.mjs');
    const config = loadTest.buildLoadTestConfig(['stress'], {
      LOAD_TEST_DURATION_MS: '10',
      LOAD_TEST_CONCURRENCY: '2',
      LOAD_TEST_TIMEOUT_MS: '100',
      LOAD_TEST_TARGET_URL: 'http://localhost:3001/',
      LOAD_TEST_PATHS: '/health,ready',
    });
    const result = {
      totals: { requests: 0, successes: 0, failures: 0, timeoutFailures: 0 },
      statusCodes: {},
      latenciesMs: [],
    };
    let shouldContinue = true;

    await loadTest.runWorker({
      result,
      paths: config.paths,
      targetUrl: config.targetUrl,
      timeoutMs: config.timeoutMs,
      shouldContinue: () => {
        const current = shouldContinue;
        shouldContinue = false;
        return current;
      },
      nextPathIndex: () => 1,
      fetchImpl: async (url: string) => {
        expect(url).toBe('http://localhost:3001/ready');
        return { ok: true, status: 204 };
      },
      now: (() => {
        let current = 100;
        return () => {
          current += 5;
          return current;
        };
      })(),
    });

    expect(config).toMatchObject({
      mode: 'stress',
      durationMs: 10,
      concurrency: 2,
      targetUrl: 'http://localhost:3001',
      paths: ['/health', 'ready'],
    });
    expect(result.totals).toMatchObject({ requests: 1, successes: 1, failures: 0 });
    expect(result.statusCodes).toEqual({ '204': 1 });
    expect(loadTest.percentile([1, 3, 2], 50)).toBe(2);
    expect(typeof loadTest.main).toBe('function');
  });

  it('keeps start-with-migrate migration and signal helpers dependency-injected', async () => {
    const startWithMigrate = await import('./start-with-migrate.mjs');
    const logs: string[] = [];
    const api = {
      killed: false,
      killedWith: '',
      kill(signal: string) {
        this.killed = true;
        this.killedWith = signal;
      },
    };

    startWithMigrate.runMigrations({
      env: { API_AUTO_MIGRATE: 'false' },
      log: (message: string) => logs.push(message),
      exit: () => {
        throw new Error('unexpected exit');
      },
    });
    startWithMigrate.forwardSignal(api, 'SIGTERM');

    expect(logs).toEqual(['[api/start] API_AUTO_MIGRATE=false, skipping prisma migrate deploy']);
    expect(api).toMatchObject({ killed: true, killedWith: 'SIGTERM' });
    expect(typeof startWithMigrate.main).toBe('function');
    expect(typeof startWithMigrate.startApi).toBe('function');
  });
});
