# API Deep-Dive: Admin Module

## Metadata
- Module name: `admin`
- Layer: `api`
- Source path: `apps/api/src/modules/admin`
- Owner: backend/core
- Last updated: 2026-10-19
- Related planning task: `DCP-04`

## 1. Purpose and Scope
- Provides administrator-only management for users, subscription plans, and LIVE execution pause.
- Exposes paged user listing plus controlled role/subscription mutations.
- Exposes subscription catalog updates used for operational pricing/entitlement management.

Out of scope:
- End-user self-service profile actions.
- Public subscription checkout/session flows.

## 2. Boundaries and Dependencies
- Router mount: `/admin` via `apps/api/src/router/admin.routes.ts`.
- Access boundary: guarded by `requireAuth` + `requireRole('ADMIN')`; every non-read admin request also requires the signed human browser-session audience in a cookie, without an Authorization header.
- Depends on:
  - `prisma` persistence.
  - `subscriptions.service` for catalog initialization and assignment helpers.
- Downstream consumers:
  - Admin dashboard APIs and admin UI workflows.

## 3. Data and Contract Surface
- Key DTO/contracts:
  - `AdminUsersListQueryDto`, `UpdateAdminUserDto` (`users.types.ts`).
  - `UpdateAdminSubscriptionPlanDto` (`subscriptionPlans.types.ts`).
- Write invariants:
  - No self-demotion from last/admin role scenarios.
  - No demotion when it would remove the last admin.
  - Subscription plan updates rely on existing catalog row (`ensureSubscriptionCatalog` bootstrap).

## 4. Runtime Flows
- User management flow:
  1. List users with pagination/search/role filters.
  2. Optional role update with guardrails (self + last-admin protection).
  3. Optional active subscription override through `setActiveSubscriptionForUser`.
- Subscription plan flow:
  1. Ensure catalog exists.
  2. List plans ordered by sort/display.
  3. Update mutable plan fields (`displayName`, `isActive`, `price`, `currency`, `entitlements`).
- LIVE execution flow:
  1. Read the shared pause state and version.
  2. Pause or resume with a reason and matching version under an exclusive database lock.
  3. Commit the change and audit log atomically, then read back the new version.

## 5. API and UI Integration
- Mounted base path: `/admin`.
- Routes:
  - `GET /admin/users`
  - `PATCH /admin/users/:userId`
  - `GET /admin/subscriptions/plans`
  - `PUT /admin/subscriptions/plans/:code`
  - `GET /admin/live-execution`
  - `PUT /admin/live-execution`

## 6. Security and Risk Guardrails
- Admin-only authorization enforced at router level.
- Demotion guardrails prevent privilege lockout.
- Plan/user mutations are constrained to explicit whitelisted fields.
- Bearer-only clients and legacy tokens replayed as cookies receive 403/401 on role, plan, and LIVE pause writes. A fresh browser login is required after the legacy token rollout.
- LIVE pause mutations require a human ADMIN session, a reason, and optimistic version match.

## 7. Observability and Operations
- Admin user updates, subscription assignments, and their actor/old/new audit entries are persisted via transactional writes.
- Operational parity depends on subscription catalog bootstrap consistency.

## 8. Test Coverage and Evidence
- Primary tests:
  - `apps/api/src/modules/admin/users/users.e2e.test.ts`
  - `apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts`
  - `apps/api/src/modules/admin/liveExecution/liveExecution.routes.e2e.test.ts`
  - `apps/api/src/modules/orders/liveExecutionPause.service.test.ts`
- Suggested validation command:
```powershell
pnpm --filter api test -- src/modules/admin/users/users.e2e.test.ts src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts
```

## 9. Open Issues and Follow-Ups
- Replace remaining message-string error signaling with typed domain errors (optimization wave).
- Define a distinct delegated-client principal in the API/MCP slice; it must never be accepted as an admin panel session.
