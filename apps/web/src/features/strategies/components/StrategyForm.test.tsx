import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { I18nProvider } from '@/i18n/I18nProvider';
import type { StrategyFormState } from '@/features/strategies/types/StrategyForm.type';
import StrategyForm from './StrategyForm';

describe('StrategyForm', () => {
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('cryptosparrow-locale');
    window.history.pushState({}, '', '/');
  });

  const renderWithI18n = async (onSubmit?: (payload: StrategyFormState) => Promise<void>) => {
    let view: ReturnType<typeof render>;
    await act(async () => {
      view = render(
        <I18nProvider>
          <StrategyForm onSubmit={onSubmit} />
        </I18nProvider>
      );
    });
    await waitFor(() => {
      expect(document.documentElement.lang).toBe(
        window.localStorage.getItem('cryptosparrow-locale') ?? 'en'
      );
    });
    return view!;
  };

  it('shows validation summary and blocks submit when strategy name is empty', async () => {
    window.localStorage.setItem('cryptosparrow-locale', 'pl');
    window.history.pushState({}, '', '/dashboard/strategies/create');
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { container } = await renderWithI18n(onSubmit);

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId('form-validation-summary')).toBeInTheDocument();
    expect(screen.getAllByText('Nazwa strategii jest wymagana.').length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByLabelText('Nazwa')).toHaveFocus();
    });
  });

  it('submits when required basic fields are valid', async () => {
    window.localStorage.setItem('cryptosparrow-locale', 'pl');
    window.history.pushState({}, '', '/dashboard/strategies/create');
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { container } = await renderWithI18n(onSubmit);

    fireEvent.change(screen.getByLabelText('Nazwa'), { target: { value: 'Trend strat' } });

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('preserves tabs flow and renders close/additional sections after tab switches', async () => {
    window.localStorage.setItem('cryptosparrow-locale', 'pl');
    window.history.pushState({}, '', '/dashboard/strategies/create');
    await renderWithI18n();

    fireEvent.click(screen.getByRole('tab', { name: 'Warunki zamkniecia' }));
    expect(screen.getByText('Podstawowe ustawienia zamkniecia')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Dodatkowe ustawienia' }));
    expect(screen.getByText('Pozycje')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'DCA' })).toBeInTheDocument();
  });
});
