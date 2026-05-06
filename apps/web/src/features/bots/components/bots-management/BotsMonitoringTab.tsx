'use client';

import { ReactNode } from "react";
import { TranslationKey } from "../../../../i18n/translations";
import { EmptyState } from "../../../../ui/components/ViewState";
import { SkeletonTableRows } from "../../../../ui/components/loading";
import {
  MonitoringAsyncState,
  MonitoringControlsSection,
  MonitoringQuickContextSection,
  MonitoringQuickNavSection,
} from "./BotsMonitoringSections";
import { MonitoringFutureSignalsSection } from "./MonitoringFutureSignalsSection";
import { BotsPortfolioHistorySection } from "./BotsPortfolioHistorySection";
import {
  Bot,
  BotPortfolioHistoryResponse,
  BotRuntimePositionItem,
  BotRuntimeSessionDetail,
  BotRuntimeSessionListItem,
  BotRuntimeSessionStatus,
  BotRuntimeTrade,
} from "../../types/bot.type";
import {
  resolveRuntimeOpenPositionMarkPriceSourceLabelKey,
  type RuntimeOpenPositionMarkPriceSource,
} from "../../utils/runtimeOpenPositionDerivations";
import { renderMonitoringCloseInitiator, renderMonitoringCloseReason } from "./BotsMonitoringAttributionPills";

type MonitorChecklistItem = {
  key: string;
  label: string;
  ok: boolean;
  note: string;
};

