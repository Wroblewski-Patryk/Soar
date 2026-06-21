# LUC-5309 Wallet LIVE/PAPER Dashboard Readback Triage - 2026-06-20

## Status

- Issue: [LUC-5309](/LUC/issues/LUC-5309)
- Result: `PARTIALLY_VERIFIED / PRODUCT_REPAIR_NOT_PROVEN / TEST_HARNESS_REPAIR_DELEGATED`
- Role: QVE / QA verification.
- Scope: local wallet list/detail/readback contracts, wallet balance source
  boundaries, selected wallet dashboard rendering, exchange adapter read
  boundary, and repair triage.

## Source Context

- Parent report: `history/evidence/luc-5307-app-function-execution-report-2026-06-20.md`.
- Architecture contracts reviewed:
  - `docs/modules/api-wallets.md`
  - `docs/architecture/reference/live-paper-runtime-safety-contract.md`
  - `docs/graphs/function-journey-index.json` (`CHAIN-WALLETS-CORE`,
    `CHAIN-DASHBOARD-RUNTIME`, `CHAIN-EXCHANGE-ADAPTER-DEEP`)

## Proof Matrix

| Area | Status | Evidence |
| --- | --- | --- |
| Web dashboard selected wallet/runtime rendering | `verified local` | `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx src/features/wallets/components/WalletsListTable.test.tsx src/features/wallets/components/WalletPreviewPanel.test.tsx --run` passed (`4` files / `10` tests). |
| Exchange authenticated read capability contracts | `verified local` | `NODE_ENV=test pnpm --filter api test -- src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts --run` passed (`4` files / `19` tests). |
| Wallet API balance preview / ledger / LIVE-PAPER analytics | `verified local with explicit test env` | `NODE_ENV=test pnpm --filter api test -- src/modules/wallets/wallets.e2e.test.ts --run` passed (`24/24`) as part of the wallet pack rerun. This covers LIVE balance preview allocation, Gate.io preview, initial LIVE snapshot/cashflow, imported LIVE open PnL scoping, analytics validation, and PAPER reset guards. |
| Wallet CRUD/list/detail/ownership | `verified local with isolated DB run` | `NODE_ENV=test pnpm --filter api test -- src/modules/wallets/wallets.crud.e2e.test.ts --run` passed (`12/12`). This covers PAPER create, LIVE key/allocation validation, list ownership, get/update/delete isolation, active-bot edit/delete guard, and history detachment on wallet delete. |
| Default API wallet command | `failed / repair needed` | `pnpm --filter api test -- src/modules/wallets/wallets.e2e.test.ts src/modules/wallets/wallets.crud.e2e.test.ts --run` failed (`9` wallet failures). LIVE create returned `500`; LIVE/Gate.io preview returned `502`; one metadata test timed out. Focused rerun showed `process.env.NODE_ENV` was not `test`, so the test-only wallet preview stub in `wallets.service.ts` was bypassed and the command attempted the authenticated exchange boundary. |
| Combined wallet DB-e2e run with explicit test env | `failed / isolation risk` | `NODE_ENV=test` combined wallet e2e command improved to `35/36` but failed one CRUD historical-row assertion because the other e2e file's cleanup deleted shared DB rows during the same command. Running `wallets.crud.e2e.test.ts` alone passed (`12/12`). |

## Triage Finding

No product-code repair is proven from this heartbeat. The strongest current
finding is a QA/test-harness defect:

1. The canonical `pnpm --filter api test -- ...` wallet e2e command does not
   guarantee `NODE_ENV=test`, but `apps/api/src/modules/wallets/wallets.service.ts`
   gates the wallet balance preview stub on `process.env.NODE_ENV === 'test'`.
   Without that env, local wallet preview tests can hit the real authenticated
   exchange adapter boundary and return `502`.
2. Running `wallets.e2e.test.ts` and `wallets.crud.e2e.test.ts` in the same
   command can still interfere through the shared DB cleanup model, even with
   `fileParallelism: false`. The isolated CRUD run is green.

## Product Confidence

- `PAPER` wallet list/detail/CRUD/reset behavior is locally verified.
- `LIVE` wallet list/detail/create/preview/readback behavior is locally
  verified only when the test environment is explicit and DB packs are
  isolated.
- Web dashboard wallet rendering and selected-runtime wallet KPI behavior is
  locally verified.
- Fresh production authenticated browser proof and approved LIVE account
  readback remain outside this heartbeat and require protected inputs. No
  production claim is made.

## Commands Run

```powershell
pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx src/features/wallets/components/WalletsListTable.test.tsx src/features/wallets/components/WalletPreviewPanel.test.tsx --run
```

Result: PASS, `4` files / `10` tests.

```powershell
pnpm --filter api test -- src/modules/wallets/wallets.e2e.test.ts src/modules/wallets/wallets.crud.e2e.test.ts --run
```

Result: FAIL, `9` failures from LIVE preview/create `500/502` and one metadata
timeout.

```powershell
$env:NODE_ENV='test'; pnpm --filter api test -- src/modules/wallets/wallets.e2e.test.ts src/modules/wallets/wallets.crud.e2e.test.ts --run
```

Result: FAIL, `35/36` passed; one shared-DB interference failure in
`wallets.crud.e2e.test.ts`.

```powershell
$env:NODE_ENV='test'; pnpm --filter api test -- src/modules/wallets/wallets.crud.e2e.test.ts --run
```

Result: PASS, `12/12`.

```powershell
$env:NODE_ENV='test'; pnpm --filter api test -- src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts --run
```

Result: PASS, `4` files / `19` tests.

## Follow-Up

- Created follow-up [LUC-5316](/LUC/issues/LUC-5316) for Core Backend/Test
  Automation to make the wallet API test command deterministic:
  set or replace the wallet preview test-env guard, and isolate or sequence
  shared-DB wallet e2e packs so the focused wallet verification command passes
  without accidental real exchange reads or cross-file cleanup interference.

## Safety

No deploy, push, restart, rollback, env edit, secret readback, raw account data
artifact, production account use, database mutation outside local test DB,
exchange mutation, order, position, payment/subscription mutation, broad UI
rewrite, or live-trading action occurred.
