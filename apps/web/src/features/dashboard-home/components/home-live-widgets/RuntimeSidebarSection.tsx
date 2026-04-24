import { LuArrowDownRight, LuArrowUpRight, LuBot, LuChartCandlestick, LuChartLine, LuListChecks, LuShieldCheck, LuTrophy, LuWallet } from "react-icons/lu";
import { normalizeSymbol } from "@/lib/symbols";
import {
  resolveBotVenueContext,
  resolvePaperConfigBaseline,
  resolveRuntimeFreeFunds,
  resolveRuntimePortfolio,
} from "@/features/bots/utils/runtimeSurfaceTruth";
import type { RuntimeSelectedData, RuntimeSnapshot, RuntimeSummary } from "./types";

export type RuntimeSidebarSectionProps = {
  asideClassName: string;
  snapshots: RuntimeSnapshot[];
  selected: RuntimeSnapshot | null;
  selectedData: RuntimeSelectedData | null;
  selectedRuntimeCapabilityAvailable: boolean;
  placeholderBadgeLabel: string;
  summary: RuntimeSummary;
  lastUpdatedAt: string | null;
  onSelectedBotIdChange: (botId: string) => void;
  formatTime: (value?: string | null) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number) => string;
  formatAmountWithUnit: (value: number) => string;
  formatPercent: (value: number) => string;
  formatDateTime: (value?: string | null) => string;
  sessionBadgeClassName: (status?: string | null) => string;
  manualOrder: {
    title: string;
    symbolLabel: string;
    sideLabel: string;
    orderTypeLabel: string;
    marginModeLabel: string;
    leverageLabel: string;
    quantityLabel: string;
    priceLabel: string;
    fillPriceLabel: string;
    minQtyLabel: string;
    sliderLabel: string;
    sliderMinLabel: string;
    sliderMaxLabel: string;
    summaryBuyLabel: string;
    summarySellLabel: string;
    summaryEstimateLabel: string;
    summaryMaxLabel: string;
    openLabel: string;
    openingLabel: string;
    buyLabel: string;
    sellLabel: string;
    contextLoadingLabel: string;
    contextUnavailableLabel: string;
    semanticsHintLabel: string;
    noSymbolsLabel: string;
    botContext: string;
    symbolOptions: string[];
    symbol: string;
    side: "BUY" | "SELL";
    orderType: "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT" | "TAKE_PROFIT" | "TRAILING";
    marginMode: "CROSSED" | "ISOLATED" | "NONE";
    leverage: number | null;
    minExecutableQty: number | null;
    maxExecutableQty: number | null;
    liveReferencePrice: number | null;
    quantity: string;
    price: string;
    sliderPercent: number;
    estimatedNotional: number | null;
    estimatedMargin: number | null;
    isContextLoading: boolean;
    isSubmitting: boolean;
    isActionDisabled: boolean;
    onSymbolChange: (symbol: string) => void;
    onSideChange: (side: "BUY" | "SELL") => void;
    onPriceChange: (price: string) => void;
    onFillPrice: () => void;
    onQuantityChange: (quantity: string) => void;
    onSliderChange: (nextPercent: number) => void;
    onSubmit: () => void;
  };
  text: {
    walletTitle: string;
    selectedBot: string;
    status: string;
    mode: string;
    marketContextTitle: string;
    strategyContextTitle: string;
    marketGroup: string;
    exchange: string;
    market: string;
    baseCurrency: string;
    strategy: string;
    interval: string;
    leverage: string;
    walletAllocation: string;
    capitalSource: string;
    capitalSourcePaperInitial: string;
    capitalSourcePaperReset: string;
    capitalSourceLiveExchange: string;
    capitalHintPaperInitial: string;
    capitalHintPaperReset: string;
    capitalHintLivePercent: string;
    capitalHintLiveFixed: string;
    capitalHintLiveFull: string;
    accountBalance: string;
    paperResetAt: string;
    heartbeat: string;
    openPositions: string;
    signalsDca: string;
    netPnl: string;
    noSession: string;
    noActiveSessionWarning: string;
    capitalRiskTitle: string;
    portfolio: string;
    deltaFromStart: string;
    markets: string;
    strategies: string;
    freeFunds: string;
    fundsInPositions: string;
    inPositionsShort: string;
    exposure: string;
    realizedOpen: string;
    winRate: string;
    maxDrawdown: string;
    updatedAt: (value: string) => string;
  };
};

