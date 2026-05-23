# Task

## Header
- ID: RUNTIME-AUDIT-27
- Title: Keep runtime symbol-stats limit aligned with configured symbol order
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-26
- Priority: P1
- Iteration: 45
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime symbol stats power the dashboard signals/markets table. The read model selects the displayed unfiltered symbols from configured symbol order, but the base persisted `BotRuntimeSymbolStat` rows are fetched independently with the same `limit` ordered by realized PnL. When those orders differ, the displayed configured symbol can render zero signal data even though its stat row exists.

## Goal
Ensure unfiltered runtime symbol-stats responses hydrate stats for the exact configured symbols that are selected for display, so dashboard signal rows reflect persisted runtime truth.

## Scope
- `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
- `apps/api/src/modules/bots/bots.e2e.test.ts`
- `apps/api/src/modules/bots/botsRuntimeRead.repository.ts` if needed
- `docs/modules/api-bots.md`
- planning/context queue files

## Implementation Plan
1. Add a failing e2e regression where `limit=1` selects the first configured symbol but the top-PnL row belongs to a different configured symbol.
2. Rework symbol-stats base hydration so selected display symbols and fetched persisted stat rows use the same symbol set.
3. Keep explicit `symbol` filter behavior unchanged.
4. Verify focused bots e2e, broader runtime/read pack, typecheck, guardrails, lint, and diff review.
5. Update docs and context files.

## Acceptance Criteria
- Unfiltered `symbol-stats?limit=1` returns the first configured symbol with its persisted totals, even when another symbol has higher realized PnL.
- Explicit `symbol` filters still return the requested configured symbol with normalized lowercase input support.
- Off-scope symbols remain empty/fail-closed.
- No duplicate strategy/symbol scope resolver is introduced.

## Definition of Done
- [x] Regression fails before implementation and passes after implementation.
- [x] Relevant e2e tests pass.
- [x] Typecheck, guardrails, lint, and diff review pass.
- [x] Docs/context source-of-truth files are updated.
- [x] Commit and push are completed only after validation passes.

## Forbidden
- Do not change configured symbol ordering semantics.
- Do not expose off-scope persisted stats.
- Do not remove existing explicit symbol normalization.
- Do not introduce a parallel runtime symbol scope system.

## Validation Evidence
- Tests:
  - FAIL before fix:
    `pnpm --filter api run test -- --run src/modules/bots/bots.e2e.test.ts --sequence.concurrent=false`
    failed the configured-order `limit=1` regression with displayed
    `BTCUSDT.totalSignals=0` instead of `3`.
  - PASS after fix:
    `pnpm --filter api run test -- --run src/modules/bots/bots.e2e.test.ts --sequence.concurrent=false`
    (`26/26`).
  - PASS broader runtime/read pack:
    `pnpm --filter api run test -- --run src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts src/modules/bots/bots.runtime-strategy-context.e2e.test.ts src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts --sequence.concurrent=false`
    (`42/42`).
  - PASS: `pnpm --filter api run typecheck`.
  - PASS: `pnpm run quality:guardrails`.
  - PASS: `pnpm run lint`.
- Manual checks: diff review PASS.
- Screenshots/logs: not applicable
- High-risk checks: runtime dashboard read path remains selected-bot scoped.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/04_runtime-contexts.md`, `docs/modules/api-bots.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: module doc only

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: display symbol selection and persisted stats hydration can use different orderings under unfiltered `limit`.
- Gaps: no regression covers top-PnL row competing with configured-order display rows.
- Inconsistencies: dashboard symbol-stats can show zero data for a configured symbol with persisted stats.
- Architecture constraints: selected-bot configured symbol scope is authoritative.

### 2. Select One Priority Task
- Selected task: align unfiltered symbol-stats hydration with configured symbol order.
- Priority rationale: directly affects paper/live dashboard signal truth.
- Why other candidates were deferred: TTP display was closed in `RUNTIME-AUDIT-26`; this is the next read-model truth drift.

### 3. Plan Implementation
- Files or surfaces to modify: focused e2e, symbol-stats read service/repository, docs/context.
- Logic: fetch persisted stats for selected configured symbols after scope resolution.
- Edge cases: explicit symbol filters, off-scope symbols, empty configured symbols.

### 4. Execute Implementation
- Implementation notes: Added repository hydration by exact symbol set and
  changed unfiltered symbol-stats reads to fetch persisted stats after the
  configured display symbols are known. Explicit symbol filters still use the
  direct normalized-symbol read path.

### 5. Verify and Test
- Validation performed: failing-then-passing regression, focused bots e2e,
  broader runtime/read pack, API typecheck, guardrails, lint.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: changing the original DB ordering to symbol order.
  Rejected because selected display symbols are known only after configured
  market scope resolution and catalog-backed expansion.
- Technical debt introduced: no
- Scalability assessment: the additional hydration query is bounded by the
  validated `limit` / selected symbol set.
- Refinements made: kept aggregate summary behavior and explicit symbol
  behavior unchanged.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-bots.md`,
  `docs/planning/mvp-next-commits.md`,
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`.
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Result Report
- Task summary: Runtime symbol-stats now hydrate persisted rows for the exact
  configured symbols selected for unfiltered display limits.
- Files changed:
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
  - `apps/api/src/modules/bots/botsRuntimeRead.repository.ts`
  - `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
  - `docs/modules/api-bots.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - this task file
- How tested: see validation evidence.
- What is incomplete: nothing.
- Next steps: continue one-slice runtime/dashboard drift audit after commit.
- Decisions made: unfiltered display order remains configured-symbol order;
  persisted stat hydration now follows that selected set.
