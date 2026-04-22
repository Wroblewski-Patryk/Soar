import { describe, expect, it } from "vitest";
import type { StrategyDto } from "../../strategies/types/StrategyForm.type";
import type { BacktestTimeline, BacktestTimelineEvent, BacktestTrade } from "../types/backtest.type";
import {
  buildDailyPerformance,
  buildSyntheticTradesFromTimelineEvents,
  extractStrategyIndicatorMeta,
  filterTradesByTimelineWindow,
} from "./backtestRunDetailsViewModel";

describe("backtestRunDetailsViewModel", () => {
  it("filters trades to the visible timeline window", () => {
    const timeline = {
      candles: [
        { openTime: "2026-04-10T10:00:00.000Z", closeTime: "2026-04-10T10:05:00.000Z" },
        { openTime: "2026-04-10T10:05:00.000Z", closeTime: "2026-04-10T10:10:00.000Z" },
      ],
    } as BacktestTimeline;

    const trades = [
      {
        id: "inside",
        symbol: "BTCUSDT",
        side: "LONG",
        entryPrice: 1,
        exitPrice: 2,
        quantity: 1,
        openedAt: "2026-04-10T09:59:00.000Z",
        closedAt: "2026-04-10T10:06:00.000Z",
        pnl: 1,
        fee: null,
      },
      {
        id: "outside",
        symbol: "BTCUSDT",
        side: "LONG",
        entryPrice: 1,
        exitPrice: 2,
        quantity: 1,
        openedAt: "2026-04-10T08:00:00.000Z",
        closedAt: "2026-04-10T09:00:00.000Z",
        pnl: 1,
        fee: null,
      },
    ] satisfies BacktestTrade[];

    expect(filterTradesByTimelineWindow(trades, timeline).map((trade) => trade.id)).toEqual(["inside"]);
  });

  it("builds synthetic trades from ordered timeline entry and close events", () => {
    const events = [
      {
        id: "close",
        tradeId: "trade_1",
        type: "LIQUIDATION",
        side: "LONG",
        timestamp: "2026-04-10T10:10:00.000Z",
        price: 90,
        pnl: -15,
        candleIndex: 2,
      },
      {
        id: "entry",
        tradeId: "trade_1",
        type: "ENTRY",
        side: "LONG",
        timestamp: "2026-04-10T10:00:00.000Z",
        price: 100,
        pnl: null,
        candleIndex: 0,
      },
    ] satisfies BacktestTimelineEvent[];

    expect(buildSyntheticTradesFromTimelineEvents(events, "BTCUSDT")).toEqual([
      expect.objectContaining({
        id: "trade_1",
        symbol: "BTCUSDT",
        entryPrice: 100,
        exitPrice: 90,
        pnl: -15,
        exitReason: "LIQUIDATION",
        liquidated: true,
      }),
    ]);
  });

  it("aggregates daily pnl into cumulative balance points", () => {
    const trades = [
      {
        id: "one",
        symbol: "BTCUSDT",
        side: "LONG",
        entryPrice: 1,
        exitPrice: 2,
        quantity: 1,
        openedAt: "2026-04-10T10:00:00.000Z",
        closedAt: "2026-04-10T10:10:00.000Z",
        pnl: 10,
        fee: null,
      },
      {
        id: "two",
        symbol: "BTCUSDT",
        side: "SHORT",
        entryPrice: 2,
        exitPrice: 1,
        quantity: 1,
        openedAt: "2026-04-11T10:00:00.000Z",
        closedAt: "2026-04-11T10:10:00.000Z",
        pnl: -5,
        fee: null,
      },
    ] satisfies BacktestTrade[];

    expect(buildDailyPerformance(trades, 100)).toEqual([
      expect.objectContaining({ dayKey: "2026-04-10", pnl: 10, balance: 110 }),
      expect.objectContaining({ dayKey: "2026-04-11", pnl: -5, balance: 105 }),
    ]);
  });

  it("extracts indicator names and RSI thresholds from strategy config", () => {
    const strategy = {
      id: "strategy_1",
      name: "RSI EMA",
      description: "",
      leverage: 3,
      interval: "1h",
      createdAt: "2026-04-10T00:00:00.000Z",
      config: {
        open: {
          long: [
            { name: "ema", params: { fast: 9, slow: 21 } },
            { name: "rsi", params: { period: 14 }, value: 30 },
          ],
          short: [
            { name: "rsi", params: { period: 14 }, value: 70 },
          ],
        },
      },
    } satisfies StrategyDto;

    expect(extractStrategyIndicatorMeta(strategy)).toEqual({
      names: ["EMA FAST (9)", "EMA SLOW (21)", "RSI (14)"],
      rsiLongLevel: 30,
      rsiShortLevel: 70,
    });
  });
});
