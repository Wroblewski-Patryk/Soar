import { describe, expect, it } from 'vitest';
import {
  OrderFlowGateway,
  PositionFlowGateway,
  RuntimeExecutionEventGateway,
  RuntimeExecutionDedupeGateway,
  RuntimeExecutionMode,
  RuntimeSignalDirection,
  RuntimeTradeGateway,
  orchestrateRuntimeSignal,
} from './executionOrchestrator.service';
import { decideExecutionAction } from './sharedExecutionCore';

type MemoryPosition = {
  id: string;
  userId: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  quantity: number;
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  status: 'OPEN' | 'CLOSED';
};

const createInMemoryGateways = (
  mode: RuntimeExecutionMode,
  liveOrderStatus: 'OPEN' | 'FILLED' = mode === 'LIVE' ? 'OPEN' : 'FILLED'
) => {
  const positions: MemoryPosition[] = [];
  let orderCounter = 0;
  let positionCounter = 0;

  const orderGateway: OrderFlowGateway = {
    openOrder: async (_userId, input) => {
      orderCounter += 1;
      const orderStatus = mode === 'LIVE' ? liveOrderStatus : 'FILLED';
      const shouldCreateSyntheticPosition = orderStatus === 'FILLED' && !input.positionId;
      let createdPositionId: string | null = input.positionId ?? null;
      if (shouldCreateSyntheticPosition) {
        positionCounter += 1;
        createdPositionId = `position-${mode}-${positionCounter}`;
        positions.push({
          id: createdPositionId,
          userId: 'u1',
          symbol: input.symbol,
          side: input.side === 'BUY' ? 'LONG' : 'SHORT',
          quantity: input.quantity,
          managementMode: 'BOT_MANAGED',
          status: 'OPEN',
        });
      }
      return {
        id: `order-${mode}-${orderCounter}`,
        userId: 'u1',
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: input.symbol,
        side: input.side,
        type: input.type,
        status: orderStatus,
        quantity: input.quantity,
        filledQuantity: orderStatus === 'FILLED' ? input.quantity : 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        submittedAt: new Date(),
        filledAt: orderStatus === 'FILLED' ? new Date() : null,
        botId: input.botId ?? null,
        walletId: input.walletId ?? null,
        strategyId: input.strategyId ?? null,
        positionId: createdPositionId,
        price: null,
        stopPrice: null,
        averageFillPrice: null,
        fee: null,
        feeSource: 'ESTIMATED',
        feePending: false,
        feeCurrency: null,
        effectiveFeeRate: null,
        exchangeOrderId: null,
        exchangeTradeId: null,
        canceledAt: null,
      };
    },
    closeOrder: async () => null,
    linkOrderToPosition: async () => undefined,
  };

  const positionGateway: PositionFlowGateway = {
    getOpenPositionBySymbol: async ({ symbol }) => {
      const found = positions.find((position) => position.symbol === symbol && position.status === 'OPEN');
      if (!found) return null;
      return {
        id: found.id,
        userId: found.userId,
        externalId: null,
        origin: 'BOT',
        managementMode: found.managementMode,
        syncState: 'IN_SYNC',
        symbol: found.symbol,
        side: found.side,
        status: 'OPEN',
        entryPrice: 50000,
        quantity: found.quantity,
        leverage: 1,
        openedAt: new Date(),
        closedAt: null,
        realizedPnl: null,
        unrealizedPnl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        botId: null,
        walletId: null,
        strategyId: null,
        stopLoss: null,
        takeProfit: null,
      };
    },
    createPosition: async (input) => {
      positionCounter += 1;
      const next: MemoryPosition = {
        id: `position-${mode}-${positionCounter}`,
        userId: input.userId,
        symbol: input.symbol,
        side: input.side as 'LONG' | 'SHORT',
        quantity: input.quantity,
        managementMode: 'BOT_MANAGED',
        status: 'OPEN',
      };
      positions.push(next);
      return {
        id: next.id,
        userId: next.userId,
        externalId: null,
        origin: 'BOT',
        managementMode: next.managementMode,
        syncState: 'IN_SYNC',
        symbol: next.symbol,
        side: next.side,
        status: 'OPEN',
        entryPrice: input.entryPrice,
        quantity: next.quantity,
        leverage: 1,
        openedAt: new Date(),
        closedAt: null,
        realizedPnl: null,
        unrealizedPnl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        botId: null,
        walletId: null,
        strategyId: null,
        stopLoss: null,
        takeProfit: null,
      };
    },
    closePosition: async (positionId) => {
      const found = positions.find((position) => position.id === positionId);
      if (found) found.status = 'CLOSED';
    },
  };

  const eventGateway: RuntimeExecutionEventGateway = {
    writeEvent: async () => undefined,
  };

  const tradeGateway: RuntimeTradeGateway = {
    createTrade: async () => undefined,
  };

  const dedupeGateway: RuntimeExecutionDedupeGateway = {
    acquire: async (input) => ({
      outcome: 'execute',
      dedupeKey: input.dedupeKey,
    }),
    markSucceeded: async () => undefined,
    markFailed: async () => undefined,
  };

  return { orderGateway, positionGateway, eventGateway, tradeGateway, dedupeGateway };
};

