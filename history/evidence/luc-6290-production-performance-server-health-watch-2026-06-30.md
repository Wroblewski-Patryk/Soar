# LUC-6290 Production Performance And Server Health Watch - 2026-06-30

## Context

- Issue: [LUC-6290](/LUC/issues/LUC-6290)
- Role: Deployment and Reliability Engineer
- Stage: verification
- Environment: production
- API: `https://api.soar.luckysparrow.ch`
- Web: `https://soar.luckysparrow.ch`
- Boundary: read-only production health watch. No deploy, push, restart,
  rollback execution, env edit, secret/account value readback, DB/Redis
  mutation, raw log capture, production account mutation, subscription/payment
  mutation, exchange mutation, order, position, or live-trading action.

## Goal

Check whether production is responsive and operational, with special attention
to protected worker readiness, runtime freshness, rollback guard signals,
representative dashboard API timing, Coolify resource visibility, and the known
market-catalog cold-sample watch item.

## Constraints

- Use canonical production domains only.
- Use approved runner bindings by name/length only; do not print secret values.
- Keep checks read-only.
- Do not create duplicate repair work unless a new regression or unknown
  bottleneck is found.

## Verification

### Deploy Smoke

Command:

```powershell
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha c357d957741f56835f27a1fc3a948dad43a91036
```

Result: PASS.

- API `/health` -> `200`
- API `/ready` -> `200`
- Web `/` -> `200`
- Web `/api/build-info` -> `200`, `gitSha=c357d957741f56835f27a1fc3a948dad43a91036`
- API `/workers/ready` -> `200`

### Runtime Freshness

Command:

```powershell
pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
```

Result: PASS.

- worker heartbeat age: `1582 ms`
- market data age: `1582 ms`
- runtime signal lag: `0 ms`
- runtime sessions: `5` running, `0` stale session ids
- runtime decision activity: skipped by current optional contract

### Rollback Guard

Command:

```powershell
pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch
```

Result: PASS / rollback not required.

- checked at: `2026-06-29T22:22:49.392Z`
- `shouldRollback=false`
- reasons: `[]`
- workers: `ready`
- topology: `healthy`
- required worker families: `backtest`, `execution`, `market-data`, `market-stream`
- alerts: `[]`

### Representative Timing

Read-only custom timing probe using the same approved auth-token resolver.

- API `/health`: `200/200`, max `71.5 ms`
- API `/ready`: `200/200`, max `21.3 ms`
- Web `/`: `200/200`, max `96.4 ms`
- Web `/api/build-info`: `200/200`, max `28.5 ms`
- API `/auth/me`: `200/200`, max `28.1 ms`
- API `/dashboard/bots/strategy-drift`: `200/200`, max `37.6 ms`
- API `/dashboard/markets/catalog`: `200/200`, cold sample `1227.0 ms`, second sample `26.7 ms`
- Focused market-catalog follow-up: `200:90.1 ms`, `200:46.7 ms`, `200:43.0 ms`, `200:37.9 ms`

Interpretation: no evidence of the operator-reported severe ~60s dashboard
stall in this heartbeat. The known market-catalog cold first-sample pattern is
still present, but it normalized immediately and remained below `100 ms` in the
focused follow-up.

### Coolify Read-Only Projection

Read-only API projection with secret values redacted.

- `GET /api/v1/version` -> `200`
- `GET /api/v1/projects/{project}` -> `200`, project `Soar`
- `GET /api/v1/projects/{project}/environments` -> `200`, production environment id `6`
- `GET /api/v1/projects/{project}/production` -> `200`
- `GET /api/v1/resources` -> `200`
- project deployments endpoint -> `404`; global deployments endpoint -> `200`
- production resources: `6` applications, `1` PostgreSQL, `1` Redis
- PostgreSQL: `running:healthy`
- Redis: `running:healthy`
- deployments list: `8` rows, `8` queued
- application commit projection: `soar-web` reports Coolify commit
  `b894e5dd3061...`; `soar-api` and worker rows still report `HEAD`.

## Definition Of Done

- Public and protected production smoke checked.
- Runtime freshness and rollback guard checked.
- Representative timing checked.
- Coolify production resource projection checked without exposing secrets.
- Residual risks recorded.
- Paperclip issue disposition updated.

## Result Report

Status:
`DONE / VERIFIED_READ_ONLY / PRODUCTION_RUNTIME_HEALTHY / ROLLBACK_NOT_REQUIRED /
MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH`.

No new incident/repair child is required from this heartbeat.

Residual risks:

- Market catalog still has a cold first-sample shape, though much smaller than
  the prior severe dashboard-stall concern and immediately normalized.
- Coolify global deployments endpoint still exposes `8` queued rows.
- Coolify application rows still use mixed source projections: `HEAD` for API
  and workers, specific commit for Web.
- Production build-info still uses the already-known runtime metadata path and
  release-grade provenance remains a separate release/source gate.
- Host-level VPS pressure/log-window proof remains gated on approved read-only
  host-status credentials.

Source-control closure:

- Repo path: `C:/Personal/Projekty/Aplikacje/Soar`
- Files changed by this heartbeat: this evidence file, the matching task
  record, and top-of-file status summaries.
- Commit SHA: not committed; shared `main` is pre-existing dirty/divergent and
  this routine produced evidence/state only.
- Push status: not needed.
- Deploy impact: none.
