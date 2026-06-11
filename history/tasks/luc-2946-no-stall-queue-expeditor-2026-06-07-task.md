# Task

## Header
- ID: LUC-2946
- Title: [Soar][PM] No-stall queue expeditor
- Task Type: coordination
- Current Stage: verification
- Status: DONE / DELEGATED
- Owner: Soar Product Manager
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph repair-lane hygiene
- Requirement Rows: not applicable
- Quality Scenario Rows: regression evidence loop
- Risk Rows: protected proof and credential boundary
- Iteration: 2026-06-07
- Operation Mode: BUILDER
- Mission ID: LUC-12
- Mission Status: DELEGATED

## Context
Paperclip assigned [LUC-2946](/LUC/issues/LUC-2946) as a no-stall queue
expeditor under [LUC-12](/LUC/issues/LUC-12). Wake reason was
`issue_assigned`, pending comments were `0/0`, `fallbackFetchNeeded=false`,
and checkout was already claimed by the harness, so checkout was not repeated.

## Goal
Inspect the current Soar architecture-awareness queue, avoid duplicate blocked
or completed lanes, and create exactly one bounded next owner lane if a
worker-ready non-duplicate family remains.

## Scope
- Paperclip heartbeat-context readback for [LUC-2946](/LUC/issues/LUC-2946).
- Current `docs/status/architecture-awareness-report.md` readback.
- Duplicate searches for `scripts/runProdPositionsProof.mjs` and adjacent
  protected proof helper families.
- Child issue creation for the next Test Automation lane.

## Implementation Plan
1. Read the current Paperclip issue context and local queue state.
2. Read the current architecture-awareness report.
3. Deduplicate existing generated-index, `goLiveSmoke`, protected-route,
   prod-auth, and prod-fixture lanes.
4. Create one bounded child issue for the next non-duplicate local helper proof
   family.
5. Record evidence and close the PM checkpoint.

## Acceptance Criteria
- Existing blocked or completed lanes are not duplicated.
- Any new lane has one owner, clear scope, forbidden actions, and verification
  expectations.
- PM does not implement code, use credentials, run production smoke, deploy,
  push, restart, mutate data, or launch protected browser/proof flows.

## Definition of Done
- [x] Paperclip heartbeat-context readback succeeded.
- [x] Current architecture-awareness report was read.
- [x] Duplicate search was performed.
- [x] One child issue was created for the next non-duplicate lane.
- [x] Source-of-truth status files were updated.

## Forbidden
- Code implementation in the PM lane.
- Production positions proof.
- Production auth/session use.
- Protected production browser proof.
- Deploy, push, restart, rollback, database mutation, exchange action, order,
  position, live-trading mutation, or secret handling.

## Validation Evidence
- Paperclip heartbeat-context for [LUC-2946](/LUC/issues/LUC-2946) succeeded.
- `docs/status/architecture-awareness-report.md` generated
  `2026-06-07T21:37:41.107Z` reports `193` actionable missing-test links.
- Existing generated function/user-action index helpers remain deduped to
  [LUC-2791](/LUC/issues/LUC-2791).
- Existing `goLiveSmoke` helper work remains deduped to
  [LUC-2792](/LUC/issues/LUC-2792) and [LUC-2873](/LUC/issues/LUC-2873).
- Completed [LUC-2935](/LUC/issues/LUC-2935), [LUC-2939](/LUC/issues/LUC-2939),
  and [LUC-2945](/LUC/issues/LUC-2945) already own recent protected-route,
  prod-auth, and prod-fixture helper proof families.
- Duplicate search for `runProdPositionsProof` found no existing current
  Paperclip child lane.
- Duplicate search for `runProdSecurityExchangeProof` found only an unrelated
  older docs bucket, not a current helper proof lane.
- `Test-Path scripts/runProdPositionsProof.test.mjs` returned `False`.
- `node --check scripts/runProdPositionsProof.mjs` passed.
- `corepack pnpm softwarehouse:control-tick` failed because
  `softwarehouse:control-tick` is not exposed in this checkout.
- Created [LUC-2949](/LUC/issues/LUC-2949) for Test Automation Engineer to
  add or classify local-only helper proof for
  `scripts/runProdPositionsProof.mjs`. The child description contains one stale
  template reference to `LUC-2947` in the relation-readback sentence; actual
  relation rows, if added by the child, should use [LUC-2949](/LUC/issues/LUC-2949).

## Architecture Evidence
- Architecture source reviewed:
  `docs/status/architecture-awareness-report.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Result Report
- Task summary: PM queue checkpoint delegated the next non-duplicate local
  helper proof family to [LUC-2949](/LUC/issues/LUC-2949).
- Files changed:
  - `history/tasks/luc-2946-no-stall-queue-expeditor-2026-06-07-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - Paperclip heartbeat-context readback.
  - Paperclip duplicate searches.
  - local architecture-awareness report readback.
  - `node --check scripts/runProdPositionsProof.mjs`.
  - `corepack pnpm softwarehouse:control-tick` attempted and failed as
    unavailable in this checkout.
- What is incomplete:
  - [LUC-2949](/LUC/issues/LUC-2949) must implement or classify the helper
    proof. This PM lane made no code changes.
- Next steps:
  - Execute [LUC-2949](/LUC/issues/LUC-2949) as the Test Automation local proof
    lane. Do not run production positions proof or mutate orders/positions.
