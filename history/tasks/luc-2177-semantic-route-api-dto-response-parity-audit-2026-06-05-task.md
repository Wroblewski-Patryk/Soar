# Task

## Header
- ID: LUC-2177
- Title: Audit semantic route/API DTO and response parity beyond inventory coverage
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Backend API Engineer
- Depends on: [LUC-2172](/LUC/issues/LUC-2172), [LUC-2107](/LUC/issues/LUC-2107)
- Priority: P2
- Module Confidence Rows: `LUC-2177-SEMANTIC-API-PARITY-AUDIT-2026-06-05`
- Requirement Rows: route/API semantic contract parity audit
- Quality Scenario Rows: backend contract drift prevention
- Risk Rows: semantic DTO/response drift
- Iteration: 2026-06-05
- Operation Mode: BUILDER
- Mission ID: `LUC-2177-SEMANTIC-API-PARITY-AUDIT-2026-06-05`
- Mission Status: VERIFIED

## Context
[LUC-2177](/LUC/issues/LUC-2177) comes from parent [LUC-2172](/LUC/issues/LUC-2172) and the [LUC-2107](/LUC/issues/LUC-2107) finding that generated route/API inventory parity is verified while semantic DTO and response-body parity remained outside that checkpoint.

The scoped wake had no pending comments, `fallbackFetchNeeded=false`, and the harness had already claimed checkout. Existing dirty workspace files from prior architecture/doc/tooling lanes were preserved.

## Goal
Audit a narrow representative set of high-risk dashboard/admin API families for semantic route/API contract parity beyond mere endpoint inventory and decide whether one-owner repair issues are needed.

## Scope
- `apps/api/src/router/dashboard.routes.ts`
- `apps/api/src/router/admin.routes.ts`
- `apps/api/src/modules/orders/*`
- `apps/api/src/modules/positions/*`
- `apps/api/src/modules/bots/*`
- `apps/api/src/modules/profile/apiKey/*`
- `apps/api/src/modules/profile/subscription/*`
- `apps/api/src/modules/admin/users/*`
- `apps/api/src/modules/admin/subscriptionPlans/*`
- `apps/api/src/modules/reports/*`
- `docs/architecture/traceability-matrix.md`
- `docs/architecture/reference/dashboard-route-map.md`
- `docs/modules/api-orders.md`
- `docs/modules/api-positions.md`
- `docs/modules/api-bots.md`
- `docs/modules/api-profile.md`
- `docs/modules/api-subscriptions.md`
- `docs/modules/api-admin.md`
- `docs/modules/api-reports.md`

## Implementation Plan
1. Reuse the existing route/API parity guardrail from [LUC-2107](/LUC/issues/LUC-2107) as the inventory boundary.
2. Inspect representative high-risk backend route/controller/type/service/test/doc chains.
3. Classify each API family for route mount, DTO/schema, service/response, documentation, and test evidence.
4. Run the smallest verification that proves the live inventory boundary and a representative response-shape test.
5. Record residual risk without changing runtime behavior.

## Acceptance Criteria
- Audit packet lists each requested API family and its semantic parity status.
- Any confirmed mismatch becomes a one-owner follow-up recommendation.
- If no mismatch is confirmed, evidence sources and residual risk are explicit.
- Verification commands are recorded.
- No production/protected/LIVE/deploy action is performed.

## Definition of Done
- [x] Route/API inventory proof rechecked.
- [x] Representative semantic route/controller/DTO/service/doc/test chains inspected.
- [x] Audit packet recorded in repository history.
- [x] Project state, task board, and module confidence updated.
- [x] Issue closure can mark [LUC-2177](/LUC/issues/LUC-2177) done without pretending production proof was run.

## Audit Packet

