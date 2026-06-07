# Architecture Awareness Report

Generated: 2026-06-07T09:34:54.277Z
Project: Soar
Root: C:/Personal/Projekty/Aplikacje/Soar

## Counts By Type

| Type | Count |
| --- | ---: |
| agent | 52 |
| api_endpoint | 37 |
| component | 97 |
| document | 3811 |
| feature | 225 |
| function | 8349 |
| migration | 56 |
| model | 277 |
| module | 15 |
| project | 1 |
| route | 352 |
| task | 1195 |
| test | 413 |

## Counts By Status

| Status | Count |
| --- | ---: |
| blocked | 26 |
| deprecated | 7 |
| implemented | 12925 |
| in_progress | 10 |
| tested | 734 |
| verified | 1178 |

## Health Signals

- Raw implementation entities without inferred tests: 7249
- Actionable implementation entities without inferred tests: 396
- Raw implementation entities without inferred docs: 737
- Actionable implementation entities without inferred docs: 0
- Classified inferred-link noise: 7435
- Entities without owner attribution: 0
- Disconnected entities: 0

## Top Actionable Missing Test Links

- function: assertOptions (scripts/collectLiveImportReadbackEvidence.mjs#assertOptions)
- function: collectAllPositions (scripts/collectLiveImportReadbackEvidence.mjs#collectAllPositions)
- function: collectSymbolPositions (scripts/collectLiveImportReadbackEvidence.mjs#collectSymbolPositions)
- function: discoverBots (scripts/collectLiveImportReadbackEvidence.mjs#discoverBots)
- function: discoverSymbolsFromRuntimeReadback (scripts/collectLiveImportReadbackEvidence.mjs#discoverSymbolsFromRuntimeReadback)
- function: fetchJson (scripts/collectLiveImportReadbackEvidence.mjs#fetchJson)
- function: hashId (scripts/collectLiveImportReadbackEvidence.mjs#hashId)
- function: main (scripts/collectLiveImportReadbackEvidence.mjs#main)
- function: normalizeBaseUrl (scripts/collectLiveImportReadbackEvidence.mjs#normalizeBaseUrl)
- function: normalizeSymbol (scripts/collectLiveImportReadbackEvidence.mjs#normalizeSymbol)
- function: printUsage (scripts/collectLiveImportReadbackEvidence.mjs#printUsage)
- function: readArgValue (scripts/collectLiveImportReadbackEvidence.mjs#readArgValue)
- function: redactBot (scripts/collectLiveImportReadbackEvidence.mjs#redactBot)
- function: redactPosition (scripts/collectLiveImportReadbackEvidence.mjs#redactPosition)
- function: redactSession (scripts/collectLiveImportReadbackEvidence.mjs#redactSession)
- function: resolveBuildInfo (scripts/collectLiveImportReadbackEvidence.mjs#resolveBuildInfo)
- function: resolveOptions (scripts/collectLiveImportReadbackEvidence.mjs#resolveOptions)
- function: resolveSession (scripts/collectLiveImportReadbackEvidence.mjs#resolveSession)
- function: splitCsv (scripts/collectLiveImportReadbackEvidence.mjs#splitCsv)
- function: assertOptions (scripts/collectNonGateioRuntimeReadback.mjs#assertOptions)
- function: fetchJson (scripts/collectNonGateioRuntimeReadback.mjs#fetchJson)
- function: hash (scripts/collectNonGateioRuntimeReadback.mjs#hash)
- function: main (scripts/collectNonGateioRuntimeReadback.mjs#main)
- function: normalizeBaseUrl (scripts/collectNonGateioRuntimeReadback.mjs#normalizeBaseUrl)
- function: readArgValue (scripts/collectNonGateioRuntimeReadback.mjs#readArgValue)
- function: safeNumber (scripts/collectNonGateioRuntimeReadback.mjs#safeNumber)
- function: summarizeAggregate (scripts/collectNonGateioRuntimeReadback.mjs#summarizeAggregate)
- function: summarizeBot (scripts/collectNonGateioRuntimeReadback.mjs#summarizeBot)
- function: summarizeSession (scripts/collectNonGateioRuntimeReadback.mjs#summarizeSession)
- function: computeSummary (scripts/collectSloEvidence.mjs#computeSummary)
- function: endpointSamples (scripts/collectSloEvidence.mjs#endpointSamples)
- function: evaluateObjective (scripts/collectSloEvidence.mjs#evaluateObjective)
- function: isLocalOrPrivateHost (scripts/collectSloEvidence.mjs#isLocalOrPrivateHost)
- function: isPrivateIpv4 (scripts/collectSloEvidence.mjs#isPrivateIpv4)
- function: main (scripts/collectSloEvidence.mjs#main)
- function: normalizeEnvironment (scripts/collectSloEvidence.mjs#normalizeEnvironment)
- function: normalizeTargetProfile (scripts/collectSloEvidence.mjs#normalizeTargetProfile)
- function: parseArgs (scripts/collectSloEvidence.mjs#parseArgs)
- function: parseBaseUrl (scripts/collectSloEvidence.mjs#parseBaseUrl)
- function: parseBoolean (scripts/collectSloEvidence.mjs#parseBoolean)

## Top Actionable Missing Doc Links


## Classified Inferred-Link Noise

- config_only_file: 65
- curated_graph_covered: 1515
- generated_vendor_docs_vault_plugin: 5775
- test_fixture_function: 79
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