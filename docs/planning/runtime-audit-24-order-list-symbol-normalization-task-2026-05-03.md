# RUNTIME-AUDIT-24 Order List Symbol Normalization Task - 2026-05-03

## Header
- ID: RUNTIME-AUDIT-24
- Title: Normalize dashboard order list symbol filters
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend
- Depends on: RUNTIME-AUDIT-23
- Priority: P2
- Iteration: 42
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Dashboard order reads filter by `symbol` directly from the query string.
Trading/runtime paths persist canonical uppercase symbols, so a manual URL or
dashboard filter such as `ethusdt` can return an empty orders table even when
`ETHUSDT` orders exist for the user.

## Goal
Normalize dashboard order list `symbol` filters at the API DTO boundary.

## Scope
- `apps/api/src/modules/orders/orders.types.ts`
- `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
- `docs/modules/api-orders.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add a failing e2e regression proving lowercase symbol filters miss existing
   uppercase orders.
2. Normalize `ListOrdersQuerySchema.symbol` to uppercase after trimming.
3. Keep status, limit, page, auth, and ownership behavior unchanged.
4. Run focused order/position read tests and relevant quality gates.
5. Sync docs/context with evidence.

## Acceptance Criteria
- `GET /dashboard/orders?symbol=ethusdt` returns owned `ETHUSDT` rows.
- Symbol filters remain trimmed and non-empty.
- Order list ownership and pagination behavior are unchanged.

## Definition of Done
- [x] Regression fails before fix and passes after fix.
- [x] Focused order read test passes.
- [x] Typecheck, lint, guardrails, and diff review pass.
- [x] Source-of-truth docs are updated.

## Forbidden
- Case-insensitive database scans.
- Service-layer workaround branches.
- Changing order ownership, status, lifecycle, or pagination semantics.

## Validation Evidence
- Tests:
  - Initial focused regression failed as expected:
    `GET /dashboard/orders?symbol=ethusdt` returned `[]` while an owned
    `ETHUSDT` order existed.
  - PASS:
    `pnpm --filter api run test -- --run src/modules/orders/orders-positions.e2e.test.ts --sequence.concurrent=false`
    (`21/21`).
  - PASS: `pnpm --filter api run typecheck`.
  - PASS: `pnpm run quality:guardrails`.
  - PASS: `pnpm run lint`.
  - PASS: `git diff --check` (CRLF warnings only).
- Manual checks:
  - Reviewed `ListOrdersQuerySchema` and `listOrders` Prisma filter path.
- High-risk checks:
  - Only the optional order-list symbol query filter is normalized; ownership,
    lifecycle, status, pagination, and write commands remain unchanged.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: order list symbol filters are trimmed but not normalized.
- Gap: dashboard filters can hide existing rows because persisted trading
  symbols are canonical uppercase.
- Architecture constraint: API DTOs should normalize operator query input
  before read models build Prisma filters.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-24`.
- Priority rationale: small architecture-consistency follow-up to
  `RUNTIME-AUDIT-23` for the sibling dashboard read model.
- Why other candidates were deferred: broader manual-order command symbol
  normalization touches money-impacting write paths and needs a separate
  scoped task.

### 3. Plan Implementation
- Files or surfaces to modify: orders query DTO, focused e2e regression,
  orders module docs, and canonical planning/context files.
- Logic: transform optional `symbol` query filter to uppercase in
  `ListOrdersQuerySchema`.
- Edge cases: lowercase, mixed case, surrounding spaces, empty strings.

### 4. Execute Implementation
- Implementation notes: added a focused orders read e2e regression and
  transformed `ListOrdersQuerySchema.symbol` to uppercase after trim/min
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
  order-list callers.
- Refinements made: manual-order command/context symbol normalization remains
  out of this read-only slice.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-orders.md`,
  `docs/planning/mvp-next-commits.md`, and
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/TASK_BOARD.md` and
  `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable.

## Result Report
- Task summary: dashboard order list symbol filters now normalize to
  uppercase and find canonical persisted symbols.
- Files changed: orders query DTO, orders/positions e2e test, orders module
  docs, planning queue, execution plan, task board, and project state.
- How tested: focused orders/positions read e2e (`21/21`), API typecheck,
  repository guardrails, lint, and diff review.
- What is incomplete: write-path/manual-order symbol normalization is a
  separate candidate slice.
