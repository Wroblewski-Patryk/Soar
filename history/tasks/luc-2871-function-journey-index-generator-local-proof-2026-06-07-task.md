# LUC-2871 Function Journey Index Generator Local Proof

Date: 2026-06-07

## Scope

Local Test Automation proof and scanner relation repair for
`scripts/generateFunctionJourneyIndexes.mjs`.

No browser, deploy, production smoke, protected credentials, account, database,
exchange, order, position, restart, rollback, push, or live-trading mutation
was performed.

## Implementation

- Made `scripts/generateFunctionJourneyIndexes.mjs` import-safe while preserving
  direct CLI behavior.
- Exported focused helper seams for local proof:
  `parseCsv`, `readCsv`, `splitRefs`, `csvEscape`, `writeCsv`, `list`,
  `statusRank`, `normalizeStatus`, `weakestStatus`, `gapSeverity`,
  `isApiDataSourceRelation`, `isUserFacingChain`, and `main`.
- Added `scripts/generateFunctionJourneyIndexes.test.mjs` with local `node:test`
  coverage for CSV parsing/writing, status and gap helpers, relation/chain
  classifiers, and isolated temp-root `main()` generation.
- Added 13 scanner-readable `LUC-2871` rows to
  `docs/architecture/relations/priority-test-links.csv`.
- Refreshed function journey indexes and architecture-awareness exports.

## Verification

- `node --check scripts/generateFunctionJourneyIndexes.mjs` PASS.
- `node --check scripts/generateFunctionJourneyIndexes.test.mjs` PASS.
- `node --test scripts/generateFunctionJourneyIndexes.test.mjs` PASS (`6/6`).
- `node scripts/generateFunctionJourneyIndexes.mjs --fail-on-critical-gaps`
  PASS: `27` chains, `38` web journeys, `96` API surfaces, `0` critical gaps,
  `28` high gaps.
- Direct relation readback PASS: `13` `LUC-2871` rows.
- `pnpm run architecture:graph:generate` PASS: `653` nodes, `842` relations,
  `27` chains.
- `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  PASS from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse`:
  `15004` entities, `34265` relations, `9715` files.
- `pnpm run quality:guardrails` PASS.
- `git diff --check -- <scoped files>` PASS; warnings were LF/CRLF notices
  only.

## Residual Risk

- `docs/status/architecture-awareness-report.md` generated
  `2026-06-07T16:31:41.947Z` reports `264` actionable implementation entities
  without inferred tests.
- All 13 scoped helper anchors from `LUC-2871` are absent from the refreshed
  report. The only remaining `generateFunctionJourneyIndexes` top actionable
  row is `scripts/generateFunctionJourneyIndexes.mjs#chains`, which was outside
  this issue's requested helper list and appears to be a scanner-inferred
  generated artifact.
- The Soar worktree contained substantial pre-existing dirty and untracked work
  from adjacent lanes; this task did not revert or claim those unrelated
  changes.

## Affected Architecture Entities

- `feature:generatefunctionjourneyindexes-mjs:20f327f194`
- `function:parsecsv:fbed47fcc8`
- `function:readcsv:e76b0bb298`
- `function:splitrefs:c5e0a0e9e2`
- `function:csvescape:41193c4f47`
- `function:writecsv:512eadcc05`
- `function:list:010a2ea1eb`
- `function:statusrank:f2efee8e39`
- `function:normalizestatus:f2c79e01d2`
- `function:weakeststatus:b97ddbf02b`
- `function:gapseverity:00871450a1`
- `function:isapidatasourcerelation:6da8784d71`
- `function:isuserfacingchain:9b5b2d7b55`
- `function:main:89d3c10919`
