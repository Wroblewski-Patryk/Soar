# Task

## Header
- ID: V1COVER-00
- Title: Publish canonical LIVE runtime regression-coverage hardening packet
- Task Type: fix
- Current Stage: planning
- Status: DONE
- Owner: Backend Builder
- Depends on: `V1GUARD-A`
- Priority: P1

## Context
Focused `LIVE` protection slices are green, but broader runtime/order proof is
still weaker than the architecture requires. Recent broad Vitest runs show a
mix of shared-state leaks, legacy cleanup drift, and at least one remaining
write-path proof gap, so the next work needs one explicit canonical packet
before implementation continues.

## Goal
Freeze the remaining `LIVE exchange` regression-coverage hardening scope as one
small execution wave with explicit boundaries, file ownership, and validation.

## Deliverable For This Stage
A planning-only packet that identifies:
- the remaining broad runtime/order proof gaps,
- the smallest initial stabilization slices,
- and the validation pack that must go green before calling `LIVE` coverage
  trustworthy.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `docs/planning/v1cover-live-runtime-regression-coverage-plan-2026-04-29.md`
- `docs/planning/v1cover-00-planning-task-2026-04-29.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Publish one packet for the remaining `LIVE` runtime regression-coverage
   work.
2. Promote the first small stabilization tasks into the canonical queue.
3. Sync project/task context so execution can continue without queue drift.

## Acceptance Criteria
- [x] One canonical planning packet exists for the remaining `LIVE` runtime
      regression-coverage work.
- [x] Canonical queue/context reflect the new wave and first execution slices.
- [x] No runtime behavior changes are mixed into this planning task.

## Definition of Done
- [x] Planning docs and queue/context truth are synchronized.
- [x] The packet clearly distinguishes harness drift from likely product drift.
- [x] Validation expectations for the execution wave are explicit.

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
  - `pnpm run quality:guardrails`
- Manual checks:
  - reviewed the currently failing runtime/order packs and mapped them into one
    explicit hardening wave
- Screenshots/logs:
  - not applicable
- High-risk checks:
  - kept the packet architecture-aligned and fail-closed

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable

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

## Result Report

- Task summary: Published `V1COVER-A` to cover the remaining broad
  `LIVE exchange` runtime regression-coverage hardening work after the focused
  protection waves closed.
- Files changed:
  - `docs/planning/v1cover-live-runtime-regression-coverage-plan-2026-04-29.md`
  - `docs/planning/v1cover-00-planning-task-2026-04-29.md`
  - `docs/planning/mvp-next-commits.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- How tested:
  - `pnpm run quality:guardrails`
- What is incomplete:
  - execution slices `V1COVER-01..05`
- Next steps:
  - remove shared runtime state leaks and stale shared-helper cleanup drift
- Decisions made:
  - treat the next broad `LIVE` work as regression-proof hardening first, then
    only fix real product drift that survives the stabilized harness
