import type { Exchange } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

import {
  probeExchangeApiKeyPermissions,
  resolveApiKeyProbeCcxtDefaultType,
  resolveApiKeyProbeFetchBalanceParams,
  type ApiKeyProbeClientFactory,
} from "./exchangeApiKeyProbe.service";

const withFactory = (
  exchange: Exchange,
  factory: ApiKeyProbeClientFactory
) => {
  return probeExchangeApiKeyPermissions(
    {
      exchange,
      apiKey: "test-key",
      apiSecret: "test-secret",
    },
    factory
  );
};

describe("probeExchangeApiKeyPermissions", () => {
  it("returns exchange-specific OK when spot and futures probes pass", async () => {
    const close = vi.fn(async () => undefined);
    const calls: string[] = [];

    const result = await withFactory("GATEIO", async (exchange, marketType) => {
      calls.push(`${exchange}:${marketType}`);
      return {
        fetchBalance: async () => undefined,
        close,
      };
    });

    expect(calls).toEqual(["GATEIO:spot", "GATEIO:future"]);
    expect(close).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      ok: true,
      code: "OK",
      message: "Gate.io API key permissions validated.",
      permissions: {
        spot: true,
        futures: true,
      },
    });
  });

  it("keeps Binance probe message stable through the generic service", async () => {
    const result = await withFactory("BINANCE", async () => ({
      fetchBalance: async () => undefined,
    }));

    expect(result).toEqual({
      ok: true,
      code: "OK",
      message: "Binance API key permissions validated.",
      permissions: {
        spot: true,
        futures: true,
      },
    });
  });

  it("returns success for futures-only keys", async () => {
    const calls: string[] = [];
    const result = await withFactory("GATEIO", async (exchange, marketType) => {
      calls.push(`${exchange}:${marketType}`);
      return {
        fetchBalance: async () => {
          if (marketType === "spot") {
            throw new Error("Permission denied");
          }
        },
      };
    });

    expect(calls).toEqual(["GATEIO:spot", "GATEIO:future"]);
    expect(result.ok).toBe(true);
    expect(result.code).toBe("OK");
    expect(result.message).toBe("Gate.io API key permissions validated for Futures.");
    expect(result.permissions).toEqual({ spot: false, futures: true });
  });

  it("maps invalid key error after checking both scopes", async () => {
    const calls: string[] = [];
    const result = await withFactory("GATEIO", async (exchange, marketType) => {
      calls.push(`${exchange}:${marketType}`);
      return {
        fetchBalance: async () => {
          throw new Error("Invalid API-key, IP, or permissions for action.");
        },
      };
    });

    expect(calls).toEqual(["GATEIO:spot", "GATEIO:future"]);
    expect(result.ok).toBe(false);
    expect(result.code).toBe("INVALID_KEY");
    expect(result.message).toBe("Gate.io rejected API key format or value.");
    expect(result.permissions).toEqual({ spot: false, futures: false });
  });

  it("returns success for spot-only keys", async () => {
    const result = await withFactory("GATEIO", async (_exchange, marketType) => ({
      fetchBalance: async () => {
        if (marketType === "future") {
          throw new Error("Permission denied");
        }
      },
    }));

    expect(result.ok).toBe(true);
    expect(result.code).toBe("OK");
    expect(result.message).toBe("Gate.io API key permissions validated for Spot.");
    expect(result.permissions).toEqual({ spot: true, futures: false });
  });

  it("maps network timeout error", async () => {
    const result = await withFactory("GATEIO", async () => ({
      fetchBalance: async () => {
        throw new Error("Network timeout on request");
      },
    }));

    expect(result.ok).toBe(false);
    expect(result.code).toBe("NETWORK_TIMEOUT");
    expect(result.permissions).toEqual({ spot: false, futures: false });
  });

  it("uses Gate.io swap defaultType for futures CCXT probes", () => {
    expect(resolveApiKeyProbeCcxtDefaultType("GATEIO", "spot")).toBe("spot");
    expect(resolveApiKeyProbeCcxtDefaultType("GATEIO", "future")).toBe("swap");
    expect(resolveApiKeyProbeCcxtDefaultType("BINANCE", "future")).toBe("future");
  });

  it("passes explicit CCXT balance params for Binance Futures probes", async () => {
    const calls: Array<Record<string, unknown> | undefined> = [];

    await withFactory("BINANCE", async () => ({
      fetchBalance: async (params) => {
        calls.push(params);
      },
    }));

    expect(calls).toEqual([{ type: "spot" }, { type: "future", useV2: true }]);
    expect(resolveApiKeyProbeFetchBalanceParams("GATEIO", "future")).toEqual({ type: "swap" });
  });
});
