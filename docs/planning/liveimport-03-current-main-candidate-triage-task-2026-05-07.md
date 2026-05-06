# Task

## Header
- ID: LIVEIMPORT-03A
- Title: Triage stale imported-position release candidate against current main
- Task Type: release
- Current Stage: planning
- Status: DONE
- Owner: QA/Test
- Depends on: V1GATE-02
- Priority: P0
- Iteration: 49
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The remaining queue still contained `LIVEIMPORT-03`, asking to promote commit
`39146d2e` and read back ETH/DOGE production rows. After `V1GATE-02`,
production build-info reports current `origin/main` (`6a7c9889`). The old
`39146d2e` commit is not an ancestor of the deployed SHA, while current main
contains a later imported-position ownership/provenance implementation. The
queue needed a precise split between stale candidate promotion and the still
valid authenticated readback gap.

## Goal
Prevent an obsolete release action from being treated as the next V1 step, and
record fresh local evidence for current main's imported-position runtime
behavior.

## Scope
- Git ancestry check for `39146d2e` against deployed `6a7c9889`.
- Local focused imported-position/runtime strategy regression pack.
- Planning/context updates that keep `LIVEIMPORT-03` open only for
  authenticated production readback on current main.

## Success Signal
- User or operator problem: stale queued release instructions can cause a wrong
  production action or false V1 confidence.
- Expected product or reliability outcome: the next operator step is clear:
  authenticate and read back current production rows, not promote an obsolete
  commit.
- How success will be observed: focused tests pass and queue text no longer
  asks to promote `39146d2e` as the current candidate.
- Post-launch learning needed: no

## Deliverable For This Stage
Planning-stage triage evidence and source-of-truth correction.

## Constraints
- Do not mark `LIVEIMPORT-03` done without authenticated production readback.
- Do not cherry-pick or promote obsolete commit `39146d2e`.
- Do not run live-money or destructive production actions.
- Do not claim production ETH/DOGE row truth from local tests.

## Acceptance Criteria
- `39146d2e` ancestry status is recorded.
- Current main imported-position/runtime regression pack passes.
- Queue wording is corrected so the remaining task is authenticated readback on
  current production, not stale promotion.
- BOTMULTI stale production-build blocker text is refreshed after `V1GATE-02`.

## Definition of Done
- [x] Stale candidate status is documented.
- [x] Focused local runtime regression pack passes.
- [x] `LIVEIMPORT-03` remains open for authenticated readback only.
- [x] Stale BOTMULTI production-build-info blocker is corrected.
- [x] Relevant planning/context docs are updated.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts src/modules/bots/bots.runtime-strategy-context.e2e.test.ts src/modules/engine/executionOrchestrator.owned-import.e2e.test.ts src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` PASS (`51/51`).
- Manual checks:
  - `git merge-base --is-ancestor 39146d2e 6a7c9889d24a55c870b32aa10cb284ede6db1c59` returned non-zero.
  - `git cherry -v 6a7c9889d24a55c870b32aa10cb284ede6db1c59 39146d2e` returned `+ 39146d2e...`, confirming it is not patch-equivalent to deployed `main`.
  - `git merge-base --is-ancestor f3aaa3dca6cf4d4b199372563886165638391a77 6a7c9889d24a55c870b32aa10cb284ede6db1c59` PASS, confirming the old BOTMULTI production-build-info blocker is stale.
- Screenshots/logs: not applicable.
- High-risk checks:
  - No production secrets, auth tokens, live orders, deploys, or database
    mutations were used.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/operations/v1-function-implementation-readiness-audit-2026-05-01.md`
  - `docs/planning/mvp-next-commits.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: no runtime change.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `LIVEIMPORT-03` still referenced obsolete commit `39146d2e` as a
  promotion candidate even though production now runs `6a7c9889`.
- Gaps: authenticated ETH/DOGE readback remains unavailable in this session.
- Inconsistencies: BOTMULTI release text still said production build-info was
  on an older SHA, which `V1GATE-02` disproved.
- Architecture constraints: V1 evidence must separate local regression proof
  from authenticated production row proof.

### 2. Select One Priority Task
- Selected task: LIVEIMPORT-03A stale candidate triage.
- Priority rationale: stale release instructions are risky in a money-managing
  app and can cause a wrong deploy/readback step.
- Why other candidates were deferred: authenticated readback and restore/stage
  actions require operator credentials or infrastructure access not present in
  this session.

### 3. Plan Implementation
- Files or surfaces to modify:
  - this task evidence
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Logic: verify ancestry and focused tests first, then update queue wording.
- Edge cases: do not close `LIVEIMPORT-03`, because the production ETH/DOGE
  readback remains unproven.

### 4. Execute Implementation
- Implementation notes: planning/context wording was corrected only after tests
  and ancestry checks completed.

### 5. Verify and Test
- Validation performed: focused imported-position/runtime strategy pack and git
  ancestry/cherry checks.
- Result: local current-main runtime behavior is green; old candidate promotion
  is stale; authenticated production readback remains open.

### 6. Self-Review
- Simpler option considered: delete `LIVEIMPORT-03`. Rejected because the
  authenticated production readback is still a real V1 evidence gap.
- Technical debt introduced: no
- Scalability assessment: the queue now points to the real next operator step.
- Refinements made: BOTMULTI production-build blocker wording was updated based
  on current public build-info evidence.

### 7. Update Documentation and Knowledge
- Docs updated:
  - this task evidence
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Context updated:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
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
- Task summary: clarified that `LIVEIMPORT-03` should not promote stale
  `39146d2e`; it remains open for authenticated readback against current
  production `main`.
- Files changed: planning/context docs only.
- How tested: focused API runtime pack (`51/51`) plus git ancestry/cherry
  checks.
- What is incomplete: authenticated ETH/DOGE production runtime readback.
- Next steps: run `LIVEIMPORT-03` with an authenticated operator session on
  current production, then record ETH/DOGE ownership/provenance/TTP/actionable
  state evidence.
