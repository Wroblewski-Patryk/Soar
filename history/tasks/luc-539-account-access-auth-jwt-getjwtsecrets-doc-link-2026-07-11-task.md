# LUC-539 Account Access Auth JWT getJwtSecrets Doc-Link

## Header

- ID: LUC-539
- Title: [Soar][Project Truth][App Completion] Prove Account access missing-doc-link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: LUC-528
- Priority: P1
- Module Confidence Rows: Account access / API auth source truth
- Requirement Rows: not applicable; source-truth linkage only
- Quality Scenario Rows: maintainability/documentation traceability
- Risk Rows: app-completion `missing_doc_link`
- Iteration: 2026-07-11 DSM heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-539-ACCOUNT-ACCESS-AUTH-JWT-GETJWTSECRETS-DOC-LINK-2026-07-11
- Mission Status: VERIFIED

## Process Self-Audit

- [x] All seven autonomous loop steps are represented in the task.
- [x] Exactly one priority task is selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` and active state were consulted
      through current queue/state files.
- [x] Affected module confidence row was identified.
- [x] The task improves release confidence by removing one generated
      source-truth gap.

## Context

LUC-528 advanced project truth to
`apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets` as the next Account access
`missing_doc_link` row. LUC-539 handles only that documentation-link risk.

## Goal

Resolve the bounded `auth.jwt.ts#getJwtSecrets` documentation-link row using
the existing architecture-awareness relation mechanism and refresh generated
project truth.

## Success Signal

- User or operator problem: project-truth queue no longer points at
  `auth.jwt.ts#getJwtSecrets` as a `missing_doc_link` gap.
- Expected product or reliability outcome: future agents can reason from the
  auth module source-of-truth doc instead of rediscovering the JWT secret
  resolver boundary.
- How success will be observed: app-completion `missingDocLink` decreases by
  one and project-truth changes this row to the next needed proof state.
- Post-launch learning needed: no.

## Constraints

- Stay inside Soar/Roost Stage 1 scope under LUC-25.
- Documentation/source-truth only.
- Use existing docs, scanner override, and graph relation mechanisms.
- Do not run protected smoke, read secrets, deploy, restart, rollback, mutate
  production/account/exchange/payment/subscription state, place orders, open
  positions, or perform LIVE trading actions.

## Definition of Done

- [x] `auth.jwt.ts#getJwtSecrets` has an owner doc link.
- [x] Architecture-awareness and app-completion outputs are regenerated.
- [x] Project-truth output no longer reports the row as `missing_doc_link`.
- [x] Any non-DSM residual proof is delegated to the exact owner.
- [x] Evidence and state files record the result and residual next row.

## Forbidden

- New source-truth framework.
- Runtime code change.
- Protected credential access or raw secret handling.
- Push, deploy, restart, rollback, or database migration.
- LIVE trading/order/position mutation.

## Implementation

- Updated `docs/modules/api-auth.md` with a classification row for
  `apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets`.
- Updated `docs/architecture/relations/documentation-links.csv` with the direct
  relation to `docs/modules/api-auth.md`.
- Updated `docs/architecture/scanner-overrides.json` with a direct `documents`
  relation override so the generated graph marks the function as documented.
- Regenerated architecture-awareness, app-completion, and project-truth files.
- Created [LUC-541](/LUC/issues/LUC-541) for Test Automation Engineer to own
  the remaining `implemented_needs_proof` row.

## Validation Evidence

- `build-architecture-awareness-index.mjs`: PASS, `entities=10706`,
  `relations=34882`, `entityOverridesApplied=10`,
  `relationOverridesApplied=2`.
- `build-app-completion-index.mjs`: PASS, `items=3558`,
  `missingDocLink=1992`, `riskItems=3532`.
- `build-project-truth-indexes.mjs --apply`: PASS, public probes passed, and
  first project-truth gap changed to `implemented_needs_proof` for
  `auth.jwt.ts#getJwtSecrets`.
- `architecture:graph:drift:strict`: PASS, `850/850` covered and `0` missing.
- `git diff --check`: PASS with CRLF normalization warnings only.
- Focused QA proof command timed out after 120 seconds:
  `corepack pnpm --filter api test -- src/modules/auth/auth.jwt.test.ts`.
  DSM did not claim test proof; [LUC-541](/LUC/issues/LUC-541) owns it.

## Result Report

Status: `DONE / DOC_LINK_RESOLVED / APP_COMPLETION_REFRESHED /
PROJECT_TRUTH_ADVANCED_TO_QA_PROOF / FOLLOW_UP_LUC-541_CREATED /
NO_RUNTIME_MUTATION`.

Evidence:
`history/evidence/luc-539-account-access-auth-jwt-getjwtsecrets-doc-link-2026-07-11.md`.

Residual: [LUC-541](/LUC/issues/LUC-541) owns the remaining
`implemented_needs_proof` row for
`apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets`.
