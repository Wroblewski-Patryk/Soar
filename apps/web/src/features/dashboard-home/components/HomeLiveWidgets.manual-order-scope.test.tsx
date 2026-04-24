import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { I18nProvider } from "../../../i18n/I18nProvider";
import HomeLiveWidgets from "./HomeLiveWidgets";

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

const renderSubject = () => {
  window.localStorage.setItem("cryptosparrow-locale", "pl");
  window.history.pushState({}, "", "/dashboard");
  return render(
    <I18nProvider>
      <HomeLiveWidgets />
    </I18nProvider>
  );
};

describe("HomeLiveWidgets manual-order scope truth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lookupCoinIconsMock.mockResolvedValue(new Map());
    getDashboardManualOrderContextMock.mockResolvedValue({
      botId: "bot-manual-scope",
      symbol: "1000BONKUSDT",
      mode: "PAPER",
      orderType: "MARKET",
      marginMode: "CROSSED",
      leverage: 25,
      priceReference: { markPrice: 0.001, source: "exchange_mark" },
      quantityConstraints: {
        minAmount: 1,
        amountPrecision: 1,
        minNotional: 5,
        minExecutableQty: 1,
      },
      sideAwarePreview: {
        side: "BUY",
        requestedQuantity: null,
        estimatedNotional: null,
        estimatedMargin: null,
        maxOpenPositions: 2,
      },
    });
  });

  it("sources manual-order symbol options from the selected bot market scope even before runtime activity appears", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-manual-scope",
        name: "Scoped Manual Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-manual-scope",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
        symbolGroup: {
          id: "group-manual-scope",
          name: "Manual Scope Group",
          symbols: ["1000BONKUSDT", "1000FLOKIUSDT"],
          marketUniverseId: "mu-manual-scope",
        },
      },
    ]);

    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-manual-scope",
        botId: "bot-manual-scope",
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
        eventsCount: 0,
        symbolsTracked: 0,
        summary: {
          totalSignals: 0,
          dcaCount: 0,
          closedTrades: 0,
          realizedPnl: 0,
        },
      },
    ]);

    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId: "session-manual-scope",
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
      sessionId: "session-manual-scope",
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
      sessionId: "session-manual-scope",
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
        id: "bot-manual-scope",
        userId: "u-1",
        name: "Scoped Manual Bot",
        mode: "PAPER",
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
        symbolGroupId: "group-manual-scope",
        strategyId: "str-manual-scope",
        createdAt: "2026-03-31T10:00:00.000Z",
        updatedAt: "2026-03-31T10:00:00.000Z",
      },
      marketGroups: [
        {
          id: "group-link-manual-scope",
          botId: "bot-manual-scope",
          symbolGroupId: "group-manual-scope",
          lifecycleStatus: "ACTIVE",
          executionOrder: 1,
          isEnabled: true,
          createdAt: "2026-03-31T10:00:00.000Z",
          updatedAt: "2026-03-31T10:00:00.000Z",
          symbolGroup: {
            id: "group-manual-scope",
            name: "Manual Scope Group",
            symbols: ["1000BONKUSDT", "1000FLOKIUSDT"],
            marketUniverseId: "mu-manual-scope",
          },
          strategies: [],
        },
      ],
      legacyBotStrategies: [],
    });

    renderSubject();

    const symbolSelect = await screen.findByLabelText(/Symbol/i);
    const options = within(symbolSelect).getAllByRole("option");
    const labels = options.map((option) => option.textContent);

    expect(labels).toContain("1000BONKUSDT");
    expect(labels).toContain("1000FLOKIUSDT");
  });
});
