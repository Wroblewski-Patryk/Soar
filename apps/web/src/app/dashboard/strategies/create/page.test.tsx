import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import StrategiesCreatePage from './page';
import { I18nProvider } from '@/i18n/I18nProvider';

const strategyFormMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/features/strategies/components/StrategyForm', () => ({
  default: (props: {
    formId: string;
    submitting: boolean;
    onSubmit: (payload: unknown) => Promise<void>;
  }) => {
    strategyFormMock(props);
    return <div data-testid='strategy-form'>strategy-form</div>;
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  strategyFormMock.mockReset();
});

describe('Strategies create page', () => {
  it('renders the canonical create route shell', () => {
    window.localStorage.setItem('cryptosparrow-locale', 'en');
    window.history.pushState({}, '', '/dashboard/strategies/create');

    render(
      <I18nProvider>
        <StrategiesCreatePage />
      </I18nProvider>
    );

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb navigation' })).toBeInTheDocument();
    expect(screen.getByTestId('strategy-form')).toBeInTheDocument();
    expect(strategyFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        formId: 'strategy-form-create',
        submitting: false,
      })
    );
  });
});