type MonitorOpenPositionRow = {
  id: string;
  openedAt?: string | null;
  symbol: string;
  side: string;
  continuityState?: BotRuntimePositionItem["continuityState"];
  actionable?: boolean;
  strategyAutomationContextResolved?: boolean;
  quantity: number;
  entryPrice: number;
  markPrice: number | null;
  liveMarkPriceSource: RuntimeOpenPositionMarkPriceSource;
  entryNotional: number;
  marginUsed: number;
  marginInitPct: number | null;
  feesPaid: number;
  openPnl: number;
  pnlNotionalPct: number;
  pnlMarginPct: number;
  dcaCount: number;
  dcaExecutedLevels?: number[] | null;
  dcaPlannedLevels?: number[] | null;
  ttpProtectedPercent: number | null;
  tslProtectedPercent: number | null;
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

type MonitorOperationalTradeRow = {
  id: string;
  rowNo: number;
  executedAt: string;
  symbol: string;
  side: string;
  lifecycleAction: "OPEN" | "DCA" | "CLOSE" | "UNKNOWN";
  actionReason?: BotRuntimeTrade["actionReason"];
  closeReason?: BotRuntimeTrade["closeReason"];
  closeInitiator?: BotRuntimeTrade["closeInitiator"];
  quantity: number;
  price: number;
  margin: number;
  fee: number;
  feePct: number;
  realizedPnl: number;
  pnlPct: number;
  cumulativePnl: number;
  origin: string;
  orderId: string;
  positionId: string;
  feeSource: "ESTIMATED" | "EXCHANGE_FILL";
  feePending: boolean;
  feeCurrency: string | null;
};

type BotsMonitoringTabProps = {
  t: (key: TranslationKey) => string;
  bots: Bot[];
  monitorQuickSwitchBots: Bot[];
  monitorBotId: string;
  setMonitorBotId: (botId: string) => void;
  monitorRuntimeCapabilityAvailable: boolean;
  selectedMonitorBot: Bot | null;
  refreshMonitoring: () => Promise<void>;
  monitorStatus: "ALL" | BotRuntimeSessionStatus;
  setMonitorStatus: (status: "ALL" | BotRuntimeSessionStatus) => void;
  monitorSymbolFilter: string;
  setMonitorSymbolFilter: (value: string) => void;
  handleApplyMonitoringFilter: () => void;
  handleClearMonitoringFilter: () => void;
  monitorAppliedSymbolFilter: string;
  monitorViewMode: "aggregate" | "session";
  setMonitorViewMode: (mode: "aggregate" | "session") => void;
  selectedMonitorSession: BotRuntimeSessionListItem | null;
  monitorSessions: BotRuntimeSessionListItem[];
  monitorSessionId: string;
  setMonitorSessionId: (sessionId: string) => void;
  monitorLoading: boolean;
  monitorError: string | null;
  monitorSessionDetail: BotRuntimeSessionDetail | null;
  monitorSymbolStats: { items: Array<{ symbol: string }> } | null;
  monitorChecklistItems: MonitorChecklistItem[];
  monitorSessionLoading: boolean;
  monitorPositions: {
    openCount: number;
    openOrdersCount?: number;
    openOrders?: Array<{
      id: string;
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
    }>;
    historyItems: Array<{
      id: string;
      symbol: string;
      side: string;
      closeReason?: BotRuntimePositionItem["closeReason"];
      closeInitiator?: BotRuntimePositionItem["closeInitiator"];
      openedAt?: string | null;
      closedAt?: string | null;
      holdMs: number;
      quantity: number;
      entryPrice: number;
      exitPrice?: number | null;
      dcaCount: number;
      dcaExecutedLevels?: number[] | null;
      dcaPlannedLevels?: number[] | null;
      feesPaid: number;
      realizedPnl: number;
    }>;
    closedCount?: number;
  } | null;
  monitorPortfolioHistory: BotPortfolioHistoryResponse | null;
  monitorOpenMarginSummary: {
    totalNotional: number;
    totalMarginUsed: number;
    totalOpenPnl: number;
    marginInitPct: number | null;
  };
  monitorCapitalKpis: {
    portfolio: number | null;
    free: number | null;
    inPositions: number;
    capitalSource: "PAPER_INITIAL_BALANCE" | "PAPER_RESET_CHECKPOINT" | "LIVE_EXCHANGE_BALANCE" | null;
    paperResetAt: string | null;
  };
  monitorWinRate: number;
  monitorShowOpenOrders: boolean;
  monitorOpenPositionRows: MonitorOpenPositionRow[];
  monitorShowDynamicStopColumns: boolean;
  monitorOperationalTrades: MonitorOperationalTradeRow[];
  monitorTrades: { total: number } | null;
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
  monitorRuntimeStateSummary: {
    POSITION_OPEN: number;
    SIGNAL_ACTIVE: number;
    EVALUATED_NO_TRADE: number;
    CONFIGURED_ONLY: number;
    UNRESOLVED: number;
  };
  monitorHeartbeatLagMs: number | null;
  monitorDataIsStale: boolean;
  monitorDataAgeLabel: string | null;
  monitorLastSignalAt: string | null;
  monitorLastTradeAt: string | null;
  formatDateTime: (value?: string | null) => string;
  formatDuration: (ms: number) => string;
  formatNumber: (value: number, digits?: number) => string;
  formatCurrency: (value: number) => string;
  formatDcaLadderCell: (params: {
    id?: string;
    dcaCount: number;
    dcaExecutedLevels?: number[] | null;
    dcaPlannedLevels?: number[] | null;
  }) => ReactNode;
  interpolateTemplate: (template: string, values: Record<string, string | number>) => string;
  toSessionStatusBadgeClass: (status: BotRuntimeSessionStatus) => string;
  toTradeSideBadgeClass: (side: string) => string;
  toTradeLifecycleBadgeClass: (value: "OPEN" | "DCA" | "CLOSE" | "UNKNOWN") => string;
  toTradeLifecycleLabelKey: (value: "OPEN" | "DCA" | "CLOSE" | "UNKNOWN") => TranslationKey;
  formatTradeFeeMeta: (trade: {
    feeSource: "ESTIMATED" | "EXCHANGE_FILL";
    feePending: boolean;
    feeCurrency: string | null;
  }) => string;
};

export function BotsMonitoringTab(props: BotsMonitoringTabProps) {
  const {
    t,
    bots,
    monitorQuickSwitchBots,
    monitorBotId,
    setMonitorBotId,
    monitorRuntimeCapabilityAvailable,
    selectedMonitorBot,
    refreshMonitoring,
    monitorStatus,
    setMonitorStatus,
    monitorSymbolFilter,
    setMonitorSymbolFilter,
    handleApplyMonitoringFilter,
    handleClearMonitoringFilter,
    monitorAppliedSymbolFilter,
    monitorViewMode,
    setMonitorViewMode,
    selectedMonitorSession,
    monitorSessions,
    monitorSessionId,
    setMonitorSessionId,
    monitorLoading,
    monitorError,
    monitorSessionDetail,
    monitorSymbolStats,
    monitorChecklistItems,
    monitorSessionLoading,
    monitorPositions,
    monitorPortfolioHistory,
    monitorOpenMarginSummary,
    monitorCapitalKpis,
    monitorWinRate,
    monitorShowOpenOrders,
    monitorOpenPositionRows,
    monitorShowDynamicStopColumns,
    monitorOperationalTrades,
    monitorTrades,
    monitorSignalRows,
    monitorRuntimeStateSummary,
    monitorHeartbeatLagMs,
    monitorDataIsStale,
    monitorDataAgeLabel,
    monitorLastSignalAt,
    monitorLastTradeAt,
    formatDateTime,
    formatDuration,
    formatNumber,
    formatCurrency,
    formatDcaLadderCell,
    interpolateTemplate,
    toSessionStatusBadgeClass,
    toTradeSideBadgeClass,
    toTradeLifecycleBadgeClass,
    toTradeLifecycleLabelKey,
    formatTradeFeeMeta,
  } = props;

  const renderRuntimeState = (position: MonitorOpenPositionRow) => {
    const isActionBlocked = position.actionable === false;
    const strategyContextUnresolved = position.strategyAutomationContextResolved === false;

    return (
      <div className="flex flex-col gap-1 leading-tight">
        <span className={`badge badge-sm ${isActionBlocked ? "badge-warning" : "badge-success"}`}>
          {t(runtimeStateLabelKey(position.continuityState))}
        </span>
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
  };

  return (
    <div className="space-y-4 rounded-box border border-base-300/60 bg-base-200/60 p-4">
          <h2 className="text-lg font-semibold">{t("dashboard.bots.monitoring.title")}</h2>
          <p className="text-sm opacity-70">{t("dashboard.bots.monitoring.description")}</p>

          {bots.length === 0 ? (
            <EmptyState
              title={t("dashboard.bots.monitoring.emptyBotsTitle")}
              description={t("dashboard.bots.monitoring.emptyBotsDescription")}
            />
          ) : (
            <>
              <MonitoringQuickContextSection
                t={t}
                bots={bots}
                monitorQuickSwitchBots={monitorQuickSwitchBots}
                monitorBotId={monitorBotId}
                setMonitorBotId={setMonitorBotId}
              />
              <MonitoringControlsSection
                t={t}
                bots={bots}
                selectedMonitorBot={selectedMonitorBot}
                monitorRuntimeCapabilityAvailable={monitorRuntimeCapabilityAvailable}
                monitorStatus={monitorStatus}
                setMonitorStatus={setMonitorStatus}
                monitorSymbolFilter={monitorSymbolFilter}
                setMonitorSymbolFilter={setMonitorSymbolFilter}
                handleApplyMonitoringFilter={handleApplyMonitoringFilter}
                handleClearMonitoringFilter={handleClearMonitoringFilter}
                monitorAppliedSymbolFilter={monitorAppliedSymbolFilter}
                monitorViewMode={monitorViewMode}
                setMonitorViewMode={setMonitorViewMode}
                selectedMonitorSession={selectedMonitorSession}
                monitorSessions={monitorSessions}
                monitorSessionId={monitorSessionId}
                setMonitorSessionId={setMonitorSessionId}
                monitorBotId={monitorBotId}
                setMonitorBotId={setMonitorBotId}
                monitorDataIsStale={monitorDataIsStale}
                monitorDataAgeLabel={monitorDataAgeLabel}
                formatDateTime={formatDateTime}
                interpolateTemplate={interpolateTemplate}
              />
              <MonitoringQuickNavSection t={t} />
              <MonitoringAsyncState
                t={t}
                monitorLoading={monitorLoading}
                monitorError={monitorError}
                monitorSessionsCount={monitorSessions.length}
                monitorBotId={monitorBotId}
                refreshMonitoring={refreshMonitoring}
              />

              {!monitorLoading && !monitorError && monitorSessionDetail ? (
                <div className="space-y-3">
                  <div className="rounded-lg border border-base-300 bg-base-100 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`badge ${toSessionStatusBadgeClass(monitorSessionDetail.status)}`}>
                        {monitorSessionDetail.status}
                      </span>
                      <span className="badge badge-outline">
                        {interpolateTemplate(t("dashboard.bots.monitoring.sessionModeBadge"), {
                          mode: monitorSessionDetail.mode,
                        })}
                      </span>
                      {monitorViewMode === "aggregate" ? (
                        <span className="text-xs opacity-70">
                          {interpolateTemplate(t("dashboard.bots.monitoring.sessionsBadge"), {
                            count: monitorSessions.length,
                          })}
                        </span>
                      ) : (
                        <span className="text-xs opacity-70">
                          {interpolateTemplate(t("dashboard.bots.monitoring.sessionIdBadge"), {
                            id: (selectedMonitorSession?.id ?? monitorSessionDetail.id).slice(0, 8),
                          })}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
                      <p>
                        <span className="opacity-60">{t("dashboard.bots.monitoring.startLabel")}</span>{" "}
                        {formatDateTime(monitorSessionDetail.startedAt)}
                      </p>
                      <p>
                        <span className="opacity-60">{t("dashboard.bots.monitoring.endLabel")}</span>{" "}
                        {formatDateTime(monitorSessionDetail.finishedAt)}
                      </p>
                      <p>
                        <span className="opacity-60">{t("dashboard.bots.monitoring.heartbeatLabel")}</span>{" "}
                        {formatDateTime(monitorSessionDetail.lastHeartbeatAt)}
                      </p>
                      <p>
                        <span className="opacity-60">{t("dashboard.bots.monitoring.durationLabel")}</span>{" "}
                        {formatDuration(monitorSessionDetail.durationMs)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-base-300 bg-base-100 p-3">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold">{t("dashboard.bots.monitoring.checklist.title")}</h3>
                      <span className="text-xs opacity-60">
                        {interpolateTemplate(t("dashboard.bots.monitoring.checklist.summary"), {
                          ok: monitorChecklistItems.filter((item) => item.ok).length,
                          total: monitorChecklistItems.length,
                        })}
                      </span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                      {monitorChecklistItems.map((item) => (
                        <div key={item.key} className="rounded-md border border-base-300 bg-base-200 px-2 py-2 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium">{item.label}</span>
                            <span className={`badge badge-xs ${item.ok ? "badge-success" : "badge-warning"}`}>
                              {item.ok
                                ? t("dashboard.bots.monitoring.checklist.ok")
                                : t("dashboard.bots.monitoring.checklist.check")}
                            </span>
                          </div>
                          <p className="mt-1 opacity-65">{item.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {monitorSessionLoading ? (
                    <SkeletonTableRows
                      columns={8}
                      rows={4}
                      title={false}
                      toolbar={false}
                      className="border-base-300/40 bg-base-100/60 p-3"
                    />
                  ) : null}

                  {monitorSessionDetail ? (
                    <div className="grid gap-3 lg:grid-cols-3">
                      <div className="rounded-lg border border-base-300 bg-base-100 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-65">{t("dashboard.bots.monitoring.nowTitle")}</p>
                        <div className="mt-2 space-y-1 text-sm">
                          <p>
                            <span className="opacity-60">{t("dashboard.bots.monitoring.portfolioLabel")}</span>{" "}
                            <span className="font-semibold">
                              {monitorCapitalKpis.portfolio != null
                                ? formatCurrency(monitorCapitalKpis.portfolio)
                                : "-"}
                            </span>
                          </p>
                          <p>
                            <span className="opacity-60">{t("dashboard.bots.monitoring.freeFundsLabel")}</span>{" "}
                            <span className="font-semibold">
                              {monitorCapitalKpis.free != null ? formatCurrency(monitorCapitalKpis.free) : "-"}
                            </span>
                          </p>
                          <p>
                            <span className="opacity-60">{t("dashboard.bots.monitoring.openPositionsLabel")}</span>{" "}
                            <span className="font-semibold">{monitorPositions?.openCount ?? 0}</span>
                          </p>
                          <p>
                            <span className="opacity-60">{t("dashboard.bots.monitoring.openOrdersLabel")}</span>{" "}
                            <span className="font-semibold">
                              {monitorPositions?.openOrdersCount ?? monitorPositions?.openOrders?.length ?? 0}
                            </span>
                          </p>
                          <p>
                            <span className="opacity-60">{t("dashboard.bots.monitoring.openPnlLabel")}</span>{" "}
                            <span
                              className={`font-semibold ${
                                monitorOpenMarginSummary.totalOpenPnl >= 0 ? "text-success" : "text-error"
                              }`}
                            >
                              {formatCurrency(monitorOpenMarginSummary.totalOpenPnl)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="rounded-lg border border-base-300 bg-base-100 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-65">{t("dashboard.bots.monitoring.wasTitle")}</p>
                        <div className="mt-2 space-y-1 text-sm">
                          <p>
                            <span className="opacity-60">{t("dashboard.bots.monitoring.closedTradesLabel")}</span>{" "}
                            <span className="font-semibold">{monitorSessionDetail.summary.closedTrades}</span>
                          </p>
                          <p>
                            <span className="opacity-60">{t("dashboard.bots.monitoring.winRateLabel")}</span>{" "}
                            <span className="font-semibold">{formatNumber(monitorWinRate, 2)}%</span>
                          </p>
                          <p>
                            <span className="opacity-60">{t("dashboard.bots.monitoring.realizedPnlLabel")}</span>{" "}
                            <span
                              className={`font-semibold ${
                                monitorSessionDetail.summary.realizedPnl >= 0 ? "text-success" : "text-error"
                              }`}
                            >
                              {formatCurrency(monitorSessionDetail.summary.realizedPnl)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="rounded-lg border border-base-300 bg-base-100 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-65">{t("dashboard.bots.monitoring.futureTitle")}</p>
                        <div className="mt-2 space-y-1 text-sm">
                          <p>
                            <span className="opacity-60">{t("dashboard.bots.monitoring.trackedSymbolsLabel")}</span>{" "}
                            <span className="font-semibold">{monitorSymbolStats?.items.length ?? 0}</span>
                          </p>
                          <p>
                            <span className="opacity-60">{t("dashboard.bots.monitoring.marketStateSignalActive")}</span>{" "}
                            <span className="font-semibold">{monitorRuntimeStateSummary.SIGNAL_ACTIVE}</span>
                          </p>
                          <p>
                            <span className="opacity-60">{t("dashboard.bots.monitoring.marketStateEvaluatedNoTrade")}</span>{" "}
                            <span className="font-semibold">{monitorRuntimeStateSummary.EVALUATED_NO_TRADE}</span>
                          </p>
                          <p>
                            <span className="opacity-60">{t("dashboard.bots.monitoring.marketStateConfiguredOnly")}</span>{" "}
                            <span className="font-semibold">{monitorRuntimeStateSummary.CONFIGURED_ONLY}</span>
                          </p>
                          <p>
                            <span className="opacity-60">{t("dashboard.bots.monitoring.dcaLabel")}</span>{" "}
                            <span className="font-semibold">{monitorSessionDetail.summary.dcaCount}</span>
                          </p>
                          <p>
                            <span className="opacity-60">{t("dashboard.bots.monitoring.feesLabel")}</span>{" "}
                            <span className="font-semibold">{formatCurrency(monitorSessionDetail.summary.feesPaid)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {monitorSessionDetail ? (
                    <div className="rounded-lg border border-base-300 bg-base-100 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide opacity-65">
                        {t("dashboard.bots.monitoring.operatorCheckTitle")}
                      </p>
                      <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-md border border-base-300 bg-base-200 px-2 py-2">
                          <p className="opacity-60">{t("dashboard.bots.monitoring.heartbeatLagLabel")}</p>
                          <p className="mt-1 font-semibold">{formatDuration(monitorHeartbeatLagMs ?? 0)}</p>
                        </div>
                        <div className="rounded-md border border-base-300 bg-base-200 px-2 py-2">
                          <p className="opacity-60">{t("dashboard.bots.monitoring.lastSignalLabel")}</p>
                          <p className="mt-1 font-semibold">{formatDateTime(monitorLastSignalAt)}</p>
                        </div>
                        <div className="rounded-md border border-base-300 bg-base-200 px-2 py-2">
                          <p className="opacity-60">{t("dashboard.bots.monitoring.lastTradeLabel")}</p>
                          <p className="mt-1 font-semibold">{formatDateTime(monitorLastTradeAt)}</p>
                        </div>
                        <div className="rounded-md border border-base-300 bg-base-200 px-2 py-2">
                          <p className="opacity-60">{t("dashboard.bots.monitoring.capitalSourceLabel")}</p>
                          <p className="mt-1 font-semibold">
                            {monitorCapitalKpis.capitalSource === "PAPER_RESET_CHECKPOINT"
                              ? t("dashboard.bots.monitoring.capitalSourcePaperReset")
                              : monitorCapitalKpis.capitalSource === "LIVE_EXCHANGE_BALANCE"
                                ? t("dashboard.bots.monitoring.capitalSourceLiveExchange")
                                : t("dashboard.bots.monitoring.capitalSourcePaperInitial")}
                          </p>
                        </div>
                        {monitorCapitalKpis.paperResetAt ? (
                          <div className="rounded-md border border-base-300 bg-base-200 px-2 py-2">
                            <p className="opacity-60">{t("dashboard.bots.monitoring.paperResetAtLabel")}</p>
                            <p className="mt-1 font-semibold">{formatDateTime(monitorCapitalKpis.paperResetAt)}</p>
                          </div>
                        ) : null}
                        <div className="rounded-md border border-base-300 bg-base-200 px-2 py-2">
                          <p className="opacity-60">{t("dashboard.bots.monitoring.openPositionsOrdersLabel")}</p>
                          <p className="mt-1 font-semibold">
                            {monitorPositions?.openCount ?? 0} /{" "}
                            {monitorPositions?.openOrdersCount ?? monitorPositions?.openOrders?.length ?? 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {monitorPortfolioHistory ? (
                    <BotsPortfolioHistorySection
                      t={t}
                      history={monitorPortfolioHistory}
                      formatDateTime={formatDateTime}
                      formatNumber={formatNumber}
                      formatCurrency={formatCurrency}
                      interpolateTemplate={interpolateTemplate}
                    />
                  ) : null}

                  <div id="monitor-now" className="scroll-mt-24 rounded-lg border border-base-300 bg-base-100 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">{t("dashboard.bots.monitoring.sections.nowOpenPositionsTitle")}</h3>
                        <p className="text-xs opacity-65">
                          {t("dashboard.bots.monitoring.sections.nowOpenPositionsDescription")}
                        </p>
                        <p className="mt-1 text-xs opacity-60">
                          {t("dashboard.bots.monitoring.notionalLabel")}: {formatCurrency(monitorOpenMarginSummary.totalNotional)} | {t("dashboard.bots.monitoring.marginLabel")}:{" "}
                          {formatCurrency(monitorOpenMarginSummary.totalMarginUsed)} | {t("dashboard.bots.monitoring.openPnlLabel")}{" "}
                          <span
                            className={
                              monitorOpenMarginSummary.totalOpenPnl >= 0 ? "text-success" : "text-error"
                            }
                          >
                            {formatCurrency(monitorOpenMarginSummary.totalOpenPnl)}
                          </span>
                          {monitorOpenMarginSummary.marginInitPct != null ? (
                            <>
                              {" "}
                              | {t("dashboard.bots.monitoring.marginInitLabel")}: {formatNumber(monitorOpenMarginSummary.marginInitPct, 2)}%
                            </>
                          ) : null}
                        </p>
                      </div>
                      <span className="text-xs opacity-60">
                        {interpolateTemplate(t("dashboard.bots.monitoring.activeCount"), {
                          count: monitorOpenPositionRows.length,
                          total: monitorPositions?.openCount ?? 0,
                        })}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="table table-xs table-zebra">
                        <thead>
                          <tr>
                            <th>{t("dashboard.bots.monitoring.table.timeOpened")}</th>
                            <th>{t("dashboard.bots.monitoring.table.symbol")}</th>
                            <th>{t("dashboard.bots.monitoring.table.side")}</th>
                            <th>{t("dashboard.bots.monitoring.table.runtimeState")}</th>
                            <th>{t("dashboard.bots.monitoring.table.qty")}</th>
                            <th>{t("dashboard.bots.monitoring.table.entry")}</th>
                            <th>{t("dashboard.bots.monitoring.table.mark")}</th>
                            <th>{t("dashboard.bots.monitoring.notionalLabel")}</th>
                            <th>{t("dashboard.bots.monitoring.marginLabel")}</th>
                            <th>{t("dashboard.bots.monitoring.marginInitLabel")}</th>
                            <th>{t("dashboard.bots.monitoring.table.fees")}</th>
                            <th>{t("dashboard.bots.monitoring.table.openPnl")}</th>
                            <th>{t("dashboard.bots.monitoring.table.openPct")}</th>
                            <th>{t("dashboard.bots.monitoring.table.roiMarginPct")}</th>
                            <th>{t("dashboard.bots.monitoring.table.dca")}</th>
                            {monitorShowDynamicStopColumns ? <th>{t("dashboard.bots.monitoring.table.slTtp")}</th> : null}
                            {monitorShowDynamicStopColumns ? <th>{t("dashboard.bots.monitoring.table.slTsl")}</th> : null}
                          </tr>
                        </thead>
                        <tbody>
                          {monitorOpenPositionRows.map((position) => (
                            <tr key={position.id}>
                              <td>{formatDateTime(position.openedAt)}</td>
                              <td className="font-medium">{position.symbol}</td>
                              <td>{position.side}</td>
                              <td>{renderRuntimeState(position)}</td>
                              <td>{formatNumber(position.quantity, 6)}</td>
                              <td>{formatNumber(position.entryPrice, 4)}</td>
                              <td>
                                <div className="flex flex-col leading-tight">
                                  <span>{position.markPrice != null ? formatNumber(position.markPrice, 4) : "-"}</span>
                                  <span className="text-[10px] uppercase tracking-wide opacity-60">
                                    {t(
                                      resolveRuntimeOpenPositionMarkPriceSourceLabelKey(
                                        position.liveMarkPriceSource
                                      ) as TranslationKey
                                    )}
                                  </span>
                                </div>
                              </td>
                              <td>{formatCurrency(position.entryNotional)}</td>
                              <td>{formatCurrency(position.marginUsed)}</td>
                              <td>
                                {position.marginInitPct != null
                                  ? `${formatNumber(position.marginInitPct, 2)}%`
                                  : "-"}
                              </td>
                              <td>{formatCurrency(position.feesPaid)}</td>
                              <td className={position.openPnl >= 0 ? "text-success" : "text-error"}>
                                {formatCurrency(position.openPnl)}
                              </td>
                              <td className={position.pnlNotionalPct >= 0 ? "text-success" : "text-error"}>
                                {formatNumber(position.pnlNotionalPct, 2)}%
                              </td>
                              <td className={position.pnlMarginPct >= 0 ? "text-success" : "text-error"}>
                                {formatNumber(position.pnlMarginPct, 2)}%
                              </td>
                              <td className="text-[11px]">
                                {formatDcaLadderCell({
                                  id: position.id,
                                  dcaCount: position.dcaCount,
                                  dcaExecutedLevels: position.dcaExecutedLevels,
                                  dcaPlannedLevels: position.dcaPlannedLevels,
                                })}
                              </td>
                              {monitorShowDynamicStopColumns ? (
                                <td>
                                  {position.ttpProtectedPercent == null
                                    ? "-"
                                    : `${formatNumber(position.ttpProtectedPercent, 2)}%`}
                                </td>
                              ) : null}
                              {monitorShowDynamicStopColumns ? (
                                <td>
                                  {position.tslProtectedPercent == null
                                    ? "-"
                                    : `${formatNumber(position.tslProtectedPercent, 2)}%`}
                                </td>
                              ) : null}
                            </tr>
                          ))}
                          {monitorOpenPositionRows.length === 0 ? (
                            <tr>
                              <td
                                colSpan={monitorShowDynamicStopColumns ? 17 : 15}
                                className="text-center text-xs opacity-70"
                              >
                                {t("dashboard.bots.monitoring.emptyOpenPositions")}
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {monitorShowOpenOrders ? (
                    <div className="rounded-lg border border-base-300 bg-base-100 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-sm font-semibold">{t("dashboard.bots.monitoring.sections.nowOpenOrdersTitle")}</h3>
                        <span className="text-xs opacity-60">
                          {interpolateTemplate(t("dashboard.bots.monitoring.activeCount"), {
                            count: (monitorPositions?.openOrders ?? []).length,
                            total: monitorPositions?.openOrdersCount ?? monitorPositions?.openOrders?.length ?? 0,
                          })}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="table table-xs table-zebra">
                          <thead>
                            <tr>
                              <th>{t("dashboard.bots.monitoring.table.symbol")}</th>
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
                            {(monitorPositions?.openOrders ?? []).map((order) => (
                              <tr key={order.id}>
                                <td className="font-medium">{order.symbol}</td>
                                <td>{order.side}</td>
                                <td>{order.type}</td>
                                <td>{order.status}</td>
                                <td>{formatNumber(order.quantity, 6)}</td>
                                <td>{formatNumber(order.filledQuantity, 6)}</td>
                                <td>{order.price != null ? formatNumber(order.price, 4) : "-"}</td>
                                <td>{order.stopPrice != null ? formatNumber(order.stopPrice, 4) : "-"}</td>
                                <td>{formatDateTime(order.submittedAt ?? order.createdAt)}</td>
                              </tr>
                            ))}
                            {(monitorPositions?.openOrders?.length ?? 0) === 0 ? (
                              <tr>
                                <td colSpan={9} className="text-center text-xs opacity-70">
                                  {t("dashboard.bots.monitoring.emptyOpenOrders")}
                                </td>
                              </tr>
                            ) : null}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}

                  <div id="monitor-history" className="scroll-mt-24 rounded-lg border border-base-300 bg-base-100 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">{t("dashboard.bots.monitoring.sections.historyPositionsTitle")}</h3>
                        <p className="text-xs opacity-65">
                          {t("dashboard.bots.monitoring.sections.historyPositionsDescription")}
                        </p>
                      </div>
                      <span className="text-xs opacity-60">
                        {interpolateTemplate(t("dashboard.bots.monitoring.closedCount"), {
                          count: monitorPositions?.historyItems.length ?? 0,
                          total: monitorPositions?.closedCount ?? 0,
                        })}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="table table-xs table-zebra">
                        <thead>
                          <tr>
                            <th>{t("dashboard.bots.monitoring.table.symbol")}</th>
                            <th>{t("dashboard.bots.monitoring.table.side")}</th>
                            <th>{t("dashboard.bots.monitoring.table.open")}</th>
                            <th>{t("dashboard.bots.monitoring.table.close")}</th>
                            <th>{t("dashboard.bots.monitoring.table.closeReason")}</th>
                            <th>{t("dashboard.bots.monitoring.table.closeBy")}</th>
                            <th>{t("dashboard.bots.monitoring.table.duration")}</th>
                            <th>{t("dashboard.bots.monitoring.table.qty")}</th>
                            <th>{t("dashboard.bots.monitoring.table.entry")}</th>
                            <th>{t("dashboard.bots.monitoring.table.exit")}</th>
                            <th>{t("dashboard.bots.monitoring.table.dca")}</th>
                            <th>{t("dashboard.bots.monitoring.table.fees")}</th>
                            <th>{t("dashboard.bots.monitoring.table.realizedPnl")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(monitorPositions?.historyItems ?? []).map((position) => (
                            <tr key={position.id}>
                              <td className="font-medium">{position.symbol}</td>
                              <td>{position.side}</td>
                              <td>{formatDateTime(position.openedAt)}</td>
                              <td>{formatDateTime(position.closedAt)}</td>
                              <td>{renderMonitoringCloseReason(position.closeReason, t)}</td>
                              <td>{renderMonitoringCloseInitiator(position.closeInitiator, t)}</td>
                              <td>{formatDuration(position.holdMs)}</td>
                              <td>{formatNumber(position.quantity, 6)}</td>
                              <td>{formatNumber(position.entryPrice, 4)}</td>
                              <td>{position.exitPrice != null ? formatNumber(position.exitPrice, 4) : "-"}</td>
                              <td className="text-[11px]">
                                {formatDcaLadderCell({
                                  id: position.id,
                                  dcaCount: position.dcaCount,
                                  dcaExecutedLevels: position.dcaExecutedLevels,
                                  dcaPlannedLevels: position.dcaPlannedLevels,
                                })}
                              </td>
                              <td>{formatCurrency(position.feesPaid)}</td>
                              <td className={position.realizedPnl >= 0 ? "text-success" : "text-error"}>
                                {formatCurrency(position.realizedPnl)}
                              </td>
                            </tr>
                          ))}
                          {(monitorPositions?.historyItems.length ?? 0) === 0 ? (
                            <tr>
                              <td colSpan={13} className="text-center text-xs opacity-70">
                                {t("dashboard.bots.monitoring.emptyClosedPositions")}
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-lg border border-base-300 bg-base-100 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">{t("dashboard.bots.monitoring.sections.historyTradesTitle")}</h3>
                      <span className="text-xs opacity-60">
                        {interpolateTemplate(t("dashboard.bots.monitoring.recordsCount"), {
                          count: monitorOperationalTrades.length,
                          total: monitorTrades?.total ?? 0,
                        })}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="table table-xs table-zebra">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>{t("dashboard.bots.monitoring.table.time")}</th>
                            <th>{t("dashboard.bots.monitoring.table.symbol")}</th>
                            <th>{t("dashboard.bots.monitoring.table.side")}</th>
                            <th>{t("dashboard.bots.monitoring.table.action")}</th>
                            <th>{t("dashboard.bots.monitoring.table.closeReason")}</th>
                            <th>{t("dashboard.bots.monitoring.table.closeBy")}</th>
                            <th>{t("dashboard.bots.monitoring.table.qty")}</th>
                            <th>{t("dashboard.bots.monitoring.table.price")}</th>
                            <th>{t("dashboard.bots.monitoring.table.margin")}</th>
                            <th>{t("dashboard.bots.monitoring.table.fee")}</th>
                            <th>{t("dashboard.bots.monitoring.table.feePct")}</th>
                            <th>{t("dashboard.bots.monitoring.table.realizedPnl")}</th>
                            <th>{t("dashboard.bots.monitoring.table.pnlPct")}</th>
                            <th>{t("dashboard.bots.monitoring.table.cumulativePnl")}</th>
                            <th>{t("dashboard.bots.monitoring.table.origin")}</th>
                            <th>{t("dashboard.bots.monitoring.table.order")}</th>
                            <th>{t("dashboard.bots.monitoring.table.position")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monitorOperationalTrades.map((trade) => (
                            <tr key={trade.id}>
                              <td>{trade.rowNo}</td>
                              <td>{formatDateTime(trade.executedAt)}</td>
                              <td className="font-medium">{trade.symbol}</td>
                              <td>
                                <span className={`badge badge-xs ${toTradeSideBadgeClass(trade.side)}`}>{trade.side}</span>
                              </td>
                              <td>
                                <span className={`badge badge-xs ${toTradeLifecycleBadgeClass(trade.lifecycleAction)}`}>
                                  {t(toTradeLifecycleLabelKey(trade.lifecycleAction))}
                                </span>
                              </td>
                              <td>{trade.lifecycleAction === "CLOSE" ? renderMonitoringCloseReason(trade.closeReason, t) : "-"}</td>
                              <td>{trade.lifecycleAction === "CLOSE" ? renderMonitoringCloseInitiator(trade.closeInitiator, t) : "-"}</td>
                              <td>{formatNumber(trade.quantity, 6)}</td>
                              <td>{formatNumber(trade.price, 4)}</td>
                              <td>{formatCurrency(trade.margin)}</td>
                              <td>
                                <div className="flex flex-col leading-tight">
                                  <span>{formatCurrency(trade.fee)}</span>
                                  <span className="text-[10px] opacity-60">{formatTradeFeeMeta(trade)}</span>
                                </div>
                              </td>
                              <td>{formatNumber(trade.feePct, 2)}%</td>
                              <td className={trade.realizedPnl >= 0 ? "text-success" : "text-error"}>
                                {formatCurrency(trade.realizedPnl)}
                              </td>
                              <td className={trade.pnlPct >= 0 ? "text-success" : "text-error"}>
                                {formatNumber(trade.pnlPct, 2)}%
                              </td>
                              <td className={trade.cumulativePnl >= 0 ? "text-success" : "text-error"}>
                                {formatCurrency(trade.cumulativePnl)}
                              </td>
                              <td>
                                <span className="badge badge-outline badge-xs">{trade.origin}</span>
                              </td>
                              <td className="font-mono text-[10px]">{trade.orderId.slice(0, 8)}</td>
                              <td className="font-mono text-[10px]">{trade.positionId.slice(0, 8)}</td>
                            </tr>
                          ))}
                          {monitorOperationalTrades.length === 0 ? (
                            <tr>
                              <td colSpan={18} className="text-center text-xs opacity-70">
                                {t("dashboard.bots.monitoring.emptyTrades")}
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <MonitoringFutureSignalsSection
                    t={t}
                    monitorSignalRows={monitorSignalRows}
                    monitorSessionDetail={monitorSessionDetail}
                    formatDateTime={formatDateTime}
                    formatNumber={formatNumber}
                    formatCurrency={formatCurrency}
                    interpolateTemplate={interpolateTemplate}
                  />
                </div>
              ) : null}
            </>
          )}
    </div>
  );
}
