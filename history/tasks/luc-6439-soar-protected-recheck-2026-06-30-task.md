# Task

## Header
- ID: LUC-6439
- Title: Soar Protected Recheck
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: 09 DRE (Deployment & Reliability Engineer)
- Depends on: [LUC-241](/LUC/issues/LUC-241), [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P1
- Module Confidence Rows: Soar production protected smoke, Web availability,
  worker readiness, runtime freshness, rollback guard
- Requirement Rows: protected production workers readiness recheck
- Quality Scenario Rows: production readiness, reliability, fail-closed auth
- Risk Rows: production Web 503, protected worker readiness 503
- Iteration: 2026-06-30 DRE protected gate heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-6439-SOAR-PROTECTED-RECHECK-2026-06-30
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step was skipped.
- [x] Exactly one priority task was selected.
- [x] Operation mode matches this bounded DRE verification heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was represented through active
      Soar state/evidence ledgers for this heartbeat.
- [x] `.agents/core/mission-control.md` was represented through
      `.agents/state/active-mission.md`.
- [x] Missing or template-like state tables were not encountered.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by recording a current protected
      production gate fact.

## Mission Block
- Mission objective: run one read-only protected production recheck for
  [LUC-241](/LUC/issues/LUC-241) after a fresh gate fact from
  [LUC-2697](/LUC/issues/LUC-2697).
- Release objective advanced: protected workers readiness and runtime health
  evidence for Soar production.
- Included slices: auth binding shape, deploy smoke, runtime freshness,
  rollback guard.
- Explicit exclusions: deploy, push, restart, env edit, DB/Redis mutation,
  raw secret/account value readback, exchange/payment mutation, order,
  position, live-account mutation, live-trading action, full browser auth
  acceptance.
- Checkpoint cadence: single heartbeat.
- Stop conditions: protected smoke failure, unauthorized credential boundary,
  production mutation required, or completed evidence packet.
- Handoff expectation: block this issue if protected recheck fails; keep
  production restoration on the existing DRE/Ops owner path.

## Context
[LUC-6439](/LUC/issues/LUC-6439) was assigned as a narrow DRE gate recheck
under [LUC-241](/LUC/issues/LUC-241). The issue expected current smoke/auth
result, exact command path, timestamp, endpoint, and pass/fail reason. Recent
state already showed Soar production Web and workers readiness returning
`503` under [LUC-6331](/LUC/issues/LUC-6331).

## Goal
Verify whether current production protected workers readiness and adjacent
runtime rollback signals pass through the current DRE runtime without exposing
secret values or mutating production.

## Scope
- `GET https://api.soar.luckysparrow.ch/health`
- `GET https://api.soar.luckysparrow.ch/ready`
- `GET https://soar.luckysparrow.ch/`
- `GET https://soar.luckysparrow.ch/api/build-info`
- `GET https://api.soar.luckysparrow.ch/workers/ready`
- `GET https://api.soar.luckysparrow.ch/workers/runtime-freshness`
- `GET https://api.soar.luckysparrow.ch/alerts` through rollback guard
- Evidence/state files only.

## Implementation Plan
1. Read scoped Paperclip heartbeat context for [LUC-6439](/LUC/issues/LUC-6439).
2. Confirm auth-related env binding presence by name/length only.
3. Run production deploy smoke with protected workers readiness enabled.
4. Run runtime freshness and rollback guard with process-local fresh-login
   namespace mapping where required by script contracts.
5. Write task/evidence packet and update Soar state ledgers.
6. Post Paperclip closure with verification and residual risk.

## Acceptance Criteria
- Protected deploy smoke records pass/fail for `/workers/ready`.
- Runtime freshness records pass/fail.
- Rollback guard records `shouldRollback` and reason set.
- No secret values are written to files or comments.
- No production mutation, push, deploy, restart, or account mutation occurs.

## Definition of Done
- [x] Evidence packet records exact commands and outcomes.
- [x] State files record the blocked status and unblock owner path.
- [x] Paperclip issue is marked with final disposition and no false liveness
      path remains.

## Forbidden
- New systems or bypasses.
- Duplicated smoke logic.
- Architecture changes.
- Secret/account value readback.
- Deploy, push, restart, rollback execution, env edit, DB/Redis mutation,
  exchange/payment mutation, order, position, live-account mutation, or
  live-trading action.

## Validation Evidence
- Tests:
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
    FAIL: API `/health` and `/ready` passed; Web `/`, Web `/api/build-info`,
    and API `/workers/ready` returned `503`.
  - `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch`
    PASS after process-local `DEPLOY_FRESHNESS_*` mapping from `SMOKE_AUTH_*`.
  - `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
    FAIL after process-local `ROLLBACK_GUARD_*` mapping because
    `shouldRollback=true` with `workers_ready_endpoint_http_503`.
- Manual checks:
  - env binding shape names/lengths only.
- Screenshots/logs: not applicable; no browser proof.
- High-risk checks: no secret value printed; no mutation performed.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: yes.
- Reality status: blocked.

## Architecture Evidence
- Architecture source reviewed: existing Soar state and operations gate docs.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none; process-local mapping only for script namespace.
- Health-check impact: protected workers readiness currently fails.
- Smoke steps updated: no.
- Rollback note: rollback guard returned `shouldRollback=true`; rollback was
  not executed.
- Observability or alerting impact: rollback guard alerts `[]`.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: [LUC-6439](/LUC/issues/LUC-6439) scoped under blocked
  [LUC-241](/LUC/issues/LUC-241).
- Gaps: Web `/`, Web `/api/build-info`, and protected `/workers/ready` fail
  with `503`.
- Inconsistencies: runtime freshness and rollback scripts require separate
  protected env namespaces from deploy smoke.
- Architecture constraints: read-only DRE verification only.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: Paperclip heartbeat context, active mission/state, deploy
  gate, package script contracts.
- Rows created or corrected: none.
- Assumptions recorded: process-local namespace mapping is safe because it does
  not expose or persist values.
- Blocking unknowns: none for this issue.
- Why it was safe to continue: all actions were read-only and script-backed.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-6439](/LUC/issues/LUC-6439) protected recheck.
- Priority rationale: assigned high-priority DRE wake under release blocker.
- Why other candidates were deferred: scoped wake contract forbids switching.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state markdown only.
- Logic: no product logic change.
- Edge cases: namespace mismatch for protected runtime scripts.

### 4. Execute Implementation
- Implementation notes: no implementation beyond evidence and state updates.

### 5. Verify and Test
- Validation performed: deploy smoke, runtime freshness, rollback guard.
- Result: protected production recheck blocked by Web and worker readiness `503`.

### 6. Self-Review
- Simpler option considered: only `/workers/ready`; expanded slightly to
  runtime freshness and rollback guard because they are established adjacent
  DRE release signals and remained read-only.
- Technical debt introduced: no.
- Scalability assessment: existing scripts reused.
- Refinements made: separated auth namespace failures from the real readiness
  failure.

### 7. Update Documentation and Knowledge
- Docs updated: evidence/task/state files.
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
- [x] Docs or context were updated.
- [x] Learning journal was not required.
- [x] Required responsibility lanes were integrated.
- [x] Parent validation ran through protected smoke/runtime checks.

## Result Report

- Task summary: rechecked production protected workers readiness and adjacent
  runtime rollback signals.
- Files changed:
  - `history/evidence/luc-6439-soar-protected-recheck-2026-06-30.md`
  - `history/tasks/luc-6439-soar-protected-recheck-2026-06-30-task.md`
  - state/context ledgers updated with matching entry.
- How tested: protected deploy smoke failed on Web and workers readiness;
  runtime freshness passed; rollback guard failed with workers readiness `503`.
- What is incomplete: production Web and workers readiness restoration.
- Next steps: DRE/Ops restoration owner resolves [LUC-6331](/LUC/issues/LUC-6331),
  then DRE reruns this protected recheck.
- Decisions made: no deployment or source-control operation from this dirty
  shared checkout.
