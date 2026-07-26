# LUC-1887 Production Deployment Proof Blocker For SHA 9b4fa63a3

Date: 2026-07-26

## Scope

Bounded DRE release-proof heartbeat for [LUC-1887](/LUC/issues/LUC-1887).

Goal: verify whether production fully serves pushed `main` SHA
`9b4fa63a35fa7f62c14d66b55721939c9fdf4950` and either close with proof or
name the exact release blocker.

No push, deploy, restart, rollback, env edit, database/Redis mutation, account
mutation, exchange/payment mutation, live-trading mutation, or secret value
readback was performed.

## Source / Target

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Local branch: `main`
- Local `HEAD`: `9b4fa63a35fa7f62c14d66b55721939c9fdf4950`
- Target release SHA: `9b4fa63a35fa7f62c14d66b55721939c9fdf4950`
- Production web: `https://soar.luckysparrow.ch`
- Production API: `https://api.soar.luckysparrow.ch`
- Coolify project/environment authority: `Soar / production`

## Public Smoke

Public status probes used `curl.exe` to avoid PowerShell false negatives on
this Windows runner.

| Route | Result |
| --- | --- |
| `https://soar.luckysparrow.ch/` | `200` |
| `https://soar.luckysparrow.ch/api/build-info` | `200`, `gitSha=9b4fa63a35fa7f62c14d66b55721939c9fdf4950`, `gitRef=main`, `metadataSource=env` |
| `https://api.soar.luckysparrow.ch/health` | `200`, `release.gitSha=9d1801d9b023211d4446629aac7bd58def70322d`, `source=image-build` |
| `https://api.soar.luckysparrow.ch/ready` | first check `503 not_ready`; later recovered to `200`, but still on old `release.gitSha=9d1801d9b023211d4446629aac7bd58def70322d` |

Interpretation: production is still split. The public web surface already
exposes the target SHA. The public API process recovered readiness during this
heartbeat, but it still advertises the older SHA
`9d1801d9b023211d4446629aac7bd58def70322d`.

## Coolify Control-Plane Readback

Current runner has the expected Coolify binding names present without printing
values:

