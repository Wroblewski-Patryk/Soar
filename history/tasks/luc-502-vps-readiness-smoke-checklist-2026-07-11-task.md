# Task

## Header
- ID: LUC-502
- Title: Convert production proof gaps into non-secret VPS readiness smoke checklist
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: LUC-342 protected input binding readiness closure
- Priority: P1
- Module Confidence Rows: deployment / production readiness
- Requirement Rows: production proof, protected release evidence
- Quality Scenario Rows: reliability, operability, security
- Risk Rows: production proof gap, secret exposure, rollback ambiguity
- Iteration: 2026-07-11
- Operation Mode: TESTER
- Mission ID: LUC-502-VPS-READINESS-SMOKE-CHECKLIST-2026-07-11
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the verification-heavy DRE task.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through source-state/search context.
- [x] `.agents/core/mission-control.md` was reviewed through active mission state.
- [x] Missing or template-like state tables were not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local document appearance.

## Mission Block
- Mission objective: create a non-secret operator checklist for VPS production
  readiness proof gaps.
- Release objective advanced: Soar production proof gaps are now executable as
  named smoke/readiness rows with pass/fail and owner boundaries.
- Included slices: DRE checklist, evidence packet, project state/task board
  update, focused validation.
- Explicit exclusions: deploy, push, restart, rollback, protected smoke,
  secret/account value readback, production mutation, LIVE trading mutation.
- Checkpoint cadence: single heartbeat closure.
- Stop conditions: raw secret exposure, required protected run, architecture
  mismatch, or validation failure.
- Handoff expectation: protected proof runner uses the checklist under a
  separate approved proof issue.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | DRE | LUC-502 wake payload, project state | task/evidence/status | closure packet | issue update | DONE |
| Ops | DRE | post-deploy smoke, release gate, Coolify guide | VPS readiness checklist | checklist rows | readback/test | DONE |
| Security | DRE within boundary | secrets/deploy evidence rules | secret-handling rules | no-secret constraints | secret scan | DONE |
| Documentation/Memory | DRE | project state/task board | docs/history/context | durable source truth | diff check | DONE |

## Context

LUC-342 resolved protected input binding readiness by name, but that did not
execute protected production proof. LUC-502 converts the remaining proof gaps
into an operator checklist that can be used by DRE/Ops, Security/Ops, or QA/Ops
without exposing secrets or confusing public smoke with protected acceptance.

## Goal

Add a non-secret VPS readiness smoke checklist that names proof rows,
protected input families, pass/fail rules, command flow, and evidence packet
requirements.

## Success Signal
- User or operator problem: production proof gaps were not yet an executable
  non-secret checklist.
- Expected product or reliability outcome: protected proof can proceed through
  clear VPS readiness rows.
- How success will be observed: checklist exists, is linked in evidence/state,
  and validation passes.
- Post-launch learning needed: no

## Deliverable For This Stage

Verified docs/evidence/state update only.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within docs/evidence scope

## Definition of Done
- [x] VPS readiness checklist added with non-secret protected input families.
- [x] Checklist includes pass/fail and fail-closed rules.
- [x] Evidence and project state updates capture boundary and residual risk.

## Stage Exit Criteria
- [x] The output matches the declared `verification` stage.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests: `corepack pnpm run ops:protected-inputs:check:test`.
- Manual checks: document readback; no-secret scan; `git diff --check`.
- Screenshots/logs: not applicable.
- High-risk checks: no secret values recorded; no production/protected runtime
  action executed.
- Module confidence ledger updated: not applicable; docs-only checklist.
- Requirements matrix updated: not applicable; no requirement status changed.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable; evidence records residual risk.
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: post-deploy smoke checklist, release gate
  runbook, Coolify VPS setup guide, protected input checker.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: yes, checklist-only operator guidance
- Rollback note: rollback proof remains separately gated
- Observability or alerting impact: checklist requires log-window hygiene
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: protected input binding by name is resolved, protected proof remains
  pending.
- Gaps: operator needed non-secret VPS readiness checklist.
- Inconsistencies: public smoke must not be accepted as protected proof.
- Architecture constraints: Coolify/VPS production topology and release gates
  already exist.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Sources scanned: project state, task board, operations docs, checker scripts.
- Rows created or corrected: none
- Assumptions recorded: checklist preparation does not authorize proof
  execution.
- Blocking unknowns: none for checklist creation.
- Why it was safe to continue: docs-only no-secret scope.

### 2. Select One Priority Mission Objective
- Selected task: LUC-502 checklist creation.
- Priority rationale: high-priority DRE issue assigned by wake payload.
- Why other candidates were deferred: scoped wake forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: operations checklist, history evidence/task,
  project state/task board.
- Logic: table-driven proof rows with fail-closed conditions.
- Edge cases: missing refs, stale artifacts, SHA mismatch, secret exposure.

### 4. Execute Implementation
- Implementation notes: added checklist and closure evidence without runtime
  mutation.

### 5. Verify and Test
- Validation performed: focused protected-input checker test, readback,
  secret-pattern scan, diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: append to existing post-deploy checklist only.
- Technical debt introduced: no
- Scalability assessment: checklist reuses existing commands and artifact
  families.
- Refinements made: separated public, input-readiness, protected proof, and
  release acceptance rows.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/operations/vps-production-readiness-smoke-checklist.md`.
- Context updated: `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to task risk.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal update was not required.
- [x] Required responsibility lanes were integrated.
