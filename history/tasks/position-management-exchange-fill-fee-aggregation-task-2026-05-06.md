# Task

## Header
- ID: PMPLC-30
- Title: Aggregate exchange fill fees across partial fills
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-29
- Priority: P0
- Iteration: 30
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Binance order-trade update fee values represent the current fill/trade fee.
The exchange event handler persisted `OrderFill.feeCost` per fill, but
`Order.fee` and lifecycle `Trade.fee` could be overwritten by the latest fill
fee instead of reflecting the aggregate order fee across partial fills.

## Goal
Aggregate exchange fill fees across partial and final fills so order and trade
fee truth reflects all recorded fills, not only the latest event.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `history/tasks/position-management-exchange-fill-fee-aggregation-task-2026-05-06.md`

## Success Signal
- User or operator problem: multi-fill LIVE orders must not understate fees.
- Expected product or reliability outcome: order/trade fee truth equals the sum
  of accepted exchange fill fees.
- How success will be observed: DB-backed regression fails before the fix and
  passes after aggregation is applied.
- Post-launch learning needed: no

## Deliverable For This Stage
Implementation plus verification evidence for a TESTER-mode fee aggregation
slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add a DB-backed partial-fill then final-fill regression.
2. Confirm the regression fails because only the latest fill fee is persisted
   on the order/trade.
3. Sum existing `OrderFill.feeCost` for the order and add the current event fee
   only when the event fill has not already been recorded.
4. Keep duplicate `exchangeTradeId` idempotency intact.
5. Run DB-backed exchange-event tests, focused runtime/order pack, typecheck,
   guardrails, lint, and diff check.
6. Update context and planning truth.

## Acceptance Criteria
- [x] Partial fill fee plus final fill fee aggregate onto `Order.fee`.
- [x] Generated lifecycle `Trade.fee` uses the aggregate order fee.
- [x] Individual `OrderFill.feeCost` rows remain per-fill.
- [x] Duplicate exchange trade events do not double-add fee.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this tiny slice.
- [x] No workaround, fake data, placeholder, or parallel path is introduced.
- [x] Validation evidence is recorded in this task.
- [x] Source-of-truth planning and context files are updated.

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
  - Pre-fix `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts --run`
    FAILED as expected: aggregate fee expected `0.03`, received `0.02`.
  - Post-fix `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts --run`
    PASS (`11/11`)
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run`
    PASS (`84/84`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS with existing CRLF warnings only
- Manual checks: DB-backed suite uses local Postgres.
- Screenshots/logs: not applicable
- High-risk checks: DB-backed multi-fill fee aggregation regression and focused
  runtime/order pack passed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/reference/live-fee-reconciliation-contract.md`
  - `docs/governance/autonomous-engineering-loop.md`
  - `docs/planning/mvp-next-commits.md`
  - `.codex/context/TASK_BOARD.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

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
- Remaining mismatches: none
- Required states: not applicable
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: not applicable

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this slice if exchange fee reconciliation regresses.
- Observability or alerting impact: improves multi-fill fee truth
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: latest fill fee could overwrite aggregate order/trade fee for
  multi-fill exchange orders.
- Gaps: no DB-backed partial-fill fee aggregation regression existed.
- Inconsistencies: `OrderFill` rows retained per-fill fees while `Order.fee`
  and generated lifecycle `Trade.fee` could show only the latest fee.
- Architecture constraints: LIVE fee truth must come from exchange fills/trades
  and reconciliation must be idempotent.

### 2. Select One Priority Task
- Selected task: aggregate exchange fill fees across partial fills.
- Priority rationale: PMPLC-30 is TESTER mode and this is a direct
  money-impacting fee/PnL correctness issue.
- Why other candidates were deferred: broader reconciliation backfill would be
  larger than one tiny slice.

### 3. Plan Implementation
- Files or surfaces to modify: exchange event service/test plus planning and
  context docs.
- Logic: aggregate existing `OrderFill.feeCost` plus current event fee when
  the current `exchangeTradeId` is not already recorded; use that aggregate for
  order and lifecycle trade fee.
- Edge cases: partial then final fill, duplicate exchange trade id, capped fill
  fee, missing fee.

### 4. Execute Implementation
- Implementation notes: added a partial-fill then final-fill DB-backed
  regression, then changed exchange event fee resolution to sum existing
  `OrderFill.feeCost` rows plus the current event fee only when the current
  `exchangeTradeId` has not already been recorded.

### 5. Verify and Test
- Validation performed: pre-fix failing regression, post-fix DB-backed
  exchange-event suite, focused runtime/order pack, API typecheck, repository
  guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: adding current fee to `existingOrder.fee`;
  rejected because duplicate exchange trade events could double-add.
- Technical debt introduced: no
- Scalability assessment: uses existing `OrderFill` persistence as the
  canonical per-fill evidence; no new model introduced.
- Refinements made: used persisted fill rows instead of `existingOrder.fee` as
  the aggregation source to avoid duplicate event double-adds.

### 7. Update Documentation and Knowledge
- Docs updated: this task, `docs/planning/mvp-next-commits.md`, and
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/PROJECT_STATE.md` and
  `.codex/context/TASK_BOARD.md`.
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
- The pre-fix failing assertion is the acceptance proof for this slice:
  expected aggregate fee `0.03`, received `0.02`.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime
  surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB
-> validation -> error handling -> test. Partial implementations,
mock-only paths, placeholders, fake data, and temporary fixes are forbidden.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: yes, no schema change
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: DB-backed exchange-event replay suite passed
- Regression check performed: yes

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: live trading operators and runtime history readers
- Existing workaround or pain: multi-fill fee can be understated
- Smallest useful slice: aggregate existing fill fees plus current fill fee
- Success metric or signal: order/trade fee equals accepted fill fee sum
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: LIVE multi-fill fee reconciliation
- SLI: order/trade fees match sum of accepted exchange fill fees
- SLO: no multi-fill order reports only latest fill fee as aggregate fee
- Error budget posture: healthy
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not changed
- Smoke command or manual smoke: DB-backed exchange-event suite
- Rollback or disable path: revert this slice

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: user order, trade, and fee data
- Trust boundaries: exchange event fee data remains untrusted until finite and
  deduped by exchange trade id
- Permission or ownership checks: existing user/order lookup retained
- Abuse cases: duplicate exchange trade id must not double-add fee
- Secret handling: unchanged
- Security tests or scans: repository guardrails, lint, and typecheck passed
- Fail-closed behavior: duplicate current fill is excluded from aggregation
- Residual risk: low after validation

## Result Report

- Task summary: aggregated exchange fill fees across partial and final fills so
  order/trade fee truth is no longer overwritten by only the latest fill fee.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/tasks/position-management-exchange-fill-fee-aggregation-task-2026-05-06.md`
- How tested: pre-fix failing regression, DB-backed exchange-event suite
  (`11/11`), focused runtime/order suites (`84/84`), API typecheck, repository
  guardrails, lint, and diff check.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
- Decisions made: aggregate from persisted fill rows plus a deduped current
  event fee instead of adding blindly to `existingOrder.fee`.
