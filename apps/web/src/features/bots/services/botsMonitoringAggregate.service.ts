import { normalizeSymbol } from "@/lib/symbols";
import { getBotRuntimeMonitoringAggregate } from "./bots.service";
import type {
  BotRuntimeSessionListItem,
  BotRuntimeSessionStatus,
  BotRuntimeMonitoringAggregateResponse,
} from "../types/bot.type";

export type BotMonitoringAggregateData = BotRuntimeMonitoringAggregateResponse;

type LoadBotMonitoringAggregateArgs = {
  botId: string;
  sessions: BotRuntimeSessionListItem[];
  status?: "ALL" | BotRuntimeSessionStatus;
  symbol?: string;
  perSessionLimit?: number;
};

export const loadBotMonitoringAggregate = async ({
  botId,
  sessions,
  status,
  symbol,
  perSessionLimit = 200,
}: LoadBotMonitoringAggregateArgs): Promise<BotMonitoringAggregateData> => {
  const scopedSessions = sessions.slice(0, 20);
  const normalizedSymbol = symbol ? normalizeSymbol(symbol) : undefined;
  if (scopedSessions.length === 0) {
    return {
      sessionDetail: {
        id: "AGGREGATE",
        botId,
        mode: "PAPER",
        status: "COMPLETED",
        startedAt: new Date(0).toISOString(),
        finishedAt: new Date(0).toISOString(),
        lastHeartbeatAt: null,
        stopReason: null,
        errorMessage: null,
        metadata: {
          aggregate: true,
          sessionsCount: 0,
        },
        createdAt: new Date(0).toISOString(),
        updatedAt: new Date(0).toISOString(),
        durationMs: 0,
        eventsCount: 0,
        symbolsTracked: 0,
        summary: {
          totalSignals: 0,
          longEntries: 0,
          shortEntries: 0,
          exits: 0,
          dcaCount: 0,
          closedTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          realizedPnl: 0,
          grossProfit: 0,
          grossLoss: 0,
          feesPaid: 0,
          openPositionCount: 0,
          openPositionQty: 0,
        },
      },
      symbolStats: {
        sessionId: "AGGREGATE",
        items: [],
        summary: {
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
        },
      },
      positions: {
        sessionId: "AGGREGATE",
        total: 0,
        openCount: 0,
        closedCount: 0,
        openOrdersCount: 0,
        window: {
          startedAt: new Date(0).toISOString(),
          finishedAt: new Date(0).toISOString(),
        },
        summary: {
          realizedPnl: 0,
          unrealizedPnl: 0,
          feesPaid: 0,
        },
        openOrders: [],
        openItems: [],
        historyItems: [],
      },
      trades: {
        sessionId: "AGGREGATE",
        total: 0,
        meta: {
          page: 1,
          pageSize: perSessionLimit,
          total: 0,
          totalPages: 0,
          hasPrev: false,
          hasNext: false,
        },
        window: {
          startedAt: new Date(0).toISOString(),
          finishedAt: new Date(0).toISOString(),
        },
        items: [],
      },
    };
  }

  return getBotRuntimeMonitoringAggregate(botId, {
    status: status && status !== "ALL" ? status : undefined,
    symbol: normalizedSymbol || undefined,
    sessionsLimit: scopedSessions.length,
    perSessionLimit,
  });
};
