import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@/i18n/I18nProvider';
import PasswordVisibilityToggle from './PasswordVisibilityToggle';

describe('PasswordVisibilityToggle', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/auth/login');
  });

  afterEach(() => {
    cleanup();
    window.history.pushState({}, '', '/');
  });

  it('exposes the show-password action and calls onToggle when enabled', () => {
    const onToggle = vi.fn();

    render(
      <I18nProvider>
        <PasswordVisibilityToggle show={false} onToggle={onToggle} />
      </I18nProvider>
    );

    const button = screen.getByRole('button', { name: /show password/i });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toBeEnabled();

    fireEvent.click(button);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('exposes the hide-password label and stays fail-closed when disabled', () => {
    const onToggle = vi.fn();

    render(
      <I18nProvider>
        <PasswordVisibilityToggle show disabled onToggle={onToggle} />
      </I18nProvider>
    );

    const button = screen.getByRole('button', { name: /hide password/i });
    expect(button).toBeDisabled();

    fireEvent.click(button);

    expect(onToggle).not.toHaveBeenCalled();
  });
});
