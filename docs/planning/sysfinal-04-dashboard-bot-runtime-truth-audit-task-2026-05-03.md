# Task

## Header
- ID: SYSFINAL-04
- Title: Audit dashboard and bot runtime truth end to end
- Task Type: qa
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: SYSFINAL-03
- Priority: P0
- Iteration: 5
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`SYSFINAL-03` confirmed auth/session/security boundaries. The next risk is
runtime truth parity: Dashboard Home and Bot Monitoring must reflect the same
selected-bot, signal, guardrail, position, history, and market-stream truth
that the backend runtime executes.

## Goal
Audit Dashboard Home and Bot Monitoring against selected-bot runtime truth,
including signal recovery, guardrail-blocked outcomes, runtime positions,
history, market-stream readiness, and PAPER/read-only LIVE rows.

## Success Signal
- User or operator problem: recent production work fixed runtime signal and
  imported LIVE truth, so final confidence needs focused regression evidence.
- Expected product or reliability outcome: no dashboard/runtime truth
  discrepancy is found locally.
- How success will be observed: focused API runtime/readiness packs,
  sequential DB-backed runtime e2e tests, and focused web runtime parity tests
  pass.
- Post-launch learning needed: no.

## Deliverable For This Stage
Runtime verification artifact with command evidence and discrepancy
classification.

## Scope
- Runtime final-candle signal recovery and strategy vote input.
- Runtime symbol stats read models and guardrail-blocked signal outcomes.
- Runtime position serialization, dynamic stop truth, and imported LIVE
  ownership/takeover visibility.
- Runtime aggregate monitoring, PnL, history, DCA visibility, selected-bot
  scope, and non-actionable recovered LIVE rows.
- Market-stream SSE contract, Redis fanout retry, health/readiness, worker
  readiness, runtime freshness.
- Dashboard Home and Bot Monitoring web parity surfaces.

## Implementation Plan
1. Review bot/runtime and dashboard module docs plus runtime signal merge
   contract.
2. Run focused API unit/contract pack for runtime signal, read models,
   market-stream, readiness, and worker freshness.
3. Run DB-backed runtime e2e files sequentially to avoid shared cleanup
   interference.
4. Run focused web runtime/dashboard/bot monitoring pack.
5. Classify any failure before creating fix tasks.
6. Sync queue/context and run guardrails.

## Acceptance Criteria
- No `matched=true` plus unexplained `No votes` contradiction is reproduced by
  focused runtime/read-model tests.
- Guardrail-blocked runtime outcomes remain visible without incrementing
  accepted signals.
- Runtime positions/history/PnL/DCA/takeover truth is selected-bot scoped.
- Market-stream and readiness tests cover Redis/fanout fail-closed behavior.
- Dashboard Home and Bot Monitoring web tests pass for runtime-derived display.
- Any confirmed discrepancy becomes a scoped `SYSFIX-*` task.

## Constraints
- Do not mutate LIVE production state.
- Do not run DB-backed e2e files in parallel when they share broad cleanup.
- Do not implement fixes during audit before classification.
- Treat expected retry/fail-closed stderr in tests as diagnostics when command
  exit is `0`.

## Definition of Done
- [x] Focused API runtime/readiness pack passes.
- [x] Sequential DB-backed runtime e2e files pass.
- [x] Focused web runtime parity pack passes.
- [x] No `SYSFIX-*` task is needed, or any needed task is explicitly queued.
- [x] Context and planning files are synchronized.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- UI-only fixes for runtime truth issues.
- Runtime shortcuts that bypass pre-trade, wallet, max-position,
  exchange-min-order, no-flip, or orchestration guardrails.
