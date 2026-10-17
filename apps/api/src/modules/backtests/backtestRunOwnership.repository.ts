import { randomUUID } from 'node:crypto';
import { BacktestStatus, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';

export const BACKTEST_LEASE_MS = 10 * 60 * 1_000;

const leaseUntil = () => new Date(Date.now() + BACKTEST_LEASE_MS);

export const listRecoverableBacktestRunIds = async (scopeIds?: string[]) => {
  const now = new Date();
  const runs = await prisma.backtestRun.findMany({
    where: {
      ...(scopeIds ? { id: { in: scopeIds } } : {}),
      OR: [
        { status: 'PENDING' },
        {
          status: 'RUNNING',
          OR: [
            { executionLeaseExpiresAt: null },
            { executionLeaseExpiresAt: { lte: now } },
          ],
        },
      ],
    },
    select: { id: true },
    orderBy: { createdAt: 'asc' },
    take: 500,
  });
  return runs.map((run) => run.id);
};

export const listDiscardableBacktestRunIds = async (ids: string[]) => {
  if (ids.length === 0) return [];
  const runs = await prisma.backtestRun.findMany({
    where: { id: { in: ids } },
    select: { id: true, status: true },
  });
  const activeIds = new Set(runs.filter((run) =>
    run.status === 'PENDING' || run.status === 'RUNNING').map((run) => run.id));
  return ids.filter((id) => !activeIds.has(id));
};

export const claimBacktestRun = async (runId: string) => {
  const token = randomUUID();
  const now = new Date();
  const result = await prisma.backtestRun.updateMany({
    where: {
      id: runId,
      OR: [
        { status: 'PENDING' },
        {
          status: 'RUNNING',
          OR: [
            { executionLeaseExpiresAt: null },
            { executionLeaseExpiresAt: { lte: now } },
          ],
        },
      ],
    },
    data: {
      status: 'RUNNING',
      executionToken: token,
      executionLeaseExpiresAt: leaseUntil(),
    },
  });
  return result.count === 1 ? token : null;
};

const ownedRunWhere = (runId: string, token: string) => ({
  id: runId,
  status: 'RUNNING' as const,
  executionToken: token,
  executionLeaseExpiresAt: { gt: new Date() },
});

export const renewBacktestRunLease = async (runId: string, token: string) => {
  const result = await prisma.backtestRun.updateMany({
    where: ownedRunWhere(runId, token),
    data: { executionLeaseExpiresAt: leaseUntil() },
  });
  return result.count === 1;
};

export const updateClaimedBacktestRun = async (
  runId: string,
  token: string,
  data: Prisma.BacktestRunUpdateManyMutationInput,
) => {
  const result = await prisma.backtestRun.updateMany({
    where: ownedRunWhere(runId, token),
    data: { ...data, executionLeaseExpiresAt: leaseUntil() },
  });
  return result.count === 1;
};

export type ClaimedBacktestReport = {
  backtestRunId: string;
  create: Prisma.BacktestReportUncheckedCreateInput;
  update: Prisma.BacktestReportUpdateInput;
};

export const commitClaimedBacktestRun = async (input: {
  runId: string;
  token: string;
  userId: string;
  status: Extract<BacktestStatus, 'COMPLETED' | 'FAILED'>;
  seedConfig: Prisma.InputJsonValue;
  trades: Prisma.BacktestTradeCreateManyInput[];
  report: ClaimedBacktestReport;
}) => prisma.$transaction(async (tx) => {
  const result = await tx.backtestRun.updateMany({
    where: ownedRunWhere(input.runId, input.token),
    data: {
      status: input.status,
      finishedAt: new Date(),
      seedConfig: input.seedConfig,
      executionToken: null,
      executionLeaseExpiresAt: null,
    },
  });
  if (result.count !== 1) return false;

  await tx.backtestTrade.deleteMany({
    where: { userId: input.userId, backtestRunId: input.runId },
  });
  if (input.trades.length > 0) {
    await tx.backtestTrade.createMany({ data: input.trades });
  }
  await tx.backtestReport.upsert({
    where: { backtestRunId: input.runId },
    create: input.report.create,
    update: input.report.update,
  });
  return true;
}, { timeout: 120_000 });
