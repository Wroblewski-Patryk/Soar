# Task

## Header
- ID: LUC-37
- Title: [Soar][Delivery] Engineering breakdown and integration map
- Task Type: planning
- Current Stage: planning
- Status: DONE
- Owner: Engineering Delivery Lead (coordinator)
- Depends on: LUC-17 architecture known-state, LUC-19 runtime known-state, LUC-18 QA baseline
- Priority: P1
- Module Confidence Rows: multiple impacted via delegated child lanes
- Requirement Rows: REQ-AUDIT-002 (process traceability guard), module-specific rows delegated
- Quality Scenario Rows: deploy reliability, verification coverage, ownership clarity
- Risk Rows: RISK-035 (source-of-truth drift), delivery sequencing risk (tracked in this task)
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: VERIFIED

## Context
The board has multiple active streams (production stability, Coolify migration, QA baseline regressions), but the ownership boundaries and integration order are still distributed across several state files. LUC-37 requires a single delivery decomposition packet that specialists can execute without rediscovering scope.

## Goal
Produce an execution-ready engineering breakdown and integration map with one owner per layer, explicit dependencies, required evidence, and rollback/cleanup notes.

## Scope
- Delivery decomposition only (no feature implementation).
- Canonical source updates:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `history/tasks/luc-37-engineering-breakdown-and-integration-map-2026-05-25-task.md`
- Inputs:
  - `docs/status/function-journey-index.md`
  - `docs/graphs/architecture-graph.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/next-steps.md`

## Implementation Plan
1. Build known-state from architecture graph + function journey evidence index.
2. Split remaining readiness work into single-owner specialist lanes.
3. Define integration order and hard blockers between lanes.
4. Define minimum evidence per lane (commands/artifacts/readbacks).
5. Sync canonical board/state so next executor can pick up without re-analysis.

## Responsibility Lanes

| Lane | Owner | Affected layer | Input docs | Expected output | Required verification | Blocker / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| LUC-37-A | Backend API Engineer | API/service runtime + backend trading | `luc-37-a-backend-runtime-and-trading-boundary-2026-05-25-task.md`; `docs/graphs/architecture-graph.md`; API runtime aggregates in board/state | Fix/confirm backtests reconciliation instability and runtime aggregate resilience behavior | `pnpm run test:go-live:api`; focused `backtests.e2e` + runtime aggregate tests; API `/health` + `/ready` smoke in deployed env | Depends on reproducible failure from LUC-18 baseline and deployment candidate from LUC-37-B |
| LUC-37-B | Ops/Release Engineer | Deploy topology and rollout | `luc-37-b-coolify-stack-cutover-and-smoke-2026-05-25-task.md`; Coolify docs + `docker-compose.coolify.yml` | Complete parallel stack redeploy with corrected liveness gate and cutover decision packet | Temp-domain smoke (API/Web/build-info/workers), rollback rehearsal note, container/process cleanup proof | Depends on service reachability and stable build SHA |
| LUC-37-C | QA/Test Engineer | Cross-journey verification | `luc-37-c-journey-verification-and-qa-2026-05-25-task.md`; `docs/status/function-journey-index.md` high-gap rows | Focused regression packet for highest-risk journeys (dashboard runtime, manual order, auth session) with pass/fail matrix | `test:go-live:web`, selected API smoke, browser journey proof artifacts | Depends on `LUC-37-A` and `LUC-37-B` outputs |
| LUC-37-D | Security Auditor | Auth/exchange safety boundary | `luc-37-d-security-auth-exchange-boundary-2026-05-25-task.md`; `AI_TESTING_PROTOCOL.md`, security docs, exchange boundaries from graph | Read-only adversarial check pass/fail for auth/session/exchange leakage assumptions | Security checklist artifact + fail-closed evidence; no live mutation | Runs after candidate deploy is stable and backend safety paths from LUC-37-A |
| LUC-37-E | Documentation Agent | Source-of-truth parity | Task outputs from A-D | Update module confidence/requirements/risk deltas and release evidence links | Link validation + board/state parity check | Depends on completed lane reports |
| Coordinator | Engineering Delivery Lead | Integration and acceptance | All above | Final merge-readiness decision and closure status for LUC-37 | Evidence review against DoD and gate criteria | Blocks DONE until A-E integrated |

