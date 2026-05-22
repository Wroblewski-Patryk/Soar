import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { getAxiosMessage } from "@/lib/getAxiosMessage";
import { normalizeSymbol } from "@/lib/symbols";
import { resolveBotVenueContext } from "@/features/bots/utils/runtimeSurfaceTruth";
import { interpolateTemplate } from "../components/home-live-widgets/formatters";
import {
  formatQuantityForInput,
  parseOptionalPositivePriceInput,
  parsePositiveQuantityInput,
} from "../components/home-live-widgets/runtimeUiHelpers";
import {
  getDashboardManualOrderContext,
  openDashboardManualOrder,
} from "../../bots/services/bots.service";
import type { DashboardManualOrderResponse } from "../../bots/types/bot.type";
import type { RuntimeSelectedData, RuntimeSnapshot } from "../components/home-live-widgets/types";

type UseManualOrderControllerArgs = {
  selected: RuntimeSnapshot | null;
  selectedData: RuntimeSelectedData | null;
  load: (opts?: { silent?: boolean }) => Promise<void>;
  confirmRiskAction?: () => Promise<boolean>;
  labels: {
    invalidSymbol: string;
    invalidQuantity: string;
    invalidPrice: string;
    requiredPrice: string;
    marketPriceUnavailable: string;
    minQuantity: string;
    exceedsFreeFunds: string;
    success: string;
    error: string;
  };
};

