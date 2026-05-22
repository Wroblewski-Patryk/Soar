import { encrypt, decrypt } from "../../../utils/crypto";
import { prisma } from "../../../prisma/client";
import { ApiKey, Exchange, Prisma } from "@prisma/client";
import { assertExchangeCapability } from "../../exchange/exchangeCapabilities";
import {
  formatProbeMessage,
  probeExchangeApiKeyPermissions,
  type ApiKeyProbeCode,
} from "./exchangeApiKeyProbe.service";

export type ApiKeyPayload = {
  label: string;
  exchange: Exchange;
  apiKey: string;
  apiSecret: string;
  syncExternalPositions?: boolean;
  manageExternalPositions?: boolean;
};

export type ApiKeyTestPayload = Pick<ApiKeyPayload, "exchange" | "apiKey" | "apiSecret">;

export type ApiKeyTestResult = {
  ok: boolean;
  code: ApiKeyProbeCode;
  message: string;
  permissions: {
    spot: boolean;
    futures: boolean;
  };
};

type ApiKeySyncOptions = {
  syncExternalPositions: boolean;
  manageExternalPositions: boolean;
};

type ApiKeyProbeMode = "provided" | "stored";

const API_KEY_TEST_CODES: ApiKeyProbeCode[] = [
  "OK",
  "INVALID_KEY",
  "INVALID_SECRET",
  "IP_RESTRICTED",
  "MISSING_SPOT_SCOPE",
  "MISSING_FUTURES_SCOPE",
  "NETWORK_TIMEOUT",
  "UNKNOWN",
];

const getForcedApiKeyTestCode = (): ApiKeyProbeCode | null => {
  if (process.env.NODE_ENV !== "test") return null;
  const value = process.env.API_KEY_TEST_FORCE_CODE;
  if (!value) return null;
  return API_KEY_TEST_CODES.includes(value as ApiKeyProbeCode)
    ? (value as ApiKeyProbeCode)
    : null;
};

const buildApiKeyTestResultForCode = (exchange: Exchange, code: ApiKeyProbeCode): ApiKeyTestResult => {
  switch (code) {
    case "OK":
      return {
        ok: true,
        code,
        message: formatProbeMessage(exchange, code),
        permissions: { spot: true, futures: true },
      };
    case "MISSING_FUTURES_SCOPE":
      return {
        ok: false,
        code,
        message: formatProbeMessage(exchange, code),
        permissions: { spot: true, futures: false },
      };
    case "MISSING_SPOT_SCOPE":
      return {
        ok: false,
        code,
        message: formatProbeMessage(exchange, code),
        permissions: { spot: false, futures: true },
      };
    case "INVALID_KEY":
      return {
        ok: false,
        code,
        message: formatProbeMessage(exchange, code),
        permissions: { spot: false, futures: false },
      };
    case "INVALID_SECRET":
      return {
        ok: false,
        code,
        message: formatProbeMessage(exchange, code),
        permissions: { spot: false, futures: false },
      };
    case "IP_RESTRICTED":
      return {
        ok: false,
        code,
        message: formatProbeMessage(exchange, code),
        permissions: { spot: false, futures: false },
      };
    case "NETWORK_TIMEOUT":
      return {
        ok: false,
        code,
        message: formatProbeMessage(exchange, code),
        permissions: { spot: false, futures: false },
      };
    default:
      return {
        ok: false,
        code: "UNKNOWN",
        message: formatProbeMessage(exchange, "UNKNOWN"),
        permissions: { spot: false, futures: false },
      };
  }
};

const resolveApiKeySyncOptions = (input: {
  syncExternalPositions?: boolean;
  manageExternalPositions?: boolean;
}): ApiKeySyncOptions => {
  const manageExternalPositions = input.manageExternalPositions ?? false;
  const syncExternalPositions = manageExternalPositions ? true : (input.syncExternalPositions ?? true);
  return {
    syncExternalPositions,
    manageExternalPositions,
  };
};

const mapProbeUnexpectedFailure = (error: unknown): ApiKeyProbeCode => {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  if (
    message.includes("timed out") ||
    message.includes("timeout") ||
    message.includes("econnreset") ||
    message.includes("econnrefused") ||
    message.includes("enotfound") ||
    message.includes("network error")
  ) {
    return "NETWORK_TIMEOUT";
  }
  return "UNKNOWN";
};

