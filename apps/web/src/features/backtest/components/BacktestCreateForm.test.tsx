import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ComponentProps } from 'react';

import BacktestCreateForm from './BacktestCreateForm';
import { I18nProvider } from '@/i18n/I18nProvider';

const listStrategiesMock = vi.hoisted(() => vi.fn());
const listMarketUniversesMock = vi.hoisted(() => vi.fn());

vi.mock('../../strategies/api/strategies.api', () => ({
  listStrategies: listStrategiesMock,
}));

vi.mock('../../markets/services/markets.service', () => ({
  listMarketUniverses: listMarketUniversesMock,
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('BacktestCreateForm', () => {
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('cryptosparrow-locale');
    window.history.pushState({}, '', '/');
  });

  const renderWithI18n = async (props: ComponentProps<typeof BacktestCreateForm>) => {
    let view: ReturnType<typeof render>;
    await act(async () => {
      view = render(
        <I18nProvider>
          <BacktestCreateForm {...props} />
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

  it('disables submit and shows validation when maxCandles is out of range', async () => {
    listStrategiesMock.mockResolvedValue([
      {
        id: 's1',
        name: 'Trend Pulse',
        interval: '5m',
        leverage: 2,
        config: { additional: { marginMode: 'CROSSED' } },
      },
    ]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: 'm1',
        name: 'Top 3',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'],
        blacklist: [],
      },
    ]);

    window.localStorage.setItem('cryptosparrow-locale', 'pl');
    window.history.pushState({}, '', '/dashboard/backtests/create');
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { container } = await renderWithI18n({ submitting: false, onSubmit });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Trend Pulse')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('1200'), { target: { value: '200' } });
    expect(screen.queryByText('Podaj liczbe z zakresu 250 - 10000.')).not.toBeInTheDocument();

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getAllByText('Podaj liczbe z zakresu 250 - 10000.').length).toBeGreaterThan(0);
    expect(screen.getByTestId('form-validation-summary')).toBeInTheDocument();
    expect(screen.getByLabelText('Maksymalna liczba swiec na rynek (auto-limit)')).toHaveFocus();
  });

  it('renders explicit start/end range controls and md 3-column layout hooks', async () => {
    listStrategiesMock.mockResolvedValue([
      {
        id: 's-range',
        name: 'Range Strategy',
        interval: '1h',
        leverage: 2,
        config: { additional: { marginMode: 'CROSSED' } },
      },
    ]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: 'm-range',
        name: 'Range Universe',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    ]);

    window.localStorage.setItem('cryptosparrow-locale', 'pl');
    window.history.pushState({}, '', '/dashboard/backtests/create');
    await renderWithI18n({ submitting: false, onSubmit: vi.fn() });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Range Strategy')).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/data startu zakresu/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data konca zakresu/i)).toBeInTheDocument();

    const runGrid = screen.getByTestId('backtest-create-run-grid');
    const simulationGrid = screen.getByTestId('backtest-create-simulation-grid');
    expect(runGrid.className).toContain('md:grid-cols-3');
    expect(simulationGrid.className).toContain('md:grid-cols-3');
  });

  it('submits valid payload with strategy interval and parsed maxCandles', async () => {
    listStrategiesMock.mockResolvedValue([
      {
        id: 's2',
        name: 'EMA Crossover',
        interval: '15m',
        leverage: 3,
        config: { additional: { marginMode: 'ISOLATED' } },
      },
    ]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: 'm2',
        name: 'Majors',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT', 'ETHUSDT'],
        blacklist: ['BTCUSDC'],
      },
    ]);

    window.localStorage.setItem('cryptosparrow-locale', 'pl');
    window.history.pushState({}, '', '/dashboard/backtests/create');
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { container } = await renderWithI18n({ submitting: false, onSubmit });

    await waitFor(() => {
      expect(screen.getByDisplayValue('EMA Crossover')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText('Nazwa runa');
    await waitFor(() => {
      expect(nameInput).toHaveValue('Backtest EMA Crossover | Majors (15m)');
    });

    fireEvent.change(nameInput, { target: { value: 'Parity check run' } });
    fireEvent.change(screen.getByPlaceholderText('1200'), { target: { value: '800' } });

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.change(screen.getByLabelText(/data startu zakresu/i), { target: { value: '2026-01-01T00:00' } });
    fireEvent.change(screen.getByLabelText(/data konca zakresu/i), { target: { value: '2026-01-15T00:00' } });
    fireEvent.submit(form as HTMLFormElement);

    const expectedStartAtIso = new Date('2026-01-01T00:00').toISOString();
    const expectedEndAtIso = new Date('2026-01-15T00:00').toISOString();

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Parity check run',
        timeframe: '15m',
        strategyId: 's2',
        marketUniverseId: 'm2',
        startAt: expectedStartAtIso,
        endAt: expectedEndAtIso,
        seedConfig: { maxCandles: 1344, initialBalance: 10000 },
        notes: undefined,
      });
    });
  });

  it('renders explicit venue context summary bound to selected market group', async () => {
    listStrategiesMock.mockResolvedValue([
      {
        id: 's3',
        name: 'Venue Strategy',
        interval: '1h',
        leverage: 2,
        config: { additional: { marginMode: 'CROSSED' } },
      },
    ]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: 'm3',
        name: 'Spot Context',
        exchange: 'OKX',
        marketType: 'SPOT',
        baseCurrency: 'USDC',
        whitelist: ['BTCUSDC'],
        blacklist: [],
      },
    ]);

    window.localStorage.setItem('cryptosparrow-locale', 'pl');
    window.history.pushState({}, '', '/dashboard/backtests/create');
    await renderWithI18n({ submitting: false, onSubmit: vi.fn() });

    await waitFor(() => {
      expect(screen.getByText('Kontekst venue (powiazany z wybrana grupa rynkow)')).toBeInTheDocument();
    });

    const contextCard = screen.getByText('Kontekst venue (powiazany z wybrana grupa rynkow)').closest('div');
    expect(contextCard).not.toBeNull();
    const scope = within(contextCard as HTMLElement);
    expect(scope.getByText('OKX')).toBeInTheDocument();
    expect(scope.getByText('SPOT')).toBeInTheDocument();
    expect(scope.getByText('USDC')).toBeInTheDocument();
    expect(
      scope.getByText(
        'Kontekst wykonania backtestu jest dziedziczony z wybranej grupy rynkow i nie moze sie rozjechac.'
      )
    ).toBeInTheDocument();
  });

  it('supports Portuguese locale path without EN/PL clamp in create form copy', async () => {
    window.localStorage.setItem('cryptosparrow-locale', 'pt');
    window.history.pushState({}, '', '/dashboard/backtests/create');
    listStrategiesMock.mockResolvedValue([
      {
        id: 's4',
        name: 'Trend PT',
        interval: '15m',
        leverage: 2,
        config: { additional: { marginMode: 'CROSSED' } },
      },
    ]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: 'm4',
        name: 'Mercado PT',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    ]);

    await renderWithI18n({ submitting: false, onSubmit: vi.fn() });

    await waitFor(() => {
      expect(screen.getByText('Assistente de backtest')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Nome da execucao')).toBeInTheDocument();
    expect(screen.getByText('Configuracao da execucao')).toBeInTheDocument();
  });
});
