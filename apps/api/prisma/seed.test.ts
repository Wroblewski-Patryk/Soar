import { describe, expect, it, vi } from 'vitest';

const prismaMock = {
  user: {
    upsert: vi.fn(async () => ({ id: 'owner-user' })),
  },
  marketUniverse: {
    findFirst: vi.fn(async () => null),
    create: vi.fn(async () => ({ id: 'market-universe-1' })),
    update: vi.fn(async () => ({ id: 'market-universe-existing' })),
  },
  symbolGroup: {
    findFirst: vi.fn(async () => null),
    create: vi.fn(async () => ({ id: 'symbol-group-1' })),
    update: vi.fn(async () => ({ id: 'symbol-group-existing' })),
  },
  strategy: {
    findFirst: vi.fn(async () => null),
    create: vi.fn(async () => ({ id: 'strategy-1' })),
    update: vi.fn(async () => ({ id: 'strategy-existing' })),
  },
  wallet: {
    findFirst: vi.fn(async () => null),
    create: vi.fn(async () => ({ id: 'wallet-1' })),
    update: vi.fn(async () => ({ id: 'wallet-existing' })),
  },
  bot: {
    findFirst: vi.fn(async () => null),
    create: vi.fn(async () => ({ id: 'bot-1' })),
    update: vi.fn(async () => ({ id: 'bot-existing' })),
  },
  botMarketGroup: {
    upsert: vi.fn(async () => ({ id: 'bot-market-group-1' })),
  },
  marketGroupStrategyLink: {
    upsert: vi.fn(async () => ({ id: 'market-group-strategy-link-1' })),
  },
  botStrategy: {
    upsert: vi.fn(async () => ({ id: 'bot-strategy-1' })),
  },
  $disconnect: vi.fn(async () => undefined),
};

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => prismaMock),
}));

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(async () => 'hashed-password'),
  },
}));

vi.mock('../src/modules/subscriptions/subscriptions.service', () => ({
  OWNER_ACCOUNT_EMAIL: 'owner@example.test',
  ensureSubscriptionCatalog: vi.fn(async () => undefined),
  setActiveSubscriptionForUser: vi.fn(async () => undefined),
}));

describe('database seed main', () => {
  it('bootstraps the owner, subscription catalog, market group, wallet, bot, and strategy links through upserts', async () => {
    const subscriptions = await import('../src/modules/subscriptions/subscriptions.service');
    const { main } = await import('./seed');

    await main();

    expect(subscriptions.ensureSubscriptionCatalog).toHaveBeenCalledWith(prismaMock, {
      seedDefaults: true,
    });
    expect(prismaMock.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: 'owner@example.test' },
        create: expect.objectContaining({
          email: 'owner@example.test',
          password: 'hashed-password',
          role: 'ADMIN',
        }),
      })
    );
    expect(subscriptions.setActiveSubscriptionForUser).toHaveBeenCalledWith(
      prismaMock,
      expect.objectContaining({
        userId: 'owner-user',
        planCode: 'PROFESSIONAL',
        source: 'ADMIN_OVERRIDE',
      })
    );
    expect(prismaMock.marketUniverse.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'owner-user',
          name: 'Ulubione',
          exchange: 'BINANCE',
          marketType: 'FUTURES',
        }),
      })
    );
    expect(prismaMock.botMarketGroup.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          userId: 'owner-user',
          botId: 'bot-1',
          symbolGroupId: 'symbol-group-1',
        }),
      })
    );
    expect(prismaMock.marketGroupStrategyLink.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          userId: 'owner-user',
          botId: 'bot-1',
          botMarketGroupId: 'bot-market-group-1',
          strategyId: 'strategy-1',
        }),
      })
    );
    expect(prismaMock.botStrategy.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          botId: 'bot-1',
          strategyId: 'strategy-1',
          symbolGroupId: 'symbol-group-1',
          isEnabled: true,
        }),
      })
    );
  });
});
