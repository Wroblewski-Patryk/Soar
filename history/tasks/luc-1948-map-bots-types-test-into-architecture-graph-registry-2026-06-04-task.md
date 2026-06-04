# Task

## Header
- ID: LUC-1948
- Title: Map bots types test into architecture graph registry
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Docs Memory Lead
- Depends on: LUC-1941
- Priority: P2
- Module Confidence Rows: SOAR-ASSISTANT-AI-001; SOAR-ARCHITECTURE-EVIDENCE-GRAPH
- Requirement Rows: not applicable
- Quality Scenario Rows: Architecture graph drift coverage
- Risk Rows: not applicable
- Iteration: 2026-06-04 Docs Memory heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-1948-MAP-BOTS-TYPES-TEST-GRAPH-REGISTRY-2026-06-04
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] Affected module confidence rows were identified.
- [x] The task improves release confidence by removing strict architecture graph drift.

## Mission Block
- Mission objective: map `apps/api/src/modules/bots/bots.types.test.ts` into the architecture graph/test registry and prove strict drift is closed.
- Release objective advanced: unblock [LUC-1941](/LUC/issues/LUC-1941) medium graph cleanup closure verification.
- Included slices: registry test-node mapping, incidental same-gate API test registry omissions found by strict drift, generated graph refresh, focused drift/test proof, source-of-truth task record.
- Explicit exclusions: runtime behavior changes, deploy, restart, rollback, env edits, database actions, secret/account handling, live-trading actions.
- Checkpoint cadence: single heartbeat.
- Stop conditions: strict graph drift remains non-zero, focused test fails, or ownership conflict appears.
- Handoff expectation: issue can be closed when validation passes.

## Context
[LUC-1941](/LUC/issues/LUC-1941) verified the medium graph cleanup candidates but found strict architecture graph drift failed because `apps/api/src/modules/bots/bots.types.test.ts` was not covered by the graph registry. The test verifies `AssistantDryRunSchema` accepts only advisory dry-run modes and rejects `LIVE`.

## Goal
Record the bots types schema safety test in the canonical architecture graph test registry and regenerate graph outputs so strict drift reports `0` missing files.

## Scope
- `docs/architecture/registry/tests.csv`
- Generated graph outputs from `pnpm run architecture:graph:generate`
- Local state/evidence files for [LUC-1948](/LUC/issues/LUC-1948)

## Implementation Plan
1. Classify the uncovered test and its existing owning architecture node.
2. Add `apps/api/src/modules/bots/bots.types.test.ts` as a related file on `SOAR-TEST-AI-ASSISTANT-API`.
3. Regenerate architecture graph outputs from the registry.
4. Run strict drift and focused Vitest proof.
5. Record closure evidence and issue disposition.

## Acceptance Criteria
- `SOAR-TEST-AI-ASSISTANT-API` references `apps/api/src/modules/bots/bots.types.test.ts`.
- `pnpm run architecture:graph:drift:strict` reports `820/820 covered, 0 missing`.
- The focused newly mapped API test pack passes.

## Definition of Done
- [x] Graph registry source truth updated.
- [x] Generated graph outputs refreshed.
- [x] Focused validation passed.
- [x] No runtime/product/deploy mutation occurred.

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/bots/bots.types.test.ts src/modules/bots/botAssistant.service.test.ts src/middleware/requireTrustedOrigin.unit.test.ts src/modules/auth/sessionToken.test.ts` -> PASS (`4` files / `10` tests).
- Manual checks: `apps/api/src/modules/bots/bots.types.test.ts` and `apps/api/src/modules/bots/botAssistant.service.test.ts` map to existing `SOAR-TEST-AI-ASSISTANT-API`; strict drift also required adjacent API middleware/auth test omissions to be mapped to their existing owner nodes.
- High-risk checks: no secret, env, deploy, database, account, or live-trading operation performed.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `.agents/core/project-memory-index.md`, `docs/architecture/registry/tests.csv`, generated architecture graph outputs.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: strict graph drift failed with one missing file, `apps/api/src/modules/bots/bots.types.test.ts`.
- Gaps: target test file was not referenced in graph registry; final strict drift also exposed adjacent API test registry omissions from the already-dirty workspace.
- Inconsistencies: none; existing `SOAR-TEST-AI-ASSISTANT-API` was the correct owner.
- Architecture constraints: graph registry CSV is source truth; generated outputs must be rebuilt from it.

### 2. Select One Priority Mission Objective
- Selected task: close [LUC-1948](/LUC/issues/LUC-1948).
- Priority rationale: it directly unblocks [LUC-1941](/LUC/issues/LUC-1941).
- Why other candidates were deferred: issue wake was scoped and actionable.

### 3. Plan Implementation
- Files or surfaces to modify: `docs/architecture/registry/tests.csv` plus generated graph outputs/state evidence.
- Logic: add the new schema test as related proof under the AI Assistant API test node.
- Edge cases: avoid creating a duplicate node for a focused schema test already owned by the AI Assistant foundation slice.

### 4. Execute Implementation
- Implementation notes: mapped `apps/api/src/modules/bots/bots.types.test.ts` and `apps/api/src/modules/bots/botAssistant.service.test.ts` to `SOAR-TEST-AI-ASSISTANT-API`; mapped `apps/api/src/middleware/requireTrustedOrigin.unit.test.ts` to `SOAR-TEST-API-MIDDLEWARE-SAFETY`; mapped `apps/api/src/modules/auth/sessionToken.test.ts` to `SOAR-TEST-API-AUTH-SESSION-DEEP`; refreshed `last_verified_at` values to `2026-06-04`, and regenerated graph outputs.

### 5. Verify and Test
- Validation performed:
  - `pnpm run architecture:graph:generate` -> PASS (`647` nodes / `810` relations / `27` chains).
  - `pnpm run architecture:graph:drift:strict` -> PASS (`820/820` covered / `0` missing).
  - `pnpm --filter api exec vitest run src/modules/bots/bots.types.test.ts src/modules/bots/botAssistant.service.test.ts src/middleware/requireTrustedOrigin.unit.test.ts src/modules/auth/sessionToken.test.ts` -> PASS (`4` files / `10` tests).
- Result: verified.

### 6. Self-Review
- Simpler option considered: adding a standalone test node.
- Technical debt introduced: no.
- Scalability assessment: reusing the existing AI Assistant API test node keeps the graph compact and consistent.
- Refinements made: no runtime code changed.

### 7. Update Documentation and Knowledge
- Docs updated: architecture registry and generated graph outputs.
- Context updated: task board, project state, system health, module confidence ledger.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs/context updated.

## Result Report
- Task summary: mapped the new bots types schema test into the AI Assistant API test graph node, closed adjacent same-gate API test registry omissions exposed by strict drift, and proved strict graph drift is closed.
- Files changed: `docs/architecture/registry/tests.csv`, generated graph outputs, and local state/evidence files.
- How tested: graph generate, strict graph drift, focused Vitest.
- What is incomplete: nothing for [LUC-1948](/LUC/issues/LUC-1948).
- Next steps: [LUC-1941](/LUC/issues/LUC-1941) can be unblocked/rechecked by QA.
- Decisions made: reused `SOAR-TEST-AI-ASSISTANT-API` as the owner because the test verifies assistant dry-run safety schema behavior.
