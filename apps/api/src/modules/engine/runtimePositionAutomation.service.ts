import { BotMode, Exchange, Position, PositionSide, Prisma, TradeMarket } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { StreamTickerEvent } from '../market-stream/binanceStream.types';
import { orchestrateRuntimeSignal } from './executionOrchestrator.service';
import { openOrder as openOrderLifecycle } from '../orders/orders.service';
import { evaluatePositionManagement } from './positionManagement.service';
import { PositionManagementInput, PositionManagementState } from './positionManagement.types';
import { resolveRuntimeDcaFundsExhausted } from './runtimeCapitalContext.service';
import { runtimeTelemetryService } from './runtimeTelemetry.service';
import { runtimePositionStateStore } from './runtimePositionState.store';
import {
  buildDcaExecutionDedupeKey,
  runtimeExecutionDedupeService,
} from './runtimeExecutionDedupe.service';
import { resolveInheritedRuntimeExecutionContext } from './runtimeBotExecutionContext';
import { computePositionAddUpdate } from '../orders/positionFillMath';

type RuntimeManagedPosition = Pick<
  Position,
  | 'id'
  | 'userId'
  | 'botId'
  | 'walletId'
  | 'strategyId'
  | 'symbol'
  | 'side'
  | 'entryPrice'
  | 'quantity'
  | 'leverage'
  | 'stopLoss'
  | 'takeProfit'
  | 'managementMode'
  | 'origin'
> & {
  bot:
    | {
        walletId: string | null;
        liveOptIn: boolean;
        wallet:
          | {
              mode: BotMode;
              exchange: Exchange;
              marketType: TradeMarket;
              baseCurrency: string;
              paperInitialBalance: number;
            }
          | null;
        symbolGroup:
          | {
              marketUniverse: {
                exchange: Exchange;
                marketType: TradeMarket;
                baseCurrency: string;
              } | null;
            }
          | null;
      }
    | null;
};

type RuntimePositionAutomationDeps = {
  listOpenPositionsBySymbol: (
    symbol: string
  ) => Promise<RuntimeManagedPosition[]>;
  getStrategyConfigById: (strategyId: string) => Promise<Record<string, unknown> | null>;
  getCanonicalPositionState: (positionId: string) => Promise<{
    quantity: number;
    averageEntryPrice: number;
  } | null>;
  executeDca: (input: {
    userId: string;
    botId?: string | null;
    walletId?: string | null;
    strategyId?: string | null;
    positionId: string;
    symbol: string;
    positionSide: PositionSide;
    dcaLevelIndex: number;
    markPrice: number;
    mode: 'PAPER' | 'LIVE';
    addedQuantity: number;
    currentQuantity: number;
    currentEntryPrice: number;
  }) => Promise<{
    feePaid: number;
    executed: boolean;
    nextQuantity?: number;
    nextEntryPrice?: number;
  }>;
  closeByExitSignal: (input: {
    userId: string;
    botId?: string;
    walletId?: string | null;
    symbol: string;
    markPrice: number;
    mode: 'PAPER' | 'LIVE';
    quantity: number;
    reason?: 'take_profit' | 'trailing_take_profit' | 'stop_loss' | 'trailing_stop';
  }) => Promise<{ status: 'submitted' | 'closed' }>;
  resolveDcaFundsExhausted: (input: {
    userId: string;
    botId?: string | null;
    walletId?: string | null;
    mode: 'PAPER' | 'LIVE';
    exchange: Exchange;
    marketType: TradeMarket;
    paperStartBalance: number;
    markPrice: number;
    addedQuantity: number;
    leverage: number;
    nowMs: number;
  }) => Promise<boolean>;
  recordRuntimeEvent?: (params: {
    userId: string;
    botId: string;
    mode: 'PAPER' | 'LIVE';
    eventType:
      | 'SESSION_STARTED'
      | 'SESSION_STOPPED'
      | 'HEARTBEAT'
      | 'SIGNAL_DECISION'
      | 'PRETRADE_BLOCKED'
      | 'ORDER_SUBMITTED'
      | 'ORDER_FILLED'
      | 'POSITION_OPENED'
      | 'POSITION_CLOSED'
      | 'DCA_EXECUTED'
      | 'ERROR';
    level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
    symbol?: string;
    strategyId?: string;
    signalDirection?: 'LONG' | 'SHORT' | 'EXIT';
    message?: string;
    payload?: Record<string, unknown>;
    eventAt?: Date;
  }) => Promise<void>;
  upsertRuntimeSymbolStat?: (params: {
    userId: string;
    botId: string;
    mode?: 'PAPER' | 'LIVE';
    symbol: string;
    increments?: {
      totalSignals?: number;
      longEntries?: number;
      shortEntries?: number;
      exits?: number;
      dcaCount?: number;
      closedTrades?: number;
      winningTrades?: number;
      losingTrades?: number;
      realizedPnl?: number;
      grossProfit?: number;
      grossLoss?: number;
      feesPaid?: number;
    };
    lastPrice?: number;
    lastSignalAt?: Date;
    lastTradeAt?: Date;
    openPositionCount?: number;
    openPositionQty?: number;
  }) => Promise<void>;
  nowMs: () => number;
};

