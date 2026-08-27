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
        signalScoreLabel="Score"
        signalScoreLongLabel="LONG"
        signalScoreShortLabel="SHORT"
        signalContextSourceLabel="Context source"
        signalContextSourceLatestSignalLabel="Latest signal"
        signalContextSourceLatestDecisionLabel="Latest decision"
        signalContextSourceConfiguredFallbackLabel="Closed-candle snapshot"
        signalContextSourceUnresolvedLabel="Unresolved"
        marketStatePositionOpenLabel="Position open"
        marketStateSignalActiveLabel="Accepted signal"
        marketStateEvaluatedNoTradeLabel="Evaluated / no trade"
        marketStateConfiguredOnlyLabel="Market snapshot"
        marketStateUnresolvedLabel="Unresolved state"
        marketsCount={1}
        actionableSignalsCount={0}
        formatSignalScore={(value) => String(value)}
      />
    );

    expect(screen.getByText("Waiting for indicator data")).toBeInTheDocument();
    expect(screen.queryByText("n/a")).not.toBeInTheDocument();
    expect(screen.getByText("44.12")).toBeInTheDocument();
  });

  it("renders deterministic context source labels on signal cards", () => {
    render(
      <RuntimeSignalsSection
        signalSymbols={[
          ({
            id: "signal-btc",
            symbol: "BTCUSDT",
            lastSignalDirection: "LONG",
            runtimeMarketState: "SIGNAL_ACTIVE",
            lastSignalContextSource: "latest_signal",
            lastSignalScoreSummary: { longScore: 2.5, shortScore: 1 },
            lastSignalConditionLines: [],
          } as unknown as RuntimeSymbolWithLive),
          ({
            id: "signal-ada",
            symbol: "ADAUSDT",
            lastSignalDirection: null,
            runtimeMarketState: "CONFIGURED_ONLY",
            lastSignalContextSource: "configured_fallback",
            lastSignalConditionLines: [],
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
        signalScoreLabel="Score"
        signalScoreLongLabel="LONG"
        signalScoreShortLabel="SHORT"
        signalContextSourceLabel="Context source"
        signalContextSourceLatestSignalLabel="Latest signal"
        signalContextSourceLatestDecisionLabel="Latest decision"
        signalContextSourceConfiguredFallbackLabel="Closed-candle snapshot"
        signalContextSourceUnresolvedLabel="Unresolved"
        marketStatePositionOpenLabel="Position open"
        marketStateSignalActiveLabel="Accepted signal"
        marketStateEvaluatedNoTradeLabel="Evaluated / no trade"
        marketStateConfiguredOnlyLabel="Market snapshot"
        marketStateUnresolvedLabel="Unresolved state"
        marketsCount={2}
        actionableSignalsCount={1}
        formatSignalScore={(value) => String(value)}
      />
    );

    expect(screen.getByText("Latest signal")).toBeInTheDocument();
    expect(screen.getByText("Closed-candle snapshot")).toBeInTheDocument();
    expect(screen.getByText("Score")).toBeInTheDocument();
    expect(screen.getByText("LONG 2.5")).toBeInTheDocument();
    expect(screen.getByText("SHORT 1")).toBeInTheDocument();
  });

  it("does not render score summary when backend score data is absent", () => {
    render(
      <RuntimeSignalsSection
        signalSymbols={[
          ({
            id: "signal-xrp",
            symbol: "XRPUSDT",
            lastSignalDirection: null,
            runtimeMarketState: "UNRESOLVED",
            lastSignalContextSource: "unresolved",
            lastSignalScoreSummary: null,
            lastSignalConditionLines: [],
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
        signalScoreLabel="Score"
        signalScoreLongLabel="LONG"
        signalScoreShortLabel="SHORT"
        signalContextSourceLabel="Context source"
        signalContextSourceLatestSignalLabel="Latest signal"
        signalContextSourceLatestDecisionLabel="Latest decision"
        signalContextSourceConfiguredFallbackLabel="Closed-candle snapshot"
        signalContextSourceUnresolvedLabel="Unresolved"
        marketStatePositionOpenLabel="Position open"
        marketStateSignalActiveLabel="Accepted signal"
        marketStateEvaluatedNoTradeLabel="Evaluated / no trade"
        marketStateConfiguredOnlyLabel="Market snapshot"
        marketStateUnresolvedLabel="Unresolved state"
        marketsCount={1}
        actionableSignalsCount={0}
        formatSignalScore={(value) => String(value)}
      />
    );

    expect(screen.queryByText("Score")).not.toBeInTheDocument();
  });

  it("renders backend runtime signal detail without inventing absent fallback copy", () => {
    render(
      <RuntimeSignalsSection
        signalSymbols={[
          ({
            id: "signal-message",
            symbol: "BTCUSDT",
            lastSignalDirection: null,
            runtimeMarketState: "EVALUATED_NO_TRADE",
            lastSignalContextSource: "latest_decision",
            lastSignalMessage: "Signal blocked because max open positions was reached",
            lastSignalReason: "Bot max open positions reached",
            lastSignalConditionLines: [],
          } as unknown as RuntimeSymbolWithLive),
          ({
            id: "signal-reason",
            symbol: "ETHUSDT",
            lastSignalDirection: null,
            runtimeMarketState: "EVALUATED_NO_TRADE",
            lastSignalContextSource: "latest_decision",
            lastSignalMessage: "   ",
            lastSignalReason: "No votes",
            lastSignalConditionLines: [],
          } as unknown as RuntimeSymbolWithLive),
          ({
            id: "signal-empty",
            symbol: "ADAUSDT",
            lastSignalDirection: null,
            runtimeMarketState: "CONFIGURED_ONLY",
            lastSignalContextSource: "configured_fallback",
            lastSignalMessage: null,
            lastSignalReason: null,
            lastSignalConditionLines: [],
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
        signalScoreLabel="Score"
        signalScoreLongLabel="LONG"
        signalScoreShortLabel="SHORT"
        signalContextSourceLabel="Context source"
        signalContextSourceLatestSignalLabel="Latest signal"
        signalContextSourceLatestDecisionLabel="Latest decision"
        signalContextSourceConfiguredFallbackLabel="Closed-candle snapshot"
        signalContextSourceUnresolvedLabel="Unresolved"
        marketStatePositionOpenLabel="Position open"
        marketStateSignalActiveLabel="Accepted signal"
        marketStateEvaluatedNoTradeLabel="Evaluated / no trade"
        marketStateConfiguredOnlyLabel="Market snapshot"
        marketStateUnresolvedLabel="Unresolved state"
        marketsCount={3}
        actionableSignalsCount={0}
        formatSignalScore={(value) => String(value)}
      />
    );

    expect(screen.getByText("Signal blocked because max open positions was reached")).toBeInTheDocument();
    expect(screen.queryByText("Bot max open positions reached")).not.toBeInTheDocument();
    expect(screen.getByText("No votes")).toBeInTheDocument();
    expect(screen.queryByText("Runtime detail")).not.toBeInTheDocument();
  });

  it("renders explicit backend runtime market state labels", () => {
    render(
      <RuntimeSignalsSection
        signalSymbols={[
          ({
            id: "state-open",
            symbol: "BTCUSDT",
            runtimeMarketState: "POSITION_OPEN",
            lastSignalContextSource: "latest_decision",
            lastSignalConditionLines: [],
          } as unknown as RuntimeSymbolWithLive),
          ({
            id: "state-active",
            symbol: "ETHUSDT",
            runtimeMarketState: "SIGNAL_ACTIVE",
            lastSignalContextSource: "latest_signal",
            lastSignalConditionLines: [],
          } as unknown as RuntimeSymbolWithLive),
          ({
            id: "state-no-trade",
            symbol: "ADAUSDT",
            runtimeMarketState: "EVALUATED_NO_TRADE",
            lastSignalContextSource: "latest_decision",
            lastSignalConditionLines: [],
          } as unknown as RuntimeSymbolWithLive),
          ({
            id: "state-snapshot",
            symbol: "SOLUSDT",
            runtimeMarketState: "CONFIGURED_ONLY",
            lastSignalContextSource: "configured_fallback",
            lastSignalConditionLines: [],
          } as unknown as RuntimeSymbolWithLive),
          ({
            id: "state-null",
            symbol: "XRPUSDT",
            runtimeMarketState: null,
            lastSignalContextSource: "unresolved",
            lastSignalConditionLines: [],
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
        signalScoreLabel="Score"
        signalScoreLongLabel="LONG"
        signalScoreShortLabel="SHORT"
        signalContextSourceLabel="Context source"
        signalContextSourceLatestSignalLabel="Latest signal"
        signalContextSourceLatestDecisionLabel="Latest decision"
        signalContextSourceConfiguredFallbackLabel="Closed-candle snapshot"
        signalContextSourceUnresolvedLabel="Unresolved"
        marketStatePositionOpenLabel="Position open"
        marketStateSignalActiveLabel="Accepted signal"
        marketStateEvaluatedNoTradeLabel="Evaluated / no trade"
        marketStateConfiguredOnlyLabel="Market snapshot"
        marketStateUnresolvedLabel="Unresolved state"
        marketsCount={5}
        actionableSignalsCount={1}
        formatSignalScore={(value) => String(value)}
      />
    );

    expect(screen.getByText("Position open")).toBeInTheDocument();
    expect(screen.getByText("Accepted signal")).toBeInTheDocument();
    expect(screen.getByText("Evaluated / no trade")).toBeInTheDocument();
    expect(screen.getByText("Market snapshot")).toBeInTheDocument();
    expect(screen.getByText("Unresolved state")).toBeInTheDocument();
  });

  it("fails closed to unresolved labels for unknown backend runtime signal values", () => {
    render(
      <RuntimeSignalsSection
        signalSymbols={[
          ({
            id: "state-future",
            symbol: "DOGEUSDT",
            runtimeMarketState: "FUTURE_BACKEND_STATE",
            lastSignalContextSource: "future_backend_source",
            lastSignalConditionLines: [],
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
        signalScoreLabel="Score"
        signalScoreLongLabel="LONG"
        signalScoreShortLabel="SHORT"
        signalContextSourceLabel="Context source"
        signalContextSourceLatestSignalLabel="Latest signal"
        signalContextSourceLatestDecisionLabel="Latest decision"
        signalContextSourceConfiguredFallbackLabel="Closed-candle snapshot"
        signalContextSourceUnresolvedLabel="Unresolved source"
        marketStatePositionOpenLabel="Position open"
        marketStateSignalActiveLabel="Accepted signal"
        marketStateEvaluatedNoTradeLabel="Evaluated / no trade"
        marketStateConfiguredOnlyLabel="Market snapshot"
        marketStateUnresolvedLabel="Unresolved state"
        marketsCount={1}
        actionableSignalsCount={0}
        formatSignalScore={(value) => String(value)}
      />
    );

    expect(screen.getByText("Unresolved state")).toBeInTheDocument();
    expect(screen.getByText("Unresolved source")).toBeInTheDocument();
    expect(screen.queryByText("FUTURE_BACKEND_STATE")).not.toBeInTheDocument();
    expect(screen.queryByText("future_backend_source")).not.toBeInTheDocument();
  });
});
