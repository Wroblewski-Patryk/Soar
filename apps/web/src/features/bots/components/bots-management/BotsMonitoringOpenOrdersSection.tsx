import { TranslationKey } from "@/i18n/translations";
import { BotRuntimeOpenOrderItem } from "../../types/bot.type";
import {
  runtimeOpenOrderStatusLabelSuffix,
  runtimeOrderSourceLabelSuffix,
} from "../../../shared/runtimeMonitoringFormatters";

export type MonitorOpenOrder = {
  id: string;
  origin?: BotRuntimeOpenOrderItem["origin"];
  exchangeOrderId?: string | null;
  symbol: string;
  side: string;
  type: string;
  status: string;
  quantity: number;
  filledQuantity: number;
  price?: number | null;
  stopPrice?: number | null;
  submittedAt?: string | null;
  createdAt?: string | null;
};

type Props = {
  t: (key: TranslationKey) => string;
  orders: MonitorOpenOrder[];
  totalCount: number;
  formatNumber: (value: number, digits?: number) => string;
  formatDateTime: (value?: string | null) => string;
  interpolateTemplate: (template: string, values: Record<string, string | number>) => string;
};

export function BotsMonitoringOpenOrdersSection({
  t,
  orders,
  totalCount,
  formatNumber,
  formatDateTime,
  interpolateTemplate,
}: Props) {
  const sourceLabel = (origin?: string | null) =>
    t(`dashboard.bots.monitoring.${runtimeOrderSourceLabelSuffix(origin)}` as TranslationKey);
  const statusLabel = (status?: string | null) => {
    const suffix = runtimeOpenOrderStatusLabelSuffix(status);
    return suffix ? t(`dashboard.bots.monitoring.${suffix}` as TranslationKey) : (status ?? "-");
  };

  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t("dashboard.bots.monitoring.sections.nowOpenOrdersTitle")}</h3>
        <span className="text-xs opacity-60">
          {interpolateTemplate(t("dashboard.bots.monitoring.activeCount"), {
            count: orders.length,
            total: totalCount,
          })}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-xs table-zebra">
          <thead>
            <tr>
              <th>{t("dashboard.bots.monitoring.table.symbol")}</th>
              <th>{t("dashboard.bots.monitoring.table.origin")}</th>
              <th>{t("dashboard.bots.monitoring.table.exchangeOrderId")}</th>
              <th>{t("dashboard.bots.monitoring.table.side")}</th>
              <th>{t("dashboard.bots.monitoring.table.type")}</th>
              <th>{t("dashboard.bots.monitoring.table.status")}</th>
              <th>{t("dashboard.bots.monitoring.table.qty")}</th>
              <th>{t("dashboard.bots.monitoring.table.filled")}</th>
              <th>{t("dashboard.bots.monitoring.table.price")}</th>
              <th>{t("dashboard.bots.monitoring.table.stop")}</th>
              <th>{t("dashboard.bots.monitoring.table.submitted")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="font-medium">{order.symbol}</td>
                <td>{sourceLabel(order.origin)}</td>
                <td>{order.exchangeOrderId ?? "-"}</td>
                <td>{order.side}</td>
                <td>{order.type}</td>
                <td>{statusLabel(order.status)}</td>
                <td>{formatNumber(order.quantity, 6)}</td>
                <td>{formatNumber(order.filledQuantity, 6)}</td>
                <td>{order.price != null ? formatNumber(order.price, 4) : "-"}</td>
                <td>{order.stopPrice != null ? formatNumber(order.stopPrice, 4) : "-"}</td>
                <td>{formatDateTime(order.submittedAt ?? order.createdAt)}</td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center text-xs opacity-70">
                  {t("dashboard.bots.monitoring.emptyOpenOrders")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
