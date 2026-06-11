# Task

## Header
- ID: LUC-2936
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
Paperclip assigned [LUC-2936](/LUC/issues/LUC-2936) as a no-stall queue
expeditor under [LUC-12](/LUC/issues/LUC-12). Wake reason was
`issue_assigned`, pending comments were `0/0`, `fallbackFetchNeeded=false`,
and checkout was already claimed by the harness, so checkout was not repeated.

## Goal
Inspect the current Soar architecture-awareness queue, avoid duplicate blocked
or completed lanes, and create exactly one bounded next owner lane if a
worker-ready non-duplicate family remains.

## Scope
- Paperclip heartbeat-context readback for [LUC-2936](/LUC/issues/LUC-2936).
- Current `docs/status/architecture-awareness-report.md` readback.
- Duplicate search for `scripts/runProdAuthSessionBrowserProof.mjs` local proof
  work.
- Child issue creation for the next Test Automation lane.

## Implementation Plan
1. Read the current Paperclip issue context and local queue state.
2. Read the current architecture-awareness report.
3. Deduplicate existing generated-index, `goLiveSmoke`, protected-route, and
   protected production auth/session lanes.
4. Create one bounded child issue for the next non-duplicate local helper proof
   family.
5. Record evidence and close the PM checkpoint.

## Acceptance Criteria
- Existing blocked or completed lanes are not duplicated.
- Any new lane has one owner, clear scope, forbidden actions, and verification
  expectations.
- PM does not implement code, use credentials, run production smoke, deploy,
  push, restart, mutate data, or launch protected browser proof.

## Definition of Done
- [x] Paperclip heartbeat-context readback succeeded.
- [x] Current architecture-awareness report was read.
- [x] Duplicate search was performed.
- [x] One child issue was created for the next non-duplicate lane.
- [x] Source-of-truth status files were updated.

## Forbidden
- Code implementation in the PM lane.
- Production auth/session use.
- Protected production browser proof.
- Deploy, push, restart, rollback, database mutation, exchange action, order,
  position, live-trading mutation, or secret handling.

## Validation Evidence
- Paperclip heartbeat-context for [LUC-2936](/LUC/issues/LUC-2936) succeeded.
- `docs/status/architecture-awareness-report.md` generated
  `2026-06-07T20:57:53.308Z` reports `218` actionable missing-test links.
- Existing generated function/user-action index helpers remain deduped to
  [LUC-2791](/LUC/issues/LUC-2791).
- Existing `goLiveSmoke` helper work remains deduped to
  [LUC-2792](/LUC/issues/LUC-2792) and [LUC-2873](/LUC/issues/LUC-2873).
- Completed [LUC-2935](/LUC/issues/LUC-2935) covered non-mutating
  `scripts/runLocalProtectedRouteActionProof.mjs` helpers and classified the
  remaining browser/server orchestration helpers.
- Duplicate search for `runProdAuthSessionBrowserProof` found only older
  protected production evidence/session blockers, including
  [LUC-1756](/LUC/issues/LUC-1756) and [LUC-1774](/LUC/issues/LUC-1774), not a
  current local helper relation/test proof lane.
- `Test-Path scripts/runProdAuthSessionBrowserProof.test.mjs` returned
  `False`.
- `node --check scripts/runProdAuthSessionBrowserProof.mjs` passed.
- `corepack pnpm softwarehouse:control-tick` failed because
  `softwarehouse:control-tick` is not exposed in this checkout.
- Created [LUC-2939](/LUC/issues/LUC-2939) for Test Automation Engineer to
  add or classify local-only helper proof for
  `scripts/runProdAuthSessionBrowserProof.mjs`.

## Architecture Evidence
- Architecture source reviewed:
  `docs/status/architecture-awareness-report.md`,
  `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Result Report
- Task summary: PM queue checkpoint delegated the next non-duplicate local
  helper proof family to [LUC-2939](/LUC/issues/LUC-2939).
- Files changed:
  - `history/tasks/luc-2936-no-stall-queue-expeditor-2026-06-07-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - Paperclip heartbeat-context readback.
  - Paperclip duplicate searches.
  - local architecture-awareness report readback.
  - `node --check scripts/runProdAuthSessionBrowserProof.mjs`.
  - `corepack pnpm softwarehouse:control-tick` attempted and failed as
    unavailable in this checkout.
- What is incomplete:
  - [LUC-2939](/LUC/issues/LUC-2939) must implement or classify the helper
    proof. This PM lane made no code changes.
- Next steps:
  - Execute [LUC-2939](/LUC/issues/LUC-2939) as the Test Automation local proof
    lane. Do not run protected production auth/session proof from that child.
