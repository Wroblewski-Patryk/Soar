import { LuBadgeCheck } from 'react-icons/lu';

import type { ApiKey } from '@/features/profile/types/apiKey.type';
import {
  FormGrid,
  FormSectionCard,
  NumberField,
  type Option,
  RadioGroupField,
  SelectField,
  TextField,
  ToggleField,
} from '@/ui/forms';
import { normalizeFormSymbol } from '@/lib/forms';
import { normalizeSymbol } from '@/lib/symbols';

import type { WalletBalancePreview } from '../../types/wallet.type';
import { formatAmount, type WalletFormState, type WalletMarketType } from './state';

type WalletText = (key: string) => string;
type WalletFieldErrors = Partial<Record<keyof WalletFormState, string>>;

type BasicsSectionProps = {
  walletText: WalletText;
  form: WalletFormState;
  modeOptions: Option[];
  exchangeOptions: Option[];
  marketTypeOptions: Option[];
  baseCurrencyOptions: Option[];
  walletMetadataLoading: boolean;
  walletMetadataError: string | null;
  showValidation: boolean;
  fieldErrors: WalletFieldErrors;
  onNameChange: (value: string) => void;
  onModeChange: (value: WalletFormState['mode']) => void;
  onExchangeChange: (value: WalletFormState['exchange']) => void;
  onMarketTypeChange: (value: WalletMarketType) => void;
  onBaseCurrencyChange: (value: string) => void;
};

export function WalletBasicsSection({
  walletText,
  form,
  modeOptions,
  exchangeOptions,
  marketTypeOptions,
  baseCurrencyOptions,
  walletMetadataLoading,
  walletMetadataError,
  showValidation,
  fieldErrors,
  onNameChange,
  onModeChange,
  onExchangeChange,
  onMarketTypeChange,
  onBaseCurrencyChange,
}: BasicsSectionProps) {
  return (
    <FormSectionCard title={walletText('sectionBasics')}>
      <FormGrid columns={2}>
        <TextField
          id='wallet-name'
          label={walletText('name')}
          value={form.name}
          onChange={onNameChange}
          error={showValidation ? fieldErrors.name : undefined}
        />

        <RadioGroupField
          id='wallet-mode'
          label={walletText('mode')}
          hint={form.mode === 'LIVE' ? walletText('modeLiveHint') : walletText('modePaperHint')}
          className='md:col-span-2'
          value={form.mode}
          options={modeOptions}
          onChange={(value) => onModeChange(value as WalletFormState['mode'])}
        />

        <SelectField
          id='wallet-exchange'
          label={walletText('exchange')}
          value={form.exchange}
          options={exchangeOptions}
          onChange={(value) => onExchangeChange(value as WalletFormState['exchange'])}
        />

        <SelectField
          id='wallet-market-type'
          label={walletText('marketType')}
          value={form.marketType}
          options={marketTypeOptions}
          onChange={(value) => onMarketTypeChange(value as WalletMarketType)}
          disabled={walletMetadataLoading}
        />

        <SelectField
          id='wallet-base-currency'
          label={walletText('baseCurrency')}
          value={form.baseCurrency}
          options={baseCurrencyOptions}
          onChange={onBaseCurrencyChange}
          disabled={walletMetadataLoading}
          error={showValidation ? fieldErrors.baseCurrency : undefined}
          hint={walletMetadataLoading ? walletText('baseCurrencyLoading') : undefined}
        />
        {walletMetadataError ? <p className='text-xs text-warning md:col-span-2'>{walletMetadataError}</p> : null}
      </FormGrid>
    </FormSectionCard>
  );
}

type PaperSectionProps = {
  walletText: WalletText;
  form: WalletFormState;
  isEditMode: boolean;
  resetting: boolean;
  submitting: boolean;
  lastResetAt: string | null;
  resetError: string | null;
  onPaperInitialBalanceChange: (value: number) => void;
  onResetPaper: () => void;
};

