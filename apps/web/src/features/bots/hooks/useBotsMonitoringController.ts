'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TranslationKey } from "../../../i18n/translations";
import { createMarketStreamEventSource } from "../../../lib/marketStream";
import { getAxiosMessage } from '@/lib/getAxiosMessage';
import { normalizeSymbol } from "@/lib/symbols";
import {
  getBotPortfolioHistory,
  getBotRuntimeSession,
  listBotRuntimeSessionPositions,
  listBotRuntimeSessions,
  listBotRuntimeSessionSymbolStats,
  listBotRuntimeSessionTrades,
} from "../services/bots.service";
import { loadBotMonitoringAggregate } from "../services/botsMonitoringAggregate.service";
import {
  Bot,
  BotPortfolioHistoryResponse,
  BotRuntimePositionsResponse,
  BotRuntimeSessionDetail,
  BotRuntimeSessionListItem,
  BotRuntimeSessionStatus,
  BotRuntimeSymbolStatsResponse,
  BotRuntimeTradesResponse,
} from "../types/bot.type";

const MONITOR_AUTO_REFRESH_VISIBLE_INTERVAL_MS = 10_000;
const MONITOR_AUTO_REFRESH_HIDDEN_INTERVAL_MS = 30_000;

type TickerEventPayload = {
  symbol: string;
  lastPrice: number;
};

const resolveMonitorRefreshIntervalMs = () => {
  if (typeof document === "undefined") {
    return MONITOR_AUTO_REFRESH_VISIBLE_INTERVAL_MS;
  }
  return document.visibilityState === "hidden"
    ? MONITOR_AUTO_REFRESH_HIDDEN_INTERVAL_MS
    : MONITOR_AUTO_REFRESH_VISIBLE_INTERVAL_MS;
};

type UseBotsMonitoringControllerArgs = {
  activeTab: "bots" | "monitoring" | "assistant";
  bots: Bot[];
  preferredBotId: string | null;
  t: (key: TranslationKey) => string;
};