export type RuntimeFallbackConfig = {
  dcaEnabled: boolean;
  dcaMaxAdds: number;
  dcaStepPercent: number;
  dcaAddSizeFraction: number;
  trailingEnabled: boolean;
  trailingType: 'percent' | 'absolute';
  trailingValue: number;
};

const envBoolean = (value: string | undefined, fallback: boolean) => {
  if (value == null) return fallback;
  return value.trim().toLowerCase() === 'true';
};

const getRuntimeConfig = (): RuntimeFallbackConfig => ({
  dcaEnabled: envBoolean(process.env.RUNTIME_DCA_ENABLED, false),
  dcaMaxAdds: Number.parseInt(process.env.RUNTIME_DCA_MAX_ADDS ?? '2', 10),
  dcaStepPercent: Number.parseFloat(process.env.RUNTIME_DCA_STEP_PERCENT ?? '0.01'),
  dcaAddSizeFraction: Number.parseFloat(process.env.RUNTIME_DCA_ADD_SIZE_FRACTION ?? '0.25'),
  trailingEnabled: envBoolean(process.env.RUNTIME_TRAILING_ENABLED, false),
  trailingType: (process.env.RUNTIME_TRAILING_TYPE ?? 'percent') as 'percent' | 'absolute',
  trailingValue: Number.parseFloat(process.env.RUNTIME_TRAILING_VALUE ?? '0.005'),
});

const getRuntimeManualPositionMode = (): 'PAPER' | 'LIVE' => (process.env.RUNTIME_MANUAL_POSITION_MODE ?? 'LIVE') as 'PAPER' | 'LIVE';
const getRuntimeManualPositionMarketType = (): TradeMarket => (process.env.RUNTIME_MANUAL_POSITION_MARKET_TYPE ?? 'FUTURES') as TradeMarket;
const getRuntimeManualPositionExchange = (): Exchange => (process.env.RUNTIME_MANUAL_POSITION_EXCHANGE ?? 'BINANCE') as Exchange;

const getRuntimeManualPaperStartBalance = () => {
  const parsed = Number.parseFloat(process.env.RUNTIME_MANUAL_PAPER_START_BALANCE ?? '10000');
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 10_000;
};

const parseFeeRate = (value: string | undefined) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
};

const isPositiveFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const resolveRuntimeTakerFeeRate = (mode: 'PAPER' | 'LIVE') => {
  const modeSpecific = parseFeeRate(
    mode === 'LIVE' ? process.env.RUNTIME_LIVE_TAKER_FEE_RATE : process.env.RUNTIME_PAPER_TAKER_FEE_RATE
  );
  if (modeSpecific != null) return modeSpecific;
  const global = parseFeeRate(process.env.RUNTIME_TAKER_FEE_RATE);
  if (global != null) return global;
  return 0.0004;
};

const resolveExecutedOrderPrice = (input: { averageFillPrice?: number | null; price?: number | null }, fallback: number) => {
  if (isPositiveFiniteNumber(input.averageFillPrice)) return input.averageFillPrice;
  if (isPositiveFiniteNumber(input.price)) return input.price;
  return fallback;
};

const resolveExecutedOrderQuantity = (input: { filledQuantity?: number | null; quantity: number }, fallback: number) => {
  if (isPositiveFiniteNumber(input.filledQuantity)) {
    return Math.min(Math.max(0, input.quantity), input.filledQuantity);
  }
  return Math.max(0, fallback);
};

const loadCanonicalPositionExecutionState = async (positionId: string) => {
  const position = await prisma.position.findUnique({
    where: { id: positionId },
    select: {
      quantity: true,
      entryPrice: true,
    },
  });
  if (!position) return null;
  return {
    quantity: Math.max(0, position.quantity),
    averageEntryPrice: Math.max(0, position.entryPrice),
  };
};

