# LUC-256 ARB-005 Docs Parity Pipeline Enforcement

## Header
- ID: LUC-256
- Title: [Soar][ARB-005] Add mandatory pipeline hook/checklist enforcement for `docs:parity:endpoints:api` and web route
- Task Type: fix
- Current Stage: verification
- Status: IN_PROGRESS
- Owner: QA/Test
- Priority: P2
- Iteration: 2026-07-10
- Operation Mode: TESTER
- Mission ID: `LUC-256-ARB-005-DOCS-PARITY-PIPELINE-ENFORCEMENT-2026-07-10`
- Mission Status: VERIFIED_LOCAL

## Context
ARB-005 needs the API endpoint documentation parity audit and Web route/API
matrix parity audit to be mandatory in the local RC helper pipeline and visible
in the release checklist. The existing scripts already exist:
`docs:parity:endpoints:api` and `docs:parity:route-api-matrix`.

## Goal
Use existing release/ops mechanisms so RC helper pipeline execution fails when
API endpoint docs parity or Web route/API matrix parity fails, and record the
checks in the V1 release checklist.

## Scope
- `scripts/runLocalExternalGatesPipeline.mjs`
- `scripts/runLocalExternalGatesPipeline.test.mjs`
- `scripts/releaseOpsScriptContracts.test.mjs`
- `docs/operations/v1-release-candidate-checklist.md`
- task/context source-of-truth updates for LUC-256

## Implementation Plan
1. Add a mandatory docs parity hook to the existing local external gates
   pipeline before external evidence collection.
2. Cover the hook with focused Node tests and release script contract tests.
3. Update the RC checklist quick commands and gate list so operators can see
   both parity checks are part of the helper pipeline.
4. Run focused parity and script tests plus diff hygiene.

## Acceptance Criteria
- `pnpm run ops:rc:gates:local-pipeline*` paths execute
  `pnpm run docs:parity:endpoints:api`.
- `pnpm run ops:rc:gates:local-pipeline*` paths execute
  `pnpm run docs:parity:route-api-matrix`.
- The RC checklist names both mandatory parity checks.
- Focused local tests and the two parity checks pass.

## Definition of Done
- [x] Existing pipeline mechanism reused.
- [x] No production, protected smoke, deploy, push, restart, rollback, secret,
      account, DB/Redis, exchange, payment, subscription, order, position, or
      live-trading action performed.
- [x] Validation evidence recorded.
- [x] Local commit created after validation, or no-commit blocker recorded.

## Validation Evidence
- `corepack pnpm run docs:parity:endpoints:api`: PASS; `109/109`
  endpoints documented, `0` gaps; wrote
  `docs/operations/api-endpoint-docs-parity-2026-07-10/`.
- `corepack pnpm run docs:parity:route-api-matrix`: PASS; `39` Web
  routes, `109` API endpoints, `17` traceability rows, `0` gaps.
- `node --test scripts/runLocalExternalGatesPipeline.test.mjs scripts/releaseOpsScriptContracts.test.mjs`:
  PASS; `10/10` tests.
- `git diff --check`: PASS with CRLF normalization warnings only.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: existing package scripts, RC pipeline scripts,
  RC checklist, route/API parity scripts.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: RC helper pipeline now includes mandatory docs parity
  checks before external evidence collection.
- Rollback note: revert the pipeline/checklist/test edits if the hook needs to
  be removed.
- Observability or alerting impact: none.

## Result Report
- Task summary: implemented a mandatory docs parity hook in the RC local
  external gates pipeline and documented it in the V1 RC checklist.
- Files changed: RC pipeline script, focused pipeline tests, release script
  contract test, V1 RC checklist, generated API endpoint parity report, and
  source-of-truth task/context files.
- How tested: focused parity checks, focused Node tests, and diff hygiene.
- What is incomplete: no local implementation gap remains.
- Next steps: create local commit, then close LUC-256 in Paperclip.
