import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { DomainError, isAppErrorLike } from '../../lib/errors';
import { orderErrors } from './orders.errors';

const CONTROL_ID = 'global';
// One PostgreSQL advisory key across all API and worker processes.
export const LIVE_EXECUTION_PAUSE_LOCK_KEY = 1701300739;
const LOCK_KEY = LIVE_EXECUTION_PAUSE_LOCK_KEY;

export type LiveExecutionPauseStatus = {
  available: boolean;
  paused: boolean;
  reason: string | null;
  version: number | null;
  changedAt: string | null;
  changedByUserId: string | null;
};

export const readLiveExecutionPause = async (db: PrismaClient = prisma): Promise<LiveExecutionPauseStatus> => {
  try {
    const control = await db.liveExecutionControl.findUnique({ where: { id: CONTROL_ID } });
    return control ? {
      available: true,
      paused: control.paused,
      reason: control.reason,
      version: control.version,
      changedAt: control.changedAt.toISOString(),
      changedByUserId: control.changedByUserId,
    } : {
      available: false, paused: true, reason: 'Control row missing',
      version: null, changedAt: null, changedByUserId: null,
    };
  } catch {
    return {
      available: false, paused: true, reason: 'Control store unavailable',
      version: null, changedAt: null, changedByUserId: null,
    };
  }
};

export const setLiveExecutionPause = async (input: {
  actorUserId: string;
  paused: boolean;
  reason: string;
  expectedVersion: number;
}, db: PrismaClient = prisma): Promise<LiveExecutionPauseStatus> => {
  const reason = input.reason.trim();
  if (reason.length < 10 || reason.length > 500 ||
      !Number.isInteger(input.expectedVersion) || input.expectedVersion < 1) {
    throw new DomainError('LIVE_PAUSE_INVALID_CHANGE', 'Reason or version is invalid', { status: 400 });
  }
  try {
    const control = await db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT 1 AS locked FROM (SELECT pg_advisory_xact_lock(${LOCK_KEY})) AS acquired`;
      const actor = await tx.user.findUnique({
        where: { id: input.actorUserId }, select: { role: true },
      });
      if (actor?.role !== 'ADMIN') {
        throw new DomainError('LIVE_PAUSE_ADMIN_REQUIRED', 'Admin role required', { status: 403 });
      }
      const current = await tx.liveExecutionControl.findUnique({ where: { id: CONTROL_ID } });
      if (!current) throw orderErrors.livePretradePauseUnavailable();
      if (current.version !== input.expectedVersion) {
        throw new DomainError('LIVE_PAUSE_VERSION_CONFLICT', 'Refresh LIVE pause state', { status: 409 });
      }
      if (current.paused === input.paused) {
        throw new DomainError('LIVE_PAUSE_UNCHANGED', 'LIVE pause state is already set', { status: 409 });
      }
      const next = await tx.liveExecutionControl.update({
        where: { id: CONTROL_ID },
        data: {
          paused: input.paused, reason,
          version: { increment: 1 }, changedByUserId: input.actorUserId,
          changedAt: new Date(),
        },
      });
      await tx.log.create({ data: {
        userId: input.actorUserId,
        action: input.paused ? 'LIVE_PAUSED' : 'LIVE_RESUMED',
        level: 'WARN', source: 'ADMIN', category: 'LIVE_EXECUTION',
        entityType: 'LiveExecutionControl', entityId: CONTROL_ID,
        actor: input.actorUserId,
        message: input.paused ? 'Global LIVE submissions paused' : 'Global LIVE submissions resumed',
        metadata: {
          reason, previousVersion: current.version,
          nextVersion: next.version,
        },
      } });
      return next;
    }, { maxWait: 10_000, timeout: 120_000 });
    return {
      available: true, paused: control.paused, reason: control.reason,
      version: control.version, changedAt: control.changedAt.toISOString(),
      changedByUserId: control.changedByUserId,
    };
  } catch (error) {
    if (isAppErrorLike(error)) throw error;
    throw orderErrors.livePretradePauseUnavailable();
  }
};

/** Acquire the shared pause key in a caller-owned transaction held through submit. */
export const assertLiveCreateOrderPermittedInTransaction = async (
  input: { marketType: 'spot' | 'swap' | 'future'; reduceOnly: boolean },
  tx: Prisma.TransactionClient,
) => {
  await tx.$queryRaw`SELECT 1 AS locked FROM (SELECT pg_advisory_xact_lock_shared(${LOCK_KEY})) AS acquired`;
  const control = await tx.liveExecutionControl.findUnique({ where: { id: CONTROL_ID } });
  if (!control) throw orderErrors.livePretradePauseUnavailable();
  if (control.paused && !(input.reduceOnly && input.marketType !== 'spot')) {
    throw orderErrors.livePretradePaused();
  }
};

/** Hold a shared DB lock through createOrder. Pause/resume takes the exclusive lock. */
export const withLiveCreateOrderPermit = async <T>(
  input: { marketType: 'spot' | 'swap' | 'future'; reduceOnly: boolean },
  submit: () => Promise<T>,
  db: PrismaClient = prisma,
): Promise<T> => {
  let submitStarted = false;
  try {
    return await db.$transaction(async (tx: Prisma.TransactionClient) => {
      await assertLiveCreateOrderPermittedInTransaction(input, tx);
      submitStarted = true;
      return submit();
    }, { maxWait: 10_000, timeout: 120_000 });
  } catch (error) {
    if (submitStarted || isAppErrorLike(error)) throw error;
    throw orderErrors.livePretradePauseUnavailable();
  }
};
