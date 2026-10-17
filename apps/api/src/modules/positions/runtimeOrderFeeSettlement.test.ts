import { describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { settleRuntimeOrderFee } from './runtimeOrderFeeSettlement';

describe('runtime entry fee settlement', () => {
  it('keeps unknown fees pending, settles explicit zero, and applies a corrected fee once', async () => {
    const user = await prisma.user.create({
      data: { email: 'runtime-entry-fee-settlement@example.com', password: 'hashed' },
    });
    try {
      const bot = await prisma.bot.create({
        data: { userId: user.id, name: 'fee bot', mode: 'LIVE', exchange: 'BINANCE',
          marketType: 'FUTURES', positionMode: 'ONE_WAY', isActive: true },
      });
      const session = await prisma.botRuntimeSession.create({
        data: { userId: user.id, botId: bot.id, mode: 'LIVE' },
      });
      const order = await prisma.order.create({
        data: { userId: user.id, botId: bot.id, symbol: 'BTCUSDT', side: 'BUY',
          type: 'MARKET', status: 'FILLED', quantity: 1, filledQuantity: 1,
          fee: null, feePending: true },
      });
      await prisma.trade.create({
        data: { userId: user.id, botId: bot.id, orderId: order.id, symbol: 'BTCUSDT',
          side: 'BUY', lifecycleAction: 'OPEN', price: 100, quantity: 1,
          fee: null, feePending: true, executionMode: 'LIVE' },
      });
      const event = await prisma.botRuntimeEvent.create({
        data: { userId: user.id, botId: bot.id, sessionId: session.id,
          eventType: 'POSITION_OPENED', symbol: 'BTCUSDT',
          payload: { orderId: order.id, financialFeePending: true } },
      });
      await prisma.botRuntimeSymbolStat.create({
        data: { userId: user.id, botId: bot.id, sessionId: session.id,
          symbol: 'BTCUSDT', feesPaid: 0 },
      });
      const settle = () => prisma.$transaction((tx) => settleRuntimeOrderFee({
        tx, userId: user.id, orderId: order.id,
      }));
      await settle();
      expect((await prisma.botRuntimeEvent.findUniqueOrThrow({ where: { id: event.id } })).payload)
        .toMatchObject({ financialFeePending: true });

      await prisma.order.update({ where: { id: order.id },
        data: { fee: 0, feePending: false, feeSource: 'EXCHANGE_FILL' } });
      await prisma.trade.updateMany({ where: { orderId: order.id },
        data: { fee: 0, feePending: false, feeSource: 'EXCHANGE_FILL' } });
      await settle();
      await settle();
      expect((await prisma.botRuntimeEvent.findUniqueOrThrow({ where: { id: event.id } })).payload)
        .toMatchObject({ financialFeePending: false, feeSettlement: 0 });
      expect((await prisma.botRuntimeSymbolStat.findUniqueOrThrow({
        where: { sessionId_symbol: { sessionId: session.id, symbol: 'BTCUSDT' } },
      })).feesPaid).toBe(0);

      await prisma.order.update({ where: { id: order.id }, data: { fee: 0.2 } });
      await prisma.trade.updateMany({ where: { orderId: order.id }, data: { fee: 0.2 } });
      await settle();
      await settle();
      expect((await prisma.botRuntimeSymbolStat.findUniqueOrThrow({
        where: { sessionId_symbol: { sessionId: session.id, symbol: 'BTCUSDT' } },
      })).feesPaid).toBeCloseTo(0.2);
    } finally {
      await prisma.botRuntimeEvent.deleteMany({ where: { userId: user.id } });
      await prisma.botRuntimeSymbolStat.deleteMany({ where: { userId: user.id } });
      await prisma.trade.deleteMany({ where: { userId: user.id } });
      await prisma.order.deleteMany({ where: { userId: user.id } });
      await prisma.botRuntimeSession.deleteMany({ where: { userId: user.id } });
      await prisma.bot.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
  });
});
