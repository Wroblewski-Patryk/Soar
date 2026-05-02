import { Exchange } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { runtimeTelemetryService } from '../engine/runtimeTelemetry.service';
import {
  assertSubscriptionAllowsBotCreate,
  assertSubscriptionAllowsLiveTrading,
} from '../subscriptions/subscriptionEntitlements.service';
import { getOwnedWalletForBotContext } from '../wallets/wallets.service';
import {
  CreateBotDto,
  ListBotsQueryDto,
  UpdateBotDto,
} from './bots.types';
import {
  assertNoActiveLiveBotSymbolOverlap,
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
import {
  assertWalletContextMatchesExistingBotMarketGroups,
  isWalletContextCompatibleWithMarketUniverse,
} from './botContextValidation.service';
export {
  listBotStrategyProjectionDrift,
  repairBotStrategyProjectionDrift,
} from './botStrategyProjectionDrift.service';

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
  if (derivedMode === 'LIVE' && botData.isActive && botData.liveOptIn) {
    await assertNoActiveLiveBotSymbolOverlap({
      userId,
      symbolGroupId: symbolGroup.id,
    });
  }

  const createdBotId = await prisma.$transaction(async (tx) => {
    if (derivedMode === 'LIVE') {
      await assertSubscriptionAllowsLiveTrading(userId, tx);
    }
    await assertSubscriptionAllowsBotCreate(userId, derivedMode, tx);

    const createdBot = await tx.bot.create({
      data: {
        userId,
        name: botData.name,
        strategyId,
        symbolGroupId: symbolGroup.id,
        mode: derivedMode,
        walletId: wallet.id,
        paperStartBalance: derivedPaperStartBalance,
        apiKeyId: derivedApiKeyId,
        exchange: derivedExchange,
        marketType: derivedMarketType,
        positionMode: 'ONE_WAY',
        isActive: botData.isActive,
        liveOptIn: derivedMode === 'LIVE' ? botData.liveOptIn : false,
        manageExternalPositions:
          derivedMode === 'LIVE' ? botData.manageExternalPositions ?? false : false,
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
  const nextManageExternalPositions =
    nextMode === 'LIVE'
      ? (data.manageExternalPositions ?? existing.manageExternalPositions ?? false)
      : false;
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
  const targetBaseCurrency = targetWallet?.baseCurrency?.toUpperCase() ?? null;
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
    await assertSubscriptionAllowsLiveTrading(userId);
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
    if (!targetBaseCurrency) {
      throw botErrors.walletNotFound();
    }
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
    const targetStrategyId =
      requestedStrategyId !== undefined ? requestedStrategyId : (existing.strategyId ?? null);
    const targetSymbolGroupId = requestedSymbolGroup?.id ?? existing.symbolGroupId ?? null;

    if (targetStrategyId && targetSymbolGroupId) {
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
  if (nextMode === 'LIVE' && nextIsActive && nextLiveOptIn) {
    const targetSymbolGroupId = requestedSymbolGroup?.id ?? existing.symbolGroupId ?? null;
    if (targetSymbolGroupId) {
      await assertNoActiveLiveBotSymbolOverlap({
        userId,
        symbolGroupId: targetSymbolGroupId,
        excludeBotId: existing.id,
      });
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
        strategyId:
          typeof requestedStrategyId === 'string' && requestedStrategyId.length > 0
            ? requestedStrategyId
            : existing.strategyId ?? null,
        symbolGroupId: requestedSymbolGroup?.id ?? existing.symbolGroupId ?? null,
        paperStartBalance: targetPaperStartBalance,
        exchange: targetExchange,
        marketType: targetMarketType,
        apiKeyId: resolvedApiKeyId,
        liveOptIn: nextLiveOptIn,
        manageExternalPositions: nextManageExternalPositions,
        consentTextVersion: nextConsentTextVersion,
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
          const targetLifecycleStatus = nextIsActive ? 'ACTIVE' : primaryGroup.lifecycleStatus;
          targetGroup = await tx.botMarketGroup.update({
            where: { id: primaryGroup.id },
            data: {
              symbolGroupId: requestedSymbolGroup.id,
              lifecycleStatus: targetLifecycleStatus,
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

      if (targetGroup && (!targetGroup.isEnabled || (nextIsActive && targetGroup.lifecycleStatus !== 'ACTIVE'))) {
        await tx.botMarketGroup.update({
          where: { id: targetGroup.id },
          data: {
            isEnabled: true,
            ...(nextIsActive ? { lifecycleStatus: 'ACTIVE' as const } : {}),
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

    if (nextIsActive !== existing.isActive) {
      await tx.botMarketGroup.updateMany({
        where: {
          userId,
          botId: existing.id,
          isEnabled: true,
          lifecycleStatus: { not: 'ARCHIVED' },
        },
        data: {
          lifecycleStatus: nextIsActive ? 'ACTIVE' : 'PAUSED',
        },
      });
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
      walletId: true,
      strategyId: true,
      symbolGroupId: true,
      mode: true,
      marketType: true,
      positionMode: true,
      isActive: true,
      liveOptIn: true,
      manageExternalPositions: true,
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

