import { createHash } from 'node:crypto';
import { LiveOrderIntent, Prisma } from '@prisma/client';
import { fingerprintLiveOrderIntentPayload, type LiveOrderPayload } from '../orders/orders.liveIntent.service';
import { LIVE_EXECUTION_PAUSE_LOCK_KEY } from '../orders/liveExecutionPause.service';
import { resolveDispatchClaimKey } from './externalClientGrantDispatchClaimKey';
import type { DelegatedMockScenario } from './externalClientGrantMockTransport';
import { deny, hasAtomicIntentBinding } from './externalClientGrantReservation.helpers';
import type { GrantLimitCommand } from './externalClientGrantReservation.service';

type Tx = Prisma.TransactionClient;
type Input = { grantId: string; reservationId: string; command: GrantLimitCommand;
  allowSubmitted?: true };

const lock = async (tx: Tx, table: 'ExternalClientGrantReservation' | 'LiveOrderIntent' |
  'LiveCreateOrderSubmission', column: 'id' | 'clientOrderId' | 'reservationId', value: string) => {
  // Table and column names come only from the fixed choices above, never caller input.
  const rows = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`
    SELECT "id" FROM ${Prisma.raw(`"${table}"`)}
    WHERE ${Prisma.raw(`"${column}"`)} = ${value} FOR SHARE
  `);
  return rows.length === 1;
};

export const intentMatchesCommand = (payload: unknown, command: GrantLimitCommand) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;
  const raw = payload as Record<string, unknown>;
  const quantity = typeof raw.quantity === 'number' || typeof raw.quantity === 'string'
    ? String(raw.quantity) : '';
  const price = typeof raw.price === 'number' || typeof raw.price === 'string'
    ? String(raw.price) : '';
  try {
    return raw.botId === command.botId && (raw.walletId ?? null) === command.walletId &&
      (raw.strategyId ?? null) === command.strategyId &&
      (raw.positionId ?? null) === command.positionId && raw.symbol === command.symbol &&
      raw.side === command.side && raw.type === command.type &&
      (raw.reduceOnly ?? false) === command.reduceOnly &&
      new Prisma.Decimal(quantity).eq(command.quantity) &&
      new Prisma.Decimal(price).eq(command.limitPrice);
  } catch { return false; }
};

export const intentMatchesCommandAndScope = (intent: LiveOrderIntent, command: GrantLimitCommand) =>
  intent.userId === command.userId && intent.exchange === command.exchange &&
  intent.marketType === command.marketType && intent.symbol === command.symbol &&
  intent.clientOrderId === command.clientOrderId && intentMatchesCommand(intent.payload, command);

