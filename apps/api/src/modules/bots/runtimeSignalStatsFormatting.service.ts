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
  if (reason === 'global_kill_switch_enabled') return 'Global kill switch enabled';
  if (reason === 'emergency_stop_enabled') return 'Emergency stop enabled';
  if (reason === 'live_bot_required') return 'Live bot required';
  if (reason === 'live_bot_not_found') return 'Live bot not found';
  if (reason === 'live_mode_bot_required') return 'Live mode bot required';
  if (reason === 'live_opt_in_required') return 'Live opt-in required';
  if (reason === 'live_consent_version_required') return 'Live consent version required';
  if (reason === 'bot_market_type_mismatch') return 'Bot market type mismatch';
  if (reason === 'user_open_positions_limit_reached') return 'User open positions limit reached';
  if (reason === 'bot_open_positions_limit_reached') return 'Bot open positions limit reached';
  if (reason === 'open_position_on_symbol_exists') return 'Open position on symbol exists';
  if (reason === 'daily_loss_limit_reached') return 'Daily loss limit reached';
  if (reason === 'drawdown_limit_reached') return 'Drawdown limit reached';
  if (reason === 'consecutive_losses_limit_reached') return 'Consecutive losses limit reached';
  if (reason === 'loss_cooldown_active') return 'Loss cooldown active';
  if (reason === 'no_open_position') return 'No open position';
  if (reason === 'no_flip_with_open_position') return 'No flip with open position';
  if (reason === 'already_open_same_side') return 'Already open same side';
  if (reason === 'manual_managed_symbol') return 'Manual managed symbol';
  if (reason === 'dedupe_inflight') return 'Duplicate signal in flight';
  if (reason === 'dedupe_reused') return 'Duplicate signal reused';
  return reason;
};
