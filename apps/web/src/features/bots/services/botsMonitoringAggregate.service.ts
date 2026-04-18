import { normalizeSymbol } from "@/lib/symbols";
import { toTimestamp } from "@/lib/time";
import {
  listBotRuntimeSessionPositions,
  listBotRuntimeSessionSymbolStats,
  listBotRuntimeSessionTrades,
} from "./bots.service";
import type {
  BotRuntimePositionsResponse,
  BotRuntimeSessionDetail,
  BotRuntimeSessionListItem,
  BotRuntimeSessionStatus,
  BotRuntimeSymbolStatsResponse,
  BotRuntimeTradesResponse,
} from "../types/bot.type";

type MonitoringAggregateInput = {
  sessions: BotRuntimeSessionListItem[];
  symbolResponses: BotRuntimeSymbolStatsResponse[];
  positionResponses: BotRuntimePositionsResponse[];
  tradeResponses: BotRuntimeTradesResponse[];
};

export type BotMonitoringAggregateData = {
  sessionDetail: BotRuntimeSessionDetail;
  symbolStats: BotRuntimeSymbolStatsResponse;
  positions: BotRuntimePositionsResponse;
  trades: BotRuntimeTradesResponse;
};

type LoadBotMonitoringAggregateArgs = {
  botId: string;
  sessions: BotRuntimeSessionListItem[];
  symbol?: string;
  perSessionLimit?: number;
};

const uniqueById = <T extends { id: string }>(items: T[]) => {
  const map = new Map<string, T>();
  for (const item of items) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }
  return [...map.values()];
};

