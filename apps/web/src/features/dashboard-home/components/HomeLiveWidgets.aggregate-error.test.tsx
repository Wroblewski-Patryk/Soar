import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

describe("HomeLiveWidgets aggregate fail-closed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.setItem("cryptosparrow-locale", "en");
    window.history.pushState({}, "", "/dashboard");

    lookupCoinIconsMock.mockResolvedValue(new Map());
    getBotRuntimeGraphMock.mockResolvedValue({
      bot: {
        id: "bot-aggregate-error",
        userId: "u-1",
        name: "Aggregate Error Bot",
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
    });
    listBotsMock.mockResolvedValue([
      {
        id: "bot-aggregate-error",
        name: "Aggregate Error Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-aggregate-error",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);
    listBotRuntimeSessionsMock.mockResolvedValue([
      {
        id: "session-aggregate-error",
        botId: "bot-aggregate-error",
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
        symbolsTracked: 2,
        summary: {
          totalSignals: 2,
          dcaCount: 0,
          closedTrades: 1,
          realizedPnl: 10,
        },
      },
    ]);
    getBotRuntimeMonitoringAggregateMock.mockRejectedValue(new Error("aggregate unavailable"));
    listBotRuntimeSessionSymbolStatsMock.mockRejectedValue(
      new Error("session symbol stats fallback should not run")
    );
    listBotRuntimeSessionPositionsMock.mockRejectedValue(
      new Error("session positions fallback should not run")
    );
    listBotRuntimeSessionTradesMock.mockRejectedValue(
      new Error("session trades fallback should not run")
    );
  });

  it("keeps session truth but does not reconstruct runtime aggregate in the browser", async () => {
    render(
      <I18nProvider>
        <HomeLiveWidgets />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("RUNNING")).toBeInTheDocument();
      expect(screen.getByText(/No open positions/i)).toBeInTheDocument();
    });

    expect(getBotRuntimeMonitoringAggregateMock).toHaveBeenCalledWith("bot-aggregate-error", {
      sessionsLimit: 1,
      perSessionLimit: 80,
    });
    expect(listBotRuntimeSessionSymbolStatsMock).not.toHaveBeenCalled();
    expect(listBotRuntimeSessionPositionsMock).not.toHaveBeenCalled();
    expect(listBotRuntimeSessionTradesMock).not.toHaveBeenCalled();
  });
});
