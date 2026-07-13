import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  resolveRuntimeCapitalSnapshot: vi.fn(),
  resolveBotAdvancedCloseMode: vi.fn(),
  getOwnedBotRuntimeSession: vi.fn(),
  resolveSessionWindowEnd: vi.fn(),
  listOwnedExternalSymbolsForBot: vi.fn(),
  resolveExternalPositionOwnershipIndex: vi.fn(),
  getRuntimePositionBotContext: vi.fn(),
  listRuntimeManagedPositions: vi.fn(),
  countRuntimeManagedPositions: vi.fn(),
  sumRuntimeManagedPositionMarginUsed: vi.fn(),
  sumRuntimeManagedPositionQuantity: vi.fn(),
  sumRuntimeManagedPositionUnrealizedPnl: vi.fn(),
  sumRuntimeManagedPositionRealizedPnl: vi.fn(),
  sumRuntimeManagedPositionTradeFees: vi.fn(),
  listRuntimeOpenOrders: vi.fn(),
  resolveCanonicalRuntimeVenueContext: vi.fn(),
  resolveInheritedRuntimeExecutionContext: vi.fn(),
  selectRuntimeOpenOrders: vi.fn(),
}));

vi.mock('../engine/runtimeCapitalContext.service', () => ({
  resolveRuntimeCapitalSnapshot: mocks.resolveRuntimeCapitalSnapshot,
}));

vi.mock('./runtimeStrategyDisplayBySymbol.service', () => ({
  resolveBotAdvancedCloseMode: mocks.resolveBotAdvancedCloseMode,
  resolveBotDcaPlanBySymbol: vi.fn(),
  resolveBotTrailingStopLevelsBySymbol: vi.fn(),
  resolveBotTrailingTakeProfitLevelsBySymbol: vi.fn(),
}));

vi.mock('./botOwnership.service', () => ({
  getOwnedBotRuntimeSession: mocks.getOwnedBotRuntimeSession,
  resolveSessionWindowEnd: mocks.resolveSessionWindowEnd,
}));

vi.mock('./runtimeExternalPositionOwner.service', () => ({
  listOwnedExternalSymbolsForBot: mocks.listOwnedExternalSymbolsForBot,
  resolveExternalPositionOwnershipIndex: mocks.resolveExternalPositionOwnershipIndex,
}));

vi.mock('./runtimeSessionPositionsRead.repository', () => ({
  countRuntimeManagedPositions: mocks.countRuntimeManagedPositions,
  getRuntimePositionBotContext: mocks.getRuntimePositionBotContext,
  listRuntimeManagedPositions: mocks.listRuntimeManagedPositions,
  listRuntimeOpenOrders: mocks.listRuntimeOpenOrders,
  listRuntimePositionLastPrices: vi.fn(),
  listRuntimePositionStrategies: vi.fn(),
  listRuntimePositionTradeRows: vi.fn(),
  sumRuntimeManagedPositionMarginUsed: mocks.sumRuntimeManagedPositionMarginUsed,
  sumRuntimeManagedPositionQuantity: mocks.sumRuntimeManagedPositionQuantity,
  sumRuntimeManagedPositionRealizedPnl: mocks.sumRuntimeManagedPositionRealizedPnl,
  sumRuntimeManagedPositionTradeFees: mocks.sumRuntimeManagedPositionTradeFees,
  sumRuntimeManagedPositionUnrealizedPnl: mocks.sumRuntimeManagedPositionUnrealizedPnl,
}));

vi.mock('../engine/runtimeBotExecutionContext', () => ({
  resolveCanonicalRuntimeVenueContext: mocks.resolveCanonicalRuntimeVenueContext,
  resolveInheritedRuntimeExecutionContext: mocks.resolveInheritedRuntimeExecutionContext,
}));

vi.mock('./runtimeSessionOpenOrdersReadModel.service', () => ({
  RUNTIME_OPEN_ORDER_DEDUPE_CANDIDATE_LIMIT: 200,
  resolveRuntimeTakeoverStatus: vi.fn(),
  selectRuntimeOpenOrders: mocks.selectRuntimeOpenOrders,
}));

import { listBotRuntimeSessionPositions } from './runtimeSessionPositionsRead.service';

