# LUC-1261 Evidence

- Issue: `LUC-1261`
- Date: `2026-07-15`
- Agent lane: `11 SPM (Soar Product Manager)`
- Scope: produce a known-state takeover baseline for the remaining Account
  access `missing_doc_link` gap on
  `apps/web/src/features/admin/users/pages/AdminUsersPage.tsx` and delegate the
  direct repair to the correct specialist lane.

## Works

- `history/evidence/luc-1259-adminuserspage-browser-review-2026-07-15.md`
  confirms `AdminUsersPage.tsx` is already `implemented and verified` for the
  browser-review lane.
- `history/evidence/luc-1249-account-access-admin-users-page-doc-link-2026-07-15.md`
  and `history/evidence/luc-1250-refresh-project-truth-ingestion-after-admin-users-doc-link-closure-2026-07-15.md`
  already closed the wrapper-path gap on
  `apps/web/src/app/admin/users/page.tsx`.
- `docs/status/app-completion-index.json` currently reports:
  - `path`: `apps/web/src/features/admin/users/pages/AdminUsersPage.tsx`
  - `status`: `verified`
  - `evidence.hasTest`: `true`
  - `evidence.hasDoc`: `false`
  - `risk`: `missing_doc_link`
- `docs/status/project-truth-index.json` currently routes the same feature-page
  path as the first current gap.

## Fails

- `docs/graphs/architecture-awareness.json` contains the
  `route:adminuserspage-tsx:784aa77abb` entity but no `documents` relation for
  `apps/web/src/features/admin/users/pages/AdminUsersPage.tsx`.
- `docs/modules/web-admin.md` and
  `docs/architecture/relations/documentation-links.csv` currently cover the
  wrapper path `apps/web/src/app/admin/users/page.tsx`, not the feature-page
  file that still emits the generated gap.

## Unknown

- Whether the smallest truthful closure is only a direct docs relation row for
  `AdminUsersPage.tsx` or also a module-doc expansion sentence naming the
  feature page explicitly. This is a docs-lane implementation detail, not a PM
  blocker, because the affected flow, path, owner, and proof contract are now
  explicit.

## Targeted Readback

- `Account access: AdminUsersPage.tsx has app-completion risk missing_doc_link.`
  remains the first project-truth gap.
- `nextOwner`: `Docs Memory Lead + Project Manager`
- `nextAction`: `Link or update the source-of-truth docs/status entry for this flow so future agents can reason from evidence.`

## Handoff Contract

- Specialist owner: `04 DSM (Documentation Steward)`
- Expected touched files:
  - `docs/modules/web-admin.md`
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - refreshed `docs/graphs/*`
  - refreshed `docs/status/*`
  - task/evidence/context files for closure
- Required proof:
  - rerun `build-architecture-awareness-index.mjs`
  - rerun `build-app-completion-index.mjs`
  - rerun `build-project-truth-indexes.mjs --apply`
  - read back that `AdminUsersPage.tsx` no longer emits `missing_doc_link` in
    both `app-completion-index` and `project-truth-index`

## Classification

- PM lane result: `implemented and verified` for the baseline/handoff packet
- Deliverable status for the original gap: `blocked` pending the Documentation
  Steward child issue