export const aggregateBotMonitoringPayload = (
  params: MonitoringAggregateInput
): BotMonitoringAggregateData => {
  const mode: "PAPER" | "LIVE" = params.sessions.some((session) => session.mode === "LIVE")
    ? "LIVE"
    : "PAPER";
  const status: BotRuntimeSessionStatus = params.sessions.some((session) => session.status === "RUNNING")
    ? "RUNNING"
    : params.sessions.some((session) => session.status === "FAILED")
      ? "FAILED"
      : params.sessions.some((session) => session.status === "CANCELED")
        ? "CANCELED"
        : "COMPLETED";

  const startedAt =
    params.sessions
      .map((session) => session.startedAt)
      .filter(Boolean)
      .sort((a, b) => toTimestamp(a) - toTimestamp(b))[0] ?? new Date().toISOString();
  const finishedAt =
    params.sessions
      .map((session) => session.finishedAt)
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => toTimestamp(b) - toTimestamp(a))[0] ?? null;
  const lastHeartbeatAt =
    params.sessions
      .map((session) => session.lastHeartbeatAt)
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => toTimestamp(b) - toTimestamp(a))[0] ?? null;
  const durationMs = Math.max(
    0,
    params.sessions.reduce((acc, session) => acc + Math.max(0, session.durationMs), 0)
  );
  const eventsCount = params.sessions.reduce((acc, session) => acc + session.eventsCount, 0);

  const symbolMap = new Map<string, BotRuntimeSymbolStatsResponse["items"][number]>();
  for (const response of params.symbolResponses) {
    for (const item of response.items) {
      const existing = symbolMap.get(item.symbol);
      if (!existing) {
        symbolMap.set(item.symbol, {
          ...item,
          id: `aggregate-${item.symbol}`,
          sessionId: "AGGREGATE",
        });
        continue;
      }

      const currentSignalTs = Math.max(
        toTimestamp(item.lastSignalDecisionAt),
        toTimestamp(item.lastSignalAt)
      );
      const existingSignalTs = Math.max(
        toTimestamp(existing.lastSignalDecisionAt),
        toTimestamp(existing.lastSignalAt)
      );
      const currentTradeTs = toTimestamp(item.lastTradeAt);
      const existingTradeTs = toTimestamp(existing.lastTradeAt);

      symbolMap.set(item.symbol, {
        ...existing,
        totalSignals: existing.totalSignals + item.totalSignals,
        longEntries: existing.longEntries + item.longEntries,
        shortEntries: existing.shortEntries + item.shortEntries,
        exits: existing.exits + item.exits,
        dcaCount: existing.dcaCount + item.dcaCount,
        closedTrades: existing.closedTrades + item.closedTrades,
        winningTrades: existing.winningTrades + item.winningTrades,
        losingTrades: existing.losingTrades + item.losingTrades,
        realizedPnl: existing.realizedPnl + item.realizedPnl,
        grossProfit: existing.grossProfit + item.grossProfit,
        grossLoss: existing.grossLoss + item.grossLoss,
        feesPaid: existing.feesPaid + item.feesPaid,
        openPositionCount: existing.openPositionCount + item.openPositionCount,
        openPositionQty: existing.openPositionQty + item.openPositionQty,
        unrealizedPnl: (existing.unrealizedPnl ?? 0) + (item.unrealizedPnl ?? 0),
        lastPrice: currentSignalTs >= existingSignalTs ? item.lastPrice : existing.lastPrice,
        lastSignalAt: currentSignalTs >= existingSignalTs ? item.lastSignalAt : existing.lastSignalAt,
        lastSignalDirection:
          currentSignalTs >= existingSignalTs
            ? item.lastSignalDirection
            : existing.lastSignalDirection,
        lastSignalDecisionAt:
          currentSignalTs >= existingSignalTs
            ? item.lastSignalDecisionAt
            : existing.lastSignalDecisionAt,
        lastTradeAt: currentTradeTs >= existingTradeTs ? item.lastTradeAt : existing.lastTradeAt,
        snapshotAt:
          toTimestamp(item.snapshotAt) >= toTimestamp(existing.snapshotAt)
            ? item.snapshotAt
            : existing.snapshotAt,
      });
    }
  }

  const symbolItems = [...symbolMap.values()].sort((a, b) => a.symbol.localeCompare(b.symbol));
  const symbolSummary = symbolItems.reduce(
    (acc, item) => ({
      totalSignals: acc.totalSignals + item.totalSignals,
      longEntries: acc.longEntries + item.longEntries,
      shortEntries: acc.shortEntries + item.shortEntries,
      exits: acc.exits + item.exits,
      dcaCount: acc.dcaCount + item.dcaCount,
      closedTrades: acc.closedTrades + item.closedTrades,
      winningTrades: acc.winningTrades + item.winningTrades,
      losingTrades: acc.losingTrades + item.losingTrades,
      realizedPnl: acc.realizedPnl + item.realizedPnl,
      unrealizedPnl: acc.unrealizedPnl + (item.unrealizedPnl ?? 0),
      totalPnl: acc.totalPnl + item.realizedPnl + (item.unrealizedPnl ?? 0),
      grossProfit: acc.grossProfit + item.grossProfit,
      grossLoss: acc.grossLoss + item.grossLoss,
      feesPaid: acc.feesPaid + item.feesPaid,
      openPositionCount: acc.openPositionCount + item.openPositionCount,
      openPositionQty: acc.openPositionQty + item.openPositionQty,
    }),
    {
      totalSignals: 0,
      longEntries: 0,
      shortEntries: 0,
      exits: 0,
      dcaCount: 0,
      closedTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      realizedPnl: 0,
      unrealizedPnl: 0,
      totalPnl: 0,
      grossProfit: 0,
      grossLoss: 0,
      feesPaid: 0,
      openPositionCount: 0,
      openPositionQty: 0,
    }
  );

  const openItems = uniqueById(
    params.positionResponses.flatMap((response) => response.openItems)
  ).sort((a, b) => toTimestamp(b.openedAt) - toTimestamp(a.openedAt));
  const historyItems = uniqueById(
    params.positionResponses.flatMap((response) => response.historyItems)
  ).sort((a, b) => toTimestamp(b.closedAt) - toTimestamp(a.closedAt));
  const openOrders = uniqueById(
    params.positionResponses.flatMap((response) => response.openOrders)
  ).sort(
    (a, b) =>
      toTimestamp(b.submittedAt ?? b.createdAt) - toTimestamp(a.submittedAt ?? a.createdAt)
  );
  const tradeItems = uniqueById(params.tradeResponses.flatMap((response) => response.items)).sort(
    (a, b) => toTimestamp(b.executedAt) - toTimestamp(a.executedAt)
  );

  const positionsSummary = {
    realizedPnl: historyItems.reduce((acc, item) => acc + item.realizedPnl, 0),
    unrealizedPnl: openItems.reduce((acc, item) => acc + (item.unrealizedPnl ?? 0), 0),
    feesPaid: [...openItems, ...historyItems].reduce((acc, item) => acc + item.feesPaid, 0),
  };

  return {
    sessionDetail: {
      id: "AGGREGATE",
      botId: params.sessions[0]?.botId ?? "",
      mode,
      status,
      startedAt,
      finishedAt,
      lastHeartbeatAt,
      stopReason: null,
      errorMessage: null,
      metadata: {
        aggregate: true,
        sessionsCount: params.sessions.length,
      },
      createdAt: startedAt,
      updatedAt: lastHeartbeatAt ?? finishedAt ?? startedAt,
      durationMs,
      eventsCount,
      symbolsTracked: symbolItems.length,
      summary: {
        totalSignals: symbolSummary.totalSignals,
        longEntries: symbolSummary.longEntries,
        shortEntries: symbolSummary.shortEntries,
        exits: symbolSummary.exits,
        dcaCount: symbolSummary.dcaCount,
        closedTrades: symbolSummary.closedTrades,
        winningTrades: symbolSummary.winningTrades,
        losingTrades: symbolSummary.losingTrades,
        realizedPnl: tradeItems.reduce((acc, item) => acc + item.realizedPnl, 0),
        grossProfit: symbolSummary.grossProfit,
        grossLoss: symbolSummary.grossLoss,
        feesPaid: tradeItems.reduce((acc, item) => acc + item.fee, 0),
        openPositionCount: openItems.length,
        openPositionQty: openItems.reduce((acc, item) => acc + item.quantity, 0),
      },
    },
    symbolStats: {
      sessionId: "AGGREGATE",
      items: symbolItems,
      summary: symbolSummary,
    },
    positions: {
      sessionId: "AGGREGATE",
      total: openItems.length + historyItems.length,
      openCount: openItems.length,
      closedCount: historyItems.length,
      openOrdersCount: openOrders.length,
      window: {
        startedAt,
        finishedAt: finishedAt ?? new Date().toISOString(),
      },
      summary: positionsSummary,
      openOrders,
      openItems,
      historyItems,
    },
    trades: {
      sessionId: "AGGREGATE",
      total: tradeItems.length,
      meta: {
        page: 1,
        pageSize: tradeItems.length || 1,
        total: tradeItems.length,
        totalPages: 1,
        hasPrev: false,
        hasNext: false,
      },
      window: {
        startedAt,
        finishedAt: finishedAt ?? new Date().toISOString(),
      },
      items: tradeItems,
    },
  };
};