export const useManualOrderController = ({
  selected,
  selectedData,
  load,
  confirmRiskAction,
  labels,
}: UseManualOrderControllerArgs) => {
  const [manualOrderSymbol, setManualOrderSymbol] = useState("");
  const [manualOrderSide, setManualOrderSide] = useState<"BUY" | "SELL">("BUY");
  const [manualOrderPrice, setManualOrderPrice] = useState("");
  const [manualOrderQuantity, setManualOrderQuantity] = useState("");
  const [manualOrderBudget, setManualOrderBudget] = useState("");
  const [manualOrderSliderPercent, setManualOrderSliderPercent] = useState(0);
  const [manualOrderPriceAutofilledSymbol, setManualOrderPriceAutofilledSymbol] = useState<string | null>(null);
  const [manualOrderPriceManuallyEditedSymbol, setManualOrderPriceManuallyEditedSymbol] = useState<string | null>(null);
  const [manualOrderLastResolvedSymbol, setManualOrderLastResolvedSymbol] = useState<string | null>(null);
  const [manualOrderContext, setManualOrderContext] = useState<{
    botId: string;
    symbol: string;
    orderType: "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT" | "TAKE_PROFIT" | "TRAILING";
    marginMode: "CROSSED" | "ISOLATED" | "NONE";
    leverage: number;
    priceReference: { markPrice: number | null };
    quantityConstraints: { minExecutableQty: number | null };
  } | null>(null);
  const [manualOrderContextLoading, setManualOrderContextLoading] = useState(false);
  const [isSubmittingManualOrder, setIsSubmittingManualOrder] = useState(false);
  const [manualOrderLastResponse, setManualOrderLastResponse] = useState<DashboardManualOrderResponse | null>(null);
  const [manualOrderLastError, setManualOrderLastError] = useState<string | null>(null);
  const manualOrderContextRequestIdRef = useRef(0);
  const previousSelectedBotIdRef = useRef<string | null>(null);
  const selectedVenueContext = useMemo(() => resolveBotVenueContext(selected?.bot), [selected?.bot]);

  const clearManualOrderActionState = useCallback(() => {
    setManualOrderLastResponse(null);
    setManualOrderLastError(null);
  }, []);

  const manualOrderSymbolOptions = useMemo(() => {
    const options = new Set<string>();
    const activeMarketGroups = (selected?.runtimeGraph?.marketGroups ?? []).filter(
      (marketGroup) => marketGroup.isEnabled && marketGroup.lifecycleStatus === "ACTIVE"
    );
    const activeGraphSymbols = new Set<string>();
    const inactiveGraphSymbols = new Set<string>();
    if (activeMarketGroups.length > 0) {
      for (const marketGroup of activeMarketGroups) {
        for (const symbol of marketGroup.symbolGroup?.symbols ?? []) {
          const normalized = normalizeSymbol(symbol);
          activeGraphSymbols.add(normalized);
          options.add(normalized);
        }
      }
    } else {
      for (const symbol of selected?.bot.symbolGroup?.symbols ?? []) {
        options.add(normalizeSymbol(symbol));
      }
    }
    for (const marketGroup of selected?.runtimeGraph?.marketGroups ?? []) {
      if (marketGroup.isEnabled && marketGroup.lifecycleStatus === "ACTIVE") continue;
      for (const symbol of marketGroup.symbolGroup?.symbols ?? []) {
        const normalized = normalizeSymbol(symbol);
        if (activeGraphSymbols.has(normalized)) continue;
        inactiveGraphSymbols.add(normalized);
        options.delete(normalized);
      }
    }
    const canUseRuntimeSymbol = (normalizedSymbol: string) =>
      activeMarketGroups.length > 0 ? activeGraphSymbols.has(normalizedSymbol) : !inactiveGraphSymbols.has(normalizedSymbol);

    for (const item of selectedData?.symbols ?? []) {
      const normalized = normalizeSymbol(item.symbol);
      if (canUseRuntimeSymbol(normalized)) options.add(normalized);
    }
    for (const item of selectedData?.open ?? []) {
      const normalized = normalizeSymbol(item.symbol);
      if (canUseRuntimeSymbol(normalized)) options.add(normalized);
    }
    return [...options].sort((left, right) => left.localeCompare(right));
  }, [selected?.bot.symbolGroup?.symbols, selected?.runtimeGraph?.marketGroups, selectedData?.open, selectedData?.symbols]);

  useEffect(() => {
    const nextBotId = selected?.bot.id ?? null;
    if (previousSelectedBotIdRef.current === nextBotId) return;

    previousSelectedBotIdRef.current = nextBotId;
    setManualOrderSymbol("");
    setManualOrderPrice("");
    setManualOrderQuantity("");
    setManualOrderBudget("");
    setManualOrderSliderPercent(0);
    setManualOrderPriceAutofilledSymbol(null);
    setManualOrderPriceManuallyEditedSymbol(null);
    setManualOrderLastResolvedSymbol(null);
    setManualOrderContext(null);
    setManualOrderContextLoading(false);
    clearManualOrderActionState();
  }, [clearManualOrderActionState, selected?.bot.id]);

  useEffect(() => {
    if (manualOrderSymbolOptions.length === 0) {
      if (manualOrderSymbol !== "") setManualOrderSymbol("");
      setManualOrderPriceAutofilledSymbol(null);
      setManualOrderPriceManuallyEditedSymbol(null);
      return;
    }

    const normalized = normalizeSymbol(manualOrderSymbol);
    if (!normalized || !manualOrderSymbolOptions.includes(normalized)) {
      setManualOrderSymbol(manualOrderSymbolOptions[0] ?? "");
    }
  }, [manualOrderSymbol, manualOrderSymbolOptions]);

  useEffect(() => {
    const symbol = normalizeSymbol(manualOrderSymbol);
    if (symbol !== manualOrderLastResolvedSymbol) {
      setManualOrderPriceManuallyEditedSymbol(null);
      setManualOrderLastResolvedSymbol(symbol || null);
    }
  }, [manualOrderLastResolvedSymbol, manualOrderSymbol]);

  useEffect(() => {
    const symbol = normalizeSymbol(manualOrderSymbol);
    const selectedBotId = selected?.bot.id;
    if (!selectedBotId || !symbol) {
      manualOrderContextRequestIdRef.current += 1;
      setManualOrderContext(null);
      setManualOrderContextLoading(false);
      return;
    }

    let canceled = false;
    const requestId = manualOrderContextRequestIdRef.current + 1;
    manualOrderContextRequestIdRef.current = requestId;
    setManualOrderContext(null);
    setManualOrderContextLoading(true);

    void getDashboardManualOrderContext({
      botId: selectedBotId,
      symbol,
      side: manualOrderSide,
    })
      .then((context) => {
        if (canceled) return;
        if (manualOrderContextRequestIdRef.current !== requestId) return;
        if (context.botId !== selectedBotId) return;
        if (normalizeSymbol(context.symbol) !== symbol) return;
        setManualOrderContext(context);
      })
      .catch(() => {
        if (canceled) return;
        if (manualOrderContextRequestIdRef.current !== requestId) return;
        setManualOrderContext(null);
      })
      .finally(() => {
        if (canceled) return;
        if (manualOrderContextRequestIdRef.current !== requestId) return;
        setManualOrderContextLoading(false);
      });

    return () => {
      canceled = true;
    };
  }, [manualOrderSide, manualOrderSymbol, selected?.bot.id]);

  const manualOrderLiveReferencePrice = useMemo(() => {
    const symbolKey = normalizeSymbol(manualOrderSymbol);
    if (!symbolKey) return null;

    const contextMatchesCurrentSelection =
      manualOrderContext != null &&
      manualOrderContext.botId === selected?.bot.id &&
      normalizeSymbol(manualOrderContext.symbol) === symbolKey;
    const contextPrice = contextMatchesCurrentSelection ? manualOrderContext.priceReference.markPrice : null;
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
  }, [manualOrderContext, manualOrderSymbol, selected?.bot.id, selectedData?.open, selectedData?.symbols]);

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
    return selectedVenueContext.marketType === "SPOT" ? 1 : null;
  }, [manualOrderContext?.leverage, selectedVenueContext.marketType]);
  const manualOrderBudgetUsesMargin = selectedVenueContext.marketType !== "SPOT";

  const manualOrderEffectivePriceForSizing = useMemo(() => {
    const parsedManualPrice = parseOptionalPositivePriceInput(manualOrderPrice);
    if (typeof parsedManualPrice === "number") return parsedManualPrice;
    if (
      manualOrderLiveReferencePrice != null &&
      Number.isFinite(manualOrderLiveReferencePrice) &&
      manualOrderLiveReferencePrice > 0
    ) {
      return manualOrderLiveReferencePrice;
    }
    return null;
  }, [manualOrderLiveReferencePrice, manualOrderPrice]);

  const manualOrderSliderMaxQuantity = useMemo(() => {
    if (manualOrderEffectivePriceForSizing == null || manualOrderEffectivePriceForSizing <= 0) {
      return manualOrderMinExecutableQty;
    }
    const freeCash = selectedData?.free;
    if (freeCash == null || !Number.isFinite(freeCash) || freeCash <= 0) {
      return manualOrderMinExecutableQty;
    }
    const effectiveLeverage =
      manualOrderBudgetUsesMargin && manualOrderLeverageForEstimate != null && manualOrderLeverageForEstimate > 0
        ? manualOrderLeverageForEstimate
        : 1;
    const rawMax = (freeCash * effectiveLeverage) / manualOrderEffectivePriceForSizing;
    if (!Number.isFinite(rawMax) || rawMax <= 0) return manualOrderMinExecutableQty;

    if (manualOrderMinExecutableQty != null) {
      return Math.max(manualOrderMinExecutableQty, rawMax);
    }
    return rawMax;
  }, [
    manualOrderEffectivePriceForSizing,
    manualOrderBudgetUsesMargin,
    manualOrderLeverageForEstimate,
    manualOrderMinExecutableQty,
    selectedData?.free,
  ]);

  useEffect(() => {
    const symbol = normalizeSymbol(manualOrderSymbol);
    if (!symbol) {
      setManualOrderPriceAutofilledSymbol(null);
      return;
    }
    if (
      manualOrderLiveReferencePrice == null ||
      !Number.isFinite(manualOrderLiveReferencePrice) ||
      manualOrderLiveReferencePrice <= 0
    ) {
      return;
    }
    if (manualOrderPriceAutofilledSymbol === symbol) return;
    if (manualOrderPriceManuallyEditedSymbol === symbol) return;

    setManualOrderPrice(formatQuantityForInput(manualOrderLiveReferencePrice));
    setManualOrderPriceAutofilledSymbol(symbol);
    setManualOrderPriceManuallyEditedSymbol(null);
  }, [
    manualOrderLiveReferencePrice,
    manualOrderPriceAutofilledSymbol,
    manualOrderPriceManuallyEditedSymbol,
    manualOrderSymbol,
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
    clearManualOrderActionState();

    const minQty = manualOrderMinExecutableQty ?? 0;
    const maxQty = manualOrderSliderMaxQuantity ?? minQty;
    if (!Number.isFinite(maxQty) || maxQty <= 0) return;

    const targetQuantity =
      maxQty <= minQty
        ? minQty
        : minQty + ((maxQty - minQty) * clampedPercent) / 100;
    setManualOrderQuantity(formatQuantityForInput(targetQuantity));
  }, [clearManualOrderActionState, manualOrderMinExecutableQty, manualOrderSliderMaxQuantity]);

  const fillManualOrderPriceFromReference = useCallback(() => {
    if (manualOrderLiveReferencePrice == null || !Number.isFinite(manualOrderLiveReferencePrice) || manualOrderLiveReferencePrice <= 0) {
      return;
    }
    setManualOrderPrice(formatQuantityForInput(manualOrderLiveReferencePrice));
    setManualOrderPriceAutofilledSymbol(normalizeSymbol(manualOrderSymbol));
    setManualOrderPriceManuallyEditedSymbol(null);
    clearManualOrderActionState();
  }, [clearManualOrderActionState, manualOrderLiveReferencePrice, manualOrderSymbol]);

  const handleManualOrderPriceChange = useCallback((price: string) => {
    setManualOrderPrice(price);
    setManualOrderPriceManuallyEditedSymbol(normalizeSymbol(manualOrderSymbol));
    clearManualOrderActionState();
  }, [clearManualOrderActionState, manualOrderSymbol]);

  const handleManualOrderSymbolChange = useCallback((symbol: string) => {
    const normalizedSymbol = normalizeSymbol(symbol);
    setManualOrderSymbol(normalizedSymbol);
    setManualOrderPrice("");
    setManualOrderPriceAutofilledSymbol(null);
    setManualOrderPriceManuallyEditedSymbol(null);
    clearManualOrderActionState();
  }, [clearManualOrderActionState]);

  const handleManualOrderSideChange = useCallback((side: "BUY" | "SELL") => {
    setManualOrderSide(side);
    clearManualOrderActionState();
  }, [clearManualOrderActionState]);

  const handleManualOrderQuantityChange = useCallback((quantity: string) => {
    setManualOrderQuantity(quantity);
    clearManualOrderActionState();
  }, [clearManualOrderActionState]);

  const manualOrderQuantityValue = useMemo(() => {
    const parsed = Number(manualOrderQuantity);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [manualOrderQuantity]);

  const manualOrderNotionalEstimate = useMemo(() => {
    if (manualOrderQuantityValue == null || manualOrderEffectivePriceForSizing == null) return null;
    return manualOrderQuantityValue * manualOrderEffectivePriceForSizing;
  }, [manualOrderEffectivePriceForSizing, manualOrderQuantityValue]);

  const manualOrderMarginEstimate = useMemo(() => {
    if (manualOrderNotionalEstimate == null || manualOrderLeverageForEstimate == null || manualOrderLeverageForEstimate <= 0) {
      return null;
    }
    return manualOrderNotionalEstimate / manualOrderLeverageForEstimate;
  }, [manualOrderLeverageForEstimate, manualOrderNotionalEstimate]);

  useEffect(() => {
    const nextBudgetSource = manualOrderBudgetUsesMargin ? manualOrderMarginEstimate : manualOrderNotionalEstimate;
    if (nextBudgetSource == null || !Number.isFinite(nextBudgetSource) || nextBudgetSource <= 0) {
      if (manualOrderBudget !== "") setManualOrderBudget("");
      return;
    }
    const nextBudget = formatQuantityForInput(nextBudgetSource);
    if (nextBudget !== manualOrderBudget) {
      setManualOrderBudget(nextBudget);
    }
  }, [manualOrderBudget, manualOrderBudgetUsesMargin, manualOrderMarginEstimate, manualOrderNotionalEstimate]);

  const handleManualOrderBudgetChange = useCallback((budget: string) => {
    setManualOrderBudget(budget);
    clearManualOrderActionState();

    const parsedBudget = parseOptionalPositivePriceInput(budget);
    if (parsedBudget == null) {
      setManualOrderQuantity("");
      return;
    }
    if (parsedBudget === "invalid") {
      return;
    }

    if (
      manualOrderEffectivePriceForSizing == null ||
      !Number.isFinite(manualOrderEffectivePriceForSizing) ||
      manualOrderEffectivePriceForSizing <= 0
    ) {
      return;
    }

    const freeFunds =
      selectedData?.free != null && Number.isFinite(selectedData.free) && selectedData.free > 0
        ? selectedData.free
        : null;
    const clampedBudget = freeFunds != null ? Math.min(parsedBudget, freeFunds) : parsedBudget;
    const effectiveLeverage =
      manualOrderBudgetUsesMargin && manualOrderLeverageForEstimate != null && manualOrderLeverageForEstimate > 0
        ? manualOrderLeverageForEstimate
        : 1;
    const targetQuantity = (clampedBudget * effectiveLeverage) / manualOrderEffectivePriceForSizing;
    setManualOrderQuantity(formatQuantityForInput(targetQuantity));
  }, [
    clearManualOrderActionState,
    manualOrderBudgetUsesMargin,
    manualOrderEffectivePriceForSizing,
    manualOrderLeverageForEstimate,
    selectedData?.free,
  ]);

  const handleSubmitManualOrder = useCallback(async () => {
    if (!selected) return;
    const symbol = normalizeSymbol(manualOrderSymbol);
    if (!symbol) {
      toast.error(labels.invalidSymbol);
      return;
    }
    const quantity = parsePositiveQuantityInput(manualOrderQuantity);
    if (quantity === "invalid") {
      toast.error(labels.invalidQuantity);
      return;
    }
    if (manualOrderMinExecutableQty != null && quantity < manualOrderMinExecutableQty) {
      toast.error(
        interpolateTemplate(labels.minQuantity, {
          value: formatQuantityForInput(manualOrderMinExecutableQty),
        })
      );
      return;
    }

    const parsedPrice = parseOptionalPositivePriceInput(manualOrderPrice);
    if (parsedPrice === "invalid") {
      toast.error(labels.invalidPrice);
      return;
    }
    if (manualOrderTypeRequiresPrice && parsedPrice == null) {
      toast.error(labels.requiredPrice);
      return;
    }
    const shouldTrustManualPriceForCurrentSymbol =
      typeof parsedPrice === "number" && manualOrderPriceManuallyEditedSymbol === symbol;
    const fallbackMarketPrice =
      !manualOrderTypeRequiresPrice &&
      manualOrderLiveReferencePrice != null &&
      Number.isFinite(manualOrderLiveReferencePrice) &&
      manualOrderLiveReferencePrice > 0
        ? manualOrderLiveReferencePrice
        : undefined;
    const effectiveManualOrderPrice = shouldTrustManualPriceForCurrentSymbol
      ? parsedPrice
      : fallbackMarketPrice ?? (typeof parsedPrice === "number" ? parsedPrice : undefined);
    if (
      selected.bot.mode === "PAPER" &&
      resolvedManualOrderType === "MARKET" &&
      (effectiveManualOrderPrice == null || !Number.isFinite(effectiveManualOrderPrice) || effectiveManualOrderPrice <= 0)
    ) {
      toast.error(labels.marketPriceUnavailable);
      return;
    }
    const freeFunds =
      selectedData?.free != null && Number.isFinite(selectedData.free) && selectedData.free > 0
        ? selectedData.free
        : null;
    if (
      freeFunds != null &&
      effectiveManualOrderPrice != null &&
      Number.isFinite(effectiveManualOrderPrice) &&
      effectiveManualOrderPrice > 0 &&
      ((quantity * effectiveManualOrderPrice) /
        (manualOrderBudgetUsesMargin && manualOrderLeverageForEstimate != null && manualOrderLeverageForEstimate > 0
          ? manualOrderLeverageForEstimate
          : 1)) >
        freeFunds +
          1e-8
    ) {
      toast.error(labels.exceedsFreeFunds);
      return;
    }

    if (selected.bot.mode === "LIVE" && confirmRiskAction) {
      const accepted = await confirmRiskAction();
      if (!accepted) return;
    }

    setIsSubmittingManualOrder(true);
    clearManualOrderActionState();
    try {
      const response = await openDashboardManualOrder({
        botId: selected.bot.id,
        symbol,
        side: manualOrderSide,
        type: resolvedManualOrderType,
        quantity,
        price: effectiveManualOrderPrice,
        riskAck: true,
      });
      toast.success(labels.success);
      setManualOrderQuantity("");
      setManualOrderLastResponse(response);
      setManualOrderLastError(null);
      await load({ silent: true });
    } catch (error) {
      const message = getAxiosMessage(error) ?? labels.error;
      setManualOrderLastError(message);
      toast.error(message);
    } finally {
      setIsSubmittingManualOrder(false);
    }
  }, [
    clearManualOrderActionState,
    confirmRiskAction,
    labels.error,
    labels.exceedsFreeFunds,
    labels.invalidPrice,
    labels.invalidQuantity,
    labels.invalidSymbol,
    labels.marketPriceUnavailable,
    labels.minQuantity,
    labels.requiredPrice,
    labels.success,
    load,
    manualOrderLiveReferencePrice,
    manualOrderBudgetUsesMargin,
    manualOrderLeverageForEstimate,
    manualOrderMinExecutableQty,
    manualOrderPrice,
    manualOrderPriceManuallyEditedSymbol,
    manualOrderQuantity,
    manualOrderSide,
    manualOrderSymbol,
    manualOrderTypeRequiresPrice,
    resolvedManualOrderType,
    selected,
    selectedData?.free,
  ]);

  return {
    isSubmittingManualOrder,
    manualOrderBudget,
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
    handleManualOrderBudgetChange,
    handleManualOrderQuantityChange,
    handleManualOrderSliderChange,
    handleManualOrderSymbolChange,
    handleSubmitManualOrder,
    handleManualOrderPriceChange,
    handleManualOrderSideChange,
    manualOrderLastResponse,
    manualOrderLastError,
    setManualOrderQuantity,
    setManualOrderSide,
  };
};