const writeApiKeyTestAudit = async (params: {
  userId: string;
  exchange: Exchange;
  ok: boolean;
  code: ApiKeyProbeCode;
  probeMode: ApiKeyProbeMode;
  probeLatencyMs: number;
  apiKeyId?: string | null;
  permissions: {
    spot: boolean;
    futures: boolean;
  };
}) => {
  try {
    await prisma.log.create({
      data: {
        userId: params.userId,
        action: "profile.api_key.test_connection",
        level: params.ok ? "INFO" : "WARN",
        source: "profile.apiKey.service",
        message: params.ok ? "API key connection test accepted." : "API key connection test failed.",
        category: "SECURITY",
        entityType: "API_KEY",
        metadata: {
          exchange: params.exchange,
          ok: params.ok,
          code: params.code,
          probeMode: params.probeMode,
          probeLatencyMs: params.probeLatencyMs,
          apiKeyId: params.apiKeyId ?? null,
          permissions: params.permissions,
        },
      },
    });
  } catch {
    // Audit failures should not block user-triggered test calls.
  }
};

const writeApiKeyLifecycleAudit = async (params: {
  userId: string;
  apiKeyId: string;
  exchange: Exchange;
  action:
    | "profile.api_key.created"
    | "profile.api_key.updated"
    | "profile.api_key.deleted"
    | "profile.api_key.rotated"
    | "profile.api_key.revoked";
  level?: "INFO" | "WARN";
  metadata?: Record<string, unknown>;
}) => {
  try {
    await prisma.log.create({
      data: {
        userId: params.userId,
        action: params.action,
        level: params.level ?? "INFO",
        source: "profile.apiKey.service",
        message: `API key lifecycle event: ${params.action}`,
        category: "SECURITY",
        entityType: "API_KEY",
        entityId: params.apiKeyId,
        metadata: {
          exchange: params.exchange,
          apiKeyId: params.apiKeyId,
          ...(params.metadata ?? {}),
        },
      },
    });
  } catch {
    // Audit failures should not expose or block credential mutation flows.
  }
};

const maskValue = (value: string) => {
  if (!value) return "";
  if (value.length <= 4) return "*".repeat(value.length);
  return `${value.slice(0, 2)}********${value.slice(-2)}`;
};

const safeMaskStoredApiKey = (encryptedApiKey: string) => {
  try {
    return maskValue(decrypt(encryptedApiKey));
  } catch {
    return "********";
  }
};

const toPublicApiKey = (record: ApiKey) => ({
  id: record.id,
  userId: record.userId,
  label: record.label,
  exchange: record.exchange,
  apiKey: safeMaskStoredApiKey(record.apiKey),
  syncExternalPositions: record.syncExternalPositions,
  manageExternalPositions: record.manageExternalPositions,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  lastUsed: record.lastUsed,
});

export const listApiKeys = async (userId: string) => {
  const records = await prisma.apiKey.findMany({
    where: { userId }
  });

  return records.map(toPublicApiKey);
};

export const createApiKey = async (userId: string, data: ApiKeyPayload) => {
  const syncOptions = resolveApiKeySyncOptions({
    syncExternalPositions: data.syncExternalPositions,
    manageExternalPositions: data.manageExternalPositions,
  });

  const created = await prisma.apiKey.create({
    data: {
      label: data.label,
      exchange: data.exchange,
      apiKey: encrypt(data.apiKey),
      apiSecret: encrypt(data.apiSecret),
      syncExternalPositions: syncOptions.syncExternalPositions,
      manageExternalPositions: syncOptions.manageExternalPositions,
      userId,
    }
  });

  await writeApiKeyLifecycleAudit({
    userId,
    apiKeyId: created.id,
    exchange: created.exchange,
    action: "profile.api_key.created",
    metadata: {
      syncExternalPositions: created.syncExternalPositions,
      manageExternalPositions: created.manageExternalPositions,
    },
  });

  return toPublicApiKey(created);
};

export const updateApiKey = async (
  userId: string,
  id: string,
  data: Partial<ApiKeyPayload>
) => {
  const existing = await prisma.apiKey.findFirst({
    where: { id, userId },
  });

  if (!existing) return null;

  const syncOptions = resolveApiKeySyncOptions({
    syncExternalPositions:
      data.syncExternalPositions !== undefined
        ? data.syncExternalPositions
        : existing.syncExternalPositions,
    manageExternalPositions:
      data.manageExternalPositions !== undefined
        ? data.manageExternalPositions
        : existing.manageExternalPositions,
  });

  const updateData: Prisma.ApiKeyUpdateManyMutationInput = {
    ...(data.label !== undefined ? { label: data.label } : {}),
    ...(data.exchange !== undefined ? { exchange: data.exchange } : {}),
    ...(data.apiKey !== undefined ? { apiKey: encrypt(data.apiKey) } : {}),
    ...(data.apiSecret !== undefined ? { apiSecret: encrypt(data.apiSecret) } : {}),
    syncExternalPositions: syncOptions.syncExternalPositions,
    manageExternalPositions: syncOptions.manageExternalPositions,
  };
  const changedFields = Object.keys(updateData).filter(
    (field) => field !== "apiKey" && field !== "apiSecret"
  );
  const credentialsRotated = data.apiKey !== undefined || data.apiSecret !== undefined;

  await prisma.apiKey.update({
    where: { id: existing.id },
    data: updateData,
  });

  const updated = await prisma.apiKey.findFirst({
    where: { id, userId },
  });

  if (!updated) return null;
  await writeApiKeyLifecycleAudit({
    userId,
    apiKeyId: updated.id,
    exchange: updated.exchange,
    action: "profile.api_key.updated",
    metadata: {
      changedFields,
      credentialsRotated,
      syncExternalPositions: updated.syncExternalPositions,
      manageExternalPositions: updated.manageExternalPositions,
    },
  });
  return toPublicApiKey(updated);
};

