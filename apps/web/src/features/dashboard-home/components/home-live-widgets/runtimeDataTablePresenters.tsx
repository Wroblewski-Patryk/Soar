import { LuPencil, LuX } from "react-icons/lu";

import type { DataTableColumn } from "@/ui/components/DataTable";
import AssetSymbol from "@/ui/components/AssetSymbol";
import type { BotRuntimeTrade } from "@/features/bots/types/bot.type";
import { renderDcaLadderCell } from "@/features/shared/dcaLadderCell";
import { resolveDynamicTslDisplay, resolveDynamicTtpDisplay } from "./runtimeDerivations";
import type { HistoryPositionsTableColumn, OpenOrdersTableColumn, OpenPositionWithLive } from "./types";
import {
  DirectionPill,
  tradeReasonLabelKey,
  tradeReasonPillClass,
  TradeActionPill,
  TradeActionReasonValue,
} from "./runtimeUiHelpers";

type Translate = (key: string) => string;

type ResolveRuntimeIcon = (symbol: string) => { iconUrl?: string | null } | null;

export const resolveOpenOrderSourceLabel = (t: Translate, origin: string | null | undefined) => {
  if (origin === "USER") return t("dashboard.home.runtime.sourceManual");
  if (origin === "BOT") return t("dashboard.home.runtime.sourceBot");
  return t("dashboard.home.runtime.sourceImported");
};

export const resolveOpenOrderStatusLabel = (t: Translate, status: string | null | undefined) => {
  const normalized = status?.trim().toUpperCase();
  if (normalized === "PENDING" || normalized === "OPEN") {
    return t("dashboard.home.runtime.openOrderStatusWaitingFill");
  }
  if (normalized === "PARTIALLY_FILLED") {
    return t("dashboard.home.runtime.openOrderStatusPartiallyFilled");
  }
  if (normalized === "FILLED") {
    return t("dashboard.home.runtime.openOrderStatusFilled");
  }
  return status ?? "-";
};

type OpenPositionsColumnsArgs = {
  t: Translate;
  formatDateTimeWithSeconds: (value?: string | null) => string;
  formatPercent: (value: number) => string;
  formatRuntimeAmount: (value: number) => string;
  formatDcaPercent: (value: number) => string;
  withRuntimeUnit: (label: string) => string;
  resolveRuntimeIcon: ResolveRuntimeIcon;
  runtimeIconsLoading: boolean;
  runtimeIconsError: unknown;
  showDynamicStopColumns: boolean;
  closePositionActionColumnLabel: string;
  closePositionPendingLabel: string;
  closePositionButtonLabel: string;
  editPositionButtonLabel: string;
  isClosingPosition: (positionId: string) => boolean;
  onOpenPositionEdit: (position: OpenPositionWithLive) => void;
  onCloseRuntimePosition: (position: OpenPositionWithLive) => void;
};

