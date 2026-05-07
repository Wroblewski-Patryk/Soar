import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RegisterForm from './RegisterForm';
import { I18nProvider } from '@/i18n/I18nProvider';

const mockUseRegisterForm = vi.fn();

vi.mock('../hooks/useRegisterForm', () => ({
  useRegisterForm: () => mockUseRegisterForm(),
}));

describe('RegisterForm', () => {
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('cryptosparrow-locale');
    window.history.pushState({}, '', '/');
  });

  const renderWithI18n = async () => {
    window.history.pushState({}, '', '/auth/register');
    await act(async () => {
      render(
        <I18nProvider>
          <RegisterForm />
        </I18nProvider>
      );
    });
    await waitFor(() => {
      expect(document.documentElement.lang).toBe(window.localStorage.getItem('cryptosparrow-locale') ?? 'en');
    });
  };

  it('renders email and password fields', async () => {
    mockUseRegisterForm.mockReturnValue({
      register: () => ({ name: 'field', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() }),
      onFormSubmit: vi.fn(),
      errors: {},
      isSubmitting: false,
      serverError: null,
    });

    await renderWithI18n();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
  });

  it('renders a fail-closed server HTML form before hydration', () => {
    mockUseRegisterForm.mockReturnValue({
      register: () => ({ name: 'field', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() }),
      onFormSubmit: vi.fn(),
      errors: {},
      isSubmitting: false,
      serverError: null,
    });

    const html = renderToString(
      <I18nProvider>
        <RegisterForm />
      </I18nProvider>
    );

    expect(html).toContain('method="post"');
    expect(html).toContain('<fieldset class="fieldset" disabled="">');
    expect(html).not.toContain('method="get"');
  });

  it('toggles password visibility', async () => {
    mockUseRegisterForm.mockReturnValue({
      register: () => ({ name: 'field', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() }),
      onFormSubmit: vi.fn(),
      errors: {},
      isSubmitting: false,
      serverError: null,
    });

    await renderWithI18n();

    const passwordInput = screen.getByLabelText(/^Password$/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: /show password/i }));
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('announces server registration errors as an alert', async () => {
    mockUseRegisterForm.mockReturnValue({
      register: () => ({ name: 'field', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() }),
      onFormSubmit: vi.fn(),
      errors: {},
      isSubmitting: false,
      serverError: 'Registration failed. Please try again.',
    });

    await renderWithI18n();

    expect(screen.getByRole('alert')).toHaveTextContent('Registration failed. Please try again.');
  });

  it('uses Polish auth namespace copy when locale is pl', async () => {
    window.localStorage.setItem('cryptosparrow-locale', 'pl');
    mockUseRegisterForm.mockReturnValue({
      register: () => ({ name: 'field', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() }),
      onFormSubmit: vi.fn(),
      errors: {},
      isSubmitting: false,
      serverError: null,
    });

    await renderWithI18n();

    await waitFor(() => {
      expect(screen.getByText('Masz konto?')).toBeInTheDocument();
    });
  });
});
