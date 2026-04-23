export type RuntimeSignalContextSource =
  | 'latest_signal'
  | 'latest_decision'
  | 'configured_fallback'
  | 'unresolved';

export type RuntimeMarketTruthState =
  | 'POSITION_OPEN'
  | 'SIGNAL_ACTIVE'
  | 'EVALUATED_NO_TRADE'
  | 'CONFIGURED_ONLY'
  | 'UNRESOLVED';

export const resolveRuntimeMarketTruthState = (params: {
  openPositionCount: number;
  signalContextSource: RuntimeSignalContextSource;
  signalDirection: 'LONG' | 'SHORT' | 'EXIT' | null;
}) => {
  if (params.openPositionCount > 0) {
    return 'POSITION_OPEN' as const;
  }
  if (params.signalDirection === 'LONG' || params.signalDirection === 'SHORT') {
    return 'SIGNAL_ACTIVE' as const;
  }
  if (params.signalContextSource === 'latest_decision') {
    return 'EVALUATED_NO_TRADE' as const;
  }
  if (params.signalContextSource === 'configured_fallback') {
    return 'CONFIGURED_ONLY' as const;
  }
  return 'UNRESOLVED' as const;
};

export const hasAcceptedRuntimeSignal = (signalDirection: 'LONG' | 'SHORT' | 'EXIT' | null) =>
  signalDirection === 'LONG' || signalDirection === 'SHORT';
