import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { normalizeBaseCurrency } from '../../lib/symbols';
import {
  PreTradeAnalysisInput,
  PreTradeAnalysisInputSchema,
  PreTradeBotExecutionConfig,
  PreTradeDecision,
} from './preTrade.types';
import { evaluatePreTradeRiskReasons } from './preTradeRisk.service';
import { runtimeMetricsService } from './runtimeMetrics.service';
import { resolveCanonicalRuntimeVenueContext } from './runtimeBotExecutionContext';
import {
  getExternalPositionOwnership,
  listOwnedExternalSymbolsForBot,
  resolveExternalPositionOwnershipIndex,
} from '../bots/runtimeExternalPositionOwner.service';
import {
  buildImportedExternalPositionMarketPrefix,
  buildLegacyImportedExternalPositionSymbolPrefix,
} from '../positions/livePositionReconciliation.helpers';

export interface PositionReadStore {
  countOpenByUser(userId: string): Promise<number>;
  countOpenByBot(userId: string, botId: string, mode: 'PAPER' | 'LIVE'): Promise<number>;
  hasOpenPositionOnSymbol(input: {
    userId: string;
    symbol: string;
    botId?: string;
    mode: 'PAPER' | 'LIVE';
  }): Promise<boolean>;
}

type PreTradeAuditEntry = {
  userId: string;
  botId?: string;
  action: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  source: string;
  message: string;
  category: string;
  entityType?: string;
  entityId?: string;
  metadata: Prisma.InputJsonValue;
};

export interface BotReadStore {
  getBotExecutionConfig(userId: string, botId: string): Promise<PreTradeBotExecutionConfig | null>;
}

export interface AuditLogWriter {
  write(entry: PreTradeAuditEntry): Promise<void>;
}

type PreTradeReadStore = PositionReadStore & BotReadStore;

type PreTradeCountCacheEntry = {
  value: number;
  expiresAtMs: number;
};

const preTradeOpenPositionCountCacheTtlMs = Math.max(
  0,
  Number.parseInt(process.env.PRETRADE_OPEN_POSITION_COUNT_CACHE_TTL_MS ?? '1500', 10)
);
const preTradeUserOpenCountCache = new Map<string, PreTradeCountCacheEntry>();
const preTradeBotOpenCountCache = new Map<string, PreTradeCountCacheEntry>();

const buildPreTradeUserCountKey = (userId: string) => userId;
const buildPreTradeBotCountKey = (userId: string, botId: string, mode: 'PAPER' | 'LIVE') =>
  `${userId}|${botId}|${mode}`;

const resolveCachedPreTradeCount = async (
  cache: Map<string, PreTradeCountCacheEntry>,
  key: string,
  loader: () => Promise<number>
) => {
  if (preTradeOpenPositionCountCacheTtlMs <= 0) {
    return loader();
  }

  const nowMs = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expiresAtMs > nowMs) {
    return cached.value;
  }
  if (cached) {
    cache.delete(key);
  }

  const value = await loader();
  cache.set(key, {
    value,
    expiresAtMs: nowMs + preTradeOpenPositionCountCacheTtlMs,
  });
  return value;
};

const resolveCachedUserOpenPositions = (readStore: PositionReadStore, userId: string) =>
  resolveCachedPreTradeCount(preTradeUserOpenCountCache, buildPreTradeUserCountKey(userId), () =>
    readStore.countOpenByUser(userId)
  );

const resolveCachedBotOpenPositions = (
  readStore: PositionReadStore,
  userId: string,
  botId: string,
  mode: 'PAPER' | 'LIVE'
) =>
  resolveCachedPreTradeCount(
    preTradeBotOpenCountCache,
    buildPreTradeBotCountKey(userId, botId, mode),
    () => readStore.countOpenByBot(userId, botId, mode)
  );

export const invalidatePreTradeOpenPositionCountCache = (input?: { userId?: string; botId?: string }) => {
  if (!input?.userId && !input?.botId) {
    preTradeUserOpenCountCache.clear();
    preTradeBotOpenCountCache.clear();
    return;
  }

  if (input.userId) {
    preTradeUserOpenCountCache.delete(buildPreTradeUserCountKey(input.userId));
  }

  if (input.userId && input.botId) {
    preTradeBotOpenCountCache.delete(buildPreTradeBotCountKey(input.userId, input.botId, 'PAPER'));
    preTradeBotOpenCountCache.delete(buildPreTradeBotCountKey(input.userId, input.botId, 'LIVE'));
    return;
  }

  if (input.botId) {
    for (const cacheKey of preTradeBotOpenCountCache.keys()) {
      if (cacheKey.includes(`|${input.botId}|`)) {
        preTradeBotOpenCountCache.delete(cacheKey);
      }
    }
  }
};

