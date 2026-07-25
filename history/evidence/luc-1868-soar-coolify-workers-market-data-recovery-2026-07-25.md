# LUC-1868 Evidence

Date: 2026-07-25
Issue: `LUC-1868`
Scope: `workers-market-data` only
Mode: read-only diagnosis plus one targeted Coolify recovery attempt

## Current state before mutation

- Paperclip issue context:
  `LUC-1868 [Soar][Coolify] Diagnose and recover workers-market-data exited:unhealthy`
  under parent [LUC-25](/LUC/issues/LUC-25).
- Public production reachability before mutation:
  - `GET https://soar.luckysparrow.ch -> 200`
  - `GET https://api.soar.luckysparrow.ch/health -> 200`
  - `GET https://api.soar.luckysparrow.ch/ready -> 200`
  - `GET https://api.soar.luckysparrow.ch/workers/ready -> 401` with
    `{"error":{"message":"Missing token"}}` (fail-closed)
- Read-only Coolify production inventory at `2026-07-25T20:22:52.970Z` showed:
  - `workers-market-data -> exited:unhealthy`
  - `workers-backtest -> running:unknown`
  - `workers-execution -> running:unknown`
  - `workers-market-stream -> running:unknown`
  - `soar-web -> running:unknown`
  - `soar-api -> running:unknown`
  - `postgresql -> running:healthy`
  - `redis -> running:healthy`

## Config and code-path findings

- `workers-market-data` Coolify app readback before recovery reported:
  - `git_commit_sha=ca712e98b70e157b643db4f57726a02821a140bc`
  - `dockerfile_location=/apps/api/Dockerfile.worker.market-data`
  - `ports_exposes=3001`
  - `health_check_path=/`
  - `custom_start_command=null`
  - `last_online_at=2026-07-25 18:17:37`
- `workers-market-data` env-key presence included:
  - `NODE_ENV`
  - `DATABASE_URL`
  - `REDIS_URL`
  - `JWT_SECRET`
  - `API_KEY_ENCRYPTION_KEYS`
  - `API_KEY_ENCRYPTION_ACTIVE_VERSION`
  - `SOURCE_COMMIT`
- `workers-market-data` env-key presence did not include:
  - `WORKER_MODE`
  - `WORKER_MARKET_DATA_OWNERSHIP`
  - `WORKER_MARKET_DATA_QUEUE`
- `soar-api` env-key presence did include:
  - `WORKER_MODE`
  - `WORKER_MARKET_DATA_OWNERSHIP`
  - `WORKER_MARKET_DATA_QUEUE`
  - `WORKER_BACKTEST_OWNERSHIP`
  - `WORKER_BACKTEST_QUEUE`
  - `WORKER_EXECUTION_QUEUE`
- Repo inspection confirmed:
  - [docker-compose.coolify.yml](/abs/path/C:/Personal/Projekty/Aplikacje/Soar/docker-compose.coolify.yml)
    defines `WORKER_MODE=split`,
    `WORKER_MARKET_DATA_OWNERSHIP=worker`,
    and `WORKER_MARKET_DATA_QUEUE=market-data` for the canonical worker stack.
  - [apps/api/Dockerfile.worker.market-data](/abs/path/C:/Personal/Projekty/Aplikacje/Soar/apps/api/Dockerfile.worker.market-data)
    runs `node dist/workers/marketData.worker.js`.
  - [apps/api/src/workers/marketData.worker.ts](/abs/path/C:/Personal/Projekty/Aplikacje/Soar/apps/api/src/workers/marketData.worker.ts)
    starts the queue worker only when market-data ownership resolves to
    `worker`.
  - [apps/api/src/workers/workerOwnership.ts](/abs/path/C:/Personal/Projekty/Aplikacje/Soar/apps/api/src/workers/workerOwnership.ts)
    defaults production topology to degraded inline mode when
    `WORKER_MODE`/`WORKER_MARKET_DATA_OWNERSHIP` are absent.
  - [apps/api/src/workers/workerBootstrap.ts](/abs/path/C:/Personal/Projekty/Aplikacje/Soar/apps/api/src/workers/workerBootstrap.ts)
    records heartbeats but does not itself explain the hard stop.

