# Task

## Header
- ID: AUDIT-TOOLING-INDEX-CLOSURE-COMMAND-CHECK-2026-05-19
- Title: Enforce required closure commands in audit tooling index
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-RERUN-PLAYBOOK-REMEDIATION-CLOSURE-SYNC-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-FUNC-021`, `REQ-AUDIT-031`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-TOOLING-INDEX-CLOSURE-HARDENING`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the implementation slice.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] Missing or template-like state tables were confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves audit repeatability without changing runtime behavior.

## Mission Block
- Mission objective: make the audit tooling index validator fail if required closure commands are missing.
- Release objective advanced: future audit tooling changes cannot silently weaken closure validation.
- Included slices: tooling index validator, regression test, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded tooling-hardening slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: keep `audit:tooling-index:check` in `audit:manifest:verify`.

## Context

The tooling index JSON already lists the required closure commands, but the tooling-index validator only checked that the closure command list was non-empty. That made the index weaker than the rerun playbook validator.

## Goal

Update `audit:tooling-index:check` so missing required closure commands fail validation.

## Scope

- `scripts/checkReusableAuditToolingIndex.mjs`
- `scripts/checkReusableAuditToolingIndex.test.mjs`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.md`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: future audit tooling changes might remove closure checks without failing validation.
- Expected reliability outcome: tooling index validation fails if manifest verification, remediation-plan validation, docs parity, guardrails, or diff check are absent.
- How success will be observed: tooling index check reports zero missing closure commands.
- Post-launch learning needed: no.

## Deliverable For This Stage

A stricter tooling-index validator with regression coverage for missing required closure commands.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Add required closure-command fragments to `checkReusableAuditToolingIndex.mjs`.
2. Fail validation when any required closure command is missing.
3. Add regression coverage for missing closure commands.
4. Run validation and update source-of-truth state.

## Acceptance Criteria
- [x] Tooling index validator requires `audit:manifest:verify`.
- [x] Tooling index validator requires `audit:remediation-plan:check`.
- [x] Tooling index validator requires docs parity, guardrails, and diff check.
- [x] Missing required closure commands fail focused regression tests.
- [x] Full audit verification remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for a no-secret audit tooling slice.
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
  - `corepack pnpm run audit:tooling-index:check:test`
  - `corepack pnpm run audit:tooling-index:check`
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed tooling index JSON closure commands.
- Screenshots/logs: not applicable.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: `SOAR-OPERATIONS-001`
- Requirements matrix updated: yes
- Requirement rows closed or changed: `REQ-FUNC-021`, `REQ-AUDIT-031`
- Quality scenarios updated: no
- Quality scenario rows closed or changed: not applicable
- Risk register updated: yes
- Risk rows closed or changed: `RISK-021`, `RISK-036`
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: project memory index, reusable audit tooling index, rerun playbook, remediation plan docs
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## UX/UI Evidence
- Design source type: not applicable
- Design source reference: not applicable
- Canonical visual target: not applicable
- Required states: not applicable
- Responsive checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: not applicable

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this docs/tooling commit
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: tooling index closure validation only checked that the list existed.
- Gaps: the index could lose required closure commands without failing `audit:tooling-index:check`.
- Inconsistencies: rerun playbook validation was stricter than tooling index validation.
- Architecture constraints: keep this local and evidence-scoped.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: tooling index, package scripts, rerun playbook validator, next steps, task board.
- Rows created or corrected: task/state entries for tooling-index closure hardening.
- Assumptions recorded: safe assumption that closure commands are command strings.
- Blocking unknowns: none for local tooling.
- Why it was safe to continue: no production, no secrets, no runtime behavior changes.

### 2. Select One Priority Mission Objective
- Selected task: tooling-index closure command hardening.
- Priority rationale: keeps reusable audit tooling self-checking while protected `AUD-19` execution remains blocked.
- Why other candidates were deferred: protected production evidence requires missing approved inputs.

### 3. Plan Implementation
- Files or surfaces to modify: tooling index validator/test and state files.
- Logic: closure list must contain required command fragments.
- Edge cases: missing remediation check, missing docs parity, missing guardrails.

### 4. Execute Implementation
- Implementation notes: added required closure fragments and focused negative test.

### 5. Verify and Test
- Validation performed: listed above.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave tooling index validator as list-nonempty.
- Technical debt introduced: no.
- Scalability assessment: future dated tooling indexes can be checked via `--index`.
- Refinements made: CLI output now reports missing closure command count.

### 7. Update Documentation and Knowledge
- Docs updated: tooling index, task board, project state, next steps, system health, project memory index, ledger/risk/requirements.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to the implementation slice.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced beyond the existing local validator pattern.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes

This task keeps the protected `AUD-19` state unchanged: production readiness remains blocked until approved protected evidence exists.

## Production-Grade Required Contract

- Goal: require closure-command validation in the audit tooling index.
- Scope: local docs/tooling only.
- Implementation Plan: closure fragments, validator failure, regression test, state sync.
- Acceptance Criteria: missing required closure commands fail validation and full audit verification remains green.
- Definition of Done: no-secret audit tooling done with evidence.
- Result Report: see below.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: future audit runner/operator
- Existing workaround or pain: tooling index required manual memory of required closure commands.
- Smallest useful slice: validator-enforced closure list.
- Success metric or signal: tooling index check reports zero missing closure commands.
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
- Critical user journey: audit tooling verification
- SLI: tooling index validation status
- SLO: closure validation remains PASS before audit closure
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

## AI Testing Evidence

Not applicable; no AI runtime behavior changed.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: public repository docs and local validation metadata
- Trust boundaries: no production/protected boundary crossed
- Permission or ownership checks: not applicable
- Abuse cases: stale or incomplete closure commands could create false confidence
- Secret handling: no secret values read, printed, or stored
- Security tests or scans: guardrails
- Fail-closed behavior: validator fails when required closure commands are missing
- Residual risk: real production readiness still blocked until approved protected evidence exists

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: tooling index validation now explicitly requires all audit closure commands.
- Files changed: tooling index validator/test, tooling index Markdown/JSON, and source-of-truth state docs.
- How tested: tooling index test/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