export const executeRuntimeDca = async (input: {
  userId: string;
  botId?: string | null;
  walletId?: string | null;
  strategyId?: string | null;
  positionId: string;
  symbol: string;
  positionSide: PositionSide;
  dcaLevelIndex: number;
  markPrice: number;
  mode: 'PAPER' | 'LIVE';
  addedQuantity: number;
  currentQuantity: number;
  currentEntryPrice: number;
}) => {
  const dcaQuantity = Math.max(0, input.addedQuantity);
  if (dcaQuantity <= 0) return { feePaid: 0, executed: false };
  const dedupeKey = buildDcaExecutionDedupeKey({
    userId: input.userId,
    botId: input.botId,
    symbol: input.symbol,
    positionId: input.positionId,
    dcaLevelIndex: input.dcaLevelIndex,
    positionSide: input.positionSide,
  });
  const dedupe = await runtimeExecutionDedupeService.acquire({
    dedupeKey,
    commandType: 'DCA',
    userId: input.userId,
    botId: input.botId,
    symbol: input.symbol,
    commandFingerprint: {
      positionId: input.positionId,
      dcaLevelIndex: input.dcaLevelIndex,
      positionSide: input.positionSide,
    },
  });
  if (dedupe.outcome === 'reused') {
    if (dedupe.reuseStatus !== 'completed') {
      return { feePaid: 0, executed: false };
    }
    const canonicalState = await loadCanonicalPositionExecutionState(input.positionId);
    return {
      feePaid: 0,
      executed: canonicalState != null,
      nextQuantity: canonicalState?.quantity,
      nextEntryPrice: canonicalState?.averageEntryPrice,
    };
  }
  if (dedupe.outcome !== 'execute') {
    return { feePaid: 0, executed: false };
  }

  const orderSide = input.positionSide === 'LONG' ? 'BUY' : 'SELL';
  const estimatedFee = input.markPrice * dcaQuantity * resolveRuntimeTakerFeeRate(input.mode);
  try {
    const opened = await openOrderLifecycle(input.userId, {
      botId: input.botId ?? undefined,
      walletId: input.walletId ?? undefined,
      strategyId: input.strategyId ?? undefined,
      positionId: input.positionId,
      symbol: input.symbol,
      side: orderSide,
      type: 'MARKET',
      quantity: dcaQuantity,
      price: input.markPrice,
      mode: input.mode,
      riskAck: true,
    });

    if (opened.status !== 'FILLED') {
      await runtimeExecutionDedupeService.markSubmitted({
        dedupeKey,
        orderId: opened.id,
        positionId: input.positionId,
      });
      return { feePaid: 0, executed: false };
    }

    const executedQuantity = resolveExecutedOrderQuantity(opened, dcaQuantity);
    const executedPrice = resolveExecutedOrderPrice(opened, input.markPrice);
    const { nextQuantity, nextEntryPrice } = computePositionAddUpdate({
      currentQuantity: input.currentQuantity,
      currentEntryPrice: input.currentEntryPrice,
      addedQuantity: executedQuantity,
      fillPrice: executedPrice,
    });
    const feePaid = input.mode === 'LIVE' ? (opened.fee ?? estimatedFee) : estimatedFee;

    await prisma.$transaction(async (tx) => {
      await tx.position.update({
        where: { id: input.positionId },
        data: {
          quantity: nextQuantity,
          entryPrice: nextEntryPrice,
        },
      });

      await tx.order.update({
        where: { id: opened.id },
        data: { positionId: input.positionId },
      });

      await tx.trade.create({
        data: {
          userId: input.userId,
          botId: input.botId ?? undefined,
          walletId: input.walletId ?? undefined,
          strategyId: input.strategyId ?? undefined,
          orderId: opened.id,
          positionId: input.positionId,
          symbol: input.symbol,
          side: orderSide,
          lifecycleAction: 'DCA',
          price: executedPrice,
          quantity: executedQuantity,
          fee: feePaid,
          feeSource: opened.feeSource,
          feePending: opened.feePending,
          feeCurrency: opened.feeCurrency,
          effectiveFeeRate: opened.effectiveFeeRate,
          exchangeTradeId: opened.exchangeTradeId,
          realizedPnl: 0,
          origin: 'BOT',
          managementMode: 'BOT_MANAGED',
        },
      });

      await tx.log.create({
        data: {
          userId: input.userId,
          botId: input.botId ?? undefined,
          strategyId: input.strategyId ?? undefined,
          action: 'runtime.dca',
          level: 'INFO',
          source: 'engine.runtimePositionAutomation',
          message: `Runtime DCA executed for ${input.symbol}`,
          category: 'runtime',
          entityType: 'position',
          entityId: input.positionId,
          actor: 'runtime',
          metadata: {
            symbol: input.symbol,
            side: input.positionSide,
            mode: input.mode,
            orderId: opened.id,
            addedQuantity: executedQuantity,
            fillPrice: executedPrice,
            fee: feePaid,
            nextQuantity,
            nextEntryPrice,
          } as Prisma.InputJsonValue,
        },
      });
    });
    await runtimeExecutionDedupeService.markSucceeded({
      dedupeKey,
      orderId: opened.id,
      positionId: input.positionId,
    });
    return { feePaid, executed: true, nextQuantity, nextEntryPrice };
  } catch (error) {
    await runtimeExecutionDedupeService.markFailed({
      dedupeKey,
      errorClass: error instanceof Error && error.name ? error.name : 'runtime_dca_error',
    });
    throw error;
  }
};

