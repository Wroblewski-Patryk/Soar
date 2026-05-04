import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { I18nProvider } from "../../../i18n/I18nProvider";
import HomeLiveWidgets, {
  buildFallbackRuntimeTradeMeta,
  resolveSelectedStrategyDisplay,
} from "./HomeLiveWidgets";
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
const createMarketStreamEventSourceMock = vi.hoisted(() => vi.fn());

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

vi.mock("../../../lib/marketStream", () => ({
  createMarketStreamEventSource: createMarketStreamEventSourceMock,
}));

describe("HomeLiveWidgets", () => {
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
    createMarketStreamEventSourceMock.mockReset();
    createMarketStreamEventSourceMock.mockImplementation(() => ({
      onopen: null as ((event: Event) => void) | null,
      onerror: null as ((event: Event) => void) | null,
      addEventListener: vi.fn(),
      close: vi.fn(),
    }));
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

  it("renders empty state when there are no bots", async () => {
    listBotsMock.mockResolvedValue([]);
    listBotRuntimeSessionsMock.mockResolvedValue([]);
    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId: "none",
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
        grossProfit: 0,
        grossLoss: 0,
        feesPaid: 0,
      },
    });
    listBotRuntimeSessionPositionsMock.mockResolvedValue({
      sessionId: "none",
      total: 0,
      openCount: 0,
      closedCount: 0,
      openOrdersCount: 0,
      window: {
        startedAt: "2026-03-31T10:00:00.000Z",
        finishedAt: "2026-03-31T10:00:00.000Z",
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
      sessionId: "none",
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
        finishedAt: "2026-03-31T10:00:00.000Z",
      },
      items: [],
    });

    window.localStorage.setItem("cryptosparrow-locale", "pl");
    window.history.pushState({}, "", "/dashboard");
    lookupCoinIconsMock.mockResolvedValue(new Map());
    render(
      <I18nProvider>
        <HomeLiveWidgets />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Brak botow do podsumowania dashboardu")).toBeInTheDocument();
      expect(screen.getByText("Stworz portfel")).toBeInTheDocument();
      expect(screen.getAllByText(/Dodaj bota|Stworz i aktywuj bota|Create and activate bot/i).length).toBeGreaterThan(0);
    });
  });

  it("renders no-active-bots onboarding with activation step and no footer CTA buttons", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "inactive-bot-1",
        name: "Inactive Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-inactive-1",
        isActive: false,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);

    const { container } = renderSubject();

    await waitFor(() => {
      expect(screen.getByText("Brak aktywnych botow na dashboardzie")).toBeInTheDocument();
      expect(screen.getByText("Stworz portfel")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Otworz portfele" })).toBeInTheDocument();
      expect(screen.getByText("Aktywuj istniejacego bota")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Otworz liste botow" })).toBeInTheDocument();
    });

    {
      const walletLink = screen.getByRole("link", { name: "Otworz portfele" });
      const marketsLink = screen.getByRole("link", { name: "Otworz rynki" });
      expect(walletLink.compareDocumentPosition(marketsLink) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }

    expect(container.querySelector(".btn.btn-primary.btn-sm")).toBeNull();
    expect(container.querySelector(".btn.btn-outline.btn-sm")).toBeNull();
  });

  it("shows both active LIVE and active PAPER bots in dashboard selector", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-live-active",
        name: "Mixed Live Bot",
        mode: "LIVE",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-live-active",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
      },
      {
        id: "bot-paper-active",
        name: "Mixed Paper Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-paper-active",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);

    listBotRuntimeSessionsMock.mockImplementation(async (botId: string) => [
      {
        id: `session-${botId}`,
        botId,
        mode: botId.includes("live") ? "LIVE" : "PAPER",
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
      sessionId: "session-any",
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
      sessionId: "session-any",
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
      sessionId: "session-any",
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

    renderSubject();

    await waitFor(() => {
      expect(screen.getByText(/Wybrany bot|Selected bot/i)).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /Mixed Live Bot/i })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /Mixed Paper Bot/i })).toBeInTheDocument();
    });
  });

  it("keeps mixed-mode selection stable and renders no-session degrade state for active bot", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-live-active",
        name: "Mixed Live Bot",
        mode: "LIVE",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-live-active",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
      },
      {
        id: "bot-paper-active",
        name: "Mixed Paper Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-paper-active",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);

    listBotRuntimeSessionsMock.mockImplementation(async (botId: string) => {
      if (botId === "bot-live-active") {
        return [
          {
            id: "session-live",
            botId,
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
            symbolsTracked: 0,
            summary: {
              totalSignals: 0,
              dcaCount: 0,
              closedTrades: 0,
              realizedPnl: 0,
            },
          },
        ];
      }
      return [];
    });

    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId: "session-live",
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
      sessionId: "session-live",
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
      sessionId: "session-live",
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

    renderSubject();

    let selector: HTMLSelectElement;
    await waitFor(() => {
      const selectorLabel = screen.getByText(/Wybrany bot|Selected bot/i).closest("label");
      expect(selectorLabel).not.toBeNull();
      selector = within(selectorLabel as HTMLLabelElement).getByRole("combobox") as HTMLSelectElement;
      expect(selector.value).toBe("bot-live-active");
      expect(screen.getByRole("option", { name: /Mixed Paper Bot/i })).toBeInTheDocument();
      expect(window.localStorage.getItem("dashboard.home.selectedBotId")).toBe("bot-live-active");
    });

    fireEvent.change(selector!, { target: { value: "bot-paper-active" } });

    await waitFor(() => {
      expect(selector!.value).toBe("bot-paper-active");
      expect(screen.getByText("NO_SESSION")).toBeInTheDocument();
      expect(screen.getByText(/Brak aktywnej sesji runtime/i)).toBeInTheDocument();
      expect(screen.getByText(/Mixed Paper Bot \| PAPER/i)).toBeInTheDocument();
      expect(window.localStorage.getItem("dashboard.home.selectedBotId")).toBe("bot-paper-active");
    });

    fireEvent.change(selector!, { target: { value: "bot-live-active" } });

    await waitFor(() => {
      expect(selector!.value).toBe("bot-live-active");
      expect(screen.getByText("RUNNING")).toBeInTheDocument();
      expect(screen.queryByText(/Brak aktywnej sesji runtime/i)).toBeNull();
      expect(screen.getByText(/Mixed Live Bot \| LIVE/i)).toBeInTheDocument();
      expect(window.localStorage.getItem("dashboard.home.selectedBotId")).toBe("bot-live-active");
    });
  });

  it("renders runtime summary, monitored bots and market signals", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-1",
        name: "Monitor Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-1",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);

    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-1",
        botId: "bot-1",
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
        eventsCount: 16,
        symbolsTracked: 2,
        summary: {
          totalSignals: 14,
          dcaCount: 1,
          closedTrades: 5,
          realizedPnl: 230.5,
        },
      },
    ]);
    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId: "session-1",
      items: [
        {
          id: "stat-1",
          userId: "u-1",
          botId: "bot-1",
          sessionId: "session-1",
          symbol: "BTCUSDT",
          totalSignals: 9,
          longEntries: 4,
          shortEntries: 3,
          exits: 2,
          dcaCount: 1,
          closedTrades: 4,
          winningTrades: 3,
          losingTrades: 1,
          realizedPnl: 180,
          grossProfit: 240,
          grossLoss: -60,
          feesPaid: 12,
          openPositionCount: 1,
          openPositionQty: 0.12,
          unrealizedPnl: 35,
          lastPrice: 68000,
          lastSignalAt: "2026-03-31T10:04:00.000Z",
          lastSignalDirection: "LONG",
          lastSignalDecisionAt: "2026-03-31T10:04:00.000Z",
          lastTradeAt: "2026-03-31T10:03:00.000Z",
          snapshotAt: "2026-03-31T10:05:00.000Z",
          createdAt: "2026-03-31T10:05:00.000Z",
          updatedAt: "2026-03-31T10:05:00.000Z",
        },
      ],
      summary: {
        totalSignals: 9,
        longEntries: 4,
        shortEntries: 3,
        exits: 2,
        dcaCount: 1,
        closedTrades: 4,
        winningTrades: 3,
        losingTrades: 1,
        realizedPnl: 180,
        unrealizedPnl: 35,
        totalPnl: 215,
        grossProfit: 240,
        grossLoss: -60,
        feesPaid: 12,
      },
    });
    listBotRuntimeSessionPositionsMock.mockResolvedValue({
      sessionId: "session-1",
      total: 2,
      openCount: 2,
      closedCount: 0,
      openOrdersCount: 0,
      showDynamicStopColumns: false,
      window: {
        startedAt: "2026-03-31T10:00:00.000Z",
        finishedAt: "2026-03-31T10:05:00.000Z",
      },
      summary: {
        realizedPnl: 0,
        unrealizedPnl: 35,
        feesPaid: 0,
      },
      openOrders: [],
      openItems: [
        {
          id: "pos-1",
          symbol: "BTCUSDT",
          side: "LONG",
          status: "OPEN",
          quantity: 0.12,
          leverage: 15,
          entryPrice: 68000,
          entryNotional: 8160,
          exitPrice: null,
          stopLoss: null,
          takeProfit: null,
          openedAt: "2026-03-31T10:03:00.000Z",
          closedAt: null,
          holdMs: 120000,
          dcaCount: 2,
          dcaPlannedLevels: [-15, -30, -45],
          dcaExecutedLevels: [-15, -30],
          feesPaid: 0,
          realizedPnl: 0,
          unrealizedPnl: 35,
          markPrice: 68290,
          dynamicTtpStopLoss: null,
          dynamicTslStopLoss: null,
          firstTradeAt: "2026-03-31T10:03:00.000Z",
          lastTradeAt: "2026-03-31T10:04:00.000Z",
          tradesCount: 1,
        },
        {
          id: "pos-2",
          symbol: "ETHUSDT",
          side: "LONG",
          status: "OPEN",
          quantity: 0.5,
          leverage: 15,
          entryPrice: 2500,
          entryNotional: 1250,
          exitPrice: null,
          stopLoss: null,
          takeProfit: null,
          openedAt: "2026-03-31T10:02:00.000Z",
          closedAt: null,
          holdMs: 180000,
          dcaCount: 0,
          dcaPlannedLevels: [],
          dcaExecutedLevels: [],
          feesPaid: 0,
          realizedPnl: 0,
          unrealizedPnl: 12,
          markPrice: 2520,
          dynamicTtpStopLoss: 2508.4321,
          dynamicTslStopLoss: 2496.5555,
          firstTradeAt: "2026-03-31T10:02:00.000Z",
          lastTradeAt: "2026-03-31T10:04:00.000Z",
          tradesCount: 1,
        },
      ],
      historyItems: [],
    });
    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId: "session-1",
      total: 1,
      meta: {
        page: 1,
        pageSize: 25,
        total: 1,
        totalPages: 1,
        hasPrev: false,
        hasNext: false,
      },
      window: {
        startedAt: "2026-03-31T10:00:00.000Z",
        finishedAt: "2026-03-31T10:05:00.000Z",
      },
      items: [
        {
          id: "trade-1",
          symbol: "BTCUSDT",
          side: "BUY",
          lifecycleAction: "OPEN",
          price: 68000,
          quantity: 0.12,
          fee: 0,
          feeSource: "ESTIMATED",
          feePending: false,
          feeCurrency: "USDT",
          realizedPnl: 0,
          executedAt: "2026-03-31T10:03:00.000Z",
          orderId: "ord-1",
          positionId: "pos-1",
          strategyId: "str-1",
          origin: "BOT",
          managementMode: "SIGNAL",
          notional: 8160,
          margin: 544,
        },
      ],
    });

    renderSubject();

    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /Pozycje|Positions/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /Zlecenia|Orders/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /Historia|History/i })).toBeInTheDocument();
      expect(screen.getByText(/Wybrany bot|Selected bot/i)).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /Monitor Bot/i })).toBeInTheDocument();
      expect(screen.getAllByText("RUNNING").length).toBeGreaterThan(0);
      expect(screen.getAllByText("BTCUSDT").length).toBeGreaterThan(0);
      expect(screen.getByText("Rynki:")).toBeInTheDocument();
      expect(screen.getByText("Sygnaly:")).toBeInTheDocument();
      expect(
        screen.getAllByText(
          (content) => /\d{2}\.\d{2}\.\d{4}/.test(content) && /\d{2}:\d{2}:\d{2}/.test(content)
        ).length
      ).toBeGreaterThan(0);
      expect(screen.getByTitle("1:-15%, 2:-30%")).toBeInTheDocument();
      expect(screen.getByText("TTP")).toBeInTheDocument();
      expect(screen.getByText("TSL")).toBeInTheDocument();
      expect(
        screen.getByText((content) => /5[.,]0[56]%/.test(content.replace(/\u00a0/g, " ")))
      ).toBeInTheDocument();
      expect(screen.getAllByText("-").length).toBeGreaterThan(0);
      const openPositionsColumnHeaders = screen.getAllByRole("columnheader").map((header) => (header.textContent ?? "").trim());
      const actionColumnIndex = openPositionsColumnHeaders.findIndex((label) => /Action|Akcja|Acao/i.test(label));
      const tslColumnIndex = openPositionsColumnHeaders.findIndex((label) => /^TSL$/i.test(label));
      expect(actionColumnIndex).toBeGreaterThan(-1);
      expect(tslColumnIndex).toBeGreaterThan(-1);
      expect(actionColumnIndex).toBeGreaterThan(tslColumnIndex);
      expect(actionColumnIndex).toBe(openPositionsColumnHeaders.length - 1);
    });
    {
      const openPositionsTab = screen.getByRole("tab", { name: /Pozycje|Positions/i });
      const openOrdersTab = screen.getByRole("tab", { name: /Zlecenia|Orders/i });
      const tradeHistoryTab = screen.getByRole("tab", { name: /Historia|History/i });

      expect(openPositionsTab.compareDocumentPosition(openOrdersTab) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(openOrdersTab.compareDocumentPosition(tradeHistoryTab) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }

    await waitFor(() => {
      expect(lookupCoinIconsMock).toHaveBeenCalledWith(expect.arrayContaining(["BTCUSDT", "ETHUSDT"]));
    });

    fireEvent.click(screen.getByRole("tab", { name: /Historia|History/i }));
    await waitFor(() => {
      expect(screen.queryByRole("columnheader", { name: /^Fee$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("columnheader", { name: /^Origin$/i })).not.toBeInTheDocument();
    });
  });

  it("renders orders tab as a table with deterministic empty state", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-orders-empty",
        name: "Orders Empty Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-orders-empty",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);

    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-orders-empty",
        botId: "bot-orders-empty",
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
      sessionId: "session-orders-empty",
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
      sessionId: "session-orders-empty",
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
      sessionId: "session-orders-empty",
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

    const ordersTab = await screen.findByRole("tab", { name: /Zlecenia|Orders/i });
    fireEvent.click(ordersTab);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /Symbol/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /Side/i })).toBeInTheDocument();
      expect(screen.getByText(/Brak otwartych zlecen|No open orders/i)).toBeInTheDocument();
      expect(screen.queryByText(/zakladka otwartych zlecen|Open orders tab is prepared/i)).not.toBeInTheDocument();
    });
  });

  it("refreshes strategy context when switching selected bot", async () => {
    getDashboardManualOrderContextMock.mockResolvedValue({
      botId: "bot-strategy-a",
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

    listBotsMock.mockResolvedValue([
      {
        id: "bot-strategy-a",
        name: "Strategy Bot A",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-a",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
      {
        id: "bot-strategy-b",
        name: "Strategy Bot B",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-b",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);

    getBotRuntimeGraphMock.mockImplementation(async (botId: string) => ({
      bot: {
        id: botId,
        userId: "u-1",
        name: botId === "bot-strategy-a" ? "Strategy Bot A" : "Strategy Bot B",
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
          id: `group-${botId}`,
          botId,
          symbolGroupId: `symbols-${botId}`,
          lifecycleStatus: "ACTIVE",
          executionOrder: 1,
          isEnabled: true,
          createdAt: "2026-03-31T10:00:00.000Z",
          updatedAt: "2026-03-31T10:00:00.000Z",
          symbolGroup: {
            id: `symbols-${botId}`,
            name: botId === "bot-strategy-a" ? "A symbols" : "B symbols",
            symbols: ["BTCUSDT"],
            marketUniverseId: "mu-1",
          },
          strategies: [
            {
              id: `strategy-shared-${botId}`,
              strategyId: "str-shared",
              priority: 1,
              weight: 1,
              isEnabled: true,
              createdAt: "2026-03-31T10:00:00.000Z",
              updatedAt: "2026-03-31T10:00:00.000Z",
              strategy: {
                id: "str-shared",
                name: "Shared stale strategy",
                interval: "5m",
              },
            },
            {
              id: `strategy-active-${botId}`,
              strategyId: botId === "bot-strategy-a" ? "str-a" : "str-b",
              priority: 2,
              weight: 1,
              isEnabled: true,
              createdAt: "2026-03-31T10:00:00.000Z",
              updatedAt: "2026-03-31T10:00:00.000Z",
              strategy: {
                id: botId === "bot-strategy-a" ? "str-a" : "str-b",
                name: botId === "bot-strategy-a" ? "Alpha Strategy" : "Beta Strategy",
                interval: "15m",
              },
            },
          ],
        },
      ],
      legacyBotStrategies: [],
    }));

    listBotRuntimeSessionsMock.mockImplementation(async (botId: string) => [
      {
        id: `session-${botId}`,
        botId,
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

    listBotRuntimeSessionSymbolStatsMock.mockImplementation(async (_botId: string, sessionId: string) => ({
      sessionId,
      items: [
        {
          id: `stat-${sessionId}`,
          userId: "u-1",
          botId: _botId,
          sessionId,
          symbol: "BTCUSDT",
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
          openPositionCount: 0,
          openPositionQty: 0,
          unrealizedPnl: 0,
          lastPrice: 68000,
          lastSignalAt: "2026-03-31T10:05:00.000Z",
          lastSignalDirection: "LONG",
          lastSignalDecisionAt: "2026-03-31T10:05:00.000Z",
          lastTradeAt: null,
          snapshotAt: "2026-03-31T10:05:00.000Z",
          createdAt: "2026-03-31T10:05:00.000Z",
          updatedAt: "2026-03-31T10:05:00.000Z",
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
        unrealizedPnl: 0,
        totalPnl: 0,
        grossProfit: 0,
        grossLoss: 0,
        feesPaid: 0,
      },
    }));

    listBotRuntimeSessionPositionsMock.mockImplementation(async (_botId: string, sessionId: string) => ({
      sessionId,
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
    }));

    listBotRuntimeSessionTradesMock.mockImplementation(async (_botId: string, sessionId: string) => ({
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
      window: {
        startedAt: "2026-03-31T10:00:00.000Z",
        finishedAt: "2026-03-31T10:05:00.000Z",
      },
      items: [],
    }));

    renderSubject();

    let selector: HTMLSelectElement;
    await waitFor(() => {
      const selectorLabel = screen.getByText(/Wybrany bot|Selected bot/i).closest("label");
      expect(selectorLabel).not.toBeNull();
      selector = within(selectorLabel as HTMLLabelElement).getByRole("combobox") as HTMLSelectElement;
      expect(selector.value).toBe("bot-strategy-a");
      expect(screen.getByText("A symbols")).toBeInTheDocument();
      expect(screen.queryByText("B symbols")).not.toBeInTheDocument();
      expect(screen.getByText("Alpha Strategy")).toBeInTheDocument();
      expect(screen.queryByText("Shared stale strategy")).not.toBeInTheDocument();
    });

    fireEvent.change(selector!, { target: { value: "bot-strategy-b" } });

    await waitFor(() => {
      expect(selector!.value).toBe("bot-strategy-b");
      expect(screen.getByText("B symbols")).toBeInTheDocument();
      expect(screen.queryByText("A symbols")).not.toBeInTheDocument();
      expect(screen.getByText("Beta Strategy")).toBeInTheDocument();
      expect(screen.queryByText("Alpha Strategy")).not.toBeInTheDocument();
      expect(screen.queryByText("Shared stale strategy")).not.toBeInTheDocument();
    });
  });


  it("renders strategy signals above open positions and enables rail controls for larger symbol sets", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-rail",
        name: "Rail Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-rail",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);
    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-rail",
        botId: "bot-rail",
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
        symbolsTracked: 5,
        summary: {
          totalSignals: 0,
          dcaCount: 0,
          closedTrades: 0,
          realizedPnl: 0,
        },
      },
    ]);
    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId: "session-rail",
      items: ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"].map((symbol, index) => ({
        id: `stat-rail-${index + 1}`,
        userId: "u-rail",
        botId: "bot-rail",
        sessionId: "session-rail",
        symbol,
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
        lastPrice: null,
        lastSignalAt: null,
        lastSignalDirection: null,
        lastSignalDecisionAt: "2026-03-31T10:05:00.000Z",
        lastSignalContextSource: "latest_decision",
        lastTradeAt: null,
        snapshotAt: "2026-03-31T10:05:00.000Z",
        createdAt: "2026-03-31T10:05:00.000Z",
        updatedAt: "2026-03-31T10:05:00.000Z",
      })),
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
      sessionId: "session-rail",
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
      sessionId: "session-rail",
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

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Wstecz|Prev/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Dalej|Next/i })).toBeInTheDocument();
      expect(screen.getAllByText("SOLUSDT").length).toBeGreaterThan(0);
    });

    const [signalsAnchor] = screen.getAllByText("SOLUSDT");
    const openPositionsTab = screen.getByRole("tab", { name: /Pozycje|Positions/i });
    expect(openPositionsTab.compareDocumentPosition(signalsAnchor) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("keeps signal and context cards scoped when switching selected bot from A(1) to B(4)", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-scope-a",
        name: "A Scope Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-scope-a",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
      {
        id: "bot-scope-b",
        name: "B Scope Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-scope-b",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);

    listBotRuntimeSessionsMock.mockImplementation(async (botId: string) => {
      if (botId === "bot-scope-a") {
        return [
          {
            id: "session-scope-a",
            botId,
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
        ];
      }
      return [
        {
          id: "session-scope-b",
          botId,
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
          eventsCount: 4,
          symbolsTracked: 4,
          summary: {
            totalSignals: 4,
            dcaCount: 0,
            closedTrades: 0,
            realizedPnl: 0,
          },
        },
      ];
    });

    listBotRuntimeSessionSymbolStatsMock.mockImplementation(async (botId: string, sessionId: string) => {
      if (botId === "bot-scope-a") {
        return {
          sessionId,
          items: [
            {
              id: "stat-scope-a-1",
              userId: "u-scope",
              botId,
              sessionId,
              symbol: "ADAUSDT",
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
              openPositionCount: 0,
              openPositionQty: 0,
              unrealizedPnl: 0,
              lastPrice: 1.01,
              lastSignalAt: "2026-03-31T10:05:00.000Z",
              lastSignalDirection: null,
              lastSignalDecisionAt: null,
              lastSignalContextSource: "configured_fallback",
              configuredStrategyName: "Scope A Strategy",
              lastSignalConditionLines: [
                {
                  scope: "LONG",
                  left: "A_CTX_FAST",
                  operator: ">",
                  right: "A_CTX_SLOW",
                  value: "ACTIVE",
                },
              ],
              lastTradeAt: null,
              snapshotAt: "2026-03-31T10:05:00.000Z",
              createdAt: "2026-03-31T10:05:00.000Z",
              updatedAt: "2026-03-31T10:05:00.000Z",
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
            unrealizedPnl: 0,
            totalPnl: 0,
            grossProfit: 0,
            grossLoss: 0,
            feesPaid: 0,
          },
        };
      }

      const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT"];
      return {
        sessionId,
        items: symbols.map((symbol, index) => ({
          id: `stat-scope-b-${index + 1}`,
          userId: "u-scope",
          botId,
          sessionId,
          symbol,
          totalSignals: 1,
          longEntries: index % 2 === 0 ? 1 : 0,
          shortEntries: index % 2 === 1 ? 1 : 0,
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
          lastPrice: 100 + index,
          lastSignalAt: "2026-03-31T10:05:00.000Z",
          lastSignalDirection: index % 2 === 0 ? "LONG" : "SHORT",
          lastSignalDecisionAt: "2026-03-31T10:05:00.000Z",
          lastSignalContextSource: index % 2 === 0 ? "latest_signal" : "configured_fallback",
          configuredStrategyName: index % 2 === 0 ? null : `Scope B Strategy ${index + 1}`,
          lastSignalConditionLines: [
            {
              scope: index % 2 === 0 ? "LONG" : "SHORT",
              left: `B_CTX_${index + 1}`,
              operator: ">",
              right: `B_REF_${index + 1}`,
              value: "ACTIVE",
            },
          ],
          lastTradeAt: null,
          snapshotAt: "2026-03-31T10:05:00.000Z",
          createdAt: "2026-03-31T10:05:00.000Z",
          updatedAt: "2026-03-31T10:05:00.000Z",
        })),
        summary: {
          totalSignals: 4,
          longEntries: 2,
          shortEntries: 2,
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
      };
    });

    listBotRuntimeSessionPositionsMock.mockImplementation(async (_botId: string, sessionId: string) => ({
      sessionId,
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
    }));

    listBotRuntimeSessionTradesMock.mockImplementation(async (_botId: string, sessionId: string) => ({
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
      window: {
        startedAt: "2026-03-31T10:00:00.000Z",
        finishedAt: "2026-03-31T10:05:00.000Z",
      },
      items: [],
    }));

    renderSubject();

    let selector: HTMLSelectElement;
    await waitFor(() => {
      const selectorLabel = screen.getByText(/Wybrany bot|Selected bot/i).closest("label");
      expect(selectorLabel).not.toBeNull();
      selector = within(selectorLabel as HTMLLabelElement).getByRole("combobox") as HTMLSelectElement;
      expect(selector.value).toBe("bot-scope-a");
      expect(screen.getByText("A_CTX_FAST")).toBeInTheDocument();
      expect(screen.queryAllByText("SOLUSDT")).toHaveLength(0);
      expect(screen.queryByRole("button", { name: /Wstecz|Prev/i })).toBeNull();
      expect(screen.queryByRole("button", { name: /Dalej|Next/i })).toBeNull();
    });

    fireEvent.change(selector!, { target: { value: "bot-scope-b" } });

    await waitFor(() => {
      expect(selector!.value).toBe("bot-scope-b");
      expect(screen.queryByText("A_CTX_FAST")).not.toBeInTheDocument();
      expect(screen.getAllByText("BTCUSDT").length).toBeGreaterThan(0);
      expect(screen.getAllByText("ETHUSDT").length).toBeGreaterThan(0);
      expect(screen.getAllByText("SOLUSDT").length).toBeGreaterThan(0);
      expect(screen.getAllByText("XRPUSDT").length).toBeGreaterThan(0);
      expect(screen.getByText("B_CTX_1")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Wstecz|Prev/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Dalej|Next/i })).toBeInTheDocument();
    });
  });

  it("renders LIVE wallet metrics from runtime capital snapshot in sidebar widget", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-live-wallet",
        name: "Live Wallet Bot",
        mode: "LIVE",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-live-wallet",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
        wallet: {
          id: "wallet-live-1",
          name: "Glowny",
          mode: "LIVE",
          exchange: "BINANCE",
          marketType: "FUTURES",
          baseCurrency: "USDT",
          paperInitialBalance: 10000,
          liveAllocationMode: "PERCENT",
          liveAllocationValue: 100,
        },
      },
    ]);

    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-live-wallet",
        botId: "bot-live-wallet",
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
        eventsCount: 2,
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
      sessionId: "session-live-wallet",
      items: [
        {
          id: "stat-live-wallet",
          userId: "u-live",
          botId: "bot-live-wallet",
          sessionId: "session-live-wallet",
          symbol: "BTCUSDT",
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
          openPositionQty: 0.01,
          unrealizedPnl: 0,
          lastPrice: 70000,
          lastSignalAt: "2026-03-31T10:04:00.000Z",
          lastSignalDirection: "LONG",
          lastSignalDecisionAt: "2026-03-31T10:04:00.000Z",
          lastTradeAt: "2026-03-31T10:03:00.000Z",
          snapshotAt: "2026-03-31T10:05:00.000Z",
          createdAt: "2026-03-31T10:05:00.000Z",
          updatedAt: "2026-03-31T10:05:00.000Z",
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
        unrealizedPnl: 0,
        totalPnl: 0,
        grossProfit: 0,
        grossLoss: 0,
        feesPaid: 0,
      },
    });

    listBotRuntimeSessionPositionsMock.mockResolvedValue({
      sessionId: "session-live-wallet",
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
        unrealizedPnl: 0,
        feesPaid: 0,
        referenceBalance: 100,
        freeCash: 98.84,
      },
      openOrders: [],
      openItems: [
        {
          id: "pos-live-wallet",
          symbol: "BTCUSDT",
          side: "LONG",
          status: "OPEN",
          quantity: 0.01,
          leverage: 10,
          entryPrice: 1160,
          entryNotional: 11.6,
          exitPrice: null,
          stopLoss: null,
          takeProfit: null,
          openedAt: "2026-03-31T10:03:00.000Z",
          closedAt: null,
          holdMs: 120000,
          dcaCount: 0,
          dcaPlannedLevels: [],
          dcaExecutedLevels: [],
          feesPaid: 0,
          realizedPnl: 0,
          unrealizedPnl: 0,
          markPrice: 1160,
          dynamicTtpStopLoss: null,
          dynamicTslStopLoss: null,
          firstTradeAt: "2026-03-31T10:03:00.000Z",
          lastTradeAt: "2026-03-31T10:03:00.000Z",
          tradesCount: 1,
        },
      ],
      historyItems: [],
    });

    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId: "session-live-wallet",
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

    renderSubject();

    await waitFor(() => {
      expect(screen.getByText(/100[,.]00\s*USDT/)).toBeInTheDocument();
      expect(screen.getAllByText(/98[,.]84\s*USDT/).length).toBeGreaterThan(0);
      expect(screen.getByText(/1[,.]16\s*USDT/)).toBeInTheDocument();
    });
  });

  it("renders LIVE wallet metrics from compatibility capital fields when referenceBalance/freeCash are absent", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-live-wallet-compat",
        name: "Live Wallet Compat",
        mode: "LIVE",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-live-wallet-compat",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
        wallet: {
          id: "wallet-live-compat-1",
          name: "Glowny",
          mode: "LIVE",
          exchange: "BINANCE",
          marketType: "FUTURES",
          baseCurrency: "USDT",
          paperInitialBalance: 10000,
          liveAllocationMode: "PERCENT",
          liveAllocationValue: 100,
        },
      },
    ]);

    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-live-wallet-compat",
        botId: "bot-live-wallet-compat",
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
        eventsCount: 2,
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
      sessionId: "session-live-wallet-compat",
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
      sessionId: "session-live-wallet-compat",
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
        unrealizedPnl: 0,
        feesPaid: 0,
        accountBalance: 200,
        availableBalance: 194.2,
      },
      openOrders: [],
      openItems: [
        {
          id: "pos-live-wallet-compat",
          symbol: "BTCUSDT",
          side: "LONG",
          status: "OPEN",
          quantity: 0.01,
          leverage: 10,
          entryPrice: 5800,
          entryNotional: 58,
          exitPrice: null,
          stopLoss: null,
          takeProfit: null,
          openedAt: "2026-03-31T10:03:00.000Z",
          closedAt: null,
          holdMs: 120000,
          dcaCount: 0,
          dcaPlannedLevels: [],
          dcaExecutedLevels: [],
          feesPaid: 0,
          realizedPnl: 0,
          unrealizedPnl: 0,
          markPrice: 5800,
          dynamicTtpStopLoss: null,
          dynamicTslStopLoss: null,
          firstTradeAt: "2026-03-31T10:03:00.000Z",
          lastTradeAt: "2026-03-31T10:03:00.000Z",
          tradesCount: 1,
        },
      ],
      historyItems: [],
    });

    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId: "session-live-wallet-compat",
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

    renderSubject();

    await waitFor(() => {
      const walletKpiRow = screen.getByTestId("wallet-kpi-row");
      expect(walletKpiRow).toBeInTheDocument();
      expect(walletKpiRow.className).toMatch(/grid-cols-2/i);

      const allocationRow = screen.getByTestId("wallet-kpi-allocation-row");
      const deltaRow = screen.getByTestId("wallet-kpi-delta-row");
      const portfolioRow = screen.getByTestId("wallet-kpi-portfolio");
      const freeFundsCard = screen.getByTestId("wallet-kpi-free-funds");
      const inPositionsCard = screen.getByTestId("wallet-kpi-in-positions");

      expect(allocationRow.compareDocumentPosition(deltaRow) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(deltaRow.compareDocumentPosition(portfolioRow) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(portfolioRow.className).not.toMatch(/rounded-box|border/i);
      expect(within(portfolioRow).getByText(/Portfel|Portfolio/i)).toBeInTheDocument();
      expect(within(freeFundsCard).getByText(/Wolne srodki|Free funds/i)).toBeInTheDocument();
      expect(within(inPositionsCard).getByText(/W pozycjach|In positions/i)).toBeInTheDocument();

      expect(freeFundsCard.className).toMatch(/w-full/i);
      expect(inPositionsCard.className).toMatch(/w-full/i);
      expect(within(portfolioRow).getByText(/200/)).toBeInTheDocument();
      expect(within(freeFundsCard).getByText(/194/)).toBeInTheDocument();
      expect(within(inPositionsCard).getByText(/5/)).toBeInTheDocument();
    });
  });

  it("does not render takeover column for imported exchange positions in runtime table", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-takeover",
        name: "Takeover Bot",
        mode: "LIVE",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-takeover",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
      },
    ]);

    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-takeover",
        botId: "bot-takeover",
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
        eventsCount: 2,
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
      sessionId: "session-takeover",
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
      sessionId: "session-takeover",
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
        unrealizedPnl: 0,
        feesPaid: 0,
        referenceBalance: 100,
        freeCash: 94.2,
      },
      openOrders: [],
      openItems: [
        {
          id: "pos-takeover",
          origin: "EXCHANGE_SYNC",
          managementMode: "BOT_MANAGED",
          syncState: "IN_SYNC",
          takeoverStatus: "OWNED_AND_MANAGED",
          symbol: "BNBUSDT",
          side: "LONG",
          status: "OPEN",
          quantity: 0.1,
          leverage: 10,
          entryPrice: 580,
          entryNotional: 58,
          exitPrice: null,
          stopLoss: null,
          takeProfit: null,
          openedAt: "2026-03-31T10:03:00.000Z",
          closedAt: null,
          holdMs: 120000,
          dcaCount: 0,
          dcaPlannedLevels: [],
          dcaExecutedLevels: [],
          feesPaid: 0,
          realizedPnl: 0,
          unrealizedPnl: 0,
          markPrice: 580,
          dynamicTtpStopLoss: null,
          dynamicTslStopLoss: null,
          firstTradeAt: "2026-03-31T10:03:00.000Z",
          lastTradeAt: "2026-03-31T10:03:00.000Z",
          tradesCount: 1,
        },
      ],
      historyItems: [],
    });

    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId: "session-takeover",
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

    renderSubject();

    await waitFor(() => {
      expect(screen.queryByRole("columnheader", { name: "Takeover" })).not.toBeInTheDocument();
      expect(screen.queryByText("OWNED")).not.toBeInTheDocument();
      expect(screen.getAllByText("BNBUSDT").length).toBeGreaterThan(0);
    });
  });

  it("closes open runtime position from dashboard table action", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-close-position",
        name: "Close Position Bot",
        mode: "LIVE",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-close-position",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
      },
    ]);

    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-close-position",
        botId: "bot-close-position",
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
      sessionId: "session-close-position",
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
      sessionId: "session-close-position",
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
        unrealizedPnl: 0,
        feesPaid: 0,
        referenceBalance: 200,
        freeCash: 194,
      },
      openOrders: [],
      openItems: [
        {
          id: "pos-close-1",
          origin: "BOT",
          managementMode: "BOT_MANAGED",
          syncState: "IN_SYNC",
          takeoverStatus: "OWNED_AND_MANAGED",
          symbol: "BTCUSDT",
          side: "LONG",
          status: "OPEN",
          quantity: 0.01,
          leverage: 10,
          entryPrice: 68000,
          entryNotional: 68,
          exitPrice: null,
          stopLoss: null,
          takeProfit: null,
          openedAt: "2026-03-31T10:03:00.000Z",
          closedAt: null,
          holdMs: 120000,
          dcaCount: 0,
          dcaPlannedLevels: [],
          dcaExecutedLevels: [],
          feesPaid: 0,
          realizedPnl: 0,
          unrealizedPnl: 0,
          markPrice: 68000,
          dynamicTtpStopLoss: null,
          dynamicTslStopLoss: null,
          firstTradeAt: "2026-03-31T10:03:00.000Z",
          lastTradeAt: "2026-03-31T10:03:00.000Z",
          tradesCount: 1,
        },
      ],
      historyItems: [],
    });

    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId: "session-close-position",
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

    renderSubject();
    const openPositionsTab = await screen.findByRole("tab", { name: /Pozycje|Positions/i });
    fireEvent.click(openPositionsTab);
    const editButton = await screen.findByRole("button", { name: /Edytuj pozycje|Edit position/i });
    fireEvent.click(editButton);
    expect(await screen.findByLabelText(/Take profit \(TP\)/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Stop loss \(SL\)/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Notes|Notatki|Notas/i)).toBeInTheDocument();
    const closeButton = await screen.findByRole("button", { name: /Zamknij pozycje|Close position/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(closeBotRuntimeSessionPositionMock).toHaveBeenCalledWith(
        "bot-close-position",
        "session-close-position",
        "pos-close-1",
        { riskAck: true }
      );
    });
  });

  it("renders runtime open positions even when symbol stats are temporarily empty", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-external-runtime",
        name: "External Runtime Bot",
        mode: "LIVE",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-external-runtime",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
      },
    ]);

    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-external-runtime",
        botId: "bot-external-runtime",
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
      sessionId: "session-external-runtime",
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
      sessionId: "session-external-runtime",
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
        unrealizedPnl: 0,
        feesPaid: 0,
        referenceBalance: 200,
        freeCash: 198,
      },
      openOrders: [],
      openItems: [
        {
          id: "pos-external-runtime",
          symbol: "BNBUSDT",
          side: "LONG",
          status: "OPEN",
          quantity: 0.1,
          leverage: 10,
          entryPrice: 580,
          entryNotional: 58,
          exitPrice: null,
          stopLoss: null,
          takeProfit: null,
          openedAt: "2026-03-31T10:03:00.000Z",
          closedAt: null,
          holdMs: 120000,
          dcaCount: 0,
          dcaPlannedLevels: [],
          dcaExecutedLevels: [],
          feesPaid: 0,
          realizedPnl: 0,
          unrealizedPnl: 0,
          markPrice: 580,
          dynamicTtpStopLoss: null,
          dynamicTslStopLoss: null,
          firstTradeAt: "2026-03-31T10:03:00.000Z",
          lastTradeAt: "2026-03-31T10:03:00.000Z",
          tradesCount: 1,
        },
      ],
      historyItems: [],
    });

    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId: "session-external-runtime",
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

    renderSubject();

    await waitFor(() => {
      expect(screen.getAllByText("BNBUSDT").length).toBeGreaterThan(0);
    });
  });

  it("switches runtime polling cadence to 30s when tab becomes hidden", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const setIntervalSpy = vi.spyOn(window, "setInterval");
    let visibilityState: DocumentVisibilityState = "visible";
    const visibilityDescriptor = Object.getOwnPropertyDescriptor(document, "visibilityState");
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => visibilityState,
    });

    listBotsMock.mockResolvedValue([
      {
        id: "bot-visibility",
        name: "Visibility Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-visibility",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);
    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-visibility",
        botId: "bot-visibility",
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
      sessionId: "session-visibility",
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
      sessionId: "session-visibility",
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
      sessionId: "session-visibility",
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

    renderSubject();

    await waitFor(() => {
      expect(listBotRuntimeSessionsMock).toHaveBeenCalled();
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 10_000);
    });

    visibilityState = "hidden";
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    await waitFor(() => {
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30_000);
    });

    setIntervalSpy.mockRestore();
    if (visibilityDescriptor) {
      Object.defineProperty(document, "visibilityState", visibilityDescriptor);
    }
  });

  it("shows stale-data warning after refresh gaps and clears it after fresh payload arrives", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    let shouldFailRefresh = false;

    listBotsMock.mockResolvedValue([
      {
        id: "bot-stale",
        name: "Stale Guard Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-stale",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);

    listBotRuntimeSessionsMock.mockImplementation(async () => {
      if (shouldFailRefresh) throw new Error("stale-refresh");
      return [
        {
          id: "session-stale",
          botId: "bot-stale",
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
          eventsCount: 4,
          symbolsTracked: 1,
          summary: {
            totalSignals: 2,
            dcaCount: 0,
            closedTrades: 1,
            realizedPnl: 10,
          },
        },
      ];
    });

    listBotRuntimeSessionSymbolStatsMock.mockImplementation(async () => {
      if (shouldFailRefresh) throw new Error("stale-refresh");
      return {
        sessionId: "session-stale",
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
      };
    });

    listBotRuntimeSessionPositionsMock.mockImplementation(async () => {
      if (shouldFailRefresh) throw new Error("stale-refresh");
      return {
        sessionId: "session-stale",
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
      };
    });

    listBotRuntimeSessionTradesMock.mockImplementation(async () => {
      if (shouldFailRefresh) throw new Error("stale-refresh");
      return {
        sessionId: "session-stale",
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
      };
    });

    renderSubject();

    await waitFor(() => {
      expect(screen.getByText(/Aktualizacja:/i)).toBeInTheDocument();
    });

    shouldFailRefresh = true;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(21_000);
    });

    await waitFor(() => {
      expect(screen.getByText(/Dane runtime moga byc przestarzale/i)).toBeInTheDocument();
    });

    shouldFailRefresh = false;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(11_000);
    });

    await waitFor(() => {
      expect(screen.queryByText(/Dane runtime moga byc przestarzale/i)).not.toBeInTheDocument();
    });
  }, 20_000);

  it("supports apply-based filters, tri-state sorting and preserves state on auto-refresh", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    listBotsMock.mockResolvedValue([
      {
        id: "bot-2",
        name: "Filter Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-2",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);
    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-2",
        botId: "bot-2",
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
        eventsCount: 2,
        symbolsTracked: 1,
        summary: {
          totalSignals: 2,
          dcaCount: 0,
          closedTrades: 1,
          realizedPnl: 15,
        },
      },
    ]);
    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId: "session-2",
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
      sessionId: "session-2",
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
      sessionId: "session-2",
      total: 3,
      meta: {
        page: 1,
        pageSize: 25,
        total: 3,
        totalPages: 2,
        hasPrev: false,
        hasNext: true,
      },
      window: {
        startedAt: "2026-03-31T10:00:00.000Z",
        finishedAt: "2026-03-31T10:05:00.000Z",
      },
      items: [
        {
          id: "trade-2",
          symbol: "BTCUSDT",
          side: "SELL",
          lifecycleAction: "CLOSE",
          price: 68100,
          quantity: 0.05,
          fee: 2,
          feeSource: "EXCHANGE_FILL",
          feePending: false,
          feeCurrency: "USDT",
          realizedPnl: 12,
          executedAt: "2026-03-31T10:03:00.000Z",
          orderId: "ord-2",
          positionId: "pos-2",
          strategyId: "str-2",
          origin: "BOT",
          managementMode: "BOT",
          notional: 3405,
          margin: 227,
        },
      ],
    });

    renderSubject();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
    });

    await waitFor(() => {
      expect(listBotRuntimeSessionTradesMock).toHaveBeenCalledWith(
        "bot-2",
        "session-2",
        expect.objectContaining({ limit: 200 })
      );
    });

    expect(screen.queryByRole("option", { name: /Unknown/i })).not.toBeInTheDocument();

    const tradeHistoryTab = screen.getByRole("tab", { name: /Historia|History/i });
    fireEvent.click(tradeHistoryTab);

    const callsAfterInitialLoad = listBotRuntimeSessionTradesMock.mock.calls.length;
    fireEvent.click(screen.getByRole("button", { name: /Opcje zaawansowane/i }));
    fireEvent.change(screen.getAllByPlaceholderText("BTCUSDT").at(-1) as HTMLInputElement, { target: { value: "btcusdt" } });
    fireEvent.change(screen.getAllByLabelText("Side").at(-1) as HTMLSelectElement, { target: { value: "SELL" } });
    fireEvent.change(screen.getByLabelText("Action"), { target: { value: "CLOSE" } });
    fireEvent.change(screen.getByLabelText("Od"), { target: { value: "2026-03-31T10:00" } });
    fireEvent.change(screen.getByLabelText("Do"), { target: { value: "2026-03-31T10:15" } });

    expect(listBotRuntimeSessionTradesMock.mock.calls.length).toBe(callsAfterInitialLoad);

    fireEvent.click(screen.getByRole("button", { name: "Zastosuj" }));
    expect(listBotRuntimeSessionTradesMock.mock.calls.length).toBe(callsAfterInitialLoad);

    const historyTab = screen.getByRole("tab", { name: /Historia|History/i });
    fireEvent.click(historyTab);

    const marginSortButton = screen.getByRole("button", { name: /Margin/i });
    expect(marginSortButton).not.toBeNull();
    const callsAfterFilterApply = listBotRuntimeSessionTradesMock.mock.calls.length;

    fireEvent.click(marginSortButton!);
    expect(listBotRuntimeSessionTradesMock.mock.calls.length).toBe(callsAfterFilterApply);

    fireEvent.click(marginSortButton!);
    expect(listBotRuntimeSessionTradesMock.mock.calls.length).toBe(callsAfterFilterApply);

    fireEvent.click(marginSortButton!);
    expect(listBotRuntimeSessionTradesMock.mock.calls.length).toBe(callsAfterFilterApply);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_100);
    });

    const lastParams = listBotRuntimeSessionTradesMock.mock.calls.at(-1)?.[2] as Record<string, unknown>;
    expect(lastParams).toMatchObject({ limit: 200 });
    expect((screen.getAllByPlaceholderText("BTCUSDT").at(-1) as HTMLInputElement).value).toBe("btcusdt");
    expect((screen.getAllByLabelText("Side").at(-1) as HTMLSelectElement).value).toBe("SELL");
    expect((screen.getByLabelText("Action") as HTMLSelectElement).value).toBe("CLOSE");
  }, 15_000);
});

