# Task

## Header
- ID: V1-DASHBOARD-HOME-ACTIVE-RUNTIME-BROWSER-PROOF-2026-05-11
- Title: Dashboard Home active PAPER runtime browser proof
- Task Type: release
- Current Stage: verification
- Status: REVIEW
- Owner: QA/Test
- Depends on: V1-DASHBOARD-HOME-BROWSER-PROOF-2026-05-11
- Priority: P0
- Module Confidence Rows: SOAR-DASHBOARD-001
- Requirement Rows: REQ-FUNC-002
- Quality Scenario Rows: QA-002
- Risk Rows: RISK-002
- Iteration: 2026-05-11-03
- Operation Mode: ARCHITECT
- Mission ID: V1-DASHBOARD-HOME-ACTIVE-RUNTIME-BROWSER-PROOF-2026-05-11
- Mission Status: PARTIALLY_VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed in the current V1 mission.
- [x] `.agents/core/mission-control.md` was reviewed in the current V1 mission.
- [x] Missing or template-like state tables were not found for this scope.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: Prove Dashboard Home active PAPER runtime behavior in a real local browser using the existing paper runtime snapshot.
- Release objective advanced: Reduce the top V1 Dashboard Home `PARTIAL_LOCAL` proof gap for active runtime data.
- Included slices: import existing paper runtime snapshot, start local API/Web, authenticate local owner, open `/dashboard`, verify active PAPER runtime positions/tabs/KPIs where rendered, capture desktop/mobile/tablet or blockers, update source-of-truth docs.
- Explicit exclusions: production clickthrough, LIVE/exchange mutations, destructive DB reset, new data-seeding framework, unrelated UI polish.
- Checkpoint cadence: update task and state files after browser proof or blocker.
- Stop conditions: snapshot import fails, local API/Web cannot serve authenticated dashboard, active runtime data does not appear through existing approved contracts, or proof would require destructive action.
- Handoff expectation: record exact evidence, remaining gaps, and next smallest Dashboard/Bot Runtime proof.

## Context
The V1 scorecard still ranks Dashboard Home first. Empty/onboarding browser proof is now captured, but active selected-bot runtime proof remains open. The repository already contains `apps/api/prisma/snapshots/paper-runtime-snapshot.json` and `snapshot:paper:import`, which is the approved local representative data path for PAPER runtime evidence.

## Goal
Use existing snapshot data to verify that Dashboard Home renders active PAPER runtime truth in a browser without mock-only paths or manual ad hoc DB writes.

## Success Signal
- User or operator problem: operators must trust selected active bot runtime data, not only empty onboarding.
- Expected product or reliability outcome: `/dashboard` shows active PAPER runtime data from the real local API and remains usable across responsive browser checks.
- How success will be observed: browser DOM/screenshot evidence, console health, API/readback checks, and updated module confidence.
- Post-launch learning needed: no

## Deliverable For This Stage
Browser proof report for active PAPER Dashboard Home runtime state, or a truthful blocker report if the approved snapshot cannot satisfy the Dashboard Home browser proof.

## Scope
- Snapshot: `apps/api/prisma/snapshots/paper-runtime-snapshot.json`
- Import script: `apps/api/scripts/importPaperRuntimeSnapshot.ts`
- Route: `/dashboard`
- App surfaces: `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx` and existing dashboard home runtime components.
- Docs/state: this task file, module confidence ledger, requirement matrix, quality/risk rows, V1 matrix, task board, project state, next steps, system health.

## Implementation Plan
1. Import the existing PAPER runtime snapshot with process-only local env overrides needed by API readiness.
2. Start local API/Web and verify `/health`.
3. Authenticate the snapshot owner or a safe local account through real API/browser session.
4. Open `/dashboard` in a browser and wait for active runtime content.
5. Verify selected bot name, PAPER mode/runtime surface, positions/tabs/KPIs where present, console health, and responsive behavior.
6. If active runtime does not render, record the exact API/browser blocker and do not mark verified.
7. Run targeted automated checks, refresh V1 artifacts, update docs/state, and clean up processes.

