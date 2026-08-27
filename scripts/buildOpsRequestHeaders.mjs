const HEADER_NAME_PATTERN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

const normalize = (value) => String(value ?? '').trim();

export const resolveOpsAuthLayerOptions = ({
  opsAuthHeaderName = '',
  opsAuthHeaderValue = '',
  opsBasicUser = '',
  opsBasicPassword = '',
} = {}) => {
  const normalized = {
    opsAuthHeaderName: normalize(opsAuthHeaderName),
    opsAuthHeaderValue: normalize(opsAuthHeaderValue),
    opsBasicUser: normalize(opsBasicUser),
    opsBasicPassword: normalize(opsBasicPassword),
  };

  const hasCustomHeaderName = normalized.opsAuthHeaderName.length > 0;
  const hasCustomHeaderValue = normalized.opsAuthHeaderValue.length > 0;
  if (hasCustomHeaderName !== hasCustomHeaderValue) {
    throw new Error('ops auth custom header requires both --ops-auth-header-name and --ops-auth-header-value');
  }
  if (hasCustomHeaderName && !HEADER_NAME_PATTERN.test(normalized.opsAuthHeaderName)) {
    throw new Error(`invalid ops auth header name: ${normalized.opsAuthHeaderName}`);
  }

  const hasBasicUser = normalized.opsBasicUser.length > 0;
  const hasBasicPassword = normalized.opsBasicPassword.length > 0;
  if (hasBasicUser !== hasBasicPassword) {
    throw new Error('ops basic auth requires both --ops-basic-user and --ops-basic-password');
  }

  return normalized;
};

export const buildOpsRequestHeaders = ({
  token = '',
  opsAuthHeaderName = '',
  opsAuthHeaderValue = '',
  opsBasicUser = '',
  opsBasicPassword = '',
} = {}) => {
  const normalized = resolveOpsAuthLayerOptions({
    opsAuthHeaderName,
    opsAuthHeaderValue,
    opsBasicUser,
    opsBasicPassword,
  });
  const normalizedToken = normalize(token);

  const headers = {};
  if (normalized.opsBasicUser && normalized.opsBasicPassword) {
    const basicPayload = Buffer.from(
      `${normalized.opsBasicUser}:${normalized.opsBasicPassword}`,
      'utf8'
    ).toString('base64');
    headers.Authorization = `Basic ${basicPayload}`;
  } else if (normalizedToken) {
    headers.Authorization = `Bearer ${normalizedToken}`;
  }

  if (normalizedToken) {
    headers.Cookie = `token=${encodeURIComponent(normalizedToken)}`;
  }

  if (normalized.opsAuthHeaderName && normalized.opsAuthHeaderValue) {
    headers[normalized.opsAuthHeaderName] = normalized.opsAuthHeaderValue;
  }

  return headers;
};
