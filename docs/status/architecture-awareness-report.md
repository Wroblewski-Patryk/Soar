# Architecture Awareness Report

Generated: 2026-07-14T06:05:04.839Z
Project: Soar
Root: C:/Personal/Projekty/Aplikacje/Soar

## Counts By Type

| Type | Count |
| --- | ---: |
| agent | 52 |
| api_endpoint | 38 |
| component | 97 |
| document | 4894 |
| feature | 216 |
| function | 2845 |
| migration | 57 |
| model | 108 |
| module | 16 |
| project | 1 |
| route | 355 |
| task | 1829 |
| test | 463 |

## Counts By Status

| Status | Count |
| --- | ---: |
| blocked | 47 |
| deprecated | 10 |
| implemented | 8216 |
| in_progress | 15 |
| tested | 849 |
| verified | 1834 |

## Health Signals

- Raw implementation entities without inferred tests: 1276
- Actionable implementation entities without inferred tests: 4
- Raw implementation entities without inferred docs: 299
- Actionable implementation entities without inferred docs: 0
- Classified inferred-link noise: 1488
- Raw tasks without architecture links: 140
- Actionable tasks without architecture links: 0
- Raw implementation entities without task links: 313
- Actionable implementation entities without task links: 0
- Classified task-linkage noise: 453
- Entities without owner attribution: 0
- Disconnected entities: 0

## Top Actionable Missing Test Links

