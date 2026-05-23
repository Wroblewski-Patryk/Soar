# Task

## Header
- ID: RUNTIME-AUDIT-13
- Title: Reuse owned imported LIVE positions during fill lifecycle
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-12
- Priority: P0
- Iteration: 31
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Manual LIVE open now fails closed when the selected bot attempts to reverse an
owned imported exchange position. The downstream fill lifecycle still searches
for an existing position through the direct wallet/bot scope only, so a
same-side fill can create a second local position instead of attaching to the
already imported exchange-synced position.

## Goal
Ensure filled selected-bot LIVE orders reuse and reprice a deterministically
owned imported `EXCHANGE_SYNC` / `BOT_MANAGED` open position before creating a
new local position.

## Scope
- `apps/api/src/modules/orders/orders.lifecycle.service.ts`
- `apps/api/src/modules/orders/orders.service.test.ts`
- `docs/modules/api-orders.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: dashboard should not show duplicate positions after
  a LIVE fill adds to an exchange position already imported for the selected
  bot.
- Expected product or reliability outcome: order fill lifecycle, dashboard
  reads, and external ownership proof converge on one open position row.
- How success will be observed: regression test confirms the filled order
  attaches to the imported position and no duplicate position is created.
- Post-launch learning needed: no.

## Deliverable For This Stage
Implement the smallest lifecycle reuse path, add regression coverage, and
record validation evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Keep the current direct scoped-position reuse path unchanged.
2. When no direct scoped position is found, resolve selected LIVE bot ownership
   through wallet-first API-key ownership proof.
3. Reuse same-side imported `EXCHANGE_SYNC` / `BOT_MANAGED` open positions
   with `botId=null` and either matching wallet or legacy `walletId=null`.
4. Update quantity and entry price through existing fill math, attach the order
   to the reused position, and avoid creating a duplicate position row.
5. Add a DB-backed regression for a filled LIVE same-side order and owned
   imported position.

## Acceptance Criteria
- Filled LIVE same-side order links to the owned imported position.
- Position quantity and entry price are recalculated with existing fill math.
- No extra open position is created for that symbol/user.
- Unowned, ambiguous, manual-only, PAPER, or other-wallet positions remain
  outside this reuse path.

## Definition of Done
- [x] Relevant tests pass.
- [x] Typecheck, guardrails, lint, and diff check pass.
- [x] Docs and context files record the completed slice and evidence.

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
  - `pnpm --filter api run test -- --run src/modules/orders/orders.service.test.ts --sequence.concurrent=false`
    PASS (`28/28`).
  - `pnpm --filter api run test -- --run src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/engine/preTrade.service.test.ts src/modules/engine/preTrade.e2e.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts --sequence.concurrent=false`
    PASS (`90/90`).
- Manual checks:
  - reviewed lifecycle diff for direct-first reuse, ownership-proof gating, and
    no global position-scope widening.
- Screenshots/logs: not applicable.
- High-risk checks:
  - regression proves same-side LIVE fill attaches to the imported position,
    updates quantity/entry price, links order fills, and leaves one open row.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/api-orders.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: orders module contract update only.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this lifecycle/test/doc commit.
- Observability or alerting impact: existing order/position state only.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: fill lifecycle searched only direct scoped open positions.
- Gaps: owned imported LIVE positions could be invisible during same-side
  filled order lifecycle.
- Inconsistencies: pre-trade, runtime reads, final-candle guards, and manual
  open guard already use deterministic imported ownership proof.
- Architecture constraints: `order -> fill -> position` lifecycle remains the
  canonical position-open/update authority.

### 2. Select One Priority Task
- Selected task: reuse owned imported positions during filled order lifecycle.
- Priority rationale: P0 money-impacting duplication and dashboard truth drift.
- Why other candidates were deferred: additional runtime/dashboard audits
  remain queued, but this is the smallest write-path parity slice after
  RUNTIME-AUDIT-12.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: direct reuse first; owned imported LIVE reuse second; create only when
  neither exists.
- Edge cases: missing API key, unowned/ambiguous/manual-only ownership,
  opposite side, PAPER mode, other wallet.

### 4. Execute Implementation
- Implementation notes:
  - extracted reusable-position fill update helper so direct and owned-import
    reuse share the same fill math and conflict behavior.
  - added LIVE owned imported lookup after direct scoped lookup misses.
  - required wallet-first API-key ownership proof for the same bot and wallet
    before reusing `botId=null` imported rows.

### 5. Verify and Test
- Validation performed:
  - focused orders service pack.
  - broader orders positions e2e plus pre-trade/final-candle/defaults pack.
  - repository typecheck, guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: globally widening `resolveOpenPositionScopeWhere`;
  rejected because it can merge unrelated wallet/bot positions.
- Technical debt introduced: no.
- Scalability assessment: one ownership-index lookup only when a filled order
  has no direct reusable position.
- Refinements made:
  - kept PAPER and direct scoped behavior unchanged.
  - kept unowned, ambiguous, manual-only, or other-wallet imports outside the
    reuse path.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/modules/api-orders.md`
  - this planning task
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
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
- Real API/service path used: yes, `openOrder` plus fill lifecycle.
- Endpoint and client contract match: yes, unchanged.
- DB schema and migrations verified: yes, no schema change.
- Loading state verified: not applicable.
- Error state verified: existing typed conflict path preserved.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: yes.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes.
- Data classification: trading lifecycle and exchange-account metadata.
- Trust boundaries: authenticated user, selected bot, wallet/API-key ownership,
  imported exchange position rows.
- Permission or ownership checks: deterministic API-key + symbol owner proof.
- Abuse cases: filled order incorrectly attaches to another wallet/bot import.
- Secret handling: API-key ids only; no secret reads or writes.
- Security tests or scans: ownership-scoped regression.
- Fail-closed behavior: opposite side remains conflict.
- Residual risk: exchange reconciliation remains authority for later exchange
  drift corrections.

## Result Report
- Task summary: filled selected-bot LIVE orders now reuse same-side owned
  imported positions instead of creating duplicate open positions.
- Files changed:
  - `apps/api/src/modules/orders/orders.lifecycle.service.ts`
  - `apps/api/src/modules/orders/orders.service.test.ts`
  - `docs/modules/api-orders.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - this planning task
- How tested:
  - focused orders pack (`28/28`)
  - broader orders/e2e/pre-trade/final-candle/defaults pack (`90/90`)
  - typecheck, guardrails, lint, diff check
- What is incomplete: nothing for this slice.
- Next steps: continue the operator-requested audit with the next smallest
  LIVE/PAPER dashboard/runtime drift.
- Decisions made: reuse ownership proof rather than widening generic position
  scope.
