# App Completion Index

Generated: 2026-06-20T21:01:59.098Z
Project: Soar
Root: C:/Personal/Projekty/Aplikacje/Soar
Source graph: docs/graphs/architecture-awareness.json

## Purpose

This index turns architecture-awareness entities into user-facing completion lanes.
Agents use it to decide what to plan next: backend/API proof, frontend/browser proof, auth/subscription/configuration gates, exchange integration proof, or cleanup.

## Counts

- Items: 2524
- User flows: 8
- Needs browser/screenshot review: 452
- Missing test link: 1645
- Missing doc link: 300
- Blocked: 10

## Flow Summary

- Account access: 609 entities; risks {"missing_test_link":443,"missing_doc_link":99,"implemented_needs_proof":12,"blocked":3,"ok":21,"needs_browser_review":31}; gates {"auth":609,"configuration":33,"subscription":14,"gateio":1}
- Subscription and entitlement: 537 entities; risks {"missing_test_link":462,"missing_doc_link":40,"implemented_needs_proof":4,"blocked":7,"ok":4,"needs_browser_review":20}; gates {"subscription":537,"auth":7,"configuration":25,"binance":6,"gateio":1}
- Exchange connection and configuration: 505 entities; risks {"missing_test_link":343,"missing_doc_link":60,"implemented_needs_proof":13,"ok":59,"needs_browser_review":30}; gates {"configuration":438,"gateio":89,"binance":49,"auth":10}
- Unclassified user workflow: 330 entities; risks {"missing_test_link":157,"missing_doc_link":26,"needs_browser_review":147}; gates {"auth":45,"configuration":15}
- Trading operation: 219 entities; risks {"missing_test_link":50,"missing_doc_link":29,"needs_browser_review":140}; gates {"configuration":50,"auth":8}
- User configuration: 150 entities; risks {"missing_doc_link":28,"missing_test_link":96,"implemented_needs_proof":1,"ok":1,"needs_browser_review":24}; gates {"configuration":126,"auth":9}
- Dashboard overview: 134 entities; risks {"missing_test_link":67,"missing_doc_link":14,"implemented_needs_proof":2,"needs_browser_review":51}; gates {"configuration":19,"auth":7}
- Admin operation: 40 entities; risks {"missing_test_link":27,"missing_doc_link":4,"needs_browser_review":9}; gates {"auth":30}

## Priority Review Queue

