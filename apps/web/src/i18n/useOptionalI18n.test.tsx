import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from './I18nProvider';
import { useOptionalI18n } from './useOptionalI18n';

describe('useOptionalI18n', () => {
  it('keeps fallback translator stable across rerenders without provider', () => {
    const { result, rerender } = renderHook(() => useOptionalI18n());
    const firstTranslator = result.current.t;

    rerender();

    expect(result.current.hasProvider).toBe(false);
    expect(result.current.t).toBe(firstTranslator);
    expect(result.current.t('auth.toasts.login.success')).toBe('Signed in successfully.');
  });

  it('uses provider translations when available', () => {
    const wrapper = ({ children }: { children: import('react').ReactNode }) => (
      <I18nProvider>{children}</I18nProvider>
    );

    const { result } = renderHook(() => useOptionalI18n(), { wrapper });

    expect(result.current.hasProvider).toBe(true);
    expect(result.current.t('auth.toasts.login.success')).toBe('Signed in successfully.');
  });
});
