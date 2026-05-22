import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

const runtimeGraph = (botId: string) => ({
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
  marketGroups: [],
  legacyBotStrategies: [],
});

const session = (botId: string, id: string) => ({
  id,
  botId,
  mode: "PAPER" as const,
  status: "RUNNING" as const,
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
});

const emptySymbolStats = (sessionId: string) => ({
  sessionId,
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

const emptyTrades = (sessionId: string) => ({
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
});

describe("HomeLiveWidgets open orders actions", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    lookupCoinIconsMock.mockResolvedValue(new Map());
    getBotRuntimeGraphMock.mockImplementation(async (botId: string) => runtimeGraph(botId));
    getBotRuntimeMonitoringAggregateMock.mockImplementation(
      buildMonitoringAggregateFromSessionMocks({
        listBotRuntimeSessionsMock,
        listBotRuntimeSessionSymbolStatsMock,
        listBotRuntimeSessionPositionsMock,
        listBotRuntimeSessionTradesMock,
      })
    );
    closeBotRuntimeSessionPositionMock.mockResolvedValue({
      status: "closed",
      positionId: "position-default",
      orderId: "order-default",
    });
    cancelDashboardOrderMock.mockResolvedValue({
      id: "order-default",
      status: "CANCELED",
    });
    openDashboardManualOrderMock.mockResolvedValue({
      id: "order-default",
      status: "OPEN",
    });
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
    updatePositionManualParamsMock.mockResolvedValue({
      id: "position-default",
      takeProfit: null,
      stopLoss: null,
    });
    window.localStorage.setItem("cryptosparrow-locale", "pl");
    window.history.pushState({}, "", "/dashboard");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderSubjectSettled = async () => {
    await act(async () => {
      render(
        <I18nProvider>
          <HomeLiveWidgets />
        </I18nProvider>
      );
    });
    await act(async () => {
      await Promise.resolve();
    });
    await waitFor(() => {
      expect(screen.queryByText(/Ladowanie widgetow live snapshot|Loading live snapshot widgets/i)).not.toBeInTheDocument();
    });
  };

  it("requires confirmation before canceling active LIVE open orders from the orders tab", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-orders-cancel",
        name: "Orders Cancel Bot",
        mode: "LIVE",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-orders-cancel",
        isActive: true,
        liveOptIn: true,
        maxOpenPositions: 2,
      },
    ]);
    listBotRuntimeSessionsMock.mockResolvedValue([session("bot-orders-cancel", "session-orders-cancel")]);
    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue(emptySymbolStats("session-orders-cancel"));

    let positionsCallCount = 0;
    listBotRuntimeSessionPositionsMock.mockImplementation(async () => {
      positionsCallCount += 1;
      if (positionsCallCount === 1) {
        return {
          sessionId: "session-orders-cancel",
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
              id: "order-open-1",
              origin: "USER",
              symbol: "BTCUSDT",
              side: "BUY",
              type: "LIMIT",
              status: "OPEN",
              quantity: 0.01,
              filledQuantity: 0,
              price: 68000,
              stopPrice: null,
              submittedAt: "2026-03-31T10:01:00.000Z",
              createdAt: "2026-03-31T10:01:00.000Z",
              updatedAt: "2026-03-31T10:01:00.000Z",
            },
          ],
          openItems: [],
          historyItems: [],
        };
      }

      return {
        sessionId: "session-orders-cancel",
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

    listBotRuntimeSessionTradesMock.mockResolvedValue(emptyTrades("session-orders-cancel"));

    await renderSubjectSettled();

    fireEvent.click(await screen.findByRole("tab", { name: /Zlecenia|Orders/i }));

    await waitFor(() => {
      expect(screen.getByRole("columnheader", { name: /Action/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Anuluj zlecenie|Cancel order/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Anuluj zlecenie|Cancel order/i }));

    await waitFor(() => {
      expect(screen.getByText(/Potwierdz akcje runtime|Confirm runtime action/i)).toBeInTheDocument();
    });
    expect(cancelDashboardOrderMock).not.toHaveBeenCalled();

    let dialog = screen.getByText(/Potwierdz akcje runtime|Confirm runtime action/i).closest("dialog") as HTMLElement;
    fireEvent.click(within(dialog).getByText(/^Anuluj$|^Cancel$/i));
    expect(cancelDashboardOrderMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /Anuluj zlecenie|Cancel order/i }));
    await waitFor(() => {
      expect(screen.getByText(/Potwierdz akcje runtime|Confirm runtime action/i)).toBeInTheDocument();
    });
    dialog = screen.getByText(/Potwierdz akcje runtime|Confirm runtime action/i).closest("dialog") as HTMLElement;
    fireEvent.click(within(dialog).getByText(/^Potwierdz$|^Confirm$/i));

    await waitFor(() => {
      expect(cancelDashboardOrderMock).toHaveBeenCalledWith("order-open-1", { riskAck: true });
    });

    await waitFor(() => {
      expect(screen.getByText(/Brak otwartych zlecen|No open orders/i)).toBeInTheDocument();
    });
  });

  it("does not expose cancel action for terminal orders in the orders tab", async () => {
    listBotsMock.mockResolvedValue([
      {
        id: "bot-orders-filled",
        name: "Orders Filled Bot",
        mode: "PAPER",
        paperStartBalance: 10000,
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "str-orders-filled",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
      },
    ]);
    listBotRuntimeSessionsMock.mockResolvedValue([session("bot-orders-filled", "session-orders-filled")]);
    listBotRuntimeSessionSymbolStatsMock.mockResolvedValue(emptySymbolStats("session-orders-filled"));
    listBotRuntimeSessionPositionsMock.mockResolvedValue({
      sessionId: "session-orders-filled",
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
          id: "order-filled-1",
          origin: "USER",
          symbol: "ETHUSDT",
          side: "BUY",
          type: "MARKET",
          status: "FILLED",
          quantity: 0.25,
          filledQuantity: 0.25,
          price: 3000,
          stopPrice: null,
          submittedAt: "2026-03-31T10:01:00.000Z",
          createdAt: "2026-03-31T10:01:00.000Z",
          updatedAt: "2026-03-31T10:01:01.000Z",
        },
      ],
      openItems: [],
      historyItems: [],
    });
    listBotRuntimeSessionTradesMock.mockResolvedValue(emptyTrades("session-orders-filled"));

    await renderSubjectSettled();

    fireEvent.click(await screen.findByRole("tab", { name: /Zlecenia|Orders/i }));

    await waitFor(() => {
      expect(screen.getByRole("columnheader", { name: /Action/i })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /Anuluj zlecenie|Cancel order/i })).not.toBeInTheDocument();
    });
  });
});
