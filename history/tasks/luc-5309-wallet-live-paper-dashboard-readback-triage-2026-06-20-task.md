# Task

## Header
- ID: LUC-5309
- Title: Wallet LIVE/PAPER dashboard readback proof/repair triage
- Task Type: research
- Current Stage: verification
- Status: PARTIALLY_VERIFIED
- Owner: QA/Test
- Depends on: [LUC-5307](/LUC/issues/LUC-5307)
- Priority: P0
- Module Confidence Rows: Wallets, Dashboard Home, Exchange Adapter, Profile API Keys
- Requirement Rows: REQ-DOC-010, wallet/readback local proof rows
- Quality Scenario Rows: money-safety / dashboard runtime truth
- Risk Rows: RISK-002, RISK-007, RISK-016, RISK-032
- Iteration: 2026-06-20 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-5309-WALLET-LIVE-PAPER-DASHBOARD-READBACK-2026-06-20
- Mission Status: PARTIALLY_VERIFIED

## Context

[LUC-5307](/LUC/issues/LUC-5307) classified Wallets as locally verified but
missing fresh authenticated browser and approved LIVE/PAPER readback proof. This
task verifies the smallest safe local wallet/dashboard/exchange boundary and
routes exact repair when proof fails.

## Goal

Verify wallet list/detail/selected-wallet state, balance/readback source,
exchange adapter data boundary, and dashboard rendering without production
mutation or secret/account readback.

## Scope

- API wallet tests:
  - `apps/api/src/modules/wallets/wallets.e2e.test.ts`
  - `apps/api/src/modules/wallets/wallets.crud.e2e.test.ts`
- API exchange boundary tests:
  - `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`
  - `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`
  - `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`
  - `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.test.ts`
- Web wallet/dashboard tests:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx`
  - `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx`
  - `apps/web/src/features/wallets/components/WalletsListTable.test.tsx`
  - `apps/web/src/features/wallets/components/WalletPreviewPanel.test.tsx`
- Evidence and state only; no runtime code changes.

## Implementation Plan

1. Read active issue context and parent function report.
2. Review wallet/runtime safety contracts.
3. Run focused Web dashboard/wallet proof.
4. Run focused API wallet proof.
5. Separate product defect from test-harness/environment failure.
6. Record durable evidence and route exact follow-up if needed.

## Acceptance Criteria

- Wallet dashboard rendering proof has a clear pass/fail result.
- Wallet API readback proof has a clear pass/fail result.
- Any failure is classified with exact owner and reproduction command.
- No LIVE mutation, secret readback, deploy, push, or broad UI rewrite occurs.

## Definition of Done

- [x] Evidence file published.
- [x] State files updated.
- [x] Paperclip follow-up routed for remaining repair.
- [x] Current issue has a final disposition.

## Forbidden

- Production deploy/restart/env edit.
- Secret/cookie/token/account data capture.
- Unapproved LIVE exchange mutation.
- Payment/subscription mutation.
- Broad UI rewrite.

## Validation Evidence

- Web wallet/dashboard focused proof: PASS (`4` files / `10` tests).
- API exchange boundary focused proof: PASS (`4` files / `19` tests).
- API wallet focused proof with default env: FAIL (`9` failures).
- API wallet e2e with explicit `NODE_ENV=test`: PASS for
  `wallets.e2e.test.ts` (`24/24`).
- API wallet CRUD isolated with explicit `NODE_ENV=test`: PASS (`12/12`).
- Combined API wallet e2e with explicit `NODE_ENV=test`: FAIL (`35/36`) due
  shared-DB interference.
- High-risk checks: no live trading, exchange mutation, production account use,
  secret readback, deploy, push, restart, or raw account artifact.
- Reality status: `partially verified`.

## Architecture Evidence

- Architecture source reviewed:
  `docs/modules/api-wallets.md`,
  `docs/architecture/reference/live-paper-runtime-safety-contract.md`,
  `docs/graphs/function-journey-index.json`.
- Fits approved architecture: yes.
- Mismatch discovered: no product architecture mismatch.
- Decision required from user: no.
- Follow-up architecture doc updates: not required.

## Result Report

- Task summary: Wallet/dashboard local proof is partially verified. Web
  dashboard wallet rendering and exchange capability/read unit contracts pass.
  API wallet product contracts pass under explicit test env and isolated DB
  runs. The default API wallet command is not trustworthy because it can bypass
  the test-only balance stub and the combined DB-e2e run can cross-delete rows.
- Files changed: evidence/task/state files only.
- How tested: focused commands listed in
  `history/evidence/luc-5309-wallet-live-paper-dashboard-readback-triage-2026-06-20.md`.
- What is incomplete: deterministic wallet API test command and fresh protected
  production browser/readback proof.
- Next steps: [LUC-5316](/LUC/issues/LUC-5316) owns backend/test-harness repair.
- Decisions made: no product repair was made from QA; route exact harness repair
  instead.
