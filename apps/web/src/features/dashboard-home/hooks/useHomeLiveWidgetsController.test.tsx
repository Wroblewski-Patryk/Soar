import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useHomeLiveWidgetsController } from "./useHomeLiveWidgetsController";
import type { TranslationKey } from "../../../i18n/translations";
import type {
  Bot,
  BotRuntimeTrade,
  BotRuntimeMonitoringAggregateResponse,
  BotRuntimeSessionListItem,
} from "../../bots/types/bot.type";

type FakeTickerEvent = {
  data: string;
};

class FakeEventSource {
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  private listeners = new Map<string, Array<(event: FakeTickerEvent) => void>>();

  addEventListener(type: string, listener: (event: FakeTickerEvent) => void) {
    const bucket = this.listeners.get(type) ?? [];
    bucket.push(listener);
    this.listeners.set(type, bucket);
  }

  emit(type: string, payload: unknown) {
    for (const listener of this.listeners.get(type) ?? []) {
      listener({ data: JSON.stringify(payload) });
    }
  }

  close = vi.fn();
}

const nowIso = "2026-05-02T10:00:00.000Z";

const createBot = (id: string): Bot =>
  ({
    id,
    name: id,
    mode: "PAPER",
    paperStartBalance: 10_000,
    exchange: "BINANCE",
    marketType: "FUTURES",
    positionMode: "ONE_WAY",
    isActive: true,
    liveOptIn: false,
    manageExternalPositions: false,
    maxOpenPositions: 3,
    symbolGroup: {
      id: `${id}-group`,
      name: `${id} group`,
      symbols: ["ETHUSDT"],
      marketUniverseId: `${id}-market`,
    },
  } as Bot);

const createSession = (
  botId: string,
  id: string,
  status: "RUNNING" | "COMPLETED" = "RUNNING"
): BotRuntimeSessionListItem =>
  ({
    id,
    botId,
    mode: "PAPER",
    status,
    startedAt: nowIso,
    finishedAt: status === "RUNNING" ? null : nowIso,
    lastHeartbeatAt: nowIso,
    stopReason: null,
    errorMessage: null,
    createdAt: nowIso,
    updatedAt: nowIso,
    durationMs: 0,
    eventsCount: 1,
    symbolsTracked: 1,
    summary: {
      totalSignals: 1,
      dcaCount: 0,
      closedTrades: 0,
      realizedPnl: 0,
    },
  });

const createTrade = (id: string): BotRuntimeTrade => ({
  id,
  symbol: "ETHUSDT",
  side: "BUY",
  lifecycleAction: "OPEN",
  price: 100,
  quantity: 1,
  fee: 0.1,
  feeSource: "ESTIMATED",
  feePending: false,
  feeCurrency: "USDT",
  realizedPnl: 0,
  executedAt: nowIso,
  orderId: `${id}-order`,
  positionId: `${id}-position`,
  strategyId: "strategy-runtime",
  origin: "BOT",
  managementMode: "BOT_MANAGED",
  notional: 100,
  margin: 50,
});

const createAggregate = (
  botId: string,
  sessionId: string,
  status: "RUNNING" | "COMPLETED" = "RUNNING"
): BotRuntimeMonitoringAggregateResponse =>
  ({
    sessionDetail: {
      ...createSession(botId, "AGGREGATE", status),
      metadata: { aggregate: true, sessionsCount: 1 },
      summary: {
        totalSignals: 1,
        longEntries: 1,
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
      },
    },
    symbolStats: {
      sessionId,
      items: [
        {
          id: `${botId}-stat`,
          userId: "user-runtime",
          botId,
          sessionId,
          symbol: "ETHUSDT",
          totalSignals: 1,
          longEntries: 1,
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
          openPositionCount: 1,
          openPositionQty: 1,
          lastPrice: 100,
          lastSignalAt: null,
          lastTradeAt: null,
          snapshotAt: nowIso,
          createdAt: nowIso,
          updatedAt: nowIso,
        },
      ],
      summary: {
        totalSignals: 1,
        longEntries: 1,
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
        openPositionCount: 1,
        openPositionQty: 1,
      },
    },
    positions: {
      sessionId,
      total: 1,
      openCount: 1,
      closedCount: 0,
      openOrdersCount: 0,
      window: { startedAt: nowIso, finishedAt: nowIso },
      summary: { realizedPnl: 0, unrealizedPnl: 0, feesPaid: 0 },
      openOrders: [],
      openItems: [
        {
          id: `${botId}-position`,
          symbol: "ETHUSDT",
          side: "LONG",
          status: "OPEN",
          quantity: 1,
          leverage: 1,
          entryPrice: 100,
          entryNotional: 100,
          exitPrice: null,
          stopLoss: null,
          takeProfit: null,
          openedAt: nowIso,
          closedAt: null,
          holdMs: 0,
          dcaCount: 0,
          dcaPlannedLevels: [],
          dcaExecutedLevels: [],
          trailingStopLevels: [],
          trailingTakeProfitLevels: [],
          feesPaid: 0,
          realizedPnl: 0,
          unrealizedPnl: 0,
          unrealizedPnlPercent: 0,
          markPrice: 100,
          firstTradeAt: nowIso,
          lastTradeAt: nowIso,
          tradesCount: 1,
        },
      ],
      historyItems: [],
    },
    trades: {
      sessionId,
      total: 0,
      meta: { page: 1, pageSize: 10, total: 0, totalPages: 0, hasPrev: false, hasNext: false },
      window: { startedAt: nowIso, finishedAt: nowIso },
      items: [],
    },
  });

