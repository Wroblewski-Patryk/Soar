import { Exchange } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { runtimeTelemetryService } from '../engine/runtimeTelemetry.service';
import { assertSubscriptionAllowsBotCreate } from '../subscriptions/subscriptionEntitlements.service';
import { getOwnedWalletForBotContext } from '../wallets/wallets.service';
import {
  CreateBotDto,
  ListBotStrategyDriftQueryDto,
  ListBotsQueryDto,
  RepairBotStrategyDriftDto,
  UpdateBotDto,
} from './bots.types';
import {
  assertNoDuplicateActiveBotByStrategyAndSymbolGroup,
  deriveMaxOpenPositionsFromStrategy,
  getOwnedStrategy,
  resolveCreateMarketGroupToSymbolGroup,
} from './botWriteValidation.service';
import {
  BotConsentState,
  normalizeConsentTextVersion,
  validateLiveConsentState,
  writeLiveConsentAudit,
} from './botLiveConsent.service';
import { upsertBotStrategy } from './botLegacyStrategyLink.service';
import { assertBotActivationExchangeCapability } from './botActivationPolicy.service';
import { mapBotResponse } from './botResponseMapper.service';
import {
  getBotWithStrategyProjectionById,
  getOwnedBotWithStrategyProjection,
  listOwnedBotsWithStrategyProjection,
} from './botReadProjection.service';
import { botErrors } from './bots.errors';

export {
  deleteBotSubagentConfig,
  getBotAssistantConfig,
  runAssistantDryRun,
  upsertBotAssistantConfig,
  upsertBotSubagentConfig,
} from './botAssistant.service';
export { closeBotRuntimeSessionPosition } from './runtimeSessionPositionCommand.service';

export class BotModeSwitchBlockedError extends Error {
  constructor(public readonly openPaperPositions: number) {
    super('BOT_MODE_SWITCH_REQUIRES_CLOSED_PAPER_POSITIONS');
    this.name = 'BotModeSwitchBlockedError';
  }
}

const normalizeWalletContextValue = (value: string | null | undefined) =>
  (value ?? '').trim().toUpperCase();

const isWalletContextCompatibleWithMarketUniverse = (params: {
  wallet: {
    exchange: Exchange;
    marketType: 'FUTURES' | 'SPOT';
    baseCurrency: string;
  };
  marketUniverse: {
    exchange: Exchange;
    marketType: 'FUTURES' | 'SPOT';
    baseCurrency: string;
  };
}) =>
  params.wallet.exchange === params.marketUniverse.exchange &&
  params.wallet.marketType === params.marketUniverse.marketType &&
  normalizeWalletContextValue(params.wallet.baseCurrency) ===
    normalizeWalletContextValue(params.marketUniverse.baseCurrency);

const assertWalletContextMatchesExistingBotMarketGroups = async (params: {
  userId: string;
  botId: string;
  wallet: {
    id: string;
    exchange: Exchange;
    marketType: 'FUTURES' | 'SPOT';
    baseCurrency: string;
  };
}) => {
  const botGroups = await prisma.botMarketGroup.findMany({
    where: {
      userId: params.userId,
      botId: params.botId,
    },
    select: {
      id: true,
      symbolGroupId: true,
      symbolGroup: {
        select: {
          marketUniverse: {
            select: {
              id: true,
              exchange: true,
              marketType: true,
              baseCurrency: true,
            },
          },
        },
      },
    },
  });

  const mismatch = botGroups.find((group) => {
    const universe = group.symbolGroup.marketUniverse;
    return !isWalletContextCompatibleWithMarketUniverse({
      wallet: params.wallet,
      marketUniverse: {
        exchange: universe.exchange,
        marketType: universe.marketType,
        baseCurrency: universe.baseCurrency,
      },
    });
  });

  if (mismatch) {
    throw botErrors.walletMarketContextMismatch({
      walletId: params.wallet.id,
      walletExchange: params.wallet.exchange,
      walletMarketType: params.wallet.marketType,
      walletBaseCurrency: normalizeWalletContextValue(params.wallet.baseCurrency),
      symbolGroupId: mismatch.symbolGroupId,
      marketUniverseId: mismatch.symbolGroup.marketUniverse.id,
      marketUniverseExchange: mismatch.symbolGroup.marketUniverse.exchange,
      marketUniverseMarketType: mismatch.symbolGroup.marketUniverse.marketType,
      marketUniverseBaseCurrency: normalizeWalletContextValue(
        mismatch.symbolGroup.marketUniverse.baseCurrency
      ),
    });
  }
};

