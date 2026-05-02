'use client';

import { TranslationKey } from "../../../../i18n/translations";
import {
  resolveContextSourceLabel,
  resolveRuntimeStateBadgeClass,
  resolveRuntimeStateLabel,
} from "./monitoringRuntimeLabels";

type MonitoringFutureSignalsSectionProps = {
  t: (key: TranslationKey) => string;
  monitorSignalRows: Array<{
    id: string;
    symbol: string;
    lastSignalDirection?: "LONG" | "SHORT" | "EXIT" | null;
    lastSignalDecisionAt?: string | null;
    lastSignalAt?: string | null;
    lastSignalMessage?: string | null;
    lastSignalReason?: string | null;
    configuredStrategyName?: string | null;
    lastSignalConditionLines?: Array<{
      scope: "LONG" | "SHORT";
      left: string;
      value: string;
      operator: string;
      right: string;
      matched?: boolean | null;
    }> | null;
    totalSignals: number;
    longEntries: number;
    shortEntries: number;
    exits: number;
    dcaCount: number;
    closedTrades: number;
    winningTrades: number;
    losingTrades: number;
    openPositionQty: number;
    realizedPnl: number;
    unrealizedPnl?: number | null;
    feesPaid: number;
    lastTradeAt?: string | null;
    lastSignalContextSource?:
      | "latest_signal"
      | "latest_decision"
      | "configured_fallback"
      | "unresolved"
      | null;
    runtimeMarketState?:
      | "POSITION_OPEN"
      | "SIGNAL_ACTIVE"
      | "EVALUATED_NO_TRADE"
      | "CONFIGURED_ONLY"
      | "UNRESOLVED"
      | null;
  }>;
  monitorSessionDetail: {
    symbolsTracked: number;
  } | null;
  formatDateTime: (value?: string | null) => string;
  formatNumber: (value: number, digits?: number) => string;
  formatCurrency: (value: number) => string;
  interpolateTemplate: (template: string, values: Record<string, string | number>) => string;
};

