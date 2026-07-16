# App Completion Index

Generated: 2026-07-16T16:13:15.482Z
Project: Soar
Root: C:/Personal/Projekty/Aplikacje/Soar
Source graph: docs/graphs/architecture-awareness.json

## Purpose

This index turns architecture-awareness entities into user-facing completion lanes.
Agents use it to decide what to plan next: backend/API proof, frontend/browser proof, auth/subscription/configuration gates, exchange integration proof, or cleanup.
Internal functions and modules are implementation details: they receive proof through their owning product boundary and are not dispatched as one issue per symbol.

## Counts

- Items: 86
- User flows: 7
- Needs browser/screenshot review: 41
- Missing test link: 21
- Missing doc link: 3
- Implemented, needs proof: 0
- Blocked: 0
- Known non-ok risk items: 65
- Priority review items indexed: 65/65
- Priority review truncated: false

## Flow Summary

- Dashboard overview: 41 entities; risks {"ok":2,"missing_test_link":9,"needs_browser_review":30}; gates {"configuration":1}
- Account access: 19 entities; risks {"ok":18,"missing_doc_link":1}; gates {"auth":19,"subscription":3,"configuration":1}
- Unclassified user workflow: 18 entities; risks {"missing_test_link":9,"missing_doc_link":2,"needs_browser_review":7}; gates {}
- Subscription and entitlement: 5 entities; risks {"missing_test_link":3,"needs_browser_review":2}; gates {"subscription":5}
- Admin operation: 1 entities; risks {"ok":1}; gates {}
- Exchange connection and configuration: 1 entities; risks {"needs_browser_review":1}; gates {"configuration":1}
- User configuration: 1 entities; risks {"needs_browser_review":1}; gates {}

## Priority Review Queue

