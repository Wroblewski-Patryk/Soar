export const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

export const toFiniteNumber = (value: unknown): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const humanizeMergeReason = (reason: string | null) => {
  if (reason === 'weighted_winner') return 'Weighted winner';
  if (reason === 'exit_priority') return 'Exit priority';
  if (reason === 'weak_consensus') return 'Weak consensus';
  if (reason === 'tie') return 'Tie';
  if (reason === 'no_votes') return 'No votes';
  return reason;
};

export const humanizeRuntimeBlockReason = (reason: string | null) => {
  if (reason === 'BOT_MAX_OPEN_POSITIONS_REACHED') return 'Bot max open positions reached';
  if (reason === 'EXTERNAL_POSITION_ALREADY_OPEN') return 'External position already open';
  if (reason === 'EXCHANGE_MIN_ORDER_CONSTRAINT') return 'Exchange minimum order constraint';
  if (reason === 'WALLET_INSUFFICIENT_FUNDS') return 'Wallet insufficient funds';
  if (reason === 'no_open_position') return 'No open position';
  if (reason === 'no_flip_with_open_position') return 'No flip with open position';
  if (reason === 'already_open_same_side') return 'Already open same side';
  if (reason === 'manual_managed_symbol') return 'Manual managed symbol';
  if (reason === 'dedupe_inflight') return 'Duplicate signal in flight';
  if (reason === 'dedupe_reused') return 'Duplicate signal reused';
  return reason;
};
