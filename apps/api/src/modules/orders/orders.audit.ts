import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';

export const writeOrderAudit = async (params: {
  userId: string;
  orderId: string;
  action: 'order.opened' | 'order.canceled' | 'order.closed';
  level: 'INFO' | 'WARN';
  metadata?: Record<string, unknown>;
}) => {
  try {
    await prisma.log.create({
      data: {
        userId: params.userId,
        action: params.action,
        level: params.level,
        source: 'orders.service',
        message: `Order lifecycle event: ${params.action}`,
        category: 'TRADING_DECISION',
        entityType: 'ORDER',
        entityId: params.orderId,
        metadata: (params.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  } catch {
    // Audit failures should not block order lifecycle.
  }
};
