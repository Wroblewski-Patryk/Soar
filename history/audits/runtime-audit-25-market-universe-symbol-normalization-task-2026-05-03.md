# RUNTIME-AUDIT-25 Market Universe Symbol Normalization Task - 2026-05-03

## Header
- ID: RUNTIME-AUDIT-25
- Title: Normalize market universe base currency and symbol lists
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend
- Depends on: RUNTIME-AUDIT-24
- Priority: P2
- Iteration: 43
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Market universe create/update accepts `baseCurrency`, `whitelist`, and
`blacklist` without DTO-level normalization. Downstream symbol resolvers
normalize for execution, but persisted dashboard/source-of-truth rows can still
show lowercase or mixed-case symbols after operator input.

## Goal
Normalize market universe base currency and symbol-list inputs at the API DTO
boundary.

## Scope
- `apps/api/src/modules/markets/markets.types.ts`
- `apps/api/src/modules/markets/markets.e2e.test.ts`
- `docs/modules/api-markets.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add a failing e2e regression proving lowercase market universe inputs are
   persisted as lowercase today.
2. Normalize `baseCurrency`, `whitelist`, and `blacklist` in market universe
   DTO schemas using existing symbol helpers.
3. Keep exchange, market type, active-bot guards, and symbol sync semantics
   unchanged.
4. Run focused markets tests and relevant quality gates.
5. Sync docs/context with evidence.

## Acceptance Criteria
- Create/update responses persist uppercase `baseCurrency`, `whitelist`, and
  `blacklist`.
- Symbol lists remain deduped and preserve operator-provided first occurrence
  order.
- Existing market-universe symbol composition semantics are unchanged.

## Definition of Done
- [x] Regression fails before fix and passes after fix.
- [x] Focused markets tests pass.
- [x] Typecheck, lint, guardrails, and diff review pass.
- [x] Source-of-truth docs are updated.

## Forbidden
- Independent symbol normalization that bypasses existing helpers.
- Service-layer workaround branches.
- Changing active-bot update/delete guards.
- Changing market catalog behavior beyond normalized input.

## Validation Evidence
- Tests:
  - Initial focused regression failed as expected: market universe create
    persisted `baseCurrency: usdt` instead of `USDT`.
  - PASS:
    `pnpm --filter api run test -- --run src/modules/markets/markets.e2e.test.ts --sequence.concurrent=false`
    (`16/16`).
  - PASS: `pnpm --filter api run typecheck`.
  - PASS: `pnpm run quality:guardrails`.
  - PASS: `pnpm run lint`.
  - PASS: `git diff --check` (CRLF warnings only).
- Manual checks:
  - Reviewed market universe create/update DTO and service persistence path.
- High-risk checks:
  - Symbol composition, active-bot guards, exchange capability behavior, and
    linked symbol-group sync semantics are unchanged.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: market universe DTOs trim but do not normalize base currency or symbol
  arrays.
- Gap: dashboard/source-of-truth rows can persist lowercase symbols even though
  execution resolvers later normalize them.
- Architecture constraint: canonical market scope input should be normalized at
  the API boundary and reuse existing symbol helpers.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-25`.
- Priority rationale: small configuration truth fix in the markets surface that
  feeds bot market assignment and LIVE import ownership.
- Why other candidates were deferred: manual-order write-path normalization is
  higher risk and needs its own money-impacting task.

### 3. Plan Implementation
- Files or surfaces to modify: markets DTO schema, focused e2e regression,
  markets module docs, and canonical planning/context files.
- Logic: reuse `normalizeBaseCurrency` and `normalizeSymbol` in DTO transforms,
  preserving existing operator list order.
- Edge cases: lowercase, mixed case, surrounding spaces, duplicates, empty
  symbol-list entries.

### 4. Execute Implementation
- Implementation notes: added a focused markets e2e regression and normalized
  market universe `baseCurrency`, `whitelist`, and `blacklist` in DTO
  transforms.

### 5. Verify and Test
- Validation performed: failing-then-passing focused markets e2e, API
  typecheck, repository guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: service-layer normalization was rejected because
  market-scope input normalization belongs to the DTO boundary.
- Technical debt introduced: no.
- Scalability assessment: schema transforms cover create and update because
  update is derived from the create schema partial.
- Refinements made: preserved symbol-list first occurrence order after the
  first implementation attempt sorted symbols and violated an existing test.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-markets.md`,
  `docs/planning/mvp-next-commits.md`, and
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/TASK_BOARD.md` and
  `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable.

## Result Report
- Task summary: market universe base currency and symbol-list inputs now
  persist canonical uppercase values.
- Files changed: markets DTO schema, markets e2e test, markets module docs,
  planning queue, execution plan, task board, and project state.
- How tested: focused markets e2e (`16/16`), API typecheck, repository
  guardrails, lint, and diff review.
- What is incomplete: nothing in this slice.
