# Task

## Header
- ID: V1-DASHBOARD-RUNTIME-TABLE-ACTION-AUDIT-2026-05-10
- Title: Verify Dashboard runtime table action and display contracts
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1-PRODUCT-ACTION-AUDIT-P0-2026-05-10
- Priority: P0
- Iteration: 2026-05-10 product action audit slice 3
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator found that previous V1 readiness statements overstated product
correctness because route reachability did not prove UI actions or table
semantics. Bots local action evidence is closed. The next active matrix item is
Dashboard Home/runtime table proof for representative runtime payloads,
including PnL, DCA, TTP/TSL, orders, and row actions.

## Goal
Lock Dashboard runtime table presenter behavior for the high-risk rows that
operators use to decide whether a bot/runtime is behaving correctly.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- `history/audits/v1-product-action-audit-matrix-2026-05-10.md`
- `.agents/state/*`
- `.codex/context/*`

## Success Signal
- User or operator problem: table/action drift can hide broken bot behavior or
  show misleading protection data.
- Expected product or reliability outcome: Dashboard runtime table semantics
  are regression-locked for positive, zero, and negative PnL plus blocked and
  allowed actions.
- How success will be observed: focused Web tests pass and matrix status no
  longer claims unverified table behavior for this slice.
- Post-launch learning needed: yes

## Deliverable For This Stage
Focused Web test coverage and source-of-truth updates for Dashboard runtime
table action/display contracts.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it
- do not activate LIVE bots or perform live-money actions

## Implementation Plan
1. Review Dashboard runtime table architecture and dynamic-stop contracts.
2. Add focused presenter tests for open-position PnL, TTP/TSL, blocked row
   actions, and open-order cancel behavior.
3. Run focused Web tests, Web typecheck, guardrails, and diff check.
4. Update the product action audit matrix and state/context docs.

## Acceptance Criteria
- Prospective TTP is hidden for zero and negative live PnL at table-presenter
  level.
- Backend/runtime TTP is still displayed as runtime truth and suppresses TSL.
- TSL displays only when no TTP display is active.
- Negative PnL and PnL% render with error styling.
- Non-actionable open positions disable edit/close actions.
- Local cancelable open orders invoke cancel action; non-cancelable and
  exchange-backed orders remain blocked/read-only.

## Definition of Done
- [x] DEFINITION_OF_DONE.md standards are satisfied for touched scope.
- [x] Focused Dashboard runtime table tests pass.
- [x] Web typecheck passes.
- [x] Repository guardrails pass.
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
- implicit stage skipping
- live-money or destructive production actions

## Validation Evidence
- Tests:
  - `apps/web`: `& .\node_modules\.bin\vitest.CMD run src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx --run` PASS (`24/24`)
  - `apps/web`: `& .\node_modules\.bin\tsc.CMD --noEmit` PASS
  - root: `node scripts/repoGuardrails.mjs` PASS
  - root: `git diff --check` PASS with line-ending warning only
- Manual checks:
  - reviewed Dashboard Home module ownership and dynamic-stop contracts
  - reviewed focused diff for action/display behavior
- Screenshots/logs: not applicable for presenter-only slice
- High-risk checks: no LIVE activation, no exchange mutation

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
- Follow-up architecture doc updates: not expected

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home runtime table implementation
- Canonical visual target: existing shared table/action pattern
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: `DataTable`, `TableIconButtonAction`
- New shared pattern introduced: no
- Design-memory entry reused: runtime table action-tone and fail-closed row
  behavior
- Design-memory update required: no
- Visual gap audit completed: not applicable
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches: rendered browser pass remains a later matrix lane
- Required states: success, disabled/blocked
- Responsive checks: not applicable for presenter-only behavior test
- Input-mode checks: pointer, keyboard semantics through button disabled/name
- Accessibility checks: action buttons keep accessible labels
- Parity evidence: presenter tests now cover prospective TTP, backend TTP,
  TSL-only display, negative PnL, non-actionable positions, and open-order
  cancelability

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the focused test/docs slice and any companion code
  change if validation fails
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Dashboard action matrix still marks runtime table behavior as open.
- Gaps: presenter coverage did not fully prove zero/negative PnL, blocked
  position actions, and order cancelability behavior.
