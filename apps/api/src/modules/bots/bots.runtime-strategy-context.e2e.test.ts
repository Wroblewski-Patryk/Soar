import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { DCA_ADVANCED_STRATEGY_CONFIG, DYNAMIC_STOP_STRATEGY_CONFIG } from './bots.e2e.fixtures';
import { createStrategy, registerAndLogin, resetBotsE2eState } from './bots.e2e.shared';
import {
  resolveBotTrailingStopLevelsBySymbol,
  resolveBotTrailingTakeProfitLevelsBySymbol,
} from './runtimeStrategyDisplayBySymbol.service';

describe('Bots runtime strategy context contract', () => {
  beforeEach(resetBotsE2eState);

  it('reads runtime positions from canonical market-group venue before stale direct bot venue', async () => {
    const ownerEmail = 'bot-runtime-position-canonical-venue@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'Runtime Position Canonical Venue Strategy');
    const staleUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerUser.id,
        name: `Runtime Position Stale Spot Universe ${Date.now()}`,
        exchange: 'BINANCE',
        marketType: 'SPOT',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const canonicalUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerUser.id,
        name: `Runtime Position Canonical Futures Universe ${Date.now()}`,
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const staleGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: staleUniverse.id,
        name: 'Runtime Position Stale Direct Group',
        symbols: ['BTCUSDT'],
      },
    });
    const canonicalGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: canonicalUniverse.id,
        name: 'Runtime Position Canonical Group',
        symbols: ['ETHUSDT'],
      },
    });
    const liveWallet = await prisma.wallet.create({
      data: {
        userId: ownerUser.id,
        name: 'Runtime Position Canonical Venue Wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'Runtime Position Canonical Venue Bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        walletId: liveWallet.id,
        strategyId,
        symbolGroupId: staleGroup.id,
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'v1',
      },
    });
    const botMarketGroup = await prisma.botMarketGroup.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        symbolGroupId: canonicalGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        maxOpenPositions: 2,
        isEnabled: true,
      },
    });
    await prisma.marketGroupStrategyLink.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        botMarketGroupId: botMarketGroup.id,
        strategyId,
        priority: 1,
        weight: 1,
        isEnabled: true,
      },
    });
    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-29T13:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-29T13:01:00.000Z'),
      },
    });
    await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        walletId: liveWallet.id,
        strategyId,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 3200,
        quantity: 0.5,
        leverage: 10,
        openedAt: new Date('2026-04-29T13:00:30.000Z'),
      },
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${bot.id}/runtime-sessions/${session.id}/positions`
    );

    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toHaveLength(1);
    expect(positionsRes.body.openItems[0].symbol).toBe('ETHUSDT');
  });

  it('surfaces canonical symbol-level advanced close plans for strategy-null runtime positions', async () => {
    const ownerEmail = 'bot-runtime-symbol-level-advanced-close@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const advancedStrategyId = await createStrategy(owner, 'Runtime Symbol Advanced TTP', {
      open: { indicatorsLong: [], indicatorsShort: [] },
      close: {
        mode: 'advanced',
        tp: 0,
        sl: 0,
        ttp: [{ percent: 10, arm: 5 }],
        tsl: [],
      },
      additional: { dcaEnabled: false },
    });
    const basicStrategyId = await createStrategy(owner, 'Runtime Symbol Basic Sibling', {
      open: { indicatorsLong: [], indicatorsShort: [] },
      close: { mode: 'basic', tp: 2, sl: 1 },
      additional: { dcaEnabled: false },
    });
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: ownerUser.id,
        name: `Symbol Level Advanced Close Universe ${Date.now()}`,
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const advancedGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: universe.id,
        name: 'Symbol Level Advanced Group',
        symbols: ['ETHUSDT'],
      },
    });
    const basicGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: universe.id,
        name: 'Symbol Level Basic Group',
        symbols: ['BTCUSDT'],
      },
    });
    const liveWallet = await prisma.wallet.create({
      data: {
        userId: ownerUser.id,
        name: 'Symbol Level Advanced Wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'Symbol Level Advanced Bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        walletId: liveWallet.id,
        strategyId: advancedStrategyId,
        symbolGroupId: advancedGroup.id,
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'v1',
      },
    });
    const advancedBotMarketGroup = await prisma.botMarketGroup.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        symbolGroupId: advancedGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        maxOpenPositions: 2,
        isEnabled: true,
      },
    });
    const basicBotMarketGroup = await prisma.botMarketGroup.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        symbolGroupId: basicGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 2,
        maxOpenPositions: 2,
        isEnabled: true,
      },
    });
    await prisma.marketGroupStrategyLink.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId: bot.id,
          botMarketGroupId: advancedBotMarketGroup.id,
          strategyId: advancedStrategyId,
          priority: 1,
          weight: 1,
          isEnabled: true,
        },
        {
          userId: ownerUser.id,
          botId: bot.id,
          botMarketGroupId: basicBotMarketGroup.id,
          strategyId: basicStrategyId,
          priority: 1,
          weight: 1,
          isEnabled: true,
        },
      ],
    });
    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-29T15:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-29T15:05:00.000Z'),
      },
    });
    await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        walletId: liveWallet.id,
        strategyId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 1,
        leverage: 1,
        openedAt: new Date('2026-04-29T15:01:00.000Z'),
      },
    });
    await prisma.botRuntimeSymbolStat.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        sessionId: session.id,
        symbol: 'ETHUSDT',
        openPositionCount: 1,
        openPositionQty: 1,
        lastPrice: 110.4,
        snapshotAt: new Date('2026-04-29T15:04:00.000Z'),
      },
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${bot.id}/runtime-sessions/${session.id}/positions`
    );

    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.showDynamicStopColumns).toBe(true);
    expect(positionsRes.body.openItems).toHaveLength(1);
    const item = positionsRes.body.openItems[0] as {
      actionable: boolean;
      strategyAutomationContextResolved: boolean;
      trailingTakeProfitLevels: Array<{ armPercent: number; trailPercent: number }>;
      dynamicTtpStopLoss: number | null;
    };
    expect(item.actionable).toBe(false);
    expect(item.strategyAutomationContextResolved).toBe(true);
    expect(item.trailingTakeProfitLevels).toEqual([{ armPercent: 0.1, trailPercent: 0.05 }]);
    expect(item.dynamicTtpStopLoss).toBeCloseTo(105.4, 5);
  });

  it('does not surface symbol-fallback DCA or trailing plans when LIVE position lacks canonical strategy context', async () => {
    const ownerEmail = 'bot-runtime-live-strategy-parity-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'Runtime Live Strategy Truth', DCA_ADVANCED_STRATEGY_CONFIG);
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: ownerUser.id,
        name: `Live Strategy Truth Universe ${Date.now()}`,
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const liveWallet = await prisma.wallet.create({
      data: {
        userId: ownerUser.id,
        name: 'Live Strategy Truth Wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const group = await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: universe.id,
        name: 'Live Strategy Truth Group',
        symbols: ['ETHUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'Live Strategy Truth Bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        walletId: liveWallet.id,
        strategyId,
        symbolGroupId: group.id,
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'v1',
      },
    });
    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-29T12:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-29T12:05:00.000Z'),
      },
    });
    const position = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        walletId: liveWallet.id,
        strategyId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 3200,
        quantity: 0.5,
        leverage: 10,
        openedAt: new Date('2026-04-29T12:01:00.000Z'),
      },
    });
    await prisma.trade.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId: bot.id,
          walletId: liveWallet.id,
          positionId: position.id,
          strategyId: null,
          symbol: 'ETHUSDT',
          side: 'BUY',
          lifecycleAction: 'OPEN',
          price: 3200,
          quantity: 0.25,
          fee: 0,
          realizedPnl: 0,
          executedAt: new Date('2026-04-29T12:01:10.000Z'),
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
        },
        {
          userId: ownerUser.id,
          botId: bot.id,
          walletId: liveWallet.id,
          positionId: position.id,
          strategyId: null,
          symbol: 'ETHUSDT',
          side: 'BUY',
          lifecycleAction: 'DCA',
          price: 3150,
          quantity: 0.25,
          fee: 0,
          realizedPnl: 0,
          executedAt: new Date('2026-04-29T12:02:10.000Z'),
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
        },
      ],
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${bot.id}/runtime-sessions/${session.id}/positions`
    );
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toHaveLength(1);

    const item = positionsRes.body.openItems[0] as {
      actionable: boolean;
      strategyAutomationContextResolved: boolean;
      dcaPlannedLevels: number[];
      trailingStopLevels: unknown[];
      trailingTakeProfitLevels: unknown[];
    };
    expect(item.actionable).toBe(false);
    expect(item.strategyAutomationContextResolved).toBe(false);
    expect(item.dcaPlannedLevels).toEqual([]);
    expect(item.trailingStopLevels).toEqual([]);
    expect(item.trailingTakeProfitLevels).toEqual([]);
  });

  it('keeps dynamic-stop column visibility canonical when legacy strategy links are stale', async () => {
    const ownerEmail = 'bot-runtime-dynamic-columns-canonical-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const canonicalStrategyId = await createStrategy(owner, 'Runtime Canonical Basic Close');
    const staleLegacyStrategyId = await createStrategy(
      owner,
      'Runtime Stale Legacy Advanced Close',
      DYNAMIC_STOP_STRATEGY_CONFIG
    );
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: ownerUser.id,
        name: `Dynamic Columns Canonical Universe ${Date.now()}`,
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const group = await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: universe.id,
        name: 'Dynamic Columns Canonical Group',
        symbols: ['ETHUSDT'],
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: ownerUser.id,
        name: 'Dynamic Columns Canonical Wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'Dynamic Columns Canonical Bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        walletId: wallet.id,
        strategyId: canonicalStrategyId,
        symbolGroupId: group.id,
        isActive: true,
      },
    });
    const botMarketGroup = await prisma.botMarketGroup.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        symbolGroupId: group.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        maxOpenPositions: 2,
        isEnabled: true,
      },
    });
    await prisma.marketGroupStrategyLink.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        botMarketGroupId: botMarketGroup.id,
        strategyId: canonicalStrategyId,
        priority: 1,
        weight: 1,
        isEnabled: true,
      },
    });
    await prisma.botStrategy.create({
      data: {
        botId: bot.id,
        strategyId: staleLegacyStrategyId,
        symbolGroupId: group.id,
        isEnabled: true,
      },
    });
    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-29T14:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-29T14:01:00.000Z'),
      },
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${bot.id}/runtime-sessions/${session.id}/positions`
    );

    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.showDynamicStopColumns).toBe(false);
  });

  it('keeps symbol-level dynamic-stop plans canonical when legacy strategy links are stale', async () => {
    const ownerEmail = 'bot-runtime-dynamic-plan-canonical-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const canonicalStrategyId = await createStrategy(owner, 'Runtime Canonical Symbol Basic Close');
    const staleLegacyStrategyId = await createStrategy(
      owner,
      'Runtime Stale Symbol Advanced Close',
      DYNAMIC_STOP_STRATEGY_CONFIG
    );
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: ownerUser.id,
        name: `Dynamic Plan Canonical Universe ${Date.now()}`,
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const group = await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: universe.id,
        name: 'Dynamic Plan Canonical Group',
        symbols: ['ETHUSDT'],
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: ownerUser.id,
        name: 'Dynamic Plan Canonical Wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        paperInitialBalance: 10_000,
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'Dynamic Plan Canonical Bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        walletId: wallet.id,
        strategyId: canonicalStrategyId,
        symbolGroupId: group.id,
        isActive: true,
      },
    });
    const botMarketGroup = await prisma.botMarketGroup.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        symbolGroupId: group.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        maxOpenPositions: 2,
        isEnabled: true,
      },
    });
    await prisma.marketGroupStrategyLink.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        botMarketGroupId: botMarketGroup.id,
        strategyId: canonicalStrategyId,
        priority: 1,
        weight: 1,
        isEnabled: true,
      },
    });
    await prisma.botStrategy.create({
      data: {
        botId: bot.id,
        strategyId: staleLegacyStrategyId,
        symbolGroupId: group.id,
        isEnabled: true,
      },
    });

    const [trailingStopLevelsBySymbol, trailingTakeProfitLevelsBySymbol] = await Promise.all([
      resolveBotTrailingStopLevelsBySymbol(ownerUser.id, bot.id, ['ETHUSDT']),
      resolveBotTrailingTakeProfitLevelsBySymbol(ownerUser.id, bot.id, ['ETHUSDT']),
    ]);

    expect(trailingStopLevelsBySymbol.get('ETHUSDT')).toEqual([]);
    expect(trailingTakeProfitLevelsBySymbol.get('ETHUSDT')).toEqual([]);
  });
});
