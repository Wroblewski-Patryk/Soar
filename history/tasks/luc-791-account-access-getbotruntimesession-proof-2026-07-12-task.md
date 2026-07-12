# LUC-791 Account Access getBotRuntimeSession Proof

## Header

- ID: LUC-791
- Title: Account access getBotRuntimeSession missing-test-link proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: none
- Priority: P0
- Module Confidence Rows: Account access / API bots runtime session detail proof
- Requirement Rows: not applicable
- Quality Scenario Rows: local automated regression proof
- Risk Rows: protected account/session smoke explicitly excluded
- Iteration: 2026-07-12
- Operation Mode: TESTER
- Mission ID: `LUC-791-ACCOUNT-ACCESS-GETBOTRUNTIMESESSION-PROOF-2026-07-12`
- Mission Status: VERIFIED

## Context

Generated app-completion/project-truth routing for 2026-07-12 still listed
`apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession` as the
first Account access Test Automation `missing_test_link` row even though
`apps/api/src/modules/bots/bots.e2e.test.ts` already exercised the endpoint's
owner-read/non-owner-404 behavior.

## Goal

Close the controller's missing-test-link gap by linking it to existing focused
runtime-session proof, verify that proof still passes, and refresh generated
readback so the next queue item advances.

## Scope

- Updated:
  `docs/architecture/relations/priority-test-links.csv`;
  `docs/architecture/scanner-overrides.json`;
  generated architecture/app-completion/project-truth outputs.
- Evidence:
  `history/evidence/luc-791-account-access-getbotruntimesession-proof-2026-07-12.md`.

## Implementation Plan

1. Confirm an existing executable test already proves `getBotRuntimeSession`.
2. Link the controller entity to that test in source-truth inputs.
3. Run the smallest focused e2e proof for ownership isolation.
4. Regenerate architecture-awareness, app-completion, and project-truth outputs.
5. Record evidence, residual risk, and next owner.

## Acceptance Criteria

- `bots.controller.ts#getBotRuntimeSession` has a direct priority test relation.
- Focused runtime-session ownership-isolation proof passes.
- Generated app-completion/project-truth no longer routes
  `getBotRuntimeSession` as `missing_test_link`.
- The next owner/action is named.

## Definition of Done

- Focused proof passes.
- App-completion/project-truth indexes are refreshed and clear the
  `missing_test_link` row.
- Evidence/task records are written.
- No forbidden production/protected/live actions occur.

## Forbidden

- Do not broaden into full workspace build.
- Do not change runtime implementation for a proof-link task.
- Do not run production smoke, deploy, push, restart, rollback, mutate DB/Redis,
  mutate exchange/payment/subscription state, activate bots, or place/cancel
  LIVE orders.

## Validation Evidence

- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts --run -t "lists and returns runtime session monitoring summary with ownership isolation" --reporter=dot --test-timeout 30000`
    -> PASS.
- Source truth:
  - architecture-awareness -> PASS, `10788` entities / `35264` relations; the
    controller entity is `verified` and has a direct `tests` relation.
  - app-completion -> PASS, final readback for
    `bots.controller.ts#getBotRuntimeSession` is `hasTest=true`,
    `hasDoc=false`, `risk=missing_doc_link`.
  - project-truth `--apply` -> PASS, first gap is now docs-owned
    `resolveSessionWindowEnd`, and `getBotRuntimeSession` no longer appears as
    `missing_test_link`.
- Reality status: verified local.

## Result Report

- Task summary:
  linked an existing runtime-session ownership-isolation e2e proof to
  `getBotRuntimeSession`, proved the route behavior locally, and advanced
  generated truth so the row is no longer missing test coverage.
- Files changed:
  `docs/architecture/relations/priority-test-links.csv`,
  `docs/architecture/scanner-overrides.json`, generated status/graph files,
  and local task/evidence records.
- What is incomplete:
  no remaining Test Automation action on [LUC-791](/LUC/issues/LUC-791).
- Next steps:
  Docs Memory Lead + Project Manager own the remaining docs gap for
  `apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession`
  (`missing_doc_link`).
- Decisions made:
  reused the existing focused bots runtime e2e proof instead of adding a
  duplicate test pack.
