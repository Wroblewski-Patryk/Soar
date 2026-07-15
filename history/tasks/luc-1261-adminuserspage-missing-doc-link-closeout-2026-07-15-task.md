# Task

## Header
- ID: LUC-1261
- Title: Close Account access missing-doc-link for `AdminUsersPage.tsx`
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Depends on: LUC-1259
- Priority: P1
- Module Confidence Rows: not updated
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation discoverability
- Risk Rows: app-completion Account access doc-link risk
- Iteration: 2
- Operation Mode: BUILDER
- Mission ID: LUC-1261-ADMINUSERSPAGE-MISSING-DOC-LINK-CLOSEOUT-2026-07-15
- Mission Status: VERIFIED

## Context
`LUC-1261` started as a PM takeover lane after `LUC-1259` reclassified the
first Account access gap to `AdminUsersPage.tsx` as `missing_doc_link`. The PM
baseline created `LUC-1264` for the Documentation Steward. `LUC-1264` then
added the direct feature-page doc relation, and `LUC-1265` cleared the stale
`project-truth` packet so the parent issue could be integrated and closed.

## Goal
Verify that the child-lane outputs fully satisfy the parent gap and close the
parent issue with durable repo evidence.

## Constraints
- reuse existing child-lane evidence instead of rerunning unnecessary work
- do not reopen the already-closed wrapper-path or browser-review lanes
- do not push, deploy, restart, or mutate protected environments

## Definition of Done
- [x] Child-lane outputs are read back from repo truth, not just issue comments.
- [x] `AdminUsersPage.tsx` no longer appears as a `missing_doc_link` gap in both generated indexes.
- [x] Parent closeout evidence is recorded in repo state and history.

## Validation Evidence
- Tests:
  reused child-lane validation from `LUC-1264` and `LUC-1265`
- Manual checks:
  targeted readback in `docs/modules/web-admin.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/graphs/architecture-awareness.json`,
  `docs/status/app-completion-index.{json,md}`,
  `docs/status/project-truth-index.{json,md}`
- Reality status: verified

## Result Report
- Task summary: integrated the completed docs and refresh child issues, verified that `AdminUsersPage.tsx` is cleared from both generated queues, and closed the PM parent.
- Files changed:
  `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`,
  `history/tasks/luc-1261-adminuserspage-missing-doc-link-closeout-2026-07-15-task.md`,
  `history/evidence/luc-1261-adminuserspage-missing-doc-link-closeout-2026-07-15.md`
- Residual:
  the next generated first gap is now `Dashboard overview: GET / has app-completion risk missing_test_link.`
