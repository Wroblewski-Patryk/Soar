# Task

## Header
- ID: RUNTIME-AUDIT-65
- Title: Market-scope imported external position identity
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-64
- Priority: P1
- Iteration: 83
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-64` scoped takeover ownership by market type, but imported
position `externalId` is still generated as `apiKey:symbol:side`. If one API
key can expose the same symbol in multiple market types, persisted identity can
still collide even when ownership no longer does.

## Goal
Generate market-scoped imported position external IDs while preserving legacy
read compatibility for existing `apiKey:symbol:side` rows.

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.helpers.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- focused reconciliation tests
- context and planning source-of-truth files

## Implementation Plan
1. Add shared helper functions to build and parse imported position external
   IDs with canonical `apiKey:marketType:symbol:side` format.
2. Preserve parsing support for legacy `apiKey:symbol:side`.
3. Use canonical builder during live reconciliation import.
4. Keep stale-symbol extraction working for both formats.
5. Add focused regression proving SPOT imports use the market-scoped ID.
6. Run focused tests, typecheck, lint, guardrails, and diff check.

## Acceptance Criteria
- New reconciliation imports use `apiKey:marketType:symbol:side`.
- Legacy `apiKey:symbol:side` parsing still returns the right API key and
  symbol.
- Stale reconciliation does not misread market type as a symbol.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied with validation evidence.
- [x] Focused regression covers canonical market-scoped ID generation.
- [x] Source-of-truth files are updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/positions/livePositionReconciliation.service.test.ts --run` PASS (`26/26`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS
- Manual checks: source inspection found imported `externalId` omitted market type;
  follow-up diff review confirmed canonical generation, legacy lookup fallback,
  and legacy parser compatibility.
- Screenshots/logs: not applicable
- High-risk checks: legacy ID parsing must remain compatible

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore legacy imported external IDs
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: imported position external IDs are market-type blind.
- Gaps: no canonical builder/parser owns this identity contract.
- Inconsistencies: ownership key is market-scoped, persisted external ID is not.
- Architecture constraints: lifecycle guardrails must be deterministic and
  fail-closed without guessing ownership.

### 2. Select One Priority Task
- Selected task: market-scope imported position external ID generation and parsing.
- Priority rationale: directly follows the ownership fix and reduces the next
  likely LIVE SPOT/FUTURES divergence.
- Why other candidates were deferred: broader dashboard and wallet audits remain
  important, but this is the smallest high-impact backend identity slice.

### 3. Plan Implementation
- Files or surfaces to modify: reconciliation helper/service/tests and source
  of truth docs.
- Logic: canonical build path writes `apiKey:marketType:symbol:side`; parser
  accepts both canonical and legacy formats.
- Edge cases: symbols are normalized; legacy rows must continue to sync, stale,
  and close correctly.

### 4. Execute Implementation
- Implementation notes:
  - Added canonical imported external ID helpers for build, legacy build, pair
    build, parse, and stale-symbol extraction.
  - LIVE reconciliation now writes `apiKey:marketType:symbol:side` when
    `apiKey.marketType` is present.
  - Reconciliation checks canonical ID first and legacy ID second before
    creating an imported row, letting existing legacy rows be reused/upgraded.

### 5. Verify and Test
- Validation performed: focused reconciliation suite, API typecheck, guardrails,
  lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: change only the string template in reconciliation.
  Rejected because stale-symbol extraction would misread `SPOT` or `FUTURES`
  as a symbol.
- Technical debt introduced: no
- Scalability assessment: helper-based ID contract can carry additional market
  types if the enum expands later.
- Refinements made: moved ID pair logic into helpers and compressed service
  lookup calls to stay within the production monolith line budget.

### 7. Update Documentation and Knowledge
- Docs updated: task board, project state, MVP next commits, this evidence file.
- Context updated: yes
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
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
- [x] Learning journal was updated if a recurring pitfall is confirmed.

## Result Report

- Task summary: imported LIVE position identity is now market-scoped while
  legacy rows remain readable and reusable.
- Files changed:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-65-market-scoped-external-position-id-task-2026-05-03.md`
  - `apps/api/src/modules/positions/livePositionReconciliation.helpers.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- How tested: focused reconciliation suite, API typecheck, guardrails, lint,
  and diff check passed.
- What is incomplete: no DB migration was required; historical rows keep their
  legacy ID until touched by reconciliation.
- Next steps: continue the runtime audit with the next smallest dashboard/API
  parity drift.
- Decisions made: use canonical market-scoped IDs only when market type is
  known, preserving legacy generation for explicit market-type-less test or
  dependency contexts.
