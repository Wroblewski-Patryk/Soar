# Task: Admin, Subscriptions, And Entitlements Audit - 2026-05-19

## Context

The user requested reusable layer-by-layer discrepancy audits between the
application implementation and architecture/module descriptions. `AUD-18`
covers admin-only access, plan/entitlement validation, role updates,
self-demotion, checkout boundaries, and rendered admin routes.

## Goal

Refresh `AUD-18` with current local evidence and record implementation vs
architecture/documentation discrepancies without changing runtime behavior.

## Scope

- `docs/analysis/reusable-audit-registry.md`
- `docs/modules/api-admin.md`
- `docs/modules/api-subscriptions.md`
- `docs/modules/web-admin.md`
- `apps/api/src/modules/admin/**`
- `apps/api/src/modules/subscriptions/**`
- `apps/api/src/modules/profile/subscription/**`
- `apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts`
- `apps/web/src/features/admin/**`
- `apps/web/src/features/profile/components/Subscription.test.tsx`
- `apps/web/src/app/dashboard/profile/page.test.tsx`

## Constraints

- No production journey.
- No LIVE order/cancel/close.
- No exchange-side mutation.
- No existing production data mutation.
- Keep repository artifacts in English.

## Definition Of Done

- Focused Web admin/subscription proof is run and recorded.
- Focused API admin/subscription proof is run and recorded.
- Architecture-to-code parity is summarized.
- Open gaps are recorded with stable IDs.
- Local DB/Redis infra is stopped after DB-backed tests.
- A reusable Markdown and JSON audit artifact exists.

## Forbidden

- Do not change product behavior during the audit.
- Do not perform LIVE-money or exchange-side mutation.
- Do not mutate production entitlements.
- Do not overclaim production freshness from local tests.

## Result Report

Completed on 2026-05-19.

Validation:

- `corepack pnpm --filter web exec vitest run src/features/admin/users/pages/AdminUsersPage.test.tsx src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx src/features/profile/components/Subscription.test.tsx src/app/dashboard/profile/page.test.tsx`
  - PASS: `4` files, `9` tests.
- `corepack pnpm --filter api exec vitest run src/modules/admin/users/users.e2e.test.ts src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts src/modules/subscriptions/subscriptionEntitlements.service.test.ts src/modules/profile/subscription/subscription.e2e.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts`
  - PASS: `5` files, `25` tests.
- `corepack pnpm run go-live:infra:down`
  - PASS: local Postgres/Redis stopped after DB-backed tests.

Artifacts:

- `docs/operations/admin-subscriptions-entitlements-audit-2026-05-19.md`
- `docs/operations/admin-subscriptions-entitlements-audit-2026-05-19.json`

Residual risk:

- Fresh production protected admin/subscription route proof was not rerun.
- Non-destructive production entitlement mutation was not run.
- Typed admin domain errors, admin mutation audit detail, checkout provider
  e2e, webhook billing lifecycle, client-side non-admin UX, and optimistic
  rollback telemetry remain documented follow-ups.
