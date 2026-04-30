'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { useI18n } from '@/i18n/I18nProvider';
import {
  EXCHANGE_OPTIONS,
  supportsExchangeCapability,
} from '@/features/exchanges/exchangeCapabilities';
import { fetchApiKeys } from '@/features/profile/services/apiKeys.service';
import type { ApiKey } from '@/features/profile/types/apiKey.type';
import { ErrorState, LoadingState } from '@/ui/components/ViewState';
import {
  FormAlert,
  focusFirstInvalidField,
  FormValidationSummary,
  toValidationSummaryErrors,
} from '@/ui/forms';
import {
  normalizeFormSymbol,
  resolveFormErrorMessage,
} from '@/lib/forms';
import {
  executeWithRetry,
  isRetriableHttpError,
  runAsyncWithState,
  runAsyncWithViewState,
} from '@/lib/async';
import {
  createWallet,
  updateWallet,
} from '../services/wallets.service';
import type {
  CreateWalletInput,
  WalletAllocationMode,
  WalletBalancePreview,
} from '../types/wallet.type';
import {
  loadWalletBalancePreview,
  loadWalletMetadataCatalog,
  loadWalletRecord,
  runPaperWalletReset,
} from './wallet-create-edit-form/actions';
import {
  buildDefaultForm,
  DEFAULT_MARKET_TYPE_METADATA,
  DEFAULT_MARKET_TYPE_OPTIONS,
  getWalletFieldErrors,
  mapWalletToForm,
  resolveBaseCurrencyOptions,
  resolvePreviewReferenceBalance,
  toPayload,
  type WalletFormState,
  type WalletMarketType,
  type WalletMarketTypeMetadata,
} from './wallet-create-edit-form/state';
import {
  WalletBasicsSection,
  WalletLiveSection,
  WalletPaperSection,
  WalletPreviewSection,
  WalletSummarySection,
} from './wallet-create-edit-form/sections';

type WalletCreateEditFormProps = {
  editId?: string | null;
  formId?: string;
  onSubmittingChange?: (submitting: boolean) => void;
};

