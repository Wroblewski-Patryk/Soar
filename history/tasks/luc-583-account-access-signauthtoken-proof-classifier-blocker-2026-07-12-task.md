# Task

## Header
- ID: LUC-583
- Title: Account Access signAuthToken Proof Classifier Blocker
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-586](/LUC/issues/LUC-586) (resolved)
- Priority: P1
- Module Confidence Rows: Account access / API auth JWT / app-completion truth
- Requirement Rows: Account access JWT signing behavior must have linked proof
  before leaving `implemented_needs_proof`
- Quality Scenario Rows: Source-truth completeness for Account access proof
- Risk Rows: Project truth could continue routing verified `signAuthToken` as
  unproven after focused JWT tests and doc/test links exist
- Iteration: 2026-07-12
- Operation Mode: TESTER
- Mission ID: LUC-583-ACCOUNT-ACCESS-SIGNAUTHTOKEN-PROOF-CLASSIFIER-BLOCKER-2026-07-12
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the QA verification role.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was represented by current
      project-truth/status context from the active mission files.
- [x] `.agents/core/mission-control.md` was represented by the active mission
      and prior Account access proof sequence.
- [x] Missing or template-like state tables were not bootstrapped; existing
      Account access state rows were current enough for this bounded proof.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by distinguishing a real proof pass
      from a source-truth classifier blocker.

## Mission Block
- Mission objective: prove the `signAuthToken` Account access row or identify
  the exact blocker preventing project-truth closure.
- Release objective advanced: Account access source-truth proof burn-down.
- Included slices: focused JWT proof rerun, app-completion refresh,
  project-truth refresh, classifier diagnosis, child issue handoff.
- Explicit exclusions: runtime auth changes, production mutation, protected
  credential access, deploy, push, DB/Redis mutation, live trading/account
  mutation.
- Checkpoint cadence: single heartbeat.
- Stop conditions: proof failure, generated-index failure, or non-QA classifier
  mismatch requiring handoff.
- Handoff expectation: resolved by [LUC-586](/LUC/issues/LUC-586).

## Context

[LUC-583](/LUC/issues/LUC-583) was dispatched from project truth for:

`Account access: signAuthToken has app-completion risk implemented_needs_proof.`

The workspace already contained a focused proof packet from
`history/evidence/luc-577-account-access-signauthtoken-proof-2026-07-12.md`.
QA revalidated the proof and generated-index result before disposition.

## Goal

Determine whether current QA evidence is sufficient to close the
`signAuthToken` app-completion row, and leave a first-class owner path if the
gap remains for non-QA reasons.

## Scope

- `apps/api/src/modules/auth/auth.jwt.ts#signAuthToken`
- `apps/api/src/modules/auth/auth.jwt.test.ts`
- `docs/architecture/relations/priority-test-links.csv`
- `docs/architecture/scanner-overrides.json`
- `docs/status/app-completion-index.*`
- `docs/status/project-truth-index.*`
- `history/evidence/luc-583-account-access-signauthtoken-proof-classifier-blocker-2026-07-12.md`

## Implementation Plan

1. Read the scoped Paperclip wake context and local Account access state.
2. Inspect existing proof/index changes without reverting unrelated work.
3. Rerun the focused JWT proof.
4. Rerun app-completion and project-truth generators.
5. If the row remains, diagnose whether the missing piece is QA proof or
   classifier/source-truth behavior.
6. Create a child issue for the correct owner when the remaining work is outside
   QVE ownership.
7. Update local evidence and state.

## Acceptance Criteria

- Focused proof command result is recorded.
- App-completion/project-truth refresh result is recorded.
- The remaining blocker is specific and assigned if QA cannot close it.
- The parent issue is not left as idle `in_progress`.
- Current generated truth routes past `signAuthToken`.

## Definition of Done

- [x] `DEFINITION_OF_DONE.md` principles respected for this verification-only
      slice.
