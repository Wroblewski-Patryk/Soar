import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { validateSymbolGroupForBot } from './botOwnership.service';

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

