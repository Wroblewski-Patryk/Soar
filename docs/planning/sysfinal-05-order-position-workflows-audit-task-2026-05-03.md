# Task

## Header
- ID: SYSFINAL-05
- Title: Audit order and position workflows
- Task Type: qa
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: SYSFINAL-04
- Priority: P0
- Iteration: 6
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`SYSFINAL-04` proved runtime/dashboard truth locally. This slice audits the
actual order and position workflows that convert operator/runtime intent into
orders, fills, positions, closes, guardrails, and history.

## Goal
Verify PAPER manual and runtime trading workflows plus read-only LIVE ownership
and protection-state surfaces without performing production LIVE mutations.

## Success Signal
- User or operator problem: order/position workflows are money-impacting and
  must be safe, explainable, and fail-closed.
- Expected product or reliability outcome: open/fill/position visibility,
  cancel/close, pre-trade guards, takeover, snapshot, orphan repair, live
  status, and web manual-order/open-order/close surfaces pass focused checks.
- How success will be observed: focused lifecycle/pre-trade tests, sequential
  DB-backed order/position e2e tests, and focused web trading workflow tests
  pass.
- Post-launch learning needed: no.

## Deliverable For This Stage
Trading workflow verification artifact with command evidence and discrepancy
classification.

## Scope
- PAPER manual market order open/fill/position visibility.
- PAPER runtime signal/lifecycle parity through pre-trade/order/position.
- Manual close, bot close, cancel order, and history/close attribution.
- LIVE read-only imported position ownership and protection state.
- Guardrail explanations for ownership, pre-trade, funds, min quantity, and
  unresolved context cases.
- Web manual-order, open-orders source/action, close action, and runtime
  position derivation surfaces.

## Implementation Plan
1. Review orders, positions, and execution lifecycle docs.
2. Run focused non-e2e lifecycle/pre-trade/order/position tests together.
3. Run DB-backed order/position e2e files sequentially.
4. Run focused web trading workflow tests.
5. Classify failures before creating fix tasks.
6. Sync queue/context and run guardrails.

## Acceptance Criteria
- PAPER manual market order open/fill visibility remains green.
- Order cancel/close and runtime position close paths remain guarded and
  deterministic.
- Pre-trade and risk guardrails remain fail-closed with visible reasons.
- LIVE imported/takeover/snapshot/orphan repair paths pass read-only/local
  test evidence.
- Web manual-order/open-order/close surfaces pass focused tests.
- Any confirmed discrepancy becomes a scoped `SYSFIX-*` task.

## Constraints
- Do not mutate LIVE production state.
- Do not run DB-backed e2e files in parallel when they share broad cleanup.
- Do not implement fixes during audit before classification.
- Preserve canonical lifecycle: intent -> order -> fill -> position.

