import { describe, expect, it } from "vitest";

import {
  hasRuntimeDynamicStopRowTruth,
  resolveRuntimeDynamicStopColumnVisibility,
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
