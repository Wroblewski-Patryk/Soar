import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  prisma: {
    bot: {
      findFirst: vi.fn(),
    },
    position: {
      findFirst: vi.fn(),
      updateMany: vi.fn(),
    },
    trade: {
      findFirst: vi.fn(),
    },
    order: {
      findFirst: vi.fn(),
    },
  },
  orchestrateRuntimeSignal: vi.fn(),
  getOwnedBotRuntimeSession: vi.fn(),
  resolveRuntimeLifecycleMarkPrice: vi.fn(),
  fetchFallbackTickerPrices: vi.fn(),
  createPublicExchangeConnector: vi.fn(),
  resolveExternalPositionOwnershipIndex: vi.fn(),
}));

vi.mock('../../prisma/client', () => ({
  prisma: mocks.prisma,
}));

vi.mock('../engine/executionOrchestrator.service', () => ({
  orchestrateRuntimeSignal: mocks.orchestrateRuntimeSignal,
}));

vi.mock('./botOwnership.service', () => ({
  getOwnedBotRuntimeSession: mocks.getOwnedBotRuntimeSession,
}));

vi.mock('../engine/runtimeLifecycleMarkPrice.service', () => ({
  resolveRuntimeLifecycleMarkPrice: mocks.resolveRuntimeLifecycleMarkPrice,
}));

vi.mock('./runtimeMarketDataFallback.service', () => ({
  fetchFallbackTickerPrices: mocks.fetchFallbackTickerPrices,
}));

vi.mock('../exchange/exchangeConnectorFactory.service', () => ({
  createPublicExchangeConnector: mocks.createPublicExchangeConnector,
}));

vi.mock('./runtimeExternalPositionOwner.service', () => ({
  getExternalPositionOwnership: (
    ownershipIndex: Map<string, { status: string; botId: string | null; walletId: string | null }>,
    params: { apiKeyId: string | null; symbol: string }
  ) =>
    (params.apiKeyId ? ownershipIndex.get(`${params.apiKeyId}:${params.symbol}`) : null) ?? {
      status: 'UNOWNED',
      botId: null,
      walletId: null,
    },
  parseApiKeyIdFromExternalPositionId: (externalId: string | null) => externalId?.split(':')[0] ?? null,
  resolveExternalPositionOwnershipIndex: mocks.resolveExternalPositionOwnershipIndex,
}));

import { closeBotRuntimeSessionPosition } from './runtimeSessionPositionCommand.service';

