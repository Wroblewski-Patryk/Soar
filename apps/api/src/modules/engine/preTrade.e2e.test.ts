import { beforeEach, describe, expect, it } from 'vitest';
import { analyzePreTrade } from './preTrade.service';
import { prisma } from '../../prisma/client';

describe('preTrade e2e smoke (paper/live critical paths)', () => {
  beforeEach(async () => {
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
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.user.deleteMany();
  });

  it('allows LIVE pre-trade for opted-in bot and writes INFO audit log', async () => {
    const user = await prisma.user.create({
      data: { email: 'pretrade-live-ok@example.com', password: 'hashed-pass' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Live wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Live universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: marketUniverse.id,
        name: 'Live group',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Live bot',
        walletId: wallet.id,
        symbolGroupId: symbolGroup.id,
        mode: 'PAPER',
        marketType: 'SPOT',
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        isActive: true,
      },
    });

    const decision = await analyzePreTrade({
      userId: user.id,
      botId: bot.id,
      symbol: 'BTCUSDT',
      mode: 'LIVE',
    });

    expect(decision.allowed).toBe(true);

    const logs = await prisma.log.findMany({
      where: {
        userId: user.id,
        botId: bot.id,
        source: 'engine.pre-trade',
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(logs).toHaveLength(1);
    expect(logs[0].action).toBe('trade.precheck.allowed');
    expect(logs[0].level).toBe('INFO');
  });

  it('blocks LIVE pre-trade when kill-switch is enabled and writes WARN audit log', async () => {
    const user = await prisma.user.create({
      data: { email: 'pretrade-live-stop@example.com', password: 'hashed-pass' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Live guarded wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Live guarded universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: marketUniverse.id,
        name: 'Live guarded group',
        symbols: ['ETHUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Live bot guarded',
        walletId: wallet.id,
        symbolGroupId: symbolGroup.id,
        mode: 'PAPER',
        marketType: 'SPOT',
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        isActive: true,
      },
    });

    const decision = await analyzePreTrade({
      userId: user.id,
      botId: bot.id,
      symbol: 'ETHUSDT',
      mode: 'LIVE',
      globalKillSwitch: true,
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reasons).toContain('global_kill_switch_enabled');

    const log = await prisma.log.findFirstOrThrow({
      where: {
        userId: user.id,
        botId: bot.id,
        source: 'engine.pre-trade',
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(log.action).toBe('trade.precheck.blocked');
    expect(log.level).toBe('WARN');
  });

  it('inherits LIVE mode and marketType from wallet and market scope instead of bot snapshots', async () => {
    const user = await prisma.user.create({
      data: { email: 'pretrade-live-inherited@example.com', password: 'hashed-pass' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Inherited wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Inherited universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: marketUniverse.id,
        name: 'Inherited group',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Inherited live bot',
        walletId: wallet.id,
        symbolGroupId: symbolGroup.id,
        mode: 'PAPER',
        marketType: 'SPOT',
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        isActive: true,
      },
    });

    const decision = await analyzePreTrade({
      userId: user.id,
      botId: bot.id,
      symbol: 'BTCUSDT',
      mode: 'LIVE',
      marketType: 'SPOT',
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reasons).toContain('bot_market_type_mismatch');
  });

  it('prefers active canonical market-group venue over stale direct bot symbol group', async () => {
    const user = await prisma.user.create({
      data: { email: 'pretrade-live-canonical-venue@example.com', password: 'hashed-pass' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Canonical venue wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const staleSpotUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Stale spot universe',
        exchange: 'BINANCE',
        marketType: 'SPOT',
        baseCurrency: 'USDT',
      },
    });
    const canonicalFuturesUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Canonical futures universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const staleSpotGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: staleSpotUniverse.id,
        name: 'Stale spot group',
        symbols: ['BTCUSDT'],
      },
    });
    const canonicalFuturesGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: canonicalFuturesUniverse.id,
        name: 'Canonical futures group',
        symbols: ['BTCUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Canonical venue live bot',
        walletId: wallet.id,
        symbolGroupId: staleSpotGroup.id,
        mode: 'PAPER',
        marketType: 'SPOT',
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        isActive: true,
      },
    });
    await prisma.botMarketGroup.create({
      data: {
        userId: user.id,
        botId: bot.id,
        symbolGroupId: canonicalFuturesGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        isEnabled: true,
      },
    });

    const decision = await analyzePreTrade({
      userId: user.id,
      botId: bot.id,
      symbol: 'BTCUSDT',
      mode: 'LIVE',
      marketType: 'FUTURES',
    });

    expect(decision.allowed).toBe(true);
    expect(decision.reasons).not.toContain('live_bot_not_found');
    expect(decision.reasons).not.toContain('bot_market_type_mismatch');
  });

  it('blocks PAPER pre-trade on open symbol position and writes WARN audit log', async () => {
    const user = await prisma.user.create({
      data: { email: 'pretrade-paper-block@example.com', password: 'hashed-pass' },
    });

    await prisma.position.create({
      data: {
        userId: user.id,
        symbol: 'SOLUSDT',
        side: 'LONG',
        entryPrice: 100,
        quantity: 1,
      },
    });

    const decision = await analyzePreTrade({
      userId: user.id,
      symbol: 'SOLUSDT',
      mode: 'PAPER',
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reasons).toContain('open_position_on_symbol_exists');

    const log = await prisma.log.findFirstOrThrow({
      where: { userId: user.id, source: 'engine.pre-trade' },
      orderBy: { createdAt: 'desc' },
    });
    expect(log.action).toBe('trade.precheck.blocked');
    expect(log.level).toBe('WARN');
  });

  it('allows bot-scoped PAPER pre-trade when another bot owns an open position on the same symbol', async () => {
    const user = await prisma.user.create({
      data: { email: 'pretrade-paper-other-bot-symbol@example.com', password: 'hashed-pass' },
    });
    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Paper universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: marketUniverse.id,
        name: 'Paper group',
        symbols: ['SOLUSDT'],
      },
    });
    const ownerBot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Owner paper bot',
        symbolGroupId: symbolGroup.id,
        mode: 'PAPER',
        marketType: 'FUTURES',
        isActive: true,
      },
    });
    const targetBot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Target paper bot',
        symbolGroupId: symbolGroup.id,
        mode: 'PAPER',
        marketType: 'FUTURES',
        isActive: true,
      },
    });

    await prisma.position.create({
      data: {
        userId: user.id,
        botId: ownerBot.id,
        symbol: 'SOLUSDT',
        side: 'LONG',
        entryPrice: 100,
        quantity: 1,
        status: 'OPEN',
        managementMode: 'BOT_MANAGED',
      },
    });

    const botScopedDecision = await analyzePreTrade({
      userId: user.id,
      botId: targetBot.id,
      symbol: 'SOLUSDT',
      mode: 'PAPER',
    });
    const globalDecision = await analyzePreTrade({
      userId: user.id,
      symbol: 'SOLUSDT',
      mode: 'PAPER',
    });

    expect(botScopedDecision.allowed).toBe(true);
    expect(botScopedDecision.reasons).not.toContain('open_position_on_symbol_exists');
    expect(globalDecision.allowed).toBe(false);
    expect(globalDecision.reasons).toContain('open_position_on_symbol_exists');
  });

  it('counts owned LIVE exchange-synced imports for bot open-position limits', async () => {
    const user = await prisma.user.create({
      data: { email: 'pretrade-live-imported-count@example.com', password: 'hashed-pass' },
    });
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        label: 'Pre-trade imported count key',
        exchange: 'BINANCE',
        apiKey: 'PRETRADE_IMPORTED_COUNT_KEY',
        apiSecret: 'PRETRADE_IMPORTED_COUNT_SECRET',
        syncExternalPositions: true,
        manageExternalPositions: true,
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Pre-trade imported count wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        apiKeyId: apiKey.id,
        manageExternalPositions: true,
      },
    });
    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Pre-trade imported count universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: marketUniverse.id,
        name: 'Pre-trade imported count group',
        symbols: ['BTCUSDT', 'ETHUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Pre-trade imported count bot',
        walletId: wallet.id,
        symbolGroupId: symbolGroup.id,
        mode: 'LIVE',
        marketType: 'FUTURES',
        liveOptIn: true,
        manageExternalPositions: true,
        consentTextVersion: 'mvp-v1',
        isActive: true,
      },
    });

    await prisma.position.create({
      data: {
        userId: user.id,
        botId: null,
        walletId: null,
        externalId: `${apiKey.id}:BTCUSDT:LONG`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 1,
      },
    });

    const decision = await analyzePreTrade({
      userId: user.id,
      botId: bot.id,
      symbol: 'ETHUSDT',
      mode: 'LIVE',
      maxOpenPositionsPerBot: 1,
    });

    expect(decision.allowed).toBe(false);
    expect(decision.metrics.botOpenPositions).toBe(1);
    expect(decision.reasons).toContain('bot_open_positions_limit_reached');
    expect(decision.reasons).not.toContain('open_position_on_symbol_exists');
  });
});