| API family | Route evidence | DTO/schema evidence | Response/service evidence | Docs/tests evidence | Parity status | Follow-up |
| --- | --- | --- | --- | --- | --- | --- |
| Orders | `orders.routes.ts` exposes list/get/manual-context/open/cancel/close under `/dashboard/orders`; dashboard router wraps it in `requireAuth`. | `orders.types.ts` parses list query, manual-context query, open/cancel/close bodies; symbol list filters normalize to uppercase and write commands require explicit typed payloads. | `orders.controller.ts` maps service results and typed domain errors to HTTP statuses, including `riskAck`, LIVE bot/context, unsupported cancel, and conflict cases. | `docs/modules/api-orders.md`; `orders.service.test.ts`, `orders-positions.e2e.test.ts`, `orders.manualContext.contractSize.service.test.ts`, `orders.liveCancelBoundary.service.test.ts`. | Verified by static/code-inspection for semantic parity; no confirmed mismatch. | None from this audit. |
| Positions | `positions.routes.ts` exposes list/get/live-status/exchange-snapshot/takeover/rebind/orphan repair/management/manual update under `/dashboard/positions`; dashboard router wraps it in `requireAuth`. | `positions.types.ts` parses list query, management-mode body, and manual-update body; symbol list filters normalize to uppercase. | `positions.controller.ts` keeps user-scoped reads, exchange snapshot error mapping, takeover/rebind payloads, and manual-update fail-closed errors explicit. | `docs/modules/api-positions.md`; `positions.list.e2e.test.ts`, `positions.exchangeSnapshot.e2e.test.ts`, `positions.takeover-status.e2e.test.ts`, `positions.service.test.ts`, `livePositionReconciliation.service.test.ts`. | Verified by static/code-inspection for semantic parity; no confirmed mismatch. | None from this audit. |
| Bots runtime reads/actions | `bots.routes.ts` exposes bot CRUD plus runtime graph/session/symbol-stats/positions/trades/aggregate/portfolio and runtime close under `/dashboard/bots`; dashboard router wraps it in `requireAuth`. | `bots.types.ts` parses bot CRUD, strategy drift, market-group, assistant, runtime list/filter, aggregate, and runtime close DTOs. | `bots.controller.ts` routes to service read models, returns `404` for missing/foreign bot/session resources, and maps risk-ack/subscription/domain errors for write or close paths. | `docs/modules/api-bots.md`; `bots.e2e.test.ts`, `bots.monitoring-aggregate.e2e.test.ts`, `bots.runtime-scope.e2e.test.ts`, `bots.runtime-history-parity.e2e.test.ts`, `bots.runtime-close-authority.route-pack.e2e.test.ts`, `runtimeSessionPositionCommand.service.test.ts`. | Verified by static/code-inspection for semantic parity; no confirmed mismatch. | None from this audit. |
| Profile API keys | `apiKey.routes.ts` exposes list/create/test/stored-test/update/delete/rotate/revoke under `/dashboard/profile/apiKeys`; dashboard router wraps it in `requireAuth`; test endpoints have user-exchange rate limiting. | `apiKey.types.ts` parses create/update/test/rotate bodies, exchange enum, secret length, and external-position flags. | `apiKey.controller.ts` preserves masked/public responses, owner-scoped operations, no-secret test behavior, rotate/revoke lifecycle, and persistence/encryption error mapping. | `docs/modules/api-profile.md`; `apiKey.e2e.test.ts`, `exchangeApiKeyProbe.service.test.ts`, `stage-abuse-throttling.e2e.test.ts`. | Verified by static/code-inspection for semantic parity; no confirmed mismatch. | None from this audit. |
| Profile subscription checkout | `subscription.routes.ts` is mounted under `/dashboard/profile/subscription`; dashboard router wraps it in `requireAuth`. | Subscription request DTOs live in the profile subscription service/types path and the shared entitlements schema. | Service/controller path returns active subscription and provider-agnostic checkout intent, with redirect origin sanitization and payable-plan checks. | `docs/modules/api-subscriptions.md`; `profile/subscription/subscription.e2e.test.ts`, `subscriptionEntitlements.service.test.ts`, `stage-abuse-throttling.e2e.test.ts`. | Verified by static/code-inspection for semantic parity; no confirmed mismatch. | None from this audit. |
| Admin users/subscription plans | `admin.routes.ts` wraps `/admin/users` and `/admin/subscriptions/plans` in `requireAuth` plus `requireRole('ADMIN')`. | `users.types.ts` and `subscriptionPlans.types.ts` parse pagination/search/role updates, CUID user params, plan code params, price/currency/entitlements, and non-empty update bodies. | Controllers return list/update payloads with self-demotion, last-admin, plan-not-found, and validation errors mapped explicitly. | `docs/modules/api-admin.md`; `admin/users/users.e2e.test.ts`, `admin/subscriptionPlans/subscriptionPlans.e2e.test.ts`. | Verified by static/code-inspection for semantic parity; no confirmed mismatch. | None from this audit. |
| Reports cross-mode performance | `reports.routes.ts` exposes `GET /dashboard/reports/cross-mode-performance`; dashboard router wraps it in `requireAuth`. | No request DTO is required because this endpoint accepts no route/query/body input. | `reports.service.ts` returns `generatedAt`, `modeResolution`, and three deterministic rows for `BACKTEST`, `PAPER`, and `LIVE`; aggregation handles null PnL and win-rate semantics. | `docs/modules/api-reports.md`; `reports.service.test.ts`, `reports.e2e.test.ts`; `docs/architecture/nodes/SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE.md`. | Verified by static/code-inspection and focused service test; no confirmed mismatch. | None from this audit. |

