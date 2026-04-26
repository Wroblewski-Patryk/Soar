import { prisma } from '../../prisma/client';
import { normalizeSymbol } from '../../lib/symbols';
import { runtimeSignalLoop } from './runtimeSignalLoop.service';
import { getRuntimeTicker } from './runtimeTickerStore';
import { StreamTickerEvent } from '../market-stream/binanceStream.types';

type RuntimeScanDeps = {
  listScanTargets: () => Promise<RuntimeScanTarget[]>;
  getTickerSnapshot: (target: RuntimeScanTarget) => Promise<{
    symbol: string;
    exchange: 'BINANCE';
    marketType: 'FUTURES' | 'SPOT';
    lastPrice: number;
    priceChangePercent24h: number;
  } | null>;
  processTicker: (event: StreamTickerEvent) => Promise<void>;
  nowMs: () => number;
};

const parseEnvSymbols = (value: string | undefined) =>
  (value ?? '')
    .split(',')
    .map((item) => normalizeSymbol(item))
    .filter((item) => item.length > 0);

const parseEnvBoolean = (value: string | undefined, fallback: boolean) => {
  if (value == null) return fallback;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return fallback;
};

type RuntimeScanPositionContext = {
  symbol: string;
  bot?: {
    exchange: string;
    marketType: 'FUTURES' | 'SPOT';
  } | null;
  wallet?: {
    exchange: string;
    marketType: 'FUTURES' | 'SPOT';
  } | null;
};

type RuntimeScanTarget = {
  symbol: string;
  exchange: 'BINANCE';
  marketType: 'FUTURES';
};

export const supportsRuntimeWatchdogPositionContext = (context: RuntimeScanPositionContext) => {
  if (context.bot) {
    return context.bot.exchange === 'BINANCE' && context.bot.marketType === 'FUTURES';
  }
  if (context.wallet) {
    return context.wallet.exchange === 'BINANCE' && context.wallet.marketType === 'FUTURES';
  }
  return false;
};

export const deriveRuntimeWatchdogSymbols = (contexts: RuntimeScanPositionContext[]) => {
  return deriveRuntimeWatchdogTargets(contexts).map((target) => target.symbol);
};

export const deriveRuntimeWatchdogTargets = (
  contexts: RuntimeScanPositionContext[]
): RuntimeScanTarget[] => {
  const targets = new Map<string, RuntimeScanTarget>();
  for (const context of contexts) {
    if (!supportsRuntimeWatchdogPositionContext(context)) continue;
    const normalized = normalizeSymbol(context.symbol);
    if (normalized.length === 0) continue;
    const target: RuntimeScanTarget = {
      symbol: normalized,
      exchange: 'BINANCE',
      marketType: 'FUTURES',
    };
    targets.set(`${target.exchange}|${target.marketType}|${target.symbol}`, target);
  }
  return [...targets.values()];
};

const defaultDeps: RuntimeScanDeps = {
  listScanTargets: async () => {
    const envSymbols = parseEnvSymbols(process.env.RUNTIME_SCAN_SYMBOLS);
    if (envSymbols.length > 0) {
      return envSymbols.map((symbol) => ({
        symbol,
        exchange: 'BINANCE' as const,
        marketType: 'FUTURES' as const,
      }));
    }

    const positions = await prisma.position.findMany({
      where: { status: 'OPEN' },
      select: {
        symbol: true,
        bot: {
          select: {
            exchange: true,
            marketType: true,
          },
        },
        wallet: {
          select: {
            exchange: true,
            marketType: true,
          },
        },
      },
    });
    return deriveRuntimeWatchdogTargets(positions);
  },
  getTickerSnapshot: async (target) => {
    const ticker = getRuntimeTicker(target.symbol, {
      exchange: target.exchange,
      marketType: target.marketType,
    });
    if (!ticker) return null;
    return {
      symbol: ticker.symbol,
      exchange: target.exchange,
      marketType: target.marketType,
      lastPrice: ticker.lastPrice,
      priceChangePercent24h: ticker.priceChangePercent24h,
    };
  },
  processTicker: async (event) => {
    await runtimeSignalLoop.processTickerEvent(event);
  },
  nowMs: () => Date.now(),
};

const scanIntervalMs = Number.parseInt(process.env.RUNTIME_SCAN_INTERVAL_MS ?? '30000', 10);
const scanMaxSymbols = Number.parseInt(process.env.RUNTIME_SCAN_MAX_SYMBOLS ?? '25', 10);
const scanWatchdogEnabled = parseEnvBoolean(process.env.RUNTIME_SCAN_WATCHDOG_ENABLED, false);

export const isRuntimeScanWatchdogEnabled = () => scanWatchdogEnabled;

export class RuntimeScanLoop {
  private timer: NodeJS.Timeout | null = null;
  private inFlight = false;

  constructor(private readonly deps: RuntimeScanDeps = defaultDeps) {}

  start() {
    if (this.timer) return;
    if (!scanWatchdogEnabled) return;
    if (!Number.isFinite(scanIntervalMs) || scanIntervalMs <= 0) return;

    this.timer = setInterval(() => {
      void this.runOnce();
    }, scanIntervalMs);
  }

  stop() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  }

  async runOnce() {
    if (this.inFlight) return;
    this.inFlight = true;

    try {
      const targets = (await this.deps.listScanTargets()).slice(0, Math.max(scanMaxSymbols, 1));
      await Promise.all(
        targets.map(async (target) => {
          const ticker = await this.deps.getTickerSnapshot(target);
          if (!ticker) return;
          await this.deps.processTicker({
            type: 'ticker',
            exchange: ticker.exchange,
            marketType: ticker.marketType,
            symbol: ticker.symbol,
            eventTime: this.deps.nowMs(),
            lastPrice: ticker.lastPrice,
            priceChangePercent24h: ticker.priceChangePercent24h,
          });
        })
      );
    } finally {
      this.inFlight = false;
    }
  }
}

export const runtimeScanLoop = new RuntimeScanLoop();
