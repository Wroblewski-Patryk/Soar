# Task

## Header
- ID: RUNTIME-AUDIT-53
- Title: Preserve portfolio history close points beyond monitoring row limits
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-52
- Priority: P1
- Iteration: 71
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The portfolio history endpoint used the runtime monitoring aggregate as its
source for closed position points. That aggregate intentionally limits visible
position rows with `perSessionLimit`, while its summaries are full-count
read-models. When a bot had more closed positions than the visible row cap, the
portfolio history summary could report full realized PnL and closed-count truth
while the close-point series stayed truncated.

## Goal
Make portfolio history close points reflect the full scoped closed-position
truth for the bot instead of the monitoring UI row limit.

## Scope
- `apps/api/src/modules/bots/botPortfolioHistoryRead.service.ts`
- `apps/api/src/modules/bots/bots.portfolio-history.e2e.test.ts`
- Planning and canonical context docs for this iteration.

## Success Signal
- User or operator problem: dashboard history can under-display realized close
  events even though summaries are correct.
- Expected product or reliability outcome: portfolio history close points,
  realized PnL, and closed-position count stay aligned.
- How success will be observed: a regression with 501 closed PAPER positions
  returns 501 close points.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified code and regression coverage for complete portfolio close-point
history beyond monitoring row caps.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Keep aggregate summary and capital source handling unchanged.
2. Resolve the bot's active configured symbol scope using the existing symbol
   catalog resolver and normalization pipeline.
3. Query scoped closed BOT-managed positions directly for the portfolio point
   series, bounded by the same portfolio window.
4. Preserve LIVE legacy wallet-owned imported rows that have `botId = null` and
   match the bot wallet.
5. Add a regression that fails when close points come only from the 500-row
   monitoring aggregate.

## Acceptance Criteria
- Portfolio history returns all scoped close points in the window.
- The current point still reflects full realized PnL.
- The endpoint keeps ownership isolation.
- No architecture bypass or duplicate runtime system is introduced.

## Definition of Done
- [x] Regression test proves the 501-close case.
- [x] API typecheck passes.
- [x] Repository guardrails and lint pass.
- [x] Diff review confirms scope is limited to portfolio close-point truth and docs.

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
- Tests: PASS
  - `pnpm --filter api run test -- src/modules/bots/bots.portfolio-history.e2e.test.ts --run --sequence.concurrent=false`
    (`3/3`)
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
  - `pnpm run lint`
- Manual checks: diff review confirmed the endpoint now uses scoped closed
  positions for point history while preserving aggregate summary/capital logic.
- Screenshots/logs: not applicable
- High-risk checks: scoped DB query keeps user, bot/wallet, management mode,
  status, symbol scope, and portfolio window filters.

## Architecture Evidence
- Architecture source reviewed: `docs/governance/autonomous-engineering-loop.md`,
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
  `docs/planning/mvp-next-commits.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore prior aggregate-row based
  portfolio points.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: portfolio close points were composed from `aggregate.positions.historyItems`.
- Gaps: aggregate visible history rows are capped independently from full
  summary totals.
- Inconsistencies: close-point series could contain 500 rows while summary
  counts and realized PnL reflected more closed positions.
- Architecture constraints: dashboard read models must reflect runtime truth and
  preserve bot ownership isolation.

### 2. Select One Priority Task
- Selected task: preserve portfolio history close points beyond monitoring row
  limits.
- Priority rationale: it is a dashboard/runtime truth drift and a small,
  reversible fix.
- Why other candidates were deferred: live missing-entry import remains an
  explicit fail-closed behavior covered by an existing test and needs product
  decision before changing.

### 3. Plan Implementation
- Files or surfaces to modify: portfolio history service, portfolio history e2e
  test, planning/context docs.
- Logic: use direct scoped closed-position truth for point series while keeping
  aggregate summaries for capital and counts.
- Edge cases: active market-group symbol scope, PAPER and LIVE modes, legacy
  botless wallet-owned LIVE rows, empty symbol scope.

### 4. Execute Implementation
- Implementation notes: portfolio history now resolves the bot's configured
  symbol scope through the existing catalog resolver, then reads all scoped
  closed BOT-managed positions in the portfolio window for close points.

### 5. Verify and Test
- Validation performed: focused portfolio history e2e, API typecheck,
  repository guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: marking history as partial when rows are capped.
- Technical debt introduced: no
- Scalability assessment: the query is bounded by user, bot/wallet ownership,
  status, symbol scope, and portfolio window.
- Refinements made: kept monitoring aggregate limits unchanged and limited the
  service change to portfolio close-point composition.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, task board, project state, next-commits queue.
- Context updated: yes.
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

## Notes
The change intentionally does not alter monitoring list limits. It only makes
the portfolio history endpoint use complete close-point truth for its chart
series.

## Production-Grade Required Contract
- Goal: preserve portfolio history close-point truth beyond monitoring row caps.
- Scope: API portfolio history service, e2e regression, planning/context docs.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: follows `DEFINITION_OF_DONE.md` through focused
  regression, typecheck, guardrails, lint, and self-review.
- Result Report: complete.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: PASS, 501 closed positions return 501 close
  points.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard bot operator.
- Existing workaround or pain: no reliable way to see complete close-point
  history when visible monitoring rows are capped.
- Smallest useful slice: use complete scoped closed positions for portfolio
  points.
- Success metric or signal: 501-close regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: dashboard portfolio history review.
- SLI: endpoint returns a complete scoped close-point series for the requested
  bot window.
- SLO: not separately defined.
- Error budget posture: not applicable
- Health/readiness check: unaffected.
- Logs, dashboard, or alert route: existing API logs.
- Smoke command or manual smoke: focused e2e regression.
- Rollback or disable path: revert commit.

## AI Testing Evidence
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user-owned trading runtime and wallet metadata.
- Trust boundaries: authenticated API request to owned bot only.
- Permission or ownership checks: `getOwnedBotWithStrategyProjection` plus
  `userId` filters on direct DB query.
- Abuse cases: cross-user and cross-bot history leakage.
- Secret handling: no secrets touched.
- Security tests or scans: ownership isolation remains covered by existing LIVE
  portfolio history test.
- Fail-closed behavior: returns 404 for unowned bot as before.
- Residual risk: high-volume history can increase endpoint work for bots with
  very long histories; query is scoped and ordered.

## Result Report
- Task summary: portfolio history close points no longer depend on capped
  monitoring aggregate rows.
- Files changed:
  - `apps/api/src/modules/bots/botPortfolioHistoryRead.service.ts`
  - `apps/api/src/modules/bots/bots.portfolio-history.e2e.test.ts`
  - `history/audits/runtime-audit-53-portfolio-history-close-points-limit-task-2026-05-03.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused e2e (`3/3`), API typecheck, guardrails, lint.
- What is incomplete: nothing for this slice.
- Next steps: continue auditing runtime/dashboard read-model drift in the next
  iteration.
- Decisions made: keep the existing fail-closed missing-entry live import rule
  unchanged because it is explicitly covered by current tests.