## Validation Evidence
- Tests:
  - `pnpm run docs:parity:route-api-matrix` -> PASS (`37` Web routes / `109` API endpoints / `16` traceability rows / `37` route-map inventory / `0` gaps).
  - `pnpm --filter api exec vitest run src/modules/reports/reports.service.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --testTimeout=30000` -> PASS (`1` file / `2` tests).
- Manual checks:
  - Static route/controller/type/service/doc/test inspection for the API families above.
  - `git status --short` before edits showed existing unrelated dirty architecture/doc/tooling state; this task added only LUC-2177 evidence/state files.
- Screenshots/logs: not applicable.
- High-risk checks: protected production smoke, secret readback, exchange mutation, LIVE order/action, deploy, restart, rollback, and database mutation were not performed.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable; audit produced no new product requirement.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable; residual semantic risk recorded here.
- Reality status: verified local/static audit.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/traceability-matrix.md`, `docs/architecture/reference/dashboard-route-map.md`, module deep dives, route files, controllers, DTO/type files, and representative tests.
- Fits approved architecture: yes.
- Mismatch discovered: no confirmed semantic DTO/response mismatch in the audited representative set.
- Decision required from user: no.
- Follow-up architecture doc updates: none required by this audit.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: remove this task packet and state entries if the audit record must be reverted.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Security / Privacy Evidence
- Data classification: protected account/API-key/trading surfaces inspected statically; no secret values read.
- Trust boundaries: dashboard routes depend on `requireAuth`; admin routes depend on `requireAuth` plus `requireRole('ADMIN')`.
- Permission or ownership checks: inspected at controller/service/test evidence level; production behavior not claimed.
- Abuse cases: API-key testing throttling and admin demotion locks have existing test evidence.
- Secret handling: no secret readback, storage, screenshots, or logs.
- Fail-closed behavior: risk acknowledgement, unsupported LIVE cancel, profile API-key ownership, admin self/last-admin demotion, and checkout URL sanitization are represented in code/tests.
- Residual risk: this is representative static/local audit, not exhaustive generated semantic schema diff and not protected production readback.

## Result Report
- Task summary: audited representative high-risk backend API families for semantic route/API DTO and response parity beyond the route inventory guardrail.
- Files changed: this task packet plus source-of-truth state/context entries.
- How tested: route/API inventory guardrail and focused reports service test passed; code/docs/tests inspected for all requested families.
- What is incomplete: no generated semantic DTO/response-body diff tool exists yet; DB-backed e2e packs were cited as existing evidence but not rerun in this heartbeat.
- Next steps: no repair issue is recommended from this representative audit; create a future QA/tooling issue only if the board wants exhaustive generated semantic response-shape diffing.
- Decisions made: route inventory parity remains [LUC-2107](/LUC/issues/LUC-2107) scope; [LUC-2177](/LUC/issues/LUC-2177) closes as local/static semantic audit with no confirmed mismatch.
