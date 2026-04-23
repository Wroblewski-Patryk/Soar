import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { toast } from 'sonner';

const mockApiGet = vi.fn();
const mockApiPost = vi.fn();
const originalWindowLocation = window.location;

vi.mock('../lib/api', () => ({
  default: {
    get: (...args: unknown[]) => mockApiGet(...args),
    post: (...args: unknown[]) => mockApiPost(...args),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
  },
}));

function AuthProbe() {
  const { loading, user } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="email">{user?.email ?? 'none'}</span>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/');
    mockApiGet.mockResolvedValue({
      data: {
        id: 'user-1',
        email: 'john@example.com',
        role: 'USER',
      },
    });
  });

  it('bootstraps auth session only once across parent rerenders without i18n provider', async () => {
    const { rerender } = render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    expect(screen.getByTestId('email')).toHaveTextContent('john@example.com');
    expect(mockApiGet).toHaveBeenCalledTimes(1);
    expect(mockApiGet).toHaveBeenCalledWith('/auth/me');

    rerender(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('john@example.com');
    });
    expect(mockApiGet).toHaveBeenCalledTimes(1);
  });

  it('warns and clears session-expired query hint after unauthorized refetch', async () => {
    window.history.pushState({}, '', '/auth/login?session=expired');
    mockApiGet
      .mockResolvedValueOnce({
        data: {
          id: 'user-1',
          email: 'john@example.com',
          role: 'USER',
        },
      })
      .mockRejectedValueOnce({
        response: { status: 401 },
      });

    let refetchUser: (() => Promise<boolean>) | null = null;

    function RefetchProbe() {
      const auth = useAuth();
      refetchUser = auth.refetchUser;
      return null;
    }

    render(
      <AuthProvider>
        <RefetchProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(refetchUser).not.toBeNull();
    });
    expect(mockApiGet).toHaveBeenCalledTimes(1);

    await act(async () => {
      await expect(refetchUser?.()).resolves.toBe(false);
    });

    expect(toast.warning).toHaveBeenCalledTimes(1);
    expect(window.location.search).toBe('');
  });

  it('posts logout, clears auth state, and redirects to login', async () => {
    mockApiPost.mockResolvedValueOnce({ data: { message: 'Logged out' } });
    let redirectedHref = 'http://localhost:3000/';

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalWindowLocation,
        get href() {
          return redirectedHref;
        },
        set href(next: string) {
          redirectedHref = next;
        },
      },
    });

    let logout: (() => void | Promise<void>) | null = null;

    function LogoutProbe() {
      const auth = useAuth();
      logout = auth.logout;
      return <span data-testid="logout-email">{auth.user?.email ?? 'none'}</span>;
    }

    render(
      <AuthProvider>
        <LogoutProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('logout-email')).toHaveTextContent('john@example.com');
      expect(logout).not.toBeNull();
    });

    await act(async () => {
      await logout?.();
    });

    expect(mockApiPost).toHaveBeenCalledWith('/auth/logout');
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('logout-email')).toHaveTextContent('none');
    expect(window.location.href).toContain('/auth/login');

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalWindowLocation,
    });
  });
});
