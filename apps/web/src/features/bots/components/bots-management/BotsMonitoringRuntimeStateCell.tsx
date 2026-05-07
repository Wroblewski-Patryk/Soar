import type { TranslationKey } from "@/i18n/translations";
import {
  resolveRuntimePositionProvenanceKind,
  runtimePositionProvenanceLabelSuffix,
  type RuntimePositionProvenanceKind,
} from "@/features/shared/runtimeMonitoringFormatters";
import type { BotRuntimePositionItem } from "../../types/bot.type";

type MonitorOpenPositionRuntimeState = {
  origin?: BotRuntimePositionItem["origin"];
  syncState?: BotRuntimePositionItem["syncState"];
  takeoverStatus?: BotRuntimePositionItem["takeoverStatus"];
  continuityState?: BotRuntimePositionItem["continuityState"];
  actionable?: boolean;
  strategyAutomationContextResolved?: boolean;
};

const runtimeStateLabelKey = (
  continuityState: BotRuntimePositionItem["continuityState"] | null | undefined
): TranslationKey => {
  if (continuityState === "RECOVERING") return "dashboard.bots.monitoring.runtimeStateRecovering";
  if (continuityState === "RECOVERED_UNACTIONABLE") return "dashboard.bots.monitoring.runtimeStateRecoveredUnactionable";
  if (continuityState === "EXTERNAL_CLOSE_CONFIRMED") return "dashboard.bots.monitoring.runtimeStateExternalCloseConfirmed";
  if (continuityState === "REPAIR_ONLY_CLEANUP") return "dashboard.bots.monitoring.runtimeStateRepairOnlyCleanup";
  return "dashboard.bots.monitoring.runtimeStateConfirmed";
};

const runtimePositionProvenanceLabelKey = (
  kind: RuntimePositionProvenanceKind
): TranslationKey => {
  return `dashboard.bots.monitoring.${runtimePositionProvenanceLabelSuffix(kind)}` as TranslationKey;
};

export function BotsMonitoringRuntimeStateCell({
  position,
  t,
}: {
  position: MonitorOpenPositionRuntimeState;
  t: (key: TranslationKey) => string;
}) {
  const isActionBlocked = position.actionable === false;
  const strategyContextUnresolved = position.strategyAutomationContextResolved === false;
  const provenanceKind = resolveRuntimePositionProvenanceKind(position);

  return (
    <div className="flex flex-col gap-1 leading-tight">
      <span className={`badge badge-sm ${isActionBlocked ? "badge-warning" : "badge-success"}`}>
        {t(runtimeStateLabelKey(position.continuityState))}
      </span>
      {provenanceKind ? (
        <span className="text-[10px] uppercase tracking-wide opacity-60">
          {t(runtimePositionProvenanceLabelKey(provenanceKind))}
        </span>
      ) : null}
      {isActionBlocked ? (
        <span className="text-[10px] uppercase tracking-wide text-warning">
          {t("dashboard.bots.monitoring.runtimeStateActionBlocked")}
        </span>
      ) : null}
      {strategyContextUnresolved ? (
        <span className="text-[10px] uppercase tracking-wide opacity-60">
          {t("dashboard.bots.monitoring.runtimeStateStrategyContextUnresolved")}
        </span>
      ) : null}
    </div>
  );
}
