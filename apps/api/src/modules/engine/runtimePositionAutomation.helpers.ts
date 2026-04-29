import { PositionSide, TradeMarket, Exchange } from '@prisma/client';

import { resolveInheritedRuntimeExecutionContext } from './runtimeBotExecutionContext';
import { PositionManagementInput, PositionManagementState } from './positionManagement.types';

type RuntimeManagedPositionContext = {
  walletId: string | null;
  bot:
    | {
        walletId: string | null;
        wallet:
          | {
              exchange: Exchange;
              marketType: TradeMarket;
              baseCurrency: string;
              paperInitialBalance: number;
              mode: 'PAPER' | 'LIVE';
            }
          | null;
        symbolGroup:
          | {
              marketUniverse: {
                exchange: Exchange;
                marketType: TradeMarket;
                baseCurrency: string;
              } | null;
            }
          | null;
      }
    | null;
};

export const resolveInheritedPositionExecutionContext = (
  position: RuntimeManagedPositionContext
) =>
  resolveInheritedRuntimeExecutionContext({
    walletId: position.walletId ?? position.bot?.walletId ?? null,
    wallet: position.bot?.wallet,
    venueContext: position.bot?.symbolGroup?.marketUniverse,
  });

export const resolveDcaLevelCount = (input: PositionManagementInput) => {
  if (!input.dca?.enabled) return 0;
  if (Array.isArray(input.dca.levelPercents) && input.dca.levelPercents.length > 0) {
    return input.dca.levelPercents.length;
  }
  return Math.max(0, input.dca.maxAdds ?? 0);
};

export const estimateNextDcaAddedQuantity = (
  input: PositionManagementInput,
  state: PositionManagementState
) => {
  if (!input.dca?.enabled) return 0;
  const index = Math.max(0, state.currentAdds);
  const addFraction = input.dca.addSizeFractions?.[index] ?? input.dca.addSizeFraction ?? 0;
  if (!Number.isFinite(addFraction) || addFraction <= 0) return 0;
  return state.quantity * addFraction;
};

export const computePriceFromPercent = (
  side: PositionSide,
  entryPrice: number,
  pct: number,
  kind: 'tp' | 'sl',
  leverage = 1
) => {
  if (!Number.isFinite(entryPrice) || entryPrice <= 0 || pct <= 0) return undefined;
  const adjustedPct = pct / Math.max(1, leverage);
  if (kind === 'tp') {
    return side === 'LONG' ? entryPrice * (1 + adjustedPct) : entryPrice * (1 - adjustedPct);
  }
  return side === 'LONG' ? entryPrice * (1 - adjustedPct) : entryPrice * (1 + adjustedPct);
};
