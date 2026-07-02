# LUC-5596 Authenticated Production Acceptance And Performance Sweep

## Status

- Result: `DONE / VERIFIED_PRODUCTION / AUTHENTICATED_ACCEPTANCE_PASS / PERFORMANCE_PASS / RUNTIME_HEALTHY`.
- Environment: production.
- Evidence date: 2026-06-27.
- Deployed build-info:
  - `gitSha`: `42177530f2a2ddc22832133b545bccab6ab404eb`
  - `gitRef`: `main`
  - `buildId`: `Urnq8xtZUh932c0e3vKGl`
  - `metadataSource`: `env-runtime`
- Safety boundary:
  read-only verification only. No deploy, push, restart, rollback execution,
  env edit, secret/account readback, DB/Redis mutation, raw log capture,
  production account mutation, subscription/payment mutation, exchange
  mutation, order, position, or live-trading action occurred.

## Scope

Covered:

- public production smoke for API `/health`, API `/ready`, Web `/`, and Web
  `/api/build-info`
- protected `/workers/ready` through fresh login-derived auth
- production auth/session browser proof
- authenticated route/module clickthrough for public, dashboard, admin, and
  legacy redirect routes
- bounded public and authenticated API timing
- runtime freshness
- rollback guard
- browser validation process cleanup

Not covered:

- Coolify mutation, deploy, restart, rollback, or host-level VPS pressure/log
  capture
- exchange/API-key/payment/subscription mutation
- release-grade build provenance beyond public build-info readback

## Validation

### Deploy Smoke

Command:

```powershell
pnpm run -s ops:deploy:smoke
```

Environment was populated from `PROD_UI_AUDIT_*` secret references without
printing secret values. Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`, SHA matched
  `42177530f2a2ddc22832133b545bccab6ab404eb`
- PASS API `/workers/ready` -> `200`

### Auth Session Browser Proof

Command:

```powershell
pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --output-json history/artifacts/luc-5596-prod-auth-session-browser-proof-2026-06-27.json --output-md history/evidence/luc-5596-prod-auth-session-browser-proof-2026-06-27.md
```

Result: PASS. Covered unauthenticated redirect, authenticated dashboard render,
invalid-token expired-session redirect, logout, `/auth/me` fail-closed after
logout, and post-logout dashboard redirect.

### UI Module Clickthrough

Command:

```powershell
pnpm run -s ops:ui:prod-clickthrough -- --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --output-json history/artifacts/luc-5596-prod-ui-module-clickthrough-2026-06-27.json --output-md history/evidence/luc-5596-prod-ui-module-clickthrough-2026-06-27.md
```

Result: PASS.

- public routes: PASS `4/4`
- dashboard routes: PASS `18/18`
- admin routes: PASS `3/3`
- legacy redirects: PASS `3/3`

### Performance Timing

Artifact:
`history/artifacts/luc-5596-production-performance-timing-2026-06-27.json`.
Response bodies were discarded and not stored.

Public route samples:

| Target | Statuses | Max ms | p50 ms |
| --- | --- | ---: | ---: |
| API `/health` | `200:10` | 67.2 | 17.9 |
| API `/ready` | `200:10` | 25.5 | 21.0 |
| Web `/` | `200:10` | 196.7 | 27.4 |
| Web `/api/build-info` | `200:10` | 26.8 | 25.2 |

Authenticated API samples:

| Target | Statuses | Max ms |
| --- | --- | ---: |
| `/auth/me` | `200:3` | 27.7 |
| `/dashboard/bots` | `200:3` | 40.8 |
| `/dashboard/wallets` | `200:3` | 28.2 |
| `/dashboard/markets/universes` | `200:3` | 121.1 |
| `/dashboard/markets/catalog` | `200:3` | 46.0 |
| `/dashboard/strategies` | `200:3` | 25.9 |
| `/dashboard/strategies/indicators` | `200:3` | 25.7 |
| `/dashboard/backtests/runs` | `200:3` | 31.4 |
| `/dashboard/reports/cross-mode-performance` | `200:3` | 51.1 |
| `/dashboard/logs` | `200:3` | 44.2 |
| `/dashboard/profile/subscription` | `200:3` | 34.6 |
| `/admin/users` | `200:3` | 28.9 |
| `/admin/subscriptions/plans` | `200:3` | 129.3 |

Interpretation:
no HTTP failure, 60-second-class dashboard stall, or persistent low-second API
tail reproduced in this window.

### Runtime Freshness

Command:

```powershell
pnpm run -s ops:deploy:runtime-freshness
```

Result: PASS. Worker heartbeat, market data, runtime signal lag, and runtime
sessions passed; `runningCount=5`; no stale session ids.

### Rollback Guard

Command:

```powershell
pnpm run -s ops:deploy:rollback-guard
```

Result: PASS.

- `shouldRollback=false`
- workers ready: `ready`, topology `healthy`
- required worker families:
  `backtest`, `execution`, `market-data`, `market-stream`
- runtime freshness: PASS
- alerts: `[]`

### Process Cleanup

Pre-run and post-run narrow checks for `chrome-headless-shell`, `chrome`, and
`msedge` returned no remaining validation browser processes to clean up.

## Source-Control Closure

- Repository path: `C:\Personal\Projekty\Aplikacje\Soar`.
- Branch state before evidence closure:
  `main...origin/main [ahead 14, behind 1]`.
- Worktree state:
  pre-existing mixed dirty tree with state, generated graph/status files,
  package/script changes, and many untracked task/evidence artifacts from
  adjacent 2026-06-27 lanes.
- Commit: not committed. Reason: shared mixed-dirty divergent worktree; this
  QA heartbeat produced evidence only and did not own the broader dirty packet.
- Push: not needed.
- Deploy impact: none.

## Residual Risk

- Build-info still reports diagnostic `metadataSource=env-runtime`; release-
  grade build provenance remains a release/source-control owner gate.
- Host-level VPS pressure, proxy/container pressure, and sanitized log-window
  capture were not attempted because that requires approved read-only host
  status credentials outside this QA lane.
- This evidence does not authorize or prove exchange mutation, API-key changes,
  payment/subscription mutation, production DB mutation, or live trading.
