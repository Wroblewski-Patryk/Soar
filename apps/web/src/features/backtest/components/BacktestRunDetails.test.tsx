import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BacktestRunDetails from "./BacktestRunDetails";
import { I18nProvider } from "@/i18n/I18nProvider";

const {
  getBacktestRunMock,
  getBacktestRunReportMock,
  getBacktestRunTimelineMock,
  listBacktestRunTradesMock,
  getStrategyMock,
  getMarketUniverseMock,
} = vi.hoisted(() => ({
  getBacktestRunMock: vi.fn(),
  getBacktestRunReportMock: vi.fn(),
  getBacktestRunTimelineMock: vi.fn(),
  listBacktestRunTradesMock: vi.fn(),
  getStrategyMock: vi.fn(),
  getMarketUniverseMock: vi.fn(),
}));

vi.mock("../services/backtests.service", () => ({
  getBacktestRun: getBacktestRunMock,
  getBacktestRunReport: getBacktestRunReportMock,
  getBacktestRunTimeline: getBacktestRunTimelineMock,
  listBacktestRunTrades: listBacktestRunTradesMock,
}));

vi.mock("../../strategies/api/strategies.api", () => ({
  getStrategy: getStrategyMock,
}));

vi.mock("../../markets/services/markets.service", () => ({
  getMarketUniverse: getMarketUniverseMock,
}));

const renderWithI18n = (runId: string) =>
  render(
    <I18nProvider>
      <BacktestRunDetails runId={runId} />
    </I18nProvider>
  );

describe("BacktestRunDetails loading UX", () => {
  beforeEach(() => {
    window.localStorage.setItem("cryptosparrow-locale", "pl");
    window.history.pushState({}, "", "/dashboard/backtests/list");
  });

  it("renders skeleton composition while run details are loading", () => {
    getBacktestRunMock.mockReturnValue(new Promise(() => undefined));
    getBacktestRunReportMock.mockResolvedValue(null);
    getBacktestRunTimelineMock.mockResolvedValue(null);
    listBacktestRunTradesMock.mockResolvedValue([]);
    getStrategyMock.mockResolvedValue(null);
    getMarketUniverseMock.mockResolvedValue(null);

    renderWithI18n("run_01");

    expect(screen.getByLabelText(/Loading KPI row|Ladowanie wiersza KPI/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Loading cards|Ladowanie kart/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Loading table rows|Ladowanie wierszy tabeli/i)).toBeInTheDocument();
  });

  it("renders not-found state when run endpoint responds with 404", async () => {
    getBacktestRunMock.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 404,
        data: {
          error: { message: "Not found" },
        },
      },
    });
    getBacktestRunReportMock.mockResolvedValue(null);
    getBacktestRunTimelineMock.mockResolvedValue(null);
    listBacktestRunTradesMock.mockResolvedValue([]);
    getStrategyMock.mockResolvedValue(null);
    getMarketUniverseMock.mockResolvedValue(null);

    renderWithI18n("missing_run");

    expect(await screen.findByText(/Nie znaleziono runa|Run not found/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Nie udalo sie pobrac szczegolow backtestu|Failed to load backtest details/i)
    ).not.toBeInTheDocument();
  });

  it("keeps bootstrap loading without flashing hard error on transient fetch failure", async () => {
    vi.useFakeTimers();
    getBacktestRunMock
      .mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 503,
          data: {
            error: { message: "Service unavailable" },
          },
        },
      })
      .mockResolvedValue({
        id: "run_retry",
        strategyId: null,
        name: "Retry run",
        symbol: "BTCUSDT",
        timeframe: "1m",
        status: "COMPLETED",
        seedConfig: null,
        startedAt: "2026-04-10T10:00:00.000Z",
        finishedAt: "2026-04-10T10:10:00.000Z",
        notes: null,
        createdAt: "2026-04-10T10:00:00.000Z",
      });
    getBacktestRunReportMock.mockResolvedValue(null);
    getBacktestRunTimelineMock.mockResolvedValue(null);
    listBacktestRunTradesMock.mockResolvedValue([]);
    getStrategyMock.mockResolvedValue(null);
    getMarketUniverseMock.mockResolvedValue(null);

    renderWithI18n("run_retry");

    expect(screen.queryByText("Nie udalo sie pobrac szczegolow backtestu")).not.toBeInTheDocument();

    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(getBacktestRunMock.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText("Nie udalo sie pobrac szczegolow backtestu")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("renders resolved venue context from run seed config in the details header", async () => {
    getBacktestRunMock.mockResolvedValue({
      id: "run_gateio",
      strategyId: "strategy_1",
      name: "Gate spot run",
      symbol: "BTCUSDT",
      timeframe: "5m",
      status: "COMPLETED",
      seedConfig: {
        exchange: "GATEIO",
        marketType: "SPOT",
        baseCurrency: "USDT",
      },
      startedAt: "2026-04-10T10:00:00.000Z",
      finishedAt: "2026-04-10T11:00:00.000Z",
      notes: null,
      createdAt: "2026-04-10T10:00:00.000Z",
    });
    getBacktestRunReportMock.mockResolvedValue(null);
    getBacktestRunTimelineMock.mockResolvedValue(null);
    listBacktestRunTradesMock.mockResolvedValue([]);
    getStrategyMock.mockResolvedValue({ id: "strategy_1", name: "Venue strategy", interval: "5m" });
    getMarketUniverseMock.mockResolvedValue({ id: "market_1", name: "Gate spot universe" });

    renderWithI18n("run_gateio");

    expect(await screen.findByText("Gate spot run")).toBeInTheDocument();
    expect(screen.getByText("GATEIO / SPOT / USDT")).toBeInTheDocument();
  });
});
