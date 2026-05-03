import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { assertWalletContextMatchesExistingBotMarketGroups } from './botContextValidation.service';

const cleanupDb = async () => {
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
  await prisma.runtimeExecutionDedupe.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.symbolGroup.deleteMany();
  await prisma.marketUniverse.deleteMany();
  await prisma.strategy.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.user.deleteMany();
};

describe('assertWalletContextMatchesExistingBotMarketGroups', () => {
  beforeEach(async () => {
    await cleanupDb();
  });

  it('fails closed against canonical market group when direct bot symbol group is stale', async () => {
    const user = await prisma.user.create({
      data: { email: 'bot-context-canonical-wallet-mismatch@example.com', password: 'hashed' },
    });
    const futuresUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Canonical futures universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    });
    const spotUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Stale direct spot universe',
        exchange: 'BINANCE',
        marketType: 'SPOT',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    });
    const canonicalGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: futuresUniverse.id,
        name: 'Canonical futures group',
        symbols: ['BTCUSDT'],
      },
    });
    const staleDirectGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: spotUniverse.id,
        name: 'Stale direct spot group',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Wallet update bot',
        walletId: null,
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        symbolGroupId: staleDirectGroup.id,
      },
    });
    await prisma.botMarketGroup.create({
      data: {
        userId: user.id,
        botId: bot.id,
        symbolGroupId: canonicalGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 100,
        maxOpenPositions: 1,
        isEnabled: true,
      },
    });

    await expect(
      assertWalletContextMatchesExistingBotMarketGroups({
        userId: user.id,
        botId: bot.id,
        wallet: {
          id: 'spot-wallet',
          exchange: 'BINANCE',
          marketType: 'SPOT',
          baseCurrency: 'USDT',
        },
      })
    ).rejects.toMatchObject({
      code: 'WALLET_MARKET_CONTEXT_MISMATCH',
      details: expect.objectContaining({
        symbolGroupId: canonicalGroup.id,
        marketUniverseId: futuresUniverse.id,
        marketUniverseMarketType: 'FUTURES',
      }),
    });
  });

  it('uses direct bot symbol group as fallback for legacy bots without canonical groups', async () => {
    const user = await prisma.user.create({
      data: { email: 'bot-context-legacy-wallet-match@example.com', password: 'hashed' },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Legacy direct universe',
        exchange: 'BINANCE',
        marketType: 'SPOT',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: universe.id,
        name: 'Legacy direct group',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Legacy wallet update bot',
        walletId: null,
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'SPOT',
        positionMode: 'ONE_WAY',
        isActive: true,
        symbolGroupId: symbolGroup.id,
      },
    });

    await expect(
      assertWalletContextMatchesExistingBotMarketGroups({
        userId: user.id,
        botId: bot.id,
        wallet: {
          id: 'spot-wallet',
          exchange: 'BINANCE',
          marketType: 'SPOT',
          baseCurrency: 'USDT',
        },
      })
    ).resolves.toBeUndefined();
  });
});
