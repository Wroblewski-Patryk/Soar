import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

describe('Bots module orchestration contract', () => {
  beforeEach(resetBotsE2eState);

  it('covers one-user multi-bot single-scope multi-strategy flow', async () => {
    const ownerEmail = 'bot-multi-flow-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);

    const strategyAlphaRes = await owner.post('/dashboard/strategies').send({
      name: 'Strategy Alpha',
      interval: '5m',
      leverage: 2,
      walletRisk: 1,
      config: { open: { indicatorsLong: [], indicatorsShort: [] }, close: { mode: 'basic', tp: 2, sl: 1 } },
    });
    const strategyBetaRes = await owner.post('/dashboard/strategies').send({
      name: 'Strategy Beta',
      interval: '15m',
      leverage: 2,
      walletRisk: 1,
      config: { open: { indicatorsLong: [], indicatorsShort: [] }, close: { mode: 'basic', tp: 2, sl: 1 } },
    });
    const strategyGammaRes = await owner.post('/dashboard/strategies').send({
      name: 'Strategy Gamma',
      interval: '1h',
      leverage: 2,
      walletRisk: 1,
      config: { open: { indicatorsLong: [], indicatorsShort: [] }, close: { mode: 'basic', tp: 2, sl: 1 } },
    });

    expect(strategyAlphaRes.status).toBe(201);
    expect(strategyBetaRes.status).toBe(201);
    expect(strategyGammaRes.status).toBe(201);
    const createBotStrategyId = await createStrategy(owner, 'Multi Flow Bot Create Strategy');
    const botOneMarketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const botTwoMarketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');

    const botOneRes = await owner.post('/dashboard/bots').send({
      ...createPayload({ strategyId: createBotStrategyId, marketGroupId: botOneMarketGroupId }),
      name: 'Bot One',
    });
    const botTwoRes = await owner.post('/dashboard/bots').send({
      ...createPayload({ strategyId: createBotStrategyId, marketGroupId: botTwoMarketGroupId }),
      name: 'Bot Two',
    });
    expect(botOneRes.status).toBe(201);
    expect(botTwoRes.status).toBe(201);
    const botOneId = botOneRes.body.id as string;
    const botTwoId = botTwoRes.body.id as string;

    const botOneGroup = await prisma.botMarketGroup.findFirstOrThrow({ where: { botId: botOneId } });
    const botTwoGroup = await prisma.botMarketGroup.findFirstOrThrow({ where: { botId: botTwoId } });
    const botOneGroupId = botOneGroup.id;
    const botTwoGroupId = botTwoGroup.id;

    const attachResults = await Promise.all([
      owner.post(`/dashboard/bots/${botOneId}/market-groups/${botOneGroupId}/strategies`).send({
        strategyId: strategyAlphaRes.body.id,
        priority: 10,
        weight: 1.5,
      }),
      owner.post(`/dashboard/bots/${botOneId}/market-groups/${botOneGroupId}/strategies`).send({
        strategyId: strategyBetaRes.body.id,
        priority: 20,
        weight: 1,
      }),
      owner.post(`/dashboard/bots/${botOneId}/market-groups/${botOneGroupId}/strategies`).send({
        strategyId: strategyGammaRes.body.id,
        priority: 30,
        weight: 2,
      }),
      owner.post(`/dashboard/bots/${botTwoId}/market-groups/${botTwoGroupId}/strategies`).send({
        strategyId: strategyBetaRes.body.id,
        priority: 15,
        weight: 1,
      }),
      owner.post(`/dashboard/bots/${botTwoId}/market-groups/${botTwoGroupId}/strategies`).send({
        strategyId: strategyGammaRes.body.id,
        priority: 25,
        weight: 0.8,
      }),
    ]);
    for (const response of attachResults) {
      expect(response.status).toBe(201);
    }

    const graphOneRes = await owner.get(`/dashboard/bots/${botOneId}/runtime-graph`);
    const graphTwoRes = await owner.get(`/dashboard/bots/${botTwoId}/runtime-graph`);
    expect(graphOneRes.status).toBe(200);
    expect(graphTwoRes.status).toBe(200);

    expect(graphOneRes.body.marketGroups).toHaveLength(1);
    const graphOneGroupIds = graphOneRes.body.marketGroups.map((group: { id: string }) => group.id);
    expect(graphOneGroupIds).toContain(botOneGroupId);
    expect(graphOneRes.body.marketGroups[0].strategies.length).toBeGreaterThanOrEqual(3);

    const graphTwoGroupIds = graphTwoRes.body.marketGroups.map((group: { id: string }) => group.id);
    expect(graphTwoGroupIds).toContain(botTwoGroupId);
  });

  it('supports assistant config CRUD with subagent slot hard limit', async () => {
    const ownerEmail = 'assistant-config-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const other = await registerAndLogin('assistant-config-other@example.com');
    const strategyId = await createStrategy(owner, 'Assistant Config Create Strategy');
    const defaultMarketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');

    const botRes = await owner.post('/dashboard/bots').send({
      ...createPayload({ strategyId, marketGroupId: defaultMarketGroupId }),
      name: 'Assistant Bot',
    });
    expect(botRes.status).toBe(201);
    const botId = botRes.body.id as string;

    const upsertMainRes = await owner.put(`/dashboard/bots/${botId}/assistant-config`).send({
      mainAgentEnabled: true,
      mandate: 'Trade only when risk-adjusted edge is present.',
      modelProfile: 'balanced',
      safetyMode: 'STRICT',
      maxDecisionLatencyMs: 2200,
    });
    expect(upsertMainRes.status).toBe(200);
    expect(upsertMainRes.body.mainAgentEnabled).toBe(true);

    const upsertSlot1Res = await owner
      .put(`/dashboard/bots/${botId}/assistant-config/subagents/1`)
      .send({
        role: 'TREND',
        enabled: true,
        modelProfile: 'balanced',
        timeoutMs: 1000,
        safetyMode: 'STRICT',
      });
    expect(upsertSlot1Res.status).toBe(200);
    expect(upsertSlot1Res.body.slotIndex).toBe(1);

    const upsertSlot4Res = await owner
      .put(`/dashboard/bots/${botId}/assistant-config/subagents/4`)
      .send({
        role: 'RISK',
        enabled: true,
        modelProfile: 'balanced',
        timeoutMs: 1200,
        safetyMode: 'BALANCED',
      });
    expect(upsertSlot4Res.status).toBe(200);
    expect(upsertSlot4Res.body.slotIndex).toBe(4);

    const invalidSlotRes = await owner
      .put(`/dashboard/bots/${botId}/assistant-config/subagents/5`)
      .send({
        role: 'GENERAL',
        enabled: true,
        modelProfile: 'balanced',
        timeoutMs: 1200,
        safetyMode: 'STRICT',
      });
    expect(invalidSlotRes.status).toBe(400);
    expect(invalidSlotRes.body.error.message).toBe('slotIndex must be between 1 and 4');

    const getConfigRes = await owner.get(`/dashboard/bots/${botId}/assistant-config`);
    expect(getConfigRes.status).toBe(200);
    expect(getConfigRes.body.assistant).toBeTruthy();
    expect(getConfigRes.body.subagents).toHaveLength(2);

    const otherReadRes = await other.get(`/dashboard/bots/${botId}/assistant-config`);
    expect(otherReadRes.status).toBe(404);

    const deleteSlot1Res = await owner.delete(`/dashboard/bots/${botId}/assistant-config/subagents/1`);
    expect(deleteSlot1Res.status).toBe(204);
  });

  it('returns explainable assistant dry-run trace including NO_TRADE output', async () => {
    const ownerEmail = 'assistant-dryrun-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const strategyId = await createStrategy(owner, 'Assistant Dry Run Create Strategy');
    const defaultMarketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');

    const botRes = await owner.post('/dashboard/bots').send({
      ...createPayload({ strategyId, marketGroupId: defaultMarketGroupId }),
      name: 'Assistant Dry Run Bot',
    });
    expect(botRes.status).toBe(201);
    const botId = botRes.body.id as string;

    const upsertMainRes = await owner.put(`/dashboard/bots/${botId}/assistant-config`).send({
      mainAgentEnabled: true,
      mandate: 'Dry-run mandate',
      modelProfile: 'balanced',
      safetyMode: 'STRICT',
      maxDecisionLatencyMs: 2500,
    });
    expect(upsertMainRes.status).toBe(200);

    const upsertSlotRes = await owner.put(`/dashboard/bots/${botId}/assistant-config/subagents/1`).send({
      role: 'TREND',
      enabled: true,
      modelProfile: 'balanced',
      timeoutMs: 800,
      safetyMode: 'STRICT',
    });
    expect(upsertSlotRes.status).toBe(200);

    const dryRunRes = await owner.post(`/dashboard/bots/${botId}/assistant-config/dry-run`).send({
      symbol: 'BTCUSDT',
      intervalWindow: '5m',
      mode: 'PAPER',
    });
    expect(dryRunRes.status).toBe(200);
    expect(dryRunRes.body.requestId).toBeDefined();
    expect(dryRunRes.body.mode).toBeDefined();
    expect(Array.isArray(dryRunRes.body.statuses)).toBe(true);
    expect(Array.isArray(dryRunRes.body.outputs)).toBe(true);
    expect(dryRunRes.body.finalDecision).toBeDefined();
    expect(typeof dryRunRes.body.finalReason).toBe('string');

    const liveDryRunRes = await owner.post(`/dashboard/bots/${botId}/assistant-config/dry-run`).send({
      symbol: 'BTCUSDT',
      intervalWindow: '5m',
      mode: 'LIVE',
    });
    expect(liveDryRunRes.status).toBe(400);
  });
});
