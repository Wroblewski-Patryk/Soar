'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { PageTitle } from '@/ui/layout/dashboard/PageTitle';
import { LoadingState } from '@/ui/components/ViewState';
import { useI18n } from '@/i18n/I18nProvider';
import { LuHouse } from 'react-icons/lu';

const DashboardRuntimeFallback = () => (
  <section aria-label="Runtime widgets" aria-busy="true">
    <LoadingState title="Runtime widgets" variant="cards" />
  </section>
);

const HomeLiveWidgets = dynamic(
  () => import('@/features/dashboard-home/components/HomeLiveWidgets'),
  {
    ssr: false,
    loading: DashboardRuntimeFallback,
  }
);

export default function DashboardPage() {
  const { user, loading, sessionExpired } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    if (!loading && !user) {
      router.push(sessionExpired ? '/auth/login?session=expired' : '/auth/login');
    }
  }, [loading, user, router, sessionExpired]);

  if (!loading && !user) {
    return <LoadingState title={t('dashboard.home.runtime.loadingTitle')} />;
  }

  return (
    <section className='w-full'>
      <PageTitle
        title={t('dashboard.common.dashboard')}
        icon={<LuHouse className='h-5 w-5' />}
        variant="flat"
        breadcrumb={[
          { label: t('dashboard.common.dashboard'), href: '/dashboard' },
        ]}
      />

      <HomeLiveWidgets authConfirmed={Boolean(user)} />
    </section>
  );
}

