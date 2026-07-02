# LUC-6252 Production Performance And Server Health Watch - 2026-06-29

## Context

- Issue: [LUC-6252](/LUC/issues/LUC-6252)
- Role: DRE
- Stage: verification
- Scope: read-only production performance and server-health watch.
- Wake context: `issue_assigned`, no pending comments,
  `fallbackFetchNeeded=false`; checkout was already claimed by the harness.
- Excluded: deploy, push, restart, rollback execution, environment edit,
  secret/account value readback, DB/Redis mutation, raw log capture,
  production account mutation, subscription/payment mutation, exchange
  mutation, order, position, and live-trading action.

## Source And Build Snapshot

- Local repo path: `C:/Personal/Projekty/Aplikacje/Soar`
- Local `HEAD`: `5f7aea86f76e9b79bb087be72f6b0bc770b232bf`
- `origin/main`: `c357d957741f56835f27a1fc3a948dad43a91036`
- Worktree: dirty/divergent before this sweep (`main...origin/main`
  ahead `18`, behind `3`); no commit, push, deploy, or restart was performed.
- Production Web `/api/build-info`:
  - `buildId`: `Q8qE8D5gjr56ByYySof9J`
  - `gitSha`: `c357d957741f56835f27a1fc3a948dad43a91036`
  - `gitRef`: `main`
  - `metadataGeneratedAt`: `2026-06-28T23:10:31.279Z`
  - `metadataSource`: `env-runtime`

Interpretation: production is still serving the latest accepted Web SHA, but
build provenance remains a separate release/source gate because
`metadataSource=env-runtime` is diagnostic rather than release-grade
authoritative provenance.

## Deploy Smoke

Command:

```bash
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`
- PASS API `/workers/ready` -> `200`

## Runtime Freshness

Command:

```bash
DEPLOY_FRESHNESS_AUTH_EMAIL=$SMOKE_AUTH_EMAIL DEPLOY_FRESHNESS_AUTH_PASSWORD=$SMOKE_AUTH_PASSWORD pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
```

Result:

- worker heartbeat freshness: PASS, age `8270 ms`, threshold `60000 ms`
- market data freshness: PASS, age `8270 ms`, threshold `120000 ms`
- runtime signal lag: PASS, age `0 ms`, threshold `90000 ms`
- runtime sessions: PASS, running count `5`, stale session ids `[]`
- runtime decision activity: SKIP, not required for running sessions

## Rollback Guard

Command:

```bash
ROLLBACK_GUARD_AUTH_EMAIL=$SMOKE_AUTH_EMAIL ROLLBACK_GUARD_AUTH_PASSWORD=$SMOKE_AUTH_PASSWORD pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch
```

Result:

- checked at `2026-06-29T21:04:40.545Z`
- `shouldRollback`: `false`
- reasons: `[]`
- workers ready status: `ready`
- topology status: `healthy`
- required worker families:
  `backtest`, `execution`, `market-data`, `market-stream`
- freshness: PASS
- runtime sessions: `5`
- alerts: `[]`

## Public Timing

Five requests per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | ---: | ---: | ---: | --- |
| API `/health` | `200` | 69.9 | 29.1 | 69.9, 20.8, 21.7, 17.0, 16.3 |
| API `/ready` | `200` | 21.0 | 19.4 | 20.6, 21.0, 18.5, 19.3, 17.5 |
| Web `/` | `200` | 90.7 | 38.0 | 90.7, 23.9, 21.4, 28.7, 25.3 |
| Web `/api/build-info` | `200` | 31.4 | 26.4 | 25.8, 23.9, 25.6, 25.1, 31.4 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Read-only authenticated sampling through the approved smoke credential family.
Three requests per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | ---: | ---: | ---: | --- |
| `/dashboard/bots` | `200` | 45.2 | 35.0 | 45.2, 31.6, 28.2 |
| `/dashboard/wallets` | `200` | 27.6 | 26.2 | 25.6, 27.6, 25.5 |
| `/dashboard/markets/catalog` | `200` | 1521.9 | 528.9 | 1521.9, 33.5, 31.4 |
| `/dashboard/strategies` | `200` | 30.5 | 27.2 | 30.5, 27.0, 24.1 |
| `/dashboard/backtests/runs` | `200` | 103.4 | 53.5 | 27.3, 29.8, 103.4 |
| `/dashboard/reports/cross-mode-performance` | `200` | 87.8 | 63.4 | 87.8, 54.4, 48.0 |
| `/dashboard/logs` | `200` | 46.3 | 40.2 | 46.3, 38.1, 36.2 |
| `/dashboard/profile/subscription` | `200` | 100.9 | 57.7 | 37.6, 100.9, 34.6 |
| `/admin/users` | `200` | 29.5 | 28.2 | 29.5, 27.8, 27.3 |
| `/admin/subscriptions/plans` | `200` | 39.9 | 33.1 | 39.9, 31.3, 28.1 |

