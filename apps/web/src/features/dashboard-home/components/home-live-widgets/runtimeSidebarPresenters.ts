import { interpolateTemplate } from "./formatters";
import { resolveBotVenueContext } from "@/features/bots/utils/runtimeSurfaceTruth";
import type { DashboardManualOrderResponse } from "@/features/bots/types/bot.type";
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
  manualOrderBudget: string;
  manualOrderPrice: string;
  manualOrderSliderPercent: number;
  manualOrderNotionalEstimate: number | null;
  manualOrderMarginEstimate: number | null;
  manualOrderContextLoading: boolean;
  isSubmittingManualOrder: boolean;
  manualOrderLastResponse: DashboardManualOrderResponse | null;
  manualOrderLastError: string | null;
  manualOrderSymbolOptions: string[];
  manualOrderSymbol: string;
  manualOrderSide: "BUY" | "SELL";
  resolvedManualOrderType: "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT" | "TAKE_PROFIT" | "TRAILING";
  onSymbolChange: (symbol: string) => void;
  onSideChange: (side: "BUY" | "SELL") => void;
  onPriceChange: (price: string) => void;
  onFillPrice: () => void;
  onQuantityChange: (quantity: string) => void;
  onBudgetChange: (budget: string) => void;
  onSliderChange: (nextPercent: number) => void;
  onSubmit: () => void;
};

const resolveManualOrderActionState = (
  response: DashboardManualOrderResponse | null,
  error: string | null,
  isSubmitting: boolean,
  t: Translate
): Pick<
  ManualOrderPresenter,
  | "actionStateLabel"
  | "actionStateDescription"
  | "actionStateOrderId"
  | "actionStateExchangeOrderId"
  | "actionStateTone"
