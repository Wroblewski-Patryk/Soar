import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import BacktestsCreatePage from './page';
import { I18nProvider } from '@/i18n/I18nProvider';

const backtestCreateFormMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => (typeof window === 'undefined' ? '/' : window.location.pathname || '/'),
}));

vi.mock('@/features/backtest/components/BacktestCreateForm', () => ({
  default: (props: {
    formId: string;
    submitting: boolean;
    onSubmit: (payload: unknown) => Promise<void>;
  }) => {
    backtestCreateFormMock(props);
    return <div data-testid='backtest-create-form'>backtest-create</div>;
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  backtestCreateFormMock.mockReset();
});

describe('Backtests create page', () => {
  it('renders the canonical create route shell', () => {
    window.localStorage.setItem('cryptosparrow-locale', 'en');
    window.history.pushState({}, '', '/dashboard/backtests/create');

    render(
      <I18nProvider>
        <BacktestsCreatePage />
      </I18nProvider>
    );

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb navigation' })).toBeInTheDocument();
    expect(screen.getByTestId('backtest-create-form')).toBeInTheDocument();
    expect(backtestCreateFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        formId: 'backtest-form-create',
        submitting: false,
      })
    );
  });
});
