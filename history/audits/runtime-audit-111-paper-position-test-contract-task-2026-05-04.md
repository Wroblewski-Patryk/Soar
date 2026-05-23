# Task

## Header
- ID: RUNTIME-AUDIT-111
- Title: Align PAPER bot position test contract with bot scope
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-108
- Priority: P1
- Iteration: 111
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
RUNTIME-AUDIT-108 changed bot-created PAPER positions to persist in bot scope
with `Position.walletId=null`. A small number of DB-backed tests still asserted
the old wallet-scoped PAPER position shape for bot-created market fills.

## Goal
Update regression tests so they enforce the approved PAPER bot-scoped
persistence contract instead of the old wallet-scoped shape.

## Success Signal
- User or operator problem: validation should not ask future agents to undo
  the PAPER bot-scope fix.
- Expected product or reliability outcome: tests protect the current
  architecture contract.
- How success will be observed: bot-created PAPER position tests expect
  `walletId=null` while LIVE remains wallet-scoped.
- Post-launch learning needed: no.

## Deliverable For This Stage
Patch only the stale assertions and update project planning/context evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] PAPER bot-created position assertions expect `walletId=null`.
- [x] LIVE wallet-scoped assertions remain unchanged.
- [x] Repository validation is run, or DB-dependent checks blocked by local
  PostgreSQL are explicitly recorded.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- runtime behavior changes
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts --run` TIMED OUT after 120s locally.
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Screenshots/logs: not applicable
- Manual checks: diff/self-review PASS
- High-risk checks: no runtime code changed; only stale DB-backed assertions
  were aligned with the already implemented PAPER bot-scope persistence
  contract.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/07_modes-parity-and-data.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous stale expectations.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: DB-backed tests in order flows still expected bot-created PAPER
  positions to carry `walletId`.
- Gaps: the tests did not reflect RUNTIME-AUDIT-108's bot-scoped DB
  uniqueness lane.
- Inconsistencies: runtime code and newer focused tests expect `walletId=null`,
  while older e2e/service assertions expected the paper wallet id.
- Architecture constraints: manual and bot-originated entries share lifecycle
  truth; PAPER uses simulated fills but durable runtime entities remain
  PostgreSQL truth.

### 2. Select One Priority Task
- Selected task: update stale PAPER position persistence assertions.
- Priority rationale: false negative DB tests can block future V1 verification
  and encourage reverting the correct runtime fix.
- Why other candidates were deferred: runtime code changes are not needed for
  this slice.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/orders/orders.service.test.ts`
  - `apps/api/src/modules/orders/orders.manual-paper-market.e2e.test.ts`
  - project planning/context files
- Logic: change bot-created PAPER position wallet expectations from
  `paperWallet.id` to `null`; keep LIVE expected wallet id.
- Edge cases: do not alter fixtures that intentionally create legacy/manual
  wallet-scoped PAPER rows for unrelated ignore/compatibility scenarios.

### 4. Execute Implementation
- Implementation notes: changed two stale wallet-id assertions from
  `paperWallet.id` to `null` for bot-created PAPER positions, while keeping
  LIVE wallet id expectations intact.

### 5. Verify and Test
- Validation performed: attempted targeted DB-backed order tests, then ran API
  typecheck, repository guardrails, lint, and `git diff --check`.
- Result: static validation PASS; targeted DB-backed tests timed out locally
  after 120s.

### 6. Self-Review
- Simpler option considered: update all fixtures that mention paper wallet ids;
  rejected because some fixtures intentionally model legacy/manual wallet scope
  or order attribution rather than bot-created position persistence.
- Technical debt introduced: no
- Scalability assessment: improves test-suite alignment with the current V1
  runtime ownership model.
- Refinements made: kept the scope to direct assertions that enforce the stale
  contract.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - this task contract
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Production-Grade Required Contract

### Goal
Ensure DB-backed tests enforce PAPER bot-scoped persistence.

### Scope
- Tests:
  - `apps/api/src/modules/orders/orders.service.test.ts`
  - `apps/api/src/modules/orders/orders.manual-paper-market.e2e.test.ts`
- Docs/context:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`

### Implementation Plan
1. Patch stale expectations.
2. Run focused DB tests if local PostgreSQL is available.
3. Run non-DB repository validations.
4. Update task and planning evidence.

### Acceptance Criteria
- Bot-created PAPER position expectations use `null` wallet id.
- LIVE expectations remain wallet-scoped.
- No runtime code changes are introduced.

### Definition of Done
Use `DEFINITION_OF_DONE.md`; record every applicable validation and residual
risk before closing.

### Result Report
Closed locally. DB-backed order tests now expect bot-created PAPER positions to
persist with `Position.walletId=null`, while LIVE remains wallet-scoped,
aligning the regression suite with RUNTIME-AUDIT-108. Files changed:
`apps/api/src/modules/orders/orders.service.test.ts`,
`apps/api/src/modules/orders/orders.manual-paper-market.e2e.test.ts`,
`.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
`docs/planning/mvp-next-commits.md`,
`docs/planning/mvp-execution-plan.md`, and this task contract. Validation PASS:
API typecheck, repository guardrails, lint, and diff review. The targeted
DB-backed order tests were attempted but timed out locally after 120s, so they
remain pending for an environment with responsive PostgreSQL.