## Targeted recovery action

- Target resource:
  project `Soar`, environment `production`, resource `workers-market-data`.
- Mutating action:
  `POST /api/v1/applications/{workers-market-data}/start`
- Response:
  - `403 Forbidden`
  - response body: none returned to this runner
- Additional read-only probe:
  - `GET /api/v1/applications/{uuid}/logs -> 400`
    with `Application is not running.`

## Post-action verification

- Repeated direct app readbacks for about forty seconds after the denied
  mutation still showed:
  - `workers-market-data -> exited:unhealthy`
  - `last_online_at=2026-07-25 18:17:37`
  - `restart_count=0`
  - `git_commit_sha=ca712e98b70e157b643db4f57726a02821a140bc`
- Refreshed reconciler at `2026-07-25T20:23:50.860Z` still showed:
  - `workers-market-data -> exited:unhealthy`
  - all other Soar resources healthy or running
- Refreshed acceptance ledger at `2026-07-25T20:23:49.692Z` still listed:
  - `coolify_resources_reconciled -> blocker`
  - reason:
    `Coolify resource inventory found unhealthy resources: workers-market-data:exited:unhealthy.`

## Public health confirmation

- Public Soar remained reachable throughout the diagnosis window:
  - `GET https://soar.luckysparrow.ch -> 200`
  - `GET https://api.soar.luckysparrow.ch/health -> 200`
  - `GET https://api.soar.luckysparrow.ch/ready -> 200`
  - `GET https://api.soar.luckysparrow.ch/workers/ready -> 401` (expected
    fail-closed without token)

## Blocker

- First-class blocker:
  the current Coolify runtime credential for this lane can read production app
  state but cannot execute the targeted `start` mutation for
  `workers-market-data`.
- Named unblock owner:
  Coolify credential owner / Ops Release Lead.
- Exact unblock action:
  grant deploy/start permission for this lane or execute the exact targeted
  `start`/`restart` against `workers-market-data`, then rerun:
  - `pnpm run softwarehouse:coolify-reconciler`
  - `pnpm run softwarehouse:soar-acceptance-ledger`

## Conclusion

`workers-market-data` remains the only unhealthy Soar production resource, and
the direct recovery lane is now blocked on Coolify mutation permission rather
than missing diagnosis. Public Soar remained healthy, configuration drift is
documented, and the acceptance blocker stays isolated to
`workers-market-data`.

## Resume-delta retry after blocker-resolution wake

- Wake context:
  `issue_blockers_resolved` resumed `LUC-1868` after
  [LUC-1871](/LUC/issues/LUC-1871) routed the least-privilege owner path above
  DRE.
- Fresh pre-action readback at `2026-07-25T20:38Z` still showed:
  - `workers-market-data -> exited:unhealthy`
  - `last_online_at=2026-07-25 18:17:37`
  - `restart_count=0`
  - `git_commit_sha=ca712e98b70e157b643db4f57726a02821a140bc`
- Fresh retry of the exact approved action:
  - `POST /api/v1/applications/{workers-market-data}/start -> 403 Forbidden`
  - response body: none returned to this runner
- Post-retry polling for about fifty seconds still showed:
  - `workers-market-data -> exited:unhealthy`
  - unchanged `last_online_at=2026-07-25 18:17:37`
  - unchanged `restart_count=0`
- Fresh read-only logs probe after the retry:
  - `GET /api/v1/applications/{uuid}/logs -> 400`
  - message class remained `Application is not running.`
