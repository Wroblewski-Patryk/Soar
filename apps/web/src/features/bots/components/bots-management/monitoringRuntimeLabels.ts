type Translate = (key: string) => string;

type RuntimeMarketState =
  | "POSITION_OPEN"
  | "SIGNAL_ACTIVE"
  | "EVALUATED_NO_TRADE"
  | "CONFIGURED_ONLY"
  | "UNRESOLVED"
  | null
  | undefined;

type RuntimeContextSource =
  | "latest_signal"
  | "latest_decision"
  | "configured_fallback"
  | "unresolved"
  | null
  | undefined;

export const resolveRuntimeStateLabel = (t: Translate, state: RuntimeMarketState) => {
  if (state === "POSITION_OPEN") return t("dashboard.bots.monitoring.marketStatePositionOpen");
  if (state === "SIGNAL_ACTIVE") return t("dashboard.bots.monitoring.marketStateSignalActive");
  if (state === "EVALUATED_NO_TRADE") return t("dashboard.bots.monitoring.marketStateEvaluatedNoTrade");
  if (state === "CONFIGURED_ONLY") return t("dashboard.bots.monitoring.marketStateConfiguredOnly");
  return t("dashboard.bots.monitoring.marketStateUnresolved");
};

export const resolveRuntimeStateBadgeClass = (state: RuntimeMarketState) => {
  if (state === "POSITION_OPEN") return "badge-info";
  if (state === "SIGNAL_ACTIVE") return "badge-success";
  if (state === "EVALUATED_NO_TRADE") return "badge-warning";
  if (state === "CONFIGURED_ONLY") return "badge-outline";
  return "badge-ghost";
};

export const resolveContextSourceLabel = (t: Translate, source: RuntimeContextSource) => {
  if (source === "latest_signal") return t("dashboard.bots.monitoring.contextSourceLatestSignal");
  if (source === "latest_decision") return t("dashboard.bots.monitoring.contextSourceLatestDecision");
  if (source === "configured_fallback") return t("dashboard.bots.monitoring.contextSourceConfiguredFallback");
  return t("dashboard.bots.monitoring.contextSourceUnresolved");
};