export const listBots = async (userId: string, query: ListBotsQueryDto = {}) => {
  const bots = await listOwnedBotsWithStrategyProjection({
    userId,
    marketType: query.marketType,
  });

  return bots.map((bot) => mapBotResponse(bot));
};

export const getBot = async (userId: string, id: string) => {
  const bot = await getOwnedBotWithStrategyProjection({
    userId,
    botId: id,
  });

  return bot ? mapBotResponse(bot) : null;
};

type StrategyProjectionDriftItem = {
  botId: string;
  botName: string;
  projectedStrategyId: string | null;
  canonicalPrimaryStrategyId: string | null;
  canonicalPrimaryGroupId: string | null;
  canonicalPrimarySymbolGroupId: string | null;
  legacyEnabledStrategyId: string | null;
  hasProjectionDrift: boolean;
  hasLegacyCanonicalDivergence: boolean;
  repairable: boolean;
};

const toComparableTimestamp = (value: Date | null | undefined) => value?.getTime() ?? Number.MAX_SAFE_INTEGER;

const buildStrategyProjectionDriftItem = (bot: {
  id: string;
  name: string;
  botStrategies: Array<{
    id: string;
    strategyId: string;
    symbolGroupId: string;
    isEnabled: boolean;
    createdAt: Date;
  }>;
  botMarketGroups: Array<{
    id: string;
    symbolGroupId: string;
    lifecycleStatus: string;
    executionOrder: number;
    isEnabled: boolean;
    createdAt: Date;
    strategyLinks: Array<{
      strategyId: string;
      isEnabled: boolean;
      priority: number;
      createdAt: Date;
    }>;
  }>;
}): StrategyProjectionDriftItem => {
  const sortedGroups = [...bot.botMarketGroups].sort((left, right) => {
    const executionOrderDiff = left.executionOrder - right.executionOrder;
    if (executionOrderDiff !== 0) return executionOrderDiff;
    return toComparableTimestamp(left.createdAt) - toComparableTimestamp(right.createdAt);
  });
  const primaryGroup =
    sortedGroups.find((group) => group.isEnabled && group.lifecycleStatus === 'ACTIVE') ??
    sortedGroups[0] ??
    null;
  const primaryGroupStrategies = [...(primaryGroup?.strategyLinks ?? [])].sort((left, right) => {
    const priorityDiff = left.priority - right.priority;
    if (priorityDiff !== 0) return priorityDiff;
    return toComparableTimestamp(left.createdAt) - toComparableTimestamp(right.createdAt);
  });
  const primaryCanonicalStrategy =
    primaryGroupStrategies.find((strategy) => strategy.isEnabled) ??
    primaryGroupStrategies[0] ??
    null;
  const legacyEnabledStrategy =
    bot.botStrategies.find((item) => item.isEnabled) ??
    [...bot.botStrategies].sort((left, right) => toComparableTimestamp(left.createdAt) - toComparableTimestamp(right.createdAt))[0] ??
    null;
  const projectedStrategyId = mapBotResponse({
    ...bot,
    marketGroupStrategyLinks: sortedGroups.flatMap((group) =>
      group.strategyLinks.map((link) => ({
        strategyId: link.strategyId,
        isEnabled: link.isEnabled,
        priority: link.priority,
        createdAt: link.createdAt,
        botMarketGroup: {
          isEnabled: group.isEnabled,
          lifecycleStatus: group.lifecycleStatus,
          executionOrder: group.executionOrder,
          createdAt: group.createdAt,
        },
      }))
    ),
  }).strategyId;

  const canonicalPrimaryStrategyId = primaryCanonicalStrategy?.strategyId ?? null;
  const legacyEnabledStrategyId = legacyEnabledStrategy?.strategyId ?? null;
  const hasProjectionDrift =
    canonicalPrimaryStrategyId != null && projectedStrategyId !== canonicalPrimaryStrategyId;
  const hasLegacyCanonicalDivergence =
    canonicalPrimaryStrategyId != null &&
    legacyEnabledStrategyId != null &&
    canonicalPrimaryStrategyId !== legacyEnabledStrategyId;

  return {
    botId: bot.id,
    botName: bot.name,
    projectedStrategyId,
    canonicalPrimaryStrategyId,
    canonicalPrimaryGroupId: primaryGroup?.id ?? null,
    canonicalPrimarySymbolGroupId: primaryGroup?.symbolGroupId ?? null,
    legacyEnabledStrategyId,
    hasProjectionDrift,
    hasLegacyCanonicalDivergence,
    repairable: hasLegacyCanonicalDivergence && Boolean(primaryGroup?.symbolGroupId),
  };
};

