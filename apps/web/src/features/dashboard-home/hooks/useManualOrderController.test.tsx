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
            minNotional: 5,
            minExecutableQty: 349,
          },
        };
      }
    );

    const labels = {
      invalidSymbol: "invalid-symbol",
      invalidQuantity: "invalid-quantity",
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
      expect(result.current.manualOrderQuantity).toBe("1532.64534587");
    });

    await act(async () => {
      await result.current.handleSubmitManualOrder();
    });

    expect(openDashboardManualOrderMock).toHaveBeenCalledWith({
      botId: "bot-paper-switch",
      symbol: "DOGEUSDT",
      side: "BUY",
      type: "MARKET",
      quantity: 1532.64534587,
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
        minNotional: 5,
        minExecutableQty: 0.001,
      },
    });

    const labels = {
      invalidSymbol: "invalid-symbol",
      invalidQuantity: "invalid-quantity",
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
        minNotional: 5,
        minExecutableQty: 0.02,
      },
    });

    const labels = {
      invalidSymbol: "invalid-symbol",
      invalidQuantity: "invalid-quantity",
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

    const { result } = renderHook(() =>
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

    act(() => {
      result.current.handleManualOrderQuantityChange("0.02");
    });

    expect(result.current.manualOrderLastError).toBeNull();
  });
});
