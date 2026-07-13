# LUC-910 Evidence

Date: 2026-07-13
Issue: `LUC-910`
Scope: `workers-backtest` only
Mode: read-only diagnosis plus one targeted Coolify recovery action

## Current state before mutation

- Paperclip heartbeat context confirmed:
  `LUC-910 [Soar][Coolify] Diagnose and recover workers-backtest exited:unhealthy`
  under parent [LUC-25](/LUC/issues/LUC-25).
- Public production reachability was healthy:
  - `GET https://api.soar.luckysparrow.ch/health -> 200`
  - `GET https://api.soar.luckysparrow.ch/ready -> 200`
  - `GET https://soar.luckysparrow.ch/ -> 200`
  - unauthenticated `GET https://api.soar.luckysparrow.ch/workers/ready -> 401` (fail-closed)
- Read-only Coolify production inventory showed:
  - `workers-backtest -> exited:unhealthy`
  - `workers-execution -> running:unknown`
  - `workers-market-data -> running:unknown`
  - `workers-market-stream -> running:unknown`
  - `soar-web -> running:unknown`
  - `soar-api -> running:unknown`
  - `postgresql -> running:healthy`
  - `redis -> running:healthy`

## Config and code-path findings

- `workers-backtest` Coolify env-key presence does not include:
  - `WORKER_MODE`
  - `WORKER_BACKTEST_OWNERSHIP`
  - `WORKER_BACKTEST_QUEUE`
- The API app env-key presence does include:
  - `WORKER_MODE`
  - `WORKER_BACKTEST_OWNERSHIP`
  - `WORKER_BACKTEST_QUEUE`
  - `WORKER_EXECUTION_QUEUE`
  - `WORKER_MARKET_DATA_OWNERSHIP`
  - `WORKER_MARKET_DATA_QUEUE`
- The other standalone worker apps also lack the split-worker topology keys.
- Repo inspection confirmed:
  - [docker-compose.coolify.yml](/abs/path/C:/Personal/Projekty/Aplikacje/Soar/docker-compose.coolify.yml) defines the canonical split-worker topology with `WORKER_BACKTEST_OWNERSHIP=worker`.
  - [workerOwnership.ts](/abs/path/C:/Personal/Projekty/Aplikacje/Soar/apps/api/src/workers/workerOwnership.ts) defaults backtest ownership to `inline` when the key is absent.
  - [backtest.worker.ts](/abs/path/C:/Personal/Projekty/Aplikacje/Soar/apps/api/src/workers/backtest.worker.ts) starts the Redis backtest worker only when ownership resolves to `worker`.
  - [Dockerfile.worker.backtest](/abs/path/C:/Personal/Projekty/Aplikacje/Soar/apps/api/Dockerfile.worker.backtest) runs `node dist/workers/backtest.worker.js`.

## Targeted recovery action

- Coolify app control route accepted a targeted `start` for `workers-backtest`.
- Response:
  - `200`
  - message: `Deployment request queued.`
  - deployment UUID: `p11k3l25xywflt0z0f3dpm32`

## Post-action verification

- Deployment queue readback after the `start`:
  - deployment `p11k3l25xywflt0z0f3dpm32`
  - application: `workers-backtest`
  - status: `in_progress`
  - commit: `b0b2c2ce9477a32fcda7717f447ad46aa4327589`
  - `restart_only=false`
- App readback after queued start still showed:
  - `status=exited:unhealthy`
  - `git_commit_sha=871783eadc0e6166b6712d6ada26ed175a505ce8`
  - `last_online_at=2026-07-12 14:34:25`
- Logs remained unavailable through the app logs route:
  - `GET /applications/{uuid}/logs -> 400`
  - message: `Application is not running.`
- Public Soar routes stayed healthy after the action:
  - API `/health -> 200`
  - Web `/ -> 200`

## Recovery confirmation

- Later independent reconciler reads from the Paperclip control-plane workspace
  at `2026-07-13T14:48:30Z`, `2026-07-13T14:50:08Z`, and
  `2026-07-13T14:52:17Z` consistently reported:
  - `workers-backtest -> running:unknown`
  - all 8/8 expected Soar production resources present
  - PostgreSQL and Redis `running:healthy`
  - reconciler `overall: ready`
- The Soar acceptance ledger then passed
  `coolify_resources_reconciled`; its only pre-commit blocker was this evidence
  bundle still being an intentional local source-control change.
- Public Soar remained reachable throughout the recovery window.

## Proof command location

- The issue definition referenced:
  - `pnpm run softwarehouse:coolify-reconciler`
  - `pnpm run softwarehouse:soar-acceptance-ledger`
- These are Softwarehouse control-plane commands and were executed from
  `C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse`, not from the Soar
  product checkout.

## Conclusion

The smallest governed recovery action restored the resource. Three later
readbacks consistently show `workers-backtest` running and the full production
inventory ready. The standalone-worker env-key difference remains an
observation for ordinary monitoring; it is not a proven root cause and does not
justify another production mutation while the worker is stable.
