# LUC-2725 Docs Parity Checker Missing-Test Links

## Header
- ID: LUC-2725
- Title: [Soar][Architecture QA][LUC-2723] Cover docs parity checker missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P0
- Module Confidence Rows: Architecture Evidence Graph relation confidence; docs parity tooling
- Requirement Rows: REQ-DOC-031
- Mission ID: LUC-2725-DOCS-PARITY-CHECKER-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2723](/LUC/issues/LUC-2723) refreshed architecture-awareness after
completed [LUC-2702](/LUC/issues/LUC-2702) and identified
`scripts/checkDocsParity.mjs` as the current top actionable missing-test family.
The script behavior already passed `pnpm run docs:parity:check`; this lane
owned focused helper proof and scanner-readable relation repair.

## Goal
Add direct function-level proof for the docs parity checker helpers and record
scanner-readable relation rows without changing docs parity behavior.

## Scope
- `scripts/checkDocsParity.mjs`
- `scripts/checkDocsParity.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- Local state/evidence files for LUC-2725 closure

## Implementation Plan
1. Make `scripts/checkDocsParity.mjs` import-safe while preserving direct CLI
   execution.
2. Export current helper functions and add optional argument injection for
   focused tests.
3. Add focused `node:test` coverage for CLI parsing, direct CLI invocation,
   path helpers, filesystem helpers, page-route normalization, markdown
   parsers, mismatch collection, help rendering, and a real `main` JSON-output
   run.
4. Add direct `LUC-2725` rows to
   `docs/architecture/relations/priority-test-links.csv`.
5. Run syntax, focused test, docs parity, graph generation, and guardrails.

## Acceptance Criteria
- Current `checkDocsParity` helper anchors have focused tests plus direct
  scanner-readable relation rows.
- `scripts/checkDocsParity.mjs` remains CLI-compatible.
- `pnpm run docs:parity:check`, `pnpm run architecture:graph:generate`, and
  `pnpm run quality:guardrails` pass.

## Definition of Done
- [x] Existing docs parity behavior is preserved.
- [x] Focused helper proof exists and passes.
- [x] Architecture relation rows are scanner-readable.
- [x] Validation evidence is recorded.
- [x] No runtime, deploy, account, secret, exchange, database, or live-trading
      mutation occurred.

## Validation Evidence
- `node --check scripts/checkDocsParity.mjs`: PASS.
- `node --check scripts/checkDocsParity.test.mjs`: PASS.
- `node --test scripts/checkDocsParity.test.mjs`: PASS (`8/8`).
- `rg -n "LUC-2725" docs/architecture/relations/priority-test-links.csv`:
  PASS (`13` rows).
- `pnpm run docs:parity:check`: PASS.
- `pnpm run architecture:graph:generate`: PASS (`653` nodes / `842`
  relations / `27` chains).
- `pnpm run quality:guardrails`: PASS.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/relations/priority-test-links.csv`,
  `docs/status/architecture-awareness-report.md`,
  `history/tasks/luc-2723-architecture-awareness-after-coolify-env-proof-closure-2026-06-07-task.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; relation graph regenerated.

## Result Report
- Task summary: made the docs parity checker import-safe, added direct helper
  tests, and linked the helper anchors to the focused test file.
- Files changed:
  - `scripts/checkDocsParity.mjs`
  - `scripts/checkDocsParity.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - generated architecture graph/status outputs from
    `pnpm run architecture:graph:generate`
  - local state/evidence files for this LUC-2725 closure
- How tested: syntax checks, focused Node test, relation readback, docs parity,
  architecture graph generation, and repository guardrails all passed.
- What is incomplete: none for this issue.
- Next steps: parent architecture/no-stall lane may refresh readback after
  LUC-2725 closure to select the next non-duplicate actionable family.
- Decisions made: no docs parity behavior change was needed because focused
  proof and live parity check passed.
