import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { getOwnedBotRuntimeSession, validateSymbolGroupForBot } from './botOwnership.service';

const cleanupDb = async () => {
  await prisma.log.deleteMany();
  await prisma.backtestReport.deleteMany();
  await prisma.backtestTrade.deleteMany();
  await prisma.backtestRun.deleteMany();
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
};

describe('validateSymbolGroupForBot', () => {
  beforeEach(async () => {
    await cleanupDb();
  });

  it('uses wallet context as canonical source even when duplicated bot venue fields drift', async () => {
    const user = await prisma.user.create({
      data: { email: 'bot-ownership-wallet-canonical@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Canonical wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Canonical universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: universe.id,
        name: 'Canonical symbol group',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Drifted bot fields',
        walletId: wallet.id,
        mode: 'PAPER',
        exchange: 'BYBIT',
        marketType: 'SPOT',
        positionMode: 'ONE_WAY',
        isActive: true,
      },
    });

    await expect(
      validateSymbolGroupForBot({
        userId: user.id,
        botId: bot.id,
        symbolGroupId: symbolGroup.id,
      })
    ).resolves.toBeUndefined();
  });

  it('fails closed when wallet context mismatches market-universe even if duplicated bot fields match', async () => {
    const user = await prisma.user.create({
      data: { email: 'bot-ownership-wallet-mismatch@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Mismatched wallet',
        mode: 'PAPER',
        exchange: 'BYBIT',
        marketType: 'SPOT',
        baseCurrency: 'USDT',
      },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Universe matching duplicated bot fields',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT'],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: universe.id,
        name: 'Mismatched symbol group',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Bot with duplicated fields matching universe',
        walletId: wallet.id,
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
      },
    });

    await expect(
      validateSymbolGroupForBot({
        userId: user.id,
        botId: bot.id,
        symbolGroupId: symbolGroup.id,
      })
    ).rejects.toMatchObject({ code: 'WALLET_MARKET_CONTEXT_MISMATCH' });
  });
});

describe('getOwnedBotRuntimeSession', () => {
  beforeEach(async () => {
    await cleanupDb();
  });

  it('returns the owned runtime session when user, bot, and session all match', async () => {
    const user = await prisma.user.create({
      data: { email: 'bot-ownership-session-match@example.com', password: 'hashed' },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Owned bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
      },
    });
    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: user.id,
        botId: bot.id,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-07-12T10:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-07-12T10:05:00.000Z'),
      },
    });

    await expect(getOwnedBotRuntimeSession(user.id, bot.id, session.id)).resolves.toMatchObject({
      id: session.id,
      userId: user.id,
      botId: bot.id,
      status: 'RUNNING',
    });
  });

  it('fails closed when the session does not belong to the selected bot or user', async () => {
    const owner = await prisma.user.create({
      data: { email: 'bot-ownership-session-owner@example.com', password: 'hashed' },
    });
    const otherUser = await prisma.user.create({
      data: { email: 'bot-ownership-session-other@example.com', password: 'hashed' },
    });
    const ownerBot = await prisma.bot.create({
      data: {
        userId: owner.id,
        name: 'Owner bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
      },
    });
    const otherBot = await prisma.bot.create({
      data: {
        userId: otherUser.id,
        name: 'Other bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
      },
    });
    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: owner.id,
        botId: ownerBot.id,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-07-12T10:10:00.000Z'),
      },
    });

    await expect(getOwnedBotRuntimeSession(otherUser.id, otherBot.id, session.id)).resolves.toBeNull();
    await expect(getOwnedBotRuntimeSession(owner.id, otherBot.id, session.id)).resolves.toBeNull();
  });
});
