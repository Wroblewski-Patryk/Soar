# LUC-4929 Coolify Production Deploy Health Sweep

## Status

- Result: `PARTIALLY_VERIFIED / APP_HEALTHY / DEPLOY_PROVENANCE_AND_COOLIFY_BINDINGS_BLOCKED`
- Issue: [LUC-4929](/LUC/issues/LUC-4929)
- Environment: production
- Evidence date: 2026-06-20
- DRE scope: read-only production health sweep and deploy diagnosis boundary.

## Summary

The current DRE runner verified public Web/API health, current Web build-info
readback, public route timing, protected auth/session browser behavior, and the
local Coolify env-check contract. It could not complete Coolify/VPS deploy row,
resource, log, restart, or server-pressure diagnosis because the runner still
does not expose approved read-only Coolify/VPS binding families.

## Production Readback

- Web build-info URL: `https://soar.luckysparrow.ch/api/build-info`
- Observed SHA: `42177530f2a2ddc22832133b545bccab6ab404eb`
- Branch/ref: `main`
- Build id: `Urnq8xtZUh932c0e3vKGl`
- Metadata source: `env-runtime`
- Checked at: `2026-06-20T07:31:16.675Z`

`metadataSource=env-runtime` is diagnostic-only. The Web deploy provenance
gate correctly failed closed even though the SHA matched.

## Checks

| Check | Result | Evidence |
| --- | --- | --- |
| Public deploy smoke | PASS | `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` |
| Build-info readback | PASS for reachability/current SHA | `gitSha=42177530f2a2ddc22832133b545bccab6ab404eb`, `metadataSource=env-runtime` |
| Release provenance wait gate | FAIL-CLOSED as expected | `node scripts/waitForWebBuildInfo.mjs --build-info-url https://soar.luckysparrow.ch/api/build-info --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --timeout-seconds 1 --interval-seconds 1 --request-timeout-ms 10000` failed with `unaccepted metadataSource=env-runtime` |
| Protected auth/session browser proof | PASS | `history/evidence/luc-4929-prod-auth-session-browser-proof-2026-06-20.md` |
| Coolify env-check unit contract | PASS | `pnpm run -s ops:coolify-stack:env-check:test` passed `11/11` |
| Current runner Coolify env-check | FAIL-CLOSED | `pnpm run -s ops:coolify-stack:env-check` reported required present `0/16`; values redacted |
| Browser/process cleanup | PASS | No `chrome-headless-shell`, `chrome`, or `msedge` process rows remained; validation-created `.tmp/prod-auth-cdp-1781940698096` was removed |

## Public Timing Samples

Three samples per target, max observed duration:

| Target | Statuses | Max |
| --- | --- | --- |
| Web `/` | `200,200,200` | `275 ms` |
| Web `/auth/login` | `200,200,200` | `68 ms` |
| Web `/api/build-info` | `200,200,200` | `41 ms` |
| API `/health` | `200,200,200` | `98 ms` |
| API `/ready` | `200,200,200` | `59 ms` |

## Binding Diagnosis

Names-only environment scan found:

- Present: `PROD_UI_AUDIT_AUTH_EMAIL`, `PROD_UI_AUDIT_AUTH_PASSWORD`,
  `LIVEIMPORT_READBACK_AUTH_EMAIL`, `LIVEIMPORT_READBACK_AUTH_PASSWORD`,
  `LIVEIMPORT_READBACK_OPS_BASIC_USER`, `LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD`.
- Missing for this issue: `COOLIFY*`, `VPS*`, `SSH*`, `SOAR_PROD*`,
  `PROD_DB_CHECK*`, `PRODUCTION_DB_CHECK*`, `ROLLBACK_GUARD*`, `RC_*`, and
  `GATE*` binding families.

The missing families prevent read-only verification of Coolify deployment rows,
active deploy queue, resource state, recent redacted deploy logs, restart
pressure, PostgreSQL/Redis/container health, VPS pressure, and worker
backlog/health.

## Final Disposition

- Production app surfaces checked here are healthy.
- Web source/SHA provenance is not release-grade because metadata remains
  `env-runtime`; a fresh approved `soar-web` redeploy must target a reconciled
  commit and produce `metadataSource=env`, `git`, or `git-files`.
- Coolify/VPS deploy diagnosis remains blocked on existing binding owner path:
  [LUC-4767](/LUC/issues/LUC-4767) -> [LUC-4806](/LUC/issues/LUC-4806) ->
  [LUC-4811](/LUC/issues/LUC-4811).

## Safety

No deploy, push, restart, rollback, environment edit, secret/account readback,
raw Coolify log capture, screenshot, database/Redis mutation, production account
mutation, exchange action, order, position, payment/subscription mutation, or
live-trading action occurred.
