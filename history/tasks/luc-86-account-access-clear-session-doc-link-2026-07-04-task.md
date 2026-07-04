# Task

## Header
- ID: LUC-86
- Title: Account access clearSession missing doc-link reconciliation
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: none for the doc-link fix; LUC-93 for the remaining proof row
- Priority: P1
- Module Confidence Rows: Account access / Auth session / API auth routes / app-completion truth
- Requirement Rows: REQ-DOC-026; QA-004
- Quality Scenario Rows: QA-004
- Risk Rows: RISK-018
- Iteration: 2026-07-04
- Operation Mode: BUILDER
- Mission ID: LUC-86-ACCOUNT-ACCESS-CLEARSESSION-DOC-LINK-2026-07-04
- Mission Status: VERIFIED

## Context
LUC-86 was dispatched from project truth because `docs/status/app-completion-index.json` reported `apps/api/src/middleware/requireAuth.ts#clearSession` in the Account access flow with risk `missing_doc_link`.

The role-owned scope was documentation/source-of-truth linkage. Runtime behavior proof belongs to QA/Test Automation when the row no longer lacks documentation.

## Goal
Link the exact `clearSession` entity to the canonical API auth documentation, refresh the architecture/app-completion/project-truth indexes, and route any remaining non-doc proof gap to the correct owner.

## Constraints
- Do not modify runtime code.
- Do not read secrets, production accounts, cookies, or protected response bodies.
- Do not push, deploy, restart, rollback, mutate DB/provider state, subscriptions, exchange settings, orders, positions, or live-trading state.
- Preserve unrelated dirty workspace changes.

## Definition of Done
- `clearSession` has direct documentation evidence.
- App-completion readback confirms `hasDoc=true` for the targeted row.
- Project-truth indexes are refreshed.
- Any remaining non-doc proof gap is owned by a follow-up issue.
- Verification commands and source-control disposition are recorded.

## Implementation
- Added `apps/api/src/middleware/requireAuth.ts#clearSession -> docs/modules/api-auth.md` to `docs/architecture/relations/documentation-links.csv`.
- Added the same fragment to the `docs/modules/api-auth.md` architecture-awareness doc-link classification table.
- Refreshed generated architecture-awareness exports, app-completion index, and project-truth index family.
- Created QA follow-up [LUC-93](/LUC/issues/LUC-93) because the row moved from `missing_doc_link` to `implemented_needs_proof`.

## Validation Evidence
- `corepack pnpm run architecture:graph:generate` -> pass; `656` nodes, `842` relations, `27` chains.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar` -> pass; `10593` entities, `34027` relations.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar` -> pass; `missingDocLink` changed from `1998` to `1996`.
- Targeted readback:
  - `apps/api/src/middleware/requireAuth.ts#clearSession`
  - `evidence.hasTest=true`
  - `evidence.hasDoc=true`
  - `risk=implemented_needs_proof`
- `corepack pnpm run architecture:graph:drift:strict` -> pass; `850/850` covered, `0` missing.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply` -> pass; project-truth first gap is now the same entity as `implemented_needs_proof`, owned by QA Regression Lead + Project Manager.

## Result Report
- Fixed: the LUC-86 `missing_doc_link` condition is resolved for `requireAuth.ts#clearSession`.
- Remaining: behavior proof remains required as `implemented_needs_proof`; delegated to [LUC-93](/LUC/issues/LUC-93).
- Files changed:
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/modules/api-auth.md`
  - generated architecture/status index files
  - this task record and project state ledgers
- Source control: not committed; checkout was already dirty/divergent and this heartbeat added scoped docs/index/state evidence only.
- Push status: not needed.
- Deploy impact: none.
- Residual risk: app-completion remains broadly incomplete; this issue only resolved the specific DSM missing-doc-link row.
