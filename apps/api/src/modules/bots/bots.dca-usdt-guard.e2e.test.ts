import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  createMarketGroup, createPayload, createStrategy, registerAndLogin, resetBotsE2eState,
} from './bots.e2e.shared';

describe('bot USDT DCA runtime guard', () => {
  beforeEach(resetBotsE2eState);

  it.each([2, 5])('saves BACKTEST strategy but rejects PAPER bot attachment with multiplier %s', async (multiplier) => {
    const email = `bots-usdt-dca-${multiplier}@example.com`;
    const agent = await registerAndLogin(email);
    const strategyId = await createStrategy(agent, `USDT DCA ${multiplier}`, {
      open: { indicatorsLong: [], indicatorsShort: [] },
      close: { mode: 'basic', tp: 99, sl: 99 },
      additional: { dcaEnabled: true, dcaMode: 'basic', dcaTimes: 1,
        dcaSizingBasis: 'usdt_contribution_v1',
        dcaLevels: [{ percent: -20, multiplier }] },
    });
    const marketGroupId = await createMarketGroup(email, 'FUTURES');
    const createRes = await agent.post('/dashboard/bots').send({
      ...createPayload({ strategyId, marketGroupId }), isActive: true,
    });

    expect(createRes.status).toBe(409);
    expect(createRes.body.error.message).toBe('strategy DCA sizing is not supported by PAPER or LIVE runtime');
    expect(createRes.body.error.details).toMatchObject({
      strategyId, reason: 'USDT_DCA_RUNTIME_UNSUPPORTED',
    });
    expect(await prisma.bot.count()).toBe(0);
    expect(await prisma.order.count()).toBe(0);
  });

  it.each([2, 5])('rejects activation after an attached strategy changes to USDT multiplier %s', async (multiplier) => {
    const email = `bots-usdt-activation-${multiplier}@example.com`;
    const agent = await registerAndLogin(email);
    const strategyId = await createStrategy(agent);
    const marketGroupId = await createMarketGroup(email, 'FUTURES');
    const createRes = await agent.post('/dashboard/bots').send(createPayload({ strategyId, marketGroupId }));
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    const strategyUpdateRes = await agent.put(`/dashboard/strategies/${strategyId}`).send({
      config: {
        open: { indicatorsLong: [], indicatorsShort: [] },
        close: { mode: 'basic', tp: 99, sl: 99 },
        additional: { dcaEnabled: true, dcaMode: 'basic', dcaTimes: 1,
          dcaSizingBasis: 'usdt_contribution_v1',
          dcaLevels: [{ percent: -20, multiplier }] },
      },
    });
    expect(strategyUpdateRes.status).toBe(200);

    const activateRes = await agent.put(`/dashboard/bots/${botId}`).send({ isActive: true });
    expect(activateRes.status).toBe(409);
    expect(activateRes.body.error.details).toMatchObject({
      strategyId, reason: 'USDT_DCA_RUNTIME_UNSUPPORTED',
    });
    expect((await prisma.bot.findUniqueOrThrow({ where: { id: botId } })).isActive).toBe(false);
    expect(await prisma.order.count()).toBe(0);
  });
});
