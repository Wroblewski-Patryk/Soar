import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { LuCircleDot, LuSquare } from 'react-icons/lu';

import { normalizeSymbol } from '@/lib/symbols';
import { EmptyState } from '@/ui/components/ViewState';
import { buildPairStatsMetricDisplay } from '../utils/pairStatsMetricDisplay';
import { buildBacktestSymbolStats, type BacktestSymbolStats } from '../utils/backtestSymbolStats';
import {
  buildSyntheticTradesFromTimelineEvents,
  filterTradesByTimelineWindow,
  formatHoldDuration,
  getExitReasonLabel,
  type DailyPerformancePoint,
  type StrategyIndicatorMeta,
} from '../utils/backtestRunDetailsViewModel';
import {
  SummaryBalanceChart,
  SummaryDailyPnlChart,
  TimelineCandlesChart,
} from './backtestRunDetailsCharts';
import type { BacktestRunDetailsCopy } from './backtestRunDetails.copy';
import type { BacktestRun, BacktestReport, BacktestTrade } from '../types/backtest.type';
import type { BacktestRunDetailsTab, BacktestTimelineState } from '../hooks/useBacktestTimelineOrchestration';
import type { BacktestTradeInsights, BacktestTradeTimelineRow } from '../hooks/useBacktestTradesAnalytics';

type BacktestSummaryMetrics = {
  initialBalance?: number;
  endBalance?: number;
  lifecycleEventCounts?: {
    DCA?: number;
  };
  parityDiagnostics?: Array<{
    symbol?: string;
    status?: 'PROCESSED' | 'FAILED';
    error?: string | null;
  }>;
} | null;

type BacktestRunDetailsTabPanelsProps = {
  activeTab: BacktestRunDetailsTab;
  setActiveTab: Dispatch<SetStateAction<BacktestRunDetailsTab>>;
  copy: BacktestRunDetailsCopy;
  report: BacktestReport | null;
  run: BacktestRun;
  summaryMetrics: BacktestSummaryMetrics;
  dailyPerformance: DailyPerformancePoint[];
  symbolStats: BacktestSymbolStats[];
  symbolSectionRefs: MutableRefObject<Record<string, HTMLElement | null>>;
  timelines: Record<string, BacktestTimelineState>;
  tradesBySymbol: Map<string, BacktestTrade[]>;
  parityDiagnosticsBySymbol: Map<string, { status: 'PROCESSED' | 'FAILED'; error: string | null }>;
  indicatorMeta: StrategyIndicatorMeta;
  trades: BacktestTrade[];
  tradeInsights: BacktestTradeInsights | null;
  tradesTimelineRows: BacktestTradeTimelineRow[];
  formatCurrency: (value: number | null | undefined) => string;
  formatDateTime: (value: string | null | undefined) => string;
  formatNumber: (value: number | null | undefined) => string;
  formatPercent: (value: number | null | undefined) => string;
  pnlClass: (value: number | null) => string;
};

const defaultTimelineState: BacktestTimelineState = {
  data: null,
  loading: false,
  loadingPhase: null,
  candlesNextCursor: null,
  eventsNextCursor: null,
  candlesLoaded: false,
  eventsLoaded: false,
  error: null,
};

