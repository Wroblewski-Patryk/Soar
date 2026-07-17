# Task: LUC-1362 reconcile stale USE /positions project-truth gap for LUC-1353

## Context

- Parent issue: [LUC-1353](/LUC/issues/LUC-1353)
- Wake issue: [LUC-1362](/LUC/issues/LUC-1362)
- The prior proof-link closure for
  `apps/api/src/router/dashboard.routes.ts#/positions` already moved
  `app-completion-index.*` to `Account access / missing_doc_link`, but
  `project-truth-index.*` still emitted the stale
  `Dashboard overview / missing_test_link` gap.

## Goal

- Determine whether the stale `USE /positions` project-truth gap still
  required a generator-code repair or only an authoritative generated-state
  refresh, then record the next truthful owner lane.

## Constraints

- Stay inside the Soar workspace.
- No runtime/product code edits, deploy, push, restart, secret access, or
  protected-account mutation.
- Do not patch generated status files manually.
- Do not modify the Paperclip toolchain from this workspace.

## Delivery Stage

- `verification`

## Implementation Plan

1. Compare the stale `project-truth` row with the current
   `app-completion-index.json` record for `USE /positions`.
2. Dry-run the canonical `project-truth` generator on the current repo state to
   see whether the stale row still reproduces.
3. Apply the authoritative generated-state refresh and read back the next
   truthful gap.
4. Record evidence and refresh local project-truth ledgers.

## Definition of Done

- `docs/status/project-truth-index.{json,md}` no longer emits
  `Dashboard overview: USE /positions has app-completion risk missing_test_link.`
- The refreshed truth routes `apps/api/src/router/dashboard.routes.ts#/positions`
  as `Account access / missing_doc_link`.
- Evidence and task records are stored in `history/evidence/` and
  `history/tasks/`.

## Forbidden

- Manual editing of generated JSON/MD status outputs.
- Runtime or product-surface changes unrelated to the stale truth refresh.
- Cross-repo toolchain edits, deploy, push, restart, or production mutation.

## Result Report

- Direct readback confirmed the stale split state from `LUC-1353`:
  `docs/status/app-completion-index.json` already routed `USE /positions` to
  `Account access / missing_doc_link`, while
  `docs/status/project-truth-index.json` still emitted the older
  `Dashboard overview / missing_test_link` gap.
- A dry run of
  `build-project-truth-indexes.mjs --project Soar --root ...` on the current
  repo state already resolved the stale classification, proving no toolchain
  code repair was required.
- Applying the authoritative refresh updated
  `docs/status/project-truth-index.{json,md}` so the positions row now matches
  app completion, and the broader first gap advances to the current runtime
  readiness failure (`api_ready ... returned 503`).
