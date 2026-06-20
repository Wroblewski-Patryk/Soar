# LUC-5198 Production Performance And Server Health Watch - 2026-06-20

## Status

- Result: `INCIDENT_DELEGATED / PARTIALLY_VERIFIED / API_READY_TIMEOUT_SIGNAL`
- Owner lane: DRE / Deployment and Reliability Engineer
- Source issue: [LUC-5198](/LUC/issues/LUC-5198)
- Delegated repair: [LUC-5213](/LUC/issues/LUC-5213)
- Environment: production
- Evidence timestamp: `2026-06-20T16:56:50Z`

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
- Checked at: `2026-06-20T16:49:41.749Z`

`env-runtime` remains diagnostic-only for release provenance. It does not block
this read-only health watch, but it is not release-grade deploy provenance.

## Public Timing

Five samples per target:

| Target | Statuses | Total ms range | TTFB ms range | Bytes |
| --- | --- | ---: | ---: | ---: |
| Web `/` | `200 x5` | `111-230` | `81-191` | `41211` |
| Web `/auth/login` | `200 x5` | `103-165` | `83-146` | `34261` |
| Web `/api/build-info` | `200 x5` | `83-228` | `83-228` | `222` |
| API `/health` | `200 x5` | `133-1978` | `132-1978` | `70` |
| API `/ready` | `200 x5` | `94-2426` | `94-2426` | `34` |

Focused API recheck, ten samples per target:

| Target | Statuses | Max total ms | Average total ms | Notes |
| --- | --- | ---: | ---: | --- |
| API `/health` | `200 x10` | `207` | `104.6` | normalized on recheck |
| API `/ready` | `200 x9`, `000 x1` | `21048` | `2561.6` | one timeout plus `884`, `1416`, and `1626 ms` outliers |

Classification:

- Web is currently responsive.
- API `/health` normalized on focused recheck.
- API `/ready` showed a current intermittent timeout/latency regression signal
  and was delegated to [LUC-5213](/LUC/issues/LUC-5213).

## Protected Auth Proof

Command shape:

```powershell
PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD mapped process-locally to PROD_AUTH_EMAIL/PASSWORD
pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-20 --output-md history/evidence/luc-5198-prod-auth-session-browser-proof-2026-06-20.md --output-json history/evidence/luc-5198-prod-auth-session-browser-proof-2026-06-20.json
```

Result: PASS artifact generated, but the shell command timed out before process
cleanup.

Generated protected-auth artifacts:

- `history/evidence/luc-5198-prod-auth-session-browser-proof-2026-06-20.md`
- `history/evidence/luc-5198-prod-auth-session-browser-proof-2026-06-20.json`

Proof summary:

- build-info freshness: PASS
- auth token resolved from login: PASS
- unauthenticated dashboard redirects to login: PASS
- authenticated dashboard renders: PASS
- invalid token redirects to `/auth/login?session=expired`: PASS
- logout API clears session: PASS
- `/auth/me` after logout fails closed: PASS (`401`)
- dashboard after logout redirects to login: PASS

## Coolify Read-Only Runtime Projection

Read-only `GET` calls only:

| Check | Result |
| --- | --- |
| `GET /api/v1/teams/current` | pass; selector `LuckySparrow` |
| `GET /api/v1/projects/{configured-project-id}` | pass; project `Soar` |
| `GET /api/v1/projects/{configured-project-id}/{production}` | pass; environment `production` |
| `GET /api/v1/resources` | pass; `17` visible global resource rows |
| `GET /api/v1/deployments` | pass; `0` visible deployment rows |

Production-environment application projection:

| Resource | Coolify status | FQDN | Commit metadata | Restart count | Limits |
| --- | --- | --- | --- | ---: | --- |
| `soar-web` | `running:unknown` | yes | `b894e5dd3061` | `1` | memory `0`, CPU `0` |
| `soar-api` | `running:unknown` | yes | `HEAD` | `2` | memory `0`, CPU `0` |
| `workers-execution` | `running:unknown` | no | `HEAD` | `2` | memory `0`, CPU `0` |
| `workers-backtest` | `running:unknown` | no | `HEAD` | `0` | memory `0`, CPU `0` |
| `workers-market-data` | `running:unknown` | no | `HEAD` | `0` | memory `0`, CPU `0` |
| `workers-market-stream` | `running:unknown` | no | `HEAD` | `0` | memory `0`, CPU `0` |

Global resource projection confirmed PostgreSQL and Redis rows are visible as
`running:healthy`. Application rows still cannot prove app liveness because
they report `running:unknown`; public endpoint smoke is the stronger liveness
signal for API/Web in this run.

## Validation

- `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`: PASS.
- Public five-sample timing: PARTIAL; API `/ready` max `2426 ms`.
- Focused API ten-sample timing: FAIL signal; `/ready` returned one `000` timeout at `21048 ms` and multiple latency outliers.
- `pnpm run -s ops:prod-auth:proof ...`: PASS artifact generated; shell timed out before cleanup.
- `pnpm run -s ops:coolify-stack:env-check:test`: PASS (`11/11`).
- `pnpm run -s ops:coolify-stack:env-check`: FAIL closed with deploy stack env required present `0/16`; this blocks stack-env release claims, not read-only Coolify API status access.
- Coolify read-only projection: PASS.
- Cleanup: validation-created `.tmp/prod-auth-cdp-1781974249661` and Edge PID `21300` remained after `Stop-Process`, `taskkill`, and WMI terminate attempts. The PID command line is the validation proof profile; the cleanup pitfall is recorded in `.codex/context/LEARNING_JOURNAL.md`.

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
