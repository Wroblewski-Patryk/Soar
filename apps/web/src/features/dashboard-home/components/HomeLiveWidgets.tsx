'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { LuChartCandlestick, LuChevronDown, LuListChecks, LuPackageOpen, LuPencil, LuX } from "react-icons/lu";
import { toast } from "sonner";

import { ErrorState } from "../../../ui/components/ViewState";
import { SkeletonCardBlock, SkeletonKpiRow, SkeletonTableRows } from "../../../ui/components/loading";
import { DataTableColumn } from "../../../ui/components/DataTable";
import FormModal from "../../../ui/components/FormModal";
import AssetSymbol from "../../../ui/components/AssetSymbol";
import { useI18n } from "../../../i18n/I18nProvider";
import { useLocaleFormatting } from "../../../i18n/useLocaleFormatting";
import { createMarketStreamEventSource } from "../../../lib/marketStream";
import { normalizeSymbol } from "@/lib/symbols";
import { getAxiosMessage } from "@/lib/getAxiosMessage";
import {
  BotRuntimePositionItem,
  BotRuntimeTrade,
  DashboardManualOrderContext,
} from "../../../features/bots/types/bot.type";
import {
  getDashboardManualOrderContext,
  getBotRuntimeGraph,
  listBots,
  openDashboardManualOrder,
  listBotRuntimeSessionPositions,
  listBotRuntimeSessionSymbolStats,
  listBotRuntimeSessionTrades,
  listBotRuntimeSessions,
} from "../../../features/bots/services/bots.service";
import { supportsExchangeCapability } from "../../../features/exchanges/exchangeCapabilities";
import { useCoinIconLookup } from "../../../features/icons/hooks/useCoinIconLookup";
import { updatePositionManualParams } from "../../../features/positions/services/positions.service";
import RuntimeDataSection from "./home-live-widgets/RuntimeDataSection";
import RuntimeOnboardingSection from "./home-live-widgets/RuntimeOnboardingSection";
import RuntimeSidebarSection from "./home-live-widgets/RuntimeSidebarSection";
import RuntimeSignalsSection from "./home-live-widgets/RuntimeSignalsSection";
import {
  buildRuntimeOnboardingSteps,
  extendWithRuntimeActivationStep,
} from "./home-live-widgets/runtimeOnboardingConfig";
import {
  formatAgeCompact,
  interpolateTemplate,
  resolveQuoteCurrency,
  resolveSignalCardsPerView,
  sessionBadge,
  SIGNAL_CARDS_DESKTOP_MIN_WIDTH,
} from "./home-live-widgets/formatters";
import {
  resolveDynamicTslDisplay,
  resolveDynamicTtpDisplay,
} from "./home-live-widgets/runtimeDerivations";
import { useRuntimeSelectionViewModel } from "./home-live-widgets/useRuntimeSelectionViewModel";
import { useCloseRuntimePositionAction } from "../hooks/useCloseRuntimePositionAction";
import { useHomeLiveWidgetsController } from "../hooks/useHomeLiveWidgetsController";
import type {
  OpenPositionWithLive,
  OpenOrdersTableColumn,
  RuntimeDataTab,
  RuntimeTabItem,
} from "./home-live-widgets/types";
type DirectionPillValue = "LONG" | "SHORT" | "BUY" | "SELL";
type ManualOrderSide = "BUY" | "SELL";

const CARD = "rounded-box bg-base-100/80";
const CARD_ASIDE = "rounded-box bg-base-100/85 h-fit xl:sticky xl:top-4";
const RUNTIME_DATA_STALE_WARNING_AFTER_MS = 20_000;
const DASHBOARD_OPEN_POSITIONS_SORT_STORAGE_KEY = "dashboard.home.openPositions.sort.v1";
const DASHBOARD_OPEN_POSITIONS_COLUMNS_STORAGE_KEY = "dashboard.home.openPositions.columns.v1";
const DASHBOARD_OPEN_ORDERS_SORT_STORAGE_KEY = "dashboard.home.openOrders.sort.v1";
const DASHBOARD_OPEN_ORDERS_COLUMNS_STORAGE_KEY = "dashboard.home.openOrders.columns.v1";
const DASHBOARD_TRADE_HISTORY_COLUMNS_STORAGE_KEY = "dashboard.home.tradeHistory.columns.v1";
const TRADE_PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
const OPEN_POSITIONS_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

const RUNTIME_DATA_TABS: {
  key: RuntimeDataTab;
  hash: string;
  labelKey:
    | "dashboard.home.runtime.openPositionsTitle"
    | "dashboard.home.runtime.openOrdersTitle"
    | "dashboard.home.runtime.tradesHistoryTitlePaper";
}[] = [
  { key: "OPEN_POSITIONS", hash: "positions", labelKey: "dashboard.home.runtime.openPositionsTitle" },
  { key: "OPEN_ORDERS", hash: "orders", labelKey: "dashboard.home.runtime.openOrdersTitle" },
  { key: "TRADE_HISTORY", hash: "history", labelKey: "dashboard.home.runtime.tradesHistoryTitlePaper" },
];


const normalizeDcaLevels = (levels?: number[] | null) =>
  (levels ?? []).filter((level) => Number.isFinite(level));

const resolveDcaExecutedLevels = (position: BotRuntimePositionItem) => {
  const dcaCount = Number.isFinite(position.dcaCount) ? Math.max(0, Math.trunc(position.dcaCount)) : 0;
  if (dcaCount <= 0) return [];

  const executed = normalizeDcaLevels(position.dcaExecutedLevels);
  if (executed.length >= dcaCount) return executed.slice(0, dcaCount);
  if (executed.length > 0) {
    return [
      ...executed,
      ...Array.from({ length: dcaCount - executed.length }, () => executed[executed.length - 1]!),
    ];
  }

  const planned = normalizeDcaLevels(position.dcaPlannedLevels);
  if (planned.length === 0) return [];
  if (planned.length >= dcaCount) return planned.slice(0, dcaCount);

  return [
    ...planned,
    ...Array.from({ length: dcaCount - planned.length }, () => planned[planned.length - 1]!),
  ];
};

