# App Completion Index

Generated: 2026-07-14T17:00:30.520Z
Project: Soar
Root: C:/Personal/Projekty/Aplikacje/Soar
Source graph: docs/graphs/architecture-awareness.json

## Purpose

This index turns architecture-awareness entities into user-facing completion lanes.
Agents use it to decide what to plan next: backend/API proof, frontend/browser proof, auth/subscription/configuration gates, exchange integration proof, or cleanup.
Internal functions and modules are implementation details: they receive proof through their owning product boundary and are not dispatched as one issue per symbol.

## Counts

- Items: 706
- User flows: 8
- Needs browser/screenshot review: 452
- Missing test link: 103
- Missing doc link: 52
- Implemented, needs proof: 90
- Blocked: 0
- Known non-ok risk items: 697
- Priority review items indexed: 200/697
- Priority review truncated: true

## Flow Summary

- Unclassified user workflow: 273 entities; risks {"missing_test_link":23,"missing_doc_link":23,"implemented_needs_proof":78,"ok":2,"needs_browser_review":147}; gates {"auth":2}
- Trading operation: 167 entities; risks {"missing_doc_link":8,"missing_test_link":12,"implemented_needs_proof":7,"needs_browser_review":140}; gates {"configuration":5}
- Dashboard overview: 110 entities; risks {"missing_test_link":46,"missing_doc_link":12,"implemented_needs_proof":1,"needs_browser_review":51}; gates {"configuration":2}
- Account access: 47 entities; risks {"ok":7,"missing_doc_link":4,"missing_test_link":4,"implemented_needs_proof":1,"needs_browser_review":31}; gates {"auth":47,"configuration":2}
- User configuration: 34 entities; risks {"missing_test_link":5,"missing_doc_link":4,"implemented_needs_proof":1,"needs_browser_review":24}; gates {"configuration":18,"auth":1}
- Exchange connection and configuration: 33 entities; risks {"missing_doc_link":1,"implemented_needs_proof":2,"needs_browser_review":30}; gates {"configuration":30,"gateio":2,"binance":3,"auth":1}
- Subscription and entitlement: 25 entities; risks {"missing_test_link":5,"needs_browser_review":20}; gates {"subscription":25}
- Admin operation: 17 entities; risks {"missing_test_link":8,"needs_browser_review":9}; gates {"auth":7}

## Priority Review Queue

