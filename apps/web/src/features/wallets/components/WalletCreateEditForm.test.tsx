import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import WalletCreateEditForm from './WalletCreateEditForm';

const replaceMock = vi.hoisted(() => vi.fn());
const fetchApiKeysMock = vi.hoisted(() => vi.fn());
const createWalletMock = vi.hoisted(() => vi.fn());
const getWalletMock = vi.hoisted(() => vi.fn());
const updateWalletMock = vi.hoisted(() => vi.fn());
const previewWalletBalanceMock = vi.hoisted(() => vi.fn());
const fetchWalletMetadataMock = vi.hoisted(() => vi.fn());
const resetPaperWalletMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

vi.mock('@/i18n/I18nProvider', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/i18n/I18nProvider')>();
  return {
    ...actual,
    useI18n: () => ({
      locale: 'pl' as const,
      t: (key: string) => key,
      timeZone: 'UTC',
      timeZonePreference: 'auto',
      setLocale: vi.fn(),
      setTimeZonePreference: vi.fn(),
    }),
  };
});

vi.mock('@/features/profile/services/apiKeys.service', () => ({
  fetchApiKeys: fetchApiKeysMock,
}));

vi.mock('../services/wallets.service', () => ({
  createWallet: createWalletMock,
  getWallet: getWalletMock,
  updateWallet: updateWalletMock,
  previewWalletBalance: previewWalletBalanceMock,
  fetchWalletMetadata: fetchWalletMetadataMock,
  resetPaperWallet: resetPaperWalletMock,
}));

