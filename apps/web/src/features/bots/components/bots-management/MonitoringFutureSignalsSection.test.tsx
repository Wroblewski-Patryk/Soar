import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MonitoringFutureSignalsSection } from "./MonitoringFutureSignalsSection";
import type { TranslationKey } from "../../../../i18n/translations";

const t = (key: TranslationKey) =>
  ({
    "dashboard.bots.monitoring.sections.futureSignalsTitle": "Future signals",
    "dashboard.bots.monitoring.sections.futureSignalsDescription": "Signals",
    "dashboard.bots.monitoring.symbolCount": "{count} / {total} symbols",
    "dashboard.bots.monitoring.sortLatestSignal": "Sort: latest signal",
    "dashboard.bots.monitoring.table.symbol": "Symbol",
    "dashboard.bots.monitoring.table.runtimeState": "Runtime state",
    "dashboard.bots.monitoring.contextSourceLabel": "Context source",
    "dashboard.bots.monitoring.strategyContextLabel": "Strategy",
    "dashboard.bots.monitoring.table.signal": "Signal",
    "dashboard.bots.monitoring.table.decisionDetail": "Decision detail",
    "dashboard.bots.monitoring.table.conditions": "Conditions",
    "dashboard.bots.monitoring.table.signalTime": "Signal time",
    "dashboard.bots.monitoring.table.signals": "Signals",
    "dashboard.bots.monitoring.table.lse": "L/S/E",
    "dashboard.bots.monitoring.table.dca": "DCA",
    "dashboard.bots.monitoring.table.closed": "Closed",
    "dashboard.bots.monitoring.table.wl": "W/L",
    "dashboard.bots.monitoring.table.openQty": "Open qty",
    "dashboard.bots.monitoring.table.realizedPnl": "Realized PnL",
    "dashboard.bots.monitoring.table.openPnl": "Open PnL",
    "dashboard.bots.monitoring.table.fees": "Fees",
    "dashboard.bots.monitoring.table.lastTrade": "Last trade",
    "dashboard.bots.monitoring.neutral": "NEUTRAL",
    "dashboard.bots.monitoring.marketStatePositionOpen": "Position open",
    "dashboard.bots.monitoring.marketStateUnresolved": "Unresolved state",
    "dashboard.bots.monitoring.contextSourceLatestDecision": "Latest decision",
    "dashboard.bots.monitoring.contextSourceUnresolved": "Unresolved source",
    "dashboard.home.runtime.conditionValueUnavailable": "Waiting for indicator data",
  })[key] ?? key;

describe("MonitoringFutureSignalsSection", () => {
  it("does not render raw n/a values for unavailable signal conditions", () => {
    render(
      <MonitoringFutureSignalsSection
        t={t}
        monitorSessionDetail={{ symbolsTracked: 1 }}
        formatDateTime={(value) => value ?? "-"}
        formatNumber={(value) => String(value)}
        formatCurrency={(value) => `${value} USDT`}
        interpolateTemplate={(template, values) =>
          template.replace("{count}", String(values.count)).replace("{total}", String(values.total))
        }
        monitorSignalRows={[
          {
            id: "signal-eth",
            symbol: "ETHUSDT",
            lastSignalDirection: null,
            lastSignalDecisionAt: "2026-05-02T19:05:00.000Z",
            lastSignalContextSource: "latest_decision",
            runtimeMarketState: "POSITION_OPEN",
            lastSignalConditionLines: [
              {
                scope: "LONG",
                left: "RSI(14)",
                value: "n/a",
                operator: "<",
                right: "20",
                matched: null,
              },
            ],
            totalSignals: 0,
            longEntries: 0,
            shortEntries: 0,
            exits: 0,
            dcaCount: 0,
            closedTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            openPositionQty: 0,
            realizedPnl: 0,
            unrealizedPnl: 0,
            feesPaid: 0,
            lastTradeAt: null,
          },
        ]}
      />
    );

    expect(screen.getByText(/RSI\(14\) \| Waiting for indicator data \(< 20\)/)).toBeInTheDocument();
    expect(screen.queryByText(/n\/a/i)).not.toBeInTheDocument();
  });

  it("fails closed to unresolved labels for unknown backend runtime signal values", () => {
    render(
      <MonitoringFutureSignalsSection
        t={t}
        monitorSessionDetail={{ symbolsTracked: 1 }}
        formatDateTime={(value) => value ?? "-"}
        formatNumber={(value) => String(value)}
        formatCurrency={(value) => `${value} USDT`}
        interpolateTemplate={(template, values) =>
          template.replace("{count}", String(values.count)).replace("{total}", String(values.total))
        }
        monitorSignalRows={[
          {
            id: "signal-doge",
            symbol: "DOGEUSDT",
            lastSignalDirection: null,
            lastSignalDecisionAt: "2026-05-02T19:05:00.000Z",
            lastSignalContextSource: "future_backend_source",
            runtimeMarketState: "FUTURE_BACKEND_STATE",
            lastSignalConditionLines: [],
            totalSignals: 0,
            longEntries: 0,
            shortEntries: 0,
            exits: 0,
            dcaCount: 0,
            closedTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            openPositionQty: 0,
            realizedPnl: 0,
            unrealizedPnl: 0,
            feesPaid: 0,
            lastTradeAt: null,
          } as unknown as Parameters<typeof MonitoringFutureSignalsSection>[0]["monitorSignalRows"][number],
        ]}
      />
    );

    expect(screen.getByText("Unresolved state")).toBeInTheDocument();
    expect(screen.getByText("Unresolved source")).toBeInTheDocument();
    expect(screen.queryByText("FUTURE_BACKEND_STATE")).not.toBeInTheDocument();
    expect(screen.queryByText("future_backend_source")).not.toBeInTheDocument();
  });
});
