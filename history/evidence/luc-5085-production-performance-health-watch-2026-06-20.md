# LUC-5085 Production Performance And Server Health Watch - 2026-06-20

## Status

- Result: `INCIDENT_DELEGATED / PARTIALLY_VERIFIED / WEB_HOME_LATENCY_SPIKES / COOLIFY_VPS_BINDINGS_BLOCKED`
- Owner lane: DRE / Deployment and Reliability Engineer
- Environment: production
- Evidence date: 2026-06-20
- Scope: read-only production health, performance, protected auth/session, and local Coolify binding preflight.

## Wake Context

- Wake reason: `issue_assigned`
- Issue: [LUC-5085](/LUC/issues/LUC-5085) `[Soar] Production performance and server health watch`
- Pending comments: `0/0`
- Fallback fetch needed: `false`
- Checkout: already claimed by the harness; no checkout API call was repeated.

## Public Production Smoke

Command:

```powershell
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: PASS.

- API `/health` -> `200`
- API `/ready` -> `200`
- Web `/` -> `200`
- Web `/api/build-info` -> `200`

## Build-Info

Readback from `https://soar.luckysparrow.ch/api/build-info`:

- `gitSha`: `42177530f2a2ddc22832133b545bccab6ab404eb`
- `gitRef`: `main`
- `buildId`: `Urnq8xtZUh932c0e3vKGl`
- `metadataGeneratedAt`: `2026-06-15T21:00:54.489Z`
- `metadataSource`: `env-runtime`
- `checkedAt`: `2026-06-20T12:22:00.029Z`

Release provenance remains incomplete because `env-runtime` is diagnostic-only
for the current Web build-info gate.

## Public Timing Samples

Three samples per target, max observed:

| Target | Statuses | Max ms |
| --- | --- | ---: |
| Web `/` | `200,200,200` | `10512` |
| Web `/auth/login` | `200,200,200` | `117` |
| Web `/api/build-info` | `200,200,200` | `65` |
| API `/health` | `200,200,200` | `136` |
| API `/ready` | `200,200,200` | `73` |

Focused five-sample recheck for Web `/`:

| Sample | Status | ms | Bytes |
| ---: | ---: | ---: | ---: |
| 1 | `200` | `14701` | `41210` |
| 2 | `200` | `634` | `41210` |
| 3 | `200` | `266` | `41210` |
| 4 | `200` | `6293` | `41210` |
| 5 | `200` | `21953` | `41210` |

Focused Web `/` summary: max `21953 ms`, min `266 ms`, average `8769.4 ms`.
This is a user-visible production latency regression signal even though the
route returns HTTP `200`.

## Protected Auth / Session Proof

Command:

```powershell
$env:PROD_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL; $env:PROD_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD; pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-20 --output-json history/evidence/_artifacts-luc-5085-prod-auth-session-browser-proof-2026-06-20.json --output-md history/evidence/luc-5085-prod-auth-session-browser-proof-2026-06-20.md
```

Initial run without process-local name mapping failed before browser work with
`auth token was not available`. Secret-safe presence check showed
`PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD` present and `PROD_AUTH_*` absent. The retry
mapped names process-locally without printing or storing credential values.

Result: PASS.

Evidence:

- `history/evidence/luc-5085-prod-auth-session-browser-proof-2026-06-20.md`
- `history/evidence/_artifacts-luc-5085-prod-auth-session-browser-proof-2026-06-20.json`

Redaction: no credentials, cookies, tokens, private headers, or response bodies
were written to artifacts.

## Coolify / VPS Binding Preflight

Focused checker tests:

```powershell
pnpm run -s ops:coolify-stack:env-check:test
```

Result: PASS (`11/11`).

Current-runner binding check:

```powershell
pnpm run -s ops:coolify-stack:env-check
```

Result: FAIL closed.

- Required present: `0/16`
- Secret handling: values redacted; only variable names reported.

## Blockers And Follow-Up

Full server-health readback remains blocked because this DRE runner still lacks
approved read-only Coolify/VPS/DB/worker status binding families. Existing
unblock chain remains:

[LUC-4767](/LUC/issues/LUC-4767) -> [LUC-4806](/LUC/issues/LUC-4806) ->
[LUC-4811](/LUC/issues/LUC-4811)

New performance follow-up: [LUC-5087](/LUC/issues/LUC-5087), assigned to 09
CTO for Web/runtime owner routing while FE is paused. Scope should remain
narrow: reproduce production Web home latency, identify whether the bottleneck
is Web rendering/runtime, network/Coolify routing, or upstream API/data fetch,
then patch or route to the owner with timing proof.

## Cleanup

- Validation-created `.tmp/prod-auth-cdp-1781958233614` was removed after
  verifying the resolved path was inside the workspace.
- Follow-up process check found no `chrome-headless-shell`, `chrome`, or
  `msedge` process rows; the check command returned no rows.

## Safety

No deploy, push, restart, rollback, env edit, secret/account readback,
database/Redis mutation, raw log capture, screenshot, exchange action, order,
position, payment/subscription mutation, or live-trading action occurred.
