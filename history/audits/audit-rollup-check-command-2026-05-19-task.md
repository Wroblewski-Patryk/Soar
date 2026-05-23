# Task

## Header
- ID: AUDIT-ROLLUP-CHECK-COMMAND-2026-05-19
- Title: Add reusable full audit rollup validator
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-MANIFEST-SUMMARY-METADATA-CHECK-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-AUDIT-031`, `REQ-FUNC-021`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-ROLLUP-VALIDATION`
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
- [x] The task improves future audit rollup integrity without changing runtime behavior.

## Mission Block
- Mission objective: make the full reusable audit rollup JSON machine-checkable.
- Release objective advanced: future audit rollups cannot silently omit audit IDs, stale summary counts, source links, repair queue items, or safety boundaries.
- Included slices: rollup validator, regression tests, package scripts, tooling index, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: keep `audit:rollup:check` inside `audit:manifest:verify`.

## Context

The full reusable audit rollup JSON is a key source for future audit reruns. It had no dedicated validator, so summary counts, linked source artifacts, repair queue entries, or safety booleans could drift without failing automation.

## Goal

Add `audit:rollup:check` and include it in the primary audit verification bundle.

## Scope

- `scripts/checkFullReusableAuditRollup.mjs`
- `scripts/checkFullReusableAuditRollup.test.mjs`
- `package.json`
- `history/audits/reusable-audit-tooling-index-2026-05-19.md`
- `history/artifacts/reusable-audit-tooling-index-2026-05-19.json`
- `scripts/checkReusableAuditToolingIndex.mjs`
- `scripts/checkReusableAuditToolingIndex.test.mjs`
- source-of-truth state references

## Success Signal
- User or operator problem: future audit rollup could become stale while manifest checks still pass.
- Expected reliability outcome: rollup validation fails when audit coverage, summary counts, source paths, repair queue, or safety boundaries drift.
- How success will be observed: rollup check reports `PASS` with zero mismatches, missing paths, missing queue items, or unsafe booleans.
- Post-launch learning needed: no.

## Deliverable For This Stage

A reusable rollup validator, regression coverage, package scripts, and tooling-index registration.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Add `checkFullReusableAuditRollup.mjs`.
2. Add focused regression tests for missing audit IDs, stale summary counts, hybrid current/deferred wording, missing paths, missing repair queue items, and unsafe safety booleans.
3. Add package scripts and include the check/test in `audit:manifest:verify`.
4. Register the new commands in the reusable tooling index and validator.
5. Update source-of-truth state.

## Acceptance Criteria
- [x] `audit:rollup:check` validates the current rollup JSON.
- [x] `audit:rollup:check:test` covers negative cases.
- [x] `audit:manifest:verify` includes rollup tests and rollup validation.
- [x] Tooling index includes the new rollup commands.
- [x] Full audit verification remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for a no-secret audit tooling slice.
- [x] Relevant tests and guardrails pass.
- [x] Docs/state references are updated.
- [x] No production mutation, protected route call, LIVE mutation, or exchange-side mutation occurred.

## Validation Evidence
- Tests:
  - `corepack pnpm run audit:rollup:check:test`
  - `corepack pnpm run audit:rollup:check`
  - `corepack pnpm run audit:tooling-index:check:test`
  - `corepack pnpm run audit:tooling-index:check`
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed full reusable audit rollup JSON and tooling-index registration.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Result Report

- Task summary: full reusable audit rollup is now machine-checkable and part of the primary audit verification bundle.
- Files changed: rollup validator/test, package scripts, tooling index, and source-of-truth state docs.
- How tested: rollup test/check, tooling index test/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
