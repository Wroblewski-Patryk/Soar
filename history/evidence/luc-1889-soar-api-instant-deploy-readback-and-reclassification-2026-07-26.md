# LUC-1889 Soar API Instant-Deploy Readback And Reclassification

Date: 2026-07-26
Owner: 09 DRE (Deployment & Reliability Engineer)

## Scope

Diagnose the claimed `soar-api` deploy queue/readback blocker for target SHA
`7742e5b73d89fff0f037b264b96acc0a7f863a9f` and use the smallest safe
application-scoped Coolify mutation needed to prove whether the blocker is
control-plane or application-owned.

No repository code, environment, database, Redis, DNS, credential, or
unrelated resource mutation was performed.

## Starting state

Before mutation on Sunday, July 26, 2026:

- public `https://api.soar.luckysparrow.ch/health` -> `200`,
  `release.gitSha=9d1801d9b023211d4446629aac7bd58def70322d`
- public `https://api.soar.luckysparrow.ch/ready` -> `200`,
  `release.gitSha=9d1801d9b023211d4446629aac7bd58def70322d`
- direct Coolify `soar-api` application readback still showed
  `git_commit_sha=9d1801d9b023211d4446629aac7bd58def70322d`
- global Coolify deployments showed:
  - one stale `workers-market-data` row still `in_progress` from
    `2026-07-26T00:56:58Z`
  - multiple queued webhook rows for SHA `7742e5b73...`
  - one queued `soar-api` row for the same SHA:
    `deployment_uuid=xjb6bdf3mhbnz1tgimhhldz4`
- Coolify host setting `concurrent_builds=1` remained active

This proved the normal webhook queue was congested, but it did not yet prove
that `soar-api` itself was blocked by unreadable control-plane state.

## Exact mutation

Used the documented app-scoped Coolify start endpoint with queue bypass for the
single target application only:

- route:
  `POST /api/v1/applications/k126p7vqxs5cly2zc4y4g4rq/start?force=false&instant_deploy=true`
- bearer token path: `$env:COOLIFY_DEPLOY_API_TOKEN`
- response:
  `{"message":"Deployment request queued.","deployment_uuid":"kmpm887pdgo48b8l5j13q5cw"}`

This was intentionally narrower than queue-wide cancellation because
`instant_deploy=true` is the exact single-app proof path and avoids mutating
workers, Web, database, or Redis just to test API ownership.

## Direct deployment readback

The new deployment was immediately readable through the Coolify deployment
detail endpoint:

- `GET /api/v1/deployments/kmpm887pdgo48b8l5j13q5cw`
  - initially: `status=in_progress`
  - later: `status=failed`
  - `commit=7742e5b73d89fff0f037b264b96acc0a7f863a9f`
  - `commit_message="fix: make API release provenance deploy-safe"`
  - `created_at=2026-07-26T01:42:44Z`
  - `finished_at=2026-07-26T01:43:02Z`

The failed deployment remained readable by UUID the whole time. That disproves
the earlier hypothesis that the current blocker was an unreadable deployment
row or a broken per-deploy readback path.

## Post-mutation state

After the failed instant deploy:

- direct Coolify `soar-api` application readback still showed old
  `git_commit_sha=9d1801d9b023211d4446629aac7bd58def70322d`
- public `https://api.soar.luckysparrow.ch/health` still returned `200` with
  old SHA `9d1801d9b023211d4446629aac7bd58def70322d`
- public `https://api.soar.luckysparrow.ch/ready` still returned `200` with
  old SHA `9d1801d9b023211d4446629aac7bd58def70322d`
- application logs endpoint still exposed only the currently running old API
  process serving `/health` and `/ready`, not a useful target-deploy failure
  message

## Reclassification

The `LUC-1889` queue/readback diagnosis is no longer valid.

Evidence-backed classification after this heartbeat:

- not proven blocker:
  `ops/control-plane queue/readback`
- proven blocker:
  `exact soar-api deployment on repaired SHA 7742e5b73... still fails`
- first actionable owner:
  `source/build or application runtime packaging`

Why:

1. the app-scoped queue-bypass path exists and works for `soar-api`
2. the new deployment UUID is readable immediately and throughout execution
3. the target deployment still reaches terminal `failed`
4. the old API process remains healthy enough to keep `/health` and `/ready`
   green on the previous SHA

## Conclusion

`LUC-1889` closed the Ops hypothesis by proving the current release blocker is
not a queue/readback defect. Follow-up must return to the backend/application
owner with the new exact failed deployment UUID
`kmpm887pdgo48b8l5j13q5cw` on repaired SHA `7742e5b73d89fff0f037b264b96acc0a7f863a9f`.

## Post-closeout review note

After the Ops closeout, the board supplied one narrower source-level finding
from direct review of the failed deployment:

- `apps/api/scripts/writeApiSourceCommit.mjs` derives `apiDir` from
  `process.cwd()`
- Docker runs `node apps/api/scripts/writeApiSourceCommit.mjs` from
  `WORKDIR /app`
- that points the fallback at `/.git` instead of `/app/.git` and writes the
  artifact to `/app/.build-meta/SOURCE_COMMIT` instead of
  `/app/apps/api/.build-meta/SOURCE_COMMIT`

This does not change the Ops conclusion. It sharpens the remaining owner path:
the active backend repair lane is `LUC-1890`, and `LUC-1887` is blocked on
that source-level fix plus a `soar-api`-only redeploy.