export function WalletPaperSection({
  walletText,
  form,
  isEditMode,
  resetting,
  submitting,
  lastResetAt,
  resetError,
  onPaperInitialBalanceChange,
  onResetPaper,
}: PaperSectionProps) {
  return (
    <FormSectionCard
      title={walletText('sectionPaper')}
      actions={
        isEditMode ? (
          <button
            type='button'
            className='btn btn-xs btn-outline btn-warning'
            onClick={onResetPaper}
            disabled={resetting || submitting}
          >
            {resetting ? walletText('resetPaperLoading') : walletText('resetPaperAction')}
          </button>
        ) : undefined
      }
    >
      <FormGrid columns={2}>
        <NumberField
          id='wallet-paper-initial-balance'
          label={walletText('paperInitialBalance')}
          value={form.paperInitialBalance}
          onChange={(value) => onPaperInitialBalanceChange(Number(value) || 0)}
          min={0}
          step={0.01}
        />
      </FormGrid>
      <p className='mt-2 text-xs opacity-70'>{walletText('capitalAuthorityPaper')}</p>
      {lastResetAt ? (
        <p className='mt-2 text-xs opacity-70'>
          {walletText('resetPaperLastAt')}: {lastResetAt}. {walletText('capitalAuthorityPaperReset')}
        </p>
      ) : null}
      {resetError ? <p className='mt-2 text-xs text-error'>{resetError}</p> : null}
    </FormSectionCard>
  );
}

type LiveSectionProps = {
  walletText: WalletText;
  form: WalletFormState;
  compatibleApiKeys: ApiKey[];
  liveAllocationModeOptions: Option[];
  apiKeyOptions: Option[];
  showValidation: boolean;
  fieldErrors: WalletFieldErrors;
  onLiveAllocationValueChange: (value: number) => void;
  onLiveAllocationModeChange: (value: WalletFormState['liveAllocationMode']) => void;
  onApiKeyChange: (value: string) => void;
  onManageExternalPositionsChange: (checked: boolean) => void;
};

export function WalletLiveSection({
  walletText,
  form,
  compatibleApiKeys,
  liveAllocationModeOptions,
  apiKeyOptions,
  showValidation,
  fieldErrors,
  onLiveAllocationValueChange,
  onLiveAllocationModeChange,
  onApiKeyChange,
  onManageExternalPositionsChange,
}: LiveSectionProps) {
  return (
    <FormSectionCard title={walletText('sectionLive')}>
      <FormGrid columns={2}>
        <NumberField
          id='wallet-live-allocation-value'
          label={walletText('liveAllocationValue')}
          value={form.liveAllocationValue}
          onChange={(value) => onLiveAllocationValueChange(Number(value) || 0)}
          min={0.01}
          step={0.01}
          error={showValidation ? fieldErrors.liveAllocationValue : undefined}
        />

        <SelectField
          id='wallet-live-allocation-mode'
          label={walletText('liveAllocationMode')}
          value={form.liveAllocationMode}
          options={liveAllocationModeOptions}
          onChange={(value) => onLiveAllocationModeChange(value as WalletFormState['liveAllocationMode'])}
        />

        <SelectField
          id='wallet-api-key'
          label={walletText('apiKey')}
          value={form.apiKeyId}
          options={apiKeyOptions}
          className='md:col-span-2'
          onChange={onApiKeyChange}
          error={showValidation ? fieldErrors.apiKeyId : undefined}
        />
        {compatibleApiKeys.length === 0 ? <p className='text-xs text-warning md:col-span-2'>{walletText('noApiKeys')}</p> : null}

        <ToggleField
          id='wallet-manage-external-positions'
          className='md:col-span-2'
          label={walletText('manageExternalPositions')}
          hint={walletText('manageExternalPositionsHint')}
          checked={form.manageExternalPositions}
          onChange={onManageExternalPositionsChange}
        />
      </FormGrid>
    </FormSectionCard>
  );
}

type SummarySectionProps = {
  walletText: WalletText;
  form: WalletFormState;
  selectedApiKey: ApiKey | null;
};

