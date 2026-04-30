import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import WalletsListTable from './WalletsListTable';
import { I18nProvider } from '@/i18n/I18nProvider';
import type { Wallet } from '../types/wallet.type';

const deleteWalletMock = vi.hoisted(() => vi.fn());
const createWalletMock = vi.hoisted(() => vi.fn());

vi.mock('../services/wallets.service', () => ({
  deleteWallet: deleteWalletMock,
  createWallet: createWalletMock,
}));

describe('WalletsListTable', () => {
  afterEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  const walletRows: Wallet[] = [
    {
      id: 'wallet-1',
      name: 'Main wallet',
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 0,
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 25,
      apiKeyId: 'key-1',
    },
    {
      id: 'wallet-2',
      name: 'Paper wallet',
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'SPOT',
      baseCurrency: 'USDT',
      paperInitialBalance: 10_000,
      liveAllocationMode: null,
      liveAllocationValue: null,
      apiKeyId: null,
    },
  ];

  const renderTable = (onDeleted = vi.fn(), onCloned = vi.fn(), rows: Wallet[] = walletRows) => {
    window.localStorage.setItem('cryptosparrow-locale', 'en');
    window.history.pushState({}, '', '/dashboard/wallets');
    render(
      <I18nProvider>
        <WalletsListTable
          rows={rows}
          onDeleted={onDeleted}
          onCloned={onCloned}
        />
      </I18nProvider>
    );

    return { onDeleted, onCloned };
  };

  it('shows inline API key column and removes Details action/row contract', async () => {
    renderTable();

    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'API key' })).toBeInTheDocument();
    });
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Not connected')).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Details' })).not.toBeInTheDocument();
    expect(screen.queryByText('Allocation mode:')).not.toBeInTheDocument();
  });

  it('clones wallet using create contract payload and appends clone-marked name', async () => {
    const onCloned = vi.fn();
    createWalletMock.mockResolvedValue({
      id: 'wallet-clone-1',
      name: 'Main wallet (clone)',
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 0,
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 25,
      apiKeyId: 'key-1',
    });

    renderTable(vi.fn(), onCloned);

    const mainWalletRow = screen.getByText('Main wallet').closest('tr');
    expect(mainWalletRow).not.toBeNull();
    const cloneButton = mainWalletRow?.querySelector('button[aria-label="Clone"]');
    expect(cloneButton).not.toBeNull();
    fireEvent.click(cloneButton as HTMLButtonElement);

    await waitFor(() => {
      expect(createWalletMock).toHaveBeenCalledWith({
        name: 'Main wallet (clone)',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 0,
        liveAllocationMode: 'PERCENT',
        liveAllocationValue: 25,
        apiKeyId: 'key-1',
      });
      expect(onCloned).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'wallet-clone-1', name: 'Main wallet (clone)' })
      );
    });
  });
});