class PrismaPreTradeReadStore implements PreTradeReadStore {
  async countOpenByUser(userId: string) {
    return prisma.position.count({
      where: { userId, status: 'OPEN' },
    });
  }

  private async getLiveBotExternalOwnershipScope(userId: string, botId: string) {
    const botScope = await prisma.bot.findFirst({
      where: { id: botId, userId },
      select: {
        walletId: true,
        apiKeyId: true,
        wallet: {
          select: {
            apiKeyId: true,
            marketType: true,
          },
        },
      },
    });
    const effectiveApiKeyId = botScope?.wallet?.apiKeyId ?? botScope?.apiKeyId ?? null;
    if (!botScope?.walletId || !effectiveApiKeyId) return null;

    const ownershipIndex = await resolveExternalPositionOwnershipIndex(userId, 'LIVE');
    return {
      walletId: botScope.walletId,
      effectiveApiKeyId,
      marketType: botScope.wallet?.marketType ?? 'FUTURES',
      ownershipIndex,
      ownedSymbols: listOwnedExternalSymbolsForBot(ownershipIndex, {
        apiKeyId: effectiveApiKeyId,
        marketType: botScope.wallet?.marketType ?? 'FUTURES',
        botId,
        walletId: botScope.walletId,
      }),
    };
  }

  async countOpenByBot(userId: string, botId: string, mode: 'PAPER' | 'LIVE') {
    const directCount = await prisma.position.count({
      where: { userId, botId, status: 'OPEN' },
    });
    if (mode !== 'LIVE') return directCount;

    const ownershipScope = await this.getLiveBotExternalOwnershipScope(userId, botId);
    if (!ownershipScope || ownershipScope.ownedSymbols.length === 0) return directCount;

    const importedOwnedCount = await prisma.position.count({
      where: {
        userId,
        botId: null,
        symbol: {
          in: ownershipScope.ownedSymbols,
        },
        status: 'OPEN',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        AND: [
          {
            OR: [
              { externalId: { startsWith: buildImportedExternalPositionMarketPrefix({ apiKeyId: ownershipScope.effectiveApiKeyId, marketType: ownershipScope.marketType }) } },
              ...ownershipScope.ownedSymbols.map((symbol) => ({
                externalId: { startsWith: buildLegacyImportedExternalPositionSymbolPrefix({ apiKeyId: ownershipScope.effectiveApiKeyId, symbol }) },
              })),
            ],
          },
          { OR: [{ walletId: ownershipScope.walletId }, { walletId: null }] },
        ],
      },
    });

    return directCount + importedOwnedCount;
  }

  async hasOpenPositionOnSymbol(input: {
    userId: string;
    symbol: string;
    botId?: string;
    mode: 'PAPER' | 'LIVE';
  }) {
    if (!input.botId) {
      const found = await prisma.position.findFirst({
        where: { userId: input.userId, symbol: input.symbol, status: 'OPEN' },
        select: { id: true },
      });
      return Boolean(found);
    }

    const directFound = await prisma.position.findFirst({
      where: { userId: input.userId, botId: input.botId, symbol: input.symbol, status: 'OPEN' },
      select: { id: true },
    });
    if (directFound) return true;
    if (input.mode !== 'LIVE') return false;

    const ownershipScope = await this.getLiveBotExternalOwnershipScope(input.userId, input.botId);
    if (!ownershipScope) return false;

    const ownership = getExternalPositionOwnership(ownershipScope.ownershipIndex, {
      apiKeyId: ownershipScope.effectiveApiKeyId,
      marketType: ownershipScope.marketType,
      symbol: input.symbol,
    });
    if (
      ownership.status !== 'OWNED' ||
      ownership.botId !== input.botId ||
      ownership.walletId !== ownershipScope.walletId
    ) {
      return false;
    }

    const importedFound = await prisma.position.findFirst({
      where: {
        userId: input.userId,
        botId: null,
        symbol: input.symbol,
        status: 'OPEN',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        AND: [
          {
            OR: [
              { externalId: { startsWith: buildImportedExternalPositionMarketPrefix({ apiKeyId: ownershipScope.effectiveApiKeyId, marketType: ownershipScope.marketType }) } },
              { externalId: { startsWith: buildLegacyImportedExternalPositionSymbolPrefix({ apiKeyId: ownershipScope.effectiveApiKeyId, symbol: input.symbol }) } },
            ],
          },
          { OR: [{ walletId: ownershipScope.walletId }, { walletId: null }] },
        ],
      },
      select: { id: true },
    });
    return Boolean(importedFound);
  }

