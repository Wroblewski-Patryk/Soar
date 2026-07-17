# LUC-1393 Closeout

Status: `blocked`

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
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` -> PASS, but output still marks `USE /profile/apiKeys` as `missing_doc_link`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply` -> PASS, but project truth still routes the same gap
- direct `node -` reproduction against `docs/graphs/architecture-awareness.json` -> `hasDoc: true` for `api_endpoint:use-profile-apikeys:680f20cf0c`
- `git diff --check` -> PASS (line-ending warnings only)

Evidence:
- `history/tasks/luc-1393-account-access-use-profile-apikeys-missing-doc-link-2026-07-17-task.md`
- `history/evidence/luc-1393-account-access-use-profile-apikeys-missing-doc-link-2026-07-17.md`

No-commit / deploy:
- No commit created.
- Push status: not pushed.
- Deploy impact: none.

Blocker:
- The refreshed `architecture-awareness.json` contains the direct
  `document -> api_endpoint` relation from `docs/modules/api-profile.md` to
  `api_endpoint:use-profile-apikeys:680f20cf0c`, but
  `docs/status/app-completion-index.json` still writes
  `"hasDoc": false` and keeps the endpoint in `missing_doc_link`.
- This indicates a project-truth tooling contradiction outside the Soar docs
  lane, likely in
  `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs`
  or the upstream graph-consumption path.

Unblock owner/action:
- Owner: Paperclip docs/tooling maintainer or PM-routed owner of the
  project-truth generator.
- Action: diagnose why `build-app-completion-index.mjs` emits `hasDoc: false`
  for an endpoint whose generated graph already has a direct `document`
  relation, then rerun the Soar generator chain and confirm
  `USE /profile/apiKeys` leaves `missing_doc_link`.
