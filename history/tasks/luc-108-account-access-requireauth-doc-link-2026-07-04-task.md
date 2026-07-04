# Task

## Header
- ID: LUC-108
- Title: Account access requireAuth missing doc-link reconciliation
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: none for this doc-link target
- Priority: P1
- Module Confidence Rows: Account access / Auth session / API auth middleware / app-completion truth
- Requirement Rows: REQ-DOC-026; QA-004
- Quality Scenario Rows: QA-004
- Risk Rows: RISK-018
- Iteration: 2026-07-04
- Operation Mode: BUILDER
- Mission ID: LUC-108-ACCOUNT-ACCESS-REQUIREAUTH-DOC-LINK-2026-07-04
- Mission Status: VERIFIED

## Context
LUC-108 was dispatched from project truth because `docs/status/app-completion-index.json` reported `apps/api/src/middleware/requireAuth.ts#requireAuth` in the Account access flow with risk `missing_doc_link`.

The role-owned scope was documentation/source-of-truth linkage. Runtime behavior proof and broader Account access proof backlog remain outside this DSM slice.

## Goal
Link the exact `requireAuth` entity to the canonical API auth documentation, refresh the architecture/app-completion/project-truth indexes, and record the remaining queue accurately.

## Constraints
- Do not modify runtime code.
- Do not read secrets, production accounts, cookies, or protected response bodies.
- Do not push, deploy, restart, rollback, mutate DB/provider state, subscriptions, exchange settings, orders, positions, or live-trading state.
- Preserve unrelated dirty workspace changes.

## Definition of Done
- `requireAuth` has direct documentation evidence.
- App-completion readback confirms `hasDoc=true` for the targeted row.
- Project-truth indexes are refreshed.
- Remaining non-target doc/proof gaps are recorded with the next owner path.
- Verification commands and source-control disposition are recorded.

## Implementation
- Added `apps/api/src/middleware/requireAuth.ts#requireAuth -> docs/modules/api-auth.md` to `docs/architecture/relations/documentation-links.csv`.
- Added the same fragment to the `docs/modules/api-auth.md` architecture-awareness doc-link classification table.
- Refreshed generated architecture-awareness exports, app-completion index, and project-truth index family.

## Validation Evidence
- `corepack pnpm run architecture:graph:generate` -> pass; `656` nodes, `842` relations, `27` chains.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar` -> pass; `10598` entities, `34052` relations.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar` -> pass; `items=3557`, `missingDocLink=1996`, `implementedNeedsProof=115`.
- Targeted readback:
  - `apps/api/src/middleware/requireAuth.ts#requireAuth`
  - `evidence.hasTest=true`
  - `evidence.hasDoc=true`
  - `risk=implemented_needs_proof`
- `corepack pnpm run architecture:graph:drift:strict` -> pass; `850/850` covered, `0` missing.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply` -> pass; first gap moved to `apps/api/src/middleware/requireAuth.test.ts#expectSessionCookieCleared` as a separate Account access `missing_doc_link` row.

## Result Report
- Fixed: the LUC-108 `missing_doc_link` condition is resolved for `apps/api/src/middleware/requireAuth.ts#requireAuth`.
- Remaining: the target now reads `implemented_needs_proof`; broader Account access doc/proof backlog remains open. The new project-truth first gap is `expectSessionCookieCleared` and belongs to Docs Memory Lead + Project Manager as a separate row.
- Files changed:
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/modules/api-auth.md`
  - generated architecture/status index files
  - this task record and project state ledgers
- Source control: not committed; checkout was already dirty/divergent and contained unrelated LUC-93 changes before this heartbeat.
- Push status: not needed.
- Deploy impact: none.
- Residual risk: app-completion remains broadly incomplete; this issue only resolved the specific DSM missing-doc-link row.
