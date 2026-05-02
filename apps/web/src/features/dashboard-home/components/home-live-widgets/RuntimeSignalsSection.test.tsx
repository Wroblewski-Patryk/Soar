import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import RuntimeSignalsSection from "./RuntimeSignalsSection";
import type { RuntimeSymbolWithLive } from "./types";

describe("RuntimeSignalsSection", () => {
  it("renders unavailable indicator values as pending data instead of raw n/a math", () => {
    render(
      <RuntimeSignalsSection
        signalSymbols={[
          ({
            id: "signal-eth",
            symbol: "ETHUSDT",
            lastSignalDirection: null,
            runtimeMarketState: "POSITION_OPEN",
            lastSignalContextSource: "latest_decision",
            lastSignalConditionLines: [
              {
                scope: "LONG",
                left: "RSI(14)",
                value: "n/a",
                operator: "<",
                right: "20",
                matched: null,
              },
              {
                scope: "SHORT",
                left: "RSI(14)",
                value: "44.12",
                operator: ">",
                right: "80",
                matched: false,
              },
            ],
          } as unknown as RuntimeSymbolWithLive),
        ]}
        hasSignalOverflow={false}
        signalRailRef={createRef<HTMLDivElement>()}
        onScrollPrevious={vi.fn()}
        onScrollNext={vi.fn()}
        previousLabel="Prev"
        nextLabel="Next"
        longLabel="LONG"
        shortLabel="SHORT"
        noSignalDataLabel="No signal data"
        conditionValueUnavailableLabel="Waiting for indicator data"
        marketsLabel="Markets"
        signalsLabel="Signals"
        marketsCount={1}
        actionableSignalsCount={0}
      />
    );

    expect(screen.getByText("Waiting for indicator data")).toBeInTheDocument();
    expect(screen.queryByText("n/a")).not.toBeInTheDocument();
    expect(screen.getByText("44.12")).toBeInTheDocument();
  });
});