> => {
  if (!response) {
    if (error) {
      return {
        actionStateLabel: t("dashboard.home.runtime.manualOrderActionStateBlocked"),
        actionStateDescription: error,
        actionStateOrderId: null,
        actionStateExchangeOrderId: null,
        actionStateTone: "error",
      };
    }
    if (isSubmitting) {
      return {
        actionStateLabel: t("dashboard.home.runtime.manualOrderActionStateSubmitted"),
        actionStateDescription: t("dashboard.home.runtime.manualOrderActionDescriptionSubmitted"),
        actionStateOrderId: null,
        actionStateExchangeOrderId: null,
        actionStateTone: "info",
      };
    }
    return {
      actionStateLabel: null,
      actionStateDescription: null,
      actionStateOrderId: null,
      actionStateExchangeOrderId: null,
      actionStateTone: "info",
    };
  }

  const status = response.status.toUpperCase();
  if (status === "FILLED" && response.positionId) {
    return {
      actionStateLabel: t("dashboard.home.runtime.manualOrderActionStatePositionOpened"),
      actionStateDescription: t("dashboard.home.runtime.manualOrderActionDescriptionPositionOpened"),
      actionStateOrderId: response.id,
      actionStateExchangeOrderId: response.exchangeOrderId ?? null,
      actionStateTone: "info",
    };
  }
  if (status === "FILLED") {
    return {
      actionStateLabel: t("dashboard.home.runtime.openOrderStatusFilled"),
      actionStateDescription: t("dashboard.home.runtime.manualOrderActionDescriptionSubmitted"),
      actionStateOrderId: response.id,
      actionStateExchangeOrderId: response.exchangeOrderId ?? null,
      actionStateTone: "info",
    };
  }
  if (status === "OPEN" || status === "PARTIALLY_FILLED") {
    const hasExchangeOrderId = typeof response.exchangeOrderId === "string" && response.exchangeOrderId.trim().length > 0;
    return {
      actionStateLabel:
        status === "OPEN" && hasExchangeOrderId
          ? t("dashboard.home.runtime.manualOrderActionStateImportedOpenOrder")
          : status === "PARTIALLY_FILLED"
          ? t("dashboard.home.runtime.openOrderStatusPartiallyFilled")
          : t("dashboard.home.runtime.manualOrderActionStateWaitingForFill"),
      actionStateDescription:
        status === "OPEN" && hasExchangeOrderId
          ? t("dashboard.home.runtime.manualOrderActionDescriptionImportedOpenOrder")
          : t("dashboard.home.runtime.manualOrderActionDescriptionWaitingForFill"),
      actionStateOrderId: response.id,
      actionStateExchangeOrderId: response.exchangeOrderId ?? null,
      actionStateTone: "info",
    };
  }

  return {
    actionStateLabel: t("dashboard.home.runtime.manualOrderActionStateSubmitted"),
    actionStateDescription: t("dashboard.home.runtime.manualOrderActionDescriptionSubmitted"),
    actionStateOrderId: response.id,
    actionStateExchangeOrderId: response.exchangeOrderId ?? null,
    actionStateTone: "info",
  };
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
  manualOrderBudget,
  manualOrderPrice,
  manualOrderSliderPercent,
  manualOrderNotionalEstimate,
  manualOrderMarginEstimate,
  manualOrderContextLoading,
  isSubmittingManualOrder,
  manualOrderLastResponse,
  manualOrderLastError,
  manualOrderSymbolOptions,
  manualOrderSymbol,
  manualOrderSide,
  resolvedManualOrderType,
  onSymbolChange,
  onSideChange,
  onPriceChange,
  onFillPrice,
  onQuantityChange,
  onBudgetChange,
  onSliderChange,
  onSubmit,
}: BuildManualOrderPresenterArgs): ManualOrderPresenter => {
  const selectedVenueContext = resolveBotVenueContext(selected?.bot);
  const actionState = resolveManualOrderActionState(
    manualOrderLastResponse,
    manualOrderLastError,
    isSubmittingManualOrder,
    t
  );

  return ({
  title: t("dashboard.home.runtime.manualOrderTitle"),
  symbolLabel: t("dashboard.home.runtime.symbol"),
  sideLabel: t("dashboard.home.runtime.side"),
  orderTypeLabel: t("dashboard.home.runtime.manualOrderOrderTypeLabel"),
  marginModeLabel: t("dashboard.home.runtime.manualOrderMarginModeLabel"),
  leverageLabel: t("dashboard.home.runtime.manualOrderLeverageLabel"),
  quantityLabel: t("dashboard.home.runtime.qty"),
  budgetLabel: t("dashboard.home.runtime.manualOrderBudgetLabel"),
  budgetMaxLabel: t("dashboard.home.runtime.manualOrderBudgetMaxLabel"),
  priceLabel: t("dashboard.home.runtime.price"),
  fillPriceLabel: t("dashboard.home.runtime.manualOrderUseMarketPrice"),
  minQtyLabel: t("dashboard.home.runtime.manualOrderMinQtyLabel"),
  sliderLabel: t("dashboard.home.runtime.manualOrderSliderLabel"),
  sliderMinLabel: t("dashboard.home.runtime.manualOrderSliderMinLabel"),
  sliderMaxLabel: t("dashboard.home.runtime.manualOrderSliderMaxLabel"),
  openLabel: manualOrderOpenLabel,
  openingLabel: manualOrderSubmittingLabel,
  actionStateTitle: t("dashboard.home.runtime.manualOrderActionStateTitle"),
  actionStateLabel: actionState.actionStateLabel,
  actionStateDescription: actionState.actionStateDescription,
  actionStateOrderId: actionState.actionStateOrderId,
  actionStateExchangeOrderId: actionState.actionStateExchangeOrderId,
  actionStateTone: actionState.actionStateTone,
  exchangeOrderIdLabel: t("dashboard.home.runtime.exchangeOrderId"),
  buyLabel: t("dashboard.home.runtime.manualOrderBuyLabel"),
  sellLabel: t("dashboard.home.runtime.manualOrderSellLabel"),
  noSymbolsLabel: t("dashboard.home.runtime.noSignalData"),
  botContext: selected ? `${selected.bot.name} | ${selected.bot.mode}` : "-",
  symbolOptions: manualOrderSymbolOptions,
  symbol: manualOrderSymbol,
  side: manualOrderSide,
  orderType: resolvedManualOrderType,
  marginMode: manualOrderContext?.marginMode ?? (selectedVenueContext.marketType === "SPOT" ? "NONE" : "CROSSED"),
  leverage: manualOrderLeverageForEstimate,
  minExecutableQty: manualOrderMinExecutableQty,
  maxExecutableQty: manualOrderSliderMaxQuantity ?? null,
  liveReferencePrice: manualOrderLiveReferencePrice,
  quantity: manualOrderQuantity,
  budget: manualOrderBudget,
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
  onBudgetChange,
  onSliderChange,
  onSubmit,
  });
};

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
  strategy: t("dashboard.home.runtime.strategyLabel"),
  interval: t("dashboard.home.runtime.interval"),
  leverage: t("dashboard.home.runtime.leverage"),
  walletAllocation: t("dashboard.home.runtime.walletAllocation"),
  capitalSource: t("dashboard.home.runtime.capitalSource"),
  capitalSourcePaperInitial: t("dashboard.home.runtime.capitalSourcePaperInitial"),
  capitalSourcePaperReset: t("dashboard.home.runtime.capitalSourcePaperReset"),
  capitalSourceLiveExchange: t("dashboard.home.runtime.capitalSourceLiveExchange"),
  capitalHintPaperInitial: t("dashboard.home.runtime.capitalHintPaperInitial"),
  capitalHintPaperReset: t("dashboard.home.runtime.capitalHintPaperReset"),
  capitalHintLivePercent: t("dashboard.home.runtime.capitalHintLivePercent"),
  capitalHintLiveFixed: t("dashboard.home.runtime.capitalHintLiveFixed"),
  capitalHintLiveFull: t("dashboard.home.runtime.capitalHintLiveFull"),
  accountBalance: t("dashboard.home.runtime.accountBalance"),
  paperResetAt: t("dashboard.home.runtime.paperResetAt"),
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
