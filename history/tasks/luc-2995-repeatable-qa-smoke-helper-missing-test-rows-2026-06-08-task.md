# Task

## Header
- ID: LUC-2995
- Title: [Soar][Test Automation][LUC-2992] Resolve repeatable QA smoke helper missing-test rows
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2992](/LUC/issues/LUC-2992)
- Priority: P0
- Module Confidence Rows: Architecture Evidence Graph / repeatable QA smoke wrapper traceability
- Requirement Rows: not applicable
- Quality Scenario Rows: test automation traceability
- Risk Rows: no protected runtime or production mutation
- Iteration: 2026-06-08
- Operation Mode: TESTER
- Mission ID: LUC-2995-REPEATABLE-QA-SMOKE-HELPER-MISSING-TEST-ROWS-2026-06-08
- Mission Status: VERIFIED

## Context
[LUC-2992](/LUC/issues/LUC-2992) delegated the local-safe residual
`scripts/runQaRepeatableSmokeE2e.mjs` missing-test rows for `hasFlag`,
`readArgValue`, and `runCheck`. Aggregate repeatable smoke evidence already
exists, but the function anchors did not have scanner-readable focused helper
proof.

## Goal
Make the repeatable QA smoke runner import-safe, add focused local helper
tests, and add direct priority test-link relations so the architecture scanner
no longer reports the runner helper anchors as actionable missing-test rows.

## Scope
- `scripts/runQaRepeatableSmokeE2e.mjs`
- `scripts/runQaRepeatableSmokeE2e.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture-awareness outputs under `docs/graphs/` and
  `docs/status/`
- source-of-truth state: `.agents/state/active-mission.md`,
  `.agents/state/module-confidence-ledger.md`, `.codex/context/TASK_BOARD.md`

## Implementation Plan
1. Preserve direct CLI behavior while moving the runner into an import-safe
   `main()` guard.
2. Export `hasFlag`, `readArgValue`, `runCheck`, and `main` for focused local
   proof.
3. Add deterministic `node:test` coverage using injected argv, command runner,
   filesystem temp directories, and output streams.
4. Add direct scanner-readable [LUC-2995](/LUC/issues/LUC-2995) relations.
5. Regenerate architecture graph/awareness outputs and run focused validation.

## Acceptance Criteria
- Focused tests prove CLI argument helpers, injected command execution,
  artifact/evidence writing, continue-on-fail, stop-on-fail, and unsupported
  check fail-closed behavior without running real smoke packs.
- `docs/architecture/relations/priority-test-links.csv` has direct
  [LUC-2995](/LUC/issues/LUC-2995) rows for `hasFlag`, `main`, `readArgValue`,
  and `runCheck`.
- Refreshed architecture-awareness report does not list
  `scripts/runQaRepeatableSmokeE2e.mjs` in Top Actionable Missing Test Links.

## Definition of Done
- [x] Existing CLI behavior preserved.
- [x] Focused helper tests pass.
- [x] Architecture graph/awareness outputs refreshed.
- [x] Source-of-truth state updated.
- [x] No protected smoke, secrets, deploy, push, restart, rollback, database,
      exchange, order, position, account, payment/subscription, or live-trading
      mutation occurred.

## Validation Evidence
- `node --check scripts/runQaRepeatableSmokeE2e.mjs` -> PASS.
- `node --check scripts/runQaRepeatableSmokeE2e.test.mjs` -> PASS.
- `node scripts/runQaRepeatableSmokeE2e.mjs --help` -> PASS.
- `node --test scripts/runQaRepeatableSmokeE2e.test.mjs` -> PASS (`5/5`).
- Direct relation readback for [LUC-2995](/LUC/issues/LUC-2995) -> PASS (`4`
  rows).
- `pnpm run architecture:graph:generate` -> PASS (`653` nodes / `842`
  relations / `27` chains).
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  -> PASS (`9351` entities / `29528` relations / `9742` files).
- `docs/status/architecture-awareness-report.md` generated
  `2026-06-08T00:37:30.029Z` no longer lists
  `scripts/runQaRepeatableSmokeE2e.mjs` in Top Actionable Missing Test Links.
- `pnpm run quality:guardrails` -> PASS.
- `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` -> no
  process returned.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`,
  `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: generated awareness outputs refreshed.

## Security / Ops Evidence
- Secret handling: no secret-bearing args or env values used.
- Protected proof: not run.
- Deploy impact: none.
- Rollback note: local helper/test-only change; revert code/test/relation rows
  if needed.

## Result Report
- Task summary: implemented and verified focused helper tests and direct
  architecture relations for the repeatable QA smoke runner.
- Files changed: `scripts/runQaRepeatableSmokeE2e.mjs`,
  `scripts/runQaRepeatableSmokeE2e.test.mjs`,
  `docs/architecture/relations/priority-test-links.csv`, generated
  architecture-awareness outputs, and local state/evidence files.
- How tested: syntax checks, focused Node test, safe help path, direct relation
  readback, architecture graph generation, architecture-awareness refresh,
  repository guardrails, and process cleanup check.
- What is incomplete: full `qa:smoke-e2e:repeatable -- --checks
  web,api,backtests` remains a broader QA smoke evidence gate and was
  intentionally not run in this helper-unit lane.
- Next steps: PM/QA should continue the remaining actionable missing-test
  families shown in the refreshed architecture-awareness report.
- Decisions made: classify this as local helper traceability only, not a
  release-readiness or protected production smoke upgrade.
