# Task

## Header
- ID: AUDIT-ROLLUP-MARKDOWN-SUMMARY-PARITY-2026-05-19
- Title: Validate rollup Markdown and JSON summary parity
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-ROLLUP-MARKDOWN-AUDIT-ID-PARITY-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-AUDIT-031`, `REQ-FUNC-021`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-ROLLUP-SUMMARY-PARITY`
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
- [x] The task improves future audit rollup trust without changing runtime behavior.

## Mission Block
- Mission objective: prevent reusable audit rollup Markdown/JSON summary drift.
- Release objective advanced: future agents can compare the human-readable and machine-readable rollup summaries without recomputing table counts manually.
- Included slices: rollup Markdown summary, validator rule, regression test, tooling index docs, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: `audit:rollup:check` fails when the companion Markdown summary counts drift from JSON.

## Context

The full reusable audit rollup JSON stores summary counts, while the Markdown rollup previously listed audit rows without a machine-checkable summary block. That left a future reader with a human table but no checked summary parity against JSON.

## Goal

Add a Markdown summary block to the full reusable audit rollup and harden `audit:rollup:check` so it detects Markdown/JSON summary count drift.

## Scope

- `docs/operations/full-reusable-audit-rollup-2026-05-19.md`
- `scripts/checkFullReusableAuditRollup.mjs`
- `scripts/checkFullReusableAuditRollup.test.mjs`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.md`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: a future agent could trust stale rollup summary counts in Markdown while JSON remains correct.
- Expected reliability outcome: Markdown and JSON rollup summaries stay aligned.
- How success will be observed: rollup validator fails when Markdown summary counts drift from JSON.
- Post-launch learning needed: no.

## Deliverable For This Stage

A rollup Markdown summary and validator check that keep summary counts aligned with JSON.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Add explicit summary count bullets to the rollup Markdown.
2. Validate those Markdown bullets against JSON `summary` when the Markdown file exists.
3. Add focused regression coverage for stale Markdown summary counts.
4. Update tooling index purpose text and source-of-truth state.

## Acceptance Criteria
- [x] `audit:rollup:check` reports Markdown summary mismatches.
- [x] Existing rollup JSON checks still pass.
- [x] Tooling index Markdown/JSON purpose text reflects summary parity checking.
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
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed rollup Markdown summary labels and JSON summary keys.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Cleanup checks: no `chrome-headless-shell` rows remained after final cleanup; no local `5432`/`6379` listeners were found and Docker had no running compose services.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Result Report

- Task summary: rollup validation now catches Markdown summary counts that drift from JSON.
- Files changed: rollup Markdown, rollup validator/test, tooling index Markdown/JSON, and source-of-truth state docs.
- How tested: focused rollup validator tests/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
