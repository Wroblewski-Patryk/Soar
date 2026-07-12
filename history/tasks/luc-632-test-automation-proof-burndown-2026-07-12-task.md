# LUC-632 Test Automation Proof Burn-Down

## Header

- ID: LUC-632
- Title: Close top missing-test and implemented-needs-proof gaps
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-629](/LUC/issues/LUC-629)
- Priority: P0
- Module Confidence Rows: Account access / Bots runtime close controller; Account access / Auth session helpers
- Requirement Rows: not applicable
- Quality Scenario Rows: local automated regression proof
- Risk Rows: local DB-backed route-pack unavailable
- Iteration: 2026-07-12
- Operation Mode: TESTER
- Mission ID: `LUC-632-TEST-AUTOMATION-PROOF-BURNDOWN-2026-07-12`
- Mission Status: VERIFIED

## Context

[LUC-632](/LUC/issues/LUC-632) asked Test Automation to select a bounded proof
target from the app-completion priority queue and either add/run evidence or
produce exact failure-backed repair information.

## Goal

Close the current top TAE-owned proof gaps without broad workspace build, deploy,
protected smoke, or live account mutation.

## Scope

- Added:
  `apps/api/src/modules/bots/bots.controller.runtime-close.test.ts`.
- Updated:
  `docs/architecture/relations/priority-test-links.csv`;
  `docs/architecture/scanner-overrides.json`;
  generated architecture/app-completion/project-truth outputs.
- Evidence:
  `history/evidence/luc-632-test-automation-proof-burndown-2026-07-12.md`.

## Implementation Plan

1. Select the first TAE-owned app-completion proof row.
2. Prefer existing route-pack proof; if local infra blocks it, add the smallest
   no-DB controller proof.
3. Run focused proof commands.
4. Update proof-link metadata and generated source-truth indexes.
5. Record blocker, evidence, residual risk, and next owner.

## Acceptance Criteria

- A bounded proof target is selected from app-completion.
- Focused automated proof passes or the blocker is exact.
- Source-truth indexes reflect the proof status.
- The next project-truth row has a named owner.

## Definition of Done

- Focused tests pass.
- App-completion/project-truth indexes are refreshed.
- Evidence/task records are written.
- No forbidden production/protected/live actions occur.

## Forbidden

- Do not broaden into full workspace build.
- Do not claim stale/inferred proof without a current command result.
- Do not run production smoke, deploy, push, restart, rollback, mutate DB/Redis,
  mutate exchange/payment/subscription state, activate bots, or place/cancel
  LIVE orders.

## Validation Evidence

- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/bots.controller.runtime-close.test.ts --run --reporter=dot`
    -> PASS, `1` file / `4` tests.
  - `corepack pnpm --filter api exec vitest run src/modules/auth/auth.session.test.ts --run --reporter=dot`
    -> PASS, `1` file / `2` tests.
- Blocked check:
  - `bots.runtime-close-authority.route-pack.e2e.test.ts` -> failed because
    Prisma could not reach `localhost:5432`.
- Source truth:
  - architecture-awareness -> PASS, `10758` entities / `35105` relations.
  - app-completion -> PASS, `missingTestLink=973`,
    `implementedNeedsProof=113`, `riskItems=3527`.
  - project-truth `--apply` -> PASS, first gap now
    `sessionToken.test.ts#makeRequest` as `missing_doc_link`.
- Reality status: verified local.

## Result Report

- Task summary:
  closed one top missing-test row and two top implemented-proof rows.
- Files changed:
  `apps/api/src/modules/bots/bots.controller.runtime-close.test.ts`,
  `docs/architecture/relations/priority-test-links.csv`,
  `docs/architecture/scanner-overrides.json`, generated status/graph files,
  and local task/evidence/context ledgers.
- What is incomplete:
  DB-backed route-pack proof remains blocked in this runner by unavailable
  local PostgreSQL at `localhost:5432`.
- Next steps:
  Docs Memory Lead + Project Manager own the current project-truth first gap:
  `apps/api/src/modules/auth/sessionToken.test.ts#makeRequest` as
  `missing_doc_link`.
- Decisions made:
  use a DB-free controller unit proof for this heartbeat rather than waiting on
  unavailable local DB infrastructure.
