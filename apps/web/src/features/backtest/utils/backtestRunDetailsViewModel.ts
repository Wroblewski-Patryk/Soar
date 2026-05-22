import type { StrategyDto } from "../../strategies/types/StrategyForm.type";
import type { BacktestTimeline, BacktestTimelineEvent, BacktestTrade } from "../types/backtest.type";
import type { BacktestRunDetailsCopy } from "../components/backtestRunDetails.copy";
import { normalizeSymbol } from "@/lib/symbols";

export type DailyPerformancePoint = {
  dayKey: string;
  label: string;
  pnl: number;
  balance: number;
};

export type StrategyIndicatorMeta = {
  names: string[];
  rsiLongLevel: number | null;
  rsiShortLevel: number | null;
};

export const safeDateMs = (value: string) => {
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : 0;
};

export const formatHoldDuration = (minutes: number) => {
  if (!Number.isFinite(minutes) || minutes <= 0) return "0m";
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  const restMinutes = Math.round(minutes % 60);
  if (restMinutes === 0) return `${hours}h`;
  return `${hours}h ${restMinutes}m`;
};

export const getExitReasonLabel = (
  reason: "SIGNAL_EXIT" | "FINAL_CANDLE" | "LIQUIDATION",
  copy: BacktestRunDetailsCopy,
) => {
  if (reason === "SIGNAL_EXIT") return copy.exitReasonSignal;
  if (reason === "FINAL_CANDLE") return copy.exitReasonFinalCandle;
  return copy.exitReasonLiquidation;
};

export const filterTradesByTimelineWindow = (items: BacktestTrade[], timeline: BacktestTimeline) => {
  const candles = Array.isArray(timeline.candles) ? timeline.candles : [];
  if (candles.length === 0) return [];
  const windowStartMs = safeDateMs(candles[0].openTime);
  const windowEndMs = safeDateMs(candles[candles.length - 1].closeTime);
  if (windowStartMs <= 0 || windowEndMs <= 0) return items;

  return items.filter((trade) => {
    const openedAt = safeDateMs(trade.openedAt);
    const closedAt = safeDateMs(trade.closedAt);
    if (openedAt <= 0 || closedAt <= 0) return false;
    return closedAt >= windowStartMs && openedAt <= windowEndMs;
  });
};

export const extractStrategyIndicatorMeta = (strategy: StrategyDto | null): StrategyIndicatorMeta => {
  if (!strategy?.config || typeof strategy.config !== "object") {
    return {
      names: [],
      rsiLongLevel: null,
      rsiShortLevel: null,
    };
  }

  const config = strategy.config as {
    open?: {
      long?: unknown[];
      short?: unknown[];
      indicatorsLong?: unknown[];
      indicatorsShort?: unknown[];
    };
    openConditions?: {
      indicatorsLong?: unknown[];
      indicatorsShort?: unknown[];
    };
  };

  const longItems = [
    ...(config.open?.long ?? []),
    ...(config.open?.indicatorsLong ?? []),
    ...(config.openConditions?.indicatorsLong ?? []),
  ];
  const shortItems = [
    ...(config.open?.short ?? []),
    ...(config.open?.indicatorsShort ?? []),
    ...(config.openConditions?.indicatorsShort ?? []),
  ];

  const names = new Set<string>();
  let rsiLongLevel: number | null = null;
  let rsiShortLevel: number | null = null;

  const readItem = (item: unknown, side: "long" | "short") => {
    if (!item || typeof item !== "object") return;
    const obj = item as {
      name?: unknown;
      params?: Record<string, unknown>;
      value?: unknown;
    };
    const rawName = typeof obj.name === "string" ? normalizeSymbol(obj.name) : "";
    if (!rawName) return;

    if (rawName.includes("EMA") && obj.params) {
      const fast = Number(obj.params.fast);
      const slow = Number(obj.params.slow);
      if (Number.isFinite(fast)) names.add(`EMA FAST (${Math.floor(fast)})`);
      if (Number.isFinite(slow)) names.add(`EMA SLOW (${Math.floor(slow)})`);
      if (!Number.isFinite(fast) && !Number.isFinite(slow)) names.add("EMA");
    } else {
      const period = Number(obj.params?.period ?? obj.params?.length);
      if (Number.isFinite(period)) names.add(`${rawName} (${Math.floor(period)})`);
      else names.add(rawName);
    }

    if (rawName.includes("RSI")) {
      const level = Number(obj.value);
      if (Number.isFinite(level)) {
        if (side === "long" && rsiLongLevel == null) rsiLongLevel = level;
        if (side === "short" && rsiShortLevel == null) rsiShortLevel = level;
      }
    }
  };

  for (const item of longItems) readItem(item, "long");
  for (const item of shortItems) readItem(item, "short");

  return {
    names: [...names],
    rsiLongLevel,
    rsiShortLevel,
  };
};

