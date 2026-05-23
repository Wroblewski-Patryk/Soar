# RUNTIME-AUDIT-07 Position Automation Canonical Symbol Scope

## Header
- ID: RUNTIME-AUDIT-07
- Title: Fail closed runtime position automation for off-scope bot positions
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-06
- Priority: P1
- Iteration: 25
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Selected-bot dashboard reads and dashboard close commands are now canonical-symbol scoped, but runtime position automation still processed `BOT_MANAGED` positions returned by ticker symbol alone. A stale directly owned position outside the bot's current active market assignment could still reach DCA, TTP, TSL, or close evaluation.

## Goal
Make runtime position automation fail closed before strategy loading or money-impacting automation when an owned position symbol is outside the bot's active configured symbol scope.

## Scope
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomationDefaultPositionDeps.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.types.ts`
- `apps/api/src/modules/engine/runtimePositionAutomationSkipTelemetry.ts`
- `apps/api/src/modules/engine/runtimeImportedPositionOwnership.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/modules/api-engine.md`

## Implementation Plan
1. Extract default position loading into a small dependency module and load symbol-group symbols plus catalog filter metadata there and in imported-position ownership hydration.
2. Reuse the existing catalog-aware symbol resolver and normalization contract.
3. Guard owned positions after canonical execution context and live opt-in checks, before strategy config, DCA, and protection close evaluation.
4. Emit LIVE operator-visible skip telemetry with a dedicated `position_symbol_outside_configured_scope` reason.
5. Add a regression proving off-scope owned positions do not load strategy config, execute DCA, or close.

## Acceptance Criteria
- Off-scope owned positions are skipped before strategy config lookup.
- DCA, TTP/TP/SL/TSL close orchestration, and capital checks are not called for off-scope positions.
- LIVE telemetry records the skip reason for operator diagnosis.
- Existing imported-position ownership hydration and in-scope automation tests continue to pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for the touched money-impacting backend slice.
- [x] Existing canonical symbol resolver reused.
- [x] Fail-closed behavior covered by tests.
- [x] Docs and context updated.
- [x] Validation evidence recorded.

## Forbidden
- Managing stale directly owned positions outside active configured bot markets.
- Guessing scope from `Position.botId` alone.
- Adding a parallel symbol resolver.
- Running DB-backed e2e evidence in parallel.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts --sequence.concurrent=false` PASS (`35/35`).
  - `pnpm --filter api run test -- --run src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts src/modules/bots/runtimeExternalPositionOwner.service.test.ts --sequence.concurrent=false` PASS (`52/52`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS after extracting default position loading out of the production monolith.
- Manual checks: reviewed automation ordering so scope validation runs before strategy config, lifecycle price, DCA funds, DCA execution, and close orchestration.
- Screenshots/logs: not applicable.
- High-risk checks: money-impacting DCA/protection automation fail-closed regression included.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/modules/api-engine.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: not required; module contract updated.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: not required for this small backend guard.
- Rollback note: revert this commit to restore previous automation behavior.
- Observability or alerting impact: adds LIVE `PRETRADE_BLOCKED` telemetry reason for off-scope automation skips.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime automation processed open managed positions by ticker symbol without selected-bot configured symbol scope validation.
- Gaps: default dependency hydration did not load enough symbol-group metadata to reuse the catalog-aware resolver.
- Inconsistencies: dashboard reads and close command were fail-closed, while DCA/TTP/TSL automation could still act on stale off-scope ownership.
- Architecture constraints: canonical `BotMarketGroup` scope is authoritative; legacy direct bot scope is fallback only when canonical topology is unavailable.

### 2. Select One Priority Task
- Selected task: fail closed runtime position automation outside active configured bot symbol scope.
- Priority rationale: money-impacting automation must not manage positions outside the bot's assigned markets.
- Why other candidates were deferred: wallet flicker and broader dashboard observations need separate read-path evidence; this slice was a direct automation safety gap.

### 3. Plan Implementation
- Files or surfaces to modify: runtime automation service/types, skip telemetry, imported ownership hydration, focused tests, planning/context docs.
- Logic: resolve configured symbols through the existing catalog-aware resolver and skip off-scope owned positions before strategy or order side effects.
- Edge cases: imported LIVE positions hydrated with ownership, LIVE opt-out, unresolved execution context, and existing in-scope DCA/protection flows.

### 4. Execute Implementation
- Implementation notes: extracted default position loading to keep the runtime automation service under the production monolith budget, added symbol-group metadata to default selects, added a scoped helper in automation service, and recorded a dedicated LIVE skip reason.

### 5. Verify and Test
- Validation performed: focused automation/default-deps tests, broader close/ownership/automation pack, API typecheck.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: filtering in `listOpenPositionsBySymbol` only, rejected because imported ownership hydration and in-memory test deps still need fail-closed defense at the automation boundary.
- Technical debt introduced: no; the required line-budget cleanup reduced the main automation service from 1045 to 962 lines.
- Scalability assessment: current resolver reuse keeps catalog/filter behavior aligned with dashboard scope; future multi-group scope broadening should update this shared scope selection consistently across dashboard and automation.
- Refinements made: test fixtures were adjusted to include explicit in-scope symbols so unrelated SOL tests do not rely on missing-scope behavior.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc and `docs/modules/api-engine.md`.
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
- Goal: prevent runtime automation from managing stale off-scope bot positions.
- Scope: listed above.
- Implementation Plan: listed above.
- Acceptance Criteria: listed above.
- Definition of Done: satisfied with validation evidence.
- Result Report: runtime automation now fail-closes off-scope owned positions before strategy/DCA/protection side effects and emits LIVE skip telemetry.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes.
- Real API/service path used: yes, runtime ticker -> position automation service.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: no schema change.
- Loading state verified: not applicable.
- Error state verified: telemetry skip path verified.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: focused and broader backend runtime packs.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for auth changes; ownership and money-impacting fail-closed behavior reviewed.
- Data classification: trading runtime metadata.
- Trust boundaries: exchange-synced/imported positions and selected bot configuration.
- Permission or ownership checks: preserves existing bot ownership checks and adds configured symbol-scope guard.
- Abuse cases: direct stale `Position.botId` rows cannot trigger automation after market reassignment.
- Secret handling: no secrets touched.
- Security tests or scans: typecheck and runtime regression tests.
- Fail-closed behavior: off-scope positions skip before side effects.
- Residual risk: multi-active-market-group symbol union remains aligned with current dashboard first-group scope; broaden only as a separate canonical scope update.
