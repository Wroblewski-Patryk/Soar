import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDcaLevel, createThreshold, stripDcaLevelClientIds, stripThresholdClientIds } from '@/features/strategies/utils/strategyThresholdItems';
import { themeBootstrapScript } from '@/security/themeBootstrap';
import { TAB_CONTENT_FRAME_CLASS, TAB_CONTENT_INNER_CLASS } from '@/ui/components/tabContentFrame';
import {
  getHeaderDropdownLinkClass,
  getHeaderDropdownMenuClass,
  getHeaderMenuItemClass,
  headerDropdownLinkActiveClass,
  headerDropdownLinkClass,
  headerMenuItemActiveClass,
  headerMenuItemClass,
} from '@/ui/layout/dashboard/headerControlStyles';
import { dashboardRoutes, pathStartsWithAny } from '@/ui/layout/dashboard/dashboardRoutes';
import { buildNextCloneName } from './cloneNaming';
import { getLocalStorageJsonItem, getLocalStorageItem, removeLocalStorageItem, setLocalStorageJsonItem, setLocalStorageItem } from './storage';
import { normalizeBaseCurrency, normalizeSymbol, normalizeSymbolsUnique, normalizeSymbolsUniqueSorted } from './symbols';
import { normalizeUppercaseToken } from './text';
import { toTimestamp } from './time';
import {
  hasFormText,
  normalizeFormBaseCurrency,
  normalizeFormSymbol,
  normalizeFormText,
  resolveFormErrorMessage,
} from './forms';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('lang');
});

describe('shared Web utilities', () => {
  it('builds collision-safe clone names case-insensitively', () => {
    expect(buildNextCloneName(' Bot A ', ['bot a (clone)', 'BOT A (CLONE 2)'])).toBe('Bot A (clone 3)');
    expect(buildNextCloneName('Bot B', [])).toBe('Bot B (clone)');
  });

  it('fails closed around unavailable localStorage and invalid JSON', () => {
    expect(setLocalStorageItem('theme', 'dark')).toBe(true);
    expect(getLocalStorageItem('theme')).toBe('dark');
    expect(removeLocalStorageItem('theme')).toBe(true);
    expect(getLocalStorageItem('theme')).toBeNull();

    expect(setLocalStorageJsonItem('filters', { symbol: 'BTCUSDT' })).toBe(true);
    expect(getLocalStorageJsonItem<{ symbol: string }>('filters')).toEqual({ symbol: 'BTCUSDT' });
    window.localStorage.setItem('filters', '{bad json');
    expect(getLocalStorageJsonItem('filters')).toBeNull();

    vi.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(getLocalStorageItem('theme')).toBeNull();
  });

  it('normalizes symbols and uppercase tokens consistently', () => {
    expect(normalizeUppercaseToken(' btcusdt ')).toBe('BTCUSDT');
    expect(normalizeSymbol(undefined)).toBe('');
    expect(normalizeBaseCurrency(' usdt ')).toBe('USDT');
    expect(normalizeSymbolsUnique([' btcusdt ', 'BTCUSDT', ' ethusdt '])).toEqual(['BTCUSDT', 'ETHUSDT']);
    expect(normalizeSymbolsUniqueSorted(['xrpusdt', 'adausdt'])).toEqual(['ADAUSDT', 'XRPUSDT']);
  });

  it('normalizes form text, symbols, and base currency fail-closed', () => {
    expect(normalizeFormText('  bot name  ')).toBe('bot name');
    expect(normalizeFormText(null)).toBe('');
    expect(hasFormText('  BTCUSDT  ')).toBe(true);
    expect(hasFormText('   ')).toBe(false);
    expect(normalizeFormSymbol(' btcusdt ')).toBe('BTCUSDT');
    expect(normalizeFormBaseCurrency(' usdc ')).toBe('USDC');
    expect(normalizeFormBaseCurrency('', 'EUR')).toBe('EUR');
  });

  it('resolves form error messages through the shared UI resolver fallback', () => {
    expect(
      resolveFormErrorMessage(
        {
          isAxiosError: true,
          response: { data: { error: { message: 'wallet name already exists' } } },
        },
        'Save failed'
      )
    ).toBe('wallet name already exists');
    expect(resolveFormErrorMessage({}, 'Save failed')).toBe('Save failed');
  });

  it('parses valid timestamps and fails invalid dates to zero', () => {
    expect(toTimestamp('2026-06-05T00:00:00.000Z')).toBe(Date.UTC(2026, 5, 5));
    expect(toTimestamp('not-a-date')).toBe(0);
    expect(toTimestamp(null)).toBe(0);
  });

  it('creates and strips strategy threshold client ids without leaking them to payloads', () => {
    const threshold = createThreshold({ percent: 1, arm: 2, clientId: 'threshold-fixed' });
    const dcaLevel = createDcaLevel({ percent: -3, multiplier: 4, clientId: 'dca-fixed' });
    const generatedThreshold = createThreshold();
    const generatedDcaLevel = createDcaLevel();

    expect(threshold).toEqual({ percent: 1, arm: 2, clientId: 'threshold-fixed' });
    expect(dcaLevel).toEqual({ percent: -3, multiplier: 4, clientId: 'dca-fixed' });
    expect(generatedThreshold.clientId).toMatch(/^threshold-/);
    expect(generatedDcaLevel.clientId).toMatch(/^dca-/);
    expect(stripThresholdClientIds([threshold])).toEqual([{ percent: 1, arm: 2 }]);
    expect(stripDcaLevelClientIds([dcaLevel])).toEqual([{ percent: -3, multiplier: 4 }]);
  });

  it('keeps dashboard route helpers centralized', () => {
    expect(dashboardRoutes.wallets.edit('wallet-1')).toBe('/dashboard/wallets/wallet-1/edit');
    expect(dashboardRoutes.bots.assistant('bot-1')).toBe('/dashboard/bots/bot-1/assistant');
    expect(pathStartsWithAny('/dashboard/wallets/list', [dashboardRoutes.wallets.root])).toBe(true);
    expect(pathStartsWithAny('/dashboarding', [dashboardRoutes.home])).toBe(false);
  });

  it('exports stable tab content frame classes', () => {
    expect(TAB_CONTENT_FRAME_CLASS).toContain('border-secondary');
    expect(TAB_CONTENT_INNER_CLASS).toContain('bg-base-100');
  });

  it('exports stable dashboard header control classes', () => {
    expect(getHeaderMenuItemClass(false)).toBe(headerMenuItemClass);
    expect(getHeaderMenuItemClass(true)).toContain(headerMenuItemActiveClass);
    expect(getHeaderDropdownLinkClass(false)).toBe(headerDropdownLinkClass);
    expect(getHeaderDropdownLinkClass(true)).toBe(headerDropdownLinkActiveClass);
    expect(getHeaderDropdownMenuClass('top', 'w-72')).toContain('mb-2 w-72');
    expect(getHeaderDropdownMenuClass()).toContain('mt-2 w-56');
  });

  it('bootstraps persisted theme and locale without exposing storage failures', () => {
    window.localStorage.setItem('themePreference', 'dark');
    window.localStorage.setItem('cryptosparrow-locale', 'de-CH');

    Function(themeBootstrapScript)();

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(document.documentElement).toHaveAttribute('lang', 'de-CH');

    window.localStorage.setItem('themePreference', 'system');
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
    Function(themeBootstrapScript)();
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });
});
