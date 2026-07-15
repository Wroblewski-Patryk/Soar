# Task: LUC-1250 refresh project-truth ingestion after admin-users doc-link closure

## Context

- Parent issue: [LUC-1249](/LUC/issues/LUC-1249)
- Wake issue: [LUC-1250](/LUC/issues/LUC-1250)
- The prior docs closure proved direct canonical coverage for
  `apps/web/src/app/admin/users/page.tsx`, but
  `docs/status/project-truth-index.{json,md}` still emitted the old first gap
  `Account access: page.tsx has app-completion risk missing_doc_link.`

## Goal

- Determine whether the stale project-truth gap required a generator-code repair
  or only an authoritative generated-state refresh, then record the next
  truthful owner lane.

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

1. Compare the stale `project-truth` row with the current
   `app-completion-index.json` readback for the same route.
2. Re-run the canonical generator chain:
   architecture awareness -> graph drift audit -> app completion ->
   project truth.
3. Read back the first generated gap and classify whether any toolchain repair
   remains.
4. Store evidence and refresh local project-truth ledgers.

## Definition of Done

- The stale `missing_doc_link` project-truth row for
  `apps/web/src/app/admin/users/page.tsx` is no longer emitted after canonical
  regeneration.
- The first gap advances to the next truthful owner lane.
- Evidence and task records are stored in `history/evidence/` and
  `history/tasks/`.

## Forbidden

- Manual editing of generated JSON/MD status outputs.
- Runtime or product-surface changes unrelated to generator truth refresh.
- Cross-repo toolchain edits without a separately scoped owner lane.

## Result Report

- Targeted readback showed the current `docs/status/app-completion-index.json`
  no longer contained the `admin/users/page.tsx` `missing_doc_link` row, while
  `docs/status/project-truth-index.json` still did.
- Re-running the canonical generator chain refreshed the stale status packet and
  removed the old Account access gap without any toolchain code change.
- `docs/status/project-truth-index.{json,md}` now advance the first gap to
  `apps/web/src/features/admin/users/pages/AdminUsersPage.tsx` with
  `needs_browser_review`, owned by QA Regression Lead + Frontend Experience
  Lead.
