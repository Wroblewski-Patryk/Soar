# Task

## Header
- ID: AUDIT-MANIFEST-COMPARE-STATUS-BUCKET-CHECK-2026-05-19
- Title: Align manifest comparison status bucket semantics
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-ROLLUP-CHECK-COMMAND-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-AUDIT-031`, `REQ-FUNC-021`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-MANIFEST-COMPARE-SEMANTICS`
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
- [x] The task improves future audit comparison correctness without changing runtime behavior.

## Mission Block
- Mission objective: align manifest comparison status classification with manifest and rollup validators.
- Release objective advanced: future audit comparisons do not falsely regress current statuses that mention deferred sub-scope.
- Included slices: manifest comparison status ranking, regression tests, tooling index docs, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: keep leading status bucket semantics consistent across manifest check, rollup check, and manifest compare.

## Context

`audit:manifest:check` and `audit:rollup:check` classify audit status by leading bucket. `audit:manifest:compare` still used substring matching, so a status like `current foundation / hot-path assistant scope deferred` could be ranked as `deferred` in future comparisons.

## Goal

Update manifest comparison status ranking to use leading status buckets and add regression coverage for hybrid current statuses.

## Scope

- `scripts/compareReusableAuditManifests.mjs`
- `scripts/compareReusableAuditManifests.test.mjs`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.md`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: future manifest comparisons could report false regressions from non-leading words.
- Expected reliability outcome: only leading status bucket changes drive audit status regression/improvement.
- How success will be observed: compare tests pass for hybrid current/deferred and non-leading failed wording.
- Post-launch learning needed: no.

## Deliverable For This Stage

A manifest comparison command that uses leading status bucket semantics with regression coverage.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Update status ranking to use leading buckets: failed, decision required, partial, deferred, current.
2. Add regression coverage for current statuses with deferred sub-scope.
3. Add regression coverage for leading bucket regressions/improvements and non-leading failed wording.
4. Update tooling index docs and source-of-truth state.

## Acceptance Criteria
- [x] `current ... deferred` is compared as current.
- [x] Non-leading `failed` wording does not cause a regression.
- [x] Leading `deferred` still regresses from current.
- [x] Leading `partial` to current still records improvement.
- [x] Full audit verification remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for a no-secret audit tooling slice.
- [x] Relevant tests and guardrails pass.
- [x] Docs/state references are updated.
- [x] No production mutation, protected route call, LIVE mutation, or exchange-side mutation occurred.

## Validation Evidence
- Tests:
  - `corepack pnpm run audit:manifest:compare:test`
  - `corepack pnpm run audit:manifest:compare -- --base docs/operations/reusable-audit-artifact-manifest-2026-05-19.json --target docs/operations/reusable-audit-artifact-manifest-2026-05-19.json`
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed status ranking semantics against manifest and rollup validators.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Result Report

- Task summary: manifest comparison now uses leading status bucket semantics, matching manifest and rollup validators.
- Files changed: manifest compare command/test, tooling index Markdown/JSON, and source-of-truth state docs.
- How tested: manifest compare test/self-compare, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
