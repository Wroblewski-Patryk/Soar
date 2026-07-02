# LUC-6312 Architecture Baseline Missing Test-Link Reconciliation

## Summary

- Status: `PASS / RECONCILED / ZERO_ACTIONABLE_MISSING_TEST_LINKS`.
- Scope: eight actionable architecture-awareness missing-test-link rows from
  [LUC-6312](/LUC/issues/LUC-6312).
- Runtime impact: none.
- Production impact: none.

## Reconciled Rows

| Source | Proof |
| --- | --- |
| `apps/api/src/lib/capitalAllocation.ts#resolveReferenceBalanceFromAllocation` | `apps/api/src/modules/architectureBaselineProof.test.ts` |
| `apps/api/src/middleware/noStoreHeaders.ts#applyNoStoreHeaders` | `apps/api/src/modules/architectureBaselineProof.test.ts` |
| `apps/api/src/modules/backtests/backtestIndicatorSpecs.ts#asPeriod` | `apps/api/src/modules/architectureBaselineProof.test.ts` |
| `apps/api/src/modules/backtests/backtestIndicatorSpecs.ts#clamp` | `apps/api/src/modules/architectureBaselineProof.test.ts` |
| `apps/api/src/modules/backtests/backtestIndicatorSpecs.ts#resolveIndicatorWarmupCandles` | `apps/api/src/modules/architectureBaselineProof.test.ts` |
| `apps/api/src/modules/engine/runtimeExecutionClientOrderId.ts#buildRuntimeClientOrderId` | `apps/api/src/modules/architectureBaselineProof.test.ts` |
| `apps/web/src/ui/components/ProfileButton.tsx#handleProfileSectionNavigation` | existing `apps/web/src/ui/components/SharedUiPrimitives.test.tsx` |
| `scripts/runProdAuthSessionBrowserProof.mjs#buildAuthApiHeaders` | existing `scripts/runProdAuthSessionBrowserProof.test.mjs` |

## Validation

- `pnpm --filter api exec vitest run src/modules/architectureBaselineProof.test.ts --run`
  - PASS: `1` file, `4` tests.
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  - PASS: `10199` entities, `32531` relations, `12436` files.
- `pnpm run architecture:graph:drift:strict`
  - PASS: `850/850` covered, `0` missing.
- `docs/status/architecture-awareness-report.md`
  - `Top Actionable Missing Test Links` is empty after regeneration.

## Files

- Added: `apps/api/src/modules/architectureBaselineProof.test.ts`.
- Updated: `docs/architecture/relations/priority-test-links.csv`.
- Updated: `docs/architecture/registry/tests.csv`.
- Regenerated: `docs/graphs/architecture-awareness.*`,
  `docs/graphs/architecture-proof-register.csv`,
  `docs/graphs/architecture-health.json`,
  `docs/status/architecture-awareness-report.md`,
  `docs/status/architecture-dependency-report.md`,
  `docs/status/architecture-ownership-report.md`,
  `docs/status/task-synchronization-report.md`,
  `docs/status/architecture-graph-drift.md`, and
  `history/artifacts/architecture-graph-drift-2026-05-24.json`.

## Boundaries

No push, deploy, restart, production smoke, secret/account readback,
exchange/payment mutation, order, position, subscription mutation, or
live-trading action occurred.

## Residual Risk

No residual actionable missing-test-link rows remain for this LUC-6312 scope.
The shared worktree still contains unrelated dirty changes from other lanes;
they were not reverted or staged by this task.
