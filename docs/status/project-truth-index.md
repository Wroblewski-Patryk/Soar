# Project Truth Index

Generated: 2026-07-05T02:25:15.289Z
Project: Soar
Status: gaps_require_routing

This is the routing surface agents should use before guessing whether an app works.

| Metric | Count |
| --- | ---: |
| appCompletionItems | 3557 |
| eventChains | 8 |
| incompleteEventChains | 0 |
| runtimeFindings | 0 |
| criticalRuntimeFindings | 0 |
| appCompletionGaps | 3541 |
| indexedAppCompletionGaps | 200 |
| knownAppCompletionRiskItems | 3541 |
| appCompletionPriorityReviewItems | 200 |
| appCompletionPriorityReviewTruncated | true |
| operationalGateGaps | 0 |
| indexedGaps | 200 |
| totalGaps | 3541 |

## First Gap

- medium: Account access: requireAuth has app-completion risk implemented_needs_proof.
- Owner: QA Regression Lead + Project Manager
- Next action: Run and record fresh proof for the implemented behavior, then update completion/project-truth indexes.

## Gaps

| Severity | Kind | Flow | Summary | Next owner |
| --- | --- | --- | --- | --- |
| medium | app_completion_gap | Account access | Account access: requireAuth has app-completion risk implemented_needs_proof. | QA Regression Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: clearSession has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: clearSessionCookie has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: login has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: logout has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: me has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: register has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: setSessionCookie has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: getSessionCookieBaseOptions has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: restoreEnv has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: getJwtSecrets has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: getPreviousSecretExpiry has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: signAuthToken has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: loginUser has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: registerUser has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: getSessionJwtExpiresIn has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: getSessionTtlMs has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: makeRequest has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: restoreEnv has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: signCandidate has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: tokenIssuedAt has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: registerAndLogin has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: getOwnedBotRuntimeSession has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: resolveSessionWindowEnd has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: closeBotRuntimeSessionPosition has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: getBotRuntimeSession has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listBotRuntimeSessionPositions has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listBotRuntimeSessions has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listBotRuntimeSessionSymbolStats has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listBotRuntimeSessionTrades has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: registerAndLogin has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: registerAndLogin has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: createBotWithRuntimeSession has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: getUserIdByEmail has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: seedTicker has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: registerAndLogin has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: resolveAggregateSessionWindowEnd has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: dedupeRuntimeOpenOrders has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: resolveRuntimeTakeoverStatus has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: selectRuntimeOpenOrders has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
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
| medium | app_completion_gap | Account access | Account access: listBotRuntimeSessionPositions has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
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
| medium | app_completion_gap | Account access | Account access: listBotRuntimeSessions has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: getRuntimeSessionSummaryMetrics has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: listRuntimeSessionsWithSummary has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: resolveSessionWindowEnd has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: emptyRuntimeSymbolStatsResponse has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: firstRuntimeBlockReason has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: listBotRuntimeSessionSymbolStats has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: resolveRuntimeSymbolStatsConfiguredContext has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: countRuntimeTradeRows has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
