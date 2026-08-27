import { useMemo, type ReactNode, type RefObject } from "react";
import { LuCoins, LuSignal } from "react-icons/lu";
import {
  resolveRuntimeContextSourceLabelSuffix,
  resolveRuntimeMarketStateLabelSuffix,
  type RuntimeContextSourceLabelSuffix,
  type RuntimeMarketStateLabelSuffix,
} from "../../../../features/bots/utils/runtimeSignalLabelKeys";
import InlinePager from "../../../../ui/components/InlinePager";
import type { RuntimeSymbolWithLive, SignalPillValue } from "./types";

type RuntimeSignalsSectionProps = {
  signalSymbols: RuntimeSymbolWithLive[];
  hasSignalOverflow: boolean;
  signalRailRef: RefObject<HTMLDivElement | null>;
  onScrollPrevious: () => void;
  onScrollNext: () => void;
  previousLabel: string;
  nextLabel: string;
  longLabel: string;
  shortLabel: string;
  noSignalDataLabel: string;
  conditionValueUnavailableLabel: string;
  marketsLabel: string;
  signalsLabel: string;
  signalScoreLabel: string;
  signalScoreLongLabel: string;
  signalScoreShortLabel: string;
  signalContextSourceLabel: string;
  signalContextSourceLatestSignalLabel: string;
  signalContextSourceLatestDecisionLabel: string;
  signalContextSourceConfiguredFallbackLabel: string;
  signalContextSourceUnresolvedLabel: string;
  marketStatePositionOpenLabel: string;
  marketStateSignalActiveLabel: string;
  marketStateEvaluatedNoTradeLabel: string;
  marketStateConfiguredOnlyLabel: string;
  marketStateUnresolvedLabel: string;
  marketsCount: number;
  actionableSignalsCount: number;
  formatSignalScore: (value: number) => string;
  renderSymbolLabel?: (symbol: string) => ReactNode;
};

const SignalScopeIcon = ({ scope }: { scope: "LONG" | "SHORT" }) =>
  scope === "LONG" ? (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ) : (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  );

const scopeLabelClass = (scope: "LONG" | "SHORT") =>
  scope === "LONG"
    ? "border-success/40 bg-success/10 text-success"
    : "border-error/40 bg-error/10 text-error";

