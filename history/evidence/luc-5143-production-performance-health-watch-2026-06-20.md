# LUC-5143 Production Performance And Server Health Watch - 2026-06-20

## Status

- Result: `INCIDENT_DELEGATED / PARTIALLY_VERIFIED / PUBLIC_APP_HEALTHY / PROTECTED_AUTH_PROOF_FAILED`
- Owner lane: DRE / Deployment and Reliability Engineer
- Source issue: [LUC-5143](/LUC/issues/LUC-5143)
- Delegated repair: [LUC-5146](/LUC/issues/LUC-5146)
- Environment: production
- Evidence timestamp: `2026-06-20T14:28:35Z`

## Wake Context

- Wake reason: `issue_assigned`
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

Build-info readback:

- SHA: `42177530f2a2ddc22832133b545bccab6ab404eb`
- Branch: `main`
- Build id: `Urnq8xtZUh932c0e3vKGl`
- Metadata source: `env-runtime`
- Checked at: `2026-06-20T14:22:27.512Z`

`env-runtime` remains diagnostic-only for release provenance. It does not block
this read-only health watch, but it is not release-grade deploy provenance.

## Public Timing Recheck

Command shape:

```powershell
curl.exe -L -s -o NUL -w "%{http_code} %{time_starttransfer} %{time_total} %{size_download}" --max-time 30 <url>
```

Five samples per target:

| Target | Statuses | Total ms range | TTFB ms range | Bytes |
| --- | --- | ---: | ---: | ---: |
| Web `/` | `200 x5` | `123-159` | `91-121` | `41211` |
| Web `/auth/login` | `200 x5` | `111-132` | `94-110` | `34261` |
| Web `/api/build-info` | `200 x5` | `85-117` | `85-117` | `222` |
| API `/health` | `200 x5` | `84-101` | `84-101` | `70` |
| API `/ready` | `200 x5` | `90-113` | `90-113` | `34` |

The current DRE recheck did not reproduce the earlier multi-second Web `/`
latency spike from [LUC-5085](/LUC/issues/LUC-5085).

## Protected Auth Proof

Initial command without process-local mapping failed before browser proof:

```powershell
pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-20
```

Result: FAIL, `auth token was not available`.

The runner exposes approved audit credential names, so DRE mapped
`PROD_UI_AUDIT_*` to the script's `PROD_AUTH_*` names process-locally without
printing or writing secret values, then reran the proof. The command exceeded
the shell timeout after generating redacted artifacts.

Generated protected-auth artifact:

- `docs/operations/prod-auth-session-browser-proof-42177530-2026-06-20.md`
- `docs/operations/_artifacts-prod-auth-session-browser-proof-42177530-2026-06-20.json`

Artifact result: FAIL.

| Step | Result | Evidence |
| --- | --- | --- |
| build-info freshness | PASS | deployed build matches expected SHA |
| auth token resolved | PASS | source=`login` |
| unauthenticated dashboard redirects to login | PASS | path `/auth/login` |
| authenticated dashboard renders | PASS | path `/dashboard`; text length `143` |
| invalid token redirects to expired-session login | FAIL | path `/auth/login`; query string missing |
| logout API clears session | PASS | HTTP `200` |
| auth me after logout fails closed | PASS | HTTP `401` |
| dashboard after logout redirects to login | PASS | path `/auth/login` |

Classification:

- The protected route still fails closed to login.
- The expired-session query contract is not met for invalid token cookies.
- This is a product/security contract regression or a stale proof expectation;
  it is not a DRE-owned code fix.
- DRE created [LUC-5146](/LUC/issues/LUC-5146), assigned to Frontend Web, with
  Security review required if auth/session semantics change.

## Coolify Read-Only Runtime Projection

Read-only `GET` calls only:

| Check | Result |
| --- | --- |
| `GET /api/v1/teams/current` | pass; selector `LuckySparrow` |
| `GET /api/v1/projects/{configured-project-id}` | pass; project `Soar` |
| `GET /api/v1/projects/{configured-project-id}/{production}` | pass; environment `production` |
| `GET /api/v1/resources` | pass; `17` visible global resource rows |
| `GET /api/v1/deployments` | pass; `0` visible deployment rows |

Production resource projection:

| Resource | Type | Coolify status | FQDN | Commit metadata | Restart count | Limits |
| --- | --- | --- | --- | --- | ---: | --- |
| `soar-web` | application | `running:unknown` | yes | `b894e5dd3061` | `1` | memory `0`, CPU `0` |
| `soar-api` | application | `running:unknown` | yes | `HEAD` | `2` | memory `0`, CPU `0` |
| `workers-execution` | application | `running:unknown` | no | `HEAD` | `2` | memory `0`, CPU `0` |
| `workers-backtest` | application | `running:unknown` | no | `HEAD` | `0` | memory `0`, CPU `0` |
| `workers-market-data` | application | `running:unknown` | no | `HEAD` | `0` | memory `0`, CPU `0` |
| `workers-market-stream` | application | `running:unknown` | no | `HEAD` | `0` | memory `0`, CPU `0` |
| `postgresql` | standalone-postgresql | `running:healthy` | no | n/a | `52` | memory `0`, CPU `0` |
| `redis` | standalone-redis | `running:healthy` | no | n/a | `682` | memory `0`, CPU `0` |

No active Coolify deployment was visible during this heartbeat. Application
rows still cannot prove app liveness because they report `running:unknown`;
public endpoint smoke is the stronger liveness signal for API/Web in this run.

## Validation

- `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`: PASS.
- Public five-sample timing recheck: PASS; no current public latency spike.
- `pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-20`: FAIL, missing `PROD_AUTH_*` token inputs.
- Same protected auth proof with process-local `PROD_UI_AUDIT_*` to `PROD_AUTH_*` mapping: FAIL/TIMEOUT after artifact generation; invalid-token expired-session redirect failed.
- `pnpm run -s ops:coolify-stack:env-check:test`: PASS (`11/11`).
- `pnpm run -s ops:coolify-stack:env-check`: FAIL closed with deploy stack env required present `0/16`; this blocks stack-env release claims, not read-only Coolify API status access.
- Coolify read-only projection: PASS.
- Cleanup: validation-created `.tmp/prod-auth-cdp-1781965415268` was removed; validation-created Edge process ids `14204`, `52432`, and `59068` were cleaned up. Final process check returned no `chrome-headless-shell`, `chrome`, or `msedge` rows.

## Safety

No deploy, push, restart, rollback, env edit, secret/account readback,
database/Redis mutation, raw log capture, screenshot, account mutation,
exchange action, order, position, payment/subscription mutation, or
live-trading action occurred.

Secret handling: only binding names, route/status summaries, public timings,
resource names, statuses, counts, short commit metadata, and non-secret
operational metadata were recorded. Token values, passwords, cookies, raw
configured IDs, raw resource IDs, internal URLs, database values, and raw logs
were not stored.