describe('WalletCreateEditForm', () => {
  beforeEach(() => {
    replaceMock.mockReset();
    fetchApiKeysMock.mockReset();
    createWalletMock.mockReset();
    getWalletMock.mockReset();
    updateWalletMock.mockReset();
    previewWalletBalanceMock.mockReset();
    fetchWalletMetadataMock.mockReset();
    resetPaperWalletMock.mockReset();
    previewWalletBalanceMock.mockResolvedValue({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      accountBalance: 100,
      freeBalance: 98.5,
      referenceBalance: 100,
      allocationApplied: null,
      fetchedAt: '2026-04-10T12:00:00.000Z',
      source: 'BINANCE',
    });
    fetchWalletMetadataMock.mockResolvedValue({
      exchange: 'BINANCE',
      marketTypes: ['FUTURES', 'SPOT'],
      marketType: 'FUTURES',
      baseCurrencies: ['USDT', 'USDC'],
      baseCurrency: 'USDT',
      source: 'MARKET_CATALOG',
      byMarketType: {
        FUTURES: {
          marketType: 'FUTURES',
          baseCurrencies: ['USDT', 'USDC'],
          baseCurrency: 'USDT',
          source: 'MARKET_CATALOG',
        },
        SPOT: {
          marketType: 'SPOT',
          baseCurrencies: ['USDT', 'USDC', 'EUR'],
          baseCurrency: 'USDT',
          source: 'MARKET_CATALOG',
        },
      },
    });
  });

  it('loads live balance preview for selected API key in LIVE mode', async () => {
    fetchApiKeysMock.mockResolvedValue([
      {
        id: 'key-1',
        label: 'Main Binance Key',
        exchange: 'BINANCE',
      },
    ]);
    previewWalletBalanceMock.mockResolvedValue({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      accountBalance: 100,
      freeBalance: 98.5,
      referenceBalance: 100,
      allocationApplied: null,
      fetchedAt: '2026-04-10T12:00:00.000Z',
      source: 'BINANCE',
    });

    render(<WalletCreateEditForm />);

    await waitFor(() => {
      expect(fetchApiKeysMock).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole('radio', { name: 'LIVE' }));

    await waitFor(() => {
      expect(previewWalletBalanceMock).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKeyId: 'key-1',
          exchange: 'BINANCE',
        })
      );
    });

    expect(screen.getByText('Saldo konta')).toBeInTheDocument();
    expect(screen.getAllByText('100.00 USDT').length).toBeGreaterThan(0);
  });

  it('shows validation helper and blocks submit when name is missing', async () => {
    fetchApiKeysMock.mockResolvedValue([]);
    createWalletMock.mockResolvedValue({
      id: 'wallet-1',
    });

    const { container } = render(<WalletCreateEditForm />);

    await waitFor(() => {
      expect(fetchApiKeysMock).toHaveBeenCalled();
    });

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    expect(createWalletMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('form-validation-summary')).toBeInTheDocument();
    expect(screen.getAllByText('Podaj nazwe portfela.').length).toBeGreaterThan(0);
  });

  it('renders only mode-relevant fields when switching between LIVE and PAPER', async () => {
    fetchApiKeysMock.mockResolvedValue([
      {
        id: 'key-1',
        label: 'Main Binance Key',
        exchange: 'BINANCE',
      },
    ]);
    previewWalletBalanceMock.mockResolvedValue({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      accountBalance: 100,
      freeBalance: 98.5,
      referenceBalance: 100,
      allocationApplied: null,
      fetchedAt: '2026-04-10T12:00:00.000Z',
      source: 'BINANCE',
    });
    createWalletMock.mockResolvedValue({
      id: 'wallet-paper',
    });

    const { container } = render(<WalletCreateEditForm />);

    await waitFor(() => {
      expect(fetchApiKeysMock).toHaveBeenCalled();
    });

    expect(screen.getByLabelText('Kwota startowa paper')).toBeInTheDocument();
    expect(screen.queryByLabelText('Wartosc limitu LIVE')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: 'LIVE' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Wartosc limitu LIVE')).toBeInTheDocument();
    });
    expect(screen.queryByLabelText('Kwota startowa paper')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: 'PAPER' }));
    expect(screen.getByLabelText('Kwota startowa paper')).toBeInTheDocument();
    expect(screen.queryByLabelText('Wartosc limitu LIVE')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Nazwa'), {
      target: { value: 'Paper Wallet' },
    });

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() => {
      expect(createWalletMock).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'PAPER',
          liveAllocationMode: null,
          liveAllocationValue: null,
          apiKeyId: null,
          manageExternalPositions: false,
        })
      );
    });
  });

  it('submits LIVE wallet with external takeover toggle enabled', async () => {
    fetchApiKeysMock.mockResolvedValue([
      {
        id: 'key-1',
        label: 'Main Binance Key',
        exchange: 'BINANCE',
      },
    ]);
    previewWalletBalanceMock.mockResolvedValue({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      accountBalance: 100,
      freeBalance: 98.5,
      referenceBalance: 100,
      allocationApplied: null,
      fetchedAt: '2026-04-10T12:00:00.000Z',
      source: 'BINANCE',
    });
    createWalletMock.mockResolvedValue({
      id: 'wallet-live',
    });

    const { container } = render(<WalletCreateEditForm />);

    await waitFor(() => {
      expect(fetchApiKeysMock).toHaveBeenCalled();
    });

    fireEvent.change(screen.getByLabelText('Nazwa'), {
      target: { value: 'Live Wallet' },
    });

    fireEvent.click(screen.getByRole('radio', { name: 'LIVE' }));

    const takeoverToggle = await screen.findByLabelText('Przejmuj pozycje otwarte poza aplikacja');
    fireEvent.click(takeoverToggle);

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() => {
      expect(createWalletMock).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'LIVE',
          apiKeyId: 'key-1',
          manageExternalPositions: true,
        })
      );
    });
  });

  it('uses wallet metadata endpoint to resolve market type options', async () => {
    fetchApiKeysMock.mockResolvedValue([]);
    fetchWalletMetadataMock.mockResolvedValue({
      exchange: 'COINBASE',
      marketTypes: ['SPOT'],
      marketType: 'SPOT',
      baseCurrencies: ['USD', 'USDC'],
      baseCurrency: 'USD',
      source: 'EXCHANGE_CAPABILITIES',
      byMarketType: {
        FUTURES: {
          marketType: 'FUTURES',
          baseCurrencies: ['USDT'],
          baseCurrency: 'USDT',
          source: 'EXCHANGE_CAPABILITIES',
        },
        SPOT: {
          marketType: 'SPOT',
          baseCurrencies: ['USD', 'USDC'],
          baseCurrency: 'USD',
          source: 'EXCHANGE_CAPABILITIES',
        },
      },
    });

    render(<WalletCreateEditForm />);

    await waitFor(() => {
      expect(fetchApiKeysMock).toHaveBeenCalled();
    });

    fireEvent.change(screen.getByLabelText('Gielda'), {
      target: { value: 'COINBASE' },
    });

    await waitFor(() => {
      expect(fetchWalletMetadataMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ exchange: 'COINBASE' })
      );
    });

    const marketTypeSelect = screen.getByLabelText('Rynek');
    const marketTypeOptions = Array.from(marketTypeSelect.querySelectorAll('option')).map((option) => option.value);
    expect(marketTypeOptions).toEqual(['SPOT']);

    const baseCurrencySelect = screen.getByLabelText('Waluta bazowa');
    const baseCurrencyOptions = Array.from(baseCurrencySelect.querySelectorAll('option')).map((option) => option.value);
    expect(baseCurrencyOptions).toEqual(expect.arrayContaining(['USD', 'USDC']));
  });

  it('shows reset action only for PAPER wallet edit and hides it for LIVE wallet edit', async () => {
    fetchApiKeysMock.mockResolvedValue([
      {
        id: 'key-1',
        label: 'Main Binance Key',
        exchange: 'BINANCE',
      },
    ]);

    getWalletMock.mockResolvedValueOnce({
      id: 'wallet-paper',
      name: 'Paper Wallet',
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 10_000,
      liveAllocationMode: null,
      liveAllocationValue: null,
      apiKeyId: null,
      manageExternalPositions: false,
      paperResetAt: null,
    });

    const { rerender } = render(<WalletCreateEditForm editId='wallet-paper' />);

    await waitFor(() => {
      expect(getWalletMock).toHaveBeenCalledWith('wallet-paper');
    });
    expect(screen.getByRole('button', { name: 'Resetuj portfel PAPER' })).toBeInTheDocument();

    getWalletMock.mockResolvedValueOnce({
      id: 'wallet-live',
      name: 'Live Wallet',
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 10_000,
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 25,
      apiKeyId: 'key-1',
      manageExternalPositions: false,
      paperResetAt: null,
    });

    rerender(<WalletCreateEditForm editId='wallet-live' />);

    await waitFor(() => {
      expect(getWalletMock).toHaveBeenCalledWith('wallet-live');
    });
    expect(screen.queryByRole('button', { name: 'Resetuj portfel PAPER' })).not.toBeInTheDocument();
  });

  it('handles paper reset action states: confirm, loading and success timestamp', async () => {
    fetchApiKeysMock.mockResolvedValue([]);

    getWalletMock
      .mockResolvedValueOnce({
        id: 'wallet-paper',
        name: 'Paper Wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
        liveAllocationMode: null,
        liveAllocationValue: null,
        apiKeyId: null,
        manageExternalPositions: false,
        paperResetAt: null,
      })
      .mockResolvedValueOnce({
        id: 'wallet-paper',
        name: 'Paper Wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
        liveAllocationMode: null,
        liveAllocationValue: null,
        apiKeyId: null,
        manageExternalPositions: false,
        paperResetAt: '2026-04-20T12:00:00.000Z',
      });

    let finishReset: (() => void) | undefined;
    resetPaperWalletMock.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        finishReset = () => resolve();
      })
    );

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<WalletCreateEditForm editId='wallet-paper' />);

    await waitFor(() => {
      expect(getWalletMock).toHaveBeenCalledWith('wallet-paper');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Resetuj portfel PAPER' }));

    expect(confirmSpy).toHaveBeenCalled();
    expect(resetPaperWalletMock).toHaveBeenCalledWith('wallet-paper');
    expect(screen.getByRole('button', { name: 'Resetowanie...' })).toBeDisabled();

    finishReset?.();

    await waitFor(() => {
      expect(screen.getByText(/Ostatni reset:/)).toBeInTheDocument();
    });

    confirmSpy.mockRestore();
  });

  it('shows reset error text when paper reset request fails', async () => {
    fetchApiKeysMock.mockResolvedValue([]);
    getWalletMock.mockResolvedValue({
      id: 'wallet-paper',
      name: 'Paper Wallet',
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 10_000,
      liveAllocationMode: null,
      liveAllocationValue: null,
      apiKeyId: null,
      manageExternalPositions: false,
      paperResetAt: null,
    });
    resetPaperWalletMock.mockRejectedValue(new Error('reset failed'));

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<WalletCreateEditForm editId='wallet-paper' />);

    await waitFor(() => {
      expect(getWalletMock).toHaveBeenCalledWith('wallet-paper');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Resetuj portfel PAPER' }));

    await waitFor(() => {
      expect(screen.getByText('reset failed')).toBeInTheDocument();
    });

    confirmSpy.mockRestore();
  });
});
