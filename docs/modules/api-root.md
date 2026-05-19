# API Deep-Dive: Root And Operations Routes

## Metadata
- Module name: `root`
- Layer: `api`
- Source path: `apps/api/src/router`
- Owner: backend/platform-ops
- Last updated: 2026-05-19
- Related planning task: `API-ENDPOINT-DOCS-GAP-CLOSURE-2026-05-19`

## Canonical Architecture Linkage
Canonical routing, readiness, and worker ownership rules live in:
- `docs/architecture/codebase-map.md`
- `docs/operations/service-reliability-and-observability.md`
- `docs/operations/post-deploy-smoke-checklist.md`

## 1. Purpose and Scope
- Owns root API liveness, readiness, metrics, alert, dashboard/admin mount, and
  worker diagnostics routes that are defined directly in `apps/api/src/router`.
- Provides production-safe health/readiness surfaces and admin-only operations
  diagnostics.

Out of scope:
- Dashboard business module endpoints mounted under `/dashboard/*`.
- Admin domain submodules mounted under `/admin/*`.
- Upload and auth module internals.

## 2. Boundaries and Dependencies
- Router entrypoint: `apps/api/src/router/index.ts`.
- Dashboard mount: `apps/api/src/router/dashboard.routes.ts`.
- Admin mount: `apps/api/src/router/admin.routes.ts`.
- Depends on:
  - critical secrets readiness checks,
  - runtime dependency readiness checks,
  - metrics and alert stores,
  - worker topology and runtime freshness diagnostics,
  - auth, role, no-store, and operations network middleware.

## 3. Data and Contract Surface
- Public liveness/readiness:
  - `GET /`
  - `GET /health`
  - `GET /ready`
- Protected operations diagnostics:
  - `GET /ready/details`
  - `GET /metrics`
  - `GET /alerts`
  - `GET /workers/health`
  - `GET /workers/ready`
  - `GET /workers/runtime-freshness`
- Protected router mount probes:
  - `GET /dashboard`
  - `GET /admin`

## 4. Runtime Flows
- `GET /` confirms the API process is reachable.
- `GET /health` returns basic service liveness without privileged diagnostics.
- `GET /ready` evaluates critical secrets and runtime dependencies and returns
  `503` when the API is not deployment-ready.
- Protected operations endpoints require authenticated admin access from an
  allowed operations network before returning readiness details, metrics,
  alerts, worker topology, or runtime freshness diagnostics.
- Dashboard and admin root probes validate that the authenticated router mounts
  are reachable under their respective boundaries.

## 5. API and UI Integration
- Root and operations routes:
  - `GET /`
  - `GET /health`
  - `GET /ready`
  - `GET /ready/details`
  - `GET /metrics`
  - `GET /alerts`
  - `GET /workers/health`
  - `GET /workers/ready`
  - `GET /workers/runtime-freshness`
  - `GET /dashboard`
  - `GET /admin`

## 6. Security and Risk Guardrails
- `GET /`, `GET /health`, and `GET /ready` are public and must avoid secrets,
  privileged internals, or user-specific data.
- `GET /ready/details`, `GET /metrics`, `GET /alerts`,
  `GET /workers/health`, `GET /workers/ready`, and
  `GET /workers/runtime-freshness` require auth, `ADMIN` role, and operations
  network access.
- Dashboard and admin routers apply no-store headers and route-level auth
  middleware before module routes execute.

## 7. Observability and Operations
- These routes are the baseline for local smoke checks, production deploy
  smoke, worker topology checks, and runtime freshness diagnostics.
- `/ready/details` includes runtime safety diagnostics for LIVE no-order guard
  state.
- Worker routes expose split-worker readiness and degraded topology reasons.

## 8. Test Coverage and Evidence
- Primary evidence:
  - `docs/operations/operations-release-deployment-audit-2026-05-19.md`
  - `docs/operations/workers-runtime-operations-audit-2026-05-19.md`
  - `docs/operations/security-privacy-audit-2026-05-19.md`
- Suggested validation commands:
```powershell
pnpm run test:go-live:smoke
pnpm --filter api run test -- src/router --run
```

## 9. Open Issues and Follow-Ups
- Keep root/ops endpoint docs aligned with deploy smoke and worker topology
  contracts whenever readiness or diagnostics routes change.
