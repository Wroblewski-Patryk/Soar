const FULL_GIT_SHA = /^[0-9a-f]{40}$/i;

export type ReleaseIdentity = {
  gitSha: string | null;
  source: 'image-build' | 'unavailable';
};

export const readReleaseIdentity = (
  env: NodeJS.ProcessEnv = process.env
): ReleaseIdentity => {
  const candidate = env.SOURCE_COMMIT?.trim() ?? '';
  if (!FULL_GIT_SHA.test(candidate)) {
    return { gitSha: null, source: 'unavailable' };
  }
  return { gitSha: candidate.toLowerCase(), source: 'image-build' };
};