export const createOpenPositionsColumns = ({
  t,
  formatDateTimeWithSeconds,
  formatPercent,
  formatRuntimeAmount,
  formatDcaPercent,
  withRuntimeUnit,
  resolveRuntimeIcon,
  runtimeIconsLoading,
  runtimeIconsError,
  showDynamicStopColumns,
  closePositionActionColumnLabel,
  closePositionPendingLabel,
  closePositionButtonLabel,
  editPositionButtonLabel,
  isClosingPosition,
  onOpenPositionEdit,
  onCloseRuntimePosition,
}: OpenPositionsColumnsArgs): DataTableColumn<OpenPositionWithLive>[] => {
  const columns: DataTableColumn<OpenPositionWithLive>[] = [
    {
      key: "openedAt",
      label: t("dashboard.home.runtime.timeOpened"),
      sortable: true,
      accessor: (row) => row.openedAt ?? "",
      render: (row) => formatDateTimeWithSeconds(row.openedAt),
    },
    {
      key: "symbol",
      label: t("dashboard.home.runtime.symbol"),
      sortable: true,
      accessor: (row) => row.symbol,
      render: (row) => {
        const icon = resolveRuntimeIcon(row.symbol);
        return (
          <AssetSymbol
            symbol={row.symbol}
            iconUrl={icon?.iconUrl ?? null}
            loading={runtimeIconsLoading && !icon}
            hasError={Boolean(runtimeIconsError)}
            className="font-medium"
          />
        );
      },
    },
    {
      key: "side",
      label: t("dashboard.home.runtime.side"),
      sortable: true,
      accessor: (row) => row.side,
      render: (row) => <DirectionPill value={row.side} />,
    },
    {
      key: "margin",
      label: withRuntimeUnit(t("dashboard.home.runtime.margin")),
      sortable: true,
      accessor: (row) => row.marginNotional,
      render: (row) => formatRuntimeAmount(row.marginNotional),
    },
    {
      key: "pnl",
      label: withRuntimeUnit(t("dashboard.home.runtime.pnl")),
      sortable: true,
      accessor: (row) => row.liveUnrealizedPnl,
      render: (row) => (
        <span className={row.liveUnrealizedPnl >= 0 ? "text-success" : "text-error"}>
          {formatRuntimeAmount(row.liveUnrealizedPnl)}
        </span>
      ),
    },
    {
      key: "pnlPercent",
      label: t("dashboard.home.runtime.pnlPercent"),
      sortable: true,
      accessor: (row) => row.livePnlPct ?? null,
      render: (row) => (
        <span className={row.liveUnrealizedPnl >= 0 ? "text-success" : "text-error"}>
          {row.livePnlPct == null ? "-" : formatPercent(row.livePnlPct)}
        </span>
      ),
    },
    {
      key: "dca",
      label: t("dashboard.home.runtime.dca"),
      sortable: true,
      accessor: (row) => row.dcaCount,
      className: "text-[11px]",
      render: (row) =>
        renderDcaLadderCell({
          id: row.id,
          dcaCount: row.dcaCount,
          dcaExecutedLevels: row.dcaExecutedLevels,
          dcaPlannedLevels: row.dcaPlannedLevels,
          formatLevel: formatDcaPercent,
        }),
    },
  ];

  if (showDynamicStopColumns) {
    columns.push(
      {
        key: "ttp",
        label: t("dashboard.home.runtime.slTtp"),
        sortable: true,
        accessor: (row) => resolveDynamicTtpDisplay(row) ?? null,
        render: (row) => {
          const ttpDisplay = resolveDynamicTtpDisplay(row);
          return ttpDisplay == null ? "-" : formatPercent(ttpDisplay);
        },
      },
      {
        key: "tsl",
        label: t("dashboard.home.runtime.slTsl"),
        sortable: true,
        accessor: (row) => resolveDynamicTslDisplay(row) ?? null,
        render: (row) => {
          const tslDisplay = resolveDynamicTslDisplay(row);
          return tslDisplay == null ? "-" : formatPercent(tslDisplay);
        },
      }
    );
  }

  columns.push({
    key: "actionClosePosition",
    label: closePositionActionColumnLabel,
    className: "text-right",
    render: (row) => {
      const isClosing = isClosingPosition(row.id);
      const actionLabel = isClosing ? closePositionPendingLabel : closePositionButtonLabel;
      return (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            className="btn btn-outline btn-xs btn-square"
            onClick={() => onOpenPositionEdit(row)}
            disabled={isClosing}
            aria-label={editPositionButtonLabel}
            title={editPositionButtonLabel}
          >
            <LuPencil className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">{editPositionButtonLabel}</span>
          </button>
          <button
            type="button"
            className="btn btn-error btn-outline btn-xs btn-square"
            onClick={() => onCloseRuntimePosition(row)}
            disabled={isClosing}
            aria-label={actionLabel}
            title={actionLabel}
          >
            {isClosing ? (
              <span className="loading loading-spinner loading-xs" aria-hidden />
            ) : (
              <LuX className="h-3.5 w-3.5" aria-hidden />
            )}
            <span className="sr-only">{actionLabel}</span>
          </button>
        </div>
      );
    },
  });

  return columns;
};

type SharedColumnsArgs = {
  t: Translate;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatRuntimeAmount: (value: number) => string;
  withRuntimeUnit: (label: string) => string;
  resolveRuntimeIcon: ResolveRuntimeIcon;
  runtimeIconsLoading: boolean;
  runtimeIconsError: unknown;
};

