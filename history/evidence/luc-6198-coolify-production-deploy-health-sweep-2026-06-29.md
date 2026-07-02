# LUC-6198 Coolify Production Deploy Health Sweep - 2026-06-29

## Context

- Issue: [LUC-6198](/LUC/issues/LUC-6198)
- Role: DRE
- Stage: verification
- Scope: read-only Coolify production deploy health sweep.
- Excluded: deploy, push, restart, rollback execution, environment edit,
  secret/account value readback, DB/Redis mutation, raw log capture,
  production account mutation, subscription/payment mutation, exchange
  mutation, order, position, and live-trading action.
- Wake context: `issue_assigned`, no pending comments,
  `fallbackFetchNeeded=false`; checkout was already claimed by the harness.

## Source And Build Snapshot

- Local repo path: `C:/Personal/Projekty/Aplikacje/Soar`
- Local `HEAD`: `5f7aea86f76e9b79bb087be72f6b0bc770b232bf`
- `origin/main`: `c357d957741f56835f27a1fc3a948dad43a91036`
- Worktree: dirty/divergent before this sweep (`main...origin/main`
  ahead `18`, behind `3`); no commit, push, or deploy was performed.
- Production Web `/api/build-info`:
  - `gitSha`: `c357d957741f56835f27a1fc3a948dad43a91036`
  - `gitRef`: `main`
  - `metadataSource`: `env-runtime`
  - `metadataGeneratedAt`: `2026-06-28T23:10:31.279Z`

Interpretation: production is serving the latest known accepted Web SHA from
[LUC-6180](/LUC/issues/LUC-6180), but release-grade provenance remains a
separate gate because `metadataSource=env-runtime` is diagnostic, not an
authoritative deploy-provenance source.

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

- worker heartbeat freshness: PASS, age `13474 ms`, threshold `60000 ms`
- market data freshness: PASS, age `13474 ms`, threshold `120000 ms`
- runtime signal lag: PASS, age `0 ms`, threshold `90000 ms`
- runtime sessions: PASS, running count `5`, stale session ids `[]`
- runtime decision activity: SKIP, not required for running sessions

Note: an initial direct wrapper invocation without the script-specific
`DEPLOY_FRESHNESS_*` auth env mapping failed closed with HTTP `401`. The
corrected no-secret env-name mapping above passed.

## Rollback Guard

Command:

```bash
ROLLBACK_GUARD_AUTH_EMAIL=$SMOKE_AUTH_EMAIL ROLLBACK_GUARD_AUTH_PASSWORD=$SMOKE_AUTH_PASSWORD pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch
```

Result:

- checked at `2026-06-29T07:57:30.609Z`
- `shouldRollback`: `false`
- reasons: `[]`
- workers ready status: `ready`
- topology status: `healthy`
- required worker families:
  `backtest`, `execution`, `market-data`, `market-stream`
- freshness: PASS
- runtime sessions: `5`
- alerts: `[]`

Note: an initial direct wrapper invocation without the script-specific
`ROLLBACK_GUARD_*` auth env mapping failed closed with HTTP `401` reasons for
protected endpoints. The corrected no-secret env-name mapping above passed.

## Public Timing

Eight requests per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | ---: | ---: | ---: | --- |
| API `/health` | `200` | 273.3 | 72.0 | 182.5, 273.3, 19.3, 20.4, 20.9, 18.6, 23.0, 17.8 |
| API `/ready` | `200` | 42.2 | 25.5 | 23.5, 20.7, 42.2, 21.0, 22.7, 24.8, 25.5, 23.8 |
| Web `/` | `200` | 89.4 | 33.4 | 89.4, 30.4, 25.1, 21.8, 27.2, 25.3, 23.4, 24.2 |
| Web `/api/build-info` | `200` | 29.0 | 25.1 | 24.4, 24.0, 23.6, 24.5, 29.0, 23.3, 24.5, 27.1 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Read-only authenticated sampling through the approved smoke credential family.
Three requests per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | ---: | ---: | ---: | --- |
| `/dashboard/bots` | `200` | 88.9 | 49.4 | 88.9, 29.4, 29.8 |
| `/dashboard/wallets` | `200` | 29.9 | 29.1 | 29.9, 28.0, 29.3 |
| `/dashboard/markets/catalog` | `200` | 1494.7 | 520.7 | 1494.7, 39.2, 28.1 |
| `/dashboard/strategies` | `200` | 199.9 | 85.1 | 25.3, 30.2, 199.9 |
| `/dashboard/backtests/runs` | `200` | 29.4 | 28.2 | 29.4, 27.9, 27.4 |
| `/dashboard/reports/cross-mode-performance` | `200` | 58.3 | 51.0 | 58.3, 51.3, 43.4 |
| `/dashboard/logs` | `200` | 34.8 | 30.5 | 34.8, 30.1, 26.7 |
| `/dashboard/profile/subscription` | `200` | 39.2 | 36.0 | 39.2, 35.9, 32.8 |
| `/admin/users` | `200` | 32.5 | 31.4 | 32.0, 32.5, 29.7 |
| `/admin/subscriptions/plans` | `200` | 30.9 | 25.7 | 30.9, 22.8, 23.5 |

Focused follow-up for `/dashboard/markets/catalog`, eight requests:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | ---: | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200` | 31.4 | 27.6 | 26.6, 24.3, 29.6, 31.4, 21.8, 30.9, 29.8, 26.3 |

Interpretation: the known market-catalog cold sample repeated once, then
normalized in focused follow-up. `/dashboard/strategies` had one sub-200 ms
warm sample tail. No persistent dashboard API stall or outage was reproduced.

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
| `GET /api/v1/version` | pass | 566 ms |
| `GET /api/v1/teams/current` | pass | 290 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass, project `Soar` | 50 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass, `1` row | 57 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass, production id `6` | 155 ms |
| `GET /api/v1/resources` | pass, `17` visible rows | 249 ms |
| `GET /api/v1/deployments` | pass, `8` rows | 56 ms |

Production environment id `6` exposes six application resources and two data
resources:

- applications: `soar-web`, `workers-backtest`, `workers-market-stream`,
  `workers-execution`, `workers-market-data`, `soar-api`
- data: `postgresql`, `redis`
- application statuses: `running:unknown`
- PostgreSQL/Redis statuses: `running:healthy`
- Coolify host/proxy projection: server reachable/usable, Traefik proxy
  `running`

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
guard, and data-resource health all passed.

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

No child repair issue was created from this heartbeat because the deploy health
sweep itself is the read-only diagnosis lane and no required production
mutation was identified.
