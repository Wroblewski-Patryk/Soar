import { Prisma } from '@prisma/client';
import { createBacktestRunJob, type BacktestRunJobDeps, type CreateContributionInput, type CreateTradeInput } from './backtestRunJob';
import {
  BACKTEST_LEASE_MS,
  claimBacktestRun,
  commitClaimedBacktestRun,
  renewBacktestRunLease,
  updateClaimedBacktestRun,
  type ClaimedBacktestReport,
} from './backtestRunOwnership.repository';

export class BacktestClaimLostError extends Error {
  constructor() {
    super('Backtest execution lease lost');
    this.name = 'BacktestClaimLostError';
  }
}

type ClaimStore = {
  claim: typeof claimBacktestRun;
  renew: typeof renewBacktestRunLease;
  update: typeof updateClaimedBacktestRun;
  commit: typeof commitClaimedBacktestRun;
};

type GuardedDependency =
  | 'safeUpdateRun'
  | 'createBacktestTrades'
  | 'createBacktestContributions'
  | 'deleteBacktestTradesForRun'
  | 'countWinningBacktestTrades'
  | 'countLosingBacktestTrades'
  | 'upsertBacktestReportForRun';

type ClaimedBacktestRunDeps = Omit<BacktestRunJobDeps, GuardedDependency>;

const defaultClaimStore: ClaimStore = {
  claim: claimBacktestRun,
  renew: renewBacktestRunLease,
  update: updateClaimedBacktestRun,
  commit: commitClaimedBacktestRun,
};

export const createClaimedBacktestRunJob = (
  deps: ClaimedBacktestRunDeps,
  store: ClaimStore = defaultClaimStore,
) => async (runId: string) => {
  const token = await store.claim(runId);
  if (!token) return;
  const run = await deps.findBacktestRunById(runId);
  if (!run) return;

  const trades: CreateTradeInput[] = [];
  const contributions: CreateContributionInput[] = [];
  let report: ClaimedBacktestReport | null = null;
  let active = true;
  let timer: NodeJS.Timeout | null = null;

  const stopHeartbeat = () => {
    active = false;
    if (timer) clearTimeout(timer);
    timer = null;
  };
  const heartbeat = async () => {
    if (!active) return;
    try {
      if (!(await store.renew(runId, token))) {
        stopHeartbeat();
        return;
      }
    } catch {
      stopHeartbeat();
      return;
    }
    if (active) timer = setTimeout(() => void heartbeat(), BACKTEST_LEASE_MS / 4);
  };
  timer = setTimeout(() => void heartbeat(), BACKTEST_LEASE_MS / 4);

  const assertActive = () => {
    if (!active) throw new BacktestClaimLostError();
  };
  try {
    const job = createBacktestRunJob({
      ...deps,
      findBacktestRunById: async () => run,
      safeUpdateRun: async (_id, data) => {
        assertActive();
        const status = data.status;
        if (status === 'COMPLETED' || status === 'FAILED') {
          if (!report) throw new Error('Backtest report missing at terminal commit');
          const committed = await store.commit({
            runId,
            token,
            userId: run.userId,
            status,
            seedConfig: data.seedConfig as Prisma.InputJsonValue,
            trades: status === 'COMPLETED' ? trades : [],
            contributions: status === 'COMPLETED' ? contributions : [],
            report,
          });
          if (!committed) throw new BacktestClaimLostError();
          stopHeartbeat();
          return true;
        }
        const updated = await store.update(
          runId,
          token,
          data as Prisma.BacktestRunUpdateManyMutationInput,
        );
        if (!updated) throw new BacktestClaimLostError();
        return true;
      },
      deleteBacktestTradesForRun: async () => {
        assertActive();
        trades.length = 0;
        contributions.length = 0;
      },
      createBacktestTrades: async (items) => {
        assertActive();
        trades.push(...items);
      },
      createBacktestContributions: async (items) => {
        assertActive();
        contributions.push(...items);
      },
      countWinningBacktestTrades: async () => trades.filter((trade) => trade.pnl > 0).length,
      countLosingBacktestTrades: async () => trades.filter((trade) => trade.pnl < 0).length,
      upsertBacktestReportForRun: async (input) => {
        assertActive();
        report = input as ClaimedBacktestReport;
      },
      fetchKlines: async (...args) => {
        assertActive();
        const result = await deps.fetchKlines(...args);
        assertActive();
        return result;
      },
      fetchSupplementalSeries: async (...args) => {
        assertActive();
        const result = await deps.fetchSupplementalSeries(...args);
        assertActive();
        return result;
      },
      fetchVerifiedArchivedIntrabarForRun: deps.fetchVerifiedArchivedIntrabarForRun
        ? async (id, exchange, symbol, timeframe, marketType, maxCandles,
          endTimeMs, startTimeMs, expectedDigest) => {
          assertActive();
          const result = await deps.fetchVerifiedArchivedIntrabarForRun!(id,
            exchange, symbol, timeframe, marketType, maxCandles,
            endTimeMs, startTimeMs, expectedDigest, token);
          assertActive();
          return result;
        } : undefined,
      fetchVerifiedRawTradeV4ForRun: deps.fetchVerifiedRawTradeV4ForRun
        ? async (id, exchange, symbol, timeframe, marketType, maxCandles,
          endTimeMs, startTimeMs, expectedDigest) => {
          assertActive();
          const result = await deps.fetchVerifiedRawTradeV4ForRun!(id,
            exchange, symbol, timeframe, marketType, maxCandles,
            endTimeMs, startTimeMs, expectedDigest, token);
          assertActive();
          return result;
        } : undefined,
    });
    await job(runId);
  } catch (error) {
    if (!(error instanceof BacktestClaimLostError)) throw error;
  } finally {
    stopHeartbeat();
  }
};
