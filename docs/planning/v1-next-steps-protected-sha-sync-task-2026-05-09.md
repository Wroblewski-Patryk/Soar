# Task

## Header
- ID: V1-NEXT-STEPS-PROTECTED-SHA-SYNC-2026-05-09
- Title: Align protected continuation backlog with deployed SHA
- Task Type: release
- Current Stage: post-release
- Status: DONE
- Owner: Ops/Release
- Depends on: LIVEIMPORT-03-CURRENT-PRODUCTION-TARGET-SYNC-2026-05-09
- Priority: P1
- Iteration: 2026-05-09
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
After the current production target was synced to `4ee1672e`, the active
`.agents/state/next-steps.md` candidate backlog still had two protected
continuation instructions that referred to local `HEAD` or
`$(git rev-parse HEAD)`.

## Goal
Make the active continuation backlog consistently use the build-info-proven
production SHA for protected V1 evidence, while preserving the rule that a
newer SHA may be used only after production build-info proves it is deployed.

## Scope
- `.agents/state/next-steps.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/v1-next-steps-protected-sha-sync-task-2026-05-09.md`

## Success Signal
- User or operator problem: a future continuation could accidentally use local
  docs-only `HEAD` for protected evidence.
- Expected product or reliability outcome: protected readback and final gate
  instructions target deployed `4ee1672e` unless a newer candidate is proven.
- How success will be observed: active backlog text no longer instructs
  protected evidence collection from local `HEAD`.
- Post-launch learning needed: no

## Deliverable For This Stage
Committed docs/state sync with no runtime behavior changes.

## Constraints
- use existing source-of-truth docs and release evidence language
- do not mark `LIVEIMPORT-03`, rollback proof, RC approval, or V1 final gate
  complete
- do not run protected production commands
- do not rewrite historical evidence records

## Implementation Plan
1. Update active `.agents/state/next-steps.md` candidate backlog references.
2. Record the docs-only sync in planning and project state.
3. Run docs-only validations.
4. Commit the sync.

## Acceptance Criteria
- [x] Active `LIVEIMPORT-03` backlog instruction uses `4ee1672e` unless a
  newer deployed candidate is proven.
- [x] Active final release-gate backlog instruction uses build-info-proven
  expected SHA instead of `$(git rev-parse HEAD)`.
- [x] Protected evidence remains blocked on auth/operator inputs.
- [x] No production protected command is executed.

## Definition of Done
- [x] Source-of-truth docs are synchronized.
- [x] Validation commands pass.
- [x] No false V1 completion claim is introduced.

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
- treating public build-info as protected runtime evidence

## Validation Evidence
- Tests:
  - `git diff --check`
  - `node scripts/repoGuardrails.mjs`
  - `node scripts/checkDocsParity.mjs`
- Manual checks:
  - `rg -n "currently checked-out HEAD|git rev-parse HEAD|4ee1672e" .agents/state/next-steps.md`
- Screenshots/logs:
  - not applicable
- High-risk checks:
  - no protected production command was executed

## Architecture Evidence
- Architecture source reviewed:
  - `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`
  - `docs/planning/liveimport-03-current-production-target-sync-task-2026-05-09.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this documentation commit if needed
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: active continuation backlog still mentioned local `HEAD` for
  protected evidence.
- Gaps: protected auth/operator inputs are still unavailable.
- Inconsistencies: current target docs use `4ee1672e`, while candidate backlog
  still allowed local `HEAD` phrasing.
- Architecture constraints: protected evidence must be tied to a
  build-info-proven deployed SHA.

### 2. Select One Priority Task
- Selected task: sync protected continuation backlog SHA instructions.
- Priority rationale: it prevents future protected evidence from being aimed
  at an undeployed local docs-only commit.
- Why other candidates were deferred: full production UI audit and protected
  V1 evidence still require credentials/context.

### 3. Plan Implementation
- Files or surfaces to modify: active next-steps backlog, queue/context docs,
  and this task artifact.
- Logic: docs-only instruction correction.
- Edge cases: preserve the path for a newer SHA after production build-info
  proves it is deployed.

### 4. Execute Implementation
- Implementation notes: replaced local `HEAD` guidance with explicit
  build-info-proven SHA guidance.

### 5. Verify and Test
- Validation performed: docs diff check, repository guardrails, docs parity,
  and manual next-steps scan.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave the final blocker pack as the only source.
- Technical debt introduced: no
- Scalability assessment: future continuation remains deterministic and
  deploy-aware.
- Refinements made: kept newer-candidate path explicit but gated by
  build-info proof.

### 7. Update Documentation and Knowledge
- Docs updated: task artifact, next steps, planning queue, task board, project
  state.
- Context updated: yes
- Learning journal updated: not applicable.

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

## Result Report
- Task summary: corrected active protected continuation backlog SHA guidance.
- Files changed: `.agents/state/next-steps.md`, planning/context docs, and
  this task artifact.
- How tested: guardrails, docs parity, diff check, and manual next-steps scan.
- What is incomplete: protected V1 evidence remains blocked.
- Next steps: execute protected blocker pack only when approved auth/context
  exists.
- Decisions made: target `4ee1672e` until a newer deployed candidate is proven
  by production build-info.
