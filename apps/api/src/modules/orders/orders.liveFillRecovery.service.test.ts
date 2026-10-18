import { randomUUID } from 'node:crypto';
import type { Exchange, TradeMarket } from '@prisma/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import type { LiveFillCandidate } from './orders.liveFillCandidates.service';
import type { CcxtFuturesOrderFill, CcxtFuturesOrderResult } from '../exchange/ccxtFuturesConnector.types';
import { lookupLiveFillCandidate, type LiveFillLookupResult } from '../exchange/liveFillLookup.service';
import { findLiveFillCandidatePage } from './orders.liveFillCandidates.service';
import { recoverLiveFillCandidateOnce } from './orders.liveFillRecovery.service';
import { applyLiveExchangeAccountUpdateEvent,
  applyLiveExchangeOrderTradeUpdateEvent } from './orders.exchangeEvents.service';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import { RuntimePositionAutomationService } from '../engine/runtimePositionAutomation.service';
import { selectRuntimeDisplayState } from '../bots/runtimeSessionPositionsRead.service';
import type { RuntimeManagedPosition } from '../engine/runtimePositionAutomation.types';

const userIds: string[] = [];
afterEach(async () => {
  for (const userId of userIds.splice(0)) {
    const positions = await prisma.position.findMany({ where: { userId }, select: { id: true } });
    for (const position of positions) await runtimePositionStateStore.deletePositionRuntimeState(position.id);
    await prisma.log.deleteMany({ where: { userId } });
    await prisma.botRuntimeSymbolStat.deleteMany({ where: { userId } });
    await prisma.botRuntimeEvent.deleteMany({ where: { userId } });
    await prisma.runtimeExecutionDedupe.deleteMany({ where: { userId } });
    await prisma.orderFill.deleteMany({ where: { userId } });
    await prisma.trade.deleteMany({ where: { userId } });
    await prisma.order.deleteMany({ where: { userId } });
    await prisma.liveOrderIntent.deleteMany({ where: { userId } });
    await prisma.position.deleteMany({ where: { userId } });
    await prisma.botRuntimeSession.deleteMany({ where: { userId } });
    await prisma.bot.deleteMany({ where: { userId } });
    await prisma.wallet.deleteMany({ where: { userId } });
    await prisma.apiKey.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  }
});

const fixture = async (action: 'OPEN' | 'DCA' | 'CLOSE', withOrder = true,
  context: { exchange: Exchange; marketType: TradeMarket } =
    { exchange: 'BINANCE', marketType: 'FUTURES' }) => {
  const id = randomUUID();
  const user = await prisma.user.create({ data: {
    email: `live-fill-recovery-${id}@example.com`, password: 'hashed',
  } });
  userIds.push(user.id);
  const key = await prisma.apiKey.create({ data: {
    userId: user.id, label: id, exchange: context.exchange,
    apiKey: 'test-key', apiSecret: 'test-secret',
  } });
  const wallet = await prisma.wallet.create({ data: {
    userId: user.id, name: id, mode: 'LIVE', exchange: context.exchange,
    marketType: context.marketType, apiKeyId: key.id,
  } });
  const bot = await prisma.bot.create({ data: {
    userId: user.id, name: id, mode: 'LIVE', exchange: context.exchange,
    marketType: context.marketType, walletId: wallet.id, apiKeyId: key.id,
    positionMode: 'ONE_WAY', isActive: true, liveOptIn: true,
  } });
  const position = action === 'OPEN' ? null : await prisma.position.create({ data: {
    userId: user.id, botId: bot.id, walletId: wallet.id,
    symbol: 'BTCUSDT', side: 'LONG', status: 'OPEN', quantity: 1,
    entryPrice: 100, origin: 'BOT', managementMode: 'BOT_MANAGED',
  } });
  const dedupeKey = `v1|${action}|${id}`;
  const intent = await prisma.liveOrderIntent.create({ data: {
    userId: user.id, clientOrderId: `soar_${id.replace(/-/g, '').slice(0, 22)}`,
    payloadHash: id, exchange: context.exchange, marketType: context.marketType,
    symbol: 'BTCUSDT',
    payload: { mode: 'LIVE', origin: 'BOT', botId: bot.id, walletId: wallet.id,
      positionId: position?.id ?? null, side: action === 'CLOSE' ? 'SELL' : 'BUY',
      type: 'MARKET', quantity: 1, symbol: 'BTCUSDT', price: 100, runtimeDedupeKey: dedupeKey },
  } });
  const venueId = context.exchange === 'GATEIO'
    ? String(parseInt(id.slice(0, 8), 16)) : `venue-${id}`;
  if (withOrder) await prisma.order.create({ data: {
    id: intent.id, userId: user.id, botId: bot.id, walletId: wallet.id,
    positionId: position?.id ?? null, origin: 'BOT',
    symbol: 'BTCUSDT', side: action === 'CLOSE' ? 'SELL' : 'BUY',
    type: 'MARKET', status: 'OPEN', quantity: 1,
    filledQuantity: 0, feePending: true, exchangeOrderId: venueId,
  } });
  await prisma.runtimeExecutionDedupe.create({ data: {
    dedupeKey, dedupeVersion: 'v1', commandType: action,
    userId: user.id, botId: bot.id, symbol: 'BTCUSDT', status: 'PENDING',
    orderId: withOrder ? intent.id : null, positionId: position?.id ?? null,
    commandFingerprint: { positionId: position?.id ?? null, dcaLevelIndex: 0 },
    ttlExpiresAt: new Date(Date.now() + 86_400_000),
  } });
  const candidate = (await findLiveFillCandidatePage()).candidates.find((item) => item.orderId === intent.id)!;
  return { user, key, wallet, bot, position, intent, venueId, dedupeKey, candidate };
};

