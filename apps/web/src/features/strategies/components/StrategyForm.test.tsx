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

  it('allows zero lifetime values and explains the no-limit semantic', async () => {
    window.localStorage.setItem('cryptosparrow-locale', 'pl');
    window.history.pushState({}, '', '/dashboard/strategies/create');
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { container } = await renderWithI18n(onSubmit);

    fireEvent.change(screen.getByLabelText('Nazwa'), { target: { value: 'Lifetime zero strat' } });
    fireEvent.click(screen.getByRole('tab', { name: 'Dodatkowe ustawienia' }));

    expect(
      screen.getAllByText('Ustaw 0, aby wylaczyc limit czasu dla tego cyklu zycia.').length
    ).toBeGreaterThan(0);

    const positionLifetimeInput = container.querySelector(
      '#strategy-additional-position-lifetime'
    ) as HTMLInputElement | null;
    const orderLifetimeInput = container.querySelector(
      '#strategy-additional-order-lifetime'
    ) as HTMLInputElement | null;

    expect(positionLifetimeInput).not.toBeNull();
    expect(orderLifetimeInput).not.toBeNull();
    expect(positionLifetimeInput?.min).toBe('0');
    expect(orderLifetimeInput?.min).toBe('0');

    fireEvent.change(positionLifetimeInput as HTMLInputElement, { target: { value: '0' } });
    fireEvent.change(orderLifetimeInput as HTMLInputElement, { target: { value: '0' } });

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    const submitted = onSubmit.mock.calls[0]?.[0] as StrategyFormState;
    expect(submitted.additional.positionLifetime).toBe(0);
    expect(submitted.additional.orderLifetime).toBe(0);
  });

  it('allows submit when advanced TSL uses negative start and positive step', async () => {
    window.localStorage.setItem('cryptosparrow-locale', 'pl');
    window.history.pushState({}, '', '/dashboard/strategies/create');
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { container } = await renderWithI18n(onSubmit);

    fireEvent.change(screen.getByLabelText('Nazwa'), { target: { value: 'Niepoprawny TSL' } });
    fireEvent.click(screen.getByRole('tab', { name: 'Warunki zamkniecia' }));
    const advancedModeInput = container.querySelector(
      '#strategy-close-mode-advanced'
    ) as HTMLInputElement | null;
    expect(advancedModeInput).not.toBeNull();
    fireEvent.click(advancedModeInput as HTMLInputElement);
    const tslPercentInput = await waitFor(() => {
      const input = container.querySelector(
        '#strategy-close-tsl-percent-0'
      ) as HTMLInputElement | null;
      expect(input).not.toBeNull();
      return input as HTMLInputElement;
    });
    const tslArmInput = await waitFor(() => {
      const input = container.querySelector(
        '#strategy-close-tsl-arm-0'
      ) as HTMLInputElement | null;
      expect(input).not.toBeNull();
      return input as HTMLInputElement;
    });

    fireEvent.change(tslPercentInput, {
      target: { value: '-20' },
    });
    fireEvent.change(tslArmInput, {
      target: { value: '10' },
    });

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('preserves reordered advanced DCA levels on submit', async () => {
    window.localStorage.setItem('cryptosparrow-locale', 'pl');
    window.history.pushState({}, '', '/dashboard/strategies/create');
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { container } = await renderWithI18n(onSubmit);

    fireEvent.change(screen.getByLabelText('Nazwa'), { target: { value: 'DCA reorder strat' } });
    fireEvent.click(screen.getByRole('tab', { name: 'Dodatkowe ustawienia' }));

    const advancedModeInput = container.querySelector(
      '#strategy-dca-mode-advanced'
    ) as HTMLInputElement | null;
    expect(advancedModeInput).not.toBeNull();
    fireEvent.click(advancedModeInput as HTMLInputElement);

    const addLevelButton = screen.getByRole('button', { name: '+ Dodaj poziom' });
    fireEvent.click(addLevelButton);
    fireEvent.click(addLevelButton);

    const percentInputs = () =>
      Array.from(container.querySelectorAll('input[id^="strategy-dca-level-percent-"]')) as HTMLInputElement[];
    const multiplierInputs = () =>
      Array.from(container.querySelectorAll('input[id^="strategy-dca-level-multiplier-"]')) as HTMLInputElement[];

    fireEvent.change(percentInputs()[0], { target: { value: '-1' } });
    fireEvent.change(multiplierInputs()[0], { target: { value: '10' } });
    fireEvent.change(percentInputs()[1], { target: { value: '-1.5' } });
    fireEvent.change(multiplierInputs()[1], { target: { value: '20' } });
    fireEvent.change(percentInputs()[2], { target: { value: '-0.5' } });
    fireEvent.change(multiplierInputs()[2], { target: { value: '5' } });

    fireEvent.click(screen.getAllByRole('button', { name: 'Wyzej' })[2]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Wyzej' })[1]);

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    const submitted = onSubmit.mock.calls[0]?.[0] as StrategyFormState;
    expect(submitted.additional.dcaLevels.map((level) => ({
      percent: level.percent,
      multiplier: level.multiplier,
    }))).toEqual([
      { percent: -0.5, multiplier: 5 },
      { percent: -1, multiplier: 10 },
      { percent: -1.5, multiplier: 20 },
    ]);
  });

  it('blocks submit when basic TP/SL makes a DCA level unreachable', async () => {
    window.localStorage.setItem('cryptosparrow-locale', 'pl');
    window.history.pushState({}, '', '/dashboard/strategies/create');
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { container } = await renderWithI18n(onSubmit);

    fireEvent.change(screen.getByLabelText('Nazwa'), { target: { value: 'Unreachable DCA strat' } });
    fireEvent.click(screen.getByRole('tab', { name: 'Warunki zamkniecia' }));

    const tpInput = container.querySelector('#strategy-close-tp') as HTMLInputElement | null;
    const slInput = container.querySelector('#strategy-close-sl') as HTMLInputElement | null;
    expect(tpInput).not.toBeNull();
    expect(slInput).not.toBeNull();
    fireEvent.change(tpInput as HTMLInputElement, { target: { value: '10' } });
    fireEvent.change(slInput as HTMLInputElement, { target: { value: '10' } });

    fireEvent.click(screen.getByRole('tab', { name: 'Dodatkowe ustawienia' }));
    const dcaPercentInput = container.querySelector(
      '#strategy-dca-level-percent-0'
    ) as HTMLInputElement | null;
    expect(dcaPercentInput).not.toBeNull();
    fireEvent.change(dcaPercentInput as HTMLInputElement, { target: { value: '-20' } });

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId('form-validation-summary')).toBeInTheDocument();
    expect(
      screen.getByText(
        'W trybie podstawowym TP/SL poziomy DCA musza byc osiagalne zanim Take Profit albo Stop Loss zamknie pozycje.'
      )
    ).toBeInTheDocument();
  });
});
