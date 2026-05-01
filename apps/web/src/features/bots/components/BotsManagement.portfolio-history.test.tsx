import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import BotsManagement from "./BotsManagement";
import { I18nProvider } from "../../../i18n/I18nProvider";

const listMock = vi.hoisted(() => vi.fn());
const createMock = vi.hoisted(() => vi.fn());
const updateMock = vi.hoisted(() => vi.fn());
const deleteMock = vi.hoisted(() => vi.fn());
const getAssistantConfigMock = vi.hoisted(() => vi.fn());
const upsertAssistantConfigMock = vi.hoisted(() => vi.fn());
const upsertSubagentConfigMock = vi.hoisted(() => vi.fn());
const deleteSubagentConfigMock = vi.hoisted(() => vi.fn());
const runAssistantDryRunMock = vi.hoisted(() => vi.fn());
const listRuntimeSessionsMock = vi.hoisted(() => vi.fn());
const getBotPortfolioHistoryMock = vi.hoisted(() => vi.fn());
const loadBotMonitoringAggregateMock = vi.hoisted(() => vi.fn());
const listStrategiesMock = vi.hoisted(() => vi.fn());
const listMarketUniversesMock = vi.hoisted(() => vi.fn());
const listWalletsMock = vi.hoisted(() =>
  vi.fn().mockResolvedValue([
    {
      id: "w-paper-default",
      name: "Paper Wallet",
      mode: "PAPER",
      exchange: "BINANCE",
      marketType: "FUTURES",
      baseCurrency: "USDT",
      paperInitialBalance: 10000,
    },
  ])
);

vi.mock("../services/bots.service", () => ({
  listBots: listMock,
  createBot: createMock,
  updateBot: updateMock,
  deleteBot: deleteMock,
  getBotAssistantConfig: getAssistantConfigMock,
  upsertBotAssistantConfig: upsertAssistantConfigMock,
  upsertBotSubagentConfig: upsertSubagentConfigMock,
  deleteBotSubagentConfig: deleteSubagentConfigMock,
  runBotAssistantDryRun: runAssistantDryRunMock,
  listBotRuntimeSessions: listRuntimeSessionsMock,
  getBotPortfolioHistory: getBotPortfolioHistoryMock,
}));

vi.mock("../../strategies/api/strategies.api", () => ({
  listStrategies: listStrategiesMock,
}));

vi.mock("../../markets/services/markets.service", () => ({
  listMarketUniverses: listMarketUniversesMock,
}));

vi.mock("../../wallets/services/wallets.service", () => ({
  listWallets: listWalletsMock,
}));

