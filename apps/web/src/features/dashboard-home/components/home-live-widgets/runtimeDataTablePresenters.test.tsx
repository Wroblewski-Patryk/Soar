import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { BotRuntimeTrade } from "@/features/bots/types/bot.type";
import type { OpenPositionWithLive } from "./types";
import {
  createHistoryPositionsColumns,
  createOpenPositionsColumns,
  createTradesColumns,
} from "./runtimeDataTablePresenters";

const openPositionRow = {
  id: "position-open-1",
  symbol: "DOGEUSDT",
  side: "LONG",
  status: "OPEN",
  quantity: 10,
  leverage: 5,
  entryPrice: 0.1,
  entryNotional: 1,
  exitPrice: null,
  stopLoss: null,
  takeProfit: null,
  openedAt: "2026-04-29T10:00:00.000Z",
  closedAt: null,
  holdMs: 0,
  dcaCount: 0,
  feesPaid: 0,
  realizedPnl: 0,
  unrealizedPnl: 0,
  markPrice: 0.11,
  firstTradeAt: null,
  lastTradeAt: null,
  tradesCount: 0,
  liveMarkPrice: 0.11,
  liveMarkPriceSource: "exchange_unrealized_pnl",
  liveUnrealizedPnl: 0.1,
  livePnlPct: 10,
  marginNotional: 1,
  openPnl: 0.1,
  marginUsed: 1,
  pnlNotionalPct: 10,
  pnlMarginPct: 10,
  marginInitPct: null,
  ttpProtectedPercent: null,
  ttpProtectedSource: null,
  tslProtectedPercent: null,
} satisfies OpenPositionWithLive;

const tradeRow = {
  id: "trade-1",
  symbol: "BTCUSDT",
  side: "BUY",
  lifecycleAction: "OPEN",
  actionReason: "SIGNAL_ENTRY",
  closeInitiator: null,
  price: 100,
  quantity: 1,
  fee: 0,
  feeSource: "ESTIMATED",
  feePending: false,
  feeCurrency: "USDT",
  realizedPnl: 0,
  executedAt: "2026-05-02T10:00:00.000Z",
  orderId: "order-1",
  positionId: "position-1",
  strategyId: "strategy-1",
  origin: "BOT",
  managementMode: "BOT",
  notional: 100,
  margin: 10,
} satisfies BotRuntimeTrade;