export const deleteApiKey = async (userId: string, id: string) => {
  const existing = await prisma.apiKey.findFirst({
    where: { id, userId },
    select: { id: true, exchange: true },
  });
  if (!existing) return false;

  const result = await prisma.apiKey.deleteMany({ 
    where: { id, userId } 
  });

  if (result.count > 0) {
    await writeApiKeyLifecycleAudit({
      userId,
      apiKeyId: existing.id,
      exchange: existing.exchange,
      action: "profile.api_key.deleted",
      level: "WARN",
    });
  }

  return result.count > 0;
};

export const rotateApiKeySecretPair = async (
  userId: string,
  id: string,
  data: Pick<ApiKeyPayload, 'apiKey' | 'apiSecret'>
) => {
  const result = await prisma.apiKey.updateMany({
    where: { id, userId },
    data: {
      apiKey: encrypt(data.apiKey),
      apiSecret: encrypt(data.apiSecret),
    },
  });

  if (result.count === 0) return null;

  const updated = await prisma.apiKey.findFirst({
    where: { id, userId },
  });

  if (!updated) return null;
  await writeApiKeyLifecycleAudit({
    userId,
    apiKeyId: updated.id,
    exchange: updated.exchange,
    action: "profile.api_key.rotated",
    level: "WARN",
    metadata: {
      credentialsRotated: true,
    },
  });
  return toPublicApiKey(updated);
};

export const revokeApiKey = async (userId: string, id: string) => {
  const existing = await prisma.apiKey.findFirst({
    where: { id, userId },
    select: { id: true, exchange: true },
  });
  if (!existing) return false;

  const result = await prisma.apiKey.deleteMany({
    where: { id, userId },
  });
  if (result.count > 0) {
    await writeApiKeyLifecycleAudit({
      userId,
      apiKeyId: existing.id,
      exchange: existing.exchange,
      action: "profile.api_key.revoked",
      level: "WARN",
    });
  }
  return result.count > 0;
};

export const testApiKeyConnection = async (
  userId: string,
  data: ApiKeyTestPayload,
  context: {
    probeMode?: ApiKeyProbeMode;
    apiKeyId?: string | null;
  } = {}
): Promise<ApiKeyTestResult> => {
  assertExchangeCapability(data.exchange, "API_KEY_PROBE");

  const probeMode = context.probeMode ?? "provided";
  const startedAt = Date.now();
  const forcedCode = getForcedApiKeyTestCode();
  let result: ApiKeyTestResult;
  try {
    result = forcedCode
      ? buildApiKeyTestResultForCode(data.exchange, forcedCode)
      : process.env.NODE_ENV === "test"
        ? buildApiKeyTestResultForCode(data.exchange, "OK")
        : await probeExchangeApiKeyPermissions({
            exchange: data.exchange,
            apiKey: data.apiKey,
            apiSecret: data.apiSecret,
          });
  } catch (error) {
    const fallbackCode = mapProbeUnexpectedFailure(error);
    result = buildApiKeyTestResultForCode(data.exchange, fallbackCode);
  }

  const probeLatencyMs = Math.max(0, Date.now() - startedAt);

  await writeApiKeyTestAudit({
    userId,
    exchange: data.exchange,
    ok: result.ok,
    code: result.code,
    probeMode,
    probeLatencyMs,
    apiKeyId: context.apiKeyId ?? null,
    permissions: result.permissions,
  });

  return result;
};

export const testStoredApiKeyConnection = async (
  userId: string,
  id: string
): Promise<ApiKeyTestResult | null> => {
  const existing = await prisma.apiKey.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return null;
  }

  const probePayload: ApiKeyTestPayload = {
    exchange: existing.exchange,
    apiKey: decrypt(existing.apiKey),
    apiSecret: decrypt(existing.apiSecret),
  };

  const result = await testApiKeyConnection(userId, probePayload, {
    probeMode: "stored",
    apiKeyId: existing.id,
  });
  return result;
};
