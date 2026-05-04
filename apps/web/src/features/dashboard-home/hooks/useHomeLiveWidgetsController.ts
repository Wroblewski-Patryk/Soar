'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  BotRuntimeGraph,
  BotRuntimeMonitoringAggregateResponse,
  BotRuntimeSessionStatus,
  BotRuntimeTrade,
  BotRuntimeSessionListItem,
  BotRuntimeTradesResponse,
} from "../../bots/types/bot.type";
import { TranslationKey } from "../../../i18n/translations";
import { getAxiosMessage } from '@/lib/getAxiosMessage';
import { normalizeSymbol } from '@/lib/symbols';
import { toTimestamp } from '@/lib/time';
import {
  getLocalStorageItem,
  getLocalStorageJsonItem,
  setLocalStorageItem,
  setLocalStorageJsonItem,
} from '@/lib/storage';
import type {
  RuntimeDataTab,
  RuntimeSnapshot,
  TradeFiltersState,
  TradeSortBy,
  TradeSortDir,
} from "../components/home-live-widgets/types";
import { buildRuntimeTradeMeta } from "../components/home-live-widgets/runtimeTradeMeta";

const MAX_DASHBOARD_BOTS = 8;
const AUTO_REFRESH_VISIBLE_INTERVAL_MS = 10_000;
const AUTO_REFRESH_HIDDEN_INTERVAL_MS = 30_000;
const LOAD_STALE_AFTER_MS = 20_000;
const SELECTED_BOT_STORAGE_KEY = "dashboard.home.selectedBotId";
const DASHBOARD_TRADE_HISTORY_SORT_STORAGE_KEY = "dashboard.home.tradeHistory.sort.v1";
const TRADE_PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

const EMPTY_TRADE_FILTERS: TradeFiltersState = {
  symbol: "",
  side: "ALL",
  action: "ALL",
  from: "",
  to: "",
};

const hasActiveTradeFilters = (filters: TradeFiltersState) =>
  Boolean(filters.symbol.trim()) ||
  filters.side !== "ALL" ||
  filters.action !== "ALL" ||
  Boolean(filters.from.trim()) ||
  Boolean(filters.to.trim());

const readStoredTradeSortPreference = (): {
  sortBy: TradeSortBy | null;
  sortDir: TradeSortDir;
} => {
  const parsed = getLocalStorageJsonItem<{ sortBy?: unknown; sortDir?: unknown }>(
    DASHBOARD_TRADE_HISTORY_SORT_STORAGE_KEY
  );
  if (!parsed) {
    return { sortBy: null as TradeSortBy | null, sortDir: "asc" as TradeSortDir };
  }
  return {
    sortBy: typeof parsed.sortBy === "string" ? (parsed.sortBy as TradeSortBy) : null,
    sortDir: parsed.sortDir === "desc" ? "desc" : "asc",
  };
};

const pickPrimarySession = (sessions: BotRuntimeSessionListItem[]) => {
  if (sessions.length === 0) return null;
  const byFreshestHeartbeat = (a: BotRuntimeSessionListItem, b: BotRuntimeSessionListItem) => {
    const heartbeatDiff = toTimestamp(b.lastHeartbeatAt) - toTimestamp(a.lastHeartbeatAt);
    if (heartbeatDiff !== 0) return heartbeatDiff;
    const startedDiff = toTimestamp(b.startedAt) - toTimestamp(a.startedAt);
    if (startedDiff !== 0) return startedDiff;
    return b.id.localeCompare(a.id);
  };
  const running = sessions.filter((x) => x.status === "RUNNING");
  if (running.length > 0) {
    return [...running].sort(byFreshestHeartbeat)[0] ?? null;
  }
  return [...sessions].sort(byFreshestHeartbeat)[0] ?? null;
};

const normalizeDateTimeLocalToIso = (value: string, bound: "from" | "to") => {
  const raw = value.trim();
  if (!raw) return undefined;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return undefined;
  if (bound === "to") {
    const hasSeconds = raw.length >= 19;
    if (hasSeconds) {
      parsed.setMilliseconds(999);
    } else {
      parsed.setSeconds(59, 999);
    }
  }
  return parsed.toISOString();
};

const resolveAutoRefreshIntervalMs = () => {
  if (typeof document === "undefined") {
    return AUTO_REFRESH_VISIBLE_INTERVAL_MS;
  }
  return document.visibilityState === "hidden"
    ? AUTO_REFRESH_HIDDEN_INTERVAL_MS
    : AUTO_REFRESH_VISIBLE_INTERVAL_MS;
};

