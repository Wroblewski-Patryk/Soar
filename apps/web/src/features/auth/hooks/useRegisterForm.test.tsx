import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRegisterForm } from './useRegisterForm';
import { I18nProvider } from '@/i18n/I18nProvider';

const mockReplace = vi.fn();
const mockRefetchUser = vi.fn();
const mockRegisterUser = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: () => (typeof window === 'undefined' ? '/' : window.location.pathname || '/'),
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    refetchUser: mockRefetchUser,
  }),
}));

vi.mock('../services/auth.service', () => ({
  registerUser: (...args: unknown[]) => mockRegisterUser(...args),
}));

vi.mock('../../../lib/handleError', () => ({
  handleError: (error: unknown) => (error instanceof Error ? error.message : 'unknown_error'),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: vi.fn(),
    handleSubmit: (
      cb: (data: { email: string; password: string; terms: boolean }) => Promise<void>
    ) => {
      return async () => {
        await cb({
          email: 'john@example.com',
          password: 'secret123',
          terms: true,
        });
      };
    },
    formState: {
      errors: {},
      isSubmitting: false,
    },
  }),
}));

describe('useRegisterForm', () => {
  const wrapper = ({ children }: { children: import('react').ReactNode }) => (
    <I18nProvider>{children}</I18nProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NODE_ENV', 'test');
    window.history.pushState({}, '', '/auth/register');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('shows error toast when registration request fails', async () => {
    mockRegisterUser.mockRejectedValueOnce(new Error('email_taken'));

    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    await act(async () => {
      await result.current.onFormSubmit();
    });

    expect(mockToastError).toHaveBeenCalledWith('Registration failed: email_taken');
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects to dashboard without success toast on successful registration', async () => {
    mockRegisterUser.mockResolvedValueOnce({});
    mockRefetchUser.mockResolvedValueOnce(true);

    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    await act(async () => {
      await result.current.onFormSubmit();
    });

    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockToastError).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('treats missing session refresh after registration as failure and does not redirect', async () => {
    mockRegisterUser.mockResolvedValueOnce({});
    mockRefetchUser.mockResolvedValueOnce(false);

    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    await act(async () => {
      await result.current.onFormSubmit();
    });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalled();
    });
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
