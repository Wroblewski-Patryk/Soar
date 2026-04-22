import { resolveUiErrorMessage } from './errorResolver';
import { resolveDefaultTranslation } from '@/i18n/translations';

export type HandleErrorOptions = {
  fallback?: string;
};

/** @deprecated Use `resolveUiErrorMessage` from `lib/errorResolver` directly. */
export const handleError = (err: unknown, options: HandleErrorOptions = {}): string => {
  const fallback = options.fallback ?? resolveDefaultTranslation('dashboard.shared.genericError');
  return resolveUiErrorMessage(err, { fallback }) ?? fallback;
};
