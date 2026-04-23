'use client';

import { useCallback, useMemo, useState } from "react";
import { LuChartCandlestick, LuListChecks, LuPackageOpen } from "react-icons/lu";
import { toast } from "sonner";

import { ErrorState } from "../../../ui/components/ViewState";
import { SkeletonCardBlock, SkeletonKpiRow, SkeletonTableRows } from "../../../ui/components/loading";
import FormModal from "../../../ui/components/FormModal";
import AssetSymbol from "../../../ui/components/AssetSymbol";
import { useI18n } from "../../../i18n/I18nProvider";
import { useLocaleFormatting } from "../../../i18n/useLocaleFormatting";
import { createMarketStreamEventSource } from "../../../lib/marketStream";
import { normalizeSymbol } from "@/lib/symbols";
import { getAxiosMessage } from "@/lib/getAxiosMessage";
import {
  getBotRuntimeGraph,
  getBotRuntimeMonitoringAggregate,
  listBots,
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
  createHistoryPositionsColumns,
  createOpenOrdersColumns,
  createOpenPositionsColumns,
  createTradesColumns,
} from "./home-live-widgets/runtimeDataTablePresenters";
import {
  buildRuntimeSidebarManualOrderPresenter,
  buildRuntimeSidebarTextPresenter,
} from "./home-live-widgets/runtimeSidebarPresenters";
import { useRuntimeSelectionViewModel } from "./home-live-widgets/useRuntimeSelectionViewModel";
import { useCloseRuntimePositionAction } from "../hooks/useCloseRuntimePositionAction";
import { useHomeLiveWidgetsController } from "../hooks/useHomeLiveWidgetsController";
import { useManualOrderController } from "../hooks/useManualOrderController";
import type {
  OpenPositionWithLive,
  RuntimeDataTab,
  RuntimeSnapshot,
  RuntimeTabItem,
} from "./home-live-widgets/types";
import {
  parseOptionalPositivePriceInput,
  PositionEditDraft,
} from "./home-live-widgets/runtimeUiHelpers";

const CARD = "rounded-box bg-base-100/80";
const CARD_ASIDE = "rounded-box bg-base-100/85 h-fit xl:sticky xl:top-4";
const RUNTIME_DATA_STALE_WARNING_AFTER_MS = 20_000;
const DASHBOARD_OPEN_POSITIONS_SORT_STORAGE_KEY = "dashboard.home.openPositions.sort.v1";
const DASHBOARD_OPEN_POSITIONS_COLUMNS_STORAGE_KEY = "dashboard.home.openPositions.columns.v1";
const DASHBOARD_OPEN_ORDERS_SORT_STORAGE_KEY = "dashboard.home.openOrders.sort.v1";
const DASHBOARD_OPEN_ORDERS_COLUMNS_STORAGE_KEY = "dashboard.home.openOrders.columns.v1";
const DASHBOARD_HISTORY_POSITIONS_SORT_STORAGE_KEY = "dashboard.home.historyPositions.sort.v1";
const DASHBOARD_HISTORY_POSITIONS_COLUMNS_STORAGE_KEY = "dashboard.home.historyPositions.columns.v1";
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

const resolvePositionOriginLabel = (
  origin: OpenPositionWithLive["origin"] | null | undefined,
  t: (key: string) => string
) => {
  if (origin === "MANUAL") return t("dashboard.home.runtime.sourceManual");
  if (origin === "BOT") return t("dashboard.home.runtime.sourceBot");
  if (origin === "EXCHANGE_SYNC" || origin === "BACKTEST") return t("dashboard.home.runtime.sourceImported");
  return t("dashboard.home.runtime.reasonUnknown");
};

