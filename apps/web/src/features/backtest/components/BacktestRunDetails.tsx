'use client';

import { useMemo, useRef, useState } from 'react';
import { LuChartLine, LuDatabase, LuListChecks, LuLoaderCircle, LuShieldCheck } from 'react-icons/lu';
import { BacktestRun } from '../types/backtest.type';
import { EmptyState, ErrorState } from '@/ui/components/ViewState';
import { SkeletonCardBlock, SkeletonKpiRow, SkeletonTableRows } from '@/ui/components/loading';
import { useLocaleFormatting } from '@/i18n/useLocaleFormatting';
import { useI18n } from '../../../i18n/I18nProvider';
import { useBacktestRunCoreData } from '../hooks/useBacktestRunCoreData';
import { useBacktestTimelineOrchestration, type BacktestRunDetailsTab } from '../hooks/useBacktestTimelineOrchestration';
import { useBacktestTradesAnalytics } from '../hooks/useBacktestTradesAnalytics';
import BacktestRunHeaderSection from './BacktestRunHeaderSection';
import { BacktestRunDetailsTabPanels } from './BacktestRunDetailsTabPanels';
import { getBacktestRunDetailsCopy, type BacktestRunDetailsCopy } from './backtestRunDetails.copy';
import { normalizeSymbol } from '@/lib/symbols';
import {
  extractStrategyIndicatorMeta,
} from '../utils/backtestRunDetailsViewModel';

const pnlClass = (value: number | null) => {
  if (value == null) return '';
  if (value > 0) return 'text-success';
  if (value < 0) return 'text-error';
  return '';
};

const runStatusBadgeClass = (status: BacktestRun['status']) => {
  if (status === 'COMPLETED') return 'badge-success';
  if (status === 'RUNNING') return 'badge-info';
  if (status === 'PENDING') return 'badge-warning';
  if (status === 'FAILED' || status === 'CANCELED') return 'badge-error';
  return 'badge-outline';
};

const runStatusLabel = (status: BacktestRun['status'], copy: BacktestRunDetailsCopy) => {
  if (status === 'COMPLETED') return copy.statusCompleted;
  if (status === 'RUNNING') return copy.statusRunning;
  if (status === 'PENDING') return copy.statusPending;
  if (status === 'FAILED') return copy.statusFailed;
  if (status === 'CANCELED') return copy.statusCanceled;
  return status;
};

const runProgressClass = (status: BacktestRun['status']) => {
  if (status === 'COMPLETED') return 'progress-success';
  if (status === 'FAILED' || status === 'CANCELED') return 'progress-error';
  if (status === 'RUNNING') return 'progress-info';
  return 'progress-primary';
};

type BacktestRunDetailsProps = {
  runId: string;
};

type LiveProgress = {
  leverage?: number;
  marginMode?: 'CROSSED' | 'ISOLATED' | 'NONE';
  totalSymbols?: number;
  processedSymbols?: number;
  failedSymbols?: string[];
  liquidations?: number;
  currentSymbol?: string | null;
  totalTrades?: number;
  netPnl?: number;
  grossProfit?: number;
  grossLoss?: number;
  maxDrawdown?: number;
  maxCandlesPerSymbol?: number;
  totalCandlesForSymbol?: number;
  currentCandleIndex?: number;
  currentCandleTime?: string | null;
  lastUpdate?: string;
};

