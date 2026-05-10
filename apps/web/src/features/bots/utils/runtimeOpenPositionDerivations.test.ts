import { describe, expect, it } from "vitest";

import { buildRuntimeOpenPositionRows } from "./runtimeOpenPositionDerivations";
import type {
  BotRuntimePositionsResponse,
  BotRuntimeSymbolStatsResponse,
} from "../types/bot.type";

const basePositions = (overrides?: Partial<BotRuntimePositionsResponse["openItems"][number]>): BotRuntimePositionsResponse => ({
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
      dcaCount: 1,
      dcaPlannedLevels: [2],
      dcaExecutedLevels: [2],
      feesPaid: 0,
      realizedPnl: 0,
      unrealizedPnl: 6.68,
      unrealizedPnlPercent: 6.68,
      markPrice: 0.99332,
      markPriceSource: "exchange_unrealized_pnl",
      dynamicTtpStopLoss: 0.992,
      dynamicTtpStopLossSource: "runtime_state",
      dynamicTslStopLoss: 0.99,
      firstTradeAt: null,
      lastTradeAt: null,
      tradesCount: 2,
      ...overrides,
    },
  ],
  historyItems: [],
});

const symbolStats: BotRuntimeSymbolStatsResponse = {
  sessionId: "session-1",
  items: [
    {
      id: "stat-doge",
      userId: "user-1",
      botId: "bot-1",
      sessionId: "session-1",
      symbol: "DOGEUSDT",
      totalSignals: 0,
      longEntries: 0,
      shortEntries: 0,
      exits: 0,
      dcaCount: 0,
      closedTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      realizedPnl: 0,
      grossProfit: 0,
      grossLoss: 0,
      feesPaid: 0,
      openPositionCount: 1,
      openPositionQty: 1000,
      unrealizedPnl: 5,
      lastPrice: 0.995,
      lastSignalAt: null,
      lastTradeAt: null,
      snapshotAt: "2026-05-02T10:00:00.000Z",
      createdAt: "2026-05-02T10:00:00.000Z",
      updatedAt: "2026-05-02T10:00:00.000Z",
    },
  ],
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
    unrealizedPnl: 5,
    totalPnl: 5,
    grossProfit: 0,
    grossLoss: 0,
    feesPaid: 0,
  },
};

describe("buildRuntimeOpenPositionRows", () => {
  it("uses one stream-first price and PnL contract for Bot Runtime and Dashboard rows", () => {
    const rows = buildRuntimeOpenPositionRows({
      positions: basePositions(),
      symbolStats,
      streamPrices: { DOGEUSDT: 0.991 },
      initBalance: 1000,
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]?.markPrice).toBeCloseTo(0.991, 8);
    expect(rows[0]?.liveMarkPrice).toBeCloseTo(0.991, 8);
    expect(rows[0]?.liveMarkPriceSource).toBe("runtime_stream");
    expect(rows[0]?.openPnl).toBeCloseTo(9, 8);
    expect(rows[0]?.liveUnrealizedPnl).toBeCloseTo(9, 8);
    expect(rows[0]?.pnlMarginPct).toBeCloseTo(9, 8);
    expect(rows[0]?.livePnlPct).toBeCloseTo(9, 8);
    expect(rows[0]?.marginUsed).toBeCloseTo(100, 8);
    expect(rows[0]?.marginNotional).toBeCloseTo(100, 8);
    expect(rows[0]?.marginInitPct).toBeCloseTo(10, 8);
    expect(rows[0]?.dcaCount).toBe(1);
    expect(rows[0]?.ttpProtectedPercent).toBeCloseTo(8, 8);
    expect(rows[0]?.ttpProtectedSource).toBe("backend");
    expect(rows[0]?.tslProtectedPercent).toBeNull();
  });

  it("falls back to API position PnL before symbol-stat price when no stream exists", () => {
    const rows = buildRuntimeOpenPositionRows({
      positions: basePositions(),
      symbolStats,
      streamPrices: new Map(),
    });

    expect(rows[0]?.markPrice).toBeCloseTo(0.99332, 8);
    expect(rows[0]?.liveMarkPriceSource).toBe("exchange_unrealized_pnl");
    expect(rows[0]?.openPnl).toBeCloseTo(6.68, 8);
    expect(rows[0]?.pnlMarginPct).toBeCloseTo(6.68, 8);
  });

  it("keeps symbol-stat and unavailable source labels explicit", () => {
    const symbolStatRows = buildRuntimeOpenPositionRows({
      positions: basePositions({ markPrice: null, markPriceSource: "unavailable" }),
      symbolStats,
      streamPrices: new Map(),
    });

    expect(symbolStatRows[0]?.markPrice).toBeCloseTo(0.995, 8);
    expect(symbolStatRows[0]?.liveMarkPriceSource).toBe("runtime_symbol_stat");

    const unavailableRows = buildRuntimeOpenPositionRows({
      positions: basePositions({ markPrice: null, markPriceSource: "unavailable" }),
      symbolStats: { ...symbolStats, items: [] },
      streamPrices: new Map(),
    });

    expect(unavailableRows[0]?.markPrice).toBeNull();
    expect(unavailableRows[0]?.liveMarkPriceSource).toBe("unavailable");
  });

  it("marks strategy-fallback dynamic TTP protection as prospective", () => {
    const rows = buildRuntimeOpenPositionRows({
      positions: basePositions({
        dynamicTtpStopLoss: 0.993,
        dynamicTtpStopLossSource: "strategy_fallback",
      }),
      symbolStats,
      streamPrices: new Map(),
    });

    expect(rows[0]?.ttpProtectedPercent).toBeCloseTo(7, 8);
    expect(rows[0]?.ttpProtectedSource).toBe("prospective");
  });

  it("hides strategy-fallback dynamic TTP protection while live PnL is negative", () => {
    const rows = buildRuntimeOpenPositionRows({
      positions: basePositions({
        dynamicTtpStopLoss: 0.993,
        dynamicTtpStopLossSource: "strategy_fallback",
        markPrice: 1.01,
        unrealizedPnl: -10,
        unrealizedPnlPercent: -10,
      }),
      symbolStats,
      streamPrices: new Map(),
    });

    expect(rows[0]?.livePnlPct).toBeLessThan(0);
    expect(rows[0]?.ttpProtectedPercent).toBeNull();
    expect(rows[0]?.ttpProtectedSource).toBeNull();
  });
});
