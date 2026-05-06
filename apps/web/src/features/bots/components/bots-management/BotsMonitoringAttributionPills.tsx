import type { ReactNode } from "react";

import type { TranslationKey } from "../../../../i18n/translations";
import {
  toRuntimeCloseInitiatorPillClass,
  toRuntimeCloseReasonPillClass,
  type RuntimeCloseInitiatorValue,
  type RuntimeCloseReasonValue,
} from "../../../shared/runtimeMonitoringFormatters";

type Translate = (key: TranslationKey) => string;

const closeReasonLabelKey = (value: RuntimeCloseReasonValue): TranslationKey => {
  if (value === "TP") return "dashboard.bots.monitoring.closeReasonTp";
  if (value === "TTP") return "dashboard.bots.monitoring.closeReasonTtp";
  if (value === "SL") return "dashboard.bots.monitoring.closeReasonSl";
  if (value === "TSL") return "dashboard.bots.monitoring.closeReasonTsl";
  if (value === "LIQUIDATION") return "dashboard.bots.monitoring.closeReasonLiquidation";
  if (value === "ACCOUNT_FLOOR") return "dashboard.bots.monitoring.closeReasonAccountFloor";
  if (value === "MANUAL") return "dashboard.bots.monitoring.closeReasonManual";
  if (value === "SIGNAL_EXIT") return "dashboard.bots.monitoring.closeReasonSignalExit";
  if (value === "POSITION_LIFETIME") return "dashboard.bots.monitoring.closeReasonPositionLifetime";
  if (value === "EXTERNAL_SYNC_MISSING") return "dashboard.bots.monitoring.closeReasonExternalSyncMissing";
  return "dashboard.bots.monitoring.closeReasonSystemRepair";
};

const closeInitiatorLabelKey = (value: RuntimeCloseInitiatorValue): TranslationKey => {
  if (value === "BOT_APP") return "dashboard.bots.monitoring.closeByBotApp";
  if (value === "USER_APP") return "dashboard.bots.monitoring.closeByUserApp";
  if (value === "USER_EXCHANGE") return "dashboard.bots.monitoring.closeByUserExchange";
  if (value === "EXCHANGE") return "dashboard.bots.monitoring.closeByExchange";
  return "dashboard.bots.monitoring.closeBySystemRepair";
};

const isCloseReasonValue = (value: unknown): value is RuntimeCloseReasonValue =>
  value === "TP" ||
  value === "TTP" ||
  value === "SL" ||
  value === "TSL" ||
  value === "LIQUIDATION" ||
  value === "ACCOUNT_FLOOR" ||
  value === "MANUAL" ||
  value === "SIGNAL_EXIT" ||
  value === "POSITION_LIFETIME" ||
  value === "EXTERNAL_SYNC_MISSING" ||
  value === "SYSTEM_REPAIR";

const isCloseInitiatorValue = (value: unknown): value is RuntimeCloseInitiatorValue =>
  value === "BOT_APP" ||
  value === "USER_APP" ||
  value === "USER_EXCHANGE" ||
  value === "EXCHANGE" ||
  value === "SYSTEM_REPAIR";

const renderPill = (children: ReactNode, className: string) => (
  <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}>
    {children}
  </span>
);

export const renderMonitoringCloseReason = (value: unknown, t: Translate) => {
  if (!isCloseReasonValue(value)) return "-";
  return renderPill(t(closeReasonLabelKey(value)), toRuntimeCloseReasonPillClass(value));
};

export const renderMonitoringCloseInitiator = (value: unknown, t: Translate) => {
  if (!isCloseInitiatorValue(value)) return "-";
  return renderPill(t(closeInitiatorLabelKey(value)), toRuntimeCloseInitiatorPillClass(value));
};
