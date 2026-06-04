import { describe, expect, it } from 'vitest';
import {
  AssistantDryRunSchema,
  UpsertBotAssistantConfigSchema,
  UpsertBotSubagentConfigSchema,
} from './bots.types';

describe('AssistantDryRunSchema', () => {
  it('accepts only advisory dry-run modes and rejects LIVE', () => {
    expect(AssistantDryRunSchema.parse({ symbol: 'BTCUSDT', mode: 'BACKTEST' }).mode).toBe('BACKTEST');
    expect(AssistantDryRunSchema.parse({ symbol: 'BTCUSDT', mode: 'PAPER' }).mode).toBe('PAPER');
    expect(AssistantDryRunSchema.parse({ symbol: 'BTCUSDT' }).mode).toBe('PAPER');

    expect(() => AssistantDryRunSchema.parse({ symbol: 'BTCUSDT', mode: 'LIVE' })).toThrow();
  });
});

describe('assistant config schemas', () => {
  it('allowlists model profiles and canonical subagent roles', () => {
    expect(UpsertBotAssistantConfigSchema.parse({ mainAgentEnabled: true }).modelProfile).toBe('balanced');
    expect(UpsertBotAssistantConfigSchema.parse({
      mainAgentEnabled: true,
      modelProfile: 'balanced',
    }).modelProfile).toBe('balanced');

    expect(UpsertBotSubagentConfigSchema.parse({
      role: 'TREND',
      enabled: true,
      modelProfile: 'balanced',
    }).role).toBe('TREND');
    expect(UpsertBotSubagentConfigSchema.parse({
      role: 'MICROSTRUCTURE',
      enabled: true,
    }).modelProfile).toBe('balanced');

    expect(() => UpsertBotAssistantConfigSchema.parse({
      mainAgentEnabled: true,
      modelProfile: 'experimental-model',
    })).toThrow();
    expect(() => UpsertBotSubagentConfigSchema.parse({
      role: 'PROMPT_INJECTED_ADMIN',
      enabled: true,
      modelProfile: 'balanced',
    })).toThrow();
    expect(() => UpsertBotSubagentConfigSchema.parse({
      role: 'RISK',
      enabled: true,
      modelProfile: 'unapproved',
    })).toThrow();
  });
});
