import { prisma } from '../../prisma/client';
import { resolveEffectiveSymbolGroupSymbols } from './runtimeSymbolUniverse.service';

export type ExternalPositionOwnership =
  | {
      status: 'OWNED';
      botId: string;
      walletId: string | null;
    }
  | {
      status: 'AMBIGUOUS';
      botId: null;
      walletId: null;
    };

type Candidate = {
  botId: string;
  walletId: string | null;
};

const addCandidate = (
  candidateBySymbol: Map<string, Map<string, Candidate>>,
  symbol: string,
  candidate: Candidate
) => {
  const byBot = candidateBySymbol.get(symbol) ?? new Map<string, Candidate>();
  if (!byBot.has(candidate.botId)) {
    byBot.set(candidate.botId, candidate);
  }
  candidateBySymbol.set(symbol, byBot);
};

const buildOwnershipMap = (
  candidateBySymbol: Map<string, Map<string, Candidate>>
): Map<string, ExternalPositionOwnership> => {
  const ownershipBySymbol = new Map<string, ExternalPositionOwnership>();
  for (const [symbol, byBot] of candidateBySymbol.entries()) {
    if (byBot.size === 1) {
      const owner = [...byBot.values()][0];
      ownershipBySymbol.set(symbol, {
        status: 'OWNED',
        botId: owner.botId,
        walletId: owner.walletId,
      });
      continue;
    }
    if (byBot.size > 1) {
      ownershipBySymbol.set(symbol, {
        status: 'AMBIGUOUS',
        botId: null,
        walletId: null,
      });
    }
  }
  return ownershipBySymbol;
};

export const resolveExternalPositionOwnerBySymbol = async (
  userId: string,
  mode: 'LIVE' | 'PAPER' = 'LIVE'
): Promise<Map<string, ExternalPositionOwnership>> => {
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
      walletId: true,
      botMarketGroups: {
        where: {
          isEnabled: true,
          lifecycleStatus: { in: ['ACTIVE', 'PAUSED'] },
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
      botStrategies: {
        where: { isEnabled: true },
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
      marketGroupStrategyLinks: {
        where: { isEnabled: true },
        select: {
          botMarketGroup: {
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
      },
    },
  });

  const canonicalCandidatesBySymbol = new Map<string, Map<string, Candidate>>();
  const legacyCandidatesBySymbol = new Map<string, Map<string, Candidate>>();

  for (const bot of bots) {
    const candidate = {
      botId: bot.id,
      walletId: bot.walletId,
    };

    for (const configuredGroup of bot.botMarketGroups) {
      for (const symbol of resolveEffectiveSymbolGroupSymbols({
        symbols: configuredGroup.symbolGroup.symbols,
        marketUniverse: configuredGroup.symbolGroup.marketUniverse,
      })) {
        addCandidate(canonicalCandidatesBySymbol, symbol, candidate);
      }
    }

    for (const configuredLink of bot.marketGroupStrategyLinks) {
      for (const symbol of resolveEffectiveSymbolGroupSymbols({
        symbols: configuredLink.botMarketGroup.symbolGroup.symbols,
        marketUniverse: configuredLink.botMarketGroup.symbolGroup.marketUniverse,
      })) {
        addCandidate(canonicalCandidatesBySymbol, symbol, candidate);
      }
    }

    for (const legacyStrategy of bot.botStrategies) {
      for (const symbol of resolveEffectiveSymbolGroupSymbols({
        symbols: legacyStrategy.symbolGroup.symbols,
        marketUniverse: legacyStrategy.symbolGroup.marketUniverse,
      })) {
        addCandidate(legacyCandidatesBySymbol, symbol, candidate);
      }
    }
  }

  const ownershipBySymbol = buildOwnershipMap(canonicalCandidatesBySymbol);
  const legacyOwnershipBySymbol = buildOwnershipMap(legacyCandidatesBySymbol);

  for (const [symbol, ownership] of legacyOwnershipBySymbol.entries()) {
    if (!ownershipBySymbol.has(symbol)) {
      ownershipBySymbol.set(symbol, ownership);
    }
  }

  return ownershipBySymbol;
};
