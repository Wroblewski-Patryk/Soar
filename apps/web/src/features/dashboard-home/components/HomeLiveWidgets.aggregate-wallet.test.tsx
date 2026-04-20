import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { BotRuntimeMonitoringAggregateResponse } from "../../../features/bots/types/bot.type";
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

describe("HomeLiveWidgets aggregate wallet contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lookupCoinIconsMock.mockResolvedValue(new Map());

    getBotRuntimeGraphMock.mockResolvedValue({
      bot: {
        id: "bot-live-wallet-aggregate-gap",
        userId: "u-1",
        name: "Runtime bot",
        mode: "LIVE",
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
        createdAt: "2026-03-31T10:00:00.000Z",
        updatedAt: "2026-03-31T10:00:00.000Z",
      },
      marketGroups: [],
      legacyBotStrategies: [],
    });

    getDashboardManualOrderContextMock.mockResolvedValue({
      botId: "bot-live-wallet-aggregate-gap",
      symbol: "BTCUSDT",
      mode: "LIVE",
      orderType: "MARKET",
      marginMode: "CROSSED",
      leverage: 10,
      priceReference: { markPrice: 68000, source: "exchange_mark" },
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
  });

  it("does not mask missing LIVE aggregate capital fields with allocation fallback when aggregate succeeds", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-live-wallet-aggregate-gap",
        name: "Live Wallet Aggregate Gap",
        mode: "LIVE",
        paperStartBalance: 10000,
        exchange: "BINANCE",
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-live-wallet-aggregate-gap",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
        wallet: {
          id: "wallet-live-aggregate-gap",
          name: "Glowny",
          mode: "LIVE",
          exchange: "BINANCE",
          marketType: "FUTURES",
          baseCurrency: "USDT",
          paperInitialBalance: 10000,
          liveAllocationMode: "FIXED",
          liveAllocationValue: 500,
        },
      },
    ]);

    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-live-wallet-aggregate-gap",
        botId: "bot-live-wallet-aggregate-gap",
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
        summary: { totalSignals: 1, dcaCount: 0, closedTrades: 0, realizedPnl: 12 },
      },
    ]);

    getBotRuntimeMonitoringAggregateMock.mockResolvedValue({
      sessionDetail: {
        id: "AGGREGATE",
        botId: "bot-live-wallet-aggregate-gap",
        mode: "LIVE",
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
          exits: 0,
          dcaCount: 0,
          closedTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          realizedPnl: 12,
          grossProfit: 12,
          grossLoss: 0,
          feesPaid: 0,
          openPositionCount: 1,
          openPositionQty: 0.01,
        },
      },
      symbolStats: {
        sessionId: "AGGREGATE",
        items: [],
        summary: {
          totalSignals: 1,
          longEntries: 1,
          shortEntries: 0,
          exits: 0,
          dcaCount: 0,
          closedTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          realizedPnl: 12,
          unrealizedPnl: 0,
          totalPnl: 12,
          grossProfit: 12,
          grossLoss: 0,
          feesPaid: 0,
        },
      },
      positions: {
        sessionId: "AGGREGATE",
        total: 1,
        openCount: 1,
        closedCount: 0,
        openOrdersCount: 0,
        window: {
          startedAt: "2026-03-31T10:00:00.000Z",
          finishedAt: "2026-03-31T10:05:00.000Z",
        },
        summary: {
          realizedPnl: 12,
          unrealizedPnl: 0,
          feesPaid: 0,
          referenceBalance: null,
          freeCash: null,
        },
        openOrders: [],
        openItems: [
          {
            id: "pos-live-wallet-aggregate-gap",
            symbol: "BTCUSDT",
            side: "LONG",
            status: "OPEN",
            quantity: 0.01,
            leverage: 10,
            entryPrice: 10000,
            entryNotional: 100,
            exitPrice: null,
            stopLoss: null,
            takeProfit: null,
            openedAt: "2026-03-31T10:03:00.000Z",
            closedAt: null,
            holdMs: 120000,
            dcaCount: 0,
            feesPaid: 0,
            realizedPnl: 12,
            unrealizedPnl: 0,
            markPrice: 10000,
            firstTradeAt: null,
            lastTradeAt: null,
            tradesCount: 1,
          },
        ],
        historyItems: [],
      },
      trades: {
        sessionId: "AGGREGATE",
        total: 0,
        meta: { page: 1, pageSize: 25, total: 0, totalPages: 0, hasPrev: false, hasNext: false },
        window: {
          startedAt: "2026-03-31T10:00:00.000Z",
          finishedAt: "2026-03-31T10:05:00.000Z",
        },
        items: [],
      },
    } as unknown as BotRuntimeMonitoringAggregateResponse);

    listBotRuntimeSessionSymbolStatsMock.mockRejectedValue(new Error("session symbol stats fallback should not run"));
    listBotRuntimeSessionPositionsMock.mockRejectedValue(new Error("session positions fallback should not run"));
    listBotRuntimeSessionTradesMock.mockRejectedValue(new Error("session trades fallback should not run"));

    renderSubject();

    await waitFor(() => {
      const portfolioRow = screen.getByTestId("wallet-kpi-portfolio");
      const freeFundsCard = screen.getByTestId("wallet-kpi-free-funds");
      const inPositionsCard = screen.getByTestId("wallet-kpi-in-positions");
      expect(within(portfolioRow).getByText(/^-$/)).toBeInTheDocument();
      expect(within(freeFundsCard).getAllByText(/^-$/).length).toBeGreaterThan(0);
      expect(within(inPositionsCard).getByText(/10[,.]00/)).toBeInTheDocument();
      expect(within(portfolioRow).queryByText(/512/)).not.toBeInTheDocument();
      expect(within(freeFundsCard).queryByText(/502/)).not.toBeInTheDocument();
    });

    expect(getBotRuntimeMonitoringAggregateMock).toHaveBeenCalled();
    expect(listBotRuntimeSessionSymbolStatsMock).not.toHaveBeenCalled();
    expect(listBotRuntimeSessionPositionsMock).not.toHaveBeenCalled();
    expect(listBotRuntimeSessionTradesMock).not.toHaveBeenCalled();
  });
});
