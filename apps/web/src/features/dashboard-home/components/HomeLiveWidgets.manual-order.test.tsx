import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
const cancelDashboardOrderMock = vi.hoisted(() => vi.fn());
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
  cancelDashboardOrder: cancelDashboardOrderMock,
  openDashboardManualOrder: openDashboardManualOrderMock,
  getDashboardManualOrderContext: getDashboardManualOrderContextMock,
}));

vi.mock("../../../features/icons/services/icons.service", () => ({
  lookupCoinIcons: lookupCoinIconsMock,
}));

vi.mock("../../../features/positions/services/positions.service", () => ({
  updatePositionManualParams: updatePositionManualParamsMock,
}));

describe("HomeLiveWidgets manual order", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    lookupCoinIconsMock.mockReset();
    lookupCoinIconsMock.mockResolvedValue(new Map());
    getBotRuntimeGraphMock.mockReset();
    getBotRuntimeMonitoringAggregateMock.mockReset();
    getBotRuntimeMonitoringAggregateMock.mockImplementation(
      buildMonitoringAggregateFromSessionMocks({
        listBotRuntimeSessionsMock,
        listBotRuntimeSessionSymbolStatsMock,
        listBotRuntimeSessionPositionsMock,
        listBotRuntimeSessionTradesMock,
      })
    );
    closeBotRuntimeSessionPositionMock.mockReset();
    closeBotRuntimeSessionPositionMock.mockResolvedValue({
      status: "closed",
      positionId: "position-default",
      orderId: "order-default",
    });
    cancelDashboardOrderMock.mockReset();
    cancelDashboardOrderMock.mockResolvedValue({
      id: "order-default",
      status: "CANCELED",
    });
    openDashboardManualOrderMock.mockReset();
    openDashboardManualOrderMock.mockResolvedValue({
      id: "order-default",
      status: "OPEN",
    });
    getDashboardManualOrderContextMock.mockReset();
    getDashboardManualOrderContextMock.mockImplementation(
      async (params: { botId: string; symbol: string; side?: "BUY" | "SELL"; quantity?: number }) => ({
        botId: params.botId,
        symbol: params.symbol.toUpperCase(),
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
          side: params.side ?? "BUY",
          requestedQuantity: params.quantity ?? null,
          estimatedNotional: params.quantity ? params.quantity * 68000 : null,
          estimatedMargin: params.quantity ? (params.quantity * 68000) / 10 : null,
          maxOpenPositions: 2,
        },
      })
    );
    updatePositionManualParamsMock.mockReset();
    updatePositionManualParamsMock.mockResolvedValue({
      id: "position-default",
      takeProfit: null,
      stopLoss: null,
    });
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderSubject = (locale: "pl" | "en" | "pt" = "pl") => {
    window.localStorage.setItem("cryptosparrow-locale", locale);
    window.history.pushState({}, "", "/dashboard");
    lookupCoinIconsMock.mockResolvedValue(new Map());
    if (!getBotRuntimeGraphMock.getMockImplementation()) {
      getBotRuntimeGraphMock.mockImplementation(async (botId: string) => ({
        bot: {
          id: botId,
          userId: "u-1",
          name: "Runtime bot",
          mode: "PAPER",
          marketType: "FUTURES",
          positionMode: "ONE_WAY",
          isActive: true,
          liveOptIn: false,
          maxOpenPositions: 3,
          createdAt: "2026-03-31T10:00:00.000Z",
          updatedAt: "2026-03-31T10:00:00.000Z",
        },
        marketGroups: [
          {
            id: "group-link-1",
            botId,
            symbolGroupId: "group-1",
            lifecycleStatus: "ACTIVE",
            executionOrder: 1,
            isEnabled: true,
            createdAt: "2026-03-31T10:00:00.000Z",
            updatedAt: "2026-03-31T10:00:00.000Z",
            symbolGroup: {
              id: "group-1",
              name: "Ulubione",
              symbols: ["BTCUSDT", "ETHUSDT"],
              marketUniverseId: "mu-1",
            },
            strategies: [
              {
                id: "group-strategy-1",
                strategyId: "str-1",
                priority: 1,
                weight: 1,
                isEnabled: true,
                createdAt: "2026-03-31T10:00:00.000Z",
                updatedAt: "2026-03-31T10:00:00.000Z",
                strategy: {
                  id: "str-1",
                  name: "Test RSI",
                  interval: "5m",
                  leverage: 10,
                },
              },
            ],
          },
        ],
        legacyBotStrategies: [],
      }));
    }
    return render(
      <I18nProvider>
        <HomeLiveWidgets />
      </I18nProvider>
    );
  };

  const renderSubjectSettled = async (locale: "pl" | "en" | "pt" = "pl") => {
    let view: ReturnType<typeof render>;
    await act(async () => {
      view = renderSubject(locale);
    });
    await act(async () => {
      await Promise.resolve();
    });
    await waitFor(() => {
      expect(document.documentElement.lang).toBe(locale);
    });
    return view!;
  };

  it("opens manual dashboard order through shared order endpoint contract", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-manual-order",
        name: "Manual Order Bot",
        walletId: "wallet-manual-order",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-manual-order",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);
    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-manual-order",
        botId: "bot-manual-order",
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
        symbolsTracked: 1,
        summary: {
          totalSignals: 0,
          dcaCount: 0,
          closedTrades: 0,
          realizedPnl: 0,
        },
      },
    ]);
    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId: "session-manual-order",
      items: [
        {
          id: "stat-manual-order",
          userId: "u-manual-order",
          botId: "bot-manual-order",
          sessionId: "session-manual-order",
          symbol: "BTCUSDT",
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
          unrealizedPnl: 0,
          lastPrice: 68000,
          lastSignalAt: null,
          lastSignalDirection: "NEUTRAL",
          lastSignalDecisionAt: null,
          lastTradeAt: null,
          snapshotAt: "2026-03-31T10:05:00.000Z",
          createdAt: "2026-03-31T10:05:00.000Z",
          updatedAt: "2026-03-31T10:05:00.000Z",
        },
      ],
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
      sessionId: "session-manual-order",
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
      },
      openOrders: [],
      openItems: [],
      historyItems: [],
    });
    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId: "session-manual-order",
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

    await renderSubjectSettled();
    expect(await screen.findByTestId("manual-order-panel")).toBeInTheDocument();
    expect(screen.getByTestId("manual-order-semantics-hint")).toHaveTextContent(
      /jednolitego cyklu|unified lifecycle/i
    );
    expect(
      screen.getByTestId("wallet-section").compareDocumentPosition(screen.getByTestId("manual-order-section")) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();

    const symbolSelect = await screen.findByLabelText(/Symbol/i);
    fireEvent.change(symbolSelect, { target: { value: "BTCUSDT" } });
    fireEvent.click(screen.getByRole("button", { name: /sprzedaj|sell/i }));
    fireEvent.change(screen.getByTestId("manual-order-quantity-input"), { target: { value: "0.25" } });
    await waitFor(() => {
      expect(screen.getByTestId("manual-order-order-type")).toHaveTextContent("MARKET");
      expect(screen.getByTestId("manual-order-margin-mode")).toHaveTextContent("CROSSED");
      expect(screen.getByTestId("manual-order-leverage")).toHaveTextContent("10x");
      expect(screen.getByTestId("manual-order-summary-line")).toHaveTextContent(/17[\s\u00a0,.]*000/i);
    });
    fireEvent.click(screen.getByRole("button", { name: /Otworz zlecenie reczne|Open manual order/i }));

    await waitFor(() => {
      expect(openDashboardManualOrderMock).toHaveBeenCalledWith({
        botId: "bot-manual-order",
        symbol: "BTCUSDT",
        side: "SELL",
        type: "MARKET",
        quantity: 0.25,
        price: 68000,
        riskAck: true,
      });
    });
  });

  it("shows waiting-for-fill action state for manual LIVE order before exchange import appears", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-live-manual-waiting",
        name: "Live Waiting Bot",
        mode: "LIVE",
        exchange: "BINANCE",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-live-waiting",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
        symbolGroup: {
          id: "group-live-waiting",
          name: "Waiting group",
          symbols: ["BTCUSDT"],
          marketUniverseId: "mu-live-waiting",
        },
      },
    ]);
    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-live-manual-waiting",
        botId: "bot-live-manual-waiting",
        mode: "LIVE",
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
        symbolsTracked: 1,
        summary: {
          totalSignals: 0,
          dcaCount: 0,
          closedTrades: 0,
          realizedPnl: 0,
        },
      },
    ]);
    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId: "session-live-manual-waiting",
      items: [
        {
          id: "stat-live-manual-waiting",
          userId: "u-live-waiting",
          botId: "bot-live-manual-waiting",
          sessionId: "session-live-manual-waiting",
          symbol: "BTCUSDT",
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
          unrealizedPnl: 0,
          lastPrice: 68000,
          lastSignalAt: null,
          lastSignalDirection: "NEUTRAL",
          lastSignalDecisionAt: null,
          lastTradeAt: null,
          snapshotAt: "2026-03-31T10:05:00.000Z",
          createdAt: "2026-03-31T10:05:00.000Z",
          updatedAt: "2026-03-31T10:05:00.000Z",
        },
      ],
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
      sessionId: "session-live-manual-waiting",
      total: 0,
      openCount: 0,
      closedCount: 0,
      openOrdersCount: 1,
      showDynamicStopColumns: false,
      window: {
        startedAt: "2026-03-31T10:00:00.000Z",
        finishedAt: "2026-03-31T10:05:00.000Z",
      },
      summary: {
        realizedPnl: 0,
        unrealizedPnl: 0,
        feesPaid: 0,
      },
      openOrders: [
        {
          id: "manual-user-order",
          origin: "USER",
          symbol: "BTCUSDT",
          side: "BUY",
          type: "MARKET",
          status: "OPEN",
          quantity: 0.02,
          filledQuantity: 0,
          price: null,
          stopPrice: null,
          submittedAt: "2026-03-31T10:04:00.000Z",
          createdAt: "2026-03-31T10:04:00.000Z",
          updatedAt: "2026-03-31T10:04:00.000Z",
        },
      ],
      openItems: [],
      historyItems: [],
    });
    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId: "session-live-manual-waiting",
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

    await renderSubjectSettled();

    expect(screen.getByTestId("manual-order-action-state-badge")).toHaveTextContent(
      /oczekuje na fill|waiting for fill/i
    );
    expect(screen.getByTestId("manual-order-action-state-description")).toHaveTextContent(
      /recznego juz istnieje|manual order row exists/i
    );
  });

  it("shows imported-open-order action state once exchange_sync order is visible", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-live-manual-imported",
        name: "Live Imported Bot",
        mode: "LIVE",
        exchange: "BINANCE",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-live-imported",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
        symbolGroup: {
          id: "group-live-imported",
          name: "Imported group",
          symbols: ["BTCUSDT"],
          marketUniverseId: "mu-live-imported",
        },
      },
    ]);
    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-live-manual-imported",
        botId: "bot-live-manual-imported",
        mode: "LIVE",
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
        symbolsTracked: 1,
        summary: {
          totalSignals: 0,
          dcaCount: 0,
          closedTrades: 0,
          realizedPnl: 0,
        },
      },
    ]);
    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId: "session-live-manual-imported",
      items: [
        {
          id: "stat-live-manual-imported",
          userId: "u-live-imported",
          botId: "bot-live-manual-imported",
          sessionId: "session-live-manual-imported",
          symbol: "BTCUSDT",
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
          unrealizedPnl: 0,
          lastPrice: 68000,
          lastSignalAt: null,
          lastSignalDirection: "NEUTRAL",
          lastSignalDecisionAt: null,
          lastTradeAt: null,
          snapshotAt: "2026-03-31T10:05:00.000Z",
          createdAt: "2026-03-31T10:05:00.000Z",
          updatedAt: "2026-03-31T10:05:00.000Z",
        },
      ],
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
      sessionId: "session-live-manual-imported",
      total: 0,
      openCount: 0,
      closedCount: 0,
      openOrdersCount: 1,
      showDynamicStopColumns: false,
      window: {
        startedAt: "2026-03-31T10:00:00.000Z",
        finishedAt: "2026-03-31T10:05:00.000Z",
      },
      summary: {
        realizedPnl: 0,
        unrealizedPnl: 0,
        feesPaid: 0,
      },
      openOrders: [
        {
          id: "exchange-open-order",
          origin: "EXCHANGE_SYNC",
          symbol: "BTCUSDT",
          side: "BUY",
          type: "MARKET",
          status: "OPEN",
          quantity: 0.02,
          filledQuantity: 0,
          price: null,
          stopPrice: null,
          submittedAt: "2026-03-31T10:04:30.000Z",
          createdAt: "2026-03-31T10:04:30.000Z",
          updatedAt: "2026-03-31T10:04:30.000Z",
        },
      ],
      openItems: [],
      historyItems: [],
    });
    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId: "session-live-manual-imported",
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

    await renderSubjectSettled();

    expect(screen.getByTestId("manual-order-action-state-badge")).toHaveTextContent(
      /importowany open order|imported open order/i
    );
    expect(screen.getByTestId("manual-order-action-state-description")).toHaveTextContent(
      /open order z gieldy|exchange open order is visible/i
    );
  });

  it("shows position-opened action state once matching runtime position exists", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-live-manual-position",
        name: "Live Position Bot",
        mode: "LIVE",
        exchange: "BINANCE",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-live-position",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
        symbolGroup: {
          id: "group-live-position",
          name: "Position group",
          symbols: ["BTCUSDT"],
          marketUniverseId: "mu-live-position",
        },
      },
    ]);
    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-live-manual-position",
        botId: "bot-live-manual-position",
        mode: "LIVE",
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
        symbolsTracked: 1,
        summary: {
          totalSignals: 0,
          dcaCount: 0,
          closedTrades: 0,
          realizedPnl: 0,
        },
      },
    ]);
    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId: "session-live-manual-position",
      items: [
        {
          id: "stat-live-manual-position",
          userId: "u-live-position",
          botId: "bot-live-manual-position",
          sessionId: "session-live-manual-position",
          symbol: "BTCUSDT",
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
          openPositionCount: 1,
          openPositionQty: 0.02,
          unrealizedPnl: 8,
          lastPrice: 68000,
          lastSignalAt: null,
          lastSignalDirection: "LONG",
          lastSignalDecisionAt: null,
          lastTradeAt: null,
          snapshotAt: "2026-03-31T10:05:00.000Z",
          createdAt: "2026-03-31T10:05:00.000Z",
          updatedAt: "2026-03-31T10:05:00.000Z",
        },
      ],
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
        unrealizedPnl: 8,
        totalPnl: 8,
        grossProfit: 0,
        grossLoss: 0,
        feesPaid: 0,
      },
    });
    listBotRuntimeSessionPositionsMock.mockResolvedValue({
      sessionId: "session-live-manual-position",
      total: 1,
      openCount: 1,
      closedCount: 0,
      openOrdersCount: 0,
      showDynamicStopColumns: false,
      window: {
        startedAt: "2026-03-31T10:00:00.000Z",
        finishedAt: "2026-03-31T10:05:00.000Z",
      },
      summary: {
        realizedPnl: 0,
        unrealizedPnl: 8,
        feesPaid: 0,
      },
      openOrders: [],
      openItems: [
        {
          id: "position-live-open",
          origin: "EXCHANGE_SYNC",
          managementMode: "BOT_MANAGED",
          syncState: "IN_SYNC",
          takeoverStatus: "OWNED_AND_MANAGED",
          symbol: "BTCUSDT",
          side: "LONG",
          status: "OPEN",
          quantity: 0.02,
          leverage: 5,
          entryPrice: 67500,
          entryNotional: 1350,
          exitPrice: null,
          stopLoss: null,
          takeProfit: null,
          openedAt: "2026-03-31T10:04:45.000Z",
          closedAt: null,
          holdMs: 15000,
          dcaCount: 0,
          feesPaid: 0,
          realizedPnl: 0,
          unrealizedPnl: 8,
          markPrice: 68000,
          firstTradeAt: null,
          lastTradeAt: null,
          tradesCount: 0,
        },
      ],
      historyItems: [],
    });
    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId: "session-live-manual-position",
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

    await renderSubjectSettled();

    expect(screen.getByTestId("manual-order-action-state-badge")).toHaveTextContent(
      /pozycja otwarta|position opened/i
    );
    expect(screen.getByTestId("manual-order-action-state-description")).toHaveTextContent(
      /otwarta pozycje|open position is already visible/i
    );
  });

  it("shows blocked action state when LIVE execution capability is unavailable", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-live-manual-blocked",
        name: "Live Blocked Bot",
        mode: "LIVE",
        exchange: "KRAKEN",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-live-blocked",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
        symbolGroup: {
          id: "group-live-blocked",
          name: "Blocked group",
          symbols: ["BTCUSDT"],
          marketUniverseId: "mu-live-blocked",
          marketUniverse: {
            id: "mu-live-blocked",
            name: "Blocked universe",
            exchange: "KRAKEN",
            marketType: "FUTURES",
            baseCurrency: "USDT",
          },
        },
      },
    ]);
    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-live-manual-blocked",
        botId: "bot-live-manual-blocked",
        mode: "LIVE",
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
        symbolsTracked: 1,
        summary: {
          totalSignals: 0,
          dcaCount: 0,
          closedTrades: 0,
          realizedPnl: 0,
        },
      },
    ]);
    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId: "session-live-manual-blocked",
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
      sessionId: "session-live-manual-blocked",
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
      },
      openOrders: [],
      openItems: [],
      historyItems: [],
    });
    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId: "session-live-manual-blocked",
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

    await renderSubjectSettled();

    expect(screen.getByTestId("manual-order-action-state-badge")).toHaveTextContent(/zablokowane|blocked/i);
    expect(screen.getByTestId("manual-order-action-state-description")).toHaveTextContent(
      /nie jest teraz wykonywalny|not actionable/i
    );
  });

  it("shows submitted action state while manual order request is still in flight", async () => {
    let resolveOrder:
      | ((value: Awaited<ReturnType<typeof openDashboardManualOrderMock>>) => void)
      | null = null;
    openDashboardManualOrderMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveOrder = resolve;
        })
    );
    listBotsMock.mockResolvedValue([
      {
        id: "bot-live-manual-submitted",
        name: "Live Submitted Bot",
        mode: "LIVE",
        exchange: "BINANCE",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-live-submitted",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
        symbolGroup: {
          id: "group-live-submitted",
          name: "Submitted group",
          symbols: ["BTCUSDT"],
          marketUniverseId: "mu-live-submitted",
        },
      },
    ]);
    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-live-manual-submitted",
        botId: "bot-live-manual-submitted",
        mode: "LIVE",
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
        symbolsTracked: 1,
        summary: {
          totalSignals: 0,
          dcaCount: 0,
          closedTrades: 0,
          realizedPnl: 0,
        },
      },
    ]);
    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId: "session-live-manual-submitted",
      items: [
        {
          id: "stat-live-manual-submitted",
          userId: "u-live-submitted",
          botId: "bot-live-manual-submitted",
          sessionId: "session-live-manual-submitted",
          symbol: "BTCUSDT",
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
          unrealizedPnl: 0,
          lastPrice: 68000,
          lastSignalAt: null,
          lastSignalDirection: "NEUTRAL",
          lastSignalDecisionAt: null,
          lastTradeAt: null,
          snapshotAt: "2026-03-31T10:05:00.000Z",
          createdAt: "2026-03-31T10:05:00.000Z",
          updatedAt: "2026-03-31T10:05:00.000Z",
        },
      ],
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
      sessionId: "session-live-manual-submitted",
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
      },
      openOrders: [],
      openItems: [],
      historyItems: [],
    });
    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId: "session-live-manual-submitted",
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

    await renderSubjectSettled();

    fireEvent.change(await screen.findByLabelText(/Symbol/i), { target: { value: "BTCUSDT" } });
    fireEvent.change(screen.getByTestId("manual-order-quantity-input"), { target: { value: "0.25" } });
    fireEvent.click(screen.getByRole("button", { name: /Otworz zlecenie reczne|Open manual order/i }));

    await waitFor(() => {
      expect(screen.getByTestId("manual-order-action-state-badge")).toHaveTextContent(/wyslane|submitted/i);
    });

    await act(async () => {
      resolveOrder?.({ id: "submitted-order", status: "OPEN" });
      await Promise.resolve();
    });
  });
});
