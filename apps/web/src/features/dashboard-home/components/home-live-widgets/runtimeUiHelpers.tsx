import type { TranslationKey } from "@/i18n/translations";

import type { OpenPositionWithLive } from "./types";
import { toRuntimeDirectionPillClass, toRuntimeTradeLifecyclePillClass } from "../../../shared/runtimeMonitoringFormatters";

export type DirectionPillValue = "LONG" | "SHORT" | "BUY" | "SELL";
export type TradeActionValue = "OPEN" | "DCA" | "CLOSE" | "UNKNOWN";
export type TradeActionReasonValue =
  | "SIGNAL_ENTRY"
  | "DCA_LEVEL"
  | "TAKE_PROFIT"
  | "STOP_LOSS"
  | "TRAILING_TAKE_PROFIT"
  | "TRAILING_STOP"
  | "SIGNAL_EXIT"
  | "MANUAL"
  | "UNKNOWN";

export type PositionEditDraft = {
  position: OpenPositionWithLive;
  takeProfit: string;
  stopLoss: string;
  notes: string;
  lockRules: boolean;
};

const directionPillClass = (value: DirectionPillValue) => toRuntimeDirectionPillClass(value);

const DirectionPillIcon = ({ value }: { value: DirectionPillValue }) => {
  if (value === "LONG" || value === "BUY") {
    return (
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
    );
  }

  return (
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
};

export const DirectionPill = ({ value }: { value: DirectionPillValue }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${directionPillClass(value)}`}>
    <DirectionPillIcon value={value} />
    <span className="font-medium">{value}</span>
  </span>
);

export const parseOptionalPositivePriceInput = (value: string): number | null | "invalid" => {
  const normalized = value.trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return "invalid";
  return parsed;
};

export const parsePositiveQuantityInput = (value: string): number | "invalid" => {
  const normalized = value.trim();
  const parsed = Number(normalized);
  if (!normalized || !Number.isFinite(parsed) || parsed <= 0) return "invalid";
  return parsed;
};

export const formatQuantityForInput = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return "";
  return Number(value.toFixed(8)).toString();
};

const tradeActionPillClass = (value: TradeActionValue) => toRuntimeTradeLifecyclePillClass(value);

export const tradeActionLabelKey = (value: TradeActionValue): TranslationKey => {
  if (value === "OPEN") return "dashboard.home.runtime.actionOpen";
  if (value === "DCA") return "dashboard.home.runtime.actionDca";
  if (value === "CLOSE") return "dashboard.home.runtime.actionClose";
  return "dashboard.home.runtime.actionUnknown";
};

export const TradeActionPill = ({
  value,
  t,
}: {
  value: TradeActionValue;
  t: (key: TranslationKey) => string;
}) => (
  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${tradeActionPillClass(value)}`}>
    {t(tradeActionLabelKey(value))}
  </span>
);

export const tradeReasonPillClass = (value: TradeActionReasonValue) => {
  if (value === "TAKE_PROFIT" || value === "TRAILING_TAKE_PROFIT") return "border-success/40 bg-success/10 text-success";
  if (value === "STOP_LOSS" || value === "TRAILING_STOP") return "border-error/40 bg-error/10 text-error";
  if (value === "SIGNAL_ENTRY" || value === "SIGNAL_EXIT") return "border-info/40 bg-info/10 text-info";
  if (value === "DCA_LEVEL") return "border-warning/40 bg-warning/10 text-warning";
  if (value === "MANUAL") return "border-secondary/40 bg-secondary/10 text-secondary";
  return "border-base-300 bg-base-100 text-base-content/70";
};

export const tradeReasonLabelKey = (value: TradeActionReasonValue): TranslationKey => {
  if (value === "SIGNAL_ENTRY") return "dashboard.home.runtime.reasonSignalEntry";
  if (value === "DCA_LEVEL") return "dashboard.home.runtime.reasonDcaLevel";
  if (value === "TAKE_PROFIT") return "dashboard.home.runtime.reasonTakeProfit";
  if (value === "STOP_LOSS") return "dashboard.home.runtime.reasonStopLoss";
  if (value === "TRAILING_TAKE_PROFIT") return "dashboard.home.runtime.reasonTrailingTakeProfit";
  if (value === "TRAILING_STOP") return "dashboard.home.runtime.reasonTrailingStop";
  if (value === "SIGNAL_EXIT") return "dashboard.home.runtime.reasonSignalExit";
  if (value === "MANUAL") return "dashboard.home.runtime.reasonManual";
  return "dashboard.home.runtime.reasonUnknown";
};