- [x] Proof was run or failure was recorded.
- [x] Remaining work had a first-class Paperclip owner path and is now resolved.

## Forbidden

- Runtime auth changes.
- Temporary bypasses or classifier hacks.
- Production deploy, push, restart, rollback, protected smoke, secret/account
  readback, DB/Redis mutation, exchange/payment/subscription mutation, order,
  position, bot activation, or live-trading action.

## Validation Evidence

- Tests:
  - `pnpm --filter api exec vitest run src/modules/auth/auth.jwt.test.ts --run --reporter=dot`
    - PASS, `1` file / `5` tests.
- Manual checks:
  - `docs/graphs/architecture-awareness.json` has `documents` and `tests`
    relations for `signAuthToken`.
  - `docs/status/project-truth-index.md` now routes the first Account access
    gap to `auth.service.ts#loginUser` as `missing_doc_link`.
- Screenshots/logs: command output captured in heartbeat.
- High-risk checks: no protected or mutating runtime action performed.
- Module confidence ledger updated: no; this heartbeat did not change runtime
  module behavior.
- Requirements matrix updated: no; proof closure is recorded in task/evidence.
- Risk register updated: yes.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed: `docs/status/project-truth-index.md`,
  `docs/status/app-completion-index.md`, `docs/graphs/architecture-awareness.json`.
- Fits approved architecture: yes.
- Mismatch discovered: resolved by [LUC-586](/LUC/issues/LUC-586).
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none for [LUC-583](/LUC/issues/LUC-583).

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: project truth previously routed `signAuthToken` as
  `implemented_needs_proof`; current readback routes past it.
- Gaps: no remaining `signAuthToken` proof gap.
- Inconsistencies: resolved by [LUC-586](/LUC/issues/LUC-586).
- Architecture constraints: next Account access row is a separate doc-link row.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: issue heartbeat context, Account access state files,
  generated indexes, graph relations, focused JWT test.
- Why it was safe to continue: only local read-only proof and generated-index
  refresh were required.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-583](/LUC/issues/LUC-583).
- Priority rationale: active Paperclip wake payload.
- Why other candidates were deferred: scoped wake forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state only.
- Logic: no runtime logic change.
- Edge cases: do not treat proof pass as full closure when generated truth still
  reports the row.

### 4. Execute Implementation
- Implementation notes: no runtime implementation; child [LUC-586](/LUC/issues/LUC-586)
  resolved the stale classifier blocker.

### 5. Verify and Test
- Validation performed: focused JWT test and generated-index refresh.
- Result: proof pass; classifier gap resolved.

### 6. Self-Review
- Simpler option considered: mark done after test pass.
- Technical debt introduced: no.
- Scalability assessment: child issue avoided repeating QA proof loops against a
  stale classifier blocker.
- Refinements made: parent disposition uses first-class blocker.

### 7. Update Documentation and Knowledge
- Docs updated: task/evidence/state/risk.
- Context updated: yes.
- Learning journal updated: not applicable.

## Result Report

- Task summary: `signAuthToken` behavior proof passed, and generated project
  truth now routes past the row after [LUC-586](/LUC/issues/LUC-586).
- Files changed:
  - `history/evidence/luc-583-account-access-signauthtoken-proof-classifier-blocker-2026-07-12.md`
  - `history/evidence/luc-583-account-access-signauthtoken-proof-closure-2026-07-12.md`
  - `history/tasks/luc-583-account-access-signauthtoken-proof-classifier-blocker-2026-07-12-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/risk-register.md`
- How tested:
  - focused JWT test passed;
  - app-completion refresh passed;
  - project-truth refresh passed.
- What is incomplete: no remaining action on [LUC-583](/LUC/issues/LUC-583).
- Next steps: next Account access row is `auth.service.ts#loginUser` as
  `missing_doc_link`, owned separately by Docs Memory Lead + Project Manager.
- Decisions made: close [LUC-583](/LUC/issues/LUC-583) after blocker resolution
  and fresh proof/readback.
