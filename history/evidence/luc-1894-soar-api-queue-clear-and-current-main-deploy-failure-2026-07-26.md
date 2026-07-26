# LUC-1894 Soar API Queue Clear And Current-Main Deploy Failure

Date: 2026-07-26
Owner: 09 DRE (Deployment & Reliability Engineer)

## Scope

Board-authorized narrow recovery for `soar-api` after the production deploy
queue filled with superseded rows.

Allowed mutation scope for this heartbeat:

- cancel only the exact queued or stale deployment UUIDs named by the board
- verify active deployment count returns to zero
- issue exactly one resource-scoped `soar-api` deploy for current `origin/main`
- monitor the returned deployment UUID plus public `/health` and `/ready`

No environment edits, database actions, Redis actions, rollback, restart of
running application containers, or unrelated resource deploys were performed.

## Source / Target

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Local `HEAD`: `14412cbb2d05bc8b52ee89a9ec983ef41453591e`
- `origin/main`: `14412cbb2d05bc8b52ee89a9ec983ef41453591e`
- Exact deploy target: `soar-api`
- Coolify authority: `Soar / production / soar-api`
- Public API base: `https://api.soar.luckysparrow.ch`

## Queue Recovery

Initial active deployment feed exactly matched the board correction:

- one stale `in_progress` row:
  `5928 / makikbica1x0eqxgj14dfx07 / workers-market-data / 9b4fa63a...`
- twenty-five queued superseded rows for commits `9b4fa63a...`,
  `7742e5b73...`, `adc82a154...`, `637718622...`, and `073fcd661...`
- zero active rows for current target commit `14412cbb2...`

Exact queue mutations:

- used only `POST /api/v1/deployments/{deployment_uuid}/cancel`
- cancelled the exact 26 UUIDs named by the board
- each cancel call returned
  `{"message":"Deployment cancelled successfully.","status":"cancelled-by-user",...}`

Verification at `2026-07-26T02:35:51Z`:

- active queued/in-progress count: `0`
- no further queue-clear, delete, or broad recovery action was required

## Exact Deploy Attempt

After queue recovery, one exact resource-scoped deploy was issued:

- endpoint:
  `POST /api/v1/deploy?uuid=k126p7vqxs5cly2zc4y4g4rq&force=false`
- bearer token path:
  `$env:COOLIFY_DEPLOY_API_TOKEN`
- response:
  `{"deployments":[{"message":"Application soar-api deployment queued.","resource_uuid":"k126p7vqxs5cly2zc4y4g4rq","deployment_uuid":"g13vizskboxarfwomcntvx24"}]}`

## Deployment Readback

Read-only Coolify monitoring used `GET /api/v1/deployments/g13vizskboxarfwomcntvx24`.

Observed progression:

- `2026-07-26T02:36:27Z`: `status=in_progress`,
  `commit=14412cbb2d05bc8b52ee89a9ec983ef41453591e`
- `2026-07-26T02:36:58Z`: still `in_progress`
- `2026-07-26T02:37:08Z`: `status=failed`
- terminal metadata:
  - `deployment_uuid=g13vizskboxarfwomcntvx24`
  - `commit=14412cbb2d05bc8b52ee89a9ec983ef41453591e`
  - `created_at=2026-07-26T02:36:06Z`
  - `finished_at=2026-07-26T02:37:00Z`
  - `updated_at=2026-07-26T02:37:01Z`

## Application Readback

Throughout and after the failed deploy, direct Coolify application metadata for
`soar-api` still reported:

- `git_commit_sha=9d1801d9b023211d4446629aac7bd58def70322d`
- `status=running:unknown`

This proves the failed deployment did not advance the running production API to
the target SHA.

## Public Route Proof

Public probes remained healthy but stale during the entire monitored window:

| Probe time | Route | Result |
| --- | --- | --- |
| `2026-07-26T02:36:27Z` | `/health` | `200`, `release.gitSha=9d1801d9b023211d4446629aac7bd58def70322d` |
| `2026-07-26T02:36:27Z` | `/ready` | `200`, `release.gitSha=9d1801d9b023211d4446629aac7bd58def70322d` |
| `2026-07-26T02:37:08Z` | `/health` | `200`, old SHA unchanged |
| `2026-07-26T02:37:08Z` | `/ready` | `200`, old SHA unchanged |
| `2026-07-26T02:38:00Z` | `/health` | `200`, old SHA unchanged |
| `2026-07-26T02:38:00Z` | `/ready` | `200`, old SHA unchanged |

## Conclusion

The queue blocker is resolved for this lane. The current production blocker is
now a fresh, exact, resource-scoped failed deployment for `soar-api` on current
`origin/main` commit `14412cbb2d05bc8b52ee89a9ec983ef41453591e`.

Evidence-backed status:

- queue saturation: resolved
- exact deploy request: accepted
- exact deployment UUID: `g13vizskboxarfwomcntvx24`
- target commit: `14412cbb2d05bc8b52ee89a9ec983ef41453591e`
- deployment result: `failed`
- deployed API SHA after attempt: still `9d1801d9b023211d4446629aac7bd58def70322d`
- public API health/readiness: still `200`, still on old SHA

Next owner action: backend/source-build investigation must classify why
deployment `g13vizskboxarfwomcntvx24` fails on current main after the queue was
cleared and the exact deploy path was proven operational.

## Exact Build-Log Classification

The generated Coolify Dockerfile and build script narrow the failure to the
repository's build-stage declarations:

- Coolify injected literal `ARG SOURCE_COMMIT=14412cbb2d05bc8b52ee89a9ec983ef41453591e`
  after every `FROM` and passed the same SHA with `--build-arg`.
- The later repository line `ARG SOURCE_COMMIT=$SOURCE_COMMIT` in the `build`
  stage did not preserve the injected value; BuildKit expanded the writer step
  as `SOURCE_COMMIT=""` (and the sibling provenance values were also empty).
- The running production image remained untouched and healthy on its prior SHA.

The corrective source contract is therefore: keep the global and ancestor
`base` declarations needed by ordinary local `--build-arg` builds, but never
redeclare provenance args in the descendant `build` stage after Coolify's
literal injection. A focused layout test must reject both bare and self-default
build-stage redeclarations.
