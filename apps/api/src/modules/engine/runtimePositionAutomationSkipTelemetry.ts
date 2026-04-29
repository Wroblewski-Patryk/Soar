import { BotMode, PositionSide } from '@prisma/client';
import { StreamTickerEvent } from '../market-stream/binanceStream.types';

export type RuntimeAutomationSkipReason =
  | 'continuity_state_unconfirmed'
  | 'missing_exchange_sync_bot_ownership'
  | 'missing_bot_origin_ownership'
  | 'canonical_execution_context_unresolved'
  | 'execution_context_unresolved'
  | 'live_opt_in_disabled';

type RuntimeAutomationTelemetryPosition = {
  id: string;
  userId: string;
  botId: string | null;
  strategyId: string | null;
  symbol: string;
  side: PositionSide;
  managementMode: string;
  origin: string;
  continuityState: string;
  bot:
    | {
        wallet:
          | {
              mode: BotMode;
            }
          | null;
      }
    | null;
};

type RuntimeAutomationTelemetryContext = {
  mode: 'PAPER' | 'LIVE';
} | null;

type RecordRuntimeEventFn = (params: {
  userId: string;
  botId: string;
  mode: 'PAPER' | 'LIVE';
  eventType: 'PRETRADE_BLOCKED';
  level: 'WARN';
  symbol?: string;
  strategyId?: string;
  signalDirection?: 'LONG' | 'SHORT' | 'EXIT';
  message?: string;
  payload?: Record<string, unknown>;
  eventAt?: Date;
}) => Promise<void>;

const resolveRuntimeAutomationTelemetryMode = (
  position: RuntimeAutomationTelemetryPosition,
  inheritedExecutionContext: RuntimeAutomationTelemetryContext
) => {
  if (inheritedExecutionContext?.mode) return inheritedExecutionContext.mode;
  if (position.bot?.wallet?.mode) return position.bot.wallet.mode;
  if (position.origin === 'EXCHANGE_SYNC') return 'LIVE' as const;
  return null;
};

export const recordRuntimeAutomationSkipTelemetry = async (input: {
  recordRuntimeEvent?: RecordRuntimeEventFn;
  event: StreamTickerEvent;
  position: RuntimeAutomationTelemetryPosition;
  inheritedExecutionContext?: RuntimeAutomationTelemetryContext;
  reason: RuntimeAutomationSkipReason;
  message: string;
  extraPayload?: Record<string, unknown>;
}) => {
  if (!input.position.botId) return;
  const mode = resolveRuntimeAutomationTelemetryMode(
    input.position,
    input.inheritedExecutionContext ?? null
  );
  if (mode !== 'LIVE') return;
  await input.recordRuntimeEvent?.({
    userId: input.position.userId,
    botId: input.position.botId,
    mode,
    eventType: 'PRETRADE_BLOCKED',
    level: 'WARN',
    symbol: input.position.symbol,
    strategyId: input.position.strategyId ?? undefined,
    signalDirection: input.position.side === 'LONG' ? 'LONG' : 'SHORT',
    message: input.message,
    payload: {
      positionId: input.position.id,
      continuityState: input.position.continuityState,
      origin: input.position.origin,
      managementMode: input.position.managementMode,
      skipReason: input.reason,
      ...(input.extraPayload ?? {}),
    },
    eventAt: new Date(input.event.eventTime),
  });
};
