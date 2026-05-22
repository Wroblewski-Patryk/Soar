import { describe, expect, it, vi } from "vitest";

import { addApiKey, editApiKey, fetchApiKeys } from "./apiKeys.service";

const apiGetMock = vi.hoisted(() => vi.fn());
const apiPostMock = vi.hoisted(() => vi.fn());
const apiPatchMock = vi.hoisted(() => vi.fn());

vi.mock("../../../lib/api", () => ({
  default: {
    get: apiGetMock,
    post: apiPostMock,
    patch: apiPatchMock,
  },
}));

describe("apiKeys.service", () => {
  it("normalizes list responses without retaining API secrets in web state", async () => {
    apiGetMock.mockResolvedValueOnce({
      data: [
        {
          id: "key-1",
          label: "Binance",
          exchange: "BINANCE",
          apiKey: "ab********yz",
          apiSecret: "raw-secret-that-must-not-enter-state",
          syncExternalPositions: true,
          manageExternalPositions: false,
          createdAt: "2026-05-21T00:00:00.000Z",
          lastUsed: "2026-05-21T01:00:00.000Z",
        },
      ],
    });

    const keys = await fetchApiKeys();

    expect(keys).toEqual([
      {
        id: "key-1",
        label: "Binance",
        exchange: "BINANCE",
        apiKey: "ab********yz",
        syncExternalPositions: true,
        manageExternalPositions: false,
        createdAt: "2026-05-21T00:00:00.000Z",
        lastUsed: "2026-05-21T01:00:00.000Z",
        maskedKey: "ab********yz",
      },
    ]);
    expect(keys[0]).not.toHaveProperty("apiSecret");
  });

  it("drops raw apiKey values returned by a regressed API response", async () => {
    apiGetMock.mockResolvedValueOnce({
      data: [
        {
          id: "key-raw",
          label: "Regressed response",
          exchange: "BINANCE",
          apiKey: "RAW-LIVE-KEY-123456",
          apiSecret: "RAW-LIVE-SECRET-123456",
          syncExternalPositions: true,
          manageExternalPositions: false,
          createdAt: "2026-05-21T00:00:00.000Z",
        },
      ],
    });

    const keys = await fetchApiKeys();

    expect(keys[0]?.apiKey).toBe("");
    expect(keys[0]?.maskedKey).toBeUndefined();
    expect(JSON.stringify(keys)).not.toContain("RAW-LIVE-KEY-123456");
    expect(JSON.stringify(keys)).not.toContain("RAW-LIVE-SECRET-123456");
  });

  it("uses secret-bearing payloads only for mutations and strips returned secrets", async () => {
    apiPostMock.mockResolvedValueOnce({
      data: {
        id: "key-2",
        label: "Binance live",
        exchange: "BINANCE",
        apiKey: "xy********zz",
        apiSecret: "raw-returned-secret",
        syncExternalPositions: true,
        manageExternalPositions: false,
        createdAt: "2026-05-21T00:00:00.000Z",
      },
    });

    const created = await addApiKey({
      label: "Binance live",
      exchange: "BINANCE",
      apiKey: "new-key",
      apiSecret: "new-secret",
    });

    expect(apiPostMock).toHaveBeenCalledWith("/dashboard/profile/apiKeys", {
      label: "Binance live",
      exchange: "BINANCE",
      apiKey: "new-key",
      apiSecret: "new-secret",
    });
    expect(created).not.toHaveProperty("apiSecret");

    apiPatchMock.mockResolvedValueOnce({
      data: {
        id: "key-2",
        label: "Renamed",
        exchange: "BINANCE",
        maskedKey: "xy********zz",
        apiSecret: "raw-returned-secret",
        syncExternalPositions: true,
        manageExternalPositions: false,
        createdAt: "2026-05-21T00:00:00.000Z",
      },
    });

    const edited = await editApiKey("key-2", { label: "Renamed" });

    expect(apiPatchMock).toHaveBeenCalledWith("/dashboard/profile/apiKeys/key-2", { label: "Renamed" });
    expect(edited).toMatchObject({ apiKey: "xy********zz", maskedKey: "xy********zz" });
    expect(edited).not.toHaveProperty("apiSecret");
  });
});
