# Project Index

Generated at: 2026-05-10T21:18:00.476Z
Evidence date: 2026-05-10

## Purpose

This index is a local, no-network map of the current Soar repository. It is not
V1 approval evidence. Use it as the starting point for module-by-module audits
and fixes.

## V1 Product Action Matrix

Source: `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`

- BLOCKED_AUTH: 2
- PARTIAL_LOCAL: 2
- PASS_LOCAL: 1
- UNVERIFIED: 16

## API Modules

| Module | Route files | Controller files | Service files | Test files | TS files |
| --- | ---: | ---: | ---: | ---: | ---: |
| admin | 2 | 2 | 2 | 2 | 10 |
| auth | 1 | 1 | 2 | 5 | 14 |
| backtests | 1 | 1 | 5 | 12 | 27 |
| bots | 1 | 1 | 51 | 28 | 82 |
| engine | 0 | 0 | 44 | 45 | 105 |
| exchange | 0 | 0 | 34 | 16 | 38 |
| icons | 1 | 1 | 1 | 1 | 5 |
| isolation | 0 | 0 | 0 | 1 | 1 |
| logs | 1 | 1 | 1 | 1 | 5 |
| market-data | 0 | 0 | 4 | 2 | 6 |
| market-stream | 1 | 0 | 4 | 6 | 11 |
| markets | 1 | 1 | 2 | 1 | 7 |
| orders | 1 | 1 | 7 | 10 | 22 |
| pagination | 0 | 0 | 0 | 1 | 1 |
| positions | 1 | 1 | 7 | 11 | 27 |
| profile | 4 | 4 | 6 | 6 | 24 |
| reports | 1 | 1 | 2 | 1 | 4 |
| strategies | 2 | 2 | 3 | 3 | 12 |
| subscriptions | 0 | 0 | 3 | 0 | 8 |
| upload | 1 | 0 | 0 | 1 | 2 |
| users | 0 | 0 | 0 | 0 | 1 |
| wallets | 1 | 1 | 5 | 4 | 11 |

## Web Features

| Feature | Component-like files | Test files | TS/TSX files |
| --- | ---: | ---: | ---: |
| admin | 4 | 2 | 9 |
| auth | 13 | 5 | 15 |
| backtest | 16 | 10 | 29 |
| bots | 19 | 10 | 34 |
| dashboard-home | 35 | 22 | 41 |
| exchanges | 2 | 2 | 4 |
| icons | 0 | 0 | 3 |
| logs | 2 | 1 | 4 |
| markets | 5 | 2 | 8 |
| orders | 0 | 0 | 0 |
| positions | 0 | 0 | 1 |
| profile | 11 | 4 | 21 |
| reports | 2 | 1 | 3 |
| shared | 2 | 2 | 4 |
| strategies | 17 | 10 | 29 |
| wallets | 9 | 3 | 11 |

## Web Routes

