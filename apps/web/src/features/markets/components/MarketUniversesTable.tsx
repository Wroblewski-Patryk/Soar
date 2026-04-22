'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLocaleFormatting } from '../../../i18n/useLocaleFormatting';
import { useI18n } from '../../../i18n/I18nProvider';
import DataTable, { DataTableColumn } from '../../../ui/components/DataTable';
import ConfirmModal from '../../../ui/components/ConfirmModal';
import { TablePresetButtonAction, TableToneBadge } from '../../../ui/components/TableUi';
import { createMarketUniverse, deleteMarketUniverse, fetchMarketCatalog } from '../services/markets.service';
import { MarketUniverse } from '../types/marketUniverse.type';
import { uniqueSortedSymbols } from '../utils/marketUniverseHelpers';
import { getAxiosMessage } from '@/lib/getAxiosMessage';
import { normalizeBaseCurrency } from '@/lib/symbols';
import { normalizeUppercaseToken } from '@/lib/text';
import { buildNextCloneName } from '@/lib/cloneNaming';

const MARKET_UNIVERSE_ACTIVE_BOT_DELETE_ERROR =
  'market universe is used by active bot and cannot be deleted';

type MarketUniversesTableProps = {
  rows: MarketUniverse[];
  onDeleted: (id: string) => void;
  onCloned?: (row: MarketUniverse) => void;
};

type ResolvedTickers = {
  tickers: string[];
  loading: boolean;
};

const resolveMinVolumeRules = (row: MarketUniverse) => {
  const rules = (row.filterRules ?? null) as
    | { minQuoteVolumeEnabled?: boolean; minQuoteVolume24h?: number; minVolume24h?: number }
    | null;

  const enabled =
    typeof rules?.minQuoteVolumeEnabled === 'boolean'
      ? rules.minQuoteVolumeEnabled
      : typeof rules?.minQuoteVolume24h === 'number' || typeof rules?.minVolume24h === 'number';
  const min = typeof rules?.minQuoteVolume24h === 'number'
    ? rules.minQuoteVolume24h
    : (typeof rules?.minVolume24h === 'number' ? rules.minVolume24h : 0);

  return { enabled, min };
};

const buildCatalogKey = (row: MarketUniverse) =>
  `${normalizeUppercaseToken(row.exchange ?? 'BINANCE')}|${row.marketType}|${normalizeBaseCurrency(row.baseCurrency)}`;

