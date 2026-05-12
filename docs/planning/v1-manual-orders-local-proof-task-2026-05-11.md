# Task

## Header
- ID: V1-MANUAL-ORDERS-LOCAL-PROOF-2026-05-11
- Title: Manual Orders local proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: V1 Strategies local proof
- Priority: P0
- Module Confidence Rows: SOAR-MANUAL-ORDERS-001
- Requirement Rows: REQ-FUNC-010
- Quality Scenario Rows: QA-010
- Risk Rows: RISK-010
- Iteration: 10
- Operation Mode: TESTER
- Mission ID: V1-RELEASE-CONFIDENCE-2026-05-11
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
- Mission objective: Prove Manual Orders local contracts for V1.
- Release objective advanced: Move Manual Orders from `UNVERIFIED` toward local action proof.
- Included slices: API manual-order context/open/cancel/close/lifecycle/ownership/fail-closed proof; Web Dashboard Home manual-order and open-orders action proof; V1 state refresh.
- Explicit exclusions: LIVE exchange mutation, production clickthrough, standalone `/dashboard/orders` route implementation, broader Positions/Orders module release proof.
- Checkpoint cadence: after focused tests pass and after source-of-truth refresh.
- Stop conditions: failing PAPER open/cancel/close, unsafe LIVE risk guard, ownership isolation failure, hidden position-open without fill truth, or validation command failure that cannot be safely resolved.
- Handoff expectation: report evidence, changed files, residual risk, and next V1 checkpoint.

## Context
The V1 ledger marks Manual Orders as `UNVERIFIED`, requiring proof for PAPER order placement, validation, preview/context, and cancel/close paths with DB readback. Existing orders API tests and Dashboard Home manual-order tests appear to cover the local proof path; this task verifies and promotes that evidence if it passes.

## Goal
Run and record focused Manual Orders local proof without live exchange mutation or production actions.