const CLOSE_LIKE_TIMELINE_EVENT_TYPES = new Set<BacktestTimelineEvent["type"]>([
  "EXIT",
  "TP",
  "TTP",
  "SL",
  "TSL",
  "LIQUIDATION",
]);

export const buildSyntheticTradesFromTimelineEvents = (
  events: BacktestTimelineEvent[],
  symbol: string,
): BacktestTrade[] => {
  if (!Array.isArray(events) || events.length === 0) return [];

  const grouped = new Map<
    string,
    {
      entry?: BacktestTimelineEvent;
      close?: BacktestTimelineEvent;
    }
  >();

  const ordered = [...events].sort((a, b) => {
    const byIndex = a.candleIndex - b.candleIndex;
    if (byIndex !== 0) return byIndex;
    return safeDateMs(a.timestamp) - safeDateMs(b.timestamp);
  });

  for (const event of ordered) {
    const bucket = grouped.get(event.tradeId) ?? {};
    if (event.type === "ENTRY") {
      if (!bucket.entry || event.candleIndex <= bucket.entry.candleIndex) {
        bucket.entry = event;
      }
    } else if (CLOSE_LIKE_TIMELINE_EVENT_TYPES.has(event.type)) {
      if (!bucket.close || event.candleIndex >= bucket.close.candleIndex) {
        bucket.close = event;
      }
    }
    grouped.set(event.tradeId, bucket);
  }

  const result: BacktestTrade[] = [];
  for (const [tradeId, pair] of grouped.entries()) {
    if (!pair.entry || !pair.close) continue;
    result.push({
      id: tradeId,
      symbol,
      side: pair.entry.side,
      entryPrice: pair.entry.price,
      exitPrice: pair.close.price,
      quantity: 0,
      openedAt: pair.entry.timestamp,
      closedAt: pair.close.timestamp,
      pnl: pair.close.pnl ?? 0,
      fee: null,
      exitReason: pair.close.type === "LIQUIDATION" ? "LIQUIDATION" : "SIGNAL_EXIT",
      liquidated: pair.close.type === "LIQUIDATION",
    });
  }

  return result.sort((a, b) => safeDateMs(a.openedAt) - safeDateMs(b.openedAt));
};

export const buildDailyPerformance = (
  items: BacktestTrade[],
  initialBalance: number,
): DailyPerformancePoint[] => {
  const dailyPnl = new Map<string, number>();

  for (const trade of items) {
    const dayKey = trade.closedAt.slice(0, 10);
    dailyPnl.set(dayKey, (dailyPnl.get(dayKey) ?? 0) + trade.pnl);
  }

  const sortedDays = [...dailyPnl.keys()].sort((a, b) => a.localeCompare(b));
  let balance = initialBalance;
  return sortedDays.map((dayKey) => {
    const pnl = dailyPnl.get(dayKey) ?? 0;
    balance += pnl;
    const date = new Date(`${dayKey}T00:00:00`);
    return {
      dayKey,
      label: date.toLocaleDateString(),
      pnl,
      balance,
    };
  });
};
