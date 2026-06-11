# LUC-2786 Dashboard Locale Encoding Integrity Drift

## Header
- ID: LUC-2786-DASHBOARD-LOCALE-ENCODING-INTEGRITY-DRIFT-2026-06-07
- Title: Repair dashboard locale encoding integrity drift
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Web Engineer
- Priority: P1
- Module Confidence Rows: Web i18n / Dashboard Home locale copy
- Requirement Rows: REQ-I18N-022
- Risk Rows: RISK-034
- Operation Mode: BUILDER
- Mission ID: LUC-2786
- Mission Status: VERIFIED

## Context
[LUC-2786](/LUC/issues/LUC-2786) was created from [LUC-1175](/LUC/issues/LUC-1175) after frontend conformance proof found dashboard locale encoding markers in `dashboard-home.de-CH.ts` and `dashboard-home.pt.ts`.

## Goal
Remove dashboard locale mojibake/BOM drift in the two named locale files and add a focused regression check so loaded locale strings fail on common encoding-corruption markers.

## Scope
- `apps/web/src/i18n/namespaces/dashboard-home.de-CH.ts`
- `apps/web/src/i18n/namespaces/dashboard-home.pt.ts`
- `apps/web/src/i18n/translations.test.ts`

## Implementation Plan
1. Inspect the two locale files for `Ă`, `â€`, and BOM-prefixed `export` markers.
2. Repair only the corrupted locale text/encoding markers in the named files.
3. Add a loaded-translation regression assertion for replacement characters, CP1250 mojibake markers, and common UTF-8/CP1252 mojibake families.
4. Run the exact focused frontend acceptance pack and the requested locale integrity search.
5. Record source-of-truth and Paperclip closure evidence.

## Acceptance Criteria
- The requested locale integrity search returns no matches for the two target files.
- The focused i18n/runtime signal Vitest acceptance pack passes.
- No push, deploy, production restart, protected smoke, live account mutation, or secret handling occurs.

## Result Report
- Removed BOM markers from `dashboard-home.de-CH.ts` and `dashboard-home.pt.ts`.
- Recovered `Ăx` CP1250 mojibake sequences in `dashboard-home.de-CH.ts` and the single affected Portuguese string in `dashboard-home.pt.ts`.
- Corrected the corrupted German quote sequence in `editPositionDescription`.
- Added `translations.test.ts` coverage that walks loaded locale dictionaries and rejects encoding drift markers.

## Validation Evidence
- `corepack pnpm --filter web exec vitest run src/i18n/translations.test.ts src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.test.ts --reporter=verbose` -> PASS (`3` files, `17` tests).
- `rg -n "Ă|â€|﻿export" apps/web/src/i18n/namespaces/dashboard-home.de-CH.ts apps/web/src/i18n/namespaces/dashboard-home.pt.ts -S` -> PASS by no matches (`rg` exit `1`).
- Earlier broader `corepack pnpm --filter web run test -- src/i18n/translations.test.ts --run` also passed through current Web Vitest wiring (`157` files, `586` tests).

## Definition Of Done
- Code builds without errors: not rerun, because scope is locale/test only and focused Vitest proof passed.
- Real affected surface works: loaded locale dictionaries are exercised by `translations.test.ts`; runtime signal Dashboard acceptance pack passed.
- No temporary bypass: yes; regression test added.
- Documentation/source truth updated: yes, this task packet plus state ledger entries.
- Deploy impact: none.
- Commit/push/deploy: no commit, no push, no deploy due existing dirty worktree and no release operation requested.

## Residual Risk
- This was local frontend verification only. Production [LUC-1175](/LUC/issues/LUC-1175) remains blocked by its broader conformance/protected-path context until its owner rechecks parent gates.
- Existing unrelated dirty workspace changes remain untouched.