describe("createOpenPositionsColumns", () => {
  it("renders position action buttons with shared table action tones", () => {
    const columns = createOpenPositionsColumns({
      t: (key) =>
        ({
          "dashboard.home.runtime.timeOpened": "Time opened",
          "dashboard.home.runtime.symbol": "Symbol",
          "dashboard.home.runtime.side": "Side",
          "dashboard.home.runtime.status": "Status",
          "dashboard.home.runtime.margin": "Margin",
          "dashboard.home.runtime.pnl": "PnL",
          "dashboard.home.runtime.pnlPercent": "PnL%",
          "dashboard.home.runtime.markPrice": "Mark",
          "dashboard.bots.monitoring.markPriceSourceExchangePnl": "Exchange PnL",
          "dashboard.home.runtime.dca": "DCA",
          "dashboard.home.runtime.continuityConfirmed": "Confirmed",
        })[key] ?? key,
      formatDateTimeWithSeconds: (value) => value ?? "-",
      formatNumber: (value) => String(value),
      formatPercent: (value) => `${value}%`,
      formatRuntimeAmount: (value) => String(value),
      formatDcaPercent: (value) => `${value}%`,
      withRuntimeUnit: (label) => label,
      resolveRuntimeIcon: () => null,
      runtimeIconsLoading: false,
      runtimeIconsError: null,
      showDynamicStopColumns: false,
      closePositionActionColumnLabel: "Action",
      closePositionPendingLabel: "Closing...",
      closePositionButtonLabel: "Close position",
      editPositionButtonLabel: "Edit position",
      positionActionsUnavailableLabel: "Unavailable",
      isClosingPosition: () => false,
      onOpenPositionEdit: vi.fn(),
      onCloseRuntimePosition: vi.fn(),
    });

    const actionColumn = columns.find((column) => column.key === "actionClosePosition");
    render(<div>{actionColumn?.render?.(openPositionRow)}</div>);

    expect(screen.getByRole("button", { name: "Edit position" })).toHaveClass(
      "border-info/45",
      "bg-info/10",
      "text-info"
    );
    expect(screen.getByRole("button", { name: "Close position" })).toHaveClass(
      "border-error/45",
      "bg-error/10",
      "text-error"
    );
    expect(screen.getByRole("button", { name: "Close position" })).not.toHaveClass("btn-outline");
  });

  it("renders mark price source from shared runtime derivation", () => {
    const columns = createOpenPositionsColumns({
      t: (key) =>
        ({
          "dashboard.home.runtime.timeOpened": "Time opened",
          "dashboard.home.runtime.symbol": "Symbol",
          "dashboard.home.runtime.side": "Side",
          "dashboard.home.runtime.status": "Status",
          "dashboard.home.runtime.margin": "Margin",
          "dashboard.home.runtime.pnl": "PnL",
          "dashboard.home.runtime.pnlPercent": "PnL%",
          "dashboard.home.runtime.markPrice": "Mark",
          "dashboard.bots.monitoring.markPriceSourceExchangePnl": "Exchange PnL",
          "dashboard.home.runtime.dca": "DCA",
          "dashboard.home.runtime.continuityConfirmed": "Confirmed",
        })[key] ?? key,
      formatDateTimeWithSeconds: (value) => value ?? "-",
      formatNumber: (value) => String(value),
      formatPercent: (value) => `${value}%`,
      formatRuntimeAmount: (value) => String(value),
      formatDcaPercent: (value) => `${value}%`,
      withRuntimeUnit: (label) => label,
      resolveRuntimeIcon: () => null,
      runtimeIconsLoading: false,
      runtimeIconsError: null,
      showDynamicStopColumns: false,
      closePositionActionColumnLabel: "Action",
      closePositionPendingLabel: "Closing...",
      closePositionButtonLabel: "Close position",
      editPositionButtonLabel: "Edit position",
      positionActionsUnavailableLabel: "Unavailable",
      isClosingPosition: () => false,
      onOpenPositionEdit: vi.fn(),
      onCloseRuntimePosition: vi.fn(),
    });

    const markColumn = columns.find((column) => column.key === "markPrice");

    expect(markColumn?.label).toBe("Mark");

    render(<div>{markColumn?.render?.(openPositionRow)}</div>);

    expect(screen.getByText("0.11")).toBeInTheDocument();
    expect(screen.getByText("Exchange PnL")).toHaveClass("uppercase");
  });

  it("renders actionability details from runtime position payload", () => {
    const columns = createOpenPositionsColumns({
      t: (key) =>
        ({
          "dashboard.home.runtime.timeOpened": "Time opened",
          "dashboard.home.runtime.symbol": "Symbol",
          "dashboard.home.runtime.side": "Side",
          "dashboard.home.runtime.status": "Status",
          "dashboard.home.runtime.margin": "Margin",
          "dashboard.home.runtime.pnl": "PnL",
          "dashboard.home.runtime.pnlPercent": "PnL%",
          "dashboard.home.runtime.markPrice": "Mark",
          "dashboard.bots.monitoring.markPriceSourceExchangePnl": "Exchange PnL",
          "dashboard.home.runtime.dca": "DCA",
          "dashboard.home.runtime.continuityRecoveredUnactionable": "Visible / blocked",
          "dashboard.home.runtime.runtimeStateActionBlocked": "Action blocked",
          "dashboard.home.runtime.runtimeStateStrategyContextUnresolved": "Strategy context unresolved",
        })[key] ?? key,
      formatDateTimeWithSeconds: (value) => value ?? "-",
      formatNumber: (value) => String(value),
      formatPercent: (value) => `${value}%`,
      formatRuntimeAmount: (value) => String(value),
      formatDcaPercent: (value) => `${value}%`,
      withRuntimeUnit: (label) => label,
      resolveRuntimeIcon: () => null,
      runtimeIconsLoading: false,
      runtimeIconsError: null,
      showDynamicStopColumns: false,
      closePositionActionColumnLabel: "Action",
      closePositionPendingLabel: "Closing...",
      closePositionButtonLabel: "Close position",
      editPositionButtonLabel: "Edit position",
      positionActionsUnavailableLabel: "Unavailable",
      isClosingPosition: () => false,
      onOpenPositionEdit: vi.fn(),
      onCloseRuntimePosition: vi.fn(),
    });

    const statusColumn = columns.find((column) => column.key === "status");

    render(
      <div>
        {statusColumn?.render?.({
          ...openPositionRow,
          continuityState: "RECOVERED_UNACTIONABLE",
          actionable: false,
          strategyAutomationContextResolved: false,
        })}
      </div>
    );

    expect(screen.getByText("Visible / blocked")).toHaveClass("badge-warning");
    expect(screen.getByText("Action blocked")).toBeInTheDocument();
    expect(screen.getByText("Strategy context unresolved")).toBeInTheDocument();
  });

  it("renders exchange-adopted provenance from runtime position payload", () => {
    const columns = createOpenPositionsColumns({
      t: (key) =>
        ({
          "dashboard.home.runtime.timeOpened": "Time opened",
          "dashboard.home.runtime.symbol": "Symbol",
          "dashboard.home.runtime.side": "Side",
          "dashboard.home.runtime.status": "Status",
          "dashboard.home.runtime.margin": "Margin",
          "dashboard.home.runtime.pnl": "PnL",
          "dashboard.home.runtime.pnlPercent": "PnL%",
          "dashboard.home.runtime.markPrice": "Mark",
          "dashboard.bots.monitoring.markPriceSourceExchangePnl": "Exchange PnL",
          "dashboard.home.runtime.dca": "DCA",
          "dashboard.home.runtime.continuityConfirmed": "Confirmed",
          "dashboard.home.runtime.provenanceExchangeAdopted": "Exchange adopted",
        })[key] ?? key,
      formatDateTimeWithSeconds: (value) => value ?? "-",
      formatNumber: (value) => String(value),
      formatPercent: (value) => `${value}%`,
      formatRuntimeAmount: (value) => String(value),
      formatDcaPercent: (value) => `${value}%`,
      withRuntimeUnit: (label) => label,
      resolveRuntimeIcon: () => null,
      runtimeIconsLoading: false,
      runtimeIconsError: null,
      showDynamicStopColumns: false,
      closePositionActionColumnLabel: "Action",
      closePositionPendingLabel: "Closing...",
      closePositionButtonLabel: "Close position",
      editPositionButtonLabel: "Edit position",
      positionActionsUnavailableLabel: "Unavailable",
      isClosingPosition: () => false,
      onOpenPositionEdit: vi.fn(),
      onCloseRuntimePosition: vi.fn(),
    });

    const statusColumn = columns.find((column) => column.key === "status");

    render(
      <div>
        {statusColumn?.render?.({
          ...openPositionRow,
          origin: "EXCHANGE_SYNC",
          syncState: "IN_SYNC",
          takeoverStatus: "OWNED_AND_MANAGED",
        })}
      </div>
    );

    expect(screen.getByText("Exchange adopted")).toHaveClass("uppercase");
  });

  it("labels fallback TTP protection as prospective in open-position rows", () => {
    const columns = createOpenPositionsColumns({
      t: (key) =>
        ({
          "dashboard.home.runtime.timeOpened": "Time opened",
          "dashboard.home.runtime.symbol": "Symbol",
          "dashboard.home.runtime.side": "Side",
          "dashboard.home.runtime.status": "Status",
          "dashboard.home.runtime.margin": "Margin",
          "dashboard.home.runtime.pnl": "PnL",
          "dashboard.home.runtime.pnlPercent": "PnL%",
          "dashboard.home.runtime.markPrice": "Mark",
          "dashboard.bots.monitoring.markPriceSourceExchangePnl": "Exchange PnL",
          "dashboard.home.runtime.dca": "DCA",
          "dashboard.home.runtime.slTtp": "TTP",
          "dashboard.home.runtime.slTsl": "TSL",
          "dashboard.home.runtime.continuityConfirmed": "Confirmed",
          "dashboard.home.runtime.prospectiveProtection": "Prospective",
        })[key] ?? key,
      formatDateTimeWithSeconds: (value) => value ?? "-",
      formatNumber: (value) => String(value),
      formatPercent: (value) => `${value}%`,
      formatRuntimeAmount: (value) => String(value),
      formatDcaPercent: (value) => `${value}%`,
      withRuntimeUnit: (label) => label,
      resolveRuntimeIcon: () => null,
      runtimeIconsLoading: false,
      runtimeIconsError: null,
      showDynamicStopColumns: true,
      closePositionActionColumnLabel: "Action",
      closePositionPendingLabel: "Closing...",
      closePositionButtonLabel: "Close position",
      editPositionButtonLabel: "Edit position",
      positionActionsUnavailableLabel: "Unavailable",
      isClosingPosition: () => false,
      onOpenPositionEdit: vi.fn(),
      onCloseRuntimePosition: vi.fn(),
    });

    const ttpColumn = columns.find((column) => column.key === "ttp");

    render(
      <div>
        {ttpColumn?.render?.({
          ...openPositionRow,
          fallbackTtpProtectedPercent: 7,
        })}
      </div>
    );

    expect(screen.getByText("7%")).toBeInTheDocument();
    expect(screen.getByText("Prospective")).toHaveClass("uppercase");
  });

  it("labels API strategy-fallback TTP protection as prospective in open-position rows", () => {
    const columns = createOpenPositionsColumns({
      t: (key) =>
        ({
          "dashboard.home.runtime.timeOpened": "Time opened",
          "dashboard.home.runtime.symbol": "Symbol",
          "dashboard.home.runtime.side": "Side",
          "dashboard.home.runtime.status": "Status",
          "dashboard.home.runtime.margin": "Margin",
          "dashboard.home.runtime.pnl": "PnL",
          "dashboard.home.runtime.pnlPercent": "PnL%",
          "dashboard.home.runtime.markPrice": "Mark",
          "dashboard.bots.monitoring.markPriceSourceExchangePnl": "Exchange PnL",
          "dashboard.home.runtime.dca": "DCA",
          "dashboard.home.runtime.slTtp": "TTP",
          "dashboard.home.runtime.slTsl": "TSL",
          "dashboard.home.runtime.continuityConfirmed": "Confirmed",
          "dashboard.home.runtime.prospectiveProtection": "Prospective",
        })[key] ?? key,
      formatDateTimeWithSeconds: (value) => value ?? "-",
      formatNumber: (value) => String(value),
      formatPercent: (value) => `${value}%`,
      formatRuntimeAmount: (value) => String(value),
      formatDcaPercent: (value) => `${value}%`,
      withRuntimeUnit: (label) => label,
      resolveRuntimeIcon: () => null,
      runtimeIconsLoading: false,
      runtimeIconsError: null,
      showDynamicStopColumns: true,
      closePositionActionColumnLabel: "Action",
      closePositionPendingLabel: "Closing...",
      closePositionButtonLabel: "Close position",
      editPositionButtonLabel: "Edit position",
      positionActionsUnavailableLabel: "Unavailable",
      isClosingPosition: () => false,
      onOpenPositionEdit: vi.fn(),
      onCloseRuntimePosition: vi.fn(),
    });

    const ttpColumn = columns.find((column) => column.key === "ttp");

    render(
      <div>
        {ttpColumn?.render?.({
          ...openPositionRow,
          ttpProtectedPercent: 7,
          ttpProtectedSource: "prospective",
        })}
      </div>
    );

    expect(screen.getByText("7%")).toBeInTheDocument();
    expect(screen.getByText("Prospective")).toHaveClass("uppercase");
  });
});

