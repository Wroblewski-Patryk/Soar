import { prisma } from '../../prisma/client';

export const RUNTIME_DCA_QUANTITY_MULTIPLIER_LIMIT = 2;

export type RuntimeDcaPolicyBlock = {
  code: 'INVALID_DCA_SIZING_BASIS' | 'INVALID_DCA_USDT_CONFIG'
    | 'DCA_MULTIPLIER_EXCEEDS_RUNTIME_LIMIT'
    | 'RUNTIME_DCA_STRATEGY_UNAVAILABLE' | 'RUNTIME_DCA_OWNERSHIP_MISMATCH'
    | 'DCA_CONTRIBUTION_UNCONFIRMED' | 'DCA_FUNDS_EXHAUSTED'
    | 'DCA_ORDER_RULES_INVALID';
  message: string;
  multiplier?: number;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;

const strategyUnavailableBlock = (): RuntimeDcaPolicyBlock => ({
  code: 'RUNTIME_DCA_STRATEGY_UNAVAILABLE',
  message: 'Runtime strategy configuration is unavailable; automated position decisions are blocked',
});

const ownershipMismatchBlock = (): RuntimeDcaPolicyBlock => ({
  code: 'RUNTIME_DCA_OWNERSHIP_MISMATCH',
  message: 'Runtime DCA request does not match canonical position ownership',
});

const unconfirmedContributionBlock = (): RuntimeDcaPolicyBlock => ({
  code: 'DCA_CONTRIBUTION_UNCONFIRMED',
  message: 'Runtime DCA contribution or requested add cannot be confirmed from the canonical position',
});

export const resolveRuntimeDcaPolicyBlock = (strategyConfig: unknown): RuntimeDcaPolicyBlock | null => {
  const config = asRecord(strategyConfig);
  if (!config) return strategyUnavailableBlock();
  const additional = asRecord(config.additional);
  if (!additional) return null;

  if (additional.dcaSizingBasis != null && additional.dcaSizingBasis !== 'quantity_v1'
    && additional.dcaSizingBasis !== 'usdt_contribution_v1') {
    return {
      code: 'INVALID_DCA_SIZING_BASIS',
      message: 'Runtime DCA sizing basis is not recognized',
    };
  }

  if (additional.dcaSizingBasis === 'usdt_contribution_v1') {
    if (additional.dcaEnabled !== true) return null;
    const levels = Array.isArray(additional.dcaLevels) ? additional.dcaLevels.map(asRecord) : [];
    const mode = additional.dcaMode ?? 'basic';
    const validLevel = (level: Record<string, unknown> | null) => {
      const percent = Number(level?.percent);
      const multiplier = Number(level?.multiplier);
      return level != null && Number.isFinite(percent) && percent !== 0
        && Number.isFinite(multiplier) && multiplier > 0 && multiplier <= 10;
    };
    const valid = (mode === 'basic' && Number.isInteger(additional.dcaTimes)
      && Number(additional.dcaTimes) > 0 && levels.length > 0 && validLevel(levels[0]))
      || (mode === 'advanced' && levels.length > 0 && levels.every(validLevel));
    return valid ? null : {
      code: 'INVALID_DCA_USDT_CONFIG',
      message: 'Runtime USDT DCA requires complete thresholds and multipliers',
    };
  }
  if (additional.dcaEnabled === false) return null;
  const levels = Array.isArray(additional.dcaLevels) ? additional.dcaLevels : [];
  const multipliers = [additional.dcaMultiplier, ...levels.map((level) => asRecord(level)?.multiplier)];
  const aboveLimit = multipliers
    .map((value) => Number(value))
    .find((value) => Number.isFinite(value) && value > RUNTIME_DCA_QUANTITY_MULTIPLIER_LIMIT);
  return aboveLimit == null
    ? null
    : {
        code: 'DCA_MULTIPLIER_EXCEEDS_RUNTIME_LIMIT',
        message: `PAPER and LIVE quantity DCA multiplier cannot exceed ${RUNTIME_DCA_QUANTITY_MULTIPLIER_LIMIT}`,
        multiplier: aboveLimit,
      };
};

export class RuntimeDcaPolicyError extends Error {
  readonly code: RuntimeDcaPolicyBlock['code'];
  readonly block: RuntimeDcaPolicyBlock;

  constructor(block: RuntimeDcaPolicyBlock) {
    super(block.message);
    this.name = 'RuntimeDcaPolicyError';
    this.code = block.code;
    this.block = block;
  }
}

export const assertRuntimeDcaPolicy = (strategyConfig: unknown) => {
  const block = resolveRuntimeDcaPolicyBlock(strategyConfig);
  if (block) throw new RuntimeDcaPolicyError(block);
};

export const assertRuntimeDcaOrderAllowed = async (input: {
  userId: string;
  positionId: string;
  botId?: string | null;
  strategyId?: string | null;
  symbol?: string;
  positionSide?: 'LONG' | 'SHORT';
  dcaLevelIndex?: number;
  markPrice?: number;
  addedQuantity?: number;
  currentQuantity?: number;
  currentEntryPrice?: number;
}) => {
  const position = await prisma.position.findFirst({
    where: { id: input.positionId, userId: input.userId },
    select: {
      strategyId: true,
      botId: true,
      walletId: true,
      symbol: true,
      side: true,
      status: true,
      syncState: true,
      origin: true,
      continuityState: true,
      entryPrice: true,
      quantity: true,
      leverage: true,
      marginUsed: true,
      bot: {
        select: {
          strategyId: true,
          walletId: true,
          isActive: true,
          wallet: { select: { mode: true, exchange: true, marketType: true, paperInitialBalance: true } },
          botMarketGroups: {
            where: { isEnabled: true, lifecycleStatus: 'ACTIVE' },
            select: { strategyLinks: { where: { isEnabled: true }, select: { strategyId: true } } },
          },
        },
      },
    },
  });
  if (!position) throw new RuntimeDcaPolicyError(strategyUnavailableBlock());
  if (position.botId && !position.bot) throw new RuntimeDcaPolicyError(strategyUnavailableBlock());
  const linkedStrategyIds = [...new Set(
    (position.bot?.botMarketGroups ?? []).flatMap((group) => group.strategyLinks.map((link) => link.strategyId))
  )];
  const strategyId = position.strategyId
    ?? (linkedStrategyIds.length === 1 ? linkedStrategyIds[0]
      : linkedStrategyIds.length === 0 ? position.bot?.strategyId : null);
  if ((input.botId != null && input.botId !== position.botId)
    || (input.strategyId != null && input.strategyId !== strategyId)) {
    throw new RuntimeDcaPolicyError(ownershipMismatchBlock());
  }
  if (!strategyId) throw new RuntimeDcaPolicyError(strategyUnavailableBlock());
  const strategy = await prisma.strategy.findFirst({
    where: { id: strategyId, userId: input.userId },
    select: { config: true, leverage: true },
  });
  if (!strategy) throw new RuntimeDcaPolicyError(strategyUnavailableBlock());
  assertRuntimeDcaPolicy(strategy.config);
  const additional = asRecord(asRecord(strategy.config)?.additional);
  if (additional?.dcaSizingBasis !== 'usdt_contribution_v1') return;

  const levels = Array.isArray(additional.dcaLevels) ? additional.dcaLevels.map(asRecord) : [];
  const index = input.dcaLevelIndex;
  const maxAdds = additional.dcaMode === 'advanced' ? levels.length : Number(additional.dcaTimes);
  const level = additional.dcaMode === 'advanced' ? levels[index ?? -1] : levels[0];
  const multiplier = Number(level?.multiplier ?? additional.dcaMultiplier);
  const near = (a: number, b: number) => Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b));
  if (additional.dcaEnabled !== true || !Number.isInteger(index) || index! < 0 || index! >= maxAdds
    || !Number.isFinite(multiplier) || multiplier <= 0 || multiplier > 10
    || position.status !== 'OPEN' || position.syncState !== 'IN_SYNC'
    || position.continuityState !== 'CONFIRMED'
    || (position.origin !== 'BOT' && position.origin !== 'EXCHANGE_SYNC')
    || !position.botId || input.botId !== position.botId
    || input.strategyId !== strategyId || position.bot?.isActive !== true
    || position.symbol !== input.symbol || position.side !== input.positionSide
    || !position.symbol?.toUpperCase().endsWith('USDT') || !position.bot?.wallet
    || !Number.isFinite(position.entryPrice) || position.entryPrice <= 0
    || !Number.isFinite(position.quantity) || position.quantity <= 0
    || !Number.isFinite(position.leverage) || position.leverage < 1
    || (position.bot?.wallet?.marketType === 'SPOT' && position.leverage !== 1)
    || (position.bot?.wallet?.marketType === 'FUTURES' && strategy.leverage !== position.leverage)
    || (position.origin === 'EXCHANGE_SYNC' && position.bot?.wallet?.marketType === 'FUTURES'
      && (!Number.isFinite(position.marginUsed)
        || !near(position.marginUsed ?? Number.NaN,
          position.entryPrice * position.quantity / position.leverage)))
    || !Number.isFinite(input.markPrice) || (input.markPrice ?? 0) <= 0
    || !Number.isFinite(input.addedQuantity) || (input.addedQuantity ?? 0) <= 0
    || !near(position.quantity, input.currentQuantity ?? Number.NaN)
    || !near(position.entryPrice, input.currentEntryPrice ?? Number.NaN)
    || !near(position.entryPrice * position.quantity * multiplier / input.markPrice!, input.addedQuantity!)) {
    throw new RuntimeDcaPolicyError(unconfirmedContributionBlock());
  }
  return {
    walletId: position.walletId ?? position.bot.walletId,
    mode: position.bot.wallet.mode,
    exchange: position.bot.wallet.exchange,
    marketType: position.bot.wallet.marketType,
    paperStartBalance: position.bot.wallet.paperInitialBalance,
    leverage: position.leverage,
  };
};
