# LUC-2966 Auth Security And QA Proof Task Entity Link Backfill

## Header

- ID: LUC-2966
- Title: Backfill auth-security and QA proof task/entity architecture links from LUC-2952 classification
- Task Type: documentation
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Priority: High
- Source: [LUC-2952](/LUC/issues/LUC-2952)

## Context

The [LUC-2952](/LUC/issues/LUC-2952) classification found real residual
task/entity architecture-link drift for auth/security/account surfaces and
QA/proof records. This file is a scanner-readable task record so implementation
entities can link back to a concrete Paperclip task without changing product
code.

## Architecture Links

- Primary feature/module: auth, account, admin, subscription, profile, session, API-key, and QA/proof architecture-link backfill.
- Architecture nodes:
  - `docs/architecture/nodes/SOAR-FEATURE-AUTH-SESSION.md`
  - `docs/architecture/nodes/SOAR-FEATURE-PROFILE-API-KEYS.md`
  - `docs/architecture/nodes/SOAR-FEATURE-SUBSCRIPTIONS-ADMIN.md`
  - `docs/architecture/nodes/SOAR-FEATURE-API-PLATFORM-SAFETY.md`
  - `docs/architecture/nodes/SOAR-TEST-AUTH-SESSION.md`
  - `docs/architecture/nodes/SOAR-TEST-PROFILE-API-KEYS-API.md`
  - `docs/architecture/nodes/SOAR-TEST-PROFILE-API-KEYS-WEB.md`
  - `docs/architecture/nodes/SOAR-TEST-PROFILE-SECURITY-API.md`
  - `docs/architecture/nodes/SOAR-TEST-SUBSCRIPTIONS-ADMIN-API.md`
  - `docs/architecture/nodes/SOAR-TEST-API-PLATFORM-SAFETY.md`
- Function chains:
  - `docs/architecture/chains/CHAIN-AUTH-SESSION-DEEP.md`
  - `docs/architecture/chains/CHAIN-PROFILE-API-KEYS.md`
  - `docs/architecture/chains/CHAIN-SUBSCRIPTIONS-ADMIN.md`
  - `docs/architecture/chains/CHAIN-API-PLATFORM-SAFETY.md`
