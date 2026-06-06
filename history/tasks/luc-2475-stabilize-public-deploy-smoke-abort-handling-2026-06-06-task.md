# Task

## Header

- ID: LUC-2475
- Title: Stabilize public deploy smoke abort handling
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2456](/LUC/issues/LUC-2456)
- Priority: P1
- Module Confidence Rows: Operations deploy smoke / public production health
- Requirement Rows: Public deploy smoke must diagnose transient aborts without
  masking real failures
- Quality Scenario Rows: Release smoke reliability and fail-closed behavior
- Risk Rows: Runner/network transient aborts can be misclassified as product
  health failures
- Iteration: 2026-06-06
- Operation Mode: TESTER
- Mission ID: LUC-2475-DEPLOY-SMOKE-ABORT-HANDLING-2026-06-06
- Mission Status: VERIFIED

## Process Self-Audit

- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the Test Automation issue scope.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed via active mission state.
- [x] Missing or template-like state tables were not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by reducing false abort ambiguity.

## Mission Block

- Mission objective: harden public deploy smoke abort diagnostics while
  preserving fail-closed endpoint behavior.
- Release objective advanced: public no-workers smoke evidence can distinguish
  transient runner/network aborts from persistent product-health failures.
- Included slices: script retry/diagnostics, focused tests, public read-only
  smoke proof, state/evidence update.
- Explicit exclusions: deploys, restarts, rollback, env/database/account
  mutation, secrets, protected smoke, exchange actions, live trading.
- Checkpoint cadence: one heartbeat.
- Stop conditions: focused tests pass and public smoke is classified.
- Handoff expectation: close [LUC-2475](/LUC/issues/LUC-2475) as done.

## Context

[LUC-2456](/LUC/issues/LUC-2456) saw two public no-workers smoke aborts with
the failing endpoint moving between runs. Direct probes immediately after were
green, so Test Automation needed to stabilize or explain
`scripts/deploySmokeCheck.mjs` abort handling.

## Goal

Add focused abort/timeout handling proof without hiding real endpoint,
readiness, or build-info failures.

## Success Signal

- User or operator problem: moving `This operation was aborted` failures made
  public smoke evidence ambiguous.
- Expected product or reliability outcome: transient runner/network aborts are
  retried once and labeled; persistent failures remain fail-closed.
- How success will be observed: focused tests prove retry and non-retry cases;
  public no-workers smoke passes or reports clear retry exhaustion.
- Post-launch learning needed: yes, watch future smoke rows for retry labels.

## Deliverable For This Stage

Implemented and verified script/test change plus durable LUC-2475 evidence.

## Constraints

- use existing script and test runner
- do not introduce a parallel smoke subsystem
- do not retry HTTP status failures or build SHA mismatches
- do not mutate production/runtime/protected resources

## Definition of Done

- [x] Abort/timeout errors receive explicit diagnostic text.
- [x] Transient aborts are retried once by default.
- [x] Real HTTP failures remain fail-closed without retry.
- [x] Focused tests and public read-only smoke evidence are recorded.

## Forbidden

- new smoke framework
- temporary bypasses
- hiding endpoint failures behind retries
- deployment or protected smoke mutation

## Validation Evidence

- Tests:
  - `node --test scripts/deploySmokeCheck.test.mjs` -> PASS (`2/2`).
  - `node --test scripts/releaseOpsScriptContracts.test.mjs scripts/deploySmokeCheck.test.mjs`
    -> PASS (`4/4`).
  - `pnpm run architecture:graph:drift:strict` -> PASS (`837/837`, `0`
    missing).
  - `pnpm run quality:guardrails` -> PASS.
- Manual checks:
  - public no-workers smoke against production current SHA -> PASS.
- Screenshots/logs: command output recorded in
  `history/evidence/luc-2475-deploy-smoke-abort-handling-2026-06-06.md`.
- High-risk checks: no secret/protected/runtime mutation performed.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable for this bounded test automation
  hardening; evidence captured in task/evidence files.
- Quality scenarios updated: not applicable beyond this task evidence.
- Risk register updated: not applicable beyond this task evidence.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed: `.agents/core/project-memory-index.md`,
  `docs/operations/post-deploy-smoke-checklist.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: post-deploy checklist updated with retry
  classification guidance.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: public smoke diagnostics only.
- Smoke steps updated: yes, `SMOKE_TRANSIENT_RETRIES` documented.
- Rollback note: revert `scripts/deploySmokeCheck.mjs` and
  `scripts/deploySmokeCheck.test.mjs` if retry diagnostics regress.
- Observability or alerting impact: smoke row output now records transient
  retry context.
- Staged rollout or feature flag: retry count can be set to `0` with
  `SMOKE_TRANSIENT_RETRIES=0`.

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issues: raw `AbortError` surfaced as ambiguous endpoint failure.
- Gaps: no focused regression for timeout retry/fail-closed status behavior.
- Inconsistencies: direct probes passed after moving abort failures.
- Architecture constraints: preserve existing deploy smoke command.

### 2. Select One Priority Mission Objective

- Selected task: stabilize public deploy smoke abort handling.
- Priority rationale: high-priority assigned [LUC-2475](/LUC/issues/LUC-2475).
- Why other candidates were deferred: scoped wake forbids switching issues.

### 3. Plan Implementation

- Files or surfaces to modify:
  - `scripts/deploySmokeCheck.mjs`
  - `scripts/deploySmokeCheck.test.mjs`
  - operational docs/evidence/state
- Logic: retry transient fetch abort/timeout/fetch failed errors only.
- Edge cases: HTTP 500 and build-info mismatches are not retried.

### 4. Execute Implementation

- Implementation notes: added `runCheckAttempt`, transient classification, and
  retry detail preservation.

### 5. Verify and Test

- Validation performed: focused tests, syntax checks, guardrails, and public
  no-workers smoke.
- Result: PASS.

### 6. Self-Review

- Simpler option considered: diagnostics only. Rejected because it would not
  stabilize transient runner aborts.
- Technical debt introduced: no.
- Scalability assessment: bounded to a small fixed retry count.
- Refinements made: async test harness so local HTTP targets can answer the
  child process.

### 7. Update Documentation and Knowledge

- Docs updated: post-deploy smoke checklist, task/evidence, project state.
- Context updated: yes.
- Learning journal updated: not applicable; the test harness issue was fixed
  immediately and was not a recurring project pitfall.

## Review Checklist

- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Result Report

- Task summary: deploy smoke now retries transient abort/timeout/fetch failures
  once by default and prints retry diagnostics; real endpoint failures remain
  fail-closed.
- Files changed:
  - `scripts/deploySmokeCheck.mjs`
  - `scripts/deploySmokeCheck.test.mjs`
  - `docs/operations/post-deploy-smoke-checklist.md`
  - `docs/architecture/relations/priority-test-links.csv`
  - state/evidence files for LUC-2475
- How tested: focused node tests, syntax checks, guardrails, public no-workers
  production smoke.
- What is incomplete: no protected smoke or deploy proof by design.
- Next steps: [LUC-2456](/LUC/issues/LUC-2456) should treat future recovered
  transient retry rows as runner instability; exhausted retries remain product
  smoke failures until direct probes prove otherwise.
- Decisions made: default retry count is one and configurable with
  `SMOKE_TRANSIENT_RETRIES`.
