# LUC-5250 Production Performance And Server Health Watch - 2026-06-20

## Status

- Result: `DELEGATED / PARTIALLY_VERIFIED / API_LOW_SECOND_OUTLIERS / COOLIFY_VPS_BINDINGS_BLOCKED`
- Issue: [LUC-5250](/LUC/issues/LUC-5250)
- Follow-up: [LUC-5252](/LUC/issues/LUC-5252)
- Checked at: 2026-06-20T18:30Z
- Production Web: `https://soar.luckysparrow.ch`
- Production API: `https://api.soar.luckysparrow.ch`
- Build-info SHA: `42177530f2a2ddc22832133b545bccab6ab404eb`
- Build-info source: `env-runtime` (diagnostic-only provenance)

## Scope

Read-only DRE health checkpoint for public production reachability, public
timing, protected auth/session behavior, and Coolify/VPS binding readiness.

No deploy, push, restart, rollback, env edit, secret/account readback,
database/Redis mutation, raw log capture, screenshot, exchange action, order,
position, payment/subscription mutation, or live-trading action occurred.

## Public Smoke

Command:

```powershell
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `PASS`

- API `/health` -> `200`
- API `/ready` -> `200`
- Web `/` -> `200`
- Web `/api/build-info` -> `200`

Build-info readback:

- `gitSha`: `42177530f2a2ddc22832133b545bccab6ab404eb`
- `gitRef`: `main`
- `buildId`: `Urnq8xtZUh932c0e3vKGl`
- `metadataSource`: `env-runtime`
- `checkedAt`: `2026-06-20T18:24:06.049Z`

## Public Timing

PowerShell `Invoke-WebRequest` first pass returned `200` for all five targets,
but produced broad multi-second timings across Web and API. A focused
`curl.exe` recheck did not reproduce Web latency, so the PowerShell pass is
treated as a noisy local measurement, not a Web incident.

`curl.exe` five-sample timing:

| Target | Result | Max | Average | Samples |
| --- | --- | ---: | ---: | --- |
| Web `/` | 5/5 `200` | `237 ms` | `151.2 ms` | `237`, `132`, `118`, `121`, `148` |
| Web `/auth/login` | 5/5 `200` | `119 ms` | `110.8 ms` | `116`, `106`, `105`, `119`, `108` |
| Web `/api/build-info` | 5/5 `200` | `110 ms` | `92.2 ms` | `92`, `89`, `101`, `69`, `110` |
| API `/health` | 5/5 `200` | `1374 ms` | `973.4 ms` | `994`, `1284`, `1061`, `1374`, `154` |
| API `/ready` | 5/5 `200` | `1314 ms` | `566 ms` | `1314`, `1138`, `137`, `157`, `84` |

Classification:

- Web public surfaces are currently responsive.
- API `/health` and `/ready` have recurring low-second tail latency, without
  timeout in this checkpoint.
- The symptom is narrower than the earlier [LUC-5198](/LUC/issues/LUC-5198)
  `/ready` `21048 ms` timeout, but it is not fully healthy.

## Protected Auth Proof

Command:

```powershell
$env:PROD_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:PROD_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:prod-auth:proof -- --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --i-understand-production-auth-proof --output-json history/evidence/luc-5250-prod-auth-session-browser-proof-2026-06-20.json --output-md history/evidence/luc-5250-prod-auth-session-browser-proof-2026-06-20.md
```

Result artifact: `PASS`

The shell command timed out after the proof wrote complete redacted artifacts,
so the timeout is classified as process cleanup friction, not auth proof
failure.

Passed checks:

- build-info freshness
- auth token resolved from login
- unauthenticated dashboard redirects to login
- authenticated dashboard renders
- invalid-token dashboard redirects to `/auth/login?session=expired`
- logout API clears session
- `/auth/me` after logout fails closed with `401`
- dashboard after logout redirects to login

Artifacts:

- `history/evidence/luc-5250-prod-auth-session-browser-proof-2026-06-20.md`
- `history/evidence/luc-5250-prod-auth-session-browser-proof-2026-06-20.json`

## Coolify / VPS Binding Gate

Commands:

```powershell
pnpm run -s ops:coolify-stack:env-check:test
pnpm run -s ops:coolify-stack:env-check
```

Results:

- `ops:coolify-stack:env-check:test`: `PASS`, `11/11`
- `ops:coolify-stack:env-check`: `FAIL_CLOSED`, required present `0/16`

The current DRE runner still lacks approved read-only binding families needed
for full Coolify/VPS/DB/worker health readback. Existing owner path:
[LUC-4811](/LUC/issues/LUC-4811) with control-plane unblocker
[LUC-5075](/LUC/issues/LUC-5075).

## Follow-Up

Created [LUC-5252](/LUC/issues/LUC-5252) for one narrow DRE/Ops correlation
pass on recurring API `/health` and `/ready` low-second latency outliers.

Do not create another broad Coolify/VPS binding issue from this checkpoint.
The existing binding path remains [LUC-4811](/LUC/issues/LUC-4811) and
[LUC-5075](/LUC/issues/LUC-5075).

## Cleanup

- Validation-created profile `.tmp/prod-auth-cdp-1781979872238` was removed.
- Validation-owned Edge rows for that profile were terminated or no longer
  present on final process check.
- Older `.tmp/prod-auth-cdp-*` profiles were not touched because they were not
  created by this heartbeat.
