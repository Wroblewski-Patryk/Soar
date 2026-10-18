import { Position, PositionSide, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { StreamTickerEvent } from '../market-stream/binanceStream.types';
import { orchestrateRuntimeSignal } from './executionOrchestrator.service';
import { openOrder as openOrderLifecycle } from '../orders/orders.service';
import { evaluatePositionManagement, rebasePositionManagementProtection,
  tryRebasePositionManagementProtection } from './positionManagement.service';
import { clonePositionManagementState, positionManagementStatesEqual } from './positionManagementState.utils';
import { PositionManagementInput, PositionManagementState } from './positionManagement.types';
import { resolveRuntimeDcaFundsExhausted } from './runtimeCapitalContext.service';
import { runtimeTelemetryService } from './runtimeTelemetry.service';
import { runtimePositionStateStore } from './runtimePositionState.store';
import {
  buildDcaExecutionDedupeKey,
  runtimeExecutionDedupeService,
} from './runtimeExecutionDedupe.service';
import { buildRuntimeClientOrderId } from './runtimeExecutionClientOrderId';
import { finalizeRuntimeDcaFill, recordUnknownRuntimeOrderOutcome } from './runtimeImmediateFillFinalizer.service';
import { settleRuntimeOrderFee } from '../positions/runtimeOrderFeeSettlement';
import {
  recordRuntimeAutomationSkipTelemetry,
  RuntimeAutomationSkipReason,
} from './runtimePositionAutomationSkipTelemetry';
import { resolveRuntimeLifecycleMarkPrice } from './runtimeLifecycleMarkPrice.service';
import {
  computePriceFromPercent,
  estimateNextDcaAddedQuantity,
  resolveEffectivePositionStrategyId,
  resolveDcaLevelCount,
  resolveInheritedPositionExecutionContext,
  resolveRuntimeCurrentPnlFraction,
} from './runtimePositionAutomation.helpers';
import { hasMaterialCanonicalBasisDrift } from './runtimePositionAutomationStateRebase';
import { resolvePreferredRuntimeOrExchangeSyncedPrice } from './runtimeExchangeSyncedPositionPrice';
import {
  recordRuntimeDcaFundsExhaustedTelemetry,
  recordRuntimeProtectionCloseDecisionTelemetry,
} from './runtimePositionAutomationTelemetry';
import { resolveEffectiveSymbolGroupSymbolsWithCatalog } from '../bots/runtimeSymbolCatalogResolver.service';
import { normalizeSymbols } from '../bots/runtimeSymbolUniverse.service';
import { listRuntimeAutomationOpenPositionsBySymbol } from './runtimePositionAutomationDefaultPositionDeps';
import { RuntimeManagedPosition, RuntimePositionAutomationDeps } from './runtimePositionAutomation.types';
import { assertRuntimeDcaPolicy, assertRuntimeDcaOrderAllowed, resolveRuntimeDcaPolicyBlock,
  RuntimeDcaPolicyError, RUNTIME_DCA_QUANTITY_MULTIPLIER_LIMIT } from './runtimeDcaPolicy';
import { resolveRuntimeDcaOrderQuantity, getRuntimeDcaOrderRules } from './runtimeDcaOrderRules';
import { loadDurableDcaProgress } from './runtimeDurableDcaProgress';
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
  eventAt?: Date;
}, deps: { getOrderRules?: typeof getRuntimeDcaOrderRules;
  resolveFundsExhausted?: typeof resolveRuntimeDcaFundsExhausted } = {}) => {
  let dcaQuantity = Math.max(0, input.addedQuantity);
  if (dcaQuantity <= 0) return { feePaid: 0, executed: false };
  const usdtContext = await assertRuntimeDcaOrderAllowed(input);
  if (usdtContext) {
    if (usdtContext.mode !== input.mode) throw new RuntimeDcaPolicyError({
      code: 'DCA_CONTRIBUTION_UNCONFIRMED', message: 'DCA mode does not match the canonical wallet',
    });
    const rules = await (deps.getOrderRules ?? getRuntimeDcaOrderRules)({
      exchange: usdtContext.exchange, marketType: usdtContext.marketType, symbol: input.symbol,
    });
    dcaQuantity = resolveRuntimeDcaOrderQuantity({ quantity: dcaQuantity,
      markPrice: input.markPrice, marketType: usdtContext.marketType, rules });
    const exhausted = await (deps.resolveFundsExhausted ?? resolveRuntimeDcaFundsExhausted)({
      userId: input.userId, botId: input.botId, walletId: usdtContext.walletId,
      mode: input.mode, exchange: usdtContext.exchange, marketType: usdtContext.marketType,
      paperStartBalance: usdtContext.paperStartBalance, markPrice: input.markPrice,
      addedQuantity: dcaQuantity, leverage: usdtContext.leverage, nowMs: Date.now(),
    });
    if (exhausted) throw new RuntimeDcaPolicyError({
      code: 'DCA_FUNDS_EXHAUSTED', message: 'Runtime USDT DCA requires more free USDT than the wallet has',
    });
  }
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
    if (!dedupe.orderId || !await prisma.trade.findFirst({
      where: { orderId: dedupe.orderId, positionId: input.positionId, lifecycleAction: 'DCA' },
      select: { id: true },
    })) {
      return { feePaid: 0, executed: false };
    }
    const canonicalState = await loadCanonicalPositionExecutionState(input.positionId);
    return {
      feePaid: 0,
      orderId: dedupe.orderId,
      replayed: true,
      executed: canonicalState != null,
      nextQuantity: canonicalState?.quantity,
      nextEntryPrice: canonicalState?.averageEntryPrice,
    };
  }
  if (dedupe.outcome !== 'execute') {
    return { feePaid: 0, executed: false };
  }

  const orderSide = input.positionSide === 'LONG' ? 'BUY' : 'SELL';
  const runtimeSessionId = input.mode === 'LIVE' && input.botId
    ? await runtimeTelemetryService.ensureRuntimeSession({
        userId: input.userId, botId: input.botId, mode: 'LIVE',
      }) : undefined;
  let openedOrderId: string | null = null;
  try {
    const opened = await openOrderLifecycle(input.userId, {
      botId: input.botId ?? undefined,
      walletId: input.walletId ?? undefined,
      strategyId: input.strategyId ?? undefined,
      positionId: input.positionId,
      origin: 'BOT',
      symbol: input.symbol,
      side: orderSide,
      type: 'MARKET',
      quantity: dcaQuantity,
      price: input.markPrice,
      mode: input.mode,
      riskAck: true,
      clientOrderId: buildRuntimeClientOrderId(dedupeKey),
    });
    openedOrderId = opened.id;

    if (opened.status !== 'FILLED') {
      await runtimeExecutionDedupeService.markSubmitted({
        dedupeKey,
        orderId: opened.id,
        positionId: input.positionId,
      });
      return { feePaid: 0, executed: false };
    }

    if (usdtContext && input.mode === 'LIVE'
      && (!isPositiveFiniteNumber(opened.averageFillPrice)
        || !isPositiveFiniteNumber(opened.filledQuantity))) {
      throw Object.assign(new Error('Confirmed LIVE DCA fill price and quantity are unavailable'),
        { code: 'LIVE_EXECUTION_UNKNOWN' });
    }
    const executedQuantity = resolveExecutedOrderQuantity(opened, dcaQuantity);
    const executedPrice = resolveExecutedOrderPrice(opened, input.markPrice);
    const feePending = input.mode === 'LIVE' && (opened.feePending || opened.fee == null || opened.feeSource !== 'EXCHANGE_FILL');
    const feePaid = input.mode === 'LIVE' ? (feePending ? null : opened.fee)
      : executedPrice * executedQuantity * resolveRuntimeTakerFeeRate(input.mode);
    const finalized = await finalizeRuntimeDcaFill({
      userId: input.userId, botId: input.botId, walletId: input.walletId,
      strategyId: input.strategyId, positionId: input.positionId,
      order: opened, dedupeKey, fillPrice: executedPrice,
      fillQuantity: executedQuantity, feePaid, mode: input.mode,
      runtimeSessionId, eventAt: input.eventAt,
    });
    return {
      feePaid: finalized.feePaid, feePending, orderId: opened.id, executed: true,
      telemetryRecorded: finalized.telemetryRecorded,
      nextQuantity: finalized.nextQuantity, nextEntryPrice: finalized.nextEntryPrice,
    };
  } catch (error) {
    const unknownAfterSubmission = input.mode === 'LIVE' && (
      (error as { code?: string } | null)?.code === 'LIVE_EXECUTION_UNKNOWN' || openedOrderId !== null
    );
    await runtimeExecutionDedupeService.markFailed({
      dedupeKey,
      errorClass: unknownAfterSubmission
        ? 'live_execution_unknown'
        : error instanceof Error && error.name ? error.name : 'runtime_dca_error',
    });
    if (unknownAfterSubmission) {
      await recordUnknownRuntimeOrderOutcome({
        userId: input.userId, botId: input.botId, positionId: input.positionId,
        symbol: input.symbol, dedupeKey, orderId: openedOrderId, commandType: 'DCA',
      });
    }
    throw error;
  }
};

