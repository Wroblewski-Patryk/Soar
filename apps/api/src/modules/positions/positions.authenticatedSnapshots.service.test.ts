import { Exchange } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';

import { prisma } from '../../prisma/client';
import {
  fetchExchangeOpenOrdersSnapshotByApiKeyId,
  fetchExchangeTradeHistorySnapshotByApiKeyId,
} from './positions.service';

const cleanup = async () => {
  await prisma.trade.deleteMany();
  await prisma.order.deleteMany();
  await prisma.position.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.runtimeExecutionDedupe.deleteMany();
  await prisma.botRuntimeSymbolStat.deleteMany();
  await prisma.botRuntimeEvent.deleteMany();
  await prisma.botRuntimeSession.deleteMany();
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
};

const createApiKey = async (exchange: Exchange) => {
  const user = await prisma.user.create({
    data: {
      email: `positions-auth-snapshot-${exchange.toLowerCase()}-${randomUUID()}@example.com`,
      password: 'hashed',
    },
    select: { id: true },
  });

  const apiKey = await prisma.apiKey.create({
    data: {
      userId: user.id,
      label: `${exchange} stored key`,
      exchange,
      apiKey: `${exchange}_KEY_12345`,
      apiSecret: `${exchange}_SECRET_12345`,
    },
    select: { id: true },
  });

  return { userId: user.id, apiKeyId: apiKey.id };
};

describe('positions authenticated snapshots service', () => {
  beforeEach(cleanup);

  it('returns Gate.io open-orders snapshot and marks the key used after success', async () => {
    const { userId, apiKeyId } = await createApiKey('GATEIO');

    const snapshot = await fetchExchangeOpenOrdersSnapshotByApiKeyId(userId, apiKeyId);

    expect(snapshot.source).toBe('GATEIO');
    expect(snapshot.orders).toHaveLength(1);
    expect(snapshot.orders[0]).toMatchObject({
      exchangeOrderId: 'test-open-order-1',
      symbol: 'BTC/USDT:USDT',
      status: 'open',
    });

    const dbKey = await prisma.apiKey.findUniqueOrThrow({ where: { id: apiKeyId } });
    expect(dbKey.lastUsed).not.toBeNull();
  });

  it('returns Gate.io trade-history snapshot and marks the key used after success', async () => {
    const { userId, apiKeyId } = await createApiKey('GATEIO');

    const snapshot = await fetchExchangeTradeHistorySnapshotByApiKeyId(userId, apiKeyId, {
      symbol: 'BTCUSDT',
    });

    expect(snapshot.source).toBe('GATEIO');
    expect(snapshot.symbol).toBe('BTCUSDT');
    expect(snapshot.trades).toEqual([]);

    const dbKey = await prisma.apiKey.findUniqueOrThrow({ where: { id: apiKeyId } });
    expect(dbKey.lastUsed).not.toBeNull();
  });

  it('keeps Binance test-mode open-orders and trade-history snapshots usable', async () => {
    const { userId, apiKeyId } = await createApiKey('BINANCE');

    const openOrders = await fetchExchangeOpenOrdersSnapshotByApiKeyId(userId, apiKeyId);
    const tradeHistory = await fetchExchangeTradeHistorySnapshotByApiKeyId(userId, apiKeyId, {
      symbol: 'BTCUSDT',
    });

    expect(openOrders.source).toBe('BINANCE');
    expect(openOrders.orders).toHaveLength(1);
    expect(tradeHistory.source).toBe('BINANCE');
    expect(tradeHistory.trades).toEqual([]);

    const dbKey = await prisma.apiKey.findUniqueOrThrow({ where: { id: apiKeyId } });
    expect(dbKey.lastUsed).not.toBeNull();
  });
});
