# Task

## Header
- ID: LUC-959
- Title: [Soar][Coordination] Check and fix if not good
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Soar Project Manager
- Depends on: none
- Priority: P2
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
Wake payload assigned `LUC-959` with instruction `check and fix if not good`, no pending comments, and `fallbackFetchNeeded=false`. Local source-of-truth had no existing `LUC-959` record.

## Goal
Verify whether `LUC-959` is represented in project state and fix missing operational traceability if not.

## Scope
- Local traceability check in source-of-truth and evidence files.
- Create missing task artifact for this issue.
- Synchronize board/state entries.
- No runtime/product code or deployment mutation.

## Constraints
- Project Manager lane only (coordination, no feature implementation).
- Keep changes reversible and evidence-only.
- Do not alter unrelated active issue content.

## Implementation Plan
1. Search for `LUC-959` across canonical state/docs/evidence.
2. Classify result (`good` if present and coherent; `not good` if absent/inconsistent).
3. If `not good`, create missing issue artifact and sync source-of-truth records.
4. Publish explicit final disposition.

## Acceptance Criteria
- `LUC-959` presence check is documented with command evidence.
- Missing traceability is repaired in durable files.
- Heartbeat has explicit disposition and residual-risk note.

## Definition of Done
- Presence audit executed and recorded.
- Fix applied for any missing traceability.
- `TASK_BOARD` and `PROJECT_STATE` updated.
- No runtime/deploy mutation introduced.

## Actions Executed
1. Acknowledged wake-first scope (`issue_assigned`, `fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
2. Ran traceability scan:
   - `rg -n "LUC-959|luc-959" -S .`
3. Scan result: no local `LUC-959` occurrence found (`not good` classification: missing local issue traceability).
4. Applied fix:
   - created this task artifact,
   - appended `LUC-959` checkpoint entry to `.codex/context/TASK_BOARD.md`,
   - appended `LUC-959` checkpoint entry to `.codex/context/PROJECT_STATE.md`.

## Verification
- `rg -n "LUC-959|luc-959" -S .codex/context history/tasks`

## Result Report
- Outcome: missing local traceability was repaired; issue can be treated as coordination checkpoint complete.
- Files changed:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `history/tasks/luc-959-check-and-fix-if-not-good-2026-05-31-task.md`
- Runtime/product code changes: none.
- Deploy impact: none.
- Residual risk:
  1. This heartbeat repairs project-local evidence/state only; external Paperclip issue thread status must still be updated by the integration harness/API lane.

## Continuation - 2026-05-31 (`finish_successful_run_handoff`)

### Wake Delta Acknowledgement
- Wake `finish_successful_run_handoff` consumed first from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Delta impact: prior `done` checkpoint was too narrow versus real issue objective (runtime DCA vs TP/SL/TTP/TSL correctness + commit/push/redeploy verification).

### Concrete Action In This Heartbeat
1. Ran architecture/evidence/code scan for DCA + TP/SL/TTP/TSL contracts:
   - `rg -n "DCA|TSL|TTP|take profit|stop loss|trailing" docs apps .agents .codex -S`
2. Confirmed canonical architecture and prior fix lineage are present, including:
   - `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-AUTOMATION.md` (runtime decision path for DCA/TP/SL/TTP/TSL),
   - `docs/architecture/nodes/SOAR-FEATURE-RUNTIME-DCA-PNL.md`,
   - `docs/architecture/nodes/SOAR-TEST-RUNTIME-DCA-PNL.md`,
   - `apps/api/src/modules/bots/runtimePositionSerialization.service.test.ts` (side-aware DCA gating tests for dynamic TTP/TSL visibility),
   - `.codex/context/TASK_BOARD.md` rows documenting prior parity fixes (`RUNTIME-ARCHITECTURE-DCA-TP-PARITY-2026-05-22`, `LIVE-DCA-SUBMITTED-FILL-GATE-2026-05-22`, `RUNTIME-DCA-PROTECTION-DISPLAY-PARITY-2026-05-23`).
3. Classified issue state as implementation/reverification required (not a missing-architecture problem).
4. Published explicit role-safe unblock path (delegation required for code+deploy lane).

### Multi-Lane Handoff Required (Role Boundary)
This issue now needs specialist execution beyond PM role ownership:
- Engineering Delivery Lead / Backend Builder:
  - reproduce suspected live/runtime regression,
  - validate runtime close-order precedence with side-aware pending DCA gates,
  - implement fix if regression confirmed,
  - provide commit SHA + push state.
- QA/Test:
  - run focused regression proof for DCA-before-close lifecycle (TP/SL/TTP/TSL),
  - provide deterministic failing-before / passing-after evidence.
- Ops/Release:
  - verify Coolify auto-redeploy for pushed SHA,
  - provide post-deploy smoke packet and build-info SHA parity.

### Verification
- `rg -n "DCA|TSL|TTP|take profit|stop loss|trailing" docs apps .agents .codex -S`

### Final Disposition For This Heartbeat
- Status: `blocked` (first-class role boundary + specialist execution dependency).
- Unblock owner/action:
  1. **Owner**: Engineering Delivery Lead
     **Action**: execute runtime DCA/close regression lane and publish code-level verdict with SHA.
  2. **Owner**: QA/Test
     **Action**: attach focused DCA-before-close regression evidence on resulting SHA.
  3. **Owner**: Ops Release Lead
     **Action**: confirm Coolify redeploy and post-deploy smoke/build-info parity.