- `COOLIFY_BASE_URL`
- `COOLIFY_TOKEN`
- `COOLIFY_API_TOKEN`
- `COOLIFY_SOAR_PROJECT_ID`
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`
- `COOLIFY_SOAR_WEB_APP_ID`
- `COOLIFY_SOAR_API_APP_ID`
- `COOLIFY_TEAM_ID`
- `COOLIFY_SOAR_TEAM_ID`

Initial authenticated read-only Coolify calls with existing bindings returned:

| Endpoint | Result |
| --- | --- |
| `/api/v1/teams/current` | timed out after ~20s |
| `/api/v1/projects/{project}/production` | `500 Internal Server Error` |
| `/api/v1/deployments` | `500 Internal Server Error` |

Later in the same heartbeat, narrower Coolify readback succeeded again.

Resource summary from read-only `/api/v1/resources` and `/api/v1/applications`:

| Resource | Status | `git_commit_sha` |
| --- | --- | --- |
| `soar-api` | `running:unknown` | `9d1801d9b023211d4446629aac7bd58def70322d` |
| `soar-web` | `running:unknown` | `9d1801d9b023211d4446629aac7bd58def70322d` |
| `workers-backtest` | `running:unknown` | `ca712e98b70e157b643db4f57726a02821a140bc` |
| `workers-execution` | `running:unknown` | `ca712e98b70e157b643db4f57726a02821a140bc` |
| `workers-market-data` | `running:unknown` | `ca712e98b70e157b643db4f57726a02821a140bc` |
| `workers-market-stream` | `running:unknown` | `ca712e98b70e157b643db4f57726a02821a140bc` |
| `postgresql` | `running:healthy` | n/a |
| `redis` | `running:healthy` | n/a |

The public web build-info and Coolify app commit readback are inconsistent for
`soar-web`: public route proves the new SHA, while Coolify application metadata
still reports the older commit. That looks like stale or lagging control-plane
metadata rather than a fresh public-web failure.

## Mutation Attempt

Owner standing authorization allowed the smallest safe API-only release
recovery.

Exact action attempted:

- `POST /api/v1/applications/{soar-api}/start` using
  `$env:COOLIFY_DEPLOY_API_TOKEN`

Observed result:

- first API-only start attempt timed out in this runner after 30 seconds, so no
  direct body was captured
- a new Coolify deployment row then appeared for `soar-api` with:
  - `deployment_uuid=fvq37l5kdigcgqcpa8b52pqw`
  - `commit=HEAD`
  - `status=queued`
  - `created_at=2026-07-26T01:10:48Z`
  - `is_webhook=false`

After the local-board correction, the dedicated Coolify release endpoint from
the official v4 API was used once for the same resource:

- `POST /api/v1/deploy`
- JSON body:
  `{"uuid":"k126p7vqxs5cly2zc4y4g4rq","force":false}`
- bearer token path:
  `$env:COOLIFY_DEPLOY_API_TOKEN`
- HTTP `200` response body:
  `{"deployments":[{"message":"Deployment already queued for this commit.","resource_uuid":"k126p7vqxs5cly2zc4y4g4rq","deployment_uuid":"m9aw6rymz5ou6jz2iq743u4j"}]}`

This proves the resource-scoped deploy mutation is accepted and the blocker is
not a deploy-token denial on the official release endpoint.

That new row is distinct from the older webhook-created queued row for
`soar-api` at the target commit:

- `deployment_uuid=lhlj39d22m0u4uyhmsb5gd84`
- `commit=9b4fa63a35fa7f62c14d66b55721939c9fdf4950`
- `status=queued`
- `created_at=2026-07-26T00:56:58Z`

## Deployment Queue State

Read-only `GET /api/v1/deployments` now proves the queue is not draining.

Relevant rows:

| Application | Commit | Status | Created |
| --- | --- | --- | --- |
| `workers-market-data` | `9b4fa63a35fa7f62c14d66b55721939c9fdf4950` | `in_progress` | `2026-07-26T00:56:58Z` |
| `workers-backtest` | `9b4fa63a35fa7f62c14d66b55721939c9fdf4950` | `queued` | `2026-07-26T00:56:58Z` |
| `workers-market-stream` | `9b4fa63a35fa7f62c14d66b55721939c9fdf4950` | `queued` | `2026-07-26T00:56:58Z` |
| `soar-api` | `9b4fa63a35fa7f62c14d66b55721939c9fdf4950` | `queued` | `2026-07-26T00:56:58Z` |
| `soar-api` | `HEAD` | `queued` | `2026-07-26T01:10:48Z` |

Follow-up on the earlier official deploy endpoint stayed bounded and concrete:

- `GET /api/v1/deployments/m9aw6rymz5ou6jz2iq743u4j` initially returned HTTP
  `404` with body `{"message":"Deployment not found."}`
- `GET /api/v1/applications/k126p7vqxs5cly2zc4y4g4rq/deployments` returned HTTP
  `404` with body `{"message":"Not found.","docs":"https://coolify.io/docs"}`

After the later authorized instant path, the deployment became directly
readable and failed:

- mutation route:
  `POST /api/v1/applications/k126p7vqxs5cly2zc4y4g4rq/start?force=false&instant_deploy=true`
- deploy-token response:
  `{"message":"Deployment request queued.","deployment_uuid":"eudzwgqwczqj97jb5bjf3a85"}`
- bounded follow-up `GET /api/v1/deployments/eudzwgqwczqj97jb5bjf3a85` returned
  HTTP `200` with:
  - `status=failed`
  - `commit=9b4fa63a35fa7f62c14d66b55721939c9fdf4950`
  - `finished_at=2026-07-26T01:20:24Z`
  - `updated_at=2026-07-26T01:20:25Z`

The critical production blocker is no longer API readiness, no longer a
credential denial, and no longer an unreadable queue hypothesis. It is now a
resource-specific failed deployment for `soar-api` on the target commit.

## Deployment Failure Classification

Exact deployment failure metadata available on Sunday, July 26, 2026:

- `GET /api/v1/deployments/eudzwgqwczqj97jb5bjf3a85` returned HTTP `200`
- `application_name=soar-api`
- `commit=9b4fa63a35fa7f62c14d66b55721939c9fdf4950`
- `status=failed`
- `created_at=2026-07-26T01:20:05Z`
- `finished_at=2026-07-26T01:20:24Z`
- direct app readback after the failure still showed
  `git_commit_sha=9d1801d9b023211d4446629aac7bd58def70322d`

Bounded follow-up on app/runtime logs did not surface a new target-build error
message. The available `GET /api/v1/applications/{soar-api}/logs` payload
showed the still-running old API process handling `/health` and `/ready`
traffic, plus one earlier redacted Redis denial during the temporary readiness
incident. That log stream is not authoritative proof of the target deployment
failure stage.

First actionable root-cause classification:

- owner: `source/build`
- rationale:
  - the exact target-commit deployment reached terminal `failed`
  - the previous API process remained healthy enough to serve `200 /health` and
    later `200 /ready`
  - `redis` and `postgresql` remained healthy in direct readback
  - bounded evidence did not show a broad Coolify permission denial, a host
    capacity outage, or a current network/dependency outage affecting all
    resources

Follow-up lane created:

- [LUC-1888](/LUC/issues/LUC-1888) `Diagnose and fix failed soar-api deployment for SHA 9b4fa63a3`
- owner: `09 CBE (Core Backend Engineer)`
- purpose: diagnose the Soar-owned API deployment/build failure, fix it in the
  same singleton workspace, validate, commit, push, and retry only the single
  `soar-api` deployment path

That source/build lane completed later on Sunday, July 26, 2026 with repair
commit `7742e5b73d89fff0f037b264b96acc0a7f863a9f` on `origin/main`.

## Post-LUC-1888 Release Retry

After [LUC-1888](/LUC/issues/LUC-1888) closed, the release target advanced to
the current `main` SHA `7742e5b73d89fff0f037b264b96acc0a7f863a9f`.

Fresh bounded proof:

- local repo `HEAD=7742e5b73d89fff0f037b264b96acc0a7f863a9f`
- local worktree: clean
- public `web /api/build-info -> gitSha=9b4fa63a35fa7f62c14d66b55721939c9fdf4950`
- public `api /health -> 200 old 9d1801d9b023211d4446629aac7bd58def70322d`
- public `api /ready -> 200 ready old 9d1801d9b023211d4446629aac7bd58def70322d`
- direct Coolify `soar-api` app readback still shows
  `git_commit_sha=9d1801d9b023211d4446629aac7bd58def70322d`
- direct bounded resource readback still keeps:
  - `postgresql -> running:healthy`
  - `redis -> running:healthy`

Fresh serialized deploy mutation for the repaired SHA:

- route: `POST /api/v1/deploy`
- body: `{"uuid":"k126p7vqxs5cly2zc4y4g4rq","force":false}`
- HTTP `200` response:
  `{"deployments":[{"message":"Deployment already queued for this commit.","resource_uuid":"k126p7vqxs5cly2zc4y4g4rq","deployment_uuid":"wej1rmc0yl165yag14v41tno"}]}`

Fresh exact control-plane blocker:

- `GET /api/v1/deployments/wej1rmc0yl165yag14v41tno`
  - HTTP `404`
  - body: `{"message":"Deployment not found."}`
- after about 80 seconds of bounded polling:
  - direct `soar-api` app SHA stayed on `9d1801d9b...`
  - public `api /health` stayed on `9d1801d9b...`
  - public `api /ready` stayed `200`, but also on `9d1801d9b...`

First actionable post-repair owner classification:

- owner: `ops/control-plane configuration or queue/readback path`
- rationale:
  - the Soar-owned source/build defect is already repaired and pushed
  - the exact `soar-api` deploy request for the repaired SHA is accepted
  - the accepted deployment does not materialize into a readable deployment row
    and does not advance the app SHA
  - the old API process and core dependencies remain healthy

Follow-up lane created:

- [LUC-1889](/LUC/issues/LUC-1889) `Repair soar-api deploy queue/readback blocker for SHA 7742e5b73`
- owner: `09 DRE (Deployment & Reliability Engineer)`
- purpose: diagnose and repair why the accepted `soar-api` deployment for the
  repaired SHA remains queued/unreadable and leaves the resource on the old
  commit

## Release Truth

Current verified state at `2026-07-26T01:12Z`:

- `web` public route is healthy.
- `web` build-info serves the target `main` SHA.
- `api` public process is reachable, `ready`, but still serves the old SHA.
- `redis` and `postgresql` are healthy in Coolify.
- `soar-api` remains on the old commit in Coolify app/resource readback.
- queued deployment rows for `soar-api` exist, but the queue has not advanced
  the application to the target commit.
- the official Coolify deploy endpoint accepted one serialized deploy request
  for `soar-api`, and the later official instant deploy path produced a direct
  deployment row that finished `failed` on the target commit.

Status:

`BLOCKED / SPLIT_RELEASE / WEB_FRESH_API_STALE / API_READY_200_OLD_SHA / SOAR_API_TARGET_DEPLOYMENT_FAILED`

## Required Unblock

Named unblock owner: [LUC-1889](/LUC/issues/LUC-1889) (`09 DRE`).

Required action:

1. Complete [LUC-1889](/LUC/issues/LUC-1889) and repair the exact control-plane
   queue/readback blocker for the accepted post-fix `soar-api` deployment.
2. Re-read `soar-api` application/resource metadata until `git_commit_sha`
   matches the target SHA.
3. Rerun the exact public proof set:
   - `web /`
   - `web /api/build-info`
   - `api /health`
   - `api /ready`
   - Coolify `project -> production -> resources`
   - Coolify deployments queue

## Why This Issue Cannot Close

`LUC-1887` definition of done requires:

- Coolify source SHA/readback at the target commit for every `main`-tracking
  resource, or an exact resource blocker.
- All 8 production resources healthy/running.
- Public web build-info at the target SHA and API `/health` + `/ready` healthy.

The release still cannot close because [LUC-1888](/LUC/issues/LUC-1888) fixed
the Soar-owned source/build defect and advanced `main`, but the fresh
serialized `soar-api` deploy request for that repaired SHA is accepted without
advancing the running API off old `9d1801d9b...`, and the returned deployment
UUID currently reads back as `404 Deployment not found`.

Updated status:

`BLOCKED / SOURCE_BUILD_FIXED / ACCEPTED_DEPLOYMENT_UUID_404 / API_STILL_OLD_SHA / WAITING_LUC-1889`

## Boundary

Exactly one narrow DRE production mutation was attempted in this heartbeat:
`POST /api/v1/applications/{soar-api}/start` using the deploy token. No other
deploy/restart/rollback/env/database/account mutation was performed.
