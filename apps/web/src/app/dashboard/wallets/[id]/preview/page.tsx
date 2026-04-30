'use client';

import { useParams } from 'next/navigation';
import { LuChartLine, LuWallet } from 'react-icons/lu';

import { useI18n } from '@/i18n/I18nProvider';
import WalletPreviewPanel from '@/features/wallets/components/WalletPreviewPanel';
import { PageTitle } from '@/ui/layout/dashboard/PageTitle';
import { dashboardRoutes } from '@/ui/layout/dashboard/dashboardRoutes';

export default function WalletPreviewPage() {
  const { t } = useI18n();
  const params = useParams<{ id: string }>();
  const id = params.id;

  return (
    <section className='w-full space-y-4'>
      <PageTitle
        title={t('dashboard.wallets.preview.title')}
        icon={<LuWallet className='h-5 w-5' />}
        breadcrumb={[
          { label: t('dashboard.common.dashboard'), href: '/dashboard' },
          { label: t('dashboard.wallets.title'), href: dashboardRoutes.wallets.list },
          {
            label: t('dashboard.wallets.preview.breadcrumb'),
            icon: <LuChartLine className='h-3.5 w-3.5' />,
          },
        ]}
      />
      <WalletPreviewPanel walletId={id} />
    </section>
  );
}