export default function BacktestRunDetails({ runId }: BacktestRunDetailsProps) {
  const { t } = useI18n();
  const { formatCurrency, formatDateTime, formatNumber, formatPercent } = useLocaleFormatting();
  const copy = useMemo(() => getBacktestRunDetailsCopy(t), [t]);
  const [activeTab, setActiveTab] = useState<BacktestRunDetailsTab>('markets');
  const symbolSectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const {
    run,
    report,
    trades,
    runSymbolStats,
    runTradesBySymbol,
    strategy,
    marketUniverseName,
    loading,
    error,
    retry,
  } = useBacktestRunCoreData({
    runId,
    loadErrorDefault: copy.loadErrorDefault,
  });

  const liveProgress = ((run?.seedConfig as { liveProgress?: LiveProgress } | null)?.liveProgress ?? null) as LiveProgress | null;
  const seedConfig = (run?.seedConfig as {
    exchange?: unknown;
    leverage?: unknown;
    marketType?: unknown;
    baseCurrency?: unknown;
  } | null) ?? null;
  const runMarketType = seedConfig?.marketType === 'SPOT' ? 'SPOT' : 'FUTURES';
  const runExchange = typeof seedConfig?.exchange === 'string' && seedConfig.exchange.trim()
    ? seedConfig.exchange.trim().toUpperCase()
    : 'BINANCE';
  const runBaseCurrency = typeof seedConfig?.baseCurrency === 'string' && seedConfig.baseCurrency.trim()
    ? seedConfig.baseCurrency.trim().toUpperCase()
    : 'USDT';
  const leverageFromSeed = Number(seedConfig?.leverage);
  const leverageFromProgress = Number(liveProgress?.leverage);
  const effectiveLeverage =
    runMarketType === 'SPOT'
      ? 1
      : Math.max(
          1,
          Number.isFinite(leverageFromSeed)
            ? leverageFromSeed
            : Number.isFinite(leverageFromProgress)
              ? leverageFromProgress
              : 1,
        );
  const indicatorMeta = useMemo(() => extractStrategyIndicatorMeta(strategy), [strategy]);
  const symbolStats = runSymbolStats;
  const tradesBySymbol = runTradesBySymbol;
  const summaryMetrics = ((report?.metrics ?? null) as {
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
  } | null) ?? null;
  const parityDiagnosticsBySymbol = useMemo(() => {
    const map = new Map<string, { status: 'PROCESSED' | 'FAILED'; error: string | null }>();
    for (const item of summaryMetrics?.parityDiagnostics ?? []) {
      if (!item?.symbol || !item?.status) continue;
      map.set(normalizeSymbol(item.symbol), {
        status: item.status,
        error: item.error ?? null,
      });
    }
    return map;
  }, [summaryMetrics?.parityDiagnostics]);
  const { timelines } = useBacktestTimelineOrchestration({
    runId,
    activeTab,
    symbolStats,
    parityDiagnosticsBySymbol,
    timelineLoadErrorDefault: copy.timelineLoadErrorDefault,
    timelineParityFailedDefault: copy.timelineParityFailedDefault,
  });
  const initialBalance = summaryMetrics?.initialBalance ?? 0;
  const { dailyPerformance, tradesTimelineRows, tradeInsights } = useBacktestTradesAnalytics({
    runId,
    trades,
    timelines,
    effectiveLeverage,
    initialBalance,
  });

  const progress = useMemo(() => {
    if (!run) return 0;
    if (liveProgress?.totalSymbols && liveProgress.totalSymbols > 0) {
      const bySymbols = Math.floor(((liveProgress.processedSymbols ?? 0) / liveProgress.totalSymbols) * 85);
      if (run.status === 'COMPLETED' || run.status === 'FAILED' || run.status === 'CANCELED') return 100;
      return Math.max(5, bySymbols);
    }
    if (run.status === 'PENDING') return 20;
    if (run.status === 'RUNNING') return 60;
    if (run.status === 'COMPLETED') return report ? 100 : 85;
    return 100;
  }, [liveProgress, report, run]);

  const stages = useMemo(
    () => [
      {
        label: copy.stageRunCreated,
        icon: <LuListChecks className='h-4 w-4' />,
        done: Boolean(run),
        active: !run,
      },
      {
        label: copy.stageEngineRunning,
        icon: <LuLoaderCircle className='h-4 w-4' />,
        done: run?.status === 'RUNNING' || run?.status === 'COMPLETED' || run?.status === 'FAILED' || run?.status === 'CANCELED',
        active: run?.status === 'PENDING',
      },
      {
        label: copy.stageTradesReady,
        icon: <LuDatabase className='h-4 w-4' />,
        done: trades.length > 0 || run?.status === 'FAILED' || run?.status === 'CANCELED' || run?.status === 'COMPLETED',
        active: run?.status === 'RUNNING' && trades.length === 0,
      },
      {
        label: copy.stageReportReady,
        icon: <LuChartLine className='h-4 w-4' />,
        done: Boolean(report) || run?.status === 'FAILED' || run?.status === 'CANCELED',
        active: run?.status === 'COMPLETED' && !report,
      },
      {
        label: copy.stageRunFinished,
        icon: <LuShieldCheck className='h-4 w-4' />,
        done: run?.status === 'COMPLETED' || run?.status === 'FAILED' || run?.status === 'CANCELED',
        active: run?.status === 'RUNNING',
      },
    ],
    [copy.stageEngineRunning, copy.stageReportReady, copy.stageRunCreated, copy.stageRunFinished, copy.stageTradesReady, report, run, trades.length]
  );

  if (loading) {
    return (
      <div className='space-y-4'>
        <span className='sr-only'>{copy.loadingTitle}</span>
        <SkeletonKpiRow items={4} />
        <SkeletonCardBlock cards={2} linesPerCard={4} title={false} className='border-base-300/40 bg-base-100/60 p-3' />
        <SkeletonTableRows columns={8} rows={6} title={false} toolbar={false} className='border-base-300/40 bg-base-100/60 p-3' />
      </div>
    );
  }
  if (error) {
    return (
      <ErrorState
        title={copy.loadErrorTitle}
        description={error}
        retryLabel={copy.retry}
        onRetry={retry}
      />
    );
  }
  if (!run) return <EmptyState title={copy.notFoundTitle} description={copy.notFoundDescription} />;

  const runEndLabel =
    run.finishedAt != null
      ? formatDateTime(run.finishedAt)
      : run.status === 'RUNNING' || run.status === 'PENDING'
        ? copy.statusInProgress
        : copy.dash;
  const showProgress = progress > 0 && progress < 100;
  const marketGroupLabel = marketUniverseName ?? copy.custom;
  const preferReportMetrics = run.status === 'COMPLETED' || run.status === 'FAILED' || run.status === 'CANCELED';
  const headlineTrades =
    (preferReportMetrics ? report?.totalTrades : liveProgress?.totalTrades) ??
    (preferReportMetrics ? liveProgress?.totalTrades : report?.totalTrades) ??
    trades.length;
  const headlineNetPnl =
    (preferReportMetrics ? report?.netPnl : liveProgress?.netPnl) ??
    (preferReportMetrics ? liveProgress?.netPnl : report?.netPnl) ??
    null;
  const headlineMetrics = [
    {
      key: 'trades',
      label: copy.trades,
      value: formatNumber(headlineTrades),
      valueClass: '',
    },
    {
      key: 'net',
      label: copy.netPnl,
      value: headlineNetPnl == null ? '-' : formatCurrency(headlineNetPnl),
      valueClass: pnlClass(headlineNetPnl),
    },
    {
      key: 'winrate',
      label: copy.winRate,
      value: report ? formatPercent(report.winRate) : '-',
      valueClass: '',
    },
    {
      key: 'drawdown',
      label: copy.maxDrawdown,
      value: report ? formatPercent(report.maxDrawdown) : '-',
      valueClass: '',
    },
  ];
  return (
    <div className='space-y-4'>
      <BacktestRunHeaderSection
        runName={run.name}
        runPreviewLabel={copy.runPreview}
        runStatusClassName={runStatusBadgeClass(run.status)}
        runStatusLabel={runStatusLabel(run.status, copy)}
        marketGroupLabelText={copy.marketGroup}
        marketGroupValue={marketGroupLabel}
        strategyLabelText={copy.strategy}
        strategyValue={strategy?.name ?? copy.dash}
        venueContextLabelText={copy.venueContext}
        venueContextValue={`${runExchange} / ${runMarketType} / ${runBaseCurrency}`}
        calcStartLabelText={copy.calcStart}
        calcStartValue={formatDateTime(run.startedAt)}
        calcEndLabelText={copy.calcEnd}
        calcEndValue={runEndLabel}
        showProgress={showProgress}
        progressLabel={copy.progressTitle}
        progressValue={progress}
        progressClassName={runProgressClass(run.status)}
        headlineMetrics={liveProgress || report ? headlineMetrics : []}
        stagesLabel={copy.stagesTitle}
        stages={stages}
      />

      <BacktestRunDetailsTabPanels
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        copy={copy}
        report={report}
        run={run}
        summaryMetrics={summaryMetrics}
        dailyPerformance={dailyPerformance}
        symbolStats={symbolStats}
        symbolSectionRefs={symbolSectionRefs}
        timelines={timelines}
        tradesBySymbol={tradesBySymbol}
        parityDiagnosticsBySymbol={parityDiagnosticsBySymbol}
        indicatorMeta={indicatorMeta}
        trades={trades}
        tradeInsights={tradeInsights}
        tradesTimelineRows={tradesTimelineRows}
        formatCurrency={formatCurrency}
        formatDateTime={formatDateTime}
        formatNumber={formatNumber}
        formatPercent={formatPercent}
        pnlClass={pnlClass}
      />
    </div>
  );
}
