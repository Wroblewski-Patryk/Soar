export type BinanceApiKeyProbeMarketType = "spot" | "future";

export type BinanceApiKeyProbeInput = {
  apiKey: string;
  apiSecret: string;
};

export interface BinanceApiKeyProbeClientLike {
  fetchBalance: (params?: Record<string, unknown>) => Promise<unknown>;
  close?: () => Promise<void>;
}

export type BinanceApiKeyProbeClientFactory = (
  marketType: BinanceApiKeyProbeMarketType,
  input: BinanceApiKeyProbeInput
) => Promise<BinanceApiKeyProbeClientLike>;

export const createBinanceApiKeyProbeClient: BinanceApiKeyProbeClientFactory = async (
  marketType,
  input
) => {
  const ccxtModule = (await import("ccxt")) as unknown as {
    binance: new (config: Record<string, unknown>) => BinanceApiKeyProbeClientLike;
  };
  const client = new ccxtModule.binance({
    apiKey: input.apiKey,
    secret: input.apiSecret,
    enableRateLimit: true,
    options: {
      defaultType: marketType,
    },
  });
  return client;
};
