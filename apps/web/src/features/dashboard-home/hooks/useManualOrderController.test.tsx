import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";

import { useManualOrderController } from "./useManualOrderController";
import type {
  RuntimeSelectedData,
  RuntimeSnapshot,
} from "../components/home-live-widgets/types";

const getDashboardManualOrderContextMock = vi.hoisted(() => vi.fn());
const openDashboardManualOrderMock = vi.hoisted(() => vi.fn());

vi.mock("../../bots/services/bots.service", () => ({
  getDashboardManualOrderContext: getDashboardManualOrderContextMock,
  openDashboardManualOrder: openDashboardManualOrderMock,
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("useManualOrderController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    openDashboardManualOrderMock.mockResolvedValue({
      id: "order-manual-controller",
      status: "FILLED",
    });
  });

  it("refreshes manual-order context after bot switch and submits the current symbol price instead of stale previous-bot price", async () => {
    getDashboardManualOrderContextMock.mockImplementation(
      async (params: { botId: string; symbol: string; side?: "BUY" | "SELL" }) => {
        const symbol = params.symbol.toUpperCase();
        if (params.botId === "bot-live-switch") {
          return {
            botId: params.botId,
            symbol,
            mode: "LIVE",
            orderType: "MARKET",
            marginMode: "ISOLATED",
            leverage: 15,
            priceReference: {
              markPrice: 629.33,
              source: "exchange_mark",
            },
            quantityConstraints: {
              minAmount: 0.01,
              amountPrecision: 0.01,
              amountPrecisionMode: "TICK_SIZE",
              amountStep: 0.01,
              contractSize: 1,
              minNotional: 5,
              minExecutableQty: 0.01,
            },
          };
        }

        if (symbol === "DOGEUSDT") {
          return {
            botId: params.botId,
            symbol,
            mode: "PAPER",
            orderType: "MARKET",
            marginMode: "ISOLATED",
            leverage: 25,
            priceReference: {
              markPrice: 0.09787,
              source: "exchange_mark",
            },
            quantityConstraints: {
              minAmount: 1,
              amountPrecision: 1,
              amountPrecisionMode: "DECIMAL_PLACES",
              amountStep: 0.1,
              contractSize: 1,
              minNotional: 5,
              minExecutableQty: 51.1,
            },
          };
        }

        return {
          botId: params.botId,
          symbol,
          mode: "PAPER",
          orderType: "MARKET",
          marginMode: "ISOLATED",
          leverage: 25,
          priceReference: {
            markPrice: 0.01433,
            source: "exchange_mark",
          },
          quantityConstraints: {
            minAmount: 1,
            amountPrecision: 1,
            amountPrecisionMode: "DECIMAL_PLACES",
            amountStep: 0.1,
            contractSize: 1,
            minNotional: 5,
            minExecutableQty: 349,
          },
        };
      }
    );

    const labels = {
      invalidSymbol: "invalid-symbol",
      invalidQuantity: "invalid-quantity",
      invalidQuantityStep: "invalid-step {value}",
      quantityRulesUnavailable: "rules-unavailable",
      invalidPrice: "invalid-price",
      requiredPrice: "required-price",
      marketPriceUnavailable: "market-price-unavailable",
      minQuantity: "min-quantity {value}",
      exceedsFreeFunds: "exceeds-free-funds",
      success: "success",
      error: "error",
    };

    const liveSelected = {
      bot: {
        id: "bot-live-switch",
        mode: "LIVE",
        marketType: "FUTURES",
        exchange: "BINANCE",
        symbolGroup: {
          id: "group-live-switch",
          name: "Live group",
          symbols: ["BNBUSDT"],
        },
      },
      runtimeGraph: {
        marketGroups: [],
      },
    } as unknown as RuntimeSnapshot;

    const liveSelectedData = {
      free: 1000,
      symbols: [
        {
          symbol: "BNBUSDT",
          liveLastPrice: 629.33,
        },
      ],
      open: [],
    } as unknown as RuntimeSelectedData;

    const paperSelected = {
      bot: {
        id: "bot-paper-switch",
        mode: "PAPER",
        marketType: "FUTURES",
        exchange: "BINANCE",
        symbolGroup: {
          id: "group-paper-switch",
          name: "Paper group",
          symbols: ["1000000BOBUSDT", "DOGEUSDT"],
        },
      },
      runtimeGraph: {
        marketGroups: [],
      },
    } as unknown as RuntimeSnapshot;

    const paperSelectedData = {
      free: 10,
      symbols: [
        {
          symbol: "1000000BOBUSDT",
          liveLastPrice: 0.01433,
        },
        {
          symbol: "DOGEUSDT",
          liveLastPrice: 0.09787,
        },
      ],
      open: [],
    } as unknown as RuntimeSelectedData;

    const loadMock = vi.fn().mockResolvedValue(undefined);

    const { result, rerender } = renderHook(
      ({
        selected,
        selectedData,
      }: {
        selected: RuntimeSnapshot;
        selectedData: RuntimeSelectedData;
      }) =>
        useManualOrderController({
          selected,
          selectedData,
          load: loadMock,
          labels,
        }),
      {
        initialProps: {
          selected: liveSelected,
          selectedData: liveSelectedData,
        },
      }
    );

    await waitFor(() => {
      expect(result.current.manualOrderSymbol).toBe("BNBUSDT");
      expect(result.current.manualOrderPrice).toBe("629.33");
    });

    rerender({
      selected: paperSelected,
      selectedData: paperSelectedData,
    });

    await waitFor(() => {
      expect(result.current.manualOrderSymbol).toBe("1000000BOBUSDT");
      expect(result.current.manualOrderPrice).toBe("0.01433");
    });

    act(() => {
      result.current.handleManualOrderSymbolChange("DOGEUSDT");
    });

    await waitFor(() => {
      expect(result.current.manualOrderSymbol).toBe("DOGEUSDT");
      expect(result.current.manualOrderPrice).toBe("0.09787");
      expect(result.current.manualOrderMinExecutableQty).toBe(51.1);
    });

    act(() => {
      result.current.handleManualOrderBudgetChange("6");
    });

    await waitFor(() => {
      expect(result.current.manualOrderQuantity).toBe("1532.6");
    });

    await act(async () => {
      await result.current.handleSubmitManualOrder();
    });

    expect(openDashboardManualOrderMock).toHaveBeenCalledWith({
      botId: "bot-paper-switch",
      symbol: "DOGEUSDT",
      side: "BUY",
      type: "MARKET",
      quantity: 1532.6,
      price: 0.09787,
      riskAck: true,
    });
  });

  it("treats futures budget and free-funds validation as leverage-aware margin instead of raw notional", async () => {
    getDashboardManualOrderContextMock.mockResolvedValue({
      botId: "bot-live-margin",
      symbol: "BTCUSDT",
      mode: "LIVE",
      orderType: "MARKET",
      marginMode: "ISOLATED",
      leverage: 10,
      priceReference: {
        markPrice: 100,
        source: "exchange_mark",
      },
      quantityConstraints: {
        minAmount: 0.001,
        amountPrecision: 0.001,
        amountPrecisionMode: "TICK_SIZE",
        amountStep: 0.001,
        contractSize: 1,
        minNotional: 5,
        minExecutableQty: 0.001,
      },
    });

    const labels = {
      invalidSymbol: "invalid-symbol",
      invalidQuantity: "invalid-quantity",
      invalidQuantityStep: "invalid-step {value}",
      quantityRulesUnavailable: "rules-unavailable",
      invalidPrice: "invalid-price",
      requiredPrice: "required-price",
      marketPriceUnavailable: "market-price-unavailable",
      minQuantity: "min-quantity {value}",
      exceedsFreeFunds: "exceeds-free-funds",
      success: "success",
      error: "error",
    };

    const selected = {
      bot: {
        id: "bot-live-margin",
        mode: "LIVE",
        marketType: "FUTURES",
        exchange: "BINANCE",
        symbolGroup: {
          id: "group-live-margin",
          name: "Margin group",
          symbols: ["BTCUSDT"],
        },
      },
      runtimeGraph: {
        marketGroups: [],
      },
    } as unknown as RuntimeSnapshot;

    const selectedData = {
      free: 100,
      symbols: [
        {
          symbol: "BTCUSDT",
          liveLastPrice: 100,
        },
      ],
      open: [],
    } as unknown as RuntimeSelectedData;

    const loadMock = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useManualOrderController({
        selected,
        selectedData,
        load: loadMock,
        labels,
      })
    );

    await waitFor(() => {
      expect(result.current.manualOrderSymbol).toBe("BTCUSDT");
      expect(result.current.manualOrderLeverageForEstimate).toBe(10);
      expect(result.current.manualOrderPrice).toBe("100");
      expect(result.current.manualOrderSliderMaxQuantity).toBe(10);
    });

    act(() => {
      result.current.handleManualOrderBudgetChange("100");
    });

    await waitFor(() => {
      expect(result.current.manualOrderQuantity).toBe("10");
      expect(result.current.manualOrderNotionalEstimate).toBe(1000);
      expect(result.current.manualOrderMarginEstimate).toBe(100);
      expect(result.current.manualOrderBudget).toBe("100");
    });

    act(() => {
      result.current.setManualOrderQuantity("5");
    });

    await waitFor(() => {
      expect(result.current.manualOrderBudget).toBe("50");
    });

    await act(async () => {
      await result.current.handleSubmitManualOrder();
    });

    expect(openDashboardManualOrderMock).toHaveBeenCalledWith({
      botId: "bot-live-margin",
      clientOrderId: expect.stringMatching(/^soar_[a-f0-9]{22}$/),
      symbol: "BTCUSDT",
      side: "BUY",
      type: "MARKET",
      quantity: 5,
      price: 100,
      riskAck: true,
    });

    act(() => {
      result.current.setManualOrderQuantity("11");
    });

    await act(async () => {
      await result.current.handleSubmitManualOrder();
    });

    expect(toast.error).toHaveBeenCalledWith("exceeds-free-funds");
    expect(openDashboardManualOrderMock).toHaveBeenCalledTimes(1);
  });

  it("requires explicit confirmation before submitting a LIVE manual order", async () => {
    getDashboardManualOrderContextMock.mockResolvedValue({
      botId: "bot-live-confirm",
      symbol: "BTCUSDT",
      mode: "LIVE",
      orderType: "MARKET",
      marginMode: "ISOLATED",
      leverage: 10,
      priceReference: {
        markPrice: 100,
        source: "exchange_mark",
      },
      quantityConstraints: {
        minAmount: 0.001,
        amountPrecision: 0.001,
        amountPrecisionMode: "TICK_SIZE",
        amountStep: 0.001,
        contractSize: 1,
        minNotional: 5,
        minExecutableQty: 0.001,
      },
    });

    const labels = {
      invalidSymbol: "invalid-symbol",
      invalidQuantity: "invalid-quantity",
      invalidQuantityStep: "invalid-step {value}",
      quantityRulesUnavailable: "rules-unavailable",
      invalidPrice: "invalid-price",
      requiredPrice: "required-price",
      marketPriceUnavailable: "market-price-unavailable",
      minQuantity: "min-quantity {value}",
      exceedsFreeFunds: "exceeds-free-funds",
      success: "success",
      error: "error",
    };
    const selected = {
      bot: {
        id: "bot-live-confirm",
        mode: "LIVE",
        marketType: "FUTURES",
        exchange: "BINANCE",
        symbolGroup: {
          id: "group-live-confirm",
          name: "Live group",
          symbols: ["BTCUSDT"],
        },
      },
      runtimeGraph: {
        marketGroups: [],
      },
    } as unknown as RuntimeSnapshot;
    const selectedData = {
      free: 100,
      symbols: [{ symbol: "BTCUSDT", liveLastPrice: 100 }],
      open: [],
    } as unknown as RuntimeSelectedData;
    const confirmRiskAction = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    const { result } = renderHook(() =>
      useManualOrderController({
        selected,
        selectedData,
        load: vi.fn().mockResolvedValue(undefined),
        confirmRiskAction,
        labels,
      })
    );

    await waitFor(() => {
      expect(result.current.manualOrderSymbol).toBe("BTCUSDT");
      expect(result.current.manualOrderPrice).toBe("100");
    });

    act(() => {
      result.current.setManualOrderQuantity("1");
    });

    await act(async () => {
      await result.current.handleSubmitManualOrder();
    });

    expect(confirmRiskAction).toHaveBeenCalledTimes(1);
    expect(openDashboardManualOrderMock).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.handleSubmitManualOrder();
    });

    expect(confirmRiskAction).toHaveBeenCalledTimes(2);
    expect(openDashboardManualOrderMock).toHaveBeenCalledWith({
      botId: "bot-live-confirm",
      clientOrderId: expect.stringMatching(/^soar_[a-f0-9]{22}$/),
      symbol: "BTCUSDT",
      side: "BUY",
      type: "MARKET",
      quantity: 1,
      price: 100,
      riskAck: true,
    });
  });

  it("uses active canonical market groups for manual-order symbols before stale direct projections", async () => {
    getDashboardManualOrderContextMock.mockResolvedValue({
      botId: "bot-canonical-manual-symbols",
      symbol: "BNBUSDT",
      mode: "PAPER",
      orderType: "MARKET",
      marginMode: "CROSSED",
      leverage: 8,
      priceReference: {
        markPrice: 300,
        source: "exchange_mark",
      },
      quantityConstraints: {
        minAmount: 0.01,
        amountPrecision: 0.01,
        amountPrecisionMode: "TICK_SIZE",
        amountStep: 0.01,
        contractSize: 1,
        minNotional: 5,
        minExecutableQty: 0.02,
      },
    });

    const labels = {
      invalidSymbol: "invalid-symbol",
      invalidQuantity: "invalid-quantity",
      invalidQuantityStep: "invalid-step {value}",
      quantityRulesUnavailable: "rules-unavailable",
      invalidPrice: "invalid-price",
      requiredPrice: "required-price",
      marketPriceUnavailable: "market-price-unavailable",
      minQuantity: "min-quantity {value}",
      exceedsFreeFunds: "exceeds-free-funds",
      success: "success",
      error: "error",
    };

    const selected = {
      bot: {
        id: "bot-canonical-manual-symbols",
        mode: "PAPER",
        marketType: "FUTURES",
        exchange: "BINANCE",
        symbolGroup: {
          id: "group-stale-direct",
          name: "Stale direct group",
          symbols: ["ETHUSDT"],
        },
      },
      runtimeGraph: {
        marketGroups: [
          {
            id: "group-active",
            lifecycleStatus: "ACTIVE",
            isEnabled: true,
            symbolGroup: {
              symbols: ["BNBUSDT"],
            },
          },
          {
            id: "group-paused",
            lifecycleStatus: "PAUSED",
            isEnabled: true,
            symbolGroup: {
              symbols: ["SOLUSDT"],
            },
          },
        ],
      },
    } as unknown as RuntimeSnapshot;

    const selectedData = {
      free: 1000,
      symbols: [
        { symbol: "BNBUSDT", liveLastPrice: 300 },
        { symbol: "ETHUSDT", liveLastPrice: 1800 },
        { symbol: "SOLUSDT", liveLastPrice: 150 },
      ],
      open: [],
    } as unknown as RuntimeSelectedData;

    const { result } = renderHook(() =>
      useManualOrderController({
        selected,
        selectedData,
        load: vi.fn().mockResolvedValue(undefined),
        labels,
      })
    );

    await waitFor(() => {
      expect(result.current.manualOrderSymbol).toBe("BNBUSDT");
      expect(result.current.manualOrderSymbolOptions).toEqual(["BNBUSDT"]);
      expect(result.current.manualOrderLeverageForEstimate).toBe(8);
    });
  });

  it("keeps backend manual-order blocked reason until the draft changes", async () => {
    getDashboardManualOrderContextMock.mockResolvedValue({
      botId: "bot-manual-blocked",
      symbol: "BTCUSDT",
      mode: "LIVE",
      orderType: "MARKET",
      marginMode: "CROSSED",
      leverage: 10,
      priceReference: {
        markPrice: 68000,
        source: "exchange_mark",
      },
      quantityConstraints: {
        minAmount: 0.001,
        amountPrecision: 0.001,
        amountPrecisionMode: "TICK_SIZE",
        amountStep: 0.001,
        contractSize: 1,
        minNotional: 5,
        minExecutableQty: 0.001,
      },
    });
    openDashboardManualOrderMock.mockRejectedValue({
      isAxiosError: true,
      response: {
        data: {
          error: {
            message: "LIVE_MANUAL_SCOPE_UNRESOLVED",
          },
        },
      },
    });

    const labels = {
      invalidSymbol: "invalid-symbol",
      invalidQuantity: "invalid-quantity",
      invalidQuantityStep: "invalid-step {value}",
      quantityRulesUnavailable: "rules-unavailable",
      invalidPrice: "invalid-price",
      requiredPrice: "required-price",
      marketPriceUnavailable: "market-price-unavailable",
      minQuantity: "min-quantity {value}",
      exceedsFreeFunds: "exceeds-free-funds",
      success: "success",
      error: "error",
    };

    const selected = {
      bot: {
        id: "bot-manual-blocked",
        mode: "LIVE",
        marketType: "FUTURES",
        exchange: "BINANCE",
      },
      runtimeGraph: {
        marketGroups: [
          {
            lifecycleStatus: "ACTIVE",
            isEnabled: true,
            symbolGroup: {
              symbols: ["BTCUSDT"],
            },
          },
        ],
      },
    } as unknown as RuntimeSnapshot;

    const selectedData = {
      free: 1000,
      symbols: [{ symbol: "BTCUSDT", liveLastPrice: 68000 }],
      open: [],
    } as unknown as RuntimeSelectedData;

    const { result, unmount } = renderHook(() =>
      useManualOrderController({
        selected,
        selectedData,
        load: vi.fn().mockResolvedValue(undefined),
        labels,
      })
    );

    await waitFor(() => {
      expect(result.current.manualOrderSymbol).toBe("BTCUSDT");
    });

    act(() => {
      result.current.handleManualOrderQuantityChange("0.01");
    });

    await act(async () => {
      await result.current.handleSubmitManualOrder();
    });

    expect(result.current.manualOrderLastError).toBe("LIVE_MANUAL_SCOPE_UNRESOLVED");
    expect(toast.error).toHaveBeenCalledWith("LIVE_MANUAL_SCOPE_UNRESOLVED");

    const firstClientOrderId = openDashboardManualOrderMock.mock.calls[0]?.[0]?.clientOrderId;
    await act(async () => {
      await result.current.handleSubmitManualOrder();
    });
    expect(openDashboardManualOrderMock.mock.calls[1]?.[0]?.clientOrderId).toBe(firstClientOrderId);

    unmount();
    const resumed = renderHook(() => useManualOrderController({
      selected,
      selectedData,
      load: vi.fn().mockResolvedValue(undefined),
      labels,
    }));
    await waitFor(() => expect(resumed.result.current.manualOrderSymbol).toBe("BTCUSDT"));
    act(() => resumed.result.current.handleManualOrderQuantityChange("0.01"));
    await act(async () => {
      await resumed.result.current.handleSubmitManualOrder();
    });
    expect(openDashboardManualOrderMock.mock.calls[2]?.[0]?.clientOrderId).toBe(firstClientOrderId);

    act(() => {
      resumed.result.current.handleManualOrderQuantityChange("0.02");
    });

    expect(resumed.result.current.manualOrderLastError).toBeNull();
    await act(async () => {
      await resumed.result.current.handleSubmitManualOrder();
    });
    expect(openDashboardManualOrderMock.mock.calls[3]?.[0]?.clientOrderId).not.toBe(firstClientOrderId);
  });
});

