# LUC-528 Account Access Auth E2E RestoreEnv Doc-Link

## Header

- ID: LUC-528
- Title: [Soar][Project Truth][App Completion] Prove Account access missing-doc-link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: LUC-498, LUC-499
- Priority: P1
- Module Confidence Rows: Account access / API auth source truth
- Requirement Rows: not applicable; source-truth linkage only
- Quality Scenario Rows: maintainability/documentation traceability
- Risk Rows: app-completion `missing_doc_link`
- Iteration: 2026-07-11 DSM heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-528-ACCOUNT-ACCESS-AUTH-E2E-RESTOREENV-DOC-LINK-2026-07-11
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

LUC-498 resolved a preceding Account access doc-link batch and LUC-499 resolved
six auth-controller test-link rows. Their generated project-truth output named
`apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv` as the next Account
access `missing_doc_link` row.

## Goal

Resolve the bounded `auth.e2e.test.ts#restoreEnv` documentation-link row using
the existing architecture-awareness relation mechanism and refresh generated
project truth.

## Success Signal

- User or operator problem: project-truth queue no longer points at
  `auth.e2e.test.ts#restoreEnv` as the first Account access doc-link gap.
- Expected product or reliability outcome: future agents can reason from the
  auth module source-of-truth doc instead of rediscovering this test helper.
- How success will be observed: app-completion `missingDocLink` decreases by
  one and project-truth advances to the next Account access row.
- Post-launch learning needed: no.

## Constraints

- Stay inside Soar/Roost Stage 1 scope under LUC-25.
- Documentation/source-truth only.
- Use existing docs and graph relation mechanisms.
- Do not run protected smoke, read secrets, deploy, restart, rollback, mutate
  production/account/exchange/payment/subscription state, place orders, open
  positions, or perform LIVE trading actions.

## Definition of Done

- [x] `auth.e2e.test.ts#restoreEnv` has an owner doc link.
- [x] Architecture-awareness and app-completion outputs are regenerated.
- [x] Project-truth output advances to the next gap.
- [x] Evidence and state files record the result and residual next row.

## Forbidden

- New source-truth framework.
- Runtime code change.
- Protected credential access or raw secret handling.
- Push, deploy, restart, rollback, or database migration.
- LIVE trading/order/position mutation.

## Implementation

- Updated `docs/modules/api-auth.md` with a classification row for
  `apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv`.
- Updated `docs/architecture/relations/documentation-links.csv` with the direct
  relation to `docs/modules/api-auth.md`.
- Regenerated architecture-awareness, app-completion, and project-truth files.

## Validation Evidence

- `build-architecture-awareness-index.mjs`: PASS, `entities=10699`,
  `relations=34855`, `entityOverridesApplied=10`,
  `relationOverridesApplied=1`.
- `build-app-completion-index.mjs`: PASS, `items=3558`,
  `missingDocLink=1993`, `riskItems=3532`.
- `build-project-truth-indexes.mjs --apply`: PASS, public probes passed, first
  gap advanced to `apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets`.
- Targeted readback confirmed the direct doc relation and absence of
  `auth.e2e.test.ts#restoreEnv` from the project-truth priority rows.
- `git diff --check`: PASS with CRLF normalization warnings only.

## Result Report

Status: `DONE / DOC_LINK_RESOLVED / APP_COMPLETION_REFRESHED /
PROJECT_TRUTH_ADVANCED / NO_RUNTIME_MUTATION`.

Evidence:
`history/evidence/luc-528-account-access-auth-e2e-restoreenv-doc-link-2026-07-11.md`.

Residual: the next Account access doc-link row is
`apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets`, owned by Docs Memory Lead
+ Project Manager as a separate bounded source-truth row.
