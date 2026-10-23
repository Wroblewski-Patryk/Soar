import { verify } from 'node:crypto';

// Verification only. The matching private test fixture key and all permit
// construction live under src/test, which is excluded from the API build.
const publicKey = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEABJs1I2ZMQJygbEFgz02u4746kPa85xrMjIuN66V5z1g=
-----END PUBLIC KEY-----`;

type Scope = {
  userId: string;
  botId: string;
  symbol: string;
  side: string;
  clientOrderId: string;
  quantity: number;
  price: number;
  contractSize: number;
};

const localTestDatabase = () => {
  try {
    const database = new URL(process.env.DATABASE_URL ?? '');
    const loopbackTest = database.hostname === '127.0.0.1' &&
      database.port !== '' && database.port !== '5432' &&
      decodeURIComponent(database.pathname).endsWith('_test');
    const dockerCiTest = database.hostname === 'postgres' && database.port === '5432' &&
      database.username === 'ci' && database.password !== '' &&
      database.pathname === '/soar_local_test' && database.search === '?schema=public' &&
      process.env.TEST_DATABASE_URL === database.toString();
    return process.env.NODE_ENV === 'test' &&
      ['postgres:', 'postgresql:'].includes(database.protocol) &&
      (loopbackTest || dockerCiTest)
      ? database.toString() : null;
  } catch {
    return null;
  }
};

// A signed test-only capability cannot be supplied by HTTP, an environment
// flag, a resolver result, or a hand-built economics snapshot.
export const matchesInternalGateNonunitMockPermit = (
  permit: unknown, scope: Scope, requirePretrade = false,
) => {
  const databaseUrl = localTestDatabase();
  if (!databaseUrl || !permit || typeof permit !== 'object' || Array.isArray(permit)) return false;
  const candidate = permit as Record<string, unknown>;
  if (typeof candidate.payload !== 'string' || typeof candidate.signature !== 'string') return false;
  try {
    const signedBytes = Buffer.from(candidate.payload, 'base64url');
    const signature = Buffer.from(candidate.signature, 'base64url');
    if (!verify(null, signedBytes, publicKey, signature)) return false;
    const saved = JSON.parse(signedBytes.toString('utf8')) as Record<string, unknown>;
    return saved.purpose === 'GATE_NONUNIT_TEST_ENTRY_V1' &&
      saved.databaseUrl === databaseUrl && saved.processId === process.pid &&
      (!requirePretrade || saved.pretradeValidated === true) &&
      saved.userId === scope.userId && saved.botId === scope.botId &&
      saved.symbol === scope.symbol.toUpperCase() && saved.side === scope.side &&
      saved.clientOrderId === scope.clientOrderId &&
      saved.quantity === scope.quantity && saved.price === scope.price &&
      saved.contractSize === scope.contractSize;
  } catch {
    return false;
  }
};
