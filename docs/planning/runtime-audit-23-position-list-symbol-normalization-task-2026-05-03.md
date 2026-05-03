# RUNTIME-AUDIT-23 Position List Symbol Normalization Task - 2026-05-03

## Header
- ID: RUNTIME-AUDIT-23
- Title: Normalize dashboard position list symbol filters
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend
- Depends on: RUNTIME-AUDIT-22
- Priority: P2
- Iteration: 41
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Dashboard position reads filter by `symbol` directly from the query string.
Trading/runtime paths persist and compare normalized uppercase symbols, so a
manual URL/dashboard filter such as `ethusdt` can return an empty positions
table even when `ETHUSDT` exists for the user.

## Goal
Normalize dashboard position list `symbol` filters at the API DTO boundary.

## Scope
- `apps/api/src/modules/positions/positions.types.ts`
- `apps/api/src/modules/positions/positions.list.e2e.test.ts`
- `docs/modules/api-positions.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add a failing e2e regression proving lowercase symbol filters miss existing
   uppercase positions.
2. Normalize `ListPositionsQuerySchema.symbol` to uppercase after trimming.
3. Keep status, limit, page, auth, and ownership behavior unchanged.
4. Run focused positions list tests and relevant quality gates.
5. Sync docs/context with evidence.

## Acceptance Criteria
- `GET /dashboard/positions?symbol=ethusdt` returns owned `ETHUSDT` rows.
- Symbol filters remain trimmed and non-empty.
- Position list ownership and pagination behavior are unchanged.

## Definition of Done
- [x] Regression fails before fix and passes after fix.
- [x] Focused positions test passes.
- [x] Typecheck, lint, guardrails, and diff review pass.
- [x] Source-of-truth docs are updated.

## Forbidden
- Case-insensitive database scans.
- Service-layer workaround branches.
- Changing position ownership, status, or pagination semantics.

## Validation Evidence
- Tests:
  - Initial focused regression failed as expected:
    `GET /dashboard/positions?symbol=ethusdt` returned `[]` while an owned
    `ETHUSDT` position existed.
  - PASS:
    `pnpm --filter api run test -- --run src/modules/positions/positions.list.e2e.test.ts --sequence.concurrent=false`.
  - PASS: `pnpm --filter api run typecheck`.
  - PASS: `pnpm run quality:guardrails`.
  - PASS: `pnpm run lint`.
  - PASS: `git diff --check` (CRLF warnings only).
- Manual checks:
  - Reviewed `ListPositionsQuerySchema` and `listPositions` Prisma filter
    path.
- High-risk checks:
  - Only the optional symbol query filter is normalized; ownership, status,
    pagination, and persisted rows remain unchanged.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: position list symbol filters are trimmed but not normalized.
- Gap: dashboard filters can hide existing rows because persisted trading
  symbols are canonical uppercase.
- Architecture constraint: API DTOs should normalize operator query input
  before read models build Prisma filters.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-23`.
- Priority rationale: small dashboard-truth fix for a read model directly
  visible to the operator.
- Why other candidates were deferred: order-list symbol normalization is a
  similar but separate endpoint and should be handled in a separate tiny slice.

### 3. Plan Implementation
- Files or surfaces to modify: positions query DTO, focused positions e2e
  test, positions module docs, and canonical planning/context files.
- Logic: transform optional `symbol` query filter to uppercase in
  `ListPositionsQuerySchema`.
- Edge cases: lowercase, mixed case, surrounding spaces, empty strings.

### 4. Execute Implementation
- Implementation notes: added a focused positions list e2e regression and
  transformed `ListPositionsQuerySchema.symbol` to uppercase after trim/min
  validation.

### 5. Verify and Test
- Validation performed: failing-then-passing focused e2e, API typecheck,
  repository guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: service-layer uppercase normalization was
  rejected because query normalization belongs to the DTO boundary.
- Technical debt introduced: no.
- Scalability assessment: the schema-level transform covers all current
  position-list callers.
- Refinements made: kept order-list normalization out of scope for a separate
  tiny task.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-positions.md`,
  `docs/planning/mvp-next-commits.md`, and
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/TASK_BOARD.md` and
  `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable.

## Result Report
- Task summary: dashboard position list symbol filters now normalize to
  uppercase and find canonical persisted symbols.
- Files changed: positions query DTO, new positions list e2e test, positions
  module docs, planning queue, execution plan, task board, and project state.
- How tested: focused positions list e2e, API typecheck, repository guardrails,
  lint, and diff review.
- What is incomplete: order-list symbol normalization is a separate candidate
  slice.
