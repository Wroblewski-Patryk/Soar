import * as z from 'zod/v4';

const TRUSTED_API_ORIGINS = new Set([
  'https://api.soar.luckysparrow.ch',
  'https://stage-api.soar.luckysparrow.ch',
]);
const GRANT_ID = /^[A-Za-z0-9_-]{1,128}$/;
const GRANT_SECRET = /^soar_ext_[A-Za-z0-9_-]{43}$/;
const BOT_ID = /^[A-Za-z0-9_-]{1,128}$/;
const BOT_READ_SECRET = /^soar_read_[A-Za-z0-9_-]{43}$/;
const grantSchema = z.object({
  id: z.string(),
  status: z.enum(['ACTIVE', 'EXHAUSTED']),
  scope: z.object({
    botId: z.string(),
    exchange: z.string(),
    marketType: z.string(),
    symbol: z.string(),
    action: z.literal('PLACE_LIVE_ORDER'),
  }).strict(),
  limits: z.object({
    maxActionQuoteAmount: z.string(),
    maxTotalQuoteAmount: z.string(),
    maxActions: z.number().int().positive(),
  }).strict(),
  usage: z.object({
    usedQuoteAmount: z.string(),
    usedActions: z.number().int().nonnegative(),
  }).strict(),
  expiresAt: z.iso.datetime({ offset: true }),
}).strict();
const responseSchema = z.object({ grant: grantSchema }).strict();
const botResponseSchema = z.object({
  bot: z.object({
    id: z.string(),
    mode: z.enum(['PAPER', 'LIVE']),
    isActive: z.boolean(),
  }).strict(),
}).strict();

export const DEFAULT_API_ORIGIN = 'https://api.soar.luckysparrow.ch';

function isTrustedOrigin(origin, testOnlyAllowLoopback) {
  if (TRUSTED_API_ORIGINS.has(origin)) return true;
  if (!testOnlyAllowLoopback) return false;
  return /^http:\/\/127\.0\.0\.1:[1-9][0-9]{0,4}$/.test(origin) &&
    Number(new URL(origin).port) <= 65535;
}

export function createGrantStatusReader({
  origin = DEFAULT_API_ORIGIN,
  grantId,
  secret,
  fetchImpl = fetch,
  testOnlyAllowLoopback = false,
}) {
  return async () => {
    // The tool accepts no arguments. The only credential and target come from
    // process configuration, never from a model-controlled MCP request.
    if (!isTrustedOrigin(origin, testOnlyAllowLoopback) ||
        !GRANT_ID.test(grantId ?? '') || !GRANT_SECRET.test(secret ?? '')) {
      throw new Error('Grant status unavailable');
    }
    const url = `${origin}/external-client/grants/${encodeURIComponent(grantId)}/status`;
    try {
      const response = await fetchImpl(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${secret}`, Accept: 'application/json' },
        redirect: 'error',
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });
      if (response.status !== 200) throw new Error('Denied');
      const parsed = responseSchema.safeParse(await response.json());
      if (!parsed.success || parsed.data.grant.id !== grantId ||
          Date.parse(parsed.data.grant.expiresAt) <= Date.now()) {
        throw new Error('Denied');
      }
      return parsed.data.grant;
    } catch {
      // Never forward a fetch exception, URL, response body, or credential.
      throw new Error('Grant status unavailable');
    }
  };
}

export function createBotStatusReader({
  origin = DEFAULT_API_ORIGIN,
  botId,
  secret,
  fetchImpl = fetch,
  testOnlyAllowLoopback = false,
}) {
  return async () => {
    if (!isTrustedOrigin(origin, testOnlyAllowLoopback) ||
        !BOT_ID.test(botId ?? '') || !BOT_READ_SECRET.test(secret ?? '')) {
      throw new Error('Bot status unavailable');
    }
    const url = `${origin}/external-client/bots/${encodeURIComponent(botId)}/status`;
    try {
      const response = await fetchImpl(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${secret}`, Accept: 'application/json' },
        redirect: 'error',
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });
      if (response.status !== 200) throw new Error('Denied');
      const parsed = botResponseSchema.safeParse(await response.json());
      if (!parsed.success || parsed.data.bot.id !== botId) throw new Error('Denied');
      return parsed.data.bot;
    } catch {
      throw new Error('Bot status unavailable');
    }
  };
}
