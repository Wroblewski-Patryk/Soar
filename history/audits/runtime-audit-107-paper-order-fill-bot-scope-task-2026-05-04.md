# Task

## Header
- ID: RUNTIME-AUDIT-107
- Title: Scope PAPER order fill positions by bot instead of wallet
- Task Type: fix
- Current Stage: implementation
- Status: IN_PROGRESS
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-106
- Priority: P1
- Iteration: 107
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator clarified that signals render correctly, LIVE opens positions, but
PAPER does not open positions. The runtime capital contract already states that
PAPER capital is bot-scoped even when multiple bots share a wallet. However the
shared order open-position scope helper currently prioritizes `walletId` when it
is present. PAPER runtime orders carry a wallet id, so immediate fill lifecycle
can reuse or conflict with a same-wallet open position that belongs to another
PAPER bot instead of creating a position for the current bot.

## Goal
Align PAPER order conflict and immediate-fill position lifecycle with the
approved bot-scoped PAPER runtime model while preserving wallet-scoped LIVE
behavior.

## Scope
- `apps/api/src/modules/orders/orders.positionScope.ts`
- `apps/api/src/modules/orders/orders.positionScope.test.ts`
- `apps/api/src/modules/orders/orders.lifecycle.service.ts`
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/orders/orders.service.test.ts`
- Source-of-truth planning/context docs.

## Success Signal
- User or operator problem: PAPER signal reaches execution but no position
  appears for the active bot.
- Expected product or reliability outcome: a PAPER bot opens its own
  bot-scoped position even if another PAPER bot uses the same wallet and symbol.
- How success will be observed: focused unit regression around shared paper
  wallet order fill.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement a mode-aware open-position scope for order conflict/fill lifecycle and
verify it with focused tests.

## Constraints
- use existing order/fill/position lifecycle
- do not introduce a new paper execution system
- do not change LIVE wallet-scoped exchange semantics
- do not bypass risk, dedupe, pre-trade, or wallet guards
- keep the change small and reversible

## Implementation Plan
1. Extend the open-position scope helper to accept `mode`.
2. For `mode=PAPER` with `botId`, prefer bot scope even when `walletId` exists.
3. Pass the execution mode from `openOrder` into reverse-conflict checks and
   immediate fill lifecycle.
4. Apply the same PAPER scope when repairing stale open-position blockers.
5. Add a focused regression proving a second PAPER bot on the same wallet/symbol
   gets its own position rather than reusing the first bot's position.
6. Run focused API tests plus typecheck/guardrails/lint.

## Acceptance Criteria
- PAPER open-order conflict checks are bot-scoped when `botId` is present.
- PAPER immediate fill creates/links positions under the current bot scope.
- LIVE behavior remains wallet-scoped.
- Focused regression passes.

## Definition of Done
- [x] PAPER order scope is mode-aware and bot-scoped.
- [x] LIVE wallet scope remains covered or unchanged.
- [x] Focused regression passes.
- [x] Relevant repository validation passes.
- [x] Source-of-truth docs/context are synchronized.

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
- Tests: `pnpm --filter api run test -- src/modules/orders/orders.positionScope.test.ts --run` PASS (`2/2`).
- Manual checks: code diff reviewed; DB-backed focused regression added in
  `orders.service.test.ts` but local execution is blocked by unavailable
  PostgreSQL on `localhost:5432`.
- Screenshots/logs: not applicable
- High-risk checks: PAPER-only scope change; LIVE preserved

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/README.md`,
  `docs/architecture/07_modes-parity-and-data.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## UX/UI Evidence
- Design source type: not applicable
- Design source reference: not applicable
- Canonical visual target: not applicable
- Fidelity target: not applicable
- Stitch used: no
- Experience-quality bar reviewed: not applicable
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: not applicable
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: not applicable
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: not applicable
- Required states: not applicable
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: API tests

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this small order scope slice
- Observability or alerting impact: positions should become visible in existing
  dashboard reads
- Staged rollout or feature flag: not needed

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `resolveOpenPositionScopeWhere` prioritizes wallet scope whenever a
  wallet id is present.
- Gaps: PAPER runtime order fill can behave like LIVE wallet-scope despite the
  paper capital contract being bot-scoped.
- Inconsistencies: runtime pre-trade PAPER checks are bot-scoped, but order
  conflict/fill lifecycle can be wallet-scoped.
- Architecture constraints: PAPER must simulate isolated bot execution; LIVE can
  reflect wallet/exchange shared positions.

### 2. Select One Priority Task
- Selected task: make order fill/conflict scope mode-aware for PAPER.
- Priority rationale: directly matches the operator's "LIVE opens, PAPER does
  not" symptom and is a narrow backend runtime slice.
- Why other candidates were deferred: dashboard display and production log
  digging are secondary after finding a local scope drift.

### 3. Plan Implementation
- Files or surfaces to modify: order scope helper, order lifecycle, order
  service, focused tests, docs/context.
- Logic: when `mode=PAPER` and `botId` exists, ignore wallet for active position
  lookup; otherwise preserve current wallet-first behavior.
- Edge cases: LIVE same-wallet imported reuse remains unchanged; botless/manual
  orders keep existing fallback behavior.

### 4. Execute Implementation
- Implementation notes: added `mode` to the shared open-position scope helper,
  passed canonical order mode into conflict checks and immediate fill
  lifecycle, and applied the same mode-aware scope to stale PAPER blocker
  repair.

### 5. Verify and Test
- Validation performed: focused scope unit test, API typecheck, repository
  guardrails, lint, diff check.
- Result: PASS. DB-backed `orders.service.test.ts` focused regression is present
  but could not execute locally because PostgreSQL is unavailable at
  `localhost:5432`.

### 6. Self-Review
- Simpler option considered: removing `walletId` from runtime PAPER orders was
  rejected because wallet attribution is still needed for accounting/display.
- Technical debt introduced: no
- Scalability assessment: adds explicit mode to existing helper instead of
  duplicating lifecycle logic.
- Refinements made: added DB-free unit coverage for the helper because the
  local DB-backed test environment is unavailable.

### 7. Update Documentation and Knowledge
- Docs updated: task doc, MVP execution plan, MVP next commits.
- Context updated: task board and project state.
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
This task changes PAPER scoping only at order conflict/fill lifecycle. It does
not change signal evaluation, pre-trade risk, dedupe, or LIVE execution.

## Production-Grade Required Contract

### Goal
Ensure PAPER runtime orders open positions for the current bot.

### Scope
See `Scope` above.

### Implementation Plan
See `Implementation Plan` above.

### Acceptance Criteria
See `Acceptance Criteria` above.

### Definition of Done
Use the repository Definition of Done and the task-specific checklist above.

### Result Report
PAPER order conflict and immediate-fill lifecycle now use bot scope when the
canonical order mode is `PAPER`, while LIVE remains wallet-scoped.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: no schema change
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: existing runtime loop unchanged
- Regression check performed: focused unit PASS; DB-backed regression added but
  local DB unavailable

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: bot operator
- Existing workaround or pain: use LIVE or manually inspect DB/logs
- Smallest useful slice: mode-aware order position scope
- Success metric or signal: PAPER position is created for the active bot
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: operator confirms PAPER opens

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: PAPER bot opens runtime position from strategy signal
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: existing runtime telemetry
- Smoke command or manual smoke: focused API test
- Rollback or disable path: revert this scope slice

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: user-owned trading records
- Trust boundaries: no new boundary
- Permission or ownership checks: existing user/bot ownership checks preserved
- Abuse cases: cross-bot paper position reuse prevented
- Secret handling: no secrets touched
- Security tests or scans: not applicable
- Fail-closed behavior: risk/pre-trade guards unchanged
- Residual risk: production PAPER should be observed after deploy

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: PAPER order fill/conflict scope is now mode-aware, preventing a
  shared PAPER wallet from stealing or reusing another bot's same-symbol open
  position.
- Files changed: `orders.positionScope.ts`,
  `orders.positionScope.test.ts`, `orders.lifecycle.service.ts`,
  `orders.service.ts`, `orders.service.test.ts`, planning/context docs.
- How tested: focused scope test (`2/2`), API typecheck, repository
  guardrails, lint, diff check.
- What is incomplete: DB-backed focused `orders.service.test.ts` regression
  could not run locally because PostgreSQL is unavailable at `localhost:5432`.
- Next steps: observe deployed PAPER bot opening after deploy and run the
  DB-backed regression in an environment with PostgreSQL.
- Decisions made: keep LIVE wallet-scoped, make PAPER bot-scoped without
  removing wallet attribution from paper orders.
