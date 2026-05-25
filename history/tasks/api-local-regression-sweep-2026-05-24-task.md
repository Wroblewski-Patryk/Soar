# Task

## Header
- ID: API-LOCAL-REGRESSION-SWEEP-2026-05-24
- Title: Stabilize API regression sweep after local readiness verification
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: `SOAR-FULL-READINESS-COORDINATION-2026-05-23`
- Priority: P0
- Module Confidence Rows: Bot Runtime, Orders, Reports, Wallets, Runtime Flow, AI Assistant Foundation
- Requirement Rows: not changed
- Quality Scenario Rows: reliability, maintainability, release confidence
- Risk Rows: shared DB test isolation, LIVE entitlement guard coverage
- Iteration: 2026-05-24 backend checkpoint
- Operation Mode: TESTER
- Mission ID: `SOAR-FULL-READINESS-COORDINATION-2026-05-23`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the verification-heavy checkpoint.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through mission startup context.
- [x] `.agents/core/mission-control.md` was reviewed through active mission context.
- [x] Missing or template-like state tables were not blocking.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: close the current API local regression failures exposed during full readiness coordination.
- Release objective advanced: improve local backend confidence before protected production proof can continue.
- Included slices: dynamic-stop display truth, lifecycle close parity, reports aggregation, orders LIVE entitlement-aware tests, runtime-flow wait proof, wallet/manual-order cleanup robustness, AI protocol artifact path.
- Explicit exclusions: protected production readbacks, LIVE exchange mutation, deploy mutation, native mobile proof.
- Checkpoint cadence: focused failing files first, then full API run, then repository gates.
- Stop conditions: no LIVE exchange mutation, no secret capture, no weakening fail-closed subscription or exchange guards.
- Handoff expectation: state files record local verification and residual production blockers.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS.md, active mission, task board | Mission integration and source-of-truth updates | Task artifact and state updates | Full validation gate | DONE |
| Backend Runtime | Active chat | Runtime tests and bot runtime services | Bot runtime serialization/read services | Correct imported dynamic-stop display behavior | Focused and full API tests | DONE |
| Orders/Reports/Wallets | Active chat | API contracts and e2e tests | Orders, reports, wallets tests/services | Stable contract tests without weakening guards | Focused and full API tests | DONE |
| QA/Test | Active chat | Quality gates | API/Web workspace validation | Full API and repository gates | Commands listed below | DONE |

## Context
The local readiness sweep exposed API failures that were not production proof blockers by themselves but reduced confidence in backend release readiness. Several failures were real contract drift; others were stale test assumptions or shared-database cleanup gaps.

## Goal
Make the API regression suite pass locally without bypassing LIVE safety, protected production blockers, or architecture graph guardrails.

## Success Signal
- User or operator problem: continue until Soar is correctly implemented and verified.
- Expected product or reliability outcome: backend runtime, orders, reports, wallets, and AI protocol checks pass locally.
- How success will be observed: focused failing packs and full API run pass after a clean DB reset.
- Post-launch learning needed: yes.

## Deliverable For This Stage
Verified backend fixes plus durable evidence in this task and state files.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Dynamic-stop display preserves imported LIVE TTP truth only with strategy context plus runtime-state basis or canonical runtime state.
- [x] Reports keep total trade count while aggregating PnL only from settled `realizedPnl` values.
- [x] Orders e2e tests exercise LIVE contracts with explicit test entitlement setup instead of weakening the production guard.
- [x] Full API tests pass in clean DB one-worker mode.
- [x] Typecheck, lint, build, guardrails, strict graph drift, and diff check pass.

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
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionsRead.service.test.ts src/modules/bots/runtimePositionSerialization.service.test.ts src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts src/modules/engine/lifecycleCloseParity.golden.test.ts src/modules/reports/reports.service.test.ts src/modules/reports/reports.e2e.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.manualContext.contractSize.service.test.ts src/modules/engine/runtime-flow.e2e.test.ts src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.live-paper-concurrent.e2e.test.ts src/modules/bots/bots.portfolio-history.e2e.test.ts src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts src/modules/engine/assistantOrchestrator.protocol.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true --testTimeout=30000 --reporter=dot` passed `14` files / `107` tests.
  - `corepack pnpm --filter api exec vitest run --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true --testTimeout=30000 --reporter=dot` passed after clean DB reset.
- Manual checks: local DB reset with `corepack pnpm --filter api exec prisma migrate reset --force --skip-seed` before DB-backed proof.
- Screenshots/logs: not applicable.
- High-risk checks: no LIVE exchange mutation, no secret-bearing protected proof, LIVE entitlement guard retained.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: Bot Runtime, Orders, Reports, Wallets, Runtime Flow, AI Assistant Foundation
- Requirements matrix updated: not applicable
- Requirement rows closed or changed: none
- Quality scenarios updated: not applicable
- Quality scenario rows closed or changed: none
- Risk register updated: not applicable
- Risk rows closed or changed: none
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/` graph guardrail and active mission context.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: strict graph drift passed; no graph row changes required.

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert touched API service/test files if needed; no data migration.
- Observability or alerting impact: none
- Staged rollout or feature flag: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: API regression pack had dynamic-stop null display, stale AI protocol path, lifecycle close mapping gap, reports aggregation drift, LIVE order test entitlement setup gap, runtime-flow polling race, and DB cleanup gaps.
- Gaps: protected production proof remains unavailable.
- Inconsistencies: shared DB tests can fail when run in broad packs if file cleanup misses unrelated tables.
- Architecture constraints: keep fail-closed LIVE safety and graph guardrails.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Sources scanned: active mission, task board, relevant API services/tests.
- Rows created or corrected: task/state rows only.
- Assumptions recorded: clean local DB reset is acceptable for local test proof.
- Blocking unknowns: protected production credentials are still unavailable.
- Why it was safe to continue: all work was local code/test proof with no production mutation.

### 2. Select One Priority Mission Objective
- Selected task: API local regression sweep.
- Priority rationale: release confidence needed backend proof after web/build sweep.
- Why other candidates were deferred: protected production proof is blocked by missing inputs.

### 3. Plan Implementation
- Files or surfaces to modify: API runtime, reports, orders/wallets tests, runtime-flow test, AI protocol test, lifecycle parity test.
- Logic: preserve production guards while correcting local proof and operator-visible runtime truth.
- Edge cases: imported `EXCHANGE_SYNC` stale runtime state, unsettled reports trades, LIVE plan entitlements in orders contract tests, shared DB cleanup.

### 4. Execute Implementation
- Implementation notes: dynamic-stop fallback now requires strategy context plus either canonical runtime state or rejected runtime-state basis with canonical price basis; reports count all trades but PnL only settled values; tests seed LIVE entitlement where the file is not testing entitlement denial.

### 5. Verify and Test
- Validation performed: focused regression packs, full API run, typecheck, lint, build, guardrails, strict graph drift, diff check.
- Result: passed.

### 6. Self-Review
- Simpler option considered: broad fallback on price alone.
- Technical debt introduced: no
- Scalability assessment: current monolith line budget remains under guardrail at `999` lines.
- Refinements made: fallback narrowed after full API suite exposed an over-broad path.

### 7. Update Documentation and Knowledge
- Docs updated: this task artifact and context/state files.
- Context updated: yes
- Learning journal updated: yes.

## Review Checklist
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
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
