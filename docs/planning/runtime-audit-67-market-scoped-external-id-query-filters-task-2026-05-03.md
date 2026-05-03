# Task

## Header
- ID: RUNTIME-AUDIT-67
- Title: Market-scope imported external ID query filters
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-66
- Priority: P1
- Iteration: 85
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Imported position ownership and IDs are now market-scoped, but several database
queries still filter imported positions with `externalId startsWith apiKey:`.
That can over-match canonical rows from another market type for the same API
key and symbol.

## Goal
Constrain imported-position database filters to the known market type while
preserving legacy `apiKey:symbol:side` row compatibility.

## Scope
- imported external ID helper prefixes
- runtime session positions/trades imported-row filters
- pre-trade/open-position guards
- order conflict/fill guards
- runtime loop count guard
- focused runtime/pre-trade tests where practical
- source-of-truth docs

## Implementation Plan
1. Add helper prefix builders for canonical market-scoped IDs and legacy
   symbol-scoped IDs.
2. Replace broad `apiKey:` startsWith filters in market-known paths with
   canonical market prefix plus legacy symbol prefix filters.
3. Keep legacy broad behavior only where no symbol/market context exists.
4. Run focused tests, typecheck, lint, guardrails, and diff check.

## Acceptance Criteria
- Market-known imported-row queries include canonical `apiKey:marketType:`
  filters.
- Legacy rows still match by `apiKey:symbol:`.
- Same API key + same symbol in another market is not matched by market-known
  query filters.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied with validation evidence.
- [x] Focused regression covers a market-scoped external ID filter.
- [x] Source-of-truth files are updated.

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
  - `pnpm --filter api run test -- src/modules/engine/runtimeSignalLoopDefaults.test.ts --run` PASS (`10/10`)
  - `pnpm --filter api run test -- src/modules/positions/livePositionReconciliation.service.test.ts --run` PASS (`26/26`)
  - `pnpm --filter api run test -- src/modules/engine/preTrade.service.test.ts --run` PASS (`17/17`)
  - `pnpm --filter api run test -- src/modules/orders/orders.service.test.ts --run` PASS (`28/28`)
  - `pnpm --filter api run test -- src/modules/bots/runtimeSessionPositionCommand.service.test.ts --run` PASS (`9/9`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS
- Manual checks: source inspection found broad `externalId startsWith apiKey:`
  filters in market-known paths; follow-up search found no remaining broad
  market-known API-key prefix filters.
- Screenshots/logs: not applicable
- High-risk checks: legacy rows must remain compatible

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/runtime-signal-merge-contract.md`
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
- Rollback note: revert this commit to restore broad API-key imported filters
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: market-known query filters can still match all market types for one API key.
- Gaps: no shared prefix helper for canonical/legacy imported external ID DB filters.
- Inconsistencies: ownership reads are exact, but some DB candidate filters are broad.
- Architecture constraints: runtime guardrails must be deterministic and not
  mix market contexts.

### 2. Select One Priority Task
- Selected task: scope imported external ID query filters by market.
- Priority rationale: it is the next failure mode after market-scoped identity.
- Why other candidates were deferred: broader dashboard parity audit continues
  after closing this backend guardrail.

### 3. Plan Implementation
- Files or surfaces to modify: helper and market-known query call sites.
- Logic: canonical market prefix OR legacy symbol prefix.
- Edge cases: multiple symbols, null API key, legacy external IDs.

### 4. Execute Implementation
- Implementation notes:
  - Added canonical market prefix and legacy symbol prefix helpers.
  - Runtime dashboard position/trade reads now constrain botless imported row
    candidates by market-scoped or legacy-symbol external ID prefixes.
  - Pre-trade, runtime loop, execution no-flip, and order conflict/fill guards
    now use the same canonical-or-legacy prefix pattern.

### 5. Verify and Test
- Validation performed: focused runtime loop, reconciliation, pre-trade,
  orders, runtime position command tests, typecheck, lint, guardrails, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: keep broad `apiKey:` filter because symbol filters
  exist. Rejected because the same API key and symbol can exist in SPOT and
  FUTURES canonical IDs.
- Technical debt introduced: no
- Scalability assessment: prefix helper pattern scales with new market types
  once enum/model support expands.
- Refinements made: kept `runtimeSessionPositionsRead.service.ts` within the
  production monolith line budget without introducing a new module in this slice.

### 7. Update Documentation and Knowledge
- Docs updated: task board, project state, MVP next commits, this evidence file.
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

- Task summary: market-known imported-position DB filters now distinguish
  canonical market-scoped rows from legacy symbol-scoped rows.
- Files changed:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/runtime-audit-67-market-scoped-external-id-query-filters-task-2026-05-03.md`
  - `apps/api/src/modules/positions/livePositionReconciliation.helpers.ts`
  - runtime dashboard, pre-trade, runtime loop, execution, and order guard modules
- How tested: focused tests, API typecheck, guardrails, lint, and diff check passed.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue with the next dashboard/API/runtime parity drift.
- Decisions made: match canonical rows by market prefix and legacy rows by
  symbol prefix, avoiding broad API-key-only filtering in market-known paths.
