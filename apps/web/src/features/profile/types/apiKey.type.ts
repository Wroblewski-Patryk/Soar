import type { ExchangeOption } from "@/features/exchanges/exchangeCapabilities";

export type ApiKey = {
  id: string;
  label: string;
  exchange: ExchangeOption;
  apiKey: string;
  syncExternalPositions: boolean;
  manageExternalPositions: boolean;
  createdAt: string;
  lastUsed?: string;
  maskedKey?: string;
};

export type ApiKeyMutationPayload = Partial<
  Pick<
    ApiKey,
    | "label"
    | "exchange"
    | "syncExternalPositions"
    | "manageExternalPositions"
  >
> & {
  apiKey?: string;
  apiSecret?: string;
};
