# LUC-6271 Production Performance And Server Health Watch - 2026-06-30

## Context

- Issue: [LUC-6271](/LUC/issues/LUC-6271)
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
- Local `HEAD`: `1f7b8dc42be872634adbb28c954341aa8bb997da`
- `origin/main`: `c357d957741f56835f27a1fc3a948dad43a91036`
- Worktree: dirty/divergent before this sweep (`main...origin/main`
  ahead `19`, behind `3`); no commit, push, deploy, or restart was performed.
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

- worker heartbeat freshness: PASS, age `13646 ms`, threshold `60000 ms`
- market data freshness: PASS, age `13646 ms`, threshold `120000 ms`
- runtime signal lag: PASS, age `0 ms`, threshold `90000 ms`
- runtime sessions: PASS, running count `5`, stale session ids `[]`
- runtime decision activity: SKIP, not required for running sessions

## Rollback Guard

Command:

```bash
ROLLBACK_GUARD_AUTH_EMAIL=$SMOKE_AUTH_EMAIL ROLLBACK_GUARD_AUTH_PASSWORD=$SMOKE_AUTH_PASSWORD pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch
```

Result:

- checked at `2026-06-29T22:13:46.571Z`
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
| --- | --- | ---: | ---: | --- |
| API `/health` | `200,200,200,200,200` | 844.7 | 211.2 | 844.7, 69.6, 42.5, 42.4, 57.0 |
| API `/ready` | `200,200,200,200,200` | 110.2 | 60.5 | 110.2, 52.0, 50.7, 43.8, 45.9 |
| Web `/` | `200,200,200,200,200` | 226.3 | 161.6 | 226.3, 175.2, 118.4, 159.1, 129.1 |
| Web `/api/build-info` | `200,200,200,200,200` | 83.1 | 67.5 | 49.8, 69.8, 59.1, 75.7, 83.1 |

The first API `/health` request showed a sub-second cold sample and then
normalized. No public HTTP failure or persistent low-second tail was reproduced.

## Authenticated Dashboard API Timing

Read-only authenticated sampling through the approved smoke credential family.
Three requests per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/bots` | `200,200,200` | 157.5 | 111.0 | 157.5, 100.5, 75.1 |
| `/dashboard/wallets` | `200,200,200` | 31.4 | 28.1 | 24.5, 31.4, 28.4 |
| `/dashboard/markets/catalog` | `200,200,200` | 1678.1 | 581.4 | 1678.1, 28.3, 37.9 |
| `/dashboard/strategies` | `200,200,200` | 29.1 | 24.8 | 18.5, 29.1, 26.7 |
| `/dashboard/backtests/runs` | `200,200,200` | 30.9 | 29.2 | 28.3, 28.5, 30.9 |
| `/dashboard/reports/cross-mode-performance` | `200,200,200` | 54.5 | 51.0 | 54.5, 50.6, 47.9 |
| `/dashboard/logs` | `200,200,200` | 32.9 | 31.5 | 32.4, 29.3, 32.9 |
| `/dashboard/profile/subscription` | `200,200,200` | 43.2 | 36.6 | 43.2, 31.8, 34.8 |
| `/admin/users` | `200,200,200` | 52.3 | 37.1 | 34.4, 52.3, 24.7 |
| `/admin/subscriptions/plans` | `200,200,200` | 29.8 | 27.8 | 29.7, 29.8, 23.9 |

Focused follow-up for `/dashboard/markets/catalog`, eight requests:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200,200,200,200,200,200,200,200` | 40.5 | 32.4 | 25.1, 30.0, 32.1, 30.5, 35.5, 38.1, 40.5, 27.2 |

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
| `GET /api/v1/version` | pass | 426 ms |
| `GET /api/v1/teams/current` | pass | 131 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass, project `Soar` | 55 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass, `1` row | 60 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass, production id `6` | 104 ms |
| `GET /api/v1/resources` | pass, `17` visible rows | 179 ms |
| `GET /api/v1/deployments` | pass, `8` rows | 59 ms |

Production resource projection from
`/api/v1/projects/{configured-project-id}/production`:

- applications: `soar-web`, `workers-backtest`, `workers-market-stream`,
  `workers-execution`, `workers-market-data`, `soar-api`
- data: `postgresql`, `redis`
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
- API `/health` had one sub-second cold sample before normalizing; not a
  persistent performance failure in this window.
- Web build provenance remains diagnostic (`metadataSource=env-runtime`), not
  release-grade authoritative provenance.
- Host-level VPS pressure and sanitized log-window proof require approved
  read-only host-status credentials and are not claimed here.

No child repair issue was created from this heartbeat because the health watch
itself is the read-only diagnosis lane and no required production mutation was
identified.
