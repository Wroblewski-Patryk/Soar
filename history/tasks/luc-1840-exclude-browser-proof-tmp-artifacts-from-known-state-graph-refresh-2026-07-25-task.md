# Task

## Header
- ID: LUC-1840
- Title: Exclude browser-proof `.tmp` artifacts from known-state graph refresh
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Review
- Depends on: LUC-1838
- Priority: P1
- Module Confidence Rows: not applicable
- Requirement Rows: not applicable
- Quality Scenario Rows: not applicable
- Risk Rows: not applicable
- Iteration: 1
- Operation Mode: ARCHITECT
- Mission ID: LUC-1840-KNOWN-STATE-TMP-EXCLUSION-2026-07-25
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: prevent transient browser-profile artifacts under repo `.tmp/` from polluting known-state refresh outputs.
- Release objective advanced: restore trustworthy architecture-awareness refresh inputs after LUC-1838 pollution finding.
- Included slices: scanner ignore-rule repair, regression tests, state/task evidence updates.
- Explicit exclusions: no browser-proof rerun, no full known-state rerun, no deploy/push.
- Checkpoint cadence: analyze -> implement -> focused verification -> state sync.
- Stop conditions: ignore rules applied to all known-state walkers and tests prove `.tmp` exclusion.
- Handoff expectation: issue closeout with code/test evidence and bounded residual risk.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, `.agents/core/*`, `.codex/context/*`, `LUC-1838` follow-up notes | Integration, task closure, source-of-truth updates | Task packet and final acceptance | Focused node tests | DONE |
| Product/Requirements | intentionally omitted | issue is technical repair only | none | none | none | OMITTED |
| Architecture | Active chat | `.agents/state/next-steps.md`, `.codex/context/TASK_BOARD.md` | known-state scanner boundaries | exclusion rule aligned across refresh chain | code + tests | DONE |
| Implementation | Active chat | `scripts/*` | known-state walkers and tests | `.tmp` excluded from scans | focused node tests | DONE |
| QA/Test | Active chat | script tests | focused regression coverage | passing tests | DONE |
| Security/Ops/UX | intentionally omitted | no auth/runtime/deploy/UX behavior change | none | none | none | OMITTED |
| Documentation/Memory | Active chat | `.codex/context/*`, `history/tasks/*` | task/state truth | durable issue-scoped trace | file diff | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was created or refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md`.
- [x] Process eval will be recorded in `.agents/state/agent-evals.md` if this is broad, repeated, partial, or subagent-heavy work.

## Context
`LUC-1838` proved that canonical known-state refresh outputs remained polluted by browser-profile artifacts created under repository `.tmp/`, including Chrome extension files from local browser-proof runs. The refresh chain stayed otherwise usable, so the safe repair is to exclude `.tmp` from repository walkers that feed known-state outputs.

## Goal
Exclude repository `.tmp` browser-proof artifacts from known-state scanners so architecture-awareness/project-index/static-scan refreshes stop indexing transient CDP profile content.

## Success Signal
- User or operator problem: known-state actionable rows should not point at `.tmp/.../Default/Extensions/...`.
- Expected product or reliability outcome: known-state refresh becomes trustworthy again for routing and backlog classification.
- How success will be observed: repository walkers used by known-state ignore `.tmp`, and regression tests cover the exclusion.
- Post-launch learning needed: no

## Deliverable For This Stage
Implemented ignore-rule repair, regression tests, and durable task/state evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Known-state repository walkers exclude `.tmp` browser-proof artifacts.
- [x] Focused regression tests prove `.tmp` is ignored.
- [x] Project state/task board/task artifact record the issue-scoped repair.

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
- Tests: `node --test scripts/buildProjectIndex.test.mjs scripts/runV1StaticIssueScan.test.mjs scripts/auditArchitectureGraphDrift.test.mjs`
- Manual checks: code review of all known-state walkers touched by `ops:project:known-state`
- Screenshots/logs: not applicable
- High-risk checks: not applicable
- Module confidence ledger updated: not applicable
- Module confidence rows closed or changed: not applicable
- Requirements matrix updated: not applicable
- Requirement rows closed or changed: not applicable
- Quality scenarios updated: not applicable
- Quality scenario rows closed or changed: not applicable
- Risk register updated: not applicable
- Risk rows closed or changed: not applicable
- Reality status: verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `.agents/core/project-memory-index.md`, `.codex/context/TASK_BOARD.md`, `.agents/state/next-steps.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none beyond state/task trace

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the three ignore-rule additions if they over-filter, though tests show only transient `.tmp` scope changed
- Observability or alerting impact: none
- Staged rollout or feature flag: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `LUC-1838` found `architecture-awareness` polluted by `.tmp/.../Default/Extensions/...`.
- Gaps: known-state walkers ignored `tmp` but not `.tmp`.
- Inconsistencies: browser-proof helpers create repo `.tmp` directories while scanner filters skipped only non-dot temp roots.
- Architecture constraints: fix scanner boundaries only; no product/runtime behavior change.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none required
- Sources scanned: `AGENTS.md`, `.agents/core/*`, `.agents/state/next-steps.md`, `.codex/context/TASK_BOARD.md`, relevant `scripts/*`
- Rows created or corrected: task packet plus state updates
- Assumptions recorded: `.tmp` is transient browser-proof scratch space and not canonical product truth
- Blocking unknowns: none
- Why it was safe to continue: scope is narrow, code-local, and backed by the prior issue finding

### 2. Select One Priority Mission Objective
- Selected task: exclude `.tmp` from known-state graph refresh walkers
- Priority rationale: current architecture-awareness actionable rows are untrustworthy until this is repaired
- Why other candidates were deferred: rerunning the full baseline and source-control closure are separate follow-up lanes

### 3. Plan Implementation
- Files or surfaces to modify: `scripts/buildProjectIndex.mjs`, `scripts/runV1StaticIssueScan.mjs`, `scripts/auditArchitectureGraphDrift.mjs`, focused tests, task/state files
- Logic: add `.tmp` to ignored directory boundaries anywhere known-state walkers recurse through repo content
- Edge cases: do not exclude legitimate `tmp` fixtures in tests or non-recursive explicit output paths

### 4. Execute Implementation
- Implementation notes: added `.tmp` ignore guards to project-index, static-scan, and graph-drift walkers; extended fixture tests to prove `.tmp` files are skipped

### 5. Verify and Test
- Validation performed: `node --test scripts/buildProjectIndex.test.mjs scripts/runV1StaticIssueScan.test.mjs scripts/auditArchitectureGraphDrift.test.mjs`
- Result: pass

### 6. Self-Review
- Simpler option considered: only patch one scanner; rejected because `ops:project:known-state` chains multiple walkers and would stay partially polluted
- Technical debt introduced: no
- Scalability assessment: low-risk; keeps future browser-proof scratch roots out of multiple refresh stages
- Refinements made: aligned ignore behavior across the refresh chain rather than leaving inconsistent directory rules

### 7. Update Documentation and Knowledge
- Docs updated: issue-scoped task packet
- Context updated: `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`
- Learning journal updated: not applicable.

## Review Checklist (mandatory)
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
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