export const loadBotMonitoringAggregate = async ({
  botId,
  sessions,
  symbol,
  perSessionLimit = 200,
}: LoadBotMonitoringAggregateArgs): Promise<BotMonitoringAggregateData> => {
  const scopedSessions = sessions.slice(0, 20);
  const normalizedSymbol = symbol ? normalizeSymbol(symbol) : undefined;

  const payloads = await Promise.all(
    scopedSessions.map(async (session) => {
      const [symbolStats, positions, trades] = await Promise.all([
        listBotRuntimeSessionSymbolStats(botId, session.id, {
          symbol: normalizedSymbol || undefined,
          limit: perSessionLimit,
        }),
        listBotRuntimeSessionPositions(botId, session.id, {
          symbol: normalizedSymbol || undefined,
          limit: perSessionLimit,
        }),
        listBotRuntimeSessionTrades(botId, session.id, {
          symbol: normalizedSymbol || undefined,
          limit: perSessionLimit,
        }),
      ]);

      return {
        session,
        symbolStats,
        positions,
        trades,
      };
    })
  );

  return aggregateBotMonitoringPayload({
    sessions: payloads.map((payload) => payload.session),
    symbolResponses: payloads.map((payload) => payload.symbolStats),
    positionResponses: payloads.map((payload) => payload.positions),
    tradeResponses: payloads.map((payload) => payload.trades),
  });
};
