# Task

## Header
- ID: AUDIT-HANDOFF-ROLLUP-SUMMARY-PARITY-2026-05-19
- Title: Validate handoff rollup summary parity
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-ROLLUP-MARKDOWN-SUMMARY-PARITY-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-AUDIT-031`, `REQ-FUNC-021`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-HANDOFF-ROLLUP-SUMMARY-PARITY`
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
- [x] The task improves future audit handoff trust without changing runtime behavior.

## Mission Block
- Mission objective: prevent reusable audit handoff rollup-summary drift.
- Release objective advanced: future agents can resume from the handoff without stale rollup summary counts.
- Included slices: handoff JSON source link, handoff summary metadata, validator rule, regression tests, tooling index docs, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: `audit:handoff:check` fails when handoff `rollupSummary` drifts from the referenced rollup JSON.

## Context

The reusable audit handoff JSON stores a compact `rollupSummary` for future resume work. The full rollup JSON is the canonical machine-readable source for those counts, but the handoff validator previously did not compare the two artifacts.

## Goal

Harden `audit:handoff:check` so it verifies handoff rollup summary keys and values against the referenced rollup JSON.

## Scope

- `docs/operations/full-reusable-audit-handoff-2026-05-19.md`
- `docs/operations/full-reusable-audit-handoff-2026-05-19.json`
- `scripts/checkFullReusableAuditHandoff.mjs`
- `scripts/checkFullReusableAuditHandoff.test.mjs`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.md`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: a future agent could resume from stale handoff summary counts even though the rollup JSON is correct.
- Expected reliability outcome: handoff and rollup summary counts stay aligned.
- How success will be observed: handoff validator fails when the handoff summary omits keys or drifts from rollup JSON.
- Post-launch learning needed: no.

## Deliverable For This Stage

A handoff validator that checks `rollupSummary` completeness and parity against the referenced rollup JSON.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Add `rollupJson` to handoff source-of-truth links.
2. Add the missing `currentFromPriorBaseline` handoff summary field.
3. Load referenced rollup JSON in the handoff CLI and compare summary values.
4. Add focused regression coverage for missing summary keys and stale counts.
5. Update tooling index purpose text and source-of-truth state.

## Acceptance Criteria
- [x] `audit:handoff:check` reports missing handoff rollup summary keys.
- [x] `audit:handoff:check` reports handoff/rollup summary mismatches.
- [x] Existing handoff source, risk, boundary, validation, and safety checks still pass.
- [x] Full audit verification remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for a no-secret audit tooling slice.
- [x] Relevant tests and guardrails pass.
- [x] Docs/state references are updated.
- [x] No production mutation, protected route call, LIVE mutation, or exchange-side mutation occurred.

## Validation Evidence
- Tests:
  - `corepack pnpm run audit:handoff:check:test`
  - `corepack pnpm run audit:handoff:check`
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed handoff `rollupSummary` keys against rollup JSON `summary`.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Cleanup checks: no `chrome-headless-shell` rows remained after final cleanup; no local `5432`/`6379` listeners were found and Docker had no running compose services.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Result Report

- Task summary: handoff validation now catches missing or stale handoff rollup summary counts.
- Files changed: handoff Markdown/JSON, handoff validator/test, tooling index Markdown/JSON, and source-of-truth state docs.
- How tested: focused handoff validator tests/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
