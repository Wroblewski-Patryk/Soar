# Architecture-Code Discrepancy Audit - 2026-05-17

Purpose: record discrepancies found by comparing the current application code
and generated project inventory against the canonical architecture documents.
This is an audit baseline for future repair planning, not a code-change task.

## Current Status Addendum - 2026-05-19

This 2026-05-17 audit is historical evidence. Use the 2026-05-19 reusable audit
artifacts for current status before planning repairs.

- `AUD-EXCH-002` is closed. Exchange execution/authenticated-read capability
  support and consumers now resolve by exact `(exchange, marketType,
  operation)`.
- `AUD-EXCH-007` is closed. Non-exchange orders/wallet consumers now import
  neutral exchange-owned type aliases instead of CCXT-named connector types.
- `AUD-ARCH-001` remains open as `DEC-AUD-001` in
  `docs/operations/audit-decision-packet-2026-05-19.md`.
- `AUD-AI-003` / `AUD-AI-004` remain open as `DEC-AUD-002` in
  `docs/operations/audit-decision-packet-2026-05-19.md`.

## Scope

- Architecture sources reviewed:
  - `docs/architecture/README.md`
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/03_domain-model.md`
  - `docs/architecture/04_runtime-and-workers.md`
  - `docs/architecture/07_modes-parity-and-data.md`
  - `docs/architecture/09_integrations-and-exchange-adapters.md`
  - `docs/architecture/10_assistant-and-ai.md`
  - `docs/architecture/12_deployment-and-operations.md`
  - `docs/architecture/reference/assistant-runtime-contract.md`
  - `docs/architecture/reference/dashboard-route-map.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Code and generated inventory reviewed:
  - `apps/api/src/router/index.ts`
  - `apps/api/src/router/dashboard.routes.ts`
  - `apps/api/src/router/admin.routes.ts`
  - `apps/api/src/modules/exchange/**`
  - `apps/api/src/modules/engine/**`
  - `apps/api/src/modules/bots/**`
  - `apps/api/src/workers/workerOwnership.ts`
  - `apps/api/prisma/schema.prisma`
  - `apps/api/prisma/migrations/20260503013000_enforce_single_active_bot_market_group/migration.sql`
  - `apps/web/src/middleware.ts`
  - `apps/web/src/ui/layout/dashboard/dashboardRoutes.ts`
  - `docs/operations/project-index-2026-05-17.md`
  - `docs/operations/v1-static-issue-scan-2026-05-17.md`

## Executive Summary

The audited codebase is broadly aligned with the current V1/post-V1
architecture on dashboard route inventory, protected route gating, worker
topology visibility, bot market scope constraints, Prisma lifecycle shape, and
exchange SDK ownership. The static scan for this audit reported `0` findings,
and the generated Web route inventory matches the canonical dashboard route map.

The main discrepancies are not broad runtime breakages. They are exact-source
truth gaps:

1. Some architecture overview/domain wording still describes a Binance-only or
   single-exchange-family baseline even though code and later architecture
   references support Binance and Gate.io.
2. Exchange capability truth is still partly exchange-only in code where the
   architecture requires exact `(exchange, marketType, operation)` capability
   resolution.
3. Assistant architecture describes BACKTEST/PAPER/LIVE decision orchestration,
   but code currently has assistant configuration, dry-run orchestration, and
   deterministic orchestrator tests rather than hot-path runtime/backtest/live
   integration.

## Findings

