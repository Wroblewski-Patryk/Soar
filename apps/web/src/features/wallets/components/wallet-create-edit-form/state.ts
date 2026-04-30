import {
  DEFAULT_BASE_CURRENCY,
  DEFAULT_EXCHANGE,
  DEFAULT_MARKET_TYPE,
  EXCHANGE_MARKET_TYPES,
  type ExchangeMarketType,
} from '@cryptosparrow/shared';

import type { ExchangeOption } from '@/features/exchanges/exchangeCapabilities';
import {
  hasFormText,
  normalizeFormBaseCurrency,
  normalizeFormSymbol,
  normalizeFormText,
} from '@/lib/forms';
import { normalizeSymbol } from '@/lib/symbols';

import type {
  CreateWalletInput,
  Wallet,
  WalletAllocationMode,
  WalletBalancePreview,
  WalletMetadata,
  WalletMode,
} from '../../types/wallet.type';

export type WalletFormState = {
  name: string;
  mode: WalletMode;
  exchange: ExchangeOption;
  marketType: ExchangeMarketType;
  baseCurrency: string;
  paperInitialBalance: number;
  liveAllocationMode: WalletAllocationMode;
  liveAllocationValue: number;
  apiKeyId: string;
};

export type WalletMarketType = WalletFormState['marketType'];
export type WalletMarketTypeMetadata = WalletMetadata['byMarketType'][WalletMarketType];

export const DEFAULT_MARKET_TYPE_OPTIONS: WalletMarketType[] = [...EXCHANGE_MARKET_TYPES];
export const DEFAULT_MARKET_TYPE_METADATA: Record<WalletMarketType, WalletMarketTypeMetadata> = {
  FUTURES: {
    marketType: 'FUTURES',
    baseCurrency: DEFAULT_BASE_CURRENCY,
    baseCurrencies: [DEFAULT_BASE_CURRENCY],
    source: 'EXCHANGE_CAPABILITIES',
  },
  SPOT: {
    marketType: 'SPOT',
    baseCurrency: DEFAULT_BASE_CURRENCY,
    baseCurrencies: [DEFAULT_BASE_CURRENCY],
    source: 'EXCHANGE_CAPABILITIES',
  },
};

export const buildDefaultForm = (): WalletFormState => ({
  name: '',
  mode: 'PAPER',
  exchange: DEFAULT_EXCHANGE,
  marketType: DEFAULT_MARKET_TYPE,
  baseCurrency: DEFAULT_BASE_CURRENCY,
  paperInitialBalance: 10_000,
  liveAllocationMode: 'PERCENT',
  liveAllocationValue: 100,
  apiKeyId: '',
});

export const mapWalletToForm = (wallet: Wallet): WalletFormState => ({
  name: wallet.name,
  mode: wallet.mode,
  exchange: wallet.exchange,
  marketType: wallet.marketType,
  baseCurrency: normalizeFormBaseCurrency(wallet.baseCurrency),
  paperInitialBalance: wallet.paperInitialBalance,
  liveAllocationMode: wallet.liveAllocationMode ?? 'PERCENT',
  liveAllocationValue: wallet.liveAllocationValue ?? 100,
  apiKeyId: wallet.apiKeyId ?? '',
});

export const toPayload = (form: WalletFormState): CreateWalletInput => {
  const baseCurrency = normalizeFormBaseCurrency(form.baseCurrency);

  if (form.mode === 'PAPER') {
    return {
      name: normalizeFormText(form.name),
      mode: form.mode,
      exchange: form.exchange,
      marketType: form.marketType,
      baseCurrency,
      paperInitialBalance: form.paperInitialBalance,
      liveAllocationMode: null,
      liveAllocationValue: null,
      apiKeyId: null,
    };
  }

  return {
    name: normalizeFormText(form.name),
    mode: form.mode,
    exchange: form.exchange,
    marketType: form.marketType,
    baseCurrency,
    paperInitialBalance: form.paperInitialBalance,
    liveAllocationMode: form.liveAllocationMode,
    liveAllocationValue: form.liveAllocationValue,
    apiKeyId: form.apiKeyId || null,
  };
};

export const getWalletFieldErrors = (
  form: WalletFormState,
  walletText: (key: string) => string
): Partial<Record<keyof WalletFormState, string>> => {
  const errors: Partial<Record<keyof WalletFormState, string>> = {};

  if (!hasFormText(form.name)) {
    errors.name = walletText('validationName');
  }
  if (!normalizeFormSymbol(form.baseCurrency)) {
    errors.baseCurrency = walletText('validationBaseCurrency');
  }

  if (form.mode === 'LIVE') {
    if (!form.apiKeyId) {
      errors.apiKeyId = walletText('validationApiKey');
    }
    if (!Number.isFinite(form.liveAllocationValue) || form.liveAllocationValue <= 0) {
      errors.liveAllocationValue = walletText('validationAllocationValue');
    } else if (form.liveAllocationMode === 'PERCENT' && form.liveAllocationValue > 100) {
      errors.liveAllocationValue = walletText('validationAllocationPercent');
    }
  }

  return errors;
};

export const resolveBaseCurrencyOptions = (
  activeMarketTypeMetadata: WalletMarketTypeMetadata,
  currentBaseCurrency: string
) => {
  const current = normalizeFormSymbol(currentBaseCurrency);
  const options = [
    ...new Set([...(activeMarketTypeMetadata.baseCurrencies ?? []).map(normalizeSymbol), current].filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));

  return options.length > 0 ? options : [DEFAULT_BASE_CURRENCY];
};

export const resolvePreviewReferenceBalance = (
  form: WalletFormState,
  preview: WalletBalancePreview | null
) => {
  if (!preview) return null;
  if (form.liveAllocationMode === 'PERCENT') {
    const percent = Math.max(0, Math.min(100, form.liveAllocationValue || 0));
    return preview.accountBalance * (percent / 100);
  }
  if (form.liveAllocationMode === 'FIXED') {
    return Math.min(preview.accountBalance, Math.max(0, form.liveAllocationValue || 0));
  }
  return preview.referenceBalance;
};

export const formatAmount = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ` ${normalizeSymbol(currency)}`;
