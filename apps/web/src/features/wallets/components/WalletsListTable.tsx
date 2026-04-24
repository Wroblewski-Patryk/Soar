'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/i18n/I18nProvider';
import { createWallet, deleteWallet } from '../services/wallets.service';
import { Wallet } from '../types/wallet.type';
import { dashboardRoutes } from '@/ui/layout/dashboard/dashboardRoutes';
import { getAxiosMessage } from '@/lib/getAxiosMessage';
import ConfirmModal from '@/ui/components/ConfirmModal';
import DataTable, { DataTableColumn } from '@/ui/components/DataTable';
import { TablePresetButtonAction, TablePresetLinkAction, TableToneBadge } from '@/ui/components/TableUi';
import { buildNextCloneName } from '@/lib/cloneNaming';

type WalletsListTableProps = {
  rows: Wallet[];
  onDeleted: (id: string) => void;
  onCloned?: (wallet: Wallet) => void;
};

export default function WalletsListTable({ rows, onDeleted, onCloned }: WalletsListTableProps) {
  const { t } = useI18n();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [cloningId, setCloningId] = useState<string | null>(null);
  const [pendingDeleteWallet, setPendingDeleteWallet] = useState<Wallet | null>(null);

  const copy = useMemo(
    () =>
      ({
        name: t('dashboard.wallets.table.name'),
        mode: t('dashboard.wallets.table.mode'),
        exchange: t('dashboard.wallets.table.exchange'),
        marketType: t('dashboard.wallets.table.marketType'),
        baseCurrency: t('dashboard.wallets.table.baseCurrency'),
        allocation: t('dashboard.wallets.table.allocation'),
        actions: t('dashboard.wallets.table.actions'),
        edit: t('dashboard.wallets.table.edit'),
        delete: t('dashboard.wallets.table.delete'),
        deleting: t('dashboard.wallets.table.deleting'),
        deleteConfirm: t('dashboard.wallets.table.deleteConfirm'),
        deleted: t('dashboard.wallets.table.deleted'),
        deleteFailed: t('dashboard.wallets.table.deleteFailed'),
        clone: t('dashboard.wallets.table.clone'),
        cloned: t('dashboard.wallets.table.cloned'),
        cloneFailed: t('dashboard.wallets.table.cloneFailed'),
        paperLabel: t('dashboard.wallets.table.paperLabel'),
        livePercent: t('dashboard.wallets.table.livePercent'),
        liveFixed: t('dashboard.wallets.table.liveFixed'),
        searchPlaceholder: t('dashboard.wallets.table.searchPlaceholder'),
        emptyText: t('dashboard.wallets.table.emptyText'),
        apiKey: t('dashboard.wallets.table.apiKey'),
        apiKeyConnected: t('dashboard.wallets.table.apiKeyConnected'),
        apiKeyMissing: t('dashboard.wallets.table.apiKeyMissing'),
        capitalPaper: t('dashboard.wallets.table.capitalPaper'),
        capitalPaperReset: t('dashboard.wallets.table.capitalPaperReset'),
        capitalLivePercent: t('dashboard.wallets.table.capitalLivePercent'),
        capitalLiveFixed: t('dashboard.wallets.table.capitalLiveFixed'),
        capitalLiveFull: t('dashboard.wallets.table.capitalLiveFull'),
        columns: t('dashboard.wallets.table.columns'),
        cancel: t('dashboard.wallets.table.cancel'),
      }),
    [t]
  );

  const formatAllocation = useCallback(
    (wallet: Wallet) => {
      if (wallet.mode === 'PAPER') {
        return `${wallet.paperInitialBalance} ${wallet.baseCurrency} (${copy.paperLabel})`;
      }
      if (wallet.liveAllocationMode === 'PERCENT') {
        return copy.livePercent.replace('{value}', String(wallet.liveAllocationValue ?? 0));
      }
      return copy.liveFixed.replace('{value}', String(wallet.liveAllocationValue ?? 0));
    },
    [copy.liveFixed, copy.livePercent, copy.paperLabel]
  );
  const formatCapitalAuthority = useCallback(
    (wallet: Wallet) => {
      if (wallet.mode === 'PAPER') {
        return wallet.paperResetAt ? copy.capitalPaperReset : copy.capitalPaper;
      }
      if (wallet.liveAllocationMode === 'PERCENT') return copy.capitalLivePercent;
      if (wallet.liveAllocationMode === 'FIXED') return copy.capitalLiveFixed;
      return copy.capitalLiveFull;
    },
    [copy.capitalLiveFixed, copy.capitalLiveFull, copy.capitalLivePercent, copy.capitalPaper, copy.capitalPaperReset]
  );

  const handleDelete = async () => {
    if (!pendingDeleteWallet) return;
    setDeletingId(pendingDeleteWallet.id);
    try {
      await deleteWallet(pendingDeleteWallet.id);
      onDeleted(pendingDeleteWallet.id);
      toast.success(copy.deleted);
    } catch (err) {
      toast.error(copy.deleteFailed, { description: getAxiosMessage(err) });
    } finally {
      setDeletingId(null);
      setPendingDeleteWallet(null);
    }
  };

  const handleClone = useCallback(
    async (wallet: Wallet) => {
      setCloningId(wallet.id);
      try {
        const clonedWallet = await createWallet({
          name: buildNextCloneName(wallet.name, rows.map((item) => item.name)),
          mode: wallet.mode,
          exchange: wallet.exchange,
          marketType: wallet.marketType,
          baseCurrency: wallet.baseCurrency,
          paperInitialBalance: wallet.paperInitialBalance,
          liveAllocationMode: wallet.liveAllocationMode ?? null,
          liveAllocationValue: wallet.liveAllocationValue ?? null,
          apiKeyId: wallet.apiKeyId ?? null,
          manageExternalPositions: wallet.manageExternalPositions ?? false,
        });
        onCloned?.(clonedWallet);
        toast.success(copy.cloned);
      } catch (err) {
        toast.error(copy.cloneFailed, { description: getAxiosMessage(err) });
      } finally {
        setCloningId(null);
      }
    },
    [copy.cloneFailed, copy.cloned, onCloned, rows]
  );

  const columns = useMemo<DataTableColumn<Wallet>[]>(
    () => [
      {
        key: 'name',
        label: copy.name,
        sortable: true,
        accessor: (row) => row.name,
        className: 'font-medium',
      },
      {
        key: 'mode',
        label: copy.mode,
        sortable: true,
        accessor: (row) => row.mode,
        render: (row) => (
          <TableToneBadge label={row.mode} tone={row.mode === 'LIVE' ? 'warning' : 'info'} />
        ),
      },
      {
        key: 'exchange',
        label: copy.exchange,
        sortable: true,
        accessor: (row) => row.exchange,
      },
      {
        key: 'marketType',
        label: copy.marketType,
        sortable: true,
        accessor: (row) => row.marketType,
      },
      {
        key: 'baseCurrency',
        label: copy.baseCurrency,
        sortable: true,
        accessor: (row) => row.baseCurrency,
      },
      {
        key: 'allocation',
        label: copy.allocation,
        sortable: true,
        accessor: (row) => formatAllocation(row),
        render: (row) => (
          <div className='space-y-0.5'>
            <p>{formatAllocation(row)}</p>
            <p className='text-xs opacity-60'>{formatCapitalAuthority(row)}</p>
          </div>
        ),
      },
      {
        key: 'apiKey',
        label: copy.apiKey,
        sortable: true,
        accessor: (row) => (row.apiKeyId ? copy.apiKeyConnected : copy.apiKeyMissing),
        render: (row) => (
          <TableToneBadge
            label={row.apiKeyId ? copy.apiKeyConnected : copy.apiKeyMissing}
            tone={row.apiKeyId ? 'success' : 'neutral'}
          />
        ),
      },
      {
        key: 'actions',
        label: copy.actions,
        className: 'w-56 text-right',
        render: (row) => (
          <div className='flex items-center justify-end gap-2'>
            <TablePresetLinkAction
              preset='edit'
              href={dashboardRoutes.wallets.edit(row.id)}
              label={copy.edit}
            />
            <TablePresetButtonAction
              preset='clone'
              label={copy.clone}
              onClick={() => void handleClone(row)}
              disabled={cloningId === row.id}
            />
            <TablePresetButtonAction
              preset='delete'
              label={deletingId === row.id ? copy.deleting : copy.delete}
              onClick={() => setPendingDeleteWallet(row)}
              disabled={deletingId === row.id}
            />
          </div>
        ),
      },
    ],
    [
      copy.actions,
      copy.allocation,
      copy.apiKey,
      copy.apiKeyConnected,
      copy.apiKeyMissing,
      copy.baseCurrency,
      copy.delete,
      copy.deleting,
      copy.edit,
      copy.exchange,
      copy.clone,
      copy.marketType,
      copy.mode,
      copy.name,
      cloningId,
      deletingId,
      formatAllocation,
      formatCapitalAuthority,
      handleClone,
    ]
  );

  return (
    <div className='space-y-3'>
      <DataTable
        compact
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        filterPlaceholder={copy.searchPlaceholder}
        filterFn={(row, query) => {
          const normalized = query.trim().toLowerCase();
          return (
            row.name.toLowerCase().includes(normalized) ||
            row.mode.toLowerCase().includes(normalized) ||
            row.exchange.toLowerCase().includes(normalized) ||
            row.marketType.toLowerCase().includes(normalized) ||
            row.baseCurrency.toLowerCase().includes(normalized)
          );
        }}
        emptyText={copy.emptyText}
        advancedMode
        columnsToggleLabel={copy.columns}
        columnVisibilityPreferenceKey='wallets.list'
      />

      <ConfirmModal
        open={Boolean(pendingDeleteWallet)}
        title={copy.delete}
        description={pendingDeleteWallet ? `"${pendingDeleteWallet.name}" - ${copy.deleteConfirm}` : copy.deleteConfirm}
        confirmLabel={copy.delete}
        cancelLabel={copy.cancel}
        confirmVariant='error'
        pending={Boolean(deletingId)}
        onCancel={() => {
          if (deletingId) return;
          setPendingDeleteWallet(null);
        }}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
