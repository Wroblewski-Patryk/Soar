# Task

## Header
- ID: LUC-64
- Title: [Soar] Dashboard strategy-signal truth vs execution outcome repair
- Task Type: implementation
- Current Stage: verification
- Status: DONE
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
- Mission Status: VERIFIED

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

## Current Stage
- Current Stage: implementation

## Scope
- Delivery decomposition and integration only.
- No new product/runtime feature implementation in this issue.
- Source-of-truth updates:
  - `history/tasks/luc-64-dashboard-strategy-signal-truth-vs-execution-outcome-repair-2026-05-25-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`

## Current Evidence Snapshot
- `A` is complete with evidence:
  - `history/tasks/dashboard-runtime-signal-condition-active-2026-05-25-task.md`
- `C` is complete with evidence:
  - `history/tasks/luc-67-qa-verify-matched-strategy-signal-blocked-execution-reason-2026-05-25-task.md`
- `B` is not integrated yet and is now split as the next narrow blocker:
  - `history/tasks/luc-64-b-backend-runtime-signal-payload-separation-proof-2026-05-26-task.md`
- `D` is blocked until `B` evidence is attached.

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
- Current heartbeat close condition: `LUC-64-B` produces explicit backend payload-semantics evidence and `LUC-64-D` records that evidence into parity/doc state.

## Definition of Done
- [x] `LUC-64` has a delivery packet with single-owner lanes and integration order.
- [x] Required evidence contract is defined for frontend, backend, QA, and docs parity.
- [x] Board/project state are synced to this packet.
- [x] Backend blocker lane `LUC-64-B` evidence is integrated.
- [x] Docs/state parity lane `LUC-64-D` records backend evidence and residual risk.
- [x] Final issue disposition is set from integrated evidence.

## Validation Evidence
- Manual checks:
  - `AGENTS.md`
  - LuckySparrow shared work-loop and responsibility-boundary contracts
  - `.agents/state/active-mission.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- Tests: targeted web signal-condition regression evidence is already present via `LUC-67`; backend contract checks remain pending.
- Reality status: verified (for delivery decomposition), implementation pending in specialist lanes.

## Result Report
- `LUC-64` is now an actionable multi-lane delivery contract instead of an unsliced critical issue.
- Role boundary was preserved: no feature-code changes were performed by Delivery Lead.
- 2026-05-26 stale-state cleanup integrated child progress into parent truth:
  `A` and `C` are complete, parent is now explicitly `BLOCKED` only by missing
  backend payload-separation evidence (`LUC-64-B`), and a narrow blocker packet
  is published for immediate backend execution.
- 2026-05-26 board stale-parent cleanup (`c7df4d14-c3e6-47d7-8a30-3f89e26bab5f`):
  parent issue is intentionally returned to `TODO` for the next PM/Delivery cycle.
  No live implementation run remains attached to the parent in this heartbeat.
- 2026-05-26 continuation run `1e1d5591-bbb4-4257-bce6-d1507dd10b6a` failed with
  `codex_transient_upstream` (model usage limit). This is an execution-capacity
  incident, not a product/runtime regression. Parent status stays `TODO` and
  blocker ownership remains `LUC-64-B` (Backend API Engineer payload-separation proof).
- 2026-05-26 board model-cleanup comment (`bf496bbc-6469-4872-acbf-fd30cb9228c0`):
  stale `in_progress` without a live run is not allowed. Parent is explicitly
  returned to `TODO` for Delivery integration of child evidence and selection
  of the next narrow blocker/repair lane.
- 2026-05-26 reconciliation note:
  if a wake payload still reports parent `in_progress`, treat it as stale
  metadata drift and keep canonical parent status `TODO` until a new explicit
  Delivery live run starts.
- 2026-05-26 continuation run b5835b80-771c-4d88-b532-141e13c06c89 failed pre-execution with adapter bootstrap EEXIST (auth symlink target already exists). Treat as runtime/harness incident; keep canonical parent status TODO and keep product blocker unchanged (LUC-64-B).
- 2026-05-26 closure checkpoint:
  backend lane `LUC-64-B` is now evidenced and closed via focused runtime read-model test pass
  (`pnpm --filter api exec vitest run src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts`, 1 file / 6 tests).
  Parent `LUC-64` closure criteria are satisfied:
  strategy-condition truth remains visible independently (`lastSignalConditionLines`, `lastSignalConditionActive`)
  while execution outcome truth remains explicit (`lastSignalMessage`, `lastSignalReason`, `runtimeMarketState`).
- 2026-05-26 successful-run handoff:
  issue-level disposition is finalized as `done`; any stale wake payload showing
  `in_progress` should be treated as metadata drift unless new scoped work is
  explicitly opened on this issue.

