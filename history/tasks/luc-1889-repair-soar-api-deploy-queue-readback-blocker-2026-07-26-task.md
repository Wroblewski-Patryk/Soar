# Task

## Header
- ID: LUC-1889
- Title: Repair `soar-api` deploy queue/readback blocker for SHA `7742e5b73`
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `LUC-1887`
- Priority: P0
- Iteration: 2026-07-26-03
- Operation Mode: BUILDER
- Mission ID: LUC-1889-soar-api-queue-readback
- Mission Status: VERIFIED

## Context
`LUC-1887` and the follow-up wake for `LUC-1889` classified the remaining
Soar release blocker as an Ops/control-plane queue or per-deployment readback
defect after the backend provenance repair from `LUC-1888`.

## Goal
Use the smallest safe production mutation on `soar-api` only to determine
whether the current blocker is really queue/readback ownership or whether the
deployment itself still fails on the repaired SHA.

## Success Signal
- Problem: `POST /api/v1/deploy` accepted the repaired SHA and earlier bounded
  follow-up had returned `404` for one deployment UUID, which made the blocker
  look like queue/readback ownership.
- Expected outcome: one exact `soar-api` proof path either converges or yields
  a readable failure that collapses ownership back to application/source-build.
- How success is observed: direct deployment UUID readback, direct app SHA
  readback, and public `/health` plus `/ready`.

## Deliverable For This Stage
An evidence packet that either clears the queue/readback hypothesis or leaves
an exact control-plane blocker with proof.

## Constraints
- mutate only `soar-api`
- do not touch workers, Web, Postgres, Redis, env, secrets, or accounts unless
  a narrower prerequisite is proven
- do not print secret values
- do not edit repository code for this issue

## Definition of Done
- [x] Exact `soar-api` single-resource deploy path was exercised.
- [x] Deployment UUID readback was captured directly.
- [x] Release owner classification was updated from evidence.

## Validation Evidence
- Manual checks:
  - Coolify `GET /api/v1/deployments` readback of current queue state
  - Coolify `GET /api/v1/applications/{soar-api}` before and after mutation
  - Coolify `POST /api/v1/applications/{soar-api}/start?force=false&instant_deploy=true`
  - Coolify `GET /api/v1/deployments/kmpm887pdgo48b8l5j13q5cw`
  - public `curl.exe` checks for `/health` and `/ready`
- Reality status: verified

## Deployment / Ops Evidence
- Deploy impact: medium, production `soar-api` only
- Env or secret changes: none
- Health-check impact: old API process stayed healthy throughout
- Rollback note: no rollback performed; old runtime never switched off the
  previous image
- Observability or alerting impact: none

## Result Report
- Task summary: the queue/readback blocker was disproven. The documented
  `instant_deploy=true` path created a readable `soar-api` deployment
  (`kmpm887pdgo48b8l5j13q5cw`) that reached terminal `failed` on target SHA
  `7742e5b73d89fff0f037b264b96acc0a7f863a9f`.
- Post-closeout review note: the latest board comment narrowed the remaining
  source-level defect to Docker path resolution in
  `apps/api/scripts/writeApiSourceCommit.mjs`; that confirmation does not
  reopen the Ops lane and instead sharpens the backend handoff.
- Evidence:
  `history/evidence/luc-1889-soar-api-instant-deploy-readback-and-reclassification-2026-07-26.md`
- Next steps:
  keep `LUC-1889` closed as an Ops diagnosis, hand the blocker to backend
  follow-up `LUC-1890`, and keep `LUC-1887` blocked on that lane.
