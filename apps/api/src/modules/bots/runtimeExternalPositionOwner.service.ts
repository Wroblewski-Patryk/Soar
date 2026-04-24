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
  });

  const canonicalCandidatesBySymbol = new Map<string, Map<string, Candidate>>();

  for (const bot of bots) {
    const candidate = {
      botId: bot.id,
      walletId: bot.walletId,
    };

    if (bot.symbolGroup) {
      for (const symbol of resolveEffectiveSymbolGroupSymbols({
        symbols: bot.symbolGroup.symbols,
        marketUniverse: bot.symbolGroup.marketUniverse,
      })) {
        addCandidate(canonicalCandidatesBySymbol, symbol, candidate);
      }
    }
  }

  return buildOwnershipMap(canonicalCandidatesBySymbol);
};
