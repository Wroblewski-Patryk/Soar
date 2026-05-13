import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

const renderSubject = async () => {
  window.localStorage.setItem("cryptosparrow-locale", "pl");
  window.history.pushState({}, "", "/dashboard");
  let view: ReturnType<typeof render>;
  await act(async () => {
    view = render(
      <I18nProvider>
        <HomeLiveWidgets />
      </I18nProvider>
    );
  });
  await waitFor(() => {
    expect(document.documentElement.lang).toBe("pl");
  });
  return view!;
};

describe("HomeLiveWidgets aggregate history parity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lookupCoinIconsMock.mockResolvedValue(new Map());
    getBotRuntimeGraphMock.mockResolvedValue({
      bot: {
        id: "bot-default",
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
      marketGroups: [],
      legacyBotStrategies: [],
    });

    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue({
      sessionId: "session-1",
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
    });
    listBotRuntimeSessionPositionsMock.mockResolvedValue({
      sessionId: "session-1",
      total: 0,
      openCount: 0,
      closedCount: 0,
      openOrdersCount: 0,
      showDynamicStopColumns: false,
      window: {
        startedAt: "2026-03-31T10:00:00.000Z",
        finishedAt: "2026-03-31T10:05:00.000Z",
      },
      summary: { realizedPnl: 0, unrealizedPnl: 0, feesPaid: 0 },
      openOrders: [],
      openItems: [],
      historyItems: [],
    });
    listBotRuntimeSessionTradesMock.mockResolvedValue({
      sessionId: "session-1",
      total: 0,
      meta: { page: 1, pageSize: 25, total: 0, totalPages: 0, hasPrev: false, hasNext: false },
      window: {
        startedAt: "2026-03-31T10:00:00.000Z",
        finishedAt: "2026-03-31T10:05:00.000Z",
      },
      items: [],
    });

    getDashboardManualOrderContextMock.mockResolvedValue({
      botId: "bot-default",
      symbol: "BTCUSDT",
      mode: "PAPER",
      orderType: "MARKET",
      marginMode: "CROSSED",
      leverage: 5,
      priceReference: { markPrice: 65000, source: "exchange_mark" },
      quantityConstraints: {
        minAmount: 0.001,
        amountPrecision: 0.001,
        minNotional: 10,
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
  });

  afterEach(() => {
    cleanup();
    window.history.pushState({}, "", "/");
    window.localStorage.clear();
  });

  it("keeps selected-bot history visible from aggregate scope when RUNNING session is empty", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-history-session-guard",
        name: "History Guard Bot",
        walletId: "wallet-history-session-guard",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-history-session-guard",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);

    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-history-current",
        botId: "bot-history-session-guard",
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
        summary: { totalSignals: 1, dcaCount: 0, closedTrades: 0, realizedPnl: 0 },
      },
      {
        id: "session-history-legacy",
        botId: "bot-history-session-guard",
        mode: "PAPER",
        status: "COMPLETED",
        startedAt: "2026-03-31T09:00:00.000Z",
        finishedAt: "2026-03-31T09:30:00.000Z",
        lastHeartbeatAt: "2026-03-31T09:30:00.000Z",
        stopReason: null,
        errorMessage: null,
        createdAt: "2026-03-31T09:00:00.000Z",
        updatedAt: "2026-03-31T09:30:00.000Z",
        durationMs: 1800000,
        eventsCount: 4,
        symbolsTracked: 1,
        summary: { totalSignals: 4, dcaCount: 0, closedTrades: 1, realizedPnl: 12 },
      },
    ]);

    getBotRuntimeMonitoringAggregateMock.mockResolvedValue({
      sessionDetail: {
        id: "AGGREGATE",
        botId: "bot-history-session-guard",
        mode: "PAPER",
        status: "RUNNING",
        startedAt: "2026-03-31T09:00:00.000Z",
        finishedAt: "2026-03-31T10:05:00.000Z",
        lastHeartbeatAt: "2026-03-31T10:05:00.000Z",
        stopReason: null,
        errorMessage: null,
        metadata: { aggregate: true, sessionsCount: 2 },
        createdAt: "2026-03-31T09:00:00.000Z",
        updatedAt: "2026-03-31T10:05:00.000Z",
        durationMs: 2100000,
        eventsCount: 5,
        symbolsTracked: 1,
        summary: {
          totalSignals: 5,
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
          feesPaid: 1.1,
          openPositionCount: 0,
          openPositionQty: 0,
        },
      },
      symbolStats: {
        sessionId: "AGGREGATE",
        items: [{ id: "stat-aggregate-1", symbol: "BTCUSDT", lastSignalDirection: "LONG" }],
        summary: {
          totalSignals: 5,
          longEntries: 1,
          shortEntries: 0,
          exits: 1,
          dcaCount: 0,
          closedTrades: 1,
          winningTrades: 1,
          losingTrades: 0,
          realizedPnl: 12,
          unrealizedPnl: 0,
          totalPnl: 12,
          grossProfit: 12,
          grossLoss: 0,
          feesPaid: 1.1,
          openPositionCount: 0,
          openPositionQty: 0,
        },
      },
      positions: {
        sessionId: "AGGREGATE",
        total: 1,
        openCount: 0,
        closedCount: 1,
        openOrdersCount: 0,
        showDynamicStopColumns: false,
        window: {
          startedAt: "2026-03-31T09:00:00.000Z",
          finishedAt: "2026-03-31T10:05:00.000Z",
        },
        summary: { realizedPnl: 12, unrealizedPnl: 0, feesPaid: 1.1 },
        openOrders: [],
        openItems: [],
        historyItems: [
          {
            id: "position-history-legacy-1",
            origin: "BOT",
            managementMode: "BOT_MANAGED",
            symbol: "LEGACYPOSUSDT",
            side: "LONG",
            status: "CLOSED",
            closeReason: "EXTERNAL_SYNC_MISSING",
            closeInitiator: "USER_EXCHANGE",
            quantity: 1,
            leverage: 3,
            entryPrice: 111,
            entryNotional: 111,
            exitPrice: 123,
            stopLoss: null,
            takeProfit: null,
            openedAt: "2026-03-31T09:00:00.000Z",
            closedAt: "2026-03-31T09:20:00.000Z",
            holdMs: 1_200_000,
            dcaCount: 0,
            feesPaid: 0.1,
            realizedPnl: 12,
            unrealizedPnl: 0,
            markPrice: null,
            firstTradeAt: "2026-03-31T09:00:00.000Z",
            lastTradeAt: "2026-03-31T09:20:00.000Z",
            tradesCount: 2,
          },
        ],
      },
      trades: {
        sessionId: "AGGREGATE",
        total: 1,
        meta: { page: 1, pageSize: 25, total: 1, totalPages: 1, hasPrev: false, hasNext: false },
        window: {
          startedAt: "2026-03-31T09:00:00.000Z",
          finishedAt: "2026-03-31T10:05:00.000Z",
        },
        items: [
          {
            id: "trade-history-legacy-1",
            symbol: "LEGACYUSDT",
            side: "SELL",
            lifecycleAction: "CLOSE",
            closeReason: "EXTERNAL_SYNC_MISSING",
            closeInitiator: "USER_EXCHANGE",
            price: 123,
            quantity: 1,
            fee: 0.1,
            feeSource: "EXCHANGE_FILL",
            feePending: false,
            feeCurrency: "USDT",
            realizedPnl: 12,
            executedAt: "2026-03-31T09:20:00.000Z",
            orderId: "order-legacy-1",
            positionId: "position-legacy-1",
            strategyId: "str-history-session-guard",
            origin: "BOT",
            managementMode: "BOT_MANAGED",
            notional: 123,
            margin: 12.3,
          },
        ],
      },
    });

    await renderSubject();

    const tradeHistoryTab = await screen.findByRole("tab", { name: /Historia|History/i });
    fireEvent.click(tradeHistoryTab);

    expect(await screen.findByText("LEGACYPOSUSDT")).toBeInTheDocument();
    expect(screen.getByText("Zamkniete pozycje")).toBeInTheDocument();
    expect(await screen.findByText("LEGACYUSDT")).toBeInTheDocument();
    expect(screen.getAllByText("Uzytkownik na gieldzie")).toHaveLength(2);
    expect(screen.getByText("20m")).toBeInTheDocument();
  });

  it("renders aggregate current open rows while keeping completed-session history visible", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-current-aggregate-render",
        name: "Current Aggregate Bot",
        walletId: "wallet-current-aggregate-render",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-current-aggregate-render",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);

    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-current-running",
        botId: "bot-current-aggregate-render",
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
        summary: { totalSignals: 2, dcaCount: 0, closedTrades: 0, realizedPnl: 0 },
      },
      {
        id: "session-current-completed",
        botId: "bot-current-aggregate-render",
        mode: "PAPER",
        status: "COMPLETED",
        startedAt: "2026-03-31T09:00:00.000Z",
        finishedAt: "2026-03-31T09:30:00.000Z",
        lastHeartbeatAt: "2026-03-31T09:30:00.000Z",
        stopReason: null,
        errorMessage: null,
        createdAt: "2026-03-31T09:00:00.000Z",
        updatedAt: "2026-03-31T09:30:00.000Z",
        durationMs: 1800000,
        eventsCount: 4,
        symbolsTracked: 1,
        summary: { totalSignals: 4, dcaCount: 0, closedTrades: 1, realizedPnl: 15 },
      },
    ]);

    getBotRuntimeMonitoringAggregateMock.mockResolvedValue({
      sessionDetail: {
        id: "AGGREGATE",
        botId: "bot-current-aggregate-render",
        mode: "PAPER",
        status: "RUNNING",
        startedAt: "2026-03-31T09:00:00.000Z",
        finishedAt: null,
        lastHeartbeatAt: "2026-03-31T10:05:00.000Z",
        stopReason: null,
        errorMessage: null,
        metadata: { aggregate: true, sessionsCount: 2 },
        createdAt: "2026-03-31T09:00:00.000Z",
        updatedAt: "2026-03-31T10:05:00.000Z",
        durationMs: 2100000,
        eventsCount: 6,
        symbolsTracked: 2,
        summary: {
          totalSignals: 6,
          longEntries: 2,
          shortEntries: 0,
          exits: 1,
          dcaCount: 0,
          closedTrades: 1,
          winningTrades: 1,
          losingTrades: 0,
          realizedPnl: 15,
          grossProfit: 15,
          grossLoss: 0,
          feesPaid: 1.4,
          openPositionCount: 1,
          openPositionQty: 0.25,
        },
      },
      symbolStats: {
        sessionId: "AGGREGATE",
        items: [
          {
            id: "aggregate-current-open-stat",
            sessionId: "AGGREGATE",
            symbol: "CURRENTOPENUSDT",
            totalSignals: 2,
            longEntries: 1,
            shortEntries: 0,
            exits: 0,
            dcaCount: 0,
            closedTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            realizedPnl: 0,
            unrealizedPnl: 20,
            grossProfit: 0,
            grossLoss: 0,
            feesPaid: 0.4,
            openPositionCount: 1,
            openPositionQty: 0.25,
            lastPrice: 2100,
            lastSignalDirection: "LONG",
            snapshotAt: "2026-03-31T10:04:00.000Z",
          },
        ],
        summary: {
          totalSignals: 6,
          longEntries: 2,
          shortEntries: 0,
          exits: 1,
          dcaCount: 0,
          closedTrades: 1,
          winningTrades: 1,
          losingTrades: 0,
          realizedPnl: 15,
          unrealizedPnl: 20,
          totalPnl: 35,
          grossProfit: 15,
          grossLoss: 0,
          feesPaid: 1.4,
          openPositionCount: 1,
          openPositionQty: 0.25,
        },
      },
      positions: {
        sessionId: "AGGREGATE",
        total: 2,
        openCount: 1,
        closedCount: 1,
        openOrdersCount: 0,
        showDynamicStopColumns: false,
        window: {
          startedAt: "2026-03-31T09:00:00.000Z",
          finishedAt: "2026-03-31T10:05:00.000Z",
        },
        summary: {
          realizedPnl: 15,
          unrealizedPnl: 20,
          feesPaid: 1.4,
          referenceBalance: 10035,
          freeCash: 9982.5,
          accountBalance: 10035,
          baseCurrency: "USDT",
          capitalSource: "PAPER_RESET_CHECKPOINT",
          allocationMode: null,
          allocationValue: null,
          paperResetAt: null,
        },
        openOrders: [],
        openItems: [
          {
            id: "current-open-position",
            origin: "BOT",
            managementMode: "BOT_MANAGED",
            symbol: "CURRENTOPENUSDT",
            side: "LONG",
            status: "OPEN",
            quantity: 0.25,
            leverage: 10,
            entryPrice: 2000,
            entryNotional: 500,
            exitPrice: null,
            stopLoss: null,
            takeProfit: null,
            openedAt: "2026-03-31T10:02:00.000Z",
            closedAt: null,
            holdMs: 180000,
            dcaCount: 0,
            dcaPlannedLevels: [],
            dcaExecutedLevels: [],
            feesPaid: 0.4,
            realizedPnl: 0,
            unrealizedPnl: 20,
            markPrice: 2080,
            markPriceSource: "runtime_symbol_stat",
            dynamicTtpStopLoss: null,
            dynamicTslStopLoss: null,
            firstTradeAt: "2026-03-31T10:02:00.000Z",
            lastTradeAt: "2026-03-31T10:02:00.000Z",
            tradesCount: 1,
          },
        ],
        historyItems: [
          {
            id: "completed-history-position",
            origin: "BOT",
            managementMode: "BOT_MANAGED",
            symbol: "COMPLETEDHISTUSDT",
            side: "LONG",
            status: "CLOSED",
            closeReason: "MANUAL",
            closeInitiator: "USER_APP",
            quantity: 1,
            leverage: 5,
            entryPrice: 100,
            entryNotional: 100,
            exitPrice: 115,
            stopLoss: null,
            takeProfit: null,
            openedAt: "2026-03-31T09:00:00.000Z",
            closedAt: "2026-03-31T09:20:00.000Z",
            holdMs: 1200000,
            dcaCount: 0,
            feesPaid: 1,
            realizedPnl: 15,
            unrealizedPnl: 0,
            markPrice: null,
            firstTradeAt: "2026-03-31T09:00:00.000Z",
            lastTradeAt: "2026-03-31T09:20:00.000Z",
            tradesCount: 2,
          },
        ],
      },
      trades: {
        sessionId: "AGGREGATE",
        total: 1,
        meta: { page: 1, pageSize: 25, total: 1, totalPages: 1, hasPrev: false, hasNext: false },
        window: {
          startedAt: "2026-03-31T09:00:00.000Z",
          finishedAt: "2026-03-31T10:05:00.000Z",
        },
        items: [],
      },
    });

    await renderSubject();

    expect((await screen.findAllByText("CURRENTOPENUSDT")).length).toBeGreaterThan(0);
    expect(screen.queryByText("COMPLETEDHISTUSDT")).not.toBeInTheDocument();
    expect(getBotRuntimeMonitoringAggregateMock).toHaveBeenCalledWith("bot-current-aggregate-render", {
      sessionsLimit: 2,
      perSessionLimit: 200,
    });

    fireEvent.click(screen.getByRole("tab", { name: /Historia|History/i }));

    expect(await screen.findByText("COMPLETEDHISTUSDT")).toBeInTheDocument();
    expect(screen.getAllByText("CURRENTOPENUSDT").length).toBeGreaterThan(0);
  });

  it("re-scopes aggregate history positions and trades immediately after selected-bot switch", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-a",
        name: "Alpha Bot",
        walletId: "wallet-a",
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
        id: "bot-b",
        name: "Beta Bot",
        walletId: "wallet-b",
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

    listBotRuntimeSessionsMock.mockImplementation(async (botId: string) => [
      {
        id: `${botId}-session`,
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
        summary: { totalSignals: 1, dcaCount: 0, closedTrades: 1, realizedPnl: 5 },
      },
    ]);

    getBotRuntimeMonitoringAggregateMock.mockImplementation(async (botId: string) => {
      const isAlpha = botId === "bot-a";
      const historySymbol = isAlpha ? "ALPHAHISTUSDT" : "BETAHISTUSDT";
      const tradeSymbol = isAlpha ? "ALPHATRADEUSDT" : "BETATRADEUSDT";
      return {
        sessionDetail: {
          id: "AGGREGATE",
          botId,
          mode: "PAPER",
          status: "RUNNING",
          startedAt: "2026-03-31T10:00:00.000Z",
          finishedAt: "2026-03-31T10:05:00.000Z",
          lastHeartbeatAt: "2026-03-31T10:05:00.000Z",
          stopReason: null,
          errorMessage: null,
          metadata: { aggregate: true, sessionsCount: 1 },
          createdAt: "2026-03-31T10:00:00.000Z",
          updatedAt: "2026-03-31T10:05:00.000Z",
          durationMs: 300000,
          eventsCount: 1,
          symbolsTracked: 1,
          summary: {
            totalSignals: 1,
            longEntries: 1,
            shortEntries: 0,
            exits: 1,
            dcaCount: 0,
            closedTrades: 1,
            winningTrades: 1,
            losingTrades: 0,
            realizedPnl: 5,
            grossProfit: 5,
            grossLoss: 0,
            feesPaid: 0.2,
            openPositionCount: 0,
            openPositionQty: 0,
          },
        },
        symbolStats: {
          sessionId: "AGGREGATE",
          items: [{ id: `stat-${botId}`, symbol: "BTCUSDT", lastSignalDirection: "LONG" }],
          summary: {
            totalSignals: 1,
            longEntries: 1,
            shortEntries: 0,
            exits: 1,
            dcaCount: 0,
            closedTrades: 1,
            winningTrades: 1,
            losingTrades: 0,
            realizedPnl: 5,
            unrealizedPnl: 0,
            totalPnl: 5,
            grossProfit: 5,
            grossLoss: 0,
            feesPaid: 0.2,
            openPositionCount: 0,
            openPositionQty: 0,
          },
        },
        positions: {
          sessionId: "AGGREGATE",
          total: 1,
          openCount: 0,
          closedCount: 1,
          openOrdersCount: 0,
          showDynamicStopColumns: false,
          window: {
            startedAt: "2026-03-31T10:00:00.000Z",
            finishedAt: "2026-03-31T10:05:00.000Z",
          },
          summary: { realizedPnl: 5, unrealizedPnl: 0, feesPaid: 0.2 },
          openOrders: [],
          openItems: [],
          historyItems: [
            {
              id: `history-${botId}`,
              origin: "BOT",
              managementMode: "BOT_MANAGED",
              symbol: historySymbol,
              side: "LONG",
              status: "CLOSED",
              closeReason: "MANUAL",
              closeInitiator: "USER_APP",
              quantity: 1,
              leverage: 3,
              entryPrice: 100,
              entryNotional: 100,
              exitPrice: 105,
              stopLoss: null,
              takeProfit: null,
              openedAt: "2026-03-31T10:00:00.000Z",
              closedAt: "2026-03-31T10:03:00.000Z",
              holdMs: 180000,
              dcaCount: 0,
              feesPaid: 0.2,
              realizedPnl: 5,
              unrealizedPnl: 0,
              markPrice: null,
              firstTradeAt: "2026-03-31T10:00:00.000Z",
              lastTradeAt: "2026-03-31T10:03:00.000Z",
              tradesCount: 2,
            },
          ],
        },
        trades: {
          sessionId: "AGGREGATE",
          total: 1,
          meta: { page: 1, pageSize: 25, total: 1, totalPages: 1, hasPrev: false, hasNext: false },
          window: {
            startedAt: "2026-03-31T10:00:00.000Z",
            finishedAt: "2026-03-31T10:05:00.000Z",
          },
          items: [
            {
              id: `trade-${botId}`,
              symbol: tradeSymbol,
              side: "SELL",
              lifecycleAction: "CLOSE",
              closeReason: "MANUAL",
              closeInitiator: "USER_APP",
              price: 105,
              quantity: 1,
              fee: 0.2,
              feeSource: "EXCHANGE_FILL",
              feePending: false,
              feeCurrency: "USDT",
              realizedPnl: 5,
              executedAt: "2026-03-31T10:03:00.000Z",
              orderId: `order-${botId}`,
              positionId: `position-${botId}`,
              strategyId: isAlpha ? "str-a" : "str-b",
              origin: "BOT",
              managementMode: "BOT_MANAGED",
              notional: 105,
              margin: 35,
            },
          ],
        },
      };
    });

    await renderSubject();

    const tradeHistoryTab = await screen.findByRole("tab", { name: /Historia|History/i });
    fireEvent.click(tradeHistoryTab);

    expect(await screen.findByText("ALPHAHISTUSDT")).toBeInTheDocument();
    expect(await screen.findByText("ALPHATRADEUSDT")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Wybrany bot"), { target: { value: "bot-b" } });

    await waitFor(() => {
      expect(screen.queryByText("ALPHAHISTUSDT")).not.toBeInTheDocument();
      expect(screen.queryByText("ALPHATRADEUSDT")).not.toBeInTheDocument();
    });

    expect(await screen.findByText("BETAHISTUSDT")).toBeInTheDocument();
    expect(await screen.findByText("BETATRADEUSDT")).toBeInTheDocument();
  });
});
