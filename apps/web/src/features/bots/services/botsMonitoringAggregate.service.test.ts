import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  aggregateBotMonitoringPayload,
  loadBotMonitoringAggregate,
} from "./botsMonitoringAggregate.service";
import {
  getBotRuntimeMonitoringAggregate,
  listBotRuntimeSessionPositions,
  listBotRuntimeSessionSymbolStats,
  listBotRuntimeSessionTrades,
} from "./bots.service";
import type {
  BotRuntimeMonitoringAggregateResponse,
  BotRuntimePositionsResponse,
  BotRuntimeSessionListItem,
  BotRuntimeSymbolStatsResponse,
  BotRuntimeTradesResponse,
} from "../types/bot.type";

vi.mock("./bots.service", () => ({
  getBotRuntimeMonitoringAggregate: vi.fn(),
  listBotRuntimeSessionPositions: vi.fn(),
  listBotRuntimeSessionSymbolStats: vi.fn(),
  listBotRuntimeSessionTrades: vi.fn(),
}));

const asSession = (
  value: unknown
): BotRuntimeSessionListItem => value as BotRuntimeSessionListItem;

const asSymbolResponse = (
  value: unknown
): BotRuntimeSymbolStatsResponse => value as BotRuntimeSymbolStatsResponse;

const asPositionsResponse = (
  value: unknown
): BotRuntimePositionsResponse => value as BotRuntimePositionsResponse;

const asTradesResponse = (
  value: unknown
): BotRuntimeTradesResponse => value as BotRuntimeTradesResponse;

const asAggregateResponse = (
  value: unknown
): BotRuntimeMonitoringAggregateResponse =>
  value as BotRuntimeMonitoringAggregateResponse;

describe("aggregateBotMonitoringPayload", () => {
  it("aggregates sessions, symbol stats, positions and trades into deterministic aggregate payload", () => {
    const result = aggregateBotMonitoringPayload({
      sessions: [
        asSession({
          id: "s1",
          botId: "bot-1",
          mode: "PAPER",
          status: "RUNNING",
          startedAt: "2026-04-19T10:00:00.000Z",
          finishedAt: null,
          lastHeartbeatAt: "2026-04-19T10:01:00.000Z",
          durationMs: 1000,
          eventsCount: 3,
        }),
        asSession({
          id: "s2",
          botId: "bot-1",
          mode: "PAPER",
          status: "COMPLETED",
          startedAt: "2026-04-19T09:50:00.000Z",
          finishedAt: "2026-04-19T09:59:00.000Z",
          lastHeartbeatAt: "2026-04-19T09:59:00.000Z",
          durationMs: 2000,
          eventsCount: 2,
        }),
      ],
      symbolResponses: [
        asSymbolResponse({
          sessionId: "s1",
          items: [
            {
              id: "ss1",
              sessionId: "s1",
              symbol: "BTCUSDT",
              totalSignals: 2,
              longEntries: 1,
              shortEntries: 0,
              exits: 1,
              dcaCount: 0,
              closedTrades: 1,
              winningTrades: 1,
              losingTrades: 0,
              realizedPnl: 12,
              grossProfit: 12,
              grossLoss: 0,
              feesPaid: 1,
              openPositionCount: 1,
              openPositionQty: 0.01,
              unrealizedPnl: 3,
              lastPrice: 50000,
              lastSignalAt: "2026-04-19T10:00:10.000Z",
              lastSignalDirection: "LONG",
              lastSignalDecisionAt: "2026-04-19T10:00:10.000Z",
              lastTradeAt: "2026-04-19T10:00:20.000Z",
              snapshotAt: "2026-04-19T10:00:30.000Z",
            },
          ],
        }),
        asSymbolResponse({
          sessionId: "s2",
          items: [
            {
              id: "ss2",
              sessionId: "s2",
              symbol: "BTCUSDT",
              totalSignals: 1,
              longEntries: 0,
              shortEntries: 1,
              exits: 0,
              dcaCount: 1,
              closedTrades: 1,
              winningTrades: 0,
              losingTrades: 1,
              realizedPnl: -5,
              grossProfit: 0,
              grossLoss: 5,
              feesPaid: 0.5,
              openPositionCount: 0,
              openPositionQty: 0,
              unrealizedPnl: 0,
              lastPrice: 49900,
              lastSignalAt: "2026-04-19T09:58:10.000Z",
              lastSignalDirection: "SHORT",
              lastSignalDecisionAt: "2026-04-19T09:58:10.000Z",
              lastTradeAt: "2026-04-19T09:58:20.000Z",
              snapshotAt: "2026-04-19T09:58:30.000Z",
            },
          ],
        }),
      ],
      positionResponses: [
        asPositionsResponse({
          sessionId: "s1",
          total: 1,
          openCount: 1,
          closedCount: 0,
          openOrdersCount: 1,
          window: {
            startedAt: "2026-04-19T10:00:00.000Z",
            finishedAt: "2026-04-19T10:01:00.000Z",
          },
          openOrders: [{ id: "o1", createdAt: "2026-04-19T10:00:05.000Z" }],
          openItems: [
            {
              id: "p1",
              openedAt: "2026-04-19T10:00:00.000Z",
              unrealizedPnl: 3,
              feesPaid: 1,
            },
          ],
          historyItems: [],
        }),
        asPositionsResponse({
          sessionId: "s2",
          total: 1,
          openCount: 0,
          closedCount: 1,
          openOrdersCount: 0,
          window: {
            startedAt: "2026-04-19T09:50:00.000Z",
            finishedAt: "2026-04-19T09:59:00.000Z",
          },
          openOrders: [],
          openItems: [],
          historyItems: [
            {
              id: "p2",
              closedAt: "2026-04-19T09:58:00.000Z",
              realizedPnl: -5,
              feesPaid: 0.5,
            },
          ],
        }),
      ],
      tradeResponses: [
        asTradesResponse({
          sessionId: "s1",
          total: 1,
          window: {
            startedAt: "2026-04-19T10:00:00.000Z",
            finishedAt: "2026-04-19T10:01:00.000Z",
          },
          items: [
            {
              id: "t1",
              executedAt: "2026-04-19T10:00:20.000Z",
              realizedPnl: 12,
              fee: 1,
            },
          ],
        }),
        asTradesResponse({
          sessionId: "s2",
          total: 1,
          window: {
            startedAt: "2026-04-19T09:50:00.000Z",
            finishedAt: "2026-04-19T09:59:00.000Z",
          },
          items: [
            {
              id: "t2",
              executedAt: "2026-04-19T09:58:20.000Z",
              realizedPnl: -5,
              fee: 0.5,
            },
          ],
        }),
      ],
    });

    expect(result.sessionDetail.id).toBe("AGGREGATE");
    expect(result.sessionDetail.metadata).toEqual(
      expect.objectContaining({
        aggregate: true,
        sessionsCount: 2,
      })
    );
    expect(result.symbolStats.items).toHaveLength(1);
    expect(result.symbolStats.items[0]?.totalSignals).toBe(3);
    expect(result.positions.openItems).toHaveLength(1);
    expect(result.positions.historyItems).toHaveLength(1);
    expect(result.trades.items).toHaveLength(2);
    expect(result.trades.total).toBe(2);
  });
});

