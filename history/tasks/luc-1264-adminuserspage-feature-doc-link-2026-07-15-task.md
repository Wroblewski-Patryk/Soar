# Task

## Header
- ID: LUC-1264
- Title: Close Account access missing-doc-link for `AdminUsersPage.tsx` feature page
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: LUC-1261
- Priority: P1
- Module Confidence Rows: not updated
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation discoverability
- Risk Rows: app-completion Account access doc-link risk
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1264-ADMINUSERSPAGE-FEATURE-DOC-LINK-2026-07-15
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for mission rules.
- [x] Missing or template-like state tables were not encountered.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task improves release confidence by converting a vague docs gap into direct source-of-truth evidence plus a named generator blocker.

## Mission Block
- Mission objective: close the docs-owned `missing_doc_link` routing for `apps/web/src/features/admin/users/pages/AdminUsersPage.tsx` or prove the remaining blocker is outside the docs lane.
- Release objective advanced: the admin users feature page now has direct canonical doc linkage, and the remaining stale emission is isolated to a generator/project-truth follow-up.
- Included slices: scoped module-doc update, documentation-link registry update, generator refresh, source-of-truth readback, blocker handoff, and durable evidence/state sync.
- Explicit exclusions: runtime code changes, browser verification, deploy, push, protected account actions, and rework of the already-closed wrapper-path lane on `apps/web/src/app/admin/users/page.tsx`.
- Checkpoint cadence: one source-of-truth edit checkpoint and one generator/readback checkpoint.
- Stop conditions: both emitted indexes clear the feature-page gap, or the docs relation exists but `project-truth` remains stale and needs a generator owner.
- Handoff expectation: if `project-truth` remains stale after the docs relation is present, block this issue on a narrow generator refresh follow-up.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, Paperclip wake | issue closure and blocker routing | closeout packet | final readback | DONE |
| Architecture | coordinator | `docs/modules/web-admin.md`, `documentation-links.csv`, `architecture-awareness.json` | docs relation truth | durable feature-page doc-link repair | graph refresh | DONE |
| Implementation | coordinator | docs/state only | no runtime code | source-of-truth edits | `git diff --check` | DONE |
| QA/Test | coordinator | generator chain and targeted readback | focused verification only | split-state proof | generator refresh | DONE |
| Security/Ops/UX | omitted | not applicable | none | none | none | OMITTED |
| Documentation/Memory | coordinator | task/evidence/context files | durable memory | evidence packet and state sync | file review | DONE |
| Generator follow-up | Delivery / truth-pipeline owner | `project-truth-index` builder path | follow-up issue only | stale-ingestion repair | `LUC-1265` | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` refresh was not required for this narrow single-lane packet.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was not observed.
- [x] Process eval note was not required for this narrow docs-only slice.

## Context
`LUC-1261` delegated the remaining Account access `missing_doc_link` gap for
`apps/web/src/features/admin/users/pages/AdminUsersPage.tsx`. The browser-review
lane was already closed in `LUC-1259`, and the earlier route-wrapper docs lane
for `apps/web/src/app/admin/users/page.tsx` was already closed in `LUC-1249`
plus refreshed in `LUC-1250`. The remaining work was to add a direct canonical
doc relation for the feature page itself and verify that both emitted truth
indexes clear the same path.

## Goal
Attach the smallest durable documentation relation for
`apps/web/src/features/admin/users/pages/AdminUsersPage.tsx`, rerun the local
truth generators, and confirm the Account access queue no longer dispatches
that feature page as `missing_doc_link`.

## Success Signal
- User or operator problem: the wake named a docs-owned Account access gap on the admin users feature page.
- Expected product or reliability outcome: project truth no longer classifies the feature page as `missing_doc_link`.
- How success will be observed: `app-completion-index` and `project-truth-index` stop listing `apps/web/src/features/admin/users/pages/AdminUsersPage.tsx` as an Account access docs gap.
- Post-launch learning needed: no

## Deliverable For This Stage
A verification packet with source-truth edits, refreshed graph/status outputs,
and a blocker handoff if the stale project-truth emission survives the docs
repair.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] `docs/modules/web-admin.md` explicitly covers the admin users feature page.
- [x] `documentation-links.csv` contains the matching direct doc relation for `AdminUsersPage.tsx`.
- [x] Refreshed `architecture-awareness.json` includes a `documents` relation to `route:adminuserspage-tsx:784aa77abb`.
- [x] `docs/status/project-truth-index.{json,md}` no longer route `AdminUsersPage.tsx` as the first current gap.
- [x] The remaining stale-ingestion owner is isolated in a named follow-up issue.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`,
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`,
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`,
  `git diff --check`