const renderDcaLadderCell = (params: {
  position: BotRuntimePositionItem;
  formatPercent: (value: number) => string;
}) => {
  const dcaCount = Number.isFinite(params.position.dcaCount)
    ? Math.max(0, Math.trunc(params.position.dcaCount))
    : 0;
  if (dcaCount <= 0) return <span className="text-xs opacity-70">0</span>;

  const executedLevels = resolveDcaExecutedLevels(params.position);
  if (executedLevels.length === 0) {
    return (
      <span className="inline-flex items-center rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
        {dcaCount}
      </span>
    );
  }

  const ladderPreview = executedLevels
    .map((level, index) => `${index + 1}:${params.formatPercent(level)}`)
    .join(", ");

  return (
    <details className="group inline-block align-middle">
      <summary className="list-none cursor-pointer [&::-webkit-details-marker]:hidden">
        <span
          className="inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning"
          title={ladderPreview}
        >
          {dcaCount}
          <LuChevronDown className="h-3 w-3 transition-transform duration-150 group-open:rotate-180" />
        </span>
      </summary>
      <div className="mt-1 w-max rounded-box border border-base-300/70 bg-base-200/60 px-2 py-1.5 text-[11px] shadow-sm">
        <ul className="space-y-1">
          {executedLevels.map((level, index) => (
            <li
              key={`${params.position.id}-dca-${index}`}
              className="grid grid-cols-[auto_auto] items-center gap-x-1.5 whitespace-nowrap"
            >
              <span className="font-medium opacity-70">{index + 1}</span>
              <span className="font-semibold">{params.formatPercent(level)}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
};

const directionPillClass = (value: DirectionPillValue) => {
  if (value === "LONG" || value === "BUY") return "border-success/40 bg-success/10 text-success";
  return "border-error/40 bg-error/10 text-error";
};

const DirectionPillIcon = ({ value }: { value: DirectionPillValue }) => {
  if (value === "LONG" || value === "BUY") {
    return (
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    );
  }

  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  );
};

const DirectionPill = ({ value }: { value: DirectionPillValue }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${directionPillClass(value)}`}>
    <DirectionPillIcon value={value} />
    <span className="font-medium">{value}</span>
  </span>
);

const parseOptionalPositivePriceInput = (value: string): number | null | "invalid" => {
  const normalized = value.trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return "invalid";
  return parsed;
};

const parsePositiveQuantityInput = (value: string): number | "invalid" => {
  const normalized = value.trim();
  const parsed = Number(normalized);
  if (!normalized || !Number.isFinite(parsed) || parsed <= 0) return "invalid";
  return parsed;
};

const formatQuantityForInput = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return "";
  return Number(value.toFixed(8)).toString();
};

type TradeActionValue = "OPEN" | "DCA" | "CLOSE" | "UNKNOWN";
type TradeActionReasonValue =
  | "SIGNAL_ENTRY"
  | "DCA_LEVEL"
  | "TAKE_PROFIT"
  | "STOP_LOSS"
  | "TRAILING_TAKE_PROFIT"
  | "TRAILING_STOP"
  | "SIGNAL_EXIT"
  | "MANUAL"
  | "UNKNOWN";
type PositionEditDraft = {
  position: OpenPositionWithLive;
  takeProfit: string;
  stopLoss: string;
  notes: string;
  lockRules: boolean;
};

const tradeActionPillClass = (value: TradeActionValue) => {
  if (value === "OPEN") return "border-success/40 bg-success/10 text-success";
  if (value === "DCA") return "border-warning/40 bg-warning/10 text-warning";
  if (value === "CLOSE") return "border-primary/40 bg-primary/10 text-primary";
  return "border-base-300 bg-base-100 text-base-content/70";
};

const tradeActionLabel = (value: TradeActionValue) => {
  if (value === "OPEN") return "Otwarcie";
  if (value === "DCA") return "DCA";
  if (value === "CLOSE") return "Zamkniecie";
  return "Nieznane";
};

const TradeActionPill = ({ value }: { value: TradeActionValue }) => (
  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${tradeActionPillClass(value)}`}>
    {tradeActionLabel(value)}
  </span>
);

const tradeReasonPillClass = (value: TradeActionReasonValue) => {
  if (value === "TAKE_PROFIT" || value === "TRAILING_TAKE_PROFIT") return "border-success/40 bg-success/10 text-success";
  if (value === "STOP_LOSS" || value === "TRAILING_STOP") return "border-error/40 bg-error/10 text-error";
  if (value === "SIGNAL_ENTRY" || value === "SIGNAL_EXIT") return "border-info/40 bg-info/10 text-info";
  if (value === "DCA_LEVEL") return "border-warning/40 bg-warning/10 text-warning";
  if (value === "MANUAL") return "border-secondary/40 bg-secondary/10 text-secondary";
  return "border-base-300 bg-base-100 text-base-content/70";
};

const tradeReasonLabelKey = (value: TradeActionReasonValue) => {
  if (value === "SIGNAL_ENTRY") return "dashboard.home.runtime.reasonSignalEntry";
  if (value === "DCA_LEVEL") return "dashboard.home.runtime.reasonDcaLevel";
  if (value === "TAKE_PROFIT") return "dashboard.home.runtime.reasonTakeProfit";
  if (value === "STOP_LOSS") return "dashboard.home.runtime.reasonStopLoss";
  if (value === "TRAILING_TAKE_PROFIT") return "dashboard.home.runtime.reasonTrailingTakeProfit";
  if (value === "TRAILING_STOP") return "dashboard.home.runtime.reasonTrailingStop";
  if (value === "SIGNAL_EXIT") return "dashboard.home.runtime.reasonSignalExit";
  if (value === "MANUAL") return "dashboard.home.runtime.reasonManual";
  return "dashboard.home.runtime.reasonUnknown";
};

export default function HomeLiveWidgets() {
  const { t } = useI18n();
  const { formatCurrency, formatDateTime, formatDateTimeWithSeconds, formatNumber, formatPercent, formatTime } = useLocaleFormatting();
  const formatDcaPercent = useCallback(
    (value: number) => `${formatNumber(value, { maximumFractionDigits: 2 })}%`,
    [formatNumber]
  );
  const {
    applyTradeFilters,
    bots,
    error,
    handleTradeSortChange,
    lastUpdatedAt,
    liveTickerPrices,
    load,
    loading,
    patchTradeDraftFilters,
    resetTradeFilters,
    runtimeDataTab,
    runtimeStaleWatchNowMs,
    selected,
    selectedTrades,
    selectedTradesLoading,
    setRuntimeDataTab,
    setSelectedBotId,
    setTradePage,
    setTradePageSize,
    signalRailRef,
    snapshots,
    ttpStickyFavorableMoveByPositionRef,
    tradeDraftFilters,
    tradePage,
    tradePageSize,
    tradeSortBy,
    tradeSortDir,
    viewportWidth,
  } = useHomeLiveWidgetsController({
    createMarketStreamEventSource,
    getBotRuntimeGraph,
    listBotRuntimeSessionPositions,
    listBotRuntimeSessionSymbolStats,
    listBotRuntimeSessionTrades,
    listBotRuntimeSessions,
    listBots,
    t,
  });
  const [positionEditDraft, setPositionEditDraft] = useState<PositionEditDraft | null>(null);
  const [isSavingPositionEdit, setIsSavingPositionEdit] = useState(false);
  const [manualOrderSymbol, setManualOrderSymbol] = useState("");
  const [manualOrderSide, setManualOrderSide] = useState<ManualOrderSide>("BUY");
  const [manualOrderPrice, setManualOrderPrice] = useState("");
  const [manualOrderQuantity, setManualOrderQuantity] = useState("");
  const [manualOrderSliderPercent, setManualOrderSliderPercent] = useState(0);
  const [manualOrderContext, setManualOrderContext] = useState<DashboardManualOrderContext | null>(null);
  const [manualOrderContextLoading, setManualOrderContextLoading] = useState(false);
  const [isSubmittingManualOrder, setIsSubmittingManualOrder] = useState(false);
  const runtimeOnboardingSteps = useMemo(() => buildRuntimeOnboardingSteps(t), [t]);
  const runtimeNoActiveBotsOnboardingSteps = useMemo(
    () => extendWithRuntimeActivationStep(runtimeOnboardingSteps, t),
    [runtimeOnboardingSteps, t]
  );
  const { summary, selectedData, showDynamicStopColumns } = useRuntimeSelectionViewModel({
    snapshots,
    selected,
    selectedTrades,
    liveTickerPrices,
    ttpStickyFavorableMoveByPositionRef,
  });

  const selectedRuntimeCapabilityAvailable = useMemo(() => {
    if (!selected) return true;
    if (!selected.bot.exchange) return true;
    return selected.bot.mode === "LIVE"
      ? supportsExchangeCapability(selected.bot.exchange, "LIVE_EXECUTION")
      : supportsExchangeCapability(selected.bot.exchange, "PAPER_PRICING_FEED");
  }, [selected]);

  const runtimeDataAgeMs = useMemo(() => {
    if (!lastUpdatedAt) return null;
    const timestamp = Date.parse(lastUpdatedAt);
    if (!Number.isFinite(timestamp)) return null;
    return Math.max(0, runtimeStaleWatchNowMs - timestamp);
  }, [lastUpdatedAt, runtimeStaleWatchNowMs]);

  const runtimeDataIsStale = useMemo(
    () => runtimeDataAgeMs != null && runtimeDataAgeMs >= RUNTIME_DATA_STALE_WARNING_AFTER_MS,
    [runtimeDataAgeMs]
  );

  const selectedPlaceholderHint = useMemo(() => {
    if (!selected || !selected.bot.exchange) return "";
    return `${selected.bot.exchange}: ${t("dashboard.bots.create.placeholderActivationHint").replace("{mode}", selected.bot.mode)}`;
  }, [selected, t]);

  const signalCardsPerView = resolveSignalCardsPerView(
    viewportWidth > 0 ? viewportWidth : SIGNAL_CARDS_DESKTOP_MIN_WIDTH
  );
  const signalSymbols = useMemo(() => selectedData?.symbols ?? [], [selectedData?.symbols]);
  const signalHeaderStats = useMemo(() => {
    const actionableSignalsCount = signalSymbols.reduce((count, item) => {
      return item.lastSignalDirection === "LONG" || item.lastSignalDirection === "SHORT" ? count + 1 : count;
    }, 0);

    const quoteCounts = new Map<string, number>();
    for (const item of signalSymbols) {
      const quote = resolveQuoteCurrency(item.symbol);
      if (!quote) continue;
      quoteCounts.set(quote, (quoteCounts.get(quote) ?? 0) + 1);
    }

    const baseCurrencyCode =
      [...quoteCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? null;

    return {
      marketsCount: signalSymbols.length,
      actionableSignalsCount,
      baseCurrencyCode,
    };
  }, [signalSymbols]);
  const runtimeAmountUnit = signalHeaderStats.baseCurrencyCode?.toUpperCase() ?? null;
  const formatRuntimeAmount = useCallback(
    (value: number) =>
      formatNumber(value, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [formatNumber]
  );
  const formatRuntimeAmountWithUnit = useCallback(
    (value: number) => (runtimeAmountUnit ? `${formatRuntimeAmount(value)} ${runtimeAmountUnit}` : formatRuntimeAmount(value)),
    [formatRuntimeAmount, runtimeAmountUnit]
  );
  const withRuntimeUnit = useCallback(
    (label: string) => (runtimeAmountUnit ? `${label} [${runtimeAmountUnit}]` : label),
    [runtimeAmountUnit]
  );
  const runtimeIconSymbols = useMemo(() => {
    const symbols = new Set<string>();
    for (const item of signalSymbols) symbols.add(normalizeSymbol(item.symbol));
    for (const item of selectedData?.open ?? []) symbols.add(normalizeSymbol(item.symbol));
    for (const item of selectedData?.trades ?? []) symbols.add(normalizeSymbol(item.symbol));
    if (signalHeaderStats.baseCurrencyCode) symbols.add(signalHeaderStats.baseCurrencyCode);
    return [...symbols];
  }, [selectedData?.open, selectedData?.trades, signalHeaderStats.baseCurrencyCode, signalSymbols]);
  const { iconMap: runtimeIconMap, loading: runtimeIconsLoading, error: runtimeIconsError } =
    useCoinIconLookup(runtimeIconSymbols);
  const resolveRuntimeIcon = useCallback(
    (symbol: string) => runtimeIconMap[normalizeSymbol(symbol)] ?? null,
    [runtimeIconMap]
  );
  const renderRuntimeSymbol = useCallback(
    (symbol: string) => {
      const icon = resolveRuntimeIcon(symbol);
      return (
        <AssetSymbol
          symbol={symbol}
          iconUrl={icon?.iconUrl ?? null}
          loading={runtimeIconsLoading && !icon}
          hasError={Boolean(runtimeIconsError)}
          className="font-[100]"
          iconClassName="h-5 w-5"
          labelClassName="leading-none"
        />
      );
    },
    [resolveRuntimeIcon, runtimeIconsError, runtimeIconsLoading]
  );
  const hasSignalOverflow = signalSymbols.length > signalCardsPerView;

  const scrollSignalRail = (direction: "prev" | "next") => {
    const node = signalRailRef.current;
    if (!node) return;
    const delta = Math.max(node.clientWidth * 0.9, 240);
    node.scrollBy({ left: direction === "next" ? delta : -delta, behavior: "smooth" });
  };

  const tradeMeta = selectedTrades?.meta ?? {
    page: tradePage,
    pageSize: tradePageSize,
    total: selectedData?.trades.length ?? 0,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  };
  const closePositionButtonLabel = t("dashboard.home.runtime.closePositionButton");
  const closePositionPendingLabel = t("dashboard.home.runtime.closePositionPending");
  const closePositionActionColumnLabel = t("dashboard.home.runtime.filterAction");
  const closePositionNoSessionLabel = t("dashboard.home.runtime.closePositionNoSession");
  const closePositionSuccessLabel = t("dashboard.home.runtime.closePositionSuccess");
  const closePositionIgnoredLabel = t("dashboard.home.runtime.closePositionIgnored");
  const closePositionErrorLabel = t("dashboard.home.runtime.closePositionError");
  const manualOrderPanelTitle = t("dashboard.home.runtime.manualOrderTitle");
  const manualOrderOpenLabel = t("dashboard.home.runtime.manualOrderOpen");
  const manualOrderSubmittingLabel = t("dashboard.home.runtime.manualOrderOpening");
  const manualOrderSuccessLabel = t("dashboard.home.runtime.manualOrderSuccess");
  const manualOrderErrorLabel = t("dashboard.home.runtime.manualOrderError");
  const manualOrderInvalidSymbolLabel = t("dashboard.home.runtime.manualOrderSymbolRequired");
  const manualOrderInvalidQuantityLabel = t("dashboard.home.runtime.manualOrderQuantityRequired");
  const manualOrderInvalidPriceLabel = t("dashboard.home.runtime.manualOrderPriceInvalid");
  const manualOrderRequiredPriceLabel = t("dashboard.home.runtime.manualOrderPriceRequired");
  const manualOrderMinQuantityLabel = t("dashboard.home.runtime.manualOrderMinQtyValidation");
  const editPositionButtonLabel = t("dashboard.home.runtime.editPositionButton");
  const editPositionModalTitle = t("dashboard.home.runtime.editPositionTitle");
  const editPositionModalDescription = t("dashboard.home.runtime.editPositionDescription");
  const editPositionSaveLabel = t("dashboard.home.runtime.editPositionSave");
  const editPositionSaveSuccessLabel = t("dashboard.home.runtime.editPositionSaveSuccess");
  const editPositionSaveErrorLabel = t("dashboard.home.runtime.editPositionSaveError");
  const editPositionInvalidValueLabel = t("dashboard.home.runtime.editPositionInvalidValue");

  const openPositionEdit = useCallback((position: OpenPositionWithLive) => {
    setIsSavingPositionEdit(false);
    setPositionEditDraft({
      position,
      takeProfit: position.takeProfit != null ? String(position.takeProfit) : "",
      stopLoss: position.stopLoss != null ? String(position.stopLoss) : "",
      notes: "",
      lockRules: false,
    });
  }, []);
  const closePositionEdit = useCallback(() => {
    setIsSavingPositionEdit(false);
    setPositionEditDraft(null);
  }, []);
  const handleSavePositionEdit = useCallback(async () => {
    if (!positionEditDraft) return;
    const parsedTakeProfit = parseOptionalPositivePriceInput(positionEditDraft.takeProfit);
    const parsedStopLoss = parseOptionalPositivePriceInput(positionEditDraft.stopLoss);
    if (parsedTakeProfit === "invalid" || parsedStopLoss === "invalid") {
      toast.error(editPositionInvalidValueLabel);
      return;
    }

    setIsSavingPositionEdit(true);
    try {
      await updatePositionManualParams(positionEditDraft.position.id, {
        takeProfit: parsedTakeProfit,
        stopLoss: parsedStopLoss,
        notes: positionEditDraft.notes.trim().length > 0 ? positionEditDraft.notes.trim() : null,
        lockRules: positionEditDraft.lockRules,
      });
      toast.success(editPositionSaveSuccessLabel);
      closePositionEdit();
      await load({ silent: true });
    } catch (error) {
      toast.error(getAxiosMessage(error) ?? editPositionSaveErrorLabel);
    } finally {
      setIsSavingPositionEdit(false);
    }
  }, [
    closePositionEdit,
    editPositionInvalidValueLabel,
    editPositionSaveErrorLabel,
    editPositionSaveSuccessLabel,
    load,
    positionEditDraft,
  ]);
  const closePositionEditSafely = useCallback(() => {
    if (isSavingPositionEdit) return;
    closePositionEdit();
  }, [closePositionEdit, isSavingPositionEdit]);

  const manualOrderSymbolOptions = useMemo(() => {
    const options = new Set<string>();
    for (const item of selectedData?.symbols ?? []) options.add(normalizeSymbol(item.symbol));
    for (const item of selectedData?.open ?? []) options.add(normalizeSymbol(item.symbol));
    return [...options].sort((left, right) => left.localeCompare(right));
  }, [selectedData?.open, selectedData?.symbols]);

  useEffect(() => {
    if (manualOrderSymbolOptions.length === 0) {
      if (manualOrderSymbol !== "") setManualOrderSymbol("");
      return;
    }

    const normalized = normalizeSymbol(manualOrderSymbol);
    if (!normalized || !manualOrderSymbolOptions.includes(normalized)) {
      setManualOrderSymbol(manualOrderSymbolOptions[0] ?? "");
    }
  }, [manualOrderSymbol, manualOrderSymbolOptions]);

  useEffect(() => {
    const symbol = normalizeSymbol(manualOrderSymbol);
    const selectedBotId = selected?.bot.id;
    if (!selectedBotId || !symbol) {
      setManualOrderContext(null);
      setManualOrderContextLoading(false);
      return;
    }

    let canceled = false;
    setManualOrderContextLoading(true);

    void getDashboardManualOrderContext({
      botId: selectedBotId,
      symbol,
      side: manualOrderSide,
    })
      .then((context) => {
        if (canceled) return;
        setManualOrderContext(context);
      })
      .catch(() => {
        if (canceled) return;
        setManualOrderContext(null);
      })
      .finally(() => {
        if (canceled) return;
        setManualOrderContextLoading(false);
      });

    return () => {
      canceled = true;
    };
  }, [manualOrderSide, manualOrderSymbol, selected?.bot.id]);

  const manualOrderLiveReferencePrice = useMemo(() => {
    const symbolKey = normalizeSymbol(manualOrderSymbol);
    if (!symbolKey) return null;

    const contextPrice = manualOrderContext?.priceReference.markPrice;
    if (typeof contextPrice === "number" && Number.isFinite(contextPrice) && contextPrice > 0) {
      return contextPrice;
    }

    const symbolItem = selectedData?.symbols.find((item) => normalizeSymbol(item.symbol) === symbolKey);
    if (typeof symbolItem?.liveLastPrice === "number" && Number.isFinite(symbolItem.liveLastPrice) && symbolItem.liveLastPrice > 0) {
      return symbolItem.liveLastPrice;
    }

    const openPositionItem = selectedData?.open.find((item) => normalizeSymbol(item.symbol) === symbolKey);
    if (typeof openPositionItem?.liveMarkPrice === "number" && Number.isFinite(openPositionItem.liveMarkPrice) && openPositionItem.liveMarkPrice > 0) {
      return openPositionItem.liveMarkPrice;
    }

    if (typeof openPositionItem?.entryPrice === "number" && Number.isFinite(openPositionItem.entryPrice) && openPositionItem.entryPrice > 0) {
      return openPositionItem.entryPrice;
    }

    return null;
  }, [manualOrderContext?.priceReference.markPrice, manualOrderSymbol, selectedData?.open, selectedData?.symbols]);

  const resolvedManualOrderType = manualOrderContext?.orderType ?? "MARKET";
  const manualOrderTypeRequiresPrice =
    resolvedManualOrderType === "LIMIT" ||
    resolvedManualOrderType === "STOP" ||
    resolvedManualOrderType === "STOP_LIMIT" ||
    resolvedManualOrderType === "TAKE_PROFIT";
  const manualOrderMinExecutableQty = manualOrderContext?.quantityConstraints.minExecutableQty ?? null;

  const manualOrderLeverageForEstimate = useMemo(() => {
    if (manualOrderContext?.leverage && Number.isFinite(manualOrderContext.leverage) && manualOrderContext.leverage > 0) {
      return manualOrderContext.leverage;
    }
    return selected?.bot.marketType === "SPOT" ? 1 : null;
  }, [manualOrderContext?.leverage, selected?.bot.marketType]);

  const manualOrderSliderMaxQuantity = useMemo(() => {
    if (manualOrderLiveReferencePrice == null || manualOrderLiveReferencePrice <= 0) {
      return manualOrderMinExecutableQty;
    }
    const freeCash = selectedData?.free;
    if (freeCash == null || !Number.isFinite(freeCash) || freeCash <= 0) {
      return manualOrderMinExecutableQty;
    }

    const leverage = manualOrderLeverageForEstimate ?? 1;
    const rawMax =
      selected?.bot.marketType === "SPOT"
        ? freeCash / manualOrderLiveReferencePrice
        : (freeCash * Math.max(1, leverage)) / manualOrderLiveReferencePrice;
    if (!Number.isFinite(rawMax) || rawMax <= 0) return manualOrderMinExecutableQty;

    if (manualOrderMinExecutableQty != null) {
      return Math.max(manualOrderMinExecutableQty, rawMax);
    }
    return rawMax;
  }, [
    manualOrderLeverageForEstimate,
    manualOrderLiveReferencePrice,
    manualOrderMinExecutableQty,
    selected?.bot.marketType,
    selectedData?.free,
  ]);

  useEffect(() => {
    if (manualOrderMinExecutableQty == null || !Number.isFinite(manualOrderMinExecutableQty) || manualOrderMinExecutableQty <= 0) {
      return;
    }

    setManualOrderQuantity((current) => {
      const parsed = Number(current);
      if (!Number.isFinite(parsed) || parsed <= 0 || parsed < manualOrderMinExecutableQty) {
        return formatQuantityForInput(manualOrderMinExecutableQty);
      }
      return current;
    });
  }, [manualOrderMinExecutableQty]);

  useEffect(() => {
    const minQty = manualOrderMinExecutableQty ?? 0;
    const maxQty = manualOrderSliderMaxQuantity ?? minQty;
    if (maxQty <= 0 || maxQty < minQty) return;

    const parsed = Number(manualOrderQuantity);
    if (!Number.isFinite(parsed) || parsed < minQty) {
      setManualOrderSliderPercent(0);
      return;
    }

    if (maxQty === minQty) {
      setManualOrderSliderPercent(100);
      return;
    }

    const derived = ((parsed - minQty) / (maxQty - minQty)) * 100;
    if (!Number.isFinite(derived)) return;
    const clamped = Math.max(0, Math.min(100, derived));
    setManualOrderSliderPercent(clamped);
  }, [manualOrderMinExecutableQty, manualOrderQuantity, manualOrderSliderMaxQuantity]);

  const handleManualOrderSliderChange = useCallback((nextPercent: number) => {
    const clampedPercent = Math.max(0, Math.min(100, nextPercent));
    setManualOrderSliderPercent(clampedPercent);

    const minQty = manualOrderMinExecutableQty ?? 0;
    const maxQty = manualOrderSliderMaxQuantity ?? minQty;
    if (!Number.isFinite(maxQty) || maxQty <= 0) return;

    const targetQuantity =
      maxQty <= minQty
        ? minQty
        : minQty + ((maxQty - minQty) * clampedPercent) / 100;
    setManualOrderQuantity(formatQuantityForInput(targetQuantity));
  }, [manualOrderMinExecutableQty, manualOrderSliderMaxQuantity]);

  const fillManualOrderPriceFromReference = useCallback(() => {
    if (manualOrderLiveReferencePrice == null || !Number.isFinite(manualOrderLiveReferencePrice) || manualOrderLiveReferencePrice <= 0) {
      return;
    }
    setManualOrderPrice(formatQuantityForInput(manualOrderLiveReferencePrice));
  }, [manualOrderLiveReferencePrice]);

  const manualOrderQuantityValue = useMemo(() => {
    const parsed = Number(manualOrderQuantity);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [manualOrderQuantity]);

  const manualOrderNotionalEstimate = useMemo(() => {
    if (manualOrderQuantityValue == null || manualOrderLiveReferencePrice == null) return null;
    return manualOrderQuantityValue * manualOrderLiveReferencePrice;
  }, [manualOrderLiveReferencePrice, manualOrderQuantityValue]);

  const manualOrderMarginEstimate = useMemo(() => {
    if (manualOrderNotionalEstimate == null || manualOrderLeverageForEstimate == null || manualOrderLeverageForEstimate <= 0) {
      return null;
    }
    return manualOrderNotionalEstimate / manualOrderLeverageForEstimate;
  }, [manualOrderLeverageForEstimate, manualOrderNotionalEstimate]);

  const handleSubmitManualOrder = useCallback(async () => {
    if (!selected) return;
    const symbol = normalizeSymbol(manualOrderSymbol);
    if (!symbol) {
      toast.error(manualOrderInvalidSymbolLabel);
      return;
    }
    const quantity = parsePositiveQuantityInput(manualOrderQuantity);
    if (quantity === "invalid") {
      toast.error(manualOrderInvalidQuantityLabel);
      return;
    }
    if (manualOrderMinExecutableQty != null && quantity < manualOrderMinExecutableQty) {
      toast.error(
        interpolateTemplate(manualOrderMinQuantityLabel, {
          value: formatQuantityForInput(manualOrderMinExecutableQty),
        })
      );
      return;
    }

    const parsedPrice = parseOptionalPositivePriceInput(manualOrderPrice);
    if (parsedPrice === "invalid") {
      toast.error(manualOrderInvalidPriceLabel);
      return;
    }
    if (manualOrderTypeRequiresPrice && parsedPrice == null) {
      toast.error(manualOrderRequiredPriceLabel);
      return;
    }

    setIsSubmittingManualOrder(true);
    try {
      await openDashboardManualOrder({
        botId: selected.bot.id,
        walletId: selected.bot.walletId ?? undefined,
        strategyId: selected.bot.strategyId ?? undefined,
        symbol,
        side: manualOrderSide,
        type: resolvedManualOrderType,
        quantity,
        price: manualOrderTypeRequiresPrice && typeof parsedPrice === "number" ? parsedPrice : undefined,
        mode: selected.bot.mode,
        riskAck: selected.bot.mode === "LIVE" ? true : undefined,
      });
      toast.success(manualOrderSuccessLabel);
      setManualOrderQuantity("");
      await load({ silent: true });
    } catch (error) {
      toast.error(getAxiosMessage(error) ?? manualOrderErrorLabel);
    } finally {
      setIsSubmittingManualOrder(false);
    }
  }, [
    load,
    manualOrderInvalidQuantityLabel,
    manualOrderInvalidPriceLabel,
    manualOrderMinExecutableQty,
    manualOrderMinQuantityLabel,
    manualOrderPrice,
    manualOrderRequiredPriceLabel,
    manualOrderInvalidSymbolLabel,
    manualOrderQuantity,
    manualOrderSide,
    manualOrderSymbol,
    manualOrderErrorLabel,
    manualOrderSuccessLabel,
    manualOrderTypeRequiresPrice,
    resolvedManualOrderType,
    selected,
  ]);

  const { isClosingPosition, handleCloseRuntimePosition } = useCloseRuntimePositionAction({
    closePositionErrorLabel,
    closePositionIgnoredLabel,
    closePositionNoSessionLabel,
    closePositionSuccessLabel,
    onClosed: () => load({ silent: true }),
    selectedBotId: selected?.bot.id,
    selectedSessionId: selected?.session?.id,
  });

  const openPositionsColumns = useMemo<DataTableColumn<OpenPositionWithLive>[]>(() => {
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
        render: (row) => renderDcaLadderCell({ position: row, formatPercent: formatDcaPercent }),
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
              onClick={() => openPositionEdit(row)}
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
              onClick={() => void handleCloseRuntimePosition(row)}
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
  }, [
    closePositionActionColumnLabel,
    closePositionButtonLabel,
    closePositionPendingLabel,
    editPositionButtonLabel,
    formatDateTimeWithSeconds,
    formatDcaPercent,
    formatPercent,
    formatRuntimeAmount,
    handleCloseRuntimePosition,
    isClosingPosition,
    openPositionEdit,
    resolveRuntimeIcon,
    runtimeIconsError,
    runtimeIconsLoading,
    showDynamicStopColumns,
    t,
    withRuntimeUnit,
  ]);

  const openOrdersColumns = useMemo<OpenOrdersTableColumn[]>(
    () => [
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
        render: (row) => <span className="font-semibold">{row.status ?? "-"}</span>,
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
    ],
    [
      formatDateTimeWithSeconds,
      formatNumber,
      resolveRuntimeIcon,
      runtimeIconsError,
      runtimeIconsLoading,
      t,
    ]
  );

  const tradesColumns = useMemo<DataTableColumn<BotRuntimeTrade>[]>(() => [
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
      render: (row) => <TradeActionPill value={row.lifecycleAction} />,
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
  ], [
    formatDateTime,
    formatNumber,
    formatRuntimeAmount,
    resolveRuntimeIcon,
    runtimeIconsError,
    runtimeIconsLoading,
    t,
    withRuntimeUnit,
  ]);

  const runtimeTabItems = useMemo<RuntimeTabItem[]>(
    () =>
      RUNTIME_DATA_TABS.map((tab) => ({
        key: tab.key,
        hash: tab.hash,
        icon: tab.key === "TRADE_HISTORY"
          ? (
            <LuChartCandlestick className="h-4 w-4" aria-hidden />
          )
          : tab.key === "OPEN_ORDERS"
            ? (
              <LuListChecks className="h-4 w-4" aria-hidden />
            )
            : (
              <LuPackageOpen className="h-4 w-4" aria-hidden />
            ),
        label:
          tab.key === "TRADE_HISTORY"
            ? (selected?.bot.mode === "LIVE"
              ? t("dashboard.home.runtime.tradesHistoryTitleLive")
              : t("dashboard.home.runtime.tradesHistoryTitlePaper"))
            : t(tab.labelKey),
      })),
    [selected?.bot.mode, t]
  );

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label={t("dashboard.home.runtime.loadingTitle")}>
        <div className="hidden md:block">
          <SkeletonKpiRow items={3} />
        </div>
        <div className="space-y-3 md:hidden">
          <SkeletonKpiRow items={2} />
          <SkeletonKpiRow items={1} />
        </div>
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="order-2 space-y-3 xl:order-1">
            <div className="hidden md:block">
              <SkeletonCardBlock cards={4} linesPerCard={4} title={false} className="border-base-300/40 bg-base-100/60 p-3" />
              <SkeletonTableRows columns={8} rows={5} title={false} toolbar={false} className="border-base-300/40 bg-base-100/60 p-3" />
            </div>
            <div className="space-y-3 md:hidden">
              <SkeletonCardBlock cards={2} linesPerCard={3} title={false} className="border-base-300/40 bg-base-100/60 p-3" />
              <SkeletonTableRows columns={4} rows={4} title={false} toolbar={false} className="border-base-300/40 bg-base-100/60 p-3" />
            </div>
          </div>
          <div className="order-1 space-y-3 xl:order-2">
            <div className="hidden md:block">
              <SkeletonCardBlock cards={1} linesPerCard={6} title={false} className="border-base-300/40 bg-base-100/60 p-3" />
              <SkeletonCardBlock cards={1} linesPerCard={7} title={false} className="border-base-300/40 bg-base-100/60 p-3" />
            </div>
            <div className="space-y-3 md:hidden">
              <SkeletonCardBlock cards={1} linesPerCard={4} title={false} className="border-base-300/40 bg-base-100/60 p-3" />
              <SkeletonCardBlock cards={1} linesPerCard={5} title={false} className="border-base-300/40 bg-base-100/60 p-3" />
            </div>
          </div>
        </section>
      </div>
    );
  }
  if (error) {
    return (
      <ErrorState
        title={t("dashboard.home.runtime.errorTitle")}
        description={error}
        retryLabel={t("dashboard.home.runtime.errorRetry")}
        onRetry={() => void load()}
      />
    );
  }
  if (bots.length === 0) {
    return (
      <div className="space-y-4">
        <RuntimeOnboardingSection
          cardClassName={CARD}
          title={t("dashboard.home.runtime.noBotsTitle")}
          description={t("dashboard.home.runtime.noBotsDescription")}
          badgeLabel={t("dashboard.home.runtime.onboardingBadge")}
          steps={runtimeOnboardingSteps}
        />
      </div>
    );
  }

  if (snapshots.length === 0) {
    return (
      <div className="space-y-4">
        <RuntimeOnboardingSection
          cardClassName={CARD}
          title={t("dashboard.home.runtime.noActiveBotsTitle")}
          description={t("dashboard.home.runtime.noActiveBotsDescription")}
          badgeLabel={t("dashboard.home.runtime.onboardingBadge")}
          steps={runtimeNoActiveBotsOnboardingSteps}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="order-2 min-w-0 xl:order-1">
          <section className={CARD}>
            <div className="space-y-6">
              {!selectedRuntimeCapabilityAvailable ? (
                <div className="rounded-box border border-warning/40 bg-warning/10 px-3 py-2 text-xs">
                  <div className="mb-1">
                    <span className="badge badge-xs badge-warning badge-outline">
                      {t("dashboard.bots.list.placeholderBadge")}
                    </span>
                  </div>
                  <p>{selectedPlaceholderHint}</p>
                </div>
              ) : null}
              <RuntimeDataSection
                runtimeDataTab={runtimeDataTab}
                onRuntimeDataTabChange={setRuntimeDataTab}
                tabItems={runtimeTabItems}
                openRows={selectedData?.open ?? []}
                openPositionsColumns={openPositionsColumns}
                openPositionsSortStorageKey={DASHBOARD_OPEN_POSITIONS_SORT_STORAGE_KEY}
                openPositionsColumnVisibilityKey={DASHBOARD_OPEN_POSITIONS_COLUMNS_STORAGE_KEY}
                openPositionsPageSizeOptions={OPEN_POSITIONS_PAGE_SIZE_OPTIONS}
                rowsPerPageLabel={t("dashboard.home.runtime.rows")}
                previousLabel={t("dashboard.home.runtime.previous")}
                nextLabel={t("dashboard.home.runtime.next")}
                noOpenPositionsLabel={t("dashboard.home.runtime.noOpenPositions")}
                openOrdersRows={selected?.positions?.openOrders ?? []}
                openOrdersColumns={openOrdersColumns}
                openOrdersSortStorageKey={DASHBOARD_OPEN_ORDERS_SORT_STORAGE_KEY}
                openOrdersColumnVisibilityKey={DASHBOARD_OPEN_ORDERS_COLUMNS_STORAGE_KEY}
                noOpenOrdersLabel={t("dashboard.home.runtime.openOrdersPlaceholder")}
                tradesLoading={selectedTradesLoading}
                loadingLabel={t("dashboard.home.loadWidgets")}
                tradesRows={selectedData?.trades ?? []}
                tradesColumns={tradesColumns}
                tradeDraftFilters={tradeDraftFilters}
                onTradeDraftFiltersPatch={patchTradeDraftFilters}
                onApplyTradeFilters={applyTradeFilters}
                onResetTradeFilters={resetTradeFilters}
                tradeSortBy={tradeSortBy}
                tradeSortDir={tradeSortDir}
                onTradeSortChange={handleTradeSortChange}
                advancedOptionsLabel={t("dashboard.bots.monitoring.advancedOptions")}
                allLabel={t("dashboard.home.runtime.all")}
                openActionLabel={t("dashboard.home.runtime.actionOpen")}
                dcaActionLabel="DCA"
                closeActionLabel={t("dashboard.home.runtime.actionClose")}
                filterSideLabel={t("dashboard.home.runtime.filterSide")}
                filterActionLabel={t("dashboard.home.runtime.filterAction")}
                filterFromLabel={t("dashboard.home.runtime.filterFrom")}
                filterToLabel={t("dashboard.home.runtime.filterTo")}
                applyLabel={t("dashboard.home.runtime.apply")}
                resetLabel={t("dashboard.home.runtime.reset")}
                tradeMeta={tradeMeta}
                tradePageSize={tradePageSize}
                onTradePageChange={(nextPage) => setTradePage(nextPage)}
                onTradePageSizeChange={(nextPageSize) => {
                  setTradePageSize(nextPageSize);
                  setTradePage(1);
                }}
                tradePageSizeOptions={TRADE_PAGE_SIZE_OPTIONS}
                tradesColumnVisibilityKey={DASHBOARD_TRADE_HISTORY_COLUMNS_STORAGE_KEY}
                noTradeHistoryLabel={t("dashboard.home.runtime.noTradeHistory")}
              />
              <RuntimeSignalsSection
                signalSymbols={signalSymbols}
                hasSignalOverflow={hasSignalOverflow}
                signalRailRef={signalRailRef}
                onScrollPrevious={() => scrollSignalRail("prev")}
                onScrollNext={() => scrollSignalRail("next")}
                previousLabel={t("dashboard.home.runtime.signalRailPrev")}
                nextLabel={t("dashboard.home.runtime.signalRailNext")}
                longLabel={t("dashboard.home.runtime.long")}
                shortLabel={t("dashboard.home.runtime.short")}
                noSignalDataLabel={t("dashboard.home.runtime.noSignalData")}
                marketsLabel={t("dashboard.home.runtime.markets")}
                signalsLabel={t("dashboard.home.runtime.signals")}
                marketsCount={signalHeaderStats.marketsCount}
                actionableSignalsCount={signalHeaderStats.actionableSignalsCount}
                renderSymbolLabel={renderRuntimeSymbol}
              />
              {runtimeDataIsStale ? (
                <p
                  className="rounded-box border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning-content/85"
                  aria-live="polite"
                >
                  {interpolateTemplate(t("dashboard.home.runtime.staleDataWarning"), {
                    age: formatAgeCompact(runtimeDataAgeMs ?? 0),
                  })}
                </p>
              ) : null}
              <p className="text-[11px] opacity-60">
                {interpolateTemplate(t("dashboard.home.runtime.updatedAt"), {
                  value: lastUpdatedAt ? formatDateTime(lastUpdatedAt) : "-",
                })}
              </p>
            </div>
          </section>

        </div>

        <RuntimeSidebarSection
          asideClassName={`${CARD_ASIDE} order-1 xl:order-2`}
          snapshots={snapshots}
          selected={selected}
          selectedData={selectedData}
          selectedRuntimeCapabilityAvailable={selectedRuntimeCapabilityAvailable}
          placeholderBadgeLabel={t("dashboard.bots.list.placeholderBadge")}
          summary={summary}
          lastUpdatedAt={lastUpdatedAt}
          onSelectedBotIdChange={setSelectedBotId}
          formatTime={formatTime}
          formatNumber={formatNumber}
          formatCurrency={formatCurrency}
          formatAmountWithUnit={formatRuntimeAmountWithUnit}
          formatPercent={formatPercent}
          formatDateTime={formatDateTime}
          sessionBadgeClassName={sessionBadge}
          manualOrder={{
            title: manualOrderPanelTitle,
            symbolLabel: t("dashboard.home.runtime.symbol"),
            sideLabel: t("dashboard.home.runtime.side"),
            orderTypeLabel: t("dashboard.home.runtime.manualOrderOrderTypeLabel"),
            marginModeLabel: t("dashboard.home.runtime.manualOrderMarginModeLabel"),
            leverageLabel: t("dashboard.home.runtime.manualOrderLeverageLabel"),
            quantityLabel: t("dashboard.home.runtime.qty"),
            priceLabel: t("dashboard.home.runtime.price"),
            fillPriceLabel: t("dashboard.home.runtime.manualOrderUseMarketPrice"),
            minQtyLabel: t("dashboard.home.runtime.manualOrderMinQtyLabel"),
            sliderLabel: t("dashboard.home.runtime.manualOrderSliderLabel"),
            sliderMinLabel: t("dashboard.home.runtime.manualOrderSliderMinLabel"),
            sliderMaxLabel: t("dashboard.home.runtime.manualOrderSliderMaxLabel"),
            summaryBuyLabel: t("dashboard.home.runtime.manualOrderSummaryBuy"),
            summarySellLabel: t("dashboard.home.runtime.manualOrderSummarySell"),
            summaryEstimateLabel: t("dashboard.home.runtime.manualOrderSummaryEstimate"),
            summaryMaxLabel: t("dashboard.home.runtime.manualOrderSummaryMax"),
            openLabel: manualOrderOpenLabel,
            openingLabel: manualOrderSubmittingLabel,
            buyLabel: t("dashboard.home.runtime.manualOrderBuyLabel"),
            sellLabel: t("dashboard.home.runtime.manualOrderSellLabel"),
            contextLoadingLabel: t("dashboard.home.runtime.manualOrderContextLoading"),
            contextUnavailableLabel: t("dashboard.home.runtime.manualOrderContextUnavailable"),
            noSymbolsLabel: t("dashboard.home.runtime.noSignalData"),
            botContext: selected ? `${selected.bot.name} | ${selected.bot.mode}` : "-",
            symbolOptions: manualOrderSymbolOptions,
            symbol: manualOrderSymbol,
            side: manualOrderSide,
            orderType: resolvedManualOrderType,
            marginMode: manualOrderContext?.marginMode ?? (selected?.bot.marketType === "SPOT" ? "NONE" : "CROSSED"),
            leverage: manualOrderLeverageForEstimate,
            minExecutableQty: manualOrderMinExecutableQty,
            maxExecutableQty: manualOrderSliderMaxQuantity ?? null,
            liveReferencePrice: manualOrderLiveReferencePrice,
            quantity: manualOrderQuantity,
            price: manualOrderPrice,
            sliderPercent: manualOrderSliderPercent,
            estimatedNotional: manualOrderNotionalEstimate,
            estimatedMargin: manualOrderMarginEstimate,
            isContextLoading: manualOrderContextLoading,
            isSubmitting: isSubmittingManualOrder,
            isActionDisabled: !selectedRuntimeCapabilityAvailable || manualOrderSymbolOptions.length === 0,
            onSymbolChange: setManualOrderSymbol,
            onSideChange: setManualOrderSide,
            onPriceChange: setManualOrderPrice,
            onFillPrice: fillManualOrderPriceFromReference,
            onQuantityChange: setManualOrderQuantity,
            onSliderChange: handleManualOrderSliderChange,
            onSubmit: () => void handleSubmitManualOrder(),
          }}
          text={{
            walletTitle: t("dashboard.home.runtime.walletTitle"),
            selectedBot: t("dashboard.home.runtime.selectedBot"),
            status: t("dashboard.home.runtime.status"),
            mode: t("dashboard.home.runtime.mode"),
            heartbeat: t("dashboard.home.runtime.heartbeat"),
            openPositions: t("dashboard.home.runtime.openPositions"),
            signalsDca: t("dashboard.home.runtime.signalsDca"),
            netPnl: t("dashboard.home.runtime.netPnl"),
            noSession: t("dashboard.home.runtime.noSession"),
            noActiveSessionWarning: t("dashboard.home.runtime.noActiveSessionWarning"),
            capitalRiskTitle: t("dashboard.home.runtime.capitalRiskTitle"),
            portfolio: t("dashboard.home.runtime.portfolio"),
            deltaFromStart: t("dashboard.home.runtime.deltaFromStart"),
            marketContextTitle: t("dashboard.home.runtime.marketContextTitle"),
            strategyContextTitle: t("dashboard.home.runtime.strategyContextTitle"),
            marketGroup: t("dashboard.home.runtime.marketGroup"),
            exchange: t("dashboard.home.runtime.exchange"),
            market: t("dashboard.home.runtime.market"),
            strategy: t("dashboard.bots.create.strategyLabel"),
            interval: t("dashboard.home.runtime.interval"),
            leverage: t("dashboard.home.runtime.leverage"),
            walletAllocation: t("dashboard.home.runtime.walletAllocation"),
            markets: t("dashboard.home.runtime.markets"),
            strategies: t("dashboard.nav.strategies"),
            baseCurrency: t("dashboard.home.runtime.baseCurrency"),
            freeFunds: t("dashboard.home.runtime.freeFunds"),
            fundsInPositions: t("dashboard.home.runtime.fundsInPositions"),
            inPositionsShort: t("dashboard.home.runtime.inPositionsShort"),
            exposure: t("dashboard.home.runtime.exposure"),
            realizedOpen: t("dashboard.home.runtime.realizedOpen"),
            winRate: t("dashboard.home.runtime.winRate"),
            maxDrawdown: t("dashboard.home.runtime.maxDrawdown"),
            updatedAt: (value) => interpolateTemplate(t("dashboard.home.runtime.updatedAt"), { value }),
          }}
        />
      </section>
      <FormModal
        open={Boolean(positionEditDraft)}
        title={editPositionModalTitle}
        description={editPositionModalDescription}
        onClose={closePositionEditSafely}
      >
        {positionEditDraft ? (
          <div className="space-y-4">
            <section className="rounded-box border border-base-300/60 bg-base-200/60 p-3 text-xs">
              <div className="grid gap-2 md:grid-cols-2">
                <p>
                  <span className="opacity-70">{t("dashboard.home.runtime.symbol")}:</span>{" "}
                  <span className="font-semibold">{positionEditDraft.position.symbol}</span>
                </p>
                <p>
                  <span className="opacity-70">{t("dashboard.home.runtime.side")}:</span>{" "}
                  <span className="font-semibold">{positionEditDraft.position.side}</span>
                </p>
                <p>
                  <span className="opacity-70">{t("dashboard.home.runtime.reason")}:</span>{" "}
                  <span className="font-semibold">{positionEditDraft.position.origin ?? "BOT"}</span>
                </p>
                <p>
                  <span className="opacity-70">{t("dashboard.home.runtime.dca")}:</span>{" "}
                  <span className="font-semibold">{positionEditDraft.position.dcaCount}</span>
                </p>
                <p>
                  <span className="opacity-70">{t("dashboard.bots.create.strategyLabel")}:</span>{" "}
                  <span className="font-semibold">{selected?.bot.strategyId ?? "-"}</span>
                </p>
                <p>
                  <span className="opacity-70">{t("dashboard.home.runtime.timeOpened")}:</span>{" "}
                  <span className="font-semibold">{formatDateTimeWithSeconds(positionEditDraft.position.openedAt)}</span>
                </p>
              </div>
            </section>
            <section className="grid gap-3 md:grid-cols-2">
              <label className="form-control gap-1">
                <span className="label-text text-xs">{t("dashboard.home.runtime.editTakeProfitLabel")}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.0001"
                  min="0"
                  className="input input-bordered input-sm"
                  value={positionEditDraft.takeProfit}
                  disabled={isSavingPositionEdit}
                  onChange={(event) =>
                    setPositionEditDraft((current) =>
                      current ? { ...current, takeProfit: event.target.value } : current
                    )
                  }
                />
              </label>
              <label className="form-control gap-1">
                <span className="label-text text-xs">{t("dashboard.home.runtime.editStopLossLabel")}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.0001"
                  min="0"
                  className="input input-bordered input-sm"
                  value={positionEditDraft.stopLoss}
                  disabled={isSavingPositionEdit}
                  onChange={(event) =>
                    setPositionEditDraft((current) =>
                      current ? { ...current, stopLoss: event.target.value } : current
                    )
                  }
                />
              </label>
            </section>
            <label className="form-control gap-1">
              <span className="label-text text-xs">{t("dashboard.home.runtime.editNotesLabel")}</span>
              <textarea
                className="textarea textarea-bordered min-h-20"
                value={positionEditDraft.notes}
                disabled={isSavingPositionEdit}
                onChange={(event) =>
                  setPositionEditDraft((current) =>
                    current ? { ...current, notes: event.target.value } : current
                  )
                }
                placeholder={t("dashboard.home.runtime.editNotesPlaceholder")}
              />
            </label>
            <label className="label cursor-pointer justify-start gap-3 p-0">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={positionEditDraft.lockRules}
                disabled={isSavingPositionEdit}
                onChange={(event) =>
                  setPositionEditDraft((current) =>
                    current ? { ...current, lockRules: event.target.checked } : current
                  )
                }
              />
              <span className="label-text text-xs">
                {t("dashboard.home.runtime.editLockRulesLabel")}
              </span>
            </label>
            <div className="modal-action mt-0">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={closePositionEdit}
                disabled={isSavingPositionEdit}
              >
                {t("dashboard.home.runtime.editCloseButton")}
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => void handleSavePositionEdit()}
                disabled={isSavingPositionEdit}
              >
                {isSavingPositionEdit ? <span className="loading loading-spinner loading-xs" aria-hidden /> : null}
                {editPositionSaveLabel}
              </button>
            </div>
          </div>
        ) : null}
      </FormModal>
    </div>
  );
}
