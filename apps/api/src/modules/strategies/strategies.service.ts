import { prisma } from "../../prisma/client";
import type { Prisma } from '@prisma/client';
import {
  CreateStrategyDto,
  STRATEGY_EXPORT_FORMAT_VERSION,
  StrategyExportPackage,
} from './strategies.types';
import { strategyErrors } from './strategies.errors';
import { validateStrategyConfig } from './strategyConfigValidation';

export const getStrategies = async (userId: string) => {
    return prisma.strategy.findMany({ where: { userId } });
};

export const getStrategyById = async (id: string, userId: string) => {
    return prisma.strategy.findFirst({ where: { id, userId } });
};

export const createStrategy = async (userId: string, data: CreateStrategyDto) => {
    validateStrategyConfig(data.config);
    return prisma.strategy.create({
      data: {
        ...data,
        userId,
        config: data.config as Prisma.InputJsonValue,
      },
    });
};

export const updateStrategy = async (id: string, userId: string, data: Partial<CreateStrategyDto>) => {
    const existing = await getStrategyById(id, userId);
    if (!existing) return null;

    const blockingBot = await getStrategyBlockingActiveBot(userId, existing.id);
    if (blockingBot) {
      throw strategyErrors.usedByActiveBot(blockingBot);
    }

    if (data.config !== undefined) {
      validateStrategyConfig(data.config);
    }

    return prisma.strategy.update({
      where: { id: existing.id },
      data: {
        ...data,
        config: data.config as Prisma.InputJsonValue | undefined,
      },
    });
};

const getStrategyBlockingActiveBot = async (userId: string, strategyId: string) => {
    const usedByActiveCanonicalBot = await prisma.marketGroupStrategyLink.findFirst({
      where: {
        userId,
        strategyId,
        isEnabled: true,
        bot: {
          userId,
          isActive: true,
        },
        botMarketGroup: {
          userId,
          isEnabled: true,
          lifecycleStatus: 'ACTIVE',
        },
      },
      select: {
        bot: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const usedByActiveLegacyBot = await prisma.botStrategy.findFirst({
      where: {
        strategyId,
        isEnabled: true,
        bot: {
          userId,
          isActive: true,
        },
      },
      select: {
        bot: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const blockingBot = usedByActiveCanonicalBot?.bot ?? usedByActiveLegacyBot?.bot ?? null;
    if (!blockingBot) return null;
    return {
      botId: blockingBot.id,
      botName: blockingBot.name,
    };
};

const getStrategyBacktestHistoryCount = (userId: string, strategyId: string) =>
  prisma.backtestRun.count({
    where: {
      userId,
      strategyId,
    },
  });

export const deleteStrategy = async (id: string, userId: string) => {
    const existing = await getStrategyById(id, userId);
    if (!existing) return false;

    const blockingBot = await getStrategyBlockingActiveBot(userId, existing.id);
    if (blockingBot) {
      throw strategyErrors.usedByActiveBot(blockingBot);
    }

    const backtestHistoryCount = await getStrategyBacktestHistoryCount(userId, existing.id);
    if (backtestHistoryCount > 0) {
      throw strategyErrors.linkedRecords();
    }

    try {
      await prisma.strategy.delete({ where: { id: existing.id } });
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        if ((error as { code?: string }).code === 'P2003') {
          throw strategyErrors.linkedRecords();
        }
      }
      throw error;
    }
    return true;
};

export const exportStrategy = async (
  id: string,
  userId: string
): Promise<StrategyExportPackage | null> => {
  const existing = await getStrategyById(id, userId);
  if (!existing) return null;

  return {
    formatVersion: STRATEGY_EXPORT_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    strategy: {
      name: existing.name,
      description: existing.description ?? undefined,
      interval: existing.interval,
      leverage: existing.leverage,
      walletRisk: existing.walletRisk,
      config: existing.config,
    },
  };
};

const isValidImportPayload = (payload: unknown): payload is StrategyExportPackage => {
  if (!payload || typeof payload !== 'object') return false;
  const maybePackage = payload as Partial<StrategyExportPackage>;
  const maybeStrategy = maybePackage.strategy as Partial<CreateStrategyDto> | undefined;

  if (maybePackage.formatVersion !== STRATEGY_EXPORT_FORMAT_VERSION) return false;
  if (!maybeStrategy || typeof maybeStrategy !== 'object') return false;
  if (typeof maybeStrategy.name !== 'string' || !maybeStrategy.name.trim()) return false;
  if (typeof maybeStrategy.interval !== 'string' || !maybeStrategy.interval.trim()) return false;
  if (typeof maybeStrategy.leverage !== 'number') return false;
  if (typeof maybeStrategy.walletRisk !== 'number') return false;
  return true;
};

export const importStrategy = async (userId: string, payload: unknown) => {
  if (!isValidImportPayload(payload)) {
    throw strategyErrors.invalidImportPayload();
  }

  const source = payload.strategy;
  validateStrategyConfig(source.config);
  return prisma.strategy.create({
    data: {
      userId,
      name: source.name,
      description: source.description,
      interval: source.interval,
      leverage: source.leverage,
      walletRisk: source.walletRisk,
      config: source.config as Prisma.InputJsonValue,
    },
  });
};
