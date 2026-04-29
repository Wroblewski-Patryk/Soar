import { describe, expect, it } from "vitest";

import { buildLiveOpenPositions } from "./runtimeDerivations";

describe("runtimeDerivations", () => {
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
});
