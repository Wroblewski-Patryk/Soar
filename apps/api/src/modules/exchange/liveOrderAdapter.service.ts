import { CcxtFuturesConnector } from './ccxtFuturesConnector.service';
import { CcxtFuturesOrderResult } from './ccxtFuturesConnector.types';
import { reconcileLiveOrderFee } from './liveFeeReconciliation.service';
import {
  PlaceLiveOrderInput,
  PlaceLiveOrderInputSchema,
  PlaceLiveOrderWithFeesResult,
} from './liveOrderAdapter.types';
import { metricsStore } from '../../observability/metrics';
import { createModuleLogger } from '../../lib/logger';

type SleepFn = (delayMs: number) => Promise<void>;
type LogLevel = 'info' | 'warn' | 'error';
type ExchangeLogPayload = {
  event: string;
  attempt?: number;
  maxAttempts?: number;
  symbol?: string;
  orderType?: string;
  side?: string;
  delayMs?: number;
  error?: string;
};

type ExchangeLogger = {
  info: (payload: ExchangeLogPayload) => void;
  warn: (payload: ExchangeLogPayload) => void;
  error: (payload: ExchangeLogPayload) => void;
};

const defaultSleep: SleepFn = (delayMs) =>
  new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });

const emitDefaultLog = (level: LogLevel, payload: ExchangeLogPayload) => {
  if (process.env.NODE_ENV === 'test') return;

  const { event, ...fields } = payload;
  createModuleLogger('exchange.live-order-adapter')[level](event, fields);
};

const defaultExchangeLogger: ExchangeLogger = {
  info: (payload) => emitDefaultLog('info', payload),
  warn: (payload) => emitDefaultLog('warn', payload),
  error: (payload) => emitDefaultLog('error', payload),
};

export class LiveOrderAdapter {
  constructor(
    private readonly connector: CcxtFuturesConnector,
    private readonly sleep: SleepFn = defaultSleep,
    private readonly logger: ExchangeLogger = defaultExchangeLogger
  ) {}

  async placeLiveOrderWithRetry(input: PlaceLiveOrderInput): Promise<CcxtFuturesOrderResult> {
    const parsed = PlaceLiveOrderInputSchema.parse(input);
    // A createOrder timeout can mean the exchange accepted the order. Never
    // submit again here; the durable intent owner performs a read-only lookup.
    void this.sleep;
    metricsStore.recordExchangeOrderAttempt();
    try {
      const result = await this.connector.placeOrder(parsed.order);
      this.logger.info({
        event: 'exchange.live_order.success',
        attempt: 1,
        maxAttempts: 1,
        symbol: parsed.order.symbol,
        orderType: parsed.order.type,
        side: parsed.order.side,
      });
      return result;
    } catch (error) {
      metricsStore.recordExchangeOrderFailure();
      metricsStore.recordRuntimeExecutionError('live_order_submission_uncertain');
      this.logger.error({
        event: 'exchange.live_order.unknown',
        attempt: 1,
        maxAttempts: 1,
        symbol: parsed.order.symbol,
        orderType: parsed.order.type,
        side: parsed.order.side,
        error: error instanceof Error ? error.message : 'unknown_error',
      });
      throw error;
    }
  }

  async placeLiveOrderWithFees(input: PlaceLiveOrderInput): Promise<PlaceLiveOrderWithFeesResult> {
    const parsed = PlaceLiveOrderInputSchema.parse(input);
    const orderResult = await this.placeLiveOrderWithRetry(parsed);
    const reconciliationStartedAt = Date.now();
    const feeReconciliation = await reconcileLiveOrderFee(this.connector, {
      symbol: parsed.order.symbol,
      exchangeOrderId: orderResult.id || null,
      inlineFills: orderResult.fills ?? [],
    });
    metricsStore.recordRuntimeReconciliationDelay(
      Date.now() - reconciliationStartedAt,
      feeReconciliation.feePending
    );

    return {
      exchangeOrderId: orderResult.id || null,
      status: orderResult.status,
      exchangeFilledQuantity: orderResult.filled,
      exchangeAverageFillPrice: orderResult.average,
      fee: feeReconciliation.fee,
      feeSource: feeReconciliation.feeSource,
      feePending: feeReconciliation.feePending,
      feeCurrency: feeReconciliation.feeCurrency,
      effectiveFeeRate: feeReconciliation.effectiveFeeRate,
      exchangeTradeId: feeReconciliation.exchangeTradeId,
      fills: feeReconciliation.fills,
      rawOrderStatus: orderResult.status,
    };
  }
}

export const createLiveOrderAdapter = (connector: CcxtFuturesConnector) => {
  return new LiveOrderAdapter(connector);
};

export const createBinanceFuturesLiveOrderAdapter = (connector: CcxtFuturesConnector) =>
  createLiveOrderAdapter(connector);

export const createBinanceSpotLiveOrderAdapter = (connector: CcxtFuturesConnector) =>
  createLiveOrderAdapter(connector);
