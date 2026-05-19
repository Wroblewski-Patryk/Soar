# Reusable Audit Registry

Updated: 2026-05-19

Latest run artifacts:

- `docs/analysis/audit-baseline-2026-05-18.md` includes the broad local audit
  rerun evidence: generated index/static scan, guardrails, docs parity,
  typecheck, lint, build, full Web Vitest, full API Vitest, focused API layer
  packs, go-live smoke, route-reachable i18n audit, and representative Browser
  route-state proof.
- `docs/analysis/audit-baseline-2026-05-19.md` extends `AUD-04` and `AUD-05`
  with authenticated local route-state proof: `53` checks, `53` PASS, `0`
  CHECK, `0` console warning/error routes, and `6` screenshots. It also adds
  the endpoint-level API docs parity run for `AUD-03`/`AUD-23`: `109`
  endpoints, `109` documented, and `0` gaps after documentation gap closure.
- `docs/operations/full-reusable-audit-rollup-2026-05-19.md` is the final
  2026-05-19 reusable audit rollup for `AUD-00` through `AUD-23`.
- `docs/operations/project-index-2026-05-19.md`,
  `docs/operations/v1-static-issue-scan-2026-05-19.md`, and
  `docs/operations/requirements-delivery-map-audit-2026-05-19.md` refresh
  `AUD-00` and add the dedicated `AUD-02` source-of-truth audit.

Purpose: define the reusable audit set for Soar. Each audit has a stable ID,
scope, evidence sources, repeatable checks, and trend fields so future reruns
can show improvement or regression without inventing a new checklist.

Status vocabulary:

- `registered`: audit is defined, but no current full run exists.
- `current`: audit has current evidence for the declared scope.
- `partial`: audit has useful evidence, but important checks are missing.
- `blocked`: audit cannot run because an input, environment, approval, or
  product decision is missing.
- `failed`: fresh evidence found a defect or drift.
- `deferred`: intentionally outside current product scope.

Truth rule: do not mark an audit `current` unless evidence is named in the
`Current Baseline` column or the latest run artifact.

## Audit Families

