import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RuntimeSidebarSection from "./home-live-widgets/RuntimeSidebarSection";

const formatNumber = (value: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat("pl-PL", options).format(value);
const formatAmountWithUnit = (value: number) => `${formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;

const createProps = (overrides?: Record<string, unknown>) => {
  const selected = {
    bot: {
      id: "bot-sidebar",
      name: "Sidebar Bot",
      walletId: "wallet-sidebar",
      mode: "PAPER",
      paperStartBalance: 10000,
      exchange: "BINANCE",
      marketType: "FUTURES",
      positionMode: "ONE_WAY",
      strategyId: "str-legacy-pref",
      isActive: true,
      liveOptIn: false,
      maxOpenPositions: 2,
      wallet: {
        id: "wallet-sidebar",
        name: "Main",
        mode: "PAPER",
        exchange: "BINANCE",
        marketType: "FUTURES",
        baseCurrency: "USDT",
        paperInitialBalance: 10000,
      },
    },
    session: null,
    actionSessionId: null,
    symbolStats: null,
    positions: null,
    trades: null,
    runtimeGraph: {
      bot: {
        id: "bot-sidebar",
        userId: "user-1",
        name: "Sidebar Bot",
        mode: "PAPER",
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 2,
        createdAt: "2026-04-20T10:00:00.000Z",
        updatedAt: "2026-04-20T10:00:00.000Z",
      },
      marketGroups: [
        {
          id: "mg-1",
          botId: "bot-sidebar",
          symbolGroupId: "sg-canonical",
          lifecycleStatus: "ACTIVE",
          executionOrder: 1,
          isEnabled: true,
          createdAt: "2026-04-20T10:00:00.000Z",
          updatedAt: "2026-04-20T10:00:00.000Z",
          symbolGroup: {
            id: "sg-canonical",
            name: "Canonical Market",
            symbols: ["BTCUSDT"],
            marketUniverseId: "mu-1",
          },
          strategies: [
            {
              id: "mgs-1",
              strategyId: "str-canonical",
              priority: 1,
              weight: 1,
              isEnabled: true,
              createdAt: "2026-04-20T10:00:00.000Z",
              updatedAt: "2026-04-20T10:00:00.000Z",
              strategy: {
                id: "str-canonical",
                name: "Canonical Strategy",
                interval: "15m",
                leverage: 12,
              },
            },
          ],
        },
      ],
      legacyBotStrategies: [
        {
          id: "legacy-1",
          strategyId: "str-legacy-pref",
          symbolGroupId: "sg-legacy",
          isEnabled: true,
          createdAt: "2026-04-20T10:00:00.000Z",
          updatedAt: "2026-04-20T10:00:00.000Z",
          strategy: {
            id: "str-legacy-pref",
            name: "Legacy Strategy",
            interval: "1m",
            leverage: 3,
          },
          symbolGroup: {
            id: "sg-legacy",
            name: "Legacy Market",
            symbols: ["ETHUSDT"],
            marketUniverseId: "mu-legacy",
          },
        },
      ],
    },
  } as any;

  const baseProps = {
    asideClassName: "w-full",
    snapshots: [selected],
    selected,
    selectedData: {
      session: null,
      symbols: [],
      open: [],
      usedMargin: 0,
      unrealized: 0,
      realized: 0,
      net: 0,
      wins: 0,
      losses: 0,
      winRate: null,
      paperInit: 10000,
      equity: 10000,
      free: 10000,
      exposurePct: 0,
      trades: [],
      drawdown: { abs: 0, pct: null },
    },
    selectedRuntimeCapabilityAvailable: true,
    placeholderBadgeLabel: "N/A",
    summary: {
      openPositions: 0,
      usedMargin: 0,
      realized: 0,
      unrealized: 0,
      totalSignals: 0,
      dcaCount: 0,
      paperStart: 10000,
      paperDelta: 0,
      paperEquity: 10000,
    },
    lastUpdatedAt: "2026-04-20T10:00:00.000Z",
    onSelectedBotIdChange: vi.fn(),
    formatTime: (value?: string | null) => value ?? "-",
    formatNumber,
    formatCurrency: (value: number) => formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    formatAmountWithUnit,
    formatPercent: (value: number) =>
      `${formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`,
    formatDateTime: (value?: string | null) => value ?? "-",
    sessionBadgeClassName: () => "badge",
    manualOrder: {
      title: "Manual order",
      symbolLabel: "Symbol",
      sideLabel: "Side",
      orderTypeLabel: "Order type",
      marginModeLabel: "Margin mode",
      leverageLabel: "Leverage",
      quantityLabel: "Quantity",
      priceLabel: "Price",
      fillPriceLabel: "Fill",
      minQtyLabel: "Min",
      sliderLabel: "Slider",
      sliderMinLabel: "Min",
      sliderMaxLabel: "Max",
      summaryBuyLabel: "Buy",
      summarySellLabel: "Sell",
      summaryEstimateLabel: "Estimate",
      summaryMaxLabel: "Max",
      openLabel: "Open",
      openingLabel: "Opening",
      buyLabel: "Buy",
      sellLabel: "Sell",
      contextLoadingLabel: "Loading",
      contextUnavailableLabel: "Unavailable",
      semanticsHintLabel: "Hint",
      noSymbolsLabel: "No symbols",
      botContext: "Sidebar Bot",
      symbolOptions: ["BTCUSDT"],
      symbol: "BTCUSDT",
      side: "BUY" as const,
      orderType: "MARKET" as const,
      marginMode: "CROSSED" as const,
      leverage: 10,
      minExecutableQty: 0.001,
      maxExecutableQty: 1,
      liveReferencePrice: 10000,
      quantity: "",
      price: "",
      sliderPercent: 0,
      estimatedNotional: null,
      estimatedMargin: null,
      isContextLoading: false,
      isSubmitting: false,
      isActionDisabled: false,
      onSymbolChange: vi.fn(),
      onSideChange: vi.fn(),
      onPriceChange: vi.fn(),
      onFillPrice: vi.fn(),
      onQuantityChange: vi.fn(),
      onSliderChange: vi.fn(),
      onSubmit: vi.fn(),
    },
    text: {
      walletTitle: "Wallet",
      selectedBot: "Selected bot",
      status: "Status",
      mode: "Mode",
      marketContextTitle: "Market context",
      strategyContextTitle: "Strategy context",
      marketGroup: "Market group",
      exchange: "Exchange",
      market: "Market",
      baseCurrency: "Base",
      strategy: "Strategy",
      interval: "Interval",
      leverage: "Leverage",
      walletAllocation: "Allocation",
      heartbeat: "Heartbeat",
      openPositions: "Open positions",
      signalsDca: "Signals DCA",
      netPnl: "Net",
      noSession: "No session",
      noActiveSessionWarning: "No active session",
      capitalRiskTitle: "Risk",
      portfolio: "Portfolio",
      deltaFromStart: "Delta",
      markets: "Markets",
      strategies: "Strategies",
      freeFunds: "Free funds",
      fundsInPositions: "Funds in positions",
      inPositionsShort: "In positions",
      exposure: "Exposure",
      realizedOpen: "Realized",
      winRate: "Win rate",
      maxDrawdown: "Drawdown",
      updatedAt: (value: string) => `Updated ${value}`,
    },
  };

  return {
    ...baseProps,
    ...(overrides ?? {}),
  };
};

describe("RuntimeSidebarSection strategy edge behavior", () => {
  it("keeps canonical strategy context when selected bot strategyId mismatches and legacy fallback exists", () => {
    const props = createProps();
    render(<RuntimeSidebarSection {...props} />);

    expect(screen.getByText("Canonical Market")).toBeInTheDocument();
    expect(screen.getByText("Canonical Strategy")).toBeInTheDocument();
    expect(screen.getByText("15m")).toBeInTheDocument();
    expect(screen.getByText("12x")).toBeInTheDocument();
    expect(screen.queryByText("Legacy Market")).not.toBeInTheDocument();
    expect(screen.queryByText("Legacy Strategy")).not.toBeInTheDocument();
  });

  it("keeps canonical strategy context when selected bot strategyId is null and legacy fallback exists", () => {
    const base = createProps();
    const props = createProps({
      selected: {
        ...(base.selected as Record<string, unknown>),
        bot: {
          ...((base.selected as any).bot ?? {}),
          strategyId: null,
        },
      },
    });
    render(<RuntimeSidebarSection {...props} />);

    expect(screen.getByText("Canonical Market")).toBeInTheDocument();
    expect(screen.getByText("Canonical Strategy")).toBeInTheDocument();
    expect(screen.queryByText("Legacy Market")).not.toBeInTheDocument();
    expect(screen.queryByText("Legacy Strategy")).not.toBeInTheDocument();
  });
});
