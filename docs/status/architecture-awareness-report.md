# Architecture Awareness Report

Generated: 2026-05-26T02:15:14.125Z
Project: Soar
Root: C:/Personal/Projekty/Aplikacje/Soar

## Counts By Type

| Type | Count |
| --- | ---: |
| agent | 65 |
| api_endpoint | 167 |
| component | 97 |
| document | 2706 |
| feature | 211 |
| function | 2603 |
| migration | 56 |
| model | 106 |
| module | 17 |
| project | 1 |
| route | 346 |
| task | 516 |
| test | 363 |

## Counts By Status

| Status | Count |
| --- | ---: |
| blocked | 477 |
| deprecated | 7 |
| implemented | 5631 |
| in_progress | 9 |
| tested | 624 |
| verified | 506 |

## Health Signals

- Implementation entities without inferred tests: 2181
- Implementation entities without inferred docs: 927
- Disconnected entities: 0

## Top Missing Test Links

- api_endpoint: USE /avatars (apps/api/src/index.ts#/avatars)
- api_endpoint: GET / (apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.routes.ts#/)
- api_endpoint: PUT /:code (apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.routes.ts#/:code)
- api_endpoint: GET / (apps/api/src/modules/admin/users/users.routes.ts#/)
- api_endpoint: PATCH /:userId (apps/api/src/modules/admin/users/users.routes.ts#/:userId)
- api_endpoint: POST /login (apps/api/src/modules/auth/auth.routes.ts#/login)
- api_endpoint: POST /logout (apps/api/src/modules/auth/auth.routes.ts#/logout)
- api_endpoint: GET /me (apps/api/src/modules/auth/auth.routes.ts#/me)
- api_endpoint: POST /register (apps/api/src/modules/auth/auth.routes.ts#/register)
- api_endpoint: GET /runs (apps/api/src/modules/backtests/backtests.routes.ts#/runs)
- api_endpoint: POST /runs (apps/api/src/modules/backtests/backtests.routes.ts#/runs)
- api_endpoint: GET /runs/:id (apps/api/src/modules/backtests/backtests.routes.ts#/runs/:id)
- api_endpoint: DELETE /runs/:id (apps/api/src/modules/backtests/backtests.routes.ts#/runs/:id)
- api_endpoint: GET /runs/:id/report (apps/api/src/modules/backtests/backtests.routes.ts#/runs/:id/report)
- api_endpoint: GET /runs/:id/timeline (apps/api/src/modules/backtests/backtests.routes.ts#/runs/:id/timeline)
- api_endpoint: GET /runs/:id/trades (apps/api/src/modules/backtests/backtests.routes.ts#/runs/:id/trades)
- api_endpoint: POST /auth/register (apps/api/src/modules/bots/bots.e2e.shared.ts#/auth/register)
- api_endpoint: POST /dashboard/strategies (apps/api/src/modules/bots/bots.e2e.shared.ts#/dashboard/strategies)
- api_endpoint: GET / (apps/api/src/modules/bots/bots.routes.ts#/)
- api_endpoint: POST / (apps/api/src/modules/bots/bots.routes.ts#/)
- api_endpoint: GET /:id (apps/api/src/modules/bots/bots.routes.ts#/:id)
- api_endpoint: PUT /:id (apps/api/src/modules/bots/bots.routes.ts#/:id)
- api_endpoint: DELETE /:id (apps/api/src/modules/bots/bots.routes.ts#/:id)
- api_endpoint: GET /:id/assistant-config (apps/api/src/modules/bots/bots.routes.ts#/:id/assistant-config)
- api_endpoint: PUT /:id/assistant-config (apps/api/src/modules/bots/bots.routes.ts#/:id/assistant-config)
- api_endpoint: POST /:id/assistant-config/dry-run (apps/api/src/modules/bots/bots.routes.ts#/:id/assistant-config/dry-run)
- api_endpoint: PUT /:id/assistant-config/subagents/:slotIndex (apps/api/src/modules/bots/bots.routes.ts#/:id/assistant-config/subagents/:slotIndex)
- api_endpoint: DELETE /:id/assistant-config/subagents/:slotIndex (apps/api/src/modules/bots/bots.routes.ts#/:id/assistant-config/subagents/:slotIndex)
- api_endpoint: GET /:id/market-groups (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups)
- api_endpoint: POST /:id/market-groups (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups)
- api_endpoint: GET /:id/market-groups/:groupId (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId)
- api_endpoint: PUT /:id/market-groups/:groupId (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId)
- api_endpoint: DELETE /:id/market-groups/:groupId (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId)
- api_endpoint: GET /:id/market-groups/:groupId/strategies (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId/strategies)
- api_endpoint: POST /:id/market-groups/:groupId/strategies (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId/strategies)
- api_endpoint: PUT /:id/market-groups/:groupId/strategies/:linkId (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId/strategies/:linkId)
- api_endpoint: DELETE /:id/market-groups/:groupId/strategies/:linkId (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId/strategies/:linkId)
- api_endpoint: PUT /:id/market-groups/:groupId/strategies/reorder (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId/strategies/reorder)
- api_endpoint: GET /:id/portfolio-history (apps/api/src/modules/bots/bots.routes.ts#/:id/portfolio-history)
- api_endpoint: GET /:id/runtime-graph (apps/api/src/modules/bots/bots.routes.ts#/:id/runtime-graph)

## Top Missing Doc Links

- api_endpoint: USE /avatars (apps/api/src/index.ts#/avatars)
- api_endpoint: GET / (apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.routes.ts#/)
- api_endpoint: PUT /:code (apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.routes.ts#/:code)
- api_endpoint: GET / (apps/api/src/modules/admin/users/users.routes.ts#/)
- api_endpoint: PATCH /:userId (apps/api/src/modules/admin/users/users.routes.ts#/:userId)
- api_endpoint: POST /login (apps/api/src/modules/auth/auth.routes.ts#/login)
- api_endpoint: POST /logout (apps/api/src/modules/auth/auth.routes.ts#/logout)
- api_endpoint: GET /me (apps/api/src/modules/auth/auth.routes.ts#/me)
- api_endpoint: POST /register (apps/api/src/modules/auth/auth.routes.ts#/register)
- api_endpoint: GET /runs (apps/api/src/modules/backtests/backtests.routes.ts#/runs)
- api_endpoint: POST /runs (apps/api/src/modules/backtests/backtests.routes.ts#/runs)
- api_endpoint: GET /runs/:id (apps/api/src/modules/backtests/backtests.routes.ts#/runs/:id)
- api_endpoint: DELETE /runs/:id (apps/api/src/modules/backtests/backtests.routes.ts#/runs/:id)
- api_endpoint: GET /runs/:id/report (apps/api/src/modules/backtests/backtests.routes.ts#/runs/:id/report)
- api_endpoint: GET /runs/:id/timeline (apps/api/src/modules/backtests/backtests.routes.ts#/runs/:id/timeline)
- api_endpoint: GET /runs/:id/trades (apps/api/src/modules/backtests/backtests.routes.ts#/runs/:id/trades)
- api_endpoint: POST /auth/register (apps/api/src/modules/bots/bots.e2e.shared.ts#/auth/register)
- api_endpoint: POST /dashboard/strategies (apps/api/src/modules/bots/bots.e2e.shared.ts#/dashboard/strategies)
- api_endpoint: GET / (apps/api/src/modules/bots/bots.routes.ts#/)
- api_endpoint: POST / (apps/api/src/modules/bots/bots.routes.ts#/)
- api_endpoint: GET /:id (apps/api/src/modules/bots/bots.routes.ts#/:id)
- api_endpoint: PUT /:id (apps/api/src/modules/bots/bots.routes.ts#/:id)
- api_endpoint: DELETE /:id (apps/api/src/modules/bots/bots.routes.ts#/:id)
- api_endpoint: GET /:id/assistant-config (apps/api/src/modules/bots/bots.routes.ts#/:id/assistant-config)
- api_endpoint: PUT /:id/assistant-config (apps/api/src/modules/bots/bots.routes.ts#/:id/assistant-config)
- api_endpoint: POST /:id/assistant-config/dry-run (apps/api/src/modules/bots/bots.routes.ts#/:id/assistant-config/dry-run)
- api_endpoint: PUT /:id/assistant-config/subagents/:slotIndex (apps/api/src/modules/bots/bots.routes.ts#/:id/assistant-config/subagents/:slotIndex)
- api_endpoint: DELETE /:id/assistant-config/subagents/:slotIndex (apps/api/src/modules/bots/bots.routes.ts#/:id/assistant-config/subagents/:slotIndex)
- api_endpoint: GET /:id/market-groups (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups)
- api_endpoint: POST /:id/market-groups (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups)
- api_endpoint: GET /:id/market-groups/:groupId (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId)
- api_endpoint: PUT /:id/market-groups/:groupId (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId)
- api_endpoint: DELETE /:id/market-groups/:groupId (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId)
- api_endpoint: GET /:id/market-groups/:groupId/strategies (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId/strategies)
- api_endpoint: POST /:id/market-groups/:groupId/strategies (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId/strategies)
- api_endpoint: PUT /:id/market-groups/:groupId/strategies/:linkId (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId/strategies/:linkId)
- api_endpoint: DELETE /:id/market-groups/:groupId/strategies/:linkId (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId/strategies/:linkId)
- api_endpoint: PUT /:id/market-groups/:groupId/strategies/reorder (apps/api/src/modules/bots/bots.routes.ts#/:id/market-groups/:groupId/strategies/reorder)
- api_endpoint: GET /:id/portfolio-history (apps/api/src/modules/bots/bots.routes.ts#/:id/portfolio-history)
- api_endpoint: GET /:id/runtime-graph (apps/api/src/modules/bots/bots.routes.ts#/:id/runtime-graph)

## Notes

- This is an inferred baseline. CTO/Docs Memory must promote or correct important relations.
- `verified` still requires fresh command/browser/deploy evidence, not only file presence.