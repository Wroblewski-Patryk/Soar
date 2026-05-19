# Task

## Header
- ID: AUDIT-RERUN-PLAYBOOK-BASELINE-PATH-VALUE-CHECK-2026-05-19
- Title: Require rerun baseline repository paths
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-MANIFEST-SAFETY-BOUNDARY-CHECK-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-FUNC-021`, `REQ-AUDIT-031`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-RERUN-PLAYBOOK-BASELINE-HARDENING`
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
- [x] The task improves future audit rerun reliability without changing runtime behavior.

## Mission Block
- Mission objective: prevent reusable audit rerun playbooks from passing with empty or external baseline paths.
- Release objective advanced: future audit reruns keep baseline artifacts resolvable from the repository.
- Included slices: rerun playbook validator rule, regression test, tooling index docs, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: `audit:rerun-playbook:check` fails when required baseline values are empty or non-repository paths.

## Context

The rerun playbook validator required baseline keys and checked that string
paths existed. An empty baseline value could resolve to the repository root,
and an external URL was not reported as an invalid repository baseline.

## Goal

Harden `audit:rerun-playbook:check` so required baseline values must be
repository-relative paths from approved repository roots.

## Scope

- `scripts/checkReusableAuditRerunPlaybook.mjs`
- `scripts/checkReusableAuditRerunPlaybook.test.mjs`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.md`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: future audit rerun playbooks could keep baseline keys but point them at empty or external values.
- Expected reliability outcome: rerun playbook validation fails if required baseline values are not repository paths.
- How success will be observed: rerun playbook check reports zero invalid baseline paths.
- Post-launch learning needed: no.

## Deliverable For This Stage

A stricter rerun playbook validator with regression coverage for invalid
baseline path values.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Add baseline repository-path validation to `checkReusableAuditRerunPlaybook.mjs`.
2. Fail rerun playbook validation when required baseline values are empty or non-repository paths.
3. Add focused regression coverage for invalid baseline values.
4. Update tooling index purpose text and source-of-truth state.

## Acceptance Criteria
- [x] Rerun playbook validator requires repository-path values for required baseline keys.
- [x] Empty and external baseline values fail focused regression tests.
- [x] Current rerun playbook reports zero invalid baseline paths.
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
  - `corepack pnpm run audit:rerun-playbook:check:test`
  - `corepack pnpm run audit:rerun-playbook:check`
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed rerun playbook baseline validation output and tooling index purpose text.
- Screenshots/logs: not applicable.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Cleanup checks: no `chrome-headless-shell` rows remained after final cleanup; no local `5432`/`6379` listeners were found and Docker had no running compose services.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: project memory index and reusable audit rerun playbook
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
- Issues: rerun playbook baseline validation did not reject empty or external baseline values.
- Gaps: a future playbook could keep baseline keys while making the baseline path non-repository.
- Inconsistencies: manifest source-chain values were stricter than rerun baseline values.
- Architecture constraints: keep this local and evidence-scoped.

### 2. Select One Priority Mission Objective
- Selected task: rerun playbook baseline path value hardening.
- Priority rationale: keeps future audit reruns anchored to repository artifacts while protected `AUD-19` execution remains blocked.
- Why other candidates were deferred: protected production evidence requires missing approved inputs.

### 3. Plan Implementation
- Files or surfaces to modify: rerun playbook validator/test, tooling index docs, and state files.
- Logic: required baseline values must be repository paths under approved roots.
- Edge cases: empty strings and external URLs must fail even when the key exists.

### 4. Execute Implementation
- Added invalid baseline path detection to the rerun playbook validator.
- Added focused regression coverage for empty and external baseline values.
- Updated tooling index purpose text and source-of-truth state references.

### 5. Verify And Test
- Focused rerun playbook tests/check passed.
- Full audit manifest verification, docs parity, guardrails, and diff check passed.
- Final local cleanup checks were run.

### 6. Self-Review
- Architecture alignment: local reusable audit tooling only.
- Reuse: existing repository path shape used from manifest validation.
- No workaround introduced: yes.
- No duplicated runtime logic introduced: yes.

### 7. Update Documentation And Knowledge
- Task board, project state, project memory index, system health, next steps, module confidence ledger, requirements matrix, and risk register were updated.

## Result Report

- Task summary: rerun playbook validation now catches invalid required baseline path values.
- Files changed: rerun playbook validator/test, tooling index Markdown/JSON, this task record, and source-of-truth state docs.
- How tested: focused rerun playbook tests/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
