# API Deep-Dive: Profile Module

## Metadata
- Module name: `profile`
- Layer: `api`
- Source path: `apps/api/src/modules/profile`
- Owner: backend/core
- Last updated: 2026-05-09
- Related planning task: `DCP-04`

## 1. Purpose and Scope
- Owns authenticated user profile surfaces under dashboard scope:
  - basic profile + UI preferences
  - security actions (password/account deletion)
  - API key lifecycle and exchange connection tests
  - active subscription view + checkout intent bootstrap

Out of scope:
- Admin-managed user mutations.
- Exchange order execution (orders/exchange modules).

## 2. Boundaries and Dependencies
- Mounted under `/dashboard/profile/*` via `apps/api/src/router/dashboard.routes.ts`.
- Account access reaches the authenticated profile security surface through
  `apps/api/src/router/dashboard.routes.ts#/profile/security`, which
  delegates password-rotation and account-deletion routes to this module after
  the shared dashboard auth gate succeeds.
- Account access reaches the authenticated profile API-key surface through
  `apps/api/src/router/dashboard.routes.ts#/profile/apiKeys`, which delegates
  the API-key lifecycle and connection-test routes to this module after the
  shared dashboard auth gate succeeds.
- Protected by global `requireAuth` on dashboard router.
- Depends on:
  - `prisma` persistence.
  - `users/publicUser` projection contract.
  - `subscriptions.service` for catalog/default subscription alignment.
  - exchange capability/probe helpers for API-key tests.
  - crypto helpers for encrypted API key storage.

## 3. Data and Contract Surface
- Basic profile:
  - `GET/PATCH/DELETE /dashboard/profile/basic`.
  - merges `uiPreferences` safely with table column visibility normalization.
- Security:
  - `PATCH /dashboard/profile/security/password`
  - `DELETE /dashboard/profile/security/account`
- API keys:
  - `GET/POST/PATCH/DELETE /dashboard/profile/apiKeys`
  - `POST /dashboard/profile/apiKeys/test`
  - `POST /dashboard/profile/apiKeys/:id/test`
  - `POST /dashboard/profile/apiKeys/:id/rotate`
  - `POST /dashboard/profile/apiKeys/:id/revoke`
- Subscription:
  - `GET /dashboard/profile/subscription`
  - `POST /dashboard/profile/subscription/checkout-intents`

## 4. Runtime Flows
- Basic profile update:
  1. Read current `uiPreferences`.
  2. Normalize incoming map payloads.
  3. Merge and persist with selected profile fields.
- API key create/test:
  1. Encrypt key/secret at write time.
  2. Execute capability-aware connection probe through the shared
     exchange-aware probe service.
  3. Write audit-safe connection test log metadata.
  4. Binance and Gate.io provided/stored connection probes are supported.
     Gate.io probe support is credential validation only; wallet balance
     preview is owned by the wallets module, while positions/open-orders/
     trade-history snapshots, live submit, and exchange-side cancel remain
     outside this profile module contract.
- Security operations:
  - password change increments `sessionVersion`.
  - account deletion cascades through related domain entities in transaction.

## 5. API and UI Integration
- Dashboard settings and onboarding flows consume these endpoints for profile/security/exchange/subscription panels.
- API-key test routes back LIVE readiness UX in profile and bot setup flows.

## 6. Security and Risk Guardrails
- API key secrets are encrypted at rest; public responses expose masked key values only.
- Sensitive profile routes are rate-limited (`user`/`user_exchange` scopes).
- Security actions require current password verification.
- Account deletion clears dependent runtime/trading entities before user removal.

## 7. Observability and Operations
- API key tests write structured audit entries (`profile.api_key.test_connection`).
- Stage abuse throttling coverage exists for profile-sensitive endpoints.

## 8. Test Coverage and Evidence
- Primary tests:
  - `apps/api/src/modules/profile/basic/basic.e2e.test.ts`
  - `apps/api/src/modules/profile/security/security.e2e.test.ts`
  - `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts`
  - `apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts`
  - `apps/api/src/modules/profile/subscription/subscription.e2e.test.ts`
  - `apps/api/src/modules/profile/stage-abuse-throttling.e2e.test.ts`
