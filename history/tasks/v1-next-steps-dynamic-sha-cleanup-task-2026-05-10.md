# V1-NEXT-STEPS-DYNAMIC-SHA-CLEANUP-2026-05-10

## Header
- ID: V1-NEXT-STEPS-DYNAMIC-SHA-CLEANUP-2026-05-10
- Title: Remove stale static SHA targets from V1 continuation backlog
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: V1-OPERATOR-RUNBOOK-DYNAMIC-SHA-2026-05-10
- Priority: P0
- Iteration: V1 release handoff cleanup
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this architecture/handoff cleanup.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The final blocker execution pack and operator unblock checklist already derive
`$expectedSha` from production `/api/build-info`. The lower continuation
backlog in `.agents/state/next-steps.md` still referenced old static SHAs
(`c50e1e7c` and `30b027b7`) in example commands, which could mislead future
agents or operators during protected evidence collection.

## Goal
Make `.agents/state/next-steps.md` consistent with the dynamic build-info
operator flow and remove stale static SHA targets from the active V1 handoff.

## Success Signal
- User or operator problem: future protected runs should not target historical
  commits by accident.
- Expected product or reliability outcome: one authoritative SHA selection
  rule: read production build-info first, optionally compare an intended SHA.
- How success will be observed: continuation backlog points to the dynamic
  final blocker pack instead of hard-coded old SHAs.
- Post-launch learning needed: no

## Deliverable For This Stage
Updated continuation backlog and source-of-truth sync for the handoff cleanup.

## Scope
- `.agents/state/next-steps.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Replace stale static SHA examples in `.agents/state/next-steps.md` with the
   dynamic `$buildInfo.gitSha` flow.
2. Preserve the explicit rule that build-info freshness is not protected
   runtime proof.
3. Record the cleanup in canonical queue/context docs.
4. Run docs and guardrail validation.

## Acceptance Criteria
- [x] No active continuation instruction tells operators to use stale
  `c50e1e7c` or `30b027b7` as the default target.
- [x] Protected evidence instructions point to the final blocker pack and
  dynamic `$expectedSha` selection.
- [x] No runtime, API, UI, deploy, auth, or release-gate behavior changes.
- [x] Relevant validation passes.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for a docs/handoff release task.
- [x] Existing approved operator flow reused.
- [x] Source-of-truth docs updated.
- [x] Validation evidence attached.

## Stage Exit Criteria
- [x] The output matches the declared `verification` stage.
- [x] No implementation work was mixed in.
- [x] Residual protected blockers remain explicit.

## Forbidden
- changing release-gate behavior
- introducing new deploy or evidence mechanisms
- treating build-info as `LIVEIMPORT-03`, rollback, RC, or authenticated UI proof
- hiding protected-input requirements

## Validation Evidence
- Tests:
  - `node scripts\repoGuardrails.mjs`
  - `node scripts\checkDocsParity.mjs`
  - `git diff --check`
- Manual checks:
  - reviewed final blocker pack dynamic `$expectedSha` flow
  - reviewed operator unblock checklist dynamic `$expectedSha` flow
- Screenshots/logs: not applicable
- High-risk checks: no secrets, no production mutation, no live-money action

## Architecture Evidence
- Architecture source reviewed:
  - `history/plans/v1-final-blocker-execution-pack-2026-05-07.md`
  - `history/releases/v1-operator-unblock-checklist-2026-05-10.md`
  - `.agents/core/execution-loop.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## UX/UI Evidence
- Design source type: not applicable
- Design source reference: not applicable
- Canonical visual target: not applicable
- Fidelity target: not applicable
- Stitch used: no
- Experience-quality bar reviewed: not applicable
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: not applicable
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: not applicable
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: none
- Required states: not applicable
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: not applicable

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: docs-only handoff cleanup
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: active lower backlog referenced old static SHAs after the runbook had
  moved to build-info-derived targets.
- Gaps: protected credentials and real RC approvals remain unavailable.
- Inconsistencies: stale SHA examples conflicted with the newest operator pack.
- Architecture constraints: use the existing final blocker pack.

### 2. Select One Priority Task
- Selected task: clean stale SHA targets from continuation backlog.
- Priority rationale: prevents future protected evidence from targeting the
  wrong deployed candidate.
- Why other candidates were deferred: protected evidence requires operator
  credentials/approvals.

### 3. Plan Implementation
- Files or surfaces to modify: handoff docs only.
- Logic: replace static SHA defaults with the dynamic build-info command block.
- Edge cases: preserve intended-SHA comparison for deliberate promotions.

### 4. Execute Implementation
- Implementation notes: `.agents/state/next-steps.md` now points to the
  dynamic final blocker pack and removes old default SHA targets.

### 5. Verify and Test
- Validation performed: guardrails, docs parity, diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave lower backlog historical text unchanged.
- Technical debt introduced: no
- Scalability assessment: future agents have one SHA selection rule.
- Refinements made: canonical queue/context record this cleanup.

### 7. Update Documentation and Knowledge
- Docs updated: yes
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
- Task summary: removed stale static SHA defaults from V1 continuation backlog.
- Files changed: `.agents/state/next-steps.md`, canonical queue/context docs,
  and this task artifact.
- How tested: guardrails, docs parity, diff check.
- What is incomplete: protected V1 evidence remains blocked on credentials and
  approvals.
- Next steps: run final blocker pack with operator-provided protected inputs.
- Decisions made: dynamic production build-info remains the default target
  source for protected evidence.
