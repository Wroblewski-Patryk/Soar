import { PositionManagementInput } from './positionManagement.types';
import { isAppErrorLike } from '../../lib/errors';

export const resolvePauseAwareManagementInput = async (params: {
  mode: 'PAPER' | 'LIVE';
  marketType: 'FUTURES' | 'SPOT';
  input: PositionManagementInput;
  readLiveExecutionPause: () => Promise<{ available: boolean; paused: boolean }>;
}): Promise<PositionManagementInput | null> => {
  if (params.mode !== 'LIVE') return params.input;
  const pause = await params.readLiveExecutionPause();
  if (!pause.available || (pause.paused && params.marketType === 'SPOT')) return null;
  // Keep the confirmed position state; skip only proposed DCA while paused.
  return pause.paused ? { ...params.input, dca: undefined } : params.input;
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

export const classifyRuntimeDcaFailure = (error: unknown, unknownAfterSubmission: boolean) => {
  if (unknownAfterSubmission) return 'live_execution_unknown';
  if (isAppErrorLike(error) &&
      (error.code === 'LIVE_PRETRADE_PAUSED' || error.code === 'LIVE_PRETRADE_PAUSE_UNAVAILABLE')) {
    return error.code.toLowerCase();
  }
  return error instanceof Error && error.name ? error.name : 'runtime_dca_error';
};
