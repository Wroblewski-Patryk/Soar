import { describe, expect, it, vi } from 'vitest';

import { recordRuntimeAutomationSkipTelemetry } from './runtimePositionAutomationSkipTelemetry';

const baseEvent = {
  type: 'ticker' as const,
  exchange: 'BINANCE' as const,
  marketType: 'FUTURES' as const,
  symbol: 'BTCUSDT',
  eventTime: 1_700_000_000_000,
  lastPrice: 42_000,
  priceChangePercent24h: 1.5,
};

const basePosition = {
  id: 'position-1',
  userId: 'user-1',
  botId: 'bot-1',
  strategyId: 'strategy-position',
  symbol: 'BTCUSDT',
  side: 'LONG' as const,
  managementMode: 'BOT_MANAGED',
  origin: 'RUNTIME',
  continuityState: 'CONFIRMED',
  bot: {
    wallet: {
      mode: 'LIVE' as const,
    },
  },
};

describe('recordRuntimeAutomationSkipTelemetry', () => {
  it('records live skip telemetry with inherited mode and payload details', async () => {
    const recordRuntimeEvent = vi.fn(async () => undefined);

    await recordRuntimeAutomationSkipTelemetry({
      recordRuntimeEvent,
      event: baseEvent,
      position: {
        ...basePosition,
        side: 'SHORT',
        bot: {
          wallet: {
            mode: 'PAPER',
          },
        },
      },
      inheritedExecutionContext: { mode: 'LIVE' },
      reason: 'execution_context_unresolved',
      message: 'Runtime automation skipped',
      strategyId: 'strategy-explicit',
      extraPayload: {
        detail: 'owned-position',
      },
    });

    expect(recordRuntimeEvent).toHaveBeenCalledWith({
      userId: 'user-1',
      botId: 'bot-1',
      mode: 'LIVE',
      eventType: 'PRETRADE_BLOCKED',
      level: 'WARN',
      symbol: 'BTCUSDT',
      strategyId: 'strategy-explicit',
      signalDirection: 'SHORT',
      message: 'Runtime automation skipped',
      payload: {
        positionId: 'position-1',
        continuityState: 'CONFIRMED',
        origin: 'RUNTIME',
        managementMode: 'BOT_MANAGED',
        skipReason: 'execution_context_unresolved',
        detail: 'owned-position',
      },
      eventAt: new Date(baseEvent.eventTime),
    });
  });

  it('uses wallet live mode when inherited context is absent', async () => {
    const recordRuntimeEvent = vi.fn(async () => undefined);

    await recordRuntimeAutomationSkipTelemetry({
      recordRuntimeEvent,
      event: baseEvent,
      position: basePosition,
      reason: 'live_opt_in_disabled',
      message: 'Live automation disabled',
    });

    expect(recordRuntimeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'LIVE',
        strategyId: 'strategy-position',
        signalDirection: 'LONG',
        payload: expect.objectContaining({
          skipReason: 'live_opt_in_disabled',
        }),
      })
    );
  });

  it('treats exchange-synced positions without wallet context as live', async () => {
    const recordRuntimeEvent = vi.fn(async () => undefined);

    await recordRuntimeAutomationSkipTelemetry({
      recordRuntimeEvent,
      event: baseEvent,
      position: {
        ...basePosition,
        origin: 'EXCHANGE_SYNC',
        strategyId: null,
        bot: null,
      },
      reason: 'missing_exchange_sync_bot_ownership',
      message: 'Missing imported ownership',
    });

    expect(recordRuntimeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'LIVE',
        strategyId: undefined,
        payload: expect.objectContaining({
          origin: 'EXCHANGE_SYNC',
          skipReason: 'missing_exchange_sync_bot_ownership',
        }),
      })
    );
  });

  it('does not record paper or unowned skip telemetry', async () => {
    const recordRuntimeEvent = vi.fn(async () => undefined);

    await recordRuntimeAutomationSkipTelemetry({
      recordRuntimeEvent,
      event: baseEvent,
      position: {
        ...basePosition,
        bot: {
          wallet: {
            mode: 'PAPER',
          },
        },
      },
      reason: 'live_opt_in_disabled',
      message: 'Paper skip',
    });
    await recordRuntimeAutomationSkipTelemetry({
      recordRuntimeEvent,
      event: baseEvent,
      position: {
        ...basePosition,
        botId: null,
      },
      inheritedExecutionContext: { mode: 'LIVE' },
      reason: 'missing_bot_origin_ownership',
      message: 'Unowned skip',
    });

    expect(recordRuntimeEvent).not.toHaveBeenCalled();
  });
});
