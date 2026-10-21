import { evaluatePositionManagement } from '../engine/positionManagement.service';
import type { DcaSizingBasis, PositionManagementInput,
  PositionManagementState } from '../engine/positionManagement.types';

export type ReplayIntrabarTick = { eventTime: number; price: number; sequenceId?: number };

type TickCandle = {
  openTime: number; closeTime: number; open: number; high: number;
  low: number; close: number; intrabarTicks?: ReplayIntrabarTick[];
};

export const verifyReplayIntrabarTicks = (candle: TickCandle): ReplayIntrabarTick[] | null => {
  const ticks = candle.intrabarTicks;
  if (ticks === undefined) return null;
  const samePrice = (left: number, right: number) => Math.abs(left - right) <= 1e-9;
  let tickHigh = Number.NEGATIVE_INFINITY;
  let tickLow = Number.POSITIVE_INFINITY;
  let priorTime = Number.NEGATIVE_INFINITY;
  let priorSequenceId = Number.NEGATIVE_INFINITY;
  for (const tick of ticks) {
    if (!Number.isFinite(tick.eventTime) || !Number.isFinite(tick.price) || tick.price <= 0 ||
      tick.eventTime < candle.openTime || tick.eventTime > candle.closeTime ||
      tick.eventTime < priorTime ||
      (tick.eventTime === priorTime && (!Number.isSafeInteger(tick.sequenceId) ||
        tick.sequenceId! <= priorSequenceId))) throw new Error('BACKTEST_INTRABAR_TICKS_INVALID');
    priorTime = tick.eventTime;
    priorSequenceId = tick.sequenceId ?? Number.NEGATIVE_INFINITY;
    tickHigh = Math.max(tickHigh, tick.price);
    tickLow = Math.min(tickLow, tick.price);
  }
  if (ticks.length < 2 || !samePrice(ticks[0].price, candle.open) ||
    !samePrice(ticks[ticks.length - 1].price, candle.close) ||
    !samePrice(tickHigh, candle.high) || !samePrice(tickLow, candle.low)) {
    throw new Error('BACKTEST_INTRABAR_TICKS_INVALID');
  }
  return ticks;
};

export const shouldBlockCloseByPendingDca = (input: {
  lockTrailingByPendingDca: boolean;
  closeReason?: string;
  riskConfig: { dcaLevels: number[] };
  executedDcaLevelIndices?: number[];
  dcaFundsExhausted?: boolean;
  dcaSizingBasis?: DcaSizingBasis;
  reachedDcaLevelIndex?: number;
  filledDcaLevelIndex?: number;
}) => {
  if (!input.lockTrailingByPendingDca) return false;
  if (input.dcaSizingBasis === 'usdt_contribution_v1' && input.dcaFundsExhausted &&
      input.closeReason === 'stop_loss' && input.reachedDcaLevelIndex != null &&
      input.riskConfig.dcaLevels[input.reachedDcaLevelIndex] < 0) return false;
  const blocksLossSideDca = input.closeReason === 'trailing_stop' || input.closeReason === 'stop_loss';
  const blocksProfitSideDca = input.closeReason === 'take_profit' ||
    input.closeReason === 'trailing_take_profit';
  if (!blocksLossSideDca && !blocksProfitSideDca) return false;
  const executed = new Set((input.executedDcaLevelIndices ?? []).filter(
    (index) => Number.isInteger(index) && index >= 0));
  return input.riskConfig.dcaLevels.some((level, index) =>
    // With OHLC alone, a fill retains priority for the whole ambiguous candle.
    (index === input.filledDcaLevelIndex || !executed.has(index)) &&
    Number.isFinite(level) && (blocksProfitSideDca ? level >= 0 : level < 0));
};

const replayPnlFraction = (side: 'LONG' | 'SHORT', entryPrice: number,
  currentPrice: number, leverage: number) => {
  if (!Number.isFinite(entryPrice) || entryPrice <= 0 || !Number.isFinite(currentPrice)) return null;
  const move = side === 'LONG' ? (currentPrice - entryPrice) / entryPrice
    : (entryPrice - currentPrice) / entryPrice;
  const pnl = move * Math.max(1, leverage);
  return Number.isFinite(pnl) ? pnl : null;
};

