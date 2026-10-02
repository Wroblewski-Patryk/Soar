import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import manifest from './manifest';

const readPngDimensions = (filePath: string) => {
  const png = readFileSync(filePath);

  expect(png.subarray(1, 4).toString('ascii')).toBe('PNG');
  expect(png.subarray(12, 16).toString('ascii')).toBe('IHDR');

  return {
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
  };
};

describe('PWA manifest screenshots', () => {
  it('declares the shipped logo PNG dimensions', () => {
    const logoPath = path.resolve(process.cwd(), 'public', 'logo.png');
    const { width, height } = readPngDimensions(logoPath);
    const logoScreenshot = manifest().screenshots?.find(
      (screenshot) => screenshot.src === '/logo.png',
    );

    expect(logoScreenshot).toBeDefined();
    expect(logoScreenshot?.sizes).toBe(`${width}x${height}`);
  });
});
