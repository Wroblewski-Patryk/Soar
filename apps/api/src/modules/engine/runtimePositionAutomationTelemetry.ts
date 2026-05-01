type RuntimePositionAutomationEventRecorder = (params: {
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

export const recordRuntimeDcaFundsExhaustedTelemetry = async (params: {
  recordRuntimeEvent?: RuntimePositionAutomationEventRecorder;
  userId: string;
  botId?: string | null;
  mode: 'PAPER' | 'LIVE';
  symbol: string;
  strategyId?: string | null;
  side: 'LONG' | 'SHORT';
  eventAt: Date;
  currentAdds: number;
  dcaLevelCount: number;
  estimatedAddedQuantity: number;
  markPrice: number;
  leverage: number;
}) => {
  if (!params.botId) return;
  await params.recordRuntimeEvent?.({
    userId: params.userId,
    botId: params.botId,
    mode: params.mode,
    eventType: 'PRETRADE_BLOCKED',
    level: 'WARN',
    symbol: params.symbol,
    strategyId: params.strategyId ?? undefined,
    signalDirection: params.side,
    message: 'Runtime DCA funds exhausted; close protections may execute',
    payload: {
      reason: 'dca_funds_exhausted',
      currentAdds: params.currentAdds,
      dcaLevelCount: params.dcaLevelCount,
      estimatedAddedQuantity: params.estimatedAddedQuantity,
      markPrice: params.markPrice,
      leverage: params.leverage,
    },
    eventAt: params.eventAt,
  });
};

export const recordRuntimeProtectionCloseDecisionTelemetry = async (params: {
  recordRuntimeEvent?: RuntimePositionAutomationEventRecorder;
  userId: string;
  botId?: string | null;
  mode: 'PAPER' | 'LIVE';
  positionId: string;
  symbol: string;
  strategyId?: string | null;
  eventAt: Date;
  closeReason?: 'take_profit' | 'trailing_take_profit' | 'stop_loss' | 'trailing_stop';
  currentAdds: number;
  dcaLevelCount: number;
  dcaFundsExhausted: boolean;
  estimatedAddedQuantity: number;
  markPrice: number;
  leverage: number;
  currentPnlFraction?: number | null;
}) => {
  if (!params.botId) return;
  await params.recordRuntimeEvent?.({
    userId: params.userId,
    botId: params.botId,
    mode: params.mode,
    eventType: 'SIGNAL_DECISION',
    level: 'INFO',
    symbol: params.symbol,
    strategyId: params.strategyId ?? undefined,
    signalDirection: 'EXIT',
    message: 'Runtime protection close decision',
    payload: {
      positionId: params.positionId,
      reason: params.closeReason,
      currentAdds: params.currentAdds,
      dcaLevelCount: params.dcaLevelCount,
      dcaFundsExhausted: params.dcaFundsExhausted,
      estimatedAddedQuantity: params.estimatedAddedQuantity,
      markPrice: params.markPrice,
      leverage: params.leverage,
      currentPnlFraction: params.currentPnlFraction ?? null,
    },
    eventAt: params.eventAt,
  });
};