export default function WalletCreateEditForm({
  editId = null,
  formId = 'wallet-form',
  onSubmittingChange,
}: WalletCreateEditFormProps) {
  const { t } = useI18n();
  const router = useRouter();
  const isEditMode = Boolean(editId);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [form, setForm] = useState<WalletFormState>(buildDefaultForm());
  const [marketTypeOptions, setMarketTypeOptions] = useState<WalletMarketType[]>(DEFAULT_MARKET_TYPE_OPTIONS);
  const [marketTypeMetadataByType, setMarketTypeMetadataByType] = useState<
    Record<WalletMarketType, WalletMarketTypeMetadata>
  >(DEFAULT_MARKET_TYPE_METADATA);
  const [walletMetadataLoading, setWalletMetadataLoading] = useState(false);
  const [walletMetadataError, setWalletMetadataError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [preview, setPreview] = useState<WalletBalancePreview | null>(null);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [lastResetAt, setLastResetAt] = useState<string | null>(null);

  useEffect(() => {
    onSubmittingChange?.(submitting);
  }, [onSubmittingChange, submitting]);

  const walletText = useCallback((key: string) => t(`dashboard.wallets.form.${key}`), [t]);

  const loadData = useCallback(async () => {
    try {
      await runAsyncWithViewState({
        setPending: setLoading,
        setError,
        clearErrorValue: null,
        resolveError: (err) => resolveFormErrorMessage(err, walletText('loadError')),
        operation: async () => {
          const keys = await executeWithRetry(() => fetchApiKeys(), {
            maxAttempts: 2,
            retryDelayMs: 250,
            shouldRetry: isRetriableHttpError,
          }).catch(() => [] as ApiKey[]);
          setApiKeys(keys);

          if (isEditMode && editId) {
            const wallet = await loadWalletRecord(editId);
            setForm(mapWalletToForm(wallet));
            setLastResetAt(wallet.paperResetAt ?? null);
          } else {
            setForm(buildDefaultForm());
            setLastResetAt(null);
          }

          setPreview(null);
          setPreviewError(null);
          setResetError(null);
          setShowValidation(false);
        },
      });
    } catch {}
  }, [editId, isEditMode, walletText]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    let cancelled = false;

    const loadWalletMetadata = async () => {
      setWalletMetadataLoading(true);
      setWalletMetadataError(null);
      try {
        const metadata = await loadWalletMetadataCatalog(form.exchange);
        if (cancelled) return;

        const nextMarketTypes =
          metadata.marketTypes.length > 0 ? metadata.marketTypes : DEFAULT_MARKET_TYPE_OPTIONS;
        const nextMetadataByType: Record<WalletMarketType, WalletMarketTypeMetadata> = {
          FUTURES: metadata.byMarketType.FUTURES ?? DEFAULT_MARKET_TYPE_METADATA.FUTURES,
          SPOT: metadata.byMarketType.SPOT ?? DEFAULT_MARKET_TYPE_METADATA.SPOT,
        };

        setMarketTypeOptions(nextMarketTypes);
        setMarketTypeMetadataByType(nextMetadataByType);

        setForm((prev) => {
          const nextMarketType = nextMarketTypes.includes(prev.marketType)
            ? prev.marketType
            : (metadata.marketType as WalletMarketType);
          const nextMarketMetadata =
            nextMetadataByType[nextMarketType] ?? DEFAULT_MARKET_TYPE_METADATA[nextMarketType];
          const normalizedOptions = [...new Set((nextMarketMetadata.baseCurrencies ?? []).map(normalizeFormSymbol).filter(Boolean))];
          const options = normalizedOptions.length > 0 ? normalizedOptions : ['USDT'];
          const defaultBase =
            normalizeFormSymbol(nextMarketMetadata.baseCurrency) || options[0] || 'USDT';
          const normalizedCurrent = normalizeFormSymbol(prev.baseCurrency);
          const nextBase = options.includes(normalizedCurrent) ? normalizedCurrent : defaultBase;

          if (
            prev.marketType === nextMarketType &&
            normalizedCurrent === nextBase &&
            prev.baseCurrency === nextBase
          ) {
            return prev;
          }

          return { ...prev, marketType: nextMarketType, baseCurrency: nextBase };
        });
      } catch (err) {
        if (cancelled) return;
        setMarketTypeOptions(DEFAULT_MARKET_TYPE_OPTIONS);
        setMarketTypeMetadataByType(DEFAULT_MARKET_TYPE_METADATA);
        setWalletMetadataError(resolveFormErrorMessage(err, walletText('baseCurrencyCatalogError')));
      } finally {
        if (!cancelled) {
          setWalletMetadataLoading(false);
        }
      }
    };

    void loadWalletMetadata();

    return () => {
      cancelled = true;
    };
  }, [form.exchange, walletText]);

  const activeMarketTypeMetadata = useMemo(
    () => marketTypeMetadataByType[form.marketType] ?? DEFAULT_MARKET_TYPE_METADATA[form.marketType],
    [form.marketType, marketTypeMetadataByType]
  );

  useEffect(() => {
    const normalizedOptions = [...new Set((activeMarketTypeMetadata.baseCurrencies ?? []).map(normalizeFormSymbol).filter(Boolean))];
    const options = normalizedOptions.length > 0 ? normalizedOptions : ['USDT'];
    const defaultBase =
      normalizeFormSymbol(activeMarketTypeMetadata.baseCurrency) || options[0] || 'USDT';

    setForm((prev) => {
      if (prev.marketType !== form.marketType) return prev;
      const normalizedCurrent = normalizeFormSymbol(prev.baseCurrency);
      const nextBase = options.includes(normalizedCurrent) ? normalizedCurrent : defaultBase;
      if (normalizedCurrent === nextBase && prev.baseCurrency === nextBase) return prev;
      return { ...prev, baseCurrency: nextBase };
    });
  }, [activeMarketTypeMetadata, form.marketType]);

  const resolvedBaseCurrencyOptions = useMemo(
    () => resolveBaseCurrencyOptions(activeMarketTypeMetadata, form.baseCurrency),
    [activeMarketTypeMetadata, form.baseCurrency]
  );

  const compatibleApiKeys = useMemo(
    () => apiKeys.filter((item) => item.exchange === form.exchange),
    [apiKeys, form.exchange]
  );

  const exchangeOptions = useMemo(
    () => EXCHANGE_OPTIONS.map((exchange) => ({ value: exchange, label: exchange })),
    []
  );
  const marketTypeSelectOptions = useMemo(
    () => marketTypeOptions.map((marketType) => ({ value: marketType, label: marketType })),
    [marketTypeOptions]
  );
  const baseCurrencyOptions = useMemo(
    () => resolvedBaseCurrencyOptions.map((currency) => ({ value: currency, label: currency })),
    [resolvedBaseCurrencyOptions]
  );
  const liveAllocationModeOptions = useMemo(
    () => [
      { value: 'PERCENT', label: '%' },
      { value: 'FIXED', label: normalizeFormSymbol(form.baseCurrency) || 'USDT' },
    ],
    [form.baseCurrency]
  );
  const modeOptions = useMemo(
    () => [
      { value: 'PAPER', label: walletText('modePaper') },
      { value: 'LIVE', label: walletText('modeLive') },
    ],
    [walletText]
  );
  const apiKeyOptions = useMemo(
    () => [
      { value: '', label: walletText('notSelected') },
      ...compatibleApiKeys.map((apiKey) => ({
        value: apiKey.id,
        label: `${apiKey.label} (${apiKey.exchange})`,
      })),
    ],
    [compatibleApiKeys, walletText]
  );

  const setMode = useCallback((nextMode: WalletFormState['mode']) => {
    setForm((prev) => {
      if (prev.mode === nextMode) return prev;
      if (nextMode === 'PAPER') {
          return {
            ...prev,
            mode: 'PAPER',
            liveAllocationMode: 'PERCENT',
            liveAllocationValue: 100,
            apiKeyId: '',
          };
        }
      return {
        ...prev,
        mode: 'LIVE',
      };
    });
    setPreview(null);
    setPreviewError(null);
    setResetError(null);
  }, []);

  useEffect(() => {
    if (form.mode !== 'LIVE') {
      if (form.apiKeyId) {
        setForm((prev) => ({ ...prev, apiKeyId: '' }));
      }
      setPreview(null);
      setPreviewError(null);
      return;
    }

    if (!compatibleApiKeys.find((item) => item.id === form.apiKeyId)) {
      setForm((prev) => ({ ...prev, apiKeyId: compatibleApiKeys[0]?.id ?? '' }));
      setPreview(null);
      setPreviewError(null);
    }
  }, [compatibleApiKeys, form.apiKeyId, form.mode]);

  const canSaveMode = form.mode === 'LIVE'
    ? supportsExchangeCapability(form.exchange, 'LIVE_EXECUTION')
    : supportsExchangeCapability(form.exchange, 'PAPER_PRICING_FEED');

  const fieldErrors = useMemo(
    () => getWalletFieldErrors(form, walletText),
    [form, walletText]
  );
  const hasValidationErrors = Object.keys(fieldErrors).length > 0;
  const validationSummaryErrors = useMemo(
    () => toValidationSummaryErrors(fieldErrors),
    [fieldErrors]
  );
  const focusFirstInvalidControl = useCallback(() => {
    focusFirstInvalidField(fieldErrors, {
      name: 'wallet-name',
      mode: 'wallet-mode-PAPER',
      exchange: 'wallet-exchange',
      marketType: 'wallet-market-type',
      baseCurrency: 'wallet-base-currency',
      paperInitialBalance: 'wallet-paper-initial-balance',
      liveAllocationMode: 'wallet-live-allocation-mode',
      liveAllocationValue: 'wallet-live-allocation-value',
      apiKeyId: 'wallet-api-key',
    });
  }, [fieldErrors]);

  const selectedApiKey = useMemo(
    () => compatibleApiKeys.find((item) => item.id === form.apiKeyId) ?? null,
    [compatibleApiKeys, form.apiKeyId]
  );

  const handlePreviewBalance = useCallback(async () => {
    if (form.mode !== 'LIVE' || !form.apiKeyId || !canSaveMode) return;
    setPreviewError(null);

    try {
      await runAsyncWithState(setPreviewLoading, async () => {
        const data = await loadWalletBalancePreview(form);
        setPreview(data);
      });
    } catch (err) {
      setPreview(null);
      setPreviewError(resolveFormErrorMessage(err, walletText('saveFailed')));
    }
  }, [canSaveMode, form, walletText]);

  useEffect(() => {
    if (form.mode !== 'LIVE' || !form.apiKeyId || !canSaveMode) return;
    void handlePreviewBalance();
  }, [canSaveMode, form.apiKeyId, form.baseCurrency, form.exchange, form.marketType, form.mode, handlePreviewBalance]);

  const previewReferenceBalance = useMemo(
    () => resolvePreviewReferenceBalance(form, preview),
    [form, preview]
  );

  const handleResetPaper = useCallback(async () => {
    if (!editId || !isEditMode || form.mode !== 'PAPER' || submitting || resetting) return;

    const confirmed = typeof window === 'undefined' ? true : window.confirm(walletText('resetPaperConfirm'));
    if (!confirmed) return;

    setResetError(null);

    try {
      await runAsyncWithState(setResetting, async () => {
        await runPaperWalletReset(editId);
        toast.success(walletText('resetPaperSuccess'));
        await loadData();
      });
    } catch (err) {
      const errorMessage = resolveFormErrorMessage(err, walletText('resetPaperFailed'));
      setResetError(errorMessage);
      toast.error(walletText('resetPaperFailed'), {
        description: errorMessage,
      });
    }
  }, [editId, form.mode, isEditMode, loadData, resetting, submitting, walletText]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setShowValidation(true);

    if (!canSaveMode || hasValidationErrors) {
      toast.error(walletText('saveValidation'));
      focusFirstInvalidControl();
      return;
    }

    try {
      await runAsyncWithState(setSubmitting, async () => {
        const payload: CreateWalletInput = toPayload(form);
        if (isEditMode && editId) {
          await executeWithRetry(() => updateWallet(editId, payload), {
            maxAttempts: 2,
            retryDelayMs: 250,
            shouldRetry: isRetriableHttpError,
          });
          toast.success(walletText('saved'));
          await loadData();
        } else {
          await executeWithRetry(() => createWallet(payload), {
            maxAttempts: 2,
            retryDelayMs: 250,
            shouldRetry: isRetriableHttpError,
          });
          toast.success(walletText('created'));
          router.replace('/dashboard/wallets/list');
        }
      });
    } catch (err) {
      toast.error(isEditMode ? walletText('saveFailed') : walletText('createFailed'), {
        description: resolveFormErrorMessage(err, isEditMode ? walletText('saveFailed') : walletText('createFailed')),
      });
    }
  };

  if (loading) {
    return <LoadingState title={walletText('loading')} />;
  }

  if (error) {
    return (
      <ErrorState
        title={walletText('loadFailedTitle')}
        description={error}
        retryLabel={walletText('retry')}
        onRetry={() => void loadData()}
      />
    );
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]'>
      <div className='space-y-4'>
        {showValidation && hasValidationErrors ? (
          <FormValidationSummary title={walletText('validationSummaryTitle')} errors={validationSummaryErrors} />
        ) : null}

        <WalletBasicsSection
          walletText={walletText}
          form={form}
          modeOptions={modeOptions}
          exchangeOptions={exchangeOptions}
          marketTypeOptions={marketTypeSelectOptions}
          baseCurrencyOptions={baseCurrencyOptions}
          walletMetadataLoading={walletMetadataLoading}
          walletMetadataError={walletMetadataError}
          showValidation={showValidation}
          fieldErrors={fieldErrors}
          onNameChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
          onModeChange={setMode}
          onExchangeChange={(value) => setForm((prev) => ({ ...prev, exchange: value }))}
          onMarketTypeChange={(value) => setForm((prev) => ({ ...prev, marketType: value }))}
          onBaseCurrencyChange={(value) => setForm((prev) => ({ ...prev, baseCurrency: normalizeFormSymbol(value) }))}
        />

        {form.mode === 'PAPER' ? (
          <WalletPaperSection
            walletText={walletText}
            form={form}
            isEditMode={isEditMode}
            resetting={resetting}
            submitting={submitting}
            lastResetAt={lastResetAt}
            resetError={resetError}
            onPaperInitialBalanceChange={(value) => setForm((prev) => ({ ...prev, paperInitialBalance: value }))}
            onResetPaper={() => void handleResetPaper()}
          />
        ) : null}

        {form.mode === 'LIVE' ? (
          <WalletLiveSection
            walletText={walletText}
            form={form}
            compatibleApiKeys={compatibleApiKeys}
            liveAllocationModeOptions={liveAllocationModeOptions}
            apiKeyOptions={apiKeyOptions}
            showValidation={showValidation}
            fieldErrors={fieldErrors}
            onLiveAllocationValueChange={(value) => setForm((prev) => ({ ...prev, liveAllocationValue: value }))}
            onLiveAllocationModeChange={(value) => setForm((prev) => ({ ...prev, liveAllocationMode: value as WalletAllocationMode }))}
            onApiKeyChange={(value) => {
              setForm((prev) => ({ ...prev, apiKeyId: value }));
              setPreview(null);
              setPreviewError(null);
            }}
          />
        ) : null}

        {!canSaveMode ? (
          <FormAlert variant='warning'>
            {form.mode === 'LIVE' ? walletText('liveUnsupported') : walletText('paperUnsupported')}
          </FormAlert>
        ) : null}
      </div>

      <aside className='space-y-4'>
        <WalletSummarySection walletText={walletText} form={form} selectedApiKey={selectedApiKey} />

        {form.mode === 'LIVE' ? (
          <WalletPreviewSection
            walletText={walletText}
            form={form}
            canSaveMode={canSaveMode}
            previewLoading={previewLoading}
            previewError={previewError}
            preview={preview}
            previewReferenceBalance={previewReferenceBalance}
            onPreviewBalance={() => void handlePreviewBalance()}
          />
        ) : null}
      </aside>

      <button type='submit' className='sr-only' disabled={submitting}>
        {walletText('hiddenSubmit')}
      </button>
    </form>
  );
}
