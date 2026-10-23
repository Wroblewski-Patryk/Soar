import api from "@/lib/api";
import type { Exchange, TradeMarket } from "@/features/bots/types/bot.type";

export type ExternalClientGrant = {
  id: string;
  botId: string;
  clientLabel: string;
  exchange: Exchange;
  marketType: TradeMarket;
  symbol: string;
  action: "PLACE_LIVE_ORDER";
  maxActionQuoteAmount: string;
  maxTotalQuoteAmount: string;
  usedQuoteAmount: string;
  maxActions: number;
  usedActions: number;
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
};

export type CreateGrantInput = Pick<ExternalClientGrant,
  "botId" | "clientLabel" | "exchange" | "marketType" | "symbol" | "action" |
  "maxActionQuoteAmount" | "maxTotalQuoteAmount" | "maxActions"> & {
    ttlSeconds: number;
    password: string;
  };

const path = "/dashboard/external-client-grants";

export const listExternalClientGrants = async (): Promise<ExternalClientGrant[]> => {
  const { data } = await api.get<{ grants: ExternalClientGrant[] }>(path);
  return data.grants;
};

export const createExternalClientGrant = async (input: CreateGrantInput) => {
  const { data } = await api.post<{ grant: ExternalClientGrant; secret: string }>(path, input);
  return data;
};

export const revokeExternalClientGrant = async (id: string): Promise<ExternalClientGrant> => {
  const { data } = await api.post<{ grant: ExternalClientGrant }>(`${path}/${encodeURIComponent(id)}/revoke`);
  return data.grant;
};
