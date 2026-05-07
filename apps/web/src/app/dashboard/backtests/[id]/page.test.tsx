import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import BacktestsDetailsPage from './page';
import { I18nProvider } from '@/i18n/I18nProvider';

const backtestRunDetailsMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useParams: () => ({
    id: 'backtest-42',
  }),
  usePathname: () => (typeof window === 'undefined' ? '/' : window.location.pathname || '/'),
}));

vi.mock('@/features/backtest/components/BacktestRunDetails', () => ({
  default: ({ runId }: { runId: string }) => {
    backtestRunDetailsMock({ runId });
    return <div data-testid='backtest-run-details'>{runId}</div>;
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  backtestRunDetailsMock.mockReset();
});

describe('Backtests details page', () => {
  it('renders the canonical details route shell with the selected run id', () => {
    window.localStorage.setItem('cryptosparrow-locale', 'en');
    window.history.pushState({}, '', '/dashboard/backtests/backtest-42');

    render(
      <I18nProvider>
        <BacktestsDetailsPage />
      </I18nProvider>
    );

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb navigation' })).toBeInTheDocument();
    expect(screen.getByTestId('backtest-run-details')).toHaveTextContent('backtest-42');
    expect(backtestRunDetailsMock).toHaveBeenCalledWith({ runId: 'backtest-42' });
  });
});
