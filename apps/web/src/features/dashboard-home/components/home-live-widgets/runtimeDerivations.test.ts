import { describe, expect, it } from "vitest";

import type { OpenPositionWithLive } from "./types";
import {
  buildLiveOpenPositions,
  resolveDynamicTslDisplay,
  resolveDynamicTtpDisplay,
  resolveDynamicTtpDisplaySource,
} from "./runtimeDerivations";

const dynamicStopRow = {
  id: "pos-dynamic",
  symbol: "DOGEUSDT",
  side: "LONG",
  status: "OPEN",
  quantity: 1,
  leverage: 10,
  marginUsed: 100,
  entryPrice: 1,
  entryNotional: 100,
  exitPrice: null,
  stopLoss: null,
  takeProfit: null,
  openedAt: "2026-04-30T10:00:00.000Z",
  closedAt: null,
  holdMs: 0,
  dcaCount: 0,
  feesPaid: 0,
  realizedPnl: 0,
  unrealizedPnl: 0,
  markPrice: 1.1,
  firstTradeAt: null,
  lastTradeAt: null,
  tradesCount: 0,
  liveMarkPrice: 1.1,
  liveMarkPriceSource: "exchange_unrealized_pnl",
  liveUnrealizedPnl: 10,
  livePnlPct: 10,
  marginNotional: 100,
  openPnl: 10,
  pnlNotionalPct: 10,
  pnlMarginPct: 10,
  marginInitPct: null,
  ttpProtectedPercent: null,
  ttpProtectedSource: null,
  fallbackTtpProtectedPercent: null,
  tslProtectedPercent: null,
} satisfies OpenPositionWithLive;

