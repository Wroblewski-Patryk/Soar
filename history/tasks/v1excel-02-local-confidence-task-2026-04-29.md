# Task

## Header
- ID: V1EXCEL-02
- Title: Restore the fully reproducible local confidence path
- Task Type: qa
- Current Stage: verification
- Status: DONE
- Owner: Codex Execution Agent
- Depends on: `V1EXCEL-01`
- Priority: P0

## Context
`V1EXCEL-01` classified one remaining local reproducibility gap: the umbrella
`test:go-live:smoke` wrapper was still blocked by historical local
migration-history debt, even though the narrower go-live packs were already
green.

## Goal
Restore one honest local confidence path for the current repository candidate,
or classify the blocker precisely if the repo does not own it.

## Deliverable For This Stage
Fresh local closure evidence showing whether the umbrella smoke is reproducible
today and what exact recovery path another engineer must use if the local DB
history has drifted.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] The current local umbrella smoke status is proven with fresh evidence
- [x] The local migration-history blocker is either repaired or classified
- [x] Recovery steps are documented in canonical engineering docs
- [x] Queue/context docs are synchronized

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm run test:go-live:smoke`
- Manual checks:
  - inspected local Prisma migration-history state before repair
  - verified the schema already contained the affected objects
  - used non-destructive `prisma migrate resolve` recovery
- Screenshots/logs: not applicable
- High-risk checks:
  - kept the result fail-closed to the real Prisma migration state
  - did not fake readiness by skipping the umbrella smoke

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: yes
- Rollback note: the recovery is local-only and non-destructive to the repo;
  if the local DB should be wiped instead, use the documented `docker compose down -v`
  path from engineering docs

## Review Checklist (mandatory)
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
The blocker was repo-adjacent but not a current code defect. The schema on this
workstation was already ahead of the failed migration-history rows, so
`migrate resolve` was the truthful repair.

## Production-Grade Required Contract

### Goal
Make local confidence reproducible enough that another engineer can rerun the
umbrella go-live path without guessing through Prisma drift.

### Scope
- `scripts/goLiveSmoke.mjs`
- `docs/engineering/local-development.md`
- local validation evidence
- canonical queue/context sync

### Implementation Plan
1. Inspect the local migration blocker precisely.
2. Repair history non-destructively if the schema already matches.
3. Rerun the umbrella local smoke.
4. Document the exact safe recovery path.
5. Sync queue/context and learning journal.

### Acceptance Criteria
- `pnpm run test:go-live:smoke` passes locally
- recovery steps are explicit and reproducible
- the repo no longer hides the likely local `P3009` fix behind generic noise

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes, through Prisma migrate deploy plus
  prior local schema inspection
- Loading state verified: not applicable
- Error state verified: yes, previous `P3009` blocker was classified and documented
- Refresh/restart behavior verified: yes, the umbrella smoke exercised the full local path
- Regression check performed: umbrella go-live smoke

## Result Report

- Task summary: repaired local Prisma migration-history drift and restored a green
  umbrella local confidence path
- Files changed:
  - `scripts/goLiveSmoke.mjs`
  - `docs/engineering/local-development.md`
  - canonical docs/context
- How tested:
  - `pnpm run test:go-live:smoke`
- What is incomplete:
  - manual real-account verification and authenticated remote OPS evidence are
    tracked separately under `V1EXCEL-03..06`
- Next steps:
  - execute the manual matrix and remote stage/prod confidence tasks