describe("useHomeLiveWidgetsController", () => {
  const originalEventSource = window.EventSource;

  beforeEach(() => {
    window.localStorage.clear();
    window.EventSource = vi.fn() as unknown as typeof EventSource;
  });

  afterEach(() => {
    window.EventSource = originalEventSource;
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("clears stream prices when selected bot changes even if the same symbol remains visible", async () => {
    const createdSources: FakeEventSource[] = [];
    const createMarketStreamEventSource = vi.fn(() => {
      const source = new FakeEventSource();
      createdSources.push(source);
      return source as unknown as EventSource;
    });
    const bots = [createBot("bot-a"), createBot("bot-b")];
    const sessionsByBot = new Map([
      ["bot-a", [createSession("bot-a", "session-a")]],
      ["bot-b", [createSession("bot-b", "session-b")]],
    ]);
    const getBotRuntimeGraph = vi.fn().mockResolvedValue(null);
    const getBotRuntimeMonitoringAggregate = vi.fn(async (botId: string) =>
      createAggregate(botId, botId === "bot-a" ? "session-a" : "session-b")
    );
    const listBotRuntimeSessions = vi.fn(async (botId: string) => sessionsByBot.get(botId) ?? []);
    const listBots = vi.fn().mockResolvedValue(bots);
    const t = (key: TranslationKey) => key;

    const { result } = renderHook(() =>
      useHomeLiveWidgetsController({
        createMarketStreamEventSource,
        getBotRuntimeGraph,
        getBotRuntimeMonitoringAggregate,
        listBotRuntimeSessions,
        listBots,
        t,
      })
    );

    await waitFor(() => expect(result.current.selected?.bot.id).toBe("bot-a"));
    await waitFor(() => expect(createdSources.length).toBeGreaterThan(0));

    act(() => {
      createdSources[0]?.emit("ticker", { symbol: "ETHUSDT", lastPrice: 111 });
    });
    await waitFor(() => expect(result.current.liveTickerPrices.ETHUSDT).toBe(111));

    act(() => {
      result.current.setSelectedBotId("bot-b");
    });

    await waitFor(() => expect(result.current.selected?.bot.id).toBe("bot-b"));
    await waitFor(() => expect(result.current.liveTickerPrices).toEqual({}));
  });

  it("preserves API aggregate trade total before local filters are applied", async () => {
    const createMarketStreamEventSource = vi.fn(() => new FakeEventSource() as unknown as EventSource);
    const bots = [createBot("bot-a")];
    const sessionsByBot = new Map([["bot-a", [createSession("bot-a", "session-a")]]]);
    const aggregate = createAggregate("bot-a", "session-a");
    aggregate.trades = {
      sessionId: "AGGREGATE",
      total: 3,
      meta: { page: 1, pageSize: 200, total: 3, totalPages: 1, hasPrev: false, hasNext: false },
      window: { startedAt: nowIso, finishedAt: nowIso },
      items: [createTrade("trade-1"), createTrade("trade-2")],
    };
    const getBotRuntimeGraph = vi.fn().mockResolvedValue(null);
    const getBotRuntimeMonitoringAggregate = vi.fn().mockResolvedValue(aggregate);
    const listBotRuntimeSessions = vi.fn(async (botId: string) => sessionsByBot.get(botId) ?? []);
    const listBots = vi.fn().mockResolvedValue(bots);
    const t = (key: TranslationKey) => key;

    const { result } = renderHook(() =>
      useHomeLiveWidgetsController({
        createMarketStreamEventSource,
        getBotRuntimeGraph,
        getBotRuntimeMonitoringAggregate,
        listBotRuntimeSessions,
        listBots,
        t,
      })
    );

    await waitFor(() => expect(result.current.selectedTrades?.total).toBe(3));
    expect(result.current.selectedTrades?.meta.total).toBe(3);
    expect(result.current.selectedTrades?.items).toHaveLength(2);
  });
});
