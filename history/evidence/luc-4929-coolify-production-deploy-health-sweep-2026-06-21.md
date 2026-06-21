# LUC-4929 Coolify Production Deploy Health Sweep Continuation

## Status

- Result: `DONE / VERIFIED_READ_ONLY / APP_HEALTHY / PROVENANCE_RESIDUAL_ROUTED`
- Issue: [LUC-4929](/LUC/issues/LUC-4929)
- Wake reason: `issue_blockers_resolved`
- Environment: production
- Evidence date: 2026-06-21
- Checked at: `2026-06-21T00:05:18Z` through `2026-06-21T00:07:16Z`

## Wake Delta

[LUC-4811](/LUC/issues/LUC-4811), the prior blocker for approved read-only
Coolify/VPS status bindings, is now `done`. This runner now exposes Coolify
binding names without value disclosure, so the deploy health sweep resumed.

## Secret Handling

Present by name without value disclosure:

- `COOLIFY_BASE_URL`
- `COOLIFY_API_TOKEN`
- `COOLIFY_TOKEN`
- `COOLIFY_SOAR_PROJECT_ID`
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`
- `COOLIFY_SOAR_TEAM_ID`
- `COOLIFY_TEAM_ID`
- `COOLIFY_SOAR_API_APP_ID`
- `COOLIFY_SOAR_WEB_APP_ID`
- `COOLIFY_SOAR_APP_ID`
- `COOLIFY_SOAR_POSTGRES_RESOURCE_ID`
- `COOLIFY_SOAR_REDIS_RESOURCE_ID`
- `VPS_HOST`
- `PROD_UI_AUDIT_ADMIN_EMAIL`
- `PROD_UI_AUDIT_ADMIN_PASSWORD`
- `PROD_UI_AUDIT_ADMIN_TOKEN`

Token values, raw configured ids, raw resource ids, internal URLs, cookies,
credentials, database values, labels, proxy settings, and raw log bodies were
not printed or stored.

## Coolify Read-Only Projection

Read-only `GET` calls succeeded for:

| Check | Result |
| --- | --- |
| `GET /api/v1/version` | pass |
| `GET /api/v1/teams/current` | pass; selector `LuckySparrow` |
| `GET /api/v1/projects` | pass; `5` visible project rows |
| `GET /api/v1/projects/{configured-project-id}` | pass; project `Soar` |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass; `production` |
| `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass |
| `GET /api/v1/resources` | pass; `17` visible global resource rows |
| `GET /api/v1/deployments` | pass; `0` visible deployment rows |

## Production Environment Inventory

| Resource | Type | Coolify status | Public FQDN | Commit metadata | Dockerfile | Restart count |
| --- | --- | --- | --- | --- | --- | ---: |
| `soar-api` | application | `running:unknown` | yes | `HEAD` | `/apps/api/Dockerfile` | 2 |
| `soar-web` | application | `running:unknown` | yes | `b894e5dd3061` | `/apps/web/Dockerfile` | 1 |
| `workers-backtest` | application | `running:unknown` | no | `HEAD` | `/apps/api/Dockerfile.worker.backtest` | 0 |
| `workers-execution` | application | `running:unknown` | no | `HEAD` | `/apps/api/Dockerfile.worker.execution` | 2 |
| `workers-market-data` | application | `running:unknown` | no | `HEAD` | `/apps/api/Dockerfile.worker.market-data` | 0 |
| `workers-market-stream` | application | `running:unknown` | no | `HEAD` | `/apps/api/Dockerfile.worker.market-stream` | 0 |
| `postgresql` | postgresql | `running:healthy` | no | n/a | n/a | 52 |
| `redis` | redis | `running:healthy` | no | n/a | n/a | 682 |

Counts:

- Production applications: `6`
- Production PostgreSQL resources: `1`
- Production Redis resources: `1`
- Production generic services: `0`
- Global visible Coolify resources: `17`
- Visible deployment rows: `0`

