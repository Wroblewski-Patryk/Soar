// Test-only HTTP boundary. Production src/index.ts never imports this file,
// production tsc excludes test-only/, and Docker excludes it from the image.
import { createHash } from 'node:crypto';
import express from 'express';
import { z } from 'zod';
import { prisma } from '../src/prisma/client';
import { isAppErrorLike } from '../src/lib/errors';
import { createRateLimiter } from '../src/middleware/rateLimit';
import { prepareOpenOrderRiskContext } from '../src/modules/orders/orders.service';
import { SubscriptionAssignmentRequiredError, SubscriptionFeatureUnavailableError } from
  '../src/modules/subscriptions/subscriptionEntitlements.service';
import { EXTERNAL_CLIENT_GRANT_SECRET_PATTERN } from '../src/modules/externalClientGrants/externalClientGrants.service';
import {
  bindExternalClientGrantReservationIntent,
  executeBoundExternalClientGrantMock,
  GrantReservationError,
  recoverBoundExternalClientGrantMockResult,
  type GrantLimitCommand,
} from '../src/modules/externalClientGrants/externalClientGrantReservation.service';

const bodySchema = z.strictObject({
  clientOrderId: z.string().regex(/^soar_[A-Za-z0-9_-]{22}$/),
  side: z.enum(['BUY', 'SELL']),
  quantity: z.string().regex(/^(?:0|[1-9]\d{0,11})(?:\.\d{1,8})?$/),
  limitPrice: z.string().regex(/^(?:0|[1-9]\d{0,11})(?:\.\d{1,8})?$/),
});
const unavailable = { error: 'Grant unavailable' };
const conflict = { error: 'Order unavailable' };
const temporary = { error: 'Order temporarily unavailable' };
const unresolved = (clientOrderId: string) => ({
  execution: 'MOCK', clientOrderId, state: 'RECONCILIATION_REQUIRED',
});
const completed = (clientOrderId: string, orderId: string) => ({
  execution: 'MOCK', clientOrderId, state: 'MOCK_FILLED', orderId,
});
const fixedRules = async (scope: { exchange: string; marketType: string; symbol: string }) => {
  if (!['BINANCE', 'GATEIO'].includes(scope.exchange) || scope.marketType !== 'FUTURES' ||
      scope.symbol !== 'BTCUSDT') throw new GrantReservationError('DELEGATED_MOCK_MARKET_UNSUPPORTED');
  return { minQuantity: 0.001, minNotional: 1, quantityStep: 0.001,
    priceStep: 0.01, contractSize: 1, quoteCurrency: 'USDT', settleCurrency: 'USDT',
    isContract: true, isLinear: true, isInverse: false };
};

const isIsolatedTest = () => {
  if (process.env.NODE_ENV !== 'test') return false;
  try {
    const url = new URL(process.env.DATABASE_URL ?? '');
    return ['postgres:', 'postgresql:'].includes(url.protocol) &&
      decodeURIComponent(url.pathname.slice(1)).endsWith('_test');
  } catch { return false; }
};

