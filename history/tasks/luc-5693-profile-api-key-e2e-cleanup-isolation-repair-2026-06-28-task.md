# LUC-5693 Profile API-Key E2E Cleanup Isolation Repair - 2026-06-28

## Header
- ID: LUC-5693
- Title: [Soar][API Key Tests][QA] Repair profile API-key e2e cleanup isolation residual
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Module Confidence Rows: Profile API Keys; API Exchange
- Requirement Rows: Exchange connection/configuration proof residual
- Quality Scenario Rows: DB-backed API test repeatability
- Risk Rows: API-key e2e cleanup isolation
- Iteration: 2026-06-28 TAE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-5693-PROFILE-API-KEY-E2E-CLEANUP-ISOLATION-REPAIR-2026-06-28
- Mission Status: VERIFIED

## Context
[LUC-5681](/LUC/issues/LUC-5681) verified the exchange connection/configuration
slice but left a profile API-key e2e cleanup residual around user-linked rows.
[LUC-5682](/LUC/issues/LUC-5682) later reproduced the same class as
`Log_userId_fkey`. [LUC-5693](/LUC/issues/LUC-5693) owns the test-harness
repair and repeatability proof.

## Goal
Make `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts` repeatably green
in both focused and aggregate security-boundary runs without changing product
behavior.

## Scope
- `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts`
- Local Postgres/Redis test services only
- No production smoke, deploy, push, protected credential readback, exchange
  mutation, order, position, or live-trading action

## Implementation Plan
1. Reproduce the focused API-key e2e file after local DB reset.
2. Compare cleanup coverage with adjacent DB-backed profile/backtests suites.
3. Harden the API-key e2e cleanup path for current user-owned dependents.
4. Verify focused and aggregate packs.
5. Update project state and issue with evidence.

## Acceptance Criteria
- Focused `apiKey.e2e.test.ts` passes as a whole file.
- Aggregate security-boundary pack including `apiKey.e2e.test.ts` passes.
- Cleanup covers current user-linked dependents before `user.deleteMany()`.
- No product/runtime/production mutation occurs.

## Definition Of Done
- `DEFINITION_OF_DONE.md` satisfied for this local test-harness slice:
  scoped change, validation evidence, source-of-truth update, and residual risk
  recorded.

## Result Report
- Task summary:
  replaced the inline API-key e2e cleanup list with `resetApiKeyE2eDatabase()`,
  adding FK-safe cleanup for `OrderFill`, wallet cashflow/snapshots/wallets,
  payment intents, user subscriptions, and subscription plans, plus bounded
  retry for transient dependent-row timing.
- Files changed:
  `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts`.
- Validation:
  `pnpm --filter api exec prisma migrate reset --force --skip-seed` PASS.
  `pnpm --filter api exec vitest run src/modules/profile/apiKey/apiKey.e2e.test.ts --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000` PASS, `1` file / `19` tests.
  `pnpm --filter api exec vitest run src/utils/crypto.test.ts src/utils/securityUtilities.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/orders/orders.liveCancelBoundary.service.test.ts src/modules/profile/apiKey/apiKey.e2e.test.ts` PASS, `6` files / `47` tests.
- Source-control:
  not committed in this heartbeat because the shared worktree was already mixed
  dirty with unrelated prior lane changes. Push/deploy not performed.
- Deployment impact:
  none. Test-harness-only change.
- Residual risk:
  none known for [LUC-5693](/LUC/issues/LUC-5693). Broader production/live
  exchange proof remains separately approval-gated.
