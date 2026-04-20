'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import DataTable, { DataTableColumn } from '@/ui/components/DataTable';
import ConfirmModal from '@/ui/components/ConfirmModal';
import { TablePresetButtonAction, TablePresetLinkAction, TableToneBadge } from '@/ui/components/TableUi';
import { useLocaleFormatting } from '@/i18n/useLocaleFormatting';
import { BacktestRun, BacktestStatus } from '../types/backtest.type';
import { useI18n } from '../../../i18n/I18nProvider';
import { deleteBacktestRun } from '../services/backtests.service';
import { getAxiosMessage } from '@/lib/getAxiosMessage';
import { normalizeUppercaseToken } from '@/lib/text';

type BacktestsRunsTableProps = {
  rows: BacktestRun[];
  onDeleted?: (id: string) => void;
};

const statusBadgeTone = (status: BacktestStatus): 'success' | 'danger' | 'info' | 'warning' => {
  if (status === 'COMPLETED') return 'success';
  if (status === 'FAILED' || status === 'CANCELED') return 'danger';
  if (status === 'RUNNING') return 'info';
  return 'warning';
};

export default function BacktestsRunsTable({ rows, onDeleted }: BacktestsRunsTableProps) {
  const { formatDateTime, formatNumber } = useLocaleFormatting();
  const { t } = useI18n();
  const resolveCopy = useCallback(
    (key: string, fallback: string) => {
      const translated = t(key);
      return translated === key ? fallback : translated;
    },
    [t]
  );
  const [selectedDeleteRun, setSelectedDeleteRun] = useState<BacktestRun | null>(null);
  const [deleting, setDeleting] = useState(false);
  const copy = useMemo(
    () => ({
      colStrategy: resolveCopy('dashboard.backtests.runsTable.colStrategy', 'Strategy'),
      colMarkets: resolveCopy('dashboard.backtests.runsTable.colMarkets', 'Markets'),
      colInitBalance: resolveCopy('dashboard.backtests.runsTable.colInitBalance', 'Init balance'),
      colStatus: t('dashboard.backtests.runsTable.colStatus'),
      colStart: t('dashboard.backtests.runsTable.colStart'),
      colActions: t('dashboard.backtests.runsTable.colActions'),
      preview: t('dashboard.backtests.runsTable.preview'),
      delete: t('dashboard.backtests.runsTable.delete'),
      deleted: t('dashboard.backtests.runsTable.deleted'),
      deleteFailed: t('dashboard.backtests.runsTable.deleteFailed'),
      deleteTitle: t('dashboard.backtests.runsTable.deleteTitle'),
      cancel: t('dashboard.backtests.runsTable.cancel'),
      filterPlaceholder: t('dashboard.backtests.runsTable.filterPlaceholder'),
      emptyText: t('dashboard.backtests.runsTable.emptyText'),
      statusPending: t('dashboard.backtests.runsTable.statusPending'),
      statusRunning: t('dashboard.backtests.runsTable.statusRunning'),
      statusCompleted: t('dashboard.backtests.runsTable.statusCompleted'),
      statusFailed: t('dashboard.backtests.runsTable.statusFailed'),
      statusCanceled: t('dashboard.backtests.runsTable.statusCanceled'),
    }),
    [resolveCopy, t]
  );
  const getStatusLabel = useCallback(
    (status: BacktestStatus) => {
      if (status === 'PENDING') return copy.statusPending;
      if (status === 'RUNNING') return copy.statusRunning;
      if (status === 'COMPLETED') return copy.statusCompleted;
      if (status === 'FAILED') return copy.statusFailed;
      return copy.statusCanceled;
    },
    [
      copy.statusCanceled,
      copy.statusCompleted,
      copy.statusFailed,
      copy.statusPending,
      copy.statusRunning,
    ]
  );

  const handleDelete = async () => {
    if (!selectedDeleteRun) return;
    setDeleting(true);
    try {
      await deleteBacktestRun(selectedDeleteRun.id);
      onDeleted?.(selectedDeleteRun.id);
      toast.success(copy.deleted);
      setSelectedDeleteRun(null);
    } catch (error: unknown) {
      toast.error(copy.deleteFailed, {
        description: getAxiosMessage(error),
      });
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo<DataTableColumn<BacktestRun>[]>(
    () => [
      {
        key: 'strategyName',
        label: copy.colStrategy,
        sortable: true,
        accessor: (row) => row.strategyName ?? row.strategyId ?? '-',
        className: 'font-medium',
      },
      {
        key: 'markets',
        label: copy.colMarkets,
        sortable: true,
        accessor: (row) => (row.markets && row.markets.length > 0 ? row.markets.join(', ') : row.symbol),
      },
      {
        key: 'initialBalance',
        label: copy.colInitBalance,
        sortable: true,
        accessor: (row) => {
          if (typeof row.initialBalance === 'number' && Number.isFinite(row.initialBalance)) {
            return row.initialBalance;
          }
          const initialBalanceCandidate = Number((row.seedConfig as { initialBalance?: unknown } | null)?.initialBalance);
          return Number.isFinite(initialBalanceCandidate) ? initialBalanceCandidate : 10_000;
        },
        render: (row) => {
          const initialBalanceCandidate = Number((row.seedConfig as { initialBalance?: unknown } | null)?.initialBalance);
          const resolvedInitialBalance =
            typeof row.initialBalance === 'number' && Number.isFinite(row.initialBalance)
              ? row.initialBalance
              : Number.isFinite(initialBalanceCandidate)
                ? initialBalanceCandidate
                : 10_000;
          return formatNumber(resolvedInitialBalance, { maximumFractionDigits: 2 });
        },
      },
      {
        key: 'status',
        label: copy.colStatus,
        sortable: true,
        accessor: (row) => row.status,
        render: (row) => <TableToneBadge label={getStatusLabel(row.status)} tone={statusBadgeTone(row.status)} />,
      },
      {
        key: 'startedAt',
        label: copy.colStart,
        sortable: true,
        accessor: (row) => row.startedAt,
        render: (row) => formatDateTime(row.startedAt),
      },
      {
        key: 'actions',
        label: copy.colActions,
        className: 'w-28 text-center',
        render: (row) => (
          <div className='flex items-center justify-center gap-2'>
            <TablePresetLinkAction
              preset='preview'
              href={`/dashboard/backtests/${row.id}`}
              label={`${copy.preview} ${row.name}`}
            />
            <TablePresetButtonAction
              preset='delete'
              label={copy.delete}
              onClick={() => setSelectedDeleteRun(row)}
            />
          </div>
        ),
      },
    ],
    [
      copy.colActions,
      copy.colInitBalance,
      copy.colMarkets,
      copy.colStart,
      copy.colStatus,
      copy.colStrategy,
      copy.delete,
      copy.preview,
      formatDateTime,
      formatNumber,
      getStatusLabel,
    ]
  );

  return (
    <div className='space-y-3'>
      <DataTable
        compact
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        filterPlaceholder={copy.filterPlaceholder}
        filterFn={(row, query) => {
          const normalized = normalizeUppercaseToken(query);
          const marketsValue = Array.isArray(row.markets) && row.markets.length > 0 ? row.markets.join(' ') : row.symbol;
          const initialBalanceValue =
            typeof row.initialBalance === 'number'
              ? String(row.initialBalance)
              : String((row.seedConfig as { initialBalance?: unknown } | null)?.initialBalance ?? '');
          return (
            normalizeUppercaseToken(row.strategyName ?? row.strategyId ?? row.name).includes(normalized) ||
            normalizeUppercaseToken(marketsValue).includes(normalized) ||
            normalizeUppercaseToken(initialBalanceValue).includes(normalized) ||
            normalizeUppercaseToken(row.status).includes(normalized)
          );
        }}
        emptyText={copy.emptyText}
        advancedMode
        columnVisibilityPreferenceKey='backtests.runs.list'
      />

      <ConfirmModal
        open={Boolean(selectedDeleteRun)}
        title={copy.deleteTitle}
        description={
          selectedDeleteRun
            ? `${copy.delete} "${selectedDeleteRun.name}"?`
            : copy.delete
        }
        confirmLabel={copy.delete}
        cancelLabel={copy.cancel}
        confirmVariant='error'
        pending={deleting}
        onCancel={() => {
          if (deleting) return;
          setSelectedDeleteRun(null);
        }}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}

