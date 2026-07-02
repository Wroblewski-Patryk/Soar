# Task

## Header
- ID: LUC-6010
- Title: Split Trading operation HomeLiveWidgets heavy component proof packet
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-6004](/LUC/issues/LUC-6004)
- Priority: P1
- Module Confidence Rows: Trading operation, Dashboard Home runtime widgets
- Requirement Rows: app-completion Trading operation row proof
- Quality Scenario Rows: deterministic local Web regression proof
- Risk Rows: heavy component timeout, live-money mutation boundary
- Iteration: 2026-06-28
- Operation Mode: TESTER
- Mission ID: LUC-6010-HOME-LIVE-WIDGETS-SPLIT-PROOF-2026-06-28
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the TAE verification lane.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: produce deterministic split proof for the heavy
  `HomeLiveWidgets` manual-order/open-orders/full component packet from
  [LUC-6004](/LUC/issues/LUC-6004).
- Release objective advanced: Trading operation app-completion browser/state
  proof backlog.
- Included slices: focused Web Vitest split packets and evidence packet.
- Explicit exclusions: product code changes, live-money proof, deploy, push,
  restart, protected smoke, secret/account readback, exchange/order/position
  mutation.
- Stop conditions: product defect reproduced, split packet passes, or local
  harness blocker prevents proof.
- Handoff expectation: close [LUC-6010](/LUC/issues/LUC-6010) with exact proof
  and residual risk.

## Context

[LUC-6004](/LUC/issues/LUC-6004) passed safe no-live-money Trading operation
proof but deferred the heavy `HomeLiveWidgets` manual-order/open-orders/full
component packet because the broad test invocation timed out.

## Goal

Determine whether the packet needs product repair or only split deterministic
test invocation, then publish the proof.

## Scope

- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- `apps/web/src/features/dashboard-home/hooks/useManualOrderController.test.tsx`
- `history/evidence/luc-6010-home-live-widgets-heavy-component-split-proof-2026-06-28.md`

## Implementation Plan

1. Read [LUC-6004](/LUC/issues/LUC-6004) evidence and identify timeout files.
2. Run controller/scope/venue packet.
3. Reproduce the default rendered manual-order timeout.
4. Rerun rendered manual-order with explicit timeout.
5. Run open-orders/actions/presenters split packet.
6. Run full `HomeLiveWidgets.test.tsx` split packet.
7. Write task and evidence packets, update source-of-truth state, and close the
   Paperclip issue.

## Acceptance Criteria

- The previous timeout signature is reproduced or classified.
- Manual-order packet has a deterministic pass path.
- Open-orders packet has a deterministic pass path.
- Full component packet has a deterministic pass path.
- No live-money or production mutation occurs.

## Definition of Done

- Evidence packet written.
- Focused proof command results recorded.
- Process cleanup/boundary recorded.
- Paperclip issue disposition updated.

## Validation Evidence
- Tests:
  - `pnpm --filter web exec vitest run src/features/dashboard-home/hooks/useManualOrderController.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx --reporter=verbose` -> PASS (`3` files / `7` tests).
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx --reporter=verbose` -> FAIL by default timeout (`3` timed out / `8` passed).
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx --reporter=verbose --testTimeout=15000` -> PASS (`1` file / `11` tests).
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx --reporter=verbose --testTimeout=15000` -> PASS (`3` files / `27` tests).
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --reporter=verbose --testTimeout=15000` -> PASS (`1` file / `20` tests).
- Manual checks: reviewed [LUC-6004](/LUC/issues/LUC-6004) evidence and local
  dirty worktree before writing evidence.
- High-risk checks: no production, exchange, order, position, secret, account,
  deploy, push, or live-trading mutation.
- Module confidence ledger updated: yes.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: [LUC-6004](/LUC/issues/LUC-6004) task/evidence
  and dashboard-home test surfaces.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: broad component packet timed out in [LUC-6004](/LUC/issues/LUC-6004).
- Gaps: deterministic split proof missing.
- Architecture constraints: no live-money or production mutation.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-6010](/LUC/issues/LUC-6010).
- Priority rationale: directly unblocks Trading operation proof burn-down.
- Why other candidates were deferred: outside assigned heartbeat.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/state only.
- Logic: isolate heavy rendered component files from controller/presenter tests.
- Edge cases: default timeout failure must be recorded, not hidden.

### 4. Execute Implementation
- Implementation notes: no code changes; split invocation and evidence only.

### 5. Verify and Test
- Validation performed: focused Web Vitest packets above.
- Result: deterministic pass path established.

### 6. Self-Review
- Simpler option considered: increasing timeout globally.
- Technical debt introduced: no.
- Scalability assessment: split packets are narrower and cheaper than the
  broad mixed packet.
- Refinements made: kept default-timeout reproduction in evidence.

### 7. Update Documentation and Knowledge
- Docs updated: task and evidence packet, context/state files.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Result Report

- Task summary: split the heavy Trading operation `HomeLiveWidgets` proof into
  deterministic Web Vitest packets and proved the residual was default-timeout
  packet shape, not a product defect.
- Files changed: evidence/task/context/state only.
- How tested: focused Web Vitest packets listed above.
- What is incomplete: broader app-completion row-linkage/doc/test-link burn
  down remains with [LUC-6004](/LUC/issues/LUC-6004) residual backlog.
- Next steps: QVE/Docs may continue Trading operation row burn-down using the
  split packets; no FE repair child is required from [LUC-6010](/LUC/issues/LUC-6010).
- Decisions made: no product code change; use split packets with
  `--testTimeout=15000` for this heavy rendered component family.
