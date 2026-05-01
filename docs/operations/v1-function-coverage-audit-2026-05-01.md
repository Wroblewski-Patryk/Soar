# V1 Function Coverage Audit

Date: 2026-05-01
Status: INITIAL COVERAGE LEDGER

## Purpose

This audit introduces one canonical, filterable coverage ledger for Soar V1
functionality. Its job is to stop repeating ad-hoc verification loops and make
the current confidence level explicit per module, submodule, mode, capability,
scenario, local evidence, and production evidence.

## Artifacts

- CSV source: `docs/operations/v1-function-coverage-matrix-2026-05-01.csv`
- Workbook artifact:
  `outputs/v1-function-coverage-audit-2026-05-01/Soar V1 Function Coverage Audit 2026-05-01.xlsx`

The CSV is repository-tracked so the matrix can be reviewed in diffs. The XLSX
is the operator-friendly workbook for filtering and scanning.

## Column Contract

- `ID`: stable function/scenario identifier.
- `Module`: canonical module from `docs/modules/system-modules.md`.
- `Submodule`: narrower module area.
- `Mode`: runtime mode or scope (`LIVE`, `PAPER`, `BACKTEST`, `production`,
  `stage`).
- `Layer`: affected implementation layer.
- `Capability`: parent function.
- `Scenario / child function`: child row or concrete behavior.
- `Expected behavior`: what must be true when the function is working.
- `Local status`: local/test evidence classification.
- `Local evidence`: file, task, or test evidence.
- `Production status`: production evidence classification.
- `Production evidence`: production proof or blocker.
- `Confidence`: current confidence tier.
- `Risk`: why the row matters.
- `Priority`: V1 priority.
- `Owner`: likely owner for follow-up.
- `Next verification`: exact next proof to collect.
- `Last verified`: latest known verification date.
- `Notes`: context, caveats, or interpretation.

## Status Legend

- `PASS`: verified by current local or production evidence.
- `COVERED_LOCAL`: covered by local tests/docs, but not a dedicated current
  PASS marker.
- `PARTIAL`: some evidence exists, but at least one required production or
  scenario proof is missing.
- `NEEDS_PROD_SAMPLE`: local coverage exists, but production event/sample is
  still needed.
- `NEEDS_PROD_UI_CHECK`: feature exists locally; current production browser/UI
  proof is still needed.
- `NOT_VERIFIED`: no current explicit verification evidence found in the V1
  closure set.
- `NOT_APPLICABLE`: not meaningful for that environment or mode.
- `BLOCKED`: verification cannot proceed until an external dependency is
  resolved.
- `FAIL`: fresh verification was attempted and failed.

## Initial Findings

- The strongest covered production areas are DOGE/runtime DCA visibility,
  deploy freshness, authenticated OPS health, runtime freshness, rollback
  guard, and Binance Futures runtime context.
- The largest remaining P0 gaps are not hidden code tasks; they are evidence
  gaps:
  - production restore drill is `FAIL` until production DB container context is
    available;
  - stage is `BLOCKED` by `503`;
  - manual LIVE operator matrix remains incomplete;
  - fresh post-fix automated close event samples are still needed for
    strategyId and close-decision telemetry proof.
- Strategy close behavior has local coverage, but several rows still need
  production samples instead of inferred confidence.
- Wallet ledger and preview are implemented locally, but production preview and
  deposit/withdrawal replay evidence should be added before treating wallet
  analytics as fully production-proven.

## Operating Rule

Every future V1/V1.1 bugfix or confidence task should update this matrix by
changing the smallest relevant row or adding one child scenario row. A feature
should not be called "100% covered" unless both local and production status are
`PASS`, or production is explicitly `NOT_APPLICABLE` for that mode.

## Next Expansion

The current matrix is intentionally focused on V1 money-path and release-gate
functions. The next pass should add broader CRUD/UI rows for:

1. markets and market-group builder;
2. strategy create/edit/delete happy/error states;
3. bots CRUD and lifecycle controls;
4. backtest creation/results/timeline/chart rows;
5. reports;
6. profile/API-key lifecycle;
7. subscriptions/admin if they remain in the current launch scope.
