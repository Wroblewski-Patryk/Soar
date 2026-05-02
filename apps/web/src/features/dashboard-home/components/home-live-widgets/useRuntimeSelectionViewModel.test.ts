import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useRuntimeSelectionViewModel } from "./useRuntimeSelectionViewModel";
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
});
