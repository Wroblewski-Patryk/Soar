import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
      expect(result.current.manualOrderQuantity).toBe("61.30581383");
    });

    await act(async () => {
      await result.current.handleSubmitManualOrder();
    });

    expect(openDashboardManualOrderMock).toHaveBeenCalledWith({
      botId: "bot-paper-switch",
      symbol: "DOGEUSDT",
      side: "BUY",
      type: "MARKET",
      quantity: 61.30581383,
      price: 0.09787,
      riskAck: true,
    });
  });
});
