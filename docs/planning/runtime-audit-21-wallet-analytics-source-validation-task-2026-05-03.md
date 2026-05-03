# RUNTIME-AUDIT-21 Wallet Analytics Source Validation Task - 2026-05-03

## Header
- ID: RUNTIME-AUDIT-21
- Title: Fail closed invalid wallet analytics source filters
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend
- Depends on: RUNTIME-AUDIT-20
- Priority: P2
- Iteration: 39
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Wallet analytics query parsing accepts any non-empty `source` string and casts
it to `WalletCashflowSource` later. Invalid filter values should be rejected at
the API boundary instead of reaching Prisma or producing unstable dashboard
errors.

## Goal
Validate wallet analytics `source` filters against the canonical wallet
cashflow source enum.

## Scope
- `apps/api/src/modules/wallets/wallets.types.ts`
- `apps/api/src/modules/wallets/wallets.e2e.test.ts`
- `docs/modules/api-wallets.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add a failing regression proving invalid `source` filters return a bad
   request instead of a successful/unstable response.
2. Change `WalletAnalyticsQuerySchema.source` from free string to
   `WalletCashflowSource` enum validation.
3. Keep valid analytics source filters unchanged.
4. Run focused wallet tests and quality gates.
5. Sync docs/context.

## Acceptance Criteria
- Invalid `source` query values return `400`.
- Valid wallet cashflow source filters still work.
- No service-layer casts can admit arbitrary source strings.

## Definition of Done
- [x] Regression fails before fix and passes after fix.
- [x] Focused wallet tests pass.
- [x] Typecheck, lint, guardrails, and diff review pass.
- [x] Source-of-truth docs are updated.

## Forbidden
- Custom source allowlists that drift from Prisma.
- Controller-only ad hoc checks.
- Changing cashflow source semantics.

## Validation Evidence
- Tests:
  - Initial focused regression failed as expected: invalid wallet analytics
    `source` returned `500` instead of `400`.
  - PASS:
    `pnpm --filter api run test -- --run src/modules/wallets/wallets.e2e.test.ts --sequence.concurrent=false`
    (`17/17`).
  - PASS: `pnpm --filter api run typecheck`.
  - PASS: `pnpm run quality:guardrails`.
  - PASS: `pnpm run lint`.
  - PASS: `git diff --check`.
- Manual checks: code-path and regression review only.
- High-risk checks: analytics source validation uses the Prisma enum directly.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: free-form source filter is cast to enum after parsing.
- Gap: API boundary does not own the source enum contract.
- Architecture constraint: analytics filters should be typed at DTO level.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-21`.
- Priority rationale: small API hardening that prevents unstable dashboard
  filter behavior.

### 3. Plan Implementation
- Use `z.nativeEnum(WalletCashflowSource)` in `WalletAnalyticsQuerySchema`.

### 4. Execute Implementation
- Implementation notes: changed `WalletAnalyticsQuerySchema.source` from a
  free-form string to `z.nativeEnum(WalletCashflowSource)`.

### 5. Verify and Test
- Validation performed: failing-then-passing focused wallet regression, API
  typecheck, guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Technical debt introduced: no.
- Architecture alignment: yes; source filtering now belongs to the DTO
  boundary and reuses the canonical persistence enum.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-wallets.md`,
  `docs/planning/mvp-next-commits.md`, and
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/TASK_BOARD.md` and
  `.codex/context/PROJECT_STATE.md`.

## Result Report
- Task summary: wallet analytics source filters now fail closed before Prisma
  when an unknown value is provided.
- Files changed: wallet DTO schema, wallet e2e test, wallet module docs,
  planning queue, execution plan, task board, and project state.
- How tested: focused wallets e2e (`17/17`), API typecheck, repository
  guardrails, lint, and diff review.
- What is incomplete: nothing in this slice.
