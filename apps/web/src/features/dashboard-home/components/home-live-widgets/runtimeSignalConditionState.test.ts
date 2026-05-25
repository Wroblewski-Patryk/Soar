import { describe, expect, it } from "vitest";

import {
  hasMatchedSignalCondition,
  hasMatchedSignalConditionScope,
} from "./runtimeSignalConditionState";
import type { RuntimeSymbolWithLive } from "./types";

describe("runtimeSignalConditionState", () => {
  it("counts only explicit matched LONG or SHORT strategy conditions as active", () => {
    const symbols = [
      {
        lastSignalDirection: null,
        runtimeMarketState: "POSITION_OPEN",
        lastSignalConditionLines: [
          { scope: "SHORT", left: "RSI(14)", value: "78.44", operator: ">", right: "75", matched: true },
        ],
      },
      {
        lastSignalDirection: "LONG",
        runtimeMarketState: "SIGNAL_ACTIVE",
        lastSignalConditionLines: [
          { scope: "LONG", left: "RSI(14)", value: "n/a", operator: "<", right: "20", matched: null },
        ],
      },
      {
        lastSignalDirection: null,
        runtimeMarketState: "EVALUATED_NO_TRADE",
        lastSignalConditionLines: [
          { scope: "LONG", left: "RSI(14)", value: "44.12", operator: "<", right: "20", matched: false },
        ],
      },
    ] as unknown as RuntimeSymbolWithLive[];

    expect(symbols.filter(hasMatchedSignalCondition)).toHaveLength(1);
    expect(hasMatchedSignalConditionScope(symbols[0], "SHORT")).toBe(true);
    expect(hasMatchedSignalConditionScope(symbols[0], "LONG")).toBe(false);
  });

  it("uses explicit condition-active truth when backend provides it", () => {
    const symbol = {
      lastSignalDirection: null,
      runtimeMarketState: "EVALUATED_NO_TRADE",
      lastSignalConditionActive: {
        long: false,
        short: true,
      },
      lastSignalConditionLines: [
        { scope: "LONG", left: "RSI(14)", value: "44.12", operator: "<", right: "20", matched: false },
      ],
    } as unknown as RuntimeSymbolWithLive;

    expect(hasMatchedSignalCondition(symbol)).toBe(true);
    expect(hasMatchedSignalConditionScope(symbol, "LONG")).toBe(false);
    expect(hasMatchedSignalConditionScope(symbol, "SHORT")).toBe(true);
  });
});