## Definition of Done
- [x] Focused lifecycle/pre-trade/order/position pack passes.
- [x] Sequential DB-backed order/position e2e files pass.
- [x] Focused web trading workflow pack passes.
- [x] No `SYSFIX-*` task is needed, or any needed task is explicitly queued.
- [x] Context and planning files are synchronized.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- LIVE production mutations during audit without explicit approval.
- Opening positions directly from manual command paths without fill authority.
- UI-only fixes for lifecycle truth issues.
- Temporary trading bypasses or fake fills.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/orders/orders.service.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.quantityRules.test.ts src/modules/engine/preTrade.service.test.ts src/modules/engine/preTradeRisk.service.test.ts src/modules/engine/paperLifecycle.service.test.ts src/modules/engine/lifecycleCloseParity.golden.test.ts src/modules/engine/paperLiveDecisionEquivalence.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimePositionLifetime.service.test.ts src/modules/engine/runtimeLifecycleMarkPrice.service.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/bots/runtimePositionSerialization.service.test.ts src/modules/positions/positions.exchangeSnapshotNormalization.test.ts` PASS (`14` files, `116` tests).
  - `pnpm --filter api run test -- --run src/modules/orders/orders-positions.e2e.test.ts` PASS (`20` tests).
  - `pnpm --filter api run test -- --run src/modules/orders/orders.manual-paper-market.e2e.test.ts` PASS (`3` tests).
  - `pnpm --filter api run test -- --run src/modules/engine/preTrade.e2e.test.ts` PASS (`4` tests).
  - `pnpm --filter api run test -- --run src/modules/positions/positions.takeover-status.e2e.test.ts` PASS (`6` tests).
  - `pnpm --filter api run test -- --run src/modules/positions/positions.exchangeSnapshot.e2e.test.ts` PASS (`6` tests).
  - `pnpm --filter api run test -- --run src/modules/positions/positions.orphan-repair.e2e.test.ts` PASS (`1` test).
  - `pnpm --filter api run test -- --run src/modules/positions/positions-live-status.e2e.test.ts` PASS (`2` tests).
  - `pnpm --filter web run test -- --run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/utils/runtimeOpenPositionDerivations.test.ts` PASS (`8` files, `24` tests).
  - `pnpm run quality:guardrails` PASS after docs/context sync.
- Manual checks:
  - Reviewed `docs/modules/api-orders.md`.
  - Reviewed `docs/modules/api-positions.md`.
  - Reviewed `docs/architecture/06_execution-lifecycle.md`.
  - Classified expected runtime automation skip stderr as fail-closed test
    diagnostics because command exit was `0`.
- Screenshots/logs: terminal command output in this execution session.
- High-risk checks:
  - No LIVE production mutation performed.
  - DB-backed e2e files were run one by one.

## Discrepancy Classification
| Finding | Classification | Follow-up |
|---|---|---|
| Lifecycle/pre-trade/order/position unit pack | PASS. | No `SYSFIX-*`. |
| Sequential order/position e2e pack | PASS. | No `SYSFIX-*`. |
| Web manual-order/open-order/close pack | PASS. | No `SYSFIX-*`. |
| Expected runtime automation skip stderr | Test diagnostics for fail-closed paths. | No `SYSFIX-*`. |

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/api-orders.md`
  - `docs/modules/api-positions.md`
  - `docs/architecture/06_execution-lifecycle.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## UX/UI Evidence
- Design source type: approved_snapshot.
- Design source reference: current dashboard manual-order and runtime table
  surfaces.
- Canonical visual target: current dashboard design system.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: partially through focused web tests; broader
  UX audit remains `SYSFINAL-07`.
- Visual-direction brief reviewed: not applicable.
- Existing shared pattern reused: existing manual-order and runtime table
  presenters.
- New shared pattern introduced: no.
- Design-memory entry reused: no new pattern.
- Design-memory update required: no.
- Visual gap audit completed: no, planned in `SYSFINAL-07`.
- Background or decorative asset strategy: not applicable.
- Canonical asset extraction required: no.
- Screenshot comparison pass completed: no.
- Remaining mismatches: none found by focused tests.
- Required states: focused tests cover manual-order and open-order action
  states where present.
- Responsive checks: planned in `SYSFINAL-07`.
- Input-mode checks: planned in `SYSFINAL-07`.
- Accessibility checks: planned in `SYSFINAL-07`.
- Parity evidence: focused web trading workflow tests pass.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: docs-only closure can be reverted.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: money-impacting workflows require focused audit after runtime truth
  passed.
- Gaps: production manual/browser smoke remains later; local focused audit
  found no confirmed gap.
- Inconsistencies: none found.
- Architecture constraints: lifecycle fill authority and LIVE fail-closed
  guardrails remain canonical.

### 2. Select One Priority Task
- Selected task: `SYSFINAL-05`.
- Priority rationale: it is the next active queue item and covers
  money-impacting workflows.
- Why other candidates were deferred: configuration/product audits depend on
  order/position workflow confidence.

### 3. Plan Implementation
- Files or surfaces to modify: docs/context only after validation.
- Logic: test lifecycle/pre-trade internals, DB-backed API workflows, and web
  operator surfaces.
- Edge cases: LIVE mutation safety, DB cleanup interference, expected
  fail-closed stderr.

### 4. Execute Implementation
- Implementation notes: no product implementation changes; executed
  verification commands and documented results.

### 5. Verify and Test
- Validation performed: lifecycle/pre-trade pack, sequential DB e2e pack, web
  trading workflow pack, guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: relying only on full baseline from `SYSFINAL-02`.
- Technical debt introduced: no.
- Scalability assessment: enough to proceed to configuration workflow audit.
- Refinements made: DB-backed e2e files were split into sequential commands.

### 7. Update Documentation and Knowledge
- Docs updated: this task artifact, MVP queue, execution plan, master plan.
- Context updated: task board and project state.
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
No production LIVE mutation was performed. LIVE coverage in this slice is
local/focused and read-only through snapshot/takeover/status tests.

## Production-Grade Required Contract

### Goal
Audit order and position workflows.

### Scope
Focused lifecycle/pre-trade/API/web trading workflow tests and docs/context
sync.

### Implementation Plan
Review lifecycle docs, run focused internals, run sequential DB e2e tests, run
web workflow tests, classify discrepancies, sync queue/context.

### Acceptance Criteria
All focused trading workflow checks pass or confirmed discrepancies are queued
as `SYSFIX-*`. Satisfied: all checks pass.

### Definition Of Done
`DEFINITION_OF_DONE.md` expectations are satisfied for this verification
stage: goal, scope, validation evidence, review, and result report are present.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: represented by API/web workflow packs.
- Real API/service path used: automated API e2e/unit tests.
- Endpoint and client contract match: API workflows and web consumers tested.
- DB schema and migrations verified: indirectly through DB-backed e2e tests.
- Loading state verified: covered where existing web tests assert it.
- Error state verified: pre-trade/guardrail/manual-order tests cover failure
  states.
- Refresh/restart behavior verified: not primary in this slice; runtime
  continuity covered by `SYSFINAL-04`.
- Regression check performed: focused lifecycle/API/web trading workflow packs.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: Patryk/operator using manual and bot trading
  workflows.
- Existing workaround or pain: previous live/imported position and manual order
  correctness work needed final confidence.
- Smallest useful slice: focused trading workflow audit.
- Success metric or signal: all focused checks pass.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: production smoke later.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  separately required for this local workflow audit.
- Critical user journey: order intent becomes order/fill/position/history or a
  visible blocked reason.
- SLI: focused trading workflow test pass rate.
- SLO: all focused checks pass.
- Error budget posture: healthy.
- Health/readiness check: covered in previous baseline/runtime audits.
- Logs, dashboard, or alert route: close attribution/history and runtime
  diagnostics covered by tests.
- Smoke command or manual smoke: not run in this local verification slice.
- Rollback or disable path: revert docs-only changes.

## AI Testing Evidence
Not applicable. This task did not change AI behavior.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: covered in
  `SYSFINAL-03`; this task includes money-impacting fail-closed evidence.
- Data classification: orders, positions, trades, wallets, bots, API-key linked
  exchange context.
- Trust boundaries: browser, API, DB, exchange adapter, runtime engine.
- Permission or ownership checks: order/position ownership and takeover tests
  passed.
- Abuse cases: cross-user access, unsafe LIVE mutation, invalid quantity,
  unresolved execution context, existing position/risk guardrails.
- Secret handling: no secrets touched.
- Security tests or scans: inherited from `SYSFINAL-03`; trading guardrail
  tests passed here.
- Fail-closed behavior: pre-trade, runtime automation skip, LIVE context,
  orphan/takeover, and manual-order guards passed.
- Residual risk: production manual smoke remains later.

## Result Report
- Task summary: audited local order and position workflows and found no
  confirmed discrepancy requiring `SYSFIX-*`.
- Files changed: this artifact plus queue/context docs.
- How tested: lifecycle/pre-trade pack (`14` files / `116` tests), sequential
  DB order/position e2e pack (`7` files / `42` tests), focused web trading
  workflow pack (`8` files / `24` tests), and guardrails all passed.
- What is incomplete: configuration, product UX, and production smoke audits
  remain queued.
- Next steps: execute `SYSFINAL-06` wallets/markets/strategies/bot setup audit.
- Decisions made: no new product or architecture decisions.