## Scope
- `apps/api/src/modules/orders/*`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.manual-order*.test.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.open-orders*.test.tsx`
- `apps/web/src/features/dashboard-home/hooks/useManualOrderController.test.tsx`
- V1 source-of-truth state and generated operation reports.

## Success Signal
- User or operator problem: Manual order actions should not remain unverified when local action proofs cover non-live placement, validation, and lifecycle states.
- Expected product or reliability outcome: Manual Orders local evidence covers API and Web success/error/safety states.
- How success will be observed: Focused API and Web tests pass; V1 reports move Manual Orders to `PASS_LOCAL`.
- Post-launch learning needed: yes

## Deliverable For This Stage
Focused validation evidence and source-of-truth updates for Manual Orders local proof.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Run focused API Orders/manual-order tests with required process-only env.
2. Run focused Web Dashboard Home manual-order/open-orders tests.
3. If tests pass, promote Manual Orders to `PASS_LOCAL` in V1 ledgers and regenerate reports.
4. Run relevant validation gates and process cleanup checks.

## Acceptance Criteria
- API manual context, PAPER market open, order lifecycle, cancel/close, ownership, quantity rules, sync-state guards, and LIVE fail-closed boundaries pass locally.
- Web manual order submit, validation, context, action states, venue/scope semantics, and open-order cancel action tests pass locally.
- V1 source-of-truth files reflect the new evidence.

## Definition of Done
- [x] Focused API Manual Orders tests pass.
- [x] Focused Web Manual Orders tests pass.
- [x] Typecheck/guardrails relevant to touched scope pass.
- [x] V1 reports and source-of-truth files are refreshed.

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
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts src/modules/orders/orders.quantityRules.test.ts src/modules/orders/orders.positionScope.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/orders/orders.liveCancelBoundary.service.test.ts --sequence.concurrent=false --pool=forks --poolOptions.forks.singleFork=true --testTimeout=30000` passed (`7` files, `75` tests).
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx src/features/dashboard-home/hooks/useManualOrderController.test.tsx` passed (`6` files, `20` tests).
  - `pnpm --filter api run typecheck` passed.
  - `pnpm --filter web run typecheck` passed.
  - `node --check scripts/buildProjectIndex.mjs` passed.
  - `pnpm run quality:guardrails` passed.
  - `git diff --check` passed with line-ending warnings only.
- Manual checks: V1 reports regenerated with pinned inputs for 2026-05-11.
- Screenshots/logs: not applicable
- High-risk checks: no live exchange mutation or production data used; LIVE order actions remain blocked-risk without explicit safe plan; no leftover `chrome-headless-shell` or validation Node processes were found after the run.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: SOAR-MANUAL-ORDERS-001
- Requirements matrix updated: yes
- Requirement rows closed or changed: REQ-FUNC-010
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: QA-010
- Risk register updated: yes
- Risk rows closed or changed: RISK-010
- Reality status: partially verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/modules/api-orders.md`; `docs/modules/web-dashboard-home.md`; `docs/modules/system-modules.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home manual-order panel and runtime table patterns
- Canonical visual target: existing Dashboard Home manual-order and open-orders surfaces
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: existing Dashboard Home sidebar, manual-order controller, and runtime table actions
- New shared pattern introduced: no
- Design-memory entry reused: existing dashboard action patterns
- Design-memory update required: no
- Visual gap audit completed: not applicable
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches: production-safe browser clickthrough remains open
- Required states: loading | empty | error | success | blocked
- Responsive checks: not applicable to component proof
- Input-mode checks: keyboard/pointer through component tests
- Accessibility checks: component tests query roles/labels where available
- Parity evidence: existing UI left unchanged

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: docs/test-only promotion can be reverted
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Manual Orders is `UNVERIFIED` in V1 despite existing focused API/Web tests covering likely local proof.
- Gaps: production-safe browser clickthrough and live exchange mutation proof remain separate and risky.
- Inconsistencies: V1 product action matrix does not yet reflect focused Manual Orders evidence.
- Architecture constraints: Dashboard Home owns current manual-order UI; `/dashboard/orders` remains a redirected legacy route, not a standalone V1 page.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: Orders API module docs, Dashboard Home docs, tests, V1 ledger, product action matrix.
- Rows created or corrected: SOAR-MANUAL-ORDERS-001, REQ-FUNC-010, QA-010, RISK-010.
- Assumptions recorded: local automated proof can move Manual Orders to `PASS_LOCAL`, not `VERIFIED`.
- Blocking unknowns: production-safe browser data/environment and any explicit safe LIVE mutation plan.
- Why it was safe to continue: tests use local fixtures/mocks and do not place live exchange orders.

### 2. Select One Priority Mission Objective
- Selected task: Manual Orders local proof.
- Priority rationale: Manual Orders is the next unblocked P0 module after Strategies in the refreshed V1 ledger.
- Why other candidates were deferred: Positions/Orders broader proofs follow this order flow checkpoint; production-safe proof lanes need approved non-local data.

### 3. Plan Implementation
- Files or surfaces to modify: likely source-of-truth docs only unless tests expose a defect.
- Logic: run existing focused tests first; implement only if a real failure appears.
- Edge cases: missing price truth, reverse-side conflict, selected-bot context, ownership isolation, quantity/min-notional, LIVE risk ack, exchange-backed cancel fail-closed behavior, submitted/waiting/fill/open/blocked UI states.

### 4. Execute Implementation
- Implementation notes: No production code changes were needed; existing focused Manual Orders tests were run and promoted into V1 source of truth.

### 5. Verify and Test
- Validation performed: focused API/Web Manual Orders tests and V1 report regeneration.
- Result: Manual Orders moved to `PASS_LOCAL`; V1 remains `NO-GO`.

### 6. Self-Review
- Simpler option considered: promote Manual Orders without rerunning tests; rejected because V1 rows require fresh evidence.
- Technical debt introduced: no
- Scalability assessment: proof-only checkpoint keeps code stable and evidence current.
- Refinements made: none needed.

### 7. Update Documentation and Knowledge
- Docs updated: V1 product action matrix, generated V1 reports, planning queue, execution plan, and state ledgers.
- Context updated: project state, task board, current focus, known issues, next steps, delivery map, module confidence, requirement matrix, quality scenarios, risk register, regression log.
- Learning journal updated: not applicable.

## Review Checklist (mandatory)
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
LIVE order actions remain `BLOCKED_RISK` without an explicit safe test plan.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: authenticated operator placing manual PAPER orders from Dashboard Home
- Existing workaround or pain: Manual Orders remained listed as unverified despite candidate proof coverage.
- Smallest useful slice: local API/Web Manual Orders proof.
- Success metric or signal: focused tests pass and V1 state moves Manual Orders to `PASS_LOCAL`.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: production-safe clickthrough

## User Feedback Evidence
- `docs/governance/user-feedback-loop.md` reviewed: yes
- Feedback item IDs: not applicable
- Feedback accepted: continue toward V1
- Feedback needs clarification: none for this local proof
- Feedback conflicts: none
- Feedback deferred or rejected: LIVE exchange mutation proof deferred until explicit safe plan
- Active task changed by feedback: yes
- New task created from feedback: yes
- Design memory updated: no
- Learning journal updated: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: manual PAPER order context, open, lifecycle, cancel/close, and Dashboard Home operator action state
- SLI: successful focused Manual Orders proof commands
- SLO: all focused Manual Orders proof commands pass before local confidence promotion
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused API/Web tests
- Rollback or disable path: revert docs/test-only promotion

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes for API tests; Web tests use component service boundaries
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: yes
- Error state verified: yes
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused API/Web Manual Orders tests.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: manual order intent, bot/wallet/order/position ownership, and live-risk metadata
- Trust boundaries: authenticated Orders API, Dashboard Home UI, exchange adapter boundary
- Permission or ownership checks: API order/position ownership and Web selected-bot scope tests passed.
- Abuse cases: cross-user order access, reverse-side unsafe order, missing fill price, live execution without risk ack, exchange-backed local cancel bypass
- Secret handling: not applicable
- Security tests or scans: API ownership, LIVE risk guard, exchange-backed cancel boundary, missing price truth, and reverse conflict tests passed.
- Fail-closed behavior: missing price truth, unsafe reverse-side open, LIVE risk guard, no matching strategy context, and exchange-backed local cancel bypass tests passed.
- Residual risk: production-safe browser proof and live exchange mutation proof remain missing

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: Promoted fresh local Manual Orders API/Web proof into V1 source of truth without production code changes.
- Files changed: V1 state/planning/report files and this task file.
- How tested: API Manual Orders tests (`75/75`), Web Manual Orders tests (`20/20`), V1 report regeneration.
- What is incomplete: production-safe Manual Orders browser clickthrough remains open; LIVE order actions remain blocked-risk without explicit safe plan.
- Next steps: continue from the refreshed V1 ledger; next unblocked local module is Positions.
- Decisions made: none
