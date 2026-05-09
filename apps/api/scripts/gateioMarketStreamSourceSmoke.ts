import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ExchangePublicPollingMarketStreamWorker } from '../src/modules/market-stream/exchangePollingStream.service';
import type { MarketStreamEvent } from '../src/modules/market-stream/binanceStream.types';

type CliOptions = {
  symbol: string;
  interval: string;
  outputJson: string;
  outputMarkdown: string;
  stdoutOnly: boolean;
};

const DEFAULT_SYMBOL = 'BTCUSDT';
const DEFAULT_INTERVAL = '1m';

const parseArgs = (argv: string[]): CliOptions => {
  const options: CliOptions = {
    symbol: DEFAULT_SYMBOL,
    interval: DEFAULT_INTERVAL,
    outputJson: '',
    outputMarkdown: '',
    stdoutOnly: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === '--symbol' && next) {
      options.symbol = next;
      index += 1;
      continue;
    }
    if (arg === '--interval' && next) {
      options.interval = next;
      index += 1;
      continue;
    }
    if (arg === '--json-output' && next) {
      options.outputJson = next;
      index += 1;
      continue;
    }
    if (arg === '--markdown-output' && next) {
      options.outputMarkdown = next;
      index += 1;
      continue;
    }
    if (arg === '--stdout-only') {
      options.stdoutOnly = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      process.stdout.write(
        [
          'Usage: pnpm run ops:exchange:gateio-market-stream-smoke -- [options]',
          '',
          'Options:',
          '  --symbol <symbol>              Symbol to poll (default: BTCUSDT)',
          '  --interval <interval>          Candle interval to poll (default: 1m)',
          '  --json-output <path>           JSON artifact path',
          '  --markdown-output <path>       Markdown artifact path',
          '  --stdout-only                  Do not write artifacts',
        ].join('\n')
      );
      process.exit(0);
    }
  }

  return options;
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

const normalizeOutputPath = (repoRoot: string, value: string, fallback: string) =>
  path.resolve(repoRoot, value || fallback);

const buildMarkdown = (report: Record<string, unknown>) => {
  const events = report.events as MarketStreamEvent[];
  const ticker = events.find((event) => event.type === 'ticker');
  const candle = events.find((event) => event.type === 'candle');

  return [
    '# Gate.io Market Stream Source Smoke',
    '',
    `- Status: **${report.status}**`,
    `- Exchange: \`${report.exchange}\``,
    `- Market type: \`${report.marketType}\``,
    `- Symbol: \`${report.symbol}\``,
    `- Interval: \`${report.interval}\``,
    `- Event count: \`${events.length}\``,
    `- Ticker event: \`${ticker ? 'present' : 'missing'}\``,
    `- Final candle event: \`${candle ? 'present' : 'missing'}\``,
    '',
    '## Safety',
    '- Public market-data read only.',
    '- No credentials used.',
    '- No exchange writes or live orders.',
    '- Does not enable Gate.io `PAPER_PRICING_FEED`, authenticated reads, live submit, or cancel.',
    '',
    '## Canonical Events',
    '',
    '```json',
    JSON.stringify(events, null, 2),
    '```',
    '',
  ].join('\n');
};

const run = async () => {
  const options = parseArgs(process.argv.slice(2));
  const events: MarketStreamEvent[] = [];
  const warnings: unknown[] = [];

  const worker = new ExchangePublicPollingMarketStreamWorker(
    {
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      symbols: [options.symbol],
      candleIntervals: [options.interval],
      onEvent: (event) => {
        events.push(event);
      },
    },
    undefined,
    {
      info: () => undefined,
      warn: (payload) => warnings.push(payload),
      error: (payload) => warnings.push(payload),
    }
  );

  await worker.pollOnce();

  const hasTicker = events.some((event) => event.type === 'ticker');
  const hasFinalCandle = events.some((event) => event.type === 'candle' && event.isFinal);
  const status = hasTicker && hasFinalCandle ? 'PASS' : 'FAIL';
  const report = {
    status,
    exchange: 'GATEIO',
    marketType: 'FUTURES',
    symbol: options.symbol.toUpperCase(),
    interval: options.interval,
    generatedAt: new Date().toISOString(),
    events,
    warnings,
    safety: {
      publicReadOnly: true,
      usedCredentials: false,
      exchangeWrites: false,
      liveOrders: false,
      enablesPaperPricingFeed: false,
    },
  };

  process.stdout.write(`[gateio-market-stream-smoke] status=${status} events=${events.length}\n`);

  if (!options.stdoutOnly) {
    const jsonPath = normalizeOutputPath(
      repoRoot,
      options.outputJson,
      'docs/operations/_artifacts-gateio-market-stream-source-smoke-2026-05-09.json'
    );
    const markdownPath = normalizeOutputPath(
      repoRoot,
      options.outputMarkdown,
      'docs/operations/gateio-market-stream-source-smoke-2026-05-09.md'
    );
    await mkdir(path.dirname(jsonPath), { recursive: true });
    await mkdir(path.dirname(markdownPath), { recursive: true });
    await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    await writeFile(markdownPath, buildMarkdown(report), 'utf8');
    process.stdout.write(`[gateio-market-stream-smoke] json=${path.relative(repoRoot, jsonPath)}\n`);
    process.stdout.write(`[gateio-market-stream-smoke] markdown=${path.relative(repoRoot, markdownPath)}\n`);
  }

  if (status !== 'PASS') {
    process.exitCode = 1;
  }
};

void run().catch((error) => {
  process.stderr.write(`[gateio-market-stream-smoke] failed: ${error instanceof Error ? error.message : error}\n`);
  process.exitCode = 1;
});
