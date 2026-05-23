# Task

## Header
- ID: RUNTIME-AUDIT-64
- Title: Scope external ownership by market type
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-63
- Priority: P1
- Iteration: 82
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-63` made LIVE reconciliation fetch snapshots with wallet/bot
market type, but the external-position ownership index still keys ownership by
`apiKey + symbol`. A user can have SPOT and FUTURES bot scopes for the same
symbol on the same API key, and those scopes must not become ambiguous.

## Goal
Scope external position ownership by `apiKey + marketType + symbol` while
preserving the existing FUTURES fallback for legacy callers.

## Scope
- `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts`
- `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.test.ts`
- runtime call sites that already know market type
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- this task evidence file

## Success Signal
- User or operator problem: same-symbol SPOT/FUTURES LIVE scopes can collide and hide/manualize imported positions.
- Expected product or reliability outcome: ownership remains exact for assigned market context.
- How success will be observed: focused ownership tests prove same API key and symbol can be independently owned across SPOT/FUTURES.
- Post-launch learning needed: no

## Deliverable For This Stage
One tested ownership-index correction committed as a tiny reversible slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add `marketType` to external ownership key construction and lookups with a
   default `FUTURES` fallback.
2. Resolve candidate market type from active market-group scope or wallet/bot
   context.
3. Pass known market type from runtime read/reconciliation/pre-trade call sites.
4. Add focused regression for same API key + same symbol + different market
   type ownership.
5. Run focused tests, typecheck, lint, guardrails, and diff check.

## Acceptance Criteria
- Same API key + same symbol can resolve to different owning bots for SPOT and FUTURES.
- Same API key + same market type + same symbol still becomes ambiguous when overlapping managed scopes exist.
- Legacy callers without market type retain FUTURES semantics.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied with validation evidence.
- [x] Market-type ownership regression is covered.
- [x] Repository truth files are updated.

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
  - `pnpm --filter api run test -- src/modules/bots/runtimeExternalPositionOwner.service.test.ts --run` PASS (`10/10`)
  - `pnpm --filter api run test -- src/modules/positions/livePositionReconciliation.service.test.ts --run` PASS (`25/25`)
  - `pnpm --filter api run test -- src/modules/engine/runtimeSignalLoopDefaults.test.ts --run` PASS (`9/9`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run lint` PASS
  - `pnpm run quality:guardrails` PASS
  - `git diff --check` PASS
- Manual checks: source inspection found ownership key omitted market type;
  follow-up inspection found imported `Position.externalId` remains
  market-type blind and should be hardened as a separate DB-compatible slice.
- Screenshots/logs: not applicable
- High-risk checks: execution ownership remains fail-closed on ambiguity

## Architecture Evidence
- Architecture source reviewed: `docs/product/product.md`, `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore symbol-only external ownership
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: ownership index keyed by API key and symbol only.
- Gaps: no regression for same-symbol SPOT/FUTURES ownership separation.
- Inconsistencies: reconciliation became market-type aware, ownership remained market-type blind.
- Architecture constraints: wallet/market group market type is part of runtime context.

### 2. Select One Priority Task
- Selected task: add market type to external ownership scope.
- Priority rationale: directly affects whether assigned-market LIVE imports are owned or marked ambiguous.
- Why other candidates were deferred: external ID format hardening can be a later slice if still needed.

### 3. Plan Implementation
- Files or surfaces to modify: ownership service/tests and known market-type call sites.
- Logic: key ownership by market type, defaulting legacy callers to FUTURES.
- Edge cases: symbol-only legacy view remains collapsed and can still report ambiguity.

### 4. Execute Implementation
- Implementation notes:
  - External ownership keys now use `apiKey + marketType + symbol`.
  - Candidate market type is resolved from wallet/bot context and active
    market-group scope.
  - Known market type is propagated through reconciliation, runtime dashboard
    position/trade reads, pre-trade, order conflict/fill reuse, and runtime
    loop guards.
  - Legacy injected ownership maps keep read fallback for `apiKey:symbol`
    keys, preserving existing test/dependency compatibility while production
    ownership indexes build market-scoped keys.

### 5. Verify and Test
- Validation performed: focused ownership, reconciliation, runtime loop,
  typecheck, lint, guardrails, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: only passing market type at reconciliation lookup.
  Rejected because dashboard/pre-trade/order paths would remain market-type
  blind.
- Technical debt introduced: none in ownership index. Existing
  `Position.externalId` remains market-type blind and is queued as the next
  hardening candidate.
- Scalability assessment: key shape remains O(1) map lookup and extends cleanly
  for additional exchange market types when enum/model support exists.
- Refinements made: fixed line-budget guardrail by keeping the existing
  runtime-session positions file within 1000 lines.

### 7. Update Documentation and Knowledge
- Docs updated: task board, project state, MVP next commits, this evidence
  file.
- Context updated: yes
- Learning journal updated: not applicable

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
- [x] Learning journal was updated if a recurring pitfall is confirmed.

## Result Report

- Task summary: external takeover ownership is now market-type scoped end to
  end across the known runtime call sites.
- Files changed:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-64-external-ownership-market-type-task-2026-05-03.md`
  - `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts`
  - `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.test.ts`
  - runtime ownership lookup call sites in bots, engine, orders, and positions modules
- How tested: focused unit/e2e suites, API typecheck, lint, guardrails, and
  diff check all passed.
- What is incomplete: imported position `externalId` itself is still
  market-type blind (`apiKey:symbol:side`) and should be a separate compatible
  hardening slice if same API key + same symbol can exist in multiple market
  types at the persisted position identity layer.
- Next steps: queue `RUNTIME-AUDIT-65` for market-type-aware imported position
  identity if production evidence shows same-symbol SPOT/FUTURES persisted-row
  collisions.
- Decisions made: preserve FUTURES fallback and read compatibility for legacy
  injected ownership maps.