describe('closeBotRuntimeSessionPosition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getOwnedBotRuntimeSession.mockResolvedValue({
      id: 'session-1',
    });
    mocks.prisma.bot.findFirst.mockResolvedValue({
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      walletId: 'wallet-live-1',
      wallet: {
        apiKeyId: 'key-live-1',
      },
    });
    mocks.resolveRuntimeLifecycleMarkPrice.mockReturnValue(50_100);
    mocks.fetchFallbackTickerPrices.mockResolvedValue(new Map());
    mocks.createPublicExchangeConnector.mockReturnValue({
      fetchMarkPrice: vi.fn(async () => Number.NaN),
      disconnect: vi.fn(async () => undefined),
    });
  });

  it('fails closed when external exchange ownership is ambiguous', async () => {
    mocks.prisma.position.findFirst.mockResolvedValue({
      id: 'position-1',
      botId: null,
      walletId: 'wallet-live-1',
      strategyId: 'strategy-1',
      symbol: 'BTCUSDT',
      quantity: 0.5,
      entryPrice: 50_000,
      origin: 'EXCHANGE_SYNC',
      externalId: 'key-live-1:BTCUSDT:LONG',
      continuityState: 'CONFIRMED',
    });
    mocks.resolveExternalPositionOwnershipIndex.mockResolvedValue(
      new Map([
        [
          'key-live-1:BTCUSDT',
          {
            status: 'AMBIGUOUS',
            botId: null,
            walletId: null,
          },
        ],
      ])
    );

    const result = await closeBotRuntimeSessionPosition(
      'user-1',
      'bot-1',
      'session-1',
      'position-1',
      { riskAck: true }
    );

    expect(result).toEqual({
      status: 'ignored',
      reason: 'no_open_position',
    });
    expect(mocks.prisma.position.updateMany).not.toHaveBeenCalled();
    expect(mocks.orchestrateRuntimeSignal).not.toHaveBeenCalled();
  });

  it('uses resolved lifecycle mark price for manual close orchestration', async () => {
    mocks.prisma.position.findFirst.mockResolvedValue({
      id: 'position-1',
      botId: 'bot-1',
      walletId: 'wallet-live-1',
      strategyId: 'strategy-1',
      symbol: 'BTCUSDT',
      quantity: 0.5,
      entryPrice: 50_000,
      origin: 'BOT',
      externalId: null,
      continuityState: 'CONFIRMED',
    });
    mocks.orchestrateRuntimeSignal.mockResolvedValue({
      status: 'closed',
      orderId: 'order-1',
      positionId: 'position-1',
    });

    const result = await closeBotRuntimeSessionPosition(
      'user-1',
      'bot-1',
      'session-1',
      'position-1',
      { riskAck: true }
    );

    expect(mocks.resolveRuntimeLifecycleMarkPrice).toHaveBeenCalledWith({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      symbol: 'BTCUSDT',
    });
    expect(mocks.orchestrateRuntimeSignal).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: 'BTCUSDT',
        direction: 'EXIT',
        quantity: 0.5,
        markPrice: 50_100,
      })
    );
    expect(result).toEqual({
      status: 'closed',
      orderId: 'order-1',
      positionId: 'position-1',
    });
  });

  it('falls back to entry price for LIVE manual close when runtime lifecycle price is unavailable', async () => {
    mocks.prisma.position.findFirst.mockResolvedValue({
      id: 'position-1',
      botId: 'bot-1',
      walletId: 'wallet-live-1',
      strategyId: 'strategy-1',
      symbol: 'BTCUSDT',
      quantity: 0.5,
      entryPrice: 50_000,
      origin: 'BOT',
      externalId: null,
      continuityState: 'CONFIRMED',
    });
    mocks.resolveRuntimeLifecycleMarkPrice.mockReturnValue(null);
    mocks.orchestrateRuntimeSignal.mockResolvedValue({
      status: 'submitted',
      orderId: 'order-close-pending-1',
    });

    const result = await closeBotRuntimeSessionPosition('user-1', 'bot-1', 'session-1', 'position-1', {
      riskAck: true,
    });

    expect(mocks.orchestrateRuntimeSignal).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: 'BTCUSDT',
        direction: 'EXIT',
        markPrice: 50_000,
      })
    );
    expect(result).toEqual({
      status: 'submitted',
      orderId: 'order-close-pending-1',
    });
  });

  it('fails closed in PAPER when no canonical close price is available', async () => {
    mocks.prisma.bot.findFirst.mockResolvedValue({
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      walletId: 'wallet-paper-1',
      wallet: {
        apiKeyId: null,
      },
    });
    mocks.prisma.position.findFirst.mockResolvedValue({
      id: 'position-1',
      botId: 'bot-1',
      walletId: 'wallet-paper-1',
      strategyId: 'strategy-1',
      symbol: 'BTCUSDT',
      quantity: 0.5,
      entryPrice: 50_000,
      origin: 'BOT',
      externalId: null,
      continuityState: 'CONFIRMED',
    });
    mocks.resolveRuntimeLifecycleMarkPrice.mockReturnValue(null);

    await expect(
      closeBotRuntimeSessionPosition('user-1', 'bot-1', 'session-1', 'position-1', {
        riskAck: true,
      })
    ).rejects.toMatchObject({
      code: 'POSITION_CLOSE_PRICE_UNAVAILABLE',
    });
    expect(mocks.orchestrateRuntimeSignal).not.toHaveBeenCalled();
  });

  it('uses fallback ticker price for PAPER manual close when runtime lifecycle price is unavailable', async () => {
    mocks.prisma.bot.findFirst.mockResolvedValue({
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      walletId: 'wallet-paper-1',
      wallet: {
        apiKeyId: null,
      },
    });
    mocks.prisma.position.findFirst.mockResolvedValue({
      id: 'position-1',
      botId: 'bot-1',
      walletId: 'wallet-paper-1',
      strategyId: 'strategy-1',
      symbol: 'BTCUSDT',
      quantity: 0.5,
      entryPrice: 50_000,
      origin: 'BOT',
      externalId: null,
      continuityState: 'CONFIRMED',
    });
    mocks.resolveRuntimeLifecycleMarkPrice.mockReturnValue(null);
    mocks.fetchFallbackTickerPrices.mockResolvedValue(new Map([['BTCUSDT', 50_250]]));
    mocks.orchestrateRuntimeSignal.mockResolvedValue({
      status: 'closed',
      orderId: 'order-1',
      positionId: 'position-1',
    });

    const result = await closeBotRuntimeSessionPosition('user-1', 'bot-1', 'session-1', 'position-1', {
      riskAck: true,
    });

    expect(mocks.fetchFallbackTickerPrices).toHaveBeenCalledWith({
      marketType: 'FUTURES',
      symbols: ['BTCUSDT'],
    });
    expect(mocks.orchestrateRuntimeSignal).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: 'BTCUSDT',
        direction: 'EXIT',
        markPrice: 50_250,
      })
    );
    expect(result).toEqual({
      status: 'closed',
      orderId: 'order-1',
      positionId: 'position-1',
    });
  });

  it('uses public connector mark price for PAPER manual close when ticker fallback is unavailable', async () => {
    const fetchMarkPrice = vi.fn(async () => 50_275);
    const disconnect = vi.fn(async () => undefined);
    mocks.prisma.bot.findFirst.mockResolvedValue({
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      walletId: 'wallet-paper-1',
      wallet: {
        apiKeyId: null,
      },
    });
    mocks.prisma.position.findFirst.mockResolvedValue({
      id: 'position-1',
      botId: 'bot-1',
      walletId: 'wallet-paper-1',
      strategyId: 'strategy-1',
      symbol: 'BTCUSDT',
      quantity: 0.5,
      entryPrice: 50_000,
      origin: 'BOT',
      externalId: null,
      continuityState: 'CONFIRMED',
    });
    mocks.resolveRuntimeLifecycleMarkPrice.mockReturnValue(null);
    mocks.fetchFallbackTickerPrices.mockResolvedValue(new Map());
    mocks.createPublicExchangeConnector.mockReturnValue({
      fetchMarkPrice,
      disconnect,
    });
    mocks.orchestrateRuntimeSignal.mockResolvedValue({
      status: 'closed',
      orderId: 'order-1',
      positionId: 'position-1',
    });

    const result = await closeBotRuntimeSessionPosition('user-1', 'bot-1', 'session-1', 'position-1', {
      riskAck: true,
    });

    expect(mocks.createPublicExchangeConnector).toHaveBeenCalledWith({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
    });
    expect(fetchMarkPrice).toHaveBeenCalledWith('BTCUSDT');
    expect(disconnect).toHaveBeenCalled();
    expect(mocks.orchestrateRuntimeSignal).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: 'BTCUSDT',
        direction: 'EXIT',
        markPrice: 50_275,
      })
    );
    expect(result).toEqual({
      status: 'closed',
      orderId: 'order-1',
      positionId: 'position-1',
    });
  });

  it('claims exact imported ownership when api key and symbol resolve to the selected live bot', async () => {
    mocks.prisma.position.findFirst.mockResolvedValue({
      id: 'position-1',
      botId: null,
      walletId: null,
      strategyId: 'strategy-1',
      symbol: 'DOGEUSDT',
      quantity: 54,
      entryPrice: 0.09791,
      origin: 'EXCHANGE_SYNC',
      externalId: 'key-live-1:DOGEUSDT:SHORT',
      continuityState: 'CONFIRMED',
    });
    mocks.resolveExternalPositionOwnershipIndex.mockResolvedValue(
      new Map([
        [
          'key-live-1:DOGEUSDT',
          {
            status: 'OWNED',
            botId: 'bot-1',
            walletId: 'wallet-live-1',
          },
        ],
      ])
    );
    mocks.prisma.position.updateMany.mockResolvedValue({ count: 1 });
    mocks.orchestrateRuntimeSignal.mockResolvedValue({
      status: 'closed',
      orderId: 'order-1',
      positionId: 'position-1',
    });

    const result = await closeBotRuntimeSessionPosition(
      'user-1',
      'bot-1',
      'session-1',
      'position-1',
      { riskAck: true }
    );

    expect(mocks.prisma.position.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'position-1',
        userId: 'user-1',
        status: 'OPEN',
        managementMode: 'BOT_MANAGED',
      },
      data: {
        syncState: 'IN_SYNC',
        botId: 'bot-1',
        walletId: 'wallet-live-1',
      },
    });
    expect(result).toEqual({
      status: 'closed',
      orderId: 'order-1',
      positionId: 'position-1',
    });
  });
});
