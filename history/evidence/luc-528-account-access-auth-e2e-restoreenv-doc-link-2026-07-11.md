# LUC-528 Account Access Auth E2E RestoreEnv Doc-Link

Date: 2026-07-11

## Scope

Documentation Steward source-truth repair for one Account access
`missing_doc_link` row:
`apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv`.

No runtime code, test logic, schema, migration, deployment, restart, rollback,
protected credential access, secret/account value readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position, or LIVE trading action
occurred.

## Change

- Added the `auth.e2e.test.ts#restoreEnv` classification row to
  `docs/modules/api-auth.md`.
- Added the direct documentation relation:
  `apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv,docs/modules/api-auth.md`
  in `docs/architecture/relations/documentation-links.csv`.
- Regenerated architecture-awareness, app-completion, and project-truth status
  outputs.

## Verification

- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `entities=10699`
  - `relations=34855`
  - `entityOverridesApplied=10`
  - `relationOverridesApplied=1`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `items=3558`
  - `missingDocLink=1993`
  - `riskItems=3532`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
  - PASS
  - public probes passed: `web_home`, `web_build_info`, `api_health`,
    `api_ready`
  - first project-truth gap advanced to
    `apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets` as
    `missing_doc_link`
- Targeted readback:
  - `docs/modules/api-auth.md` contains the new `auth.e2e.test.ts#restoreEnv`
    classification.
  - `docs/architecture/relations/documentation-links.csv` contains the direct
    doc relation.
  - `docs/status/project-truth-index.md` no longer names
    `apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv`; the first row is
    now `getJwtSecrets`.
- `git diff --check`
  - PASS with CRLF normalization warnings only.

## Result

`DONE / DOC_LINK_RESOLVED / APP_COMPLETION_REFRESHED / PROJECT_TRUTH_ADVANCED /
NO_RUNTIME_MUTATION`.

## Residual

The next Account access documentation-link row is
`apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets`, owned by Docs Memory Lead
+ Project Manager as a separate source-truth row.
