import { createHash } from 'node:crypto';

export const buildRuntimeClientOrderId = (dedupeKey: string) => {
  const digest = createHash('sha256').update(dedupeKey).digest('base64url').slice(0, 24);
  return `soar_${digest}`;
};
