import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const readPageSource = (relativePath: string) =>
  fs.readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');

describe('public auth page cache contract', () => {
  it.each([
    'src/app/(public)/auth/login/page.tsx',
    'src/app/(public)/auth/register/page.tsx',
  ])('%s stays static and independently cacheable', (relativePath) => {
    const source = readPageSource(relativePath);

    expect(source).toContain("export const dynamic = 'force-static';");
    expect(source).toContain('export const revalidate = false;');
  });
});
