import type { ApiKey } from '@/features/profile/types/apiKey.type';
import { executeWithRetry, isRetriableHttpError } from '@/lib/async';
import { normalizeFormBaseCurrency } from '@/lib/forms';

import {
  fetchWalletMetadata,
  getWallet,
  previewWalletBalance,
  resetPaperWallet,
} from '../../services/wallets.service';
import type { Wallet, WalletMetadata } from '../../types/wallet.type';
import type { WalletFormState } from './state';

const RETRY_OPTIONS = {
  maxAttempts: 2,
  retryDelayMs: 250,
  shouldRetry: isRetriableHttpError,
} as const;

export const loadWalletRecord = (walletId: string) =>
  executeWithRetry(() => getWallet(walletId), RETRY_OPTIONS);

export const loadWalletMetadataCatalog = (exchange: WalletFormState['exchange']) =>
  executeWithRetry(
    () =>
      fetchWalletMetadata({
        exchange,
      }),
    RETRY_OPTIONS
  ) as Promise<WalletMetadata>;

export const loadWalletBalancePreview = (form: WalletFormState) =>
  executeWithRetry(
    () =>
      previewWalletBalance({
        exchange: form.exchange,
        marketType: form.marketType,
        baseCurrency: normalizeFormBaseCurrency(form.baseCurrency),
        apiKeyId: form.apiKeyId,
      }),
    RETRY_OPTIONS
  );

export const runPaperWalletReset = (walletId: string) =>
  executeWithRetry(() => resetPaperWallet(walletId), RETRY_OPTIONS);

export type WalletInitialData = {
  apiKeys: ApiKey[];
  wallet: Wallet | null;
};
