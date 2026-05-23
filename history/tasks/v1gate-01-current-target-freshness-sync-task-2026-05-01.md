# Task

## Header
- ID: V1GATE-01
- Title: Refresh current target freshness and stage availability before final V1 gates
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: `V1FINAL-01`, `V1EXCEL-04`, `V1EXCEL-05`
- Priority: P0

## Context
The active V1 blockers are release-gate and target-environment evidence tasks.
Because production and stage availability can change independently from local
code, the queue needs a fresh public preflight before any further V1 conclusion.

## Goal
Record the current public production build identity, production smoke status,
stage smoke status, and the gap between deployed production and local `HEAD`.

## Scope
- Production public deploy smoke.
- Production web build-info.
- Stage public deploy smoke.
- Git ancestry comparison between production SHA and local `HEAD`.
- Source-of-truth docs/context sync.

## Implementation Plan
1. Run public production deploy smoke without worker/protected checks.
2. Read production build-info.
3. Run public stage deploy smoke without worker/protected checks.
4. Compare production SHA with local `HEAD`.
5. Publish an operations evidence artifact.
6. Sync planning/context files with the refreshed target truth.

## Acceptance Criteria
- Production public smoke result is recorded.
- Stage public smoke result is recorded.
- Production build-info SHA is recorded.
- Local commits not present in production are recorded.
- Remaining V1 blockers are classified as operational/evidence blockers unless
  a new code mismatch is found.

## Definition of Done
- [x] Production public smoke evidence exists.
- [x] Stage public smoke evidence exists.
- [x] Production build-info evidence exists.
- [x] Git ancestry comparison is captured.
- [x] Planning/context docs are synced.
- [x] Repository guardrails pass after docs sync.

## Forbidden
- Do not claim protected production runtime evidence without auth.
- Do not mark stage green while public smoke returns `503`.
- Do not invent Coolify/VPS restore evidence from local commands.
- Do not run destructive deploy, database, or restore actions from this task.

## Validation Evidence
- Tests:
  - `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> PASS.
  - `pnpm run ops:deploy:smoke -- --api-base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch --no-workers` -> expected FAIL, three `503` public target checks.
  - `git merge-base --is-ancestor 662ce9b48fac6a48963a62f8d3bc4ac2f645cac6 HEAD` -> PASS; production SHA is an ancestor of local `HEAD`.
- Manual checks:
  - `GET https://soar.luckysparrow.ch/api/build-info` returned `gitSha=662ce9b48fac6a48963a62f8d3bc4ac2f645cac6`.
- Screenshots/logs:
  - `history/plans/v1gate-01-current-target-freshness-2026-05-01.md`
- High-risk checks:
  - No secrets or auth-bearing arguments were recorded.

## Architecture Evidence
- Architecture source reviewed: `history/plans/v1-final-test-structure-2026-05-01.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no for this sync; release owner decision remains
  required for stage waiver/manual matrix/sign-off.
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: none from this task.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no rollback action performed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Review Checklist
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated because repository truth changed.
- [x] Learning journal update not required.

## Result Report
- Task summary: refreshed target truth for final V1 gates. Production is public
  healthy on `662ce9b4`; stage remains public `503`; production is behind local
  `HEAD` by three commits.
- Files changed: planning/context/operations evidence docs.
- How tested: commands listed in Validation Evidence.
- What is incomplete: protected runtime evidence, production restore drill,
  stage restore, manual matrix, and sign-off remain outside this task.
- Next steps:
  1. restore stage or record a release-owner stage waiver;
  2. deploy `ef37fca0` or later if the newest local slices are in V1 scope;
  3. run production restore drill from a context with DB container settings;
  4. complete or waive the manual operator matrix and rerun final gate.
- Decisions made: no GO claim; V1 remains `NO-GO/BLOCKED`.
