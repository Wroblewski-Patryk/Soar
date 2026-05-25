# Task

## Header
- ID: LUC-45
- Title: [Soar] V1 audit-to-completion controller
- Task Type: planning
- Current Stage: planning
- Status: BLOCKED
- Owner: Engineering Delivery Lead (coordinator)
- Depends on: LUC-37, LUC-40, LUC-41, LUC-43
- Priority: P0
- Module Confidence Rows: V1 release readiness cross-lane evidence rows
- Requirement Rows: REQ-AUDIT-002, REQ-RELEASE-EVIDENCE-COMPLETE
- Quality Scenario Rows: release reliability, verification completeness, safety fail-closed
- Risk Rows: RISK-035, RISK-DEPLOY-READINESS-DRIFT, RISK-PROOF-GAP-UNKNOWN
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
Soar V1 has many verified local and partial production checkpoints, but readiness is still blocked by cross-lane evidence gaps and unresolved blockers (runtime boundary instability, stack cutover proof, protected gates). This issue establishes one controller packet that forces every audit finding into owned, testable completion flow.

## Goal
Create an executable audit-to-completion controller that maps V1 findings to single-owner lanes, fixed dependency order, explicit evidence gates, and unambiguous done criteria.

## Scope
- Delivery/controller decomposition only.
- No feature-code implementation in this issue.
- Canonical state sync for execution routing:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `history/tasks/luc-45-v1-audit-to-completion-controller-2026-05-25-task.md`

## Implementation Plan
1. Build a known-state map from active mission, board, and release/readiness evidence.
2. Convert unresolved V1 findings into specialist lanes with one accountable owner.
3. Define strict integration order with unblock conditions between lanes.
4. Define minimum verification/evidence contract per lane and fail-closed status rules.
5. Sync source-of-truth docs so any next executor can continue without rediscovery.

## Responsibility Lanes

| Lane | Owner | Affected layer | Input docs/state | Expected output | Required verification | Blocker / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| LUC-45-A | Backend API Engineer | Runtime/trading/API stability | `LUC-41`, `LUC-18` failures, API runtime aggregate checkpoints | Runtime boundary blocker closure packet with root-cause + fix evidence | Focused runtime/backtests packs, API smoke status | None (starts immediately) |
| LUC-45-B | Ops/Release Engineer | Coolify stack rollout + deploy safety | `COOLIFY-SERVICE-STACK-MIGRATION-2026-05-25`, ops runbooks | Parallel-stack temp-domain deploy packet and cutover readiness status | API/Web/build-info/worker smoke and rollback path evidence | Depends on stable deployable SHA from current main |
| LUC-45-C | QA/Test Automation Engineer | Repeatable journey proof | `LUC-43` repeatable smoke harness + high-gap journeys | Deterministic PASS/FAIL evidence matrix for web/api/backtests | `qa:smoke-e2e:repeatable --checks web,api,backtests` + artifacts | Depends on outputs from A/B for stable candidate |
| LUC-45-D | Security Review Lead | Auth/exchange/secret boundary | Security proof docs + protected checks contract | Read-only fail-closed security packet for candidate SHA | Protected auth/session checks, exchange boundary checks, secret-handling assertions | Depends on candidate from B and runtime state from A |
| LUC-45-E | Docs/Memory Lead | Source-of-truth parity | Outputs from A-D, ledgers/registers | Requirements/risk/module-confidence sync with residual risks explicit | Board/state/doc parity checks with linked evidence | Depends on A-D outputs |
| Coordinator | Engineering Delivery Lead | Integration gate and final status | All lane outputs | V1 controller decision (`done`/`blocked`/`in_review`) with evidence ledger | Parent acceptance check against DoD + gate completeness | Blocks closure until all required lanes are resolved |

## Integration Order
1. `LUC-45-A` and `LUC-45-B` run first (parallel).
2. `LUC-45-C` runs against the first stable candidate from A+B.
3. `LUC-45-D` validates safety boundaries on the same candidate.
4. `LUC-45-E` syncs all source-of-truth ledgers from validated outputs.
5. Coordinator integrates all lane results and sets final disposition.

## Acceptance Criteria
- Controller packet defines single-owner lanes for all unresolved V1 blocker families.
- Dependency order and unblock conditions are explicit.
- Each lane has a concrete proof contract (commands/artifacts/readbacks).
- Canonical board/state references this packet as active delivery controller.

## Definition of Done
- [x] LUC-45 controller packet exists with explicit owner boundaries.
- [x] Lane-by-lane validation and evidence contracts are defined.
- [x] Integration order and completion gate are synchronized in source-of-truth files.
- [ ] Lane execution outputs are integrated and verified (tracked in child/specialist lanes).
- [ ] Final V1 controller disposition is set with complete evidence.

## Validation Evidence
- Manual checks:
  - `.agents/state/active-mission.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/next-steps.md`
- Tests: not applicable (planning/controller slice only)
- Reality status: implemented and verified (for planning output)

## Result Report
- Established the V1 audit-to-completion controller as a strict execution map with one owner per lane and explicit dependency gates.
- Locked this issue to delivery-control scope (no feature code) per Engineering Delivery Lead role boundary.
- Synchronized source-of-truth routing so specialist lanes can execute without rediscovering mission intent or proof requirements.

