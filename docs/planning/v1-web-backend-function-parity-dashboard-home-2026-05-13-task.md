# V1 Web Backend Function Parity - Dashboard And Monitoring Slice - 2026-05-13

## Header
- ID: V1-WEB-BACKEND-PARITY-DASHBOARD-2026-05-13
- Title: Dashboard and monitoring runtime trade contract parity
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1 runtime backend proof
- Priority: P0
- Module Confidence Rows: Dashboard Home; Bots Monitoring; Runtime Trading
- Requirement Rows: V1 dashboard runtime visibility; V1 bot monitoring runtime visibility
- Quality Scenario Rows: UI reflects backend runtime state without silent data loss
- Risk Rows: Runtime Web/API contract drift
- Iteration: 2026-05-13-web-parity-1
- Operation Mode: BUILDER
- Mission ID: V1-WEB-BACKEND-FUNCTION-PARITY
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: close one concrete Web/API parity gap in runtime trade and position summary rendering.
- Release objective advanced: V1 Dashboard Home and Bots Monitoring accurately reflect backend runtime data.
- Included slices: Web runtime trade type contract; monitoring trade ID rendering; positions summary open quantity type.
- Explicit exclusions: broad visual redesign, API behavior changes, deployment.
- Checkpoint cadence: after implementation and test run.
- Stop conditions: typecheck or focused test failure that indicates a wider contract mismatch.
- Handoff expectation: evidence-backed status plus next parity slice.

## Context
The V1 completion scorecard marks Dashboard Home as the first NO-GO work order. Runtime backend endpoints already return richer data than the Web contract captures. `listBotRuntimeSessionTrades` can return `orderId`, `positionId`, and `strategyId` as `null` for valid runtime rows, while Web typed and rendered them as mandatory strings in some monitoring surfaces.

## Goal
Make runtime trade and position summary contracts in Web match the backend response and prevent monitoring rendering crashes or misleading IDs when backend rows intentionally have no linked local order, position, or strategy.

## Scope
- `apps/web/src/features/bots/types/bot.type.ts`
- `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx`
- `apps/web/src/features/bots/components/BotsManagement.test.tsx`
- `docs/planning/v1-web-backend-function-parity-dashboard-home-2026-05-13-task.md`

## Implementation Plan
1. Update Web runtime types to allow nullable trade relationship IDs and include positions summary `openPositionQty`.
2. Render nullable monitoring order/position IDs as `-` instead of slicing a null value.
3. Add a focused monitoring regression test for runtime trade rows with null relationship IDs.
4. Run focused Web tests and typecheck.
5. Update project state artifacts with evidence.

## Acceptance Criteria
- Web `BotRuntimeTrade` matches backend nullable relationship IDs.
- Web `BotRuntimePositionsResponse.summary` includes backend `openPositionQty`.
- Bots Monitoring renders null runtime trade order/position IDs as `-`.
- Focused tests and Web typecheck pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` relevant expectations are satisfied for this vertical UI contract slice.
- [x] Focused regression test passes.
- [x] Web typecheck passes.
- [x] Source-of-truth state is updated with evidence.

## Forbidden
- Backend workaround paths.
- Fake fallback IDs.
- Broad redesign or unrelated cleanup.
- Temporary bypasses.

## Validation Evidence
- Tests: Web focused tests passed (`2` files, `17` tests); API runtime monitoring aggregate e2e passed (`18/18`); API typecheck passed; Web typecheck passed.
- Manual checks: static Web/API contract audit for runtime trade relationship IDs and aggregate positions summary.
- Screenshots/logs: command output from focused test/typecheck runs.
- High-risk checks: nullable relationship IDs fail closed in UI as `-`.
- Module confidence ledger updated: yes.
- Requirements matrix updated: yes.
- Quality scenarios updated: yes.
- Risk register updated: yes.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`; runtime endpoints and frontend monitoring are part of approved dashboard visibility.
- Fits approved architecture: yes.
- Mismatch discovered: no architecture mismatch; Web contract drift discovered.
- Decision required from user: no.
- Follow-up architecture doc updates: none expected.

## UX/UI Evidence
- Design source type: approved_snapshot.
- Design source reference: existing Dashboard Home and Bots Monitoring runtime tables.
- Fidelity target: structurally_faithful.
- Existing shared pattern reused: table placeholder dash for missing values.
- New shared pattern introduced: no.
- Required states: success.
- Responsive checks: not applicable to this type contract slice.
- Accessibility checks: no interactive UI added.
- Parity evidence: pending test evidence.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the Web type/render/test changes.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Web required trade relationship IDs that backend can legitimately return as null.
- Gaps: positions summary lacked `openPositionQty` in Web type.
- Inconsistencies: Bots Monitoring sliced nullable IDs as strings.
- Architecture constraints: reuse existing runtime monitoring surfaces.

### 2. Select One Priority Mission Objective
- Selected task: Dashboard and monitoring runtime contract parity.
- Priority rationale: first V1 scorecard work order is Dashboard Home runtime visibility.
- Why other candidates were deferred: Bots, Wallets, Markets, Strategies remain next slices after this proof.

### 3. Plan Implementation
- Files or surfaces to modify: Web runtime types, Bots Monitoring table, focused test, planning artifact.
- Logic: nullable IDs render as `-`; type contract admits backend response.
- Edge cases: empty string, null, undefined.

### 4. Execute Implementation
- Implementation notes: updated Web runtime trade relationship IDs to `string | null`; added `openPositionQty` to Web positions summary; rendered nullable Bots Monitoring relationship IDs as `-`; added `openPositionQty: 0` to empty API/Web aggregate payloads.

### 5. Verify and Test
- Validation performed: `pnpm --filter web run test -- src/features/bots/services/botsMonitoringAggregate.service.test.ts src/features/bots/components/BotsManagement.test.tsx --run`; `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --run`; `pnpm --filter api run typecheck`; `pnpm --filter web run typecheck`.
- Result: passed.

### 6. Self-Review
- Simpler option considered: only guard render without changing types; rejected because it would leave contract drift.
- Technical debt introduced: no.
- Scalability assessment: localized helper handles future nullable IDs consistently in the monitoring table.
- Refinements made: extended empty aggregate API/Web paths after the type audit showed success aggregate carried `openPositionQty` but empty aggregate did not.

### 7. Update Documentation and Knowledge
- Docs updated: this task artifact.
- Context updated: `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`, `.agents/state/module-confidence-ledger.md`, `.agents/state/requirements-verification-matrix.md`, `.agents/state/quality-attribute-scenarios.md`, `.agents/state/risk-register.md`.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Current stage is declared and respected.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.

## Result Report
- Task summary: closed a runtime Web/API contract drift for nullable runtime trade relationship IDs and aggregate `openPositionQty`.
- Files changed: Web runtime types, Bots Monitoring table/test, Web aggregate fallback/test, API aggregate empty payload/e2e, source-of-truth docs.
- How tested: Web focused tests (`17/17`), API aggregate e2e (`18/18`), API typecheck, Web typecheck.
- What is incomplete: broader V1 Web/backend parity remains incomplete across remaining routes and production-safe clickthrough.
- Next steps: continue Dashboard Home parity audit.
- Decisions made: represent missing runtime relationship IDs as `-` in monitoring tables.
