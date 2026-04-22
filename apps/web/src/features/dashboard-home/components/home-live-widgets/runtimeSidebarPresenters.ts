import { interpolateTemplate } from "./formatters";
import type { RuntimeSnapshot } from "./types";
import type { RuntimeSidebarSectionProps } from "./RuntimeSidebarSection";

type Translate = (key: string) => string;

type ManualOrderPresenter = RuntimeSidebarSectionProps["manualOrder"];
type TextPresenter = RuntimeSidebarSectionProps["text"];

type BuildManualOrderPresenterArgs = {
  t: Translate;
  selected: RuntimeSnapshot | null;
  selectedRuntimeCapabilityAvailable: boolean;
  manualOrderOpenLabel: string;
  manualOrderSubmittingLabel: string;
  manualOrderContext: {
    marginMode: "CROSSED" | "ISOLATED" | "NONE";
  } | null;
  manualOrderLeverageForEstimate: number | null;
  manualOrderMinExecutableQty: number | null;
  manualOrderSliderMaxQuantity: number | null;
  manualOrderLiveReferencePrice: number | null;
  manualOrderQuantity: string;
  manualOrderPrice: string;
  manualOrderSliderPercent: number;
  manualOrderNotionalEstimate: number | null;
  manualOrderMarginEstimate: number | null;
  manualOrderContextLoading: boolean;
  isSubmittingManualOrder: boolean;
  manualOrderSymbolOptions: string[];
  manualOrderSymbol: string;
  manualOrderSide: "BUY" | "SELL";
  resolvedManualOrderType: "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT" | "TAKE_PROFIT" | "TRAILING";
  onSymbolChange: (symbol: string) => void;
  onSideChange: (side: "BUY" | "SELL") => void;
  onPriceChange: (price: string) => void;
  onFillPrice: () => void;
  onQuantityChange: (quantity: string) => void;
  onSliderChange: (nextPercent: number) => void;
  onSubmit: () => void;
};

export const buildRuntimeSidebarManualOrderPresenter = ({
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
  onSymbolChange,
  onSideChange,
  onPriceChange,
  onFillPrice,
  onQuantityChange,
  onSliderChange,
  onSubmit,
}: BuildManualOrderPresenterArgs): ManualOrderPresenter => ({
  title: t("dashboard.home.runtime.manualOrderTitle"),
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
  semanticsHintLabel: t("dashboard.home.runtime.manualOrderSemanticsHint"),
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
  onSymbolChange,
  onSideChange,
  onPriceChange,
  onFillPrice,
  onQuantityChange,
  onSliderChange,
  onSubmit,
});

export const buildRuntimeSidebarTextPresenter = (t: Translate): TextPresenter => ({
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
});
