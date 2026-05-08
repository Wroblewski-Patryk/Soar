# V1 Release Gate Live Import Evidence Task (2026-05-08)

## Header
- ID: V1-RELEASE-GATE-LIVEIMPORT-EVIDENCE-2026-05-08
- Title: Require LIVEIMPORT-03 readback evidence in V1 release gate
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: V1-RELEASE-GATE-CURRENT-DRY-RUN-2026-05-08
- Priority: P0
- Iteration: 37
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The final blocker pack requires `LIVEIMPORT-03` authenticated production
runtime readback, but `ops:release:v1:gate` currently classifies activation,
RC, restore, and rollback evidence only. This means a future release-gate
report could become `ready` without explicitly proving protected live-import
runtime readback.

## Goal
Add `LIVEIMPORT-03` as a required production evidence family in the V1 release
gate, with validation that the artifact is fresh and contains actual runtime
readback visibility.

## Success Signal
- User or operator problem: final V1 gate cannot pass without live-import
  runtime evidence.
- Expected product or reliability outcome: V1 approval is aligned with the
  active paper/live/live-import blocker contract.
- How success will be observed: production dry-run reports
  `evidence:liveImportReadback:missing` until the protected artifact exists.
- Post-launch learning needed: no

## Scope
- `scripts/runV1ReleaseGate.mjs`
- `scripts/runV1ReleaseGate.test.mjs`
- generated dry-run artifacts under `docs/operations`
- final blocker/state/context docs
- this task artifact

## Implementation Plan
1. Add a production-required `liveImportReadback` evidence family matching
   `docs/operations/liveimport-03-prod-readback-YYYY-MM-DD.json`.
2. Require the artifact to contain at least one runtime readback and no missing
   expected symbols.
3. Update release-gate tests to include positive and negative live-import
   evidence coverage.
4. Regenerate the production dry-run report to show the missing
   `LIVEIMPORT-03` blocker.
5. Validate tests, guardrails, docs parity, diff check, and public smoke.

## Acceptance Criteria
- Production release gate marks `LIVEIMPORT-03 runtime readback` missing when
  no artifact exists.
- Valid test fixtures with runtime readback and no missing symbols pass.
- Failed/missing fixtures block readiness.
- V1 remains `NO-GO` without real protected readback.

## Definition of Done
- [x] Release gate requires `LIVEIMPORT-03` in prod.
- [x] Tests cover the new evidence family.
- [x] Dry-run artifact shows the new blocker.
- [x] Validation passes.

## Forbidden
- Creating fake production readback evidence.
- Treating public health/build-info as `LIVEIMPORT-03`.
- Running live-money or destructive production actions.
- Weakening existing restore/rollback/RC evidence checks.

## Validation Evidence
- Tests:
  - `node --check scripts/runV1ReleaseGate.mjs` => PASS
  - `node --check scripts/runV1ReleaseGate.test.mjs` => PASS
  - `node --test scripts/runV1ReleaseGate.test.mjs` => PASS (`9/9`)
- Manual checks:
  - `pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-local-quality --dry-run --artifact-stamp 2026-05-08Tliveimport-required-dry-run` => PASS command, `readiness=not_ready`
- Screenshots/logs:
  - `docs/operations/v1-release-gate-prod-2026-05-08Tliveimport-required-dry-run.md`
  - `docs/operations/_artifacts-v1-release-gate-prod-2026-05-08Tliveimport-required-dry-run.json`
- High-risk checks:
  - dry-run only
  - no fake live-import artifact was created
  - no protected production credentials, exchange writes, DB writes,
    live-money actions, or destructive operations were used

## Architecture Evidence
- Architecture source reviewed: final blocker pack, active state, release gate
  script.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: release-gate evidence family only
- Rollback note: revert this gate/docs commit if needed; no runtime change.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: final gate does not explicitly require `LIVEIMPORT-03`.
- Gaps: final blocker pack and release gate are not fully aligned.
- Inconsistencies: release gate could report ready after recovery/sign-off
  evidence while live-import readback remains missing.
- Architecture constraints: protected evidence only, fail closed.

### 2. Select One Priority Task
- Selected task: add live-import evidence to final release gate.
- Priority rationale: it directly protects the user's V1 bot paper/live/live
  correctness goal.
- Why other candidates were deferred: actual readback still needs production
  auth.

### 3. Plan Implementation
- Files or surfaces to modify: release gate script/tests and release state.
- Logic: evidence family and pass-pattern validation only.
- Edge cases: missing artifact must block prod; stage remains unaffected.

### 4. Execute Implementation
- Implementation notes: added `liveImportReadback` to the existing
  `EVIDENCE_FAMILIES` release-gate model and required runtime readback,
  empty missing-symbols, and token redaction checks.

### 5. Verify and Test
- Validation performed: syntax checks, Node release-gate tests, and production
  dry-run generation.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: docs-only reminder; rejected because final gate
  must enforce the blocker.
- Technical debt introduced: no
- Scalability assessment: uses existing evidence-family model.
- Refinements made: used existing evidence-family structure rather than a
  parallel release gate.

### 7. Update Documentation and Knowledge
- Docs updated: final blocker pack, planning queue, task artifact.
- Context updated: next steps, system health, known issues, project state,
  task board.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Operation mode was selected according to iteration rotation.
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

## Result Report
- Task summary: required `LIVEIMPORT-03` runtime readback evidence in the
  production V1 release gate.
- Files changed: release gate script/tests, new dry-run artifacts, final
  blocker pack, active state/context docs, planning queue, and this task
  artifact.
- How tested: syntax, focused Node release-gate tests, production dry-run.
- What is incomplete: actual protected `LIVEIMPORT-03` readback remains
  blocked until approved production auth is available.
- Next steps: execute final blocker pack with production auth/access.
- Decisions made: final release `ready` must require protected live-import
  evidence, not only recovery proof and RC artifacts.
