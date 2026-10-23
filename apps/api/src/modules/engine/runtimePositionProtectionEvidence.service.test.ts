import { randomUUID } from 'node:crypto';
import { expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { markRuntimeProtectionArmed, protectionMatchesEvidence,
  readRuntimeProtectionEvidence } from './runtimePositionProtectionEvidence.service';

it('persists monotonic protection evidence and confirms TSL to TTP transition', async () => {
  const id = randomUUID();
  const user = await prisma.user.create({ data: {
    email: `protection-evidence-${id}@example.test`, password: 'test-only',
  } });
  try {
    const bot = await prisma.bot.create({ data: { userId: user.id, name: id,
      mode: 'LIVE', exchange: 'BINANCE', marketType: 'FUTURES',
      positionMode: 'ONE_WAY', liveOptIn: true } });
    const position = await prisma.position.create({ data: { userId: user.id,
      botId: bot.id, symbol: 'BTCUSDT', side: 'LONG', status: 'OPEN',
      quantity: 2, entryPrice: 95, origin: 'BOT', managementMode: 'BOT_MANAGED',
      runtimeTtpEverArmed: false, runtimeTslEverArmed: false } });
    const armed = { quantity: 2, averageEntryPrice: 95, currentAdds: 1,
      trailingAnchorPrice: 120, trailingTakeProfitHighPercent: 120 / 95 - 1,
      trailingTakeProfitStepPercent: 0.3 / 95,
      trailingTakeProfitActiveLevelIndex: 0 };
    vi.stubEnv('NODE_ENV', 'development');
    const baseline = await readRuntimeProtectionEvidence(position.id);
    expect(baseline).toEqual({ ttpEverArmed: false, tslEverArmed: false });
    const legacy = await prisma.position.create({ data: { userId: user.id,
      botId: bot.id, symbol: 'ETHUSDT', side: 'LONG', status: 'OPEN',
      quantity: 1, entryPrice: 100, origin: 'BOT', managementMode: 'BOT_MANAGED' } });
    expect(await readRuntimeProtectionEvidence(legacy.id))
      .toEqual({ ttpEverArmed: null, tslEverArmed: null });
    expect(protectionMatchesEvidence({ quantity: 1, averageEntryPrice: 100,
      currentAdds: 0 }, await readRuntimeProtectionEvidence(legacy.id))).toBe(false);
    expect(protectionMatchesEvidence({ ...armed,
      trailingTakeProfitHighPercent: undefined,
      trailingTakeProfitStepPercent: undefined,
      trailingTakeProfitActiveLevelIndex: undefined }, baseline)).toBe(true);
    expect(await markRuntimeProtectionArmed({ positionId: position.id,
      state: armed, evidence: baseline! })).toBe(true);
    expect(await markRuntimeProtectionArmed({ positionId: position.id,
      state: armed, evidence: baseline! })).toBe(false);
    const persisted = await readRuntimeProtectionEvidence(position.id);
    expect(persisted).toEqual({ ttpEverArmed: true, tslEverArmed: false });
    expect(protectionMatchesEvidence(armed, persisted)).toBe(true);
    expect(protectionMatchesEvidence({ quantity: 2, averageEntryPrice: 95,
      currentAdds: 1, trailingAnchorPrice: 120 }, persisted)).toBe(false);
    expect(await markRuntimeProtectionArmed({ positionId: position.id,
      state: { quantity: 2, averageEntryPrice: 95, currentAdds: 1 },
      evidence: persisted! })).toBe(false);
    expect(await markRuntimeProtectionArmed({ positionId: position.id,
      state: armed, evidence: persisted! })).toBe(true);
    expect(await readRuntimeProtectionEvidence(position.id)).toEqual(persisted);

    const transitioning = await prisma.position.create({ data: { userId: user.id,
      botId: bot.id, symbol: 'SOLUSDT', side: 'LONG', status: 'OPEN',
      quantity: 1, entryPrice: 100, origin: 'BOT', managementMode: 'BOT_MANAGED',
      runtimeTtpEverArmed: false, runtimeTslEverArmed: false } });
    const tsl = { quantity: 1, averageEntryPrice: 100, currentAdds: 0,
      trailingAnchorPrice: 100, trailingLossLimitPercent: -0.16,
      trailingLossActiveLevelIndex: 0 };
    const ttp = { quantity: 1, averageEntryPrice: 100, currentAdds: 0,
      trailingAnchorPrice: 121, trailingTakeProfitHighPercent: 0.21,
      trailingTakeProfitStepPercent: 0.01,
      trailingTakeProfitActiveLevelIndex: 0 };
    expect(await markRuntimeProtectionArmed({ positionId: transitioning.id,
      state: tsl, evidence: baseline! })).toBe(true);
    const tslEvidence = await readRuntimeProtectionEvidence(transitioning.id);
    expect(tslEvidence).toEqual({ ttpEverArmed: false, tslEverArmed: true });
    expect(protectionMatchesEvidence(tsl, tslEvidence)).toBe(true);
    expect(await markRuntimeProtectionArmed({ positionId: transitioning.id,
      state: ttp, evidence: tslEvidence! })).toBe(true);
    const both = await readRuntimeProtectionEvidence(transitioning.id);
    expect(both).toEqual({ ttpEverArmed: true, tslEverArmed: true });
    expect(protectionMatchesEvidence(ttp, both)).toBe(true);
    expect(protectionMatchesEvidence(tsl, both)).toBe(false);
    expect(protectionMatchesEvidence({ quantity: 1, averageEntryPrice: 100,
      currentAdds: 0 }, both)).toBe(false);
    expect(await markRuntimeProtectionArmed({ positionId: transitioning.id,
      state: tsl, evidence: tslEvidence! })).toBe(false);
  } finally {
    vi.unstubAllEnvs();
    await prisma.position.deleteMany({ where: { userId: user.id } });
    await prisma.bot.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
});
