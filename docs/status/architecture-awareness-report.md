# Architecture Awareness Report

Generated: 2026-06-05T12:40:45.169Z
Project: Soar
Root: C:/Personal/Projekty/Aplikacje/Soar

## Counts By Type

| Type | Count |
| --- | ---: |
| agent | 52 |
| api_endpoint | 37 |
| component | 97 |
| document | 3554 |
| feature | 223 |
| function | 8283 |
| migration | 56 |
| model | 276 |
| module | 15 |
| project | 1 |
| route | 346 |
| task | 1005 |
| test | 377 |

## Counts By Status

| Status | Count |
| --- | ---: |
| blocked | 19 |
| deprecated | 7 |
| implemented | 12640 |
| in_progress | 9 |
| tested | 654 |
| verified | 993 |

## Health Signals

- Raw implementation entities without inferred tests: 7654
- Actionable implementation entities without inferred tests: 859
- Raw implementation entities without inferred docs: 738
- Actionable implementation entities without inferred docs: 0
- Classified inferred-link noise: 7377
- Entities without owner attribution: 0
- Disconnected entities: 0

## Top Actionable Missing Test Links

- feature: runProdUxA11yMobileProof.mjs (scripts/runProdUxA11yMobileProof.mjs)
- feature: runQaRepeatableSmokeE2e.mjs (scripts/runQaRepeatableSmokeE2e.mjs)
- feature: runRcRefreshSummaryStrict.mjs (scripts/runRcRefreshSummaryStrict.mjs)
- feature: runRestoreDrillEvidence.mjs (scripts/runRestoreDrillEvidence.mjs)
- feature: runRollbackProofEvidence.mjs (scripts/runRollbackProofEvidence.mjs)
- feature: runV1StaticIssueScan.mjs (scripts/runV1StaticIssueScan.mjs)
- feature: start-local-prod-like.mjs (scripts/start-local-prod-like.mjs)
- feature: start-workers-prod.mjs (scripts/start-workers-prod.mjs)
- feature: summarizeRcGates.mjs (scripts/summarizeRcGates.mjs)
- feature: syncRcChecklistFromGateStatus.mjs (scripts/syncRcChecklistFromGateStatus.mjs)
- feature: triageJourneyEvidence.mjs (scripts/triageJourneyEvidence.mjs)
- feature: verifyLocalBackupRestore.mjs (scripts/verifyLocalBackupRestore.mjs)
- feature: writeWebBuildMetadata.mjs (scripts/writeWebBuildMetadata.mjs)
- function: main (apps/api/prisma/seed.ts#main)
- function: buildRunInputs (apps/api/scripts/assistant-load-benchmark.ts#buildRunInputs)
- function: percentile (apps/api/scripts/assistant-load-benchmark.ts#percentile)
- function: run (apps/api/scripts/assistant-load-benchmark.ts#run)
- function: run (apps/api/scripts/backfillBacktestVenueContext.ts#run)
- function: buildArtifactDir (apps/api/scripts/bot-v2-preflight-report.ts#buildArtifactDir)
- function: main (apps/api/scripts/bot-v2-preflight-report.ts#main)
- function: nowStamp (apps/api/scripts/bot-v2-preflight-report.ts#nowStamp)
- function: renderMarkdown (apps/api/scripts/bot-v2-preflight-report.ts#renderMarkdown)
- function: toIso (apps/api/scripts/bot-v2-preflight-report.ts#toIso)
- function: main (apps/api/scripts/exportPaperRuntimeSnapshot.ts#main)
- function: toIso (apps/api/scripts/exportPaperRuntimeSnapshot.ts#toIso)
- function: buildMarkdown (apps/api/scripts/gateioMarketStreamSourceSmoke.ts#buildMarkdown)
- function: normalizeOutputPath (apps/api/scripts/gateioMarketStreamSourceSmoke.ts#normalizeOutputPath)
- function: run (apps/api/scripts/gateioMarketStreamSourceSmoke.ts#run)
- function: ensureUser (apps/api/scripts/importPaperRuntimeSnapshot.ts#ensureUser)
- function: main (apps/api/scripts/importPaperRuntimeSnapshot.ts#main)
- function: percentile (apps/api/scripts/load-test.mjs#percentile)
- function: runWorker (apps/api/scripts/load-test.mjs#runWorker)
- function: forwardSignal (apps/api/scripts/start-with-migrate.mjs#forwardSignal)
- function: runMigrations (apps/api/scripts/start-with-migrate.mjs#runMigrations)
- function: main (apps/api/scripts/verifyWalletDbFoundation.ts#main)
- function: readCount (apps/api/scripts/verifyWalletDbFoundation.ts#readCount)
- function: toStamp (apps/api/scripts/verifyWalletDbFoundation.ts#toStamp)
- function: getSessionJwtExpiresIn (apps/api/src/modules/auth/auth.session.ts#getSessionJwtExpiresIn)
- function: getSessionTtlMs (apps/api/src/modules/auth/auth.session.ts#getSessionTtlMs)
- function: createPayload (apps/api/src/modules/bots/bots.e2e.shared.ts#createPayload)

## Top Actionable Missing Doc Links


## Classified Inferred-Link Noise

- config_only_file: 65
- curated_graph_covered: 1536
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
- Curated graph coverage input: `C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-graph.json` (covered paths: 976).
- Override input: `C:/Personal/Projekty/Aplikacje/Soar/docs/architecture/scanner-overrides.json` (entity entries: 0, relation entries: 0).
- Override summary: excluded files 0, entity overrides 0, relation overrides 0, critical entities tagged 0.
- `verified` still requires fresh command/browser/deploy evidence, not only file presence.