# LUC-5206 Authenticated Production Acceptance And Performance Sweep

- Issue: [LUC-5206](/LUC/issues/LUC-5206)
- Date: 2026-06-20
- Owner lane: QA / Verification Engineer
- Stage: verification
- Disposition: `BLOCKED / PARTIALLY_VERIFIED / AUTH_PROOF_FAILED / COOLIFY_VPS_BINDINGS_BLOCKED`

## Scope

Read-only production acceptance and timing sweep for Soar. No deploy, push,
restart, rollback, env edit, database/Redis mutation, secret/account value
readback, screenshot, raw log capture, account mutation, exchange action,
order, position, payment/subscription mutation, or live-trading action occurred.

## Public Smoke

Command:

```powershell
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: PASS.

- API `/health` -> 200
- API `/ready` -> 200
- Web `/` -> 200
- Web `/api/build-info` -> 200

## Build Info

Command:

```powershell
Invoke-RestMethod -Uri 'https://soar.luckysparrow.ch/api/build-info' -TimeoutSec 15
```

Observed:

- `gitSha`: `42177530f2a2ddc22832133b545bccab6ab404eb`
- `gitRef`: `main`
- `buildId`: `Urnq8xtZUh932c0e3vKGl`
- `metadataSource`: `env-runtime`
- `checkedAt`: `2026-06-20T16:36:53.920Z`

`metadataSource=env-runtime` remains diagnostic-only release provenance, not a
release-grade build metadata source.

## Timing

Five-sample public timing with `curl.exe --max-time 8`:

| Target | 200 samples | Min ms | Max ms | Avg ms | Result |
| --- | ---: | ---: | ---: | ---: | --- |
| Web `/` | 5/5 | 121 | 281 | 162.0 | PASS |
| Web `/auth/login` | 5/5 | 107 | 225 | 133.0 | PASS |
| Web `/api/build-info` | 5/5 | 81 | 2220 | 1270.2 | WARN |
| API `/health` | 5/5 | 80 | 2484 | 940.2 | WARN |
| API `/ready` | 5/5 | 92 | 199 | 127.8 | PASS |

The earlier PowerShell `Invoke-WebRequest` timing command exceeded the
120-second shell timeout, so `curl.exe` with per-request timeouts was used for
the recorded sample. Current public home performance did not reproduce the
earlier Web `/` multi-second spike, but build-info and API health showed
1-2.5s tail latency in this run.

## Authenticated UI Clickthrough

Command:

```powershell
pnpm run -s ops:ui:prod-clickthrough -- --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --output-json history/evidence/_artifacts-luc-5206-prod-ui-module-clickthrough-2026-06-20.json --output-md history/evidence/luc-5206-prod-ui-module-clickthrough-2026-06-20.md --today 2026-06-20
```

Result: PASS.

- Public routes: PASS 4
- Dashboard routes: PASS 18
- Admin routes: PASS 3
- Legacy redirects: PASS 3

Evidence:

- `history/evidence/luc-5206-prod-ui-module-clickthrough-2026-06-20.md`
- `history/evidence/_artifacts-luc-5206-prod-ui-module-clickthrough-2026-06-20.json`

## Protected Auth Session Browser Proof

Command used process-local mapping from `PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD` to
the proof script's `PROD_AUTH_EMAIL/PASSWORD` names. Secret values were not
printed or persisted.

```powershell
pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --output-json history/evidence/_artifacts-luc-5206-prod-auth-session-browser-proof-2026-06-20.json --output-md history/evidence/luc-5206-prod-auth-session-browser-proof-2026-06-20.md --today 2026-06-20
```

Result: FAIL. The report was written before the shell command exceeded the
184-second timeout.

Passing steps:

- build-info freshness
- auth token resolved from login
- unauthenticated dashboard redirects to login
- authenticated dashboard renders
- logout API clears session
- `/auth/me` after logout fails closed with 401
- dashboard after logout redirects to login

Failing step:

- invalid token redirects to `/auth/login` without `session=expired`

Evidence:

- `history/evidence/luc-5206-prod-auth-session-browser-proof-2026-06-20.md`
- `history/evidence/_artifacts-luc-5206-prod-auth-session-browser-proof-2026-06-20.json`

Existing repair issue: [LUC-5146](/LUC/issues/LUC-5146) is already open and
assigned to Frontend for this exact invalid-token expired-session redirect
contract.

## Coolify/VPS Binding Gate

Command:

```powershell
pnpm run -s ops:coolify-stack:env-check:test
```

Result: PASS, 11/11.

Command:

```powershell
pnpm run -s ops:coolify-stack:env-check
```

Result: FAIL closed.

- required present: 0/16
- missing required names include `SOURCE_COMMIT`, `SOURCE_BRANCH`,
  `COOLIFY_BRANCH`, `SERVICE_FQDN_API_3001`, `SERVICE_FQDN_WEB_3002`,
  `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, encryption key names, and worker
  queue/ownership names.
- secret-like values were not printed.

Full server-health readback remains blocked by [LUC-4811](/LUC/issues/LUC-4811).

## Cleanup

- Removed validation-created profile `.tmp/prod-auth-cdp-1781973624928` from
  the `LUC-5206` proof run.
- `Stop-Process`/`taskkill` were attempted against the `LUC-5206` Edge process
  rows after the proof command timed out.
- A later process check found a separate `node scripts/runProdAuthSessionBrowserProof.mjs`
  process writing `luc-5198-prod-auth-session-browser-proof-2026-06-20.*`,
  with an Edge child using `.tmp/prod-auth-cdp-1781974249661`. That process was
  not owned by `LUC-5206`, so it was left to its owning run after identification.
- Browser cleanup remains recorded as an environment hygiene risk because the
  shared CDP port/process model makes ownership checks mandatory before
  terminating browser rows.

## Final Result

`LUC-5206` cannot be accepted as done because a protected auth-session proof
failed and full server-health readback is still blocked.

Next owners/actions:

1. [LUC-5146](/LUC/issues/LUC-5146): Frontend decides/fixes the invalid-token
   `session=expired` redirect contract without weakening fail-closed auth.
2. [LUC-4811](/LUC/issues/LUC-4811): Security/Ops binding owner injects
   approved read-only Coolify/VPS/DB/worker status bindings into the DRE/QVE
   runtime.
3. QVE reruns this acceptance sweep after both blockers resolve.
