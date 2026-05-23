# Task

## Header
- ID: RUNTIME-AUDIT-66
- Title: Parse imported external ID market for ownership lookups
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-65
- Priority: P1
- Iteration: 84
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-65` made new imported position IDs market-scoped, but several
ownership read paths still parsed only the API key and then queried ownership
without the market type carried by the external ID.

## Goal
Make imported-position ownership read paths consume the market type parsed from
canonical external IDs while preserving legacy fallback behavior.

## Scope
- `apps/api/src/modules/positions/positions.service.ts`
- `apps/api/src/modules/engine/runtimeImportedPositionOwnership.ts`
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
- focused tests for takeover status / runtime loop or imported ownership
- context and planning source-of-truth files

## Implementation Plan
1. Use existing imported external ID parser where position rows expose
   `externalId`.
2. Pass parsed `marketType` into `getExternalPositionOwnership`.
3. Preserve wallet/default fallback when rows are legacy or parser has no
   market type.
4. Add or update focused regression coverage for SPOT canonical IDs.
5. Run focused tests, typecheck, lint, guardrails, and diff check.

## Acceptance Criteria
- SPOT canonical imported external IDs query SPOT ownership, not FUTURES.
- Legacy IDs remain readable with existing FUTURES fallback.
- Dashboard/takeover/runtime hydration paths stay deterministic and fail-closed.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied with validation evidence.
- [x] Focused regression covers parsed market type ownership lookup.
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
  - `pnpm --filter api run test -- src/modules/engine/runtimeSignalLoopDefaults.test.ts --run` PASS (`10/10`)
  - `pnpm --filter api run test -- src/modules/positions/livePositionReconciliation.service.test.ts --run` PASS (`26/26`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS
- Manual checks: source inspection found external ID market parsing omitted in
  ownership read paths; diff review confirmed parsed market type now flows into
  takeover, hydration, and runtime-loop ownership lookups.
- Screenshots/logs: not applicable
- High-risk checks: legacy behavior must remain fail-closed

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
- Rollback note: revert this commit to restore previous default-market ownership reads
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: canonical external IDs include market type, but readers often ignored it.
- Gaps: no regression proves SPOT external ID reads SPOT ownership.
- Inconsistencies: write path became market-aware before all read paths did.
- Architecture constraints: runtime ownership guardrails must use exact
  canonical context and fail closed.

### 2. Select One Priority Task
- Selected task: parse external ID market type for ownership read paths.
- Priority rationale: prevents a direct SPOT/FUTURES drift after the previous
  identity change.
- Why other candidates were deferred: broader dashboard drift search continues
  after this exact ownership read correction.

### 3. Plan Implementation
- Files or surfaces to modify: listed scope files and focused tests.
- Logic: parse `externalId`; pass parsed market type to ownership lookup, with
  legacy fallback when absent.
- Edge cases: null external ID, legacy IDs, walletless imported rows.

### 4. Execute Implementation
- Implementation notes:
  - `parseImportedExternalPositionId` now has a typed return contract.
  - Takeover rebind/status uses parsed external ID API key and market type.
  - Imported runtime ownership hydration uses parsed external ID API key and market type.
  - Runtime loop managed-external guard uses parsed market type before wallet/default fallback.

### 5. Verify and Test
- Validation performed: runtime loop regression, reconciliation regression,
  API typecheck, guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: only adjust runtime loop. Rejected because
  takeover status and imported ownership hydration are separate dashboard/API
  read surfaces.
- Technical debt introduced: no
- Scalability assessment: parser contract stays compatible with legacy IDs and
  can support future enum expansion.
- Refinements made: used the existing parser instead of adding another string split path.

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

- Task summary: ownership read paths now consume parsed market type from
  canonical imported external IDs.
- Files changed:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-66-parse-external-id-market-ownership-task-2026-05-03.md`
  - `apps/api/src/modules/positions/livePositionReconciliation.helpers.ts`
  - `apps/api/src/modules/positions/positions.service.ts`
  - `apps/api/src/modules/engine/runtimeImportedPositionOwnership.ts`
  - `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
  - `apps/api/src/modules/engine/runtimeSignalLoopDefaults.test.ts`
- How tested: focused runtime loop and reconciliation suites, API typecheck,
  guardrails, lint, and diff check passed.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue the runtime audit with the next dashboard/API parity drift.
- Decisions made: parsed market type wins over wallet/default fallback when
  canonical external ID provides it.
