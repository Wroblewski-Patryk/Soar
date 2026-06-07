# LUC-2685 V1 Completion Scorecard Missing-Test Links - 2026-06-07

## Header
- ID: LUC-2685
- Title: Cover V1 completion scorecard missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2684](/LUC/issues/LUC-2684)
- Priority: P0
- Mission ID: LUC-2685-V1-COMPLETION-SCORECARD-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2684](/LUC/issues/LUC-2684) refreshed architecture-awareness after
[LUC-2674](/LUC/issues/LUC-2674) and [LUC-2678](/LUC/issues/LUC-2678). The
next top actionable missing-test family was `scripts/buildV1CompletionScorecard.mjs`.

## Goal
Add focused local proof and scanner-readable relation rows for the current V1
completion scorecard helper anchors without changing product runtime behavior.

## Scope
- `scripts/buildV1CompletionScorecard.mjs`
- `scripts/buildV1CompletionScorecard.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- project state/evidence files for LUC-2685 closure

## Implementation Plan
1. Make the scorecard script import-safe while preserving direct CLI behavior.
2. Export the existing helper functions for focused Node proof.
3. Add a focused `node:test` suite covering CLI parsing, scoring, fail-closed
   GO/NO-GO behavior, markdown escaping, latest ledger discovery, JSON/help
   helpers, and explicit temporary-file `main` output.
4. Add scanner-readable `LUC-2685` rows for the proved anchors.
5. Run syntax, focused test, architecture graph generation, and guardrails.

## Acceptance Criteria
- Focused proof passes.
- Relation rows cover the named scorecard anchors.
- Closure records files changed, commands/results, residual risk, and protected
  boundary posture.

## Definition Of Done
- [x] Existing scorecard CLI behavior preserved for direct execution.
- [x] Import-safe helper proof added.
- [x] Architecture relation rows added for proved anchors.
- [x] Validation passed.
- [x] No deploy, push, restart, rollback, production smoke/browser,
      env/secret/account mutation, exchange mutation, database mutation, or
      live-trading mutation occurred.

## Validation Evidence
- `node --check scripts/buildV1CompletionScorecard.mjs` PASS.
- `node --check scripts/buildV1CompletionScorecard.test.mjs` PASS.
- `node --test scripts/buildV1CompletionScorecard.test.mjs` PASS (`7/7`).
- `rg -n "LUC-2685" docs/architecture/relations/priority-test-links.csv`
  PASS (`14` rows).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations /
  `27` chains).
- `pnpm run quality:guardrails` PASS.

## Architecture Evidence
- Architecture source reviewed: [LUC-2685](/LUC/issues/LUC-2685) issue context,
  `docs/architecture/relations/priority-test-links.csv`, and generated
  architecture graph outputs.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: direct relation rows in
  `docs/architecture/relations/priority-test-links.csv`.

## Result Report
- Task summary: made `scripts/buildV1CompletionScorecard.mjs` import-safe,
  exported helper functions, added focused local scorecard tests, and mapped the
  current scorecard anchors to scanner-readable `LUC-2685` relation rows.
- Files changed:
  - `scripts/buildV1CompletionScorecard.mjs`
  - `scripts/buildV1CompletionScorecard.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - project state/evidence files
- How tested: syntax checks, focused Node test, relation readback, architecture
  graph generation, and repository guardrails.
- What is incomplete: exact external architecture-awareness top-sample removal
  was not rerun in this Test Automation lane; graph generation and relation
  readback passed locally.
- Next steps: next TSA/PM refresh may consider `scripts/buildV1MasterStateLedger.mjs`
  if a fresh architecture-awareness report still lists it as the next
  non-duplicate actionable family.
