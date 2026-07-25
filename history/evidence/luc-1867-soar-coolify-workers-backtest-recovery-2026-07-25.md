# LUC-1867 Evidence

Date: 2026-07-25
Issue: `LUC-1867`
Scope: `workers-backtest` only
Mode: read-only diagnosis plus one targeted Coolify recovery action

## Current state before mutation

- Paperclip issue context:
  `LUC-1867 [Soar][Coolify] Diagnose and recover workers-backtest exited:unhealthy`
  under parent [LUC-25](/LUC/issues/LUC-25).
- Public production reachability before mutation:
  - `GET https://soar.luckysparrow.ch -> 200`
  - `GET https://api.soar.luckysparrow.ch/health -> 200`
  - `GET https://api.soar.luckysparrow.ch/ready -> 200`
  - `GET https://api.soar.luckysparrow.ch/workers/ready -> 401` (fail-closed)
- Read-only Coolify production inventory at `2026-07-25T20:14:32Z` showed:
  - `workers-backtest -> exited:unhealthy`
  - `workers-market-data -> exited:unhealthy`
  - `workers-execution -> running:unknown`
  - `workers-market-stream -> running:unknown`
  - `soar-web -> running:unknown`
  - `soar-api -> running:unknown`
  - `postgresql -> running:healthy`
  - `redis -> running:healthy`

## Config and code-path findings

- `workers-backtest` Coolify app readback before recovery reported:
  - `git_commit_sha=ca712e98b70e157b643db4f57726a02821a140bc`
  - `dockerfile_location=/apps/api/Dockerfile.worker.backtest`
  - `ports_exposes=3001`
  - `health_check_path=/`
  - `custom_start_command=null`
  - `last_online_at=2026-07-25 18:37:36`
- `workers-backtest` env-key presence included:
  - `NODE_ENV`
  - `DATABASE_URL`
  - `REDIS_URL`
  - `JWT_SECRET`
  - `API_KEY_ENCRYPTION_KEYS`
- `workers-backtest` env-key presence did not include:
  - `WORKER_MODE`
  - `WORKER_BACKTEST_OWNERSHIP`
  - `WORKER_BACKTEST_QUEUE`
- `soar-api` env-key presence did include:
  - `WORKER_MODE`
  - `WORKER_BACKTEST_OWNERSHIP`
  - `WORKER_BACKTEST_QUEUE`
  - `WORKER_MARKET_DATA_OWNERSHIP`
  - `WORKER_MARKET_DATA_QUEUE`
  - `WORKER_EXECUTION_QUEUE`
- Repo inspection confirmed:
  - [docker-compose.coolify.yml](/abs/path/C:/Personal/Projekty/Aplikacje/Soar/docker-compose.coolify.yml)
    defines `WORKER_MODE=split`,
    `WORKER_BACKTEST_OWNERSHIP=worker`,
    and `WORKER_BACKTEST_QUEUE=backtest` for the canonical worker stack.
  - [apps/api/Dockerfile.worker.backtest](/abs/path/C:/Personal/Projekty/Aplikacje/Soar/apps/api/Dockerfile.worker.backtest)
    runs `node dist/workers/backtest.worker.js`.
  - [apps/api/src/workers/backtest.worker.ts](/abs/path/C:/Personal/Projekty/Aplikacje/Soar/apps/api/src/workers/backtest.worker.ts)
    starts the backtest queue worker only when ownership resolves to `worker`.
  - [apps/api/src/workers/workerBootstrap.ts](/abs/path/C:/Personal/Projekty/Aplikacje/Soar/apps/api/src/workers/workerBootstrap.ts)
    always records heartbeats and does not itself explain an immediate hard exit.

## Targeted recovery action

- Target resource:
  project `Soar`, environment `production`, resource `workers-backtest`.
- Mutating action:
  `POST /api/v1/applications/{workers-backtest}/start`
- Response:
  - `200`
  - message: `Deployment request queued.`
  - deployment UUID: `ree11oesp4xmxlest1x0flim`
- Additional immediate probes:
  - `POST /api/v1/applications/{workers-backtest}/restart -> 200`
    with `Deployment already queued for this commit.`
  - `POST /api/v1/deploy { uuid: workers-backtest } -> 200`
    with the same already-queued outcome.

## Post-action verification

- Immediate readbacks for about thirty seconds still showed:
  - `workers-backtest -> exited:unhealthy`
  - `last_online_at=2026-07-25 18:37:36`
  - logs route `GET /applications/{uuid}/logs -> 400`
    with `Application is not running.`
- Direct deployment readback for `ree11oesp4xmxlest1x0flim` later showed:
  - `deployment status=finished`
  - `application status=running:unknown`
  - `application git_commit_sha=ca712e98b70e157b643db4f57726a02821a140bc`
  - `ports_exposes=3001`
  - `health_check_path=/`
- Reconciler readback at `2026-07-25T20:19:25Z` showed:
  - `workers-backtest -> running:unknown`
  - `workers-market-data -> exited:unhealthy`
  - all other Soar resources healthy or running
- Sequential acceptance-ledger refresh at `2026-07-25T20:19:26Z` no longer
  listed `workers-backtest`; the only remaining `coolify_resources_reconciled`
  blocker was:
  - `workers-market-data:exited:unhealthy`

## Public health confirmation

- Public Soar remained reachable throughout the recovery window:
  - `GET https://soar.luckysparrow.ch -> 200`
  - `GET https://api.soar.luckysparrow.ch/health -> 200`
  - `GET https://api.soar.luckysparrow.ch/ready -> 200`
  - `GET https://api.soar.luckysparrow.ch/workers/ready -> 401` (fail-closed)

## Follow-up ownership

- Remaining blocker:
  `workers-market-data -> exited:unhealthy`
- Follow-up issue created:
  [LUC-1868](/LUC/issues/LUC-1868)
  `[Soar][Coolify] Diagnose and recover workers-market-data exited:unhealthy`

## Conclusion

`workers-backtest` recovered after one targeted `start` action and a short
asynchronous wait for the queued deployment to finish. The overall acceptance
gate remains blocked, but no longer because of `workers-backtest`; the current
unhealthy resource is now isolated to `workers-market-data` under `LUC-1868`.
