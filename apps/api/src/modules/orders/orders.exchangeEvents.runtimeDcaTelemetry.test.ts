import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { buildDcaExecutionDedupeKey } from '../engine/runtimeExecutionDedupe.service';
import { buildRuntimeClientOrderId } from '../engine/runtimeExecutionClientOrderId';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import { applyLiveExchangeOrderTradeUpdateEvent } from './orders.exchangeEvents.service';

const cleanupDb = async () => {
  await prisma.log.deleteMany();
  await prisma.backtestReport.deleteMany();
  await prisma.backtestTrade.deleteMany();
  await prisma.backtestRun.deleteMany();
  await prisma.orderFill.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.order.deleteMany();
  await prisma.liveOrderIntent.deleteMany();
  await prisma.position.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.botRuntimeSymbolStat.deleteMany();
  await prisma.botRuntimeEvent.deleteMany();
  await prisma.botRuntimeSession.deleteMany();
  await prisma.runtimeExecutionDedupe.deleteMany();
  await prisma.botStrategy.deleteMany();
  await prisma.botSubagentConfig.deleteMany();
  await prisma.botAssistantConfig.deleteMany();
  await prisma.marketGroupStrategyLink.deleteMany();
  await prisma.botMarketGroup.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.symbolGroup.deleteMany();
  await prisma.marketUniverse.deleteMany();
  await prisma.strategy.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.user.deleteMany();
};

describe('runtime exchange DCA telemetry', () => {
  beforeEach(cleanupDb);
  afterEach(async () => { await prisma.liveOrderIntent.deleteMany(); });
  it('applies Binance order-trade update to reprice and extend an existing LIVE position as DCA', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-dca@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-dca',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-dca',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        walletId: wallet.id,
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'v1',
      },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 62_000,
        quantity: 0.1,
        leverage: 5,
        continuityState: 'RECOVERING',
        missingSyncCount: 2,
      },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        positionId: position.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 0.05,
        filledQuantity: 0,
        exchangeOrderId: 'event-order-dca-1',
        submittedAt: new Date('2026-04-29T10:00:00.000Z'),
      },
    });
    const dedupeKey = buildDcaExecutionDedupeKey({
      userId: user.id,
      botId: bot.id,
      symbol: 'BTCUSDT',
      positionId: position.id,
      dcaLevelIndex: 0,
      positionSide: 'LONG',
    });
    await prisma.runtimeExecutionDedupe.create({
      data: {
        dedupeKey,
        dedupeVersion: 'v1',
        commandType: 'DCA',
        userId: user.id,
        botId: bot.id,
        symbol: 'BTCUSDT',
        status: 'PENDING',
        commandFingerprint: {
          positionId: position.id,
          dcaLevelIndex: 0,
          positionSide: 'LONG',
        },
        orderId: order.id,
        positionId: position.id,
        ttlExpiresAt: new Date('2026-04-30T10:00:00.000Z'),
      },
    });
    const clientOrderId = buildRuntimeClientOrderId(dedupeKey);
    await prisma.liveOrderIntent.create({ data: {
      id: order.id, userId: user.id, clientOrderId, payloadHash: 'runtime-dca-test',
      exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'BTCUSDT',
    } });
    const session = await prisma.botRuntimeSession.create({ data: {
      userId: user.id, botId: bot.id, mode: 'LIVE',
      startedAt: new Date('2026-04-29T09:00:00.000Z'),
    } });
    await runtimePositionStateStore.setPositionRuntimeState(position.id, {
      quantity: 0.1,
      averageEntryPrice: 62_000,
      currentAdds: 0,
      trailingAnchorPrice: 62_000,
    });

    const exchangeEvent = {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: Date.parse('2026-04-29T10:00:01.000Z'),
        transactionTime: Date.parse('2026-04-29T10:00:01.100Z'),
        symbol: 'BTCUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-order-dca-1',
        clientOrderId,
        averagePrice: 63_500,
        cumulativeFilledQuantity: 0.05,
        lastFilledQuantity: 0.05,
        lastFilledPrice: 63_500,
        fee: 0.03,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-dca-1',
        raw: {},
      } as const;
    await expect(applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id, event: exchangeEvent,
      afterCoreCommit: async () => { throw new Error('crash after DCA core commit'); },
    })).rejects.toThrow('crash after DCA core commit');
    const result = await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id, event: exchangeEvent,
    });

    expect(result).toEqual(
      expect.objectContaining({
        status: 'applied',
        orderId: order.id,
        positionId: position.id,
        orderStatus: 'FILLED',
      })
    );
    const updatedPosition = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
    });
    expect(updatedPosition.quantity).toBeCloseTo(0.15, 10);
    expect(updatedPosition.entryPrice).toBeCloseTo(62_500, 10);
    expect(updatedPosition.continuityState).toBe('CONFIRMED');
    expect(updatedPosition.missingSyncCount).toBe(0);
    const dcaTrade = await prisma.trade.findFirstOrThrow({
      where: { orderId: order.id },
    });
    expect(dcaTrade.lifecycleAction).toBe('DCA');
    expect(dcaTrade.exchangeTradeId).toBe('trade-dca-1');
    const updatedDedupe = await prisma.runtimeExecutionDedupe.findUniqueOrThrow({
      where: { dedupeKey },
    });
    expect(updatedDedupe.status).toBe('SUCCEEDED');
    expect(await prisma.botRuntimeEvent.count({ where: {
      sessionId: session.id, eventType: 'DCA_EXECUTED',
    } })).toBe(1);
    expect(await prisma.botRuntimeSymbolStat.findUniqueOrThrow({
      where: { sessionId_symbol: { sessionId: session.id, symbol: 'BTCUSDT' } },
    })).toMatchObject({ dcaCount: 1, feesPaid: 0.03 });
    const runtimeState = await runtimePositionStateStore.getPositionRuntimeState(position.id);
    expect(runtimeState?.quantity).toBeCloseTo(0.15, 10);
    expect(runtimeState?.averageEntryPrice).toBeCloseTo(62_500, 10);
    expect(runtimeState?.currentAdds).toBe(1);
    expect(runtimeState?.executedDcaLevelIndices).toEqual([0]);
    expect(runtimeState?.trailingAnchorPrice).toBeCloseTo(62_000, 10);
    expect(runtimeState?.lastDcaPrice).toBeCloseTo(63_500, 10);
    await runtimePositionStateStore.deletePositionRuntimeState(position.id);
  });

});