| User flow | Risk | Kind | Entity | Owner | Path | Gates |
| --- | --- | --- | --- | --- | --- | --- |
| Account access | missing_doc_link | feature_or_capability | useHydrationReady.ts | Frontend Web Engineer | apps/web/src/features/auth/hooks/useHydrationReady.ts | auth |
| Account access | missing_doc_link | feature_or_capability | useLoginForm.ts | Engineering Delivery Lead | apps/web/src/features/auth/hooks/useLoginForm.ts | auth |
| Account access | missing_doc_link | feature_or_capability | useRegisterForm.ts | Engineering Delivery Lead | apps/web/src/features/auth/hooks/useRegisterForm.ts | auth |
| Account access | missing_doc_link | feature_or_capability | auth.service.ts | Engineering Delivery Lead | apps/web/src/features/auth/services/auth.service.ts | auth |
| Account access | missing_test_link | feature_or_capability | auth.de-CH.ts | Engineering Delivery Lead | apps/web/src/i18n/namespaces/auth.de-CH.ts | auth |
| Account access | missing_test_link | feature_or_capability | auth.en.ts | Engineering Delivery Lead | apps/web/src/i18n/namespaces/auth.en.ts | auth |
| Account access | missing_test_link | feature_or_capability | auth.pl.ts | Engineering Delivery Lead | apps/web/src/i18n/namespaces/auth.pl.ts | auth |
| Account access | missing_test_link | feature_or_capability | auth.pt.ts | Engineering Delivery Lead | apps/web/src/i18n/namespaces/auth.pt.ts | auth |
| Account access | implemented_needs_proof | feature_or_capability | runProdAuthSessionBrowserProof.mjs | Engineering Delivery Lead | scripts/runProdAuthSessionBrowserProof.mjs | auth |
| Account access | needs_browser_review | screen_or_route | requireAuth.ts | Engineering Delivery Lead | apps/api/src/middleware/requireAuth.ts | auth |
| Account access | needs_browser_review | screen_or_route | auth.controller.ts | Engineering Delivery Lead | apps/api/src/modules/auth/auth.controller.ts | auth |
| Account access | needs_browser_review | screen_or_route | auth.cookie.ts | Engineering Delivery Lead | apps/api/src/modules/auth/auth.cookie.ts | auth |
| Account access | needs_browser_review | screen_or_route | auth.errors.ts | Engineering Delivery Lead | apps/api/src/modules/auth/auth.errors.ts | auth |
| Account access | needs_browser_review | screen_or_route | auth.jwt.ts | Engineering Delivery Lead | apps/api/src/modules/auth/auth.jwt.ts | auth |
| Account access | needs_browser_review | screen_or_route | auth.routes.ts | Engineering Delivery Lead | apps/api/src/modules/auth/auth.routes.ts | auth |
| Account access | needs_browser_review | screen_or_route | auth.service.ts | Engineering Delivery Lead | apps/api/src/modules/auth/auth.service.ts | auth |
| Account access | needs_browser_review | screen_or_route | auth.session.ts | Engineering Delivery Lead | apps/api/src/modules/auth/auth.session.ts | auth |
| Account access | needs_browser_review | screen_or_route | sessionToken.ts | Engineering Delivery Lead | apps/api/src/modules/auth/sessionToken.ts | auth |
| Account access | needs_browser_review | screen_or_route | runtimeSessionOpenOrdersReadModel.service.ts | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts | auth |
| Account access | needs_browser_review | screen_or_route | runtimeSessionPositionCommand.service.ts | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts | auth |
| Account access | needs_browser_review | screen_or_route | runtimeSessionPositionDcaCount.ts | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionDcaCount.ts | auth |
| Account access | needs_browser_review | screen_or_route | runtimeSessionPositionsRead.repository.ts | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts | auth |
| Account access | needs_browser_review | screen_or_route | runtimeSessionPositionsRead.service.ts | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts | auth |
| Account access | needs_browser_review | screen_or_route | runtimeSessionPositionWindow.ts | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionWindow.ts | auth |
| Account access | needs_browser_review | screen_or_route | runtimeSessionRead.service.ts | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionRead.service.ts | auth |
| Account access | needs_browser_review | screen_or_route | runtimeSessionsRead.service.ts | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionsRead.service.ts | auth |
| Account access | needs_browser_review | screen_or_route | runtimeSessionSymbolStatsRead.service.ts | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts | auth |
| Account access | needs_browser_review | screen_or_route | runtimeSessionTradeFallbackScope.ts | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradeFallbackScope.ts | auth |
| Account access | needs_browser_review | screen_or_route | runtimeSessionTradesRead.repository.ts | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts | auth |
| Account access | needs_browser_review | screen_or_route | runtimeSessionTradesRead.service.ts | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts | auth |
| Account access | needs_browser_review | screen_or_route | exchangeAuthenticatedRead.service.ts | Engineering Delivery Lead | apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.ts | auth, configuration |
| Account access | needs_browser_review | screen_or_route | exchangeAuthenticatedReadContract.service.ts | Engineering Delivery Lead | apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts | auth, configuration |
| Account access | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/(public)/auth/login/page.tsx | auth |
| Account access | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/(public)/auth/register/page.tsx | auth |
| Account access | needs_browser_review | screen_or_route | AuthContext.tsx | Engineering Delivery Lead | apps/web/src/context/AuthContext.tsx | auth |
| Account access | needs_browser_review | screen_or_route | LoginForm.tsx | Engineering Delivery Lead | apps/web/src/features/auth/components/LoginForm.tsx | auth |
| Account access | needs_browser_review | screen_or_route | PasswordVisibilityToggle.tsx | Engineering Delivery Lead | apps/web/src/features/auth/components/PasswordVisibilityToggle.tsx | auth |
| Account access | needs_browser_review | screen_or_route | RegisterForm.tsx | Engineering Delivery Lead | apps/web/src/features/auth/components/RegisterForm.tsx | auth |
| Account access | needs_browser_review | screen_or_route | LoginPage.tsx | Engineering Delivery Lead | apps/web/src/features/auth/pages/LoginPage.tsx | auth |
| Account access | needs_browser_review | screen_or_route | RegisterPage.tsx | Engineering Delivery Lead | apps/web/src/features/auth/pages/RegisterPage.tsx | auth |
| Admin operation | missing_test_link | api_endpoint | GET / | Engineering Delivery Lead | apps/api/src/router/admin.routes.ts#/ | - |
| Admin operation | missing_test_link | api_endpoint | USE /users | Engineering Delivery Lead | apps/api/src/router/admin.routes.ts#/users | auth |
| Admin operation | missing_test_link | api_endpoint | USE /admin | Engineering Delivery Lead | apps/api/src/router/index.ts#/admin | - |
| Admin operation | missing_test_link | feature_or_capability | adminUsers.service.ts | Engineering Delivery Lead | apps/web/src/features/admin/users/services/adminUsers.service.ts | auth |
| Admin operation | missing_test_link | feature_or_capability | admin.de-CH.ts | Engineering Delivery Lead | apps/web/src/i18n/namespaces/admin.de-CH.ts | - |
| Admin operation | missing_test_link | feature_or_capability | admin.en.ts | Engineering Delivery Lead | apps/web/src/i18n/namespaces/admin.en.ts | - |
| Admin operation | missing_test_link | feature_or_capability | admin.pl.ts | Engineering Delivery Lead | apps/web/src/i18n/namespaces/admin.pl.ts | - |
| Admin operation | missing_test_link | feature_or_capability | admin.pt.ts | Engineering Delivery Lead | apps/web/src/i18n/namespaces/admin.pt.ts | - |
| Admin operation | needs_browser_review | screen_or_route | users.controller.ts | Engineering Delivery Lead | apps/api/src/modules/admin/users/users.controller.ts | auth |
| Admin operation | needs_browser_review | screen_or_route | users.routes.ts | Engineering Delivery Lead | apps/api/src/modules/admin/users/users.routes.ts | auth |
| Admin operation | needs_browser_review | screen_or_route | users.service.ts | Engineering Delivery Lead | apps/api/src/modules/admin/users/users.service.ts | auth |
| Admin operation | needs_browser_review | screen_or_route | admin.routes.ts | Engineering Delivery Lead | apps/api/src/router/admin.routes.ts | - |
| Admin operation | needs_browser_review | screen_or_route | layout.tsx | Engineering Delivery Lead | apps/web/src/app/admin/layout.tsx | - |
| Admin operation | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/admin/page.tsx | - |
| Admin operation | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/admin/users/page.tsx | auth |
| Admin operation | needs_browser_review | screen_or_route | AdminLayoutShell.tsx | Engineering Delivery Lead | apps/web/src/features/admin/layout/AdminLayoutShell.tsx | - |
| Admin operation | needs_browser_review | screen_or_route | AdminUsersPage.tsx | Engineering Delivery Lead | apps/web/src/features/admin/users/pages/AdminUsersPage.tsx | auth |
| Dashboard overview | missing_test_link | api_endpoint | GET / | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/ | - |
| Dashboard overview | missing_doc_link | api_endpoint | USE /backtests | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/backtests | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /bots | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/bots | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /icons | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/icons | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /logs | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/logs | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /market-stream | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/market-stream | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /markets | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/markets | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /orders | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/orders | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /positions | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/positions | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /profile/apiKeys | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/profile/apiKeys | configuration |
| Dashboard overview | missing_test_link | api_endpoint | USE /profile/basic | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/profile/basic | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /profile/security | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/profile/security | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /reports | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/reports | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /strategies | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/strategies | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /wallets | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/wallets | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /dashboard | Engineering Delivery Lead | apps/api/src/router/index.ts#/dashboard | - |
| Dashboard overview | missing_test_link | feature_or_capability | formatters.ts | Engineering Delivery Lead | apps/web/src/features/dashboard-home/components/home-live-widgets/formatters.ts | - |
| Dashboard overview | missing_doc_link | feature_or_capability | runtimeDerivations.ts | Engineering Delivery Lead | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.ts | - |
| Dashboard overview | missing_test_link | feature_or_capability | runtimeSidebarPresenters.ts | Engineering Delivery Lead | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSidebarPresenters.ts | - |
| Dashboard overview | missing_doc_link | feature_or_capability | runtimeSignalConditionState.ts | Engineering Delivery Lead | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.ts | - |
| Dashboard overview | missing_doc_link | feature_or_capability | runtimeTradeMeta.ts | Engineering Delivery Lead | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeTradeMeta.ts | - |
| Dashboard overview | missing_doc_link | feature_or_capability | HomeLiveWidgets.test-helpers.ts | Engineering Delivery Lead | apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test-helpers.ts | - |
| Dashboard overview | missing_doc_link | feature_or_capability | useCloseRuntimePositionAction.ts | Engineering Delivery Lead | apps/web/src/features/dashboard-home/hooks/useCloseRuntimePositionAction.ts | - |

## Agent Rule

A user-facing feature is not complete until the backend/API state, frontend route/component state, configuration/auth/subscription gates, tests, docs, and browser screenshot/clickthrough evidence are either verified or explicitly blocked with an owner/action.
