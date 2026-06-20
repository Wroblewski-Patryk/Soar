# LUC-3885 Stripe Webhook Subscription Lifecycle Reconciliation

Date: 2026-06-14
Owner: Core Backend Engineer
Status: implemented and verified locally

## Scope

- Added Stripe webhook reconciliation for subscription lifecycle events.
- Kept MANUAL provider checkout behavior unchanged.
- No live Stripe mutation, production smoke, deploy, push, restart, account action, or secret readback occurred.

## Files Changed

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260614011500_add_billing_webhook_events/migration.sql`
- `apps/api/src/index.ts`
- `apps/api/src/modules/subscriptions/payments/stripeWebhook.controller.ts`
- `apps/api/src/modules/subscriptions/payments/stripeWebhook.routes.ts`
- `apps/api/src/modules/subscriptions/payments/stripeWebhook.service.ts`
- `apps/api/src/modules/subscriptions/payments/stripeWebhook.e2e.test.ts`
- `docs/modules/api-subscriptions.md`
- `docs/operations/subscription-admin-operator-runbook.md`
- `.agents/state/module-confidence-ledger.md`

## Behavior

- `POST /webhooks/stripe` uses raw-body Stripe signature verification before billing mutation.
- `BillingWebhookEvent` records provider event ids for replay protection and operational status.
- Paid checkout completion validates user, plan, stored checkout session reference, and provider subscription reference before creating a `CHECKOUT` subscription.
- Same-event and same-checkout-session replays do not create duplicate checkout subscriptions.
- Checkout expiration marks the stored payment intent `EXPIRED`.
- Subscription update/delete events reconcile only the existing Stripe-backed checkout subscription.
- Period-end cancellation keeps current access active while disabling auto-renew.
- Invalid signature, unknown session, invalid plan metadata, unknown user, cross-user metadata, and unknown subscription references fail closed.

## Verification

- `pnpm --filter api run typecheck` PASS.
- `pnpm --filter api exec vitest run src/modules/subscriptions/payments/stripeWebhook.e2e.test.ts` PASS (`10/10`).

## Residual Risk

- Protected production Stripe webhook smoke remains Ops/Security/QA-owned and requires fresh operator approval plus configured test credentials.
