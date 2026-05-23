# Task

## Header
- ID: V1SAFE-00
- Title: Publish LIVE DCA/TTP/TSL parity analysis plus execution packet
- Task Type: research
- Current Stage: planning
- Status: DONE
- Owner: Planning Agent
- Depends on: V1PARITY-A, V1RESTART-A
- Priority: P0

## Context
After closing `V1PARITY-A`, the next user-reported risk is no longer generic
LIVE execution drift. The repository still appears to diverge specifically in
the three core protection mechanisms that matter for real money:

- `DCA`
- `TTP`
- `TSL`

`backtest` and `paper` are much closer to the intended semantics. `LIVE`
still drifts, especially for imported or recovered exchange positions where
runtime management state may be incomplete.

## Goal
Publish one canonical planning packet that explains the confirmed repository
drifts behind current `LIVE` `DCA/TTP/TSL` failures and turns them into a
safe implementation wave.

## Deliverable For This Stage
A planning packet plus synchronized queue/context updates that:

- classify confirmed `LIVE` parity drifts for `DCA`, `TTP`, and `TSL`
- compare runtime execution truth against operator-facing read-model truth
- identify imported/recovered trailing-state hydration as a first-class
  contract gap
- define a staged execution sequence for implementation without broadening
  scope into a new exchange-native system

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionState.store.ts`
- `apps/api/src/modules/engine/positionManagement.service.ts`
- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimePositionSerialization.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/position-lifecycle-parity-matrix.md`
- `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-position-restart-continuity-contract.md`
- planning/context source-of-truth files

## Implementation Plan
1. Re-read the canonical Soar lifecycle/runtime architecture for `DCA`, `TTP`,
   and `TSL`.
2. Inspect current `LIVE` runtime automation, imported-position recovery, and
   runtime-state persistence paths.
3. Compare engine-executable protection truth to runtime read-model/display
   truth.
4. Classify only confirmed drifts, especially around imported/recovered
   positions.
5. Publish a staged execution packet and sync queue/context to the new wave.

## Acceptance Criteria
- [x] The packet identifies confirmed technical drifts behind current `LIVE`
      `DCA/TTP/TSL` failures.
- [x] The packet explicitly distinguishes engine-executable protection truth
      from read-model/display fallback truth.
- [x] The packet records imported/recovered trailing-state hydration as a
      first-class contract gap.
- [x] Canonical queue/context files reference the new wave.

## Definition of Done
- [x] One canonical planning packet exists in `docs/planning/`.
- [x] Queue/context truth points to the new wave and next smallest task.
- [x] The task remains planning-only and does not mix in implementation.

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
- Tests: not applicable for planning-only stage
- Manual checks: architecture/code audit across runtime automation, runtime
  read models, and imported/recovered position paths
- Screenshots/logs: not applicable
- High-risk checks: explicit review of imported/recovered trailing-state
  truth and operator/runtime mismatch risk

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: no
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: `V1SAFE-01`

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable

## Review Checklist (mandatory)
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
The strongest repository-level conclusion is that Soar still lacks one frozen
parity model for `LIVE` `DCA/TTP/TSL` when a position is imported or recovered
without fully armed runtime management state. The highest-risk mismatch is no
longer just "live protection is weak", but that operator surfaces can imply
active dynamic protection that the runtime engine cannot yet canonically
execute.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime
  surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB
-> validation -> error handling -> test. Partial implementations, mock-only
paths, placeholders, fake data, and temporary fixes are forbidden.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes
- Regression check performed: architecture and runtime/read-model parity audit

## AI Testing Evidence (required for AI features)

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: Published the `V1SAFE-A` planning packet for final
  `LIVE DCA/TTP/TSL` parity hardening after a focused repository audit driven
  by real-account runtime symptoms.
- Files changed:
  - `history/plans/v1safe-live-protection-and-liquidation-safety-plan-2026-04-29.md`
  - `history/tasks/v1safe-00-analysis-task-2026-04-29.md`
  - queue/context source-of-truth files
- How tested: architecture/code review focused on runtime automation,
  imported/recovered position continuity, and read-model/display parity
- What is incomplete: no runtime fixes implemented yet
- Next steps: `V1SAFE-01`, then the focused red parity pack for imported and
  recovered `LIVE` positions
- Decisions made: narrowed the wave away from a broad exchange-native redesign
  and onto the exact `DCA/TTP/TSL` parity gaps still open in `LIVE`