export default function RuntimeSidebarSection(props: RuntimeSidebarSectionProps) {
  const selectedWallet = props.selected?.bot.wallet ?? null;
  const capitalSummary = props.selected?.positions?.summary ?? null;
  const selectedWalletMode = selectedWallet?.mode ?? props.selected?.bot.mode ?? null;
  const walletName = selectedWallet?.name ?? "-";
  const selectedUsedMargin = Math.max(0, props.selectedData?.usedMargin ?? 0);
  const selectedNet = props.selectedData?.net ?? 0;
  const paperStartBalance = resolvePaperConfigBaseline(props.selected?.bot);
  const liveFixedAllocation =
    selectedWalletMode === "LIVE" && selectedWallet?.liveAllocationMode === "FIXED"
      ? selectedWallet.liveAllocationValue ?? null
      : null;
  const walletBaseline = paperStartBalance ?? liveFixedAllocation;
  const runtimeWalletTotal =
    props.selectedData?.equity ??
    resolveRuntimePortfolio({
      bot: props.selected?.bot,
      summary: capitalSummary,
      net: selectedNet,
      usedMargin: selectedUsedMargin,
    });
  const walletTotal =
    selectedWalletMode === "LIVE"
      ? runtimeWalletTotal
      : runtimeWalletTotal ?? (walletBaseline != null ? Math.max(0, walletBaseline + selectedNet) : null);
  const walletFree =
    props.selectedData?.free ??
    resolveRuntimeFreeFunds({
      summary: capitalSummary,
      portfolio: walletTotal,
      usedMargin: selectedUsedMargin,
    });
  const canCalculatePortfolioSplit = walletTotal != null && walletFree != null;
  const walletDenominator = canCalculatePortfolioSplit
    ? Math.max(walletTotal, walletFree + selectedUsedMargin, 1)
    : 1;
  const walletInPositionsPct = canCalculatePortfolioSplit
    ? Math.max(0, Math.min(100, (selectedUsedMargin / walletDenominator) * 100))
    : null;
  const walletFreePct = canCalculatePortfolioSplit
    ? Math.max(0, Math.min(100, (walletFree / walletDenominator) * 100))
    : null;
  const walletAllocationLabel =
    selectedWalletMode === "LIVE"
      ? selectedWallet?.liveAllocationMode === "PERCENT"
        ? `${selectedWallet.liveAllocationValue ?? 0}%`
        : selectedWallet?.liveAllocationMode === "FIXED"
          ? props.formatAmountWithUnit(selectedWallet.liveAllocationValue ?? 0)
          : "-"
      : "-";
  const walletCapitalSourceLabel = (() => {
    switch (capitalSummary?.capitalSource) {
      case "PAPER_RESET_CHECKPOINT":
        return props.text.capitalSourcePaperReset;
      case "LIVE_EXCHANGE_BALANCE":
        return props.text.capitalSourceLiveExchange;
      case "PAPER_INITIAL_BALANCE":
      default:
        return props.text.capitalSourcePaperInitial;
    }
  })();
  const walletCapitalHint = (() => {
    if (selectedWalletMode === "PAPER") {
      return capitalSummary?.capitalSource === "PAPER_RESET_CHECKPOINT"
        ? props.text.capitalHintPaperReset
        : props.text.capitalHintPaperInitial;
    }
    if (selectedWallet?.liveAllocationMode === "PERCENT") return props.text.capitalHintLivePercent;
    if (selectedWallet?.liveAllocationMode === "FIXED") return props.text.capitalHintLiveFixed;
    return props.text.capitalHintLiveFull;
  })();
  const walletAccountBalance =
    selectedWalletMode === "LIVE" &&
    capitalSummary?.accountBalance != null &&
    Number.isFinite(capitalSummary.accountBalance)
      ? props.formatAmountWithUnit(capitalSummary.accountBalance)
      : null;
  const walletPaperResetAt =
    selectedWalletMode === "PAPER" && capitalSummary?.paperResetAt
      ? props.formatDateTime(capitalSummary.paperResetAt)
      : null;
  const walletSplitKpis = [
    {
      key: "free",
      label: props.text.freeFunds,
      value: walletFree != null ? props.formatAmountWithUnit(walletFree) : "-",
      toneClass: "text-primary",
      rowClassName: "border-primary/35",
      percent: walletFreePct != null ? props.formatPercent(walletFreePct) : null,
      testId: "wallet-kpi-free-funds",
    },
    {
      key: "inPositions",
      label: props.text.inPositionsShort,
      value: props.formatAmountWithUnit(selectedUsedMargin),
      toneClass: "text-secondary",
      rowClassName: "border-secondary/35",
      percent: walletInPositionsPct != null ? props.formatPercent(walletInPositionsPct) : null,
      testId: "wallet-kpi-in-positions",
    },
  ];
  const panelFrameClassName =
    "rounded-box border-b-[3px] border-secondary/70 bg-gradient-to-br from-primary/70 to-secondary/70 p-px";
  const panelBodyClassName = "rounded-box bg-base-100/85 p-3";
  const selectedVenueContext = resolveBotVenueContext(props.selected?.bot);
  const statusValueClassName = (status?: string | null) => {
    if (status === "RUNNING") return "text-info";
    if (status === "COMPLETED") return "text-success";
    if (status === "FAILED") return "text-error";
    if (status === "CANCELED") return "text-warning";
    return "text-base-content/70";
  };
  const normalizedMarketType = (() => {
    if (!selectedVenueContext.marketType) return "-";
    return selectedVenueContext.marketType === "FUTURES" ? "Futures" : "Spot";
  })();
  const runtimeGraph = props.selected?.runtimeGraph;
  const directSymbolGroup = props.selected?.bot.symbolGroup ?? null;
  const directStrategy = props.selected?.bot.strategy ?? null;
  const sortedGraphGroups = [...(runtimeGraph?.marketGroups ?? [])].sort(
    (left, right) => left.executionOrder - right.executionOrder
  );
  const primaryGroup = sortedGraphGroups.find((group) => group.isEnabled) ?? sortedGraphGroups[0] ?? null;
  const preferredStrategyId = props.selected?.bot.strategyId ?? null;
  const groupStrategyLinks = sortedGraphGroups.flatMap((group) =>
    (group.strategies ?? []).map((strategy) => ({ group, strategy }))
  );
  const sortedPrimaryGroupStrategies = [...(primaryGroup?.strategies ?? [])].sort((left, right) => {
    if (left.priority !== right.priority) return left.priority - right.priority;
    return right.weight - left.weight;
  });
  const fallbackLegacyStrategy = runtimeGraph?.legacyBotStrategies[0] ?? null;
  const fallbackLegacyByPreferredId =
    runtimeGraph?.legacyBotStrategies.find(
      (item) => preferredStrategyId != null && item.strategyId === preferredStrategyId
    ) ?? null;
  const canonicalPreferredEnabled =
    groupStrategyLinks.find(
      ({ strategy }) => preferredStrategyId != null && strategy.isEnabled && strategy.strategyId === preferredStrategyId
    ) ?? null;
  const canonicalPreferredAny =
    groupStrategyLinks.find(
      ({ strategy }) => preferredStrategyId != null && strategy.strategyId === preferredStrategyId
    ) ?? null;
  const canonicalPrimaryEnabled = sortedPrimaryGroupStrategies.find((item) => item.isEnabled) ?? null;
  const canonicalPrimaryAny = sortedPrimaryGroupStrategies[0] ?? null;
  const readStrategyLeverage = (strategy: unknown): number | null => {
    if (!strategy || typeof strategy !== "object") return null;
    const raw = (strategy as { leverage?: unknown }).leverage;
    return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
  };
  const selectedStrategyContext = (() => {
    if (directSymbolGroup || directStrategy) {
      return {
        marketGroupName: directSymbolGroup?.name ?? null,
        strategyName: directStrategy?.name ?? null,
        strategyInterval: directStrategy?.interval ?? null,
        strategyLeverage: readStrategyLeverage(directStrategy),
      };
    }
    if (canonicalPreferredEnabled) {
      return {
        marketGroupName: canonicalPreferredEnabled.group.symbolGroup?.name ?? null,
        strategyName: canonicalPreferredEnabled.strategy.strategy?.name ?? null,
        strategyInterval: canonicalPreferredEnabled.strategy.strategy?.interval ?? null,
        strategyLeverage: readStrategyLeverage(canonicalPreferredEnabled.strategy.strategy),
      };
    }
    if (canonicalPreferredAny) {
      return {
        marketGroupName: canonicalPreferredAny.group.symbolGroup?.name ?? null,
        strategyName: canonicalPreferredAny.strategy.strategy?.name ?? null,
        strategyInterval: canonicalPreferredAny.strategy.strategy?.interval ?? null,
        strategyLeverage: readStrategyLeverage(canonicalPreferredAny.strategy.strategy),
      };
    }
    if (primaryGroup && canonicalPrimaryEnabled) {
      return {
        marketGroupName: primaryGroup.symbolGroup?.name ?? null,
        strategyName: canonicalPrimaryEnabled.strategy?.name ?? null,
        strategyInterval: canonicalPrimaryEnabled.strategy?.interval ?? null,
        strategyLeverage: readStrategyLeverage(canonicalPrimaryEnabled.strategy),
      };
    }
    if (primaryGroup && canonicalPrimaryAny) {
      return {
        marketGroupName: primaryGroup.symbolGroup?.name ?? null,
        strategyName: canonicalPrimaryAny.strategy?.name ?? null,
        strategyInterval: canonicalPrimaryAny.strategy?.interval ?? null,
        strategyLeverage: readStrategyLeverage(canonicalPrimaryAny.strategy),
      };
    }
    if (fallbackLegacyByPreferredId) {
      return {
        marketGroupName: fallbackLegacyByPreferredId.symbolGroup?.name ?? null,
        strategyName: fallbackLegacyByPreferredId.strategy?.name ?? null,
        strategyInterval: fallbackLegacyByPreferredId.strategy?.interval ?? null,
        strategyLeverage: readStrategyLeverage(fallbackLegacyByPreferredId.strategy),
      };
    }
    if (fallbackLegacyStrategy) {
      return {
        marketGroupName: fallbackLegacyStrategy.symbolGroup?.name ?? null,
        strategyName: fallbackLegacyStrategy.strategy?.name ?? null,
        strategyInterval: fallbackLegacyStrategy.strategy?.interval ?? null,
        strategyLeverage: readStrategyLeverage(fallbackLegacyStrategy.strategy),
      };
    }
    if (primaryGroup) {
      return {
        marketGroupName: primaryGroup.symbolGroup?.name ?? null,
        strategyName: null,
        strategyInterval: null,
        strategyLeverage: null,
      };
    }
    return {
      marketGroupName: null,
      strategyName: null,
      strategyInterval: null,
      strategyLeverage: null,
    };
  })();
  const selectedMarketGroupName = selectedStrategyContext.marketGroupName ?? "-";
  const displayMarketGroupName =
    selectedMarketGroupName === "-"
      ? selectedMarketGroupName
      : selectedMarketGroupName.replace(/\s+group$/i, "");
  const selectedStrategyName = selectedStrategyContext.strategyName ?? "-";
  const selectedStrategyInterval = selectedStrategyContext.strategyInterval ?? "-";
  const selectedStrategyLeverageValue = (() => {
    const fromRuntimeGraph = selectedStrategyContext.strategyLeverage;
    if (typeof fromRuntimeGraph === "number" && Number.isFinite(fromRuntimeGraph) && fromRuntimeGraph > 0) {
      return fromRuntimeGraph;
    }
    const fromOpenPosition = props.selectedData?.open?.find((item) => Number.isFinite(item.leverage) && item.leverage > 0);
    if (fromOpenPosition) return fromOpenPosition.leverage;
    return null;
  })();
  const selectedStrategyLeverage = (() => {
    if (selectedStrategyLeverageValue != null) return `${selectedStrategyLeverageValue}x`;
    return "-";
  })();
  const manualOrderSummaryLabel =
    props.manualOrder.side === "BUY"
      ? props.manualOrder.summaryBuyLabel
      : props.manualOrder.summarySellLabel;
  const selectedBaseCurrency = (() => {
    const fromWallet = selectedWallet?.baseCurrency;
    if (fromWallet) return fromWallet.toUpperCase();
    const fromTrades = props.selectedData?.trades.find((item) => item.feeCurrency)?.feeCurrency;
    if (fromTrades) return fromTrades.toUpperCase();
    const symbol = props.selectedData?.symbols[0]?.symbol;
    if (!symbol) return "-";
    const normalized = normalizeSymbol(symbol);
    const knownQuoteCurrencies = ["USDT", "USDC", "BUSD", "FDUSD", "TUSD", "USDP", "DAI", "USD", "BTC", "ETH", "BNB", "EUR", "TRY", "GBP", "JPY"];
    for (const quote of knownQuoteCurrencies) {
      if (normalized.endsWith(quote) && normalized.length > quote.length) return quote;
    }
    return "-";
  })();

  return (
    <aside className={props.asideClassName}>
      <div className="space-y-6">
        <section className={panelFrameClassName}>
          <div className={panelBodyClassName}>
            <div className="mt-3 grid grid-cols-3 divide-x divide-base-300/40 text-xs">
              <div className="px-1.5 text-center">
                <p className="inline-flex items-center justify-center opacity-70">
                  <LuShieldCheck className="h-3.5 w-3.5" aria-hidden />
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wide opacity-60">{props.text.status}</p>
                <p className={`mt-1.5 font-semibold ${statusValueClassName(props.selectedData?.session?.status)}`}>
                  {props.selectedData?.session?.status ?? props.text.noSession}
                </p>
              </div>
              <div className="px-1.5 text-center">
                <p className="inline-flex items-center justify-center opacity-70">
                  <LuChartLine className="h-3.5 w-3.5" aria-hidden />
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wide opacity-60">{props.text.mode}</p>
                <p className="mt-1.5 font-semibold">{props.selected?.bot.mode ?? "-"}</p>
              </div>
              <div className="px-1.5 text-center">
                <p className="inline-flex items-center justify-center opacity-70">
                  <LuTrophy className="h-3.5 w-3.5" aria-hidden />
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wide opacity-60">{props.text.winRate}</p>
                <p className="mt-1.5 font-semibold text-primary">
                  {props.selectedData?.winRate == null ? "-" : props.formatPercent(props.selectedData.winRate)}
                </p>
              </div>
            </div>

            <label className="mt-6 flex items-center justify-between gap-3">
              <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium tracking-wide opacity-60">
                <LuBot className="h-3.5 w-3.5" aria-hidden />
                {props.text.selectedBot}
              </span>
              <select
                className="select select-xs select-bordered h-8 min-h-8 w-44 max-w-[65%] bg-base-100/65"
                value={props.selected?.bot.id ?? ""}
                onChange={(event) => props.onSelectedBotIdChange(event.target.value)}
              >
                {props.snapshots.map((item) => (
                  <option key={item.bot.id} value={item.bot.id}>
                    {item.bot.name} ({item.bot.mode} · {item.bot.wallet?.name ?? "no-wallet"})
                  </option>
                ))}
              </select>
            </label>

            {!props.selectedRuntimeCapabilityAvailable ? (
              <div className="mt-2 flex items-center gap-2">
                <span className="badge badge-xs badge-warning badge-outline">
                  {props.placeholderBadgeLabel}
                </span>
              </div>
            ) : null}

            <div className="mt-6 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-box border border-base-300/45 bg-base-100/60 px-2.5 py-2.5">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide opacity-65">
                  <LuChartCandlestick className="h-3.5 w-3.5" aria-hidden />
                  {props.text.marketContextTitle}
                </p>
                <div className="mt-2 space-y-1.5">
                  <p className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                    <span className="opacity-65">{props.text.marketGroup}</span>
                    <span className="min-w-0 break-words text-right font-semibold">{displayMarketGroupName}</span>
                  </p>
                  <p className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                    <span className="opacity-65">{props.text.exchange}</span>
                    <span className="min-w-0 break-words text-right font-semibold">{selectedVenueContext.exchange ?? "-"}</span>
                  </p>
                  <p className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                    <span className="opacity-65">{props.text.market}</span>
                    <span className="min-w-0 break-words text-right font-semibold">{normalizedMarketType}</span>
                  </p>
                  <p className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                    <span className="opacity-65">{props.text.baseCurrency}</span>
                    <span className="min-w-0 break-words text-right font-semibold">{selectedBaseCurrency}</span>
                  </p>
                </div>
              </div>
              <div className="rounded-box border border-base-300/45 bg-base-100/60 px-2.5 py-2.5">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide opacity-65">
                  <LuListChecks className="h-3.5 w-3.5" aria-hidden />
                  {props.text.strategyContextTitle}
                </p>
                <div className="mt-2 space-y-1.5">
                  <p className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                    <span className="opacity-65">{props.text.strategy}</span>
                    <span className="min-w-0 break-words text-right font-semibold">{selectedStrategyName}</span>
                  </p>
                  <p className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                    <span className="opacity-65">{props.text.interval}</span>
                    <span className="min-w-0 break-words text-right font-semibold">{selectedStrategyInterval}</span>
                  </p>
                  <p className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                    <span className="opacity-65">{props.text.leverage}</span>
                    <span className="min-w-0 break-words text-right font-semibold">{selectedStrategyLeverage}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={panelFrameClassName} data-testid="wallet-section">
          <div className={`${panelBodyClassName} text-xs`}>
            <div className="space-y-1.5">
              <p className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 opacity-65">
                  <LuWallet className="h-3.5 w-3.5" aria-hidden />
                  {props.text.walletTitle}
                </span>
                <span className="font-semibold">{walletName}</span>
              </p>
              <p className="flex items-center justify-between gap-2">
                <span className="opacity-65">{props.text.mode}</span>
                <span className="font-semibold">{selectedWalletMode ?? "-"}</span>
              </p>
              {selectedWalletMode === "LIVE" ? (
                <p className="flex items-center justify-between gap-2" data-testid="wallet-kpi-allocation-row">
                  <span className="opacity-65">{props.text.walletAllocation}</span>
                  <span className="font-semibold">{walletAllocationLabel}</span>
                </p>
              ) : null}
              <p className="flex items-center justify-between gap-2" data-testid="wallet-kpi-capital-source-row">
                <span className="opacity-65">{props.text.capitalSource}</span>
                <span className="font-semibold">{walletCapitalSourceLabel}</span>
              </p>
              {walletAccountBalance ? (
                <p className="flex items-center justify-between gap-2" data-testid="wallet-kpi-account-balance-row">
                  <span className="opacity-65">{props.text.accountBalance}</span>
                  <span className="font-semibold">{walletAccountBalance}</span>
                </p>
              ) : null}
              {walletPaperResetAt ? (
                <p className="flex items-center justify-between gap-2" data-testid="wallet-kpi-paper-reset-row">
                  <span className="opacity-65">{props.text.paperResetAt}</span>
                  <span className="font-semibold">{walletPaperResetAt}</span>
                </p>
              ) : null}
              <p className="flex items-center justify-between gap-2" data-testid="wallet-kpi-delta-row">
                <span className="opacity-65">{props.text.deltaFromStart}</span>
                <span className={`font-semibold ${selectedNet >= 0 ? "text-success" : "text-error"}`}>
                  {walletBaseline != null && walletBaseline > 0
                    ? `${props.formatPercent((selectedNet / walletBaseline) * 100)} | ${props.formatAmountWithUnit(selectedNet)}`
                    : "-"}
                </span>
              </p>
              <p className="flex items-center justify-between gap-2" data-testid="wallet-kpi-portfolio">
                <span className="opacity-65">{props.text.portfolio}</span>
                <span className="font-semibold">{walletTotal != null ? props.formatAmountWithUnit(walletTotal) : "-"}</span>
              </p>
              <p className="rounded-box border border-base-300/40 bg-base-100/45 px-2 py-1.5 text-[11px] opacity-75">
                {walletCapitalHint}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1" data-testid="wallet-kpi-row">
                {walletSplitKpis.map((kpi) => (
                  <p
                    key={kpi.key}
                    className={`w-full rounded-box border bg-base-100/35 px-2 py-1.5 ${kpi.rowClassName}`}
                    data-testid={kpi.testId}
                  >
                    <span className="block text-[10px] uppercase tracking-wide opacity-65">
                      {kpi.label}
                    </span>
                    <span className={`mt-0.5 block text-xs font-semibold ${kpi.toneClass}`}>{kpi.value}</span>
                    <span className={`block text-[11px] font-semibold ${kpi.toneClass}`}>
                      {kpi.percent ?? "-"}
                    </span>
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                {walletFreePct != null && walletInPositionsPct != null ? (
                  <div className="flex h-2 overflow-hidden rounded-full bg-base-300/30">
                    <div
                      className="h-full bg-primary/80 transition-all"
                      style={{ width: `${walletFreePct}%` }}
                    />
                    <div
                      className="h-full bg-secondary/80 transition-all"
                      style={{ width: `${walletInPositionsPct}%` }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className={panelFrameClassName} data-testid="manual-order-section">
          <div className={`${panelBodyClassName} text-xs`}>
            <div data-testid="manual-order-panel">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
                  {props.manualOrder.title}
                </p>
                <span className="text-[10px] opacity-65">{props.manualOrder.botContext}</span>
              </div>
              <div className="space-y-2">
                <label className="form-control gap-1">
                  <span className="label-text text-xs">{props.manualOrder.symbolLabel}</span>
                  <select
                    className="select select-bordered select-sm"
                    value={props.manualOrder.symbol}
                    disabled={props.manualOrder.isSubmitting || props.manualOrder.symbolOptions.length === 0}
                    onChange={(event) => props.manualOrder.onSymbolChange(event.target.value)}
                  >
                    {props.manualOrder.symbolOptions.length === 0 ? (
                      <option value="">{props.manualOrder.noSymbolsLabel}</option>
                    ) : null}
                    {props.manualOrder.symbolOptions.map((symbol) => (
                      <option key={symbol} value={symbol}>
                        {symbol}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="space-y-1">
                  <span className="label-text text-xs">{props.manualOrder.sideLabel}</span>
                  <div className="grid grid-cols-2 gap-1 rounded-box border border-base-300/55 bg-base-100/40 p-1">
                    <button
                      type="button"
                      className={`btn btn-xs h-8 min-h-8 justify-start gap-1.5 border ${
                        props.manualOrder.side === "BUY"
                          ? "border-success/55 bg-success/15 text-success"
                          : "border-base-300 bg-base-100/55 text-base-content/75"
                      }`}
                      disabled={props.manualOrder.isSubmitting}
                      onClick={() => props.manualOrder.onSideChange("BUY")}
                    >
                      <LuArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      {props.manualOrder.buyLabel}
                    </button>
                    <button
                      type="button"
                      className={`btn btn-xs h-8 min-h-8 justify-start gap-1.5 border ${
                        props.manualOrder.side === "SELL"
                          ? "border-error/55 bg-error/15 text-error"
                          : "border-base-300 bg-base-100/55 text-base-content/75"
                      }`}
                      disabled={props.manualOrder.isSubmitting}
                      onClick={() => props.manualOrder.onSideChange("SELL")}
                    >
                      <LuArrowDownRight className="h-3.5 w-3.5" aria-hidden />
                      {props.manualOrder.sellLabel}
                    </button>
                  </div>
                </div>
                <label className="form-control gap-1">
                  <span className="label-text text-xs">{props.manualOrder.priceLabel}</span>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.000001"
                      className="input input-bordered input-sm flex-1"
                      value={props.manualOrder.price}
                      disabled={props.manualOrder.isSubmitting}
                      onChange={(event) => props.manualOrder.onPriceChange(event.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      disabled={props.manualOrder.isSubmitting || props.manualOrder.liveReferencePrice == null}
                      onClick={props.manualOrder.onFillPrice}
                    >
                      {props.manualOrder.fillPriceLabel}
                    </button>
                  </div>
                </label>
                <label className="form-control gap-1">
                  <span className="label-text text-xs">{props.manualOrder.quantityLabel}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={props.manualOrder.minExecutableQty ?? 0}
                    step="0.000001"
                    className="input input-bordered input-sm"
                    data-testid="manual-order-quantity-input"
                    value={props.manualOrder.quantity}
                    disabled={props.manualOrder.isSubmitting}
                    onChange={(event) => props.manualOrder.onQuantityChange(event.target.value)}
                  />
                  <span className="text-[10px] opacity-70">
                    {props.manualOrder.minQtyLabel}: {props.manualOrder.minExecutableQty != null ? props.formatNumber(props.manualOrder.minExecutableQty, { maximumFractionDigits: 8 }) : "-"}
                  </span>
                </label>
                <label className="form-control gap-1">
                  <span className="label-text text-xs">{props.manualOrder.sliderLabel}</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={props.manualOrder.sliderPercent}
                    onChange={(event) => props.manualOrder.onSliderChange(Number(event.target.value))}
                    className="range range-xs"
                    data-testid="manual-order-quantity-slider"
                    disabled={props.manualOrder.isSubmitting || props.manualOrder.maxExecutableQty == null}
                  />
                  <span className="flex items-center justify-between text-[10px] opacity-70">
                    <span>{props.manualOrder.sliderMinLabel}</span>
                    <span>{props.manualOrder.sliderMaxLabel}</span>
                  </span>
                </label>
                <div className="rounded-box border border-base-300/45 bg-base-100/55 p-2 text-[11px]">
                  <p className="flex items-center justify-between gap-2">
                    <span className="opacity-65">{props.manualOrder.orderTypeLabel}</span>
                    <span className="font-semibold" data-testid="manual-order-order-type">
                      {props.manualOrder.orderType}
                    </span>
                  </p>
                  <p className="mt-1 flex items-center justify-between gap-2">
                    <span className="opacity-65">{props.manualOrder.marginModeLabel}</span>
                    <span className="font-semibold" data-testid="manual-order-margin-mode">
                      {props.manualOrder.marginMode}
                    </span>
                  </p>
                  <p className="mt-1 flex items-center justify-between gap-2">
                    <span className="opacity-65">{props.manualOrder.leverageLabel}</span>
                    <span className="font-semibold" data-testid="manual-order-leverage">
                      {props.manualOrder.leverage != null ? `${props.manualOrder.leverage}x` : "-"}
                    </span>
                  </p>
                  <p className="mt-1.5 text-[10px] opacity-70" data-testid="manual-order-summary-line">
                    {manualOrderSummaryLabel}: {props.manualOrder.summaryEstimateLabel}{" "}
                    <span className="font-semibold">
                      {props.manualOrder.estimatedNotional != null ? props.formatAmountWithUnit(props.manualOrder.estimatedNotional) : "-"}
                    </span>{" "}
                    | {props.manualOrder.summaryMaxLabel}{" "}
                    <span className="font-semibold">
                      {props.manualOrder.maxExecutableQty != null ? props.formatNumber(props.manualOrder.maxExecutableQty, { maximumFractionDigits: 8 }) : "-"}
                    </span>
                  </p>
                  {props.manualOrder.isContextLoading ? (
                    <p className="mt-1 text-[10px] opacity-60" data-testid="manual-order-context-state">
                      {props.manualOrder.contextLoadingLabel}
                    </p>
                  ) : props.manualOrder.liveReferencePrice == null ? (
                    <p className="mt-1 text-[10px] opacity-60" data-testid="manual-order-context-state">
                      {props.manualOrder.contextUnavailableLabel}
                    </p>
                  ) : null}
                  <p className="mt-1 text-[10px] opacity-60" data-testid="manual-order-semantics-hint">
                    {props.manualOrder.semanticsHintLabel}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm w-full"
                  onClick={props.manualOrder.onSubmit}
                  disabled={props.manualOrder.isSubmitting || props.manualOrder.isActionDisabled}
                >
                  {props.manualOrder.isSubmitting ? (
                    <span className="loading loading-spinner loading-xs" aria-hidden />
                  ) : null}
                  {props.manualOrder.isSubmitting ? props.manualOrder.openingLabel : props.manualOrder.openLabel}
                </button>
              </div>
            </div>
          </div>
        </section>

        {props.selectedData?.session?.status !== "RUNNING" ? (
          <p className="text-[11px] rounded-box border border-warning/40 bg-warning/10 px-2 py-1 text-warning">
            {props.text.noActiveSessionWarning}
          </p>
        ) : null}

      </div>
    </aside>
  );
}
