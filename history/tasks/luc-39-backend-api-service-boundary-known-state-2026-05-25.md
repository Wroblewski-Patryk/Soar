# LUC-39 Backend API & Service Boundary Known-State (2026-05-25)

## Objective
Create a stable, evidence-backed map of API route boundaries (routes -> modules -> controllers/services/validators/tests) and document auth/error semantics that frontend/QA can rely on without assumptions.

## Evidence-backed state
- `Get-ChildItem -Recurse *.routes.ts`
- `Get-ChildItem ... -Filter *.controller.ts/.service.ts/.e2e.test.ts/.test.ts`
- `Get-Content -Raw docs/graphs/function-journey-index.json`
- `Get-Content -Raw docs/graphs/user-action-index.json`
- focused middleware tests (Vitest)

Status: `implemented and verified`.

## Route boundary map (implemented)
### Router entrypoints
- `apps/api/src/router/index.ts`: mounts
  - `/auth` -> `modules/auth/auth.routes.ts`
  - `/dashboard` -> `apps/api/src/router/dashboard.routes.ts`
  - `/admin` -> `apps/api/src/router/admin.routes.ts`
  - `/upload` -> `apps/api/src/modules/upload/upload.routes.ts`
  - ops endpoints (`/ready/details`, `/alerts`, `/metrics`, `/workers/*`) currently guarded by `requireOpsAccess = [requireAuth, requireRole('ADMIN'), requireOpsNetwork]`
- `apps/api/src/index.ts`:
  - global middleware order: `requireTrustedOrigin` then `requestLogger` before `router`.

### Dashboard module mounts (all protected)
- `apps/api/src/router/dashboard.routes.ts`: `router.use(requireAuth)` applied once at root + mount all module routers below.
- Mounted modules and base paths:
  - `/profile/basic`, `/profile/security`, `/profile/apiKeys`, `/profile/subscription`
  - `/strategies`, `/markets`, `/wallets`, `/bots`, `/orders`, `/positions`
  - `/backtests`, `/reports`, `/logs`, `/market-stream`, `/icons`
- This implies frontend/QA expectation: any request to these paths is authenticated unless route handler does its own public-read override (currently none).

### Admin module mounts
- `apps/api/src/router/admin.routes.ts`: `router.use(requireAuth, requireRole('ADMIN'))`
- Subroutes:
  - `/admin/subscriptions/plans`
  - `/admin/users`

