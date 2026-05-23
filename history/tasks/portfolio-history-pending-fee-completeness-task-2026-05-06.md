# Task

## Header
- ID: PMPLC-44
- Title: Mark portfolio history partial when scoped fees are pending
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-43
- Priority: P0
- Iteration: 44
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-28 through PMPLC-43 hardened LIVE exchange fee reconciliation so
unsettled fee truth remains visible through `feePending`. Portfolio history
used realized PnL from runtime aggregates and closed positions, but did not
mark the history as provisional when scoped trades still had pending fee
reconciliation.

## Goal
Prevent portfolio history from presenting provisional LIVE PnL as `COMPLETE`
while any scoped runtime trade fee is still pending reconciliation.

## Scope
- `apps/api/src/modules/bots/botPortfolioHistoryRead.service.ts`
- `apps/api/src/modules/bots/bots.portfolio-history.e2e.test.ts`
- planning and context source-of-truth files

## Success Signal
- User or operator problem: portfolio history can look complete even while
  fee-adjusted money truth is still provisional.
- Expected product or reliability outcome: portfolio history remains usable,
  but marks completeness as `PARTIAL` with `FEE_RECONCILIATION_PENDING`.
- How success will be observed: LIVE portfolio history e2e regression with a
  scoped `Trade.feePending=true` returns `PARTIAL`.
- Post-launch learning needed: no

## Deliverable For This Stage
Post-release evidence that PMPLC-44 is implemented, verified, reviewed, and
documented.

## Constraints
- Do not change PnL math in this slice.
- Reuse existing `feePending` truth from `Trade`.
- Keep the check scoped to the bot's configured symbols and LIVE wallet
  fallback ownership boundary.
- Do not introduce new response fields.

## Acceptance Criteria
- Portfolio history remains `COMPLETE` for settled LIVE history.
- Portfolio history becomes `PARTIAL` when a scoped trade has `feePending=true`.
- The reason list includes `FEE_RECONCILIATION_PENDING`.
- Existing portfolio history regressions remain green.

## Definition of Done
- [x] Regression fails before the fix and passes after it.
- [x] Existing architecture path is reused.
- [x] Relevant validations pass.
- [x] Source-of-truth documentation is updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New systems without approval.
- Temporary bypasses or fake completeness state.
- Recomputing realized PnL in the portfolio history read model.
- Silently ignoring scoped `feePending=true` rows.

## Validation Evidence
- Tests:
  - Pre-fix `pnpm --filter api run test -- src/modules/bots/bots.portfolio-history.e2e.test.ts -t "marks LIVE history partial while scoped trade fees are pending reconciliation" --run --sequence.concurrent=false` FAILED as expected: `completeness=COMPLETE` instead of `PARTIAL`.
  - Post-fix focused regression PASS (`1/1`).
  - `pnpm --filter api run test -- src/modules/bots/bots.portfolio-history.e2e.test.ts --run --sequence.concurrent=false` PASS (`4/4`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
- Manual checks: reviewed scope for configured symbols, direct bot ownership,
  and LIVE wallet imported-trade fallback.
- Screenshots/logs: not applicable.
- High-risk checks: money-impacting provisional PnL completeness regression included.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/reference/live-fee-reconciliation-contract.md`
  - `docs/modules/system-modules.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the PMPLC-44 commit to restore prior portfolio
  completeness behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: portfolio history did not inspect scoped pending trade fees before
  declaring completeness.
- Gaps: no regression connected `Trade.feePending` to portfolio history
  completeness.
- Inconsistencies: runtime trades could visibly show `feePending=true`, while
  portfolio history still said `COMPLETE`.
- Architecture constraints: LIVE fee lag must remain operator-visible; read
  models should not hide provisional money truth.

### 2. Select One Priority Task
- Selected task: PMPLC-44 portfolio history fee-pending completeness.
- Priority rationale: it is a user-facing money read model and can otherwise
  overstate confidence in provisional PnL.
- Why other candidates were deferred: an adjacent aggregate imported-position
  failure was found during validation and queued as PMPLC-45 rather than mixed
  into this slice.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `botPortfolioHistoryRead.service.ts`
  - `bots.portfolio-history.e2e.test.ts`
  - source-of-truth docs
- Logic: query for one scoped `Trade.feePending=true` inside the portfolio
  history window and set `completeness=PARTIAL` with a fee reconciliation reason.
- Edge cases: keep `UNAVAILABLE` capital snapshot behavior unchanged; allow
  multiple partial reasons when open PnL and pending fees both exist.

### 4. Execute Implementation
- Implementation notes: added a scoped pending-fee read using the same bot and
  LIVE wallet fallback shape as portfolio history closed positions.

### 5. Verify and Test
- Validation performed: focused regression, full portfolio-history e2e, API
  typecheck, repository guardrails, and lint.
- Result: all PMPLC-44 validations passed.

### 6. Self-Review
- Simpler option considered: infer pending from aggregate trade items. Rejected
  because aggregate trade items can be paged/limited and may miss pending rows.
- Technical debt introduced: no
- Scalability assessment: `findFirst` is bounded by user, window, symbols, and
  ownership scope.
- Refinements made: preserved existing response shape and completeness enum.

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
PMPLC-44 is DONE. Portfolio history now marks LIVE history as partial while
scoped trade fees are still pending reconciliation.

## Notes
Adjacent follow-up discovered during validation: `bots.monitoring-aggregate`
currently fails the imported closed-position summary regression
(`0` realized PnL instead of `37.5`) when the imported closed position is
`ORPHAN_LOCAL` / `EXTERNAL_CLOSE_CONFIRMED` and has no trade rows. This is
queued as PMPLC-45.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes, no response-shape change
- DB schema and migrations verified: yes, no schema change
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: e2e reads persisted DB state
- Regression check performed: yes

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: trading and account-derived financial data
- Trust boundaries: read-only dashboard API over authenticated user-owned data
- Permission or ownership checks: query scoped by `userId`, bot id, wallet
  fallback, and configured symbols
- Abuse cases: another user's pending fees must not affect completeness
- Secret handling: no secret changes
- Security tests or scans: ownership isolation remains covered by existing
  portfolio-history e2e
- Fail-closed behavior: pending fee marks history partial rather than complete
- Residual risk: PMPLC-45 aggregate imported closed-position regression remains
  queued
