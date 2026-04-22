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
  getRuntimeTicker: vi.fn(),
  resolveExternalPositionOwnerBySymbol: vi.fn(),
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

vi.mock('../engine/runtimeTickerStore', () => ({
  getRuntimeTicker: mocks.getRuntimeTicker,
}));

vi.mock('./runtimeExternalPositionOwner.service', () => ({
  resolveExternalPositionOwnerBySymbol: mocks.resolveExternalPositionOwnerBySymbol,
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
    });
    mocks.getRuntimeTicker.mockReturnValue(null);
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
    });
    mocks.resolveExternalPositionOwnerBySymbol.mockResolvedValue(
      new Map([
        [
          'BTCUSDT',
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
});
