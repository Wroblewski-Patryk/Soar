'use client';

import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { listStrategies } from '../../strategies/api/strategies.api';
import { StrategyDto } from '../../strategies/types/StrategyForm.type';
import { CreateBacktestRunInput } from '../types/backtest.type';
import { listMarketUniverses } from '../../markets/services/markets.service';
import { MarketUniverse } from '../../markets/types/marketUniverse.type';
import { useI18n } from '../../../i18n/I18nProvider';
import { hasFormText, normalizeFormText, resolveFormErrorMessage } from '@/lib/forms';
import {
  FormGrid,
  FormPageShell,
  FormSectionCard,
  FormValidationSummary,
  NumberField,
  SelectField,
  TextField,
  TextareaField,
  focusFirstInvalidField,
  toValidationSummaryErrors,
} from '@/ui/forms';

type BacktestCreateFormProps = {
  formId?: string;
  submitting: boolean;
  onSubmit: (payload: CreateBacktestRunInput) => Promise<void>;
};

const MAX_CANDLES_MIN = 250;
const MAX_CANDLES_MAX = 10000;
const DEFAULT_MAX_CANDLES = 1200;
const INITIAL_BALANCE_MIN = 1;
const INITIAL_BALANCE_MAX = 1_000_000_000;

const TIMEFRAME_INTERVAL_MS: Record<string, number> = {
  '1m': 60_000,
  '5m': 5 * 60_000,
  '15m': 15 * 60_000,
  '30m': 30 * 60_000,
  '1h': 60 * 60_000,
  '2h': 2 * 60 * 60_000,
  '4h': 4 * 60 * 60_000,
  '6h': 6 * 60 * 60_000,
  '8h': 8 * 60 * 60_000,
  '12h': 12 * 60 * 60_000,
  '1d': 24 * 60 * 60_000,
  '1w': 7 * 24 * 60 * 60_000,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const resolveTimeframeIntervalMs = (timeframe?: string) =>
  TIMEFRAME_INTERVAL_MS[normalizeFormText(timeframe).toLowerCase()] ?? TIMEFRAME_INTERVAL_MS['1h'];

const formatDateTimeLocalInput = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);

const parseDateTimeLocalInput = (value: string): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const clampEndAtToBoundary = (candidate: Date, timeframe?: string) => {
  const intervalMs = resolveTimeframeIntervalMs(timeframe);
  const boundaryMs = Math.floor(Date.now() / intervalMs) * intervalMs;
  return new Date(Math.min(candidate.getTime(), boundaryMs));
};

const deriveStartAtFromEndAt = (endAt: Date, maxCandles: number, timeframe?: string) => {
  const intervalMs = resolveTimeframeIntervalMs(timeframe);
  return new Date(endAt.getTime() - intervalMs * Math.max(1, maxCandles));
};

const deriveCandlesFromRange = (startAt: Date, endAt: Date, timeframe?: string) => {
  const intervalMs = resolveTimeframeIntervalMs(timeframe);
  const diffMs = endAt.getTime() - startAt.getTime();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / intervalMs);
};

const buildSuggestedRunName = (
  strategyName: string | undefined,
  universeName: string | undefined,
  timeframe: string | undefined,
  strategyFallback: string,
  marketFallback: string,
) => {
  const strategy = normalizeFormText(strategyName) || strategyFallback;
  const universe = normalizeFormText(universeName) || marketFallback;
  const tf = normalizeFormText(timeframe) || '-';
  return `Backtest ${strategy} | ${universe} (${tf})`;
};

