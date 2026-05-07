import { describe, expect, it } from "vitest";

import {
  resolveRuntimeContextSourceLabelSuffix,
  resolveRuntimeMarketStateLabelSuffix,
} from "./runtimeSignalLabelKeys";

describe("runtimeSignalLabelKeys", () => {
  it("resolves runtime market states to shared label suffixes", () => {
    expect(resolveRuntimeMarketStateLabelSuffix("POSITION_OPEN")).toBe("PositionOpen");
    expect(resolveRuntimeMarketStateLabelSuffix("SIGNAL_ACTIVE")).toBe("SignalActive");
    expect(resolveRuntimeMarketStateLabelSuffix("EVALUATED_NO_TRADE")).toBe("EvaluatedNoTrade");
    expect(resolveRuntimeMarketStateLabelSuffix("CONFIGURED_ONLY")).toBe("ConfiguredOnly");
    expect(resolveRuntimeMarketStateLabelSuffix("UNRESOLVED")).toBe("Unresolved");
    expect(resolveRuntimeMarketStateLabelSuffix(null)).toBe("Unresolved");
    expect(resolveRuntimeMarketStateLabelSuffix(undefined)).toBe("Unresolved");
  });

  it("resolves runtime context sources to shared label suffixes", () => {
    expect(resolveRuntimeContextSourceLabelSuffix("latest_signal")).toBe("LatestSignal");
    expect(resolveRuntimeContextSourceLabelSuffix("latest_decision")).toBe("LatestDecision");
    expect(resolveRuntimeContextSourceLabelSuffix("configured_fallback")).toBe("ConfiguredFallback");
    expect(resolveRuntimeContextSourceLabelSuffix("unresolved")).toBe("Unresolved");
    expect(resolveRuntimeContextSourceLabelSuffix(null)).toBe("Unresolved");
    expect(resolveRuntimeContextSourceLabelSuffix(undefined)).toBe("Unresolved");
  });
});