- Manual checks:
  targeted readback in `docs/graphs/architecture-awareness.json`,
  `docs/status/app-completion-index.{json,md}`, and
  `docs/status/project-truth-index.{json,md}`
- Screenshots/logs:
  not applicable
- High-risk checks:
  no protected session, account mutation, deploy, or secret readback
- Module confidence ledger updated: no
- Module confidence rows closed or changed: none
- Requirements matrix updated: no
- Requirement rows closed or changed: none
- Quality scenarios updated: no
- Quality scenario rows closed or changed: none
- Risk register updated: no
- Risk rows closed or changed: none
- Reality status: verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docs/modules/web-admin.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/graphs/architecture-awareness.json`,
  `docs/status/app-completion-index.md`,
  `docs/status/project-truth-index.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none beyond refreshed generated truth

## Autonomous Loop Evidence

### 1. Analyze Current State
- `LUC-1261` baseline showed `AdminUsersPage.tsx` as `status=verified`, `hasTest=true`, `hasDoc=false`, `risk=missing_doc_link`.
- `docs/modules/web-admin.md` and `documentation-links.csv` covered the wrapper path but not the feature-page path.

### 2. Select One Priority Mission Objective
- Selected task: close the feature-page doc-link gap for `AdminUsersPage.tsx`.
- Deferred: generator-code repair, because that only becomes in-scope if the docs relation exists and the emitted project truth still stays stale.

### 3. Plan Implementation
- Files or surfaces to modify:
  `docs/modules/web-admin.md`,
  `docs/architecture/relations/documentation-links.csv`,
  generated `docs/graphs/*`,
  generated `docs/status/*`,
  `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`,
  and task/evidence files.
- Logic: add the direct module-doc relation for the feature page, rerun the generator chain, then decide whether the issue closes or blocks based on emitted readback.

### 4. Execute Implementation
- Added the feature-page coverage row to `docs/modules/web-admin.md`.
- Added the direct documentation relation row for `apps/web/src/features/admin/users/pages/AdminUsersPage.tsx`.
- Refreshed `architecture-awareness`, `app-completion`, and `project-truth`.

### 5. Verify and Test
- Ran the scoped generator chain and `git diff --check`.
- Read back the generated graph plus both status indexes.
- Result: `architecture-awareness` and `app-completion` show the doc relation as closed, and `LUC-1265` proved the fresh `project-truth` packet now advances to the next truthful gap.

### 6. Self-Review
- Existing systems were reused: canonical module docs, documentation-link registry, generated graph/status indexes, and Paperclip child-issue delegation.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge
- Updated:
  `docs/modules/web-admin.md`,
  `docs/architecture/relations/documentation-links.csv`,
  generated `docs/graphs/*`,
  generated `docs/status/*`,
  `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`,
  this task record,
  and the paired evidence note.

## Result Report
- Task summary: added the direct canonical doc link for `apps/web/src/features/admin/users/pages/AdminUsersPage.tsx`, refreshed generated truth, and closed the stale `project-truth` emission after `LUC-1265` reran the canonical refresh.
- Files changed:
  `docs/modules/web-admin.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/graphs/architecture-awareness.json`,
  `docs/graphs/architecture-awareness.csv`,
  `docs/graphs/architecture-graph.md`,
  `docs/graphs/architecture-health.json`,
  `docs/graphs/architecture-proof-register.csv`,
  `docs/status/app-completion-index.json`,
  `docs/status/app-completion-index.md`,
  `docs/status/architecture-awareness-report.md`,
  `docs/status/architecture-dependency-report.md`,
  `docs/status/architecture-ownership-report.md`,
  `docs/status/event-chain-index.json`,
  `docs/status/event-chain-index.md`,
  `docs/status/operational-readiness-index.json`,
  `docs/status/operational-readiness-index.md`,
  `docs/status/project-truth-index.json`,
  `docs/status/project-truth-index.md`,
  `docs/status/runtime-error-index.json`,
  `docs/status/runtime-error-index.md`,
  `docs/status/task-synchronization-report.md`,
  `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`,
  `history/evidence/luc-1264-adminuserspage-feature-doc-link-2026-07-15.md`,
  `history/tasks/luc-1264-adminuserspage-feature-doc-link-2026-07-15-task.md`
- How tested: scoped generator chain plus targeted readback and `git diff --check`.
- What is incomplete: nothing for this issue; the next truthful queue item is now `Dashboard overview: GET / has app-completion risk missing_test_link.`
- Next steps: parent issue `LUC-1261` can integrate this closure and move to the next queue owner.
- Decisions made: treated the docs relation as repaired locally, then waited for the narrow generator follow-up to clear the stale `project-truth` packet before closing this issue.