- Affected auth/account/security/admin implementation files:
  - `api_endpoint:post-login:66031e164c`
  - `api_endpoint:post-logout:a5a7195fe9`
  - `api_endpoint:get-me:6a7167adbd`
  - `api_endpoint:post-register:47bef35779`
  - `api_endpoint:get:6708703663`
  - `api_endpoint:use-subscriptions-plans:b5026ab209`
  - `api_endpoint:use-users:2f4d7609a6`
  - `api_endpoint:use-profile-apikeys:680f20cf0c`
  - `api_endpoint:use-profile-basic:567948ce49`
  - `api_endpoint:use-profile-security:61552c894b`
  - `api_endpoint:use-profile-subscription:e9d8631f88`
  - `api_endpoint:use-admin:9b16797c60`
  - `api_endpoint:use-auth:ac44845d3f`
  - `model:subscriptionplans-types-ts:4223424107`
  - `model:users-types-ts:236245f459`
  - `model:auth-types-ts:5abaf9bebb`
  - `model:exchangeauthenticatedreadunsupportederror:28aa9d8b85`
  - `apps/api/src/modules/auth/auth.routes.ts#/login`
  - `apps/api/src/modules/auth/auth.routes.ts#/logout`
  - `apps/api/src/modules/auth/auth.routes.ts#/me`
  - `apps/api/src/modules/auth/auth.routes.ts#/register`
  - `apps/api/src/router/admin.routes.ts#/`
  - `apps/api/src/router/admin.routes.ts#/subscriptions/plans`
  - `apps/api/src/router/admin.routes.ts#/users`
  - `apps/api/src/router/dashboard.routes.ts#/profile/apiKeys`
  - `apps/api/src/router/dashboard.routes.ts#/profile/basic`
  - `apps/api/src/router/dashboard.routes.ts#/profile/security`
  - `apps/api/src/router/dashboard.routes.ts#/profile/subscription`
  - `apps/api/src/router/index.ts#/admin`
  - `apps/api/src/router/index.ts#/auth`
  - `apps/web/src/features/admin/layout/AdminLayoutShell.tsx`
  - `apps/web/src/features/auth/components/PasswordVisibilityToggle.tsx`
  - `apps/web/src/features/profile/components/ApiKeysList.tsx`
  - `apps/web/src/features/profile/components/BasicForm.tsx`
  - `apps/web/src/features/profile/components/Subscription.tsx`
  - `apps/web/src/ui/components/ProfileButton.tsx`
  - `apps/web/src/features/admin/subscriptions/services/adminSubscriptionPlan.service.ts`
  - `apps/web/src/features/admin/users/services/adminUsers.service.ts`
  - `apps/web/src/features/auth/hooks/useHydrationReady.ts`
  - `apps/web/src/features/auth/services/auth.service.ts`
  - `apps/web/src/features/profile/hooks/useApiKeys.ts`
  - `apps/web/src/features/profile/hooks/useUser.ts`
  - `apps/web/src/features/profile/index.ts`
  - `apps/web/src/features/profile/services/profileBasicCache.ts`
  - `apps/web/src/features/profile/services/security.service.ts`
  - `apps/web/src/features/profile/services/subscription.service.ts`
  - `apps/web/src/i18n/namespaces/admin.de-CH.ts`
  - `apps/web/src/i18n/namespaces/admin.en.ts`
  - `apps/web/src/i18n/namespaces/admin.pl.ts`
  - `apps/web/src/i18n/namespaces/admin.pt.ts`
  - `apps/web/src/i18n/namespaces/auth.de-CH.ts`
  - `apps/web/src/i18n/namespaces/auth.en.ts`
  - `apps/web/src/i18n/namespaces/auth.pl.ts`
  - `apps/web/src/i18n/namespaces/auth.pt.ts`
  - `apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.types.ts`
  - `apps/api/src/modules/admin/users/users.types.ts`
  - `apps/api/src/modules/auth/auth.types.ts`
  - `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts#ExchangeAuthenticatedReadUnsupportedError`
- Affected QA/proof task files:
  - `history/tasks/luc-1189-soar-v1-conformance-test-automation-worker-turn-acceptance-matrix-rows-into-executable-regression-checks-2026-06-01-task.md`
  - `history/tasks/luc-37-c-journey-verification-and-qa-2026-05-25-task.md`
  - `history/tasks/luc-45-d-security-boundary-readonly-proof-2026-05-25-task.md`
  - `history/tasks/luc-67-qa-verify-matched-strategy-signal-blocked-execution-reason-2026-05-25-task.md`
  - `history/tasks/luc-963-regression-proof-dca-before-close-2026-05-31-task.md`
- Tests/proof:
  - `history/evidence/luc-1189-acceptance-matrix-executable-regression-pack-2026-06-01.md`
  - `history/evidence/luc-1176-v1-acceptance-matrix-and-regression-evidence-map-2026-06-01.md`
  - `apps/api/src/modules/auth/auth.session.deep.test.ts`
  - `apps/api/src/modules/profile/apiKeys/profileApiKeys.controller.test.ts`
  - `apps/api/src/modules/profile/security/profileSecurity.controller.test.ts`
  - `apps/api/src/modules/admin/subscriptions/adminSubscriptionPlans.controller.test.ts`
  - `apps/web/src/features/profile/components/ApiKeysList.test.tsx`
  - `apps/web/src/features/profile/components/Subscription.test.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx`
- Docs updated:
  - `docs/status/task-entity-link-backfill-classification-2026-06-08.md`
  - `docs/status/task-synchronization-report.md`
  - `docs/status/architecture-awareness-report.md`

## Result Report

- Backfilled scanner-readable task links for the 37 auth/account/security/admin/profile/subscription/session implementation paths classified from [LUC-2952](/LUC/issues/LUC-2952).
- Added architecture-link blocks to five QA/proof historical task records still reported in `tasks_without_architecture`.
- No product code, protected smoke, credentials, deployment, restart, or runtime mutation was touched.
