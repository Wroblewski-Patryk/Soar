// An admission-only seam for local integration tests. No HTTP payload, runtime
// config or environment variable can mint a permit through the order path.
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

const permits = new WeakMap<object, Scope & {
  databaseUrl: string;
  pretradeValidated: boolean;
}>();

const localTestDatabase = () => {
  try {
    const database = new URL(process.env.DATABASE_URL ?? '');
    return process.env.NODE_ENV === 'test' && database.hostname === '127.0.0.1' &&
      database.port !== '' && database.port !== '5432' &&
      decodeURIComponent(database.pathname).endsWith('_test')
      ? database.toString() : null;
  } catch {
    return null;
  }
};

const sameScope = (saved: Scope, scope: Scope) =>
  saved.userId === scope.userId && saved.botId === scope.botId &&
  saved.symbol === scope.symbol.toUpperCase() &&
  saved.side === scope.side && saved.clientOrderId === scope.clientOrderId &&
  saved.quantity === scope.quantity && saved.price === scope.price &&
  saved.contractSize === scope.contractSize;

// Only test construction calls this function. The returned object is an
// unforgeable in-process identity, scoped to one priced Gate linear ENTRY.
export const createInternalGateNonunitMockPermit = (scope: Scope): object => {
  const databaseUrl = localTestDatabase();
  if (!databaseUrl || !scope.userId || !scope.botId ||
      !/^[A-Z0-9]+USDT$/.test(scope.symbol) ||
      !['BUY', 'SELL'].includes(scope.side) || !scope.clientOrderId ||
      !Number.isFinite(scope.quantity) || scope.quantity <= 0 ||
      !Number.isFinite(scope.price) || scope.price <= 0 ||
      !Number.isFinite(scope.contractSize) || scope.contractSize <= 0 ||
      scope.contractSize === 1) {
    throw new Error('INTERNAL_GATE_NONUNIT_MOCK_UNAVAILABLE');
  }
  const permit = Object.freeze(Object.create(null)) as object;
  permits.set(permit, { ...scope, databaseUrl, pretradeValidated: false });
  return permit;
};

export const matchesInternalGateNonunitMockPermit = (
  permit: unknown, scope: Scope, requirePretrade = false,
) => {
  const databaseUrl = localTestDatabase();
  if (!databaseUrl || !permit || typeof permit !== 'object') return false;
  const saved = permits.get(permit);
  return Boolean(saved && saved.databaseUrl === databaseUrl && sameScope(saved, scope) &&
    (!requirePretrade || saved.pretradeValidated));
};

export const markInternalGateNonunitMockPretrade = (permit: unknown, scope: Scope) => {
  if (!matchesInternalGateNonunitMockPermit(permit, scope)) return false;
  permits.get(permit as object)!.pretradeValidated = true;
  return true;
};
