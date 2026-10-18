import { createClient } from 'redis';
import { PositionManagementState } from './positionManagement.types';

type RedisClient = ReturnType<typeof createClient>;

export type PersistedRuntimePositionState = Pick<
  PositionManagementState,
  | 'quantity'
  | 'averageEntryPrice'
  | 'currentAdds'
  | 'executedDcaLevelIndices'
  | 'trailingAnchorPrice'
  | 'trailingLossLimitPercent'
  | 'trailingLossActiveLevelIndex'
  | 'trailingTakeProfitHighPercent'
  | 'trailingTakeProfitStepPercent'
  | 'trailingTakeProfitActiveLevelIndex'
  | 'lastDcaPrice'
>;

const DEFAULT_REDIS_URL = 'redis://localhost:6379';
const DEFAULT_TTL_MS = 6 * 60 * 60 * 1000;
const POSITION_STATE_KEY_PREFIX = 'runtime:position-state:';

const toFiniteNumber = (value: unknown): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
};

const toFinitePositive = (value: unknown): number | null => {
  const parsed = toFiniteNumber(value);
  if (parsed == null || parsed <= 0) return null;
  return parsed;
};

const toFiniteNonNegativeInt = (value: unknown, fallback = 0) => {
  const parsed = toFiniteNumber(value);
  if (parsed == null) return fallback;
  return Math.max(0, Math.floor(parsed));
};

const toOptionalLevelIndex = (value: unknown): number | undefined => {
  if (value == null) return undefined;
  const parsed = toFiniteNumber(value);
  return parsed != null && Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
};

const toFiniteNonNegativeIntArray = (value: unknown): number[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  const normalized = [
    ...new Set(
      value
        .map((item) => toFiniteNumber(item))
        .filter((item): item is number => item != null)
        .map((item) => Math.max(0, Math.floor(item))),
    ),
  ].sort((left, right) => left - right);
  return normalized.length > 0 ? normalized : undefined;
};

export const parseRuntimePositionState = (value: unknown): PersistedRuntimePositionState | null => {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;

  const quantity = toFinitePositive(raw.quantity);
  const averageEntryPrice = toFinitePositive(raw.averageEntryPrice);
  if (quantity == null || averageEntryPrice == null) return null;

  const trailingAnchorPrice = toFinitePositive(raw.trailingAnchorPrice) ?? averageEntryPrice;
  const trailingLossLimitPercent = toFiniteNumber(raw.trailingLossLimitPercent);
  const trailingTakeProfitHighPercent = toFiniteNumber(raw.trailingTakeProfitHighPercent);
  const trailingTakeProfitStepPercent = toFiniteNumber(raw.trailingTakeProfitStepPercent);
  const lastDcaPrice = toFinitePositive(raw.lastDcaPrice);

  return {
    quantity,
    averageEntryPrice,
    currentAdds: toFiniteNonNegativeInt(raw.currentAdds),
    executedDcaLevelIndices: toFiniteNonNegativeIntArray(raw.executedDcaLevelIndices),
    trailingAnchorPrice,
    trailingLossLimitPercent:
      trailingLossLimitPercent != null ? trailingLossLimitPercent : undefined,
    trailingLossActiveLevelIndex: toOptionalLevelIndex(raw.trailingLossActiveLevelIndex),
    trailingTakeProfitHighPercent:
      trailingTakeProfitHighPercent != null ? trailingTakeProfitHighPercent : undefined,
    trailingTakeProfitStepPercent:
      trailingTakeProfitStepPercent != null ? trailingTakeProfitStepPercent : undefined,
    trailingTakeProfitActiveLevelIndex: toOptionalLevelIndex(raw.trailingTakeProfitActiveLevelIndex),
    lastDcaPrice: lastDcaPrice != null ? lastDcaPrice : undefined,
  };
};

const cloneState = (state: PersistedRuntimePositionState): PersistedRuntimePositionState => ({
  quantity: state.quantity,
  averageEntryPrice: state.averageEntryPrice,
  currentAdds: state.currentAdds,
  executedDcaLevelIndices: state.executedDcaLevelIndices ? [...state.executedDcaLevelIndices] : undefined,
  trailingAnchorPrice: state.trailingAnchorPrice,
  trailingLossLimitPercent: state.trailingLossLimitPercent,
  trailingLossActiveLevelIndex: state.trailingLossActiveLevelIndex,
  trailingTakeProfitHighPercent: state.trailingTakeProfitHighPercent,
  trailingTakeProfitStepPercent: state.trailingTakeProfitStepPercent,
  trailingTakeProfitActiveLevelIndex: state.trailingTakeProfitActiveLevelIndex,
  lastDcaPrice: state.lastDcaPrice,
});