export default function RuntimeSignalsSection(props: RuntimeSignalsSectionProps) {
  const isUnavailableValue = (value: string | null | undefined) =>
    value?.trim().toLowerCase() === "n/a";
  const contextSourceLabels = {
    LatestSignal: props.signalContextSourceLatestSignalLabel,
    LatestDecision: props.signalContextSourceLatestDecisionLabel,
    ConfiguredFallback: props.signalContextSourceConfiguredFallbackLabel,
    Unresolved: props.signalContextSourceUnresolvedLabel,
  } satisfies Record<RuntimeContextSourceLabelSuffix, string>;
  const marketStateLabels = {
    PositionOpen: props.marketStatePositionOpenLabel,
    SignalActive: props.marketStateSignalActiveLabel,
    EvaluatedNoTrade: props.marketStateEvaluatedNoTradeLabel,
    ConfiguredOnly: props.marketStateConfiguredOnlyLabel,
    Unresolved: props.marketStateUnresolvedLabel,
  } satisfies Record<RuntimeMarketStateLabelSuffix, string>;
  const resolveContextSourceLabel = (source: RuntimeSymbolWithLive["lastSignalContextSource"]) => {
    return contextSourceLabels[resolveRuntimeContextSourceLabelSuffix(source)];
  };
  const resolveMarketStateLabel = (state: RuntimeSymbolWithLive["runtimeMarketState"]) => {
    return marketStateLabels[resolveRuntimeMarketStateLabelSuffix(state)];
  };

  const sortedSignalSymbols = useMemo(() => {
    const stateRank = (state: string | null | undefined) => {
      if (state === "POSITION_OPEN") return 0;
      if (state === "SIGNAL_ACTIVE") return 1;
      if (state === "EVALUATED_NO_TRADE") return 2;
      if (state === "CONFIGURED_ONLY") return 3;
      return 4;
    };

    return [...props.signalSymbols].sort((a, b) => {
      const byState = stateRank(a.runtimeMarketState) - stateRank(b.runtimeMarketState);
      if (byState !== 0) {
        return byState;
      }

      const aTs = Date.parse(a.lastSignalDecisionAt ?? a.lastSignalAt ?? "");
      const bTs = Date.parse(b.lastSignalDecisionAt ?? b.lastSignalAt ?? "");
      if (Number.isFinite(aTs) || Number.isFinite(bTs)) {
        const byTs = (Number.isFinite(bTs) ? bTs : 0) - (Number.isFinite(aTs) ? aTs : 0);
        if (byTs !== 0) return byTs;
      }

      const symbolCompare = a.symbol.localeCompare(b.symbol, undefined, {
        sensitivity: "base",
        numeric: true,
      });
      if (symbolCompare !== 0) return symbolCompare;

      return a.id.localeCompare(b.id, undefined, { sensitivity: "base" });
    });
  }, [props.signalSymbols]);

  return (
    <div>
      <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full justify-center md:w-auto md:justify-start">
          <div className="flex max-w-full items-center gap-2 overflow-x-auto whitespace-nowrap text-[11px] leading-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="inline-flex items-center gap-1.5">
            <LuCoins className="h-3.5 w-3.5 opacity-70" aria-hidden />
            <span className="opacity-70">{props.marketsLabel}:</span>
            <span className="font-semibold">{props.marketsCount}</span>
          </span>
            <span className="opacity-40">|</span>
            <span className="inline-flex items-center gap-1.5">
            <LuSignal className="h-3.5 w-3.5 opacity-70" aria-hidden />
            <span className="opacity-70">{props.signalsLabel}:</span>
            <span className="font-semibold">{props.actionableSignalsCount}</span>
          </span>
        </div>
      </div>
      </div>
      <div ref={props.signalRailRef} className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-full gap-3 pr-4">
          {props.signalSymbols.length === 0 ? (
            <div className="w-full rounded-box bg-base-200/35 p-4 text-center text-xs opacity-70">
              {props.noSignalDataLabel}
            </div>
          ) : null}
          {sortedSignalSymbols.map((signal) => {
            const signalDirection: SignalPillValue = signal.lastSignalDirection ?? "NEUTRAL";
            const lines = signal.lastSignalConditionLines ?? [];
            const longLines = lines.filter((line) => line.scope === "LONG");
            const shortLines = lines.filter((line) => line.scope === "SHORT");
            const longActive = signalDirection === "LONG";
            const shortActive = signalDirection === "SHORT";
            const isNeutral = !longActive && !shortActive;
            const isConfiguredSnapshot =
              signal.runtimeMarketState === "CONFIGURED_ONLY" ||
              signal.lastSignalContextSource === "configured_fallback";
            const contextSourceLabel = resolveContextSourceLabel(signal.lastSignalContextSource);
            const marketStateLabel = resolveMarketStateLabel(signal.runtimeMarketState);
            const scoreSummary = signal.lastSignalScoreSummary;
            const runtimeDetail = signal.lastSignalMessage?.trim() || signal.lastSignalReason?.trim() || null;

            return (
              <article
                key={signal.id}
                className="w-[calc((100%_-_0.75rem_-_1px)/2)] shrink-0 rounded-box border-b-[3px] border-secondary/70 bg-base-100 bg-gradient-to-br from-primary/70 to-secondary/70 p-px md:w-[calc((100%_-_1rem_-_1px)/3)] xl:w-[calc((100%_-_1.5rem_-_1px)/4)]"
              >
                <div className="rounded-box bg-base-100/85 px-3.5 py-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="min-w-0 font-semibold tracking-wide">
                      {props.renderSymbolLabel ? props.renderSymbolLabel(signal.symbol) : signal.symbol}
                    </p>
                    <span className="badge badge-outline badge-xs shrink-0">
                      {marketStateLabel}
                    </span>
                    <span
                      className="badge badge-ghost badge-xs shrink-0"
                      title={`${props.signalContextSourceLabel}: ${contextSourceLabel}`}
                    >
                      {contextSourceLabel}
                    </span>
                  </div>
                  {scoreSummary ? (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-wide opacity-70">
                      <span>{props.signalScoreLabel}</span>
                      <span className="rounded-full bg-success/10 px-1.5 py-0.5 text-success">
                        {props.signalScoreLongLabel} {props.formatSignalScore(scoreSummary.longScore)}
                      </span>
                      <span className="rounded-full bg-error/10 px-1.5 py-0.5 text-error">
                        {props.signalScoreShortLabel} {props.formatSignalScore(scoreSummary.shortScore)}
                      </span>
                    </div>
                  ) : null}
                  {runtimeDetail ? (
                    <p className="mt-2 line-clamp-2 text-[11px] leading-4 opacity-75" title={runtimeDetail}>
                      {runtimeDetail}
                    </p>
                  ) : null}
                  <div className="mt-3 grid grid-cols-2 gap-2.5 text-[11px] leading-4">
                    <div
                      className={`space-y-1.5 rounded-box transition-opacity duration-150 ${
                        isConfiguredSnapshot
                          ? "opacity-75"
                          : longActive
                            ? "opacity-100"
                            : isNeutral
                              ? "opacity-25 hover:opacity-100"
                              : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-1">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium ${scopeLabelClass("LONG")}`}
                        >
                          <SignalScopeIcon scope="LONG" />
                          {props.longLabel}
                        </span>
                      </div>
                      {longLines.length === 0 ? (
                        <p className="text-[10px] opacity-55">-</p>
                      ) : (
                        longLines.map((line, index) => (
                          <div key={`${signal.id}-long-${index}`} className="space-y-1 font-mono text-[10px] leading-4">
                            <p className="opacity-75">{line.left}</p>
                            {isUnavailableValue(line.value) ? (
                              <div className="font-sans">
                                <p className="font-medium text-warning">{props.conditionValueUnavailableLabel}</p>
                                <p className="font-mono font-semibold opacity-70">
                                  <span>{line.operator}</span>
                                  <span className="ml-1">{line.right}</span>
                                </p>
                              </div>
                            ) : (
                              <p className="font-semibold">
                                <span>{line.value}</span>
                                <span className="mx-1">{line.operator}</span>
                                <span>{line.right}</span>
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    <div
                      className={`space-y-1.5 rounded-box transition-opacity duration-150 ${
                        isConfiguredSnapshot
                          ? "opacity-75"
                          : shortActive
                            ? "opacity-100"
                            : isNeutral
                              ? "opacity-25 hover:opacity-100"
                              : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-1">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium ${scopeLabelClass("SHORT")}`}
                        >
                          <SignalScopeIcon scope="SHORT" />
                          {props.shortLabel}
                        </span>
                      </div>
                      {shortLines.length === 0 ? (
                        <p className="text-[10px] opacity-55">-</p>
                      ) : (
                        shortLines.map((line, index) => (
                          <div key={`${signal.id}-short-${index}`} className="space-y-1 font-mono text-[10px] leading-4">
                            <p className="opacity-75">{line.left}</p>
                            {isUnavailableValue(line.value) ? (
                              <div className="font-sans">
                                <p className="font-medium text-warning">{props.conditionValueUnavailableLabel}</p>
                                <p className="font-mono font-semibold opacity-70">
                                  <span>{line.operator}</span>
                                  <span className="ml-1">{line.right}</span>
                                </p>
                              </div>
                            ) : (
                              <p className="font-semibold">
                                <span>{line.value}</span>
                                <span className="mx-1">{line.operator}</span>
                                <span>{line.right}</span>
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      {props.hasSignalOverflow ? (
        <div className="mt-2 flex justify-center md:justify-start">
          <InlinePager
            size="xs"
            hideLabelsOnMobile
            previousLabel={props.previousLabel}
            nextLabel={props.nextLabel}
            onPrevious={props.onScrollPrevious}
            onNext={props.onScrollNext}
          />
        </div>
      ) : null}
    </div>
  );
}
