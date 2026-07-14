# Task

## Context

- ID: `LUC-1059`
- Title: Account access `resolveSingleCanonicalStrategyId` missing-doc-link closure
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `Documentation Steward`
- Priority: `P1`
- Mission ID:
  `LUC-1059-ACCOUNT-ACCESS-RESOLVESINGLECANONICALSTRATEGYID-DOC-LINK-2026-07-14`
- Mission Status: `VERIFIED`

The generated Account access project-truth queue advanced to
`apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveSingleCanonicalStrategyId`
as the first docs-owned `missing_doc_link` row after
[LUC-1054](/LUC/issues/LUC-1054) closed `resolveClosedResult` proof.

## Goal

Attach durable module documentation and canonical graph relations for
`resolveSingleCanonicalStrategyId` so generated app-completion and project-truth
no longer classify it as `missing_doc_link`.

## Constraints

- use existing systems and approved mechanisms
- no runtime code changes
- no new tests
- no deploy, push, restart, rollback, or protected account/session proof
- no workaround paths or manual status-only edits

## Definition of Done

- [x] `docs/modules/api-bots.md` explicitly documents the scoped helper.
- [x] `docs/architecture/relations/documentation-links.csv` and
      `docs/architecture/scanner-overrides.json` contain the matching
      `documents` relation.
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

1. Add the helper contract to `docs/modules/api-bots.md`.
2. Add the direct docs relation in the canonical registries.
3. Rebuild architecture awareness, then rerun app-completion and project-truth
   sequentially.
4. Record evidence and refresh project state files.

## Result Report

- Updated files:
  `docs/modules/api-bots.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  generated `docs/graphs/*` and `docs/status/*`,
  `.agents/state/active-mission.md`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  `history/evidence/luc-1059-account-access-resolvesinglecanonicalstrategyid-doc-link-2026-07-14.md`,
  `history/tasks/luc-1059-account-access-resolvesinglecanonicalstrategyid-doc-link-2026-07-14-task.md`.
- Validation:
  `build-architecture-awareness-index.mjs` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  `build-app-completion-index.mjs` PASS;
  sequential `build-project-truth-indexes.mjs --apply` PASS;
  targeted `rg` readback PASS;
  `git diff --check` with line-ending warnings only.
- Readback:
  `resolveSingleCanonicalStrategyId` is no longer a docs-owned first gap.
  The same helper now advances to `implemented_needs_proof`, and the next
  Account access docs-owned gap advances to
  `apps/api/src/modules/bots/runtimeSessionPositionDcaCount.ts#resolveRuntimePositionDcaCount`.
  Follow-up proof is routed through [LUC-1060](/LUC/issues/LUC-1060), and the
  current dirty packet source-control sidecar is [LUC-1061](/LUC/issues/LUC-1061).
