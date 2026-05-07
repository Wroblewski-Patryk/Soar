import type { ReactNode } from "react";

import type { TranslationKey } from "../../../../i18n/translations";
import {
  isRuntimeCloseReasonValue,
  runtimeCloseReasonLabelSuffix,
  toRuntimeCloseInitiatorPillClass,
  toRuntimeCloseReasonPillClass,
  type RuntimeCloseInitiatorValue,
  type RuntimeCloseReasonValue,
} from "../../../shared/runtimeMonitoringFormatters";

type Translate = (key: TranslationKey) => string;

const closeReasonLabelKey = (value: RuntimeCloseReasonValue): TranslationKey => {
  return `dashboard.bots.monitoring.${runtimeCloseReasonLabelSuffix(value)}` as TranslationKey;
};

const closeInitiatorLabelKey = (value: RuntimeCloseInitiatorValue): TranslationKey => {
  if (value === "BOT_APP") return "dashboard.bots.monitoring.closeByBotApp";
  if (value === "USER_APP") return "dashboard.bots.monitoring.closeByUserApp";
  if (value === "USER_EXCHANGE") return "dashboard.bots.monitoring.closeByUserExchange";
  if (value === "EXCHANGE") return "dashboard.bots.monitoring.closeByExchange";
  return "dashboard.bots.monitoring.closeBySystemRepair";
};

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
  if (!isRuntimeCloseReasonValue(value)) return "-";
  return renderPill(t(closeReasonLabelKey(value)), toRuntimeCloseReasonPillClass(value));
};

export const renderMonitoringCloseInitiator = (value: unknown, t: Translate) => {
  if (!isCloseInitiatorValue(value)) return "-";
  return renderPill(t(closeInitiatorLabelKey(value)), toRuntimeCloseInitiatorPillClass(value));
};
