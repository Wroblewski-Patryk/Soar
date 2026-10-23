import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  createMarketGroup, createPayload, createStrategy, registerAndLogin, resetBotsE2eState,
} from './bots.e2e.shared';

describe('bot USDT DCA runtime attachment', () => {
  beforeEach(resetBotsE2eState);

  it.each([2, 5])('attaches a PAPER bot with USDT contribution multiplier %s', async (multiplier) => {
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

    expect(createRes.status).toBe(201);
    expect((await prisma.bot.findUniqueOrThrow({ where: { id: createRes.body.id } })).isActive).toBe(true);
    expect(await prisma.order.count()).toBe(0);
  });

  it.each([2, 5])('activates after an attached strategy changes to USDT multiplier %s', async (multiplier) => {
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
    expect(activateRes.status).toBe(200);
    expect((await prisma.bot.findUniqueOrThrow({ where: { id: botId } })).isActive).toBe(true);
    expect(await prisma.order.count()).toBe(0);
  });
});
