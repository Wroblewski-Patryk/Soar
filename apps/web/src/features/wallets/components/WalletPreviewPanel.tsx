'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { LuActivity, LuArrowLeft, LuChartLine, LuRefreshCw, LuWallet } from 'react-icons/lu';
import Link from 'next/link';

import { useI18n } from '@/i18n/I18nProvider';
import { useLocaleFormatting } from '@/i18n/useLocaleFormatting';
import { resolveUiErrorMessage } from '@/lib/errorResolver';
import { runAsyncWithState } from '@/lib/async';
import { DegradedState, EmptyState, ErrorState, LoadingState } from '@/ui/components/ViewState';
import { TableToneBadge } from '@/ui/components/TableUi';
import { dashboardRoutes } from '@/ui/layout/dashboard/dashboardRoutes';
import {
  getWallet,
  getWalletCashflowEvents,
  getWalletEquityTimeline,
  getWalletPerformanceSummary,
} from '../services/wallets.service';
import type {
  Wallet,
  WalletCashflowDirection,
  WalletCashflowEvent,
  WalletCashflowSource,
  WalletEquityTimeline,
  WalletEquityTimelinePoint,
  WalletLedgerCompleteness,
  WalletPerformanceSummary,
} from '../types/wallet.type';

type WalletPreviewPanelProps = {
  walletId: string;
};

type WalletPreviewState = {
  wallet: Wallet;
  summary: WalletPerformanceSummary;
  timeline: WalletEquityTimeline;
  events: WalletCashflowEvent[];
};

const sourceTone = (source: WalletCashflowSource) => {
  if (source === 'DEPOSIT' || source === 'INITIAL_BALANCE' || source === 'TRANSFER_IN') return 'success';
  if (source === 'WITHDRAWAL' || source === 'TRANSFER_OUT') return 'warning';
  if (source === 'UNKNOWN_EXTERNAL_ADJUSTMENT') return 'danger';
  return 'info';
};

const directionPrefix = (direction: WalletCashflowDirection) => {
  if (direction === 'OUT') return '-';
  if (direction === 'IN') return '+';
  return '';
};

const completenessTone = (completeness: WalletLedgerCompleteness) => {
  if (completeness === 'COMPLETE') return 'success';
  if (completeness === 'PARTIAL') return 'warning';
  return 'danger';
};