## Integration Order
1. `LUC-37-A` and `LUC-37-B` in parallel (independent surfaces).
2. `LUC-37-C` starts on first stable deploy candidate from A+B.
3. `LUC-37-D` runs on same candidate before readiness claim.
4. `LUC-37-E` syncs source-of-truth from validated outputs.
5. Coordinator closes only after blocker-free integration review.

## Cross-Layer Dependency Notes
- Frontend/UI: `LUC-37-C` owns user-journey proof for UI-critical paths and depends on a deploy candidate from `LUC-37-B`.
- Backend/data/trading: `LUC-37-A` owns API/service/runtime data paths and includes exchange/trading boundary fixes needed for UI/API proof.
- AI: readiness depends on existing `LUC-42` for assistant boundary hardening to avoid mixing assistant-runtime and execution readback work.
- Security: `LUC-37-D` has explicit dependency on backend and deployment candidates from `LUC-37-A`/`LUC-37-B`.
- Docs/ops/state: `LUC-37-E` owns board/project state and evidence index synchronization.
- UX flow ownership: existing frontend ownership work in `LUC-38` is consumed as context for any future UI proof updates in `LUC-37-C`.

## Acceptance Criteria
- At least five lane tickets are defined with single accountable owners.
- Each lane has explicit scope, dependencies, and required proof.
- Integration order and gate ownership are unambiguous.
- Canonical board/state reference this breakdown as active execution map.

## Child Lanes
- `LUC-37-A`: [history/tasks/luc-37-a-backend-runtime-and-trading-boundary-2026-05-25-task.md](C:/Personal/Projekty/Aplikacje/Soar/history/tasks/luc-37-a-backend-runtime-and-trading-boundary-2026-05-25-task.md)
- `LUC-37-B`: [history/tasks/luc-37-b-coolify-stack-cutover-and-smoke-2026-05-25-task.md](C:/Personal/Projekty/Aplikacje/Soar/history/tasks/luc-37-b-coolify-stack-cutover-and-smoke-2026-05-25-task.md)
- `LUC-37-C`: [history/tasks/luc-37-c-journey-verification-and-qa-2026-05-25-task.md](C:/Personal/Projekty/Aplikacje/Soar/history/tasks/luc-37-c-journey-verification-and-qa-2026-05-25-task.md)
- `LUC-37-D`: [history/tasks/luc-37-d-security-auth-exchange-boundary-2026-05-25-task.md](C:/Personal/Projekty/Aplikacje/Soar/history/tasks/luc-37-d-security-auth-exchange-boundary-2026-05-25-task.md)
- `LUC-37-E`: [history/tasks/luc-37-e-docs-state-sync-and-journey-map-2026-05-25-task.md](C:/Personal/Projekty/Aplikacje/Soar/history/tasks/luc-37-e-docs-state-sync-and-journey-map-2026-05-25-task.md)

## Definition of Done
- [x] Engineering work is decomposed into specialist lanes with one owner per lane.
- [x] Cross-layer dependencies and integration order are explicit.
- [x] Proof expectations and rollback/cleanup expectations are defined per lane.
- [x] Source-of-truth files updated with the active decomposition map.
- [x] Delegated lane execution ownership integrated through child issues `LUC-37-A..E` (implementation evidence tracked in child lanes, not in parent coordination lane).

## Validation Evidence
- Manual checks:
  - Reviewed: `docs/status/function-journey-index.md`
  - Reviewed: `docs/graphs/architecture-graph.md`
  - Reviewed: `.agents/state/active-mission.md`
  - Reviewed: `.agents/state/next-steps.md`
- Tests: not applicable (planning/decomposition only)
- Reality status: implemented and verified (for planning output)

## Result Report
- Produced a concrete multi-lane engineering breakdown for LUC-37 with explicit owner boundaries and proof contracts.
- Locked integration sequencing so specialists can execute without rediscovery.
- Updated canonical execution context to point to this packet as the active coordination map for next execution slices.
- 2026-05-25 board disposition (`comment 52fb8124-49c3-472d-8f1e-8384fa871751`): close parent coordination issue after durable decomposition evidence; continue implementation in specialist child lanes only.
