import { TradeMarket } from '@prisma/client';

const EXTERNAL_POSITION_REOPEN_DISCONTINUITY_GRACE_MS = 60 * 1000;

type ParsedImportedExternalPositionId = {
  apiKeyId: string;
  marketType: TradeMarket | null;
  symbol: string;
  side: 'LONG' | 'SHORT' | null;
};

export const normalizeSymbol = (symbol: string) => {
  const trimmed = symbol.trim().toUpperCase();
  if (!trimmed) return '';
  if (trimmed.includes('/') && trimmed.includes(':')) {
    const [base, quoteAndSettle] = trimmed.split('/');
    const [, settle] = quoteAndSettle.split(':');
    if (base && settle) return `${base}${settle}`;
  }
  if (trimmed.includes('/')) {
    const [base, quote] = trimmed.split('/');
    if (base && quote) return `${base}${quote}`;
  }
  return trimmed.replace(/[/:]/g, '');
};

export const toPositionSide = (
  side: string | null,
  contracts: number
): 'LONG' | 'SHORT' | null => {
  const normalized = (side ?? '').trim().toLowerCase();
  if (normalized === 'long') return 'LONG';
  if (normalized === 'short') return 'SHORT';
  if (contracts > 0) return 'LONG';
  if (contracts < 0) return 'SHORT';
  return null;
};

export const toOrderSide = (side: string | null): 'BUY' | 'SELL' | null => {
  const normalized = (side ?? '').trim().toLowerCase();
  if (normalized === 'buy') return 'BUY';
  if (normalized === 'sell') return 'SELL';
  return null;
};

export const toPositionSideFromOrderSide = (side: 'BUY' | 'SELL'): 'LONG' | 'SHORT' =>
  side === 'BUY' ? 'LONG' : 'SHORT';

export const buildPositionIdentity = (symbol: string, side: 'LONG' | 'SHORT') =>
  `${normalizeSymbol(symbol)}:${side}`;

export const buildImportedExternalPositionId = (params: {
  apiKeyId: string;
  marketType?: TradeMarket | null;
  symbol: string;
  side: 'LONG' | 'SHORT';
}) => {
  const apiKeyId = params.apiKeyId.trim();
  const symbol = normalizeSymbol(params.symbol);
  return params.marketType
    ? `${apiKeyId}:${params.marketType}:${symbol}:${params.side}`
    : `${apiKeyId}:${symbol}:${params.side}`;
};

export const buildLegacyImportedExternalPositionId = (params: {
  apiKeyId: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
}) =>
  buildImportedExternalPositionId({
    apiKeyId: params.apiKeyId,
    symbol: params.symbol,
    side: params.side,
  });

export const buildImportedExternalPositionIds = (params: {
  apiKeyId: string;
  marketType?: TradeMarket | null;
  symbol: string;
  side: 'LONG' | 'SHORT';
}) => ({
  externalId: buildImportedExternalPositionId(params),
  legacyExternalId: buildLegacyImportedExternalPositionId(params),
});

export const buildImportedExternalPositionMarketPrefix = (params: {
  apiKeyId: string;
  marketType: TradeMarket;
}) => `${params.apiKeyId.trim()}:${params.marketType}:`;

export const buildLegacyImportedExternalPositionSymbolPrefix = (params: {
  apiKeyId: string;
  symbol: string;
}) => `${params.apiKeyId.trim()}:${normalizeSymbol(params.symbol)}:`;

export const parseImportedExternalPositionId = (
  externalId: string | null
): ParsedImportedExternalPositionId | null => {
  if (!externalId) return null;
  const parts = externalId.split(':');
  if (parts.length < 3) return null;
  const [apiKeyId, maybeMarketType, maybeSymbol, maybeSide] = parts;
  if (!apiKeyId?.trim()) return null;

  if ((maybeMarketType === 'FUTURES' || maybeMarketType === 'SPOT') && parts.length >= 4) {
    return {
      apiKeyId: apiKeyId.trim(),
      marketType: maybeMarketType,
      symbol: normalizeSymbol(maybeSymbol ?? ''),
      side: maybeSide === 'LONG' || maybeSide === 'SHORT' ? maybeSide : null,
    };
  }

  return {
    apiKeyId: apiKeyId.trim(),
    marketType: null,
    symbol: normalizeSymbol(maybeMarketType ?? ''),
    side: maybeSymbol === 'LONG' || maybeSymbol === 'SHORT' ? maybeSymbol : null,
  };
};

export const extractSymbolFromExternalId = (externalId: string | null) => {
  return parseImportedExternalPositionId(externalId)?.symbol ?? null;
};

export const shouldTreatAsLifecycleReplacement = (input: {
  candidateOpenedAt: Date;
  snapshotOpenedAt: Date | null;
}) => {
  if (!input.snapshotOpenedAt) return false;
  return (
    input.snapshotOpenedAt.getTime() - input.candidateOpenedAt.getTime() >
    EXTERNAL_POSITION_REOPEN_DISCONTINUITY_GRACE_MS
  );
};

export const normalizeImportedLeverage = (value: number | null | undefined) =>
  Number.isFinite(value) ? Math.max(1, Math.round(value!)) : 1;

export const resolveRecoveredContinuityState = (input: {
  ownershipStatus: 'OWNED' | 'AMBIGUOUS' | 'MANUAL_ONLY' | 'UNOWNED';
  existingBotId: string | null | undefined;
}) => {
  if (input.ownershipStatus === 'OWNED') {
    return 'CONFIRMED' as const;
  }
  if (input.existingBotId) {
    return 'RECOVERED_UNACTIONABLE' as const;
  }
  return 'CONFIRMED' as const;
};

export const resolveRecoveredManagementMode = (input: {
  ownershipStatus: 'OWNED' | 'AMBIGUOUS' | 'MANUAL_ONLY' | 'UNOWNED';
  existingBotId: string | null | undefined;
}) => {
  if (input.ownershipStatus === 'OWNED') {
    return 'BOT_MANAGED' as const;
  }
  if (input.existingBotId) {
    return 'BOT_MANAGED' as const;
  }
  return 'MANUAL_MANAGED' as const;
};

export const toOrderType = (
  type: string | null
): 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT' | 'TAKE_PROFIT' | 'TRAILING' => {
  const normalized = (type ?? '').trim().toLowerCase();
  if (normalized.includes('market') && normalized.includes('stop')) return 'STOP';
  if (normalized.includes('stop') && normalized.includes('limit')) return 'STOP_LIMIT';
  if (normalized.includes('stop')) return 'STOP';
  if (normalized.includes('take') && normalized.includes('profit')) return 'TAKE_PROFIT';
  if (normalized.includes('trail')) return 'TRAILING';
  if (normalized.includes('market')) return 'MARKET';
  return 'LIMIT';
};

export const toOpenOrderStatus = (status: string | null): 'OPEN' | 'PARTIALLY_FILLED' | null => {
  const normalized = (status ?? '').trim().toLowerCase();
  if (!normalized) return null;
  if (normalized.includes('partial')) return 'PARTIALLY_FILLED';
  if (
    normalized.includes('open') ||
    normalized.includes('new') ||
    normalized.includes('working')
  ) {
    return 'OPEN';
  }
  return null;
};

export const resolveCanonicalEntryPrice = (
  position: Pick<{ entryPrice: number | null; markPrice: number | null }, 'entryPrice' | 'markPrice'>
) => {
  const entryPrice =
    typeof position.entryPrice === 'number' && Number.isFinite(position.entryPrice)
      ? position.entryPrice
      : null;
  if (entryPrice == null || entryPrice <= 0) return null;
  return entryPrice;
};