const defaultDeps: RuntimePositionAutomationDeps = {
  listOpenPositionsBySymbol: listRuntimeAutomationOpenPositionsBySymbol,
  getStrategyConfigById: async (strategyId) => {
    const strategy = await prisma.strategy.findUnique({
      where: { id: strategyId },
      select: { config: true },
    });
    if (!strategy || typeof strategy.config !== 'object' || strategy.config == null) return null;
    return strategy.config as Record<string, unknown>;
  },
  getCanonicalPositionState: (positionId) => loadCanonicalPositionExecutionState(positionId),
  getDurableDcaProgress: (input) => loadDurableDcaProgress(input),
  executeDca: executeRuntimeDca,
  closeByExitSignal: async (input) => {
    const result = await orchestrateRuntimeSignal({
      userId: input.userId,
      botId: input.botId,
      walletId: input.walletId ?? undefined,
      strategyId: input.strategyId ?? undefined,
      symbol: input.symbol,
      direction: 'EXIT',
      quantity: input.quantity,
      markPrice: input.markPrice,
      mode: input.mode,
      reason: input.reason,
    });
    return { status: result.status === 'closed' ? 'closed' : 'submitted' };
  },
  resolveDcaFundsExhausted: (input) => resolveRuntimeDcaFundsExhausted(input),
  hasPendingSubmittedDcaForPosition: (positionId) =>
    runtimeExecutionDedupeService.hasPendingSubmittedDcaForPosition(positionId),
  recordRuntimeEvent: (params) => runtimeTelemetryService.recordRuntimeEvent(params),
  upsertRuntimeSymbolStat: (params) => runtimeTelemetryService.upsertRuntimeSymbolStat(params),
  resolveLifecyclePrice: ({ exchange, marketType, symbol, fallbackPrice }) =>
    resolveRuntimeLifecycleMarkPrice({ exchange, marketType, symbol }) ?? fallbackPrice,
  nowMs: () => Date.now(),
};

