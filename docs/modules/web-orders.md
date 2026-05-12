# Web Deep-Dive: Orders Module

## Metadata
- Module name: `orders`
- Layer: `web`
- Source path: `apps/web/src/features/bots`, `apps/web/src/features/dashboard-home`
- Owner: frontend/runtime-monitoring
- Last updated: 2026-05-12
- Related planning task: `V1-WEB-ORDERS-POSITIONS-DOC-TRUTH-2026-05-12`

## 1. Purpose and Scope
Orders UX in V1 is intentionally consolidated into Dashboard Home and Bot
Runtime rather than a first-level Orders page. Operator-facing order state,
manual order actions, open-order actions, terminal read-only rows, source
labels, and runtime history are rendered through those runtime surfaces.

Out of scope:
- Promoting `/dashboard/orders` into a first-level navigation destination.
- Creating a separate Orders page outside the approved runtime IA.
- Moving API order command authority away from the existing dashboard API
  contracts.

## 2. Boundaries and Dependencies
Canonical route behavior:
- `/dashboard/orders` is a legacy compatibility route.
- Web middleware redirects it to `/dashboard/bots/runtime?legacy=orders`.
- `docs/architecture/reference/dashboard-route-map.md` requires first-level
  Orders and Positions paths to remain legacy redirects.

Operational dependencies:
- Bot Runtime owns detailed runtime order monitoring.
- Dashboard Home owns the compact operator action surface.
- API order commands remain under `api/orders` routes such as
  `/dashboard/orders/open`, `/dashboard/orders/:id/cancel`, and
  `/dashboard/orders/:id/close`.

## 3. Data and Contract Surface
Web order UI consumes order data through Dashboard Home and Bots services:
- `apps/web/src/features/bots/services/bots.service.ts`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`

Backend contracts are documented in `docs/modules/api-orders.md`.

## 4. Runtime Flows
Current user flow:
1. User opens `/dashboard` or a Bot Runtime view.
2. Dashboard/Bot Runtime fetches runtime order, position, wallet, and bot
   context through approved services.
3. User sees open-order state and source labels in the runtime table.
4. Supported PAPER/manual actions call the existing order API contracts.
5. Exchange-backed unsupported actions fail closed according to API capability
   and order lifecycle contracts.

Legacy compatibility flow:
1. User enters `/dashboard/orders`.
2. Middleware redirects to `/dashboard/bots/runtime?legacy=orders`.
3. The canonical runtime route handles the operator surface.

## 5. UI Integration
The visible Orders surface is embedded in:
- Dashboard Home runtime widgets.
- Bot Runtime monitoring and history views.

This keeps manual-order and runtime-order truth beside bot, wallet, position,
and strategy context rather than splitting high-risk trading controls across a
parallel page.

## 6. Security and Risk Guardrails
- Dashboard routes remain protected by web middleware.
- API authorization remains authoritative on the backend.
- Manual order command paths preserve existing order API validation.
- LIVE and exchange-backed mutation remains fail-closed unless the backend
  capability and risk guards allow the action.

## 7. Observability and Operations
- Legacy redirect behavior is regression-covered in `apps/web/src/middleware.test.ts`.
- Runtime order behavior is covered by Dashboard Home and Bot Runtime proof
  tasks and focused tests.

## 8. Test Coverage and Evidence
Relevant evidence:
- `docs/planning/v1-orders-local-proof-task-2026-05-11.md`
- `docs/planning/v1-manual-orders-local-proof-task-2026-05-11.md`
- `docs/planning/v1-dashboard-runtime-table-action-audit-2026-05-10-task.md`
- `docs/planning/v1-bot-runtime-paper-session-browser-proof-task-2026-05-11.md`
- `apps/web/src/middleware.test.ts`
- Dashboard Home focused order/action tests under
  `apps/web/src/features/dashboard-home/components/`

## 9. Open Issues and Follow-Ups
- Production-safe Orders clickthrough remains required before V1 release
  readiness.
- If a future product decision reintroduces a dedicated Orders page, update
  `docs/architecture/reference/dashboard-route-map.md`, add route/component
  ownership, and add module-local tests in the same task.
