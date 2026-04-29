import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createHistoryPositionsColumns } from "./runtimeDataTablePresenters";

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
