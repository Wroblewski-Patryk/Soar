import { describe, expect, it } from 'vitest';

import { computeRiskBasedOrderQuantity, normalizeWalletRiskPercent } from './positionSizing';

describe('positionSizing', () => {
  describe('normalizeWalletRiskPercent', () => {
    it('returns finite wallet risk percentages unchanged inside allowed bounds', () => {
      expect(normalizeWalletRiskPercent(1)).toBe(1);
      expect(normalizeWalletRiskPercent('2.5')).toBe(2.5);
    });

    it('uses the fallback when the wallet risk input is not finite', () => {
      expect(normalizeWalletRiskPercent('not-a-number')).toBe(1);
      expect(normalizeWalletRiskPercent(Number.NaN, 3)).toBe(3);
    });

    it('clamps wallet risk percent to the supported min and max bounds', () => {
      expect(normalizeWalletRiskPercent(0)).toBe(0.01);
      expect(normalizeWalletRiskPercent(0.001)).toBe(0.01);
      expect(normalizeWalletRiskPercent(150)).toBe(100);
    });
  });

  describe('computeRiskBasedOrderQuantity', () => {
    it('computes quantity from wallet risk budget, leverage, and price', () => {
      expect(
        computeRiskBasedOrderQuantity({
          price: 100,
          walletRiskPercent: 2,
          referenceBalance: 1_000,
          leverage: 5,
        }),
      ).toBe(1);
    });

    it('returns minimum quantity when price or balance cannot support sizing', () => {
      expect(
        computeRiskBasedOrderQuantity({
          price: 0,
          walletRiskPercent: 2,
          referenceBalance: 1_000,
          leverage: 5,
          minQuantity: 0.01,
        }),
      ).toBe(0.01);

      expect(
        computeRiskBasedOrderQuantity({
          price: 100,
          walletRiskPercent: 2,
          referenceBalance: -1,
          leverage: 5,
          minQuantity: 0.02,
        }),
      ).toBe(0.02);
    });

    it('enforces minimum quantity when the computed risk quantity is too small', () => {
      expect(
        computeRiskBasedOrderQuantity({
          price: 50_000,
          walletRiskPercent: 0.01,
          referenceBalance: 100,
          leverage: 1,
          minQuantity: 0.001,
        }),
      ).toBe(0.001);
    });

    it('covers wallet-risk clamp behavior through exported quantity sizing', () => {
      expect(
        computeRiskBasedOrderQuantity({
          price: 100,
          walletRiskPercent: 500,
          referenceBalance: 100,
          leverage: 1,
        }),
      ).toBe(1);

      expect(
        computeRiskBasedOrderQuantity({
          price: 100,
          walletRiskPercent: 0,
          referenceBalance: 100,
          leverage: 1,
        }),
      ).toBe(0.0001);
    });

    it('rounds computed quantities to the helper precision boundary', () => {
      expect(
        computeRiskBasedOrderQuantity({
          price: 3,
          walletRiskPercent: 100,
          referenceBalance: 1,
          leverage: 1,
        }),
      ).toBe(0.33333333);
    });

    it('falls back to minimum quantity when computed quantity is non-finite', () => {
      expect(
        computeRiskBasedOrderQuantity({
          price: 100,
          walletRiskPercent: Number.NaN,
          referenceBalance: 100,
          leverage: Number.NaN,
          minQuantity: 0.05,
        }),
      ).toBe(0.05);
    });
  });
});