type OpenOrdersColumnsArgs = {
  t: Translate;
  formatDateTimeWithSeconds: (value?: string | null) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  resolveRuntimeIcon: ResolveRuntimeIcon;
  runtimeIconsLoading: boolean;
  runtimeIconsError: unknown;
};

export const createOpenOrdersColumns = ({
  t,
  formatDateTimeWithSeconds,
  formatNumber,
  resolveRuntimeIcon,
  runtimeIconsLoading,
  runtimeIconsError,
}: OpenOrdersColumnsArgs): OpenOrdersTableColumn[] => [
  {
    key: "submittedAt",
    label: t("dashboard.home.runtime.time"),
    sortable: true,
    accessor: (row) => row.submittedAt ?? row.createdAt,
    render: (row) => formatDateTimeWithSeconds(row.submittedAt ?? row.createdAt),
  },
  {
    key: "symbol",
    label: t("dashboard.home.runtime.symbol"),
    sortable: true,
    accessor: (row) => row.symbol,
    render: (row) => {
      const icon = resolveRuntimeIcon(row.symbol);
      return (
        <AssetSymbol
          symbol={row.symbol}
          iconUrl={icon?.iconUrl ?? null}
          loading={runtimeIconsLoading && !icon}
          hasError={Boolean(runtimeIconsError)}
          className="font-medium"
        />
      );
    },
  },
  {
    key: "source",
    label: t("dashboard.home.runtime.source"),
    sortable: true,
    accessor: (row) => row.origin ?? "",
    render: (row) => <span className="font-semibold">{resolveOpenOrderSourceLabel(t, row.origin)}</span>,
  },
  {
    key: "side",
    label: t("dashboard.home.runtime.side"),
    sortable: true,
    accessor: (row) => row.side,
    render: (row) => <DirectionPill value={row.side === "BUY" ? "BUY" : "SELL"} />,
  },
  {
    key: "status",
    label: t("dashboard.home.runtime.status"),
    sortable: true,
    accessor: (row) => row.status,
    render: (row) => <span className="font-semibold">{resolveOpenOrderStatusLabel(t, row.status)}</span>,
  },
  {
    key: "quantity",
    label: t("dashboard.home.runtime.qty"),
    sortable: true,
    accessor: (row) => row.quantity,
    render: (row) => formatNumber(row.quantity, { maximumFractionDigits: 6 }),
  },
  {
    key: "price",
    label: t("dashboard.home.runtime.price"),
    sortable: true,
    accessor: (row) => row.price ?? null,
    render: (row) =>
      row.price == null ? "-" : formatNumber(row.price, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
  },
];

export const createHistoryPositionsColumns = ({
  t,
  formatNumber,
  formatRuntimeAmount,
  withRuntimeUnit,
  resolveRuntimeIcon,
  runtimeIconsLoading,
  runtimeIconsError,
  formatDateTime,
}: SharedColumnsArgs & { formatDateTime: (value?: string | null) => string }): HistoryPositionsTableColumn[] => [
  {
    key: "closedAt",
    label: t("dashboard.home.runtime.time"),
    sortable: true,
    accessor: (row) => row.closedAt ?? row.openedAt,
    render: (row) => formatDateTime(row.closedAt ?? row.openedAt),
  },
  {
    key: "symbol",
    label: t("dashboard.home.runtime.symbol"),
    sortable: true,
    accessor: (row) => row.symbol,
    render: (row) => {
      const icon = resolveRuntimeIcon(row.symbol);
      return (
        <AssetSymbol
          symbol={row.symbol}
          iconUrl={icon?.iconUrl ?? null}
          loading={runtimeIconsLoading && !icon}
          hasError={Boolean(runtimeIconsError)}
          className="font-medium"
        />
      );
    },
  },
  {
    key: "side",
    label: t("dashboard.home.runtime.side"),
    sortable: true,
    accessor: (row) => row.side,
    render: (row) => <DirectionPill value={row.side} />,
  },
  {
    key: "qty",
    label: t("dashboard.home.runtime.qty"),
    sortable: true,
    accessor: (row) => row.quantity,
    render: (row) => formatNumber(row.quantity, { maximumFractionDigits: 6 }),
  },
  {
    key: "entryPrice",
    label: t("dashboard.bots.monitoring.table.entry"),
    sortable: true,
    accessor: (row) => row.entryPrice,
    render: (row) => formatNumber(row.entryPrice, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
  },
  {
    key: "exitPrice",
    label: t("dashboard.bots.monitoring.table.exit"),
    sortable: true,
    accessor: (row) => row.exitPrice ?? null,
    render: (row) =>
      row.exitPrice == null ? "-" : formatNumber(row.exitPrice, { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
  },
  {
    key: "realizedPnl",
    label: withRuntimeUnit(t("dashboard.home.runtime.realizedPnl")),
    sortable: true,
    accessor: (row) => row.realizedPnl,
    render: (row) => (
      <span className={row.realizedPnl >= 0 ? "text-success" : "text-error"}>
        {formatRuntimeAmount(row.realizedPnl)}
      </span>
    ),
  },
];

export const createTradesColumns = ({
  t,
  formatNumber,
  formatRuntimeAmount,
  withRuntimeUnit,
  resolveRuntimeIcon,
  runtimeIconsLoading,
  runtimeIconsError,
  formatDateTime,
}: SharedColumnsArgs & { formatDateTime: (value?: string | null) => string }): DataTableColumn<BotRuntimeTrade>[] => [
  {
    key: "executedAt",
    label: t("dashboard.home.runtime.time"),
    sortable: true,
    accessor: (row) => row.executedAt ?? "",
    render: (row) => formatDateTime(row.executedAt),
  },
  {
    key: "symbol",
    label: t("dashboard.home.runtime.symbol"),
    sortable: true,
    accessor: (row) => row.symbol,
    render: (row) => {
      const icon = resolveRuntimeIcon(row.symbol);
      return (
        <AssetSymbol
          symbol={row.symbol}
          iconUrl={icon?.iconUrl ?? null}
          loading={runtimeIconsLoading && !icon}
          hasError={Boolean(runtimeIconsError)}
          className="font-medium"
        />
      );
    },
  },
  {
    key: "side",
    label: t("dashboard.home.runtime.side"),
    sortable: true,
    accessor: (row) => row.side,
    render: (row) => <DirectionPill value={row.side === "BUY" ? "BUY" : "SELL"} />,
  },
  {
    key: "lifecycleAction",
    label: t("dashboard.home.runtime.filterAction"),
    sortable: true,
    accessor: (row) => row.lifecycleAction,
      render: (row) => <TradeActionPill value={row.lifecycleAction} t={t} />,
  },
  {
    key: "actionReason",
    label: t("dashboard.home.runtime.reason"),
    sortable: false,
    accessor: (row) => row.actionReason ?? "UNKNOWN",
    render: (row) => {
      const reason = (row.actionReason ?? "UNKNOWN") as TradeActionReasonValue;
      return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${tradeReasonPillClass(reason)}`}>
          {t(tradeReasonLabelKey(reason))}
        </span>
      );
    },
  },
  {
    key: "qty",
    label: t("dashboard.home.runtime.qty"),
    sortable: false,
    accessor: (row) => row.quantity,
    render: (row) => formatNumber(row.quantity, { maximumFractionDigits: 6 }),
  },
  {
    key: "price",
    label: t("dashboard.home.runtime.price"),
    sortable: false,
    accessor: (row) => row.price,
    render: (row) => formatNumber(row.price, { maximumFractionDigits: 4 }),
  },
  {
    key: "margin",
    label: withRuntimeUnit(t("dashboard.home.runtime.margin")),
    sortable: true,
    accessor: (row) => row.margin,
    render: (row) => formatRuntimeAmount(row.margin),
  },
  {
    key: "realizedPnl",
    label: withRuntimeUnit(t("dashboard.home.runtime.realizedPnl")),
    sortable: true,
    accessor: (row) => row.realizedPnl,
    render: (row) => (
      <span className={row.realizedPnl >= 0 ? "text-success" : "text-error"}>
        {formatRuntimeAmount(row.realizedPnl)}
      </span>
    ),
  },
];
