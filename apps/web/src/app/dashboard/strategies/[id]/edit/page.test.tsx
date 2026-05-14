import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';

import StrategiesEditPage from './page';
import { I18nProvider } from '@/i18n/I18nProvider';
import type { StrategyDto, StrategyFormState } from '@/features/strategies/types/StrategyForm.type';

const getStrategyMock = vi.hoisted(() => vi.fn());
const updateStrategyMock = vi.hoisted(() => vi.fn());
const dtoToFormMock = vi.hoisted(() => vi.fn());
const strategyFormMock = vi.hoisted(() => vi.fn());
const routerPushMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useParams: () => ({
    id: 'strategy-91',
  }),
  useRouter: () => ({
    push: routerPushMock,
  }),
  usePathname: () => (typeof window === 'undefined' ? '/' : window.location.pathname || '/'),
}));

vi.mock('@/features/strategies/api/strategies.api', () => ({
  getStrategy: getStrategyMock,
  updateStrategy: updateStrategyMock,
}));

vi.mock('@/features/strategies/utils/StrategyForm.map', () => ({
  dtoToForm: dtoToFormMock,
}));

vi.mock('@/features/strategies/components/StrategyForm', () => ({
  default: (props: {
    formId: string;
    initial?: StrategyFormState;
    submitting: boolean;
    onSubmit: (payload: unknown) => Promise<void>;
  }) => {
    strategyFormMock(props);
    return (
      <div data-testid='strategy-form'>
        <span>{props.initial?.name ?? 'strategy-form'}</span>
        <button type='button' onClick={() => props.onSubmit(props.initial as StrategyFormState)}>
          submit strategy form
        </button>
      </div>
    );
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  getStrategyMock.mockReset();
  updateStrategyMock.mockReset();
  dtoToFormMock.mockReset();
  strategyFormMock.mockReset();
  routerPushMock.mockReset();
});

describe('Strategies edit page', () => {
  const loadedForm = {
    name: 'Trend rider',
    description: 'desc',
    interval: '1h',
    leverage: 3,
    walletRisk: 1,
    openConditions: { direction: 'both', indicatorsLong: [], indicatorsShort: [] },
    closeConditions: { mode: 'basic', tp: 2, sl: 1, ttp: [], tsl: [] },
    additional: {
      dcaEnabled: false,
      dcaMode: 'basic',
      dcaTimes: 0,
      dcaMultiplier: 1,
      dcaLevels: [],
      maxPositions: 1,
      maxOrders: 1,
      positionLifetime: 0,
      positionUnit: 'h',
      orderLifetime: 0,
      orderUnit: 'h',
      marginMode: 'ISOLATED',
    },
  } satisfies StrategyFormState;

  const arrangeLoadedStrategy = () => {
    getStrategyMock.mockResolvedValue({
      id: 'strategy-91',
      name: 'Trend rider',
      description: 'desc',
      leverage: 3,
      interval: '1h',
      createdAt: '2026-05-01T00:00:00.000Z',
    } satisfies StrategyDto);
    dtoToFormMock.mockReturnValue(loadedForm);

    window.localStorage.setItem('cryptosparrow-locale', 'en');
    window.history.pushState({}, '', '/dashboard/strategies/strategy-91/edit');
  };

  it('renders the canonical edit route shell with loaded strategy data', async () => {
    arrangeLoadedStrategy();

    render(
      <I18nProvider>
        <StrategiesEditPage />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(getStrategyMock).toHaveBeenCalledWith('strategy-91');
    });

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb navigation' })).toBeInTheDocument();
    expect(screen.getByTestId('strategy-form')).toHaveTextContent('Trend rider');
    expect(strategyFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        formId: 'strategy-form-edit',
        submitting: false,
      })
    );
  });

  it('submits strategy updates when the backend allows the linked inactive bot path', async () => {
    arrangeLoadedStrategy();
    updateStrategyMock.mockResolvedValue({ id: 'strategy-91', name: 'Trend rider updated' });

    render(
      <I18nProvider>
        <StrategiesEditPage />
      </I18nProvider>
    );

    await screen.findByTestId('strategy-form');
    fireEvent.click(screen.getByRole('button', { name: 'submit strategy form' }));

    await waitFor(() => {
      expect(updateStrategyMock).toHaveBeenCalledWith('strategy-91', loadedForm);
    });
    expect(toast.success).toHaveBeenCalledWith('Strategy updated');
    expect(screen.queryByText('Strategy is currently used by an active bot')).not.toBeInTheDocument();
  });

  it('shows a targeted active-bot lock when the backend blocks editing', async () => {
    arrangeLoadedStrategy();
    updateStrategyMock.mockRejectedValue({
      isAxiosError: true,
      response: {
        data: {
          error: {
            message: 'strategy is used by active bot and cannot be edited',
            details: {
              botId: 'bot-active-1',
              botName: 'Strategy Guard Bot',
            },
          },
        },
      },
    });

    render(
      <I18nProvider>
        <StrategiesEditPage />
      </I18nProvider>
    );

    await screen.findByTestId('strategy-form');
    fireEvent.click(screen.getByRole('button', { name: 'submit strategy form' }));

    expect(await screen.findByText('Strategy is currently used by an active bot')).toBeInTheDocument();
    expect(screen.getByText(/Strategy Guard Bot/)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Strategy is currently used by an active bot', {
      description:
        'Stopping the runtime session is not enough. Open bot settings and switch Active off before saving strategy changes.',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Open bot settings' }));
    expect(routerPushMock).toHaveBeenCalledWith('/dashboard/bots/bot-active-1/edit');
  });
});
