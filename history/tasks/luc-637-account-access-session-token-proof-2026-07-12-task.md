# LUC-637 Account Access Session-Token Proof

## Header

- ID: LUC-637
- Title: Account access session-token focused proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-636](/LUC/issues/LUC-636)
- Priority: P0
- Module Confidence Rows: Account access / API auth session-token proof
- Requirement Rows: not applicable
- Quality Scenario Rows: local automated regression proof
- Risk Rows: protected account/session smoke explicitly excluded
- Iteration: 2026-07-12
- Operation Mode: TESTER
- Mission ID: `LUC-637-ACCOUNT-ACCESS-SESSION-TOKEN-PROOF-2026-07-12`
- Mission Status: VERIFIED

## Context

[LUC-636](/LUC/issues/LUC-636) resolved the documentation-link blocker for the
scoped Account access session-token rows and advanced project truth to
`apps/api/src/modules/auth/sessionToken.ts#tokenIssuedAt` as
`implemented_needs_proof`.

## Goal

Prove the session-token issued-at ordering behavior with focused local
automation, link that proof into architecture/app-completion source truth, and
advance project-truth readback without broad build, deploy, protected smoke, or
runtime mutation.

## Scope

- Updated:
  `docs/architecture/relations/priority-test-links.csv`;
  `docs/architecture/scanner-overrides.json`;
  generated architecture/app-completion/project-truth outputs.
- Evidence:
  `history/evidence/luc-637-account-access-session-token-proof-2026-07-12.md`.

## Implementation Plan

1. Read the current session-token code and existing focused tests.
2. Run the smallest no-DB proof for session-token candidate behavior.
3. Link `sessionToken.ts#tokenIssuedAt` to executable focused proof.
4. Regenerate architecture-awareness, app-completion, and project-truth outputs.
5. Record evidence, residual risk, and next owner.

## Acceptance Criteria

- Focused session-token automated proof passes.
- `tokenIssuedAt` has a direct priority test relation and verified scanner
  override.
- Generated app-completion/project-truth readback no longer routes
  `tokenIssuedAt` as the first Account access `implemented_needs_proof` row.
- The next project-truth owner is named.

## Definition of Done

- Focused test passes.
- App-completion/project-truth indexes are refreshed.
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
  - `corepack pnpm --filter api exec vitest run src/modules/auth/sessionToken.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000`
    -> PASS, `1` file / `3` tests.
- Source truth:
  - architecture-awareness -> PASS, `10767` entities / `35159` relations,
    `entityOverridesApplied=19`, `relationOverridesApplied=12`.
  - app-completion -> PASS, `missingDocLink=1985`,
    `missingTestLink=973`, `implementedNeedsProof=113`, `riskItems=3523`.
  - project-truth `--apply` -> PASS, first gap now
    `backtests.e2e.test.ts#registerAndLogin` as `missing_doc_link`.
  - strict graph drift -> PASS, `853/853` covered, `0` missing.
- Reality status: verified local.

## Result Report

- Task summary:
  closed the session-token `tokenIssuedAt` implemented-proof row with focused
  local test proof and scanner linkage.
- Files changed:
  `docs/architecture/relations/priority-test-links.csv`,
  `docs/architecture/scanner-overrides.json`, generated status/graph files,
  and local task/evidence/context ledgers.
- What is incomplete:
  no remaining Test Automation action on [LUC-637](/LUC/issues/LUC-637).
  The next generated project-truth gap is docs-owned.
- Next steps:
  Docs Memory Lead + Project Manager own
  `apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin` as
  `missing_doc_link`.
- Decisions made:
  reuse the existing focused no-DB session-token unit proof instead of adding
  duplicate test coverage.