  async getBotExecutionConfig(userId: string, botId: string) {
    const bot = await prisma.bot.findFirst({
      where: { id: botId, userId },
      select: {
        positionMode: true,
        liveOptIn: true,
        consentTextVersion: true,
        wallet: {
          select: {
            mode: true,
            exchange: true,
            marketType: true,
            baseCurrency: true,
          },
        },
        symbolGroup: {
          select: {
            marketUniverse: {
              select: {
                exchange: true,
                marketType: true,
                baseCurrency: true,
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
                marketUniverse: {
                  select: {
                    exchange: true,
                    marketType: true,
                    baseCurrency: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const wallet = bot?.wallet;
    const marketUniverse = resolveCanonicalRuntimeVenueContext(bot);
    if (!bot || !wallet || !marketUniverse) return null;
    if (
      wallet.exchange !== marketUniverse.exchange ||
      wallet.marketType !== marketUniverse.marketType ||
      normalizeBaseCurrency(wallet.baseCurrency) !== normalizeBaseCurrency(marketUniverse.baseCurrency)
    ) {
      return null;
    }
    return {
      mode: wallet.mode,
      marketType: marketUniverse.marketType,
      positionMode: bot.positionMode,
      liveOptIn: bot.liveOptIn,
      consentTextVersion: bot.consentTextVersion,
    };
  }
}

const defaultReadStore = new PrismaPreTradeReadStore();

class PrismaAuditLogWriter implements AuditLogWriter {
  async write(entry: PreTradeAuditEntry) {
    await prisma.log.create({
      data: {
        userId: entry.userId,
        botId: entry.botId,
        action: entry.action,
        level: entry.level,
        source: entry.source,
        message: entry.message,
        category: entry.category,
        entityType: entry.entityType,
        entityId: entry.entityId,
        metadata: entry.metadata,
      },
    });
  }
}

const defaultAuditLogWriter = new PrismaAuditLogWriter();

export const analyzePreTrade = async (
  input: PreTradeAnalysisInput,
  readStore: PreTradeReadStore = defaultReadStore,
  auditLogWriter: AuditLogWriter = defaultAuditLogWriter
): Promise<PreTradeDecision> => {
  return runtimeMetricsService.measurePreTradeLatency(async () => {
    const parsed = PreTradeAnalysisInputSchema.parse(input);

    const userOpenPositions = await resolveCachedUserOpenPositions(readStore, parsed.userId);
    const botOpenPositions = parsed.botId
      ? await resolveCachedBotOpenPositions(readStore, parsed.userId, parsed.botId, parsed.mode)
      : null;
    const hasOpenPositionOnSymbol = parsed.enforceOnePositionPerSymbol
      ? await readStore.hasOpenPositionOnSymbol({
          userId: parsed.userId,
          symbol: parsed.symbol,
          botId: parsed.botId,
          mode: parsed.mode,
        })
      : false;
    const botLiveConfig = parsed.botId
      ? await readStore.getBotExecutionConfig(parsed.userId, parsed.botId)
      : null;
    const reasons = evaluatePreTradeRiskReasons({
      parsed,
      userOpenPositions,
      botOpenPositions,
      hasOpenPositionOnSymbol,
      botLiveConfig,
    });

    const decision = {
      allowed: reasons.length === 0,
      reasons,
      metrics: {
        userOpenPositions,
        botOpenPositions,
        hasOpenPositionOnSymbol,
      },
    };

    const isCriticalDecision = parsed.mode === 'LIVE' || reasons.length > 0;
    if (isCriticalDecision) {
      try {
        await auditLogWriter.write({
          userId: parsed.userId,
          botId: parsed.botId,
          action: decision.allowed ? 'trade.precheck.allowed' : 'trade.precheck.blocked',
          level: decision.allowed ? 'INFO' : 'WARN',
          source: 'engine.pre-trade',
          message: decision.allowed
            ? `Pre-trade check allowed (${parsed.mode}) for ${parsed.symbol}`
            : `Pre-trade check blocked (${parsed.mode}) for ${parsed.symbol}`,
          category: 'TRADING_DECISION',
          entityType: parsed.botId ? 'BOT' : undefined,
          entityId: parsed.botId,
          metadata: {
            symbol: parsed.symbol,
            mode: parsed.mode,
            requestedMarketType: parsed.marketType ?? null,
            marketType: botLiveConfig?.marketType ?? null,
            positionMode: botLiveConfig?.positionMode ?? null,
            reasons: decision.reasons,
            metrics: decision.metrics,
            guardrails: {
              globalKillSwitch: parsed.globalKillSwitch,
              emergencyStop: parsed.emergencyStop,
            },
          },
        });
      } catch {
        // Audit logging failures must not block risk checks.
      }
    }

    return decision;
  });
};
