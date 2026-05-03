# Task

## Header
- ID: RUNTIME-AUDIT-14
- Title: Resolve owned imported LIVE positions for runtime EXIT lookup
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-13
- Priority: P0
- Iteration: 32
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime open/fill and dashboard reads now understand selected-bot ownership for
exchange-synced imported positions. The runtime execution orchestrator still
uses a direct open-position lookup before deciding whether `EXIT` can close a
position.

## Goal
Make the default runtime open-position lookup resolve selected-bot owned LIVE
imported positions, including legacy `walletId=null` rows, so EXIT/TP/SL/manual
runtime close flows do not incorrectly return `no_open_position`.

## Scope
- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `apps/api/src/modules/engine/executionOrchestrator.owned-import.e2e.test.ts`
- `docs/modules/api-engine.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: runtime close should see the same owned imported
  LIVE position that dashboard/runtime reads show.
- Expected product or reliability outcome: selected-bot EXIT closes owned
  imported LIVE positions instead of ignoring them as missing.
- How success will be observed: regression test confirms default orchestrator
  lookup finds the owned imported row.
- Post-launch learning needed: no.

## Deliverable For This Stage
Implement the smallest ownership-aware default lookup and regression coverage.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Keep the existing direct lookup and `buildOpenPositionLookupWhere` contract.
2. Add default-gateway fallback only when the direct lookup misses for LIVE
   selected-bot context with wallet/API-key ownership.
3. Reuse `resolveExternalPositionOwnershipIndex` and
   `getExternalPositionOwnership`.
4. Match imported `EXCHANGE_SYNC` / `BOT_MANAGED` open rows by API-key prefix,
   symbol, ownership, and wallet-or-null scope.
5. Add a DB-backed regression for wallet-null owned imported LIVE position
   lookup.

## Acceptance Criteria
- Direct lookup behavior remains unchanged.
- LIVE selected-bot owned imported `walletId=null` row is returned by the
  default runtime lookup.
- Ambiguous, unowned, manual-only, missing API key, PAPER, or other-wallet rows
  are not returned by this fallback.

## Definition of Done
- [x] Relevant tests pass.
- [x] Typecheck, guardrails, lint, and diff check pass.
- [x] Docs and context files record the completed slice and evidence.

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
  - `pnpm --filter api run test -- --run src/modules/engine/executionOrchestrator.owned-import.e2e.test.ts src/modules/engine/executionOrchestrator.service.test.ts --sequence.concurrent=false`
    PASS (`18/18`).
  - `pnpm --filter api run test -- --run src/modules/engine/executionOrchestrator.owned-import.e2e.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/executionAdapterParity.test.ts src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/engine/preTrade.service.test.ts src/modules/engine/preTrade.e2e.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts --sequence.concurrent=false`
    PASS (`111/111`).
- Manual checks:
  - reviewed diff for direct-first lookup and fail-closed ownership fallback.
- Screenshots/logs: not applicable.
- High-risk checks:
  - regression proves selected LIVE bot resolves owned imported wallet-null
    position and rejects an unowned wallet-null import.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/api-engine.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: engine module contract update only.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this lookup/test/doc commit.
- Observability or alerting impact: fewer incorrect `no_open_position` runtime
  ignores for owned imports.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime open-position lookup for LIVE wallet context was exact
  `walletId`, so owned imported `walletId=null` positions could be missed.
- Gaps: dashboard/read/pre-trade/fill paths had ownership proof; runtime EXIT
  lookup did not.
- Inconsistencies: selected-bot owned imported rows could be visible in the
  dashboard but unavailable to close orchestration.
- Architecture constraints: runtime execution must fail closed for unowned
  positions and reuse deterministic ownership proof.

### 2. Select One Priority Task
- Selected task: ownership-aware default runtime position lookup for LIVE EXIT.
- Priority rationale: P0 money-impacting close/automation command path.
- Why other candidates were deferred: other dashboard display audits remain
  queued, but missing close eligibility has higher risk.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: direct lookup first, owned imported LIVE fallback second.
- Edge cases: no API key, other wallet, unowned/ambiguous/manual-only import,
  PAPER mode.

### 4. Execute Implementation
- Implementation notes:
  - added exported `resolveRuntimeOpenPositionBySymbol` for the default
    position gateway.
  - kept `buildOpenPositionLookupWhere` unchanged for direct-scope behavior.
  - added selected-bot LIVE ownership fallback after direct lookup misses.
  - covered owned and unowned imported wallet-null cases with DB-backed tests.

### 5. Verify and Test
- Validation performed:
  - focused orchestrator unit/e2e pack.
  - broader runtime/orders/pre-trade/final-candle pack.
  - repository typecheck, guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: widening `buildOpenPositionLookupWhere` to
  `walletId OR null`; rejected because it can select another wallet's import.
- Technical debt introduced: no.
- Scalability assessment: one ownership-index lookup only after direct LIVE
  selected-bot lookup misses.
- Refinements made:
  - unowned and off-scope imports stay invisible to close orchestration.
  - direct lookup remains authoritative when it finds a row.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/modules/api-engine.md`
  - this planning task
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
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
- Real API/service path used: yes, runtime execution lookup.
- Endpoint and client contract match: yes, unchanged.
- DB schema and migrations verified: yes, no schema change.
- Loading state verified: not applicable.
- Error state verified: existing ignored reasons remain.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: yes.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes.
- Data classification: trading runtime and exchange-account metadata.
- Trust boundaries: selected bot, wallet/API key, imported exchange position.
- Permission or ownership checks: deterministic API-key + symbol ownership.
- Abuse cases: lookup must not close another bot/wallet's imported position.
- Secret handling: API-key ids only; no secret reads or writes.
- Security tests or scans: ownership-scoped regression.
- Fail-closed behavior: unowned/ambiguous imports remain invisible.
- Residual risk: exchange close submission still depends on exchange adapter
  truth for LIVE fills.

## Result Report
- Task summary: runtime execution lookup now resolves selected-bot owned LIVE
  imported wallet-null positions for EXIT/close decisions after direct lookup
  misses.
- Files changed:
  - `apps/api/src/modules/engine/executionOrchestrator.service.ts`
  - `apps/api/src/modules/engine/executionOrchestrator.owned-import.e2e.test.ts`
  - `docs/modules/api-engine.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - this planning task
- How tested:
  - focused orchestrator pack (`18/18`)
  - broader runtime/orders pack (`111/111`)
  - typecheck, guardrails, lint, diff check
- What is incomplete: nothing for this slice.
- Next steps: continue the operator-requested audit with the next smallest
  LIVE/PAPER dashboard/runtime drift.
- Decisions made: ownership fallback rather than widening generic wallet scope.