## 2026-05-25 Kickoff Continuation Checkpoint
- Received board instruction to continue from `soar-takeover-kickoff` evidence and split owned execution lanes.
- Local repository scan did not expose a file named `soar-takeover-kickoff`; continuation proceeded from active Soar source-of-truth state (`TASK_BOARD`, `PROJECT_STATE`, state ledgers, and active mission packet).
- Published V1 controller execution artifacts:
  - Gap register: `history/plans/luc-45-v1-gap-register-2026-05-25.md`
  - Evidence ledger: `history/evidence/luc-45-v1-evidence-ledger-2026-05-25.md`
  - Child lane packets:
    - `history/tasks/luc-45-a-backend-runtime-api-stability-2026-05-25-task.md`
    - `history/tasks/luc-45-b-ops-stack-rollout-and-smoke-2026-05-25-task.md`
    - `history/tasks/luc-45-c-qa-repeatable-journey-proof-2026-05-25-task.md`
    - `history/tasks/luc-45-d-security-boundary-readonly-proof-2026-05-25-task.md`
    - `history/tasks/luc-45-e-docs-state-parity-sync-2026-05-25-task.md`
- This checkpoint is planning/integration evidence only; feature-level verification remains owned by child lanes.

## 2026-05-25 Board Child-Issue Routing Checkpoint
- Board comment `eb5b100d-73c6-451c-8ff1-9c8d6411f3b4` converted first execution pair into real Paperclip child issues:
  - `LUC-46` owns backend execution for lane `LUC-45-A`.
  - `LUC-47` owns ops execution for lane `LUC-45-B`.
- `LUC-45` remains the integration controller and keeps canonical sequence:
  `LUC-46 + LUC-47 -> LUC-45-C -> LUC-45-D -> LUC-45-E -> coordinator decision`.
- This update is routing-state only; no feature/runtime behavior changed in this checkpoint.

## 2026-05-25 PM No-Stale-Controller Checkpoint
- Board comment `de3056a9-9afa-420c-b290-5819460308c8` confirms controller must not stay passively `in_progress` while upstream blockers are unresolved.
- Controller status is now explicitly `BLOCKED` on child issues:
  - `LUC-46` (Backend runtime/API stability; lane `LUC-45-A`)
  - `LUC-47` (Ops rollout/smoke gate; lane `LUC-45-B`)
- PM routine for active coordination (controller ownership):
  - Keep `LUC-46` and `LUC-47` as active parallel unblock lane owners.
  - Require each child lane update to include: current blocker, latest evidence artifact path, and next concrete unblock action.
  - Advance `LUC-45` to `LUC-45-C` only after both `LUC-46` and `LUC-47` publish unblock evidence.

## 2026-05-25 PM No-New-Evidence Monitor Checkpoint
- `LUC-45` remains `BLOCKED` because no unblock evidence payload has been published yet by `LUC-46` or `LUC-47` in this heartbeat window.
- Unchanged unblock owners:
  - `LUC-46` keeps backend final-candle stability lane active (`LUC-45-A`) and must post concrete blocker + evidence.
  - `LUC-47` keeps temp-domain one-stack rollout lane active (`LUC-45-B`) and must post deploy/smoke evidence.
- Resume action remains unchanged: only move to `LUC-45-C` after both child lanes provide unblock evidence artifacts and explicit next actions.

## 2026-05-26 Delivery Reconciliation Routine Checkpoint
- Board comment `24f62373-1a53-444c-96d1-c88a9031bbb7` confirms stale-state cleanup mode for controller operation.
- `LUC-45` keeps valid sequence `A+B -> C -> D -> E` but cannot close while `LUC-46` and `LUC-47` evidence remains open.
- Active delivery routine ownership:
  - cadence: every 2 hours,
  - owner: Engineering Delivery Lead (controller owner),
  - scope: reconciliation of child-lane status and blocker truth,
  - action gate: create next child issue immediately when a new blocker family appears that is outside current lane ownership.
- Disposition rule remains fail-closed: parent controller stays `BLOCKED` until A/B evidence contracts are closed.

## 2026-05-26 Delivery Reconciliation Pulse
- Pulse status: no new unblock evidence posted in this cycle by either `LUC-46` or `LUC-47`; no child lane output that changes parent disposition has appeared.
- Required gate remains unchanged:
  - keep `LUC-45` `BLOCKED`,
  - continue waiting on `LUC-46` runtime/backend blocker closure evidence,
  - continue waiting on `LUC-47` ops/deploy blocker closure evidence.
- Next scheduled routine action: run another 2-hour recon pass and escalate to a follow-up child if either unresolved family drifts or a new blocker family appears.

## 2026-05-26 Stale Parent Cleanup (Board Comment 784f68c9-6387-4b32-8813-b052c0d27cca)
- Parent controller must not remain `in_progress` without an active reconciliation run.
- `LUC-45` remains `BLOCKED` by open proof lanes:
  - Backend proof lane: `LUC-46`
  - Ops proof lane: `LUC-47`
  - Frontend proof lane: `LUC-48-A/browser-proof`
- Active V1 controller routine owns the next reconciliation run and keeps parent fail-closed until all three proof lanes provide closure evidence for gate advancement.
