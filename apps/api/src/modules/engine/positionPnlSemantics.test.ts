import { describe, expect, it } from 'vitest';

import {
  computePriceFromPnlFraction,
  computeUnrealizedPnlFromPrice,
  resolveModeledMarginUsed,
  resolvePositionPnlFraction,
} from './positionPnlSemantics';

describe('positionPnlSemantics', () => {
  describe('computeUnrealizedPnlFromPrice', () => {
    it('computes long and short unrealized PnL from current price', () => {
      expect(
        computeUnrealizedPnlFromPrice({
          side: 'LONG',
          entryPrice: 100,
          currentPrice: 112.5,
          quantity: 2,
        }),
      ).toBe(25);

      expect(
        computeUnrealizedPnlFromPrice({
          side: 'SHORT',
          entryPrice: 100,
          currentPrice: 87.5,
          quantity: 2,
        }),
      ).toBe(25);
    });

    it('returns null for non-positive or non-finite price and quantity inputs', () => {
      expect(
        computeUnrealizedPnlFromPrice({
          side: 'LONG',
          entryPrice: 0,
          currentPrice: 100,
          quantity: 1,
        }),
      ).toBeNull();
      expect(
        computeUnrealizedPnlFromPrice({
          side: 'SHORT',
          entryPrice: 100,
          currentPrice: Number.NaN,
          quantity: 1,
        }),
      ).toBeNull();
      expect(
        computeUnrealizedPnlFromPrice({
          side: 'LONG',
          entryPrice: 100,
          currentPrice: 101,
          quantity: -1,
        }),
      ).toBeNull();
    });
  });

  describe('resolveModeledMarginUsed', () => {
    it('derives modeled margin used from entry notional and leverage', () => {
      expect(
        resolveModeledMarginUsed({
          entryPrice: 100,
          quantity: 2,
          leverage: 10,
        }),
      ).toBe(20);
    });

    it('falls back to 1x leverage when leverage is invalid', () => {
      expect(
        resolveModeledMarginUsed({
          entryPrice: 100,
          quantity: 2,
          leverage: 0,
        }),
      ).toBe(200);
    });

    it('returns null when modeled margin cannot be derived from entry notional', () => {
      expect(
        resolveModeledMarginUsed({
          entryPrice: 100,
          quantity: 0,
          leverage: 10,
        }),
      ).toBeNull();
    });
  });

  describe('resolvePositionPnlFraction', () => {
    it('uses supplied margin and unrealized PnL when both are valid', () => {
      expect(
        resolvePositionPnlFraction({
          side: 'LONG',
          entryPrice: 100,
          currentPrice: 100,
          quantity: 2,
          leverage: 10,
          marginUsed: 40,
          unrealizedPnl: -10,
        }),
      ).toBe(-0.25);
    });

    it('derives long and short PnL fractions from price when exchange PnL is absent', () => {
      expect(
        resolvePositionPnlFraction({
          side: 'LONG',
          entryPrice: 100,
          currentPrice: 110,
          quantity: 2,
          leverage: 10,
        }),
      ).toBe(1);

      expect(
        resolvePositionPnlFraction({
          side: 'SHORT',
          entryPrice: 100,
          currentPrice: 90,
          quantity: 2,
          leverage: 10,
        }),
      ).toBe(1);
    });

    it('allows zero unrealized PnL but returns null when margin cannot be resolved', () => {
      expect(
        resolvePositionPnlFraction({
          side: 'LONG',
          entryPrice: 100,
          currentPrice: 100,
          quantity: 2,
          leverage: 10,
          marginUsed: 20,
          unrealizedPnl: 0,
        }),
      ).toBe(0);

      expect(
        resolvePositionPnlFraction({
          side: 'LONG',
          entryPrice: 0,
          currentPrice: 100,
          quantity: 2,
          leverage: 10,
        }),
      ).toBeNull();
    });
  });

  describe('computePriceFromPnlFraction', () => {
    it('converts target PnL fraction to long and short prices using explicit margin', () => {
      expect(
        computePriceFromPnlFraction({
          side: 'LONG',
          entryPrice: 100,
          quantity: 2,
          leverage: 10,
          pnlFraction: 0.5,
          marginUsed: 20,
        }),
      ).toBe(105);

      expect(
        computePriceFromPnlFraction({
          side: 'SHORT',
          entryPrice: 100,
          quantity: 2,
          leverage: 10,
          pnlFraction: 0.5,
          marginUsed: 20,
        }),
      ).toBe(95);
    });

    it('falls back to leverage math when margin or quantity is not usable', () => {
      expect(
        computePriceFromPnlFraction({
          side: 'LONG',
          entryPrice: 100,
          quantity: 0,
          leverage: 10,
          pnlFraction: 0.5,
          marginUsed: 20,
        }),
      ).toBe(105);

      expect(
        computePriceFromPnlFraction({
          side: 'SHORT',
          entryPrice: 100,
          quantity: 2,
          leverage: 0,
          pnlFraction: 0.25,
        }),
      ).toBe(75);
    });

    it('returns null for invalid target inputs or non-positive computed prices', () => {
      expect(
        computePriceFromPnlFraction({
          side: 'LONG',
          entryPrice: -100,
          quantity: 2,
          leverage: 10,
          pnlFraction: 0.5,
        }),
      ).toBeNull();

      expect(
        computePriceFromPnlFraction({
          side: 'LONG',
          entryPrice: 100,
          quantity: 2,
          leverage: 10,
          pnlFraction: Number.POSITIVE_INFINITY,
        }),
      ).toBeNull();

      expect(
        computePriceFromPnlFraction({
          side: 'SHORT',
          entryPrice: 100,
          quantity: 2,
          leverage: 1,
          pnlFraction: 2,
        }),
      ).toBeNull();
    });
  });
});
