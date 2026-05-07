import { describe, expect, it } from "vitest";

import {
  resolveRuntimePositionProvenanceKind,
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
});
