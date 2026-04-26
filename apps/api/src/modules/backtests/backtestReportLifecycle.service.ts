import { Prisma } from '@prisma/client';

import { upsertBacktestReportForRun, updateBacktestRunById } from './backtests.repository';

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

const isMissingBacktestReportParentError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  (error.code === 'P2025' || error.code === 'P2003');

export const safeUpdateRun = async (runId: string, data: Prisma.BacktestRunUpdateInput) => {
  try {
    await updateBacktestRunById(runId, data);
    return true;
  } catch (error) {
    if (isMissingRunUpdateError(error)) return false;
    throw error;
  }
};

export const safeUpsertBacktestReportForRun = async (input: {
  backtestRunId: string;
  create: Prisma.BacktestReportUncheckedCreateInput;
  update: Prisma.BacktestReportUpdateInput;
}) => {
  try {
    await upsertBacktestReportForRun(input);
    return true;
  } catch (error) {
    if (isMissingBacktestReportParentError(error)) return false;
    throw error;
  }
};
