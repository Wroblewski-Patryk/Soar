import { describe, expect, it } from "vitest";

import {
  formatRuntimeTradeFeeMeta,
  resolveRuntimePositionProvenanceKind,
  runtimeContinuityLabelSuffix,
  runtimeOpenOrderStatusLabelSuffix,
  runtimeOrderSourceLabelSuffix,
  runtimePositionProvenanceLabelSuffix,
} from "./runtimeMonitoringFormatters";

describe("resolveRuntimePositionProvenanceKind", () => {
  it("keeps ordinary bot-origin positions unlabeled", () => {
    expect(
      resolveRuntimePositionProvenanceKind({
        origin: "BOT",
        syncState: "IN_SYNC",
        takeoverStatus: null,
      })
    ).toBeNull();
  });

  it("prefers exchange takeover status for imported positions", () => {
    expect(
      resolveRuntimePositionProvenanceKind({
        origin: "EXCHANGE_SYNC",
        syncState: "IN_SYNC",
        takeoverStatus: "OWNED_AND_MANAGED",
      })
    ).toBe("exchange_adopted");
    expect(
      resolveRuntimePositionProvenanceKind({
        origin: "EXCHANGE_SYNC",
        syncState: "IN_SYNC",
        takeoverStatus: "AMBIGUOUS",
      })
    ).toBe("exchange_ambiguous");
  });

  it("surfaces degraded sync states before generic exchange origin", () => {
    expect(
      resolveRuntimePositionProvenanceKind({
        origin: "EXCHANGE_SYNC",
        syncState: "ORPHAN_LOCAL",
        takeoverStatus: "OWNED_AND_MANAGED",
      })
    ).toBe("sync_orphan_local");
  });

  it("maps provenance kinds to shared i18n suffixes", () => {
    expect(runtimePositionProvenanceLabelSuffix("exchange_adopted")).toBe(
      "provenanceExchangeAdopted"
    );
    expect(runtimePositionProvenanceLabelSuffix("sync_drift")).toBe("provenanceSyncDrift");
  });

  it("maps runtime continuity states to shared i18n suffixes", () => {
    expect(runtimeContinuityLabelSuffix("RECOVERING")).toBe("continuityRecovering");
    expect(runtimeContinuityLabelSuffix("RECOVERED_UNACTIONABLE")).toBe(
      "continuityRecoveredUnactionable"
    );
    expect(runtimeContinuityLabelSuffix("EXTERNAL_CLOSE_CONFIRMED")).toBe(
      "continuityExternalCloseConfirmed"
    );
    expect(runtimeContinuityLabelSuffix("REPAIR_ONLY_CLEANUP")).toBe(
      "continuityRepairOnlyCleanup"
    );
    expect(runtimeContinuityLabelSuffix(null)).toBe("continuityConfirmed");
    expect(runtimeContinuityLabelSuffix("unexpected")).toBe("continuityConfirmed");
  });

  it("maps runtime open order origins to shared source label suffixes", () => {
    expect(runtimeOrderSourceLabelSuffix("USER")).toBe("sourceManual");
    expect(runtimeOrderSourceLabelSuffix("MANUAL")).toBe("sourceManual");
    expect(runtimeOrderSourceLabelSuffix("BOT")).toBe("sourceBot");
    expect(runtimeOrderSourceLabelSuffix("EXCHANGE_SYNC")).toBe("sourceImported");
    expect(runtimeOrderSourceLabelSuffix(null)).toBe("sourceImported");
  });

  it("maps runtime open order statuses to lifecycle label suffixes", () => {
    expect(runtimeOpenOrderStatusLabelSuffix("PENDING")).toBe("openOrderStatusWaitingFill");
    expect(runtimeOpenOrderStatusLabelSuffix("OPEN")).toBe("openOrderStatusWaitingFill");
    expect(runtimeOpenOrderStatusLabelSuffix("partially_filled")).toBe(
      "openOrderStatusPartiallyFilled"
    );
    expect(runtimeOpenOrderStatusLabelSuffix("FILLED")).toBe("openOrderStatusFilled");
    expect(runtimeOpenOrderStatusLabelSuffix("CANCELED")).toBeNull();
    expect(runtimeOpenOrderStatusLabelSuffix(null)).toBeNull();
  });

  it("formats runtime trade fee reconciliation metadata", () => {
    expect(
      formatRuntimeTradeFeeMeta({
        feeSource: "EXCHANGE_FILL",
        feePending: false,
        feeCurrency: "USDT",
      })
    ).toBe("EXCHANGE USDT");
    expect(
      formatRuntimeTradeFeeMeta({
        feeSource: "ESTIMATED",
        feePending: false,
        feeCurrency: null,
      })
    ).toBe("EST.");
    expect(
      formatRuntimeTradeFeeMeta({
        feeSource: "ESTIMATED",
        feePending: true,
        feeCurrency: "USDT",
      })
    ).toBe("PENDING USDT");
  });
});