describe("manual quantity grid parity", () => {
  const labels = {
    invalidSymbol: "invalid-symbol",
    invalidQuantity: "invalid-quantity",
    invalidQuantityStep: "invalid-step {value}",
    quantityRulesUnavailable: "rules-unavailable",
    invalidPrice: "invalid-price",
    requiredPrice: "required-price",
    marketPriceUnavailable: "market-price-unavailable",
    minQuantity: "min-quantity {value}",
    exceedsFreeFunds: "exceeds-free-funds",
    success: "success",
    error: "error",
  };

  const setup = async (params: {
    precision: number;
    mode: "TICK_SIZE" | "DECIMAL_PLACES" | null;
    step: number | null;
    marketType?: "FUTURES" | "SPOT";
    min?: number | null;
  }) => {
    const spot = params.marketType === "SPOT";
    const symbol = spot ? "ADAUSDT" : "NGUSDT";
    const botId = spot ? "spot-bot" : "gate-futures-bot";
    const markPrice = spot ? 2 : 0.25;
    getDashboardManualOrderContextMock.mockResolvedValue({
      botId, symbol, mode: spot ? "PAPER" : "LIVE", orderType: "MARKET",
      marginMode: spot ? "NONE" : "ISOLATED", leverage: spot ? 1 : 5,
      priceReference: { markPrice, source: "exchange_mark" },
      quantityConstraints: {
        minAmount: spot ? 0.25 : 1, minNotional: spot ? 1 : 5.1,
        amountPrecision: params.precision, amountPrecisionMode: params.mode,
        amountStep: params.step, contractSize: spot ? null : 10,
        minExecutableQty: params.min === undefined ? (spot ? 0.25 : 60) : params.min,
      },
      sideAwarePreview: { side: "BUY", requestedQuantity: null,
        estimatedNotional: null, estimatedMargin: null, maxOpenPositions: 3 },
    });
    const selected = {
      bot: { id: botId, name: "Grid bot", mode: spot ? "PAPER" : "LIVE",
        marketType: spot ? "SPOT" : "FUTURES", exchange: "GATEIO",
        symbolGroup: { id: "group", name: "Group", symbols: [symbol] } },
      runtimeGraph: { marketGroups: [] },
    } as unknown as RuntimeSnapshot;
    const selectedData = { free: spot ? 10 : 50,
      symbols: [{ symbol, liveLastPrice: markPrice }], open: [] } as unknown as RuntimeSelectedData;
    const hook = renderHook(() => useManualOrderController({
      selected, selectedData, load: vi.fn().mockResolvedValue(undefined), labels,
    }));
    await waitFor(() => expect(hook.result.current.manualOrderContext?.symbol).toBe(symbol));
    return hook;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    openDashboardManualOrderMock.mockResolvedValue({ id: "grid-order", status: "FILLED" });
  });

  it("rejects 60.5 for integer Gate contracts and floors budget/slider to the API step", async () => {
    const { result } = await setup({ precision: 1, mode: "TICK_SIZE", step: 1 });
    expect(result.current.manualOrderSliderMaxQuantity).toBe(100);
    act(() => result.current.handleManualOrderQuantityChange("60.5"));
    await waitFor(() => {
      expect(result.current.manualOrderQuantityError).toBe("invalid-step 1");
      expect(result.current.manualOrderNotionalEstimate).toBeNull();
      expect(result.current.manualOrderMarginEstimate).toBeNull();
      expect(result.current.manualOrderBudget).toBe("");
    });
    await act(async () => { await result.current.handleSubmitManualOrder(); });
    expect(toast.error).toHaveBeenCalledWith("invalid-step 1");
    expect(openDashboardManualOrderMock).not.toHaveBeenCalled();

    act(() => result.current.handleManualOrderBudgetChange("30.25"));
    await waitFor(() => {
      expect(result.current.manualOrderQuantity).toBe("60");
      expect(result.current.manualOrderNotionalEstimate).toBe(150);
      expect(result.current.manualOrderMarginEstimate).toBe(30);
      expect(result.current.manualOrderBudget).toBe("30");
    });
    act(() => result.current.handleManualOrderSliderChange(50));
    expect(result.current.manualOrderQuantity).toBe("80");
    expect(result.current.manualOrderMarginEstimate).toBe(40);
    await act(async () => { await result.current.handleSubmitManualOrder(); });
    expect(openDashboardManualOrderMock).toHaveBeenCalledWith(expect.objectContaining({
      botId: "gate-futures-bot", quantity: 80, price: 0.25,
    }));
  });

  it("accepts 60.5 for one decimal place with API-consistent contract-size quote", async () => {
    const { result } = await setup({ precision: 1, mode: "DECIMAL_PLACES", step: 0.1 });
    act(() => result.current.handleManualOrderQuantityChange("60.5"));
    await waitFor(() => {
      expect(result.current.manualOrderQuantityError).toBeNull();
      expect(result.current.manualOrderNotionalEstimate).toBe(151.25);
      expect(result.current.manualOrderMarginEstimate).toBe(30.25);
      expect(result.current.manualOrderBudget).toBe("30.25");
    });
    await act(async () => { await result.current.handleSubmitManualOrder(); });
    expect(openDashboardManualOrderMock).toHaveBeenCalledWith(expect.objectContaining({ quantity: 60.5 }));
  });

  it("requires multiples of tick five and refuses unknown precision metadata", async () => {
    const five = await setup({ precision: 5, mode: "TICK_SIZE", step: 5 });
    act(() => five.result.current.handleManualOrderQuantityChange("60.5"));
    expect(five.result.current.manualOrderNotionalEstimate).toBeNull();
    await act(async () => { await five.result.current.handleSubmitManualOrder(); });
    expect(openDashboardManualOrderMock).not.toHaveBeenCalled();
    act(() => five.result.current.handleManualOrderBudgetChange("32.49"));
    expect(five.result.current.manualOrderQuantity).toBe("60");
    five.unmount();

    const unknown = await setup({ precision: 1, mode: null, step: null, min: null });
    expect(unknown.result.current.manualOrderSliderMaxQuantity).toBeNull();
    act(() => unknown.result.current.handleManualOrderQuantityChange("60"));
    expect(unknown.result.current.manualOrderNotionalEstimate).toBeNull();
    expect(unknown.result.current.manualOrderQuantityError).toBe("rules-unavailable");
    await act(async () => { await unknown.result.current.handleSubmitManualOrder(); });
    expect(toast.error).toHaveBeenCalledWith("rules-unavailable");
    expect(openDashboardManualOrderMock).not.toHaveBeenCalled();
  });

  it("uses one unit of notional per SPOT quantity and floors a budget to its fractional tick", async () => {
    const { result } = await setup({ precision: 0.25, mode: "TICK_SIZE", step: 0.25, marketType: "SPOT" });
    act(() => result.current.handleManualOrderBudgetChange("2.6"));
    await waitFor(() => {
      expect(result.current.manualOrderQuantity).toBe("1.25");
      expect(result.current.manualOrderNotionalEstimate).toBe(2.5);
      expect(result.current.manualOrderBudget).toBe("2.5");
    });
    await act(async () => { await result.current.handleSubmitManualOrder(); });
    expect(openDashboardManualOrderMock).toHaveBeenCalledWith(expect.objectContaining({
      botId: "spot-bot", quantity: 1.25,
    }));
  });
});
