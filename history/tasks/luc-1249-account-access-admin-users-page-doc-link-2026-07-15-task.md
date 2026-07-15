# Task

## Header
- ID: LUC-1249
- Title: Prove Account access missing-doc-link for `apps/web/src/app/admin/users/page.tsx`
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: none
- Priority: P1
- Module Confidence Rows: not updated
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation discoverability
- Risk Rows: app-completion Account access doc-link risk
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1249-ACCOUNT-ACCESS-ADMIN-USERS-PAGE-DOC-LINK-2026-07-15
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
- [x] The task improves release confidence by turning an app-completion claim into inspectable proof.

## Mission Block
- Mission objective: close the docs-owned `missing_doc_link` routing for `apps/web/src/app/admin/users/page.tsx`.
- Release objective advanced: future agents can reason from direct module-doc coverage instead of redispatching the admin users route wrapper as an Account access docs gap.
- Included slices: scoped module-doc update, documentation-link registry update, scanner override update, generator refresh, source-of-truth readback, evidence/state sync.
- Explicit exclusions: runtime code changes, browser verification, deploy, push, protected account actions, and closure of the `AdminUsersPage.tsx` browser-review lane.
- Checkpoint cadence: one source-of-truth edit checkpoint and one generator/readback checkpoint.
- Stop conditions: the route wrapper disappears from Account access `missing_doc_link` routing or an exact generator mismatch is proven.
- Handoff expectation: next generated gap advances to the correct non-doc owner lane.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, Paperclip wake | issue closure and integration | closeout packet | final readback | DONE |
| Architecture | coordinator | `docs/modules/web-admin.md`, `documentation-links.csv`, `scanner-overrides.json` | docs relation truth | durable doc-link repair | graph refresh | DONE |
| Implementation | coordinator | docs/state only | no runtime code | source-of-truth edits | `git diff --check` | DONE |
| QA/Test | coordinator | existing route proof plus generator replay | focused readback only | closure proof | generator chain | DONE |
| Security/Ops/UX | omitted | not applicable | none | none | none | OMITTED |
| Documentation/Memory | coordinator | task/evidence/context files | durable memory | evidence packet and state sync | file review | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` refresh was not required for this narrow single-lane packet.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was not observed.
- [x] Process eval note was not required for this narrow docs-only slice.

## Context
`docs/status/project-truth-index.json` routed the first Account access gap to
`apps/web/src/app/admin/users/page.tsx` with `risk=missing_doc_link`. The route
file is only a Next app-router wrapper that re-exports the already-documented
admin users surface, but the canonical doc-link registry still lacked a direct
relation for that exact wrapper path.

## Goal
Attach the smallest durable documentation relation for
`apps/web/src/app/admin/users/page.tsx`, rerun the local truth generators, and
confirm the Account access queue no longer dispatches that wrapper as
`missing_doc_link`.

## Success Signal
- User or operator problem: the wake named a docs-owned Account access gap on the admin users route wrapper.
- Expected product or reliability outcome: project truth no longer classifies the wrapper as `missing_doc_link`.
- How success will be observed: `app-completion-index` and `project-truth-index` stop listing `apps/web/src/app/admin/users/page.tsx` as an Account access docs gap.
- Post-launch learning needed: no

## Deliverable For This Stage
A verification packet with source-truth edits, refreshed graph/status outputs,
and a Paperclip closeout comment.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] `docs/modules/web-admin.md` explicitly covers the admin users route wrapper.
- [x] `documentation-links.csv` and `scanner-overrides.json` contain the matching `documents` relation.
- [x] Source-of-truth indexes are refreshed and read back.
- [x] Paperclip issue closeout can cite concrete evidence, residual risk, and the exact follow-up owner when the stale truth emission remains.

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
  `pnpm run architecture:graph:drift:strict`,
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`,
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- Manual checks:
  targeted `rg` readback in `docs/status/app-completion-index.{json,md}` and
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
  `docs/architecture/scanner-overrides.json`,
  `docs/graphs/architecture-awareness.json`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: refreshed generated truth only

## Autonomous Loop Evidence

### 1. Analyze Current State
- The first project-truth gap was the admin users route wrapper doc-link lane.
- The route already had browser and component-test evidence, so the missing owner lane was documentation discoverability only.

### 2. Select One Priority Mission Objective
- Selected task: close the admin users route wrapper doc-link gap.
- Deferred: the next Admin operation browser-review row on `AdminUsersPage.tsx`, because that belongs to QA/Frontend proof.

### 3. Plan Implementation
- Files or surfaces to modify:
  `docs/modules/web-admin.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  generated status outputs, and task/evidence/context files.
- Logic: add direct module-doc coverage for the wrapper path, then rerun the generator chain and read back the emitted outputs.

### 4. Execute Implementation
- Added the direct route-wrapper doc relation in the CSV registry and scanner override.
- Expanded the web admin module coverage table to name `apps/web/src/app/admin/users/page.tsx`.

### 5. Verify and Test
- Ran the architecture-awareness rebuild, strict drift audit, app-completion rebuild, and project-truth rebuild.
- Read back the generated app-completion and project-truth outputs for the scoped path and captured the split-state mismatch.

### 6. Self-Review
- Existing systems were reused: canonical module docs, documentation-link registry, scanner overrides, generated graph/status indexes.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge
- Updated:
  `docs/modules/web-admin.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  generated `docs/graphs/*` and `docs/status/*`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  this task record,
  and the paired evidence note.

## Result Report
- Task summary: added the direct canonical doc link for `apps/web/src/app/admin/users/page.tsx`, refreshed generated truth, and proved that only `app-completion` cleared the Account access `missing_doc_link` row while `project-truth` stayed stale.
- Files changed:
  `docs/modules/web-admin.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  `docs/graphs/architecture-awareness.json`,
  `docs/status/app-completion-index.md`,
  `docs/status/app-completion-index.json`,
  `docs/status/project-truth-index.md`,
  `docs/status/project-truth-index.json`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  `history/evidence/luc-1249-account-access-admin-users-page-doc-link-2026-07-15.md`,
  `history/tasks/luc-1249-account-access-admin-users-page-doc-link-2026-07-15-task.md`
- How tested: generator chain plus targeted readback and `git diff --check`.
- What is incomplete: `docs/status/project-truth-index.{json,md}` still emit the stale Account access gap; the next browser-review lane remains separate and untouched.
- Next steps: [LUC-1250](/LUC/issues/LUC-1250) now owns the Project Truth / generator repair lane, and any later QA/Frontend routing should happen only after that stale emission is removed.
- Decisions made: treated this as a real missing direct doc relation, repaired it locally, and then converted the remainder into a delegated generator-mismatch follow-up when `project-truth` stayed stale.