const fill = (venueId: string, id: string, quantity: number, feeCost: number | null,
  side = 'buy', price = 100): CcxtFuturesOrderFill => ({
  exchangeTradeId: id, exchangeOrderId: venueId, symbol: 'BTCUSDT', side,
  price, quantity, notional: price * quantity, feeCost, feeCurrency: 'USDT',
  feeRate: null, executedAt: new Date('2026-10-18T08:00:00Z'),
  source: 'fetchMyTrades', raw: { id },
});
const found = (candidate: LiveFillCandidate, apiKeyId: string, venueId: string,
  filled: number, fills: CcxtFuturesOrderFill[], status = 'closed'): Extract<LiveFillLookupResult, { kind: 'FOUND' }> => ({
  kind: 'FOUND', candidate, apiKeyId, lookupSource: 'ORDER_ID',
  order: { id: venueId, symbol: 'BTC/USDT:USDT',
    side: candidate.side?.toLowerCase(), status, filled, fills,
    raw: { clientOrderId: candidate.clientOrderId } } satisfies CcxtFuturesOrderResult,
});
const useLookup = (result: LiveFillLookupResult) => vi.fn(async () => result);

const createDbBackedAutomation = (fx: Awaited<ReturnType<typeof fixture>>) => {
  const executeDca = vi.fn(async () => ({ feePaid: 0, executed: false }));
  const closeByExitSignal = vi.fn(async () => ({ status: 'submitted' as const }));
  const service = new RuntimePositionAutomationService({
    listOpenPositionsBySymbol: async (symbol) => {
      const position = await prisma.position.findFirst({ where: {
        id: fx.position!.id, symbol, status: 'OPEN',
      } });
      return position ? [{ ...position, bot: {
        walletId: fx.wallet.id, liveOptIn: true,
        wallet: { mode: 'LIVE', exchange: 'BINANCE', marketType: 'FUTURES',
          baseCurrency: 'USDT', paperInitialBalance: 10_000 },
        symbolGroup: { symbols: ['BTCUSDT'], marketUniverse: {
          exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
        } },
        botMarketGroups: [],
      } } as RuntimeManagedPosition] : [];
    },
    getStrategyConfigById: async () => null,
    getDurableDcaProgress: async () => ({
      currentAdds: await prisma.trade.count({ where: {
        positionId: fx.position!.id, lifecycleAction: 'DCA',
      } }),
    }),
    executeDca, closeByExitSignal,
    resolveDcaFundsExhausted: async () => false,
  });
  return { service, executeDca, closeByExitSignal };
};

