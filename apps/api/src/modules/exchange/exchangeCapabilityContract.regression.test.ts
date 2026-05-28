import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { describe, expect, it } from 'vitest';

const MODULES_ROOT = join(__dirname, '..');
const EXCHANGE_MODULE_ROOT = join(MODULES_ROOT, 'exchange');

const walkFiles = (root: string): string[] => {
  const output: string[] = [];
  for (const entry of readdirSync(root)) {
    const fullPath = join(root, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      output.push(...walkFiles(fullPath));
      continue;
    }
    if (!fullPath.endsWith('.ts')) {
      continue;
    }
    output.push(fullPath);
  }
  return output;
};

describe('exchange capability contract regression', () => {
  it('keeps ccxt-specific exchange types inside modules/exchange boundary', () => {
    const outsideExchangeTsFiles = walkFiles(MODULES_ROOT).filter((filePath) => !filePath.startsWith(EXCHANGE_MODULE_ROOT));
    const offenders: string[] = [];

    for (const filePath of outsideExchangeTsFiles) {
      const content = readFileSync(filePath, 'utf8');
      const importsCcxtTypes = /from\s+['"][^'"]*\/exchange\/ccxtFuturesConnector\.types['"]/.test(content);
      const referencesCcxtTypeNames = /\bCcxtFuturesOrderFill\b|\bCcxtWalletCashflowHistoryEntry\b/.test(content);
      if (importsCcxtTypes || referencesCcxtTypeNames) {
        offenders.push(relative(MODULES_ROOT, filePath));
      }
    }

    expect(offenders).toEqual([]);
  });
});