- /auth/login (apps/web/src/app/(public)/auth/login/page.tsx)
- /auth/register (apps/web/src/app/(public)/auth/register/page.tsx)
- / (apps/web/src/app/(public)/page.tsx)
- /admin (apps/web/src/app/admin/page.tsx)
- /admin/subscriptions (apps/web/src/app/admin/subscriptions/page.tsx)
- /admin/users (apps/web/src/app/admin/users/page.tsx)
- /dashboard/backtests/[id] (apps/web/src/app/dashboard/backtests/[id]/page.tsx)
- /dashboard/backtests/create (apps/web/src/app/dashboard/backtests/create/page.tsx)
- /dashboard/backtests/list (apps/web/src/app/dashboard/backtests/list/page.tsx)
- /dashboard/bots/[id]/assistant (apps/web/src/app/dashboard/bots/[id]/assistant/page.tsx)
- /dashboard/bots/[id]/edit (apps/web/src/app/dashboard/bots/[id]/edit/page.tsx)
- /dashboard/bots/[id] (apps/web/src/app/dashboard/bots/[id]/page.tsx)
- /dashboard/bots/[id]/preview (apps/web/src/app/dashboard/bots/[id]/preview/page.tsx)
- /dashboard/bots/[id]/runtime (apps/web/src/app/dashboard/bots/[id]/runtime/page.tsx)
- /dashboard/bots/assistant (apps/web/src/app/dashboard/bots/assistant/page.tsx)
- /dashboard/bots/create (apps/web/src/app/dashboard/bots/create/page.tsx)
- /dashboard/bots/new (apps/web/src/app/dashboard/bots/new/page.tsx)
- /dashboard/bots (apps/web/src/app/dashboard/bots/page.tsx)
- /dashboard/bots/runtime (apps/web/src/app/dashboard/bots/runtime/page.tsx)
- /dashboard/exchanges (apps/web/src/app/dashboard/exchanges/page.tsx)
- /dashboard/logs (apps/web/src/app/dashboard/logs/page.tsx)
- /dashboard/markets/[id]/edit (apps/web/src/app/dashboard/markets/[id]/edit/page.tsx)
- /dashboard/markets/create (apps/web/src/app/dashboard/markets/create/page.tsx)
- /dashboard/markets/list (apps/web/src/app/dashboard/markets/list/page.tsx)
- /dashboard (apps/web/src/app/dashboard/page.tsx)
- /dashboard/profile (apps/web/src/app/dashboard/profile/page.tsx)
- /dashboard/reports (apps/web/src/app/dashboard/reports/page.tsx)
- /dashboard/strategies/[id]/edit (apps/web/src/app/dashboard/strategies/[id]/edit/page.tsx)
- /dashboard/strategies/[id] (apps/web/src/app/dashboard/strategies/[id]/page.tsx)
- /dashboard/strategies/create (apps/web/src/app/dashboard/strategies/create/page.tsx)
- /dashboard/strategies/list (apps/web/src/app/dashboard/strategies/list/page.tsx)
- /dashboard/wallets/[id]/edit (apps/web/src/app/dashboard/wallets/[id]/edit/page.tsx)
- /dashboard/wallets/[id] (apps/web/src/app/dashboard/wallets/[id]/page.tsx)
- /dashboard/wallets/[id]/preview (apps/web/src/app/dashboard/wallets/[id]/preview/page.tsx)
- /dashboard/wallets/create (apps/web/src/app/dashboard/wallets/create/page.tsx)
- /dashboard/wallets/list (apps/web/src/app/dashboard/wallets/list/page.tsx)
- /dashboard/wallets (apps/web/src/app/dashboard/wallets/page.tsx)
- /offline (apps/web/src/app/offline/page.tsx)

## Workers

- `apps/api/src/workers/backtest.worker.ts`
- `apps/api/src/workers/execution.worker.ts`
- `apps/api/src/workers/marketData.worker.ts`
- `apps/api/src/workers/marketStream.worker.ts`
- `apps/api/src/workers/marketStreamSubscriptions.service.ts`
- `apps/api/src/workers/marketStreamWorkerConfig.ts`
- `apps/api/src/workers/workerBootstrap.ts`
- `apps/api/src/workers/workerOwnership.ts`

## Test Inventory

- Total test/spec files: 329
- API tests: 180
- Web tests: 147
- Script tests: 2
- Other tests: 0

## Package Scripts

- `api/dev`
- `backend:dev`
- `backend/dev`
- `build`
- `client/dev`
- `docs:parity:check`
- `frontend:dev`
- `frontend/dev`
- `go-live:infra:down`
- `go-live:infra:up`
- `i18n:audit:route-reachable:web`
- `lint`
- `ops:cutover:dry-run`
- `ops:data:backfill:venue-context`
- `ops:data:backfill:venue-context:dry`
- `ops:db:backup-restore:check-local`
- `ops:db:backup-verify`
- `ops:db:backup-verify:local`
- `ops:db:backup-verify:prod`
- `ops:db:backup-verify:stage`
- `ops:db:restore-drill`
- `ops:db:restore-drill:local`
- `ops:db:restore-drill:prod`
- `ops:db:restore-drill:stage`
- `ops:deploy:rollback-guard`
- `ops:deploy:rollback-proof`
- `ops:deploy:rollback-proof:prod`
- `ops:deploy:rollback-proof:stage`
- `ops:deploy:runtime-freshness`
- `ops:deploy:smoke`
- `ops:deploy:wait-web-build-info`
- `ops:exchange:gateio-market-stream-smoke`
- `ops:live:controlled-proof`
- `ops:liveimport:readback`
- `ops:project:index`
- `ops:rc:checklist:sync`
- `ops:rc:gates:evidence:check`
- `ops:rc:gates:evidence:check:strict:prod`
- `ops:rc:gates:local-pipeline`
- `ops:rc:gates:local-pipeline:strict`
- `ops:rc:gates:local-pipeline:strict:prod`
- `ops:rc:gates:prod-pipeline`
- `ops:rc:gates:refresh`
- `ops:rc:gates:refresh:strict`
- `ops:rc:gates:refresh:strict:prod`
- `ops:rc:gates:refresh:summary`
- `ops:rc:gates:refresh:summary:strict`
- `ops:rc:gates:refresh:summary:strict:prod`
- `ops:rc:gates:status`
- `ops:rc:gates:summary`
- `ops:rc:signoff:build`
- `ops:release:v1:gate`
- `ops:release:v1:preflight`
- `ops:release:v1:stage-rehearsal`
- `ops:slo:collect`
- `ops:slo:window-report`
- `ops:ui:prod-clickthrough`
- `prod-like:start`
- `prod-like/start`
- `quality:guardrails`
- `server/dev`
- `test`
- `test:bot:v2:baseline`
- `test:go-live:api`
- `test:go-live:api:with-infra`
- `test:go-live:client`
- `test:go-live:server`
- `test:go-live:server:with-infra`
- `test:go-live:smoke`
- `test:go-live:web`
- `typecheck`
- `web:verify:build-typecheck`
- `web/dev`
- `workers:dev`
- `workers:prod`
- `workers/dev`
- `workers/prod`

