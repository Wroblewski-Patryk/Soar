# Task

## Header
- ID: RUNTIME-AUDIT-26
- Title: Show canonical symbol-level advanced close plans for strategy-null runtime positions
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-25
- Priority: P1
- Iteration: 44
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Operator-reported runtime/dashboard drift includes missing TTP display for LIVE/PAPER positions. Runtime position reads already resolve DCA/TTP/TSL display plans by canonical symbol-level market-group strategy links, but position rows with `strategyId=null` can still block those plans behind a direct strategy-context gate. Existing tests intentionally prevent stale legacy fallback, so the slice must only enable canonical market-group symbol-level context.

## Goal
Allow runtime position dashboard reads to show canonical symbol-level DCA/TTP/TSL display plans for `BOT_MANAGED` positions that lack a direct `strategyId` when the active bot market group strategy links resolve that symbol.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-strategy-context.e2e.test.ts`
- `docs/modules/api-bots.md` or closest existing bot runtime module documentation
- planning/context queue files

## Implementation Plan
1. Add a failing e2e regression for a strategy-null LIVE position under active canonical market-group strategy links.
2. Reuse existing symbol-level plan maps to determine whether display strategy context is resolved for the position symbol.
3. Use that display-context truth for DCA/TTP/TSL plan serialization and dynamic stop fallback, while keeping trade actionability tied to direct/canonical executable strategy identity.
4. Verify focused runtime strategy context e2e, broader relevant bot runtime pack, typecheck, guardrails, lint, and diff review.
5. Update docs and context files with evidence.

## Acceptance Criteria
- A strategy-null runtime position under canonical active market-group strategy links returns TTP levels and dynamic TTP stop-loss when price/PnL arms advanced TTP.
- Stale legacy strategy fallback remains blocked when no canonical market-group context exists.
- Position `actionable` remains fail-closed unless executable strategy identity is available.
- No new strategy resolution system or duplicate parser is introduced.

## Definition of Done
- [x] Regression fails before implementation and passes after implementation.
- [x] Relevant focused e2e tests pass.
- [x] Typecheck, guardrails, lint, and diff review pass.
- [x] Docs/context source-of-truth files are updated.
- [x] Commit and push are completed only after validation passes.

## Forbidden
- Do not enable stale legacy fallback for strategy-null positions.
- Do not mark positions executable/actionable without an executable strategy identity.
- Do not duplicate strategy config parsing.
- Do not add workaround UI-only values.

## Validation Evidence
- Tests:
  - FAIL before fix:
    `pnpm --filter api run test -- --run src/modules/bots/bots.runtime-strategy-context.e2e.test.ts --sequence.concurrent=false`
    failed the new canonical strategy-null TTP regression with
    `strategyAutomationContextResolved=false`.
  - PASS after fix:
    `pnpm --filter api run test -- --run src/modules/bots/bots.runtime-strategy-context.e2e.test.ts --sequence.concurrent=false`
    (`5/5`).
  - PASS broader runtime/read pack:
    `pnpm --filter api run test -- --run src/modules/bots/bots.runtime-strategy-context.e2e.test.ts src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts src/modules/bots/bots.e2e.test.ts --sequence.concurrent=false`
    (`37/37`).
  - PASS: `pnpm --filter api run typecheck`.
  - PASS: `pnpm run quality:guardrails`.
  - PASS: `pnpm run lint`.
- Manual checks: diff review PASS.
- Screenshots/logs: not applicable
- High-risk checks: runtime/live-trading display is fail-closed for actionability

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/04_runtime-contexts.md`, existing runtime strategy context tests
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: module doc only

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: canonical symbol-level TTP/DCA/TSL maps can be computed but blocked for `strategyId=null` positions by direct strategy-context gating.
- Gaps: no regression covers canonical market-group strategy-null TTP display.
- Inconsistencies: legacy fallback is intentionally blocked, but canonical symbol-level context should be allowed for dashboard display.
- Architecture constraints: no stale legacy fallback; actionability must remain fail-closed.

### 2. Select One Priority Task
- Selected task: canonical symbol-level advanced close display for strategy-null runtime positions.
- Priority rationale: directly addresses operator-reported missing TTP dashboard state without changing execution authority.
- Why other candidates were deferred: wallet/base-currency and aggregate lowercase filters are already covered by tests.

### 3. Plan Implementation
- Files or surfaces to modify: runtime position read service, focused e2e, docs/context.
- Logic: derive display-context resolution from existing symbol-level plan maps and use it only for serialized plans/dynamic stop fallback.
- Edge cases: stale legacy links remain hidden; multi-strategy bots remain non-actionable without direct strategy identity.

### 4. Execute Implementation
- Implementation notes: `listBotRuntimeSessionPositions` now distinguishes
  executable strategy context from display strategy context. Direct/canonical
  executable strategy identity still controls `actionable`; existing
  symbol-level DCA/TTP/TSL maps can resolve dashboard display context for
  strategy-null positions when active canonical market-group links own that
  symbol.

### 5. Verify and Test
- Validation performed: failing-then-passing regression, focused runtime
  strategy context e2e, broader bot runtime/read pack, API typecheck,
  repository guardrails, lint.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: making all strategy-null positions use symbol
  fallback globally. Rejected because existing architecture intentionally
  blocks stale legacy fallback without canonical context.
- Technical debt introduced: no
- Scalability assessment: reuses the existing symbol-level strategy display
  maps and parser; no new resolution system.
- Refinements made: kept `actionable` tied to executable strategy identity
  while allowing display-only TTP/DCA/TSL context.

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
- Task summary: Runtime position reads now surface canonical symbol-level
  advanced close display plans for strategy-null positions without making them
  executable.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-strategy-context.e2e.test.ts`
  - `docs/modules/api-bots.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - this task file
- How tested: see validation evidence.
- What is incomplete: nothing.
- Next steps: continue one-slice runtime/dashboard drift audit after commit.
- Decisions made: display context can come from canonical symbol-level
  strategy maps; execution/actionability still requires executable strategy
  identity.