export const resolveReplayDcaProbePrice = (args: {
  side: 'LONG' | 'SHORT';
  candle: { high: number; low: number; close: number };
  entryPrice: number;
  leverage: number;
  riskConfig: { dcaLevels: number[] };
  executedDcaLevelIndices?: number[];
  orderedTicks?: ReplayIntrabarTick[] | null;
}) => {
  const executed = new Set((args.executedDcaLevelIndices ?? []).filter(
    (index) => Number.isInteger(index) && index >= 0 && index < args.riskConfig.dcaLevels.length));
  if (args.orderedTicks) {
    for (const tick of args.orderedTicks) {
      const reached = args.riskConfig.dcaLevels.some((level, index) => {
        if (executed.has(index) || !Number.isFinite(level)) return false;
        const pnl = replayPnlFraction(args.side, args.entryPrice, tick.price, args.leverage);
        return pnl != null && (level >= 0 ? pnl >= level - 1e-12 : pnl <= level + 1e-12);
      });
      if (reached) return tick.price;
    }
    return args.candle.close;
  }
  const favorablePrice = args.side === 'LONG' ? args.candle.high : args.candle.low;
  const adversePrice = args.side === 'LONG' ? args.candle.low : args.candle.high;
  const candidates = args.riskConfig.dcaLevels.map((level, index) => {
    const price = level >= 0 ? favorablePrice : adversePrice;
    const pnl = replayPnlFraction(args.side, args.entryPrice, price, args.leverage);
    const reached = pnl != null && (level >= 0 ? pnl >= level - 1e-12 : pnl <= level + 1e-12);
    return { index, level, price, reached };
  }).filter(({ index, level, reached }) => !executed.has(index) && Number.isFinite(level) && reached)
    .sort((left, right) => Math.abs(left.level) - Math.abs(right.level) || left.index - right.index);
  return candidates[0]?.price ?? args.candle.close;
};

export const replayProtectionAfterConfirmedDca = (args: {
  ticks: ReplayIntrabarTick[];
  fillPrice: number;
  state: PositionManagementState;
  riskConfig: { dcaLevels: number[]; dcaSizingBasis: DcaSizingBasis };
  dcaFundsExhausted: boolean;
  lockTrailingByPendingDca: boolean;
  buildManagementInput: (price: number) => PositionManagementInput;
}) => {
  const fillIndex = args.ticks.findIndex((tick) => Math.abs(tick.price - args.fillPrice) <= 1e-9);
  if (fillIndex < 0) throw new Error('BACKTEST_DCA_FILL_TICK_MISSING');
  let state = args.state;
  let result: ReturnType<typeof evaluatePositionManagement> = {
    shouldClose: false, dcaExecuted: false, dcaAddedQuantity: 0, nextState: state,
  };
  let closeTick: ReplayIntrabarTick | null = null;
  for (const tick of args.ticks.slice(fillIndex + 1)) {
    const executedDcaLevelIndices = state.executedDcaLevelIndices;
    result = evaluatePositionManagement({ ...args.buildManagementInput(tick.price),
      dca: undefined, dcaFundsExhausted: args.dcaFundsExhausted }, state);
    state = { ...result.nextState, executedDcaLevelIndices };
    result = { ...result, nextState: state };
    if (result.shouldClose && shouldBlockCloseByPendingDca({
      lockTrailingByPendingDca: args.lockTrailingByPendingDca,
      closeReason: result.closeReason, riskConfig: args.riskConfig,
      executedDcaLevelIndices, dcaFundsExhausted: args.dcaFundsExhausted,
      dcaSizingBasis: args.riskConfig.dcaSizingBasis,
    })) result = { ...result, shouldClose: false, closeReason: undefined };
    if (result.shouldClose) { closeTick = tick; break; }
  }
  return { result, closeTick };
};