describe("loadBotMonitoringAggregate", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("uses API aggregate endpoint when available", async () => {
    const sessions = [
      asSession({
        id: "s-running",
        botId: "bot-1",
        mode: "PAPER",
        status: "RUNNING",
        startedAt: "2026-04-19T11:00:00.000Z",
        finishedAt: null,
        lastHeartbeatAt: "2026-04-19T11:01:00.000Z",
        durationMs: 1000,
        eventsCount: 1,
      }),
    ];
    const aggregateFromApi = asAggregateResponse({
      sessionDetail: { id: "AGGREGATE", metadata: { aggregate: true, sessionsCount: 1 } },
      symbolStats: { sessionId: "AGGREGATE", items: [], summary: { totalSignals: 0 } },
      positions: { sessionId: "AGGREGATE", total: 0, openItems: [], historyItems: [] },
      trades: { sessionId: "AGGREGATE", total: 0, items: [] },
    });
    vi.mocked(getBotRuntimeMonitoringAggregate).mockResolvedValue(aggregateFromApi);

    const result = await loadBotMonitoringAggregate({
      botId: "bot-1",
      sessions,
      status: "RUNNING",
      symbol: "ethusdt",
    });

    expect(getBotRuntimeMonitoringAggregate).toHaveBeenCalledWith("bot-1", {
      status: "RUNNING",
      symbol: "ETHUSDT",
      sessionsLimit: 1,
      perSessionLimit: 200,
    });
    expect(listBotRuntimeSessionSymbolStats).not.toHaveBeenCalled();
    expect(listBotRuntimeSessionPositions).not.toHaveBeenCalled();
    expect(listBotRuntimeSessionTrades).not.toHaveBeenCalled();
    expect(result).toBe(aggregateFromApi);
  });

  it("falls back to client aggregation when API endpoint request fails", async () => {
    const sessions = [
      asSession({
        id: "s-fallback",
        botId: "bot-1",
        mode: "PAPER",
        status: "RUNNING",
        startedAt: "2026-04-19T12:00:00.000Z",
        finishedAt: null,
        lastHeartbeatAt: "2026-04-19T12:01:00.000Z",
        durationMs: 1000,
        eventsCount: 2,
      }),
    ];
    vi.mocked(getBotRuntimeMonitoringAggregate).mockRejectedValue(new Error("endpoint unavailable"));
    vi.mocked(listBotRuntimeSessionSymbolStats).mockResolvedValue(
      asSymbolResponse({
        sessionId: "s-fallback",
        items: [
          {
            id: "ss-fallback",
            sessionId: "s-fallback",
            symbol: "BTCUSDT",
            totalSignals: 2,
            longEntries: 1,
            shortEntries: 1,
            exits: 0,
            dcaCount: 0,
            closedTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            realizedPnl: 0,
            grossProfit: 0,
            grossLoss: 0,
            feesPaid: 0.2,
            openPositionCount: 1,
            openPositionQty: 0.05,
            unrealizedPnl: 1.5,
            lastPrice: 65000,
            lastSignalAt: "2026-04-19T12:00:30.000Z",
            lastSignalDecisionAt: "2026-04-19T12:00:30.000Z",
            lastTradeAt: "2026-04-19T12:00:50.000Z",
            snapshotAt: "2026-04-19T12:00:55.000Z",
          },
        ],
        summary: {
          totalSignals: 2,
          longEntries: 1,
          shortEntries: 1,
          exits: 0,
          dcaCount: 0,
          closedTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          realizedPnl: 0,
          grossProfit: 0,
          grossLoss: 0,
          feesPaid: 0.2,
        },
      })
    );
    vi.mocked(listBotRuntimeSessionPositions).mockResolvedValue(
      asPositionsResponse({
        sessionId: "s-fallback",
        total: 1,
        openCount: 1,
        closedCount: 0,
        openOrdersCount: 0,
        window: {
          startedAt: "2026-04-19T12:00:00.000Z",
          finishedAt: "2026-04-19T12:01:00.000Z",
        },
        summary: {
          realizedPnl: 0,
          unrealizedPnl: 1.5,
          feesPaid: 0.2,
        },
        openOrders: [],
        openItems: [
          {
            id: "p-fallback",
            symbol: "BTCUSDT",
            quantity: 0.05,
            openedAt: "2026-04-19T12:00:00.000Z",
            unrealizedPnl: 1.5,
            feesPaid: 0.2,
          },
        ],
        historyItems: [],
      })
    );
    vi.mocked(listBotRuntimeSessionTrades).mockResolvedValue(
      asTradesResponse({
        sessionId: "s-fallback",
        total: 1,
        meta: {
          page: 1,
          pageSize: 1,
          total: 1,
          totalPages: 1,
          hasPrev: false,
          hasNext: false,
        },
        window: {
          startedAt: "2026-04-19T12:00:00.000Z",
          finishedAt: "2026-04-19T12:01:00.000Z",
        },
        items: [
          {
            id: "t-fallback",
            symbol: "BTCUSDT",
            executedAt: "2026-04-19T12:00:50.000Z",
            realizedPnl: 0,
            fee: 0.2,
          },
        ],
      })
    );

    const result = await loadBotMonitoringAggregate({
      botId: "bot-1",
      sessions,
      status: "ALL",
      symbol: "btcusdt",
      perSessionLimit: 50,
    });

    expect(getBotRuntimeMonitoringAggregate).toHaveBeenCalledWith("bot-1", {
      status: undefined,
      symbol: "BTCUSDT",
      sessionsLimit: 1,
      perSessionLimit: 50,
    });
    expect(listBotRuntimeSessionSymbolStats).toHaveBeenCalledTimes(1);
    expect(listBotRuntimeSessionPositions).toHaveBeenCalledTimes(1);
    expect(listBotRuntimeSessionTrades).toHaveBeenCalledTimes(1);
    expect(result.sessionDetail.id).toBe("AGGREGATE");
    expect(result.sessionDetail.metadata).toEqual(
      expect.objectContaining({
        aggregate: true,
        sessionsCount: 1,
      })
    );
    expect(result.symbolStats.items).toHaveLength(1);
    expect(result.trades.total).toBe(1);
  });
});
