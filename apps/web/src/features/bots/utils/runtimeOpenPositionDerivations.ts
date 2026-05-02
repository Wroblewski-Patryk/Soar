import { normalizeSymbol } from "@/lib/symbols";
import type {
  BotRuntimePositionItem,
  BotRuntimePositionsResponse,
  BotRuntimeSymbolStatsResponse,
} from "../types/bot.type";
import { toProtectedPnlPercentFromStopPrice } from "./trailingStopDisplay";

export type RuntimeOpenPositionDisplayRow = BotRuntimePositionItem & {
  liveMarkPrice: number | null;
  liveUnrealizedPnl: number;
  livePnlPct: number | null;
  marginNotional: number;
  markPrice: number | null;
  openPnl: number;
  marginUsed: number;
  pnlNotionalPct: number;
  pnlMarginPct: number;
  marginInitPct: number | null;
  ttpProtectedPercent: number | null;
  tslProtectedPercent: number | null;
};

type StreamPricesInput = Map<string, number> | Record<string, number>;

const readStreamPrice = (
  streamPrices: StreamPricesInput,
  symbolKey: string
) => {
  const value =
    streamPrices instanceof Map
      ? streamPrices.get(symbolKey)
      : streamPrices[symbolKey];
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : null;
};

const buildSymbolStatPriceMap = (
  symbolStats: BotRuntimeSymbolStatsResponse | null
) => {
  const priceBySymbol = new Map<string, number>();
  for (const item of symbolStats?.items ?? []) {
    if (
      typeof item.lastPrice === "number" &&
      Number.isFinite(item.lastPrice) &&
      item.lastPrice > 0
    ) {
      priceBySymbol.set(normalizeSymbol(item.symbol), item.lastPrice);
    }
  }
  return priceBySymbol;
};

export const resolveRuntimeOpenPositionMargin = (
  position: BotRuntimePositionItem
) => {
  const leverage =
    Number.isFinite(position.leverage) && position.leverage > 0
      ? position.leverage
      : 1;
  return position.marginUsed ?? position.entryNotional / leverage;
};

export const buildRuntimeOpenPositionRows = (params: {
  positions: BotRuntimePositionsResponse | null;
  symbolStats: BotRuntimeSymbolStatsResponse | null;
  streamPrices: StreamPricesInput;
  initBalance?: number | null;
}): RuntimeOpenPositionDisplayRow[] => {
  const priceBySymbol = buildSymbolStatPriceMap(params.symbolStats);

  return (params.positions?.openItems ?? []).map((position) => {
    const symbolKey = normalizeSymbol(position.symbol);
    const marginUsed = resolveRuntimeOpenPositionMargin(position);
    const candidateMark =
      readStreamPrice(params.streamPrices, symbolKey) ??
      position.markPrice ??
      priceBySymbol.get(symbolKey) ??
      null;
    const liveMarkPrice =
      typeof candidateMark === "number" && Number.isFinite(candidateMark)
        ? candidateMark
        : null;
    const computedUnrealizedPnl =
      liveMarkPrice == null
        ? null
        : position.side === "LONG"
          ? (liveMarkPrice - position.entryPrice) * position.quantity
          : (position.entryPrice - liveMarkPrice) * position.quantity;
    const openPnl =
      computedUnrealizedPnl ??
      (typeof position.unrealizedPnl === "number" &&
      Number.isFinite(position.unrealizedPnl)
        ? position.unrealizedPnl
        : 0);
    const pnlNotionalPct =
      position.entryNotional > 0 ? (openPnl / position.entryNotional) * 100 : 0;
    const pnlMarginPct =
      liveMarkPrice == null &&
      typeof position.unrealizedPnlPercent === "number" &&
      Number.isFinite(position.unrealizedPnlPercent)
        ? position.unrealizedPnlPercent
        : marginUsed > 0
          ? (openPnl / marginUsed) * 100
          : 0;
    const marginInitPct =
      params.initBalance && params.initBalance > 0
        ? (marginUsed / params.initBalance) * 100
        : null;
    const ttpProtectedPercent =
      toProtectedPnlPercentFromStopPrice({
        side: position.side,
        entryPrice: position.entryPrice,
        leverage: position.leverage,
        quantity: position.quantity,
        marginUsed,
        stopPrice: position.dynamicTtpStopLoss,
      }) ?? null;
    const tslProtectedPercent =
      ttpProtectedPercent != null
        ? null
        : toProtectedPnlPercentFromStopPrice({
            side: position.side,
            entryPrice: position.entryPrice,
            leverage: position.leverage,
            quantity: position.quantity,
            marginUsed,
            stopPrice: position.dynamicTslStopLoss,
          }) ?? null;

    return {
      ...position,
      markPrice: liveMarkPrice,
      liveMarkPrice,
      liveUnrealizedPnl: openPnl,
      livePnlPct: pnlMarginPct,
      marginNotional: marginUsed,
      openPnl,
      marginUsed,
      pnlNotionalPct,
      pnlMarginPct,
      marginInitPct,
      ttpProtectedPercent,
      tslProtectedPercent,
    };
  });
};

export const sumRuntimeOpenPositionUnrealized = (
  rows: RuntimeOpenPositionDisplayRow[]
) => rows.reduce((sum, row) => sum + row.liveUnrealizedPnl, 0);

export const sumRuntimeOpenPositionMargin = (
  rows: RuntimeOpenPositionDisplayRow[]
) => rows.reduce((sum, row) => sum + row.marginUsed, 0);