export function MonitoringFutureSignalsSection(props: MonitoringFutureSignalsSectionProps) {
  const {
    t,
    monitorSignalRows,
    monitorSessionDetail,
    formatDateTime,
    formatNumber,
    formatCurrency,
    interpolateTemplate,
  } = props;
  const formatConditionLine = (line: {
    left: string;
    value: string;
    operator: string;
    right: string;
    matched?: boolean | null;
  }) => {
    if (line.value.trim().toLowerCase() === "n/a") {
      return `${line.left} | ${t("dashboard.home.runtime.conditionValueUnavailable")} (${line.operator} ${line.right})`;
    }
    const status =
      typeof line.matched === "boolean" ? ` ${line.matched ? "PASS" : "MISS"}` : "";
    return `${line.left} | ${line.value} ${line.operator} ${line.right}${status}`;
  };

  return (
    <div id="monitor-future" className="scroll-mt-24 rounded-lg border border-base-300 bg-base-100 p-3">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{t("dashboard.bots.monitoring.sections.futureSignalsTitle")}</h3>
          <p className="text-xs opacity-65">
            {t("dashboard.bots.monitoring.sections.futureSignalsDescription")}
          </p>
        </div>
        <div className="text-right text-xs opacity-60">
          <div>
            {interpolateTemplate(t("dashboard.bots.monitoring.symbolCount"), {
              count: monitorSignalRows.length,
              total: monitorSessionDetail?.symbolsTracked ?? 0,
            })}
          </div>
          <div className="opacity-50">{t("dashboard.bots.monitoring.sortLatestSignal")}</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-xs table-zebra">
          <thead>
            <tr>
              <th>{t("dashboard.bots.monitoring.table.symbol")}</th>
              <th>{t("dashboard.bots.monitoring.table.runtimeState")}</th>
              <th>{t("dashboard.bots.monitoring.contextSourceLabel")}</th>
              <th>{t("dashboard.bots.monitoring.strategyContextLabel")}</th>
              <th>{t("dashboard.bots.monitoring.table.signal")}</th>
              <th>{t("dashboard.bots.monitoring.table.decisionDetail")}</th>
              <th>{t("dashboard.bots.monitoring.table.conditions")}</th>
              <th>{t("dashboard.bots.monitoring.table.signalTime")}</th>
              <th>{t("dashboard.bots.monitoring.table.signals")}</th>
              <th>{t("dashboard.bots.monitoring.table.lse")}</th>
              <th>{t("dashboard.bots.monitoring.table.dca")}</th>
              <th>{t("dashboard.bots.monitoring.table.closed")}</th>
              <th>{t("dashboard.bots.monitoring.table.wl")}</th>
              <th>{t("dashboard.bots.monitoring.table.openQty")}</th>
              <th>{t("dashboard.bots.monitoring.table.realizedPnl")}</th>
              <th>{t("dashboard.bots.monitoring.table.openPnl")}</th>
              <th>{t("dashboard.bots.monitoring.table.fees")}</th>
              <th>{t("dashboard.bots.monitoring.table.lastTrade")}</th>
            </tr>
          </thead>
          <tbody>
            {monitorSignalRows.map((item) => {
              const configuredStrategyName =
                item.lastSignalContextSource === "latest_signal"
                  ? null
                  : item.configuredStrategyName ?? null;
              const runtimeDetail =
                item.lastSignalMessage?.trim() ||
                item.lastSignalReason?.trim() ||
                (item.lastSignalContextSource === "configured_fallback"
                  ? t("dashboard.bots.monitoring.runtimeDecisionPendingLabel")
                  : null);
              const conditionLines = item.lastSignalConditionLines ?? [];
              const longLines = conditionLines.filter((line) => line.scope === "LONG");
              const shortLines = conditionLines.filter((line) => line.scope === "SHORT");
              const isConfiguredSnapshot =
                item.runtimeMarketState === "CONFIGURED_ONLY" ||
                item.lastSignalContextSource === "configured_fallback";

              return (
                <tr key={item.id} className={isConfiguredSnapshot ? "opacity-75" : undefined}>
                  <td className="font-medium">{item.symbol}</td>
                  <td>
                    <span className={`badge badge-xs ${resolveRuntimeStateBadgeClass(item.runtimeMarketState)}`}>
                      {resolveRuntimeStateLabel(t, item.runtimeMarketState)}
                    </span>
                  </td>
                  <td className="text-[11px] opacity-70">
                    {resolveContextSourceLabel(t, item.lastSignalContextSource)}
                  </td>
                  <td className="text-[11px] opacity-80">{configuredStrategyName ?? "-"}</td>
                  <td>
                    <span
                      className={`badge badge-xs ${
                        item.lastSignalDirection === "LONG"
                          ? "badge-success"
                          : item.lastSignalDirection === "SHORT"
                            ? "badge-error"
                            : item.lastSignalDirection === "EXIT"
                              ? "badge-warning"
                              : "badge-ghost"
                      }`}
                    >
                      {item.lastSignalDirection ?? t("dashboard.bots.monitoring.neutral")}
                    </span>
                  </td>
                  <td className="max-w-52 text-[11px] opacity-80">{runtimeDetail ?? "-"}</td>
                  <td className="min-w-52 text-[10px] leading-4">
                    {conditionLines.length === 0 ? (
                      <span className="opacity-55">-</span>
                    ) : (
                      <div className="space-y-1.5">
                        {longLines.length > 0 ? (
                          <div>
                            <span className="mr-1 font-semibold text-success">LONG</span>
                            <span className="opacity-80">
                              {longLines
                                .map(formatConditionLine)
                                .join(" ; ")}
                            </span>
                          </div>
                        ) : null}
                        {shortLines.length > 0 ? (
                          <div>
                            <span className="mr-1 font-semibold text-error">SHORT</span>
                            <span className="opacity-80">
                              {shortLines
                                .map(formatConditionLine)
                                .join(" ; ")}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </td>
                  <td>{formatDateTime(item.lastSignalDecisionAt ?? item.lastSignalAt)}</td>
                  <td>{item.totalSignals}</td>
                  <td>
                    {item.longEntries}/{item.shortEntries}/{item.exits}
                  </td>
                  <td>{item.dcaCount}</td>
                  <td>{item.closedTrades}</td>
                  <td>
                    {item.winningTrades}/{item.losingTrades}
                  </td>
                  <td>{formatNumber(item.openPositionQty, 6)}</td>
                  <td className={item.realizedPnl >= 0 ? "text-success" : "text-error"}>
                    {formatCurrency(item.realizedPnl)}
                  </td>
                  <td className={(item.unrealizedPnl ?? 0) >= 0 ? "text-success" : "text-error"}>
                    {formatCurrency(item.unrealizedPnl ?? 0)}
                  </td>
                  <td>{formatCurrency(item.feesPaid)}</td>
                  <td>{formatDateTime(item.lastTradeAt)}</td>
                </tr>
              );
            })}
            {monitorSignalRows.length === 0 ? (
              <tr>
                <td colSpan={18} className="text-center text-xs opacity-70">
                  {t("dashboard.bots.monitoring.emptySignalData")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
