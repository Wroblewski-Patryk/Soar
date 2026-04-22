"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { createStrategy, deleteStrategy, listStrategies } from "../api/strategies.api";
import { StrategyDto } from "../types/StrategyForm.type";
import { EmptyState, ErrorState } from "@/ui/components/ViewState";
import { SkeletonTableRows } from "@/ui/components/loading";
import { useLocaleFormatting } from "@/i18n/useLocaleFormatting";
import { useI18n } from "@/i18n/I18nProvider";
import DataTable, { DataTableColumn } from "@/ui/components/DataTable";
import ConfirmModal from "@/ui/components/ConfirmModal";
import { TablePresetButtonAction } from "@/ui/components/TableUi";
import { getAxiosMessage } from '@/lib/getAxiosMessage';
import { dtoToForm } from "../utils/StrategyForm.map";
import { buildNextCloneName } from "@/lib/cloneNaming";
import { runAsyncWithViewState } from "@/lib/async";

export default function StrategiesList() {
  const { t } = useI18n();
  const { formatDate } = useLocaleFormatting();
  const [strategies, setStrategies] = useState<StrategyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyDto | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [cloningId, setCloningId] = useState<string | null>(null);
  const router = useRouter();

  const listText = useCallback((key: string) => t(`dashboard.strategies.list.${key}`), [t]);

  const loadStrategies = useCallback(async () => {
    try {
      const data = await runAsyncWithViewState({
        setPending: setLoading,
        setError: setLoadError,
        clearErrorValue: null,
        resolveError: (err) => getAxiosMessage(err) ?? listText("loadFailedTitle"),
        operation: () => listStrategies(),
      });
      setStrategies(data);
    } catch (err: unknown) {
      toast.error(listText("loadFailedTitle"), {
        description: getAxiosMessage(err),
      });
    }
  }, [listText]);

  useEffect(() => {
    void loadStrategies();
  }, [loadStrategies]);

  const handleDelete = async () => {
    if (!selectedStrategy) return;
    setDeleting(true);
    try {
      await deleteStrategy(selectedStrategy.id);
      setStrategies((prev) => prev.filter((s) => s.id !== selectedStrategy.id));
      toast.success(listText("strategyDeleted"));
    } catch (err: unknown) {
      toast.error(getAxiosMessage(err) ?? listText("deleteFailed"));
    } finally {
      setDeleting(false);
      setSelectedStrategy(null);
    }
  };

  const handleClone = useCallback(
    async (strategy: StrategyDto) => {
      setCloningId(strategy.id);
      try {
        const cloneName = buildNextCloneName(
          strategy.name,
          strategies.map((item) => item.name)
        );
        const cloned = await createStrategy({
          ...dtoToForm(strategy),
          name: cloneName,
        });
        setStrategies((prev) => [...prev, cloned]);
        toast.success(listText("strategyCloned"));
      } catch (err: unknown) {
        toast.error(getAxiosMessage(err) ?? listText("cloneFailed"));
      } finally {
        setCloningId(null);
      }
    },
    [listText, strategies]
  );

  const columns = useMemo<DataTableColumn<StrategyDto>[]>(
    () => [
      {
        key: "name",
        label: listText("colName"),
        sortable: true,
        accessor: (row) => row.name,
        className: "font-medium",
      },
      {
        key: "leverage",
        label: listText("colLeverage"),
        sortable: true,
        accessor: (row) => row.leverage,
        render: (row) => `${row.leverage}x`,
        className: "w-32",
      },
      {
        key: "interval",
        label: listText("colInterval"),
        sortable: true,
        accessor: (row) => row.interval,
        className: "w-32",
      },
      {
        key: "createdAt",
        label: listText("colCreatedAt"),
        sortable: true,
        accessor: (row) => row.createdAt ?? "",
        render: (row) => formatDate(row.createdAt),
        className: "w-44",
      },
      {
        key: "actions",
        label: listText("colActions"),
        className: "w-40 text-center",
        render: (row) => (
          <div className="flex items-center justify-center gap-2">
            <TablePresetButtonAction
              preset="edit"
              label={listText("edit")}
              onClick={() => router.push(`/dashboard/strategies/${row.id}/edit`)}
            />
            <TablePresetButtonAction
              preset="clone"
              label={listText("clone")}
              onClick={() => void handleClone(row)}
              disabled={cloningId === row.id}
            />
            <TablePresetButtonAction
              preset="delete"
              label={listText("remove")}
              onClick={() => setSelectedStrategy(row)}
            />
          </div>
        ),
      },
    ],
    [cloningId, formatDate, handleClone, listText, router]
  );

  return (
    <div>
      {loading && (
        <SkeletonTableRows
          columns={5}
          rows={6}
          title={false}
          toolbar
          className="border-base-300/40 bg-base-100/60 p-3"
        />
      )}
      {!loading && loadError && (
        <ErrorState
          title={listText("loadFailedTitle")}
          description={loadError}
          retryLabel={listText("retry")}
          onRetry={() => void loadStrategies()}
        />
      )}
      {!loading && !loadError && strategies.length === 0 && (
        <EmptyState
          title={listText("emptyTitle")}
          description={listText("emptyDescription")}
          actionLabel={listText("addAction")}
          onAction={() => router.push("/dashboard/strategies/create")}
        />
      )}

      {!loading && !loadError && strategies.length > 0 && (
        <DataTable
          compact
          rows={strategies}
          columns={columns}
          getRowId={(row) => row.id}
          filterPlaceholder={listText("filterPlaceholder")}
          filterFn={(row, query) => {
            const normalized = query.trim().toLowerCase();
            return (
              row.name.toLowerCase().includes(normalized) ||
              row.interval.toLowerCase().includes(normalized)
            );
          }}
          emptyText={listText("emptyTable")}
          advancedMode
          columnVisibilityPreferenceKey='strategies.list'
        />
      )}

      <ConfirmModal
        open={Boolean(selectedStrategy)}
        title={listText("confirmTitle")}
        description={
          selectedStrategy
            ? listText("confirmDescription").replace("{name}", selectedStrategy.name)
            : listText("confirmDescriptionFallback")
        }
        confirmLabel={listText("confirm")}
        cancelLabel={listText("cancel")}
        confirmVariant="error"
        pending={deleting}
        onCancel={() => {
          if (deleting) return;
          setSelectedStrategy(null);
        }}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
