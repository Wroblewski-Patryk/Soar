# LUC-5863 Account And Subscription Proof-Link Reconciliation

## Header
- ID: LUC-5863
- Title: Account access and subscription proof-link reconciliation from app-completion baseline
- Task Type: verification
- Current Stage: verification
- Status: DONE
- Owner: Core Backend Engineer
- Parent: [LUC-5860](/LUC/issues/LUC-5860)
- Priority: critical
- Mission ID: LUC-5863-ACCOUNT-SUBSCRIPTION-PROOF-LINK-RECONCILIATION-2026-06-28

## Context
`docs/status/app-completion-index.md` generated on 2026-06-28 reports large
Account access and Subscription/entitlement missing-link counts. This task
separates real backend/API risk from scanner-linkage noise for the backend
auth/session and subscription/entitlement surfaces.

## Goal
Confirm whether current backend/API proof exists for the account-access and
subscription/entitlement flows, identify real gaps, and avoid opening duplicate
repair issues for scanner-only linkage noise.

## Scope
- `apps/api/src/modules/auth`
- `apps/api/src/modules/subscriptions`
- `apps/api/src/modules/profile/subscription`
- `apps/api/src/modules/admin/subscriptionPlans`
- `apps/api/src/modules/admin/users`
- `apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts`
- `apps/api/src/router`
- `docs/status/app-completion-index.md`
- prior proof artifacts for [LUC-5634](/LUC/issues/LUC-5634) and [LUC-5635](/LUC/issues/LUC-5635)

## Constraints
- No feature behavior edits unless a concrete failing proof required a narrow fix.
- No push, deploy, restart, protected production smoke, account/subscription
  mutation, payment mutation, secret readback, exchange mutation, order,
  position, or live-trading action.
- Preserve the existing shared dirty/divergent worktree.

## Definition Of Done
- [x] App-completion account/subscription rows reviewed.
- [x] Backend route/service/test ownership inspected.
- [x] Focused backend proof rerun locally.
- [x] Scanner-only linkage noise separated from real backend risk.
- [x] Final issue disposition can be set to `done`.

## Verification Evidence
- Started task-owned local infra because Postgres/Redis were not listening:
  `pnpm run go-live:infra:up`.
- Focused backend command:
  `pnpm --filter api exec vitest run src/modules/auth/auth.cookie.test.ts src/modules/auth/auth.errors.test.ts src/modules/auth/auth.jwt.test.ts src/modules/auth/auth.session.test.ts src/modules/auth/sessionToken.test.ts src/middleware/requireAuth.test.ts src/modules/auth/auth.e2e.test.ts src/modules/auth/auth.service.test.ts src/modules/admin/users/users.e2e.test.ts src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts src/modules/subscriptions/subscriptionEntitlements.service.test.ts src/modules/profile/subscription/subscription.e2e.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts --run --reporter=dot`
- Result: PASS, `13` files / `61` tests.
- Prior linked proof:
  - [LUC-5634](/LUC/issues/LUC-5634): Account access API/Web proof passed and linked existing production auth-session browser proof.
  - [LUC-5635](/LUC/issues/LUC-5635): Subscription/admin/profile/bot entitlement API proof passed (`5` files / `27` tests) and Web proof passed (`4` files / `10` tests).

## Reconciliation Findings
- Account access backend behavior is currently verified, not a real backend
  gap. The route and service surfaces for `/auth/register`, `/auth/login`,
  `/auth/me`, `/auth/logout`, session cookies, JWT rotation, session token
  extraction, and `requireAuth` fail-closed behavior are covered by the focused
  API pack rerun in this task.
- Subscription/entitlement backend behavior is currently verified, not a real
  backend gap. Profile subscription readback, checkout-intent creation,
  admin subscription-plan access/update boundaries, admin user subscription
  assignment, entitlement schema validation, bot-limit enforcement, and LIVE
  entitlement downgrade fail-closed paths are covered by the focused API pack.
- The app-completion missing-link counts are scanner-linkage noise for these
  core backend surfaces. Architecture registry test nodes already link the
  aggregate tests:
  `SOAR-TEST-API-AUTH-SESSION-DEEP`,
  `SOAR-TEST-API-AUTH-SERVICE`,
  `SOAR-TEST-SUBSCRIPTIONS-ADMIN-API`, and
  `SOAR-TEST-SUBSCRIPTIONS-ENTITLEMENTS`.
- No concrete backend defect was found that warrants a repair issue from this
  heartbeat.

## Real Gaps / Residual Risk
- Scanner relation precision remains noisy: app-completion still labels many
  implementation symbols, helper functions, migrations, and transitive bot
  auth/subscription touchpoints as missing direct links even when aggregate
  proof exists.
- Production subscription/payment mutation and protected Stripe/provider proof
  remain intentionally excluded and approval-gated; this task does not claim
  live payment proof.
- Browser/screenshot review rows remain outside this Core Backend Engineer
  issue and should stay with QA/Frontend lanes if future app-completion passes
  require UI proof.

## Source-Control / Deploy
- Repo: `C:\Personal\Projekty\Aplikacje\Soar`.
- Branch state before task artifact: `main...origin/main [ahead 15, behind 2]`.
- Pre-existing dirty worktree contained many state/evidence/code paths from
  other lanes.
- Files changed by this task: this task artifact only.
- Commit: not created because the shared worktree is already mixed dirty and
  divergent.
- Push/deploy impact: none.