Focused follow-up for `/dashboard/markets/catalog`, eight requests:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | ---: | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200` | 36.4 | 31.7 | 26.7, 36.4, 32.6, 32.4, 33.1, 29.7, 31.3, 31.5 |

Interpretation: the known market-catalog cold sample repeated once, then
normalized immediately. No persistent dashboard API stall or outage was
reproduced.

## Coolify Read-Only Projection

Environment binding shape check printed names and presence only:

- `COOLIFY_BASE_URL`: present
- `COOLIFY_API_TOKEN`: present
- `COOLIFY_TOKEN`: present
- `COOLIFY_SOAR_PROJECT_ID`: present
- `SMOKE_AUTH_TOKEN`: absent
- `SMOKE_AUTH_EMAIL`: present
- `SMOKE_AUTH_PASSWORD`: present

Authenticated Coolify `GET` projection:

| Check | Result | Timing |
| --- | --- | ---: |
| `GET /api/v1/version` | pass | 6392 ms |
| `GET /api/v1/teams/current` | pass | 127 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass, project `Soar` | 56 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass, `1` row | 48 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass, production id `6` | 158 ms |
| `GET /api/v1/resources` | pass, `17` visible rows | 267 ms |
| `GET /api/v1/deployments` | pass, `8` rows | 56 ms |

Production resource projection from `/api/v1/resources`:

- applications: `soar-web`, `workers-backtest`, `workers-market-stream`,
  `workers-execution`, `workers-market-data`, `soar-api`
- data: `postgresql`, `postgresql-database-w5gql24ddjrgjaid7110rcqo`,
  `redis`
- application statuses: `running:unknown`
- PostgreSQL/Redis statuses: `running:healthy`

Deployment rows remain queued:

| Resource | Commit | Status | Created |
| --- | --- | --- | --- |
| `workers-market-stream` | `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4` | `queued` | `2026-06-28T06:23:11Z` |
| `workers-execution` | `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4` | `queued` | `2026-06-28T06:23:11Z` |
| `workers-market-data` | `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4` | `queued` | `2026-06-28T06:23:11Z` |
| `soar-api` | `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4` | `queued` | `2026-06-28T06:23:12Z` |
| `workers-market-stream` | `c357d957741f56835f27a1fc3a948dad43a91036` | `queued` | `2026-06-28T23:09:40Z` |
| `workers-execution` | `c357d957741f56835f27a1fc3a948dad43a91036` | `queued` | `2026-06-28T23:09:40Z` |
| `soar-api` | `c357d957741f56835f27a1fc3a948dad43a91036` | `queued` | `2026-06-28T23:09:40Z` |
| `workers-market-data` | `c357d957741f56835f27a1fc3a948dad43a91036` | `queued` | `2026-06-28T23:09:40Z` |

Interpretation: queued Coolify deployment rows remain an Ops watch item and
deploy-path diagnosis signal. They are not a proven production outage in this
heartbeat because public/protected app smoke, runtime freshness, rollback
guard, authenticated API timing, and data-resource health all passed.

## Result

Disposition: `DONE / VERIFIED_READ_ONLY / APP_HEALTHY /
MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH`.

No production outage, rollback trigger, runtime freshness failure, protected
smoke failure, or persistent dashboard API performance stall was reproduced.

Residual risks:

- Coolify deployment queue still shows eight queued rows across the previous
  and current commit families for API/worker resources.
- Coolify application rows still report `running:unknown` even while public
  app smoke and resource-level data health pass.
- `/dashboard/markets/catalog` still shows one low-second cold sample before
  normalizing immediately.
- Web build provenance remains diagnostic (`metadataSource=env-runtime`), not
  release-grade authoritative provenance.
- Host-level VPS pressure and sanitized log-window proof require approved
  read-only host-status credentials and are not claimed here.

No child repair issue was created from this heartbeat because the health watch
itself is the read-only diagnosis lane and no required production mutation was
identified.

## Paperclip Control-Plane Update

- Attempted to PATCH [LUC-6252](/LUC/issues/LUC-6252) to `done` with the
  closure summary.
- Result: unconfirmed. `/api/health` timed out on the injected
  `PAPERCLIP_API_URL`, both `http://127.0.0.1:3200/api/health` and
  `http://127.0.0.1:3201/api/health` timed out, and the final issue PATCH
  aborted after the local timeout.
- Local disposition: product verification is `DONE`; Paperclip board status
  still needs the same closure summary applied when the control-plane API is
  reachable.