const runScenario = async (
  mode: RuntimeExecutionMode,
  steps: RuntimeSignalDirection[] = ['LONG', 'SHORT', 'EXIT'],
  liveOrderStatus: 'OPEN' | 'FILLED' = 'OPEN'
) => {
  const gateways = createInMemoryGateways(mode, liveOrderStatus);
  const outcomes: Array<{ status: string; reason?: string }> = [];

  for (const direction of steps) {
    const result = await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        symbol: 'BTCUSDT',
        direction,
        quantity: 0.1,
        markPrice: 50000,
        mode,
      },
      gateways.orderGateway,
      gateways.positionGateway,
      gateways.eventGateway,
      gateways.tradeGateway,
      gateways.dedupeGateway
    );

    outcomes.push(
      result.status === 'ignored'
        ? { status: result.status, reason: result.reason }
        : { status: result.status }
    );
  }

  return outcomes;
};

const runBacktestDecisionScenario = (steps: RuntimeSignalDirection[]) => {
  const outcomes: Array<{ status: string; reason?: string }> = [];
  let openPosition: { side: 'LONG' | 'SHORT'; quantity: number } | null = null;

  for (const direction of steps) {
    const decision = decideExecutionAction(
      direction,
      openPosition
        ? {
            side: openPosition.side,
            quantity: openPosition.quantity,
            managementMode: 'BOT_MANAGED',
          }
        : null
    );

    if (decision.kind === 'ignore') {
      outcomes.push({ status: 'ignored', reason: decision.reason });
      continue;
    }

    if (decision.kind === 'open') {
      openPosition = {
        side: decision.positionSide,
        quantity: 0.1,
      };
      outcomes.push({ status: 'opened' });
      continue;
    }

    if (!openPosition) {
      outcomes.push({ status: 'ignored', reason: 'no_open_position' });
      continue;
    }

    openPosition = null;
    outcomes.push({ status: 'closed' });
  }

  return outcomes;
};

describe('paper/live decision equivalence', () => {
  it('keeps LIVE open decisions in waiting-fill state until fill is confirmed', async () => {
    const paperOutcomes = await runScenario('PAPER');
    const liveOutcomes = await runScenario('LIVE', ['LONG', 'SHORT', 'EXIT'], 'OPEN');

    expect(paperOutcomes).toEqual([
      { status: 'opened' },
      { status: 'ignored', reason: 'no_flip_with_open_position' },
      { status: 'closed' },
    ]);
    expect(liveOutcomes).toEqual([
      { status: 'submitted' },
      { status: 'submitted' },
      { status: 'ignored', reason: 'no_open_position' },
    ]);
  });

  it('keeps identical decision outcomes between BACKTEST core and PAPER runtime', async () => {
    const scenarios: RuntimeSignalDirection[][] = [
      ['LONG', 'SHORT', 'EXIT'],
      ['EXIT', 'LONG', 'LONG', 'EXIT', 'EXIT'],
    ];

    for (const steps of scenarios) {
      const paperOutcomes = await runScenario('PAPER', steps);
      const backtestOutcomes = runBacktestDecisionScenario(steps);

      expect(paperOutcomes).toEqual(backtestOutcomes);
    }
  });
});
