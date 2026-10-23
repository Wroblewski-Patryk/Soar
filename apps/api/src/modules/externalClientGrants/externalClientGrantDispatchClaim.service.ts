import { PrismaClient } from '@prisma/client';
import { getExchangeSymbolRules } from '../exchange/exchangeSymbolRules.service';
import { admitBoundExternalClientGrantSubmissionInternal } from './externalClientGrantReservation.service';

// Foundation only: records one durable claim without returning a submit token.
// Existing admission or claim remains lookup-only after a restart.
export const claimBoundExternalClientGrantDispatch = (
  input: { reservationId: string; secret: string },
  deps: { db?: PrismaClient; getSymbolRules?: typeof getExchangeSymbolRules } = {},
) => admitBoundExternalClientGrantSubmissionInternal(input, deps, true);
