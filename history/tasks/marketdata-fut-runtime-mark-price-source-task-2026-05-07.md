# Task

## Header
- ID: MARKETDATA-FUT-01
- Title: Expose runtime mark-price source for futures evidence
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1MONEY-01
- Priority: P0
- Iteration: 51
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`MARKETDATA-FUT-001` needs production evidence showing futures price source
fields for live runtime. Before asking an operator for production readback, the
local runtime payload must carry an explicit source next to `markPrice`.

## Goal
Expose `markPriceSource` on runtime position rows so production readback can
distinguish runtime symbol stats, runtime ticker, fallback ticker, and
exchange-unrealized-PnL derived prices.

## Scope
- `apps/api/src/modules/engine/runtimeExchangeSyncedPositionPrice.ts`
- `apps/api/src/modules/bots/runtimeExchangeSyncedPositionPrice.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/engine/runtimeLifecycleMarkPrice.service.test.ts`
- `apps/api/src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts`
- `apps/web/src/features/bots/types/bot.type.ts`
- Planning/context docs.

## Success Signal
- User or operator problem: a runtime mark price without source is not enough
  for V1 futures market-data evidence.
- Expected product or reliability outcome: read-only runtime position payloads
  include auditable price-source metadata.
- How success will be observed: API tests assert `markPriceSource`, API/Web
  typechecks pass, and the next production readback can capture the field.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified code change and evidence for the runtime mark-price source contract.

## Constraints
- Do not change price-selection behavior.
- Do not add a new pricing system.
- Do not run live-money mutations.
- Preserve existing response compatibility by adding an optional Web field.

## Acceptance Criteria
- Runtime position rows include `markPriceSource`.
- Exchange-derived prices are labeled `exchange_unrealized_pnl`.
- Fallback ticker prices are labeled `fallback_ticker`.
- Existing callers of `resolvePreferredRuntimeOrExchangeSyncedPrice` remain
  compatible.
- Focused tests and typechecks pass.

## Definition of Done
- [x] API payload includes `markPriceSource`.
- [x] Focused regression tests assert source labels.
- [x] API typecheck passes.
- [x] Web typecheck passes.
- [x] Source-of-truth docs/context are updated.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/engine/runtimeLifecycleMarkPrice.service.test.ts src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` PASS (`8/8`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm --filter web run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `git diff --check` PASS.
- Manual checks:
  - Confirmed existing numeric helper remains exported via
    `resolvePreferredRuntimeOrExchangeSyncedPrice`.
  - Confirmed new source-aware helper is additive.
- Screenshots/logs: not applicable.
- High-risk checks:
  - No secrets, auth tokens, live orders, deploys, restore actions, or
    production database mutations were used.

## Architecture Evidence
- Architecture source reviewed:
  - `history/audits/v1-function-implementation-readiness-audit-2026-05-01.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this additive payload/source-label change if needed.
- Observability or alerting impact: production readback can now capture
  `markPriceSource`.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime positions exposed `markPrice` but no source metadata.
- Gaps: production readback still requires auth/operator access after deploy.
- Inconsistencies: V1 evidence requested source fields that the payload did not
  explicitly expose.
- Architecture constraints: reuse current price-selection mechanism; do not add
  a parallel pricing path.

### 2. Select One Priority Task
- Selected task: MARKETDATA-FUT-01 runtime mark-price source field.
- Priority rationale: it is a small code slice that directly improves a P0 V1
  evidence row and avoids an operator readback dead-end.
- Why other candidates were deferred: live close/TP/SL/TSL samples require
  paper-safe scenario execution or operator approval.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: add a source-aware wrapper around existing price selection, keep the
  numeric helper for existing callers, and serialize source on position rows.
- Edge cases: unavailable price source reports `unavailable`; source field is
  optional in Web types for backward compatibility.

### 4. Execute Implementation
- Implementation notes: no price-selection behavior changed. Existing helper
  now delegates to the source-aware helper and returns only `.price`.

### 5. Verify and Test
- Validation performed: focused tests, API typecheck, Web typecheck,
  guardrails, and diff check.
- Result: all selected checks passed.

### 6. Self-Review
- Simpler option considered: document source externally from inference.
  Rejected because V1 production evidence should not rely on inference.
- Technical debt introduced: no
- Scalability assessment: source labels are additive and can be extended if a
  new approved price source is added later.
- Refinements made: preserved existing numeric helper to avoid broad refactors.

### 7. Update Documentation and Knowledge
- Docs updated:
  - this task evidence
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Context updated:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
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

## Result Report
- Task summary: runtime position rows now expose `markPriceSource` for V1
  futures market-data readback.
- Files changed: API/Web runtime contract and planning/context docs.
- How tested: focused API tests (`8/8`), API/Web typechecks, guardrails, and
  diff check.
- What is incomplete: authenticated production readback of the new field after
  deployment.
- Next steps: deploy/merge this branch, then capture read-only production
  runtime payload showing `markPrice` and `markPriceSource`.