| User flow | Risk | Kind | Entity | Owner | Path | Gates |
| --- | --- | --- | --- | --- | --- | --- |
| Account access | missing_doc_link | api_endpoint | USE /markets | Test Automation Engineer | apps/api/src/router/dashboard.routes.ts#/markets | auth |
| Dashboard overview | missing_test_link | api_endpoint | USE /orders | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/orders | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /positions | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/positions | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /profile/apiKeys | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/profile/apiKeys | configuration |
| Dashboard overview | missing_test_link | api_endpoint | USE /profile/basic | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/profile/basic | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /profile/security | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/profile/security | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /reports | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/reports | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /strategies | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/strategies | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /wallets | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/wallets | - |
| Dashboard overview | missing_test_link | api_endpoint | USE /dashboard | Engineering Delivery Lead | apps/api/src/router/index.ts#/dashboard | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/backtests/[id]/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/backtests/create/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/backtests/list/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/bots/[id]/assistant/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/bots/[id]/edit/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/bots/[id]/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/bots/[id]/preview/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/bots/[id]/runtime/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/bots/assistant/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/bots/create/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/bots/new/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/bots/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/bots/runtime/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/logs/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/markets/[id]/edit/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/markets/create/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/markets/list/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/profile/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/reports/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/strategies/[id]/edit/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/strategies/[id]/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/strategies/create/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/strategies/list/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/wallets/[id]/edit/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/wallets/[id]/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/wallets/[id]/preview/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/wallets/create/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/wallets/list/page.tsx | - |
| Dashboard overview | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/dashboard/wallets/page.tsx | - |
| Exchange connection and configuration | needs_browser_review | screen_or_route | ExchangeConnectionsView.tsx | Engineering Delivery Lead | apps/web/src/features/exchanges/components/ExchangeConnectionsView.tsx | configuration |
| Subscription and entitlement | missing_test_link | api_endpoint | USE /webhooks/stripe | Engineering Delivery Lead | apps/api/src/index.ts#/webhooks/stripe | subscription |
| Subscription and entitlement | missing_test_link | api_endpoint | USE /subscriptions/plans | Engineering Delivery Lead | apps/api/src/router/admin.routes.ts#/subscriptions/plans | subscription |
| Subscription and entitlement | missing_test_link | api_endpoint | USE /profile/subscription | Engineering Delivery Lead | apps/api/src/router/dashboard.routes.ts#/profile/subscription | subscription |
| Subscription and entitlement | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/admin/subscriptions/page.tsx | subscription |
| Subscription and entitlement | needs_browser_review | screen_or_route | AdminSubscriptionsPage.tsx | Engineering Delivery Lead | apps/web/src/features/admin/subscriptions/pages/AdminSubscriptionsPage.tsx | subscription |
| Unclassified user workflow | missing_test_link | api_endpoint | USE /avatars | Engineering Delivery Lead | apps/api/src/index.ts#/avatars | - |
| Unclassified user workflow | missing_test_link | api_endpoint | GET / | Engineering Delivery Lead | apps/api/src/router/index.ts#/ | - |
| Unclassified user workflow | missing_doc_link | api_endpoint | GET /alerts | Engineering Delivery Lead | apps/api/src/router/index.ts#/alerts | - |
| Unclassified user workflow | missing_test_link | api_endpoint | GET /health | Engineering Delivery Lead | apps/api/src/router/index.ts#/health | - |
| Unclassified user workflow | missing_doc_link | api_endpoint | GET /metrics | Engineering Delivery Lead | apps/api/src/router/index.ts#/metrics | - |
| Unclassified user workflow | missing_test_link | api_endpoint | GET /ready | Engineering Delivery Lead | apps/api/src/router/index.ts#/ready | - |
| Unclassified user workflow | missing_test_link | api_endpoint | GET /ready/details | Engineering Delivery Lead | apps/api/src/router/index.ts#/ready/details | - |
| Unclassified user workflow | missing_test_link | api_endpoint | USE /upload | Engineering Delivery Lead | apps/api/src/router/index.ts#/upload | - |
| Unclassified user workflow | missing_test_link | api_endpoint | GET /workers/health | Engineering Delivery Lead | apps/api/src/router/index.ts#/workers/health | - |
| Unclassified user workflow | missing_test_link | api_endpoint | GET /workers/ready | Engineering Delivery Lead | apps/api/src/router/index.ts#/workers/ready | - |
| Unclassified user workflow | missing_test_link | api_endpoint | GET /workers/runtime-freshness | Engineering Delivery Lead | apps/api/src/router/index.ts#/workers/runtime-freshness | - |
| Unclassified user workflow | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/(public)/page.tsx | - |
| Unclassified user workflow | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/(public)/privacy/page.tsx | - |
| Unclassified user workflow | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/(public)/terms/page.tsx | - |
| Unclassified user workflow | needs_browser_review | screen_or_route | page.tsx | Engineering Delivery Lead | apps/web/src/app/offline/page.tsx | - |
| Unclassified user workflow | needs_browser_review | screen_or_route | BacktestsListView.tsx | Engineering Delivery Lead | apps/web/src/features/backtest/components/BacktestsListView.tsx | - |
| Unclassified user workflow | needs_browser_review | screen_or_route | AuditTrailView.tsx | Engineering Delivery Lead | apps/web/src/features/logs/components/AuditTrailView.tsx | - |
| Unclassified user workflow | needs_browser_review | screen_or_route | PerformanceReportsView.tsx | Engineering Delivery Lead | apps/web/src/features/reports/components/PerformanceReportsView.tsx | - |
| User configuration | needs_browser_review | screen_or_route | ProfilePage.tsx | Engineering Delivery Lead | apps/web/src/features/profile/pages/ProfilePage.tsx | - |

## Agent Rule

A user-facing feature is not complete until the backend/API state, frontend route/component state, configuration/auth/subscription gates, tests, docs, and browser screenshot/clickthrough evidence are either verified or explicitly blocked with an owner/action.
