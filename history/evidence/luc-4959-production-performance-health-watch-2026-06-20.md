# LUC-4959 Production Performance And Server Health Watch - 2026-06-20

## Status

- Result: `PARTIALLY_VERIFIED / APP_HEALTHY / COOLIFY_VPS_BINDINGS_BLOCKED`
- Issue: [LUC-4959](/LUC/issues/LUC-4959)
- Role: 09 DRE (Deployment & Reliability Engineer)
- Checked at: `2026-06-20T08:20:59.311Z`
- Environment: production

## Scope

Read-only production health checkpoint for public Web/API availability,
public timing, Web build-info provenance, protected auth/session behavior, and
current-runner Coolify stack binding readiness.

No deploy, push, restart, rollback, env edit, secret/account readback,
database/Redis mutation, raw log capture, screenshot, exchange action, order,
position, payment/subscription mutation, or live-trading action occurred.

## Evidence

### Public Smoke

Command:

```powershell
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `PASS`

- API `/health` -> `200`
- API `/ready` -> `200`
- Web `/` -> `200`
- Web `/api/build-info` -> `200`

### Public Timing

Three samples per endpoint:

| Check | Status | Samples ms | Max ms |
| --- | ---: | --- | ---: |
| Web `/` | 200 | `150`, `28`, `21` | `150` |
| Web `/auth/login` | 200 | `39`, `28`, `23` | `39` |
| Web `/api/build-info` | 200 | `27`, `23`, `24` | `27` |
| API `/health` | 200 | `85`, `59`, `18` | `85` |
| API `/ready` | 200 | `37`, `23`, `19` | `37` |

### Build Info

- SHA: `42177530f2a2ddc22832133b545bccab6ab404eb`
- Ref: `main`
- Build id: `Urnq8xtZUh932c0e3vKGl`
- Metadata source: `env-runtime`
- Metadata generated at: `2026-06-15T21:00:54.489Z`
- Build-info checked at: `2026-06-20T08:20:59.148Z`

`metadataSource=env-runtime` remains diagnostic-only and not release-grade
provenance.

### Protected Auth Session

Command used process-local mapping from the approved audit binding names:

```powershell
$env:PROD_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL; $env:PROD_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD; pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-20 --output-json history/evidence/_artifacts-luc-4959-prod-auth-session-browser-proof-2026-06-20.json --output-md history/evidence/luc-4959-prod-auth-session-browser-proof-2026-06-20.md
```

Result: `PASS`

Evidence:

- `history/evidence/luc-4959-prod-auth-session-browser-proof-2026-06-20.md`
- `history/evidence/_artifacts-luc-4959-prod-auth-session-browser-proof-2026-06-20.json`

Redaction: no secret values, cookies, tokens, private headers, or response
bodies were written to artifacts.

### Coolify Stack Env Contract

Command:

```powershell
pnpm run -s ops:coolify-stack:env-check:test
```

Result: `PASS` (`11/11`)

Current-runner binding check:

```powershell
pnpm run -s ops:coolify-stack:env-check
```

Result: `FAIL_CLOSED`

- Required present: `0/16`
- Secret handling: values redacted; only variable names reported
- Missing required names include `SOURCE_COMMIT`, `SOURCE_BRANCH`,
  `COOLIFY_BRANCH`, service FQDNs, `DATABASE_URL`, `REDIS_URL`,
  `JWT_SECRET`, API-key encryption keys/version, and worker queue/mode names.

The runner also exposes no names in the DRE server-health families:
`COOLIFY*`, `VPS*`, `SSH*`, `SOAR_PROD*`, `PROD_DB_CHECK*`,
`PRODUCTION_DB_CHECK*`, `ROLLBACK_GUARD*`, `RC_*`, or `GATE*`.

## Cleanup

- No `chrome-headless-shell`, `chrome`, or `msedge` process rows were present
  after validation.
- Validation-created `.tmp/prod-auth-cdp-1781943684399` was removed.
- Older pre-existing `.tmp/prod-auth-*` directories were not modified.

## Residual Risk

Full server-health readback remains incomplete because the current DRE runner
does not expose approved read-only Coolify/VPS/DB/worker binding names. The
existing unblock path remains [LUC-4767](/LUC/issues/LUC-4767) ->
[LUC-4806](/LUC/issues/LUC-4806) -> [LUC-4811](/LUC/issues/LUC-4811).