const resolveInheritedPositionExecutionContext = (position: RuntimeManagedPosition) =>
  resolveInheritedRuntimeExecutionContext({
    walletId: position.walletId ?? position.bot?.walletId ?? null,
    wallet: position.bot?.wallet,
    venueContext: position.bot?.symbolGroup?.marketUniverse,
  });

const resolveDcaLevelCount = (input: PositionManagementInput) => {
  if (!input.dca?.enabled) return 0;
  if (Array.isArray(input.dca.levelPercents) && input.dca.levelPercents.length > 0) {
    return input.dca.levelPercents.length;
  }
  return Math.max(0, input.dca.maxAdds ?? 0);
};

const estimateNextDcaAddedQuantity = (input: PositionManagementInput, state: PositionManagementState) => {
  if (!input.dca?.enabled) return 0;
  const index = Math.max(0, state.currentAdds);
  const addFraction = input.dca.addSizeFractions?.[index] ?? input.dca.addSizeFraction ?? 0;
  if (!Number.isFinite(addFraction) || addFraction <= 0) return 0;
  return state.quantity * addFraction;
};

const defaultDeps: RuntimePositionAutomationDeps = {
  listOpenPositionsBySymbol: (symbol) =>
    prisma.position.findMany({
      where: {
        status: 'OPEN',
        symbol,
        managementMode: 'BOT_MANAGED',
        OR: [
          { botId: null },
          {
            bot: {
              isActive: true,
            },
          },
        ],
      },
      select: {
        id: true,
        userId: true,
        botId: true,
        walletId: true,
        strategyId: true,
        symbol: true,
        side: true,
        entryPrice: true,
        quantity: true,
        leverage: true,
        stopLoss: true,
        takeProfit: true,
        managementMode: true,
        origin: true,
          bot: {
            select: {
              walletId: true,
              liveOptIn: true,
              wallet: {
                select: {
                  mode: true,
                  exchange: true,
                  marketType: true,
                  baseCurrency: true,
                  paperInitialBalance: true,
                },
              },
              symbolGroup: {
                select: {
                  marketUniverse: {
                    select: {
                      exchange: true,
                      marketType: true,
                      baseCurrency: true,
                    },
                  },
                },
              },
            },
          },
        },
    }),
  getStrategyConfigById: async (strategyId) => {
    const strategy = await prisma.strategy.findUnique({
      where: { id: strategyId },
      select: { config: true },
    });
    if (!strategy || typeof strategy.config !== 'object' || strategy.config == null) return null;
    return strategy.config as Record<string, unknown>;
  },
  getCanonicalPositionState: (positionId) => loadCanonicalPositionExecutionState(positionId),
  executeDca: executeRuntimeDca,
  closeByExitSignal: async (input) => {
    const result = await orchestrateRuntimeSignal({
      userId: input.userId,
      botId: input.botId,
      walletId: input.walletId ?? undefined,
      symbol: input.symbol,
      direction: 'EXIT',
      quantity: input.quantity,
      markPrice: input.markPrice,
      mode: input.mode,
      reason: input.reason,
    });
    return {
      status: result.status === 'closed' ? 'closed' : 'submitted',
    };
  },
  resolveDcaFundsExhausted: (input) => resolveRuntimeDcaFundsExhausted(input),
  recordRuntimeEvent: (params) => runtimeTelemetryService.recordRuntimeEvent(params),
  upsertRuntimeSymbolStat: (params) => runtimeTelemetryService.upsertRuntimeSymbolStat(params),
  nowMs: () => Date.now(),
};

