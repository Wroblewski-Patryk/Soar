# Task

## Header
- ID: RUNTIME-AUDIT-113
- Title: Include PAPER bot-closed position PnL in wallet analytics
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-108
- Priority: P1
- Iteration: 113
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PAPER bot positions are now persisted in bot scope with `Position.walletId=null`
while retaining wallet attribution through `Bot.walletId`. Wallet open-PnL reads
already include those positions through the bot relation, but wallet realized
PnL analytics still rely only on wallet cashflow events. PAPER runtime closes
persist realized PnL on positions/trades and do not create exchange cashflow
events.

## Goal
Make wallet performance summary and equity timeline reflect PAPER bot-closed
position realized PnL through the existing position read model.

## Success Signal
- User or operator problem: wallet dashboard can under-report realized PnL after
  a PAPER bot closes a bot-scoped position.
- Expected product or reliability outcome: PAPER wallet analytics match bot
  position lifecycle truth.
- How success will be observed: focused wallet unit tests cover direct and
  bot-owned PAPER closed position realized-PnL scope.
- Post-launch learning needed: no

## Deliverable For This Stage
Closed implementation, verification, documentation, and commit-ready evidence
for PAPER realized PnL wallet analytics.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/wallets/wallets.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Add a wallet realized-PnL position scope for PAPER closed, synced positions
   owned directly by the wallet or by bots using the wallet.
2. Add the PAPER position realized PnL into wallet summary and timeline
   realized-PnL values without changing LIVE cashflow behavior.
3. Add focused tests for the scope, including date-window filtering.
4. Run wallet unit tests plus typecheck, guardrails, lint, and diff review.
5. Update task, project state, and queue docs.

## Acceptance Criteria
- PAPER wallet analytics include closed synced bot-owned position realized PnL.
- LIVE wallet realized-PnL behavior remains cashflow-based and unchanged.
- Date filters apply to PAPER closed position realized PnL by `closedAt`.
- Existing wallet open-PnL and reset scopes remain unchanged.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` standards are satisfied for this slice.
- [x] Focused tests pass.
- [x] Typecheck, guardrails, and lint pass.
- [x] Documentation and queue state are updated.

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
- Tests: `pnpm --filter api exec vitest run src/modules/wallets/wallets.service.test.ts` (`5/5`), `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`, `pnpm run lint`
- Manual checks: diff review
- Screenshots/logs: not applicable
- High-risk checks: ownership scope remains userId + wallet/bot-wallet bound

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/README.md`,
  `docs/architecture/architecture-source-of-truth.md`,
  `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore prior wallet analytics behavior
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: PAPER close persists realized PnL on positions/trades but wallet
  analytics read realized PnL only from wallet cashflow events.
- Gaps: bot-scoped PAPER closed positions can be absent from wallet realized-PnL
  dashboard totals.
- Inconsistencies: wallet open PnL already follows bot-wallet scope; realized
  PnL does not.
- Architecture constraints: read models must remain mode-aware and fail closed
  by user and wallet ownership.

### 2. Select One Priority Task
- Selected task: include PAPER bot-closed position realized PnL in wallet
  analytics.
- Priority rationale: dashboard wallet values must reflect runtime lifecycle
  truth for PAPER and LIVE parity.
- Why other candidates were deferred: broader exchange import and automation
  audits continue in later one-slice iterations.

### 3. Plan Implementation
- Files or surfaces to modify: wallet service, wallet unit tests, source-of-truth
  planning/context docs.
- Logic: aggregate PAPER closed synced positions by direct wallet or bot-wallet
  ownership and add that value to existing cashflow realized-PnL totals.
- Edge cases: date filtering, stale non-synced rows, open rows, LIVE cashflows.

### 4. Execute Implementation
- Implementation notes: added `buildWalletClosedPaperPositionPnlWhere`, summary
  aggregation, and timeline cumulative aggregation for PAPER closed synced
  positions owned by the wallet or by bots using the wallet.

### 5. Verify and Test
- Validation performed: focused wallet unit test, API typecheck, guardrails,
  lint, and diff review.
- Result: passed.

### 6. Self-Review
- Simpler option considered: writing cashflow events on PAPER close was
  considered broader and more invasive; read-model aggregation is the smallest
  current contract fix.
- Technical debt introduced: no
- Scalability assessment: bounded to wallet analytics queries and PAPER mode
  only; LIVE remains cashflow-based.
- Refinements made: kept ownership and date-window scope centralized in one
  helper.

### 7. Update Documentation and Knowledge
- Docs updated: task contract, MVP queue, task board, project state.
- Context updated: yes
- Learning journal updated: not applicable

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

## Notes
This is a read-model parity fix only. It does not change order execution,
position persistence, or exchange cashflow classification.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`: Goal, Scope, Implementation Plan, Acceptance Criteria,
Definition of Done, and Result Report.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused wallet read-model unit tests.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator using PAPER wallets/bots
- Existing workaround or pain: wallet dashboard under-reports closed PAPER bot
  results.
- Smallest useful slice: wallet analytics read-model parity for closed PAPER
  positions.
- Success metric or signal: focused tests pass and wallet analytics scope is
  mode-aware.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: wallet dashboard performance summary and equity
  timeline.
- SLI: wallet analytics request returns ownership-scoped values.
- SLO: no change.
- Error budget posture: not applicable
- Health/readiness check: no change.
- Logs, dashboard, or alert route: no change.
- Smoke command or manual smoke: focused unit tests.
- Rollback or disable path: revert this commit.

## AI Testing Evidence
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading and wallet analytics data.
- Trust boundaries: userId and wallet/bot ownership.
- Permission or ownership checks: position query remains constrained by
  `userId` and wallet or bot wallet relation.
- Abuse cases: another user's or another wallet's positions must not be counted.
- Secret handling: none.
- Security tests or scans: typecheck and focused unit scope assertion.
- Fail-closed behavior: only synced closed rows with realized PnL are counted.
- Residual risk: DB-backed e2e remains dependent on local PostgreSQL
  availability.

## Result Report

- Task summary: PAPER wallet summary and equity timeline now include realized
  PnL from closed synced positions owned directly by the wallet or by bots that
  use the wallet.
- Files changed: `apps/api/src/modules/wallets/wallets.service.ts`,
  `apps/api/src/modules/wallets/wallets.service.test.ts`, planning/context
  docs.
- How tested: focused wallet unit test (`5/5`), API typecheck, guardrails,
  lint, and diff review.
- What is incomplete: DB-backed dashboard e2e was not run because previous
  local PostgreSQL-backed suites have been unavailable in this environment.
- Next steps: continue auditing remaining runtime/dashboard parity drifts.
- Decisions made: keep LIVE wallet realized PnL cashflow-based and add
  position-based realized PnL only for PAPER.
