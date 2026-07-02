import { describe, expect, it, vi } from 'vitest';
import { WalletAllocationMode } from '@prisma/client';
import { resolveReferenceBalanceFromAllocation } from '../lib/capitalAllocation';
import { applyNoStoreHeaders } from '../middleware/noStoreHeaders';
import {
  parseStrategyIndicators,
  resolveIndicatorWarmupCandles,
} from './backtests/backtestIndicatorSpecs';
import { buildRuntimeClientOrderId } from './engine/runtimeExecutionClientOrderId';

describe('architecture baseline proof helpers', () => {
  it('resolves live allocation reference balance with bounded percent and fixed modes', () => {
    expect(
      resolveReferenceBalanceFromAllocation({
        accountBalance: 1000,
        liveAllocationMode: WalletAllocationMode.PERCENT,
        liveAllocationValue: 25,
      }),
    ).toBe(250);

    expect(
      resolveReferenceBalanceFromAllocation({
        accountBalance: 1000,
        liveAllocationMode: WalletAllocationMode.PERCENT,
        liveAllocationValue: 125,
      }),
    ).toBe(1000);

    expect(
      resolveReferenceBalanceFromAllocation({
        accountBalance: 1000,
        liveAllocationMode: WalletAllocationMode.FIXED,
        liveAllocationValue: 1500,
      }),
    ).toBe(1000);

    expect(
      resolveReferenceBalanceFromAllocation({
        accountBalance: 1000,
        liveAllocationMode: null,
        liveAllocationValue: null,
      }),
    ).toBe(1000);

    expect(
      resolveReferenceBalanceFromAllocation({
        accountBalance: Number.NaN,
        liveAllocationMode: WalletAllocationMode.FIXED,
        liveAllocationValue: 500,
      }),
    ).toBe(0);
  });

  it('applies fail-closed no-store headers before continuing middleware flow', () => {
    const setHeader = vi.fn();
    const next = vi.fn();

    applyNoStoreHeaders({} as never, { setHeader } as never, next);

    expect(setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );
    expect(setHeader).toHaveBeenCalledWith('Pragma', 'no-cache');
    expect(setHeader).toHaveBeenCalledWith('Expires', '0');
    expect(setHeader).toHaveBeenCalledWith('Surrogate-Control', 'no-store');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('clamps indicator periods through parser fallbacks and warmup resolution', () => {
    const strategyConfig = {
      open: {
        long: [
          { name: 'EMA crossover', params: { fast: 1, slow: 999 } },
          { name: 'MACD', params: { fast: 12.9, slow: 'bad', signal: 4.8 } },
          { name: 'RSI', params: { period: 301 } },
        ],
      },
    };

    const specs = parseStrategyIndicators(strategyConfig);

    expect(specs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'EMA CROSSOVER_FAST_2', period: 2 }),
        expect.objectContaining({ key: 'EMA CROSSOVER_SLOW_300', period: 300 }),
        expect.objectContaining({ key: 'MACD_LINE_12_26_4', period: 30 }),
        expect.objectContaining({ key: 'RSI_300', period: 300 }),
      ]),
    );
    expect(resolveIndicatorWarmupCandles(strategyConfig)).toBe(300);
    expect(resolveIndicatorWarmupCandles({ open: { long: [] } })).toBe(0);
  });

  it('builds deterministic runtime client order ids without leaking raw dedupe keys', () => {
    const first = buildRuntimeClientOrderId('runtime:bot-1:BTCUSDT:open:123');
    const second = buildRuntimeClientOrderId('runtime:bot-1:BTCUSDT:open:123');
    const different = buildRuntimeClientOrderId('runtime:bot-1:ETHUSDT:open:123');

    expect(first).toBe(second);
    expect(first).toMatch(/^soar_[A-Za-z0-9_-]{24}$/);
    expect(first).not.toContain('BTCUSDT');
    expect(different).not.toBe(first);
  });
});
