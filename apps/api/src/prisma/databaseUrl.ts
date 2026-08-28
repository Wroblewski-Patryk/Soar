const parsePositiveInteger = (value: string | undefined) => {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const resolvePrismaDatabaseUrl = (
  databaseUrl: string | undefined,
  env: NodeJS.ProcessEnv = process.env,
) => {
  if (!databaseUrl) return databaseUrl;
  const connectionLimit = parsePositiveInteger(env.PRISMA_CONNECTION_LIMIT);
  const poolTimeoutSeconds = parsePositiveInteger(env.PRISMA_POOL_TIMEOUT_SECONDS);
  if (!connectionLimit && !poolTimeoutSeconds) return databaseUrl;

  try {
    const url = new URL(databaseUrl);
    if (connectionLimit && !url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', String(connectionLimit));
    }
    if (poolTimeoutSeconds && !url.searchParams.has('pool_timeout')) {
      url.searchParams.set('pool_timeout', String(poolTimeoutSeconds));
    }
    return url.toString();
  } catch {
    return databaseUrl;
  }
};
