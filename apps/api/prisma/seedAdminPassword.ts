export const resolveBootstrapAdminPassword = (
  variableName: 'SEED_ADMIN_PASSWORD' | 'SNAPSHOT_USER_PASSWORD',
  env: NodeJS.ProcessEnv = process.env
) => {
  const configured = env[variableName]?.trim();
  if (env.NODE_ENV === 'production') {
    if (!configured || configured.length < 12) {
      throw new Error(`${variableName} of at least 12 characters is required in production`);
    }
    return configured;
  }
  return configured || 'Admin12#$';
};

export const resolveSeedAdminPassword = (env: NodeJS.ProcessEnv = process.env) =>
  resolveBootstrapAdminPassword('SEED_ADMIN_PASSWORD', env);