describe("runtimeDerivations", () => {
  it("shows TSL display only when no TTP display is active", () => {
    expect(resolveDynamicTslDisplay({ ...dynamicStopRow, tslProtectedPercent: 4 })).toBe(4);
    expect(
      resolveDynamicTslDisplay({
        ...dynamicStopRow,
        ttpProtectedPercent: 5,
        ttpProtectedSource: "backend",
        tslProtectedPercent: 4,
      })
    ).toBeNull();
    expect(
      resolveDynamicTslDisplay({
        ...dynamicStopRow,
        fallbackTtpProtectedPercent: 6,
        tslProtectedPercent: 4,
      })
    ).toBe(4);
  });

  it("prefers backend TTP over fallback TTP in the display resolver", () => {
    const row = {
      ...dynamicStopRow,
      ttpProtectedPercent: 5,
      ttpProtectedSource: "backend",
      fallbackTtpProtectedPercent: 7,
    } satisfies OpenPositionWithLive;

    expect(resolveDynamicTtpDisplay(row)).toBe(5);
    expect(resolveDynamicTtpDisplaySource(row)).toBe("backend");
  });

  it("ignores local fallback TTP display as protection truth", () => {
    const row = {
      ...dynamicStopRow,
      fallbackTtpProtectedPercent: 7,
    };

    expect(resolveDynamicTtpDisplay(row)).toBeNull();
    expect(resolveDynamicTtpDisplaySource(row)).toBeNull();
    expect(resolveDynamicTtpDisplaySource(dynamicStopRow)).toBeNull();
  });

  it("marks API strategy-fallback TTP display as prospective protection truth", () => {
    const row = {
      ...dynamicStopRow,
      ttpProtectedPercent: 7,
      ttpProtectedSource: "prospective",
    } satisfies OpenPositionWithLive;

    expect(resolveDynamicTtpDisplay(row)).toBe(7);
    expect(resolveDynamicTtpDisplaySource(row)).toBe("prospective");
  });

  it("hides prospective TTP display while live PnL is not positive", () => {
    const fallbackRow = {
      ...dynamicStopRow,
      livePnlPct: -2,
      fallbackTtpProtectedPercent: 7,
    } satisfies OpenPositionWithLive;
    const apiFallbackRow = {
      ...dynamicStopRow,
      livePnlPct: -2,
      ttpProtectedPercent: 7,
      ttpProtectedSource: "prospective",
    } satisfies OpenPositionWithLive;

    expect(resolveDynamicTtpDisplay(fallbackRow)).toBeNull();
    expect(resolveDynamicTtpDisplaySource(fallbackRow)).toBeNull();
    expect(resolveDynamicTtpDisplay(apiFallbackRow)).toBeNull();
    expect(resolveDynamicTtpDisplaySource(apiFallbackRow)).toBeNull();
  });

  it("uses persisted marginUsed when deriving live pnl percent", () => {
    const result = buildLiveOpenPositions(
      {
        sessionId: "session-1",
        total: 1,
        openCount: 1,
        closedCount: 0,
        openOrdersCount: 0,
        window: {
          startedAt: "2026-04-30T10:00:00.000Z",
          finishedAt: "2026-04-30T10:05:00.000Z",
        },
        summary: {
          realizedPnl: 0,
          unrealizedPnl: -10,
          feesPaid: 0,
        },
        openOrders: [],
        openItems: [
          {
            id: "pos-1",
            symbol: "DOGEUSDT",
            side: "LONG",
            status: "OPEN",
            quantity: 1,
            leverage: 10,
            marginUsed: 52.6315789474,
            entryPrice: 100,
            entryNotional: 100,
            exitPrice: null,
            stopLoss: null,
            takeProfit: null,
            openedAt: "2026-04-30T10:00:00.000Z",
            closedAt: null,
            holdMs: 0,
            dcaCount: 0,
            feesPaid: 0,
            realizedPnl: 0,
            unrealizedPnl: -10,
            unrealizedPnlPercent: -19,
            markPrice: 90,
            firstTradeAt: null,
            lastTradeAt: null,
            tradesCount: 0,
          },
        ],
        historyItems: [],
      },
      null,
      new Map()
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.livePnlPct).toBeCloseTo(-19, 8);
    expect(result[0]?.marginNotional).toBeCloseTo(52.6315789474, 8);
  });

  it("falls back to backend unrealized pnl truth when no stream price is available", () => {
    const result = buildLiveOpenPositions(
      {
        sessionId: "session-1",
        total: 1,
        openCount: 1,
        closedCount: 0,
        openOrdersCount: 0,
        window: {
          startedAt: "2026-04-30T10:00:00.000Z",
          finishedAt: "2026-04-30T10:05:00.000Z",
        },
        summary: {
          realizedPnl: 0,
          unrealizedPnl: 0.54,
          feesPaid: 0,
        },
        openOrders: [],
        openItems: [
          {
            id: "pos-2",
            symbol: "XRPUSDT",
            side: "LONG",
            status: "OPEN",
            quantity: 1000,
            leverage: 15,
            marginUsed: 100,
            entryPrice: 2,
            entryNotional: 2000,
            exitPrice: null,
            stopLoss: null,
            takeProfit: null,
            openedAt: "2026-04-30T10:00:00.000Z",
            closedAt: null,
            holdMs: 0,
            dcaCount: 0,
            feesPaid: 0,
            realizedPnl: 0,
            unrealizedPnl: 0.54,
            unrealizedPnlPercent: 0.54,
            markPrice: 2.00054,
            firstTradeAt: null,
            lastTradeAt: null,
            tradesCount: 0,
          },
        ],
        historyItems: [],
      },
      {
        sessionId: "session-1",
        items: [
          {
            id: "stat-1",
            userId: "user-1",
            botId: "bot-1",
            sessionId: "session-1",
            symbol: "XRPUSDT",
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
            unrealizedPnl: -47.77,
            lastPrice: 1.95223,
            lastSignalAt: null,
            lastTradeAt: null,
            snapshotAt: "2026-04-30T10:00:00.000Z",
            createdAt: "2026-04-30T10:00:00.000Z",
            updatedAt: "2026-04-30T10:00:00.000Z",
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
          unrealizedPnl: -47.77,
          totalPnl: -47.77,
          grossProfit: 0,
          grossLoss: 0,
          feesPaid: 0,
        },
      },
      new Map()
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.liveMarkPrice).toBeCloseTo(2.00054, 8);
    expect(result[0]?.liveUnrealizedPnl).toBeCloseTo(0.54, 8);
    expect(result[0]?.livePnlPct).toBeCloseTo(0.54, 8);
  });

  it("prefers stream market data over API position snapshots for live dashboard refresh", () => {
    const result = buildLiveOpenPositions(
      {
        sessionId: "session-1",
        total: 1,
        openCount: 1,
        closedCount: 0,
        openOrdersCount: 0,
        window: {
          startedAt: "2026-04-30T10:00:00.000Z",
          finishedAt: "2026-04-30T10:05:00.000Z",
        },
        summary: {
          realizedPnl: 0,
          unrealizedPnl: 0.54,
          feesPaid: 0,
        },
        openOrders: [],
        openItems: [
          {
            id: "pos-3",
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
            openedAt: "2026-04-30T10:00:00.000Z",
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
            tradesCount: 0,
          },
        ],
        historyItems: [],
      },
      null,
      new Map([["DOGEUSDT", 0.992]])
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.liveMarkPrice).toBeCloseTo(0.992, 8);
    expect(result[0]?.liveUnrealizedPnl).toBeCloseTo(8, 8);
    expect(result[0]?.livePnlPct).toBeCloseTo(8, 8);
  });
});
