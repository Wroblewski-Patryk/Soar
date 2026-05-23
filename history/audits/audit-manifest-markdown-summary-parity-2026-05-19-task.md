# Task

## Header
- ID: AUDIT-MANIFEST-MARKDOWN-SUMMARY-PARITY-2026-05-19
- Title: Validate manifest Markdown and JSON summary parity
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-TOOLING-INDEX-MARKDOWN-JSON-PARITY-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-AUDIT-031`, `REQ-FUNC-021`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-MANIFEST-SUMMARY-PARITY`
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
- [x] The task improves future audit manifest trust without changing runtime behavior.

## Mission Block
- Mission objective: prevent reusable audit manifest Markdown/JSON summary drift.
- Release objective advanced: future agents can trust the human-readable and machine-readable manifest summary pair.
- Included slices: manifest validator rule, regression test, tooling index docs, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: `audit:manifest:check` fails when the companion Markdown summary counts drift from JSON.

## Context

The reusable audit artifact manifest has a JSON summary and a Markdown "Current Summary" section. The validator checked JSON summary counts against audit rows, but it did not verify that the human-readable Markdown summary stayed aligned with JSON.

## Goal

Harden `audit:manifest:check` so it detects Markdown/JSON summary count drift when the Markdown companion exists.

## Scope

- `scripts/checkReusableAuditManifest.mjs`
- `scripts/checkReusableAuditManifest.test.mjs`
- `history/audits/reusable-audit-tooling-index-2026-05-19.md`
- `history/artifacts/reusable-audit-tooling-index-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: a future agent could read stale Markdown summary counts while JSON remains correct.
- Expected reliability outcome: Markdown and JSON manifest summaries stay aligned.
- How success will be observed: manifest validator fails when Markdown summary counts drift from JSON.
- Post-launch learning needed: no.

## Deliverable For This Stage

A manifest validator that checks companion Markdown summary counts when the Markdown file is available.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Load the companion Markdown file in the manifest CLI when it exists next to the JSON file.
2. Validate declared JSON summary counts against Markdown summary lines.
3. Add focused regression coverage for stale Markdown summary counts.
4. Update tooling index purpose text and source-of-truth state.

## Acceptance Criteria
- [x] `audit:manifest:check` reports Markdown summary mismatches.
- [x] Existing manifest JSON checks still pass.
- [x] Tooling index Markdown/JSON purpose text reflects summary parity checking.
- [x] Full audit verification remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for a no-secret audit tooling slice.
- [x] Relevant tests and guardrails pass.
- [x] Docs/state references are updated.
- [x] No production mutation, protected route call, LIVE mutation, or exchange-side mutation occurred.

## Validation Evidence
- Tests:
  - `corepack pnpm run audit:manifest:check:test`
  - `corepack pnpm run audit:manifest:check`
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed manifest Markdown/JSON summary labels.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Result Report

- Task summary: manifest validation now catches Markdown summary counts that drift from JSON.
- Files changed: manifest validator/test, tooling index Markdown/JSON, and source-of-truth state docs.
- How tested: focused manifest validator tests/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
