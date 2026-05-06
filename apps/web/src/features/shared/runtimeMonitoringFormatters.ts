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
