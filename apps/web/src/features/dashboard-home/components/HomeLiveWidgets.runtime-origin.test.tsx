import { describe, expect, it } from "vitest";

import { resolvePositionOriginLabel } from "./HomeLiveWidgets";

const t = (key: string) =>
  (
    {
      "dashboard.home.runtime.sourceManual": "Manual",
      "dashboard.home.runtime.sourceBot": "Bot",
      "dashboard.home.runtime.sourceImported": "Imported",
      "dashboard.home.runtime.reasonUnknown": "Unknown",
    } as Record<string, string>
  )[key] ?? key;

describe("resolvePositionOriginLabel", () => {
  it("maps backend USER origin to the manual source label", () => {
    expect(resolvePositionOriginLabel("USER", t)).toBe("Manual");
  });

  it("keeps legacy MANUAL origin compatible for older fixture payloads", () => {
    expect(resolvePositionOriginLabel("MANUAL", t)).toBe("Manual");
  });

  it("maps canonical bot and imported origins", () => {
    expect(resolvePositionOriginLabel("BOT", t)).toBe("Bot");
    expect(resolvePositionOriginLabel("EXCHANGE_SYNC", t)).toBe("Imported");
    expect(resolvePositionOriginLabel("BACKTEST", t)).toBe("Imported");
  });
});
