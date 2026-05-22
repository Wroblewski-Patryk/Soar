export type UiErrorResolveOptions = {
  fallback?: string;
};

type ErrorDetailsItem = {
  message?: string;
};

type ErrorPayload = {
  error?:
    | string
    | {
        message?: string;
        details?: ErrorDetailsItem[];
      };
  message?: string;
};

type ErrorLike = {
  response?: {
    data?: ErrorPayload;
  };
  message?: string;
};

const sensitiveMessagePattern =
  /(authorization|bearer|cookie|password|passphrase|secret|token|api[-_ ]?key|api[-_ ]?secret|private[-_ ]?key|jwt|credential|session|prisma|sql|select\s+.+\s+from|insert\s+into|update\s+.+\s+set|delete\s+from|stack trace|\bat\s+\S+\s+\()/i;

const pickMessage = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const isProduction = () => process.env.NODE_ENV === 'production';

const toSafeMessage = (message: string | undefined, fallback?: string) => {
  if (!message) return undefined;
  if (isProduction() && sensitiveMessagePattern.test(message)) {
    return fallback;
  }
  return message;
};

const pickDetailsMessage = (details: ErrorDetailsItem[] | undefined): string | undefined => {
  if (!Array.isArray(details) || details.length === 0) return undefined;
  const values = details
    .map((item) => pickMessage(item?.message))
    .filter((message): message is string => Boolean(message));
  return values.length > 0 ? values.join(', ') : undefined;
};

export const resolveUiErrorMessage = (
  err: unknown,
  options: UiErrorResolveOptions = {}
): string | undefined => {
  const error = err as ErrorLike | undefined;
  const payload = error?.response?.data;
  const payloadError = payload?.error;

  if (typeof payloadError === 'object' && payloadError) {
    return toSafeMessage(
      pickDetailsMessage(payloadError.details) ??
        pickMessage(payloadError.message) ??
        pickMessage(payload?.message),
      options.fallback
    ) ?? (isProduction() ? options.fallback : toSafeMessage(pickMessage(error?.message), options.fallback)) ?? options.fallback;
  }

  return toSafeMessage(pickMessage(payloadError) ?? pickMessage(payload?.message), options.fallback) ??
    (isProduction() ? options.fallback : toSafeMessage(pickMessage(error?.message), options.fallback)) ??
    options.fallback;
};
