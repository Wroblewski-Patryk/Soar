import { describe, expect, it } from "vitest";

import { tradeActorPresentation, tradeReasonPresentation } from "./runtimeUiHelpers";

describe("tradeReasonPresentation", () => {
  it("treats position-lifetime OPEN anchors as lifecycle-open context instead of close reason", () => {
    const presentation = tradeReasonPresentation({
      value: "POSITION_LIFETIME",
      lifecycleAction: "OPEN",
    });

    expect(presentation.labelKey).toBe("dashboard.home.runtime.reasonPositionLifecycleOpen");
    expect(presentation.className).toContain("text-info");
  });

  it("keeps real position-lifetime closes on the existing close-reason label", () => {
    const presentation = tradeReasonPresentation({
      value: "POSITION_LIFETIME",
      lifecycleAction: "CLOSE",
    });

    expect(presentation.labelKey).toBe("dashboard.home.runtime.reasonPositionLifetime");
    expect(presentation.className).toContain("text-warning");
  });
});

describe("tradeActorPresentation", () => {
  it("fills imported OPEN lifecycle anchors as opened by user on exchange", () => {
    const presentation = tradeActorPresentation({
      lifecycleAction: "OPEN",
      origin: "EXCHANGE_SYNC",
    });

    expect(presentation?.labelKey).toBe("dashboard.home.runtime.openByUserExchange");
  });

  it("keeps close rows on canonical close initiator truth", () => {
    const presentation = tradeActorPresentation({
      lifecycleAction: "CLOSE",
      closeInitiator: "USER_APP",
      origin: "BOT",
    });

    expect(presentation?.labelKey).toBe("dashboard.home.runtime.closeByUserApp");
  });
});