export function WalletSummarySection({ walletText, form, selectedApiKey }: SummarySectionProps) {
  const capitalAuthorityLabel =
    form.mode === 'PAPER'
      ? walletText('capitalAuthorityPaper')
      : form.liveAllocationMode === 'PERCENT'
        ? walletText('capitalAuthorityLivePercent')
        : form.liveAllocationMode === 'FIXED'
          ? walletText('capitalAuthorityLiveFixed')
          : walletText('capitalAuthorityLiveFull');

  return (
    <FormSectionCard title={walletText('sectionSummary')} description={walletText('summaryHint')} className='bg-base-100/85 text-sm'>
      <div className='space-y-2'>
        <p className='flex items-center justify-between gap-2'>
          <span className='opacity-65'>{walletText('mode')}</span>
          <span className='font-semibold'>{form.mode}</span>
        </p>
        <p className='flex items-center justify-between gap-2'>
          <span className='opacity-65'>{walletText('exchange')}</span>
          <span className='font-semibold'>{form.exchange}</span>
        </p>
        <p className='flex items-center justify-between gap-2'>
          <span className='opacity-65'>{walletText('marketType')}</span>
          <span className='font-semibold'>{form.marketType}</span>
        </p>
        <p className='flex items-center justify-between gap-2'>
          <span className='opacity-65'>{walletText('baseCurrency')}</span>
          <span className='font-semibold'>{normalizeSymbol(form.baseCurrency) || '-'}</span>
        </p>
        <p className='flex items-center justify-between gap-2'>
          <span className='opacity-65'>{walletText('capitalAuthority')}</span>
          <span className='max-w-[13rem] text-right font-semibold'>{capitalAuthorityLabel}</span>
        </p>
        {form.mode === 'LIVE' ? (
          <>
            <p className='flex items-center justify-between gap-2'>
              <span className='opacity-65'>{walletText('liveAllocation')}</span>
              <span className='font-semibold'>
                {form.liveAllocationValue || '-'}{' '}
                {form.liveAllocationMode === 'PERCENT' ? '%' : normalizeFormSymbol(form.baseCurrency) || 'USDT'}
              </span>
            </p>
            <p className='flex items-center justify-between gap-2'>
              <span className='opacity-65'>{walletText('selectedKey')}</span>
              <span className='max-w-[11rem] truncate text-right font-semibold'>{selectedApiKey?.label ?? walletText('notSelected')}</span>
            </p>
            <p className='flex items-center justify-between gap-2'>
              <span className='opacity-65'>{walletText('manageExternalPositionsSummary')}</span>
              <span className='font-semibold'>
                {form.manageExternalPositions ? walletText('enabled') : walletText('disabled')}
              </span>
            </p>
          </>
        ) : null}
      </div>
    </FormSectionCard>
  );
}

type PreviewSectionProps = {
  walletText: WalletText;
  form: WalletFormState;
  canSaveMode: boolean;
  previewLoading: boolean;
  previewError: string | null;
  preview: WalletBalancePreview | null;
  previewReferenceBalance: number | null;
  onPreviewBalance: () => void;
};

export function WalletPreviewSection({
  walletText,
  form,
  canSaveMode,
  previewLoading,
  previewError,
  preview,
  previewReferenceBalance,
  onPreviewBalance,
}: PreviewSectionProps) {
  return (
    <FormSectionCard
      title={walletText('sectionPreview')}
      className='bg-base-100/85 text-sm'
      actions={
        <button
          type='button'
          className='btn btn-xs btn-outline'
          onClick={onPreviewBalance}
          disabled={previewLoading || !form.apiKeyId || !canSaveMode}
        >
          {previewLoading ? walletText('previewFetching') : walletText('previewFetch')}
        </button>
      }
    >
      {!form.apiKeyId || !canSaveMode ? <p className='text-xs opacity-70'>{walletText('previewUnavailable')}</p> : null}
      {previewError ? <p className='text-xs text-error'>{previewError}</p> : null}

      <div className='space-y-2'>
        <p className='text-xs opacity-70'>
          {preview
            ? preview.allocationApplied?.mode === 'PERCENT'
              ? walletText('capitalAuthorityLivePercent')
              : preview.allocationApplied?.mode === 'FIXED'
                ? walletText('capitalAuthorityLiveFixed')
                : walletText('capitalAuthorityLiveFull')
            : walletText('capitalAuthorityRuntimeBalance')}
        </p>
        <p className='flex items-center justify-between gap-2'>
          <span className='opacity-65'>{walletText('accountBalance')}</span>
          <span className='font-semibold'>
            {preview ? formatAmount(preview.accountBalance, preview.baseCurrency) : '-'}
          </span>
        </p>
        <p className='flex items-center justify-between gap-2'>
          <span className='opacity-65'>{walletText('freeBalance')}</span>
          <span className='font-semibold'>
            {preview?.freeBalance != null ? formatAmount(preview.freeBalance, preview.baseCurrency) : '-'}
          </span>
        </p>
        <p className='flex items-center justify-between gap-2'>
          <span className='opacity-65'>{walletText('referenceBalance')}</span>
          <span className='font-semibold text-primary'>
            {previewReferenceBalance != null && preview
              ? formatAmount(previewReferenceBalance, preview.baseCurrency)
              : '-'}
          </span>
        </p>
        {preview ? (
          <p className='inline-flex items-center gap-1.5 text-xs opacity-70'>
            <LuBadgeCheck className='h-3.5 w-3.5' aria-hidden />
            {preview.fetchedAt}
          </p>
        ) : null}
      </div>
    </FormSectionCard>
  );
}