export default function MarketUniversesTable({ rows, onDeleted, onCloned }: MarketUniversesTableProps) {
  const { t } = useI18n();
  const router = useRouter();
  const { formatDate } = useLocaleFormatting();
  const [deleteTarget, setDeleteTarget] = useState<MarketUniverse | null>(null);
  const [cloningId, setCloningId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [resolvedTickersMap, setResolvedTickersMap] = useState<Record<string, ResolvedTickers>>({});

  const copy = useMemo(
    () =>
      ({
        colName: t('dashboard.markets.table.colName'),
        colExchange: t('dashboard.markets.table.colExchange'),
        colMarket: t('dashboard.markets.table.colMarket'),
        colBase: t('dashboard.markets.table.colBase'),
        colWhitelist: t('dashboard.markets.table.colWhitelist'),
        colBlacklist: t('dashboard.markets.table.colBlacklist'),
        colTickers: t('dashboard.markets.table.colTickers'),
        colCreatedAt: t('dashboard.markets.table.colCreatedAt'),
        colActions: t('dashboard.markets.table.colActions'),
        showAll: t('dashboard.markets.table.showAll'),
        hide: t('dashboard.markets.table.hide'),
        edit: t('dashboard.markets.table.edit'),
        remove: t('dashboard.markets.table.remove'),
        clone: t('dashboard.markets.table.clone'),
        clonedToast: t('dashboard.markets.table.clonedToast'),
        cloneFailedTitle: t('dashboard.markets.table.cloneFailedTitle'),
        deletedToast: t('dashboard.markets.table.deletedToast'),
        deleteFailedTitle: t('dashboard.markets.table.deleteFailedTitle'),
        activeBotDeleteTitle: t('dashboard.markets.table.activeBotDeleteTitle'),
        activeBotDeleteDescription: t('dashboard.markets.table.activeBotDeleteDescription'),
        filterPlaceholder: t('dashboard.markets.table.filterPlaceholder'),
        empty: t('dashboard.markets.table.empty'),
        noTickers: t('dashboard.markets.table.noTickers'),
        tickersLabel: t('dashboard.markets.table.tickersLabel'),
        confirmTitle: t('dashboard.markets.table.confirmTitle'),
        confirmDescription: t('dashboard.markets.table.confirmDescription'),
        confirm: t('dashboard.markets.table.confirm'),
        cancel: t('dashboard.markets.table.cancel'),
      }),
    [t]
  );

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (rows.length === 0) {
        setResolvedTickersMap({});
        return;
      }

      setResolvedTickersMap((prev) => {
        const next = { ...prev };
        for (const row of rows) {
          next[row.id] = { tickers: next[row.id]?.tickers ?? [], loading: true };
        }
        return next;
      });

      const catalogByKey = new Map<string, Awaited<ReturnType<typeof fetchMarketCatalog>>>();
      for (const row of rows) {
        const key = buildCatalogKey(row);
        if (!catalogByKey.has(key)) {
          const catalog = await fetchMarketCatalog({
            exchange: row.exchange ?? 'BINANCE',
            marketType: row.marketType,
            baseCurrency: normalizeBaseCurrency(row.baseCurrency),
          });
          catalogByKey.set(key, catalog);
        }
      }

      if (!active) return;

      const nextMap: Record<string, ResolvedTickers> = {};
      for (const row of rows) {
        const key = buildCatalogKey(row);
        const catalog = catalogByKey.get(key);
        const rules = resolveMinVolumeRules(row);
        const filteredByVolume = (catalog?.markets ?? []).filter((market) =>
          rules.enabled ? (market.quoteVolume24h ?? 0) >= rules.min : true
        );
        const availableSymbols = filteredByVolume.map((item) => item.symbol);
        const availableSet = new Set(availableSymbols);
        const include = row.whitelist.length > 0
          ? row.whitelist.filter((symbol) => availableSet.has(symbol))
          : availableSymbols;
        const blacklistSet = new Set(row.blacklist);
        const tickers = uniqueSortedSymbols(include).filter((symbol) => !blacklistSet.has(symbol));

        nextMap[row.id] = { tickers, loading: false };
      }

      setResolvedTickersMap(nextMap);
    };

    void load().catch(() => {
      if (!active) return;
      setResolvedTickersMap((prev) => {
        const next = { ...prev };
        for (const row of rows) {
          next[row.id] = { tickers: next[row.id]?.tickers ?? [], loading: false };
        }
        return next;
      });
    });

    return () => {
      active = false;
    };
  }, [rows]);

  const handleClone = useCallback(async (row: MarketUniverse) => {
    setCloningId(row.id);
    try {
      const created = await createMarketUniverse({
        name: buildNextCloneName(row.name, rows.map((item) => item.name)),
        exchange: row.exchange,
        marketType: row.marketType,
        baseCurrency: row.baseCurrency,
        filterRules: row.filterRules ?? undefined,
        whitelist: [...row.whitelist],
        blacklist: [...row.blacklist],
      });
      onCloned?.(created);
      toast.success(copy.clonedToast);
    } catch (error: unknown) {
      toast.error(copy.cloneFailedTitle, { description: getAxiosMessage(error) });
    } finally {
      setCloningId(null);
    }
  }, [copy.cloneFailedTitle, copy.clonedToast, onCloned, rows]);

  const columns = useMemo<DataTableColumn<MarketUniverse>[]>(
    () => [
      { key: 'name', label: copy.colName, sortable: true, accessor: (row) => row.name },
      { key: 'exchange', label: copy.colExchange, sortable: true, accessor: (row) => row.exchange ?? 'BINANCE' },
      { key: 'marketType', label: copy.colMarket, sortable: true, accessor: (row) => row.marketType },
      { key: 'baseCurrency', label: copy.colBase, sortable: true, accessor: (row) => row.baseCurrency },
      { key: 'whitelist', label: copy.colWhitelist, sortable: true, accessor: (row) => row.whitelist.length },
      { key: 'blacklist', label: copy.colBlacklist, sortable: true, accessor: (row) => row.blacklist.length },
      {
        key: 'resolvedTickers',
        label: copy.colTickers,
        sortable: true,
        accessor: (row) => resolvedTickersMap[row.id]?.tickers.length ?? 0,
        render: (row) => {
          const resolved = resolvedTickersMap[row.id];
          const count = resolved?.tickers.length ?? 0;
          const expanded = Boolean(expandedRows[row.id]);

          return (
            <div className='flex items-center gap-2'>
              <TableToneBadge label={resolved?.loading ? '...' : `${count}`} tone='neutral' className='font-mono' />
              {!resolved?.loading && count > 0 ? (
                <button
                  type='button'
                  className='btn btn-xs btn-ghost'
                  onClick={() =>
                    setExpandedRows((prev) => ({ ...prev, [row.id]: !prev[row.id] }))
                  }
                >
                  {expanded ? copy.hide : copy.showAll}
                </button>
              ) : null}
            </div>
          );
        },
      },
      {
        key: 'createdAt',
        label: copy.colCreatedAt,
        sortable: true,
        accessor: (row) => row.createdAt ?? '',
        render: (row) => (row.createdAt ? formatDate(row.createdAt) : '-'),
      },
      {
        key: 'actions',
        label: copy.colActions,
        className: 'w-44 text-center',
        render: (row) => (
          <div className='flex items-center justify-center gap-2'>
            <TablePresetButtonAction
              preset='edit'
              label={copy.edit}
              onClick={() => router.push(`/dashboard/markets/${row.id}/edit`)}
            />
            <TablePresetButtonAction
              preset='clone'
              label={copy.clone}
              onClick={() => void handleClone(row)}
              disabled={cloningId === row.id}
            />
            <TablePresetButtonAction
              preset='delete'
              label={copy.remove}
              onClick={() => setDeleteTarget(row)}
            />
          </div>
        ),
      },
    ],
    [cloningId, copy, expandedRows, formatDate, handleClone, resolvedTickersMap, router]
  );

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMarketUniverse(deleteTarget.id);
      onDeleted(deleteTarget.id);
      toast.success(copy.deletedToast);
      setDeleteTarget(null);
    } catch (error: unknown) {
      const message = getAxiosMessage(error);
      if (message === MARKET_UNIVERSE_ACTIVE_BOT_DELETE_ERROR) {
        toast.error(copy.activeBotDeleteTitle, {
          description: copy.activeBotDeleteDescription,
        });
      } else {
        toast.error(copy.deleteFailedTitle, { description: message });
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <DataTable
        compact
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        filterPlaceholder={copy.filterPlaceholder}
        filterFn={(row, query) => {
          const normalized = normalizeUppercaseToken(query);
          return (
            normalizeUppercaseToken(row.name).includes(normalized) ||
            normalizeUppercaseToken(row.exchange ?? 'BINANCE').includes(normalized) ||
            normalizeBaseCurrency(row.baseCurrency).includes(normalized) ||
            normalizeUppercaseToken(row.marketType).includes(normalized)
          );
        }}
        emptyText={copy.empty}
        advancedMode
        columnVisibilityPreferenceKey='markets.list'
        isRowExpanded={(row) => Boolean(expandedRows[row.id])}
        renderExpandedRow={(row) => {
          const resolved = resolvedTickersMap[row.id];
          if (!resolved || resolved.tickers.length === 0) {
            return <p className='text-sm opacity-70'>{copy.noTickers}</p>;
          }

          return (
            <div className='rounded-box border border-base-300 bg-base-200 p-3'>
              <p className='mb-2 text-sm font-medium'>
                {copy.tickersLabel} ({resolved.tickers.length})
              </p>
              <div className='max-h-64 overflow-y-auto overflow-x-hidden'>
                <div className='flex flex-wrap gap-2'>
                  {resolved.tickers.map((symbol) => (
                    <span key={`${row.id}-${symbol}`} className='badge badge-outline font-mono'>
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        }}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title={copy.confirmTitle}
        description={deleteTarget ? copy.confirmDescription.replace('{name}', deleteTarget.name) : undefined}
        confirmLabel={copy.confirm}
        cancelLabel={copy.cancel}
        confirmVariant='error'
        pending={deleting}
        onCancel={() => {
          if (deleting) return;
          setDeleteTarget(null);
        }}
        onConfirm={() => void handleConfirmDelete()}
      />
    </>
  );
}
