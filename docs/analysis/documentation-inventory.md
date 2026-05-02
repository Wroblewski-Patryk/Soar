# Documentation Inventory

Updated: 2026-05-03

Purpose: record what documentation exists, what each area is for, which code it
maps to, and where drift or missing technical links remain. This inventory is
based on repository inspection, not on invented architecture.

## Inventory Summary
| Area | Existing Docs | Purpose | Related Code Areas | Status |
|---|---:|---|---|---|
| Root/project context | `README.md`, `AGENTS.md`, `.codex/context/*`, `.agents/workflows/*` | Agent workflow, current state, queue, learning journal, delivery rules. | Whole repository | Active, but queue/context can drift and must be synced per task. |
| `docs/architecture/` | Numbered architecture docs, source-of-truth file, reference contracts, archive. | Canonical system behavior, runtime ownership, invariants, parity, safety. | API, web, workers, Prisma, deployment | Active and rich; lacked one codebase-map and traceability entrypoint before this task. |
| `docs/modules/` | API and web deep dives, module status index, system modules map. | Implementation ownership, routes, dependencies, tests. | `apps/api/src/modules/*`, `apps/web/src/features/*` | Active; now linked through `docs/modules/index.md`. |
| `docs/planning/` | Many task plans and wave plans. | Temporary execution sequencing and evidence. | Any touched scope | Large historical volume; active-vs-historical distinction must stay explicit. |
| `docs/operations/` | Deployment, smoke, rollback, runbooks, release evidence, artifacts. | Runtime operation and release evidence. | Scripts, Coolify/VPS, API/web/workers | Active; many dated evidence files are historical by design. |
| `docs/product/` | Overview, product, glossary, AI integration, known limits. | Product intent and user-facing scope. | Whole product | Active human-readable source; needs technical trace links through architecture/module docs. |
| `docs/ux/` | Design system, visual direction, parity workflow, anti-patterns. | UX implementation and quality standard. | `apps/web/src/*` | Active; route/component parity remains tied to route map and module docs. |
| `docs/security/` | Secure development lifecycle, API-key policy, risk docs. | Security/privacy risk controls. | Auth, profile API keys, exchange, subscriptions | Active; should be linked from security-sensitive feature rows. |
| `docs/governance/` | Delivery loop, repository structure, language policy, working agreements. | How agents and contributors work. | Whole repository | Active; docs maintenance rules now centralized in `docs/CONTRIBUTING-DOCS.md`. |
| `docs/adr/` | ADR template baseline. | Standalone decision records when required. | Architecture decisions | Available but not heavily used. |

## Important Existing Technical Docs Reused
- `docs/architecture/reference/dashboard-route-map.md`: canonical route to
  feature/API mapping.
- `docs/modules/module-doc-status-index.md`: current API/web module deep-dive
  coverage status.
- `docs/modules/system-modules.md`: high-level module map.
- `docs/architecture/reference/exchange-access-ownership-matrix.md`: exchange
  access boundary contract.
- `docs/architecture/reference/runtime-signal-merge-contract.md`: runtime
  signal merge contract.
- `docs/architecture/reference/assistant-runtime-contract.md`: assistant
  runtime contract.
- `docs/operations/post-deploy-smoke-checklist.md`: post-deploy smoke source.
- `docs/engineering/testing.md`: test workflow source.

## Suspected Outdated Or Historical Files
These are not automatically wrong, but they should not be treated as current
source of truth without cross-checking newer architecture/context files.

| File/Area | Reason | Current Handling |
|---|---|---|
| `docs/architecture/archive/*` | Explicitly historical or superseded. | Use only for history; active truth is numbered architecture plus references. |
| Dated closure/evidence files under `docs/operations/` | Evidence snapshots, not current architecture. | Link only as evidence from task reports. |
| Older V1/V1EXCEL/V1FINAL plans under `docs/planning/` | Many contain historical unchecked template boxes or superseded gate language. | Active queue must be checked in `mvp-next-commits.md` and `.codex/context/TASK_BOARD.md`. |
| `docs/README.md` | Existing entrypoint was human-oriented and duplicated some governance text. | Kept and pointed at `docs/index.md` as engineering map. |

## Missing Or Newly Added Documentation Areas
| Area | Before | Repair In This Task |
|---|---|---|
| Central engineering docs map | `docs/README.md` existed, but no `docs/index.md`. | Added `docs/index.md`. |
| Codebase map | Module docs existed, but no single codebase map across routes/services/data/workers. | Added `docs/architecture/codebase-map.md`. |
| Traceability matrix | Route map and module docs existed separately. | Added `docs/architecture/traceability-matrix.md`. |
| Pipeline registry | Flow details existed across architecture/plans but no registry. | Added `docs/pipelines/index.md` plus core flow docs. |
| Module registry | Deep dives and status index existed, but no pipeline-linked registry. | Added `docs/modules/index.md`. |
| Drift report | Historical coverage audits existed, but no current system-map drift report. | Added `docs/analysis/documentation-drift.md`. |
| Maintenance rules | Governance docs existed, but no concise contributor rule sheet for traceability updates. | Added `docs/CONTRIBUTING-DOCS.md`. |

## Discovery Notes
- API modules discovered under `apps/api/src/modules`: `admin`, `auth`,
  `backtests`, `bots`, `engine`, `exchange`, `icons`, `isolation`, `logs`,
  `market-data`, `market-stream`, `markets`, `orders`, `pagination`,
  `positions`, `profile`, `reports`, `strategies`, `subscriptions`, `upload`,
  `users`, `wallets`.
- Web features discovered under `apps/web/src/features`: `admin`, `auth`,
  `backtest`, `bots`, `dashboard-home`, `exchanges`, `icons`, `logs`,
  `markets`, `orders`, `positions`, `profile`, `reports`, `shared`,
  `strategies`, `wallets`.
- Prisma models discovered in `apps/api/prisma/schema.prisma` include user,
  subscriptions, API keys, strategies, market universe/symbol groups, bots,
  runtime sessions/events/stats, runtime dedupe, wallets, positions, orders,
  trades, fills, signals, backtests, reports, and logs.
- Workers discovered under `apps/api/src/workers`: backtest, execution,
  market data, market stream, bootstrap, ownership, and stream subscription
  helpers.

## Verification Limits
- This inventory is a static repository audit. It does not prove that every
  route works in production.
- Endpoint lists are derived from route files and should be regenerated or
  checked when route definitions change.
- Areas marked `UNVERIFIED / NEEDS CONFIRMATION` in downstream docs require a
  future code or runtime evidence pass before being treated as fully closed.
