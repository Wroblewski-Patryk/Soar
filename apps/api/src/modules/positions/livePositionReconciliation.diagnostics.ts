import { TradeMarket } from '@prisma/client';
import {
  ReconciliationDiagnosticSummary,
  ReconciliationPositionDiagnostic,
  ReconciliationPositionDiagnosticOutcome,
} from './livePositionReconciliation.types';

const DIAGNOSTIC_OUTCOMES: ReconciliationPositionDiagnosticOutcome[] = [
  'CREATED',
  'UPDATED',
  'SKIPPED_ZERO_SIZE',
  'SKIPPED_UNRESOLVED_SIDE',
  'SKIPPED_UNRESOLVED_SYMBOL',
  'SKIPPED_MISSING_ENTRY_TRUTH',
];

export const emptyReconciliationDiagnosticSummary = (): ReconciliationDiagnosticSummary =>
  DIAGNOSTIC_OUTCOMES.reduce(
    (summary, outcome) => {
      summary[outcome] = 0;
      return summary;
    },
    {} as ReconciliationDiagnosticSummary
  );

export const summarizeReconciliationDiagnostics = (
  diagnostics: ReconciliationPositionDiagnostic[]
): ReconciliationDiagnosticSummary => {
  const summary = emptyReconciliationDiagnosticSummary();
  for (const diagnostic of diagnostics) {
    summary[diagnostic.outcome] += 1;
  }
  return summary;
};

export type BuildReconciliationPositionDiagnosticInput = {
  apiKeyId: string;
  userId: string;
  marketType: TradeMarket;
  symbol: string | null;
  side: 'LONG' | 'SHORT' | null;
  outcome: ReconciliationPositionDiagnosticOutcome;
  ownershipStatus?: 'OWNED' | 'AMBIGUOUS' | 'MANUAL_ONLY' | 'UNOWNED' | null;
  managementMode?: 'BOT_MANAGED' | 'MANUAL_MANAGED' | null;
  syncState?: 'IN_SYNC' | 'DRIFT' | null;
  continuityState?:
    | 'CONFIRMED'
    | 'RECOVERING'
    | 'RECOVERED_UNACTIONABLE'
    | 'EXTERNAL_CLOSE_CONFIRMED'
    | 'REPAIR_ONLY_CLEANUP'
    | null;
  botId?: string | null;
  walletId?: string | null;
  strategyId?: string | null;
  reason?: string | null;
};

export type ReconciliationPositionDiagnosticInput = Omit<
  BuildReconciliationPositionDiagnosticInput,
  'apiKeyId' | 'userId' | 'marketType'
>;

export const buildReconciliationPositionDiagnostic = (
  input: BuildReconciliationPositionDiagnosticInput
): ReconciliationPositionDiagnostic => ({
  apiKeyId: input.apiKeyId,
  userId: input.userId,
  marketType: input.marketType,
  symbol: input.symbol,
  side: input.side,
  outcome: input.outcome,
  ownershipStatus: input.ownershipStatus ?? null,
  managementMode: input.managementMode ?? null,
  syncState: input.syncState ?? null,
  continuityState: input.continuityState ?? null,
  botId: input.botId ?? null,
  walletId: input.walletId ?? null,
  strategyId: input.strategyId ?? null,
  botVisible:
    input.managementMode === 'BOT_MANAGED' &&
    typeof input.botId === 'string' &&
    input.botId.length > 0,
  reason: input.reason ?? null,
});

export const shouldTriggerOwnedSyncedPositionAutomation = (input: {
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  continuityState:
    | 'CONFIRMED'
    | 'RECOVERING'
    | 'RECOVERED_UNACTIONABLE'
    | 'EXTERNAL_CLOSE_CONFIRMED'
    | 'REPAIR_ONLY_CLEANUP';
  markPrice: number | null;
}) =>
  input.managementMode === 'BOT_MANAGED' &&
  input.continuityState === 'CONFIRMED' &&
  typeof input.markPrice === 'number' &&
  Number.isFinite(input.markPrice) &&
  input.markPrice > 0;
