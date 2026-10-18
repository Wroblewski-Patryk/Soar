import { PositionManagementInput, PositionManagementResult, PositionManagementState } from './positionManagement.types';
import { isAppErrorLike } from '../../lib/errors';
import { evaluatePositionManagement } from './positionManagement.service';

export const resolvePauseAwareManagementInput = async (params: {
  mode: 'PAPER' | 'LIVE';
  marketType: 'FUTURES' | 'SPOT';
  input: PositionManagementInput;
  readLiveExecutionPause: () => Promise<{ available: boolean; paused: boolean }>;
}): Promise<{ input: PositionManagementInput; paused: boolean } | null> => {
  if (params.mode !== 'LIVE') return { input: params.input, paused: false };
  const pause = await params.readLiveExecutionPause();
  if (!pause.available || (pause.paused && params.marketType === 'SPOT')) return null;
  // Pending DCA must remain visible to SL/TSL and TP/TTP protection evaluation.
  return { input: params.input, paused: pause.paused };
};

export const buildManagementPassInput = (
  input: PositionManagementInput,
  currentPnlFraction: number | null,
  dcaFundsExhausted: boolean,
): PositionManagementInput => ({
  ...input,
  currentPnlFraction: currentPnlFraction ?? undefined,
  dcaFundsExhausted,
  ...(dcaFundsExhausted ? { dca: undefined } : {}),
});

export const guardPausedFundsExhaustion = (params: {
  paused: boolean; fundsExhausted: boolean; input: PositionManagementInput;
  state: PositionManagementState; result: PositionManagementResult;
}): PositionManagementResult => {
  if (!params.paused || !params.fundsExhausted || !params.input.dca?.enabled) return params.result;
  const guarded = evaluatePositionManagement({ ...params.input, dcaFundsExhausted: false }, params.state);
  const reachedLossDca = guarded.dcaExecuted &&
    (params.input.dca.levelPercents?.[guarded.dcaLevelIndex ?? -1] ?? 0) < 0;
  if (params.result.closeReason === 'stop_loss' && reachedLossDca) return params.result;
  return guarded.dcaExecuted ? { ...guarded, shouldClose: false, closeReason: undefined } : guarded;
};

export const classifyRuntimeDcaFailure = (error: unknown, unknownAfterSubmission: boolean) => {
  if (unknownAfterSubmission) return 'live_execution_unknown';
  if (isAppErrorLike(error) &&
      (error.code === 'LIVE_PRETRADE_PAUSED' || error.code === 'LIVE_PRETRADE_PAUSE_UNAVAILABLE')) {
    return error.code.toLowerCase();
  }
  return error instanceof Error && error.name ? error.name : 'runtime_dca_error';
};
