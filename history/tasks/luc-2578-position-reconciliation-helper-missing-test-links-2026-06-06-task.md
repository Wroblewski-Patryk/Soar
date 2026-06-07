# LUC-2578 Position Reconciliation Helper Missing-Test Links

## Header
- ID: LUC-2578
- Title: Cover architecture missing-test links for position reconciliation helpers
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Core Backend Engineer
- Depends on: LUC-2574
- Priority: P1
- Module Confidence Rows: architecture/docs parity confidence; positions reconciliation local proof
- Requirement Rows: REQ-DOC-031
- Quality Scenario Rows: not applicable
- Risk Rows: money-facing runtime state traceability risk
- Iteration: 2026-06-06 heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-2578-POSITION-RECONCILIATION-HELPER-TEST-LINKS-2026-06-06
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task was selected.
- [x] Operation mode is BUILDER for this backend repair heartbeat.
- [x] Source-of-truth files and architecture report were reviewed.
- [x] Affected module confidence row was identified.
- [x] The task improves release confidence by closing money-facing helper test links.

## Context
[LUC-2578](/LUC/issues/LUC-2578) is a backend repair slice from
[LUC-2574](/LUC/issues/LUC-2574). The architecture awareness report listed
position reconciliation helpers under top actionable missing-test links:
`livePositionReconciliation.helpers.ts`, `livePositionReconciliation.history.ts`,
and `positionCloseAttribution.ts`.

## Goal
Add or link focused backend test evidence for the listed helper family and
refresh architecture evidence so those rows are no longer reported as top
actionable missing-test links.

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.helpers.test.ts`
- `docs/architecture/relations/priority-test-links.csv`
- Generated architecture evidence under `docs/graphs/*` and `docs/status/*`
- Project state and module confidence notes

## Implementation Plan
1. Inspect the current architecture report and existing tests.
2. Add focused non-DB Vitest coverage for helper behavior.
3. Add scanner-readable priority test links for the target helper functions.
4. Run focused tests, API typecheck, architecture graph generation, and
   architecture awareness refresh.
5. Record residual risk and source-of-truth updates.

## Acceptance Criteria
- Focused helper tests pass.
- API typecheck passes.
- `priority-test-links.csv` contains direct [LUC-2578](/LUC/issues/LUC-2578)
  rows for all targeted helper functions.
- Refreshed architecture awareness report no longer lists the targeted helper
  rows in the top actionable missing-test links.

## Definition of Done
- [x] Focused backend helper coverage is implemented and verified.
- [x] Architecture test-link relations are scanner-readable.
- [x] Architecture awareness was refreshed.
- [x] Residual unrelated drift is recorded.
- [x] No production, exchange, credential, deploy, or LIVE mutation occurred.

## Forbidden
- Runtime behavior changes.
- Exchange or LIVE trading mutation.
- Protected production smoke.
- Credential or secret access.
- Broad unrelated graph repair.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.helpers.test.ts --run`
    PASS, `9/9`.
  - `pnpm --filter api exec tsc --noEmit --pretty false` PASS.
- Architecture:
  - `node scripts/build-architecture-awareness-index.mjs --project Soar --root ..\Soar`
    from `C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse` PASS:
    `14710` entities, `23376` relations, generated
    `2026-06-06T22:08:42.156Z`.
  - Refreshed report shows actionable missing-test rows `736`; the previous
    target rows for `livePositionReconciliation.helpers.ts`,
    `livePositionReconciliation.history.ts`, and `positionCloseAttribution.ts`
    are absent from the top actionable missing-test list.
  - `pnpm run architecture:graph:generate` PASS: `653` nodes, `842`
    relations, `27` chains.
  - `pnpm run architecture:graph:drift:strict` BLOCKED by pre-existing worker
    test graph drift: `839/841` covered, missing
    `apps/api/src/workers/execution.worker.test.ts` and
    `apps/api/src/workers/workerBootstrap.test.ts`. This is unrelated to
    [LUC-2578](/LUC/issues/LUC-2578); the new helper test is referenced by
    `priority-test-links.csv`.
- Reality status: verified for local backend helper proof; production/LIVE
  behavior remains outside this issue.

## Architecture Evidence
- Architecture source reviewed:
  `docs/status/architecture-awareness-report.md`,
  `docs/architecture/relations/priority-test-links.csv`,
  `docs/graphs/architecture-awareness.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none for this issue.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no runtime change to roll back.

## Autonomous Loop Evidence
### 1. Analyze Current State
- The architecture report listed twelve target helper rows as top actionable
  missing-test links.
- Existing broad service tests covered some behavior but did not provide direct
  scanner-readable links for the remaining helpers.

### 2. Select One Priority Mission Objective
- Selected [LUC-2578](/LUC/issues/LUC-2578), the assigned high-priority
  backend traceability repair.

### 3. Plan Implementation
- Add focused helper tests and direct relation rows only for the named helper
  family.

### 4. Execute Implementation
- Added a non-DB helper test file covering symbol normalization, imported
  external-id scope, leverage normalization, recovered continuity/management
  semantics, lifecycle replacement, canonical entry price, history hydration,
  closed-history fallback, and close-attribution reason normalization.
- Added twelve [LUC-2578](/LUC/issues/LUC-2578) relation rows to
  `priority-test-links.csv`.

### 5. Verify and Test
- Focused tests and API typecheck passed.
- Architecture awareness refresh passed and target rows left the top
  actionable missing-test list.

### 6. Self-Review
- No runtime path was changed.
- Existing relation mechanism was reused.
- No workaround, duplicate service, or broad graph suppression was introduced.

### 7. Update Documentation and Knowledge
- Task packet, project state, active mission, task board, and module confidence
  ledger updated.
- Learning journal update: not applicable; no recurring pitfall was newly
  confirmed.

## Result Report
- Task summary: added focused backend helper tests and architecture test-link
  rows for the position reconciliation helper family.
- Files changed:
  - `apps/api/src/modules/positions/livePositionReconciliation.helpers.test.ts`
  - `docs/architecture/relations/priority-test-links.csv`
  - generated architecture awareness/status files
  - project state/task evidence files
- How tested: focused Vitest, API typecheck, architecture awareness refresh,
  architecture graph generation, targeted relation readback.
- What is incomplete: strict graph drift still fails on unrelated pre-existing
  worker test graph coverage.
- Next steps: worker graph drift belongs to a separate backend/architecture
  repair lane if the board wants strict drift fully green.
- Decisions made: no child issue was opened because the assigned helper family
  is complete; unrelated worker drift was not widened into this task.
