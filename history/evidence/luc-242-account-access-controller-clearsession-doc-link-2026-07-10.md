# LUC-242 Account Access Controller ClearSession Doc-Link Evidence

## Summary

Resolved one Account access app-completion documentation-link row:
`apps/api/src/modules/auth/auth.controller.ts#clearSession`.

## Affected Capability / Chain / Files

- Capability: Account access / API auth controller session clearing.
- Chain: Auth session login/logout/current-user chain.
- Source entity:
  `apps/api/src/modules/auth/auth.controller.ts#clearSession`.
- Owner documentation:
  `docs/modules/api-auth.md`.
- Graph source of truth:
  `docs/architecture/scanner-overrides.json`.
- Generated readbacks:
  `docs/graphs/architecture-awareness.*`,
  `docs/status/app-completion-index.*`,
  `docs/status/project-truth-index.*`,
  and related status exports.

## Change

- Added the `auth.controller.ts#clearSession` row to the API auth
  architecture-awareness doc-link classification table.
- Added one `documents` relation override from `docs/modules/api-auth.md` to
  `apps/api/src/modules/auth/auth.controller.ts#clearSession`.
- Regenerated architecture-awareness, app-completion, and project-truth indexes.

## Readback

- Architecture-awareness generation completed with `10654` entities and
  `34642` relations.
- Override summary: `entityOverridesApplied=3`,
  `relationOverridesApplied=1`.
- App-completion reports `3557` items and `3539` risk items:
  `missingDocLink=1994`, `missingTestLink=980`,
  `implementedNeedsProof=113`.
- Project-truth first gap advanced to
  `apps/api/src/modules/auth/auth.controller.ts#clearSessionCookie` with risk
  `missing_test_link`, owned by Test Automation Engineer + QA Regression Lead.

## Boundary

No product code, runtime behavior, production protected smoke, secret/account
readback, deploy, push, restart, rollback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position, or live-trading action
was performed.

## Regression Risk

Low. The change adds one explicit graph relation and a module-doc
classification row. Remaining risk is generated-index churn from the approved
graph generators.

## Follow-Up Gap

Next Account access row is test-owned:
`apps/api/src/modules/auth/auth.controller.ts#clearSessionCookie` as
`missing_test_link`.
