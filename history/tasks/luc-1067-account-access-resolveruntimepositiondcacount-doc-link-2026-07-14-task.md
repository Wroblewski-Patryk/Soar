# Task

## Context

- ID: `LUC-1067`
- Title: Account access `resolveRuntimePositionDcaCount` missing-doc-link closure
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `Documentation Steward`
- Priority: `P1`
- Mission ID:
  `LUC-1067-ACCOUNT-ACCESS-RESOLVERUNTIMEPOSITIONDCACOUNT-DOC-LINK-2026-07-14`
- Mission Status: `VERIFIED`

The generated Account access project-truth queue advanced to
`apps/api/src/modules/bots/runtimeSessionPositionDcaCount.ts#resolveRuntimePositionDcaCount`
as the first docs-owned `missing_doc_link` row after
[LUC-1060](/LUC/issues/LUC-1060) closed
`resolveSingleCanonicalStrategyId` proof.

## Goal

Attach durable module documentation and canonical graph relations for
`resolveRuntimePositionDcaCount` so generated app-completion and project-truth
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
  `.agents/state/module-confidence-ledger.md`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  `history/evidence/luc-1067-account-access-resolveruntimepositiondcacount-doc-link-2026-07-14.md`,
  `history/tasks/luc-1067-account-access-resolveruntimepositiondcacount-doc-link-2026-07-14-task.md`.
- Validation:
  `build-architecture-awareness-index.mjs` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  `build-app-completion-index.mjs` PASS;
  sequential `build-project-truth-indexes.mjs --apply` PASS;
  targeted `rg` readback PASS;
  `git diff --check` with line-ending warnings only.
- Readback:
  `resolveRuntimePositionDcaCount` is no longer a docs-owned first gap.
  `app-completion` now routes the same helper as `implemented_needs_proof`,
  `missingDocLink` drops from `1982` to `1981`, and `implementedNeedsProof`
  rises from `111` to `112`. `project-truth` now advances the first Account
  access gap to the same helper as `implemented_needs_proof`.
  The existing dirty-packet source-control sidecar remains
  [LUC-1061](/LUC/issues/LUC-1061).
