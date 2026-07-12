# LUC-539 Account Access Auth JWT getJwtSecrets Doc-Link

Date: 2026-07-11

## Scope

Documentation Steward source-truth repair for one Account access
`missing_doc_link` row:
`apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets`.

No runtime code, schema, migration, deployment, restart, rollback, protected
credential access, secret/account value readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position, or LIVE trading action
occurred.

## Change

- Added the `auth.jwt.ts#getJwtSecrets` classification row to
  `docs/modules/api-auth.md`.
- Added the direct documentation relation:
  `apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets,docs/modules/api-auth.md`
  in `docs/architecture/relations/documentation-links.csv`.
- Added a scanner `documents` relation override from `docs/modules/api-auth.md`
  to `apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets`.
- Regenerated architecture-awareness, app-completion, and project-truth status
  outputs.

## Verification

- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `entities=10706`
  - `relations=34882`
  - `entityOverridesApplied=10`
  - `relationOverridesApplied=2`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `items=3558`
  - `missingDocLink=1992`
  - `riskItems=3532`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
  - PASS
  - public probes passed: `web_home`, `web_build_info`, `api_health`,
    `api_ready`
  - first project-truth gap changed from `missing_doc_link` to
    `implemented_needs_proof` for
    `apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets`.
- `corepack pnpm run architecture:graph:drift:strict`
  - PASS, `850/850` covered and `0` missing.
- `git diff --check`
  - PASS with CRLF normalization warnings only.

## QA Follow-Up

The doc-link risk is resolved, but fresh project truth now requires proof for
the implemented helper. DSM created [LUC-541](/LUC/issues/LUC-541) for Test
Automation Engineer to verify or route the smallest proof.

Attempted local proof command:

```powershell
corepack pnpm --filter api test -- src/modules/auth/auth.jwt.test.ts
```

Result: timed out after 120 seconds in this DSM heartbeat. No lingering
test-owned `node` or `pnpm` process was found after the timeout. This timeout
is recorded as an incomplete QA proof, not as a product behavior failure.

## Result

`DONE / DOC_LINK_RESOLVED / APP_COMPLETION_REFRESHED /
PROJECT_TRUTH_ADVANCED_TO_QA_PROOF / FOLLOW_UP_LUC-541_CREATED /
NO_RUNTIME_MUTATION`.

## Residual

[LUC-541](/LUC/issues/LUC-541) owns the remaining
`implemented_needs_proof` row for
`apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets`.