const buildLinePoints = (points: WalletEquityTimelinePoint[]) => {
  if (points.length === 0) return '';
  const width = 640;
  const height = 160;
  const values = points.map((point) => point.portfolioEquity);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - ((point.portfolioEquity - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
};

export default function WalletPreviewPanel({ walletId }: WalletPreviewPanelProps) {
  const { t } = useI18n();
  const { formatDateTime, formatNumber, formatPercent } = useLocaleFormatting();
  const [data, setData] = useState<WalletPreviewState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const copy = useMemo(
    () => ({
      loadError: t('dashboard.wallets.preview.loadError'),
      loading: t('dashboard.wallets.preview.loading'),
      loadingDescription: t('dashboard.wallets.preview.loadingDescription'),
      errorTitle: t('dashboard.wallets.preview.errorTitle'),
      retry: t('dashboard.wallets.preview.retry'),
      backToList: t('dashboard.wallets.preview.backToList'),
      edit: t('dashboard.wallets.preview.edit'),
      refresh: t('dashboard.wallets.preview.refresh'),
      noLedgerTitle: t('dashboard.wallets.preview.noLedgerTitle'),
      noLedgerDescription: t('dashboard.wallets.preview.noLedgerDescription'),
      partialTitle: t('dashboard.wallets.preview.partialTitle'),
      partialDescription: t('dashboard.wallets.preview.partialDescription'),
      summary: t('dashboard.wallets.preview.summary'),
      currentBalance: t('dashboard.wallets.preview.currentBalance'),
      allocatedBalance: t('dashboard.wallets.preview.allocatedBalance'),
      contributedCapital: t('dashboard.wallets.preview.contributedCapital'),
      botPnl: t('dashboard.wallets.preview.botPnl'),
      botRealizedPnl: t('dashboard.wallets.preview.botRealizedPnl'),
      botOpenPnl: t('dashboard.wallets.preview.botOpenPnl'),
      feesFunding: t('dashboard.wallets.preview.feesFunding'),
      walletDelta: t('dashboard.wallets.preview.walletDelta'),
      unclassifiedAdjustment: t('dashboard.wallets.preview.unclassifiedAdjustment'),
      latestSnapshot: t('dashboard.wallets.preview.latestSnapshot'),
      equityTimeline: t('dashboard.wallets.preview.equityTimeline'),
      noTimelineTitle: t('dashboard.wallets.preview.noTimelineTitle'),
      noTimelineDescription: t('dashboard.wallets.preview.noTimelineDescription'),
      cashflowEvents: t('dashboard.wallets.preview.cashflowEvents'),
      noEventsTitle: t('dashboard.wallets.preview.noEventsTitle'),
      noEventsDescription: t('dashboard.wallets.preview.noEventsDescription'),
      eventTime: t('dashboard.wallets.preview.eventTime'),
      eventSource: t('dashboard.wallets.preview.eventSource'),
      eventAmount: t('dashboard.wallets.preview.eventAmount'),
      eventReference: t('dashboard.wallets.preview.eventReference'),
      accountBalance: t('dashboard.wallets.preview.accountBalance'),
      freeBalance: t('dashboard.wallets.preview.freeBalance'),
      portfolioEquity: t('dashboard.wallets.preview.portfolioEquity'),
      completeness: t('dashboard.wallets.preview.completeness'),
    }),
    [t]
  );

  const loadData = useCallback(async () => {
    setError(null);
    try {
      await runAsyncWithState(setLoading, async () => {
        const [wallet, summary, timeline, events] = await Promise.all([
          getWallet(walletId),
          getWalletPerformanceSummary(walletId),
          getWalletEquityTimeline(walletId),
          getWalletCashflowEvents(walletId),
        ]);
        setData({ wallet, summary, timeline, events });
      });
    } catch (err) {
      setError(resolveUiErrorMessage(err, { fallback: copy.loadError }) ?? copy.loadError);
    }
  }, [copy.loadError, walletId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const chartPoints = useMemo(
    () => buildLinePoints(data?.timeline.points ?? []),
    [data?.timeline.points]
  );

  if (loading) {
    return <LoadingState title={copy.loading} description={copy.loadingDescription} variant='cards' />;
  }

  if (error) {
    return <ErrorState title={copy.errorTitle} description={error} retryLabel={copy.retry} onRetry={() => void loadData()} />;
  }

  if (!data) {
    return <EmptyState title={copy.noLedgerTitle} description={copy.noLedgerDescription} />;
  }

  const { wallet, summary, timeline, events } = data;
  const currency = summary.baseCurrency || wallet.baseCurrency;
  const formatWalletAmount = (value: number | null | undefined, maximumFractionDigits = 2) =>
    `${formatNumber(value, { maximumFractionDigits })} ${currency}`;

  const summaryCards = [
    { label: copy.currentBalance, value: formatWalletAmount(summary.currentAccountBalance) },
    { label: copy.allocatedBalance, value: formatWalletAmount(summary.currentAllocatedBalance) },
    { label: copy.contributedCapital, value: formatWalletAmount(summary.contributedCapital) },
    { label: copy.botPnl, value: formatWalletAmount(summary.botPnl), signed: summary.botPnl },
    { label: copy.walletDelta, value: formatPercent(summary.walletDeltaPercent), signed: summary.walletDeltaPercent ?? 0 },
    { label: copy.unclassifiedAdjustment, value: formatWalletAmount(summary.unclassifiedAdjustment), signed: summary.unclassifiedAdjustment },
  ];

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <TableToneBadge label={wallet.mode} tone={wallet.mode === 'LIVE' ? 'warning' : 'info'} />
          <TableToneBadge label={`${wallet.exchange} / ${wallet.marketType} / ${wallet.baseCurrency}`} tone='neutral' />
          <TableToneBadge label={`${copy.completeness}: ${summary.completeness}`} tone={completenessTone(summary.completeness)} />
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <Link href={dashboardRoutes.wallets.list} className='btn btn-sm btn-outline'>
            <LuArrowLeft className='h-4 w-4' />
            {copy.backToList}
          </Link>
          <Link href={dashboardRoutes.wallets.edit(wallet.id)} className='btn btn-sm btn-outline'>
            <LuWallet className='h-4 w-4' />
            {copy.edit}
          </Link>
          <button type='button' className='btn btn-sm btn-primary' onClick={() => void loadData()}>
            <LuRefreshCw className='h-4 w-4' />
            {copy.refresh}
          </button>
        </div>
      </div>

      {summary.completeness === 'PARTIAL' ? (
        <DegradedState title={copy.partialTitle} description={copy.partialDescription} />
      ) : null}
      {summary.completeness === 'UNAVAILABLE' ? (
        <EmptyState title={copy.noLedgerTitle} description={copy.noLedgerDescription} />
      ) : null}

      <section className='space-y-3 rounded-box border border-base-300/60 bg-base-100/85 p-4'>
        <div className='flex items-center justify-between gap-2'>
          <h2 className='inline-flex items-center gap-2 text-base font-semibold'>
            <LuActivity className='h-4 w-4' />
            {copy.summary}
          </h2>
          <span className='text-xs opacity-70'>
            {copy.latestSnapshot}: {formatDateTime(summary.latestSnapshotAt)}
          </span>
        </div>
        <div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-3'>
          {summaryCards.map((item) => (
            <div key={item.label} className='rounded-box border border-base-300/60 bg-base-200/45 p-3'>
              <span className='block text-xs opacity-65'>{item.label}</span>
              <span
                className={`mt-1 block text-lg font-semibold ${
                  typeof item.signed === 'number' && item.signed > 0
                    ? 'text-success'
                    : typeof item.signed === 'number' && item.signed < 0
                      ? 'text-error'
                      : ''
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
        <div className='grid gap-2 text-sm md:grid-cols-3'>
          <p className='rounded-box border border-base-300/50 bg-base-100/55 p-3'>
            <span className='block text-xs opacity-65'>{copy.botRealizedPnl}</span>
            <span className='font-semibold'>{formatWalletAmount(summary.botRealizedPnl)}</span>
          </p>
          <p className='rounded-box border border-base-300/50 bg-base-100/55 p-3'>
            <span className='block text-xs opacity-65'>{copy.botOpenPnl}</span>
            <span className='font-semibold'>{formatWalletAmount(summary.botOpenPnl)}</span>
          </p>
          <p className='rounded-box border border-base-300/50 bg-base-100/55 p-3'>
            <span className='block text-xs opacity-65'>{copy.feesFunding}</span>
            <span className='font-semibold'>{formatWalletAmount(summary.feesFunding)}</span>
          </p>
        </div>
      </section>

      <section className='space-y-3 rounded-box border border-base-300/60 bg-base-100/85 p-4'>
        <h2 className='inline-flex items-center gap-2 text-base font-semibold'>
          <LuChartLine className='h-4 w-4' />
          {copy.equityTimeline}
        </h2>
        {timeline.points.length === 0 ? (
          <EmptyState title={copy.noTimelineTitle} description={copy.noTimelineDescription} />
        ) : (
          <>
            <div className='rounded-box border border-base-300/60 bg-base-200/45 p-3'>
              <svg
                role='img'
                aria-label={copy.equityTimeline}
                className='h-44 w-full text-primary'
                viewBox='0 0 640 160'
                preserveAspectRatio='none'
              >
                <polyline fill='none' stroke='currentColor' strokeWidth='3' points={chartPoints} />
              </svg>
            </div>
            <div className='grid gap-2 text-xs md:grid-cols-3'>
              {timeline.points.slice(-3).map((point) => (
                <p key={point.timestamp} className='rounded-box border border-base-300/50 bg-base-100/55 p-2'>
                  <span className='block opacity-65'>{formatDateTime(point.timestamp)}</span>
                  <span className='block font-semibold'>{copy.portfolioEquity}: {formatWalletAmount(point.portfolioEquity)}</span>
                  <span className='block opacity-70'>{copy.contributedCapital}: {formatWalletAmount(point.contributedCapital)}</span>
                </p>
              ))}
            </div>
          </>
        )}
      </section>

      <section className='space-y-3 rounded-box border border-base-300/60 bg-base-100/85 p-4'>
        <h2 className='text-base font-semibold'>{copy.cashflowEvents}</h2>
        {events.length === 0 ? (
          <EmptyState title={copy.noEventsTitle} description={copy.noEventsDescription} />
        ) : (
          <div className='overflow-x-auto'>
            <table className='table table-sm'>
              <thead>
                <tr>
                  <th>{copy.eventTime}</th>
                  <th>{copy.eventSource}</th>
                  <th>{copy.eventAmount}</th>
                  <th>{copy.eventReference}</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{formatDateTime(event.occurredAt)}</td>
                    <td>
                      <TableToneBadge label={event.source} tone={sourceTone(event.source)} />
                    </td>
                    <td className={event.direction === 'OUT' ? 'text-error' : event.direction === 'IN' ? 'text-success' : ''}>
                      {directionPrefix(event.direction)}
                      {formatNumber(event.amount, { maximumFractionDigits: 4 })} {event.currency}
                    </td>
                    <td className='max-w-[16rem] truncate'>{event.exchangeEventId ?? event.balanceSnapshotId ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
