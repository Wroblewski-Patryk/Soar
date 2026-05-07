import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import MarketsListPage from './page';
import { I18nProvider } from '@/i18n/I18nProvider';
import type { MarketUniverse } from '@/features/markets/types/marketUniverse.type';

const pushMock = vi.hoisted(() => vi.fn());
const listMarketUniversesMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => (typeof window === 'undefined' ? '/' : window.location.pathname || '/'),
}));

vi.mock('@/features/markets/services/markets.service', () => ({
  listMarketUniverses: listMarketUniversesMock,
}));

vi.mock('@/features/markets/components/MarketUniversesTable', () => ({
  default: ({ rows }: { rows: MarketUniverse[] }) => <div data-testid='markets-list-table'>{rows.length}</div>,
}));

const renderWithI18n = () => {
  window.localStorage.setItem('cryptosparrow-locale', 'en');
  window.history.pushState({}, '', '/dashboard/markets/list');

  return render(
    <I18nProvider>
      <MarketsListPage />
    </I18nProvider>
  );
};

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  pushMock.mockReset();
  listMarketUniversesMock.mockReset();
});

describe('Markets list page', () => {
  it('renders the canonical list route shell and wires Create to the canonical create route', async () => {
    listMarketUniversesMock.mockResolvedValue([
      {
        id: 'market-1',
        name: 'Momentum futures',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      } satisfies MarketUniverse,
    ]);

    renderWithI18n();

    await waitFor(() => {
      expect(listMarketUniversesMock).toHaveBeenCalledTimes(1);
    });

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb navigation' })).toBeInTheDocument();
    expect(screen.getByTestId('markets-list-table')).toHaveTextContent('1');

    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(pushMock).toHaveBeenCalledWith('/dashboard/markets/create');
  });
});
