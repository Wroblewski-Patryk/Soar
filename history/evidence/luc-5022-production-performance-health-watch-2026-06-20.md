# LUC-5022 Production Performance And Server Health Watch - 2026-06-20

## Status

- Result: `BLOCKED / PARTIALLY_VERIFIED / APP_HEALTHY / COOLIFY_VPS_BINDINGS_BLOCKED`
- Owner lane: DRE / Deployment and Reliability Engineer
- Environment: production
- Evidence date: 2026-06-20
- Scope: read-only production health, performance, protected auth/session, and local Coolify binding preflight.

## Wake Context

- Wake reason: `issue_assigned`
- Issue: [LUC-5022](/LUC/issues/LUC-5022) `[Soar] Production performance and server health watch`
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
- `checkedAt`: `2026-06-20T10:22:28.168Z`

Release provenance remains incomplete because `env-runtime` is diagnostic-only
for the current Web build-info gate.

## Public Timing Samples

Three samples per target, max observed:

| Target | Status | Max ms |
| --- | ---: | ---: |
| Web `/` | `200` | `411` |
| Web `/auth/login` | `200` | `59` |
| Web `/api/build-info` | `200` | `30` |
| API `/health` | `200` | `96` |
| API `/ready` | `200` | `46` |

## Protected Auth / Session Proof

Command:

```powershell
pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-20 --output-json history/evidence/_artifacts-luc-5022-prod-auth-session-browser-proof-2026-06-20.json --output-md history/evidence/luc-5022-prod-auth-session-browser-proof-2026-06-20.md
```

The command used process-local mapping from pre-bound
`PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD` to the script's `PROD_AUTH_*` names.

Result: PASS.

Evidence:

- `history/evidence/luc-5022-prod-auth-session-browser-proof-2026-06-20.md`
- `history/evidence/_artifacts-luc-5022-prod-auth-session-browser-proof-2026-06-20.json`

Redaction: no credentials, cookies, tokens, private headers, or response bodies
were written to the artifacts.

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
- Missing required runtime names include source/build, service FQDN, database,
  Redis, JWT/API key encryption, worker mode, worker ownership, and worker
  queue bindings.

## Blocker

Full server-health readback remains blocked because this DRE runner still lacks
approved read-only Coolify/VPS/DB/worker status binding families. Existing
unblock chain remains:

[LUC-4767](/LUC/issues/LUC-4767) -> [LUC-4806](/LUC/issues/LUC-4806) ->
[LUC-4811](/LUC/issues/LUC-4811)

Named unblock action: Security/Ops secret-binding owner must inject approved
read-only Coolify/VPS status bindings into the DRE runtime, then wake DRE to
rerun deploy rows, active deploy queue, redacted resource/log/status projection,
VPS pressure, PostgreSQL/Redis/container health, and worker health.

## Cleanup

- Initial process check after auth proof briefly saw Chrome rows.
- Follow-up process check found no `chrome-headless-shell`, `chrome`, or
  `msedge` rows, so no process kill was required.
- Validation-created `.tmp/prod-auth-cdp-1781950962381` was removed after
  verifying the resolved path was inside the workspace.

## Safety

No deploy, push, restart, rollback, env edit, secret/account readback,
database/Redis mutation, raw log capture, screenshot, exchange action, order,
position, payment/subscription mutation, or live-trading action occurred.
