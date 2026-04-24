import { BotMode, Exchange, TradeMarket } from '@prisma/client';
import { normalizeBaseCurrency } from '../../lib/symbols';

type RuntimeExecutionWalletContext = {
  mode: BotMode;
  exchange: Exchange;
  marketType: TradeMarket;
  baseCurrency: string;
  paperInitialBalance: number;
};

type RuntimeExecutionVenueContext = {
  exchange: Exchange;
  marketType: TradeMarket;
  baseCurrency: string;
};

export type InheritedRuntimeExecutionContext = {
  mode: 'PAPER' | 'LIVE';
  exchange: Exchange;
  marketType: TradeMarket;
  paperStartBalance: number;
  walletId: string | null;
};

export const resolveInheritedRuntimeExecutionContext = (input: {
  walletId?: string | null;
  wallet: RuntimeExecutionWalletContext | null | undefined;
  venueContext: RuntimeExecutionVenueContext | null | undefined;
}): InheritedRuntimeExecutionContext | null => {
  const wallet = input.wallet;
  const venueContext = input.venueContext;
  if (!wallet || !venueContext) return null;

  const sameVenue =
    wallet.exchange === venueContext.exchange &&
    wallet.marketType === venueContext.marketType &&
    normalizeBaseCurrency(wallet.baseCurrency) === normalizeBaseCurrency(venueContext.baseCurrency);
  if (!sameVenue) return null;

  return {
    mode: wallet.mode as 'PAPER' | 'LIVE',
    exchange: venueContext.exchange,
    marketType: venueContext.marketType,
    paperStartBalance: Number.isFinite(wallet.paperInitialBalance)
      ? Math.max(0, wallet.paperInitialBalance)
      : 10_000,
    walletId: input.walletId ?? null,
  };
};
