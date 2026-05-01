import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import StrategiesListPage from './page';
import { I18nProvider } from '@/i18n/I18nProvider';

const pushMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('@/features/strategies/components/StrategiesList', () => ({
  default: () => <div data-testid='strategies-list'>strategies-list</div>,
}));

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  pushMock.mockReset();
});

describe('Strategies list page', () => {
  it('renders the canonical strategies list shell and routes Create to the canonical create route', () => {
    window.localStorage.setItem('cryptosparrow-locale', 'en');
    window.history.pushState({}, '', '/dashboard/strategies/list');

    render(
      <I18nProvider>
        <StrategiesListPage />
      </I18nProvider>
    );

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb navigation' })).toBeInTheDocument();
    expect(screen.getByTestId('strategies-list')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(pushMock).toHaveBeenCalledWith('/dashboard/strategies/create');
  });
});
