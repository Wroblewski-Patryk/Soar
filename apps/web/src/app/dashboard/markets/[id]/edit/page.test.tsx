import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import MarketsEditPage from './page';
import { I18nProvider } from '@/i18n/I18nProvider';
import type { MarketUniverse } from '@/features/markets/types/marketUniverse.type';

const getMarketUniverseMock = vi.hoisted(() => vi.fn());
const marketUniverseFormMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useParams: () => ({
    id: 'market-55',
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/features/markets/services/markets.service', () => ({
  getMarketUniverse: getMarketUniverseMock,
  updateMarketUniverse: vi.fn(),
}));

vi.mock('@/features/markets/components/MarketUniverseForm', () => ({
  default: (props: {
    formId: string;
    mode: 'create' | 'edit';
    initial?: MarketUniverse;
    submitting: boolean;
    onSubmit: (payload: unknown) => Promise<void>;
  }) => {
    marketUniverseFormMock(props);
    return <div data-testid='market-universe-form'>{props.initial?.name ?? props.mode}</div>;
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  getMarketUniverseMock.mockReset();
  marketUniverseFormMock.mockReset();
});

describe('Markets edit page', () => {
  it('renders the canonical edit route shell with the loaded market universe id', async () => {
    getMarketUniverseMock.mockResolvedValue({
      id: 'market-55',
      name: 'Alpha markets',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      whitelist: ['BTCUSDT'],
      blacklist: [],
    } satisfies MarketUniverse);

    window.localStorage.setItem('cryptosparrow-locale', 'en');
    window.history.pushState({}, '', '/dashboard/markets/market-55/edit');

    render(
      <I18nProvider>
        <MarketsEditPage />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(getMarketUniverseMock).toHaveBeenCalledWith('market-55');
    });

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb navigation' })).toBeInTheDocument();
    expect(screen.getByTestId('market-universe-form')).toHaveTextContent('Alpha markets');
    expect(marketUniverseFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        formId: 'market-universe-form-edit',
        mode: 'edit',
      })
    );
  });
});
