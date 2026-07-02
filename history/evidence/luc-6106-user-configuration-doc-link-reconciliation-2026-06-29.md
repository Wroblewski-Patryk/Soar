# LUC-6106 User Configuration Doc-Link Reconciliation

Date: 2026-06-29

## Scope

- Issue: [LUC-6106](/LUC/issues/LUC-6106)
- Parent: [LUC-6097](/LUC/issues/LUC-6097)
- Flow: User configuration
- Lane: Documentation Steward
- Boundary: documentation/source-of-truth and generated architecture/app-
  completion evidence only. No product code, production mutation, deploy,
  restart, protected smoke, secret/account readback, exchange/payment mutation,
  order, position, or live-trading action.

## Result

Reconciled User configuration API/support doc-link rows that [LUC-6097](/LUC/issues/LUC-6097)
had already proved or attempted through focused API tests.

- Added `19` curated documentation links in
  `docs/architecture/relations/documentation-links.csv`.
- Linked API platform config support rows to `docs/modules/api-root.md`.
- Linked profile API-key support rows to `docs/modules/api-profile.md`.
- Updated both owner docs with classification notes so future agents do not
  rediscover the same relation gap.

## Rows Linked

API platform config rows linked to `docs/modules/api-root.md`:

- `apps/api/src/config/criticalSecretsReadiness.test.ts`
- `apps/api/src/config/criticalSecretsReadiness.test.ts#resetEnv`
- `apps/api/src/config/criticalSecretsReadiness.test.ts#setBaseline`
- `apps/api/src/config/criticalSecretsReadiness.ts#asNonEmpty`
- `apps/api/src/config/criticalSecretsReadiness.ts#looksWeakSecret`
- `apps/api/src/config/proxyTrust.test.ts`
- `apps/api/src/config/proxyTrust.test.ts#restoreEnv`
- `apps/api/src/config/proxyTrust.ts#isPrivateIpv4`
- `apps/api/src/config/proxyTrust.ts#isPrivateIpv6`
- `apps/api/src/config/proxyTrust.ts#parseExplicitTrustedProxyIps`
- `apps/api/src/config/runtimeExecution.test.ts`
- `apps/api/src/config/runtimeExecution.ts#parseBoolean`

Profile API-key rows linked to `docs/modules/api-profile.md`:

- `apps/api/src/modules/profile/apiKey/apiKey.controller.ts#testConnection`
- `apps/api/src/modules/profile/apiKey/apiKey.controller.ts#testStoredConnection`
- `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts`
- `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts#resetApiKeyE2eDatabase`
- `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts#sleep`
- `apps/api/src/modules/profile/apiKey/apiKey.service.ts#writeApiKeyTestAudit`
- `apps/api/src/modules/profile/apiKey/apiKey.types.ts`

## Verification

PASS:

```powershell
node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar
```

Result: `entities=10086`, `relations=32917`, `files=11479`.

PASS:

```powershell
node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar
```

Result: `items=2609`, `flows=8`, `missingDocLink=589`.

User configuration before/after:

| State | Total | Missing doc link | Missing test link | Implemented needs proof | OK | Browser review |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Before [LUC-6106](/LUC/issues/LUC-6106) | 152 | 49 | 75 | 3 | 1 | 24 |
| After [LUC-6106](/LUC/issues/LUC-6106) | 160 | 30 | 81 | 13 | 12 | 24 |

The total increased because regenerated architecture-awareness now includes
newer task/evidence files. The User configuration missing-doc-link count
dropped by `19`, matching the curated API/support rows added here.

## Residual

Remaining User configuration missing-doc-link rows are outside this issue:

- Backend/API platform residual: `2` rows
  (`requireTrustedOrigin.test.ts#configureJwtForTest` and
  `paperRuntime.service.ts#validateRuntimeConfig`).
- Frontend/Web profile and Web platform residual: `28` rows.

Do not use [LUC-6106](/LUC/issues/LUC-6106) to claim DB-backed profile route
proof, browser proof, or Web profile doc-link closure. [LUC-6105](/LUC/issues/LUC-6105)
still owns local DB availability before CBE can rerun DB-backed profile
basic/security proof.
