import request from 'supertest';
import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import {
  ensureSubscriptionCatalog,
  setActiveSubscriptionForUser,
} from '../subscriptions/subscriptions.service';
import { SubscriptionEntitlementsSchema } from '../subscriptions/subscriptionEntitlements.service';

const walletIdByMarketGroupId = new Map<string, string>();

const createWalletForContext = async (
  email: string,
  context: {
    mode?: 'PAPER' | 'LIVE';
    apiKeyId?: string | null;
  } = {},
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
    select: { id: true },
  });
  const mode = context.mode ?? 'PAPER';
  const created = await prisma.wallet.create({
    data: {
      userId: user.id,
      name: `Entitlements Wallet ${mode} ${Date.now()}`,
      mode,
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 10_000,
      liveAllocationMode: mode === 'LIVE' ? 'PERCENT' : null,
      liveAllocationValue: mode === 'LIVE' ? 100 : null,
      apiKeyId: mode === 'LIVE' ? (context.apiKeyId ?? null) : null,
    },
    select: { id: true },
  });
  return created.id;
};

const createLiveApiKeyForUser = async (email: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
    select: { id: true },
  });
  const apiKey = await prisma.apiKey.create({
    data: {
      userId: user.id,
      label: `Entitlements LIVE ${Date.now()}`,
      exchange: 'BINANCE',
      apiKey: 'test-live-key',
      apiSecret: 'test-live-secret',
      syncExternalPositions: true,
      manageExternalPositions: false,
    },
    select: { id: true },
  });
  return apiKey.id;
};

const registerAndLogin = async (email: string) => {
  const agent = request.agent(app);
  const res = await agent.post('/auth/register').send({
    email,
    password: 'test1234',
  });
  expect(res.status).toBe(201);
  return agent;
};

const createStrategy = async (agent: ReturnType<typeof request.agent>, name: string) => {
  const strategyRes = await agent.post('/dashboard/strategies').send({
    name,
    interval: '5m',
    leverage: 2,
    walletRisk: 1,
    config: {
      open: { indicatorsLong: [], indicatorsShort: [] },
      close: { mode: 'basic', tp: 2, sl: 1 },
    },
  });
  expect(strategyRes.status).toBe(201);
  return strategyRes.body.id as string;
};

const createMarketGroup = async (email: string) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  const marketUniverse = await prisma.marketUniverse.create({
    data: {
      userId: user.id,
      name: `Entitlements Universe ${Date.now()}`,
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      whitelist: ['BTCUSDT', 'ETHUSDT'],
      blacklist: [],
    },
  });
  const symbolGroup = await prisma.symbolGroup.create({
    data: {
      userId: user.id,
      marketUniverseId: marketUniverse.id,
      name: `Entitlements Group ${Date.now()}`,
      symbols: ['BTCUSDT', 'ETHUSDT'],
    },
  });
  const walletId = await createWalletForContext(email);
  walletIdByMarketGroupId.set(symbolGroup.id, walletId);
  walletIdByMarketGroupId.set(marketUniverse.id, walletId);

  return symbolGroup.id;
};

const updateFreePlanEntitlements = async (
  patch: (entitlements: ReturnType<typeof SubscriptionEntitlementsSchema.parse>) => Prisma.InputJsonValue,
) => {
  const freePlan = await prisma.subscriptionPlan.findUniqueOrThrow({
    where: { code: 'FREE' },
    select: { entitlements: true },
  });
  const entitlements = SubscriptionEntitlementsSchema.parse(freePlan.entitlements);
  await prisma.subscriptionPlan.update({
    where: { code: 'FREE' },
    data: {
      entitlements: patch(entitlements),
    },
  });
};

const createPayload = (refs: { strategyId: string; marketGroupId: string; walletId?: string }) => {
  const walletId = refs.walletId ?? walletIdByMarketGroupId.get(refs.marketGroupId);
  if (!walletId) {
    throw new Error(`Missing wallet mapping for marketGroupId=${refs.marketGroupId}`);
  }

  return {
    name: 'Entitlements Runner',
    strategyId: refs.strategyId,
    marketGroupId: refs.marketGroupId,
    walletId,
    isActive: false,
    liveOptIn: false,
  };
};

