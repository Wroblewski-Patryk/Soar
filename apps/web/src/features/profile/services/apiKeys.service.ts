import api from "../../../lib/api"; 
import type { ApiKey, ApiKeyMutationPayload } from "../types/apiKey.type";
import type { ExchangeOption } from "@/features/exchanges/exchangeCapabilities";

const API = "/dashboard/profile/apiKeys";

export type ApiKeyConnectionTestPayload = {
  exchange: ExchangeOption;
  apiKey: string;
  apiSecret: string;
};

export type ApiKeyConnectionTestResult = {
  ok: boolean;
  message?: string;
};

const isMaskedCredentialDisplay = (value: unknown): value is string =>
  typeof value === "string" && value.includes("*");

const normalizeApiKey = (value: unknown): ApiKey => {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const maskedKey = isMaskedCredentialDisplay(record.maskedKey)
    ? record.maskedKey
    : isMaskedCredentialDisplay(record.apiKey)
      ? record.apiKey
      : "";
  return {
    id: String(record.id ?? ""),
    label: String(record.label ?? ""),
    exchange: record.exchange as ExchangeOption,
    apiKey: maskedKey,
    syncExternalPositions: Boolean(record.syncExternalPositions),
    manageExternalPositions: Boolean(record.manageExternalPositions),
    createdAt: String(record.createdAt ?? ""),
    lastUsed: typeof record.lastUsed === "string" ? record.lastUsed : undefined,
    maskedKey: maskedKey || undefined,
  };
};

const normalizeApiKeys = (value: unknown): ApiKey[] =>
  Array.isArray(value) ? value.map(normalizeApiKey) : [];

export async function fetchApiKeys(): Promise<ApiKey[]> {
  const res = await api.get<unknown>(API);
  return normalizeApiKeys(res.data);
}

export async function addApiKey(payload: ApiKeyMutationPayload): Promise<ApiKey> {
  const res = await api.post<unknown>(API, payload);
  return normalizeApiKey(res.data);
}

export async function editApiKey(id: string, payload: ApiKeyMutationPayload): Promise<ApiKey> {
  const res = await api.patch<unknown>(`${API}/${id}`, payload);
  return normalizeApiKey(res.data);
}

export async function deleteApiKey(id: string): Promise<void> {
  await api.delete(`${API}/${id}`);
}

export async function testApiKeyConnection(
  payload: ApiKeyConnectionTestPayload
): Promise<ApiKeyConnectionTestResult> {
  const res = await api.post(`${API}/test`, payload);
  return res.data;
}

export async function testStoredApiKeyConnection(id: string): Promise<ApiKeyConnectionTestResult> {
  const res = await api.post(`${API}/${id}/test`);
  return res.data;
}
