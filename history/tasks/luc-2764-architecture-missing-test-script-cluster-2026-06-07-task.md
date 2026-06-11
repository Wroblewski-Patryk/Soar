# LUC-2764 Architecture Missing-Test Script Cluster

Date: 2026-06-07
Stage: verification
Process: regression evidence loop

## Context

`docs/status/architecture-awareness-report.md` listed the top actionable
missing-test cluster across four evidence/ops scripts:

- `scripts/collectNonGateioRuntimeReadback.mjs`
- `scripts/collectSloEvidence.mjs`
- `scripts/compareReusableAuditManifests.mjs`
- `scripts/deploySmokeCheck.mjs`

Protected production smoke, deploy, restart, and secret-bearing checks were out
of scope.

## Goal

Add or identify the smallest local/dry-run proof coverage for the listed script
helpers and update architecture graph evidence so the scanner no longer reports
the cluster as top missing-test links.

## Constraints

- No production smoke was run.
- No deploy, restart, account mutation, or protected credential access was used.
- Tests cover local helper behavior, parser behavior, fail-closed validation,
  redaction, retry/failure behavior, and report math.

## Result

Implemented and verified.

- Added `scripts/collectNonGateioRuntimeReadback.test.mjs` for import-safe
  helper coverage, redaction hashes, numeric guards, summary shaping,
  fail-closed auth validation, and local HTTP error handling.
- Added `scripts/collectSloEvidence.test.mjs` for CLI parsing, secret-bearing
  flag rejection, local/private host detection, SLO summary math, objective
  evaluation, and markdown redaction.
- Exported helper functions and guarded CLI entrypoints in
  `scripts/collectNonGateioRuntimeReadback.mjs` and
  `scripts/collectSloEvidence.mjs` so tests can import them without executing
  production readback.
- Linked collector, reusable-audit compare, and deploy smoke functions to their
  tests in `docs/architecture/relations/priority-test-links.csv`.
- Refreshed architecture-awareness exports. The named cluster no longer appears
  in `docs/status/architecture-awareness-report.md`.

## Verification

- `node --test scripts/collectNonGateioRuntimeReadback.test.mjs scripts/collectSloEvidence.test.mjs scripts/compareReusableAuditManifests.test.mjs scripts/deploySmokeCheck.test.mjs`
  - Result: pass, 20 tests.
- `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse`
  - Result: pass, exported graph/report files.

## Evidence

- `docs/status/architecture-awareness-report.md` generated at
  `2026-06-07T10:27:22.787Z`.
- Actionable implementation entities without inferred tests dropped from `377`
  to `337`.
- `Select-String` for the four script names in the refreshed top missing-test
  report returned no matches.

## Residual Risk

Remaining top missing-test rows now belong to other script families such as
`scripts/dev-backend.mjs`, `scripts/dev-workers.mjs`,
`scripts/evaluateRollbackGuard.mjs`, and
`scripts/generateFunctionJourneyIndexes.mjs`; they are outside this issue's
cluster.