describe("resolveSelectedStrategyDisplay", () => {
  const t = (key: string) => (key === "dashboard.home.runtime.reasonUnknown" ? "Unknown" : key);

  it("prefers canonical runtime graph strategy over stale direct bot strategy projection", () => {
    const strategyName = resolveSelectedStrategyDisplay(
      {
        bot: {
          id: "bot-1",
          name: "Runtime bot",
          mode: "PAPER",
          paperStartBalance: 10_000,
          exchange: "BINANCE",
          marketType: "FUTURES",
          positionMode: "ONE_WAY",
          strategyId: "legacy-strategy",
          isActive: true,
          liveOptIn: false,
          manageExternalPositions: false,
          maxOpenPositions: 1,
          strategy: {
            id: "legacy-strategy",
            name: "Legacy Strategy",
            interval: "15m",
            leverage: 5,
            walletRisk: 1,
          },
        },
        session: null,
        symbolStats: null,
        positions: null,
        trades: null,
        runtimeGraph: {
          bot: {
            id: "bot-1",
            userId: "user-1",
            name: "Runtime bot",
            mode: "PAPER",
            marketType: "FUTURES",
            positionMode: "ONE_WAY",
            strategyId: "legacy-strategy",
            isActive: true,
            liveOptIn: false,
            manageExternalPositions: false,
            maxOpenPositions: 1,
            createdAt: "2026-05-03T00:00:00.000Z",
            updatedAt: "2026-05-03T00:00:00.000Z",
          },
          marketGroups: [
            {
              id: "bot-market-group-1",
              botId: "bot-1",
              symbolGroupId: "canonical-group",
              lifecycleStatus: "ACTIVE",
              executionOrder: 1,
              isEnabled: true,
              createdAt: "2026-05-03T00:00:00.000Z",
              updatedAt: "2026-05-03T00:00:00.000Z",
              symbolGroup: {
                id: "canonical-group",
                name: "Canonical group",
                symbols: ["BTCUSDT"],
                marketUniverseId: "market-universe-1",
              },
              strategies: [
                {
                  id: "strategy-link-1",
                  strategyId: "canonical-strategy",
                  priority: 1,
                  weight: 1,
                  isEnabled: true,
                  createdAt: "2026-05-03T00:00:00.000Z",
                  updatedAt: "2026-05-03T00:00:00.000Z",
                  strategy: {
                    id: "canonical-strategy",
                    name: "Canonical Strategy",
                    interval: "5m",
                    leverage: 10,
                  },
                },
              ],
            },
          ],
          legacyBotStrategies: [],
        },
      },
      t
    );

    expect(strategyName).toBe("Canonical Strategy");
  });
});

describe("buildFallbackRuntimeTradeMeta", () => {
  it("keeps empty fallback pagination aligned with runtime API metadata", () => {
    expect(buildFallbackRuntimeTradeMeta({ page: 1, pageSize: 10, total: 0 })).toEqual({
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
      hasPrev: false,
      hasNext: false,
    });
  });

  it("clamps fallback page metadata for non-empty local rows", () => {
    expect(buildFallbackRuntimeTradeMeta({ page: 4, pageSize: 10, total: 25 })).toEqual({
      page: 3,
      pageSize: 10,
      total: 25,
      totalPages: 3,
      hasPrev: true,
      hasNext: false,
    });
  });
});
