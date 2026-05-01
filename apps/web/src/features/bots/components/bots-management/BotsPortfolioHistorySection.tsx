'use client';

import { TranslationKey } from "../../../../i18n/translations";
import { EmptyState } from "../../../../ui/components/ViewState";
import { BotPortfolioHistoryResponse } from "../../types/bot.type";

type BotsPortfolioHistorySectionProps = {
  t: (key: TranslationKey) => string;
  history: BotPortfolioHistoryResponse;
  formatDateTime: (value?: string | null) => string;
  formatNumber: (value: number, digits?: number) => string;
  formatCurrency: (value: number) => string;
  interpolateTemplate: (template: string, values: Record<string, string | number>) => string;
};

const buildHistoryLinePoints = (points: BotPortfolioHistoryResponse["points"]) => {
  const validPoints = points.filter((point) => typeof point.balance === "number" && Number.isFinite(point.balance));
  if (validPoints.length === 0) return "";
  const width = 640;
  const height = 160;
  const values = validPoints.map((point) => point.balance as number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return validPoints
    .map((point, index) => {
      const x = (index / Math.max(validPoints.length - 1, 1)) * width;
      const y = height - (((point.balance as number) - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
};

export function BotsPortfolioHistorySection({
  t,
  history,
  formatDateTime,
  formatNumber,
  formatCurrency,
  interpolateTemplate,
}: BotsPortfolioHistorySectionProps) {
  const historyLine = buildHistoryLinePoints(history.points);

  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{t("dashboard.bots.monitoring.sections.portfolioHistoryTitle")}</h3>
          <p className="text-xs opacity-65">{t("dashboard.bots.monitoring.sections.portfolioHistoryDescription")}</p>
        </div>
        <span className="text-xs opacity-60">
          {formatDateTime(history.window.startedAt)} - {formatDateTime(history.window.finishedAt)}
        </span>
      </div>
      {history.completeness === "UNAVAILABLE" ? (
        <EmptyState
          title={t("dashboard.bots.monitoring.portfolioHistoryUnavailableTitle")}
          description={t("dashboard.bots.monitoring.portfolioHistoryUnavailableDescription")}
        />
      ) : (
        <div className="space-y-3">
          {history.completeness === "PARTIAL" ? (
            <div className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs">
              {t("dashboard.bots.monitoring.portfolioHistoryPartial")}
            </div>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-md border border-base-300 bg-base-200 px-3 py-2 text-sm">
              <span className="block text-xs opacity-65">{t("dashboard.bots.monitoring.portfolioHistoryStartLabel")}</span>
              <span className="font-semibold">
                {history.summary.startBalance != null ? formatCurrency(history.summary.startBalance) : "-"}
              </span>
            </div>
            <div className="rounded-md border border-base-300 bg-base-200 px-3 py-2 text-sm">
              <span className="block text-xs opacity-65">{t("dashboard.bots.monitoring.portfolioHistoryCurrentLabel")}</span>
              <span className="font-semibold">
                {history.summary.currentBalance != null ? formatCurrency(history.summary.currentBalance) : "-"}
              </span>
            </div>
            <div className="rounded-md border border-base-300 bg-base-200 px-3 py-2 text-sm">
              <span className="block text-xs opacity-65">{t("dashboard.bots.monitoring.realizedPnlLabel")}</span>
              <span className={`font-semibold ${history.summary.realizedPnl >= 0 ? "text-success" : "text-error"}`}>
                {formatCurrency(history.summary.realizedPnl)}
              </span>
            </div>
            <div className="rounded-md border border-base-300 bg-base-200 px-3 py-2 text-sm">
              <span className="block text-xs opacity-65">{t("dashboard.bots.monitoring.openPnlLabel")}</span>
              <span className={`font-semibold ${history.summary.unrealizedPnl >= 0 ? "text-success" : "text-error"}`}>
                {formatCurrency(history.summary.unrealizedPnl)}
              </span>
            </div>
          </div>
          {historyLine ? (
            <div className="rounded-md border border-base-300 bg-base-200/40 p-3">
              <svg
                role="img"
                aria-label={t("dashboard.bots.monitoring.sections.portfolioHistoryTitle")}
                className="h-40 w-full text-primary"
                viewBox="0 0 640 160"
                preserveAspectRatio="none"
              >
                <polyline fill="none" stroke="currentColor" strokeWidth="3" points={historyLine} />
              </svg>
            </div>
          ) : null}
          <div className="grid gap-2 md:grid-cols-3">
            {history.points.slice(-3).map((point) => (
              <div key={`${point.type}-${point.timestamp}`} className="rounded-md border border-base-300 bg-base-200 px-3 py-2 text-xs">
                <span className="block opacity-65">{formatDateTime(point.timestamp)}</span>
                <span className="block font-semibold">
                  {point.balance != null ? formatCurrency(point.balance) : "-"}
                </span>
                <span className="block opacity-70">
                  {point.label}
                  {point.symbol ? ` · ${point.symbol}` : ""}
                </span>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold">{t("dashboard.bots.monitoring.portfolioHistoryMarkersTitle")}</h4>
              <span className="text-xs opacity-60">
                {interpolateTemplate(t("dashboard.bots.monitoring.recordsCount"), {
                  count: history.markers.length,
                  total: history.markers.length,
                })}
              </span>
            </div>
            {history.markers.length === 0 ? (
              <p className="text-xs opacity-70">{t("dashboard.bots.monitoring.portfolioHistoryNoMarkers")}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-xs table-zebra">
                  <thead>
                    <tr>
                      <th>{t("dashboard.bots.monitoring.table.time")}</th>
                      <th>{t("dashboard.bots.monitoring.table.action")}</th>
                      <th>{t("dashboard.bots.monitoring.table.price")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.markers.map((marker) => (
                      <tr key={marker.id}>
                        <td>{formatDateTime(marker.timestamp)}</td>
                        <td>{marker.label}</td>
                        <td>
                          {marker.amount != null
                            ? `${marker.direction === "OUT" ? "-" : marker.direction === "IN" ? "+" : ""}${formatNumber(marker.amount, 4)} ${marker.currency ?? ""}`.trim()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
