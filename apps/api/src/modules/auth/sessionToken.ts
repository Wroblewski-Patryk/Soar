import { Request } from 'express';
import { isHumanSessionToken, verifyAuthToken, type AuthTokenPayload } from './auth.jwt';

type AuthTokenClaims = AuthTokenPayload;
export type AuthTokenSource = 'cookie' | 'bearer';

export type VerifiedAuthTokenCandidate = {
  token: string;
  claims: AuthTokenClaims;
  source: AuthTokenSource;
  kind: 'human' | 'legacy';
};

const hasRequiredClaims = (payload: unknown): payload is AuthTokenClaims => {
  if (!payload || typeof payload !== 'object') return false;
  const candidate = payload as Partial<AuthTokenClaims>;
  return (
    typeof candidate.userId === 'string' &&
    candidate.userId.length > 0 &&
    typeof candidate.email === 'string' &&
    candidate.email.length > 0 &&
    (candidate.role === 'USER' || candidate.role === 'ADMIN') &&
    (candidate.sessionVersion === undefined ||
      (typeof candidate.sessionVersion === 'number' &&
        Number.isFinite(candidate.sessionVersion) &&
        candidate.sessionVersion >= 1))
  );
};

const tokenIssuedAt = (claims: AuthTokenClaims) =>
  typeof claims.iat === 'number' && Number.isFinite(claims.iat) ? claims.iat : 0;

const getTokenCandidatesFromRequest = (req: Request): Array<{ token: string; source: AuthTokenSource }> => {
  const authorizationHeader = Array.isArray(req.headers.authorization)
    ? req.headers.authorization[0]
    : req.headers.authorization;
  const bearerTokenMatch = /^Bearer\s+(.+)$/i.exec(String(authorizationHeader ?? '').trim());
  const bearerToken = bearerTokenMatch?.[1]?.trim() ?? '';

  const parsedToken = typeof req.cookies?.token === 'string' ? req.cookies.token : null;
  const rawCookieHeader = typeof req.headers.cookie === 'string' ? req.headers.cookie : '';

  const rawTokens = rawCookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.startsWith('token='))
    .map((part) => decodeURIComponent(part.slice('token='.length)))
    .filter((value) => value.length > 0);

  const candidates: Array<{ token: string; source: AuthTokenSource }> = [
    ...(bearerToken ? [{ token: bearerToken, source: 'bearer' as const }] : []),
    ...(parsedToken ? [{ token: parsedToken, source: 'cookie' as const }] : []),
    ...rawTokens.map((token) => ({ token, source: 'cookie' as const })),
  ];
  const seen = new Set<string>();
  return candidates.filter(({ token }) => {
    if (seen.has(token)) return false;
    seen.add(token);
    return true;
  });
};

export const getCandidateTokensFromRequest = (req: Request): string[] =>
  getTokenCandidatesFromRequest(req).map(({ token }) => token);

export const getVerifiedAuthTokenCandidates = (req: Request): VerifiedAuthTokenCandidate[] => {
  const candidates = getTokenCandidatesFromRequest(req)
    .map(({ token, source }, index) => {
      try {
        const claims = verifyAuthToken(token);
        if (!hasRequiredClaims(claims)) {
          return null;
        }
        return {
          token,
          claims,
          source,
          kind: isHumanSessionToken(claims) ? 'human' as const : 'legacy' as const,
          index,
        };
      } catch {
        return null;
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  candidates.sort((a, b) => {
    const iatDelta = tokenIssuedAt(b.claims) - tokenIssuedAt(a.claims);
    if (iatDelta !== 0) return iatDelta;
    return a.index - b.index;
  });

  return candidates.map(({ token, claims, source, kind }) => ({ token, claims, source, kind }));
};
