import { useCallback, useEffect, useMemo, useState } from "react";
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
import type { RuntimeSelectedData, RuntimeSnapshot } from "../components/home-live-widgets/types";

type UseManualOrderControllerArgs = {
  selected: RuntimeSnapshot | null;
  selectedData: RuntimeSelectedData | null;
  load: (opts?: { silent?: boolean }) => Promise<void>;
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
    orderType: "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT" | "TAKE_PROFIT" | "TRAILING";
    marginMode: "CROSSED" | "ISOLATED" | "NONE";
    leverage: number;
    priceReference: { markPrice: number | null };
    quantityConstraints: { minExecutableQty: number | null };
  } | null>(null);
  const [manualOrderContextLoading, setManualOrderContextLoading] = useState(false);
  const [isSubmittingManualOrder, setIsSubmittingManualOrder] = useState(false);
  const selectedVenueContext = useMemo(() => resolveBotVenueContext(selected?.bot), [selected?.bot]);

  const manualOrderSymbolOptions = useMemo(() => {
    const options = new Set<string>();
    for (const symbol of selected?.bot.symbolGroup?.symbols ?? []) {
      options.add(normalizeSymbol(symbol));
    }
    for (const marketGroup of selected?.runtimeGraph?.marketGroups ?? []) {
      for (const symbol of marketGroup.symbolGroup?.symbols ?? []) {
        options.add(normalizeSymbol(symbol));
      }
    }
    for (const item of selectedData?.symbols ?? []) options.add(normalizeSymbol(item.symbol));
    for (const item of selectedData?.open ?? []) options.add(normalizeSymbol(item.symbol));
    return [...options].sort((left, right) => left.localeCompare(right));
  }, [selected?.bot.symbolGroup?.symbols, selected?.runtimeGraph?.marketGroups, selectedData?.open, selectedData?.symbols]);

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
      setManualOrderContext(null);
      setManualOrderContextLoading(false);
      return;
    }

    let canceled = false;
    setManualOrderContext(null);
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
    return selectedVenueContext.marketType === "SPOT" ? 1 : null;
  }, [manualOrderContext?.leverage, selectedVenueContext.marketType]);

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
    const rawMax = freeCash / manualOrderEffectivePriceForSizing;
    if (!Number.isFinite(rawMax) || rawMax <= 0) return manualOrderMinExecutableQty;

    if (manualOrderMinExecutableQty != null) {
      return Math.max(manualOrderMinExecutableQty, rawMax);
    }
    return rawMax;
  }, [
    manualOrderEffectivePriceForSizing,
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
    setManualOrderPriceAutofilledSymbol(normalizeSymbol(manualOrderSymbol));
    setManualOrderPriceManuallyEditedSymbol(null);
  }, [manualOrderLiveReferencePrice, manualOrderSymbol]);

  const handleManualOrderPriceChange = useCallback((price: string) => {
    setManualOrderPrice(price);
    setManualOrderPriceManuallyEditedSymbol(normalizeSymbol(manualOrderSymbol));
  }, [manualOrderSymbol]);

  const handleManualOrderSymbolChange = useCallback((symbol: string) => {
    const normalizedSymbol = normalizeSymbol(symbol);
    setManualOrderSymbol(normalizedSymbol);
    setManualOrderPrice("");
    setManualOrderPriceAutofilledSymbol(null);
    setManualOrderPriceManuallyEditedSymbol(null);
  }, []);

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
    if (manualOrderNotionalEstimate == null || !Number.isFinite(manualOrderNotionalEstimate) || manualOrderNotionalEstimate <= 0) {
      if (manualOrderBudget !== "") setManualOrderBudget("");
      return;
    }
    const nextBudget = formatQuantityForInput(manualOrderNotionalEstimate);
    if (nextBudget !== manualOrderBudget) {
      setManualOrderBudget(nextBudget);
    }
  }, [manualOrderBudget, manualOrderNotionalEstimate]);

  const handleManualOrderBudgetChange = useCallback((budget: string) => {
    setManualOrderBudget(budget);

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
    const targetQuantity = clampedBudget / manualOrderEffectivePriceForSizing;
    setManualOrderQuantity(formatQuantityForInput(targetQuantity));
  }, [manualOrderEffectivePriceForSizing, selectedData?.free]);

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
    const fallbackMarketPrice =
      !manualOrderTypeRequiresPrice &&
      manualOrderLiveReferencePrice != null &&
      Number.isFinite(manualOrderLiveReferencePrice) &&
      manualOrderLiveReferencePrice > 0
        ? manualOrderLiveReferencePrice
        : undefined;
    const effectiveManualOrderPrice = typeof parsedPrice === "number" ? parsedPrice : fallbackMarketPrice;
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
      quantity * effectiveManualOrderPrice > freeFunds + 1e-8
    ) {
      toast.error(labels.exceedsFreeFunds);
      return;
    }

    setIsSubmittingManualOrder(true);
    try {
      await openDashboardManualOrder({
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
      await load({ silent: true });
    } catch (error) {
      toast.error(getAxiosMessage(error) ?? labels.error);
    } finally {
      setIsSubmittingManualOrder(false);
    }
  }, [
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
    manualOrderMinExecutableQty,
    manualOrderPrice,
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
    handleManualOrderSliderChange,
    handleManualOrderSymbolChange,
    handleSubmitManualOrder,
    handleManualOrderPriceChange,
    setManualOrderQuantity,
    setManualOrderSide,
  };
};
