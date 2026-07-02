# V1 Go-Live Smoke Pack (Live-Safe)

## Purpose
Run a focused pre-release smoke suite for the most critical V1 paths.

## Prerequisites
- Docker services running (`postgres`, `redis`).
- Project dependencies installed (`pnpm install`).
- Server/client env files configured.

## Commands
- Infra (Docker) up/down:
  - `pnpm go-live:infra:up`
  - `pnpm go-live:infra:down`
- Full smoke pack:
  - `pnpm test:go-live:smoke`
  - Auto flow: infra up -> `prisma migrate deploy` -> server smoke -> client smoke -> infra down
- Server smoke only:
  - `pnpm test:go-live:server`
  - `pnpm test:go-live:server:with-infra`
  - Auto flow: infra up -> `prisma migrate deploy` -> server smoke -> infra down
- Client smoke only:
  - `pnpm test:go-live:client`

## Included Coverage

### Server (`test:go-live:server`)
- `auth.e2e.test.ts` (core auth/session flow)
- `strategies.e2e.test.ts` (strategy CRUD + import/export contract)
- `backtests.e2e.test.ts` (backtest run/report critical path)
- `preTrade.e2e.test.ts` (paper/live guardrails and risk gate)

### Client (`test:go-live:client`)
- Bots management LIVE confirmation behavior
- Logs decision-trace explorer behavior
- Dashboard header navigation accessibility smoke

## High-Risk Missing-Test-Link Selectors

Use these selectors when `docs/status/app-completion-index.md` reports
`missing_test_link` rows for V1 high-risk flows. These selectors distinguish
real local proof gaps from generated graph/linkage noise before protected
production gates. They do not replace protected browser, account, exchange, or
LIVE mutation proof.

| Flow | Smallest local selector |
| --- | --- |
| Account access | `pnpm --filter api exec vitest run src/modules/auth/auth.e2e.test.ts src/modules/auth/auth.cookie.test.ts src/modules/auth/auth.jwt.test.ts src/modules/auth/sessionToken.test.ts --run` |
| Exchange connection/configuration | `pnpm --filter api exec vitest run src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeMarketCatalog.service.test.ts src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts --run` plus `pnpm --filter web exec vitest run src/features/profile/services/apiKeys.service.test.ts src/features/profile/components/ApiKeysList.test.tsx src/features/exchanges/exchangeCapabilities.test.ts src/features/exchanges/components/ExchangeConnectionsView.test.tsx` |
| Subscription/admin | `pnpm --filter api exec vitest run src/modules/subscriptions/subscriptionEntitlements.service.test.ts src/modules/profile/subscription/subscription.e2e.test.ts src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts src/modules/subscriptions/payments/stripeWebhook.e2e.test.ts --run` plus `pnpm --filter web exec vitest run src/features/profile/components/Subscription.test.tsx src/features/admin/layout/AdminLayoutShell.test.tsx src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx` |
| Dashboard overview | `pnpm --filter web exec vitest run src/app/dashboard/dashboard.a11y.smoke.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeUiHelpers.test.ts src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx` |
| Trading operation | `pnpm --filter api exec vitest run src/modules/engine/preTrade.e2e.test.ts src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/runtimeSessionPositionsRead.service.test.ts src/modules/orders/positionFillMath.test.ts --run` plus `pnpm --filter web exec vitest run src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx src/features/bots/components/BotsManagement.test.tsx` |
| Existing packaged smoke | `pnpm run test:go-live:api`, `pnpm run test:go-live:web`, or `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests` |

## Release Gate Rule
- RC cannot be promoted if this smoke pack is red.
- P0/P1 defects found during this pack must be resolved and retested.