// Lock grant first, then the shared pause key and linked rows before reading.
// This verifies a durable claim but grants no venue capability.
export const verifyDispatchClaimInTransaction = async (tx: Tx, input: Input) => {
  const grantRows = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT "id" FROM "ExternalClientGrant" WHERE "id" = ${input.grantId} FOR UPDATE`;
  if (grantRows.length !== 1) return { markerId: null, verified: false } as const;
  const grant = await tx.externalClientGrant.findUnique({ where: { id: input.grantId } });
  if (!grant) return { markerId: null, verified: false } as const;
  await tx.$queryRaw`SELECT 1 AS locked FROM (SELECT pg_advisory_xact_lock_shared(${LIVE_EXECUTION_PAUSE_LOCK_KEY})) AS acquired`;
  if (!await lock(tx, 'ExternalClientGrantReservation', 'id', input.reservationId)) {
    return { markerId: null, verified: false } as const;
  }
  const reservation = await tx.externalClientGrantReservation.findUnique({ where: { id: input.reservationId } });
  if (!reservation) return { markerId: null, verified: false } as const;
  const markerLocked = await lock(tx, 'LiveCreateOrderSubmission', 'reservationId', reservation.id);
  const marker = markerLocked ? await tx.liveCreateOrderSubmission.findUnique({
    where: { reservationId: reservation.id } }) : null;
  if (!marker) return { markerId: null, verified: false } as const;
  const unknown = { markerId: marker.id, verified: false } as const;
  if (!await lock(tx, 'LiveOrderIntent', 'clientOrderId', reservation.clientOrderId)) return unknown;
  const intent = await tx.liveOrderIntent.findUnique({ where: { clientOrderId: reservation.clientOrderId } });
  const command = input.command;
  const marketType = command.marketType === 'SPOT' ? 'spot'
    : command.exchange === 'BINANCE' ? 'future' : 'swap';
  const commandHash = createHash('sha256').update(JSON.stringify(command), 'utf8').digest('hex');
  if (!intent || (reservation.state !== 'SUBMISSION_UNCERTAIN' &&
      !(input.allowSubmitted && reservation.state === 'SUBMITTED')) || !reservation.dispatchStartedAt ||
      reservation.grantId !== grant.id || reservation.clientOrderId !== command.clientOrderId ||
      reservation.commandHash !== commandHash ||
      grant.revokedAt || (!input.allowSubmitted && grant.expiresAt <= new Date()) ||
      grant.userId !== command.userId ||
      grant.botId !== command.botId || grant.exchange !== command.exchange ||
      grant.marketType !== command.marketType || grant.symbol !== command.symbol ||
      grant.action !== command.action || marker.grantId !== grant.id ||
      marker.reservationId !== reservation.id || marker.intentId !== intent.id ||
      marker.clientOrderId !== command.clientOrderId || marker.exchangeId !== command.exchange ||
      marker.symbol !== command.symbol || marker.marketType !== marketType ||
      marker.reduceOnly !== command.reduceOnly || !marker.dispatchClaimedAt ||
      marker.dispatchBotId !== command.botId || marker.dispatchCommandHash !== commandHash ||
      marker.dispatchIntentHash !== intent.payloadHash || !marker.dispatchApiKeyId ||
      !marker.dispatchApiKeyUpdatedAt || intent.userId !== command.userId ||
      intent.exchange !== command.exchange || intent.marketType !== command.marketType ||
      !intentMatchesCommandAndScope(intent, command)) return unknown;
  if (reservation.boundApiKeyId != null || reservation.boundApiKeyCredentialVersion != null) {
    if (reservation.boundApiKeyId !== marker.dispatchApiKeyId ||
        reservation.boundApiKeyCredentialVersion !== marker.dispatchApiKeyCredentialVersion) return unknown;
  }
  const payload = intent.payload as Record<string, unknown>;
  if (payload.mode !== 'LIVE' || payload.riskAck !== true ||
      payload.clientOrderId !== command.clientOrderId ||
      Object.keys(payload).some((key) => !['botId', 'walletId', 'strategyId', 'positionId',
        'symbol', 'side', 'type', 'quantity', 'price', 'reduceOnly', 'mode', 'riskAck',
        'clientOrderId'].includes(key))) return unknown;
  await tx.$queryRaw`SELECT "id" FROM "Log"
    WHERE "entityType" = 'ExternalClientGrantReservation'
      AND "entityId" = ${reservation.id}
      AND "action" = 'EXTERNAL_CLIENT_GRANT_RESERVED' FOR SHARE`;
  if (!await hasAtomicIntentBinding(tx, reservation.id, intent.id)) return unknown;
  const expectedIntentHash = fingerprintLiveOrderIntentPayload(command.userId, {
    id: command.botId, exchange: command.exchange, marketType: command.marketType,
    positionMode: 'ONE_WAY', apiKeyId: null, walletId: command.walletId,
  }, intent.payload as LiveOrderPayload);
  if (intent.payloadHash !== expectedIntentHash) return unknown;
  const key = await resolveDispatchClaimKey(tx, command, true);
  if (!key || key.id !== marker.dispatchApiKeyId ||
      (marker.dispatchApiKeyCredentialVersion === null
        ? key.updatedAt.getTime() !== marker.dispatchApiKeyUpdatedAt.getTime()
        : key.credentialVersion !== marker.dispatchApiKeyCredentialVersion)) return unknown;
  return { markerId: marker.id, verified: true } as const;
};

// The start audit and its triggers must leave the captured claim unchanged.
// This transaction commits before the fixed local transport runs.
export const recordVerifiedMockTransportStart = async (tx: Tx, input: Omit<Input, 'allowSubmitted'> & {
  markerId: string; scenario: DelegatedMockScenario,
}) => {
  const verify = async () => {
    const proof = await verifyDispatchClaimInTransaction(tx, {
      grantId: input.grantId, reservationId: input.reservationId, command: input.command,
    });
    if (!proof.verified || proof.markerId !== input.markerId) return deny('DISPATCH_CLAIM_UNVERIFIED');
  };
  await verify();
  await tx.log.create({ data: {
    userId: input.command.userId, botId: input.command.botId,
    source: 'external_client_grant', actor: 'SYSTEM',
    action: 'EXTERNAL_CLIENT_GRANT_MOCK_TRANSPORT_STARTED', level: 'INFO',
    message: 'Fixed delegated mock transport entered',
    entityType: 'ExternalClientGrantReservation', entityId: input.reservationId,
    metadata: { scenario: input.scenario, clientOrderId: input.command.clientOrderId },
  } });
  await tx.$executeRaw`SET CONSTRAINTS ALL IMMEDIATE`;
  await verify();
};
