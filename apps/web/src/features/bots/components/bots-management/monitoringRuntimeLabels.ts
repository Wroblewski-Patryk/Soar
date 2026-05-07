import type { TranslationKey } from "../../../../i18n/translations";
import {
  resolveRuntimeContextSourceLabelSuffix,
  resolveRuntimeMarketStateLabelSuffix,
  type RuntimeContextSource,
  type RuntimeMarketState,
} from "../../utils/runtimeSignalLabelKeys";

type Translate = (key: TranslationKey) => string;

export const resolveRuntimeStateLabel = (t: Translate, state: RuntimeMarketState) => {
  const suffix = resolveRuntimeMarketStateLabelSuffix(state);
  return t(`dashboard.bots.monitoring.marketState${suffix}` as TranslationKey);
};

export const resolveRuntimeStateBadgeClass = (state: RuntimeMarketState) => {
  if (state === "POSITION_OPEN") return "badge-info";
  if (state === "SIGNAL_ACTIVE") return "badge-success";
  if (state === "EVALUATED_NO_TRADE") return "badge-warning";
  if (state === "CONFIGURED_ONLY") return "badge-outline";
  return "badge-ghost";
};

export const resolveContextSourceLabel = (t: Translate, source: RuntimeContextSource) => {
  const suffix = resolveRuntimeContextSourceLabelSuffix(source);
  return t(`dashboard.bots.monitoring.contextSource${suffix}` as TranslationKey);
};
