import { prisma } from '../../prisma/client';
import { resolveExistingCanonicalUpdateScope } from '../bots/botCanonicalUpdateScope.service';
import { CanonicalBotContinuityContext } from './livePositionReconciliation.types';

export const resolveCanonicalBotContinuityContext = async (
  botId: string
): Promise<CanonicalBotContinuityContext | null> => {
  const bot = await prisma.bot.findUnique({
    where: { id: botId },
    select: {
      id: true,
      walletId: true,
      strategyId: true,
      symbolGroupId: true,
      botMarketGroups: {
        select: {
          symbolGroupId: true,
          lifecycleStatus: true,
          executionOrder: true,
          isEnabled: true,
          createdAt: true,
          strategyLinks: {
            select: {
              strategyId: true,
              isEnabled: true,
              priority: true,
              createdAt: true,
            },
            orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
          },
        },
        orderBy: [{ executionOrder: 'asc' }, { createdAt: 'asc' }],
      },
    },
  });
  if (!bot) return null;

  const canonicalScope = resolveExistingCanonicalUpdateScope(bot);
  return {
    botId: bot.id,
    walletId: bot.walletId,
    strategyId: canonicalScope.primaryStrategyId,
  };
};