| User flow | Risk | Kind | Entity | Owner | Path | Gates |
| --- | --- | --- | --- | --- | --- | --- |
| Account access | missing_test_link | api_endpoint | POST /login | Engineering Delivery Lead | apps/api/src/modules/auth/auth.routes.ts#/login | auth |
| Account access | missing_test_link | api_endpoint | POST /logout | Engineering Delivery Lead | apps/api/src/modules/auth/auth.routes.ts#/logout | auth |
| Account access | missing_test_link | api_endpoint | GET /me | Engineering Delivery Lead | apps/api/src/modules/auth/auth.routes.ts#/me | auth |
| Account access | missing_test_link | api_endpoint | POST /register | Engineering Delivery Lead | apps/api/src/modules/auth/auth.routes.ts#/register | auth |
| Account access | missing_test_link | api_endpoint | USE /auth | Engineering Delivery Lead | apps/api/src/router/index.ts#/auth | auth |
| Account access | missing_test_link | feature_or_capability | Decision Register | Engineering Delivery Lead | .agents/state/decision-register.md | auth |
| Account access | missing_test_link | feature_or_capability | Risk Register | Engineering Delivery Lead | .agents/state/risk-register.md | auth |
| Account access | missing_test_link | feature_or_capability | migration.sql | Engineering Delivery Lead | apps/api/prisma/migrations/20260331101500_add_bot_runtime_session_model/migration.sql | auth |
| Account access | missing_test_link | feature_or_capability | migration.sql | Engineering Delivery Lead | apps/api/prisma/migrations/20260404181713_add_user_session_version/migration.sql | auth |
| Account access | missing_doc_link | feature_or_capability | requireAuth.test.ts | Engineering Delivery Lead | apps/api/src/middleware/requireAuth.test.ts | auth |
| Account access | missing_test_link | feature_or_capability | clearSession | Engineering Delivery Lead | apps/api/src/middleware/requireAuth.ts#clearSession | auth |
| Account access | missing_test_link | feature_or_capability | requireAuth | Engineering Delivery Lead | apps/api/src/middleware/requireAuth.ts#requireAuth | auth |
| Account access | missing_doc_link | feature_or_capability | createSessionCookie | Engineering Delivery Lead | apps/api/src/middleware/requireTrustedOrigin.test.ts#createSessionCookie | auth |
| Account access | missing_test_link | feature_or_capability | clearSession | Engineering Delivery Lead | apps/api/src/modules/auth/auth.controller.ts#clearSession | auth |
| Account access | missing_test_link | feature_or_capability | clearSessionCookie | Engineering Delivery Lead | apps/api/src/modules/auth/auth.controller.ts#clearSessionCookie | auth |
| Account access | missing_test_link | feature_or_capability | login | Engineering Delivery Lead | apps/api/src/modules/auth/auth.controller.ts#login | auth |
| Account access | missing_test_link | feature_or_capability | logout | Engineering Delivery Lead | apps/api/src/modules/auth/auth.controller.ts#logout | auth |
| Account access | missing_test_link | feature_or_capability | me | Engineering Delivery Lead | apps/api/src/modules/auth/auth.controller.ts#me | auth |
| Account access | missing_test_link | feature_or_capability | register | Engineering Delivery Lead | apps/api/src/modules/auth/auth.controller.ts#register | auth |
| Account access | missing_test_link | feature_or_capability | setSessionCookie | Engineering Delivery Lead | apps/api/src/modules/auth/auth.controller.ts#setSessionCookie | auth |
| Account access | missing_doc_link | feature_or_capability | auth.cookie.test.ts | Engineering Delivery Lead | apps/api/src/modules/auth/auth.cookie.test.ts | auth |
| Account access | missing_test_link | feature_or_capability | getSessionCookieBaseOptions | Engineering Delivery Lead | apps/api/src/modules/auth/auth.cookie.ts#getSessionCookieBaseOptions | auth |
| Account access | missing_doc_link | feature_or_capability | auth.e2e.test.ts | Engineering Delivery Lead | apps/api/src/modules/auth/auth.e2e.test.ts | auth |
| Account access | missing_doc_link | feature_or_capability | restoreEnv | Engineering Delivery Lead | apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv | auth |
| Account access | missing_doc_link | feature_or_capability | auth.errors.test.ts | Engineering Delivery Lead | apps/api/src/modules/auth/auth.errors.test.ts | auth |
| Account access | missing_doc_link | feature_or_capability | auth.jwt.test.ts | Engineering Delivery Lead | apps/api/src/modules/auth/auth.jwt.test.ts | auth |
| Account access | missing_test_link | feature_or_capability | getJwtSecrets | Engineering Delivery Lead | apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets | auth, configuration |
| Account access | missing_test_link | feature_or_capability | getPreviousSecretExpiry | Engineering Delivery Lead | apps/api/src/modules/auth/auth.jwt.ts#getPreviousSecretExpiry | auth, configuration |
| Account access | missing_test_link | feature_or_capability | signAuthToken | Engineering Delivery Lead | apps/api/src/modules/auth/auth.jwt.ts#signAuthToken | auth |
| Account access | missing_doc_link | feature_or_capability | auth.service.test.ts | Engineering Delivery Lead | apps/api/src/modules/auth/auth.service.test.ts | auth |
| Account access | missing_test_link | feature_or_capability | loginUser | Engineering Delivery Lead | apps/api/src/modules/auth/auth.service.ts#loginUser | auth |
| Account access | missing_test_link | feature_or_capability | registerUser | Engineering Delivery Lead | apps/api/src/modules/auth/auth.service.ts#registerUser | auth |
| Account access | missing_doc_link | feature_or_capability | auth.session.test.ts | Engineering Delivery Lead | apps/api/src/modules/auth/auth.session.test.ts | auth |
| Account access | missing_test_link | feature_or_capability | getSessionJwtExpiresIn | Engineering Delivery Lead | apps/api/src/modules/auth/auth.session.ts#getSessionJwtExpiresIn | auth |
| Account access | missing_test_link | feature_or_capability | getSessionTtlMs | Engineering Delivery Lead | apps/api/src/modules/auth/auth.session.ts#getSessionTtlMs | auth |
| Account access | missing_test_link | feature_or_capability | auth.types.ts | Engineering Delivery Lead | apps/api/src/modules/auth/auth.types.ts | auth |
| Account access | missing_doc_link | feature_or_capability | sessionToken.test.ts | Engineering Delivery Lead | apps/api/src/modules/auth/sessionToken.test.ts | auth |
| Account access | missing_doc_link | feature_or_capability | makeRequest | Engineering Delivery Lead | apps/api/src/modules/auth/sessionToken.test.ts#makeRequest | auth |
| Account access | missing_doc_link | feature_or_capability | restoreEnv | Engineering Delivery Lead | apps/api/src/modules/auth/sessionToken.test.ts#restoreEnv | auth |
| Account access | missing_doc_link | feature_or_capability | signCandidate | Engineering Delivery Lead | apps/api/src/modules/auth/sessionToken.test.ts#signCandidate | auth |
| Account access | missing_test_link | feature_or_capability | tokenIssuedAt | Engineering Delivery Lead | apps/api/src/modules/auth/sessionToken.ts#tokenIssuedAt | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin | auth |
| Account access | missing_test_link | feature_or_capability | getOwnedBotRuntimeSession | Engineering Delivery Lead | apps/api/src/modules/bots/botOwnership.service.ts#getOwnedBotRuntimeSession | auth |
| Account access | missing_test_link | feature_or_capability | resolveSessionWindowEnd | Engineering Delivery Lead | apps/api/src/modules/bots/botOwnership.service.ts#resolveSessionWindowEnd | auth |
| Account access | missing_test_link | feature_or_capability | closeBotRuntimeSessionPosition | Engineering Delivery Lead | apps/api/src/modules/bots/bots.controller.ts#closeBotRuntimeSessionPosition | auth |
| Account access | missing_test_link | feature_or_capability | getBotRuntimeSession | Engineering Delivery Lead | apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession | auth |
| Account access | missing_test_link | feature_or_capability | listBotRuntimeSessionPositions | Engineering Delivery Lead | apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionPositions | auth |
| Account access | missing_test_link | feature_or_capability | listBotRuntimeSessions | Engineering Delivery Lead | apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessions | auth |
| Account access | missing_test_link | feature_or_capability | listBotRuntimeSessionSymbolStats | Engineering Delivery Lead | apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionSymbolStats | auth |
| Account access | missing_test_link | feature_or_capability | listBotRuntimeSessionTrades | Engineering Delivery Lead | apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionTrades | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts#registerAndLogin | auth |
| Account access | missing_test_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/bots/bots.e2e.shared.ts#registerAndLogin | auth |
| Account access | missing_doc_link | feature_or_capability | bots.runtime-close-authority.route-pack.e2e.test.ts | Engineering Delivery Lead | apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts | auth |
| Account access | missing_doc_link | feature_or_capability | createBotWithRuntimeSession | Engineering Delivery Lead | apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts#createBotWithRuntimeSession | auth |
| Account access | missing_doc_link | feature_or_capability | getUserIdByEmail | Engineering Delivery Lead | apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts#getUserIdByEmail | auth |
| Account access | missing_doc_link | feature_or_capability | bots.runtime-close-dca-authority.e2e.test.ts | Engineering Delivery Lead | apps/api/src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts | auth |
| Account access | missing_doc_link | feature_or_capability | seedTicker | Engineering Delivery Lead | apps/api/src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts#seedTicker | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts#registerAndLogin | auth, subscription |
| Account access | missing_test_link | feature_or_capability | resolveAggregateSessionWindowEnd | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeMonitoringAggregateFallbacks.service.ts#resolveAggregateSessionWindowEnd | auth |
| Account access | missing_test_link | feature_or_capability | selectSessionsForAggregation | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts#selectSessionsForAggregation | auth |
| Account access | missing_test_link | feature_or_capability | dedupeRuntimeOpenOrders | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#dedupeRuntimeOpenOrders | auth |
| Account access | missing_test_link | feature_or_capability | resolveRuntimeTakeoverStatus | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#resolveRuntimeTakeoverStatus | auth |
| Account access | missing_test_link | feature_or_capability | selectRuntimeOpenOrders | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#selectRuntimeOpenOrders | auth |
| Account access | missing_doc_link | feature_or_capability | runtimeSessionPositionCommand.service.test.ts | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionCommand.service.test.ts | auth |
| Account access | missing_test_link | feature_or_capability | resolveClosedResult | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveClosedResult | auth |
| Account access | missing_test_link | feature_or_capability | resolveSingleCanonicalStrategyId | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveSingleCanonicalStrategyId | auth |
| Account access | missing_test_link | feature_or_capability | resolveRuntimePositionDcaCount | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionDcaCount.ts#resolveRuntimePositionDcaCount | auth |
| Account access | missing_test_link | feature_or_capability | countRuntimeManagedPositions | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#countRuntimeManagedPositions | auth |
| Account access | missing_test_link | feature_or_capability | getRuntimePositionBotContext | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#getRuntimePositionBotContext | auth |
| Account access | missing_test_link | feature_or_capability | listRuntimeManagedPositions | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#listRuntimeManagedPositions | auth |
| Account access | missing_test_link | feature_or_capability | listRuntimeOpenOrders | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#listRuntimeOpenOrders | auth |
| Account access | missing_test_link | feature_or_capability | listRuntimePositionLastPrices | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#listRuntimePositionLastPrices | auth |
| Account access | missing_test_link | feature_or_capability | listRuntimePositionStrategies | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#listRuntimePositionStrategies | auth |
| Account access | missing_test_link | feature_or_capability | listRuntimePositionTradeRows | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#listRuntimePositionTradeRows | auth |
| Account access | missing_test_link | feature_or_capability | sumRuntimeManagedPositionMarginUsed | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#sumRuntimeManagedPositionMarginUsed | auth |
| Account access | missing_test_link | feature_or_capability | sumRuntimeManagedPositionQuantity | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#sumRuntimeManagedPositionQuantity | auth |
| Account access | missing_test_link | feature_or_capability | sumRuntimeManagedPositionRealizedPnl | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#sumRuntimeManagedPositionRealizedPnl | auth |
| Account access | missing_test_link | feature_or_capability | sumRuntimeManagedPositionTradeFees | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#sumRuntimeManagedPositionTradeFees | auth |
| Account access | missing_test_link | feature_or_capability | sumRuntimeManagedPositionUnrealizedPnl | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#sumRuntimeManagedPositionUnrealizedPnl | auth |
| Account access | missing_doc_link | feature_or_capability | runtimeSessionPositionsRead.service.test.ts | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts | auth |

## Agent Rule

A user-facing feature is not complete until the backend/API state, frontend route/component state, configuration/auth/subscription gates, tests, docs, and browser screenshot/clickthrough evidence are either verified or explicitly blocked with an owner/action.