- LIVE production mutations during audit without explicit approval.
- Parallel DB e2e execution against shared cleanup.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/engine/runtimeSignalMarketDataGateway.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts src/modules/bots/runtimePositionSerialization.service.test.ts src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/market-stream/marketStreamFanout.test.ts src/modules/market-stream/marketStream.routes.contract.test.ts src/modules/market-stream/marketStream.routes.e2e.test.ts src/workers/marketStreamSubscriptions.service.test.ts src/router/health-readiness.test.ts src/router/workers-health-readiness.test.ts src/router/workers-runtime-freshness.test.ts` PASS (`14` files, `113` tests).
  - `pnpm --filter api run test -- --run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts` PASS (`5` tests).
  - `pnpm --filter api run test -- --run src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts` PASS (`2` tests).
  - `pnpm --filter api run test -- --run src/modules/bots/bots.runtime-history-parity.e2e.test.ts` PASS (`5` tests).
  - `pnpm --filter api run test -- --run src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts` PASS (`6` tests).
  - `pnpm --filter api run test -- --run src/modules/bots/bots.runtime-scope.e2e.test.ts` PASS (`10` tests).
  - `pnpm --filter api run test -- --run src/modules/bots/bots.runtime-takeover.e2e.test.ts` PASS (`3` tests).
  - `pnpm --filter api run test -- --run src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts` PASS (`2` tests).
  - `pnpm --filter web run test -- --run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-error.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/bots/components/BotsManagement.test.tsx src/features/bots/components/BotsManagement.portfolio-history.test.tsx src/features/bots/components/bots-management/MonitoringFutureSignalsSection.test.tsx src/features/bots/utils/runtimeOpenPositionDerivations.test.ts src/features/shared/runtimeMonitoringFormatters.test.ts` PASS (`14` files, `59` tests).
  - `pnpm run quality:guardrails` PASS after docs/context sync.
- Manual checks:
  - Reviewed `docs/modules/api-bots.md`.
  - Reviewed `docs/modules/web-dashboard-home.md`.
  - Reviewed `docs/architecture/reference/runtime-signal-merge-contract.md`.
  - Classified expected stderr from runtime retry/stall/fail-closed tests as
    expected diagnostics because command exit was `0`.
- Screenshots/logs: terminal command output in this execution session.
- High-risk checks:
  - No LIVE production mutation performed.
  - DB-backed e2e files were run one by one.

## Discrepancy Classification
| Finding | Classification | Follow-up |
|---|---|---|
| Runtime signal/read-model/market-stream/readiness pack | PASS. | No `SYSFIX-*`. |
| Sequential runtime DB e2e pack | PASS. | No `SYSFIX-*`. |
| Web runtime parity pack | PASS. | No `SYSFIX-*`. |
| Expected stderr from simulated cache/readiness/retry failures | Test diagnostics for covered degraded paths, not product failure. | No `SYSFIX-*`. |

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/api-bots.md`
  - `docs/modules/web-dashboard-home.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/planning/sysfinal-01-current-function-inventory-task-2026-05-03.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## UX/UI Evidence
- Design source type: approved_snapshot.
- Design source reference: current Dashboard Home and Bot Monitoring runtime
  surfaces.
- Canonical visual target: current dashboard design system.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: partially through runtime parity tests;
  broader UX audit remains `SYSFINAL-07`.
- Visual-direction brief reviewed: not applicable.
- Existing shared pattern reused: current runtime derivation/presenter helpers.
- New shared pattern introduced: no.
- Design-memory entry reused: no new pattern.
- Design-memory update required: no.
- Visual gap audit completed: no, planned in `SYSFINAL-07`.
- Background or decorative asset strategy: not applicable.
- Canonical asset extraction required: no.
- Screenshot comparison pass completed: no.
- Remaining mismatches: none found by focused tests.
- Required states: loading, empty, error, success and degraded states covered
  where existing runtime tests assert them.
- Responsive checks: planned in `SYSFINAL-07`.
- Input-mode checks: planned in `SYSFINAL-07`.
- Accessibility checks: planned in `SYSFINAL-07`.
- Parity evidence: focused Dashboard Home and Bot Monitoring tests passed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none; readiness behavior covered by tests.
- Smoke steps updated: no.
- Rollback note: docs-only closure can be reverted.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: recent production fixes touched signal recovery, Redis readiness,
  guardrail-blocked read models, imported LIVE ownership, DCA visibility, and
  dashboard runtime derivation.
- Gaps: production/browser live smoke remains for later closure; local focused
  audit found no confirmed gap.
- Inconsistencies: none found.
- Architecture constraints: selected-bot scoped runtime truth, no duplicate
  display-only truth, runtime guardrails remain authoritative.

### 2. Select One Priority Task
- Selected task: `SYSFINAL-04`.
- Priority rationale: it is the next active queue item and covers the
  highest-risk runtime/operator truth surface.
- Why other candidates were deferred: trading/config/product audits depend on
  runtime truth being locally coherent first.

### 3. Plan Implementation
- Files or surfaces to modify: docs/context only after validation.
- Logic: test runtime execution inputs, read-model outputs, market-stream
  readiness, DB-backed runtime flows, and web presentation parity.
- Edge cases: expected failure-mode stderr, DB e2e cleanup interference,
  imported LIVE non-actionable rows.

### 4. Execute Implementation
- Implementation notes: no product implementation changes; executed
  verification commands and documented results.

### 5. Verify and Test
- Validation performed: focused API runtime/readiness pack, sequential DB e2e
  runtime pack, web runtime parity pack, guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: relying on the full baseline from `SYSFINAL-02`.
- Technical debt introduced: no.
- Scalability assessment: strong enough to proceed to trading workflow audit.
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
No production smoke or browser screenshot audit was performed in this local
verification slice; those remain later closure responsibilities.

## Production-Grade Required Contract

### Goal
Audit dashboard and bot runtime truth end to end.

### Scope
Focused API/runtime/readiness/web runtime parity tests and docs/context sync.

### Implementation Plan
Review runtime contracts, run focused API pack, sequential DB e2e pack, web
runtime pack, classify discrepancies, sync queue/context.

### Acceptance Criteria
All focused runtime truth checks pass or confirmed discrepancies are queued as
`SYSFIX-*`. Satisfied: all checks pass.

### Definition Of Done
`DEFINITION_OF_DONE.md` expectations are satisfied for this verification
stage: goal, scope, validation evidence, review, and result report are present.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: represented by API/web runtime packs.
- Real API/service path used: automated API e2e/unit tests.
- Endpoint and client contract match: API read models and web consumers tested.
- DB schema and migrations verified: indirectly through DB-backed e2e tests.
- Loading state verified: covered where existing web tests assert it.
- Error state verified: aggregate error and degraded runtime tests passed.
- Refresh/restart behavior verified: runtime loop, worker freshness, and
  readiness tests passed.
- Regression check performed: focused runtime API/e2e/web packs.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: Patryk/operator using dashboard runtime surfaces.
- Existing workaround or pain: previous production drift around signals,
  guardrail reasons, and imported LIVE rows.
- Smallest useful slice: focused runtime truth audit.
- Success metric or signal: all focused checks pass.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: production smoke later.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  separately required; readiness/freshness tests cover this slice.
- Critical user journey: Dashboard Home/Bot Monitoring shows accurate selected
  bot runtime state and block reasons.
- SLI: runtime read-model and market-stream readiness test pass rate.
- SLO: all focused runtime truth checks pass.
- Error budget posture: healthy.
- Health/readiness check: API `/ready`, workers readiness, runtime freshness,
  market-stream route/fanout tests passed.
- Logs, dashboard, or alert route: runtime event counters and block diagnostics
  covered by runtime history/read-model tests.
- Smoke command or manual smoke: not run in this local verification slice.
- Rollback or disable path: revert docs-only changes.

## AI Testing Evidence
Not applicable. This task did not change AI behavior.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: covered in
  `SYSFINAL-03`; no new security behavior here.
- Data classification: runtime sessions/events, positions, trades, signals,
  wallets, bots.
- Trust boundaries: browser, API, DB, Redis, exchange stream, runtime worker.
- Permission or ownership checks: selected-bot scope/takeover e2e tests passed.
- Abuse cases: cross-bot/cross-mode runtime leakage, non-actionable imported
  LIVE rows, silent guardrail blocks.
- Secret handling: no secrets touched.
- Security tests or scans: inherited from `SYSFINAL-03`; runtime ownership
  tests passed here.
- Fail-closed behavior: market-stream/readiness, runtime guardrail, and
  recovered imported LIVE non-actionable paths passed.
- Residual risk: production market-stream/live read-only smoke remains later.

## Result Report
- Task summary: audited dashboard and bot runtime truth locally and found no
  confirmed discrepancy requiring `SYSFIX-*`.
- Files changed: this artifact plus queue/context docs.
- How tested: focused API runtime/readiness pack (`14` files / `113` tests),
  sequential DB runtime e2e pack (`7` files / `33` tests), focused web runtime
  pack (`14` files / `59` tests), and guardrails all passed.
- What is incomplete: trading, configuration, product UX, and production smoke
  audits remain queued.
- Next steps: execute `SYSFINAL-05` order and position workflow audit.
- Decisions made: no new product or architecture decisions.
