# LUC-2057 Local Protected Wallet Route Action Proof Task

## Context

- Issue: [LUC-2057](/LUC/issues/LUC-2057)
- Parent: [LUC-2053](/LUC/issues/LUC-2053)
- Role: Test Automation Engineer
- Stage: verification
- Source rows:
  - `SOAR-ACTION-VISIT-PAGE-WALLETS-ROOT`
  - `SOAR-ACTION-VISIT-PAGE-WALLETS-LIST`
  - `SOAR-ACTION-VISIT-PAGE-WALLET-CREATE`
- Source index:
  - `docs/status/user-action-index.md`
  - `docs/architecture/indices/user-action-index.csv`

## Goal

Build a repeatable local-only browser proof harness for one protected action
cluster that does not require live exchange mutation or production account
access.

## Scope

- Added `scripts/runLocalProtectedRouteActionProof.mjs`.
- Added package script `qa:local-protected-route-actions:proof`.
- Generated:
  - `history/evidence/luc-2057-local-protected-wallet-route-action-proof-2026-06-05.md`
  - `history/artifacts/luc-2057-local-protected-wallet-route-action-proof-2026-06-05.json`
- Updated source-of-truth state:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/system-health.md`

## Implementation Plan

1. Read the user-action index and select a safe local-only protected cluster.
2. Add a CDP/browser harness that starts a temporary local Next server.
3. Use a synthetic local cookie to exercise the Web middleware gate without
   using real credentials.
4. Verify unauthenticated fail-closed routing and protected wallet route/action
   navigation.
5. Write JSON and Markdown proof artifacts.
6. Stop browser and local server processes before closure.

## Acceptance Criteria

- At least one `verified_local_only` protected action cluster gains repeatable
  browser proof or a precise blocker.
- The proof references action IDs, routes, API routes, tests, and docs.
- The proof is fixture-contained and does not touch production accounts,
  exchange APIs, or live trading.
- The command can be rerun by another agent.

## Definition Of Done

- `node --check scripts/runLocalProtectedRouteActionProof.mjs` passes.
- `pnpm run qa:local-protected-route-actions:proof -- --today 2026-06-05`
  passes.
- Evidence artifacts are present.
- Source-of-truth files are updated.
- No local server or browser process started by the task remains running.

## Result Report

- Status: verified.
- Command: `pnpm run qa:local-protected-route-actions:proof -- --today 2026-06-05`.
- Result: PASS.
- Covered routes:
  - unauthenticated `/dashboard/wallets/list` -> `/auth/login`
  - `/dashboard/wallets` -> `/dashboard/wallets/list`
  - `/dashboard/wallets/list`
  - `/dashboard/wallets/create`
  - list-page create/add action -> `/dashboard/wallets/create`
- API references:
  - `GET /dashboard/wallets`
  - `POST /dashboard/wallets`
  - `GET /dashboard/wallets/metadata`
  - `GET /dashboard/wallets/:id`
  - `PUT /dashboard/wallets/:id`
  - `DELETE /dashboard/wallets/:id`
  - `POST /dashboard/wallets/:id/reset-paper`
- Test references:
  - `apps/web/src/features/wallets/components/WalletsListTable.test.tsx`
  - `apps/web/src/features/wallets/components/WalletCreateEditForm.test.tsx`
  - `apps/api/src/modules/wallets/wallets.e2e.test.ts`
  - `apps/api/src/modules/wallets/wallets.crud.e2e.test.ts`
- Docs:
  - `docs/modules/web-wallets.md`
  - `docs/modules/api-wallets.md`
- Cleanup evidence:
  - no remaining listener on port `3217`;
  - no harness browser process on `9347`.

## Forbidden

- Do not submit wallet create/update/delete/reset forms in this harness.
- Do not use production accounts, cookies, tokens, or screenshots.
- Do not call exchange APIs.
- Do not deploy, restart, rollback, edit environment values, mutate databases,
  or perform live-trading actions.

## Residual Risk

- This is local Web route/action proof only. Production protected proof remains
  gated by [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