const tick = { type: 'ticker' as const, exchange: 'BINANCE' as const,
  marketType: 'FUTURES' as const, symbol: 'BTCUSDT',
  eventTime: Date.now(), lastPrice: 95, priceChangePercent24h: 0 };

describe('explicit LIVE fill recovery', () => {
  it('rebases console and automation after a DCA commit crash, then repairs cache on replay', async () => {
    const fx = await fixture('DCA');
    await runtimePositionStateStore.setPositionRuntimeState(fx.position!.id, {
      quantity: 1, averageEntryPrice: 100, currentAdds: 0, trailingAnchorPrice: 100,
    });
    const snapshot = found(fx.candidate, fx.key.id, fx.venueId, 1,
      [fill(fx.venueId, 'dca-90', 1, 0.1, 'buy', 90)]);
    await expect(recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot),
      afterCoreCommit: async () => { throw new Error('crash after commit'); },
    })).rejects.toThrow('crash after commit');
    const canonical = await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } });
    expect(canonical).toMatchObject({ quantity: 2, entryPrice: 95,
      continuityState: 'RECOVERING' });
    expect(await runtimePositionStateStore.getPositionRuntimeState(canonical.id))
      .toMatchObject({ quantity: 1, averageEntryPrice: 100 });
    const displayState = selectRuntimeDisplayState({ position: canonical,
      runtimeSnapshot: null,
      persistedState: await runtimePositionStateStore.getPositionRuntimeState(canonical.id) });
    expect(displayState).toBeNull();
    const automation = createDbBackedAutomation(fx);
    await automation.service.handleTickerEvent(tick);
    expect(automation.service.getPositionStateSnapshot(canonical.id)).toBeNull();
    expect(automation.executeDca).not.toHaveBeenCalled();
    expect(automation.closeByExitSignal).not.toHaveBeenCalled();
    const afterFillAt = canonical.lastDcaFillVenueAt!.getTime() + 1;
    await applyLiveExchangeAccountUpdateEvent({ userId: fx.user.id,
      sourceApiKeyId: fx.key.id,
      event: { eventType: 'ACCOUNT_UPDATE', marketType: 'FUTURES',
        eventTime: afterFillAt, transactionTime: afterFillAt,
        balances: [], positions: [{ symbol: 'BTCUSDT', amount: 2,
          entryPrice: 95, unrealizedPnl: 0, positionSide: 'LONG' }], raw: {} },
    });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: canonical.id } }))
      .continuityState).toBe('CONFIRMED');
    await automation.service.handleTickerEvent(tick);
    expect(automation.service.getPositionStateSnapshot(canonical.id))
      .toMatchObject({ quantity: 2, averageEntryPrice: 95, currentAdds: 1,
        trailingAnchorPrice: 100 });
    expect(automation.executeDca).not.toHaveBeenCalled();
    expect(automation.closeByExitSignal).not.toHaveBeenCalled();
    await runtimePositionStateStore.setPositionRuntimeState(canonical.id, {
      quantity: 1, averageEntryPrice: 100, currentAdds: 0, trailingAnchorPrice: 100,
    });
    const setSpy = vi.spyOn(runtimePositionStateStore, 'setPositionRuntimeState')
      .mockResolvedValueOnce(false);
    await expect(recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot) })).rejects.toThrow('RUNTIME_STATE_SYNC_PENDING');
    setSpy.mockRestore();
    expect(await runtimePositionStateStore.getPositionRuntimeState(canonical.id))
      .toMatchObject({ quantity: 1, averageEntryPrice: 100 });
    const replay = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot) });
    expect(replay).toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
    expect(await runtimePositionStateStore.getPositionRuntimeState(canonical.id))
      .toMatchObject({ quantity: 2, averageEntryPrice: 95, currentAdds: 1 });
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(await prisma.botRuntimeEvent.count({ where: { userId: fx.user.id,
      eventType: 'DCA_EXECUTED' } })).toBe(1);
  });

  it('keeps a closed position non-actionable when cache invalidation fails, then clears it on replay', async () => {
    const fx = await fixture('CLOSE');
    await runtimePositionStateStore.setPositionRuntimeState(fx.position!.id, {
      quantity: 1, averageEntryPrice: 100, currentAdds: 0, trailingAnchorPrice: 100,
    });
    const snapshot = found(fx.candidate, fx.key.id, fx.venueId, 1,
      [fill(fx.venueId, 'close-110', 1, 0.1, 'sell', 110)]);
    const deleteSpy = vi.spyOn(runtimePositionStateStore, 'deletePositionRuntimeState')
      .mockResolvedValueOnce(false);
    await expect(recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot) })).rejects.toThrow('RUNTIME_STATE_SYNC_PENDING');
    deleteSpy.mockRestore();
    const canonical = await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } });
    expect(canonical.status).toBe('CLOSED');
    expect(await runtimePositionStateStore.getPositionRuntimeState(canonical.id)).not.toBeNull();
    expect(selectRuntimeDisplayState({ position: canonical, runtimeSnapshot: null,
      persistedState: await runtimePositionStateStore.getPositionRuntimeState(canonical.id) })).toBeNull();
    const automation = createDbBackedAutomation(fx);
    await automation.service.handleTickerEvent(tick);
    expect(automation.service.getPositionStateSnapshot(canonical.id)).toBeNull();
    expect(automation.executeDca).not.toHaveBeenCalled();
    expect(automation.closeByExitSignal).not.toHaveBeenCalled();
    await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot) });
    expect(await runtimePositionStateStore.getPositionRuntimeState(canonical.id)).toBeNull();
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(await prisma.botRuntimeEvent.count({ where: { userId: fx.user.id,
      eventType: 'POSITION_CLOSED' } })).toBe(1);
  });
  it('keeps partial DCA pending, finalizes once, and backfills a late fee', async () => {
    const fx = await fixture('DCA');
    const first = fill(fx.venueId, 'fill-1', 0.4, null);
    const second = fill(fx.venueId, 'fill-2', 0.6, null);
    const partial = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 0.4, [first], 'open')) });
    expect(partial).toMatchObject({ kind: 'APPLIED', status: 'PARTIALLY_FILLED' });
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(0);
    const nextCandidate = (await findLiveFillCandidatePage()).candidates.find((row) => row.orderId === fx.intent.id)!;
    const final = await recoverLiveFillCandidateOnce({ candidate: nextCandidate,
      lookup: useLookup(found(nextCandidate, fx.key.id, fx.venueId, 1, [first, second])) });
    expect(final).toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(2);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(2);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id, lifecycleAction: 'DCA' } })).toBe(1);
    const pendingOrder = await prisma.order.findUniqueOrThrow({ where: { id: fx.intent.id } });
    const pendingTrade = await prisma.trade.findFirstOrThrow({ where: { orderId: fx.intent.id } });
    expect(pendingOrder.feePending).toBe(true);
    expect(pendingTrade.fee).toBeNull();
    expect(pendingTrade.feePending).toBe(true);
    expect((await prisma.runtimeExecutionDedupe.findUniqueOrThrow({
      where: { dedupeKey: fx.dedupeKey },
    })).status).toBe('SUCCEEDED');
    expect(await prisma.botRuntimeEvent.count({ where: { userId: fx.user.id,
      eventType: 'DCA_EXECUTED' } })).toBe(1);
    expect(await prisma.botRuntimeSymbolStat.count({ where: { userId: fx.user.id } })).toBe(1);
    const feeCandidate = (await findLiveFillCandidatePage()).candidates.find((row) => row.orderId === fx.intent.id)!;
    await recoverLiveFillCandidateOnce({ candidate: feeCandidate,
      lookup: useLookup(found(feeCandidate, fx.key.id, fx.venueId, 1,
        [{ ...first, feeCost: 0.04 }, { ...second, feeCost: 0.06 }])) });
    const settled = await prisma.order.findUniqueOrThrow({ where: { id: fx.intent.id } });
    expect(settled.fee).toBeCloseTo(0.1);
    expect(settled.feePending).toBe(false);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(2);
  });

  it('rolls back an unresolved OPEN intent on interruption and replays atomically', async () => {
    const fx = await fixture('OPEN', false);
    const snapshot = found(fx.candidate, fx.key.id, fx.venueId, 1,
      [fill(fx.venueId, 'open-fill-1', 0.4, 0),
        fill(fx.venueId, 'open-fill-2', 0.6, 0)]);
    await expect(recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot), afterEventApplied: async (index) => {
        if (index === 0) throw new Error('crash');
      },
    })).rejects.toThrow('crash');
    expect(await prisma.order.count({ where: { id: fx.intent.id } })).toBe(0);
    expect(await prisma.orderFill.count({ where: { userId: fx.user.id } })).toBe(0);
    expect(await prisma.trade.count({ where: { userId: fx.user.id } })).toBe(0);
    const replay = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot) });
    expect(replay).toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
    expect(await prisma.order.count({ where: { id: fx.intent.id } })).toBe(1);
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(2);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id, lifecycleAction: 'OPEN' } })).toBe(1);
    expect((await prisma.runtimeExecutionDedupe.findUniqueOrThrow({
      where: { dedupeKey: fx.dedupeKey },
    })).status).toBe('SUCCEEDED');
    expect(await prisma.botRuntimeEvent.count({ where: { userId: fx.user.id } })).toBe(1);
    expect(await prisma.botRuntimeSymbolStat.count({ where: { userId: fx.user.id } })).toBe(1);
    const again = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(snapshot) });
    expect(again.kind).toBe('APPLIED');
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(2);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(await prisma.botRuntimeEvent.count({ where: { userId: fx.user.id } })).toBe(1);
  });

  it('repairs a legacy FILLED order missing one of two fills without repeating DCA', async () => {
    const fx = await fixture('DCA');
    await prisma.order.update({ where: { id: fx.intent.id }, data: {
      status: 'FILLED', filledQuantity: 1, averageFillPrice: 100,
      exchangeTradeId: 'missing-fill', fee: 0.04, feeSource: 'EXCHANGE_FILL',
      feePending: false,
    } });
    await prisma.position.update({ where: { id: fx.position!.id }, data: { quantity: 2 } });
    await prisma.trade.create({ data: {
      userId: fx.user.id, botId: fx.bot.id, walletId: fx.wallet.id,
      orderId: fx.intent.id, positionId: fx.position!.id, executionMode: 'LIVE',
      lifecycleAction: 'DCA', symbol: 'BTCUSDT', side: 'BUY', price: 100,
      quantity: 1, fee: 0.04, feeSource: 'EXCHANGE_FILL', feePending: false,
    } });
    const first = fill(fx.venueId, 'existing-fill', 0.4, 0.04);
    const second = fill(fx.venueId, 'missing-fill', 0.6, 0.06);
    await prisma.orderFill.create({ data: {
      userId: fx.user.id, botId: fx.bot.id, orderId: fx.intent.id,
      positionId: fx.position!.id, symbol: 'BTCUSDT', side: 'BUY',
      exchangeTradeId: 'existing-fill', price: 100, quantity: 0.4,
      notional: 40, feeCost: 0.04, feeCurrency: 'USDT', executedAt: new Date(),
    } });
    const candidate = (await findLiveFillCandidatePage()).candidates.find((row) => row.orderId === fx.intent.id)!;
    expect(candidate.localStatus).toBe('FILLED');
    const result = await recoverLiveFillCandidateOnce({ candidate,
      lookup: useLookup(found(candidate, fx.key.id, fx.venueId, 1, [first, second])) });
    expect(result.kind).toBe('APPLIED');
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(2);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(2);
  });

  it('leaves a FILLED order without lifecycle Trade UNKNOWN to avoid doubling Position', async () => {
    const fx = await fixture('DCA');
    await prisma.order.update({ where: { id: fx.intent.id }, data: {
      status: 'FILLED', filledQuantity: 1, averageFillPrice: 100,
      exchangeTradeId: 'unknown-fill',
    } });
    const candidate = (await findLiveFillCandidatePage()).candidates.find((row) => row.orderId === fx.intent.id)!;
    const result = await recoverLiveFillCandidateOnce({ candidate,
      lookup: useLookup(found(candidate, fx.key.id, fx.venueId, 1,
        [fill(fx.venueId, 'unknown-fill', 1, 0.1)])) });
    expect(result).toMatchObject({ kind: 'UNKNOWN', reason: 'LEGACY_LIFECYCLE_AMBIGUOUS' });
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(0);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(1);
  });

  it('leaves UNKNOWN and ambiguous snapshots without local mutations', async () => {
    const fx = await fixture('DCA');
    const missing = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup({ kind: 'UNKNOWN', candidate: fx.candidate, reason: 'HISTORY_AMBIGUOUS' }) });
    expect(missing).toMatchObject({ kind: 'UNKNOWN', reason: 'HISTORY_AMBIGUOUS' });
    const incomplete = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 1,
        [fill(fx.venueId, 'only-0.4', 0.4, 0.01)])) });
    expect(incomplete).toMatchObject({ kind: 'UNKNOWN', reason: 'VENUE_FILL_SUM_MISMATCH' });
    expect((await prisma.order.findUniqueOrThrow({ where: { id: fx.intent.id } })).status).toBe('OPEN');
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(0);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(0);
  });

  it('does not report an unfilled canceled venue order as applied', async () => {
    const fx = await fixture('OPEN', false);
    const result = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 0, [], 'canceled')) });
    expect(result).toMatchObject({ kind: 'UNKNOWN', reason: 'VENUE_TERMINAL_WITHOUT_FILLS' });
    expect(await prisma.order.count({ where: { id: fx.intent.id } })).toBe(0);
  });

  it('rejects a local fill whose venue identity has conflicting economics', async () => {
    const fx = await fixture('DCA');
    await prisma.orderFill.create({ data: {
      userId: fx.user.id, botId: fx.bot.id, orderId: fx.intent.id,
      positionId: fx.position!.id, symbol: 'BTCUSDT', side: 'BUY',
      exchangeTradeId: 'conflict-fill', price: 100, quantity: 0.5,
      notional: 50, feeCost: null, executedAt: new Date(),
    } });
    const result = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 1,
        [fill(fx.venueId, 'conflict-fill', 1, 0.1)])) });
    expect(result).toMatchObject({ kind: 'UNKNOWN', reason: 'LOCAL_FILL_CONFLICT' });
    expect((await prisma.order.findUniqueOrThrow({ where: { id: fx.intent.id } })).status).toBe('OPEN');
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id } })).toBe(0);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(1);
  });

  it('rechecks account provenance inside the transaction and leaves drift untouched', async () => {
    const fx = await fixture('DCA');
    await prisma.apiKey.update({ where: { id: fx.key.id }, data: {
      apiSecret: 'rotated-secret', updatedAt: new Date(fx.intent.createdAt.getTime() + 1000),
    } });
    const result = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 1,
        [fill(fx.venueId, 'drift-fill', 1, 0.1)])) });
    expect(result).toMatchObject({ kind: 'UNKNOWN', reason: 'ACCOUNT_PROVENANCE_CHANGED' });
    expect((await prisma.order.findUniqueOrThrow({ where: { id: fx.intent.id } })).status).toBe('OPEN');
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(0);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(1);
  });

  it('finalizes CLOSE with nullable PnL until fee arrives', async () => {
    const fx = await fixture('CLOSE');
    const first = fill(fx.venueId, 'close-fill', 1, null, 'sell', 110);
    const initial = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 1, [first])) });
    expect(initial).toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).realizedPnl).toBeNull();
    const feeCandidate = (await findLiveFillCandidatePage()).candidates.find((row) => row.orderId === fx.intent.id)!;
    await recoverLiveFillCandidateOnce({ candidate: feeCandidate,
      lookup: useLookup(found(feeCandidate, fx.key.id, fx.venueId, 1,
        [{ ...first, feeCost: 0.1 }])) });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).realizedPnl).toBeCloseTo(9.9);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id, lifecycleAction: 'CLOSE' } })).toBe(1);
  });

  it('serializes a concurrent recovery and exchange event without duplicate DCA', async () => {
    const fx = await fixture('DCA');
    const one = fill(fx.venueId, 'race-fill', 1, 0.1);
    const event = {
      eventType: 'ORDER_TRADE_UPDATE' as const, marketType: 'FUTURES' as const,
      eventTime: Date.now(), transactionTime: Date.now(), symbol: 'BTCUSDT',
      side: 'BUY', orderType: 'MARKET', orderStatus: 'FILLED', executionType: 'TRADE',
      exchangeOrderId: fx.venueId, clientOrderId: fx.intent.clientOrderId,
      averagePrice: 100, cumulativeFilledQuantity: 1, lastFilledQuantity: 1,
      lastFilledPrice: 100, fee: 0.1, feeCurrency: 'USDT',
      exchangeTradeId: 'race-fill', raw: {},
    };
    const [recovered] = await Promise.all([
      recoverLiveFillCandidateOnce({ candidate: fx.candidate,
        lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 1, [one])) }),
      applyLiveExchangeOrderTradeUpdateEvent({ userId: fx.user.id, event }),
    ]);
    expect(['APPLIED', 'UNKNOWN']).toContain(recovered.kind);
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id, lifecycleAction: 'DCA' } })).toBe(1);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(2);
  });

  it.each([
    ['BINANCE', 'SPOT'], ['BINANCE', 'FUTURES'],
    ['GATEIO', 'SPOT'], ['GATEIO', 'FUTURES'],
  ] as const)('finalizes one %s %s snapshot through the shared transaction', async (exchange, marketType) => {
    const fx = await fixture('DCA', true, { exchange, marketType });
    const one = fill(fx.venueId, `fill-${exchange}-${marketType}`, 1, 0.1);
    const result = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: useLookup(found(fx.candidate, fx.key.id, fx.venueId, 1, [one])) });
    expect(result).toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id, lifecycleAction: 'DCA' } })).toBe(1);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: fx.position!.id } })).quantity).toBe(2);
  });

  it('recovers a finished Gate Spot intent from bounded history and order trades', async () => {
    const fx = await fixture('OPEN', false, { exchange: 'GATEIO', marketType: 'SPOT' });
    const venueOrder: CcxtFuturesOrderResult = {
      id: fx.venueId, symbol: 'BTC/USDT', side: 'buy', status: 'closed', filled: 1,
      fills: [], raw: { info: { text: `t-${fx.intent.clientOrderId}` } },
    };
    const read = {
      fetchOrderWithFills: vi.fn().mockResolvedValue({ order: venueOrder, fills: [] }),
      fetchOrderByClientOrderId: vi.fn().mockRejectedValue(new Error('finished text unavailable')),
      fetchClosedOrdersPage: vi.fn().mockResolvedValue([venueOrder]),
      fetchTradesForOrder: vi.fn().mockResolvedValue([fill(fx.venueId, 'gate-fill', 1, 0)]),
      disconnect: vi.fn().mockResolvedValue(undefined),
    };
    const result = await recoverLiveFillCandidateOnce({ candidate: fx.candidate,
      lookup: (candidate) => lookupLiveFillCandidate(candidate, {
        createConnector: () => read,
      }),
    });
    expect(result).toMatchObject({ kind: 'APPLIED', status: 'FILLED' });
    expect(read.fetchClosedOrdersPage).toHaveBeenCalledOnce();
    expect(read.fetchTradesForOrder).toHaveBeenCalledWith(expect.objectContaining({
      orderId: fx.venueId,
    }));
    expect(await prisma.orderFill.count({ where: { orderId: fx.intent.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: fx.intent.id, lifecycleAction: 'OPEN' } })).toBe(1);
  });
});
