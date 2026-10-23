import { afterEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { closeOrder } from './orders.service';

afterEach(() => vi.restoreAllMocks());

describe('owner manual close independent of DCA automation', () => {
  it('closes an owned open order and position without reading strategy DCA state', async () => {
    const existing = {
      id: 'order-1', userId: 'user-1', botId: 'bot-1',
      strategyId: 'usdt-strategy', positionId: 'position-1',
      status: 'OPEN', syncState: 'IN_SYNC', exchangeOrderId: null,
      quantity: 1,
    };
    vi.spyOn(prisma.order, 'findFirst').mockResolvedValue(existing as any);
    const updateOrder = vi.spyOn(prisma.order, 'update').mockResolvedValue({
      ...existing, status: 'FILLED', closeReason: 'MANUAL', closeInitiator: 'USER_APP',
    } as any);
    const updatePosition = vi.spyOn(prisma.position, 'updateMany').mockResolvedValue({ count: 1 });
    vi.spyOn(prisma.log, 'create').mockResolvedValue({ id: 'audit-1' } as any);
    const readStrategy = vi.spyOn(prisma.strategy, 'findFirst');

    const closed = await closeOrder('user-1', 'order-1', { riskAck: true });

    expect(closed?.status).toBe('FILLED');
    expect(updateOrder).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'order-1' },
      data: expect.objectContaining({ closeReason: 'MANUAL', closeInitiator: 'USER_APP' }),
    }));
    expect(updatePosition).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ id: 'position-1', userId: 'user-1' }),
      data: expect.objectContaining({ status: 'CLOSED', closeReason: 'MANUAL' }),
    }));
    expect(readStrategy).not.toHaveBeenCalled();
  });
});
