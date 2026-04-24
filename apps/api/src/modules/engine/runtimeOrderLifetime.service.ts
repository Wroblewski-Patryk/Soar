import { OrderStatus } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { isAppErrorLike } from '../../lib/errors';
import { cancelOrder as cancelOrderLifecycle } from '../orders/orders.service';
import { ORDER_ERROR_CODES } from '../orders/orders.errors';
import { buildCancelExecutionDedupeKey, runtimeExecutionDedupeService } from './runtimeExecutionDedupe.service';
import { ActiveBot } from './runtimeSignalLoopDefaults';
import { resolveStrategyLifetimePolicy } from './strategyLifetimePolicy';

type RuntimeCancelableOrderStatus = Extract<OrderStatus, 'PENDING' | 'OPEN' | 'PARTIALLY_FILLED'>;

export type RuntimeStaleOrderCandidate = {
  id: string;
  userId: string;
  botId: string | null;
  positionId: string | null;
  symbol: string;
  status: RuntimeCancelableOrderStatus;
  submittedAt: Date | null;
  createdAt: Date;
};

type RuntimeOrderLifetimeDeps = {
  now?: () => Date;
  listStaleOrders?: (params: {
    userId: string;
    botId: string;
    olderThanMs: number;
    now: Date;
  }) => Promise<RuntimeStaleOrderCandidate[]>;
  cancelOrder?: typeof cancelOrderLifecycle;
  acquireCancelDedupe?: typeof runtimeExecutionDedupeService.acquire;
  markCancelDedupeSucceeded?: typeof runtimeExecutionDedupeService.markSucceeded;
  markCancelDedupeFailed?: typeof runtimeExecutionDedupeService.markFailed;
};

const CANCELABLE_ORDER_STATUSES: RuntimeCancelableOrderStatus[] = ['PENDING', 'OPEN', 'PARTIALLY_FILLED'];

const defaultDeps: Required<RuntimeOrderLifetimeDeps> = {
  now: () => new Date(),
  listStaleOrders: async ({ userId, botId, olderThanMs, now }) => {
    const cutoff = new Date(now.getTime() - olderThanMs);
    const orders = await prisma.order.findMany({
      where: {
        userId,
        botId,
        status: { in: CANCELABLE_ORDER_STATUSES },
        OR: [
          { submittedAt: { lte: cutoff } },
          {
            submittedAt: null,
            createdAt: { lte: cutoff },
          },
        ],
      },
      select: {
        id: true,
        userId: true,
        botId: true,
        positionId: true,
        symbol: true,
        status: true,
        submittedAt: true,
        createdAt: true,
      },
      orderBy: [{ submittedAt: 'asc' }, { createdAt: 'asc' }],
    });
    return orders.map((order) => ({
      ...order,
      status: order.status as RuntimeCancelableOrderStatus,
    }));
  },
  cancelOrder: cancelOrderLifecycle,
  acquireCancelDedupe: (input) => runtimeExecutionDedupeService.acquire(input),
  markCancelDedupeSucceeded: (input) => runtimeExecutionDedupeService.markSucceeded(input),
  markCancelDedupeFailed: (input) => runtimeExecutionDedupeService.markFailed(input),
};

const isOrderAlreadyTerminal = (error: unknown) =>
  isAppErrorLike(error) && error.code === ORDER_ERROR_CODES.orderNotCancelable;

const cancelStaleOrder = async (
  order: RuntimeStaleOrderCandidate,
  olderThanMs: number,
  deps: Required<RuntimeOrderLifetimeDeps>,
  now: Date
) => {
  const dedupeKey = buildCancelExecutionDedupeKey({
    userId: order.userId,
    botId: order.botId,
    symbol: order.symbol,
    orderId: order.id,
    reasonCode: 'stale_open',
  });
  const dedupe = await deps.acquireCancelDedupe({
    dedupeKey,
    commandType: 'CANCEL',
    userId: order.userId,
    botId: order.botId,
    symbol: order.symbol,
    commandFingerprint: {
      orderId: order.id,
      status: order.status,
      staleReason: 'order_lifetime_expired',
      olderThanMs,
      orderAgeAnchor: (order.submittedAt ?? order.createdAt).toISOString(),
    },
    now,
  });

  if (dedupe.outcome !== 'execute') {
    return;
  }

  try {
    const canceled = await deps.cancelOrder(order.userId, order.id, { riskAck: true });
    await deps.markCancelDedupeSucceeded({
      dedupeKey,
      orderId: canceled?.id ?? order.id,
      positionId: canceled?.positionId ?? order.positionId,
      now,
    });
  } catch (error) {
    if (isOrderAlreadyTerminal(error)) {
      await deps.markCancelDedupeSucceeded({
        dedupeKey,
        orderId: order.id,
        positionId: order.positionId,
        now,
      });
      return;
    }

    await deps.markCancelDedupeFailed({
      dedupeKey,
      errorClass: error instanceof Error ? error.name : 'runtime_order_lifetime_cancel_failed',
      now,
    });
    throw error;
  }
};

export const enforceRuntimeOrderLifetimes = async (
  activeBots: ActiveBot[],
  deps: RuntimeOrderLifetimeDeps = defaultDeps
) => {
  const resolvedDeps = {
    ...defaultDeps,
    ...deps,
  };
  const now = resolvedDeps.now();

  for (const bot of activeBots) {
    const policy = resolveStrategyLifetimePolicy({
      strategyConfig: bot.runtimeContext?.strategy.strategyConfig,
      kind: 'order',
    });
    if (!policy.enabled || !policy.durationMs) continue;

    const staleOrders = await resolvedDeps.listStaleOrders({
      userId: bot.userId,
      botId: bot.id,
      olderThanMs: policy.durationMs,
      now,
    });

    for (const order of staleOrders) {
      await cancelStaleOrder(order, policy.durationMs, resolvedDeps, now);
    }
  }
};
