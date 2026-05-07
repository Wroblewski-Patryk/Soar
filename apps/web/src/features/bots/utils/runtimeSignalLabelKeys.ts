export type RuntimeMarketState =
  | "POSITION_OPEN"
  | "SIGNAL_ACTIVE"
  | "EVALUATED_NO_TRADE"
  | "CONFIGURED_ONLY"
  | "UNRESOLVED"
  | (string & {})
  | null
  | undefined;

export type RuntimeContextSource =
  | "latest_signal"
  | "latest_decision"
  | "configured_fallback"
  | "unresolved"
  | (string & {})
  | null
  | undefined;

export type RuntimeMarketStateLabelSuffix =
  | "PositionOpen"
  | "SignalActive"
  | "EvaluatedNoTrade"
  | "ConfiguredOnly"
  | "Unresolved";

export type RuntimeContextSourceLabelSuffix =
  | "LatestSignal"
  | "LatestDecision"
  | "ConfiguredFallback"
  | "Unresolved";

export const resolveRuntimeMarketStateLabelSuffix = (
  state: RuntimeMarketState,
): RuntimeMarketStateLabelSuffix => {
  if (state === "POSITION_OPEN") return "PositionOpen";
  if (state === "SIGNAL_ACTIVE") return "SignalActive";
  if (state === "EVALUATED_NO_TRADE") return "EvaluatedNoTrade";
  if (state === "CONFIGURED_ONLY") return "ConfiguredOnly";
  return "Unresolved";
};

export const resolveRuntimeContextSourceLabelSuffix = (
  source: RuntimeContextSource,
): RuntimeContextSourceLabelSuffix => {
  if (source === "latest_signal") return "LatestSignal";
  if (source === "latest_decision") return "LatestDecision";
  if (source === "configured_fallback") return "ConfiguredFallback";
  return "Unresolved";
};
