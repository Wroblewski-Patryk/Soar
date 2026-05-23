# Task

## Header
- ID: AUDIT-MANIFEST-SOURCE-CHAIN-PATH-CHECK-2026-05-19
- Title: Require manifest source-chain repository paths
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-MANIFEST-SOURCE-CHAIN-KEY-CHECK-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-FUNC-021`, `REQ-AUDIT-031`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-MANIFEST-SOURCE-CHAIN-HARDENING`
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
- [x] The task improves future audit manifest reliability without changing runtime behavior.

## Mission Block
- Mission objective: prevent reusable audit manifests from passing when required source-chain values are not repository paths.
- Release objective advanced: future audit reruns keep source-chain keys both present and resolvable.
- Included slices: manifest validator rule, regression test, tooling index docs, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: `audit:manifest:check` fails when required source-chain values are empty or non-repository paths.

## Context

The previous source-chain hardening required exact source-chain keys, but a
present key with an empty value or external URL would not be collected as a
repository path. That could let an incomplete source chain pass key validation.

## Goal

Harden `audit:manifest:check` so required source-chain keys must also contain
repository-relative paths from approved repository roots.

## Scope

- `scripts/checkReusableAuditManifest.mjs`
- `scripts/checkReusableAuditManifest.test.mjs`
- `history/audits/reusable-audit-tooling-index-2026-05-19.md`
- `history/artifacts/reusable-audit-tooling-index-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: future reusable audit manifests could keep required keys but replace values with empty or external paths.
- Expected reliability outcome: manifest validation fails if any required source-chain value is not a repository path.
- How success will be observed: manifest check reports zero invalid source-chain paths.
- Post-launch learning needed: no.

## Deliverable For This Stage

A stricter manifest validator with regression coverage for invalid required
source-chain path values.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Add validation for required source-chain repository path values.
2. Fail manifest validation when any required source-chain value is empty or non-repository.
3. Add focused regression coverage for invalid source-chain values.
4. Update tooling index purpose text and source-of-truth state.

## Acceptance Criteria
- [x] Manifest validator requires repository-path values for required source-chain keys.
- [x] Empty and external source-chain values fail focused regression tests.
- [x] Current manifest reports zero invalid source-chain paths.
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
  - `corepack pnpm run audit:manifest:check:test`
  - `corepack pnpm run audit:manifest:check`
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed manifest source-chain validation output and tooling index purpose text.
- Screenshots/logs: not applicable.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Cleanup checks: no `chrome-headless-shell` rows remained after final cleanup; no local `5432`/`6379` listeners were found and Docker had no running compose services.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: project memory index and reusable audit artifact manifest
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
- Issues: manifest source-chain key validation did not check that required values were repository paths.
- Gaps: a future manifest could include a required key with an empty string or external URL.
- Inconsistencies: source-chain keys were strict, but their required values were still tolerant.
- Architecture constraints: keep this local and evidence-scoped.

### 2. Select One Priority Mission Objective
- Selected task: manifest source-chain path hardening.
- Priority rationale: keeps the reusable audit manifest source chain durable while protected `AUD-19` execution remains blocked.
- Why other candidates were deferred: protected production evidence requires missing approved inputs.

### 3. Plan Implementation
- Files or surfaces to modify: manifest validator/test, tooling index docs, and state files.
- Logic: each required source-chain value must be a repository path under approved roots.
- Edge cases: empty strings and external URLs must fail even when the key exists.

### 4. Execute Implementation
- Added invalid source-chain path detection to the manifest validator.
- Added focused regression coverage for empty and external source-chain values.
- Updated tooling index purpose text and source-of-truth state references.

### 5. Verify And Test
- Focused manifest tests/check passed.
- Full audit manifest verification, docs parity, guardrails, and diff check passed.
- Final local cleanup checks were run.

### 6. Self-Review
- Architecture alignment: local reusable audit tooling only.
- Reuse: existing repository path helper reused.
- No workaround introduced: yes.
- No duplicated runtime logic introduced: yes.

### 7. Update Documentation And Knowledge
- Task board, project state, project memory index, system health, next steps, module confidence ledger, requirements matrix, and risk register were updated.

## Result Report

- Task summary: manifest validation now catches invalid required source-chain path values.
- Files changed: manifest validator/test, tooling index Markdown/JSON, this task record, and source-of-truth state docs.
- How tested: focused manifest tests/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
