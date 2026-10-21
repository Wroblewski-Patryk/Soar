import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { resolvePaperRuntimeCapitalSnapshot } from './runtimeCapitalContext.service';
import { loadDurableDcaProgress } from './runtimeDurableDcaProgress';
import { executeRuntimeDca, RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { runtimePositionStateStore } from './runtimePositionState.store';
import { RuntimeSignalLoop } from './runtimeSignalLoop.service';
import { clearRuntimeSignalMarketDataStore } from './runtimeSignalMarketDataGateway';
import { clearRuntimeTickerStore } from './runtimeTickerStore';

const proofIt = process.env.RUN_PAPER_FUTURES_BALANCE_PROOF === '1' ? it : it.skip;
const symbol = 'BTCUSDT';
const leverage = 100;
const initialBalance = 10;
const feeRate = 0.0004;

describe('PAPER Futures capital snapshot from durable position cycle', () => {
  proofIt('reserves and releases margin once through entry, two DCA fills, TP and rebuild', async () => {
    const databaseUrl = new URL(process.env.DATABASE_URL ?? '');
    if (databaseUrl.pathname.slice(1) !== 'soar_position_parity_003_test' ||
        databaseUrl.hostname !== '127.0.0.1' || !databaseUrl.port || databaseUrl.port === '5432') {
      throw new Error('PAPER balance proof requires its own local soar_position_parity_003_test database');
    }
    const redisUrl = new URL(process.env.REDIS_URL ?? '');
    if (redisUrl.hostname !== '127.0.0.1' || !redisUrl.port || redisUrl.port === '6379') {
      throw new Error('PAPER balance proof requires its own local Redis port');
    }
    if (await prisma.user.count() !== 0) {
      throw new Error('PAPER balance proof requires an empty disposable user dataset');
    }

    const previousPaperFeeRate = process.env.RUNTIME_PAPER_TAKER_FEE_RATE;
    process.env.RUNTIME_PAPER_TAKER_FEE_RATE = String(feeRate);
    clearRuntimeTickerStore();
    clearRuntimeSignalMarketDataStore();
    const loop = new RuntimeSignalLoop();
    let botId: string | undefined;
    let positionId: string | undefined;
    try {
      const agent = request.agent(app);
      const email = `paper-futures-balance-${randomUUID()}@example.test`;
      expect((await agent.post('/auth/register').send({ email, password: 'test1234' })).status)
        .toBe(201);
      const user = await prisma.user.findUniqueOrThrow({ where: { email } });
      await ensureSubscriptionCatalog(prisma);
      await setActiveSubscriptionForUser(prisma, {
        userId: user.id, planCode: 'PROFESSIONAL', source: 'ADMIN_OVERRIDE',
        metadata: { reason: 'isolated-paper-futures-balance-proof' },
      });
      const strategyResponse = await agent.post('/dashboard/strategies').send({
        name: 'PAPER Futures balance cycle', interval: '1m', leverage, walletRisk: 10,
        config: {
          open: { direction: 'long', noMatchAction: 'EXIT',
            indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: 0, params: { period: 1 } }],
            indicatorsShort: [] },
          close: { mode: 'basic', tp: 20, sl: 20 },
          additional: { dcaEnabled: true, dcaMode: 'basic', dcaSizingBasis: 'usdt_contribution_v1',
            dcaTimes: 2, dcaLevels: [{ percent: -30.5, multiplier: 2 }] },
        },
      });
      expect(strategyResponse.status).toBe(201);
      const universe = await prisma.marketUniverse.create({ data: {
        userId: user.id, name: 'Balance proof universe', marketType: 'FUTURES',
        baseCurrency: 'USDT', whitelist: [], blacklist: [],
      } });
      const group = await prisma.symbolGroup.create({ data: {
        userId: user.id, marketUniverseId: universe.id,
        name: 'Balance proof symbols', symbols: [symbol],
      } });
      const wallet = await prisma.wallet.create({ data: {
        userId: user.id, name: 'Balance proof PAPER wallet', mode: 'PAPER',
        exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
        paperInitialBalance: initialBalance,
      } });
      const botResponse = await agent.post('/dashboard/bots').send({
        name: 'Balance proof PAPER bot', walletId: wallet.id,
        strategyId: strategyResponse.body.id as string,
        marketGroupId: group.id, isActive: true, liveOptIn: false,
        consentTextVersion: null,
      });
      expect(botResponse.status).toBe(201);
      botId = botResponse.body.id as string;

      const baseTime = Date.now();
      const prices = [0.99, 1, 1, 0.999, 0.99694, 0.99694, 0.9949, 0.9949, 0.99792, 0.99];
      const emitCandle = (index: number) => {
        const openTime = baseTime + index * 60_000;
        const price = prices[index];
        return loop.processCandleEvent({
          type: 'candle', exchange: 'BINANCE', marketType: 'FUTURES', symbol,
          interval: '1m', eventTime: openTime + 59_999, openTime,
          closeTime: openTime + 59_999, open: price, high: price,
          low: price, close: price, volume: 1_000, isFinal: true,
        });
      };
      const createAutomation = () => new RuntimePositionAutomationService({
        getCanonicalPositionState: async (id) => {
          const position = await prisma.position.findUnique({ where: { id } });
          return position ? { quantity: position.quantity, averageEntryPrice: position.entryPrice }
            : null;
        },
        getDurableDcaProgress: (input) => loadDurableDcaProgress(input),
        executeDca: (input) => executeRuntimeDca(input, { getOrderRules: async () => ({
          minAmount: 0.00000001, minNotional: 0.01, amountPrecision: 8, contractSize: 1,
        }) }),
        resolveLifecyclePrice: ({ fallbackPrice }) => fallbackPrice,
      });
      const send = (service: RuntimePositionAutomationService, index: number) =>
        service.handleTickerEvent({ type: 'ticker', exchange: 'BINANCE',
          marketType: 'FUTURES', symbol, eventTime: baseTime + index * 60_000 + 59_999,
          lastPrice: prices[index], priceChangePercent24h: 0 });
      const readStage = async (expectedActions: string[], expectedMargin: number,
        expectedRealizedPnl = 0) => {
        const position = await prisma.position.findFirstOrThrow({ where: { botId, symbol } });
        const orders = await prisma.order.findMany({
          where: { positionId: position.id }, orderBy: { createdAt: 'asc' },
        });
        const trades = await prisma.trade.findMany({
          where: { positionId: position.id }, orderBy: { executedAt: 'asc' },
        });
        const snapshot = await resolvePaperRuntimeCapitalSnapshot({
          userId: user.id, botId, walletId: wallet.id, paperStartBalance: initialBalance,
        });
        expect(trades.map((trade) => trade.lifecycleAction)).toEqual(expectedActions);
        expect(orders).toHaveLength(expectedActions.length);
        expect(new Set(orders.map((order) => order.id)).size).toBe(orders.length);
        for (const trade of trades) {
          const order = orders.find((candidate) => candidate.id === trade.orderId);
          expect(order).toBeDefined();
          expect(order?.status).toBe('FILLED');
          expect(order?.filledAt).not.toBeNull();
          expect(order?.filledQuantity).toBeCloseTo(trade.quantity, 7);
          expect(order?.averageFillPrice).toBeCloseTo(trade.price, 7);
        }
        expect(snapshot.capitalSource).toBe('PAPER_INITIAL_BALANCE');
        expect(snapshot.baseCurrency).toBe('USDT');
        expect(snapshot.accountBalance).toBeNull();
        expect(snapshot.realizedPnl).toBeCloseTo(expectedRealizedPnl, 6);
        expect(snapshot.referenceBalance).toBeCloseTo(initialBalance + expectedRealizedPnl, 6);
        expect(snapshot.reservedMargin).toBeCloseTo(expectedMargin, 4);
        expect(snapshot.freeCash).toBeCloseTo(initialBalance + expectedRealizedPnl - expectedMargin, 4);
        if (position.status === 'OPEN') {
          expect(snapshot.reservedMargin).toBeCloseTo(
            position.entryPrice * position.quantity / leverage, 6);
        }
        return { position, orders, trades, snapshot };
      };

      await emitCandle(0);
      await emitCandle(1);
      await emitCandle(2);
      await loop.processTickerEvent({ type: 'ticker', exchange: 'BINANCE',
        marketType: 'FUTURES', symbol, eventTime: baseTime + 2 * 60_000 + 59_999,
        lastPrice: prices[2], priceChangePercent24h: 1 });
      const entry = await readStage(['OPEN'], 1);
      positionId = entry.position.id;
      expect(entry.position.status).toBe('OPEN');
      await emitCandle(3);
      expect(await prisma.signal.count({ where: { botId, symbol, direction: 'EXIT' } })).toBe(0);
      expect((await readStage(['OPEN'], 1)).snapshot).toEqual(entry.snapshot);

      const firstService = createAutomation();
      await send(firstService, 4);
      await send(firstService, 5);
      const firstDca = await readStage(['OPEN', 'DCA'], 3);
      expect(firstDca.position.status).toBe('OPEN');
      expect(firstDca.snapshot.freeCash).toBeCloseTo(7, 4);

      await runtimePositionStateStore.deletePositionRuntimeState(positionId);
      const secondService = createAutomation();
      expect((await readStage(['OPEN', 'DCA'], 3)).snapshot).toEqual(firstDca.snapshot);
      await send(secondService, 6);
      await send(secondService, 7);
      const secondDca = await readStage(['OPEN', 'DCA', 'DCA'], 9);
      expect(secondDca.position.status).toBe('OPEN');
      expect(secondDca.snapshot.freeCash).toBeCloseTo(1, 4);
      expect(secondDca.trades.slice(0, 3).map((trade) => trade.price))
        .toEqual([prices[2], prices[4], prices[6]]);
      const contributions = secondDca.trades.map((trade) => trade.price * trade.quantity / leverage);
      contributions.forEach((amount, index) => expect(amount).toBeCloseTo([1, 2, 6][index], 4));

      await runtimePositionStateStore.deletePositionRuntimeState(positionId);
      const closeService = createAutomation();
      expect((await readStage(['OPEN', 'DCA', 'DCA'], 9)).snapshot).toEqual(secondDca.snapshot);
      await send(closeService, 8);
      const closed = await prisma.position.findUniqueOrThrow({ where: { id: positionId } });
      expect(closed.status).toBe('CLOSED');
      expect(closed.closeReason).toBe('TP');
      const closedTrades = await prisma.trade.findMany({ where: { positionId } });
      const basis = closedTrades.filter((trade) => trade.lifecycleAction !== 'CLOSE');
      const close = closedTrades.find((trade) => trade.lifecycleAction === 'CLOSE');
      expect(close).toBeDefined();
      const quantity = basis.reduce((sum, trade) => sum + trade.quantity, 0);
      const average = basis.reduce((sum, trade) => sum + trade.price * trade.quantity, 0) / quantity;
      const fees = closedTrades.reduce((sum, trade) => sum + (trade.fee ?? 0), 0);
      expect(closedTrades.every((trade) => (trade.fee ?? 0) > 0)).toBe(true);
      expect(fees).toBeCloseTo(closedTrades.reduce((sum, trade) =>
        sum + trade.price * trade.quantity * feeRate, 0), 6);
      const netRealizedPnl = ((close?.price ?? NaN) - average) * quantity - fees;
      expect(closed.realizedPnl).toBeCloseTo(netRealizedPnl, 5);
      const afterClose = await readStage(['OPEN', 'DCA', 'DCA', 'CLOSE'], 0, netRealizedPnl);
      expect(afterClose.snapshot.freeCash).toBeCloseTo(10 + netRealizedPnl, 5);

      await runtimePositionStateStore.deletePositionRuntimeState(positionId);
      expect((await readStage(['OPEN', 'DCA', 'DCA', 'CLOSE'], 0, netRealizedPnl)).snapshot)
        .toEqual(afterClose.snapshot);
      await send(createAutomation(), 9);
      const afterRetry = await readStage(['OPEN', 'DCA', 'DCA', 'CLOSE'], 0, netRealizedPnl);
      expect(afterRetry.position).toEqual(afterClose.position);
      expect(afterRetry.orders).toEqual(afterClose.orders);
      expect(afterRetry.trades).toEqual(afterClose.trades);
      expect(afterRetry.snapshot).toEqual(afterClose.snapshot);
    } finally {
      const cleanupErrors: Error[] = [];
      const cleanup = async (name: string, run: () => Promise<unknown>) => {
        try { await run(); } catch (error) {
          cleanupErrors.push(new Error(`${name}: ${String(error)}`, { cause: error }));
        }
      };
      if (botId) await cleanup('deactivate owned bot', () =>
        prisma.bot.updateMany({ where: { id: botId }, data: { isActive: false } }));
      if (positionId) {
        const ownedPositionId = positionId;
        await cleanup('clear owned runtime state', () =>
          runtimePositionStateStore.deletePositionRuntimeState(ownedPositionId));
      }
      await cleanup('truncate dedicated user dataset', () =>
        prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`);
      clearRuntimeTickerStore();
      clearRuntimeSignalMarketDataStore();
      if (previousPaperFeeRate === undefined) delete process.env.RUNTIME_PAPER_TAKER_FEE_RATE;
      else process.env.RUNTIME_PAPER_TAKER_FEE_RATE = previousPaperFeeRate;
      if (cleanupErrors.length > 0) throw new AggregateError(cleanupErrors, 'Balance proof cleanup failed');
    }
  }, 60_000);
});
