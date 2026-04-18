import { ListBotRuntimeSessionsQueryDto } from './bots.types';
import { getRuntimeSessionSummaryMetrics, listRuntimeSessionsWithSummary } from './runtimeSessionsRead.service';
import { getOwnedBot, getOwnedBotRuntimeSession, resolveSessionWindowEnd } from './botOwnership.service';

export const listBotRuntimeSessions = async (
  userId: string,
  botId: string,
  query: ListBotRuntimeSessionsQueryDto
) => {
  const bot = await getOwnedBot(userId, botId);
  if (!bot) return null;
  return listRuntimeSessionsWithSummary({
    userId,
    botId,
    status: query.status,
    limit: query.limit,
  });
};

export const getBotRuntimeSession = async (userId: string, botId: string, sessionId: string) => {
  const session = await getOwnedBotRuntimeSession(userId, botId, sessionId);
  if (!session) return null;
  const runtimeSessionMetrics = await getRuntimeSessionSummaryMetrics(session.id);

  const windowEnd = resolveSessionWindowEnd(session);
  const durationMs = Math.max(0, windowEnd.getTime() - session.startedAt.getTime());

  return {
    id: session.id,
    botId: session.botId,
    mode: session.mode,
    status: session.status,
    startedAt: session.startedAt,
    finishedAt: session.finishedAt,
    lastHeartbeatAt: session.lastHeartbeatAt,
    stopReason: session.stopReason,
    errorMessage: session.errorMessage,
    metadata: session.metadata,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    durationMs,
    eventsCount: runtimeSessionMetrics.eventsCount,
    symbolsTracked: runtimeSessionMetrics.symbolsTracked,
    summary: runtimeSessionMetrics.summary,
  };
};
