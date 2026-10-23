import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { lockExchangeOrderIdentity } from './orders.exchangeIdentityLock';

describe('exchange order identity lock', () => {
  it('holds the same user and exchange order identity until the first transaction commits', async () => {
    const identity = randomUUID();
    const competitor = new PrismaClient();
    let releaseFirst!: () => void;
    let firstLocked!: () => void;
    const holdFirst = new Promise<void>((resolve) => { releaseFirst = resolve; });
    const firstReady = new Promise<void>((resolve) => { firstLocked = resolve; });
    let secondStarted!: () => void;
    const secondReady = new Promise<void>((resolve) => { secondStarted = resolve; });
    let secondEntered = false;
    const first = prisma.$transaction(async (tx) => {
      await lockExchangeOrderIdentity(tx, 'user-lock-test', identity);
      firstLocked();
      await holdFirst;
    });
    try {
      await firstReady;
      const second = competitor.$transaction(async (tx) => {
        secondStarted();
        await lockExchangeOrderIdentity(tx, 'user-lock-test', identity);
        secondEntered = true;
      });
      await secondReady;
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(secondEntered).toBe(false);
      releaseFirst();
      await Promise.all([first, second]);
      expect(secondEntered).toBe(true);
    } finally {
      releaseFirst();
      await first;
      await competitor.$disconnect();
    }
  });
});