const toPercent = (value: unknown, fallback = 0) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.abs(num) / 100;
};

const toSignedPercent = (value: unknown, fallback = 0) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return num / 100;
};

const toPositive = (value: unknown, fallback = 0) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, num);
};

const computePriceFromPercent = (
  side: PositionSide,
  entryPrice: number,
  pct: number,
  kind: 'tp' | 'sl',
  leverage = 1
) => {
  if (!Number.isFinite(entryPrice) || entryPrice <= 0 || pct <= 0) return undefined;
  const adjustedPct = pct / Math.max(1, leverage);
  if (kind === 'tp') {
    return side === 'LONG' ? entryPrice * (1 + adjustedPct) : entryPrice * (1 - adjustedPct);
  }
  return side === 'LONG' ? entryPrice * (1 - adjustedPct) : entryPrice * (1 + adjustedPct);
};

export const buildPositionManagementInput = (
  position: Pick<
    Position,
    'side' | 'entryPrice' | 'leverage' | 'stopLoss' | 'takeProfit'
  >,
  markPrice: number,
  strategyConfig: Record<string, unknown> | null,
  fallback: RuntimeFallbackConfig
): PositionManagementInput => {
  const closeConfig =
    strategyConfig && typeof strategyConfig === 'object'
      ? ((strategyConfig.close as Record<string, unknown> | undefined) ?? undefined)
      : undefined;
  const closeMode = closeConfig?.mode === 'advanced' ? 'advanced' : 'basic';
  const additionalConfig =
    strategyConfig && typeof strategyConfig === 'object'
      ? ((strategyConfig.additional as Record<string, unknown> | undefined) ?? undefined)
      : undefined;

  const tpPercent = toPercent(closeConfig?.tp);
  const slPercent = toPercent(closeConfig?.sl);
  const ttpConfig = Array.isArray(closeConfig?.ttp) ? (closeConfig?.ttp as Array<Record<string, unknown>>) : [];
  const tslConfig = Array.isArray(closeConfig?.tsl) ? (closeConfig?.tsl as Array<Record<string, unknown>>) : [];
  const dcaLevels = Array.isArray(additionalConfig?.dcaLevels)
    ? (additionalConfig?.dcaLevels as Array<Record<string, unknown>>)
    : [];
  const dcaMode = additionalConfig?.dcaMode === 'advanced' ? 'advanced' : 'basic';
  const configuredDcaLevelPercents = dcaLevels
    .map((level) => Number(level.percent))
    .filter((value) => Number.isFinite(value))
    .map((value) => value / 100);
  const configuredDcaLevelFractions = dcaLevels
    .map((level) => Number(level.multiplier))
    .filter((value) => Number.isFinite(value) && value > 0);

  // UI contract: `percent` = activation threshold (start), `arm` = trailing step.
  const trailingTakeProfitPercent = closeMode === 'advanced' ? toPercent(ttpConfig[0]?.arm) : 0;
  const trailingTakeProfitArmPercent = closeMode === 'advanced' ? toPercent(ttpConfig[0]?.percent) : 0;
  const trailingStopPercent = closeMode === 'advanced' ? toPercent(tslConfig[0]?.percent) : 0;
  const trailingLossStartPercent = closeMode === 'advanced' ? toSignedPercent(tslConfig[0]?.percent, Number.NaN) : Number.NaN;
  const trailingLossStepPercent = closeMode === 'advanced' ? toPercent(tslConfig[0]?.arm) : 0;
  const trailingTakeProfitLevels = (closeMode === 'advanced' ? ttpConfig : [])
    .map((level) => ({
      armPercent: toPercent(level.percent),
      trailPercent: toPercent(level.arm),
    }))
    .filter((level) => level.armPercent > 0 && level.trailPercent > 0)
    .sort((left, right) => left.armPercent - right.armPercent);
  const trailingStopLevels = (closeMode === 'advanced' ? tslConfig : [])
    .map((level) => ({
      armPercent: toPercent(level.arm),
      type: 'percent' as const,
      value: toPercent(level.percent),
    }))
    .filter((level) => level.value > 0)
    .sort((left, right) => left.armPercent - right.armPercent);
  const dcaEnabled = Boolean(additionalConfig?.dcaEnabled ?? fallback.dcaEnabled);
  const configuredMaxAdds = Math.floor(toPositive(additionalConfig?.dcaTimes, fallback.dcaMaxAdds));
  const dcaMaxAdds =
    dcaMode === 'advanced'
      ? (configuredDcaLevelPercents.length > 0 ? configuredDcaLevelPercents.length : configuredMaxAdds)
      : configuredMaxAdds;
  const dcaStepPercent = Math.abs(toSignedPercent(dcaLevels[0]?.percent, -(fallback.dcaStepPercent)));
  const dcaMultiplier = toPositive(dcaLevels[0]?.multiplier ?? additionalConfig?.dcaMultiplier, 1 + fallback.dcaAddSizeFraction);
  const dcaAddSizeFraction = Math.max(0.01, Math.min(10, dcaMultiplier));
  const dcaLevelPercents =
    dcaMode === 'advanced'
      ? configuredDcaLevelPercents
      : dcaMaxAdds > 0
        ? Array.from(
            { length: dcaMaxAdds },
            () => configuredDcaLevelPercents[0] ?? -dcaStepPercent,
          )
        : [];
  const dcaLevelFractions =
    dcaMode === 'advanced'
      ? configuredDcaLevelFractions
      : dcaMaxAdds > 0
        ? Array.from(
            { length: dcaMaxAdds },
            () => configuredDcaLevelFractions[0] ?? dcaAddSizeFraction,
          )
        : [];

  const takeProfitPrice =
    closeMode === 'basic'
      ? (position.takeProfit ??
        computePriceFromPercent(position.side, position.entryPrice, tpPercent, 'tp', position.leverage || 1))
      : undefined;
  const stopLossPrice =
    closeMode === 'basic'
      ? (position.stopLoss ??
        computePriceFromPercent(position.side, position.entryPrice, slPercent, 'sl', position.leverage || 1))
      : undefined;

  return {
    side: position.side,
    currentPrice: markPrice,
    leverage: Math.max(1, position.leverage || 1),
    stopLossPrice,
    takeProfitPrice,
    trailingTakeProfit:
      trailingTakeProfitPercent > 0 && trailingTakeProfitArmPercent > 0
        ? {
            enabled: true,
            trailPercent: trailingTakeProfitPercent,
            armPercent: trailingTakeProfitArmPercent,
          }
        : undefined,
    trailingTakeProfitLevels:
      trailingTakeProfitLevels.length > 0 ? trailingTakeProfitLevels : undefined,
    trailingStop:
      trailingStopPercent > 0
        ? {
            enabled: true,
            type: 'percent',
            value: trailingStopPercent,
            armPercent: toPercent(tslConfig[0]?.arm),
          }
        : closeMode === 'advanced' && fallback.trailingEnabled
          ? {
              enabled: true,
              type: fallback.trailingType,
              value: fallback.trailingValue,
            }
          : undefined,
    trailingStopLevels:
      trailingStopLevels.length > 0 ? trailingStopLevels : undefined,
    trailingLoss:
      Number.isFinite(trailingLossStartPercent) &&
      trailingLossStartPercent < 0 &&
      trailingLossStepPercent > 0
        ? {
            enabled: true,
            startPercent: trailingLossStartPercent,
            stepPercent: trailingLossStepPercent,
          }
        : undefined,
    dca:
      dcaEnabled && dcaMaxAdds > 0
        ? {
            enabled: true,
            maxAdds: dcaMaxAdds,
            stepPercent: Math.max(0.0001, dcaStepPercent),
            addSizeFraction: dcaAddSizeFraction,
            levelPercents: dcaLevelPercents.length > 0 ? dcaLevelPercents : undefined,
            addSizeFractions: dcaLevelFractions.length > 0 ? dcaLevelFractions : undefined,
          }
        : undefined,
  };
};

