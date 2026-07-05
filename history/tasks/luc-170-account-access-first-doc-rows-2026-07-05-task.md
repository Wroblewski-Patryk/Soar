# LUC-170 Account Access First Doc Rows

## Header
- ID: LUC-170
- Title: Burn down first Account access app-completion proof/doc rows
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: none for this doc-link slice
- Priority: P1
- Module Confidence Rows: Account access / Auth session / API auth middleware / app-completion truth
- Requirement Rows: REQ-DOC-026; QA-004
- Quality Scenario Rows: QA-004
- Risk Rows: RISK-018
- Iteration: 2026-07-05
- Operation Mode: BUILDER
- Mission ID: LUC-170-ACCOUNT-ACCESS-FIRST-DOC-ROWS-2026-07-05
- Mission Status: VERIFIED

## Context
Project truth currently routes the first Account access gaps to two missing
documentation links for helper functions already covered by middleware tests:
`apps/api/src/middleware/requireAuth.test.ts#expectSessionCookieCleared` and
`apps/api/src/middleware/requireTrustedOrigin.test.ts#createSessionCookie`.

This DSM slice owns documentation/source-of-truth linkage only. Runtime proof
rows that remain after the doc links are restored stay outside this issue.

## Goal
Add direct canonical doc links for the first two Account access missing-doc-link
rows, refresh architecture/app-completion/project-truth indexes, and leave the
next queue state accurate for the remaining proof backlog.

## Constraints
- Do not modify runtime code.
- Do not read secrets, production accounts, cookies, or protected response bodies.
- Do not push, deploy, restart, rollback, mutate DB/provider state, subscriptions, exchange settings, orders, positions, or live-trading state.
- Preserve unrelated dirty workspace changes.

## Definition of Done
- `expectSessionCookieCleared` has direct documentation evidence.
- `createSessionCookie` has direct documentation evidence.
- App-completion readback confirms `hasDoc=true` for both targeted rows.
- Project-truth indexes are refreshed and point to the next non-doc gap.
- Verification commands and source-control disposition are recorded.

## Implementation
- Added direct `documentation-links.csv` relations for both helper entities to `docs/modules/api-auth.md`.
- Extended the API auth doc-link classification table with explicit helper ownership and proof expectations.
- Refreshed generated architecture-awareness exports, app-completion index, and project-truth indexes.
- Reran app-completion after project-truth initial apply because the final source-of-truth state for this lane requires the order `architecture-awareness -> app-completion -> project-truth`.

## Validation Evidence
- `corepack pnpm run architecture:graph:generate` -> pass; `656` nodes, `842` relations, `27` chains.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar` -> pass; `10617` entities, `34442` relations.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar` -> final pass; `items=3557`, `missingDocLink=1994`, `implementedNeedsProof=115`.
- `corepack pnpm run architecture:graph:drift:strict` -> pass; `850/850` covered, `0` missing.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply` -> final pass; first gap moved to `apps/api/src/middleware/requireAuth.ts#clearSession` as Account access `implemented_needs_proof`.
- Targeted readback:
  - `apps/api/src/middleware/requireAuth.test.ts#expectSessionCookieCleared`
  - `evidence.hasTest=true`
  - `evidence.hasDoc=true`
  - `risk=ok`
- Targeted readback:
  - `apps/api/src/middleware/requireTrustedOrigin.test.ts#createSessionCookie`
  - `evidence.hasTest=true`
  - `evidence.hasDoc=true`
  - `risk=ok`

## Result Report
- Fixed: the first two Account access `missing_doc_link` rows are resolved for `expectSessionCookieCleared` and `createSessionCookie`.
- Remaining: the first Account access gap is now the proof-owned row `apps/api/src/middleware/requireAuth.ts#clearSession` with `risk=implemented_needs_proof`; broader Account access proof/test/doc backlog remains open.
- Files changed:
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/modules/api-auth.md`
  - generated architecture/status index files
  - task/state ledger files for this checkpoint
- Source control: not committed; checkout was already dirty/divergent and contained unrelated changes before this heartbeat.
- Push status: not needed.
- Deploy impact: none.
- Residual risk: this DSM slice only burned down documentation rows; runtime behavior proof and missing-test rows remain separate owner paths.
