import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import {
  isSensitiveErrorMessage,
  isSensitiveInternalError,
  sanitizeErrorMessageForClient,
} from './errorExposure';
import { formatZodError, sendValidationError } from './formatZodError';
import { comparePassword, hashPassword } from './hash';

const originalNodeEnv = process.env.NODE_ENV;

const restoreNodeEnv = () => {
  process.env.NODE_ENV = originalNodeEnv;
};

const createMockResponse = () => {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };

  response.status.mockReturnValue(response);
  response.json.mockReturnValue(response);

  return response;
};

describe('error exposure utilities', () => {
  afterEach(() => {
    restoreNodeEnv();
    vi.restoreAllMocks();
  });

  it('classifies Prisma and network infrastructure messages as sensitive', () => {
    expect(
      isSensitiveErrorMessage(
        "Invalid `prisma.apiKey.findMany()` invocation: Can't reach database server at `db.internal:5432`."
      )
    ).toBe(true);
    expect(isSensitiveErrorMessage('P1001 database server at internal host')).toBe(true);
    expect(isSensitiveErrorMessage('ECONNREFUSED while connecting to upstream')).toBe(true);
    expect(isSensitiveErrorMessage('Invalid email or password')).toBe(false);
  });

  it('classifies sensitive Error instances as internal exposure risks', () => {
    expect(
      isSensitiveInternalError(
        new Error("Invalid `prisma.user.findUnique()` invocation: database server at `db:5432`")
      )
    ).toBe(true);
    expect(isSensitiveInternalError(new Error('User-facing validation failed'))).toBe(false);
  });

  it('redacts sensitive production messages and drops details through sendValidationError', () => {
    process.env.NODE_ENV = 'production';
    const res = createMockResponse();

    sendValidationError(
      res as never,
      z.object({ apiKey: z.string().min(8) }).safeParse({ apiKey: '' }).error
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Validation failed',
        details: [{ field: 'apiKey', message: 'Too small: expected string to have >=8 characters' }],
      },
    });

    expect(
      sanitizeErrorMessageForClient(
        500,
        "Invalid `prisma.apiKey.findMany()` invocation: Can't reach database server at `db:5432`."
      )
    ).toEqual({ message: 'Service temporarily unavailable', redacted: true });
  });

  it('keeps safe non-sensitive production messages visible', () => {
    process.env.NODE_ENV = 'production';

    expect(sanitizeErrorMessageForClient(400, 'Validation failed')).toEqual({
      message: 'Validation failed',
      redacted: false,
    });
  });
});

describe('validation formatting utilities', () => {
  it('formats nested Zod issue paths without leaking raw request payloads', () => {
    const result = z
      .object({
        profile: z.object({
          email: z.string().email(),
        }),
      })
      .safeParse({ profile: { email: 'not-an-email' }, password: 'raw-secret-value' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(formatZodError(result.error)).toEqual([
        { field: 'profile.email', message: 'Invalid email address' },
      ]);
      expect(JSON.stringify(formatZodError(result.error))).not.toContain('raw-secret-value');
    }
  });

  it('sends a generic validation error for non-Zod errors', () => {
    const res = createMockResponse();

    sendValidationError(res as never, new Error('contains internal details'));

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'Validation failed' },
    });
  });
});

describe('password hash utilities', () => {
  it('hashes passwords with bcrypt and verifies only matching plaintext', async () => {
    const hashed = await hashPassword('correct-horse-battery-staple');

    expect(hashed).not.toBe('correct-horse-battery-staple');
    expect(hashed).toMatch(/^\$2[aby]\$\d{2}\$/);
    expect(await comparePassword('correct-horse-battery-staple', hashed)).toBe(true);
    expect(await comparePassword('wrong-password', hashed)).toBe(false);
  });
});
