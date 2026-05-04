import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { resolveDynamicTtpDisplay } from "./runtimeDerivations";
import {
  resolveSelectedRuntimeTradeRows,
  useRuntimeSelectionViewModel,
} from "./useRuntimeSelectionViewModel";
import type { RuntimeSnapshot } from "./types";

const snapshot = {
  bot: {
    id: "bot-paper",
    mode: "PAPER",
    paperStartBalance: 1000,
    wallet: { paperInitialBalance: 1000 },
  },
  session: {
    id: "session-1",
    botId: "bot-paper",
    mode: "PAPER",
    status: "RUNNING",
    startedAt: "2026-05-02T10:00:00.000Z",
    finishedAt: null,
    lastHeartbeatAt: "2026-05-02T10:00:10.000Z",
    stopReason: null,
    errorMessage: null,
    createdAt: "2026-05-02T10:00:00.000Z",
    updatedAt: "2026-05-02T10:00:10.000Z",
    durationMs: 10000,
    eventsCount: 1,
    symbolsTracked: 1,
    summary: {
      totalSignals: 0,
      dcaCount: 0,
      closedTrades: 0,
      realizedPnl: 0,
    },
  },
  actionSessionId: "session-1",
  symbolStats: null,
  positions: {
    sessionId: "session-1",
    total: 1,
    openCount: 1,
    closedCount: 0,
    openOrdersCount: 0,
    window: {
      startedAt: "2026-05-02T10:00:00.000Z",
      finishedAt: "2026-05-02T10:05:00.000Z",
    },
    summary: {
      realizedPnl: 0,
      unrealizedPnl: 6.68,
      feesPaid: 0,
    },
    openOrders: [],
    openItems: [
      {
        id: "pos-doge",
        symbol: "DOGEUSDT",
        side: "SHORT",
        status: "OPEN",
        quantity: 1000,
        leverage: 10,
        marginUsed: 100,
        entryPrice: 1,
        entryNotional: 1000,
        exitPrice: null,
        stopLoss: null,
        takeProfit: null,
        openedAt: "2026-05-02T10:00:00.000Z",
        closedAt: null,
        holdMs: 0,
        dcaCount: 0,
        feesPaid: 0,
        realizedPnl: 0,
        unrealizedPnl: 6.68,
        unrealizedPnlPercent: 6.68,
        markPrice: 0.99332,
        firstTradeAt: null,
        lastTradeAt: null,
        tradesCount: 1,
      },
    ],
    historyItems: [],
  },
  trades: {
    sessionId: "session-1",
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
      startedAt: "2026-05-02T10:00:00.000Z",
      finishedAt: "2026-05-02T10:05:00.000Z",
    },
    items: [],
  },
  runtimeGraph: null,
} as unknown as RuntimeSnapshot;

const trade = {
  id: "trade-1",
  symbol: "DOGEUSDT",
  side: "SELL",
  lifecycleAction: "OPEN",
  price: 1,
  quantity: 1000,
  fee: 0.1,
  feeSource: "ESTIMATED",
  feePending: false,
  feeCurrency: "USDT",
  realizedPnl: 0,
  executedAt: "2026-05-02T10:00:00.000Z",
  orderId: "order-1",
  positionId: "pos-doge",
  strategyId: "strategy-runtime",
  origin: "BOT",
  managementMode: "BOT_MANAGED",
  notional: 1000,
  margin: 100,
} as const;

const tradeResponse = (sessionId: string, id: string) => ({
  sessionId,
  total: 1,
  meta: {
    page: 1,
    pageSize: 10,
    total: 1,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  },
  window: {
    startedAt: "2026-05-02T10:00:00.000Z",
    finishedAt: "2026-05-02T10:05:00.000Z",
  },
  items: [{ ...trade, id }],
});