const toComparableTradeValue = (trade: BotRuntimeTrade, sortBy: TradeSortBy): number | string => {
  if (sortBy === "executedAt") return toTimestamp(trade.executedAt);
  if (sortBy === "symbol") return normalizeSymbol(trade.symbol);
  if (sortBy === "side") return trade.side;
  if (sortBy === "lifecycleAction") return trade.lifecycleAction;
  if (sortBy === "margin") return trade.margin;
  if (sortBy === "fee") return trade.fee;
  return trade.realizedPnl;
};

const applyAggregateTradeQuery = ({
  baseTrades,
  tradePage,
  tradePageSize,
  tradeSortBy,
  tradeSortDir,
  tradeAppliedFilters,
}: {
  baseTrades: BotRuntimeTradesResponse;
  tradePage: number;
  tradePageSize: number;
  tradeSortBy: TradeSortBy | null;
  tradeSortDir: TradeSortDir;
  tradeAppliedFilters: TradeFiltersState;
}): BotRuntimeTradesResponse => {
  const symbolFilter = tradeAppliedFilters.symbol.trim()
    ? normalizeSymbol(tradeAppliedFilters.symbol)
    : "";
  const sideFilter = tradeAppliedFilters.side === "ALL" ? "" : tradeAppliedFilters.side;
  const actionFilter = tradeAppliedFilters.action === "ALL" ? "" : tradeAppliedFilters.action;
  const fromTs = tradeAppliedFilters.from
    ? toTimestamp(normalizeDateTimeLocalToIso(tradeAppliedFilters.from, "from"))
    : Number.NEGATIVE_INFINITY;
  const toTs = tradeAppliedFilters.to
    ? toTimestamp(normalizeDateTimeLocalToIso(tradeAppliedFilters.to, "to"))
    : Number.POSITIVE_INFINITY;

  const filtered = baseTrades.items.filter((trade) => {
    if (symbolFilter && !normalizeSymbol(trade.symbol).includes(symbolFilter)) return false;
    if (sideFilter && trade.side !== sideFilter) return false;
    if (actionFilter && trade.lifecycleAction !== actionFilter) return false;
    const executedAtTs = toTimestamp(trade.executedAt);
    return executedAtTs >= fromTs && executedAtTs <= toTs;
  });

  const sorted = [...filtered];
  if (tradeSortBy) {
    sorted.sort((a, b) => {
      const left = toComparableTradeValue(a, tradeSortBy);
      const right = toComparableTradeValue(b, tradeSortBy);
      let baseCompare = 0;
      if (typeof left === "number" && typeof right === "number") {
        baseCompare = left - right;
      } else {
        baseCompare = String(left).localeCompare(String(right));
      }
      if (baseCompare === 0) {
        baseCompare = toTimestamp(a.executedAt) - toTimestamp(b.executedAt);
      }
      if (baseCompare === 0) {
        baseCompare = a.id.localeCompare(b.id);
      }
      return tradeSortDir === "asc" ? baseCompare : -baseCompare;
    });
  }

  const pageSize = Math.max(1, tradePageSize);
  const total =
    !hasActiveTradeFilters(tradeAppliedFilters) && !tradeSortBy
      ? Math.max(baseTrades.total, sorted.length)
      : sorted.length;
  const meta = buildRuntimeTradeMeta({ page: tradePage, pageSize, total });
  const start = (meta.page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  return {
    sessionId: baseTrades.sessionId,
    total,
    meta,
    window: baseTrades.window,
    items,
  };
};

type TickerEventPayload = {
  symbol: string;
  lastPrice: number;
};

type UseHomeLiveWidgetsControllerArgs = {
  createMarketStreamEventSource: (params: { symbols: string[]; interval: string }) => EventSource;
  getBotRuntimeGraph: (botId: string) => Promise<BotRuntimeGraph>;
  getBotRuntimeMonitoringAggregate: (
    botId: string,
    query?: { status?: BotRuntimeSessionStatus; symbol?: string; sessionsLimit?: number; perSessionLimit?: number }
  ) => Promise<BotRuntimeMonitoringAggregateResponse>;
  listBotRuntimeSessions: (botId: string, query?: { limit?: number }) => Promise<BotRuntimeSessionListItem[]>;
  listBots: () => Promise<Bot[]>;
  t: (key: TranslationKey) => string;
};

export const useHomeLiveWidgetsController = ({
  createMarketStreamEventSource,
  getBotRuntimeGraph,
  getBotRuntimeMonitoringAggregate,
  listBotRuntimeSessions,
  listBots,
  t,
}: UseHomeLiveWidgetsControllerArgs) => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [snapshots, setSnapshots] = useState<RuntimeSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [selectedTrades, setSelectedTrades] = useState<BotRuntimeTradesResponse | null>(null);
  const [selectedTradesLoading, setSelectedTradesLoading] = useState(false);
  const [tradePage, setTradePage] = useState(1);
  const [tradePageSize, setTradePageSize] = useState<number>(TRADE_PAGE_SIZE_OPTIONS[0]);
  const [tradeSortBy, setTradeSortBy] = useState<TradeSortBy | null>(
    () => readStoredTradeSortPreference().sortBy
  );
  const [tradeSortDir, setTradeSortDir] = useState<TradeSortDir>(
    () => readStoredTradeSortPreference().sortDir
  );
  const [runtimeDataTab, setRuntimeDataTab] = useState<RuntimeDataTab>("OPEN_POSITIONS");
  const [tradeDraftFilters, setTradeDraftFilters] = useState<TradeFiltersState>(EMPTY_TRADE_FILTERS);
  const [tradeAppliedFilters, setTradeAppliedFilters] = useState<TradeFiltersState>(EMPTY_TRADE_FILTERS);
  const [refreshToken, setRefreshToken] = useState(0);
  const [liveTickerPrices, setLiveTickerPrices] = useState<Record<string, number>>({});
  const [viewportWidth, setViewportWidth] = useState(0);
  const [runtimeStaleWatchNowMs, setRuntimeStaleWatchNowMs] = useState(() => Date.now());
  const hasLoadedTradesRef = useRef(false);
  const loadInFlightRef = useRef(false);
  const loadStartedAtRef = useRef<number | null>(null);
  const runtimeStreamEligibleRef = useRef(false);
  const runtimeStreamConnectedRef = useRef(false);
  const lastSseTickerAtRef = useRef<number | null>(null);
  const lastSseDrivenRefreshAtRef = useRef(0);
  const signalRailRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (silent && loadInFlightRef.current) {
      const startedAt = loadStartedAtRef.current ?? 0;
      if (Date.now() - startedAt < LOAD_STALE_AFTER_MS) return;
    }
    loadInFlightRef.current = true;
    loadStartedAtRef.current = Date.now();
    if (!silent) {
      setLoading(true);
      setError(null);
    }

    try {
      const botsResponse = await listBots();
      const ordered = [...botsResponse].sort((a, b) => {
        if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      setBots(ordered);

      if (ordered.length === 0) {
        setSnapshots([]);
        setSelectedBotId(null);
        setLastUpdatedAt(new Date().toISOString());
        setRefreshToken((x) => x + 1);
        return;
      }

      const active = ordered.filter((x) => x.isActive);
      const activeScope = active;
      if (activeScope.length === 0) {
        setSnapshots([]);
        setSelectedBotId(null);
        setLastUpdatedAt(new Date().toISOString());
        setRefreshToken((x) => x + 1);
        return;
      }
      const scope = activeScope.slice(0, MAX_DASHBOARD_BOTS);
      const next = await Promise.all(
        scope.map(async (bot): Promise<RuntimeSnapshot> => {
          try {
            const sessions = await listBotRuntimeSessions(bot.id, { limit: 20 });
            const primary = pickPrimarySession(sessions);
            const runtimeGraph = await getBotRuntimeGraph(bot.id).catch(() => null);
            if (!primary) {
              return {
                bot,
                session: null,
                actionSessionId: null,
                symbolStats: null,
                positions: null,
                trades: null,
                runtimeGraph,
              };
            }
            try {
              const aggregate = await getBotRuntimeMonitoringAggregate(bot.id, {
                sessionsLimit: sessions.length,
                perSessionLimit: 200,
              });
              return {
                bot,
                session: {
                  id: aggregate.sessionDetail.id,
                  botId: aggregate.sessionDetail.botId,
                  mode: aggregate.sessionDetail.mode,
                  status: aggregate.sessionDetail.status,
                  startedAt: aggregate.sessionDetail.startedAt,
                  finishedAt: aggregate.sessionDetail.finishedAt,
                  lastHeartbeatAt: aggregate.sessionDetail.lastHeartbeatAt,
                  stopReason: aggregate.sessionDetail.stopReason,
                  errorMessage: aggregate.sessionDetail.errorMessage,
                  createdAt: aggregate.sessionDetail.createdAt,
                  updatedAt: aggregate.sessionDetail.updatedAt,
                  durationMs: aggregate.sessionDetail.durationMs,
                  eventsCount: aggregate.sessionDetail.eventsCount,
                  symbolsTracked: aggregate.sessionDetail.symbolsTracked,
                  summary: {
                    totalSignals: aggregate.sessionDetail.summary.totalSignals,
                    dcaCount: aggregate.sessionDetail.summary.dcaCount,
                    closedTrades: aggregate.sessionDetail.summary.closedTrades,
                    realizedPnl: aggregate.sessionDetail.summary.realizedPnl,
                  },
                },
                actionSessionId: primary.id,
                symbolStats: aggregate.symbolStats,
                positions: aggregate.positions,
                trades: aggregate.trades,
                runtimeGraph,
              };
            } catch {
              return {
                bot,
                session: primary,
                actionSessionId: null,
                symbolStats: null,
                positions: null,
                trades: null,
                runtimeGraph,
                loadError: t("dashboard.home.runtime.noSignalData"),
              };
            }
          } catch (err) {
            return {
              bot,
              session: null,
              actionSessionId: null,
              symbolStats: null,
              positions: null,
              trades: null,
              runtimeGraph: null,
              loadError: getAxiosMessage(err) ?? t("dashboard.home.runtime.noSignalData"),
            };
          }
        })
      );

      setSnapshots(next);
      setSelectedBotId((prev) => (prev && next.some((x) => x.bot.id === prev) ? prev : next[0]?.bot.id ?? null));
      const hasFreshSnapshot = next.some((item) => !item.loadError);
      if (hasFreshSnapshot) {
        setLastUpdatedAt(new Date().toISOString());
      }
      setRefreshToken((x) => x + 1);
    } catch (err) {
      if (!silent) {
        setError(getAxiosMessage(err) ?? t("dashboard.home.loadWidgetsErrorDescription"));
      }
    } finally {
      loadInFlightRef.current = false;
      loadStartedAtRef.current = null;
      if (!silent) setLoading(false);
    }
  }, [
    getBotRuntimeGraph,
    getBotRuntimeMonitoringAggregate,
    listBotRuntimeSessions,
    listBots,
    t,
  ]);

  const triggerSseDrivenRefresh = useCallback(() => {
    const now = Date.now();
    const minIntervalMs = resolveAutoRefreshIntervalMs();
    if (now - lastSseDrivenRefreshAtRef.current < minIntervalMs) return;
    lastSseDrivenRefreshAtRef.current = now;
    void load({ silent: true });
  }, [load]);

  useEffect(() => {
    const saved = getLocalStorageItem(SELECTED_BOT_STORAGE_KEY);
    if (saved) setSelectedBotId(saved);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    let timer = window.setInterval(() => {
      void load({ silent: true });
    }, resolveAutoRefreshIntervalMs());

    const handleVisibilityChange = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => {
        void load({ silent: true });
      }, resolveAutoRefreshIntervalMs());
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(timer);
    };
  }, [load]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRuntimeStaleWatchNowMs(Date.now());
    }, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const selected = useMemo(() => {
    if (snapshots.length === 0) return null;
    if (!selectedBotId) return snapshots[0];
    return snapshots.find((x) => x.bot.id === selectedBotId) ?? snapshots[0];
  }, [snapshots, selectedBotId]);

  useEffect(() => {
    if (!selected?.bot.id) return;
    setLocalStorageItem(SELECTED_BOT_STORAGE_KEY, selected.bot.id);
  }, [selected?.bot.id]);

  useEffect(() => {
    setTradePage(1);
  }, [selected?.bot.id, selected?.trades?.sessionId]);

  const streamSymbols = useMemo(() => {
    const fromStats = selected?.symbolStats?.items?.map((item) => item.symbol) ?? [];
    const fromOpen = selected?.positions?.openItems?.map((item) => item.symbol) ?? [];
    return [...new Set([...fromStats, ...fromOpen].map((symbol) => normalizeSymbol(symbol)))];
  }, [selected?.symbolStats?.items, selected?.positions?.openItems]);
  const streamSymbolsKey = useMemo(() => streamSymbols.join(","), [streamSymbols]);

  useEffect(() => {
    setLiveTickerPrices({});
  }, [selected?.bot.id, selected?.session?.id, selected?.session?.status, streamSymbolsKey]);

  useEffect(() => {
    const streamEligible = Boolean(
      selected?.session?.id &&
      selected.session.status === "RUNNING" &&
      streamSymbolsKey
    );
    runtimeStreamEligibleRef.current = streamEligible;
    if (streamEligible) return;
    runtimeStreamConnectedRef.current = false;
    lastSseTickerAtRef.current = null;
    lastSseDrivenRefreshAtRef.current = 0;
  }, [selected?.session?.id, selected?.session?.status, streamSymbolsKey]);

  useEffect(() => {
    if (!selected?.session?.id || selected.session.status !== "RUNNING") return;
    if (!streamSymbolsKey) return;
    if (typeof window === "undefined" || typeof window.EventSource === "undefined") return;

    const source = createMarketStreamEventSource({
      symbols: streamSymbols,
      interval: "1m",
    });

    source.onopen = () => {
      runtimeStreamConnectedRef.current = true;
    };

    source.onerror = () => {
      runtimeStreamConnectedRef.current = false;
    };

    source.addEventListener("ticker", (event) => {
      try {
        const data = JSON.parse((event as MessageEvent).data) as TickerEventPayload;
        if (!data?.symbol || !Number.isFinite(data.lastPrice)) return;
        lastSseTickerAtRef.current = Date.now();
        const symbolKey = normalizeSymbol(data.symbol);
        setLiveTickerPrices((prev) => {
          if (prev[symbolKey] === data.lastPrice) return prev;
          return { ...prev, [symbolKey]: data.lastPrice };
        });
        triggerSseDrivenRefresh();
      } catch {
        // ignore malformed ticker payload
      }
    });

    return () => {
      runtimeStreamConnectedRef.current = false;
      source.close();
    };
  }, [
    createMarketStreamEventSource,
    selected?.session?.id,
    selected?.session?.status,
    streamSymbols,
    streamSymbolsKey,
    triggerSseDrivenRefresh,
  ]);

  useEffect(() => {
    hasLoadedTradesRef.current = false;
    setSelectedTrades(null);
    setSelectedTradesLoading(false);
  }, [selected?.bot.id, selected?.trades?.sessionId]);

  useEffect(() => {
    if (!selected?.trades) {
      setSelectedTrades(null);
      return;
    }
    const shouldShowLoading = !hasLoadedTradesRef.current;
    if (shouldShowLoading) setSelectedTradesLoading(true);
    const nextTrades = applyAggregateTradeQuery({
      baseTrades: selected.trades,
      tradePage,
      tradePageSize,
      tradeSortBy,
      tradeSortDir,
      tradeAppliedFilters,
    });
    setSelectedTrades(nextTrades);
    hasLoadedTradesRef.current = true;
    if (shouldShowLoading) setSelectedTradesLoading(false);
  }, [
    selected?.trades,
    refreshToken,
    tradePage,
    tradePageSize,
    tradeSortBy,
    tradeSortDir,
    tradeAppliedFilters,
  ]);

  const patchTradeDraftFilters = (patch: Partial<TradeFiltersState>) => {
    setTradeDraftFilters((prev) => ({ ...prev, ...patch }));
  };

  const applyTradeFilters = () => {
    setTradePage(1);
    setTradeAppliedFilters({ ...tradeDraftFilters });
  };

  const handleTradeSortChange = useCallback(
    (columnKey: string | null, direction: "asc" | "desc") => {
      setTradePage(1);
      setTradeSortBy(columnKey as TradeSortBy | null);
      setTradeSortDir(direction);
    },
    []
  );

  const resetTradeFilters = () => {
    setTradePage(1);
    setTradeDraftFilters(EMPTY_TRADE_FILTERS);
    setTradeAppliedFilters(EMPTY_TRADE_FILTERS);
    setTradeSortBy(null);
    setTradeSortDir("asc");
  };

  useEffect(() => {
    setLocalStorageJsonItem(DASHBOARD_TRADE_HISTORY_SORT_STORAGE_KEY, {
      sortBy: tradeSortBy,
      sortDir: tradeSortDir,
    });
  }, [tradeSortBy, tradeSortDir]);

  return {
    applyTradeFilters,
    bots,
    error,
    handleTradeSortChange,
    lastUpdatedAt,
    liveTickerPrices,
    load,
    loading,
    patchTradeDraftFilters,
    resetTradeFilters,
    runtimeDataTab,
    runtimeStaleWatchNowMs,
    selected,
    selectedTrades,
    selectedTradesLoading,
    setRuntimeDataTab,
    setSelectedBotId,
    setTradePage,
    setTradePageSize,
    signalRailRef,
    snapshots,
    tradeDraftFilters,
    tradePage,
    tradePageSize,
    tradeSortBy,
    tradeSortDir,
    viewportWidth,
  };
};