## Open Queue Markers

Showing up to 40 unchecked markers from the canonical queue sources.

- .codex/context/TASK_BOARD.md:91 - [ ] `CONTROLLED-LIVE-SESSION-PROOF-2026-05-10 release: capture guarded LIVE runtime session readback`
- .codex/context/TASK_BOARD.md:946 - [ ] `PROD-UI-AUDIT-PLAN-2026-05-08 qa: execute production UI module clickthrough audit`
- .codex/context/TASK_BOARD.md:1118 - [ ] `V1-PROTECTED-ACCESS-READINESS-2026-05-09 release: provide protected final evidence inputs`
- .codex/context/TASK_BOARD.md:4601 - [ ] `LIVEIMPORT-03 release(prod): read back imported ETH/DOGE provenance on current production`
- .codex/context/TASK_BOARD.md:4636 - [ ] `BOTMULTI-09 release(prod): promote multi-strategy runtime topology to production`
- .codex/context/TASK_BOARD.md:6115 - [ ] (none)
- .codex/context/TASK_BOARD.md:6133 - [ ] (none)
- docs/planning/mvp-next-commits.md:37 - [ ] `CONTROLLED-LIVE-SESSION-PROOF-2026-05-10 release: capture guarded LIVE runtime session readback`
- docs/planning/mvp-next-commits.md:773 - [ ] `PROD-UI-AUDIT-PLAN-2026-05-08 qa: execute production UI module clickthrough audit`
- docs/planning/mvp-next-commits.md:1141 - [ ] `V1-PROTECTED-ACCESS-READINESS-2026-05-09 release: provide protected final evidence inputs`
- docs/planning/mvp-next-commits.md:4094 - [ ] `LIVEIMPORT-03 release(prod): read back imported ETH/DOGE provenance on current production`
- docs/planning/mvp-next-commits.md:4124 - [ ] `BOTMULTI-09 release(prod): promote multi-strategy runtime topology to production`

## Architecture And Module Sources