// A separate app deliberately has no production-router import or mount point.
export const createMockOrdersHttpApp = () => {
  const app = express();
  if (!isIsolatedTest()) return app;

  app.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  const ipLimiter = createRateLimiter({ windowMs: 60_000, max: 30, keyScope: 'ip',
    bucketId: 'test-only-external-mock-orders-ip', requireSharedStore: true,
    sharedStoreTimeoutMs: 1000, forceSharedStoreInTest: true });
  const grantLimiter = createRateLimiter({ windowMs: 60_000, max: 10, keyScope: 'order_grant',
    bucketId: 'test-only-external-mock-orders-grant', requireSharedStore: true,
    sharedStoreTimeoutMs: 1000, forceSharedStoreInTest: true });

  // Both keys come from headers/socket metadata, so malformed JSON is charged
  // or denied by the shared store before the body parser can return 400.
  app.post('/external-client/grants/:grantId/mock-orders', ipLimiter, grantLimiter,
    express.json({ limit: '2kb', strict: true }),
    async (req, res) => {
      const authorization = req.headers.authorization;
      const count = req.rawHeaders.filter((header: string) =>
        header.toLowerCase() === 'authorization').length;
      const secret = /^Bearer (soar_ext_[A-Za-z0-9_-]{43})$/i.exec(authorization ?? '')?.[1];
      if (count !== 1 || !secret || !EXTERNAL_CLIENT_GRANT_SECRET_PATTERN.test(secret) ||
          req.headers.cookie !== undefined || Object.keys(req.query).length > 0 ||
          !z.uuid().safeParse(req.params.grantId).success) {
        return res.status(401).json(unavailable);
      }
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: 'Invalid order request' });

      try {
        const grant = await prisma.externalClientGrant.findUnique({
          where: { secretHash: createHash('sha256').update(secret).digest('hex') },
        });
        if (!grant || grant.id !== req.params.grantId || grant.action !== 'PLACE_LIVE_ORDER' ||
            grant.revokedAt || grant.expiresAt <= new Date()) {
          return res.status(401).json(unavailable);
        }
        const prepared = await prepareOpenOrderRiskContext(grant.userId, {
          botId: grant.botId, symbol: grant.symbol, side: parsed.data.side,
          type: 'LIMIT', quantity: Number(parsed.data.quantity),
          price: Number(parsed.data.limitPrice), mode: 'LIVE', riskAck: true,
          reduceOnly: false, clientOrderId: parsed.data.clientOrderId,
        });
        if (!prepared.liveBot || prepared.liveBot.exchange !== grant.exchange ||
            prepared.liveBot.marketType !== grant.marketType) {
          return res.status(401).json(unavailable);
        }
        const command: GrantLimitCommand = {
          userId: grant.userId, botId: grant.botId, exchange: grant.exchange,
          marketType: grant.marketType, symbol: grant.symbol, action: 'PLACE_LIVE_ORDER',
          clientOrderId: parsed.data.clientOrderId, side: parsed.data.side, type: 'LIMIT',
          quantity: parsed.data.quantity, limitPrice: parsed.data.limitPrice,
          reduceOnly: false, walletId: prepared.canonicalPayload.walletId ?? null,
          strategyId: prepared.canonicalPayload.strategyId ?? null, positionId: null,
        };
        const bound = await bindExternalClientGrantReservationIntent({
          grantId: grant.id, secret, command,
        }, { getSymbolRules: fixedRules });
        const readExisting = async () => {
          try {
            const found = await recoverBoundExternalClientGrantMockResult({
              clientOrderId: parsed.data.clientOrderId, secret,
            });
            return found.orderId
              ? res.status(200).json(completed(parsed.data.clientOrderId, found.orderId))
              : res.status(202).json(unresolved(parsed.data.clientOrderId));
          } catch {
            return res.status(202).json(unresolved(parsed.data.clientOrderId));
          }
        };
        if (bound.reservation.state !== 'RESERVED') return readExisting();
        try {
          const executed = await executeBoundExternalClientGrantMock({
            reservationId: bound.reservation.id, secret, scenario: 'CERTAIN_FILL',
          });
          if (executed.orderId) {
            return res.status(bound.reused ? 200 : 201)
              .json(completed(parsed.data.clientOrderId, executed.orderId));
          }
          return readExisting();
        } catch (error) {
          if (error instanceof GrantReservationError &&
              error.code === 'DELEGATED_MOCK_OUTCOME_UNKNOWN') return readExisting();
          throw error;
        }
      } catch (error) {
        if (error instanceof GrantReservationError) {
          if (['CLIENT_ORDER_COMMAND_CONFLICT', 'CLIENT_ORDER_ID_ALREADY_USED',
            'RESERVATION_NOT_DISPATCHABLE'].includes(error.code)) {
            return res.status(409).json(conflict);
          }
          return res.status(401).json(unavailable);
        }
        if (error instanceof SubscriptionAssignmentRequiredError ||
            error instanceof SubscriptionFeatureUnavailableError ||
            (isAppErrorLike(error) && error.status < 500)) {
          return res.status(401).json(unavailable);
        }
        return res.status(503).json(temporary);
      }
    });
  app.use((_error: unknown, _req: express.Request, res: express.Response,
    _next: express.NextFunction) => res.status(400).json({ error: 'Invalid order request' }));
  return app;
};
