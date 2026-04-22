import { useMemo } from 'react';

import type { BacktestTimelineState } from './useBacktestTimelineOrchestration';
import type { BacktestTrade } from '../types/backtest.type';
import { buildDailyPerformance, safeDateMs } from '../utils/backtestRunDetailsViewModel';

export type BacktestTradeTimelineRow = {
  index: number;
  trade: BacktestTrade;
  holdMinutes: number;
  entryNotional: number;
  exitNotional: number;
  entryMargin: number;
  exitMargin: number;
  sidePriceMovePct: number | null;
  pnlPctOnNotional: number | null;
  pnlPctOnMargin: number | null;
  dcaCount: number;
  dcaKnownFromTimeline: boolean;
  cumulativePnl: number;
};

export type BacktestTradeInsights = {
  finalCumulative: number;
  grossProfit: number;
  grossLoss: number;
  maxWin: number;
  maxLoss: number;
  hasWins: boolean;
  hasLosses: boolean;
};

type UseBacktestTradesAnalyticsArgs = {
  runId: string;
  trades: BacktestTrade[];
  timelines: Record<string, BacktestTimelineState>;
  effectiveLeverage: number;
  initialBalance: number;
};

export const useBacktestTradesAnalytics = ({
  runId,
  trades,
  timelines,
  effectiveLeverage,
  initialBalance,
}: UseBacktestTradesAnalyticsArgs) => {
  const dailyPerformance = useMemo(() => buildDailyPerformance(trades, initialBalance), [initialBalance, trades]);

  const timelineTradeEventMeta = useMemo(() => {
    const dcaCountByTradeId = new Map<string, number>();
    const knownTradeIds = new Set<string>();

    for (const state of Object.values(timelines)) {
      const events = state.data?.events ?? [];
      for (const event of events) {
        knownTradeIds.add(event.tradeId);
        if (event.type !== 'DCA') continue;
        dcaCountByTradeId.set(event.tradeId, (dcaCountByTradeId.get(event.tradeId) ?? 0) + 1);
      }
    }

    return {
      dcaCountByTradeId,
      knownTradeIds,
    };
  }, [timelines]);

  const tradeDcaMetaByTradeId = useMemo(() => {
    const byTradeId = new Map<
      string,
      {
        dcaCount: number;
        knownFromTimeline: boolean;
      }
    >();

    const orderedBySymbol = [...trades].sort((a, b) => {
      const bySymbol = a.symbol.localeCompare(b.symbol);
      if (bySymbol !== 0) return bySymbol;
      const byOpen = safeDateMs(a.openedAt) - safeDateMs(b.openedAt);
      if (byOpen !== 0) return byOpen;
      return safeDateMs(a.closedAt) - safeDateMs(b.closedAt);
    });

    const sequenceBySymbol = new Map<string, number>();
    for (const trade of orderedBySymbol) {
      const sequence = (sequenceBySymbol.get(trade.symbol) ?? 0) + 1;
      sequenceBySymbol.set(trade.symbol, sequence);
      const syntheticTradeId = `${runId}_${trade.symbol}_${sequence}`;

      byTradeId.set(trade.id, {
        dcaCount: timelineTradeEventMeta.dcaCountByTradeId.get(syntheticTradeId) ?? 0,
        knownFromTimeline: timelineTradeEventMeta.knownTradeIds.has(syntheticTradeId),
      });
    }

    return byTradeId;
  }, [runId, timelineTradeEventMeta.dcaCountByTradeId, timelineTradeEventMeta.knownTradeIds, trades]);

  const tradesTimelineRows = useMemo<BacktestTradeTimelineRow[]>(() => {
    const ordered = [...trades].sort((a, b) => {
      const byClose = safeDateMs(a.closedAt) - safeDateMs(b.closedAt);
      if (byClose !== 0) return byClose;
      return safeDateMs(a.openedAt) - safeDateMs(b.openedAt);
    });

    let cumulativePnl = 0;
    return ordered.map((trade, index) => {
      const entryNotional = trade.entryPrice * trade.quantity;
      const exitNotional = trade.exitPrice * trade.quantity;
      const holdMinutes = Math.max(0, safeDateMs(trade.closedAt) - safeDateMs(trade.openedAt)) / 60_000;
      const rawPriceMovePct =
        trade.entryPrice !== 0 ? ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100 : null;
      const sidePriceMovePct = rawPriceMovePct == null ? null : trade.side === 'LONG' ? rawPriceMovePct : -rawPriceMovePct;
      const entryMargin = effectiveLeverage > 0 ? entryNotional / effectiveLeverage : entryNotional;
      const exitMargin = effectiveLeverage > 0 ? exitNotional / effectiveLeverage : exitNotional;
      const pnlPctOnNotional = entryNotional > 0 ? (trade.pnl / entryNotional) * 100 : null;
      const pnlPctOnMargin = entryMargin > 0 ? (trade.pnl / entryMargin) * 100 : null;
      const dcaMeta = tradeDcaMetaByTradeId.get(trade.id);
      cumulativePnl += trade.pnl;

      return {
        index: index + 1,
        trade,
        holdMinutes,
        entryNotional,
        exitNotional,
        entryMargin,
        exitMargin,
        sidePriceMovePct,
        pnlPctOnNotional,
        pnlPctOnMargin,
        dcaCount: dcaMeta?.dcaCount ?? 0,
        dcaKnownFromTimeline: dcaMeta?.knownFromTimeline ?? false,
        cumulativePnl,
      };
    });
  }, [effectiveLeverage, tradeDcaMetaByTradeId, trades]);

  const tradeInsights = useMemo<BacktestTradeInsights | null>(() => {
    if (tradesTimelineRows.length === 0) return null;
    const pnls = tradesTimelineRows.map((row) => row.trade.pnl);
    const positivePnls = pnls.filter((value) => value > 0);
    const negativePnls = pnls.filter((value) => value < 0);
    const grossProfit = positivePnls.reduce((sum, value) => sum + value, 0);
    const grossLoss = negativePnls.reduce((sum, value) => sum + value, 0);
    const maxWin = positivePnls.length > 0 ? Math.max(...positivePnls) : 0;
    const maxLoss = negativePnls.length > 0 ? Math.min(...negativePnls) : 0;
    return {
      finalCumulative: tradesTimelineRows[tradesTimelineRows.length - 1]?.cumulativePnl ?? 0,
      grossProfit,
      grossLoss,
      maxWin,
      maxLoss,
      hasWins: positivePnls.length > 0,
      hasLosses: negativePnls.length > 0,
    };
  }, [tradesTimelineRows]);

  return {
    dailyPerformance,
    tradesTimelineRows,
    tradeInsights,
  };
};
