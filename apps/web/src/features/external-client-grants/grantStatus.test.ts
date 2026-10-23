import { describe, expect, it } from "vitest";
import { activeGrantSymbols, getGrantStatus } from "./grantStatus";
import type { ExternalClientGrant } from "./grants.api";
import type { Bot, BotRuntimeGraph } from "@/features/bots/types/bot.type";
import type { ProfileSubscriptionResponse } from "@/features/profile/types/subscription.type";
import type { MarketUniverse } from "@/features/markets/types/marketUniverse.type";

const grant = {
  id: "grant-1", botId: "bot-1", clientLabel: "Client", exchange: "BINANCE", marketType: "FUTURES",
  symbol: "BTCUSDT", action: "PLACE_LIVE_ORDER", maxActionQuoteAmount: "50.00",
  maxTotalQuoteAmount: "100.00000001", usedQuoteAmount: "0", maxActions: 2, usedActions: 0,
  expiresAt: "2030-01-01T00:00:00.000Z", revokedAt: null, createdAt: "2026-01-01T00:00:00.000Z",
} satisfies ExternalClientGrant;
const bot = {
  id: "bot-1", name: "LIVE bot", mode: "LIVE", isActive: true, liveOptIn: true,
  exchange: "BINANCE", marketType: "FUTURES",
  symbolGroup: { id: "group-1", name: "Legacy", symbols: ["BTCUSDT"], marketUniverseId: "universe-1",
    marketUniverse: { id: "universe-1", name: "BTC", exchange: "BINANCE", marketType: "FUTURES", baseCurrency: "USDT" } },
} as Bot;
const graph = {
  marketGroups: [{ isEnabled: true, lifecycleStatus: "ACTIVE", symbolGroup: {
    id: "group-1", marketUniverseId: "universe-1", symbols: ["BTCUSDT"] } }],
} as BotRuntimeGraph;
const universes = [{ id: "universe-1", exchange: "BINANCE", marketType: "FUTURES" },
  { id: "universe-2", exchange: "BINANCE", marketType: "FUTURES" },
  { id: "universe-3", exchange: "GATEIO", marketType: "FUTURES" }] as MarketUniverse[];
const subscription = {
  activePlanCode: "ADVANCED", activeSubscription: { id: "sub-1" },
  catalog: [{ code: "ADVANCED", isActive: true, entitlements: { features: { liveTrading: true } } }],
} as ProfileSubscriptionResponse;
const context = { subscription, botsLoaded: true, bot, graph, universes,
  now: Date.parse("2026-10-19T00:00:00.000Z") };

describe("external client grant status", () => {
  it("treats only active graph groups as assigned symbols", () => {
    expect(activeGrantSymbols(bot, { marketGroups: [
      { isEnabled: false, lifecycleStatus: "ACTIVE", symbolGroup: {
        id: "group-1", marketUniverseId: "universe-1", symbols: ["BTCUSDT"] } },
      { isEnabled: true, lifecycleStatus: "ACTIVE", symbolGroup: {
        id: "group-2", marketUniverseId: "universe-2", symbols: ["ETHUSDT"] } },
      { isEnabled: true, lifecycleStatus: "ACTIVE", symbolGroup: {
        id: "group-3", marketUniverseId: "universe-3", symbols: ["SOLUSDT"] } },
    ] } as BotRuntimeGraph, universes)).toEqual(["ETHUSDT"]);
  });

  it("shows revocation, expiry, exact usage exhaustion, plan loss and group loss", () => {
    expect(getGrantStatus(grant, context)).toBe("configured");
    expect(getGrantStatus({ ...grant, revokedAt: "2026-01-01T00:00:00Z" }, context)).toBe("revoked");
    expect(getGrantStatus({ ...grant, expiresAt: "2026-01-01T00:00:00Z" }, context)).toBe("expired");
    expect(getGrantStatus({ ...grant, usedQuoteAmount: "100.00000001" }, context)).toBe("exhausted");
    expect(getGrantStatus(grant, { ...context, subscription: { ...subscription, activePlanCode: null } })).toBe("planUnavailable");
    expect(getGrantStatus(grant, { ...context, graph: { marketGroups: [
      { isEnabled: true, lifecycleStatus: "ACTIVE", symbolGroup: {
        id: "group-1", marketUniverseId: "universe-1", symbols: ["ETHUSDT"] } },
    ] } as BotRuntimeGraph })).toBe("scopeUnavailable");
    expect(getGrantStatus(grant, { ...context, graph: null })).toBe("unverified");
    expect(getGrantStatus(grant, { ...context, bot: { ...bot, liveOptIn: false } })).toBe("scopeUnavailable");
    expect(getGrantStatus({ ...grant, expiresAt: "invalid" }, context)).toBe("unverified");
    expect(getGrantStatus(grant, { ...context, universes: null })).toBe("unverified");
    expect(getGrantStatus(grant, { ...context, universes: [{ ...universes[0], exchange: "GATEIO" }] })).toBe("scopeUnavailable");
  });
});
