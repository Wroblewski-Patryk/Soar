# Task

## Header
- ID: AUDIT-MANIFEST-SOURCE-CHAIN-EXACT-KEY-CHECK-2026-05-19
- Title: Require exact manifest source-chain keys
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-MANIFEST-SOURCE-CHAIN-PATH-CHECK-2026-05-19`
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
- Mission objective: prevent reusable audit manifests from passing with noncanonical source-chain keys.
- Release objective advanced: future audit reruns keep source-chain structure exact and comparable.
- Included slices: manifest validator rule, regression test, tooling index docs, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: `audit:manifest:check` fails when unexpected source-chain keys are present.

## Context

The manifest validator already requires source-chain keys and repository-path
values. It still allowed extra noncanonical keys, which could make future audit
manifests harder to compare and give hidden scratch fields the same apparent
standing as approved source-of-truth links.

## Goal

Harden `audit:manifest:check` so the source-chain key set is exact: no missing
keys and no unexpected keys.

## Scope

- `scripts/checkReusableAuditManifest.mjs`
- `scripts/checkReusableAuditManifest.test.mjs`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.md`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: future reusable audit manifests could add noncanonical source-chain keys and still pass.
- Expected reliability outcome: manifest validation fails if unexpected source-chain keys are present.
- How success will be observed: manifest check reports zero unexpected source-chain keys.
- Post-launch learning needed: no.

## Deliverable For This Stage

A stricter manifest validator with regression coverage for unexpected
source-chain keys.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Add unexpected source-chain key detection to `checkReusableAuditManifest.mjs`.
2. Fail manifest validation when noncanonical source-chain keys are present.
3. Add focused regression coverage for unexpected source-chain keys.
4. Update tooling index purpose text and source-of-truth state.

## Acceptance Criteria
- [x] Manifest validator requires the exact source-chain key set.
- [x] Unexpected source-chain keys fail focused regression tests.
- [x] Current manifest reports zero unexpected source-chain keys.
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
- Issues: manifest source-chain validation allowed unexpected keys.
- Gaps: a future manifest could add noncanonical scratch/source keys and still pass.
- Inconsistencies: required source-chain key presence was strict, but the key set was not exact.
- Architecture constraints: keep this local and evidence-scoped.

### 2. Select One Priority Mission Objective
- Selected task: exact manifest source-chain key hardening.
- Priority rationale: keeps the reusable audit manifest comparable while protected `AUD-19` execution remains blocked.
- Why other candidates were deferred: protected production evidence requires missing approved inputs.

### 3. Plan Implementation
- Files or surfaces to modify: manifest validator/test, tooling index docs, and state files.
- Logic: source-chain keys must match the canonical key set exactly.
- Edge cases: an extra repository-looking source-chain key must fail even if its path shape is valid.

### 4. Execute Implementation
- Added unexpected source-chain key detection to the manifest validator.
- Added focused regression coverage for unexpected source-chain keys.
- Updated tooling index purpose text and source-of-truth state references.

### 5. Verify And Test
- Focused manifest tests/check passed.
- Full audit manifest verification, docs parity, guardrails, and diff check passed.
- Final local cleanup checks were run.

### 6. Self-Review
- Architecture alignment: local reusable audit tooling only.
- Reuse: existing required source-chain key list reused.
- No workaround introduced: yes.
- No duplicated runtime logic introduced: yes.

### 7. Update Documentation And Knowledge
- Task board, project state, project memory index, system health, next steps, module confidence ledger, requirements matrix, and risk register were updated.

## Result Report

- Task summary: manifest validation now catches unexpected source-chain keys.
- Files changed: manifest validator/test, tooling index Markdown/JSON, this task record, and source-of-truth state docs.
- How tested: focused manifest tests/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
