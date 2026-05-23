# Task

## Header
- ID: V1-DASHBOARD-HOME-SELECTED-BOT-RENDERED-AUDIT-2026-05-11
- Title: Add rendered Dashboard Home proof for selected bot, wallet KPIs, and runtime tabs
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: V1 product action audit matrix
- Priority: P0
- Module Confidence Rows: SOAR-DASHBOARD-001
- Requirement Rows: REQ-FUNC-002
- Quality Scenario Rows: QA-002
- Risk Rows: RISK-002
- Iteration: V1 action audit checkpoint 10
- Operation Mode: TESTER
- Mission ID: V1-DASHBOARD-HOME-ACTION-PROOF-2026-05-11
- Mission Status: PARTIALLY_VERIFIED

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
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: increase V1 Dashboard Home action evidence with a rendered component proof.
- Release objective advanced: move Dashboard Home from broad partial evidence toward action-level local proof.
- Included slices: selected-bot switching, wallet KPI derivation, runtime data tab switching, and empty/error/loading awareness in the task report.
- Explicit exclusions: production clickthrough, LIVE activation, destructive order/position actions, new routes, new UI patterns.
- Checkpoint cadence: update this artifact after implementation and validation.
- Stop conditions: architecture mismatch, failing focused test that reveals product behavior ambiguity, or need for production/live credentials.
- Handoff expectation: state exactly which Dashboard Home proof remains after this local checkpoint.

## Context
The V1 scorecard and master ledger list Dashboard Home as the first executable P0 blocker. Existing evidence covers presenter-level runtime table semantics and one rendered negative-PnL TTP case. The remaining local gap is broader rendered proof for selected bot, wallet KPIs, and runtime tabs.

## Goal
Add focused rendered regression evidence that Dashboard Home exposes loading and retryable error states, updates operator-visible runtime truth when the selected bot changes, and keeps wallet/table state coherent.

## Success Signal
- User or operator problem: route reachability did not prove Dashboard Home actions or displayed runtime truth.
- Expected product or reliability outcome: Dashboard Home selected-bot and table/KPI state is locally regression-locked on representative PAPER fixtures.
- How success will be observed: focused Web tests pass with assertions on selected bot, wallet KPIs, open orders, and trade history.
- Post-launch learning needed: yes

