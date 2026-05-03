import { beforeEach, describe, expect, it } from 'vitest';

import { prisma } from '../../prisma/client';
import {
  PositionManualUpdateError,
  repairLegacyOpenPositions,
  updatePositionManualParams,
} from './positions.service';

describe('positions service legacy open-position repair', () => {
  beforeEach(async () => {
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.backtestTrade.deleteMany();
    await prisma.backtestReport.deleteMany();
    await prisma.backtestRun.deleteMany();
    await prisma.log.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.user.deleteMany();
  });

  it('repairs orphaned open positions from canonical market group and strategy links before stale bot projections', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'positions-service-canonical-repair@example.com',
        password: 'test-password',
      },
      select: { id: true },
    });

    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Canonical Repair Wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
      select: { id: true },
    });

    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Canonical Repair Universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT', 'ETHUSDT'],
        blacklist: [],
      },
      select: { id: true },
    });

    const [canonicalGroup, staleDirectGroup] = await Promise.all([
      prisma.symbolGroup.create({
        data: {
          userId: user.id,
          marketUniverseId: marketUniverse.id,
          name: 'Canonical BTC Group',
          symbols: ['BTCUSDT'],
        },
        select: { id: true },
      }),
      prisma.symbolGroup.create({
        data: {
          userId: user.id,
          marketUniverseId: marketUniverse.id,
          name: 'Stale Direct ETH Group',
          symbols: ['ETHUSDT'],
        },
        select: { id: true },
      }),
    ]);

    const [canonicalStrategy, staleDirectStrategy] = await Promise.all([
      prisma.strategy.create({
        data: {
          userId: user.id,
          name: 'Canonical Repair Strategy',
          interval: '5m',
          leverage: 3,
          walletRisk: 1,
          config: {},
        },
        select: { id: true },
      }),
      prisma.strategy.create({
        data: {
          userId: user.id,
          name: 'Stale Direct Strategy',
          interval: '15m',
          leverage: 7,
          walletRisk: 1,
          config: {},
        },
        select: { id: true },
      }),
    ]);

    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Canonical Repair Bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: false,
        walletId: wallet.id,
        strategyId: staleDirectStrategy.id,
        symbolGroupId: staleDirectGroup.id,
      },
      select: { id: true },
    });

    const botMarketGroup = await prisma.botMarketGroup.create({
      data: {
        userId: user.id,
        botId: bot.id,
        symbolGroupId: canonicalGroup.id,
        lifecycleStatus: 'ACTIVE',
        isEnabled: true,
        executionOrder: 1,
      },
      select: { id: true },
    });

    await prisma.marketGroupStrategyLink.create({
      data: {
        userId: user.id,
        botId: bot.id,
        botMarketGroupId: botMarketGroup.id,
        strategyId: canonicalStrategy.id,
        priority: 1,
        isEnabled: true,
      },
    });

    const canonicalOrphan = await prisma.position.create({
      data: {
        userId: user.id,
        botId: null,
        walletId: wallet.id,
        strategyId: staleDirectStrategy.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 50_000,
        quantity: 0.01,
        leverage: 3,
      },
      select: { id: true },
    });

    const staleDirectOrphan = await prisma.position.create({
      data: {
        userId: user.id,
        botId: null,
        walletId: wallet.id,
        strategyId: staleDirectStrategy.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 2_500,
        quantity: 0.2,
        leverage: 7,
      },
      select: { id: true },
    });

    const result = await repairLegacyOpenPositions(user.id);

    expect(result).toMatchObject({
      scanned: 2,
      reboundToCanonicalBot: 1,
      closedDetachedOrphans: 0,
      unresolved: 1,
    });

    const repaired = await prisma.position.findUniqueOrThrow({
      where: { id: canonicalOrphan.id },
      select: { botId: true, walletId: true, strategyId: true },
    });
    expect(repaired).toEqual({
      botId: bot.id,
      walletId: wallet.id,
      strategyId: canonicalStrategy.id,
    });

    const unresolved = await prisma.position.findUniqueOrThrow({
      where: { id: staleDirectOrphan.id },
      select: { botId: true, walletId: true, strategyId: true },
    });
    expect(unresolved).toEqual({
      botId: null,
      walletId: wallet.id,
      strategyId: staleDirectStrategy.id,
    });
  });
});

describe('positions service manual update active-state guard', () => {
  beforeEach(async () => {
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.backtestTrade.deleteMany();
    await prisma.backtestReport.deleteMany();
    await prisma.backtestRun.deleteMany();
    await prisma.log.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.user.deleteMany();
  });

  it('rejects stale local open positions before applying manual TP or SL changes', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'positions-service-manual-update-stale@example.com',
        password: 'test-password',
      },
      select: { id: true },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'ORPHAN_LOCAL',
        continuityState: 'REPAIR_ONLY_CLEANUP',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 60_000,
        quantity: 0.1,
        leverage: 3,
        takeProfit: null,
        stopLoss: null,
      },
    });

    await expect(
      updatePositionManualParams(user.id, position.id, {
        takeProfit: 61_000,
        stopLoss: 59_000,
        notes: null,
        lockRules: false,
      })
    ).rejects.toMatchObject({
      code: 'POSITION_NOT_OPEN',
    } satisfies Partial<PositionManualUpdateError>);

    const unchanged = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
      select: { takeProfit: true, stopLoss: true },
    });
    expect(unchanged).toEqual({
      takeProfit: null,
      stopLoss: null,
    });
  });
});
