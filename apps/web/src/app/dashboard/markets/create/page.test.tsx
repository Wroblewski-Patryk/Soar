import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import MarketsCreatePage from './page';
import { I18nProvider } from '@/i18n/I18nProvider';

const marketUniverseFormMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => (typeof window === 'undefined' ? '/' : window.location.pathname || '/'),
}));

vi.mock('@/features/markets/components/MarketUniverseForm', () => ({
  default: (props: {
    formId: string;
    mode: 'create' | 'edit';
    submitting: boolean;
    onSubmit: (payload: unknown) => Promise<void>;
  }) => {
    marketUniverseFormMock(props);
    return <div data-testid='market-universe-form'>{props.mode}</div>;
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  marketUniverseFormMock.mockReset();
});

describe('Markets create page', () => {
  it('renders create mode for the canonical create route shell', () => {
    window.localStorage.setItem('cryptosparrow-locale', 'en');
    window.history.pushState({}, '', '/dashboard/markets/create');

    render(
      <I18nProvider>
        <MarketsCreatePage />
      </I18nProvider>
    );

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb navigation' })).toBeInTheDocument();
    expect(screen.getByTestId('market-universe-form')).toHaveTextContent('create');
    expect(marketUniverseFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        formId: 'market-universe-form-create',
        mode: 'create',
        submitting: false,
      })
    );
  });
});
