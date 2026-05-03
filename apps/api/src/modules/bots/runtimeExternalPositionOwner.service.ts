import { prisma } from '../../prisma/client';
import { resolveEffectiveSymbolGroupSymbols } from './runtimeSymbolUniverse.service';

export type ExternalPositionOwnership =
  | {
      status: 'OWNED';
      botId: string;
      walletId: string;
    }
  | {
      status: 'AMBIGUOUS';
      botId: null;
      walletId: null;
    }
  | {
      status: 'MANUAL_ONLY';
      botId: null;
      walletId: null;
    }
  | {
      status: 'UNOWNED';
      botId: null;
      walletId: null;
    };

type Candidate = {
  botId: string;
  walletId: string;
  apiKeyId: string;
  managed: boolean;
};

type SymbolGroupScope = {
  symbols: string[];
  marketUniverse: {
    exchange?: unknown;
    marketType?: unknown;
    baseCurrency?: string | null;
    filterRules?: unknown;
    whitelist?: string[] | null;
    blacklist?: string[] | null;
  } | null;
};

const addCandidate = (
  candidateByExternalOwnershipKey: Map<string, Map<string, Candidate>>,
  ownershipKey: string,
  candidate: Candidate
) => {
  const byBot =
    candidateByExternalOwnershipKey.get(ownershipKey) ?? new Map<string, Candidate>();
  if (!byBot.has(candidate.botId)) {
    byBot.set(candidate.botId, candidate);
  }
  candidateByExternalOwnershipKey.set(ownershipKey, byBot);
};

export type ExternalPositionOwnershipIndex = Map<string, ExternalPositionOwnership>;

const buildOwnershipIndex = (
  candidateByExternalOwnershipKey: Map<string, Map<string, Candidate>>
): ExternalPositionOwnershipIndex => {
  const ownershipByExternalKey = new Map<string, ExternalPositionOwnership>();
  for (const [ownershipKey, byBot] of candidateByExternalOwnershipKey.entries()) {
    const candidates = [...byBot.values()];
    const managedCandidates = candidates.filter((candidate) => candidate.managed);

    if (managedCandidates.length === 1) {
      const owner = managedCandidates[0];
      ownershipByExternalKey.set(ownershipKey, {
        status: 'OWNED',
        botId: owner.botId,
        walletId: owner.walletId,
      });
      continue;
    }

    if (managedCandidates.length > 1) {
      ownershipByExternalKey.set(ownershipKey, {
        status: 'AMBIGUOUS',
        botId: null,
        walletId: null,
      });
      continue;
    }

    if (candidates.length > 0) {
      ownershipByExternalKey.set(ownershipKey, {
        status: 'MANUAL_ONLY',
        botId: null,
        walletId: null,
      });
    }
  }
  return ownershipByExternalKey;
};

export const buildExternalPositionOwnershipKey = (params: {
  apiKeyId: string;
  symbol: string;
}) => `${params.apiKeyId.trim()}:${params.symbol.trim().toUpperCase()}`;

export const parseApiKeyIdFromExternalPositionId = (externalId: string | null): string | null => {
  if (!externalId) return null;
  const [apiKeyId] = externalId.split(':');
  if (!apiKeyId || apiKeyId.trim().length === 0) return null;
  return apiKeyId.trim();
};

export const getExternalPositionOwnership = (
  ownershipIndex: ExternalPositionOwnershipIndex,
  params: {
    apiKeyId: string | null;
    symbol: string;
  }
): ExternalPositionOwnership => {
  if (!params.apiKeyId) {
    return {
      status: 'UNOWNED',
      botId: null,
      walletId: null,
    };
  }

  return (
    ownershipIndex.get(
      buildExternalPositionOwnershipKey({
        apiKeyId: params.apiKeyId,
        symbol: params.symbol,
      })
    ) ?? {
      status: 'UNOWNED',
      botId: null,
      walletId: null,
    }
  );
};

export const listOwnedExternalSymbolsForBot = (
  ownershipIndex: ExternalPositionOwnershipIndex,
  params: {
    apiKeyId: string | null;
    botId: string;
    walletId: string | null;
  }
) => {
  if (!params.apiKeyId || !params.walletId) return [];

  const prefix = `${params.apiKeyId.trim()}:`;
  const ownedSymbols: string[] = [];
  for (const [ownershipKey, ownership] of ownershipIndex.entries()) {
    if (!ownershipKey.startsWith(prefix)) continue;
    if (ownership.status !== 'OWNED') continue;
    if (ownership.botId !== params.botId || ownership.walletId !== params.walletId) continue;
    ownedSymbols.push(ownershipKey.slice(prefix.length));
  }
  return ownedSymbols;
};

