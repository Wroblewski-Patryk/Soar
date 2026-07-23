import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getOwnedBotRuntimeSession: vi.fn(),
  resolveSessionWindowEnd: vi.fn(),
  resolveEffectiveSymbolGroupSymbolsWithCatalog: vi.fn(),
  listOwnedExternalSymbolsForBot: vi.fn(),
  resolveExternalPositionOwnershipIndex: vi.fn(),
  buildCloseReasonLookup: vi.fn(),
  getRuntimeTradeBotContext: vi.fn(),
  listRuntimeTradeCarryOverPositionIds: vi.fn(),
  countRuntimeTradeRows: vi.fn(),
  sumRuntimeTradeFees: vi.fn(),
  listRuntimeTradeRows: vi.fn(),
  listRuntimeTradeCloseEventRows: vi.fn(),
  listRuntimeTradePositionMetaRows: vi.fn(),
  listRuntimeTradeAnchorPositionRows: vi.fn(),
  listRuntimeTradePositionTradeRows: vi.fn(),
}));

vi.mock('./botOwnership.service', () => ({
  getOwnedBotRuntimeSession: mocks.getOwnedBotRuntimeSession,
  resolveSessionWindowEnd: mocks.resolveSessionWindowEnd,
}));

vi.mock('./runtimeSymbolCatalogResolver.service', () => ({
  resolveEffectiveSymbolGroupSymbolsWithCatalog:
    mocks.resolveEffectiveSymbolGroupSymbolsWithCatalog,
}));

vi.mock('./runtimeExternalPositionOwner.service', () => ({
  listOwnedExternalSymbolsForBot: mocks.listOwnedExternalSymbolsForBot,
  resolveExternalPositionOwnershipIndex: mocks.resolveExternalPositionOwnershipIndex,
}));

vi.mock('./runtimeTradeActionReason.service', () => ({
  buildCloseReasonLookup: mocks.buildCloseReasonLookup,
  normalizeCloseReason: vi.fn(),
}));

vi.mock('./runtimeTradeLifecycle.service', () => ({
  buildLifecycleActionByTradeId: vi.fn(() => new Map()),
  toPositionMetaById: vi.fn(() => new Map()),
}));

vi.mock('./runtimeSessionTradesRead.repository', () => ({
  getRuntimeTradeBotContext: mocks.getRuntimeTradeBotContext,
  listRuntimeTradeCarryOverPositionIds: mocks.listRuntimeTradeCarryOverPositionIds,
  countRuntimeTradeRows: mocks.countRuntimeTradeRows,
  sumRuntimeTradeFees: mocks.sumRuntimeTradeFees,
  listRuntimeTradeRows: mocks.listRuntimeTradeRows,
  listRuntimeTradeCloseEventRows: mocks.listRuntimeTradeCloseEventRows,
  listRuntimeTradePositionMetaRows: mocks.listRuntimeTradePositionMetaRows,
  listRuntimeTradeAnchorPositionRows: mocks.listRuntimeTradeAnchorPositionRows,
  listRuntimeTradePositionTradeRows: mocks.listRuntimeTradePositionTradeRows,
}));

import { listBotRuntimeSessionTrades } from './runtimeSessionTradesRead.service';

describe('listBotRuntimeSessionTrades', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getOwnedBotRuntimeSession.mockResolvedValue({
      id: 'session-1',
      startedAt: new Date('2026-07-13T09:00:00.000Z'),
      lastHeartbeatAt: new Date('2026-07-13T09:05:00.000Z'),
      status: 'RUNNING',
    });
    mocks.resolveSessionWindowEnd.mockReturnValue(new Date('2026-07-13T09:10:00.000Z'));
    mocks.getRuntimeTradeBotContext.mockResolvedValue({
      apiKeyId: null,
      strategyId: null,
      mode: 'PAPER',
      walletId: null,
      wallet: null,
      botMarketGroups: [
        {
          strategyLinks: [],
          symbolGroup: { symbols: ['BTCUSDT', 'ETHUSDT'], marketUniverse: null },
        },
      ],
      symbolGroup: null,
    });
    mocks.resolveEffectiveSymbolGroupSymbolsWithCatalog.mockResolvedValue([
      'BTCUSDT',
      'ETHUSDT',
    ]);
    mocks.resolveExternalPositionOwnershipIndex.mockResolvedValue(new Map());
    mocks.listOwnedExternalSymbolsForBot.mockReturnValue([]);
    mocks.listRuntimeTradeCarryOverPositionIds.mockResolvedValue([]);
    mocks.countRuntimeTradeRows.mockResolvedValue(0);
    mocks.sumRuntimeTradeFees.mockResolvedValue({ _sum: { fee: null } });
    mocks.listRuntimeTradeRows.mockResolvedValue([]);
    mocks.listRuntimeTradeCloseEventRows.mockResolvedValue([]);
    mocks.buildCloseReasonLookup.mockReturnValue({
      closeReasonByOrderId: new Map(),
      closeReasonByPositionId: new Map(),
    });
    mocks.listRuntimeTradePositionMetaRows.mockResolvedValue([]);
    mocks.listRuntimeTradeAnchorPositionRows.mockResolvedValue([]);
    mocks.listRuntimeTradePositionTradeRows.mockResolvedValue([]);
  });

  it('fails closed when the runtime session is not owned by the selected user and bot', async () => {
    mocks.getOwnedBotRuntimeSession.mockResolvedValue(null);

    const result = await listBotRuntimeSessionTrades('user-1', 'bot-1', 'session-1', {
      limit: 10,
    });

    expect(result).toBeNull();
    expect(mocks.getRuntimeTradeBotContext).not.toHaveBeenCalled();
    expect(mocks.listRuntimeTradeRows).not.toHaveBeenCalled();
  });

  it('keeps trade reads scoped to the owned session and selected canonical symbol filters', async () => {
    const result = await listBotRuntimeSessionTrades('user-1', 'bot-1', 'session-1', {
      limit: 5,
      symbol: 'btcusdt',
      side: 'BUY',
      action: 'OPEN',
      page: 1,
      pageSize: 5,
    });

    expect(mocks.getRuntimeTradeBotContext).toHaveBeenCalledWith('user-1', 'bot-1');
    expect(mocks.listRuntimeTradeCarryOverPositionIds).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        managementMode: 'BOT_MANAGED',
        symbol: { in: ['BTCUSDT'] },
        openedAt: { lte: new Date('2026-07-13T09:10:00.000Z') },
      }),
      2000,
    );
    expect(mocks.countRuntimeTradeRows).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        symbol: { in: ['BTCUSDT'] },
        side: 'BUY',
        lifecycleAction: 'OPEN',
      }),
    );
    expect(mocks.listRuntimeTradeRows).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'user-1',
          symbol: { in: ['BTCUSDT'] },
          side: 'BUY',
          lifecycleAction: 'OPEN',
        }),
        take: 5,
        skip: 0,
      }),
    );
    expect(result).toEqual({
      sessionId: 'session-1',
      total: 0,
      feesPaid: 0,
      meta: {
        page: 1,
        pageSize: 5,
        total: 0,
        totalPages: 0,
        hasPrev: false,
        hasNext: false,
      },
      window: {
        startedAt: new Date('2026-07-13T09:00:00.000Z'),
        finishedAt: new Date('2026-07-13T09:10:00.000Z'),
      },
      items: [],
    });
  });
});
