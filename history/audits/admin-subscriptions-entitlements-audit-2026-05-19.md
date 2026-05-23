# Admin, Subscriptions, And Entitlements Audit - 2026-05-19

## Metadata

| Field | Value |
| --- | --- |
| Audit ID | `AUD-18` |
| Registry family | Admin, Subscriptions, And Entitlements |
| Stage | verification |
| Environment | local |
| Status | current local / current historical production-safe protected route proof |
| Production journey | not run |
| LIVE exchange mutation | not run |
| Exchange-side mutation | not run |
| Existing production data mutation | not run |

## Scope

This audit compares current admin/subscription behavior with documented
architecture/module contracts for:

- admin-only access,
- user listing and active subscription metadata,
- role updates and self-demotion/last-admin guardrails,
- subscription plan catalog and entitlement validation,
- profile subscription readback and checkout intent foundation,
- FREE/paid entitlement gates for bot limits and LIVE trading,
- Web admin user/subscription pages and profile subscription states.

Canonical references:

- `docs/analysis/reusable-audit-registry.md`
- `docs/modules/api-admin.md`
- `docs/modules/api-subscriptions.md`
- `docs/modules/web-admin.md`
- `docs/architecture/reference/subscription-tier-entitlements-contract.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/risk-register.md`

## Evidence Run

| Proof | Result | Evidence |
| --- | --- | --- |
| Focused Web admin/subscription pack | PASS | `corepack pnpm --filter web exec vitest run src/features/admin/users/pages/AdminUsersPage.test.tsx src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx src/features/profile/components/Subscription.test.tsx src/app/dashboard/profile/page.test.tsx`; `4` files, `9` tests. |
| Focused API admin/subscription pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/admin/users/users.e2e.test.ts src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts src/modules/subscriptions/subscriptionEntitlements.service.test.ts src/modules/profile/subscription/subscription.e2e.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts`; `5` files, `25` tests. |
| Local DB/Redis lifecycle | PASS | `corepack pnpm run go-live:infra:up` before DB-backed API tests and `corepack pnpm run go-live:infra:down` after proof. |

## Architecture-To-Code Parity

| Contract Area | Current Implementation Truth | Parity |
| --- | --- | --- |
| Admin-only access | API admin routes are guarded by `requireAuth` + `requireRole('ADMIN')`; tests cover unauthenticated and non-admin rejection. | aligned |
| User role/plan management | Admin user tests cover listing with subscription metadata, role update, subscription assignment, and self-demotion prevention. | aligned |
| Subscription plan management | Admin subscription plan tests cover catalog read, mutable plan updates, and entitlement validation/fail-closed invalid payloads. | aligned |
| Entitlement gates | Subscription entitlement tests and bot e2e tests cover FREE fallback, bot caps, upgraded plan allocation, and LIVE trading feature gate. | aligned |
| Profile subscription | Profile subscription e2e and Web profile subscription tests cover profile readback and checkout intent foundation. | aligned |
| Web admin surfaces | Web tests cover admin user/subscription loaded/error/action states and profile subscription rendering. Production historical proof covers protected admin route rendering. | aligned |

## Findings

| ID | Severity | Status | Finding | Evidence | Next Action |
| --- | --- | --- | --- | --- | --- |
| `AUD-ADM-004` | P1 | open freshness follow-up | Fresh production protected admin/subscription route proof was not rerun. Historical production UI module proof remains accepted for the 2026-05-14 deployment target. | `history/plans/prod-ui-module-clickthrough-2fc90a08-2026-05-14.md`; this audit's local Web/API packs. | Refresh production-safe protected admin route proof after future deployments. |
| `AUD-ADM-005` | P1 | explicit exclusion | Non-destructive production entitlement mutation was not run. This remains future admin-ops scope, not current local correctness. | Requirement/risk rows; this audit's local API admin mutation tests. | Plan a production-safe admin mutation exercise only with explicit approval and rollback/readback boundaries. |
| `AUD-ADM-006` | P2 | documented follow-up | Admin docs still call for typed domain errors and stronger admin mutation audit detail. Subscriptions docs still call for checkout provider URL/provider e2e and webhook-driven billing lifecycle. | `docs/modules/api-admin.md`; `docs/modules/api-subscriptions.md`. | Track under admin hardening and future billing lifecycle work. |
| `AUD-ADM-007` | P3 | documented UX follow-up | Web admin docs still call for explicit client-side non-admin gate/redirect and optimistic rollback telemetry. | `docs/modules/web-admin.md`. | Track under admin UX polish, while backend authorization remains authoritative. |

## Result

`AUD-18` is current locally for admin-only access, role/subscription plan
management, self-demotion prevention, entitlement validation, profile
subscription readback, bot limit/LIVE gates, and Web admin/profile subscription
states.

No code behavior was changed. No production journey, LIVE mutation,
exchange-side mutation, or existing production data mutation was performed.
