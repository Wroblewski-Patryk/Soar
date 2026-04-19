import { describe, expect, it } from 'vitest';
import {
  normalizeBaseCurrencies,
  normalizeBaseCurrency,
  resolveMarketUniverseSymbols,
  normalizeSymbol,
  normalizeSymbolStrict,
  normalizeSymbols,
  resolveUniverseSymbols,
} from './symbols';

describe('symbols normalization helpers', () => {
  it('normalizes symbol by trimming and uppercasing', () => {
    expect(normalizeSymbol(' btcusdt ')).toBe('BTCUSDT');
    expect(normalizeSymbol(null)).toBe('');
  });

  it('normalizes strict symbol by removing non alphanumeric tokens', () => {
    expect(normalizeSymbolStrict(' btc/usdt-perp ')).toBe('BTCUSDTPERP');
    expect(normalizeSymbolStrict(undefined)).toBe('');
  });

  it('normalizes base currency with fallback', () => {
    expect(normalizeBaseCurrency(' usdt ')).toBe('USDT');
    expect(normalizeBaseCurrency('')).toBe('USDT');
    expect(normalizeBaseCurrency(undefined, ' usd ')).toBe('USD');
    expect(normalizeBaseCurrency('   ', '   ')).toBe('USDT');
  });

  it('normalizes symbol lists to unique sorted values', () => {
    expect(normalizeSymbols([' btcusdt ', 'ETHUSDT', 'ethusdt', '', 'btcusdt'])).toEqual([
      'BTCUSDT',
      'ETHUSDT',
    ]);
  });

  it('normalizes base currency lists to unique sorted values', () => {
    expect(normalizeBaseCurrencies([' usdt ', 'USD', 'usd', '', 'EUR'])).toEqual([
      'EUR',
      'USD',
      'USDT',
    ]);
  });

  it('resolves universe symbols from whitelist minus blacklist after normalization', () => {
    expect(resolveUniverseSymbols([' btcusdt ', 'ETHUSDT', 'XRPUSDT'], ['ethusdt', ' xrpusdt '])).toEqual([
      'BTCUSDT',
    ]);
  });

  it('resolves contract symbols from filter_result only when whitelist is empty', () => {
    expect(
      resolveMarketUniverseSymbols({
        filterResultSymbols: [' btcusdt ', 'ETHUSDT', 'ethusdt', 'SOLUSDT'],
        whitelist: [],
        blacklist: [],
      })
    ).toEqual(['BTCUSDT', 'ETHUSDT', 'SOLUSDT']);
  });

  it('resolves contract symbols from whitelist only when filter_result is empty', () => {
    expect(
      resolveMarketUniverseSymbols({
        filterResultSymbols: [],
        whitelist: [' xrpusdt ', 'BTCUSDT', 'ethusdt', 'ETHUSDT'],
        blacklist: [],
      })
    ).toEqual(['BTCUSDT', 'ETHUSDT', 'XRPUSDT']);
  });

  it('resolves contract symbols from unique(filter_result U whitelist) - blacklist', () => {
    expect(
      resolveMarketUniverseSymbols({
        filterResultSymbols: ['BTCUSDT', 'ETHUSDT'],
        whitelist: ['solusdt', 'ETHUSDT'],
        blacklist: ['ETHUSDT'],
      })
    ).toEqual(['BTCUSDT', 'SOLUSDT']);
  });

  it('keeps blacklist-only contract result empty', () => {
    expect(
      resolveMarketUniverseSymbols({
        filterResultSymbols: [],
        whitelist: [],
        blacklist: ['BTCUSDT'],
      })
    ).toEqual([]);
  });

  it('keeps none-selected contract result empty', () => {
    expect(
      resolveMarketUniverseSymbols({
        filterResultSymbols: [],
        whitelist: [],
        blacklist: [],
      })
    ).toEqual([]);
  });

  it('is idempotent for normalized values across helpers', () => {
    expect(normalizeSymbol(normalizeSymbol(' btc/usdt '))).toBe('BTC/USDT');
    expect(normalizeSymbolStrict(normalizeSymbolStrict(' eth-usdt '))).toBe('ETHUSDT');
    expect(normalizeBaseCurrency(normalizeBaseCurrency(' usd '), 'usdt')).toBe('USD');
  });

  it('keeps list helpers deterministic regardless of input order and case', () => {
    const firstBatch = [' xrpusdt ', 'BTCUSDT', 'ethusdt', 'ETHUSDT'];
    const secondBatch = ['ethusdt', ' btcusdt ', 'XRPUSDT', 'ETHUSDT'];

    expect(normalizeSymbols(firstBatch)).toEqual(normalizeSymbols(secondBatch));
    expect(normalizeBaseCurrencies([' usdt ', 'EUR', 'usd', 'USD'])).toEqual(['EUR', 'USD', 'USDT']);
  });

  it('does not mutate whitelist or blacklist arrays when resolving universe symbols', () => {
    const whitelist = [' btcusdt ', 'ETHUSDT', 'XRPUSDT'];
    const blacklist = ['ethusdt'];

    const whitelistBefore = [...whitelist];
    const blacklistBefore = [...blacklist];

    resolveUniverseSymbols(whitelist, blacklist);

    expect(whitelist).toEqual(whitelistBefore);
    expect(blacklist).toEqual(blacklistBefore);
  });

  it('does not mutate filter/whitelist/blacklist arrays when resolving market-universe symbols', () => {
    const filterResultSymbols = [' btcusdt ', 'ETHUSDT'];
    const whitelist = ['SOLUSDT'];
    const blacklist = ['ETHUSDT'];

    const filterBefore = [...filterResultSymbols];
    const whitelistBefore = [...whitelist];
    const blacklistBefore = [...blacklist];

    resolveMarketUniverseSymbols({
      filterResultSymbols,
      whitelist,
      blacklist,
    });

    expect(filterResultSymbols).toEqual(filterBefore);
    expect(whitelist).toEqual(whitelistBefore);
    expect(blacklist).toEqual(blacklistBefore);
  });
});
