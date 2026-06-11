# Task Contract - LUC-1167

## Architecture Links

- Primary feature/module: Dashboard active-bot runtime signal semantics.
- Architecture nodes: `docs/architecture/nodes/SOAR-COMP-LIVE-MARKET-BAR.md`, `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-MARKET-TRUTH-STATE.md`, `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-STRATEGY-DISPLAY-BY-SYMBOL.md`.
- Function chains: `docs/architecture/reference/runtime-signal-merge-contract.md`, `docs/pipelines/wallet-and-bot-configuration.md`.
- Affected files: `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx`, `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.test.ts`.
- Tests/proof: `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.test.ts`.
- Docs updated: `history/tasks/luc-1167-soar-bot-signals-verify-active-bot-signal-dashboard-semantics-2026-05-31-task.md`.## Context
- Issue: `LUC-1167` â€” `[Soar][Bot Signals] Verify active-bot signal dashboard semantics`.
- Wake reason: `source_scoped_recovery_action` with inline payload indicating prior implementation delta already delivered and requiring durable closure disposition.
- Role lane: Engineering Delivery Lead (coordination/closure evidence, no new feature implementation in this heartbeat).

## Goal
- Confirm that delivered dashboard signal semantics remain aligned with acceptance criteria and leave a durable closure packet for the issue lane.

## Constraints
- No production mutation, deploy, or credential use.
- No widening scope beyond `LUC-1167` acceptance criteria.
- Keep verification minimal and focused on touched signal semantics.

## Delivery Stage
- `verification` and `closure`.

## Scope
- Re-verify runtime signal section semantics tests.
- Record closure evidence and final disposition path.

## Implementation Plan
1. Re-run focused web tests proving signal semantics are condition-driven (not position/runtime-status driven).
2. Confirm prior file-scope delta remains aligned with acceptance criteria.
3. Publish closure artifact and update canonical task board evidence.

## Acceptance Criteria
- Active-bot context and signal semantics remain verified by focused tests.
- Runtime position/open-state is not represented as signal state.
- Durable closure evidence exists in project task artifacts.

## Definition of Done
- Focused verification command passes.
- `TASK_BOARD` entry includes current heartbeat verification and closure evidence link.
- This task artifact records result status, residual risk, and next owner.

## Forbidden
- No additional feature work outside verified signal semantics.
- No unrelated refactors.
- No issue status claims without evidence.

## Result Report
- Verification run (2026-05-31):
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.test.ts`
  - Result: PASS (`2` files, `10` tests).
- Disposition for this lane: `done`.
- Commit status: `not committed` (documentation/evidence-only heartbeat; existing workspace already contains broader in-flight changes).
- Push status: `not needed`.
- Deploy impact: `none`.

## Residual Risk
- No new risk discovered in the verified `LUC-1167` scope.
- Parent mission still has independent production/protected-evidence blockers outside this issue.

## Next Owner
- Engineering Delivery Lead / PM integration lane to reconcile Paperclip issue-state drift (`blocked` vs delivered `done`) in control-plane issue status.
