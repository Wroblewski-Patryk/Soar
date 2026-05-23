# Task

## Header
- ID: RUNTIME-AUDIT-112
- Title: Scope botless wallet trade fallback to LIVE runtime reads
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-108
- Priority: P1
- Iteration: 112
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime position reads include related trades for dashboard DCA, fee, and
history display. The read model had a botless `walletId=<bot wallet>` trade
fallback for every mode. That fallback is intended for LIVE imported/recovered
ownership, but PAPER bot-created positions now persist in bot scope and should
not inherit unrelated botless wallet-scoped trades.

## Goal
Prevent PAPER bot dashboards from including botless wallet-scoped trades while
preserving LIVE imported/recovered trade visibility.

## Success Signal
- User or operator problem: dashboard rows must reflect the selected bot's
  actual lifecycle, not unrelated wallet-scoped PAPER trades.
- Expected product or reliability outcome: PAPER runtime trade truth remains
  bot-scoped; LIVE recovery remains wallet-aware.
- How success will be observed: botless wallet trade fallback is emitted only
  for LIVE mode.
- Post-launch learning needed: yes.

## Deliverable For This Stage
Add a small helper for the fallback where clause, use it in runtime positions
read, and cover PAPER/LIVE behavior with focused tests.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] PAPER runtime position trade reads do not include botless wallet fallback.
- [x] LIVE runtime position trade reads retain botless wallet fallback.
- [x] Focused tests, API typecheck, guardrails, lint, and diff review pass.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- unrelated dashboard refactors
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/bots/runtimeSessionPositionsRead.service.test.ts --run` PASS (`4/4`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: diff/self-review PASS
- Screenshots/logs: not applicable
- High-risk checks: the initial guardrails run caught a monolith line-budget
  breach; helper formatting was tightened and guardrails passed on rerun.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/07_modes-parity-and-data.md`
  - `docs/architecture/reference/position-lifecycle-parity-matrix.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous runtime trade fallback.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: PAPER runtime position read could include botless wallet-scoped
  trades through a fallback meant for LIVE recovery.
- Gaps: no unit coverage asserted mode-specific trade fallback behavior.
- Inconsistencies: PAPER position ownership is bot-scoped, but the related
  trade fallback remained wallet-scoped.
- Architecture constraints: PAPER and LIVE share lifecycle semantics, but LIVE
  has exchange/import recovery behavior that PAPER does not need.

### 2. Select One Priority Task
- Selected task: restrict botless wallet trade fallback to LIVE runtime reads.
- Priority rationale: dashboard lifecycle rows must not mix unrelated PAPER
  wallet trades into a bot's position detail.
- Why other candidates were deferred: broader trade history/cashflow audits
  remain separate to keep this slice reversible.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
  - project planning/context files
- Logic: extract the botless wallet fallback branch into a helper that returns
  a where clause only when mode is LIVE and wallet id exists.
- Edge cases: no wallet id returns no fallback; PAPER returns no fallback; LIVE
  keeps the exact previous where clause.

### 4. Execute Implementation
- Implementation notes: extracted `buildBotlessWalletTradeFallbackWhere` and
  replaced the inline botless wallet trade branch with the mode-aware helper.

### 5. Verify and Test
- Validation performed: focused runtime positions read unit suite, API
  typecheck, repository guardrails, lint, and `git diff --check`.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: add `mode === 'LIVE'` inline at the spread site;
  rejected because the helper gives stable focused coverage without DB.
- Technical debt introduced: no
- Scalability assessment: fits the current LIVE recovery versus PAPER
  bot-scoped ownership split.
- Refinements made: compacted helper formatting after guardrails caught the
  production monolith line budget.

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
Keep PAPER runtime trade rows bot-scoped while retaining LIVE recovery.

### Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
- planning/context source-of-truth files

### Implementation Plan
1. Add mode-aware fallback helper.
2. Replace inline fallback branch with the helper.
3. Add PAPER and LIVE unit coverage.
4. Run focused and repository validation.
5. Update planning/context evidence.

### Acceptance Criteria
- PAPER helper output is empty.
- LIVE helper output matches the existing botless wallet fallback.
- Runtime position read still includes position-linked and bot-scoped trades.

### Definition of Done
Use `DEFINITION_OF_DONE.md`; record every applicable validation and residual
risk before closing.

### Result Report
Closed locally. Runtime position trade reads now include botless wallet-scoped
trade fallback only in LIVE mode, preserving imported/recovered trade
visibility without allowing PAPER bot dashboards to include unrelated botless
wallet-scoped trades. Files changed:
`apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`,
`apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`,
`.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
`docs/planning/mvp-next-commits.md`,
`docs/planning/mvp-execution-plan.md`, and this task contract. Validation PASS:
focused runtime positions read unit suite (`4/4`), API typecheck, repository
guardrails, lint, and diff review.
