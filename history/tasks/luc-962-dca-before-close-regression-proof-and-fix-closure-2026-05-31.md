# LUC-962 - DCA-before-close regression proof and fix closure (2026-05-31)

## Context
Parent: LUC-959
Issue: LUC-962 `DCA-before-close regression: reproduce and fix close sequencing (TP/SL/TTP/TSL)`
Lane: Integration Trading Engineer

## Goal
Prove and protect deterministic `DCA-before-close` sequencing for all close reasons (`TP`, `SL`, `TTP`, `TSL`) when both DCA and close conditions are true on the same evaluation tick.

## Scope
- Runtime decision-layer regression coverage only.
- No behavior bypass, no architecture workaround.

## Implementation
- Added regression test in:
  - `apps/api/src/modules/engine/positionManagement.service.test.ts`
- New test name:
  - `keeps DCA-before-close sequencing for TP/SL/TTP/TSL when same-tick DCA also triggers`

## Verification
Command:

```bash
pnpm --filter api exec vitest run src/modules/engine/positionManagement.service.test.ts
```

Result:
- PASS `26/26` tests
- Includes new coverage for same-tick DCA+close path across `TP/SL/TTP/TSL`.

## Safety / Risk
- No change to production runtime code path in this checkpoint.
- Added deterministic regression guardrail to prevent sequencing drift.
- Residual risk: integration-level side effects in runtime automation layer still depend on wider runtime test harness health, but decision ordering contract is now explicitly covered.

## Source Control Closure
- Files changed (this lane):
  - `apps/api/src/modules/engine/positionManagement.service.test.ts`
  - `history/tasks/luc-962-dca-before-close-regression-proof-and-fix-closure-2026-05-31.md`
- Commit: pending in this heartbeat
- Push: pending in this heartbeat
- Deploy impact: none