# LUC-1175 Evidence - Frontend Dashboard/Signals/Trading UX Verification (2026-06-01)

## Wake Handling
- Latest comment acknowledged first: `softwarehouse-local-repair-lane-starter:v1`.
- Lane mode respected: local-only repair/source-control closure, fail-closed for protected delivery.

## Affected Capability/Chain/Files
- Capability: dashboard home runtime signals and active-bot context display semantics.
- Key files in current dirty set:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.test.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.de-CH.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.en.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.pl.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.pt.ts`

## Validation Commands And Results
- `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.test.ts --reporter=verbose`
  - Result: `PASS` (`2` files, `10` tests).
- `pnpm --filter web exec vitest run src/i18n/translations.test.ts src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.test.ts --reporter=verbose`
  - Result: `PASS` (`3` files, `16` tests).
- `rg -n "Ă|â€|﻿export" apps/web/src/i18n/namespaces/dashboard-home.de-CH.ts apps/web/src/i18n/namespaces/dashboard-home.pt.ts -S`
  - Result: `MATCH` (widespread mojibake/BOM indicators in `de-CH`, single mojibake indicator in `pt`).

## Regression Risk And Follow-Up Gaps
- Regression risk: locale encoding corruption artifacts detected in modified i18n files (`de-CH`, `pt`) within this capability surface.
- Gap: targeted semantics and translation-key tests pass, but they do not catch text-encoding corruption; locale/text-integrity conformance remains not clean.

## Commit / No-Commit Decision
- `not committed` in this heartbeat.
- Reason: PM verification/state-evidence lane only; active worktree already contains broader multi-lane dirty changes.

## Required Next Owner
1. Frontend lane owner: repair encoding/text integrity in affected locale files.
2. QA/Frontend lane owner: rerun focused runtime-signal tests and locale integrity checks, then publish closure packet.

## Continuation Checkpoint - 2026-06-01 (`source_scoped_recovery_action`)
- Fresh verification in this heartbeat:
  - `pnpm --filter web exec vitest run src/i18n/translations.test.ts src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.test.ts --reporter=verbose`
    - Result: `PASS` (`3` files, `16` tests).
  - `rg -n "Ä‚|Ă˘â‚¬|ď»żexport|Ă|â€|﻿export" apps/web/src/i18n/namespaces/dashboard-home.de-CH.ts apps/web/src/i18n/namespaces/dashboard-home.pt.ts -S`
    - Result: `MATCH` (corruption markers reproduced in touched locale files).
- Interpretation:
  - Signal semantics/test coverage remains healthy and consistent with `LUC-1167`.
  - Locale text-integrity conformance remains unresolved; issue cannot be safely closed.
- Disposition for this checkpoint:
  - `blocked` with unchanged unblock owner/action (Frontend repair -> QA/Frontend closure proof).

## Closure Checkpoint - 2026-06-07 (`issue_blockers_resolved`)
- Trigger:
  - `LUC-2786` blocker resolved; `LUC-1175` resumed for final proof.
- Fresh verification:
  - `pnpm --filter web exec vitest run src/i18n/translations.test.ts src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.test.ts --reporter=verbose`
    - Result: `PASS` (`3` files, `17` tests).
  - Locale corruption-marker scan against `apps/web/src/i18n/namespaces/dashboard-home.de-CH.ts` and `apps/web/src/i18n/namespaces/dashboard-home.pt.ts`
    - Result: no matches (`rg` exit code `1`).
- Interpretation:
  - Active-bot signal semantics remain verified by focused component/helper tests and linked `LUC-1167` coverage.
  - The previously unresolved locale mojibake/BOM mismatch is no longer present in the touched files.
  - Translation integrity now has direct regression coverage via `src/i18n/translations.test.ts`.
- Disposition:
  - `done`.