const resolveEnabledCanonicalStrategyLinkIds = (position: RuntimeManagedPosition) => Array.from(new Set((position.bot?.botMarketGroups ?? []).flatMap((group) => group.strategyLinks.map((link) => link.strategyId))));
const resolveConfiguredPositionSymbols = async (position: RuntimeManagedPosition) => {
  const configuredSymbolGroup =
    position.bot?.botMarketGroups?.[0]?.symbolGroup ?? position.bot?.symbolGroup ?? null;
  if (!configuredSymbolGroup) return [];
  return normalizeSymbols(
    await resolveEffectiveSymbolGroupSymbolsWithCatalog(
      configuredSymbolGroup,
      new Map<string, string[]>()
    )
  );
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

export const buildPositionManagementInput = (
  position: Pick<
    Position,
    'side' | 'entryPrice' | 'leverage' | 'stopLoss' | 'takeProfit'
  >,
  markPrice: number,
  strategyConfig: Record<string, unknown> | null,
  fallback: RuntimeFallbackConfig
): PositionManagementInput => {
  assertRuntimeDcaPolicy(strategyConfig);
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
  const trailingLossStartPercent = closeMode === 'advanced' ? toSignedPercent(tslConfig[0]?.percent, Number.NaN) : Number.NaN;
  const trailingLossStepPercent = closeMode === 'advanced' ? toPercent(tslConfig[0]?.arm) : 0;
  const trailingTakeProfitLevels = (closeMode === 'advanced' ? ttpConfig : [])
    .map((level) => ({
      armPercent: toPercent(level.percent),
      trailPercent: toPercent(level.arm),
    }))
    .filter((level) => level.armPercent > 0 && level.trailPercent > 0 && level.trailPercent <= level.armPercent)
    .sort((left, right) => left.armPercent - right.armPercent);
  const trailingStopLevels = (closeMode === 'advanced' ? tslConfig : [])
    .map((level) => ({
      armPercent: Math.abs(toSignedPercent(level.percent, Number.NaN)),
      type: 'percent' as const,
      value: toPercent(level.arm),
    }))
    .filter((level) => level.armPercent > 0 && level.value > 0)
    .sort((left, right) => left.armPercent - right.armPercent);
  const trailingLossLevels = (closeMode === 'advanced' ? tslConfig : [])
    .map((level) => ({
      startPercent: toSignedPercent(level.percent, Number.NaN),
      stepPercent: toPercent(level.arm),
    }))
    .filter((level) => Number.isFinite(level.startPercent) && level.startPercent < 0 &&
      level.stepPercent > 0)
    .sort((left, right) => left.startPercent - right.startPercent);
  const hasConfiguredTrailingLoss = trailingLossLevels.length > 0;
  const dcaEnabled = Boolean(additionalConfig?.dcaEnabled ?? fallback.dcaEnabled);
  const configuredMaxAdds = Math.floor(toPositive(additionalConfig?.dcaTimes, fallback.dcaMaxAdds));
  const dcaMaxAdds =
    dcaMode === 'advanced'
      ? (configuredDcaLevelPercents.length > 0 ? configuredDcaLevelPercents.length : configuredMaxAdds)
      : configuredMaxAdds;
  const dcaStepPercent = Math.abs(toSignedPercent(dcaLevels[0]?.percent, -(fallback.dcaStepPercent)));
  const dcaMultiplier = toPositive(dcaLevels[0]?.multiplier ?? additionalConfig?.dcaMultiplier, 1 + fallback.dcaAddSizeFraction);
  const sizingBasis = additionalConfig?.dcaSizingBasis === 'usdt_contribution_v1'
    ? 'usdt_contribution_v1' as const : 'quantity_v1' as const;
  const dcaAddSizeFraction = Math.max(0.01, sizingBasis === 'quantity_v1'
    ? Math.min(RUNTIME_DCA_QUANTITY_MULTIPLIER_LIMIT, dcaMultiplier) : dcaMultiplier);
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
    dcaSizingBasis: sizingBasis,
    stopLossPrice,
    takeProfitPrice,
    trailingTakeProfit:
      trailingTakeProfitPercent > 0 && trailingTakeProfitArmPercent > 0 && trailingTakeProfitPercent <= trailingTakeProfitArmPercent
        ? {
            enabled: true,
            trailPercent: trailingTakeProfitPercent,
            armPercent: trailingTakeProfitArmPercent,
          }
        : undefined,
    trailingTakeProfitLevels:
      trailingTakeProfitLevels.length > 0 ? trailingTakeProfitLevels : undefined,
    trailingStop:
      !hasConfiguredTrailingLoss && closeMode === 'advanced' &&
        sizingBasis !== 'usdt_contribution_v1' && fallback.trailingEnabled
          ? {
              enabled: true,
              type: fallback.trailingType,
              value: fallback.trailingValue,
            }
          : undefined,
    trailingStopLevels:
      hasConfiguredTrailingLoss ? undefined : trailingStopLevels.length > 0 ? trailingStopLevels : undefined,
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
    trailingLossLevels:
      (sizingBasis === 'usdt_contribution_v1' || trailingLossLevels.length > 1) &&
      trailingLossLevels.length > 0 ? trailingLossLevels : undefined,
    dca:
      dcaEnabled && dcaMaxAdds > 0
        ? {
            enabled: true,
            maxAdds: dcaMaxAdds,
            stepPercent: Math.max(0.0001, dcaStepPercent),
            addSizeFraction: dcaAddSizeFraction,
            sizingBasis,
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
            getDurableDcaProgress: async () => null,
            hasPendingSubmittedDcaForPosition: async () => false,
            recordRuntimeEvent: async () => undefined,
            upsertRuntimeSymbolStat: async () => undefined,
          };
    this.deps = {
      ...baseDeps,
      ...deps,
    };
  }

  getPositionStateSnapshot(positionId: string): PositionManagementState | null { const state = this.positionStates.get(positionId); return state ? clonePositionManagementState(state) : null; }

  async handleTickerEvent(event: StreamTickerEvent) {
    await Promise.all((await this.deps.listOpenPositionsBySymbol(event.symbol)).map((position) => this.processPosition(event, position)));
  }

  private async getStrategyConfig(strategyId: string | null) { return strategyId ? this.deps.getStrategyConfigById(strategyId) : null; }
  private async processPosition(
    event: StreamTickerEvent,
    position: RuntimeManagedPosition
  ) {
    if (position.managementMode !== 'BOT_MANAGED') return;
    const enabledCanonicalStrategyLinkIds = resolveEnabledCanonicalStrategyLinkIds(position);
    const effectiveStrategyId = resolveEffectivePositionStrategyId(position);
    if (position.continuityState !== 'CONFIRMED') {
      console.warn(
        `[RuntimePositionAutomation] position=${position.id} symbol=${position.symbol} skipped: continuity_state=${position.continuityState}`
      );
      await recordRuntimeAutomationSkipTelemetry({
        recordRuntimeEvent: this.deps.recordRuntimeEvent,
        event,
        position,
        strategyId: effectiveStrategyId,
        reason: 'continuity_state_unconfirmed',
        message: `Runtime automation skipped because continuity state is ${position.continuityState}`,
        extraPayload: {
          actionable: false,
        },
      });
      return;
    }
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
      await recordRuntimeAutomationSkipTelemetry({
        recordRuntimeEvent: this.deps.recordRuntimeEvent,
        event,
        position,
        inheritedExecutionContext,
        strategyId: effectiveStrategyId,
        reason: 'canonical_execution_context_unresolved',
        message: 'Runtime automation skipped because canonical LIVE execution context is unresolved',
      });
      return;
    }
    if (!inheritedExecutionContext) {
      console.warn(
        `[RuntimePositionAutomation] position=${position.id} symbol=${position.symbol} skipped: execution context unresolved`
      );
      return;
    }
    if (inheritedExecutionContext.mode === 'LIVE' && !position.bot?.liveOptIn) {
      console.warn(
        `[RuntimePositionAutomation] position=${position.id} symbol=${position.symbol} skipped: LIVE bot without live opt-in`
      );
      await recordRuntimeAutomationSkipTelemetry({
        recordRuntimeEvent: this.deps.recordRuntimeEvent,
        event,
        position,
        inheritedExecutionContext,
        strategyId: effectiveStrategyId,
        reason: 'live_opt_in_disabled',
        message: 'Runtime automation skipped because LIVE bot has no active live opt-in',
      });
      return;
    }
    const configuredSymbols = position.botId ? await resolveConfiguredPositionSymbols(position) : [];
    if (position.botId && !configuredSymbols.includes(position.symbol)) {
      console.warn(
        `[RuntimePositionAutomation] position=${position.id} symbol=${position.symbol} skipped: symbol outside configured bot scope`
      );
      await recordRuntimeAutomationSkipTelemetry({
        recordRuntimeEvent: this.deps.recordRuntimeEvent,
        event,
        position,
        inheritedExecutionContext,
        strategyId: effectiveStrategyId,
        reason: 'position_symbol_outside_configured_scope',
        message: 'Runtime automation skipped because position symbol is outside configured bot scope',
        extraPayload: { configuredSymbols },
      });
      return;
    }
    if (position.botId && !effectiveStrategyId && enabledCanonicalStrategyLinkIds.length > 1) {
      console.warn(`[RuntimePositionAutomation] position=${position.id} symbol=${position.symbol} skipped: missing strategy ownership for multi-strategy bot`);
      await recordRuntimeAutomationSkipTelemetry({
        recordRuntimeEvent: this.deps.recordRuntimeEvent,
        event,
        position,
        inheritedExecutionContext,
        strategyId: effectiveStrategyId,
        reason: 'multi_strategy_position_provenance_missing',
        message: 'Runtime automation skipped because multi-strategy position strategy provenance is missing',
        extraPayload: { enabledStrategyLinkCount: enabledCanonicalStrategyLinkIds.length },
      });
      return;
    }

    const mode = inheritedExecutionContext.mode;
    const exchange = inheritedExecutionContext.exchange;
    const marketType = inheritedExecutionContext.marketType;
    if (event.exchange !== exchange || event.marketType !== marketType) return;

    const runtimeConfig = getRuntimeConfig();
    const strategyConfig = await this.getStrategyConfig(effectiveStrategyId);
    const dcaPolicyBlock = resolveRuntimeDcaPolicyBlock(strategyConfig);
    if (dcaPolicyBlock) {
      if (position.botId) {
        await this.deps.recordRuntimeEvent?.({
          userId: position.userId,
          botId: position.botId,
          mode,
          eventType: 'PRETRADE_BLOCKED',
          level: 'WARN',
          symbol: position.symbol,
          strategyId: effectiveStrategyId ?? undefined,
          message: dcaPolicyBlock.message,
          payload: { positionId: position.id, reason: dcaPolicyBlock.code,
            ...(dcaPolicyBlock.multiplier == null ? {} : { multiplier: dcaPolicyBlock.multiplier }) },
          eventAt: new Date(event.eventTime),
        });
      }
      return;
    }
    const lifecyclePrice =
      (await this.deps.resolveLifecyclePrice?.({
        exchange,
        marketType,
        symbol: position.symbol,
        fallbackPrice: event.lastPrice,
      })) ?? event.lastPrice;
    const effectiveLifecyclePrice =
      resolvePreferredRuntimeOrExchangeSyncedPrice({
        origin: position.origin,
        status: position.status,
        side: position.side,
        entryPrice: position.entryPrice,
        quantity: position.quantity,
        unrealizedPnl: position.unrealizedPnl ?? null,
        lastExchangeSyncAt: position.lastExchangeSyncAt ?? null,
        runtimePriceCandidates: [
          {
            price: Number.isFinite(lifecyclePrice) && lifecyclePrice > 0 ? lifecyclePrice : event.lastPrice,
            observedAtMs:
              typeof event.eventTime === 'number' && Number.isFinite(event.eventTime)
                ? event.eventTime
                : null,
          },
        ],
      }) ?? (Number.isFinite(lifecyclePrice) && lifecyclePrice > 0 ? lifecyclePrice : event.lastPrice);
    const input = buildPositionManagementInput(position, effectiveLifecyclePrice, strategyConfig, runtimeConfig);
    const defaultState = {
      quantity: position.quantity,
      averageEntryPrice: position.entryPrice,
      currentAdds: 0,
      executedDcaLevelIndices: undefined,
      trailingAnchorPrice: position.entryPrice,
      lastDcaPrice: undefined,
    } as PositionManagementState;
    const persistedState = this.positionStates.get(position.id) ?? (await runtimePositionStateStore.getPositionRuntimeState(position.id));
    const durableDcaProgress = await this.deps.getDurableDcaProgress({
      userId: position.userId,
      positionId: position.id,
      botId: position.botId,
      walletId: inheritedExecutionContext.walletId ?? position.walletId ?? position.bot?.walletId ?? null,
      strategyId: effectiveStrategyId,
      symbol: position.symbol,
      positionSide: position.side,
      sizingBasis: input.dca?.sizingBasis,
    });
    if (input.dca?.sizingBasis === 'usdt_contribution_v1'
      && (!durableDcaProgress
        || durableDcaProgress.currentAdds < (persistedState?.currentAdds ?? 0)
        || (durableDcaProgress.currentAdds > 0
          && durableDcaProgress.executedDcaLevelIndices?.length !== durableDcaProgress.currentAdds))) {
      if (position.botId) await this.deps.recordRuntimeEvent?.({
        userId: position.userId, botId: position.botId, mode,
        eventType: 'PRETRADE_BLOCKED', level: 'WARN', symbol: position.symbol,
        strategyId: effectiveStrategyId ?? undefined,
        message: 'Runtime USDT DCA progress cannot be reconciled with durable fills',
        payload: { positionId: position.id, reason: 'DCA_PROGRESS_UNCONFIRMED' },
        eventAt: new Date(event.eventTime),
      });
      return;
    }
    const stateRebasedToCanonical = hasMaterialCanonicalBasisDrift({ position, state: persistedState ?? null });
    const canonicalRebase = stateRebasedToCanonical && position.origin === 'BOT' && persistedState
      ? tryRebasePositionManagementProtection(persistedState, position.entryPrice,
          position.side, position.leverage || 1) : null;
    if (stateRebasedToCanonical && position.origin === 'BOT' && persistedState && !canonicalRebase) {
      console.warn(`[RuntimePositionAutomation] position=${position.id} skipped: trailing protection cannot be rebased`);
      return;
    }
    const basePreviousState = stateRebasedToCanonical
      ? position.origin === 'BOT' && persistedState
        ? { ...canonicalRebase!, quantity: position.quantity, averageEntryPrice: position.entryPrice }
        : defaultState
      : persistedState ?? defaultState;
    const previousState =
      durableDcaProgress && (durableDcaProgress.currentAdds > basePreviousState.currentAdds
        || (durableDcaProgress.currentAdds === basePreviousState.currentAdds
          && (durableDcaProgress.executedDcaLevelIndices?.length ?? 0) > 0))
        ? {
            ...basePreviousState,
            currentAdds: durableDcaProgress.currentAdds,
            executedDcaLevelIndices: durableDcaProgress.executedDcaLevelIndices
              ?? basePreviousState.executedDcaLevelIndices,
            lastDcaPrice: durableDcaProgress.lastDcaPrice ?? basePreviousState.lastDcaPrice,
          }
        : basePreviousState;
    const previousStateSnapshot = clonePositionManagementState(previousState);
    const currentPnlFraction = resolveRuntimeCurrentPnlFraction({
      side: position.side,
      currentPrice: effectiveLifecyclePrice,
      leverage: Math.max(1, position.leverage || 1),
      marginUsed: position.marginUsed ?? null,
      unrealizedPnl:
        position.origin === 'EXCHANGE_SYNC' && typeof position.unrealizedPnl === 'number'
          ? position.unrealizedPnl
          : null,
      state: previousState,
    });

    const paperStartBalance = inheritedExecutionContext.paperStartBalance;
    const dcaLevelCount = resolveDcaLevelCount(input);
    const executedDcaLevelCount = previousState.executedDcaLevelIndices?.length ?? previousState.currentAdds;
    const hasPendingDca = input.dca?.enabled && executedDcaLevelCount < dcaLevelCount;
    const estimatedAddedQuantity = hasPendingDca
      ? estimateNextDcaAddedQuantity(input, previousState, currentPnlFraction ?? undefined)
      : 0;
    let dcaFundsExhausted =
      input.dca?.sizingBasis !== 'usdt_contribution_v1' && hasPendingDca && estimatedAddedQuantity > 0
        ? await this.deps.resolveDcaFundsExhausted({
            userId: position.userId,
            botId: position.botId,
            walletId: inheritedExecutionContext.walletId ?? position.walletId ?? position.bot?.walletId ?? null,
            mode,
            exchange,
            marketType,
            paperStartBalance,
            markPrice: effectiveLifecyclePrice,
            addedQuantity: estimatedAddedQuantity,
            leverage: Math.max(1, position.leverage || 1),
            nowMs: this.deps.nowMs(),
          })
        : false;
    if (dcaFundsExhausted) {
      await recordRuntimeDcaFundsExhaustedTelemetry({
        recordRuntimeEvent: this.deps.recordRuntimeEvent,
        userId: position.userId,
        botId: position.botId,
        mode,
        symbol: position.symbol,
        strategyId: effectiveStrategyId,
        side: position.side,
        eventAt: new Date(event.eventTime),
        currentAdds: previousState.currentAdds,
        dcaLevelCount,
        estimatedAddedQuantity,
        markPrice: effectiveLifecyclePrice,
        leverage: Math.max(1, position.leverage || 1),
      });
    }
    const managementInput: PositionManagementInput = dcaFundsExhausted
      ? {
          ...input,
          currentPnlFraction: currentPnlFraction ?? undefined,
          dca: undefined,
          dcaFundsExhausted: true,
        }
      : {
          ...input,
          currentPnlFraction: currentPnlFraction ?? undefined,
          dcaFundsExhausted: false,
        };

    let result = evaluatePositionManagement(managementInput, previousState);
    let effectiveState = clonePositionManagementState(result.nextState);
    let dcaPendingExchangeFill = false;

    if (result.dcaExecuted) {
      const dcaAddedQuantity = Number.isFinite(result.dcaAddedQuantity)
        ? Math.max(0, result.dcaAddedQuantity)
        : Math.max(0, result.nextState.quantity - previousState.quantity);
      if (dcaAddedQuantity > 0) {
        let dcaResult: Awaited<ReturnType<RuntimePositionAutomationDeps['executeDca']>> | null = null;
        try {
          dcaResult = await this.deps.executeDca({
            userId: position.userId, botId: position.botId,
            walletId: inheritedExecutionContext.walletId ?? position.walletId ?? position.bot?.walletId ?? null,
            strategyId: effectiveStrategyId, positionId: position.id,
            symbol: position.symbol, positionSide: position.side,
            dcaLevelIndex: result.dcaLevelIndex ?? previousState.currentAdds,
            markPrice: effectiveLifecyclePrice, mode, addedQuantity: dcaAddedQuantity,
            currentQuantity: previousState.quantity, currentEntryPrice: previousState.averageEntryPrice,
            eventAt: new Date(event.eventTime),
          });
        } catch (error) {
          if (!(error instanceof RuntimeDcaPolicyError) || error.code !== 'DCA_FUNDS_EXHAUSTED' ||
            input.dca?.sizingBasis !== 'usdt_contribution_v1') throw error;
          dcaFundsExhausted = true;
          await recordRuntimeDcaFundsExhaustedTelemetry({
            recordRuntimeEvent: this.deps.recordRuntimeEvent, userId: position.userId,
            botId: position.botId, mode, symbol: position.symbol,
            strategyId: effectiveStrategyId, side: position.side, eventAt: new Date(event.eventTime),
            currentAdds: previousState.currentAdds, dcaLevelCount, estimatedAddedQuantity: dcaAddedQuantity,
            markPrice: effectiveLifecyclePrice, leverage: Math.max(1, position.leverage || 1),
          });
          const fallback = evaluatePositionManagement({ ...input,
            currentPnlFraction: currentPnlFraction ?? undefined, dcaFundsExhausted: true,
          }, previousStateSnapshot);
          if (fallback.shouldClose && fallback.closeReason === 'stop_loss') {
            result = fallback; effectiveState = clonePositionManagementState(fallback.nextState);
          } else {
            effectiveState = previousStateSnapshot; dcaPendingExchangeFill = true;
          }
        }
        if (dcaResult?.executed) {
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
            const rebasedProtection = input.dca?.sizingBasis === 'usdt_contribution_v1'
              ? rebasePositionManagementProtection({ ...result.nextState,
                  averageEntryPrice: previousStateSnapshot.averageEntryPrice },
                canonicalState.averageEntryPrice, position.side, position.leverage || 1)
              : result.nextState;
            effectiveState = {
              ...rebasedProtection,
              quantity: canonicalState.quantity,
              averageEntryPrice: canonicalState.averageEntryPrice,
            };
          }
        } else if (dcaResult) {
          effectiveState = previousStateSnapshot;
          dcaPendingExchangeFill = true;
        }
        if (position.botId && dcaResult?.executed && !dcaResult.replayed && !dcaResult.telemetryRecorded) {
          const eventAt = new Date(event.eventTime);
          await this.deps.recordRuntimeEvent?.({
            userId: position.userId,
            botId: position.botId,
            mode,
            eventType: 'DCA_EXECUTED',
            level: 'INFO',
            symbol: position.symbol,
            strategyId: effectiveStrategyId ?? undefined,
            signalDirection: position.side === 'LONG' ? 'LONG' : 'SHORT',
            message: 'Runtime DCA executed',
            payload: {
              addedQuantity: dcaAddedQuantity,
              orderId: dcaResult.orderId ?? null,
              positionId: position.id,
              financialFeePending: mode === 'LIVE',
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
              ...(mode === 'LIVE' ? {} : { feesPaid: dcaResult.feePaid }),
            },
            lastPrice: effectiveLifecyclePrice,
            lastTradeAt: eventAt,
            openPositionQty: effectiveState.quantity,
          });
          if (mode === 'LIVE' && dcaResult.orderId) {
            await prisma.$transaction((tx) => settleRuntimeOrderFee({
              tx, userId: position.userId, orderId: dcaResult.orderId!,
            }));
          }
        }
      }
    }
    this.positionStates.set(position.id, effectiveState);

    if (dcaPendingExchangeFill) {
      if (stateRebasedToCanonical || !positionManagementStatesEqual(previousStateSnapshot, effectiveState)) {
        await runtimePositionStateStore.setPositionRuntimeState(position.id, effectiveState);
      }
      return;
    }

    const hasPendingSubmittedDca =
      (await this.deps.hasPendingSubmittedDcaForPosition?.(position.id)) ?? false;
    if (result.shouldClose && hasPendingSubmittedDca) {
      if (stateRebasedToCanonical || !positionManagementStatesEqual(previousStateSnapshot, effectiveState)) {
        await runtimePositionStateStore.setPositionRuntimeState(position.id, effectiveState);
      }
      return;
    }

    if (result.shouldClose) {
      await recordRuntimeProtectionCloseDecisionTelemetry({
        recordRuntimeEvent: this.deps.recordRuntimeEvent,
        userId: position.userId,
        botId: position.botId,
        mode,
        positionId: position.id,
        symbol: position.symbol,
        strategyId: effectiveStrategyId,
        eventAt: new Date(event.eventTime),
        closeReason: result.closeReason,
        currentAdds: previousState.currentAdds,
        dcaLevelCount,
        dcaFundsExhausted,
        estimatedAddedQuantity,
        markPrice: effectiveLifecyclePrice,
        leverage: Math.max(1, position.leverage || 1),
        currentPnlFraction,
      });
      const closeResult = await this.deps.closeByExitSignal({
        userId: position.userId,
        botId: position.botId ?? undefined,
        walletId: inheritedExecutionContext.walletId ?? position.walletId ?? position.bot?.walletId ?? null,
        strategyId: effectiveStrategyId ?? undefined,
        symbol: position.symbol,
        markPrice: effectiveLifecyclePrice,
        mode,
        quantity: effectiveState.quantity,
        reason: result.closeReason,
      });
      if (closeResult.status === 'closed') {
        await runtimePositionStateStore.deletePositionRuntimeState(position.id);
        this.positionStates.delete(position.id);
      } else if (stateRebasedToCanonical || !positionManagementStatesEqual(previousStateSnapshot, effectiveState)) {
        await runtimePositionStateStore.setPositionRuntimeState(position.id, effectiveState);
      }
      return;
    }

    if (stateRebasedToCanonical || !positionManagementStatesEqual(previousStateSnapshot, effectiveState)) {
      await runtimePositionStateStore.setPositionRuntimeState(position.id, effectiveState);
    }
  }
}

export const runtimePositionAutomationService = new RuntimePositionAutomationService();
