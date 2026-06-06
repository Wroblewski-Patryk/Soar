# LUC-2293 Soar Web Rollback To Previous Candidate Evidence

Date: 2026-06-05
Owner: Ops Release Lead
Process: release mutation permit

## Scope

[LUC-2293](/LUC/issues/LUC-2293) authorized one controlled `Soar /
production / soar-web` rollback or redeploy to the previous finished source
candidate:

`b894e5dd30614dfd2035e91e3d848c842d3ff380`

No API, worker, Postgres, Redis, environment, team/account, protected smoke,
exchange, database, force-start, second restart, or live-trading mutation was
authorized or performed.

## Precheck

| Check | Result |
| --- | --- |
| Public API `/health` | `200` |
| Public API `/ready` | `200` |
| Public Web `/` | `503` (`no available server`) |
| Public Web `/api/build-info` | `503` (`no available server`) |
| Local `HEAD` | `6e31d814046b640ad529d1cd57f968ba6f67b05e` |
| Local `origin/main` | `6e31d814046b640ad529d1cd57f968ba6f67b05e` |
| Remote `origin/main` | `6e31d814046b640ad529d1cd57f968ba6f67b05e` |
| Required Coolify bindings | present; values not printed |
| Local worktree | dirty with existing unrelated state/evidence files; not used as release source |

## Coolify Readback Before Mutation

Redacted application projection:

| Field | Result |
| --- | --- |
| Resource name | `soar-web` |
| Branch | `main` |
| Configured git commit SHA | `b894e5dd30614dfd2035e91e3d848c842d3ff380` |
| Status | `restarting:unknown` |
| Public FQDN | `https://soar.luckysparrow.ch/` |

The deployment history API projection did not expose usable row details in this
runner without printing raw identifiers. Raw deployment ids were not persisted.

## Mutation

Exactly one permitted Coolify application update was issued for `soar-web`:

- `git_commit_sha`: `b894e5dd30614dfd2035e91e3d848c842d3ff380`
- `instant_deploy`: `true`

The request returned success. Raw application and deployment identifiers were
suppressed.

## Postcheck

Eight polls were run at 15-second intervals after the mutation:

| Poll | Web `/` | Web `/api/build-info` | build-info SHA | Coolify status |
| --- | --- | --- | --- | --- |
| 1 | `503` | `503` | `n/a` | `restarting:unknown` |
| 2 | `503` | `503` | `n/a` | `restarting:unknown` |
| 3 | `503` | `503` | `n/a` | `restarting:unknown` |
| 4 | `503` | `503` | `n/a` | `restarting:unknown` |
| 5 | `503` | `503` | `n/a` | `restarting:unknown` |
| 6 | `503` | `503` | `n/a` | `restarting:unknown` |
| 7 | `503` | `503` | `n/a` | `restarting:unknown` |
| 8 | `503` | `503` | `n/a` | `running:unknown` |

Final API regression check:

| Check | Result |
| --- | --- |
| Public API `/health` | `200` |
| Public API `/ready` | `200` |

Focused local regression:

`pnpm run ops:coolify-stack:env-check:test` -> PASS (`8/8`).

## Result

Status: failed closed.

The single permitted rollback/redeploy did not recover public Web. Web stayed
`503`, `/api/build-info` never exposed the rollback SHA, and API health/readiness
remained green.

Stop condition is met. No second mutation was performed.

## Required Next Decision

The next action must be a separate CTO/Ops decision between:

1. host-level Coolify queue/runtime repair,
2. container crash investigation,
3. another explicit source or image permit.

This issue must not chain another production mutation.
