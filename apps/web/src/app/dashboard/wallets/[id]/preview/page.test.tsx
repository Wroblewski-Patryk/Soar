import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const walletPreviewPanelMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useParams: () => ({
    id: 'wallet-789',
  }),
  usePathname: () => (typeof window === 'undefined' ? '/' : window.location.pathname || '/'),
}));

vi.mock('@/features/wallets/components/WalletPreviewPanel', () => ({
  default: ({ walletId }: { walletId: string }) => {
    walletPreviewPanelMock({ walletId });
    return <div data-testid='wallet-preview-panel'>{walletId}</div>;
  },
}));

import WalletPreviewPage from './page';
import { I18nProvider } from '@/i18n/I18nProvider';

describe('Wallet preview page', () => {
  it('renders the canonical wallet preview route with the selected wallet id', () => {
    window.localStorage.setItem('cryptosparrow-locale', 'en');
    window.history.pushState({}, '', '/dashboard/wallets/wallet-789/preview');

    render(
      <I18nProvider>
        <WalletPreviewPage />
      </I18nProvider>
    );

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb navigation' })).toBeInTheDocument();
    expect(screen.getByTestId('wallet-preview-panel')).toHaveTextContent('wallet-789');
    expect(walletPreviewPanelMock).toHaveBeenCalledWith({ walletId: 'wallet-789' });
  });
});
