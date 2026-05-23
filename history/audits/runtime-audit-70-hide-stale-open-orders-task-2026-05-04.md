# Task

## Header
- ID: RUNTIME-AUDIT-70
- Title: Hide stale exchange-synced open orders from runtime dashboard
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-69
- Priority: P1
- Iteration: 70
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
LIVE open-order reconciliation marks exchange-synced order rows as
`ORPHAN_LOCAL` when a successful exchange open-order snapshot no longer
contains them. The runtime dashboard open-order read model filters by open
status but not sync state, so stale rows can remain visible as active orders.

## Goal
Ensure stale exchange-synced open orders no longer appear as active dashboard
open orders and future stale marking moves rows out of active open status.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: dashboard should not show stale exchange-synced
  orders as still open after exchange no longer reports them.
- Expected product or reliability outcome: dashboard open-order count reflects
  current confirmed order state.
- How success will be observed: focused tests prove `ORPHAN_LOCAL` open rows
  are excluded and stale marking changes rows to a non-open state.
- Post-launch learning needed: yes

## Deliverable For This Stage
Implement focused read-path and reconciliation stale-state hardening with tests.

## Constraints
- Reuse existing `syncState` and `OrderStatus` fields.
- Do not add migrations or a new order lifecycle model in this slice.
- Do not hide normal BOT/EXCHANGE_SYNC `IN_SYNC` open rows.
- Keep production services within guardrail budgets.

## Implementation Plan
1. Add dashboard regression for an `ORPHAN_LOCAL` exchange-synced open-order row.
2. Add reconciliation default-deps regression for stale open-order marking.
3. Filter runtime open-order reads to active sync states.
4. Move stale synced open orders to `CANCELED` and `ORPHAN_LOCAL`.
5. Run focused tests, typecheck, guardrails, lint, and diff review.
6. Sync source-of-truth docs.

## Acceptance Criteria
- Runtime dashboard excludes `ORPHAN_LOCAL` exchange-synced orders from
  `openOrders` and `openOrdersCount`.
- Runtime dashboard continues to include `IN_SYNC` open orders.
- Reconciliation stale marking sets `syncState = ORPHAN_LOCAL` and a non-open
  order status.
- No unrelated position or trade reconciliation behavior changes.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` applicable items are satisfied with evidence.
- [x] Focused dashboard and reconciliation regressions pass.
- [x] API typecheck, guardrails, lint, and diff review pass.
- [x] Source-of-truth docs are updated.

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
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run` => PASS (`15/15`)
  - `pnpm --filter api run test -- src/modules/positions/livePositionReconciliation.service.test.ts --run` => PASS (`28/28`)
  - `pnpm --filter api run typecheck` => PASS
  - `pnpm run quality:guardrails` => PASS
  - `pnpm run lint` => PASS
  - `git diff --check` => PASS
- Manual checks: code review of active open-order filters and stale-order
  reconciliation update
- Screenshots/logs: not applicable
- High-risk checks: dashboard excludes existing `ORPHAN_LOCAL` open rows and
  reconciliation moves stale rows to non-open `CANCELED`

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/runtime-signal-merge-contract.md`
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
- Rollback note: revert this commit to restore previous stale-order visibility.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: stale open synced orders can remain dashboard-visible because status
  stays open and read filters ignore `syncState`.
- Gaps: no separate unresolved order display exists in V1 dashboard, so stale
  rows must fail closed from active open-order widgets.
- Inconsistencies: reconciliation detects the order as absent from exchange,
  while dashboard can still display it as open.
- Architecture constraints: runtime dashboard must reflect confirmed persisted
  lifecycle state and fail closed for LIVE ownership/state ambiguity.

### 2. Select One Priority Task
- Selected task: hide stale exchange-synced open orders.
- Priority rationale: direct dashboard management-state correctness.
- Why other candidates were deferred: richer stale-order history/status UX is a
  future product slice, not needed to stop false active counts.

### 3. Plan Implementation
- Files or surfaces to modify: runtime positions read service, live
  reconciliation service, focused tests, source-of-truth docs.
- Logic: active dashboard order queries require `syncState = IN_SYNC`; stale
  marking sets `status = CANCELED` and `syncState = ORPHAN_LOCAL`.
- Edge cases: normal BOT orders default to `IN_SYNC`; existing `ORPHAN_LOCAL`
  rows are hidden even if status is still open.

### 4. Execute Implementation
- Implementation notes: runtime open-order reads now require `syncState =
  IN_SYNC`; stale exchange-synced order marking now writes `status = CANCELED`
  with `syncState = ORPHAN_LOCAL`.

### 5. Verify and Test
- Validation performed: focused dashboard runtime-scope e2e, focused live
  reconciliation suite, API typecheck, repository guardrails, lint, and diff
  whitespace check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only changing stale marking, but existing stale
  rows would remain visible until rewritten.
- Technical debt introduced: no
- Scalability assessment: sufficient for V1 dashboard truth; unresolved-order
  audit UI can be added later.
- Refinements made: compressed the stale-order Prisma update after guardrails
  caught a production service line-budget regression; final service length is
  996 lines.

### 7. Update Documentation and Knowledge
- Docs updated: this task, MVP next commits queue.
- Context updated: task board and project state.
- Learning journal updated: not applicable

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
This task treats stale exchange-synced orders as not active for V1 dashboard.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: persisted DB read/write path
- Regression check performed: focused dashboard and reconciliation regressions

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE bot operator reading dashboard order state
- Existing workaround or pain: stale orders can inflate open-order counts
- Smallest useful slice: stale-state write plus active read filter
- Success metric or signal: focused regression evidence
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: observe production dashboard after deploy

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: LIVE runtime dashboard order monitoring
- SLI: dashboard active-order truthfulness
- SLO: stale synced orders are not counted as active open orders
- Error budget posture: not applicable
- Health/readiness check: not affected
- Logs, dashboard, or alert route: not affected
- Smoke command or manual smoke: focused API regressions
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: user trading/order metadata
- Trust boundaries: authenticated dashboard API, exchange snapshot ingestion
- Permission or ownership checks: existing bot/session ownership plus active
  sync-state filter
- Abuse cases: stale exchange order appears active after exchange no longer
  confirms it
- Secret handling: no secrets touched
- Security tests or scans: focused lifecycle regression
- Fail-closed behavior: `ORPHAN_LOCAL` rows are hidden from active open-order
  dashboard state
- Residual risk: no separate unresolved-order UI in V1

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: stale `ORPHAN_LOCAL` exchange-synced order rows no longer
  count as active runtime dashboard open orders, and future stale marking moves
  those rows to non-open `CANCELED`.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-70-hide-stale-open-orders-task-2026-05-04.md`
- How tested: runtime-scope e2e (`15/15`), live reconciliation suite
  (`28/28`), API typecheck, guardrails, lint, and diff check all passed.
- What is incomplete: no separate unresolved-order dashboard/history UI in V1.
- Next steps: continue auditing imported trade attribution and wallet blockers
  for stale/order lifecycle parity.
- Decisions made: `ORPHAN_LOCAL` orders are not active open orders for V1
  dashboard; stale exchange-synced open orders are marked `CANCELED`.
