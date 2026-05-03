# RUNTIME-AUDIT-16 LIVE Open Order Wallet Null Task - 2026-05-03

## Header
- ID: RUNTIME-AUDIT-16
- Title: Keep selected LIVE bot legacy open orders visible when wallet projection is null
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-15
- Priority: P1
- Iteration: 34
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator-reported dashboard/runtime audit continues across selected-bot
LIVE/PAPER position management. Runtime positions and trades already tolerate
selected-bot LIVE lifecycle rows where older rows have `walletId=null`, but
runtime open-order read scope required exact `walletId` for LIVE bots.

## Goal
Make the selected-bot runtime positions dashboard show open pending orders that
belong to the selected LIVE bot even when legacy order rows have no wallet
projection.

## Success Signal
- User or operator problem: dashboard open-order state can disappear even while
  a selected LIVE bot has an active order row.
- Expected product or reliability outcome: dashboard open orders reflect the
  same selected-bot ownership compatibility used by positions and trades.
- How success will be observed: regression test shows `openOrdersCount=1` for a
  `BOT_MANAGED` LIVE order with selected `botId` and `walletId=null`.
- Post-launch learning needed: yes.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-takeover.e2e.test.ts`
- `docs/modules/api-bots.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add failing e2e coverage for selected LIVE bot open order visibility when
   the persisted order has `walletId=null`.
2. Align `botScopedOrderWhere` with the existing selected LIVE bot position
   scope: direct `botId` plus `walletId=current` or `walletId=null`.
3. Keep external-owned order scope unchanged.
4. Run focused and broader runtime/bots validation, then sync docs/context.

## Acceptance Criteria
- Selected LIVE bot open orders with `botId=<selected>` and `walletId=null`
  appear in runtime positions open-order payload.
- Orders from other bots remain excluded because `botId` remains required.
- PAPER behavior is unchanged.
- External-owned order behavior is unchanged.

## Definition of Done
- [x] Failing regression is captured and fixed.
- [x] Focused runtime takeover e2e passes.
- [x] Broader relevant runtime positions/read tests pass.
- [x] Typecheck, lint, guardrails, and diff review pass.
- [x] Source-of-truth docs are updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Broad wallet-only order visibility.
- Showing orders for another bot.
- Changing external exchange execution behavior.
- New read-model systems or duplicate order queries.

## Validation Evidence
- Tests:
  - Initial focused regression before fix failed as expected:
    `openOrdersCount` was `0` instead of `1`.
  - `pnpm --filter api run test -- --run src/modules/bots/bots.runtime-takeover.e2e.test.ts --sequence.concurrent=false` => PASS (`4/4`).
  - `pnpm --filter api run test -- --run src/modules/bots/bots.runtime-takeover.e2e.test.ts src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.runtime-strategy-context.e2e.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts --sequence.concurrent=false` => PASS (`33/33`).
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm run lint` => PASS.
- Manual checks: diff review pending final `git diff --check`.
- Screenshots/logs: not applicable.
- High-risk checks: direct order visibility remains selected-bot scoped; no
  wallet-only or user-wide order visibility was added.

## Architecture Evidence
- Architecture source reviewed: `docs/modules/api-bots.md`,
  `docs/architecture/06_execution-lifecycle.md`,
  `docs/architecture/08_operator-surfaces-and-routing.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: `docs/modules/api-bots.md`.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore exact LIVE order wallet filtering.
- Observability or alerting impact: dashboard open-order count becomes more
  complete for selected LIVE bots with legacy rows.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: LIVE selected-bot runtime open-order reads required exact wallet
  projection while positions and trades already accept legacy `walletId=null`.
- Gaps: no e2e covered an open `BOT_MANAGED` order with selected `botId` and
  missing wallet projection.
- Inconsistencies: dashboard could show zero open orders while a selected LIVE
  bot had an active order row.
- Architecture constraints: preserve bot ownership, active symbol scope, and
  existing order read repository.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-16`.
- Priority rationale: operator asked for dashboard truth parity; missing open
  orders are directly visible and affect position-management trust.
- Why other candidates were deferred: broad null/null trade history needs a
  separate ownership-proof design and was not changed.

### 3. Plan Implementation
- Files or surfaces to modify: runtime positions read service, focused e2e,
  bots docs and planning/context docs.
- Logic: for selected LIVE bots with a wallet, filter direct bot open orders by
  `botId` plus `walletId=current OR walletId=null`.
- Edge cases: other-bot rows remain excluded, external-owned exchange-sync order
  scope remains unchanged, PAPER still uses direct `botId`.

### 4. Execute Implementation
- Implementation notes: aligned selected LIVE bot open-order predicate with
  selected LIVE bot position predicate by allowing `walletId=current` or
  `walletId=null` only when `botId` matches the selected bot.

### 5. Verify and Test
- Validation performed: failing regression before fix, focused runtime takeover
  e2e after fix, broader runtime positions/read pack, API typecheck,
  guardrails, and lint.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: wallet-only OR. Rejected because it would broaden
  visibility beyond selected bot ownership.
- Technical debt introduced: no.
- Scalability assessment: reuses existing scoped Prisma predicate pattern.
- Refinements made: kept external-owned order scope unchanged to avoid
  broadening imported order visibility without proof.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-bots.md`,
  `docs/planning/runtime-audit-16-live-open-order-wallet-null-task-2026-05-03.md`,
  `docs/planning/mvp-next-commits.md`,
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable.

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
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes.
- Real API/service path used: yes, `/dashboard/bots/:id/runtime-sessions/:sessionId/positions`.
- Endpoint and client contract match: yes.
- DB schema and migrations verified: no schema change.
- Loading state verified: not applicable.
- Error state verified: unchanged.
- Refresh/restart behavior verified: runtime session read e2e covers persisted
  dashboard read after row creation.
- Regression check performed: focused failing-then-passing runtime takeover
  e2e and broader runtime read pack.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes.
- Data classification: user trading lifecycle data.
- Trust boundaries: authenticated dashboard user, selected bot, selected LIVE
  wallet.
- Permission or ownership checks: route ownership unchanged; order query remains
  scoped by user, selected bot, configured symbols, management mode, and open
  statuses.
- Abuse cases: another bot's order with the same wallet must not appear.
- Secret handling: none.
- Security tests or scans: relevant e2e/service tests, typecheck, lint, and
  repository guardrails passed.
- Fail-closed behavior: non-selected bot rows stay excluded.
- Residual risk: legacy rows without `botId` still require the external-owned
  path and are not broadened by this task.

## Result Report
- Task summary: selected LIVE bot runtime position payload now includes direct
  open orders with legacy `walletId=null` rows.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-takeover.e2e.test.ts`
  - `docs/modules/api-bots.md`
  - `docs/planning/runtime-audit-16-live-open-order-wallet-null-task-2026-05-03.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- How tested: failing regression before fix, focused and broader runtime-read
  tests, API typecheck, guardrails, lint, and diff review.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue auditing dashboard/runtime lifecycle visibility without
  widening ambiguous null/null ownership scopes.
- Decisions made: selected bot identity remains mandatory for direct legacy
  order visibility.
