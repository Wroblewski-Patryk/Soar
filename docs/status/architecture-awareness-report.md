# Architecture Awareness Report

Generated: 2026-06-11T22:16:05.784Z
Project: Soar
Root: C:/Personal/Projekty/Aplikacje/Soar

## Counts By Type

| Type | Count |
| --- | ---: |
| agent | 52 |
| api_endpoint | 37 |
| component | 97 |
| document | 4001 |
| feature | 217 |
| function | 2801 |
| migration | 56 |
| model | 108 |
| module | 16 |
| project | 1 |
| route | 352 |
| task | 1368 |
| test | 446 |

## Counts By Status

| Status | Count |
| --- | ---: |
| blocked | 26 |
| deprecated | 9 |
| implemented | 7343 |
| in_progress | 12 |
| tested | 813 |
| verified | 1349 |

## Health Signals

- Raw implementation entities without inferred tests: 1327
- Actionable implementation entities without inferred tests: 42
- Raw implementation entities without inferred docs: 312
- Actionable implementation entities without inferred docs: 0
- Classified inferred-link noise: 1513
- Entities without owner attribution: 0
- Disconnected entities: 0

## Top Actionable Missing Test Links

- function: createPage (scripts/runLocalProtectedRouteActionProof.mjs#createPage)
- function: launchBrowser (scripts/runLocalProtectedRouteActionProof.mjs#launchBrowser)
- function: main (scripts/runLocalProtectedRouteActionProof.mjs#main)
- function: startWebServer (scripts/runLocalProtectedRouteActionProof.mjs#startWebServer)
- function: createPage (scripts/runProdAuthSessionBrowserProof.mjs#createPage)
- function: launchBrowser (scripts/runProdAuthSessionBrowserProof.mjs#launchBrowser)
- function: main (scripts/runProdAuthSessionBrowserProof.mjs#main)
- function: captureScreenshot (scripts/runProdUxA11yMobileProof.mjs#captureScreenshot)
- function: clickMobileMenu (scripts/runProdUxA11yMobileProof.mjs#clickMobileMenu)
- function: collectPageCheck (scripts/runProdUxA11yMobileProof.mjs#collectPageCheck)
- function: createPage (scripts/runProdUxA11yMobileProof.mjs#createPage)
- function: evaluate (scripts/runProdUxA11yMobileProof.mjs#evaluate)
- function: isVisible (scripts/runProdUxA11yMobileProof.mjs#isVisible)
- function: launchBrowser (scripts/runProdUxA11yMobileProof.mjs#launchBrowser)
- function: navigate (scripts/runProdUxA11yMobileProof.mjs#navigate)
- function: renderMarkdown (scripts/runProdUxA11yMobileProof.mjs#renderMarkdown)
- function: setAuthCookie (scripts/runProdUxA11yMobileProof.mjs#setAuthCookie)
- function: setViewport (scripts/runProdUxA11yMobileProof.mjs#setViewport)
- function: summarizeBadEvents (scripts/runProdUxA11yMobileProof.mjs#summarizeBadEvents)
- function: wait (scripts/runProdUxA11yMobileProof.mjs#wait)
- function: createPage (scripts/runPublicReadOnlyBrowserProof.mjs#createPage)
- function: killProcessTree (scripts/runPublicReadOnlyBrowserProof.mjs#killProcessTree)
- function: launchBrowser (scripts/runPublicReadOnlyBrowserProof.mjs#launchBrowser)
- function: argValue (scripts/triageJourneyEvidence.mjs#argValue)
- function: main (scripts/triageJourneyEvidence.mjs#main)
- function: matches (scripts/triageJourneyEvidence.mjs#matches)
- function: normalize (scripts/triageJourneyEvidence.mjs#normalize)
- function: parseCsv (scripts/triageJourneyEvidence.mjs#parseCsv)
- function: printList (scripts/triageJourneyEvidence.mjs#printList)
- function: readCsv (scripts/triageJourneyEvidence.mjs#readCsv)
- function: splitRefs (scripts/triageJourneyEvidence.mjs#splitRefs)
- function: detectPostgresContainer (scripts/verifyLocalBackupRestore.mjs#detectPostgresContainer)
- function: dockerExecSh (scripts/verifyLocalBackupRestore.mjs#dockerExecSh)
- function: main (scripts/verifyLocalBackupRestore.mjs#main)
- function: normalizeIdSuffix (scripts/verifyLocalBackupRestore.mjs#normalizeIdSuffix)
- function: nowStamp (scripts/verifyLocalBackupRestore.mjs#nowStamp)
- function: parseArgs (scripts/verifyLocalBackupRestore.mjs#parseArgs)
- function: push (scripts/verifyLocalBackupRestore.mjs#push)
- function: run (scripts/verifyLocalBackupRestore.mjs#run)
- function: sleep (scripts/waitForWebBuildInfo.mjs#sleep)

## Top Actionable Missing Doc Links


## Classified Inferred-Link Noise

- config_only_file: 63
- curated_graph_covered: 1332
- test_fixture_function: 117
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