export function BacktestRunDetailsTabPanels({
  activeTab,
  setActiveTab,
  copy,
  report,
  run,
  summaryMetrics,
  dailyPerformance,
  symbolStats,
  symbolSectionRefs,
  timelines,
  tradesBySymbol,
  parityDiagnosticsBySymbol,
  indicatorMeta,
  trades,
  tradeInsights,
  tradesTimelineRows,
  formatCurrency,
  formatDateTime,
  formatNumber,
  formatPercent,
  pnlClass,
}: BacktestRunDetailsTabPanelsProps) {
  return (
    <section className='rounded-box border border-base-300/60 bg-base-100/80 p-4'>
      <div role='tablist' className='tabs tabs-boxed'>
        <button
          type='button'
          className={`tab ${activeTab === 'summary' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          {copy.tabSummary}
        </button>
        <button
          type='button'
          className={`tab ${activeTab === 'markets' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('markets')}
        >
          {copy.tabMarkets}
        </button>
        <button
          type='button'
          className={`tab ${activeTab === 'trades' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('trades')}
        >
          {copy.tabTrades}
        </button>
        <button
          type='button'
          className={`tab ${activeTab === 'raw' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          {copy.tabRaw}
        </button>
      </div>

      {activeTab === 'summary' ? (
        <div className='mt-4 space-y-3'>
          {!report ? (
            <EmptyState
              title={copy.reportNotReadyTitle}
              description={copy.reportNotReadyDescription}
            />
          ) : (
            <>
              <div className='grid gap-2 md:grid-cols-2 xl:grid-cols-6'>
                <div className='rounded-box border border-base-300/60 bg-base-200/55 p-3'>
                  <p className='text-xs uppercase tracking-wide opacity-70'>{copy.summaryNetPnl}</p>
                  <p className={`mt-1 text-2xl font-semibold ${pnlClass(report.netPnl)}`}>{formatCurrency(report.netPnl)}</p>
                </div>
                <div className='rounded-box border border-base-300/60 bg-base-200/55 p-3'>
                  <p className='text-xs uppercase tracking-wide opacity-70'>{copy.summaryWinRate}</p>
                  <p className='mt-1 text-2xl font-semibold'>{formatPercent(report.winRate)}</p>
                </div>
                <div className='rounded-box border border-base-300/60 bg-base-200/55 p-3'>
                  <p className='text-xs uppercase tracking-wide opacity-70'>{copy.summaryTrades}</p>
                  <p className='mt-1 text-2xl font-semibold'>{formatNumber(report.totalTrades)}</p>
                </div>
                <div className='rounded-box border border-base-300/60 bg-base-200/55 p-3'>
                  <p className='text-xs uppercase tracking-wide opacity-70'>{copy.summaryMaxDrawdown}</p>
                  <p className='mt-1 text-2xl font-semibold'>{formatPercent(report.maxDrawdown)}</p>
                </div>
                <div className='rounded-box border border-base-300/60 bg-base-200/55 p-3'>
                  <p className='text-xs uppercase tracking-wide opacity-70'>{copy.summaryStartBalance}</p>
                  <p className='mt-1 text-2xl font-semibold'>{formatCurrency(summaryMetrics?.initialBalance ?? 0)}</p>
                </div>
                <div className='rounded-box border border-base-300/60 bg-base-200/55 p-3'>
                  <p className='text-xs uppercase tracking-wide opacity-70'>{copy.summaryEndBalance}</p>
                  <p className='mt-1 text-2xl font-semibold'>{formatCurrency(summaryMetrics?.endBalance ?? 0)}</p>
                </div>
              </div>

              <div className='grid gap-3 xl:grid-cols-2'>
                <div className='rounded-box border border-base-300/60 bg-base-200/55 p-3'>
                  <p className='text-sm font-medium'>{copy.summaryDailyPnlTitle}</p>
                  <SummaryDailyPnlChart
                    points={dailyPerformance}
                    formatCurrency={formatCurrency}
                    emptyText={copy.summaryDailyPnlNoData}
                  />
                </div>
                <div className='rounded-box border border-base-300/60 bg-base-200/55 p-3'>
                  <p className='text-sm font-medium'>{copy.summaryBalanceTitle}</p>
                  <SummaryBalanceChart
                    points={dailyPerformance}
                    formatCurrency={formatCurrency}
                    emptyText={copy.summaryBalanceNoData}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      ) : null}

      {activeTab === 'markets' ? (
        <div className='mt-4 space-y-4'>
          {symbolStats.length === 0 ? (
            <EmptyState
              title={copy.marketsEmptyTitle}
              description={copy.marketsEmptyDescription}
            />
          ) : (
            <>
              <div className='rounded-box border border-base-300/60 bg-base-200/55 p-3'>
                <h4 className='mb-2 text-sm font-semibold'>{copy.globalLegendTitle}</h4>
                <div className='flex flex-wrap items-center gap-4 text-xs text-base-content/75'>
                  <span className='inline-flex items-center gap-1'>
                    <span className='inline-block h-0 w-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-success' />
                    {copy.legendEntryLong}
                  </span>
                  <span className='inline-flex items-center gap-1'>
                    <span className='inline-block h-0 w-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-error' />
                    {copy.legendEntryShort}
                  </span>
                  <span className='inline-flex items-center gap-1'>
                    <LuSquare className='h-3.5 w-3.5 text-success' />
                    {copy.legendExitProfit}
                  </span>
                  <span className='inline-flex items-center gap-1'>
                    <LuSquare className='h-3.5 w-3.5 text-error' />
                    {copy.legendExitLoss}
                  </span>
                  <span className='inline-flex items-center gap-1'>
                    <LuCircleDot className='h-3.5 w-3.5 text-info' />
                    {copy.legendDca}
                  </span>
                </div>
              </div>

              {symbolStats.map((stats) => {
                const timelineState = timelines[stats.symbol] ?? defaultTimelineState;
                const timeline = timelineState.data;
                const symbolTrades = tradesBySymbol.get(stats.symbol) ?? [];
                const visibleTrades = timeline ? filterTradesByTimelineWindow(symbolTrades, timeline) : symbolTrades;
                const timelineDerivedTrades =
                  timeline && timelineState.eventsLoaded
                    ? buildSyntheticTradesFromTimelineEvents(
                        (Array.isArray(timeline.events) ? timeline.events : []).filter((event) =>
                          event.tradeId.includes(`_${stats.symbol}_`),
                        ),
                        stats.symbol,
                      )
                    : [];
                const visibleTradesForStats = timelineDerivedTrades.length > 0 ? timelineDerivedTrades : visibleTrades;
                const visibleStats =
                  buildBacktestSymbolStats(visibleTradesForStats, [stats.symbol])[0] ?? stats;
                const tradesMetricDisplay = buildPairStatsMetricDisplay({
                  visibleValue: visibleStats.tradesCount,
                  totalValue: stats.tradesCount,
                  formatValue: formatNumber,
                  differenceTolerance: 0,
                });
                const pnlMetricDisplay = buildPairStatsMetricDisplay({
                  visibleValue: visibleStats.netPnl,
                  totalValue: stats.netPnl,
                  formatValue: formatCurrency,
                  differenceTolerance: 0.000001,
                });
                const visibleFinalCandleClosures = visibleTradesForStats.filter((trade) => trade.exitReason === 'FINAL_CANDLE').length;
                const visibleLiquidations = visibleTradesForStats.filter(
                  (trade) => trade.exitReason === 'LIQUIDATION' || trade.liquidated,
                ).length;
                const visibleLifecycleCounts = (Array.isArray(timeline?.events) ? timeline.events : []).reduce<Record<string, number>>((acc, event) => {
                  acc[event.type] = (acc[event.type] ?? 0) + 1;
                  return acc;
                }, {});
                const timelineCandles = Array.isArray(timeline?.candles) ? timeline.candles : [];
                const candlePrices = timelineCandles.flatMap((candle) => [candle.low, candle.high]);
                const timelineMinPrice = candlePrices.length > 0 ? Math.min(...candlePrices) : null;
                const timelineMaxPrice = candlePrices.length > 0 ? Math.max(...candlePrices) : null;
                const timelineWindowStart = timelineCandles.length > 0 ? timelineCandles[0].openTime : null;
                const timelineWindowEnd = timelineCandles.length > 0 ? timelineCandles[timelineCandles.length - 1].closeTime : null;
                const parity = parityDiagnosticsBySymbol.get(normalizeSymbol(stats.symbol));
                const parityFailed = Boolean(parity && parity.status !== 'PROCESSED');

                return (
                  <article
                    key={stats.symbol}
                    ref={(node) => {
                      symbolSectionRefs.current[stats.symbol] = node;
                    }}
                    className='rounded-xl border border-base-300 bg-base-100 p-3'
                  >
                    <div className='grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]'>
                      <div className='space-y-3'>
                        {timelineState.loading && !timeline ? <p className='text-sm opacity-70'>{copy.timelineLoading}</p> : null}
                        {timelineState.loading && timeline ? (
                          <p className='text-xs opacity-70'>
                            {copy.timelineLoadingPrefix}{' '}
                            {timelineState.loadingPhase === 'events' ? copy.timelineLoadingPhaseEvents : copy.timelineLoadingPhaseCandles}
                            ...
                          </p>
                        ) : null}
                        {timelineState.error ? <p className='text-sm text-error'>{timelineState.error}</p> : null}
                        {timeline ? (
                          <TimelineCandlesChart
                            timeline={timeline}
                            trades={visibleTrades}
                            symbol={stats.symbol}
                            netPnl={stats.netPnl}
                            formatCurrency={formatCurrency}
                            formatNumber={formatNumber}
                            rsiLongLevel={indicatorMeta.rsiLongLevel}
                            rsiShortLevel={indicatorMeta.rsiShortLevel}
                            eventsLoaded={timelineState.eventsLoaded}
                            noCandlesText={copy.timelineNoCandles}
                            zoomLabel={copy.zoom}
                            zoomOutTitle={copy.zoomOutTitle}
                            zoomInTitle={copy.zoomInTitle}
                          />
                        ) : (
                          <div className='h-[320px] w-full animate-pulse rounded-lg bg-base-200/60' />
                        )}
                      </div>

                      <aside className='rounded-box border border-base-300/60 bg-base-200/55 p-3 text-sm'>
                        <h4 className='font-semibold'>{copy.pairStatsTitle}</h4>
                        {parityFailed ? (
                          <div className='mt-2 rounded-md border border-error/40 bg-error/10 p-2'>
                            <p className='text-xs font-medium text-error'>{copy.parityFailed}</p>
                            {parity?.error ? <p className='mt-1 text-xs text-error/90'>{parity.error}</p> : null}
                          </div>
                        ) : null}

                        <div className='mt-3 grid grid-cols-2 gap-2'>
                          <div className='rounded-md border border-base-300 bg-base-100/70 p-2'>
                            <p className='text-[10px] uppercase tracking-wide opacity-65'>{copy.trades}</p>
                            <p className='mt-1 text-base font-semibold'>{tradesMetricDisplay.primary}</p>
                            <p className='mt-0.5 text-[10px] opacity-60'>{copy.runTotalValue}</p>
                            {tradesMetricDisplay.chartWindow ? (
                              <p className='mt-0.5 text-[10px] opacity-60'>
                                {copy.chartWindowValue}: {tradesMetricDisplay.chartWindow}
                              </p>
                            ) : null}
                          </div>
                          <div className='rounded-md border border-base-300 bg-base-100/70 p-2'>
                            <p className='text-[10px] uppercase tracking-wide opacity-65'>{copy.winRate}</p>
                            <p className='mt-1 text-base font-semibold'>{formatPercent(visibleStats.winRate)}</p>
                            <p className='mt-0.5 text-[10px] opacity-60'>{visibleStats.wins}/{visibleStats.losses} W/L</p>
                          </div>
                          <div className='rounded-md border border-base-300 bg-base-100/70 p-2'>
                            <p className='text-[10px] uppercase tracking-wide opacity-65'>{copy.pnl}</p>
                            <p className={`mt-1 text-base font-semibold ${pnlClass(stats.netPnl)}`}>
                              {pnlMetricDisplay.primary}
                            </p>
                            <p className='mt-0.5 text-[10px] opacity-60'>{copy.runTotalValue}</p>
                            {pnlMetricDisplay.chartWindow ? (
                              <p className='mt-0.5 text-[10px] opacity-60'>
                                {copy.chartWindowValue}: {pnlMetricDisplay.chartWindow}
                              </p>
                            ) : null}
                          </div>
                          <div className='rounded-md border border-base-300 bg-base-100/70 p-2'>
                            <p className='text-[10px] uppercase tracking-wide opacity-65'>{copy.avgHold}</p>
                            <p className='mt-1 text-base font-semibold'>{formatNumber(visibleStats.avgHoldMinutes)} min</p>
                          </div>
                        </div>

                        <div className='mt-3 space-y-3'>
                          <section className='rounded-md border border-base-300 bg-base-100/60 p-2'>
                            <h5 className='text-xs font-semibold uppercase tracking-wide opacity-70'>{copy.executionTitle}</h5>
                            <div className='mt-1 space-y-1 text-xs'>
                              <p className='flex items-center justify-between gap-2'>
                                <span className='opacity-70'>{copy.avgEntry}</span>
                                <span className='font-medium'>{formatNumber(visibleStats.avgEntry)}</span>
                              </p>
                              <p className='flex items-center justify-between gap-2'>
                                <span className='opacity-70'>{copy.avgExit}</span>
                                <span className='font-medium'>{formatNumber(visibleStats.avgExit)}</span>
                              </p>
                              <p className='flex items-center justify-between gap-2'>
                                <span className='opacity-70'>{copy.dca}</span>
                                <span className='font-medium'>{formatNumber(visibleLifecycleCounts.DCA ?? 0)}</span>
                              </p>
                              <p className='flex items-center justify-between gap-2'>
                                <span className='opacity-70'>{copy.closedOnLastCandle}</span>
                                <span className='font-medium'>{formatNumber(visibleFinalCandleClosures)}</span>
                              </p>
                              <p className='flex items-center justify-between gap-2'>
                                <span className='opacity-70'>{copy.liquidations}</span>
                                <span className='font-medium'>{formatNumber(visibleLiquidations)}</span>
                              </p>
                            </div>
                          </section>

                          <section className='rounded-md border border-base-300 bg-base-100/60 p-2'>
                            <h5 className='text-xs font-semibold uppercase tracking-wide opacity-70'>{copy.dataRangeTitle}</h5>
                            <div className='mt-1 space-y-1 text-xs'>
                              <p>
                                <span className='opacity-70'>{copy.tradesRange}</span>{' '}
                                <span className='font-medium'>
                                  {visibleStats.firstAt ? formatDateTime(new Date(visibleStats.firstAt).toISOString()) : copy.dash} -{' '}
                                  {visibleStats.lastAt ? formatDateTime(new Date(visibleStats.lastAt).toISOString()) : copy.dash}
                                </span>
                              </p>
                              <p>
                                <span className='opacity-70'>{copy.candlesRange}</span>{' '}
                                <span className='font-medium'>
                                  {timelineWindowStart ? formatDateTime(new Date(timelineWindowStart).toISOString()) : copy.dash} -{' '}
                                  {timelineWindowEnd ? formatDateTime(new Date(timelineWindowEnd).toISOString()) : copy.dash}
                                </span>
                              </p>
                              <p>
                                <span className='opacity-70'>{copy.chartMinMax}</span>{' '}
                                <span className='font-medium'>
                                  {timelineMinPrice != null && timelineMaxPrice != null
                                    ? `${formatNumber(timelineMinPrice)} / ${formatNumber(timelineMaxPrice)}`
                                    : copy.dash}
                                </span>
                              </p>
                            </div>
                          </section>
                        </div>

                        <div className='divider my-2' />
                        <h5 className='font-semibold'>{copy.indicatorsTitle}</h5>
                        {indicatorMeta.names.length > 0 ? (
                          <div className='mt-2 flex flex-wrap gap-1.5'>
                            {indicatorMeta.names.map((name) => (
                              <span key={`${stats.symbol}-${name}`} className='badge badge-outline badge-sm'>
                                {name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className='mt-1 text-xs opacity-70'>{copy.noIndicators}</p>
                        )}
                      </aside>
                    </div>
                  </article>
                );
              })}
            </>
          )}
        </div>
      ) : null}

      {activeTab === 'trades' ? (
        <div className='mt-4'>
          {trades.length === 0 ? (
            <EmptyState title={copy.noTradesTitle} description={copy.noTradesDescription} />
          ) : (
            <div className='space-y-3'>
              {tradeInsights ? (
                <div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-4'>
                  <div className='rounded-md border border-base-300 bg-base-200 p-2'>
                    <p className='text-[10px] uppercase tracking-wide opacity-65'>{copy.netPnl}</p>
                    <p className={`mt-1 text-sm font-semibold ${pnlClass(tradeInsights.finalCumulative)}`}>
                      {formatCurrency(tradeInsights.finalCumulative)}
                    </p>
                  </div>
                  <div className='rounded-md border border-base-300 bg-base-200 p-2'>
                    <p className='text-[10px] uppercase tracking-wide opacity-65'>{copy.totalProfit}</p>
                    <p className='mt-1 text-sm font-semibold text-success'>{formatCurrency(tradeInsights.grossProfit)}</p>
                  </div>
                  <div className='rounded-md border border-base-300 bg-base-200 p-2'>
                    <p className='text-[10px] uppercase tracking-wide opacity-65'>{copy.totalLoss}</p>
                    <p className='mt-1 text-sm font-semibold text-error'>{formatCurrency(tradeInsights.grossLoss)}</p>
                  </div>
                  <div className='rounded-md border border-base-300 bg-base-200 p-2'>
                    <p className='text-[10px] uppercase tracking-wide opacity-65'>{copy.extremes}</p>
                    <div className='mt-1 space-y-0.5 text-xs'>
                      <p className='flex items-center justify-between gap-2'>
                        <span className='opacity-70'>{copy.biggestWin}</span>
                        <span className='font-semibold text-success'>
                          {tradeInsights.hasWins ? formatCurrency(tradeInsights.maxWin) : copy.dash}
                        </span>
                      </p>
                      <p className='flex items-center justify-between gap-2'>
                        <span className='opacity-70'>{copy.biggestLoss}</span>
                        <span className='font-semibold text-error'>
                          {tradeInsights.hasLosses ? formatCurrency(tradeInsights.maxLoss) : copy.dash}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className='overflow-x-auto rounded-lg border border-base-300'>
                <table className='table table-zebra table-sm'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{copy.colSymbol}</th>
                      <th>{copy.colSide}</th>
                      <th>{copy.colOpen}</th>
                      <th>{copy.colClose}</th>
                      <th>{copy.colDuration}</th>
                      <th>{copy.colQty}</th>
                      <th>{copy.colDca}</th>
                      <th>{copy.colEntry}</th>
                      <th>{copy.colExit}</th>
                      <th>{copy.colNotionalEntry}</th>
                      <th>{copy.colNotionalExit}</th>
                      <th>{copy.colMarginEntry}</th>
                      <th>{copy.colMarginExit}</th>
                      <th>{copy.colMoveSide}</th>
                      <th>{copy.colPnlNotional}</th>
                      <th>{copy.colPnlMargin}</th>
                      <th>{copy.colFee}</th>
                      <th>{copy.colExitReason}</th>
                      <th>{copy.colPnl}</th>
                      <th>{copy.colCumPnl}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradesTimelineRows.map((row) => (
                      <tr key={row.trade.id} className={row.trade.pnl < 0 && Math.abs(row.trade.pnl) > Math.abs(row.cumulativePnl) * 0.25 ? 'bg-error/5' : ''}>
                        <td className='opacity-70'>{row.index}</td>
                        <td className='font-medium'>{row.trade.symbol}</td>
                        <td>
                          <span className={`badge badge-xs ${row.trade.side === 'LONG' ? 'badge-success' : 'badge-error'} badge-outline`}>
                            {row.trade.side}
                          </span>
                        </td>
                        <td>{formatDateTime(new Date(row.trade.openedAt).toISOString())}</td>
                        <td>{formatDateTime(new Date(row.trade.closedAt).toISOString())}</td>
                        <td>{formatHoldDuration(row.holdMinutes)}</td>
                        <td>{formatNumber(row.trade.quantity)}</td>
                        <td>
                          {row.dcaKnownFromTimeline ? (
                            <span className={`badge badge-xs ${row.dcaCount > 0 ? 'badge-info' : 'badge-ghost'}`}>
                              {row.dcaCount}
                            </span>
                          ) : (
                            <span className='opacity-60'>-</span>
                          )}
                        </td>
                        <td>{formatNumber(row.trade.entryPrice)}</td>
                        <td>{formatNumber(row.trade.exitPrice)}</td>
                        <td>{formatCurrency(row.entryNotional)}</td>
                        <td>{formatCurrency(row.exitNotional)}</td>
                        <td>{formatCurrency(row.entryMargin)}</td>
                        <td>{formatCurrency(row.exitMargin)}</td>
                        <td className={pnlClass(row.sidePriceMovePct)}>
                          {row.sidePriceMovePct == null ? '-' : formatPercent(row.sidePriceMovePct)}
                        </td>
                        <td className={pnlClass(row.pnlPctOnNotional)}>
                          {row.pnlPctOnNotional == null ? '-' : formatPercent(row.pnlPctOnNotional)}
                        </td>
                        <td className={pnlClass(row.pnlPctOnMargin)}>
                          {row.pnlPctOnMargin == null ? '-' : formatPercent(row.pnlPctOnMargin)}
                        </td>
                        <td>{row.trade.fee == null ? '-' : formatCurrency(row.trade.fee)}</td>
                        <td>
                          <span
                            className={`badge badge-xs ${
                              row.trade.exitReason === 'LIQUIDATION'
                                ? 'badge-error'
                                : row.trade.exitReason === 'FINAL_CANDLE'
                                  ? 'badge-warning'
                                  : 'badge-ghost'
                            }`}
                          >
                            {getExitReasonLabel(row.trade.exitReason ?? 'SIGNAL_EXIT', copy)}
                          </span>
                        </td>
                        <td className={pnlClass(row.trade.pnl)}>{formatCurrency(row.trade.pnl)}</td>
                        <td className={pnlClass(row.cumulativePnl)}>{formatCurrency(row.cumulativePnl)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {activeTab === 'raw' ? (
        <pre className='mockup-code mt-4 whitespace-pre-wrap text-xs'>
          {JSON.stringify({ run, report, trades: trades.slice(0, 50), timelines }, null, 2)}
        </pre>
      ) : null}
    </section>
  );
}
