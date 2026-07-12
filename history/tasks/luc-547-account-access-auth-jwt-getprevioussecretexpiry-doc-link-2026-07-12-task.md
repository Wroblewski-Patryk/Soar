# Task

## Header
- ID: LUC-547
- Title: Account Access Auth JWT getPreviousSecretExpiry Doc-Link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: LUC-541
- Priority: P1
- Module Confidence Rows: Account access / API auth JWT source-truth documentation
- Requirement Rows: Account access JWT previous-secret expiry helper must have a source-truth documentation link before leaving `missing_doc_link`
- Quality Scenario Rows: Documentation/source-truth completeness for Account access
- Risk Rows: Project truth could keep routing the helper as undocumented after owner docs exist
- Iteration: 2026-07-12 DSM heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-547-ACCOUNT-ACCESS-AUTH-JWT-GETPREVIOUSSECRETEXPIRY-DOC-LINK-2026-07-12
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the bounded builder iteration.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` and current state queues were reviewed through the active mission and task board context.
- [x] `.agents/core/mission-control.md` was reviewed through the active mission.
- [x] Missing or template-like state tables were not encountered.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by resolving one indexed Account access app-completion doc-link gap.

## Context

Project truth routed [LUC-547](/LUC/issues/LUC-547) because
`apps/api/src/modules/auth/auth.jwt.ts#getPreviousSecretExpiry` appeared as an
Account access `missing_doc_link` row after [LUC-541](/LUC/issues/LUC-541)
closed the previous JWT proof row.

## Goal

Resolve the missing documentation link for
`auth.jwt.ts#getPreviousSecretExpiry`, refresh the generated indexes, and route
any remaining proof requirement to the correct owner.

## Scope

- `docs/modules/api-auth.md`
- `docs/architecture/relations/documentation-links.csv`
- `docs/architecture/scanner-overrides.json`
- generated architecture/app-completion/project-truth status artifacts
- state/evidence/task records for this heartbeat
- Paperclip child issue [LUC-549](/LUC/issues/LUC-549)

## Implementation Plan

1. Diagnose the indexed helper and existing auth JWT docs/test context.
2. Add the source-truth documentation relation through existing docs and scanner mechanisms.
3. Regenerate architecture-awareness, app-completion, and project-truth indexes.
4. Run strict graph drift and diff checks.
5. Create a QA/Test child issue for the remaining `implemented_needs_proof` row.
6. Update durable state/evidence.

## Acceptance Criteria

- `getPreviousSecretExpiry` is documented in `docs/modules/api-auth.md`.
- `documentation-links.csv` contains the helper-to-doc relation.
- scanner relation overrides connect `docs/modules/api-auth.md` to the helper.
- app-completion no longer reports this helper as `missing_doc_link`.
- remaining proof work is assigned to a concrete owner issue.

## Definition of Done

- [x] Doc-link source truth updated.
- [x] Index refresh completed.
- [x] Strict architecture drift passed.
- [x] Follow-up proof issue created for Test Automation Engineer.
- [x] Evidence and project state updated.

## Forbidden

- Runtime code changes.
- Temporary bypasses or duplicate documentation mechanisms.
- Production deploy, restart, rollback, protected account readback, secret value
  disclosure, DB/Redis mutation, exchange/payment/subscription mutation, order,
  position, bot activation, or LIVE trading action.

## Validation Evidence

- Tests:
  - `pnpm run architecture:graph:drift:strict` => PASS (`850/850`, `0` missing)
- Manual checks:
  - app-completion refresh => `missingDocLink=1991`, `implementedNeedsProof=114`
  - project-truth `--apply` => first gap is now `implemented_needs_proof` for
    `getPreviousSecretExpiry`
  - `git diff --check` => PASS with line-ending warnings only
- High-risk checks:
  - no runtime/prod/protected/secret/account/live-trading mutation
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Result Report

- Task summary:
  resolved the `getPreviousSecretExpiry` missing-doc-link row and routed the
  remaining proof row to [LUC-549](/LUC/issues/LUC-549).
- Files changed:
  `docs/modules/api-auth.md`, `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`, generated docs/status artifacts,
  state files, and this task/evidence packet.
- How tested:
  architecture-awareness refresh, app-completion refresh, project-truth apply,
  strict architecture drift, and diff check.
- What is incomplete:
  behavioral proof is not claimed by DSM; [LUC-549](/LUC/issues/LUC-549) owns it.
- Next steps:
  TAE runs focused JWT proof and links the helper to executable proof if needed.
- Decisions made:
  use the existing module-doc, documentation-links, and scanner override path;
  do not introduce a new documentation mechanism.
