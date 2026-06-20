# API Deep-Dive: Subscriptions Module

## Metadata
- Module name: `subscriptions`
- Layer: `api`
- Source path: `apps/api/src/modules/subscriptions`
- Owner: backend/billing
- Last updated: 2026-05-01
- Related planning task: `DCP-07`

## 1. Purpose and Scope
- Owns subscription catalog seed, entitlement resolution, checkout intent orchestration, and Stripe webhook reconciliation.
- Provides plan limits/features contract used by bot creation and profile subscription surfaces.

Out of scope:
- Profile UI rendering and client-side plan presentation (web profile module).
- Live Stripe portal/customer-management UI; webhook reconciliation only applies
  to provider events sent to the backend webhook route.

## 2. Boundaries and Dependencies
- Direct API exposure is via profile routes:
  - `/dashboard/profile/subscription`
  - `/dashboard/profile/subscription/checkout-intents`
- Stripe provider webhook exposure:
  - `/webhooks/stripe`
- Internal services are consumed by:
  - bot create limit enforcement (`assertSubscriptionAllowsBotCreate`)
  - bot LIVE capability guard (`assertSubscriptionAllowsLiveTrading`)
  - profile subscription read flow
- Depends on:
  - Prisma models (`subscriptionPlan`, `userSubscription`, `paymentIntent`, `billingWebhookEvent`)
  - payment adapter registry (`MANUAL`, `STRIPE`)

## 3. Data and Contract Surface
- Subscription catalog seed:
  - `FREE`, `ADVANCED`, `PROFESSIONAL`
  - each plan defines limits, feature flags, and cadence defaults
- Entitlement contract (`SubscriptionEntitlementsSchema`):
  - limits: bot caps and backtest caps
  - features: live trading and external position controls
  - cadence: allowed intervals and defaults
- Checkout intent contract:
  - sanitized success/cancel URLs against allowlisted origins
  - persisted `paymentIntent` with idempotency key and provider metadata
- Stripe webhook reconciliation contract:
  - raw request body and Stripe signature verification before mutation
  - provider event id persisted in `billingWebhookEvent` for replay protection
  - paid checkout activation creates exactly one active `CHECKOUT` subscription
    and links the stored `paymentIntent`
  - checkout expiration marks the stored `paymentIntent` as `EXPIRED`
  - subscription update/delete events reconcile existing Stripe-backed checkout
    subscription state without mutating other users

## 4. Runtime Flows
- Entitlement resolution flow:
  1. Ensure subscription catalog exists.
  2. Ensure user has default active subscription (`FREE`) if missing.
  3. Resolve active plan and parse entitlements with fallback safety.
- Bot-create guard flow:
  1. Resolve user entitlements.
  2. Count current total and mode-specific bot usage.
  3. Throw `SubscriptionBotLimitError` when limits are exceeded.
- LIVE capability guard flow:
  1. Resolve user entitlements.
  2. Read `features.liveTrading` from the active plan payload.
  3. Throw `SubscriptionFeatureUnavailableError` when a bot write path tries
     to create a LIVE bot or switch `PAPER -> LIVE` without entitlement.
- Checkout intent flow:
  1. Validate payable plan and sanitize redirect URLs.
  2. Resolve configured payment provider adapter.
  3. Create provider intent and persist internal payment intent record.
- Stripe webhook flow:
  1. Verify `stripe-signature` against `STRIPE_WEBHOOK_SECRET` using the raw
     JSON request body.
  2. Insert or resume a `billingWebhookEvent` row keyed by
     `(provider, eventId)`.
  3. Validate metadata user/plan, stored checkout session reference, and
     existing subscription reference before mutating entitlements.
  4. Reconcile payment intent and user subscription state in a transaction.
  5. Mark the webhook event `PROCESSED`, `FAILED`, or `IGNORED` with safe
     metadata only.

## 5. API and UI Integration
- Representative routes:
  - `GET /dashboard/profile/subscription`
  - `POST /dashboard/profile/subscription/checkout-intents`
  - `POST /webhooks/stripe`
- Rate limit:
  - checkout intent creation limited to 5 requests per 60 seconds per user.

## 6. Security and Risk Guardrails
- Dashboard auth required on profile subscription routes.
- Redirect URLs are origin-validated to prevent open redirects.
- Entitlements include fail-safe fallback to FREE plan structure when parsing fails.
- Unknown or unsupported payment provider config fails closed.
- Stripe webhooks fail closed on missing/invalid signature, missing webhook
  secret, unknown checkout session, invalid plan metadata, unknown user, or
  cross-user metadata mismatch.
- Webhook logs and event metadata do not store Stripe secrets, raw signatures,
  bearer tokens, cookies, or full provider payloads.

## 7. Observability and Operations
- Catalog seeding is idempotent (`upsert`) for stable boot/runtime behavior.
- Payment provider abstraction allows operational switch between manual and Stripe adapters.
- Webhook processing persists `billingWebhookEvent` rows for replay detection,
  failure inspection, and safe operational retry visibility.

## 8. Test Coverage and Evidence
- Focused subscription evidence now includes:
  - invalid entitlement payload fallback to the FREE plan structure,
  - FREE-plan LIVE trading fail-closed behavior,
  - FREE-plan bot-count enforcement,
  - upgraded plan re-allocation,
  - no hardcoded bot-cap fallback,
  - explicit LIVE feature-gate enforcement on create and mode switch.
- Stripe webhook reconciliation coverage is implemented in
  `apps/api/src/modules/subscriptions/payments/stripeWebhook.e2e.test.ts` for
  paid checkout activation, event replay, same-session replay, invalid
  signatures, unknown session, invalid plan metadata, checkout expiration,
  cross-user mutation prevention, immediate cancellation reconciliation, and
  period-end cancellation auto-renew reconciliation.
- Suggested validation command:
```powershell
pnpm --filter api exec vitest run src/modules/subscriptions/subscriptionEntitlements.service.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts src/modules/profile/subscription/subscription.e2e.test.ts
```

Webhook-focused validation:
```powershell
pnpm --filter api exec vitest run src/modules/subscriptions/payments/stripeWebhook.e2e.test.ts
```

## 9. Open Issues and Follow-Ups
- Add dedicated e2e for checkout intent provider and URL sanitization contract.
- Protected production Stripe webhook smoke requires fresh operator approval,
  configured test credentials, and secret-safe evidence capture.

## 10. Architecture-Awareness Doc-Link Classification

Last classified: 2026-06-05 under [LUC-2163](/LUC/issues/LUC-2163).

| Source entity | Owner doc | Classification | Expected proof |
| --- | --- | --- | --- |
| `apps/api/src/modules/subscriptions/payments/paymentGateway.types.ts` | `docs/modules/api-subscriptions.md` | Payment gateway abstraction contract for checkout intent provider integration. | Architecture-awareness `documents` relation from this doc plus checkout/payment-provider tests when behavior changes. |
