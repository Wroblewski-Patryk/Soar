import type {
  Bot,
  BotRuntimePositionsResponse,
  BotRuntimeSymbolStat,
} from "../types/bot.type";
import type { StrategyDto } from "@/features/strategies/types/StrategyForm.type";

type RuntimeCapitalSummary =
  | BotRuntimePositionsResponse["summary"]
  | Record<string, unknown>
  | null
  | undefined;

export const readFiniteNumber = (value: unknown): number | null => {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
};

export const resolveRuntimeReferenceBalance = (summary: RuntimeCapitalSummary): number | null => {
  if (!summary || typeof summary !== "object") return null;
  const record = summary as Record<string, unknown>;
  return (
    readFiniteNumber(record.referenceBalance) ??
    readFiniteNumber(record.allocatedBalance) ??
    readFiniteNumber(record.accountBalance) ??
    readFiniteNumber(record.walletBalance)
  );
};

export const resolveRuntimeFreeCash = (summary: RuntimeCapitalSummary): number | null => {
  if (!summary || typeof summary !== "object") return null;
  const record = summary as Record<string, unknown>;
  return (
    readFiniteNumber(record.freeCash) ??
    readFiniteNumber(record.availableBalance) ??
    readFiniteNumber(record.freeBalance)
  );
};

export const resolvePaperConfigBaseline = (bot: Bot | null | undefined): number | null => {
  if (!bot || bot.mode !== "PAPER") return null;
  return bot.wallet?.paperInitialBalance ?? bot.paperStartBalance ?? null;
};

export const resolveBotVenueContext = (bot: Bot | null | undefined) => {
  const marketUniverse = bot?.symbolGroup?.marketUniverse ?? null;
  const wallet = bot?.wallet ?? null;

  return {
    exchange: marketUniverse?.exchange ?? wallet?.exchange ?? bot?.exchange ?? null,
    marketType: marketUniverse?.marketType ?? wallet?.marketType ?? bot?.marketType ?? null,
    baseCurrency: marketUniverse?.baseCurrency ?? wallet?.baseCurrency ?? null,
  };
};

export const deriveStrategyMaxOpenPositions = (strategy: StrategyDto | null | undefined): number | null => {
  if (!strategy?.config || typeof strategy.config !== "object") return null;
  const config = strategy.config as {
    additional?: {
      maxPositions?: unknown;
      maxOpenPositions?: unknown;
    };
  };
  const raw = config.additional?.maxPositions ?? config.additional?.maxOpenPositions;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : null;
};

export const resolveRuntimePortfolio = (params: {
  bot: Bot | null | undefined;
  summary: RuntimeCapitalSummary;
  net: number;
  usedMargin: number;
}): number | null => {
  const referenceBalance = resolveRuntimeReferenceBalance(params.summary);
  if (referenceBalance != null) return Math.max(0, referenceBalance);

  const freeCash = resolveRuntimeFreeCash(params.summary);
  if (freeCash != null) {
    return Math.max(0, freeCash + Math.max(0, params.usedMargin));
  }

  const paperBaseline = resolvePaperConfigBaseline(params.bot);
  if (params.bot?.mode === "PAPER" && paperBaseline != null) {
    return Math.max(0, paperBaseline + params.net);
  }

  return null;
};

export const resolveRuntimeFreeFunds = (params: {
  summary: RuntimeCapitalSummary;
  portfolio: number | null;
  usedMargin: number;
}): number | null => {
  const freeCash = resolveRuntimeFreeCash(params.summary);
  if (freeCash != null) return Math.max(0, freeCash);
  if (params.portfolio == null) return null;
  return Math.max(0, params.portfolio - Math.max(0, params.usedMargin));
};

export const resolveRuntimeMarketState = (item: {
  runtimeMarketState?: BotRuntimeSymbolStat["runtimeMarketState"];
  openPositionCount?: number | null;
  lastSignalContextSource?: BotRuntimeSymbolStat["lastSignalContextSource"];
  lastSignalDirection?: BotRuntimeSymbolStat["lastSignalDirection"];
}) => {
  if (item.runtimeMarketState) return item.runtimeMarketState;
  if ((item.openPositionCount ?? 0) > 0) return "POSITION_OPEN" as const;
  if (item.lastSignalDirection === "LONG" || item.lastSignalDirection === "SHORT") {
    return "SIGNAL_ACTIVE" as const;
  }
  if (item.lastSignalContextSource === "latest_decision") {
    return "EVALUATED_NO_TRADE" as const;
  }
  if (item.lastSignalContextSource === "configured_fallback") {
    return "CONFIGURED_ONLY" as const;
  }
  return "UNRESOLVED" as const;
};

export const countRuntimeMarketStates = (
  items: Array<{
    runtimeMarketState?: BotRuntimeSymbolStat["runtimeMarketState"];
    openPositionCount?: number | null;
    lastSignalContextSource?: BotRuntimeSymbolStat["lastSignalContextSource"];
    lastSignalDirection?: BotRuntimeSymbolStat["lastSignalDirection"];
  }>
) => {
  return items.reduce(
    (acc, item) => {
      const state = resolveRuntimeMarketState(item);
      acc[state] += 1;
      return acc;
    },
    {
      POSITION_OPEN: 0,
      SIGNAL_ACTIVE: 0,
      EVALUATED_NO_TRADE: 0,
      CONFIGURED_ONLY: 0,
      UNRESOLVED: 0,
    }
  );
};

export const resolveRuntimeDynamicStopColumnVisibility = (
  fromStrategyMode: boolean | null | undefined,
  hasRowTruth: boolean
) => fromStrategyMode === true || hasRowTruth;
