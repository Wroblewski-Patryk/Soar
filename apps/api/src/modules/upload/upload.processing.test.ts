import fs from 'fs';
import os from 'os';
import path from 'path';
import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';
import { transformAvatarToJpeg } from './upload.routes';

const tempDirs: string[] = [];

const makeTempDir = async () => {
  const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'soar-avatar-'));
  tempDirs.push(dir);
  return dir;
};

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.promises.rm(dir, { recursive: true, force: true })));
});

describe('avatar processing security contract', () => {
  it('rejects compressed images that exceed the decoded pixel budget', async () => {
    const dir = await makeTempDir();
    const inputPath = path.join(dir, 'huge-avatar.png');
    const outputPath = path.join(dir, 'out.jpg');
    const hugePixelBuffer = await sharp({
      create: { width: 2100, height: 2100, channels: 3, background: '#ffffff' },
    })
      .png()
      .toBuffer();

    expect(hugePixelBuffer.length).toBeLessThan(2 * 1024 * 1024);
    await fs.promises.writeFile(inputPath, hugePixelBuffer);

    await expect(transformAvatarToJpeg(inputPath, outputPath)).rejects.toThrow(/pixel limit/i);
  });

  it('converts valid avatars to bounded jpeg output', async () => {
    const dir = await makeTempDir();
    const inputPath = path.join(dir, 'avatar.png');
    const outputPath = path.join(dir, 'out.jpg');
    const pngBuffer = await sharp({
      create: { width: 32, height: 24, channels: 3, background: '#336699' },
    })
      .png()
      .toBuffer();
    await fs.promises.writeFile(inputPath, pngBuffer);

    await transformAvatarToJpeg(inputPath, outputPath);

    const metadata = await sharp(outputPath).metadata();
    expect(metadata.format).toBe('jpeg');
    expect(metadata.width).toBe(150);
    expect(metadata.height).toBe(150);
  });
});
