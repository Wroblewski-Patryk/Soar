import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RegisterPage from './RegisterPage';
import { I18nProvider } from '@/i18n/I18nProvider';

const mockReplace = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: () => (typeof window === 'undefined' ? '/' : window.location.pathname || '/'),
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../components/RegisterForm', () => ({
  default: () => <div data-testid='register-form-stub'>register form</div>,
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.removeItem('cryptosparrow-locale');
    window.history.pushState({}, '', '/auth/register');
    mockUseAuth.mockReturnValue({ user: null });
  });

  const renderPage = () =>
    render(
      <I18nProvider>
        <RegisterPage />
      </I18nProvider>
    );

  it('renders register copy and form entrypoint for signed-out visitors', async () => {
    renderPage();

    await waitFor(() => {
      expect(document.documentElement.lang).toBe(window.localStorage.getItem('cryptosparrow-locale') ?? 'en');
    });

    expect(
      screen.getByRole('heading', { name: /create your soar account/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('register-form-stub')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects authenticated visitors to the dashboard', async () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'john@example.com', userId: 'user-1', role: 'USER' },
    });

    renderPage();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });
});
