# LUC-1393 Closeout

Status: `done`

Summary:
- Implemented the Soar-side documentation repair for
  `apps/api/src/router/dashboard.routes.ts#/profile/apiKeys`.
- Added the direct module-doc relation in
  `docs/architecture/relations/documentation-links.csv` and
  `docs/architecture/scanner-overrides.json`.
- Updated `docs/modules/api-profile.md` with the explicit dashboard mount
  contract and classification row for the API-key route mount.

Verification:
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` -> PASS
- `pnpm run architecture:graph:drift:strict` -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` -> PASS; `missingDocLink` dropped to `3`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply` -> PASS; `USE /profile/apiKeys` no longer appears in project truth
- `rg -n "USE /profile/apiKeys|USE /profile/basic|GET /alerts|GET /metrics|missing_doc_link|missing_test_link" docs/status/app-completion-index.md docs/status/project-truth-index.md -S` -> `USE /profile/apiKeys` cleared; next docs-owned rows are `USE /profile/basic`, `GET /alerts`, and `GET /metrics`
- `git diff --check` -> PASS (line-ending warnings only)

Evidence:
- `history/tasks/luc-1393-account-access-use-profile-apikeys-missing-doc-link-2026-07-17-task.md`
- `history/evidence/luc-1393-account-access-use-profile-apikeys-missing-doc-link-2026-07-17.md`

No-commit / deploy:
- No commit created.
- Push status: not pushed.
- Deploy impact: none.

Residual:
- This closeout covers only the scoped Account access `USE /profile/apiKeys`
  docs-owned lane.
- Production runtime readiness remains separately degraded because
  `https://api.soar.luckysparrow.ch/ready` still returns `503`.
