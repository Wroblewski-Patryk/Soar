# RUNTIME-AUDIT-15 Close Fee Position Scope Task - 2026-05-03

## Header
- ID: RUNTIME-AUDIT-15
- Title: Scope runtime close entry-fee aggregation by position lifecycle
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-14
- Priority: P1
- Iteration: 33
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Operator-reported LIVE/PAPER runtime audit continues after owned-import lookup,
fill reuse, and manual reverse-open guards. The execution close path can now
resolve owned imported LIVE positions, but close PnL still aggregated entry
fees with `botId` and `walletId` filters. Imported lifecycle rows may legally
carry different identity projections while sharing the same persisted
`Position.id`.

## Goal
Make runtime close realized-PnL fee attribution use the owned position lifecycle
as the source of truth, so imported or later-hydrated positions do not drop
entry fees because of `botId` / `walletId` projection drift.

## Scope
- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `apps/api/src/modules/engine/executionOrchestrator.service.test.ts`
- `docs/modules/api-engine.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Remove `botId` and `walletId` from the close-path entry-fee aggregate query.
2. Keep `userId`, `positionId`, and entry side as the lifecycle boundary.
3. Add regression coverage for closing an imported LIVE position with
   `botId=null` / `walletId=null` while the runtime close command uses a selected
   bot wallet.
4. Update canonical docs/context with evidence.
5. Run focused and broader runtime validation.

## Acceptance Criteria
- Close PnL subtracts entry fees attached to the same position even when bot or
  wallet projections differ across lifecycle rows.
- Selected-bot LIVE close orders still use the runtime wallet when the imported
  position has no wallet.
- Regression coverage fails on the old query shape and passes on the new one.
- No schema, route, or exchange-side behavior changes are introduced.

## Definition of Done
- [x] Code change is implemented with existing execution-orchestrator patterns.
- [x] Focused runtime close tests pass.
- [x] Broader relevant runtime/order checks pass.
- [x] Typecheck, lint, guardrails, and diff review pass.
- [x] Source-of-truth docs are synchronized.

## Forbidden
- New lifecycle systems or duplicate PnL calculators.
- Broad user/symbol fee aggregation without `positionId`.
- Temporary bypasses or mock-only behavior.
- Exchange connector behavior changes.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/engine/executionOrchestrator.service.test.ts --sequence.concurrent=false` => PASS (`17/17`).
  - `pnpm --filter api run test -- --run src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/executionOrchestrator.owned-import.e2e.test.ts src/modules/orders/orders.service.test.ts src/modules/orders/orders.e2e.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts --sequence.concurrent=false` => PASS (`90/90`; five resolved test files).
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm run lint` => PASS.
- Manual checks: git diff self-review completed.
- Screenshots/logs: not applicable.
- High-risk checks: fee aggregation remains scoped by `userId` and exact
  `positionId`; close lookup, dedupe, reduce-only, and exchange-routing
  behavior unchanged.

## Architecture Evidence
- Architecture source reviewed: `docs/modules/api-engine.md`,
  `docs/architecture/06_execution-lifecycle.md`,
  `docs/architecture/07_modes-parity-and-data.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: `docs/modules/api-engine.md`.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore prior close fee query scope.
- Observability or alerting impact: runtime symbol stat PnL values become more
  complete for imported position closes.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime close PnL aggregates entry fees through `botId` and
  `walletId`, which can drift for imported LIVE positions.
- Gaps: no regression covered an imported `walletId=null` position closed by a
  selected LIVE bot wallet.
- Inconsistencies: open-position ownership proof treats imported position
  lifecycle as owned, while fee aggregation still required exact projected
  identity fields.
- Architecture constraints: reuse execution orchestrator and trade gateway
  lifecycle; keep money-impacting aggregation scoped by user and position.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-15`.
- Priority rationale: close PnL and dashboard/runtime stats are money-facing and
  downstream of the owned-import work already completed.
- Why other candidates were deferred: broader runtime position read-history
  scope needs additional ownership-proof design to avoid over-including
  ambiguous null/null trades.

### 3. Plan Implementation
- Files or surfaces to modify: execution orchestrator, focused unit tests,
  engine docs, canonical context/queue.
- Logic: aggregate entry fees by `userId + positionId + entry side`; preserve
  selected runtime wallet for the close order/trade when imported position
  wallet is null.
- Edge cases: imported `botId=null/walletId=null`, hydrated wallet trades,
  PAPER positions with direct bot/wallet, LONG/SHORT entry sides.

### 4. Execute Implementation
- Implementation notes: removed `botId` / `walletId` from the entry-fee
  aggregate query and added an imported LIVE close regression that preserves
  selected wallet routing while calculating PnL from position-scoped entry
  fees.

### 5. Verify and Test
- Validation performed: focused execution orchestrator test, broader
  runtime/order/automation command pack, API typecheck, guardrails, lint, and
  diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: adding `OR` identity filters. Rejected because it
  preserves projection coupling and can still miss lifecycle rows.
- Technical debt introduced: no.
- Scalability assessment: position-scoped aggregation is narrower and more
  stable than identity-projection aggregation.
- Refinements made: mocked runtime telemetry in the focused imported-position
  unit case so the test stays unit-scoped and does not require real session
  database fixtures.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-engine.md`,
  `docs/planning/runtime-audit-15-close-fee-position-scope-task-2026-05-03.md`,
  `docs/planning/mvp-next-commits.md`.
- Context updated: `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
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

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes.
- Real API/service path used: yes, execution orchestrator close path.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: no schema change.
- Loading state verified: not applicable.
- Error state verified: close submitted/ignored paths unchanged.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: focused imported LIVE close fee attribution test
  plus broader runtime/order pack.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes.
- Data classification: user trading lifecycle data.
- Trust boundaries: selected runtime bot, wallet, and persisted owned position.
- Permission or ownership checks: unchanged; fee aggregation remains scoped by
  `userId` and exact `positionId`.
- Abuse cases: another user's trades cannot be included because `userId` is
  required; unrelated same-symbol rows cannot be included because `positionId`
  is required.
- Secret handling: none.
- Security tests or scans: relevant unit/e2e pack, typecheck, lint, and
  repository guardrails passed.
- Fail-closed behavior: close lookup and dedupe behavior unchanged.
- Residual risk: existing persisted trades without `positionId` remain excluded
  by design until a separate ownership-proof contract is approved.

## Result Report
- Task summary: runtime close entry-fee attribution now uses the position
  lifecycle boundary instead of mutable bot/wallet identity projections.
- Files changed:
  - `apps/api/src/modules/engine/executionOrchestrator.service.ts`
  - `apps/api/src/modules/engine/executionOrchestrator.service.test.ts`
  - `docs/modules/api-engine.md`
  - `docs/planning/runtime-audit-15-close-fee-position-scope-task-2026-05-03.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused and broader runtime/order tests, API typecheck,
  guardrails, lint, and diff review.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue auditing selected-bot dashboard read parity for imported
  lifecycle trade history without widening ownership scope unsafely.
- Decisions made: position lifecycle identity is the close fee source of truth.
