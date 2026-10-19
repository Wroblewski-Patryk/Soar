import api from "@/lib/api";

export type ExternalClientReadGrant = {
  id: string;
  botId: string;
  clientLabel: string;
  action: "READ_BOT_STATUS";
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
};

export type CreateReadGrantInput = {
  botId: string;
  clientLabel: string;
  action: "READ_BOT_STATUS";
  ttlSeconds: number;
  password: string;
};

const path = "/dashboard/external-client-read-grants";

export const listExternalClientReadGrants = async (): Promise<ExternalClientReadGrant[]> => {
  const { data } = await api.get<{ grants: ExternalClientReadGrant[] }>(path);
  return data.grants;
};

export const getExternalClientReadGrant = async (id: string): Promise<ExternalClientReadGrant> => {
  const { data } = await api.get<{ grant: ExternalClientReadGrant }>(`${path}/${encodeURIComponent(id)}`);
  return data.grant;
};

export const createExternalClientReadGrant = async (input: CreateReadGrantInput) => {
  const { data } = await api.post<{ grant: ExternalClientReadGrant; secret: string }>(path, input);
  return data;
};

export const revokeExternalClientReadGrant = async (id: string): Promise<ExternalClientReadGrant> => {
  const { data } = await api.post<{ grant: ExternalClientReadGrant }>(`${path}/${encodeURIComponent(id)}/revoke`);
  return data.grant;
};
