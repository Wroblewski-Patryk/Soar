import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { I18nProvider } from "../../../i18n/I18nProvider";
import BotsManagement from "../../../features/bots/components/BotsManagement";
import HomeLiveWidgets from "./HomeLiveWidgets";

const listBotsMock = vi.hoisted(() => vi.fn());
const createBotMock = vi.hoisted(() => vi.fn());
const updateBotMock = vi.hoisted(() => vi.fn());
const deleteBotMock = vi.hoisted(() => vi.fn());
const getBotAssistantConfigMock = vi.hoisted(() => vi.fn());
const upsertBotAssistantConfigMock = vi.hoisted(() => vi.fn());
const upsertBotSubagentConfigMock = vi.hoisted(() => vi.fn());
const deleteBotSubagentConfigMock = vi.hoisted(() => vi.fn());
const runBotAssistantDryRunMock = vi.hoisted(() => vi.fn());
const getBotRuntimeGraphMock = vi.hoisted(() => vi.fn());
const getBotRuntimeMonitoringAggregateMock = vi.hoisted(() => vi.fn());
const listBotRuntimeSessionsMock = vi.hoisted(() => vi.fn());
const getBotRuntimeSessionMock = vi.hoisted(() => vi.fn());
const listBotRuntimeSessionSymbolStatsMock = vi.hoisted(() => vi.fn());
const listBotRuntimeSessionPositionsMock = vi.hoisted(() => vi.fn());
const listBotRuntimeSessionTradesMock = vi.hoisted(() => vi.fn());
const closeBotRuntimeSessionPositionMock = vi.hoisted(() => vi.fn());
const openDashboardManualOrderMock = vi.hoisted(() => vi.fn());
const getDashboardManualOrderContextMock = vi.hoisted(() => vi.fn());
const lookupCoinIconsMock = vi.hoisted(() => vi.fn());
const updatePositionManualParamsMock = vi.hoisted(() => vi.fn());
const listStrategiesMock = vi.hoisted(() => vi.fn());
const listMarketUniversesMock = vi.hoisted(() => vi.fn());
const listWalletsMock = vi.hoisted(() => vi.fn());