- Suggested validation command:
```powershell
pnpm --filter api test -- src/modules/profile/basic/basic.e2e.test.ts src/modules/profile/security/security.e2e.test.ts src/modules/profile/apiKey/apiKey.e2e.test.ts src/modules/profile/subscription/subscription.e2e.test.ts src/modules/profile/stage-abuse-throttling.e2e.test.ts
```

## 9. Open Issues and Follow-Ups
- Replace remaining string-matched errors with typed error taxonomy.
- Continue reducing duplicated validation logic between profile subdomains where feasible.

## 10. Architecture-Awareness Doc-Link Classification

Last classified: 2026-06-05 under [LUC-2163](/LUC/issues/LUC-2163).

| Source entity | Owner doc | Classification | Expected proof |
| --- | --- | --- | --- |
| `ProfileSecurityDomainError` | `docs/modules/api-profile.md` | Typed profile-security error taxonomy for password/account security fail-closed behavior. | Architecture-awareness `documents` relation from this doc plus focused profile security e2e tests when behavior changes. |
| `apps/api/src/modules/profile/security/security.errors.ts` | `docs/modules/api-profile.md` | Profile-security error taxonomy file for password/account-deletion fail-closed behavior. | Architecture-awareness `documents` relation from this doc plus focused profile security e2e tests when behavior changes. |
| `apps/api/src/router/dashboard.routes.ts#/profile/security` | `docs/modules/api-profile.md` | Authenticated dashboard router mount that delegates profile password-rotation and account-deletion flows into this module without a dashboard-specific controller. | Direct doc relation plus profile security e2e coverage when mount behavior changes. |
| `apps/api/src/modules/profile/apiKey/apiKey.controller.ts#testConnection` | `docs/modules/api-profile.md` | Profile API-key provided-credential connection-test controller surface. [LUC-6106](/LUC/issues/LUC-6106) added a direct doc link for the already-tested support row. | Profile API-key e2e and probe service tests when connection-test behavior changes. |
| `apps/api/src/modules/profile/apiKey/apiKey.controller.ts#testStoredConnection` | `docs/modules/api-profile.md` | Profile API-key stored-credential connection-test controller surface. [LUC-6106](/LUC/issues/LUC-6106) added a direct doc link for the already-tested support row. | Profile API-key e2e and probe service tests when stored connection-test behavior changes. |
| `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts` | `docs/modules/api-profile.md` | Primary DB-backed profile API-key lifecycle proof packet. [LUC-6106](/LUC/issues/LUC-6106) added direct doc links for test helper rows that scanner classified under User configuration. | Rerun profile API-key e2e after local DB availability is restored. |
| `apps/api/src/modules/profile/apiKey/apiKey.service.ts#writeApiKeyTestAudit` | `docs/modules/api-profile.md` | Audit-safe profile API-key connection-test log metadata writer. [LUC-6106](/LUC/issues/LUC-6106) added a direct doc link for the support row. | Profile API-key e2e/probe proof when audit metadata behavior changes. |
| `apps/api/src/modules/profile/apiKey/apiKey.types.ts` | `docs/modules/api-profile.md` | Profile API-key request/response validation boundary. [LUC-6106](/LUC/issues/LUC-6106) added a direct doc link for the API-key type row. | Profile API-key e2e and DTO validation proof when API-key payload contracts change. |
| `apps/api/src/router/dashboard.routes.ts#/profile/apiKeys` | `docs/modules/api-profile.md` | Authenticated dashboard router mount that delegates the profile API-key lifecycle and connection-test surface into this module without a dashboard-specific controller. | Direct doc relation plus profile API-key e2e coverage when mount behavior changes. |

## 21. Architecture-Awareness Test-Link Classification

Last classified: 2026-06-05 under [LUC-2187](/LUC/issues/LUC-2187).

| Source entity | Focused test | Classification |
| --- | --- | --- |
| `apps/api/src/utils/crypto.ts` | `apps/api/src/utils/crypto.test.ts` | Existing focused crypto utility coverage verifies AES-GCM versioned encryption/decryption, legacy CBC read compatibility, active-version key selection, and fail-closed legacy-only writes. `LUC-2187` added a direct scanner-readable test relation. |
