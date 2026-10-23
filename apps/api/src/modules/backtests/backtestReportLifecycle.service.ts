import { Prisma } from '@prisma/client';

import { updateBacktestRunById } from './backtests.repository';

export const isTerminalBacktestStatus = (status: string) =>
  status === 'COMPLETED' || status === 'FAILED' || status === 'CANCELED';

export const buildRunLifecyclePayload = (params: {
  status: string;
  reportReady: boolean;
  generatedAt?: string | null;
  degraded?: boolean;
  reason?: string;
}) => ({
  state: params.status,
  reportReady: params.reportReady,
  generatedAt: params.generatedAt ?? null,
  degraded: params.degraded ?? false,
  ...(params.reason ? { reason: params.reason } : {}),
});

const isMissingRunUpdateError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';

export const safeUpdateRun = async (runId: string, data: Prisma.BacktestRunUpdateInput) => {
  try {
    await updateBacktestRunById(runId, data);
    return true;
  } catch (error) {
    if (isMissingRunUpdateError(error)) return false;
    throw error;
  }
};
