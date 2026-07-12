# App Completion Index

Generated: 2026-07-11T23:34:45.309Z
Project: Soar
Root: C:/Personal/Projekty/Aplikacje/Soar
Source graph: docs/graphs/architecture-awareness.json

## Purpose

This index turns architecture-awareness entities into user-facing completion lanes.
Agents use it to decide what to plan next: backend/API proof, frontend/browser proof, auth/subscription/configuration gates, exchange integration proof, or cleanup.

## Counts

- Items: 3558
- User flows: 8
- Needs browser/screenshot review: 452
- Missing test link: 974
- Missing doc link: 1991
- Implemented, needs proof: 113
- Blocked: 0
- Known non-ok risk items: 3530
- Priority review items indexed: 200/3530
- Priority review truncated: true

## Flow Summary

- Unclassified user workflow: 1607 entities; risks {"missing_test_link":218,"missing_doc_link":1149,"implemented_needs_proof":90,"ok":3,"needs_browser_review":147}; gates {"auth":29,"configuration":2}
- Trading operation: 942 entities; risks {"missing_doc_link":391,"missing_test_link":404,"implemented_needs_proof":7,"needs_browser_review":140}; gates {"configuration":39,"auth":8}
- Dashboard overview: 285 entities; risks {"missing_test_link":126,"missing_doc_link":107,"implemented_needs_proof":1,"needs_browser_review":51}; gates {"configuration":5,"auth":5}
- Account access: 265 entities; risks {"ok":20,"missing_doc_link":141,"missing_test_link":70,"implemented_needs_proof":3,"needs_browser_review":31}; gates {"auth":265,"configuration":16,"subscription":2,"gateio":1}
- Exchange connection and configuration: 185 entities; risks {"missing_doc_link":111,"missing_test_link":42,"implemented_needs_proof":2,"needs_browser_review":30}; gates {"gateio":15,"configuration":164,"binance":18,"auth":6}
- User configuration: 155 entities; risks {"ok":5,"implemented_needs_proof":10,"missing_test_link":73,"missing_doc_link":43,"needs_browser_review":24}; gates {"configuration":94,"auth":8}
- Subscription and entitlement: 82 entities; risks {"missing_test_link":24,"missing_doc_link":38,"needs_browser_review":20}; gates {"subscription":82,"auth":5,"configuration":2}
- Admin operation: 37 entities; risks {"missing_test_link":17,"missing_doc_link":11,"needs_browser_review":9}; gates {"auth":19}

## Priority Review Queue

