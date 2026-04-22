'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LuList, LuWallet } from 'react-icons/lu';

import { useI18n } from '@/i18n/I18nProvider';
import { PageTitle } from '@/ui/layout/dashboard/PageTitle';
import { EmptyState, ErrorState, LoadingState } from '@/ui/components/ViewState';
import WalletsListTable from '@/features/wallets/components/WalletsListTable';
import { listWallets } from '@/features/wallets/services/wallets.service';
import { Wallet } from '@/features/wallets/types/wallet.type';
import { dashboardRoutes } from '@/ui/layout/dashboard/dashboardRoutes';
import { runAsyncWithState } from '@/lib/async';
import { resolveUiErrorMessage } from '@/lib/errorResolver';

export default function WalletsListPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [rows, setRows] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const copy = useMemo(
    () => ({
      loadError: t('dashboard.wallets.listPage.loadError'),
      title: t('dashboard.wallets.title'),
      breadcrumbWallets: t('dashboard.wallets.title'),
      breadcrumbList: t('dashboard.wallets.listLabel'),
      addLabel: t('dashboard.wallets.createLabel'),
      loading: t('dashboard.wallets.listPage.loading'),
      errorTitle: t('dashboard.wallets.listPage.errorTitle'),
      retry: t('dashboard.wallets.listPage.retry'),
      emptyTitle: t('dashboard.wallets.listPage.emptyTitle'),
      emptyDescription: t('dashboard.wallets.listPage.emptyDescription'),
    }),
    [t]
  );

  const loadData = useCallback(async () => {
    setError(null);
    try {
      await runAsyncWithState(setLoading, async () => {
        const data = await listWallets();
        setRows(data);
      });
    } catch (err) {
      setError(resolveUiErrorMessage(err, { fallback: copy.loadError }) ?? copy.loadError);
    }
  }, [copy.loadError]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <section className='w-full space-y-4'>
      <PageTitle
        title={copy.title}
        icon={<LuWallet className='h-5 w-5' />}
        breadcrumb={[
          { label: t('dashboard.common.dashboard'), href: '/dashboard' },
          { label: copy.breadcrumbWallets, href: dashboardRoutes.wallets.list },
          { label: copy.breadcrumbList, icon: <LuList className='h-3.5 w-3.5' /> },
        ]}
        onAdd={() => router.push(dashboardRoutes.wallets.create)}
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
        <WalletsListTable
          rows={rows}
          onDeleted={(id) => setRows((prev) => prev.filter((item) => item.id !== id))}
          onCloned={(wallet) => setRows((prev) => [...prev, wallet])}
        />
      ) : null}
    </section>
  );
}
