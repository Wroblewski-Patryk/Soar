import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { getAxiosMessage } from "@/lib/getAxiosMessage";
import { normalizeSymbol } from "@/lib/symbols";
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
    minQuantity: string;
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
  const [manualOrderSliderPercent, setManualOrderSliderPercent] = useState(0);
  const [manualOrderContext, setManualOrderContext] = useState<{
    orderType: "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT" | "TAKE_PROFIT" | "TRAILING";
    marginMode: "CROSSED" | "ISOLATED" | "NONE";
    leverage: number;
    priceReference: { markPrice: number | null };
    quantityConstraints: { minExecutableQty: number | null };
  } | null>(null);
  const [manualOrderContextLoading, setManualOrderContextLoading] = useState(false);
  const [isSubmittingManualOrder, setIsSubmittingManualOrder] = useState(false);

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
    labels.invalidPrice,
    labels.invalidQuantity,
    labels.invalidSymbol,
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
  ]);

  return {
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
  };
};
