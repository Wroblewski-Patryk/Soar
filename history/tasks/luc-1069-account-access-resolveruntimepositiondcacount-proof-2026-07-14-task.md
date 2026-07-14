# Task

## Header
- ID: LUC-1069
- Title: Account access `resolveRuntimePositionDcaCount` implemented-needs-proof closure
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-1067](/LUC/issues/LUC-1067)
- Priority: P1
- Module Confidence Rows: Account access / API bots runtime position DCA-count helper executable proof
- Requirement Rows: not applicable
- Quality Scenario Rows: not applicable
- Risk Rows: app-completion implemented-needs-proof routing for Account access runtime position DCA-count helper
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1069-ACCOUNT-ACCESS-RESOLVERUNTIMEPOSITIONDCACOUNT-PROOF-2026-07-14
- Mission Status: VERIFIED

## Context

`LUC-1067` advanced
`apps/api/src/modules/bots/runtimeSessionPositionDcaCount.ts#resolveRuntimePositionDcaCount`
from `missing_doc_link` to `implemented_needs_proof` in the Account access
project-truth queue. This issue closes the remaining proof lane only.

## Goal

Close the remaining proof lane for `resolveRuntimePositionDcaCount` with the
smallest focused automated verification and canonical traceability refresh.

## Constraints

- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done

- [x] Focused executable proof covers same-order OPEN dedupe, raw-trade
      fallback, explicit/runtime-state precedence, and fail-closed
      non-negative truncation semantics.
- [x] Focused test command passes.
- [x] Canonical proof metadata marks the helper verified.
- [x] Sequential generator readback no longer classifies the helper as
      `implemented_needs_proof`.
- [x] Durable evidence names the next owner for the remaining first gap.

## Validation Evidence

- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionsRead.service.test.ts --run --reporter=dot`
- Manual checks:
  - targeted readback of `docs/status/app-completion-index.*`
  - targeted readback of `docs/status/project-truth-index.*`
  - targeted readback of `docs/architecture/scanner-overrides.json`
  - targeted readback of `docs/graphs/architecture-awareness.json`
- Reality status: verified

## Architecture Evidence

- Architecture source reviewed:
  `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no

## Result Report

- Task summary:
  focused helper proof for
  `apps/api/src/modules/bots/runtimeSessionPositionDcaCount.ts#resolveRuntimePositionDcaCount`
  is now direct, verified, and consumed by generated truth.
- Files changed:
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`,
  `docs/architecture/scanner-overrides.json`,
  generated `docs/status/*` and `docs/graphs/*`,
  `history/evidence/luc-1069-account-access-resolveruntimepositiondcacount-proof-2026-07-14.md`
- How tested:
  focused Vitest plus sequential architecture-awareness, drift, app-completion,
  and project-truth refresh.
- What is incomplete:
  the next Account access front row moves to
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#countRuntimeManagedPositions`
  as `missing_test_link`.
- Next steps:
  route the next proof-owned gap to Test Automation Engineer + QA Regression
  Lead.