- Public Soar remained healthy through the retry window:
  - `GET https://soar.luckysparrow.ch -> 200`
  - `GET https://api.soar.luckysparrow.ch/health -> 200`
  - `GET https://api.soar.luckysparrow.ch/ready -> 200`

### Updated blocker interpretation

- The earlier blocker did not resolve at runtime.
- The approved owner path did not actually grant a token that can execute the
  targeted Coolify write for `workers-market-data`.
- The live blocker is now narrower:
  the exact credential bound to this DRE recovery lane still lacks effective
  permission for `POST /api/v1/applications/{workers-market-data}/start`.

## Second blocker-resolution wake after LUC-1877

- Wake context:
  `issue_blockers_resolved` resumed `LUC-1868` after
  [LUC-1877](/LUC/issues/LUC-1877) closed with a new downstream operational
  owner path.
- Fresh pre-action readback at `2026-07-25T20:59Z` still showed:
  - `workers-market-data -> exited:unhealthy`
  - `last_online_at=2026-07-25 18:17:37`
  - `restart_count=0`
  - `git_commit_sha=ca712e98b70e157b643db4f57726a02821a140bc`
- Fresh retry of both exact allowed actions:
  - `POST /api/v1/applications/{workers-market-data}/start -> 403 Forbidden`
  - `POST /api/v1/applications/{workers-market-data}/restart -> 403 Forbidden`
  - response body: none returned to this runner in either call
- Public Soar remained healthy through the retry window:
  - `GET https://soar.luckysparrow.ch -> 200`
  - `GET https://api.soar.luckysparrow.ch/health -> 200`
  - `GET https://api.soar.luckysparrow.ch/ready -> 200`

### Updated blocker interpretation after LUC-1877

- The `LUC-1877` routing completion did not change the effective credential in
  this DRE lane.
- The parent issue now has a concrete live upstream owner path:
  [LUC-1879](/LUC/issues/LUC-1879)
  `[Softwarehouse][Ops Owner Path] Execute or designate board-capable Coolify recovery for workers-market-data`,
  which remains the active blocker above DRE.

## Final blocker-resolution wake after LUC-1879 and LUC-1882

- Wake context:
  `issue_blockers_resolved` resumed `LUC-1868` after
  [LUC-1879](/LUC/issues/LUC-1879) closed by integrating
  `LUC-1882` owner-executed recovery proof above DRE.
- Fresh live readback at `2026-07-25T21:38Z` showed:
  - `workers-market-data -> running:unknown`
  - `last_online_at=2026-07-25 21:38:36`
  - `restart_count=0`
  - unchanged `git_commit_sha=ca712e98b70e157b643db4f57726a02821a140bc`
- Upstream owner-path outcome confirmed in Paperclip:
  - `LUC-1879 -> done`
  - completion evidence cites exact owner recovery proof:
    `POST /api/v1/applications/{workers-market-data}/start -> 200`
  - child recovery proof came from `LUC-1882`
- Required post-recovery verification in this lane:
  - `pnpm run softwarehouse:coolify-reconciler -> overall=ready`
  - resource inventory now shows all 8/8 Soar production resources healthy
    enough for reconciliation, including
    `workers-market-data -> running:unknown`
  - `pnpm run softwarehouse:soar-acceptance-ledger`
    now reports `coolify_resources_reconciled -> pass`
  - public Soar smoke remained green:
    - `GET https://soar.luckysparrow.ch -> 200`
    - `GET https://api.soar.luckysparrow.ch/health -> 200`
    - `GET https://api.soar.luckysparrow.ch/ready -> 200`

### Closeout interpretation

- The production reliability objective of `LUC-1868` is satisfied:
  `workers-market-data` is no longer unhealthy and the reconciliation gate for
  this resource now passes.
- The acceptance ledger `overall` field remained `blocked`, but only because
  the Soar workspace has unrelated local source-control changes. That is a
  separate repository-governance gate, not a remaining runtime failure in
  `workers-market-data`.
