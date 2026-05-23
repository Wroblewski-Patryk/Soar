import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

const createRuntimeBot = ({
  id,
  name,
  symbol,
  walletName,
  paperStartBalance,
  mode = "PAPER",
  exchange = "BINANCE",
}: {
  id: string;
  name: string;
  symbol: string;
  walletName: string;
  paperStartBalance: number;
  mode?: "PAPER" | "LIVE";
  exchange?: "BINANCE" | "GATEIO";
}) => ({
  ...runtimeBot,
  id,
  name,
  mode,
  exchange,
  symbol,
  symbols: [symbol],
  paperStartBalance,
  wallet: {
    id: `wallet-${id}`,
    name: walletName,
    mode,
    exchange,
    paperInitialBalance: paperStartBalance,
    liveAllocationMode: mode === "LIVE" ? "PERCENT" : null,
    liveAllocationValue: mode === "LIVE" ? 100 : null,
    baseCurrency: "USDT",
    currency: "USDT",
  },
});

const createSession = (botId: string, symbol: string, realizedPnl: number) => ({
  ...sessionDetail,
  id: `session-${botId}`,
  botId,
  summary: {
    ...sessionDetail.summary,
    totalSignals: 2,
    realizedPnl,
  },
  symbolsTracked: 1,
  eventsCount: 4,
  metadata: { symbol },
});

