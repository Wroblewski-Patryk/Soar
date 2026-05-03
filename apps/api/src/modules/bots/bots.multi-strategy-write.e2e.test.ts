import { describe, expect, it, beforeEach } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

describe('Bots multi-strategy write contract', () => {
  beforeEach(resetBotsE2eState);

  it('persists multiple ordered strategy links on create and update', async () => {
    const email = 'bots-multi-strategy-write@example.com';
    const agent = await registerAndLogin(email);
    const primaryStrategyId = await createStrategy(agent, 'Multi Write Primary Strategy');
    const secondaryStrategyId = await createStrategy(agent, 'Multi Write Secondary Strategy');
    const replacementStrategyId = await createStrategy(agent, 'Multi Write Replacement Strategy');
    const marketGroupId = await createMarketGroup(email, 'FUTURES');

    const createRes = await agent.post('/dashboard/bots').send({
      ...createPayload({ strategyId: primaryStrategyId, marketGroupId }),
      strategies: [
        { strategyId: secondaryStrategyId, priority: 20, weight: 0.5, isEnabled: true },
        { strategyId: primaryStrategyId, priority: 10, weight: 1.5, isEnabled: true },
      ],
    });
    expect(createRes.status).toBe(201);
    expect(createRes.body.strategyId).toBe(primaryStrategyId);
    const botId = createRes.body.id as string;

    const groupsAfterCreate = await prisma.botMarketGroup.findMany({
      where: { botId, isEnabled: true, lifecycleStatus: 'ACTIVE' },
    });
    expect(groupsAfterCreate).toHaveLength(1);

    const linksAfterCreate = await prisma.marketGroupStrategyLink.findMany({
      where: { botId, botMarketGroupId: groupsAfterCreate[0].id, isEnabled: true },
      orderBy: [{ priority: 'asc' }, { strategyId: 'asc' }],
    });
    expect(linksAfterCreate.map((link) => link.strategyId)).toEqual([
      primaryStrategyId,
      secondaryStrategyId,
    ]);
    expect(linksAfterCreate.map((link) => link.weight)).toEqual([1.5, 0.5]);

    const updateRes = await agent.put(`/dashboard/bots/${botId}`).send({
      strategyId: secondaryStrategyId,
      strategies: [
        { strategyId: secondaryStrategyId, priority: 5, weight: 2, isEnabled: true },
        { strategyId: replacementStrategyId, priority: 15, weight: 1, isEnabled: true },
      ],
    });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.strategyId).toBe(secondaryStrategyId);
    expect(updateRes.body.symbolGroupId).toBe(marketGroupId);

    const groupsAfterUpdate = await prisma.botMarketGroup.findMany({
      where: { botId, isEnabled: true, lifecycleStatus: 'ACTIVE' },
    });
    expect(groupsAfterUpdate).toHaveLength(1);
    expect(groupsAfterUpdate[0].id).toBe(groupsAfterCreate[0].id);

    const enabledLinksAfterUpdate = await prisma.marketGroupStrategyLink.findMany({
      where: { botId, botMarketGroupId: groupsAfterCreate[0].id, isEnabled: true },
      orderBy: [{ priority: 'asc' }, { strategyId: 'asc' }],
    });
    expect(enabledLinksAfterUpdate.map((link) => link.strategyId)).toEqual([
      secondaryStrategyId,
      replacementStrategyId,
    ]);
    expect(enabledLinksAfterUpdate.map((link) => link.priority)).toEqual([5, 15]);

    const legacyMappings = await prisma.botStrategy.findMany({ where: { botId } });
    expect(legacyMappings).toHaveLength(0);
  });
});
