# LUC-1111 Account Access sumRuntimeManagedPositionQuantity Doc-Link Closure

## Context

- ID: `LUC-1111`
- Title: Account access `sumRuntimeManagedPositionQuantity` missing-doc-link
  closure
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `Documentation Steward`
- Priority: `P1`
- Mission ID:
  `LUC-1111-ACCOUNT-ACCESS-SUMRUNTIMEMANAGEDPOSITIONQUANTITY-DOC-LINK-2026-07-14`
- Mission Status: `VERIFIED`

The Account access project-truth queue still routed
`apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#sumRuntimeManagedPositionQuantity`
as the first docs-owned `missing_doc_link` row after the focused repository
proof lane had already closed.

## Goal

Attach durable module documentation and canonical graph relations for
`sumRuntimeManagedPositionQuantity` so generated app-completion and
project-truth no longer classify it as `missing_doc_link`.

## Constraints

- use existing systems and approved mechanisms
- no runtime code changes
- no new tests
- no deploy, push, restart, rollback, or protected account/session proof
- no workaround paths or manual status-only edits

## Definition of Done

- [x] `docs/modules/api-bots.md` already documents the scoped helper.
- [x] `docs/architecture/relations/documentation-links.csv` contains the
      matching `documents` relation.
- [x] Generated app-completion and project-truth readback no longer route the
      helper as `missing_doc_link`.
- [x] Evidence and state files record the next routed gap and validation
      results.

## Forbidden

- new systems without approval
- duplicated logic or parallel documentation systems
- temporary bypasses or manual status-only edits
- architecture changes outside the scoped docs relation repair

## Plan

1. Add the helper contract to the canonical documentation relation input.
2. Rebuild architecture awareness, app-completion, and project-truth from the
   refreshed relation source.
3. Record evidence and refresh project-state files.

## Result Report

- Updated files:
  `docs/architecture/relations/documentation-links.csv`,
  `docs/status/app-completion-index.md`,
  `docs/status/app-completion-index.json`,
  `docs/status/project-truth-index.md`,
  `docs/status/project-truth-index.json`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  `history/evidence/luc-1111-account-access-sumruntimemanagedpositionquantity-doc-link-2026-07-14.md`,
  `history/tasks/luc-1111-account-access-sumruntimemanagedpositionquantity-doc-link-2026-07-14-task.md`.
- Validation:
  `build-architecture-awareness-index.mjs` PASS;
  `build-app-completion-index.mjs` PASS;
  `build-project-truth-indexes.mjs --apply` PASS;
  targeted readback PASS;
  `git diff --check` PASS with LF/CRLF warnings only.
