# RUNTIME-AUDIT-08 External Position Ownership Catalog Scope

## Header
- ID: RUNTIME-AUDIT-08
- Title: Resolve imported LIVE position ownership with catalog-aware market scope
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-07
- Priority: P1
- Iteration: 26
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
LIVE reconciliation imports exchange positions by resolving deterministic ownership from API key plus bot market scope. Dashboard/runtime reads already use the catalog-aware configured symbol resolver, but the external-position ownership index still used the simpler direct symbol/universe resolver. Market-universe-backed groups with empty direct `symbols` and whitelist/filter catalog scope could therefore fail to claim positions that the bot is configured to manage.

## Goal
Make external position ownership proof use the same catalog-aware market scope resolver as dashboard/runtime reads so all exchange positions inside the bot's assigned market group are imported and classified consistently.

## Scope
- `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts`
- `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/modules/api-bots.md`

## Implementation Plan
1. Replace the simple ownership symbol resolver with `resolveEffectiveSymbolGroupSymbolsWithCatalog`.
2. Keep a per-index catalog symbols cache so multiple active groups do not repeatedly resolve the same universe.
3. Add a regression for a canonical active market group with empty direct `symbols` and market-universe whitelist symbols.
4. Run focused ownership and broader reconcile/takeover validations.

## Acceptance Criteria
- A LIVE bot with an active canonical market-universe group can own exchange positions from symbols resolved through the catalog-aware scope.
- Direct legacy `Bot.symbolGroup` remains ignored when active canonical groups exist.
- Ambiguous/manual/unowned ownership semantics stay unchanged.
- Reconciliation and takeover dashboard tests continue to pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for the touched LIVE import ownership slice.
- [x] Existing catalog-aware symbol resolver reused.
- [x] Regression test covers catalog/universe ownership.
- [x] Docs and context updated.
- [x] Validation evidence recorded.

## Forbidden
- Importing ownership from stale direct bot symbols when active canonical groups exist.
- Adding a parallel market-universe resolver.
- Treating unresolved catalog scope as owned.
- Running DB-backed e2e evidence in parallel.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/bots/runtimeExternalPositionOwner.service.test.ts --sequence.concurrent=false` PASS (`9/9`).
  - `pnpm --filter api run test -- --run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts --sequence.concurrent=false` PASS (`41/41`).
  - `pnpm --filter api run typecheck` PASS.
- Manual checks: reviewed ownership index call sites in LIVE reconciliation, imported runtime automation hydration, dashboard close, runtime rows, and takeover status.
- Screenshots/logs: not applicable.
- High-risk checks: LIVE import ownership, reconciliation, and takeover visibility covered.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/modules/api-bots.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: not required; module contract updated.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: not required for this small backend resolver alignment.
- Rollback note: revert this commit to restore previous direct/universe-only ownership resolution.
- Observability or alerting impact: fewer false `UNOWNED`/`DRIFT` imported position classifications for catalog-backed bot market groups.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: external position ownership index used a non-catalog resolver while dashboard/runtime reads used catalog-aware scope.
- Gaps: no test covered canonical market-universe ownership with empty direct `symbols`.
- Inconsistencies: exchange reconciliation could import one position but miss another inside the assigned market group when the missing symbol came only from catalog/whitelist/filter scope.
- Architecture constraints: active canonical `BotMarketGroup` scope is authoritative; direct legacy bot scope is fallback only when canonical topology is absent.

### 2. Select One Priority Task
- Selected task: align external-position ownership scope with catalog-aware configured market scope.
- Priority rationale: this directly affects LIVE imported position visibility and bot ownership proof.
- Why other candidates were deferred: paper open signal diagnostics and wallet flicker remain separate read/runtime checks; this was a confirmed import ownership drift.

### 3. Plan Implementation
- Files or surfaces to modify: ownership service/test and planning/context/module docs.
- Logic: resolve each canonical or fallback symbol group through the shared catalog-aware resolver and build the same API-key+symbol ownership keys.
- Edge cases: active canonical group overrides direct legacy scope; ambiguous overlapping ownership still wins; manual-only remains manual-only.

### 4. Execute Implementation
- Implementation notes: switched ownership index to `resolveEffectiveSymbolGroupSymbolsWithCatalog` with a shared cache and added catalog-backed ownership regression.

### 5. Verify and Test
- Validation performed: focused ownership test, broader reconciliation/takeover e2e and service tests, API typecheck.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: expanding `resolveEffectiveSymbolGroupSymbols`, rejected because catalog resolution already exists and is the approved dashboard/runtime contract.
- Technical debt introduced: no.
- Scalability assessment: per-index cache keeps catalog lookup reuse local to one ownership resolution pass.
- Refinements made: local `SymbolGroupScope` type now uses `Exchange` and `TradeMarket` instead of `unknown` so resolver inputs remain type-safe.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc and `docs/modules/api-bots.md`.
- Context updated: `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`, `docs/planning/mvp-next-commits.md`.
- Learning journal updated: not applicable.

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

## Production-Grade Required Contract
- Goal: make LIVE imported-position ownership catalog-scope correct.
- Scope: listed above.
- Implementation Plan: listed above.
- Acceptance Criteria: listed above.
- Definition of Done: satisfied with validation evidence.
- Result Report: external-position ownership now uses catalog-aware configured market scope, so reconciliation can classify assigned exchange positions consistently with dashboard/runtime.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes.
- Real API/service path used: yes, LIVE reconciliation ownership index and takeover dashboard paths.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: no schema change.
- Loading state verified: not applicable.
- Error state verified: unresolved ownership semantics remain fail-closed.
- Refresh/restart behavior verified: reconciliation pass tests cover repeatable classification.
- Regression check performed: focused and broader backend ownership/reconciliation tests.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for auth changes; ownership and money-impacting fail-closed behavior reviewed.
- Data classification: trading runtime and exchange position metadata.
- Trust boundaries: exchange positions, API key ownership, and selected bot market assignments.
- Permission or ownership checks: ownership remains API-key + configured symbol scope based.
- Abuse cases: stale direct bot scope cannot claim a position when active canonical market groups exist.
- Secret handling: no secrets touched.
- Security tests or scans: typecheck and runtime regression tests.
- Fail-closed behavior: unresolved/ambiguous ownership remains non-owned.
- Residual risk: catalog data freshness depends on existing market catalog resolver behavior.