export const resolveExternalPositionOwnershipIndex = async (
  userId: string,
  mode: 'LIVE' | 'PAPER' = 'LIVE'
): Promise<ExternalPositionOwnershipIndex> => {
  const baseBotWhere =
    mode === 'LIVE'
      ? {
          userId,
          mode: 'LIVE' as const,
          isActive: true,
          liveOptIn: true,
        }
      : {
          userId,
          mode: 'PAPER' as const,
        };

  const bots = await prisma.bot.findMany({
    where: baseBotWhere,
    select: {
      id: true,
      manageExternalPositions: true,
      walletId: true,
      apiKeyId: true,
      wallet: {
        select: {
          apiKeyId: true,
        },
      },
      symbolGroup: {
        select: {
          symbols: true,
          marketUniverse: {
            select: {
              exchange: true,
              marketType: true,
              baseCurrency: true,
              filterRules: true,
              whitelist: true,
              blacklist: true,
            },
          },
        },
      },
      botMarketGroups: {
        where: {
          isEnabled: true,
          lifecycleStatus: 'ACTIVE',
        },
        select: {
          symbolGroup: {
            select: {
              symbols: true,
              marketUniverse: {
                select: {
                  exchange: true,
                  marketType: true,
                  baseCurrency: true,
                  filterRules: true,
                  whitelist: true,
                  blacklist: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const candidateByExternalOwnershipKey = new Map<string, Map<string, Candidate>>();

  for (const bot of bots) {
    const effectiveApiKeyId =
      mode === 'LIVE' ? (bot.wallet?.apiKeyId ?? bot.apiKeyId) : (bot.apiKeyId ?? 'paper');

    if (mode === 'LIVE' && !effectiveApiKeyId) {
      continue;
    }
    if (!bot.walletId) {
      continue;
    }

    const candidate = {
      botId: bot.id,
      walletId: bot.walletId,
      apiKeyId: effectiveApiKeyId ?? 'paper',
      managed: mode === 'LIVE' ? bot.manageExternalPositions === true : true,
    };

    const activeCanonicalScopes = (bot.botMarketGroups ?? []).map((group) => group.symbolGroup);
    const symbolScopes: SymbolGroupScope[] =
      activeCanonicalScopes.length > 0
        ? activeCanonicalScopes
        : bot.symbolGroup
          ? [bot.symbolGroup]
          : [];
    const resolvedSymbols = new Set<string>();
    for (const scope of symbolScopes) {
      for (const symbol of resolveEffectiveSymbolGroupSymbols({
        symbols: scope.symbols,
        marketUniverse: scope.marketUniverse,
      })) {
        resolvedSymbols.add(symbol);
      }
    }

    for (const symbol of resolvedSymbols) {
      addCandidate(
        candidateByExternalOwnershipKey,
        buildExternalPositionOwnershipKey({
          apiKeyId: candidate.apiKeyId,
          symbol,
        }),
        candidate
      );
    }
  }

  return buildOwnershipIndex(candidateByExternalOwnershipKey);
};

export const resolveExternalPositionOwnerBySymbol = async (
  userId: string,
  mode: 'LIVE' | 'PAPER' = 'LIVE'
): Promise<Map<string, ExternalPositionOwnership>> => {
  const ownershipIndex = await resolveExternalPositionOwnershipIndex(userId, mode);
  const ownershipBySymbol = new Map<string, ExternalPositionOwnership>();

  for (const [ownershipKey, ownership] of ownershipIndex.entries()) {
    const symbol = ownershipKey.split(':').slice(1).join(':');
    const current = ownershipBySymbol.get(symbol);
    if (!current) {
      ownershipBySymbol.set(symbol, ownership);
      continue;
    }
    if (current.status === 'OWNED' && ownership.status === 'OWNED') {
      ownershipBySymbol.set(symbol, {
        status: 'AMBIGUOUS',
        botId: null,
        walletId: null,
      });
      continue;
    }
    if (current.status === 'AMBIGUOUS') continue;
    if (ownership.status === 'OWNED') {
      ownershipBySymbol.set(symbol, ownership);
      continue;
    }
    if (current.status === 'MANUAL_ONLY' && ownership.status === 'UNOWNED') continue;
    ownershipBySymbol.set(symbol, current);
  }

  return ownershipBySymbol;
};
