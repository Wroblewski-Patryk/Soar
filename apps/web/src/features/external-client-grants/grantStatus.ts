import type { Bot, BotRuntimeGraph } from "@/features/bots/types/bot.type";
import type { ProfileSubscriptionResponse } from "@/features/profile/types/subscription.type";
import type { MarketUniverse } from "@/features/markets/types/marketUniverse.type";
import type { ExternalClientGrant } from "./grants.api";

export const decimalUnits = (value: string): bigint | null => {
  if (!/^(?:0|[1-9]\d*)(?:\.\d{1,8})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole) * BigInt(100_000_000) + BigInt(fraction.padEnd(8, "0"));
};

export const activeGrantSymbols = (bot: Bot, graph: BotRuntimeGraph, universes: MarketUniverse[]): string[] => {
  const groups = graph.marketGroups.length > 0
    ? graph.marketGroups
        .filter((group) => group.isEnabled && group.lifecycleStatus === "ACTIVE")
        .map((group) => group.symbolGroup)
    : bot.symbolGroup ? [bot.symbolGroup] : [];
  return [...new Set(groups.filter((group) => {
    const universe = universes.find((item) => item.id === group.marketUniverseId);
    return universe?.exchange === bot.exchange && universe.marketType === bot.marketType;
  }).flatMap((group) => group.symbols))]
    .filter((symbol) => /^[A-Z0-9]{5,30}$/.test(symbol)).sort();
};

export const subscriptionAllowsGrant = (subscription: ProfileSubscriptionResponse): boolean => {
  if (!subscription.activePlanCode || !subscription.activeSubscription) return false;
  const activePlan = subscription.catalog.find((plan) => plan.code === subscription.activePlanCode);
  return activePlan?.isActive === true && activePlan.entitlements?.features?.liveTrading === true;
};

export type GrantStatus =
  | "revoked" | "expired" | "exhausted" | "planUnavailable" | "scopeUnavailable" | "unverified" | "configured";

export const getGrantStatus = (
  grant: ExternalClientGrant,
  context: {
    subscription: ProfileSubscriptionResponse | null;
    botsLoaded: boolean;
    bot: Bot | undefined;
    graph: BotRuntimeGraph | null | undefined;
    universes: MarketUniverse[] | null;
    now: number;
  },
): GrantStatus => {
  if (grant.revokedAt) return "revoked";
  const expiry = Date.parse(grant.expiresAt);
  if (!Number.isFinite(expiry)) return "unverified";
  if (expiry <= context.now) return "expired";
  const used = decimalUnits(grant.usedQuoteAmount);
  const max = decimalUnits(grant.maxTotalQuoteAmount);
  if (used === null || max === null) return "unverified";
  if (grant.usedActions >= grant.maxActions || used >= max) return "exhausted";
  if (!context.subscription) return "unverified";
  if (!subscriptionAllowsGrant(context.subscription)) return "planUnavailable";
  if (!context.botsLoaded) return "unverified";
  if (!context.bot) return "scopeUnavailable";
  if (!context.graph) return "unverified";
  if (!context.universes) return "unverified";
  if (context.bot.mode !== "LIVE" || !context.bot.isActive || !context.bot.liveOptIn ||
      context.bot.exchange !== grant.exchange ||
      context.bot.marketType !== grant.marketType ||
      !activeGrantSymbols(context.bot, context.graph, context.universes).includes(grant.symbol)) return "scopeUnavailable";
  return "configured";
};
