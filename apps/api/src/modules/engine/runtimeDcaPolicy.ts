import { prisma } from '../../prisma/client';

export const RUNTIME_DCA_QUANTITY_MULTIPLIER_LIMIT = 2;

export type RuntimeDcaPolicyBlock = {
  code: 'USDT_DCA_RUNTIME_UNSUPPORTED' | 'DCA_MULTIPLIER_EXCEEDS_RUNTIME_LIMIT'
    | 'RUNTIME_DCA_STRATEGY_UNAVAILABLE' | 'RUNTIME_DCA_OWNERSHIP_MISMATCH';
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

export const resolveRuntimeDcaPolicyBlock = (strategyConfig: unknown): RuntimeDcaPolicyBlock | null => {
  const config = asRecord(strategyConfig);
  if (!config) return strategyUnavailableBlock();
  const additional = asRecord(config.additional);
  if (!additional) return null;

  if (additional.dcaSizingBasis != null && additional.dcaSizingBasis !== 'quantity_v1') {
    return {
      code: 'USDT_DCA_RUNTIME_UNSUPPORTED',
      message: 'USDT contribution DCA is available only in BACKTEST; PAPER and LIVE runtime are blocked',
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
}) => {
  const position = await prisma.position.findFirst({
    where: { id: input.positionId, userId: input.userId },
    select: {
      strategyId: true,
      botId: true,
      bot: {
        select: {
          strategyId: true,
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
    select: { config: true },
  });
  if (!strategy) throw new RuntimeDcaPolicyError(strategyUnavailableBlock());
  assertRuntimeDcaPolicy(strategy.config);
};