export const listBotStrategyProjectionDrift = async (
  userId: string,
  query: ListBotStrategyDriftQueryDto = {}
) => {
  const bots = await prisma.bot.findMany({
    where: {
      userId,
      ...(query.botId ? { id: query.botId } : {}),
    },
    select: {
      id: true,
      name: true,
      botStrategies: {
        select: {
          id: true,
          strategyId: true,
          symbolGroupId: true,
          isEnabled: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      },
      botMarketGroups: {
        select: {
          id: true,
          symbolGroupId: true,
          lifecycleStatus: true,
          executionOrder: true,
          isEnabled: true,
          createdAt: true,
          strategyLinks: {
            select: {
              strategyId: true,
              isEnabled: true,
              priority: true,
              createdAt: true,
            },
            orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
          },
        },
        orderBy: [{ executionOrder: 'asc' }, { createdAt: 'asc' }],
      },
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });

  const allItems = bots.map(buildStrategyProjectionDriftItem);
  const driftItems = allItems.filter(
    (item) => item.hasProjectionDrift || item.hasLegacyCanonicalDivergence
  );

  return {
    totalBots: allItems.length,
    driftedBots: driftItems.length,
    items: driftItems,
  };
};

export const repairBotStrategyProjectionDrift = async (
  userId: string,
  payload: RepairBotStrategyDriftDto = {}
) => {
  const audit = await listBotStrategyProjectionDrift(userId, { botId: payload.botId });
  const targetItems = audit.items.filter((item) => item.repairable);

  const results: Array<{
    botId: string;
    status: 'repaired' | 'already_aligned' | 'skipped_not_repairable';
    canonicalPrimaryStrategyId: string | null;
    legacyEnabledStrategyId: string | null;
  }> = [];

  for (const item of audit.items) {
    if (!targetItems.some((target) => target.botId === item.botId)) {
      results.push({
        botId: item.botId,
        status: 'skipped_not_repairable',
        canonicalPrimaryStrategyId: item.canonicalPrimaryStrategyId,
        legacyEnabledStrategyId: item.legacyEnabledStrategyId,
      });
      continue;
    }

    const canonicalStrategyId = item.canonicalPrimaryStrategyId;
    const canonicalSymbolGroupId = item.canonicalPrimarySymbolGroupId;
    if (!canonicalStrategyId || !canonicalSymbolGroupId) {
      results.push({
        botId: item.botId,
        status: 'skipped_not_repairable',
        canonicalPrimaryStrategyId: item.canonicalPrimaryStrategyId,
        legacyEnabledStrategyId: item.legacyEnabledStrategyId,
      });
      continue;
    }

    const reconcileResult = await prisma.$transaction(async (tx) => {
      const rows = await tx.botStrategy.findMany({
        where: { botId: item.botId, bot: { userId } },
        select: {
          id: true,
          strategyId: true,
          symbolGroupId: true,
          isEnabled: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      });
      const canonicalRow = rows.find(
        (row) =>
          row.strategyId === canonicalStrategyId && row.symbolGroupId === canonicalSymbolGroupId
      );
      if (canonicalRow && rows.length === 1 && canonicalRow.isEnabled) {
        return { status: 'already_aligned' as const };
      }

      if (canonicalRow) {
        await tx.botStrategy.update({
          where: { id: canonicalRow.id },
          data: { isEnabled: true },
        });
        await tx.botStrategy.deleteMany({
          where: {
            botId: item.botId,
            id: { not: canonicalRow.id },
          },
        });
        return { status: 'repaired' as const };
      }

      await tx.botStrategy.deleteMany({
        where: { botId: item.botId },
      });
      await tx.botStrategy.create({
        data: {
          botId: item.botId,
          strategyId: canonicalStrategyId,
          symbolGroupId: canonicalSymbolGroupId,
          isEnabled: true,
        },
      });
      return { status: 'repaired' as const };
    });

    results.push({
      botId: item.botId,
      status: reconcileResult.status,
      canonicalPrimaryStrategyId: item.canonicalPrimaryStrategyId,
      legacyEnabledStrategyId: item.legacyEnabledStrategyId,
    });
  }

  return {
    requestedBotId: payload.botId ?? null,
    scannedDriftedBots: audit.items.length,
    repairedBots: results.filter((item) => item.status === 'repaired').length,
    alreadyAlignedBots: results.filter((item) => item.status === 'already_aligned').length,
    skippedBots: results.filter((item) => item.status === 'skipped_not_repairable').length,
    items: results,
  };
};

export const createBot = async (userId: string, data: CreateBotDto) => {
  const { strategyId, marketGroupId, walletId, ...botData } = data;
  const strategy = await getOwnedStrategy(userId, strategyId);
  if (!strategy) throw botErrors.botStrategyNotFound();

  const symbolGroup = await resolveCreateMarketGroupToSymbolGroup(userId, marketGroupId);
  if (!symbolGroup) throw botErrors.symbolGroupNotFound();
  const wallet = await getOwnedWalletForBotContext({ userId, walletId });
  if (!wallet) throw botErrors.walletNotFound();
  if (
    !isWalletContextCompatibleWithMarketUniverse({
      wallet: {
        exchange: wallet.exchange,
        marketType: wallet.marketType,
        baseCurrency: wallet.baseCurrency,
      },
      marketUniverse: {
        exchange: symbolGroup.marketUniverse.exchange,
        marketType: symbolGroup.marketUniverse.marketType,
        baseCurrency: symbolGroup.marketUniverse.baseCurrency,
      },
    })
  ) {
    throw botErrors.walletMarketContextMismatch();
  }

  const derivedMode = wallet.mode;
  const derivedPaperStartBalance = Math.max(0, wallet.paperInitialBalance);
  const derivedMarketType = wallet.marketType;
  const derivedExchange = wallet.exchange;
  const derivedApiKeyId = wallet.mode === 'LIVE' ? wallet.apiKeyId : null;
  if (wallet.mode === 'LIVE' && !derivedApiKeyId) {
    throw botErrors.walletLiveApiKeyRequired();
  }

  const nextState: BotConsentState = {
    mode: derivedMode,
    liveOptIn: derivedMode === 'LIVE' ? botData.liveOptIn : false,
    consentTextVersion: botData.consentTextVersion,
  };
  validateLiveConsentState(nextState);

  const derivedMaxOpenPositions = deriveMaxOpenPositionsFromStrategy(strategy.config);
  if (botData.isActive) {
    assertBotActivationExchangeCapability({
      exchange: derivedExchange,
      mode: derivedMode,
    });
  }

  if (botData.isActive) {
    await assertNoDuplicateActiveBotByStrategyAndSymbolGroup({
      userId,
      strategyId,
      symbolGroupId: symbolGroup.id,
      walletId: wallet.id,
    });
  }

  const createdBotId = await prisma.$transaction(async (tx) => {
    await assertSubscriptionAllowsBotCreate(userId, derivedMode, tx);

    const createdBot = await tx.bot.create({
      data: {
        userId,
        name: botData.name,
        mode: derivedMode,
        walletId: wallet.id,
        paperStartBalance: derivedPaperStartBalance,
        apiKeyId: derivedApiKeyId,
        exchange: derivedExchange,
        marketType: derivedMarketType,
        positionMode: 'ONE_WAY',
        isActive: botData.isActive,
        liveOptIn: derivedMode === 'LIVE' ? botData.liveOptIn : false,
        maxOpenPositions: derivedMaxOpenPositions,
        consentTextVersion: derivedMode === 'LIVE' && botData.liveOptIn
          ? normalizeConsentTextVersion(botData.consentTextVersion)
          : null,
      },
      select: {
        id: true,
      },
    });

    const createdBotMarketGroup = await tx.botMarketGroup.create({
      data: {
        userId,
        botId: createdBot.id,
        symbolGroupId: symbolGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 100,
        maxOpenPositions: derivedMaxOpenPositions,
        isEnabled: true,
      },
      select: {
        id: true,
      },
    });

    await tx.marketGroupStrategyLink.create({
      data: {
        userId,
        botId: createdBot.id,
        botMarketGroupId: createdBotMarketGroup.id,
        strategyId,
        priority: 100,
        weight: 1,
        isEnabled: true,
      },
      select: {
        id: true,
      },
    });

    return createdBot.id;
  });

  if (derivedMode === 'LIVE' && botData.liveOptIn && botData.consentTextVersion) {
    await writeLiveConsentAudit({
      userId,
      botId: createdBotId,
      mode: derivedMode,
      liveOptIn: botData.liveOptIn,
      consentTextVersion: normalizeConsentTextVersion(botData.consentTextVersion)!,
      action: 'bot.live_consent.accepted',
    });
  }

  const withStrategy = await getBotWithStrategyProjectionById(createdBotId);

  if (!withStrategy) throw botErrors.botNotFound();
  return mapBotResponse(withStrategy);
};

export const updateBot = async (userId: string, id: string, data: UpdateBotDto) => {
  const existing = await getBot(userId, id);
  if (!existing) return null;

  const strategyIdUpdateRequested = Object.prototype.hasOwnProperty.call(data, 'strategyId');
  const requestedStrategyId = strategyIdUpdateRequested ? (data.strategyId ?? null) : undefined;
  const marketGroupIdUpdateRequested = Object.prototype.hasOwnProperty.call(data, 'marketGroupId');
  const requestedMarketGroupId = marketGroupIdUpdateRequested ? (data.marketGroupId ?? null) : undefined;
  const walletIdUpdateRequested = Object.prototype.hasOwnProperty.call(data, 'walletId');
  const requestedWalletId = walletIdUpdateRequested ? (data.walletId ?? null) : undefined;

  let targetWallet = existing.walletId
    ? await getOwnedWalletForBotContext({ userId, walletId: existing.walletId })
    : null;
  if (walletIdUpdateRequested) {
    if (!requestedWalletId) {
      throw botErrors.walletNotFound();
    }
    targetWallet = await getOwnedWalletForBotContext({ userId, walletId: requestedWalletId });
    if (!targetWallet) {
      throw botErrors.walletNotFound();
    }
  }

  const nextMode = targetWallet?.mode ?? existing.mode;
  const nextLiveOptIn = nextMode === 'LIVE' ? (data.liveOptIn ?? existing.liveOptIn) : false;
  const nextState: BotConsentState = {
    mode: nextMode,
    liveOptIn: nextLiveOptIn,
    consentTextVersion:
      data.consentTextVersion !== undefined
        ? data.consentTextVersion
        : existing.consentTextVersion,
  };
  validateLiveConsentState(nextState);
  const nextConsentTextVersion = nextState.liveOptIn
    ? normalizeConsentTextVersion(nextState.consentTextVersion)
    : null;

  const nextIsActive = data.isActive ?? existing.isActive;
  const targetExchange = (targetWallet?.exchange ?? existing.exchange) as Exchange;
  const targetMarketType = (targetWallet?.marketType ?? existing.marketType) as 'FUTURES' | 'SPOT';
  const targetBaseCurrency = targetWallet?.baseCurrency?.toUpperCase() ?? 'USDT';
  const targetPaperStartBalance = targetWallet
    ? Math.max(0, targetWallet.paperInitialBalance)
    : existing.paperStartBalance;
  const resolvedApiKeyId =
    nextMode === 'LIVE' ? (targetWallet?.apiKeyId ?? existing.apiKeyId ?? null) : null;

  if (nextMode === 'LIVE' && !resolvedApiKeyId) {
    throw botErrors.walletLiveApiKeyRequired();
  }

  if (walletIdUpdateRequested && targetWallet) {
    await assertWalletContextMatchesExistingBotMarketGroups({
      userId,
      botId: existing.id,
      wallet: {
        id: targetWallet.id,
        exchange: targetWallet.exchange as Exchange,
        marketType: targetWallet.marketType as 'FUTURES' | 'SPOT',
        baseCurrency: targetWallet.baseCurrency,
      },
    });
  }

  const switchingPaperToLive = existing.mode === 'PAPER' && nextMode === 'LIVE';
  if (switchingPaperToLive) {
    const openPaperPositions = await prisma.position.count({
      where: {
        userId,
        botId: existing.id,
        status: 'OPEN',
        managementMode: 'BOT_MANAGED',
      },
    });
    if (openPaperPositions > 0) {
      throw new BotModeSwitchBlockedError(openPaperPositions);
    }
  }

  const requestedStrategy =
    requestedStrategyId && strategyIdUpdateRequested
      ? await getOwnedStrategy(userId, requestedStrategyId)
      : null;
  if (requestedStrategyId && strategyIdUpdateRequested && !requestedStrategy) {
    throw botErrors.botStrategyNotFound();
  }

  const requestedSymbolGroup = requestedMarketGroupId
    ? await resolveCreateMarketGroupToSymbolGroup(userId, requestedMarketGroupId)
    : null;
  if (requestedMarketGroupId && !requestedSymbolGroup) {
    throw botErrors.symbolGroupNotFound();
  }

  if (requestedSymbolGroup) {
    if (
      !isWalletContextCompatibleWithMarketUniverse({
        wallet: {
          exchange: targetExchange,
          marketType: targetMarketType,
          baseCurrency: targetBaseCurrency,
        },
        marketUniverse: {
          exchange: requestedSymbolGroup.marketUniverse.exchange,
          marketType: requestedSymbolGroup.marketUniverse.marketType,
          baseCurrency: requestedSymbolGroup.marketUniverse.baseCurrency,
        },
      })
    ) {
      throw botErrors.walletMarketContextMismatch();
    }
  }

  if (nextIsActive) {
    assertBotActivationExchangeCapability({
      exchange: targetExchange,
      mode: nextMode,
    });
  }

  if (nextIsActive) {
    const targetStrategyId = requestedStrategyId !== undefined ? requestedStrategyId : (existing.strategyId ?? null);
    if (targetStrategyId) {
      let targetSymbolGroupId: string | null = null;

      if (requestedSymbolGroup) {
        targetSymbolGroupId = requestedSymbolGroup.id;
      } else {
        const primaryGroup = await prisma.botMarketGroup.findFirst({
          where: {
            userId,
            botId: existing.id,
            isEnabled: true,
          },
          orderBy: [{ executionOrder: 'asc' }, { createdAt: 'asc' }],
          select: {
            symbolGroupId: true,
          },
        });
        targetSymbolGroupId = primaryGroup?.symbolGroupId ?? null;
      }

      if (targetSymbolGroupId) {
        const targetWalletId = targetWallet?.id ?? existing.walletId ?? null;
        if (!targetWalletId) {
          throw botErrors.walletNotFound();
        }
        await assertNoDuplicateActiveBotByStrategyAndSymbolGroup({
          userId,
          strategyId: targetStrategyId,
          symbolGroupId: targetSymbolGroupId,
          walletId: targetWalletId,
          excludeBotId: existing.id,
        });
      }
    }
  }

  const {
    strategyId: _ignoredStrategyId,
    marketGroupId: _ignoredMarketGroupId,
    walletId: _ignoredWalletId,
    ...botData
  } = data;
  const updated = await prisma.$transaction(async (tx) => {
    const updatedBot = await tx.bot.update({
      where: { id: existing.id },
      data: {
        ...botData,
        mode: nextMode,
        walletId: targetWallet?.id ?? existing.walletId ?? null,
        paperStartBalance: targetPaperStartBalance,
        exchange: targetExchange,
        marketType: targetMarketType,
        apiKeyId: resolvedApiKeyId,
        liveOptIn: nextLiveOptIn,
        consentTextVersion: nextConsentTextVersion,
      },
      include: {
        botStrategies: {
          select: {
            strategyId: true,
            isEnabled: true,
            createdAt: true,
          },
        },
        marketGroupStrategyLinks: {
          select: {
            strategyId: true,
            isEnabled: true,
            priority: true,
            createdAt: true,
            botMarketGroup: {
              select: {
                isEnabled: true,
                lifecycleStatus: true,
                executionOrder: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    const shouldSyncCanonicalMapping =
      requestedSymbolGroup !== null ||
      (strategyIdUpdateRequested && typeof requestedStrategyId === 'string' && requestedStrategyId.length > 0);
    if (shouldSyncCanonicalMapping) {
      const orderedGroups = await tx.botMarketGroup.findMany({
        where: {
          userId,
          botId: existing.id,
        },
        orderBy: [{ executionOrder: 'asc' }, { createdAt: 'asc' }],
        select: {
          id: true,
          symbolGroupId: true,
          executionOrder: true,
          maxOpenPositions: true,
          isEnabled: true,
          lifecycleStatus: true,
        },
      });
      const primaryGroup = orderedGroups.find((group) => group.isEnabled) ?? orderedGroups[0] ?? null;

      let targetGroup = primaryGroup;
      if (requestedSymbolGroup) {
        const existingTargetGroup =
          orderedGroups.find((group) => group.symbolGroupId === requestedSymbolGroup.id) ?? null;
        if (existingTargetGroup) {
          targetGroup = existingTargetGroup;
        } else if (primaryGroup) {
          targetGroup = await tx.botMarketGroup.update({
            where: { id: primaryGroup.id },
            data: {
              symbolGroupId: requestedSymbolGroup.id,
              lifecycleStatus: 'ACTIVE',
              isEnabled: true,
            },
            select: {
              id: true,
              symbolGroupId: true,
              executionOrder: true,
              maxOpenPositions: true,
              isEnabled: true,
              lifecycleStatus: true,
            },
          });
        } else {
          targetGroup = await tx.botMarketGroup.create({
            data: {
              userId,
              botId: existing.id,
              symbolGroupId: requestedSymbolGroup.id,
              lifecycleStatus: 'ACTIVE',
              executionOrder: 100,
              maxOpenPositions: updatedBot.maxOpenPositions,
              isEnabled: true,
            },
            select: {
              id: true,
              symbolGroupId: true,
              executionOrder: true,
              maxOpenPositions: true,
              isEnabled: true,
              lifecycleStatus: true,
            },
          });
        }
      }

      if (targetGroup && (!targetGroup.isEnabled || targetGroup.lifecycleStatus !== 'ACTIVE')) {
        await tx.botMarketGroup.update({
          where: { id: targetGroup.id },
          data: {
            isEnabled: true,
            lifecycleStatus: 'ACTIVE',
          },
        });
      }

      const targetCanonicalStrategyId =
        typeof requestedStrategyId === 'string' && requestedStrategyId.length > 0
          ? requestedStrategyId
          : null;

      if (targetGroup && targetCanonicalStrategyId) {
        await tx.marketGroupStrategyLink.updateMany({
          where: {
            botId: existing.id,
            botMarketGroupId: targetGroup.id,
            strategyId: { not: targetCanonicalStrategyId },
          },
          data: {
            isEnabled: false,
          },
        });

        const existingTargetLink = await tx.marketGroupStrategyLink.findFirst({
          where: {
            botId: existing.id,
            botMarketGroupId: targetGroup.id,
            strategyId: targetCanonicalStrategyId,
          },
          select: {
            id: true,
          },
        });
        if (existingTargetLink) {
          await tx.marketGroupStrategyLink.update({
            where: { id: existingTargetLink.id },
            data: {
              isEnabled: true,
              priority: 100,
              weight: 1,
            },
          });
        } else {
          await tx.marketGroupStrategyLink.create({
            data: {
              userId,
              botId: existing.id,
              botMarketGroupId: targetGroup.id,
              strategyId: targetCanonicalStrategyId,
              priority: 100,
              weight: 1,
              isEnabled: true,
            },
          });
        }
      }
    }

    return updatedBot;
  });

  if (strategyIdUpdateRequested) {
    await upsertBotStrategy({
      userId,
      botId: updated.id,
      strategyId: requestedStrategyId ?? null,
      marketType: updated.marketType,
    });
  }

  if (updated.liveOptIn && updated.consentTextVersion) {
    const consentChanged = updated.consentTextVersion !== existing.consentTextVersion;
    const optInChanged = updated.liveOptIn !== existing.liveOptIn;
    if (consentChanged || optInChanged) {
      await writeLiveConsentAudit({
        userId,
        botId: updated.id,
        mode: updated.mode,
        liveOptIn: updated.liveOptIn,
        consentTextVersion: updated.consentTextVersion,
        action: optInChanged ? 'bot.live_consent.accepted' : 'bot.live_consent.updated',
      });
    }
  }

  if (existing.isActive && !updated.isActive) {
    await runtimeTelemetryService.closeRuntimeSession({
      botId: updated.id,
      status: 'CANCELED',
      stopReason: 'bot_deactivated',
    });
  }

  const withStrategy = await getBotWithStrategyProjectionById(updated.id);

  return withStrategy ? mapBotResponse(withStrategy) : mapBotResponse(updated);
};

export const deleteBot = async (userId: string, id: string) => {
  const existing = await getBot(userId, id);
  if (!existing) return false;

  if (existing.isActive) {
    await runtimeTelemetryService.closeRuntimeSession({
      botId: existing.id,
      status: 'CANCELED',
      stopReason: 'bot_deleted',
    });
  }

  await prisma.$transaction([
    prisma.position.updateMany({
      where: { botId: existing.id },
      data: { botId: null },
    }),
    prisma.order.updateMany({
      where: { botId: existing.id },
      data: { botId: null },
    }),
    prisma.trade.updateMany({
      where: { botId: existing.id },
      data: { botId: null },
    }),
    prisma.signal.updateMany({
      where: { botId: existing.id },
      data: { botId: null },
    }),
    prisma.log.updateMany({
      where: { botId: existing.id },
      data: { botId: null },
    }),
    prisma.orderFill.updateMany({
      where: { botId: existing.id },
      data: { botId: null },
    }),
    prisma.botRuntimeEvent.deleteMany({
      where: { botId: existing.id },
    }),
    prisma.botRuntimeSymbolStat.deleteMany({
      where: { botId: existing.id },
    }),
    prisma.botRuntimeSession.deleteMany({
      where: { botId: existing.id },
    }),
    prisma.marketGroupStrategyLink.deleteMany({
      where: { botId: existing.id },
    }),
    prisma.botMarketGroup.deleteMany({
      where: { botId: existing.id },
    }),
    prisma.botStrategy.deleteMany({
      where: { botId: existing.id },
    }),
    prisma.botSubagentConfig.deleteMany({
      where: { botId: existing.id },
    }),
    prisma.botAssistantConfig.deleteMany({
      where: { botId: existing.id },
    }),
    prisma.bot.delete({
      where: { id: existing.id },
    }),
  ]);

  return true;
};

export {
  attachMarketGroupStrategy,
  createBotMarketGroup,
  deleteBotMarketGroup,
  detachMarketGroupStrategy,
  getBotMarketGroup,
  listBotMarketGroups,
  listMarketGroupStrategyLinks,
  reorderMarketGroupStrategies,
  updateBotMarketGroup,
  updateMarketGroupStrategy,
} from './botMarketGroups.service';

export const getBotRuntimeGraph = async (userId: string, botId: string) => {
  const bot = await prisma.bot.findFirst({
    where: { id: botId, userId },
    select: {
      id: true,
      userId: true,
      name: true,
      mode: true,
      marketType: true,
      positionMode: true,
      isActive: true,
      liveOptIn: true,
      maxOpenPositions: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!bot) return null;

  const marketGroups = await prisma.botMarketGroup.findMany({
    where: {
      userId,
      botId,
    },
    include: {
      symbolGroup: {
        select: {
          id: true,
          name: true,
          symbols: true,
          marketUniverseId: true,
        },
      },
      strategyLinks: {
        include: {
          strategy: {
            select: {
              id: true,
              name: true,
              interval: true,
            },
          },
        },
        orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
      },
    },
    orderBy: [{ executionOrder: 'asc' }, { createdAt: 'asc' }],
  });

  const legacyBotStrategies = await prisma.botStrategy.findMany({
    where: { botId, bot: { userId } },
    include: {
      symbolGroup: {
        select: {
          id: true,
          name: true,
          symbols: true,
          marketUniverseId: true,
        },
      },
      strategy: {
        select: {
          id: true,
          name: true,
          interval: true,
        },
      },
    },
    orderBy: [{ createdAt: 'asc' }],
  });

  return {
    bot,
    marketGroups: marketGroups.map((group) => ({
      id: group.id,
      botId: group.botId,
      symbolGroupId: group.symbolGroupId,
      lifecycleStatus: group.lifecycleStatus,
      executionOrder: group.executionOrder,
      isEnabled: group.isEnabled,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      symbolGroup: group.symbolGroup,
      strategies: group.strategyLinks.map((link) => ({
        id: link.id,
        strategyId: link.strategyId,
        priority: link.priority,
        weight: link.weight,
        isEnabled: link.isEnabled,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
        strategy: link.strategy,
      })),
    })),
    legacyBotStrategies: legacyBotStrategies.map((item) => ({
      id: item.id,
      strategyId: item.strategyId,
      symbolGroupId: item.symbolGroupId,
      isEnabled: item.isEnabled,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      strategy: item.strategy,
      symbolGroup: item.symbolGroup,
    })),
  };
};

