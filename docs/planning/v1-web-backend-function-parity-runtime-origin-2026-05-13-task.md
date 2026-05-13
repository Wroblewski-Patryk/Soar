# V1 Web Backend Function Parity - Runtime Origin Labels - 2026-05-13

## Header
- ID: V1-WEB-BACKEND-PARITY-RUNTIME-ORIGIN-2026-05-13
- Title: Dashboard runtime position origin contract parity
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1 runtime backend proof
- Priority: P0
- Module Confidence Rows: Dashboard Home; Bot Runtime
- Requirement Rows: REQ-FUNC-002; REQ-FUNC-003
- Quality Scenario Rows: QA-002; QA-003
- Risk Rows: RISK-002; RISK-003
- Iteration: 2026-05-13-web-parity-2
- Operation Mode: BUILDER
- Mission ID: V1-WEB-BACKEND-FUNCTION-PARITY
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed earlier in the active mission.
- [x] `.agents/core/mission-control.md` was reviewed earlier in the active mission.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: close a concrete Dashboard Home runtime position origin label drift.
- Release objective advanced: V1 Dashboard Home and Bot Runtime show backend runtime provenance truth.
- Included slices: Web runtime position origin type and Dashboard Home origin label helper.
- Explicit exclusions: API behavior changes, redesign, production clickthrough.
- Checkpoint cadence: after focused tests and typecheck.
- Stop conditions: helper test or Web typecheck failure indicating wider origin contract drift.
- Handoff expectation: evidence-backed status plus next parity slice.

## Context
Backend runtime position payloads use Prisma `TradingRecordOrigin` values: `BOT`, `USER`, `EXCHANGE_SYNC`, and `BACKTEST`. The Dashboard Home edit-position modal helper only treated legacy `MANUAL` as manual source truth, so backend `USER` origin could be presented as unknown.

## Goal
Ensure Web runtime position origin typing and Dashboard Home labels reflect backend `USER` origin as a manual/user-app source while preserving legacy fixture compatibility.

## Scope
- `apps/web/src/features/bots/types/bot.type.ts`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.runtime-origin.test.tsx`
- `docs/planning/v1-web-backend-function-parity-runtime-origin-2026-05-13-task.md`

## Implementation Plan
1. Add backend `USER` origin to `BotRuntimePositionItem.origin`.
2. Map `USER` to the same manual label as legacy `MANUAL`.
3. Add a focused helper regression test for `USER`, legacy `MANUAL`, `BOT`, `EXCHANGE_SYNC`, and `BACKTEST`.
4. Run focused Web test and typecheck.
5. Update project state artifacts with evidence.

## Acceptance Criteria
- Backend `USER` origin is accepted by Web runtime position type.
- Dashboard Home origin label returns manual source text for `USER`.
- Legacy `MANUAL` payloads remain compatible.
- Focused test and Web typecheck pass.

## Definition of Done
- [x] Focused regression test passes.
- [x] Web typecheck passes.
- [x] Relevant source-of-truth state is updated.

## Forbidden
- Renaming backend enum values.
- Hiding unknown origins with fake data.
- Broad UI redesign or unrelated cleanup.

## Validation Evidence
- Tests: `HomeLiveWidgets.runtime-origin.test.tsx` passed (`3/3`); Web typecheck passed.
- Manual checks: static comparison against backend Prisma `TradingRecordOrigin` and runtime positions read mapper.
- Module confidence ledger updated: yes.
- Requirements matrix updated: yes.
- Quality scenarios updated: yes.
- Risk register updated: yes.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: runtime monitoring remains within approved Dashboard/Bot Runtime surfaces.
- Fits approved architecture: yes.
- Mismatch discovered: no architecture mismatch; Web type drift discovered.
- Decision required from user: no.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: Web runtime position origin type omitted backend `USER`.
- Gap: Dashboard Home edit-position modal helper mapped `MANUAL`, not backend `USER`, to Manual.
- Architecture constraints: reuse existing source-label copy.

### 2. Select One Priority Mission Objective
- Selected task: runtime position origin label contract parity.
- Priority rationale: release-critical runtime UI must not show backend-truth manual/user positions as unknown.
- Why other candidates were deferred: remaining route parity items require separate bounded proofs.

### 3. Plan Implementation
- Files or surfaces to modify: Web type, Dashboard helper, focused test, task artifact.
- Logic: `USER` and legacy `MANUAL` both map to manual label.
- Edge cases: imported and bot origins keep existing labels.

### 4. Execute Implementation
- Implementation notes: added `USER` to Web runtime position origin type and mapped `USER` plus legacy `MANUAL` to the Manual label.

### 5. Verify and Test
- Validation performed: `pnpm --filter web run test -- src/features/dashboard-home/components/HomeLiveWidgets.runtime-origin.test.tsx --run`; `pnpm --filter web run typecheck`.
- Result: passed.

### 6. Self-Review
- Simpler option considered: only type update; rejected because the user-visible label also drifted.
- Technical debt introduced: no.
- Scalability assessment: localized helper keeps old fixtures compatible while matching backend enum.
- Refinements made: kept legacy `MANUAL` compatibility while adding backend `USER` truth.

### 7. Update Documentation and Knowledge
- Docs updated: this task artifact.
- Context updated: `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`, `.agents/state/module-confidence-ledger.md`, `.agents/state/requirements-verification-matrix.md`, `.agents/state/quality-attribute-scenarios.md`, `.agents/state/risk-register.md`.
- Learning journal updated: not applicable.

## Result Report
- Task summary: aligned Dashboard Home runtime position origin labels with backend `USER` origin.
- Files changed: Web runtime type, Dashboard Home helper/test, task and state docs.
- How tested: focused Web test (`3/3`) and Web typecheck.
- What is incomplete: broader V1 Web/backend parity remains incomplete across remaining routes and production-safe clickthrough.
- Next steps: continue V1 Web/backend parity audit.