export class RuntimePositionAutomationService {
  private readonly positionStates = new Map<string, PositionManagementState>();
  private readonly deps: RuntimePositionAutomationDeps;

  constructor(deps: Partial<RuntimePositionAutomationDeps> = defaultDeps) {
    const baseDeps =
      deps === defaultDeps
        ? defaultDeps
        : {
            ...defaultDeps,
            getCanonicalPositionState: async () => null,
            recordRuntimeEvent: async () => undefined,
            upsertRuntimeSymbolStat: async () => undefined,
          };
    this.deps = {
      ...baseDeps,
      ...deps,
    };
  }

  private cloneState(state: PositionManagementState): PositionManagementState {
    return {
      quantity: state.quantity,
      averageEntryPrice: state.averageEntryPrice,
      currentAdds: state.currentAdds,
      trailingAnchorPrice: state.trailingAnchorPrice,
      trailingLossLimitPercent: state.trailingLossLimitPercent,
      trailingTakeProfitHighPercent: state.trailingTakeProfitHighPercent,
      trailingTakeProfitStepPercent: state.trailingTakeProfitStepPercent,
      lastDcaPrice: state.lastDcaPrice,
    };
  }

  private statesEqual(left: PositionManagementState, right: PositionManagementState) {
    return (
      left.quantity === right.quantity &&
      left.averageEntryPrice === right.averageEntryPrice &&
      left.currentAdds === right.currentAdds &&
      left.trailingAnchorPrice === right.trailingAnchorPrice &&
      left.trailingLossLimitPercent === right.trailingLossLimitPercent &&
      left.trailingTakeProfitHighPercent === right.trailingTakeProfitHighPercent &&
      left.trailingTakeProfitStepPercent === right.trailingTakeProfitStepPercent &&
      left.lastDcaPrice === right.lastDcaPrice
    );
  }

