# Task

## Header
- ID: LUC-5681
- Title: [Soar][Exchange Proof][QA] Focused verification packet for exchange connection/configuration
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-5636](/LUC/issues/LUC-5636), [LUC-5622](/LUC/issues/LUC-5622)
- Priority: P1
- Module Confidence Rows: Profile API Keys; Exchange Adapter; Exchange Connections UI
- Requirement Rows: exchange connection/configuration proof slice
- Quality Scenario Rows: secret redaction, fail-closed unsupported exchange probes, local DB-backed API-key lifecycle
- Risk Rows: production exchange/live-trading mutation excluded
- Iteration: 2026-06-28 QVE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-5681-EXCHANGE-CONNECTION-CONFIGURATION-PROOF-SLICE-2026-06-28
- Mission Status: VERIFIED

## Context
[LUC-5681](/LUC/issues/LUC-5681) is the QA child lane for [LUC-5636](/LUC/issues/LUC-5636), created from the [LUC-5622](/LUC/issues/LUC-5622) app-completion known-state snapshot. The requested proof is a focused verification packet for exchange connection/configuration after backend/security evidence is available.

Relevant architecture/docs reviewed:
- `docs/modules/api-exchange.md`
- `docs/architecture/reference/exchange-access-ownership-matrix.md`
- `.agents/state/active-mission.md`
- `.agents/state/next-steps.md`
- `.codex/context/TASK_BOARD.md`

## Goal
Verify exchange connection/configuration confidence without protected input use, production mutation, exchange mutation, order placement, position changes, or live-trading action.

## Scope
- API profile API-key connection/configuration contracts:
  - `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts`
  - `apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts`
- Web profile/exchange connection surfaces:
  - `apps/web/src/features/profile/components/ApiKeyForm.test.tsx`
  - `apps/web/src/features/profile/components/ApiKeysList.test.tsx`
  - `apps/web/src/features/profile/services/apiKeys.service.test.ts`
  - `apps/web/src/features/exchanges/exchangeCapabilities.test.ts`
  - `apps/web/src/features/exchanges/components/ExchangeConnectionsView.test.tsx`
  - `apps/web/src/app/dashboard/profile/page.test.tsx`

## Constraints
- No push, deploy, restart, protected smoke, secret/account readback, production mutation, exchange mutation, order, position, or live-trading action.
- Use local DB-backed tests and mocked/stubbed exchange probes only.
- Do not edit runtime code from the QA lane.

## Definition of Done
- [x] Focused API exchange connection/configuration tests run and results recorded.
- [x] Focused Web exchange/API-key configuration tests run and results recorded.
- [x] Redaction, unsupported/placeholder fail-closed behavior, and configured/unconfigured states are mapped.
- [x] Residual risk and source-control disposition recorded.

## Validation Evidence
- API initial dirty-state run:
  `pnpm --filter api exec vitest run src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts src/modules/profile/apiKey/apiKey.e2e.test.ts --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000`
  - Result: FAIL on dirty local DB state, `10` failed / `16` passed.
  - Main blocker signature: `Log_userId_fkey` cleanup failure plus secondary auth/register noise.
- Local DB reset:
  `pnpm --filter api exec prisma migrate reset --force --skip-seed`
  - Result: PASS; local Postgres schema reset and migrations applied.
- API full rerun after reset:
  same API command
  - Result: PARTIAL PASS, `26` passed / `1` failed.
  - Remaining failure was `beforeEach` cleanup on `ApiKey_userId_fkey` before `forces sync flag on when manage-external is enabled`.
- API isolated cleanup-drift check:
  `pnpm --filter api exec prisma migrate reset --force --skip-seed *> $null; pnpm --filter api exec vitest run src/modules/profile/apiKey/apiKey.e2e.test.ts -t "forces sync flag on when manage-external is enabled" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000`
  - Result: PASS, `1` passed / `18` skipped.
- API focused pass packet:
  `pnpm --filter api exec prisma migrate reset --force --skip-seed *> $null; pnpm --filter api exec vitest run src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts src/modules/profile/apiKey/apiKey.e2e.test.ts -t "^(?!.*forces sync flag on when manage-external is enabled).*" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000`
  - Result: PASS, `2` files / `26` tests passed / `1` skipped.
- Web focused pass packet:
  `pnpm --filter web exec vitest run src/features/profile/components/ApiKeyForm.test.tsx src/features/profile/components/ApiKeysList.test.tsx src/features/profile/services/apiKeys.service.test.ts src/features/exchanges/exchangeCapabilities.test.ts src/features/exchanges/components/ExchangeConnectionsView.test.tsx src/app/dashboard/profile/page.test.tsx`
  - Result: PASS, `6` files / `23` tests.

## Coverage Map
- Configured exchange states:
  API proof covers Binance and Gate.io provided-key probe and stored encrypted credential probe; Web proof covers successful connection test, stored-credential test in edit mode, and `#api` profile entrypoint.
- Unconfigured/placeholder states:
  API proof covers placeholder exchange probe as `501 EXCHANGE_NOT_IMPLEMENTED`; Web proof covers placeholder save allowed without probe, disabled probe button, and unavailable capability status.
- Redaction:
  API proof covers encrypted-only persisted keys, masked list/readback, and audit metadata excluding raw key/secret values. Web proof covers service normalization dropping returned raw secrets and production error redaction for connection-test failures.
- Fail-closed behavior:
  API proof covers unauthenticated access rejection, missing auth for connection-test endpoint, ownership enforcement, invalid-key contract, missing futures permission contract, and placeholder probe not implemented contract.

## Architecture Evidence
- Architecture source reviewed:
  `docs/modules/api-exchange.md`; `docs/architecture/reference/exchange-access-ownership-matrix.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; no behavior or architecture changed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable; no runtime code or deployment mutation.

## Security / Privacy Evidence
- Data classification: API keys/secrets are sensitive.
- Trust boundaries: local mocked/stubbed API-key tests only; no protected credential readback and no real exchange calls.
- Permission or ownership checks: API e2e ownership checks passed in focused packet.
- Secret handling: no secret values printed or persisted in task evidence.
- Fail-closed behavior: verified for unauthenticated access, placeholder exchange probes, invalid credentials, missing futures permissions, and ownership violations.
- Residual risk: production/live exchange proof remains approval-gated and was not attempted.

## Result Report
- Task summary:
  [LUC-5681](/LUC/issues/LUC-5681) is verified locally for focused exchange connection/configuration confidence.
- Files changed:
  documentation/state/evidence only.
- How tested:
  API focused pass packet `26` passed / `1` skipped plus isolated skipped case PASS; Web focused packet `23/23` PASS.
- What is incomplete:
  full API file in one sequential run still has a cleanup-order residual around `ApiKey_userId_fkey`; production exchange/live proof remains out of scope and approval-gated.
- Next steps:
  no product follow-up is required from this QA proof slice. Test Automation or Backend can harden `apiKey.e2e.test.ts` cleanup ordering later if broader aggregate runs need this exact file green end-to-end.
- Decisions made:
  treated the full-file cleanup residual as a test-harness isolation issue because the affected product case passed alone and the rest of the focused API/Web proof packet passed.
