# V1 Post-V1 Wallet Bot Cleanup Hardening

## Header

- ID: V1-POST-V1-WALLET-BOT-CLEANUP-HARDENING-2026-05-14
- Title: Harden bot deletion cleanup and PAPER wallet reset active-bot guard
- Task Type: implementation
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder + QA/Test
- Depends on: existing Bots and Wallets runtime/data contracts
- Priority: P0
- Module Confidence Rows: `SOAR-BOTS-001`, `SOAR-WALLETS-001`
- Requirement Rows: `REQ-FUNC-001`, `REQ-FUNC-007`, `REQ-FUNC-025`
- Quality Scenario Rows: `QA-022`
- Risk Rows: `RISK-001`, `RISK-007`, `RISK-025`
- Iteration: 2026-05-14-post-v1-hardening
- Operation Mode: BUILDER
- Mission ID: POST-V1-RUNTIME-DATA-HARDENING
- Mission Status: VERIFIED

## Context

Bot deletion and PAPER wallet reset are sensitive data-safety paths. A bot can
own runtime sessions, positions, orders, trades, fills, signals, logs, and
runtime dedupe rows. A PAPER wallet reset must not run while an active bot still
uses the wallet even if there are no currently open positions or orders.

## Goal

Make bot deletion FK-safe for bot-owned runtime/trading artifacts and make PAPER
wallet reset fail closed while an active bot references the wallet.

## Scope

- `apps/api/src/modules/bots/botsCommand.service.ts`
- `apps/api/src/modules/bots/bots.e2e.test.ts`
- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/wallets/wallets.controller.ts`
- `apps/api/src/modules/wallets/wallets.errors.ts`
- `apps/api/src/modules/wallets/wallets.e2e.test.ts`
- project state and planning ledgers

## Constraints

- Do not mutate production data.
- Do not change LIVE order/cancel/close behavior.
- Do not broaden the V1 100 percent claim.
- Preserve existing ownership and fail-closed boundaries.

## Acceptance Criteria

- Deleting an inactive bot removes bot-owned runtime/trading artifacts without
  deleting the strategy.
- PAPER wallet reset returns `409` while an active bot uses the wallet.
- PAPER wallet reset still works after that bot is deactivated and there are no
  open wallet-scoped positions or orders.
- Focused Bots and Wallets API e2e tests pass.
- API typecheck passes.

## Result Report

Result: `verified`.

Changes:

- Bot deletion now deletes bot-owned positions, orders, trades, fills, signals,
  logs, runtime dedupe rows, runtime sessions, runtime events, runtime stats,
  market-group links, strategy links, assistant config, and subagent config in
  one transaction while preserving the linked strategy.
- PAPER wallet reset now checks for active bots using the wallet and fails with
  `WALLET_PAPER_RESET_ACTIVE_BOT`.

Validation:

- `pnpm --filter api run typecheck` PASS.
- `pnpm --filter api run test -- src/modules/bots/bots.delete-cleanup.e2e.test.ts --run`
  PASS (`1/1`).
- `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts --run`
  PASS (`26/26`).
- `pnpm --filter api exec vitest run src/modules/wallets/wallets.e2e.test.ts --run`
  PASS (`24/24`).
- Initial combined DB-heavy test attempts failed due shared cleanup
  interference; rerunning the same files sequentially passed.
- `pnpm run build` PASS.
- Pushed to `origin/main` at
  `1586f59261cef94d7c513d71bbfcfb697d11ca59`.
- Build-info wait PASS on attempt 22 for deployed
  `1586f59261cef94d7c513d71bbfcfb697d11ca59`.
- Public deploy smoke PASS for API `/health`, API `/ready`, and Web `/`.
