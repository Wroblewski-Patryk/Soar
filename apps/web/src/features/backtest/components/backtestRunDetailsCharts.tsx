"use client";

import { useRef, useState } from "react";
import type { BacktestTimeline, BacktestTrade } from "../types/backtest.type";
import { buildNonOverlappingTradeSegments } from "../utils/nonOverlappingTradeSegments";
import { getPatternMarkerBias, splitTimelineIndicatorSeriesForRendering } from "../utils/timelineIndicatorOverlays";
import type { DailyPerformancePoint } from "../utils/backtestRunDetailsViewModel";

type SummaryChartProps = {
  points: DailyPerformancePoint[];
  formatCurrency: (value: number) => string;
  emptyText: string;
};

export function SummaryDailyPnlChart({
  points,
  formatCurrency,
  emptyText,
}: SummaryChartProps) {
  if (points.length === 0) {
    return <p className="mt-2 text-sm opacity-70">{emptyText}</p>;
  }

  const width = 920;
  const height = 280;
  const padding = { top: 14, right: 56, bottom: 26, left: 56 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const pnlValues = points.map((point) => point.pnl);
  const pnlMin = Math.min(...pnlValues, 0);
  const pnlMax = Math.max(...pnlValues, 0);
  const pnlRange = pnlMax - pnlMin || 1;

  const yPnl = (value: number) => padding.top + (1 - (value - pnlMin) / pnlRange) * innerHeight;
  const stepX = innerWidth / Math.max(points.length, 1);
  const xAt = (index: number) => padding.left + stepX * index + stepX / 2;
  const zeroY = yPnl(0);
  const barWidth = Math.max(3, stepX * 0.62);

  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const pnlValue = pnlMax - ratio * pnlRange;
    const y = padding.top + ratio * innerHeight;
    return { y, pnlValue };
  });

  const xTickIndexes = [0, Math.floor(points.length * 0.33), Math.floor(points.length * 0.66), points.length - 1]
    .filter((idx, index, array) => idx >= 0 && idx < points.length && array.indexOf(idx) === index);

  return (
    <div className="space-y-2">
      <svg className="mt-2 h-[280px] w-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {yTicks.map((tick) => (
          <g key={`tick-${tick.y}`}>
            <line
              x1={padding.left}
              x2={padding.left + innerWidth}
              y1={tick.y}
              y2={tick.y}
              className="stroke-base-300/35"
            />
            <text x={padding.left - 6} y={tick.y + 3} textAnchor="end" className="fill-base-content/65 text-[10px]">
              {formatCurrency(tick.pnlValue)}
            </text>
          </g>
        ))}

        <line
          x1={padding.left}
          x2={padding.left + innerWidth}
          y1={zeroY}
          y2={zeroY}
          className="stroke-base-content/45"
          strokeDasharray="3 4"
        />

        {points.map((point, index) => {
          const x = xAt(index);
          const y = yPnl(point.pnl);
          const heightAbs = Math.max(1, Math.abs(y - zeroY));
          return (
            <rect
              key={point.dayKey}
              x={x - barWidth / 2}
              y={Math.min(y, zeroY)}
              width={barWidth}
              height={heightAbs}
              className={point.pnl >= 0 ? "fill-success/70" : "fill-error/70"}
            />
          );
        })}

        {xTickIndexes.map((index) => {
          const x = xAt(index);
          return (
            <text key={`x-${points[index].dayKey}`} x={x} y={padding.top + innerHeight + 14} textAnchor="middle" className="fill-base-content/60 text-[10px]">
              {points[index].label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export function SummaryBalanceChart({
  points,
  formatCurrency,
  emptyText,
}: SummaryChartProps) {
  if (points.length === 0) {
    return <p className="mt-2 text-sm opacity-70">{emptyText}</p>;
  }

  const width = 920;
  const height = 240;
  const padding = { top: 14, right: 20, bottom: 24, left: 56 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const balanceValues = points.map((point) => point.balance);
  const min = Math.min(...balanceValues);
  const max = Math.max(...balanceValues);
  const range = max - min || 1;
  const xAt = (index: number) => padding.left + (index / Math.max(points.length - 1, 1)) * innerWidth;
  const yAt = (value: number) => padding.top + (1 - (value - min) / range) * innerHeight;
  const polyline = points.map((point, index) => `${xAt(index)},${yAt(point.balance)}`).join(" ");

  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const value = max - ratio * range;
    const y = padding.top + ratio * innerHeight;
    return { y, value };
  });

  return (
    <div className="space-y-2">
      <svg className="mt-2 h-[240px] w-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {yTicks.map((tick) => (
          <g key={`balance-${tick.y}`}>
            <line
              x1={padding.left}
              x2={padding.left + innerWidth}
              y1={tick.y}
              y2={tick.y}
              className="stroke-base-300/35"
            />
            <text x={padding.left - 6} y={tick.y + 3} textAnchor="end" className="fill-base-content/65 text-[10px]">
              {formatCurrency(tick.value)}
            </text>
          </g>
        ))}
        <polyline fill="none" stroke="currentColor" strokeWidth="2.2" className="text-primary" points={polyline} />
      </svg>
    </div>
  );
}

type TimelineCandlesChartProps = {
  timeline: BacktestTimeline;
  trades: BacktestTrade[];
  symbol: string;
  netPnl: number;
  formatCurrency: (value: number) => string;
  formatNumber: (value: number) => string;
  rsiLongLevel: number | null;
  rsiShortLevel: number | null;
  eventsLoaded: boolean;
  noCandlesText: string;
  zoomLabel: string;
  zoomOutTitle: string;
  zoomInTitle: string;
};

export function TimelineCandlesChart({
  timeline,
  trades,
  symbol,
  netPnl,
  formatCurrency,
  formatNumber,
  rsiLongLevel,
  rsiShortLevel,
  eventsLoaded,
  noCandlesText,
  zoomLabel,
  zoomOutTitle,
  zoomInTitle,
}: TimelineCandlesChartProps) {
  const zoomSteps = [1, 1.25, 1.5, 2, 3, 4, 6, 8, 10];
  const [zoomIndex, setZoomIndex] = useState(0);
  const sharedScrollRef = useRef<HTMLDivElement | null>(null);
  const zoom = zoomSteps[zoomIndex] ?? 1;
  const candles = timeline.candles;
  if (candles.length === 0) {
    return <p className="text-sm opacity-70">{noCandlesText}</p>;
  }

  const width = Math.round(900 * zoom);
  const pricePanelHeight = 320;
  const oscillatorPanelHeight = 100;
  const xAxisHeight = 24;
  const axisOverlayWidth = 72;
  const padding = { top: 12, right: 8, bottom: 2, left: 8 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = pricePanelHeight - padding.top - padding.bottom;

  const prices = candles.flatMap((candle) => [candle.low, candle.high]);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const barWidth = innerWidth / candles.length;
  const yTicks = Array.from({ length: 5 }, (_, idx) => {
    const ratio = idx / 4;
    const value = max - ratio * range;
    const y = padding.top + ratio * innerHeight;
    return { y, value };
  });
  const desiredTickCount = Math.max(4, Math.min(16, Math.round(4 + zoom * 1.25)));
  const tickStep = Math.max(1, Math.floor(Math.max(1, candles.length - 1) / Math.max(1, desiredTickCount - 1)));
  const xTickIndexes = (() => {
    const indexes: number[] = [];
    for (let index = 0; index < candles.length; index += tickStep) {
      indexes.push(index);
    }
    if (candles.length > 0 && indexes[indexes.length - 1] !== candles.length - 1) {
      indexes.push(candles.length - 1);
    }
    return indexes.filter((idx, index, array) => idx >= 0 && idx < candles.length && array.indexOf(idx) === index);
  })();

  const xAt = (index: number) => padding.left + (index + 0.5) * barWidth;
  const yAt = (price: number) => padding.top + (1 - (price - min) / range) * innerHeight;
  const playbackX =
    typeof timeline.playbackCursor === "number" &&
    timeline.playbackCursor >= timeline.cursor &&
    timeline.playbackCursor < timeline.cursor + candles.length
      ? xAt(timeline.playbackCursor - timeline.cursor)
      : null;

  const rawTimelineEvents = Array.isArray(timeline.events) ? timeline.events : [];
  const symbolEventKey = `_${symbol}_`;
  const timelineEvents = rawTimelineEvents.filter((event) => event.tradeId.includes(symbolEventKey));
  const lifecycleEvents = timelineEvents.filter((event) => event.type === "DCA");
  const timelineIndicatorSeries = Array.isArray(timeline.indicatorSeries) ? timeline.indicatorSeries : [];
  const {
    priceSeries: priceIndicators,
    oscillatorPanels: oscillatorOverlayPanels,
    patternSeries: patternIndicatorSeries,
  } = splitTimelineIndicatorSeriesForRendering(timelineIndicatorSeries);
  const tradeSegmentsFromEvents = (() => {
    if (timelineEvents.length === 0) return [] as ReturnType<typeof buildNonOverlappingTradeSegments>;
    const closeLike = new Set(["EXIT", "TP", "TTP", "SL", "TSL", "LIQUIDATION"]);
    const grouped = new Map<
      string,
      {
        entry?: (typeof timelineEvents)[number];
        close?: (typeof timelineEvents)[number];
      }
    >();

    for (const event of [...timelineEvents].sort((a, b) => a.candleIndex - b.candleIndex)) {
      const bucket = grouped.get(event.tradeId) ?? {};
      if (event.type === "ENTRY") {
        bucket.entry = event;
      } else if (closeLike.has(event.type)) {
        if (!bucket.close || event.candleIndex >= bucket.close.candleIndex) {
          bucket.close = event;
        }
      }
      grouped.set(event.tradeId, bucket);
    }

    const firstCandleIndex = candles[0]?.candleIndex ?? timeline.cursor;
    const lastLocalIndex = candles.length - 1;

    const segments = [...grouped.entries()]
      .map(([tradeId, pair]) => {
        if (!pair.entry || !pair.close) return null;
        const startLocal = pair.entry.candleIndex - firstCandleIndex;
        const endLocal = pair.close.candleIndex - firstCandleIndex;
        if (!Number.isFinite(startLocal) || !Number.isFinite(endLocal)) return null;
        const start = Math.max(0, Math.min(lastLocalIndex, Math.min(startLocal, endLocal)));
        const end = Math.max(0, Math.min(lastLocalIndex, Math.max(startLocal, endLocal)));
        return {
          tradeId,
          start,
          end,
          side: pair.entry.side,
          entryPrice: pair.entry.price,
          exitPrice: pair.close.price,
          profit: (pair.close.pnl ?? 0) >= 0,
        };
      })
      .filter((segment): segment is NonNullable<typeof segment> => Boolean(segment))
      .sort((a, b) => a.start - b.start || a.end - b.end);

    return segments;
  })();

  const tradeSegments =
    tradeSegmentsFromEvents.length > 0
      ? tradeSegmentsFromEvents
      : eventsLoaded
        ? buildNonOverlappingTradeSegments(trades, candles)
        : [];

  const oscillatorPanels = oscillatorOverlayPanels.flatMap((overlayPanel) => {
    const values = overlayPanel.series
      .flatMap((series) => series.points.map((point) => point.value))
      .filter((value): value is number => typeof value === "number");
    if (values.length === 0) return [];

    const localMin = Math.min(...values);
    const localMax = Math.max(...values);
    const localRange = localMax - localMin || 1;
    const localYTicks = Array.from({ length: 4 }, (_, idx) => {
      const ratio = idx / 3;
      const value = localMax - ratio * localRange;
      const y = ratio * oscillatorPanelHeight;
      return { y, value };
    });
    const levelToY = (value: number) =>
      Math.max(0, Math.min(oscillatorPanelHeight, oscillatorPanelHeight - ((value - localMin) / localRange) * oscillatorPanelHeight));
    const palette = ["text-info", "text-warning", "text-secondary", "text-accent"];
    const lines = overlayPanel.series
      .map((series, seriesIndex) => {
        const points = series.points
          .map((point) => {
            if (typeof point.value !== "number") return null;
            const localIndex = point.candleIndex - timeline.cursor;
            if (localIndex < 0 || localIndex >= candles.length) return null;
            const x = xAt(localIndex);
            const y = oscillatorPanelHeight - ((point.value - localMin) / localRange) * oscillatorPanelHeight;
            return `${x},${y}`;
          })
          .filter((point): point is string => Boolean(point))
          .join(" ");
        if (!points) return null;
        const label = series.name.startsWith(overlayPanel.title)
          ? series.name.slice(overlayPanel.title.length).trim() || overlayPanel.title
          : series.name;
        return {
          key: series.key,
          label,
          className: palette[seriesIndex % palette.length],
          points,
        };
      })
      .filter((line): line is { key: string; label: string; className: string; points: string } => Boolean(line));
    if (lines.length === 0) return [];

    return [
      {
        key: overlayPanel.key,
        title: overlayPanel.title,
        localYTicks,
        levelToY,
        lines,
      },
    ];
  });

  const patternMarkers = patternIndicatorSeries.flatMap((series, seriesIndex) =>
    series.points
      .map((point) => {
        if (point.value !== 1) return null;
        const localIndex = point.candleIndex - timeline.cursor;
        if (localIndex < 0 || localIndex >= candles.length) return null;
        const candle = candles[localIndex];
        if (!candle) return null;
        const bias = getPatternMarkerBias(series.name);
        const stackOffset = (seriesIndex % 3) * 5;
        const y =
          bias === "bullish"
            ? yAt(candle.low) + 8 + stackOffset
            : bias === "bearish"
              ? yAt(candle.high) - 8 - stackOffset
              : yAt((candle.high + candle.low) / 2);
        return {
          key: `${series.key}-${point.candleIndex}`,
          label: series.name,
          x: xAt(localIndex),
          y,
          bias,
        };
      })
      .filter((marker): marker is { key: string; label: string; x: number; y: number; bias: "bullish" | "bearish" | "neutral" } => Boolean(marker)),
  );

  const formatXAxisLabel = (index: number) => {
    const labelDate = new Date(candles[index].openTime);
    const sameDayAsStart =
      candles.length > 0 &&
      labelDate.toDateString() === new Date(candles[0].openTime).toDateString();
    if (sameDayAsStart) {
      return labelDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return labelDate.toLocaleString([], { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-base-300/70 bg-base-100/60 px-2 py-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <h4 className="truncate text-sm font-semibold uppercase tracking-wide">{symbol}</h4>
          <span className={`badge ${netPnl >= 0 ? "badge-success" : "badge-error"} badge-outline`}>
            {formatCurrency(netPnl)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-xs btn-outline"
            onClick={() => setZoomIndex((prev) => Math.max(0, prev - 1))}
            disabled={zoomIndex === 0}
            title={zoomOutTitle}
          >
            -
          </button>
          <span className="text-xs opacity-70">
            {zoomLabel} x{zoom.toFixed(2)}
          </span>
          <button
            type="button"
            className="btn btn-xs btn-outline"
            onClick={() => setZoomIndex((prev) => Math.min(zoomSteps.length - 1, prev + 1))}
            disabled={zoomIndex === zoomSteps.length - 1}
            title={zoomInTitle}
          >
            +
          </button>
        </div>
      </div>

      <div
        className="grid overflow-hidden rounded-lg border border-base-300 bg-base-200/60"
        style={{ gridTemplateColumns: `minmax(0,1fr) ${axisOverlayWidth}px` }}
      >
        <div
          ref={sharedScrollRef}
          className="overflow-x-auto"
        >
          <div style={{ width: `${width}px` }}>
            <svg className="h-[320px] w-full" viewBox={`0 0 ${width} ${pricePanelHeight}`} preserveAspectRatio="none">
              {yTicks.map((tick) => (
                <line
                  key={`y-${tick.y}`}
                  x1={padding.left}
                  x2={padding.left + innerWidth}
                  y1={tick.y}
                  y2={tick.y}
                  className="stroke-base-300/30"
                />
              ))}

              {xTickIndexes.map((index) => {
                const x = xAt(index);
                return <line key={`x-grid-${candles[index].candleIndex}`} x1={x} x2={x} y1={padding.top} y2={padding.top + innerHeight} className="stroke-base-300/20" />;
              })}

              {tradeSegments.map((segment, index) => {
                const xStart = xAt(segment.start) - barWidth / 2;
                const xEnd = xAt(segment.end) + barWidth / 2;
                return (
                  <rect
                    key={`trade-bg-${index}`}
                    x={xStart}
                    y={padding.top}
                    width={Math.max(1, xEnd - xStart)}
                    height={innerHeight}
                    className={segment.profit ? "fill-success/10" : "fill-error/10"}
                  />
                );
              })}

              {candles.map((candle, index) => {
                const x = xAt(index);
                const yOpen = yAt(candle.open);
                const yClose = yAt(candle.close);
                const yHigh = yAt(candle.high);
                const yLow = yAt(candle.low);
                const bodyTop = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(1, Math.abs(yOpen - yClose));
                const bullish = candle.close >= candle.open;
                const bodyWidth = Math.max(1.4, barWidth * 0.55);

                return (
                  <g key={`candle-${candle.candleIndex}`}>
                    <line x1={x} x2={x} y1={yHigh} y2={yLow} className={bullish ? "stroke-success/70" : "stroke-error/70"} />
                    <rect
                      x={x - bodyWidth / 2}
                      y={bodyTop}
                      width={bodyWidth}
                      height={bodyHeight}
                      className={bullish ? "fill-success/70" : "fill-error/70"}
                    />
                  </g>
                );
              })}

              {priceIndicators.map((series, seriesIndex) => {
                const palette = ["text-info", "text-warning", "text-secondary", "text-accent"];
                const points = series.points
                  .map((point) => {
                    if (typeof point.value !== "number") return null;
                    const localIndex = point.candleIndex - timeline.cursor;
                    if (localIndex < 0 || localIndex >= candles.length) return null;
                    return `${xAt(localIndex)},${yAt(point.value)}`;
                  })
                  .filter((point): point is string => Boolean(point))
                  .join(" ");

                if (!points) return null;
                return (
                  <polyline
                    key={series.key}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className={palette[seriesIndex % palette.length]}
                    points={points}
                  />
                );
              })}

              {patternMarkers.map((marker) => {
                if (marker.bias === "bullish") {
                  return (
                    <polygon
                      key={marker.key}
                      points={`${marker.x},${marker.y - 5} ${marker.x - 4},${marker.y + 3} ${marker.x + 4},${marker.y + 3}`}
                      fill="currentColor"
                      className="text-success"
                    >
                      <title>{marker.label}</title>
                    </polygon>
                  );
                }
                if (marker.bias === "bearish") {
                  return (
                    <polygon
                      key={marker.key}
                      points={`${marker.x},${marker.y + 5} ${marker.x - 4},${marker.y - 3} ${marker.x + 4},${marker.y - 3}`}
                      fill="currentColor"
                      className="text-error"
                    >
                      <title>{marker.label}</title>
                    </polygon>
                  );
                }
                return (
                  <circle key={marker.key} cx={marker.x} cy={marker.y} r={3.2} className="fill-warning" stroke="currentColor">
                    <title>{marker.label}</title>
                  </circle>
                );
              })}

              {tradeSegments.map((segment, index) => {
                const x1 = xAt(segment.start);
                const y1 = yAt(segment.entryPrice);
                const x2 = xAt(segment.end);
                const y2 = yAt(segment.exitPrice);
                return (
                  <line
                    key={`segment-${index}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className={segment.profit ? "stroke-success/70" : "stroke-error/70"}
                    strokeDasharray="2 3"
                  />
                );
              })}

              {tradeSegments.map((segment, index) => {
                const xStart = xAt(segment.start);
                const yStart = yAt(segment.entryPrice);
                const xEnd = xAt(segment.end);
                const yEnd = yAt(segment.exitPrice);
                const exitColor = segment.profit ? "text-success" : "text-error";
                const entryColor = segment.side === "LONG" ? "text-success" : "text-error";
                return (
                  <g key={`trade-markers-${index}`}>
                    {segment.side === "LONG" ? (
                      <polygon
                        points={`${xStart},${yStart - 5} ${xStart - 4},${yStart + 3} ${xStart + 4},${yStart + 3}`}
                        fill="currentColor"
                        className={entryColor}
                      />
                    ) : (
                      <polygon
                        points={`${xStart},${yStart + 5} ${xStart - 4},${yStart - 3} ${xStart + 4},${yStart - 3}`}
                        fill="currentColor"
                        className={entryColor}
                      />
                    )}
                    <rect x={xEnd - 3.5} y={yEnd - 3.5} width={7} height={7} fill="currentColor" className={exitColor} />
                  </g>
                );
              })}

              {lifecycleEvents.map((event) => {
                const localIndex = event.candleIndex - timeline.cursor;
                if (localIndex < 0 || localIndex >= candles.length) return null;
                const x = xAt(localIndex);
                const y = yAt(event.price);

                if (event.type === "DCA") {
                  return (
                    <polygon
                      key={event.id}
                      points={`${x},${y - 6} ${x - 5},${y + 4} ${x + 5},${y + 4}`}
                      fill="currentColor"
                      className="text-info"
                    />
                  );
                }

                return null;
              })}

              {playbackX != null ? (
                <line
                  x1={playbackX}
                  x2={playbackX}
                  y1={padding.top}
                  y2={padding.top + innerHeight}
                  className="stroke-primary/80"
                  strokeDasharray="4 4"
                />
              ) : null}
            </svg>

            {oscillatorPanels.map((panel) => (
              <svg
                key={panel.key}
                className="h-[100px] w-full border-t border-base-300/50"
                viewBox={`0 0 ${width} ${oscillatorPanelHeight}`}
                preserveAspectRatio="none"
              >
                {panel.localYTicks.map((tick) => (
                  <line
                    key={`${panel.key}-y-${tick.y}`}
                    x1={padding.left}
                    x2={padding.left + innerWidth}
                    y1={tick.y}
                    y2={tick.y}
                    className="stroke-base-300/30"
                  />
                ))}
                {xTickIndexes.map((index) => {
                  const x = xAt(index);
                  return (
                    <line
                      key={`${panel.key}-x-grid-${candles[index].candleIndex}`}
                      x1={x}
                      x2={x}
                      y1={0}
                      y2={oscillatorPanelHeight}
                      className="stroke-base-300/20"
                    />
                  );
                })}
                <text x={padding.left + 2} y={10} textAnchor="start" className="fill-base-content/70 text-[9px] font-medium">
                  {panel.title}
                </text>

                {tradeSegments.map((segment, index) => {
                  const xStart = xAt(segment.start) - barWidth / 2;
                  const xEnd = xAt(segment.end) + barWidth / 2;
                  return (
                    <rect
                      key={`osc-bg-${panel.key}-${index}`}
                      x={xStart}
                      y={0}
                      width={Math.max(1, xEnd - xStart)}
                      height={oscillatorPanelHeight}
                      className={segment.profit ? "fill-success/10" : "fill-error/10"}
                    />
                  );
                })}

                {panel.title.includes("RSI") && rsiLongLevel != null ? (
                  <line
                    x1={padding.left}
                    x2={padding.left + innerWidth}
                    y1={panel.levelToY(rsiLongLevel)}
                    y2={panel.levelToY(rsiLongLevel)}
                    className="stroke-success/70"
                    strokeDasharray="3 3"
                  />
                ) : null}
                {panel.title.includes("RSI") && rsiShortLevel != null ? (
                  <line
                    x1={padding.left}
                    x2={padding.left + innerWidth}
                    y1={panel.levelToY(rsiShortLevel)}
                    y2={panel.levelToY(rsiShortLevel)}
                    className="stroke-error/70"
                    strokeDasharray="3 3"
                  />
                ) : null}

                {panel.lines.map((line) => (
                  <polyline
                    key={line.key}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className={line.className}
                    points={line.points}
                  />
                ))}

                {playbackX != null ? (
                  <line
                    x1={playbackX}
                    x2={playbackX}
                    y1={0}
                    y2={oscillatorPanelHeight}
                    className="stroke-primary/70"
                    strokeDasharray="4 4"
                  />
                ) : null}
              </svg>
            ))}

            <svg className="h-[24px] w-full border-t border-base-300/50 bg-base-100/40" viewBox={`0 0 ${width} ${xAxisHeight}`} preserveAspectRatio="none">
              {xTickIndexes.map((index) => {
                const isFirst = index === 0;
                const isLast = index === candles.length - 1;
                const x = isFirst ? padding.left : isLast ? padding.left + innerWidth : xAt(index);
                const anchor: "start" | "middle" | "end" = isFirst ? "start" : isLast ? "end" : "middle";

                return (
                  <g key={`x-label-${candles[index].candleIndex}`}>
                    <line x1={x} x2={x} y1={0} y2={4} className="stroke-base-300/40" />
                    <text x={x} y={xAxisHeight - 6} textAnchor={anchor} className="fill-base-content/60 text-[9px]">
                      {formatXAxisLabel(index)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="pointer-events-none border-l border-base-300 bg-base-100/95">
          <svg className="h-[320px] w-full" viewBox={`0 0 ${axisOverlayWidth} ${pricePanelHeight}`} preserveAspectRatio="none">
            {yTicks.map((tick) => (
              <g key={`price-axis-${tick.y}`}>
                <line x1={0} x2={8} y1={tick.y} y2={tick.y} className="stroke-base-300/50" />
                <text x={10} y={tick.y + 3} textAnchor="start" className="fill-base-content/70 text-[9px]">
                  {formatNumber(tick.value)}
                </text>
              </g>
            ))}
          </svg>

          {oscillatorPanels.map((panel) => (
            <svg
              key={`axis-${panel.key}`}
              className="h-[100px] w-full border-t border-base-300/50"
              viewBox={`0 0 ${axisOverlayWidth} ${oscillatorPanelHeight}`}
              preserveAspectRatio="none"
            >
              {panel.localYTicks.map((tick) => (
                <g key={`axis-${panel.key}-y-${tick.y}`}>
                  <line x1={0} x2={8} y1={tick.y} y2={tick.y} className="stroke-base-300/50" />
                  <text x={10} y={tick.y + 3} textAnchor="start" className="fill-base-content/65 text-[9px]">
                    {formatNumber(tick.value)}
                  </text>
                </g>
              ))}
            </svg>
          ))}

          <div className="h-[24px] border-t border-base-300/50" />
        </div>
      </div>
    </div>
  );
}
