import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadBotMonitoringAggregate,
} from "./botsMonitoringAggregate.service";
import {
  getBotRuntimeMonitoringAggregate,
} from "./bots.service";
import type {
  BotRuntimeMonitoringAggregateResponse,
  BotRuntimeSessionListItem,
} from "../types/bot.type";

vi.mock("./bots.service", () => ({
  getBotRuntimeMonitoringAggregate: vi.fn(),
}));

const asSession = (
  value: unknown
): BotRuntimeSessionListItem => value as BotRuntimeSessionListItem;

const asAggregateResponse = (
  value: unknown
): BotRuntimeMonitoringAggregateResponse =>
  value as BotRuntimeMonitoringAggregateResponse;

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
    expect(result).toBe(aggregateFromApi);
  });

  it("fails closed when aggregate endpoint request fails", async () => {
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
    await expect(
      loadBotMonitoringAggregate({
        botId: "bot-1",
        sessions,
        status: "ALL",
        symbol: "btcusdt",
        perSessionLimit: 50,
      })
    ).rejects.toThrow("endpoint unavailable");
  });

  it("keeps empty aggregate trade meta aligned with requested per-session limit", async () => {
    const result = await loadBotMonitoringAggregate({
      botId: "bot-empty",
      sessions: [],
      status: "ALL",
      perSessionLimit: 50,
    });

    expect(getBotRuntimeMonitoringAggregate).not.toHaveBeenCalled();
    expect(result.trades.meta.pageSize).toBe(50);
    expect(result.trades.meta.total).toBe(0);
    expect(result.trades.meta.totalPages).toBe(0);
    expect(result.trades.meta.hasNext).toBe(false);
    expect(result.positions.summary.openPositionQty).toBe(0);
  });
});
