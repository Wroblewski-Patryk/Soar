# LUC-6215 Production Performance And Server Health Watch - 2026-06-29

## Context

- Issue: [LUC-6215](/LUC/issues/LUC-6215)
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

Interpretation: production is serving the latest accepted Web SHA from
[LUC-6180](/LUC/issues/LUC-6180), but build provenance remains a separate
release/source gate because `metadataSource=env-runtime` is diagnostic rather
than release-grade authoritative provenance.

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

- worker heartbeat freshness: PASS, age `10341 ms`, threshold `60000 ms`
- market data freshness: PASS, age `10341 ms`, threshold `120000 ms`
- runtime signal lag: PASS, age `0 ms`, threshold `90000 ms`
- runtime sessions: PASS, running count `5`, stale session ids `[]`
- runtime decision activity: SKIP, not required for running sessions

## Rollback Guard

Command:

```bash
ROLLBACK_GUARD_AUTH_EMAIL=$SMOKE_AUTH_EMAIL ROLLBACK_GUARD_AUTH_PASSWORD=$SMOKE_AUTH_PASSWORD pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch
```

Result:

- checked at `2026-06-29T08:21:42.496Z`
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
| API `/health` | `200` | 62.6 | 26.0 | 62.6, 16.2, 17.2, 18.0, 15.8 |
| API `/ready` | `200` | 24.2 | 20.1 | 19.5, 19.4, 19.4, 24.2, 18.0 |
| Web `/` | `200` | 102.1 | 38.6 | 102.1, 19.8, 23.9, 22.5, 24.6 |
| Web `/api/build-info` | `200` | 25.2 | 23.3 | 25.2, 20.5, 22.8, 23.0, 24.8 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Read-only authenticated sampling through the approved smoke credential family.
Three requests per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | ---: | ---: | ---: | --- |
| `/dashboard/bots` | `200` | 40.1 | 32.7 | 40.1, 28.9, 29.1 |
| `/dashboard/wallets` | `200` | 29.7 | 28.2 | 26.3, 28.6, 29.7 |
| `/dashboard/markets/catalog` | `200` | 1214.8 | 421.6 | 1214.8, 29.4, 20.6 |
| `/dashboard/strategies` | `200` | 27.8 | 23.9 | 23.3, 27.8, 20.7 |
| `/dashboard/backtests/runs` | `200` | 31.6 | 27.3 | 31.6, 25.4, 25.0 |
| `/dashboard/reports/cross-mode-performance` | `200` | 57.3 | 53.7 | 54.3, 57.3, 49.6 |
| `/dashboard/logs` | `200` | 33.1 | 29.6 | 33.1, 25.9, 29.7 |
| `/dashboard/profile/subscription` | `200` | 37.5 | 35.5 | 37.5, 32.4, 36.6 |
| `/admin/users` | `200` | 28.5 | 28.1 | 27.3, 28.5, 28.5 |
| `/admin/subscriptions/plans` | `200` | 31.1 | 30.1 | 29.5, 31.1, 29.6 |

Focused follow-up for `/dashboard/markets/catalog`, eight requests:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | ---: | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200` | 29.2 | 23.9 | 21.6, 27.5, 22.1, 22.9, 29.2, 24.2, 21.1, 23.0 |

Interpretation: the known market-catalog cold sample repeated once, then
normalized immediately. No persistent dashboard API stall or outage was
reproduced.

## Coolify Read-Only Projection

Environment binding shape check printed names and presence/length only:

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
| `GET /api/v1/version` | pass | 244 ms |
| `GET /api/v1/teams/current` | pass | 100 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass, project `Soar` | 60 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass, `1` row | 56 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass, production id `6` | 105 ms |
| `GET /api/v1/resources` | pass, `17` visible rows | 186 ms |
| `GET /api/v1/deployments` | pass, `8` rows | 56 ms |

Production resource projection from `/api/v1/resources`:

- applications: `soar-web`, `workers-backtest`, `workers-market-stream`,
  `workers-execution`, `soar-api`, `workers-market-data`
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
- Web build provenance remains diagnostic (`metadataSource=env-runtime`), not
  release-grade authoritative provenance.
- Host-level VPS pressure and sanitized log-window proof require approved
  read-only host-status credentials and are not claimed here.

No child repair issue was created from this heartbeat because the health watch
itself is the read-only diagnosis lane and no required production mutation was
identified.
