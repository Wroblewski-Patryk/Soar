import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import BacktestsListPage from './page';
import { I18nProvider } from '@/i18n/I18nProvider';

const pushMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('@/features/backtest/components/BacktestsListView', () => ({
  default: () => <div data-testid='backtests-list-view'>backtests-list</div>,
}));

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  pushMock.mockReset();
});

describe('Backtests list page', () => {
  it('renders the canonical list route shell and routes Create to the canonical create route', () => {
    window.localStorage.setItem('cryptosparrow-locale', 'en');
    window.history.pushState({}, '', '/dashboard/backtests/list');

    render(
      <I18nProvider>
        <BacktestsListPage />
      </I18nProvider>
    );

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb navigation' })).toBeInTheDocument();
    expect(screen.getByTestId('backtests-list-view')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(pushMock).toHaveBeenCalledWith('/dashboard/backtests/create');
  });
});
