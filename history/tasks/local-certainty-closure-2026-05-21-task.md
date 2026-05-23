# Task: LOCAL-CERTAINTY-CLOSURE-2026-05-21

## Context

The user asked to do everything possible, with agents, to gain confidence that
the remaining application implementation works correctly after the earlier
runtime, frontend, and safety sweeps.

## Goal

Close the locally executable residual implementation gaps, repair confirmed
defects, and run broad validation without performing production mutations,
LIVE exchange-side mutations, or protected-secret operations.

## Constraints

- Repository communication artifacts remain in English.
- User-facing chat remains Polish.
- No LIVE order, cancel, close, or exchange-side mutation.
- No production data mutation and no raw secret capture.
- Preserve unrelated dirty worktree changes.
- Treat protected production `AUD-19` as blocked unless approved protected
  inputs are available.

## Definition of Done

- Agent lanes cover separable frontend, admin/wallet, and reports/data risks.
- Confirmed local defects are fixed or explicitly deferred with evidence.
- Focused and broad API/Web validation pass.
- Schema and migration state validate locally.
- Source-of-truth docs/state are updated.
- Local validation processes and Docker services are cleaned up.

## Forbidden

- Claim literal production 100% readiness without protected `AUD-19`.
- Substitute public smoke/build-info for protected release proof.
- Add temporary bypasses or hidden risk acknowledgements.
- Leave local Docker/dev/browser validation processes running.

## Result Report

Status: `VERIFIED_LOCALLY_WITH_PROTECTED_PROD_BLOCKER`

Implemented:

- Added immutable `Trade.executionMode` snapshot with migration backfill from
  current bot mode for legacy rows.
- Updated runtime, runtime DCA automation, live exchange-event, and imported
  position trade writers to persist execution mode for new trade rows.
- Updated Reports cross-mode aggregation to prefer `Trade.executionMode`, with
  `Bot.mode` fallback only for legacy rows.
- Localized bot preview/assistant route breadcrumbs through `useI18n` instead
  of importing EN namespaces directly.
- Improved Profile Basic form mobile layout constraints.
- Replaced Admin Subscriptions raw loading/error alerts with shared view-state
  components.
- Replaced Wallet PAPER reset native `window.confirm` with shared async
  confirmation modal.
- Updated Dashboard Home tests to account for the explicit runtime confirmation
  gate before LIVE manual order and close-position actions.

Agent lanes:

- Frontend polish lane fixed bot preview/assistant i18n drift and Profile
  mobile layout.
- Admin/Wallet polish lane fixed Admin Subscriptions view states and Wallet
  reset confirmation consistency.
- Reports/data lane confirmed the mutable `bot.mode` reporting risk and
  converged with the coordinator on the `Trade.executionMode` snapshot fix.

Validation evidence:

- `corepack pnpm --dir apps/api exec prisma generate` PASS.
- `corepack pnpm --dir apps/api exec prisma migrate reset --force --skip-seed`
  PASS.
- `corepack pnpm --dir apps/api exec prisma validate` PASS.
- `corepack pnpm --dir apps/api exec prisma migrate status` PASS with local
  Postgres temporarily running.
- `corepack pnpm --filter api exec vitest run src/modules/reports/reports.e2e.test.ts src/modules/reports/reports.service.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --testTimeout=30000`
  PASS (`2` files / `5` tests).
- `corepack pnpm --filter api run typecheck` PASS.
- `corepack pnpm --filter web exec vitest run "src/app/dashboard/bots/[id]/preview/page.test.tsx" "src/app/dashboard/bots/[id]/assistant/page.test.tsx" src/features/profile/components/BasicForm.test.tsx src/i18n/guardrails.test.ts src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx --run`
  PASS (`6` files / `22` tests).
- `corepack pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --run`
  PASS (`2` files / `31` tests).
- `corepack pnpm --filter web run typecheck` PASS.
- `corepack pnpm run quality:guardrails` PASS.
- `corepack pnpm run docs:parity:check` PASS.
- `corepack pnpm i18n:audit:route-reachable:web` PASS (`0` findings).
- `corepack pnpm run lint` PASS.
- `corepack pnpm run build` PASS.
- `corepack pnpm --filter web exec vitest run --run` PASS (`149` files /
  `522` tests).
- `corepack pnpm --filter api exec vitest run --pool=forks --maxWorkers=1 --minWorkers=1 --testTimeout=30000`
  PASS.
- `corepack pnpm run test:go-live:smoke` PASS (`45` API tests, `18` Web
  tests).
- `git diff --check` PASS.

Residual risk:

- Protected production `AUD-19` remains blocked until approved protected input
  families and same-date production evidence are available.
- No real LIVE exchange-side mutation proof was executed in this local mission.
- Native mobile remains scaffold-only by documented scope.
- Assistant/AI hot-path runtime trading orchestration remains deferred until a
  separate fail-closed implementation and AI red-team proof exist.
