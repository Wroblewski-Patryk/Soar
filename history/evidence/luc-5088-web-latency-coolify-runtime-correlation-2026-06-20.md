# LUC-5088 Web Latency Coolify Runtime Correlation - 2026-06-20

## Status

- Result: `DONE / PARTIALLY_VERIFIED / SPIKE_NOT_REPRODUCED / RUNTIME_CLUE_RECORDED`
- Owner lane: DRE / Deployment and Reliability Engineer
- Source issues: [LUC-5085](/LUC/issues/LUC-5085), [LUC-5087](/LUC/issues/LUC-5087)
- Environment: production
- Evidence timestamp: `2026-06-20T12:37:48Z`

## Wake Context

- Wake reason: `issue_assigned`
- Issue: [LUC-5088](/LUC/issues/LUC-5088)
- Pending comments: `0/0`
- Fallback fetch needed: `false`
- Checkout: already claimed by the harness; no checkout API call was repeated.

## Prior Signal

[LUC-5085](/LUC/issues/LUC-5085) observed a real intermittent public Web `/`
latency signal: focused samples reached `14701`, `634`, `266`, `6293`, and
`21953 ms` while adjacent Web/API routes stayed below `136 ms`.

[LUC-5087](/LUC/issues/LUC-5087) did not find a supported Web code or upstream
API fetch bottleneck. Production `/` and `/auth/login` are static cache hits
with `X-Nextjs-Cache: HIT`, `X-Nextjs-Prerender: 1`, and
`Cache-Control: s-maxage=31536000`.

## Current Public Timing Recheck

Command shape:

```powershell
curl.exe -L -s -o NUL -w '%{http_code} %{time_namelookup} %{time_connect} %{time_appconnect} %{time_starttransfer} %{time_total} %{size_download}' --max-time 30 <url>
```

Five samples per target:

| Target | Statuses | Total ms range | TTFB ms range | Bytes |
| --- | --- | ---: | ---: | ---: |
| Web `/` | `200 x5` | `115-136` | `84-99` | `41211` |
| Web `/auth/login` | `200 x5` | `99-119` | `81-96` | `34261` |
| Web `/api/build-info` | `200 x5` | `93-104` | `93-104` | `222` |
| API `/health` | `200 x5` | `94-104` | `94-104` | `70` |
| API `/ready` | `200 x5` | `91-124` | `91-124` | `34` |

Current DRE recheck did not reproduce the multi-second Web `/` spike.

## Header Evidence

`curl.exe -I -L -s --max-time 30` returned:

| Route | Status | Relevant headers |
| --- | ---: | --- |
| Web `/` | `200` | `Cache-Control: s-maxage=31536000`; `Content-Length: 41211`; `X-Nextjs-Cache: HIT`; `X-Nextjs-Prerender: 1`; `Alt-Svc: h3=":443"` |
| Web `/auth/login` | `200` | `Cache-Control: s-maxage=31536000`; `Content-Length: 34261`; `X-Nextjs-Cache: HIT`; `X-Nextjs-Prerender: 1`; `Alt-Svc: h3=":443"` |
| Web `/api/build-info` | `200` | `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`; `Content-Type: application/json` |

## Coolify Read-Only Runtime Projection

Read-only `GET` calls only:

| Check | Result |
| --- | --- |
| `GET /api/v1/teams/current` | pass; selector `LuckySparrow` |
| `GET /api/v1/projects/{configured-project-id}` | pass; project `Soar` |
| `GET /api/v1/projects/{configured-project-id}/{production}` | pass; environment id `6` |
| `GET /api/v1/resources` | pass; `17` visible global resource rows |
| `GET /api/v1/deployments` | pass; `0` visible deployment rows |

Production resource projection:

| Resource | Type | Coolify status | FQDN | Commit metadata | Restart count | Limits |
| --- | --- | --- | --- | --- | ---: | --- |
| `soar-web` | application | `running:unknown` | yes | `b894e5dd30614dfd2035e91e3d848c842d3ff380` | `1` | memory `0`, CPU `0` |
| `soar-api` | application | `running:unknown` | yes | `HEAD` | `2` | memory `0`, CPU `0` |
| `workers-execution` | application | `running:unknown` | no | `HEAD` | `2` | memory `0`, CPU `0` |
| `workers-backtest` | application | `running:unknown` | no | `HEAD` | `0` | memory `0`, CPU `0` |
| `workers-market-data` | application | `running:unknown` | no | `HEAD` | `0` | memory `0`, CPU `0` |
| `workers-market-stream` | application | `running:unknown` | no | `HEAD` | `0` | memory `0`, CPU `0` |
| `postgresql` | database | `running:healthy` | no | n/a | `52` | n/a |
| `redis` | database | `running:healthy` | no | n/a | `682` | n/a |

## Correlation Assessment

- The [LUC-5085](/LUC/issues/LUC-5085) latency spike remains valid historical
  production evidence, but it is not active during this DRE heartbeat.
- No active Coolify deployment was visible during the DRE correlation readback.
- Current Web `/` and `/auth/login` responses are static cache hits and return
  within normal public timing ranges.
- Coolify application inventory cannot prove application liveness because app
  rows still report `running:unknown`.
- Compared with older inventory evidence from [LUC-3796](/LUC/issues/LUC-3796),
  `soar-web` now reports restart count `1` instead of `0`. This is a runtime
  correlation clue, not proof that the restart caused the [LUC-5085](/LUC/issues/LUC-5085)
  spike, because this heartbeat did not have approved host/proxy time-series
  metrics or raw sanitized log slices for the spike window.
- PostgreSQL and Redis are `running:healthy` in Coolify projection and are not
  supported as a cause for a static Web `/` TTFB spike.

## Validation

- Public timing recheck: PASS; no current spike across Web/API targets.
- Header/cache recheck: PASS; Web `/` remains static cache hit.
- Coolify read-only projection: PASS; selector/project/environment/resources/deployments readback succeeded.
- `pnpm run -s ops:coolify-stack:env-check:test`: PASS (`11/11`).
- `pnpm run -s ops:coolify-stack:env-check`: FAIL closed with deploy stack env required present `0/16`; this does not block Coolify API read-only status access, but it still blocks stack-env release claims.

## Safety

No deploy, push, restart, rollback, env edit, secret/account readback,
database/Redis mutation, raw log capture, screenshot, account mutation,
exchange action, order, position, payment/subscription mutation, or
live-trading action occurred.

Secret handling: only binding names, resource names, statuses, counts, public
timings, short operational metadata, and non-secret commit metadata were
recorded. Token values, raw configured IDs, raw resource IDs, internal URLs,
cookies, credentials, database values, and raw logs were not stored.
