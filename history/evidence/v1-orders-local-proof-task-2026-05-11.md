# Task

## Header
- ID: V1-ORDERS-LOCAL-PROOF-2026-05-11
- Title: Orders local proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: V1 Positions local proof
- Priority: P0
- Module Confidence Rows: SOAR-ORDERS-001
- Requirement Rows: REQ-FUNC-012
- Quality Scenario Rows: QA-012
- Risk Rows: RISK-012
- Iteration: 12
- Operation Mode: ARCHITECT
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
- Mission objective: Prove Orders local contracts for V1.
- Release objective advanced: Move Orders from `UNVERIFIED` toward local action proof.
- Included slices: API order list/read/open/cancel/close, exchange events, fills, fees, live cancel boundary, quantity/scope helpers, and Web open-orders table actions/source labels.
- Explicit exclusions: production-safe browser clickthrough and live exchange mutation.
- Checkpoint cadence: after focused tests pass and after source-of-truth refresh.
- Stop conditions: failing ownership isolation, unsafe exchange-backed cancel, fee/fill drift, stale open-order lifecycle mutation, or validation command failure that cannot be safely resolved.
- Handoff expectation: report evidence, changed files, residual risk, and next V1 checkpoint.

## Context
The V1 ledger marks Orders as `UNVERIFIED`, requiring proof for list, cancel, exchange-backed cancel, order fills, and fees through API and adapter boundaries. Existing focused order tests cover the local proof path; this task verifies and promotes that evidence if it passes.

## Goal
Run and record focused Orders local proof without live exchange mutation or production actions.

## Scope
- `apps/api/src/modules/orders/*`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.open-orders*.test.tsx`
- V1 source-of-truth state and generated operation reports.

## Success Signal
- User or operator problem: Order lifecycle and cancel/fill/fee behavior should not remain unverified when local proof exists.
- Expected product or reliability outcome: Orders local evidence covers API and Web success/error/safety states.
- How success will be observed: Focused API and Web tests pass; V1 reports move Orders to `PASS_LOCAL`.
- Post-launch learning needed: yes

## Deliverable For This Stage
Focused validation evidence and source-of-truth updates for Orders local proof.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Run focused API Orders tests with required process-only env.
2. Run focused Web open-orders source/action tests.
3. If tests pass, promote Orders to `PASS_LOCAL` in V1 ledgers and regenerate reports.
4. Run relevant validation gates and process cleanup checks.

## Acceptance Criteria
- API list/read/open/cancel/close, active-only filtering, exchange events, fills, fees, live cancel boundary, quantity rules, position scope, and live fill resolution pass locally.
- Web open-orders source labels and cancel action states pass locally.
- V1 source-of-truth files reflect the new evidence.

## Definition of Done
- [x] Focused API Orders tests pass.
- [x] Focused Web Orders tests pass.
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
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts src/modules/orders/orders.quantityRules.test.ts src/modules/orders/orders.positionScope.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/orders/orders.liveCancelBoundary.service.test.ts src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.exchangeEvents.feeBackfill.test.ts --sequence.concurrent=false --pool=forks --poolOptions.forks.singleFork=true --testTimeout=30000` passed (`10` files, `121` tests).
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx` passed (`2` files, `3` tests).
  - `pnpm --filter api run typecheck` passed.
  - `pnpm --filter web run typecheck` passed.
  - `node --check scripts/buildProjectIndex.mjs` passed.
  - `pnpm run quality:guardrails` passed.
  - `git diff --check` passed with line-ending warnings only.
- Manual checks: V1 reports regenerated with pinned inputs for 2026-05-11.
- Screenshots/logs: not applicable
- High-risk checks: no live exchange mutation or production data used; live mutation remains blocked-risk without explicit safe plan; no leftover `chrome-headless-shell` or validation Node processes were found after the run.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: SOAR-ORDERS-001
- Requirements matrix updated: yes
- Requirement rows closed or changed: REQ-FUNC-012
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: QA-012
- Risk register updated: yes
- Risk rows closed or changed: RISK-012
- Reality status: partially verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/modules/api-orders.md`; `docs/modules/web-dashboard-home.md`; `docs/modules/system-modules.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Orders is `UNVERIFIED` in V1 despite existing focused tests covering likely local proof.
- Gaps: production-safe browser clickthrough and live exchange mutation proof remain separate gates.
- Inconsistencies: V1 product action matrix does not yet reflect focused Orders evidence.
- Architecture constraints: Orders API owns lifecycle commands; current visible open-orders UI is Dashboard Home/Bot Runtime.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: Orders API module docs, Dashboard Home docs, tests, V1 ledger, product action matrix.
- Rows created or corrected: SOAR-ORDERS-001, REQ-FUNC-012, QA-012, RISK-012.
- Assumptions recorded: local automated proof can move Orders to `PASS_LOCAL`, not `VERIFIED`.
- Blocking unknowns: production-safe browser data/environment and any explicit safe LIVE mutation plan.
- Why it was safe to continue: tests use local fixtures/mocks and do not perform live exchange mutation.

### 2. Select One Priority Mission Objective
- Selected task: Orders local proof.
- Priority rationale: Orders is the next unblocked P0 module after Positions in the refreshed V1 ledger.
- Why other candidates were deferred: Backtests follows Orders; production-safe proof lanes need approved non-local data.

### 3. Plan Implementation
- Files or surfaces to modify: likely source-of-truth docs only unless tests expose a defect.
- Logic: run existing focused tests first; implement only if a real failure appears.
- Edge cases: exchange-backed cancel boundary, stale active rows, partial/underfilled exchange events, fee pending/backfill, close PnL attribution, active-only open orders, source labels, terminal rows without cancel actions.

### 4. Execute Implementation
- Implementation notes: No production code changes were needed; existing focused Orders tests were run and promoted into V1 source of truth.

### 5. Verify and Test
- Validation performed: focused API/Web Orders tests and V1 report regeneration.
- Result: Orders moved to `PASS_LOCAL`; V1 remains `NO-GO`.

### 6. Self-Review
- Simpler option considered: promote Orders without rerunning tests; rejected because V1 rows require fresh evidence.
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
Production-safe and live exchange mutation evidence remain separate from this local proof.

## Result Report

- Task summary: Promoted fresh local Orders API/Web proof into V1 source of truth without production code changes.
- Files changed: V1 state/planning/report files and this task file.
- How tested: API Orders tests (`121/121`), Web Orders tests (`3/3`), V1 report regeneration.
- What is incomplete: production-safe Orders browser clickthrough remains open; live mutation remains blocked-risk without explicit safe plan.
- Next steps: continue from the refreshed V1 ledger; next unblocked local module is Backtests.
- Decisions made: none
