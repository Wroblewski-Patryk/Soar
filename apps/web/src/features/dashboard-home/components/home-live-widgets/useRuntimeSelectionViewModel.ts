import { useMemo, type MutableRefObject } from "react";
import { normalizeSymbol } from "@/lib/symbols";
import { toTimestamp } from "@/lib/time";
import type { BotRuntimeTradesResponse } from "@/features/bots/types/bot.type";
import {
  resolvePaperConfigBaseline,
  resolveRuntimeFreeFunds,
  resolveRuntimePortfolio,
} from "@/features/bots/utils/runtimeSurfaceTruth";
import {
  pruneStickyFavorableMoveMap,
  resolveFallbackTtpProtectedPercent,
} from "@/features/bots/utils/trailingStopDisplay";
import {
  buildLiveOpenPositions,
  maxDrawdown,
  resolveUnrealized,
  resolveUsedMargin,
} from "./runtimeDerivations";
import type {
  RuntimeSelectedData,
  RuntimeSnapshot,
  RuntimeSummary,
  RuntimeSymbolWithLive,
} from "./types";

type UseRuntimeSelectionViewModelArgs = {
  snapshots: RuntimeSnapshot[];
  selected: RuntimeSnapshot | null;
  selectedTrades: BotRuntimeTradesResponse | null;
  liveTickerPrices: Record<string, number>;
  ttpStickyFavorableMoveByPositionRef: MutableRefObject<Map<string, number>>;
};

