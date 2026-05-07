import { describe, expect, it } from "vitest";

import {
  hasRuntimeDynamicStopRowTruth,
  resolveRuntimeAggregateFreeFunds,
  resolveRuntimeAggregatePortfolio,
  resolveRuntimeDynamicStopColumnVisibility,
  resolveRuntimeFreeFunds,
  resolveRuntimePortfolio,
} from "./runtimeSurfaceTruth";

describe("runtimeSurfaceTruth dynamic-stop visibility", () => {
  it("treats planned trailing levels as row truth before dynamic stops arm", () => {
    const hasRowTruth = hasRuntimeDynamicStopRowTruth({
      dynamicTtpStopLoss: null,
      dynamicTslStopLoss: null,
      trailingTakeProfitLevels: [{ armPercent: 5, trailPercent: 2 }],
      trailingStopLevels: [],
    });

    expect(hasRowTruth).toBe(true);
    expect(resolveRuntimeDynamicStopColumnVisibility(false, hasRowTruth)).toBe(true);
  });

  it("keeps dynamic-stop columns hidden when neither strategy nor row truth exists", () => {
    const hasRowTruth = hasRuntimeDynamicStopRowTruth({
      dynamicTtpStopLoss: null,
      dynamicTslStopLoss: null,
      trailingTakeProfitLevels: [],
      trailingStopLevels: [],
    });

    expect(hasRowTruth).toBe(false);
    expect(resolveRuntimeDynamicStopColumnVisibility(false, hasRowTruth)).toBe(false);
  });
});

describe("runtimeSurfaceTruth aggregate wallet capital", () => {
  it("does not use compatibility capital fields for aggregate-success wallet values", () => {
    const summary = {
      referenceBalance: null,
      freeCash: null,
      accountBalance: 512,
      availableBalance: 502,
    };

    expect(resolveRuntimeAggregatePortfolio({ summary, usedMargin: 10 })).toBeNull();
    expect(resolveRuntimeAggregateFreeFunds({ summary })).toBeNull();
  });

  it("keeps compatibility capital fields available for non-aggregate fallback reads", () => {
    const summary = {
      accountBalance: 512,
      availableBalance: 502,
    };

    const portfolio = resolveRuntimePortfolio({
      bot: null,
      summary,
      net: 0,
      usedMargin: 10,
    });

    expect(portfolio).toBe(512);
    expect(resolveRuntimeFreeFunds({ summary, portfolio, usedMargin: 10 })).toBe(502);
  });
});
