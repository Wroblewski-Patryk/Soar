'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageTitle } from '@/ui/layout/dashboard/PageTitle';
import { EmptyState, ErrorState, LoadingState } from '@/ui/components/ViewState';
import MarketUniversesTable from '@/features/markets/components/MarketUniversesTable';
import { listMarketUniverses } from '@/features/markets/services/markets.service';
import { MarketUniverse } from '@/features/markets/types/marketUniverse.type';
import { LuChartCandlestick, LuList } from 'react-icons/lu';
import { useI18n } from '@/i18n/I18nProvider';
import { runAsyncWithState } from '@/lib/async';
import { resolveUiErrorMessage } from '@/lib/errorResolver';

export default function MarketsListPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [rows, setRows] = useState<MarketUniverse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const copy = useMemo(
    () => ({
      loadError: t('dashboard.markets.listPage.loadError'),
      breadcrumbMarkets: t('dashboard.markets.title'),
      breadcrumbList: t('dashboard.markets.listLabel'),
      addLabel: t('dashboard.markets.createLabel'),
      loading: t('dashboard.markets.listPage.loading'),
      errorTitle: t('dashboard.markets.listPage.errorTitle'),
      retry: t('dashboard.markets.listPage.retry'),
      emptyTitle: t('dashboard.markets.listPage.emptyTitle'),
      emptyDescription: t('dashboard.markets.listPage.emptyDescription'),
    }),
    [t]
  );

  const loadData = useCallback(async () => {
    setError(null);
    try {
      await runAsyncWithState(setLoading, async () => {
        const data = await listMarketUniverses();
        setRows(data);
      });
    } catch (err: unknown) {
      setError(resolveUiErrorMessage(err, { fallback: copy.loadError }) ?? copy.loadError);
    }
  }, [copy.loadError]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <section className='w-full space-y-4'>
      <PageTitle
        title={copy.breadcrumbMarkets}
        icon={<LuChartCandlestick className='h-5 w-5' />}
        breadcrumb={[
          { label: t('dashboard.common.dashboard'), href: '/dashboard' },
          { label: copy.breadcrumbMarkets, href: '/dashboard/markets/list' },
          { label: copy.breadcrumbList, icon: <LuList className='h-3.5 w-3.5' /> },
        ]}
        onAdd={() => router.push('/dashboard/markets/create')}
        addLabel={copy.addLabel}
      />

      {loading ? <LoadingState title={copy.loading} /> : null}
      {!loading && error ? (
        <ErrorState title={copy.errorTitle} description={error} retryLabel={copy.retry} onRetry={() => void loadData()} />
      ) : null}
      {!loading && !error && rows.length === 0 ? (
        <EmptyState title={copy.emptyTitle} description={copy.emptyDescription} />
      ) : null}
      {!loading && !error && rows.length > 0 ? (
        <MarketUniversesTable
          rows={rows}
          onDeleted={(id) => setRows((prev) => prev.filter((item) => item.id !== id))}
          onCloned={(row) => setRows((prev) => [...prev, row])}
        />
      ) : null}
    </section>
  );
}
