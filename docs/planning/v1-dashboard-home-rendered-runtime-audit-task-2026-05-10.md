# Task

## Header
- ID: V1-DASHBOARD-HOME-RENDERED-RUNTIME-AUDIT-2026-05-10
- Title: Add rendered Dashboard Home runtime TTP regression proof
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1-DASHBOARD-RUNTIME-TABLE-ACTION-AUDIT-2026-05-10
- Priority: P0
- Iteration: 2026-05-10 product action audit slice 4
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The previous slice locked Dashboard runtime table presenters. This slice adds a
small rendered `HomeLiveWidgets` proof without growing the already-large
`HomeLiveWidgets.test.tsx` file beyond guardrail budgets.

## Goal
Prove the real Dashboard Home component does not render prospective TTP on an
open position with negative live PnL.

## Scope
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx`
- `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`
- `.agents/state/*`
- `.codex/context/*`

## Success Signal
- User or operator problem: isolated presenter tests are not enough if the
  full Dashboard component wires data differently.
- Expected product or reliability outcome: the rendered Dashboard component
  preserves the same prospective TTP rule as the presenter.
- How success will be observed: focused rendered component test passes.
- Post-launch learning needed: yes

## Deliverable For This Stage
One focused rendered component regression test and updated source-of-truth
status.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new runtime systems
- do not add to the near-budget `HomeLiveWidgets.test.tsx` file
- do not run live-money or production-destructive actions

## Implementation Plan
1. Create a dedicated small rendered Dashboard Home audit test file.
2. Mock existing service boundaries with deterministic runtime payloads.
3. Assert the component renders the position and TTP header while hiding
   prospective TTP value/label for negative PnL.
4. Run focused Web tests, Web typecheck, guardrails, and diff check.
5. Update matrix and state/context docs.

## Acceptance Criteria
- Rendered Dashboard Home shows a runtime position with negative PnL.
- The TTP column is visible because dynamic stop columns are enabled.
- `Prospective` and the prospective TTP percent are not rendered.
- Negative PnL remains visually marked as error.

## Definition of Done
- [x] DEFINITION_OF_DONE.md standards are satisfied for touched scope.
- [x] Focused rendered Dashboard Home test passes.
- [x] Presenter regression suite still passes.
- [x] Web typecheck passes.
- [x] Repository guardrails and diff check pass.
- [x] Product action matrix and state/context docs are updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- live-money or destructive production actions

## Validation Evidence
- Tests:
  - `apps/web`: `vitest.CMD run src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx --run` PASS (`25/25`)
  - `apps/web`: `tsc.CMD --noEmit` PASS
  - root: `node scripts/repoGuardrails.mjs` PASS
  - root: `git diff --check` PASS
- Manual checks: reviewed rendered test path and matrix/state updates.
- Screenshots/logs: not captured; this is component-level render evidence.
- High-risk checks: no LIVE activation, no exchange mutation.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/web-dashboard-home.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/reference/dynamic-stop-display-contract.md`
  - `docs/architecture/reference/live-protection-state-parity-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home runtime workspace
- Canonical visual target: existing Dashboard Home component
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: Dashboard Home runtime table
- New shared pattern introduced: no
- Design-memory entry reused: runtime table fail-closed truth display
- Design-memory update required: no
- Visual gap audit completed: partial component render only
- Required states: success
- Responsive checks: not covered in this slice
- Input-mode checks: not applicable
- Accessibility checks: TTP table header role assertion
- Parity evidence: rendered component preserves presenter TTP suppression

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this test/docs slice
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: presenter proof did not yet prove full Dashboard component wiring.
- Gaps: rendered Dashboard Home TTP suppression needed a direct regression.
- Inconsistencies: none found after implementation.
- Architecture constraints: prospective protection must not masquerade as
  runtime truth.

### 2. Select One Priority Task
- Selected task: rendered Dashboard Home runtime TTP proof.
- Priority rationale: it directly extends the operator-reported TTP defect
  from presenter seam into the real component.
- Why other candidates were deferred: wallet KPI/responsive/error-state audit
  remains separate to keep this slice tiny and reversible.

### 3. Plan Implementation
- Files or surfaces to modify: new focused test file plus state docs.
- Logic: mock real service boundaries and render `HomeLiveWidgets`.
- Edge cases: negative PnL with `showDynamicStopColumns=true` and
  `ttpProtectedSource="prospective"`.

### 4. Execute Implementation
- Implementation notes: added a dedicated small test file to avoid increasing
  the existing near-budget test file.

### 5. Verify and Test
- Validation performed: focused Web tests, Web typecheck, guardrails, diff
  check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: adding another test to `HomeLiveWidgets.test.tsx`.
  Rejected because the file is near the web source budget.
- Technical debt introduced: no
- Scalability assessment: dedicated focused file keeps future rendered action
  audit slices small.
- Refinements made: corrected test setup to match existing locale and service
  dependency patterns.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`
  - this task artifact
- Context updated:
  - `.agents/state/current-focus.md`
  - `.agents/state/known-issues.md`
  - `.agents/state/system-health.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
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
This slice does not prove all Dashboard Home states. It only proves rendered
runtime table TTP suppression for the reported negative-PnL class.

## Production-Grade Required Contract

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, mocked at existing service boundaries
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not in this slice
- Error state verified: not in this slice
- Refresh/restart behavior verified: not in this slice
- Regression check performed: focused rendered component and presenter tests

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator
- Existing workaround or pain: manual UI checks found misleading runtime table
  behavior after broad readiness claims.
- Smallest useful slice: rendered component proof for the reported TTP class.
- Success metric or signal: focused test pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: continue module action matrix.

## User Feedback Evidence
- `docs/governance/user-feedback-loop.md` reviewed: yes
- Feedback item IDs: operator-reported Dashboard TTP/runtime table drift
- Feedback accepted: yes
- Feedback needs clarification: no
- Feedback conflicts: none
- Feedback deferred or rejected: broader browser/responsive audit deferred to
  next slice
- Active task changed by feedback: yes
- New task created from feedback: yes
- Design memory updated: no
- Learning journal updated: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: operator reads Dashboard runtime protection state.
- SLI: rendered component regression pass
- SLO: focused tests pass before commit
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused rendered component test
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: runtime trading metadata, no secrets
- Trust boundaries: protected dashboard UI consumes authenticated runtime APIs
- Permission or ownership checks: service/API-owned; this slice is display-only
- Abuse cases: misleading prospective protection on losing position
- Secret handling: none
- Security tests or scans: not applicable
- Fail-closed behavior: prospective protection is hidden when not live-positive
- Residual risk: full production-safe clickthrough remains open

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable

## Result Report

- Task summary: added a rendered `HomeLiveWidgets` regression proving
  negative-PnL positions do not show prospective TTP.
- Files changed:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx`
  - `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`
  - `.agents/state/*`
  - `.codex/context/*`
- How tested: focused Web tests (`25/25`), Web typecheck, guardrails, diff
  check.
- What is incomplete: broader Dashboard Home rendered/browser audit for
  selected-bot switching, wallet KPIs, loading/empty/error, responsive states,
  table tabs, and safe clickthrough.
- Next steps: continue the Dashboard Home rendered audit one state/action
  family at a time.
- Decisions made: use a dedicated small test file instead of growing
  `HomeLiveWidgets.test.tsx`.
