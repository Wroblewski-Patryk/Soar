import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import StrategiesEditPage from './page';
import { I18nProvider } from '@/i18n/I18nProvider';
import type { StrategyDto, StrategyFormState } from '@/features/strategies/types/StrategyForm.type';

const getStrategyMock = vi.hoisted(() => vi.fn());
const dtoToFormMock = vi.hoisted(() => vi.fn());
const strategyFormMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useParams: () => ({
    id: 'strategy-91',
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => (typeof window === 'undefined' ? '/' : window.location.pathname || '/'),
}));

vi.mock('@/features/strategies/api/strategies.api', () => ({
  getStrategy: getStrategyMock,
  updateStrategy: vi.fn(),
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
    return <div data-testid='strategy-form'>{props.initial?.name ?? 'strategy-form'}</div>;
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  getStrategyMock.mockReset();
  dtoToFormMock.mockReset();
  strategyFormMock.mockReset();
});

describe('Strategies edit page', () => {
  it('renders the canonical edit route shell with loaded strategy data', async () => {
    getStrategyMock.mockResolvedValue({
      id: 'strategy-91',
      name: 'Trend rider',
      description: 'desc',
      leverage: 3,
      interval: '1h',
      createdAt: '2026-05-01T00:00:00.000Z',
    } satisfies StrategyDto);
    dtoToFormMock.mockReturnValue({
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
    } satisfies StrategyFormState);

    window.localStorage.setItem('cryptosparrow-locale', 'en');
    window.history.pushState({}, '', '/dashboard/strategies/strategy-91/edit');

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
});
