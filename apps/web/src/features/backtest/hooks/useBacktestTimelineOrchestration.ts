import { useCallback, useEffect, useRef, useState } from 'react';

import { getAxiosMessage } from '@/lib/getAxiosMessage';
import { normalizeSymbol } from '@/lib/symbols';
import { getBacktestRunTimeline } from '../services/backtests.service';
import type { BacktestTimeline } from '../types/backtest.type';

export type BacktestRunDetailsTab = 'summary' | 'markets' | 'trades' | 'raw';

export type BacktestTimelineState = {
  data: BacktestTimeline | null;
  loading: boolean;
  loadingPhase: 'candles' | 'events' | null;
  candlesNextCursor: number | null;
  eventsNextCursor: number | null;
  candlesLoaded: boolean;
  eventsLoaded: boolean;
  error: string | null;
};

type SymbolStatsItem = {
  symbol: string;
};

type UseBacktestTimelineOrchestrationArgs = {
  runId: string;
  activeTab: BacktestRunDetailsTab;
  symbolStats: SymbolStatsItem[];
  parityDiagnosticsBySymbol: Map<string, { status: 'PROCESSED' | 'FAILED'; error: string | null }>;
  timelineLoadErrorDefault: string;
  timelineParityFailedDefault: string;
};

const mergeByKey = <T, K extends string | number>(current: T[], incoming: T[], getKey: (value: T) => K) => {
  const map = new Map<K, T>();
  for (const item of current) {
    map.set(getKey(item), item);
  }
  for (const item of incoming) {
    map.set(getKey(item), item);
  }
  return [...map.values()];
};

const TIMELINE_CHUNK_SIZE = 600;

