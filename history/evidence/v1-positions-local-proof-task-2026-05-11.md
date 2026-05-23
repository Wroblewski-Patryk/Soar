# Task

## Header
- ID: V1-POSITIONS-LOCAL-PROOF-2026-05-11
- Title: Positions local proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: V1 Manual Orders local proof
- Priority: P0
- Module Confidence Rows: SOAR-POSITIONS-001
- Requirement Rows: REQ-FUNC-011
- Quality Scenario Rows: QA-011
- Risk Rows: RISK-011
- Iteration: 11
- Operation Mode: BUILDER
- Mission ID: V1-RELEASE-CONFIDENCE-2026-05-11
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: Prove Positions local contracts for V1.
- Release objective advanced: Move Positions from `UNVERIFIED` toward local action proof.
- Included slices: API list/read, manual update, management mode, takeover, exchange snapshot, live status, reconciliation, orphan repair, imported history, and Web runtime position action proof.
- Explicit exclusions: production-safe browser clickthrough, live exchange mutation, standalone `/dashboard/positions` route implementation.
- Checkpoint cadence: after focused tests pass and after source-of-truth refresh.
- Stop conditions: failing ownership isolation, unsafe stale-position mutation, exchange snapshot capability leak, takeover ambiguity drift, or validation command failure that cannot be safely resolved.
- Handoff expectation: report evidence, changed files, residual risk, and next V1 checkpoint.

## Context
The V1 ledger marks Positions as `UNVERIFIED`, requiring proof for list, close, update, takeover, import status, live reconciliation, and exchange snapshot boundaries. Existing API tests plus Dashboard Home runtime-position tests appear to cover the local proof path; this task verifies and promotes that evidence if it passes.

## Goal
Run and record focused Positions local proof without live exchange mutation or production actions.

## Scope
- `apps/api/src/modules/positions/*`
- `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
- `apps/web/src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx`
- `apps/web/src/features/bots/utils/runtimeOpenPositionDerivations.test.ts`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx`
- V1 source-of-truth state and generated operation reports.

## Success Signal
- User or operator problem: Position list/update/close/takeover truth should not remain unverified when local action proofs cover the required contracts.
- Expected product or reliability outcome: Positions local evidence covers API and Web success/error/safety states.
- How success will be observed: Focused API and Web tests pass; V1 reports move Positions to `PASS_LOCAL`.
- Post-launch learning needed: yes

## Deliverable For This Stage
Focused validation evidence and source-of-truth updates for Positions local proof.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Run focused API Positions and orders-position integration tests with required process-only env.
2. Run focused Web runtime position derivation/close-action/table tests.
3. If tests pass, promote Positions to `PASS_LOCAL` in V1 ledgers and regenerate reports.
4. Run relevant validation gates and process cleanup checks.

## Acceptance Criteria
- API list/read, live status, exchange snapshot, takeover status, orphan repair, reconciliation, manual update, management mode, and close flows pass locally.
- Web runtime position rows and close action states pass locally.
- V1 source-of-truth files reflect the new evidence.

## Definition of Done
- [x] Focused API Positions tests pass.
- [x] Focused Web Positions tests pass.
- [x] Typecheck/guardrails relevant to touched scope pass.
- [x] V1 reports and source-of-truth files are refreshed.

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
  - `pnpm --filter api exec vitest run src/modules/positions/positions.service.test.ts src/modules/positions/positions.list.e2e.test.ts src/modules/positions/positions-live-status.e2e.test.ts src/modules/positions/positions.exchangeSnapshot.e2e.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/positions/positions.orphan-repair.e2e.test.ts src/modules/positions/positions.authenticatedSnapshots.service.test.ts src/modules/positions/positions.exchangeSnapshotNormalization.test.ts src/modules/positions/livePositionReconciliation.diagnostics.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/importedPositionHistoryHydrator.service.test.ts src/modules/orders/orders-positions.e2e.test.ts --sequence.concurrent=false --pool=forks --poolOptions.forks.singleFork=true --testTimeout=30000` passed (`12` files, `90` tests).
  - `pnpm --filter web exec vitest run src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx src/features/bots/utils/runtimeOpenPositionDerivations.test.ts src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx` passed (`3` files, `10` tests).
  - `pnpm --filter api run typecheck` passed.
  - `pnpm --filter web run typecheck` passed.
  - `node --check scripts/buildProjectIndex.mjs` passed.
  - `pnpm run quality:guardrails` passed.
  - `git diff --check` passed with line-ending warnings only.