describe("useRuntimeSelectionViewModel", () => {
  it("uses selected stream PnL consistently for dashboard summary and selected table", () => {
    const { result } = renderHook(() =>
      useRuntimeSelectionViewModel({
        snapshots: [snapshot],
        selected: snapshot,
        selectedTrades: null,
        liveTickerPrices: { DOGEUSDT: 0.991 },
      })
    );

    expect(result.current.selectedData?.open[0]?.liveUnrealizedPnl).toBeCloseTo(9, 8);
    expect(result.current.selectedData?.unrealized).toBeCloseTo(9, 8);
    expect(result.current.summary.unrealized).toBeCloseTo(9, 8);
    expect(result.current.summary.paperDelta).toBeCloseTo(9, 8);
    expect(result.current.summary.paperEquity).toBeCloseTo(1009, 8);
  });

  it("keeps snapshot trade rows visible before selected trade query is ready", () => {
    const snapshotWithTrades = {
      ...snapshot,
      trades: tradeResponse("session-1", "trade-1"),
    } as unknown as RuntimeSnapshot;

    const { result } = renderHook(() =>
      useRuntimeSelectionViewModel({
        snapshots: [snapshotWithTrades],
        selected: snapshotWithTrades,
        selectedTrades: null,
        liveTickerPrices: {},
      })
    );

    expect(result.current.selectedData?.trades).toHaveLength(1);
    expect(result.current.selectedData?.trades[0]?.id).toBe("trade-1");
  });

  it("shows fallback TTP protection when trailing take-profit is armed before stop price arrives", () => {
    const positions = snapshot.positions;
    expect(positions).not.toBeNull();
    const snapshotWithTrailingTtp = {
      ...snapshot,
      positions: {
        ...positions,
        openItems: [
          {
            ...positions!.openItems[0],
            trailingTakeProfitLevels: [{ armPercent: 5, trailPercent: 2 }],
            dynamicTtpStopLoss: null,
          },
        ],
      },
    } as unknown as RuntimeSnapshot;

    const { result } = renderHook(() =>
      useRuntimeSelectionViewModel({
        snapshots: [snapshotWithTrailingTtp],
        selected: snapshotWithTrailingTtp,
        selectedTrades: null,
        liveTickerPrices: { DOGEUSDT: 0.991 },
      })
    );

    const row = result.current.selectedData?.open[0];
    expect(row?.fallbackTtpProtectedPercent).toBeCloseTo(7, 8);
    expect(resolveDynamicTtpDisplay(row!)).toBeCloseTo(7, 8);
    expect(result.current.showDynamicStopColumns).toBe(true);
  });

  it("clears fallback TTP protection when live PnL drops below the disarm floor", () => {
    const positions = snapshot.positions;
    expect(positions).not.toBeNull();
    const snapshotWithTrailingTtp = {
      ...snapshot,
      positions: {
        ...positions,
        openItems: [
          {
            ...positions!.openItems[0],
            trailingTakeProfitLevels: [{ armPercent: 5, trailPercent: 2 }],
            dynamicTtpStopLoss: null,
          },
        ],
      },
    } as unknown as RuntimeSnapshot;

    const { result, rerender } = renderHook(
      ({ price }: { price: number }) =>
        useRuntimeSelectionViewModel({
          snapshots: [snapshotWithTrailingTtp],
          selected: snapshotWithTrailingTtp,
          selectedTrades: null,
          liveTickerPrices: { DOGEUSDT: price },
        }),
      { initialProps: { price: 0.991 } }
    );

    expect(resolveDynamicTtpDisplay(result.current.selectedData!.open[0]!)).toBeCloseTo(7, 8);

    rerender({ price: 0.9985 });

    expect(result.current.selectedData?.open[0]?.fallbackTtpProtectedPercent).toBeNull();
    expect(resolveDynamicTtpDisplay(result.current.selectedData!.open[0]!)).toBeNull();
    expect(result.current.showDynamicStopColumns).toBe(true);
  });
});

describe("resolveSelectedRuntimeTradeRows", () => {
  it("prefers selected trade query rows over matching snapshot rows", () => {
    expect(
      resolveSelectedRuntimeTradeRows({
        runtimeTradesSessionId: "session-1",
        selectedTrades: tradeResponse("session-1", "query-trade"),
        snapshotTrades: tradeResponse("session-1", "snapshot-trade"),
      }).map((item) => item.id)
    ).toEqual(["query-trade"]);
  });

  it("falls back to matching snapshot rows when selected trade query is not ready", () => {
    expect(
      resolveSelectedRuntimeTradeRows({
        runtimeTradesSessionId: "session-1",
        selectedTrades: null,
        snapshotTrades: tradeResponse("session-1", "snapshot-trade"),
      }).map((item) => item.id)
    ).toEqual(["snapshot-trade"]);
  });

  it("hides mismatched session rows", () => {
    expect(
      resolveSelectedRuntimeTradeRows({
        runtimeTradesSessionId: "session-1",
        selectedTrades: tradeResponse("session-2", "query-trade"),
        snapshotTrades: tradeResponse("session-3", "snapshot-trade"),
      })
    ).toEqual([]);
  });
});