- function: buildLocalReadinessEnv (scripts/dev-backend.mjs#buildLocalReadinessEnv)
- function: hasUsableVersionedKeyring (scripts/dev-backend.mjs#hasUsableVersionedKeyring)
- function: looksWeakSecret (scripts/dev-backend.mjs#looksWeakSecret)
- function: readConfiguredEnvValue (scripts/dev-backend.mjs#readConfiguredEnvValue)

## Top Actionable Missing Doc Links


## Classified Inferred-Link Noise

- config_only_file: 63
- curated_graph_covered: 1305
- test_fixture_function: 119
- top_level_app_mount: 1

## Top Classified Noise Samples

- top_level_app_mount: api_endpoint: USE /avatars (apps/api/src/index.ts#/avatars)
- config_only_file: api_endpoint: USE /webhooks/stripe (apps/api/src/index.ts#/webhooks/stripe)
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
- curated_graph_covered: api_endpoint: USE /dashboard (apps/api/src/router/index.ts#/dashboard)
- curated_graph_covered: api_endpoint: GET /health (apps/api/src/router/index.ts#/health)
- curated_graph_covered: api_endpoint: GET /ready (apps/api/src/router/index.ts#/ready)
- curated_graph_covered: api_endpoint: GET /ready/details (apps/api/src/router/index.ts#/ready/details)
- curated_graph_covered: api_endpoint: USE /upload (apps/api/src/router/index.ts#/upload)
- curated_graph_covered: api_endpoint: GET /workers/health (apps/api/src/router/index.ts#/workers/health)
- curated_graph_covered: api_endpoint: GET /workers/ready (apps/api/src/router/index.ts#/workers/ready)
- curated_graph_covered: api_endpoint: GET /workers/runtime-freshness (apps/api/src/router/index.ts#/workers/runtime-freshness)
- curated_graph_covered: component: backtestRunDetailsCharts.tsx (apps/web/src/features/backtest/components/backtestRunDetailsCharts.tsx)
- curated_graph_covered: component: BacktestRunDetailsTabPanels.tsx (apps/web/src/features/backtest/components/BacktestRunDetailsTabPanels.tsx)
- curated_graph_covered: component: BacktestRunHeaderSection.tsx (apps/web/src/features/backtest/components/BacktestRunHeaderSection.tsx)
- curated_graph_covered: component: BotsManagementTabs.tsx (apps/web/src/features/bots/components/bots-management/BotsManagementTabs.tsx)
- curated_graph_covered: component: BotsMonitoringAttributionPills.tsx (apps/web/src/features/bots/components/bots-management/BotsMonitoringAttributionPills.tsx)
- curated_graph_covered: component: BotsMonitoringProtectionCell.tsx (apps/web/src/features/bots/components/bots-management/BotsMonitoringProtectionCell.tsx)
- curated_graph_covered: component: BotsMonitoringRuntimeStateCell.tsx (apps/web/src/features/bots/components/bots-management/BotsMonitoringRuntimeStateCell.tsx)
- curated_graph_covered: component: BotsMonitoringSections.tsx (apps/web/src/features/bots/components/bots-management/BotsMonitoringSections.tsx)
- curated_graph_covered: component: BotsMonitoringTab.tsx (apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx)

## Classified Task-Linkage Noise

- config_only_file: 33
- curated_graph_covered: 279
- historical_task_archive: 140
- top_level_app_mount: 1

## Top Classified Task-Linkage Noise Samples

- historical_task_archive: task: Task: LOCAL-CERTAINTY-CLOSURE-2026-05-21 (history/tasks/local-certainty-closure-2026-05-21-task.md)
- historical_task_archive: task: Task: Local Integrity Build Sweep (history/tasks/local-integrity-build-sweep-2026-05-24-task.md)
- historical_task_archive: task: LUC-1027-CHILD - Read-only failed deploy diagnosis (2026-05-31) (history/tasks/luc-1027-child-read-only-failed-deploy-diagnosis-2026-05-31-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1042-source-control-closure-luc-1011-luc-1016-luc-1019-luc-1023-plus-7-2026-07-14-task.md)
- historical_task_archive: task: luc-1080-infra-gate-diagnose-production-dns-network-failure-for-luc-241-2026-05-31-task (history/tasks/luc-1080-infra-gate-diagnose-production-dns-network-failure-for-luc-241-2026-05-31-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1148-source-control-closure-comment-followup-2026-05-31-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1148-source-control-closure-finish-successful-run-handoff-2026-05-31-task.md)
- historical_task_archive: task: Task Contract (history/tasks/luc-1148-source-control-closure-issue-continuation-needed-2026-05-31-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1148-source-control-closure-source-scoped-recovery-action-2-2026-05-31-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1148-source-control-closure-source-scoped-recovery-action-2026-05-31-task.md)
- historical_task_archive: task: LUC-1371 Reconcile Coolify Resource Inventory (history/tasks/luc-1371-reconcile-coolify-resource-inventory-2026-06-02-task.md)
- historical_task_archive: task: LUC-15C CTO Lane Child Issue (history/tasks/luc-15-cto-lane-child-2026-05-25-task.md)
- historical_task_archive: task: LUC-15D Docs Lane Child Issue (history/tasks/luc-15-docs-lane-child-2026-05-25-task.md)
- historical_task_archive: task: LUC-15I Implementation Lane Child Issue (history/tasks/luc-15-implementation-lane-child-2026-05-25-task.md)
- historical_task_archive: task: LUC-15O Ops Lane Child Issue (history/tasks/luc-15-ops-lane-child-2026-05-25-task.md)
- historical_task_archive: task: LUC-15P Product Lane Child Issue (history/tasks/luc-15-product-lane-child-2026-05-25-task.md)
- historical_task_archive: task: LUC-15Q QA Lane Child Issue (history/tasks/luc-15-qa-lane-child-2026-05-25-task.md)
- historical_task_archive: task: LUC-15X UX Lane Child Issue (history/tasks/luc-15-ux-lane-child-2026-05-25-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1507-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1518-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1522-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1525-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1529-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1531-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1533-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1537-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1538-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1539-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1543-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1548-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1552-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1553-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1556-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1560-confirm-coolify-team-workspace-binding-2026-06-02-task.md)
- historical_task_archive: task: Task (history/tasks/luc-1564-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: LUC-1574 Confirm Coolify Team Workspace Task (history/tasks/luc-1574-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: LUC-1580 Confirm Coolify Team Workspace Task (history/tasks/luc-1580-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: LUC-1585 Confirm Coolify Team Workspace Task (history/tasks/luc-1585-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: LUC-1592 Confirm Coolify Team Workspace Task (history/tasks/luc-1592-confirm-coolify-team-workspace-2026-06-02-task.md)
- historical_task_archive: task: LUC-1734 Restore Owner Path For Coolify Inventory Lane (history/tasks/luc-1734-restore-owner-path-for-coolify-inventory-lane-2026-06-03-task.md)

## Notes

- This is an inferred baseline. CTO/Docs Memory must promote or correct important relations.
- Curated graph coverage input: `C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-graph.json` (covered paths: 986).
- Override input: `C:/Personal/Projekty/Aplikacje/Soar/docs/architecture/scanner-overrides.json` (entity entries: 43, relation entries: 43).
- Override summary: excluded files 0, entity overrides 43, relation overrides 43, critical entities tagged 0.
- `verified` still requires fresh command/browser/deploy evidence, not only file presence.