describe("createHistoryPositionsColumns", () => {
  it("exposes separate opened and closed time columns for history rows", () => {
    const columns = createHistoryPositionsColumns({
      t: (key) =>
        ({
          "dashboard.home.runtime.timeOpened": "Time opened",
          "dashboard.home.runtime.timeClosed": "Time closed",
          "dashboard.home.runtime.symbol": "Symbol",
          "dashboard.home.runtime.side": "Side",
          "dashboard.home.runtime.qty": "Qty",
          "dashboard.bots.monitoring.table.entry": "Entry",
          "dashboard.bots.monitoring.table.exit": "Exit",
          "dashboard.home.runtime.realizedPnl": "Realized PnL",
          "dashboard.home.runtime.closeBy": "Closed by",
        })[key] ?? key,
      formatNumber: (value) => String(value),
      formatRuntimeAmount: (value) => String(value),
      withRuntimeUnit: (label) => label,
      resolveRuntimeIcon: () => null,
      runtimeIconsLoading: false,
      runtimeIconsError: null,
      formatDateTime: (value) => value ?? "-",
    });

    expect(columns[0]?.key).toBe("openedAt");
    expect(columns[0]?.label).toBe("Time opened");
    expect(columns[1]?.key).toBe("closedAt");
    expect(columns[1]?.label).toBe("Time closed");

    const row = {
      id: "position-1",
      symbol: "DOGEUSDT",
      side: "LONG" as const,
      status: "CLOSED" as const,
      quantity: 10,
      leverage: 5,
      entryPrice: 0.1,
      entryNotional: 1,
      exitPrice: 0.12,
      stopLoss: null,
      takeProfit: null,
      openedAt: "2026-04-29T10:00:00.000Z",
      closedAt: "2026-04-29T10:15:00.000Z",
      holdMs: 900000,
      dcaCount: 0,
      feesPaid: 0,
      realizedPnl: 0.2,
      unrealizedPnl: 0,
      markPrice: null,
      firstTradeAt: null,
      lastTradeAt: null,
      tradesCount: 0,
    };

    const openedCell = columns[0]?.render?.(row);
    const closedCell = columns[1]?.render?.(row);

    render(
      <div>
        <div>{openedCell}</div>
        <div>{closedCell}</div>
      </div>
    );

    expect(screen.getByText("2026-04-29T10:00:00.000Z")).toBeInTheDocument();
    expect(screen.getByText("2026-04-29T10:15:00.000Z")).toBeInTheDocument();
  });

  it("renders a dash for missing closedAt in history rows", () => {
    const columns = createHistoryPositionsColumns({
      t: (key) =>
        ({
          "dashboard.home.runtime.timeOpened": "Time opened",
          "dashboard.home.runtime.timeClosed": "Time closed",
          "dashboard.home.runtime.symbol": "Symbol",
          "dashboard.home.runtime.side": "Side",
          "dashboard.home.runtime.qty": "Qty",
          "dashboard.bots.monitoring.table.entry": "Entry",
          "dashboard.bots.monitoring.table.exit": "Exit",
          "dashboard.home.runtime.realizedPnl": "Realized PnL",
          "dashboard.home.runtime.closeBy": "Closed by",
        })[key] ?? key,
      formatNumber: (value) => String(value),
      formatRuntimeAmount: (value) => String(value),
      withRuntimeUnit: (label) => label,
      resolveRuntimeIcon: () => null,
      runtimeIconsLoading: false,
      runtimeIconsError: null,
      formatDateTime: (value) => value ?? "-",
    });

    const row = {
      id: "position-2",
      symbol: "BTCUSDT",
      side: "LONG" as const,
      status: "CLOSED" as const,
      quantity: 1,
      leverage: 1,
      entryPrice: 100,
      entryNotional: 100,
      exitPrice: null,
      stopLoss: null,
      takeProfit: null,
      openedAt: "2026-04-29T11:00:00.000Z",
      closedAt: null,
      holdMs: 0,
      dcaCount: 0,
      feesPaid: 0,
      realizedPnl: 0,
      unrealizedPnl: 0,
      markPrice: null,
      firstTradeAt: null,
      lastTradeAt: null,
      tradesCount: 0,
    };

    render(<div>{columns[1]?.render?.(row)}</div>);

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});

describe("createTradesColumns", () => {
  it("keeps long trade reason and actor pills on one line", () => {
    const columns = createTradesColumns({
      t: (key) =>
        ({
          "dashboard.home.runtime.reasonPositionLifecycleOpen": "Position lifecycle open",
          "dashboard.home.runtime.openByBotApp": "Bot app",
          "dashboard.home.runtime.filterAction": "Action",
          "dashboard.home.runtime.reason": "Reason",
          "dashboard.home.runtime.openedClosedBy": "Opened / closed by",
          "dashboard.home.runtime.time": "Time",
          "dashboard.home.runtime.symbol": "Symbol",
          "dashboard.home.runtime.side": "Side",
          "dashboard.home.runtime.qty": "Qty",
          "dashboard.home.runtime.price": "Price",
          "dashboard.home.runtime.margin": "Margin",
          "dashboard.home.runtime.realizedPnl": "Realized PnL",
        })[key] ?? key,
      formatNumber: (value) => String(value),
      formatRuntimeAmount: (value) => String(value),
      withRuntimeUnit: (label) => label,
      resolveRuntimeIcon: () => null,
      runtimeIconsLoading: false,
      runtimeIconsError: null,
      formatDateTime: (value) => value ?? "-",
    });
    const reasonColumn = columns.find((column) => column.key === "actionReason");
    const actorColumn = columns.find((column) => column.key === "closeInitiator");

    expect(reasonColumn).toBeTruthy();
    expect(actorColumn).toBeTruthy();

    render(
      <>
        {reasonColumn?.render?.({
          ...tradeRow,
          actionReason: "POSITION_LIFETIME",
        })}
        {actorColumn?.render?.(tradeRow)}
      </>
    );

    expect(screen.getByText("Position lifecycle open")).toHaveClass("whitespace-nowrap");
    expect(screen.getByText("Bot app")).toHaveClass("whitespace-nowrap");
  });
});