## Deliverable For This Stage
A focused Web test update plus refreshed source-of-truth evidence; no production actions.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx`
- V1 planning and state artifacts that track Dashboard Home confidence

## Implementation Plan
1. Reuse existing `HomeLiveWidgets` service mocks and i18n provider.
2. Add one rendered audit case with two active PAPER bots.
3. Assert initial selected bot wallet KPIs and runtime rows.
4. Switch the selected bot and assert aggregate/service calls, wallet KPI update, open orders tab, and trade history tab.
5. Run focused Web tests, typecheck, guardrails, and diff check.
6. Update matrix/state/docs with exact evidence and residual risk.

## Acceptance Criteria
- Loading state is exposed with `aria-busy` and retryable error state exposes the retry action.
- The selected bot combobox changes the active Dashboard Home runtime snapshot.
- Wallet KPI values come from the selected bot runtime payload after switching.
- Open orders and trade history tabs show selected-bot rows, not stale previous-bot rows.
- No LIVE or production action is run.

## Definition of Done
- [x] Focused rendered Web test passes.
- [x] Relevant Web typecheck or equivalent scoped validation passes.
- [x] Source-of-truth files record the new evidence and remaining Dashboard Home gaps.

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
- Tests: `corepack pnpm@10.13.1 --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx --run` PASS (`3/3`); focused Dashboard pack PASS (`3` files, `35` tests); `corepack pnpm@10.13.1 --filter web run typecheck` PASS; `node scripts/repoGuardrails.mjs` PASS; `git diff --check` PASS with line-ending warnings only.
- Manual checks: source-of-truth review; no browser clickthrough in this checkpoint.
- Screenshots/logs: terminal validation output only.
- High-risk checks: no LIVE or production action executed
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: SOAR-DASHBOARD-001
- Requirements matrix updated: yes
- Requirement rows closed or changed: REQ-FUNC-002
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: QA-002
- Risk register updated: yes
- Risk rows closed or changed: RISK-002
- Reality status: partially verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/dashboard-route-map.md`, `docs/modules/web-dashboard-home.md`, `history/audits/v1-product-action-audit-matrix-2026-05-10.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home implementation and `docs/ux/dashboard-design-system.md`
- Canonical visual target: existing shared Dashboard Home runtime surface
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: no
- Existing shared pattern reused: `HomeLiveWidgets`, `RuntimeSidebarSection`, `RuntimeDataSection`, `DataTable`, `Tabs`
- New shared pattern introduced: no
- Design-memory entry reused: existing Dashboard Home runtime patterns
- Design-memory update required: no
- Visual gap audit completed: partial
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches: browser responsive screenshot proof remains open
- Required states: loading | empty | error | success; loading and error covered in this checkpoint, empty already covered by existing `HomeLiveWidgets` tests, success covered by selected-bot/table proof
- Responsive checks: desktop | tablet | mobile pending for browser proof
- Input-mode checks: pointer via component interactions; keyboard/touch pending
- Accessibility checks: accessible combobox/tab roles asserted
- Parity evidence: loading, retryable error, selected-bot, wallet KPI, Orders tab, and History tab rendered component proof passed.

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: test-only change can be reverted without runtime impact
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Dashboard Home remains `PARTIAL_LOCAL`.
- Gaps: browser responsive/keyboard proof and production-safe clickthrough.
- Inconsistencies: route reachability previously overstated action completeness.
- Architecture constraints: Dashboard Home owns the `/dashboard` runtime operator surface.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none for this task
- Sources scanned: project index, master ledger, scorecard, product action audit matrix, module confidence ledger
- Rows created or corrected: SOAR-DASHBOARD-001, REQ-FUNC-002, QA-002, RISK-002
- Assumptions recorded: local component proof can improve local evidence but cannot replace production-safe clickthrough
- Blocking unknowns: production credentials and safe representative data
- Why it was safe to continue: task is local, non-destructive, and uses existing mocks/fixtures

### 2. Select One Priority Mission Objective
- Selected task: Dashboard Home rendered action proof.
- Priority rationale: V1 scorecard priority 1; no LIVE approval needed.
- Why other candidates were deferred: controlled LIVE proof and production ops remain blocked by explicit operator inputs.

### 3. Plan Implementation
- Files or surfaces to modify: focused Web test and state docs.
- Logic: verify existing UI behavior under representative runtime payloads.
- Edge cases: loading shell, retryable error shell, stale selected-bot data after switching, and open orders/trades tabs showing wrong bot rows.

### 4. Execute Implementation
- Implementation notes: added a rendered `HomeLiveWidgets` audit case for loading/error state and a two-active-PAPER-bot audit with representative runtime aggregate payloads.

### 5. Verify and Test
- Validation performed: focused Dashboard rendered test, focused Dashboard pack, Web typecheck, guardrails, and diff check.
- Result: PASS; Dashboard Home remains `PARTIAL` because browser responsive/keyboard proof and production-safe clickthrough remain open.

### 6. Self-Review
- Simpler option considered: presenter-only test, rejected because the open gap is rendered component proof.
- Technical debt introduced: no
- Scalability assessment: focused test reuses existing mocks and component boundaries.
- Refinements made: aligned fixture expectations to the existing runtime KPI derivation rather than hardcoding the raw summary values.

### 7. Update Documentation and Knowledge
- Docs updated: task artifact, product action audit matrix, MVP planning.
- Context updated: project state, task board, module confidence ledger, requirements matrix, quality scenarios, risk register, known issues, regression log, system health, next steps.
- Learning journal updated: yes, added sequential V1 artifact refresh guardrail.

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
The earlier parallel `ops:project:index`/`ops:project:scan` attempt failed because scan depended on an index artifact that had not been written after an `EPERM`. The scripts passed when rerun sequentially with approved escalation.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY` or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB -> validation -> error handling -> test. Partial implementations, mock-only paths, placeholders, fake data, and temporary fixes are forbidden.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: V1 operator using Dashboard Home runtime truth
- Existing workaround or pain: route audits do not prove selected-bot/table behavior
- Smallest useful slice: local rendered component proof
- Success metric or signal: focused regression test passes
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: production-safe clickthrough still needed

## User Feedback Evidence
- `docs/governance/user-feedback-loop.md` reviewed: not applicable
- Feedback item IDs: none
- Feedback accepted: not applicable
- Feedback needs clarification: no
- Feedback conflicts: none
- Feedback deferred or rejected: none
- Active task changed by feedback: no
- New task created from feedback: no
- Design memory updated: no
- Learning journal updated: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: Dashboard Home runtime monitoring and recovery when loading fails
- SLI: local action proof pass/fail
- SLO: not applicable for component proof
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: component-level smoke through rendered test; browser smoke remains open.
- Rollback or disable path: revert test-only change

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: no, mocked service boundary for component proof
- Endpoint and client contract match: yes, existing service contract reused
- DB schema and migrations verified: not applicable
- Loading state verified: covered by existing tests; pending report
- Error state verified: covered by existing tests; pending report
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused rendered test plus adjacent Dashboard presenter/derivation pack.

## AI Testing Evidence
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: local fixture data only
- Trust boundaries: no production or secret access
- Permission or ownership checks: not changed
- Abuse cases: stale selected-bot data after switching
- Secret handling: no secrets used
- Security tests or scans: not applicable
- Fail-closed behavior: no LIVE action executed
- Residual risk: production-safe browser proof remains open

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: added rendered Dashboard Home proof for loading state, retryable error state, selected-bot switching, wallet KPI recalculation, Orders tab rows, History tab rows, and stale previous-bot row suppression.
- Files changed: `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx`; state/planning/evidence docs.
- How tested: focused rendered test (`3/3`), focused Dashboard pack (`35/35`), Web typecheck, repository guardrails, and diff check.
- What is incomplete: browser responsive/keyboard proof and production-safe clickthrough.
- Next steps: continue Dashboard Home browser evidence or move to Bot Runtime PAPER session proof if Dashboard browser proof is blocked by environment.
- Decisions made: no architecture or product behavior changes; kept work as local rendered evidence only.
