# RUNTIME-AUDIT-22 Wallet Analytics Date Range Validation Task - 2026-05-03

## Header
- ID: RUNTIME-AUDIT-22
- Title: Fail closed inverted wallet analytics date ranges
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend
- Depends on: RUNTIME-AUDIT-21
- Priority: P2
- Iteration: 40
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Wallet analytics query parsing validates individual `from` and `to` datetime
values, but it does not validate the range relationship. A dashboard or URL
request with `from` later than `to` can return an empty analytics view that
looks like missing wallet data instead of failing closed as invalid input.

## Goal
Validate wallet analytics date ranges at the DTO boundary so inverted
`from`/`to` windows return `400`.

## Scope
- `apps/api/src/modules/wallets/wallets.types.ts`
- `apps/api/src/modules/wallets/wallets.e2e.test.ts`
- `docs/modules/api-wallets.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add a failing regression proving inverted analytics date ranges are rejected.
2. Add a schema-level cross-field validation to `WalletAnalyticsQuerySchema`.
3. Keep valid open-ended and ordered ranges unchanged.
4. Run focused wallet tests and relevant quality gates.
5. Sync docs/context with evidence.

## Acceptance Criteria
- `from > to` returns `400` for wallet analytics endpoints.
- Valid `from`/`to`, `from`-only, and `to`-only query windows remain accepted.
- Date-range validation happens before service-layer Prisma filters are built.

## Definition of Done
- [x] Regression fails before fix and passes after fix.
- [x] Focused wallet tests pass.
- [x] Typecheck, lint, guardrails, and diff review pass.
- [x] Source-of-truth docs are updated.

## Forbidden
- Service-layer empty-result workarounds.
- Endpoint-specific duplicated date checks.
- Changing wallet analytics aggregation or cashflow semantics.

## Validation Evidence
- Tests:
  - Initial focused regression failed as expected: inverted wallet analytics
    date range returned `200` instead of `400`.
  - PASS:
    `pnpm --filter api run test -- --run src/modules/wallets/wallets.e2e.test.ts --sequence.concurrent=false`
    (`18/18`).
  - PASS: `pnpm --filter api run typecheck`.
  - PASS: `pnpm run quality:guardrails`.
  - PASS: `pnpm run lint`.
  - PASS: `git diff --check` (CRLF warnings only).
- Manual checks:
  - Reviewed wallet analytics schema and service query filter path.
- High-risk checks:
  - Invalid date ranges now fail before Prisma filters are built.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: `WalletAnalyticsQuerySchema` validates datetime shape but not
  chronological order.
- Gap: invalid operator-supplied filters can produce misleading empty
  dashboard analytics.
- Architecture constraint: dashboard query validity should be owned by DTO
  schemas before Prisma filters are built.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-22`.
- Priority rationale: small TESTER-mode API-boundary hardening for dashboard
  truthfulness.
- Why other candidates were deferred: wallet `bucket` behavior needs a clearer
  product/API aggregation contract before implementation.

### 3. Plan Implementation
- Files or surfaces to modify: wallet DTO schema, focused e2e regression,
  wallet module docs, and canonical planning/context files.
- Logic: add one cross-field range refinement to the existing analytics query
  schema.
- Edge cases: ordered ranges, equal endpoints, and open-ended ranges.

### 4. Execute Implementation
- Implementation notes: added a `WalletAnalyticsQuerySchema` cross-field
  refinement for `from <= to`, added a focused e2e regression, and removed the
  now-unneeded service-layer cashflow source cast.

### 5. Verify and Test
- Validation performed: failing-then-passing focused wallets e2e, API
  typecheck, repository guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: service-layer early return was rejected because
  query validity belongs to the existing DTO schema.
- Technical debt introduced: no.
- Scalability assessment: the schema-level validation covers all wallet
  analytics endpoints that reuse `WalletAnalyticsQuerySchema`.
- Refinements made: removed a redundant service source cast after DTO typing.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-wallets.md`,
  `docs/planning/mvp-next-commits.md`, and
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/TASK_BOARD.md` and
  `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable.

## Result Report
- Task summary: wallet analytics date filters now fail closed when `from` is
  later than `to`.
- Files changed: wallet DTO schema, wallet service query helper, wallet e2e
  test, wallet module docs, planning queue, execution plan, task board, and
  project state.
- How tested: focused wallets e2e (`18/18`), API typecheck, repository
  guardrails, lint, and diff review.
- What is incomplete: nothing in this slice.
