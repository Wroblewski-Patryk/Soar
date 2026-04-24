import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { I18nProvider } from "../../../i18n/I18nProvider";
import HomeLiveWidgets from "./HomeLiveWidgets";
import { buildMonitoringAggregateFromSessionMocks } from "./HomeLiveWidgets.test-helpers";

const listBotsMock = vi.hoisted(() => vi.fn());
const getBotRuntimeGraphMock = vi.hoisted(() => vi.fn());
const getBotRuntimeMonitoringAggregateMock = vi.hoisted(() => vi.fn());
const listBotRuntimeSessionsMock = vi.hoisted(() => vi.fn());
const listBotRuntimeSessionSymbolStatsMock = vi.hoisted(() => vi.fn());
const listBotRuntimeSessionPositionsMock = vi.hoisted(() => vi.fn());
const listBotRuntimeSessionTradesMock = vi.hoisted(() => vi.fn());
const closeBotRuntimeSessionPositionMock = vi.hoisted(() => vi.fn());
const openDashboardManualOrderMock = vi.hoisted(() => vi.fn());
const getDashboardManualOrderContextMock = vi.hoisted(() => vi.fn());
const updatePositionManualParamsMock = vi.hoisted(() => vi.fn());
const lookupCoinIconsMock = vi.hoisted(() => vi.fn());

vi.mock("../../../features/bots/services/bots.service", () => ({
  listBots: listBotsMock,
  getBotRuntimeGraph: getBotRuntimeGraphMock,
  getBotRuntimeMonitoringAggregate: getBotRuntimeMonitoringAggregateMock,
  listBotRuntimeSessions: listBotRuntimeSessionsMock,
  listBotRuntimeSessionSymbolStats: listBotRuntimeSessionSymbolStatsMock,
  listBotRuntimeSessionPositions: listBotRuntimeSessionPositionsMock,
  listBotRuntimeSessionTrades: listBotRuntimeSessionTradesMock,
  closeBotRuntimeSessionPosition: closeBotRuntimeSessionPositionMock,
  openDashboardManualOrder: openDashboardManualOrderMock,
  getDashboardManualOrderContext: getDashboardManualOrderContextMock,
}));

vi.mock("../../../features/icons/services/icons.service", () => ({
  lookupCoinIcons: lookupCoinIconsMock,
}));

vi.mock("../../../features/positions/services/positions.service", () => ({
  updatePositionManualParams: updatePositionManualParamsMock,
}));

describe("HomeLiveWidgets manual-order inherited venue semantics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.setItem("cryptosparrow-locale", "en");
    window.history.pushState({}, "", "/dashboard");

    lookupCoinIconsMock.mockResolvedValue(new Map());
    getDashboardManualOrderContextMock.mockRejectedValue(new Error("context unavailable"));
    getBotRuntimeMonitoringAggregateMock.mockImplementation(
      buildMonitoringAggregateFromSessionMocks({
        listBotRuntimeSessionsMock,
        listBotRuntimeSessionSymbolStatsMock,
        listBotRuntimeSessionPositionsMock,
        listBotRuntimeSessionTradesMock,
      })
    );

    listBotsMock.mockResolvedValue([
      {
        id: "bot-manual-venue",
        name: "Manual Venue Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        exchange: "KRAKEN",
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-manual-venue",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
        symbolGroup: {
          id: "group-manual-venue",
          name: "Spot Scope",
          symbols: ["BTCUSDT"],
          marketUniverseId: "mu-manual-venue",
          marketUniverse: {
            id: "mu-manual-venue",
            name: "Spot Universe",
            exchange: "BINANCE",
            marketType: "SPOT",
            baseCurrency: "USDT",
          },
        },
      },
    ]);

    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-manual-venue",
        botId: "bot-manual-venue",
        mode: "PAPER",
        status: "RUNNING",
        startedAt: "2026-03-31T10:00:00.000Z",
        finishedAt: null,
        lastHeartbeatAt: "2026-03-31T10:05:00.000Z",
        stopReason: null,
        errorMessage: null,
        createdAt: "2026-03-31T10:00:00.000Z",
        updatedAt: "2026-03-31T10:05:00.000Z",
        durationMs: 300000,
        eventsCount: 1,
        symbolsTracked: 1,
        summary: {
          totalSignals: 1,
          dcaCount: 0,
          closedTrades: 0,
          realizedPnl: 0,
        },
      },
    ]);

    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId: "session-manual-venue",
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
      },
    });
    listBotRuntimeSessionPositionsMock.mockResolvedValue({
      sessionId: "session-manual-venue",
      total: 0,
      openCount: 0,
      closedCount: 0,
      openOrdersCount: 0,
      showDynamicStopColumns: false,
      window: {
        startedAt: "2026-03-31T10:00:00.000Z",
        finishedAt: "2026-03-31T10:05:00.000Z",
      },
      summary: {
        realizedPnl: 0,
        unrealizedPnl: 0,
        feesPaid: 0,
        referenceBalance: 1000,
        freeCash: 1000,
      },
      openOrders: [],
      openItems: [],
      historyItems: [],
    });
    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId: "session-manual-venue",
      total: 0,
      meta: {
        page: 1,
        pageSize: 25,
        total: 0,
        totalPages: 0,
        hasPrev: false,
        hasNext: false,
      },
      window: {
        startedAt: "2026-03-31T10:00:00.000Z",
        finishedAt: "2026-03-31T10:05:00.000Z",
      },
      items: [],
    });

    getBotRuntimeGraphMock.mockResolvedValue({
      bot: {
        id: "bot-manual-venue",
        userId: "u-1",
        name: "Manual Venue Bot",
        mode: "PAPER",
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
        createdAt: "2026-03-31T10:00:00.000Z",
        updatedAt: "2026-03-31T10:00:00.000Z",
      },
      marketGroups: [],
      legacyBotStrategies: [],
    });
  });

  it("falls back to inherited SPOT semantics when manual-order context is unavailable", async () => {
    render(
      <I18nProvider>
        <HomeLiveWidgets />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("manual-order-margin-mode")).toHaveTextContent("NONE");
      expect(screen.getByTestId("manual-order-leverage")).toHaveTextContent("1x");
    });
  });
});