export const useBotsMonitoringController = ({
  activeTab,
  bots,
  preferredBotId,
  t,
}: UseBotsMonitoringControllerArgs) => {
  const [monitorBotId, setMonitorBotId] = useState("");
  const [monitorViewMode, setMonitorViewMode] = useState<"aggregate" | "session">("aggregate");
  const [monitorStatus, setMonitorStatus] = useState<"ALL" | BotRuntimeSessionStatus>("ALL");
  const [monitorSymbolFilter, setMonitorSymbolFilter] = useState("");
  const [monitorAppliedSymbolFilter, setMonitorAppliedSymbolFilter] = useState("");
  const [monitorSessions, setMonitorSessions] = useState<BotRuntimeSessionListItem[]>([]);
  const [monitorSessionId, setMonitorSessionId] = useState("");
  const [monitorSessionDetail, setMonitorSessionDetail] = useState<BotRuntimeSessionDetail | null>(null);
  const [monitorSymbolStats, setMonitorSymbolStats] = useState<BotRuntimeSymbolStatsResponse | null>(null);
  const [monitorPositions, setMonitorPositions] = useState<BotRuntimePositionsResponse | null>(null);
  const [monitorTrades, setMonitorTrades] = useState<BotRuntimeTradesResponse | null>(null);
  const [monitorPortfolioHistory, setMonitorPortfolioHistory] = useState<BotPortfolioHistoryResponse | null>(null);
  const [monitorLoading, setMonitorLoading] = useState(false);
  const [monitorSessionLoading, setMonitorSessionLoading] = useState(false);
  const [monitorError, setMonitorError] = useState<string | null>(null);
  const [monitorLastUpdatedAt, setMonitorLastUpdatedAt] = useState<string | null>(null);
  const [monitorStaleWatchNowMs, setMonitorStaleWatchNowMs] = useState(() => Date.now());
  const [monitorLiveTickerPrices, setMonitorLiveTickerPrices] = useState<Record<string, number>>({});
  const monitorStreamEligibleRef = useRef(false);
  const monitorStreamConnectedRef = useRef(false);
  const monitorLastSseTickerAtRef = useRef<number | null>(null);
  const monitorLastSseDrivenRefreshAtRef = useRef(0);

  const monitorStreamSymbols = useMemo(() => {
    const fromStats = monitorSymbolStats?.items?.map((item) => item.symbol) ?? [];
    const fromPositions = monitorPositions?.openItems?.map((item) => item.symbol) ?? [];
    return [...new Set([...fromStats, ...fromPositions].map((symbol) => normalizeSymbol(symbol)))];
  }, [monitorPositions?.openItems, monitorSymbolStats?.items]);
  const monitorStreamSymbolsKey = useMemo(
    () => monitorStreamSymbols.join(","),
    [monitorStreamSymbols]
  );

  const loadMonitorSessions = useCallback(
    async (
      botId: string,
      statusFilter: "ALL" | BotRuntimeSessionStatus,
      options?: { silent?: boolean }
    ): Promise<BotRuntimeSessionListItem[] | null> => {
      const silent = options?.silent ?? false;
      if (!botId) {
        setMonitorSessions([]);
        setMonitorSessionId("");
        setMonitorSessionDetail(null);
        setMonitorSymbolStats(null);
        setMonitorPositions(null);
        setMonitorTrades(null);
        setMonitorPortfolioHistory(null);
        setMonitorLastUpdatedAt(null);
        return [];
      }

      if (!silent) {
        setMonitorLoading(true);
        setMonitorError(null);
      }
      try {
        const sessions = await listBotRuntimeSessions(botId, {
          status: statusFilter === "ALL" ? undefined : statusFilter,
          limit: 50,
        });
        setMonitorSessions(sessions);
        setMonitorSessionId((prev) => {
          const stillExists = sessions.some((item) => item.id === prev);
          if (stillExists) return prev;
          return sessions[0]?.id ?? "";
        });

        if (sessions.length === 0) {
          setMonitorSessionDetail(null);
          setMonitorSymbolStats(null);
          setMonitorPositions(null);
          setMonitorTrades(null);
          setMonitorPortfolioHistory(null);
        }
        setMonitorLastUpdatedAt(new Date().toISOString());
        return sessions;
      } catch (err: unknown) {
        if (!silent) {
          setMonitorError(getAxiosMessage(err) ?? t("dashboard.bots.errors.loadRuntimeSessions"));
        }
        return null;
      } finally {
        if (!silent) {
          setMonitorLoading(false);
        }
      }
    },
    [t]
  );

  const loadMonitorSessionData = useCallback(
    async (
      botId: string,
      sessionId: string,
      symbolFilter: string,
      options?: { silent?: boolean }
    ) => {
      const silent = options?.silent ?? false;
      if (!botId || !sessionId) {
        setMonitorSessionDetail(null);
        setMonitorSymbolStats(null);
        setMonitorPositions(null);
        setMonitorTrades(null);
        setMonitorPortfolioHistory(null);
        setMonitorLastUpdatedAt(null);
        return;
      }

      const normalizedSymbol = normalizeSymbol(symbolFilter);
      if (!silent) {
        setMonitorSessionLoading(true);
        setMonitorError(null);
      }
      try {
        const [session, symbolStats, positions, trades] = await Promise.all([
          getBotRuntimeSession(botId, sessionId),
          listBotRuntimeSessionSymbolStats(botId, sessionId, {
            symbol: normalizedSymbol || undefined,
            limit: 200,
          }),
          listBotRuntimeSessionPositions(botId, sessionId, {
            symbol: normalizedSymbol || undefined,
            limit: 200,
          }),
          listBotRuntimeSessionTrades(botId, sessionId, {
            symbol: normalizedSymbol || undefined,
            limit: 200,
          }),
        ]);
        setMonitorSessionDetail(session);
        setMonitorSymbolStats(symbolStats);
        setMonitorPositions(positions);
        setMonitorTrades(trades);
        setMonitorLastUpdatedAt(new Date().toISOString());
      } catch (err: unknown) {
        if (!silent) {
          setMonitorError(getAxiosMessage(err) ?? t("dashboard.bots.errors.loadRuntimeSessionData"));
        }
      } finally {
        if (!silent) {
          setMonitorSessionLoading(false);
        }
      }
    },
    [t]
  );

  const loadMonitorAggregateData = useCallback(
    async (
      botId: string,
      sessions: BotRuntimeSessionListItem[],
      statusFilter: "ALL" | BotRuntimeSessionStatus,
      symbolFilter: string,
      options?: { silent?: boolean }
    ) => {
      const silent = options?.silent ?? false;
      if (!botId || sessions.length === 0) {
        setMonitorSessionDetail(null);
        setMonitorSymbolStats(null);
        setMonitorPositions(null);
        setMonitorTrades(null);
        setMonitorPortfolioHistory(null);
        setMonitorLastUpdatedAt(null);
        return;
      }

      const normalizedSymbol = normalizeSymbol(symbolFilter);
      const scopedSessions = sessions.slice(0, 20);

      if (!silent) {
        setMonitorSessionLoading(true);
        setMonitorError(null);
      }

      try {
        const aggregate = await loadBotMonitoringAggregate({
          botId,
          sessions: scopedSessions,
          status: statusFilter,
          symbol: normalizedSymbol || undefined,
          perSessionLimit: 200,
        });

        setMonitorSessionDetail(aggregate.sessionDetail);
        setMonitorSymbolStats(aggregate.symbolStats);
        setMonitorPositions(aggregate.positions);
        setMonitorTrades(aggregate.trades);
        setMonitorLastUpdatedAt(new Date().toISOString());
      } catch (err: unknown) {
        if (!silent) {
          setMonitorError(getAxiosMessage(err) ?? t("dashboard.bots.errors.loadAggregateMonitoring"));
        }
      } finally {
        if (!silent) {
          setMonitorSessionLoading(false);
        }
      }
    },
    [t]
  );

  const handleApplyMonitoringFilter = () => {
    setMonitorAppliedSymbolFilter(normalizeSymbol(monitorSymbolFilter));
  };

  const handleClearMonitoringFilter = () => {
    setMonitorSymbolFilter("");
    setMonitorAppliedSymbolFilter("");
  };

  const loadMonitorPortfolioHistory = useCallback(async (botId: string) => {
    try {
      const history = await getBotPortfolioHistory(botId);
      setMonitorPortfolioHistory(history);
    } catch {
      setMonitorPortfolioHistory(null);
    }
  }, []);

  const refreshMonitoring = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!monitorBotId) return;
      const sessions = await loadMonitorSessions(monitorBotId, monitorStatus, options);
      if (sessions == null) return;
      if (monitorViewMode === "aggregate") {
        await loadMonitorAggregateData(
          monitorBotId,
          sessions,
          monitorStatus,
          monitorAppliedSymbolFilter,
          options
        );
        await loadMonitorPortfolioHistory(monitorBotId);
        return;
      }
      const effectiveSessionId = monitorSessionId || sessions[0]?.id;
      if (!effectiveSessionId) {
        setMonitorSessionDetail(null);
        setMonitorSymbolStats(null);
        setMonitorPositions(null);
        setMonitorTrades(null);
        setMonitorPortfolioHistory(null);
        return;
      }
      await loadMonitorSessionData(monitorBotId, effectiveSessionId, monitorAppliedSymbolFilter, options);
      await loadMonitorPortfolioHistory(monitorBotId);
    },
    [
      loadMonitorAggregateData,
      loadMonitorSessionData,
      loadMonitorSessions,
      loadMonitorPortfolioHistory,
      monitorAppliedSymbolFilter,
      monitorBotId,
      monitorSessionId,
      monitorStatus,
      monitorViewMode,
    ]
  );

  const triggerSseDrivenMonitorRefresh = useCallback(() => {
    const now = Date.now();
    const minIntervalMs = resolveMonitorRefreshIntervalMs();
    if (now - monitorLastSseDrivenRefreshAtRef.current < minIntervalMs) return;
    monitorLastSseDrivenRefreshAtRef.current = now;
    void refreshMonitoring({ silent: true });
  }, [refreshMonitoring]);

  const shouldRunMonitorPollingFallback = useCallback(() => {
    if (typeof window === "undefined" || typeof window.EventSource === "undefined") {
      return true;
    }
    if (!monitorStreamEligibleRef.current) {
      return true;
    }
    if (!monitorStreamConnectedRef.current) {
      return true;
    }
    const lastTickerAt = monitorLastSseTickerAtRef.current;
    if (lastTickerAt == null) return true;
    return Date.now() - lastTickerAt >= resolveMonitorRefreshIntervalMs();
  }, []);

  useEffect(() => {
    if (bots.length === 0) {
      setMonitorBotId("");
      return;
    }
    const preferredCandidate =
      preferredBotId && bots.some((bot) => bot.id === preferredBotId) ? preferredBotId : null;
    const fallbackBotId = preferredCandidate ?? bots[0].id;

    if (!monitorBotId) {
      setMonitorBotId(fallbackBotId);
      return;
    }

    const exists = bots.some((bot) => bot.id === monitorBotId);
    if (!exists || (preferredCandidate && monitorBotId !== preferredCandidate)) {
      setMonitorBotId(fallbackBotId);
    }
  }, [bots, monitorBotId, preferredBotId]);

  useEffect(() => {
    if (activeTab !== "monitoring" || !monitorBotId) return;
    void refreshMonitoring();
  }, [activeTab, monitorBotId, refreshMonitoring]);

  useEffect(() => {
    if (activeTab !== "monitoring" || !monitorBotId) return;

    if (typeof document === "undefined") return;

    let intervalId = window.setInterval(() => {
      if (!shouldRunMonitorPollingFallback()) return;
      void refreshMonitoring({ silent: true });
    }, resolveMonitorRefreshIntervalMs());

    const handleVisibilityChange = () => {
      window.clearInterval(intervalId);
      intervalId = window.setInterval(() => {
        if (!shouldRunMonitorPollingFallback()) return;
        void refreshMonitoring({ silent: true });
      }, resolveMonitorRefreshIntervalMs());
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [
    activeTab,
    monitorBotId,
    refreshMonitoring,
    shouldRunMonitorPollingFallback,
  ]);

  useEffect(() => {
    if (activeTab !== "monitoring") return;
    const intervalId = window.setInterval(() => {
      setMonitorStaleWatchNowMs(Date.now());
    }, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeTab]);

  useEffect(() => {
    setMonitorLiveTickerPrices({});
  }, [
    monitorAppliedSymbolFilter,
    monitorBotId,
    monitorSessionDetail?.status,
    monitorSessionId,
    monitorStatus,
    monitorStreamSymbolsKey,
    monitorViewMode,
  ]);

  useEffect(() => {
    const streamEligible = activeTab === "monitoring" &&
      Boolean(monitorBotId) &&
      monitorSessionDetail?.status === "RUNNING" &&
      Boolean(monitorStreamSymbolsKey);
    monitorStreamEligibleRef.current = streamEligible;
    if (streamEligible) return;
    monitorStreamConnectedRef.current = false;
    monitorLastSseTickerAtRef.current = null;
    monitorLastSseDrivenRefreshAtRef.current = 0;
  }, [activeTab, monitorBotId, monitorSessionDetail?.status, monitorStreamSymbolsKey]);

  useEffect(() => {
    if (activeTab !== "monitoring" || !monitorBotId) return;
    if (monitorSessionDetail?.status !== "RUNNING") return;
    if (!monitorStreamSymbolsKey) return;
    if (typeof window === "undefined" || typeof window.EventSource === "undefined") return;

    const source = createMarketStreamEventSource({
      symbols: monitorStreamSymbols,
      interval: "1m",
    });

    source.onopen = () => {
      monitorStreamConnectedRef.current = true;
    };

    source.onerror = () => {
      monitorStreamConnectedRef.current = false;
    };

    source.addEventListener("ticker", (event) => {
      try {
        const data = JSON.parse((event as MessageEvent).data) as TickerEventPayload;
        if (!data?.symbol || !Number.isFinite(data.lastPrice)) return;
        monitorLastSseTickerAtRef.current = Date.now();
        const symbolKey = normalizeSymbol(data.symbol);
        setMonitorLiveTickerPrices((prev) => {
          if (prev[symbolKey] === data.lastPrice) return prev;
          return { ...prev, [symbolKey]: data.lastPrice };
        });
        triggerSseDrivenMonitorRefresh();
      } catch {
        // ignore malformed ticker payload
      }
    });

    return () => {
      monitorStreamConnectedRef.current = false;
      source.close();
    };
  }, [
    activeTab,
    monitorBotId,
    monitorSessionDetail?.status,
    monitorStreamSymbols,
    monitorStreamSymbolsKey,
    triggerSseDrivenMonitorRefresh,
  ]);

  return {
    handleApplyMonitoringFilter,
    handleClearMonitoringFilter,
    monitorAppliedSymbolFilter,
    monitorBotId,
    monitorError,
    monitorLastUpdatedAt,
    monitorLiveTickerPrices,
    monitorLoading,
    monitorPositions,
    monitorPortfolioHistory,
    monitorSessionDetail,
    monitorSessionId,
    monitorSessionLoading,
    monitorSessions,
    monitorStaleWatchNowMs,
    monitorStatus,
    monitorSymbolFilter,
    monitorSymbolStats,
    monitorTrades,
    monitorViewMode,
    refreshMonitoring,
    setMonitorBotId,
    setMonitorSessionId,
    setMonitorStatus,
    setMonitorSymbolFilter,
    setMonitorViewMode,
  };
};