const resolveSelectedStrategyDisplay = (
  selected: RuntimeSnapshot | null,
  t: (key: string) => string
) => {
  if (!selected) return t("dashboard.home.runtime.reasonUnknown");

  const runtimeGraphStrategyName = selected.runtimeGraph?.marketGroups
    .flatMap((marketGroup) => marketGroup.strategies)
    .find((strategyBinding) => strategyBinding.strategy.id === selected.bot.strategyId)?.strategy.name;
  if (runtimeGraphStrategyName) return runtimeGraphStrategyName;

  const legacyStrategyName = selected.runtimeGraph?.legacyBotStrategies.find(
    (strategyBinding) => strategyBinding.strategyId === selected.bot.strategyId
  )?.strategy.name;
  if (legacyStrategyName) return legacyStrategyName;

  return t("dashboard.home.runtime.reasonUnknown");
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
    getBotRuntimeMonitoringAggregate,
    listBotRuntimeSessionPositions,
    listBotRuntimeSessionSymbolStats,
    listBotRuntimeSessionTrades,
    listBotRuntimeSessions,
    listBots,
    t,
  });
  const [positionEditDraft, setPositionEditDraft] = useState<PositionEditDraft | null>(null);
  const [isSavingPositionEdit, setIsSavingPositionEdit] = useState(false);
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

  const {
    isSubmittingManualOrder,
    manualOrderContext,
    manualOrderContextLoading,
    manualOrderLeverageForEstimate,
    manualOrderLiveReferencePrice,
    manualOrderMarginEstimate,
    manualOrderMinExecutableQty,
    manualOrderNotionalEstimate,
    manualOrderPrice,
    manualOrderQuantity,
    manualOrderSide,
    manualOrderSliderMaxQuantity,
    manualOrderSliderPercent,
    manualOrderSymbol,
    manualOrderSymbolOptions,
    resolvedManualOrderType,
    fillManualOrderPriceFromReference,
    handleManualOrderSliderChange,
    handleSubmitManualOrder,
    setManualOrderPrice,
    setManualOrderQuantity,
    setManualOrderSide,
    setManualOrderSymbol,
  } = useManualOrderController({
    selected,
    selectedData,
    load,
    labels: {
      invalidSymbol: manualOrderInvalidSymbolLabel,
      invalidQuantity: manualOrderInvalidQuantityLabel,
      invalidPrice: manualOrderInvalidPriceLabel,
      requiredPrice: manualOrderRequiredPriceLabel,
      minQuantity: manualOrderMinQuantityLabel,
      success: manualOrderSuccessLabel,
      error: manualOrderErrorLabel,
    },
  });

  const { isClosingPosition, handleCloseRuntimePosition } = useCloseRuntimePositionAction({
    closePositionErrorLabel,
    closePositionIgnoredLabel,
    closePositionNoSessionLabel,
    closePositionSuccessLabel,
    onClosed: () => load({ silent: true }),
    selectedBotId: selected?.bot.id,
    selectedSessionId: selected?.actionSessionId ?? selected?.session?.id,
  });

  const openPositionsColumns = useMemo(
    () =>
      createOpenPositionsColumns({
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
        onOpenPositionEdit: openPositionEdit,
        onCloseRuntimePosition: (row) => void handleCloseRuntimePosition(row),
      }),
    [
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
    ]
  );

  const openOrdersColumns = useMemo(
    () =>
      createOpenOrdersColumns({
        t,
        formatDateTimeWithSeconds,
        formatNumber,
        resolveRuntimeIcon,
        runtimeIconsLoading,
        runtimeIconsError,
      }),
    [formatDateTimeWithSeconds, formatNumber, resolveRuntimeIcon, runtimeIconsError, runtimeIconsLoading, t]
  );

  const historyPositionsColumns = useMemo(
    () =>
      createHistoryPositionsColumns({
        t,
        formatDateTime,
        formatNumber,
        formatRuntimeAmount,
        withRuntimeUnit,
        resolveRuntimeIcon,
        runtimeIconsLoading,
        runtimeIconsError,
      }),
    [
      formatDateTime,
      formatNumber,
      formatRuntimeAmount,
      resolveRuntimeIcon,
      runtimeIconsError,
      runtimeIconsLoading,
      t,
      withRuntimeUnit,
    ]
  );

  const tradesColumns = useMemo(
    () =>
      createTradesColumns({
        t,
        formatDateTime,
        formatNumber,
        formatRuntimeAmount,
        withRuntimeUnit,
        resolveRuntimeIcon,
        runtimeIconsLoading,
        runtimeIconsError,
      }),
    [
      formatDateTime,
      formatNumber,
      formatRuntimeAmount,
      resolveRuntimeIcon,
      runtimeIconsError,
      runtimeIconsLoading,
      t,
      withRuntimeUnit,
    ]
  );

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

  const runtimeSidebarManualOrder = useMemo(
    () =>
      buildRuntimeSidebarManualOrderPresenter({
        t,
        selected,
        selectedRuntimeCapabilityAvailable,
        manualOrderOpenLabel,
        manualOrderSubmittingLabel,
        manualOrderContext,
        manualOrderLeverageForEstimate,
        manualOrderMinExecutableQty,
        manualOrderSliderMaxQuantity,
        manualOrderLiveReferencePrice,
        manualOrderQuantity,
        manualOrderPrice,
        manualOrderSliderPercent,
        manualOrderNotionalEstimate,
        manualOrderMarginEstimate,
        manualOrderContextLoading,
        isSubmittingManualOrder,
        manualOrderSymbolOptions,
        manualOrderSymbol,
        manualOrderSide,
        resolvedManualOrderType,
        onSymbolChange: setManualOrderSymbol,
        onSideChange: setManualOrderSide,
        onPriceChange: setManualOrderPrice,
        onFillPrice: fillManualOrderPriceFromReference,
        onQuantityChange: setManualOrderQuantity,
        onSliderChange: handleManualOrderSliderChange,
        onSubmit: () => void handleSubmitManualOrder(),
      }),
    [
      fillManualOrderPriceFromReference,
      handleManualOrderSliderChange,
      handleSubmitManualOrder,
      isSubmittingManualOrder,
      manualOrderContext,
      manualOrderContextLoading,
      manualOrderLeverageForEstimate,
      manualOrderLiveReferencePrice,
      manualOrderMarginEstimate,
      manualOrderMinExecutableQty,
      manualOrderNotionalEstimate,
      manualOrderOpenLabel,
      manualOrderPrice,
      manualOrderQuantity,
      manualOrderSide,
      manualOrderSliderMaxQuantity,
      manualOrderSliderPercent,
      manualOrderSubmittingLabel,
      manualOrderSymbol,
      manualOrderSymbolOptions,
      resolvedManualOrderType,
      selected,
      selectedRuntimeCapabilityAvailable,
      setManualOrderPrice,
      setManualOrderQuantity,
      setManualOrderSide,
      setManualOrderSymbol,
      t,
    ]
  );

  const runtimeSidebarText = useMemo(() => buildRuntimeSidebarTextPresenter(t), [t]);

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
                historyRows={selected?.positions?.historyItems ?? []}
                historyColumns={historyPositionsColumns}
                historyPositionsSortStorageKey={DASHBOARD_HISTORY_POSITIONS_SORT_STORAGE_KEY}
                historyPositionsColumnVisibilityKey={DASHBOARD_HISTORY_POSITIONS_COLUMNS_STORAGE_KEY}
                historyPositionsTitle={t("dashboard.bots.monitoring.sections.historyPositionsTitle")}
                historyTradesTitle={t("dashboard.bots.monitoring.sections.historyTradesTitle")}
                noHistoryPositionsLabel={t("dashboard.bots.monitoring.emptyClosedPositions")}
                tradesRows={selectedData?.trades ?? []}
                tradesColumns={tradesColumns}
                filterPlaceholder={t("dashboard.home.runtime.manualOrderSymbolPlaceholder")}
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
                dcaActionLabel={t("dashboard.home.runtime.actionDca")}
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
                contextSourceLabel={t("dashboard.home.runtime.signalContextSource")}
                contextSourceValueLatestSignal={t("dashboard.home.runtime.signalContextSourceLatestSignal")}
                contextSourceValueLatestDecision={t("dashboard.home.runtime.signalContextSourceLatestDecision")}
                contextSourceValueConfiguredFallback={t("dashboard.home.runtime.signalContextSourceConfiguredFallback")}
                contextSourceValueUnresolved={t("dashboard.home.runtime.signalContextSourceUnresolved")}
                strategyContextLabel={t("dashboard.home.runtime.strategyContextTitle")}
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
          manualOrder={runtimeSidebarManualOrder}
          text={runtimeSidebarText}
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
                  <span className="font-semibold">
                    {resolvePositionOriginLabel(positionEditDraft.position.origin, t)}
                  </span>
                </p>
                <p>
                  <span className="opacity-70">{t("dashboard.home.runtime.dca")}:</span>{" "}
                  <span className="font-semibold">{positionEditDraft.position.dcaCount}</span>
                </p>
                <p>
                  <span className="opacity-70">{t("dashboard.bots.create.strategyLabel")}:</span>{" "}
                  <span className="font-semibold">{resolveSelectedStrategyDisplay(selected, t)}</span>
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
