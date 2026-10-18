import { PositionSide } from '@prisma/client';
import { prisma } from '../../prisma/client';

export const loadDurableDcaProgress = async (input: {
  userId: string;
  positionId: string;
  botId?: string | null;
  walletId?: string | null;
  strategyId?: string | null;
  symbol: string;
  positionSide: PositionSide;
  sizingBasis?: 'quantity_v1' | 'usdt_contribution_v1';
}) => {
  const entrySide = input.positionSide === 'LONG' ? 'BUY' : 'SELL';
  const scopedLifecycleWhere =
    input.botId || input.walletId || input.strategyId
      ? {
          AND: [
            {
              userId: input.userId,
              symbol: input.symbol,
              managementMode: 'BOT_MANAGED' as const,
            },
            ...(input.botId ? [{ botId: input.botId }] : []),
            ...(input.walletId ? [{ OR: [{ walletId: input.walletId }, { walletId: null }] }] : []),
            ...(input.strategyId ? [{ OR: [{ strategyId: input.strategyId }, { strategyId: null }] }] : []),
          ],
        }
      : null;
  const trades = await prisma.trade.findMany({
    where: {
      lifecycleAction: { in: ['OPEN', 'DCA', 'CLOSE'] },
      OR: [
        { positionId: input.positionId },
        ...(scopedLifecycleWhere ? [scopedLifecycleWhere] : []),
      ],
    },
    select: {
      id: true,
      lifecycleAction: true,
      price: true,
      orderId: true,
      side: true,
      executedAt: true,
    },
    orderBy: { executedAt: 'asc' },
  });
  const dedupedTrades = [...new Map(trades.map((trade) => [trade.id, trade])).values()]
    .sort((left, right) => left.executedAt.getTime() - right.executedAt.getTime());
  const latestCloseIndex = dedupedTrades.findLastIndex(
    (trade) => trade.side !== entrySide && trade.lifecycleAction === 'CLOSE'
  );
  const lifecycleTrades = latestCloseIndex >= 0
    ? dedupedTrades.slice(latestCloseIndex + 1)
    : dedupedTrades;
  const entryTrades = lifecycleTrades.filter(
    (trade) => trade.side === entrySide && (trade.lifecycleAction === 'OPEN' || trade.lifecycleAction === 'DCA')
  );
  const entryLegAdds = Math.max(0, entryTrades.length - 1);
  const dcaTrades = entryTrades.filter((trade) => trade.lifecycleAction === 'DCA');
  const explicitDcaAdds = dcaTrades.length;
  const lastDcaTrade = dcaTrades.at(-1);
  const dedupes = input.sizingBasis === 'usdt_contribution_v1'
    ? await prisma.runtimeExecutionDedupe.findMany({
        where: { userId: input.userId, positionId: input.positionId,
          commandType: 'DCA', status: 'SUCCEEDED' },
        select: { dedupeKey: true, orderId: true },
      }) : [];
  const executedDcaLevelIndices = dedupes
    .filter((dedupe) => dedupe.orderId && dcaTrades.some((trade) => trade.orderId === dedupe.orderId))
    .map((dedupe) => /\|level:(\d+)\|(?:LONG|SHORT)$/.exec(dedupe.dedupeKey))
    .filter((match): match is RegExpExecArray => match != null)
    .map((match) => Number(match[1]));
  return {
    currentAdds: input.sizingBasis === 'usdt_contribution_v1'
      ? explicitDcaAdds : Math.max(entryLegAdds, explicitDcaAdds),
    lastDcaPrice: lastDcaTrade?.price,
    executedDcaLevelIndices: input.sizingBasis === 'usdt_contribution_v1'
      && executedDcaLevelIndices.length === explicitDcaAdds
      ? executedDcaLevelIndices : undefined,
  };
};
