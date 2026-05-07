export type RuntimeDirectionValue = "LONG" | "SHORT" | "BUY" | "SELL";
export type RuntimeTradeLifecycleValue = "OPEN" | "DCA" | "CLOSE" | "UNKNOWN";
export type RuntimeCloseInitiatorValue =
  | "BOT_APP"
  | "USER_APP"
  | "USER_EXCHANGE"
  | "EXCHANGE"
  | "SYSTEM_REPAIR";
export type RuntimeCloseReasonValue =
  | "TP"
  | "TTP"
  | "SL"
  | "TSL"
  | "LIQUIDATION"
  | "ACCOUNT_FLOOR"
  | "MANUAL"
  | "SIGNAL_EXIT"
  | "POSITION_LIFETIME"
  | "EXTERNAL_SYNC_MISSING"
  | "SYSTEM_REPAIR";
export type RuntimeContinuityStateValue =
  | "CONFIRMED"
  | "RECOVERING"
  | "RECOVERED_UNACTIONABLE"
  | "EXTERNAL_CLOSE_CONFIRMED"
  | "REPAIR_ONLY_CLEANUP";
export type RuntimeContinuityLabelSuffix =
  | "continuityConfirmed"
  | "continuityRecovering"
  | "continuityRecoveredUnactionable"
  | "continuityExternalCloseConfirmed"
  | "continuityRepairOnlyCleanup";
export type RuntimeOrderSourceLabelSuffix = "sourceManual" | "sourceBot" | "sourceImported";
export type RuntimeOpenOrderStatusLabelSuffix =
  | "openOrderStatusWaitingFill"
  | "openOrderStatusPartiallyFilled"
  | "openOrderStatusFilled";
export type RuntimePositionProvenanceKind =
  | "exchange_adopted"
  | "exchange_unowned"
  | "exchange_ambiguous"
  | "exchange_manual_only"
  | "exchange_synced"
  | "sync_drift"
  | "sync_orphan_local"
  | "sync_orphan_exchange";
export type RuntimePositionProvenanceLabelSuffix =
  | "provenanceExchangeAdopted"
  | "provenanceExchangeUnowned"
  | "provenanceExchangeAmbiguous"
  | "provenanceExchangeManualOnly"
  | "provenanceExchangeSynced"
  | "provenanceSyncDrift"
  | "provenanceSyncOrphanLocal"
  | "provenanceSyncOrphanExchange";
export type RuntimeTradeFeeMetaInput = {
  feeSource: "ESTIMATED" | "EXCHANGE_FILL";
  feePending: boolean;
  feeCurrency: string | null;
};

