# Task

## Header
- ID: AUDIT-HANDOFF-CLEANUP-VALIDATION-COMMAND-2026-05-19
- Title: Require cleanup validation in reusable audit handoff
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-REMEDIATION-PLAN-CLEANUP-CHECK-COMMAND-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-FUNC-021`, `REQ-AUDIT-031`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-HANDOFF-CLEANUP-HARDENING`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the implementation slice.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement and risk rows were identified.
- [x] The task improves audit handoff repeatability without changing runtime behavior.

## Mission Block
- Mission objective: make the full reusable audit handoff validator fail if latest validation evidence omits required cleanup checks.
- Release objective advanced: future broad-audit handoffs stay honest about local validation cleanup.
- Included slices: handoff validator rule, regression test, tooling index docs, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: `audit:handoff:check` fails when `latestValidation` omits headless browser, local DB/Redis listener, or Docker compose cleanup evidence.

## Context

The reusable audit handoff already records cleanup evidence in `latestValidation`,
but the handoff validator only required core validation commands. Other audit
validators now enforce required cleanup checks, so handoff validation should
also catch drift when cleanup evidence disappears from the resume packet.

## Goal

Harden `audit:handoff:check` so the reusable audit handoff must include cleanup
validation evidence for headless browser processes, local DB/Redis listeners,
and Docker compose services.

## Scope

- `scripts/checkFullReusableAuditHandoff.mjs`
- `scripts/checkFullReusableAuditHandoff.test.mjs`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.md`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: future broad-audit handoffs could omit cleanup evidence and still pass validation.
- Expected reliability outcome: handoff validation fails if cleanup evidence is absent.
- How success will be observed: handoff check reports zero missing cleanup validation checks.
- Post-launch learning needed: no.

## Deliverable For This Stage

A stricter full-audit handoff validator with regression coverage for missing
cleanup validation evidence.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Add required cleanup-validation fragments to `checkFullReusableAuditHandoff.mjs`.
2. Fail validation when any required cleanup validation evidence is missing.
3. Add regression coverage for incomplete cleanup validation.
4. Update tooling index purpose text and source-of-truth state.

## Acceptance Criteria
- [x] Handoff validator requires headless browser cleanup evidence.
- [x] Handoff validator requires local `5432` and `6379` listener cleanup evidence.
- [x] Handoff validator requires Docker compose cleanup evidence.
- [x] Missing required cleanup validation fails focused regression tests.
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
  - `corepack pnpm run audit:handoff:check:test`
  - `corepack pnpm run audit:handoff:check`
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed current handoff JSON `latestValidation` cleanup evidence.
- Screenshots/logs: not applicable.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Cleanup checks: no `chrome-headless-shell` rows remained after final cleanup; no local `5432`/`6379` listeners were found and Docker had no running compose services.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: project memory index, full reusable audit handoff, reusable audit tooling index
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

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
- Issues: handoff validation required core validation commands but did not require cleanup evidence.
- Gaps: a future handoff could drop headless browser, local listener, or Docker cleanup evidence without failing `audit:handoff:check`.
- Inconsistencies: remediation-plan, rerun-playbook, and tooling-index validation were stricter than handoff validation.
- Architecture constraints: keep this local and evidence-scoped.

### 2. Select One Priority Mission Objective
- Selected task: handoff cleanup validation hardening.
- Priority rationale: keeps the resume packet honest while protected `AUD-19` execution remains blocked.
- Why other candidates were deferred: protected production evidence requires missing approved inputs.

### 3. Plan Implementation
- Files or surfaces to modify: handoff validator/test, tooling index docs, and state files.
- Logic: `latestValidation` must contain required cleanup evidence fragments.
- Edge cases: missing headless browser evidence, missing local listener evidence, missing Docker compose evidence.

### 4. Execute Implementation
- Changed validator to compute required cleanup validation gaps.
- Added focused regression coverage for incomplete cleanup validation evidence.
- Updated tooling index purpose text and source-of-truth state references.

### 5. Verify And Test
- Focused and broad audit tooling validation passed.
- Docs parity, guardrails, and diff check passed.
- Final local cleanup checks were run.

### 6. Self-Review
- Architecture alignment: local reusable audit tooling only.
- Reuse: existing validator/test patterns reused.
- No workaround introduced: yes.
- No duplicated runtime logic introduced: yes.

### 7. Update Documentation And Knowledge
- Task board, project state, project memory index, system health, next steps, module confidence ledger, requirements matrix, and risk register were updated.

## Result Report

- Task summary: handoff validation now catches missing required cleanup validation evidence.
- Files changed: handoff validator/test, tooling index Markdown/JSON, this task record, and source-of-truth state docs.
- How tested: focused handoff tests/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