- Inconsistencies: route reachability evidence was previously conflated with
  action correctness.
- Architecture constraints: configured/prospective protection must not
  masquerade as accepted runtime truth.

### 2. Select One Priority Task
- Selected task: Dashboard runtime table action/display audit.
- Priority rationale: this is the next highest-risk operator surface after
  Bots deletion and TTP examples.
- Why other candidates were deferred: other modules remain in the matrix but
  must be closed one at a time.

### 3. Plan Implementation
- Files or surfaces to modify: focused Web tests and audit/state docs.
- Logic: lock existing presenter behavior and add missing regression proofs.
- Edge cases: zero PnL, negative PnL, backend TTP vs prospective TTP, TSL
  suppression, non-actionable rows, cancelable vs non-cancelable orders.

### 4. Execute Implementation
- Implementation notes: added focused presenter helpers and regression tests
  for local cancelable orders, terminal read-only orders, negative PnL styling,
  prospective TTP hiding at zero/negative PnL, backend TTP precedence, TSL-only
  display, and non-actionable position action buttons.

### 5. Verify and Test
- Validation performed: focused presenter test, Web typecheck, guardrails, and
  diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only updating the matrix. Rejected because the
  operator asked for real action proof, not more claims.
- Technical debt introduced: no
- Scalability assessment: tests stay within existing presenter seam and do not
  add runtime logic.
- Refinements made: kept this as a presenter/action evidence slice and updated
  the matrix as `PARTIAL_LOCAL` instead of overstating whole Dashboard Home
  readiness.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `history/audits/v1-product-action-audit-matrix-2026-05-10.md`
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
This task is local UI/presenter evidence. It does not prove production runtime
sessions or LIVE exchange behavior.

## Production-Grade Required Contract

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: not applicable
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused Web presenter suite plus Web typecheck

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: authenticated dashboard operator
- Existing workaround or pain: manual checking finds table/action drift after
  broad readiness claims.
- Smallest useful slice: runtime table presenters for high-risk position/order
  rows.
- Success metric or signal: focused tests pass and matrix status is updated.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: continue matrix rows.

## User Feedback Evidence
- `docs/governance/user-feedback-loop.md` reviewed: yes
- Feedback item IDs: operator-reported bot deletion and TTP/runtime table drift
- Feedback accepted: yes
- Feedback needs clarification: no
- Feedback conflicts: none
- Feedback deferred or rejected: production destructive clickthrough deferred
  until a safe fixture plan exists
- Active task changed by feedback: yes
- New task created from feedback: yes
- Design memory updated: no
- Learning journal updated: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: operator reads Dashboard runtime tables and acts on
  position/order state.
- SLI: local regression pass for table action/display contracts
- SLO: all focused tests pass before commit
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused Web tests
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: runtime trading metadata, no secrets
- Trust boundaries: protected dashboard UI consumes authenticated runtime APIs
- Permission or ownership checks: backend/API-owned; UI respects row
  `actionable=false`
- Abuse cases: misleading UI action enabled for non-actionable row
- Secret handling: none
- Security tests or scans: not applicable for presenter-only slice
- Fail-closed behavior: non-actionable and exchange-backed rows stay blocked
- Residual risk: production-safe rendered clickthrough remains separate

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable

## Result Report

- Task summary: Dashboard runtime table presenter behavior is locally
  regression-locked for high-risk position/order action and display cases.
- Files changed:
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
  - `history/audits/v1-product-action-audit-matrix-2026-05-10.md`
  - `.agents/state/*`
  - `.codex/context/*`
- How tested:
  - focused Web presenter tests PASS (`24/24`)
  - Web typecheck PASS
  - repository guardrails PASS
  - diff check PASS
- What is incomplete: full Dashboard Home rendered browser audit remains open
  for selected bot, wallet KPIs, loading/empty/error, responsive behavior, and
  production-safe clickthrough.
- Next steps: run the rendered Dashboard Home component/browser action audit.
- Decisions made: classify Dashboard Home and Bot Runtime as `PARTIAL_LOCAL`
  instead of `PASS` because only the runtime table presenter slice is proven.