export const formatAgeCompact = (ms: number) => {
  if (!Number.isFinite(ms) || ms <= 0) return "0s";
  if (ms < 60_000) return `${Math.max(1, Math.floor(ms / 1_000))}s`;
  const totalMinutes = Math.floor(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};

export const toRuntimeSessionStatusBadgeClass = (status?: string | null) => {
  if (status === "RUNNING") return "badge-info";
  if (status === "COMPLETED") return "badge-success";
  if (status === "FAILED") return "badge-error";
  if (status === "CANCELED") return "badge-warning";
  return "badge-ghost";
};

export const toRuntimeDirectionBadgeClass = (value: string) => {
  if (value === "BUY" || value === "LONG") return "badge-success";
  if (value === "SELL" || value === "SHORT") return "badge-error";
  return "badge-ghost";
};

export const toRuntimeDirectionPillClass = (value: RuntimeDirectionValue) => {
  if (value === "BUY" || value === "LONG") return "border-success/40 bg-success/10 text-success";
  return "border-error/40 bg-error/10 text-error";
};

export const toRuntimeTradeLifecycleBadgeClass = (value: RuntimeTradeLifecycleValue) => {
  if (value === "OPEN") return "badge-success";
  if (value === "DCA") return "badge-warning";
  if (value === "CLOSE") return "badge-primary";
  return "badge-ghost";
};

export const toRuntimeTradeLifecyclePillClass = (value: RuntimeTradeLifecycleValue) => {
  if (value === "OPEN") return "border-success/40 bg-success/10 text-success";
  if (value === "DCA") return "border-warning/40 bg-warning/10 text-warning";
  if (value === "CLOSE") return "border-primary/40 bg-primary/10 text-primary";
  return "border-base-300 bg-base-100 text-base-content/70";
};

export const toRuntimeCloseReasonPillClass = (value: RuntimeCloseReasonValue) => {
  if (value === "TP" || value === "TTP") return "border-success/40 bg-success/10 text-success";
  if (value === "SL" || value === "TSL" || value === "LIQUIDATION" || value === "ACCOUNT_FLOOR") {
    return "border-error/40 bg-error/10 text-error";
  }
  if (value === "SIGNAL_EXIT" || value === "EXTERNAL_SYNC_MISSING") {
    return "border-info/40 bg-info/10 text-info";
  }
  if (value === "MANUAL") return "border-secondary/40 bg-secondary/10 text-secondary";
  return "border-warning/40 bg-warning/10 text-warning";
};

export const toRuntimeCloseInitiatorPillClass = (value: RuntimeCloseInitiatorValue) => {
  if (value === "USER_APP") return "border-secondary/40 bg-secondary/10 text-secondary";
  if (value === "BOT_APP") return "border-primary/40 bg-primary/10 text-primary";
  if (value === "USER_EXCHANGE") return "border-info/40 bg-info/10 text-info";
  if (value === "EXCHANGE") return "border-error/40 bg-error/10 text-error";
  return "border-warning/40 bg-warning/10 text-warning";
};

export const formatRuntimeTradeFeeMeta = (trade: RuntimeTradeFeeMetaInput) => {
  const currencySuffix = trade.feeCurrency ? ` ${trade.feeCurrency}` : "";
  if (trade.feePending) return `PENDING${currencySuffix}`;
  const sourceLabel = trade.feeSource === "EXCHANGE_FILL" ? "EXCHANGE" : "EST.";
  return `${sourceLabel}${currencySuffix}`;
};

export const resolveRuntimePositionProvenanceKind = (input: {
  origin?: string | null;
  syncState?: string | null;
  takeoverStatus?: string | null;
}): RuntimePositionProvenanceKind | null => {
  if (input.syncState === "DRIFT") return "sync_drift";
  if (input.syncState === "ORPHAN_LOCAL") return "sync_orphan_local";
  if (input.syncState === "ORPHAN_EXCHANGE") return "sync_orphan_exchange";
  if (input.origin !== "EXCHANGE_SYNC") return null;
  if (input.takeoverStatus === "OWNED_AND_MANAGED") return "exchange_adopted";
  if (input.takeoverStatus === "UNOWNED") return "exchange_unowned";
  if (input.takeoverStatus === "AMBIGUOUS") return "exchange_ambiguous";
  if (input.takeoverStatus === "MANUAL_ONLY") return "exchange_manual_only";
  return "exchange_synced";
};

export const runtimePositionProvenanceLabelSuffix = (
  kind: RuntimePositionProvenanceKind
): RuntimePositionProvenanceLabelSuffix => {
  if (kind === "exchange_adopted") return "provenanceExchangeAdopted";
  if (kind === "exchange_unowned") return "provenanceExchangeUnowned";
  if (kind === "exchange_ambiguous") return "provenanceExchangeAmbiguous";
  if (kind === "exchange_manual_only") return "provenanceExchangeManualOnly";
  if (kind === "sync_drift") return "provenanceSyncDrift";
  if (kind === "sync_orphan_local") return "provenanceSyncOrphanLocal";
  if (kind === "sync_orphan_exchange") return "provenanceSyncOrphanExchange";
  return "provenanceExchangeSynced";
};

export const runtimeContinuityLabelSuffix = (
  continuityState?: string | null
): RuntimeContinuityLabelSuffix => {
  if (continuityState === "RECOVERING") return "continuityRecovering";
  if (continuityState === "RECOVERED_UNACTIONABLE") return "continuityRecoveredUnactionable";
  if (continuityState === "EXTERNAL_CLOSE_CONFIRMED") return "continuityExternalCloseConfirmed";
  if (continuityState === "REPAIR_ONLY_CLEANUP") return "continuityRepairOnlyCleanup";
  return "continuityConfirmed";
};

export const runtimeOrderSourceLabelSuffix = (
  origin?: string | null
): RuntimeOrderSourceLabelSuffix => {
  if (origin === "USER" || origin === "MANUAL") return "sourceManual";
  if (origin === "BOT") return "sourceBot";
  return "sourceImported";
};

export const runtimeOpenOrderStatusLabelSuffix = (
  status?: string | null
): RuntimeOpenOrderStatusLabelSuffix | null => {
  const normalized = status?.trim().toUpperCase();
  if (normalized === "PENDING" || normalized === "OPEN") return "openOrderStatusWaitingFill";
  if (normalized === "PARTIALLY_FILLED") return "openOrderStatusPartiallyFilled";
  if (normalized === "FILLED") return "openOrderStatusFilled";
  return null;
};
