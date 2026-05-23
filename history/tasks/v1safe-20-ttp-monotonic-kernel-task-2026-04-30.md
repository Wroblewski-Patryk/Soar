# V1SAFE-20 - TTP Monotonic Kernel Fix

## Stage
- implementation

## Context
- Live operator observation on 2026-04-30 showed a position where `TTP` armed around `5.35%`, displayed a protected floor near `3.35%`, then disappeared while the position remained open during pullback.
- Existing runtime display fixes had already improved `TTP` visibility, so the remaining drift pointed at the lifecycle kernel itself.

## Goal
- Keep armed trailing-take-profit state monotonic once it is armed.

## Constraints
- Reuse the existing `positionManagement` kernel.
- Do not introduce a second trailing-close path.
- Preserve the existing `DCA-first` protection contract.

## Definition of Done
- Armed `TTP` is no longer cleared just because favorable move drops below the first-level base floor.
- If close is allowed, the tracked protected floor closes the position.
- If close is temporarily blocked by remaining profit-side `DCA`, the armed `TTP` state is preserved.
- Focused runtime tests, API typecheck, and repository guardrails pass.

## Forbidden
- Display-only sticky state.
- UI-only workaround.
- Alternate close engine outside the approved lifecycle kernel.

## Result
- Removed the disarm branch from `apps/api/src/modules/engine/positionManagement.service.ts` that cleared armed `TTP` before evaluating the tracked protected floor.
- Updated `apps/api/src/modules/engine/positionManagement.service.test.ts` to lock the intended fail-closed behavior when close is temporarily blocked by remaining profit-side `DCA`.
- Validation PASS:
  - `pnpm --filter api exec vitest run src/modules/engine/positionManagement.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts -t "TTP|trailing"`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
