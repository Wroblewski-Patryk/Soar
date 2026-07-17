# LUC-1396 Evidence

- Issue: [LUC-1396](/LUC/issues/LUC-1396)
- Date: 2026-07-17
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/router/dashboard.routes.ts#/profile/security`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented

- `docs/modules/api-profile.md` now documents
  `apps/api/src/router/dashboard.routes.ts#/profile/security` as the
  authenticated dashboard router mount that delegates password rotation and
  account deletion into the profile module after the shared dashboard auth gate
  succeeds.
- `docs/architecture/relations/documentation-links.csv` now maps
  `apps/api/src/router/dashboard.routes.ts#/profile/security` to
  `docs/modules/api-profile.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /profile/security|USE /reports|USE /profile/basic|missing_doc_link|missing_test_link" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `node -` reproduction against `docs/graphs/architecture-awareness.json`
  confirming the exact endpoint now returns `hasDoc: true` when applying the
  same `hasLinkedType(..., "document")` logic used by
  `build-app-completion-index.mjs`
- `git diff --check`

## Readback

- `docs/graphs/architecture-awareness.json` now contains the direct relation
  `document:api-deep-dive-profile-module:fe29e29088 -> api_endpoint:use-profile-security:61552c894b`
  with type `documents` and evidence `docs/modules/api-profile.md`.
- Direct reproduction against the generated graph returns `hasDoc: true` for
  `api_endpoint:use-profile-security:61552c894b`.
- Current generated truth is now aligned:
  `docs/status/app-completion-index.{md,json}` no longer emit
  `USE /profile/security` as `missing_doc_link`, and
  `docs/status/project-truth-index.{md,json}` no longer route the same
  endpoint as an open gap.

## Residual / blocker

- The scoped doc-link gap is resolved, but this issue cannot close yet because
  the Soar workspace currently fails the clean-worktree/source-control gate.
- Current `git status --short` shows additional modified generated/status files
  plus untracked `LUC-1422` artifacts outside the minimal `LUC-1396` packet.
- Next owner/action:
  Project Manager + source-control closure owner must classify and close the
  current shared dirty packet before `LUC-1396` can move to `done`.