| User flow | Risk | Kind | Entity | Owner | Path | Gates |
| --- | --- | --- | --- | --- | --- | --- |
| Account access | missing_doc_link | feature_or_capability | signAuthToken | Engineering Delivery Lead | apps/api/src/modules/auth/auth.jwt.ts#signAuthToken | auth |
| Account access | missing_doc_link | feature_or_capability | loginUser | Engineering Delivery Lead | apps/api/src/modules/auth/auth.service.ts#loginUser | auth |
| Account access | missing_doc_link | feature_or_capability | registerUser | Engineering Delivery Lead | apps/api/src/modules/auth/auth.service.ts#registerUser | auth |
| Account access | missing_doc_link | feature_or_capability | getSessionJwtExpiresIn | Engineering Delivery Lead | apps/api/src/modules/auth/auth.session.ts#getSessionJwtExpiresIn | auth |
| Account access | missing_doc_link | feature_or_capability | getSessionTtlMs | Engineering Delivery Lead | apps/api/src/modules/auth/auth.session.ts#getSessionTtlMs | auth |
| Account access | missing_doc_link | feature_or_capability | makeRequest | Engineering Delivery Lead | apps/api/src/modules/auth/sessionToken.test.ts#makeRequest | auth |
| Account access | missing_doc_link | feature_or_capability | restoreEnv | Engineering Delivery Lead | apps/api/src/modules/auth/sessionToken.test.ts#restoreEnv | auth |
| Account access | missing_doc_link | feature_or_capability | signCandidate | Engineering Delivery Lead | apps/api/src/modules/auth/sessionToken.test.ts#signCandidate | auth |
| Account access | missing_doc_link | feature_or_capability | tokenIssuedAt | Engineering Delivery Lead | apps/api/src/modules/auth/sessionToken.ts#tokenIssuedAt | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin | auth |
| Account access | missing_doc_link | feature_or_capability | getOwnedBotRuntimeSession | Engineering Delivery Lead | apps/api/src/modules/bots/botOwnership.service.ts#getOwnedBotRuntimeSession | auth |
| Account access | missing_doc_link | feature_or_capability | resolveSessionWindowEnd | Engineering Delivery Lead | apps/api/src/modules/bots/botOwnership.service.ts#resolveSessionWindowEnd | auth |
| Account access | missing_test_link | feature_or_capability | closeBotRuntimeSessionPosition | Engineering Delivery Lead | apps/api/src/modules/bots/bots.controller.ts#closeBotRuntimeSessionPosition | auth |
| Account access | missing_test_link | feature_or_capability | getBotRuntimeSession | Engineering Delivery Lead | apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession | auth |
| Account access | missing_test_link | feature_or_capability | listBotRuntimeSessionPositions | Engineering Delivery Lead | apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionPositions | auth |
| Account access | missing_test_link | feature_or_capability | listBotRuntimeSessions | Engineering Delivery Lead | apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessions | auth |
| Account access | missing_test_link | feature_or_capability | listBotRuntimeSessionSymbolStats | Engineering Delivery Lead | apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionSymbolStats | auth |
| Account access | missing_test_link | feature_or_capability | listBotRuntimeSessionTrades | Engineering Delivery Lead | apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionTrades | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts#registerAndLogin | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/bots/bots.e2e.shared.ts#registerAndLogin | auth |
| Account access | missing_doc_link | feature_or_capability | createBotWithRuntimeSession | Engineering Delivery Lead | apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts#createBotWithRuntimeSession | auth |
| Account access | missing_doc_link | feature_or_capability | getUserIdByEmail | Engineering Delivery Lead | apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts#getUserIdByEmail | auth |
| Account access | missing_doc_link | feature_or_capability | seedTicker | Engineering Delivery Lead | apps/api/src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts#seedTicker | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts#registerAndLogin | auth, subscription |
| Account access | missing_test_link | feature_or_capability | resolveAggregateSessionWindowEnd | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeMonitoringAggregateFallbacks.service.ts#resolveAggregateSessionWindowEnd | auth |
| Account access | missing_test_link | feature_or_capability | dedupeRuntimeOpenOrders | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#dedupeRuntimeOpenOrders | auth |
| Account access | missing_test_link | feature_or_capability | resolveRuntimeTakeoverStatus | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#resolveRuntimeTakeoverStatus | auth |
| Account access | missing_test_link | feature_or_capability | selectRuntimeOpenOrders | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#selectRuntimeOpenOrders | auth |
| Account access | missing_doc_link | feature_or_capability | resolveClosedResult | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveClosedResult | auth |
| Account access | missing_doc_link | feature_or_capability | resolveSingleCanonicalStrategyId | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveSingleCanonicalStrategyId | auth |
| Account access | missing_doc_link | feature_or_capability | resolveRuntimePositionDcaCount | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionDcaCount.ts#resolveRuntimePositionDcaCount | auth |
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
| Account access | missing_doc_link | feature_or_capability | row | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts#row | auth |
| Account access | missing_test_link | feature_or_capability | isCanonical | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#isCanonical | auth |
| Account access | missing_test_link | feature_or_capability | isSupplementalDcaTradeForOpenPosition | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#isSupplementalDcaTradeForOpenPosition | auth |
| Account access | missing_test_link | feature_or_capability | listBotRuntimeSessionPositions | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#listBotRuntimeSessionPositions | auth |
| Account access | missing_doc_link | feature_or_capability | nullableIdentityMatches | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#nullableIdentityMatches | auth |
| Account access | missing_test_link | feature_or_capability | resolveRuntimeCapitalSummary | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#resolveRuntimeCapitalSummary | auth |
| Account access | missing_test_link | feature_or_capability | resolveRuntimePositionContinuityStart | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#resolveRuntimePositionContinuityStart | auth |
| Account access | missing_test_link | feature_or_capability | resolveRuntimePositionTrades | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#resolveRuntimePositionTrades | auth |
| Account access | missing_doc_link | feature_or_capability | resolveSingleBotStrategyContext | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#resolveSingleBotStrategyContext | auth |
| Account access | missing_test_link | feature_or_capability | selectRuntimeDisplayState | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#selectRuntimeDisplayState | auth |
| Account access | missing_doc_link | feature_or_capability | sortRuntimePositionTrades | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#sortRuntimePositionTrades | auth |
| Account access | missing_test_link | feature_or_capability | strategyIdentityMatches | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#strategyIdentityMatches | auth |
| Account access | missing_test_link | feature_or_capability | toPositiveIntOrUndefined | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#toPositiveIntOrUndefined | auth |
| Account access | missing_test_link | feature_or_capability | tradeBelongsToRuntimePositionContinuityBoundary | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#tradeBelongsToRuntimePositionContinuityBoundary | auth |
| Account access | missing_test_link | feature_or_capability | tradeBelongsToRuntimePositionIdentity | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#tradeBelongsToRuntimePositionIdentity | auth |
| Account access | missing_test_link | feature_or_capability | getBotRuntimeSession | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionRead.service.ts#getBotRuntimeSession | auth |
| Account access | missing_test_link | feature_or_capability | listBotRuntimeSessions | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionRead.service.ts#listBotRuntimeSessions | auth |
| Account access | missing_test_link | feature_or_capability | getRuntimeSessionSummaryMetrics | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionsRead.service.ts#getRuntimeSessionSummaryMetrics | auth |
| Account access | missing_test_link | feature_or_capability | listRuntimeSessionsWithSummary | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionsRead.service.ts#listRuntimeSessionsWithSummary | auth |
| Account access | missing_test_link | feature_or_capability | resolveSessionWindowEnd | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionsRead.service.ts#resolveSessionWindowEnd | auth |
| Account access | missing_doc_link | feature_or_capability | emptyRuntimeSymbolStatsResponse | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts#emptyRuntimeSymbolStatsResponse | auth |
| Account access | missing_doc_link | feature_or_capability | firstRuntimeBlockReason | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts#firstRuntimeBlockReason | auth |
| Account access | missing_doc_link | feature_or_capability | listBotRuntimeSessionSymbolStats | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts#listBotRuntimeSessionSymbolStats | auth |
| Account access | missing_doc_link | feature_or_capability | resolveRuntimeSymbolStatsConfiguredContext | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts#resolveRuntimeSymbolStatsConfiguredContext | auth, configuration |
| Account access | missing_test_link | feature_or_capability | countRuntimeTradeRows | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts#countRuntimeTradeRows | auth |
| Account access | missing_test_link | feature_or_capability | getRuntimeTradeBotContext | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts#getRuntimeTradeBotContext | auth |
| Account access | missing_test_link | feature_or_capability | listRuntimeTradeAnchorPositionRows | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts#listRuntimeTradeAnchorPositionRows | auth |
| Account access | missing_test_link | feature_or_capability | listRuntimeTradeCarryOverPositionIds | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts#listRuntimeTradeCarryOverPositionIds | auth |
| Account access | missing_test_link | feature_or_capability | listRuntimeTradeCloseEventRows | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts#listRuntimeTradeCloseEventRows | auth |
| Account access | missing_test_link | feature_or_capability | listRuntimeTradePositionMetaRows | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts#listRuntimeTradePositionMetaRows | auth |
| Account access | missing_test_link | feature_or_capability | listRuntimeTradePositionTradeRows | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts#listRuntimeTradePositionTradeRows | auth |
| Account access | missing_test_link | feature_or_capability | listRuntimeTradeRows | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts#listRuntimeTradeRows | auth |
| Account access | missing_test_link | feature_or_capability | sumRuntimeTradeFees | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts#sumRuntimeTradeFees | auth |
| Account access | missing_test_link | feature_or_capability | compareNumbers | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts#compareNumbers | auth |
| Account access | missing_test_link | feature_or_capability | compareStrings | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts#compareStrings | auth |
| Account access | missing_test_link | feature_or_capability | emptyRuntimeTradesResponse | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts#emptyRuntimeTradesResponse | auth |
| Account access | missing_test_link | feature_or_capability | isPersistedImportedOpenAnchorTrade | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts#isPersistedImportedOpenAnchorTrade | auth |

## Agent Rule

A user-facing feature is not complete until the backend/API state, frontend route/component state, configuration/auth/subscription gates, tests, docs, and browser screenshot/clickthrough evidence are either verified or explicitly blocked with an owner/action.
