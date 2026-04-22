import { normalizeSymbol } from '@/lib/symbols';
import {
  formatAgeCompact,
  toRuntimeSessionStatusBadgeClass,
} from '../../../shared/runtimeMonitoringFormatters';

export const SIGNAL_CARDS_DESKTOP_MIN_WIDTH = 1280;
const SIGNAL_CARDS_TABLET_MIN_WIDTH = 768;

const KNOWN_QUOTE_CURRENCIES = [
  'USDT',
  'USDC',
  'BUSD',
  'FDUSD',
  'TUSD',
  'USDP',
  'DAI',
  'USD',
  'BTC',
  'ETH',
  'BNB',
  'EUR',
  'TRY',
  'BRL',
  'GBP',
  'AUD',
  'JPY',
] as const;

export const resolveQuoteCurrency = (symbol: string) => {
  const normalized = normalizeSymbol(symbol);
  for (const quote of KNOWN_QUOTE_CURRENCIES) {
    if (normalized.endsWith(quote) && normalized.length > quote.length) return quote;
  }
  return null;
};

export const resolveSignalCardsPerView = (width: number) => {
  if (width >= SIGNAL_CARDS_DESKTOP_MIN_WIDTH) return 4;
  if (width >= SIGNAL_CARDS_TABLET_MIN_WIDTH) return 3;
  return 2;
};

export { formatAgeCompact };

export const readFiniteNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export const interpolateTemplate = (
  template: string,
  values: Record<string, string | number>
) => template.replace(/\{(\w+)\}/g, (_, token) => String(values[token] ?? ''));

export const sessionBadge = (status?: string | null) => {
  return toRuntimeSessionStatusBadgeClass(status);
};
