"use client";

import type { TranslationKey } from "../../../../i18n/translations";
import { EmptyState, ErrorState } from "../../../../ui/components/ViewState";
import { SkeletonCardBlock, SkeletonKpiRow } from "../../../../ui/components/loading";
import { supportsExchangeCapability } from "../../../exchanges/exchangeCapabilities";
import type { Bot, BotRuntimeSessionListItem, BotRuntimeSessionStatus } from "../../types/bot.type";

type MonitoringSectionBaseProps = {
  t: (key: TranslationKey) => string;
  bots: Bot[];
  monitorQuickSwitchBots: Bot[];
  monitorBotId: string;
  setMonitorBotId: (botId: string) => void;
  selectedMonitorBot: Bot | null;
  monitorRuntimeCapabilityAvailable: boolean;
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
  monitorDataIsStale: boolean;
  monitorDataAgeLabel: string | null;
  refreshMonitoring: () => Promise<void>;
  formatDateTime: (value?: string | null) => string;
  interpolateTemplate: (template: string, values: Record<string, string | number>) => string;
};

export function MonitoringQuickContextSection({
  t,
  bots,
  monitorQuickSwitchBots,
  monitorBotId,
  setMonitorBotId,
}: Pick<MonitoringSectionBaseProps, "t" | "bots" | "monitorQuickSwitchBots" | "monitorBotId" | "setMonitorBotId">) {
  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t("dashboard.bots.monitoring.quickContextTitle")}</h3>
        <span className="text-xs opacity-60">
          {monitorQuickSwitchBots.length}
          {bots.some((bot) => bot.isActive)
            ? t("dashboard.bots.monitoring.cardsActiveSuffix")
            : t("dashboard.bots.monitoring.cardsAllSuffix")}
        </span>
      </div>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {monitorQuickSwitchBots.map((bot) => (
          <button
            key={bot.id}
            type="button"
            className={`rounded-md border p-2 text-left transition-colors ${
              monitorBotId === bot.id
                ? "border-primary bg-primary/10"
                : "border-base-300 bg-base-200 hover:border-primary/50"
            }`}
            onClick={() => setMonitorBotId(bot.id)}
          >
            <p className="truncate text-sm font-semibold">{bot.name}</p>
            <p className="mt-1 text-[11px] opacity-70">
              {bot.exchange} - {bot.marketType} | {bot.mode} | {bot.isActive ? t("dashboard.bots.monitoring.active") : t("dashboard.bots.monitoring.inactive")}
            </p>
            {!((bot.mode === "LIVE"
              ? supportsExchangeCapability(bot.exchange, "LIVE_EXECUTION")
              : supportsExchangeCapability(bot.exchange, "PAPER_PRICING_FEED"))) ? (
              <div className="mt-1">
                <span className="badge badge-xs badge-warning badge-outline">
                  {t("dashboard.bots.list.placeholderBadge")}
                </span>
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MonitoringControlsSection({
  t,
  bots,
  selectedMonitorBot,
  monitorRuntimeCapabilityAvailable,
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
  monitorBotId,
  setMonitorBotId,
  monitorDataIsStale,
  monitorDataAgeLabel,
  formatDateTime,
  interpolateTemplate,
}: Omit<MonitoringSectionBaseProps, "monitorQuickSwitchBots" | "monitorLoading" | "monitorError" | "refreshMonitoring">) {
  return (
    <div className="space-y-3 rounded-lg border border-base-300 bg-base-100 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{t("dashboard.bots.monitoring.controlsTitle")}</h3>
          <p className="text-xs opacity-70">{t("dashboard.bots.monitoring.controlsDescription")}</p>
        </div>
        <span className="badge badge-outline badge-sm">{t("dashboard.bots.monitoring.autoRefreshLabel")}</span>
      </div>

      {!monitorRuntimeCapabilityAvailable && selectedMonitorBot ? (
        <div className="alert alert-warning text-sm">
          <div className="space-y-1">
            <span className="badge badge-xs badge-warning badge-outline">
              {t("dashboard.bots.list.placeholderBadge")}
            </span>
            <span>
              {selectedMonitorBot.exchange}:{" "}
              {t("dashboard.bots.create.placeholderActivationHint").replace("{mode}", selectedMonitorBot.mode)}
            </span>
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-6">
        <label className="form-control">
          <span className="label-text">{t("dashboard.bots.monitoring.sessionStatusLabel")}</span>
          <select
            className="select select-bordered"
            value={monitorStatus}
            onChange={(event) => setMonitorStatus(event.target.value as "ALL" | BotRuntimeSessionStatus)}
          >
            <option value="ALL">{t("dashboard.bots.monitoring.sessionStatusAll")}</option>
            <option value="RUNNING">RUNNING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="FAILED">FAILED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
        </label>
        <label className="form-control md:col-span-2">
          <span className="label-text">{t("dashboard.bots.monitoring.symbolFilterLabel")}</span>
          <input
            className="input input-bordered"
            placeholder={t("dashboard.bots.monitoring.symbolFilterPlaceholder")}
            value={monitorSymbolFilter}
            onChange={(event) => setMonitorSymbolFilter(event.target.value.toUpperCase())}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleApplyMonitoringFilter();
              }
            }}
          />
          <p className="mt-1 text-[11px] opacity-65">{t("dashboard.bots.monitoring.symbolFilterHint")}</p>
        </label>
        <div className="form-control">
          <span className="label-text">&nbsp;</span>
          <div className="flex gap-2">
            <button type="button" className="btn btn-primary btn-sm" onClick={handleApplyMonitoringFilter}>
              {t("dashboard.bots.monitoring.applyFilter")}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleClearMonitoringFilter}>
              {t("dashboard.bots.monitoring.clearFilter")}
            </button>
          </div>
        </div>
        <div className="form-control md:col-span-2">
          <span className="label-text">{t("dashboard.bots.monitoring.activeFilterLabel")}</span>
          <div className="rounded-md border border-base-300 bg-base-200 px-3 py-2 text-sm">
            {monitorAppliedSymbolFilter || t("dashboard.bots.monitoring.none")}
          </div>
        </div>
      </div>

      <p className="rounded-md border border-base-300 bg-base-200 px-3 py-2 text-xs opacity-75" aria-live="polite">
        {monitorViewMode === "aggregate"
          ? t("dashboard.bots.monitoring.autoRefreshAggregate")
          : selectedMonitorSession?.status === "RUNNING"
            ? t("dashboard.bots.monitoring.autoRefreshCurrentSession")
            : t("dashboard.bots.monitoring.autoRefreshSelectedSession")}
      </p>

      {monitorDataIsStale ? (
        <p className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning-content/85" aria-live="polite">
          {t("dashboard.bots.monitoring.staleDataWarning").replace("{age}", monitorDataAgeLabel ?? "-")}
        </p>
      ) : null}

      <details className="rounded-md border border-base-300 bg-base-200">
        <summary className="cursor-pointer px-3 py-2 text-xs font-semibold uppercase tracking-wide opacity-70">
          {t("dashboard.bots.monitoring.advancedOptions")}
        </summary>
        <div className="grid gap-3 border-t border-base-300 p-3 md:grid-cols-6">
          <label className="form-control md:col-span-2">
            <span className="label-text">{t("dashboard.bots.monitoring.botManualLabel")}</span>
            <select
              className="select select-bordered"
              value={monitorBotId}
              onChange={(event) => setMonitorBotId(event.target.value)}
            >
              {bots.map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.name}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text">{t("dashboard.bots.monitoring.viewLabel")}</span>
            <select
              className="select select-bordered"
              value={monitorViewMode}
              onChange={(event) => setMonitorViewMode(event.target.value as "aggregate" | "session")}
            >
              <option value="aggregate">{t("dashboard.bots.monitoring.viewAggregate")}</option>
              <option value="session">{t("dashboard.bots.monitoring.viewSession")}</option>
            </select>
          </label>
          {monitorViewMode === "session" ? (
            <label className="form-control md:col-span-3">
              <span className="label-text">{t("dashboard.bots.monitoring.sessionLabel")}</span>
              <select
                className="select select-bordered"
                value={monitorSessionId}
                onChange={(event) => setMonitorSessionId(event.target.value)}
                disabled={monitorSessions.length === 0}
              >
                {monitorSessions.length === 0 ? <option value="">{t("dashboard.bots.monitoring.noSessionsOption")}</option> : null}
                {monitorSessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.id.slice(0, 8)} | {session.status} | {formatDateTime(session.startedAt)}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="form-control md:col-span-3">
              <span className="label-text">{t("dashboard.bots.monitoring.scopeLabel")}</span>
              <div className="rounded-box border border-base-300/60 bg-base-100/70 px-3 py-2 text-sm">
                {interpolateTemplate(t("dashboard.bots.monitoring.scopeAllSessions"), {
                  count: monitorSessions.length,
                })}
              </div>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}

export function MonitoringQuickNavSection({
  t,
}: {
  t: (key: TranslationKey) => string;
}) {
  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide opacity-65">{t("dashboard.bots.monitoring.quickNavTitle")}</p>
      <div role="tablist" className="tabs tabs-boxed mt-2 w-full max-w-xl">
        <a href="#monitor-now" role="tab" className="tab">
          {t("dashboard.bots.monitoring.quickNavNow")}
        </a>
        <a href="#monitor-history" role="tab" className="tab">
          {t("dashboard.bots.monitoring.quickNavHistory")}
        </a>
        <a href="#monitor-future" role="tab" className="tab">
          {t("dashboard.bots.monitoring.quickNavFuture")}
        </a>
      </div>
      <p className="mt-2 text-[11px] opacity-65">
        {t("dashboard.bots.monitoring.quickNavDescription")}
      </p>
    </div>
  );
}

export function MonitoringAsyncState({
  t,
  monitorLoading,
  monitorError,
  monitorSessionsCount,
  monitorBotId,
  refreshMonitoring,
}: {
  t: (key: TranslationKey) => string;
  monitorLoading: boolean;
  monitorError: string | null;
  monitorSessionsCount: number;
  monitorBotId: string;
  refreshMonitoring: () => Promise<void>;
}) {
  if (monitorLoading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label={t("dashboard.bots.monitoring.loadingSessions")}>
        <SkeletonKpiRow items={4} />
        <SkeletonCardBlock cards={3} linesPerCard={3} title={false} className="border-base-300/40 bg-base-100/60 p-3" />
      </div>
    );
  }

  if (monitorError) {
    return (
      <ErrorState
        title={t("dashboard.bots.monitoring.loadErrorTitle")}
        description={monitorError}
        retryLabel={t("dashboard.bots.states.retry")}
        onRetry={() => {
          if (!monitorBotId) return;
          void refreshMonitoring();
        }}
      />
    );
  }

  if (monitorSessionsCount === 0) {
    return (
      <EmptyState
        title={t("dashboard.bots.monitoring.emptySessionsTitle")}
        description={t("dashboard.bots.monitoring.emptySessionsDescription")}
      />
    );
  }

  return null;
}