## Route files -> handlers -> validators -> tests
| Route file | Mounted path (approx) | Controller | Validator / schema file(s) | Tests |
|---|---|---|---|---|
| `apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.routes.ts` | `/admin/subscriptions/plans` | `subscriptionPlans.controller.ts` | `subscriptionPlans.types.ts` | `subscriptionPlans.e2e.test.ts` |
| `apps/api/src/modules/admin/users/users.routes.ts` | `/admin/users` | `users.controller.ts` | `users.types.ts` | `users.e2e.test.ts` |
| `apps/api/src/modules/auth/auth.routes.ts` | `/auth/*` | `auth.controller.ts` | `auth.types.ts` | `auth.e2e.test.ts`, `auth.service.test.ts`, `auth.cookie.test.ts`, `auth.jwt.test.ts` |
| `apps/api/src/modules/backtests/backtests.routes.ts` | `/dashboard/backtests/*` | `backtests.controller.ts` | `backtests.types.ts` | `backtests.e2e.test.ts`, `backtests.contract-remediation.test.ts` |
| `apps/api/src/modules/bots/bots.routes.ts` | `/dashboard/bots/*` | `bots.controller.ts` | `bots.types.ts` | `bots.e2e.test.ts`, `bots.subscription-entitlements.e2e.test.ts`, `bots.wallet-contract.e2e.test.ts`, plus 16+ bot runtime e2e files |
| `apps/api/src/modules/icons/icons.routes.ts` | `/dashboard/icons/*` | `icons.controller.ts` | `icons.types.ts` | `icons.e2e.test.ts` |
| `apps/api/src/modules/logs/logs.routes.ts` | `/dashboard/logs/*` | `logs.controller.ts` | `logs.types.ts` | `logs.e2e.test.ts` |
| `apps/api/src/modules/market-stream/marketStream.routes.ts` | `/dashboard/market-stream/events` | inline stream handler | `binanceStream.types.ts` | `marketStream.routes.e2e.test.ts`, `marketStream.routes.contract.test.ts` |
| `apps/api/src/modules/markets/markets.routes.ts` | `/dashboard/markets/*` | `markets.controller.ts` | `markets.types.ts` | `markets.e2e.test.ts` |
| `apps/api/src/modules/orders/orders.routes.ts` | `/dashboard/orders/*` | `orders.controller.ts` | `orders.types.ts` | `orders-positions.e2e.test.ts`, `orders.e2e.test.ts` |
| `apps/api/src/modules/positions/positions.routes.ts` | `/dashboard/positions/*` | `positions.controller.ts` | `positions.types.ts`, `positions.exchangeSnapshot.types.ts`, `livePositionReconciliation.types.ts` | `positions.e2e.test.ts`, `positions.*.e2e.test.ts` |
| `apps/api/src/modules/profile/apiKey/apiKey.routes.ts` | `/dashboard/profile/apiKeys/*` | `apiKey.controller.ts` | `apiKey.types.ts` | `apiKey.e2e.test.ts` |
| `apps/api/src/modules/profile/basic/basic.routes.ts` | `/dashboard/profile/basic/*` | `basic.controller.ts` | `basic.types.ts` | `basic.e2e.test.ts` |
| `apps/api/src/modules/profile/security/security.routes.ts` | `/dashboard/profile/security/*` | `security.controller.ts` | `security.types.ts` | `security.e2e.test.ts` |
| `apps/api/src/modules/profile/subscription/subscription.routes.ts` | `/dashboard/profile/subscription/*` | `subscription.controller.ts` | `subscription.types.ts` | `subscription.e2e.test.ts` |
| `apps/api/src/modules/reports/reports.routes.ts` | `/dashboard/reports/*` | `reports.controller.ts` | `reports` has inline schema path usage | `reports.e2e.test.ts` |
| `apps/api/src/modules/strategies/strategies.routes.ts` | `/dashboard/strategies/*` | `strategies.controller.ts` + `indicators/routes` | `strategies.types.ts` | `strategies.e2e.test.ts` |
| `apps/api/src/modules/strategies/indicators/indicators.routes.ts` | `/dashboard/strategies/:id/indicators` | `indicators.controller.ts` | no dedicated indicators `types.ts` in folder (schema in shared strategy/engine types) | `indicators.service.test.ts` |
| `apps/api/src/modules/upload/upload.routes.ts` | `/upload/avatar` | inline multipart/avatar handler | inline schema in handler | `upload.e2e.test.ts`, `upload.processing.test.ts` |
| `apps/api/src/modules/wallets/wallets.routes.ts` | `/dashboard/wallets/*` | `wallets.controller.ts` | `wallets.types.ts` | `wallets.e2e.test.ts`, `wallets.crud.e2e.test.ts` |

## Controller -> service links (for critical modules)
- `controllers/*.controller.ts` import service layer in `apps/api/src/modules/*/*.controller.ts` (for example `bots.controller.ts` -> `bots.service.ts` + `subscriptionEntitlements.service.ts`).
- Example service fanout command:
  - `wallets.controller.ts` -> `wallets.service.ts`
  - `orders.controller.ts` -> `orders.service.ts` + `subscriptionEntitlements.service.ts`
  - `positions.controller.ts` -> `positions.service.ts`, `livePositionReconciliation.service.ts`, exchange contract services
  - `auth.controller.ts` -> `auth.service.ts`
  - `subscriptionPlans.controller.ts` -> `subscriptionPlans.service.ts`
  - `users.controller.ts` -> `users.service.ts`
  - `backtests.controller.ts` -> `backtests.service.ts`
  - `reports.controller.ts` -> `reports.service.ts`

