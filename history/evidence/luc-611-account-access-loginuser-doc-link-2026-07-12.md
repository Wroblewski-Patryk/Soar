# LUC-611 Account Access loginUser Doc-Link Evidence

Date: 2026-07-12
Owner: 04 DSM (Documentation Steward)
Issue: [LUC-611](/LUC/issues/LUC-611)

## Scope

Resolve the current project-truth Account access `missing_doc_link` row for
`apps/api/src/modules/auth/auth.service.ts#loginUser`.

## Changed

- Added `loginUser` source-truth classification to `docs/modules/api-auth.md`.
- Added `apps/api/src/modules/auth/auth.service.ts#loginUser` to
  `docs/architecture/relations/documentation-links.csv`.
- Added a scanner `documents` relation override from `docs/modules/api-auth.md`
  to `apps/api/src/modules/auth/auth.service.ts#loginUser`.
- Regenerated architecture-awareness, app-completion, and project-truth
  outputs.

## Verification

- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `entities=10734`
  - `relations=35005`
  - `relationOverridesApplied=5`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS after one transient Windows file-open retry
  - `missingDocLink=1989`
  - `implementedNeedsProof=114`
  - `riskItems=3529`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
  - PASS
  - first gap advanced to `Account access: loginUser has app-completion risk implemented_needs_proof`
  - next owner: `QA Regression Lead + Project Manager`
  - next action: run and record fresh proof for the implemented behavior, then update completion/project-truth indexes.

## Result

`apps/api/src/modules/auth/auth.service.ts#loginUser` is no longer the current
Account access `missing_doc_link` row. The same entity now requires QA proof as
`implemented_needs_proof`, which is outside DSM doc-link ownership.

Follow-up: [LUC-613](/LUC/issues/LUC-613) is assigned to Test Automation
Engineer for the focused `loginUser` proof row.

## Boundary

No runtime auth code, deploy, push, restart, rollback, env edit, migration,
protected credential access, secret/account value disclosure, DB/Redis mutation,
exchange/payment/subscription mutation, order, position, bot activation, or LIVE
trading action occurred.