## Acceptance Criteria
- `/dashboard` active PAPER runtime state is checked through a browser against local API/Web.
- Representative snapshot import result is recorded.
- Desktop and at least one additional viewport are checked, or blocker is recorded.
- At least one active-runtime interaction is exercised, or blocker is recorded.
- Console health and framework overlay status are recorded.
- Source-of-truth docs reflect the result truthfully.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- do not mutate production or LIVE trading state
- do not print secret values

## Definition of Done
- [x] Browser evidence captured or blocker recorded.
- [x] Real local API/Web path used.
- [x] Validation commands and cleanup evidence recorded.
- [x] Module confidence, requirement, quality, risk, task board, and project state updated.
- [x] `DEFINITION_OF_DONE.md` reviewed and applicable evidence recorded.

## Stage Exit Criteria
- [ ] The output matches the declared `Current Stage`.
- [ ] Work from later stages was not mixed in without explicit approval.
- [ ] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new seeding framework
- manual SQL/DB write workaround
- fake runtime data in Web
- destructive DB reset
- production or LIVE mutations
- architecture changes without explicit approval

## Validation Evidence
- Tests: PASS. Targeted Web Vitest passed (`4` files, `36` tests); Web typecheck passed; repository guardrails passed; V1 generators refreshed sequentially (`project-index`, `v1-static-issue-scan`, `v1-master-state-ledger`, `v1-completion-scorecard`); `git diff --check` passed with line-ending warnings only.
- Manual checks: PARTIAL PASS. Existing `snapshot:paper:import` imported 1 market universe, 1 symbol group, 1 strategy, 1 active PAPER bot, 1 bot market group, 1 market-group strategy link, and 3 open position fixture rows. Local API `/health` returned `200`; Web `/auth/login` returned `200`. Authenticated browser fallback proof opened `http://localhost:3002/dashboard` as the snapshot owner, rendered bot `asd`, `PAPER`, symbols `BTCUSDT`, `BNBUSDT`, and `ETHUSDT`, tabs `Positions`, `Orders`, and `History`, portfolio `10,000.00`, no framework overlay, and no console/page errors on desktop `1280x720`, tablet `768x1024`, and mobile `390x844`.
- Screenshots/logs: Playwright fallback screenshots saved outside repo in `C:\Users\wrobl\AppData\Local\Temp\soar-active-runtime-proof`: `desktop-dashboard.png`, `desktop-after-orders-tab.png`, `tablet-dashboard.png`, `mobile-dashboard.png`.
- Cleanup: PASS. Stopped API/Web dev-server processes started for this proof; final port check showed no `3001`/`3002` listeners. `chrome-headless-shell` check returned no processes.
- High-risk checks: no production/LIVE actions planned
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: SOAR-DASHBOARD-001
- Requirements matrix updated: yes
- Requirement rows closed or changed: REQ-FUNC-002
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: QA-002
- Risk register updated: yes
- Risk rows closed or changed: RISK-002
- Reality status: partially verified; not full pass. Dashboard Home shows active bot configuration and PAPER capital state, but runtime table remains `NO_SESSION` with `No open positions` even though the imported snapshot contains 3 DB open position rows. API readback returned `/dashboard/bots` `200`, aggregate runtime `200`, and `/runtime-sessions` `[]`; the current approved snapshot does not prove an active runtime session.