| ID | Severity | Layer | Finding | Code Reality | Architecture Reality | Impact | Recommended Repair |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AUD-ARCH-001 | P1 | Architecture documentation | Exchange-scope wording is internally inconsistent. | Code and state support Binance and Gate.io in market catalog, probes, public reads, and capability surfaces. | `docs/architecture/01_overview-and-principles.md` and `docs/architecture/03_domain-model.md` still contain Binance-only / one-exchange-family baseline wording, while `09_integrations` and the exchange ownership matrix describe Gate.io support. | Future agents may incorrectly plan exchange work as Binance-only or treat Gate.io code as non-canonical. | Update overview/domain docs to distinguish code-supported exchanges from production resource/proof scope, or record a decision that Gate.io support is still transitional. |
| AUD-EXCH-002 | P1 | Exchange capability contract | Exact operation support is not fully keyed by market type. | `exchangeExecutionCapabilityContract.service.ts` and `exchangeAuthenticatedReadContract.service.ts` resolve support by `Exchange` and operation; `exchangeAdapterRegistry.service.ts` separately validates `ExchangeContext`. | The exchange ownership matrix requires capability decisions by exact `(exchange, marketType, operation)` and says consumers must not infer support by exchange alone. | A future exchange or market-type expansion could overstate operation support, especially where spot/futures support diverges. | Refactor capability matrix and consumers to accept `ExchangeContext`, add tests for per-market-type operation support, or explicitly revise architecture if exchange-only capability gates remain approved. |
| AUD-AI-003 | P1 | Assistant runtime | Assistant runtime architecture overstates implementation integration. | `botAssistant.service.ts` supports config/subagent slots and dry-run calls; `assistantOrchestrator.service.ts` has deterministic fail-closed tests. No audited runtime signal-loop/backtest/PAPER/LIVE hot-path call uses `orchestrateAssistantDecision`. | `docs/architecture/10_assistant-and-ai.md` and `reference/assistant-runtime-contract.md` describe assistant orchestration for BACKTEST, PAPER, and LIVE decisions with audit trace and fail-closed behavior. | Operators and agents may believe AI decision governance is active in trading/runtime paths when it is currently a tested foundation plus dry-run/config surface. | Choose one: implement hot-path assistant orchestration and AI red-team evidence, or update architecture to mark the assistant as config/dry-run foundation until the runtime slice is delivered. |
| AUD-OPS-004 | P2 | Project tooling workflow | Generated project index and static scan can race when run concurrently. | A parallel `ops:project:index` + `ops:project:scan` run produced `SyntaxError: Unexpected end of JSON input`; sequential rerun passed with `0` findings. | Learning journal already had a related generated-state sequencing rule, but this run confirmed the narrower index/scan race. | Future audits can produce false failures if generated state commands run in parallel. | Keep generated-state commands sequential; learning journal updated in this audit. |
| AUD-BRAND-005 | P3 | Branding/meta | Soar/CryptoSparrow naming remains mixed in low-level metadata. | `package.json`, API root text, and mobile scaffold still use CryptoSparrow wording. | Current canonical architecture and project language increasingly refer to Soar / CryptoSparrow / Soar depending on era and document. | Low runtime risk, but future polish or public handoff may look inconsistent. | Decide whether brand unification is in scope. If yes, plan a small copy/metadata sweep with route-reachable i18n checks. |
| AUD-TRACE-006 | P2 | Traceability | Generated route inventory is current, but endpoint-level docs parity is still not automated. | `project-index-2026-05-17` reports 38 Web routes and route inventory matches `dashboard-route-map.md`; API modules/routes are indexed. | `docs/analysis/documentation-drift.md` already marks endpoint-level route-to-doc parity as a future gap. | Route/API additions can still drift unless future changes run manual comparison. | Add an automated parity check for API route files and dashboard route map, or keep this as a documented manual audit gate. |
| AUD-EXCH-007 | P3 | Exchange boundary maintainability | Some non-exchange modules depend on CCXT-named exchange-module types. | `orders.service.ts` and wallet services import CCXT-named types from the exchange module, not the SDK directly. | Exchange adapters own SDK/client access; non-exchange modules should use narrow exchange-owned contracts. | This is not an SDK bypass, but adapter-specific type naming leaks implementation detail into feature modules. | Rename/export neutral contract types from the exchange module during the next exchange capability repair. |

## Aligned Areas

| Area | Evidence | Result |
| --- | --- | --- |
| Dashboard route inventory | Generated route inventory from `docs/operations/project-index-2026-05-17.json` was compared with `docs/architecture/reference/dashboard-route-map.md`; actual-only and doc-only route sets were empty. | Aligned |
| Protected Web routes | `apps/web/src/middleware.ts` protects `/dashboard/:path*` and `/admin/:path*`; legacy orders/positions redirects go to the bot runtime surface. | Aligned |
| API health/ops protection | `apps/api/src/router/index.ts` keeps `/ready` public-minimal and protects `/ready/details`, `/metrics`, `/alerts`, and worker diagnostics with auth, admin role, and ops-network guard. | Aligned |
| Worker topology visibility | `apps/api/src/workers/workerOwnership.ts` marks deployed inline/partial-inline ownership as degraded; `/workers/ready` can fail closed when queues/workers are missing. | Aligned |
| Bot market scope | Prisma migration `20260503013000_enforce_single_active_bot_market_group` creates the partial unique index for one active bot market group per bot. | Aligned |
| Exchange SDK ownership | Direct CCXT imports and exchange REST URLs are confined to the exchange module. Feature modules consume exchange module services/types rather than SDK clients. | Mostly aligned |
| Static scan | `pnpm run ops:project:scan -- --index docs/operations/project-index-2026-05-17.json` passed with findings `0`. | Aligned |

## Validation Evidence

- `pnpm run ops:project:index` PASS; generated
  `docs/operations/project-index-2026-05-17.md` and `.json`.
- Sequential `pnpm run ops:project:scan -- --index docs/operations/project-index-2026-05-17.json` PASS; generated
  `docs/operations/v1-static-issue-scan-2026-05-17.md` and `.json`; findings `0`.
- Manual code/doc comparison for Web routes, protected API diagnostics, worker
  topology, Prisma bot scope, exchange boundaries, and assistant integration.

## Repair Planning Order

Historical 2026-05-17 queue. Current 2026-05-19 status is recorded in the
addendum above; `AUD-EXCH-002` and `AUD-EXCH-007` are now closed.

1. Decide and repair assistant truth (`AUD-AI-003`): either implement runtime
   integration with AI safety proof or narrow the architecture wording.
2. Repair exchange capability truth (`AUD-EXCH-002`) by moving capability gates
   to `ExchangeContext` or approving the current two-stage shape.
3. Clean up exchange-scope documentation (`AUD-ARCH-001`) so overview/domain
   docs match the accepted exchange support and production-proof boundary.
4. Add endpoint-level parity automation or a required manual route/API parity
   checklist (`AUD-TRACE-006`).
5. Defer brand/meta cleanup and neutral exchange type names unless they are
   pulled into adjacent work.

## Residual Risk

This audit did not run browser route-state proofs, full API/Web test suites, or
production journeys. It is a source-of-truth discrepancy audit based on current
architecture docs, generated inventory, static scan, and targeted source
inspection.
