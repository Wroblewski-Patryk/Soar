import { afterEach, describe, expect, it, vi } from "vitest";

const resolvePublicApiBaseUrl = vi.fn(() => "");
const eventSource = vi.fn();

vi.mock("./publicApiBaseUrl", () => ({
  resolvePublicApiBaseUrl,
}));

describe("marketStream", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    resolvePublicApiBaseUrl.mockReturnValue("");
  });

  it("builds normalized relative market-stream event URLs without an API base", async () => {
    const { buildMarketStreamEventsUrl } = await import("./marketStream");

    expect(
      buildMarketStreamEventsUrl({
        symbols: [" btcusdt ", "BTCUSDT", "ethusdt"],
        interval: "1m",
      })
    ).toBe("/dashboard/market-stream/events?symbols=BTCUSDT%2CETHUSDT&interval=1m");
  });

  it("creates credentialed EventSource connections when an API base is configured", async () => {
    resolvePublicApiBaseUrl.mockReturnValue("https://api.soar.luckysparrow.ch");
    vi.stubGlobal("EventSource", eventSource);
    const { createMarketStreamEventSource } = await import("./marketStream");

    createMarketStreamEventSource({
      symbols: ["ethusdt"],
      interval: "5m",
    });

    expect(eventSource).toHaveBeenCalledWith(
      "https://api.soar.luckysparrow.ch/dashboard/market-stream/events?symbols=ETHUSDT&interval=5m",
      { withCredentials: true }
    );
  });
});