export const useRuntimeSelectionViewModel = ({
  snapshots,
  selected,
  selectedTrades,
  liveTickerPrices,
  ttpStickyFavorableMoveByPositionRef,
}: UseRuntimeSelectionViewModelArgs) => {
  const summary = useMemo<RuntimeSummary>(() => {
    const openPositions = snapshots.reduce((acc, x) => acc + (x.positions?.openCount ?? 0), 0);
    const usedMargin = snapshots.reduce((acc, x) => acc + resolveUsedMargin(x.positions), 0);
    const realized = snapshots.reduce((acc, x) => acc + (x.session?.summary.realizedPnl ?? 0), 0);
    const streamMap = new Map<string, number>(Object.entries(liveTickerPrices));
    const unrealized = snapshots.reduce((acc, x) => {
      const openRows = buildLiveOpenPositions(
        x.positions,
        x.symbolStats,
        x.bot.id === selected?.bot.id ? streamMap : new Map<string, number>()
      );
      if (openRows.length > 0) {
        return acc + openRows.reduce((sum, row) => sum + row.liveUnrealizedPnl, 0);
      }
      return acc + resolveUnrealized(x);
    }, 0);
    const totalSignals = snapshots.reduce((acc, x) => acc + (x.session?.summary.totalSignals ?? 0), 0);
    const dcaCount = snapshots.reduce((acc, x) => acc + (x.session?.summary.dcaCount ?? 0), 0);

    const paper = snapshots.filter((x) => x.bot.mode === "PAPER");
    const paperStart = paper.reduce((acc, x) => acc + (resolvePaperConfigBaseline(x.bot) ?? 0), 0);
    const paperDelta = paper.reduce((acc, x) => {
      const net = (x.session?.summary.realizedPnl ?? 0) + resolveUnrealized(x);
      return acc + net;
    }, 0);
    const paperEquity = paper.reduce((acc, x) => {
      const net = (x.session?.summary.realizedPnl ?? 0) + resolveUnrealized(x);
      return (
        acc +
        (resolveRuntimePortfolio({
          bot: x.bot,
          summary: x.positions?.summary ?? null,
          net,
          usedMargin: resolveUsedMargin(x.positions),
        }) ??
          0)
      );
    }, 0);
    return {
      openPositions,
      usedMargin,
      realized,
      unrealized,
      totalSignals,
      dcaCount,
      paperStart,
      paperDelta,
      paperEquity,
    };
  }, [liveTickerPrices, selected?.bot.id, snapshots]);

  const selectedData = useMemo<RuntimeSelectedData | null>(() => {
    if (!selected) return null;

    const session = selected.session;
    const symbolsBase = [...(selected.symbolStats?.items ?? [])].sort(
      (a, b) =>
        Math.max(toTimestamp(b.lastSignalDecisionAt), toTimestamp(b.lastSignalAt)) -
        Math.max(toTimestamp(a.lastSignalDecisionAt), toTimestamp(a.lastSignalAt))
    );
    const streamPrices = new Map<string, number>(Object.entries(liveTickerPrices));
    const open = buildLiveOpenPositions(selected.positions, selected.symbolStats, streamPrices);
    const stickyFavorableMoveByPosition = ttpStickyFavorableMoveByPositionRef.current;
    pruneStickyFavorableMoveMap(stickyFavorableMoveByPosition, new Set(open.map((position) => position.id)));
    const openWithProtectedFallback = open.map((position) => ({
      ...position,
      fallbackTtpProtectedPercent: resolveFallbackTtpProtectedPercent({
        positionId: position.id,
        livePnlPercent: position.livePnlPct,
        trailingTakeProfitLevels: position.trailingTakeProfitLevels,
        stickyFavorableMoveByPosition,
      }),
      runtimeBotId: selected.bot.id,
      runtimeSessionId: selected.actionSessionId ?? selected.session?.id ?? null,
    }));
    const openQtyBySymbol = new Map<string, number>();
    const openUnrealizedBySymbol = new Map<string, number>();
    for (const row of openWithProtectedFallback) {
      const key = normalizeSymbol(row.symbol);
      openQtyBySymbol.set(key, (openQtyBySymbol.get(key) ?? 0) + row.quantity);
      openUnrealizedBySymbol.set(key, (openUnrealizedBySymbol.get(key) ?? 0) + row.liveUnrealizedPnl);
    }
    const symbols: RuntimeSymbolWithLive[] = symbolsBase.map((item) => {
      const symbolKey = normalizeSymbol(item.symbol);
      return {
        ...item,
        liveLastPrice:
          streamPrices.get(symbolKey) ??
          (typeof item.lastPrice === "number" && Number.isFinite(item.lastPrice) ? item.lastPrice : null),
        liveOpenPositionQty: openQtyBySymbol.get(symbolKey) ?? item.openPositionQty,
        liveUnrealizedPnl: openUnrealizedBySymbol.get(symbolKey) ?? (item.unrealizedPnl ?? 0),
      };
    });
    const usedMargin = resolveUsedMargin(selected.positions);
    const unrealized =
      openWithProtectedFallback.length > 0
        ? openWithProtectedFallback.reduce((sum, row) => sum + row.liveUnrealizedPnl, 0)
        : resolveUnrealized(selected);
    const realized = session?.summary.realizedPnl ?? 0;
    const net = realized + unrealized;
    const wins = selected.symbolStats?.summary.winningTrades ?? 0;
    const losses = selected.symbolStats?.summary.losingTrades ?? 0;
    const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : null;
    const paperInit =
      selected.bot.mode === "PAPER"
        ? selected.bot.wallet?.paperInitialBalance ?? selected.bot.paperStartBalance
        : null;
    const runtimeCapitalSummary = (selected.positions?.summary ?? {}) as Record<string, unknown>;
    const equity = resolveRuntimePortfolio({
      bot: selected.bot,
      summary: runtimeCapitalSummary,
      net,
      usedMargin,
    });
    const free = resolveRuntimeFreeFunds({
      summary: runtimeCapitalSummary,
      portfolio: equity,
      usedMargin,
    });
    const exposurePct = equity && equity > 0 ? (usedMargin / equity) * 100 : null;
    const runtimeTradesSessionId = selected.trades?.sessionId ?? selected.session?.id ?? null;
    const trades =
      runtimeTradesSessionId && selectedTrades?.sessionId === runtimeTradesSessionId
        ? selectedTrades.items
        : [];

    return {
      session,
      symbols,
      open: openWithProtectedFallback,
      usedMargin,
      unrealized,
      realized,
      net,
      wins,
      losses,
      winRate,
      paperInit,
      equity,
      free,
      exposurePct,
      trades,
      drawdown: maxDrawdown(trades),
    };
  }, [liveTickerPrices, selected, selectedTrades, ttpStickyFavorableMoveByPositionRef]);

  const showDynamicStopColumns = useMemo(() => {
    const fromStrategyMode = selected?.positions?.showDynamicStopColumns;
    if (typeof fromStrategyMode === "boolean") return fromStrategyMode;
    return (selectedData?.open ?? []).some(
      (row) => row.dynamicTtpStopLoss != null || row.dynamicTslStopLoss != null
    );
  }, [selected?.positions?.showDynamicStopColumns, selectedData?.open]);

  return {
    selectedData,
    showDynamicStopColumns,
    summary,
  };
};
