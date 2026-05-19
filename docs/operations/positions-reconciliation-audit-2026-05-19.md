# Positions And Reconciliation Audit - 2026-05-19

## Scope

Audit ID: `AUD-13`

Purpose: verify the discrepancy risk between documented positions/reconciliation
contracts and the current implementation.

This audit inspected and validated:

- position list/read ownership and symbol filter normalization
- live-status scoping
- authenticated exchange snapshot selection, normalization, and fail-closed
  behavior
- takeover status classification and rebind behavior
- wallet-owned takeover truth
- local orphan repair
- live reconciliation ownership, ambiguity, stale-close, and open-order
  handling
- imported position history hydration
- runtime position PnL derivation and close-action UI states

## Result

Status: `current local / current historical production-safe PAPER proof`

The audited local positions/reconciliation implementation is aligned with the
documented V1 contracts for the audited scope. Focused API and Web proofs
passed.

The latest production-safe PAPER positions proof remains historical 2026-05-14
evidence. No production journey was rerun in this audit.

## Validation Run

| Command / Proof | Result | Notes |
| --- | --- | --- |
| `corepack pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.runtime-origin.test.tsx src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/utils/runtimeOpenPositionDerivations.test.ts src/features/bots/components/bots-management/BotsMonitoringProtectionCell.tsx` | PASS | `6` test files, `46` tests. Covers runtime position derivations, origin/provenance display, close action states, runtime table presenters, and bot monitoring open-position derivations. |
| `corepack pnpm run go-live:infra:up` | PASS | Started local Postgres/Redis for DB-backed API proof. |
| `corepack pnpm --filter api exec vitest run src/modules/positions/positions.service.test.ts src/modules/positions/positions.list.e2e.test.ts src/modules/positions/positions-live-status.e2e.test.ts src/modules/positions/positions.exchangeSnapshot.e2e.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/positions/positions.orphan-repair.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/livePositionReconciliation.diagnostics.test.ts src/modules/positions/positions.authenticatedSnapshots.service.test.ts src/modules/positions/positions.exchangeSnapshotNormalization.test.ts src/modules/positions/importedPositionHistoryHydrator.service.test.ts` | PASS | `11` files, `68` tests. Expected stderr appears in tests that intentionally generate ambiguous/unowned/missing-entry and snapshot-failure diagnostics. |
| `corepack pnpm run go-live:infra:down` | PASS | Local Postgres/Redis containers and network were removed after validation. |

## Architecture And Documentation Parity

Reviewed sources:

- `docs/modules/api-positions.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/analysis/reusable-audit-registry.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/risk-register.md`

No new architecture-code mismatch was found for `AUD-13`. The current local
positions/reconciliation evidence supports the documented ownership,
takeover, snapshot, and fail-closed contracts for the audited scope.

## Findings

| ID | Severity | Finding | Evidence | Status |
| --- | --- | --- | --- | --- |
| AUD-POS-001 | P0 | Position list/read, live status, exchange snapshots, and ownership isolation are current locally. | API pack passed `11` files / `68` tests. | closed |
| AUD-POS-002 | P0 | Takeover, orphan repair, imported history hydration, and reconciliation diagnostics are current locally. | API pack passed `11` files / `68` tests. | closed |
| AUD-POS-003 | P0 | Runtime position UI derivation and close-state behavior are current locally. | Web pack passed `6` test files / `46` tests. | closed |
| AUD-POS-004 | P1 | Fresh production proof was not rerun. | Latest accepted production-safe PAPER positions proof is from 2026-05-14. | open freshness follow-up |
| AUD-POS-005 | P1 | LIVE position mutation remains explicitly excluded. | No LIVE exchange-side mutation was run, by design. | explicit exclusion |

## Safety Notes

- No production journey was run.
- No LIVE order, cancel, close, activation, position mutation, or exchange-side
  mutation was run.
- No existing production data was mutated.
- Local Postgres/Redis were started only for DB-backed tests and then stopped.

## Current Reusable Audit State

`AUD-13` is current for local V1 positions/reconciliation behavior and remains
backed by historical production-safe PAPER positions proof from 2026-05-14.

Keep this audit open for:

1. refreshing production-safe PAPER positions proof after future deployments;
2. any explicit safe plan for LIVE position mutation proof;
3. rerunning the same focused packs after position list/read, exchange snapshot,
   takeover, reconciliation, or runtime close-state changes.
