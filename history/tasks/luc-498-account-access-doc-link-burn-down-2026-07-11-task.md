# LUC-498 Account Access Doc-Link Burn-Down

## Context

[LUC-498](/LUC/issues/LUC-498) was assigned to Documentation Steward to burn down July app-completion documentation-link gaps for Account access. The wake payload had no pending comments and did not require a thread refetch. The issue was already checked out by the harness.

## Goal

Resolve one bounded Account access missing-doc-link row or tightly related batch using existing source, tests, and canonical documentation evidence.

## Constraints

- Stay inside Soar/Roost app-factory scope under [LUC-25](/LUC/issues/LUC-25).
- Documentation/source-truth only.
- Do not run protected auth smoke, read secrets, deploy, restart, rollback, mutate production/account/exchange/payment/subscription state, place orders, open positions, or perform LIVE trading actions.
- Use existing docs and graph mechanisms; no new framework or workaround path.

## Definition of Done

- A bounded Account access doc-link row/batch is removed from the priority gap queue.
- Architecture-awareness, app-completion, and project-truth indexes are refreshed.
- Focused proof for any promoted behavior relation is recorded.
- Residual next Account access row and owner are named.

## Forbidden

- Production/protected credential access.
- Secret values in files, comments, logs, screenshots, artifacts, or issue updates.
- Push, deploy, restart, rollback, or database migration.
- LIVE trading/order/position mutation.

## Delivery Stage

- Current stage: verification
- Output: local source-truth update plus evidence packet.

## Implementation

- Added Account access classification rows to `docs/modules/api-auth.md` for:
  - `auth.cookie.ts#getSessionCookieBaseOptions`
  - `auth.controller.ts#clearSessionCookie`
  - `auth.controller.ts#login`
  - `auth.controller.ts#logout`
  - `auth.controller.ts#me`
  - `auth.controller.ts#register`
  - `auth.controller.ts#setSessionCookie`
- Added direct doc relations in `docs/architecture/relations/documentation-links.csv`.
- Added direct proof relation in `docs/architecture/relations/priority-test-links.csv` for `getSessionCookieBaseOptions -> auth.cookie.test.ts`.
- Added a verified entity override for `getSessionCookieBaseOptions` in `docs/architecture/scanner-overrides.json`.

## Verification

- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar` -> PASS, `entities=10694`, `relations=34822`, `entityOverridesApplied=10`.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar` -> PASS, `missingDocLink=1994`, `riskItems=3533`.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply` -> PASS, first gap advanced to `apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv`.
- `corepack pnpm --filter api exec vitest src/modules/auth/auth.cookie.test.ts --run` -> PASS, `1` file / `5` tests.
- Targeted readback: the seven selected rows have no remaining priority rows and no remaining project-truth gaps.
- `git diff --check` -> PASS with CRLF normalization warnings only.

## Result Report

Status: `DONE / DOC_LINK_BATCH_RESOLVED / APP_COMPLETION_REFRESHED / FOCUSED_COOKIE_PROOF_PASS / NO_RUNTIME_MUTATION`.

Evidence: `history/evidence/luc-498-account-access-doc-link-burn-down-2026-07-11.md`.

Residual: next Account access doc-link row is `apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv`, owned by Docs Memory Lead + Project Manager as a separate bounded source-truth row.
