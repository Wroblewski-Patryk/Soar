type RuntimeDcaEntryLeg = {
  id: string;
  orderId: string | null;
  lifecycleAction: 'OPEN' | 'DCA' | 'CLOSE' | 'UNKNOWN' | null;
};

export const resolveRuntimePositionDcaCount = (input: {
  entryLegs: RuntimeDcaEntryLeg[];
  explicitDcaTradeCount: number;
  runtimeStateCurrentAdds: number | null;
}) => {
  const uniqueEntryUnits = new Set(
    input.entryLegs.map((trade) =>
      trade.orderId
        ? `order:${trade.orderId}:${trade.lifecycleAction}`
        : `trade:${trade.id}`
    )
  );
  const inferredFromEntryLegs = Math.max(0, uniqueEntryUnits.size - 1);
  const inferredFromTrades = Math.max(0, input.explicitDcaTradeCount);
  const inferredFromRuntimeState =
    typeof input.runtimeStateCurrentAdds === 'number' && Number.isFinite(input.runtimeStateCurrentAdds)
      ? Math.max(0, Math.trunc(input.runtimeStateCurrentAdds))
      : 0;
  return Math.max(inferredFromEntryLegs, inferredFromTrades, inferredFromRuntimeState);
};
