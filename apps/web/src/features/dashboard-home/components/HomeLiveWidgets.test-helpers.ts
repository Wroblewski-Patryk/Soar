type RuntimeSessionsMock = (botId: string, query: { limit: number }) => Promise<any[]>;
type RuntimePayloadMock = (
  botId: string,
  sessionId: string,
  query: { limit: number }
) => Promise<any>;

export const buildMonitoringAggregateFromSessionMocks = ({
  listBotRuntimeSessionsMock,
  listBotRuntimeSessionSymbolStatsMock,
  listBotRuntimeSessionPositionsMock,
  listBotRuntimeSessionTradesMock,
}: {
  listBotRuntimeSessionsMock: RuntimeSessionsMock;
  listBotRuntimeSessionSymbolStatsMock: RuntimePayloadMock;
  listBotRuntimeSessionPositionsMock: RuntimePayloadMock;
  listBotRuntimeSessionTradesMock: RuntimePayloadMock;
}) => {
  return async (botId: string) => {
    const sessions = await listBotRuntimeSessionsMock(botId, { limit: 20 });
    const primary = sessions[0];
    if (!primary) {
      throw new Error("aggregate unavailable");
    }
    const [symbolStats, positions, trades] = await Promise.all([
      listBotRuntimeSessionSymbolStatsMock(botId, primary.id, { limit: 200 }),
      listBotRuntimeSessionPositionsMock(botId, primary.id, { limit: 200 }),
      listBotRuntimeSessionTradesMock(botId, primary.id, { limit: 200 }),
    ]);
    return {
      sessionDetail: {
        id: primary.id,
        botId,
        mode: primary.mode,
        status: primary.status,
        startedAt: primary.startedAt,
        finishedAt: primary.finishedAt,
        lastHeartbeatAt: primary.lastHeartbeatAt,
        stopReason: primary.stopReason,
        errorMessage: primary.errorMessage,
        metadata: { aggregate: true, sessionsCount: sessions.length },
        createdAt: primary.createdAt,
        updatedAt: primary.updatedAt,
        durationMs: primary.durationMs,
        eventsCount: primary.eventsCount,
        symbolsTracked: primary.symbolsTracked,
        summary: {
          totalSignals: primary.summary.totalSignals,
          longEntries: symbolStats.summary.longEntries,
          shortEntries: symbolStats.summary.shortEntries,
          exits: symbolStats.summary.exits,
          dcaCount: primary.summary.dcaCount,
          closedTrades: primary.summary.closedTrades,
          winningTrades: symbolStats.summary.winningTrades,
          losingTrades: symbolStats.summary.losingTrades,
          realizedPnl: primary.summary.realizedPnl,
          grossProfit: symbolStats.summary.grossProfit,
          grossLoss: symbolStats.summary.grossLoss,
          feesPaid: symbolStats.summary.feesPaid,
          openPositionCount: positions.openCount,
          openPositionQty: positions.openItems.reduce(
            (sum: number, item: { quantity: number }) => sum + item.quantity,
            0
          ),
        },
      },
      symbolStats,
      positions,
      trades,
    };
  };
};
