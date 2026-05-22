# Web Deep-Dive: Positions Module

## Metadata
- Module name: `positions`
- Layer: `web`
- Source path: `apps/web/src/features/positions`, `apps/web/src/features/bots`, `apps/web/src/features/dashboard-home`
- Owner: frontend/runtime-monitoring
- Last updated: 2026-05-12
- Related planning task: `V1-WEB-ORDERS-POSITIONS-DOC-TRUTH-2026-05-12`

## 1. Purpose and Scope
Positions UX in V1 is intentionally consolidated into Dashboard Home and Bot
Runtime. Those surfaces render open/closed position state, runtime provenance,
takeover/import-status visibility, close/edit actionability, and lifecycle
history beside bot, wallet, order, and strategy context.

The `features/positions` package keeps the narrow web service helper used by
Dashboard Home for manual position updates:
- `apps/web/src/features/positions/services/positions.service.ts`

Out of scope:
- Promoting `/dashboard/positions` into a first-level navigation destination.
- Splitting runtime position management away from Dashboard Home and Bot
  Runtime.

## 2. Boundaries and Dependencies
Canonical route behavior:
- `/dashboard/positions` is a legacy compatibility route.
- Web middleware redirects it to `/dashboard/bots/runtime?legacy=positions`.
- The legacy runtime route redirects to `/dashboard#positions`, where
  Dashboard Home selects the open-positions runtime tab from the hash.
- `docs/architecture/reference/dashboard-route-map.md` requires first-level
  Orders and Positions paths to remain legacy redirects.

Operational dependencies:
- Dashboard Home owns compact position action controls.
- Bot Runtime owns detailed runtime position monitoring.
- API position reads and updates remain under `api/positions`.

## 3. Data and Contract Surface
Current web position contracts:
- `updatePositionManualParams(positionId, payload)` calls
  `PATCH /dashboard/positions/:id/manual-update`.
- Dashboard Home imports the helper for manual TP/SL/notes/lock-rule updates.
- Runtime position tables and monitoring state are assembled by Dashboard Home
  and Bots feature modules.

Backend contracts are documented in `docs/modules/api-positions.md`.

## 4. Runtime Flows
Current user flow:
1. User opens `/dashboard` or a Bot Runtime view.
2. Runtime surfaces fetch position, order, bot, wallet, and exchange context.
3. User reviews provenance, continuity, actionability, PnL, and protection
   labels in the runtime tables.
4. Supported manual updates call the positions API through
   `features/positions/services/positions.service.ts`.
5. Unsafe LIVE or exchange-derived mutations remain blocked by backend risk
   and ownership contracts.

Legacy compatibility flow:
1. User enters `/dashboard/positions`.
2. Middleware redirects to `/dashboard/bots/runtime?legacy=positions`.
3. The canonical runtime route handles the operator surface.

## 5. UI Integration
The visible Positions surface is embedded in:
- Dashboard Home runtime widgets.
- Bot Runtime monitoring, detail, and history views.

This preserves action context next to the selected bot, wallet, strategy,
orders, and imported exchange provenance.

## 6. Security and Risk Guardrails
- Dashboard routes remain protected by web middleware.
- API authorization remains authoritative on the backend.
- Position manual updates use owner-scoped backend routes.
- Takeover, orphan repair, live snapshot, and exchange-synced flows must keep
  backend fail-closed behavior as the source of truth.

## 7. Observability and Operations
- Legacy redirect behavior is regression-covered in `apps/web/src/middleware.test.ts`.
- Dashboard Home and Bot Runtime tests cover rendered position states, source
  labels, actionability, TTP/TSL display, close attribution, and provenance.

## 8. Test Coverage and Evidence
Relevant evidence:
- `docs/planning/v1-positions-local-proof-task-2026-05-11.md`
- `docs/planning/v1-dashboard-runtime-table-action-audit-2026-05-10-task.md`
- `docs/planning/v1-dashboard-home-selected-bot-rendered-audit-task-2026-05-11.md`
- `docs/planning/v1-bot-runtime-paper-session-browser-proof-task-2026-05-11.md`
- `apps/web/src/middleware.test.ts`
- Dashboard Home focused position/runtime tests under
  `apps/web/src/features/dashboard-home/components/`

## 9. Open Issues and Follow-Ups
- Production-safe Positions clickthrough remains required before V1 release
  readiness.
- If a future product decision reintroduces a dedicated Positions page, update
  `docs/architecture/reference/dashboard-route-map.md`, add route/component
  ownership, and add module-local tests in the same task.
