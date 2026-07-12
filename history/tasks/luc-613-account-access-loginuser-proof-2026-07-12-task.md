# Task

## Header
- ID: LUC-613
- Title: Account Access loginUser Proof
- Task Type: verification
- Current Stage: verification
- Status: DONE
- Owner: Test Automation Engineer
- Depends on: [LUC-611](/LUC/issues/LUC-611)
- Priority: P1
- Module Confidence Rows: Account access / API auth service login proof
- Requirement Rows: Account access login service proof
- Quality Scenario Rows: auth credential validation and session token proof
- Risk Rows: app-completion Account access implemented-needs-proof
- Iteration: 2026-07-12
- Operation Mode: BUILDER
- Mission ID: LUC-613-ACCOUNT-ACCESS-LOGINUSER-PROOF-2026-07-12
- Mission Status: VERIFIED

## Context

[LUC-611](/LUC/issues/LUC-611) resolved the documentation link for
`apps/api/src/modules/auth/auth.service.ts#loginUser`; project truth then
reported the same Account access entity as `implemented_needs_proof`.

## Goal

Add or reuse the smallest focused local automated proof for `loginUser`, link
that proof into architecture/app-completion source truth, and refresh generated
indexes so the row advances.

## Constraints

- Stay inside Test Automation Engineer ownership.
- Prefer focused local automated proof over broad test suites.
- Do not mutate production, deploy, push, restart, read protected credentials,
  or touch exchange/payment/subscription/live-trading state.
- Do not require local DB when a no-DB proof can directly verify the service
  branch.

## Definition of Done

- [x] Focused `loginUser` proof command passes.
- [x] Direct test-link relation is recorded.
- [x] Scanner override marks the exact entity verified with evidence.
- [x] Architecture-awareness, app-completion, and project-truth outputs are
  refreshed.
- [x] Evidence records blocked DB-backed attempt separately from passing proof.

## Forbidden

- Runtime auth behavior changes.
- Production smoke/protected credential readback.
- Push, deploy, restart, rollback, migration, DB/Redis mutation outside local
  test fixtures, exchange/payment/subscription mutation, order, position, bot
  activation, or LIVE trading action.

## Implementation Plan

1. Inspect the current auth service and existing auth tests.
2. Add a focused no-DB unit proof for `loginUser`.
3. Link the proof through `priority-test-links.csv` and
   `scanner-overrides.json`.
4. Run the focused test and formatting check.
5. Regenerate architecture-awareness, app-completion, and project-truth indexes.
6. Record evidence and update local state.

## Acceptance Criteria

- `auth.loginUser.test.ts` proves valid login, invalid credentials,
  password stripping, token payload inputs, and remember-aware TTL selection.
- `auth.service.ts#loginUser` no longer appears as the first project-truth
  `implemented_needs_proof` row.
- No protected or production mutation occurs.

## Validation Evidence

- Focused proof: PASS, `1` file / `3` tests.
- Formatting: PASS for the new TypeScript proof and scanner override JSON.
- Architecture-awareness refresh: PASS, `10738` entities, `35024` relations.
- App-completion refresh: PASS, `implementedNeedsProof=113`.
- Project-truth `--apply`: PASS; first gap advanced to
  `apps/api/src/modules/auth/auth.service.ts#registerUser` as
  `missing_doc_link`.

## Result Report

- Task summary: resolved the Account access `loginUser` implemented-needs-proof
  row with a focused automated proof and regenerated source-truth indexes.
- Files changed: auth login unit test, priority test-link registry, scanner
  overrides, generated graph/status indexes, state/evidence files.
- How tested: commands listed in the evidence file.
- What is incomplete: broader Account access app-completion rows remain open;
  the next row is `registerUser` missing-doc-link for Docs Memory Lead +
  Project Manager.
- Decisions made: use no-DB unit proof because local PostgreSQL and Docker
  were unavailable for DB-backed service tests.
