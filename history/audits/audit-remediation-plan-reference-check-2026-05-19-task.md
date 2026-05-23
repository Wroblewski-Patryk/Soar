# Task

## Header
- ID: AUDIT-REMEDIATION-PLAN-REFERENCE-CHECK-2026-05-19
- Title: Harden audit remediation plan validation with reference checks
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-REMEDIATION-PLAN-CHECK-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-FUNC-021`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-REMEDIATION-PLAN-TOOLING`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the implementation slice.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by preventing broken remediation-plan evidence links.

## Mission Block
- Mission objective: harden remediation-plan validation so source/evidence references cannot silently rot.
- Release objective advanced: future audit reruns fail fast when the remediation plan points at missing evidence.
- Included slices: validator reference checks, regression test, state/context sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded tooling-hardening slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: `audit:remediation-plan:check` now reports checked/missing references.

## Context

The remediation plan validator already checked structure and safety boundaries. It did not yet verify that the Markdown source or primary evidence paths named in the JSON actually exist.

## Goal

Extend `audit:remediation-plan:check` with referenced-path existence checks and a regression test for missing evidence references.

## Scope

- `scripts/checkAuditRemediationPlan.mjs`
- `scripts/checkAuditRemediationPlan.test.mjs`
- source-of-truth state references

## Success Signal
- User or operator problem: future audit repair planning could drift if machine-readable evidence links point to missing files.
- Expected product or reliability outcome: missing remediation-plan references cause a failed validation.
- How success will be observed: remediation-plan check reports reference count and fails on missing references.
- Post-launch learning needed: no.

## Deliverable For This Stage

A focused validator hardening that checks remediation-plan source and primary evidence paths.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Add `exists` support to the remediation-plan validator.
2. Check `sourceMarkdown` and `primaryEvidence` references.
3. Print reference check counts in CLI output.
4. Add a regression test for missing referenced evidence.
5. Run validation and update source-of-truth state.

## Acceptance Criteria
- [x] `audit:remediation-plan:check` checks referenced evidence paths.
- [x] CLI output includes checked/missing reference counts.
- [x] Tests fail when a referenced evidence file is missing.
- [x] Full audit verification remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for a no-secret ops tooling slice.
- [x] Relevant tests and guardrails pass.
- [x] Docs/state references are updated.
- [x] No production mutation, protected route call, LIVE mutation, or exchange-side mutation occurred.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- secret capture
- production data mutation

## Validation Evidence
- Tests:
  - `corepack pnpm run audit:remediation-plan:check:test`
  - `corepack pnpm run audit:remediation-plan:check`
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed CLI output for reference count and missing reference count.
- Screenshots/logs: not applicable.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: `SOAR-OPERATIONS-001`
- Requirements matrix updated: yes
- Requirement rows closed or changed: `REQ-FUNC-021`
- Quality scenarios updated: no
- Quality scenario rows closed or changed: not applicable
- Risk register updated: yes
- Risk rows closed or changed: `RISK-021`, `RISK-036`
- Reality status: verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `.agents/core/project-memory-index.md`, `.agents/core/mission-control.md`, remediation plan/tooling docs
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## UX/UI Evidence (required for UX tasks)
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
- Remaining mismatches: not applicable
- Required states: not applicable
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: not applicable

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable; docs/tooling only
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: remediation-plan validator checked structure but not referenced path existence.
- Gaps: future reruns could pass while primary evidence links were stale.
- Inconsistencies: none found.
- Architecture constraints: keep production readiness evidence-scoped and fail-closed.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: next steps, task board, remediation plan, validator, validator tests.
- Rows created or corrected: task/state entries for validator hardening.
- Assumptions recorded: safe assumption that source/evidence references are repository-relative paths.
- Blocking unknowns: none for local tooling.
- Why it was safe to continue: no production, no secrets, no runtime behavior changes.

### 2. Select One Priority Mission Objective
- Selected task: remediation-plan reference validation.
- Priority rationale: hardens the newly added remediation-plan validator while protected production evidence remains blocked.
- Why other candidates were deferred: `AUD-19` protected execution requires missing approved inputs.

### 3. Plan Implementation
- Files or surfaces to modify: remediation-plan validator/test and source-of-truth state.
- Logic: collect `sourceMarkdown` and `primaryEvidence`, test existence, fail on missing paths.
- Edge cases: missing source file or missing primary evidence file.

### 4. Execute Implementation
- Implementation notes: reused existing path-check pattern from reusable audit tooling.

### 5. Verify and Test
- Validation performed: listed above.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave reference checks to manifest validation.
- Technical debt introduced: no.
- Scalability assessment: future dated plans can use `--plan` and get path checks automatically.
- Refinements made: exposed checked/missing reference counts in CLI output.

### 7. Update Documentation and Knowledge
- Docs updated: task board, project state, next steps, system health, ledger/risk/requirements.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist (mandatory)
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to the implementation slice.
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

This task does not change the current production readiness state. It keeps `AUD-19` blocked until approved protected production evidence exists.

## Production-Grade Required Contract

- Goal: make remediation plan evidence references checkable.
- Scope: local docs/tooling only.
- Implementation Plan: reference collection, path existence check, CLI output, regression test, state sync.
- Acceptance Criteria: remediation-plan validator fails on missing referenced evidence and full audit verification remains green.
- Definition of Done: no-secret ops tooling done with evidence.
- Result Report: see below.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: future audit runner/operator
- Existing workaround or pain: path drift required manual inspection.
- Smallest useful slice: validator path check.
- Success metric or signal: checked references reported and missing references fail validation.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## User Feedback Evidence
- `docs/governance/user-feedback-loop.md` reviewed: not applicable
- Feedback item IDs: not applicable
- Feedback accepted: not applicable
- Feedback needs clarification: no
- Feedback conflicts: none
- Feedback deferred or rejected: not applicable
- Active task changed by feedback: no
- New task created from feedback: no
- Design memory updated: not applicable
- Learning journal updated: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: audit rerun and repair planning
- SLI: audit remediation-plan validation command status
- SLO: local validation remains PASS before audit closure
- Error budget posture: not applicable
- Health/readiness check: not changed
- Logs, dashboard, or alert route: not changed
- Smoke command or manual smoke: `audit:manifest:verify`
- Rollback or disable path: revert this docs/tooling commit

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: not applicable
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes

## AI Testing Evidence (required for AI features)

Not applicable; no AI runtime behavior changed.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: public repository docs and local validation metadata
- Trust boundaries: no production/protected boundary crossed
- Permission or ownership checks: not applicable
- Abuse cases: stale evidence links could create false confidence
- Secret handling: no secret values read, printed, or stored
- Security tests or scans: guardrails
- Fail-closed behavior: validator fails on missing evidence references
- Residual risk: real production readiness still blocked until approved protected evidence exists

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: hardened remediation-plan validator with referenced-path existence checks.
- Files changed: remediation-plan validator/test plus source-of-truth state docs.
- How tested: remediation-plan test/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
