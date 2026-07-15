# API Deep-Dive: Root And Operations Routes

## Metadata
- Module name: `root`
- Layer: `api`
- Source path: `apps/api/src/router`
- Owner: backend/platform-ops
- Last updated: 2026-05-31
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
- `GET /dashboard` is the authenticated dashboard root reachability probe. It
  returns only the minimal welcome payload plus the authenticated `req.user`
  echo so the protected mount can prove session continuity before downstream
  dashboard modules execute.
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
- `GET /dashboard` must stay minimal and must not inline dashboard business
  module data beyond the authenticated welcome payload and current user
  projection.

### Source-Level Auth Map: `GET /workers/ready`
- Route definition:
  - `apps/api/src/router/index.ts` -> `router.get('/workers/ready', ...requireOpsAccess, ...)`
- Middleware chain (`requireOpsAccess` in declaration order):
  1. `requireAuth` (`apps/api/src/middleware/requireAuth.ts`)
     - Requires a valid authenticated session/token and populates `req.user`.
     - Fail-closed response: `401 Unauthorized`.
  2. `requireRole('ADMIN')` (`apps/api/src/middleware/requireRole.ts`)
     - Requires `req.user.role === 'ADMIN'`.
     - Fail-closed response: `403 Forbidden`.
  3. `requireOpsNetwork` (`apps/api/src/middleware/requireOpsNetwork.ts`)
     - Requires source IP to satisfy explicit allowlist or private-network policy.
     - Fail-closed response: `403 Forbidden`.
- Effective access contract:
  - Principal must be authenticated, have `ADMIN` role, and originate from an
    allowed operations network.
  - Any missing condition denies access before worker-readiness payload
    evaluation.

## 7. Observability and Operations
- These routes are the baseline for local smoke checks, production deploy
  smoke, worker topology checks, and runtime freshness diagnostics.
- `/ready/details` includes runtime safety diagnostics for LIVE no-order guard
  state.
- Worker routes expose split-worker readiness and degraded topology reasons.

## 8. Test Coverage and Evidence
- Primary evidence:
  - `history/audits/operations-release-deployment-audit-2026-05-19.md`
  - `history/audits/workers-runtime-operations-audit-2026-05-19.md`
  - `history/audits/security-privacy-audit-2026-05-19.md`
- Suggested validation commands:
```powershell
pnpm run test:go-live:smoke
pnpm --filter api run test -- src/router --run
pnpm --filter api exec vitest run src/middleware/requireRole.test.ts src/middleware/requireOpsNetwork.test.ts
```

## 9. Open Issues and Follow-Ups
- Keep root/ops endpoint docs aligned with deploy smoke and worker topology
  contracts whenever readiness or diagnostics routes change.

## 10. Architecture-Awareness Doc-Link Classification

Last classified: 2026-06-05 under [LUC-2174](/LUC/issues/LUC-2174).

| Source entity | Owner doc | Classification | Expected proof |
| --- | --- | --- | --- |
| `apps/api/src/middleware/noStoreHeaders.ts` | `docs/modules/api-root.md` | Root/dashboard/admin middleware helper that enforces no-store behavior on auth-sensitive API surfaces. | Architecture-awareness `documents` relation from this doc plus router/middleware tests when header behavior changes. |
| `apps/api/src/types/express.d.ts` | `docs/modules/api-root.md` | Express request typing extension for authenticated API router and middleware contracts. | Architecture-awareness `documents` relation from this doc plus API typecheck/router tests when middleware typing changes. |
| `apps/api/src/utils/apiError.ts` | `docs/modules/api-root.md` | Shared API error response helper used by protected and public router surfaces. | Architecture-awareness `documents` relation from this doc plus API error tests when response semantics change. |
| `apps/api/src/utils/crypto.ts` | `docs/modules/api-root.md` | Shared API crypto utility boundary for secure server-side value handling. | Architecture-awareness `documents` relation from this doc plus crypto tests when encryption/hash behavior changes. |
| `apps/api/src/utils/errorExposure.ts` | `docs/modules/api-root.md` | Shared error-exposure classifier for operator-readable errors without leaking sensitive internals. | Architecture-awareness `documents` relation from this doc plus router/error tests when exposure policy changes. |
| `apps/api/src/utils/formatZodError.ts` | `docs/modules/api-root.md` | Shared validation-error formatter for API request DTO failures. | Architecture-awareness `documents` relation from this doc plus route validation tests when DTO error shape changes. |
| `apps/api/src/utils/hash.ts` | `docs/modules/api-root.md` | Shared password/hash utility boundary used by auth and security-sensitive API flows. | Architecture-awareness `documents` relation from this doc plus auth/profile security tests when hash behavior changes. |
| `apps/api/src/config/criticalSecretsReadiness.*` | `docs/modules/api-root.md` | API readiness and critical-secret safety helpers for fail-closed startup/readiness behavior. [LUC-6106](/LUC/issues/LUC-6106) added direct doc links for already-tested helper/test rows. | `criticalSecretsReadiness.test.ts` plus readiness/root route proof when startup/readiness behavior changes. |
| `apps/api/src/config/proxyTrust.*` | `docs/modules/api-root.md` | API proxy-trust and private-network parsing support for deployed request handling. [LUC-6106](/LUC/issues/LUC-6106) added direct doc links for already-tested helper/test rows. | `proxyTrust.test.ts` plus operations-network route proof when proxy trust behavior changes. |
| `apps/api/src/config/runtimeExecution.*` | `docs/modules/api-root.md` | Runtime execution-mode/readiness configuration consumed by API platform and protected runtime routes. [LUC-6106](/LUC/issues/LUC-6106) added direct doc links for the already-tested parse helper/test row. | `runtimeExecution.test.ts` plus deployment readiness proof when runtime execution semantics change. |
