import { z } from 'zod';

export const PositionSideSchema = z.enum(['LONG', 'SHORT']);

export const TrailingStopConfigSchema = z.object({
  enabled: z.boolean().default(false),
  type: z.enum(['percent', 'absolute']).default('percent'),
  value: z.number().positive(),
  armPercent: z.number().nonnegative().max(10).optional(),
});

export const TrailingTakeProfitConfigSchema = z.object({
  enabled: z.boolean().default(false),
  armPercent: z.number().positive().max(2),
  trailPercent: z.number().positive().max(1),
});

export const TrailingTakeProfitLevelSchema = z.object({
  armPercent: z.number().positive().max(10),
  trailPercent: z.number().positive().max(1),
});

export const TrailingStopLevelSchema = z.object({
  armPercent: z.number().nonnegative().max(10),
  type: z.enum(['percent', 'absolute']).default('percent'),
  value: z.number().positive(),
});

export const TrailingLossConfigSchema = z.object({
  enabled: z.boolean().default(false),
  startPercent: z.number(),
  stepPercent: z.number().positive().max(10),
});

// Missing in stored strategy configs means the original quantity-based behavior.
// The explicit USDT mode is opt-in until PAPER and LIVE are migrated separately.
export const DcaSizingBasisSchema = z.enum(['quantity_v1', 'usdt_contribution_v1']);
export type DcaSizingBasis = z.infer<typeof DcaSizingBasisSchema>;

export const DcaConfigSchema = z.object({
  enabled: z.boolean().default(false),
  maxAdds: z.number().int().min(0).default(0),
  stepPercent: z.number().positive().max(1).default(0.01),
  addSizeFraction: z.number().positive().max(10).default(0.5),
  levelPercents: z.array(z.number().min(-10).max(10)).optional(),
  addSizeFractions: z.array(z.number().positive().max(10)).optional(),
  sizingBasis: DcaSizingBasisSchema.default('quantity_v1'),
}).superRefine((config, context) => {
  if (config.sizingBasis !== 'quantity_v1') return;
  if (config.addSizeFraction > 2) {
    context.addIssue({ code: 'custom', path: ['addSizeFraction'], message: 'quantity DCA multiplier cannot exceed 2' });
  }
  config.addSizeFractions?.forEach((multiplier, index) => {
    if (multiplier > 2) {
      context.addIssue({ code: 'custom', path: ['addSizeFractions', index], message: 'quantity DCA multiplier cannot exceed 2' });
    }
  });
});

export const PositionManagementInputSchema = z.object({
  side: PositionSideSchema,
  currentPrice: z.number().positive(),
  leverage: z.number().positive().default(1),
  currentPnlFraction: z.number().optional(),
  dcaFundsExhausted: z.boolean().optional(),
  takeProfitPrice: z.number().positive().optional(),
  stopLossPrice: z.number().positive().optional(),
  trailingStop: TrailingStopConfigSchema.optional(),
  trailingTakeProfit: TrailingTakeProfitConfigSchema.optional(),
  trailingTakeProfitLevels: z.array(TrailingTakeProfitLevelSchema).optional(),
  trailingStopLevels: z.array(TrailingStopLevelSchema).optional(),
  trailingLoss: TrailingLossConfigSchema.optional(),
  dca: DcaConfigSchema.optional(),
});

export const PositionManagementStateSchema = z.object({
  averageEntryPrice: z.number().positive(),
  quantity: z.number().positive(),
  currentAdds: z.number().int().min(0).default(0),
  executedDcaLevelIndices: z.array(z.number().int().min(0)).optional(),
  trailingAnchorPrice: z.number().positive().optional(),
  trailingLossLimitPercent: z.number().optional(),
  trailingTakeProfitHighPercent: z.number().optional(),
  trailingTakeProfitStepPercent: z.number().optional(),
  lastDcaPrice: z.number().positive().optional(),
});

export type PositionManagementInput = z.input<typeof PositionManagementInputSchema>;
export type PositionManagementState = z.infer<typeof PositionManagementStateSchema>;

export type PositionManagementResult = {
  shouldClose: boolean;
  closeReason?: 'take_profit' | 'trailing_take_profit' | 'stop_loss' | 'trailing_stop';
  dcaExecuted: boolean;
  dcaAddedQuantity: number;
  dcaLevelIndex?: number;
  nextState: PositionManagementState;
};
