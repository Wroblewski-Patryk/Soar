# Task: LUC-1265 clear stale AdminUsersPage project-truth emission

## Context

- Parent issue: [LUC-1264](/LUC/issues/LUC-1264)
- Wake issue: [LUC-1265](/LUC/issues/LUC-1265)
- The feature-page doc-link closure was already canonical, but
  `docs/status/project-truth-index.{json,md}` still emitted the stale
  `Account access: AdminUsersPage.tsx has app-completion risk
  missing_doc_link.` first gap.

## Goal

- Refresh the generated truth packet so `project-truth-index` matches the
  current `app-completion-index` and stops routing `AdminUsersPage.tsx` as a
  docs gap.

## Constraints

- Stay inside the Soar workspace.
- No runtime/product code edits, deploy, push, restart, secret access, or
  protected-account mutation.
- Do not patch generated status files manually.
- Do not modify the Paperclip toolchain from this workspace unless the issue
  proves a cross-repo defect and a separate owner lane is created.

## Delivery Stage

- `verification`

## Implementation Plan

1. Confirm the current `app-completion-index.json` no longer reports the
   Account access doc-link gap.
2. Re-run the canonical generator chain from the current graph forward.
3. Read back the generated `project-truth-index.{json,md}` and confirm the
   stale row is gone.
4. Store durable evidence and close the issue with the truthful next gap.

## Definition of Done

- `docs/status/project-truth-index.{json,md}` no longer emit the stale
  `AdminUsersPage.tsx` missing-doc-link gap.
- The first gap advances to the next truthful owner lane.
- Evidence and task records are stored in `history/evidence/` and
  `history/tasks/`.

## Forbidden

- Manual editing of generated JSON/MD status outputs.
- Runtime or product-surface changes unrelated to generator truth refresh.
- Cross-repo toolchain edits without a separately scoped owner lane.

## Result Report

- A fresh `build-project-truth-indexes.mjs --apply` run regenerated the truth
  packet from the current `app-completion-index.json` snapshot.
- `docs/status/project-truth-index.{json,md}` now advance the first gap to
  `Dashboard overview: GET / has app-completion risk missing_test_link.`
- The stale Account access `missing_doc_link` emission for
  `AdminUsersPage.tsx` is cleared.

