# Task

## Header
- ID: V1-OPERATOR-RUNBOOK-DYNAMIC-SHA-2026-05-10
- Title: Make final V1 operator runbooks use build-info as the deploy target
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: `V1-SLO-GATE2-NOAUTH-PROBE-2026-05-10`
- Priority: P0
- Iteration: 62
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The final V1 runbooks were repeatedly updated after docs/evidence deploys
because they contained a fixed `expectedSha`. That creates churn and can
confuse operators. Build-info is already the accepted production deploy truth,
so the operator runbooks should derive `$expectedSha` from production
build-info immediately before protected evidence collection.

## Goal
Update the final V1 operator runbooks to use production build-info as the
default `$expectedSha` source while preserving the ability to enforce a
specific intended runtime candidate when needed.

## Scope
- `history/plans/v1-final-blocker-execution-pack-2026-05-07.md`
- `history/releases/v1-operator-unblock-checklist-2026-05-10.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.agents/state/current-focus.md`
- `.agents/state/next-steps.md`
- `.agents/state/system-health.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: runbooks should not require a new commit every time
  docs-only evidence deploys.
- Expected product or reliability outcome: protected V1 evidence targets the
  live deployed build-info SHA by default.
- How success will be observed: runbooks show a PowerShell build-info read
  step that sets `$expectedSha`.
- Post-launch learning needed: no

## Deliverable For This Stage
Updated no-secret operator runbook/checklist and synchronized source-of-truth
status.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it
- do not run live-money or destructive production actions
- do not record secrets or protected payloads

## Implementation Plan
1. Replace fixed default `$expectedSha` setup in final blocker runbook with a
   production build-info read.
2. Apply the same pattern to the operator unblock checklist.
3. Preserve instructions for an explicit intended runtime candidate.
4. Sync source-of-truth files.
5. Run docs-only validation.

## Acceptance Criteria
- [x] Operator flow derives `$expectedSha` from production build-info by
  default.
- [x] Operator flow still supports an explicit intended candidate check.
- [x] No protected values are added.
- [x] Source-of-truth files are synchronized.
- [x] Validation passes.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` constraints are satisfied for a docs/runbook
  release task.
- [x] No application runtime behavior changes.
- [x] Docs-only validation passes.
- [x] Residual protected evidence blockers remain explicit.

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
- accepting build-info as protected runtime proof

## Validation Evidence
- Tests:
  - `node scripts\repoGuardrails.mjs` -> PASS
  - `node scripts\checkDocsParity.mjs` -> PASS
  - `git diff --check` -> PASS with line-ending warnings only
- Manual checks:
  - Reviewed final blocker execution pack and operator checklist for no-secret
    build-info target flow.
- Screenshots/logs: not applicable.
- High-risk checks: no live-money, destructive, or protected-auth actions.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/operations/post-deploy-smoke-checklist.md`
  - `docs/operations/deployment-rollback-playbook.md`
  - `history/plans/v1-final-blocker-execution-pack-2026-05-07.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: not applicable
- Canonical visual target: not applicable
- Fidelity target: structurally_faithful
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
- Screenshot comparison pass completed: no
- Remaining mismatches: authenticated/admin UI clickthrough still blocked
- Required states: not applicable
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: not applicable

## Deployment / Ops Evidence
- Deploy impact: docs-only
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: no runtime change
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: fixed SHA targets age after every docs-only deploy.
- Gaps: protected V1 evidence still requires operator auth and sign-off.
- Inconsistencies: no code drift; runbook target style caused avoidable churn.
- Architecture constraints: build-info is deploy freshness truth, but not
  protected runtime proof.

### 2. Select One Priority Task
- Selected task: make operator runbooks use build-info as default target.
- Priority rationale: reduces repeat sync work and lowers operator error risk.
- Why other candidates were deferred: protected evidence still requires missing
  operator inputs.

### 3. Plan Implementation
- Files or surfaces to modify: runbooks and status docs only.
- Logic: read production `/api/build-info`, set `$expectedSha`, and optionally
  compare with a specific intended candidate.
- Edge cases: build-info freshness still cannot substitute for liveimport,
  rollback, RC, or UI protected evidence.

### 4. Execute Implementation
- Implementation notes: updated runbook setup commands and source-of-truth
  entries.

### 5. Verify and Test
- Validation performed: docs guardrails, docs parity, diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: update static SHA again.
- Technical debt introduced: no
- Scalability assessment: dynamic build-info target reduces future docs-only
  sync churn.
- Refinements made: kept explicit intended-candidate enforcement guidance.

### 7. Update Documentation and Knowledge
- Docs updated: yes.
- Context updated: yes.
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

## Notes
This task does not close any protected V1 blocker.

## Production-Grade Required Contract

Every required section is present. This is a docs/runbook task and has no
runtime vertical slice.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: operator executing final V1 protected evidence
- Existing workaround or pain: repeated static SHA sync after docs-only deploys
- Smallest useful slice: use build-info as default `$expectedSha`
- Success metric or signal: fewer stale target updates and safer operator flow
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## User Feedback Evidence
- `docs/governance/user-feedback-loop.md` reviewed: yes
- Feedback item IDs: user asked to continue toward V1 completion
- Feedback accepted: yes
- Feedback needs clarification: no
- Feedback conflicts: none
- Feedback deferred or rejected: none
- Active task changed by feedback: yes
- New task created from feedback: yes
- Design memory updated: not applicable
- Learning journal updated: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: final V1 release evidence execution
- SLI: deployed build-info SHA
- SLO: not applicable for docs-only runbook sync
- Error budget posture: not applicable
- Health/readiness check: not run in this docs-only task
- Logs, dashboard, or alert route: not changed
- Smoke command or manual smoke: not run in this docs-only task
- Rollback or disable path: no runtime change

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: documented existing build-info endpoint
- Endpoint and client contract match: not changed
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: docs validation

## AI Testing Evidence

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: public build-info metadata and no-secret runbook text
- Trust boundaries: build-info freshness vs protected runtime evidence
- Permission or ownership checks: not changed
- Abuse cases: accepting build-info as runtime proof, or running protected
  evidence against unintended deploy
- Secret handling: no secret values recorded
- Security tests or scans: not applicable
- Fail-closed behavior: existing protected blocker state preserved
- Residual risk: protected evidence still cannot run without operator auth

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: updated final V1 operator runbooks to derive `$expectedSha`
  from production build-info by default.
- Files changed: listed in Scope.
- How tested: docs guardrails, docs parity, diff check.
- What is incomplete: protected liveimport readback, rollback proof PASS, Gate
  2 authenticated SLO, RC approval, authenticated/admin UI clickthrough.
- Next steps: provide protected operator inputs and run the final blocker pack.
- Decisions made: build-info is the operator target selector, not a substitute
  for protected evidence.
