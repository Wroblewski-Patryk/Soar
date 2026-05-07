import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

describe("HomeLiveWidgets open-orders source column", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.setItem("cryptosparrow-locale", "en");
    window.history.pushState({}, "", "/dashboard");

    lookupCoinIconsMock.mockResolvedValue(new Map());
    getBotRuntimeMonitoringAggregateMock.mockImplementation(
      buildMonitoringAggregateFromSessionMocks({
        listBotRuntimeSessionsMock,
        listBotRuntimeSessionSymbolStatsMock,
        listBotRuntimeSessionPositionsMock,
        listBotRuntimeSessionTradesMock,
      })
    );
    closeBotRuntimeSessionPositionMock.mockResolvedValue({
      status: "closed",
      positionId: "position-default",
      orderId: "order-default",
    });
    openDashboardManualOrderMock.mockResolvedValue({
      id: "order-default",
      status: "OPEN",
    });
    getDashboardManualOrderContextMock.mockResolvedValue({
      botId: "bot-orders-source",
      symbol: "BTCUSDT",
      mode: "PAPER",
      orderType: "MARKET",
      marginMode: "CROSSED",
      leverage: 10,
      priceReference: {
        markPrice: 68000,
        source: "exchange_mark",
      },
      quantityConstraints: {
        minAmount: 0.001,
        amountPrecision: 0.001,
        minNotional: 50,
        minExecutableQty: 0.001,
      },
      sideAwarePreview: {
        side: "BUY",
        requestedQuantity: null,
        estimatedNotional: null,
        estimatedMargin: null,
        maxOpenPositions: 2,
      },
    });
    updatePositionManualParamsMock.mockResolvedValue({
      id: "position-default",
      takeProfit: null,
      stopLoss: null,
    });
    getBotRuntimeGraphMock.mockResolvedValue({
      bot: {
        id: "bot-orders-source",
        userId: "u-1",
        name: "Orders Source Bot",
        mode: "PAPER",
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
        createdAt: "2026-03-31T10:00:00.000Z",
        updatedAt: "2026-03-31T10:00:00.000Z",
      },
      marketGroups: [
        {
          id: "group-link-1",
          botId: "bot-orders-source",
          symbolGroupId: "group-1",
          lifecycleStatus: "ACTIVE",
          executionOrder: 1,
          isEnabled: true,
          createdAt: "2026-03-31T10:00:00.000Z",
          updatedAt: "2026-03-31T10:00:00.000Z",
          symbolGroup: {
            id: "group-1",
            name: "Main symbols",
            symbols: ["BTCUSDT", "ETHUSDT", "ADAUSDT"],
            marketUniverseId: "mu-1",
          },
          strategies: [],
        },
      ],
      legacyBotStrategies: [],
    });
  });

  it("maps USER/BOT/EXCHANGE_SYNC origins to Manual/Bot/Imported labels", async () => {
    const sessionId = "session-orders-source";
    const runtimeWindow = {
      startedAt: "2026-03-31T10:00:00.000Z",
      finishedAt: "2026-03-31T10:05:00.000Z",
    };
    const summary = {
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
    };
    const baseOrder = {
      side: "BUY",
      type: "LIMIT",
      status: "OPEN",
      quantity: 0.1,
      filledQuantity: 0,
      price: 62000,
      stopPrice: null,
      submittedAt: "2026-03-31T10:02:00.000Z",
      createdAt: "2026-03-31T10:02:00.000Z",
      updatedAt: "2026-03-31T10:02:00.000Z",
    };

    listBotsMock.mockResolvedValue([
      {
        id: "bot-orders-source",
        name: "Orders Source Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-orders-source",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);
    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: sessionId,
        botId: "bot-orders-source",
        mode: "PAPER",
        status: "RUNNING",
        startedAt: runtimeWindow.startedAt,
        finishedAt: null,
        lastHeartbeatAt: runtimeWindow.finishedAt,
        stopReason: null,
        errorMessage: null,
        createdAt: runtimeWindow.startedAt,
        updatedAt: runtimeWindow.finishedAt,
        durationMs: 300000,
        eventsCount: 1,
        symbolsTracked: 3,
        summary: {
          totalSignals: 1,
          dcaCount: 0,
          closedTrades: 0,
          realizedPnl: 0,
        },
      },
    ]);
    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId,
      items: [],
      summary,
    });
    listBotRuntimeSessionPositionsMock.mockResolvedValue({
      sessionId,
      total: 0,
      openCount: 0,
      closedCount: 0,
      openOrdersCount: 7,
      showDynamicStopColumns: false,
      window: runtimeWindow,
      summary: { realizedPnl: 0, unrealizedPnl: 0, feesPaid: 0 },
      openOrders: [
        { ...baseOrder, id: "order-source-user", origin: "USER", symbol: "BTCUSDT" },
        {
          ...baseOrder,
          id: "order-source-bot",
          origin: "BOT",
          exchangeOrderId: "binance-order-eth-1",
          symbol: "ETHUSDT",
          side: "SELL",
          quantity: 0.2,
          price: 3000,
        },
        {
          ...baseOrder,
          id: "order-source-imported",
          origin: "EXCHANGE_SYNC",
          symbol: "ADAUSDT",
          status: "PENDING",
          quantity: 100,
          price: 0.5,
          submittedAt: "2026-03-31T10:04:00.000Z",
          createdAt: "2026-03-31T10:04:00.000Z",
          updatedAt: "2026-03-31T10:04:00.000Z",
        },
      ],
      openItems: [],
      historyItems: [],
    });
    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId,
      total: 0,
      meta: {
        page: 1,
        pageSize: 25,
        total: 0,
        totalPages: 0,
        hasPrev: false,
        hasNext: false,
      },
      window: runtimeWindow,
      items: [],
    });

    render(
      <I18nProvider>
        <HomeLiveWidgets />
      </I18nProvider>
    );

    fireEvent.click(await screen.findByRole("tab", { name: /Orders/i }));
    const table = await screen.findByRole("table");

    expect(within(table).getByRole("columnheader", { name: /Source/i })).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: /Exchange ID/i })).toBeInTheDocument();
    expect(within(table).getByText("Manual")).toBeInTheDocument();
    expect(within(table).getByText("Bot")).toBeInTheDocument();
    expect(within(table).getByText("Imported")).toBeInTheDocument();
    expect(within(table).getByText("binance-order-eth-1")).toBeInTheDocument();
    expect(screen.getByText("Rows: 7")).toBeInTheDocument();
    await waitFor(() => {
      expect(lookupCoinIconsMock).toHaveBeenCalledWith(["ADAUSDT", "BTCUSDT", "ETHUSDT"]);
    });
  });
});