| ID | Family | Purpose | Primary Sources | Repeatable Checks | Current Baseline | Trend Metric |
| --- | --- | --- | --- | --- | --- | --- |
| AUD-00 | Project Index And Static Scan | Keep a no-network inventory of routes, modules, tests, scripts, V1 status, and static findings. | `docs/operations/project-index-*.md`, `docs/operations/v1-static-issue-scan-*.md`, `scripts/buildProjectIndex.mjs`, `scripts/runV1StaticIssueScan.mjs` | Run project index, then static scan sequentially; compare route/module/test counts and findings. | `current`: 2026-05-19 index `PASS:21`, tests indexed `335`, scan findings `0`. | Route count, API module count, Web feature count, test count, static findings by severity. |
| AUD-01 | Architecture-Code Conformance | Compare implemented behavior and source boundaries with canonical architecture. | `docs/architecture/**`, `docs/analysis/architecture-code-discrepancy-audit-*.md`, source routes/services/schema | Inspect architecture contracts against code; record mismatches as stable finding IDs. | `current after accepted Binance + Gate.io architecture decision`: `DEC-AUD-001` repaired exchange-scope wording; `AUD-EXCH-002` is repaired. | Open P0/P1 architecture discrepancies, repaired findings, new drift count. |
| AUD-02 | Requirements And Delivery Map | Verify product requirements, delivery-map rows, risk rows, and task board agree. | `.agents/state/requirements-verification-matrix.md`, `.agents/state/delivery-map.md`, `.codex/context/TASK_BOARD.md`, `.agents/state/risk-register.md` | Check accepted/in-progress requirements have evidence and next action; cross-check risks and tasks. | `current after follow-up`: 2026-05-19 dedicated audit refreshed delivery-map rows, restored risk-ID uniqueness with `RISK-036`, and synchronized continuation state. Production-boundary requirements remain intentionally partial where fresh production proof was not run. | Requirements by status, stale rows, accepted rows without proof, duplicate IDs, stale delivery rows. |
| AUD-03 | Backend API Surface | Audit API routers, module boundaries, auth guards, ownership checks, DTOs, error contracts, and route docs parity. | `apps/api/src/router/**`, `apps/api/src/modules/**`, `docs/modules/api-*.md`, `docs/architecture/traceability-matrix.md` | Compare route inventory to docs; inspect P0 route guards; run focused API packs per module. | `current local`: endpoint-level API docs parity passes with `109` endpoints, `109` documented, and `0` gaps; module docs parity passes. | API route count, protected-route guard gaps, endpoint-doc parity gaps, API tests pass/fail. |
| AUD-04 | Web Route And State Coverage | Audit Web routes, feature ownership, loading/empty/error/success states, auth redirects, and console health. | `apps/web/src/app/**`, `apps/web/src/features/**`, `docs/architecture/reference/dashboard-route-map.md`, production/local route audits | Compare generated routes to route map; run browser route-state proof for public/dashboard/admin routes. | `partial`: route inventory matches canonical route map; full current route-state rerun is still a next audit lane. | Routes passing render/state proof, console errors, auth redirect failures. |
| AUD-05 | UX/UI And Accessibility | Audit visual quality, responsive layout, keyboard/touch behavior, empty/error states, copy reachability, and design-system reuse. | `docs/ux/**`, `apps/web/src/**`, `docs/operations/prod-ux-a11y-mobile-proof-*.md` | Browser screenshots, responsive checks, keyboard focus, horizontal overflow, state coverage, route-reachable i18n audit. | `partial/current for V1`: 2026-05-14 production UX/A11y/Mobile proof passed; rerun needed after UI changes. | Screens with complete state coverage, a11y warnings, overflow issues, missing route copy. |
| AUD-06 | Security And Privacy | Audit auth/session, trusted origin, ops network, rate limits, headers, redaction, API-key secrecy, data isolation, and abuse cases. | `docs/security/**`, `apps/api/src/middleware/**`, `apps/api/src/modules/auth/**`, `apps/api/src/modules/profile/**`, security proof artifacts | Run local security/privacy pack and production-safe protected probes; confirm no secrets in artifacts. | `current for V1`: module ledger records local and production-safe security proof; external independent review remains open. | Failed fail-closed checks, secret exposure findings, isolation failures, stale security proof age. |
| AUD-07 | Data Model And Migrations | Audit Prisma models, indexes, uniqueness, migration safety, lifecycle ownership, and seed/backfill behavior. | `apps/api/prisma/schema.prisma`, `apps/api/prisma/migrations/**`, data backfill scripts, architecture domain docs | Inspect schema against architecture invariants; run migration/backfill dry checks where available. | `current local with mitigated finding`: 2026-05-19 schema validation, migration status, full local migration replay, schema diff generation, and isolated wallet/backtest/runtime DB-contract tests passed; `audit:data:db-isolated` is the canonical sequential reset-and-run path for the shared-DB finding. | Schema invariants verified, missing indexes, unsafe migration/backfill findings, DB e2e isolation policy. |
| AUD-08 | Workers And Runtime Operations | Audit split worker topology, readiness, queue ownership, runtime freshness, market-stream fanout, process cleanup, and observability. | `apps/api/src/workers/**`, `scripts/start-workers-prod.mjs`, worker health endpoints, operations proof artifacts | Run protected worker/process proof, runtime freshness, readiness, queue and telemetry checks. | `partial/current for V1 release gate`: protected ops proof passed 2026-05-14; rerun needed after worker/runtime changes. | Worker readiness status, freshness failures, orphan process incidents, queue missing count. |
| AUD-09 | Exchange Integration | Audit exchange SDK boundary, capability matrix, exact exchange context, probes, public/authenticated reads, adapter fail-closed behavior, and Gate.io/Binance parity. | `apps/api/src/modules/exchange/**`, `docs/architecture/reference/exchange-access-ownership-matrix.md`, exchange proof artifacts | Run exchange tests/proofs; inspect direct SDK imports; verify capability granularity and symbol normalization. | `current local`: exact `(exchange, marketType, operation)` capability contract is implemented in API exchange execution/authenticated-read services and consumers; non-exchange modules use neutral exchange-owned type aliases; focused exchange/orders/wallet tests and API typecheck pass. | Open exchange boundary findings, capability context gaps, unsupported operation fail-closed failures. |
| AUD-10 | Bots And Runtime Truth | Audit bot CRUD, active scope, wallet/strategy/market links, assistant config, runtime sessions, selected-bot dashboard truth, and cleanup. | `apps/api/src/modules/bots/**`, `apps/web/src/features/bots/**`, module ledger, runtime proofs | Run bot/API/Web packs and runtime readback; verify delete cleanup and one active scope. | `current for V1`: production fixture and local cleanup proofs exist; assistant runtime integration remains separate. | Bot lifecycle proof age, runtime readback failures, cleanup orphan counts. |
| AUD-11 | Engine And Trading Decision Flow | Audit runtime signal loop, pretrade checks, final-candle decision, paper/live parity, DCA/TTP/TSL, idempotency, and fail-closed behavior. | `apps/api/src/modules/engine/**`, runtime architecture contracts, runtime audit artifacts | Run focused engine/runtime tests and compare to runtime signal merge contract. | `partial`: historical focused proofs exist; full current engine rerun not performed in this registry task. | Engine tests pass/fail, parity drift, idempotency defects, fail-closed gaps. |
| AUD-12 | Orders And Manual Trading | Audit manual order context, order lifecycle, fills, fees, cancel/close, exchange-backed fail-closed behavior, and UI actions. | `apps/api/src/modules/orders/**`, `apps/web/src/features/orders/**`, order proof artifacts | Run order/API/Web packs; verify PAPER production-safe lifecycle and LIVE mutation boundary. | `current for V1`: local and production-safe PAPER proofs exist; LIVE mutation remains explicitly blocked without approval. | Unsafe mutation findings, lifecycle mismatches, stale active orders, UI action-state gaps. |
| AUD-13 | Positions And Reconciliation | Audit position list/read, update/close, takeover/orphan repair, external ownership, snapshots, reconciliation, and runtime close states. | `apps/api/src/modules/positions/**`, `apps/web/src/features/positions/**`, position proof artifacts | Run positions API/Web packs and production-safe PAPER lifecycle proof; keep LIVE close separate. | `current for V1`: local and production-safe PAPER proof exists; LIVE mutation remains blocked without approval. | Reconciliation failures, stale position visibility, ownership gaps, unsafe close findings. |
| AUD-14 | Wallets And Capital Ledger | Audit wallet CRUD, PAPER/LIVE modes, API-key binding, balance preview, reset guards, cashflow/equity ledger, and capital truth. | `apps/api/src/modules/wallets/**`, `apps/web/src/features/wallets/**`, wallet ledger docs | Run wallet API/Web packs; verify reset guards and ledger availability states. | `current for V1`: local and production-safe wallet CRUD/reset guard proof exists; broader LIVE ledger remains target extension. | Ledger gaps, reset safety failures, preview failures, capital context mismatches. |
| AUD-15 | Markets And Strategy Configuration | Audit market universe composition, catalog import, active-bot guards, strategy CRUD, config validation, indicator registry, and clone/import/export. | `apps/api/src/modules/markets/**`, `apps/api/src/modules/strategies/**`, Web market/strategy features | Run markets/strategies API/Web packs and indicator parity checks. | `current for V1`: local and production-safe fixture proofs exist; future strategy preview/best-parameter work remains separate. | Config validation failures, catalog drift, indicator parity gaps, active-bot guard regressions. |
| AUD-16 | Backtests And Reports | Audit run lifecycle, replay/parity, immutable snapshots, reports, timeline, route states, and production-safe fixture readback. | `apps/api/src/modules/backtests/**`, `apps/api/src/modules/reports/**`, Web backtest/reports features | Run backtest/report tests and disposable fixture proof; verify immutable snapshot behavior. | `current for V1`: production fixture proof and strategy/market snapshot history proof exist; non-Binance historical order-book remains future scope. | Backtest parity gaps, snapshot gaps, report aggregation errors, timeline failures. |
| AUD-17 | Logs And Audit Trail | Audit log creation, ownership, filters, pagination, action-produced events, metadata rendering, and audit evidence quality. | `apps/api/src/modules/logs/**`, `apps/web/src/features/logs/**`, proof artifacts | Run logs API/Web packs and confirm action-produced production evidence is visible and redacted. | `current for V1`: local filter/pagination/render proof and production action-produced readback exist. | Missing audit events, filter/pagination failures, unsafe metadata rendering. |
| AUD-18 | Admin, Subscriptions, And Entitlements | Audit admin-only access, plan/entitlement validation, role updates, self-demotion, checkout boundaries, and rendered admin routes. | `apps/api/src/modules/admin/**`, `apps/api/src/modules/subscriptions/**`, Web admin/profile subscription features | Run admin/subscription API/Web packs; verify protected admin render and non-destructive entitlement checks. | `current for V1`: local entitlement/role tests and production protected admin route proof exist. | Role/entitlement defects, admin access bypasses, checkout metadata drift. |
| AUD-19 | Operations, Release, And Deployment | Audit build-info, deploy smoke, release gates, rollback, backup/restore, SLO, alerts, Coolify/VPS assumptions, and runbook parity. | `docs/operations/**`, `scripts/runV1ReleaseGate.mjs`, deploy/rollback/smoke scripts | Run release gate/smoke where safe; verify build-info and rollback/restore evidence freshness. | `current local / public deploy fresh / protected preflight and RC blocked`: 2026-05-19 local typecheck, lint, build, go-live smoke, and local backup/restore check passed; 2026-05-19 post-push readback for `36ff999d` found production tracked `main`; follow-up fast-forwarded `origin/main` to `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac` and production build-info/public smoke passed; no-auth protected preflight for `dd1a1faf` passed build-info/public smoke and blocked on missing protected inputs plus stale protected evidence; dated no-secret RC packet records Gate 2 `OPEN` and Gate 4 `OPEN`. | Release readiness, smoke failures, stale evidence age, rollback/restore failures, local backup/restore preconditions, tracked-branch/deploy-target drift, protected-input availability. |
| AUD-20 | AI Assistant And Red Team | Audit assistant config, subagent limits, orchestration, prompt injection, data leakage, unauthorized access, circuit breaker, audit trace, and runtime integration truth. | `apps/api/src/modules/engine/assistantOrchestrator.service.ts`, bot assistant services, `AI_TESTING_PROTOCOL.md`, assistant architecture docs | Run assistant tests and AI protocol scenarios; verify hot-path integration or explicitly mark foundation-only. | `current foundation / hot-path assistant scope deferred`: `DEC-AUD-002` accepted config/dry-run/orchestrator foundation as current truth; runtime hot-path assistant orchestration is future/gated work. | AI red-team pass/fail, runtime integration status, circuit breaker failures, unauthorized access findings. |
| AUD-21 | Mobile And Cross-Platform Scope | Audit mobile scaffold, active scope, parity expectations, Expo/native readiness, and whether mobile is product-active. | `apps/mobile/**`, mobile docs, traceability matrix | Confirm scaffold-only vs active product scope; create mobile module docs before implementation. | `deferred / scaffold-only verified`: 2026-05-19 audit confirms `apps/mobile` has only package/README/placeholder source, build/test scripts are scaffold echoes, and docs correctly state no production mobile runtime. | Mobile scope decision, missing mobile docs, parity gaps once active. |
| AUD-22 | Internationalization And Copy Reachability | Audit route-reachable copy, locale completeness, hardcoded UI literals, and language policy. | `apps/web/src/**`, locale files, `docs/governance/language-policy.md`, i18n audit artifacts | Run route-reachable i18n audit after copy/route changes and guardrails for hardcoded UI copy. | `current local`: 2026-05-19 route-reachable i18n audit passed with `0` findings, `0` local copy, `0` fallback Polish, and `0` hardcoded; focused Web i18n pack passed (`8` files / `26` tests). | Missing route copy, hardcoded literal violations, stale locale keys. |
| AUD-23 | Documentation, Traceability, And Knowledge | Audit docs parity, module docs, route docs, traceability matrix, task board, project state, learning journal, and historical/stale planning traps. | `docs/**`, `.agents/**`, `.codex/context/**`, docs parity script | Run docs parity, inspect stale source-of-truth drift, update documentation drift report. | `current local`: docs parity passes and endpoint-level API docs parity passes with `0` gaps; historical plan cleanup remains a labeled non-active watch item. | Docs parity failures, stale rows, missing module docs, undocumented architecture decisions. |