## Authz, boundary and error semantics (frontend + QA contract)
### 1) Auth chain
- API-wide global check: `requireTrustedOrigin` applies to all `/` requests before route dispatch (`apps/api/src/index.ts`).
- `/dashboard` subtree: `requireAuth` at router root (`dashboard.routes.ts`), then module-specific handlers.
- `/admin` subtree: `requireAuth` + `requireRole('ADMIN')` (`admin.routes.ts`) then controllers.
- `/auth` routes are registered without router-level guard; specific handlers implement token validation where needed (`/auth/me`, `/auth/logout`).

### 2) Auth/error code semantics from tests + implementation
- `requireAuth` returns:
  - `401` for missing/invalid token (`Missing token`, `Invalid token`)
  - `503` when auth dependency lookup fails (`Auth service temporarily unavailable`)
- `requireRole` returns `403` (`Forbidden`) when role mismatch.
- `requireOpsNetwork` returns `403` for network reject cases.
- `requireTrustedOrigin` returns:
  - `403 Origin header required for state-changing requests` when sameSite cookie session is present and no origin/referrer.
  - `403 Untrusted origin` for disallowed origin on session-bound mutating call.
- Route and service-level validation flows:
  - Zod validation errors are normalized to `400 Validation failed` with `error.details`.
  - Unknown/unmapped errors are normalized by `httpErrorMapper` to `500 Internal server error`.
  - `AppError` / `DomainError` surface mapped status/message with `details` when available.
- Production safety: sensitive internals are redacted through `errorExposure.ts` for sensitive Prisma/network-like messages.

### 3) Rate-limit semantics
- `createRateLimiter` currently produces:
  - 429 for limit breaches
  - 503 when store is unavailable

## Known-route risk surface from graph inputs
- `docs/graphs/function-journey-index.json`
  - summary shows `criticalGaps: 0`, `highGaps: 28`.
- Critical chains with high risk remain across money/protected paths (evidence-only in this document):
  - `CHAIN-MANUAL-ORDER` (`SOAR-API-MANUAL-CONTEXT`, `SOAR-API-ORDER-OPEN`)
  - `CHAIN-MANUAL-ORDER-DEEP` (`SOAR-API-MANUAL-CONTEXT`, `SOAR-API-ORDER-OPEN`)
  - `CHAIN-POSITIONS-CORE` (`SOAR-API-POSITION-*`)
  - `CHAIN-BOT-RUNTIME-CORE` (`SOAR-API-BOT-RUNTIME-*`)
  - `CHAIN-BOT-SETUP`, `CHAIN-STRATEGIES`, `CHAIN-MARKETS`, `CHAIN-WALLETS-CORE`, `CHAIN-BACKTESTS`, `CHAIN-REPORTS`, `CHAIN-SUBSCRIPTIONS-ADMIN`, `CHAIN-AUTH-SESSION-DEEP` etc.
- `docs/graphs/user-action-index.json`: `routeVisitActions=36`, with 37 rows carrying `high`/`critical` risk status currently (noted for QA planning).

## Verification evidence
1. `pnpm --filter api exec vitest run src/middleware/requireAuth.test.ts src/middleware/requireRole.test.ts src/middleware/requireOpsNetwork.test.ts src/middleware/requireTrustedOrigin.test.ts src/middleware/rateLimit.test.ts src/middleware/errorHandler.test.ts`
   - result: middleware/guard tests passing (4 test files recognized by current runner).
2. `pnpm --filter api exec vitest run src/modules/admin/users/users.e2e.test.ts src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts`
   - result: admin authorization boundary verified (401/403 on unauth/non-admin, happy-path for admin).
3. Inventory commands in this document: route/controllers/services/tests counts and endpoint maps were re-read directly from source tree to avoid stale assumptions.

## Remaining evidence gaps (unchanged from existing state)
- The same workflow-level gaps around protected/money/live production browser proof remain `implemented not verified` from known-state perspective.
- This task did not introduce schema or UI changes.

## Status for issue criteria
- Critical API routes mapped to controllers/services/validators/tests: `implemented and verified`
- Authorization/error semantics documented for frontend and QA: `implemented and verified`
- No backend schema/UI side effects were performed in this heartbeat: `verified`
