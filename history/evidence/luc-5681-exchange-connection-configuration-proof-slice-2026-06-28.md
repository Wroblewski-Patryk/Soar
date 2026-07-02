# LUC-5681 Exchange Connection/Configuration QA Proof

Status: `DONE / VERIFIED_LOCAL / EXCHANGE_CONNECTION_CONFIGURATION_PROOF_PASS`

## Summary

[LUC-5681](/LUC/issues/LUC-5681) completed a focused local QA packet for exchange connection/configuration. The proof covers configured and unconfigured exchange states, redacted API-key handling, connection-test behavior, placeholder/fail-closed paths, and Web profile/exchange UI state.

No push, deploy, restart, protected smoke, secret/account readback, production mutation, exchange mutation, order, position, or live-trading action occurred.

## Commands

```powershell
docker compose up -d postgres redis
```

Result: PASS. Local task-owned Postgres/Redis started.

```powershell
pnpm --filter api exec prisma migrate reset --force --skip-seed
```

Result: PASS. Local DB reset and migrations applied.

```powershell
pnpm --filter api exec vitest run src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts src/modules/profile/apiKey/apiKey.e2e.test.ts -t "^(?!.*forces sync flag on when manage-external is enabled).*" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000
```

Result: PASS, `2` files / `26` tests passed / `1` skipped.

```powershell
pnpm --filter api exec vitest run src/modules/profile/apiKey/apiKey.e2e.test.ts -t "forces sync flag on when manage-external is enabled" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000
```

Result: PASS, `1` test passed / `18` skipped, after local DB reset.

```powershell
pnpm --filter web exec vitest run src/features/profile/components/ApiKeyForm.test.tsx src/features/profile/components/ApiKeysList.test.tsx src/features/profile/services/apiKeys.service.test.ts src/features/exchanges/exchangeCapabilities.test.ts src/features/exchanges/components/ExchangeConnectionsView.test.tsx src/app/dashboard/profile/page.test.tsx
```

Result: PASS, `6` files / `23` tests.

## Verification Matrix

| Requirement | Evidence | Status |
| --- | --- | --- |
| Configured exchange connection tests | Binance and Gate.io provided/stored probe API tests; Web successful connection and stored-connection edit-mode tests | verified |
| Unconfigured/placeholder exchanges | API placeholder probe returns explicit not-implemented contract; Web disables probe and shows unavailable state | verified |
| Redacted evidence | API encrypted-only/masked key tests and audit metadata checks; Web service drops returned raw secrets and redacts backend errors | verified |
| Fail-closed behavior | unauthenticated API access, missing auth, ownership enforcement, invalid-key, missing futures permission, unsupported placeholder probe | verified |
| No live exchange mutation | local tests only; no protected inputs or real exchange calls used | verified |

## Residual

The whole API e2e file in one sequential run produced one cleanup-order residual after DB reset:

- `src/modules/profile/apiKey/apiKey.e2e.test.ts`
- failing setup: `beforeEach` -> `prisma.user.deleteMany()`
- signature: `Foreign key constraint violated on the constraint: ApiKey_userId_fkey`

The product case itself passed in isolation, and the remaining focused API/Web proof passed. Classification: test-harness cleanup isolation residual, not a product regression in exchange configuration.

Production/live exchange proof remains separately protected and was not run.
