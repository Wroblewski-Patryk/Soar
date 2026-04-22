import { describe, expect, it } from "vitest";

import {
  formatAgeCompact,
  toRuntimeDirectionBadgeClass,
  toRuntimeDirectionPillClass,
  toRuntimeSessionStatusBadgeClass,
  toRuntimeTradeLifecycleBadgeClass,
  toRuntimeTradeLifecyclePillClass,
} from "./runtimeMonitoringFormatters";

describe("runtimeMonitoringFormatters", () => {
  it("formats compact runtime age consistently", () => {
    expect(formatAgeCompact(0)).toBe("0s");
    expect(formatAgeCompact(15_000)).toBe("15s");
    expect(formatAgeCompact(120_000)).toBe("2m");
    expect(formatAgeCompact(3_900_000)).toBe("1h 5m");
  });

  it("maps session status to shared badge classes", () => {
    expect(toRuntimeSessionStatusBadgeClass("RUNNING")).toBe("badge-info");
    expect(toRuntimeSessionStatusBadgeClass("COMPLETED")).toBe("badge-success");
    expect(toRuntimeSessionStatusBadgeClass("FAILED")).toBe("badge-error");
    expect(toRuntimeSessionStatusBadgeClass("CANCELED")).toBe("badge-warning");
    expect(toRuntimeSessionStatusBadgeClass("UNKNOWN")).toBe("badge-ghost");
  });

  it("maps direction variants to aligned badge and pill tones", () => {
    expect(toRuntimeDirectionBadgeClass("BUY")).toBe("badge-success");
    expect(toRuntimeDirectionBadgeClass("SHORT")).toBe("badge-error");
    expect(toRuntimeDirectionBadgeClass("OTHER")).toBe("badge-ghost");
    expect(toRuntimeDirectionPillClass("LONG")).toContain("text-success");
    expect(toRuntimeDirectionPillClass("SELL")).toContain("text-error");
  });

  it("maps trade lifecycle variants to aligned badge and pill tones", () => {
    expect(toRuntimeTradeLifecycleBadgeClass("OPEN")).toBe("badge-success");
    expect(toRuntimeTradeLifecycleBadgeClass("DCA")).toBe("badge-warning");
    expect(toRuntimeTradeLifecycleBadgeClass("CLOSE")).toBe("badge-primary");
    expect(toRuntimeTradeLifecycleBadgeClass("UNKNOWN")).toBe("badge-ghost");
    expect(toRuntimeTradeLifecyclePillClass("OPEN")).toContain("text-success");
    expect(toRuntimeTradeLifecyclePillClass("DCA")).toContain("text-warning");
    expect(toRuntimeTradeLifecyclePillClass("CLOSE")).toContain("text-primary");
    expect(toRuntimeTradeLifecyclePillClass("UNKNOWN")).toContain("text-base-content/70");
  });
});