export default function BacktestCreateForm({ formId = 'backtest-form', submitting, onSubmit }: BacktestCreateFormProps) {
  const { t } = useI18n();
  const copy = useMemo(
    () => ({
      strategyLoadError: t('dashboard.backtests.createForm.strategyLoadError'),
      universesLoadError: t('dashboard.backtests.createForm.universesLoadError'),
      noStrategies: t('dashboard.backtests.createForm.noStrategies'),
      noUniverses: t('dashboard.backtests.createForm.noUniverses'),
      creating: t('dashboard.backtests.createForm.creating'),
      title: t('dashboard.backtests.createForm.title'),
      subtitle: t('dashboard.backtests.createForm.subtitle'),
      sectionRunConfig: t('dashboard.backtests.createForm.sectionRunConfig'),
      sectionSimParams: t('dashboard.backtests.createForm.sectionSimParams'),
      runName: t('dashboard.backtests.createForm.runName'),
      runNamePlaceholder: t('dashboard.backtests.createForm.runNamePlaceholder'),
      strategy: t('dashboard.backtests.createForm.strategy'),
      marketGroup: t('dashboard.backtests.createForm.marketGroup'),
      startAt: t('dashboard.backtests.createForm.startAt'),
      endAt: t('dashboard.backtests.createForm.endAt'),
      maxCandles: t('dashboard.backtests.createForm.maxCandles'),
      maxCandlesErrorPrefix: t('dashboard.backtests.createForm.maxCandlesErrorPrefix'),
      initialBalance: t('dashboard.backtests.createForm.initialBalance'),
      initialBalanceErrorPrefix: t('dashboard.backtests.createForm.initialBalanceErrorPrefix'),
      venueContextTitle: t('dashboard.backtests.createForm.venueContextTitle'),
      venueContextHint: t('dashboard.backtests.createForm.venueContextHint'),
      venueContextAwaitingSelection: t('dashboard.backtests.createForm.venueContextAwaitingSelection'),
      venueContextExchange: t('dashboard.backtests.createForm.venueContextExchange'),
      venueContextMarketType: t('dashboard.backtests.createForm.venueContextMarketType'),
      venueContextBaseCurrency: t('dashboard.backtests.createForm.venueContextBaseCurrency'),
      notes: t('dashboard.backtests.createForm.notes'),
      notesPlaceholder: t('dashboard.backtests.createForm.notesPlaceholder'),
      suggestedStrategyFallback: t('dashboard.backtests.createForm.suggestedStrategyFallback'),
      suggestedMarketFallback: t('dashboard.backtests.createForm.suggestedMarketFallback'),
      validationSummaryTitle: t('dashboard.backtests.createForm.validationSummaryTitle'),
      runNameRequiredValidation: t('dashboard.backtests.createForm.runNameRequiredValidation'),
      strategyRequiredValidation: t('dashboard.backtests.createForm.strategyRequiredValidation'),
      marketGroupRequiredValidation: t('dashboard.backtests.createForm.marketGroupRequiredValidation'),
      startAtRequiredValidation: t('dashboard.backtests.createForm.startAtRequiredValidation'),
      endAtRequiredValidation: t('dashboard.backtests.createForm.endAtRequiredValidation'),
      rangeOrderValidation: t('dashboard.backtests.createForm.rangeOrderValidation'),
      endAtBoundaryValidation: t('dashboard.backtests.createForm.endAtBoundaryValidation'),
    }),
    [t],
  );
  const [name, setName] = useState('');
  const [nameEdited, setNameEdited] = useState(false);
  const [strategyId, setStrategyId] = useState('');
  const [marketUniverseId, setMarketUniverseId] = useState('');
  const [notes, setNotes] = useState('');
  const [maxCandles, setMaxCandles] = useState(String(DEFAULT_MAX_CANDLES));
  const [initialBalance, setInitialBalance] = useState('10000');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  const [strategies, setStrategies] = useState<StrategyDto[]>([]);
  const [marketUniverses, setMarketUniverses] = useState<MarketUniverse[]>([]);
  const [strategiesLoading, setStrategiesLoading] = useState(true);
  const [universesLoading, setUniversesLoading] = useState(true);
  const strategyLoadErrorText = copy.strategyLoadError;
  const universesLoadErrorText = copy.universesLoadError;

  useEffect(() => {
    const loadStrategies = async () => {
      setStrategiesLoading(true);
      try {
        const data = await listStrategies();
        setStrategies(data);
        setStrategyId((prev) => prev || data[0]?.id || '');
      } catch (error: unknown) {
        toast.error(strategyLoadErrorText, {
          description: resolveFormErrorMessage(error, strategyLoadErrorText),
        });
        setStrategies([]);
      } finally {
        setStrategiesLoading(false);
      }
    };

    void loadStrategies();
  }, [strategyLoadErrorText]);

  useEffect(() => {
    const loadUniverses = async () => {
      setUniversesLoading(true);
      try {
        const data = await listMarketUniverses();
        setMarketUniverses(data);
        setMarketUniverseId((prev) => prev || data[0]?.id || '');
      } catch (error: unknown) {
        toast.error(universesLoadErrorText, {
          description: resolveFormErrorMessage(error, universesLoadErrorText),
        });
        setMarketUniverses([]);
      } finally {
        setUniversesLoading(false);
      }
    };

    void loadUniverses();
  }, [universesLoadErrorText]);

  const selectedStrategy = useMemo(
    () => strategies.find((strategy) => strategy.id === strategyId) ?? null,
    [strategies, strategyId],
  );
  const selectedUniverse = useMemo(
    () => marketUniverses.find((item) => item.id === marketUniverseId) ?? null,
    [marketUniverses, marketUniverseId],
  );
  const selectedTimeframe = selectedStrategy?.interval;

  const applyRangeFromMaxCandles = useCallback(
    (nextMaxCandles: number, referenceEndAt?: Date | null) => {
      if (!selectedTimeframe) return;
      const endCandidate = referenceEndAt ?? parseDateTimeLocalInput(endAt) ?? new Date();
      const boundedEnd = clampEndAtToBoundary(endCandidate, selectedTimeframe);
      const boundedMaxCandles = clamp(nextMaxCandles, MAX_CANDLES_MIN, MAX_CANDLES_MAX);
      const derivedStart = deriveStartAtFromEndAt(boundedEnd, boundedMaxCandles, selectedTimeframe);
      setEndAt(formatDateTimeLocalInput(boundedEnd));
      setStartAt(formatDateTimeLocalInput(derivedStart));
    },
    [endAt, selectedTimeframe],
  );
  const syncMaxCandlesFromRange = useCallback(
    (nextStartAt: Date | null, nextEndAt: Date | null) => {
      if (!selectedTimeframe || !nextStartAt || !nextEndAt) return;
      if (nextStartAt.getTime() >= nextEndAt.getTime()) return;
      const derivedCandles = deriveCandlesFromRange(nextStartAt, nextEndAt, selectedTimeframe);
      const boundedCandles = clamp(derivedCandles, MAX_CANDLES_MIN, MAX_CANDLES_MAX);
      setMaxCandles(String(boundedCandles));
    },
    [selectedTimeframe],
  );

  const suggestedRunName = useMemo(
    () =>
      buildSuggestedRunName(
        selectedStrategy?.name,
        selectedUniverse?.name,
        selectedStrategy?.interval,
        copy.suggestedStrategyFallback,
        copy.suggestedMarketFallback,
      ),
    [
      copy.suggestedMarketFallback,
      copy.suggestedStrategyFallback,
      selectedStrategy?.interval,
      selectedStrategy?.name,
      selectedUniverse?.name,
    ],
  );

  useEffect(() => {
    if (nameEdited) return;
    setName(suggestedRunName);
  }, [nameEdited, suggestedRunName]);

  useEffect(() => {
    if (!selectedTimeframe) return;
    const parsedStartAt = parseDateTimeLocalInput(startAt);
    const parsedEndAt = parseDateTimeLocalInput(endAt);
    if (parsedStartAt && parsedEndAt) return;
    const parsedMaxCandles = Number.parseInt(maxCandles, 10);
    const effectiveMaxCandles = Number.isFinite(parsedMaxCandles)
      ? clamp(parsedMaxCandles, MAX_CANDLES_MIN, MAX_CANDLES_MAX)
      : DEFAULT_MAX_CANDLES;
    applyRangeFromMaxCandles(effectiveMaxCandles);
  }, [applyRangeFromMaxCandles, endAt, maxCandles, selectedTimeframe, startAt]);

  const parsedMaxCandles = Number.parseInt(maxCandles, 10);
  const parsedInitialBalance = Number.parseFloat(initialBalance);
  const parsedStartAt = parseDateTimeLocalInput(startAt);
  const parsedEndAt = parseDateTimeLocalInput(endAt);
  const endBoundary = selectedTimeframe ? clampEndAtToBoundary(new Date(), selectedTimeframe) : new Date();

  const hasValidMaxCandles =
    Number.isFinite(parsedMaxCandles) &&
    parsedMaxCandles >= MAX_CANDLES_MIN &&
    parsedMaxCandles <= MAX_CANDLES_MAX;
  const hasValidInitialBalance =
    Number.isFinite(parsedInitialBalance) &&
    parsedInitialBalance >= INITIAL_BALANCE_MIN &&
    parsedInitialBalance <= INITIAL_BALANCE_MAX;
  const hasValidStartAt = Boolean(parsedStartAt);
  const hasValidEndAt = Boolean(parsedEndAt);
  const hasValidRangeOrder =
    Boolean(parsedStartAt) &&
    Boolean(parsedEndAt) &&
    parsedStartAt!.getTime() < parsedEndAt!.getTime();
  const hasValidRangeBoundary =
    Boolean(parsedEndAt) &&
    parsedEndAt!.getTime() <= endBoundary.getTime();

  const canSubmit =
    hasFormText(name) &&
    hasFormText(strategyId) &&
    hasFormText(marketUniverseId) &&
    hasValidStartAt &&
    hasValidEndAt &&
    hasValidRangeOrder &&
    hasValidRangeBoundary &&
    hasValidMaxCandles &&
    hasValidInitialBalance &&
    !submitting &&
    !universesLoading &&
    !strategiesLoading;

  const maxCandlesErrorMessage = `${copy.maxCandlesErrorPrefix} ${MAX_CANDLES_MIN} - ${MAX_CANDLES_MAX}.`;
  const initialBalanceErrorMessage = `${copy.initialBalanceErrorPrefix} ${INITIAL_BALANCE_MIN} - ${INITIAL_BALANCE_MAX}.`;

  const fieldErrors = useMemo(() => {
    const errors: {
      runName?: string;
      strategyId?: string;
      marketUniverseId?: string;
      startAt?: string;
      endAt?: string;
      maxCandles?: string;
      initialBalance?: string;
    } = {};
    if (!hasFormText(name)) {
      errors.runName = copy.runNameRequiredValidation;
    }
    if (!hasFormText(strategyId)) {
      errors.strategyId = copy.strategyRequiredValidation;
    }
    if (!hasFormText(marketUniverseId)) {
      errors.marketUniverseId = copy.marketGroupRequiredValidation;
    }
    if (!hasValidStartAt) {
      errors.startAt = copy.startAtRequiredValidation;
    }
    if (!hasValidEndAt) {
      errors.endAt = copy.endAtRequiredValidation;
    }
    if (hasValidStartAt && hasValidEndAt && !hasValidRangeOrder) {
      errors.endAt = copy.rangeOrderValidation;
    }
    if (hasValidEndAt && !hasValidRangeBoundary) {
      errors.endAt = copy.endAtBoundaryValidation;
    }
    if (!hasValidMaxCandles) {
      errors.maxCandles = maxCandlesErrorMessage;
    }
    if (!hasValidInitialBalance) {
      errors.initialBalance = initialBalanceErrorMessage;
    }
    return errors;
  }, [
    copy.endAtBoundaryValidation,
    copy.endAtRequiredValidation,
    copy.marketGroupRequiredValidation,
    copy.rangeOrderValidation,
    copy.runNameRequiredValidation,
    copy.startAtRequiredValidation,
    copy.strategyRequiredValidation,
    hasValidEndAt,
    hasValidInitialBalance,
    hasValidMaxCandles,
    hasValidRangeBoundary,
    hasValidRangeOrder,
    hasValidStartAt,
    initialBalanceErrorMessage,
    marketUniverseId,
    maxCandlesErrorMessage,
    name,
    strategyId,
  ]);

  const hasValidationErrors = Object.keys(fieldErrors).length > 0;
  const validationSummaryErrors = useMemo(() => toValidationSummaryErrors(fieldErrors), [fieldErrors]);

  const focusFirstInvalidControl = useCallback(() => {
    focusFirstInvalidField(fieldErrors, {
      runName: 'backtest-run-name',
      strategyId: 'backtest-strategy-id',
      marketUniverseId: 'backtest-market-universe-id',
      startAt: 'backtest-start-at',
      endAt: 'backtest-end-at',
      maxCandles: 'backtest-max-candles',
      initialBalance: 'backtest-initial-balance',
    });
  }, [fieldErrors]);

  const strategyOptions = useMemo(
    () =>
      strategies.length > 0
        ? strategies.map((strategy) => ({
            value: strategy.id,
            label: strategy.name,
          }))
        : [
            {
              value: '',
              label: copy.noStrategies,
            },
          ],
    [copy.noStrategies, strategies],
  );

  const marketUniverseOptions = useMemo(
    () =>
      marketUniverses.length > 0
        ? marketUniverses.map((universe) => ({
            value: universe.id,
            label: `${universe.name} (${universe.exchange ?? 'BINANCE'} - ${universe.marketType}/${universe.baseCurrency})`,
          }))
        : [
            {
              value: '',
              label: copy.noUniverses,
            },
          ],
    [copy.noUniverses, marketUniverses],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setShowValidation(true);
    if (!canSubmit || hasValidationErrors || !selectedStrategy || !parsedStartAt || !parsedEndAt) {
      focusFirstInvalidControl();
      return;
    }

    await onSubmit({
      name: normalizeFormText(name),
      timeframe: selectedStrategy.interval,
      strategyId,
      marketUniverseId,
      startAt: parsedStartAt.toISOString(),
      endAt: parsedEndAt.toISOString(),
      seedConfig: {
        maxCandles: parsedMaxCandles,
        initialBalance: parsedInitialBalance,
      },
      notes: normalizeFormText(notes) || undefined,
    });
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className='space-y-4'>
      {showValidation && hasValidationErrors ? (
        <FormValidationSummary title={copy.validationSummaryTitle} errors={validationSummaryErrors} />
      ) : null}
      <fieldset disabled={submitting} className='space-y-4'>
        <FormPageShell title={copy.title} description={copy.subtitle}>
          <FormSectionCard title={copy.sectionRunConfig}>
            <FormGrid columns={3} className='md:grid-cols-3 xl:grid-cols-3' data-testid='backtest-create-run-grid'>
              <TextField
                id='backtest-run-name'
                label={copy.runName}
                value={name}
                onChange={(value) => {
                  setName(value);
                  setNameEdited(true);
                }}
                placeholder={copy.runNamePlaceholder}
                error={showValidation ? fieldErrors.runName : undefined}
              />

              <SelectField
                id='backtest-strategy-id'
                label={copy.strategy}
                value={strategyId}
                onChange={setStrategyId}
                options={strategyOptions}
                disabled={strategiesLoading || strategies.length === 0}
                error={showValidation ? fieldErrors.strategyId : undefined}
              />

              <SelectField
                id='backtest-market-universe-id'
                label={copy.marketGroup}
                value={marketUniverseId}
                onChange={setMarketUniverseId}
                options={marketUniverseOptions}
                disabled={universesLoading || marketUniverses.length === 0}
                error={showValidation ? fieldErrors.marketUniverseId : undefined}
              />

              <TextField
                id='backtest-start-at'
                label={copy.startAt}
                value={startAt}
                onChange={(value) => {
                  setStartAt(value);
                  if (!selectedTimeframe) return;
                  const nextStartAt = parseDateTimeLocalInput(value);
                  const rawEndAt = parseDateTimeLocalInput(endAt);
                  if (!nextStartAt || !rawEndAt) return;
                  const boundedEndAt = clampEndAtToBoundary(rawEndAt, selectedTimeframe);
                  if (boundedEndAt.getTime() !== rawEndAt.getTime()) {
                    setEndAt(formatDateTimeLocalInput(boundedEndAt));
                  }
                  syncMaxCandlesFromRange(nextStartAt, boundedEndAt);
                }}
                type='datetime-local'
                error={showValidation ? fieldErrors.startAt : undefined}
              />

              <TextField
                id='backtest-end-at'
                label={copy.endAt}
                value={endAt}
                onChange={(value) => {
                  setEndAt(value);
                  const nextEndAt = parseDateTimeLocalInput(value);
                  if (!nextEndAt || !selectedTimeframe) return;
                  const boundedEndAt = clampEndAtToBoundary(nextEndAt, selectedTimeframe);
                  setEndAt(formatDateTimeLocalInput(boundedEndAt));
                  syncMaxCandlesFromRange(parseDateTimeLocalInput(startAt), boundedEndAt);
                }}
                type='datetime-local'
                error={showValidation ? fieldErrors.endAt : undefined}
              />

              <div className='md:col-span-3 rounded-md border border-base-300/70 bg-base-200/40 px-3 py-2'>
                <p className='text-[11px] font-semibold uppercase tracking-wide opacity-70'>{copy.venueContextTitle}</p>
                {selectedUniverse ? (
                  <div className='mt-2 flex flex-wrap items-center gap-2 text-sm'>
                    <span className='badge badge-outline gap-1'>
                      <span className='opacity-70'>{copy.venueContextExchange}:</span>
                      <span className='font-semibold'>{selectedUniverse.exchange ?? 'BINANCE'}</span>
                    </span>
                    <span className='badge badge-outline gap-1'>
                      <span className='opacity-70'>{copy.venueContextMarketType}:</span>
                      <span className='font-semibold'>{selectedUniverse.marketType}</span>
                    </span>
                    <span className='badge badge-outline gap-1'>
                      <span className='opacity-70'>{copy.venueContextBaseCurrency}:</span>
                      <span className='font-semibold'>{selectedUniverse.baseCurrency}</span>
                    </span>
                  </div>
                ) : (
                  <p className='mt-1 text-xs opacity-70'>{copy.venueContextAwaitingSelection}</p>
                )}
                <p className='mt-2 text-xs opacity-70'>{copy.venueContextHint}</p>
              </div>
            </FormGrid>
          </FormSectionCard>

          <FormSectionCard title={copy.sectionSimParams}>
            <FormGrid columns={3} className='md:grid-cols-3 xl:grid-cols-3' data-testid='backtest-create-simulation-grid'>
              <NumberField
                id='backtest-max-candles'
                label={copy.maxCandles}
                value={maxCandles}
                onChange={(value) => {
                  setMaxCandles(value);
                  const nextMaxCandles = Number.parseInt(value, 10);
                  if (!Number.isFinite(nextMaxCandles)) return;
                  applyRangeFromMaxCandles(nextMaxCandles);
                }}
                min={MAX_CANDLES_MIN}
                max={MAX_CANDLES_MAX}
                placeholder='1200'
                inputMode='numeric'
                error={showValidation ? fieldErrors.maxCandles : undefined}
              />

              <NumberField
                id='backtest-initial-balance'
                label={copy.initialBalance}
                value={initialBalance}
                onChange={setInitialBalance}
                min={INITIAL_BALANCE_MIN}
                max={INITIAL_BALANCE_MAX}
                placeholder='10000'
                error={showValidation ? fieldErrors.initialBalance : undefined}
              />

              <TextareaField
                id='backtest-notes'
                label={copy.notes}
                value={notes}
                onChange={setNotes}
                placeholder={copy.notesPlaceholder}
                className='md:col-span-3'
                rows={4}
              />
            </FormGrid>
          </FormSectionCard>
        </FormPageShell>
      </fieldset>
    </form>
  );
}
