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

  it("keeps signal semantics tied to matched strategy conditions, not runtime market state", () => {
    const configuredSnapshotWithMatch = {
      runtimeMarketState: "CONFIGURED_ONLY",
      lastSignalContextSource: "configured_fallback",
      lastSignalConditionLines: [
        { scope: "LONG", left: "RSI(14)", value: "19.2", operator: "<", right: "20", matched: true },
      ],
    } as unknown as RuntimeSymbolWithLive;

    const acceptedSignalWithoutConditionMatch = {
      runtimeMarketState: "SIGNAL_ACTIVE",
      lastSignalContextSource: "latest_signal",
      lastSignalConditionLines: [
        { scope: "SHORT", left: "RSI(14)", value: "61.0", operator: ">", right: "80", matched: false },
      ],
    } as unknown as RuntimeSymbolWithLive;

    expect(hasMatchedSignalCondition(configuredSnapshotWithMatch)).toBe(true);
    expect(hasMatchedSignalConditionScope(configuredSnapshotWithMatch, "LONG")).toBe(true);
    expect(hasMatchedSignalCondition(acceptedSignalWithoutConditionMatch)).toBe(false);
    expect(hasMatchedSignalConditionScope(acceptedSignalWithoutConditionMatch, "SHORT")).toBe(false);
  });
});
