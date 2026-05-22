import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { sendError } from '../../utils/apiError';
import { requireAuth } from '../../middleware/requireAuth';
import { createRateLimiter } from '../../middleware/rateLimit';
import { uploadPublicOrigin } from '../../config/runtime';

const uploadRouter = Router();
const uploadLimiter = createRateLimiter({ windowMs: 60_000, max: 20 });
const avatarMaxFileSizeBytes = 2 * 1024 * 1024;
const avatarMaxInputPixels = 4_000_000;
const avatarMimeAllowlist = new Set(['image/jpeg', 'image/png', 'image/webp']);

const tmpDir = path.join(process.cwd(), 'tmp');
const avatarDir = path.join(process.cwd(), 'public', 'avatars');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

const upload = multer({
  dest: tmpDir,
  limits: { fileSize: avatarMaxFileSizeBytes },
  fileFilter: (_req, file, cb) => {
    if (!avatarMimeAllowlist.has(file.mimetype)) {
      return cb(new Error('Unsupported file type'));
    }
    return cb(null, true);
  },
});

const uploadAvatar = upload.single('avatar');

const uploadAvatarMiddleware = (req: Parameters<typeof uploadAvatar>[0], res: Parameters<typeof uploadAvatar>[1]) =>
  new Promise<void>((resolve) => {
    uploadAvatar(req, res, (err) => {
      if (!err) {
        resolve();
        return;
      }

      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        sendError(res, 413, 'Avatar file too large (max 2MB)');
        resolve();
        return;
      }

      sendError(res, 400, 'Unsupported file type');
      resolve();
    });
  });

const isImageInputRejected = (error: unknown) =>
  error instanceof Error &&
  (error.message.includes('Input image exceeds pixel limit') || error.message.includes('unsupported image format'));

export const transformAvatarToJpeg = (inputPath: string, outputPath: string) =>
  sharp(inputPath, { limitInputPixels: avatarMaxInputPixels })
    .resize(150, 150)
    .jpeg({ quality: 80 })
    .toFile(outputPath);

uploadRouter.post('/avatar', requireAuth, uploadLimiter, async (req, res) => {
  await uploadAvatarMiddleware(req, res);
  if (res.headersSent) {
    return;
  }
  if (!req.file) return sendError(res, 400, 'Missing file');

  const outFilename = `${Date.now()}-${crypto.randomUUID()}.jpg`;
  const outPath = path.join(avatarDir, outFilename);

  try {
    await transformAvatarToJpeg(req.file.path, outPath);
    await fs.promises.unlink(req.file.path);
    const url = `${uploadPublicOrigin}/avatars/${outFilename}`;
    return res.json({ url });
  } catch (error) {
    await fs.promises.unlink(req.file.path).catch(() => undefined);
    if (isImageInputRejected(error)) {
      return sendError(res, 400, 'Invalid image');
    }
    return sendError(res, 500, 'Image processing failed');
  }
});

export default uploadRouter;