describe('Bots subscription entitlements', () => {
  beforeEach(async () => {
    walletIdByMarketGroupId.clear();
    await prisma.log.deleteMany();
    await prisma.backtestReport.deleteMany();
    await prisma.backtestTrade.deleteMany();
    await prisma.backtestRun.deleteMany();
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.marketCandleCache.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.paymentIntent.deleteMany();
    await prisma.userSubscription.deleteMany();
    await prisma.user.deleteMany();
    await ensureSubscriptionCatalog(prisma, { seedDefaults: true });
  });

  it('blocks second bot on FREE plan with 409 entitlement error payload', async () => {
    const email = 'bots-subscription-free-limit@example.com';
    const agent = await registerAndLogin(email);
    const strategyId = await createStrategy(agent, 'Entitlements Free Strategy');
    const marketGroupId = await createMarketGroup(email);

    const firstCreate = await agent.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
      }),
    );
    expect(firstCreate.status).toBe(201);

    const secondCreate = await agent.post('/dashboard/bots').send({
      ...createPayload({
        strategyId,
        marketGroupId,
      }),
      name: 'Second bot should fail',
    });
    expect(secondCreate.status).toBe(409);
    expect(secondCreate.body.error.message).toBe('bot limit for active subscription reached');
    expect(secondCreate.body.error.details).toMatchObject({
      planCode: 'FREE',
      maxBotsTotal: 1,
      currentBotsTotal: 1,
      requestedBotsTotal: 2,
    });
  });

  it('allows extra bot after subscription upgrade to ADVANCED', async () => {
    const email = 'bots-subscription-upgrade@example.com';
    const agent = await registerAndLogin(email);
    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
      select: { id: true },
    });
    const strategyId = await createStrategy(agent, 'Entitlements Upgrade Strategy');
    const marketGroupId = await createMarketGroup(email);

    const firstCreate = await agent.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
      }),
    );
    expect(firstCreate.status).toBe(201);

    await setActiveSubscriptionForUser(prisma, {
      userId: user.id,
      planCode: 'ADVANCED',
      source: 'ADMIN_OVERRIDE',
      metadata: { reason: 'e2e-upgrade-allow-more-bots' },
    });

    const secondCreate = await agent.post('/dashboard/bots').send({
      ...createPayload({
        strategyId,
        marketGroupId,
      }),
      name: 'Second bot should pass on ADVANCED',
    });
    expect(secondCreate.status).toBe(201);
  });

  it('enforces updated FREE plan limits from catalog (no hardcoded cap)', async () => {
    await updateFreePlanEntitlements((entitlements) => ({
      ...entitlements,
      limits: {
        ...entitlements.limits,
        maxBotsTotal: 2,
        maxBotsByMode: {
          PAPER: 2,
          LIVE: 0,
        },
      },
    } as Prisma.InputJsonValue));

    const email = 'bots-subscription-updated-free-plan@example.com';
    const agent = await registerAndLogin(email);
    const strategyId = await createStrategy(agent, 'Entitlements Updated Free Plan');
    const marketGroupId = await createMarketGroup(email);

    const firstCreate = await agent.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
      }),
    );
    expect(firstCreate.status).toBe(201);

    const secondCreate = await agent.post('/dashboard/bots').send({
      ...createPayload({
        strategyId,
        marketGroupId,
      }),
      name: 'Second bot allowed by updated FREE plan',
    });
    expect(secondCreate.status).toBe(201);
  });

  it('blocks LIVE bot create when plan exposes LIVE pool but liveTrading feature is disabled', async () => {
    await updateFreePlanEntitlements((entitlements) => ({
      ...entitlements,
      limits: {
        ...entitlements.limits,
        maxBotsTotal: 1,
        maxBotsByMode: {
          PAPER: 1,
          LIVE: 1,
        },
      },
      features: {
        ...entitlements.features,
        liveTrading: false,
      },
    } as Prisma.InputJsonValue));

    const email = 'bots-subscription-live-feature-create-block@example.com';
    const agent = await registerAndLogin(email);
    const strategyId = await createStrategy(agent, 'Entitlements Live Feature Create Block');
    const marketGroupId = await createMarketGroup(email);
    const liveApiKeyId = await createLiveApiKeyForUser(email);
    const liveWalletId = await createWalletForContext(email, {
      mode: 'LIVE',
      apiKeyId: liveApiKeyId,
    });

    const createLiveBot = await agent.post('/dashboard/bots').send({
      ...createPayload({
        strategyId,
        marketGroupId,
        walletId: liveWalletId,
      }),
      liveOptIn: true,
      consentTextVersion: 'v1-live-risk',
    });

    expect(createLiveBot.status).toBe(403);
    expect(createLiveBot.body.error.message).toBe(
      'live trading is not available on the active subscription plan'
    );
    expect(createLiveBot.body.error.details).toMatchObject({
      feature: 'liveTrading',
      planCode: 'FREE',
    });
  });

  it('blocks PAPER to LIVE bot switch when plan lacks liveTrading entitlement', async () => {
    await updateFreePlanEntitlements((entitlements) => ({
      ...entitlements,
      limits: {
        ...entitlements.limits,
        maxBotsTotal: 1,
        maxBotsByMode: {
          PAPER: 1,
          LIVE: 1,
        },
      },
      features: {
        ...entitlements.features,
        liveTrading: false,
      },
    } as Prisma.InputJsonValue));

    const email = 'bots-subscription-live-feature-update-block@example.com';
    const agent = await registerAndLogin(email);
    const strategyId = await createStrategy(agent, 'Entitlements Live Feature Update Block');
    const marketGroupId = await createMarketGroup(email);
    const liveApiKeyId = await createLiveApiKeyForUser(email);
    const liveWalletId = await createWalletForContext(email, {
      mode: 'LIVE',
      apiKeyId: liveApiKeyId,
    });

    const createdPaperBot = await agent.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
      }),
    );
    expect(createdPaperBot.status).toBe(201);

    const switchToLive = await agent.put(`/dashboard/bots/${createdPaperBot.body.id}`).send({
      walletId: liveWalletId,
      liveOptIn: true,
      consentTextVersion: 'v1-live-risk',
    });

    expect(switchToLive.status).toBe(403);
    expect(switchToLive.body.error.message).toBe(
      'live trading is not available on the active subscription plan'
    );
    expect(switchToLive.body.error.details).toMatchObject({
      feature: 'liveTrading',
      planCode: 'FREE',
    });
  });
});
