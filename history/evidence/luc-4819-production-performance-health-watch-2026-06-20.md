# LUC-4819 Production Performance And Server Health Watch

- Checked at (UTC): 2026-06-20T04:30:39Z
- Owner: 09 DRE (Deployment & Reliability Engineer)
- Mode: read-only production performance and server-health watch
- Scope: Soar public web/API smoke, protected auth/session dashboard proof, and Coolify/VPS evidence availability

## Result

Status: partially verified / app healthy / Coolify-VPS readback blocked.

Public production web/API probes were responsive. The protected production
auth/session browser proof passed using the pre-bound
`PROD_UI_AUDIT_AUTH_EMAIL` / `PROD_UI_AUDIT_AUTH_PASSWORD` names without
printing or storing credentials, cookies, tokens, response bodies, or
screenshots.

Coolify/VPS server-health readback did not run because the current DRE runner
exposes no `COOLIFY*`, `VPS*`, `SSH*`, `SOAR_PROD*`, `PROD_DB_CHECK*`,
`PRODUCTION_DB_CHECK*`, `ROLLBACK_GUARD*`, `RC_*`, or `GATE*` binding names.
This is the same binding blocker already recorded by
[LUC-4767](/LUC/issues/LUC-4767), [LUC-4806](/LUC/issues/LUC-4806), and
[LUC-4811](/LUC/issues/LUC-4811), so this watch does not create a duplicate
incident.

No deploy, push, restart, rollback, environment edit, database/Redis mutation,
production account mutation, trading action, secret readback, screenshot, raw
log capture, or live-money action was performed.

## Public Smoke

Command:

```bash
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result:

| Check | Result |
| --- | --- |
| API `/health` | PASS `200` |
| API `/ready` | PASS `200` |
| Web `/` | PASS `200` |
| Web `/api/build-info` | PASS `200` |

Observed build-info:

| Field | Value |
| --- | --- |
| gitSha | `42177530f2a2ddc22832133b545bccab6ab404eb` |
| gitRef | `main` |
| metadataSource | `env-runtime` |
| metadataGeneratedAt | `2026-06-15T21:00:54.489Z` |
| checkedAt | `2026-06-20T04:30:39.367Z` |

## Public Timing Samples

Each row used three no-cache read-only requests with a 15s timeout.

| Surface | Passes | Statuses | Min | Avg | Max |
| --- | ---: | --- | ---: | ---: | ---: |
| Web `/` | 3/3 | `200,200,200` | 63 ms | 134 ms | 262 ms |
| Web `/auth/login` | 3/3 | `200,200,200` | 49 ms | 101 ms | 140 ms |
| Web `/api/build-info` | 3/3 | `200,200,200` | 29 ms | 33 ms | 40 ms |
| API `/health` | 3/3 | `200,200,200` | 32 ms | 59 ms | 104 ms |
| API `/ready` | 3/3 | `200,200,200` | 31 ms | 33 ms | 36 ms |

## Protected Dashboard Proof

Command:

```bash
pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof
```

with process-local mapping from `PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD` to the
script's `PROD_AUTH_EMAIL/PASSWORD` inputs and no stale token input.

Result: PASS.

Evidence:

- `docs/operations/prod-auth-session-browser-proof-current-2026-06-20.md`
- `docs/operations/_artifacts-prod-auth-session-browser-proof-current-2026-06-20.json`

Key protected checks:

| Check | Result |
| --- | --- |
| Build-info freshness | PASS |
| Auth token resolved by login | PASS |
| Unauthenticated `/dashboard` redirects to login | PASS |
| Authenticated `/dashboard` renders | PASS |
| Invalid token redirects to expired-session login | PASS |
| Logout API clears session | PASS |
| `/auth/me` after logout fails closed | PASS `401` |
| Dashboard after logout redirects to login | PASS |

## Coolify/VPS Readback

Status: blocked by missing read-only bindings.

Names-only environment scan found only:

- `LIVEIMPORT_READBACK_AUTH_EMAIL`
- `LIVEIMPORT_READBACK_AUTH_PASSWORD`
- `LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD`
- `LIVEIMPORT_READBACK_OPS_BASIC_USER`
- `PROD_UI_AUDIT_AUTH_EMAIL`
- `PROD_UI_AUDIT_AUTH_PASSWORD`

Missing binding families:

- Coolify deployment/status access
- VPS or SSH read-only status access
- Soar production project/environment/resource selectors
- PostgreSQL/Redis/container health projection
- rollback, RC, gate, and production DB-check inputs
- worker backlog/health projection from Coolify/VPS view

Focused local checker contract:

```bash
pnpm run -s ops:coolify-stack:env-check:test
```

Result: PASS (`11/11`).

## Cleanup

- Narrow process check for `chrome-headless-shell`, `chrome`, and `msedge`:
  no matching running process rows after validation.
- The validation-created profile directory
  `.tmp/prod-auth-cdp-1781929804785` was removed.
- Older pre-existing `.tmp/prod-auth-cdp-*` directories were not modified.

## Disposition

Public and protected app-level checks are healthy for this checkpoint.
Server-health proof remains incomplete because the DRE runtime still lacks the
approved read-only Coolify/VPS binding families. Existing blocker chain
[LUC-4767](/LUC/issues/LUC-4767) -> [LUC-4806](/LUC/issues/LUC-4806) ->
[LUC-4811](/LUC/issues/LUC-4811) remains the correct unblock path.
