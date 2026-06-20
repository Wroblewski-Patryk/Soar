# LUC-4833 Authenticated Production Acceptance And Performance Sweep

- Checked at (UTC): 2026-06-20T04:40:49Z
- Owner: 09 QVE (QA & Verification Engineer)
- Mode: read-only authenticated production acceptance and performance sweep
- Scope: Soar public web/API smoke, authenticated route/module clickthrough,
  auth/session browser proof, public timing samples, and server-health binding
  availability

## Result

Status: partially verified / production app healthy / Coolify-VPS readback
blocked.

Public web/API smoke, protected auth/session browser proof, and authenticated
production UI route/module clickthrough all passed on production build
`42177530f2a2ddc22832133b545bccab6ab404eb` on `main`.

Coolify/VPS server-health readback did not run because this QVE runner exposes
no `COOLIFY*`, `VPS*`, `SSH*`, `SOAR_PROD*`, `PROD_DB_CHECK*`,
`PRODUCTION_DB_CHECK*`, `ROLLBACK_GUARD*`, `RC_*`, or `GATE*` binding names.
The existing blocker chain remains the correct unblock path:
[LUC-4767](/LUC/issues/LUC-4767) -> [LUC-4806](/LUC/issues/LUC-4806) ->
[LUC-4811](/LUC/issues/LUC-4811).

No deploy, push, restart, rollback, environment edit, database/Redis mutation,
production account mutation, subscription/payment mutation, exchange action,
order, position, secret readback, screenshot, raw log capture, or live-trading
action was performed.

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
| checkedAt | `2026-06-20T04:38:31.031Z` |

## Public Timing Samples

Each row used three no-cache read-only requests with a 15s timeout.

| Surface | Passes | Statuses | Min | Avg | Max |
| --- | ---: | --- | ---: | ---: | ---: |
| Web `/` | 3/3 | `200,200,200` | 58 ms | 117 ms | 227 ms |
| Web `/auth/login` | 3/3 | `200,200,200` | 53 ms | 58 ms | 62 ms |
| Web `/api/build-info` | 3/3 | `200,200,200` | 29 ms | 31 ms | 35 ms |
| API `/health` | 3/3 | `200,200,200` | 24 ms | 48 ms | 87 ms |
| API `/ready` | 3/3 | `200,200,200` | 29 ms | 31 ms | 32 ms |

## Authenticated UI Clickthrough

Command:

```bash
pnpm run -s ops:ui:prod-clickthrough -- --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-20 --output-json history/evidence/_artifacts-luc-4833-prod-ui-module-clickthrough-2026-06-20.json --output-md history/evidence/luc-4833-prod-ui-module-clickthrough-2026-06-20.md
```

Result: PASS.

Summary:

| Area | Result |
| --- | --- |
| Public routes | PASS:4 |
| Dashboard routes | PASS:18 |
| Admin routes | PASS:3 |
| Legacy redirects | PASS:3 |

Evidence:

- `history/evidence/luc-4833-prod-ui-module-clickthrough-2026-06-20.md`
- `history/evidence/_artifacts-luc-4833-prod-ui-module-clickthrough-2026-06-20.json`

## Protected Auth Session Proof

Command:

```bash
pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-20 --output-json history/evidence/_artifacts-luc-4833-prod-auth-session-browser-proof-2026-06-20.json --output-md history/evidence/luc-4833-prod-auth-session-browser-proof-2026-06-20.md
```

Result: PASS.

Key checks:

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

Evidence:

- `history/evidence/luc-4833-prod-auth-session-browser-proof-2026-06-20.md`
- `history/evidence/_artifacts-luc-4833-prod-auth-session-browser-proof-2026-06-20.json`

## Coolify/VPS Readback

Status: blocked by missing read-only bindings.

Names-only environment scan found only:

- `LIVEIMPORT_READBACK_AUTH_EMAIL`
- `LIVEIMPORT_READBACK_AUTH_PASSWORD`
- `LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD`
- `LIVEIMPORT_READBACK_OPS_BASIC_USER`
- `PROD_UI_AUDIT_AUTH_EMAIL`
- `PROD_UI_AUDIT_AUTH_PASSWORD`

Focused local checker contract:

```bash
pnpm run -s ops:coolify-stack:env-check:test
```

Result: PASS (`11/11`).

## Cleanup

- Narrow process check for `chrome-headless-shell`, `chrome`, and `msedge`:
  no matching running process rows after validation.
- The auth proof's validation-created `.tmp/prod-auth-cdp-*` profile directory
  was removed by the runner.

## Disposition

Application-level production acceptance is healthy for this checkpoint:
public smoke, authenticated route/module clickthrough, and protected
auth/session behavior all passed. Server-health proof remains incomplete until
the approved read-only Coolify/VPS binding families are injected into a
qualified DRE/QVE runner.