## Standard Audit Run Order

1. Run `AUD-00` first with generated-state commands sequentially.
2. Run `AUD-23` before deep module work so stale docs do not steer the audit.
3. Run P0 safety families next: `AUD-06`, `AUD-09`, `AUD-10`, `AUD-11`,
   `AUD-12`, `AUD-13`, `AUD-19`, and `AUD-20`.
4. Run product workflow families: `AUD-03`, `AUD-04`, `AUD-05`, `AUD-14`,
   `AUD-15`, `AUD-16`, `AUD-17`, and `AUD-18`.
5. Run deferred or scope-check families: `AUD-21` and `AUD-22`.
6. Update the current baseline file and all affected source-of-truth state.

## Standard Per-Audit Result Fields

Every rerun should record:

- Audit ID and date.
- Scope included and explicit exclusions.
- Evidence sources inspected.
- Commands/tests/proofs run.
- Findings with stable IDs, severity, owner, status, and next action.
- Improvements since prior run.
- Regressions since prior run.
- Residual risk and blocked inputs.
- Whether requirement, risk, module-confidence, and task-board rows changed.

## Non-Negotiable Boundaries

- Do not run LIVE order submit/cancel/close, unsafe LIVE position mutation, or
  exchange-side mutation without explicit user approval.
- Do not mark production journeys current from local tests alone.
- Do not treat historical unchecked planning boxes as active work unless they
  are present in current queue/source-of-truth files.
- Do not run generated project index and static scan concurrently.
