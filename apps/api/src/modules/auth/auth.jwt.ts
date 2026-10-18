import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { AuthRole } from '../../types/express';

export type AuthTokenPayload = JwtPayload & {
  userId: string;
  email: string;
  role: AuthRole;
  sessionVersion?: number;
  sessionKind?: 'human';
};

const JWT_ISSUER = 'cryptosparrow';
const LEGACY_AUTH_AUDIENCE = 'cryptosparrow-app';
const HUMAN_SESSION_AUDIENCE = 'cryptosparrow-human-session';

const getPreviousSecretExpiry = () => {
  const rawValue = process.env.JWT_SECRET_PREVIOUS_UNTIL?.trim();
  if (!rawValue) return null;

  const parsedMs = Date.parse(rawValue);
  if (Number.isNaN(parsedMs)) {
    throw new Error('JWT_SECRET_PREVIOUS_UNTIL must be a valid ISO datetime');
  }

  return parsedMs;
};

const getJwtSecrets = () => {
  const primarySecret = process.env.JWT_SECRET?.trim();
  const previousSecrets = (process.env.JWT_SECRET_PREVIOUS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const previousSecretExpiryMs = getPreviousSecretExpiry();

  if (!primarySecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const isPreviousWindowOpen =
    previousSecrets.length > 0 &&
    (previousSecretExpiryMs === null || Date.now() <= previousSecretExpiryMs);

  return isPreviousWindowOpen ? [primarySecret, ...previousSecrets] : [primarySecret];
};

export const signAuthToken = (
  payload: Pick<AuthTokenPayload, 'userId' | 'email' | 'role' | 'sessionVersion'>,
  expiresIn: NonNullable<SignOptions['expiresIn']>
) =>
  jwt.sign(payload, getJwtSecrets()[0], {
    expiresIn,
    algorithm: 'HS256',
    issuer: JWT_ISSUER,
    audience: LEGACY_AUTH_AUDIENCE,
  });

export const signHumanSessionToken = (
  payload: Pick<AuthTokenPayload, 'userId' | 'email' | 'role' | 'sessionVersion'>,
  expiresIn: NonNullable<SignOptions['expiresIn']>
) =>
  jwt.sign({ ...payload, sessionKind: 'human' }, getJwtSecrets()[0], {
    expiresIn,
    algorithm: 'HS256',
    issuer: JWT_ISSUER,
    audience: HUMAN_SESSION_AUDIENCE,
  });

export const isHumanSessionToken = (claims: AuthTokenPayload): boolean =>
  claims.sessionKind === 'human' && claims.aud === HUMAN_SESSION_AUDIENCE;

export const verifyAuthToken = (token: string): AuthTokenPayload => {
  const secrets = getJwtSecrets();

  for (const secret of secrets) {
    try {
      const humanClaims = jwt.verify(token, secret, {
        algorithms: ['HS256'],
        issuer: JWT_ISSUER,
        audience: HUMAN_SESSION_AUDIENCE,
      }) as AuthTokenPayload;
      if (isHumanSessionToken(humanClaims)) return humanClaims;
    } catch {
      // Try the legacy audience before the next configured key.
    }

    try {
      const legacyClaims = jwt.verify(token, secret, {
        algorithms: ['HS256'],
        issuer: JWT_ISSUER,
        audience: LEGACY_AUTH_AUDIENCE,
      }) as AuthTokenPayload;
      if (legacyClaims.sessionKind === undefined) return legacyClaims;
    } catch {
      // Try next configured key to support in-flight secret rotation.
    }
  }

  throw new Error('Invalid token');
};
