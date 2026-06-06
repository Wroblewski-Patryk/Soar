# Architecture Awareness Report

Generated: 2026-06-06T16:24:34.647Z
Project: Soar
Root: C:/Personal/Projekty/Aplikacje/Soar

## Counts By Type

| Type | Count |
| --- | ---: |
| agent | 52 |
| api_endpoint | 37 |
| component | 97 |
| document | 3706 |
| feature | 225 |
| function | 8324 |
| migration | 56 |
| model | 277 |
| module | 15 |
| project | 1 |
| route | 352 |
| task | 1101 |
| test | 388 |

## Counts By Status

| Status | Count |
| --- | ---: |
| blocked | 24 |
| deprecated | 7 |
| implemented | 12830 |
| in_progress | 9 |
| tested | 674 |
| verified | 1087 |

## Health Signals

- Raw implementation entities without inferred tests: 7608
- Actionable implementation entities without inferred tests: 804
- Raw implementation entities without inferred docs: 737
- Actionable implementation entities without inferred docs: 0
- Classified inferred-link noise: 7386
- Entities without owner attribution: 0
- Disconnected entities: 0

## Top Actionable Missing Test Links

- function: main (apps/api/prisma/seed.ts#main)
- function: resetBotsE2eState (apps/api/src/modules/bots/bots.e2e.shared.ts#resetBotsE2eState)
- function: seedRuntimeTicker (apps/api/src/modules/bots/bots.e2e.shared.ts#seedRuntimeTicker)
- function: getBotWithStrategyProjectionById (apps/api/src/modules/bots/bots.repository.ts#getBotWithStrategyProjectionById)
- function: getOwnedBotWithStrategyProjection (apps/api/src/modules/bots/bots.repository.ts#getOwnedBotWithStrategyProjection)
- function: listOwnedBotsWithStrategyProjection (apps/api/src/modules/bots/bots.repository.ts#listOwnedBotsWithStrategyProjection)
- function: listMarketCandles (apps/api/src/modules/bots/botsRuntimeRead.repository.ts#listMarketCandles)
- function: listStrategiesByIds (apps/api/src/modules/bots/botsRuntimeRead.repository.ts#listStrategiesByIds)
- function: toFiniteNonNegativeInt (apps/api/src/modules/engine/runtimePositionState.store.ts#toFiniteNonNegativeInt)
- function: clampPeriod (apps/api/src/modules/engine/sharedIndicatorSeries.ts#clampPeriod)
- function: ensureAdx (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureAdx)
- function: ensureAtr (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureAtr)
- function: ensureBollinger (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureBollinger)
- function: ensureCci (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureCci)
- function: ensureDonchian (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureDonchian)
- function: ensureEma (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureEma)
- function: ensureFundingRate (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureFundingRate)
- function: ensureFundingRateZScore (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureFundingRateZScore)
- function: ensureMacd (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureMacd)
- function: ensureMomentum (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureMomentum)
- function: ensureOpenInterest (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureOpenInterest)
- function: ensureOpenInterestDelta (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureOpenInterestDelta)
- function: ensureOpenInterestMa (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureOpenInterestMa)
- function: ensureOpenInterestZScore (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureOpenInterestZScore)
- function: ensureOrderBookDepthRatio (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureOrderBookDepthRatio)
- function: ensureOrderBookImbalance (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureOrderBookImbalance)
- function: ensureOrderBookSpreadBps (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureOrderBookSpreadBps)
- function: ensureRoc (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureRoc)
- function: ensureSma (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureSma)
- function: ensureStochastic (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureStochastic)
- function: ensureStochRsi (apps/api/src/modules/engine/strategySignalAnalysis.ts#ensureStochRsi)
- function: pushConditionLine (apps/api/src/modules/engine/strategySignalAnalysis.ts#pushConditionLine)
- function: pushIndicatorSummary (apps/api/src/modules/engine/strategySignalAnalysis.ts#pushIndicatorSummary)
- function: pushRule (apps/api/src/modules/engine/strategySignalAnalysis.ts#pushRule)
- function: withFallback (apps/api/src/modules/engine/strategySignalAnalysis.ts#withFallback)
- function: buildImportedExternalPositionId (apps/api/src/modules/positions/livePositionReconciliation.helpers.ts#buildImportedExternalPositionId)
- function: buildImportedExternalPositionIds (apps/api/src/modules/positions/livePositionReconciliation.helpers.ts#buildImportedExternalPositionIds)
- function: buildImportedExternalPositionMarketPrefix (apps/api/src/modules/positions/livePositionReconciliation.helpers.ts#buildImportedExternalPositionMarketPrefix)
- function: buildLegacyImportedExternalPositionId (apps/api/src/modules/positions/livePositionReconciliation.helpers.ts#buildLegacyImportedExternalPositionId)
- function: buildLegacyImportedExternalPositionSymbolPrefix (apps/api/src/modules/positions/livePositionReconciliation.helpers.ts#buildLegacyImportedExternalPositionSymbolPrefix)

## Top Actionable Missing Doc Links


## Classified Inferred-Link Noise

- config_only_file: 65
- curated_graph_covered: 1545
- generated_vendor_docs_vault_plugin: 5775
- top_level_app_mount: 1

## Top Classified Noise Samples

- top_level_app_mount: api_endpoint: USE /avatars (apps/api/src/index.ts#/avatars)
- curated_graph_covered: api_endpoint: POST /login (apps/api/src/modules/auth/auth.routes.ts#/login)
- curated_graph_covered: api_endpoint: POST /logout (apps/api/src/modules/auth/auth.routes.ts#/logout)
- curated_graph_covered: api_endpoint: GET /me (apps/api/src/modules/auth/auth.routes.ts#/me)
- curated_graph_covered: api_endpoint: POST /register (apps/api/src/modules/auth/auth.routes.ts#/register)
- curated_graph_covered: api_endpoint: GET / (apps/api/src/router/admin.routes.ts#/)
- curated_graph_covered: api_endpoint: USE /subscriptions/plans (apps/api/src/router/admin.routes.ts#/subscriptions/plans)
- curated_graph_covered: api_endpoint: USE /users (apps/api/src/router/admin.routes.ts#/users)
- curated_graph_covered: api_endpoint: GET / (apps/api/src/router/dashboard.routes.ts#/)
- curated_graph_covered: api_endpoint: USE /backtests (apps/api/src/router/dashboard.routes.ts#/backtests)
- curated_graph_covered: api_endpoint: USE /bots (apps/api/src/router/dashboard.routes.ts#/bots)
- curated_graph_covered: api_endpoint: USE /icons (apps/api/src/router/dashboard.routes.ts#/icons)
- curated_graph_covered: api_endpoint: USE /logs (apps/api/src/router/dashboard.routes.ts#/logs)
- curated_graph_covered: api_endpoint: USE /market-stream (apps/api/src/router/dashboard.routes.ts#/market-stream)
- curated_graph_covered: api_endpoint: USE /markets (apps/api/src/router/dashboard.routes.ts#/markets)
- curated_graph_covered: api_endpoint: USE /orders (apps/api/src/router/dashboard.routes.ts#/orders)
- curated_graph_covered: api_endpoint: USE /positions (apps/api/src/router/dashboard.routes.ts#/positions)
- curated_graph_covered: api_endpoint: USE /profile/apiKeys (apps/api/src/router/dashboard.routes.ts#/profile/apiKeys)
- curated_graph_covered: api_endpoint: USE /profile/basic (apps/api/src/router/dashboard.routes.ts#/profile/basic)
- curated_graph_covered: api_endpoint: USE /profile/security (apps/api/src/router/dashboard.routes.ts#/profile/security)
- curated_graph_covered: api_endpoint: USE /profile/subscription (apps/api/src/router/dashboard.routes.ts#/profile/subscription)
- curated_graph_covered: api_endpoint: USE /reports (apps/api/src/router/dashboard.routes.ts#/reports)
- curated_graph_covered: api_endpoint: USE /strategies (apps/api/src/router/dashboard.routes.ts#/strategies)
- curated_graph_covered: api_endpoint: USE /wallets (apps/api/src/router/dashboard.routes.ts#/wallets)
- curated_graph_covered: api_endpoint: GET / (apps/api/src/router/index.ts#/)
- curated_graph_covered: api_endpoint: USE /admin (apps/api/src/router/index.ts#/admin)
- curated_graph_covered: api_endpoint: USE /auth (apps/api/src/router/index.ts#/auth)
- curated_graph_covered: api_endpoint: USE /dashboard (apps/api/src/router/index.ts#/dashboard)
- curated_graph_covered: api_endpoint: GET /health (apps/api/src/router/index.ts#/health)
- curated_graph_covered: api_endpoint: GET /metrics (apps/api/src/router/index.ts#/metrics)
- curated_graph_covered: api_endpoint: GET /ready (apps/api/src/router/index.ts#/ready)
- curated_graph_covered: api_endpoint: GET /ready/details (apps/api/src/router/index.ts#/ready/details)
- curated_graph_covered: api_endpoint: USE /upload (apps/api/src/router/index.ts#/upload)
- curated_graph_covered: api_endpoint: GET /workers/health (apps/api/src/router/index.ts#/workers/health)
- curated_graph_covered: api_endpoint: GET /workers/ready (apps/api/src/router/index.ts#/workers/ready)
- curated_graph_covered: api_endpoint: GET /workers/runtime-freshness (apps/api/src/router/index.ts#/workers/runtime-freshness)
- curated_graph_covered: component: PasswordVisibilityToggle.tsx (apps/web/src/features/auth/components/PasswordVisibilityToggle.tsx)
- curated_graph_covered: component: backtestRunDetailsCharts.tsx (apps/web/src/features/backtest/components/backtestRunDetailsCharts.tsx)
- curated_graph_covered: component: BacktestRunDetailsTabPanels.tsx (apps/web/src/features/backtest/components/BacktestRunDetailsTabPanels.tsx)
- curated_graph_covered: component: BacktestRunHeaderSection.tsx (apps/web/src/features/backtest/components/BacktestRunHeaderSection.tsx)

## Notes

- This is an inferred baseline. CTO/Docs Memory must promote or correct important relations.
- Curated graph coverage input: `C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-graph.json` (covered paths: 982).
- Override input: `C:/Personal/Projekty/Aplikacje/Soar/docs/architecture/scanner-overrides.json` (entity entries: 0, relation entries: 0).
- Override summary: excluded files 0, entity overrides 0, relation overrides 0, critical entities tagged 0.
- `verified` still requires fresh command/browser/deploy evidence, not only file presence.