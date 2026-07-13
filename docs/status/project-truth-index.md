# Project Truth Index

Generated: 2026-07-13T19:06:40.693Z
Project: Soar
Status: gaps_require_routing

This is the routing surface agents should use before guessing whether an app works.

| Metric | Count |
| --- | ---: |
| appCompletionItems | 3564 |
| eventChains | 8 |
| incompleteEventChains | 0 |
| runtimeFindings | 0 |
| criticalRuntimeFindings | 0 |
| appCompletionGaps | 3513 |
| indexedAppCompletionGaps | 200 |
| knownAppCompletionRiskItems | 3513 |
| appCompletionPriorityReviewItems | 200 |
| appCompletionPriorityReviewTruncated | true |
| operationalGateGaps | 0 |
| indexedGaps | 200 |
| totalGaps | 3513 |

## First Gap

- medium: Account access: createBotWithRuntimeSession has app-completion risk missing_doc_link.
- Owner: Docs Memory Lead + Project Manager
- Next action: Link or update the source-of-truth docs/status entry for this flow so future agents can reason from evidence.

## Gaps

| Severity | Kind | Flow | Summary | Next owner |
| --- | --- | --- | --- | --- |
| medium | app_completion_gap | Account access | Account access: createBotWithRuntimeSession has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: getUserIdByEmail has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: seedTicker has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: registerAndLogin has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: resolveAggregateSessionWindowEnd has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: dedupeRuntimeOpenOrders has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: resolveRuntimeTakeoverStatus has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: selectRuntimeOpenOrders has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: resolveClosedResult has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: resolveSingleCanonicalStrategyId has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: resolveRuntimePositionDcaCount has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: countRuntimeManagedPositions has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: getRuntimePositionBotContext has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listRuntimeManagedPositions has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listRuntimeOpenOrders has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listRuntimePositionLastPrices has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listRuntimePositionStrategies has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listRuntimePositionTradeRows has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: sumRuntimeManagedPositionMarginUsed has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: sumRuntimeManagedPositionQuantity has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: sumRuntimeManagedPositionRealizedPnl has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: sumRuntimeManagedPositionTradeFees has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: sumRuntimeManagedPositionUnrealizedPnl has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: row has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: isCanonical has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: isSupplementalDcaTradeForOpenPosition has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: nullableIdentityMatches has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: resolveRuntimeCapitalSummary has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: resolveRuntimePositionContinuityStart has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: resolveRuntimePositionTrades has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: resolveSingleBotStrategyContext has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: selectRuntimeDisplayState has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: sortRuntimePositionTrades has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: strategyIdentityMatches has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: toPositiveIntOrUndefined has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: tradeBelongsToRuntimePositionContinuityBoundary has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: tradeBelongsToRuntimePositionIdentity has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: getBotRuntimeSession has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: getRuntimeSessionSummaryMetrics has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listRuntimeSessionsWithSummary has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: resolveSessionWindowEnd has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: emptyRuntimeSymbolStatsResponse has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: firstRuntimeBlockReason has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: listBotRuntimeSessionSymbolStats has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: resolveRuntimeSymbolStatsConfiguredContext has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: countRuntimeTradeRows has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: getRuntimeTradeBotContext has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listRuntimeTradeAnchorPositionRows has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listRuntimeTradeCarryOverPositionIds has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listRuntimeTradeCloseEventRows has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listRuntimeTradePositionMetaRows has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listRuntimeTradePositionTradeRows has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listRuntimeTradeRows has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: sumRuntimeTradeFees has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: compareNumbers has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: compareStrings has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: emptyRuntimeTradesResponse has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: isPersistedImportedOpenAnchorTrade has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: resolveSingleCanonicalStrategyId has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: shouldIncludeOpenAnchor has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: toOpenAnchorTradeSide has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: toPositiveIntOrUndefined has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: registerAndLogin has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: fetchAuthenticatedExchangeBalanceRaw has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: fetchAuthenticatedExchangeOpenOrdersRaw has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: fetchAuthenticatedExchangePositionsRaw has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: assertAuthenticatedExchangeReadSupport has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: resolveAuthenticatedExchangeReadSource has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: supportsAuthenticatedExchangeRead has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: createAuthenticatedExchangeConnector has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: registerAndLogin has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: registerAndLogin has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: registerAndLogin has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: registerAndLogin has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: registerAndLogin has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: registerAndLogin has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: registerAndLogin has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: registerAndLogin has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: cleanup has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: createApiKey has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