## Architecture Evidence
- Architecture source reviewed: `docs/modules/web-dashboard-home.md`; `docs/architecture/08_operator-surfaces-and-routing.md`
- Fits approved architecture: yes for verification path; the proof reused the approved snapshot import and authenticated Dashboard Home API contracts.
- Mismatch discovered: no architecture mismatch; a data/evidence gap remains between imported position fixture rows and the runtime-session-backed Dashboard Home table.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: pending

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home runtime surface and `docs/ux/dashboard-design-system.md`
- Canonical visual target: current Dashboard Home active runtime route behavior
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: existing dashboard layout, tabs, tables, state components
- New shared pattern introduced: no
- Design-memory entry reused: existing dashboard design memory
- Design-memory update required: no
- Visual gap audit completed: pending
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: pending
- Remaining mismatches: pending
- Required states: success active runtime; loading/empty/error already covered by previous tasks
- Responsive checks: desktop | tablet | mobile
- Input-mode checks: pointer | keyboard | touch when practical
- Accessibility checks: focusable runtime controls/tabs where present
- Parity evidence: pending

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: no file changes; process-only local test keyring may be used
- Health-check impact: none
- Smoke steps updated: no deployment smoke change; local browser proof blocker recorded in planning/state.
- Rollback note: verification-only task unless a small local UI defect is found
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Dashboard Home still lacks active selected-bot runtime browser proof.
- Gaps: empty/onboarding browser proof exists, active PAPER runtime proof does not.
- Inconsistencies: none confirmed yet.
- Architecture constraints: use existing snapshot/import and authenticated Dashboard Home API contracts.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: V1 scorecard, next steps, snapshot import script, snapshot README, snapshot JSON.
- Rows created or corrected: pending
- Assumptions recorded: local snapshot import is acceptable because it is the existing approved PAPER runtime data path.
- Blocking unknowns: whether the snapshot contains enough session/order/trade rows for tab proof or only open positions.
- Why it was safe to continue: local-only import through approved script; no production or LIVE mutation.

### 2. Select One Priority Mission Objective
- Selected task: Dashboard Home active runtime browser proof.
- Priority rationale: Dashboard Home remains priority 1 in the V1 scorecard.
- Why other candidates were deferred: Bot Runtime/Auth/Profile remain important but follow the current top Dashboard proof gap.

### 3. Plan Implementation
- Files or surfaces to modify: docs/state only unless proof exposes a small release-blocking UI defect.
- Logic: import snapshot, run browser proof, update truth.
- Edge cases: no runtime sessions, stale snapshot rows, local auth/session issues, console errors, responsive overflow.

### 4. Execute Implementation
- Implementation notes: imported the approved PAPER runtime snapshot, started local API/Web with process-only test secret overrides, used Browser first, then fell back to standalone Playwright because the Browser runtime reported no active Codex browser pane. Authenticated the snapshot owner through `/auth/login`; verified `/dashboard` desktop/tablet/mobile rendering and exercised the `Orders` tab.

### 5. Verify and Test
- Validation performed: `snapshot:paper:import`; API `/health` `200`; Web `/auth/login` `200`; authenticated Playwright browser proof on desktop/tablet/mobile; API readback for `/dashboard/bots`, aggregate runtime, and runtime sessions.
- Result: PARTIAL PASS with blocker. Active PAPER bot configuration, symbols, PAPER mode, wallet baseline, responsive rendering, console health, and `Orders` tab interaction are proven. The active runtime session/position table is not proven because the UI reports `NO_SESSION`, `No open positions`, and `/runtime-sessions` returns `[]`.

### 6. Self-Review
- Simpler option considered: asserting active-runtime proof from rendered tests only; rejected because browser proof is the remaining gap.
- Technical debt introduced: no
- Scalability assessment: verification-only slice uses existing data import path.
- Refinements made: captured a Windows dev-server startup guardrail in `.codex/context/LEARNING_JOURNAL.md` after reproducing the `Path/PATH` and child `node` failure pattern.

### 7. Update Documentation and Knowledge
- Docs updated: this task created.
- Context updated: yes.
- Learning journal updated: yes, Windows dev-server child `Path` guardrail.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
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
This task may improve Dashboard Home but still leave production-safe clickthrough and LIVE-risk flows outside scope.