vi.mock("../services/botsMonitoringAggregate.service", () => ({
  loadBotMonitoringAggregate: loadBotMonitoringAggregateMock,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  window.localStorage.clear();
  window.history.pushState({}, "", "/");
});

describe("BotsManagement portfolio history", () => {
  it("renders bot portfolio history with capital markers in monitoring tab", async () => {
    window.localStorage.setItem("cryptosparrow-locale", "pl");
    window.history.pushState({}, "", "/dashboard/bots");

    listStrategiesMock.mockResolvedValue([{ id: "s-monitor", name: "Monitor Strategy", interval: "5m" }]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: "g-monitor",
        name: "Monitor Group",
        marketType: "FUTURES",
        baseCurrency: "USDT",
        whitelist: [],
        blacklist: [],
      },
    ]);
    listMock.mockResolvedValue([
      {
        id: "b-monitor",
        name: "Monitor Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 1,
      },
    ]);
    listRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-1",
        botId: "b-monitor",
        mode: "PAPER",
        status: "RUNNING",
        startedAt: "2026-05-01T09:30:00.000Z",
        finishedAt: null,
        lastHeartbeatAt: "2026-05-01T12:00:00.000Z",
        stopReason: null,
        errorMessage: null,
        createdAt: "2026-05-01T09:30:00.000Z",
        updatedAt: "2026-05-01T12:00:00.000Z",
        durationMs: 1_000,
        eventsCount: 1,
        symbolsTracked: 1,
        summary: {
          totalSignals: 1,
          dcaCount: 0,
          closedTrades: 1,
          realizedPnl: 40,
        },
      },
    ]);
    loadBotMonitoringAggregateMock.mockResolvedValue({
      sessionDetail: {
        id: "AGGREGATE",
        botId: "b-monitor",
        mode: "PAPER",
        status: "RUNNING",
        startedAt: "2026-05-01T09:30:00.000Z",
        finishedAt: null,
        lastHeartbeatAt: "2026-05-01T12:00:00.000Z",
        stopReason: null,
        errorMessage: null,
        metadata: { aggregate: true, sessionsCount: 1 },
        createdAt: "2026-05-01T09:30:00.000Z",
        updatedAt: "2026-05-01T12:00:00.000Z",
        durationMs: 1_000,
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
          realizedPnl: 40,
          grossProfit: 40,
          grossLoss: 0,
          feesPaid: 0,
          openPositionCount: 0,
          openPositionQty: 0,
        },
      },
      symbolStats: {
        sessionId: "AGGREGATE",
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
      },
      positions: {
        sessionId: "AGGREGATE",
        total: 0,
        openCount: 0,
        closedCount: 1,
        openOrdersCount: 0,
        window: {
          startedAt: "2026-05-01T09:30:00.000Z",
          finishedAt: "2026-05-01T12:00:00.000Z",
        },
        summary: {
          realizedPnl: 40,
          unrealizedPnl: 0,
          feesPaid: 0,
          referenceBalance: 1040,
          freeCash: 1040,
        },
        openOrders: [],
        openItems: [],
        historyItems: [],
      },
      trades: {
        sessionId: "AGGREGATE",
        total: 0,
        meta: {
          page: 1,
          pageSize: 1,
          total: 0,
          totalPages: 0,
          hasPrev: false,
          hasNext: false,
        },
        window: {
          startedAt: "2026-05-01T09:30:00.000Z",
          finishedAt: "2026-05-01T12:00:00.000Z",
        },
        items: [],
      },
    });
    getBotPortfolioHistoryMock.mockResolvedValue({
      botId: "b-monitor",
      walletId: "w-paper-default",
      mode: "PAPER",
      baseCurrency: "USDT",
      completeness: "PARTIAL",
      completenessReasons: ["OPEN_PNL_LATEST_ONLY"],
      window: {
        startedAt: "2026-05-01T09:30:00.000Z",
        finishedAt: "2026-05-01T12:00:00.000Z",
      },
      summary: {
        startBalance: 1000,
        currentBalance: 1040,
        realizedPnl: 40,
        unrealizedPnl: 0,
        totalPnl: 40,
        capitalSource: "PAPER_RESET_CHECKPOINT",
        paperResetAt: "2026-05-01T10:00:00.000Z",
        openPositionCount: 0,
        closedPositionCount: 1,
      },
      points: [
        {
          timestamp: "2026-05-01T09:30:00.000Z",
          balance: 1000,
          realizedPnl: 0,
          type: "START",
          label: "Lifecycle start",
          symbol: null,
        },
        {
          timestamp: "2026-05-01T10:20:00.000Z",
          balance: 1040,
          realizedPnl: 40,
          type: "CLOSE",
          label: "TP",
          symbol: "BTCUSDT",
        },
        {
          timestamp: "2026-05-01T12:00:00.000Z",
          balance: 1040,
          realizedPnl: 40,
          type: "CURRENT",
          label: "Current",
          symbol: null,
        },
      ],
      markers: [
        {
          id: "paper-reset",
          timestamp: "2026-05-01T10:00:00.000Z",
          type: "PAPER_RESET",
          label: "PAPER_RESET",
          amount: null,
          currency: "USDT",
          direction: null,
        },
      ],
    });

    render(
      <I18nProvider>
        <BotsManagement />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(document.documentElement.lang).toBe("pl");
      expect(screen.getByDisplayValue("Monitor Bot")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("tab", { name: /Operacje runtime|Monitoring/i }));

    await waitFor(() => {
      expect(getBotPortfolioHistoryMock).toHaveBeenCalledWith("b-monitor");
      expect(screen.getByText("Historia portfela")).toBeInTheDocument();
      expect(screen.getByText("Saldo startowe")).toBeInTheDocument();
      expect(screen.getByText("Zdarzenia kapitalowe")).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Historia portfela" })).toBeInTheDocument();
      expect(screen.getByText("PAPER_RESET")).toBeInTheDocument();
    });
  });
});
