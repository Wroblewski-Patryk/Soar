# LUC-5032 Authenticated Production Acceptance And Performance Sweep

- Checked at (UTC): 2026-06-20T10:36:42Z
- Owner: 09 QVE (QA & Verification Engineer)
- Mode: read-only authenticated production acceptance and performance sweep

## Result

Status: `PARTIALLY_VERIFIED / PRODUCTION_APP_HEALTHY / COOLIFY_VPS_READBACK_BLOCKED`.

Public Web/API smoke, authenticated route/module clickthrough, and protected
auth/session browser proof all passed on production build
`42177530f2a2ddc22832133b545bccab6ab404eb` on `main`.

Full Coolify/VPS/DB/worker server-health readback remains blocked because this
QVE runner exposes no approved read-only status binding families. The existing
unblock path remains [LUC-4767](/LUC/issues/LUC-4767) ->
[LUC-4806](/LUC/issues/LUC-4806) -> [LUC-4811](/LUC/issues/LUC-4811).

No deploy, push, restart, rollback, environment edit, database/Redis mutation,
production account mutation, subscription/payment mutation, exchange action,
order, position, secret readback, screenshot, raw log capture, or live-trading
action was performed.

## Public Smoke

`pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`

Result: PASS.

- API `/health` -> PASS `200`
- API `/ready` -> PASS `200`
- Web `/` -> PASS `200`
- Web `/api/build-info` -> PASS `200`

## Build-Info

- `gitSha`: `42177530f2a2ddc22832133b545bccab6ab404eb`
- `gitRef`: `main`
- `buildId`: `Urnq8xtZUh932c0e3vKGl`
- `metadataGeneratedAt`: `2026-06-15T21:00:54.489Z`
- `metadataSource`: `env-runtime`
- `checkedAt`: `2026-06-20T10:36:42.871Z`

`env-runtime` remains diagnostic-only for release-grade provenance.

## Public Timing Samples

Three no-cache read-only samples per target:

| Surface | Statuses | Min | Avg | Max |
| --- | --- | ---: | ---: | ---: |
| Web `/` | `200,200,200` | 26 ms | 101 ms | 248 ms |
| Web `/auth/login` | `200,200,200` | 22 ms | 25 ms | 29 ms |
| Web `/api/build-info` | `200,200,200` | 25 ms | 27 ms | 28 ms |
| API `/health` | `200,200,200` | 17 ms | 57 ms | 79 ms |
| API `/ready` | `200,200,200` | 20 ms | 23 ms | 25 ms |

## Authenticated UI Clickthrough

`pnpm run -s ops:ui:prod-clickthrough -- --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-20 --output-json history/evidence/_artifacts-luc-5032-prod-ui-module-clickthrough-2026-06-20.json --output-md history/evidence/luc-5032-prod-ui-module-clickthrough-2026-06-20.md`

Result: PASS.

- Public routes: PASS:4
- Dashboard routes: PASS:18
- Admin routes: PASS:3
- Legacy redirects: PASS:3
- Evidence: `history/evidence/luc-5032-prod-ui-module-clickthrough-2026-06-20.md`

## Protected Auth Session Proof

`pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-20 --output-json history/evidence/_artifacts-luc-5032-prod-auth-session-browser-proof-2026-06-20.json --output-md history/evidence/luc-5032-prod-auth-session-browser-proof-2026-06-20.md`

The command used process-local mapping from pre-bound
`PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD` to the script's `PROD_AUTH_*` names.

Result: PASS.

- Build-info freshness: PASS
- Auth token resolved by login: PASS
- Unauthenticated `/dashboard` redirects to login: PASS
- Authenticated `/dashboard` renders: PASS
- Invalid token redirects to expired-session login: PASS
- Logout API clears session: PASS
- `/auth/me` after logout fails closed: PASS `401`
- Dashboard after logout redirects to login: PASS
- Evidence: `history/evidence/luc-5032-prod-auth-session-browser-proof-2026-06-20.md`

## Coolify / VPS Readback

- `pnpm run -s ops:coolify-stack:env-check:test` -> PASS (`11/11`)
- `pnpm run -s ops:coolify-stack:env-check` -> FAIL closed
- Required present: `0/16`
- Secret handling: values redacted; only variable names reported

## Cleanup

- No running `chrome-headless-shell`, `chrome`, or `msedge` process rows after
  validation.
- Current validation-created profile directory
  `.tmp/prod-auth-cdp-1781951818370` was removed after path verification.
- Older pre-existing `.tmp/prod-auth-cdp-*` directories were left untouched.

## Disposition

Application-level authenticated production acceptance is healthy for this
checkpoint. Full server-health acceptance remains blocked until approved
read-only Coolify/VPS/DB/worker binding families are injected into a qualified
Ops/QVE runner.