const createAggregate = ({
  botId,
  symbol,
  realizedPnl,
  unrealizedPnl,
  portfolioValue,
  freeFunds,
  marginUsed,
  openOrderId,
  tradeId,
}: {
  botId: string;
  symbol: string;
  realizedPnl: number;
  unrealizedPnl: number;
  portfolioValue: number;
  freeFunds: number;
  marginUsed: number;
  openOrderId: string;
  tradeId: string;
}) => {
  const session = createSession(botId, symbol, realizedPnl);
  const nowForBot = now;
  return {
    sessionDetail: session,
    symbolStats: {
      sessionId: session.id,
      items: [
        {
          id: `signal-${botId}-${symbol}`,
          symbol,
          lastPrice: 100,
          openPositionQty: 1,
          unrealizedPnl,
          lastSignalAt: nowForBot,
          lastSignalDecisionAt: nowForBot,
          latestSignalAction: "HOLD",
          latestSignalReason: "fixture",
          latestSignalScore: 0.5,
          latestSignalConfidence: 0.5,
          latestSignalSide: "LONG",
          latestSignalSource: "LATEST_SIGNAL",
          runtimeMarketState: "POSITION_OPEN",
        },
      ],
      summary: {
        totalSignals: 2,
        longEntries: 1,
        shortEntries: 0,
        exits: 0,
        dcaCount: 0,
        closedTrades: 1,
        winningTrades: 1,
        losingTrades: 0,
        realizedPnl,
        unrealizedPnl,
        totalPnl: realizedPnl + unrealizedPnl,
        grossProfit: Math.max(realizedPnl, 0),
        grossLoss: Math.min(realizedPnl, 0),
        feesPaid: 1,
      },
    },
    positions: {
      sessionId: session.id,
      total: 1,
      openCount: 1,
      closedCount: 0,
      openOrdersCount: 1,
      showDynamicStopColumns: false,
      window: { startedAt: nowForBot, finishedAt: null },
      summary: {
        realizedPnl,
        unrealizedPnl,
        feesPaid: 1,
        portfolioValue,
        freeFunds,
        baseCurrency: "USDT",
      },
      openOrders: [
        {
          id: openOrderId,
          symbol,
          side: "BUY",
          status: "OPEN",
          type: "LIMIT",
          quantity: 0.1,
          filledQuantity: 0,
          price: 100,
          stopPrice: null,
          origin: "BOT",
          exchangeOrderId: null,
          submittedAt: nowForBot,
          createdAt: nowForBot,
        },
      ],
      openItems: [
        {
          id: `position-${botId}`,
          symbol,
          side: "LONG",
          status: "OPEN",
          origin: "BOT",
          managementMode: "BOT_MANAGED",
          quantity: 0.1,
          leverage: 10,
          marginUsed,
          entryPrice: 100,
          entryNotional: marginUsed * 10,
          exitPrice: null,
          stopLoss: null,
          takeProfit: null,
          openedAt: nowForBot,
          closedAt: null,
          holdMs: 60000,
          dcaCount: 0,
          feesPaid: 1,
          realizedPnl: 0,
          unrealizedPnl,
          unrealizedPnlPercent: unrealizedPnl,
          markPrice: 100 + unrealizedPnl,
          firstTradeAt: nowForBot,
          lastTradeAt: nowForBot,
          tradesCount: 1,
        },
      ],
      historyItems: [],
    },
    trades: {
      sessionId: session.id,
      total: 1,
      meta: { page: 1, pageSize: 25, total: 1, totalPages: 1, hasPrev: false, hasNext: false },
      window: { startedAt: nowForBot, finishedAt: null },
      items: [
        {
          id: tradeId,
          symbol,
          side: "BUY",
          lifecycleAction: "OPEN",
          price: 100,
          quantity: 0.1,
          fee: 1,
          feeSource: "ESTIMATED",
          feePending: false,
          feeCurrency: "USDT",
          realizedPnl,
          executedAt: nowForBot,
          orderId: openOrderId,
          positionId: `position-${botId}`,
          strategyId: "strategy-1",
          origin: "BOT",
          managementMode: "BOT_MANAGED",
          notional: marginUsed * 10,
          margin: marginUsed,
        },
      ],
    },
  };
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

  it("renders loading and retryable error states for the dashboard runtime surface", async () => {
    listBotsMock.mockReturnValue(new Promise(() => {}));

    const { unmount } = render(
      <I18nProvider>
        <HomeLiveWidgets />
      </I18nProvider>
    );

    expect(
      screen.getByLabelText("Loading operational dashboard", { selector: "[aria-busy='true']" })
    ).toBeInTheDocument();

    unmount();
    vi.clearAllMocks();
    window.localStorage.clear();
    window.localStorage.setItem("cryptosparrow-locale", "en");
    listBotsMock.mockRejectedValueOnce(new Error("runtime-fetch-failed"));

    render(
      <I18nProvider>
        <HomeLiveWidgets />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Could not load operational dashboard")).toBeInTheDocument();
      expect(screen.getByText("Could not fetch dashboard widgets.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    });
  });

  it("keeps selected-bot switching, wallet KPIs, and runtime tabs aligned to the selected snapshot", async () => {
    const alphaBot = createRuntimeBot({
      id: "bot-alpha",
      name: "Alpha Audit Bot",
      symbol: "BTCUSDT",
      walletName: "Alpha Paper",
      paperStartBalance: 1000,
    });
    const betaBot = createRuntimeBot({
      id: "bot-beta",
      name: "Beta Audit Bot",
      symbol: "ETHUSDT",
      walletName: "Beta Paper",
      paperStartBalance: 1500,
    });
    const aggregates = new Map([
      [
        alphaBot.id,
        createAggregate({
          botId: alphaBot.id,
          symbol: "BTCUSDT",
          realizedPnl: 10,
          unrealizedPnl: 5,
          portfolioValue: 1015,
          freeFunds: 900,
          marginUsed: 115,
          openOrderId: "alpha-order-open",
          tradeId: "alpha-trade-open",
        }),
      ],
      [
        betaBot.id,
        createAggregate({
          botId: betaBot.id,
          symbol: "ETHUSDT",
          realizedPnl: -20,
          unrealizedPnl: 20,
          portfolioValue: 1500,
          freeFunds: 1250,
          marginUsed: 250,
          openOrderId: "beta-order-open",
          tradeId: "beta-trade-open",
        }),
      ],
    ]);

    listBotsMock.mockResolvedValue([alphaBot, betaBot]);
    listBotRuntimeSessionsMock.mockImplementation(async (botId: string) => [
      createSession(botId, botId === betaBot.id ? "ETHUSDT" : "BTCUSDT", botId === betaBot.id ? -20 : 10),
    ]);
    getBotRuntimeGraphMock.mockImplementation(async (botId: string) => ({
      ...runtimeGraph,
      bot: botId === betaBot.id ? betaBot : alphaBot,
      markets: [{ symbol: botId === betaBot.id ? "ETHUSDT" : "BTCUSDT", status: "ACTIVE", isEnabled: true }],
      marketGroups: [
        {
          id: `group-${botId}`,
          botId,
          symbolGroupId: `symbols-${botId}`,
          lifecycleStatus: "ACTIVE",
          executionOrder: 1,
          isEnabled: true,
          createdAt: now,
          updatedAt: now,
          symbolGroup: {
            id: `symbols-${botId}`,
            name: botId === betaBot.id ? "Beta group" : "Alpha group",
            symbols: [botId === betaBot.id ? "ETHUSDT" : "BTCUSDT"],
            marketUniverseId: "market-universe-1",
          },
          strategies: [
            {
              id: `strategy-link-${botId}`,
              strategyId: "strategy-1",
              priority: 1,
              weight: 1,
              isEnabled: true,
              createdAt: now,
              updatedAt: now,
              strategy: {
                id: "strategy-1",
                name: "RSI 20/80",
                interval: "5m",
                leverage: 10,
              },
            },
          ],
        },
      ],
      legacyBotStrategies: [],
    }));
    getBotRuntimeMonitoringAggregateMock.mockImplementation(async (botId: string) => aggregates.get(botId));

    render(
      <I18nProvider>
        <HomeLiveWidgets />
      </I18nProvider>
    );

    let selector: HTMLSelectElement;
    await waitFor(() => {
      const selectorLabel = screen.getByText("Selected bot").closest("label");
      expect(selectorLabel).not.toBeNull();
      selector = within(selectorLabel as HTMLLabelElement).getByRole("combobox") as HTMLSelectElement;
      expect(selector.value).toBe(alphaBot.id);
      expect(within(screen.getByTestId("wallet-section")).getByText("Alpha Paper")).toBeInTheDocument();
      expect(within(screen.getByTestId("wallet-kpi-portfolio")).getByText("1,010.50 USDT")).toBeInTheDocument();
      expect(screen.getAllByText("BTCUSDT").length).toBeGreaterThan(0);
    });

    fireEvent.change(selector!, { target: { value: betaBot.id } });

    await waitFor(() => {
      expect(selector!.value).toBe(betaBot.id);
      expect(within(screen.getByTestId("wallet-section")).getByText("Beta Paper")).toBeInTheDocument();
      expect(within(screen.getByTestId("wallet-kpi-free-funds")).getByText("1,232.00 USDT")).toBeInTheDocument();
      expect(within(screen.getByTestId("wallet-kpi-in-positions")).getByText("250.00 USDT")).toBeInTheDocument();
      expect(screen.getAllByText("ETHUSDT").length).toBeGreaterThan(0);
      expect(screen.queryByText("Alpha Paper")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("tab", { name: "Orders" }));

    await waitFor(() => {
      expect(screen.getAllByText("ETHUSDT").length).toBeGreaterThan(0);
      expect(screen.queryByText("BTCUSDT")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cancel order" })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("tab", { name: "History" }));

    await waitFor(() => {
      expect(screen.getByText("Trades")).toBeInTheDocument();
      expect(screen.getAllByText("ETHUSDT").length).toBeGreaterThan(0);
      expect(screen.queryByText("BTCUSDT")).not.toBeInTheDocument();
    });
    expect(getBotRuntimeMonitoringAggregateMock).toHaveBeenCalledWith(
      betaBot.id,
      expect.objectContaining({ perSessionLimit: 30 })
    );
  }, 10_000);

  it("keeps two PAPER bots and two LIVE venue bots visible without mixing selected runtime rows", async () => {
    const paperA = createRuntimeBot({
      id: "paper-a",
      name: "Concurrent Paper A",
      symbol: "ETHUSDT",
      walletName: "Paper Wallet A",
      paperStartBalance: 10_000,
    });
    const paperB = createRuntimeBot({
      id: "paper-b",
      name: "Concurrent Paper B",
      symbol: "SOLUSDT",
      walletName: "Paper Wallet B",
      paperStartBalance: 20_000,
    });
    const liveBinance = createRuntimeBot({
      id: "live-binance",
      name: "Concurrent Binance LIVE",
      symbol: "BTCUSDT",
      walletName: "Binance LIVE Wallet",
      paperStartBalance: 0,
      mode: "LIVE",
      exchange: "BINANCE",
    });
    const liveGate = createRuntimeBot({
      id: "live-gate",
      name: "Concurrent Gate.io LIVE",
      symbol: "BTCUSDT",
      walletName: "Gate.io LIVE Wallet",
      paperStartBalance: 0,
      mode: "LIVE",
      exchange: "GATEIO",
    });
    const bots = [paperA, paperB, liveBinance, liveGate];
    const aggregates = new Map(
      bots.map((bot, index) => {
        const aggregate = createAggregate({
          botId: bot.id,
          symbol: bot.symbol,
          realizedPnl: index,
          unrealizedPnl: index + 1,
          portfolioValue: 10_000 + index,
          freeFunds: 9_000 + index,
          marginUsed: 100 + index,
          openOrderId: `order-${bot.id}`,
          tradeId: `trade-${bot.id}`,
        });
        aggregate.positions.openItems[0].id = `position-${bot.id}`;
        aggregate.positions.openItems[0].side = bot.id === liveGate.id ? "SHORT" : "LONG";
        aggregate.positions.openItems[0].origin = bot.mode === "LIVE" ? "EXCHANGE_SYNC" : "BOT";
        aggregate.positions.openItems[0].managementMode = "BOT_MANAGED";
        return [bot.id, aggregate];
      })
    );

    listBotsMock.mockResolvedValue(bots);
    listBotRuntimeSessionsMock.mockImplementation(async (botId: string) => [
      createSession(botId, bots.find((bot) => bot.id === botId)?.symbol ?? "BTCUSDT", 0),
    ]);
    getBotRuntimeGraphMock.mockImplementation(async (botId: string) => {
      const bot = bots.find((item) => item.id === botId) ?? paperA;
      return {
        ...runtimeGraph,
        bot,
        markets: [{ symbol: bot.symbol, status: "ACTIVE", isEnabled: true }],
        marketGroups: [
          {
            id: `group-${botId}`,
            botId,
            symbolGroupId: `symbols-${botId}`,
            lifecycleStatus: "ACTIVE",
            executionOrder: 1,
            isEnabled: true,
            createdAt: now,
            updatedAt: now,
            symbolGroup: {
              id: `symbols-${botId}`,
              name: `${bot.name} group`,
              symbols: [bot.symbol],
              marketUniverseId: `market-${botId}`,
              marketUniverse: {
                exchange: bot.exchange,
                marketType: "FUTURES",
                baseCurrency: "USDT",
              },
            },
            strategies: [],
          },
        ],
        legacyBotStrategies: [],
      };
    });
    getBotRuntimeMonitoringAggregateMock.mockImplementation(async (botId: string) => aggregates.get(botId));

    render(
      <I18nProvider>
        <HomeLiveWidgets />
      </I18nProvider>
    );

    let selector: HTMLSelectElement;
    await waitFor(() => {
      const selectorLabel = screen.getByText("Selected bot").closest("label");
      expect(selectorLabel).not.toBeNull();
      selector = within(selectorLabel as HTMLLabelElement).getByRole("combobox") as HTMLSelectElement;
      expect(within(selector).getByRole("option", { name: /Concurrent Paper A/ })).toBeInTheDocument();
      expect(within(selector).getByRole("option", { name: /Concurrent Paper B/ })).toBeInTheDocument();
      expect(within(selector).getByRole("option", { name: /Concurrent Binance LIVE/ })).toBeInTheDocument();
      expect(within(selector).getByRole("option", { name: /Concurrent Gate.io LIVE/ })).toBeInTheDocument();
      expect(selector.value).toBe(liveBinance.id);
      expect(within(screen.getByTestId("wallet-section")).getByText("Binance LIVE Wallet")).toBeInTheDocument();
      expect(screen.getAllByText("BTCUSDT").length).toBeGreaterThan(0);
    });

    fireEvent.change(selector!, { target: { value: paperA.id } });

    await waitFor(() => {
      expect(selector!.value).toBe(paperA.id);
      expect(within(screen.getByTestId("wallet-section")).getByText("Paper Wallet A")).toBeInTheDocument();
      expect(screen.getAllByText("ETHUSDT").length).toBeGreaterThan(0);
      expect(screen.queryByText("Binance LIVE Wallet")).not.toBeInTheDocument();
    });

    fireEvent.change(selector!, { target: { value: liveGate.id } });

    await waitFor(() => {
      expect(selector!.value).toBe(liveGate.id);
      expect(within(screen.getByTestId("wallet-section")).getByText("Gate.io LIVE Wallet")).toBeInTheDocument();
      expect(screen.getAllByText("BTCUSDT").length).toBeGreaterThan(0);
      expect(screen.getAllByText("SHORT").length).toBeGreaterThan(0);
      expect(screen.queryByText("Binance LIVE Wallet")).not.toBeInTheDocument();
    });

    fireEvent.change(selector!, { target: { value: paperB.id } });

    await waitFor(() => {
      expect(selector!.value).toBe(paperB.id);
      expect(within(screen.getByTestId("wallet-section")).getByText("Paper Wallet B")).toBeInTheDocument();
      expect(screen.getAllByText("SOLUSDT").length).toBeGreaterThan(0);
      expect(screen.queryByText("Gate.io LIVE Wallet")).not.toBeInTheDocument();
      expect(screen.queryByText("BTCUSDT")).not.toBeInTheDocument();
    });
  }, 10_000);
});
