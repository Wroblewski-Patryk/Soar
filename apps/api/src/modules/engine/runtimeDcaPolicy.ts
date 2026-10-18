import { prisma } from '../../prisma/client';

export const RUNTIME_DCA_QUANTITY_MULTIPLIER_LIMIT = 2;

export type RuntimeDcaPolicyBlock = {
  code: 'USDT_DCA_RUNTIME_UNSUPPORTED' | 'DCA_MULTIPLIER_EXCEEDS_RUNTIME_LIMIT' | 'RUNTIME_DCA_STRATEGY_UNAVAILABLE';
  message: string;
  multiplier?: number;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;

export const resolveRuntimeDcaPolicyBlock = (strategyConfig: unknown): RuntimeDcaPolicyBlock | null => {
  const additional = asRecord(asRecord(strategyConfig)?.additional);
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
  const positionStrategyId = input.strategyId ?? (await prisma.position.findFirst({
    where: { id: input.positionId, userId: input.userId },
    select: { strategyId: true },
  }))?.strategyId;
  const strategyId = positionStrategyId ?? (input.botId ? (await prisma.bot.findFirst({
    where: { id: input.botId, userId: input.userId },
    select: { strategyId: true },
  }))?.strategyId : null);
  if (!strategyId) throw new RuntimeDcaPolicyError({
    code: 'RUNTIME_DCA_STRATEGY_UNAVAILABLE',
    message: 'Runtime DCA strategy configuration is unavailable',
  });
  const strategy = await prisma.strategy.findFirst({
    where: { id: strategyId, userId: input.userId },
    select: { config: true },
  });
  if (!strategy) throw new RuntimeDcaPolicyError({
    code: 'RUNTIME_DCA_STRATEGY_UNAVAILABLE',
    message: 'Runtime DCA strategy configuration is unavailable',
  });
  assertRuntimeDcaPolicy(strategy.config);
};
