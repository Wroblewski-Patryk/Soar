import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runAssistantDryRun } from './botAssistant.service';

const mocks = vi.hoisted(() => ({
  getOwnedBot: vi.fn(),
  findAssistantConfig: vi.fn(),
  findSubagents: vi.fn(),
  orchestrateAssistantDecision: vi.fn(),
}));

vi.mock('../../prisma/client', () => ({
  prisma: {
    botAssistantConfig: {
      findUnique: mocks.findAssistantConfig,
    },
    botSubagentConfig: {
      findMany: mocks.findSubagents,
    },
  },
}));

vi.mock('./botOwnership.service', () => ({
  getOwnedBot: mocks.getOwnedBot,
}));

vi.mock('../engine/assistantOrchestrator.service', () => ({
  orchestrateAssistantDecision: mocks.orchestrateAssistantDecision,
}));

describe('runAssistantDryRun', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getOwnedBot.mockResolvedValue({ id: 'bot-1' });
    mocks.findAssistantConfig.mockResolvedValue({
      mainAgentEnabled: true,
      mandate: null,
      safetyMode: 'STRICT',
    });
    mocks.findSubagents.mockResolvedValue([
      { slotIndex: 1, role: 'TREND', enabled: true, timeoutMs: 800 },
    ]);
    mocks.orchestrateAssistantDecision.mockResolvedValue({
      mode: 'assistant',
      finalDecision: 'NO_TRADE',
      finalReason: 'test',
    });
  });

  it('suppresses enabled subagent slots when main assistant is disabled', async () => {
    mocks.findAssistantConfig.mockResolvedValue({
      mainAgentEnabled: false,
      mandate: 'ignored when disabled',
      safetyMode: 'STRICT',
    });

    await runAssistantDryRun('user-1', 'bot-1', {
      symbol: 'btcusdt',
      intervalWindow: '5m',
      mode: 'PAPER',
    });

    expect(mocks.orchestrateAssistantDecision).toHaveBeenCalledWith(expect.objectContaining({
      mode: 'PAPER',
      symbol: 'BTCUSDT',
      subagents: [],
    }));
  });

  it('passes enabled subagent slots only when main assistant is enabled', async () => {
    await runAssistantDryRun('user-1', 'bot-1', {
      symbol: 'BTCUSDT',
      intervalWindow: '5m',
      mode: 'PAPER',
    });

    expect(mocks.orchestrateAssistantDecision).toHaveBeenCalledWith(expect.objectContaining({
      subagents: [
        { slotIndex: 1, role: 'TREND', enabled: true, timeoutMs: 800 },
      ],
    }));
  });
});
