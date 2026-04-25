import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';

const registerAndLogin = async (email: string) => {
  const agent = request.agent(app);
  const res = await agent.post('/auth/register').send({
    email,
    password: 'test1234',
  });
  expect(res.status).toBe(201);
  return agent;
};

describe('Orders manual PAPER market truth', () => {
  beforeEach(async () => {
    await prisma.log.deleteMany();
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.user.deleteMany();
  });

  it('rejects PAPER MARKET open when canonical fill price truth is unavailable', async () => {
    const ownerAgent = await registerAndLogin('manual-paper-market-price-truth@example.com');
    const ownerId =
      (await prisma.user.findUniqueOrThrow({
        where: { email: 'manual-paper-market-price-truth@example.com' },
        select: { id: true },
      })).id;

    const openRes = await ownerAgent.post('/dashboard/orders/open').send({
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'MARKET',
      quantity: 0.05,
      mode: 'PAPER',
      riskAck: false,
    });

    expect(openRes.status).toBe(400);
    expect(openRes.body.error.message).toBe(
      'PAPER MARKET order requires canonical fill price truth'
    );

    const persistedOrders = await prisma.order.findMany({
      where: { userId: ownerId },
    });
    const persistedPositions = await prisma.position.findMany({
      where: { userId: ownerId },
    });

    expect(persistedOrders).toHaveLength(0);
    expect(persistedPositions).toHaveLength(0);
  });
});
