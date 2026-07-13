import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getOwnedBot: vi.fn(),
  listRuntimeSessionsWithSummary: vi.fn(),
}));

vi.mock('./botOwnership.service', () => ({
  getOwnedBot: mocks.getOwnedBot,
  getOwnedBotRuntimeSession: vi.fn(),
  resolveSessionWindowEnd: vi.fn(),
}));

vi.mock('./runtimeSessionsRead.service', () => ({
  getRuntimeSessionSummaryMetrics: vi.fn(),
  listRuntimeSessionsWithSummary: mocks.listRuntimeSessionsWithSummary,
}));

import { listBotRuntimeSessions } from './runtimeSessionRead.service';

describe('listBotRuntimeSessions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getOwnedBot.mockResolvedValue({ id: 'bot-1' });
    mocks.listRuntimeSessionsWithSummary.mockResolvedValue([
      {
        id: 'session-1',
        botId: 'bot-1',
        status: 'RUNNING',
      },
    ]);
  });

  it('fails closed when the selected user does not own the bot', async () => {
    mocks.getOwnedBot.mockResolvedValue(null);

    const result = await listBotRuntimeSessions('user-1', 'bot-1', {
      limit: 5,
    });

    expect(result).toBeNull();
    expect(mocks.listRuntimeSessionsWithSummary).not.toHaveBeenCalled();
  });

  it('lists runtime sessions through the owned-bot gate and forwards status and limit', async () => {
    const result = await listBotRuntimeSessions('user-1', 'bot-1', {
      status: 'RUNNING',
      limit: 5,
    });

    expect(mocks.getOwnedBot).toHaveBeenCalledWith('user-1', 'bot-1');
    expect(mocks.listRuntimeSessionsWithSummary).toHaveBeenCalledWith({
      userId: 'user-1',
      botId: 'bot-1',
      status: 'RUNNING',
      limit: 5,
    });
    expect(result).toEqual([
      {
        id: 'session-1',
        botId: 'bot-1',
        status: 'RUNNING',
      },
    ]);
  });
});