describe('listBotRuntimeSessionPositions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getOwnedBotRuntimeSession.mockResolvedValue({
      id: 'session-1',
      startedAt: new Date('2026-07-13T09:00:00.000Z'),
      lastHeartbeatAt: new Date('2026-07-13T09:05:00.000Z'),
      status: 'RUNNING',
    });
    mocks.resolveSessionWindowEnd.mockReturnValue(new Date('2026-07-13T09:10:00.000Z'));
    mocks.resolveBotAdvancedCloseMode.mockResolvedValue(false);
    mocks.getRuntimePositionBotContext.mockResolvedValue({
      walletId: null,
      wallet: null,
      apiKeyId: null,
      botMarketGroups: [],
      symbolGroup: null,
      createdAt: new Date('2026-07-13T08:45:00.000Z'),
      exchange: 'BINANCE',
      marketType: 'FUTURES',
    });
    mocks.resolveCanonicalRuntimeVenueContext.mockReturnValue({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
    });
    mocks.resolveInheritedRuntimeExecutionContext.mockReturnValue({
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      paperStartBalance: 1_000,
    });
    mocks.resolveExternalPositionOwnershipIndex.mockResolvedValue(new Map());
    mocks.listOwnedExternalSymbolsForBot.mockReturnValue([]);
    mocks.listRuntimeManagedPositions.mockResolvedValue([]);
    mocks.countRuntimeManagedPositions.mockResolvedValue(0);
    mocks.sumRuntimeManagedPositionMarginUsed.mockResolvedValue({ _sum: { marginUsed: null } });
    mocks.sumRuntimeManagedPositionQuantity.mockResolvedValue({ _sum: { quantity: null } });
    mocks.sumRuntimeManagedPositionUnrealizedPnl.mockResolvedValue({ _sum: { unrealizedPnl: null } });
    mocks.sumRuntimeManagedPositionRealizedPnl.mockResolvedValue({ _sum: { realizedPnl: null } });
    mocks.sumRuntimeManagedPositionTradeFees.mockResolvedValue({ _sum: { fee: null } });
    mocks.listRuntimeOpenOrders.mockResolvedValue([]);
    mocks.selectRuntimeOpenOrders.mockReturnValue({
      count: 0,
      items: [],
    });
    mocks.resolveRuntimeCapitalSnapshot.mockResolvedValue({
      referenceBalance: 1_000,
      accountBalance: 1_000,
      baseCurrency: 'USDT',
      capitalSource: 'PAPER_BALANCE',
      allocationMode: 'BALANCE',
      allocationValue: null,
      paperResetAt: null,
    });
  });

  it('fails closed when the runtime session is not owned by the selected user and bot', async () => {
    mocks.getOwnedBotRuntimeSession.mockResolvedValue(null);

    const result = await listBotRuntimeSessionPositions('user-1', 'bot-1', 'session-1', {
      limit: 10,
    });

    expect(result).toBeNull();
    expect(mocks.getRuntimePositionBotContext).not.toHaveBeenCalled();
    expect(mocks.listRuntimeManagedPositions).not.toHaveBeenCalled();
    expect(mocks.listRuntimeOpenOrders).not.toHaveBeenCalled();
  });

  it('keeps position and open-order reads scoped to BOT_MANAGED records for an owned session', async () => {
    const result = await listBotRuntimeSessionPositions('user-1', 'bot-1', 'session-1', {
      limit: 10,
    });

    expect(mocks.listRuntimeManagedPositions).toHaveBeenCalledTimes(2);
    expect(mocks.listRuntimeManagedPositions).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: expect.objectContaining({
          managementMode: 'BOT_MANAGED',
          status: 'OPEN',
        }),
        limit: 10,
      }),
    );
    expect(mocks.listRuntimeManagedPositions).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: expect.objectContaining({
          managementMode: 'BOT_MANAGED',
          status: 'CLOSED',
        }),
        limit: 10,
      }),
    );
    expect(mocks.listRuntimeOpenOrders).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          managementMode: 'BOT_MANAGED',
        }),
        limit: 200,
      }),
    );
    expect(result).toEqual({
      sessionId: 'session-1',
      total: 0,
      openCount: 0,
      closedCount: 0,
      openOrdersCount: 0,
      showDynamicStopColumns: false,
      window: {
        startedAt: new Date('2026-07-13T09:00:00.000Z'),
        finishedAt: new Date('2026-07-13T09:10:00.000Z'),
      },
      summary: {
        realizedPnl: 0,
        unrealizedPnl: 0,
        feesPaid: 0,
        openPositionQty: 0,
        referenceBalance: 1_000,
        freeCash: 1_000,
        accountBalance: 1_000,
        baseCurrency: 'USDT',
        capitalSource: 'PAPER_BALANCE',
        allocationMode: 'BALANCE',
        allocationValue: null,
        paperResetAt: null,
      },
      openOrders: [],
      openItems: [],
      historyItems: [],
    });
  });
});
