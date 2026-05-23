# Task

## Header
- ID: V1TAKE-08
- Title: rerun focused DB-backed API + web closure pack and sync canonical docs/context
- Status: DONE
- Owner: QA/Test
- Depends on: V1TAKE-07
- Priority: P1

## Context
`V1TAKE-01..07` closed the ownership and manual-order truth slices:
wallet-owned takeover management, runtime visibility aligned to that wallet
truth, and fail-closed `PAPER MARKET` manual-order behavior when canonical fill
price is unavailable. The final step for the wave is to rerun the focused
closure pack and record one canonical evidence set in the queue/context docs.

## Goal
Run the focused DB-backed API + web validation pack for the full `V1TAKE-A`
wave and sync source-of-truth files with the final evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep closure scope limited to takeover/runtime/manual-order truth

## Definition of Done
- [x] Focused takeover-status and reconciliation pack passes.
- [x] Focused runtime ownership/visibility pack passes.
- [x] Focused manual-order API + web pack passes.
- [x] Queue/context/planning docs record the final closure evidence.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- opportunistic changes outside validation/doc sync

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts`
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption"`
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - inspect queue/context docs for final `V1TAKE-A` closure state
- Screenshots/logs:
  - Closure validation had to be rerun sequentially for DB-backed API suites.
    Parallel Vitest processes against the same local Postgres produced false
    red results; the same pack passed when executed sequentially.
- High-risk checks:
  - wallet-disabled takeover remains fail-closed
  - runtime takeover visibility remains deterministic
  - `PAPER MARKET` unresolved fill truth remains blocked end-to-end

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/reference/wallet-source-of-truth-contract.md`
  - `docs/modules/api-positions.md`
  - `docs/modules/api-bots.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - n/a
- Follow-up architecture doc updates:
  - none expected; queue/context sync only

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: current dashboard runtime/manual-order panel contract
- Required states: success | error
- Responsive checks: desktop
- Accessibility checks:
  - preserve existing manual-order validation and action-state presentation
- Parity evidence:
  - runtime/dashboard manual-order states must still match backend order/position truth

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This closure task should not change runtime behavior unless a validation
failure forces a narrow follow-up fix. If all checks pass, only docs/context
sync is expected.
