# Task

## Context

- ID: `LUC-1035`
- Title: Account access `resolveRuntimeTakeoverStatus` missing-doc-link closure
- Stage: `verification`
- Mission:
  `LUC-1035-ACCOUNT-ACCESS-RESOLVERUNTIMETAKEOVERSTATUS-DOC-LINK-2026-07-14`
- Source gap:
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#resolveRuntimeTakeoverStatus`
  was the first docs-owned Account access row in generated project truth after
  the preceding proof closures.

## Goal

Attach durable module documentation and graph relations for
`resolveRuntimeTakeoverStatus` so generated app-completion and project-truth
no longer classify it as `missing_doc_link`.

## Constraints

- use existing systems and approved mechanisms
- no runtime code changes
- no new tests
- no deploy, push, restart, rollback, or protected account/session proof
- no workaround paths or parallel documentation systems

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
- duplicated logic or parallel implementations
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
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  `history/evidence/luc-1035-account-access-resolveruntimetakeoverstatus-doc-link-2026-07-14.md`,
  `history/tasks/luc-1035-account-access-resolveruntimetakeoverstatus-doc-link-2026-07-14-task.md`.
- Validation:
  `build-architecture-awareness-index.mjs` PASS (`10943` entities / `36224`
  relations / `relationOverridesApplied=40`);
  `pnpm run architecture:graph:drift:strict` PASS (`863/863`, `0` missing);
  `build-app-completion-index.mjs` PASS (`missingDocLink=1985`);
  sequential `build-project-truth-indexes.mjs --apply` PASS
  (`totalGaps=3507`);
  targeted `rg` readback PASS;
  `git diff --check` returned line-ending warnings only.
- Readback:
  `resolveRuntimeTakeoverStatus` is no longer a docs-owned first gap.
  The next Account access docs gap is now
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#selectRuntimeOpenOrders`.
