import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import PerformanceReportsView from "./PerformanceReportsView";
import { I18nProvider } from "@/i18n/I18nProvider";

const listRunsMock = vi.hoisted(() => vi.fn());
const getReportMock = vi.hoisted(() => vi.fn());
const getCrossModePerformanceMock = vi.hoisted(() => vi.fn());

vi.mock("../../backtest/services/backtests.service", () => ({
  listBacktestRuns: listRunsMock,
  getBacktestRunReport: getReportMock,
}));

vi.mock("../services/reports.service", () => ({
  getCrossModePerformance: getCrossModePerformanceMock,
}));

describe("PerformanceReportsView", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem("cryptosparrow-locale");
    window.history.pushState({}, "", "/");
  });

  const renderWithI18n = async () => {
    window.history.pushState({}, "", "/dashboard/reports");
    await act(async () => {
      render(
        <I18nProvider>
          <PerformanceReportsView />
        </I18nProvider>
      );
    });
    await waitFor(() => {
      expect(document.documentElement.lang).toBe(window.localStorage.getItem("cryptosparrow-locale") ?? "en");
    });
  };

  it("renders empty state when there are no completed runs", async () => {
    listRunsMock.mockResolvedValue([]);
    getReportMock.mockResolvedValue(null);
    getCrossModePerformanceMock.mockResolvedValue({
      generatedAt: "2026-03-24T00:00:00.000Z",
      modeResolution: "BOT_CURRENT_MODE",
      rows: [],
    });

    await renderWithI18n();

    await waitFor(() => {
      expect(screen.getByText("No performance reports yet")).toBeInTheDocument();
    });
  });

  it("renders aggregated metrics and rows when reports exist", async () => {
    listRunsMock.mockResolvedValue([
      {
        id: "r1",
        strategyId: null,
        name: "Run Alpha",
        symbol: "BTCUSDT",
        timeframe: "5m",
        status: "COMPLETED",
        startedAt: "2026-03-16T10:00:00.000Z",
        finishedAt: "2026-03-16T11:00:00.000Z",
        notes: null,
        createdAt: "2026-03-16T10:00:00.000Z",
      },
    ]);
    getReportMock.mockResolvedValue({
      id: "rep1",
      backtestRunId: "r1",
      totalTrades: 12,
      winningTrades: 8,
      losingTrades: 4,
      winRate: 66.7,
      netPnl: 245.5,
      grossProfit: 300,
      grossLoss: -54.5,
      maxDrawdown: 12.2,
      sharpe: 1.4,
      metrics: null,
    });
    getCrossModePerformanceMock.mockResolvedValue({
      generatedAt: "2026-03-24T00:00:00.000Z",
      modeResolution: "BOT_CURRENT_MODE",
      rows: [
        {
          mode: "BACKTEST",
          totalTrades: 30,
          winningTrades: 20,
          losingTrades: 10,
          winRate: 66.7,
          netPnl: 245.5,
          grossProfit: 300,
          grossLoss: 54.5,
        },
        {
          mode: "PAPER",
          totalTrades: 12,
          winningTrades: 7,
          losingTrades: 5,
          winRate: 58.3,
          netPnl: 31.2,
          grossProfit: 82,
          grossLoss: 50.8,
        },
        {
          mode: "LIVE",
          totalTrades: 8,
          winningTrades: 4,
          losingTrades: 4,
          winRate: 50,
          netPnl: -12,
          grossProfit: 19,
          grossLoss: 31,
        },
      ],
    });

    await renderWithI18n();

    await waitFor(() => {
      expect(screen.getByText("Performance reports loaded")).toBeInTheDocument();
      expect(screen.getByText("Cross-mode performance")).toBeInTheDocument();
      expect(screen.getByText("BACKTEST")).toBeInTheDocument();
      expect(screen.getByText("PAPER")).toBeInTheDocument();
      expect(screen.getByText("LIVE")).toBeInTheDocument();
      expect(screen.getByText("Performance by backtest run")).toBeInTheDocument();
      expect(screen.getByText("BTCUSDT")).toBeInTheDocument();
      expect(screen.getAllByText("Run Alpha").length).toBeGreaterThan(0);
    });
  });

  it("keeps reports usable when one per-run report request fails", async () => {
    listRunsMock.mockResolvedValue([
      {
        id: "r1",
        strategyId: null,
        name: "Run Alpha",
        symbol: "BTCUSDT",
        timeframe: "5m",
        status: "COMPLETED",
        startedAt: "2026-03-16T10:00:00.000Z",
        finishedAt: "2026-03-16T11:00:00.000Z",
        notes: null,
        createdAt: "2026-03-16T10:00:00.000Z",
      },
      {
        id: "r2",
        strategyId: null,
        name: "Run Broken",
        symbol: "ETHUSDT",
        timeframe: "5m",
        status: "COMPLETED",
        startedAt: "2026-03-16T10:00:00.000Z",
        finishedAt: "2026-03-16T11:00:00.000Z",
        notes: null,
        createdAt: "2026-03-16T10:00:00.000Z",
      },
    ]);
    getReportMock.mockImplementation(async (runId: string) => {
      if (runId === "r2") throw new Error("report unavailable");
      return {
        id: "rep1",
        backtestRunId: "r1",
        totalTrades: 12,
        winningTrades: 8,
        losingTrades: 4,
        winRate: 66.7,
        netPnl: 245.5,
        grossProfit: 300,
        grossLoss: -54.5,
        maxDrawdown: 12.2,
        sharpe: 1.4,
        metrics: null,
      };
    });
    getCrossModePerformanceMock.mockResolvedValue({
      generatedAt: "2026-03-24T00:00:00.000Z",
      modeResolution: "BOT_CURRENT_MODE",
      rows: [],
    });

    await renderWithI18n();

    await waitFor(() => {
      expect(screen.getByText("Performance reports loaded")).toBeInTheDocument();
      expect(screen.getAllByText("Run Alpha").length).toBeGreaterThan(0);
    });
    expect(screen.queryByText("Run Broken")).not.toBeInTheDocument();
    expect(screen.queryByText("Unable to load reports")).not.toBeInTheDocument();
  });

  it("uses dashboard-reports pt namespace copy when locale is pt", async () => {
    window.localStorage.setItem("cryptosparrow-locale", "pt");
    listRunsMock.mockResolvedValue([]);
    getReportMock.mockResolvedValue(null);
    getCrossModePerformanceMock.mockResolvedValue({
      generatedAt: "2026-03-24T00:00:00.000Z",
      modeResolution: "BOT_CURRENT_MODE",
      rows: [],
    });

    await renderWithI18n();

    await waitFor(() => {
      expect(screen.getByText("Sem relatorios de performance")).toBeInTheDocument();
    });
  });
});