  getPositionStateSnapshot(positionId: string): PositionManagementState | null {
    const state = this.positionStates.get(positionId);
    if (!state) return null;
    return this.cloneState(state);
  }

  async handleTickerEvent(event: StreamTickerEvent) {
    const openPositions = await this.deps.listOpenPositionsBySymbol(event.symbol);
    await Promise.all(openPositions.map((position) => this.processPosition(event, position)));
  }

  private async getStrategyConfig(strategyId: string | null) {
    if (!strategyId) return null;
    return this.deps.getStrategyConfigById(strategyId);
  }

  private async processPosition(
    event: StreamTickerEvent,
    position: RuntimeManagedPosition
  ) {
    if (position.managementMode !== 'BOT_MANAGED') return;
    if (!position.botId && position.origin === 'EXCHANGE_SYNC') {
      console.warn(
        `[RuntimePositionAutomation] position=${position.id} symbol=${position.symbol} skipped: BOT_MANAGED position without bot ownership`
      );
      return;
    }
    if (!position.botId && position.origin === 'BOT') {
      console.warn(
        `[RuntimePositionAutomation] position=${position.id} symbol=${position.symbol} skipped: BOT-origin position without canonical bot ownership`
      );
      return;
    }
    const inheritedExecutionContext = resolveInheritedPositionExecutionContext(position);
    if (position.botId && !inheritedExecutionContext) {
      console.warn(
        `[RuntimePositionAutomation] position=${position.id} symbol=${position.symbol} skipped: canonical bot execution context unresolved`
      );
      return;
    }
    if (inheritedExecutionContext?.mode === 'LIVE' && !position.bot?.liveOptIn) {
      console.warn(
        `[RuntimePositionAutomation] position=${position.id} symbol=${position.symbol} skipped: LIVE bot without live opt-in`
      );
      return;
    }

    const mode = inheritedExecutionContext?.mode ?? getRuntimeManualPositionMode();
    const exchange = inheritedExecutionContext?.exchange ?? getRuntimeManualPositionExchange();
    const marketType = inheritedExecutionContext?.marketType ?? getRuntimeManualPositionMarketType();
    if (event.exchange !== exchange || event.marketType !== marketType) return;

    const runtimeConfig = getRuntimeConfig();
    const strategyConfig = await this.getStrategyConfig(position.strategyId ?? null);
    const input = buildPositionManagementInput(position, event.lastPrice, strategyConfig, runtimeConfig);

    const defaultState = {
      quantity: position.quantity,
      averageEntryPrice: position.entryPrice,
      currentAdds: 0,
      trailingAnchorPrice: position.entryPrice,
      lastDcaPrice: undefined,
    } as PositionManagementState;
    const previousState =
      this.positionStates.get(position.id) ??
      (await runtimePositionStateStore.getPositionRuntimeState(position.id)) ??
      defaultState;
    const previousStateSnapshot = this.cloneState(previousState);

    const paperStartBalance =
      inheritedExecutionContext?.paperStartBalance ?? getRuntimeManualPaperStartBalance();
    const dcaLevelCount = resolveDcaLevelCount(input);
    const hasPendingDca = input.dca?.enabled && previousState.currentAdds < dcaLevelCount;
    const estimatedAddedQuantity = hasPendingDca
      ? estimateNextDcaAddedQuantity(input, previousState)
      : 0;
    const dcaFundsExhausted =
      hasPendingDca && estimatedAddedQuantity > 0
        ? await this.deps.resolveDcaFundsExhausted({
            userId: position.userId,
            botId: position.botId,
            walletId: inheritedExecutionContext?.walletId ?? position.walletId ?? position.bot?.walletId ?? null,
            mode,
            exchange,
            marketType,
            paperStartBalance,
            markPrice: event.lastPrice,
            addedQuantity: estimatedAddedQuantity,
            leverage: Math.max(1, position.leverage || 1),
            nowMs: this.deps.nowMs(),
          })
        : false;

    const managementInput: PositionManagementInput = dcaFundsExhausted
      ? {
          ...input,
          dca: undefined,
          dcaFundsExhausted: true,
        }
      : {
          ...input,
          dcaFundsExhausted: false,
        };

    const result = evaluatePositionManagement(managementInput, previousState);
    let effectiveState = this.cloneState(result.nextState);

    if (result.dcaExecuted) {
      const dcaAddedQuantity = Number.isFinite(result.dcaAddedQuantity)
        ? Math.max(0, result.dcaAddedQuantity)
        : Math.max(0, result.nextState.quantity - previousState.quantity);
      if (dcaAddedQuantity > 0) {
        const dcaResult = await this.deps.executeDca({
          userId: position.userId,
          botId: position.botId,
          walletId: inheritedExecutionContext?.walletId ?? position.walletId ?? position.bot?.walletId ?? null,
          strategyId: position.strategyId,
          positionId: position.id,
          symbol: position.symbol,
          positionSide: position.side,
          dcaLevelIndex: previousState.currentAdds,
          markPrice: event.lastPrice,
          mode,
          addedQuantity: dcaAddedQuantity,
          currentQuantity: previousState.quantity,
          currentEntryPrice: previousState.averageEntryPrice,
        });
        if (dcaResult.executed) {
          const canonicalState =
            dcaResult.nextQuantity != null && dcaResult.nextEntryPrice != null
              ? {
                  quantity: dcaResult.nextQuantity,
                  averageEntryPrice: dcaResult.nextEntryPrice,
                }
              : await this.deps.getCanonicalPositionState(position.id);
          if (!canonicalState) {
            effectiveState = previousStateSnapshot;
          } else {
          effectiveState = {
            ...result.nextState,
            quantity: canonicalState.quantity,
            averageEntryPrice: canonicalState.averageEntryPrice,
          };
          }
        } else {
          effectiveState = previousStateSnapshot;
        }
        if (position.botId && dcaResult.executed) {
          const eventAt = new Date(event.eventTime);
          await this.deps.recordRuntimeEvent?.({
            userId: position.userId,
            botId: position.botId,
            mode,
            eventType: 'DCA_EXECUTED',
            level: 'INFO',
            symbol: position.symbol,
            strategyId: position.strategyId ?? undefined,
            signalDirection: position.side === 'LONG' ? 'LONG' : 'SHORT',
            message: 'Runtime DCA executed',
            payload: {
              addedQuantity: dcaAddedQuantity,
              nextQuantity: effectiveState.quantity,
              nextEntryPrice: effectiveState.averageEntryPrice,
            },
            eventAt,
          });
          await this.deps.upsertRuntimeSymbolStat?.({
            userId: position.userId,
            botId: position.botId,
            mode,
            symbol: position.symbol,
            increments: {
              dcaCount: 1,
              feesPaid: dcaResult.feePaid,
            },
            lastPrice: event.lastPrice,
            lastTradeAt: eventAt,
            openPositionQty: effectiveState.quantity,
          });
        }
      }
    }
    this.positionStates.set(position.id, effectiveState);

    if (result.shouldClose) {
      const closeResult = await this.deps.closeByExitSignal({
        userId: position.userId,
        botId: position.botId ?? undefined,
        walletId: inheritedExecutionContext?.walletId ?? position.walletId ?? position.bot?.walletId ?? null,
        symbol: position.symbol,
        markPrice: event.lastPrice,
        mode,
        quantity: effectiveState.quantity,
        reason: result.closeReason,
      });
      if (closeResult.status === 'closed') {
        await runtimePositionStateStore.deletePositionRuntimeState(position.id);
        this.positionStates.delete(position.id);
      } else if (!this.statesEqual(previousStateSnapshot, effectiveState)) {
        await runtimePositionStateStore.setPositionRuntimeState(position.id, effectiveState);
      }
      return;
    }

    if (!this.statesEqual(previousStateSnapshot, effectiveState)) {
      await runtimePositionStateStore.setPositionRuntimeState(position.id, effectiveState);
    }
  }
}

export const runtimePositionAutomationService = new RuntimePositionAutomationService();