vi.mock("../../../features/bots/services/bots.service", () => ({
  listBots: listBotsMock,
  createBot: createBotMock,
  updateBot: updateBotMock,
  deleteBot: deleteBotMock,
  getBotAssistantConfig: getBotAssistantConfigMock,
  upsertBotAssistantConfig: upsertBotAssistantConfigMock,
  upsertBotSubagentConfig: upsertBotSubagentConfigMock,
  deleteBotSubagentConfig: deleteBotSubagentConfigMock,
  runBotAssistantDryRun: runBotAssistantDryRunMock,
  getBotRuntimeGraph: getBotRuntimeGraphMock,
  getBotRuntimeMonitoringAggregate: getBotRuntimeMonitoringAggregateMock,
  listBotRuntimeSessions: listBotRuntimeSessionsMock,
  getBotRuntimeSession: getBotRuntimeSessionMock,
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

vi.mock("../../../features/strategies/api/strategies.api", () => ({
  listStrategies: listStrategiesMock,
}));

vi.mock("../../../features/markets/services/markets.service", () => ({
  listMarketUniverses: listMarketUniversesMock,
}));

vi.mock("../../../features/wallets/services/wallets.service", () => ({
  listWallets: listWalletsMock,
}));

const buildAggregatePayload = (botId: string, historySymbol: string, tradeSymbol: string) => ({
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
    eventsCount: 2,
    symbolsTracked: 1,
    summary: {
      totalSignals: 2,
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
    items: [
      {
        id: `stat-${botId}`,
        symbol: "BTCUSDT",
        lastSignalDirection: "LONG",
        lastSignalContextSource: botId === "bot-a" ? "configured_fallback" : "latest_signal",
        lastSignalConditionLines: [
          {
            scope: "LONG",
            left: botId === "bot-a" ? "ALPHA_CTX_FAST" : "BETA_CTX_FAST",
            value: "ACTIVE",
            operator: ">",
            right: botId === "bot-a" ? "ALPHA_CTX_SLOW" : "BETA_CTX_SLOW",
          },
        ],
      },
    ],
    summary: {
      totalSignals: 2,
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
    total: 2,
    openCount: 1,
    closedCount: 1,
    openOrdersCount: 0,
    showDynamicStopColumns: false,
    window: {
      startedAt: "2026-03-31T10:00:00.000Z",
      finishedAt: "2026-03-31T10:05:00.000Z",
    },
    summary: { realizedPnl: 5, unrealizedPnl: 0, feesPaid: 0.2 },
    openOrders: [],
    openItems: [
      {
        id: `open-${botId}`,
        origin: "BOT",
        managementMode: "BOT_MANAGED",
        symbol: `${botId === "bot-a" ? "ALPHA" : "BETA"}OPENUSDT`,
        side: "LONG",
        status: "OPEN",
        quantity: 1,
        leverage: 3,
        entryPrice: 100,
        entryNotional: 100,
        exitPrice: null,
        stopLoss: null,
        takeProfit: null,
        openedAt: "2026-03-31T10:01:00.000Z",
        closedAt: null,
        holdMs: 120000,
        dcaCount: 2,
        dcaExecutedLevels: [-1.25, -2.5],
        dcaPlannedLevels: [-1.25, -2.5, -5],
        feesPaid: 0.1,
        realizedPnl: 0,
        unrealizedPnl: 2,
        markPrice: 102,
        firstTradeAt: "2026-03-31T10:01:00.000Z",
        lastTradeAt: "2026-03-31T10:02:00.000Z",
        tradesCount: 2,
      },
    ],
    historyItems: [
      {
        id: `history-${botId}`,
        origin: "BOT",
        managementMode: "BOT_MANAGED",
        symbol: historySymbol,
        side: "LONG",
        status: "CLOSED",
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
        strategyId: botId === "bot-a" ? "str-a" : "str-b",
        origin: "BOT",
        managementMode: "BOT",
        notional: 105,
        margin: 35,
      },
    ],
  },
});

const renderWithI18n = (node: ReactNode) => {
  window.localStorage.setItem("cryptosparrow-locale", "pl");
  return render(<I18nProvider>{node}</I18nProvider>);
};

describe("Selected bot aggregate parity: /dashboard vs /dashboard/bots/:id/preview", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    listStrategiesMock.mockResolvedValue([{ id: "str-a", name: "Alpha Strategy", interval: "5m" }]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: "mg-1",
        name: "Core Group",
        marketType: "FUTURES",
        baseCurrency: "USDT",
        whitelist: [],
        blacklist: [],
      },
    ]);
    listWalletsMock.mockResolvedValue([
      {
        id: "wallet-a",
        name: "Paper Wallet",
        mode: "PAPER",
        exchange: "BINANCE",
        marketType: "FUTURES",
        baseCurrency: "USDT",
        paperInitialBalance: 10000,
      },
    ]);

    listBotsMock.mockResolvedValue([
      {
        id: "bot-a",
        name: "Alpha Bot",
        walletId: "wallet-a",
        exchange: "BINANCE",
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
        walletId: "wallet-a",
        exchange: "BINANCE",
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
        id: `${botId}-session-running`,
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

    getBotRuntimeMonitoringAggregateMock.mockImplementation(async (botId: string) =>
      botId === "bot-a"
        ? buildAggregatePayload(botId, "ALPHAHISTUSDT", "ALPHATRADEUSDT")
        : buildAggregatePayload(botId, "BETAHISTUSDT", "BETATRADEUSDT")
    );

    getBotRuntimeGraphMock.mockImplementation(async (botId: string) => ({
      bot: {
        id: botId,
        userId: "u-1",
        name: botId === "bot-a" ? "Alpha Bot" : "Beta Bot",
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
    }));

    getDashboardManualOrderContextMock.mockResolvedValue({
      botId: "bot-a",
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

    lookupCoinIconsMock.mockResolvedValue(new Map());
  });

  afterEach(() => {
    window.history.pushState({}, "", "/");
    window.localStorage.clear();
  });

  it("keeps selected-bot aggregate history consistent between dashboard and preview monitoring route", async () => {
    window.history.pushState({}, "", "/dashboard");
    const home = renderWithI18n(<HomeLiveWidgets />);

    fireEvent.change(await screen.findByLabelText("Wybrany bot"), {
      target: { value: "bot-b" },
    });

    fireEvent.click(await screen.findByRole("tab", { name: /Historia|History/i }));

    expect(await screen.findByText("BETAHISTUSDT")).toBeInTheDocument();
    expect(await screen.findByText("BETATRADEUSDT")).toBeInTheDocument();
    expect(screen.getByText("BETA_CTX_FAST")).toBeInTheDocument();
    expect(screen.getByTestId("signal-source-BTCUSDT")).toHaveTextContent(/Ostatni sygnal|Latest signal/i);
    expect(screen.queryByText("ALPHAHISTUSDT")).not.toBeInTheDocument();
    expect(screen.queryByText("ALPHATRADEUSDT")).not.toBeInTheDocument();
    expect(screen.queryByText("ALPHA_CTX_FAST")).not.toBeInTheDocument();

    home.unmount();

    listBotRuntimeSessionsMock.mockClear();
    getBotRuntimeMonitoringAggregateMock.mockClear();

    window.history.pushState({}, "", "/dashboard/bots/bot-b/preview");
    renderWithI18n(
      <BotsManagement initialTab="monitoring" lockedTab="monitoring" preferredBotId="bot-b" />
    );

    await waitFor(() => {
      expect(listBotRuntimeSessionsMock).toHaveBeenCalledWith("bot-b", {
        status: undefined,
        limit: 50,
      });
    });

    expect(await screen.findByText("BETAHISTUSDT")).toBeInTheDocument();
    expect(await screen.findByText("BETATRADEUSDT")).toBeInTheDocument();
    expect(screen.queryByText("ALPHAHISTUSDT")).not.toBeInTheDocument();
    expect(screen.queryByText("ALPHATRADEUSDT")).not.toBeInTheDocument();
  });

  it("preserves DCA ladder and runtime trade labels between dashboard and preview monitoring route", async () => {
    window.history.pushState({}, "", "/dashboard");
    const home = renderWithI18n(<HomeLiveWidgets />);

    fireEvent.change(await screen.findByLabelText("Wybrany bot"), {
      target: { value: "bot-b" },
    });

    expect((await screen.findAllByText("BETAOPENUSDT")).length).toBeGreaterThan(0);
    expect(screen.getByTitle(/1:-1[.,]25%, 2:-2[.,]5(?:0)?%/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /Historia|History/i }));

    expect((await screen.findAllByText("BETATRADEUSDT")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("SELL").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Zamkniecie").length).toBeGreaterThan(0);

    home.unmount();

    listBotRuntimeSessionsMock.mockClear();
    getBotRuntimeMonitoringAggregateMock.mockClear();

    window.history.pushState({}, "", "/dashboard/bots/bot-b/preview");
    renderWithI18n(
      <BotsManagement initialTab="monitoring" lockedTab="monitoring" preferredBotId="bot-b" />
    );

    await waitFor(() => {
      expect(listBotRuntimeSessionsMock).toHaveBeenCalledWith("bot-b", {
        status: undefined,
        limit: 50,
      });
    });

    expect((await screen.findAllByText("BETAOPENUSDT")).length).toBeGreaterThan(0);
    expect(screen.getByTitle(/1:-1[.,]25%, 2:-2[.,]5(?:0)?%/)).toBeInTheDocument();
    expect(screen.getAllByText("BETATRADEUSDT").length).toBeGreaterThan(0);
    expect(screen.getAllByText("SELL").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Zamkniecie").length).toBeGreaterThan(0);
  });
});