## Production-Grade Required Contract
- Goal: prove Dashboard Home active PAPER runtime browser state.
- Scope: existing snapshot import, local API/Web, `/dashboard`, docs/state.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: use `DEFINITION_OF_DONE.md` as applicable for verification-only scope.
- Result Report: pending.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator monitoring active PAPER bot
- Existing workaround or pain: rendered tests prove logic but browser proof on real local API data is missing.
- Smallest useful slice: import existing snapshot and verify Dashboard Home active runtime locally.
- Success metric or signal: SOAR-DASHBOARD-001 gets active runtime browser evidence or a concrete blocker.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## User Feedback Evidence
- `docs/governance/user-feedback-loop.md` reviewed: not applicable
- Feedback item IDs: not applicable
- Feedback accepted: not applicable
- Feedback needs clarification: no
- Feedback conflicts: none
- Feedback deferred or rejected: none
- Active task changed by feedback: no
- New task created from feedback: yes
- Design memory updated: no
- Learning journal updated: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable for verification-only UI slice
- Critical user journey: authenticated operator opens Dashboard Home with active PAPER runtime data.
- SLI: page reachable and active runtime surface renders without relevant console/runtime errors.
- SLO: local proof pass for verification session.
- Error budget posture: not applicable
- Health/readiness check: pending
- Logs, dashboard, or alert route: browser console logs and API health
- Smoke command or manual smoke: pending
- Rollback or disable path: not applicable for verification-only scope

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: pending
- Endpoint and client contract match: pending
- DB schema and migrations verified: not applicable unless import/startup fails
- Loading state verified: previously rendered and observed
- Error state verified: previously rendered
- Refresh/restart behavior verified: pending
- Regression check performed: pending

## AI Testing Evidence
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: local dev account/session and local fixture runtime data
- Trust boundaries: browser -> web -> local API -> local DB
- Permission or ownership checks: authenticated user owns imported snapshot data
- Abuse cases: no destructive or LIVE actions in scope
- Secret handling: do not print local secrets
- Security tests or scans: pending
- Fail-closed behavior: local auth required for `/dashboard`
- Residual risk: production auth/clickthrough out of scope

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: Dashboard Home active PAPER local browser proof is partially verified. The route renders the selected active PAPER bot `asd`, strategy/market context, symbols, wallet baseline, responsive layout, and safe tab interaction, but the approved snapshot does not produce a running runtime session or visible open-position rows in the Dashboard Home table.
- Files changed: this task file; `.codex/context/LEARNING_JOURNAL.md`; `.agents/state/*` source-of-truth files; `.codex/context/TASK_BOARD.md`; `.codex/context/PROJECT_STATE.md`; `docs/planning/mvp-next-commits.md`; `docs/planning/mvp-execution-plan.md`; `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`.
- How tested: imported `apps/api/prisma/snapshots/paper-runtime-snapshot.json` via `snapshot:paper:import`; started local API/Web; verified API `/health` `200`; verified Web `/auth/login` `200`; authenticated snapshot owner; ran Playwright proof for `/dashboard` at desktop `1280x720`, tablet `768x1024`, and mobile `390x844`; clicked the `Orders` tab and observed `No open orders`; ran targeted Web Vitest (`4` files, `36` tests), Web typecheck, repository guardrails, sequential V1 artifact generators, `git diff --check`, and process cleanup checks.
- What is incomplete: full active runtime table proof. `/runtime-sessions` returns `[]`, status is `NO_SESSION`, and table shows `No open positions` despite 3 imported position fixture rows.
- Next steps: build or import a representative PAPER runtime-session fixture that drives the same API contract Dashboard Home uses for positions/orders/history, then rerun this proof and proceed to production-safe clickthrough.
- Decisions made: keep this as `PARTIALLY_VERIFIED`, not `DONE`, because `DEFINITION_OF_DONE.md` requires real end-to-end data-flow evidence.

## Follow-Up Closure
- 2026-05-11: Follow-up
  `V1-DASHBOARD-HOME-RUNTIME-SESSION-FIXTURE-2026-05-11` fixed the local
  fixture/read-contract gap by updating the existing PAPER snapshot import to
  create deterministic wallet/session/stat/event data. The active browser proof
  now renders runtime-session-backed open rows for `BTCUSDT`, `BNBUSDT`, and
  `ETHUSDT`; this task remains a truthful blocker discovery record.