export class RuntimePositionStateStore {
  private readonly memory = new Map<string, { state: PersistedRuntimePositionState; expiresAt: number }>();
  private redisClientPromise: Promise<RedisClient | null> | null = null;
  private redisRetryAt = 0;

  private async getRedisClient() {
    if (process.env.NODE_ENV === 'test') return null;
    if (this.redisClientPromise) {
      const existing = await this.redisClientPromise;
      if (existing?.isOpen) return existing;
      this.redisClientPromise = null;
    }
    if (Date.now() < this.redisRetryAt) return null;
    if (!this.redisClientPromise) {
      this.redisClientPromise = (async () => {
        try {
          const client = createClient({
            url: process.env.REDIS_URL || DEFAULT_REDIS_URL,
          });
          client.on('error', () => {
            // Runtime state should gracefully fallback to in-memory if Redis is down.
          });
          await client.connect();
          this.redisRetryAt = 0;
          return client;
        } catch {
          this.redisRetryAt = Date.now() + 5_000;
          return null;
        }
      })();
    }

    return this.redisClientPromise;
  }

  private getKey(positionId: string) {
    return `${POSITION_STATE_KEY_PREFIX}${positionId}`;
  }

  private getMemory(positionId: string, now = Date.now()) {
    const cached = this.memory.get(positionId);
    if (!cached) return null;
    if (cached.expiresAt <= now) {
      this.memory.delete(positionId);
      return null;
    }
    return cloneState(cached.state);
  }

  private setMemory(positionId: string, state: PersistedRuntimePositionState, now = Date.now()) {
    this.memory.set(positionId, {
      state: cloneState(state),
      expiresAt: now + DEFAULT_TTL_MS,
    });
  }

  async getPositionRuntimeState(positionId: string): Promise<PersistedRuntimePositionState | null> {
    const now = Date.now();
    const redis = await this.getRedisClient();
    if (!redis) return this.getMemory(positionId, now);

    try {
      const raw = await redis.get(this.getKey(positionId));
      if (!raw) { this.memory.delete(positionId); return null; }
      const parsed = parseRuntimePositionState(JSON.parse(raw));
      if (!parsed) { this.memory.delete(positionId); return null; }
      this.setMemory(positionId, parsed, now);
      return cloneState(parsed);
    } catch {
      return this.getMemory(positionId, now);
    }
  }

  async getPositionRuntimeStates(positionIds: string[]) {
    const uniqueIds = [...new Set(positionIds.filter((id) => typeof id === 'string' && id.length > 0))];
    const result = new Map<string, PersistedRuntimePositionState>();
    if (uniqueIds.length === 0) return result;

    const now = Date.now();
    const redis = await this.getRedisClient();
    if (!redis) {
      for (const id of uniqueIds) {
        const cached = this.getMemory(id, now);
        if (cached) result.set(id, cached);
      }
      return result;
    }

    try {
      const payloads = await redis.mGet(uniqueIds.map((positionId) => this.getKey(positionId)));
      payloads.forEach((payload, index) => {
        const positionId = uniqueIds[index];
        if (!positionId) return;
        if (!payload) { this.memory.delete(positionId); return; }
        try {
          const parsed = parseRuntimePositionState(JSON.parse(payload));
          if (!parsed) { this.memory.delete(positionId); return; }
          this.setMemory(positionId, parsed, now);
          result.set(positionId, cloneState(parsed));
        } catch {
          this.memory.delete(positionId);
        }
      });
    } catch {
      for (const id of uniqueIds) {
        const cached = this.getMemory(id, now);
        if (cached) result.set(id, cached);
      }
      return result;
    }

    return result;
  }

  async setPositionRuntimeState(positionId: string, state: PositionManagementState) {
    const normalized = parseRuntimePositionState(state);
    if (!normalized) return false;

    const now = Date.now();
    this.setMemory(positionId, normalized, now);

    const redis = await this.getRedisClient();
    if (!redis) return process.env.NODE_ENV === 'test';

    try {
      await redis.set(this.getKey(positionId), JSON.stringify(normalized), {
        PX: DEFAULT_TTL_MS,
      });
      return true;
    } catch {
      // Non-blocking: in-memory copy is still available in current process.
      return false;
    }
  }

  async deletePositionRuntimeState(positionId: string) {
    this.memory.delete(positionId);
    const redis = await this.getRedisClient();
    if (!redis) return process.env.NODE_ENV === 'test';

    try {
      await redis.del(this.getKey(positionId));
      return true;
    } catch {
      // Best-effort delete.
      return false;
    }
  }
}

export const runtimePositionStateStore = new RuntimePositionStateStore();
