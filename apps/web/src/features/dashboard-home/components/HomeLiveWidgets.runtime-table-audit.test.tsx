import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { I18nProvider } from "../../../i18n/I18nProvider";
import HomeLiveWidgets from "./HomeLiveWidgets";

const listBotsMock = vi.hoisted(() => vi.fn());
const getBotRuntimeGraphMock = vi.hoisted(() => vi.fn());
const getBotRuntimeMonitoringAggregateMock = vi.hoisted(() => vi.fn());
const listBotRuntimeSessionsMock = vi.hoisted(() => vi.fn());
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

const now = "2026-05-10T12:00:00.000Z";

const runtimeBot = {
  id: "bot-dashboard-audit",
  userId: "user-1",
  name: "Dashboard Audit Bot",
  mode: "PAPER",
  status: "ACTIVE",
  isActive: true,
  exchange: "BINANCE",
  symbol: "BTCUSDT",
  symbols: ["BTCUSDT"],
  paperStartBalance: 1000,
  wallet: {
    id: "wallet-1",
    name: "Paper Wallet",
    mode: "PAPER",
    paperInitialBalance: 1000,
    currency: "USDT",
  },
  createdAt: now,
  updatedAt: now,
};

const runtimeGraph = {
  bot: runtimeBot,
  markets: [{ symbol: "BTCUSDT", status: "ACTIVE", isEnabled: true }],
  strategies: [{ id: "strategy-1", name: "RSI 20/80", status: "ACTIVE" }],
  wallets: [runtimeBot.wallet],
};

const sessionDetail = {
  id: "session-dashboard-audit",
  botId: runtimeBot.id,
  mode: "PAPER",
  status: "RUNNING",
  startedAt: now,
  finishedAt: null,
  lastHeartbeatAt: now,
  stopReason: null,
  errorMessage: null,
  createdAt: now,
  updatedAt: now,
  durationMs: 60000,
  eventsCount: 3,
  symbolsTracked: 1,
  summary: {
    totalSignals: 1,
    dcaCount: 0,
    closedTrades: 0,
    realizedPnl: 0,
  },
};

describe("HomeLiveWidgets runtime table rendered audit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    window.localStorage.setItem("cryptosparrow-locale", "en");
    window.history.pushState({}, "", "/dashboard");
    lookupCoinIconsMock.mockResolvedValue(new Map());
    listBotsMock.mockResolvedValue([runtimeBot]);
    getBotRuntimeGraphMock.mockResolvedValue(runtimeGraph);
    listBotRuntimeSessionsMock.mockResolvedValue([sessionDetail]);
    cancelDashboardOrderMock.mockResolvedValue({ id: "order-1", status: "CANCELED" });
    openDashboardManualOrderMock.mockResolvedValue({ id: "order-1", status: "OPEN" });
    getDashboardManualOrderContextMock.mockResolvedValue({
      botId: runtimeBot.id,
      symbol: "BTCUSDT",
      mode: "PAPER",
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
    updatePositionManualParamsMock.mockResolvedValue({
      id: "position-loss",
      takeProfit: null,
      stopLoss: null,
    });
    createMarketStreamEventSourceMock.mockImplementation(() => ({
      onopen: null,
      onerror: null,
      addEventListener: vi.fn(),
      close: vi.fn(),
    }));
  });

  it("does not render prospective TTP on an open position with negative live PnL", async () => {
    getBotRuntimeMonitoringAggregateMock.mockResolvedValue({
      sessionDetail,
      symbolStats: {
        sessionId: sessionDetail.id,
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
          realizedPnl: 0,
          unrealizedPnl: -12,
          totalPnl: -12,
          grossProfit: 0,
          grossLoss: -12,
          feesPaid: 0,
        },
      },
      positions: {
        sessionId: sessionDetail.id,
        total: 1,
        openCount: 1,
        closedCount: 0,
        openOrdersCount: 0,
        showDynamicStopColumns: true,
        window: { startedAt: now, finishedAt: null },
        summary: {
          realizedPnl: 0,
          unrealizedPnl: -12,
          feesPaid: 0,
          portfolioValue: 988,
          freeFunds: 888,
        },
        openOrders: [],
        openItems: [
          {
            id: "position-loss",
            symbol: "BTCUSDT",
            side: "LONG",
            status: "OPEN",
            quantity: 0.01,
            leverage: 10,
            marginUsed: 100,
            entryPrice: 68000,
            entryNotional: 1000,
            exitPrice: null,
            stopLoss: null,
            takeProfit: null,
            openedAt: now,
            closedAt: null,
            holdMs: 60000,
            dcaCount: 0,
            feesPaid: 0,
            realizedPnl: 0,
            unrealizedPnl: -12,
            unrealizedPnlPercent: -12,
            markPrice: 66800,
            ttpProtectedPercent: 7,
            ttpProtectedSource: "prospective",
            tslProtectedPercent: null,
            firstTradeAt: now,
            lastTradeAt: now,
            tradesCount: 1,
          },
        ],
        historyItems: [],
      },
      trades: {
        sessionId: sessionDetail.id,
        total: 0,
        meta: { page: 1, pageSize: 25, total: 0, totalPages: 1, hasPrev: false, hasNext: false },
        window: { startedAt: now, finishedAt: null },
        items: [],
      },
    });

    render(
      <I18nProvider>
        <HomeLiveWidgets />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText("BTCUSDT").length).toBeGreaterThan(0);
      expect(screen.getByRole("columnheader", { name: "TTP" })).toBeInTheDocument();
    });

    expect(screen.queryByText("Prospective")).not.toBeInTheDocument();
    expect(screen.queryByText("7%")).not.toBeInTheDocument();
    expect(
      screen.getAllByText((content, element) => {
        return Boolean(element?.classList.contains("text-error") && /-\d+(?:\.\d+)?%/.test(content));
      }).length
    ).toBeGreaterThan(0);
  });
});
