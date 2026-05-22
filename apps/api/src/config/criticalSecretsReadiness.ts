type ReadinessIssue = {
  key: string;
  reason: string;
};

type CriticalSecretsReadiness = {
  ready: boolean;
  missing: string[];
  issues: ReadinessIssue[];
};

const asNonEmpty = (value: string | undefined | null) => {
  const normalized = value?.trim();
  return normalized ? normalized : null;
};

const WEAK_SECRET_VALUES = [
  'change-me',
  'changeme',
  'password',
  'secret',
  'replace-me',
  'replace-with-secret',
  'replace-with-generated-secret',
  'change-me-32-byte-secret',
];

const looksWeakSecret = (value: string, minimumLength: number) => {
  const normalized = value.trim().toLowerCase();
  if (normalized.length < minimumLength) return true;
  if (WEAK_SECRET_VALUES.some((weak) => normalized.includes(weak))) return true;
  if (/^(.)\1+$/.test(normalized)) return true;
  return false;
};

const parseKeyring = (raw: string | undefined) => {
  const entries = (raw ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  const versions = new Set<string>();
  const malformed: string[] = [];
  const weak: string[] = [];

  for (const entry of entries) {
    const separatorIndex = entry.indexOf(':');
    const version = separatorIndex > 0 ? entry.slice(0, separatorIndex).trim() : '';
    const material = separatorIndex > 0 ? entry.slice(separatorIndex + 1).trim() : '';
    if (!version || !material) {
      malformed.push(entry);
      continue;
    }
    versions.add(version.trim());
    if (looksWeakSecret(material, 32)) {
      weak.push(version);
    }
  }

  return { versions, malformed, weak };
};

const evaluateJwtRotationReadiness = (
  issues: ReadinessIssue[],
  missing: Set<string>,
  nowMs: number
) => {
  const jwtSecret = asNonEmpty(process.env.JWT_SECRET);
  if (!jwtSecret) {
    missing.add('JWT_SECRET');
  } else if (looksWeakSecret(jwtSecret, 32)) {
    issues.push({
      key: 'JWT_SECRET',
      reason: 'must be generated high-entropy material, not a placeholder or short value',
    });
  }

  const previous = asNonEmpty(process.env.JWT_SECRET_PREVIOUS);
  const previousUntil = asNonEmpty(process.env.JWT_SECRET_PREVIOUS_UNTIL);
  if (!previous && previousUntil) {
    issues.push({
      key: 'JWT_SECRET_PREVIOUS_UNTIL',
      reason: 'set without JWT_SECRET_PREVIOUS',
    });
    return;
  }
  if (!previous) return;

  if (!previousUntil) {
    issues.push({
      key: 'JWT_SECRET_PREVIOUS_UNTIL',
      reason: 'required when JWT_SECRET_PREVIOUS is configured',
    });
    return;
  }

  const parsedMs = Date.parse(previousUntil);
  if (Number.isNaN(parsedMs)) {
    issues.push({
      key: 'JWT_SECRET_PREVIOUS_UNTIL',
      reason: 'must be valid ISO datetime',
    });
    return;
  }

  if (parsedMs <= nowMs) {
    issues.push({
      key: 'JWT_SECRET_PREVIOUS_UNTIL',
      reason: 'rotation window expired; remove previous secret or extend with approved window',
    });
  }
};

const evaluateEncryptionReadiness = (issues: ReadinessIssue[], missing: Set<string>) => {
  const keyringRaw = asNonEmpty(process.env.API_KEY_ENCRYPTION_KEYS);
  const activeVersion = asNonEmpty(process.env.API_KEY_ENCRYPTION_ACTIVE_VERSION) ?? 'v1';

  const { versions, malformed, weak } = parseKeyring(keyringRaw ?? '');
  for (const entry of malformed) {
    issues.push({
      key: 'API_KEY_ENCRYPTION_KEYS',
      reason: `malformed entry "${entry}" (expected version:key)`,
    });
  }
  for (const version of weak) {
    issues.push({
      key: 'API_KEY_ENCRYPTION_KEYS',
      reason: `version "${version}" uses weak or placeholder key material`,
    });
  }

  if (versions.size === 0) {
    missing.add('API_KEY_ENCRYPTION_KEYS');
    return;
  }

  if (!versions.has(activeVersion)) {
    issues.push({
      key: 'API_KEY_ENCRYPTION_ACTIVE_VERSION',
      reason: `active version "${activeVersion}" not found in API_KEY_ENCRYPTION_KEYS`,
    });
  }
};

export const evaluateCriticalSecretsReadiness = (nowMs = Date.now()): CriticalSecretsReadiness => {
  const missing = new Set<string>();
  const issues: ReadinessIssue[] = [];

  evaluateJwtRotationReadiness(issues, missing, nowMs);
  evaluateEncryptionReadiness(issues, missing);

  return {
    ready: missing.size === 0 && issues.length === 0,
    missing: Array.from(missing).sort((left, right) => left.localeCompare(right)),
    issues,
  };
};

export const assertCriticalSecretsReadiness = (nowMs = Date.now()) => {
  const readiness = evaluateCriticalSecretsReadiness(nowMs);
  if (readiness.ready) return;

  const missingPart =
    readiness.missing.length > 0 ? `missing=[${readiness.missing.join(', ')}]` : '';
  const issuePart =
    readiness.issues.length > 0
      ? `issues=[${readiness.issues.map((issue) => `${issue.key}:${issue.reason}`).join(' | ')}]`
      : '';
  const details = [missingPart, issuePart].filter(Boolean).join(' ');

  throw new Error(`Critical secret readiness check failed${details ? `: ${details}` : ''}`);
};
