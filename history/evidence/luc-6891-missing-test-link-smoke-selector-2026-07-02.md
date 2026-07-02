# LUC-6891 Missing-Test-Link Smoke Selector Classification

- Issue: [LUC-6891](/LUC/issues/LUC-6891)
- Parent: [LUC-6886](/LUC/issues/LUC-6886)
- Date: 2026-07-02
- Lane: Test Automation
- Scope: local classification and selector recommendation only
- Production/protected action: none

## Source Snapshot

`docs/status/app-completion-index.md` reports `1042` generated `missing_test_link`
rows while recent architecture-awareness curation reports zero actionable
missing-test-link repair rows. This sweep treats the rows as selector/linkage
triage unless a sampled row lacks real local proof.

High-risk flow counts from the current generated index:

| Flow | Missing-test-link rows | Classification |
| --- | ---: | --- |
| Account access | 429 | Mostly scanner/linkage noise over auth routes/controllers, state docs, migrations, and runtime-auth-adjacent helper rows. |
| Exchange connection and configuration | 277 | Mostly scanner/linkage noise over exchange capability/API-key/config surfaces with existing API and Web proof packs. |
| Subscription and entitlement | 82 | Mostly scanner/linkage noise over profile subscription, entitlement service, admin subscription, and Stripe webhook surfaces. |
| Dashboard overview | 57 | Mostly browser-review/protected-proof gap, not missing local unit coverage. Existing local Web smoke covers route/chrome/runtime widgets. |
| Trading operation | 34 | Mostly high-risk runtime/protected-proof gap. Existing local API/Web proof covers pre-trade, runtime read/close, and manual-operation guardrails. |
| Admin operation | 25 | Mostly scanner/linkage noise over admin shell/subscription surfaces with existing Web/API tests. |

## Sample Classification

| Flow | Sampled rows | Existing proof found | TAE disposition |
| --- | --- | --- | --- |
| Account access | `apps/api/src/modules/auth/auth.routes.ts#/login`, `#/logout`, `#/me`, `#/register`; `apps/api/src/modules/auth/auth.controller.ts#login/logout/me/register`; `auth.types.ts` | `apps/api/src/modules/auth/auth.e2e.test.ts`; `apps/api/src/modules/auth/auth.cookie.test.ts`; `apps/api/src/modules/auth/auth.jwt.test.ts`; `apps/api/src/modules/auth/sessionToken.test.ts`; priority-test override rows already link auth routes to auth e2e proof. | No new tests. Use auth e2e plus auth helper tests as local selector. Controller/function rows should be link-curated by graph ownership if the board wants count reduction. |
| Exchange connection/configuration | exchange capability, API-key, authenticated-read, public metadata/catalog, Web exchange/API-key rows | `apps/api/src/modules/exchange/*service.test.ts`; `apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts`; `apps/web/src/features/profile/services/apiKeys.service.test.ts`; `apps/web/src/features/profile/components/ApiKeysList.test.tsx`; `apps/web/src/features/exchanges/exchangeCapabilities.test.ts`; `apps/web/src/features/exchanges/components/ExchangeConnectionsView.test.tsx` | No new tests. Use focused exchange/API-key selector before protected account gates. Protected exchange-side mutation remains out of scope. |
| Subscription/admin | subscription entitlement, profile subscription, admin subscription plans, Stripe webhook rows | `apps/api/src/modules/subscriptions/subscriptionEntitlements.service.test.ts`; `apps/api/src/modules/profile/subscription/subscription.e2e.test.ts`; `apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts`; `apps/api/src/modules/subscriptions/payments/stripeWebhook.e2e.test.ts`; `apps/web/src/features/profile/components/Subscription.test.tsx`; `apps/web/src/features/admin/layout/AdminLayoutShell.test.tsx`; `apps/web/src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx` | No new tests. Use profile/admin/subscription selector. Stripe and entitlement relation overrides already exist for webhook internals; remaining rows are graph/link noise unless a concrete uncovered behavior is named. |
| Dashboard overview | dashboard shell, runtime widgets/sidebar/onboarding/signals, route accessibility | `apps/web/src/app/dashboard/dashboard.a11y.smoke.test.tsx`; `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx`; `RuntimeSidebarSection.test.tsx`; `RuntimeSignalsSection.test.tsx`; `runtimeDerivations.test.ts`; `runtimeUiHelpers.test.ts`; `useCloseRuntimePositionAction.test.tsx` | No new tests. Use local dashboard runtime selector for V1 local smoke. Protected/browser journey proof remains separate and cannot be replaced by local tests. |
| Trading operation | pre-trade, bot runtime session read, runtime position close, order/fill/risk helpers, runtime UI close action | `apps/api/src/modules/engine/preTrade.e2e.test.ts`; `apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts`; `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`; `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`; `apps/api/src/modules/orders/positionFillMath.test.ts`; `apps/web/src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx`; `apps/web/src/features/bots/components/BotsManagement.test.tsx` | No new tests. Use trading-operation selector for local regression; protected LIVE exchange-side proof remains blocked by protected inputs/account gates. |

## Recommended Repeatable Selectors

Run the smallest selector that matches the changed or questioned flow. Escalate
to `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests` only when
multiple high-risk flows changed together.

| Flow | Selector command |
| --- | --- |
| Account access | `pnpm --filter api exec vitest run src/modules/auth/auth.e2e.test.ts src/modules/auth/auth.cookie.test.ts src/modules/auth/auth.jwt.test.ts src/modules/auth/sessionToken.test.ts --run` |
| Exchange connection/configuration | `pnpm --filter api exec vitest run src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeMarketCatalog.service.test.ts src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts --run` and `pnpm --filter web exec vitest run src/features/profile/services/apiKeys.service.test.ts src/features/profile/components/ApiKeysList.test.tsx src/features/exchanges/exchangeCapabilities.test.ts src/features/exchanges/components/ExchangeConnectionsView.test.tsx` |
| Subscription/admin | `pnpm --filter api exec vitest run src/modules/subscriptions/subscriptionEntitlements.service.test.ts src/modules/profile/subscription/subscription.e2e.test.ts src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts src/modules/subscriptions/payments/stripeWebhook.e2e.test.ts --run` and `pnpm --filter web exec vitest run src/features/profile/components/Subscription.test.tsx src/features/admin/layout/AdminLayoutShell.test.tsx src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx` |
| Dashboard overview | `pnpm --filter web exec vitest run src/app/dashboard/dashboard.a11y.smoke.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeUiHelpers.test.ts src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx` |
| Trading operation | `pnpm --filter api exec vitest run src/modules/engine/preTrade.e2e.test.ts src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/runtimeSessionPositionsRead.service.test.ts src/modules/orders/positionFillMath.test.ts --run` and `pnpm --filter web exec vitest run src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx src/features/bots/components/BotsManagement.test.tsx` |
| Existing packaged smoke | `pnpm run test:go-live:api`, `pnpm run test:go-live:web`, or `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests` |

## Residual Routing

- QVE owns protected/browser acceptance after [LUC-241](/LUC/issues/LUC-241)
  and the relevant protected input/account gates unblock.
- CBE owns any concrete uncovered backend behavior if a selector above fails.
- DSM/architecture graph ownership should handle count-reduction-only relation
  curation for generated rows that already have tests.
- TAE found no safe reason to add duplicate tests in this heartbeat.

