# V1 Function Coverage Audit

Date: 2026-05-01
Status: CODE-SCANNED COVERAGE LEDGER

## Purpose

This audit introduces one canonical, filterable coverage ledger for Soar V1
functionality. Its job is to stop repeating ad-hoc verification loops and make
the current confidence level explicit per module, submodule, mode, capability,
scenario, local evidence, and production evidence.

The reusable ledger model is now documented in
`docs/governance/function-coverage-ledger-standard.md`; this Soar V1 audit is a
project-specific instance of that standard.

The 2026-05-01 second pass scanned the actual API route/module map and web
dashboard route surface, then expanded the initial money-path ledger into a
broader top-level function inventory.

## Artifacts

- CSV source: `history/artifacts/v1-function-coverage-matrix-2026-05-01.csv`
- Workbook artifact:
  `history/artifacts/_artifacts-v1-function-coverage-audit-2026-05-01.xlsx`
- Implementation readiness audit:
  `history/audits/v1-function-implementation-readiness-audit-2026-05-01.md`

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

## Code-Scan Expansion

The second pass expanded the matrix from 33 to 79 rows. The ledger now covers
the primary top-level route/module families discovered in the code scan:

- `auth`, `admin`, `profile`, `subscriptions`;
- `wallets`, `markets`, `strategies`, `bots`, `orders`, `positions`,
  `backtests`, `reports`, `logs`;
- `exchange`, `market-data`, `market-stream`, `icons`, `upload`;
- `dashboard-home`, `engine`, `isolation`, `pagination`, and `ops`.

Current production status split after the second pass:

- `PASS=17`
- `PARTIAL=22`
- `NEEDS_PROD_SAMPLE=9`
- `NEEDS_PROD_UI_CHECK=12`
- `NOT_VERIFIED=11`
- `NOT_APPLICABLE=5`
- `BLOCKED=2`
- `FAIL=1`

Current priority split:

- `P0=45`
- `P1=24`
- `P2=10`

This does not mean every low-level parameter, UI state, or edge case is fully
enumerated. It means the main functional surfaces are now present in the
ledger, so the next audit can work row-by-row instead of rediscovering module
scope from scratch.

The follow-up readiness audit classified the 79 rows as `READY=22`,
`IMPLEMENTED_NEEDS_EVIDENCE=43`, `IMPLEMENTED_NOT_VERIFIED=11`,
`V1_BLOCKER=3`, and `REQUIRES_IMPLEMENTATION_REVIEW=0`. In practical terms,
the current ledger does not show a broad missing implementation area; V1 is
blocked by release-gate/ops issues and production-confidence gaps.

## Operating Rule

Every future V1/V1.1 bugfix or confidence task should update this matrix by
changing the smallest relevant row or adding one child scenario row. A feature
should not be called "100% covered" unless both local and production status are
`PASS`, or production is explicitly `NOT_APPLICABLE` for that mode.

## Next Expansion

The current matrix now covers the major top-level functions. The next pass
should go deeper inside the highest-risk `P0` and `PARTIAL` rows by splitting:

1. each strategy close/additional option into basic/advanced parameter rows;
2. each bot lifecycle control into LIVE/PAPER happy/error/permission rows;
3. each wallet analytics metric into API/UI/formula/prod-sample rows;
4. each manual order path into market/limit/cancel/close/reduce-only rows;
5. each backtest report/timeline/chart behavior into data-contract rows;
6. each auth/profile/API-key/admin flow into ownership and error-state rows;
7. each production gate row into exact proof commands and owner sign-off rows.
