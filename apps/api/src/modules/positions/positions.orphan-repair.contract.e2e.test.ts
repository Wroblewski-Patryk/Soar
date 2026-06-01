import express from 'express';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as livePositionReconciliationService from './livePositionReconciliation.service';
import positionsRouter from './positions.routes';
import * as positionsService from './positions.service';

describe('POST /dashboard/positions/orphan-repair contract', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects unauthenticated access', async () => {
    const app = express();
    app.use(express.json());
    app.use('/dashboard/positions', positionsRouter);

    const res = await request(app).post('/dashboard/positions/orphan-repair');
    expect(res.status).toBe(401);
  });

  it('returns composed repair payload for authenticated user', async () => {
    const app = express();
    app.use(express.json());
    app.use((req, _res, next) => {
      (req as { user?: { id: string } }).user = { id: 'user-contract-1' };
      next();
    });
    app.use('/dashboard/positions', positionsRouter);

    const localRepair = {
      scanned: 3,
      reboundToCanonicalBot: 2,
      closedDetachedOrphans: 1,
      unresolved: 0,
    };
    const exchangeReconciliation = {
      openPositionsSeen: 1,
      usersScanned: 1,
      created: 1,
      updated: 0,
      skipped: 0,
      diagnostics: [],
    };
    const takeoverRebind = {
      scanned: 1,
      rebound: 1,
      unresolved: 0,
    };
    const liveStatus = {
      running: true,
      iterations: 12,
      lastRunAt: '2026-05-31T18:00:00.000Z',
      lastDurationMs: 25,
      lastError: null,
      openPositionsSeen: 0,
      lastDiagnosticSummary: {
        CREATED: 0,
        UPDATED: 0,
        SKIPPED_ZERO_SIZE: 0,
        SKIPPED_UNRESOLVED_SIDE: 0,
        SKIPPED_UNRESOLVED_SYMBOL: 0,
        SKIPPED_MISSING_ENTRY_TRUTH: 0,
      },
      lastPositionDiagnostics: [],
    };

    const repairSpy = vi
      .spyOn(positionsService, 'repairLegacyOpenPositions')
      .mockResolvedValue(localRepair);
    const reconcileSpy = vi
      .spyOn(livePositionReconciliationService, 'reconcileExternalPositionsFromExchange')
      .mockResolvedValue(exchangeReconciliation as never);
    const rebindSpy = vi
      .spyOn(positionsService, 'rebindExternalTakeoverOwnership')
      .mockResolvedValue(takeoverRebind);
    vi.spyOn(livePositionReconciliationService.livePositionReconciliationLoop, 'getStatus').mockReturnValue(liveStatus);

    const res = await request(app).post('/dashboard/positions/orphan-repair');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      localRepair,
      exchangeReconciliation,
      takeoverRebind,
      liveStatus,
    });
    expect(repairSpy).toHaveBeenCalledWith('user-contract-1');
    expect(reconcileSpy).toHaveBeenCalledTimes(1);
    expect(rebindSpy).toHaveBeenCalledWith('user-contract-1');
  });
});