- `docs/architecture/01_overview-and-principles.md`
- `docs/architecture/02_system-topology.md`
- `docs/architecture/03_domain-model.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/05_strategy-signal-and-decision-flow.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/07_modes-parity-and-data.md`
- `docs/architecture/08_operator-surfaces-and-routing.md`
- `docs/architecture/09_integrations-deployment-and-runtime-services.md`
- `docs/architecture/10_safety-entitlements-and-risk.md`
- `docs/architecture/11_assistant-runtime.md`
- `docs/architecture/12_documentation-governance.md`
- `docs/architecture/architecture-source-of-truth.md`
- `docs/architecture/archive/architecture-maintainability-closure-2026-04-19.md`
- `docs/architecture/archive/bot-v2-create-update-contract.md`
- `docs/architecture/archive/database.md`
- `docs/architecture/archive/legacy-cryptobot-positions-analysis.md`
- `docs/architecture/archive/modules.md`
- `docs/architecture/archive/post-remediation-architecture-delta-2026-04-09.md`
- `docs/architecture/archive/README.md`
- `docs/architecture/archive/runtime-critical-path-decomposition-contract.md`
- `docs/architecture/archive/system-architecture.md`
- `docs/architecture/archive/tech-stack.md`
- `docs/architecture/archive/trading-logic.md`
- `docs/architecture/codebase-map.md`
- `docs/architecture/README.md`
- `docs/architecture/reference/admin-frontend-architecture.md`
- `docs/architecture/reference/app-shell-template-split-contract.md`
- `docs/architecture/reference/assistant-runtime-contract.md`
- `docs/architecture/reference/coin-icon-source-contract.md`
- `docs/architecture/reference/dashboard-loading-ux-contract.md`
- `docs/architecture/reference/dashboard-route-map.md`
- `docs/architecture/reference/dashboard-signal-panel-ia-contract.md`
- `docs/architecture/reference/dashboard-trade-history-financial-semantics-contract.md`
- `docs/architecture/reference/dca-ladder-display-contract.md`
- `docs/architecture/reference/dynamic-stop-display-contract.md`
- `docs/architecture/reference/exchange-access-ownership-matrix.md`
- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- `docs/architecture/reference/indicator-registry-parity-contract.md`
- `docs/architecture/reference/live-exchange-protection-order-contract.md`
- `docs/architecture/reference/live-fee-reconciliation-contract.md`
- `docs/architecture/reference/live-futures-lifecycle-price-contract.md`
- `docs/architecture/reference/live-paper-runtime-safety-contract.md`
- `docs/architecture/reference/live-position-restart-continuity-contract.md`
- `docs/architecture/reference/live-protection-state-parity-contract.md`
- `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`
- `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md`
- `docs/architecture/reference/maintainability-remediation-contract.md`
- `docs/architecture/reference/numeric-input-policy.md`
- `docs/architecture/reference/position-close-attribution-contract.md`
- `docs/architecture/reference/position-lifecycle-parity-matrix.md`
- `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`
- `docs/architecture/reference/README.md`
- `docs/architecture/reference/runtime-execution-idempotency-contract.md`
- `docs/architecture/reference/runtime-signal-merge-contract.md`
- `docs/architecture/reference/scalability-anti-drift-delivery-contract.md`
- `docs/architecture/reference/strategy-evaluation-parity-contract.md`
- `docs/architecture/reference/stream-transport-contract.md`
- `docs/architecture/reference/subscription-tier-entitlements-contract.md`
- `docs/architecture/reference/v1-production-activation-contract.md`
- `docs/architecture/reference/venue-context-source-of-truth-contract.md`
- `docs/architecture/reference/wallet-source-of-truth-contract.md`
- `docs/architecture/reference/web-container-split-contract.md`
- `docs/architecture/traceability-matrix.md`
- `docs/modules/api-admin.md`
- `docs/modules/api-auth.md`
- `docs/modules/api-backtests.md`
- `docs/modules/api-bots.md`
- `docs/modules/api-engine.md`
- `docs/modules/api-exchange.md`
- `docs/modules/api-icons.md`
- `docs/modules/api-isolation.md`
- `docs/modules/api-logs.md`
- `docs/modules/api-market-data.md`
- `docs/modules/api-market-stream.md`
- `docs/modules/api-markets.md`
- `docs/modules/api-orders.md`
- `docs/modules/api-pagination.md`
- `docs/modules/api-positions.md`
- `docs/modules/api-profile.md`
- `docs/modules/api-reports.md`
- `docs/modules/api-strategies.md`
- `docs/modules/api-subscriptions.md`
- `docs/modules/api-upload.md`
- `docs/modules/api-users.md`
- `docs/modules/api-wallets.md`
- `docs/modules/code-quality-maintainability-inventory-2026-04-21.md`
- `docs/modules/documentation-coverage-audit-2026-04-12.md`
- `docs/modules/index.md`
- `docs/modules/module-deep-dive-template.md`
- `docs/modules/module-doc-status-index.md`
- `docs/modules/README.md`
- `docs/modules/system-modules.md`
- `docs/modules/web-admin.md`
- `docs/modules/web-auth.md`
- `docs/modules/web-backtest.md`
- `docs/modules/web-bots.md`
- `docs/modules/web-dashboard-home.md`
- `docs/modules/web-exchanges.md`
- `docs/modules/web-icons.md`
- `docs/modules/web-logs.md`
- `docs/modules/web-markets.md`
- `docs/modules/web-orders.md`
- `docs/modules/web-positions.md`
- `docs/modules/web-profile.md`
- `docs/modules/web-reports.md`
- `docs/modules/web-shared.md`
- `docs/modules/web-strategies.md`
- `docs/modules/web-wallets.md`

## Use In Next Work

1. Pick one V1 matrix row that is not `PASS`.
2. Use this index to find the matching API module, Web feature, route, tests,
   and worker surface.
3. Add focused evidence before calling the row complete.
4. Update the V1 matrix and task/context state after the slice.
