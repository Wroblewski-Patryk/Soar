'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PAGE_TITLE_ACTION_SAVE_CLASS, PageTitle } from '@/ui/layout/dashboard/PageTitle';
import StrategiesForm from '@/features/strategies/components/StrategyForm';
import { getStrategy, updateStrategy } from '@/features/strategies/api/strategies.api';
import { StrategyFormState } from '@/features/strategies/types/StrategyForm.type';
import { dtoToForm } from '@/features/strategies/utils/StrategyForm.map';
import { runAsyncWithState } from '@/lib/async';
import { resolveUiErrorMessage } from '@/lib/errorResolver';
import { ErrorState, LoadingState } from '@/ui/components/ViewState';
import { LuListChecks, LuPencilLine, LuSave } from 'react-icons/lu';
import { useI18n } from '@/i18n/I18nProvider';
import { dashboardRoutes } from '@/ui/layout/dashboard/dashboardRoutes';
import { FormAlert, FormMobileActionBar } from '@/ui/forms';

const STRATEGY_USED_BY_ACTIVE_BOT_ERROR = 'strategy is used by active bot and cannot be edited';
const STRATEGY_FORM_ID = 'strategy-form-edit';

type StrategyEditLockDetails = {
  botId?: string;
  botName?: string;
};

const extractStrategyEditLockDetails = (error: unknown): StrategyEditLockDetails | null => {
  if (!axios.isAxiosError(error)) return null;
  const details = error.response?.data?.error?.details;
  if (!details || typeof details !== 'object') return null;
  const candidate = details as StrategyEditLockDetails;
  if (!candidate.botId && !candidate.botName) return null;
  return candidate;
};

export default function StrategiesEditPage() {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [initial, setInitial] = useState<StrategyFormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeBotLock, setActiveBotLock] = useState<StrategyEditLockDetails | null>(null);

  const copy = {
    updated: t('dashboard.strategies.page.updated'),
    activeBotTitle: t('dashboard.strategies.page.activeBotTitle'),
    activeBotDescription: t('dashboard.strategies.page.activeBotDescription'),
    activeBotHint: t('dashboard.strategies.page.activeBotHint'),
    activeBotOpenBot: t('dashboard.strategies.page.activeBotOpenBot'),
    saveFailed: t('dashboard.strategies.page.saveFailed'),
    save: t('dashboard.strategies.saveLabel'),
    saving: t('dashboard.strategies.page.saving'),
    titleFallback: t('dashboard.strategies.title'),
    breadcrumbStrategies: t('dashboard.strategies.title'),
    breadcrumbEdit: t('dashboard.strategies.editLabel'),
    loading: t('dashboard.strategies.page.loading'),
    errorTitle: t('dashboard.strategies.page.errorTitle'),
    backToList: t('dashboard.strategies.page.backToList'),
    updatePrefix: t('dashboard.strategies.page.updatePrefix'),
  } as const;

  useEffect(() => {
    const load = async () => {
      setError(null);
      setActiveBotLock(null);
      try {
        await runAsyncWithState(setLoading, async () => {
          const data = await getStrategy(id);
          setInitial(dtoToForm(data));
        });
      } catch (err: unknown) {
        setError(resolveUiErrorMessage(err, { fallback: copy.errorTitle }) ?? copy.errorTitle);
      }
    };

    void load();
  }, [copy.errorTitle, id]);

  const handleUpdate = async (form: StrategyFormState) => {
    setActiveBotLock(null);
    try {
      await runAsyncWithState(setSubmitting, async () => {
        await updateStrategy(id, form);
        toast.success(copy.updated);
      });
    } catch (error: unknown) {
      const message = resolveUiErrorMessage(error, { fallback: copy.saveFailed }) ?? copy.saveFailed;
      if (message === STRATEGY_USED_BY_ACTIVE_BOT_ERROR) {
        const lockDetails = extractStrategyEditLockDetails(error);
        setActiveBotLock(lockDetails);
        toast.error(copy.activeBotTitle, { description: copy.activeBotDescription });
        return;
      }

      toast.error(copy.saveFailed, { description: message });
    }
  };

  return (
    <section className='w-full space-y-4'>
      <PageTitle
        title={copy.titleFallback}
        icon={<LuListChecks className='h-5 w-5' />}
        breadcrumb={[
          { label: t('dashboard.common.dashboard'), href: '/dashboard' },
          { label: copy.breadcrumbStrategies, href: '/dashboard/strategies/list' },
          {
            label: initial ? `${copy.updatePrefix} ${initial.name}` : copy.breadcrumbEdit,
            icon: <LuPencilLine className='h-3.5 w-3.5' />,
          },
        ]}
        actions={
          <button
            type='submit'
            form={STRATEGY_FORM_ID}
            className={`${PAGE_TITLE_ACTION_SAVE_CLASS} hidden md:inline-flex`}
            disabled={submitting}
          >
            <LuSave className='h-4 w-4' />
            {submitting ? copy.saving : copy.save}
          </button>
        }
      />

      {loading ? <LoadingState title={copy.loading} /> : null}
      {!loading && error ? (
        <ErrorState
          title={copy.errorTitle}
          description={error}
          retryLabel={copy.backToList}
          onRetry={() => router.push('/dashboard/strategies/list')}
        />
      ) : null}
      {!loading && !error && initial ? (
        <>
          {activeBotLock ? (
            <FormAlert variant='warning' title={copy.activeBotTitle}>
              <div className='space-y-2'>
                <p>{copy.activeBotDescription}</p>
                <p>
                  {activeBotLock.botName
                    ? `${copy.activeBotHint} ${activeBotLock.botName}.`
                    : copy.activeBotHint}
                </p>
                {activeBotLock.botId ? (
                  <div>
                    <button
                      type='button'
                      className='btn btn-sm btn-warning'
                      onClick={() => {
                        const botId = activeBotLock.botId;
                        if (!botId) return;
                        router.push(dashboardRoutes.bots.edit(botId));
                      }}
                    >
                      {copy.activeBotOpenBot}
                    </button>
                  </div>
                ) : null}
              </div>
            </FormAlert>
          ) : null}
          <StrategiesForm formId={STRATEGY_FORM_ID} initial={initial} onSubmit={handleUpdate} submitting={submitting} />
        </>
      ) : null}
      <FormMobileActionBar>
        <button
          type='submit'
          form={STRATEGY_FORM_ID}
          className='btn btn-primary w-full'
          disabled={submitting || loading}
        >
          <LuSave className='h-4 w-4' />
          {submitting ? copy.saving : copy.save}
        </button>
      </FormMobileActionBar>
    </section>
  );
}
