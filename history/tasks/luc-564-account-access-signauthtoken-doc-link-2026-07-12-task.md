# Task

## Header
- ID: LUC-564
- Title: Account Access signAuthToken Doc-Link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: LUC-541
- Priority: P1
- Module Confidence Rows: Account access / API auth source-truth documentation
- Requirement Rows: Account access JWT signAuthToken helper must have source-truth documentation link before leaving `missing_doc_link`.
- Quality Scenario Rows: maintainability/documentation traceability
- Risk Rows: project truth could leave signAuthToken as undocumented
- Iteration: 2026-07-12 DSM heartbeat
- Mission ID: LUC-564-ACCOUNT-ACCESS-SIGNAUTHTOKEN-DOC-LINK-2026-07-12
- Mission Status: VERIFIED

## Scope

- `docs/modules/api-auth.md`
- `docs/architecture/relations/documentation-links.csv`
- `docs/architecture/scanner-overrides.json`
- `docs/status` generated artifacts
- `.codex/context/TASK_BOARD.md` and `.codex/context/PROJECT_STATE.md`
- `history/evidence/luc-564-account-access-signauthtoken-doc-link-2026-07-12.md`

## Result Report

- Scope: resolved the Account access `missing_doc_link` row for
  `apps/api/src/modules/auth/auth.jwt.ts#signAuthToken`.
- Validation: index and project-truth refresh commands passed and no runtime
  mutation was performed.
- Residual: `apps/api/src/modules/auth/auth.jwt.ts#signAuthToken` is now `implemented_needs_proof`; behavioral proof is owned by
  QA Regression Lead + Project Manager.
