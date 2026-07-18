# Task

## Header
- ID: LUC-1460
- Title: Diagnose production `/ready` 503 and route the narrowest recovery lane
- Task Type: research
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release

## Context
Soar project-truth dispatch raised a fresh production gap on Saturday, July 18, 2026: public API `/ready` returned `503`. Protected gates still forbid deploy/restart/protected smoke from this lane without accepted owner approval.

## Goal
Classify the current public `/ready` failure from the smallest valid evidence surface, name the failing resource/dependency, and route exactly one honest next owner path without duplicating permits.

## Constraints
- no push, deploy, restart, rollback, or protected smoke
- no secret disclosure
- use existing evidence/permits before creating new lanes

## Definition of Done
- [x] Fresh public `/health`, `/ready`, `/`, and `/api/build-info` status recorded
- [x] Code-level readiness gates identified
- [x] Exact failing dependency/resource classified from existing evidence
- [x] One narrow next owner/action path selected without duplication

## Forbidden
- new mutation lane without evidence that no valid permit path already exists
- protected-route probing without gate approval
- code/config changes unrelated to diagnosis

## Result Report
- Public probe on `2026-07-18T01:06Z` reconfirmed:
  - API `/health` -> `200`
  - API `/ready` -> `503`
  - Web `/` -> `200`
  - Web `/api/build-info` -> `200` with `gitSha=b0b2c2ce9477a32fcda7717f447ad46aa4327589`
- Local code readback shows `/ready` can fail only from secret readiness or runtime dependency readiness.
- Existing July 17 evidence already isolates the active production dependency failure to Coolify `redis -> restarting:unhealthy`, while Postgres remains healthy.
- Existing narrow permit path already exists in `LUC-1387`; no new permit issue is needed.
- Final state for this lane: blocked on Security Review Lead or Ops Release Lead to approve/execute the single Redis restart action already defined by `LUC-1387`.
