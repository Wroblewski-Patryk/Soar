# Subscription Administrator Runbook

Status: current manual assignment workflow (2026-10-19). The April 2026
checkout/provider instructions describe historical implementation only.

## Authority

- Registration creates a `USER` without a subscription assignment. It does not
  grant plan-gated access.
- A human administrator assigns `FREE`, `ADVANCED`, or `PROFESSIONAL` and changes
  account roles in `/admin/users` after signing in to the Soar panel.
- External Bearer-only clients, including a legacy token copied into Cookie,
  cannot use role or plan mutation routes. Do not issue an administrator
  browser session to a delegated client.
- Sessions issued before the signed human-session audience change must sign in
  again. An old cookie is rejected; moving it to another header never upgrades it.
- There is no current self-service checkout or in-app payment. The old
  `/dashboard/profile/subscription/checkout-intents` route returns 404.

## Assign a plan or change a role

1. Open `/admin/users` in an administrator browser session.
2. Find the intended account and verify its current role and active plan. A new
   account displays no active subscription.
3. Select the plan or role, review the panel confirmation, and submit once.
4. Read back the target row. A plan assignment has source `ADMIN_OVERRIDE`;
   role changes invalidate the target's existing sessions.
5. Confirm the corresponding `admin.user.plan_assigned` or
   `admin.user.role_changed` audit entry contains the actor and old/new state.
   Do not put credentials or personal notes in the audit metadata.
6. Have the user reload the profile subscription view. It must show the selected
   active plan, or `null` before any assignment. Check one permitted and one
   denied plan-gated action as appropriate.

The panel calls `PATCH /admin/users/:userId`. API credentials alone do not grant
permission to perform this operation. The server prevents self-demotion and
demotion of the last administrator.

## Edit the plan catalog

1. Open `/admin/subscriptions` in the administrator browser session.
2. Edit the selected plan's active state, display name, price fields, or
   entitlement limits. Stored price fields are catalog data, not a payment path.
3. Save, read back the plan row, and verify the
   `admin.subscription_plan.updated` audit entry.

## Existing data and rollout

- Do not delete `PaymentIntent` records or payment/assignment enums merely to
  disable checkout. They document historical attempts and provider references.
- Before changing legacy access, inventory active `DEFAULT`, `CHECKOUT`, and
  `ADMIN_OVERRIDE` assignments and accounts with active bots. A human
  administrator must decide the disposition of each ambiguous legacy account.
- Deploy code that stops automatic assignments before any approved data
  migration, then read back counts and representative accounts after migration.
- An application code test does not prove production behavior. Verify the
  signed-in user and admin journeys in the deployed environment separately.

Contract: `docs/architecture/reference/subscription-tier-entitlements-contract.md`.
