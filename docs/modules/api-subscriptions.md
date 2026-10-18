# API Deep-Dive: Subscriptions Module

## Metadata
- Module name: `subscriptions`
- Layer: `api`
- Source path: `apps/api/src/modules/subscriptions`
- Owner: backend/billing
- Last updated: 2026-10-19
- Related planning task: `DCP-07`

## 1. Purpose and Scope
- Owns subscription catalog seed and entitlement resolution for administrator-assigned plans.
- Provides plan limits/features contract used by bot creation and profile subscription surfaces.

Out of scope:
- Profile UI rendering and client-side plan presentation (web profile module).
- Payment gateway activation and webhook-driven billing state transitions.

## 2. Boundaries and Dependencies
- Direct API exposure is via profile routes:
  - `/dashboard/profile/subscription`
- Internal services are consumed by:
  - bot create limit enforcement (`assertSubscriptionAllowsBotCreate`)
  - bot LIVE capability guard (`assertSubscriptionAllowsLiveTrading`)
  - profile subscription read flow
- Depends on:
  - Prisma models (`subscriptionPlan`, `userSubscription`, `paymentIntent`)
  - historical `PaymentIntent` records remain in the schema; payment adapters are unreachable from current user routes.

## 3. Data and Contract Surface
- Subscription catalog seed:
  - `FREE`, `ADVANCED`, `PROFESSIONAL`
  - each plan defines limits, feature flags, and cadence defaults
- Entitlement contract (`SubscriptionEntitlementsSchema`):
  - limits: bot caps and backtest caps
  - features: live trading and external position controls
  - cadence: allowed intervals and defaults
- Historical checkout intent data and provider fields remain for readback and later reconciliation.

## 4. Runtime Flows
- Entitlement resolution flow:
  1. Ensure subscription catalog exists.
  2. Require an administrator-assigned active subscription for plan-gated actions.
  3. Resolve active plan and parse entitlements with fallback safety for invalid payloads.
- Bot-create guard flow:
  1. Resolve user entitlements.
  2. Count current total and mode-specific bot usage.
  3. Throw `SubscriptionBotLimitError` when limits are exceeded.
- LIVE capability guard flow:
  1. Resolve user entitlements.
  2. Read `features.liveTrading` from the active plan payload.
  3. Throw `SubscriptionFeatureUnavailableError` when a bot write path tries
     to create a LIVE bot or switch `PAPER -> LIVE` without entitlement.
- Self-service checkout is disabled. The old route returns 404 and does not call a provider or write `PaymentIntent`.

## 5. API and UI Integration
- Representative routes:
  - `GET /dashboard/profile/subscription`
  - `PATCH /admin/users/:userId` for human administrator assignment.

## 6. Security and Risk Guardrails
- Dashboard auth required on profile subscription routes.
- No active user checkout route accepts redirect URLs.
- Entitlements include fail-safe fallback to FREE plan structure when parsing fails.
- Missing assignment fails closed with `SUBSCRIPTION_ASSIGNMENT_REQUIRED` (403).

## 7. Observability and Operations
- Catalog seeding is idempotent (`upsert`) for stable boot/runtime behavior.
- Existing payment intents are preserved as historical records; no provider switch is an active operator action.

## 8. Test Coverage and Evidence
- Focused subscription evidence now includes:
  - no assignment on registration or profile read,
  - rejection of bot creation before an administrator assigns a plan,
  - self-service checkout refusal without a new payment intent,
  - invalid entitlement payload fallback to the FREE plan structure,
  - FREE-plan LIVE trading fail-closed behavior,
  - FREE-plan bot-count enforcement,
  - upgraded plan re-allocation,
  - no hardcoded bot-cap fallback,
  - explicit LIVE feature-gate enforcement on create and mode switch.
- Suggested validation command:
```powershell
pnpm --filter api exec vitest run src/modules/subscriptions/subscriptionEntitlements.service.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts src/modules/profile/subscription/subscription.e2e.test.ts
```

## 9. Open Issues and Follow-Ups
- Review historical `DEFAULT` and `CHECKOUT` assignments with the owner before any data migration.
- Reconcile the displayed backtest cap with enforcement in a separately owned backtest slice.
