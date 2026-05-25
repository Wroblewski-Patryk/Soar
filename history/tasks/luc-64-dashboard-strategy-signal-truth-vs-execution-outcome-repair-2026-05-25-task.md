# Task

## Header
- ID: LUC-64
- Title: [Soar] Dashboard strategy-signal truth vs execution outcome repair
- Task Type: planning
- Current Stage: planning
- Status: IN_PROGRESS
- Owner: Engineering Delivery Lead (coordinator)
- Depends on: DASH-RUNTIME-SIGNAL-CONDITION-ACTIVE-2026-05-25, LUC-46, LUC-45-C
- Priority: P0
- Module Confidence Rows: SOAR-DASHBOARD-001, SOAR-FEATURE-WEB-RUNTIME-SURFACES
- Requirement Rows: REQ-RUNTIME-TRUTH-SEPARATION, REQ-DASHBOARD-SIGNAL-FIDELITY
- Quality Scenario Rows: runtime correctness, UX truthfulness, regression safety
- Risk Rows: RISK-DASH-SIGNAL-FALSE-POSITIVE, RISK-EXECUTION-TRUTH-CONFLATION
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
Issue `LUC-64` targets a critical correctness boundary: Dashboard strategy-signal
truth must reflect matched strategy conditions, while execution outcome truth
(opened/blocked/no-trade) remains a separate runtime layer. The frontend repair
for matched condition visibility is already implemented locally in
`DASH-RUNTIME-SIGNAL-CONDITION-ACTIVE-2026-05-25`; this issue now needs
delivery control to align backend/source semantics, focused QA proof, and
state parity before closure.

## Goal
Convert `LUC-64` from a broad symptom report into an executable, single-owner
delivery packet with explicit lane ownership, proof gates, and closure criteria.

## Scope
- Delivery decomposition and integration only.
- No new product/runtime feature implementation in this issue.
- Source-of-truth updates:
  - `history/tasks/luc-64-dashboard-strategy-signal-truth-vs-execution-outcome-repair-2026-05-25-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Lock the issue contract: strategy-condition truth and execution-outcome truth remain separated.
2. Define specialist lanes with single accountable owners and non-overlapping outputs.
3. Define the minimal verification path that can close the issue without full-stack retest.
4. Sync board/state so subsequent heartbeats execute without rediscovery.

## Responsibility Lanes

| Lane | Owner | Affected layer | Input docs/state | Expected output | Required verification | Dependency |
| --- | --- | --- | --- | --- | --- | --- |
| LUC-64-A | Frontend Engineer | Dashboard runtime signals UI | `DASH-RUNTIME-SIGNAL-CONDITION-ACTIVE-2026-05-25`, `docs/modules/web-dashboard-home.md` | Confirmed UI behavior for matched LONG/SHORT condition lines independent of execution outcome state | Focused signal tests + lint + typecheck (already available, rerun only if new diff) | none |
| LUC-64-B | Backend API Engineer | Runtime signal payload semantics | `docs/architecture/reference/runtime-signal-merge-contract.md`, runtime signal APIs | Assert backend payload still separates matched condition lines from execution/position outcome fields | Focused API/runtime contract check for touched endpoints/DTOs | can run in parallel with A |
| LUC-64-C | QA/Test Automation | Cross-layer regression proof | Outputs of A+B | Evidence packet covering blocked-execution scenario with matched strategy condition | Focused web+api checks for strategy-condition vs outcome separation | waits for A+B |
| LUC-64-D | Docs/Memory Lead | Module/state parity | Outputs of A-C | Module confidence + board/state/doc updates with residual risk | Source-of-truth parity check | waits for C |
| Coordinator | Engineering Delivery Lead | Integration and final disposition | A-D outputs | Final `done`/`blocked`/`in_review` decision with explicit residual risk | Parent acceptance gate | blocks closure |

## Integration Order
1. `LUC-64-A` + `LUC-64-B` (parallel).
2. `LUC-64-C` on first stable candidate.
3. `LUC-64-D` parity sync.
4. Coordinator final disposition.

## Acceptance Criteria
- Strategy-condition activity and execution outcome remain explicitly separated in implementation and tests.
- Evidence exists for blocked execution with matched signal condition visibility.
- Source-of-truth files route the next executor through owners, proof, and dependency order.

## Definition of Done
- [x] `LUC-64` has a delivery packet with single-owner lanes and integration order.
- [x] Required evidence contract is defined for frontend, backend, QA, and docs parity.
- [x] Board/project state are synced to this packet.
- [ ] Specialist lane outputs are integrated with proof.
- [ ] Final issue disposition is set from integrated evidence.

## Validation Evidence
- Manual checks:
  - `AGENTS.md`
  - LuckySparrow shared work-loop and responsibility-boundary contracts
  - `.agents/state/active-mission.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- Tests: not applicable (planning/integration slice only)
- Reality status: verified (for delivery decomposition), implementation pending in specialist lanes.

## Result Report
- `LUC-64` is now an actionable multi-lane delivery contract instead of an unsliced critical issue.
- Role boundary was preserved: no feature-code changes were performed by Delivery Lead.
- Next heartbeat can execute directly through A/B ownership instead of re-planning.
