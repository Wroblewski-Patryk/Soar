import { describe, expect, it, beforeEach } from 'vitest';

import { prisma } from '../../prisma/client';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

const createLiveWallet = async (
  userId: string,
  exchange: 'BINANCE' | 'GATEIO',
  label: string
) => {
  const apiKey = await prisma.apiKey.create({
    data: {
      userId,
      label,
      exchange,
      apiKey: `encrypted-${label}-key`,
      apiSecret: `encrypted-${label}-secret`,
      syncExternalPositions: true,
      manageExternalPositions: true,
    },
    select: { id: true },
  });
  const wallet = await prisma.wallet.create({
    data: {
      userId,
      name: `Concurrent ${exchange} LIVE Wallet`,
      mode: 'LIVE',
      exchange,
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      paperInitialBalance: 10_000,
      liveAllocationMode: 'PERCENT',
      liveAllocationValue: 100,
      apiKeyId: apiKey.id,
    },
    select: { id: true },
  });
  return { apiKeyId: apiKey.id, walletId: wallet.id };
};

const setSymbols = async (symbolGroupId: string, symbols: string[]) => {
  await prisma.symbolGroup.update({
    where: { id: symbolGroupId },
    data: { symbols },
  });
};

describe('LIVE/PAPER concurrent runtime contract', () => {
  beforeEach(resetBotsE2eState);

  it('allows two PAPER bots plus Binance and Gate.io LIVE bots while keeping runtime reads isolated', async () => {
    const email = 'bots-live-paper-concurrent@example.com';
    const agent = await registerAndLogin(email);
    const user = await prisma.user.findUniqueOrThrow({ where: { email }, select: { id: true } });
    const strategyId = await createStrategy(agent, 'Concurrent Runtime Strategy');

    const paperGroupA = await createMarketGroup(email, 'FUTURES', 'BINANCE');
    const paperGroupB = await createMarketGroup(email, 'FUTURES', 'BINANCE');
    const binanceLiveGroup = await createMarketGroup(email, 'FUTURES', 'BINANCE');
    const gateLiveGroup = await createMarketGroup(email, 'FUTURES', 'GATEIO');
    await setSymbols(paperGroupA, ['ETHUSDT']);
    await setSymbols(paperGroupB, ['SOLUSDT']);
    await setSymbols(binanceLiveGroup, ['BTCUSDT']);
    await setSymbols(gateLiveGroup, ['BTCUSDT']);

    const binanceLive = await createLiveWallet(user.id, 'BINANCE', 'concurrent-binance-live');
    const gateLive = await createLiveWallet(user.id, 'GATEIO', 'concurrent-gateio-live');

    const paperA = await agent.post('/dashboard/bots').send({
      ...createPayload({ strategyId, marketGroupId: paperGroupA }),
      name: 'Concurrent Paper A',
      isActive: true,
    });
    expect(paperA.status).toBe(201);
    const paperB = await agent.post('/dashboard/bots').send({
      ...createPayload({ strategyId, marketGroupId: paperGroupB }),
      name: 'Concurrent Paper B',
      isActive: true,
    });
    expect(paperB.status).toBe(201);
    const liveBinanceBot = await agent.post('/dashboard/bots').send({
      ...createPayload({ strategyId, marketGroupId: binanceLiveGroup, walletId: binanceLive.walletId }),
      name: 'Concurrent Binance LIVE',
      isActive: true,
      liveOptIn: true,
      consentTextVersion: 'mvp-v1',
      manageExternalPositions: true,
    });
    expect(liveBinanceBot.status).toBe(201);
    const liveGateBot = await agent.post('/dashboard/bots').send({
      ...createPayload({ strategyId, marketGroupId: gateLiveGroup, walletId: gateLive.walletId }),
      name: 'Concurrent Gate.io LIVE',
      isActive: true,
      liveOptIn: true,
      consentTextVersion: 'mvp-v1',
      manageExternalPositions: true,
    });
    expect(liveGateBot.status).toBe(201);

    const listRes = await agent.get('/dashboard/bots').query({ active: 'true' });
    expect(listRes.status).toBe(200);
    expect(listRes.body.map((bot: { name: string }) => bot.name)).toEqual(
      expect.arrayContaining([
        'Concurrent Paper A',
        'Concurrent Paper B',
        'Concurrent Binance LIVE',
        'Concurrent Gate.io LIVE',
      ])
    );

    const paperSession = await prisma.botRuntimeSession.create({
      data: {
        userId: user.id,
        botId: paperA.body.id,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-05-13T10:00:00.000Z'),
      },
    });
    const binanceSession = await prisma.botRuntimeSession.create({
      data: {
        userId: user.id,
        botId: liveBinanceBot.body.id,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-05-13T10:00:00.000Z'),
      },
    });
    const gateSession = await prisma.botRuntimeSession.create({
      data: {
        userId: user.id,
        botId: liveGateBot.body.id,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-05-13T10:00:00.000Z'),
      },
    });

    await prisma.position.createMany({
      data: [
        {
          userId: user.id,
          botId: paperA.body.id,
          walletId: null,
          strategyId,
          symbol: 'ETHUSDT',
          side: 'LONG',
          status: 'OPEN',
          origin: 'BOT',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
          continuityState: 'CONFIRMED',
          entryPrice: 3000,
          quantity: 1,
          leverage: 2,
          openedAt: new Date('2026-05-13T10:01:00.000Z'),
        },
        {
          userId: user.id,
          botId: null,
          walletId: binanceLive.walletId,
          strategyId: null,
          externalId: `${binanceLive.apiKeyId}:FUTURES:BTCUSDT:LONG`,
          symbol: 'BTCUSDT',
          side: 'LONG',
          status: 'OPEN',
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
          continuityState: 'CONFIRMED',
          entryPrice: 100000,
          quantity: 0.01,
          leverage: 2,
          openedAt: new Date('2026-05-13T10:02:00.000Z'),
        },
        {
          userId: user.id,
          botId: null,
          walletId: gateLive.walletId,
          strategyId: null,
          externalId: `${gateLive.apiKeyId}:FUTURES:BTCUSDT:LONG`,
          symbol: 'BTCUSDT',
          side: 'SHORT',
          status: 'OPEN',
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
          continuityState: 'CONFIRMED',
          entryPrice: 101000,
          quantity: 0.02,
          leverage: 2,
          openedAt: new Date('2026-05-13T10:03:00.000Z'),
        },
      ],
    });

    const paperPositions = await agent.get(
      `/dashboard/bots/${paperA.body.id}/runtime-sessions/${paperSession.id}/positions`
    );
    expect(paperPositions.status).toBe(200);
    expect(paperPositions.body.openItems.map((item: { symbol: string }) => item.symbol)).toEqual([
      'ETHUSDT',
    ]);

    const binancePositions = await agent.get(
      `/dashboard/bots/${liveBinanceBot.body.id}/runtime-sessions/${binanceSession.id}/positions`
    );
    expect(binancePositions.status).toBe(200);
    expect(binancePositions.body.openItems).toEqual([
      expect.objectContaining({
        symbol: 'BTCUSDT',
        side: 'LONG',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
      }),
    ]);

    const gatePositions = await agent.get(
      `/dashboard/bots/${liveGateBot.body.id}/runtime-sessions/${gateSession.id}/positions`
    );
    expect(gatePositions.status).toBe(200);
    expect(gatePositions.body.openItems).toEqual([
      expect.objectContaining({
        symbol: 'BTCUSDT',
        side: 'SHORT',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
      }),
    ]);
  });
});
