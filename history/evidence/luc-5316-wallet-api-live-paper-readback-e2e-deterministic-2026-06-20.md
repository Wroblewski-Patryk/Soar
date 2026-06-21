# LUC-5316 Wallet API LIVE/PAPER Readback E2E Deterministic Evidence

Date: 2026-06-20

## Scope

- Issue: [LUC-5316](/LUC/issues/LUC-5316)
- Parent: [LUC-5309](/LUC/issues/LUC-5309)
- Owner lane: Core Backend Engineer
- Surfaces:
  - `apps/api/src/modules/wallets/wallets.service.ts`
  - `apps/api/src/modules/wallets/wallets.e2e.test.ts`
  - `apps/api/src/middleware/rateLimit.ts`

## Result

The wallet API LIVE/PAPER backend e2e proof is now deterministic for the scoped
local command. The repair keeps LIVE preview/create tests on the local Vitest
stub path when `VITEST=true`, avoids broad shared-DB cleanup inside the wallet
suite, and prevents the shared HTTP rate limiter from throttling normal Vitest
e2e flows unless explicit rate-limit test mode is enabled.

No production deploy, push, restart, rollback, env edit, secret/account
readback, real exchange I/O, exchange mutation, order, position,
payment/subscription mutation, or live-trading action occurred.

## Validation

```powershell
pnpm --filter api test -- src/modules/wallets/wallets.e2e.test.ts -t "caps LIVE preview reference balance|persists an initial LIVE wallet balance snapshot|includes wallet-owned imported LIVE open positions|includes wallet-owned imported LIVE open PnL only" --run
```

- Result: PASS
- Files: 1 passed
- Tests: 4 passed, 20 skipped

```powershell
pnpm --filter api test -- src/modules/wallets/wallets.e2e.test.ts src/modules/wallets/wallets.crud.e2e.test.ts --run
```

- Result: PASS
- Files: 2 passed
- Tests: 36 passed

```powershell
pnpm --filter api test -- src/middleware/rateLimit.test.ts --run
```

- Result: PASS
- Files: 1 passed
- Tests: 7 passed

## Acceptance Mapping

| Acceptance item | Evidence | Status |
| --- | --- | --- |
| Deterministic wallet API proof command | Wallet e2e plus CRUD e2e command passed with `36/36` tests. | VERIFIED |
| LIVE preview/create tests do not reach real authenticated exchange I/O under local e2e | Wallet preview service now treats `VITEST=true` as test runtime and uses the deterministic local balance stub. Passing LIVE preview/create assertions prove the local stub path. | VERIFIED_LOCAL |
| Shared DB interference removed or explicitly encoded | Wallet e2e no longer performs broad per-test destructive cleanup of users, wallets, bots, positions, orders, trades, signals, backtests, logs, and API keys. Test users now use unique emails. | VERIFIED_LOCAL |
| No live exchange mutation/secret/deploy/push | No production operation or live exchange/account action was performed. | VERIFIED |

## Residual Risk

- Production/live wallet exchange readback remains separately protected and was
  not run in this backend test-harness repair.
- Existing unrelated dirty work in the repository was not reverted or included
  in this proof.
