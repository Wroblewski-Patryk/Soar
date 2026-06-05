# LUC-2298 Redacted soar-web Deployment History And Rollback Permit

Date: 2026-06-05
Owner: Ops Release Lead
Stage: release / verification
Issue: [LUC-2298](/LUC/issues/LUC-2298)

## Scope

Target: `Soar / production / soar-web` only.

This evidence lane used the Security-approved read-only retrieval path from
[LUC-2294](/LUC/issues/LUC-2294). No deploy, restart, rollback, env edit,
database, Redis, API, worker, account, exchange, or live-trading mutation was
performed by this issue.

## Live Readback

| Check | Result |
| --- | --- |
| Coolify API `/api/v1/version` | `4.0.0-beta.473` |
| `soar-web` app-specific deployment endpoint | `404`, matching prior evidence |
| Global deployments endpoint filtered to `soar-web` | no visible rows at `2026-06-05T21:09:29Z` |
| `soar-web` app status | `running:unknown` with crash marker |
| `soar-web` last restart class | `crash` |
| `soar-web` last restart timestamp | `2026-06-05T21:09:07Z` |
| `soar-web` restart count | `5` |
| App log endpoint | `400`; raw output not persisted |
| Deployment log endpoint variants | `404`; raw output not persisted |
| Public API `/health` | `200` |
| Public API `/ready` | `200` |
| Public Web `/` | `503` |
| Public Web `/api/build-info` | `503` |

`pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
failed only Web checks: API health/ready passed, Web root/build-info returned
`503`.

## Redacted Chronology

Live Coolify history no longer exposed recent `soar-web` deployment rows in
this heartbeat. The usable chronology therefore comes from the already
Security-approved redacted retrieval path recorded in
`history/evidence/luc-2286-soar-web-redeploy-failed-closed-2026-06-05.md`.

| Alias | Source | State | Timestamp | Notes |
| --- | --- | --- | --- | --- |
| `[CURRENT_FAILED_SOURCE]` | `6e31d814046b640ad529d1cd57f968ba6f67b05e` | finished deployment events observed earlier, runtime unhealthy | after `2026-06-05T20:53Z` redeploy attempts | normalized build/start/rolling-update completion events existed, but public Web stayed `503` |
| `[PREVIOUS_STABLE_CANDIDATE_A]` | `b894e5dd30614dfd2035e91e3d848c842d3ff380` | prior finished source candidate | `2026-06-05T19:51:01Z` | normalized build/start/rolling-update completion events recorded by prior redacted projection |
| `[LIVE_NOW]` | current app readback | no visible deployment rows, crash marker active | `2026-06-05T21:09:29Z` | Web still unavailable; API remained healthy |

Classification for
`b894e5dd30614dfd2035e91e3d848c842d3ff380`: supported by prior redacted
chronology as the previous finished `soar-web` source candidate. It was not
reconfirmed from live deployment rows in this heartbeat because Coolify returned
zero visible `soar-web` deployment rows.

## Prepared Rollback Permit

Status: prepared, then superseded by execution evidence from
[LUC-2293](/LUC/issues/LUC-2293).

Permit fields:

| Field | Value |
| --- | --- |
| Coolify project/environment | `Soar / production` |
| Resource | `soar-web` |
| Action | one controlled rollback/redeploy to `[PREVIOUS_STABLE_CANDIDATE_A]` |
| Source ref | `b894e5dd30614dfd2035e91e3d848c842d3ff380` |
| Pre-state proof | API `/health` and `/ready` `200`; Web `/` and `/api/build-info` `503` |
| Mutation limit | exactly one `soar-web` rollback/redeploy action |
| Required smoke | Web `/`, Web `/api/build-info`, API `/health`, API `/ready` |
| Stop condition | if Web stays `503`/`502`, build-info does not expose the rollback SHA, or Coolify stays crash/restarting, stop; do not chain another deploy, restart, rollback, env edit, queue cleanup, or host repair under the same permit |
| Exclusions | no API, workers, Postgres, Redis, env, DNS, team/account, protected-smoke credential, exchange, live-trading, or user-data mutation |
| Secret handling | use Paperclip/Coolify env bindings only; never print values |
| Rollback after rollback failure | requires a fresh CTO/Ops permit for host-level Coolify queue/runtime repair, redacted container crash investigation, proxy/runtime repair, or another exact source/image action |

## Superseding Evidence

Local evidence now shows [LUC-2293](/LUC/issues/LUC-2293) already executed the
single controlled rollback/redeploy to
`b894e5dd30614dfd2035e91e3d848c842d3ff380` and failed closed:

- Web `/` stayed `503` except one `502` poll.
- Web `/api/build-info` stayed `503`.
- API `/health` and `/ready` stayed `200`.
- Coolify stayed `restarting:unknown`.
- `soar-web` remained pinned to the rollback SHA in that evidence.

Do not repeat the same rollback permit. The next recovery action requires a
new explicit permit and should focus on host/container crash, proxy/runtime
repair, or a different named source/image action.

## Safety

No raw Coolify resource ids, raw deployment ids, generated names, internal
paths, internal IPs, secret values, cookies, tokens, auth headers, DSNs,
connection strings, raw logs, screenshots, account data, exchange settings, or
live-trading state were stored in this artifact.