- Manual checks: V1 reports regenerated with pinned inputs for 2026-05-11.
- Screenshots/logs: not applicable
- High-risk checks: no live exchange mutation or production data used; LIVE mutation remains blocked-risk without explicit safe plan; no leftover `chrome-headless-shell` or validation Node processes were found after the run.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: SOAR-POSITIONS-001
- Requirements matrix updated: yes
- Requirement rows closed or changed: REQ-FUNC-011
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: QA-011
- Risk register updated: yes
- Risk rows closed or changed: RISK-011
- Reality status: partially verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/modules/api-positions.md`; `docs/modules/web-dashboard-home.md`; `docs/modules/system-modules.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Positions is `UNVERIFIED` in V1 despite existing focused tests covering likely local proof.
- Gaps: production-safe browser clickthrough and live exchange mutation proof remain separate gates.
- Inconsistencies: V1 product action matrix does not yet reflect focused Positions evidence.
- Architecture constraints: Positions API owns list/snapshot/takeover/reconciliation; current operator UI is Dashboard Home/Bot Runtime runtime positions, not a standalone page.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: Positions API module docs, Dashboard Home docs, tests, V1 ledger, product action matrix.
- Rows created or corrected: SOAR-POSITIONS-001, REQ-FUNC-011, QA-011, RISK-011.
- Assumptions recorded: local automated proof can move Positions to `PASS_LOCAL`, not `VERIFIED`.
- Blocking unknowns: production-safe browser data/environment and any explicit safe LIVE mutation plan.
- Why it was safe to continue: tests use local fixtures/mocks and do not perform live exchange mutation.

### 2. Select One Priority Mission Objective
- Selected task: Positions local proof.
- Priority rationale: Positions is the next unblocked P0 module after Manual Orders in the refreshed V1 ledger.
- Why other candidates were deferred: Orders broader lifecycle proof follows Positions; production-safe proof lanes need approved non-local data.

### 3. Plan Implementation
- Files or surfaces to modify: likely source-of-truth docs only unless tests expose a defect.
- Logic: run existing focused tests first; implement only if a real failure appears.
- Edge cases: ownership isolation, stale local positions, unsafe manual TP/SL, management-mode guard, exchange snapshot selection/fail-closed behavior, takeover ambiguity, imported lifecycle history, runtime close ignored/closed states.

### 4. Execute Implementation
- Implementation notes: No production code changes were needed; existing focused Positions tests were run and promoted into V1 source of truth.

### 5. Verify and Test
- Validation performed: focused API/Web Positions tests and V1 report regeneration.
- Result: Positions moved to `PASS_LOCAL`; V1 remains `NO-GO`.

### 6. Self-Review
- Simpler option considered: promote Positions without rerunning tests; rejected because V1 rows require fresh evidence.
- Technical debt introduced: no
- Scalability assessment: proof-only checkpoint keeps code stable and evidence current.
- Refinements made: none needed.

### 7. Update Documentation and Knowledge
- Docs updated: V1 product action matrix, generated V1 reports, planning queue, execution plan, and state ledgers.
- Context updated: project state, task board, current focus, known issues, next steps, delivery map, module confidence, requirement matrix, quality scenarios, risk register, regression log.
- Learning journal updated: not applicable.

## Review Checklist (mandatory)
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
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

## Notes
LIVE exchange mutation remains out of scope without an explicit safe plan.

## Result Report

- Task summary: Promoted fresh local Positions API/Web proof into V1 source of truth without production code changes.
- Files changed: V1 state/planning/report files and this task file.
- How tested: API Positions tests (`90/90`), Web Positions tests (`10/10`), V1 report regeneration.
- What is incomplete: production-safe Positions browser clickthrough remains open; LIVE mutation remains blocked-risk without explicit safe plan.
- Next steps: continue from the refreshed V1 ledger; next unblocked local module is Orders.
- Decisions made: none
