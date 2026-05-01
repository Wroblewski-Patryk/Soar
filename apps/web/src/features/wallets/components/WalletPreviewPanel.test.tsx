import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { I18nProvider } from '@/i18n/I18nProvider';
import WalletPreviewPanel from './WalletPreviewPanel';

const getWalletMock = vi.hoisted(() => vi.fn());
const getWalletPerformanceSummaryMock = vi.hoisted(() => vi.fn());
const getWalletEquityTimelineMock = vi.hoisted(() => vi.fn());
const getWalletCashflowEventsMock = vi.hoisted(() => vi.fn());

vi.mock('../services/wallets.service', () => ({
  getWallet: getWalletMock,
  getWalletPerformanceSummary: getWalletPerformanceSummaryMock,
  getWalletEquityTimeline: getWalletEquityTimelineMock,
  getWalletCashflowEvents: getWalletCashflowEventsMock,
}));

describe('WalletPreviewPanel', () => {
  afterEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  const renderPreview = () => {
    window.localStorage.setItem('cryptosparrow-locale', 'en');
    window.history.pushState({}, '', '/dashboard/wallets/wallet-1/preview');
    render(
      <I18nProvider>
        <WalletPreviewPanel walletId='wallet-1' />
      </I18nProvider>
    );
  };

  it('renders wallet analytics, equity timeline and cashflow events', async () => {
    getWalletMock.mockResolvedValue({
      id: 'wallet-1',
      name: 'Main wallet',
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 0,
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 100,
      apiKeyId: 'key-1',
    });
    getWalletPerformanceSummaryMock.mockResolvedValue({
      walletId: 'wallet-1',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      completeness: 'COMPLETE',
      completenessReasons: [],
      currentAccountBalance: 16,
      currentFreeBalance: 8,
      currentAllocatedBalance: 16,
      contributedCapital: 15,
      botRealizedPnl: 0.8,
      botOpenPnl: 0.2,
      feesFunding: 0,
      botPnl: 1,
      unclassifiedAdjustment: 0,
      portfolioEquity: 16,
      walletDeltaPercent: 6.6667,
      latestSnapshotAt: '2026-04-30T10:00:00.000Z',
    });
    getWalletEquityTimelineMock.mockResolvedValue({
      walletId: 'wallet-1',
      baseCurrency: 'USDT',
      bucket: 'raw',
      completeness: 'COMPLETE',
      points: [
        {
          timestamp: '2026-04-30T09:00:00.000Z',
          portfolioEquity: 5,
          accountBalance: 5,
          freeBalance: 5,
          contributedCapital: 5,
          botRealizedPnl: 0,
          botOpenPnl: 0,
          feesFunding: 0,
          botPnl: 0,
          unclassifiedAdjustment: 0,
        },
        {
          timestamp: '2026-04-30T10:00:00.000Z',
          portfolioEquity: 16,
          accountBalance: 16,
          freeBalance: 8,
          contributedCapital: 15,
          botRealizedPnl: 0.8,
          botOpenPnl: 0.2,
          feesFunding: 0,
          botPnl: 1,
          unclassifiedAdjustment: 0,
        },
      ],
      markers: [],
    });
    getWalletCashflowEventsMock.mockResolvedValue([
      {
        id: 'event-1',
        walletId: 'wallet-1',
        direction: 'IN',
        source: 'DEPOSIT',
        amount: 10,
        currency: 'USDT',
        occurredAt: '2026-04-30T09:30:00.000Z',
        exchangeEventId: 'deposit-1',
      },
    ]);

    renderPreview();

    await waitFor(() => {
      expect(screen.getByText('Summary')).toBeInTheDocument();
    });

    expect(getWalletPerformanceSummaryMock).toHaveBeenCalledWith('wallet-1');
    expect(getWalletEquityTimelineMock).toHaveBeenCalledWith('wallet-1');
    expect(getWalletCashflowEventsMock).toHaveBeenCalledWith('wallet-1');
    expect(screen.getAllByText('16 USDT').length).toBeGreaterThan(0);
    expect(screen.getAllByText('15 USDT').length).toBeGreaterThan(0);
    expect(screen.getByText('Equity timeline')).toBeInTheDocument();
    expect(screen.getByText('Cashflow events')).toBeInTheDocument();
    expect(screen.getByText('DEPOSIT')).toBeInTheDocument();
    expect(screen.getByText('deposit-1')).toBeInTheDocument();
  });

  it('shows partial ledger state instead of hiding unclassified data', async () => {
    getWalletMock.mockResolvedValue({
      id: 'wallet-1',
      name: 'Main wallet',
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 0,
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 100,
      apiKeyId: 'key-1',
    });
    getWalletPerformanceSummaryMock.mockResolvedValue({
      walletId: 'wallet-1',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      completeness: 'PARTIAL',
      completenessReasons: ['unclassified_adjustment'],
      currentAccountBalance: 16,
      currentFreeBalance: 8,
      currentAllocatedBalance: 16,
      contributedCapital: 15,
      botRealizedPnl: 0,
      botOpenPnl: 0,
      feesFunding: 0,
      botPnl: 0,
      unclassifiedAdjustment: 1,
      portfolioEquity: 16,
      walletDeltaPercent: 0,
      latestSnapshotAt: '2026-04-30T10:00:00.000Z',
    });
    getWalletEquityTimelineMock.mockResolvedValue({
      walletId: 'wallet-1',
      baseCurrency: 'USDT',
      bucket: 'raw',
      completeness: 'PARTIAL',
      points: [],
      markers: [],
    });
    getWalletCashflowEventsMock.mockResolvedValue([]);

    renderPreview();

    await waitFor(() => {
      expect(screen.getByText('Ledger is partial')).toBeInTheDocument();
    });

    expect(screen.getByText('Unclassified adjustment')).toBeInTheDocument();
    expect(screen.getByText('1 USDT')).toBeInTheDocument();
  });

  it('fails closed when the ledger is unavailable', async () => {
    getWalletMock.mockResolvedValue({
      id: 'wallet-1',
      name: 'Main wallet',
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 0,
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 100,
      apiKeyId: 'key-1',
    });
    getWalletPerformanceSummaryMock.mockResolvedValue({
      walletId: 'wallet-1',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      completeness: 'UNAVAILABLE',
      completenessReasons: ['missing_balance_snapshot'],
      currentAccountBalance: null,
      currentFreeBalance: null,
      currentAllocatedBalance: null,
      contributedCapital: 0,
      botRealizedPnl: 0,
      botOpenPnl: 0,
      feesFunding: 0,
      botPnl: 0,
      unclassifiedAdjustment: 0,
      portfolioEquity: 0,
      walletDeltaPercent: null,
      latestSnapshotAt: null,
    });
    getWalletEquityTimelineMock.mockResolvedValue({
      walletId: 'wallet-1',
      baseCurrency: 'USDT',
      bucket: 'raw',
      completeness: 'UNAVAILABLE',
      points: [],
      markers: [],
    });
    getWalletCashflowEventsMock.mockResolvedValue([]);

    renderPreview();

    await waitFor(() => {
      expect(screen.getByText('No wallet ledger data')).toBeInTheDocument();
    });

    expect(screen.queryByText('Summary')).not.toBeInTheDocument();
    expect(screen.queryByText('Equity timeline')).not.toBeInTheDocument();
    expect(screen.queryByText('Cashflow events')).not.toBeInTheDocument();
  });
});