## App And Runtime Health

Public smoke passed:

```text
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Protected smoke passed with fresh login minted from env-bound admin
email/password. The pre-bound admin token path returned `401`, so the valid
evidence path is email/password login, not the stale token value.

```text
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb
```

Result:

- API `/health`: PASS `200`
- API `/ready`: PASS `200`
- Web `/`: PASS `200`
- Web `/api/build-info`: PASS `200`, expected SHA matched
- API `/workers/ready`: PASS `200`

Runtime freshness passed:

- worker heartbeat: PASS, `ageMs=14642`
- market data: PASS, `ageMs=14642`
- runtime signal lag: PASS, `ageMs=0`
- runtime sessions: PASS, `runningCount=5`, no stale session ids
- runtime decision activity: SKIP, not required for running sessions

Rollback guard passed:

- `shouldRollback=false`
- reasons: none
- workers ready: `status=ready`, `topologyStatus=healthy`
- required worker families: `backtest`, `execution`, `market-data`,
  `market-stream`
- alerts: none

Protected browser auth/session proof passed:

- Evidence: `history/evidence/luc-4929-prod-auth-session-browser-proof-2026-06-21.md`
- Raw JSON artifact: `history/artifacts/luc-4929-prod-auth-session-browser-proof-2026-06-21.json`

## Public Timing

Three-sample public timing maxes:

| Target | Statuses | Max |
| --- | --- | --- |
| Web `/` | `200,200,200` | `5528 ms` |
| Web `/auth/login` | `200,200,200` | `880 ms` |
| Web `/api/build-info` | `200,200,200` | `54 ms` |
| API `/health` | `200,200,200` | `97 ms` |
| API `/ready` | `200,200,200` | `119 ms` |

Follow-up Web `/` repeat:

| Repeat | Status | Duration |
| --- | --- | ---: |
| 0 | `200` | `14634 ms` |
| 1 | `200` | `108 ms` |
| 2 | `200` | `179 ms` |
| 3 | `200` | `187 ms` |
| 4 | `200` | `89 ms` |

Classification: Web root showed transient high-latency outliers, then recovered
to sub-200ms responses. This is a residual monitoring signal, not a deployment
mutation trigger by itself.

## Build-Info Provenance

Build-info readback:

- SHA: `42177530f2a2ddc22832133b545bccab6ab404eb`
- Ref: `main`
- Build id: `Urnq8xtZUh932c0e3vKGl`
- Metadata source: `env-runtime`
- Checked at: `2026-06-21T00:05:36.559Z`

The explicit Web build-info wait gate failed closed on
`unaccepted metadataSource=env-runtime`. This remains a release-provenance
residual already routed through [LUC-4912](/LUC/issues/LUC-4912) and does not
require this health-sweep issue to stay blocked.

## Cleanup

- No `chrome-headless-shell`, `chrome`, or `msedge` process rows remained.
- Current-run browser profile `.tmp/prod-auth-cdp-1782000362213` was removed.

## Final Disposition

The deploy health sweep is complete as a read-only diagnostic:

- Coolify project/environment/resource readback works.
- No visible active deployment rows were present.
- PostgreSQL and Redis report `running:healthy`.
- Public and protected app smoke passed.
- Runtime freshness passed.
- Rollback guard says rollback is not indicated.
- No mutation was performed.

Residuals stay routed outside this issue:

- Web build-info release provenance remains `env-runtime`; [LUC-4912](/LUC/issues/LUC-4912)
  remains the provenance/redeploy-approval lane.
- Web root latency outliers should remain in routine production performance
  watch, not trigger redeploy/restart by themselves.
- Coolify application rows still report `running:unknown`; app-level smoke and
  protected runtime checks provide the stronger readiness evidence.

## Safety

No deploy, push, restart, rollback, environment edit, database/Redis mutation,
secret/account value readback, raw log capture, screenshot, production account
mutation, exchange action, order, position, payment/subscription mutation, or
live-trading action occurred.
