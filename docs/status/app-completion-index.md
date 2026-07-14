# App Completion Index

Generated: 2026-07-14T00:37:05.833Z
Project: Soar
Root: C:/Personal/Projekty/Aplikacje/Soar
Source graph: docs/graphs/architecture-awareness.json

## Purpose

This index turns architecture-awareness entities into user-facing completion lanes.
Agents use it to decide what to plan next: backend/API proof, frontend/browser proof, auth/subscription/configuration gates, exchange integration proof, or cleanup.

## Counts

- Items: 3564
- User flows: 8
- Needs browser/screenshot review: 452
- Missing test link: 966
- Missing doc link: 1979
- Implemented, needs proof: 113
- Blocked: 0
- Known non-ok risk items: 3510
- Priority review items indexed: 200/3510
- Priority review truncated: true

## Flow Summary

- Unclassified user workflow: 1610 entities; risks {"missing_test_link":221,"missing_doc_link":1149,"implemented_needs_proof":90,"ok":3,"needs_browser_review":147}; gates {"auth":29,"configuration":3}
- Trading operation: 944 entities; risks {"missing_doc_link":393,"missing_test_link":404,"implemented_needs_proof":7,"needs_browser_review":140}; gates {"configuration":39,"auth":8}
- Dashboard overview: 285 entities; risks {"missing_test_link":126,"missing_doc_link":107,"implemented_needs_proof":1,"needs_browser_review":51}; gates {"configuration":5,"auth":5}
- Account access: 265 entities; risks {"ok":46,"missing_doc_link":127,"missing_test_link":58,"implemented_needs_proof":3,"needs_browser_review":31}; gates {"auth":265,"configuration":19,"subscription":3,"gateio":1}
- Exchange connection and configuration: 185 entities; risks {"missing_doc_link":111,"missing_test_link":42,"implemented_needs_proof":2,"needs_browser_review":30}; gates {"gateio":15,"configuration":164,"binance":18,"auth":6}
- User configuration: 156 entities; risks {"ok":5,"implemented_needs_proof":10,"missing_test_link":74,"missing_doc_link":43,"needs_browser_review":24}; gates {"configuration":95,"auth":8}
- Subscription and entitlement: 82 entities; risks {"missing_test_link":24,"missing_doc_link":38,"needs_browser_review":20}; gates {"subscription":82,"auth":5,"configuration":2}
- Admin operation: 37 entities; risks {"missing_test_link":17,"missing_doc_link":11,"needs_browser_review":9}; gates {"auth":19}

## Priority Review Queue

| User flow | Risk | Kind | Entity | Owner | Path | Gates |
| --- | --- | --- | --- | --- | --- | --- |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts#registerAndLogin | auth, subscription |
| Account access | missing_test_link | feature_or_capability | resolveAggregateSessionWindowEnd | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeMonitoringAggregateFallbacks.service.ts#resolveAggregateSessionWindowEnd | auth |
| Account access | missing_doc_link | feature_or_capability | dedupeRuntimeOpenOrders | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#dedupeRuntimeOpenOrders | auth |
| Account access | missing_doc_link | feature_or_capability | resolveRuntimeTakeoverStatus | Test Automation Engineer | apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#resolveRuntimeTakeoverStatus | auth, configuration |
| Account access | missing_doc_link | feature_or_capability | selectRuntimeOpenOrders | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#selectRuntimeOpenOrders | auth |
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
| Account access | missing_test_link | feature_or_capability | resolveSingleCanonicalStrategyId | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts#resolveSingleCanonicalStrategyId | auth |
| Account access | missing_test_link | feature_or_capability | shouldIncludeOpenAnchor | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts#shouldIncludeOpenAnchor | auth |
| Account access | missing_test_link | feature_or_capability | toOpenAnchorTradeSide | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts#toOpenAnchorTradeSide | auth |
| Account access | missing_test_link | feature_or_capability | toPositiveIntOrUndefined | Engineering Delivery Lead | apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts#toPositiveIntOrUndefined | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/engine/runtime-flow.e2e.test.ts#registerAndLogin | auth |
| Account access | missing_doc_link | feature_or_capability | fetchAuthenticatedExchangeBalanceRaw | Engineering Delivery Lead | apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.ts#fetchAuthenticatedExchangeBalanceRaw | auth, configuration |
| Account access | missing_doc_link | feature_or_capability | fetchAuthenticatedExchangeOpenOrdersRaw | Engineering Delivery Lead | apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.ts#fetchAuthenticatedExchangeOpenOrdersRaw | auth, configuration |
| Account access | missing_doc_link | feature_or_capability | fetchAuthenticatedExchangePositionsRaw | Engineering Delivery Lead | apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.ts#fetchAuthenticatedExchangePositionsRaw | auth, configuration |
| Account access | missing_doc_link | feature_or_capability | assertAuthenticatedExchangeReadSupport | Engineering Delivery Lead | apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts#assertAuthenticatedExchangeReadSupport | auth, configuration |
| Account access | missing_doc_link | feature_or_capability | resolveAuthenticatedExchangeReadSource | Engineering Delivery Lead | apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts#resolveAuthenticatedExchangeReadSource | auth, configuration |
| Account access | missing_doc_link | feature_or_capability | supportsAuthenticatedExchangeRead | Engineering Delivery Lead | apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts#supportsAuthenticatedExchangeRead | auth, configuration |
| Account access | missing_doc_link | feature_or_capability | createAuthenticatedExchangeConnector | Engineering Delivery Lead | apps/api/src/modules/exchange/exchangeConnectorFactory.service.ts#createAuthenticatedExchangeConnector | auth, configuration |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/icons/icons.e2e.test.ts#registerAndLogin | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/isolation/data-isolation.e2e.test.ts#registerAndLogin | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/logs/logs.e2e.test.ts#registerAndLogin | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/market-stream/marketStream.routes.e2e.test.ts#registerAndLogin | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/markets/markets.e2e.test.ts#registerAndLogin | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/orders/orders-positions.e2e.test.ts#registerAndLogin | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/orders/orders.manual-paper-market.e2e.test.ts#registerAndLogin | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/positions/positions-live-status.e2e.test.ts#registerAndLogin | auth |
| Account access | missing_doc_link | feature_or_capability | cleanup | Engineering Delivery Lead | apps/api/src/modules/positions/positions.authenticatedSnapshots.service.test.ts#cleanup | auth |
| Account access | missing_doc_link | feature_or_capability | createApiKey | Engineering Delivery Lead | apps/api/src/modules/positions/positions.authenticatedSnapshots.service.test.ts#createApiKey | auth, configuration |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/positions/positions.exchangeSnapshot.e2e.test.ts#registerAndLogin | auth, configuration |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/positions/positions.list.e2e.test.ts#registerAndLogin | auth |
| Account access | missing_doc_link | feature_or_capability | registerAndLogin | Engineering Delivery Lead | apps/api/src/modules/positions/positions.orphan-repair.e2e.test.ts#registerAndLogin | auth |

## Agent Rule

A user-facing feature is not complete until the backend/API state, frontend route/component state, configuration/auth/subscription gates, tests, docs, and browser screenshot/clickthrough evidence are either verified or explicitly blocked with an owner/action.