export const useBacktestTimelineOrchestration = ({
  runId,
  activeTab,
  symbolStats,
  parityDiagnosticsBySymbol,
  timelineLoadErrorDefault,
  timelineParityFailedDefault,
}: UseBacktestTimelineOrchestrationArgs) => {
  const [timelines, setTimelines] = useState<Record<string, BacktestTimelineState>>({});
  const timelinesRef = useRef<Record<string, BacktestTimelineState>>({});
  const inFlightTimelineRequestsRef = useRef<Map<string, Promise<BacktestTimeline | undefined>>>(new Map());

  useEffect(() => {
    timelinesRef.current = timelines;
  }, [timelines]);

  useEffect(() => {
    // When navigating between runs with the same symbols, clear cached timeline cards
    // to avoid rendering stale market charts from a previous run.
    inFlightTimelineRequestsRef.current.clear();
    timelinesRef.current = {};
    setTimelines({});
  }, [runId]);

  const loadSymbolTimelineChunk = useCallback(
    async ({
      symbol,
      cursor = 0,
      append = false,
      scope,
    }: {
      symbol: string;
      cursor?: number;
      append?: boolean;
      scope: 'candles' | 'events';
    }) => {
      const lockKey = `${symbol}:${scope}:${cursor}:${append ? 'append' : 'replace'}`;
      const existingRequest = inFlightTimelineRequestsRef.current.get(lockKey);
      if (existingRequest) return existingRequest;

      const requestPromise = (async () => {
        setTimelines((prev) => ({
          ...prev,
          [symbol]: {
            data: prev[symbol]?.data ?? null,
            loading: true,
            loadingPhase: scope,
            candlesNextCursor: prev[symbol]?.candlesNextCursor ?? null,
            eventsNextCursor: prev[symbol]?.eventsNextCursor ?? null,
            candlesLoaded: prev[symbol]?.candlesLoaded ?? false,
            eventsLoaded: prev[symbol]?.eventsLoaded ?? false,
            error: null,
          },
        }));

        try {
          const data = await getBacktestRunTimeline(runId, {
            symbol,
            cursor,
            chunkSize: TIMELINE_CHUNK_SIZE,
            replayContext: 'isolated',
            includeCandles: scope === 'candles',
            includeIndicators: scope === 'candles',
            includeEvents: scope === 'events',
          });

          const normalizedData: BacktestTimeline = {
            ...data,
            candles: Array.isArray(data.candles) ? data.candles : [],
            events: Array.isArray(data.events) ? data.events : [],
            indicatorSeries: Array.isArray(data.indicatorSeries) ? data.indicatorSeries : [],
          };

          setTimelines((prev) => {
            const existing = prev[symbol]?.data;
            let prepared: BacktestTimeline;

            if (!existing) {
              prepared = normalizedData;
            } else if (!append) {
              if (scope === 'candles') {
                prepared = {
                  ...normalizedData,
                  events: existing.events,
                };
              } else {
                prepared = {
                  ...existing,
                  ...normalizedData,
                  candles: existing.candles,
                  indicatorSeries: existing.indicatorSeries,
                  events: normalizedData.events,
                  cursor: existing.cursor,
                  previousCursor: existing.previousCursor,
                };
              }
            } else if (scope === 'candles') {
              prepared = {
                ...existing,
                ...normalizedData,
                candles: mergeByKey(existing.candles, normalizedData.candles, (candle) => candle.candleIndex),
                events: existing.events,
                indicatorSeries: normalizedData.indicatorSeries.map((series) => {
                  const existingSeries = existing.indicatorSeries.find((item) => item.key === series.key);
                  return {
                    ...series,
                    points: mergeByKey(existingSeries?.points ?? [], series.points, (point) => point.candleIndex),
                  };
                }),
                cursor: 0,
                previousCursor: null,
              };
            } else {
              prepared = {
                ...existing,
                ...normalizedData,
                candles: existing.candles,
                indicatorSeries: existing.indicatorSeries,
                events: mergeByKey(existing.events, normalizedData.events, (event) => event.id),
                cursor: existing.cursor,
                previousCursor: existing.previousCursor,
              };
            }

            prepared = {
              ...prepared,
              candles: [...prepared.candles].sort((a, b) => a.candleIndex - b.candleIndex),
              events: [...prepared.events].sort((a, b) => a.candleIndex - b.candleIndex),
              indicatorSeries: prepared.indicatorSeries.map((series) => ({
                ...series,
                points: [...series.points].sort((a, b) => a.candleIndex - b.candleIndex),
              })),
            };

            return {
              ...prev,
              [symbol]: {
                data: prepared,
                loading: false,
                loadingPhase: null,
                candlesNextCursor:
                  scope === 'candles'
                    ? (typeof normalizedData.nextCursor === 'number' ? normalizedData.nextCursor : null)
                    : (prev[symbol]?.candlesNextCursor ?? null),
                eventsNextCursor:
                  scope === 'events'
                    ? (typeof normalizedData.nextCursor === 'number' ? normalizedData.nextCursor : null)
                    : (prev[symbol]?.eventsNextCursor ?? null),
                candlesLoaded:
                  scope === 'candles'
                    ? normalizedData.nextCursor == null
                    : (prev[symbol]?.candlesLoaded ?? false),
                eventsLoaded:
                  scope === 'events'
                    ? normalizedData.nextCursor == null
                    : (prev[symbol]?.eventsLoaded ?? false),
                error: null,
              },
            };
          });

          return normalizedData;
        } catch (err: unknown) {
          setTimelines((prev) => ({
            ...prev,
            [symbol]: {
              data: prev[symbol]?.data ?? null,
              loading: false,
              loadingPhase: null,
              candlesNextCursor: prev[symbol]?.candlesNextCursor ?? null,
              eventsNextCursor: prev[symbol]?.eventsNextCursor ?? null,
              candlesLoaded: prev[symbol]?.candlesLoaded ?? false,
              eventsLoaded: prev[symbol]?.eventsLoaded ?? false,
              error: getAxiosMessage(err) ?? timelineLoadErrorDefault,
            },
          }));
          return undefined;
        } finally {
          inFlightTimelineRequestsRef.current.delete(lockKey);
        }
      })();

      inFlightTimelineRequestsRef.current.set(lockKey, requestPromise);
      return requestPromise;
    },
    [runId, timelineLoadErrorDefault],
  );

  useEffect(() => {
    if (activeTab !== 'markets' && activeTab !== 'trades') return;
    if (symbolStats.length === 0) return;
    let cancelled = false;
    const shouldLoadCandles = activeTab === 'markets';

    const runQueue = async () => {
      for (const stats of symbolStats) {
        if (cancelled) return;
        const symbol = stats.symbol;
        const parity = parityDiagnosticsBySymbol.get(normalizeSymbol(symbol));
        if (parity?.status === 'FAILED') {
          setTimelines((prev) => ({
            ...prev,
            [symbol]: {
              data: prev[symbol]?.data ?? null,
              loading: false,
              loadingPhase: null,
              candlesNextCursor: prev[symbol]?.candlesNextCursor ?? null,
              eventsNextCursor: prev[symbol]?.eventsNextCursor ?? null,
              candlesLoaded: prev[symbol]?.candlesLoaded ?? false,
              eventsLoaded: prev[symbol]?.eventsLoaded ?? false,
              error: parity.error ?? timelineParityFailedDefault,
            },
          }));
          continue;
        }
        let candlesCursor: number | null = null;
        let firstCandlesChunk = false;

        if (shouldLoadCandles) {
          const timelineState = timelinesRef.current[symbol];
          const existingTimeline = timelineState?.data;
          const hasExistingCandles = Boolean(existingTimeline && existingTimeline.candles.length > 0);

          candlesCursor =
            timelineState?.candlesLoaded
              ? null
              : timelineState?.candlesNextCursor ??
                (hasExistingCandles && existingTimeline
                  ? Math.min(existingTimeline.candles.length, existingTimeline.totalCandles)
                  : 0);
          firstCandlesChunk = !hasExistingCandles;

          // Load first candle chunk first so chart renders quickly.
          if (!cancelled && candlesCursor != null && firstCandlesChunk) {
            const firstChunk = await loadSymbolTimelineChunk({
              symbol,
              cursor: candlesCursor,
              append: false,
              scope: 'candles',
            });
            if (!firstChunk) continue;
            candlesCursor = firstChunk.nextCursor;
            firstCandlesChunk = false;
          }
        }

        const refreshedTimelineState = timelinesRef.current[symbol];
        const hasExistingEvents = Boolean(refreshedTimelineState?.data && refreshedTimelineState.data.events.length > 0);
        let eventsCursor: number | null =
          refreshedTimelineState?.eventsLoaded
            ? null
            : refreshedTimelineState?.eventsNextCursor ?? 0;
        let firstEventsChunk = !hasExistingEvents;

        while (!cancelled && eventsCursor != null) {
          const eventsChunk = await loadSymbolTimelineChunk({
            symbol,
            cursor: eventsCursor,
            append: !firstEventsChunk,
            scope: 'events',
          });
          if (!eventsChunk) break;
          eventsCursor = eventsChunk.nextCursor;
          firstEventsChunk = false;
        }

        if (!shouldLoadCandles) continue;

        while (!cancelled && candlesCursor != null) {
          const candlesChunk = await loadSymbolTimelineChunk({
            symbol,
            cursor: candlesCursor,
            append: true,
            scope: 'candles',
          });
          if (!candlesChunk) break;
          candlesCursor = candlesChunk.nextCursor;
        }
      }
    };

    void runQueue();
    return () => {
      cancelled = true;
    };
  }, [activeTab, loadSymbolTimelineChunk, parityDiagnosticsBySymbol, symbolStats, timelineParityFailedDefault]);

  return {
    timelines,
  };
};
