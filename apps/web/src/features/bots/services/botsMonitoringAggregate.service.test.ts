import { describe, expect, it } from "vitest";
import { aggregateBotMonitoringPayload } from "./botsMonitoringAggregate.service";
import type {
  BotRuntimePositionsResponse,
  BotRuntimeSessionListItem,
  BotRuntimeSymbolStatsResponse,
  BotRuntimeTradesResponse,
} from "../types/bot.type";

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
          openItems: [{ id: "p1", openedAt: "2026-04-19T10:00:00.000Z", unrealizedPnl: 3, feesPaid: 1 }],
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
          historyItems: [{ id: "p2", closedAt: "2026-04-19T09:58:00.000Z", realizedPnl: -5, feesPaid: 0.5 }],
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
          items: [{ id: "t1", executedAt: "2026-04-19T10:00:20.000Z", realizedPnl: 12, fee: 1 }],
        }),
        asTradesResponse({
          sessionId: "s2",
          total: 1,
          window: {
            startedAt: "2026-04-19T09:50:00.000Z",
            finishedAt: "2026-04-19T09:59:00.000Z",
          },
          items: [{ id: "t2", executedAt: "2026-04-19T09:58:20.000Z", realizedPnl: -5, fee: 0.5 }],
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
