# Task: LUC-1218 stale admin-root missing-doc-link emission refresh

## Context

- Parent issue: [LUC-1198](/LUC/issues/LUC-1198)
- Wake issue: [LUC-1218](/LUC/issues/LUC-1218)
- Prior docs work already linked `apps/web/src/app/admin/page.tsx` to
  `docs/modules/web-admin.md`, but generated status files still emitted a stale
  Account access `missing_doc_link` row.

## Goal

- Determine whether the stale emission still required a generator repair lane or
  could be resolved by refreshing the authoritative generated truth.

## Constraints

- Stay inside Soar workspace and Paperclip-issued coordination scope.
- No runtime code edits, deploy, push, restart, secret access, or protected
  account mutation.
- Do not introduce a workaround or manual status-file patch.

## Delivery Stage

- `verification`

## Implementation Plan

1. Reproduce the builder-side classification for
   `route:page-tsx:36cbd2cd9b` against the refreshed architecture graph.
2. Re-run the authoritative app-completion and project-truth generators.
3. Read back the emitted status rows and determine the next owner, if any.
4. Record evidence and return the outcome to Paperclip.

## Definition of Done

- Fresh generated truth no longer emits the stale `missing_doc_link` row for
  `apps/web/src/app/admin/page.tsx`.
- The next real generated gap is identified from refreshed status outputs.
- Evidence and task records are stored in `history/evidence/` and
  `history/tasks/`.

## Forbidden

- Manual editing of generated status files.
- Runtime/product code changes unrelated to the stale emission.
- Deploy, push, restart, or production account interaction.

## Result Report

- Direct classifier replay on the refreshed architecture graph returned
  `hasDoc=true` and `hasTest=true` for the admin root route.
- Re-running the authoritative generators removed the stale
  `missing_doc_link` emission from `docs/status/app-completion-index.*` and
  advanced `docs/status/project-truth-index.*` to the next real gap.
- No external generator repair lane was needed; the actionable work was a
  generated-state refresh plus proof readback.
