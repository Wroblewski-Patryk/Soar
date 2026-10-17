import { CcxtFuturesConnector } from './ccxtFuturesConnector.service';
import { CcxtFuturesOrderFill } from './ccxtFuturesConnector.types';

type LiveFeeReconciliationInput = {
  symbol: string;
  exchangeOrderId: string | null;
  exchangeFilledQuantity?: number | null;
  inlineFills?: CcxtFuturesOrderFill[];
  nowMs?: number;
};

export class LiveFillReconciliationUnknownError extends Error {
  constructor() {
    super('LIVE_FILL_RECONCILIATION_UNKNOWN: fill multiplicity does not match exchange quantity');
    this.name = 'LiveFillReconciliationUnknownError';
  }
}

export type LiveFeeReconciliationResult = {
  fee: number | null;
  feeSource: 'ESTIMATED' | 'EXCHANGE_FILL';
  feePending: boolean;
  feeCurrency: string | null;
  effectiveFeeRate: number | null;
  exchangeTradeId: string | null;
  fills: CcxtFuturesOrderFill[];
};

const hasFeeData = (fills: CcxtFuturesOrderFill[]) =>
  fills.some((fill) => typeof fill.feeCost === 'number' && Number.isFinite(fill.feeCost));

const sameQuantity = (left: number, right: number) =>
  Math.abs(left - right) <= 1e-9 * Math.max(1, Math.abs(left), Math.abs(right));

const dedupeFills = (fills: CcxtFuturesOrderFill[], expectedQuantity?: number | null) => {
  const identified = new Map<string, CcxtFuturesOrderFill>();
  const unidentified = new Map<string, Map<CcxtFuturesOrderFill['source'], CcxtFuturesOrderFill[]>>();
  for (const fill of fills) {
    if (fill.exchangeTradeId) {
      const key = JSON.stringify([fill.exchangeOrderId, fill.exchangeTradeId]);
      const previous = identified.get(key);
      if (!previous || (!Number.isFinite(previous.feeCost) && Number.isFinite(fill.feeCost))) {
        identified.set(key, fill);
      }
      continue;
    }
    const key = JSON.stringify([
      fill.exchangeOrderId, fill.symbol, fill.side, fill.price, fill.quantity,
      fill.executedAt?.toISOString() ?? null,
    ]);
    const bySource = unidentified.get(key) ?? new Map();
    const sourceRows = bySource.get(fill.source) ?? [];
    sourceRows.push(fill);
    bySource.set(fill.source, sourceRows);
    unidentified.set(key, bySource);
  }

  const output = [...identified.values()];
  const ambiguous: { rows: CcxtFuturesOrderFill[]; maxCount: number }[] = [];
  for (const bySource of unidentified.values()) {
    const rows = [...bySource.values()].sort((a, b) =>
      b.length - a.length ||
      b.filter((fill) => Number.isFinite(fill.feeCost)).length -
        a.filter((fill) => Number.isFinite(fill.feeCost)).length
    )[0];
    if (rows.length === 1) output.push(rows[0]);
    else ambiguous.push({ rows, maxCount: rows.length });
  }
  if (ambiguous.length > 1 || (ambiguous.length && !Number.isFinite(expectedQuantity))) {
    throw new LiveFillReconciliationUnknownError();
  }
  if (ambiguous.length === 1) {
    const { rows, maxCount } = ambiguous[0];
    const remaining = (expectedQuantity ?? 0) - output.reduce((sum, fill) => sum + fill.quantity, 0);
    const count = Math.round(remaining / rows[0].quantity);
    if (!Number.isFinite(count) || count < 1 || count > maxCount ||
        !sameQuantity(remaining, count * rows[0].quantity)) {
      throw new LiveFillReconciliationUnknownError();
    }
    output.push(...rows.slice(0, count));
  }
  if (Number.isFinite(expectedQuantity) && output.length > 0 &&
      !sameQuantity(output.reduce((sum, fill) => sum + fill.quantity, 0), expectedQuantity ?? 0)) {
    throw new LiveFillReconciliationUnknownError();
  }
  return output;
};

const summarizeFills = (
  fills: CcxtFuturesOrderFill[], expectedQuantity?: number | null
): LiveFeeReconciliationResult => {
  const unique = dedupeFills(fills, expectedQuantity);
  const hasAnyFee = hasFeeData(unique);
  const hasCompleteFee = unique.every(
    (fill) => typeof fill.feeCost === 'number' && Number.isFinite(fill.feeCost)
  );
  const feeTotal = hasAnyFee
    ? unique.reduce(
        (sum, fill) => sum + (typeof fill.feeCost === 'number' && Number.isFinite(fill.feeCost) ? fill.feeCost : 0),
        0
      )
    : null;
  const notional = unique.reduce((sum, fill) => sum + (Number.isFinite(fill.notional) ? fill.notional : 0), 0);
  const currencies = Array.from(new Set(unique.map((fill) => fill.feeCurrency).filter((v): v is string => !!v)));

  return {
    fee: feeTotal,
    feeSource: hasAnyFee ? 'EXCHANGE_FILL' : 'ESTIMATED',
    feePending: !hasCompleteFee,
    feeCurrency: currencies.length === 1 ? currencies[0] : null,
    effectiveFeeRate:
      hasCompleteFee && typeof feeTotal === 'number' && Number.isFinite(feeTotal) && notional > 0
        ? feeTotal / notional
        : null,
    exchangeTradeId: unique.find((fill) => fill.exchangeTradeId)?.exchangeTradeId ?? null,
    fills: unique,
  };
};

export const reconcileLiveOrderFee = async (
  connector: CcxtFuturesConnector,
  input: LiveFeeReconciliationInput
): Promise<LiveFeeReconciliationResult> => {
  const symbol = input.symbol.toUpperCase();
  const orderId = input.exchangeOrderId;
  const nowMs = input.nowMs ?? Date.now();

  const collected: CcxtFuturesOrderFill[] = [...(input.inlineFills ?? [])];

  const tryFetchOrder = async () => {
    if (!orderId) return;
    try {
      const snapshot = await connector.fetchOrderWithFills({ symbol, orderId });
      collected.push(...snapshot.fills);
    } catch {
      // Best-effort reconciliation: do not fail execution path.
    }
  };

  const tryFetchTrades = async () => {
    if (!orderId) return;
    try {
      const trades = await connector.fetchTradesForOrder({
        symbol,
        orderId,
        since: nowMs - 30 * 60_000,
        limit: 300,
      });
      collected.push(...trades);
    } catch {
      // Best-effort reconciliation: do not fail execution path.
    }
  };

  if (!hasFeeData(collected)) {
    await tryFetchOrder();
  }
  if (!hasFeeData(collected)) {
    await tryFetchTrades();
  }

  if (collected.length === 0) {
    return {
      fee: null,
      feeSource: 'ESTIMATED',
      feePending: true,
      feeCurrency: null,
      effectiveFeeRate: null,
      exchangeTradeId: null,
      fills: [],
    };
  }

  return summarizeFills(collected, input.exchangeFilledQuantity);
};
